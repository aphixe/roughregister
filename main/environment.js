(function () {
    "use strict";

    module.exports = function () {
        var app = this;

        app.set("port", process.env.PORT || 5000);
    };
    
}());
