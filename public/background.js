
var clients = {}
var serverConnections = {}
var clientBuffer = {}


// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener(function (port) {
  
  if(port.name === 'Ruleset-Client') {
    console.log('client-connect', port)
    const tabId = port.sender.tab.id
    clients[tabId] = port
    clientBuffer[tabId] = createClientBuffer(port)
    return
  }

  if(port.name !== 'Ruleset-Server') return
  console.log('server-connect', port)

  // eslint-disable-next-line no-undef
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if(!tabs[0]) return
    const id = tabs[0].id
    const client = clients[id]
    serverConnections[id] = client
    if(client) createBridge(client, port)
  })
})

// send messages from client to server and back
function createBridge (client, server) {
  const buffer = clientBuffer[client.sender.tab.id]
  const c2s = msg => {
    console.log(!serverConnections[client.sender.tab.id], msg)
    if(!serverConnections[client.sender.tab.id]) return
    server.postMessage(msg)
  }
  buffer.setCb(c2s)

  console.log('create-bridge', client, server)

  const onDisconnect = () => {
    buffer.clearCb()
    client.onDisconnect.removeListener(onClientDisconnect)
    server.onDisconnect.removeListener(onServerDisconnect)
  }

  const onClientDisconnect = () => {
    server.postMessage({type:'DISCONNECT_CLIENT', payload: client.sender.tab.id})
    delete clients[client.sender.tab.id]
    delete clientBuffer[client.sender.tab.id]
    delete serverConnections[client.sender.tab.id]
    onDisconnect()
  }

  const onServerDisconnect = () => {
    delete serverConnections[client.sender.tab.id]
    onDisconnect()
  }

  client.onDisconnect.addListener(onClientDisconnect)
  server.onDisconnect.addListener(onServerDisconnect)
}


function createClientBuffer (port) {
  let list = []
  let cb = null

  port.onMessage.addListener(msg => {
    if(cb) cb(msg)
    list.push(msg)
  })
  return {
    setCb(_cb) {
      cb=_cb
      list.forEach(item => cb(item))
    },
    clearCb(){
      cb = null
    },
  }
}