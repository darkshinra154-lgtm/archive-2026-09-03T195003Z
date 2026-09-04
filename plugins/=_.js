/*
 * ═══════════════════════════════════════════════════════
 * ⚡ EXEC | أمر تنفيذ الأكواد المباشرة (للمطورين فقط) — V2
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 📜 الوصف: تنفيذ أي كود JavaScript مع دعم كامل لـ async/await
 *           و ESM imports عبر vm module (مش new Function)
 * ═══════════════════════════════════════════════════════
 */

import { proto, prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { exec as cpExec } from 'child_process'
import { promisify } from 'util'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import chalk from 'chalk'
import { format } from 'util'
import vm from 'vm'
import { createRequire } from 'module'

const execAsync = promisify(cpExec)
const TIMEOUT_MS = 15000 // 15 ثانية

let handler = async (m, { conn, isOwner, usedPrefix, command, text, args }) => {
  if (!isOwner) {
    return m.reply(`*❆│·••━━⊰👑━━••·│❆*\n> ˼‏⚠️˹ أمر خطير جداً وممنوع على العامة!╿↶\n│┊🌑 مسموح بس لـ: *${global.author || 'آدم (شادو)'}*\n*❆│·••━━⊰👑━━••·│❆*`)
  }

  const pfx = usedPrefix || '.'
  const cmd = command.toLowerCase()
  let code = text || ''

  // 📝 لو مفيش كود، اعرض المساعدة
  if (!code.trim() && !m.quoted?.body) {
    const help = `*❆│·••━━⊰⚡━━••·│❆*\n` +
      `⌗› مـوسـوعـة تـنـفـيـذ الأكـواد  ˼˹\n` +
      `*⋄⊹•─๋︩︪─•┈ ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n\n` +
      `> ˼‏📖˹ الاستخدام╿↶\n` +
      `│┊⚡ \`${pfx}=> كود\` — تنفيذ كود مع await\n` +
      `│┊🔧 \`${pfx}> كود\` — تنفيذ كود متزامن\n` +
      `│┊💻 \`${pfx}$ أمر_شيل\` — تنفيذ أمر في التيرمنال\n` +
      `│┊📋 \`${pfx}=> (رد على رسالة بكود)\` — تنفيذ الكود من الرسالة\n\n` +
      `> ˼‏🔑˹ المتغيرات المتاحة╿↶\n` +
      `│┊🤖 \`conn\` \`m\` \`sender\` \`chat\`\n` +
      `│┊📦 \`Buffer\` \`fs\` \`path\` \`axios\` \`fetch\`\n` +
      `│┊🎨 \`proto\` \`prepareWAMessageMedia\`\n` +
      `│┊🗄️ \`db\` \`global\`\n\n` +
      `> ˼‏💡˹ أمثلة╿↶\n` +
      `│┊⚡ \`${pfx}=> return 1 + 1\`\n` +
      `│┊⚡ \`${pfx}=> await conn.sendMessage(m.chat, {text: 'hi'})\`\n` +
      `│┊⚡ \`${pfx}=> import('fs').then(f => f.readFileSync('a.txt'))\`\n` +
      `*❆│·••━━⊰⚡━━••·│❆*`
    return m.reply(help)
  }

  // 📋 لو مفيش نص بس فيه رسالة مردود عليها
  if (!code.trim() && m.quoted?.body) {
    code = m.quoted.body.replace(/^[.\/#!]\s*(=>|>|exec|eval|نفذ|شغل)\s*/i, '')
  }

  // ═══════════ 💻 تنفيذ أمر Shell ($ command) ═══════════
  if (cmd === '$' || cmd === 'shell' || cmd === 'term') {
    if (!code.trim()) return m.reply('⚠️ *اكتب الأمر اللي عايز تنفذه في التيرمنال!*')
    await m.react('💻')
    try {
      const { stdout, stderr } = await execAsync(code, { timeout: TIMEOUT_MS })
      let out = ''
      if (stdout) out += `*✅ stdout:*\n\`\`\`\n${stdout}\n\`\`\`\n`
      if (stderr) out += `*⚠️ stderr:*\n\`\`\`\n${stderr}\n\`\`\`\n`
      if (!out) out = '✅ *تم التنفيذ بنجاح (مفيش ناتج)*'
      return m.reply(out)
    } catch (e) {
      return m.reply(`*❌ خطأ في التنفيذ:*\n\`\`\`\n${e.message}\n\`\`\``)
    }
  }

  // ═══════════ ⚡ تنفيذ JavaScript ═══════════
  await m.react('⚡')

  const isAsync = cmd === '=>' || cmd === 'eval' || cmd === 'نفذ' || cmd === 'شغل' || code.includes('await ')

  // 🛠️ الـ sandbox (كل المتغيرات المتاحة)
  const _console = {
    log: (...args) => { _console._output += args.map(a => typeof a === 'string' ? a : format(a)).join(' ') + '\n' },
    error: (...args) => { _console._output += '❌ ' + args.map(a => typeof a === 'string' ? a : format(a)).join(' ') + '\n' },
    warn: (...args) => { _console._output += '⚠️ ' + args.map(a => typeof a === 'string' ? a : format(a)).join(' ') + '\n' },
    info: (...args) => { _console._output += 'ℹ️ ' + args.map(a => typeof a === 'string' ? a : format(a)).join(' ') + '\n' },
    _output: ''
  }

  const sandbox = {
    // 🤖 اتصال البوت
    conn, sock: conn,
    // 📨 الرسالة
    m, message: m,
    sender: m.sender,
    chat: m.chat,
    name: m.pushName || '',
    isOwner,
    isGroup: m.isGroup,
    // 📦 المكتبات
    Buffer,
    fs,
    path,
    axios,
    fetch,
    chalk,
    format,
    // 🎨 baileys
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    // 🗄️ قاعدة البيانات
    db: globalThis.db,
    database: globalThis.db?.data,
    // 🌍 Globals
    global: globalThis,
    globalThis,
    // 🔧 أدوات
    require: createRequire(import.meta.url),
    // 🛡️ حماية
    process,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    // 📝 Console
    console: _console,
    // ⚡ Promise helpers
    Promise,
    JSON,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Map,
    Set,
    Error,
    TypeError,
    SyntaxError,
    // 💫 دعم import() ديناميكي
    import: (url) => import(url)
  }

  // 🚀 التنفيذ باستخدام vm module (بيدعم ESM + async/await)
  let result = null
  let error = null
  let executionTime = 0

  const startTime = Date.now()
  try {
    // لف الكود في async IIFE لو بيستخدم await
    let wrappedCode = code
    if (isAsync) {
      wrappedCode = `(async () => { 
        try {
          const __result = await (async () => { ${code} })();
          return __result;
        } catch (__e) {
          throw __e;
        }
      })()`
    } else {
      wrappedCode = `(() => { ${code} })()`
    }

    const context = vm.createContext(sandbox)
    const script = new vm.Script(wrappedCode, {
      filename: 'exec.js',
      timeout: TIMEOUT_MS
    })

    // Run with promise support
    const runPromise = script.runInContext(context, { timeout: TIMEOUT_MS })
    
    // لو async، استنى الـ promise
    if (isAsync && runPromise && typeof runPromise.then === 'function') {
      result = await Promise.race([
        runPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`⏱️ انتهى الوقت (${TIMEOUT_MS/1000}s)`)), TIMEOUT_MS)
        )
      ])
    } else {
      result = runPromise
    }

    executionTime = Date.now() - startTime
  } catch (e) {
    error = e
    executionTime = Date.now() - startTime
  }

  // 📤 عرض النتيجة
  let output = ''

  // لو فيه console.log output
  if (_console._output) {
    output += `*📋 console output:*\n\`\`\`\n${_console._output.trim()}\n\`\`\`\n\n`
  }

  // لو فيه خطأ
  if (error) {
    output += `*❌ خطأ (${executionTime}ms):*\n\`\`\`\n${error.message}\n\`\`\`\n`
    if (error.stack) {
      const stack = error.stack.split('\n').slice(0, 5).join('\n')
      output += `\n*📍 Stack:*\n\`\`\`\n${stack}\n\`\`\`\n`
    }
    await m.react('❌')
    return m.reply(output)
  }

  // لو فيه نتيجة
  if (result !== undefined) {
    let resultStr
    try {
      if (typeof result === 'object' && result !== null) {
        resultStr = JSON.stringify(result, (key, value) => {
          if (typeof value === 'string' && value.length > 200) return value.substring(0, 200) + '... [مقطوع]'
          if (Buffer.isBuffer(value)) return `[Buffer: ${value.length} bytes]`
          if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`
          if (value instanceof Error) return `[Error: ${value.message}]`
          return value
        }, 2)
        if (resultStr.length > 4000) resultStr = resultStr.substring(0, 4000) + '\n... [مقطوع]'
      } else if (typeof result === 'function') {
        resultStr = `[Function: ${result.name || 'anonymous'}]`
      } else {
        resultStr = format(result)
      }
    } catch (e) {
      resultStr = String(result)
    }

    output += `*✅ النتيجة (${executionTime}ms):*\n\`\`\`\n${resultStr}\n\`\`\`\n`
  } else if (!_console._output) {
    output += `*✅ تم التنفيذ بنجاح (${executionTime}ms) — مفيش ناتج*\n`
  }

  await m.react('✅')
  return m.reply(output)
}

handler.help = ['<كود JavaScript>']
handler.tags = ['owner', 'advanced']
handler.command = ['=>', '>', '$', 'eval', 'exec', 'نفذ', 'شغل', 'كود']
handler.description = 'تنفيذ أكواد JavaScript مباشرة من الشات — يدعم async/await، ESM imports، console.log، وكل مكتبات البوت.'
handler.owner = true

export default handler