import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, isOwner, text }) => {
    // السماح للمطورين فقط
    if (!isOwner) return m.reply('❌ هذا الأمر للمطور فقط.');

    if (!text) return m.reply('⚠ اكتب رقم أو اسم الملف المراد تعديله.');
    if (!m.quoted || !m.quoted.text) return m.reply('⚠ يرجى الرد على رسالة تحتوي على كود JS للتعديل.');

    const pluginsDir = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginsDir)) return m.reply('⚠ مجلد plugins غير موجود.');

    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    let fileToEdit;

    // التحقق إذا كان رقم أو اسم
    if (/^\d+$/.test(text)) {
        const index = parseInt(text) - 1;
        if (index < 0 || index >= files.length) return m.reply('⚠ الرقم غير صالح.');
        fileToEdit = files[index];
    } else {
        fileToEdit = text.endsWith('.js') ? text : text + '.js';
        if (!files.includes(fileToEdit)) return m.reply('⚠ الملف غير موجود.');
    }

    const filePath = path.join(pluginsDir, fileToEdit);
    const newCode = m.quoted.text;

    try {
        fs.writeFileSync(filePath, newCode);
        m.reply(`✅ تم تعديل الملف: ${fileToEdit}`);
    } catch (e) {
        console.error(e);
        m.reply('⚠ حدث خطأ أثناء تعديل الملف.');
    }
};

handler.command = ['تعديل'];
handler.group = false;

export default handler;