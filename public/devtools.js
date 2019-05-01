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

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "Ruleset"
});


backgroundPageConnection.onMessage.addListener(function(message){
  if(message.type !== "UPDATE_RULESET_EVENTS") return
  
  if(!devtools) buffer.push(...message.events)
  else message.events.forEach(evt => devtools.ruleEvents.push(evt))
})


backgroundPageConnection.postMessage({
  type: 'init',
  name: 'Ruleset'
})

