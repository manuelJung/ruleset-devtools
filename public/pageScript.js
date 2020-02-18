
// COMMUNICATION

console.log('mount-pageScript')

function sendToContentScript (message) {
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
  channelId: channelId
})


// SCRIPT


let buffer = []
let active = false
let channelId = null

window.__REDUX_RULESET_DEVTOOLS__ = function (event) {
  if(!active) buffer.push(event)
  else sendEvent([event])
}

recieveFromContentScript(message => {
  if(typeof message.data !== 'object') return
  if(message.data.type === 'REGISTER_CHANNEL_ID'){
    channelId = message.data.channelId
  }
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

