const handler = async (m, { conn }) => {
    await m.react('🏎️');

    const htmlGamePayload = JSON.stringify({
        "response_id": "sukuna-car-game-" + Date.now(),
        "sections": [
            {
                "view_model": {
                    "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": '<style>*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none}body{margin:0;background:#020205;font-family:\'Segoe UI\',Arial,sans-serif;color:#fff;overflow:hidden;touch-action:none}.wrap{max-width:620px;margin:auto;padding:6px}.card{border-radius:24px;background:linear-gradient(180deg,#141624,#05060a);border:1px solid rgba(255,0,85,.3);overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.9)}.header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.5)}.mini{font-size:7px;letter-spacing:3px;color:#ff0055;font-weight:bold;text-shadow:0 0 8px rgba(255,0,85,.6)}.title{font-size:17px;font-weight:900;letter-spacing:1px;color:#fff;text-shadow:0 0 12px rgba(255,0,85,.5)}.bal{font-size:8px;color:#a0a2b8;text-align:right}.bal b{display:block;font-size:16px;color:#ff0055;margin-top:2px;text-shadow:0 0 10px rgba(255,0,85,.7)}#game{width:100%;display:block;background:#000}.controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px;background:#080910}.btn{height:54px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;transition:all .08s}.btn:active,.btn.active{transform:scale(.92);background:linear-gradient(135deg,#ff0055,#aa0033);color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8);border-color:#ff0055}.footer{display:flex;justify-content:center;align-items:center;gap:8px;padding:8px;font-size:7px;color:#7a7d9c;background:#030307}.dot{width:5px;height:5px;border-radius:50%;background:#ff0055;box-shadow:0 0 10px #ff0055}</style><div class="wrap"><div class="card"><div class="header"><div><div class="mini">CURSE OF SPEED</div><div class="title">SUKUNA CARS</div></div><div class="bal">SPEED<b id="spd">0 KM/H</b></div></div><canvas id="game" width="620" height="360"></canvas><div class="controls"><div></div><div class="btn" id="up">▲</div><div></div><div class="btn" id="left">◀</div><div class="btn" id="down">▼</div><div class="btn" id="right">▶</div></div><div class="footer"><span class="dot"></span>SUKUNA DOMAIN • REAL PHYSICS</div></div></div><script>const c=document.getElementById(\'game\'), ctx=c.getContext(\'2d\'), spdEl=document.getElementById(\'spd\');let car={x:0, z:0, ang:0, speed:0, maxSpeed:9};let keys={};let buildings=[];for(let i=0; i<120; i++){buildings.push({x: (i%2===0?-1:1)*(130 + Math.random()*150), z: i*55, w: 50 + Math.random()*50, h: 120 + Math.random()*200, color: i%2===0?\'#151828\':\'#1c2035\'});}function bind(id,k){const e=document.getElementById(id);if(!e) return;const press=(ev)=>{ev.preventDefault();keys[k]=true;e.classList.add(\'active\');};const release=(ev)=>{ev.preventDefault();keys[k]=false;e.classList.remove(\'active\');};e.addEventListener(\'pointerdown\',press); e.addEventListener(\'pointerup\',release); e.addEventListener(\'pointerleave\',release);}bind(\'up\',\'up\'); bind(\'down\',\'down\'); bind(\'left\',\'left\'); bind(\'right\',\'right\');function loop(){let nextX = car.x + Math.sin(car.ang) * (car.speed * 0.85);let nextZ = car.z + Math.cos(car.ang) * car.speed;let crashed = false;for(let i=0; i<buildings.length; i++){let b = buildings[i];let dz = b.z - (nextZ % 3300);if(dz < 0) dz += 3300;if(dz > 10 && dz < 60) {if(Math.abs(nextX - b.x) < (b.w/2 + 25)) {crashed = true;break;}}}if(Math.abs(nextX) > 115) {crashed = true;}if(crashed) {car.speed = -car.speed * 0.3;if(Math.abs(car.speed) < 0.2) car.speed = 0;} else {if(keys.up) car.speed = Math.min(car.maxSpeed, car.speed + 0.16);else if(keys.down) car.speed = Math.max(-3.5, car.speed - 0.22);else car.speed *= 0.955;if(Math.abs(car.speed) > 0.1){if(keys.left) car.ang -= 0.038 * (car.speed/car.maxSpeed);if(keys.right) car.ang += 0.038 * (car.speed/car.maxSpeed);}car.x = nextX;car.z = nextZ;}let skyGrad = ctx.createLinearGradient(0, 0, 0, 180);skyGrad.addColorStop(0, \'#120208\');skyGrad.addColorStop(0.5, \'#3d0014\');skyGrad.addColorStop(1, \'#ff0055\');ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, c.width, c.height);let sunX = c.width/2 - car.ang*120, sunY = 70;let sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 70);sunGrad.addColorStop(0, \'#ffffff\');sunGrad.addColorStop(0.3, \'#ff0055\');sunGrad.addColorStop(1, \'rgba(255,0,85,0)\');ctx.fillStyle = sunGrad;ctx.beginPath(); ctx.arc(sunX, sunY, 70, 0, Math.PI*2); ctx.fill();ctx.fillStyle = \'#0f111a\';ctx.beginPath();ctx.moveTo(c.width/2, 180);ctx.lineTo(0, c.height);ctx.lineTo(c.width, c.height);ctx.fill();ctx.strokeStyle = \'#ff0055\'; ctx.lineWidth = 4;ctx.shadowColor = \'#ff0055\'; ctx.shadowBlur = 10;ctx.beginPath();let laneCenter = c.width/2 - car.x*18;ctx.moveTo(laneCenter, 180);ctx.lineTo(c.width/2, c.height);ctx.stroke();ctx.shadowBlur = 0;for(let i=0; i<buildings.length; i++){let b = buildings[i];let dz = b.z - (car.z % 3300);if(dz < 10) dz += 3300;let scale = 260 / dz;let bx = c.width/2 + (b.x - car.x*22) * scale;let by = c.height/2 + 25 * scale;let bw = b.w * scale;let bh = b.h * scale;if(scale > 0.04 && scale < 6){ctx.fillStyle = b.color;ctx.fillRect(bx - bw/2, by - bh, bw, bh);}}let carW = 90, carH = 55;let cx = c.width/2;let cy = c.height - 60;ctx.fillStyle = \'rgba(0,0,0,0.75)\';ctx.beginPath(); ctx.ellipse(cx, cy + 22, 44, 12, 0, 0, Math.PI*2); ctx.fill();ctx.save();ctx.translate(cx, cy);ctx.rotate(car.ang * 0.25);let carGrad = ctx.createLinearGradient(-carW/2, -carH/2, carW/2, carH/2);carGrad.addColorStop(0, crashed ? \'#ff0033\' : \'#ff0055\');carGrad.addColorStop(0.5, crashed ? \'#aa0000\' : \'#880022\');carGrad.addColorStop(1, \'#22000a\');ctx.fillStyle = carGrad;ctx.shadowColor = \'#ff0055\'; ctx.shadowBlur = crashed ? 25 : 20;ctx.beginPath();ctx.roundRect(-carW/2, -carH/2, carW, carH, [16, 16, 8, 8]);ctx.fill();ctx.shadowBlur = 0;ctx.fillStyle = \'#080912\';ctx.beginPath();ctx.roundRect(-carW/3.2, -carH/3 + 3, carW*0.62, carH*0.65, [8, 8, 3, 3]);ctx.fill();ctx.restore();spdEl.textContent = Math.floor(Math.abs(car.speed) * 24) + \' KM/H\';requestAnimationFrame(loop);}loop();</script>',
                        "trusted_sources": [
                            "sukuna.dev"
                        ]
                    },
                    "__typename": "GenAISingleLayoutViewModel"
                }
            }
        ]
    });

    await conn.relayMessage(
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
                    botResponseId: "sukuna-cars-" + Date.now(),
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
                                messageText: "SUKUNA CARS • ULTIMATE HIGHWAY"
                            }
                        ],
                        unifiedResponse: {
                            data: Buffer.from(htmlGamePayload).toString('base64')
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
                        privacy_node_ts: "1788095961"
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
    );
};

handler.command = ['سيارة']
export default handler;