/*
 * ═══════════════════════════════════════════════════════
 * 🔥 SUKUNA WEAPONS SURVIVAL | لعبة بقاء الأسلحة والزومبي
 * ═══════════════════════════════════════════════════════
 * 👑 المطور: آدم (شادو) | Adam (Shadow)
 * 🤖 البوت: سوكونا | Sukuna Bot
 * 🏷️ الحقوق: ${global.author}
 * ═══════════════════════════════════════════════════════
 */

const handler = async (m, { conn }) => {
await m.react('🔥')
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
              messageText: "🔥 سوكونا: ساحة المعركة والأسلحة"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "7b218bcf-de37-4fad-a30c-01524776e39c",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:10px\">\n<div style=\"background:rgba(18,8,8,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,50,50,.4);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(255,0,0,.3)\">\n<div style=\"padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.5px;color:#ff3838;font-weight:bold\">SUKUNA BATTLEFIELD</div><div style=\"font-size:18px;font-weight:bold;color:#fff\">🔥 ساحة القتال والأسلحة</div></div>\n<div style=\"text-align:right\"><div id=\"sc\" style=\"font-size:18px;font-weight:bold;color:#ff3838;text-shadow:0 0 10px rgba(255,56,56,.8)\">النقاط: 0</div><div id=\"hp\" style=\"font-size:11px;color:#2ecc71;margin-top:2px;font-weight:bold\">الدم: 100 / 100</div></div>\n</div>\n<div style=\"padding:12px\">\n<canvas id=\"g\" width=\"360\" height=\"400\" style=\"width:100%;height:auto;background:linear-gradient(#140505,#0a0303);border:1px solid rgba(255,0,0,.3);border-radius:12px;display:block\"></canvas>\n<div style=\"display:flex;justify-content:space-between;margin-top:10px;gap:8px\">\n<button id=\"btnL\" style=\"flex:1;background:linear-gradient(135deg,#8b0000,#ff3838);border:none;border-radius:10px;color:#fff;font-size:18px;font-weight:bold;padding:12px;box-shadow:0 4px 12px rgba(255,0,0,.3);cursor:pointer\">◀ يسار</button>\n<button id=\"btnS\" style=\"flex:1.2;background:linear-gradient(135deg,#b71540,#e84118);border:none;border-radius:10px;color:#fff;font-size:18px;font-weight:bold;padding:12px;box-shadow:0 4px 12px rgba(232,65,24,.4);cursor:pointer\">⚡ إطلاق نار!</button>\n<button id=\"btnR\" style=\"flex:1;background:linear-gradient(135deg,#8b0000,#ff3838);border:none;border-radius:10px;color:#fff;font-size:18px;font-weight:bold;padding:12px;box-shadow:0 4px 12px rgba(255,0,0,.3);cursor:pointer\">يمين ▶</button>\n</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height;\nlet player,bullets,enemies,score,hp,alive,frame;\nlet keys={left:false,right:false,shoot:false};\nfunction reset(){\n  player={x:W/2-16,y:H-50,w:32,h:32,speed:5};\n  bullets=[];\n  enemies=[];\n  score=0;\n  hp=100;\n  alive=true;\n  frame=0;\n  document.getElementById('sc').textContent='النقاط: 0';\n  document.getElementById('hp').textContent='الدم: 100 / 100';\n}\n\n// أزرار التحكم\nconst bL=document.getElementById('btnL'), bR=document.getElementById('btnR'), bS=document.getElementById('btnS');\nbL.addEventListener('pointerdown',e=>{e.preventDefault();keys.left=true;});\nbL.addEventListener('pointerup',e=>{e.preventDefault();keys.left=false;});\nbL.addEventListener('pointerleave',e=>{keys.left=false;});\n\nbR.addEventListener('pointerdown',e=>{e.preventDefault();keys.right=true;});\nbR.addEventListener('pointerup',e=>{e.preventDefault();keys.right=false;});\nbR.addEventListener('pointerleave',e=>{keys.right=false;});\n\nbS.addEventListener('pointerdown',e=>{e.preventDefault();shoot();});\n\nfunction shoot(){\n  if(!alive){reset();return;}\n  bullets.push({x:player.x+player.w/2-3,y:player.y,w:6,h:14,v:8});\n}\n\nfunction drawSukuna(p){\n  x.save();\n  x.translate(p.x, p.y);\n  // هالة ملك اللعنات الحمراء\n  x.shadowColor='#ff3838';x.shadowBlur=12;\n  x.fillStyle='#111';x.beginPath();x.arc(16, 16, 15, 0, Math.PI*2);x.fill();\n  x.shadowBlur=0;\n  \n  // الشعر الشوكي الأسود\n  x.fillStyle='#111';\n  x.beginPath();\n  x.moveTo(6, 6);x.lineTo(16, -4);x.lineTo(26, 6);\n  x.lineTo(22, 14);x.lineTo(10, 14);\n  x.closePath();x.fill();\n  x.strokeStyle='#ff3838';x.lineWidth=1.5;x.stroke();\n\n  // الوشم الأحمر والعين الشريرة\n  x.strokeStyle='#ff3838';x.lineWidth=1.5;\n  x.beginPath();x.moveTo(8, 9);x.lineTo(24, 9);x.stroke();\n  x.fillStyle='#f1c40f';x.fillRect(11, 11, 4, 3);x.fillRect(17, 11, 4, 3);\n\n  // السلاح الأسطوري في اليد\n  x.fillStyle='#e84118';\n  x.fillRect(22, 18, 14, 6);\n  x.restore();\n}\n\nfunction drawEnemy(e){\n  x.save();\n  x.translate(e.x, e.y);\n  // شكل اللعنة أو العدو\n  x.fillStyle='#8b0000';\n  x.beginPath();x.arc(e.w/2, e.h/2, e.w/2, 0, Math.PI*2);x.fill();\n  x.strokeStyle='#ff3838';x.lineWidth=2;x.stroke();\n  // عيون العدو المخيفة\n  x.fillStyle='#fff';\n  x.fillRect(6, 8, 4, 4);\n  x.fillRect(14, 8, 4, 4);\n  x.restore();\n}\n\nfunction draw(){\n  x.fillStyle='#0a0303';x.fillRect(0,0,W,H);\n\n  // خطوط أرض المعركة\n  x.strokeStyle='rgba(255,0,0,.08)';\n  for(let i=0;i<W;i+=30){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke();}\n\n  // رسم الرصاص\n  x.fillStyle='#00d2ff';\n  bullets.forEach(b=>{\n    x.shadowColor='#00d2ff';x.shadowBlur=8;\n    x.beginPath();x.roundRect(b.x,b.y,b.w,b.h,3);x.fill();\n    x.shadowBlur=0;\n  });\n\n  // رسم الأعداء\n  enemies.forEach(en=>drawEnemy(en));\n\n  // رسم اللاعب\n  drawSukuna(player);\n\n  // شاشة الخسارة\n  if(!alive){\n    x.fillStyle='rgba(10,3,3,.9)';x.fillRect(0,0,W,H);\n    x.fillStyle='#ff3838';x.font='bold 26px Arial';x.textAlign='center';\n    x.shadowColor='#ff3838';x.shadowBlur=15;\n    x.fillText('انتهت المعركة!',W/2,H/2-25);\n    x.shadowBlur=0;\n    x.fillStyle='#fff';x.font='16px Arial';\n    x.fillText('النقاط التي جمعتها: '+score,W/2,H/2+10);\n    x.font='13px Arial';x.fillStyle='rgba(255,255,255,.6)';\n    x.fillText('اضغط على \"إطلاق نار\" للبدء من جديد',W/2,H/2+45);\n    x.textAlign='left';\n  }\n}\n\nfunction loop(){\n  frame++;\n  if(alive){\n    // حركة اللاعب\n    if(keys.left) player.x -= player.speed;\n    if(keys.right) player.x += player.speed;\n    if(player.x < 0) player.x = 0;\n    if(player.x > W - player.w) player.x = W - player.w;\n\n    // توليد الأعداء تلقائياً\n    if(frame % 45 === 0){\n      enemies.push({\n        x: Math.random() * (W - 32),\n        y: -30,\n        w: 30,\n        h: 30,\n        speed: 1.8 + Math.random() * 1.2\n      });\n    }\n\n    // حركة الرصاص\n    bullets.forEach(b=>{\n      b.y -= b.v;\n    });\n    bullets = bullets.filter(b => b.y > -20);\n\n    // حركة الأعداء\n    enemies.forEach(en=>{\n      en.y += en.speed;\n      // اصطدام العدو باللاعب\n      if(en.x < player.x + player.w && en.x + en.w > player.x &&\n         en.y < player.y + player.h && en.y + en.h > player.y){\n        hp -= 20;\n        en.y = H + 100; // إزالة العدو\n        document.getElementById('hp').textContent = 'الدم: '+Math.max(0, hp)+' / 100';\n        if(hp <= 0) {\n          alive = false;\n        }\n      }\n    });\n\n    // اصطدام الرصاص بالأعداء\n    bullets.forEach(b=>{\n      enemies.forEach(en=>{\n        if(b.x < en.x + en.w && b.x + b.w > en.x &&\n           b.y < en.y + en.h && b.y + b.h > en.y){\n          b.y = -50; // حذف الرصاصة\n          en.y = H + 100; // حذف العدو\n          score += 100;\n          document.getElementById('sc').textContent = 'النقاط: '+score;\n        }\n      });\n    });\n\n    enemies = enemies.filter(en => en.y < H + 50);\n  }\n  draw();\n  requestAnimationFrame(loop);\n}\nreset();\nrequestAnimationFrame(loop);\n})();\n</script>\n</body>",
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

handler.command = ['سلاح', 'weapons', 'قتال']
export default handler