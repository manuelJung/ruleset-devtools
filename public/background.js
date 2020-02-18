
console.log('mount background')

// SETUP

// setup devtools connection
chrome.runtime.onConnect.addListener(function (port) {
  let buffer = []
  const channelId = Math.random().toString(36).substr(2, 9)
  console.log('port', port)
  if(port.name !== 'Ruleset') return

  function onDisconnect () {
    port.onMessage.removeListener(recieveFromDevtools)
    port.onDisconnect.removeListener(onDisconnect)
    chrome.runtime.onMessage.removeListener(recieveFromContentScript)
  }

  function recieveFromContentScript (msg) {
    if(!msg.isRulesetMessage) return
    if(msg.channelId !== channelId) return
    console.log('recieve-from-content-script', channelId, msg)
    sendToDevtools(msg)
  }

  function recieveFromDevtools (msg) {
    console.log('recieve-from-devtools', msg)
    sendToContentScript(msg)
  }

  function sendToContentScript (msg) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if(!tabs[0]) return console.log('no active tab found')
      chrome.tabs.sendMessage(tabs[0].id, msg)
    })
  }

  function sendToDevtools (msg) {
    port.postMessage(msg)
  }

  sendToContentScript({
    type:'REGISTER_CHANNEL_ID',
    isRulesetMessage: true,
    direction: 'top-down',
    channelId
  })

  chrome.runtime.onMessage.addListener(recieveFromContentScript)
  port.onDisconnect.addListener(onDisconnect)
  port.onMessage.addListener(recieveFromDevtools)
  buffer.forEach(msg => sendToDevtools(msg))
  buffer = []
})
