
// SETUP

console.log('mount-devtools')

var backgroundPageConnection = chrome.runtime.connect({
    name: "Ruleset"
});


// COMMUNICATION

function sendToBackgroundScript (message) {
  try {
    backgroundPageConnection.postMessage(message)
  }
  catch(e){
    console.warn(e)
    backgroundPageConnection = chrome.runtime.connect({ name: "Ruleset" })
    backgroundPageConnection.postMessage(message)
  }
}

function recieveFromBackgroundScript (cb) {
  backgroundPageConnection.onMessage.addListener(cb)
}


// SCRIPT


let devtools =  null
let shouldClear = false


chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      panel.onShown.addListener(global => {
        devtools = global
        if(shouldClear){
          devtools.clearStore()
          shouldClear = false
        }
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
  // console.log(message)
  // console.log(!!devtools, message)
  if(message.type === 'UNLOAD_PAGE'){
    if(devtools){
      devtools.clearStore()
      devtools.clearRouter()
    }
    else {
      shouldClear = true
    }
  }
  if(message.type === 'MOUNT_PAGE'){
    if(devtools){
      sendToBackgroundScript({
        isRulesetMessage: true,
        direction: 'top-down',
        type: 'OPEN_DEVTOOLS'
      })
    }
  }
  if(devtools && message.type === 'UPDATE_RULESET_EVENTS'){
    devtools.addRulesetEvents(message.events)
  }
})



