(function () {
    "use strict";

    var app = require("./app");

    exports.initDefaultModules = function (load) {
        var modulesPresent = {};

        app.get("default modules").forEach(function (moduleName) {
            try {
                modulesPresent[moduleName] = load(moduleName);
            } catch (e) {}

            if (typeof modulesPresent[moduleName] === "function") {
                log("loading " + moduleName);
                modulesPresent[moduleName](app);
            }
        });
    };

}());
