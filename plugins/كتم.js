/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import fetch from 'node-fetch'

// 🎯 دالة مساعدة لجلب صورة مصغرة للاقتباس (مع معالجة الأخطاء لمنع توقف البوت)
async function getThumbnail(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.buffer()
  } catch {
    return null
  }
}

let handler = async (m, { conn, command, text, isAdmin, isBotAdmin }) => {
  // 🛡️ التحقق من الصلاحيات الأساسية
  if (!m.isGroup) throw '❌ هذا الأمر خاص بالمجموعات فقط.'
  if (!isAdmin) throw '⚡ *فـقـط الـمـسـؤولـيـن يـمـكـنـهـم تـنـفـيـذ هـذا الأمـر*'
  if (!isBotAdmin) throw '⚠️ يجب أن يكون البوت مشرفاً في المجموعة لتنفيذ هذا الأمر.'

  // 🎯 تحديد الهدف (منشن أو رد على رسالة)
  let targetJid = m.mentionedJid?.[0] || m.quoted?.sender || null
  
  // التحقق من صحة الهدف
  if (!targetJid || !targetJid.includes('@s.whatsapp.net')) {
    const action = (command === 'كتم' || command === 'اسكت') ? 'لكتمه' : 'لفك الكتم عنه'
    return conn.reply(m.chat, `⚡ *مـن فـضـلـك قـم بـعـمـل مـنـشـن لـلـشـخـص أو الـرد عـلـى رسـالـتـه ${action}*`, m)
  }

  // 🛡️ حماية البوت
  if (targetJid === conn.user.jid) throw '❌ *لا يـمـكـنـك تـنـفـيـذ الأمـر عـلـى الـبـوت*'

  // 🛡️ حماية المطورين
  const owners = (global.owner || []).map(v => v[0] + '@s.whatsapp.net')
  if (owners.includes(targetJid)) throw '👑 *لا يـمـكـن تـنـفـيـذ الأمـر عـلـى مـطـور الـبـوت*'

  // 🛡️ حماية صاحب المجموعة
  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
  if (targetJid === groupOwner) throw '❌ *لا يـمـكـنـك تـنـفـيـذ الأمـر عـلـى صـاحـب الـمـجـمـوعـة*'

  // 🗄️ تهيئة قاعدة البيانات للمستخدم
  if (!global.db.data.users[targetJid]) global.db.data.users[targetJid] = {}
  let userData = global.db.data.users[targetJid]
  if (typeof userData.muto !== 'boolean') userData.muto = false

  // 🎨 تجهيز رسالة الاقتباس (Fake Quote)
  const thumbUrl = (command === 'كتم' || command === 'اسكت') 
    ? 'https://telegra.ph/file/f8324d9798fa2ed2317bc.png' 
    : 'https://telegra.ph/file/aea704d0b242b8c41bf15.png'
  const thumb = await getThumbnail(thumbUrl)

  const responseMessage = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'SukunaMute', remoteJid: m.chat },
    message: {
      locationMessage: {
        name: `${global.botname || 'Sukuna'} Mute System`,
        jpegThumbnail: thumb
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const botName = global.botname || 'سوكونا'
  const targetName = await conn.getName(targetJid)
  const adminName = await conn.getName(m.sender)

  // 🔇 تنفيذ أمر الكتم
  if (command === 'كتم' || command === 'اسكت') {
    if (userData.muto === true) throw `⏳ *الـعـضـو ${targetName} مـكـتـوم بـالـفـعـل*`
    
    userData.muto = true
    await m.react('🔇')
    
    const successMsg = `
*⎔⋅•━━╼╃⌬〔﷽〕⌬╄╾━━•⋅⎔*
*⌗› تـم تـنـفـيـذ الأمـر بـنـجـاح ˼˹*
*⋄⊹•─๋︩︪╾─•┈ ⧼ ⇊ ⧽ ┈•─╼─๋︩︪•⊹⋄*

> *╮──────────────────⟢ـ*
> * ほ${botName} ⤣🔇⤤〆* ╯─────────────────⟢ـ
*⌝🔕┊↢ تـم كـتـم الـعـضـو: ${targetName}*
*⌝👤┊↢ الـرقـم: ${targetJid.split('@')[0]}*
*⌝👮┊↢ بـواسـطـة: ${adminName}*
*╯⋄━─━─━─═◞⬪※⬪◟═─━─━─━⋄╰ـ*
> *┃╻لـن تـظـهـر أي رسـالـة لـهـذا الـعـضـو مـن الآن╹*
*╰⋄━─━─━─═◞⬪※⬪◟═─━─━─━⋄╰ـ*
`.trim()

    await conn.reply(m.chat, successMsg, responseMessage, { mentions: [targetJid, m.sender] })
  }

  // 🔊 تنفيذ أمر فك الكتم
  else if (command === 'فك_الكتم' || command === 'الغي_الكتم' || command === 'تكلم') {
    if (userData.muto === false) throw `⏳ *الـعـضـو ${targetName} غـيـر مـكـتـوم*`
    
    userData.muto = false
    await m.react('🔊')
    
    const successMsg = `
*⎔⋅•━━╼╃⌬〔﷽〕⌬╄╾━━•⋅⎔*
*⌗› تـم تـنـفـيـذ الأمـر بـنـجـاح ˼˹*
*⋄⊹•─๋︩︪╾─•┈ ⧼ ⇊ ⧽ ┈•─╼─๋︩︪•⊹⋄*

> *╮──────────────────⟢ـ*
> * ほ${botName} ⤣🔊⤤〆* ╯─────────────────⟢ـ
*⌝🔔┊↢ تـم فـك كـتـم الـعـضـو: ${targetName}*
*⌝👤┊↢ الـرقـم: ${targetJid.split('@')[0]}*
*⌝👮┊↢ بـواسـطـة: ${adminName}*
*╯⋄━─━─━─═◞⬪※⬪◟═─━─━─━⋄╰ـ*
> *┃╻يـمـكـنـه الـتـحـدث بـحـريـة مـرة أخـرى╹*
*╰⋄━─━─━─═◞⬪※⬪◟═─━─━─━⋄╰ـ*
`.trim()

    await conn.reply(m.chat, successMsg, responseMessage, { mentions: [targetJid, m.sender] })
  }
}

// 🗑️ المستمع لحذف رسائل المكتومين (يعمل في الخلفية)
handler.all = async function (m) {
  if (!m.isGroup) return
  if (!global.db.data.users[m.sender]) return
  
  let user = global.db.data.users[m.sender]
  if (!user.muto) return

  // حماية من حذف رسائل المشرفين أو في حالة فقدان البوت لصلاحية الإشراف
  try {
    const groupMetadata = await this.groupMetadata(m.chat)
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
    if (admins.includes(m.sender)) return
    
    // التحقق من أن البوت مشرف قبل محاولة الحذف
    const botJid = this.user.jid
    if (!admins.includes(botJid)) return

    await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    })
  } catch (e) {
    // تجاهل الأخطاء لتجنب إغراق اللوج (Console)
  }
}

handler.help = ['- <منشن أو رد على رسالة>']
handler.tags = ['admin']
handler.command = ['كتم', 'فك_الكتم', 'اسكت', 'الغي_الكتم', 'تكلم']
handler.description = 'يقوم بكتم عضو في المجموعة (حذف رسائله تلقائياً) أو فك الكتم عنه.'
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler