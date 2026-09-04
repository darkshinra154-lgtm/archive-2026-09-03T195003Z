import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile, readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { default as urlRegex } from 'url-regex-safe'

export default async function (m, conn = { user: {} }) {
  const botId = conn.user?.jid
  if (!botId) return

  const senderId = typeof m.sender === 'string' ? m.sender.split('@')[0] : null
  const chatId = typeof m.chat === 'string' ? m.chat : null
  const isFromBot = m.sender === botId

  if (!senderId || !chatId || isFromBot) return

  // ═══════════════════════════════════════════
  // 📊 1. جمع بيانات الشات (للسجل والملف النصي)
  // ═══════════════════════════════════════════
  const chatName = await conn.getName(m.chat) || (m.isGroup ? "جروب بدون اسم" : "شات خاص")
  const chatType = m.isGroup ? 'جروب (Group)' : 'خاص (Private)'
  
  let isBotAdmin = false
  if (m.isGroup) {
    try {
      const metadata = await conn.groupMetadata(m.chat)
      const botJid = conn.user.jid
      // البحث عن البوت في قائمة المشاركين (بيعتمد على الـ JID أو الـ LID)
      const botParticipant = metadata.participants.find(p => 
        p.id === botJid || (conn.user?.lid && p.lid === conn.user.lid)
      )
      isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin'
    } catch (e) {
      isBotAdmin = false
    }
  }

  // ═══════════════════════════════════════════
  // 📝 2. تحديث ملف السجل (JSON + TXT)
  // ═══════════════════════════════════════════
  const jsonFile = path.join(process.cwd(), 'chats_registry.json')
  const txtFile = path.join(process.cwd(), 'chats_registry.txt')
  
  let chatsData = {}
  try {
    if (existsSync(jsonFile)) {
      chatsData = JSON.parse(readFileSync(jsonFile, 'utf-8'))
    }
  } catch (e) {
    chatsData = {}
  }

  const chatEntry = {
    id: m.chat,
    name: chatName,
    type: chatType,
    isGroup: m.isGroup,
    isBotAdmin: isBotAdmin,
    lastSeen: new Date().toISOString()
  }
  
  const existing = chatsData[m.chat]
  // تحديث البيانات فقط لو في تغيير (عشان نوفر عمليات الكتابة على الديسك)
  if (!existing || 
      existing.name !== chatEntry.name || 
      existing.isBotAdmin !== chatEntry.isBotAdmin ||
      existing.lastSeen !== chatEntry.lastSeen) {
    
    chatsData[m.chat] = chatEntry
    
    try {
      writeFileSync(jsonFile, JSON.stringify(chatsData, null, 2))
      
      // توليد ملف_TXT بشكل منسق
      let txtContent = '═══════════════════════════════════════════\n'
      txtContent += '📋 سجل شاتات البوت (Chats Registry)\n'
      txtContent += '═══════════════════════════════════════════\n\n'
      
      const groups = Object.values(chatsData).filter(c => c.isGroup)
      const privates = Object.values(chatsData).filter(c => !c.isGroup)
      
      txtContent += `👥 الجروبات (${groups.length} جروب):\n`
      txtContent += '───────────────────────────────────────────\n'
      for (const g of groups) {
        txtContent += `📌 الاسم: ${g.name}\n`
        txtContent += `🆔 الـ ID: ${g.id}\n`
        txtContent += `👑 البوت أدمن: ${g.isBotAdmin ? 'نعم ✅' : 'لا ❌'}\n`
        txtContent += `🕒 آخر نشاط: ${g.lastSeen}\n`
        txtContent += '-------------------------------------------\n'
      }
      
      txtContent += `\n👤 الشاتات الخاصة (${privates.length} شات):\n`
      txtContent += '───────────────────────────────────────────\n'
      for (const p of privates) {
        txtContent += `📌 الاسم: ${p.name}\n`
        txtContent += `🆔 الـ ID: ${p.id}\n`
        txtContent += `🕒 آخر نشاط: ${p.lastSeen}\n`
        txtContent += '-------------------------------------------\n'
      }
      
      writeFileSync(txtFile, txtContent)
    } catch (err) {
      console.error('Error writing registry files:', err)
    }
  }

  // ═══════════════════════════════════════════
  // 🖨️ 3. طباعة الكونسول (للأوامر فقط لتجنب السبام)
  // ═══════════════════════════════════════════
  if (!m.text) return
  const isCommandPrefix = typeof m.text === 'string' && /^[\/.#+\-!]/.test(m.text.trim())
  if (!isCommandPrefix) return

  const senderName = globalThis.db?.data?.users?.[m.sender]?.name
    ? globalThis.db.data.users[m.sender].name
    : await conn.getName(m.sender) || "Desconocido"

  const messageType = m.mtype?.replace(/message$/i, '')
    ?.replace('audio', m.msg?.ptt ? 'PTT' : 'Audio')
    ?.replace(/^./, v => v.toUpperCase()) || 'Texto'

  const timeString = (m.messageTimestamp
    ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp))
    : new Date).toLocaleTimeString()

  const botType = botId === globalThis.conn?.user?.jid
    ? 'Principal/Owner'
    : 'Sub Bot'

  const filesize = (() => {
    const msg = m.msg || {}
    return msg.vcard?.length ||
      msg.fileLength?.low ||
      msg.fileLength ||
      msg.axolotlSenderKeyDistributionMessage?.length ||
      m.text?.length || 0
  })()

  const sizeUnit = ['', 'K', 'M', 'G', 'T'][Math.floor(Math.log(filesize || 1) / Math.log(1000))]
  const fileSizeDisplay = filesize > 0
    ? `${(filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)}${sizeUnit}B`
    : '0B'

  console.log(chalk.gray('\n┌────────────────────────────────────'))
  console.log(`${chalk.white('│ 🤖 Bot:')} ${chalk.cyan(botId.split('@')[0])} → ${chalk.yellow(botType)}`)
  console.log(`${chalk.white('│ ⏰ Hora:')} ${chalk.green(timeString)}`)
  if (m.messageStubType && m.text) {
    const stubName = WAMessageStubType[m.messageStubType] || `Evento: ${m.messageStubType}`
    console.log(`${chalk.white('│ 🎭 Evento:')} ${chalk.magenta(stubName)}`)
  }
  console.log(`${chalk.white('│ 👤 Usuario:')} ${chalk.blue(senderName)} (${senderId})`)
  
  // 🌟 إبراز بيانات الشات الجديدة
  console.log(`${chalk.white('│ 💬 Chat Name:')} ${chalk.greenBright.bold(chatName)}`)
  console.log(`${chalk.white('│ 🆔 Chat ID:')} ${chalk.yellow(chatId)}`)
  console.log(`${chalk.white('│ 🏷️ Chat Type:')} ${chalk.cyan(chatType)} ${m.isGroup ? (isBotAdmin ? chalk.green('[Bot is Admin 👑]') : chalk.red('[Bot is NOT Admin ❌]')) : ''}`)
  
  console.log(`${chalk.white('│ 📦 Tipo:')} ${chalk.cyanBright(messageType)}`)
  console.log(`${chalk.white('│ 📏 Tamaño:')} ${chalk.yellow(fileSizeDisplay)}`)
  console.log(`${chalk.white(`│ ⚡ Comando:`)} ${chalk.gray(m.text.trim().substring(0, 100))}`)
  console.log('└────────────────────────────────────\n')

  if (m.messageStubParameters?.length) {
    const list = await Promise.all(m.messageStubParameters.map(async jid => {
      const decoded = conn.decodeJid(jid)
      const name = await conn.getName(decoded) || "Desconocido"
      const phone = PhoneNumber('+' + decoded.replace('@s.whatsapp.net', '')).getNumber('international')
      return chalk.gray(`${phone}${name ? ' ~' + name : ''}`)
    }))
   // console.log(list.join(', '))
  }

  if (/document/i.test(m.mtype)) console.log(`Archivo: ${m.msg?.fileName || m.msg?.displayName || 'Document'}`)
  else if (/contact/i.test(m.mtype)) console.log(`Contacto: ${m.msg?.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg?.seconds || 0
    console.log(`${m.msg?.ptt ? 'PTT' : 'Audio'} | Duración: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`)
  }

  console.log()
}

const file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Archivo actualizado: 'lib/console.js'"))
})