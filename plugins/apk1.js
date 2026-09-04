import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `❀ يرجى إدخال اسم التطبيق للبحث عنه.\nمثال: *${usedPrefix + command} whatsapp*`, m)
    }

    try {
        await m.react('🕒')
        
        // استخدام رابط الـ API الرسمي والمحدث لخدمات أبتويد
        let searchUrl = `https://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(text)}/limit=1`
        let response = await fetch(searchUrl)
        let json = await response.json()

        // فحص ما إذا كان البحث قد أعطى نتيجة أم لا
        if (!json.datalists || !json.datalists.list || json.datalists.list.length === 0) {
            // محاولة بحث ثانية عبر طريقة بديلة إذا فشلت الطريقة الأولى
            let altUrl = `https://ws75.aptoide.com/api/7/listSearchApps/query=${encodeURIComponent(text)}`
            let altRes = await fetch(altUrl).catch(() => null)
            let altJson = await altRes?.json().catch(() => null)

            if (!altJson || !altJson.results || altJson.results.list.length === 0) {
                await m.react('✖️')
                return conn.reply(m.chat, `⚠︎ لم يتم العثور على نتائج تطابق "${text}". قد يكون التطبيق محجوباً أو غير متوفر حالياً.`, m)
            }
            json = { datalists: { list: altJson.results.list } }
        }

        let app = json.datalists.list[0]
        let appName = app.name
        let appPkg = app.package
        let appSize = app.size ? (app.size / (1024 * 1024)).toFixed(2) + ' MB' : 'غير معروف'
        let appIcon = app.icon
        let appDl = app.file && app.file.path ? app.file.path : null
        let appUpdate = app.updated ? app.updated.split(' ')[0] : 'حديث'

        if (!appDl) {
            await m.react('✖️')
            return conn.reply(m.chat, `⚠︎عذراً، رابط تحميل هذا التطبيق غير متاح حالياً.`, m)
        }

        let txt = `*乂  تحميلات - أبتويد 乂*\n\n`
        txt += `≡ *الاسم* : ${appName}\n`
        txt += `≡ *الحزمة* : ${appPkg}\n`
        txt += `≡ *آخر تحديث* : ${appUpdate}\n`
        txt += `≡ *الحجم* : ${appSize}\n\n`
        txt += `> اضغط على الزر بالأسفل للبحث عن تطبيق آخر.`

        // إرسال صورة التطبيق ومعلوماته مع الأزرار
        await conn.sendMessage(m.chat, {
            image: { url: appIcon },
            caption: txt,
            footer: '© Aptoide Downloader',
            buttons: [
                {
                    buttonId: `${usedPrefix}aptoide`,
                    buttonText: { displayText: '🔍 بحث جديد' },
                    type: 1
                }
            ],
            headerType: 4
        }, { quoted: m })

        // إرسال ملف الـ APK مباشرة كوثيقة
        await conn.sendMessage(m.chat, { 
            document: { url: appDl }, 
            mimetype: 'application/vnd.android.package-archive', 
            fileName: `${appName}.apk`, 
            caption: null 
        }, { quoted: m })

        await m.react('✔️')

    } catch (error) {
        await m.react('✖️')
        return conn.reply(m.chat, `⚠︎ حدث خطأ أثناء جلب التطبيق.\n> استخدم *${usedPrefix}report* للإبلاغ عنه.\n\n${error.message}`, m)
    }
}

handler.tags = ['descargas']
handler.help = ['aptoide']
handler.command = ['apk1', 'modapk', 'aptoide']
handler.group = true

export default handler