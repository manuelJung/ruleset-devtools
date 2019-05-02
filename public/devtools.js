
// SETUP

var backgroundPageConnection = chrome.runtime.connect({
    name: "Ruleset"
});


// COMMUNICATION

function sendToBackgroundScript (message) {
  backgroundPageConnection.postMessage(message)
}

function recieveFromBackgroundScript (cb) {
  backgroundPageConnection.onMessage.addListener(cb)
}


// SCRIPT


let devtools =  null

function start(global) {
  devtools = global
  sendToBackgroundScript({
    isRulesetMessage: true,
    direction: 'top-down',
    type: 'OPEN_DEVTOOLS'
  })
}

chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      // code invoked on panel creation
      panel.onShown.addListener(start)
      panel.onHidden.addListener(() => {
        devtools = null
        panel.onShown.removeListener(start)
        sendToBackgroundScript({
          isRulesetMessage: true,
          direction: 'top-down',
          type: 'CLOSE_DEVTOOLS'
        })
      })
    }
)

recieveFromBackgroundScript(message => {
  if(!devtools) return
  if(message.type === 'UPDATE_RULESET_EVENTS'){
    devtools.ruleEvents.push(...message.events)
  }
})



