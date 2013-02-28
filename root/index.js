(function () {
    "use strict";

    module.exports = function (app) {
        app.util.init("/");

        log("loading " + "pipe");
        require("./pipe")(app);
    };

}());
