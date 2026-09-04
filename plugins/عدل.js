import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args }) => {
  const filePath = './zarf.json';
  const mediaPath = './media';
  if (!fs.existsSync(filePath)) return m.reply('⚠️ ملف zarf.json غير موجود.');
  if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath);

  let zarfData = JSON.parse(fs.readFileSync(filePath));

  if (!args[0] && !m.quoted) {
    return m.reply(
      `🛠️ الاستخدام: تعديل <خاصية> <القيمة الجديدة أو إرسال ملف>\n\n` +
      `📌 الخصائص: اسم، وصف، صوره، منشن، رساله، صوت`
    );
  }

  const property = (args[0] || '').replace(/ة/g, 'ه').toLowerCase();

  switch (property) {
    case 'صوره': {
      const mediaFile = path.join(mediaPath, 'zarf.jpg');
      const source = m.quoted && /image/i.test(m.quoted.mtype || '') ? m.quoted
        : /image/i.test(m.mtype || '') ? m
        : null;

      if (source) {
        try {
          const media = await source.download();
          fs.writeFileSync(mediaFile, media);
          zarfData.groupProfile = mediaFile;
          m.reply(`✅ تم تحديث صورة الجروب.`);
        } catch (e) {
          console.error('edit.js صوره:', e);
          return m.reply('❌ حصل خطأ أثناء تحميل الصورة.');
        }
      } else if (m.quoted) {
        m.reply('⚠️ الرسالة اللي رديت عليها مش صورة.');
      } else {
        if (fs.existsSync(mediaFile)) {
          await conn.sendFile(m.chat, mediaFile, 'zarf.jpg', '✅ هذه هي الصورة الحالية.', m);
        } else {
          m.reply('❌ لا توجد صورة حالية. أرسل صورة مع الأمر أو رد على صورة لتحديثها.');
        }
      }
      break;
    }

    case 'صوت': {
      const mediaFile = path.join(mediaPath, 'zarf.mp3');
      const source = m.quoted && /audio/i.test(m.quoted.mtype || '') ? m.quoted
        : /audio/i.test(m.mtype || '') ? m
        : null;

      if (source) {
        try {
          const media = await source.download();
          fs.writeFileSync(mediaFile, media);
          zarfData.sound = mediaFile;
          m.reply(`✅ تم تحديث الصوت.`);
        } catch (e) {
          console.error('edit.js صوت:', e);
          return m.reply('❌ حصل خطأ أثناء تحميل الصوت.');
        }
      } else if (m.quoted) {
        m.reply('⚠️ الرسالة اللي رديت عليها مش صوت.');
      } else {
        if (fs.existsSync(mediaFile)) {
          await conn.sendFile(m.chat, mediaFile, 'zarf.mp3', '✅ هذا هو الصوت الحالي.', m, true);
        } else {
          m.reply('❌ لا يوجد صوت حالي. أرسل صوت مع الأمر أو رد على صوت لتحديثه.');
        }
      }
      break;
    }

    case 'اسم': {
      const value = args.slice(1).join(' ').trim();
      if (!value) return m.reply('⚠️ اكتب الاسم الجديد بعد الأمر. مثال: عدل اسم القيمة الجديدة');
      zarfData.groupName = value;
      m.reply(`✅ تم تحديث الاسم إلى: ${value}`);
      break;
    }

    case 'وصف': {
      const value = m.quoted?.text || args.slice(1).join(' ').trim();
      if (!value) return m.reply('⚠️ اكتب الوصف الجديد بعد الأمر أو رد على رسالة نصية.');
      zarfData.groupDescription = value;
      m.reply('✅ تم تحديث الوصف.');
      break;
    }

    case 'منشن': {
      const value = m.quoted?.text || args.slice(1).join(' ').trim();
      if (!value) return m.reply('⚠️ اكتب نص المنشن الجديد بعد الأمر أو رد على رسالة نصية.');
      zarfData.hiddenMention = value;
      m.reply('✅ تم تحديث نص المنشن.');
      break;
    }

    case 'رساله': {
      const value = m.quoted?.text || args.slice(1).join(' ').trim();
      if (!value) return m.reply('⚠️ اكتب الرسالة الجديدة بعد الأمر أو رد على رسالة نصية.');
      zarfData.normalMessage = value;
      m.reply('✅ تم تحديث الرسالة.');
      break;
    }

    default:
      return m.reply('❌ الخاصية غير معروفة. الخصائص: اسم، وصف، صوره، منشن، رساله، صوت');
  }

  fs.writeFileSync(filePath, JSON.stringify(zarfData, null, 2), 'utf-8');
};

handler.command = ['عدل'];
handler.tags = ['grupo'];
handler.help = ['عدل'];

export default handler;