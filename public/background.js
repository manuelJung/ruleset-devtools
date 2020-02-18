// SETUP

let connection = null

chrome.runtime.onConnect.addListener(function (port) {
  if(port.name !== 'Ruleset') return
  connection = port

  port.onDisconnect.addListener(function(port) {
      connection = null
      port.onMessage.removeListener(sendToContentScript)
  });

  port.onMessage.addListener(sendToContentScript)
})


// COMMUNICATION

function sendToDevtools (message) {
  if(typeof message !== 'object') return
  if(!message.isRulesetMessage) return
  if(!connection) return
  if(message.type === 'APP_MOUNT') {
    connection.postMessage({
      type: 'MY_COOL_TYPE'
    })
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