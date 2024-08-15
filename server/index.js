// Import the ws library
const WebSocket = require('ws');

// Create an instance of WebSocket.Server listening on port 8080
const wss = new WebSocket.Server({ port: 2096 });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

// 'connection' event: triggered when a client connects
wss.on('connection', function connection(ws) {
  console.log('A client has connected.');

  ws.id = wss.getUniqueID();

  // 'message' event: triggered when the server receives a message from a client
  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);
    if (data.type == "message") {
      sendMessage(data.content, ws.id);
    }
  });

  // 'close' event: triggered when the client disconnects
  ws.on('close', function close() {
    console.log('Client disconnected.');
  });
});


function sendMessage(message, sender) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ "type": "message", "content": message, "sender": sender }))
  });
}

console.log('The WebSocket server is listening on port 2096.');
