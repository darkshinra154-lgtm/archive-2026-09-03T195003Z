/**
═══════════════════════════════════════════════════════
🧩 Plugin: SessionManager.js
📂 Category: Core / System
🤖 Bot: ${global.botname}
👑 Developer: آدم (Shadow)
🏷️ Rights: ${global.author}
📜 Description: إدارة جلسات الواتساب بدون بوت رئيسي أو فرعي
═══════════════════════════════════════════════════════
*/

import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import pino from 'pino'
import qrcode from 'qrcode'
import {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} from '@whiskeysockets/baileys'
import { makeWASocket } from './simple.js'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

globalThis.messageLogs = globalThis.messageLogs || {}
globalThis.conns = globalThis.conns || []

export class BotSession {
  constructor(manager, userId) {
    this.manager = manager
    this.userId = String(userId)
    this.sock = null
    this.isConnected = false
    this.isInitializing = false
    this.authPath = path.join(this.manager.authDir, this.userId)
    this.tgChatId = null
    this.webSocketId = null
    this.phoneNumber = null
    this.lastReconnectAt = 0
  }

  sendLog(message, type = 'info') {
    this.manager.log(this.userId, message, type)
  }

  sendConnectionStatus() {
    if (this.manager.io && this.webSocketId) {
      this.manager.io.to(this.webSocketId).emit('connection-status', {
        connected: this.isConnected,
        user: this.userId,
        phoneNumber: this.phoneNumber || null
      })
    }
  }

  async notifyTelegram(text) {
    if (!this.tgChatId || !this.manager.tgBot) return
    try {
      await this.manager.tgBot.sendMessage(this.tgChatId, text)
    } catch {
      try {
        await this.manager.tgBot.sendMessage(this.tgChatId, text.replace(/[*_`]/g, ''))
      } catch {}
    }
  }

  async notifyPairingCode(code) {
    const caption = `
⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰

🔑 كود الربط بتاعك:

${code}

1️⃣ افتح واتساب
2️⃣ روح للأجهزة المرتبطة
3️⃣ اختار الربط برقم الهاتف بدل الكود
4️⃣ ادخل الكود اللي فوق

⏳ الكود صالح لمدة قصيرة.

⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰
`.trim()

    await this.notifyTelegram(caption)

    if (this.manager.io && this.webSocketId) {
      this.manager.io.to(this.webSocketId).emit('pairing-code', code)
    }
  }

  async clearAuth() {
    try {
      if (await fs.pathExists(this.authPath)) {
        await fs.remove(this.authPath)
      }
    } catch (e) {
      this.sendLog(`فشل حذف الجلسة: ${e.message}`, 'error')
    }
  }

  attachHandler() {
    if (!this.sock || !this.manager.handlerModule?.handler) return

    try {
      this.sock.ev.removeAllListeners('messages.upsert')
    } catch {}

    const handlerFn = async (chatUpdate) => {
      try {
        for (const msg of chatUpdate.messages || []) {
          if (msg?.key?.id) {
            globalThis.messageLogs[msg.key.id] = msg
            const keys = Object.keys(globalThis.messageLogs)
            if (keys.length > 3000) {
              delete globalThis.messageLogs[keys[0]]
            }
          }
        }
      } catch {}

      try {
        await this.manager.handlerModule.handler.call(this.sock, chatUpdate)
      } catch (e) {
        console.error(`[SESSION ${this.userId}] Handler error:`, e.message)
      }
    }

    this.sock.handler = handlerFn
    this.sock.ev.on('messages.upsert', handlerFn)
  }

  async initialize(pairingNumber = null) {
    if (this.isInitializing) {
      this.sendLog('التهيئة شغالة بالفعل، استنى شوية.', 'info')
      return
    }

    if (this.isConnected && this.sock?.user) {
      this.sendLog('الجلسة متصلة بالفعل.', 'info')
      return
    }

    this.isInitializing = true

    try {
      await fs.ensureDir(this.authPath)

      if (this.sock) {
        try {
          this.sock.ev.removeAllListeners()
          this.sock.ws?.close?.()
        } catch {}
      }

      let version
      try {
        const res = await fetchLatestBaileysVersion()
        version = res.version
      } catch {
        version = undefined
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authPath)

      const sock = makeWASocket({
        version,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Ubuntu', 'Chrome'],
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: 'silent' })
          )
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        getMessage: async (key) => {
          const msg = globalThis.messageLogs?.[key.id]
          return msg?.message || { conversation: '' }
        },
        patchMessageBeforeSending: (message) => {
          const requiresPatch = !!(
            message.buttonsMessage ||
            message.templateMessage ||
            message.listMessage
          )

          if (requiresPatch) {
            return {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                  },
                  ...message
                }
              }
            }
          }

          return message
        }
      })

      this.sock = sock
      sock.sessionId = this.userId
      sock.isConnected = false

      this.attachHandler()

      sock.ev.on('creds.update', saveCreds)
      sock.ev.on('connection.update', update => this.onConnectionUpdate(update))

      if (pairingNumber && !sock.user) {
        await delay(3000)

        try {
          let code = await sock.requestPairingCode(String(pairingNumber).replace(/\D/g, ''))
          code = code?.match(/.{1,4}/g)?.join('-') || code
          this.sendLog(`🔑 Pairing Code: ${code}`, 'success')
          await this.notifyPairingCode(code)
        } catch (e) {
          this.sendLog(`❌ فشل طلب كود الربط: ${e.message}`, 'error')
          await this.notifyTelegram(`❌ فشل طلب كود الربط: ${e.message}`)
        }
      }

    } catch (e) {
      this.sendLog(`Initialization failed: ${e.message}`, 'error')
      setTimeout(() => this.initialize().catch(() => {}), 7000)
    } finally {
      this.isInitializing = false
    }
  }

  async onConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      this.manager.emitQr(this, qr)
    }

    const statusCode =
      lastDisconnect?.error?.output?.statusCode ||
      lastDisconnect?.error?.output?.payload?.statusCode

    if (connection === 'open') {
      this.isConnected = true
      this.sock.isConnected = true

      try {
        this.phoneNumber = jidNormalizedUser(this.sock.user.id).split('@')[0]
      } catch {}

      this.manager.registerConnection(this)
      this.sendLog('✅ تم الاتصال بالواتساب بنجاح.', 'success')
      this.sendConnectionStatus()

      await this.notifyTelegram(`
✅ الجلسة ${this.userId} اتصلت بنجاح.

📱 رقم الواتساب: ${this.phoneNumber || 'غير معروف'}
🤖 البوت: ${globalThis.botname || 'Sukuna Bot'}
`.trim())
    }

    if (connection === 'close') {
      this.isConnected = false
      if (this.sock) this.sock.isConnected = false

      this.manager.unregisterConnection(this)
      this.sendConnectionStatus()

      this.sendLog(`🔌 الاتصال اتقفل. كود: ${statusCode || 'غير معروف'}`, 'warning')

      const loggedOut =
        statusCode === DisconnectReason.loggedOut ||
        statusCode === 401

      if (loggedOut) {
        this.sendLog('⚠️ الجلسة اتسجل خروجها أو انتهت. هيتم حذفها.', 'error')
        await this.notifyTelegram('⚠️ الجلسة انتهت وتم حذفها. اربط من جديد.')
        await this.clearAuth()
        this.manager.sessions.delete(this.userId)
        return
      }

      const now = Date.now()
      if (now - this.lastReconnectAt < 3000) {
        await delay(5000)
      }

      this.lastReconnectAt = Date.now()
      this.sendLog('🔄 جاري إعادة الاتصال...', 'info')
      setTimeout(() => this.initialize().catch(() => {}), 5000)
    }
  }
}

export class SessionManager {
  constructor({ authDir = 'auth_info' } = {}) {
    this.authDir = authDir
    this.sessions = new Map()
    this.io = null
    this.tgBot = null
    this.handlerModule = null
  }

  setIO(io) {
    this.io = io
  }

  setTelegramBot(bot) {
    this.tgBot = bot
  }

  setHandler(handlerModule) {
    this.handlerModule = handlerModule
    for (const session of this.sessions.values()) {
      session.attachHandler()
    }
  }

  log(userId, message, type = 'info') {
    const entry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }

    console.log(chalk.cyan(`[${userId}]`), message)

    const session = this.sessions.get(userId)
    if (this.io && session?.webSocketId) {
      this.io.to(session.webSocketId).emit('console', entry)
    }
  }

  createSession(userId) {
    userId = String(userId)
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new BotSession(this, userId))
    }
    return this.sessions.get(userId)
  }

  getSession(userId) {
    return this.sessions.get(String(userId)) || null
  }

  setWebSocket(userId, socketId) {
    const session = this.createSession(userId)
    session.webSocketId = socketId
    session.sendConnectionStatus()
  }

  async loadExisting() {
    await fs.ensureDir(this.authDir)
    const dirs = await fs.readdir(this.authDir)

    for (const userId of dirs) {
      const credsPath = path.join(this.authDir, userId, 'creds.json')
      if (await fs.pathExists(credsPath)) {
        const session = this.createSession(userId)
        this.log(userId, '📦 جلسة موجودة، جاري التشغيل...', 'info')
        await session.initialize().catch(e => {
          this.log(userId, `فشل تشغيل الجلسة: ${e.message}`, 'error')
        })
        await delay(1500)
      }
    }
  }

  registerConnection(session) {
    if (!globalThis.conns) globalThis.conns = []

    if (!globalThis.conns.includes(session.sock)) {
      globalThis.conns.push(session.sock)
    }

    if (!globalThis.conn || !globalThis.conn?.user) {
      globalThis.conn = session.sock
    }

    if (this.io) {
      this.io.emit('total-active', globalThis.conns.length)
    }
  }

  unregisterConnection(session) {
    globalThis.conns = (globalThis.conns || []).filter(s => s !== session.sock)

    if (globalThis.conn === session.sock) {
      globalThis.conn = globalThis.conns[0] || null
    }

    if (this.io) {
      this.io.emit('total-active', globalThis.conns.length)
    }
  }

  getActiveSockets() {
    return [...this.sessions.values()]
      .filter(s => s.isConnected && s.sock)
      .map(s => ({
        sock: s.sock,
        sessionId: s.userId,
        phoneNumber: s.phoneNumber
      }))
  }

  async emitQr(session, qr) {
    if (this.io && session.webSocketId) {
      this.io.to(session.webSocketId).emit('qr', qr)
    }

    if (this.tgBot && session.tgChatId) {
      try {
        const buffer = await qrcode.toBuffer(qr, { scale: 8 })
        await this.tgBot.sendPhoto(session.tgChatId, buffer, {
          caption: `
🕸 امسح كود الربط ده من كاميرا واتساب

1️⃣ افتح واتساب
2️⃣ الأجهزة المرتبطة
3️⃣ ربط جهاز
4️⃣ امسح الكود

⏳ الكود بيتجدد تلقائيًا.
`.trim()
        })
      } catch {
        try {
          await this.tgBot.sendMessage(session.tgChatId, '⚠️ معرفتش ابعت صورة QR.')
        } catch {}
      }
    }
  }

  async notifyTelegram(chatId, text) {
    if (!this.tgBot || !chatId) return
    try {
      await this.tgBot.sendMessage(chatId, text)
    } catch {
      try {
        await this.tgBot.sendMessage(chatId, text.replace(/[*_`]/g, ''))
      } catch {}
    }
  }

  async clearSession(userId) {
    const session = this.sessions.get(String(userId))
    if (!session) return false

    try {
      if (session.sock) {
        await session.sock.logout().catch(() => {})
        session.sock.ws?.close?.()
      }
    } catch {}

    await session.clearAuth()
    this.unregisterConnection(session)
    this.sessions.delete(String(userId))

    return true
  }
}

export const sessionManager = new SessionManager({
  authDir: globalThis.authDir || 'auth_info'
})