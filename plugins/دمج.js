import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    
    // ربط واستخدام قاعدة البيانات العامة للبوت
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = {
            money: 500,
            items: ['أداة الدمج الأساسية'],
            characters: ['سكونة', 'جوجو'],
            fusedCharacters: []
        };
    }

    let user = global.db.data.users[who];
    
    // التأكد من تهيئة البيانات المطلوبة
    if (user.money === undefined) user.money = 500;
    if (!user.items) user.items = ['أداة الدمج الأساسية'];
    if (!user.characters) user.characters = ['سكونة', 'جوجو'];
    if (!user.fusedCharacters) user.fusedCharacters = [];

    let name = await conn.getName(who);
    
    // استخراج اسم الشخصية بدقة من النص في حال لم تكن args مقسمة جيداً
    let text = m.text || '';
    let bodyArgs = text.trim().split(/ +/).slice(1);
    let targetCharacter = args[0] || bodyArgs[0];

    // إذا لم يكتب اسم الشخصية، يتم عرض واجهة الدمج والتعليمات بنمط سكونة المرعب
    if (!targetCharacter) {
        let txt = `
╔════════⸙👹 𝖲𝖴𝖪𝖴𝖭𝖠 𝖥𝖴𝖲𝗜𝗢𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 👹⸙════════╗
║ 👤 ╎ **الأسـم:** ${name}
║ 🪙 ╎ **الـرصـيـد الـمـالـي:** \`${user.money}\`
║ 🧬 ╎ **شـخـصـيـاتـك:** \`${user.characters.join(', ')}\`
║ 🔮 ╎ **الـشـخـصـيـات اﻟـمـدمـجـة:** \`${user.fusedCharacters.length > 0 ? user.fusedCharacters.join(', ') : 'لا يوجد بعد'}\`
╠═════════════════════════════╣
║ ⚡ ╎ **طـريـقـة الـدمـج الصحيحة:**
║ أكتب الأمر متبوعاً باسم الشخصية المراد دمجها مع سكونة:
║ \`${usedPrefix + command} جوجو\`
╚═════════════════════════════╝
> 🩸 **"القوة المطلقة تتطلب تضحيات.. اختر ضحيتك بحكمة!"** ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

        let buttons = [
            { buttonId: '.جمع', buttonText: { displayText: '🛠️ جمع المتطلبات والأموال' }, type: 1 },
            { buttonId: '.شخصياتي', buttonText: { displayText: '📂 شخصياتي المدمجة' }, type: 1 }
        ];

        let buttonMessage = {
            text: txt,
            footer: 'Sukuna Fusion System © 2026',
            buttons: buttons,
            headerType: 1
        };

        try {
            await m.react('🔥');
            return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
        } catch (e) {
            try {
                return await conn.reply(m.chat, txt, m);
            } catch (err) {
                return m.reply(txt);
            }
        }
    }

    // 1. التحقق من امتلاك شخصية سكونة والشخصية المستهدفة
    if (!user.characters.includes('سكونة')) {
        let errText = `❌ **أنت لا تملك شخصية "سكونة" الأساسية في حقيبتك لتنفيذ طقوس الدمج!**`;
        try {
            return await conn.sendMessage(m.chat, { text: errText }, { quoted: m });
        } catch {
            return m.reply(errText);
        }
    }
    
    if (!user.characters.includes(targetCharacter)) {
        let errText = `❌ **أنت لا تملك شخصية "${targetCharacter}" في حقيبتك لتقوم بدمجها مع سكونة!**\n\n💡 شخصياتك المتاحة حالياً: \`${user.characters.join(', ')}\``;
        try {
            return await conn.sendMessage(m.chat, { text: errText }, { quoted: m });
        } catch {
            return m.reply(errText);
        }
    }

    // 2. التحقق من المتطلبات (الفلوس والأدوات المطلوبة للدمج)
    const requiredMoney = 1000;
    const requiredItem = 'جوهرة الطاقة';

    let missingRequirements = [];
    if (user.money < requiredMoney) {
        missingRequirements.push(`💰 فلوس غير كافية (تحتاج إلى ${requiredMoney}، ولديك ${user.money})`);
    }
    if (!user.items.includes(requiredItem)) {
        missingRequirements.push(`🧪 تنقصك أداة: "${requiredItem}"`);
    }

    // إذا كانت المتطلبات غير مكتملة
    if (missingRequirements.length > 0) {
        let missingText = missingRequirements.join('\n');
        let failMsg = `
╔════════⸙🔥 𝗦𝗨𝗞𝗨𝗡𝗔 𝗙𝗨𝗦𝗜𝗢𝗡 𝗙𝗔𝗜𝗟 🔥⸙════════╗
║ ❌ ╎ **فـشـلـت طـقـوس الـدمـج لِنقص المتطلبات!**
╠═════════════════════════════╣
${missingText.split('\n').map(line => `║ ⚠️ ╎ ${line}`).join('\n')}
╚═════════════════════════════╝
> 🩸 **"الضعفاء لا مكان لهم هنا.. اجمع ما ينقصك وعُد إليّ!"** ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

        let failButtons = [
            { buttonId: '.جمع', buttonText: { displayText: '🛠️ جمع المتطلبات والأموال' }, type: 1 }
        ];

        let failButtonMessage = {
            text: failMsg,
            footer: 'Sukuna Fusion System © 2026',
            buttons: failButtons,
            headerType: 1
        };

        try {
            await m.react('❌');
            return await conn.sendMessage(m.chat, failButtonMessage, { quoted: m });
        } catch (e) {
            try {
                return await conn.reply(m.chat, failMsg, m);
            } catch (err) {
                return m.reply(failMsg);
            }
        }
    }

    // 3. اكتمال المتطلبات: خصم المتطلبات وإتمام الدمج بنجاح
    user.money -= requiredMoney;
    const fusedName = `سكونة + ${targetCharacter} (النسخة الخارقة)`;
    
    if (!user.fusedCharacters.includes(fusedName)) {
        user.fusedCharacters.push(fusedName);
    }

    // حفظ التحديثات في ملف JSON محلياً كضمان لتزامن قاعدة البيانات
    try {
        const dbPath = path.join(process.cwd(), 'database.json');
        fs.writeFileSync(dbPath, JSON.stringify(global.db.data, null, 2));
    } catch (e) {}

    // رسالة النجاح
    let successMsg = `
╔════════⸙🔥 𝗦𝗨𝗞𝗨𝗡𝗔 𝗙𝗨𝗦𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 🔥⸙════════╗
║ ⚡ ╎ **تـم تـحـطـيـم حـدود الـقـوة وبـنـاء كـيـان اسـطـوري!**
╠═════════════════════════════╣
║ 👤 ╎ **الأسـم:** ${name}
║ 🩸 ╎ **الـمـدمـج:** \`سكونة + ${targetCharacter}\`
║ 🏆 ╎ **الـلـقـب الـجـديـد:** \`${fusedName}\` 👹
║ 🪙 ╎ **الـمـتـبـقـي بـالـرصـيـد:** \`${user.money}\`
╚═════════════════════════════╝
> 👑 **"الآن، لا يوجد من يقف في طريقك!"** ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

    let successButtons = [
        { buttonId: '.شخصياتي', buttonText: { displayText: '📂 عرض شخصياتي' }, type: 1 },
        { buttonId: '.الاوامر', buttonText: { displayText: '📜 الأوامر' }, type: 1 }
    ];

    let successButtonMessage = {
        text: successMsg,
        footer: 'Sukuna System © 2026',
        buttons: successButtons,
        headerType: 1
    };

    try {
        await m.react('⚡');
        return await conn.sendMessage(m.chat, successButtonMessage, { quoted: m });
    } catch (e) {
        try {
            return await conn.reply(m.chat, successMsg, m);
        } catch (err) {
            return m.reply(successMsg);
        }
    }
};

handler.handlerCommand = 'دمج';
handler.handlerTag = 'rpg';
handler.handlerDescription = 'دمج شخصية سكونة مع شخصية أخرى للحصول على قوة خارقة وحفظها في سجلك';

handler.help = ['دمج [اسم الشخصية]'];
handler.tags = ['rpg'];
handler.command = ['دمج', 'fusion'];

export default handler;