log = console.log; // function () {}; // 
notify = console.log;

(function () {
    "use strict";

    var app = module.exports = require("./express-fork")();
    
    app.set("default modules", [
        "./environment",
        "./middlewares",
        "./routes"
    ]);

    app.util = require("./util.js");

    log("loading root");
    require("./root")(app);

    app.use(app.router);

    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        notify("Listening on " + port);
    });

}());
