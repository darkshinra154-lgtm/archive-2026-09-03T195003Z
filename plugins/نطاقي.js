// ✦ SUKUNA SYSTEM - CURSED DOMAIN RPG (DATABASE ONLY) ✦

let handler = async (m, { conn, command, text }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }); } catch {}
    };

    // --------------------------------------
    // 🗄️ تهيئة قاعدة البيانات مباشرة تلقائياً
    // --------------------------------------
    if (!global.db?.data?.users) global.db.data = { ...(global.db.data || {}), users: {} };
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};

    let user = global.db.data.users[m.sender];

    // عناصر اللعنات والأسلحة المتاحة في النظام
    const elements = ['دم', 'ظلال', 'برق', 'روح', 'فراغ', 'نار', 'صقيع', 'وقت', 'موت', 'وهم'];
    const weapons = ['رمح الإبادة', 'خنجر الأرواح', 'سيف التفكيك', 'منجل الموت', 'سلاسل الظلام'];

    // إذا كان مستخدم جديد في اللعبة، افتح له بروفايل في الداتابيز فوراً
    if (!user.cursedDna) {
        let shuffled = elements.sort(() => 0.5 - Math.random());
        user.cursedDna = shuffled.slice(0, 3);
        user.cursedPower = Math.floor(Math.random() * 500) + 200;
        user.domainRefinement = 1;
        user.cursedWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        user.domainVictories = 0;
    }

    let userMention = `@${m.sender.split('@')[0]}`;

    // --------------------------------------
    // 🔮 أمر: فحص نطاق اللعنة وتفاصيل الحساب
    // --------------------------------------
    if (command === 'نطاقي' || command === 'domain') {
        await react('🔮');

        let dnaText = user.cursedDna.join(' ✦ ');
        let isGodTier = user.cursedDna.includes('فراغ') && user.cursedDna.includes('وقت');

        let txt = `𓆩⚔️𓆪 ═══ ❬ *SUKUNA DOMAIN RPG* ❭ ═══ 𓆩⚔️𓆪\n\n`;
        txt += `👤 ┊ *الـمـسـتـخـدم:* ${userMention}\n`;
        txt += `🧬 ┊ *الـجـيـنـات:* [ ${dnaText} ]\n`;
        txt += `🗡️ ┊ *الـسـلاح:* ${user.cursedWeapon}\n`;
        txt += `⚡ ┊ *طـاقـة اللـعـنـة:* ${user.cursedPower} Cursed Energy\n`;
        txt += `🏯 ┊ *إتـقـان الـنـطـاق:* Level ${user.domainRefinement}\n`;
        txt += `🏆 ┊ *انـتـصـارات الـنـطـاق:* ${user.domainVictories}\n`;
        txt += `🔮 ┊ *الـرتـبـة:* ${isGodTier ? '👑 حَاكِمُ الفَرَاغِ والمُطْلَق' : '🗡️ مُسْتَحْوِذُ أَرْوَاح'}\n\n`;
        txt += `𓆩⚡𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩⚡𓆪\n`;
        txt += `⚡ *Dev: Sukuna System* ⚡`;

        await m.reply(txt, null, { mentions: [m.sender] });
    }

    // --------------------------------------
    // ⚔️ أمر: صراع وتوسع النطاق ضد خصم
    // --------------------------------------
    if (command === 'توسع_النطاق' || command === 'clash') {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
        if (!who) return m.reply('⚠️ *منشن الخصم الذي تريد ابتلاعه في نطاقك!*');
        if (who === m.sender) return m.reply('❌ *لا يمكنك مواجهة نفسك يا ملك الأرواح!*');

        // إنشاء وتأكيد حقول الخصم في الداتابيز مباشرة
        if (!global.db.data.users[who]) global.db.data.users[who] = {};
        let target = global.db.data.users[who];

        if (!target.cursedDna) {
            let shuffled = elements.sort(() => 0.5 - Math.random());
            target.cursedDna = shuffled.slice(0, 3);
            target.cursedPower = Math.floor(Math.random() * 500) + 200;
            target.domainRefinement = 1;
            target.cursedWeapon = weapons[Math.floor(Math.random() * weapons.length)];
            target.domainVictories = 0;
        }

        await react('💀');

        // معادلة حساب الفائز بحسب بيانات الداتابيز
        let myScore = user.cursedPower + (Math.floor(Math.random() * 250) * user.domainRefinement);
        let targetScore = target.cursedPower + (Math.floor(Math.random() * 250) * target.domainRefinement);

        let txt = `𓆩🩸𓆪 ═══ ❬ *صِـرَاعُ النِّـطَـاقَـاتِ* ❭ ═══ 𓆩🩸𓆪\n\n`;
        txt += `💥 *تَمَّ فَتْحُ النِّطَاقِ بَيْنَ:* ${userMention} 🆚 @${who.split('@')[0]}\n\n`;

        if (myScore > targetScore) {
            let stolenPower = Math.floor(target.cursedPower * 0.15);
            user.cursedPower += stolenPower;
            target.cursedPower -= stolenPower;
            user.domainRefinement += 1;
            user.domainVictories += 1;

            txt += `👑 *الـفَـائِـز:* ${userMention}\n`;
            txt += `🗡️ *الـسلاح المستخدم:* ${user.cursedWeapon}\n`;
            txt += `💥 *الـنَّـتِـيـجَـة:* تم سحق نطاق الخصم وامتصاص ${stolenPower} من طاقته!\n`;
            txt += `📈 *ارتقاء:* ارتفع إتقان نطاقك للمستوى ${user.domainRefinement}!\n`;
        } else {
            let lostPower = Math.floor(user.cursedPower * 0.15);
            user.cursedPower -= lostPower;
            target.cursedPower += lostPower;
            target.domainVictories += 1;

            txt += `👑 *الـفَـائِـز:* @${who.split('@')[0]}\n`;
            txt += `🗡️ *الـسلاح المستخدم:* ${target.cursedWeapon}\n`;
            txt += `💀 *الـنَّـتِـيـجَـة:* تم تفكيك نطاقك وامتصاص ${lostPower} من طاقتك!\n`;
        }

        txt += `\n𓆩⚡𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩⚡𓆪\n`;
        txt += `⚡ *Dev: Sukuna System* ⚡`;

        // حفظ الداتابيز فوراً
        if (typeof global.db?.save === 'function') {
            try { await global.db.save(); } catch (e) {}
        }

        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, who] }, { quoted: m });
    }
};

handler.help = ['نطاقي', 'توسع_النطاق'];
handler.tags = ['rpg'];
handler.command = ['نطاقي', 'domain', 'توسع_النطاق', 'clash'];
handler.group = true;
handler.description = 'نظام الـ RPG الخاص بصدام النطاقات واللعنات مربوط مباشرة بالداتابيز بحقوق سوكونا سيستم.';

export default handler;