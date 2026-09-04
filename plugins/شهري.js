const free = 15000
const prem = 50000
const MONTH = 30 * 24 * 60 * 60 * 1000 // شهر كامل

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let now = new Date().getTime()
  let last = user.lastclaim || 0

  let remainingTime = last + MONTH - now
  if (remainingTime > 0) {
    await m.react('⏳⃝⚡')
    throw `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🌙⃝⚡ *عـطـيـة الـشـهـر لا تـُكـرر*
⏳⃝⚡ *لـم يـحـن مـوعـدهـا بـعـد*
⏰⃝⚡ *الـمـتـبـقـي:* ${clockString(remainingTime)}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim()
  }

  // منح المكافأة الشهرية
  user.exp += isPrems ? prem : free
  user.lastclaim = now

  await m.react('✅')
  m.reply(
    `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🎁⃝⚡ *مـكـافـأة شـهـريـة*
✨⃝⚡ *صـبـرك أتـى ثـمـاره*
🆙⃝⚡ *الـنـقـاط:* +${isPrems ? prem : free} XP

✅ *تـم مـنـحـك الـمـكـافـأة بـنـجـاح*

 ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  ${global.namebot}𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`
  )
}

handler.help = ['monthly ⃝⚡']
handler.tags = ['econ ⃝🌙']
handler.command = ['شهري']

export default handler

function clockString(ms) {
  if (isNaN(ms) || ms < 0) return '0 أيام 0 ساعات 0 دقائق'
  let days = Math.floor(ms / (1000 * 60 * 60 * 24))
  let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${days} أيام ${hours} ساعات ${minutes} دقائق`
}