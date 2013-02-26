(function () {
    "use strict";

    var app = module.exports = require("express")();

    //require("./main").init(app);
    app.get("/", function (req, res) { res.send("clumsy"); });

    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Listening on " + port);
    });

}());
