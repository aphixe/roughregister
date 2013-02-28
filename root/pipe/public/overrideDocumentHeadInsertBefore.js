(function () {
    "use strict";

    var head = document.getElementsByTagName('head')[0];
    var insertBefore = head.insertBefore;
    head.insertBefore = function () {
        alert('adding script!');
        insertBefore.apply(this, arguments);
    }

}());
