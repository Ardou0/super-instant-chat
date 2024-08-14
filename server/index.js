// Import the ws library
const WebSocket = require('ws');

// Create an instance of WebSocket.Server listening on port 8080
const wss = new WebSocket.Server({ port: 2096 });

// 'connection' event: triggered when a client connects
wss.on('connection', function connection(ws) {
  console.log('A client has connected.');

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // 'message' event: triggered when the server receives a message from a client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    // Respond to the client with the same message
    ws.send(`Message received: ${message}`);
  });

  // 'close' event: triggered when the client disconnects
  ws.on('close', function close() {
    console.log('Client disconnected.');
  });
});

console.log('The WebSocket server is listening on port 2096.');
