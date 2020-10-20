;(function () {
  window.rulesetDevToolsExtensionID = 'diibnbdfcjddnpmlhakebmiabmhhmnii'
  // window.rulesetDevToolsExtensionID = 'mkcbfjcdaeieogfcbhdcmljdfjdhgmfj' // DEVELOPMENT
  // eslint-disable-next-line no-undef
  let bg = chrome.runtime.connect(window.rulesetDevToolsExtensionID, { name:'Ruleset-Client' })
  let bgConnected = true

  const handleBgDisconnect = () => {
    bg.onDisconnect.removeListener(handleBgDisconnect)
    bgConnected = false
  }
  bg.onDisconnect.addListener(handleBgDisconnect)

  bg.postMessage({ type: 'CONNECT_CLIENT' })


  /** 
  * notify redux-ruleset that it should generate events
  */

  var observer = new MutationObserver(function () {
    if(!document.head) return
    observer.disconnect()

    // add notifier
    let n = document.createElement('script')
    n.type = 'text/javascript'
    n.innerText = 'window.RULESET_DEVTOOLS=true'
    document.head.appendChild(n)

    // add pageScript 
    let s = document.createElement('script')
    s.type = 'text/javascript'
    s.id = 'redux-ruleset-page-script-fetch'
    s.async = true
    // eslint-disable-next-line no-undef
    s.src = chrome.extension.getURL('pageScript.js')
    document.head.appendChild(s)
  });
  observer.observe(document, {
    childList: true, // report added/removed nodes
    subtree: true,   // observe any descendant elements
  })


  /**
  * read page-script messages
  */
  window.addEventListener('message', message => {
    if(typeof message.data !== 'object') return
    if(message.data.type !== "RULESET_EVENTS") return
    try {
      bgConnected && bg.postMessage({
        type: 'RULESET_EVENTS',
        payload: JSON.stringify(message.data.payload)
      })
    }
    catch(e){}
  }, false)
})()
