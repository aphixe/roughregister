(function () {
    "use strict";

    var request = require("request");

    module.exports = function (app) {
        app.get("/", function (req, res) {
            res.send("Clumsy");
        });

        app.get("/pipe", function (req, res) {
            res.send("<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>");
        });

        app.post("/pipe", function (req, res) {
            try {
                request(req.body.url).pipe(res);
            } catch (e) {
                res.send("Invalid URL.<br>" + 
                    "<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>");
            }
        });
    };
}());
