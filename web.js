(function () {
    "use strict";

    var express = require("express"),
        app = express();

    require("./config/middleware.js")(app);
    require("./config/routes.js")(app);

    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Listening on " + port);
    });

}());
