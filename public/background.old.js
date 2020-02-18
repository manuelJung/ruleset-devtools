// SETUP

let connection = null
let buffer = []

chrome.runtime.onConnect.addListener(function (port) {
  if(port.name !== 'Ruleset') return
  connection = port

  port.onDisconnect.addListener(function(port) {
      sendToContentScript({type:'DISCONNECT'})
      connection = null
      port.onMessage.removeListener(sendToContentScript)
  });

  port.onMessage.addListener(sendToContentScript)
  buffer.forEach(msg => sendToDevtools(msg))
  buffer = []
})


// COMMUNICATION

function sendToDevtools (message) {
  if(typeof message !== 'object') return
  if(!message.isRulesetMessage) return
  if(!connection) {
    buffer.push(message)
    return
  }
  connection.postMessage(message)
}

function sendToContentScript (message) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
}

function recieveFromContentScript (cb) {
  chrome.runtime.onMessage.addListener(message => {
    if(typeof message !== 'object') return
    if(!message.isRulesetMessage) return
    cb(message)
  })
}

function recieveFromDevtools (cb) {}


// setInterval(() => {
//   console.log(typeof connection)
// }, 1000)

// SCRIPT


recieveFromContentScript(message => {
  sendToDevtools(message)
})