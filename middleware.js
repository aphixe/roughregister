module.exports = function (app, mountPath) {
    var io = app.socketIO,
        log = app.log;

    log("Testing socket.io support");

    io.sockets.on("connection", function (socket) {
        setInterval(function () {
            socket.emit("from root");
        }, 2000);
    });
    io.sockets.on("connection", function () { console.log("lo bhai multiple"); });
};