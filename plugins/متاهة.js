/*
 * ═══════════════════════════════════════════════════════
 * 🧩 SUKUNA LABYRINTH | لعبة متاهة سوكونا المرعبة
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna Bot
 * 🏷️ الحقوق: ${global.author}
 * ═══════════════════════════════════════════════════════
 */

const handler = async (m, { conn }) => {
await m.react('🧩')
 conn.relayMessage(
  m.chat,
  {
    senderKeyDistributionMessage: {
      groupId: "120363411834515372@g.us",
      axolotlSenderKeyDistributionMessage: "Mwj3rbmnBRCzARogxgeWQyTAKtFV+P7a72mU82AyzJutjpwyMSHp4PvNz30iIQWFSbdsQPjmiZ503uSvukftuvqRFTzQ35TDmOilH4cWQA=="
    },
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        messageDisclaimerText: "",
        botResponseId: "90ab3989-9597-4bde-9593-4786925f1c97",
        verificationMetadata: {
          proofs: [
            {
              version: 1,
              useCase: 1,
              signature: "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==",
              certificateChain: [
                "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg",
                "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ=="
              ]
            }
          ]
        }
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [
            {
              messageType: 2,
              messageText: "🧩 سوكونا: متاهة اللعנות المظلمة"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "8c318bcf-de37-4fad-a30c-01524776e40d",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:10px\">\n<div style=\"background:rgba(12,12,20,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,56,56,.4);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(255,0,0,.25)\">\n<div style=\"padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.5px;color:#ff3838;font-weight:bold\">SUKUNA LABYRINTH</div><div style=\"font-size:18px;font-weight:bold;color:#fff\">🧩 متاهة اللعنات المظلمة</div></div>\n<div style=\"text-align:right\"><div id=\"lvl\" style=\"font-size:18px;font-weight:bold;color:#ff3838;text-shadow:0 0 10px rgba(255,56,56,.8)\">المرحلة: 1</div><div id=\"st\" style=\"font-size:11px;color:rgba(255,255,255,.5);margin-top:2px\">جد طريقك إلى البوابة الحمراء!</div></div>\n</div>\n<div style=\"padding:12px\">\n<canvas id=\"g\" width=\"360\" height=\"360\" style=\"width:100%;height:auto;background:#05050a;border:1px solid rgba(255,0,0,.3);border-radius:12px;display:block;margin:auto\"></canvas>\n<div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;max-width:220px;margin-left:auto;margin-right:auto\">\n<div></div>\n<button id=\"u\" style=\"background:linear-gradient(135deg,#333,#555);border:none;border-radius:10px;color:#fff;font-size:20px;padding:12px;cursor:pointer\">⬆️</button>\n<div></div>\n<button id=\"l\" style=\"background:linear-gradient(135deg,#333,#555);border:none;border-radius:10px;color:#fff;font-size:20px;padding:12px;cursor:pointer\">⬅️</button>\n<button id=\"d\" style=\"background:linear-gradient(135deg,#333,#555);border:none;border-radius:10px;color:#fff;font-size:20px;padding:12px;cursor:pointer\">⬇️</button>\n<button id=\"r\" style=\"background:linear-gradient(135deg,#333,#555);border:none;border-radius:10px;color:#fff;font-size:20px;padding:12px;cursor:pointer\">➡️</button>\n</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height;\nlet cols=15,rows=15,cell=W/cols;\nlet maze=[],player={r:1,c:1},goal={r:cols-2,c:rows-2},level=1;\n\nfunction genMaze(){\n  maze=Array(rows).fill().map(()=>Array(cols).fill(1));\n  function carve(r,c){\n    maze[r][c]=0;\n    let dirs=[[0,-2],[0,2],[-2,0],[2,0]].sort(()=>Math.random()-0.5);\n    for(let [dr,dc] of dirs){\n      let nr=r+dr, nc=c+dc;\n      if(nr>0 && nr<rows-1 && nc>0 && nc<cols-1 && maze[nr][nc]===1){\n        maze[r+dr/2][c+dc/2]=0;\n        carve(nr,nc);\n      }\n    }\n  }\n  carve(1,1);\n  maze[rows-2][cols-2]=0;\n  maze[rows-2][cols-3]=0;\n}\n\nfunction init(){\n  genMaze();\n  player={r:1,c:1};\n  goal={r:rows-2,c:cols-2};\n  draw();\n}\n\nfunction move(dr,dc){\n  let nr=player.r+dr, nc=player.c+dc;\n  if(nr>=0 && nr<rows && nc>=0 && nc<cols && maze[nr][nc]===0){\n    player.r=nr; player.c=nc;\n    if(player.r===goal.r && player.c===goal.c){\n      level++;\n      document.getElementById('lvl').textContent='المرحلة: '+level;\n      if(cols<21){cols+=2; rows+=2; cell=W/cols;}\n      init();\n      return;\n    }\n    draw();\n  }\n}\n\n// أزرار التحكم\ndocument.getElementById('u').addEventListener('pointerdown',e=>{e.preventDefault();move(-1,0);});\ndocument.getElementById('d').addEventListener('pointerdown',e=>{e.preventDefault();move(1,0);});\ndocument.getElementById('l').addEventListener('pointerdown',e=>{e.preventDefault();move(0,-1);});\ndocument.getElementById('r').addEventListener('pointerdown',e=>{e.preventDefault();move(0,1);});\n\n// كيبورد للكمبيوتر\ndocument.addEventListener('keydown',e=>{\n  if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();move(-1,0);}\n  if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();move(1,0);}\n  if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();move(0,-1);}\n  if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();move(0,1);}\n});\n\nfunction draw(){\n  x.fillStyle='#080812';\n  x.fillRect(0,0,W,H);\n\n  // رسم الجدران\n  for(let r=0;r<rows;r++){\n    for(let c=0;c<cols;c++){\n      if(maze[r][c]===1){\n        x.fillStyle='#1c1c2e';\n        x.fillRect(c*cell,r*cell,cell,cell);\n      }\n    }\n  }\n\n  // رسم البوابة (النهاية)\n  x.shadowColor='#ff3838'; x.shadowBlur=12;\n  x.fillStyle='#ff3838';\n  x.fillRect(goal.c*cell+2, goal.r*cell+2, cell-4, cell-4);\n  x.shadowBlur=0;\n\n  // رسم شخصية سوكونا (اللاعب)\n  x.shadowColor='#f1c40f'; x.shadowBlur=10;\n  x.fillStyle='#111';\n  x.beginPath();\n  x.arc(player.c*cell+cell/2, player.r*cell+cell/2, cell/2-2, 0, Math.PI*2);\n  x.fill();\n  x.strokeStyle='#ff3838'; x.lineWidth=2;\n  x.stroke();\n  x.shadowBlur=0;\n\n  // عيون سوكونا الصغيرة\n  x.fillStyle='#f1c40f';\n  let px=player.c*cell+cell/2, py=player.r*cell+cell/2;\n  x.fillRect(px-3, py-3, 2, 2);\n  x.fillRect(px+1, py-3, 2, 2);\n}\n\ninit();\n})();\n</script>\n</body>",
                      "trusted_sources": [
                        "nixel.dev",
                        "kangwifi.eu.org"
                      ]
                    },
                    "__typename": "GenAISingleLayoutViewModel"
                  }
                }
              ]
            })).toString('base64')
          },
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: {
              botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
          }
        }
      }
    }
  },
  {
    additionalNodes: [
      {
        tag: "biz",
        attrs: {
          actual_actors: "2",
          host_storage: "2",
          privacy_mode_ts: "1788095961"
        },
        content: [
          {
            tag: "interactive",
            attrs: {
              type: "native_flow",
              v: "1"
            },
            content: [
              {
                tag: "native_flow",
                attrs: {
                  v: "9",
                  name: "mixed"
                }
              }
            ]
          }
        ]
      }
    ]
  }
)
}

handler.command = ['متاهة', 'maze']
export default handler