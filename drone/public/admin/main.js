var socket = io.connect(location.origin + "/drone");

socket.on("authorized", function () {
    sendLog("The admin is in the house, ladies and gentlemen!");
});

function connect() {
    socket.emit("identification", {
        type: "admin",
        password: byId("password").value
    });
}

var drone = socket.emit.bind(socket, "command"),
    voting = socket.emit.bind(socket, "voting"),
    streamVideo = socket.emit.bind(socket, "stream video");

function sendLog(msg) {
    socket.send(msg);
    console.log(">> " + msg);
}
socket.on("message", function (msg) {
    console.log("    << " + msg);
});

var byId = document.getElementById.bind(document);
