const handler=async(m,{conn,})=>{
await m.react('🗺️')
// ⟬ 𝗣𝗜𝗫𝗘𝗟 ⫷⌬⫸ 𝗗𝗘𝗩 ⟭
// https://whatsapp.com/channel/0029VbDDbMwDeON7YXdZrL20

// الوظيفة توليد فيديوهات ميتا | generate video from meta 

conn.relayMessage(
  m.chat,
  {
    messageContextInfo: {
      messageSecret: "MIPoZvRwYpd0+QsfSyptlHduL74Tigx9QCPrhyqaxew=",
      botMetadata: {
        verificationMetadata: {
          proofs: [
            {
              version: 1,
              useCase: 1,
              signature: "BhkL3IvvndkvrCFPzWRhbYvgo8spmR0ctKVeNDbGtBKhfIJO/bOX9CWDHF/nK/xbPcGmugxWDGxfrraVXwATBg==",
              certificateChain: [
                "MIICpzCCAk6gAwIBAgIUMgr9pBKRtbj9wYLzKg1VXmdK2BkwCgYIKoZIzj0EAwIweTEiMCAGA1UEAwwZTWV0YSBXQSBTUyBJbnQgQ0EgMjAyNS0wOTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMCk1lbmxvIFBhcmsxHDAaBgNVBAoME01ldGEgUGxhdGZvcm1zIEluYy4wHhcNMjYwODE0MTgzMTQyWhcNMjcwMzAyMTgzMTUyWjAeMRwwGgYDVQQDDBNzdmM6d2EtYm90LW1zZy1sZWFmMCowBQYDK2VwAyEACTW6aoXs1kViMB/ulIaS8UbX6nXqacVRZi2CsXn+R4SjggE8MIIBODALBgNVHQ8EBAMCB4AwHQYDVR0OBBYEFB9cGIbW2/wdXQkHYhzzAWIyDiEiMIG0BgNVHSMEgawwgamAFO81YRGUWbuc0xuufO+lFiYAOjGOoXukeTB3MSAwHgYDVQQDDBdNZXRhIFdBIEZlYXR1cmUgUm9vdCBDQTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMCk1lbmxvIFBhcmsxHDAaBgNVBAoME01ldGEgUGxhdGZvcm1zIEluYy6CFEZvL5Zv8AJ8duOmVC+Foy7F4yg7MFMGCysGAQQBgsAVAgIQBEQMQlVSSTptcmw6Ly9jZXJ0aWZpY2F0ZV9zZXJ2aWNlLndoYXRzYXBwX3NpbXBsZV9zaWduYWwvU2VyaWFsTnVtYmVyczAKBggqhkjOPQQDAgNHADBEAiAIGY7CwEdNQlkK/y7fTUvosBQFsVGVCkV+0XXvbRay6QIgREQN2rbN7Z2Hk5502F29lGzcHfrbiO85PjMv7ruYYlc=",
                "MIIDeDCCAx2gAwIBAgIURm8vlm/wAnx246ZUL4WjLsXjKDswCgYIKoZIzj0EAwIwdzEgMB4GA1UEAwwXTWV0YSBXQSBGZWF0dXJlIFJvb3QgQ0ExCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRMwEQYDVQQHDApNZW5sbyBQYXJrMRwwGgYDVQQKDBNNZXRhIFBsYXRmb3JtcyBJbmMuMB4XDTI1MDkwNDE4MDU0OVoXDTI3MDkwNDE4MDU0OVoweTEiMCAGA1UEAwwZTWV0YSBXQSBTUyBJbnQgQ0EgMjAyNS0wOTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMCk1lbmxvIFBhcmsxHDAaBgNVBAoME01ldGEgUGxhdGZvcm1zIEluYy4wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATs+c+UVhvMBZzu4AHndKKTZASPLp2vUt1g84aUpdOFqmqCs5KEJ8Sxhi8F9GX4P7rPLjfOwfFJRA6yrp+2cX0zo4IBgzCCAX8wHQYDVR0OBBYEFO81YRGUWbuc0xuufO+lFiYAOjGOMIG0BgNVHSMEgawwgamAFNO7KMTVSYUxkL6VS3LyWJw7m76zoXukeTB3MSAwHgYDVQQDDBdNZXRhIFdBIEZlYXR1cmUgUm9vdCBDQTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMCk1lbmxvIFBhcmsxHDAaBgNVBAoME01ldGEgUGxhdGZvcm1zIEluYy6CFALbuULsZlYXxk/Cz5I35uNJkpdAMA4GA1UdDwEB/wQEAwIBhjASBgNVHRMBAf8ECDAGAQH/AgEAMEUGA1UdHwQ+MDwwOqA4oDaGNGh0dHBzOi8vbWV0YS5wdWJsaWNrZXlpbmZyYS5jb20vYXJsL3doYXRzYXBwX2ZlYXR1cmUwIAYIKwYBBQUHAQEEFDASMBAGCCsGAQUFBzABhgROb25lMBoGCWCGSAGG+EIBDQQNFgtPbmNhbGw6IHBraTAKBggqhkjOPQQDAgNJADBGAiEAq7Ycf2W/cSA2Ni3L0sgYmPmlRxkPcMgOm+ZRgkiQsdwCIQD2XRUvySFSRYJSfyQW2m4ka8N9gJ8KRMD1KTwyXghXHQ=="
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
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": "83b31729-b3f6-4e79-96b8-91b3404b98fa",
              "sections": [
                {
                  "view_model": {
                    "primitive": {
                      "media": {
                        "url": "",
                        "mime_type": "video/mp4"
                      },
                      "imagine_type": "ANIMATE",
                      "status": {
                        "status": "GENERATING",
                        "estimated_completion_time": 1786882296
                      },
                      "__typename": "GenAIImaginePrimitive"
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
            expiration: 7776000,
            disappearingMode: {
              initiator: 0,
              trigger: 0
            },
            forwardedAiBotMessageInfo: {
              botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
          }
        }
      }
    }
  },
  {}
)
}

handler.command=['توليد']
export default handler