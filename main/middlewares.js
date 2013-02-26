(function () {
    "use strict";

    var express = require("express");

    module.exports = function (app) {
        log("adding bodyparser");
        app.use(express.bodyParser());
    };

}());
