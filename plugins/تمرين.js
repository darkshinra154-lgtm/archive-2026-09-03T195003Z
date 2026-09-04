// ✦ SUKUNA SYSTEM — INDEPENDENT TRAINING & LEVEL SYSTEM ✦

let handler = async (m, { conn, command, text }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }); } catch (e) {}
    };

    if (!global.db) global.db = { data: { users: {} } };
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};

    let user = global.db.data.users[m.sender];

    // تهيئة بيانات اللفل والخبرة
    user.jjKLevel = user.jjKLevel || 1;
    user.jjKExp = user.jjKExp || 0;
    user.money = user.money || 25000;
    user.lastTraining = user.lastTraining || 0;

    // دالة حساب الخبرة المطلوبة للفل التالي
    const getNextLevelExp = (level) => level * 1000;

    // --------------------------------------
    // 🧘‍♂️ أمر التدريب (.تدريب / .train)
    // --------------------------------------
    let now = Date.now();
    let cooldown = 60 * 1000; // دقيقة واحدة بالميلي ثانية
    let timePassed = now - user.lastTraining;

    if (timePassed < cooldown) {
        let timeLeft = Math.ceil((cooldown - timePassed) / 1000);
        await react('⏳');
        return conn.sendMessage(m.chat, { text: `⏳ *أنت متعب قليلاً! يجب أن تستريح وتنتظر \`${timeLeft}\` ثانية قبل خوض جلسة تدريب جديدة.*` }, { quoted: m });
    }

    user.lastTraining = now;
    await react('🧘‍♂️');

    // حساب الخبرة المكتسبة بناءً على اللفل الحالي
    let gainedExp = user.jjKLevel * 250 + Math.floor(Math.random() * 100);
    let gainedMoney = user.jjKLevel * 100;

    user.jjKExp += gainedExp;
    user.money += gainedMoney;

    let nextExp = getNextLevelExp(user.jjKLevel);
    let leveledUp = false;

    // نظام الارتقاء التلقائي للفل
    while (user.jjKExp >= nextExp) {
        user.jjKExp -= nextExp;
        user.jjKLevel += 1;
        leveledUp = true;
        nextExp = getNextLevelExp(user.jjKLevel);
    }

    let progress = Math.min(Math.floor((user.jjKExp / nextExp) * 100), 100);

    let txt = `𓆩🧘‍♂️𓆪 ═══ ❬ *جَلْسَةُ التَّدْرِيبِ وَتَطْوِيرِ اللَّفْل* ❭ ═══ 𓆩🧘‍♂️𓆪\n\n`;
    txt += `👤 ┊ *المتدرب:* @${m.sender.split('@')[0]}\n`;
    txt += `⭐ ┊ *خبرة مكتسبة:* \`+${gainedExp.toLocaleString()} EXP\`\n`;
    txt += `💰 ┊ *مكافأة مالية:* \`+${gainedMoney.toLocaleString()} $\`\n\n`;

    if (leveledUp) {
        txt += `🎉 ✦ *تـهـانـيـنـا! لقد ارتقيت إلى المستوى (${user.jjKLevel})!* ✦ 🔥\n\n`;
    }

    txt += `📊 ┊ *المستوى الحالي:* ${user.jjKLevel}\n`;
    txt += `📈 ┊ *شريط الخبرة:* ${user.jjKExp.toLocaleString()} / ${nextExp.toLocaleString()} (${progress}%)\n\n`;
    txt += `⚡ *Dev: Sukuna System AI* ⚡`;

    return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['تدريب'];
handler.tags = ['rpg', 'game'];
handler.command = ['تمرين', 'train'];
handler.group = true;

export default handler;