/**
 * ═══════════════════════════════════════════════════════
 * 🎨 canvasMenu.js | مولد صور القوائم الديناميكية
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 🏷️ الحقوق: ${global.author}
 * 📜 الوصف: رسم صورة قائمة مخصصة تحتوي على اسم المستخدم، الوقت، واسم المطور
 * 🧭 الفئة: أدوات / Lib
 * 📥 المدخل: كائن المستخدم (user) واسم المرسل (senderName)
 * ═══════════════════════════════════════════════════════
 */
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ملاحظة: يفضل تحميل خط عربي جميل (مثل Cairo أو Tajawal) ووضعه في مجلد lib/fonts
// registerFont(path.join(__dirname, 'fonts/Cairo-Regular.ttf'), { family: 'Cairo' });

export async function generateMenuCanvas(senderName, userName, level) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. خلفية أسطورية (يمكنك تغيير الرابط بصورة سوكونا محلية أو من الإنترنت)
    const bg = await loadImage('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop'); 
    ctx.drawImage(bg, 0, 0, width, height);

    // 2. طبقة تعتيم أسطورية
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, width, height);

    // 3. إطار متوهج
    ctx.strokeStyle = '#ff003c'; // أحمر سوكونا
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 4. النصوص
    ctx.textAlign = 'center';
    
    // اسم البوت
    ctx.font = 'bold 48px Arial'; // استبدل Arial بـ 'Cairo' لو حملت الخط
    ctx.fillStyle = '#ff003c';
    ctx.fillText('⛩️ بوت سوكونا | Sukuna Bot ⛩️', width / 2, 80);

    // رسالة الترحيب
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`مرحباً بك يا ${senderName}`, width / 2, 150);

    // معلومات المستخدم
    ctx.font = '28px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(`المستوى: ${level} | الرصيد: ${userName?.bank || 0} 🪙`, width / 2, 220);

    // حقوق المطور
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffd700'; // ذهبي
    ctx.fillText(`Developed by: Adam (Shadow) | ${global.author || 'Sukuna Team'}`, width / 2, 300);

    // الوقت الحالي
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    ctx.font = '20px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText(`الوقت الآن: ${timeString}`, width / 2, 360);

    return canvas.toBuffer('image/png');
}