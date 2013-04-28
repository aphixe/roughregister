(function () {
    "use strict";

    module.exports = function (app) {
        app.get("/", function (req, res) {
            res.send("List of all repositories");
        });
    };
}());
