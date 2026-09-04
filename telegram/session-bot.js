/**
═══════════════════════════════════════════════════════
🧩 Plugin: session-bot.js
📂 Category: Telegram / Pairing
🤖 Bot: ${global.botname}
👑 Developer: آدم (Shadow)
🏷️ Rights: ${global.author}
📜 Description: بوت تليجرام لربط جلسات الواتساب بدون بوت رئيسي
═══════════════════════════════════════════════════════
*/

import TelegramBot from 'node-telegram-bot-api'

export function startTelegramSessionBot(sessionManager) {
  const token = process.env.TELEGRAM_BOT_TOKEN || globalThis.telegramToken
  if (!token) {
    console.log('⚠️ TELEGRAM_BOT_TOKEN غير موجود، بوت تلي مش هيشتغل.')
    return null
  }

  const bot = new TelegramBot(token, {
    polling: {
      interval: 3000,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  })

  sessionManager.setTelegramBot(bot)

  const ownerIds = [
    ...(globalThis.telegramOwners || []),
    ...(globalThis.telegramDevelopers || []),
    process.env.OWNER_TELEGRAM_ID
  ]
    .filter(Boolean)
    .map(String)
    .filter(v => /^\d+$/.test(v))

  const isOwner = id => ownerIds.includes(String(id))

  bot.onText(/^\/start$/, async msg => {
    const text = `
⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰

🤖 منصة ربط ${globalThis.botname || 'Sukuna Bot'}

📌 عشان تربط واتساب:
أرسل رقم الواتساب بالصيغة الدولية بدون +

مثال:
2010xxxxxxxx

⚙️ أوامر:
/clearsession - مسح جلستك
/sessions - عرض الجلسات للمالك
/status - حالة النظام للمالك

⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰
`.trim()

    try {
      await bot.sendMessage(msg.chat.id, text)
    } catch {}
  })

  bot.onText(/^\/myid$/, async msg => {
    try {
      await bot.sendMessage(msg.chat.id, `🆔 آيديك: ${msg.from?.id || msg.chat.id}`)
    } catch {}
  })

  bot.onText(/^\/clearsession$/, async msg => {
    const userId = `tg_${msg.from?.id || msg.chat.id}`
    const ok = await sessionManager.clearSession(userId)

    try {
      if (ok) {
        await bot.sendMessage(msg.chat.id, '🗑️ تم مسح الجلسة. تقدر تربط من جديد.')
      } else {
        await bot.sendMessage(msg.chat.id, '⚠️ مفيش جلسة نشطة ليك.')
      }
    } catch {}
  })

  bot.onText(/^\/sessions$/, async msg => {
    if (!isOwner(msg.from?.id)) {
      return bot.sendMessage(msg.chat.id, '❌ الأمر ده للمالك فقط.').catch(() => {})
    }

    const sessions = [...sessionManager.sessions.values()]
    const lines = sessions.map(s => {
      return `- ${s.userId} | ${s.phoneNumber || 'Unknown'} | ${s.isConnected ? '✅' : '⏳'}`
    })

    const text = `
📊 الجلسات الحالية:

${lines.length ? lines.join('\n') : 'لا توجد جلسات.'}
`.trim()

    try {
      await bot.sendMessage(msg.chat.id, text)
    } catch {}
  })

  bot.onText(/^\/status$/, async msg => {
    if (!isOwner(msg.from?.id)) {
      return bot.sendMessage(msg.chat.id, '❌ الأمر ده للمالك فقط.').catch(() => {})
    }

    const active = sessionManager.getActiveSockets()

    const text = `
📡 حالة النظام

🤖 البوت: ${globalThis.botname || 'Sukuna Bot'}
👥 الجلسات النشطة: ${active.length}
📦 كل الجلسات: ${sessionManager.sessions.size}
`.trim()

    try {
      await bot.sendMessage(msg.chat.id, text)
    } catch {}
  })

  bot.onText(/^\/broadcast (.+)/, async (msg, match) => {
    if (!isOwner(msg.from?.id)) {
      return bot.sendMessage(msg.chat.id, '❌ الأمر ده للمالك فقط.').catch(() => {})
    }

    const message = match[1]
    const active = sessionManager.getActiveSockets()
    let totalSent = 0

    for (const { sock } of active) {
      try {
        const chats = Object.keys(sock.chats || {}).filter(jid =>
          jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')
        )

        for (const jid of chats) {
          try {
            await sock.sendMessage(jid, {
              text: `
📢 Broadcast

${message}

🤖 ${globalThis.botname || 'Sukuna Bot'}
`.trim()
            })
            totalSent++
          } catch {}
        }
      } catch {}
    }

    try {
      await bot.sendMessage(msg.chat.id, `✅ تم إرسال ${totalSent} رسالة.`)
    } catch {}
  })

  bot.on('message', async msg => {
    try {
      const text = msg.text || ''
      if (!text || text.startsWith('/')) return

      const digits = text.replace(/\D/g, '')
      if (digits.length < 8 || digits.length > 15) return

      const userId = `tg_${msg.from?.id || msg.chat.id}`
      const session = sessionManager.createSession(userId)
      session.tgChatId = msg.chat.id
      session.webSocketId = null

      await bot.sendMessage(msg.chat.id, `
⏳ جاري طلب كود الربط للرقم:

${digits}

استنى شوية...
`.trim())

      await session.initialize(digits)
    } catch (e) {
      console.error('Telegram message error:', e.message)
    }
  })

  bot.on('polling_error', error => {
    console.log('Telegram polling error:', error.message)

    if (String(error.message).includes('409')) {
      console.log('⚠️ في نسخة تانية من بوت التلي شغالة. إيقاف هذه النسخة.')
      bot.stopPolling()
    }

    if (String(error.message).includes('401')) {
      console.log('⚠️ توكن التليجرام غير صحيح.')
      bot.stopPolling()
    }
  })

  console.log('🤖 Telegram Session Bot is running.')
  return bot
}