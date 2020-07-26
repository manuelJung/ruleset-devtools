;(function(){
  let bg
  let connected = false

  function connect () {
    // Connect to the background script
    connected = true
    const name = 'tab'
    if (window.rulesetDevToolsExtensionID) {
      bg = chrome.runtime.connect(window.rulesetDevToolsExtensionID, { name })
    } else {
      bg = chrome.runtime.connect({ name })
    }

    // Relay background script messages to the page script
    bg.onMessage.addListener((message) => {
      console.log(message)
    })

    bg.onDisconnect.addListener(handleDisconnect)
  }

  function handleDisconnect() {
    window.removeEventListener('message', handleMessages)
    window.postMessage({ type: 'STOP', failed: true, source }, '*')
    bg = undefined
  }

  function send(message) {
    if (!connected) connect();
    if (message.type === 'INIT_INSTANCE') {
      bg.postMessage({ name: 'INIT_INSTANCE', instanceId: message.instanceId });
    } else {
      bg.postMessage({ name: 'RELAY', message });
    }
  }

  // Resend messages from the page to the background script
  function handleMessages(event) {
    if (!event || event.source !== window || typeof event.data !== 'object') return;
    const message = event.data;
    if (message.source !== pageSource) return;
    if (message.type === 'DISCONNECT') {
      if (bg) {
        bg.disconnect();
        connected = false;
      }
      return;
    }

    send(message)
  }

  window.addEventListener('message', handleMessages, false)

  // notify redux-ruleset that it should generate events

  var observer = new MutationObserver(function () {
    if(!document.head) return
    observer.disconnect()

    let n = document.createElement('script')
    n.type = 'text/javascript'
    n.innerText = 'window.RULESET_DEVTOOLS=true'
    document.head.appendChild(n)
  });
  observer.observe(document, {
    childList: true, // report added/removed nodes
    subtree: true,   // observe any descendant elements
  })

  // add pageScript

  let s = document.createElement('script')
  s.type = 'text/javascript'
  s.async = true
  s.src = chrome.extension.getURL('pageScript.new.js')
  s.onload = function() {
    this.parentNode.removeChild(this)
    psMount = true
    psBuffer.forEach(sendToPageScript)
    psBuffer = []
  }
  
  document.head.appendChild(s)
})()