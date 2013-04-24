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

        console.log(x1, y1);
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
};
