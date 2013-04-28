/*
Admission Test Seating Plan Generator - For Vidyamandir Classes
By Anup Bishnoi (anupbishnoi@gmail.com)
*/

(function () {
    "use strict";
    /*jshint maxparams:7, loopfunc:true */

    var _ = require("underscore");

    var PDFDocument, getInput, log, logoFile, makePlan, makeStickers;

    PDFDocument = require("pdfkit");

    logoFile = "./pdf/vmclogo.jpg";

    log = function () {};

    getInput = require("./helpers").getInput;

    exports.generate = function (logger, seatidsInput, outputFolder, seatingPlan, settings, callback) {
        var addBufferSeatids, center, plan, planPath, sanitizeInput, stickers, stickersPath;
        if (typeof logger === "function") {
            log = logger;
        }
        log("Seat IDs input file: " + seatidsInput);
        log("Seating Plan: " + (JSON.stringify(seatingPlan)));
        log("Graphic Settings: " + (JSON.stringify(settings)));
        center = seatingPlan.center.trim().replace(/\s+/g, "_");
        planPath = "" + outputFolder + "/SeatingPlan " + seatingPlan.studyingIn + " " + center + ".pdf";
        stickersPath = "" + outputFolder + "/Stickers " + seatingPlan.studyingIn + " " + center + ".pdf";
        log("Output files: " + planPath + " and " + stickersPath);
        plan = new PDFDocument({
            margin: 0,
            info: {
                Title: "Seating Plan for Admission Test in " + seatingPlan.center,
                Author: "Anup Bishnoi"
            },
            size: "A4"
        });
        stickers = new PDFDocument({
            margin: 0,
            info: {
                Title: "Stickers for Admission Test in " + seatingPlan.center,
                Author: "Anup Bishnoi"
            },
            size: "A4"
        });
        sanitizeInput = function (lines, thenWhat) {
            var column, data, field, index, line, seatidIndex, _i, _j, _len, _len1, _ref, _ref1;
            seatidIndex = 0;
            if (lines.length === 0) {
                return thenWhat(lines, 0);
            }
            _ref = lines[0].split(",");
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                column = _ref[index];
                if (column.search(/seat/i) !== -1) {
                    seatidIndex = index;
                    break;
                }
            }
            log("Column index #" + seatidIndex + " contains Seat IDs");
            data = [];
            _ref1 = lines.slice(1);
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                line = _ref1[_j];
                if (line.indexOf(",") !== -1) {
                    data.push((function () {
                        var _k, _len2, _ref2, _results;
                        _ref2 = line.split(",");
                        _results = [];
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            field = _ref2[_k];
                            _results.push(field.trim());
                        }
                        return _results;
                    })());
                }
            }
            data.sort(function (a, b) {
                return parseInt(a[seatidIndex].match(/\d+$/), 10) - parseInt(b[seatidIndex].match(/\d+$/), 10);
            });
            return thenWhat(data, seatidIndex);
        };
        addBufferSeatids = function (buffer, data, seatidIndex) {
            var arr, i, _i;
            if (data.length === 0) {
                return data;
            }
            for (i = _i = 0; 0 <= buffer ? _i < buffer : _i > buffer; i = 0 <= buffer ? ++_i : --_i) {
                arr = [];
                arr[seatidIndex] = data[data.length - 1][seatidIndex].replace(/\d+$/, function (id) {
                    return 1 + parseInt(id, 10);
                });
                data.push(arr);
            }
            return data;
        };
        return getInput(seatidsInput, sanitizeInput, function (data, seatidIndex) {
            var allotted, buffer, howMany, index, line, perRoom, r, required, rooms, _i, _j, _len, _ref, _ref1;
            seatingPlan.entries = [];
            seatingPlan.idsAndRooms = [];
            rooms = seatingPlan.roomlist;
            perRoom = seatingPlan.perRoom;
            buffer = seatingPlan.buffer;
            try {
                if (data.length === 0) {
                    throw new Error("No SeatID records in file.");
                }
                data = addBufferSeatids(buffer, data, seatidIndex);
                required = Math.ceil(data.length / perRoom);
                log("Number of available rooms: " + rooms.length);
                log("Number of students: " + data.length);
                log("Rooms required: " + required);
                if (rooms.length < required) {
                    throw new Error("Rooms not enough. Need " + (required - rooms.length) + " more.");
                } else if (rooms.length > required) {
                    howMany = rooms.length - required;
                    throw new Error(("" + howMany + " " + (howMany === 1 ? "room is" : "rooms are") + " extra.") + ("Please remove " + (howMany === 1 ? "it" : "them") + " first."));
                } else {
                    for (index = _i = 0, _ref = data.length; 0 <= _ref ? _i < _ref : _i > _ref; index = _i += perRoom) {
                        allotted = rooms[index / perRoom];
                        seatingPlan.entries.push({
                            from: data[index][seatidIndex],
                            to: data[Math.min(index + perRoom, data.length) - 1][seatidIndex],
                            room: allotted.room,
                            floor: allotted.floor
                        });
                        r = seatingPlan.entries[seatingPlan.entries.length - 1];
                        log("Room " + r.room + " (" + r.floor + ") has " + r.from + " - " + r.to);
                        _ref1 = data.slice(index, index + perRoom);
                        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                            line = _ref1[_j];
                            seatingPlan.idsAndRooms.push({
                                id: line[seatidIndex],
                                room: allotted.room
                            });
                        }
                    }
                }
                return makePlan(plan, seatingPlan, settings, function (plan) {
                    return plan.write(planPath, function () {
                        log("" + planPath + " saved.");
                        return makeStickers(stickers, seatingPlan, settings, function (stickers) {
                            return stickers.write(stickersPath, function () {
                                var filenames;
                                log("" + stickersPath + " saved.");
                                filenames = {
                                    planPdf: "/" + (planPath.split("/public/")[1]),
                                    stickersPdf: "/" + (stickersPath.split("/public/")[1])
                                };
                                return callback(void 0, filenames);
                            });
                        });
                    });
                });
            } catch (err) {
                log(err);
                return callback(err);
            }
        });
    };

    makeStickers = function (doc, seatingPlan, settings, thenWhat) {
        var docHeight, docWidth, entry, entryLeft, entryTop, index, marginH, marginV, nPerpage, pageno, pages, roomnoFontsize, roomnoLeft, roomnoMargin, roomnoTop, seatidFontsize, stickerWidth, stickersLeft, stickersTop, totalColumns, totalRows, _i, _j, _len, _ref;
        docWidth = settings.docWidth;
        docHeight = settings.docHeight;
        stickersLeft = settings.stickersLeft;
        stickersTop = settings.stickersTop;
        stickerWidth = settings.stickerWidth;
        docWidth = parseInt(docWidth, 10) || 554;
        docHeight = parseInt(docHeight, 10) || 809;
        stickersTop = parseInt(stickersTop, 10) || 74;
        stickersLeft = parseInt(stickersLeft, 10) || 25;
        stickerWidth = parseInt(stickerWidth, 10) || 110;
        log("Doc width: " + docWidth);
        log("Doc height: " + docHeight);
        log("Stickers page left margin: " + stickersLeft);
        log("Stickers page top margin: " + stickersTop);
        log("Sticker width: " + stickerWidth);
        totalColumns = 4;
        totalRows = 20;
        seatidFontsize = 19;
        roomnoFontsize = seatidFontsize / 2;
        roomnoMargin = 2;
        marginH = (docWidth - totalColumns * stickerWidth) / (totalColumns - 1);
        marginV = (docHeight - stickersTop - totalRows * seatidFontsize) / (totalRows - 1);
        log("Horizontal margin between stickers: " + marginH);
        log("Vertical margin between stickers: " + marginV);
        nPerpage = totalRows * totalColumns;
        pages = Math.ceil(seatingPlan.idsAndRooms.length / nPerpage);
        log("Number of sticker pages: " + pages);
        doc.font("Times-Roman");
        for (pageno = _i = 0; 0 <= pages ? _i < pages : _i > pages; pageno = 0 <= pages ? ++_i : --_i) {
            if (pageno > 0) {
                doc.addPage();
            }
            _ref = seatingPlan.idsAndRooms.slice(pageno * nPerpage, (pageno + 1) * nPerpage);
            for (index = _j = 0, _len = _ref.length; _j < _len; index = ++_j) {
                entry = _ref[index];
                doc.fillColor("black");
                doc.fontSize(seatidFontsize);
                entryLeft = stickersLeft + (index % 4) * (stickerWidth + marginH);
                entryTop = stickersTop + Math.floor(index / 4) * (seatidFontsize + marginV);
                doc.text(entry.id, entryLeft, entryTop);
                doc.fillColor("gray");
                doc.fontSize(roomnoFontsize);
                roomnoLeft = entryLeft + stickerWidth - doc.widthOfString(entry.room);
                roomnoTop = entryTop + seatidFontsize - roomnoFontsize;
                doc.text(entry.room, roomnoLeft, roomnoTop);
                doc.strokeColor("gray");
                doc.roundedRect(roomnoLeft - roomnoMargin, roomnoTop - roomnoMargin, doc.widthOfString(entry.room) + 2 * roomnoMargin, roomnoFontsize + 2 * roomnoMargin, 1);
                doc.stroke();
            }
        }
        return thenWhat(doc);
    };

    makePlan = function (doc, seatingPlan, settings, thenWhat) {
        var calculatedvalue, column1, column2, column3, columnProportions, decimalvalue, docHeight, docWidth, entry, entryHeight, font, fontSize, headingFont, headingFontsize, i, index, logo, logoHeader, margin, maxHeight, message, messageHeight, n, nMaxperpage, nPerpage, nSum, nThispage, num, pageno, pages, proportionSum, row, rowMaxHeight, rowMinHeight, startEntry, sum, table, titleFontsize, titlerow, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
        if (settings == null) {
            settings = {};
        }
        docWidth = settings.docWidth;
        docHeight = settings.docHeight;
        font = settings.font;
        headingFont = settings.headingFont;
        fontSize = settings.fontSize;
        titleFontsize = settings.titleFontsize;
        headingFontsize = settings.headingFontsize;
        margin = settings.margin;
        logo = settings.logo;
        titlerow = settings.titlerow;
        rowMinHeight = settings.rowMinHeight;
        rowMaxHeight = settings.rowMaxHeight;
        table = settings.table;
        columnProportions = settings.columnProportions;
        logoHeader = settings.logoHeader;
        margin = parseInt(margin, 10) || 15;
        docWidth = parseInt(docWidth, 10) || 600;
        docHeight = parseInt(docHeight, 10) || 841;
        fontSize = parseInt(fontSize, 10) || 16;
        row = {};
        row.minHeight = parseInt(rowMinHeight, 10) || 30;
        row.maxHeight = parseInt(rowMaxHeight, 10) || 60;
        font = font || "Times-Roman";
        headingFont = headingFont || "Times-Bold";
        if (logo == null) {
            logo = {};
        }
        if ((_ref = logo.file) == null) {
            logo.file = logoFile;
        }
        if ((_ref1 = logo.width) == null) {
            logo.width = 300;
        }
        logo.height = logoHeader === "yes" ? 80.6 : -1 * margin;
        if (titlerow == null) {
            titlerow = {};
        }
        if ((_ref2 = titlerow.height) == null) {
            titlerow.height = 40;
        }
        if ((_ref3 = titlerow.fillColor) == null) {
            titlerow.fillColor = "#ccc";
        }
        if (table == null) {
            table = {};
        }
        if ((_ref4 = table.width) == null) {
            table.width = 530;
        }
        if ((_ref5 = table.corner) == null) {
            table.corner = 6;
        }
        if (columnProportions == null) {
            columnProportions = [5, 3, 5];
        }
        titleFontsize = fontSize * 1.1;
        headingFontsize = fontSize * 1.4;
        messageHeight = seatingPlan.complementaryRoom ? 3 * headingFontsize + 2 * margin : -1 * margin;
        row.odd = "#fff";
        row.even = "#ddd";
        row.corner = table.corner / 2;
        n = seatingPlan.entries.length;
        log("Number of entries: " + n);
        table.maxHeights = [];
        nMaxperpage = [];
        table.maxHeights[0] = docHeight - margin - logo.height - margin - headingFontsize - margin - titlerow.height - margin - messageHeight - margin;
        log(docHeight, margin, logo.height, titlerow.height, messageHeight, table.maxHeights[0]);
        decimalvalue = table.maxHeights[0] / row.minHeight;
        nMaxperpage[0] = Math.floor(decimalvalue);
        if (nMaxperpage[0] < n) {
            table.maxHeights[1] = docHeight - titlerow.height - margin - messageHeight - margin;
            decimalvalue = table.maxHeights[1] / row.minHeight;
            nMaxperpage[1] = Math.floor(decimalvalue);
            log(table.maxHeights[1], decimalvalue, nMaxperpage[1]);
            nSum = nMaxperpage[0] + nMaxperpage[1];
            i = 2;
            while (nSum < n) {
                table.maxHeights[i] = docHeight - titlerow.height;
                decimalvalue = table.maxHeights[i] / row.minHeight;
                nMaxperpage[i] = Math.floor(decimalvalue);
                log(table.maxHeights[i], decimalvalue, nMaxperpage[i]);
                nSum += nMaxperpage[i];
            }
        }
        if (table.maxHeights.length > 1) {
            table.maxHeights.push(table.maxHeights.splice(1, 1)[0]);
            nMaxperpage.push(nMaxperpage.splice(1, 1)[0]);
        }
        log("Maximum table heights: " + (JSON.stringify(table.maxHeights)));
        log("Max entries per page: " + (JSON.stringify(nMaxperpage)));
        pages = nMaxperpage.length;
        log("Number of pages required: " + pages);
        sum = function (arr) {
            if (arr.length > 0) {
                return arr.reduce(function (t, s) {
                    return t + s;
                });
            } else {
                return 0;
            }
        };
        entryHeight = calculatedvalue = sum(table.maxHeights) / n;
        entryHeight = Math.max(row.minHeight, entryHeight);
        entryHeight = Math.min(row.maxHeight, entryHeight);
        log("Each entry's height: " + entryHeight + " (" + calculatedvalue + ")");
        nPerpage = [];
        _ref6 = table.maxHeights;
        for (i = _i = 0, _len = _ref6.length; _i < _len; i = ++_i) {
            maxHeight = _ref6[i];
            nPerpage.push(Math.min(nMaxperpage[i], Math.ceil(maxHeight / entryHeight)));
        }
        log("Number of entries per page: " + (JSON.stringify(nPerpage)));
        proportionSum = 0;
        for (_j = 0, _len1 = columnProportions.length; _j < _len1; _j++) {
            num = columnProportions[_j];
            proportionSum += num;
        }
        _ref7 = (function () {
            var _k, _results;
            _results = [];
            for (i = _k = 0; _k < 3; i = ++_k) {
                _results.push({
                    width: columnProportions[i] * table.width / proportionSum
                });
            }
            return _results;
        })();
        column1 = _ref7[0];
        column2 = _ref7[1];
        column3 = _ref7[2];
        table.left = docWidth / 2 - table.width / 2;
        if (logoHeader === "yes") {
            doc.image(logo.file, docWidth / 2 - logo.width / 2, margin, {
                fit: [logo.width, logo.height]
            });
        }
        doc.font(headingFont).fontSize(headingFontsize);
        doc.text("" + seatingPlan.studyingIn, table.left, margin + logo.height + margin, {
            width: table.width,
            align: "center"
        });
        for (pageno = _k = 0; 0 <= pages ? _k < pages : _k > pages; pageno = 0 <= pages ? ++_k : --_k) {
            if (pageno > 0) {
                doc.addPage();
            }
            if (pageno === 0) {
                nThispage = Math.min(nPerpage[pageno], n);
            } else {
                nThispage = Math.min(nPerpage[pageno], n - sum(nPerpage.slice(0, +(pageno - 1) + 1 || 9e9)));
            }
            log("Number of entries on page #" + (pageno + 1) + ": " + nThispage);
            table.height = entryHeight * nThispage;
            titlerow.top = margin + (pageno === 0 ? logo.height + margin : 0) + (pageno === 0 ? headingFontsize + margin : 0);
            titlerow.textTop = titlerow.top + titlerow.height / 2 - titleFontsize / 2 + 2;
            table.top = titlerow.top + titlerow.height;
            doc.roundedRect(table.left, titlerow.top, table.width, titlerow.height, table.corner).fillAndStroke(titlerow.fillColor, "black");
            doc.roundedRect(table.left, table.top, table.width, table.height, table.corner).fillAndStroke(row.odd, "black");
            doc.fillColor("black");
            doc.strokeColor("black");
            doc.font(font).fontSize(titleFontsize);
            doc.text("Seat IDs", table.left, titlerow.textTop, {
                width: column1.width,
                align: "center"
            });
            doc.text("Room No.", table.left + column1.width, titlerow.textTop, {
                width: column2.width,
                align: "center"
            });
            doc.text("Floor", table.left + table.width - column3.width, titlerow.textTop, {
                width: column3.width,
                align: "center"
            });
            doc.fontSize(fontSize);
            startEntry = pageno === 0 ? 0 : sum(nPerpage.slice(0, +(pageno - 1) + 1 || 9e9));
            _ref8 = seatingPlan.entries.slice(startEntry, startEntry + nThispage);
            for (index = _l = 0, _len2 = _ref8.length; _l < _len2; index = ++_l) {
                entry = _ref8[index];
                entry.top = table.top + index * entryHeight;
                entry.textTop = entry.top + entryHeight / 2 - fontSize / 2 + 2;
                if (index % 2) {
                    doc.save();
                    doc.roundedRect(table.left + 1, entry.top + 1, table.width - 2, entryHeight - 2, row.corner).fill(row.even);
                    doc.restore();
                }
                doc.text("" + entry.from + "    -    " + entry.to, table.left, entry.textTop, {
                    width: column1.width,
                    align: "center"
                });
                doc.text("" + entry.room, table.left + column1.width, entry.textTop, {
                    width: column2.width,
                    align: "center"
                });
                doc.text("" + entry.floor, table.left + table.width - column3.width, entry.textTop, {
                    width: column3.width,
                    align: "center"
                });
            }
            doc.save().lineWidth(0.5).rect(table.left + column1.width, table.top, column2.width, table.height).stroke().restore();
            if (seatingPlan.complementaryRoom) {
                message = "Students without a Roll Number / Seat ID / Admit Card\n" + "or who have a different Test Centre\n" + ("can sit in Room Number " + seatingPlan.complementaryRoom);
                doc.text(message, table.left, table.top + table.height + margin, {
                    width: table.width,
                    align: "center",
                    lineGap: 8
                });
            }
        }
        return thenWhat(doc);
    };
}());
