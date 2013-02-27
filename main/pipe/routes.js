(function () {
    "use strict";

    var request = require("request"),
        jsdom = require("jsdom"),
        _ = require("underscore");

    var form = "<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>";

    function routeHandler(req, res) {
        var url = req.body && req.body.url;
        url = url || (req.query && req.query.url);

        if (url) {
            log("got url: " + url);
            try {
                request(url, function (urlErr, urlRes, urlBody) {
                    jsdom.env(urlBody, ["http://code.jquery.com/jquery.js"], function (err, window) {
                        var $ = window.$;

                        var scripts = $("script").filter(function (i, elem) {
                            return elem.src;
                        });

                        function sendResponse() {
                            console.log("script length achieved: " + scripts.length);
                            res.send($("<div>").append($("html").clone()).remove().html());
                        }

                        var sendResponseWhenDone = _.after(scripts.length, sendResponse);
                        function newScriptSrc(scriptSrc, scriptSrcCallback) {
                            request(
                                "http://tinyurl.com/api-create.php?url=" + scriptSrc,
                                function (tinyErr, tinyRes, tinyBody) {
                                    var newUrl = "http://www.roughregister.com/pipe?url=" + tinyBody;
                                    scriptSrcCallback(newUrl);
                                    console.log("tinyUrl changed " + scriptSrc + " to " + newUrl);
                                }
                            );
                        }

                        scripts.each(function (index, elem) {
                            newScriptSrc(elem.src, function (src) {
                                elem.src = src;
                                sendResponseWhenDone();
                            });
                        });
                    });
                });
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
