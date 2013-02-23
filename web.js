var express = require("express");

var app = express();

console.log(__dirname);
app.get("/", function (request, response) {
    response.send("Hello Worlds");
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
