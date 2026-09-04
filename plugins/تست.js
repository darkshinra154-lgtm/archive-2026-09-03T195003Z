const handler=async(m,{conn,})=>{
await m.react('⚙️')
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
              messageText: "🐤 Flappy — tap untuk terbang"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "2e139bcf-de37-4fad-a30c-01524776e17a",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}body{margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer}</style>\n<body>\n<div style=\"width:100%;max-width:620px;margin:auto;padding:14px\">\n<div style=\"background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)\">\n<div style=\"padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center\">\n<div><div style=\"font-size:10px;letter-spacing:1.4px;color:rgba(255,255,255,.45)\">HIURA GAME</div><div style=\"font-size:20px;font-weight:bold;color:#fff\">🐤 Flappy</div></div>\n<div style=\"text-align:right\"><div id=\"sc\" style=\"font-size:18px;font-weight:bold;color:#ffeaa7;text-shadow:0 0 10px rgba(255,234,167,.7)\">0</div><div id=\"bs\" style=\"font-size:10px;color:rgba(255,255,255,.4);margin-top:2px\">BEST 0</div></div>\n</div>\n<div style=\"padding:14px\">\n<canvas id=\"g\" width=\"360\" height=\"480\" style=\"width:100%;height:auto;background:linear-gradient(#1a1a2e,#16213e);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:block\"></canvas>\n<div id=\"st\" style=\"text-align:center;margin-top:10px;font-size:12px;color:rgba(255,255,255,.55)\">Tap / Space = terbang · Game over = tap lagi</div>\n</div></div></div>\n<script>\n(function(){\nconst c=document.getElementById('g'),x=c.getContext('2d');\nconst W=c.width,H=c.height,G=H-56;\nlet bird,pipes,score,best=0,alive,started,grav,vy,gap,speed,frame,clouds;\nfunction loadB(){try{return parseInt(localStorage.getItem('flappy_best')||'0',10)||0}catch(e){return 0}}\nfunction saveB(v){try{localStorage.setItem('flappy_best',String(v))}catch(e){}}\nbest=loadB();document.getElementById('bs').textContent='BEST '+best;\nfunction reset(){\n  bird={x:80,y:H/2,r:14};\n  pipes=[];score=0;alive=true;started=false;grav=0.45;vy=0;gap=128;speed=2.4;frame=0;\n  clouds=[{x:40,y:60,s:.3,w:50},{x:180,y:100,s:.2,w:70},{x:300,y:50,s:.25,w:40}];\n  document.getElementById('sc').textContent='0';\n  document.getElementById('st').textContent='Tap untuk mulai terbang';\n}\nfunction flap(){\n  if(!alive){reset();return}\n  if(!started)started=true;\n  vy=-7.2;\n}\nc.addEventListener('pointerdown',e=>{e.preventDefault();flap()});\ndocument.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();flap()}});\nfunction addPipe(){\n  const top=60+Math.random()*(G-gap-120);\n  pipes.push({x:W+20,top,bot:top+gap,w:52,passed:false});\n}\nfunction hit(){\n  if(bird.y+bird.r>G||bird.y-bird.r<0)return true;\n  for(const p of pipes){\n    if(bird.x+bird.r>p.x&&bird.x-bird.r<p.x+p.w){\n      if(bird.y-bird.r<p.top||bird.y+bird.r>p.bot)return true;\n    }\n  }\n  return false;\n}\nfunction drawBird(){\n  x.save();\n  x.translate(bird.x,bird.y);\n  x.rotate(Math.max(-.6,Math.min(.8,vy*0.06)));\n  x.fillStyle='#ffeaa7';\n  x.beginPath();x.ellipse(0,0,bird.r,bird.r*0.9,0,0,7);x.fill();\n  x.fillStyle='#fdcb6e';\n  x.beginPath();x.ellipse(-4,2,6,8,0.3,0,7);x.fill();\n  x.fillStyle='#2d3436';\n  x.beginPath();x.arc(6,-3,2.5,0,7);x.fill();\n  x.fillStyle='#e17055';\n  x.beginPath();x.moveTo(10,0);x.lineTo(18,3);x.lineTo(10,5);x.closePath();x.fill();\n  x.restore();\n}\nfunction drawPipes(){\n  for(const p of pipes){\n    const grd=x.createLinearGradient(p.x,0,p.x+p.w,0);\n    grd.addColorStop(0,'#00b894');grd.addColorStop(1,'#019875');\n    x.fillStyle=grd;\n    x.fillRect(p.x,0,p.w,p.top);\n    x.fillRect(p.x-4,p.top-16,p.w+8,16);\n    x.fillRect(p.x,p.bot,p.w,G-p.bot);\n    x.fillRect(p.x-4,p.bot,p.w+8,16);\n  }\n}\nfunction draw(){\n  // sky\n  const bg=x.createLinearGradient(0,0,0,H);\n  bg.addColorStop(0,'#0f3460');bg.addColorStop(1,'#1a1a2e');\n  x.fillStyle=bg;x.fillRect(0,0,W,H);\n  // clouds\n  x.fillStyle='rgba(255,255,255,.12)';\n  clouds.forEach(cl=>{\n    x.beginPath();x.ellipse(cl.x,cl.y,cl.w,14,0,0,7);x.fill();\n  });\n  // ground\n  x.fillStyle='#2d3436';x.fillRect(0,G,W,H-G);\n  x.fillStyle='#636e72';\n  for(let i=0;i<W;i+=24)x.fillRect(i-(frame*speed%24),G,12,8);\n  drawPipes();\n  drawBird();\n  if(!started&&alive){\n    x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H);\n    x.fillStyle='#fff';x.font='bold 20px Arial';x.textAlign='center';\n    x.fillText('TAP TO FLY',W/2,H/2);\n    x.font='13px Arial';x.fillText('hindari pipa hijau',W/2,H/2+24);\n    x.textAlign='left';\n  }\n  if(!alive){\n    x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,0,W,H);\n    x.fillStyle='#fff';x.font='bold 24px Arial';x.textAlign='center';\n    x.fillText('CRASHED',W/2,H/2-12);\n    x.font='14px Arial';x.fillText('Score '+score+' · Tap again',W/2,H/2+16);\n    x.textAlign='left';\n  }\n}\nfunction loop(){\n  frame++;\n  clouds.forEach(cl=>{cl.x-=cl.s;if(cl.x<-80)cl.x=W+40});\n  if(started&&alive){\n    vy+=grav;bird.y+=vy;\n    if(frame%90===0)addPipe();\n    pipes.forEach(p=>{\n      p.x-=speed;\n      if(!p.passed&&p.x+p.w<bird.x){\n        p.passed=true;score++;\n        document.getElementById('sc').textContent=String(score);\n        if(score%5===0){speed=Math.min(4.2,speed+0.15);gap=Math.max(100,gap-3)}\n      }\n    });\n    pipes=pipes.filter(p=>p.x>-60);\n    if(hit()){\n      alive=false;\n      if(score>best){best=score;saveB(best);document.getElementById('bs').textContent='BEST '+best}\n      document.getElementById('st').textContent='GAME OVER · Tap untuk main lagi';\n    }\n  }\n  draw();\n  requestAnimationFrame(loop);\n}\nreset();\nrequestAnimationFrame(loop);\n})();\n</script>\n</body>",
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

handler.command=['تست']
export default handler