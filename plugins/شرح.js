/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import { prepareWAMessageMedia } from '@whiskeysockets/baileys'
import { existsSync } from 'fs'
import { join } from 'path'

const BASE_BG = join(process.cwd(), 'media', 'sukuna_base.jpg')
const FALLBACK_IMAGE = 'https://i.ibb.co/L50Fk1j/sukuna-fallback.jpg'

// ═══════════ 🎨 مكتبة Canvas ═══════════
let _canvasLib = undefined
async function getCanvasLib() {
    if (_canvasLib === undefined) {
        try { _canvasLib = await import('canvas') } catch { _canvasLib = null }
    }
    return _canvasLib
}
let fontReady = false
async function ensureFonts(lib) {
    if (fontReady || !lib) return
    try {
        const reg = join(process.cwd(), 'fonts', 'Amiri-Regular.ttf')
        const bold = join(process.cwd(), 'fonts', 'Amiri-Bold.ttf')
        if (existsSync(reg)) lib.registerFont(reg, { family: 'Amiri' })
        if (existsSync(bold)) lib.registerFont(bold, { family: 'Amiri-Bold' })
    } catch (e) {}
    fontReady = true
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
}
function drawCover(ctx, img, x, y, w, h) {
    const ir = img.width / img.height, r = w / h
    let sw, sh, sx, sy
    if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0 }
    else { sw = img.width; sh = sw / r; sx = 0; sy = (img.height - sh) / 2 }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    let currentY = y
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY)
            line = words[n] + ' '
            currentY += lineHeight
        } else {
            line = testLine
        }
    }
    ctx.fillText(line, x, currentY)
    return currentY
}

// ═══════════ 🖼️ بطاقة شرح الأمر ═══════════
async function generateHelpCard(d) {
    const lib = await getCanvasLib()
    if (!lib) return null
    await ensureFonts(lib)
    try {
        const { createCanvas, loadImage } = lib
        const W = 1000, H = 1200
        const canvas = createCanvas(W, H)
        const ctx = canvas.getContext('2d')

        const bg = existsSync(BASE_BG) ? await loadImage(BASE_BG).catch(() => null) : null
        if (bg) drawCover(ctx, bg, 0, 0, W, H)
        else { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0f0c29'); g.addColorStop(1, '#24243e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H) }
        
        const ov = ctx.createLinearGradient(0, 0, 0, H)
        ov.addColorStop(0, 'rgba(0,0,0,0.65)')
        ov.addColorStop(1, 'rgba(0,0,0,0.92)')
        ctx.fillStyle = ov
        ctx.fillRect(0, 0, W, H)

        ctx.textAlign = 'center'
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 54px "Amiri-Bold"'
        ctx.fillText('📖 موسوعة سوكونا', W / 2, 90)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 48px "Amiri-Bold"'
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10
        ctx.fillText(d.commandName, W / 2, 180)
        ctx.shadowBlur = 0

        // 🗂️ التصنيف
        ctx.save()
        roundRect(ctx, W/2 - 150, 220, 300, 50, 25)
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)'
        ctx.fill()
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 28px Amiri'
        ctx.fillText(`🗂️ ${d.tags}`, W / 2, 255)

        // 💬 الوصف
        ctx.textAlign = 'right'
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.font = '32px Amiri'
        const descY = wrapText(ctx, d.description, W - 80, 350, W - 160, 45)

        // 📝 الأمثلة
        ctx.textAlign = 'right'
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 34px "Amiri-Bold"'
        ctx.fillText('📝 طريقة الاستخدام:', W - 80, descY + 80)
        
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.font = '30px Amiri'
        let exampleY = descY + 130
        d.examples.forEach(ex => {
            ctx.fillText(`◾ ${ex}`, W - 80, exampleY)
            exampleY += 45
        })

        // 💎 معلومات إضافية
        const infoY = Math.max(exampleY + 40, 850)
        ctx.save()
        roundRect(ctx, 80, infoY, W - 160, 180, 20)
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,215,0,0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()

        ctx.textAlign = 'center'
        ctx.font = 'bold 32px Amiri'
        ctx.fillStyle = d.isPremium ? '#FFD700' : '#A0A0A0'
        ctx.fillText(`💎 ${d.isPremium ? 'يتطلب اشتراك بريميوم' : 'مجاني لجميع المستخدمين'}`, W / 2, infoY + 60)
        
        ctx.fillStyle = d.isLimit ? '#F87171' : '#4ADE80'
        ctx.fillText(`🎯 ${d.isLimit ? 'يستهلك نقاط/حدود' : 'لا يستهلك نقاط'}`, W / 2, infoY + 120)

        // 🕸️ التوقيع
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.font = 'italic 28px Amiri'
        ctx.fillText(`🕸 ${global.botname || 'Sukuna Bot'} 🕸`, W / 2, H - 50)

        return canvas.toBuffer('image/jpeg', { quality: 0.9 })
    } catch (e) { console.error('Help Card Error:', e); return null }
}

// ═══════════ 📤 إرسال تفاعلي ═══════════
const qBtn = (label, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: label, id }) })

async function sendInteractive(conn, m, { buffer, imageUrl, caption, buttons }) {
    const header = { hasMediaAttachment: false }
    try {
        const media = await prepareWAMessageMedia(buffer ? { image: buffer } : { image: { url: imageUrl } }, { upload: conn.waUploadToServer })
        header.hasMediaAttachment = true
        header.imageMessage = media.imageMessage
    } catch (e) {}
    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header,
                    body: { text: caption },
                    footer: { text: `🕸 ${global.botname || 'Sukuna Bot'} 🕸` },
                    nativeFlowMessage: { buttons },
                    messageParamsJson: '｢🔱SUKUNA🩸BOT｣'
                }
            }
        }
    }, { quoted: m })
}

// ═══════════ 🎯 الهاندلر الرئيسي ═══════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*❆│·••━━⊰📚━━••·│❆*\n> ˼‏⚠️˹ اكتب اسم الأمر الذي تريد شرحه╿↶\n╮─ׅ ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ\n│┊📝 الاستخدام: \`${usedPrefix}${command} <اسم الأمر>\`\n│┊☯️ مثال: \`${usedPrefix}${command} عجلة\` أو \`${usedPrefix}${command} ملصق\`\n╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`)
    }

    const searchTerm = text.toLowerCase().trim().replace(/[<>[\]\-\/]/g, '')
    const allPlugins = Object.values(global.plugins || {})

    // 🔍 1. بحث دقيق (Exact match)
    let plugin = allPlugins.find(p => {
        const cmds = Array.isArray(p.command) ? p.command : (p.command instanceof RegExp ? [] : p.command ? [p.command] : [])
        const helps = Array.isArray(p.help) ? p.help : []
        return [...cmds, ...helps].some(c => String(c).toLowerCase().replace(/[<>[\]\-\/]/g, '').trim() === searchTerm)
    })

    // 🔍 2. بحث جزئي (Partial match) لو مفيش exact
    if (!plugin) {
        plugin = allPlugins.find(p => {
            const cmds = Array.isArray(p.command) ? p.command : (p.command instanceof RegExp ? [] : p.command ? [p.command] : [])
            const helps = Array.isArray(p.help) ? p.help : []
            return [...cmds, ...helps].some(c => String(c).toLowerCase().includes(searchTerm))
        })
    }

    if (!plugin) {
        return m.reply(`*❆│·••━━⊰❌━━••·│❆*\n│┊🔍 لم يتم العثور على شرح للأمر: *[ ${text} ]*\n│┊💡 جرب تكتب جزء من اسم الأمر، أو اكتب \`${usedPrefix}ق\` لرؤية كل الأقسام.\n*❆│·••━━⊰📚━━••·│❆*`)
    }

    // 📋 استخراج البيانات
    const rawCmds = Array.isArray(plugin.command) ? plugin.command : (plugin.command instanceof RegExp ? [] : plugin.command ? [plugin.command] : [])
    const rawHelps = Array.isArray(plugin.help) ? plugin.help : []
    const allCmds = [...new Set([...rawCmds, ...rawHelps].map(c => String(c).replace(/[<>[\]\-\/]/g, '').trim()))]
    
    const commandName = allCmds[0] || text
    const examples = allCmds.slice(0, 5).map(c => `${usedPrefix}${c}`)
    const tags = Array.isArray(plugin.tags) ? plugin.tags.join(', ') : (typeof plugin.tags === 'string' ? plugin.tags : 'غير مصنف')
    const description = plugin.description || 'لا يوجد شرح مفصل لهذا الأمر حالياً.'
    const isPremium = !!plugin.premium
    const isLimit = !!plugin.limit

    // 🎴 توليد البطاقة
    const card = await generateHelpCard({ commandName, tags, description, examples, isPremium, isLimit })

    // 📝 النص التفاعلي
    let caption = `*❰┉━━━✣⊰📚✣━━━┉❱*\n`
    caption += `⌗› شـرح الأمـر: *[ ${commandName} ]*  ˼˹\n`
    caption += `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
    caption += `│┊🗂️ التصنيف: \`${tags}\`\n`
    caption += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
    caption += `│┊💬 ${description}\n`
    caption += `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n`
    caption += `│┊📝 *طريقة الاستخدام:*\n`
    examples.forEach(ex => { caption += `│┊◾ \`${ex}\`\n` })
    caption += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
    caption += `│┊💎 ${isPremium ? '✅ يتطلب بريميوم' : '🆓 مجاني'}\n`
    caption += `│┊🎯 ${isLimit ? '⚡ يستهلك نقاط' : '♾️ بلا حدود'}\n`
    caption += `*❰┉━━━✣⊰📚✣━━━┉❱*`

    // 🔘 الأزرار
    const buttons = [
        qBtn('🚀 جرب الأمر الآن', `${usedPrefix}${commandName}`),
        qBtn('📚 القائمة الرئيسية', `${usedPrefix}ق`),
        qBtn('🔍 بحث تاني', `${usedPrefix}${command}`)
    ]

    try {
        if (card) return await sendInteractive(conn, m, { buffer: card, caption, buttons })
        return await sendInteractive(conn, m, { imageUrl: FALLBACK_IMAGE, caption, buttons })
    } catch (e) {
        return m.reply(caption)
    }
}

handler.help = ['<اسم الأمر>']
handler.tags = ['info']
handler.command = ['شرح', 'help', 'مساعدة']
handler.description = 'عرض شرح تفصيلي وتفاعلي لأي أمر في البوت مع أمثلة الاستخدام والتصنيف ومعلومات الاستهلاك.'

export default handler