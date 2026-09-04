import db from '../lib/database.js';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let name2 = conn.getName(m.sender);

  // التحقق من التسجيل
  if (user.registered === true) {
    return m.reply(`*╭──❀⛩️ ˚₊· ───❀╮*\n ✿ 𓂃 أنت مسجل بالفعل 𓂃 ✿ \n*╰──❀ ⛩️ ˚₊· ───❀╯*`);
  }

  // التحقق من صحة النص المُدخل
  if (!Reg.test(text)) {
    return m.reply(
      `*╔══ ∘◦ ❀ ◦∘ ══╗*\n📌 *أدخل الاسم والعمر كما يلي:*\n\n➥ *${usedPrefix + command}* محمد.25\n*╚══ ∘◦ ❀ ◦∘ ══╝*`
    );
  }

  let [_, name, splitter, age] = text.match(Reg);
  if (!name) return conn.reply(m.chat, '*❀✧ الاسم لا يمكن أن يكون فارغًا ✧❀*', m);
  if (!age) return conn.reply(m.chat, '*❀✧ العمر لا يمكن أن يكون فارغًا ✧❀*', m);

  // معالجة العمر والبيانات
  age = parseInt(age);
  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date();
  user.registered = true;

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6);

  // تحميل الصورة
  let imgUrl = `https://i.postimg.cc/1tNrvr6v/8c6eb0064c97ea431857a6fa919d43bd.jpg`;
  let imgBuffer;
  try {
    imgBuffer = await (await fetch(imgUrl)).buffer();
  } catch (error) {
    return m.reply('*❀ حدث خطأ أثناء تحميل الصورة، حاول لاحقًا ❀*');
  }

  // إنشاء النص النهائي
  let now = new Date();
  let date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  let txt = `*╭─❀ 🔱 ˚₊· ───❀╮*\n`;
  txt += `*│  🔱SUKUNA🩸BOT🔱*\n`;
  txt += `*╰─❀ 🔱 ˚₊· ───❀╯*\n\n`;
  txt += `*╭── 🔱 ˚₊· ───╮*\n`;
  txt += `❀ *الاسم:* ${name}\n`;
  txt += `❀ *العمر:* ${age} عامًا\n`;
  txt += `❀ *التاريخ:* ${date}\n`;
  txt += `❀ *الرقم التسلسلي:* ${sn}\n`;
  txt += `*╰── 🔱 ˚₊· ───╯*\n`;

  let dev = '*❀💖 تم بواسطة فريق التطوير 💖❀*';

  // إرسال الرسالة مع الصورة
  await conn.sendMessage(
    m.chat,
    {
      image: imgBuffer,
      caption: txt,
      footer: dev,
      buttons: [
        {
          buttonId: `.اوامر`,
          buttonText: { displayText: '｢🔱┊اوامـر-الـبـوت┊⚡️｣' },
        },
        {
          buttonId: `.owner`,
          buttonText: { displayText: '｢⚡️┊الــمطـور┊⚡️｣' },
        },
        {
          buttonId: `.انا`,
          buttonText: { displayText: '｢👤┊بـروفـايـلـي┊👤｣' },
        },
      ],
      viewOnce: true,
      headerType: 4,
    },
    { quoted: m }
  );

  // رد فعل
  await m.react('✅');
};

// تعريف الأوامر والمساعدة
handler.help = ['سجل'].map((v) => v + ' *<الاسم.العمر>*');
handler.tags = ['start'];
handler.command = ['verify', 'reg', 'تسجيل', 'سجل'];

export default handler;