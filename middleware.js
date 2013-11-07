module.exports = function (app, mountPath) {
    var io = app.socketIO,
        log = app.log;

    log("Testing socket.io support");

    io.on("connection", function (socket) {
        setInterval(function () {
            socket.emit("from root");
        }, 2000);
    });
};