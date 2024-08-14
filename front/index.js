const socket = new WebSocket("ws://172.25.84.160:2096");

socket.addEventListener("open", () => {
    console.log("Connected to the socket");
})

socket.addEventListener("message", (message) => {
    console.log(message)
})

function sendMessage(message) {
    let data = JSON.stringify({ "type": "message", "content": message });
    socket.send(data);
}

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".glow-light").classList.add("glow-light-loaded-up");
    }, 3000);
})