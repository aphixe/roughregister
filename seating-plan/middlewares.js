var express = require("express");

module.exports = function (app) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
};
