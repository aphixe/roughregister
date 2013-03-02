(function () {
    "use strict";

    var request = require("request"),
        jsdom = require("jsdom"),
        _ = require("underscore"),
        log = require("apper/lib/logger");

    var form = "<form action='/pipe' method='post'><input name='url' type='text'/><input type='submit'/></form>";

    var cachedTinyUrl = {},
        tinyUrlRequesting = {},
        tinyUrlId = 0;

    function routeHandler(req, res) {
        var url = (req.body && req.body.url) || (req.query && req.query.url),
            nonHtmlRequest = (req.body && req.body.nonhtml) || (req.query && req.query.nonhtml);

        if (url === "http://tinyurl.com/18r") {
            // it's a request for about:blank
            res.send("");
        } else if (url) {
            log("got url:\n" + url + "\n");
            try {
                if (url.indexOf("//") === 0) {
                    url = "http:" + url;
                }

                var externalUrl = url.replace(/\/$/, ""),
                    externalHost = externalUrl
                        .replace("http://", "")
                        .replace("https://", "");

                if (nonHtmlRequest) {
                    request(url).pipe(res);
                } else {
                    request(url, function (urlErr, urlRes, urlBody) {
                        jsdom.env({
                            html: urlBody,
                            scripts: [
                                "http://code.jquery.com/jquery.js"
                            ],
                            done: function (err, window) {
                                var $ = window.jQuery;

                                function srcResources() {
                                    var rs = $("script")
                                        .add($("img"))
                                        .add($("iframe"))
                                        .filter(function () {
                                            return this.src && this.src !== "about:blank";
                                        });
                                    return rs;
                                }
                                
                                function sendResponse() {
                                    srcResources()
                                        .filter(function () {
                                            return cachedTinyUrl[this.src];
                                        }).each(function () {
                                            this.src = cachedTinyUrl[this.src];
                                        });
                                    res.send($("<div>").append($("html").clone()).remove().html());
                                }

                                function getTinyUrl(sourceUrl, tinyCallback) {
                                    if (cachedTinyUrl[sourceUrl]) {
                                        tinyCallback(cachedTinyUrl[sourceUrl]);
                                    } else if (tinyUrlRequesting[sourceUrl]) {
                                        tinyCallback(sourceUrl);
                                    } else {
                                        tinyUrlRequesting[sourceUrl] = true;
                                        request(
                                            "http://tinyurl.com/api-create.php?url=" + sourceUrl,
                                            function (tinyErr, tinyRes, tinyBody) {
                                                if (tinyBody === "Error") {
                                                    log("TINYURL ERROR for:\n" + sourceUrl + "\n");
                                                    tinyCallback(sourceUrl);
                                                } else {
                                                    var newUrl = "/pipe?nonhtml=true&url=" + tinyBody;
                                                    log("got tinyUrl for:\n" + sourceUrl + "\n" + tinyBody + "\n");
                                                    cachedTinyUrl[sourceUrl] = newUrl;
                                                    tinyCallback(newUrl);
                                                }
                                            }
                                        );
                                    }
                                }

                                if ($) {
                                    log("got jQuery loaded on html page\n");
                                    var resources = srcResources();

                                    $("<script>").attr("src", "/pipe/public/overrideDomMethods.js")
                                        .insertBefore($("head").children(":first"));
                                    $("<script>").text("window.EXTERNAL_HOST = '" + externalHost + "';")
                                        .insertBefore($("head").children(":first"));

                                    var sendResponseWhenDone = _.after(resources.length, sendResponse);
                                    resources.each(function (index, elem) {
                                        var elemSrc = elem.src;

                                        if (elemSrc.indexOf("//") === 0) {
                                            elemSrc = "http:" + elemSrc;
                                        } else if (elemSrc.indexOf("/") === 0) {
                                            log("changed local url:" + elemSrc);
                                            elemSrc = externalUrl + elemSrc;
                                            log("to:" + elemSrc + "\n");
                                        }

                                        getTinyUrl(elemSrc, function (src) {
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
                log("error piping url:\n" + url + "\n");
                res.send(e.toString() + "<br>" + form);
            }
        } else {
            log("no url in request\n");
            res.send(form);
        }
    }

    module.exports = function (app) {
        app.all(routeHandler);
    };
}());
