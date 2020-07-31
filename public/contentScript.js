;(function () {
  // window.rulesetDevToolsExtensionID = 'diibnbdfcjddnpmlhakebmiabmhhmnii'
  window.rulesetDevToolsExtensionID = 'mkcbfjcdaeieogfcbhdcmljdfjdhgmfj' // DEVELOPMENT
  // eslint-disable-next-line no-undef
  const bg = chrome.runtime.connect(window.rulesetDevToolsExtensionID, { name:'Ruleset-Client' })


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
    console.log('added page-script')
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
    bg.postMessage({
      type: 'RULESET_EVENTS',
      payload: JSON.stringify(message.data.payload)
    })
  }, false)
})()
