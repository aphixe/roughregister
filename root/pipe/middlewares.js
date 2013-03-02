(function () {
    "use strict";

    var express = require("../../express-fork");

    module.exports = function (app) {
        app.use(express.bodyParser());
    };
}());
