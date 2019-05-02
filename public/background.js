// SETUP

let connection = null

chrome.runtime.onConnect.addListener(function (port) {
  if(port.name !== 'Ruleset') return
  connection = port

  console.log('connected')

  function devtoolsConnection (message){
    
  }

  port.onDisconnect.addListener(function(port) {
      connection = null
      port.onMessage.removeListener(devtoolsConnection)
  });

  port.onMessage.addListener(devtoolsConnection)
});


// COMMUNICATION

function sendToDevtools (message) {
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  connection.postMessage(message)
}

function sendToContentScript (message) {}

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