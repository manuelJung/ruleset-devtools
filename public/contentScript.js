
// COMUNICATION

function sendToBackgroundScript (message) {
  console.log('cs:sendToBackgroundScript', message)
  chrome.runtime.sendMessage(message)
}

function sendToPageScript (message) {}

function recieveFromPageScript (cb) {
  window.addEventListener('message', cb)
}

function recieveFromBackgroundScript (cb) {}


// SCRIPT

recieveFromPageScript(message => {
  if(typeof message.data !== 'object') return
  if(!message.data.isRulesetMessage) return
  console.log('cs:recieveFromPageScript', message)
  sendToBackgroundScript(message.data)
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