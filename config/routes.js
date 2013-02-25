(function () {
    "use strict";

    var request = require("request");

    module.exports = function (app) {
        app.get("/", function (req, res) {
            res.send("Hello Ji");
        });

}());
