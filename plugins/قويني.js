/*
 * ═══════════════════════════════════════════════════════
 * 🌑 OWNER HACK | مفتاح الكنوز السوكوني للمطور
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 🏷️ الحقوق: ${global.author}
 * 📜 الوصف: تحكم مطلق في داتابيز أي لاعب (شخصيات، أسلحة، دروع، معادن،
 *           فلوس، لفات، أصابع، مضاعفات، خلود) مع كل عناصر JJK الكاملة.
 * ═══════════════════════════════════════════════════════
 */

import { proto, prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { join, dirname } from 'path'
import fs from 'fs'

const MAX_SAFE = Number.MAX_SAFE_INTEGER
const INFINITY_VAL = 999999999999999

// ═══════════ 🩸 داتابيز JJK الكاملة (مدمجة من الـ RPG Engine) ═══════════
const JJK_CHARS = [
    'سوكونا', 'سوكونا الكامل', 'سوكونا الهياني', 'غوجو', 'يوتا',
    'تشوسو', 'ماهيتو', 'جوجو', 'داجون', 'هانامي', 'كينجاكو',
    'يوكي', 'ماكي', 'توجي', 'كاشيمو', 'اورامي', 'تنجن',
    'ميغومي', 'ايتادوري', 'هاكاري', 'هيجوروما', 'تودو',
    'اينوماكي', 'ميكامارو', 'تاكاكو اورو', 'ريو ايشيغوري',
    'يوروزو', 'نوريتوشي', 'كوساكابي', 'مي مي', 'باندا',
    'ميوا', 'مومو', 'تاكابا', 'اينو', 'جاكوجانجي',
    'ايسو', 'كيتشيزو', 'كوروروشي', 'ريجي', 'تشارلز', 'هازينوكي'
]

const WEAPONS_ALL = [
    'كاموتوكي', 'هيتن', 'كاتانا شق الروح', 'رمح السماء المعكوس',
    'السحابة المرحة', 'عظم التنين', 'سيف الجلاد',
    'كاتانا ملعونة متقدمة', 'رمح ملعون', 'قوس ملعون',
    'نصل ملعون أساسي', 'كاتانا مقواة',
    'كاتانا ريكا', 'عصا كاشيمو', 'فأس المعركة',
    'القيثارة الكهربائية', 'المكنسة الطائرة',
    'سيف التفكيك الملعون', 'نصل الصقيع الهادئ', 'جارودا',
    'انفجار الجرانيت', 'قوس الدم', 'كاتانا الباتو',
    'مدفع ميكامارو الأقصى', 'جناح الملك', 'المعدن السائل',
    'سيف الحياة المتقيح', 'عصا الحرب G', 'قبضة الروح'
]

const SHIELDS_ALL = [
    'درع ملك اللعنات', 'درع الدرجة الخاصة',
    'درع ملعون من الدرجة الأولى', 'درع الظلال',
    'سترة ملعونة أساسية', 'درع ملعون مقوى',
    'حاجز المذبح الشرير', 'درع الفراغ اللانهائي',
    'حاجز حديقة الظلال', 'درع التجسيد الذاتي',
    'حاجز الأفق الآسر', 'درع حقل الأزهار',
    'حاجز وفرة الرحم', 'حاجز الجاكبوت',
    'درع نواة الغوريلا', 'كاسر الجليد الرقيق',
    'درع الضحك', 'قناع الوحوش المباركة',
    'درع التعفن', 'درع الانفجار', 'درع الإيصالات',
    'درع الحاجز الأبدي', 'حاجز التنجن'
]

const MINERALS_ALL = [
    { name: 'فحم أسود', icon: '⬛', qty: 999, basePrice: 1000 },
    { name: 'خام الحديد', icon: '⚙️', qty: 500, basePrice: 5000 },
    { name: 'شظية ذهب', icon: '🪙', qty: 200, basePrice: 20000 },
    { name: 'ياقوت أحمر', icon: '🔻', qty: 100, basePrice: 80000 },
    { name: 'ماس نقي', icon: '💎', qty: 50, basePrice: 300000 },
    { name: 'حجر الطاقة الملعونة', icon: '🔮', qty: 25, basePrice: 1500000 }
]

// ═══════════ 🔧 خريطة التعديلات المدعومة ═══════════
const MODIFIERS = {
    'فلوس': { path: 'money', max: INFINITY_VAL, type: 'number' },
    'money': { path: 'money', max: INFINITY_VAL, type: 'number' },
    'رصيد': { path: 'money', max: INFINITY_VAL, type: 'number' },
    'بنك': { path: 'money', max: INFINITY_VAL, type: 'number' },
    'bank': { path: 'money', max: INFINITY_VAL, type: 'number' },
    'اكس_بي': { path: 'exp', max: 999999999, type: 'number' },
    'exp': { path: 'exp', max: 999999999, type: 'number' },
    'خبرة': { path: 'exp', max: 999999999, type: 'number' },
    'لفل': { path: 'exp', max: 999999999, type: 'number' },
    'level': { path: 'exp', max: 999999999, type: 'number' },
    'لفات': { path: 'wheelData.spins', max: 9999, type: 'number' },
    'spins': { path: 'wheelData.spins', max: 9999, type: 'number' },
    'لفه': { path: 'wheelData.spins', max: 9999, type: 'number' },
    'اصابع': { path: 'sukunaFingers', max: 15, type: 'number' },
    'اصبع': { path: 'sukunaFingers', max: 15, type: 'number' },
    'fingers': { path: 'sukunaFingers', max: 15, type: 'number' },
    'مضاعف': { path: 'opBuffs.multiplier', max: 999, type: 'number' },
    'multiplier': { path: 'opBuffs.multiplier', max: 999, type: 'number' },
    'حظ': { path: 'opBuffs.luckBonus', max: 9999, type: 'number' },
    'luck': { path: 'opBuffs.luckBonus', max: 9999, type: 'number' },
    'عمق': { path: 'depth', max: 999999, type: 'number' },
    'depth': { path: 'depth', max: 999999, type: 'number' },
    'درع': { path: 'opBuffs.autoShield', max: 1, type: 'boolean' },
    'shield': { path: 'opBuffs.autoShield', max: 1, type: 'boolean' },
    'خلود': { path: 'opBuffs.immortal', max: 1, type: 'boolean' },
    'immortal': { path: 'opBuffs.immortal', max: 1, type: 'boolean' },
    'حصانة': { path: 'opBuffs.immortal', max: 1, type: 'boolean' }
}

// ═══════════ 🎯 استخراج الهدف (منشن + يدوي + رد) ═══════════
function extractTarget(m, args) {
    if (m.mentionedJid?.[0]) return m.mentionedJid[0]
    if (m.quoted?.sender) return m.quoted.sender
    const raw = (args || []).join(' ')
    const dig = raw.match(/@(\d{5,15})/)
    if (dig) return dig[1] + '@s.whatsapp.net'
    return m.sender
}

// ═══════════ 🧮 قراءة قيمة متشعبة ═══════════
function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o && o[k] !== undefined ? o[k] : undefined, obj)
}

// ═══════════ 🔏 كتابة قيمة متشعبة ═══════════
function setNestedValue(obj, path, value) {
    const parts = path.split('.')
    let cur = obj
    for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}
        cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = value
}

// ═══════════ 💎 تحويل القيمة ═══════════
function parseValue(raw, mod) {
    const s = String(raw).toLowerCase().trim()
    if (['∞', 'inf', 'infinity', 'max', 'كل', 'all', 'ماكس', 'لانهاي'].includes(s)) return mod.max
    if (s === 'true' || s === 'on' || s === '1' || s === 'شغل' || s === 'ايوه') return 1
    if (s === 'false' || s === 'off' || s === '0' || s === 'اطفا') return 0
    const num = parseFloat(s.replace(/[^\d.\-]/g, ''))
    if (isNaN(num)) return null
    return mod.type === 'boolean' ? (num ? 1 : 0) : Math.min(mod.max, Math.max(0, Math.floor(num)))
}

// ═══════════ 📊 قراءة داتابيز اللاعب ═══════════
function getPlayerData(p) {
    return {
        '💰 الفلوس': (p.money || 0).toLocaleString(),
        '⭐ الخبرة': (p.exp || 0).toLocaleString(),
        '🎖️ المستوى': Math.floor(Math.sqrt((p.exp || 0) / 100)) + 1,
        '🎟️ اللفات': p.wheelData?.spins ?? 0,
        '🖐️ أصابع سوكونا': `${p.sukunaFingers || 0} / 15`,
        '⚡ المضاعف': `x${p.opBuffs?.multiplier || 1}`,
        '🍀 الحظ': `+${p.opBuffs?.luckBonus || 0}`,
        '🛡️ درع تلقائي': p.opBuffs?.autoShield ? '✅' : '❌',
        '👑 الخلود': p.opBuffs?.immortal ? '✅' : '❌',
        '🎭 الشخصيات': p.inventory?.characters?.length || 0,
        '🗡️ الأسلحة': p.inventory?.weapons?.length || 0,
        '🛡️ الدروع': p.inventory?.shields?.length || 0,
        '💎 المعادن': p.minerals?.reduce((a, x) => a + (x.qty || 1), 0) || 0,
        '⛏️ العمق': `${p.depth || 1} متر`
    }
}

// ═══════════ 💾 حفظ الداتابيز ═══════════
function loadDB(dbPath) {
    let db = { players: {}, auctions: {} }
    try {
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
            if (!db.players) db.players = {}
            if (!db.auctions) db.auctions = {}
        }
    } catch (e) {}
    return db
}
function saveDB(dbPath, db) {
    const dir = dirname(dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}
function defaultPlayer() {
    return {
        inventory: { weapons: [], shields: [], characters: [], items: [] },
        equipped: { weapon: 'قبضة اليد', shield: 'بدون', character: null },
        wheelData: { lastSpin: 0, spins: 5 },
        pendingSpin: null,
        money: 0, exp: 0, minerals: [], pickaxe: 'معول خشبي',
        depth: 1, sukunaFingers: 0, lastDig: 0,
        opBuffs: { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false },
        summons: []
    }
}

// ═══════════ 📤 إرسال تفاعلي بالرد ═══════════
async function sendInteractive(conn, m, { caption, buttons, mentions }) {
    const payload = {
        body: { text: caption, ...(mentions?.length ? { contextInfo: { mentionedJid: mentions } } : {}) },
        footer: { text: `🌑 ${global.author || 'Sukuna System'} 🌑` },
        nativeFlowMessage: { buttons },
        messageParamsJson: `｢🌑${global.namebot || 'Sukuna'}🌑HACK｣`
    }
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage: proto.Message.InteractiveMessage.fromObject(payload) }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
const qBtn = (label, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: label, id }) })

// ═══════════ 🎯 الهاندلر الرئيسي ═══════════
let handler = async (m, { conn, isOwner, usedPrefix, args, command, text }) => {
    if (!isOwner) {
        return m.reply(`*❆│·••━━⊰👑━━••·│❆*\n> ˼‏⚠️˹ الأمر ده خطير جداً وممنوع على العامة!╿↶\n│┊🌑 مسموح بس لـ: *${global.author || 'آدم (شادو)'}*\n*❆│·••━━⊰🌑━━••·│❆*`)
    }

    const pfx = usedPrefix || '.'
    const target = extractTarget(m, args)
    const dbPath = join(process.cwd(), 'database', 'sukuna_rpg.json')
    const db = loadDB(dbPath)

    if (!db.players[target]) db.players[target] = defaultPlayer()
    const p = db.players[target]
    
    // توحيد الأسماء (shields بدل armors)
    if (!p.inventory) p.inventory = { weapons: [], shields: [], characters: [], items: [] }
    if (!Array.isArray(p.inventory.weapons)) p.inventory.weapons = []
    if (!Array.isArray(p.inventory.shields)) {
        p.inventory.shields = Array.isArray(p.inventory.armors) ? [...p.inventory.armors] : []
        delete p.inventory.armors
    }
    if (!Array.isArray(p.inventory.characters)) p.inventory.characters = []
    if (!Array.isArray(p.inventory.items)) p.inventory.items = []
    if (!p.wheelData) p.wheelData = { lastSpin: 0, spins: 5 }
    if (!p.opBuffs) p.opBuffs = { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false }
    if (!Array.isArray(p.minerals)) p.minerals = []

    let targetName = 'الهدف'
    try { targetName = await conn.getName(target) } catch (e) {}

    const cleanText = (text || '').replace(/@(\d+)(?::\d+)?/g, '').trim().toLowerCase()

    // 📖 قائمة المساعدة
    if (!args.length || cleanText === 'مساعدة' || cleanText === 'help') {
        const help = `*❆│·••━━⊰🌑━━••·│❆*\n` +
            `⌗› مـوسـوعـة الـتـهـكـيـر الـشـامـل  ˼˹\n` +
            `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n\n` +
            `> ˼‏📦˹ أوامر الأعتدة الشاملة╿↶\n` +
            `│┊🎭 \`${pfx}${command} شخصيات\` — كل شخصيات JJK (42)\n` +
            `│┊🗡️ \`${pfx}${command} اسلحة\` — كل الأسلحة الملعونة\n` +
            `│┊🛡️ \`${pfx}${command} دروع\` — كل الدروع الملعونة\n` +
            `│┊💎 \`${pfx}${command} معادن\` — كل المعادن بكميات جبارة\n` +
            `│┊⚔️ \`${pfx}${command} عتاد\` — الثلاثة معاً\n\n` +
            `> ˼‏⚡˹ الأوامر الجبارة╿↶\n` +
            `│┊🌌 \`${pfx}${command} max\` — تهكير شامل كل حاجة\n` +
            `│┊👁️ \`${pfx}${command} عرض\` — رؤية داتابيز اللاعب\n` +
            `│┊🗑️ \`${pfx}${command} تصفير\` — كنس كل شيء\n\n` +
            `> ˼‏🔧˹ التعديل المباشر╿↶\n` +
            `│┊💰 \`${pfx}${command} فلوس ∞\`\n` +
            `│┊🎟️ \`${pfx}${command} لفات 9999\`\n` +
            `│┊🖐️ \`${pfx}${command} اصابع 15\`\n` +
            `│┊⚡ \`${pfx}${command} مضاعف 999\`\n` +
            `│┊👑 \`${pfx}${command} خلود on\`\n` +
            `*❆│·••━━⊰🌑━━••·│❆*`
        return m.reply(help, null, { mentions: [target] })
    }

    // 👁️ أمر العرض
    if (cleanText === 'عرض' || cleanText === 'show' || cleanText === 'شوف') {
        const data = getPlayerData(p)
        let txt = `*~❍━═══━⚞👁️≽━═══━❍~*\n`
        txt += `⌗› داتـابـيـز الـلاعـب  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 الاسم: *${targetName}*\n`
        txt += `│┊🆔 المعرف: \`${target.split('@')[0]}\`\n`
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        for (const [k, v] of Object.entries(data)) {
            txt += `│┊${k}: \`${v}\`\n`
        }
        txt += `*~❍━═══━⚞👁️≽━═══━❍~*`
        const buttons = [
            qBtn('🌌 تهكير الكل (MAX)', `${pfx}${command} max`),
            qBtn('⚔️ امتلاك كل الأعتدة', `${pfx}${command} عتاد`),
            qBtn('💰 فلوس ∞', `${pfx}${command} فلوس ∞`),
            qBtn('🗑️ تصفير', `${pfx}${command} تصفير`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🎭 أمر إضافة كل الشخصيات
    if (cleanText === 'شخصيات' || cleanText === 'characters' || cleanText === 'chars') {
        let added = 0
        for (const c of JJK_CHARS) {
            if (!p.inventory.characters.includes(c)) {
                p.inventory.characters.push(c)
                added++
            }
        }
        saveDB(dbPath, db)
        let txt = `*~❍━═══━⚞🎭≽━═══━❍~*\n`
        txt += `⌗› تـم تـسـلـيـح الـشـخـصـيـات  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 المستفيد: *${targetName}*\n`
        txt += `│┊✨ أُضيفت: \`${added} شخصية جديدة\`\n`
        txt += `│┊🎭 الإجمالي: \`${p.inventory.characters.length} شخصية\`\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ كل أبطال JJK بقوا تحت إمرتك!\n`
        txt += `*~❍━═══━⚞🎭≽━═══━❍~*`
        const buttons = [
            qBtn('🗡️ أضف الأسلحة', `${pfx}${command} اسلحة`),
            qBtn('🛡️ أضف الدروع', `${pfx}${command} دروع`),
            qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🗡️ أمر إضافة كل الأسلحة
    if (cleanText === 'اسلحة' || cleanText === 'weapons' || cleanText === 'weps') {
        let added = 0
        for (const w of WEAPONS_ALL) {
            if (!p.inventory.weapons.includes(w)) {
                p.inventory.weapons.push(w)
                added++
            }
        }
        saveDB(dbPath, db)
        let txt = `*~❍━═══━⚞🗡️≽━═══━❍~*\n`
        txt += `⌗› تـم تـسـلـيـح الأسـلـحـة  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 المستفيد: *${targetName}*\n`
        txt += `│┊✨ أُضيف: \`${added} سلاح جديد\`\n`
        txt += `│┊🗡️ الإجمالي: \`${p.inventory.weapons.length} سلاح\`\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ كاموتوكي، هيتن، رمح السماء... كلها معاك!\n`
        txt += `*~❍━═══━⚞🗡️≽━═══━❍~*`
        const buttons = [
            qBtn('🎭 أضف الشخصيات', `${pfx}${command} شخصيات`),
            qBtn('🛡️ أضف الدروع', `${pfx}${command} دروع`),
            qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🛡️ أمر إضافة كل الدروع
    if (cleanText === 'دروع' || cleanText === 'shields' || cleanText === 'armors') {
        let added = 0
        for (const s of SHIELDS_ALL) {
            if (!p.inventory.shields.includes(s)) {
                p.inventory.shields.push(s)
                added++
            }
        }
        saveDB(dbPath, db)
        let txt = `*~❍━═══━⚞🛡️≽━═══━❍~*\n`
        txt += `⌗› تـم تـسـلـيـح الـدروع  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 المستفيد: *${targetName}*\n`
        txt += `│┊✨ أُضيف: \`${added} درع جديد\`\n`
        txt += `│┊🛡️ الإجمالي: \`${p.inventory.shields.length} درع\`\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ درع ملك اللعنات، الفراغ اللانهائي... كلها!\n`
        txt += `*~❍━═══━⚞🛡️≽━═══━❍~*`
        const buttons = [
            qBtn('🎭 أضف الشخصيات', `${pfx}${command} شخصيات`),
            qBtn('🗡️ أضف الأسلحة', `${pfx}${command} اسلحة`),
            qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 💎 أمر إضافة كل المعادن
    if (cleanText === 'معادن' || cleanText === 'minerals') {
        p.minerals = MINERALS_ALL.map(m => ({ name: m.name, icon: m.icon, qty: m.qty, price: m.basePrice * m.qty }))
        saveDB(dbPath, db)
        let txt = `*~❍━═══━⚞💎≽━═══━❍~*\n`
        txt += `⌗› تـم شـحـن الـمـعـادن  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 المستفيد: *${targetName}*\n`
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        for (const m of MINERALS_ALL) {
            txt += `│┊${m.icon} *${m.name}*: \`${m.qty} قطعة\`\n`
        }
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ كل كنوز الأعماق بقت في حقيبتك!\n`
        txt += `*~❍━═══━⚞💎≽━═══━❍~*`
        const buttons = [
            qBtn('⚔️ أضف العتاد', `${pfx}${command} عتاد`),
            qBtn('💰 فلوس ∞', `${pfx}${command} فلوس ∞`),
            qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // ⚔️ أمر إضافة كل الأعتدة (شخصيات + أسلحة + دروع + معادن)
    if (cleanText === 'عتاد' || cleanText === 'gear' || cleanText === 'items' || cleanText === 'كل_العتاد') {
        let addedChars = 0, addedWeps = 0, addedShields = 0
        for (const c of JJK_CHARS) {
            if (!p.inventory.characters.includes(c)) { p.inventory.characters.push(c); addedChars++ }
        }
        for (const w of WEAPONS_ALL) {
            if (!p.inventory.weapons.includes(w)) { p.inventory.weapons.push(w); addedWeps++ }
        }
        for (const s of SHIELDS_ALL) {
            if (!p.inventory.shields.includes(s)) { p.inventory.shields.push(s); addedShields++ }
        }
        p.minerals = MINERALS_ALL.map(m => ({ name: m.name, icon: m.icon, qty: m.qty, price: m.basePrice * m.qty }))
        saveDB(dbPath, db)

        let txt = `*~❍━═══━⚞⚔️≽━═══━❍~*\n`
        txt += `⌗› تـم تـسـلـيـح الـلاعـب بـالـكـامـل!  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 المستفيد: *${targetName}*\n`
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        txt += `│┊🎭 شخصيات جديدة: \`${addedChars}\` (الإجمالي: ${p.inventory.characters.length})\n`
        txt += `│┊🗡️ أسلحة جديدة: \`${addedWeps}\` (الإجمالي: ${p.inventory.weapons.length})\n`
        txt += `│┊🛡️ دروع جديدة: \`${addedShields}\` (الإجمالي: ${p.inventory.shields.length})\n`
        txt += `│┊💎 المعادن: \`${MINERALS_ALL.length} نوع بكميات جبارة\`\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ الحقيبة تمتلئ بأقوى عتاد في تاريخ البوت!\n`
        txt += `*~❍━═══━⚞⚔️≽━═══━❍~*`

        const buttons = [
            qBtn('🌌 تهكير الكل (MAX)', `${pfx}${command} max`),
            qBtn('💰 فلوس ∞', `${pfx}${command} فلوس ∞`),
            qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🌌 تهكير الكل (MAX)
    if (cleanText === 'max' || cleanText === 'كل' || cleanText === 'all' || cleanText === 'ماكس' || cleanText === 'لانهاي') {
        p.money = INFINITY_VAL
        p.exp = 999999999
        p.wheelData.spins = 9999
        p.sukunaFingers = 15
        p.opBuffs.multiplier = 999
        p.opBuffs.luckBonus = 9999
        p.opBuffs.autoShield = true
        p.opBuffs.immortal = true
        p.depth = 999999
        p.pickaxe = 'منقاب_الطاقة_الملعونة'

        // حقن كل الأعتدة
        for (const c of JJK_CHARS) {
            if (!p.inventory.characters.includes(c)) p.inventory.characters.push(c)
        }
        for (const w of WEAPONS_ALL) {
            if (!p.inventory.weapons.includes(w)) p.inventory.weapons.push(w)
        }
        for (const s of SHIELDS_ALL) {
            if (!p.inventory.shields.includes(s)) p.inventory.shields.push(s)
        }
        p.minerals = MINERALS_ALL.map(m => ({ name: m.name, icon: m.icon, qty: m.qty, price: m.basePrice * m.qty }))

        saveDB(dbPath, db)

        let txt = `*~❍━═══━⚞🌌≽━═══━❍~*\n`
        txt += `⌗› تـهـكـيـر شـامـل لـكـل شـيء (MAX)  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊👤 الاسم: *${targetName}*\n`
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        txt += `│┊💰 الفلوس: \`∞\`\n`
        txt += `│┊⭐ الخبرة: \`999,999,999\`\n`
        txt += `│┊🎟️ اللفات: \`9,999\`\n`
        txt += `│┊🖐️ أصابع سوكونا: \`15/15\`\n`
        txt += `│┊⚡ المضاعف: \`x999\`\n`
        txt += `│┊🍀 الحظ: \`+9,999\`\n`
        txt += `│┊🛡️ درع تلقائي & خلود: \`✅\`\n`
        txt += `│┊⛏️ المعول: \`منقاب الطاقة الملعونة\`\n`
        txt += `│┊🎭 الشخصيات: \`${p.inventory.characters.length}\` (الكل)\n`
        txt += `│┊🗡️ الأسلحة: \`${p.inventory.weapons.length}\` (الكل)\n`
        txt += `│┊🛡️ الدروع: \`${p.inventory.shields.length}\` (الكل)\n`
        txt += `│┊💎 المعادن: \`${MINERALS_ALL.length} نوع (جبارة)\`\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ *${global.author || 'آدم'}* سيطر على الكيان بالكامل!\n`
        txt += `*~❍━═══━⚞🌌≽━═══━❍~*`

        const buttons = [qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`)]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🗑️ تصفير الكل
    if (cleanText === 'تصفير' || cleanText === 'reset' || cleanText === 'صفر') {
        const fresh = defaultPlayer()
        db.players[target] = fresh
        saveDB(dbPath, db)

        let txt = `*~❍━═══━⚞🗑️≽━═══━❍~*\n`
        txt += `⌗› تـم كـنـس كـل شـيء  ˼˹\n`
        txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        txt += `│┊💀 تم تصفير كافة بيانات وأعتدة:\n`
        txt += `│┊👤 *${targetName}*\n`
        txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        txt += `> ˼‏🌑˹ رجع زي ما اتولد من جديد!\n`
        txt += `*~❍━═══━⚞🗑️≽━═══━❍~*`

        const buttons = [
            qBtn('⚔️ إعادة التجهيز', `${pfx}${command} عتاد`),
            qBtn('🌌 تهكير MAX', `${pfx}${command} max`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
        catch (e) { return m.reply(txt, null, { mentions: [target] }) }
    }

    // 🔧 المعالجة والتعديل المباشر للمفاتيح
    const cleanArgsText = (text || '').replace(/@(\d+)(?::\d+)?/g, '').trim()
    const tokens = cleanArgsText.split(/\s+/)

    const changes = []
    const errors = []

    for (let i = 0; i < tokens.length; i += 2) {
        const key = tokens[i]?.toLowerCase()
        const val = tokens[i + 1]

        if (!key) continue
        if (!val) {
            errors.push(`❌ قيمة ناقصة للمفتاح: \`${key}\``)
            break
        }

        const mod = MODIFIERS[key]
        if (!mod) {
            errors.push(`❌ مفتاح غير معروف: \`${key}\``)
            continue
        }

        const parsed = parseValue(val, mod)
        if (parsed === null) {
            errors.push(`❌ قيمة غير صالحة لـ \`${key}\`: \`${val}\``)
            continue
        }

        setNestedValue(p, mod.path, parsed)
        changes.push({ key, value: parsed, max: mod.max, type: mod.type })
    }

    if (errors.length && !changes.length) {
        return m.reply(`*❆│·••━━⊰⚠️━━••·│❆*\n${errors.join('\n')}\n\n> ˼‏💡˹ اكتب \`${pfx}${command} عتاد\` لإضافة كل الأسلحة أو \`${pfx}${command} max\` للتهكير الشامل!\n*❆│·••━━⊰⚠️━━••·│❆*`)
    }

    saveDB(dbPath, db)

    let txt = `*~❍━═══━⚞🌑≽━═══━❍~*\n`
    txt += `⌗› تـم اخـتـراق وتـعـديـل الـداتـابـيـز  ˼˹\n`
    txt += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
    txt += `│┊👤 المستهدف: *${targetName}*\n`
    txt += `│┊🎯 التعديلات: ${changes.length}\n`
    txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
    for (const c of changes) {
        const disp = c.value === c.max ? '∞' : (c.type === 'boolean' ? (c.value ? '✅' : '❌') : c.value.toLocaleString())
        txt += `│┊✨ *${c.key}:* \`${disp}\`\n`
    }
    if (errors.length) {
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        txt += `│┊⚠️ ملاحظات:\n${errors.map(e => `│┊${e}`).join('\n')}\n`
    }
    txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
    txt += `> ˼‏🌑˹ *${global.author || 'آدم (شادو)'}* نفذ الأمر بنجاح تام!\n`
    txt += `*~❍━═══━⚞🌑≽━═══━❍~*`

    const buttons = [
        qBtn('👁️ عرض الداتابيز', `${pfx}${command} عرض`),
        qBtn('⚔️ إضافة كل الأعتدة', `${pfx}${command} عتاد`),
        qBtn('🌌 تهكير الكل (MAX)', `${pfx}${command} max`)
    ]
    try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
    catch (e) { return m.reply(txt, null, { mentions: [target] }) }
}

handler.help = ['<مفتاح> <قيمة>', 'شخصيات', 'اسلحة', 'دروع', 'معادن', 'عتاد', 'max', 'عرض', 'تصفير']
handler.tags = ['owner']
handler.command = ['قويني', 'hack', 'تهكير', 'تعديل', 'edit', 'shadow']
handler.description = 'مفتاح الكنوز السوكوني: تحكم مطلق في داتابيز أي لاعب — كل شخصيات JJK، الأسلحة، الدروع، المعادن، الفلوس، اللفات، والأصابع بأوامر سريعة.'
handler.owner = true

export default handler