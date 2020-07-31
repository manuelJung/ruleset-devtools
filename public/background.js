
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
    // const server = serverConnections[tabId]
    // const toBuffer = msg => {
    //   if(clientBuffer[tabId] === 'pending') return
    //   if(!clientBuffer[tabId]) clientBuffer[tabId] = []
    //   clientBuffer[tabId].push(msg)
    // }
    // if(server) {
    //   // createBridge(port, server) 
    //   port.onMessage.removeListener(toBuffer)
    // }
    // else {
    //   port.onMessage.addListener(toBuffer)
    // }
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
  const s2c = msg => {
    switch(msg.type) {
      case 'OPEN_DEVTOOLS': {
        const buffer = clientBuffer[client.sender.tab.id]
        if(buffer) buffer.setCb(c2s)
        break;
      }
      case 'CLOSE_DEVTOOLS': {
        const buffer = clientBuffer[client.sender.tab.id]
        if(buffer) buffer.clearCb()
        break;
      }
      default: break;
    }
  }
  const c2s = msg => {serverConnections[client.sender.tab.id] && server.postMessage(msg)}
  server.onMessage.addListener(s2c)

  console.log('create-bridge', client, server)

  const onDisconnect = () => {
    server.onMessage.removeListener(s2c)
    client.onDisconnect.removeListener(onClientDisconnect)
    server.onDisconnect.removeListener(onServerDisconnect)
  }

  const onClientDisconnect = () => {
    server.postMessage({type:'DISCONNECT_CLIENT'})
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
    else list.push(msg)
  })
  return {
    setCb(_cb) {
      cb=_cb
      list.forEach(item => cb(item))
      list = []
    },
    clearCb(){
      cb = null
    }
  }
}