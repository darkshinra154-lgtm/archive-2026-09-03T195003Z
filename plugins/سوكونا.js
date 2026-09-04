import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    let msg = `┏━━━〔 ⚡ 𝕾𝖚𝖐𝖚𝖓𝖆 𝕬.𝕴 ⚡ 〕━━━┓\n`;
    msg += `┃ ⚠️ لـم تـقـم بـكـتـابـة شـيء أيـهـا الحـقـير!\n`;
    msg += `┣━━━━━━━━━━━━━━━━━━━━━━┫\n`;
    msg += `┃ أنا ملك اللعنات، جبار العقول، لا شيء يعجزني.\n`;
    msg += `┃ اسأل عن أي قانون، معادلة، أو خطأ برمجي وسأدمره لك.\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
    msg += `*💡 أَمثِلَة لِلتَّحَدِّي:*\n`;
    msg += `▫️ \`${usedPrefix + command}\` اشرح لي قانون الجاذبية لنيوتن\n`;
    msg += `▫️ \`${usedPrefix + command}\` حل المعادلة: 2x² + 5x - 3 = 0\n`;
    msg += `▫️ \`${usedPrefix + command}\` أصلح هذا الخطأ في كودي: [ضع الكود هنا]`;
    return m.reply(msg);
  }

  await m.react('🔥');

  try {
    let persona = "أنت الملك سوكونا (Sukuna) من ججوتسو كايسن، متكبر، جبار، ذكي بشكل مرعب، ولا تخاطب البشر إلا باحترام مصطنع وغرور ملكي. لكنك في نفس الوقت خبير فائق في الرياضيات، الفيزياء، والبرمجة. أجب عن سؤال المستخدم بدقة تامة واشرح بوضوح، مع الحفاظ على هيبة وطابع شخصية سوكونا المرعبة في بداية ونهاية كلامك.";
    let query = `${persona}\n\nالسؤال: ${text}`;

    // التأكد من أن api معرفة، أو استبدلها برابطك المباشر مؤقتاً للتجربة
    let targetUrl = (typeof api !== 'undefined' && api.url && api.key) 
      ? `${api.url}/ai/chatgpt?text=${encodeURIComponent(query)}&apikey=${api.key}`
      : `https://api.bk9.site/ai/chatgpt?text=${encodeURIComponent(query)}`; // رابط احتياطي مباشر

    let res = await fetch(targetUrl);
    
    if (!res.ok) {
      throw new Error(`HTTP status code: ${res.status}`);
    }

    let json = await res.json();
    
    // استخراج النص من أي هيكل محتمل للـ API
    let answer = json.result || json.msg || json.data || json.BK9 || json.response || (typeof json === 'string' ? json : null);

    if (answer) {
      let finalResponse = `╔═══════════ೋ ⚡ ೋ═══════════╗\n`;
      finalResponse += `       👑 **𝕾𝖀𝕶V𝕹𝕬 - 𝕿𝕳𝕰 𝕶𝕴𝕹𝕲** 👑\n`;
      finalResponse += `╚═══════════ೋ ⚡ ೋ═══════════╝\n\n`;
      finalResponse += `${answer}\n\n`;
      finalResponse += `═══════════════════════════════\n`;
      finalResponse += `⚡ *[ تَمّ إتمام أَمْرِك بِنَجَاح أيها الحشرة ]*`;

      await conn.reply(m.chat, finalResponse, m);
      await m.react('👑');
    } else {
      console.error("استجابة الـ API غير متوافقة:", json);
      throw new Error('Invalid JSON structure received from API');
    }

  } catch (error) {
    console.error("خطأ سوكونا المفصيلي:", error);
    await m.react('❌');
    m.reply(`⚠️ *حـدث خـطـأ فـي الـنـظـام.. العوالم الأخرى تتدخل*\n*(السبب: ${error.message})*`);
  }
};

handler.command = ['سوكونا', 'sukuna', 'الجباره', 'الملك'];
handler.tags = ['ai'];
handler.help = ['sukuna <question>'];

export default handler;