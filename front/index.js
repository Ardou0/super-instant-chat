let socket;
let reconnectInterval;

function createWebSocket() {
    socket = new WebSocket("ws://172.25.84.160:2096");

    socket.addEventListener("open", () => {
        console.log("Connected to the socket");
        document.querySelector(".glow-light").style.animation = '';

        // Vérifie et annule l'intervalle de reconnexion s'il est actif
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null; // Réinitialise la variable pour éviter les répétitions
            console.log("Reconnection interval cleared.");
        }
    });

    socket.addEventListener("message", (message) => {
        let data = JSON.parse(message.data);
        console.log(data);
        if (data.type === "message") {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');

            const senderDiv = document.createElement('div');
            senderDiv.classList.add('message-sender');
            senderDiv.textContent = data.sender;

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = data.content;

            messageDiv.appendChild(senderDiv);
            messageDiv.appendChild(contentDiv);

            document.querySelector('.chat-messages').appendChild(messageDiv); 
            document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').clientHeight
        }
    });

    socket.addEventListener("error", () => {
        console.log("Socket encountered an error. Attempting to reconnect...");
        document.querySelector(".glow-light").style.animation = "spinError 8s linear infinite alternate";
    });

    socket.addEventListener("close", () => {
        console.log("Socket is closed. Attempting to reconnect...");
        document.querySelector(".glow-light").style.animation = "spinError 8s linear infinite alternate";
        attemptReconnect();
    });
}

function attemptReconnect() {
    if (!reconnectInterval) { // Vérifie si une reconnexion est déjà en cours
        reconnectInterval = setInterval(() => {
            console.log("Attempting to reconnect...");
            createWebSocket();
        }, 5000); // Essaie de se reconnecter toutes les 5 secondes
    }
}

function sendMessage() {
    let message = document.getElementById("message-input").value;
    let data = JSON.stringify({ "type": "message", "content": message });
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
        document.getElementById("message-input").value = "";
    } else {
        console.log("Socket is not open. Message not sent.");
    }
}

document.getElementById("message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".glow-light").classList.add("glow-light-loaded-up");
        setTimeout(() => {
            document.getElementById("main-chat").classList.add("chat-loaded");
        }, 2000);
    }, 3000);
    createWebSocket();
});
