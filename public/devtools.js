
// eslint-disable-next-line no-undef
const connectToBg = () => chrome.runtime.connect({ name: "Ruleset-Server" })
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
            setTimeout(() => { background = connectToBg() }, 100)
            if(global){
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