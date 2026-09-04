/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: آدم (شادو) */

import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import syntaxerror from 'syntax-error'

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } }).catch(() => {})
  
  const pluginFolder = path.join(process.cwd(), 'plugins')
  const problems = []
  let total = 0

  const scan = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      let st
      try { st = statSync(full) } catch { continue }
      if (st.isDirectory()) { scan(full); continue }
      if (!entry.endsWith('.js')) continue
      total++
      const err = syntaxerror(readFileSync(full, 'utf8'), full, {
        sourceType: 'module',
        allowAwaitOutsideFunction: true
      })
      if (err) {
        const rel = path.relative(pluginFolder, full)
        const lines = String(err).split('\n').slice(0, 4).join('\n')
        problems.push(`❌ *${rel}*\n\`\`\`${lines}\`\`\``)
      }
    }
  }

  try { scan(pluginFolder) } catch (e) {
    return m.reply('❌ حصل خطأ أثناء الفحص: ' + e.message)
  }

  let txt = `*⌬══𝐋𝐔𝐆𝐈𝐍𝐒 𝐒𝐂𝐀𝐍𝐍𝐄𝐑══⌬*\n`
  txt += `*║* °⃟𑁁 *📂 الملفات المفحوصة:* ${total}\n`
  txt += `*║* °⃟✅ * السليمة:* ${total - problems.length}\n`
  txt += `*║* °⃟❌ *🔴 فيها مشاكل:* ${problems.length}\n`
  txt += `*⌬──══─┈•⤣⚡•┈─══──⌬*\n\n`

  if (problems.length === 0) {
    txt += `✅ *كل ملفات الأوامر سليمة 100% يا فندم!*`
  } else {
    txt += problems.slice(0, 10).join('\n\n')
  }

  txt += `\n\n> *┃╻ ${global.author || 'سوكونا'} ╹*`
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

handler.help = []
handler.tags = ['owner']
handler.command = ['فحص', 'scan', 'فحص_الاوامر']
handler.description = 'يفحص جميع ملفات الأوامر ويكشف أي خطأ في الصيغة مع اسم الملف ومكان الخطأ بالتفصيل.'
handler.owner = true

export default handler