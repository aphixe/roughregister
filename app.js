log = function () {}; // console.log;
notify = console.log;

(function () {
    "use strict";

    var app = module.exports = require("express")();
    
    app.set("default modules", [
        "./environment",
        "./middlewares",
        "./routes"
    ]);

    app.util = require("./util.js");

    log("loading " + "main");
    require("./main")(app);

    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        notify("Listening on " + port);
    });

}());
