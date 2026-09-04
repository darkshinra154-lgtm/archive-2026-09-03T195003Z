
import { WAMessageStubType } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'

function normalizeMentionJid(value) {
if (!value) return null
if (typeof value === 'object') value = value.id || value.jid || value.phoneNumber || value.lid || ''
let text = String(value).trim()
if (!text) return null
if (text.startsWith('{')) {
try {
const parsed = JSON.parse(text)
text = parsed.id || parsed.jid || parsed.phoneNumber || parsed.lid || text
} catch {}
}
text = String(text).replace(/^@/, '').trim()
if (/^\d+$/.test(text)) return `${text}@s.whatsapp.net`
if (/^\d+@(?:s\.whatsapp\.net|lid)$/.test(text)) return text
return text.includes('@') ? text : null
}

function isForbiddenError(error) {
const text = [error?.message, error?.stack, error?.reason, error?.code, error?.statusCode, error?.output?.statusCode, error?.data?.statusCode].filter(Boolean).join(' ').toLowerCase()
return text.includes('403') || text.includes('forbidden')
}

function mentionLabel(jid) {
const normalized = normalizeMentionJid(jid)
return normalized ? `@${normalized.split('@')[0].split(':')[0]}` : '@مجهول'
}

async function sendWelcomeMessage(conn, chatId, targetJid, imagePath, text, fallbackPath) {
const contextInfo = {
mentionedJid: [targetJid].filter(Boolean),
isForwarded: true,
forwardingScore: 9999999,
forwardedNewsletterMessageInfo: { 
newsletterJid: global.channelRD?.id || global.canalIdM?.[0], 
newsletterName: global.channelRD?.name || global.namechannel, 
serverMessageId: -1 
}
}
try {
const image = /^https?:\/\//i.test(String(imagePath)) ? { url: imagePath } : fs.readFileSync(imagePath)
await conn.sendMessage(chatId, { image, caption: text, contextInfo }, { quoted: null })
} catch (error) {
if (isForbiddenError(error)) return true
console.error('[welcome] error generando/enviando imagen de bienvenida', error)
try {
const fallbackImage = fallbackPath ? fs.readFileSync(fallbackPath) : null
if (fallbackImage) return await conn.sendMessage(chatId, { image: fallbackImage, caption: text, contextInfo }, { quoted: null })
} catch (fallbackError) {
if (isForbiddenError(fallbackError)) return true
}
try {
await conn.sendMessage(chatId, { text, mentions: [targetJid].filter(Boolean), contextInfo }, { quoted: null })
} catch (textError) {
if (!isForbiddenError(textError)) console.error('[welcome] error enviando texto de respaldo', textError)
}
}
}

export async function before(m, { conn, participants = [], groupMetadata = {} } = {}) {
if (!m.messageStubType || !m.isGroup) return true
const chat = global.db?.getChat?.(m.chat) || global.db?.data?.chats?.[m.chat] || {}
if (!chat || !chat.welcome) return true

const isWelcome = [
WAMessageStubType.GROUP_PARTICIPANT_ADD,
WAMessageStubType.GROUP_PARTICIPANT_INVITE,
27, 31
].includes(m.messageStubType)

const isBye = [
WAMessageStubType.GROUP_PARTICIPANT_REMOVE,
WAMessageStubType.GROUP_PARTICIPANT_LEAVE,
28, 32
].includes(m.messageStubType)

if (!isWelcome && !isBye) return true

const safeParticipants = Array.isArray(participants) ? participants : []
const usuariosAfectados = Array.isArray(m.messageStubParameters) && m.messageStubParameters.length > 0 ? m.messageStubParameters : [m.sender]

for (let userId of usuariosAfectados) {
if (!userId) continue;
const targetJid = normalizeMentionJid(userId) || normalizeMentionJid(m.sender)
if (!targetJid) continue

try {
const greetingAssetsDir = path.join(process.cwd(), 'media', 'greetings')
const fallbackGreetingImage = isWelcome ? path.join(greetingAssetsDir, 'welcome_card.jpg') : path.join(greetingAssetsDir, 'leave_card.jpg')
const profile = conn.botProfile || {}
const greetingImage = isWelcome ? (profile.welcomeImageUrl || fallbackGreetingImage) : (profile.goodbyeImageUrl || fallbackGreetingImage)
const username = mentionLabel(targetJid)
const groupName = groupMetadata?.subject || 'هذا الجروب'
const desc = groupMetadata?.desc?.toString() || 'لا يوجد وصف'
const groupSize = (Array.isArray(groupMetadata?.participants) && groupMetadata.participants.length) || safeParticipants.length || 0
const fecha = new Date().toLocaleDateString("ar-EG", { timeZone: "Africa/Cairo", day: 'numeric', month: 'long', year: 'numeric' })

if (isWelcome) {
let text
if (chat.welcomeText) {
const botName = global.namebot || profile.botName || 'Dark Bot'
text = chat.welcomeText.replace(/@user/g, username).replace(/@subject/g, groupName).replace(/@desc/g, desc).replace(/\{user\}/g, username).replace(/\{group\}/g, groupName).replace(/\{botName\}/g, botName)
} else {
text = `
*╮━━━───────────━━━━╭*
>  💀 *𝗪𝗘𝗟𝗖𝗢𝗠𝗘* 🖤
*╯━━━───────────━━━━╰*


*⌬∙ • ──╾⊱﹝👤﹞⊰╼── • ∙⌬*
┊🪪 *الــــعــضو:* ${username}
┊🏰 *الــجــࢪوب:* ${groupName}
┊📅 *الــتــاࢪيــخ:* ${fecha}
┊👥 *الــعــدد:* ${groupSize} عضو
*⌬∙ • ──╾⊱﹝🍷﹞⊰╼── • ∙⌬*

> *「🍷 مرحباً بك في عالم الظلام 🍷」*
❋ ─━─⊰💀⊱─━─ ❋
_أنت الآن جزء من هذه العائلة.._
_التزم بالقواعد_
`.trim()
}
await sendWelcomeMessage(conn, m.chat, targetJid, greetingImage, text, fallbackGreetingImage)
} else if (isBye) {
let text
if (chat.byeText) {
const botName = global.namebot || profile.botName || 'Dark Bot'
text = chat.byeText.replace(/@user/g, username).replace(/@subject/g, groupName).replace(/\{user\}/g, username).replace(/\{group\}/g, groupName).replace(/\{botName\}/g, botName)
} else {
text = `
*╭━━━───────────────━━━━╮*
>   💀 *𝗚𝗢𝗢𝗗𝗕𝗬𝗘* 🖤
*╰━━━───────────────━━━━╯*


*⌬∙ • ──╾⊱﹝🥀﹞⊰╼── • ∙⌬*
┊👤 *الــࢪاحــل:* ${username}
┊🍂 *غــادࢪ:* ${groupName}
┊📅 *الــتــاࢪيــخ:* ${fecha}
┊👥 *المتبقون:* ${groupSize} روح
*⌬∙ • ──╾⊱﹝⚰️﹞⊰╼── • ∙⌬*

> *「⚰️ وداعا أيتها الروح التائهة ⚰️」*
❋ ─━─⊰💀⊱─━─ ❋
_لن نشتاق لك، فالضعفاء لا مكان لهم هنا_

> ${global.dev}
`.trim()
}
await sendWelcomeMessage(conn, m.chat, targetJid, greetingImage, text, fallbackGreetingImage)
}
} catch (error) {
if (!isForbiddenError(error)) console.error('[welcome] error procesando participante', error);
}
}
}

export default { before, needsParticipants: true }