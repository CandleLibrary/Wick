'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
	Schema type. Handles the parsing, validation, and filtering of Model data properties. 
*/
class SchemaConstructor {

    constructor() {

        this.start_value = undefined;
    }

    /**
    	Parses value returns an appropriate transformed value
    */
    parse(value) {

        return value;
    }

    /**

    */
    verify(value, result) {

        result.valid = true;
    }

    filter() {

        return true;
    }

    string(value) {
    	
        return value + "";
    }
}

class NumberSchemaConstructor extends SchemaConstructor {

    constructor() {

        super();

        this.start_value = 0;
    }

    parse(value) {

        return parseFloat(value);
    }

    verify(value, result) {

        result.valid = true;

        if (value == NaN || value == undefined) {
            result.valid = false;
            result.reason = "Invalid number type.";
        }
    }

    filter(identifier, filters) {

        for (let i = 0, l = filters.length; i < l; i++)
            if (identifier == filters[i])
                return true;

        return false;
    }
}

let number = new NumberSchemaConstructor();

var null_token = {
    type: "",
    text: ""
};

class Lexer {
    constructor(tokenizer) {
        this.tk = tokenizer;

        this.token = tokenizer.next();

        this.hold = null;

        while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic")) {
            this.token = this.tk.next();
        }
    }

    reset(){
        this.tk.reset();
        this.token = this.tk.next();
        this.hold = null;
    }

    next() {
        if (this.hold !== null) {
            this.token = this.hold;
            this.hold = null;
            return this.token;
        }

        if (!this.token) return null;
        do {
            this.token = this.tk.next();
        } while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic"));

        if (this.token) {
            return this.token;
        }
        return null;
    }

    assert(text) {
        if (!this.token) throw new Error(`Expecting ${text} got null`);

        var bool = this.token.text == text;


        if (bool) {
            this.next();
        }else{
            throw new Error(`Expecting "${text}" got "${this.token.text}"`)
        }

        return bool;
    }

    peek() {
        if (this.hold) {
            return this.hold;
        }

        this.hold = this.tk.next();

        if (!this.hold) return null_token;

        while (this.hold && (this.hold.type === "new_line" || this.hold.type === "white_space" || this.hold.type === "generic")) {
            this.hold = this.tk.next();
        }

        if (this.hold) {
            return this.hold;
        }

        return null_token;
    }

    get text() {
        if (this.token)
            return this.token.text;
        return null;
    }

    get type() {
        if (this.token)
            return this.token.type;
        return "";
    }

    get pos(){
        if (this.token)
            return this.token.pos;
        return -1;
    }

    slice(start) {
        if (this.token)
            return this.tk.string.slice(start, this.token.pos)
        return this.tk.string.slice(start)
    }
}

//Compares code with argument list and returns true if match is found, otherwise false is returned
function compareCode(code) {
    var list = arguments;
    for (var i = 1, l = list.length; i < l; i++) {
        if (list[i] === code) return true;
    }
    return false;
}

//Returns true if code lies between the other two arguments
function inRange(code) {
    return (code > arguments[1] && code < arguments[2]);
}

//The resulting array is used while parsing and tokenizing token strings
var string_parse_and_format_functions = (function() {
    var array = [{
            type: "number",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code, text, offset) {
                if (inRange(code, 47, 58)) {
                    code = text.charCodeAt(1 + offset);
                    if (compareCode(code, 66, 98, 88, 120, 79, 111)) {
                        return 2;
                    }
                    return 1;
                } else if (code == 46) {
                    code = text.charCodeAt(1 + offset);
                    if (inRange(code, 47, 58)) {
                        return 2;
                    }
                }
                return 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return (inRange(code, 47, 58) || code === 46) ? -1 : 0;
            },
            format(token) {
                token.color = "rgb(20,40,180)";
            }

        }, {
            type: "identifier",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return (inRange(code, 64, 91) || inRange(code, 96, 123)) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return (inRange(code, 47, 58) || inRange(code, 64, 91) || inRange(code, 96, 123) || compareCode(code, 35, 36, 45, 95)) ? -1 : 0;
            },
            format(token) {

                //token.color = randomColor();
            }

        },/* {
            type: "comment",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code, text) {
                return ((code === 47) && (text.charCodeAt(1) === 47)) ? 2 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return (inRange(code, 32, 128) || code === 32 || code === 9) ? -1 : 0;
            },
            format(token) {
                //console.log(token)
            }

        }, */{
            type: "string",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code, text) {
                return (code === 34) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return (code === 34) ? 1 : -1;
            },

            format(token) {
                //console.log(token)
            }

        }, {
            type: "white_space",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return (code === 32 || code === 9) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return (code === 32 || code === 9) ? -1 : 0;
            },
            format(token) {
                //console.log(token)
            }

        }, {
            type: "new_line",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return (code === 10) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                return 0;
            },
            format(token) {
                //console.log(token)
            }
        }, {
            type: "open_bracket",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return compareCode(code, 123, 40, 91) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                //Single character, end comes immediatly
                return 0;
            },
            format(token) {
                token.color = "rgb(100,100,100)";
            }

        }, {
            type: "close_bracket",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return compareCode(code, 125, 41, 93) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                //Single character, end comes immediatly
                return 0;
            },
            format(token) {
                token.color = "rgb(100,100,100)";
            }

        },

        {
            type: "Operator",
            //Initial check function. Return index offset to start for scan. If 0 is returned then the parser will move on to the next check function
            check(code) {
                return compareCode(code, 42, 43, 60, 61, 62, 92, 38, 37, 33, 94, 124, 58) ? 1 : 0;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                //Single character, end comes immediatly
                return 0;
            },
            format(token) {
                token.color = "rgb(205,120,0)";
            }

        }, {
            type: "Symbol", //Everything else should be generic symbols
            check(code) {
                return 1;
            },
            // Scan for end of token. Return false if character not part of token
            scanToEnd(code) {
                //Generic will capture ANY remainder character sets.
                return 0;
            },
            format(token) {
                token.color = "red";
            }
        }
    ];

    //This allows for creation custom parsers and formatters based upon this object.
    array.clone = function() {
        return string_parse_and_format_functions();
    };

    return array;
});

var SPF = string_parse_and_format_functions();
var SPF_length = SPF.length;

class Tokenizer {
    constructor(string) {
    	this.h = null;
	    this.line = 0;
	    this.char = 0;
	    this.offset = 0;
	    this.string = string;
    }

    reset(){
        this.line = 0;
        this.char = 0;
        this.offset = 0;
    }

    hold(token) {
        this.h = token;
    }

    next() {

        var token_length = 0;

        if (this.h) {
            var t = this.h;
            this.h = null;
            return t;
        }

        if (this.string.length < 1) return null;

        let offset = this.offset;
        
        if (offset >= this.string.length) return null;

        var code = this.string.charCodeAt(offset);
        let SPF_function;
        for (var i = 0; i < SPF_length; i++) {
            SPF_function = SPF[i];
            let test_index = SPF_function.check(code, this.string, offset);
            if (test_index > 0) {
                this.type = SPF_function.type;
                var e = 0;
                for (i = test_index; i < this.string.length; i++) {
                    e = SPF_function.scanToEnd(this.string.charCodeAt(i + offset));
                    if (e > -1) break;
                    e = 0;
                }
                token_length = i + e;
                break;
            }
        }

        var temp = this.string.slice(offset, offset + token_length);

        if (SPF_function.type === "new_line") {
            this.char = 0;
            this.line++;
        }

        var out = {
            type: SPF_function.type,
            text: temp,
            pos: this.offset,
            length: token_length,
            char: this.char,
            line: this.line
        };

        this.offset += token_length;
        this.char += token_length;

        return out;
    }
}

const months = [{
    name: "January",
    days: 31,
    day_offset: 0,
    day_offse_leapt: 0
}, {
    name: "February",
    days: 28,
    day_offset: 31,
    day_offset_leap: 31
}, {
    name: "March",
    days: 31,
    day_offset: 59,
    day_offset_leap: 60
}, {
    name: "April",
    days: 30,
    day_offset: 90,
    day_offset_leap: 91
}, {
    name: "May",
    days: 31,
    day_offset: 120,
    day_offset_leap: 121
}, {
    name: "June",
    days: 30,
    day_offset: 151,
    day_offset_leap: 152
}, {
    name: "July",
    days: 31,
    day_offset: 181,
    day_offset_leap: 182
}, {
    name: "August",
    days: 31,
    day_offset: 212,
    day_offset_leap: 213
}, {
    name: "September",
    days: 30,
    day_offset: 243,
    day_offset_leap: 244
}, {
    name: "October",
    days: 31,
    day_offset: 273,
    day_offset_leap: 274
}, {
    name: "November",
    days: 30,
    day_offset: 304,
    day_offset_leap: 305
}, {
    name: "December",
    days: 31,
    day_offset: 33,
    day_offse_leapt: 335
}];

var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function GetDayStartAndEnd(date) {
    var rval = {
        start: 0,
        end: 0
    };

    if (date instanceof Date || typeof(date) == "number" ) {
        var d = new Date(date);

        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        rval.start = d.valueOf();
        d.setDate(d.getDate() + 1);
        d.setSeconds(-1);
        rval.end = d.valueOf();
    }

    return rval;
}

function float24to12ModTime(time, CAPITAL) {
    var IS_PM = time >= 12 && time < 24;
    var minutes = ((time % 1) * 60) | 0;
    var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

    return (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? (CAPITAL) ? "PM" :"pm" : (CAPITAL) ? "AM" : "am");
}

class Point2D extends Float64Array{
	
	constructor(x, y) {
		super(2);

		if (typeof(x) == "number") {
			this[0] = x;
			this[1] = y;
			return;
		}

		if (x instanceof Array) {
			this[0] = x[0];
			this[1] = x[1];
		}
	}

	draw(ctx, s = 1){
		ctx.beginPath();
		ctx.moveTo(this.x*s,this.y*s);
		ctx.arc(this.x*s, this.y*s, s*0.01, 0, 2*Math.PI);
		ctx.stroke();
	}

	get x (){ return this[0]}
	set x (v){if(typeof(v) !== "number") return; this[0] = v;}

	get y (){ return this[1]}
	set y (v){if(typeof(v) !== "number") return; this[1] = v;}
}

function posOnCurve(t, p1, p2, p3) {
    var ti = 1 - t;
    return ti * ti * p1 + 2 * ti * t * p2 + t * t * p3;
}

function splitCurve(bp, t) {
    var left = [];
    var right = [];

    function drawCurve(bp, t) {
        if (bp.length == 2) {
            left.push(bp[0], bp[1]);
            right.push(bp[0], bp[1]);
        } else {
            var new_bp = []; //bp.slice(0,-2);
            for (var i = 0; i < bp.length - 2; i += 2) {
                if (i == 0) {
                    left.push(bp[i], bp[i + 1]);
                }
                if (i == bp.length - 4) {
                    right.push(bp[i + 2], bp[i + 3]);
                }
                new_bp.push((1 - t) * bp[i] + t * bp[i + 2]);
                new_bp.push((1 - t) * bp[i + 1] + t * bp[i + 3]);
            }
            drawCurve(new_bp, t);
        }
    }

    drawCurve(bp, t);

    return {
        x: new QBezier(right),
        y: new QBezier(left)
    };
}

function curveIntersections(p1, p2, p3) {
    var intersections = {
        a: Infinity,
        b: Infinity
    };

    var a = p1 - 2 * p2 + p3;

    var b = 2 * (p2 - p1);

    var c = p1;

    if (b == 0) ; else if (Math.abs(a) < 0.00000000005) {
        intersections.a = (-c / b); //c / b;
    } else {

        intersections.a = ((-b - Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
        intersections.b = ((-b + Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
    }
    return intersections
}

class QBezier {
    constructor(x1, y1, x2, y2, x3, y3) {
        this.x1 = 0;
        this.x2 = 0;
        this.x3 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.y3 = 0;

        if (typeof(x1) == "number") {
            this.x1 = x1;
            this.x2 = x2;
            this.x3 = x3;
            this.y1 = y1;
            this.y2 = y2;
            this.y3 = y3;
            return;
        }

        if (x1 instanceof QBezier) {
            this.x1 = x1.x1;
            this.x2 = x1.x2;
            this.x3 = x1.x3;
            this.y1 = x1.y1;
            this.y2 = x1.y2;
            this.y3 = x1.y3;
            return;
        }

        if (x1 instanceof Array) {
            this.x1 = x1[0];
            this.y1 = x1[1];
            this.x2 = x1[2];
            this.y2 = x1[3];
            this.x3 = x1[4];
            this.y3 = x1[5];
            return;
        }
    }

    reverse() {
        return new QBezier(
            this.x3,
            this.y3,
            this.x2,
            this.y2,
            this.x1,
            this.y1
        )
    }

    point(t) {
        return new Point2D(
            posOnCurve(t, this.x1, this.x2, this.x3),
            posOnCurve(t, this.y1, this.y2, this.y3))

    }

    tangent(t) {
        var tan = {
            x: 0,
            y: 0
        };

        var px1 = this.x2 - this.x1;
        var py1 = this.y2 - this.y1;

        var px2 = this.x3 - this.x2;
        var py2 = this.y3 - this.y2;

        tan.x = (1 - t) * px1 + t * px2;
        tan.y = (1 - t) * py1 + t * py2;

        return tan;
    }

    toArray() {
        return [this.x1, this.y1, this.x2, this.y2, this.x3, this.y3];
    }

    split(t) {
        return splitCurve(this.toArray(), t);
    }

    rootsX (){
    	return this.roots(
    		this.x1, 
    		this.x2,
    		this.x3
    		)
    	
    }

    roots(p1, p2, p3) {
        var curve = this.toArray();

        var c = p1 - (2*p2) + p3;
        var b = 2*(p2 - p1);
        var a = p1;
        var a2 = a*2;
        console.log(c ," c");
        var sqrt = Math.sqrt(b*b - (a * 4 *c));
        console.log(sqrt, b, a2, p3);
        var t1 = (-b + sqrt) / a2;
        var t2 = (-b - sqrt) / a2;

        return [ t1 , t2 ];
    } 

    rootsa() {
        var curve = this.toArray();

        var p1 = curve[1];
        var p2 = curve[3];
        var p3 = curve[5];
        var x1 = curve[0];
        var x2 = curve[2];
        var x3 = curve[4];

        var py1d = 2 * (p2 - p1);
        var py2d = 2 * (p3 - p2);
        var ad1 = -py1d + py2d;
        var bd1 = py1d;

        var px1d = 2 * (x2 - x1);
        var px2d = 2 * (x3 - x2);
        var ad2 = -px1d + px2d;
        var bd2 = px1d;

        var t1 = -bd1 / ad1;
        var t2 = -bd2 / ad2;

        return [ t1 , t2 ];
    }

    boundingBox() {
        var x1 = curve[0];
        var y1 = curve[1];
        var x2 = curve[2];
        var y2 = curve[3];
        var x3 = curve[4];
        var y3 = curve[5];
        var roots = getRootsClamped(curve);
        var min_x = Math.min(x1, x2, x3, roots.y[0] || Infinity, roots.x[0] || Infinity);
        var min_y = Math.min(y1, y2, y3, roots.y[1] || Infinity, roots.x[1] || Infinity);
        var max_x = Math.max(x1, x2, x3, roots.y[0] || -Infinity, roots.x[0] || -Infinity);
        var max_y = Math.max(y1, y2, y3, roots.y[1] || -Infinity, roots.x[1] || -Infinity);

        return {
            min: {
                x: min_x,
                y: min_y
            },
            max: {
                x: max_x,
                y: max_y
            }
        };
    }

    rotate(angle, offset) {
        angle = (angle / 180) * Math.PI;

        var new_curve = this.toArray();

        for (var i = 0; i < 6; i += 2) {
            var x = curve[i] - offset.x;
            var y = curve[i + 1] - offset.y;
            new_curve[i] = ((x * Math.cos(angle) - y * Math.sin(angle))) + offset.x;
            new_curve[i + 1] = ((x * Math.sin(angle) + y * Math.cos(angle))) + offset.y;
        }

        return new QBezier(new_curve);
    }

    intersects() {
        return {
            x: curveIntersections(this.x1, this.x2, this.x3),
            y: curveIntersections(this.y1, this.y2, this.y3)
        }
    }

    add(x, y) {
        if (typeof(x) == "number") {
            return new QBezier(
                this.x1 + x,
                this.y1 + y,
                this.x2 + x,
                this.y2 + y,
                this.x3 + x,
                this.y3 + y,
            )
        }
    }
}

const sqrt = Math.sqrt;
const cos = Math.cos;
const acos = Math.acos;
const PI = Math.PI;

// A real-cuberoots-only function:
function cuberoot(v) {
  if(v<0) return -Math.pow(-v,1/3);
  return Math.pow(v,1/3);
}



function point(t, p1, p2, p3, p4) {
	var ti = 1 - t;
	var ti2 = ti * ti;
	var t2 = t * t;

	return ti * ti2 * p1 + 3 * ti2 * t * p2 + t2 * 3 * ti * p3 + t2 * t * p4;
}


class CBezier extends Float64Array{
	constructor(x1, y1, x2, y2, x3, y3, x4, y4) {
		super(8);

		//Map P1 and P2 to {0,0,1,1} if only four arguments are provided; for use with animations
		if(arguments.length == 4){
			this[0] = 0;
			this[1] = 0;
			this[2] = x1;
			this[3] = y1;
			this[4] = x2;
			this[5] = y2;
			this[6] = 1;
			this[7] = 1;
			return;
		}
		
		if (typeof(x1) == "number") {
			this[0] = x1;
			this[1] = y1;
			this[2] = x2;
			this[3] = y2;
			this[4] = x3;
			this[5] = y3;
			this[6] = x4;
			this[7] = y4;
			return;
		}

		if (x1 instanceof Array) {
			this[0] = x1[0];
			this[1] = x1[1];
			this[2] = x1[2];
			this[3] = x1[3];
			this[4] = x1[4];
			this[5] = x1[5];
			this[6] = x1[6];
			this[7] = x1[4];
			return;
		}
	}

	get x1 (){ return this[0]}
	set x1 (v){this[0] = v;}
	get x2 (){ return this[2]}
	set x2 (v){this[2] = v;}
	get x3 (){ return this[4]}
	set x3 (v){this[4] = v;}
	get x4 (){ return this[6]}
	set x4 (v){this[6] = v;}
	get y1 (){ return this[1]}
	set y1 (v){this[1] = v;}
	get y2 (){ return this[3]}
	set y2 (v){this[3] = v;}
	get y3 (){ return this[5]}
	set y3 (v){this[5] = v;}
	get y4 (){ return this[7]}
	set y4 (v){this[7] = v;}

	add(x,y = 0){
		return new CCurve(
			this[0] + x,
			this[1] + y,
			this[2] + x,
			this[3] + y,
			this[4] + x,
			this[5] + y,
			this[6] + x,
			this[7] + y
		)
	}

	valY(t){
		return point(t, this[1], this[3], this[5], this[7]);
	}

	valX(t){
		return point(t, this[0], this[2], this[4], this[6]);
	}

	point(t) {
		return new Point2D(
			point(t, this[0], this[2], this[4], this[6]),
			point(t, this[1], this[3], this[5], this[7])
		)
	}
	
	/** 
		Aquired from : https://pomax.github.io/bezierinfo/
		Author:  Mike "Pomax" Kamermans
		GitHub: https://github.com/Pomax/
	*/

	roots(p1,p2,p3,p4) {
		var d = (-p1 + 3 * p2 - 3 * p3 + p4),
			a = (3 * p1 - 6 * p2 + 3 * p3) / d,
			b = (-3 * p1 + 3 * p2) / d,
			c = p1 / d;

		var p = (3 * b - a * a) / 3,
			p3 = p / 3,
			q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
			q2 = q / 2,
			discriminant = q2 * q2 + p3 * p3 * p3;

		// and some variables we're going to use later on:
		var u1, v1, root1, root2, root3;

		// three possible real roots:
		if (discriminant < 0) {
			var mp3 = -p / 3,
				mp33 = mp3 * mp3 * mp3,
				r = sqrt(mp33),
				t = -q / (2 * r),
				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
				phi = acos(cosphi),
				crtr = cuberoot(r),
				t1 = 2 * crtr;
			root1 = t1 * cos(phi / 3) - a / 3;
			root2 = t1 * cos((phi + 2 * PI) / 3) - a / 3;
			root3 = t1 * cos((phi + 4 * PI) / 3) - a / 3;
			return [root3, root1, root2]
		}

		// three real roots, but two of them are equal:
		if (discriminant === 0) {
			u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
			root1 = 2 * u1 - a / 3;
			root2 = -u1 - a / 3;
			return [root2, root1]
		}

		// one real root, two complex roots
		var sd = sqrt(discriminant);
		u1 = cuberoot(sd - q2);
		v1 = cuberoot(sd + q2);
		root1 = u1 - v1 - a / 3;
		return [root1]
	}

	rootsY() {
		return this.roots(this[1],this[3],this[5],this[7])
	}

	rootsX() {
		return this.roots(this[0],this[2],this[4],this[6])
	}
	
	getYatX(x){
		var x1 = this[0] - x, x2 = this[2] - x, x3 = this[4] - x, x4 = this[6] - x,
			x2_3 = x2 * 3, x1_3 = x1 *3, x3_3 = x3 * 3,
			d = (-x1 + x2_3 - x3_3 + x4), di = 1/d, i3 = 1/3,
			a = (x1_3 - 6 * x2 + x3_3) * di,
			b = (-x1_3 + x2_3) * di,
			c = x1 * di,
			p = (3 * b - a * a) * i3,
			p3 = p * i3,
			q = (2 * a * a * a - 9 * a * b + 27 * c) * (1/27),
			q2 = q * 0.5,
			discriminant = q2 * q2 + p3 * p3 * p3;

		// and some variables we're going to use later on:
		var u1, v1, root;

		//Three real roots can never happen if p1(0,0) and p4(1,1);

		// three real roots, but two of them are equal:
		if (discriminant < 0) {
			var mp3 = -p / 3,
				mp33 = mp3 * mp3 * mp3,
				r = sqrt(mp33),
				t = -q / (2 * r),
				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
				phi = acos(cosphi),
				crtr = cuberoot(r),
				t1 = 2 * crtr;
			root = t1 * cos((phi + 4 * PI) / 3) - a / 3;
		}else if (discriminant === 0) {
			u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
			root = -u1 - a * i3;
		}else{
			var sd = sqrt(discriminant);
			// one real root, two complex roots
			u1 = cuberoot(sd - q2);
			v1 = cuberoot(sd + q2);
			root = u1 - v1 - a * i3;	
		}

		return point(root, this[1], this[3], this[5], this[7]);
	}
	/**
		Given a Canvas 2D context object and scale value, strokes a cubic bezier curve.
	*/
	draw(ctx, s = 1){
		ctx.beginPath();
		ctx.moveTo(this[0]*s, this[1]*s);
		ctx.bezierCurveTo(
			this[2]*s, this[3]*s,
			this[4]*s, this[5]*s,
			this[6]*s, this[7]*s
			);
		ctx.stroke();
	}
}

/**
URL Query Syntax

root => [root_class] [& [classes]]
     => [classes]

root_class = key_list

class_list [class [& class_list]]

class => name & key_list

key_list => [key_val [& key_list]]

key_val => name = val

name => ALPHANUMERIC_ID

val => NUMBER
    => ALPHANUMERIC_ID
*/
function QueryStringToQueryMap(query){

  let mapped_object = new Map;

  if(!query instanceof String){
    console.warn("query argument provided is not a string!");
    return mapped_object;
  }

  if(query[0] == "?") query = query.slice(1);

  let lex = new Lexer(new Tokenizer(query));

  function key_val_list(lex, map){
    let token;
    while((token = lex.token) && token.text !== "&"){
      if(lex.peek().text == "="){
        let key = token.text;
        lex.next();
        lex.next();
        let val = lex.token;
        map.set(key, (val.type == "number")?parseFloat(val.text):val.text);
        lex.next();
        lex.next();
        continue;
      }
      return;
    }
  }

  function class_(lex, map){

    let token;

    if((token = lex.peek()) && token.text == "&"){

      token = lex.token;

      lex.next();lex.next();
      map.set(token.text, new Map());
      key_val_list(lex,map.get(token.text));

      return true;
    }

    return false;
  }

  function root(lex,map){
       map.set(null, new Map());

      if(lex.peek().text == "&"){
          class_(lex, map);
      }else{
          key_val_list(lex, map.get(null));
      }



    while(lex.token && lex.token.text =="&"){
      lex.next();
      class_(lex, map);
    }
  }

  root(lex, mapped_object);
  return mapped_object;
}

function QueryMapToQueryString(map){
    let null_class,str ="";
    if((null_class = map.get(null))){
        if(null_class.length > 0){
            for(let [key,val] of null_class.entries()){
                str += `&${key}=${val}`;
            }
        }
        for(let [key,class_] of map.entries()){
            if(key == null) continue;
            str += `&${key}`;
            for(let [key,val] of class_.entries()){
                str += `&${key}=${val}`;
            }
        }
        return str.slice(1);
    }
    return str;
}
function TurnDataIntoQuery(data) {
    var str = "";

    if (arguments.length > 1)
        for (var i = 0; i < arguments.length; i++) {
            data = arguments[i];

            if (data.component) {
                var new_str = `${data.component}&`;

                for (var a in data)
                    new_str += (a != "component") ? `${a}=${data[a]}\&` : "";

                str += new_str.slice(0, -1) + ".";
            }
        }
    else
        for (var a in data)
            str += `${a}=${data[a]}\&`;

    return str.slice(0, -1);
}

function TurnQueryIntoData(query) {
    var out = {};

    let t = query.split(".");

    if (t.length > 0)
        t.forEach((a) => {
            var t = {};
            if (a.length > 1) {
                a.split("&").forEach((a, i) => {
                    if (i < 1) out[a] = t;
                    else {
                        let b = a.split("=");
                        out[b[0]] = b[1];
                    }
                });
            }
        });
    else {
        query.split("&").forEach((a) => {
            let b = a.split("=");
            out[b[0]] = b[1];
        });
    }



    return out;
}

/**
	JavaScript implementation of a touch scrolling interface using touch events
*/
class TouchScroller {
    /** 
        Constructs a touch object around a given dom element. Functions listeners can be bound to this object using
        this addEventListener method.
    */
    constructor(element, drag = 0.02, touchid = 0) {
        
        this.origin_x = 0;
        this.origin_y = 0;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.GO = true;
        this.drag = (drag > 0) ? drag : 0.02;
        this.element = element;

        if (!touchid instanceof Number)
            touchid = 0;

        let time_old = 0;

        let frame = (dx, dy, steps, ratio = 1) => {

            let drag_val = this.drag;

            dx -= dx * drag_val * steps * ratio;
            dy -= dy * drag_val * steps * ratio;

            let dm = Math.max(Math.abs(dy), Math.abs(dy));

            let end = !(steps > 0 && dm > 0.1 && this.GO);

            if (!end) {
                requestAnimationFrame(() => {
                    frame(dx, dy, 1);
                });
            }

            end = end && steps != 0;

            for (var i = 0, l = this.listeners.length; i < l; i++) {

                if (this.listeners[i]({
                        dx,
                        dy,
                        end
                    })) {
                    this.GO = false;
                } 
            }
        };

        this.event_b = (e) => {

            time_old = performance.now();

            var touch = e.touches[touchid];

            this.velocity_x = this.origin_x - touch.clientX;
            this.velocity_y = this.origin_y - touch.clientY;

            this.origin_x = touch.clientX;
            this.origin_y = touch.clientY;

            frame(this.velocity_x, this.velocity_y, 0, 0);
        };

        this.event_c = (e) => {

            let time_new = performance.now();

            let diff = time_new - time_old;

            let steps = Math.min(diff / 8.6666666, 1 / this.drag); // 60 FPS

            this.GO = true;

            frame(this.velocity_x, this.velocity_y, steps);

            this.velocity_x = 0;
            this.velocity_y = 0;

            window.removeEventListener("touchmove", this.event_b);
            window.removeEventListener("touchend", this.event_c);
        };

        this.event_a = (e) => {

            if(!this.GO){
                e.preventDefualt();
                e.stopPropagation();
                return false;
            }

            time_old = performance.now();

            this.GO = false;

            var touch = e.touches[touchid];

            if (!touch)
                return;

            this.origin_y = touch.clientY;
            this.origin_x = touch.clientX;

            window.addEventListener("touchmove", this.event_b);
            window.addEventListener("touchend", this.event_c);
        };

        this.element.addEventListener("touchstart", this.event_a);

        this.listeners = [];

    }

    destructor() {
        this.listeners = null;
        this.element.removeEventListener("touchstart", this.event_a);
    }



    addEventListener(callback) {
        if (callback instanceof Function) {

            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == callback) return
            }

            this.listeners.push(callback);
        }
    }

    removeEventListener(callback) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == callback) {
                this.listeners.splice(i, 1);
                return;
            }
        }
    }
}

/*********** String Parsing Basic Function ************************/
/**
	If a string object is passed, creates a lexer that tokenize the input string. 
*/
function Lex(string){
	if(typeof(string) !== "string"){
		console.warn("Cannot create a lexer on a non-string object!");
		return null;
	}

	return new Lexer(new Tokenizer(string));
}

/****** Global Object Extenders *************/
//*
Element.prototype.getWindowTop = function(){
    return (this.offsetTop + ((this.parentElement) ? this.parentElement.getWindowTop() : 0));
};

Element.prototype.getWindowLeft = function(){
    return (this.offsetLeft + ((this.parentElement) ? this.parentElement.getWindowLeft() : 0));
};

Element.prototype.getParentWindowTop = function(bool = false){
    return (((bool ? this.offsetTop : 0))+((this.parentElement) ? this.parentElement.getParentWindowTop(true) : 0));
};

Element.prototype.getParentWindowLeft = function(bool = false){
    return (((bool ? this.offsetLeft : 0))+((this.parentElement) ? this.parentElement.getWindowLeft(true) : 0));
};

Element.prototype.getStyle = function(style_name){
	return window.getComputedStyle(this,null).getPropertyValue(style_name);
};
//*/

var Common = /*#__PURE__*/Object.freeze({
    Lex: Lex,
    Lexer: Lexer,
    Tokenizer: Tokenizer,
    months: months,
    dow: dow,
    QBezier: QBezier,
    CBezier: CBezier,
    TurnQueryIntoData: TurnQueryIntoData,
    TurnDataIntoQuery: TurnDataIntoQuery,
    GetDayStartAndEnd: GetDayStartAndEnd,
    TouchScroller: TouchScroller,
    float24to12ModTime: float24to12ModTime
});

let scape_date = new Date();
scape_date.setHours(0);
scape_date.setMilliseconds(0);
scape_date.setSeconds(0);
scape_date.setTime(0);

class DateSchemaConstructor extends NumberSchemaConstructor {

    parse(value) {

        if (!isNaN(value))
            return parseInt(value);

        let lex = Lex(value);

        let year = parseInt(lex.token.text);

        if (year) {

            scape_date.setHours(0);
            scape_date.setMilliseconds(0);
            scape_date.setSeconds(0);
            scape_date.setTime(0);

            lex.next();
            lex.next();
            let month = parseInt(lex.token.text) - 1;
            lex.next();
            lex.next();
            let day = parseInt(lex.token.text);
            scape_date.setFullYear(year);
            scape_date.setDate(day);
            scape_date.setMonth(month);

            lex.next();

            if (lex.token) {

                let hours = parseInt(lex.token.text);
                lex.next();
                lex.next();
                let minutes = parseInt(lex.token.text);

                scape_date.setHours(hours);
                scape_date.setMinutes(minutes);
            }

            return scape_date.valueOf();
        } else
            return (new Date(value)).valueOf();
    }

    /**
     
     */
    verify(value, result) {

        this.parse(value);

        super.verify(value, result);
    }

    filter(identifier, filters) {

        if (filters.length > 1) {

            for (let i = 0, l = filters.length - 1; i < l; i += 2) {
                let start = filters[i];
                let end = filters[i + 1];

                if (start <= identifier && identifier <= end) {
                    return true;
                }
            }
        }

        return false;
    }

    string(value) {
        
        return (new Date(value)) + "";
    }
}

let date = new DateSchemaConstructor();

class TimeSchemaConstructor extends NumberSchemaConstructor {

    parse(value) {
        if (!isNaN(value))
            return parseInt(value);
        try {
            var hour = parseInt(value.split(":")[0]);
            var min = parseInt(value.split(":")[1].split(" ")[0]);
            var half = (value.split(":")[1].split(" ")[1].toLowerSource() == "pm");
        } catch (e) {
            var hour = 0;
            var min = 0;
            var half = 0;
        }

        return parseFloat((hour + ((half) ? 12 : 0) + (min / 60)));
    }

    verify(value, result) {
        this.parse(value);
        super.verify(value, result);
    }

    filter(identifier, filters) {
        return true
    }

    string(value) {
        return (new Date(value)) + "";
    }
}

let time = new TimeSchemaConstructor();

class StringSchemaConstructor extends SchemaConstructor {
    
    constructor() {

        super();

        this.start_value = "";
    }
    parse(value) {

        return value + "";
    }

    verify(value, result) {

        result.valid = true;
    }

    filter(identifier, filters) {

        for (let i = 0, l = filters.length; i < l; i++)
            if (identifier.match(filters[i] + ""))
                return true;

        return false;
    }
}

let string = new StringSchemaConstructor();

class BoolSchemaConstructor extends SchemaConstructor {

    constructor() {

        super();

        this.start_value = false;
    }

    parse(value) {

        return (value) ? true : false;
    }

    verify(value, result) {

        result.valid = true;

        if (!value instanceof Boolean) {
            result.valid = false;
            result.reason = " Value is not a Boolean.";
        }
    }

    filter(identifier, filters) {

        if (value instanceof Boolean)
            return true;

        return false;
    }
}

let bool = new BoolSchemaConstructor ();

let schema = { date, string, number, bool, time };

class View{

	constructor(){

		this.next = null;
		this.model = null;
	}

	destructor(){

		if(this.model)
			this.model.removeView(this);
	}	
	/**
		Called a Model when its data has changed.
	*/
	update(data){

	}
	/**
		Called by a ModelContainerBase when an item has been removed.
	*/
	removed(data){

	}

	/**
		Called by a ModelContainerBase when an item has been added.
	*/
	added(data){

	}
	setModel(model){
	}

	reset(){
		
	}
	unsetModel(){

		this.next = null;
		this.model = null;
	}
}

const caller = (window && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1);
};
/** 
    The Scheduler handles updating objects. It does this by splitting up update cycles, 
    to respect the browser event model. 

    If any object is scheduled to be updated, it will be blocked from scheduling more updates 
    until its own update method is called.
*/

const Scheduler = new(class {

    constructor() {

        this.update_queue_a = new Array();
        this.update_queue_b = new Array();

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;


        this.callback = () => this.update();

        this.frame_time = performance.now();

        this.____SCHEDULED____ = false;
    }

    queueUpdate(object) {

        if (object.____SCHEDULED____ || !object.update instanceof Function)
            if (this.____SCHEDULED____)
                return;
            else
                return caller(this.callback);

        object.____SCHEDULED____ = true;

        this.update_queue.push(object);


        if (this.____SCHEDULED____)
            return;

        this.____SCHEDULED____ = true;

        caller(this.callback);
    }

    update() {

        this.____SCHEDULED____ = false;

        let uq = this.update_queue;

        if(this.queue_switch == 0)
            (this.update_queue = this.update_queue_b, this.queue_switch = 1);
        else
            (this.update_queue = this.update_queue_a, this.queue_switch = 0);

        let time = performance.now();

        let diff = time - this.frame_time;

        this.frame_time = time;

        let step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

        for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]){
            o.____SCHEDULED____ = false;
            o.update(step_ratio);
        }

        uq.length = 0;
    }
})();

/** @namespace Model */

class ModelBase {

    constructor() {

        this.____changed_values____ = [];
    };

    destructor() {

        //inform views of the models demise
        var view = this.first_view;

        while (view) {
            view.unsetModel();
            view = view.next;
        }

        //this.first_view = null;

        this.____changed_values____ = null;
    }

    get() {
        return this;
    }

    /**
    	
    */
    scheduleUpdate(changed_value) {

        if (!this.first_view)
            return;

        this.____changed_values____.push(changed_value);

        Scheduler.queueUpdate(this);
    }

    getChanged(prop_name) {


        for (let i = 0, l = this.____changed_values____.length; i < l; i++)
            if (this.____changed_values____[i] == prop_name)
                return this[prop_name];

        return null;
    }

    /**
    	Adds a view to the linked list of views on the model. argument view MUST be an instance of View. 
    */
    addView(view) {

        if (view instanceof View) {

            if (view.model)
                view.model.removeView(view);

            var child_view = this.first_view;

            while (child_view) {

                if (view == child_view) return;
                child_view = child_view.next;
            }

            view.model = this;
            view.next = this.first_view;
            this.first_view = view;

            view.setModel(this);
            view.update(this.get());
        } else
            throw new Exception("Passed in view is not an instance of wick.View!");
    }

    /**
    	Removes view from set of views if the passed in view is a member of model. 
    */
    removeView(view) {

        if (view instanceof View && view.model == this) {

            var child_view = this.first_view;
            var prev_child = null;

            while (child_view) {

                if (view == child_view) {

                    if (prev_child) {
                        prev_child.next = view.next;
                    } else {
                        this.first_view = view.next;
                    }

                    view.next = null;
                    view.model = null;
                    view.reset();
                    return;
                }
                prev_child = child_view;
                child_view = child_view.next;
            }
        }
    }

    update(step) {

        this.updateViews(this);

        this.____changed_values____.length = 0;
    }

    /**
    	Calls update() on every view object, passing the current state of the Model.
    */
    updateViews() {

        var view = this.first_view;

        while (view) {

            view.update(this, this.____changed_values____);

            view = view.next;
        }

        this.____changed_values____.length = 0;
    }

    /**
    	Updates views with a list of models that have been removed. 
    	Primarily used in conjunction with container based views, such as SourceTemplates.
    */
    updateViewsRemoved(data) {

        var view = this.first_view;

        while (view) {

            view.removed(data);

            view = view.next;
        }
    }

    /**
    	Updates views with a list of models that have been added. 
    	Primarily used in conjunction with container based views, such as SourceTemplates.
    */
    updateViewsAdded(data) {

        var view = this.first_view;

        while (view) {

            view.added(data);

            view = view.next;
        }
    }

    toJson() {
        return JSON.stringify(this, null, '\t');
    }
}

Object.defineProperty(ModelBase.prototype, "first_view", {
    writable: true,
    configurable: false,
    enumerable: false,
});

Object.defineProperty(ModelBase.prototype, "____changed_values____", {
    writable: true,
    configurable: false,
    enumerable: false,
});

Object.seal(ModelBase.prototype);

/** @namespace Model */

class MCArray extends Array {

    constructor() {
        super();
    }

    push(item) {
        if (item instanceof Array)
            item.forEach((i) => {
                this.push(i);
            });
        else
            super.push(item);
    }

    //For compatibility
    __setFilters__() {

    }

    getChanged() {

    }

    toJSON() {
        return this;
    }

    toJson() {
        return JSON.stringify(this, null, '\t');
    }
}

// A "null" function
let EmptyFunction = () => {};
let EmptyArray = [];

class ModelContainerBase extends ModelBase {

    constructor(schema) {

        super();

        //For Linking to original 
        this.source = null;
        this.first_link = null;
        this.next = null;
        this.prev = null;

        //For keeping the container from automatic deletion.
        this.pin = EmptyFunction;

        //Filters are a series of strings or number selectors used to determine if a model should be inserted into or retrieved from the container.
        this.__filters__ = EmptyArray;

        this.schema = schema || this.constructor.schema || {};

        //The parser will handle the evaluation of identifiers according to the criteria set by the __filters__ list. 
        if (this.schema.parser && this.schema.parser instanceof SchemaConstructor)
            this.parser = this.schema.parser;
        else
            this.parser = new SchemaConstructor();


        this.id = "";

        if (this.schema.identifier && typeof(this.schema.identifier) == "string")
            this.id = this.schema.identifier;

        return this;

        return new Proxy(this, {
            get: (obj, prop, val) => (prop in obj) ? obj[prop] : obj.get(val)
        })
    }

    destructor() {

        this.schema = null;

        this.__filters__ = null;

        if (this.source) {
            this.source.__unlink__(this);
        }

        super.destructor();
    }

    /**
        Get the number of Models held in this ModelContainerBase

        @returns {Number}
    */
    get length() {
        return 0;
    }

    set length(e) {
        //NULL function. Do Not Override!
    }

    /** 
        Returns a ModelContainerBase type to store the results of a get().
    */
    __defaultReturn__(USE_ARRAY) {
        if (USE_ARRAY) return new MCArray;

        let n = new this.constructor(this.schema);

        this.__link__(n);

        return n;
    }

    /**
        Array emulating kludge

        @returns The result of calling this.insert
    */
    push(item) {
        return this.insert(item, true);
    }

    /**
        Retrieves a list of items that match the term/terms. 

        @param {(Array|SearchTerm)} term - A single term or a set of terms to look for in the ModelContainerBase. 
        @param {Array} __return_data__ - Set to true by a source Container if it is calling a SubContainer insert function. 

        @returns {(ModelContainerBase|Array)} Returns a Model container or an Array of Models matching the search terms. 
    */
    get(term, __return_data__) {

        let out = null;

        let USE_ARRAY = true;

        if (term) {




            if (__return_data__) {
                out = __return_data__;
            } else {

                if (__return_data__ === null)
                    USE_ARRAY = false;

                if (!this.source)
                    USE_ARRAY = false;

                out = this.__defaultReturn__(USE_ARRAY);
                out.__setFilters__(term);
            }
        } else
            out = (__return_data__) ? __return_data__ : this.__defaultReturn__(USE_ARRAY);

        if (!term)
            this.__getAll__(out);
        else {

            let terms = term;

            if (!term instanceof Array)
                terms = [term];

            //Need to convert terms into a form that will work for the identifier type
            terms = terms.map(t => this.parser.parse(t));


            this.__get__(terms, out);
        }

        return out
    }

    /**
        Inserts an item into the container. If the item is not a {Model}, an attempt will be made to convert the data in the Object into a Model.
        If the item is an array of objects, each object in the array will be considered separately. 

        @param {Object} item - An Object to insert into the container. On of the properties of the object MUST have the same name as the ModelContainerBase's 
        @param {Array} item - An array of Objects to insert into the container.
        @param {Boolean} __FROM_SOURCE__ - Set to true by a source Container if it is calling a SubContainer insert function. 

        @returns {Boolean} Returns true if an insertion into the ModelContainerBase occurred, false otherwise.
    */
    insert(item, __FROM_SOURCE__ = false) {

        let add_list = (this.first_view) ? [] : null;

        let out = false;

        if (!__FROM_SOURCE__ && this.source)
            return this.source.insert(item);

        if (item instanceof Array) {
            for (var i = 0; i < item.length; i++)
                if (this.__insertSub__(item[i], out, add_list))
                    out = true;
        } else if (item)
            out = this.__insertSub__(item, out, add_list);


        if (add_list && add_list.length > 0)
            this.updateViewsAdded(add_list);

        return out;
    }

    /**
        A subset of the insert function. Handles the test of identifier, the conversion of an Object into a Model, and the calling of the internal __insert__ function.
    */
    __insertSub__(item, out, add_list) {

        let model = item;

        var identifier = this.__getIdentifier__(item);

        if (identifier != undefined) {

            if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                model = new this.schema.model();
                model.add(item);
            }

            identifier = this.__getIdentifier__(model, this.__filters__);

            if (identifier) {
                out = this.__insert__(model, add_list, identifier);
                this.__linksInsert__(model);
            }
        }

        return out;
    }


    /**
        Removes an item from the container. 
    */
    remove(term, __FROM_SOURCE__ = false) {

        let terms = term;

        if (!__FROM_SOURCE__ && this.source) {

            if (!term)
                return this.source.remove(this.__filters__);
            else
                return this.source.remove(term);
        }

        let out_container = [];

        if (!term)
            this.__removeAll__();
        else {
            if (!term instanceof Array) {
                terms = [term];
            }

            //Need to convert terms into a form that will work for the identifier type
            terms = terms.map(t => this.parser.parse(t));

            this.__remove__(terms, out_container);
        }

        this.__linksRemove__(terms);

        return out_container;
    }

    /**
        Removes a ModelContainerBase from list of linked containers. 

        @param {ModelContainerBase} container - The ModelContainerBase instance to remove from the set of linked containers. Must be a member of the linked containers. 
    */
    __unlink__(container) {

        if (container instanceof ModelContainerBase && container.source == this) {

            if (container == this.first_link)
                this.first_link = container.next;

            if (container.next)
                container.next.prev = container.prev;

            if (container.prev)
                container.prev.next = container.next;

            container.source = null;
        }
    }

    /**
        Adds a container to the list of tracked containers. 

        @param {ModelContainerBase} container - The ModelContainerBase instance to add the set of linked containers.
    */
    __link__(container) {
        if (container instanceof ModelContainerBase && !container.source) {

            container.source = this;

            container.next = this.first_link;

            if (this.first_link)
                this.first_link.prev = container;

            this.first_link = container;

            container.pin = ((container) => {
                let id = setTimeout(() => {
                    container.__unlink__();
                }, 50);

                return () => {
                    clearTimeout(id);
                    if (!container.source)
                        console.warn("failed to clear the destruction of container in time!");
                }
            })(container);
        }
    }

    __linksRemove__(terms) {
        let a = this.first_link;
        while (a) {
            a.remove(terms, true);
            a = a.next;
        }
    }

    __linksInsert__(item) {
        let a = this.first_link;
        while (a) {
            a.insert(item, true);
            a = a.next;
        }
    }

    /**
        Removes any items in the model not included in the array "items", and adds any items in items not already in the ModelContainerBase.

        @param {Array} items - An array of identifiable Models or objects. 
    */
    cull(items) {
        let existing_items = __getAll__([], true);

        let loadHash = (item) => {
            if (item instanceof Array)
                return item.forEach((e) => loadHash(e));

            let identifier = this.__getIdentifier__(item);

        };

        loadHash(items);

        for (let i = 0; i < existing_items.lenth; i++) {
            let e_item = existing_items[i];
            if (!existing_items[this.__getIdentifier__(e_item)])
                this.__remove__(e_item);
        }

        this.insert(items);
    }

    __setFilters__(term) {
        if (term instanceof Array)
            this.__filters__ = this.__filters__.concat(term.map(t => this.parser.parse(t)));
        else
            this.__filters__.push(this.parser.parse(term));

    }

    /**
        Returns true if the identifier matches a predefined filter pattern, which is evaluated by this.parser. If a 
        parser was not present the ModelContainers schema, then the function will return true upon every evaluation.
    */
    __filterIdentifier__(identifier, filters) {
        if (filters.length > 0) {
            return this.parser.filter(identifier, filters);
        }
        return true;
    }

    /**
        Returns the Identifier property value if it exists in the item. If an array value for filters is passed, then undefined is returned if the identifier value does not pass filtering criteria.
        @param {(Object|Model)} item
        @param {Array} filters - An array of filter terms to test whether the identifier meets the criteria to be handled by the ModelContainerBase.
    */
    __getIdentifier__(item, filters = null) {

        let identifier = null;

        if (typeof(item) == "object")
            identifier = item[this.schema.identifier];
        else
            identifier = item;

        if (identifier)
            identifier = this.parser.parse(identifier);

        if (filters && identifier)
            return (this.__filterIdentifier__(identifier, filters)) ? identifier : undefined;

        return identifier;
    }

    /** 
        OVERRIDE SECTION ********************************************************************
        
        All of these functions should be overridden by inheriting classes
    */

    __insert__(item, add_list, identifier) {
        return false;
    }

    __get__(item, __return_data__) {
        return __return_data__;
    }

    __getAll__(__return_data__) {
        return __return_data__;
    }

    __removeAll__() {
        return [];
    }

    __remove__(item) {
        return [];
    }

    // END OVERRIDE *************************************************************************

}

/** @namespace Model */

class MultiIndexedContainer extends ModelContainerBase {

    constructor(schema) {

        super({
            identifier: "indexed",
            model: schema.model
        });

        this.schema = schema;
        this.indexes = {};
        this.first_index = null;

        this.addIndex(schema.index);
    }

    /**
        Returns the length of the first index in this container. 
    */
    get length() {
        return this.first_index.length;
    }

    /**
        Insert a new ModelContainerBase into the index through the schema.  
    */
    addIndex(index_schema) {

        for (let name in index_schema) {
            let scheme = index_schema[name];

            if (scheme.container && !this.indexes[name]) {
                this.indexes[name] = new scheme.container(scheme.schema);

                if (this.first_index)
                    this.indexes[name].insert(this.first_index.__getAll__());
                else
                    this.first_index = this.indexes[name];
            }
        }
    }

    get(item, __return_data__) {

        let out = {};

        if (item) {
            for (let name in item)
                if (this.indexes[name])
                    out[name] = this.indexes[name].get(item[name], __return_data__);
        } else

            out = this.first_index.get(null);


        return out;
    }

    remove(item) {

        var out = [];

        for (let a in item)
            if (this.indexes[a])
                out = out.concat(this.indexes[a].remove(item[a]));

        /* Replay items against indexes to insure all items have been removed from all indexes */

        for (var j = 0; j < this.indexes.length; j++)
            for (var i = 0; i < out.length; i++)
                this.indexes[j].remove(out[i]);

        //Update all views
        if (out.length > 0)
            this.updateViewsRemoved(out);

        return out;
    }

    __insert__(model, add_list, identifier) {

        let out = false;

        for (let name in this.indexes) {

            let index = this.indexes[name];

            if (index.insert(model))
                out = true;
            //else
            //    console.warn(`Indexed container ${a} ${index} failed to insert:`, model);
        }

        if (out)
            this.updateViews(this.first_index.get());

        return out;
    }
    /**
        @private 
    */
    __remove__(item) {

        let out = false;

        for (let name in this.indexes) {
            let index = this.indexes[name];
            if (index.remove(item))
                out = true;
        }

        return out;
    }

    __removeAll__() {

        let out = false;

        for (let name in this.indexes) {
            if (index.__removeAll__())
                out = true;
        }

        return out;
    }


    /**
        Overrides Model container default __getIdentifier__ to force item to pass.
        @private 
    */
    __getIdentifier__(item, filters = null) {
        return true;
    }

    toJSON() {
        return "[]";
    }
}

/**
    Stores models in random order inside an internal array object. 
 */
 
class ArrayModelContainer extends ModelContainerBase {

    constructor(schema) {
        super(schema);
        this.data = [];
    }

    destructor() {

        this.data = null;

        super.destructor();
    }

    get length() {
        return this.data.length;
    }

    __defaultReturn__() {
        if (this.source) return new MCArray;

        let n = new ArrayModelContainer(this.schema);

        this.__link__(n);

        return n;
    }

    __insert__(model, add_list, identifier) {

        for (var i = 0, l = this.data.length; i < l; i++) {

            var obj = this.data[i];

            if (this.__getIdentifier__(obj) == identifier) {

                obj.add(model);

                return false; //Model not added to Container. Model just updated.
            }
        }

        this.data.push(model);

        if (add_list) add_list.push(model);

        return true; // Model added to Container.
    }

    __get__(term, return_data) {

        let terms = null;

        if (term)
            if (term instanceof Array) {
                terms = term;
            } else
                terms = [term];



        for (let i = 0, l = this.data.length; i < l; i++) {
            let obj = this.data[i];
            if (this.__getIdentifier__(obj, terms)) {
                return_data.push(obj);
            }
        }

        return return_data;
    }

    __getAll__(return_data) {

        this.data.forEach((m) => {
            return_data.push(m);
        });

        return return_data;
    }

    __removeAll__() {
        let items = this.data.map(d => d) || [];

        this.data.length = 0;

        return items;
    }

    __remove__(term, out_container) {
        let result = false;
        for (var i = 0, l = this.data.length; i < l; i++) {
            var obj = this.data[i];

            if (this.__getIdentifier__(obj, term)) {

                result = true;

                this.data.splice(i, 1);

                l--;
                i--;

                out_container.push(obj);
            }
        }

        return result;
    }

    toJSON() {

        return this.data;
    }
}

Object.freeze(ArrayModelContainer);

/** @namespace Model */

class BTreeModelContainer extends ModelContainerBase {

    constructor(schema$$1) {

        if(!schema$$1 || !(schema$$1.parser) ||  !(schema$$1.parser instanceof NumberSchemaConstructor))
            throw new Error("BTreeModelContainer's MUST use a parser schema that is or inherits from NumberType schema and returns numerical values.");
        
        super(schema$$1);

        this.root = null;
        this.min = 10;
        this.max = 20;
        this.size = 0;
    }

    destructor() {
        if (this.root)
            this.root.destructor();

        super.destructor();
    }

    get length() {
        return this.size;
    }

    __insert__(model, add_list, identifier) {

        let result = {
            added: false
        };

        if (!this.root)
            this.root = new BtreeNode(true);

        this.root = this.root.insert(identifier, model, this.max, true, result).newnode;

        if (add_list) add_list.push(model);

        if (result.added)
            this.size++;

        return result.added;
    }

    __get__(terms, __return_data__) {

        if (this.root && terms.length > 0) {
            if (terms.length == 1) {
                this.root.get(parseFloat(terms[0]), parseFloat(terms[0]), __return_data__);
            } else if (terms.length < 3) {
                this.root.get(parseFloat(terms[0]), parseFloat(terms[1]), __return_data__);
            } else {
                for (let i = 0, l = terms.length - 1; i > l; i += 2)
                    this.root.get(parseFloat(terms[i]), parseFloat(terms[i + 1]), __return_data__);
            }
        }

        return __return_data__;
    }

    __remove__(terms, out_container) {
        let result = 0;

        if (this.root && terms.length > 0) {
            if (terms.length == 1) {
                let o = this.root.remove(terms[0], terms[0], true, this.min, out_container);
                result = o.out;
                this.root = o.out_node;
            } else if (terms.length < 3) {
                let o = this.root.remove(terms[0], terms[1], true, this.min, out_container);
                result = o.out;
                this.root = o.out_node;
            } else {
                for (let i = 0, l = terms.length - 1; i > l; i += 2) {
                    let o = this.root.remove(terms[i], terms[i + 1], true, this.min, out_container);
                    result = o.out;
                    this.root = o.out_node;
                }
            }
        }

        this.size -= result;

        return result !== 0;
    }

    __getAll__(__return_data__) {
        if (this.root)
            this.root.get(-Infinity, Infinity, __return_data__);
        return __return_data__;
    }

    __removeAll__() {
        if (this.root)
            this.root.destructor();
        this.root = null;
    }

    toJSON() {
        let out_data = [];

        if (this.root) {

            this.root.get(-Infinity, Infinity, out_data);
        }

        return out_data;
    }
}

class BtreeNode {
    constructor(IS_LEAF = false) {
        this.LEAF = IS_LEAF;
        this.nodes = [];
        this.keys = [];
        this.items = 0;
    }

    destructor() {

        this.nodes = null;
        this.keys = null;

        if (!this.LEAF) {
            for (let i = 0, l = this.nodes.length; i < l; i++)
                this.nodes[i].destructor();
        }

    }

    balanceInsert(max_size, IS_ROOT = false) {
        if (this.keys.length >= max_size) {
            //need to split this up!

            let newnode = new BtreeNode(this.LEAF);

            let split = (max_size >> 1) | 0;

            let key = this.keys[split];

            let left_keys = this.keys.slice(0, split);
            let left_nodes = this.nodes.slice(0, (this.LEAF) ? split : split + 1);

            let right_keys = this.keys.slice((this.LEAF) ? split : split + 1);
            let right_nodes = this.nodes.slice((this.LEAF) ? split : split + 1);

            newnode.keys = right_keys;
            newnode.nodes = right_nodes;

            this.keys = left_keys;
            this.nodes = left_nodes;

            if (IS_ROOT) {

                let root = new BtreeNode();

                root.keys.push(key);
                root.nodes.push(this, newnode);

                return {
                    newnode: root,
                    key: key
                };
            }

            return {
                newnode: newnode,
                key: key
            }
        }

        return {
            newnode: this,
            key: 0
        };
    }

    /**
        Inserts model into the tree, sorted by identifier. 
    */
    insert(identifier, model, max_size, IS_ROOT = false, result) {

        let l = this.keys.length;

        if (!this.LEAF) {

            for (var i = 0; i < l; i++) {

                let key = this.keys[i];

                if (identifier < key) {
                    let node = this.nodes[i];

                    let o = node.insert(identifier, model, max_size, false, result);
                    let keyr = o.key;
                    let newnode = o.newnode;

                    if (keyr == undefined) debugger

                    if (newnode != node) {
                        this.keys.splice(i, 0, keyr);
                        this.nodes.splice(i + 1, 0, newnode);
                    }

                    return this.balanceInsert(max_size, IS_ROOT);
                }
            }

            let node = this.nodes[i];

            let {
                newnode,
                key
            } = node.insert(identifier, model, max_size, false, result);

            if (key == undefined) debugger

            if (newnode != node) {
                this.keys.push(key);
                this.nodes.push(newnode);
            }

            return this.balanceInsert(max_size, IS_ROOT);

        } else {

            for (let i = 0, l = this.keys.length; i < l; i++) {
                let key = this.keys[i];

                if (identifier == key) {
                    this.nodes[i].add(key);

                    result.added = false;

                    return {
                        newnode: this,
                        key: identifier
                    };
                } else if (identifier < key) {

                    this.keys.splice(i, 0, identifier);
                    this.nodes.splice(i, 0, model);

                    result.added = true;

                    return this.balanceInsert(max_size, IS_ROOT);
                }
            }

            this.keys.push(identifier);
            this.nodes.push(model);

            result.added = true;

            return this.balanceInsert(max_size, IS_ROOT);
        }

        return {
            newnode: this,
            key: identifier,
        };
    }

    balanceRemove(index, min_size) {
        let left = this.nodes[index - 1];
        let right = this.nodes[index + 1];
        let node = this.nodes[index];

        //Left rotate
        if (left && left.keys.length > min_size) {

            let lk = left.keys.length;
            let ln = left.nodes.length;

            node.keys.unshift((node.LEAF) ? left.keys[lk - 1] : this.keys[index - 1]);
            node.nodes.unshift(left.nodes[ln - 1]);

            this.keys[index - 1] = left.keys[lk - 1];

            left.keys.length = lk - 1;
            left.nodes.length = ln - 1;

            return false;
        } else
            //Right rotate
            if (right && right.keys.length > min_size) {

                node.keys.push((node.LEAF) ? right.keys[0] : this.keys[index]);
                node.nodes.push(right.nodes[0]);

                right.keys.splice(0, 1);
                right.nodes.splice(0, 1);

                this.keys[index] = (node.LEAF) ? right.keys[1] : right.keys[0];

                return false;

            } else {

                //Left or Right Merge
                if (!left) {
                    index++;
                    left = node;
                    node = right;
                }

                let key = this.keys[index - 1];
                this.keys.splice(index - 1, 1);
                this.nodes.splice(index, 1);

                left.nodes = left.nodes.concat(node.nodes);
                if (!left.LEAF) left.keys.push(key);
                left.keys = left.keys.concat(node.keys);


                if (left.LEAF)
                    for (let i = 0; i < left.keys.length; i++)
                        if (left.keys[i] != left.nodes[i].id)
                            debugger;

                return true;
            }

    }

    remove(start, end, IS_ROOT = false, min_size, out_container) {
        let l = this.keys.length,
            out = 0,
            out_node = this;

        if (!this.LEAF) {

            for (var i = 0; i < l; i++) {

                let key = this.keys[i];

                if (start <= key)
                    out += this.nodes[i].remove(start, end, false, min_size, out_container).out;
            }

            out += this.nodes[i].remove(start, end, false, min_size, out_container).out;

            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].keys.length < min_size) {
                    if (this.balanceRemove(i, min_size)) {
                        l--;
                        i--;
                    }                }            }

            if (this.nodes.length == 1)
                out_node = this.nodes[0];

        } else {

            for (let i = 0, l = this.keys.length; i < l; i++) {
                let key = this.keys[i];

                if (key <= end && key >= start) {
                    out_container.push(this.nodes[i]);
                    out++;
                    this.keys.splice(i, 1);
                    this.nodes.splice(i, 1);
                    l--;
                    i--;
                }
            }
        }

        return {
            out_node,
            out
        };
    }

    get(start, end, out_container) {

        if (!start || !end)
            return false;

        if (!this.LEAF) {

            for (var i = 0, l = this.keys.length; i < l; i++) {

                let key = this.keys[i];

                if (start <= key)
                    this.nodes[i].get(start, end, out_container);
            }

            this.nodes[i].get(start, end, out_container, );

        } else {

            for (let i = 0, l = this.keys.length; i < l; i++) {
                let key = this.keys[i];

                if (key <= end && key >= start)
                    out_container.push(this.nodes[i]);
            }
        }
    }
}

Object.freeze(BTreeModelContainer);

/** @namespace Model */

/**
    This is used by NModel to create custom property getter and setters 
    on non-ModelContainerBase and non-Model properties of the NModel constructor.
*/
function CreateSchemedProperty(constructor, scheme, schema_name) {

    if (constructor.prototype[schema_name])
        return;

    let __shadow_name__ = `__${schema_name}__`;


    Object.defineProperty(constructor.prototype, __shadow_name__, {
        writable: true,
        configurable: false,
        enumerable: false,
        value: scheme.start_value || undefined
    });

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {
            return this[__shadow_name__];
        },

        set: function(value) {

            let result = {
                valid: false
            };

            let val = scheme.parse(value);

            scheme.verify(val, result);

            if (result.valid && this[__shadow_name__] != val)
                (this[__shadow_name__] = val, this.scheduleUpdate(schema_name));
        }
    });
}

/**
    This is used by NModel to create custom property getter and setters 
    on Schemed ModelContainerBase properties of the NModel constructor.
*/
function CreateMCSchemedProperty(constructor, scheme, schema_name) {

    let schema$$1 = scheme.schema;

    let mc_constructor = scheme.container;

    let __shadow_name__ = `__${schema_name}__`;

    Object.defineProperty(constructor.prototype, __shadow_name__, {
        enumerable: false,
        writable: true,
        value: null
    });

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {

            if (!this[__shadow_name__])
                this[__shadow_name__] = new mc_constructor(scheme.schema);

            return this[__shadow_name__];
        },

        set: function(value) {

            let MC = this[__shadow_name__];
            let data = null;

            if (typeof(value) == "string")
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.log(e);
                    return;
                }

            if (value instanceof Array) {
                data = value;
                MC = new mc_constructor(scheme.schema);
                this[__shadow_name__] = MC;
                MC.insert(data);
                this.scheduleUpdate(schema_name);
            } else if (value instanceof mc_constructor) {
                this[__shadow_name__] = value;
                console.log(schema_name);
                this.scheduleUpdate(schema_name);
            }
        }
    });
}

/**
    This is used by NModel to create custom property getter and setters 
    on Model properties of the NModel constructor.
*/
function CreateModelProperty(constructor, scheme, schema_name) {

    let schema$$1 = scheme.schema;

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,

        get: function() {
            Object.defineProperty(this, schema_name, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: new scheme()
            });
            return this[schema_name];
        },

        set: function(value) {}
    });
}

class Model extends ModelBase {
    /**
     
     */
    constructor(data) {

        super();
        //The schema is stored directly on the constructor. If it is not there, then consider this model type to "ANY"
        let schema$$1 = this.constructor.schema;

        if (schema$$1) {
            let __FinalConstructor__ = schema$$1.__FinalConstructor__;

            let constructor = this.constructor;

            Object.defineProperty(constructor.prototype, "schema", {
                writable: false,
                enumerable: false,
                configurable: false,
                value: schema$$1
            });

            if (!__FinalConstructor__) {
                for (let schema_name in schema$$1) {
                    let scheme = schema$$1[schema_name];

                    if (scheme instanceof Array) {
                        if (scheme[0] && scheme[0].container && scheme[0].schema) {
                            CreateMCSchemedProperty(constructor, scheme[0], schema_name);
                        } else if (scheme[0] instanceof ModelContainerBase) {
                            CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                        }
                    } else if (scheme instanceof Model)
                        CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                    else if (scheme instanceof SchemaConstructor)
                        CreateSchemedProperty(constructor, scheme, schema_name);
                    else
                        console.warn(`Could not create property ${schema_name}.`);

                }

                Object.seal(constructor);


                Object.defineProperty(schema$$1, "__FinalConstructor__", {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                    value: constructor
                });
                //schema.__FinalConstructor__ = constructor;


                //Start the process over with a newly minted Model that has the properties defined in the Schema
                return new constructor(data);
            }
        } else {
            /* This will be an ANY Model */
            return new AnyModel(data);
        }

        if (data)
            this.add(data);
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {

        this.schema = null;

        for (let a in this) {
            let prop = this[a];
            if (typeof(prop) == "object" && prop.destructor instanceof Function)
                prop.destructor();
            else
                this[a] = null;
        }

        super.destructor();
        //debugger
    }

    /**
        Given a key, returns an object that represents the status of the value contained, if it is valid or not, according to the schema for that property. 
    */
    verify(key) {

        let out_data = {
            valid: true,
            reason: ""
        };

        var scheme = this.schema[key];

        if (scheme) {
            if (scheme instanceof Array) ; else if (scheme instanceof Model) ; else {
                scheme.verify(this[key], out_data);
            }
        }

        return out_data
    }

    /**
        Returns a parsed value based on the key 
    */
    string(key) {

        if (key) {
            var scheme = this.schema[key];

            if (scheme) {
                if (scheme instanceof Array) {
                    this[key].string();
                } else if (scheme instanceof Model) {
                    this[key].string();
                } else {
                    return scheme.string(this[key]);
                }
            }
        }
    }

    /**
        @param data : An object containing key value pairs to insert into the model. 
    */
    add(data) {

        for (let a in data)
            if (a in this) this[a] = data[a];
    }


    get(data) {

        var out_data = {};

        if (!data)
            return this;
        else
            for (var a in data)
                if (a in this) out_data[a] = this[a];

        return out_data;
    }

    toJSON() {
        let out = {};

        let schema$$1 = this.schema;

        for (let prop in schema$$1) {

            let scheme = schema$$1[prop];

            out[prop] = this[prop];
        }

        return out;
    }
}

function AnyModelProxySet(obj, prop, val) {

    if (prop in obj && obj[prop] == val)
        return true

    obj[prop] = val;

    obj.scheduleUpdate(prop);

    return true;
}

class AnyModel extends ModelBase {

    constructor(data) {

        super();

        if (data) {
            for (let prop_name in data)
                this[prop_name] = data[prop_name];
        }

        return new Proxy(this, {
            set: AnyModelProxySet
        })
    }

    /**
        Alias for destructor
    */

    destroy() {

        this.destructor();
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {

        super.destructor();
    }

    add(data) {

        for (var a in data)
            this[a] = data[a];
    }

    get(data) {

        var out_data = {};

        if (!data) {
            return this;
        } else {
            for (var a in data) {
                let prop = this[a];
                if (prop) {
                    out_data[a] = prop;
                }
            }
        }

        return out_data;
    }

    /**
        Removes items in containers based on matching index.
    */

    remove(data) {

        return {};
    }

    toJSON() {

        let out = {};


        for (let prop in this) {

            if (prop == "first_view" ||
                prop == "changed_values" ||
                prop == "____SCHEDULED____")
                continue;

            out[prop] = this[prop];
        }

        return out;
    }

    toJsonString() {

        return this.data + "";
    }
}

class Transitioneer {
    constructor() {

    }

    set(element, data) {
        element.style.transition = "opacity 0.5s";
        element.style.opacity = 0;
    }

    set_in(element, data, index = 0) {
    	element.style.transition = `opacity ${0.8*index+0.5}s`;
        element.style.opacity = 1;
        return 0.8;
    }

    set_out(element, data, index = 0) {
        element.style.opacity = 0;
        return 0.8;
    }

    finalize_out(element) {
    	element.style.opacity = 0;
    }
}

let PresetTransitioneers = {
    base: Transitioneer
};

class SourceBase extends View {

    constructor(parent = null, data = {}, presets = {}) {

        super();

        this.parent = parent;
        this.element = null;
        this.children = [];
        this.data = data;
        this.named_elements = null;
        this.active = false;
        this.export_val = null;

        this.DESTROYED = false;

        //Setting the transitioner
        this.transitioneer = null;

        if (data.trs) {

            if (presets.transitions && presets.transitions[data.trs])
                this.transitioneer = new presets.transitions[data.trs]();
            else if (PresetTransitioneers[data.trs])
                this.transitioneer = new PresetTransitioneers[data.trs]();

            this.transitioneer.set(this.element);
        }

        this.addToParent();
    }

    addToParent() {
        if (this.parent) this.parent.children.push(this);
    }

    destructor() {

        this.DESTROYED = true;

        if (this.LOADED) {


            let t = this.transitionOut();

            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                t = Math.max(t, child.transitionOut());
            }

            if (t > 0)
                setTimeout(() => { this.destructor(); }, t * 1000 + 5);


        } else {
            this.finalizeTransitionOut();
            this.children.forEach((c) => c.destructor());
            this.children.length = 0;
            this.data = null;

            if (this.element && this.element.parentElement)
                this.element.parentElement.removeChild(this.element);

            this.element = null;

            super.destructor();
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {

        if (this.parent) {

            if (this.data.transition)
                trs_ele[this.data.transition] = this.element;

            for (var i = 0, l = this.children.length; i < l; i++) {

                let ch = this.children[i];

                if (ch !== child)
                    ch.gatherTransitionElements(trs_ele);
            }

            this.parent.bubbleLink(link_url, this, trs_ele);
        } else {
            history.pushState({}, "ignored title", link_url);
            window.onpopstate();
        }
    }

    getNamedElements(named_elements) {}

    gatherTransitionElements(trs_ele) {

        if (this.data.transition && !trs_ele[this.data.transition])
            trs_ele[this.data.transition] = this.element;

        this.children.forEach((e) => {
            if (e.is == 1)
                e.gatherTransitionElements(trs_ele);
        });
    }

    copy(element, index) {
        
        let out_object = {};

        if (!element)
            element = this.element.cloneNode(true);

        if (this.children) {
            out_object.element = element.children[this.element];
            out_object.children = new Array(this.children.length);

            for (var i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];
                out_object.children[i] = child.copy(out_object.element);
            }
        }

        return out_object;
    }

    handleUrlUpdate(wurl) {}

    finalizeTransitionOut() {

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].finalizeTransitionOut();

        if (this.transitioneer)
            this.transitioneer.finalize_out(this.element);

        this.hide();
    }


    /**
      @returns {number} Time in milliseconds that the transition will take to complete.
    */
    transitionIn(index = 0) {

        this.show();

        let transition_time = 0;

        this.LOADED = true;

        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionIn(index));

        if (this.transitioneer)
            transition_time = Math.max(transition_time, this.transitioneer.set_in(this.element, this.data, index));

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0, DESTROY = false) {

        let transition_time = 0;

        this.LOADED = false;

        if (this.transitioneer)
            transition_time = Math.max(transition_time, this.transitioneer.set_out(this.element, this.data, index));

        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionOut(index));

        if (DESTROY)
            setTimeout(() => { this.finalizeTransitionOut();
                this.destructor(); }, transition_time * 1000);

        return transition_time;
    }

    updateDimensions() {

        for (var i = 0; i < this.children.length; i++)
            this.children[i].updateDimensions();
    }

    /**
        Called by  parent when data is update and passed down from further up the graph. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __down__(data, changed_properties = null, IMPORTED = false) {

        let r_val = this.down(data, changed_properties, IMPORTED);

        if (r_val)(data = r_val, IMPORTED = true);

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__down__(data, changed_properties, IMPORTED);
    }
    down(data, changed_properties = null, IMPORTED) {}

    /**
        Called by  parent when data is update and passed up from a leaf. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __up__(data) {

        if (this.parent)
            this.parent(up);
    }

    up(data) {

        if (data)
            this.__up__(data);
    }

    __update__(data, FROM_PARENT = false) {

        let r_data = this.update(data, FROM_PARENT);

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__update__(r_data || data, true);
    }

    load(model) {
        for (var i = 0; i < this.children.length; i++)
            this.children[i].load(model);
    }

    hide() {

        if (this.element) {

            this.display = this.element.style.display;
            this.element.style.display = "none";
        }
    }

    show() {

        if (this.element)
            if (this.element.style.display == "none")
                this.element.style.display = this.display;
    }

    __updateExports__(data) {

        if (this.data.export && data[this.data.export])
            this.export_val = data[this.data.export];
    }

    __getExports__(exports) {

        if (this.export_val)
            exports[this.data.export] = this.export_val;
    }

    /**
        Exports data stored from updateExports() into a an Object exports and calls it's parent's export function, passing exports
    */
    export (exports = new AnyModel) {

        if (this.parent && this.parent.export) {


            this.__getExports__(exports);

            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__getExports__(exports);

            this.parent.export(exports);
        }
    }

    import (data) {

        if (this.model)
            this.model.add(data);

        this.export(data);
    }

    updateExports(data) {

        if (this.data.export && data[this.data.export])
            this.export = data[this.data.export];
    }

    add(value) {

        if (this.model) {
            this.model.add(value);
            this.export(this.model);
        } else if (this.parent && this.parent.add)
            this.parent.add(value);
    }
}

class Controller{
	
	constructor(){
		this.model = null;
	}

	destructor(){
		this.model = null;
	}

	setModel(model){
		if(model instanceof Model){
			this.model = model;
		}
	}

	set(data){
		if(this.model)
			this.model.add(data);
		
	}
}

/**
 * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
 *
 * {name} Getter
 */
class Getter extends Controller {
    constructor(url, process_data) {
        super();
        this.url = url;
        this.FETCH_IN_PROGRESS = false;
        this.rurl = process_data;
    }

    destructor() {
        super.destructor();
    }

    get(request_object, store_object, secure = true) {
        //if(this.FETCH_IN_PROGRESS)
        //    return null;
        this.FETCH_IN_PROGRESS = true;

        var url = ((secure) ? "https://" : "http://") + window.location.host + this.url + ( (request_object) ? ("?" + this.__process_url__(request_object)) : "");

        return ((store) => fetch(url,
        {
            credentials: "same-origin", // Sends cookies back to server with request
            method: 'GET'
        }).then((response)=>{
            this.FETCH_IN_PROGRESS = false;
            (response.json().then((j)=>{
                this.__process_response__(j, store);
            }));
        }).catch((error)=>{
            this.FETCH_IN_PROGRESS = false;
            this.__rejected_reponse__(store);
            console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
        })) (store_object)
    }

    parseJson(in_json){
        return in_json;
    }

    __process_url__(data) {
        var str = "";
        for (var a in data) {
            str += `${a}=${data[a]}\&`;
        }

        return str.slice(0, -1);
    }

    __rejected_reponse__(store){
        if(store)
            console.error("Unprocessed stored data in getter.");
    }   

    __process_response__(json, store) {

        if(this.rurl && json){
            var watch_points = this.rurl.split("<");
            
            for(var i = 0; i < watch_points.length && json; i++){
                json = json[parseInt(watch_points[i])?parseInt(watch_points[i]):watch_points[i]];
            } 

            console.log("json", json);
        }

        //result(request);
            if (this.model){
            //should be able to pipe responses as objects created from well formulated data directly into the model.
                this.set(this.parseJson(json, store));
            }
            else
                console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`);

    }
}

/**
 *	Converts links into Javacript enabled buttons that will be handled within the current Active page.
 *
 * @param {HTMLElement} element - Parent Element that contains the <a> elements to be evaulated by function.
 * @param {function} __function__ - A function the link will call when it is clicked by user. If it returns false, the link will act like a normal <a> element and cause the browser to navigate to the "href" value.
 *
 * If the <a> element has a data-ignore_link attribute set to a truthy value, then this function will not change the way that link operates.
 * Likewise, if the <a> element has a href that points another domain, then the link will remain unaffected.
 */
function setLinks(element, __function__) {
    let links = element.getElementsByTagName("a");
    for (let i = 0, l = links.length; i < l; i++) {
        let temp = links[i];

        if (temp.dataset.ignore_link) continue;

        if (temp.origin !== location.origin) continue;

        if (!temp.onclick) temp.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(temp.href, temp, __function__);
    }
}

/**
    Deals with specific properties on a model. 
*/
class Cassette extends SourceBase {
    constructor(parent, element, presets, data) {

        super(parent, element, presets, data);

        this.prop = this.data.prop;

        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.lvl = 0;
        this.is = 1;
        this.data_cache = null;
        this.children = [];

        if (this.element.tagName == "A")
            this.processLink(this.element);
    }

    destructor() {

        if (this.element.tagName == "A")
            this.destroyLink(this.element);

        this.data_cache = null;

        super.destructor();
    }

    /**
        This will attach a function to the link element to intercept and process data from the cassette.
    */
    processLink(element, link) {

        if (element.origin !== location.origin) return;

        if (!element.onclick) element.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(element.href, element, (href, a) => {

            let SAME_LOCALE = (location.pathname == a.pathname);

            let hashtag = href.includes("#");

            let real_href = "";

            let lex = Lex(href);

            while (lex.token) {

                if (lex.token.text == "{") {
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();
                    real_href += this[prop] || this.data_cache[prop];

                    if (lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`);
                } else {
                    real_href += lex.token.text;
                }

                lex.next();
            }

            if (hashtag)
                this.export();

            if (!SAME_LOCALE)
                this.bubbleLink(real_href);

            return true;
        });

        element.onmouseover = (() => {

            let href = element.href;

            let real_href = "";

            let lex = Lex(href);

            while (lex.token) {
                if (lex.token.text == "{") {
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();

                    real_href += this[prop] || this.data_cache[prop];

                    if (lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`);
                } else {
                    real_href += lex.token.text;
                }

                lex.next();
            }
        });
    }

    destroyLink(element) {

        element.onclick = null;
        element.onmouseover = null;
    }


    update(data, __FROM_PARENT__ = false) {

        super.__updateExports__(data);

        if (data) {

            if (this.prop) {
                this.element.innerHTML = data[this.prop];
                this[this.prop] = data[this.prop];
            } else {
                this.data_cache = data;
            }
        }
    }

    import (data) {

    }

    load(model) {

        this.children.forEach((e) => {
            e.load(model);
        });

        if (this.data.model)
            model.addView(this);
    }

    updateDimensions() {

        var d = this.element.getBoundingClientRect();

        this.width = d.width;
        this.height = d.height;
        this.top = d.top;
        this.left = d.left;

        super.updateDimensions();
    }
}

class Source extends SourceBase {

    /**
        Source constructor. Builds a Source object.
        @params [DOMElement] element - A DOM <template> element that contains a <case> element.
        @params [RouterPresets] presets
        @params [Source] parent - The parent Source object, used internally to build Source's in a hierarchy
        @params [Model] model - A model that can be passed to the case instead of having one created or pulled from presets. 
        @params [DOM]  WORKING_DOM - The DOM object that contains templates to be used to build the case objects. 
    */
    constructor(parent = null, data, presets) {

        super(parent, data, presets);

        this.USE_SECURE = presets.USE_HTTPS;
        this.named_elements = {};
        this.template = null;
        this.prop = null;
        this.url = null;
        this.presets = presets;
        this.receiver = null;
        this.query = {};
        this.REQUESTING = false;
        this.exports = null;


        this.filter_list = [];
        this.templates = [];
        this.filters = [];
        this.is = 0;
    }

    destructor() {

        this.parent = null;

        if (this.receiver)
            this.receiver.destructor();

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].destructor();

        super.destructor();
    }

    /**
        Sets up Model connection or creates a new Model from a schema.
    */
    load(model) {

        if (this.data.url) {
            //import query info from the wurl
            let str = this.data.url;
            let cassettes = str.split(";");
            this.data.url = cassettes[0];

            for (var i = 1; i < cassettes.length; i++) {
                let cassette = cassettes[i];

                switch (cassette[0]) {
                    case "p":
                        //TODO
                        this.url_parent_import = cassette.slice(1);
                        break;
                    case "q":
                        this.url_query = cassette.slice(1);
                        break;
                    case "<":
                        this.url_return = cassette.slice(1);
                }
            }
        }

        this.prop = this.data.prop;

        if (this.data.export) this.exports = this.data.export;

        if (this.model) {
            model = this.model;
            this.model = null;
        }

        if (model && model instanceof Model) {

            if (this.schema) {
                /* Opinionated Source - Only accepts Models that are of the same type as its schema.*/
                if (model.constructor != this.schema) ; else
                    this.schema = null;

            }
            this.model = null;
        }

        if (this.schema)
            model = new this.schema();

        model.addView(this);

        if (this.model) {
            if (this.data.url) {
                this.receiver = new Getter(this.data.url, this.url_return);
                this.receiver.setModel(model);
                this.____request____();
            }
        } else
            throw new Error(`No Model could be found for Source constructor! Source schema "${this.data.schema}", "${this.presets.schemas[this.data.schema]}"; Source model "${this.data.model}", "${this.presets.models[this.data.model]}";`);

        for (var i = 0; i < this.children.length; i++)
            this.children[i].load(this.model);
    }

    ____request____(query) {

        this.receiver.get(query, null, this.USE_SECURE).then(() => {
            this.REQUESTING = false;
        });
        this.REQUESTING = true;
    }

    export (exports) {

        this.updateSubs(this.children, exports, true);

        super.export(exports);
    }

    updateSubs(cassettes, data, IMPORT = false) {

        for (var i = 0, l = cassettes.length; i < l; i++) {

            let cassette = cassettes[i];

            if (cassette instanceof Source)
                cassette.update(data, true);
            else {
                let r_val;

                if (IMPORT) {

                    if (cassette.data.import && data[cassette.data.import]) {
                        r_val = cassette.update(data, true);

                        if (r_val) {
                            this.updateSubs(cassette.children, r_val);
                            continue;
                        }
                    }
                } else {
                    /** 
                        Overriding the model data happens when a cassette returns an object instead of undefined. This is assigned to the "r_val" variable
                        Any child cassette of the returning cassette will be fed "r_val" instead of "data".
                    */

                    r_val = cassette.update(data, true);
                }


                this.updateSubs(cassette.children, r_val || data, IMPORT);
            }
        }
    }

    up(data) {
        this.model.add(data);
    }

    update(data, changed_values) {
        this.__down__(data, changed_values);
    }


    handleUrlUpdate(wurl) {
        let query_data = null;
        /* 
            This part of the function will import data into the model that is obtained from the query string 
        */
        if (wurl && this.data.import) {
            query_data = {};
            if (this.data.import == "null") {
                query_data = wurl.getClass();
                console.log(query_data);
            } else {
                var l = this.data.import.split(";");
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");

                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }
        }

        if (wurl && this.data.url) {

            let query_data = {};
            if (this.url_query) {
                var l = this.url_query.split(";");
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");
                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }

            this.____request____(query_data);
        }

        if (!this.model) {

            this.model = new this.model_constructor();


            if (this.getter)
                this.getter.setModel(this.model);

            this.model.addView(this);
        }

        if (query_data) {
            if (!this.model.add(query_data)) {
                this.update(this.model.get());
            }
        } else
            this.update(this.model.get());
    }

    transitionIn(index = 0) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionIn(index));

        transition_time = Math.max(transition_time, super.transitionIn(index));

        this.updateDimensions();

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0, DESTROY = false) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionOut(index));

        transition_time = Math.max(transition_time, super.transitionOut(index, DESTROY));

        return transition_time;
    }

    finalizeTransitionOut() {

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].finalizeTransitionOut();

        super.finalizeTransitionOut();
    }

    setActivating() {
        if (this.parent)
            this.parent.setActivating();
    }

    getNamedElements(named_elements) {
        for (let comp_name in this.named_elements)
            named_elements[comp_name] = this.named_elements[comp_name];
    }
}

class CustomSource extends Source {
    constructor(element, data = {}, presets = {}) {
        super(null, element, data, presets);
    }
}

class Filter extends Cassette {
	
    constructor(parent, element, d, p) {

        super(parent, element, d, p);

        parent.filter_list.push((data) => this.filter(data));

        this.element.addEventListener("input", () => {
            this.parent.update();
        });
    }

    update(data) {
        //apply a filter object to the parent
        return false;
    }

    filter(data) {
        return false;
    }
}

class SourceTemplate extends Source {

    /**
        SourceTemplate constructor. Builds a SourceTemplate object.
    */

    constructor(parent = null, data, presets) {

        super(parent, data, presets);

        this.cases = [];
        this.activeSources = [];

        this.templates = [];
        this.filters = [];
        this.terms = [];

        this.range = null;

        this.prop_elements = [];
    }

    filterUpdate() {

        let output = this.cases.slice();

        for (let l = this.filters.length, i = 0; i < l; i++) {
            output = this.filters[i].filter(output);
        }

        for (var i = 0; i < this.activeSources.length; i++) {
            this.element.removeChild(this.activeSources[i].element);
        }

        for (var i = 0; i < output.length; i++) {
            this.element.appendChild(output[i].element);
        }

        this.element.style.position = this.element.style.position;

        for (var i = 0; i < output.length; i++)
            output[i].transitionIn(i);

        this.activeSources = output;
        //Sort and filter the output to present the results on screen.
    }

    cull(new_items) {

        if (new_items.length == 0) {

            for (let i = 0, l = this.cases.length; i < l; i++)
                this.cases[i].destructor();

            this.cases.length = 0;

        } else {

            let exists = new Map(new_items.map(e => [e, true]));

            var out = [];

            for (let i = 0, l = this.cases.length; i < l; i++)
                if (!exists.has(this.cases[i].model)) {
                    this.cases[i].destructor();
                    this.cases.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.cases[i].model, false);


            exists.forEach((v, k, m) => {
                if (v) out.push(k);
            });

            if (out.length > 0)
                this.added(out);
        }
    }

    load(model) {}

    removed(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            for (let j = 0; j < this.cases.length; j++) {
                let Source$$1 = this.cases[j];

                if (Source$$1.model == item) {
                    this.cases.splice(j, 1);
                    Source$$1.dissolve();
                    break;
                }
            }
        }

        this.filterUpdate();
    }

    added(items) {

        for (let i = 0; i < items.length; i++) {
            let Source$$1 = this.templates[0].flesh(items[i]);
            Source$$1.parent = this;
            this.cases.push(Source$$1);
        }

        this.filterUpdate();
    }

    revise() {
        if (this.cache)
            this.update(this.cache);
    }


    getTerms() {

        let out_terms = [];

        for (let i = 0, l = this.terms.length; i < l; i++)
            out_terms.push(this.terms[i].term);


        if (out_terms.length == 0)
            return null;

        return out_terms;
    }

    update(data, IMPORT = false) {

        console.log(data.toJson());

        let container = data.getChanged(this.prop);

        if (IMPORT) {

            let UPDATE = false;

            for (let i = 0, l = this.terms.length; i < l; i++) {
                if (this.terms[i].update(data))
                    UPDATE = true;
            }

            if (UPDATE && this.model)
                this.cull(this.get());


            for (let i = 0, l = this.filters.length; i < l; i++)
                if (this.filters[i].update(data))
                    UPDATE = true;

            if (UPDATE)
                this.filterUpdate();

        }

        if (container && (container instanceof ModelContainerBase || container.____self____)) {

            this.cache = data;

            let own_container = container.get(this.getTerms(), null);

            if (own_container instanceof ModelContainerBase) {
                own_container.pin();
                own_container.addView(this);
                this.cull(this.get());
            } else if (own_container instanceof MCArray) {
                this.cull(own_container);
            } else {
                own_container = data.____self____.data[this.prop];
                if (own_container instanceof ModelContainerBase) {
                    own_container.addView(this);
                    this.cull(this.get());
                }
            }
        }
    }

    get() {
        if (this.model instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;

                let query = {};

                query[index] = this.getTerms();

                return this.model.get(query)[index];
            } else
                console.warn("No index value provided for MultiIndexedContainer!");
        } else {
            let source = this.model.source;
            let terms = this.getTerms();

            if (source) {
                this.model.destructor();

                let model = source.get(terms, null);

                model.pin();
                model.addView(this);
            }

            return this.model.get(terms);
        }
        return [];
    }

    transitionIn(elements, wurl) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionIn(elements, wurl));

        Math.max(transition_time, super.transitionIn());

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(transition_time = 0, DESTROY = false) {

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionOut());

        Math.max(transition_time, super.transitionOut(transition_time, DESTROY));

        return transition_time;
    }

}

class Indexer {
    constructor(element) {
        this.lexer = new Lex(element.innerHTML);
        this.element = element;
        this.stack = [];
        this.sp = 0;
    }

    get(index, REDO = false) {
        let lex = this.lexer;

        if (REDO) {
            lex.reset();
            this.stack.length = 0;
            this.sp = 0;
        }

        while (true) {
            if (!lex.text) {
                if (REDO)
                    return null;
                else
                    return this.get(index, true);
            }

            switch (lex.text) {
                case "<":
                    if (lex.peek().text == "/") {
                        lex.next(); // <
                        lex.next(); // /
                        lex.next(); // tagname
                        lex.next(); // >
                        if(--this.sp < 0) return null;
                        this.stack.length = this.sp + 1;
                        this.stack[this.sp]++;
                    } else {
                        lex.next(); // <
                        lex.next(); // tagname
                        while (lex.text !== ">" && lex.text !== "/") {
                            lex.next(); // attrib name
                            if (lex.text == "=")
                                (lex.next(), lex.next());
                        }
                        if (lex.text == "/") {
                            lex.next(); // / 
                            lex.next(); // >
                            break;
                        }
                        lex.next(); // >

                        (this.stack.push(0), this.sp++);

                        if (lex.text == "#") {
                            lex.next();
                            if (lex.text == "#") {
                                lex.next();
                                if (lex.text == ":") {
                                    lex.next();
                                    if (lex.type == "number") {
                                        let number = parseInt(lex.text);
                                        if (number == index) return this.getElement();
                                    }
                                }
                            }
                        }
                    }
                    break;
                default:
                    lex.next();
            }
        }
    }
    getElement() {
        let element = this.element;
        for (let i = 0; i < this.sp; i++) {
            element = element.children[this.stack[i]];
        }
        return element;
    }
}

/*
    Source skeleton
        Model pointer OR schema pointer
            IF schema, then the skeleton will create a new Model when it is copied, UNLESS a model is given to the skeleton copy Constructor. 
            Other wise, the skeleton will automatically assign the Model to the case object. 

        The model will automatically copy it's element data into the copy, zipping the data down as the Constructor builds the Source's children.

*/
class SourceSkeleton {

    constructor(element, constructor, data, presets, index) {
        this.element = element;
        this.Constructor = constructor;
        this.children = [];
        this.templates = [];
        this.filters = [];
        this.terms = [];
        this.data = data;
        this.presets = presets;
        this.index = index;
    }

    /**
    
    */
    flesh(Model = null) {
        let Source = this.____copy____(null, null, null);

        Source.load(Model);

        return Source;
    }

    /**
        Constructs a new object, attaching to elements hosted by a case. If the component to construct is a Source, then the 
        parent_element gets swapped out by a cloned element that is hosted by the newly constructed Source.
    */
    ____copy____(parent_element, parent, indexer) {

        let element, CLAIMED_ELEMENT = false;

        if (this.index > 0) {
            element = indexer.get(this.index);
            CLAIMED_ELEMENT = true;
        }

        if (this.element) {
            parent_element = this.element.cloneNode(true);

            if (parent_element.parentElement) {
                parent_element.parentElement.replaceNode(parent_element, element);
            }
            

            indexer = new Indexer(parent_element);
        }

        let out_object;
        if (this.Constructor) {
            out_object = new this.Constructor(parent, this.data, this.presets);
            if (CLAIMED_ELEMENT)
                out_object.element = element;
        } else if (!parent) {
            out_object = this.children[0].____copy____(parent_element, null, indexer);
            out_object.element = parent_element;
            return out_object;
        } else
            out_object = parent;


        if (this.children.length > 0)
            for (var i = 0, l = this.children.length; i < l; i++)
                this.children[i].____copy____(parent_element, out_object, indexer);

        if (this.templates.length > 0) {

            if (this.terms.length > 0)
                for (var i = 0, l = this.terms.length; i < l; i++)
                    out_object.terms.push(this.terms[i].____copy____(parent_element, null, indexer));

            if (this.filters.length > 0)
                for (var i = 0, l = this.filters.length; i < l; i++)
                    out_object.filters.push(this.filters[i].____copy____(parent_element, null, indexer));

            for (var i = 0, l = this.templates.length; i < l; i++)
                out_object.templates.push(this.templates[i]);
        }

        return out_object;
    }
}

let GLOBAL = (()=>{
	let linker = null;
	return {
		get linker(){
			return linker;
		},
		set linker(l){
			if(!linker)
				linker = l;
		}
	}
});

class Input extends Cassette {
    constructor(parent, element, d, p) {
        //Scan the element and look for inputs that can be mapped to the
        super(parent, element, d, p);

        //Inputs in forms are automatically hidden.
        this.element.display = "none";

        this.element.addEventListener("input", () => {
            var data = {};
            data[this.prop] = this.element.value;
            this.add(data);
        });
    }

    update(data) {

        if (!data[this.prop]) return;

        this.val = data[this.prop];

        switch (this.element.type) {
            case "date":
                this.element.value = (new Date(parseInt(data[this.prop]))).toISOString().split("T")[0];
                break;
            case "time":
                this.element.value = `${("00"+(data[this.prop] | 0)).slice(-2)}:${("00"+((data[this.prop]%1)*60)).slice(-2)}:00.000`;
                break;
            case "text":
                this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                break;
            default:

                var t = this.element.classList[0];

                switch (t) {
                    case "modulo_time":
                        var time = data[this.prop];
                        var IS_PM = (time / 12 > 1);
                        var minutes = ((time % 1) * 60) | 0;
                        var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

                        this.element.value = (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? " PM" : " AM");
                        break;

                    default:
                        this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                }
                break;
        }
    }
}

class Form extends Cassette {
    constructor(parent, element, d, p) {
        //Scan the element and look for inputs that can be mapped to the 
        super(parent, element, d, p);

        this.submitted = false;
        this.schema = null;

        element.addEventListener("submit", (e) => {
            console.log(e.target, this, parent);

            if (!this.submitted)
                this.submit();

            this.submitted = true;

            e.preventDefault();

            return false;
        });
    }

    destructor() {

    }

    accepted(result) {
        result.text().then((e) => {
            debugger
            GLOBAL.router.loadPage(
                GLOBAL.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                false
            );
        });
    }

    rejected(result) {
        result.text().then((e) => {
            debugger
            GLOBAL.router.loadPage(
                GLOBAL.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                false
            );
        });
    }

    load(model) {

        if (model)
            this.schema = model.schema;

        super.load(model);
    }

    update(data) {

    }

    submit() {

        let url = this.element.action;

        var form_data = (new FormData(this.element));
        if (this.schema) {
            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                if (child instanceof Input) {
                    let name = child.element.name;
                    let prop = child.prop;
                    let scheme = this.schema[prop];
                    if (scheme && prop) {
                        let val = scheme.string(child.val);
                        form_data.set(name, val);
                        console.log(prop, name, val, child.val);
                    }
                }
            }
        }

        debugger
        fetch(url, {
            method: "post",
            credentials: "same-origin",
            body: form_data,
        }).then((result) => {

            if (result.status != 200)
                this.rejected(result);
            else
                this.accepted(result);

        }).catch((e) => {
            this.rejected(e);
        });



        console.log("Wick Form Submitted", url, form_data);


    }
}

class Tap extends SourceBase {

    constructor(parent, data, presets) {
        super(parent, data, presets);
        this.prop = data.prop;
    }

    down(data, changed_properties = null, imported) {
        if (changed_properties) {
            for (var i = 0, l = changed_properties.length; i < l; i++) {
                if (changed_properties[i] == this.prop)
                    if (data[this.prop] !== undefined)
                        return { value: data[this.prop] }

                if (i == l - 1)
                    return null;
            }
        } else {
            if (data[this.prop] !== undefined)
                return { value: data[this.prop] }
        }
    }

    /**
        See Definition in SourceBase 
    */
    __down__(data, changed_properties = null, IMPORTED = false) {
        let r_val = this.down(data, changed_properties, IMPORTED);
        if (r_val)
            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__down__(r_val, [this.prop], IMPORTED);
    }

    up(data) {

        if (data.value !== undefined) {
            let out = {};
            out[this.prop] = data.value;
            return out;
        }

        return null;
    }
}

class Pipe extends SourceBase {

    constructor(parent, data, presets) {
        super(parent, data, presets);
    }

    down(data) {
        return { value: `<b>${data.value}</b>` }
    }
}

Pipe.ADDS_TAGS = true;
Pipe.CAN_BE_STATIC = true;

/** @namespace IO */

/**
	The IO is the last link in the Source chain. It is responsible for putting date into the DOM through it's connected element, and present it to the viewer. 
	It is also responsible for responding to user input, though the base IO object does not provide any code for that. 
*/
class IO extends SourceBase{

	constructor(parent, data, presets){
		super(parent, data, presets);
		this.prop = data.prop;
	}

	/**
		Inheritors of IO should use this function to push data back up to the Source from input by the user. 
	*/
	up(){
		//This is empty for the basic IO object. 
	}

	/**
		Puts data into the watched element. The default action is to simply update the elements innerHTML with data.value.  
	*/
	down(data){
		this.element.innerHTML = data.value;
	}
}

/*
    Boring Source stuff
*/

class Root {
    constructor() {
        this.html = "";
        this.children = [];
        this.tag_index = 1;
    };

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    constructSkeleton(presets) {
        let element = document.createElement("div");
        element.innerHTML = this.html;
        let root_skeleton = new SourceSkeleton(element);
        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].constructSkeleton(root_skeleton, presets);
        return root_skeleton;
    }

    getIndex() {
        return this.tag_index++;
    }

    toJSON() {
        return {
            children: this.children,
            html: this.html
        }
    }

    offset(increase = 0) {
        let out = this.tag_count;
        this.tag_count += increase;
        return out;
    }
}

class GenericNode {

    constructor(tagname, attributes, parent) {
        this.parent = null;
        this.tagname = tagname;
        this.attributes = attributes || {};
        this.IS_NULL = false;
        this.CONSUMES_TAG = true;
        this.CONSUMES_SAME = false;
        this.children = [];
        this.prop_name = null;
        this.html = "";
        this.open_tag = "";
        this.close_tag = "";
        this.tag_index = 0;
        this.index = 0;
        if (parent)
            parent.addChild(this);
    };



    finalize(ctx) {
        ctx.html += this.open_tag + this.html + this.close_tag;
    }

    replaceChild(child, new_child) {
        for (let i = 0; i < this.children.length; i++)
            if (this.children[i] == child) {
                this.children[i] = new_child;
                new_child.parent = this;
                child.parent = null;
                return
            }
    }

    removeChild(child) {
        for (let i = 0; i < this.children.length; i++)
            if (this.children[i] == child)
                return this.children.splice(i, 1);
    }

    addChild(child) {

        if (child instanceof TapNode && !(this instanceof SourceNode)) {
            return this.parent.addChild(child);
        }

        child.parent = this;
        this.children.push(child);
    }

    parseAttributes() {
        let out = {};
        out.prop = this.prop_name;
        this.attributes;
        return out;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        if (this.prop_name !== prop_name)
            this.split(new IONode(prop_name, this.attributes, null, this, this.getIndex()), prop_name);
        else
            new IONode(prop_name, this.attributes, this, this, this.getIndex());
    }

    toJSON() {
        return {
            children: this.children,
            tagname: this.tagname,
            tag_count: this.tag_count,
            tag: { open_tag: this.open_tag, close_tag: this.close_tag },
            html: this.html,
        }
    }

    split(node, prop_name) {
        if (node) {
            if (this.prop_name) {
                if (prop_name == this.prop_name) {
                    this.addChild(node);
                } else {
                    let r = new this.constructor(this.tagname, this.attributes, null);
                    r.CONSUMES_SAME = (r.CONSUMES_TAG) ? (!(r.CONSUMES_TAG = !1)) : !1;
                    r.prop_name = prop_name;
                    r.addChild(node);
                    return this.parent.split(r, prop_name);
                }
            } else {
                this.addChild(node);
                this.prop_name = prop_name;
                this.parent.removeChild(this);
                return this.parent.split(this, prop_name);
            }
        } else {
            debugger
            if (this.prop_name) {
                if (prop_name == this.prop_name) ; else {
                    let r = new this.constructor(this.tagname, this.attributes, null);
                    r.prop_name = prop_name;
                    return this.parent.split(r, prop_name);
                }
            } else {
                this.parent.removeChild(this);
                return this.parent.split(this, prop_name);
            }
        }

        return -1;
    }



    getIndex() {
        if(this.tag_index > 0) return this.tag_index++;
        if (this.parent) return this.parent.getIndex();
    }

    constructSkeleton(parent_skeleton, presets) {

        let skeleton = this.createSkeletonConstructor(presets);

        parent_skeleton.children.push(skeleton);

        for (let i = 0; i < this.children.length; i++)
            this.children[i].constructSkeleton(skeleton, presets);
    }

    createSkeletonConstructor(presets) {
        let skeleton = new SourceSkeleton(this.getElement(), this.getConstructor(presets), this.parseAttributes(), presets, this.index);
        return skeleton;
    }

    getConstructor() {
        return null;
    }

    getElement() {
        return null;
    }
}

class SourceNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {
        ctx.html += this.html;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        if (lexer.text == "(" && lexer.peek().text == "(") {
            lexer.assert("(");
            lexer.assert("(");
            let template = new TemplateNode("list", this.attributes, this, this);
            template.parse(lexer, parseFunction, presets);
            lexer.assert(")");
            let out = lexer.pos + 1;
            lexer.assert(")");
            return out;
        }
    }

    getConstructor() {
        return Source;
    }

    split(node, prop_name) {
        if (node) this.addChild(node);
    }
}

class TemplateNode extends GenericNode {
    constructor(tagname, attributes, parent, ctx) {
        super(tagname, attributes, parent);
        this.index = this.getIndex();
        ctx.html += `<list>##:${this.index}</list>`;
        this.filters = [];
        this.terms = [];
        this.templates = [];
    };

    addChild(child) {
        if (child instanceof FilterNode)
            this.filters.push(child);
        else if (child instanceof TermNode)
            this.terms.push(child);
        else if (child instanceof SourceNode) {
            if (this.templates.length > 0) throw new Error("Only one Source allowed in a Template.");
            this.templates.push(child);
            child.tag_index = 1;
            this.html = child.html;
        } else throw new Error("Templates only support Filter, Term or Source elements.")
    }

    constructSkeleton(parent_skeleton, presets) {
        let element = document.createElement("div");
        element.innerHTML = this.html;
        let skeleton = new SourceSkeleton(this.getElement(), SourceTemplate, this.parseAttributes(), presets, this.index);
        skeleton.filters = this.filters.map((filter) => filter.createSkeletonConstructor(presets));
        skeleton.terms = this.terms.map((term) => term.createSkeletonConstructor(presets));
        skeleton.templates = this.templates.map((template) => {
            let skl = template.createSkeletonConstructor(presets);
            skl.element = element;
            return skl;
        });
        parent_skeleton.children.push(skeleton);
    }

    getElement() {
        let div = document.createElement("list");
        return div;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        //ctx.html += prop_name;
    }

    parse(lexer, parseFunction, presets) {
        while (lexer.text !== ")" && lexer.peek().text !== ")") {
            if (!lexer.text) throw new Error("Unexpected end of Output. Missing '))' ");
            let out = parseFunction(lexer, this, presets);
            if (out instanceof SourceNode)
                this.html = out.html;
        }
    }

    split(node, prop_name) {

        if (node)
            this.addChild(node);

        return this.tag_count;
    }
}

class TapNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {
        ctx.html += this.html;
    }

    getConstructor(presets) {
        return Tap;
    }
}


class FilterNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
        this.CONSUMES_TAG = false;
    };

    finalize(ctx) {}

    getConstructor(presets) {
        return Tap;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        this.attributes.prop = prop_name;
    }
}


class TermNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {}

    getConstructor(presets) {
        return Tap;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        this.attributes.prop = prop_name;
    }
}



class PipeNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx, presets) {
        ctx.html += this.html;
    }

    getConstructor(presets, finalizing = false) {
        let constructor = Pipe;
        return constructor;
    }

    split(node, prop_name) {
        if (!(this.parent instanceof PipeNode) &&
            !(this.parent instanceof TapNode)
        ) {
            //Need a TapNode to complete the pipeline
            let tap = new TapNode("", {}, null);
            this.prop_name = this.prop_name;
            this.parent.replaceChild(this, tap);
            tap.addChild(this);
        }

        super.split(node, prop_name);
    }
}

class IONode extends GenericNode {
    constructor(prop_name, attributes, parent, ctx, index) {
        super("", null, parent);
        this.index = index;
        ctx.html += `<io prop="${prop_name}">##:${index}</io>`;
        this.prop_name = prop_name;
        this.CONSUMES_TAG = true;
    };

    getConstructor(presets) {
        return IO;
    }
}

/*
    This function's role is to construct a case skeleton given a template, a list of presets, and 
    and optionally a working DOM. This will return Source Skeleton that can be cloned into a new Source object. 

    @param {HTMLElement} Template
    @param {Presets} presets 
    @param {DOMElement} WORKING_DOM - Should include any other templates that need to be rolled in. 
*/
function SourceConstructor(Template, Presets, WORKING_DOM) {

    let skeleton;

    if (!Template)
        return null;

    if (Template.skeleton)
        return Template.skeleton;


    //TEmplate Filtration handled here.
    //Import the 
    let element = document.importNode(Template, true);

    skeleton = ComponentConstructor(element, Presets, WORKING_DOM);

    if (!skeleton)
        return null;

    Template.skeleton = ((skeleton) => (model) => skeleton.flesh(model))(skeleton);

    return Template.skeleton;
}

function ComponentConstructor(element, presets, WORKING_DOM) {

    if (element.tagName === "TEMPLATE") {
        let component_name = element.id;
        let input = element.innerHTML;
        let lexer = Lex(input);

        //Make sure we are starting with a case object. 

        if (lexer.text == "<") {
            //off to a good start
            let root = new Root();
            ParseTag(lexer, root, presets);
            return root.constructSkeleton(presets);
        }
    }
    return null;
}

/**
    Handles the selection of AST nodes based on tagname;
    
    @param {Lexer} lexer - The lexical parser 
    @param {String} tagname - The elements tagname
    @param {Object} attributes - 
    @param {Object} ctx
    @param {CCAstNode} parent
*/
function Dispatch(lexer, tagname, attributes, parent) {
    let ast;
    switch (tagname) {
        /* Taps */
        case "w":
        case "w-a":
        case "w_a":
            ast = new TapNode(tagname, attributes, parent);
            return ast;
        case "w-filter":
            ast = new FilterNode(tagname, attributes, parent);
            return ast;
        case "w-term":
            ast = new TermNode(tagname, attributes, parent);
            return ast;
        case "w-c":
        case "w_c":
        case "w-case":
        case "w_case":
            ast = new SourceNode(tagname, attributes, parent);
            return ast;
        default:
            if (tagname[0] == "w") {
                ast = new PipeNode(tagname, attributes, parent);
                return ast;
            }
            break;
    }
    ast = new GenericNode(tagname, attributes, parent);
    return ast;
}

/**
    Handles the parsing of HTML tags and content
    @param {String} tagname
    @param {Object} ctx
    @param {CCAstNode} parent
*/
function ParseTag(lexer, parent, presets) {
    let start = lexer.pos;
    let attributes = {};
    
    lexer.assert("<");
    
    let tagname = lexer.text;
    
    if (lexer.type == "identifier") {
        lexer.next();
        GetAttributes(lexer, attributes);
    } else throw new Error(`Expected tag-name identifier, got ${lexer.text}`);

    let ele = Dispatch(lexer, tagname, attributes, parent);

    ele.open_tag += lexer.slice(start);

    start = lexer.token.pos;

    while (true) {

        if (!lexer.text)
            throw ("Unexpected end of output");

        switch (lexer.text) {
            case "<":
                if (lexer.peek().text == "/") {

                    ele.html += lexer.slice(start);

                    start = lexer.pos;

                    //Should be closing it's own tag.
                    lexer.assert("<");
                    lexer.assert("/");
                    lexer.assert(tagname);

                    let out = lexer.pos + 1;
                    
                    lexer.assert(">");

                    ele.close_tag = lexer.slice(start);

                    ele.finalize(parent || {html:""}, presets);

                    return out;
                } else
                    start = ParseTag(lexer, ele);
                break;
            case "[":
                ele.html += lexer.slice(start);
                lexer.next();
                let prop_name = lexer.text;
                lexer.next();
                start = lexer.pos + 1;
                lexer.assert("]");
                start = ele.addProp(lexer, prop_name, ParseTag, presets) || start;
                break;
            default:
                lexer.next();
                break;
        }
    }
}

/**
    Returns all attributes in an element as a key-value object.

    @param {Lexer} lexer - The lexical parser  
    @param {Object} attibs - An object which will receive the attribute keys and values. 
*/
function GetAttributes(lexer, attribs) {
    while (lexer.text !== ">" && lexer.text !== "/") {
        if (!lexer.text) throw Error("Unexpected end of input.");
        let attrib_name = lexer.text;
        let attrib_val = null;
        lexer.next();
        if (lexer.text == "=") {
            lexer.next();
            if (lexer.token.type == "string") {
                attrib_val = lexer.text.slice(1, -1);
                lexer.next();
            } else
                throw new Error("Expecting attribute definition.");

        }
        attribs[attrib_name] = attrib_val;
    }

    if (lexer.text == "/") // Void Nodes
        lexer.assert("/");
    lexer.assert(">");
}

/**
 * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
 *
 * {name} Requester
 */
class Setter extends View {
    constructor(url) {
        super();
        this.url = url;
    }

    destructor() {
        super.destructor();
    }

    set(request_object) {

        var url = "http://" + window.location.host + this.url + ( (request_object) ? ("?" + this.__process_url__(request_object)) : "");

        fetch(url, 
        { 
            credentials: "same-origin", // Sends cookies back to server with request
            method: 'POST'
        }).then((response)=>{
            (response.json().then((j)=>{
                this.__process_response__(j);
            }));
        }).catch((error)=>{
            console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
        });
    }

    parseJson(in_json){
        return in_json;
    }

    __process_url__(data) {
        var str = "";
        for (var a in data) {
            str += `${a}=${data[a]}\&`;
        }

        return str.slice(0, -1);
    }

    __process_response__(json) {

        //result(request);
            if (this.model){

            //should be able to pipe responses as objects created from well formulated data directly into the model.
                this.set(this.parseJson(json));
                console.log(this.model);
            }
            else
                console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`);
        
    }
}

class WURL {
    constructor(location){
        //parse the url into different sections
        this.path = location.pathname;
        this.host = location.hostname;
        this.query = QueryStringToQueryMap(location.search.slice(1));
    }

    setPath(path){
        this.path = path;
        this.setLocation();
    }

    setLocation(){
        history.replaceState({},"replaced state",`${this}`);
        window.onpopstate();
    }

    toString(){
        return `${this.path}?${QueryMapToQueryString(this.query)}`;
    }

    getClass(class_name){

        if(!class_name) class_name = null;
        
        let out = {}, class_;

        if(class_ = this.query.get(class_name)){
            for(let [key, val] of class_.entries()){
                out[key] = val;
            }
        }

        return out;
    }

    set(class_name, key_name, value){

        if(!class_name) class_name = null;

        if(!this.query.has(class_name)) this.query.set(class_name, new Map());

        let class_ = this.query.get(class_name);

        class_.set(key_name, value);

        this.setLocation();
    }

    get(class_name, key_name){
        if(!class_name) class_name = null;

        let class_ = this.query.get(class_name);


        return (class_) ? class_.get(key_name) : null;  
    }

}

/*
	Handles the parsing and loading of components for a particular page.
*/
class PageView {

    constructor(URL, app_page) {
        this.url = URL;
        this.elements = [];
        this.finalizing_view = null;
        this.type = "normal";
        if (!app_page) debugger
        this.element = app_page;
        this.element_backer = null;
        this.LOADED = false;
    }

    destructor() {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.destructor();
        }

        this.elements = null;
        this.element = null;
    }

    unload(transitions) {

        this.LOADED = false;
        
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getTransformTo(transitions);
            element.unloadComponents();
        }
    }

    transitionOut(transitions) {

        let time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            time = Math.max(time, this.elements[i].transitionOut(transitions));
        }

        return time;
    }

    finalize() {
        if(this.LOADED) return;

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.finalize();
        }

        if (this.element.parentElement)
            this.element.parentElement.removeChild(this.element);
    }

    load(app_element, wurl) {

        this.LOADED = true;
        
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.loadComponents(wurl);
        }

        app_element.appendChild(this.element);

        var t = this.element.style.opacity;
    }

    transitionIn(transitions) {

        if (this.type == "modal") {
            if (!this.element_backer) {
                this.element_backer = document.createElement("div");
                this.element_backer.classList.add("modal_backer");
                this.element.appendChild(this.element_backer);
            }
            setTimeout(() => {
                this.element.style.opacity = 1;
            }, 50);
        }

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.parent = this;
            element.setTransformTo(transitions);
            element.transitionIn();
        }        
    }

    getNamedElements(named_elements) {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getNamedElements(named_elements);
        }
    }

    compareComponents() {
        //This will transition objects
    }

    setType(type) {
        this.type = type || "normal";
    }
}

class Color extends Float64Array{

	constructor(r,g,b,a = 0){
		super(4);

		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;

		if(typeof(r) == "string"){
			this.fromString(r);
		}else{
			this.r = r; //Math.max(Math.min(Math.round(r),255),-255);
			this.g = g; //Math.max(Math.min(Math.round(g),255),-255);
			this.b = b; //Math.max(Math.min(Math.round(b),255),-255);
			this.a = a; //Math.max(Math.min(a,1),-1);
		}
	}

	get r(){
		return this[0];
	}

	set r(r){
		this[0] = r;
	}

	get g(){
		return this[1];
	}

	set g(g){
		this[1] = g;
	}

	get b(){
		return this[2];
	}

	set b(b){
		this[2] = b;
	}

	get a(){
		return this[3];
	}

	set a(a){
		this[3] = a;
	}

	set(color){
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.a = (color.a != undefined) ? color.a : this.a;
	}

	add(color){
		return new Color(
			color.r + this.r,
			color.g + this.g,
			color.b + this.b,
			color.a + this.a
		)
	}

	mult(color){
		if(typeof(color) == "number"){
			return new Color(
				this.r * color,
				this.g * color,
				this.b * color,
				this.a * color
			)
		}else{
			return new Color(
				this.r * color.r,
				this.g * color.g,
				this.b * color.b,
				this.a * color.a
			)
		}
	}

	sub(color){
		return new Color(
			 this.r - color.r,
			 this.g - color.g,
			 this.b - color.b,
			 this.a - color.a
		)
	}

	toString(){
		return `rgba(${this.r|0}, ${this.g|0}, ${this.b|0}, ${this.a})`;
	}

	fromString(string){
		
		let lexer = Lex(string);

		let r,g,b,a;
		switch(lexer.token.text){


			case "rgb":
				lexer.next(); // (
				r = parseInt(lexer.next().text);
				lexer.next(); // ,
				g = parseInt(lexer.next().text);
				lexer.next(); // ,
				b = parseInt(lexer.next().text);
				this.set({r,g,b});
			break;

			case "rgba":
				lexer.next(); // (
				r = parseInt(lexer.next().text);
				lexer.next(); // ,
				g = parseInt(lexer.next().text);
				lexer.next(); // ,
				b = parseInt(lexer.next().text);
				lexer.next(); // ,
				a = parseFloat(lexer.next().text);
				this.set({r,g,b,a});
			break;

			case "#":
				var value = lexer.next().text;
			break;

			default:

				if(Color.colors[string])
					this.set(Color.colors[string]  || new Color(255, 255, 255, 0.0001));
			break;
		}
	}
}

Color.colors = {
	"transparent" : new Color(255, 255, 255, 0.0001),
	"clear" : new Color(255, 255, 255, 0.0001),
	"red" : new Color(255, 0, 0),
	"green" : new Color(0, 255, 0),
	"blue" : new Color(0, 0, 255),
	"Black": new Color(0,0,0),
 	"White": new Color(255,255,255),
 	"white": new Color(255,255,255),
 	"Red": new Color(255,0,0),
 	"Lime": new Color(0,255,0),
 	"Blue": new Color(0,0,255),
 	"Yellow": new Color(255,255,0),
 	"Cyan": new Color(0,255,255),
 	"Aqua": new Color(0,255,255),
 	"Magenta": new Color(255,0,255) ,
 	"Fuchsia": new Color(255,0,255),
 	"Silver": new Color(192,192,192),
 	"Gray": new Color(128,128,128),
 	"Maroon": new Color(128,0,0),
 	"Olive": new Color(128,128,0),
 	"Green": new Color(0,128,0),
 	"Purple": new Color(128,0,128),
 	"Teal": new Color(0,128,128),
 	"Navy": new Color(0,0,128),
 	"maroon": new Color(128,0,0),
 	"dark red": new Color(139,0,0),
 	"brown": new Color(165,42,42),
 	"firebrick": new Color(178,34,34),
 	"crimson": new Color(220,20,60),
 	"red": new Color(255,0,0),
 	"tomato": new Color(255,99,71),
 	"coral": new Color(255,127,80),
 	"indian red": new Color(205,92,92),
 	"light coral": new Color(240,128,128),
 	"dark salmon": new Color(233,150,122),
 	"salmon": new Color(250,128,114),
 	"light salmon": new Color(255,160,122),
 	"orange red": new Color(255,69,0),
 	"dark orange": new Color(255,140,0),
 	"orange": new Color(255,165,0),
 	"gold": new Color(255,215,0),
 	"dark golden rod": new Color(184,134,11),
 	"golden rod": new Color(218,165,32),
 	"pale golden rod": new Color(238,232,170),
 	"dark khaki": new Color(189,183,107),
 	"khaki": new Color(240,230,140),
 	"olive": new Color(128,128,0),
 	"yellow": new Color(255,255,0),
 	"yellow green": new Color(154,205,50),
 	"dark olive green": new Color(85,107,47),
 	"olive drab": new Color(107,142,35),
 	"lawn green": new Color(124,252,0),
 	"chart reuse": new Color(127,255,0),
 	"green yellow": new Color(173,255,47),
 	"dark green": new Color(0,100,0),
 	"green": new Color(0,128,0),
 	"forest green": new Color(34,139,34),
 	"lime": new Color(0,255,0),
 	"lime green": new Color(50,205,50),
 	"light green": new Color(144,238,144),
 	"pale green": new Color(152,251,152),
 	"dark sea green": new Color(143,188,143),
 	"medium spring green": new Color(0,250,154),
 	"spring green": new Color(0,255,127),
 	"sea green": new Color(46,139,87),
 	"medium aqua marine": new Color(102,205,170),
 	"medium sea green": new Color(60,179,113),
 	"light sea green": new Color(32,178,170),
 	"dark slate gray": new Color(47,79,79),
 	"teal": new Color(0,128,128),
 	"dark cyan": new Color(0,139,139),
 	"aqua": new Color(0,255,255),
 	"cyan": new Color(0,255,255),
 	"light cyan": new Color(224,255,255),
 	"dark turquoise": new Color(0,206,209),
 	"turquoise": new Color(64,224,208),
 	"medium turquoise": new Color(72,209,204),
 	"pale turquoise": new Color(175,238,238),
 	"aqua marine": new Color(127,255,212),
 	"powder blue": new Color(176,224,230),
 	"cadet blue": new Color(95,158,160),
 	"steel blue": new Color(70,130,180),
 	"corn flower blue": new Color(100,149,237),
 	"deep sky blue": new Color(0,191,255),
 	"dodger blue": new Color(30,144,255),
 	"light blue": new Color(173,216,230),
 	"sky blue": new Color(135,206,235),
 	"light sky blue": new Color(135,206,250),
 	"midnight blue": new Color(25,25,112),
 	"navy": new Color(0,0,128),
 	"dark blue": new Color(0,0,139),
 	"medium blue": new Color(0,0,205),
 	"blue": new Color(0,0,255),
 	"royal blue": new Color(65,105,225),
 	"blue violet": new Color(138,43,226),
 	"indigo": new Color(75,0,130),
 	"dark slate blue": new Color(72,61,139),
 	"slate blue": new Color(106,90,205),
 	"medium slate blue": new Color(123,104,238),
 	"medium purple": new Color(147,112,219),
 	"dark magenta": new Color(139,0,139),
 	"dark violet": new Color(148,0,211),
 	"dark orchid": new Color(153,50,204),
 	"medium orchid": new Color(186,85,211),
 	"purple": new Color(128,0,128),
 	"thistle": new Color(216,191,216),
 	"plum": new Color(221,160,221),
 	"violet": new Color(238,130,238),
 	"magenta": new Color(255,0,255),
 	"fuchsia": new Color(255,0,255),
 	"orchid": new Color(218,112,214),
 	"medium violet red": new Color(199,21,133),
 	"pale violet red": new Color(219,112,147),
 	"deep pink": new Color(255,20,147),
 	"hot pink": new Color(255,105,180),
 	"light pink": new Color(255,182,193),
 	"pink": new Color(255,192,203),
 	"antique white": new Color(250,235,215),
 	"beige": new Color(245,245,220),
 	"bisque": new Color(255,228,196),
 	"blanched almond": new Color(255,235,205),
 	"wheat": new Color(245,222,179),
 	"corn silk": new Color(255,248,220),
 	"lemon chiffon": new Color(255,250,205),
 	"light golden rod yellow": new Color(250,250,210),
 	"light yellow": new Color(255,255,224),
 	"saddle brown": new Color(139,69,19),
 	"sienna": new Color(160,82,45),
 	"chocolate": new Color(210,105,30),
 	"peru": new Color(205,133,63),
 	"sandy brown": new Color(244,164,96),
 	"burly wood": new Color(222,184,135),
 	"tan": new Color(210,180,140),
 	"rosy brown": new Color(188,143,143),
 	"moccasin": new Color(255,228,181),
 	"navajo white": new Color(255,222,173),
 	"peach puff": new Color(255,218,185),
 	"misty rose": new Color(255,228,225),
 	"lavender blush": new Color(255,240,245),
 	"linen": new Color(250,240,230),
 	"old lace": new Color(253,245,230),
 	"papaya whip": new Color(255,239,213),
 	"sea shell": new Color(255,245,238),
 	"mint cream": new Color(245,255,250),
 	"slate gray": new Color(112,128,144),
 	"light slate gray": new Color(119,136,153),
 	"light steel blue": new Color(176,196,222),
 	"lavender": new Color(230,230,250),
 	"floral white": new Color(255,250,240),
 	"alice blue": new Color(240,248,255),
 	"ghost white": new Color(248,248,255),
 	"honeydew": new Color(240,255,240),
 	"ivory": new Color(255,255,240),
 	"azure": new Color(240,255,255),
 	"snow": new Color(255,250,250),
 	"black": new Color(0,0,0),
 	"dim gray": new Color(105,105,105),
 	"dim grey": new Color(105,105,105),
 	"gray": new Color(128,128,128),
 	"grey": new Color(128,128,128),
 	"dark gray": new Color(169,169,169),
 	"dark grey": new Color(169,169,169),
 	"silver": new Color(192,192,192),
 	"light gray": new Color(211,211,211),
 	"light grey": new Color(211,211,211),
 	"gainsboro": new Color(220,220,220),
 	"white smoke": new Color(245,245,245),
 	"white": new Color(255,255,255)
};

var ease_out = new CBezier(0.5, 0.2, 0, 1);

if (!requestAnimationFrame)
    requestAnimationFrame = (e) => {
        setTimeout(e, 1000);
    };

class TT_From {
    constructor(element) {
        //extracted animatable components
        var rect = element.getBoundingClientRect();

        this.color = new Color(window.getComputedStyle(element, null).getPropertyValue("background-color"));
        this.height = parseFloat(window.getComputedStyle(element, null).getPropertyValue("height"));
        this.width = parseFloat(window.getComputedStyle(element, null).getPropertyValue("width"));

        //*if(!this.height || !this.width){
        this.height = rect.height;
        this.width = rect.width;
        //}*/


        this.left = parseFloat(rect.left);
        this.top = parseFloat(rect.top);

        this.element = element;

    }

    destructor() {
        this.element = null;
        this.color = null;
    }

    start() {
        this.element.style.opacity = 0;
    }

    end() {
        this.element.style.opacity = 1;
    }
}

class TT_To extends TT_From {
    constructor(element, from) {
        super(element);

        this.from = from;

        this.res = ((element.style.top) && (element.style.left));

        this.rt = (element.style.top) ? (element.style.top) : null;
        this.rl = element.style.left ? element.style.left : null;


        //get the relative offset of this object
        var offset_x = 0; - element.getParentWindowLeft();
        var offset_y = 0; - element.getParentWindowTop();

        var offset_x = parseFloat(window.getComputedStyle(element, null).getPropertyValue("left"));
        var offset_y = parseFloat(window.getComputedStyle(element, null).getPropertyValue("top"));
        //And adjust start to respect the elements own parental offsets
        var diffx = this.left - this.from.left;
        this.left = offset_x;
        this.from.left = this.left - diffx;

        var diffy = this.top - this.from.top;
        this.top = offset_y;
        this.from.top = this.top - diffy;

        this.time = 60 * .35;
        this.s = 0;
        this.color_o = window.getComputedStyle(element, null).getPropertyValue("background-color");
        this.height_o = element.style.width;
        this.width_o = element.style.height;
        this.top_o = this.top;
        this.left_o = this.left;
        this.pos = window.getComputedStyle(element, null).getPropertyValue("position");


    }

    destructor() {
        this.end(); //Restore everything back to it's original type;
        this.from = null;
        this.s = Infinity;
        this.element = null;
        super.destructor();
    }

    start() {
        this.element.style.opacity = 1;
        this.element.style.top = this.from.top + "px";
        this.element.style.left = this.from.left + "px";
        this.element.style.width = this.from.width + "px";
        this.element.style.height = this.from.height + "px";
    }

    step() {
        this.s++;

            var t = this.s / this.time;

        if (t > 1) return false;

        var ratio = ease_out.getYatX(t);

        if (ratio > 1) ratio = 1;

        this.element.style.top = Math.round((this.top - this.from.top) * ratio + this.from.top) + "px";
        this.element.style.left = Math.round((this.left - this.from.left) * ratio + this.from.left) + "px";
        this.element.style.width = ((this.width - this.from.width) * ratio + this.from.width) + "px";
        this.element.style.height = ((this.height - this.from.height) * ratio + this.from.height) + "px";
        this.element.style.backgroundColor = (this.color.sub(this.from.color).mult(ratio).add(this.from.color)) + "";

        return (t < 0.9999995);
    }

    end() {
        this.element.style.backgroundColor = null;
        this.element.style.height = this.height_o;
        this.element.style.width = this.width_o;
        this.element.style.top = this.rt;
        this.element.style.left = this.rl;
    }
}


class TTPair {
    constructor(e_to, e_from) {
        this.b = (e_from instanceof TT_From) ? e_from : new TT_From(e_from);
        this.a = new TT_To(e_to, this.b);

        if (this.a.element.__TT__)
            this.a.element.__TT__.destructor();

        if (this.b.element.__TT__)
            this.b.element.__TT__.destructor();

        this.a.element.__TT__ = this;
        this.b.element.__TT__ = this;

        this.destroyed = false;

        this.start();
    }

    destructor() {
        if (this.destroyed) return
        if (this.b.element)
            this.b.element.__TT__ = null;
        if (this.a.element)
            this.a.element.__TT__ = null;
        this.a.destructor();
        this.destroyed = true;
    }

    start() {
        this.b.start();
        this.a.start();
    }

    step() {
        return this.a.step();
    }
}

const TransformRunner = new (class{
    constructor() {
        this.pairs = [];
        this.____SCHEDULED____ = false;
    }

    pushPair(pair) {
        this.pairs.push(pair);
        Scheduler.queueUpdate(this);
    }

    update(ratio) {
        let rp = this.pairs;

        if(rp.length > 0)
            Scheduler.queueUpdate(this);

        for (var i = 0; i < rp.length; i++) {
            var _rp = rp[i];
            if (!_rp.step(ratio)) {
                _rp.destructor();
                rp.splice(i, 1);
                i--;
            }        }

        
    }
})();


/**
    Transform one element from another back to itself
*/
function TransformTo(element_from, element_to, HIDE_OTHER) {


    if (!element_to) {

        let a = (from) => (element_to, HIDE_OTHER) => {
            let pair = new TTPair(element_to, from);
            TransformRunner.pushPair(pair);
        };

        let b = a(new TT_From(element_from));

        return b;
    }

    var pair = new TTPair(element_to, element_from);

    TransformRunner.pushPair(pair);

    pair.start();
}

class AnimCore{
	constructor() {
		this.anim_group = {};
		this.running_animations = [];
	}

	step(step_multiplier) {
		var l = this.running_animations.lenght;
		if (l > 0) {
			for (var i = 0; i < l; i++) {

				var ab = this.running_animations[i];

				if (ab && !ab.step(step_multiplier)) {
					ab.destructor();
					this.running_animations[i] = null;
				}
			}
		}
	}

	addBloc(anim_bloc) {
	}
}

var Animation = /*#__PURE__*/Object.freeze({
    AnimCore: AnimCore,
    TransformTo: TransformTo,
    Color: Color
});

/** @namespace Source */

/**
    Handles the transition of separate elements.
*/
class BasicSource extends SourceBase {

    constructor(element) {

        super(null, element, {}, {});

        this.anchor = null;
        this.LOADED = false;

        this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.element);
    }

    getNamedElements(named_elements) {

        let children = this.element.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition)
                named_elements[child.dataset.transition] = child;
        }
    }
}

/**
    This is a fallback component if constructing a CustomSource or normal Source throws an error.
*/

class FailedSource extends SourceBase {
    constructor(error_message, presets) {

        var div = document.createElement("div");
        div.innerHTML = `<h3> This Wick component has failed!</h3> <h4>Error Message:</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> <p>${presets.error_contact}</p>`;
        super(null, div, {}, {});

        this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.element);
    }
}

/** @namespace Component */

/**
    The main container of Sources. Represents an area of interest on the DOM.
*/
class Component {
    /**
     
     */
    constructor(element) {

        this.id = (element.classList) ? element.classList[0] : element.id;
        this.components = [];
        this.bubbled_elements = null;
        this.wraps = [];

        //The original element container.
        //this.parent_element = parent_element;

        //Content that is wrapped in an ele_wrap
        this.element = element;
    }


    unloadComponents() {

        for (var i = 0; i < this.components.length; i++)
            this.components[i].LOADED = false;
    }

    transitionOut() {

        let t = 0;

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (!component.LOADED) {

                component.parent = null;

                t = Math.max(component.transitionOut(), t);
            }
        }
        return t;
    }

    finalize() {

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (!component.LOADED && component.parentElement) {
                component.finalizeTransitionOut();
                this.wraps[i].removeChild(component.element);
            }

            component.LOADED = false;
        }
    }

    loadComponents(wurl) {

        for (let i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            component.parent = this;

            if (component.element.parentElement)
                component.element.parentElement.removeChild(component.element);

            this.wraps[i].appendChild(component.element);

            component.handleUrlUpdate(wurl);

            this.components[i].LOADED = true;
        }    }

    transitionIn() {

        // This is to force a document repaint, which should cause all elements to report correct positioning hereafter

        let t = this.element.style.top;

        this.element.style.top = t;

        for (let i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            component.transitionIn();
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {

        this.bubbled_elements = trs_ele;

        history.pushState({}, "ignored title", link_url);

        window.onpopstate();
    }

    getTransformTo(transitions) {
        if (transitions) {
            let own_elements = {};

            this.getNamedElements(own_elements);

            for (let name in own_elements) {
                transitions[name] = TransformTo(own_elements[name]);
            }
        }
    }

    setTransformTo(transitions) {
        if (transitions) {
            let own_elements = {};

            this.getNamedElements(own_elements);


            for (let name in own_elements) {
                let to, from = transitions[name];
                if ((to = own_elements[name]) && from) {
                    from(to, false);
                }
            }
        }
    }

    getNamedElements(named_elements) {
        if (this.bubbled_elements) {
            let t = this.bubbled_elements;

            for (let t in this.bubbled_elements)
                named_elements[t] = this.bubbled_elements[t];

            //this.bubbled_elements = null;

            return;
        }

        let children = this.element.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition) {
                named_elements[child.dataset.transition] = child;
            }
        }

        for (var i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            component.getNamedElements(named_elements);
        }
    }

    setComponents(App_Components, Model_Constructors, Component_Constructors, presets, DOM, wurl) {
        //if there is a component inside the element, register that component if it has not already been registered
        var components = Array.prototype.map.call(this.element.getElementsByTagName("component"), (a) => a);

        setLinks(this.element, (href, e) => {
            history.pushState({}, "ignored title", href);
            window.onpopstate();
            return true;
        });

        if (components.length < 1) {
            //Create a wrapped component for the elements inside the <element>
            let component = document.createElement("div");
            component.classList.add("comp_wrap");

            //Straight up string copy of the element's DOM.
            component.innerHTML = this.element.innerHTML;
        }

        var templates = DOM.getElementsByTagName("template");


        for (var i = 0; i < components.length; i++) {
            let app_case = null;
            let component = components[i];

            try {
                /**
                    Replace the component with a component wrapper to help preserve DOM arrangement
                */

                let comp_wrap = document.createElement("div");
                comp_wrap.classList.add("comp_wrap");
                this.wraps.push(comp_wrap);
                component.parentElement.replaceChild(comp_wrap, component);

                var id = component.classList[0],
                    comp;
                /**
                  We must ensure that components act as template "landing spots". In order for that to happen we must check for:
                  (1) The component has, as it's first class name, an id that (2) matches the id of a template. If either of these prove to be not true, we should reject the adoption of the component as a Wick
                  component and instead treat it as a normal "pass through" element.
                */
                if (!id) {
                    /*setLinks(component, (href, e) => {
                        history.pushState({}, "ignored title", href);
                        window.onpopstate();
                        return true;
                    })*/

                    app_case = new BasicSource(component);

                } else {

                    if (!App_Components[id]) {
                        if (comp = Component_Constructors[id]) {

                            app_case = new comp.constructor(templates, presets, component, DOM);

                            if (comp.model_name && Model_Constructors[comp.model_name]) {
                                var model = Model_Constructors[comp.model_name];
                                if (model.getter)
                                    model.getter.get();
                                model.addView(app_case);
                            }

                            app_case.id = id;

                            App_Components[id] = app_case;
                        } else {
                            var template = templates[id];

                            if (template) {
                                app_case = SourceConstructor(template, presets, DOM)(); //new SourceComponent(template, presets, Model_Constructors, null, DOM);
                            } else {
                                let constructor = SourceConstructor(component, presets, DOM);

                                if (!constructor)
                                    constructor = SourceConstructor(component.children[0], presets, DOM);
                                if (!constructor)
                                    app_case = new BasicSource(component);
                                else
                                    app_case = constructor();
                            }
                        }

                        if (!app_case) {
                            console.warn("App Component not constructed");
                            /** TODO: If there is a fallback <no-script> section use that instead. */
                            app_case = new FailedSource();
                        } else {
                            App_Components[id] = app_case;
                        }
                    } else {
                        app_case = App_Components[id];
                    }

                    app_case.handleUrlUpdate(wurl);
                }
            } catch (e) {
                console.log(e);
                app_case = new FailedSource(e, presets);
            }

            this.components.push(app_case);
        }
    }
}

let URL_HOST = { wurl: null };

/** @namespace Router */

let URL = (function() {

    return {
        /**
            Changes the URL to the one provided, prompts page update. overwrites current URL.
        */
        set: function(a, b, c) {
            if (URL_HOST.wurl)
                URL_HOST.wurl.set(a, b, c);
        },
        /**
                    Returns a Query entry if it exists in the query string. 
                */
        get: function(a, b) {
            if (URL_HOST.wurl)
                return URL_HOST.wurl.set(a, b);
            return null;
        },
        /**
                    Changes the URL state to the one provided and prompts the Browser to respond o the change. 
                */
        goto: function(a, b) {
            history.pushState({}, "ignored title", `${a}${ ((b) ? `?${TurnDataIntoQuery(b)}` : "") }`);

            window.onpopstate();
        }
    }
})();

function getModalContainer() {
    let modal_container = document.getElementsByTagName("modals")[0];

    if (!modal_container) {

        modal_container = document.createElement("modals");

        var dom_app = document.getElementsByTagName("app")[0];

        if (dom_app)
            dom_app.parentElement.insertBefore(modal_container, dom_app);
        else
            document.body.appendChild(modal_container);
    }

    return modal_container
}

/** @namespace linker */

/**
 *  This is responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes
 */
class Router {

    /*
     *  @param {Object} presets - An object that will be used by Wick for handling custom components. Is validated according to the definition of a RouterPreset
     */

    constructor(presets) {

        this.pages = {};
        this.components = {};
        this.component_constructors = {};
        this.models_constructors = {};
        this.presets = presets;
        this.current_url = null;
        this.current_query;
        this.current_view = null;
        this.finalizing_pages = [];

        GLOBAL.router = this;

        /* */
        this.modal_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location);
        };
    }

    /*
        This function will parse a URL and determine what Page needs to be loaded into the current view.
    */
    parseURL(location) {

        let url = location.pathname;

        let IS_SAME_PAGE = (this.current_url == url),
            page = null,
            wurl = new WURL(location);

        this.current_url = url;

        if ((page = this.pages[url])) {

            if (IS_SAME_PAGE) {

                URL_HOST.wurl = wurl;

                return page.transitionIn(
                    (page.type == "modal") ? getModalContainer() : document.getElementsByTagName("app")[0],
                    null, wurl, IS_SAME_PAGE);
            }

            return this.loadPage(page, wurl, IS_SAME_PAGE);
        }

        if (location)
            fetch(location.href, {
                credentials: "same-origin", // Sends cookies back to server with request
                method: 'GET'
            }).then((response) => {

                (response.text().then((html) => {

                    var DOM = (new DOMParser()).parseFromString(html, "text/html");

                    this.loadPage(
                        this.loadNewPage(url, DOM, wurl),
                        wurl,
                        IS_SAME_PAGE
                    );
                }));
            }).catch((error) => {
                console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
            });
    }

    finalizePages() {

        if (this.armed) {

            let a = this.armed;
            //  a.p.transitionIn(a.e, this.current_view, a.wurl, a.SP, a.te);
            this.armed = null;
        }

        for (var i = 0, l = this.finalizing_pages.length; i < l; i++) {

            var page = this.finalizing_pages[i];

            page.finalize();
        }

        this.finalizing_pages.length = 0;
    }

    /**
        Loads pages from server, or from local cache, and sends it to the page parser.

      @param {string} url - The URL id of the cached page to load.
      @param {string} query -
      @param {Bool} IS_SAME_PAGE -
    */
    loadPage(page, wurl = new WURL(document.location), IS_SAME_PAGE) {

        URL_HOST.wurl = wurl;

        let transition_length = 0;

        let app_ele = document.getElementsByTagName("app")[0];

        //Finalize any existing page transitions;
        // this.finalizePages();

        let transition_elements = {};

        if (page.type == "modal") {

            //trace modal stack and see if the modal already exists
            if (IS_SAME_PAGE) {

                page.transitionIn();

                return;
            }

            let UNWIND = 0;

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {

                let modal = this.modal_stack[i];

                if (UNWIND == 0) {

                    if (modal == page)
                        UNWIND = i + 1;

                } else {

                    let trs = 0;

                    modal.unload();

                    if (trs = modal.transitionOut()) {

                        transition_length = Math.max(trs, transition_length);

                        this.finalizing_pages.push(modal);
                    } else
                        modal.finalize();
                }
            }

            if (UNWIND > 0) {
                this.modal_stack.length = UNWIND;
                page.load(getModalContainer(), wurl);
                page.transitionIn();
            } else {
                //create new modal
                this.modal_stack.push(page);
                page.load(getModalContainer(), wurl);
                page.transitionIn();
            }

        } else {

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {

                let modal = this.modal_stack[i];

                let trs = 0;

                modal.unload();

                if (trs = modal.transitionOut()) {
                    transition_length = Math.max(trs, transition_length);
                    this.finalizing_pages.push(modal);
                } else
                    modal.finalize();

            }

            this.modal_stack.length = 0;


            if (this.current_view && this.current_view != page) {

                this.current_view.unload(transition_elements);

                page.load(app_ele, wurl);

                let t = this.current_view.transitionOut();

                window.requestAnimationFrame(() => {
                    page.transitionIn(transition_elements);
                });

                transition_length = Math.max(t, transition_length);

                this.finalizing_pages.push(this.current_view);
            } else if (!this.current_view) {

                page.load(app_ele, wurl);

                window.requestAnimationFrame(() => {
                    page.transitionIn(transition_elements);
                });
            }

            this.current_view = page;
        }

        setTimeout(() => {
            this.finalizePages();
        }, (transition_length * 1000) + 1);
    }

    /**
        Pre-loads a custom constructor for an element with the specified id and provides a model to that constructor when it is called.
        The constructor must have Component in its inheritance chain.
    */
    addStatic(element_id, constructor, model) {

        this.component_constructors[element_id] = {
            constructor,
            model_name: model
        };

    }

    addModel(model_name, modelConstructor) {

        this.models_constructors[model_name] = modelConstructor;
    }
    /**
        Creates a new iframe object that acts as a modal that will sit ontop of everything else.
    */
    loadNonWickPage(URL) {

        let iframe = document.createElement("iframe");
        iframe.src = URL;
        iframe.classList.add("modal", "comp_wrap");
        var page = new PageView(URL, iframe);
        page.type = "modal";
        this.pages[URL] = page; //new Modal(page, iframe, getModalContainer());
        return this.pages[URL];
    }
    /**
        Takes the DOM of another page and strips it, looking for component and app elements to use to integrate into the SPA system.
        If it is unable to find these elements, then it will pass the DOM to loadNonWickPage to handle wrapping the page body into a wick app element.
    */
    loadNewPage(URL, DOM, wurl) {
        //look for the app section.

        /**
            If the page should not be reused, as in cases where the server does all the rendering for a dynamic page and we're just presenting the results,
            then having NO_BUFFER set to true will cause the linker to not save the page to the hashtable of existing pages, forcing a request to the server every time the page is visited.
        */
        let NO_BUFFER = false;

        /* 
            App elements: There should only be one. 
        */
        let app_list = DOM.getElementsByTagName("app");

        if (app_list.length > 1)
            console.warn(`Wick is designed to work with just one <app> element in a page. There are ${app_list.length} apps elements in ${url}. Wick will proceed with the first <app> element in the DOM. Unexpected behavior may occur.`);

        let app_source = app_list[0];

        /**
          If there is no <app> element within the DOM, then we must handle this case carefully. This likely indicates a page delivered from the same origin that has not been converted to work with the Wick system.
          The entire contents of the page can be wrapped into a <iframe>, that will be could set as a modal on top of existing pages.
        */
        if (!app_source) {
            console.warn("Page does not have an <app> element!");
            return this.loadNonWickPage(URL);
        }

        var app_page = document.createElement("apppage");

        app_page.innerHTML = app_source.innerHTML;

        var app = app_source.cloneNode(true);

        var dom_app = document.getElementsByTagName("app")[0];

        var page = new PageView(URL, app_page);

        if (app_source) {

            if (app_source.dataset.modal == "true") {

                page.setType("modal");
                let modal = document.createElement("modal");
                modal.innerHTML = app.innerHTML;
                app.innerHTML = "";
                app = modal;

                /*
                    If the DOM is the same element as the actual document, then we shall rebuild the existing <app> element, clearing it of it's contents.
                */
                if (DOM == document && dom_app) {
                    let new_app = document.createElement("app");
                    document.body.replaceChild(new_app, dom_app);
                    dom_app = new_app;
                }
            }

            if (app.dataset.no_buffer == "true")
                NO_BUFFER = true;

            var elements = app_page.getElementsByTagName("element");

            for (var i = 0; i < elements.length; i++) {

                let ele = elements[i],
                    component;


                let element_id = ele.id;

                if (page.type !== "modal") {

                    component = new Component(ele);

                } else {

                    let element = document.createElement("div");

                    element.innerHTML = ele.innerHTML;

                    element.classList.add("ele_wrap");

                    component = new Component(ele);
                }

                page.elements.push(component);

                if (!this.components[element_id])
                    this.components[element_id] = {};

                component.setComponents(this.components[element_id], this.models_constructors, this.component_constructors, this.presets, DOM, wurl);
            }

            if (document == DOM)
                dom_app.innerHTML = "";

            let result = page;

            if (!NO_BUFFER) this.pages[URL] = result;

            return result;
        }
    }
}

let wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

let LINKER_LOADED = false;

/**
 *    Creates a new {Router} instance, passing any presets from the client.
 *    It will then wait for the document to load, and once loaded, will start the linker and load the current page into the linker.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *
 *    @param {RouterPresets} presets - An object of user defined Wick objects.
 */

function startRouting(presets) {

    /*
      The static field in presets are all Component-like objects constructors that are defined by the client
      to be used by Wick for custom components.

      The constructors must support several Component based methods in ordered to be accepted for use. These methods include:
        transitionIn
        transitionOut
        setModel
        unsetModel
    */

    if (presets.static) {
        for (let component_name in presets.static) {

            let component = presets.static[component_name];

            let a = 0,
                b = 0,
                c = 0,
                d = 0;

            if ((a = (component.prototype.transitionIn && component.prototype.transitionIn instanceof Function)) &&
                (b = (component.prototype.transitionOut && component.prototype.transitionOut instanceof Function)) &&
                (c = (component.prototype.setModel && component.prototype.setModel instanceof Function)) &&
                (d = (component.prototype.unsetModel && component.prototype.unsetModel instanceof Function)))
                this.addStatic(component_name, component);
            else
                console.warn(`Static component ${component_name} lacks correct component methods, \nHas transitionIn function:${a}\nHas transitionOut functon:${b}\nHas set model function:${c}\nHas unsetModel function:${d}`);
        }
    }

    /** TODO
        @define PageParser

        A page parser will parse templates before passing that data to the Source handler.
    */
    if (presets.parser) {
        for (let parser_name in presets.page_parser) {
            let parser = presets.page_parser[parser_name];
        }
    }

    /**
        Schemas provide the constructors for Models
    */
    if (presets.schemas) {

        presets.schemas.any = AnyModel;

    } else {
        presets.schemas = {
            any: AnyModel
        };
    }

    if (presets.models) ; else {
        presets.models = {};
    }

    console.log(presets);

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    //Pass in the presets or a plain object if presets is undefined.

    let link = new Router(presets || {});

    window.addEventListener("load", () => {

        link.loadPage(
            link.loadNewPage(document.location.pathname, document),
            new WURL(document.location),
            false
        );
    });

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`);
}

/**
    Exports 
*/

//Construct Model Exports
let model = Model;

model.any = (data) => new AnyModel(data);
model.any.constr = AnyModel;

model.container = {
    multi: (...args) => new MultiIndexedContainer(...args),
    array: (...args) => new ArrayModelContainer(...args),
    btree: (...args) => new BTreeModelContainer(...args),
    constr: ModelContainerBase
};

model.container.constr.multi = MultiIndexedContainer;
model.container.constr.array = ArrayModelContainer;
model.container.constr.btree = BTreeModelContainer;

Object.freeze(model.container.constr);
Object.freeze(model.container);
Object.freeze(model.any);
Object.freeze(model);

//Construct Schema Exports
let schema$1 = schema;
schema$1.constr = SchemaConstructor;
schema$1.constr.bool = BoolSchemaConstructor;
schema$1.constr.number = NumberSchemaConstructor;
schema$1.constr.string = StringSchemaConstructor;
schema$1.constr.date = DateSchemaConstructor;
schema$1.constr.time = TimeSchemaConstructor;

Object.freeze(schema$1.constr);
Object.freeze(schema$1);


let core = {
    Common,
    Animation,
    view: {View},
    schema: {
        instances : schema,
        SchemaConstructor,
        DateSchemaConstructor,
        TimeSchemaConstructor,
        StringSchemaConstructor,
        NumberSchemaConstructor,
        BoolSchemaConstructor
    },
    model: {
        Model,
        AnyModel,
        ModelContainerBase,
        MultiIndexedContainer,
        ArrayModelContainer,
        BTreeModelContainer
    },
    network: {
        router: {
            WURL,
            URL,
            Router
        },
        Getter,
        Setter,
    },
    source: {
        CustomSource,
        SourceBase,
        SourceConstructor,
        Cassette,
        Form,
        Filter
    }
};

Object.freeze(core);

let any = model.any;

exports.core = core;
exports.schema = schema$1;
exports.model = model;
exports.any = any;
exports.startRouting = startRouting;
