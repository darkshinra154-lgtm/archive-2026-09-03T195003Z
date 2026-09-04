import fs from 'fs';

let handler = async (m, { conn, isOwner, participants }) => {
  if (!isOwner) return m.reply('❌ هذا الأمر للمطور فقط.');

  // قراءة بيانات zarf.json
  let zarfData = JSON.parse(fs.readFileSync('./zarf.json'));

  try {
    // قفل الجروب
    await conn.groupSettingUpdate(m.chat, 'announcement');

    // إزالة الأدمنز (مع استثناء المطورين + البوت)
    const normalizeNumber = (jid) => {
  if (!jid) return '';

  return String(jid)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '');
};

const ownerNumbers = (global.owner || []).map(owner => {
  const num = Array.isArray(owner) ? owner[0] : owner;
  return normalizeNumber(num);
});

const botNumber = normalizeNumber(conn.user?.id);

// ترقية المطورين إلى أدمن
for (const ownerNumber of ownerNumbers) {
  const ownerParticipant = participants.find(
    p => normalizeNumber(p.id) === ownerNumber
  );

  if (
    ownerParticipant &&
    ownerParticipant.admin !== 'admin' &&
    ownerParticipant.admin !== 'superadmin'
  ) {
    try {
      await conn.groupParticipantsUpdate(
        m.chat,
        [ownerParticipant.id],
        'promote'
      );
    } catch (e) {
      console.error(`فشل ترقية المطور ${ownerParticipant.id}:`, e);
    }
  }
}

// خفض أي أدمن ليس مطورًا وليس البوت
const admins = participants.filter(
  p => p.admin === 'admin' || p.admin === 'superadmin'
);

for (const adm of admins) {
  const adminNumber = normalizeNumber(adm.id);

  const isOwner = ownerNumbers.includes(adminNumber);
  const isBot = adminNumber === botNumber;

  if (!isOwner && !isBot) {
    try {
      await conn.groupParticipantsUpdate(
        m.chat,
        [adm.id],
        'demote'
      );
    } catch (e) {
      console.error(`فشل خفض ${adm.id}:`, e);
    }
  }
}

    // تغيير اسم الجروب
    await conn.groupUpdateSubject(m.chat, zarfData.groupName);

    // تغيير وصف الجروب
    await conn.groupUpdateDescription(m.chat, zarfData.groupDescription);

    // تغيير صورة الجروب
    let pp = fs.readFileSync(zarfData.groupProfile);
    await conn.updateProfilePicture(m.chat, pp);

    // إرسال منشن خفي
    await conn.sendMessage(m.chat, { 
      text: zarfData.hiddenMention,
      mentions: [m.sender]
    });

    // إرسال الرسالة العادية
    await conn.sendMessage(m.chat, { text: zarfData.normalMessage });

    // إرسال الصوت
    if (zarfData.sound && fs.existsSync(zarfData.sound)) {
      await conn.sendMessage(m.chat, {
        audio: { url: zarfData.sound },
        mimetype: 'audio/mpeg'
      });
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️ حصل خطأ أثناء تنفيذ عملية الزرف.');
  }
};

handler.command = ['زرف'];
handler.tags = ['grupo'];
handler.help = ['زرف'];

export default handler;