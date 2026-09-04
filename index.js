/**
═══════════════════════════════════════════════════════
🚀 MAIN ENTRY | منصة الجلسات الموحدة
═══════════════════════════════════════════════════════
👑 المطور: آدم (شادو) | Adam (Shadow)
🤖 البوت: سوكونا | Sukuna
🏷️ الحقوق: ${global.author}
📜 الوصف: تشغيل الموقع + التليجرام + الجلسات + البلجنات
═══════════════════════════════════════════════════════
*/

import 'dotenv/config'
import './settings.js'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { format } from 'util'
import syntaxerror from 'syntax-error'
import { Low, JSONFile } from 'lowdb'
import pkg from 'lodash';
const { chain } = pkg;
import { protoType, serialize } from './lib/simple.js'
import { sessionManager } from './lib/SessionManager.js'
import { startWebServer } from './web/server.js'
import { startTelegramSessionBot } from './telegram/session-bot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

globalThis.__dirname = __dirname
globalThis.opts = globalThis.opts || {}
globalThis.conns = globalThis.conns || []
globalThis.conn = globalThis.conn || null
globalThis.authDir = globalThis.authDir || 'auth_info'
globalThis.plugins = globalThis.plugins || {}

global.prefix = new RegExp('^[#!./]')

protoType()
serialize()

// ═══ Fallback globals ═══
globalThis.botname = globalThis.botname || 'Sukuna Bot'
globalThis.author = globalThis.author || 'Adam (Shadow)'
globalThis.packname = globalThis.packname || globalThis.author
globalThis.owner = Array.isArray(globalThis.owner) ? globalThis.owner : []
globalThis.mods = Array.isArray(globalThis.mods) ? globalThis.mods : []
globalThis.telegramOwners = Array.isArray(globalThis.telegramOwners) ? globalThis.telegramOwners : []
globalThis.telegramDevelopers = Array.isArray(globalThis.telegramDevelopers) ? globalThis.telegramDevelopers : []

// ═══ Owner / Mods ═══
const ownerNumbers = new Set()
const ownerJids = new Set()
const modNumbers = new Set()
const modJids = new Set()

const cleanDigits = v => String(v || '').replace(/\D/g, '')

function addAuthItem(item, jidSet, numberSet) {
  const value = String(item || '').trim()
  if (!value) return

  if (value.includes('@')) {
    jidSet.add(value.toLowerCase())
  }

  const digits = cleanDigits(value)
  if (digits) numberSet.add(digits)
}

for (const item of globalThis.owner) addAuthItem(item, ownerJids, ownerNumbers)
for (const item of globalThis.mods) addAuthItem(item, modJids, modNumbers)

globalThis.isOwnerJid = globalThis.isOwnerJid || ((jid = '') => {
  const value = String(jid || '').toLowerCase()
  if (!value) return false
  if (ownerJids.has(value)) return true
  const digits = value.split('@')[0]
  return ownerNumbers.has(digits)
})

globalThis.isModsJid = globalThis.isModsJid || ((jid = '') => {
  const value = String(jid || '').toLowerCase()
  if (!value) return false
  if (globalThis.isOwnerJid(value)) return true
  if (modJids.has(value)) return true
  const digits = value.split('@')[0]
  return modNumbers.has(digits)
})

// ═══ Database ═══
globalThis.db = new Low(new JSONFile('datos.json'))
globalThis.DATABASE = globalThis.db

globalThis.loadDatabase = async function loadDatabase() {
  if (globalThis.db.READ) {
    return new Promise(resolve => setInterval(async function () {
      if (!globalThis.db.READ) {
        clearInterval(this)
        resolve(globalThis.db.data == null ? globalThis.loadDatabase() : globalThis.db.data)
      }
    }, 1000))
  }

  if (globalThis.db.data !== null) return

  globalThis.db.READ = true
  await globalThis.db.read().catch(console.error)
  globalThis.db.READ = null

  globalThis.db.data = {
    users: {},
    chats: {},
    settings: {},
    stats: {},
    ...(globalThis.db.data || {})
  }

  globalThis.db.chain = chain(globalThis.db.data)
}

await globalThis.loadDatabase()

setInterval(async () => {
  if (globalThis.db?.data) {
    await globalThis.db.write().catch(() => {})
  }
}, 30000)

// ═══ Plugins Loader ═══
const pluginFolder = path.join(__dirname, 'plugins')
await fs.ensureDir(pluginFolder)

function getPluginFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList

  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)

    try {
      if (fs.statSync(fullPath).isDirectory()) {
        getPluginFiles(fullPath, fileList)
      } else if (entry.endsWith('.js')) {
        fileList.push(fullPath)
      }
    } catch {}
  }

  return fileList
}

async function loadPlugins() {
  const files = getPluginFiles(pluginFolder)
  let loaded = 0
  let failed = 0

  console.log(chalk.cyan('📦 Loading plugins recursively...'))

  for (const filePath of files) {
    const relativePath = path.relative(pluginFolder, filePath).split(path.sep).join('/')

    try {
      const fileUrl = pathToFileURL(filePath).toString()
      const module = await import(`${fileUrl}?update=${Date.now()}`)
      globalThis.plugins[relativePath] = module.default || module
      loaded++
      console.log(chalk.green(`✅ ${relativePath}`))
    } catch (e) {
      failed++
      console.log(chalk.red(`❌ ${relativePath} | ${e.message.slice(0, 100)}`))
    }
  }

  console.log(chalk.green(`Loaded: ${loaded}`), chalk.red(`Failed: ${failed}`))
}

globalThis.reload = async (_ev, filename) => {
  if (!filename || !filename.endsWith('.js')) return

  const pluginName = filename.split(path.sep).join('/')
  const fullFilePath = path.join(pluginFolder, filename)

  if (!fs.existsSync(fullFilePath)) {
    if (globalThis.plugins[pluginName]) {
      delete globalThis.plugins[pluginName]
      console.log(chalk.yellow(`🗑️ Deleted: ${pluginName}`))
    }
    return
  }

  try {
    const err = syntaxerror(fs.readFileSync(fullFilePath, 'utf8'), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })

    if (err) {
      console.log(chalk.red(`❌ Syntax error in ${pluginName}\n${format(err)}`))
      return
    }

    const fileUrl = pathToFileURL(fullFilePath).toString()
    const module = await import(`${fileUrl}?update=${Date.now()}`)
    globalThis.plugins[pluginName] = module.default || module
    console.log(chalk.green(`✅ Reloaded: ${pluginName}`))
  } catch (e) {
    console.log(chalk.red(`❌ Reload error ${pluginName}: ${e.message}`))
  }
}

await loadPlugins()

try {
  fs.watch(pluginFolder, { recursive: true }, (eventType, filename) => {
    if (filename) globalThis.reload(null, filename).catch(() => {})
  })
  console.log(chalk.green('👁️ Watching plugins folder.'))
} catch {
  console.log(chalk.yellow('⚠️ Recursive watch not available.'))
}

// ═══ Handler ═══
let handlerModule = await import('./handler.js')
sessionManager.setHandler(handlerModule)

try {
  fs.watch(path.join(__dirname, 'handler.js'), async () => {
    try {
      handlerModule = await import(`./handler.js?update=${Date.now()}`)
      sessionManager.setHandler(handlerModule)
      console.log(chalk.green('♻️ handler.js reloaded for all sessions.'))
    } catch (e) {
      console.log(chalk.red(`Handler reload error: ${e.message}`))
    }
  })
} catch {}

// ═══ Migration from old main session ═══
async function migrateOldMainSession() {
  try {
    const oldPath = path.join(__dirname, 'sessions', 'session-bot')
    const newPath = path.join(__dirname, 'auth_info', 'legacy-main')

    if (
      await fs.pathExists(path.join(oldPath, 'creds.json')) &&
      !(await fs.pathExists(path.join(newPath, 'creds.json')))
    ) {
      await fs.copy(oldPath, newPath)
      console.log(chalk.yellow('📦 تم ترحيل الجلسة القديمة إلى auth_info/legacy-main'))
    }
  } catch {}
}

await migrateOldMainSession()

// ═══ Web + Telegram ═══
startWebServer({
  sessionManager,
  publicDir: __dirname,
  port: process.env.PORT || globalThis.webPort || 3000
})

startTelegramSessionBot(sessionManager)

// ═══ Load all sessions ═══
await sessionManager.loadExisting()

// ═══ Tmp cleanup ═══
setInterval(async () => {
  const tmpDir = path.join(__dirname, 'tmp')
  try {
    await fs.ensureDir(tmpDir)
    const files = await fs.readdir(tmpDir)
    for (const file of files) {
      await fs.remove(path.join(tmpDir, file))
    }
  } catch {}
}, 30000)

// ═══ Support fallback ═══
globalThis.support = globalThis.support || {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: true,
  gm: true,
  find: true
}

console.log(chalk.green('✅ Unified Session System is ready.'))