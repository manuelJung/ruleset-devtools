
// SETUP

var backgroundPageConnection = chrome.runtime.connect({
    name: "Ruleset"
});


// COMMUNICATION

function sendToBackgroundScript (message) {}

function recieveFromBackgroundScript (cb) {
  backgroundPageConnection.onMessage.addListener(cb)
}


// SCRIPT


let devtools =  null
let buffer = []

chrome.devtools.panels.create("Ruleset",
    "favicon.ico",
    "index.html",
    function(panel) {
      // code invoked on panel creation
      panel.onShown.addListener(function (global){
        devtools = global
        buffer.forEach(evt => devtools.ruleEvents.push(evt))
        buffer = []
      })
    }
)

console.log('devtools :)')

recieveFromBackgroundScript(message => {
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  console.log(message)
})



