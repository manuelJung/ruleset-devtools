
// eslint-disable-next-line no-undef
const connectToBg = () => chrome.runtime.connect({ name: "Ruleset-Server" })
let reopenCb = null
let disconnected = false
// eslint-disable-next-line no-undef
chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      var background = connectToBg()
      let global = null
      let buffer = []
      let tabId = null

      const reconnectCb = port => {
        if(port.name === 'Ruleset-Client' && port.sender.tab.id === tabId) {
          port.onMessage.addListener(handleBgMsg)
        }
      }

      const handleBgMsg = msg => {
        switch(msg.type){
          case 'CONNECT_CLIENT': {
            if(global){
              global.clearStore()
              global.clearRouter()
            }
            break;
          }
          case 'DISCONNECT_CLIENT': {
            // eslint-disable-next-line no-undef
            if(chrome.runtime.onConnect.hasListener(reconnectCb)){
              // eslint-disable-next-line no-undef
              chrome.runtime.onConnect.removeListener(reconnectCb)
            }
            // eslint-disable-next-line no-undef
            chrome.runtime.onConnect.addListener(reconnectCb)
            tabId = msg.payload
            break;
          }
          case 'RULESET_EVENTS': {
            if(global) global.addRulesetEvents(JSON.parse(msg.payload))
            else buffer.push(JSON.parse(msg.payload))
            break;
          }
          default: break;
        }
      }
      background.onMessage.addListener(handleBgMsg)

      panel.onShown.addListener(_global => {
        global = _global
        buffer.forEach(row => global.addRulesetEvents(row))
        buffer = []
      })
    }
)

// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener(function (port) {
  if(!disconnected) return
  disconnected = false
  if(port.name === 'Ruleset-Client') {
    if(reopenCb) reopenCb()
  }
})