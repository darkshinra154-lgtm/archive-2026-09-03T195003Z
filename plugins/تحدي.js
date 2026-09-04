/*
 * ═══════════════════════════════════════════════════════
 * ⚡ SUKUNA: REFLEX ARENA | لعبة تحدي السرعة والتفاعل
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا الملك | Sukuna Bot
 * 🏷️ الحقوق: ${global.author}
 * ═══════════════════════════════════════════════════════
 */

const handler = async (m, { conn }) => {
await m.react('⚡')
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
              messageText: "⚡ تحدي السرعة الملكي: من هو الأسرع؟"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "7a318bcf-de37-4fad-a30c-01524776e99c",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:8px\">\n<div style=\"background:rgba(10,10,20,.98);backdrop-filter:blur(16px);border:1px solid rgba(0,255,204,.4);border-radius:16px;overflow:hidden;box-shadow:0 10px 35px rgba(0,255,204,.2)\">\n<div style=\"padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.5px;color:#00ffcc;font-weight:bold\">SUKUNA REFLEX ARENA</div><div style=\"font-size:17px;font-weight:bold;color:#fff\">⚡ تحدي سرعة اللمس والتركيز</div></div>\n<div style=\"text-align:right\"><div id=\"sc\" style=\"font-size:17px;font-weight:bold;color:#00ffcc\">النقاط: 0</div><div id=\"tm\" style=\"font-size:11px;color:#ff3333;font-weight:bold\">الوقت: 20 ثانية</div></div>\n</div>\n<div style=\"padding:15px;text-align:center\">\n<canvas id=\"g\" width=\"340\" height=\"300\" style=\"width:100%;height:auto;background:radial-gradient(circle,#111122,#05050b);border:1px solid rgba(0,255,204,.3);border-radius:12px;display:block;margin:auto;cursor:pointer\"></canvas>\n<div style=\"margin-top:12px;color:rgba(255,255,255,.7);font-size:13px\" id=\"hint\">اضغط على الدوائر المضيئة بأسرع ما يمكنك!</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height;\nlet score=0, timeLeft=20, playing=false, timer=null;\nlet target={x:0, y:0, r:28, active:false, color:'#00ffcc'};\n\nfunction spawnTarget(){\n  target.x = 40 + Math.random() * (W - 80);\n  target.y = 40 + Math.random() * (H - 80);\n  target.active = true;\n  target.color = Math.random() > 0.5 ? '#00ffcc' : '#ff3333';\n  draw();\n}\n\nfunction start(){\n  score=0;\n  timeLeft=20;\n  playing=true;\n  document.getElementById('sc').textContent='النقاط: 0';\n  document.getElementById('hint').textContent='أسرع! اضغط على الأهداف قبل انتهاء الوقت';\n  \n  if(timer) clearInterval(timer);\n  timer = setInterval(()=>{\n    timeLeft--;\n    document.getElementById('tm').textContent='الوقت: '+timeLeft+' ثانية';\n    if(timeLeft<=0){\n      clearInterval(timer);\n      playing=false;\n      drawGameOver();\n    }\n  }, 1000);\n  spawnTarget();\n}\n\nfunction draw(){\n  x.fillStyle='#05050b';\n  x.fillRect(0,0,W,H);\n\n  if(!playing && timeLeft===20){\n    // شاشة البداية\n    x.fillStyle='#00ffcc';x.font='bold 22px Arial';x.textAlign='center';\n    x.shadowColor='#00ffcc';x.shadowBlur=12;\n    x.fillText('⚡ تحدي سرعة الرد ⚡',W/2,H/2-30);\n    x.shadowBlur=0;\n    x.fillStyle='#fff';x.font='15px Arial';\n    x.fillText('اضغط هنا لبدء التحدي',W/2,H/2+15);\n    x.textAlign='left';\n    return;\n  }\n\n  if(playing && target.active){\n    x.save();\n    x.shadowColor=target.color;\n    x.shadowBlur=20;\n    x.fillStyle=target.color;\n    x.beginPath();\n    x.arc(target.x, target.y, target.r, 0, Math.PI*2);\n    x.fill();\n    // نواة الدائرة الداخلية\n    x.fillStyle='#fff';\n    x.beginPath();\n    x.arc(target.x, target.y, target.r/3, 0, Math.PI*2);\n    x.fill();\n    x.restore();\n  }\n}\n\nfunction drawGameOver(){\n  x.fillStyle='rgba(5,5,11,.95)';\n  x.fillRect(0,0,W,H);\n  x.fillStyle='#ff3333';x.font='bold 22px Arial';x.textAlign='center';\n  x.shadowColor='#ff3333';x.shadowBlur=15;\n  x.fillText('انتهى الوقت!',W/2,H/2-30);\n  x.shadowBlur=0;\n  x.fillStyle='#fff';x.font='18px Arial';\n  x.fillText('نقاطك المحققة: '+score,W/2,H/2+10);\n  x.font='13px Arial';x.fillStyle='rgba(255,255,255,.6)';\n  x.fillText('اضغط هنا لإعادة المحاولة وتحدي أصحابك',W/2,H/2+40);\n  document.getElementById('hint').textContent='انتهى التحدي! شارك صورتك في الجروب لتثبت أنك الأسرع.';\n  x.textAlign='left';\n}\n\nc.addEventListener('pointerdown',e=>{\n  const rect=c.getBoundingClientRect();\n  const scaleX=W/rect.width;\n  const scaleY=H/rect.height;\n  const clickX=(e.clientX-rect.left)*scaleX;\n  const clickY=(e.clientY-rect.top)*scaleY;\n\n  if(!playing){\n    start();\n    return;\n  }\n\n  if(target.active){\n    const dist=Math.hypot(clickX-target.x, clickY-target.y);\n    if(dist<=target.r+10){\n      score += target.color==='#ff3333' ? 200 : 100; // الأهداف الحمراء تعطي نقاط مضاعفة!\n      document.getElementById('sc').textContent='النقاط: '+score;\n      spawnTarget();\n    }\n  }\n});\n\ndraw();\n})();\n</script>\n</body>",
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

handler.command = ['تحدي', 'سرعة', 'reflex']
export default handler