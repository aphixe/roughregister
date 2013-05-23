var httpProxy = require("http-proxy"),
    proxy = new httpProxy.RoutingProxy();

module.exports = function (app) {
    app.use("/", function (req, res) {
        proxy.proxyRequest(req, res, {
            host: "localhost",
            port: 9000
        });
    });
};
