var socket = io.connect("http://localhost:3000/drone");

socket.on("connect", function () {
    socket.emit("identification", { type: "player" });

    socket.on("authorized", function () {
        sendLog("The playa is heya!");
    });
});

function vote(call) {
    socket.emit("vote", { call: call });
}

function sendLog(msg) {
    socket.send(msg);
    console.log(">> " + msg);
}
socket.on("message", function (msg) {
    console.log("    << " + msg);
});