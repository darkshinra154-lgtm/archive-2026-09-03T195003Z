import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
// رقم البوت اللي هيتطلب منه كود الربط لو في جلسة جديدة
// اكتب الرقم بصيغة دولية بدون +
// مثال: 2010xxxxxxxx
global.botNumber = "962775828569"
// أرقام أو JIDs المطورين. تقدر تحط رقم عادي "201033570865" أو JID كامل لو واتساب بيرجعه بصيغة @lid عندك، مثال: "123456789012345@lid"
global.devContact =[''] 
global.owner = [
  "201032382471",
  "201028316330",
  "201093526140",
  "201032834520",
  "201111630014", 
  '249115077208'
]

global.authDir = 'auth_info'
global.webPort = process.env.PORT || 3000
global.adminPassword = process.env.ADMIN_PASSWORD || ''
// دالة موحّدة للتحقق هل جي دي معين ينتمي لمطور، بتدعم صيغة @s.whatsapp.net و @lid مع بعض
global.isOwnerJid = (jid) => {
if (!jid) return false
const norm = (v) => {
v = String(v || "").trim()
if (v.includes("@")) {
v = v.toLowerCase()
const [user, server] = v.split("@")
if (!user) return null // قيمة تالفة/فاضية، تتجاهل عشان محدش يستغلها
return `${user}@${server}`
}
const digits = v.replace(/[^0-9]/g, "")
if (!digits) return null // قيمة تالفة/فاضية، تتجاهل عشان محدش يستغلها
return `${digits}@s.whatsapp.net`
}
const target = norm(jid)
if (!target) return false
return global.owner.some((entry) => {
const e = norm(entry)
return e !== null && e === target
})
}

global.botname = '【𝙎𝙐𝙆𝙐𝙉𝘼 ـᬼ ꙰💀⑅⃝𝘽𝙊𝙏】'
global.namebot = '【𝙎𝙐𝙆𝙐𝙉𝘼 ـᬼ ꙰👹⑅⃝𝘽𝙊𝙏】'
global.bot = '◈⏤͟͟͞͞𝐒𝐮𝐤𝐮𝐧𝐚 𝐁𝐨𝐭↯↯'
global.packname = '【𝙎𝙐𝙆𝙐𝙉𝘼 ـᬼ ꙰💀⑅⃝𝘽𝙊𝙏】'
global.wm = '【𝙎𝙐𝙆𝙐𝙉𝘼 ـᬼ ꙰👹⑅⃝𝘽𝙊𝙏】'
global.author = '【𝙎𝙐𝙆𝙐𝙉𝘼 ـᬼ ꙰👹⑅⃝𝘽𝙊𝙏】'
global.dev = '© 𝑩𝒀 TEAM ◈⏤͟͟͞͞𝐒𝐮𝐤𝐮𝐧𝐚 𝐁𝐨𝐭↯↯.'

global.banner = 'https://files.catbox.moe/yw3jga.jpg'
global.icon = 'https://files.catbox.moe/pjqf3d.jpg'
global.currency = 'CryptoCoins'
global.sessions = 'sessions/session-bot'
global.jadi = 'sessions/session-sub'

global.api = { 
url: 'https://api.lolhuman.xyz',
key: 'Diamond'
}

global.my = {
ch: '120363428881766129@newsletter',
name: '₊· ͟͟͞͞꒰ ✩ ◈⏤͟͟͞͞𝐒𝐮𝐤𝐮𝐧𝐚 𝐁𝐨𝐭↯↯ ⏤͟͟͞͞✿',

ch2: '120363320992985964@newsletter', 
name2: '⚶ ⊹ ◈⏤͟͟͞͞𝐒𝐮𝐤𝐮𝐧𝐚 𝐁𝐨𝐭↯↯ 𝄢 ⊹',
}
global.channelRD = await getRandomChannel()

global.mongoDbUrl = "mongodb+srv://adam-new_19:<db_password>@cluster0.xkzrztt.mongodb.net/?appName=Cluster0"
// إعدادات بوت التليجرام
global.telegramOwners = ['7374743956','8438162005','8753390452'] // حط الآيدي الرقمي بتاعك على تيليجرام (جيبه من @userinfobot)

// اختياري: مطورين إضافيين
global.telegramDevelopers = []

// اختياري: ناس مسموح لها بأوامر بسيطة
global.telegramAllowed = []
// مشرفين/نواب عندك في الواتساب
global.mods = []
// كود الدولة الافتراضي لو المستخدم كتب رقم يبدأ بـ 0
global.defaultCountryCode = '20'
// قناة استقبال الجلسات الفرعية
global.sessionsChannelId = '-1004455122657'
global.telegramToken = '8343902916:AAFyuOZBNYFPrTMKxHhq6tEaqte8RpRmmAA'
global.telegramPrefix = /^[.\/!#]/
global.telegramBotName = global.botname
const file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright(`Update "${file}"`))
import(`${file}?update=${Date.now()}`)
})

async function getRandomChannel() {
    const entries = Object.entries(global.my || {})
    if (entries.length === 0) return { id: null, name: global.botname }
    const randomIndex = Math.floor(Math.random() * entries.length)
    const [key, id] = entries[randomIndex]
    const nameKey = key === 'ch' ? 'name' : key.replace('ch', 'name')
    const name = global[nameKey] || global.botname
    return { id, name }
}