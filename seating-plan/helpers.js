(function () {
    "use strict";
    /*jshint maxparams:7, loopfunc:true, camelcase:false, quotmark:false, white:false */

    var build_roomlist, move_complementary_room_to_end, validate,
        __hasProp = {}.hasOwnProperty;

    exports.parseFields = function(log, fields, callback) {
        var errors, key, plan, settings, value;
        plan = {
            center: fields.center.trim(),
            studying_in: fields.studying_in.trim(),
            buffer: parseInt(fields.buffer, 10),
            per_room: parseInt(fields.per_room, 10),
            complementary_room: fields.complementary_room.trim(),
            roomlist: build_roomlist(fields.roomlist)
        };
        errors = validate(plan);
        if (!errors) {
            plan.roomlist = move_complementary_room_to_end(plan.roomlist, plan.complementary_room);
        }
        settings = {};
        for (key in fields) {
            if (fields.hasOwnProperty(key)) {
                value = fields[key];
                settings[key] = value;
            }
        }
        delete settings.center;
        delete settings.studying_in;
        delete settings.buffer;
        delete settings.per_room;
        delete settings.complementary_room;
        delete settings.roomlist;
        delete settings.submit;
        log(settings);
        return callback(errors, plan, settings);
    };

    move_complementary_room_to_end = function(list, room) {
        var i;
        i = 0;
        while (i < list.length) {
            if (list[i].room === room) {
                break;
            }
            i++;
        }
        return list.concat(list.splice(i, 1));
    };

    build_roomlist = function(str) {
        var cut, f, floor, fr, r, room, roomlist, rs, _i, _j, _len, _len1, _ref, _ref1;
        roomlist = [];
        _ref = (function() {
            var _j, _len, _ref, _results;
            _ref = str.split("&");
            _results = [];
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
                f = _ref[_j];
                _results.push(f.trim());
            }
            return _results;
        })();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            fr = _ref[_i];
            cut = fr.indexOf(":");
            floor = fr.substring(0, cut).trim() || "_";
            rs = fr.substring(cut + 1);
            _ref1 = (function() {
                var _k, _len1, _ref1, _results;
                _ref1 = rs.split(",");
                _results = [];
                for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                    r = _ref1[_k];
                    _results.push(r.trim());
                }
                return _results;
            })();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                room = _ref1[_j];
                if (room !== "") {
                    roomlist.push({
                        room: room,
                        floor: floor
                    });
                }
            }
        }
        return roomlist;
    };

    validate = function(plan) {
        var dup, errors, i, names, one, prop, r, rooms_arr, _i, _j, _len, _ref, _ref1;
        errors = [];
        names = {
            complementary_room: "Complementary Room",
            studying_in: "Class studying in",
            per_room: "Students Per Room",
            buffer: "Buffer Seats"
        };
        _ref = "per_room, buffer".split(", ");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            if (isNaN(plan[prop])) {
                errors.push(new Error("" + names[prop] + " must be a number"));
            }
        }
        rooms_arr = ((function() {
            var _j, _len1, _ref1, _results;
            _ref1 = plan.roomlist;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                r = _ref1[_j];
                _results.push(r.room);
            }
            return _results;
        })()).sort();
        dup = [];
        for (i = _j = 0, _ref1 = rooms_arr.length - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            if (rooms_arr[i] === rooms_arr[i + 1] && (dup.indexOf(rooms_arr[i])) === -1) {
                dup.push(rooms_arr[i]);
            }
        }
        one = dup.length === 1;
        if (dup.length !== 0) {
            errors.push(new Error("Room" + (one ? "" : "s") + ": " + (dup.join(", ")) + " " + (one ? "is" : "are") + " repeated."));
        }
        if (errors.length === 0) {
            errors = void 0;
        }
        return errors;
    };
    
}());
