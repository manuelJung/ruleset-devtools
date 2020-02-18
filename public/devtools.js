
// SETUP

console.log('mount-devtools')

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


chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      panel.onShown.addListener(global => {
        devtools = global
        sendToBackgroundScript({
          isRulesetMessage: true,
          direction: 'top-down',
          type: 'OPEN_DEVTOOLS'
        })
      })
      panel.onHidden.addListener(() => {
        devtools = null
        sendToBackgroundScript({
          isRulesetMessage: true,
          direction: 'top-down',
          type: 'CLOSE_DEVTOOLS'
        })
      })
    }
)

recieveFromBackgroundScript(message => {
  console.log(!!devtools, message)
  if(!devtools) return
  if(message.type == 'APP_MOUNT'){

  }
  if(message.type === 'UPDATE_RULESET_EVENTS'){
    devtools.addRulesetEvents(message.events)
    // devtools.ruleEvents.push(...message.events)
  }
})



