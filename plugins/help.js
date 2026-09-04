import { prepareWAMessageMedia } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, command }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    
    m.react('🔥');

    // جلب الأوامر المسجلة في السورس تلقائياً
    let tags = {
        'main': 'الـرئـيـسـيـة',
        'game': 'الألـعـاب والتسلية',
        'xp': 'الـمـسـتـويـات والثروة',
        'group': 'إدارة المجموعات',
        'anime': 'عـالـم الـأنـيـمـي',
        'sticker': 'صانع الملصقات',
        'tools': 'الأدوات والخدمات',
        'downloader': 'الـتـحـمـيـلات',
        'internet': 'البحث والإنترنت',
        'owner': 'أوامـر المطور'
    };

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
        return {
            help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
            tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
            prefix: 'customPrefix' in plugin ? plugin.customPrefix : false,
            enabled: !plugin.disabled,
        };
    });

    for (let plugin of help) {
        if (plugin && 'tags' in plugin) {
            for (let tag of plugin.tags) {
                if (!(tag in tags) && tag) tags[tag] = tag;
            }
        }
    }

    // تصميم الهيدر والبروفايل بنفس فكرة كود الـ لفل الشغال تماماً عندك
    let txt = `
╔════════⸙🔥 𝗦𝗨𝗞𝗨𝗡𝗔 𝖬𝖤𝖭𝖴 🔥⸙════════╗
║ 👤 ╎ **الأسـم:** ${name}
║ ⚡ ╎ **الـبـادئـة:** \`${usedPrefix}\`
║ 🩸 ╎ **الـحـالـة:** \`مـلـك الـلـعـنـات يُسيطر\`
╠═════════════════════════════╣
║ 📂 \`اضغط على زر (📜 عرض كل الأوامر) بالأسفل ليتم إرسال قائمة الأوامر الكاملة المفصلة بشكل مرتب في رسالة منفصلة.\`
╚═════════════════════════════╝
> 👑 **"السلطة المطلقة بين يديك.. اختر ما يناسبك!"** ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

    // الأزرار نفس بنية كود الـ لفل تماماً (Type 1) لضمان اشتغالها 100% في بوتك
    let buttons = [
        { buttonId: `${usedPrefix}اوامر`, buttonText: { displayText: '📜 عرض كل الأوامر' }, type: 1 },
        { buttonId: `${usedPrefix}لفل`, buttonText: { displayText: '🧬 لفلـي' }, type: 1 },
        { buttonId: `${usedPrefix}بنك`, buttonText: { displayText: '🏦 البنك' }, type: 1 }
    ];

    let buttonMessage = {
        text: txt,
        footer: 'Sukuna System © 2026',
        buttons: buttons,
        headerType: 1
    };

    let sukunaImageUrl = 'https://i.imgur.com/83Z93Xn.jpg';

    try {
        // إرسال رسالة بأزرار مع صورة (نفس هيكل كود لفل بس مطبق بأزرار نصية مضمونة)
        let mediaMessage = await prepareWAMessageMedia({ image: { url: sukunaImageUrl } }, { upload: conn.waUploadToServer });
        
        await conn.sendMessage(m.chat, {
            image: mediaMessage.imageMessage,
            caption: txt,
            footer: 'Sukuna System © 2026',
            buttons: buttons,
            headerType: 4
        }, { quoted: m });

    } catch (e) {
        try {
            // كود بديل تماماً مثل كود الـ لفل في حال حدث أي خطأ بالصورة
            await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
        } catch (err) {
            try {
                await conn.reply(m.chat, txt, m);
            } catch (error) {
                m.reply(txt);
            }
        }
    }
}

handler.help = ['help', 'الاوامر', 'اوامر'];
handler.tags = ['main'];
handler.command = ['help','مساعدة'];

export default handler;