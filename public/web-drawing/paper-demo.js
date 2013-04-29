var paper = window.paper,
    param = window.param,
    random = window.random,
    canvas = document.getElementById("canvas");

var rectangles = [],
    triangles = [];

window.onload = function () {
    paper.setup(canvas);

    var path;

    var canvasWidth = canvas.width,
        canvasHeight = canvas.height;

    var x1, y1, w, h, side;

    var i;
    for (i = 0; i < +param("rect"); i++) {
        x1 = random(0, canvasWidth);
        y1 = random(0, canvasHeight);
        w = random(0, canvasWidth) - x1;
        h = random(0, canvasHeight) - y1;

        path = new paper.Path.Rectangle(
            [x1, y1],
            [w, h]
        );
        path.strokeColor = "darkred";
        rectangles.push(path);
    }

    for (i = 0; i < +param("tri"); i++) {
        x1 = random(0, canvasWidth);
        y1 = random(0, canvasHeight);
        side = random(0, canvasHeight / 2);

        path = new paper.Path.RegularPolygon(new paper.Point(x1, y1), 3, side);
        path.strokeColor = "darkblue";
        triangles.push(path);
    }

    if (param("rotate")) {
        paper.view.onFrame = function () {
            var i;
            for (i = 0; i < rectangles.length; i += 1) {
                rectangles[i].rotate(2);
            }
            for (i = 0; i < triangles.length; i += 1) {
                triangles[i].rotate(-1);
            }
        };
    }
    paper.view.draw();

    var lastZoom = paper.view.getZoom();
    document.addEventListener("gesturechange", function (e) {
        var newZoom = lastZoom * e.scale;
        if (newZoom > 0.4 && newZoom < 10) {
            paper.view.setZoom(newZoom);
        }
    });
    document.addEventListener("gestureend", function (e) {
        lastZoom = paper.view.getZoom();
    });

    var lastPageX, lastPageY;
    document.addEventListener("touchstart", function (e) {
        if (e.targetTouches.length === 1) {
            var touch = e.targetTouches[0];
            lastPageX = touch.pageX;
            lastPageY = touch.pageY;
        }
        lastCenter = paper.view.getCenter();
        e.preventDefault();
    });
    document.addEventListener("touchmove", function (e) {
        if (e.targetTouches.length === 1) {
            var touch = e.targetTouches[0];
            var xDiff = touch.pageX - lastPageX,
                yDiff = touch.pageY - lastPageY;

            paper.view.setCenter(lastCenter.x - (xDiff / lastZoom), lastCenter.y - (yDiff / lastZoom));
        }
    });
    document.addEventListener("touchend", function (e) {
        if (e.targetTouches.length === 1) {
            //lastCenter = paper.view.getCenter();
        }
    });
};
