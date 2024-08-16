let socket;
let reconnectInterval;
let serverUrl;

function createWebSocket() {
    socket = new WebSocket("ws://" + serverUrl);

    socket.addEventListener("open", () => {
        console.log("Connected to the socket");
        document.querySelector(".header-title").innerText = "CHAT: " + serverUrl
        document.querySelector('.chat-messages').innerHTML = "";
        setTimeout(() => {
            openInterface()
        }, 3000);
        document.querySelector(".glow-light").style.animation = '';

        // check if the interval is up
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null; // reset the interval to avoid bug
            console.log("Reconnection interval cleared.");
        }
    });

    socket.addEventListener("message", (message) => {
        let data = JSON.parse(message.data);
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
        if (data.type === "error") {
            showNotification(data.content, data.type);
        }
        if (data.type === "notification") {
            showNotification(data.content, data.type);
        }
    });

    socket.addEventListener("close", () => {
        console.log("Socket is closed. Attempting to reconnect...");
        document.querySelector(".glow-light").style.animation = "spinError 8s linear infinite alternate";
        closeInterface();
        attemptReconnect();
    });
}

function attemptReconnect() {
    if (!reconnectInterval) { // Check if interval already started
        reconnectInterval = setInterval(() => {
            console.log("Attempting to reconnect...");
            createWebSocket();
        }, 5000); // reconnect each 5 secondes
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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    if (type == "error") { notification.classList.add('notification-error'); }
    notification.textContent = message;

    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}


document.getElementById("message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

function openInterface() {
    document.querySelector(".glow-light").classList.add("glow-light-loaded-up");
    setTimeout(() => {
        document.getElementById("main-chat").classList.add("chat-loaded");
    }, 2000);
}

function closeInterface() {
    document.getElementById("main-chat").classList.remove("chat-loaded");
    document.querySelector(".glow-light").classList.remove("glow-light-loaded-up");
}

document.querySelectorAll('.chat-emojis').forEach(component => {
    component.childNodes.forEach(element => {
        if (element.classList) {
            element.addEventListener("click", () => {
                document.getElementById("message-input").value = document.getElementById("message-input").value + element.innerText
            });
        }
    });
});

function loadServers() {
    const serverList = document.getElementById('server-list');
    const servers = JSON.parse(localStorage.getItem('sicServers')) || [];

    // Reset the list before populating it
    if (servers.length == 0) {
        serverList.innerHTML = '<option value="" disabled selected>Add a Server </option>';
    }
    else {
        // Add each server to the dropdown list
        serverList.innerHTML = "";
        let i = 0;
        servers.forEach(server => {
            const option = document.createElement('option');
            option.value = server;
            option.textContent = server;

            if (i == 0) {
                option.selected = true;
                serverUrl = server;
                createWebSocket();
            }
            
            serverList.appendChild(option);
            i++;
        });

    }

}

function addServer() {
    const serverInput = document.getElementById('add-server-input');
    let newServer = serverInput.value.trim();

    // Check if the '//' pattern is present in the string
    if (newServer.includes('//')) {
        newServer = newServer.split('//')[1]; // Split and take the part after '//'
    }

    if (newServer) {
        let servers = JSON.parse(localStorage.getItem('sicServers')) || [];
        if (!servers.includes(newServer)) {
            servers.push(newServer);
            localStorage.setItem('sicServers', JSON.stringify(servers));
        }
        loadServers();
        serverInput.value = ''; // Reset the input field
    }
}


window.addEventListener('load', () => {
    loadServers();

    document.getElementById('add-server-btn').addEventListener('click', addServer);

    document.getElementById('server-list').addEventListener('change', (event) => {
        const selectedServer = event.target.value;
        console.log('Selected server:', selectedServer);
        closeInterface();
        socket.close();
        serverUrl = selectedServer;
        createWebSocket();
    });
});

function openServerSelector() {
    document.querySelector(".server-selector").classList.toggle("server-selector-active");
}

function clearServerList() {
    localStorage.removeItem('sicServers');
    window.location = "";
}

function exportServerList() {
    // Retrieve the server list from localStorage
    const servers = JSON.parse(localStorage.getItem('sicServers')) || [];

    // Create the file content
    const content = servers.join('\n');

    // Create a blob containing the file content
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to allow file download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'server-list.txt'; // Name of the file to download
    a.style.display = 'none';

    // Add the <a> element to the document
    document.body.appendChild(a);

    // Simulate a click on the <a> element to trigger the download
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
