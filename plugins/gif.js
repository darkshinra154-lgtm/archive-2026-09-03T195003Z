import axios from 'axios'
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

// ═══════════════════════════════════════
// الإعدادات
// ═══════════════════════════════════════
const IMG = 'https://i.postimg.cc/43Yt2ngB/Gojo-manga.jpg'
const TENOR_KEY = 'AIzaSyC-P6_qz3FzCoXGLk6tgitZo4jEJ5mLzD8'
const BASE = 'https://tenor.googleapis.com/v2'
const COMMON = { key: TENOR_KEY, client_key: 'tenor_web', locale: 'en' }

// ═══════════════════════════════════════
// الهاندلر
// ═══════════════════════════════════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(
        `🎞️ *Tenor GIF*\n\n` +
        `• بحث:\n${usedPrefix + command} gojo\n\n` +
        `• تحميل:\n${usedPrefix + command} gojo | 12345678`
    )

    const [query, gifId] = text.split('|').map(s => s.trim())

    try {
        // ═══════════════════════════════════════
        // 📥 تحميل GIF محدد
        // ═══════════════════════════════════════
        if (gifId) {
            const { data } = await axios.get(`${BASE}/posts`, {
                params: { ...COMMON, ids: gifId },
                timeout: 15000
            })

            const gif = data.results?.[0]
            if (!gif) return m.reply('❌ GIF مش موجود')

            const formats = gif.media_formats || {}
            const url = formats.mp4?.url
                || formats.gif?.url
                || formats.mediumgif?.url
                || formats.tinygif?.url

            if (!url) return m.reply('❌ مفيش رابط للـ GIF ده')

            const fileRes = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: { referer: 'https://tenor.com/' },
                timeout: 60000
            })

            const isGif = url.includes('.gif')
            const sizeMB = (fileRes.data.byteLength / 1024 / 1024).toFixed(2)

            return conn.sendMessage(m.chat, {
                video: Buffer.from(fileRes.data),
                mimetype: isGif ? 'video/mp4' : 'video/mp4',
                gifPlayback: true,
                caption: `🎞️ *${gif.title || query}*\n📊 ${sizeMB} MB`
            }, { quoted: m })
        }

        // ═══════════════════════════════════════
        // 🔍 البحث
        // ═══════════════════════════════════════
        const { data } = await axios.get(`${BASE}/search`, {
            params: {
                ...COMMON,
                q: query,
                limit: 20,
                contentfilter: 'low',
                media_filter: 'mp4,gif'
            },
            timeout: 20000
        })

        const results = data.results
        if (!results?.length) return m.reply(`❌ مفيش نتائج لـ "${query}"`)

        const rows = results.map(gif => ({
            header: (gif.title || gif.content_description || 'GIF').slice(0, 60),
            title: gif.tags?.slice(0, 3).join(' • ') || query,
            description: `🆔 ${gif.id}`,
            id: `${usedPrefix + command} ${query} | ${gif.id}`
        }))

        const sections = []
        for (let i = 0; i < rows.length; i += 10) {
            sections.push({
                title: `النتائج ${i + 1}–${Math.min(i + 10, rows.length)}`,
                rows: rows.slice(i, i + 10)
            })
        }

        const mediaMessage = await prepareWAMessageMedia(
            { image: { url: IMG } },
            { upload: conn.waUploadToServer }
        )

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `🔍 *${query}*\n🎞️ ${results.length} نتيجة`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: 'Tenor GIFs'
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: '🎞️ اختر GIF',
                            hasMediaAttachment: true,
                            imageMessage: mediaMessage.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({ title: 'اختر GIF', sections })
                            }]
                        })
                    })
                }
            }
        }, { userJid: m.sender, quoted: m })

        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } catch (err) {
        const status = err.response?.status
        const detail = err.response?.data?.error?.message || err.message
        console.error('[Tenor]', status, detail)
        m.reply(`❌ ${status ? `خطأ ${status}` : 'مشكلة في الاتصال'}: ${detail}`)
    }
}

handler.help = ['gif']
handler.tags = ['downloader']
handler.command = /^(gif|جيف|تينور)$/i

export default handler