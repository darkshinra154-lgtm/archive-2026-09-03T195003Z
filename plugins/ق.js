/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import { existsSync } from 'fs'
import { join } from 'path'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'

// 🔠 تسجيل فونت Amiri من مجلد fonts
const amiriPath = join(process.cwd(), 'fonts', 'Amiri-Regular.ttf')
const amiriBoldPath = join(process.cwd(), 'fonts', 'Amiri-Bold.ttf')
if (existsSync(amiriPath)) registerFont(amiriPath, { family: 'Amiri' })
if (existsSync(amiriBoldPath)) registerFont(amiriBoldPath, { family: 'Amiri-Bold' })

// 🗺️ خريطة الأقسام الفرعية (Tags المرتبطة بكل قسم)
const sectionMap = {
  'ق1': { title: '👮‍♂️ قسم الإدارة', tags: ['admin', 'owner', 'group'] },
  'ق2': { title: '🎨 قسم الاستيكر', tags: ['sticker', 'convert'] },
  'ق3': { title: '🎮 قسم الألعاب', tags: ['game', 'rpg', 'rg'] },
  'ق4': { title: '🔍 قسم البحث والتحميل', tags: ['search', 'downloader', 'internet'] },
  'ق5': { title: '🧰 قسم الأدوات', tags: ['tools'] },
  'ق6': { title: '📦 قسم الموارد', tags: ['advanced', 'info'] },
  'ق7': { title: '🤖 قسم الذكاء الاصطناعي', tags: ['ai'] },
  'ق8': { title: '🎌 قسم النقابات', tags: ['anime'] },
  'ق9': { title: '🖼️ قسم الصور والايديت', tags: ['image'] },
  'ق10': { title: '⛄ قسم التسلية', tags: ['fun'] }
}

// 🎨 دالة توليد الصورة الأسطورية بـ Canvas
async function generateEpicImage(conn, userJid, userName, title) {
  const width = 1280, height = 720
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 1️⃣ الخلفية (sukuna_base.jpg من مجلد media)
  const bgPath = join(process.cwd(), 'media', 'sukuna_base.jpg')
  let bgImg
  try {
    bgImg = await loadImage(existsSync(bgPath) ? bgPath : 'https://i.ibb.co/640b8Qr/sukuna.jpg')
  } catch { bgImg = null }
  
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, height)
    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, 'rgba(0,0,0,0.3)')
    grad.addColorStop(1, 'rgba(0,0,0,0.85)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  } else {
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#16213e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  // 2️⃣ صورة البروفايل (دائرية بإطار ذهبي)
  let avatarImg
  try {
    const ppUrl = await conn.profilePictureUrl(userJid, 'image').catch(() => null)
    avatarImg = ppUrl ? await loadImage(ppUrl) : null
  } catch { avatarImg = null }
  
  const avatarX = 60, avatarY = 60, avatarSize = 180
  ctx.save()
  ctx.beginPath()
  ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  if (avatarImg) {
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize)
  } else {
    ctx.fillStyle = '#e94560'
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 80px Amiri'
    ctx.textAlign = 'center'
    ctx.fillText(userName.charAt(0).toUpperCase(), avatarX + avatarSize/2, avatarY + avatarSize/2 + 30)
  }
  ctx.restore()
  
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 3, 0, Math.PI * 2)
  ctx.stroke()

  // 3️⃣ اسم المستخدم
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px "Amiri-Bold"'
  ctx.textAlign = 'right'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 10
  ctx.fillText(userName, width - 60, 140)

  // 4️⃣ العنوان الرئيسي (اسم القسم)
  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 68px "Amiri-Bold"'
  ctx.textAlign = 'center'
  ctx.fillText(title, width/2, 450)

  // 5️⃣ خط زخرفي
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(width/2 - 200, 480)
  ctx.lineTo(width/2 + 200, 480)
  ctx.stroke()

  // 6️⃣ اسم البوت
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = 'italic 32px Amiri'
  ctx.fillText(`🕸 ${global.botname || 'سوكونا بوت'} 🕸`, width/2, height - 60)

  return canvas.toBuffer('image/jpeg', { quality: 0.9 })
}

// 🔄 جلب الأوامر الديناميكية لقسم معين
function getCommandsBySection(sectionId) {
  const section = sectionMap[sectionId]
  if (!section) return []
  const commands = []
  const plugins = Object.values(global.plugins || {})
  for (const plugin of plugins) {
    const tags = plugin.tags || []
    if (tags.some(t => section.tags.includes(t))) {
      const cmds = Array.isArray(plugin.command) ? plugin.command : 
                   plugin.command instanceof RegExp ? [plugin.command.source.replace(/\\/g, '')] : 
                   typeof plugin.command === 'string' ? [plugin.command] : []
      cmds.forEach(cmd => {
        if (cmd && !commands.includes(cmd)) commands.push(cmd)
      })
    }
  }
  return commands
}

// 📋 بناء قائمة الأقسام للقائمة المنسدلة (single_select)
function buildSectionsList(usedPrefix) {
  return Object.keys(sectionMap).map(id => ({
    "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
    "description": `${sectionMap[id].title} ◌${global.botname || 'SUKUNA'}`,
    "id": `${usedPrefix}${id}`
  }))
}

// 📋 دالة إرسال قائمة القسم الفرعي (بأزرار تفاعلية ذكية)
async function sendSectionMenu(m, { conn, usedPrefix, sectionId, userName, speed }) {
  const section = sectionMap[sectionId]
  const commands = getCommandsBySection(sectionId)
  const imgBuffer = await generateEpicImage(conn, m.sender, userName, section.title)
  
  // 📝 بناء نص الرسالة بالأوامر
  let menuTxt = `*⌬══${section.title.toUpperCase()}══⌬*\n`
  menuTxt += `*║* °⃟𑁁🌓 *🪪 الــاســم:* ${userName}\n`
  menuTxt += `*║* °⃟𑁁🌓 *📜 عــدد الاوامــر:* ${commands.length}\n`
  menuTxt += `*║* °⃟𑁁🌓 *🔌 الــبــيــنــق:* ${speed}ms\n`
  menuTxt += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n\n`
  
  if (commands.length === 0) {
    menuTxt += `*║* ⚠️ *لا توجد أوامر في هذا القسم حالياً*\n`
  } else {
    menuTxt += `*⌬──══─┈•⤣🎯⤤•┈─══──⌬*\n`
    commands.forEach(cmd => {
      menuTxt += `*║* *『 ⌬╎°⃟𑁁⚡❯ ${usedPrefix}${cmd} 』*\n`
    })
    menuTxt += `*⌬──══─┈•⤣🎯⤤•┈─══──⌬*\n`
  }
  
  menuTxt += `\n> *مـلاحــظــة╿↶*\n╮⋄━─━─━─═◞⬪※⬪◟═─━─━─━⋄╭ـ\n> *┃╻يـمـنـع مـنـعـاً بـتـاً سـب الـبـوت╹*`

  // 🎯 بناء الرسالة التفاعلية بالأزرار
  const nativeFlowPayload = {
    body: { text: menuTxt },
    footer: { text: `🕸 ${global.botname || 'Sukuna Bot'} © ${new Date().getFullYear()}` },
    nativeFlowMessage: {
      buttons: [
        // 🔘 زر 1: قائمة منسدلة لاختيار أقسام أخرى
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: "📂 أقسام أخرى",
            sections: [
              {
                title: "⌬──══─┈•⤣⚡⤤•┈─══──⌬\n║  اختر قسم تاني بسهولة  ║\n⌬──══─┈•⤣⚡⤤•┈─══──⌬",
                rows: buildSectionsList(usedPrefix)
              }
            ],
            has_multiple_buttons: true
          })
        },
        // 🔘 زر 2: الرجوع للقائمة الرئيسية
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: '🔙 القائمة الرئيسية',
            id: `${usedPrefix}ق`
          })
        },
        // 🔘 زر 3: تنصيب البوت
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: '⚡ تنصيب سوكونا',
            id: `${usedPrefix}تنصيب`
          })
        }
      ]
    }
  }

  // 🖼️ إضافة الصورة للرأس
  try {
    const media = await prepareWAMessageMedia({ image: imgBuffer }, { upload: conn.waUploadToServer })
    nativeFlowPayload.header = {
      hasMediaAttachment: true,
      subtitle: section.title,
      imageMessage: media.imageMessage
    }
  } catch (e) {
    console.error('خطأ في توليد صورة القسم:', e)
    nativeFlowPayload.header = { 
      hasMediaAttachment: false,
      subtitle: section.title
    }
  }

  // 📤 إرسال الرسالة التفاعلية
  const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload)
  const fkontak = await makeFkontak()
  const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { 
    userJid: conn.user.jid, 
    quoted: fkontak 
  })
  
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

// 🎯 Handler الرئيسي
let handler = async (m, { conn, usedPrefix, command }) => {
  const speed = (performance.now() - (m.receivedTimestamp || performance.now())).toFixed(2)
  const userName = await conn.getName(m.sender)
  await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

  // 🚀 إذا كان الأمر أمر فرعي لقسم معين (ق1، ق2...)
  if (sectionMap[command]) {
    await sendSectionMenu(m, { conn, usedPrefix, sectionId: command, userName, speed })
    return
  }


  const channel = 'https://whatsapp.com/channel/0029VbDJw9q96H4bVpXInK1K'
  const developerNumber =['201032382471','']
  const developerContact = `https://wa.me/${developerNumber}`
  
  const menuText = `*⌬══𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 ${global.botname || 'SUKUNA'}══⌬*\n` +
    `*║* °⃟𑁁🌓 *🪪 الــاســم:* ${userName}\n` +
    `*║* °⃟𑁁🌓 *🔌 الــبــيــنــق:* ${speed}ms\n` +
    `*⌬──══─┈•⤣🕸⤤•┈─══──⌬*\n\n` +
    `> *اختر القسم الذي تريد استكشافه من الزر بالأسفل ⚡*`

  const nativeFlowPayload = {
    body: { text: menuText },
    footer: { text: `🕸 ${global.botname || 'Sukuna Bot'} © ${new Date().getFullYear()}` },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: "📂 الأقسام الرئيسية",
            sections: [
              {
                title: "⌬──══─┈•⤣⚡⤤•┈─══──⌬\n║  اختر القسم المطلوب  ║\n⌬──══─┈•⤣⚡⤤•┈─══──⌬",
                rows: buildSectionsList(usedPrefix)
              }
            ],
            has_multiple_buttons: true
          })
        },
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'تنــصيب سوكونــا ⚡',
            id: `${usedPrefix}تنصيب`
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
      ],
      messageParamsJson: JSON.stringify({
        limited_time_offer: {
          text: `⚡ ${speed}ms`,
          url: developerContact,
          copy_code: `المطور: +${developerNumber}`,
          expiration_time: Date.now() + 86400000
        },
        bottom_sheet: {
          in_thread_buttons_limit: 1,
          divider_indices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999],
          list_title: "📂 قائمة أقسام البوت",
          button_title: "▻ عرض الأقسام ⚡"
        },
        tap_target_configuration: {
          description: `ابدأ الآن مع ${global.botname || 'سوكونا بوت'}`,
          canonical_url: developerContact,
          domain: "https://sukunabot.vercel.app",
          button_index: 0
        }
      })
    }
  }

  // إضافة الصورة للرأس
  try {
    const imgBuffer = await generateEpicImage(conn, m.sender, userName, 'القائمة الرئيسية')
    const media = await prepareWAMessageMedia({ image: imgBuffer }, { upload: conn.waUploadToServer })
    nativeFlowPayload.header = {
      hasMediaAttachment: true,
      subtitle: 'بوت متعدد الوظائف',
      imageMessage: media.imageMessage
    }
  } catch (e) {
    console.error('خطأ في توليد الصورة:', e)
    nativeFlowPayload.header = { 
      hasMediaAttachment: false,
      subtitle: 'بوت متعدد الوظائف'
    }
  }

  const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload)
  const fkontak = await makeFkontak()
  const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { 
    userJid: conn.user.jid, 
    quoted: fkontak 
  })
  
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

// 📎 دالة الاقتباس الاحترافي
async function makeFkontak() {
  try {
    const res = await fetch('https://i.ibb.co/640b8Qr/sukuna.jpg')
    const thumb = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Sukuna' },
      message: { locationMessage: { name: global.botname || 'Sukuna Bot', jpegThumbnail: thumb } },
      participant: '0@s.whatsapp.net'
    }
  } catch { return undefined }
}

handler.help = ['menu', 'ق']
handler.tags = ['main']
handler.command = ['ق', 'menu', 'القائمة', 'sections', 'ق1', 'ق2', 'ق3', 'ق4', 'ق5', 'ق6', 'ق7', 'ق8', 'ق9', 'ق10']
handler.description = 'عرض القائمة الرئيسية التفاعلية وجميع الأقسام الفرعية بشكل ديناميكي مع أزرار تنقل ذكية.'

export default handler