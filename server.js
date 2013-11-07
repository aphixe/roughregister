var app = require("apper")(__dirname);

if (app.init()) {
    //app.start(process.env.PORT || 3000);
}

process.on("uncaughtException", function (error) {
    console.log(error.stack);
});

var sockets = require("socket.io");

var server = require("http").createServer(app.expressApp),
    io = sockets.listen(server);

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

server.listen(process.env.PORT || 3000);