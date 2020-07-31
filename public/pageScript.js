;(function () {

  function sendToContentScript (message) {
    window.postMessage(message, '*')
  }

  const sendEventsToDevtools = events => sendToContentScript({
    type: 'RULESET_EVENTS',
    payload: JSON.parse(JSON.stringify(events)),
  })

  let buffer = []
  let pendingPush = false

  window.__REDUX_RULESET_DEVTOOLS__ = function (event) {
    buffer.push(event)
    if(!pendingPush) {
      pendingPush = true
      setTimeout(() => {
        sendEventsToDevtools(buffer)
        pendingPush = false
        buffer = []
      }, 100)
    }
  }
})()

