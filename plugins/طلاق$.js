const handler = async (m, { conn }) => {

  // تحديد الهدف: الشخص اللي تم منشنه أو اللي تم الرد عليه
  const target = m.quoted?.sender || m.mentionedJid?.[0];
  if (!target) return m.reply("🤏 لازم تمنشن شخص أو ترد عليه الأول.");

  // رسالة الطلاق
  const text = `
💔 مبروك الطلاق! 💔
👤 الشخص المفصول: @${target.split("@")[0]}
نتمنى له حياة أفضل بعد الانفصال.
  `.trim();

  await conn.sendMessage(
    m.chat,
    { text, mentions: [target] },
    { quoted: m }
  );
};

handler.command = /^طلاق$/i;
handler.group = true;

export default handler;