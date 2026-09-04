/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { addExif } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    try {
        // 🏷️ استخراج الحقوق الديناميكية أو المخصصة
        let [packname, ...author] = args.join(' ').split('|')
        author = (author || []).join('|')
        
        const finalPack = packname?.trim() || global.packname || 'Sukuna Bot'
        const finalAuthor = author?.trim() || global.author || 'Adam (Shadow)'

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        await m.react('⏳')

        if (/webp/g.test(mime)) {
            // 🔄 تعديل حقوق ملصق موجود
            let img = await q.download?.()
            if (!img) throw 'فشل تحميل الملصق!'
            stiker = await addExif(img, finalPack, finalAuthor)
            
        } else if (/image/g.test(mime)) {
            // 🖼️ تحويل صورة إلى ملصق
            let img = await q.download?.()
            if (!img) throw 'فشل تحميل الصورة!'
            stiker = await createSticker(img, null, finalPack, finalAuthor)
            
        } else if (/video/g.test(mime)) {
            // 🎥 تحويل فيديو/GIF إلى ملصق متحرك
            if ((q.msg || q).seconds > 10) {
                await m.react('❌')
                return m.reply(`> *╮──────────────────⟢ـ*\n> *⚠️ الفيديو طويل جداً!*\n> *╯──────────────────⟢ـ*\n\nيرجى إرسال مقطع أقل من *7 ثوانٍ* فقط.`)
            }
            let img = await q.download?.()
            if (!img) throw 'فشل تحميل الفيديو!'
            stiker = await createSticker(img, null, finalPack, finalAuthor, true)
            
        } else if (args[0] && isUrl(args[0])) {
            // 🔗 تحويل من رابط مباشر
            stiker = await createSticker(null, args[0], finalPack, finalAuthor)
            
        } else {
            await m.react('💡')
            return m.reply(
`*⌬══𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐌𝐀𝐊𝐄𝐑══⌬*
*║* °⃟𑁁🌓 *📌 الاستخدام الأساسي:*
*║* قم بالرد على صورة/فيديو بأمر:
*║* *${usedPrefix + command}*
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*
*║* °⃟𑁁🌓 *✍️ إضافة حقوق مخصصة:*
*║* *${usedPrefix + command} سوكونا | آدم*
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*
*║* °⃟𑁁🌓 *🔗 التحويل من رابط:*
*║* *${usedPrefix + command} <رابط_الصورة>*
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*`)
        }
    } catch (e) {
        console.error('[STICKER ERROR]:', e)
        stiker = false
        await m.react('❌')
    } finally {
        if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
            await m.react('✅')
        } else if (!m.isBaileys) {
            // تجنب إرسال رسالة خطأ إذا كان الرد قد تم بالفعل في الـ catch
        }
    }
}

handler.help = ['- <صورة / فيديو / رابط / ملصق>']
handler.tags = ['sticker']
handler.command = ['ستيكر', 'ملصق', 's', 'sticker', 'stg']
handler.description = 'تحويل الصور والفيديوهات والروابط إلى ملصقات واتساب عالية الجودة مع دعم تعديل الحقوق.'

export default handler

// --- الـدوال الـمـسـاعـدة الـمـحـسـنـة ---

const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi'))

async function createSticker(img, url, packName, authorName, isVideo = false) {
    const stickerMetadata = {
        type: StickerTypes.FULL,
        pack: packName,
        author: authorName,
        quality: 70, // جودة متوازنة للسرعة والحجم
        background: '#FFFFFF00' // خلفية شفافة
    }
    
    // إعدادات خاصة للفيديو
    if (isVideo) {
        stickerMetadata.type = StickerTypes.CROPPED // Cropped أفضل للفيديو لتقليل الحجم
        stickerMetadata.quality = 50
    }

    const stickerObj = new Sticker(img ? img : url, stickerMetadata)
    return await stickerObj.toBuffer()
}