// ✦ ADAM & SUKUNA SYSTEM - ULTIMATE WAR & DOMINATION 💀🩸 ✦
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const LIB_DIR = path.join(process.cwd(), 'lib');
const COUNTRIES_PATH = path.join(LIB_DIR, 'countries.json');
const USERS_PATH = path.join(LIB_DIR, 'users.json');
const WAR_COOLDOWN = 60 * 1000;
const DAILY_REWARD_HOUR = 24 * 60 * 60 * 1000;

function ensureLibDir() {
    if (!fs.existsSync(LIB_DIR)) fs.mkdirSync(LIB_DIR, { recursive: true });
}

function getDefaultCountries() {
    return [
        // بلاد معروفة
        { id: '1', name: 'مصر', defense: 2500, reward: 600, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '2', name: 'السعودية', defense: 4000, reward: 1000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '3', name: 'فلسطين', defense: 6000, reward: 1500, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '4', name: 'اليابان', defense: 5000, reward: 1200, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '5', name: 'ألمانيا', defense: 4500, reward: 1100, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '6', name: 'روسيا', defense: 7500, reward: 1800, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '7', name: 'أمريكا', defense: 9000, reward: 2200, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '8', name: 'الصين', defense: 8500, reward: 2000, owner: 'الجمهورية (خالية)', occupiedAt: null },

        // بلاد مخفية وغير معروفة (قوية جداً بررتب وجوائز أسطورية)
        { id: '9', name: 'أتلانتس المفقودة', defense: 15000, reward: 4500, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '10', name: 'مملكة شامبالا', defense: 22000, reward: 6500, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '11', name: 'أرض هايبربوريا', defense: 30000, reward: 9000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '12', name: 'قلعة آرخام الشيطانية', defense: 42000, reward: 13000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '13', name: 'عرش الفالاهالا', defense: 55000, reward: 18000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '14', name: 'مدينة إليزيوم', defense: 70000, reward: 25000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '15', name: 'معبد سوكونا المنكوب', defense: 90000, reward: 35000, owner: 'الجمهورية (خالية)', occupiedAt: null },
        { id: '16', name: 'إمبراطورية الظلال', defense: 120000, reward: 50000, owner: 'الجمهورية (خالية)', occupiedAt: null }
    ];
}

function loadCountries() {
    ensureLibDir();
    if (!fs.existsSync(COUNTRIES_PATH)) {
        const defaults = getDefaultCountries();
        fs.writeFileSync(COUNTRIES_PATH, JSON.stringify(defaults, null, 2));
        return defaults;
    }
    try {
        const data = JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf8'));
        // دمج أي بلاد جديدة في حال تم تحديث القائمة
        if (data.length < 16) {
            const defaults = getDefaultCountries();
            fs.writeFileSync(COUNTRIES_PATH, JSON.stringify(defaults, null, 2));
            return defaults;
        }
        return data;
    } catch {
        const defaults = getDefaultCountries();
        fs.writeFileSync(COUNTRIES_PATH, JSON.stringify(defaults, null, 2));
        return defaults;
    }
}

function saveCountries(data) {
    ensureLibDir();
    fs.writeFileSync(COUNTRIES_PATH, JSON.stringify(data, null, 2));
}

function loadUsers() {
    ensureLibDir();
    if (!fs.existsSync(USERS_PATH)) {
        fs.writeFileSync(USERS_PATH, JSON.stringify({}));
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function saveUsers(data) {
    ensureLibDir();
    fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));
}

function ensureUser(users, sender, pushName) {
    if (!users[sender]) {
        users[sender] = {
            army: 1000,
            tanks: 0,
            name: pushName || 'مُحارب مجهول',
            lastWar: 0,
            lastDailyReward: 0,
            wins: 0,
            losses: 0,
            totalRewards: 0
        };
    }
    if (typeof users[sender].army !== 'number') users[sender].army = 1000;
    if (typeof users[sender].tanks !== 'number') users[sender].tanks = 0;
    if (typeof users[sender].lastWar !== 'number') users[sender].lastWar = 0;
    if (typeof users[sender].lastDailyReward !== 'number') users[sender].lastDailyReward = 0;
    if (typeof users[sender].wins !== 'number') users[sender].wins = 0;
    if (typeof users[sender].losses !== 'number') users[sender].losses = 0;
    if (typeof users[sender].totalRewards !== 'number') users[sender].totalRewards = 0;
    return users[sender];
}

async function drawWorldMap(countries, user, globalStats) {
    let canvas, createCanvas;
    try {
        const canvasModule = await import('canvas');
        createCanvas = canvasModule.createCanvas;
    } catch {
        return null;
    }

    // زيادة الأبعاد لتستوعب الـ 16 دولة بشكل أنيق ومريح
    const width = 1300;
    const height = 1450;
    canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // الخلفية الشبكية السريّة
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // هيدر الخريطة
    ctx.fillStyle = '#111827';
    ctx.fillRect(20, 20, width - 40, 130);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, 130);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️ ULTIMATE DOMINATION GLOBAL MAP ⚔️', width / 2, 65);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`🛡️ Army: ${user.army.toLocaleString()}  |  🚜 Tanks: ${user.tanks}  |  🏆 Wins: ${user.wins}  |  💀 Losses: ${user.losses}`, width / 2, 102);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`🌍 Occupied: ${globalStats.occupied} / ${countries.length}  |  👑 Supreme General: ${globalStats.topPlayer}`, width / 2, 132);

    // بطاقات الدول (شبكة من عمودين)
    const cols = 2;
    const cardWidth = 590;
    const cardHeight = 120;
    const startX = 35;
    const startY = 175;
    const gapX = 40;
    const gapY = 18;

    countries.forEach((country, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardWidth + gapX);
        const y = startY + row * (cardHeight + gapY);

        const isOccupied = country.owner !== 'الجمهورية (خالية)';
        const isMythic = parseInt(country.id) >= 9;

        // خافية البطاقة وتنسيقها حسب النوع
        if (isMythic) {
            ctx.fillStyle = isOccupied ? '#31103F' : '#1A0B2E';
        } else {
            ctx.fillStyle = isOccupied ? '#1E1B4B' : '#0F172A';
        }

        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, 10);
            ctx.fill();
            ctx.strokeStyle = isMythic ? '#C084FC' : (isOccupied ? '#8B5CF6' : '#374151');
            ctx.lineWidth = isMythic ? 3 : 2;
            ctx.stroke();
        } else {
            ctx.fillRect(x, y, cardWidth, cardHeight);
            ctx.strokeStyle = isMythic ? '#C084FC' : (isOccupied ? '#8B5CF6' : '#374151');
            ctx.lineWidth = isMythic ? 3 : 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = isMythic ? '#F472B6' : '#F9FAFB';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`[ ${country.id} ] ${country.name} ${isMythic ? '🔮' : ''}`, x + 20, y + 32);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '16px sans-serif';
        ctx.fillText(`🛡️ Defense: ${country.defense.toLocaleString()}`, x + 20, y + 65);
        ctx.fillText(`💰 Daily: +${country.reward.toLocaleString()} $`, x + 20, y + 92);

        ctx.fillStyle = isOccupied ? '#A7F3D0' : '#F59E0B';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'right';
        const ownerText = country.owner.length > 18 ? country.owner.slice(0, 18) + '...' : country.owner;
        ctx.fillText(`👑 ${ownerText}`, x + cardWidth - 20, y + 32);
    });

    // الفوتر
    ctx.fillStyle = '#111827';
    ctx.fillRect(20, height - 50, width - 40, 35);
    ctx.fillStyle = '#64748B';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✦ SUKUNA SYSTEM - Developed by Adam ✦`, width / 2, height - 27);

    return canvas.toBuffer('image/png');
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }); } catch {}
    };

    const countries = loadCountries();
    const users = loadUsers();
    const sender = m.sender;
    const user = ensureUser(users, sender, m.pushName);

    let globalUser = global.db.data.users[sender];
    if (!globalUser) {
        globalUser = global.db.data.users[sender] = { money: 0, bank: 0 };
    }

    const occupied = countries.filter(c => c.owner !== 'الجمهورية (خالية)').length;
    const topPlayer = Object.entries(users)
        .filter(([_, u]) => u.wins > 0)
        .sort((a, b) => b[1].wins - a[1].wins)[0]?.[1]?.name || 'لا يوجد';

    const globalStats = { occupied, topPlayer };

    // --- أمر استعراض الجيش ---
    if (command === 'جيش' || command === 'جيشي' || command === 'army') {
        await react('🪖');
        const attackPower = user.army + (user.tanks * 500);
        let ownedCountries = countries.filter(c => c.owner === user.name);

        let armyMsg = `*╭─❀ ⚔️ ˚₊· ───❀╮*\n`;
        armyMsg += `*│ 🪖 قيادة القوات المسلحة 🪖*\n`;
        armyMsg += `*╰─❀ ⚔️ ˚₊· ───❀╯*\n\n`;
        armyMsg += `👤 *القائد:* ${user.name}\n`;
        armyMsg += `🛡️ *الجنود:* ${user.army.toLocaleString()} جندي\n`;
        armyMsg += `🚜 *الدبابات:* ${user.tanks.toLocaleString()} دبابة\n`;
        armyMsg += `⚡ *القوة الهجومية الشاملة:* ${attackPower.toLocaleString()}\n`;
        armyMsg += `👑 *الدول الخاضعة لسيطرتك:* ${ownedCountries.length}\n`;
        armyMsg += `🏆 *الانتصارات:* ${user.wins} | 💀 *الهزائم:* ${user.losses}\n\n`;
        armyMsg += `💡 *لشراء القوات:* \`${usedPrefix}شراء [جنود/دبابات] [العدد]\``;

        return m.reply(armyMsg);
    }

    // --- أمر الشراء وربط البنك ---
    if (command === 'شراء' || command === 'buy' || command === 'تدريب' || command === 'train') {
        let type = args[0]?.toLowerCase();
        let amount = parseInt(args[1]);

        if (command === 'تدريب' || command === 'train') {
            type = 'جنود';
            amount = parseInt(args[0]);
        }

        if (!type || isNaN(amount) || amount <= 0) {
            await react('⚠️');
            let shopTxt = `*╭── 🛒 ˚₊· المتجر العسكري ──╮*\n\n`;
            shopTxt += `📌 *طريقة الشراء من رصيدك:* \n`;
            shopTxt += `🔹 \`${usedPrefix}شراء جنود [العدد]\` (1 جندي = 1$)\n`;
            shopTxt += `🔹 \`${usedPrefix}شراء دبابات [العدد]\` (1 دبابة = 500$ | قوة +500)\n\n`;
            shopTxt += `💳 *رصيدك في الكاش:* ${globalUser.money || 0}$\n`;
            shopTxt += `🏦 *رصيدك في البنك:* ${globalUser.bank || 0}$`;
            return m.reply(shopTxt);
        }

        let unitCost = type.includes('دباب') || type.includes('tank') ? 500 : 1;
        let totalCost = amount * unitCost;

        let userBalance = (globalUser.money || 0) + (globalUser.bank || 0);
        if (userBalance < totalCost) {
            await react('❌');
            return m.reply(`❌ ┊ *رصيدك لا يكفي!*\n💰 ┊ التكلفة المطلوبة: ${totalCost.toLocaleString()}$\n💳 ┊ إجمالي رصيدك: ${userBalance.toLocaleString()}$`);
        }

        let remainingCost = totalCost;
        if ((globalUser.money || 0) >= remainingCost) {
            globalUser.money -= remainingCost;
        } else {
            remainingCost -= (globalUser.money || 0);
            globalUser.money = 0;
            globalUser.bank -= remainingCost;
        }

        if (type.includes('دباب') || type.includes('tank')) {
            user.tanks += amount;
            saveUsers(users);
            await react('🚜');
            return m.reply(`✅ ┊ *تم شراء ${amount.toLocaleString()} دبابة بنجاح!*\n💰 ┊ تم خصم: ${totalCost.toLocaleString()}$\n🚜 ┊ إجمالي دباباتك: ${user.tanks.toLocaleString()}`);
        } else {
            user.army += amount;
            saveUsers(users);
            await react('🪖');
            return m.reply(`✅ ┊ *تم تجنيد ${amount.toLocaleString()} جندي بنجاح!*\n💰 ┊ تم خصم: ${totalCost.toLocaleString()}$\n🛡️ ┊ إجمالي جيشك: ${user.army.toLocaleString()}`);
        }
    }

    // --- أمر الجمع اليومي ---
    if (command === 'يومية' || command === 'daily' || args[0] === 'daily') {
        const now = Date.now();
        if (now - user.lastDailyReward < DAILY_REWARD_HOUR) {
            const remaining = Math.ceil((DAILY_REWARD_HOUR - (now - user.lastDailyReward)) / (60 * 60 * 1000));
            await react('⏳');
            return m.reply(`⏳ ┊ *انتظر ${remaining} ساعة قبل جمع عوائد الدول التالية*`);
        }

        const ownedCountries = countries.filter(c => c.owner === user.name);
        if (ownedCountries.length === 0) {
            await react('❌');
            return m.reply(`❌ ┊ *أنت لا تملك أي دولة حالياً*\n🎯 ┊ ابدأ بغزو دولة باستخدام \`${usedPrefix}حرب [رقم]\``);
        }

        const totalReward = ownedCountries.reduce((sum, c) => sum + c.reward, 0);

        globalUser.bank = (globalUser.bank || 0) + totalReward;
        user.totalRewards += totalReward;
        user.lastDailyReward = now;
        saveUsers(users);

        await react('💰');
        let msg = `𓆩🩸𓆪 ═══ ❬ *المكافأة والعوائد اليومية* ❭ ═══ 𓆩🩸𓆪\n\n`;
        msg += `👑 ┊ *الدول المحتلة:* ${ownedCountries.length}\n`;
        msg += `💰 ┊ *إجمالي الأرباح:* +${totalReward.toLocaleString()} $\n`;
        msg += `🏦 ┊ *تم إيداع الأرباح في البنك بنجاح!*\n`;
        msg += `🏦 ┊ *رصيد البنك الحالي:* ${(globalUser.bank).toLocaleString()} $\n`;
        msg += `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩🩸𓆪`;
        return m.reply(msg);
    }

    // --- عرض الخريطة ---
    if (!args[0] || command === 'الخريطة' || command === 'خريطة' || command === 'map') {
        await react('🗺️');
        const imageBuffer = await drawWorldMap(countries, user, globalStats);

        let captionText = `𓆩⚔️𓆪 ═══ ❬ *خريطة السيطرة الإمبراطورية* ❭ ═══ 𓆩⚔️𓆪\n\n`;
        captionText += `🛡️ ┊ *جيشك:* ${user.army.toLocaleString()} جندي | 🚜 *دباباتك:* ${user.tanks}\n`;
        captionText += `🏆 ┊ *انتصاراتك:* ${user.wins} | 💀 *هزائمك:* ${user.losses}\n`;
        captionText += `🌍 ┊ *الدول المحتلة:* ${occupied}/${countries.length}\n\n`;
        captionText += `📋 ┊ *الأوامر المتاحة:*\n`;
        captionText += `⚔️ \`${usedPrefix}حرب [رقم]\` - غزو دولة أو مملكة مخفية\n`;
        captionText += `🪖 \`${usedPrefix}جيش\` - استعراض قواتك العسكرية\n`;
        captionText += `🛒 \`${usedPrefix}شراء [جنود/دبابات] [العدد]\` - شراء عتاد من البنك\n`;
        captionText += `💰 \`${usedPrefix}يومية\` - جمع عوائد احتلالك\n`;
        captionText += `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩⚔️𓆪`;

        if (imageBuffer) {
            return await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: captionText
            }, { quoted: m });
        } else {
            let textMap = captionText + '\n\n📊 ┊ *حالة الدول والدول المخفية:*\n';
            countries.forEach(c => {
                const owner = c.owner === 'الجمهورية (خالية)' ? '🟡 خالية' : `🔴 ${c.owner}`;
                textMap += `\n[${c.id}] ${c.name}\n  🛡️ ${c.defense.toLocaleString()} | 💰 ${c.reward.toLocaleString()} | ${owner}`;
            });
            return m.reply(textMap);
        }
    }

    // --- أمر الحرب واجتياح البلاد الأسطورية ---
    const targetId = args[0];
    const countryIndex = countries.findIndex(c => c.id === targetId || c.name === targetId);

    if (countryIndex === -1) {
        await react('❌');
        return m.reply(`❌ ┊ *دولة غير موجودة!*\n🗺️ ┊ اكتب \`${usedPrefix}الخريطة\` لرؤية القائمة.`);
    }

    const now = Date.now();
    if (now - user.lastWar < WAR_COOLDOWN) {
        const remaining = Math.ceil((WAR_COOLDOWN - (now - user.lastWar)) / 1000);
        await react('⏳');
        return m.reply(`⏳ ┊ *انتظر ${remaining} ثانية قبل شن الحرب القادمة*`);
    }

    const targetCountry = countries[countryIndex];

    if (targetCountry.owner === user.name) {
        await react('🛑');
        return m.reply(`🛑 ┊ *أنت تسيطر بالفعل على ${targetCountry.name}!*`);
    }

    const attackPower = user.army + (user.tanks * 500);

    if (attackPower < 500) {
        await react('⚠️');
        return m.reply(`⚠️ ┊ *قواتك ضعيفة جداً!*\n🛡️ ┊ تحتاج 500 نقطة قوة على الأقل لبدء الحرب.\n💡 ┊ استخدم \`${usedPrefix}شراء جنود 500\` لتجهيز جيشك.`);
    }

    user.lastWar = now;
    saveUsers(users);

    await react('⚔️');
    await m.reply(`🚀 ┊ *إعلان الحرب!* قواتك تزحف نحو *${targetCountry.name}*... ⚔️\n⏳ ┊ جاري حساب معركة الاجتياح...`);

    const luckFactor = Math.floor((Math.random() * 0.2 - 0.1) * attackPower);
    const totalAttackPower = attackPower + luckFactor;
    const success = totalAttackPower >= targetCountry.defense;

    if (success) {
        const armyLosses = Math.floor(user.army * 0.20);
        const tankLosses = Math.floor(user.tanks * 0.15);
        user.army -= armyLosses;
        user.tanks -= tankLosses;
        user.wins += 1;

        countries[countryIndex].owner = user.name;
        countries[countryIndex].defense = Math.floor(targetCountry.defense * 1.3);
        countries[countryIndex].occupiedAt = new Date().toISOString();

        saveCountries(countries);
        saveUsers(users);

        const updatedMapBuffer = await drawWorldMap(countries, user, {
            occupied: countries.filter(c => c.owner !== 'الجمهورية (خالية)').length,
            topPlayer: user.name
        });

        let winMsg = `𓆩🔥𓆪 ═══ ❬ *انتصار إمبراطوري أسطوري!* ❭ ═══ 𓆩🔥𓆪\n\n`;
        winMsg += `⚔️ ┊ نجحت قواتك في إسقاط واحتلال *${targetCountry.name}*!\n\n`;
        winMsg += `👑 ┊ *الحاكم الجديد:* ${user.name}\n`;
        winMsg += `🏰 ┊ *الدفاع المستقبلي للدولة:* ${countries[countryIndex].defense.toLocaleString()}\n`;
        winMsg += `💔 ┊ *خسائرك:* ${armyLosses.toLocaleString()} جندي | 🚜 ${tankLosses} دبابة\n`;
        winMsg += `🪖 ┊ *المتبقي:* ${user.army.toLocaleString()} جندي | 🚜 ${user.tanks} دبابة\n`;
        winMsg += `🏆 ┊ *إجمالي انتصاراتك:* ${user.wins}\n`;
        winMsg += `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩🔥𓆪`;

        if (updatedMapBuffer) {
            return await conn.sendMessage(m.chat, {
                image: updatedMapBuffer,
                caption: winMsg
            }, { quoted: m });
        }
        return m.reply(winMsg);
    } else {
        const armyLosses = Math.floor(user.army * 0.35);
        const tankLosses = Math.floor(user.tanks * 0.30);
        user.army -= armyLosses;
        user.tanks -= tankLosses;
        user.losses += 1;
        saveUsers(users);

        await react('💀');
        let loseMsg = `𓆩💀𓆪 ═══ ❬ *هزيمة ساحقة!* ❭ ═══ 𓆩💀𓆪\n\n`;
        loseMsg += `⚔️ ┊ تحطمت قواتك أمام دفاعات *${targetCountry.name}* الجبارة!\n\n`;
        loseMsg += `💔 ┊ *خسائرك:* ${armyLosses.toLocaleString()} جندي | 🚜 ${tankLosses} دبابة\n`;
        loseMsg += `📉 ┊ *الناجون:* ${user.army.toLocaleString()} جندي | 🚜 ${user.tanks} دبابة\n`;
        loseMsg += `💀 ┊ *إجمالي هزائمك:* ${user.losses}\n`;
        loseMsg += `💡 ┊ زوّد دباباتك وجيشك وحاول مجدداً!\n`;
        loseMsg += `𓆩𓆪 ┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓆩💀𓆪`;
        return m.reply(loseMsg);
    }
};

handler.help = ['حرب <رقم>', 'جيش', 'شراء <جنود/دبابات> <العدد>', 'يومية'];
handler.tags = ['games'];
handler.command = ['حرب', 'الخريطة', 'خريطة', 'احتلال', 'غزو', 'map', 'يومية', 'daily', 'تدريب', 'train', 'جيش', 'جيشي', 'army', 'شراء', 'buy'];
handler.register = true;

export default handler;