var app = require("apper")();

if (app.init()) {
    app.start(process.env.PORT || 8000);
}

process.on("uncaughtException", function (error) {
    console.log(error.stack);
});
