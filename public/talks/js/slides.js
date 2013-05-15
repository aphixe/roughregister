// Use Strict Pragma
(function () {
    "use strict";

    // CODE
}());
// Prevents common JS errors that would fail silently otherwise
(function () {
    "use strict";

    var obj = {
        key: "value",
        anotherKey: "another value",
        keyKey: "value value",
        key: "one more value"
    };
}());
// Prevents unintended global namespace pollution
/*global globalVar:true, str:true */
globalVar = "global value";
(function () {
    "use strict";

    log(window.globalVar);

    str = "global";

}());
/*global globalVar:false, str:false */

// Variables
(function () {
    "use strict";

    var undef,
        num     = 10,
        str     = "string",
        bool    = false,
        obj     = { property: "value" },
        func    = function () {},
        nothing = null,
        camelCasedVar = "convention";

    log(undef);

}());
// Variable scope is simply the function scope
/*global inner:true */
(function () {
    "use strict";

    var outer = "outer value";

    function func() {
        var inner = "inner value";

        log(outer);
        log(inner);
    }

    func();

    log(outer);
    log(inner);

}());
/*global inner:false */

// `function` declarations get "hoisted" at top of scope
/*jshint latedef:false */
(function () {
    "use strict";

    var func1,
        func2 = function () { return "function 2"; };

    log(func1);
    log(func2());
    log(func3());

    func1 = function () { return "function 1"; };
    log(func1());

    function func3() { return "function 3"; }

}());
/*jshint latedef:true */

// Types can be changed at runtime.
(function () {
    "use strict";

    var num     = 10,
        str     = "string",
        obj     = { property: "value" },
        func    = function () {},
        nothing = null;

    num = str;
    log(num);

    str = obj;
    log(str);

    obj = func = nothing;
    log(obj);
    log(func);

}());

// Type determination
(function () {
    "use strict";

    log(typeof "string");
    log(typeof false);
    log(typeof undefined);
    log(typeof function () {});

    log(typeof 245);
    log(typeof 2.7);

    log(typeof {k: "v"});
    log(typeof [1, 2]);
    log(typeof (/regExp/i));
    log(typeof new Date());
    log(typeof null);

}());

// Type conversion
(function () {
    "use strict";

    var num = 10,
        str = "20",
        floating = "24.9";

    log(num.toString());
    log(String(num));
    log("" + num);

    log(Number(str));
    log(parseInt(str, 10));
    log(parseFloat(floating));

    log(+str);
    log(+floating);

}());

// Wrong Equality Checking
/*jshint eqeqeq:false, eqnull:false */
(function () {
    "use strict";

    log("" == []);
    log(0 == []);
    log("1" == [1]);

    log("" == 0);
    log(0 == " ");
    log("" == " ");

    log(24 == "twenty four");
    log(24 == "24");

    log(undefined == null);

}());
/*jshint eqeqeq:true, eqnull:true */

// Correct Equality Checking
(function () {
    "use strict";

    log("" === []);
    log(0 === []);
    log("1" === [1]);

    log("" === 0);
    log(0 === " ");
    log("" === " ");

    log(24 === "twenty four");
    log(24 === "24");

    log(null === undefined);

}());

// Object Creation
(function () {
    "use strict";

    var o1 = {
        property: "o1's value"
    };
    log(o1.property);

    // or
    var o2 = {};
    o2.property = "o2's value";
    log(o2.property);

    // or
    function ClassName() {
        this.property = "o3's value";
    }
    var o3 = new ClassName();
    log(o3.property);
}());

// Object Property Access
(function () {
    "use strict";

    var obj = { property: "value" };

    log(obj.property);
    log(obj["property"]);

    // New object properties can be created
    obj.anotherProp = 56;
    log(obj.anotherProp);

}());

// Prototype Chain
/*jshint forin:false */
(function () {
    "use strict";

    var obj = { property: "value" };

    function MyClass() {
        this.ownProperty = "something";
    }
    MyClass.prototype = obj;

    var newObj = new MyClass();

    var prop;
    for (prop in newObj) {
        log(prop);
        log(newObj[prop]);
    }

    log(newObj.toString());

}());
/*jshint forin:true */

// Better for...in
(function () {
    "use strict";

    var obj = { property: "value" };

    function MyClass() {
        this.anotherProp = "something";
    }
    MyClass.prototype = obj;

    var newObj = new MyClass();

    var prop;
    for (prop in newObj) {
        if (newObj.hasOwnProperty(prop)) {
            log(prop);
            log(newObj[prop]);
        }
    }
}());

// Inheritance
(function () {
    "use strict";

    function BaseClass() {
        this.property = "base value";
    }

    function InheritedClass() {
        this.ownProperty = "own value";
    }

    InheritedClass.prototype = new BaseClass();

    var obj = new InheritedClass();

    log(obj.ownProperty);
    log(obj.property);

}());

// Arrays
/*jshint white:false */
(function () {
    "use strict";

    var arr = [1, 2, 3, 4];
    log(arr.length);

    arr.push(5);                    log(arr);
    arr.pop();                      log(arr);
    arr.unshift(0);                 log(arr);
    arr.shift();                    log(arr);

    arr.splice(1, 2);               log(arr);
    arr.splice(1, 0, 20, 25, 30);   log(arr);

    log(arr.concat([5]));
    log(arr.concat(5));

}());
/*jshint white:true */

// Arrays can contain multiple types
(function () {
    "use strict";

    var arr = ["one", 2, [1, 2, 3]];

    log(arr);
    log(arr[2][2]);

    // another way to `push`
    arr[arr.length] = function () { return 100; };

    log(arr[3].toString());
    log(arr[3]());

    // Out of bounds
    log(arr[-1]);
    log(arr[100]);
}());
// Arrays are Objects!
(function () {
    "use strict";

    var arr = [0, 1, 2],
        obj = {
            0: 0,
            1: 1,
            2: 2
        };

    log(arr[1]);
    log(obj[1]);

    arr.property = "value";
    log(arr.property);

    // Since object keys can only be strings
    log(arr["1"]);
}());
// Array Enumeration
(function () {
    "use strict";

    var arr = ["zero", "one"];

    log("Using regular for loop");
    for (var i = 0; i < arr.length ; i++) {
        log(i);
        log(arr[i]);
    }

    log("Using Array#forEach");
    // native in ES5 (needs a library in ES3)
    arr.forEach(function (value, index) {
        log(index);
        log(value);
    });

}());

// && and ||
(function () {
    "use strict";

    var obj = {
        func: function () { return 99; }
    };

    // Guard Operator
    log(obj && obj.func && obj.func());

    // Default Operator
    obj.property = obj.property || obj.func();
    log(obj.property);

}());

// Exception Handling
(function () {
    "use strict";

    var obj = {};

    try {

        log(1 / 0);
        obj.nonExistentFunc();

    } catch (e) {
        log("error caught, no harm done.");
        log(e.name + ": " + e.message);
    }

    "here".is.an = "uncaught error";
    
}());
// Throw your own errors
(function () {
    "use strict";

    try {

        throw new Error("My custom error");

    } catch (e) {
        log(e.toString());

        try {
            throw new TypeError("Why U Mix Types");
        } catch (err) {
            log(err.toString());
        }
    }

}());
// Throw anything
(function () {
    "use strict";

    var anything = {
        code: 201,
        name: "SomeErrorClass",
        message: "Just got thrown",
        toString: function () {
            return "[ " + this.name + ": " + this.message + " ]";
        }
    };

    throw anything;

}());

// debugger
(function () {
    "use strict";

    var a = 10;
    
    debugger;

    var doubleValue = function (num) {
        var result = num * 2;
        return result;
    };

    log(doubleValue(a));

}());

// setTimeout
(function () {
    "use strict";

    alert("legen... wait for it...");

    setTimeout(function () {

        alert("...dary");

    }, 4000);

}());

// Specify arguments
(function () {
    "use strict";

    alert("legen... wait for it...");

    setTimeout(function (remaining) {

        alert("..." + remaining);
        
    }, 4000, "dary");

}());

// Clear timeout
(function () {
    "use strict";

    var id = setTimeout(function () {

        alert("ran successfully");
        
    }, 4000);

    clearTimeout(id);

}());

// setInterval and clearInterval
(function () {
    "use strict";

    var id = setInterval(function (value) {

        alert(value);
        
    }, 2000, "knock knock");


    setTimeout(function () {
        clearInterval(id);
    }, 10000);

}());

/* Advanced Concepts */

// Immediately Invoked Function Expression
(function () {
    "use strict";

    (function () {
        
        (function () {
        
            log("getting logged");
            
        }());
    }());

}());

// Functions are first-class variables
(function () {
    "use strict";

    function shout() {
        log("Function ran!");
    }

    function callFunction(f) {
        f();
    }

    callFunction(shout);

}());

// Every function returns something
(function () {
    "use strict";

    function func1() {
        log("function 1 called");
        return "return value";
    }
    
    function func2() {
        log("function 2 called");
    }

    log(func1());

    log(func2());

}());

// Function closures
(function () {
    "use strict";

    function adder(howMany) {
        return function (num) {
            return howMany + num;
        };
    }

    var twoPlus = adder(2);

    log(twoPlus(9));

}());

// Private Variables
(function () {
    "use strict";

    var lady;
    lady = { age: 20 };
    lady.age = 40;
    log(lady.age);

    lady = (function () {
        var age = 20;
        return {
            getAge: function () { return age; }
        };
    }());

    log(lady.age);
    log(lady.getAge());
}());

// Functions are Objects!
(function () {
    "use strict";

    var func1 = function () {};

    func1.someValue = "some value";
    log(func1.someValue);

    function func2() {
        log("function 2 ran");
        func2.someProperty = "some property";
    }
    log(func2.someProperty);

    func2();
    log(func2.someProperty);

}());

// What does `this` mean?
window.someProperty = "some property";
function funcOutside() {
    log(this.someProperty);
}
(function () {
    "use strict";

    function funcInStrictMode() {
        log(this.someProperty);
    }

    funcOutside();
    funcInStrictMode();
}());

// new MyClass
(function () {
    "use strict";

    function MyClass() {
        this.property = "value";
    }

    var obj = new MyClass();
    
    log(obj.property);

}());

// Function context
(function () {
    "use strict";

    var obj = {
        property: "value",
        func: function () {

            log(this.property);

        }
    };

    obj.func();

}());

// Calling obj is `this`
(function () {
    "use strict";

    function logWhich() {
        log(this.which);
    }

    var obj1 = {
        which: "object 1",
        func: logWhich
    };
    var obj2 = {
        which: "object 2",
        func: logWhich
    };

    obj1.func();
    obj2.func();

}());

// Function call
(function () {
    "use strict";

    function func() {
        log(this.property);
    }

    func.call({ property: "value" });

}());

// Call with arguments
(function () {
    "use strict";

    function func(arg1, arg2) {
        log(this.property);
        log(arg1);
        log(arg2);
    }

    func.call({ property: "value" }, 10, "20");

}());

// Apply arguments to function
(function () {
    "use strict";

    function func(arg1, arg2) {
        log(this.property);
        log(arg1);
        log(arg2);
    }

    func.apply({ property: "value" }, [10, "20"]);

}());

// arguments array (array-like)
(function () {
    "use strict";

    function func() {
        log(this);
        for (var i = 0; i < arguments.length; i++) {
            log(arguments[i]);
        }
    }

    func.call("context", "argument 1", "argument 2");
}());

// wrap a function
(function () {
    "use strict";

    function wrap(f) {
        return function () {
            log("wrapped function being run");
            return f.apply(this, arguments);
        };
    }

    function square(arg) {
        return arg * arg;
    }

    var wrappedSquare = wrap(square);

    log(wrappedSquare(5));
}());

// Function bound context
(function () {
    "use strict";

    function func() {
        log(this.property);
    }

    var bound = func.bind({ property: "value" });

    func();
    bound();

}());

// bound with arguments
(function () {
    "use strict";

    function func(arg1, arg2) {
        log(this);
        log(arg1);
    }

    var bound = func.bind("bound context", "argument 1");

    bound("passed context", "more arguments");

}());

// Semicolons are optional
/*jshint asi:true, white:false */
(function () {

    [1, 2, 3].forEach(function (value) {
        log(value)
    })
    
    var a = 10

}())

;
// with problems
(function () {
    
    var a = 10

    [1, 2, 3].forEach(function (value) {
        log(value)
    })

}())
/*jshint asi:false, white:true */
;

// JSON
{
    "key": "in double quotes",
    "object": {
        "nested": 1,
        "functions": "not allowed",
        "canPassThemAs": "function () {}"
    },
    "array": ["is", "the", { "same": "as before" }],
    "null": null,
    "undefined": "not allowed"
}
