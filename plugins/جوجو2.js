/*
 * ═══════════════════════════════════════════════════════
 * 🌌 GOJO INFINITY ARCADE | لعبة صعود جوجو مع أزرار تحكم
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
              messageText: "🌌 جوجو: اللانهاية — أزرار تحكم احترافية"
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
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:10px\">\n<div style=\"background:rgba(8,12,28,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,210,255,.4);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,150,255,.3)\">\n<div style=\"padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.5px;color:#00d2ff;font-weight:bold\">GOJO INFINITY ARCADE</div><div style=\"font-size:18px;font-weight:bold;color:#fff\">🌌 صعود جوجو الأسطوري</div></div>\n<div style=\"text-align:right\"><div id=\"sc\" style=\"font-size:18px;font-weight:bold;color:#00d2ff;text-shadow:0 0 10px rgba(0,210,255,.8)\">0</div><div id=\"bs\" style=\"font-size:10px;color:rgba(255,255,255,.4);margin-top:2px\">الرقم القياسي: 0</div></div>\n</div>\n<div style=\"padding:12px\">\n<canvas id=\"g\" width=\"360\" height=\"420\" style=\"width:100%;height:auto;background:linear-gradient(#030712,#0f172a);border:1px solid rgba(0,210,255,.3);border-radius:12px;display:block\"></canvas>\n<div style=\"display:flex;justify-content:space-between;margin-top:10px;gap:10px\">\n<button id=\"btnL\" style=\"flex:1;background:linear-gradient(135deg,#0072ff,#00c6ff);border:none;border-radius:12px;color:#fff;font-size:22px;font-weight:bold;padding:14px;box-shadow:0 4px 15px rgba(0,150,255,.4);cursor:pointer;active:scale(0.95)\">◀ يسار</button>\n<button id=\"btnR\" style=\"flex:1;background:linear-gradient(135deg,#0072ff,#00c6ff);border:none;border-radius:12px;color:#fff;font-size:22px;font-weight:bold;padding:14px;box-shadow:0 4px 15px rgba(0,150,255,.4);cursor:pointer;active:scale(0.95)\">يمين ▶</button>\n</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height;\nlet player,platforms,score,best=0,alive,cameraY;\nlet keys={left:false,right:false};\nfunction loadB(){try{return parseInt(localStorage.getItem('gojo_best_v2')||'0',10)||0}catch(e){return 0}}\nfunction saveB(v){try{localStorage.setItem('gojo_best_v2',String(v))}catch(e){}}\nbest=loadB();document.getElementById('bs').textContent='الرقم القياسي: '+best;\nfunction reset(){\n  player={x:W/2-14,y:H-80,w:28,h:28,vx:0,vy:-11};\n  platforms=[];\n  for(let i=0;i<8;i++){\n    platforms.push({x:Math.random()*(W-70),y:H-60*i-40,w:70,v:Math.random()>0.6?2:0,dir:1});\n  }\n  score=0;alive=true;cameraY=0;\n  document.getElementById('sc').textContent='0';\n}\n// أزرار التحكم باللمس\nconst bL=document.getElementById('btnL'), bR=document.getElementById('btnR');\nbL.addEventListener('pointerdown',e=>{e.preventDefault();keys.left=true;});\nbL.addEventListener('pointerup',e=>{e.preventDefault();keys.left=false;});\nbL.addEventListener('pointerleave',e=>{keys.left=false;});\n\nbR.addEventListener('pointerdown',e=>{e.preventDefault();keys.right=true;});\nbR.addEventListener('pointerup',e=>{e.preventDefault();keys.right=false;});\nbR.addEventListener('pointerleave',e=>{keys.right=false;});\n\n// تحكم الكيبورد للكمبيوتر\ndocument.addEventListener('keydown',e=>{if(e.code==='ArrowLeft')keys.left=true;if(e.code==='ArrowRight')keys.right=true;});\ndocument.addEventListener('keyup',e=>{if(e.code==='ArrowLeft')keys.left=false;if(e.code==='ArrowRight')keys.right=false;});\n\nfunction drawGojo(p){\n  x.save();\n  x.translate(p.x, p.y);\n  \n  // هالة اللانهاية (تأثير نيون فخم)\n  x.shadowColor='#00d2ff';\n  x.shadowBlur=15;\n  x.fillStyle='rgba(0,210,255,.2)';\n  x.beginPath();x.arc(14, 14, 18, 0, Math.PI*2);x.fill();\n  x.shadowBlur=0;\n\n  // زي جوجو الأسود الفخم\n  x.fillStyle='#0f172a';\n  x.beginPath();x.roundRect(4, 14, 20, 16, 6);x.fill();\n\n  // رأس جوجو\n  x.fillStyle='#fff';\n  x.beginPath();\n  x.arc(14, 12, 11, 0, Math.PI*2);\n  x.fill();\n  \n  // الشعر الشوكي الأبيض الأسطوري\n  x.fillStyle='#f8fafc';\n  x.beginPath();\n  x.moveTo(3, 8); x.lineTo(14, -3); x.lineTo(25, 8);\n  x.lineTo(21, 14); x.lineTo(7, 14);\n  x.closePath();\n  x.fill();\n\n  // عصابة العين السوداء المميزة\n  x.fillStyle='#020617';\n  x.fillRect(6, 9, 16, 4);\n\n  x.restore();\n}\n\nfunction draw(){\n  // خلفية فضائية عميقة وفخمة\n  const bg=x.createLinearGradient(0,0,0,H);\n  bg.addColorStop(0,'#020617');bg.addColorStop(1,'#0f172a');\n  x.fillStyle=bg;x.fillRect(0,0,W,H);\n\n  // شبكة خلفية تكنولوجية\n  x.strokeStyle='rgba(0,210,255,.03)';\n  x.lineWidth=1;\n  for(let i=0;i<W;i+=30){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke();}\n  for(let j=0;j<H;j+=30){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke();}\n  \n  // رسم المنصات (طاقة ملعونة متوهجة)\n  platforms.forEach(p=>{\n    const py=p.y-cameraY;\n    if(py>-30 && py<H+30){\n      x.shadowColor='#00d2ff';\n      x.shadowBlur=10;\n      const grd=x.createLinearGradient(p.x,py,p.x+p.w,py);\n      grd.addColorStop(0,'#0072ff');grd.addColorStop(1,'#00d2ff');\n      x.fillStyle=grd;\n      x.beginPath();x.roundRect(p.x,py,p.w,12,6);x.fill();\n      x.shadowBlur=0;\n    }\n  });\n\n  // رسم اللاعب\n  drawGojo({x:player.x, y:player.y-cameraY});\n\n  // شاشة الخسارة\n  if(!alive){\n    x.fillStyle='rgba(2,6,23,.85)';x.fillRect(0,0,W,H);\n    x.fillStyle='#00d2ff';x.font='bold 26px Arial';x.textAlign='center';\n    x.shadowColor='#00d2ff';x.shadowBlur=15;\n    x.fillText('انتهت اللعبة!',W/2,H/2-20);\n    x.shadowBlur=0;\n    x.fillStyle='#fff';x.font='16px Arial';\n    x.fillText('الارتفاع الذي حققته: '+score,W/2,H/2+15);\n    x.font='13px Arial';x.fillStyle='rgba(255,255,255,.6)';\n    x.fillText('اضغط على أحد الأزرار للعب مرة أخرى',W/2,H/2+45);\n    x.textAlign='left';\n  }\n}\n\nfunction loop(){\n  if(alive){\n    // نظام الحركة السلس بالأزرار\n    if(keys.left) player.vx = -5;\n    else if(keys.right) player.vx = 5;\n    else player.vx *= 0.8;\n\n    player.x += player.vx;\n    if(player.x < -15) player.x = W;\n    if(player.x > W) player.x = -15;\n\n    player.vy += 0.4; // الجاذبية\n    player.y += player.vy;\n\n    // حركة المنصات المتحركة\n    platforms.forEach(p=>{\n      if(p.v>0){\n        p.x += p.v * p.dir;\n        if(p.x < 0 || p.x + p.w > W) p.dir *= -1;\n      }\n    });\n\n    // فحص القفز على المنصات\n    if(player.vy > 0){\n      platforms.forEach(p=>{\n        if(player.x + player.w > p.x && player.x < p.x + p.w &&\n           player.y + player.h >= p.y - cameraY && player.y + player.h <= p.y - cameraY + 16){\n          player.vy = -11;\n        }\n      });\n    }\n\n    // تتبع الكاميرا ورفع النقاط\n    if(player.y - cameraY < H/2.5){\n      let diff = (H/2.5) - (player.y - cameraY);\n      cameraY -= diff;\n      score += Math.floor(diff);\n      document.getElementById('sc').textContent = String(score);\n\n      if(score > best) {\n        best = score;\n        saveB(best);\n        document.getElementById('bs').textContent = 'الرقم القياسي: '+best;\n      }\n    }\n\n    // تدوير المنصات وتوليد جديدة للأعلى\n    if(platforms[0].y - cameraY > H + 40){\n      platforms.shift();\n      let topP = platforms[platforms.length - 1];\n      platforms.push({\n        x: Math.random() * (W - 70),\n        y: topP.y - 65 - Math.random() * 20,\n        w: 65,\n        v: score > 1200 && Math.random() > 0.5 ? 2.2 : 0,\n        dir: 1\n      });\n    }\n\n    // السقوط ونهاية اللعبة\n    if(player.y - cameraY > H + 40){\n      alive = false;\n    }\n  } else {\n    // إعادة اللعب عند الضغط على أي زر حركة\n    if(keys.left || keys.right){\n      reset();\n    }\n  }\n  draw();\n  requestAnimationFrame(loop);\n}\nreset();\nrequestAnimationFrame(loop);\n})();\n</script>\n</body>",
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

handler.command = ['جوجو2', 'gojo2']
export default handler