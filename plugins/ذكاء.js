const handler = async (m, { conn }) => {
    await m.react('🤖');

    const htmlGamePayload = JSON.stringify({
        "response_id": "ai-chat-" + Date.now(),
        "sections": [
            {
                "view_model": {
                    "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": '<style>*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#0d1117;font-family:\'Segoe UI\',Arial,sans-serif;color:#e6edf3;overflow:hidden}.wrap{display:flex;flex-direction:column;height:100vh;max-width:600px;margin:auto}.header{padding:12px 16px;background:#161b22;border-bottom:1px solid #30363d;font-weight:700;font-size:16px;display:flex;align-items:center;gap:8px}.dot{width:8px;height:8px;background:#238636;border-radius:50%;box-shadow:0 0 8px #238636}.chat-box{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}.msg{max-width:80%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.4}.user{align-self:flex-end;background:#238636;color:#fff;border-bottom-right-radius:2px}.ai{align-self:flex-start;background:#21262d;border:1px solid #30363d;color:#e6edf3;border-bottom-left-radius:2px}.input-area{display:flex;padding:12px;background:#161b22;border-top:1px solid #30363d;gap:8px}input{flex:1;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;outline:none}input:focus{border-color:#238636}button{background:#238636;color:#fff;border:none;border-radius:8px;padding:0 16px;font-weight:600;cursor:pointer}</style><div class="wrap"><div class="header"><span class="dot"></span> AI Assistant</div><div class="chat-box" id="box"><div class="msg ai">أهلاً بك! أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟</div></div><div class="input-area"><input type="text" id="inp" placeholder="اكتب رسالتك هنا..." /><button id="btn">إرسال</button></div></div><script>const box=document.getElementById(\'box\'), inp=document.getElementById(\'inp\'), btn=document.getElementById(\'btn\');function addMsg(txt,type){const div=document.createElement(\'div\');div.className=\'msg \'+type;div.textContent=txt;box.appendChild(div);box.scrollTop=box.scrollHeight;}function send(){const val=inp.value.trim();if(!val)return;addMsg(val,\'user\');inp.value=\'\';setTimeout(()=>{let reply=\'أنا نموذج تجريبي بسيط، لكنني أعمل بكفاءة عالية!\';if(val.includes(\'مرحبا\')||val.includes(\'السلام\'))reply=\'وعليكم السلام ورحمة الله وبركاته! كيف حالك؟\';else if(val.includes(\'اسمك\'))reply=\'أنا مساعد ذكي تم برمجته خصيصاً لك.\';addMsg(reply,\'ai\');},600);}btn.onclick=send;inp.onkeydown=(e)=>{if(e.key===\'Enter\')send();};</script>',
                        "trusted_sources": [
                            "ai.dev"
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
                    botResponseId: "ai-chat-" + Date.now(),
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
                                messageText: "AI CHATBOT • TESTED"
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

handler.command = /^(ذكاء|ai)$/i;
export default handler;