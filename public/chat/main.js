(function () {
    if (window.io) {
        var socket = window.io.connect("/");

        $("form").submit(function (e) {
            socket.emit("message", $(".enter-message").val());
            return false;
        });
        socket.on("message", function (msg) {
            alert(msg);
        });
    } else {
        alert("WebSocket server is down. Sorry.");
    }
}());
