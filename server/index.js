// Import the ws library
const WebSocket = require('ws');
const config = require("./config.json");

// Create an instance of WebSocket.Server listening on port 8080
const wss = new WebSocket.Server({ port: config.port });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

// 'connection' event: triggered when a client connects
wss.on('connection', function connection(ws, req) {
  ws.id = wss.getUniqueID();
  ws.ip = req.socket.remoteAddress;

  if(checkValidity(ws.ip) == true) {
    sendError(ws, config.errors.ip);
    ws.close();
  }
  // 'message' event: triggered when the server receives a message from a client
  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);
    if (data.type == "message") {
      if (checkValidity(data.content) == false) {
        sendMessage(data.content, ws.id);
      }
      else {
        sendError(ws, config.errors.message);
      }
    }
  });

  // 'close' event: triggered when the client disconnects
  ws.on('close', function close() {
    // Do your shit
  });
});

function broadcast(grade, terms) {
  let broadcast = {
    type: grade,
    content: terms
  }
  wss.clients.forEach(client => {
    client.send(JSON.stringify(broadcast));
  })
}

function sendMessage(message, sender) {
  let package = {
    type: "message",
    content: message,
    sender: sender
  }

  wss.clients.forEach(client => {
    client.send(JSON.stringify(package))
  });
}

function sendError(client, type) {
  const errorMessage = {
    type: "error",
    content: type
  };
  client.send(JSON.stringify(errorMessage));
}

function checkValidity(message) {
  if (config.censor === true) {
    let string = message.toLowerCase();

    return config.banlist.some(word => {
      // Improved regular expression to match words surrounded by non-alphanumeric characters
      let regex = new RegExp(`(?:^|[^a-zA-Z0-9])${word}(?:$|[^a-zA-Z0-9])`, 'i');
      return regex.test(string);
    });
  } else {
    return false;
  }
}

console.log('The WebSocket server is listening on port '+config.port);
