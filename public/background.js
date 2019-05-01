let connection = null;
let buffer = []

chrome.runtime.onConnect.addListener(function (port) {
    if(port.name !== 'Ruleset') return

    function devtoolsConnection (message){
        if(message.type === 'init'){
            connection = port
            buffer.forEach(message => connection.postMessage(message))
            buffer = []
        }
    }

    port.onDisconnect.addListener(function(port) {
        connection = null
        port.onMessage.removeListener(devtoolsConnection)
    });

    port.onMessage.addListener(devtoolsConnection)

});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message)
    if(!connection) {
        buffer.push(message)
        return
    }
    connection.postMessage(message);
});