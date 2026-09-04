import axios from 'axios'

const HEADERS = {
  'accept': 'application/json, text/javascript, */*',
  'accept-language': 'ar-EG,ar;q=0.9,en-GB;q=0.8',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'x-app-version': '4f340f4',
  'x-requested-with': 'XMLHttpRequest',
  'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'referer': 'https://www.pinterest.com/',
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text?.trim()) return m.reply(
    `🖼️ *استخدام:*\n${usedPrefix + command} كلمة البحث\n\n` +
    `💡 *مثال:*\n${usedPrefix + command} سوكونا ساتورو`
  )

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
  await m.reply(`⏳ *جاري البحث عن:* ${text}...`)

  try {
    // ══════════════════════════════
    // البحث في Pinterest
    // ══════════════════════════════
    const params = {
      source_url: `/search/pins/?q=${encodeURIComponent(text)}&rs=typed`,
      data: JSON.stringify({
        options: {
          query: text,
          scope: 'pins',
          appliedProductFilters: '---',
          auto_correction_disabled: false,
          rs: 'typed',
          redux_normalize_feed: true
        },
        context: {}
      }),
      _: Date.now()
    }

    const res = await axios.get('https://www.pinterest.com/resource/BaseSearchResource/get/', {
      params,
      headers: {
        ...HEADERS,
        'x-pinterest-pws-handler': 'www/search/[scope].js',
        'x-pinterest-source-url': `/search/pins/?q=${encodeURIComponent(text)}&rs=typed`,
      },
      timeout: 30000
    })

    // استخراج الصور من النتائج
    const results = res.data?.resource_response?.data?.results || []

    if (!results.length) return m.reply('❌ لم يتم العثور على نتائج!')

    // فلترة الـ pins اللي عندها صور
    const pins = results
      .filter(p => p?.images?.orig?.url || p?.images?.['736x']?.url)
      .slice(0, 6)

    if (!pins.length) return m.reply('❌ لم يتم العثور على صور!')

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    // إرسال كل صورة
    for (const pin of pins) {
      const imgUrl = pin?.images?.orig?.url || pin?.images?.['736x']?.url
      const title  = pin?.title || pin?.description || ''
      const pinner = pin?.pinner?.username || ''
      const link   = `https://www.pinterest.com/pin/${pin?.id}/`

      try {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: imgUrl },
            caption:
              `${title ? `📌 *${title.slice(0, 100)}*\n` : ''}` +
              `${pinner ? `👤 ${pinner}\n` : ''}` +
              `🔗 ${link}`
          },
          { quoted: m }
        )
        // تأخير صغير بين كل صورة
        await new Promise(r => setTimeout(r, 500))
      } catch { }
    }

  } catch (err) {
    console.error('[pinterest]', err.message)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await m.reply(`❌ *فشل البحث!*\n\n📝 ${err.message}`)
  }
}

handler.help    = ['بنتريست', 'pinterest']
handler.tags    = ['tools']
handler.command = ['بينتر']

export default handler