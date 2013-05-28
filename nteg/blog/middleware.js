var blogify = require("blogify");

module.exports = function (app) {
    app.use("/", blogify({
        root: ".",
        posts: "posts",
        urlFormat: "yy/mm/slug"
    }));
};
