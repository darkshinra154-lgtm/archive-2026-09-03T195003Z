import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await conn.sendMessage(m.chat, {
        react: { text: '😈', key: m.key }
    }).catch(() => {});

    let who = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
            ? conn.user.jid
            : m.sender;

    let name = await conn.getName(who);
    let edtr = `@${m.sender.split`@`[0]}`;
    let username = conn.getName(m.sender);

    // إرسال الأغنية
    let audioUrl = 'https://files.catbox.moe/7qa6p3.jpg';

    await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mp4',
        ptt: false
    }, { quoted: m });

    // تأخير 3 ثوانٍ قبل إرسال جهة الاتصال
    setTimeout(async () => {

        // بيانات المطور
        const whatsapp = 'https://wa.me/w0jn';
        const telegram = 'https://t.me/PR_GM';
        const instagram = 'https://instagram.com/pr0.gm';

        // VCARD
        let list = [{
            displayName: "✨️🐉 𝐑𝐀𝐆𝐍𝐀 †✨️",

            vcard:
`BEGIN:VCARD
VERSION:3.0
FN:𝐑𝐀𝐆𝐍𝐀 - راغنا
N:راغنا;𝐑𝐀𝐆𝐍𝐀;;;

item1.URL:${whatsapp}
item1.X-ABLabel:واتساب

item2.URL:${telegram}
item2.X-ABLabel:تيليجرام

item3.URL:${instagram}
item3.X-ABLabel:إنستجرام

END:VCARD`
        }];

        await conn.sendMessage(m.chat, {
            contacts: {
                displayName: `${list.length} جهة اتصال`,
                contacts: list
            },

            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'مرحبا، هذا هو مطور البوت',
                    body: 'للتواصل مع المطور مباشرة',
                    thumbnailUrl: 'https://files.catbox.moe/7qa6p3.jpg',
                    sourceUrl: telegram,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        });

        let txt =
`👋 *مرحبًا \`${username}\` هذا هو*

*جهة اتصال مطور البوت* 👑

📱 واتساب: ${whatsapp}
✈️ تيليجرام: ${telegram}
📸 إنستجرام: ${instagram}`;

        await conn.sendMessage(m.chat, {
            text: txt,
            footer: '𝐏𝐡𝐲𝐬𝐢𝐜𝐬',
            buttons: [
                {
                    buttonId: ".اوامر",
                    buttonText: {
                        displayText: 'قائمة البوت'
                    },
                    type: 1
                }
            ],
            viewOnce: true,
            headerType: 1
        }, { quoted: m });

    }, 3000);
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|dueño)$/i;

export default handler;