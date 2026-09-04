/**
 * ═══════════════════════════════════════════════════════════════════
 * 🛡️ SUKUNA BOT | قائمة الألعاب الديناميكية مع توليد Canvas
 * ═══════════════════════════════════════════════════════════════════
 * 👑 المطور والمالك: آدم (شادو) | Adam (Shadow)
 * 🤖 اسم البوت: سوكونا (Sukuna Bot)
 * 🏷️ الحقوق: ${global.author || 'Sukuna Team'}
 * 📜 الوصف: عرض قائمة أوامر الألعاب والتسلية بشكل ديناميكي مع توليد 
 *           صورة تفاعلية مخصصة للمستخدم باستخدام مكتبة Canvas وخط Amiri.
 * 📂 المسار المتوقع للخط: ./fonts/Amiri-Regular.ttf
 * ═══════════════════════════════════════════════════════════════════
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'
import { createCanvas, registerFont } from 'canvas'

// التأكد من وجود مجلد tmp للصور المؤقتة
const tmpDir = join(process.cwd(), 'tmp')
if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true })

// محاولة تسجيل خط Amiri (مع حماية ضد الأخطاء في حال لم يكن المسار دقيقاً)
try {
  registerFont(join(process.cwd(), 'fonts', 'Amiri-Regular.ttf'), { family: 'Amiri' })
} catch (e) {
  console.warn('⚠️ لم يتم العثور على خط Amiri، سيتم استخدام الخط الافتراضي.')
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // ⏳⃝⚡ حساب سرعة الاستجابة
    let old = performance.now()
    let neww = performance.now()
    let speed = (neww - old).toFixed(4)

    // 📅⃝⚡ معلومات المستخدم والوقت
    const userName = await conn.getName(m.sender) || 'مجهول'
    const botName = global.botname || 'Sukuna Bot'
    const authorName = global.author || 'Sukuna Team'
    
    // 🎮⃝⚡ جلب الأوامر ديناميكياً من الفئات (Games / ألعاب / تسلية)
    let dynamicCommands = []
    for (const name in globalThis.plugins) {
      const plugin = globalThis.plugins[name]
      if (!plugin || !plugin.tags) continue
      
      // التحقق من أن الأمر ينتمي لقسم الألعاب أو التسلية
      const isGameTag = plugin.tags.some(tag => 
        ['games', 'ألعاب', 'تسلية', 'ترفيه', 'entertainment'].includes(tag.toLowerCase())
      )
      
      if (isGameTag && plugin.command) {
        const cmd = Array.isArray(plugin.command) ? plugin.command[0] : (typeof plugin.command === 'string' ? plugin.command : 'غير معروف')
        const desc = plugin.description || 'لا يوجد وصف متاح لهذا الأمر'
        dynamicCommands.push(`> ${_p}${cmd} : ${desc}`)
      }
    }

    // تنسيق نص القائمة مع الزخارف المطلوبة
    let menuText = `*⎔⋅•━━╼╃⌬〔﷽〕⌬╄╾━━•⋅⎔*\n`
    menuText += `*~❍━═══━⚞💎≽━═══━❍~*\n`
    menuText += `*╮─ׅ─๋︩︪─┈─๋︩︪─═⊏═┈─๋︩︪─∙∙⊰ـ*\n`
    menuText += `│˼ೄྀ˹" مرحباً بك يا *${userName}* في قسم الألعاب 🎮\n`
    menuText += `*╯─ׅ─๋︩︪─┈─๋︩︪─═⊏═┈─๋︩︪─∙∙⊰ـ*\n\n`
    
    menuText += `*❰┉━━━✣⊰🎮⊱✣━━━┉❱*\n`
    menuText += `*┇≡ 🕹️ أوامر القسم المتاحة:*\n`
    menuText += `*❰┉━━━✣⊰🎮⊱✣━━━┉❱*\n`
    
    if (dynamicCommands.length > 0) {
      menuText += dynamicCommands.join('\n') + '\n'
    } else {
      menuText += `> لا توجد أوامر متاحة في هذا القسم حالياً.\n`
    }
    
    menuText += `\n*⎔⋅•━━╼╃⌬〔﷽〕⌬╄╾━━•⋅⎔*\n`
    menuText += `*『 توقيع ┊ ˼‏📜˹ 』↶*\n`
    menuText += `「🍷 ${botName} ┊ 🤖 ┊ ${authorName} 🍷」\n`
    menuText += `*⎔⋅•━━╼╃⌬〔﷽〕⌬╄╾━━•⋅⎔*`

    await conn.sendMessage(m.chat, { react: { text: '🫪', key: m.key } })

    // 🎨⃝⚡ توليد صورة Canvas أسطورية
    const canvasWidth = 800
    const canvasHeight = 400
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // 1. خلفية متدرجة (ألوان سوكونا: أسود وأحمر داكن)
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
    gradient.addColorStop(0, '#1a0000')
    gradient.addColorStop(1, '#4a0000')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 2. إضافة زخارف وحدود
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 8
    ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20)

    // 3. إعدادات الخط
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    
    // محاولة استخدام خط Amiri، وإذا فشل نستخدم الخط الافتراضي
    try {
      ctx.font = 'bold 50px "Amiri", sans-serif'
    } catch {
      ctx.font = 'bold 50px sans-serif'
    }

    // 4. كتابة النصوص على الصورة
    ctx.fillStyle = '#ff3333' // لون أحمر للعنوان
    ctx.fillText(`⚡ ${botName} ⚡`, canvasWidth / 2, 80)
    
    ctx.fillStyle = '#ffffff'
    try {
      ctx.font = 'bold 40px "Amiri", sans-serif'
    } catch {
      ctx.font = 'bold 40px sans-serif'
    }
    ctx.fillText(`مرحباً بك يا ${userName}`, canvasWidth / 2, 160)
    
    ctx.fillStyle = '#ffcc00' // لون ذهبي للقسم
    try {
      ctx.font = 'bold 60px "Amiri", sans-serif'
    } catch {
      ctx.font = 'bold 60px sans-serif'
    }
    ctx.fillText(`قسم الألعاب 🎮`, canvasWidth / 2, 260)
    
    ctx.fillStyle = '#cccccc'
    try {
      ctx.font = '30px "Amiri", sans-serif'
    } catch {
      ctx.font = '30px sans-serif'
    }
    ctx.fillText(`Developer: Adam (Shadow)`, canvasWidth / 2, 340)

    // 5. حفظ الصورة مؤقتاً
    const buffer = canvas.toBuffer('image/jpeg')
    const tempImagePath = join(tmpDir, `sukuna_games_${m.sender}.jpg`)
    writeFileSync(tempImagePath, buffer)

    // 📱⃝⚡ إعداد الرسالة التفاعلية (Native Flow)
    const channel = global.my?.channel || 'https://whatsapp.com/channel/0029Vb7O26W8V0tu5ErixM1d'
    const developerNumber = global.owner?.[0] || '201021902759'
    const developerContact = `https://wa.me/${developerNumber}`

    const nativeFlowPayload = {
      body: { text: menuText },
      footer: { text: `𝗦𝗨𝗞𝗨𝗡𝗔 𝗕𝗢𝗧 | 🌟 السرعة: ${speed}ms` },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: "📂 الأقسام الرئيسية",
              sections: [
                {
                  title: "⌬──══─┈•⤣⚡⤤•┈─══──⌬\n║  اختر القسم المطلوب  ║\n⌬──══─┈•⤣⚡⤤•┈─══──⌬",
                  rows: [
                    { "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬", "description": "🏅 قــســم الــاداريــة", "id": ".ق1" },
                    { "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬", "description": "🎨 قــســم الــاســتــيــكــر", "id": ".ق2" },
                    { "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬", "description": "🎮 قــســم الــالــعــاب", "id": ".ق3" },
                    { "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬", "description": "🔍 قــســم الــبــحــث و الــتــحــمــيــل", "id": ".ق4" },
                    { "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬", "description": "🤖 قــســم الــذكــاء الــاصــطــنــاعــي", "id": ".ق7" }
                  ]
                }
              ],
              has_multiple_buttons: true
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "📢 القناة الرسمية",
              url: channel,
              merchant_url: channel
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: '👑 التواصل مع المطور',
              url: developerContact,
              merchant_url: developerContact
            })
          }
        ]
      }
    }

    // إضافة الـ Header بالصورة المولدة
    try {
      const media = await prepareWAMessageMedia({ image: { url: tempImagePath } }, { upload: conn.waUploadToServer })
      nativeFlowPayload.header = {
        hasMediaAttachment: true,
        subtitle: 'Sukuna Bot - Games Section',
        imageMessage: media.imageMessage
      }
    } catch (e) {
      console.error('خطأ في إرفاق صورة Canvas:', e)
      nativeFlowPayload.header = { hasMediaAttachment: false, subtitle: 'Sukuna Bot' }
    }

    // إرسال الرسالة
    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload)
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('خطأ في قائمة الألعاب:', e)
    await m.reply(`⚠️ حدث خطأ أثناء تحميل قائمة الألعاب.\nيرجى التأكد من تثبيت مكتبة \`canvas\` ووجود خط Amiri في مجلد fonts.`)
  }
}

// معالج الأزرار التفاعلية (اختياري للرد على اختيارات الأقسام)
handler.before = async (m, { conn }) => {
  if (m.type === 'interactive_response') {
    const response = JSON.parse(m.response)
    const buttonId = response.id || response.buttonId
    const sections = {
      'ق1': '👮‍♂️ جاري تحويلك لقسم الأدمن...',
      'ق2': '🎨 جاري تحويلك لقسم الاستيكر...',
      'ق3': '🎮 أنت بالفعل في قسم الألعاب!',
      'ق4': '🔍 جاري تحويلك لقسم البحث والتحميل...',
      'ق7': '🤖 جاري تحويلك لقسم الذكاء الاصطناعي...'
    }
    if (sections[buttonId]) {
      await conn.sendMessage(m.chat, { text: sections[buttonId] }, { quoted: m })
      return true
    }
  }
  return false
}

// ═══════════════════════════════════════════════════════
// 📌 بيانات الوصف والأوامر (حسب المعايير المطلوبة)
// ═══════════════════════════════════════════════════════
handler.help = ['الالعاب ⃝🎮'] // يوضح أن الأمر لا يحتاج مدخلات إضافية
handler.tags = ['main ⃝🌙', 'ألعاب']
handler.command = ['الالعاب'] // نصي بسيط وسهل، بدون Regex معقد
handler.description = 'يعرض قائمة شاملة وديناميكية بجميع أوامر الألعاب والتسلية المتاحة في البوت، مع توليد صورة تفاعلية مخصصة.'

export default handler