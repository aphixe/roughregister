(function () {
    "use strict";

    exports.init = function () {

        require("config/environment.js").call(app);
        require("config/middleware.js").call(app);

        // initialize the various apps
        ["pipe", "bonsai"].forEach(function (name) {
            require("apps/" + name + "/main.js").call(app, { baseRoute: name });
        });

    };

    exports.app = require("../app");
}());
