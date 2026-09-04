// ✦ ADAM & SUKUNA SYSTEM - COSMIC DOMINION & DIMENSIONAL WAR 🌌⚔️ ✦
import fs from 'fs';
import path from 'path';

const LIB_DIR = path.join(process.cwd(), 'lib');
const DIMENSIONS_PATH = path.join(LIB_DIR, 'dimensions.json');
const COSMIC_USERS_PATH = path.join(LIB_DIR, 'cosmic_users.json');
const WAR_COOLDOWN = 60 * 1000; // دقيقة واحدة
const DAILY_AETHER_TIME = 24 * 60 * 60 * 1000;

function ensureLibDir() {
    if (!fs.existsSync(LIB_DIR)) fs.mkdirSync(LIB_DIR, { recursive: true });
}

function getDefaultDimensions() {
    return [
        { id: '1', name: 'مجرة الأوريون', energy: 5000, reward: 2000, owner: 'فراغ مطلق', icon: '🌌' },
        { id: '2', name: 'ثقب النجم الأسود', energy: 12000, reward: 4500, owner: 'فراغ مطلق', icon: '🕳️' },
        { id: '3', name: 'بعد أفروديت البلوري', energy: 25000, reward: 8000, owner: 'فراغ مطلق', icon: '💎' },
        { id: '4', name: 'عرش التنين الكوني', energy: 45000, reward: 15000, owner: 'فراغ مطلق', icon: '🐲' },
        { id: '5', name: 'سديم النرد الكمومي', energy: 75000, reward: 25000, owner: 'فراغ مطلق', icon: '🎲' },
        { id: '6', name: 'بوابة الـ 404 المجهولة', energy: 120000, reward: 40000, owner: 'فراغ مطلق', icon: '👾' },
        { id: '7', name: 'قلعة الوقت السرمدية', energy: 200000, reward: 70000, owner: 'فراغ مطلق', icon: '⏳' },
        { id: '8', name: 'جدار الكون الأخير', energy: 350000, reward: 120000, owner: 'فراغ مطلق', icon: '👁️' }
    ];
}

function loadDimensions() {
    ensureLibDir();
    if (!fs.existsSync(DIMENSIONS_PATH)) {
        const defaults = getDefaultDimensions();
        fs.writeFileSync(DIMENSIONS_PATH, JSON.stringify(defaults, null, 2));
        return defaults;
    }
    try {
        return JSON.parse(fs.readFileSync(DIMENSIONS_PATH, 'utf8'));
    } catch {
        const defaults = getDefaultDimensions();
        fs.writeFileSync(DIMENSIONS_PATH, JSON.stringify(defaults, null, 2));
        return defaults;
    }
}

function saveDimensions(data) {
    ensureLibDir();
    fs.writeFileSync(DIMENSIONS_PATH, JSON.stringify(data, null, 2));
}

function loadUsers() {
    ensureLibDir();
    if (!fs.existsSync(COSMIC_USERS_PATH)) {
        fs.writeFileSync(COSMIC_USERS_PATH, JSON.stringify({}));
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(COSMIC_USERS_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function saveUsers(data) {
    ensureLibDir();
    fs.writeFileSync(COSMIC_USERS_PATH, JSON.stringify(data, null, 2));
}

function ensureUser(users, sender, pushName) {
    if (!users[sender]) {
        users[sender] = {
            fleet: 50,         // عدد السفن الفضائية
            dreadnoughts: 0,   // مدمرات البعد الثلاثي (تزيد القوة بـ 1500)
            name: pushName || 'قائد فضائي',
            lastWar: 0,
            lastAether: 0,
            wins: 0,
            losses: 0
        };
    }
    return users[sender];
}

// --- رسم الخريطة الفضائية المستقبلية ---
async function drawCosmicMap(dimensions, user) {
    let canvas, createCanvas;
    try {
        const canvasModule = await import('canvas');
        createCanvas = canvasModule.createCanvas;
    } catch {
        return null;
    }

    const width = 1200;
    const height = 1200;
    canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // خلفية الفضاء العميق
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // إضافة نجوم عشوائية في الخلفية
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // هيدر كوني
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(30, 30, width - 60, 130);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, 130);

    ctx.fillStyle = '#60A5FA';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 DIMENSIONAL DOMINION SYSTEM 🌌', width / 2, 80);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`🛸 Fleet: ${user.fleet} Ships  |  🚀 Dreadnoughts: ${user.dreadnoughts}  |  💥 Attack Power: ${(user.fleet * 100 + user.dreadnoughts * 1500).toLocaleString()}`, width / 2, 125);

    // رسم المدارات الفلكية والدول/الأبعاد
    const centerX = width / 2;
    const centerY = height / 2 + 60;
    const baseRadius = 180;

    dimensions.forEach((dim, index) => {
        const angle = (index / dimensions.length) * Math.PI * 2;
        const radius = baseRadius + (index % 2 === 0 ? 160 : 280);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const isOccupied = dim.owner !== 'فراغ مطلق';

        // خطوط الربط بالمركز
        ctx.strokeStyle = isOccupied ? '#8B5CF6' : '#1F2937';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // كوكب/بعد فلكي
        ctx.fillStyle = isOccupied ? '#4C1D95' : '#1E293B';
        ctx.beginPath();
        ctx.arc(x, y, 75, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isOccupied ? '#A78BFA' : '#38BDF8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // نصوص البعد
        ctx.fillStyle = '#F3F4F6';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`[${dim.id}] ${dim.name}`, x, y - 20);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '13px sans-serif';
        ctx.fillText(`⚡ ${dim.energy.toLocaleString()}`, x, y + 5);
        ctx.fillText(`💰 +${dim.reward.toLocaleString()}`, x, y + 25);

        ctx.fillStyle = isOccupied ? '#34D399' : '#F59E0B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`👑 ${dim.owner.slice(0, 10)}`, x, y + 45);
    });

    // مركز النواة الكونية
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CORE', centerX, centerY + 5);

    return canvas.toBuffer('image/png');
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }); } catch {}
    };

    const dimensions = loadDimensions();
    const users = loadUsers();
    const sender = m.sender;
    const user = ensureUser(users, sender, m.pushName);

    let globalUser = global.db.data.users[sender];
    if (!globalUser) {
        globalUser = global.db.data.users[sender] = { money: 0, bank: 0 };
    }

    // --- أمر أسطولي (استعراض القوة) ---
    if (command === 'أسطول' || command === 'اسطول' || command === 'fleet') {
        await react('🛸');
        const attackPower = (user.fleet * 100) + (user.dreadnoughts * 1500);
        const owned = dimensions.filter(d => d.owner === user.name);

        let msg = `*╭─🛸 ˚₊· 🛡️ الأسطول الفضائي 🛡️ ·₊˚ 🛸─╮*\n\n`;
        msg += `👤 *القائد الأعلى:* ${user.name}\n`;
        msg += `🛸 *سفن الأسطول:* ${user.fleet.toLocaleString()} سفينة\n`;
        msg += `🚀 *المدمرات الكونية (Dreadnoughts):* ${user.dreadnoughts.toLocaleString()}\n`;
        msg += `⚡ *الطاقة الهجومية الكلية:* ${attackPower.toLocaleString()} MW\n`;
        msg += `🌌 *الأبعاد المحتلة:* ${owned.length} أبعاد\n`;
        msg += `🏆 *الانتصارات:* ${user.wins} | 💀 *الهزائم:* ${user.losses}\n\n`;
        msg += `💡 *لبناء سفن جديدة:* \`${usedPrefix}صناعة [سفن/مدمرات] [العدد]\``;
        return m.reply(msg);
    }

    // --- أمر صناعة وتجهيز الأسطول (مرتبط بالبنك) ---
    if (command === 'صناعة' || command === 'بناء' || command === 'build') {
        let type = args[0]?.toLowerCase();
        let amount = parseInt(args[1]);

        if (!type || isNaN(amount) || amount <= 0) {
            await react('⚠️');
            let shop = `*╭── 🛠️ ˚₊· ترسانة الصناعة الفضائية ──╮*\n\n`;
            shop += `🔹 \`${usedPrefix}صناعة سفن [العدد]\` (1 سفينة = 150$ | قوة +100)\n`;
            shop += `🔹 \`${usedPrefix}صناعة مدمرات [العدد]\` (1 مدمرة = 2,500$ | قوة +1500)\n\n`;
            shop += `💳 *رصيدك (كاش):* ${globalUser.money || 0}$\n`;
            shopTxt = `🏦 *رصيدك (بنك):* ${globalUser.bank || 0}$`;
            return m.reply(shop);
        }

        let isDread = type.includes('مدمر') || type.includes('dread');
        let unitCost = isDread ? 2500 : 150;
        let totalCost = amount * unitCost;

        let totalBalance = (globalUser.money || 0) + (globalUser.bank || 0);
        if (totalBalance < totalCost) {
            await react('❌');
            return m.reply(`❌ ┊ *الموارد المالية لا تكفي!*\n💰 ┊ المطلوب: ${totalCost.toLocaleString()}$\n💳 ┊ رصيدك الكلي: ${totalBalance.toLocaleString()}$`);
        }

        // الخصم من الكاش ثم البنك
        let remain = totalCost;
        if ((globalUser.money || 0) >= remain) {
            globalUser.money -= remain;
        } else {
            remain -= (globalUser.money || 0);
            globalUser.money = 0;
            globalUser.bank -= remain;
        }

        if (isDread) {
            user.dreadnoughts += amount;
            saveUsers(users);
            await react('🚀');
            return m.reply(`✅ ┊ *تمت صناعة ${amount.toLocaleString()} مدمرة كونية بنجاح!*\n💰 ┊ التكلفة: ${totalCost.toLocaleString()}$`);
        } else {
            user.fleet += amount;
            saveUsers(users);
            await react('🛸');
            return m.reply(`✅ ┊ *تم بناء ${amount.toLocaleString()} سفينة فضائية جديدة!*\n💰 ┊ التكلفة: ${totalCost.toLocaleString()}$`);
        }
    }

    // --- أمر استخراج الأثير (المكافأة اليومية) ---
    if (command === 'أثير' || command === 'اثير' || command === 'aether') {
        const now = Date.now();
        if (now - user.lastAether < DAILY_AETHER_TIME) {
            const remain = Math.ceil((DAILY_AETHER_TIME - (now - user.lastAether)) / (60 * 60 * 1000));
            await react('⏳');
            return m.reply(`⏳ ┊ *مفاعلات الأثير تتجدد! انتظر ${remain} ساعة.*`);
        }

        const owned = dimensions.filter(d => d.owner === user.name);
        if (owned.length === 0) {
            await react('❌');
            return m.reply(`❌ ┊ *لا تملك أي بعد فلكي حالياً لاستخراج الأثير!*\n🌌 ┊ سيطر على بعد أولاً عبر \`${usedPrefix}غزو [رقم البعد]\``);
        }

        const rewardSum = owned.reduce((sum, d) => sum + d.reward, 0);
        globalUser.bank = (globalUser.bank || 0) + rewardSum;
        user.lastAether = now;
        saveUsers(users);

        await react('💎');
        let msg = `𓆩🌌𓆪 ═══ ❬ *استخراج الأثير الكوني* ❭ ═══ 𓆩🌌𓆪\n\n`;
        msg += `💎 ┊ *تم استخراج الأثير من:* ${owned.length} أبعاد\n`;
        msg += `💰 ┊ *العائد الكلي:* +${rewardSum.toLocaleString()} $\n`;
        msg += `🏦 ┊ *تم الإيداع مباشرة في بنك المجرة!*\n`;
        return m.reply(msg);
    }

    // --- عرض الخريطة الفضائية ---
    if (!args[0] || command === 'الأبعاد' || command === 'الابعاد' || command === 'space') {
        await react('🌌');
        const mapBuffer = await drawCosmicMap(dimensions, user);

        let caption = `𓆩🌌𓆪 ═══ ❬ *خريطة الأبعاد الفلكية* ❭ ═══ 𓆩🌌𓆪\n\n`;
        caption += `🛸 ┊ *أسطولك:* ${user.fleet} سفينة | 🚀 *المدمرات:* ${user.dreadnoughts}\n`;
        caption += `⚡ ┊ *طاقتك الهجومية:* ${((user.fleet * 100) + (user.dreadnoughts * 1500)).toLocaleString()} MW\n\n`;
        caption += `📋 ┊ *الأوامر:*\n`;
        caption += `⚔️ \`${usedPrefix}غزو [رقم البعد]\` - غزو واحتلال بعد فلكي\n`;
        caption += `🛠️ \`${usedPrefix}صناعة [سفن/مدمرات] [العدد]\` - دعم الأسطول\n`;
        caption += `🛸 \`${usedPrefix}أسطول\` - استعراض قواتك\n`;
        caption += `💎 \`${usedPrefix}أثير\` - جمع الأرباح\n`;

        if (mapBuffer) {
            return await conn.sendMessage(m.chat, { image: mapBuffer, caption }, { quoted: m });
        } else {
            return m.reply(caption);
        }
    }

    // --- أمر غزو البعد ---
    const targetId = args[0];
    const dimIndex = dimensions.findIndex(d => d.id === targetId || d.name === targetId);

    if (dimIndex === -1) {
        await react('❌');
        return m.reply(`❌ ┊ *البعد الفلكي غير موجود!* استخدم \`${usedPrefix}الأبعاد\` لعرض الخريطة.`);
    }

    const now = Date.now();
    if (now - user.lastWar < WAR_COOLDOWN) {
        const remaining = Math.ceil((WAR_COOLDOWN - (now - user.lastWar)) / 1000);
        await react('⏳');
        return m.reply(`⏳ ┊ *محركاتك في حالة تبريد! انتظر ${remaining} ثانية.*`);
    }

    const targetDim = dimensions[dimIndex];
    if (targetDim.owner === user.name) {
        await react('🛑');
        return m.reply(`🛑 ┊ *أنت تسيطر على ${targetDim.name} بالفعل!*`);
    }

    const attackPower = (user.fleet * 100) + (user.dreadnoughts * 1500);

    user.lastWar = now;
    saveUsers(users);

    await react('⚡');
    await m.reply(`🚀 ┊ *قفزة بعدية!* الأسطول يخترق حاجز *${targetDim.name}*... ⚔️`);

    const luck = Math.floor((Math.random() * 0.2 - 0.1) * attackPower);
    const totalPower = attackPower + luck;

    if (totalPower >= targetDim.energy) {
        const fleetLost = Math.floor(user.fleet * 0.15);
        const dreadLost = Math.floor(user.dreadnoughts * 0.10);

        user.fleet -= fleetLost;
        user.dreadnoughts -= dreadLost;
        user.wins += 1;

        dimensions[dimIndex].owner = user.name;
        dimensions[dimIndex].energy = Math.floor(targetDim.energy * 1.35);

        saveDimensions(dimensions);
        saveUsers(users);

        const newMap = await drawCosmicMap(dimensions, user);

        let winMsg = `𓆩🔥𓆪 ═══ ❬ *اجتياح بعدي ناجح!* ❭ ═══ 𓆩🔥𓆪\n\n`;
        winMsg += `🌌 ┊ تم إخضاع *${targetDim.name}* لسيطرة أسطولك!\n`;
        winMsg += `👑 ┊ *حاكم البعد:* ${user.name}\n`;
        winMsg += `💥 ┊ *خسائر المعركة:* ${fleetLost} سفينة | ${dreadLost} مدمرة\n`;
        winMsg += `⚡ *الطاقة المطلوبة لغزوه مستقبلاً:* ${dimensions[dimIndex].energy.toLocaleString()} MW\n`;

        if (newMap) {
            return await conn.sendMessage(m.chat, { image: newMap, caption: winMsg }, { quoted: m });
        }
        return m.reply(winMsg);
    } else {
        const fleetLost = Math.floor(user.fleet * 0.30);
        const dreadLost = Math.floor(user.dreadnoughts * 0.25);

        user.fleet -= fleetLost;
        user.dreadnoughts -= dreadLost;
        user.losses += 1;

        saveUsers(users);

        await react('💀');
        let loseMsg = `𓆩💥𓆪 ═══ ❬ *كارثة في الأفق!* ❭ ═══ 𓆩💥𓆪\n\n`;
        loseMsg += `دمرت دفاعات *${targetDim.name}* معظم أسطولك!\n`;
        loseMsg += `💔 ┊ *خسائرك:* ${fleetLost} سفينة | ${dreadLost} مدمرة\n`;
        loseMsg += `💡 ┊ اصنع المزيد من المدمرات وحاول مجدداً!`;
        return m.reply(loseMsg);
    }
};

handler.help = ['غزو <رقم>', 'أسطول', 'صناعة <سفن/مدمرات> <العدد>', 'أثير'];
handler.tags = ['games'];
handler.command = ['غزو', 'الابعاد', 'الأبعاد', 'space', 'اسطول', 'أسطول', 'fleet', 'صناعة', 'بناء', 'build', 'أثير', 'اثير', 'aether'];
handler.register = true;

export default handler;