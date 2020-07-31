;(function () {

// COMMUNICATION

// console.log('mount-pageScript')

  function sendToContentScript (message) {
    // console.log('send-to-content-script', message)
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

  const sendEventsToDevtools = events => sendToContentScript({
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
    else sendEventsToDevtools([event])
  }

  recieveFromContentScript(message => {
    // console.log('recieve-from-content-script', message)
    if(typeof message.data !== 'object') return
    if(message.data.type === 'OPEN_DEVTOOLS') {
      active = true
      if(buffer.length) {
        sendEventsToDevtools(buffer)
        buffer = []
      }
    }
    if(message.data.type === 'CLOSE_DEVTOOLS') {
      active = false
    }
  })

  // deprecated: old version
  setTimeout(() => {
    if(window.__addRulesetEventListener){
      window.__addRulesetEventListener(e => {
        if(!active) buffer.push(e)
        else sendEventsToDevtools([e])
      }, true)
    }
  }, 1000)
})()

