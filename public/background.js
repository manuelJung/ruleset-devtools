
console.log('mount background')

// SETUP

// setup devtools connection
chrome.runtime.onConnect.addListener(function (port) {
  let buffer = []
  let rootTab = null
  console.log('port', port)
  if(port.name !== 'Ruleset') return

  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if(!tabs[0]) return
    rootTab = tabs[0]
  })

  function onDisconnect () {
    port.onMessage.removeListener(recieveFromDevtools)
    port.onDisconnect.removeListener(onDisconnect)
    chrome.runtime.onMessage.removeListener(recieveFromContentScript)
  }

  function recieveFromContentScript (msg) {
    if(!msg.isRulesetMessage) return
    if(!msg.tab || !rootTab) return
    if(msg.tab.id !== rootTab.id) return
    console.log('recieve-from-content-script', msg)
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

  chrome.runtime.onMessage.addListener(recieveFromContentScript)
  port.onDisconnect.addListener(onDisconnect)
  port.onMessage.addListener(recieveFromDevtools)
  buffer.forEach(msg => sendToDevtools(msg))
  buffer = []
})


// send tab to content script
chrome.runtime.onMessage.addListener((msg, {tab}, reply) => {
  if(msg.type !== 'QUERY_TAB') return
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if(!tabs[0]) return
    chrome.tabs.sendMessage(tabs[0].id, {type: 'RESOLVE_TAB',tab})
  })
})