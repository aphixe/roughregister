var raphael = window.Raphael,
    param = window.param,
    random = window.random;

var rectangles = [],
    triangles = [];

window.onload = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var paper = raphael(0, 0, width, height);

    var path;

    var x1, y1, w, h;

    var i;
    for (i = 0; i < +param("rect"); i++) {
        x1 = random(0, width);
        y1 = random(0, height);
        w = random(0, width - x1);
        h = random(0, height - y1);

        path = paper.rect(x1, y1, w, h);
        path.attr("stroke", "darkblue");
        rectangles.push(path);
    }

    var triX, triY, side;
    for (i = 0; i < +param("tri"); i++) {
        triX = random(0, width);
        triY = random(0, height);
        side = random(0, height / 2);

        path = paper.path(
            "M" + triX + "," + triY + " " +
            "L" + (triX - side) + "," + (triY + (2 * side)) + " " +
            "L" + (triX + side) + "," + (triY + (2 * side)) + " z"
        );
        path.attr("stroke", "darkred");
        triangles.push(path);
    }

    if (param("rotate")) {
        for (i = 0; i < rectangles.length; i += 1) {
            rectangles[i].animate({ "transform": "R72000" }, 1000000);
        }
        for (i = 0; i < triangles.length; i += 1) {
            triangles[i].animate({ "transform": "R-36000" }, 1000000);
        }
    }
};
