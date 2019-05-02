
// COMMUNICATION

function sendToContentScript (message) {
  // console.log('pageScript:sendToContentScript', message)
  window.postMessage(message, '*')
}

function recieveFromContentScript (cb) {
  window.addEventListener('message', message => {
    if(typeof message.data !== 'object') return
    if(!message.data.isRulesetMessage) return
    if(message.data.direction !== 'top-down') return
    cb(message)
  }, false)
}


// SCRIPT

let unlisten = null

;(function(){
  if(!window.__addRulesetEventListener) return

  // unlisten = window.__addRulesetEventListener(event => sendToContentScript({
  //   isRulesetMessage: true,
  //   type: 'UPDATE_RULESET_EVENTS',
  //   direction: 'bottom-up',
  //   events: JSON.parse(JSON.stringify([event], null, 2)),
  // }), true)
})()

recieveFromContentScript(message => {
  console.log('page script', message.data)

  if(message.data.type === 'OPEN_DEVTOOLS') {
    sendToContentScript({
      isRulesetMessage: true,
      type: 'UPDATE_RULESET_EVENTS',
      direction: 'bottom-up',
      events: ['Hello World']
    })
  }
})
