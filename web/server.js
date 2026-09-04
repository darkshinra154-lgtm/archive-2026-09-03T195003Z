/**
═══════════════════════════════════════════════════════
🧩 Plugin: server.js
📂 Category: Web / Dashboard
🤖 Bot: ${global.botname}
👑 Developer: آدم (Shadow)
🏷️ Rights: ${global.author}
📜 Description: تشغيل موقع التنصيب ولوحة الجلسات
═══════════════════════════════════════════════════════
*/

import express from 'express'
import http from 'http'
import path from 'path'
import { Server as SocketIOServer } from 'socket.io'

export function startWebServer({
  sessionManager,
  publicDir = process.cwd(),
  port = process.env.PORT || 3000
} = {}) {
  const app = express()
  const server = http.createServer(app)
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*'
    },
    transports: ['websocket', 'polling']
  })

  sessionManager.setIO(io)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(publicDir))

  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      bot: globalThis.botname || 'Sukuna Bot',
      sessions: sessionManager.getActiveSockets().length
    })
  })

  io.on('connection', socket => {
    socket.authenticated = false

    socket.on('admin-auth', password => {
      const adminPass = process.env.ADMIN_PASSWORD || globalThis.adminPassword || 'change_me'
      if (password === adminPass) {
        socket.authenticated = true
        socket.emit('admin-auth-success')
      } else {
        socket.emit('admin-auth-fail')
      }
    })

    socket.on('set-user', userId => {
      sessionManager.setWebSocket(userId, socket.id)
    })

    socket.on('pair-request', async ({ userId, number }) => {
      try {
        const id = userId || `web_${socket.id}`
        const session = sessionManager.createSession(id)
        session.webSocketId = socket.id
        session.tgChatId = null
        await session.initialize(number)
      } catch (e) {
        socket.emit('console', {
          timestamp: new Date().toLocaleTimeString(),
          message: `Pair error: ${e.message}`,
          type: 'error'
        })
      }
    })

    socket.on('broadcast', async ({ message }) => {
      if (!socket.authenticated) {
        socket.emit('broadcast-error', 'Unauthorized')
        return
      }

      const active = sessionManager.getActiveSockets()
      let totalSent = 0
      let totalChats = 0

      for (const { sock } of active) {
        try {
          const chats = Object.keys(sock.chats || {}).filter(jid =>
            jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')
          )

          totalChats += chats.length

          for (const jid of chats) {
            try {
              await sock.sendMessage(jid, {
                text: `
⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰

📢 *رسالة جماعية*

${message}

🤖 ${globalThis.botname || 'Sukuna Bot'}
⊱⊹•─๋︩︪═╾═─•┈⧽┊🎭┊⧼┈•─═╼═─๋︩︪•⊹⊰
`.trim()
              })
              totalSent++
            } catch {}
          }
        } catch {}
      }

      socket.emit('broadcast-result', {
        totalSent,
        totalChats,
        totalBots: active.length
      })
    })

    socket.on('stop-bot', async ({ sessionId }) => {
      if (!socket.authenticated) return

      const ok = await sessionManager.clearSession(sessionId)
      socket.emit('bot-stopped', {
        sessionId,
        success: ok
      })
    })

    socket.on('stop-all-bots', async () => {
      if (!socket.authenticated) return

      const ids = [...sessionManager.sessions.keys()]
      let stopped = 0

      for (const id of ids) {
        const ok = await sessionManager.clearSession(id)
        if (ok) stopped++
      }

      socket.emit('all-bots-stopped', { stopped })
    })

    socket.on('get-bots-list', () => {
      if (!socket.authenticated) return

      const bots = []

      for (const session of sessionManager.sessions.values()) {
        if (session.sock?.user || session.isConnected) {
          bots.push({
            sessionId: session.userId,
            phoneNumber: session.phoneNumber || 'Unknown',
            isConnected: session.isConnected,
            userName: session.userId
          })
        }
      }

      socket.emit('bots-list', bots)
    })

    socket.on('disconnect', () => {
      for (const session of sessionManager.sessions.values()) {
        if (session.webSocketId === socket.id) {
          session.webSocketId = null
        }
      }
    })
  })

  server.listen(port, () => {
    console.log(`🌐 Web Dashboard: http://localhost:${port}`)
  })

  return io
}