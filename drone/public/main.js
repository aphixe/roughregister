var socket = io.connect(location.origin + "/drone");

socket.on("connect", function () {
    socket.emit("identification", { type: "player" });
});

socket.on("authorized", function () {
    sendLog("The playa is heya!");
});

var vote = socket.emit.bind(socket, "vote");

function sendLog(msg) {
    socket.send(msg);
    console.log(">> " + msg);
}
socket.on("message", function (msg) {
    console.log("    << " + msg);
});
