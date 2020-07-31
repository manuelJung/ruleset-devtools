
var clients = {}
var serverConnections = {}
var clientBuffer = {}


// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener(function (port) {
  
  if(port.name === 'Ruleset-Client') {
    console.log('client-connect', port)
    const tabId = port.sender.tab.id
    clients[tabId] = port
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
        if(clientBuffer[client.sender.tab.id]){
          clientBuffer[client.sender.tab.id].forEach(c2s)
          clientBuffer[client.sender.tab.id] = 'pending'
        }
        break;
      }
      case 'CLOSE_DEVTOOLS': {
        clientBuffer[client.sender.tab.id] = []
        break;
      }
      case 'CREATE_CONNECTION': console.log(msg); break;
      default: break;
    }
  }
  const c2s = msg => {server.postMessage(msg)}
  client.onMessage.addListener(c2s)
  server.onMessage.addListener(s2c)

  console.log('create-bridge', client, server)

  const onDisconnect = () => {
    client.onMessage.removeListener(c2s)
    server.onMessage.removeListener(s2c)
    client.onDisconnect.removeListener(onClientDisconnect)
    server.onDisconnect.removeListener(onServerDisconnect)
  }

  const onClientDisconnect = () => {
    c2s({type:'DISCONNECT_CLIENT'})
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