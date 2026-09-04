import similarity from 'similarity'
const threshold = 0.72

export async function before(m) {
    let conn = this
    conn.tebakAin = conn.tebakAin ? conn.tebakAin : {}
    let id = m.chat
    if (!(id in conn.tebakAin)) return !0

    let game = conn.tebakAin[id]
    if (!m.quoted || m.quoted.id !== game.msg.key.id) return !0

    let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(game.timeout)
        delete conn.tebakAin[id]
        return conn.reply(m.chat, '*طلع فاشل و استسلم :( !*', m)
    }
    let json = game.json
    if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += game.poin
        conn.reply(m.chat, `*❐┃اجـابـة صـحـيـحـة┃✅ ❯*\n\n*❐↞┇الـجـائـزة💰↞ ${game.poin} نقطه*`, m)
        clearTimeout(game.timeout)
        delete conn.tebakAin[id]
    } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) {
        m.reply(`*لقد كنت على وشك النجاح*!`)
    } else {
        conn.reply(m.chat, `❐┃اجـابـة خـاطـئـة┃❌ ❯`, m)
    }
    return !0
}

export const exp = 0