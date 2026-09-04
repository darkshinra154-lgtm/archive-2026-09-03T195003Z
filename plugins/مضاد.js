let handler = async (m, { conn, usedPrefix, command, text }) => {
    let isDeveloper = global.owner?.some(([number]) => m.sender.includes(number)) || m.fromMe;

    if (!isDeveloper) {
        return await conn.sendMessage(m.chat, { 
            text: `> 🩸 *« لَا تَتَجَرَّأْ عَلَى لَمْسِ مَفَاتِيحِ السَّيْطَرَةِ أَيَّتُهَا الضَّحِيَّةُ! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` 
        }, { quoted: m });
    }

    let subAction = text ? text.toLowerCase().trim() : '';
    
    if (subAction === 'off' || subAction === 'إيقاف') {
        global.db.data.antilinknum = global.db.data.antilinknum || {};
        global.db.data.antilinknum[m.chat] = false;
        return await conn.sendMessage(m.chat, { 
            text: `> 🛡️ *[ تم إيقاف حماية الروابط والأرقام في هذا الجروب ]* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` 
        }, { quoted: m });
    }

    if (subAction === 'on' || subAction === 'تفعيل') {
        global.db.data.antilinknum = global.db.data.antilinknum || {};
        global.db.data.antilinknum[m.chat] = true;
        return await conn.sendMessage(m.chat, { 
            text: `> ⚡ *[ تم تفعيل حماية الروابط والأرقام بنجاح ورصد الشات بالكامل ]* ~ 𝕾𝖚𝖐𝖚𝖓𝖆` 
        }, { quoted: m });
    }

    let statusMsg = `
╔═══════════════════════════════════╗
║    ✦ [ لَوْحَةُ حِمَايَةِ المِصْلَخِ الشَّامِلَة ] ✦   ║
╠═══════════════════════════════════╣
║ ⚙️ ⇦ لِلتَّفْعِيل: \`${usedPrefix + command} تفعيل\`
║ ⚙️ ⇦ لِلإِيقَاف: \`${usedPrefix + command} إيقاف\`
╚═══════════════════════════════════╝
> 🩸 *« الأَمْرُ أَمْرُكَ والـسَّاحَةُ تَحْتَ سَـيْـطَـرَتِـكَ! »* ~ 𝕾𝖚𝖐𝖚𝖓𝖆
`.trim();
    return await conn.sendMessage(m.chat, { text: statusMsg }, { quoted: m });
};

handler.help = ['مضاد', 'antispam', 'حماية'];
handler.tags = ['المطورين'];
handler.command = ['مضاد', 'antispam', 'حماية'];
handler.group = true;

export default handler;