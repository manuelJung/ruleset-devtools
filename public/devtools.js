
// eslint-disable-next-line no-undef
const connectToBg = () => chrome.runtime.connect({ name: "Ruleset-Server" })
let reopenCb = null
// eslint-disable-next-line no-undef
chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      var background = connectToBg()
      let global = null

      const handleBgMsg = msg => {
        switch(msg.type){
          case 'DISCONNECT_CLIENT': {
            background.onMessage.removeListener(handleBgMsg)
            reopenCb = () => {
              background = connectToBg()
              background.onMessage.addListener(handleBgMsg)
              reopenCb = null
            }
            if(global){
              console.clear()
              global.clearStore()
              global.clearRouter()
            }
            break;
          }
          case 'RULESET_EVENTS': {
            global.addRulesetEvents(JSON.parse(msg.payload))
            break;
          }
          default: break;
        }
      }

      panel.onShown.addListener(_global => {
        global = _global
        background.onMessage.addListener(handleBgMsg)
        background.postMessage({type:'OPEN_DEVTOOLS'})
      })
      panel.onHidden.addListener(() => {
        background.postMessage({type:'CLOSE_DEVTOOLS'})
        background.onMessage.removeListener(handleBgMsg)
      })
    }
)

// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener(function (port) {
  if(port.name === 'Ruleset-Client') {
    if(reopenCb) reopenCb()
  }
})