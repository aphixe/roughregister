(function () {
    "use strict";

    module.exports = function (app) {
        app.set("port", process.env.PORT || 5000);
    };
    
}());
