
// COMUNICATION

function sendToBackgroundScript (message) {
  // console.log('cs:sendToBackgroundScript', message)
  chrome.runtime.sendMessage(message)
}

function sendToPageScript (message) {
  window.postMessage(message, '*')
}

function recieveFromPageScript (cb) {
  window.addEventListener('message', message => {
    if(typeof message.data !== 'object') return
    if(!message.data.isRulesetMessage) return
    if(message.data.direction !== 'bottom-up') return
    cb(message)
  }, false)
}

function recieveFromBackgroundScript (cb) {
  chrome.runtime.onMessage.addListener(cb)
}


// SCRIPT

recieveFromPageScript(message => {
  sendToPageScript({
    isRulesetMessage: true,
    direction: 'top-down',
    type: 'cs-LOG',
    payload: message.data
  })
  sendToBackgroundScript(message.data)
})

recieveFromBackgroundScript(message => {
  sendToPageScript(message)
})


// add pageScript
let s = document.createElement('script')
s.type = 'text/javascript'
s.async = true
s.src = chrome.extension.getURL('pageScript.js')
s.onload = function() {
  this.parentNode.removeChild(this)
}
document.head.appendChild(s)