// Game logic built on socket.io
var votes = require("./votes"),
    animationDefaults = require("./animation-defaults"),
    password = require("./.password");

module.exports = function (app) {

    var io = app.socketIO;

    io.on("connection", function (socket) {
        socket.on("identification", function (identification) {
            var type = identification.type;

            if (type === "drone") {

                if (io.clients("drone").length) {
                    sendLog("Sorry, we already have a drone!");
                    return;
                }
                socket.join("drone");
                socket.emit("authorized");
                sendLog("Hello, drone!");

                socket.on("disconnect", function () {
                    votes.emit("stop");
                });

            } else if (type === "player") {

                socket.join("players");
                socket.emit("authorized");
                sendLog("Hello, player!");

            } else if (type === "admin") {

                if (identification.password === password) {
                    socket.join("admin");
                    socket.emit("authorized");
                    sendLog("Hello, admin!");
                } else {
                    sendLog("Wrong admin password!");
                }

            } else if (type === "projector") {

                socket.join("projector");
                socket.emit("authorized");
                sendLog("Hello, projector!");

            }
        });

        var socketId = socket.id;
        socket.on("vote", function (animation) {
            if (isSocketInRoom(socketId, "players")) {
                votes.emit("increment", animation, socket.id, sendLog);
            } else {
                sendLog("But you can't vote!");
            }
        });

        socket.on("command", function (command) {
            if (isSocketInRoom(socketId, "admin")) {
                io.in("drone").emit("action", {
                    call: command,
                    args: [].slice.call(arguments, 1)
                });
            } else {
                sendLog("But you can't command the drone!");
            }
        });

        socket.on("voting", function (command) {
            if (isSocketInRoom(socketId, "admin")) {
                votes.emit(command);
                sendLog("Voting " + command + "s!");
            } else {
                sendLog("Gotta be admin to start/stop voting..");
            }
        });

        socket.on("stream video", function () {
            if (isSocketInRoom(socketId, "admin")) {
                io.in("projector").emit("stream video");
            } else {
                sendLog("Only admins can start video streaming on projector.");
            }
        });

        socket.on("navdata", function (navdata) {
            if (isSocketInRoom(socketId, "drone")) {
                io.in("projector").emit("navdata", navdata);
            }
        });


        function sendLog(msg) {
            socket.send(msg);
            app.log(">> " + msg);
        }
        socket.on("message", function (msg) {
            app.log("    << " + msg);
        });
    });

    votes.on("log", function (msg) {
        app.log(msg);
    });

    votes.on("winner", function (winning) {
        var animation = winning.animation,
            player = winning.player;

        if (player) {
            app.log("Winning animation: " + animation);
            app.log("Winning player: " + player);
            io.in("projector").emit("winner", player);
        }

        setTimeout(function () {
            io.in("drone").emit("action", {
                call: "animate",
                args: [animation].concat(animationDefaults[animation])
            });
        }, 1000);
    });

    function isSocketInRoom(socketId, roomId) {
        return io.manager.roomClients[socketId][app.mountPath + "/" + roomId];
    }
};