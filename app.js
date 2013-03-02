(function () {
    "use strict";

    var app = module.exports = require("apper");
    app.init("./root");
    app.start(process.env.PORT || 5000);

}());
