(function () {
    "use strict";

    var request = require("request");

    module.exports = function (app) {
        app.get("/", function (req, res) {
            res.send("<form action='/yout' method='post'><input name='url' type='text'/><input type='submit'/></form>");
        });

        app.post("/yout", function (req, res) {
            request(req.body.url).pipe(res);
        });
    };

}());
