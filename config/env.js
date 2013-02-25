(function () {
    "use strict";

    var currentEnv = process.env.NODE_ENV || "development";

    exports.env = {
        production: false,
        staging: false,
        test: false,
        development: false
    };
    exports.env[currentEnv] = true;
    
}());
