var blogify = require("blogify");

module.exports = function (app) {
    app.use("/", blogify({
        rootDir: __dirname,
        postsDir: "posts",
        styles: "styles/bootstrap-custom.less"
    }));
};
