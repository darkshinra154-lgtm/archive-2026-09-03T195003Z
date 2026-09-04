/*
 * ═══════════════════════════════════════════════════════
 * 🌌 GOJO INFINITY JUMP | لعبة صعود جوجو الأسطورية
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا & جوجو | Anime Bots
 * 🏷️ الحقوق: ${global.author}
 * ═══════════════════════════════════════════════════════
 */

const handler = async (m, { conn }) => {
await m.react('🌌')
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
              messageText: "🌌 جوجو: اللانهاية — اضغط للقفز والصعود"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "9f318bcf-de37-4fad-a30c-01524776e28b",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:14px\">\n<div style=\"background:rgba(10,15,35,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(0,150,255,.3);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,100,255,.25)\">\n<div style=\"padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.4px;color:#00d2ff\">GOJO INFINITY</div><div style=\"font-size:20px;font-weight:bold;color:#fff\">🌌 صعود جوجو</div></div>\n<div style=\"text-align:right\"><div id=\"sc\" style=\"font-size:18px;font-weight:bold;color:#00d2ff;text-shadow:0 0 10px rgba(0,210,255,.7)\">0</div><div id=\"bs\" style=\"font-size:10px;color:rgba(255,255,255,.4);margin-top:2px\">أقصى ارتفاع: 0</div></div>\n</div>\n<div style=\"padding:14px\">\n<canvas id=\"g\" width=\"360\" height=\"480\" style=\"width:100%;height:auto;background:linear-gradient(#050814,#101a35);border:1px solid rgba(0,150,255,.2);border-radius:12px;display:block\"></canvas>\n<div id=\"st\" style=\"text-align:center;margin-top:10px;font-size:12px;color:rgba(255,255,255,.6)\">اسحب يميناً ويساراً للحركة · القفز تلقائي على المنصات</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height;\nlet player,platforms,score,best=0,alive,cameraY,touchX;\nfunction loadB(){try{return parseInt(localStorage.getItem('gojo_best')||'0',10)||0}catch(e){return 0}}\nfunction saveB(v){try{localStorage.setItem('gojo_best',String(v))}catch(e){}}\nbest=loadB();document.getElementById('bs').textContent='أقصى ارتفاع: '+best;\nfunction reset(){\n  player={x:W/2,y:H-100,w:28,h:28,vx:0,vy:-10};\n  platforms=[];\n  for(let i=0;i<7;i++){\n    platforms.push({x:Math.random()*(W-60),y:H-70*i-50,w:60,v:Math.random()>0.7?1.5:0,dir:1});\n  }\n  score=0;alive=true;cameraY=0;\n  document.getElementById('sc').textContent='0';\n  document.getElementById('st').textContent='استمر في الصعود نحو اللانهاية';\n}\nc.addEventListener('pointermove',e=>{\n  const rect=c.getBoundingClientRect();\n  const clientX=e.clientX-rect.left;\n  touchX=clientX*(W/rect.width);\n});\nfunction drawGojo(p){\n  x.save();\n  x.translate(p.x, p.y);\n  // تأثير هالة اللانهاية (دائرة طاقة شفافة زرقاء حوله)\n  x.fillStyle='rgba(0,150,255,.15)';\n  x.beginPath();x.arc(14, 14, 24, 0, Math.PI*2);x.fill();\n  \n  // رأس جوجو وشعره الأبيض المميز\n  x.fillStyle='#fff';\n  x.beginPath();\n  x.arc(14, 12, 12, 0, Math.PI*2);\n  x.fill();\n  \n  // الشعر الشوكي الأبيض\n  x.beginPath();\n  x.moveTo(2, 6); x.lineTo(14, -4); x.lineTo(26, 6);\n  x.lineTo(22, 14); x.lineTo(6, 14);\n  x.closePath();\n  x.fill();\n\n  // عصابة العين السوداء الشهيرة لجوجو\n  x.fillStyle='#111';\n  x.fillRect(5, 8, 18, 5);\n\n  x.restore();\n}\nfunction draw(){\n  const bg=x.createLinearGradient(0,0,0,H);\n  bg.addColorStop(0,'#050b1a');bg.addColorStop(1,'#121f3a');\n  x.fillStyle=bg;x.fillRect(0,0,W,H);\n  \n  // رسم المنصات (طاقة ملعونة مضيئة)\n  platforms.forEach(p=>{\n    const py=p.y-cameraY;\n    const grd=x.createLinearGradient(p.x,py,p.x+p.w,py);\n    grd.addColorStop(0,'#00d2ff');grd.addColorStop(1,'#3a7bd5');\n    x.fillStyle=grd;\n    x.beginPath();x.roundRect(p.x,py,p.w,10,5);x.fill();\n  });\n\n  // رسم اللاعب\n  drawGojo({x:player.x, y:player.y-cameraY});\n}\nfunction loop(){\n  if(alive){\n    if(touchX!==undefined){\n      let targetVx=(touchX-player.x)*0.15;\n      player.vx=player.vx*0.7+targetVx*0.3;\n    }\n    player.x+=player.vx;\n    if(player.x<-15)player.x=W;\n    if(player.x>W)player.x=-15;\n\n    player.vy+=0.35; // الجاذبية\n    player.y+=player.vy;\n\n    // حركة المنصات المتحركة\n    platforms.forEach(p=>{\n      if(p.v>0){\n        p.x+=p.v*p.dir;\n        if(p.x<0||p.x+p.w>W)p.dir*=-1;\n      }\n    });\n\n    // فحص الاصطدام بالمنصات والقفز التلقائي\n    if(player.vy>0){\n      platforms.forEach(p=>{\n        if(player.x+player.w>p.x && player.x<p.x+p.w &&\n           player.y+player.h>=p.y-cameraY && player.y+player.h<=p.y-cameraY+14){\n          player.vy=-9.5;\n        }\n      });\n    }\n\n    // تتبع الكاميرا للأعلى\n    if(player.y-cameraY < H/2.5){\n      let diff=(H/2.5)-(player.y-cameraY);\n      cameraY-=diff;\n      score+=Math.floor(diff);\n      document.getElementById('sc').textContent=String(score);\n\n      if(score>best){best=score;saveB(best);document.getElementById('bs').textContent='أقصى ارتفاع: '+best}\n    }\n\n    // توليد منصات جديدة بالأعلى وإزالة القديمة بالأسفل\n    if(platforms[0].y-cameraY > H+50){\n      platforms.shift();\n      let topP=platforms[platforms.length-1];\n      platforms.push({\n        x:Math.random()*(W-60),\n        y:topP.y-65-Math.random()*20,\n        w:55,\n        v:score>1500 && Math.random()>0.5?1.8:0,\n        dir:1\n      });\n    }\n\n    // السقوط ونهاية اللعبة\n    if(player.y-cameraY > H+40){\n      alive=false;\n      document.getElementById('st').textContent='سقطت في الهاوية · اضغط لتكرار الصعود';\n    }\n  } else {\n    if(touchX!==undefined) {\n      reset();\n    }\n  }\n  draw();\n  requestAnimationFrame(loop);\n}\nreset();\nrequestAnimationFrame(loop);\n})();\n</script>\n</body>",
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

handler.command = ['غوجو', 'gojo', 'صعود']
export default handler