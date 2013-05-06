var url = require("url"),
    path = require("path");

var cgi = require("cgi");

var configDefaults;

var perlConfigPath = __dirname + "/cgi/gitweb_config.perl",
    gitwebCgiPath = __dirname + "/cgi/gitweb.cgi";

module.exports = function (mountPoint, config) {
    /*jshint proto:true, forin:false */
    config = config || {};
    config["__proto__"] = configDefaults;

    // The Environment configuration for the "gitweb" CGI spawn
    var env = {
        // The Config File just reads all of it's configuration
        // from environment variables that are set below
        GITWEB_CONFIG_SYSTEM: perlConfigPath
    };

    // Extend the "env" with the user-defined config properties.
    for (var prop in config) {
        env["NODE_GITWEB_" + prop.toUpperCase()] = config[prop];
    }

    return require("cgi")(gitwebCgiPath, {
        mountPoint: mountPoint,
        env: env,
        stderr: process.stderr
    });
};

// The default "config" options to use.
configDefaults = {
    "projectroot": process.env.HOME,
    get homelink() {
        return this.projectroot;
    },
    "sitename": "GitWeb powered by Node",
    "version": "1.7.9",
    "max_depth": "100",

    //"pathinfo": 1,

    "avatar_default": "gravatar",
    "avatar_override": 0,

    "blame_default": 1,
    "blame_override": 1,

    "snapshot_default": "zip",
    "snapshot_override": 1
};
