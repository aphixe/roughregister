(function () {
    "use strict";

    var express = require("../../express-fork");

    module.exports = function (app) {
        app.use("/pipe", express.bodyParser());
        app.use("/public/pipe", express.static(__dirname + "/public"));
    };
}());
