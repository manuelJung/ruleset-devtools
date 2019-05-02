
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

chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      // code invoked on panel creation
      panel.onShown.addListener(function (global){
        devtools = global
        sendToBackgroundScript({
          isRulesetMessage: true,
          direction: 'top-down',
          type: 'OPEN_DEVTOOLS'
        })
      })
    }
)

console.log('devtools :)')

recieveFromBackgroundScript(message => {
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  console.log(message)
})



