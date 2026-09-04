import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`«⚠️» *يـرجـى إدخـال رابـط الـقـناة.*\n*مثال:* ${usedPrefix + command} https://whatsapp.com/channel/xxxx`);
  if (!text.includes('https://whatsapp.com/channel/')) return m.reply('«❌» *عـذراً، هـذا الرابـط غـير صـحيح.*');

  let result = text.split('https://whatsapp.com/channel/')[1];
  let channelId = result.split('/')[0];

  await m.react('🔍');

  let res;
  try {
    res = await conn.newsletterMetadata('invite', channelId); 
  } catch (error) {
    console.error("Error fetching channel metadata:", error); 
    return m.reply('«❌» *حـدث خـطأ أثـناء جـلب الـبيانات، تأكـد من أن الـرابط يـعمل.*');
  }

  let formattedTime = new Date().toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  let teks = `
«━━─⊱🌸⃟ٍُِ👑⊰─━━»
  *مـعـلـومـات الـقـنـاة*
«━━─⊱🌸⃟ٍُِ👑⊰─━━»

*⚡⃟̶̸࿆͞﹝ الـتـفـاصـيـل ﹞*
*• الاسـم:* ${res.name}
*• الأعـضاء:* ${res.subscribers.toLocaleString()} مـشترك
*• الـتحـقق:* ${res.verification === 'VERIFIED' ? '✅ مُـوثـقـة' : '❌ غـير مـوثـقة'}

*⚡⃟̶̸࿆͞﹝ مـعلومات الـتـقنيـة ﹞*
*• الـمـعرف:* ${res.id}
*• الـحـالـة:* ${res.state === 'ACTIVE' ? 'نـشـطـة' : res.state}
*• الـتـوقيـت:* ${formattedTime}

«━━─⊱🌸⃟ٍُِ👑⊰─━━»
      *${global.namebot}*`.trim();

  // إعداد الرسالة التفاعلية مع زر النسخ
  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: "اضـغط أدناه لـنسخ الـمعرف" }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "« مـعـلـومـات الـنـظام »",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 نـسخ ID الـقـناة",
                  copy_code: res.id
                })
              }
            ]
          })
        })
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, msg.message, {});
};

handler.help = ['قناه'];
handler.tags = ['tools'];
handler.command = /^(قناه|قناة|channel)$/i;

export default handler;