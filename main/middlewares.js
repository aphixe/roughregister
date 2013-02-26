(function () {
    "use strict";

    var express = require("express"),
        app = require("./main.js");

    module.exports = function () {
        app.use(express.bodyParser());
    };

}());
