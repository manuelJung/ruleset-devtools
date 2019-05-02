
// COMMUNICATION

function sendToContentScript (message) {
  console.log('pageScript:sendToContentScript', message)
  window.postMessage(message, '*')
}

function recieveFromContentScript (cb) {}


// SCRIPT

let unlisten = null

;(function(){
  if(!window.__addRulesetEventListener) return

  // unlisten = window.__addRulesetEventListener(event => sendToContentScript({
  //   isRulesetMessage: true,
  //   type: 'UPDATE_RULESET_EVENTS',
  //   events: JSON.parse(JSON.stringify([event], null, 2)),
  // }), true)
})()


setTimeout(() => {
  sendToContentScript({
    isRulesetMessage: true,
    type: 'UPDATE_RULESET_EVENTS',
    events: ['Hello World'],
  })
}, 3000)