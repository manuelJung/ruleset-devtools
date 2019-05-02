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
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  connection.postMessage(message)
}

function sendToContentScript (message) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
}

function recieveFromContentScript (cb) {
  chrome.runtime.onMessage.addListener(cb)
}

function recieveFromDevtools (cb) {}


// SCRIPT


recieveFromContentScript(message => {
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  // console.log('bg:recieveFromContentScript', message)
  sendToDevtools(message.data)
})