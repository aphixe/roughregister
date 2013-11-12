// Roughregister
// 
// Contains all game logic
var votes = require("./votes"),
    animationDefaults = require("./animation-defaults");

module.exports = function (app, mountPath) {
    var io = app.socketIO;

    io.on("connection", function (socket) {
        socket.on("identification", function (identification) {
            if (identification.type === "drone") {
                if (io.clients("drone").length) {
                    sendLog("Sorry, we already have a drone!");
                    return;
                }

                socket.join("drone");
                socket.emit("authorized");
                sendLog("Hello, drone!");

                votes.emit("stop");
                votes.emit("start");

                socket.on("disconnect", function () {
                    votes.emit("stop");
                });

            } else if (identification.type === "player") {
                socket.join("players");
                socket.emit("authorized");
                sendLog("Hello, player!");
            }
        });

        socket.on("vote", function (vote) {
            if (io.manager.roomClients[socket.id][mountPath + "/players"]) {
                votes.emit("increment", vote.call, socket.id);
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

    votes.on("winner", function (animation, all) {
        io.in("drone").emit("action", {
            call: "animate",
            args: [animation].concat(animationDefaults[animation])
        });
        console.log(all);
    });

};