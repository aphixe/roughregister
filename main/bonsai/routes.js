(function () {
    "use strict";

    var request = require("request");

    module.exports = function (app) {
        app.get("/bonsai", function (req, res) {
            res.send("<form action='/bonsai' method='post'><input name='url' type='text'/><input type='submit'/></form>");
        });

        app.post("/bonsai", function (req, res) {
            try {
                request(req.body.url).pipe(res);
            } catch (e) {
                res.send(e.toString() + "<br>" + 
                    "<form action='/bonsai' method='post'><input name='url' type='text'/><input type='submit'/></form>");
            }
        });
    };
}());
