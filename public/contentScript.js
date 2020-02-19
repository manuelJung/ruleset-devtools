
// COMUNICATION

console.log('mount-contentScript')

// query tab

const queryTabCb = function (msg) {
  if(msg.type === 'RESOLVE_TAB') {
    chrome.runtime.onMessage.removeListener(queryTabCb)
    console.log('get tab', msg.tab)
    setup(msg.tab)
  }
}
chrome.runtime.onMessage.addListener(queryTabCb)
chrome.runtime.sendMessage({type:'QUERY_TAB'})


// notify redux-ruleset that it should generate events

var observer = new MutationObserver(function () {
  if(!document.head) return
  observer.disconnect()

  // add notifier
  let n = document.createElement('script')
  n.type = 'text/javascript'
  n.innerText = 'window.RULESET_DEVTOOLS=true'
  document.head.appendChild(n)
});
observer.observe(document, {
  childList: true, // report added/removed nodes
  subtree: true,   // observe any descendant elements
})



// setup communication

function setup (tab) {

  function sendToBackgroundScript (message) {
    message.data.tab = tab
    console.log('send-to-bg', message.data)
    chrome.runtime.sendMessage(message.data)
  }

  function sendToPageScript (message) {
    console.log('send-to-ps', message)
    window.postMessage(message, '*')
  }

  // recieveFromPageScript
  window.addEventListener('message', message => {
    if(typeof message.data !== 'object') return
    if(!message.data.isRulesetMessage) return
    if(message.data.direction !== 'bottom-up') return
    console.log('get-from-ps', message)
    sendToBackgroundScript(message)
  }, false)

  // recieveFromBackgroundScript
  chrome.runtime.onMessage.addListener(message => {
    console.log('get-from-bg', message)
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
  console.log('setup finished')
}
