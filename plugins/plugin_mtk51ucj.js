/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import { proto, prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import moment from 'moment-timezone'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

const FALLBACK_IMAGE = 'https://i.ibb.co/L50Fk1j/sukuna-fallback.jpg'
const BASE_BG = path.join(process.cwd(), 'src', 'sukuna_base.jpg')
const RPG_DIR = path.join(process.cwd(), 'database')
const RPG_FILE = path.join(RPG_DIR, 'sukuna_rpg.json')
const NUMS = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '', '❾', '']
const DEFAULT_SPINS = 5
const TIER_COLORS = { 'S+': '#FF3B3B', S: '#FFD700', A: '#C084FC', B: '#60A5FA' }

// ═══════════ 🎯 نظام الدرجات والنسب والقوة ═══════════
const TIERS = {
    'S+': { chance: 2, rarity: 'أسطوري أزلي+ 👑', money: 30000, exp: 10000, bonus: 60, power: 1500 },
    S: { chance: 4, rarity: 'درجة خاصة 🌟', money: 15000, exp: 5000, bonus: 40, power: 900 },
    A: { chance: 10, rarity: 'الدرجة الأولى 💎', money: 5000, exp: 2000, bonus: 25, power: 500 },
    B: { chance: 22, rarity: 'درجة مبتدئة 🔹', money: 1000, exp: 500, bonus: 10, power: 250 }
}

// ═══════════ 🗡️️ الأسلحة والدروع الملعونة (JJK فقط) ═══════════
const WEAPON_POOL = {
    'S+': [{ name: 'كاموتوكي', attack: 150 }, { name: 'هيتن', attack: 150 }, { name: 'كاتانا شق الروح', attack: 140 }, { name: 'رمح السماء المعكوس', attack: 140 }],
    S: [{ name: 'كاتانا شق الروح', attack: 100 }, { name: 'رمح السماء المعكوس', attack: 100 }, { name: 'السحابة المرحة', attack: 90 }, { name: 'عظم التنين', attack: 90 }, { name: 'سيف الجلاد', attack: 85 }],
    A: [{ name: 'كاتانا ملعونة متقدمة', attack: 50 }, { name: 'سيف الجلاد', attack: 45 }, { name: 'رمح ملعون', attack: 30 }, { name: 'قوس ملعون', attack: 30 }],
    B: [{ name: 'نصل ملعون أساسي', attack: 5 }, { name: 'كاتانا مقواة', attack: 15 }]
}
const ARMOR_POOL = {
    'S+': [{ name: 'درع ملك اللعنات', defense: 150 }],
    S: [{ name: 'درع الدرجة الخاصة', defense: 100 }],
    A: [{ name: 'درع ملعون من الدرجة الأولى', defense: 50 }, { name: 'درع الظلال', defense: 30 }],
    B: [{ name: 'سترة ملعونة أساسية', defense: 5 }, { name: 'درع ملعون مقوى', defense: 15 }]
}
const WEAPON_ATK = {}; const ARMOR_DEF = {}
Object.values(WEAPON_POOL).flat().forEach(w => (WEAPON_ATK[w.name] = w.attack))
Object.values(ARMOR_POOL).flat().forEach(a => (ARMOR_DEF[a.name] = a.defense))
const CHAR_DROP = {
    'سوكونا': ['كاموتوكي', 'هيتن'], 'سوكونا الكامل': ['كاموتوكي', 'هيتن'], 'سوكونا الهياني': ['كاموتوكي', 'هيتن'],
    'غوجو': ['درع ملك اللعنات'], 'توجي': ['رمح السماء المعكوس', 'كاتانا شق الروح', 'السحابة المرحة'],
    'ماكي': ['كاتانا شق الروح', 'عظم التنين'], 'يوتا': ['كاتانا ريكا'], 'هيجوروما': ['سيف الجلاد'],
    'كاشيمو': ['عصا كاشيمو'], 'تودو': ['السحابة المرحة'], 'مي مي': ['فأس المعركة'], 'جاكوجانجي': ['القيثارة الكهربائية'], 'مومو': ['المكنسة الطائرة']
}
WEAPON_ATK['كاتانا ريكا'] = 120; WEAPON_ATK['عصا كاشيمو'] = 100

// ═══════════ ⛏️ المعادن + 🏬 المتجر (JJK) ═══════════
const MINERALS = [
    { name: 'فحم أسود', basePrice: 1000, icon: '⬛' },
    { name: 'خام الحديد', basePrice: 5000, icon: '⚙️' },
    { name: 'شظية ذهب', basePrice: 20000, icon: '🪙' },
    { name: 'ياقوت أحمر', basePrice: 80000, icon: '🔻' },
    { name: 'ماس نقي', basePrice: 300000, icon: '💎' },
    { name: 'حجر الطاقة الملعونة', basePrice: 1500000, icon: '🔮' }
]
const SHOP = {
    'معول_فولاذي_ملعون': { cat: 'تنقيب', price: 250000, type: 'pickaxe', power: 2.5, desc: '⚙️ يزيد إنتاج المعادن والعمق x2.5' },
    'معول_ماسي_ملعون': { cat: 'تنقيب', price: 800000, type: 'pickaxe', power: 5, desc: '💎 يزيد فرصة استخراج الياقوت والماس' },
    'منقاب_الطاقة_الملعونة': { cat: 'تنقيب', price: 2000000, type: 'pickaxe', power: 12, desc: '🚜 يحفر أعماقاً سحيقة بسرعة فائقة' },
    'تميمة_الحظ_الملعونة': { cat: 'أدوات', price: 100000, type: 'buff', apply: u => { u.opBuffs.luckBonus += 50 }, desc: '🍀 تزيد الحظ في الحفر والمزاد' },
    'درع_الظلال_الملعون': { cat: 'أدوات', price: 500000, type: 'defense', apply: u => { u.opBuffs.autoShield = true }, desc: '🛡️ حماية إضافية في المبارزات (+300 قوة)' },
    'اصبع_سوكونا': { cat: '🔥 أسطوري', price: 50000000, type: 'finger', apply: u => { u.sukunaFingers = Math.min(15, u.sukunaFingers + 1) }, desc: '🖐️ أصبع سوكونا ملعون (+1 إصبع)' },
    'قلب_ماهيتو_المتحول': { cat: '🔥 أسطوري', price: 150000000, type: 'op', apply: u => { u.opBuffs.multiplier *= 10 }, desc: '🌀 يضاعف أرباح الحفر 10 أضعاف!' },
    'عين_سوكونا_الكونية': { cat: '🔥 أسطوري', price: 800000000, type: 'op', apply: u => { u.opBuffs.luckBonus += 100 }, desc: '👁️ كل حفرة تنتهي بجواهر أسطورية!' },
    'حاجز_تنجن_الأبدي': { cat: '🔥 أسطوري', price: 5000000000, type: 'op', apply: u => { u.opBuffs.immortal = true }, desc: '🛡️ حصانة مطلقة من خسارة التحديات للأبد!' }
}
const PICKAXE_POWER = { 'معول خشبي': 1, 'معول_فولاذي_ملعون': 2.5, 'معول_ماسي_ملعون': 5, 'منقاب_الطاقة_الملعونة': 12 }
const AUCTION_ITEMS = ['صندوق الأدوات الملعونة 🔮', 'تابوت الأصابع الملعونة ⚰️', 'عين اللعنة الأسطورية 👁️', 'لفافة النطاق المحرمة 📜']

// ═══════════ 🎨 Canvas ═══════════
let _canvasLib = undefined
async function getCanvasLib() { if (_canvasLib === undefined) { try { _canvasLib = await import('canvas') } catch { _canvasLib = null } } return _canvasLib }
let fontReady = false
async function ensureFonts(lib) {
    if (fontReady || !lib) return
    try {
        const reg = path.join(process.cwd(), 'src', 'fonts', 'Amiri-Regular.ttf')
        const bold = path.join(process.cwd(), 'src', 'fonts', 'Amiri-Bold.ttf')
        if (fs.existsSync(reg)) lib.registerFont(reg, { family: 'Amiri' })
        if (fs.existsSync(bold)) lib.registerFont(bold, { family: 'Amiri-Bold' })
    } catch (e) {}
    fontReady = true
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath() }
function drawCover(ctx, img, x, y, w, h) { const ir = img.width / img.height, r = w / h; let sw, sh, sx, sy; if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0 } else { sw = img.width; sh = sw / r; sx = 0; sy = (img.height - sh) / 2 } ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h) }
async function loadBg(lib) { try { if (fs.existsSync(BASE_BG)) return await lib.loadImage(BASE_BG) } catch (e) {} return null }

// ═══════════ 📌 بينترست (axios) ═══════════
const PIN_HEADERS = { 'accept': 'application/json, text/javascript, */*', 'accept-language': 'ar-EG,ar;q=0.9,en-GB;q=0.8', 'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 'x-app-version': '4f340f4', 'x-requested-with': 'XMLHttpRequest', 'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"', 'sec-ch-ua-mobile': '?1', 'sec-ch-ua-platform': '"Android"', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin', 'referer': 'https://www.pinterest.com/' }
const PIN_CACHE = {}
async function pinterestSearch(query, limit = 12) {
    if (PIN_CACHE[query]?.length) return PIN_CACHE[query]
    try {
        const params = { source_url: `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`, data: JSON.stringify({ options: { query, scope: 'pins', appliedProductFilters: '---', auto_correction_disabled: false, rs: 'typed', redux_normalize_feed: true }, context: {} }), _: Date.now() }
        const res = await axios.get('https://www.pinterest.com/resource/BaseSearchResource/get/', { params, headers: { ...PIN_HEADERS, 'x-pinterest-pws-handler': 'www/search/[scope].js', 'x-pinterest-source-url': `/search/pins/?q=${encodeURIComponent(query)}&rs=typed` }, timeout: 30000 })
        const imgs = (res.data?.resource_response?.data?.results || []).filter(p => p?.images?.orig?.url || p?.images?.['736x']?.url).slice(0, limit).map(p => p?.images?.orig?.url || p?.images?.['736x']?.url)
        if (imgs.length) PIN_CACHE[query] = imgs
        return imgs
    } catch (e) { return [] }
}

// ═══════════ 🗄️ قاعدة البيانات الموحدة ═══════════
function readRPG() {
    try {
        if (!fs.existsSync(RPG_DIR)) fs.mkdirSync(RPG_DIR, { recursive: true })
        if (!fs.existsSync(RPG_FILE)) fs.writeFileSync(RPG_FILE, JSON.stringify({ players: {}, auctions: {} }))
        let data = JSON.parse(fs.readFileSync(RPG_FILE, 'utf8'))
        if (!data.players) {
            const players = {}
            for (const k in data) { if (k !== 'auctions' && k !== '__auctions' && data[k] && typeof data[k] === 'object') players[k] = data[k] }
            data = { players, auctions: data.auctions || data.__auctions || {} }
            fs.writeFileSync(RPG_FILE, JSON.stringify(data, null, 2))
        }
        if (!data.auctions) data.auctions = {}
        return data
    } catch (e) { return { players: {}, auctions: {} } }
}
function writeRPG(data) { try { fs.writeFileSync(RPG_FILE, JSON.stringify(data, null, 2)) } catch (e) {} }
function savePlayer(sender, p) { const db = readRPG(); db.players[sender] = p; writeRPG(db) }
function defaultPlayer() {
    return { inventory: { weapons: [], shields: [], characters: [], items: [] }, equipped: { weapon: 'قبضة اليد', shield: 'بدون', character: null }, wheelData: { lastSpin: 0, spins: DEFAULT_SPINS }, pendingSpin: null, money: 5000, exp: 0, minerals: [], pickaxe: 'معول خشبي', depth: 1, sukunaFingers: 0, lastDig: 0, opBuffs: { multiplier: 1, luckBonus: 0, autoShield: false, immortal: false } }
}
function getPlayer(sender) {
    const db = readRPG()
    const d = defaultPlayer()
    const p = { ...d, ...(db.players[sender] || {}) }
    p.inventory = { ...d.inventory, ...(p.inventory || {}) }
    p.equipped = { ...d.equipped, ...(p.equipped || {}) }
    p.wheelData = { ...d.wheelData, ...(p.wheelData || {}) }
    p.opBuffs = { ...d.opBuffs, ...(p.opBuffs || {}) }
    if (!Array.isArray(p.inventory.weapons)) p.inventory.weapons = []
    if (!Array.isArray(p.inventory.shields)) p.inventory.shields = []
    if (!Array.isArray(p.inventory.characters)) p.inventory.characters = []
    if (!Array.isArray(p.inventory.items)) p.inventory.items = []
    if (!Array.isArray(p.minerals)) p.minerals = []
    return p
}
const playerLevel = (exp) => Math.floor(Math.sqrt((exp || 0) / 100)) + 1
function playerGrade(level) { if (level >= 100) return 'SPECIAL GRADE+ 👑'; if (level >= 51) return 'SPECIAL GRADE 🌟'; if (level >= 36) return 'GRADE 1 💎'; if (level >= 21) return 'GRADE 2 🔷'; if (level >= 11) return 'GRADE 3 🔹'; return 'GRADE 4 ▫️' }

// ═══════════ 🩸 شخصيات JJK (42) ═══════════
const JJK_CHARS = [
    { name: 'سوكونا', en: 'Ryomen Sukuna', tier: 'S+', tech: 'الضريح', domain: 'المذبح الشرير' },
    { name: 'سوكونا الكامل', en: 'Sukuna full form', tier: 'S+', tech: 'الضريح + الظلال العشر', domain: 'المذبح الشرير' },
    { name: 'سوكونا الهياني', en: 'Ryomen Sukuna Heian', tier: 'S+', tech: 'الضريح', domain: 'المذبح الشرير' },
    { name: 'غوجو', en: 'Satoru Gojo', tier: 'S+', tech: 'اللامحدود', domain: 'الفراغ اللانهائي' },
    { name: 'يوتا', en: 'Yuta Okkotsu', tier: 'S', tech: 'النسخ', domain: 'الحب المتبادل الأصيل' },
    { name: 'تشوسو', en: 'Choso Jujutsu Kaisen', tier: 'S', tech: 'التلاعب بالدم', domain: null },
    { name: 'ماهيتو', en: 'Mahito Jujutsu Kaisen', tier: 'S', tech: 'التحويل الخامل', domain: 'التجسيد الذاتي للكمال' },
    { name: 'جوجو', en: 'Jogo Jujutsu Kaisen', tier: 'S', tech: 'لهب الكارثة', domain: 'تابوت الجبل الحديدي' },
    { name: 'داجون', en: 'Dagon Jujutsu Kaisen', tier: 'S', tech: 'مد الكارثة', domain: 'أفق السكاندا الآسر' },
    { name: 'هانامي', en: 'Hanami Jujutsu Kaisen', tier: 'S', tech: 'نباتات الكارثة', domain: null },
    { name: 'كينجاكو', en: 'Kenjaku Jujutsu Kaisen', tier: 'S', tech: 'التلاعب بالأرواح', domain: 'وفرة الرحم' },
    { name: 'يوكي', en: 'Yuki Tsukumo', tier: 'S', tech: 'غضب النجم', domain: null },
    { name: 'ماكي', en: 'Maki Zenin', tier: 'S', tech: 'القيد السماوي', domain: null },
    { name: 'توجي', en: 'Toji Fushiguro', tier: 'S', tech: 'القيد السماوي', domain: null },
    { name: 'كاشيمو', en: 'Hajime Kashimo', tier: 'S', tech: 'كهرمان الوحش الأسطوري', domain: null },
    { name: 'اورامي', en: 'Uraume Jujutsu Kaisen', tier: 'S', tech: 'تشكيل الجليد', domain: null },
    { name: 'تنجن', en: 'Master Tengen', tier: 'S', tech: 'تقنيات الحواجز', domain: null },
    { name: 'ميغومي', en: 'Megumi Fushiguro', tier: 'A', tech: 'الظلال العشر', domain: 'حديقة الظلال الكيميرا' },
    { name: 'ايتادوري', en: 'Yuji Itadori', tier: 'A', tech: 'التلاعب بالدم', domain: 'المذبح الشرير' },
    { name: 'هاكاري', en: 'Kinji Hakari', tier: 'A', tech: 'قمار الموت الخامل', domain: 'قمار الموت الخامل' },
    { name: 'هيجوروما', en: 'Hiromi Higuruma', tier: 'A', tech: 'الحكم المميت', domain: 'الحكم المميت' },
    { name: 'تودو', en: 'Aoi Todo', tier: 'A', tech: 'بوغي ووغي', domain: null },
    { name: 'اينوماكي', en: 'Toge Inumaki', tier: 'A', tech: 'الكلام الملعون', domain: null },
    { name: 'ميكامارو', en: 'Kokichi Muta Mechamaru', tier: 'A', tech: 'التلاعب بالدمى', domain: null },
    { name: 'تاكاكو اورو', en: 'Takako Uro', tier: 'A', tech: 'التلاعب بالسماء', domain: null },
    { name: 'ريو ايشيغوري', en: 'Ryu Ishigori', tier: 'A', tech: 'تفريغ الطاقة', domain: null },
    { name: 'يوروزو', en: 'Yorozu Jujutsu Kaisen', tier: 'A', tech: 'البناء', domain: 'العذاب الثلاثي' },
    { name: 'نوريتوشي', en: 'Noritoshi Kamo', tier: 'A', tech: 'التلاعب بالدم', domain: null },
    { name: 'كوساكابي', en: 'Atsuya Kusakabe', tier: 'A', tech: 'أسلوب الظل الجديد', domain: 'نطاق بسيط' },
    { name: 'مي مي', en: 'Mei Mei Jujutsu Kaisen', tier: 'A', tech: 'الطيور السوداء', domain: null },
    { name: 'باندا', en: 'Panda Jujutsu Kaisen', tier: 'B', tech: 'الجثث الملعونة', domain: null },
    { name: 'ميوا', en: 'Kasumi Miwa', tier: 'B', tech: 'أسلوب الظل الجديد', domain: 'نطاق بسيط' },
    { name: 'مومو', en: 'Momo Nishimiya', tier: 'B', tech: 'التلاعب بالأدوات', domain: null },
    { name: 'تاكابا', en: 'Fumihiko Takaba', tier: 'B', tech: 'الكوميديان', domain: null },
    { name: 'اينو', en: 'Takuma Ino', tier: 'B', tech: 'الوحوش المباركة', domain: null },
    { name: 'جاكوجانجي', en: 'Yoshinobu Gakuganji', tier: 'B', tech: 'الموسيقى الملعونة', domain: null },
    { name: 'ايسو', en: 'Eso Jujutsu Kaisen', tier: 'B', tech: 'تقنية التعفن', domain: null },
    { name: 'كيتشيزو', en: 'Kechizu Jujutsu Kaisen', tier: 'B', tech: 'تقنية التعفن', domain: null },
    { name: 'كوروروشي', en: 'Kurourushi Jujutsu Kaisen', tier: 'B', tech: 'التحكم بالحشرات', domain: null },
    { name: 'ريجي', en: 'Reggie Star Jujutsu Kaisen', tier: 'B', tech: 'إعادة التعاقد', domain: null },
    { name: 'تشارلز', en: 'Charles Bernard Jujutsu Kaisen', tier: 'B', tech: 'عصا الحرب G', domain: null },
    { name: 'هازينوكي', en: 'Hajime Hazenoki', tier: 'B', tech: 'اللحم المتفجر', domain: null }
]
function getCharacters() {
    const chars = JJK_CHARS.map(c => ({ ...c, chance: TIERS[c.tier].chance, rarity: TIERS[c.tier].rarity, money: TIERS[c.tier].money, exp: TIERS[c.tier].exp, power: TIERS[c.tier].power }))
    const total = chars.reduce((s, c) => s + c.chance, 0)
    chars.forEach(c => (c.percent = ((c.chance / total) * 100).toFixed(2)))
    return chars
}
function pickCharacter(chars) { const total = chars.reduce((s, c) => s + c.chance, 0); let r = Math.random() * total; for (const c of chars) { if (r < c.chance) return c; r -= c.chance } return chars[chars.length - 1] }
function charData(name) { return getCharacters().find(x => x.name === name) || null }
function rollItem(tier, charName) {
    const spec = CHAR_DROP[charName]
    if (spec && Math.random() < 0.75) {
        const n = spec[Math.floor(Math.random() * spec.length)]
        if (WEAPON_ATK[n] !== undefined) return { type: 'weapons', name: n }
        if (ARMOR_DEF[n] !== undefined) return { type: 'shields', name: n }
    }
    if (Math.random() < 0.5) { const p = WEAPON_POOL[tier] || WEAPON_POOL.B; return { type: 'weapons', name: p[Math.floor(Math.random() * p.length)].name } }
    const p = ARMOR_POOL[tier] || ARMOR_POOL.B
    return { type: 'shields', name: p[Math.floor(Math.random() * p.length)].name }
}
async function resolveCharacterImage(char) {
    const pins = await pinterestSearch(`${char.en} Jujutsu Kaisen icon`)
    if (pins.length) return pins[Math.floor(Math.random() * Math.min(pins.length, 8))]
    const pins2 = await pinterestSearch(char.en)
    if (pins2.length) return pins2[Math.floor(Math.random() * Math.min(pins2.length, 8))]
    return FALLBACK_IMAGE
}
function extractTarget(m, args) {
    if (m.mentionedJid && m.mentionedJid[0]) return m.mentionedJid[0]
    if (m.quoted?.sender) return m.quoted.sender
    const dig = (args || []).join(' ').match(/@(\d{5,15})/)
    if (dig) return dig[1] + '@s.whatsapp.net'
    return null
}
const cleanCharName = (args) => (args || []).join(' ').replace(/@(\d+)(?::\d+)?/g, '').replace(/\s+/g, ' ').trim()

// ═══════════ 🎴 بطاقات Canvas ═══════════
async function generateWheelCard(d) {
    const lib = await getCanvasLib(); if (!lib) return null; await ensureFonts(lib)
    try {
        const { createCanvas, loadImage } = lib
        const W = 1000, H = 1450, canvas = createCanvas(W, H), ctx = canvas.getContext('2d')
        const color = TIER_COLORS[d.tier] || '#60A5FA'
        const bg = await loadBg(lib)
        if (bg) drawCover(ctx, bg, 0, 0, W, H)
        else { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0f0c29'); g.addColorStop(1, '#24243e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H) }
        const ov = ctx.createLinearGradient(0, 0, 0, H); ov.addColorStop(0, 'rgba(0,0,0,0.55)'); ov.addColorStop(1, 'rgba(0,0,0,0.92)'); ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
        ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 54px "Amiri-Bold"'; ctx.fillText('عجلة الجوجوتسو', W / 2, 90)
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '34px Amiri'; ctx.fillText(`المقاتل: ${d.playerName}`, W / 2, 145)
        const IX = 180, IY = 185, IS = 640
        let cimg = null; try { cimg = await loadImage(d.imgSource) } catch (e) {}
        ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 45; roundRect(ctx, IX - 10, IY - 10, IS + 20, IS + 20, 40); ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.stroke(); ctx.restore()
        ctx.save(); roundRect(ctx, IX, IY, IS, IS, 32); ctx.clip()
        if (cimg) drawCover(ctx, cimg, IX, IY, IS, IS)
        else { ctx.fillStyle = '#1a1a2e'; ctx.fillRect(IX, IY, IS, IS); ctx.fillStyle = color; ctx.font = 'bold 160px "Amiri-Bold"'; ctx.fillText(d.charName.charAt(0), IX + IS / 2, IY + IS / 2 + 55) }
        ctx.restore()
        ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 25; roundRect(ctx, 150, 875, 700, 110, 30); ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke(); ctx.restore()
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 58px "Amiri-Bold"'; ctx.fillText(d.charName, W / 2, 950)
        ctx.fillStyle = color; ctx.font = 'bold 42px "Amiri-Bold"'; ctx.fillText(d.rarity, W / 2, 1055)
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '34px Amiri'
        if (d.tech) ctx.fillText(`التقنية الملعونة: ${d.tech}`, W / 2, 1110)
        if (d.domain) ctx.fillText(`النطاق: ${d.domain}`, W / 2, 1160)
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '32px Amiri'
        ctx.fillText(`نسبة الظهور: ${d.percent}%  |  الجائزة: ${d.money}$`, W / 2, 1220)
        if (d.itemName) ctx.fillText(`الأداة: ${d.itemName}`, W / 2, 1270)
        ctx.fillText(`اللفات المتبقية: ${d.spins}`, W / 2, 1320)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '30px Amiri'; ctx.fillText(d.botName, W / 2, H - 45)
        return canvas.toBuffer('image/jpeg', { quality: 0.9 })
    } catch (e) { return null }
}
async function generateBattleCard(d) {
    const lib = await getCanvasLib(); if (!lib) return null; await ensureFonts(lib)
    try {
        const { createCanvas, loadImage } = lib
        const W = 1200, H = 760, canvas = createCanvas(W, H), ctx = canvas.getContext('2d')
        const bg = await loadBg(lib)
        if (bg) drawCover(ctx, bg, 0, 0, W, H); else { ctx.fillStyle = '#16090b'; ctx.fillRect(0, 0, W, H) }
        const ov = ctx.createLinearGradient(0, 0, 0, H); ov.addColorStop(0, 'rgba(120,0,0,0.45)'); ov.addColorStop(1, 'rgba(0,0,0,0.92)'); ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
        ctx.textAlign = 'center'; ctx.fillStyle = '#FFD700'; ctx.font = 'bold 56px "Amiri-Bold"'; ctx.fillText('معركة الساحة', W / 2, 80)
        const drawFighter = async (x, f, isWinner) => {
            let img = null; try { img = await loadImage(f.img) } catch (e) {}
            ctx.save(); if (isWinner) { ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 50 }
            ctx.beginPath(); ctx.arc(x, 330, 150, 0, Math.PI * 2); ctx.strokeStyle = isWinner ? '#FFD700' : 'rgba(255,255,255,0.4)'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore()
            ctx.save(); ctx.beginPath(); ctx.arc(x, 330, 142, 0, Math.PI * 2); ctx.clip()
            if (img) drawCover(ctx, img, x - 142, 188, 284, 284)
            else { ctx.fillStyle = '#3b0d0d'; ctx.fillRect(x - 142, 188, 284, 284); ctx.fillStyle = '#fff'; ctx.font = 'bold 100px "Amiri-Bold"'; ctx.fillText(f.name.charAt(0), x, 365) }
            ctx.restore()
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 40px "Amiri-Bold"'; ctx.fillText(f.name, x, 540)
            ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '30px Amiri'
            ctx.fillText(`الشخصية: ${f.char}`, x, 585); ctx.fillText(`القوة: ${f.power}`, x, 625)
            if (isWinner) { ctx.fillStyle = '#FFD700'; ctx.font = 'bold 34px "Amiri-Bold"'; ctx.fillText('★ الفائز ★', x, 680) }
        }
        await drawFighter(300, d.p1, d.p1.win); await drawFighter(900, d.p2, d.p2.win)
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 90px "Amiri-Bold"'; ctx.shadowColor = '#000'; ctx.shadowBlur = 15; ctx.fillText('VS', W / 2, 360); ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '30px Amiri'; ctx.fillText(d.botName, W / 2, H - 30)
        return canvas.toBuffer('image/jpeg', { quality: 0.9 })
    } catch (e) { return null }
}
async function generateVaultCard(d) {
    const lib = await getCanvasLib(); if (!lib) return null; await ensureFonts(lib)
    try {
        const { createCanvas, loadImage } = lib
        const W = 1000, H = 1150, canvas = createCanvas(W, H), ctx = canvas.getContext('2d')
        const bg = await loadBg(lib)
        if (bg) drawCover(ctx, bg, 0, 0, W, H)
        else { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0b1e2d'); g.addColorStop(1, '#101028'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H) }
        const ov = ctx.createLinearGradient(0, 0, 0, H); ov.addColorStop(0, 'rgba(0,0,0,0.5)'); ov.addColorStop(1, 'rgba(0,0,0,0.92)'); ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
        let img = null; try { img = await loadImage(d.img) } catch (e) {}
        ctx.save(); ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(W / 2, 200, 130, 0, Math.PI * 2); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 7; ctx.stroke(); ctx.restore()
        ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 200, 122, 0, Math.PI * 2); ctx.clip()
        if (img) drawCover(ctx, img, W / 2 - 122, 78, 244, 244)
        else { ctx.fillStyle = '#123'; ctx.fillRect(W / 2 - 122, 78, 244, 244); ctx.fillStyle = '#fff'; ctx.font = 'bold 90px "Amiri-Bold"'; ctx.fillText(d.name.charAt(0), W / 2, 230) }
        ctx.restore()
        ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 50px "Amiri-Bold"'; ctx.fillText(d.name, W / 2, 390)
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 32px "Amiri-Bold"'; ctx.fillText(`درجتك: ${d.grade} | مستوى ${d.level}`, W / 2, 440)
        const boxes = [{ t: 'الشخصيات', v: d.chars, c: '#FFD700' }, { t: 'الأسلحة', v: d.weapons, c: '#F87171' }, { t: 'الدروع', v: d.shields, c: '#60A5FA' }]
        boxes.forEach((b, i) => { const x = 90 + i * 290; roundRect(ctx, x, 480, 250, 150, 24); ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fill(); ctx.strokeStyle = b.c; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = b.c; ctx.font = 'bold 52px "Amiri-Bold"'; ctx.fillText(String(b.v), x + 125, 555); ctx.fillStyle = '#ffffff'; ctx.font = '30px Amiri'; ctx.fillText(b.t, x + 125, 605) })
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 38px "Amiri-Bold"'; ctx.fillText(`الرصيد: ${d.money}$`, W / 2, 700)
        ctx.fillStyle = '#F87171'; ctx.font = 'bold 34px "Amiri-Bold"'; ctx.fillText(`أصابع سوكونا: ${d.fingers} / 15 🖐️`, W / 2, 755)
        ctx.fillStyle = '#60A5FA'; ctx.font = 'bold 34px "Amiri-Bold"'; ctx.fillText(`اللفات المتبقية: ${d.spins} 🎟️ | المعادن: ${d.minerals}`, W / 2, 810)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '30px Amiri'; ctx.fillText(`المجهز: ${d.weapon} | ${d.shield}`, W / 2, 870)
        ctx.fillText(`الشخصية المجهزة: ${d.character || 'بدون'}`, W / 2, 915)
        if (d.pending) { ctx.fillStyle = '#F87171'; ctx.fillText(`⏳ شخصية مستنية الاستلام: ${d.pending}`, W / 2, 965) }
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '30px Amiri'; ctx.fillText(d.botName, W / 2, H - 40)
        return canvas.toBuffer('image/jpeg', { quality: 0.9 })
    } catch (e) { return null }
}

// ═══════════ 📤 إرسال تفاعلي (بيبعت Reply حقيقي على رسالة العضو) ═══════════
const qBtn = (label, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: label, id }) })
async function sendInteractive(conn, m, { buffer, imageUrl, caption, buttons, mentions, sections }) {
    const nativeButtons = [...(buttons || [])]
    if (sections) nativeButtons.unshift({ name: 'single_select', buttonParamsJson: JSON.stringify({ title: sections.title, sections: [{ title: sections.header, rows: sections.rows }], has_multiple_buttons: true }) })
    const payload = {
        header: { hasMediaAttachment: false },
        body: { text: caption, ...(mentions?.length ? { contextInfo: { mentionedJid: mentions } } : {}) },
        footer: { text: `🕸 ${global.botname || 'Sukuna Bot'} 🕸` },
        nativeFlowMessage: { buttons: nativeButtons },
        messageParamsJson: '｢🔱SUKUNA🩸BOT｣'
    }
    try {
        const media = await prepareWAMessageMedia(buffer ? { image: buffer } : { image: { url: imageUrl || FALLBACK_IMAGE } }, { upload: conn.waUploadToServer })
        payload.header = { hasMediaAttachment: true, imageMessage: media.imageMessage }
    } catch (e) {}
    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

// ═══════════ 🎯 الموجه الداخلي (بيستخدم للأوامر المكتوبة وللأزرار) ═══════════
async function runRpg(conn, m, command, args, text, isOwner, pfx) {
    const sender = m.sender || m.key?.participant || m.chat
    let name = m.pushName || 'مقاتل'
    try { name = (await conn.getName(sender)) || name } catch (e) {}
    const botName = `🕸 ${global.botname || 'Sukuna Bot'} 🕸`
    const react = async (emoji) => { try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch (e) {} }

    const rpg = getPlayer(sender)
    const inv = rpg.inventory
    const eq = rpg.equipped
    const wheel = rpg.wheelData

    // ───────── 🎁 إهداء لفات (مطورين) ─────────
    if (command === 'هدي' || command === 'جفت') {
        if (!isOwner) return m.reply(`*❆│·••━━⊰👑⊱━━••·│❆*\n│┊❌ الأمر ده للمطورين بس يا وحش!\n*❆│·••━━⊰👑⊱━━••·│❆*`)
        let target = extractTarget(m, args)
        if (!target) return m.reply(`*~❍━═══━⚞🎁≽━═══━❍~*\n│┊📝 الاستخدام: \`${pfx}هدي 10 @منشن\`\n*~❍━═══━⚞🎁≽━═══━❍~*`)
        let num = parseInt(args.find(a => /^\d+$/.test(a)) || '5')
        if (isNaN(num) || num < 1) num = 5; if (num > 100) num = 100
        const t = getPlayer(target); t.wheelData.spins = (t.wheelData.spins || 0) + num; savePlayer(target, t)
        return m.reply(`*~❍━═══━⚞🎁≽━═══━❍~*\n│┊✅ تم إهداء *${num}* لفة╿↶\n│┊👤 لـ: @${target.split('@')[0]}\n│┊🎟️ رصيده: ${t.wheelData.spins}\n*~❍━═══━⚞🎁≽━═══━❍~*`, null, { mentions: [target] })
    }

    // ───────── 🎟️ فحص اللفات ─────────
    if (command === 'لفات' || command === 'لفاتي') {
        return m.reply(`*~❍━═══━⚞🎟️━═══━❍~*\n│┊👤 المقاتل: *${name}*\n│┊🎟️ اللفات: *${wheel.spins}*\n│┊⏳ مستنية: ${rpg.pendingSpin ? rpg.pendingSpin.name : 'لا يوجد'}\n*~❍━═══━⚞️≽━═══━❍~*`)
    }

    // ───────── ✅ استلام الشخصية المعلقة ─────────
    if (command === 'اخذ' || command === 'خذ' || command === 'استلام') {
        const pd = rpg.pendingSpin
        if (!pd) return m.reply(`*~❍━═══━⚞⚠️≽━═══━❍~*\n│┊❌ مفيش شخصية مستنية! لف بـ \`${pfx}عجلة\`\n*~❍━═══━⚞️≽━═══━❍~*`)
        rpg.money += pd.money; rpg.exp += pd.exp
        let charMsg = inv.characters.includes(pd.name) ? 'كانت موجودة مسبقاً' : 'تمت إضافتها لخزانتك 🎒'
        if (!inv.characters.includes(pd.name)) inv.characters.push(pd.name)
        let itemMsg = 'لا يوجد'
        if (pd.item) { const already = inv[pd.item.type].includes(pd.item.name); if (!already) inv[pd.item.type].push(pd.item.name); itemMsg = `${pd.item.type === 'weapons' ? '🗡️' : '🛡️'} ${pd.item.name}${already ? ' (موجود)' : ''}` }
        rpg.pendingSpin = null; savePlayer(sender, rpg)
        const t = `*~❍━═══━⚞✅≽━═══━❍~*\n│┊🌀 *[ ${pd.name} ]* — ${charMsg}\n│┊✨ \`${pd.rarity}\`\n│┊🎁 ${itemMsg}\n│┊🏦 +${pd.money}$ │ 💰 ${rpg.money}$\n*~❍━═══━⚞✅━═══━❍~*`
        const buttons = [qBtn('🎒 الخزانة', `${pfx}خزانتي`), qBtn('⚔️ تجهيز تلقائي', `${pfx}تلقائي`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🎒 الحقيبة الشاملة (قائمة منسدلة + بطاقة) ─────────
    if (['حقيبتي', 'حقيبة', 'مخزني', 'inv', 'ادوات', 'أدوات', 'معدات'].includes(command)) {
        await react('🎒')
        let pp = null; try { pp = await conn.profilePictureUrl(sender, 'image') } catch (e) {}
        const totalMinerals = rpg.minerals.reduce((a, x) => a + (x.qty || 1), 0)
        const card = await generateVaultCard({ name, img: pp || FALLBACK_IMAGE, chars: inv.characters.length, weapons: inv.weapons.length, shields: inv.shields.length, money: rpg.money, fingers: rpg.sukunaFingers, spins: wheel.spins, minerals: totalMinerals, level: playerLevel(rpg.exp), grade: playerGrade(playerLevel(rpg.exp)), pending: rpg.pendingSpin?.name || null, weapon: eq.weapon, shield: eq.shield, character: eq.character, botName })
        let t = `*⎔⋅•━━╼╃⌬〔🎒〕⌬╄╾━━•⋅⎔*\n`
        t += `⌗› حـقـيـبـة الـمـقـاتـل الـشـامـلـة  ˼˹\n`
        t += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        t += `│┊👤 المقاتل: *${name}*\n`
        t += `│┊🎖️ الدرجة: \`${playerGrade(playerLevel(rpg.exp))}\`\n`
        t += `│┊💳 الرصيد: \`${rpg.money.toLocaleString()}$\`\n`
        t += `│┊🖐️ الأصابع: [ ${rpg.sukunaFingers} / 15 ]\n`
        t += `│┊⛏️ المعول: \`${rpg.pickaxe}\` | العمق: \`${rpg.depth}m\`\n`
        t += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        t += `│┊🎭 شخصيات: ${inv.characters.length} │ 🗡️ أسلحة: ${inv.weapons.length} │ 🛡️ دروع: ${inv.shields.length}\n`
        t += `│┊💎 معادن: ${totalMinerals} │ 📦 أدوات: ${inv.items.length}\n`
        t += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        t += `> ˼‏📂˹ افتح القائمة بالأسفل واستعرض كل قسم بدقة!`
        const buttons = [
            qBtn('🎰 العجلة', `${pfx}عجلة`),
            qBtn('⛏️ حفر', `${pfx}حفر`),
            qBtn('🏬 المتجر', `${pfx}المتجر`),
            qBtn('⚡ تلقائي', `${pfx}تلقائي`)
        ]
        const sections = {
            title: '📂 أقسام الحقيبة',
            header: '⛩️ خزينة الأعتدة السوكونية ⛩️',
            rows: [
                { title: `🎭 قسم الشخصيات [ ${inv.characters.length} ]`, description: 'أرشيف الأبطال والكيانات النادرة', id: `${pfx}خزانتي` },
                { title: `🗡️ قسم الأسلحة [ ${inv.weapons.length} ]`, description: 'أسلحة الدمار ودرجات قوتها', id: `${pfx}اسلحة` },
                { title: `🛡️ قسم الدروع [ ${inv.shields.length} ]`, description: 'دروع الحماية المنيعة', id: `${pfx}دروع` },
                { title: `💎 قسم المعادن [ ${totalMinerals} ]`, description: 'جواهر الأعماق المستخرجة', id: `${pfx}معادن` },
                { title: `📦 قسم الأدوات [ ${inv.items.length} ]`, description: 'التمائم والقطع الخاصة', id: `${pfx}أدواتي` }
            ]
        }
        try { if (card) return await sendInteractive(conn, m, { buffer: card, caption: t, buttons, sections }); return await sendInteractive(conn, m, { caption: t, buttons, sections }) }
        catch (e) { return m.reply(t) }
    }

    // ───────── 👤 الخزانة / البروفايل ─────────
    if (['خزانتي', 'شخصياتي', 'بروفايلي', 'profile'].includes(command)) {
        let pp = null; try { pp = await conn.profilePictureUrl(sender, 'image') } catch (e) {}
        const card = await generateVaultCard({ name, img: pp || FALLBACK_IMAGE, chars: inv.characters.length, weapons: inv.weapons.length, shields: inv.shields.length, money: rpg.money, fingers: rpg.sukunaFingers, spins: wheel.spins, minerals: rpg.minerals.reduce((a, x) => a + (x.qty || 1), 0), level: playerLevel(rpg.exp), grade: playerGrade(playerLevel(rpg.exp)), pending: rpg.pendingSpin?.name || null, weapon: eq.weapon, shield: eq.shield, character: eq.character, botName })
        let t = `*❰┉━━━✣⊰🎒✣━━━❱*\n› خـزانـة الـمـقـاتـل  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n`
        t += `│┊👤 *${name}* │ 🎖️ \`${playerGrade(playerLevel(rpg.exp))}\`\n`
        if (rpg.pendingSpin) t += `│┊⏳ مستنية: *[ ${rpg.pendingSpin.name} ]* — خدها بـ \`${pfx}اخذ\`\n`
        t += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        if (!inv.characters.length) t += `│┊❌ لا تملك شخصيات — لف بـ \`${pfx}عجلة\`!\n`
        else inv.characters.forEach((c, i) => { const cd = charData(c); t += `│┊${NUMS[i] || '•'} *${c}* ⚡${cd?.power || 0}\n` })
        t += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n> ˼⚔️˹ للقتال: \`${pfx}قاتل <الشخصية> @منشن\``
        const buttons = [qBtn('🎰 العجلة', `${pfx}عجلة`), qBtn('⚡ تلقائي', `${pfx}تلقائي`), qBtn('🎒 الحقيبة', `${pfx}حقيبتي`)]
        try { if (card) return await sendInteractive(conn, m, { buffer: card, caption: t, buttons }); return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🗡️ الأسلحة ─────────
    if (command === 'اسلحة' || command === 'أسلحة') {
        let t = `*⋄━─═⊰🗡️⊱═─━⋄*\n⌗› تـرسـانـة الأسـلـحـة  ˼˹\n*⋄•─๋︩︪╾─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n`
        if (!inv.weapons.length) t += `│┊❌ لا تملك أسلحة — لف العجلة أو اشترِ من المتجر!\n`
        else inv.weapons.forEach((w, i) => { t += `│┊${NUMS[i] || '•'} *${w}* ⚔️${WEAPON_ATK[w] || 0}${eq.weapon === w ? ' ✅' : ''}\n` })
        t += `┤└─ׅ─ׅ┈ ๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n> ˼‏📜˹ للتجهيز: \`${pfx}تجهيز ${inv.weapons[0] || 'اسم السلاح'}\``
        const buttons = [qBtn('🎒 الحقيبة', `${pfx}حقيبتي`), qBtn('🎰 العجلة', `${pfx}عجلة`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🛡️ الدروع ─────────
    if (command === 'دروع' || command === 'الدرع') {
        let t = `*⋄━─═⊰🛡️⊱═─⋄━⋄*\n⌗› خـزانـة الـدروع  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n`
        if (!inv.shields.length) t += `│┊❌ لا تملك دروعاً — لف العجلة أو اشترِ من المتجر!\n`
        else inv.shields.forEach((s, i) => { t += `│┊${NUMS[i] || '•'} *${s}* 🛡️${ARMOR_DEF[s] || 0}${eq.shield === s ? ' ✅' : ''}\n` })
        t += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪ـ\n> ˼📜˹ للتجهيز: \`${pfx}تجهيز ${inv.shields[0] || 'اسم الدرع'}\``
        const buttons = [qBtn('🎒 الحقيبة', `${pfx}حقيبتي`), qBtn('🎰 العجلة', `${pfx}عجلة`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 💎 المعادن + البيع ─────────
    if (command === 'معادن') {
        let t = `*~❍━═══━⚞💎━═══━❍~*\n⌗› خـزيـنـة الـمـعـادن  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︪•⋄*\n`
        if (!rpg.minerals.length) t += `│┊❌ حقيبة المعادن فارغة — احفر بـ \`${pfx}حفر\`!\n`
        else rpg.minerals.forEach((x, i) => { t += `│┊${x.icon} *${x.name}* x${x.qty} — 💰${x.price.toLocaleString()}$\n` })
        t += `*~❍━═══━⚞≽━═══━~*`
        const buttons = [qBtn('💰 بيع الكل', `${pfx}بيع_المعادن`), qBtn('⛏️ حفر', `${pfx}حفر`), qBtn('🎒 الحقيبة', `${pfx}حقيبتي`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }
    if (command === 'بيع_المعادن' || command === 'بيع') {
        if (!rpg.minerals.length) return m.reply(`*~❍━═══━⚞❌━═══━❍~*\n│┊❌ حقيبة المعادن فارغة!\n*~❍━═══━⚞≽━═══━~*`)
        let total = 0; rpg.minerals.forEach(i => total += i.price)
        rpg.money += total; rpg.minerals = []; savePlayer(sender, rpg)
        return m.reply(`*~❍━═══━⚞💰━═══━❍~*\n│┊💵 تم بيع كل المعادن!╿↶\n│┊➕ +${total.toLocaleString()}$\n│┊💰 رصيدك: ${rpg.money.toLocaleString()}$\n*~❍━═══━⚞💰≽━═══━❍~*`)
    }

    // ─────────  الأدوات ─────────
    if (command === 'أدواتي' || command === 'عنصري') {
        let t = `*~❍━═══━⚞📦≽━═══━❍~*\n⌗› الـأدوات والـتمـائم  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n`
        if (!inv.items.length) t += `│┊❌ لا تملك أدوات — تفقد المتجر بـ \`${pfx}المتجر\`!\n`
        else inv.items.forEach((x, i) => { t += `│┊${NUMS[i] || '•'} *${x}*\n` })
        t += `│┊🌀 مضاعف الأرباح: x${rpg.opBuffs.multiplier} │ 🍀 حظ: +${rpg.opBuffs.luckBonus}\n*~❍━═══━⚞≽━═══━❍~*`
        const buttons = [qBtn('🏬 المتجر', `${pfx}المتجر`), qBtn('🎒 الحقيبة', `${pfx}حقيبتي`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── ⛏️ الحفر ─────────
    if (command === 'حفر' || command === 'تنقيب' || command === 'dig') {
        const cd = 20000
        if (Date.now() - (rpg.lastDig || 0) < cd && !isOwner) return m.reply(`*~❍━═══━⚞⏳━═══━❍~*\n│┊⏳ خد نفس! استنى \`${Math.ceil((cd - (Date.now() - rpg.lastDig)) / 1000)}\` ثانية\n*~❍━═══━⚞≽━═══━❍~*`)
        await react('⛏️')
        rpg.lastDig = Date.now()
        const pPower = PICKAXE_POWER[rpg.pickaxe] || 1
        rpg.depth += Math.floor(Math.random() * 5 * pPower) + 1
        const luck = (Math.random() * pPower) + (rpg.depth / 20) + (rpg.opBuffs.luckBonus || 0)
        const mIdx = luck > 90 ? 5 : luck > 50 ? 4 : luck > 25 ? 3 : luck > 10 ? 2 : luck > 4 ? 1 : 0
        const found = MINERALS[mIdx]
        const qty = Math.floor((Math.random() * 3) + 1) * (rpg.opBuffs.multiplier || 1)
        const totalPrice = Math.floor(found.basePrice * qty * (rpg.opBuffs.multiplier || 1))
        rpg.minerals.push({ name: found.name, icon: found.icon, qty, price: totalPrice })
        let fingerMsg = ''
        if (Math.random() <= 0.05 && rpg.sukunaFingers < 15) { rpg.sukunaFingers += 1; fingerMsg = `\n│┊🖐️ *إنجاز أسطوري:* لقيت أصبع سوكونا في العمق! [ ${rpg.sukunaFingers} / 15 ]` }
        savePlayer(sender, rpg)
        const t = `*~❍━═══━⚞⛏️≽━═══━❍~*\n⌗› عـمـلـيـة الـحـفـر  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n│┊🧱 العمق: ${rpg.depth} متر\n│┊${found.icon} المكتشف: *${found.name}* x${qty}\n│┊💰 القيمة: ${totalPrice.toLocaleString()}$${fingerMsg}\n┤└─ׅ─ׅ┈ ๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n> ˼‏˹ راجع معادنك وبِعها بـ \`${pfx}معادن\``
        const buttons = [qBtn('💎 المعادن', `${pfx}معادن`), qBtn('⛏️ حفر تاني', `${pfx}حفر`), qBtn('🏬 المتجر', `${pfx}المتجر`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🏬 المتجر + الشراء ─────────
    if (['المتجر', 'متجر', 'شوب', 'shop'].includes(command)) {
        let t = `*~❍━═══━⚞≽━═══━❍~*\n⌗› مـتـجـر سـوكـونـا الـشـامـل  ˼˹\n*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•*\n│┊💳 رصيدك: \`${rpg.money.toLocaleString()}$\`\n`
        for (const cat of ['تنقيب', 'أدوات', '🔥 أسطوري']) {
            t += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ ❬ ${cat} ❭\n`
            for (const k in SHOP) if (SHOP[k].cat === cat) t += `│┊🔹 \`${k}\` — 💰${SHOP[k].price.toLocaleString()}$\n│┊   └ ${SHOP[k].desc}\n`
        }
        t += `┤└─ׅ─ׅ┈ ๋︩︪──ׅ─ׅ┈ ─๋︩︪ـ\n> ˼🛒˹ للشراء: \`${pfx}شراء اسم_العنصر\``
        const buttons = [qBtn('🎒 الحقيبة', `${pfx}حقيبتي`), qBtn('💎 معادن', `${pfx}معادن`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }
    if (command === 'شراء' || command === 'buy') {
        const key = text.trim().replace(/\s+/g, '_')
        const item = SHOP[key] || SHOP[text.trim()]
        if (!item) return m.reply(`*~❍━═══━⚞❌━═══━❍~*\n│┊❌ العنصر غير موجود! تفقد \`${pfx}المتجر\`\n*~❍━═══━⚞❌━═══━❍~*`)
        if (rpg.money < item.price) return m.reply(`*~❍━═══━⚞️≽━═══━❍~*\n│┊💸 رصيدك لا يكفي! يحتاج: ${item.price.toLocaleString()}$\n*~❍━═══━⚞️≽━═══━❍~*`)
        rpg.money -= item.price
        if (item.type === 'pickaxe') rpg.pickaxe = key
        else { inv.items.push(key); if (item.apply) item.apply(rpg) }
        savePlayer(sender, rpg); await react('✅')
        return m.reply(`*~❍━═══━⚞✅━═══━❍~*\n│┊✅ تم شراء \`${key}\` بنجاح!╿↶\n│┊💰 رصيدك: ${rpg.money.toLocaleString()}$\n*~❍━═══━⚞✅━═══━❍~*`)
    }

    // ───────── 🔮 مزاد الظلال + المزايدة (بتايمر شغال) ─────────
    const db = readRPG()
    const auctions = db.auctions
    const finalizeAuction = async (chatJid, auc) => {
        auc.status = 'done'
        const winner = auc.highestBidder
        const w = getPlayer(winner)
        if ((w.money || 0) >= auc.currentBid) {
            w.money -= auc.currentBid
            let prize = ''
            const roll = Math.random()
            if (roll < 0.35) { const it = rollItem('S', 'مزاد'); w.inventory[it.type].push(it.name); prize = `${it.type === 'weapons' ? '🗡️' : '🛡️'} ${it.name}` }
            else if (roll < 0.6 && w.sukunaFingers < 15) { w.sukunaFingers += 1; prize = `🖐️ أصبع سوكونا [ ${w.sukunaFingers} / 15 ]` }
            else { const mn = MINERALS[4]; w.minerals.push({ name: mn.name, icon: mn.icon, qty: 3, price: mn.basePrice * 3 }); prize = `${mn.icon} 3x ${mn.name}` }
            savePlayer(winner, w)
            await conn.sendMessage(chatJid, { text: `*~❍━═══━⚞🔮≽━═══━❍~*\n│┊🏆 انتهى المزاد! الفائز: @${winner.split('@')[0]}╿↶\n│┊💸 دفع: ${auc.currentBid.toLocaleString()}$\n│┊🎁 الجائزة: ${prize}\n*~❍━═══━⚞≽━═══━~*`, mentions: [winner] }).catch(() => {})
        } else {
            await conn.sendMessage(chatJid, { text: `*~❍━═══━⚞≽━═══━❍~*\n│┊💨 الفائز @${winner.split('@')[0]} ميقدرش يدفع! التبغ تبخر في الظلال...\n*~❍━═══━⚞💨≽━═══━❍~*`, mentions: [winner] }).catch(() => {})
        }
    }
    if (command === 'مزاد_الظلال') {
        if (!m.isGroup) return m.reply(`*~❍━═══━⚞❌━═══━❍~*\n│┊❌ المزادات شغالة في الجروبات بس!\n*~❍━═══━⚞❌━═══━❍~*`)
        const auc = auctions[m.chat]
        if (auc && auc.status === 'active') {
            if (Date.now() < auc.endsAt) return m.reply(`*~❍━═══━⚞≽━═══━❍~*\n│┊️ المزاد قائم على: \`${auc.item}\`\n│┊💸 أعلى مزايدة: ${auc.currentBid.toLocaleString()}$\n│┊📝 زايد بـ: \`${pfx}زايد المبلغ\`\n*~❍━═══━⚞🔮≽━═══━❍~*`)
            await finalizeAuction(m.chat, auc); writeRPG(db)
        }
        const item = AUCTION_ITEMS[Math.floor(Math.random() * AUCTION_ITEMS.length)]
        auctions[m.chat] = { status: 'active', item, currentBid: 50000, highestBidder: sender, endsAt: Date.now() + 60000 }
        writeRPG(db); await react('🔮')
        setTimeout(async () => {
            try { const db2 = readRPG(); const a = db2.auctions[m.chat]; if (a && a.status === 'active' && Date.now() >= a.endsAt) { await finalizeAuction(m.chat, a); writeRPG(db2) } } catch (e) {}
        }, 61000)
        const t = `*~❍━═══━⚞🔮≽━═══━❍~*\n⌗› مـزاد الـظـلال بـدأ!  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n│┊🔮 القطعة: *${item}*\n│┊💸 سعر البداية: 50,000$\n│┊⏳ المدة: 60 ثانية فقط!\n┤└─ׅ─ׅ┈ ๋︩︪───ׅ┈ ─๋︩︪☇ـ\n> ˼‏️˹ للمزايدة: \`${pfx}زايد المبلغ\``
        const buttons = [qBtn('🏷️ زايد 60,000$', `${pfx}زايد 60000`), qBtn('🏷️ زايد 100,000$', `${pfx}زايد 100000`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }
    if (command === 'زايد' || command === 'bid') {
        const auc = auctions[m.chat]
        if (!auc || auc.status !== 'active') return m.reply(`*~❍━═══━⚞❌━═══━❍~*\n│┊❌ لا يوجد مزاد نشط! ابدأ بـ \`${pfx}مزاد_الظلال\`\n*~❍━═══━⚞❌≽━═══━❍~*`)
        if (Date.now() > auc.endsAt) { await finalizeAuction(m.chat, auc); writeRPG(db); return m.reply('⌛ المزاد انتهى للتو!') }
        const amt = parseInt(text.trim())
        if (isNaN(amt) || amt <= auc.currentBid) return m.reply(`*~❍━═══━⚞⚠️━═══━❍~*\n│┊⚠️ زايد بمبلغ أعلى من ${auc.currentBid.toLocaleString()}$\n*~❍━═══━⚞⚠️━═══━❍~*`)
        if (rpg.money < amt) return m.reply(`*~❍━═══━⚞≽━═══━❍~*\n│┊💸 رصيدك لا يسمح بالمزايدة دي!\n*~❍━═══━⚞💸━═══━❍~*`)
        auc.currentBid = amt; auc.highestBidder = sender; writeRPG(db); await react('🏷️')
        return m.reply(`*~❍━═══━⚞✅≽━═══━❍~*\n│┊✅ بقيت أعلى مزايد بـ ${amt.toLocaleString()}$!╿↶\n│┊⏳ فاضل ${Math.max(0, Math.ceil((auc.endsAt - Date.now()) / 1000))} ثانية\n*~❍━═══━⚞✅━═══━❍~*`)
    }

    // ───────── 👹 التجسد ─────────
    if (command === 'تجسد' || command === 'awaken') {
        if (rpg.sukunaFingers < 15) return m.reply(`*~❍━═══━⚞🖐️≽━═══━❍~*\n│┊⚠️ تحتاج 15 أصبعاً للتجسد!╿↶\n│┊🖐️ عندك: [ ${rpg.sukunaFingers} / 15 ]\n│┊💡 احفر، زايد في المزادات، أو اشتري من المتجر!\n*~❍━═══━⚞🖐️≽━═══━❍~*`)
        if (!inv.characters.includes('سوكونا الكامل')) inv.characters.push('سوكونا الكامل')
        eq.character = 'سوكونا الكامل'; rpg.opBuffs.multiplier = Math.max(rpg.opBuffs.multiplier, 2)
        savePlayer(sender, rpg); await react('👹')
        const t = `*~❍━═══━⚞👑≽━═══━❍~*\n│┊👑 *اكتملت الأصابع الـ15 وتم التجسد!*╿↶\n│┊👹 شخصية [ سوكونا الكامل ] انضمت لخزانتك واتجهزت!\n│┊🌀 مضاعف أرباح دائم x2\n*~❍━═══━⚞👑≽━═══━❍~*`
        const buttons = [qBtn('🎒 الخزانة', `${pfx}خزانتي`), qBtn('⚔️ قاتل', `${pfx}قاتل`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🎯 التجهيز ─────────
    if (command === 'تجهيز' || command === 'جهز') {
        const raw = text.trim()
        if (!raw) return m.reply(`*══✿═╡°˖✧✿✧˖°╞═✿══*\n│┊📝 \`${pfx}تجهيز سلاح كاموتوكي\` │ \`${pfx}تجهيز درع ...\` │ \`${pfx}تجهيز شخصية غوجو\`\n*══✿═╡°˖✧✧˖°╞═✿══*`)
        let type = null, target = raw
        const first = raw.split(/\s+/)[0]
        if (['شخصية', 'سلاح', 'درع'].includes(first)) { type = first; target = raw.split(/\s+/).slice(1).join(' ') }
        if (!type) {
            if (inv.characters.includes(raw)) type = 'شخصية'
            else if (inv.weapons.includes(raw)) type = 'سلاح'
            else if (inv.shields.includes(raw)) type = 'درع'
        }
        if (type === 'شخصية') {
            if (target === 'سوكونا الكامل' && rpg.sukunaFingers < 15) return m.reply('❌ *سوكونا الكامل يحتاج 15 أصبعاً — جرب .تجسد!*')
            if (!inv.characters.includes(target)) return m.reply(`❌ *لا تملك الشخصية [ ${target} ]!*`)
            eq.character = target; savePlayer(sender, rpg); await react('🎭')
            return m.reply(`*══✿═╡°˖✧✧˖°╞═✿══*\n│┊ تم تجهيز شخصية: *${target}* ⚡${charData(target)?.power || 0}\n*══✿═╡°˖✧✿✧˖°╞═✿══*`)
        }
        if (type === 'سلاح') {
            if (!inv.weapons.includes(target)) return m.reply(`❌ *لا تملك السلاح [ ${target} ]!*`)
            eq.weapon = target; savePlayer(sender, rpg); await react('🗡️')
            return m.reply(`*══✿═╡°˖✧✿✧˖°╞═✿══*\n│┊🗡️ تم تجهيز: *${target}* ⚔️${WEAPON_ATK[target] || 0}\n*══✿═╡°˖✧✿˖°╞═══*`)
        }
        if (type === 'درع') {
            if (!inv.shields.includes(target)) return m.reply(`❌ *لا تملك الدرع [ ${target} ]!*`)
            eq.shield = target; savePlayer(sender, rpg); await react('🛡️')
            return m.reply(`*══✿═╡°˖✧✧˖°╞═✿══*\n│┊🛡️ تم تجهيز: *${target}* 🛡️${ARMOR_DEF[target] || 0}\n*══✿═╡°˖✧✿˖°╞═══*`)
        }
        return m.reply(`❌ *الأداة [ ${raw} ] غير موجودة! تفقد حقيبتك بـ \`${pfx}حقيبتي\`*`)
    }

    // ───────── ⚡ التجهيز التلقائي ─────────
    if (command === 'تلقائي' || command === 'افضل' || command === 'auto') {
        await react('⚡')
        let bc = null, bp = -1
        inv.characters.forEach(c => { const p = charData(c)?.power || 0; if (p > bp) { bp = p; bc = c } })
        let bw = 'قبضة اليد', bwp = 0
        inv.weapons.forEach(w => { const p = WEAPON_ATK[w] || 0; if (p > bwp) { bwp = p; bw = w } })
        let ba = 'بدون', bap = 0
        inv.shields.forEach(a => { const p = ARMOR_DEF[a] || 0; if (p > bap) { bap = p; ba = a } })
        eq.character = bc; eq.weapon = bw; eq.shield = ba; savePlayer(sender, rpg)
        const t = `*~❍━═══━⚞≽━═══━~*\n⌗› الـتـجـهـيـز الـتـلـقـائـي  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n│┊🎭 شخصية: ${bc || 'بدون'} ⚡${bp}\n│┊🗡️ سلاح: ${bw} ⚔️${bwp}\n│┊🛡️ درع: ${ba} 🛡️${bap}\n│┊ القوة الإجمالية: ${bp + bwp + bap}\n*~❍━═══━⚞⚡≽━═══━❍~*`
        const buttons = [qBtn('⚔️ قاتل', `${pfx}قاتل`), qBtn('🎒 الخزانة', `${pfx}خزانتي`)]
        try { return await sendInteractive(conn, m, { caption: t, buttons }) } catch (e) { return m.reply(t) }
    }

    // ───────── 🎰 العجلة (خذها أو لف) ─────────
    if (command === 'عجلة' || command === 'عجله') {
        if (wheel.spins <= 0 && !isOwner) {
            const extra = rpg.pendingSpin ? `\n│┊⏳ عندك شخصية مستنية! خدها بـ \`${pfx}اخذ\`` : ''
            return m.reply(`*~❍━═══━⚞️≽━═══━❍~*\n│┊❌ خلصت لفاتك يا وحش!╿↶${extra}\n│┊🎁 استنى جفت من المطورين أو جرّب \`${pfx}استدعاء\` بالفلوس!\n*~❍━═══━⚞🎟️≽━═══━❍~*`)
        }
        const cd = 60000
        if (Date.now() - wheel.lastSpin < cd && !isOwner) return m.reply(`*~❍━═══━⚞⏳≽━═══━❍~*\n│┊⏳ انتظر \`${Math.ceil((cd - (Date.now() - wheel.lastSpin)) / 1000)}\` ثانية\n*~❍━═══━⚞⏳≽━═══━❍~*`)
        let lostMsg = ''
        if (rpg.pendingSpin) lostMsg = `│┊⚠️ ضاعت *[ ${rpg.pendingSpin.name} ]* لأنك لفت تاني!\n`
        const chars = getCharacters()
        const picked = pickCharacter(chars)
        const item = rollItem(picked.tier, picked.name)
        const imgUrl = await resolveCharacterImage(picked)
        wheel.lastSpin = Date.now()
        if (!isOwner) wheel.spins = Math.max(0, (wheel.spins || 0) - 1)
        let fingerMsg = ''
        if (Math.random() <= 0.10 && rpg.sukunaFingers < 15) { rpg.sukunaFingers += 1; fingerMsg = `\n│┊🖐️ *أسطوري:* لقيت أصبع سوكونا! [ ${rpg.sukunaFingers} / 15 ]` }
        rpg.pendingSpin = { name: picked.name, money: picked.money, exp: picked.exp, rarity: picked.rarity, tier: picked.tier, tech: picked.tech, domain: picked.domain, percent: picked.percent, item }
        savePlayer(sender, rpg)
        const caption = `*~❍━═══━⚞💎≽━═══━❍~*\n⌗› عـجـلـة الـجـوجـوتـسـو  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︩︪•⋄*\n│┊👤 المقاتل: *${name}*\n${lostMsg}┤─ׅ─ׅ┈ ๋︩︪───ׅ┈ ─๋︩︪─☇ـ\n│┊🌀 الشخصية: *[ ${picked.name} ]*\n│┊✨ \`${picked.rarity}\` │ 🎲 ${picked.percent}%\n│┊🩸 التقنية: ${picked.tech || 'غير معروفة'}\n│┊⛩️ النطاق: ${picked.domain || 'بدون'}\n│┊🎁 الأداة: ${item.type === 'weapons' ? '🗡️' : '🛡️'} ${item.name}${fingerMsg}\n┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n│┊🎟️ اللفات: ${wheel.spins}\n> ˼‏⚠️˹ الشخصية معلقة! خدها بـ \`${pfx}اخذ\` أو لف تاني وهي تضيع.`
        const buttons = [qBtn('✅ أخد الشخصية', `${pfx}اخذ`)]
        if (wheel.spins > 0 || isOwner) buttons.push(qBtn('🔄 لف تاني', `${pfx}عجلة`))
        buttons.push(qBtn('🎒 الخزانة', `${pfx}خزانتي`))
        const card = await generateWheelCard({ imgSource: imgUrl, playerName: name, charName: picked.name, rarity: picked.rarity, percent: picked.percent, tier: picked.tier, money: picked.money, itemName: item.name, tech: picked.tech, domain: picked.domain, spins: wheel.spins, botName })
        try { if (card) return await sendInteractive(conn, m, { buffer: card, caption, buttons }); return await sendInteractive(conn, m, { imageUrl: imgUrl, caption, buttons }) }
        catch (e) { try { return await conn.sendMessage(m.chat, { image: { url: imgUrl }, caption }, { quoted: m }) } catch (e2) { return m.reply(caption) } }
    }

    // ───────── 🌀 الاستدعاء بالفلوس (Gacha) ─────────
    if (command === 'استدعاء' || command === 'gacha') {
        const cost = 15000
        if (rpg.money < cost) return m.reply(`*~❍━═══━⚞💸≽━═══━❍~*\n│┊⚠️ الرصيد لا يكفي لفتح البوابة!╿↶\n│┊💸 المطلوب: ${cost.toLocaleString()}$ │ عندك: ${rpg.money.toLocaleString()}$\n*~❍━═══━⚞≽━═══━~*`)
        rpg.money -= cost; await react('🌀')
        const chars = getCharacters()
        const pulled = pickCharacter(chars)
        const isNew = !inv.characters.includes(pulled.name)
        if (isNew) inv.characters.push(pulled.name)
        let fingerMsg = ''
        if (Math.random() <= 0.10 && rpg.sukunaFingers < 15) { rpg.sukunaFingers += 1; fingerMsg = `\n│┊🖐️ *إنجاز نادر:* أصبع سوكونا ظهر من البوابة! [ ${rpg.sukunaFingers} / 15 ]` }
        savePlayer(sender, rpg)
        const imgUrl = await resolveCharacterImage(pulled)
        const caption = `*~❍━═══━⚞⛩️━═══━❍~*\n⌗› بـوابـة الـاسـتـدعـاء  ˼˹\n*⋄⊹•─๋︩︪─• ⧼ ⇊  •─╼─๋︪•⋄*\n│┊👤 المستدعي: @${sender.split('@')[0]}\n│┊🎭 الشخصية: *[ ${pulled.name} ]*\n│┊✨ \`${pulled.rarity}\` │ ⚡${pulled.power}\n│┊📦 ${isNew ? 'أُضيفت للحقيبة لأول مرة!' : 'مكررة — قوتها تعززت في الأسطول'}${fingerMsg}\n│┊💰 رصيدك: ${rpg.money.toLocaleString()}$\n*~❍━═══━⚞⛩️≽━═══━❍~*`
        const buttons = [qBtn('🎒 الخزانة', `${pfx}خزانتي`), qBtn('🌀 استدعاء تاني', `${pfx}استدعاء`), qBtn('⚡ تلقائي', `${pfx}تلقائي`)]
        const card = await generateWheelCard({ imgSource: imgUrl, playerName: name, charName: pulled.name, rarity: pulled.rarity, percent: pulled.percent, tier: pulled.tier, money: 0, itemName: null, tech: pulled.tech, domain: pulled.domain, spins: wheel.spins, botName })
        try { if (card) return await sendInteractive(conn, m, { buffer: card, caption, buttons, mentions: [sender] }); return await sendInteractive(conn, m, { imageUrl: imgUrl, caption, buttons, mentions: [sender] }) }
        catch (e) { return m.reply(caption, null, { mentions: [sender] }) }
    }

    // ───────── ️ القتال / التحدي (المنشن مصحح) ─────────
    if (['قاتل', 'قتال', 'تحدي', 'duel', 'fight'].includes(command)) {
        const target = extractTarget(m, args)
        let selectedChar = cleanCharName(args)
        if (!selectedChar) selectedChar = eq.character || (inv.characters.length ? inv.characters[Math.floor(Math.random() * inv.characters.length)] : null)
        if (!target || !selectedChar) {
            return m.reply(`*❐═━━━═╊⊰️⊱═━━━═❐*\n> ˼⚠️˹ حدد الشخصية والخصم╿↶\n╮─ׅ ─๋︩︪─┈ ─๋︩︪─══┈ ๋︩︪─ ∙ ∙ ⊰ـ\n│┊📝 \`${pfx}قاتل <الشخصية> @منشن\` (الشخصية اختيارية لو مجهز واحدة)\n│┊☯️ مثال: \`${pfx}قاتل غوجو @${sender.split('@')[0]}\`\n│┊💡 المنشن اليدوي @رقم والرد على رسالة شغالين كمان!\n╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`, null, { mentions: [sender] })
        }
        if (target === sender) return m.reply(`*❐═━━━═╊⊰⚔️⊱╉═━━═❐*\n│┊❌ هتقاتل نفسك ولا إيه؟ اختر حد تاني!\n*❐═━━━═╊⊰⚔️⊱╉═━━═❐*`)
        if (!inv.characters.includes(selectedChar)) return m.reply(`*❐═━━━═╊⊰⚔️⊱╉═━━═❐*\n│┊❌ لا تمتلك *[ ${selectedChar} ]*! تفقد \`${pfx}خزانتي\`\n*❐═━━━═╊⊰⚔️⊱╉═━━═❐*`)
        const targetRpg = getPlayer(target)
        let targetName = 'الخصم'; try { targetName = await conn.getName(target) } catch (e) {}
        const enemyChar = targetRpg.equipped?.character || (targetRpg.inventory?.characters?.length ? targetRpg.inventory.characters[Math.floor(Math.random() * targetRpg.inventory.characters.length)] : null)
        await react('⚔️')
        const myP = (charData(selectedChar)?.power || 100) + (WEAPON_ATK[eq.weapon] || 0) + (ARMOR_DEF[eq.shield] || 0) + (rpg.opBuffs.autoShield ? 300 : 0) + Math.floor(Math.random() * 500)
        let enP = (enemyChar ? (charData(enemyChar)?.power || 100) : 100) + (WEAPON_ATK[targetRpg.equipped?.weapon] || 0) + (ARMOR_DEF[targetRpg.equipped?.shield] || 0) + (targetRpg.opBuffs?.autoShield ? 300 : 0) + Math.floor(Math.random() * 500)
        let isWin = myP >= enP
        if (rpg.opBuffs.immortal && !isWin) isWin = true
        if (targetRpg.opBuffs?.immortal && isWin && myP < enP) isWin = false
        const reward = 10000
        let fingerMsg = ''
        if (isWin) {
            rpg.money += reward; rpg.exp += 500
            if (Math.random() <= 0.15 && rpg.sukunaFingers < 15) { rpg.sukunaFingers += 1; fingerMsg = `\n│┊🖐️ غنيمة دموية: أصبع سوكونا! [ ${rpg.sukunaFingers} / 15 ]` }
            savePlayer(sender, rpg)
        } else { targetRpg.money = (targetRpg.money || 0) + reward; savePlayer(target, targetRpg) }
        let pp1 = null, pp2 = null
        try { pp1 = await conn.profilePictureUrl(sender, 'image') } catch (e) {}
        try { pp2 = await conn.profilePictureUrl(target, 'image') } catch (e) {}
        const card = await generateBattleCard({ p1: { name, char: selectedChar, power: myP, img: pp1 || FALLBACK_IMAGE, win: isWin }, p2: { name: targetName, char: enemyChar || 'محارب عادي', power: enP, img: pp2 || FALLBACK_IMAGE, win: !isWin }, botName })
        let fightText = `*❐═━━━═╊⊰️⊱╉═━━━═❐*\n> ═✿╡°˖✧ مـعـركـة الـسـاحـة ✧˖°╞═✿══\n│┊👤 المهاجم: @${sender.split('@')[0]} بشخصية ⚡ *[ ${selectedChar} ]*\n│┊🗡️ ${eq.weapon} ⚔️${WEAPON_ATK[eq.weapon] || 0} │ 🛡️ ${eq.shield}\n┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n│┊🥊 المدافع: @${target.split('@')[0]} بشخصية 🛡️ *[ ${enemyChar || 'محارب عادي'} ]*\n┤└─ׅ─ׅ┈ ๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
        fightText += isWin ? `> ˼‏🔥˹ *[ ${selectedChar} ]* اكتسح المعركة!╿↶\n│┊🏆 الفائز: @${sender.split('@')[0]}\n│┊💰 +${reward.toLocaleString()}$${fingerMsg}\n` : `> ˼‏˹ *[ ${enemyChar || 'محارب عادي'} ]* صد الهجوم!╿↶\n│┊🏆 الفائز: @${target.split('@')[0]}\n│┊💰 الجائزة راحت لـ @${target.split('@')[0]}\n`
        fightText += `*❐═━━━═╊⊰⚔️⊱╉═━━━═❐*`
        const buttons = [qBtn('🎒 الخزانة', `${pfx}خزانتي`), qBtn('⚡ تلقائي', `${pfx}تلقائي`), qBtn('🎰 العجلة', `${pfx}عجلة`)]
        try { if (card) return await sendInteractive(conn, m, { buffer: card, caption: fightText, buttons, mentions: [sender, target] }); return await conn.sendMessage(m.chat, { text: fightText, mentions: [sender, target] }, { quoted: m }) }
        catch (e) { return await conn.sendMessage(m.chat, { text: fightText, mentions: [sender, target] }, { quoted: m }) }
    }

    return false
}

// ═══════════ 🎯 الهاندلر الرئيسي ═══════════
let handler = async (m, { conn, isOwner, usedPrefix, args, command, text }) => {
    return runRpg(conn, m, command, args, text, isOwner, usedPrefix || '.')
}

// 🔘 ملتقط استجابات الأزرار والقوائم (بيخلي الأزرار شغالة فعلاً)
handler.before = async (m, { conn, isOwner }) => {
    if (m.type !== 'interactive_response' && !m.response) return false
    let id = null
    try {
        const r = JSON.parse(m.response || '{}')
        id = r.id || r.selectedId || r.selectedRowId || r.nativeFlowResponseMessage?.id || null
        if (!id && r.paramsJson) id = JSON.parse(r.paramsJson)?.id || null
    } catch (e) {}
    if (!id || typeof id !== 'string') return false
    const mPrefix = id.match(/^[#!.\/]/)?.[0] || ''
    if (!mPrefix) return false
    const parts = id.slice(1).trim().split(/\s+/)
    const cmd = (parts[0] || '').toLowerCase()
    if (!CMD_LIST.includes(cmd)) return false
    try { await runRpg(conn, m, cmd, parts.slice(1), parts.slice(1).join(' '), isOwner, mPrefix) } catch (e) { console.error(e) }
    return true
}

const CMD_LIST = ['حقيبتي', 'حقيبة', 'مخزني', 'inv', 'ادوات', 'أدوات', 'معدات', 'خزانتي', 'شخصياتي', 'بروفايلي', 'profile', 'اسلحة', 'أسلحة', 'دروع', 'الدرع', 'معادن', 'أدواتي', 'عنصري', 'بيع_المعادن', 'بيع', 'حفر', 'تنقيب', 'dig', 'المتجر', 'متجر', 'شوب', 'shop', 'شراء', 'buy', 'مزاد_الظلال', 'زايد', 'bid', 'تجسد', 'awaken', 'تجهيز', 'جهز', 'تلقائي', 'افضل', 'auto', 'عجلة', 'عجله', 'اخذ', 'خذ', 'استلام', 'لفات', 'لفاتي', 'هدي', 'جفت', 'استدعاء', 'gacha', 'قاتل', 'قتال', 'تحدي', 'duel', 'fight']
handler.help = ['حقيبتي', 'خزانتي', 'عجلة', 'اخذ', 'استدعاء', 'تجهيز <نوع> <اسم>', 'تلقائي', 'تجسد', 'حفر', 'معادن', 'بيع_المعادن', 'المتجر', 'شراء <عنصر>', 'مزاد_الظلال', 'زايد <مبلغ>', 'قاتل <شخصية> @منشن', 'لفات', 'هدي <عدد> @منشن']
handler.tags = ['rpg', 'economy', 'games']
handler.command = CMD_LIST
handler.description = 'نواة سوكونا المطلقة: نظام آر بي جي متكامل لعالم الجوجوتسو — عجلة الشخصيات باللفات، الاستدعاء، القتال بالمناشن المصحح، التنقيب والمعادن، المتجر والمزادات بعداد زمني، التجسد بأصابع سوكونا، والتجهيز الذكي ببطاقات مصممة.'

export default handler