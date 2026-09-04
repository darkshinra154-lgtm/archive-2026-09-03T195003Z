// ✦ آدم 💀🩸 ✦
import { spawn } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
    }

    // عرض المساعدة لو مفيش arguments
    if (!args.length) {
        await react('📦')
        return m.reply(
            `𓆩🩸𓆪 ═══ ❬ *مدير المكتبات* ❭ ═══ 𓆩🩸𓆪\n\n` +
            `📝 ┊ *الاستخدام:*\n` +
            `\`${usedPrefix}${command} <اسم_المكتبة> [مكتبة_2] ...\`\n\n` +
            `💡 ┊ *أمثلة:*\n` +
            `🔹 \`${usedPrefix}${command} axios\`\n` +
            `🔹 \`${usedPrefix}${command} axios@1.9.0\`\n` +
            `🔹 \`${usedPrefix}${command} chalk moment lodash\`\n` +
            `🔹 \`${usedPrefix}${command} @whiskeysockets/baileys\`\n\n` +
            `⚙️ ┊ *المميزات:*\n` +
            `⚡ تثبيت عدة مكتبات دفعة واحدة\n` +
            `🎯 دعم تحديد إصدار محدد\n` +
            `📊 عرض سجل التثبيت المباشر\n` +
            `🔍 فحص ملف package.json\n\n` +
            `📋 ┊ *أوامر إضافية:*\n` +
            `\`${usedPrefix}${command} --list\` عرض المكتبات المثبتة\n` +
            `\`${usedPrefix}${command} --check <اسم>\` فحص مكتبة معينة\n` +
            `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩🩸𓆪`
        )
    }

    // أمر عرض المكتبات المثبتة
    if (args[0] === '--list' || args[0] === 'قائمة') {
        try {
            const pkgPath = join(process.cwd(), 'package.json')
            if (!existsSync(pkgPath)) {
                await react('❌')
                return m.reply('❌ ملف package.json غير موجود!')
            }
            const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
            const deps = Object.entries(pkg.dependencies || {})
            const optDeps = Object.entries(pkg.optionalDependencies || {})

            let text = `𓆩🩸𓆪 ═══ ❬ *المكتبات المثبتة* ❭ ═══ 𓆩🩸𓆪\n\n`
            text += `📦 ┊ *المكتبات الأساسية (${deps.length}):*\n`
            deps.slice(0, 30).forEach(([name, ver], i) => {
                text += `${i + 1}. \`${name}\` → ${ver}\n`
            })
            if (deps.length > 30) text += `... و ${deps.length - 30} مكتبة أخرى\n`

            if (optDeps.length > 0) {
                text += `\n🎁 ┊ *المكتبات الاختيارية (${optDeps.length}):*\n`
                optDeps.forEach(([name, ver], i) => {
                    text += `${i + 1}. \`${name}\` → ${ver}\n`
                })
            }

            text += `\n📊 ┊ *الإجمالي:* ${deps.length + optDeps.length} مكتبة`
            await react('📋')
            return m.reply(text)
        } catch (e) {
            await react('❌')
            return m.reply(`❌ خطأ في قراءة package.json:\n${e.message}`)
        }
    }

    // أمر فحص مكتبة معينة
    if (args[0] === '--check' || args[0] === 'فحص') {
        const pkgName = args[1]
        if (!pkgName) {
            await react('⚠️')
            return m.reply('⚠️ اكتب اسم المكتبة بعد --check')
        }
        try {
            const pkgPath = join(process.cwd(), 'package.json')
            const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.optionalDependencies || {}) }
            
            if (allDeps[pkgName]) {
                await react('✅')
                return m.reply(
                    `✅ ┊ *المكتبة موجودة!*\n` +
                    `📦 الاسم: \`${pkgName}\`\n` +
                    `🔢 الإصدار: ${allDeps[pkgName]}`
                )
            } else {
                await react('❌')
                return m.reply(`❌ المكتبة \`${pkgName}\` غير مثبتة في package.json`)
            }
        } catch (e) {
            await react('❌')
            return m.reply(`❌ خطأ: ${e.message}`)
        }
    }

    // ═══════════════════════════════════════════════
    // ✦ التثبيت الفعلي للمكتبات ✦
    // ═══════════════════════════════════════════════
    const packages = args.filter(p => p && !p.startsWith('-'))
    if (!packages.length) {
        await react('⚠️')
        return m.reply('⚠️ لم يتم التعرف على أي مكتبة صالحة.')
    }

    await react('⏳')
    const progressMsg = await m.reply(
        `𓆩🩸𓆪 ═══ ❬ *جاري التثبيت* ❭ ═══ 𓆩🩸𓆪\n\n` +
        `📦 ┊ *المكتبات:*\n${packages.map(p => `• \`${p}\``).join('\n')}\n` +
        `⏳ ┊ الرجاء الانتظار...\n` +
        `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩🩸𓆪`
    )

    const installProcess = spawn('npm', [
        'install',
        '--no-audit',
        '--no-fund',
        '--loglevel=error',
        '--save',
        ...packages
    ], {
        shell: true,
        cwd: process.cwd(),
        env: { ...process.env, FORCE_COLOR: '0' }
    })

    let stdout = ''
    let stderr = ''
    const logs = []

    installProcess.stdout.on('data', (data) => {
        const chunk = data.toString()
        stdout += chunk
        chunk.split('\n').filter(l => l.trim()).forEach(line => {
            logs.push(`✅ ${line.trim()}`)
        })
    })

    installProcess.stderr.on('data', (data) => {
        const chunk = data.toString()
        stderr += chunk
        chunk.split('\n').filter(l => l.trim()).forEach(line => {
            if (line.includes('WARN')) logs.push(`⚠️ ${line.trim()}`)
            else if (line.includes('ERR') || line.includes('error')) logs.push(`❌ ${line.trim()}`)
            else if (line.trim()) logs.push(`📝 ${line.trim()}`)
        })
    })

    installProcess.on('close', async (code) => {
        const success = code === 0
        await react(success ? '✅' : '❌')

        let result = success
            ? `𓆩🩸𓆪 ═══ ❬ ✅ *تم التثبيت* ❭ ═══ 𓆩🩸𓆪\n\n`
            : `𓆩🩸𓆪 ═══ ❬ ❌ *فشل التثبيت* ❭ ═══ 𓆩🩸𓆪\n\n`

        result += `📦 ┊ *المكتبات:*\n${packages.map(p => `• \`${p}\``).join('\n')}\n`
        result += `🔢 ┊ *رمز الانتهاء:* \`${code}\`\n`
        result += `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩🩸𓆪\n\n`

        if (logs.length > 0) {
            const limited = logs.slice(-12)
            result += `📋 ┊ *سجل التثبيت:*\n${limited.join('\n')}\n`
            if (logs.length > 12) result += `\n📊 ┊ ... و ${logs.length - 12} سطر آخر`
        } else if (success) {
            result += `✨ ┊ تم التثبيت بدون أي تحذيرات`
        }

        if (!success && stderr) {
            const errLines = stderr.split('\n').filter(l => l.trim()).slice(-5)
            result += `\n\n🔴 ┊ *تفاصيل الخطأ:*\n\`\`\`${errLines.join('\n').slice(0, 400)}\`\`\``
        }

        if (success) {
            result += `\n\n💡 ┊ بعض المكتبات قد تحتاج إعادة تشغيل البوت لتفعيلها.`
        }

        try {
            await conn.sendMessage(m.chat, { text: result, edit: progressMsg.key })
        } catch {
            await m.reply(result)
        }
    })

    installProcess.on('error', async (err) => {
        await react('❌')
        await m.reply(
            `❌ ┊ *خطأ في تنفيذ الأمر:*\n` +
            `📌 \`${err.message}\`\n\n` +
            `💡 تأكد من أن npm مثبت على السيرفر.`
        )
    })
}

handler.help = ['- <اسم_المكتبة> [@إصدار]']
handler.tags = ['developer']
handler.command = ['تحميل', 'install', 'نصب', 'تنصيب', 'add-pkg']
handler.description = 'أمر متقدم لتثبيت وإدارة مكتبات npm مباشرة من الواتساب مع دعم التثبيت المتعدد وتحديد الإصدارات وفحص المكتبات المثبتة.'
handler.owner = true

export default handler