(function () {

    window.snippets = {};
    window.codeblocks = {};

    var logQueue = [];
    window.log = function (arg) {
        if (typeof arg === "function") {
            logQueue.push(arg);
        } else if (typeof arg === "object" || arg == null || typeof arg === "string") {
            logQueue.push("<pre>" + JSON.stringify(arg) + "</pre>");
        } else {
            logQueue.push("<pre>" + arg.toString() + "</pre>");
        }
    };

    function makeSlideKey(indices) {
        return String(indices.h) + "/" + String(indices.v);
    }

    function currentSlideKey() {
        return makeSlideKey(Reveal.getIndices());
    }

    function currentSlideKeyFromElem(block) {
        var hSection = $(block).closest(".reveal > .slides > section"),
            vSection = $(block).closest(".reveal > .slides > section > section"),
            h = (hSection.length && hSection.index()) || 0,
            v = (vSection.length && vSection.index()) || 0;
        return makeSlideKey({ h: h, v: v });
    }

    function highlightLoaded() {
        $(document).ready(function () {
            $("pre code")
                .each(function (i, block) {
                    var slideKey = currentSlideKeyFromElem(block);
                    window.snippets[slideKey] = $(block).text();
                    window.codeblocks[slideKey] = $(block);

                    $("<div class='run-code' title='Run Code'></div>")
                        .insertBefore($(block).closest("pre"))
                        .bind("click", window.runCodeAndShowLog);
                    hljs.highlightBlock(block);
                })
                .on("focusout", function (e) {
                    var slideKey = currentSlideKeyFromElem(e.currentTarget);
                    window.snippets[slideKey] = $(e.currentTarget).text();
                    logQueue = [];
                    showingLogs = false;
                });
        });
    }

    var humane = window.humane;
    var logger = window.logger = humane.create({
        baseCls: "humane-jackedup",
        timeout: 3000
    });
    logger.success = logger.spawn({
        addnCls: "humane-jackedup-success",
        timeout: 1000
    });
    logger.error = logger.spawn({
        addnCls: "humane-jackedup-error",
        timeout: 4000
    });
    logger.info = logger.spawn({
        addnCls: "humane-jackedup-info",
        timeout: 1000
    });

    var previousSlideKey = null;
    var showingLogs = false;
    window.showLog = function showLog() {
        var slideKey = currentSlideKey(),
            logToShow;

        if (slideKey === previousSlideKey) {
            logger.remove();
            if (logQueue.length) {
                logToShow = logQueue.shift();
                if (typeof logToShow === "function") {
                    logToShow();
                } else {
                    logger.log(logToShow);
                }
            }
        } else {
            logQueue = [];
            window.runCode();
            showingLogs = false;
        }
    };

    window.runCode = function () {
        var slideKey = currentSlideKey();

        previousSlideKey = slideKey;
        logger.remove();
        if (window.snippets[slideKey] != null) {
            logQueue = [];
            setTimeout(function () {
                try {
                    eval(window.snippets[slideKey]);
                } catch (e) {
                    log(function () {
                        logger.error(
                            e.hasOwnProperty("toString") ?
                                e.toString() :
                                e.name + ": " + e.message
                        );
                    });
                } finally {
                    logger.info("Loaded");
                }
            }, 1);
        } else {
            logger.error("No code on this slide.");
        }
    };

    window.runCodeAndShowLog = function () {
        var slideKey = currentSlideKey();

        if (window.snippets[slideKey] !== window.codeblocks[slideKey].text()) {
            window.codeblocks[slideKey].blur();
        }
        setTimeout(function () {
            if (!showingLogs || previousSlideKey !== slideKey) {
                window.runCode();
                showingLogs = true;
            } else {
                if (!logQueue.length) {
                    logger.remove();
                    logger.info("Done");
                    showingLogs = false;
                } else {
                    window.showLog();
                }
            }
        }, 10);
    };

    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,

        keyboard: true,
        overview: true,
        loop: false,
        rtl: false,
        autoSlide: 0,
        rollingLinks: true,

        theme: "sky",
        transition: "default",

        // Optional libraries used to extend on reveal.js
        dependencies: [
            {
                src: "lib/js/classList.js",
                condition: function () { return !document.body.classList; }
            },
            {
                src: "plugin/highlight/highlight.js",
                async: true,
                callback: highlightLoaded
            }
        ]
    });

    new Remotes("anupbishnoi-nagarro-jsRevisited")
        .on("swipe-left", Reveal.right)
        .on("swipe-right", Reveal.left)
        .on("swipe-up", Reveal.down)
        .on("swipe-down", Reveal.up)
        .on("tap", runCodeAndShowLog)
        .on("hold", Reveal.toggleOverview);

}());
