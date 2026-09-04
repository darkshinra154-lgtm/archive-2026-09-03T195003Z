import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn, isOwner }) => {
    // السماح للمطورين فقط
    if (!isOwner) {
        return conn.reply(m.chat, "🚫 هذا الأمر مخصص للمطور فقط.", m);
    }

    const imageUrl = "https://files.catbox.moe/0xnibq.jpg"; // رابط الصورة

    // تجهيز الصورة
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: conn.waUploadToServer }
    );

    // إنشاء الرسالة التفاعلية
    const interactiveMessage = {
        body: { text: "مـرحـبـا فـي قـسـم الـتـدمـيـر" },
        footer: { text: "𝑷𝑯𝒀𝑺𝑰𝑪𝑺 𝑩𝑶𝑻" },
        header: { 
            title: "𝐑𝐀𝐆𝐍𝐀", 
            hasMediaAttachment: true, 
            imageMessage: media.imageMessage 
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "تـفـنـيـش الـجـروب",
                        id: ".فنش"
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "زرف الـجـروب",
                        id: ".زرف"
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "سـحـب اشـرافـات",
                        id: ".سحب"
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "تـصـفـيـة الـجـروب",
                        id: ".صفي"
                    })
                }
            ]
        }
    };

    // إرسال الرسالة
    const msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
    );

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

// تشغيل الأمر عند كتابة "روك"
handler.command = /^روك$/i;

export default handler;