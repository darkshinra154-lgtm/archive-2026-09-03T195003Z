/*
 * ═══════════════════════════════════════════════════════
 * 🌑 OWNER ULTIMATE HACK | أمر التهكير الأسطوري للمطور
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 🏷️ الحقوق: ${global.author || 'Shadow'}
 * 📜 الوصف: المطور يتحكم في داتابيز نفسه أو أي لاعب أو كل اللاعبين
 *           (فلوس، بنك، خبرة، مستوى، لفات، أصابع، مضاعفات، حصانة)
 *           مع دعم القيم اللانهائية (∞) والتعديلات المتعددة.
 * ═══════════════════════════════════════════════════════
 */

import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'

const INFINITY_VAL = 999999999999999
const DB_PATH = path.join(process.cwd(), 'database', 'sukuna_rpg.json')

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
    'درع': { path: 'opBuffs.autoShield', max: 1, type: 'boolean' },
    'shield': { path: 'opBuffs.autoShield', max: 1, type: 'boolean' },
    'خلود': { path: 'opBuffs.immortal', max: 1, type: 'boolean' },
    'immortal': { path: 'opBuffs.immortal', max: 1, type: 'boolean' },
    'حصانة': { path: 'opBuffs.immortal', max: 1, type: 'boolean' }
}

// ═══════════ 🗄️ قراءة وكتابة داتابيز RPG ═══════════
function loadDB() {
    try {
        const dir = path.dirname(DB_PATH)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ players: {}, auctions: {} }, null, 2))
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    } catch (e) { return { players: {}, auctions: {} } }
}
function saveDB(db) {
    try { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)) } catch (e) {}
}

// ═══════════ 🎯 استخراج الهدف (اختياري دلوقتي) ═══════════
function extractTarget(m, args) {
    if (m.mentionedJid?.[0]) return m.mentionedJid[0]
    if (m.quoted?.sender && m.quoted.sender !== m.sender) return m.quoted.sender
    const dig = (args || []).join(' ').match(/@(\d{5,15})/)
    if (dig) return dig[1] + '@s.whatsapp.net'
    return null
}

// ═══════════ 🧮 دوال المتشعبات ═══════════
function setNestedValue(obj, p, value) {
    const parts = p.split('.')
    let cur = obj
    for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}
        cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = value
}
function getNestedValue(obj, p) {
    return p.split('.').reduce((o, k) => o && o[k] !== undefined ? o[k] : undefined, obj)
}

// ═══════════ 💎 تحويل القيمة (∞ / inf / max) ═══════════
function parseValue(raw, mod) {
    const s = String(raw).toLowerCase().trim()
    if (['∞', 'inf', 'infinity', 'max', 'كل', 'all', 'ماكس', 'لانهاي'].includes(s)) return mod.max
    if (['true', 'on', '1', 'شغل', 'ايوه'].includes(s)) return 1
    if (['false', 'off', '0', 'اطفا'].includes(s)) return 0
    const num = parseFloat(s.replace(/[^\d.\-]/g, ''))
    if (isNaN(num)) return null
    return mod.type === 'boolean' ? (num ? 1 : 0) : Math.min(mod.max, Math.max(0, Math.floor(num)))
}

// ═══════════ 📊 عرض داتابيز اللاعب ═══════════
function getPlayerData(p) {
    return {
        '💰 الفلوس': p.money?.toLocaleString() || 0,
        '⭐ الخبرة': p.exp?.toLocaleString() || 0,
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
        '💎 المعادن': p.minerals?.reduce((a, x) => a + (x.qty || 1), 0) || 0
    }
}

// ═══════════ 🛠️ تطبيق MAX على لاعب ═══════════
function applyMax(p) {
    p.money = INFINITY_VAL
    p.exp = 999999999
    if (!p.wheelData) p.wheelData = {}
    p.wheelData.spins = 9999
    p.sukunaFingers = 15
    if (!p.opBuffs) p.opBuffs = {}
    p.opBuffs.multiplier = 999
    p.opBuffs.luckBonus = 9999
    p.opBuffs.autoShield = true
    p.opBuffs.immortal = true
    p.depth = 999999
}

// ═══════════ 🗑️ تصفير لاعب ═══════════
function applyReset(p) {
    p.money = 0; p.exp = 0
    p.wheelData = { lastSpin: 0, spins: 5 }
    p.sukunaFingers = 0
    p.opBuffs = { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false }
    p.inventory = { weapons: [], shields: [], characters: [], items: [] }
    p.minerals = []; p.depth = 1
}

// ═══════════ 📤 إرسال تفاعلي بالرد ═══════════
async function sendInteractive(conn, m, { caption, buttons, mentions }) {
    const payload = {
        body: { text: caption, ...(mentions?.length ? { contextInfo: { mentionedJid: mentions } } : {}) },
        footer: { text: `🌑 ${global.author || 'Shadow Dev'} 🌑` },
        nativeFlowMessage: { buttons },
        messageParamsJson: '｢🌑SHADOW🌑HACK｣'
    }
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage: proto.Message.InteractiveMessage.fromObject(payload) }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

const qBtn = (label, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: label, id }) })

// ═══════════ 🎯 الهاندلر الرئيسي ═══════════
let handler = async (m, { conn, isOwner, usedPrefix, args, command, text }) => {
    if (!isOwner) {
        return m.reply(`*❆│·••━━⊰👑━━••·│❆*\n> ˼‏⚠️˹ الأمر ده خطير جداً وممنوع على العامة!╿↶\n│┊🌑 مسموح بس لـ: *${global.author || 'Shadow'}*\n*❆│·••━━⊰🌑━━••·│❆*`)
    }

    const pfx = usedPrefix || '.'
    const db = loadDB()
    if (!db.players) db.players = {}

    // 🎯 استخراج الهدف (اختياري)
    const target = extractTarget(m, args)
    const rawText = text.replace(/@(\d+)(?::\d+)?/g, '').trim().toLowerCase()

    // ═══════════ 🌍 هكر الجميع (Mass Hack) ═══════════
    if (command === 'هكر_الكل' || command === 'هكر_الجميع' || command === 'hack_all' || command === 'mass') {
        const players = Object.keys(db.players)
        if (!players.length) return m.reply(`*~❍━═══━⚞❌≽━═══━❍~*\n│┊❌ مفيش لاعبين في الداتابيز!\n*~❍━═══━⚞❌≽━═══━❍~*`)
        
        players.forEach(jid => {
            if (!db.players[jid]) return
            applyMax(db.players[jid])
        })
        saveDB(db)

        const txt = `*~❍━═══━⚞🌍≽━═══━❍~*\n` +
            `⌗› تـهـكـيـر جـمـاعـي!  ˼˹\n` +
            `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n` +
            `│┊👥 عدد الضحايا: *${players.length}* لاعب\n` +
            `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n` +
            `│┊💰 الفلوس: \`∞\` للجميع\n` +
            `│┊⭐ الخبرة: \`999,999,999\`\n` +
            `│┊🎟️ اللفات: \`9,999\`\n` +
            `│┊🖐️ الأصابع: \`15/15\`\n` +
            `│┊👑 الخلود: \`✅\`\n` +
            `│┊🛡️ درع تلقائي: \`✅\`\n` +
            `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n` +
            `> ˼‏🌑˹ *${global.author || 'Shadow'}* ضرب الضربة القاضية على الجميع!\n` +
            `*~❍━═══━⚞🌍≽━═══━❍~*`
        return m.reply(txt)
    }

    // ═══════════ 🎯 لو فيه منشن → يهكره (زي قبل) ═══════════
    if (target) {
        if (!db.players[target]) db.players[target] = {
            inventory: { weapons: [], shields: [], characters: [], items: [] },
            equipped: { weapon: 'قبضة اليد', shield: 'بدون', character: null },
            wheelData: { lastSpin: 0, spins: 5 },
            pendingSpin: null,
            money: 0, exp: 0, minerals: [], pickaxe: 'معول خشبي', depth: 1, sukunaFingers: 0,
            lastDig: 0, opBuffs: { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false }
        }
        const p = db.players[target]
        let targetName = 'الهدف'
        try { targetName = await conn.getName(target) } catch (e) {}

        // 👁️ عرض
        if (rawText === 'عرض' || rawText === 'show' || rawText === 'شوف') {
            const data = getPlayerData(p)
            let txt = `*~❍━═══━⚞👁️≽━═══━❍~*\n⌗› داتـابـيـز: *${targetName}*  ˼˹\n*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
            for (const [k, v] of Object.entries(data)) txt += `│┊${k}: \`${v}\`\n`
            txt += `*~❍━═══━⚞👁️≽━═══━❍~*`
            const buttons = [
                qBtn('🌌 تهكيره MAX', `${pfx}${command} @${target.split('@')[0]} max`),
                qBtn('🗑️ تصفيره', `${pfx}${command} @${target.split('@')[0]} تصفير`)
            ]
            try { return await sendInteractive(conn, m, { caption: txt, buttons, mentions: [target] }) }
            catch (e) { return m.reply(txt, null, { mentions: [target] }) }
        }

        // 🌌 MAX
        if (['max', 'كل', 'all', 'ماكس', 'لانهاي'].includes(rawText)) {
            applyMax(p); saveDB(db)
            const txt = `*~❍━═══━⚞🌌≽━═══━❍~*\n⌗› تـهـكـيـر: *${targetName}*  ˼˹\n*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n` +
                `│┊💰 الفلوس: \`∞\` │ ⭐ الخبرة: \`999,999,999\`\n` +
                `│┊🎟️ اللفات: \`9,999\` │ 🖐️ الأصابع: \`15/15\`\n` +
                `│┊⚡ المضاعف: \`x999\` │ 🍀 الحظ: \`+9,999\`\n` +
                `│┊🛡️ درع تلقائي: \`✅\` │ 👑 الخلود: \`✅\`\n` +
                `*~❍━═══━⚞🌌≽━═══━❍~*`
            return m.reply(txt, null, { mentions: [target] })
        }

        // 🗑️ تصفير
        if (['تصفير', 'reset', 'صفر', 'wipe'].includes(rawText)) {
            applyReset(p); saveDB(db)
            return m.reply(`*~❍━═══━⚞🗑️≽━═══━❍~*\n│┊💀 تم تصفير *${targetName}* بنجاح!\n*~❍━═══━⚞🗑️≽━═══━❍~*`, null, { mentions: [target] })
        }

        // 🔧 تعديلات مخصصة
        const tokens = text.replace(/@(\d+)(?::\d+)?/g, '').trim().split(/\s+/)
        const changes = [], errors = []
        for (let i = 0; i < tokens.length; i += 2) {
            const key = tokens[i]?.toLowerCase(), val = tokens[i + 1]
            if (!key || !val) { errors.push(`❌ قيمة ناقصة قرب: \`${key || '?'}\``); continue }
            const mod = MODIFIERS[key]
            if (!mod) { errors.push(`❌ مفتاح غير معروف: \`${key}\``); continue }
            const parsed = parseValue(val, mod)
            if (parsed === null) { errors.push(`❌ قيمة غير صالحة: \`${val}\``); continue }
            setNestedValue(p, mod.path, parsed)
            changes.push({ key, value: parsed, max: mod.max, type: mod.type })
        }
        if (!changes.length) return m.reply(`*❆│·••━━⊰⚠️━━••·│❆*\n${errors.join('\n') || 'لا توجد تعديلات صالحة'}\n*❆│·••━━⊰⚠️━━••·│❆*`)
        saveDB(db)
        let txt = `*~❍━═══━⚞🌑≽━═══━❍~*\n⌗› تـم اخـتـراق: *${targetName}*  ˼˹\n*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        for (const c of changes) {
            const disp = c.value === c.max ? '∞' : (c.type === 'boolean' ? (c.value ? '✅' : '❌') : c.value.toLocaleString())
            txt += `│┊✨ *${c.key}:* \`${disp}\`\n`
        }
        txt += `*~❍━═══━⚞🌑≽━═══━❍~*`
        return m.reply(txt, null, { mentions: [target] })
    }

    // ═══════════ 🎯 مفيش منشن → المطور يهكر نفسه! ═══════════
    const ownerJid = m.sender
    if (!db.players[ownerJid]) db.players[ownerJid] = {
        inventory: { weapons: [], shields: [], characters: [], items: [] },
        equipped: { weapon: 'قبضة اليد', shield: 'بدون', character: null },
        wheelData: { lastSpin: 0, spins: 5 },
        pendingSpin: null,
        money: 0, exp: 0, minerals: [], pickaxe: 'معول خشبي', depth: 1, sukunaFingers: 0,
        lastDig: 0, opBuffs: { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false }
    }
    const p = db.players[ownerJid]
    const ownerName = await conn.getName(ownerJid).catch(() => 'المطور')

    // 📖 المساعدة
    if (!rawText || rawText === 'help' || rawText === 'مساعدة') {
        const help = `*❆│·••━━⊰🌑⊱━━••·│❆*\n` +
            `⌗› مـوسـوعـة الـتـهـكـيـر الـذاتـي  ˼˹\n` +
            `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n\n` +
            `> ˼‏🎯˹ بدون منشن = هكر نفسك يا معلم╿↶\n\n` +
            `> ˼‏🌌˹ اختصارات ذاتية╿↶\n` +
            `│┊🌌 \`${pfx}${command} max\` ← هكر نفسك لأقصى حد!\n` +
            `│┊👁️ \`${pfx}${command} عرض\` ← اعرض داتابيز نفسك\n` +
            `│┊🗑️ \`${pfx}${command} تصفير\` ← صفّر نفسك\n` +
            `│┊🌍 \`${pfx}هكر_الكل max\` ← هكر كل اللاعبين!\n\n` +
            `> ˼‏✨˹ تعديلات مخصصة على نفسك╿↶\n` +
            `│┊💰 \`${pfx}${command} فلوس ∞\`\n` +
            `│┊⭐ \`${pfx}${command} خبرة 999999\`\n` +
            `│┊🎟️ \`${pfx}${command} لفات 100\`\n` +
            `│┊🖐️ \`${pfx}${command} اصابع 15\`\n` +
            `│┊👑 \`${pfx}${command} خلود on\`\n\n` +
            `> ˼‏🎯˹ مع منشن = هكر لاعب تاني╿↶\n` +
            `│┊ \`${pfx}${command} @x max\`\n` +
            `*❆│·••━━⊰🌑━━••·│❆*`
        return m.reply(help)
    }

    // 👁️ عرض داتابيز المطور
    if (['عرض', 'show', 'شوف'].includes(rawText)) {
        const data = getPlayerData(p)
        let txt = `*~❍━═══━⚞👁️≽━═══━❍~*\n⌗› داتـابـيـز *${ownerName}* (المطور)  ˼˹\n*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        for (const [k, v] of Object.entries(data)) txt += `│┊${k}: \`${v}\`\n`
        txt += `*~❍━═══━⚞👁️≽━═══━❍~*`
        const buttons = [
            qBtn('🌌 هكر نفسك MAX', `${pfx}${command} max`),
            qBtn('🗑️ صفّر نفسك', `${pfx}${command} تصفير`),
            qBtn('🌍 هكر الجميع', `${pfx}هكر_الكل max`)
        ]
        try { return await sendInteractive(conn, m, { caption: txt, buttons }) }
        catch (e) { return m.reply(txt) }
    }

    // 🌌 MAX للمطور نفسه
    if (['max', 'كل', 'all', 'ماكس', 'لانهاي'].includes(rawText)) {
        applyMax(p); saveDB(db)
        const txt = `*~❍━═══━⚞🌌≽━═══━❍~*\n` +
            `⌗› تـهـكـيـر ذاتـي أسـطـوري!  ˼˹\n` +
            `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n` +
            `│┊👤 المطور: *${ownerName}*\n` +
            `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n` +
            `│┊💰 الفلوس: \`∞\`\n` +
            `│┊⭐ الخبرة: \`999,999,999\`\n` +
            `│┊🎟️ اللفات: \`9,999\`\n` +
            `│┊🖐️ الأصابع: \`15/15\`\n` +
            `│┊⚡ المضاعف: \`x999\`\n` +
            `│┊🍀 الحظ: \`+9,999\`\n` +
            `│┊🛡️ درع تلقائي: \`✅\`\n` +
            `│┊👑 الخلود: \`✅\`\n` +
            `│┊⛏️ العمق: \`999,999 متر\`\n` +
            `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n` +
            `> ˼‏🌑˹ *${global.author || 'Shadow'}* كسر حدود النظام بنفسه!\n` +
            `*~❍━═══━⚞🌌≽━═══━❍~*`
        const buttons = [qBtn('👁️ اعرض داتابيزك', `${pfx}${command} عرض`)]
        try { return await sendInteractive(conn, m, { caption: txt, buttons }) }
        catch (e) { return m.reply(txt) }
    }

    // 🗑️ تصفير المطور نفسه
    if (['تصفير', 'reset', 'صفر', 'wipe'].includes(rawText)) {
        applyReset(p); saveDB(db)
        return m.reply(`*~❍━═══━⚞🗑️≽━═══━❍~*\n│┊💀 تم تصفير بياناتك يا *${ownerName}*!\n│┊⚠️ الشخصيات والأسلحة والدروع راحت!\n*~❍━═══━⚞🗑️≽━═══━❍~*`)
    }

    // 🔧 تعديلات مخصصة على المطور
    const tokens = text.trim().split(/\s+/)
    const changes = [], errors = []
    for (let i = 0; i < tokens.length; i += 2) {
        const key = tokens[i]?.toLowerCase(), val = tokens[i + 1]
        if (!key || !val) { errors.push(`❌ قيمة ناقصة قرب: \`${key || '?'}\``); continue }
        const mod = MODIFIERS[key]
        if (!mod) { errors.push(`❌ مفتاح غير معروف: \`${key}\``); continue }
        const parsed = parseValue(val, mod)
        if (parsed === null) { errors.push(`❌ قيمة غير صالحة: \`${val}\``); continue }
        setNestedValue(p, mod.path, parsed)
        changes.push({ key, value: parsed, max: mod.max, type: mod.type })
    }

    if (!changes.length) {
        return m.reply(`*❆│·••━━⊰⚠️━━••·│❆*\n${errors.join('\n') || 'لا توجد تعديلات صالحة'}\n\n> ˼‏💡˹ اكتب \`${pfx}${command}\` من غير أي كلمة لرؤية كل الأوامر\n*❆│·••━━⊰⚠️━━••·│❆*`)
    }

    saveDB(db)

    let txt = `*~❍━═══━⚞🌑≽━═══━❍~*\n` +
        `⌗› تـهـكـيـر ذاتـي نـجـح!  ˼˹\n` +
        `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n` +
        `│┊👤 المطور: *${ownerName}*\n` +
        `│┊🎯 التعديلات: ${changes.length}\n` +
        `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
    for (const c of changes) {
        const disp = c.value === c.max ? '∞' : (c.type === 'boolean' ? (c.value ? '✅' : '❌') : c.value.toLocaleString())
        txt += `│┊✨ *${c.key}:* \`${disp}\`\n`
    }
    if (errors.length) {
        txt += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        txt += `│┊⚠️ تحذيرات:\n${errors.map(e => `│┊${e}`).join('\n')}\n`
    }
    txt += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇─\n` +
        `> ˼‏🌑˹ *${global.author || 'Shadow'}* نفذ الضربة على نفسه بنجاح!\n` +
        `*~❍━═══━⚞🌑≽━═══━❍~*`

    const buttons = [
        qBtn('👁️ اعرض نفسك', `${pfx}${command} عرض`),
        qBtn('🌌 MAX كامل', `${pfx}${command} max`),
        qBtn('🗑️ صفّر نفسك', `${pfx}${command} تصفير`)
    ]
    try { return await sendInteractive(conn, m, { caption: txt, buttons }) }
    catch (e) { return m.reply(txt) }
}

handler.help = ['(بدون منشن يهكرك انت)', '@منشن <مفتاح> <قيمة>', '_الكل max']
handler.tags = ['owner']
handler.command = ['هكر', 'hack', 'تهكير', 'shadow', 'هكر_الكل', 'هكر_الجميع', 'hack_all', 'mass']
handler.description = 'أمر خاص بالمطور للتحكم في داتابيز نفسه أو أي لاعب أو كل اللاعبين. بدون منشن = يهكر المطور نفسه.'
handler.owner = true

export default handler