// أمر تشخيصي مؤقت: بيوري القيم الخام اللي البوت شايفها عن هوية أي حد بعت الأمر ده.
// مفتوح للكل عمدًا (من غير فحص مطور) عشان نقدر نشخص مشكلة إخفاء الرقم في وضع اليوزرنيم.
let handler = async (m, { conn }) => {
  let owners = globalThis.owner || [];
  let senderCheck = owners.map((o) => String(o).replace(/[^0-9]/g, "") + "@s.whatsapp.net");

  let info = `🔍 *تشخيص الهوية*

*sender:* ${m.sender || "(فاضي)"}
*participant:* ${m.participant || "(فاضي)"}
*key.participant:* ${m.key?.participant || "(فاضي)"}
*key.fromMe:* ${m.key?.fromMe}
*chat:* ${m.chat || "(فاضي)"}
*isGroup:* ${m.isGroup}

*قائمة المطورين الحالية (بعد التطبيع):*
${senderCheck.map((s, i) => `${i + 1}. ${s}`).join("\n") || "(فاضية)"}

*هل sender مطابق لأي مطور؟* ${senderCheck.includes(m.sender) ? "✅ نعم" : "❌ لا"}`;

  await m.reply(info);
};
handler.command = ["معرفي", "تشخيص_الهويه", "whoami"];
handler.tags = ["owner"];
handler.help = ["معرفي"];
export default handler;
