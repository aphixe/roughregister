var paper = window.paper,
    hammer = window.Hammer,
    _ = window._;

var lastZoom;

var setZoom = _.throttle(function (scale) {
    if (scale > 0.4 && scale < 10) {
        paper.view.setZoom(scale);
    }
}, 10);

function setupEvents() {
    hammer(document, { prevent_default: true })
        .on("pinch", function (evt) {
            setZoom(evt.gesture.scale);
        });


    //document.addEventListener("gesturechange", function (e) {
    //});
    //document.addEventListener("gestureend", function (e) {
        //lastZoom = paper.view.getZoom();
    //});

    //var lastPageX, lastPageY, lastCenter;
    //document.addEventListener("touchstart", function (e) {
        //if (e.targetTouches.length === 1) {
            //var touch = e.targetTouches[0];
            //lastPageX = touch.pageX;
            //lastPageY = touch.pageY;
        //}
        //lastCenter = paper.view.getCenter();
        //e.preventDefault();
    //});
    //document.addEventListener("touchmove", function (e) {
        //if (e.targetTouches.length === 1) {
            //var touch = e.targetTouches[0];
            //var xDiff = touch.pageX - lastPageX,
                //yDiff = touch.pageY - lastPageY;

            //paper.view.setCenter(lastCenter.x - (xDiff / lastZoom), lastCenter.y - (yDiff / lastZoom));
        //}
    //});
    //document.addEventListener("touchend", function (e) {
        //if (e.targetTouches.length === 1) {
            ////lastCenter = paper.view.getCenter();
        //}
    //});
}
