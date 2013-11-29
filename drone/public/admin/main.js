var socket = io.connect(location.origin + "/drone");

socket.on("connect", connect);

function connect() {
	bootbox.hideAll();
	bootbox.prompt("Enter Admin Password", function (password) {
		socket.emit("identification", {
			type: "admin",
			password: password
		});
	});
}

socket.on("authorized", function () {
	$("body > .container").removeClass("inactive");
});

socket.on("unauthorized", connect);

var command = socket.emit.bind(socket, "command"),
    voting = socket.emit.bind(socket, "voting");

function sendLog(msg) {
    socket.send(msg);
    console.log(">> " + msg);
}
socket.on("message", function (msg) {
    humane.log(msg);
});


// UI Code

var windowHeight = $(window).height();
["command", "voting"].forEach(function (action) {

	$("[data-" + action + "]")
		.each(function () {
			var el = $(this),
				elWidth = el.width(),
				textEl = el.find(".text");
			
			var elHeight = windowHeight/4;
			el.height(elHeight);

			var fontSize = Math.min(elWidth, elHeight) / 2;

			var text =
				((action === "command" || el.data(action) === "end game")
					? ""
					: action) +
				" " + el.data(action);
			textEl
				.text(text)
				.css({
					bottom: (elHeight/12) + "px",
					right: (elWidth/10) + "px"
				});

			el.fitText(1.5);
		})
		.on("tap", run)
		.on("click", run);

	function run() {
		window[action]($(this).data(action));
	}
});
