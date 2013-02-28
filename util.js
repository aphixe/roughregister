(function () {
    "use strict";

    var app = require("./app");
    var express = require("express");

    var rootPath = "./root";

    exports.init = function (path) {
        var modulesPresent = {};

        var dirPath = rootPath + "/" + path;
        app.get("default modules").forEach(function (moduleName) {
            try {
                // assumes path to be "/", "/pipe", etc (relative to root folder)
                modulesPresent[moduleName] = require(dirPath + "/" + moduleName);
            } catch (e) {}

            if (typeof modulesPresent[moduleName] === "function") {
                log("loading " + moduleName);
                modulesPresent[moduleName](app);
            }
        });
        app.use("/public" + path, express.static(dirPath + "/public"));
    };

}());
