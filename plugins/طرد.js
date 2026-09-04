const handler = async (m, { conn, participants, usedPrefix, command }) => {
  let teks = `⌬──══─┈•⤣⚡⤤•┈─══──⌬
⚡ *أ مــر الـطـــرد* 👢⃝⚡
✅ *اسـتـخـدم الـأمـر كـالـتـالـي:*
⚡ ${usedPrefix + command} @مـنـشـن
⌬──══─┈•⤣⚡⤤•┈─══──⌬`

  // لا يوجد منشن ولا رد
  if (!m.mentionedJid[0] && !m.quoted) {
    await m.react('⚡')
    return m.reply(teks, m.chat, { mentions: conn.parseMention(teks) })
  }

  // منع طرد البوت
  if (m.mentionedJid.includes(conn.user.jid)) return

  // تحديد المستخدم
  const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

  try {
    await m.react('⏳')
    // تنفيذ الطرد
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

    // رسالة تأكيد
    let done = `⌬──══─┈•⤣⚡⤤•┈─══──⌬
👢⃝⚡ *تـم طـرد الـعـضـو بـنـجـاح*
👤⃝⚡ *الـمـسـتـخـدم:* @${user.split('@')[0]}
✅ *تـم الـتـنـفـيـذ بـواسـطـة الـنـظـام*
 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫ ${global.namebot} 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    await m.react('✅')
    conn.sendMessage(m.chat, { text: done, mentions: [user] }, { quoted: m })
  } catch (e) {
    await m.react('❌')
    m.reply('❌⃝❄ *تـعـذر طـرد الـعـضـو، قـد يـكـون مـشـرفـاً أو خـطـأ فـي الـصـلاحـيـات*')
  }
}

handler.command = /^(طرد|انطرو|طلعو|ارميه|شلوط)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler