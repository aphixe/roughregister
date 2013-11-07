module.exports = function (app, mountPath) {
    var io = app.socketIO,
        log = app.log;

    log("Testing socket.io support");

    io.sockets.on("connection", function (socket) {
        console.log("yay");
        setInterval(function () {
            socket.emit("from socket");
        }, 2000);
    });
};