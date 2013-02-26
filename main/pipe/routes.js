(function () {
    "use strict";

    var request = require("request");

    var form = "<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>";

    function routeHandler(req, res) {
        var url = req.body && req.body.url;
        url = url || (req.query && req.query.url);

        if (url) {
            log("got url: " + url);
            try {
                request(url).pipe(res);
            } catch (e) {
                log("error piping url: " + url);
                res.send(e.toString() + "<br>" + form);
            }
        } else {
            log("no url in request");
            res.send(form);
        }
    }

    module.exports = function (app) {
        log("adding pipe routes");
        app.all("/pipe", routeHandler);
    };
}());
