import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    const imageUrl = "https://i.postimg.cc/8jVG5R82/upload_1788337893209.jpg"; // رابط الصورة المصغرة
    const link1 = "https://wa.me/201028316330"; // الرابط الأول (اتصال مع المطور)
    const link2 = "https://whatsapp.com/channel/0029VbDJw9q96H4bVpXInK1K"; // الرابط الثاني (القناة)

    // تجهيز الصورة المصغرة
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: conn.waUploadToServer }
    );

    // إنشاء الرسالة التفاعلية
    const interactiveMessage = {
        body: { text: "مـرحـبـا اسـمـي سوكونا مـطـوري تيم سوكونا اسـتـخـدم امـر (.اوامـر) لطلب القائمة" },
        footer: { text: "｢🩸┆sukuna bot|🩸｣" },
        header: { 
            title: "❪🩸┇sukuna bot┇🩸❫", 
            hasMediaAttachment: true, 
            imageMessage: media.imageMessage 
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🍷┊لـلـمـطـور┊🍷｣",
                        url: link1
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🍷┊القناة┊🍷｣",
                        url: link2
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "⌈🚀╎اوامر╎🚀⌋",
                        id: ".اوامر"
                    })
                }
            ]
        }
    };

    // إرسال الرسالة
    let msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
    );

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = ['بوت']

export default handler;