(function () {
    "use strict";

    var express = require("express");

    module.exports = function (app) {
        app.use(express.bodyParser());
    };
}());
