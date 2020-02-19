
// COMMUNICATION

console.log('mount-pageScript')

function sendToContentScript (message) {
  console.log('send-to-content-script', message)
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

const sendEvent = events => sendToContentScript({
  isRulesetMessage: true,
  type: 'UPDATE_RULESET_EVENTS',
  direction: 'bottom-up',
  events: JSON.parse(JSON.stringify(events, null, 2)),
})


// SCRIPT


let buffer = []
let active = false

window.__REDUX_RULESET_DEVTOOLS__ = function (event) {
  if(!active) buffer.push(event)
  else sendEvent([event])
}

recieveFromContentScript(message => {
  console.log('recieve-from-content-script', message)
  if(typeof message.data !== 'object') return
  if(message.data.type === 'OPEN_DEVTOOLS') {
    active = true
    if(buffer.length) {
      sendEvent(buffer)
      buffer = []
    }
  }
  if(message.data.type === 'CLOSE_DEVTOOLS') {
    active = false
  }
})

