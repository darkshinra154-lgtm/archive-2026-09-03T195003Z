const handler = async (m, { conn, text, isOwner }) => {
    // السماح فقط للمطورين
    if (!isOwner) return m.reply('🚫 هذا الأمر مخصص للمطور فقط.');
    if (!m.isGroup) return m.reply('🚫 هذا الأمر يعمل فقط في الجروبات.');

    let newName = text || (m.quoted && m.quoted.text);
    if (!newName) return m.reply('⚠ يرجى كتابة الاسم الجديد أو الرد على رسالة تحتوي الاسم.');

    try {
        await conn.groupUpdateSubject(m.chat, newName);
        m.reply(`✅ تم تغيير اسم الجروب إلى: ${newName}`);
    } catch (e) {
        console.log('خطأ في تغيير الاسم:', e);
        m.reply('⚠ حدث خطأ أثناء تغيير الاسم.');
    }
};

handler.command = ['اسم','جروب_اسم'];
handler.group = true;

export default handler;