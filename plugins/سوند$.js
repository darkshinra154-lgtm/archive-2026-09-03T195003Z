// plugins/scdl.js
import fetch from 'node-fetch'
import fs from 'fs'

const getClientId = async () => {
  const res = await fetch('https://soundcloud.com', {
    headers: { 'user-agent': 'Mozilla/5.0' }
  })
  const html = await res.text()
  const scripts = [...html.matchAll(/src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"/g)].map(x => x[1])
  for (const src of scripts) {
    try {
      const js = await fetch(src).then(r => r.text())
      const m = js.match(/client_id:"([a-zA-Z0-9]{32})"/)
      if (m) return m[1]
    } catch {}
  }
  throw new Error('مش لاقي client_id')
}

const resolveUrl = async (url) => {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0' }
  })
  return res.url
}

const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('❌ ابعت لينك SoundCloud\nمثال: .sound https://soundcloud.com/...')

  await m.reply('⏳ جاري التحميل...')

  let url = args[0]

  try {
    // حل الـ short link
    if (url.includes('on.soundcloud.com')) {
      url = await resolveUrl(url)
    }

    const clientId = await getClientId()

    // جيب track info
    const trackRes = await fetch(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(url)}&client_id=${clientId}`,
      { headers: { 'user-agent': 'Mozilla/5.0' } }
    )
    const track = await trackRes.json()

    if (!track?.media?.transcodings?.length) {
      // لو مش لاقي transcodings جرب soundcloudaud
      const dlRes = await fetch(
        `https://sc.snapfirecdn.com/soundcloud-get-dl?target=${encodeURIComponent(url)}`,
        {
          headers: {
            'user-agent': 'Mozilla/5.0',
            'origin': 'https://soundcloudaud.com',
            'referer': 'https://soundcloudaud.com/'
          }
        }
      )
      const raw = await dlRes.text()
      let mp3Url
      try { mp3Url = JSON.parse(raw)?.url } catch { mp3Url = raw.trim() }
      if (!mp3Url) throw new Error('مش لاقي MP3 URL')

      const audioRes = await fetch(mp3Url, { headers: { 'user-agent': 'Mozilla/5.0' } })
      const buffer = Buffer.from(await audioRes.arrayBuffer())

      return await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m })
    }

    const transcoding = track.media.transcodings.find(t => t.format?.protocol === 'progressive')
      || track.media.transcodings[0]

    const streamRes = await fetch(
      `${transcoding.url}?client_id=${clientId}`,
      { headers: { 'user-agent': 'Mozilla/5.0' } }
    )
    const streamData = await streamRes.json()
    const mp3Url = streamData?.url
    if (!mp3Url) throw new Error('مش لاقي MP3 URL')

    const audioRes = await fetch(mp3Url, { headers: { 'user-agent': 'Mozilla/5.0' } })
    const buffer = Buffer.from(await audioRes.arrayBuffer())

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ حصل error: ' + e.message)
  }
}

handler.command = /^سوند$/i
handler.help = ['sound <link>']
handler.tags = ['downloader']

export default handler