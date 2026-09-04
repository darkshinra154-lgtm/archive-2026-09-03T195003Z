// plugins/nobara-ai.js
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix }) => {
  try {
    if (!args || !args.length) {
      return await conn.sendMessage(
        m.chat,
        {
          text: `⚠️ الاستخدام:\n${usedPrefix}نوبارا <سؤالك>\n\nمثال:\n${usedPrefix}نوبارا كيف أتعامل مع التوتر قبل الامتحان؟`
        },
        { quoted: m }
      )
    }

    const question = args.join(' ').trim()

    // رسالة انتظار بطابع نوبارا — سريعة وحادة شوي
    await conn.sendMessage(
      m.chat,
      { text: '🔨 نوبارا وصلت. اسمعي كويس، راح أرد بسرعة.' },
      { quoted: m }
    )

    // توجيه الشخصية - أسلوب نوبارا كوجيساكي
    const systemPrompt = `
أنت "نوبارا كوجيساكي" (Nobara Kugisaki) من عالم Jujutsu Kaisen.
تكلّم بأسلوب:
- واثق، مباشر، وحاد أحياناً — لكن داعم ومشجع.
- اختصر الكلام وكن صريحاً؛ لا تنطوي في كلمات كثيرة.
- عند تقديم نصيحة: اعطِ 1-3 خطوات عملية قابلة للتطبيق، واضحة ومباشرة.
- لو السائل متوتر أو حزين: بدا بتعاطف قصير ثم قدّم حل عملي مع لهجة تشجيع صارمة (مثل "قومّي وبلاش تذمر").
- لا تذكر أنك ذكاء اصطناعي أو تُعتذر بصيغ مملة.
- الرد يجب أن يكون موجزاً: بين 1 إلى 6 جمل كحد أقصى.
- أنهِ الرد بجملة دعم قوية أو تحدي لطيف (مثلاً: "هيا، قدها." أو "وريني شطارتك.").
السؤال:
"""${question}"""
`.trim()

    const apiUrl = `https://dark-v2-api-one.vercel.app/api/v1/ai/copilot?prompt=${encodeURIComponent(systemPrompt)}&model=default`

    const res = await fetch(apiUrl, { timeout: 20000 })
    if (!res.ok) throw new Error(`خادم الذكاء لم يرد (رمز: ${res.status})`)

    let data = {}
    try {
      data = await res.json()
    } catch (e) {
      const txt = await res.text().catch(() => '')
      data = { response: txt || null }
    }

    const reply =
      (data?.response && String(data.response).trim()) ||
      (data?.message && String(data.message).trim()) ||
      (data?.result && String(data.result).trim()) ||
      (data?.answer && String(data.answer).trim()) ||
      null

    if (!reply) throw new Error('لم يصل رد من الخدمة الخارجية.')

    // تنظيف وتقصير الرد إلى عدة جمل مناسبة لأسلوب نوبارا
    const cleaned = String(reply).trim()
    const sentences = cleaned
      .split(/(?<=[.؟!?\n])/u)
      .map(s => s.replace(/\s+/g, ' ').trim())
      .filter(s => s)
    let finalReply = sentences.slice(0, 6).join(' ').trim()
    if (!finalReply) finalReply = cleaned.slice(0, 600)

    // إذا لم يحتوي على نهاية تحفيزية، أضف واحدة بنبرة نوبارا
    if (!/(هيا|وريني|قدها|لا تقلق|أنا معك)/i.test(finalReply)) {
      const endings = ['هيا، قدها.', 'وريني شطارتك.', 'لا تستسلم.']
      finalReply += `\n\n🔨 ${endings[Math.floor(Math.random() * endings.length)]}`
    }

    const finalText = `
╭─━━━〔 🔩 نوبارا كوجيساكي 〕━━━─╮
${finalReply}
╰─━━━〔 ✦ 〕━━━─╯
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        text: finalText,
        contextInfo: {
          externalAdReply: {
            title: 'نوبارا — صريحة، حادة، ومشجعة',
            body: 'إجابة قصيرة، عملية، وبنبرة قوية',
            thumbnailUrl: 'https://i.postimg.cc/FHMPp8m1/971859d7e8d24cd391aded0ede9aa118.jpg', // غيّر لو عندك صورة أفضل
            sourceUrl: 'https://dark-v2-api.vercel.app',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )
  } catch (err) {
    console.error('NOBARA HANDLER ERROR:', err)
    await conn.sendMessage(
      m.chat,
      { text: `❌ نوبارا لم تتمكن من الرد الآن:\n${err.message || String(err)}` },
      { quoted: m }
    )
  }
}

handler.help = ['نوبارا <سؤال>']
handler.tags = ['ai']
handler.command = /^نوبارا$/i
handler.group = false

export default handler