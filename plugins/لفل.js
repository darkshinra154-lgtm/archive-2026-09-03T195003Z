import { canLevelUp, xpRange } from '../lib/levelling.js';

let handler = async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    
    // التحقق من إنشاء بيانات المستخدم وتفعيل الترقية التلقائية فوراً بدون أمر مسبق
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = {
            exp: 0,
            level: 1,
            role: 'مبتدئ 🥉',
            autolevelup: true,
            bank: 0
        };
    } else {
        // تفعيل الترقية التلقائية إجبارياً لكل المستخدمين
        global.db.data.users[who].autolevelup = true;
    }

    let user = global.db.data.users[who];
    let name = await conn.getName(who);
    m.react('👹');

    // ترقية تلقائية لأكثر من مستوى دفعة واحدة إذا جمع نقاط خبرة ضخمة
    let beforeLevel = user.level;
    let leveledUp = false;

    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++;
        leveledUp = true;
    }

    // إذا ارتفع مستواه، جهز رسالة الترقية الجبارة بنمط ملك اللعنات
    if (leveledUp) {
        let upgradeMsg = `
╔════════⸙🔥 𝗦𝗨𝗞𝗨𝗡𝗔 𝖴𝖯𝖦𝖱𝖠𝖣𝖤 🔥⸙════════╗
║ ⚡ ╎ **تـم تـحـطـيـم حـدود الـطـاقـة بـنـجـاح!**
╠═════════════════════════════╣
║ 👤 ╎ **الأسـم:** ${name}
║ 📉 ╎ **الـمـسـتـوى الـسـابـق:** \`${beforeLevel}\`
║ 📈 ╎ **الـمـسـتـوى الـجـديـد:** \`${user.level}\` 👹
║ 🎖️ ╎ **الـتـصـنـيـف:** \`${user.role}\`
║ 🧬 ╎ **إجـمـالـي الـخـبـرة:** \`${user.exp}\`
╚═════════════════════════════╝
> 🩸 **"العالم ليس سوى القوي.. وقد أثبت قوتك اليوم!"** ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

        try {
            return await conn.sendMessage(m.chat, { text: upgradeMsg }, { quoted: m });
        } catch {
            return m.reply(upgradeMsg);
        }
    } 
    
    // حساب شريط التقدم للفل الحالي
    let { min, xp, max } = xpRange(user.level, global.multiplier);
    let currentXp = user.exp - min;
    let neededXp = max - user.exp;
    let percentage = Math.min(Math.max((currentXp / xp) * 100, 0), 100).toFixed(1);
    let bar = createProgressBar(percentage);

    let txt = `
╔════════⸙👹 𝖲𝖴𝖪𝖴𝖭𝖠 𝖫𝖤𝖵𝖤𝖫 𝖲𝖳𝖠𝖳𝖲 👹⸙════════╗
║ 👤 ╎ **الأسـم:** ${name}
║ 🎖️ ╎ **الـتـصـنـيـف:** \`${user.role}\`
║ 🎮 ╎ **الـمـسـتـوى:** \`${user.level}\`
║ 🧬 ╎ **الـخـبـرة الـحـالـيـة:** \`${user.exp}\`
╠═════════════════════════════╣
║ 📊 ╎ ${bar} \`${percentage}%\`
║ ⚡ ╎ **مـتـبـقـي لـلـتـرقـيـة:** \`${neededXp}\` **نـقـطـة**
╚═════════════════════════════╝
> 👑 **الـنـظـام يـعـمـل بـالـتـلـقـائيـة الـمـطـلـقـة بـواسـطـة سـوكـونـا!**
`.trim();

    // أزرار تفاعلية تنقلك للبنك، الأوامر، والبروفايل
    let buttons = [
        { buttonId: '.بنك', buttonText: { displayText: '🏦 البنك' }, type: 1 },
        { buttonId: '.الاوامر', buttonText: { displayText: '📜 الأوامر' }, type: 1 },
        { buttonId: '.بروفايلي', buttonText: { displayText: '👤 بروفايلي' }, type: 1 }
    ];

    let buttonMessage = {
        text: txt,
        footer: 'Sukuna System © 2026',
        buttons: buttons,
        headerType: 1
    };

    try {
        await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    } catch (e) {
        try {
            // بديلة في حال عدم دعم الأزرار في نسختك
            await conn.reply(m.chat, txt, m);
        } catch (err) {
            m.reply(txt);
        }
    }
}

// دالة لصنع شريط التقدم الفخم
function createProgressBar(percentage) {
    let totalBlocks = 10;
    let filledBlocks = Math.round((percentage / 100) * totalBlocks);
    let emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}

handler.help = ['lvl', 'لفل'];
handler.tags = ['عملات'];
handler.command = ['لفل', 'lvl', 'level'];

export default handler;