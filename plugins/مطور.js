import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "settings.js");

// ─────────── دوال مساعدة ───────────
function getOwners() {
  if (!fs.existsSync(settingsPath)) return [];
  let settingsData = fs.readFileSync(settingsPath, "utf-8");
  let ownerMatch = settingsData.match(/global\.owner\s*=\s*(\[[^\]]*\])/);
  if (!ownerMatch) return [];
  return eval(ownerMatch[1]);
}

function saveOwners(owners) {
  let settingsData = fs.readFileSync(settingsPath, "utf-8");
  let newSettings = settingsData.replace(
    /global\.owner\s*=\s*\[[^\]]*\]/,
    `global.owner = ${JSON.stringify(owners, null, 2)}`
  );
  fs.writeFileSync(settingsPath, newSettings, "utf-8");
}

// نفس منطق التطبيع المستخدم في settings.js (global.isOwnerJid) عشان نتفادى تكرار نفس المطور بصيغتين مختلفتين
function normalize(v) {
  v = String(v).trim();
  if (v.includes("@")) return v.toLowerCase();
  return v.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
}

// ─────────── الأمر الرئيسي ───────────
let handler = async (m, { conn, text }) => {
  // تحقق مباشر ومستقل: بنقرأ قائمة المطورين من settings.js تاني ونقارنها مباشرة
  // برقم المرسل، من غير ما نعتمد على أي متغير isOwner جاي من مكان تاني في الكود
  let owners = getOwners();
  const senderIsOwner = owners.some((o) => normalize(o) === normalize(m.sender));

  if (!senderIsOwner) {
    // نطبع في الكونسول بيانات المرسل الخام عشان لو حصلت محاولة دخول غلط نقدر نشوف السبب بالظبط
    console.log("[مطور] محاولة استخدام مرفوضة:", {
      sender: m.sender,
      participant: m.participant,
      keyParticipant: m.key?.participant,
      fromMe: m.key?.fromMe,
      chat: m.chat,
    });
    return m.reply("❌ هذا الأمر للمطور فقط.");
  }

  if (!fs.existsSync(settingsPath)) return m.reply("❌ ملف settings.js غير موجود.");

  let args = text.trim().split(/\s+/);
  let action = args[0]?.toLowerCase(); // اضف / حذف / عرض

  let rawJid =
    m.quoted?.sender ||
    (m.mentionedJid && m.mentionedJid[0]) ||
    null;

  // واتساب أحيانًا بيرجع @lid بدل رقم الهاتف الحقيقي في المنشن/الريبلاي،
  // فلازم نحاول نحوله لأي جي دي حقيقي (@s.whatsapp.net) قبل ما نستخرج الرقم
  let resolvedJid = null
  if (rawJid) {
    if (typeof rawJid.resolveLidToRealJid === "function") {
      resolvedJid = await rawJid.resolveLidToRealJid(m.chat, conn).catch(() => rawJid)
    } else {
      resolvedJid = rawJid
    }
  }

  // لو ماحدش كتب رقم يدوي، بنبني المعرف من المنشن/الريبلاي:
  // - لو اتحول لرقم حقيقي: بنخزن الرقم بس (متوافق مع الصيغة القديمة)
  // - لو لسه @lid (يحصل في الخاص لما ماينفعش نحله لأنه مش في جروب): بنخزن الـ JID كامل بصيغة @lid عشان يفضل يتعرف عليه
  let manualNumber = args[1]?.replace(/\D/g, "") || null;
  let identifier = manualNumber
    ? manualNumber
    : resolvedJid
      ? (resolvedJid.endsWith("@lid") ? resolvedJid : resolvedJid.split("@")[0])
      : null;

  let displayId = identifier ? identifier.split("@")[0] : null;

  if (action === "اضف") {
    if (!identifier) return m.reply("⚠️ اكتب رقم أو اعمل منشن أو ريپلاي.");
    if (owners.some((o) => normalize(o) === normalize(identifier)))
      return m.reply("⚠️ الرقم موجود بالفعل.");

    owners.push(identifier);
    saveOwners(owners);
    let note = identifier.endsWith("@lid")
      ? "\n(اتسجل بصيغة @lid لأن واتساب مارجعش الرقم الحقيقي هنا)"
      : "";
    return m.reply(`✅ تم إضافة *${displayId}* إلى المطورين.${note}`);
  }

  if (action === "حذف") {
    if (!identifier) return m.reply("⚠️ اكتب رقم أو اعمل منشن أو ريپلاي.");
    let before = owners.length;
    owners = owners.filter((o) => normalize(o) !== normalize(identifier));
    if (owners.length === before) return m.reply("❌ الرقم غير موجود.");

    saveOwners(owners);
    return m.reply(`🗑️ تم حذف *${displayId}* من المطورين.`);
  }

  if (action === "عرض") {
    if (owners.length === 0) return m.reply("⚠️ لا يوجد مطورين حالياً.");
    let list = owners
      .map((n, i) => `${i + 1}. ${String(n).split("@")[0]}${String(n).includes("@lid") ? " (lid)" : ""}`)
      .join("\n");
    return m.reply(`📋 قائمة المطورين:\n\n${list}`);
  }

  return m.reply("⚠️ الاستخدام: \n- مطور اضف [رقم/منشن/ريپلاي]\n- مطور حذف [رقم/منشن/ريپلاي]\n- مطور عرض");
};

handler.command = ["مطور"];
handler.help = ["مطور اضف/حذف/عرض"];
handler.tags = ["owner"];
handler.owner = true;

export default handler;
