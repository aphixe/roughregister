(function () {
    "use strict";

    var fs;

    fs = require("fs");

    exports.logging = function (debugging) {
        if (debugging) {
            return console.log;
        } else {
            return function () {};
        }
    };

    exports.getInput = function (filename, sanitizeInput, thenWhat) {
        return fs.readFile(filename, function (err, data) {
            var lines, text;
            if (err) {
                throw err;
            }
            text = data.toString("ascii");
            lines = text.split("\n") || [];
            return sanitizeInput(lines, thenWhat);
        });
    };
}());
