/*
 * ═══════════════════════════════════════════════════════
 * 🎮 XO BATTLE | إكس أو تفاعلي حقيقي (Multiplayer + AI)
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna
 * 🏷️ الحقوق: ${global.author}
 * 📜 الوصف: لعبة XO بنظام Multiplayer حقيقي + بوت AI ذكي
 *           مع حفظ التقدم في Backend البوت ورسم Canvas أسطوري
 * ═══════════════════════════════════════════════════════
 */

import { proto, prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const XO_DB = path.join(process.cwd(), 'database', 'xo_games.json')
const FALLBACK_IMAGE = 'https://i.ibb.co/L50Fk1j/sukuna-fallback.jpg'
const STATS_DB = path.join(process.cwd(), 'database', 'xo_stats.json')

// ═══════════ 💾 إدارة الداتابيز ═══════════
function loadGames() {
    try {
        if (fs.existsSync(XO_DB)) return JSON.parse(fs.readFileSync(XO_DB, 'utf8'))
    } catch (e) {}
    return {}
}
function saveGames(g) {
    try {
        fs.mkdirSync(path.dirname(XO_DB), { recursive: true })
        fs.writeFileSync(XO_DB, JSON.stringify(g, null, 2))
    } catch (e) {}
}
function loadStats() {
    try {
        if (fs.existsSync(STATS_DB)) return JSON.parse(fs.readFileSync(STATS_DB, 'utf8'))
    } catch (e) {}
    return {}
}
function saveStats(s) {
    try {
        fs.mkdirSync(path.dirname(STATS_DB), { recursive: true })
        fs.writeFileSync(STATS_DB, JSON.stringify(s, null, 2))
    } catch (e) {}
}
function recordResult(jid, result) {
    const stats = loadStats()
    if (!stats[jid]) stats[jid] = { wins: 0, losses: 0, draws: 0 }
    stats[jid][result] = (stats[jid][result] || 0) + 1
    saveStats(stats)
}
function cleanupGames(games) {
    const now = Date.now()
    for (const id in games) {
        if (now - games[id].createdAt > 24 * 60 * 60 * 1000) delete games[id]
        if (games[id] && games[id].finished && now - games[id].finishedAt > 10 * 60 * 1000) delete games[id]
    }
}

// ═══════════ 🧠 ذكاء اصطناعي (Minimax - بيلعب بشكل مثالي) ═══════════
const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
function checkWinner(board) {
    for (const [a,b,c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: [a,b,c] }
        }
    }
    if (board.every(x => x)) return { winner: 'draw', line: [] }
    return null
}
function minimax(board, isMax, aiSym, playerSym) {
    const res = checkWinner(board)
    if (res) {
        if (res.winner === aiSym) return { score: 10 }
        if (res.winner === playerSym) return { score: -10 }
        return { score: 0 }
    }
    const moves = []
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? aiSym : playerSym
            const r = minimax(board, !isMax, aiSym, playerSym)
            moves.push({ index: i, score: r.score })
            board[i] = ''
        }
    }
    if (isMax) return moves.reduce((best, m) => m.score > best.score ? m : best, { score: -Infinity })
    return moves.reduce((best, m) => m.score < best.score ? m : best, { score: Infinity })
}
function aiMove(board, aiSym, playerSym) {
    // 30% chance plays random to make it beatable
    if (Math.random() < 0.3) {
        const empty = board.map((v,i) => v ? null : i).filter(x => x !== null)
        return empty[Math.floor(Math.random() * empty.length)]
    }
    return minimax([...board], true, aiSym, playerSym).index
}

// ═══════════ 🎨 Canvas ═══════════
let _canvasLib = undefined
async function getCanvasLib() {
    if (_canvasLib === undefined) {
        try { _canvasLib = await import('canvas') } catch { _canvasLib = null }
    }
    return _canvasLib
}
let fontReady = false
async function ensureFonts(lib) {
    if (fontReady || !lib) return
    try {
        const reg = path.join(process.cwd(), 'fonts', 'Amiri-Regular.ttf')
        const bold = path.join(process.cwd(), 'fonts', 'Amiri-Bold.ttf')
        if (fs.existsSync(reg)) lib.registerFont(reg, { family: 'Amiri' })
        if (fs.existsSync(bold)) lib.registerFont(bold, { family: 'Amiri-Bold' })
    } catch (e) {}
    fontReady = true
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
}

async function drawBoard(d) {
    const lib = await getCanvasLib()
    if (!lib) return null
    await ensureFonts(lib)
    try {
        const { createCanvas } = lib
        const W = 900, H = 1100
        const canvas = createCanvas(W, H)
        const ctx = canvas.getContext('2d')

        // خلفية متدرجة
        const bg = ctx.createLinearGradient(0, 0, W, H)
        bg.addColorStop(0, '#0f0c29')
        bg.addColorStop(0.5, '#302b63')
        bg.addColorStop(1, '#24243e')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, H)

        // طبقة تعتيم
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(0, 0, W, H)

        // العنوان
        ctx.textAlign = 'center'
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 52px "Amiri-Bold"'
        ctx.shadowColor = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur = 15
        ctx.fillText('❌ ⭕ معركة XO', W / 2, 80)
        ctx.shadowBlur = 0

        // معلومات اللاعبين
        ctx.font = 'bold 28px Amiri'
        ctx.textAlign = 'right'
        ctx.fillStyle = d.turn === 'X' ? '#ff7675' : 'rgba(255,255,255,0.5)'
        ctx.fillText(`❌ ${d.p1Name}`, W - 60, 150)
        if (d.turn === 'X' && !d.finished) {
            ctx.fillStyle = '#ff7675'
            ctx.fillText('◀ دوره', W - 60, 185)
        }

        ctx.fillStyle = d.turn === 'O' ? '#74b9ff' : 'rgba(255,255,255,0.5)'
        ctx.fillText(`⭕ ${d.p2Name}`, W - 60, 240)
        if (d.turn === 'O' && !d.finished) {
            ctx.fillStyle = '#74b9ff'
            ctx.fillText('◀ دوره', W - 60, 275)
        }

        // إحصائيات
        ctx.textAlign = 'left'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '22px Amiri'
        ctx.fillText(`فوز: ${d.p1Stats?.wins || 0} │ خسارة: ${d.p1Stats?.losses || 0}`, 60, 150)
        ctx.fillText(`فوز: ${d.p2Stats?.wins || 0} │ خسارة: ${d.p2Stats?.losses || 0}`, 60, 240)

        // لوحة اللعب
        const BOARD_X = 150, BOARD_Y = 330, CELL = 200, GAP = 12
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3), col = i % 3
            const x = BOARD_X + col * (CELL + GAP)
            const y = BOARD_Y + row * (CELL + GAP)

            // خلفية الخانة
            roundRect(ctx, x, y, CELL, CELL, 20)
            const isWinCell = d.winLine && d.winLine.includes(i)
            if (isWinCell) {
                ctx.fillStyle = 'rgba(253, 203, 110, 0.25)'
                ctx.fill()
                ctx.strokeStyle = '#fdcb6e'
                ctx.lineWidth = 6
                ctx.shadowColor = '#fdcb6e'
                ctx.shadowBlur = 20
                ctx.stroke()
                ctx.shadowBlur = 0
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.08)'
                ctx.fill()
                ctx.strokeStyle = 'rgba(255,255,255,0.2)'
                ctx.lineWidth = 2
                ctx.stroke()
            }

            // الرمز
            if (d.board[i]) {
                ctx.textAlign = 'center'
                ctx.font = 'bold 120px "Amiri-Bold"'
                if (d.board[i] === 'X') {
                    ctx.fillStyle = '#ff7675'
                    ctx.shadowColor = 'rgba(255,118,117,0.6)'
                    ctx.shadowBlur = 20
                    ctx.fillText('✕', x + CELL / 2, y + CELL / 2 + 40)
                } else {
                    ctx.fillStyle = '#74b9ff'
                    ctx.shadowColor = 'rgba(116,185,255,0.6)'
                    ctx.shadowBlur = 20
                    ctx.fillText('◯', x + CELL / 2, y + CELL / 2 + 40)
                }
                ctx.shadowBlur = 0
            } else {
                // رقم الخانة
                ctx.fillStyle = 'rgba(255,255,255,0.15)'
                ctx.font = 'bold 40px Amiri'
                ctx.fillText(String(i + 1), x + CELL / 2, y + CELL / 2 + 15)
            }
        }

        // رسالة الحالة
        ctx.textAlign = 'center'
        if (d.finished) {
            ctx.font = 'bold 44px "Amiri-Bold"'
            if (d.winner === 'draw') {
                ctx.fillStyle = '#fdcb6e'
                ctx.fillText('🤝 تعادل!', W / 2, H - 140)
            } else {
                ctx.fillStyle = d.winner === 'X' ? '#ff7675' : '#74b9ff'
                ctx.fillText(`🏆 الفائز: ${d.winner === 'X' ? d.p1Name : d.p2Name}`, W / 2, H - 140)
            }
            ctx.font = '26px Amiri'
            ctx.fillStyle = 'rgba(255,255,255,0.7)'
            ctx.fillText('اضغط "🔄 لعبة جديدة" للعب مرة أخرى', W / 2, H - 90)
        } else {
            ctx.font = 'bold 34px "Amiri-Bold"'
            ctx.fillStyle = d.turn === 'X' ? '#ff7675' : '#74b9ff'
            ctx.fillText(`🎯 الدور على: ${d.turn === 'X' ? d.p1Name : d.p2Name}`, W / 2, H - 120)
        }

        // توقيع البوت
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.font = 'italic 22px Amiri'
        ctx.fillText(`🕸 ${global.botname || 'Sukuna Bot'} 🕸`, W / 2, H - 40)

        return canvas.toBuffer('image/jpeg', { quality: 0.9 })
    } catch (e) { console.error('Canvas error:', e); return null }
}

// ═══════════ 📤 إرسال تفاعلي ═══════════
const qBtn = (label, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: label, id }) })

async function sendXOMessage(conn, m, game, caption) {
    const imgBuffer = await drawBoard({
        board: game.board,
        turn: game.turn,
        p1Name: game.players.X.name,
        p2Name: game.players.O.name,
        p1Stats: game.stats.X,
        p2Stats: game.stats.O,
        finished: game.status !== 'playing',
        winner: game.winner,
        winLine: game.winLine
    })

    const buttons = []
    if (game.status === 'playing') {
        // 9 أزرار للخانات الفاضية
        const rowBtns = []
        for (let i = 0; i < 9; i++) {
            if (!game.board[i]) {
                const label = game.turn === 'X' ? `❌ خانة ${i+1}` : `⭕ خانة ${i+1}`
                rowBtns.push(qBtn(label, `xo_${game.id}_${i}`))
            }
        }
        // نقسمهم صفوف (3 أزرار في كل صف)
        buttons.push(...rowBtns.slice(0, 5))
        buttons.push(...rowBtns.slice(5, 10))
        buttons.push(qBtn('🏳️ استسلام', `xo_resign_${game.id}`))
    } else {
        buttons.push(qBtn('🔄 لعبة جديدة', `.xo`))
        buttons.push(qBtn('🏆 إحصائياتي', `.xo_stats`))
    }
    buttons.push(qBtn('📜 الأوامر', `.xo_help`))

    const payload = {
        header: { hasMediaAttachment: false },
        body: { text: caption, ...(game.mentions?.length ? { contextInfo: { mentionedJid: game.mentions } } : {}) },
        footer: { text: `🕸 ${global.botname || 'Sukuna Bot'} 🕸` },
        nativeFlowMessage: { buttons },
        messageParamsJson: '｢🎮 XO BATTLE｣'
    }
    try {
        const media = await prepareWAMessageMedia({ image: imgBuffer || { url: FALLBACK_IMAGE } }, { upload: conn.waUploadToServer })
        payload.header = { hasMediaAttachment: true, imageMessage: media.imageMessage }
    } catch (e) {}
    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

// ═══════════ 🎯 الهاندلر الرئيسي ═══════════
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    const pfx = usedPrefix || '.'
    const sender = m.sender

    // مساعدة
    if (command === 'xo_help' || (command === 'xo' && args[0] === 'help')) {
        const help = `*❆│·••━━⊰🎮━━••·│❆*\n` +
            `⌗› مـوسـوعـة لـعـبـة XO  ˼˹\n` +
            `*⋄⊹•─๋︩︪─• ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n\n` +
            `> ˼‏🎮˹ أوامر اللعب╿↶\n` +
            `│┊🤖 \`${pfx}xo\` — العب ضد البوت (AI ذكي)\n` +
            `│┊👥 \`${pfx}xo @منشن\` — تحدي لاعب في الشات\n` +
            `│┊🏆 \`${pfx}xo_stats\` — إحصائياتك\n` +
            `│┊📊 \`${pfx}xo_top\` — أفضل 10 لاعبين\n` +
            `│┊🏳️ \`${pfx}xo_resign\` — استسلام\n\n` +
            `> ˼‏💡˹ ملاحظات╿↶\n` +
            `│┊• اللعبة محفوظة في سيرفر البوت (مش هتضيع)\n` +
            `│┊• أي حد في الشات يشوف اللعبة\n` +
            `│┊• لازم يكون دورك عشان تلعب\n` +
            `*❆│·••━━⊰🎮━━••·│❆*`
        return m.reply(help)
    }

    // إحصائيات
    if (command === 'xo_stats' || (command === 'xo' && args[0] === 'stats')) {
        const stats = loadStats()
        const my = stats[sender] || { wins: 0, losses: 0, draws: 0 }
        const total = my.wins + my.losses + my.draws
        const winRate = total > 0 ? ((my.wins / total) * 100).toFixed(1) : 0
        let t = `*~❍━═══━⚞🏆━═══━❍~*\n`
        t += `⌗› إحصـائـيـاتـك فـي XO  ˼˹\n`
        t += `*⋄⊹•─๋︩︪─• ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        t += `│┊👤 الاسم: @${sender.split('@')[0]}\n`
        t += `┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ\n`
        t += `│┊🏆 فوز: \`${my.wins}\`\n`
        t += `│┊💀 خسارة: \`${my.losses}\`\n`
        t += `│┊🤝 تعادل: \`${my.draws}\`\n`
        t += `│┊📊 إجمالي المباريات: \`${total}\`\n`
        t += `│┊🎯 نسبة الفوز: \`${winRate}%\`\n`
        t += `*~❍━═══━⚞🏆━═══━❍~*`
        return m.reply(t, null, { mentions: [sender] })
    }

    // أفضل 10
    if (command === 'xo_top' || (command === 'xo' && args[0] === 'top')) {
        const stats = loadStats()
        const sorted = Object.entries(stats)
            .map(([jid, s]) => ({ jid, ...s, score: (s.wins || 0) * 3 + (s.draws || 0) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
        if (!sorted.length) return m.reply('❌ *مفيش لاعبين لسه!*\nابدأ لعبة بـ `.xo`')
        let t = `*~❍━═══━⚞🏆━═══━❍~*\n`
        t += `⌗› أفـضـل 10 لاعـبـيـن XO  ˼˹\n`
        t += `*⋄⊹•─๋︩︪─• ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n`
        sorted.forEach((p, i) => {
            const medal = ['🥇', '🥈', '🥉'][i] || `#${i + 1}`
            t += `│┊${medal} @${p.jid.split('@')[0]} — ${p.wins || 0} فوز (${p.score} نقطة)\n`
        })
        t += `*~❍━═══━⚞🏆━═══━❍~*`
        return m.reply(t, null, { mentions: sorted.map(p => p.jid) })
    }

    // استسلام
    if (command === 'xo_resign') {
        const games = loadGames()
        const myGame = Object.values(games).find(g =>
            g.chat === m.chat && g.status === 'playing' &&
            (g.players.X.jid === sender || g.players.O.jid === sender)
        )
        if (!myGame) return m.reply('❌ *مفيش لعبة نشطة ليك في الشات ده!*')
        const loser = myGame.players.X.jid === sender ? 'X' : 'O'
        const winner = loser === 'X' ? 'O' : 'X'
        myGame.status = 'finished'
        myGame.winner = winner
        myGame.finishedAt = Date.now()
        recordResult(myGame.players[winner].jid, 'wins')
        recordResult(myGame.players[loser].jid, 'losses')
        saveGames(games)
        const t = `*~❍━═══━⚞🏳️━═══━❍~*\n│┊🏳️ @${sender.split('@')[0]} استسلم!\n│┊🏆 الفائز: @${myGame.players[winner].jid.split('@')[0]}\n*~❍━═══━⚞🏳️━═══━❍~*`
        myGame.mentions = [sender, myGame.players[winner].jid]
        await sendXOMessage(conn, m, myGame, t)
        return
    }

    // بدء لعبة جديدة
    if (command === 'xo' || command === 'اكس') {
        const games = loadGames()
        cleanupGames(games)

        // تحقق من وجود لعبة نشطة للمستخدم
        const existingGame = Object.values(games).find(g =>
            g.chat === m.chat && g.status === 'playing' &&
            (g.players.X.jid === sender || g.players.O.jid === sender)
        )
        if (existingGame) {
            return m.reply(`*❆│·••━━⊰⚠️━━••·│❆*\n│┊⚠️ عندك لعبة نشطة في الشات ده!\n│┊🎮 كمّلها أو استسلم بـ \`${pfx}xo_resign\`\n*❆│·••━━⊰⚠️━━••·│❆*`)
        }

        const opponent = m.mentionedJid?.[0] || m.quoted?.sender || null
        let p2Jid, p2Name, isAI = false

        if (!opponent || opponent === sender) {
            // ضد البوت
            p2Jid = conn.user.jid
            p2Name = '🤖 سوكونا AI'
            isAI = true
        } else {
            p2Jid = opponent
            try { p2Name = await conn.getName(p2Jid) } catch { p2Name = 'لاعب 2' }
        }

        let p1Name
        try { p1Name = await conn.getName(sender) } catch { p1Name = 'لاعب 1' }

        const gameId = crypto.randomBytes(4).toString('hex')
        const game = {
            id: gameId,
            chat: m.chat,
            players: {
                X: { jid: sender, name: p1Name },
                O: { jid: p2Jid, name: p2Name }
            },
            turn: 'X',
            board: Array(9).fill(''),
            status: 'playing',
            winner: null,
            winLine: [],
            isAI,
            createdAt: Date.now(),
            stats: {
                X: loadStats()[sender] || { wins: 0, losses: 0, draws: 0 },
                O: loadStats()[p2Jid] || { wins: 0, losses: 0, draws: 0 }
            },
            mentions: [sender, p2Jid]
        }

        games[gameId] = game
        saveGames(games)

        const mode = isAI ? '🤖 ضد سوكونا AI' : `👥 @${sender.split('@')[0]} 🆚 @${p2Jid.split('@')[0]}`
        const caption = `*~❍━═══━⚞🎮━═══━❍~*\n` +
            `⌗› بـدأت مـعـركـة XO  ˼˹\n` +
            `*⋄⊹•─๋︩︪─• ⧼ ⇊ ⧽ •─╼─๋︩︪•⋄*\n` +
            `│┊🎯 النمط: ${mode}\n` +
            `│┊❌ @${sender.split('@')[0]} — يبدأ أولاً\n` +
            `│┊⭕ ${p2Name}\n` +
            `┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ\n` +
            `> ˼‏🎯˹ اضغط على الأزرار للعب!`
        await sendXOMessage(conn, m, game, caption)
    }
}

// ═══════════ 🎯 التقاط الأزرار (handler.before) ═══════════
handler.before = async (m, { conn, isOwner }) => {
    // التقاط استجابات الأزرار
    if (m.type !== 'interactive_response' && !m.response) return false
    let id = null
    try {
        const r = JSON.parse(m.response || '{}')
        id = r.id || r.selectedId || r.selectedRowId || r.nativeFlowResponseMessage?.id || null
        if (!id && r.paramsJson) id = JSON.parse(r.paramsJson)?.id || null
    } catch (e) { return false }
    if (!id || typeof id !== 'string') return false

    // التعامل مع الأوامر الخاصة
    if (id === '.xo' || id === '.xo_stats' || id === '.xo_top' || id === '.xo_help') {
        const cmd = id.slice(1)
        try { await handler(m, { conn, args: cmd.includes('_') ? [cmd.split('_')[1]] : [], usedPrefix: '.', command: cmd, isOwner }) } catch (e) { console.error(e) }
        return true
    }

    // التعامل مع أزرار اللعب xo_<gameId>_<index> أو xo_resign_<gameId>
    const match = id.match(/^xo_(?:resign_)?([a-f0-9]+)(?:_(\d))?$/)
    if (!match) return false
    const [, gameId, indexStr] = match
    const index = indexStr !== undefined ? parseInt(indexStr) : null

    const games = loadGames()
    const game = games[gameId]
    if (!game) {
        await m.reply('⏳ *اللعبة انتهت أو اتمسحت!*\nابدأ لعبة جديدة بـ `.xo`')
        return true
    }
    if (game.chat !== m.chat) {
        await m.reply('⚠️ *اللعبة دي في شات تاني!*')
        return true
    }
    if (game.status !== 'playing') {
        await m.reply('⏳ *اللعبة خلصت بالفعل!*\nاضغط "🔄 لعبة جديدة"')
        return true
    }

    // استسلام
    if (id.startsWith('xo_resign_')) {
        if (game.players.X.jid !== m.sender && game.players.O.jid !== m.sender) {
            await m.reply('❌ *مش لاعب في اللعبة دي!*')
            return true
        }
        const loser = game.players.X.jid === m.sender ? 'X' : 'O'
        const winner = loser === 'X' ? 'O' : 'X'
        game.status = 'finished'
        game.winner = winner
        game.finishedAt = Date.now()
        recordResult(game.players[winner].jid, 'wins')
        recordResult(game.players[loser].jid, 'losses')
        saveGames(games)
        const t = `*~❍━═══━⚞🏳️━═══━❍~*\n│┊🏳️ @${m.sender.split('@')[0]} استسلم!\n│┊🏆 الفائز: @${game.players[winner].jid.split('@')[0]}\n*~❍━═══━⚞🏳️━═══━❍~*`
        game.mentions = [m.sender, game.players[winner].jid]
        await sendXOMessage(conn, m, game, t)
        return true
    }

    // حركة اللعب
    if (index === null || index < 0 || index > 8) return false
    const currentSymbol = game.turn
    const currentPlayer = game.players[currentSymbol].jid

    // تحقق إن اللي بيلعب هو دوره
    if (m.sender !== currentPlayer && !isOwner) {
        await m.reply(`❌ *مش دورك يا وحش!*\nالدور على: @${currentPlayer.split('@')[0]}`, null, { mentions: [currentPlayer] })
        return true
    }

    // تحقق إن الخانة فاضية
    if (game.board[index]) {
        await m.reply('❌ *الخانة دي متلعية بالفعل!*\nاختار خانة تانية.')
        return true
    }

    // نفّذ الحركة
    game.board[index] = currentSymbol
    const result = checkWinner(game.board)

    if (result) {
        game.status = 'finished'
        game.winner = result.winner
        game.winLine = result.line
        game.finishedAt = Date.now()
        if (result.winner === 'draw') {
            recordResult(game.players.X.jid, 'draws')
            recordResult(game.players.O.jid, 'draws')
        } else {
            const loserSym = result.winner === 'X' ? 'O' : 'X'
            recordResult(game.players[result.winner].jid, 'wins')
            recordResult(game.players[loserSym].jid, 'losses')
        }
        saveGames(games)

        let t
        if (result.winner === 'draw') {
            t = `*~❍━═══━⚞🤝━═══━❍~*\n│┊🤝 *تعادل!* اللعبة خلصت من غير فائز\n*~❍━═══━⚞🤝━═══━❍~*`
        } else {
            const winnerJid = game.players[result.winner].jid
            t = `*~❍━═══━⚞🏆━═══━❍~*\n│┊🏆 *الفائز:* @${winnerJid.split('@')[0]}!\n│┊✨ نتيجة أسطورية تستاهل الاحتفال\n*~❍━═══━⚞🏆━═══━❍~*`
        }
        game.mentions = [game.players.X.jid, game.players.O.jid]
        await sendXOMessage(conn, m, game, t)
        return true
    }

    // بدّل الدور
    game.turn = currentSymbol === 'X' ? 'O' : 'X'
    saveGames(games)

    const nextPlayer = game.players[game.turn].jid
    const caption = `*~❍━═══━⚞🎮━═══━❍~*\n` +
        `│┊🎯 الدور على: @${nextPlayer.split('@')[0]}\n` +
        `│┊${game.turn === 'X' ? '❌' : '⭕'} اختار خانتك من الأزرار\n*~❍━═══━⚞🎮━═══━❍~*`
    game.mentions = [nextPlayer]
    await sendXOMessage(conn, m, game, caption)

    // لو الدور على البوت AI، يلعب تلقائياً
    if (game.isAI && game.turn === 'O' && game.status === 'playing') {
        await new Promise(r => setTimeout(r, 1200))
        try {
            const aiIdx = aiMove(game.board, 'O', 'X')
            if (aiIdx !== undefined) {
                game.board[aiIdx] = 'O'
                const aiResult = checkWinner(game.board)
                if (aiResult) {
                    game.status = 'finished'
                    game.winner = aiResult.winner
                    game.winLine = aiResult.line
                    game.finishedAt = Date.now()
                    if (aiResult.winner === 'draw') {
                        recordResult(game.players.X.jid, 'draws')
                        recordResult(game.players.O.jid, 'draws')
                    } else {
                        recordResult(game.players[aiResult.winner].jid, 'wins')
                        const loserSym = aiResult.winner === 'X' ? 'O' : 'X'
                        recordResult(game.players[loserSym].jid, 'losses')
                    }
                    saveGames(games)
                    let t
                    if (aiResult.winner === 'draw') {
                        t = `*~❍━═══━⚞🤝━═══━❍~*\n│┊🤝 *تعادل!* سوكونا AI اعترف بقوتك!\n*~❍━═══━⚞🤝━═══━❍~*`
                    } else {
                        t = `*~❍━═══━⚞👹━═══━❍~*\n│┊👹 *سوكونا AI فاز عليك!*\n│┊💀 حاول تاني يا محارب\n*~❍━═══━⚞👹━═══━❍~*`
                    }
                    game.mentions = [game.players.X.jid]
                    await sendXOMessage(conn, m, game, t)
                } else {
                    game.turn = 'X'
                    saveGames(games)
                    const t = `*~❍━═══━⚞🤖━═══━❍~*\n` +
                        `│┊🤖 سوكونا AI لعب في الخانة ${aiIdx + 1}\n` +
                        `│┊🎯 دورك دلوقتي @${game.players.X.jid.split('@')[0]}\n*~❍━═══━⚞🤖━═══━❍~*`
                    game.mentions = [game.players.X.jid]
                    await sendXOMessage(conn, m, game, t)
                }
            }
        } catch (e) { console.error('AI move error:', e) }
    }

    return true
}

handler.help = ['', '@منشن', 'stats', 'top', 'resign']
handler.tags = ['games']
handler.command = ['xo', 'اكس', 'xo_stats', 'xo_top', 'xo_resign', 'xo_help']
handler.description = 'لعبة XO حقيقية مع Multiplayer + ذكاء اصطناعي ذكي، محفوظة في سيرفر البوت.'

export default handler