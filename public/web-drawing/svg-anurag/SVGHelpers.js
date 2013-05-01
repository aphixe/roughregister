function addTouchEvents(svg) {
    "use strict"

    var scaling = 1.0;
    var isTouchSupported = 'ontouchstart' in window;
    var isMouseEventSupported = "onmouseover" in window;

    $(document).on("mouseleave", function () {
       // alert("leaving");
    });

    /*
    * Handle zooming in and out for pinch action.
    * @param HammerEvent hammerEvent
    * @return void
    */
    function handlePinch(hammerEvent) {
        var e1 = new Object;
        e1.target = hammerEvent.gesture.target;
        if (hammerEvent.gesture.scale != scaling) {
            e1.wheelDelta = hammerEvent.gesture.distanceTravel; //? 70 : -70;
            scaling = hammerEvent.gesture.scale;
            e1.clientX = hammerEvent.gesture.center.pageX;
            e1.clientY = hammerEvent.gesture.center.pageY;
            handleMouseWheel(e1);
        }
    }

    $(svg.parentElement).on("mouseleave", function (evt) {
        var e1 = new Object;
        e1.target = evt.target;
        handleMouseUp(e1);
    });

    if (isTouchSupported) {
        /*
        * Handle touch events.
        */
        Hammer(svg, {
            prevent_default: true,
            no_mouseevents: true
        }).on("pinch", function (hammerEvent) {
            handlePinch(hammerEvent);
        }).on("dragstart", function (hammerEvent) {
            var e1 = new Object;
            e1.target = hammerEvent.gesture.target;
            e1.clientX = hammerEvent.gesture.center.pageX;
            e1.clientY = hammerEvent.gesture.center.pageY;
            handleMouseDown(e1);
        }).on("drag", function (hammerEvent) {
            var e1 = new Object;
            e1.target = hammerEvent.gesture.target;
            e1.clientX = hammerEvent.gesture.center.pageX;
            e1.clientY = hammerEvent.gesture.center.pageY;
            handleMouseMove(e1);
        }).on("dragend", function (hammerEvent) {
            var e1 = new Object;
            e1.target = hammerEvent.gesture.target;
            handleMouseUp(e1);
        }).on("touch", function (hammerEvent) {
            scaling = 1.0;
        });
    }
}

function SvgConverter(handler) {
    this.areaClickhandler = handler;
}

/*
 * Convert the JSON data to SVG image
 * @param $(div) container: the container in which the svg is displayed.
 * @param JSON metaDrawObject: data from server side, with all image and object information.
 */
SvgConverter.prototype.generateFromSVG = function (container, metaDrawObject) {
    //remove all event handlers if any.
    container.find("*").andSelf().unbind();

    //Create the svg element.
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttributeNS(null, "version", "1.1");
    svgElement.setAttributeNS(null, "baseProfile", "tiny");
    svgElement.setAttributeNS(null, "height", "100%");
    svgElement.setAttributeNS(null, "width", "100%");

    var svgViewPort = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgViewPort.setAttributeNS(null, "id", 'viewport');
    svgElement.appendChild(svgViewPort);

    if (metaDrawObject.ImagePath) {
        //Create svg image.
        var svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        svgImage.setAttributeNS(null, 'height', metaDrawObject.OriginalHeight);
        svgImage.setAttributeNS(null, 'width', metaDrawObject.OriginalWidth);
        svgImage.setAttributeNS(null, 'id', 'testimg2');
        svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', metaDrawObject.ImagePath);
        svgImage.setAttributeNS(null, 'x', '0');
        svgImage.setAttributeNS(null, 'y', '0');
        svgViewPort.appendChild(svgImage);
    }


    var self = this;
    var isTouchSupported = 'ontouchstart' in window;
    var isMouseEventSupported = "onmouseover" in window;

    //Add the shapes.
    $(metaDrawObject.Shapes).each(function (index, areaObject) {
        var svgShape = null;
        switch (areaObject.figure) {
            case "Rectangle":
                {
                    svgShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    svgShape.setAttributeNS(null, "id", areaObject.id);
                    svgShape.setAttributeNS(null, "x", areaObject.locX);
                    svgShape.setAttributeNS(null, "y", areaObject.locY);
                    svgShape.setAttributeNS(null, "rx", 5);
                    svgShape.setAttributeNS(null, "ry", 5);
                    svgShape.setAttributeNS(null, "width", areaObject.width);
                    svgShape.setAttributeNS(null, "height", areaObject.height);
                    svgShape.setAttributeNS(null, "fill", areaObject.fill);
                    svgShape.setAttributeNS(null, "stroke", areaObject.stroke);
                    svgViewPort.appendChild(svgShape);
                    break;
                }
            case "Eclipse":
                {
                    svgShape = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                    svgShape.setAttributeNS(null, "id", areaObject.id);
                    svgShape.setAttributeNS(null, "cx", areaObject.locX);
                    svgShape.setAttributeNS(null, "cy", areaObject.locY);
                    svgShape.setAttributeNS(null, "rx", areaObject.width);
                    svgShape.setAttributeNS(null, "ry", areaObject.height);
                    svgShape.setAttributeNS(null, "fill", areaObject.fill);
                    svgShape.setAttributeNS(null, "stroke", areaObject.stroke);
                    svgViewPort.appendChild(svgShape);
                    break;
                }
            case "Polygon":
                {
                    svgShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    svgShape.setAttributeNS(null, "id", areaObject.id);
                    svgShape.setAttributeNS(null, "d", areaObject.geometry);
                    svgShape.setAttributeNS(null, "transform", "translate(" + areaObject.locX + "," + areaObject.locY + ")");
                    svgShape.setAttributeNS(null, "fill", areaObject.fill);
                    svgShape.setAttributeNS(null, "rx", areaObject.width);
                    svgShape.setAttributeNS(null, "ry", areaObject.height);
                    svgShape.setAttributeNS(null, "stroke", areaObject.stroke);
                    break;
                }
        }

        //Check if we added a new shape, add it and assign handler to the same.
        if (svgShape) {
            areaObject.permissions = Math.random();
            svgViewPort.appendChild(svgShape);

            $(svgShape)
            .data("shapeData", areaObject);
            if (areaObject.permissions > 0.5) {
                $(svgShape).css({ "cursor": "pointer" });
            }
        }
    });

    container.empty();
    container[0].appendChild(svgElement);
    resetInternalState();
    //this sets the root object for svg pan.
    root = svgElement;

    var clickevent = isTouchSupported ? "tap" : "click";
    $(svgViewPort)
    .on(clickevent, function (evt) {
        if (self.areaClickhandler) {
            switch (evt.target.nodeName) {
                case "rect":
                case "ellipse":
                case "path":
                    {
                        self.areaClickhandler(evt.target);
                        $(".tooltip").css({
                            position: "fixed",
                            display: "inline",
                            top: evt.target.getBoundingClientRect().bottom,
                            left: evt.target.getBoundingClientRect().right
                        }).html($(evt.target).data("shapeData").id);
                    }
                    break;
                default:
                    $(".tooltip").css({
                        display: "none"
                    });
                    break;
            }
        }
    })

    setupHandlers(svgElement);
    addTouchEvents(svgElement);
    imageSize.height = originalImageSize.height = metaDrawObject.OriginalHeight;
    imageSize.width = originalImageSize.width = metaDrawObject.OriginalWidth;
    fitToPage();
}

$.fx.step["customSvgFill"] = function (fx) {
    if (!fx.isSet) {
        fx.start = parseColor(fx.elem.getAttributeNS(null, "fill"));
        fx.end = parseColor(fx.end);
        fx.isSet = true;
    }
    var colour = 'rgb(' + [
		Math.min(Math.max(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 0), 255),
		Math.min(Math.max(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 0), 255),
		Math.min(Math.max(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 0), 255)
	].join(',') + ')';
    fx.elem.setAttributeNS(null, "fill", colour);
}

/* Parse strings looking for common colour formats.
@param  colour  (string) colour description to parse
@return  (number[3]) RGB components of this colour */
function parseColor (colour) {
    var result;
    // Check if we're already dealing with an array of colors
    if (colour && colour.constructor == Array) {
        return (colour.length == 3 || colour.length == 4 ? colour : colours['none']);
    }
    // Look for rgb(num,num,num)
    if (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(colour)) {
        return [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)];
    }
    // Look for rgb(num%,num%,num%)
    if (result = /^rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)$/.exec(colour)) {
        return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55,
			parseFloat(result[3]) * 2.55];
    }
    // Look for #a0b1c2
    if (result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(colour)) {
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
    // Look for #abc
    if (result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(colour)) {
        return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16),
			parseInt(result[3] + result[3], 16)];
    }
    // Otherwise, we're most likely dealing with a named color
    return colours[$.trim(colour).toLowerCase()] || colours['none'];
};