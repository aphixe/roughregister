(function () {
    "use strict";

    var request = require("request"),
        jsdom = require("jsdom"),
        _ = require("underscore");

    var form = "<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>";

    function routeHandler(req, res) {
        var url = (req.body && req.body.url) || (req.query && req.query.url),
            isJsRequest = (req.body && req.body.js) || (req.query && req.query.js);

        if (url) {
            log("got url: " + url);
            try {
                if (url.indexOf("//") === 0) {
                    url = "http:" + url;
                }
                if (isJsRequest) {
                    log("piping straight through: " + isJsRequest);
                    request(url).pipe(res);
                } else {
                    request(url, function (urlErr, urlRes, urlBody) {
                        jsdom.env({
                            html: urlBody,
                            src: [overrideInsertBefore],
                            scripts: [
                                "http://code.jquery.com/jquery.js",
                                "/public/pipe/overrideDocumentHeadInsertBefore.js"
                            ],
                            done: function (err, window) {
                                var $ = window.jQuery;

                                function sendResponse() {
                                    console.log("script length achieved: " + scripts.length);
                                    res.send($("<div>").append($("html").clone()).remove().html());
                                }

                                function newScriptSrc(scriptSrc, scriptSrcCallback) {
                                    request(
                                        "http://tinyurl.com/api-create.php?url=" + scriptSrc,
                                        function (tinyErr, tinyRes, tinyBody) {
                                            var newUrl = "/pipe?js=true&url=" + tinyBody;
                                            scriptSrcCallback(newUrl);
                                            console.log("tinyUrl changed " + scriptSrc + " to " + newUrl);
                                        }
                                    );
                                }

                                if ($) {
                                    log("got jQuery loaded on html page");
                                    var allScripts = $("script");
                                    
                                    var scripts = allScripts.filter(function (index) {
                                        return this.src;
                                    });

                                    var sendResponseWhenDone = _.after(scripts.length, sendResponse);
                                    scripts.each(function (index, elem) {
                                        newScriptSrc(elem.src, function (src) {
                                            elem.src = src;
                                            sendResponseWhenDone();
                                        });
                                    });
                                } else {
                                    res.send("window.alert('Sorry could not load jquery for jsdom');");
                                }
                            }
                        });
                    });
                }
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
        app.all("/pipe", routeHandler);
    };
}());
