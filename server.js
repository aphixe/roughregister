var app = require("apper")();

if (app.init()) {
    app.start(process.env.PORT || 8000);
}
