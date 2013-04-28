(function () {
    "use strict";

    var methodsToOverride = [
        "insertBefore",
        "appendChild",
        "replaceChild"
    ];

    function getLocation(href) {
        var l = window.document.createElement("a");
        l.href = href;
        return l;
    }

    methodsToOverride.forEach(function (methodName) {
        var domMethod = HTMLElement.prototype[methodName];
        HTMLElement.prototype[methodName] = function (elem) {
            if (elem.src) {
                if (elem.nodeName === "SCRIPT" ||
                    elem.nodeName === "IMG" ||
                    elem.nodeName === "IFRAME") {
                    var l = getLocation(elem.src);
                    if (l.hostname === "localhost" ||
                        l.hostname === "www.roughregister.com") {
                        console.log("old script: " + elem.src);
                        l.host = window.EXTERNAL_HOST;
                        console.log("new script: " + l.href);
                    }
                    elem.src = l.href;
                }
            }
            return domMethod.apply(this, arguments);
        };
    });

}());
