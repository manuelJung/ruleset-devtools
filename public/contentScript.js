
window.addEventListener("message", msg => {
  if(typeof msg.data !== 'object') return
  if(!msg.data.isRulesetMessage) return
  chrome.runtime.sendMessage(msg.data)
}, false)


// add pageScript
let s = document.createElement('script')
s.type = 'text/javascript'
s.async = true
s.src = chrome.extension.getURL('pageScript.js')
s.onload = function() {
  this.parentNode.removeChild(this)
}
document.head.appendChild(s)