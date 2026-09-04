import yts from 'yt-search'
import fetch from 'node-fetch'
import axios from 'axios'
import crypto from 'crypto'
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

const SEND_LIMIT_MB = 100

// ====== SaveTube decrypt key (كما في الأمثلة السابقة) ======
const ANU_KEY = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex')
function decryptSaveTube(enc) {
  const b = Buffer.from(enc.replace(/\s/g, ''), 'base64')
  const iv = b.subarray(0, 16)
  const data = b.subarray(16)
  const d = crypto.createDecipheriv('aes-128-cbc', ANU_KEY, iv)
  return JSON.parse(Buffer.concat([d.update(data), d.final()]).toString())
}

// ============================================
// مصدر: SaveNow (polling)
async function saveNowDownload(url, format) {
  const key = 'dfcb6d76f2f6a9894gjkege8a4ab232222'
  const initUrl = `https://p.savenow.to/ajax/download.php?copyright=0&format=${format}&url=${encodeURIComponent(url)}&api=${key}`
  const init = await fetch(initUrl, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://y2down.cc/' }, timeout: 15000 })
  const data = await init.json()
  if (!data.success && !data.id) throw new Error('SaveNow: failed to init')
  const id = data.id || data?.data?.id
  const progressUrl = `https://p.savenow.to/api/progress?id=${encodeURIComponent(id)}`
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const rj = await fetch(progressUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 })
    const st = await rj.json()
    if ((st.progress === 1000 || st.progress === 100) && st.download_url) {
      return { title: data.title || data.info?.title || 'media', url: st.download_url, source: 'saveNow' }
    }
  }
  throw new Error('SaveNow: timeout')
}

// ============================================
// مصدر: SaveTube
async function saveTubeDownload(url, type = 'video', quality = '360') {
  const cdnRes = await axios.get('https://media.savetube.me/api/random-cdn', { timeout: 10000 })
  const cdn = cdnRes.data?.cdn
  if (!cdn) throw new Error('SaveTube: no CDN')
  const info = await axios.post(`https://${cdn}/v2/info`, { url }, {
    headers: { 'Content-Type': 'application/json', origin: 'https://ytsave.savetube.me', referer: 'https://ytsave.savetube.me/' }, timeout: 15000
  })
  if (!info.data?.status) throw new Error('SaveTube: invalid info')
  const json = decryptSaveTube(info.data.data)
  const r = await axios.post(`https://${cdn}/download`, { id: json.id, key: json.key, downloadType: type, quality: String(quality) }, {
    headers: { 'Content-Type': 'application/json', origin: 'https://ytsave.savetube.me', referer: 'https://ytsave.savetube.me/' }, timeout: 20000
  })
  const downloadUrl = r.data?.data?.downloadUrl
  if (!downloadUrl) throw new Error('SaveTube: no download url')
  return { title: json.title || 'video', thumbnail: json.thumbnail, duration: json.duration, url: downloadUrl, source: 'saveTube' }
}

// ============================================
// مصدر: VidsSave
async function vidsSaveDownload(url, type = 'video', quality = null) {
  const res = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse',
    new URLSearchParams({ auth: '20250901majwlqo', domain: 'api-ak.vidssave.com', origin: 'cache', link: url }).toString(),
    { headers: { 'user-agent': 'Mozilla/5.0', 'content-type': 'application/x-www-form-urlencoded', origin: 'https://vidssave.com', referer: 'https://vidssave.com/' }, timeout: 15000 }
  )
  const data = res.data?.data
  if (!data) throw new Error('VidsSave: invalid')
  const { title, thumbnail, duration, resources } = data
  let media
  if (type === 'audio') media = resources.find(r => r.type === 'audio')
  else media = quality ? resources.find(r => r.type === 'video' && String(r.quality) === String(quality)) : resources.find(r => r.type === 'video')
  if (!media) throw new Error('VidsSave: not found media')
  return { title, thumbnail, duration, url: media.download_url, quality: media.quality, size: media.size, source: 'vidsSave' }
}

// ============================================
// مصدر: YtMp3 (audio)
async function ytMp3Download(url, bitrate = '128') {
  const { data: v } = await axios.post('https://hub.y2mp3.co/', { audioBitrate: bitrate, audioFormat: 'mp3', brandName: 'ytmp3.gg', downloadMode: 'audio', url }, {
    headers: { 'content-type': 'application/json', origin: 'https://ytmp3.gg', referer: 'https://ytmp3.gg/' }, timeout: 15000
  })
  if (!v || !v.url) throw new Error('ytMp3: no url')
  return { title: v.filename, url: v.url, size: v.size || null, source: 'ytMp3' }
}

// ============================================
// مصدر: DDownr (polling)
async function ddownrDownload(url, type = 'mp4', format = '360') {
  const params = type === 'mp3' ? { copyright: '0', format: type, audio_quality: format, url, api: 'dfcb6d76f2f6a9894gjkege8a4ab232222' } : { copyright: '0', format: format, url, api: 'dfcb6d76f2f6a9894gjkege8a4ab232222' }
  const metaRes = await axios.get('https://p.lbserver.xyz/ajax/download.php', { params, timeout: 10000 })
  const metadata = metaRes.data
  if (!metadata?.progress_url) throw new Error('DDownr: no progress')
  for (let i = 0; i < 300; i++) {
    const r = await axios.get(metadata.progress_url, { timeout: 10000 }).catch(() => null)
    const json = r?.data
    if (json && (json.progress >= 100 || json.download_url)) {
      return { title: metadata.title || metadata.info?.title || 'video', thumbnail: metadata.info?.image, url: json.download_url, alternatives: json.alternative_download_urls || [], source: 'ddownr' }
    }
    await new Promise(r => setTimeout(r, 40))
  }
  throw new Error('DDownr: timeout')
}

// ======================= helpers: timeout + firstResolved =======================
function tryWithTimeout(fnPromise, ms = 15000) {
  return new Promise((resolve, reject) => {
    let done = false
    const timer = setTimeout(() => { if (!done) { done = true; reject(new Error('timeout')) } }, ms)
    fnPromise().then(res => { if (!done) { done = true; clearTimeout(timer); resolve(res) } }).catch(err => { if (!done) { done = true; clearTimeout(timer); reject(err) } })
  })
}
function firstResolved(promises) {
  return new Promise((resolve, reject) => {
    let failures = 0
    if (!promises.length) return reject(new Error('no promises'))
    promises.forEach(p => p.then(res => resolve(res)).catch(() => { failures++; if (failures === promises.length) reject(new Error('all failed')) }))
  })
}

// ======================= اختيار أسرع مصدر =======================
async function getFastestSource(url, type = 'video', quality = '360') {
  const candidates = []
  if (type === 'audio') {
    candidates.push(tryWithTimeout(() => saveNowDownload(url, 'mp3'), 12000))
    candidates.push(tryWithTimeout(() => ytMp3Download(url, '128'), 10000))
    candidates.push(tryWithTimeout(() => saveTubeDownload(url, 'audio', '128'), 14000))
    candidates.push(tryWithTimeout(() => vidsSaveDownload(url, 'audio'), 14000))
    candidates.push(tryWithTimeout(() => ddownrDownload(url, 'mp3', '128'), 16000))
  } else {
    candidates.push(tryWithTimeout(() => vidsSaveDownload(url, 'video', quality), 10000))
    candidates.push(tryWithTimeout(() => saveNowDownload(url, quality), 12000))
    candidates.push(tryWithTimeout(() => saveTubeDownload(url, 'video', quality), 14000))
    candidates.push(tryWithTimeout(() => ddownrDownload(url, 'mp4', quality), 16000))
  }

  try {
    const r = await firstResolved(candidates)
    if (!r || !r.url) throw new Error('invalid result')
    return { title: r.title || 'media', url: r.url, quality: r.quality || quality, size: r.size || null, source: r.source || 'unknown' }
  } catch (_) {
    // fallback sequential longer timeouts
    const seq = type === 'audio' ? [
      () => tryWithTimeout(() => saveNowDownload(url, 'mp3'), 20000),
      () => tryWithTimeout(() => ytMp3Download(url, '128'), 16000),
      () => tryWithTimeout(() => saveTubeDownload(url, 'audio', '128'), 20000),
      () => tryWithTimeout(() => vidsSaveDownload(url, 'audio'), 20000),
      () => tryWithTimeout(() => ddownrDownload(url, 'mp3', '128'), 22000)
    ] : [
      () => tryWithTimeout(() => vidsSaveDownload(url, 'video', quality), 20000),
      () => tryWithTimeout(() => saveNowDownload(url, quality), 22000),
      () => tryWithTimeout(() => saveTubeDownload(url, 'video', quality), 22000),
      () => tryWithTimeout(() => ddownrDownload(url, 'mp4', quality), 24000)
    ]
    for (const fn of seq) {
      try {
        const res = await fn()
        if (res && res.url) return { title: res.title || 'media', url: res.url, quality: res.quality || quality, size: res.size || null, source: res.source || 'unknown' }
      } catch (e) { /* try next */ }
    }
    throw new Error('جميع المصادر فشلت')
  }
}

// ======================= download buffer helper =======================
async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow', timeout: 120000 })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.buffer()
}

// ======================= utils: extract id =======================
function extractVideoId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/,
    /youtube\.com\/.*[?&]v=([^&\s]+)/
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m && m[1]) return m[1]
  }
  return null
}

// ======================= handler (search + تفاصيل) =======================
let handler = async (m, { conn, text, command }) => {
  // SEARCH
  if (/^(يوتيوب|youtube|yt)$/i.test(command)) {
    if (!text) return conn.sendMessage(m.chat, { text: '❌ اكتب كلمة للبحث عن فيديوهات يوتيوب.\nمثال:\n.يوتيوب اغاني حماس' }, { quoted: m })
    try {
      const search = await yts(text)
      if (!search || !search.videos || !search.videos.length) return conn.sendMessage(m.chat, { text: "❌ لم أجد أي نتائج." }, { quoted: m })
      const results = search.videos.slice(0, 10)
      global.youtubeSearchResults = results

      // rows for list
      const rows = results.map((v, i) => ({
        header: `🎬 ${i + 1}`,
        title: `${v.title.substring(0, 60)}`,
        description: `👤 ${v.author.name} | ⏱ ${v.timestamp} | 👁 ${v.views.toLocaleString()}`,
        id: `.تفاصيل ${i + 1}`
      }))

      // prepare media preview (thumbnail)
      const media = await prepareWAMessageMedia({ image: { url: results[0].thumbnail } }, { upload: conn.waUploadToServer })

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `🔍 *نتائج البحث عن:* ${text}\n\nاختر فيديو من القائمة للتحميل بأعلى جودة متاحة 👇`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "🎬 YouTube Search & Download" }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "🎥 نتائج البحث",
                hasMediaAttachment: true,
                ...(media.imageMessage ? { imageMessage: media.imageMessage } : {})
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "「 قائمة الفيديوهات 」",
                      sections: [
                        {
                          title: "🎬 نتائج البحث",
                          highlight_label: "YouTube Bot",
                          rows
                        }
                      ]
                    })
                  }
                ]
              })
            })
          }
        }
      }, { userJid: m.sender })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } catch (e) {
      console.error(e)
      await conn.sendMessage(m.chat, { text: "❌ حصل خطأ أثناء البحث." }, { quoted: m })
    }
  }

  // DETAILS / DOWNLOAD
  if (/^تفاصيل$/i.test(command)) {
    if (!text) return await m.reply("⚠️ الرجاء إدخال رقم الفيديو من قائمة البحث.")
    const choice = parseInt(text)
    if (isNaN(choice)) return await m.reply("❌ الرجاء إدخال رقم صحيح.")
    if (!global.youtubeSearchResults || choice < 1 || choice > global.youtubeSearchResults.length) return await m.reply("❌ لم يتم العثور على الفيديو المحدد. قم بإجراء بحث جديد أولاً.")
    const selected = global.youtubeSearchResults[choice - 1]

    try {
      const waitMsg = await conn.sendMessage(m.chat, { text: `🎬 *جاري التحضير للتحميل...*\n\n📌 *العنوان:* ${selected.title}\n👤 *القناة:* ${selected.author.name}\n⏱ *المدة:* ${selected.timestamp}\n\n🔄 جاري تحديد أفضل مصدر...` }, { quoted: m })

      // اختر أفضل مصدر (video) — الجودة auto
      const best = await getFastestSource(selected.url, 'video', '1080') // نجرب 1080 كأقصى تفضيل
      if (!best || !best.url) throw new Error('لم يتم الحصول على رابط تحميل صالح')

      // حاول جلب البافر (قد يكون رابط مباشر)
      let buffer = null
      let sizeBytes = best.size || null
      try {
        buffer = await fetchBuffer(best.url)
        sizeBytes = buffer.length
      } catch (e) {
        // لو فشل جلب البافر، نرسل لينك كـ بديل
        console.warn('buffer fetch failed, will send link instead', e.message)
      }

      const sizeMB = sizeBytes ? (sizeBytes / (1024 * 1024)) : null
      if (buffer && sizeMB && sizeMB <= SEND_LIMIT_MB) {
        const qualityNames = { '144': '144p', '360': '360p', '720': '720p', '1080': '1080p', '1440': '1440p', '2160': '2160p' }
        const caption = `
╭─━━━〔 🎬 YouTube 〕━━━─╮
✅ *تم التحميل بنجاح*

📌 *العنوان:* ${selected.title}
👤 *القناة:* ${selected.author.name}
⏱ *المدة:* ${selected.timestamp}
👁 *المشاهدات:* ${selected.views.toLocaleString()}

📊 *الحجم:* ${sizeMB.toFixed(2)} MB
🎥 *الجودة:* ${qualityNames[best.quality] || best.quality + 'p'}
🆔 *ID:* ${selected.videoId || extractVideoId(selected.url)}
╰─━━━〔 ✨ 〕━━━─╯
        `.trim()
        await conn.sendMessage(m.chat, { video: buffer, caption, mimetype: 'video/mp4', fileName: `${selected.title.substring(0,50)}_${best.quality || 'auto'}.mp4` }, { quoted: m })
        await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {})
        return
      }

      // لو الملف كبير أو لم نتمكن من تحميله، أرسل رابط التحميل والمعلومات
      let replyText = `🔗 تم إيجاد رابط تحميل من: *${best.source || 'unknown'}*\n\n` +
        `📌 العنوان: ${selected.title}\n` +
        `🎥 الجودة: ${best.quality || 'auto'}\n` +
        `🧾 الحجم (تقديري): ${sizeMB ? sizeMB.toFixed(2) + ' MB' : 'غير معروف'}\n\n` +
        `🔗 لينك: ${best.url}\n\n` +
        `💡 ملاحظة: إذا أردت تحميل الملف وإرساله مباشرة (إن كان أصغر من ${SEND_LIMIT_MB}MB) أعد المحاولة أو جرب جودة أقل.`

      await conn.sendMessage(m.chat, { text: replyText, edit: waitMsg.key }, { quoted: m })
      await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {})

    } catch (error) {
      console.error('YOUTUBE DOWNLOAD ERROR:', error)
      let errorMsg = '❌ *حدث خطأ في التحميل*\n\n'
      if (error.message.includes('not found')) errorMsg += '🔍 لم يتم العثور على الفيديو'
      else if (error.message.includes('age restricted')) errorMsg += '🔞 الفيديو محظور بسبب العمر'
      else if (error.message.includes('private')) errorMsg += '🔒 الفيديو خاص ولا يمكن تحميله'
      else errorMsg += `📝 ${error.message || 'خطأ غير معروف'}`
      await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m })
    }
  }
}

handler.help = ['يوتيوب <بحث>', 'youtube <بحث>', 'yt <بحث>', 'تفاصيل <رقم>']
handler.tags = ['search', 'downloader']
handler.command = /^(يوتيوب|youtube|yt|تفاصيل)$/i
handler.limit = true

export default handler