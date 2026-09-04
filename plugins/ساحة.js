global.jujutsuDomains = global.jujutsuDomains || {};

let handler = async (m, { conn, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || { 
        exp: 0, 
        level: 1, 
        cursedEnergy: 0, 
        money: 0, 
        inventory: [] 
    };

    let userLevel = user.level || 1;

    let textPanel = `
╔═════════════════════════════════════╗
║   ❖ 𓆩 ⛩️ بَوَّابَةُ عَوَالِمِ جُوجُوتْسُو كَايْسُن ⛩️ 𓆩 ❖   ║
╠═════════════════════════════════════╣
║ 👤 ⇦ المُقَاتِل ⇦ @${m.sender.split('@')[0]}
║ 🎖️ ⇦ المَسْتَوَى ⇦ \`مستوى ${userLevel}\`
║ ⚡ ⇦ الطَّاقَة المَلْعُونَة ⇦ \`${user.cursedEnergy || 0}\`
║ 💵 ⇦ الرَّصيد ⇦ \`${user.money || 0} عملة\`
╚═════════════════════════════════════╝
> 🩸 *« اختر بوابة المعركة بحذر.. الوحوش هنا لا ترحم أحداً! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

    try {
        let buttons = [
            { buttonId: `${usedPrefix}enterdomain 1`, buttonText: { displayText: '⚔️ 𓆩 بوابة الأرواح الضائعة 𓆩 (لفل 1+)' }, type: 1 },
            { buttonId: `${usedPrefix}enterdomain 2`, buttonText: { displayText: '🌀 𓆩 بوابة سجن الملعونين 𓆩 (لفل 5+)' }, type: 1 },
            { buttonId: `${usedPrefix}enterdomain 3`, buttonText: { displayText: '🔥 𓆩 بوابة الجحيم المطلق 𓆩 (لفل 10+)' }, type: 1 }
        ];

        let buttonMessage = {
            text: textPanel,
            footer: 'Sukuna Supreme System 🩸',
            buttons: buttons,
            headerType: 1
        };

        return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    } catch (e) {
        let fallbackMsg = `${textPanel}\n\n*الرجاء كتابة الأمر باختيار البوابة هكذا:*:\n- \`${usedPrefix}enterdomain 1\` (بوابة الأرواح الضائعة)\n- \`${usedPrefix}enterdomain 2\` (بوابة سجن الملعونين)\n- \`${usedPrefix}enterdomain 3\` (بوابة الجحيم المطلق)`;
        return await conn.sendMessage(m.chat, { text: fallbackMsg, mentions: [m.sender] }, { quoted: m });
    }
};

handler.before = async function (m, { conn, usedPrefix }) {
    if (!m.isGroup || m.fromMe) return;

    let rawText = (m.text || m.body || '').trim();
    
    if (m.message && m.message.buttonsResponseMessage && m.message.buttonsResponseMessage.selectedButtonId) {
        rawText = m.message.buttonsResponseMessage.selectedButtonId;
    } else if (m.msg && m.msg.selectedButtonId) {
        rawText = m.msg.selectedButtonId;
    }

    let text = rawText.toLowerCase();
    let chatId = m.chat;

    if (text.startsWith(usedPrefix + 'enterdomain') || text.startsWith('enterdomain') || text.startsWith('.enterdomain')) {
        let cleanText = text.startsWith('.') ? text : (text.startsWith(usedPrefix) ? text : usedPrefix + text);
        let args = cleanText.split(' ');
        let tier = parseInt(args[1]) || 1;

        let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || { 
            exp: 0, level: 1, cursedEnergy: 0, money: 0, inventory: [] 
        };

        let requirements = { 1: 1, 2: 5, 3: 10 };
        if (user.level < (requirements[tier] || 1)) {
            return await conn.sendMessage(m.chat, { 
                text: `> ⛔ *« مستواك الحالي (${user.level}) ضعيف جداً لدخول هذه البوابة! أنت تحتاج على الأقل لـ مستوى ${requirements[tier]}. »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` 
            }, { quoted: m });
        }

        if (global.jujutsuDomains[chatId]) {
            return await conn.sendMessage(m.chat, { text: `> ⚠️ *« توجد معركة قائمة بالفعل في هذا المكان! انهوها أولاً. »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` }, { quoted: m });
        }

        let monstersList = {
            1: [
                { name: "لعنة الدرجة الرابعة (الضعيفة)", desc: "كائن غريب ذو عين واحدة يبحث عن ضحايا ضعفاء", rewardXp: 350, rewardMoney: 150 },
                { name: "روح مستذئبة مشوهة", desc: "مخلوق سريع يهاجم بمخلبه الحاد", rewardXp: 400, rewardMoney: 180 },
                { name: "هيكل عظمي ملعون", desc: "بقايا محارب قديم تحولت لعنته لشكل مرعب", rewardXp: 450, rewardMoney: 200 }
            ],
            2: [
                { name: "لعنة الدرجة الثانية (المتوحشة)", desc: "وحش ضخم ذو أربعة أذرع وأنياب قطرانية", rewardXp: 900, rewardMoney: 500 },
                { name: "عملاق المستنقعات المسمومة", desc: "مخلوق ضخم يقذف حمضاً حارقاً على خصومه", rewardXp: 1100, rewardMoney: 600 },
                { name: "طيف الظلام المتسول", desc: "روح شريرة تخترق الدروع وتستنزف الطاقة", rewardXp: 1200, rewardMoney: 650 }
            ],
            3: [
                { name: "ملك وحوش الجحيم الأسطوري", desc: "أعظم وحش شيطاني يمتلك قوة مدمرة ونيران لا تنطفئ", rewardXp: 4500, rewardMoney: 2500 }
            ]
        };

        let pool = monstersList[tier] || monstersList[1];
        let chosen = pool[Math.floor(Math.random() * pool.length)];

        let arenaStartMsg = `
╔═════════════════════════════════════╗
║ ❖ 𓆩 ⚡ ظُهُورُ الوَحْشِ دَاخِلَ البَوَّابَةِ ⚡ 𓆩 ❖ ║
╠═════════════════════════════════════╣
║ 👾 ⇦ الوَحْش المُهَاجِم ⇦ \`${chosen.name}\`
║ 📜 ⇦ الوَصْف ⇦ \`${chosen.desc}\`
║ ⚔️ ⇦ طريقة القتل ⇦ \`اكتب (هجوم) أو (اضرب) للقضاء عليه!\`
║ 💰 ⇦ الجائزة ⇦ \`${chosen.rewardXp} XP + ${chosen.rewardMoney} عملة\`
╚═════════════════════════════════════╝
> 🩸 *« الوحش أمامك الآن! دمره فوراً قبل أن يسحقك! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

        global.jujutsuDomains[chatId] = {
            rewardXp: chosen.rewardXp,
            rewardMoney: chosen.rewardMoney,
            bossName: chosen.name,
            tier: tier,
            timeout: setTimeout(async () => {
                let domainData = global.jujutsuDomains[chatId];
                if (domainData) {
                    let activeParticipants = domainData.participants || [];
                    for (let senderId of activeParticipants) {
                        let pUser = global.db.data.users[senderId];
                        if (pUser) {
                            let penaltyXp = Math.floor(domainData.rewardXp * 0.2);
                            let penaltyMoney = Math.floor(domainData.rewardMoney * 0.2);
                            pUser.exp = Math.max(0, (pUser.exp || 0) - penaltyXp);
                            pUser.cursedEnergy = Math.max(0, (pUser.cursedEnergy || 0) - penaltyXp);
                            pUser.money = Math.max(0, (pUser.money || 0) - penaltyMoney);
                        }
                    }
                    delete global.jujutsuDomains[chatId];
                    await conn.sendMessage(chatId, { text: `> ⌛ *.. لقد هرب الوحش بعد أن دمركم، وتم خصم جزء من طاقتكم وأموالكم! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` });
                }
            }, 45000)
        };

        global.jujutsuDomains[chatId].participants = [m.sender];
        return await conn.sendMessage(m.chat, { text: arenaStartMsg }, { quoted: m });
    }

    if (text === usedPrefix + 'ساحة' || text === 'ساحة' || text === '.ساحة') {
        return handler(m, { conn, usedPrefix, command: 'ساحة' });
    }

    if (global.jujutsuDomains && global.jujutsuDomains[chatId]) {
        let currentDomain = global.jujutsuDomains[chatId];
        
        if (!currentDomain.participants.includes(m.sender)) {
            currentDomain.participants.push(m.sender);
        }

        let userText = text;

        if (userText.includes('هجوم') || userText.includes('اضرب') || userText.includes('اقتل') || userText.includes('ضربة') || userText.includes('attack')) {
            clearTimeout(currentDomain.timeout);
            delete global.jujutsuDomains[chatId];

            let winner = m.sender;
            let user = global.db.data.users[winner] = global.db.data.users[winner] || { 
                exp: 0, level: 1, cursedEnergy: 0, money: 0, inventory: [] 
            };

            user.exp += currentDomain.rewardXp;
            user.cursedEnergy = (user.cursedEnergy || 0) + currentDomain.rewardXp;
            user.money = (user.money || 0) + currentDomain.rewardMoney;

            let nextLevelXp = user.level * 1000;
            let levelUpMsg = "";
            if (user.exp >= nextLevelXp) {
                user.level += 1;
                user.inventory.push(`وسام ترقية المستوى ${user.level}`);
                levelUpMsg = `\n🔥 🌟 *تنبيه: لقد ترقيت إلى المستوى (${user.level}) وحصلت على وسام شرف جديد في حقيبتك!*`;
            }

            let winnerName = await conn.getName(winner);

            let winResultMsg = `
╔═════════════════════════════════════╗
║ ❖ 𓆩 🏆 تَمَّ قَتْلُ الوَحْشِ بِنَجَاحٍ 🏆 𓆩 ❖ ║
╠═════════════════════════════════════╣
║ 👑 ⇦ البَطَل القَاتِل ⇦ @${winner.split('@')[0]} (${winnerName})
║ 👾 ⇦ الوحش المقتول ⇦ \`${currentDomain.bossName}\`
║ ⚡ ⇦ المكسب ⇦ \`+${currentDomain.rewardXp} XP\`
║ 💵 ⇦ الأموال ⇦ \`+${currentDomain.rewardMoney} عملة ملعونة\`
║ 🎖️ ⇦ المستوى ⇦ \`مستوى ${user.level}\`${levelUpMsg}
╚═════════════════════════════════════╝
> 🩸 *« ضربة قاضية رائعة! لقد أباد هذا الوحش تماماً وانتقلت للقمة! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();

            try {
                let progressButtons = [
                    { buttonId: `${usedPrefix}enterdomain ${currentDomain.tier}`, buttonText: { displayText: '🔄 𓆩 إِعَادَةُ الدُّخُول (نفس البوابة) 𓆩' }, type: 1 },
                    { buttonId: `${usedPrefix}ساحة`, buttonText: { displayText: '⛩️ 𓆩 العَوْدَةُ لِلبَوَّابَةِ الرَّئِيسِيَّة 𓆩' }, type: 1 }
                ];

                let buttonMessage = {
                    text: winResultMsg,
                    footer: 'Sukuna Supreme System 🩸',
                    buttons: progressButtons,
                    headerType: 1
                };

                return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
            } catch (err) {
                return await conn.sendMessage(m.chat, { 
                    text: `${winResultMsg}\n\n*لدخول بوابة أخرى اكتب:* \`${usedPrefix}ساحة\``, 
                    mentions: [winner] 
                }, { quoted: m });
            }
        } else {
            let pUser = global.db.data.users[m.sender] = global.db.data.users[m.sender] || { 
                exp: 0, level: 1, cursedEnergy: 0, money: 0, inventory: [] 
            };
            let damageXp = 50;
            let damageMoney = 25;
            pUser.exp = Math.max(0, (pUser.exp || 0) - damageXp);
            pUser.cursedEnergy = Math.max(0, (pUser.cursedEnergy || 0) - damageXp);
            pUser.money = Math.max(0, (pUser.money || 0) - damageMoney);

            return await conn.sendMessage(m.chat, { 
                text: `> ❌ *« رد فعل بطيء يا @${m.sender.split('@')[0]}! وجه إليك ${currentDomain.bossName} هجمة مرتدة قوية (-${damageXp} XP)! اكتب (هجوم) لقتله فوراً »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆`,
                mentions: [m.sender]
            }, { quoted: m });
        }
    }
};

handler.help = ['ساحة', 'arena', 'بوابة'];
handler.tags = ['ألعاب جوجوتسو'];
handler.command = ['ساحة', 'arena', 'بوابة'];
handler.group = true;

export default handler;