// ✦ ULTIMATE HEIST & WARFARE SYSTEM 💣🔫 ✦
const players = new Map();

export async function handler(m, { conn, command, args, usedPrefix }) {
  const sender = m.sender;
  const timeNow = Date.now();

  // الحصول على بيانات المستخدم أو إنشاؤها
  if (!players.has(sender)) {
    players.set(sender, {
      balance: 2000,
      cooldown: 0,
      weapon: null,    // السلاح المجهز
      armor: null,     // الدرع المجهز
      wins: 0,
      losses: 0
    });
  }

  const player = players.get(sender);
  const subCommand = args[0]?.toLowerCase();

  // قائمة الأسلحة والدروع المتاحة في المتجر
  const shopItems = {
    // الأسلحة
    'مسدس': { type: 'weapon', name: '🔫 مسدس تكتيكي', cost: 1200, power: 15, successBonus: 10 },
    'رشاش': { type: 'weapon', name: '💥 رشاش كلاشينكوف', cost: 4500, power: 35, successBonus: 20 },
    'قناص': { type: 'weapon', name: '🎯 بندقية قنص حرارية', cost: 10000, power: 65, successBonus: 30 },
    'ليزر': { type: 'weapon', name: '⚡ مدفع ليزر مدمر', cost: 25000, power: 100, successBonus: 45 },

    // الدروع
    'خفيف': { type: 'armor', name: '🎽 واقي رصاص خفيف', cost: 1000, defense: 20, blockChance: 30 },
    'تكتيكي': { type: 'armor', name: '🛡️ درع تكتيكي مقوى', cost: 3500, defense: 45, blockChance: 50 },
    'ثقيل': { type: 'armor', name: '🥋 درع فرقة الصدمة', cost: 8500, defense: 75, blockChance: 70 },
    'نانو': { type: 'armor', name: '🔮 درع النانو الفولاذي', cost: 20000, defense: 100, blockChance: 90 }
  };

  // 1. عرض المتجر
  if (subCommand === 'متجر' || subCommand === 'المتجر' || subCommand === 'shop') {
    let shopText = `*╭── 🛒 ˚₊· متجر الأسلحة والدروع الفتاكة ──╮*\n\n`;
    
    shopText += `🔫 *الأسلحة (تزيد قوة الهجوم ونسبة النجاح):*\n`;
    shopText += `• \`مسدس\`  - السعر: 1,200 $ (قوة +15 | نجاح +10%)\n`;
    shopText += `• \`رشاش\`   - السعر: 4,500 $ (قوة +35 | نجاح +20%)\n`;
    shopText += `• \`قناص\`   - السعر: 10,000 $ (قوة +65 | نجاح +30%)\n`;
    shopText += `• \`ليزر\`   - السعر: 25,000 $ (قوة +100 | نجاح +45%)\n\n`;

    shopText += `🛡️ *الدروع (تمنع السرقة وتصد الهجمات):*\n`;
    shopText += `• \`خفيف\`   - السعر: 1,000 $ (دفاع +20 | تصدي 30%)\n`;
    shopText += `• \`تكتيكي\` - السعر: 3,500 $ (دفاع +45 | تصدي 50%)\n`;
    shopText += `• \`ثقيل\`   - السعر: 8,500 $ (دفاع +75 | تصدي 70%)\n`;
    shopText += `• \`نانو\`    - السعر: 20,000 $ (دفاع +100 | تصدي 90%)\n\n`;

    shopText += `💡 *للشراء اكتب:* \`${usedPrefix}سرقة شراء [اسم_العنصر]\` (مثال: \`${usedPrefix}سرقة شراء رشاش\`)`;
    return m.reply(shopText);
  }

  // 2. شراء العتاد من المتجر
  if (subCommand === 'شراء' || subCommand === 'buy') {
    const itemName = args[1]?.toLowerCase();
    const item = shopItems[itemName];

    if (!item) {
      return m.reply(`❌ عنصر غير موجود! اكتب \`${usedPrefix}سرقة متجر\` לרؤية قائمة العناصر المتاحة.`);
    }

    if (player.balance < item.cost) {
      return m.reply(`❌ لا تملك مالاً كافياً! سعر ${item.name} هو ${item.cost.toLocaleString()} $ ورصيدك ${player.balance.toLocaleString()} $.`);
    }

    player.balance -= item.cost;

    if (item.type === 'weapon') {
      player.weapon = item;
      return m.reply(`✅ تم شراء وتجهيز **${item.name}** بنجاح! 🔫\n⚡ زادت قوتك الهجومية بمقدار +${item.power}`);
    } else if (item.type === 'armor') {
      player.armor = item;
      return m.reply(`✅ تم شراء وتجهيز **${item.name}** بنجاح! 🛡️\nحمايتك الآن تصد الهجمات بنسبة ${item.blockChance}%`);
    }
  }

  // 3. عرض الرصيد والحالة
  if (subCommand === 'حالة' || subCommand === 'عتادي' || subCommand === 'بروفايل') {
    const weaponName = player.weapon ? player.weapon.name : 'لا يوجد (أعزل)';
    const armorName = player.armor ? player.armor.name : 'لا يوجد (بدون حماية)';

    const statusText = `
*╭─ 🕵️‍♂️ ˚₊· ملف العميل التكتيكي ──╮*

💰 *الرصيد الكلي:* ${player.balance.toLocaleString()} $
🔫 *السلاح المجهز:* ${weaponName}
🛡️ *الدرع المجهز:* ${armorName}
🏆 *عمليات ناجحة:* ${player.wins} | 💀 *فشل:* ${player.losses}
⏳ *حالة الجاهزية:* ${player.cooldown > timeNow ? Math.ceil((player.cooldown - timeNow) / 1000) + ' ثانية' : 'جاهز للعملية 🚀'}

*╰──────────────────────╯*
💡 *الأوامر:*
• \`${usedPrefix}سرقة @مستخدم\` - نهب لاعب آخر
• \`${usedPrefix}سرقة متجر\` - عرض متجر العتاد
• \`${usedPrefix}سرقة شراء [الاسم]\` - شراء سلاح أو درع
    `.trim();
    return m.reply(statusText);
  }

  // 4. تنفيذ هجوم السرقة المباشر عند كتابة `.سرقة @مستخدم`
  const target = m.mentionedJid && m.mentionedJid[0];
  if (!target) {
    return m.reply(`❌ **طريقة الاستخدام:**\nاكتب \`${usedPrefix}سرقة @مستخدم\` لسرقة شخص معين.\nأو \`${usedPrefix}سرقة متجر\` لعرض الأسلحة والدروع.`);
  }

  if (target === sender) return m.reply('❌ لا يمكنك سرقة نفسك!');

  if (player.cooldown > timeNow) {
    const timeLeft = Math.ceil((player.cooldown - timeNow) / 1000);
    return m.reply(`⏳ الشرطة تلاحقك! انتظر **${timeLeft} ثانية** قبل تنفيذ عملية سرقة جديدة.`);
  }

  if (!players.has(target)) {
    players.set(target, { balance: 1500, cooldown: 0, weapon: null, armor: null, wins: 0, losses: 0 });
  }

  const victim = players.get(target);

  if (victim.balance < 300) {
    return m.reply('💸 هذا الشخص مفلس تماماً، لا يوجد ما تسرقه!');
  }

  // تطبيق كول داون 45 ثانية
  player.cooldown = timeNow + 45000;

  // فحص درع الضحية
  if (victim.armor) {
    const blockRoll = Math.floor(Math.random() * 100);
    if (blockRoll < victim.armor.blockChance) {
      return m.reply(`🛡️ *فشلت الهجمة!* ${victim.armor.name} الخاص بالضحية صد هجومك بالكامل!`, null, { mentions: [target] });
    }
  }

  // حساب نسبة النجاح (سلاح المهاجم ضد دفاع الضحية)
  const attackerPower = 50 + (player.weapon ? player.weapon.power : 0);
  const victimDefense = victim.armor ? victim.armor.defense : 0;
  const winChance = Math.min(85, Math.max(20, attackerPower - victimDefense));

  const attackRoll = Math.floor(Math.random() * 100);

  if (attackRoll < winChance) {
    const stolenAmount = Math.floor(victim.balance * 0.35) + 200;
    victim.balance -= stolenAmount;
    player.balance += stolenAmount;
    player.wins += 1;
    return m.reply(`🎯 *تم السطو بنجاح!* استخدمت ${player.weapon ? player.weapon.name : 'قبضتك'} وسرقت ${stolenAmount.toLocaleString()} $ من @${target.split('@')[0]}!`, null, { mentions: [target] });
  } else {
    const penalty = 500;
    player.balance = Math.max(0, player.balance - penalty);
    player.losses += 1;
    return m.reply(`🚑 *انعكست الخطة!* قاوم الضحية وتضررت قواتك، وخسرت ${penalty} $!`);
  }
}

handler.help = ['سرقة @مستخدم'];
handler.tags = ['games'];
handler.command = ['سرقة', 'نهب', 'heist', 'rob'];

export default handler;