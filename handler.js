/**
 * ═══════════════════════════════════════════════════════
 * 🛡️ WHATSAPP HANDLER | هاندلر الواتساب المطور
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 🏷️ الحقوق: ${global.author}
 * 📜 الوصف: معالجة الرسائل والصلاحيات وتنفيذ الأوامر
 * ═══════════════════════════════════════════════════════
 */

import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'

const isNumber = x => typeof x === 'number' && !isNaN(x)

const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
  clearTimeout(this)
  resolve()
}, ms))

export async function handler(chatUpdate) {
  const conn = this
  conn.msgqueque = conn.msgqueque || []
  conn.uptime = conn.uptime || Date.now()

  if (!chatUpdate) return

  conn.pushMessage(chatUpdate.messages).catch(console.error)

  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return

  if (globalThis.db.data == null) await globalThis.loadDatabase()

  try {
    m = smsg(conn, m) || m
    if (!m) return
    

const __msgLockKey = `${m.chat || ''}:${m.id || m.key?.id || ''}`

globalThis.executedMsgs = globalThis.executedMsgs || new Map()

if (globalThis.executedMsgs.has(__msgLockKey)) return

globalThis.executedMsgs.set(__msgLockKey, Date.now())

setTimeout(() => {
  globalThis.executedMsgs.delete(__msgLockKey)
}, 120000).unref?.()

if (!conn.user?.jid) return

    globalThis.mconn = m
    m.exp = 0
if (!globalThis.conns) globalThis.conns = []

if (!globalThis.conns.includes(conn)) {
  globalThis.conns.push(conn)
}

if (!globalThis.conn || !globalThis.conn?.user) {
  globalThis.conn = conn
}
    try {
      const user = globalThis.db.data.users[m.sender]
      if (typeof user !== 'object') globalThis.db.data.users[m.sender] = {}

      const u = globalThis.db.data.users[m.sender]
      if (!('name' in u)) u.name = ''
      if (!('chocolates' in u)) u.chocolates = 0
      if (!('bank' in u)) u.bank = 0
      if (!('exp' in u)) u.exp = 0
      if (!('usedcommands' in u)) u.usedcommands = 0
      if (!('level' in u)) u.level = 0
      if (!('limit' in u)) u.limit = 100
      if (!('premium' in u)) u.premium = false
      if (!('registered' in u)) u.registered = false
      if (!('banned' in u)) u.banned = false
      if (!('afk' in u)) u.afk = -1
      if (!('language' in u)) u.language = 'ar'

      const chat = globalThis.db.data.chats[m.chat]
      if (typeof chat !== 'object') globalThis.db.data.chats[m.chat] = {}

      const c = globalThis.db.data.chats[m.chat]
      if (!('sWelcome' in c)) c.sWelcome = ''
      if (!('sBye' in c)) c.sBye = ''
      if (!('primaryBot' in c)) c.primaryBot = null
      if (!('welcome' in c)) c.welcome = true
      if (!('nsfw' in c)) c.nsfw = false
      if (!('alerts' in c)) c.alerts = true
      if (!('adminonly' in c)) c.adminonly = false
      if (!('antilinks' in c)) c.antilinks = true
      if (!('bannedGrupo' in c)) c.bannedGrupo = false
      if (!('events' in c)) c.events = false
      if (!('audios' in c)) c.audios = false
      if (!('simi' in c)) c.simi = false
      if (!isNumber(c.expired)) c.expired = 0

      const settings = globalThis.db.data.settings[conn.user.jid]
      if (typeof settings !== 'object') globalThis.db.data.settings[conn.user.jid] = {}

      const s = globalThis.db.data.settings[conn.user.jid]
      if (!('self' in s)) s.self = false
      if (!('botcommando' in s)) s.botcommando = 0
      if (!('restrict' in s)) s.restrict = false
      if (!('public' in s)) s.public = true
    } catch (err) {
      console.error(err)
    }

    if (typeof m.text !== 'string') m.text = ''

    const user = globalThis.db.data.users[m.sender]
    const chat = globalThis.db.data.chats[m.chat]
    globalThis.setting = globalThis.db.data.settings[conn.user.jid]

    const isOwner = globalThis.isOwnerJid ? globalThis.isOwnerJid(m.sender) : false
    const isMods = globalThis.isModsJid ? globalThis.isModsJid(m.sender) : isOwner

    if (globalThis.opts['queque'] && m.text && !isMods) {
      const queque = conn.msgqueque
      const time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        await delay(time)
      }, time)
    }

    if (m.isBaileys) return

    m.exp += Math.ceil(Math.random() * 10)

    if (user && !user.banned) {
      user.usedcommands += 1
    }

    let usedPrefix

    const groupMetadata = m.isGroup
      ? {
          ...(conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(() => null) || {}),
          ...(((conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(() => null) || {}).participants) && {
            participants: ((conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(() => null) || {}).participants || []).map(p => ({
              ...p,
              id: p.jid,
              jid: p.jid,
              lid: p.lid
            }))
          })
        }
      : {}

    const participants = ((m.isGroup ? groupMetadata.participants : []) || []).map(participant => ({
      id: participant.jid,
      jid: participant.jid,
      lid: participant.lid,
      admin: participant.admin
    }))

    const findParticipant = (list, targetJid) => {
      if (!targetJid) return null
      const target = conn.decodeJid(targetJid)
      return list.find(u =>
        conn.decodeJid(u.jid || '') === target ||
        (u.lid && conn.decodeJid(u.lid) === target)
      ) || null
    }

    const userGroup = (m.isGroup ? findParticipant(participants, m.sender) : null) || {}
    let botGroup = m.isGroup ? findParticipant(participants, conn.user.jid) : null

    if (m.isGroup && !botGroup) {
      try {
        const botContact = await conn.onWhatsApp(conn.user.jid).catch(() => null)
        const botLid = botContact?.[0]?.lid
        if (botLid) botGroup = findParticipant(participants, botLid)
      } catch {}
    }

    const isRAdmin = userGroup?.admin === 'superadmin' || false
    const isAdmin = isRAdmin || userGroup?.admin === 'admin' || false
    const isBotAdmin = !!botGroup?.admin

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')

    for (const name in globalThis.plugins) {
      const plugin = globalThis.plugins[name]
      if (!plugin || plugin.disabled) continue

      const __filename = join(___dirname, name)

      if (typeof plugin.all === 'function') {
        try {
          await plugin.all.call(conn, m, {
            chatUpdate,
            ___dirname,
            __filename,
            user,
            chat,
            setting: globalThis.setting
          })
        } catch (err) {
          console.error(err)
        }
      }

      const strRegex = (str) => String(str).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

      const pluginPrefix = plugin.customPrefix || conn.prefix || globalThis.prefix
      const prefixList = Array.isArray(pluginPrefix) ? pluginPrefix : [pluginPrefix]

      let match = [[], new RegExp('')]

      for (const prefix of prefixList) {
        const regex = prefix instanceof RegExp
          ? prefix
          : new RegExp(strRegex(String(prefix)))

        const executed = regex.exec(m.text)
        if (executed) {
          match = [executed, regex]
          break
        }
      }

      if (typeof plugin.before === 'function') {
        if (await plugin.before.call(conn, m, {
          match,
          conn,
          participants,
          groupMetadata,
          isOwner,
          isMods,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          chatUpdate,
          ___dirname,
          __filename,
          user,
          chat,
          setting: globalThis.setting
        })) {
          continue
        }
      }

      if (typeof plugin !== 'function') continue

      if ((usedPrefix = (match[0] || '')[0])) {
        const noPrefix = m.text.replace(usedPrefix, '')
        let [command, ...args] = noPrefix.trim().split(' ').filter(v => v)
        args = args || []
        let _args = noPrefix.trim().split(' ').slice(1)
        let text = _args.join(' ')
        command = (command || '').toLowerCase()

        const fail = plugin.fail || globalThis.dfail

        const isAccept = plugin.command instanceof RegExp
          ? plugin.command.test(command)
          : Array.isArray(plugin.command)
            ? plugin.command.some(cmd =>
                cmd instanceof RegExp
                  ? cmd.test(command)
                  : cmd === command
              )
            : typeof plugin.command === 'string'
              ? plugin.command === command
              : false

        globalThis.comando = command

        if (user?.banned && !isOwner && !isMods && !plugin.owner) {
          continue
        }

        const isVotOwn = isOwner || conn.user.jid === m.sender

        if (globalThis.setting.self) {
          const isModeration = isOwner || isAdmin || isRAdmin
          if (!isVotOwn && !isModeration) return
        }

        if (!isAccept) continue

        globalThis.db.data.settings[conn.user.jid].botcommando += 1
        m.plugin = name

        if (chat?.bannedGrupo && !isOwner && name !== 'grupo-mute.js') return

        if (chat?.adminonly && !isOwner && m.isGroup && !isAdmin) return

        // ═══ الصلاحيات الجديدة ═══
        if (plugin.owner && !isOwner) {
          fail('owner', m, conn)
          continue
        }

        if (plugin.mods && !isMods) {
          fail('mods', m, conn)
          continue
        }

        if (plugin.group && !m.isGroup) {
          fail('group', m, conn)
          continue
        }

        if (plugin.private && m.isGroup) {
          fail('private', m, conn)
          continue
        }

        if (plugin.admin && !isAdmin) {
          fail('admin', m, conn)
          continue
        }

        if (plugin.botAdmin && !isBotAdmin) {
          fail('botAdmin', m, conn)
          continue
        }

        if (plugin.registered && !user?.registered) {
          fail('register', m, conn)
          continue
        }

        if (plugin.premium && !user?.premium) {
          fail('premium', m, conn)
          continue
        }

        if (plugin.level && (user?.level || 0) < plugin.level) {
          fail('level', m, conn)
          continue
        }

        if (plugin.nsfw && !chat?.nsfw) {
          fail('nsfw', m, conn)
          continue
        }

        if (plugin.limit) {
          const cost = typeof plugin.limit === 'number' ? plugin.limit : 1
          if ((user?.limit || 0) < cost) {
            fail('limit', m, conn)
            continue
          }
          user.limit -= cost
        }

        m.isCommand = true
        m.exp += plugin.exp ? parseInt(plugin.exp) : 10

        let extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn,
          participants,
          groupMetadata,
          user,
          chat,
          setting: globalThis.setting,
          isOwner,
          isMods,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          chatUpdate,
          ___dirname,
          __filename
        }

        try {
          await plugin.call(conn, m, extra)
        } catch (err) {
          m.error = err
          console.error(err)
        } finally {
          if (typeof plugin.after === 'function') {
            try {
              await plugin.after.call(conn, m, extra)
            } catch (err) {
              console.error(err)
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    if (globalThis.opts['queque'] && m.text) {
      const quequeIndex = conn.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1) conn.msgqueque.splice(quequeIndex, 1)
    }

    if (globalThis.db?.data) {
      globalThis.db.data.stats = globalThis.db.data.stats || {}
      if (m?.plugin) {
        globalThis.db.data.stats[m.plugin] = (globalThis.db.data.stats[m.plugin] || 0) + 1
      }

      if (m?.sender && m.exp) {
        const u = globalThis.db.data.users[m.sender]
        if (u) u.exp += m.exp
      }
    }

    try {
      if (!globalThis.opts['noprint']) {
        await (await import('./lib/console.js')).default(m, conn)
      }
    } catch {}
  }
}

globalThis.dfail = (type, m, conn) => {
  const cmd = globalThis.comando || 'الأمر'
  const messages = {
    owner: `🕸 الأمر *${cmd}* لا يمكن تنفيذه إلا من قبل المطور.`,
    mods: `🕸 الأمر *${cmd}* لا يمكن تنفيذه إلا من قبل المشرفين.`,
    admin: `🕸 الأمر *${cmd}* لا يمكن تنفيذه إلا من قبل مسؤولي المجموعة.`,
    botAdmin: `🕸 الأمر *${cmd}* لا يمكن تنفيذه إلا إذا كان البوت مسؤولاً في المجموعة.`,
    group: `🕸 الأمر *${cmd}* يشتغل داخل المجموعات فقط.`,
    private: `🕸 الأمر *${cmd}* يشتغل في الخاص فقط.`,
    register: `🕸 يجب التسجيل أولاً قبل استخدام الأمر *${cmd}*.`,
    premium: `🕸 الأمر *${cmd}* خاص بالأعضاء البريميم فقط.`,
    level: `🕸 الأمر *${cmd}* يحتاج مستوى أعلى.`,
    limit: `🕸 لا يوجد لديك حدود كافية لتنفيذ الأمر *${cmd}*.`,
    nsfw: `🕸 يجب تفعيل وضع NSFW في المجموعة أولاً.`
  }

  if (messages[type]) return m.reply(messages[type])
}