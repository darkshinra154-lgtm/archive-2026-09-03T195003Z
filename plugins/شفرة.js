import db from '../lib/database.js';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let symbols = ['★', '♦', '▲', '♠', '⚡', '✦'];

  // توليد الشفرة السرية الخاصة بالمستخدم للجولة الحالية
  let currentRound = user.cipherRound || 1;
  let secretHash = createHash('md5').update(m.sender + currentRound).digest('hex');
  let secretCode = [];
  for (let i = 0; i < 3; i++) {
    let index = parseInt(secretHash.substr(i * 2, 2), 16) % symbols.length;
    secretCode.push(symbols[index]);
  }

  // ميزة التلميح
  if (command === 'تلميح' || command === 'hint') {
    let hintIndex = Math.floor(Math.random() * secretCode.length);
    let hintMsg = `*╭─❀ 💡 ˚₊· ───❀╮*\n`;
    hintMsg += `*│  💡 تلميح الاختراق 💡*\n`;
    hintMsg += `*╰─❀ 💡 ˚₊· ───❀╯*\n\n`;
    hintMsg += `❀ الرمز رقم *${hintIndex + 1}* في الشفرة هو: *${secretCode[hintIndex]}*\n`;
    hintMsg += `*╰── 💡 ˚₊· ───╯*`;
    return m.reply(hintMsg);
  }

  // التحقق من الإدخال
  if (!text) {
    let helpMsg = `*╭─❀ ⛩️ ˚₊· ───❀╮*\n`;
    helpMsg += `*│ 🔱 سوكونا: اختراق الخزنة 🔱*\n`;
    helpMsg += `*╰─❀ ⛩️ ˚₊· ───❀╯*\n\n`;
    helpMsg += `📌 *طريقة اللعب:*\n`;
    helpMsg += `تخمين شفرة فتح الخزنة المكونة من 3 رموز من الأشكال التالية:\n`;
    helpMsg += `[ ${symbols.join(' ')} ]\n\n`;
    helpMsg += `➥ *مثال للإدخال:* ${usedPrefix + command} ★⚡▲`;
    return m.reply(helpMsg);
  }

  // تنظيف المدخلات
  let guess = Array.from(text.trim());
  if (guess.length !== 3) {
    return m.reply('*╔══ ∘◦ ❀ ◦∘ ══╗*\n⚠️ *يجب إدخال 3 رموز بالضبط!*\n*╚══ ∘◦ ❀ ◦∘ ══╝*');
  }

  // حساب التطابقات
  let exactMatches = 0;
  let partialMatches = 0;
  let tempSecret = [...secretCode];
  let tempGuess = [...guess];

  for (let i = 0; i < 3; i++) {
    if (tempGuess[i] === tempSecret[i]) {
      exactMatches++;
      tempSecret[i] = null;
      tempGuess[i] = null;
    }
  }

  for (let i = 0; i < 3; i++) {
    if (tempGuess[i] !== null) {
      let indexInSecret = tempSecret.indexOf(tempGuess[i]);
      if (indexInSecret !== -1) {
        partialMatches++;
        tempSecret[indexInSecret] = null;
      }
    }
  }

  // صورة سوكونا وهو بيفتح الخزنة (■ OPEN / FUGA)
  let imgUrl = `https://images.catbox.moe/67vv84.jpg`;
  let imgBuffer;
  try {
    imgBuffer = await (await fetch(imgUrl)).buffer();
  } catch (error) {
    return m.reply('*❀ حدث خطأ أثناء تحميل اللعبة، حاول لاحقًا ❀*');
  }

  // معالجة النتيجة
  let isWin = exactMatches === 3;
  if (isWin) {
    user.cipherRound = currentRound + 1;
    user.exp = (user.exp || 0) + 500;
  }

  let txt = `*╭─❀ 🔱 ˚₊· ───❀╮*\n`;
  txt += `*│  🔥 SUKUNA: OPEN (⬛) 🔥*\n`;
  txt += `*╰─❀ 🔱 ˚₊· ───❀╯*\n\n`;
  txt += `*╭── 🎯 النتائج ˚₊· ───╮*\n`;
  txt += `❀ *تخمينك:* ${guess.join('')}\n`;
  txt += `❀ *مطابقة دقيقة (🎯):* ${exactMatches}\n`;
  txt += `❀ *مكان خاطئ (🔄):* ${partialMatches}\n`;
  if (isWin) {
    txt += `\n🔥 *■ OPEN! تم فتح الخزنة بنجاح! (+500 EXP)*\n`;
    txt += `❀ *المستوى الحالي:* ${user.cipherRound}\n`;
  } else {
    txt += `\n❌ *فشل فتح الخزنة! حاول مرة أخرى.*\n`;
  }
  txt += `*╰── 🔱 ˚₊· ───╯*\n`;

  let dev = '*❀💖 تم بواسطة فريق التطوير 💖❀*';

  // بناء الأزرار تفاعلياً
  let buttons = [];
  if (!isWin) {
    buttons.push({
      buttonId: `${usedPrefix}تلميح`,
      buttonText: { displayText: '｢💡┊تـلـمـيـح┊💡｣' },
    });
  }
  buttons.push({
    buttonId: `.اوامر`,
    buttonText: { displayText: '｢🔱┊اوامـر-الـبـوت┊⚡️｣' },
  });

  await conn.sendMessage(
    m.chat,
    {
      image: imgBuffer,
      caption: txt,
      footer: dev,
      buttons: buttons,
      viewOnce: true,
      headerType: 4,
    },
    { quoted: m }
  );

  await m.react(isWin ? '🔥' : '❌');
};

handler.help = ['شفرة', 'تلميح'].map((v) => v + ' *<الرموز>*');
handler.tags = ['games'];
handler.command = ['شفرة', 'اختراق', 'cipher', 'تلميح', 'hint', 'خزنة'];

export default handler;