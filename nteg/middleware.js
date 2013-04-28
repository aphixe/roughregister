var pushover = require("pushover");
var repos = pushover(__dirname + "/src");

module.exports = function (app) {
    app.use("/src", function (req, res) {
        repos.handle(req, res);
    });
};
