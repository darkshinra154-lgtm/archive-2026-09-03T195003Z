// ✦ SUKUNA SYSTEM — ADVANCED MULTI-FLOOR DUNGEON SYSTEM (BUTTONS) ✦

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }); } catch (e) {}
    };

    if (!global.db) global.db = { data: { users: {} } };
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};

    let user = global.db.data.users[m.sender];

    // تهيئة بيانات اللاعب
    user.jjKLevel = user.jjKLevel || 1;
    user.money = user.money || 25000;
    user.multiplier = user.multiplier || 1.0;
    user.activeDungeon = user.activeDungeon || null; // الزنزانة الحالية
    user.currentFloor = user.currentFloor || 1;     // الطابق الحالي

    // 🗺️ قاعدة بيانات الزنزانات المتعددة وطوابقها
    const DUNGEONS = {
        'goblin_cave': {
            name: '🕳️ كهف العفاريت المظلم',
            minLevel: 1,
            maxFloors: 5,
            desc: 'كهف ضيق مليء بالعفاريت البدائيين، مثالي للمبتدئين.',
            boss: 'زعيم العفاريت الأعرج'
        },
        'cursed_tomb': {
            name: '⚰️ مقبرة اللعنات الأبدية',
            minLevel: 10,
            maxFloors: 10,
            desc: 'مقبرة فرعونية مسحورة تحرسها هياكل عظمية ومومياوات شرسة.',
            boss: 'الملك الميت توت عنخ لعنة'
        },
        'sukuna_realm': {
            name: '🩸 بُعْد سوكونا الملعون',
            minLevel: 25,
            maxFloors: 15,
            desc: 'العالم الأعمق حيث تتواجد أرواح الشر المطلق واللعنات من الدرجة الخاصة.',
            boss: 'ملك اللعنات: ريومين سوكونا'
        }
    };

    let arg = text.trim().toLowerCase();

    // ----------------------------------------------------
    // ⚔️ 1. التعمق في الطابق الحالي (.دنجوان عمق / تعمق)
    // ----------------------------------------------------
    if (['عمق', 'تعمق', 'تقدم', 'next'].includes(arg)) {
        if (!user.activeDungeon || !DUNGEONS[user.activeDungeon]) {
            await react('❌');
            return conn.sendMessage(m.chat, { text: `⚠️ *أنت لست داخل أي زنزانة حالياً!\nاكتب \`${usedPrefix + command}\` لاختيار زنزانة والبدء فيها.*` }, { quoted: m });
        }

        let dungeon = DUNGEONS[user.activeDungeon];

        if (user.currentFloor > dungeon.maxFloors) {
            return conn.sendMessage(m.chat, { text: `🎉 *لقد أكملت جميع طوابق هذه الزنزانة بالفعل (${dungeon.maxFloors}/${dungeon.maxFloors})!\nاختر زنزانة أخرى أعمق وأصعب.*` }, { quoted: m });
        }

        await react('⚔️');

        // حساب نتيجة المعركة في هذا الطابق
        let isBossFloor = user.currentFloor === dungeon.maxFloors;
        let enemyName = isBossFloor ? `🔥 ${dungeon.boss} (الزعيم الأخير)` : `حارس الطابق ${user.currentFloor}`;
        let enemyPower = user.currentFloor * 15 + (isBossFloor ? 50 : 0);
        let playerPower = user.jjKLevel * 10 + Math.floor(Math.random() * 40);

        let isVictory = playerPower >= enemyPower;

        let txt = `𓆩🏰𓆪 ═══ ❬ *الطَّابِق (${user.currentFloor} / ${dungeon.maxFloors})* ❭ ═══ 𓆩🏰𓆪\n\n`;
        txt += `🗺️ ┊ *الزنزانة:* ${dungeon.name}\n`;
        txt += `👹 ┊ *الخصم:* ${enemyName}\n\n`;

        if (isVictory) {
            let wonMoney = Math.floor((user.currentFloor * 3000) * user.multiplier);
            let wonExp = Math.floor((user.currentFloor * 500) * user.multiplier);

            user.money += wonMoney;
            user.jjKExp += wonExp;

            txt += `🏆 ✦ *انتصار ساحق في هذا الطابق!* ✦ 🔥\n\n`;
            txt += `💰 ┊ *غنائم مالية:* \`+${wonMoney.toLocaleString()} $\`\n`;
            txt += `⭐ ┊ *خبرة الطابق:* \`+${wonExp.toLocaleString()} EXP\`\n\n`;

            if (isBossFloor) {
                txt += `👑 *تهانينا الكبرى! لقد هزمت زعيم الزنزانة وحصلت على مجد أسطوري!* 🏆\n`;
                user.activeDungeon = null; // إغلاق الزنزانة بعد هزيمة الزعيم
                user.currentFloor = 1;
            } else {
                user.currentFloor += 1;
                txt += `🚪 *أنت الآن جاهز للانتقال للطابق التالي! اكتب \`${usedPrefix + command} تعمق\` للمتابعة.*`;
            }
        } else {
            let penalty = Math.floor(user.money * 0.05);
            user.money = Math.max(0, user.money - penalty);

            txt += `💀 ✦ *هزيمة نكراء في الطابق (${user.currentFloor})!* ✦ ❌\n\n`;
            txt += `🛡️ وحش هذا الطابق كان أقوى من قدرتك الحالية وتم طردك للخارج!\n`;
            txt += `💸 *خسارة الغنيمة:* فقدت \`-${penalty.toLocaleString()} $\` أثناء الهرب.\n\n`;
            txt += `💡 *نصيحة:* طور لفل مستواك أو زد قوتك قبل محاولة التعمق مجدداً.`;

            user.activeDungeon = null; // طرد اللاعب من الزنزانة عند الهزيمة
            user.currentFloor = 1;
        }

        txt += `\n\n⚡ *Dev: Sukuna System AI* ⚡`;
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    // ----------------------------------------------------
    // 🚪 2. اختيار زنزانة معينة عبر الأزرار أو النصوص
    // ----------------------------------------------------
    if (DUNGEONS[arg]) {
        let chosenDungeon = DUNGEONS[arg];

        if (user.jjKLevel < chosenDungeon.minLevel) {
            await react('❌');
            return conn.sendMessage(m.chat, { text: `⚠️ *مستواك الحالي (${user.jjKLevel}) لا يكفي لدخول هذه الزنزانة!\nيتطلب الأمر مستوى (${chosenDungeon.minLevel}) على الأقل.*` }, { quoted: m });
        }

        user.activeDungeon = arg;
        user.currentFloor = 1;
        await react('🏰');

        let txt = `𓆩🏰𓆪 ═══ ❬ *دَخَلْتَ إلى: ${chosenDungeon.name}* ❭ ═══ 𓆩🏰𓆪\n\n`;
        txt += `📖 ┊ ${chosenDungeon.desc}\n`;
        txt += `📊 ┊ *عدد الطوابق:* ${chosenDungeon.maxFloors} طوابق\n`;
        txt += `👹 ┊ *الزعيم النهائي:* ${chosenDungeon.boss}\n\n`;
        txt += `🚪 *أنت الآن في الطابق الأول (1).* للبدء في القتال والتعمق للطابق التالي، اكتب:\n`;
        txt += `👉 \`${usedPrefix + command} تعمق\``;

        return conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    // ----------------------------------------------------
    // 🎮 3. القائمة الرئيسية للزنزانات والأزرار التفاعلية
    // ----------------------------------------------------
    await react('🗺️');

    let txt = `𓆩🏰𓆪 ═══ ❬ *نِـظَـامُ الزَّنَازِينِ المَلْعُونَة* ❭ ═══ 𓆩🏰𓆪\n\n`;
    txt += `👤 ┊ *المغامر:* @${m.sender.split('@')[0]}\n`;
    txt += `⭐ ┊ *المستوى الحالي:* \`${user.jjKLevel}\`\n\n`;
    
    if (user.activeDungeon && DUNGEONS[user.activeDungeon]) {
        let curDung = DUNGEONS[user.activeDungeon];
        txt += `🟢 *أنت مستكشف حالياً في:* ${curDung.name}\n`;
        txt += `📍 *الطابق الحالي:* ${user.currentFloor} / ${curDung.maxFloors}\n`;
        txt += `💡 *للتعمق للطابق التالي:* اكتب \`${usedPrefix + command} تعمق\`\n\n`;
        txt += `────────────────────────\n\n`;
    }

    txt += `📋 *اختر الزنزانة التي تريد غزوها بكتابة اسمها أو الأمر الخاص بها:*\n\n`;

    for (let key in DUNGEONS) {
        let d = DUNGEONS[key];
        let statusIcon = user.jjKLevel >= d.minLevel ? '🟢 متاح' : '🔒 مغلق (مستوى ' + d.minLevel + ')';
        txt += `🔹 *${d.name}*\n   └ *الحالة:* ${statusIcon} | *الطوابق:* ${d.maxFloors}\n   └ *للإرشاد اكتب:* \`${usedPrefix + command} ${key}\`\n\n`;
    }

    txt += `⚡ *Dev: Sukuna System AI* ⚡`;

    // إرسال الرسالة مع أزرار تفاعلية (Interactive Buttons)
    let buttons = [
        { buttonId: `${usedPrefix + command} goblin_cave`, buttonText: { displayText: '🕳️ كهف العفاريت' }, type: 1 },
        { buttonId: `${usedPrefix + command} cursed_tomb`, buttonText: { displayText: '⚰️ مقبرة اللعنات' }, type: 1 },
        { buttonId: `${usedPrefix + command} sukuna_realm`, buttonText: { displayText: '🩸 بُعْد سوكونا' }, type: 1 }
    ];

    let buttonMessage = {
        text: txt,
        footer: 'Sukuna System RPG',
        buttons: buttons,
        headerType: 1,
        mentions: [m.sender]
    };

    try {
        return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    } catch (e) {
        // في حال نسق النسخة لا يدعم الأزرار المباشرة يتم إرسالها كنص عادي منظم
        return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m });
    }
};

handler.help = ['دنجوان', 'زنزانة', 'dungeon'];
handler.tags = ['rpg', 'game'];
handler.command = ['دنجوان', 'زنزانة', 'dungeon'];
handler.group = true;

export default handler;