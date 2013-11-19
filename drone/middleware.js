var socketSetup = require("./sockets");

module.exports = function (app, mountPath) {

    app.use(app.express.bodyParser());

    app.mountPath = app.mountPath || mountPath;
    socketSetup(app);

};