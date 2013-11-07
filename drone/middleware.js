module.exports = function (app, mountPath) {
    var io = app.socketIO,
        log = app.log;

    io.on("connection", function (socket) {
        socket.emit("connected");
    });
};