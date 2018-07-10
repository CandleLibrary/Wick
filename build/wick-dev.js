var wick = (function (exports) {
    'use strict';

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

    return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay1kZXYuanMiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9zY2hlbWEvY29uc3RydWN0b3IuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3R5cGVzL251bWJlci5qcyIsIi4uL3NvdXJjZS9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplci5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL21vbnRocy5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL2RheXNfb2Zfd2Vlay5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvdGltZS5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9wb2ludDJELmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL3F1YWRyYXRpY19iZXppZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvY29uc3RzLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL2N1YmljX2Jlemllci5qcyIsIi4uL3NvdXJjZS9jb21tb24vdXJsL3VybC5qcyIsIi4uL3NvdXJjZS9jb21tb24vZXZlbnQvdG91Y2hfc2Nyb2xsZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uLmpzIiwiLi4vc291cmNlL3NjaGVtYS90eXBlcy9kYXRlLmpzIiwiLi4vc291cmNlL3NjaGVtYS90eXBlcy90aW1lLmpzIiwiLi4vc291cmNlL3NjaGVtYS90eXBlcy9zdHJpbmcuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3R5cGVzL2Jvb2wuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3NjaGVtYXMuanMiLCIuLi9zb3VyY2Uvdmlldy5qcyIsIi4uL3NvdXJjZS9zY2hlZHVsZXIuanMiLCIuLi9zb3VyY2UvbW9kZWwvYmFzZS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9jb250YWluZXIvYmFzZS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9jb250YWluZXIvbXVsdGkuanMiLCIuLi9zb3VyY2UvbW9kZWwvY29udGFpbmVyL2FycmF5LmpzIiwiLi4vc291cmNlL21vZGVsL2NvbnRhaW5lci9idHJlZS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9tb2RlbC5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vdHJhbnNpdGlvbi90cmFuc2l0aW9uZWVyLmpzIiwiLi4vc291cmNlL3NvdXJjZS9iYXNlLmpzIiwiLi4vc291cmNlL2NvbnRyb2xsZXIuanMiLCIuLi9zb3VyY2UvZ2V0dGVyLmpzIiwiLi4vc291cmNlL3JvdXRlci9zZXRsaW5rcy5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvY2Fzc2V0dGUvY2Fzc2V0dGUuanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZS5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvY2Fzc2V0dGUvZmlsdGVyLmpzIiwiLi4vc291cmNlL3NvdXJjZS9zb3VyY2VfdGVtcGxhdGUuanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZV9za2VsZXRvbi5qcyIsIi4uL3NvdXJjZS9nbG9iYWwuanMiLCIuLi9zb3VyY2Uvc291cmNlL2Nhc3NldHRlL2lucHV0LmpzIiwiLi4vc291cmNlL3NvdXJjZS9jYXNzZXR0ZS9mb3JtLmpzIiwiLi4vc291cmNlL3NvdXJjZS90YXBzL3RhcC5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvcGlwZXMvcGlwZS5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvaW8vaW8uanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZV9jb25zdHJ1Y3Rvcl9hc3QuanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZV9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NvdXJjZS9zZXR0ZXIuanMiLCIuLi9zb3VyY2Uvcm91dGVyL3d1cmwuanMiLCIuLi9zb3VyY2Uvcm91dGVyL3BhZ2UuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL2NvbG9yLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi90cmFuc2Zvcm10by5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vYW5pbWF0aW9uLmpzIiwiLi4vc291cmNlL3JvdXRlci9jb21wb25lbnQuanMiLCIuLi9zb3VyY2Uvcm91dGVyL3JvdXRlci5qcyIsIi4uL3NvdXJjZS93aWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG5cdFNjaGVtYSB0eXBlLiBIYW5kbGVzIHRoZSBwYXJzaW5nLCB2YWxpZGF0aW9uLCBhbmQgZmlsdGVyaW5nIG9mIE1vZGVsIGRhdGEgcHJvcGVydGllcy4gXHJcbiovXHJcbmNsYXNzIFNjaGVtYUNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFx0UGFyc2VzIHZhbHVlIHJldHVybnMgYW4gYXBwcm9wcmlhdGUgdHJhbnNmb3JtZWQgdmFsdWVcclxuICAgICovXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblxyXG4gICAgKi9cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcblxyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmcodmFsdWUpIHtcclxuICAgIFx0XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlICsgXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IgfTsiLCJpbXBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi9jb25zdHJ1Y3Rvci5qc1wiXHJcblxyXG5jbGFzcyBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciBleHRlbmRzIFNjaGVtYUNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcblxyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBOYU4gfHwgdmFsdWUgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXN1bHQucmVhc29uID0gXCJJbnZhbGlkIG51bWJlciB0eXBlLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciA9PSBmaWx0ZXJzW2ldKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IG51bWJlciA9IG5ldyBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvcigpXHJcblxyXG5leHBvcnQgeyBudW1iZXIsIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yIH07IiwidmFyIG51bGxfdG9rZW4gPSB7XHJcbiAgICB0eXBlOiBcIlwiLFxyXG4gICAgdGV4dDogXCJcIlxyXG59O1xyXG5cclxuY2xhc3MgTGV4ZXIge1xyXG4gICAgY29uc3RydWN0b3IodG9rZW5pemVyKSB7XHJcbiAgICAgICAgdGhpcy50ayA9IHRva2VuaXplcjtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuaXplci5uZXh0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLnR5cGUgPT09IFwibmV3X2xpbmVcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy50ay5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy5ob2xkO1xyXG4gICAgICAgICAgICB0aGlzLmhvbGQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy50b2tlbiAmJiAodGhpcy50b2tlbi50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcIndoaXRlX3NwYWNlXCIgfHwgdGhpcy50b2tlbi50eXBlID09PSBcImdlbmVyaWNcIikpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzZXJ0KHRleHQpIHtcclxuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nICR7dGV4dH0gZ290IG51bGxgKTtcclxuXHJcbiAgICAgICAgdmFyIGJvb2wgPSB0aGlzLnRva2VuLnRleHQgPT0gdGV4dDtcclxuXHJcblxyXG4gICAgICAgIGlmIChib29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyBcIiR7dGV4dH1cIiBnb3QgXCIke3RoaXMudG9rZW4udGV4dH1cImApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm9vbDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaG9sZCkgcmV0dXJuIG51bGxfdG9rZW47XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLmhvbGQgJiYgKHRoaXMuaG9sZC50eXBlID09PSBcIm5ld19saW5lXCIgfHwgdGhpcy5ob2xkLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLmhvbGQudHlwZSA9PT0gXCJnZW5lcmljXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ob2xkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGxfdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnR5cGU7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBvcygpe1xyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbi5wb3M7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHNsaWNlKHN0YXJ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRrLnN0cmluZy5zbGljZShzdGFydCwgdGhpcy50b2tlbi5wb3MpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGsuc3RyaW5nLnNsaWNlKHN0YXJ0KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBMZXhlciB9IiwiLy9Db21wYXJlcyBjb2RlIHdpdGggYXJndW1lbnQgbGlzdCBhbmQgcmV0dXJucyB0cnVlIGlmIG1hdGNoIGlzIGZvdW5kLCBvdGhlcndpc2UgZmFsc2UgaXMgcmV0dXJuZWRcclxuZnVuY3Rpb24gY29tcGFyZUNvZGUoY29kZSkge1xyXG4gICAgdmFyIGxpc3QgPSBhcmd1bWVudHM7XHJcbiAgICBmb3IgKHZhciBpID0gMSwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpc3RbaV0gPT09IGNvZGUpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vL1JldHVybnMgdHJ1ZSBpZiBjb2RlIGxpZXMgYmV0d2VlbiB0aGUgb3RoZXIgdHdvIGFyZ3VtZW50c1xyXG5mdW5jdGlvbiBpblJhbmdlKGNvZGUpIHtcclxuICAgIHJldHVybiAoY29kZSA+IGFyZ3VtZW50c1sxXSAmJiBjb2RlIDwgYXJndW1lbnRzWzJdKTtcclxufVxyXG5cclxuLy9UaGUgcmVzdWx0aW5nIGFycmF5IGlzIHVzZWQgd2hpbGUgcGFyc2luZyBhbmQgdG9rZW5pemluZyB0b2tlbiBzdHJpbmdzXHJcbnZhciBzdHJpbmdfcGFyc2VfYW5kX2Zvcm1hdF9mdW5jdGlvbnMgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXJyYXkgPSBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlLCB0ZXh0LCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpblJhbmdlKGNvZGUsIDQ3LCA1OCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KDEgKyBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlQ29kZShjb2RlLCA2NiwgOTgsIDg4LCAxMjAsIDc5LCAxMTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA9PSA0Nikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSB0ZXh0LmNoYXJDb2RlQXQoMSArIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluUmFuZ2UoY29kZSwgNDcsIDU4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBjb2RlID09PSA0NikgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigyMCw0MCwxODApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImlkZW50aWZpZXJcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNDcsIDU4KSB8fCBpblJhbmdlKGNvZGUsIDY0LCA5MSkgfHwgaW5SYW5nZShjb2RlLCA5NiwgMTIzKSB8fCBjb21wYXJlQ29kZShjb2RlLCAzNSwgMzYsIDQ1LCA5NSkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3Rva2VuLmNvbG9yID0gcmFuZG9tQ29sb3IoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LC8qIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21tZW50XCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKGNvZGUgPT09IDQ3KSAmJiAodGV4dC5jaGFyQ29kZUF0KDEpID09PSA0NykpID8gMiA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpblJhbmdlKGNvZGUsIDMyLCAxMjgpIHx8IGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgKi97XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzQpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzNCkgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIndoaXRlX3NwYWNlXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzIgfHwgY29kZSA9PT0gOSkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDMyIHx8IGNvZGUgPT09IDkpID8gLTEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm5ld19saW5lXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMTApID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJvcGVuX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyMywgNDAsIDkxKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsb3NlX2JyYWNrZXRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDEyNSwgNDEsIDkzKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMTAwLDEwMCwxMDApXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcIk9wZXJhdG9yXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlQ29kZShjb2RlLCA0MiwgNDMsIDYwLCA2MSwgNjIsIDkyLCAzOCwgMzcsIDMzLCA5NCwgMTI0LCA1OCkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NpbmdsZSBjaGFyYWN0ZXIsIGVuZCBjb21lcyBpbW1lZGlhdGx5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDIwNSwxMjAsMClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiU3ltYm9sXCIsIC8vRXZlcnl0aGluZyBlbHNlIHNob3VsZCBiZSBnZW5lcmljIHN5bWJvbHNcclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9HZW5lcmljIHdpbGwgY2FwdHVyZSBBTlkgcmVtYWluZGVyIGNoYXJhY3RlciBzZXRzLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICAvL1RoaXMgYWxsb3dzIGZvciBjcmVhdGlvbiBjdXN0b20gcGFyc2VycyBhbmQgZm9ybWF0dGVycyBiYXNlZCB1cG9uIHRoaXMgb2JqZWN0LlxyXG4gICAgYXJyYXkuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxufSk7XHJcblxyXG52YXIgU1BGID0gc3RyaW5nX3BhcnNlX2FuZF9mb3JtYXRfZnVuY3Rpb25zKCk7XHJcbnZhciBTUEZfbGVuZ3RoID0gU1BGLmxlbmd0aDtcclxuXHJcbmNsYXNzIFRva2VuaXplciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcclxuICAgIFx0dGhpcy5oID0gbnVsbDtcclxuXHQgICAgdGhpcy5saW5lID0gMDtcclxuXHQgICAgdGhpcy5jaGFyID0gMDtcclxuXHQgICAgdGhpcy5vZmZzZXQgPSAwO1xyXG5cdCAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHRoaXMubGluZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaG9sZCh0b2tlbikge1xyXG4gICAgICAgIHRoaXMuaCA9IHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcblxyXG4gICAgICAgIHZhciB0b2tlbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5oO1xyXG4gICAgICAgICAgICB0aGlzLmggPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0cmluZy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChvZmZzZXQgPj0gdGhpcy5zdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLnN0cmluZy5jaGFyQ29kZUF0KG9mZnNldCk7XHJcbiAgICAgICAgbGV0IFNQRl9mdW5jdGlvbjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFNQRl9sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBTUEZfZnVuY3Rpb24gPSBTUEZbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZXN0X2luZGV4ID0gU1BGX2Z1bmN0aW9uLmNoZWNrKGNvZGUsIHRoaXMuc3RyaW5nLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICBpZiAodGVzdF9pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFNQRl9mdW5jdGlvbi50eXBlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gdGVzdF9pbmRleDsgaSA8IHRoaXMuc3RyaW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IFNQRl9mdW5jdGlvbi5zY2FuVG9FbmQodGhpcy5zdHJpbmcuY2hhckNvZGVBdChpICsgb2Zmc2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPiAtMSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b2tlbl9sZW5ndGggPSBpICsgZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVtcCA9IHRoaXMuc3RyaW5nLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9rZW5fbGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKFNQRl9mdW5jdGlvbi50eXBlID09PSBcIm5ld19saW5lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5saW5lKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb3V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBTUEZfZnVuY3Rpb24udHlwZSxcclxuICAgICAgICAgICAgdGV4dDogdGVtcCxcclxuICAgICAgICAgICAgcG9zOiB0aGlzLm9mZnNldCxcclxuICAgICAgICAgICAgbGVuZ3RoOiB0b2tlbl9sZW5ndGgsXHJcbiAgICAgICAgICAgIGNoYXI6IHRoaXMuY2hhcixcclxuICAgICAgICAgICAgbGluZTogdGhpcy5saW5lXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdG9rZW5fbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2hhciArPSB0b2tlbl9sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7VG9rZW5pemVyfVxyXG4iLCJjb25zdCBtb250aHMgPSBbe1xyXG4gICAgbmFtZTogXCJKYW51YXJ5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDAsXHJcbiAgICBkYXlfb2Zmc2VfbGVhcHQ6IDBcclxufSwge1xyXG4gICAgbmFtZTogXCJGZWJydWFyeVwiLFxyXG4gICAgZGF5czogMjgsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMzFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXJjaFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiA1OSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogNjBcclxufSwge1xyXG4gICAgbmFtZTogXCJBcHJpbFwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiA5MCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogOTFcclxufSwge1xyXG4gICAgbmFtZTogXCJNYXlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMTIwLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxMjFcclxufSwge1xyXG4gICAgbmFtZTogXCJKdW5lXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDE1MSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTUyXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiSnVseVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAxODEsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDE4MlxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkF1Z3VzdFwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAyMTIsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDIxM1xyXG59LCB7XHJcbiAgICBuYW1lOiBcIlNlcHRlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAyNDMsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDI0NFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk9jdG9iZXJcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMjczLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAyNzRcclxufSwge1xyXG4gICAgbmFtZTogXCJOb3ZlbWJlclwiLFxyXG4gICAgZGF5czogMzAsXHJcbiAgICBkYXlfb2Zmc2V0OiAzMDQsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDMwNVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkRlY2VtYmVyXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDMzLFxyXG4gICAgZGF5X29mZnNlX2xlYXB0OiAzMzVcclxufV1cclxuXHJcbmV4cG9ydCB7bW9udGhzfSIsIlxyXG52YXIgZG93ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XHJcblxyXG5leHBvcnQge2Rvd30iLCJmdW5jdGlvbiBHZXREYXlTdGFydEFuZEVuZChkYXRlKSB7XHJcbiAgICB2YXIgcnZhbCA9IHtcclxuICAgICAgICBzdGFydDogMCxcclxuICAgICAgICBlbmQ6IDBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZihkYXRlKSA9PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZSk7XHJcblxyXG4gICAgICAgIGQuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgZC5zZXRNaW51dGVzKDApO1xyXG4gICAgICAgIGQuc2V0U2Vjb25kcygwKTtcclxuICAgICAgICBkLnNldE1pbGxpc2Vjb25kcygwKVxyXG5cclxuICAgICAgICBydmFsLnN0YXJ0ID0gZC52YWx1ZU9mKCk7XHJcbiAgICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgZC5zZXRTZWNvbmRzKC0xKTtcclxuICAgICAgICBydmFsLmVuZCA9IGQudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBydmFsO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgR2V0RGF5U3RhcnRBbmRFbmRcclxufSIsImZ1bmN0aW9uIGZsb2F0MjR0bzEyTW9kVGltZSh0aW1lLCBDQVBJVEFMKSB7XHJcbiAgICB2YXIgSVNfUE0gPSB0aW1lID49IDEyICYmIHRpbWUgPCAyNDtcclxuICAgIHZhciBtaW51dGVzID0gKCh0aW1lICUgMSkgKiA2MCkgfCAwO1xyXG4gICAgdmFyIGhvdXJzID0gKCgodGltZSB8IDApICUgMTIpICE9IDApID8gKHRpbWUgfCAwKSAlIDEyIDogMTI7XHJcblxyXG4gICAgcmV0dXJuIChob3VycyArIFwiOlwiICsgKFwiMFwiICsgbWludXRlcykuc2xpY2UoLTIpKSArICgoSVNfUE0pID8gKENBUElUQUwpID8gXCJQTVwiIDpcInBtXCIgOiAoQ0FQSVRBTCkgPyBcIkFNXCIgOiBcImFtXCIpO1xyXG59XHJcblxyXG5leHBvcnQge2Zsb2F0MjR0bzEyTW9kVGltZX0iLCJjbGFzcyBQb2ludDJEIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuXHRcdHN1cGVyKDIpXHJcblxyXG5cdFx0aWYgKHR5cGVvZih4KSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4O1xyXG5cdFx0XHR0aGlzWzFdID0geTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHhbMF07XHJcblx0XHRcdHRoaXNbMV0gPSB4WzFdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhdyhjdHgsIHMgPSAxKXtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8odGhpcy54KnMsdGhpcy55KnMpO1xyXG5cdFx0Y3R4LmFyYyh0aGlzLngqcywgdGhpcy55KnMsIHMqMC4wMSwgMCwgMipNYXRoLlBJKTtcclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHR9XHJcblxyXG5cdGdldCB4ICgpeyByZXR1cm4gdGhpc1swXX1cclxuXHRzZXQgeCAodil7aWYodHlwZW9mKHYpICE9PSBcIm51bWJlclwiKSByZXR1cm47IHRoaXNbMF0gPSB2fVxyXG5cclxuXHRnZXQgeSAoKXsgcmV0dXJuIHRoaXNbMV19XHJcblx0c2V0IHkgKHYpe2lmKHR5cGVvZih2KSAhPT0gXCJudW1iZXJcIikgcmV0dXJuOyB0aGlzWzFdID0gdn1cclxufVxyXG5cclxuZXhwb3J0IHtQb2ludDJEfSIsImltcG9ydCB7XHJcbiAgICBQb2ludDJEXHJcbn0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcblxyXG5mdW5jdGlvbiBjdXJ2ZVBvaW50KGN1cnZlLCB0KSB7XHJcbiAgICB2YXIgcG9pbnQgPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICB9O1xyXG4gICAgcG9pbnQueCA9IHBvc09uQ3VydmUodCwgY3VydmVbMF0sIGN1cnZlWzJdLCBjdXJ2ZVs0XSk7XHJcbiAgICBwb2ludC55ID0gcG9zT25DdXJ2ZSh0LCBjdXJ2ZVsxXSwgY3VydmVbM10sIGN1cnZlWzVdKTtcclxuICAgIHJldHVybiBwb2ludDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9zT25DdXJ2ZSh0LCBwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgdGkgPSAxIC0gdDtcclxuICAgIHJldHVybiB0aSAqIHRpICogcDEgKyAyICogdGkgKiB0ICogcDIgKyB0ICogdCAqIHAzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdEN1cnZlKGJwLCB0KSB7XHJcbiAgICB2YXIgbGVmdCA9IFtdO1xyXG4gICAgdmFyIHJpZ2h0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhd0N1cnZlKGJwLCB0KSB7XHJcbiAgICAgICAgaWYgKGJwLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIGxlZnQucHVzaChicFswXSwgYnBbMV0pO1xyXG4gICAgICAgICAgICByaWdodC5wdXNoKGJwWzBdLCBicFsxXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld19icCA9IFtdIC8vYnAuc2xpY2UoMCwtMik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnAubGVuZ3RoIC0gMjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdC5wdXNoKGJwW2ldLCBicFtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gYnAubGVuZ3RoIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnB1c2goYnBbaSArIDJdLCBicFtpICsgM10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3X2JwLnB1c2goKDEgLSB0KSAqIGJwW2ldICsgdCAqIGJwW2kgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYnAucHVzaCgoMSAtIHQpICogYnBbaSArIDFdICsgdCAqIGJwW2kgKyAzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZHJhd0N1cnZlKG5ld19icCwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDdXJ2ZShicCwgdCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBuZXcgUUJlemllcihyaWdodCksXHJcbiAgICAgICAgeTogbmV3IFFCZXppZXIobGVmdClcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlSW50ZXJzZWN0aW9ucyhwMSwgcDIsIHAzKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0aW9ucyA9IHtcclxuICAgICAgICBhOiBJbmZpbml0eSxcclxuICAgICAgICBiOiBJbmZpbml0eVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYSA9IHAxIC0gMiAqIHAyICsgcDM7XHJcblxyXG4gICAgdmFyIGIgPSAyICogKHAyIC0gcDEpO1xyXG5cclxuICAgIHZhciBjID0gcDE7XHJcblxyXG4gICAgaWYgKGIgPT0gMCkge30gZWxzZSBpZiAoTWF0aC5hYnMoYSkgPCAwLjAwMDAwMDAwMDA1KSB7XHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5hID0gKC1jIC8gYik7IC8vYyAvIGI7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmEgPSAoKC1iIC0gTWF0aC5zcXJ0KChiICogYikgLSA0ICogYSAqIGMpKSAvICgyICogYSkpO1xyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYiA9ICgoLWIgKyBNYXRoLnNxcnQoKGIgKiBiKSAtIDQgKiBhICogYykpIC8gKDIgKiBhKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uc1xyXG59XHJcblxyXG5jbGFzcyBRQmV6aWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMpIHtcclxuICAgICAgICB0aGlzLngxID0gMDtcclxuICAgICAgICB0aGlzLngyID0gMDtcclxuICAgICAgICB0aGlzLngzID0gMDtcclxuICAgICAgICB0aGlzLnkxID0gMDtcclxuICAgICAgICB0aGlzLnkyID0gMDtcclxuICAgICAgICB0aGlzLnkzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZih4MSkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLngxID0geDE7XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MjtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgzO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geTE7XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB5MjtcclxuICAgICAgICAgICAgdGhpcy55MyA9IHkzO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeDEgaW5zdGFuY2VvZiBRQmV6aWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MS54MTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgxLngyO1xyXG4gICAgICAgICAgICB0aGlzLngzID0geDEueDM7XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB4MS55MTtcclxuICAgICAgICAgICAgdGhpcy55MiA9IHgxLnkyO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDEueTM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4MSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MVswXTtcclxuICAgICAgICAgICAgdGhpcy55MSA9IHgxWzFdO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDFbMl07XHJcbiAgICAgICAgICAgIHRoaXMueTIgPSB4MVszXTtcclxuICAgICAgICAgICAgdGhpcy54MyA9IHgxWzRdO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geDFbNV07XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIoXHJcbiAgICAgICAgICAgIHRoaXMueDMsXHJcbiAgICAgICAgICAgIHRoaXMueTMsXHJcbiAgICAgICAgICAgIHRoaXMueDIsXHJcbiAgICAgICAgICAgIHRoaXMueTIsXHJcbiAgICAgICAgICAgIHRoaXMueDEsXHJcbiAgICAgICAgICAgIHRoaXMueTFcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcG9pbnQodCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyRChcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLngxLCB0aGlzLngyLCB0aGlzLngzKSxcclxuICAgICAgICAgICAgcG9zT25DdXJ2ZSh0LCB0aGlzLnkxLCB0aGlzLnkyLCB0aGlzLnkzKSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGFuZ2VudCh0KSB7XHJcbiAgICAgICAgdmFyIHRhbiA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBweDEgPSB0aGlzLngyIC0gdGhpcy54MTtcclxuICAgICAgICB2YXIgcHkxID0gdGhpcy55MiAtIHRoaXMueTE7XHJcblxyXG4gICAgICAgIHZhciBweDIgPSB0aGlzLngzIC0gdGhpcy54MjtcclxuICAgICAgICB2YXIgcHkyID0gdGhpcy55MyAtIHRoaXMueTI7XHJcblxyXG4gICAgICAgIHRhbi54ID0gKDEgLSB0KSAqIHB4MSArIHQgKiBweDI7XHJcbiAgICAgICAgdGFuLnkgPSAoMSAtIHQpICogcHkxICsgdCAqIHB5MjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhbjtcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54MSwgdGhpcy55MSwgdGhpcy54MiwgdGhpcy55MiwgdGhpcy54MywgdGhpcy55M107XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodCkge1xyXG4gICAgICAgIHJldHVybiBzcGxpdEN1cnZlKHRoaXMudG9BcnJheSgpLCB0KTtcclxuICAgIH1cclxuXHJcbiAgICByb290c1ggKCl7XHJcbiAgICBcdHJldHVybiB0aGlzLnJvb3RzKFxyXG4gICAgXHRcdHRoaXMueDEsIFxyXG4gICAgXHRcdHRoaXMueDIsXHJcbiAgICBcdFx0dGhpcy54M1xyXG4gICAgXHRcdClcclxuICAgIFx0XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdHMocDEsIHAyLCBwMykge1xyXG4gICAgICAgIHZhciBjdXJ2ZSA9IHRoaXMudG9BcnJheSgpO1xyXG5cclxuICAgICAgICB2YXIgYyA9IHAxIC0gKDIqcDIpICsgcDM7XHJcbiAgICAgICAgdmFyIGIgPSAyKihwMiAtIHAxKTtcclxuICAgICAgICB2YXIgYSA9IHAxO1xyXG4gICAgICAgIHZhciBhMiA9IGEqMjtcclxuICAgICAgICBjb25zb2xlLmxvZyhjICxcIiBjXCIpXHJcbiAgICAgICAgdmFyIHNxcnQgPSBNYXRoLnNxcnQoYipiIC0gKGEgKiA0ICpjKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coc3FydCwgYiwgYTIsIHAzKVxyXG4gICAgICAgIHZhciB0MSA9ICgtYiArIHNxcnQpIC8gYTI7XHJcbiAgICAgICAgdmFyIHQyID0gKC1iIC0gc3FydCkgLyBhMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgdDEgLCB0MiBdO1xyXG4gICAgfSBcclxuXHJcbiAgICByb290c2EoKSB7XHJcbiAgICAgICAgdmFyIGN1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIHZhciBwMSA9IGN1cnZlWzFdO1xyXG4gICAgICAgIHZhciBwMiA9IGN1cnZlWzNdO1xyXG4gICAgICAgIHZhciBwMyA9IGN1cnZlWzVdO1xyXG4gICAgICAgIHZhciB4MSA9IGN1cnZlWzBdO1xyXG4gICAgICAgIHZhciB4MiA9IGN1cnZlWzJdO1xyXG4gICAgICAgIHZhciB4MyA9IGN1cnZlWzRdO1xyXG5cclxuICAgICAgICB2YXIgcHkxZCA9IDIgKiAocDIgLSBwMSk7XHJcbiAgICAgICAgdmFyIHB5MmQgPSAyICogKHAzIC0gcDIpO1xyXG4gICAgICAgIHZhciBhZDEgPSAtcHkxZCArIHB5MmQ7XHJcbiAgICAgICAgdmFyIGJkMSA9IHB5MWQ7XHJcblxyXG4gICAgICAgIHZhciBweDFkID0gMiAqICh4MiAtIHgxKTtcclxuICAgICAgICB2YXIgcHgyZCA9IDIgKiAoeDMgLSB4Mik7XHJcbiAgICAgICAgdmFyIGFkMiA9IC1weDFkICsgcHgyZDtcclxuICAgICAgICB2YXIgYmQyID0gcHgxZDtcclxuXHJcbiAgICAgICAgdmFyIHQxID0gLWJkMSAvIGFkMTtcclxuICAgICAgICB2YXIgdDIgPSAtYmQyIC8gYWQyO1xyXG5cclxuICAgICAgICByZXR1cm4gWyB0MSAsIHQyIF07XHJcbiAgICB9XHJcblxyXG4gICAgYm91bmRpbmdCb3goKSB7XHJcbiAgICAgICAgdmFyIHgxID0gY3VydmVbMF07XHJcbiAgICAgICAgdmFyIHkxID0gY3VydmVbMV07XHJcbiAgICAgICAgdmFyIHgyID0gY3VydmVbMl07XHJcbiAgICAgICAgdmFyIHkyID0gY3VydmVbM107XHJcbiAgICAgICAgdmFyIHgzID0gY3VydmVbNF07XHJcbiAgICAgICAgdmFyIHkzID0gY3VydmVbNV07XHJcbiAgICAgICAgdmFyIHJvb3RzID0gZ2V0Um9vdHNDbGFtcGVkKGN1cnZlKTtcclxuICAgICAgICB2YXIgbWluX3ggPSBNYXRoLm1pbih4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IEluZmluaXR5LCByb290cy54WzBdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWluX3kgPSBNYXRoLm1pbih5MSwgeTIsIHkzLCByb290cy55WzFdIHx8IEluZmluaXR5LCByb290cy54WzFdIHx8IEluZmluaXR5KTtcclxuICAgICAgICB2YXIgbWF4X3ggPSBNYXRoLm1heCh4MSwgeDIsIHgzLCByb290cy55WzBdIHx8IC1JbmZpbml0eSwgcm9vdHMueFswXSB8fCAtSW5maW5pdHkpO1xyXG4gICAgICAgIHZhciBtYXhfeSA9IE1hdGgubWF4KHkxLCB5MiwgeTMsIHJvb3RzLnlbMV0gfHwgLUluZmluaXR5LCByb290cy54WzFdIHx8IC1JbmZpbml0eSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1pbjoge1xyXG4gICAgICAgICAgICAgICAgeDogbWluX3gsXHJcbiAgICAgICAgICAgICAgICB5OiBtaW5feVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXg6IHtcclxuICAgICAgICAgICAgICAgIHg6IG1heF94LFxyXG4gICAgICAgICAgICAgICAgeTogbWF4X3lcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlKGFuZ2xlLCBvZmZzZXQpIHtcclxuICAgICAgICBhbmdsZSA9IChhbmdsZSAvIDE4MCkgKiBNYXRoLlBJO1xyXG5cclxuICAgICAgICB2YXIgbmV3X2N1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gY3VydmVbaV0gLSBvZmZzZXQueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBjdXJ2ZVtpICsgMV0gLSBvZmZzZXQueTtcclxuICAgICAgICAgICAgbmV3X2N1cnZlW2ldID0gKCh4ICogTWF0aC5jb3MoYW5nbGUpIC0geSAqIE1hdGguc2luKGFuZ2xlKSkpICsgb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIG5ld19jdXJ2ZVtpICsgMV0gPSAoKHggKiBNYXRoLnNpbihhbmdsZSkgKyB5ICogTWF0aC5jb3MoYW5nbGUpKSkgKyBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUUJlemllcihuZXdfY3VydmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyc2VjdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogY3VydmVJbnRlcnNlY3Rpb25zKHRoaXMueDEsIHRoaXMueDIsIHRoaXMueDMpLFxyXG4gICAgICAgICAgICB5OiBjdXJ2ZUludGVyc2VjdGlvbnModGhpcy55MSwgdGhpcy55MiwgdGhpcy55MylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHgsIHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mKHgpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MSArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkxICsgeSxcclxuICAgICAgICAgICAgICAgIHRoaXMueDIgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MiArIHksXHJcbiAgICAgICAgICAgICAgICB0aGlzLngzICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTMgKyB5LFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUUJlemllclxyXG59IiwiY29uc3Qgc3FydCA9IE1hdGguc3FydDtcclxuY29uc3QgY29zID0gTWF0aC5jb3M7XHJcbmNvbnN0IGFjb3MgPSBNYXRoLmFjb3M7XHJcbmNvbnN0IFBJID0gTWF0aC5QSTtcclxuY29uc3Qgc2luID0gTWF0aC5zaW47XHJcblxyXG5leHBvcnR7XHJcblx0c3FydCxcclxuXHRjb3MsXHJcblx0c2luLFxyXG5cdGFjb3MsXHJcblx0YWNvczIsXHJcblx0UElcclxufSIsImltcG9ydCB7UG9pbnQyRH0gZnJvbSBcIi4vcG9pbnQyRFwiXHJcbmltcG9ydCB7c3FydCxjb3MsYWNvcyxQSX0gZnJvbSBcIi4vY29uc3RzXCJcclxuXHJcbi8vIEEgaGVscGVyIGZ1bmN0aW9uIHRvIGZpbHRlciBmb3IgdmFsdWVzIGluIHRoZSBbMCwxXSBpbnRlcnZhbDpcclxuZnVuY3Rpb24gYWNjZXB0KHQpIHtcclxuICByZXR1cm4gMDw9dCAmJiB0IDw9MTtcclxufVxyXG5cclxuLy8gQSByZWFsLWN1YmVyb290cy1vbmx5IGZ1bmN0aW9uOlxyXG5mdW5jdGlvbiBjdWJlcm9vdCh2KSB7XHJcbiAgaWYodjwwKSByZXR1cm4gLU1hdGgucG93KC12LDEvMyk7XHJcbiAgcmV0dXJuIE1hdGgucG93KHYsMS8zKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwb2ludCh0LCBwMSwgcDIsIHAzLCBwNCkge1xyXG5cdHZhciB0aSA9IDEgLSB0O1xyXG5cdHZhciB0aTIgPSB0aSAqIHRpO1xyXG5cdHZhciB0MiA9IHQgKiB0O1xyXG5cclxuXHRyZXR1cm4gdGkgKiB0aTIgKiBwMSArIDMgKiB0aTIgKiB0ICogcDIgKyB0MiAqIDMgKiB0aSAqIHAzICsgdDIgKiB0ICogcDQ7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDQmV6aWVyIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cdGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCkge1xyXG5cdFx0c3VwZXIoOClcclxuXHJcblx0XHQvL01hcCBQMSBhbmQgUDIgdG8gezAsMCwxLDF9IGlmIG9ubHkgZm91ciBhcmd1bWVudHMgYXJlIHByb3ZpZGVkOyBmb3IgdXNlIHdpdGggYW5pbWF0aW9uc1xyXG5cdFx0aWYoYXJndW1lbnRzLmxlbmd0aCA9PSA0KXtcclxuXHRcdFx0dGhpc1swXSA9IDA7XHJcblx0XHRcdHRoaXNbMV0gPSAwO1xyXG5cdFx0XHR0aGlzWzJdID0geDE7XHJcblx0XHRcdHRoaXNbM10gPSB5MTtcclxuXHRcdFx0dGhpc1s0XSA9IHgyO1xyXG5cdFx0XHR0aGlzWzVdID0geTI7XHJcblx0XHRcdHRoaXNbNl0gPSAxO1xyXG5cdFx0XHR0aGlzWzddID0gMTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAodHlwZW9mKHgxKSA9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRoaXNbMF0gPSB4MTtcclxuXHRcdFx0dGhpc1sxXSA9IHkxO1xyXG5cdFx0XHR0aGlzWzJdID0geDI7XHJcblx0XHRcdHRoaXNbM10gPSB5MjtcclxuXHRcdFx0dGhpc1s0XSA9IHgzO1xyXG5cdFx0XHR0aGlzWzVdID0geTM7XHJcblx0XHRcdHRoaXNbNl0gPSB4NDtcclxuXHRcdFx0dGhpc1s3XSA9IHk0O1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHgxIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0dGhpc1swXSA9IHgxWzBdO1xyXG5cdFx0XHR0aGlzWzFdID0geDFbMV07XHJcblx0XHRcdHRoaXNbMl0gPSB4MVsyXTtcclxuXHRcdFx0dGhpc1szXSA9IHgxWzNdO1xyXG5cdFx0XHR0aGlzWzRdID0geDFbNF07XHJcblx0XHRcdHRoaXNbNV0gPSB4MVs1XTtcclxuXHRcdFx0dGhpc1s2XSA9IHgxWzZdO1xyXG5cdFx0XHR0aGlzWzddID0geDFbNF07XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCB4MSAoKXsgcmV0dXJuIHRoaXNbMF19XHJcblx0c2V0IHgxICh2KXt0aGlzWzBdID0gdn1cclxuXHRnZXQgeDIgKCl7IHJldHVybiB0aGlzWzJdfVxyXG5cdHNldCB4MiAodil7dGhpc1syXSA9IHZ9XHJcblx0Z2V0IHgzICgpeyByZXR1cm4gdGhpc1s0XX1cclxuXHRzZXQgeDMgKHYpe3RoaXNbNF0gPSB2fVxyXG5cdGdldCB4NCAoKXsgcmV0dXJuIHRoaXNbNl19XHJcblx0c2V0IHg0ICh2KXt0aGlzWzZdID0gdn1cclxuXHRnZXQgeTEgKCl7IHJldHVybiB0aGlzWzFdfVxyXG5cdHNldCB5MSAodil7dGhpc1sxXSA9IHZ9XHJcblx0Z2V0IHkyICgpeyByZXR1cm4gdGhpc1szXX1cclxuXHRzZXQgeTIgKHYpe3RoaXNbM10gPSB2fVxyXG5cdGdldCB5MyAoKXsgcmV0dXJuIHRoaXNbNV19XHJcblx0c2V0IHkzICh2KXt0aGlzWzVdID0gdn1cclxuXHRnZXQgeTQgKCl7IHJldHVybiB0aGlzWzddfVxyXG5cdHNldCB5NCAodil7dGhpc1s3XSA9IHZ9XHJcblxyXG5cdGFkZCh4LHkgPSAwKXtcclxuXHRcdHJldHVybiBuZXcgQ0N1cnZlKFxyXG5cdFx0XHR0aGlzWzBdICsgeCxcclxuXHRcdFx0dGhpc1sxXSArIHksXHJcblx0XHRcdHRoaXNbMl0gKyB4LFxyXG5cdFx0XHR0aGlzWzNdICsgeSxcclxuXHRcdFx0dGhpc1s0XSArIHgsXHJcblx0XHRcdHRoaXNbNV0gKyB5LFxyXG5cdFx0XHR0aGlzWzZdICsgeCxcclxuXHRcdFx0dGhpc1s3XSArIHlcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdHZhbFkodCl7XHJcblx0XHRyZXR1cm4gcG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSk7XHJcblx0fVxyXG5cclxuXHR2YWxYKHQpe1xyXG5cdFx0cmV0dXJuIHBvaW50KHQsIHRoaXNbMF0sIHRoaXNbMl0sIHRoaXNbNF0sIHRoaXNbNl0pO1xyXG5cdH1cclxuXHJcblx0cG9pbnQodCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludDJEKFxyXG5cdFx0XHRwb2ludCh0LCB0aGlzWzBdLCB0aGlzWzJdLCB0aGlzWzRdLCB0aGlzWzZdKSxcclxuXHRcdFx0cG9pbnQodCwgdGhpc1sxXSwgdGhpc1szXSwgdGhpc1s1XSwgdGhpc1s3XSlcclxuXHRcdClcclxuXHR9XHJcblx0XHJcblx0LyoqIFxyXG5cdFx0QXF1aXJlZCBmcm9tIDogaHR0cHM6Ly9wb21heC5naXRodWIuaW8vYmV6aWVyaW5mby9cclxuXHRcdEF1dGhvcjogIE1pa2UgXCJQb21heFwiIEthbWVybWFuc1xyXG5cdFx0R2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvXHJcblx0Ki9cclxuXHJcblx0cm9vdHMocDEscDIscDMscDQpIHtcclxuXHRcdHZhciBkID0gKC1wMSArIDMgKiBwMiAtIDMgKiBwMyArIHA0KSxcclxuXHRcdFx0YSA9ICgzICogcDEgLSA2ICogcDIgKyAzICogcDMpIC8gZCxcclxuXHRcdFx0YiA9ICgtMyAqIHAxICsgMyAqIHAyKSAvIGQsXHJcblx0XHRcdGMgPSBwMSAvIGQ7XHJcblxyXG5cdFx0dmFyIHAgPSAoMyAqIGIgLSBhICogYSkgLyAzLFxyXG5cdFx0XHRwMyA9IHAgLyAzLFxyXG5cdFx0XHRxID0gKDIgKiBhICogYSAqIGEgLSA5ICogYSAqIGIgKyAyNyAqIGMpIC8gMjcsXHJcblx0XHRcdHEyID0gcSAvIDIsXHJcblx0XHRcdGRpc2NyaW1pbmFudCA9IHEyICogcTIgKyBwMyAqIHAzICogcDM7XHJcblxyXG5cdFx0Ly8gYW5kIHNvbWUgdmFyaWFibGVzIHdlJ3JlIGdvaW5nIHRvIHVzZSBsYXRlciBvbjpcclxuXHRcdHZhciB1MSwgdjEsIHJvb3QxLCByb290Miwgcm9vdDM7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcG9zc2libGUgcmVhbCByb290czpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QxID0gdDEgKiBjb3MocGhpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSB0MSAqIGNvcygocGhpICsgMiAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJvb3QzID0gdDEgKiBjb3MoKHBoaSArIDQgKiBQSSkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyZXR1cm4gW3Jvb3QzLCByb290MSwgcm9vdDJdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPT09IDApIHtcclxuXHRcdFx0dTEgPSBxMiA8IDAgPyBjdWJlcm9vdCgtcTIpIDogLWN1YmVyb290KHEyKTtcclxuXHRcdFx0cm9vdDEgPSAyICogdTEgLSBhIC8gMztcclxuXHRcdFx0cm9vdDIgPSAtdTEgLSBhIC8gMztcclxuXHRcdFx0cmV0dXJuIFtyb290Miwgcm9vdDFdXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb25lIHJlYWwgcm9vdCwgdHdvIGNvbXBsZXggcm9vdHNcclxuXHRcdHZhciBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcclxuXHRcdHUxID0gY3ViZXJvb3Qoc2QgLSBxMik7XHJcblx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0cm9vdDEgPSB1MSAtIHYxIC0gYSAvIDM7XHJcblx0XHRyZXR1cm4gW3Jvb3QxXVxyXG5cdH1cclxuXHJcblx0cm9vdHNZKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucm9vdHModGhpc1sxXSx0aGlzWzNdLHRoaXNbNV0sdGhpc1s3XSlcclxuXHR9XHJcblxyXG5cdHJvb3RzWCgpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvb3RzKHRoaXNbMF0sdGhpc1syXSx0aGlzWzRdLHRoaXNbNl0pXHJcblx0fVxyXG5cdFxyXG5cdGdldFlhdFgoeCl7XHJcblx0XHR2YXIgeDEgPSB0aGlzWzBdIC0geCwgeDIgPSB0aGlzWzJdIC0geCwgeDMgPSB0aGlzWzRdIC0geCwgeDQgPSB0aGlzWzZdIC0geCxcclxuXHRcdFx0eDJfMyA9IHgyICogMywgeDFfMyA9IHgxICozLCB4M18zID0geDMgKiAzLFxyXG5cdFx0XHRkID0gKC14MSArIHgyXzMgLSB4M18zICsgeDQpLCBkaSA9IDEvZCwgaTMgPSAxLzMsXHJcblx0XHRcdGEgPSAoeDFfMyAtIDYgKiB4MiArIHgzXzMpICogZGksXHJcblx0XHRcdGIgPSAoLXgxXzMgKyB4Ml8zKSAqIGRpLFxyXG5cdFx0XHRjID0geDEgKiBkaSxcclxuXHRcdFx0cCA9ICgzICogYiAtIGEgKiBhKSAqIGkzLFxyXG5cdFx0XHRwMyA9IHAgKiBpMyxcclxuXHRcdFx0cSA9ICgyICogYSAqIGEgKiBhIC0gOSAqIGEgKiBiICsgMjcgKiBjKSAqICgxLzI3KSxcclxuXHRcdFx0cTIgPSBxICogMC41LFxyXG5cdFx0XHRkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xyXG5cclxuXHRcdC8vIGFuZCBzb21lIHZhcmlhYmxlcyB3ZSdyZSBnb2luZyB0byB1c2UgbGF0ZXIgb246XHJcblx0XHR2YXIgdTEsIHYxLCByb290O1xyXG5cclxuXHRcdC8vVGhyZWUgcmVhbCByb290cyBjYW4gbmV2ZXIgaGFwcGVuIGlmIHAxKDAsMCkgYW5kIHA0KDEsMSk7XHJcblxyXG5cdFx0Ly8gdGhyZWUgcmVhbCByb290cywgYnV0IHR3byBvZiB0aGVtIGFyZSBlcXVhbDpcclxuXHRcdGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XHJcblx0XHRcdHZhciBtcDMgPSAtcCAvIDMsXHJcblx0XHRcdFx0bXAzMyA9IG1wMyAqIG1wMyAqIG1wMyxcclxuXHRcdFx0XHRyID0gc3FydChtcDMzKSxcclxuXHRcdFx0XHR0ID0gLXEgLyAoMiAqIHIpLFxyXG5cdFx0XHRcdGNvc3BoaSA9IHQgPCAtMSA/IC0xIDogdCA+IDEgPyAxIDogdCxcclxuXHRcdFx0XHRwaGkgPSBhY29zKGNvc3BoaSksXHJcblx0XHRcdFx0Y3J0ciA9IGN1YmVyb290KHIpLFxyXG5cdFx0XHRcdHQxID0gMiAqIGNydHI7XHJcblx0XHRcdHJvb3QgPSB0MSAqIGNvcygocGhpICsgNCAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHR9ZWxzZSBpZiAoZGlzY3JpbWluYW50ID09PSAwKSB7XHJcblx0XHRcdHUxID0gcTIgPCAwID8gY3ViZXJvb3QoLXEyKSA6IC1jdWJlcm9vdChxMik7XHJcblx0XHRcdHJvb3QgPSAtdTEgLSBhICogaTM7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dmFyIHNkID0gc3FydChkaXNjcmltaW5hbnQpO1xyXG5cdFx0XHQvLyBvbmUgcmVhbCByb290LCB0d28gY29tcGxleCByb290c1xyXG5cdFx0XHR1MSA9IGN1YmVyb290KHNkIC0gcTIpO1xyXG5cdFx0XHR2MSA9IGN1YmVyb290KHNkICsgcTIpO1xyXG5cdFx0XHRyb290ID0gdTEgLSB2MSAtIGEgKiBpMztcdFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwb2ludChyb290LCB0aGlzWzFdLCB0aGlzWzNdLCB0aGlzWzVdLCB0aGlzWzddKTtcclxuXHR9XHJcblx0LyoqXHJcblx0XHRHaXZlbiBhIENhbnZhcyAyRCBjb250ZXh0IG9iamVjdCBhbmQgc2NhbGUgdmFsdWUsIHN0cm9rZXMgYSBjdWJpYyBiZXppZXIgY3VydmUuXHJcblx0Ki9cclxuXHRkcmF3KGN0eCwgcyA9IDEpe1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbyh0aGlzWzBdKnMsIHRoaXNbMV0qcylcclxuXHRcdGN0eC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHR0aGlzWzJdKnMsIHRoaXNbM10qcyxcclxuXHRcdFx0dGhpc1s0XSpzLCB0aGlzWzVdKnMsXHJcblx0XHRcdHRoaXNbNl0qcywgdGhpc1s3XSpzXHJcblx0XHRcdClcclxuXHRcdGN0eC5zdHJva2UoKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtDQmV6aWVyfSIsImltcG9ydCB7TGV4ZXJ9IGZyb20gXCIuLi9zdHJpbmdfcGFyc2luZy9sZXhlclwiXHJcbmltcG9ydCB7VG9rZW5pemVyfSBmcm9tIFwiLi4vc3RyaW5nX3BhcnNpbmcvdG9rZW5pemVyXCJcclxuXHJcbi8qKlxyXG5VUkwgUXVlcnkgU3ludGF4XHJcblxyXG5yb290ID0+IFtyb290X2NsYXNzXSBbJiBbY2xhc3Nlc11dXHJcbiAgICAgPT4gW2NsYXNzZXNdXHJcblxyXG5yb290X2NsYXNzID0ga2V5X2xpc3RcclxuXHJcbmNsYXNzX2xpc3QgW2NsYXNzIFsmIGNsYXNzX2xpc3RdXVxyXG5cclxuY2xhc3MgPT4gbmFtZSAmIGtleV9saXN0XHJcblxyXG5rZXlfbGlzdCA9PiBba2V5X3ZhbCBbJiBrZXlfbGlzdF1dXHJcblxyXG5rZXlfdmFsID0+IG5hbWUgPSB2YWxcclxuXHJcbm5hbWUgPT4gQUxQSEFOVU1FUklDX0lEXHJcblxyXG52YWwgPT4gTlVNQkVSXHJcbiAgICA9PiBBTFBIQU5VTUVSSUNfSURcclxuKi9cclxuZnVuY3Rpb24gUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwKHF1ZXJ5KXtcclxuXHJcbiAgbGV0IG1hcHBlZF9vYmplY3QgPSBuZXcgTWFwO1xyXG5cclxuICBpZighcXVlcnkgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgY29uc29sZS53YXJuKFwicXVlcnkgYXJndW1lbnQgcHJvdmlkZWQgaXMgbm90IGEgc3RyaW5nIVwiKVxyXG4gICAgcmV0dXJuIG1hcHBlZF9vYmplY3Q7XHJcbiAgfVxyXG5cclxuICBpZihxdWVyeVswXSA9PSBcIj9cIikgcXVlcnkgPSBxdWVyeS5zbGljZSgxKTtcclxuXHJcbiAgbGV0IGxleCA9IG5ldyBMZXhlcihuZXcgVG9rZW5pemVyKHF1ZXJ5KSk7XHJcblxyXG4gIGZ1bmN0aW9uIGtleV92YWxfbGlzdChsZXgsIG1hcCl7XHJcbiAgICBsZXQgdG9rZW47XHJcbiAgICB3aGlsZSgodG9rZW4gPSBsZXgudG9rZW4pICYmIHRva2VuLnRleHQgIT09IFwiJlwiKXtcclxuICAgICAgaWYobGV4LnBlZWsoKS50ZXh0ID09IFwiPVwiKXtcclxuICAgICAgICBsZXQga2V5ID0gdG9rZW4udGV4dDtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV0IHZhbCA9IGxleC50b2tlbjtcclxuICAgICAgICBtYXAuc2V0KGtleSwgKHZhbC50eXBlID09IFwibnVtYmVyXCIpP3BhcnNlRmxvYXQodmFsLnRleHQpOnZhbC50ZXh0KTtcclxuICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xhc3NfKGxleCwgbWFwKXtcclxuXHJcbiAgICBsZXQgdG9rZW47XHJcblxyXG4gICAgaWYoKHRva2VuID0gbGV4LnBlZWsoKSkgJiYgdG9rZW4udGV4dCA9PSBcIiZcIil7XHJcblxyXG4gICAgICB0b2tlbiA9IGxleC50b2tlbjtcclxuXHJcbiAgICAgIGxleC5uZXh0KCk7bGV4Lm5leHQoKTtcclxuICAgICAgbWFwLnNldCh0b2tlbi50ZXh0LCBuZXcgTWFwKCkpO1xyXG4gICAgICBrZXlfdmFsX2xpc3QobGV4LG1hcC5nZXQodG9rZW4udGV4dCkpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcm9vdChsZXgsbWFwKXtcclxuICAgICAgIG1hcC5zZXQobnVsbCwgbmV3IE1hcCgpKTtcclxuXHJcbiAgICAgIGlmKGxleC5wZWVrKCkudGV4dCA9PSBcIiZcIil7XHJcbiAgICAgICAgICBjbGFzc18obGV4LCBtYXApXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICAga2V5X3ZhbF9saXN0KGxleCwgbWFwLmdldChudWxsKSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdoaWxlKGxleC50b2tlbiAmJiBsZXgudG9rZW4udGV4dCA9PVwiJlwiKXtcclxuICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgY2xhc3NfKGxleCwgbWFwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcm9vdChsZXgsIG1hcHBlZF9vYmplY3QpO1xyXG4gIHJldHVybiBtYXBwZWRfb2JqZWN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBRdWVyeU1hcFRvUXVlcnlTdHJpbmcobWFwKXtcclxuICAgIGxldCBjbGFzc18sIG51bGxfY2xhc3Msc3RyID1cIlwiO1xyXG4gICAgaWYoKG51bGxfY2xhc3MgPSBtYXAuZ2V0KG51bGwpKSl7XHJcbiAgICAgICAgaWYobnVsbF9jbGFzcy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgZm9yKGxldCBba2V5LHZhbF0gb2YgbnVsbF9jbGFzcy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IGAmJHtrZXl9PSR7dmFsfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBba2V5LGNsYXNzX10gb2YgbWFwLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgIGlmKGtleSA9PSBudWxsKSBjb250aW51ZTtcclxuICAgICAgICAgICAgc3RyICs9IGAmJHtrZXl9YFxyXG4gICAgICAgICAgICBmb3IobGV0IFtrZXksdmFsXSBvZiBjbGFzc18uZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBgJiR7a2V5fT0ke3ZhbH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyO1xyXG59XHJcbmZ1bmN0aW9uIFR1cm5EYXRhSW50b1F1ZXJ5KGRhdGEpIHtcclxuICAgIHZhciBzdHIgPSBcIlwiO1xyXG5cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkYXRhID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3X3N0ciA9IGAke2RhdGEuY29tcG9uZW50fSZgO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICBuZXdfc3RyICs9IChhICE9IFwiY29tcG9uZW50XCIpID8gYCR7YX09JHtkYXRhW2FdfVxcJmAgOiBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0ciArPSBuZXdfc3RyLnNsaWNlKDAsIC0xKSArIFwiLlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSlcclxuICAgICAgICAgICAgc3RyICs9IGAke2F9PSR7ZGF0YVthXX1cXCZgO1xyXG5cclxuICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBUdXJuUXVlcnlJbnRvRGF0YShxdWVyeSkge1xyXG4gICAgdmFyIG91dCA9IHt9O1xyXG5cclxuICAgIGxldCB0ID0gcXVlcnkuc3BsaXQoXCIuXCIpO1xyXG5cclxuICAgIGlmICh0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgdC5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChhLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGEuc3BsaXQoXCImXCIpLmZvckVhY2goKGEsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDEpIG91dFthXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gYS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFtiWzBdXSA9IGJbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICBlbHNlIHtcclxuICAgICAgICBxdWVyeS5zcGxpdChcIiZcIikuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYiA9IGEuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBvdXRbYlswXV0gPSBiWzFdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgVHVyblF1ZXJ5SW50b0RhdGEsXHJcbiAgICBUdXJuRGF0YUludG9RdWVyeSxcclxuICAgIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZyxcclxuICAgIFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcFxyXG59XHJcbiIsIi8qKlxyXG5cdEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgYSB0b3VjaCBzY3JvbGxpbmcgaW50ZXJmYWNlIHVzaW5nIHRvdWNoIGV2ZW50c1xyXG4qL1xyXG5jbGFzcyBUb3VjaFNjcm9sbGVyIHtcclxuICAgIC8qKiBcclxuICAgICAgICBDb25zdHJ1Y3RzIGEgdG91Y2ggb2JqZWN0IGFyb3VuZCBhIGdpdmVuIGRvbSBlbGVtZW50LiBGdW5jdGlvbnMgbGlzdGVuZXJzIGNhbiBiZSBib3VuZCB0byB0aGlzIG9iamVjdCB1c2luZ1xyXG4gICAgICAgIHRoaXMgYWRkRXZlbnRMaXN0ZW5lciBtZXRob2QuXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZHJhZyA9IDAuMDIsIHRvdWNoaWQgPSAwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vcmlnaW5feCA9IDA7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5feSA9IDA7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eV94ID0gMDtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG4gICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IChkcmFnID4gMCkgPyBkcmFnIDogMC4wMjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoIXRvdWNoaWQgaW5zdGFuY2VvZiBOdW1iZXIpXHJcbiAgICAgICAgICAgIHRvdWNoaWQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgdGltZV9vbGQgPSAwO1xyXG5cclxuICAgICAgICBsZXQgZnJhbWUgPSAoZHgsIGR5LCBzdGVwcywgcmF0aW8gPSAxKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZHJhZ192YWwgPSB0aGlzLmRyYWc7XHJcblxyXG4gICAgICAgICAgICBkeCAtPSBkeCAqIGRyYWdfdmFsICogc3RlcHMgKiByYXRpbztcclxuICAgICAgICAgICAgZHkgLT0gZHkgKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcblxyXG4gICAgICAgICAgICBsZXQgZG0gPSBNYXRoLm1heChNYXRoLmFicyhkeSksIE1hdGguYWJzKGR5KSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kID0gIShzdGVwcyA+IDAgJiYgZG0gPiAwLjEgJiYgdGhpcy5HTyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuZCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmcmFtZShkeCwgZHksIDEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZW5kID0gZW5kICYmIHN0ZXBzICE9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2IgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IHRoaXMub3JpZ2luX3ggLSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSB0aGlzLm9yaWdpbl95IC0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRfYyA9IChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGltZV9uZXcgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWZmID0gdGltZV9uZXcgLSB0aW1lX29sZDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdGVwcyA9IE1hdGgubWluKGRpZmYgLyA4LjY2NjY2NjYsIDEgLyB0aGlzLmRyYWcpOyAvLyA2MCBGUFNcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZnJhbWUodGhpcy52ZWxvY2l0eV94LCB0aGlzLnZlbG9jaXR5X3ksIHN0ZXBzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHlfeSA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2EgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMuR08pe1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmdWFsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGltZV9vbGQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuR08gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1t0b3VjaGlkXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdG91Y2gpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl95ID0gdG91Y2guY2xpZW50WTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feCA9IHRvdWNoLmNsaWVudFg7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmV2ZW50X2IpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuZXZlbnRfYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5ldmVudF9hKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuZXZlbnRfYSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSA9PSBjYWxsYmFjaykgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0gPT0gY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRvdWNoU2Nyb2xsZXJcclxufSIsImltcG9ydCB7TGV4ZXJ9IGZyb20gXCIuL2NvbW1vbi9zdHJpbmdfcGFyc2luZy9sZXhlclwiXHJcbmltcG9ydCB7VG9rZW5pemVyfSBmcm9tIFwiLi9jb21tb24vc3RyaW5nX3BhcnNpbmcvdG9rZW5pemVyXCJcclxuXHJcbi8vVGltZVxyXG5pbXBvcnQge21vbnRoc30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9tb250aHNcIlxyXG5pbXBvcnQge2Rvd30gZnJvbSBcIi4vY29tbW9uL2RhdGVfdGltZS9kYXlzX29mX3dlZWtcIlxyXG5pbXBvcnQge0dldERheVN0YXJ0QW5kRW5kfSBmcm9tIFwiLi9jb21tb24vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoXCJcclxuaW1wb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IGZyb20gXCIuL2NvbW1vbi9kYXRlX3RpbWUvdGltZS5qc1wiXHJcblxyXG4vL01hdGhcclxuaW1wb3J0IHtRQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9xdWFkcmF0aWNfYmV6aWVyXCJcclxuaW1wb3J0IHtDQmV6aWVyfSBmcm9tIFwiLi9jb21tb24vbWF0aC9jdWJpY19iZXppZXJcIlxyXG5pbXBvcnQge1R1cm5RdWVyeUludG9EYXRhLCBUdXJuRGF0YUludG9RdWVyeX0gZnJvbSBcIi4vY29tbW9uL3VybC91cmxcIlxyXG5pbXBvcnQge1RvdWNoU2Nyb2xsZXJ9IGZyb20gXCIuL2NvbW1vbi9ldmVudC90b3VjaF9zY3JvbGxlclwiXHJcblxyXG5cclxuLyoqKioqKioqKioqIFN0cmluZyBQYXJzaW5nIEJhc2ljIEZ1bmN0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcblx0SWYgYSBzdHJpbmcgb2JqZWN0IGlzIHBhc3NlZCwgY3JlYXRlcyBhIGxleGVyIHRoYXQgdG9rZW5pemUgdGhlIGlucHV0IHN0cmluZy4gXHJcbiovXHJcbmZ1bmN0aW9uIExleChzdHJpbmcpe1xyXG5cdGlmKHR5cGVvZihzdHJpbmcpICE9PSBcInN0cmluZ1wiKXtcclxuXHRcdGNvbnNvbGUud2FybihcIkNhbm5vdCBjcmVhdGUgYSBsZXhlciBvbiBhIG5vbi1zdHJpbmcgb2JqZWN0IVwiKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG5ldyBMZXhlcihuZXcgVG9rZW5pemVyKHN0cmluZykpO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG5cdExleCxcclxuXHRMZXhlciwgXHJcblx0VG9rZW5pemVyLFxyXG5cdG1vbnRocyxcclxuXHRkb3csXHJcblx0UUJlemllcixcclxuXHRDQmV6aWVyLFxyXG5cdFR1cm5RdWVyeUludG9EYXRhLFxyXG5cdFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG5cdEdldERheVN0YXJ0QW5kRW5kLFxyXG5cdFRvdWNoU2Nyb2xsZXIsXHJcblx0ZmxvYXQyNHRvMTJNb2RUaW1lXHJcbn07XHJcblxyXG4vKioqKioqIEdsb2JhbCBPYmplY3QgRXh0ZW5kZXJzICoqKioqKioqKioqKiovXHJcbi8vKlxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRXaW5kb3dUb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldFRvcCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dUb3AoKSA6IDApKTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93TGVmdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gKHRoaXMub2Zmc2V0TGVmdCArICgodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd1RvcCA9IGZ1bmN0aW9uKGJvb2wgPSBmYWxzZSl7XHJcbiAgICByZXR1cm4gKCgoYm9vbCA/IHRoaXMub2Zmc2V0VG9wIDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRQYXJlbnRXaW5kb3dUb3AodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudFdpbmRvd0xlZnQgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldExlZnQgOiAwKSkrKCh0aGlzLnBhcmVudEVsZW1lbnQpID8gdGhpcy5wYXJlbnRFbGVtZW50LmdldFdpbmRvd0xlZnQodHJ1ZSkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFN0eWxlID0gZnVuY3Rpb24oc3R5bGVfbmFtZSl7XHJcblx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMsbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZV9uYW1lKTtcclxufVxyXG4vLyovIiwiaW1wb3J0IHsgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9udW1iZXIuanNcIlxyXG5cclxuaW1wb3J0IHsgTGV4IH0gZnJvbSBcIi4uLy4uL2NvbW1vblwiXHJcblxyXG5sZXQgc2NhcGVfZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbnNjYXBlX2RhdGUuc2V0SG91cnMoMCk7XHJcbnNjYXBlX2RhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG5zY2FwZV9kYXRlLnNldFNlY29uZHMoMCk7XHJcbnNjYXBlX2RhdGUuc2V0VGltZSgwKTtcclxuXHJcbmNsYXNzIERhdGVTY2hlbWFDb25zdHJ1Y3RvciBleHRlbmRzIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IGxleCA9IExleCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgIGlmICh5ZWFyKSB7XHJcblxyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldEhvdXJzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFRpbWUoMCk7XHJcblxyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgbW9udGggPSBwYXJzZUludChsZXgudG9rZW4udGV4dCkgLSAxO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0RGF0ZShkYXkpO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KClcclxuXHJcbiAgICAgICAgICAgIGlmIChsZXgudG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxldCBtaW51dGVzID0gcGFyc2VJbnQobGV4LnRva2VuLnRleHQpXHJcblxyXG4gICAgICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRIb3Vycyhob3Vycyk7XHJcbiAgICAgICAgICAgICAgICBzY2FwZV9kYXRlLnNldE1pbnV0ZXMobWludXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzY2FwZV9kYXRlLnZhbHVlT2YoKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpLnZhbHVlT2YoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJzZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIHN1cGVyLnZlcmlmeSh2YWx1ZSwgcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGggPiAxKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoIC0gMTsgaSA8IGw7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gZmlsdGVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBmaWx0ZXJzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0gaWRlbnRpZmllciAmJiBpZGVudGlmaWVyIDw9IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyaW5nKHZhbHVlKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh2YWx1ZSkpICsgXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGRhdGUgPSBuZXcgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yKClcclxuXHJcbmV4cG9ydCB7IGRhdGUsIERhdGVTY2hlbWFDb25zdHJ1Y3RvciB9IiwiaW1wb3J0IHsgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9udW1iZXIuanNcIlxyXG5cclxuY2xhc3MgVGltZVNjaGVtYUNvbnN0cnVjdG9yIGV4dGVuZHMgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3Ige1xyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIGhvdXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdChcIjpcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgbWluID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiIFwiKVswXSk7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gKHZhbHVlLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIiBcIilbMV0udG9Mb3dlclNvdXJjZSgpID09IFwicG1cIik7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaG91ciA9IDA7XHJcbiAgICAgICAgICAgIHZhciBtaW4gPSAwO1xyXG4gICAgICAgICAgICB2YXIgaGFsZiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgoaG91ciArICgoaGFsZikgPyAxMiA6IDApICsgKG1pbiAvIDYwKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgc3VwZXIudmVyaWZ5KHZhbHVlLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmcodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkgKyBcIlwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgdGltZSA9IG5ldyBUaW1lU2NoZW1hQ29uc3RydWN0b3IoKVxyXG5cclxuZXhwb3J0IHsgdGltZSwgVGltZVNjaGVtYUNvbnN0cnVjdG9yIH0iLCJpbXBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi9jb25zdHJ1Y3Rvci5qc1wiXHJcblxyXG5jbGFzcyBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvciBleHRlbmRzIFNjaGVtYUNvbnN0cnVjdG9yIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSBcIlwiXHJcbiAgICB9XHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcmlmeSh2YWx1ZSwgcmVzdWx0KSB7XHJcblxyXG4gICAgICAgIHJlc3VsdC52YWxpZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIubWF0Y2goZmlsdGVyc1tpXSArIFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IHN0cmluZyA9IG5ldyBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvcigpXHJcblxyXG5leHBvcnQgeyBzdHJpbmcsIFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yIH07IiwiaW1wb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vY29uc3RydWN0b3IuanNcIlxyXG5cclxuY2xhc3MgQm9vbFNjaGVtYUNvbnN0cnVjdG9yIGV4dGVuZHMgU2NoZW1hQ29uc3RydWN0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbHVlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pIHtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIiBWYWx1ZSBpcyBub3QgYSBCb29sZWFuLlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBib29sID0gbmV3IEJvb2xTY2hlbWFDb25zdHJ1Y3RvciAoKVxyXG5cclxuZXhwb3J0IHsgYm9vbCwgQm9vbFNjaGVtYUNvbnN0cnVjdG9yIH07IiwiaW1wb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9jb25zdHJ1Y3RvclwiXHJcblxyXG5pbXBvcnQgeyBkYXRlLCBEYXRlU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi90eXBlcy9kYXRlXCJcclxuXHJcbmltcG9ydCB7IHRpbWUsIFRpbWVTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL3R5cGVzL3RpbWVcIlxyXG5cclxuaW1wb3J0IHsgc3RyaW5nLCBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL3R5cGVzL3N0cmluZ1wiXHJcblxyXG5pbXBvcnQgeyBudW1iZXIsIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vdHlwZXMvbnVtYmVyXCJcclxuXHJcbmltcG9ydCB7IGJvb2wsIEJvb2xTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL3R5cGVzL2Jvb2xcIlxyXG5cclxubGV0IHNjaGVtYSA9IHsgZGF0ZSwgc3RyaW5nLCBudW1iZXIsIGJvb2wsIHRpbWUgfVxyXG5cclxuZXhwb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IsIERhdGVTY2hlbWFDb25zdHJ1Y3RvciwgVGltZVNjaGVtYUNvbnN0cnVjdG9yLCBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvciwgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IsIEJvb2xTY2hlbWFDb25zdHJ1Y3Rvciwgc2NoZW1hIH07IiwiZXhwb3J0IGNsYXNzIFZpZXd7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblxyXG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3Rvcigpe1xyXG5cclxuXHRcdGlmKHRoaXMubW9kZWwpXHJcblx0XHRcdHRoaXMubW9kZWwucmVtb3ZlVmlldyh0aGlzKTtcclxuXHR9XHRcclxuXHQvKipcclxuXHRcdENhbGxlZCBhIE1vZGVsIHdoZW4gaXRzIGRhdGEgaGFzIGNoYW5nZWQuXHJcblx0Ki9cclxuXHR1cGRhdGUoZGF0YSl7XHJcblxyXG5cdH1cclxuXHQvKipcclxuXHRcdENhbGxlZCBieSBhIE1vZGVsQ29udGFpbmVyQmFzZSB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gcmVtb3ZlZC5cclxuXHQqL1xyXG5cdHJlbW92ZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRDYWxsZWQgYnkgYSBNb2RlbENvbnRhaW5lckJhc2Ugd2hlbiBhbiBpdGVtIGhhcyBiZWVuIGFkZGVkLlxyXG5cdCovXHJcblx0YWRkZWQoZGF0YSl7XHJcblxyXG5cdH1cclxuXHRzZXRNb2RlbChtb2RlbCl7XHJcblx0fVxyXG5cclxuXHRyZXNldCgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdHVuc2V0TW9kZWwoKXtcclxuXHJcblx0XHR0aGlzLm5leHQgPSBudWxsO1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG59IiwiY29uc3QgY2FsbGVyID0gKHdpbmRvdyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiAoZikgPT4ge1xyXG4gICAgc2V0VGltZW91dChmLCAxKVxyXG59O1xyXG4vKiogXHJcbiAgICBUaGUgU2NoZWR1bGVyIGhhbmRsZXMgdXBkYXRpbmcgb2JqZWN0cy4gSXQgZG9lcyB0aGlzIGJ5IHNwbGl0dGluZyB1cCB1cGRhdGUgY3ljbGVzLCBcclxuICAgIHRvIHJlc3BlY3QgdGhlIGJyb3dzZXIgZXZlbnQgbW9kZWwuIFxyXG5cclxuICAgIElmIGFueSBvYmplY3QgaXMgc2NoZWR1bGVkIHRvIGJlIHVwZGF0ZWQsIGl0IHdpbGwgYmUgYmxvY2tlZCBmcm9tIHNjaGVkdWxpbmcgbW9yZSB1cGRhdGVzIFxyXG4gICAgdW50aWwgaXRzIG93biB1cGRhdGUgbWV0aG9kIGlzIGNhbGxlZC5cclxuKi9cclxuXHJcbmNvbnN0IFNjaGVkdWxlciA9IG5ldyhjbGFzcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlX2EgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZV9xdWV1ZV9iID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9ICgpID0+IHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVfdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVVcGRhdGUob2JqZWN0KSB7XHJcblxyXG4gICAgICAgIGlmIChvYmplY3QuX19fX1NDSEVEVUxFRF9fX18gfHwgIW9iamVjdC51cGRhdGUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19fX1NDSEVEVUxFRF9fX18pXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcblxyXG4gICAgICAgIG9iamVjdC5fX19fU0NIRURVTEVEX19fXyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlLnB1c2gob2JqZWN0KTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9fX19TQ0hFRFVMRURfX19fKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSB0cnVlO1xyXG5cclxuICAgICAgICBjYWxsZXIodGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB1cSA9IHRoaXMudXBkYXRlX3F1ZXVlO1xyXG5cclxuICAgICAgICBpZih0aGlzLnF1ZXVlX3N3aXRjaCA9PSAwKVxyXG4gICAgICAgICAgICAodGhpcy51cGRhdGVfcXVldWUgPSB0aGlzLnVwZGF0ZV9xdWV1ZV9iLCB0aGlzLnF1ZXVlX3N3aXRjaCA9IDEpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgKHRoaXMudXBkYXRlX3F1ZXVlID0gdGhpcy51cGRhdGVfcXVldWVfYSwgdGhpcy5xdWV1ZV9zd2l0Y2ggPSAwKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aW1lIC0gdGhpcy5mcmFtZV90aW1lO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lX3RpbWUgPSB0aW1lO1xyXG5cclxuICAgICAgICBsZXQgc3RlcF9yYXRpbyA9IChkaWZmICogMC4wNik7IC8vICBzdGVwX3JhdGlvIG9mIDEgPSAxNi42NjY2NjY2NiBvciAxMDAwIC8gNjAgZm9yIDYwIEZQU1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHVxLmxlbmd0aCwgbyA9IHVxWzBdOyBpIDwgbDsgbyA9IHVxWysraV0pe1xyXG4gICAgICAgICAgICBvLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG8udXBkYXRlKHN0ZXBfcmF0aW8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXEubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSkoKVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNjaGVkdWxlclxyXG59IiwiaW1wb3J0IHsgVmlldyB9IGZyb20gXCIuLi92aWV3XCJcclxuXHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgTW9kZWwgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18gPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgLy9pbmZvcm0gdmlld3Mgb2YgdGhlIG1vZGVscyBkZW1pc2VcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgd2hpbGUgKHZpZXcpIHtcclxuICAgICAgICAgICAgdmlldy51bnNldE1vZGVsKCk7XHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RoaXMuZmlyc3RfdmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRcclxuICAgICovXHJcbiAgICBzY2hlZHVsZVVwZGF0ZShjaGFuZ2VkX3ZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5maXJzdF92aWV3KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5wdXNoKGNoYW5nZWRfdmFsdWUpO1xyXG5cclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbmdlZChwcm9wX25hbWUpIHtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgaWYgKHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fX1tpXSA9PSBwcm9wX25hbWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1twcm9wX25hbWVdO1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFx0QWRkcyBhIHZpZXcgdG8gdGhlIGxpbmtlZCBsaXN0IG9mIHZpZXdzIG9uIHRoZSBtb2RlbC4gYXJndW1lbnQgdmlldyBNVVNUIGJlIGFuIGluc3RhbmNlIG9mIFZpZXcuIFxyXG4gICAgKi9cclxuICAgIGFkZFZpZXcodmlldykge1xyXG5cclxuICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIFZpZXcpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh2aWV3Lm1vZGVsKVxyXG4gICAgICAgICAgICAgICAgdmlldy5tb2RlbC5yZW1vdmVWaWV3KHZpZXcpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY2hpbGRfdmlldykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2aWV3ID09IGNoaWxkX3ZpZXcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNoaWxkX3ZpZXcgPSBjaGlsZF92aWV3Lm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZpZXcubW9kZWwgPSB0aGlzO1xyXG4gICAgICAgICAgICB2aWV3Lm5leHQgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfdmlldyA9IHZpZXc7XHJcblxyXG4gICAgICAgICAgICB2aWV3LnNldE1vZGVsKHRoaXMpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZSh0aGlzLmdldCgpKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlBhc3NlZCBpbiB2aWV3IGlzIG5vdCBhbiBpbnN0YW5jZSBvZiB3aWNrLlZpZXchXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRSZW1vdmVzIHZpZXcgZnJvbSBzZXQgb2Ygdmlld3MgaWYgdGhlIHBhc3NlZCBpbiB2aWV3IGlzIGEgbWVtYmVyIG9mIG1vZGVsLiBcclxuICAgICovXHJcbiAgICByZW1vdmVWaWV3KHZpZXcpIHtcclxuXHJcbiAgICAgICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBWaWV3ICYmIHZpZXcubW9kZWwgPT0gdGhpcykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoaWxkX3ZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcbiAgICAgICAgICAgIHZhciBwcmV2X2NoaWxkID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjaGlsZF92aWV3KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcgPT0gY2hpbGRfdmlldykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldl9jaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2X2NoaWxkLm5leHQgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF92aWV3ID0gdmlldy5uZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5uZXh0ID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcubW9kZWwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHByZXZfY2hpbGQgPSBjaGlsZF92aWV3O1xyXG4gICAgICAgICAgICAgICAgY2hpbGRfdmlldyA9IGNoaWxkX3ZpZXcubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoc3RlcCkge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdzKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFx0Q2FsbHMgdXBkYXRlKCkgb24gZXZlcnkgdmlldyBvYmplY3QsIHBhc3NpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIE1vZGVsLlxyXG4gICAgKi9cclxuICAgIHVwZGF0ZVZpZXdzKCkge1xyXG5cclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgd2hpbGUgKHZpZXcpIHtcclxuXHJcbiAgICAgICAgICAgIHZpZXcudXBkYXRlKHRoaXMsIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyk7XHJcblxyXG4gICAgICAgICAgICB2aWV3ID0gdmlldy5uZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcdFVwZGF0ZXMgdmlld3Mgd2l0aCBhIGxpc3Qgb2YgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuIFxyXG4gICAgXHRQcmltYXJpbHkgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGNvbnRhaW5lciBiYXNlZCB2aWV3cywgc3VjaCBhcyBTb3VyY2VUZW1wbGF0ZXMuXHJcbiAgICAqL1xyXG4gICAgdXBkYXRlVmlld3NSZW1vdmVkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG4gICAgICAgIHdoaWxlICh2aWV3KSB7XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlbW92ZWQoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICB2aWV3ID0gdmlldy5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFx0VXBkYXRlcyB2aWV3cyB3aXRoIGEgbGlzdCBvZiBtb2RlbHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQuIFxyXG4gICAgXHRQcmltYXJpbHkgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGNvbnRhaW5lciBiYXNlZCB2aWV3cywgc3VjaCBhcyBTb3VyY2VUZW1wbGF0ZXMuXHJcbiAgICAqL1xyXG4gICAgdXBkYXRlVmlld3NBZGRlZChkYXRhKSB7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuICAgICAgICB3aGlsZSAodmlldykge1xyXG5cclxuICAgICAgICAgICAgdmlldy5hZGRlZChkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvSnNvbigpIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgJ1xcdCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kZWxCYXNlLnByb3RvdHlwZSwgXCJmaXJzdF92aWV3XCIsIHtcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG59KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE1vZGVsQmFzZS5wcm90b3R5cGUsIFwiX19fX2NoYW5nZWRfdmFsdWVzX19fX1wiLCB7XHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxufSlcclxuXHJcbk9iamVjdC5zZWFsKE1vZGVsQmFzZS5wcm90b3R5cGUpOyIsImltcG9ydCB7IE1vZGVsQmFzZSB9IGZyb20gXCIuLi9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7IFNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4uLy4uL3NjaGVtYS9jb25zdHJ1Y3RvclwiXHJcblxyXG4vKiogQG5hbWVzcGFjZSBNb2RlbCAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIE1DQXJyYXkgZXh0ZW5kcyBBcnJheSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICBpdGVtLmZvckVhY2goKGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaChpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3VwZXIucHVzaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0ZvciBjb21wYXRpYmlsaXR5XHJcbiAgICBfX3NldEZpbHRlcnNfXygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhbmdlZCgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSnNvbigpIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgJ1xcdCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBBIFwibnVsbFwiIGZ1bmN0aW9uXHJcbmxldCBFbXB0eUZ1bmN0aW9uID0gKCkgPT4ge307XHJcbmxldCBFbXB0eUFycmF5ID0gW107XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWxDb250YWluZXJCYXNlIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy9Gb3IgTGlua2luZyB0byBvcmlnaW5hbCBcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maXJzdF9saW5rID0gbnVsbDtcclxuICAgICAgICB0aGlzLm5leHQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucHJldiA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vRm9yIGtlZXBpbmcgdGhlIGNvbnRhaW5lciBmcm9tIGF1dG9tYXRpYyBkZWxldGlvbi5cclxuICAgICAgICB0aGlzLnBpbiA9IEVtcHR5RnVuY3Rpb247XHJcblxyXG4gICAgICAgIC8vRmlsdGVycyBhcmUgYSBzZXJpZXMgb2Ygc3RyaW5ncyBvciBudW1iZXIgc2VsZWN0b3JzIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGEgbW9kZWwgc2hvdWxkIGJlIGluc2VydGVkIGludG8gb3IgcmV0cmlldmVkIGZyb20gdGhlIGNvbnRhaW5lci5cclxuICAgICAgICB0aGlzLl9fZmlsdGVyc19fID0gRW1wdHlBcnJheTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfHwgdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWEgfHwge307XHJcblxyXG4gICAgICAgIC8vVGhlIHBhcnNlciB3aWxsIGhhbmRsZSB0aGUgZXZhbHVhdGlvbiBvZiBpZGVudGlmaWVycyBhY2NvcmRpbmcgdG8gdGhlIGNyaXRlcmlhIHNldCBieSB0aGUgX19maWx0ZXJzX18gbGlzdC4gXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLnBhcnNlciAmJiB0aGlzLnNjaGVtYS5wYXJzZXIgaW5zdGFuY2VvZiBTY2hlbWFDb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSB0aGlzLnNjaGVtYS5wYXJzZXJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VyID0gbmV3IFNjaGVtYUNvbnN0cnVjdG9yKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmlkID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIgJiYgdHlwZW9mKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIpID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnNjaGVtYS5pZGVudGlmaWVyO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0aHJvdyAoYFdyb25nIHNjaGVtYSBpZGVudGlmaWVyIHR5cGUgZ2l2ZW4gdG8gTW9kZWxDb250YWluZXJCYXNlLiBFeHBlY3RlZCB0eXBlIFN0cmluZywgZ290OiAke3R5cGVvZih0aGlzLnNjaGVtYS5pZGVudGlmaWVyKX0hYCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGdldDogKG9iaiwgcHJvcCwgdmFsKSA9PiAocHJvcCBpbiBvYmopID8gb2JqW3Byb3BdIDogb2JqLmdldCh2YWwpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2UuX191bmxpbmtfXyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHZXQgdGhlIG51bWJlciBvZiBNb2RlbHMgaGVsZCBpbiB0aGlzIE1vZGVsQ29udGFpbmVyQmFzZVxyXG5cclxuICAgICAgICBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgKi9cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxlbmd0aChlKSB7XHJcbiAgICAgICAgLy9OVUxMIGZ1bmN0aW9uLiBEbyBOb3QgT3ZlcnJpZGUhXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICAgIFJldHVybnMgYSBNb2RlbENvbnRhaW5lckJhc2UgdHlwZSB0byBzdG9yZSB0aGUgcmVzdWx0cyBvZiBhIGdldCgpLlxyXG4gICAgKi9cclxuICAgIF9fZGVmYXVsdFJldHVybl9fKFVTRV9BUlJBWSkge1xyXG4gICAgICAgIGlmIChVU0VfQVJSQVkpIHJldHVybiBuZXcgTUNBcnJheTtcclxuXHJcbiAgICAgICAgbGV0IG4gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMuX19saW5rX18obik7XHJcblxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFycmF5IGVtdWxhdGluZyBrbHVkZ2VcclxuXHJcbiAgICAgICAgQHJldHVybnMgVGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoaXMuaW5zZXJ0XHJcbiAgICAqL1xyXG4gICAgcHVzaChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGl0ZW0sIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHJpZXZlcyBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBtYXRjaCB0aGUgdGVybS90ZXJtcy4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7KEFycmF5fFNlYXJjaFRlcm0pfSB0ZXJtIC0gQSBzaW5nbGUgdGVybSBvciBhIHNldCBvZiB0ZXJtcyB0byBsb29rIGZvciBpbiB0aGUgTW9kZWxDb250YWluZXJCYXNlLiBcclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBfX3JldHVybl9kYXRhX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7KE1vZGVsQ29udGFpbmVyQmFzZXxBcnJheSl9IFJldHVybnMgYSBNb2RlbCBjb250YWluZXIgb3IgYW4gQXJyYXkgb2YgTW9kZWxzIG1hdGNoaW5nIHRoZSBzZWFyY2ggdGVybXMuIFxyXG4gICAgKi9cclxuICAgIGdldCh0ZXJtLCBfX3JldHVybl9kYXRhX18pIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBVU0VfQVJSQVkgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGVybSkge1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKF9fcmV0dXJuX2RhdGFfXykge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfX3JldHVybl9kYXRhX18gPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgVVNFX0FSUkFZID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvdXJjZSlcclxuICAgICAgICAgICAgICAgICAgICBVU0VfQVJSQVkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0aGlzLl9fZGVmYXVsdFJldHVybl9fKFVTRV9BUlJBWSk7XHJcbiAgICAgICAgICAgICAgICBvdXQuX19zZXRGaWx0ZXJzX18odGVybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgb3V0ID0gKF9fcmV0dXJuX2RhdGFfXykgPyBfX3JldHVybl9kYXRhX18gOiB0aGlzLl9fZGVmYXVsdFJldHVybl9fKFVTRV9BUlJBWSk7XHJcblxyXG4gICAgICAgIGlmICghdGVybSlcclxuICAgICAgICAgICAgdGhpcy5fX2dldEFsbF9fKG91dCk7XHJcbiAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGVybXMgPSB0ZXJtO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXJtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuXHJcbiAgICAgICAgICAgIC8vTmVlZCB0byBjb252ZXJ0IHRlcm1zIGludG8gYSBmb3JtIHRoYXQgd2lsbCB3b3JrIGZvciB0aGUgaWRlbnRpZmllciB0eXBlXHJcbiAgICAgICAgICAgIHRlcm1zID0gdGVybXMubWFwKHQgPT4gdGhpcy5wYXJzZXIucGFyc2UodCkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRfXyh0ZXJtcywgb3V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBJbnNlcnRzIGFuIGl0ZW0gaW50byB0aGUgY29udGFpbmVyLiBJZiB0aGUgaXRlbSBpcyBub3QgYSB7TW9kZWx9LCBhbiBhdHRlbXB0IHdpbGwgYmUgbWFkZSB0byBjb252ZXJ0IHRoZSBkYXRhIGluIHRoZSBPYmplY3QgaW50byBhIE1vZGVsLlxyXG4gICAgICAgIElmIHRoZSBpdGVtIGlzIGFuIGFycmF5IG9mIG9iamVjdHMsIGVhY2ggb2JqZWN0IGluIHRoZSBhcnJheSB3aWxsIGJlIGNvbnNpZGVyZWQgc2VwYXJhdGVseS4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7T2JqZWN0fSBpdGVtIC0gQW4gT2JqZWN0IHRvIGluc2VydCBpbnRvIHRoZSBjb250YWluZXIuIE9uIG9mIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgTVVTVCBoYXZlIHRoZSBzYW1lIG5hbWUgYXMgdGhlIE1vZGVsQ29udGFpbmVyQmFzZSdzIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW0gLSBBbiBhcnJheSBvZiBPYmplY3RzIHRvIGluc2VydCBpbnRvIHRoZSBjb250YWluZXIuXHJcbiAgICAgICAgQHBhcmFtIHtCb29sZWFufSBfX0ZST01fU09VUkNFX18gLSBTZXQgdG8gdHJ1ZSBieSBhIHNvdXJjZSBDb250YWluZXIgaWYgaXQgaXMgY2FsbGluZyBhIFN1YkNvbnRhaW5lciBpbnNlcnQgZnVuY3Rpb24uIFxyXG5cclxuICAgICAgICBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFuIGluc2VydGlvbiBpbnRvIHRoZSBNb2RlbENvbnRhaW5lckJhc2Ugb2NjdXJyZWQsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBpbnNlcnQoaXRlbSwgX19GUk9NX1NPVVJDRV9fID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgbGV0IGFkZF9saXN0ID0gKHRoaXMuZmlyc3RfdmlldykgPyBbXSA6IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCFfX0ZST01fU09VUkNFX18gJiYgdGhpcy5zb3VyY2UpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5pbnNlcnQoaXRlbSk7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19pbnNlcnRTdWJfXyhpdGVtW2ldLCBvdXQsIGFkZF9saXN0KSlcclxuICAgICAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbSlcclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGFkZF9saXN0ICYmIGFkZF9saXN0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NBZGRlZChhZGRfbGlzdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQSBzdWJzZXQgb2YgdGhlIGluc2VydCBmdW5jdGlvbi4gSGFuZGxlcyB0aGUgdGVzdCBvZiBpZGVudGlmaWVyLCB0aGUgY29udmVyc2lvbiBvZiBhbiBPYmplY3QgaW50byBhIE1vZGVsLCBhbmQgdGhlIGNhbGxpbmcgb2YgdGhlIGludGVybmFsIF9faW5zZXJ0X18gZnVuY3Rpb24uXHJcbiAgICAqL1xyXG4gICAgX19pbnNlcnRTdWJfXyhpdGVtLCBvdXQsIGFkZF9saXN0KSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCA9IGl0ZW07XHJcblxyXG4gICAgICAgIHZhciBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGlkZW50aWZpZXIgIT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIShtb2RlbCBpbnN0YW5jZW9mIHRoaXMuc2NoZW1hLm1vZGVsKSAmJiAhKG1vZGVsID0gbW9kZWwuX19fX3NlbGZfX19fKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEubW9kZWwoKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18obW9kZWwsIHRoaXMuX19maWx0ZXJzX18pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fbGlua3NJbnNlcnRfXyhtb2RlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBjb250YWluZXIuIFxyXG4gICAgKi9cclxuICAgIHJlbW92ZSh0ZXJtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSB0ZXJtO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0aGlzLl9fZmlsdGVyc19fKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnJlbW92ZSh0ZXJtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvdXRfY29udGFpbmVyID0gW107XHJcblxyXG4gICAgICAgIGlmICghdGVybSlcclxuICAgICAgICAgICAgdGhpcy5fX3JlbW92ZUFsbF9fKCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGVybSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IFt0ZXJtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtzUmVtb3ZlX18odGVybXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2NvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGEgTW9kZWxDb250YWluZXJCYXNlIGZyb20gbGlzdCBvZiBsaW5rZWQgY29udGFpbmVycy4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7TW9kZWxDb250YWluZXJCYXNlfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXJCYXNlIGluc3RhbmNlIHRvIHJlbW92ZSBmcm9tIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuIE11c3QgYmUgYSBtZW1iZXIgb2YgdGhlIGxpbmtlZCBjb250YWluZXJzLiBcclxuICAgICovXHJcbiAgICBfX3VubGlua19fKGNvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXJCYXNlICYmIGNvbnRhaW5lci5zb3VyY2UgPT0gdGhpcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmZpcnN0X2xpbmspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2xpbmsgPSBjb250YWluZXIubmV4dDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIubmV4dClcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5uZXh0LnByZXYgPSBjb250YWluZXIucHJldjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIucHJldilcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wcmV2Lm5leHQgPSBjb250YWluZXIubmV4dDtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5zb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBZGRzIGEgY29udGFpbmVyIHRvIHRoZSBsaXN0IG9mIHRyYWNrZWQgY29udGFpbmVycy4gXHJcblxyXG4gICAgICAgIEBwYXJhbSB7TW9kZWxDb250YWluZXJCYXNlfSBjb250YWluZXIgLSBUaGUgTW9kZWxDb250YWluZXJCYXNlIGluc3RhbmNlIHRvIGFkZCB0aGUgc2V0IG9mIGxpbmtlZCBjb250YWluZXJzLlxyXG4gICAgKi9cclxuICAgIF9fbGlua19fKGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lckJhc2UgJiYgIWNvbnRhaW5lci5zb3VyY2UpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5zb3VyY2UgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLm5leHQgPSB0aGlzLmZpcnN0X2xpbms7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maXJzdF9saW5rKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdF9saW5rLnByZXYgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpcnN0X2xpbmsgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIucGluID0gKChjb250YWluZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5fX3VubGlua19fKCk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MClcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWluZXIuc291cmNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJmYWlsZWQgdG8gY2xlYXIgdGhlIGRlc3RydWN0aW9uIG9mIGNvbnRhaW5lciBpbiB0aW1lIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoY29udGFpbmVyKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfX2xpbmtzUmVtb3ZlX18odGVybXMpIHtcclxuICAgICAgICBsZXQgYSA9IHRoaXMuZmlyc3RfbGluaztcclxuICAgICAgICB3aGlsZSAoYSkge1xyXG4gICAgICAgICAgICBhLnJlbW92ZSh0ZXJtcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGEgPSBhLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fbGlua3NJbnNlcnRfXyhpdGVtKSB7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmZpcnN0X2xpbms7XHJcbiAgICAgICAgd2hpbGUgKGEpIHtcclxuICAgICAgICAgICAgYS5pbnNlcnQoaXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGEgPSBhLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYW55IGl0ZW1zIGluIHRoZSBtb2RlbCBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5IFwiaXRlbXNcIiwgYW5kIGFkZHMgYW55IGl0ZW1zIGluIGl0ZW1zIG5vdCBhbHJlYWR5IGluIHRoZSBNb2RlbENvbnRhaW5lckJhc2UuXHJcblxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIC0gQW4gYXJyYXkgb2YgaWRlbnRpZmlhYmxlIE1vZGVscyBvciBvYmplY3RzLiBcclxuICAgICovXHJcbiAgICBjdWxsKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGxldCBoYXNoX3RhYmxlID0ge307XHJcbiAgICAgICAgbGV0IGV4aXN0aW5nX2l0ZW1zID0gX19nZXRBbGxfXyhbXSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBsb2FkSGFzaCA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mb3JFYWNoKChlKSA9PiBsb2FkSGFzaChlKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaWRlbnRpZmllciA9IHRoaXMuX19nZXRJZGVudGlmaWVyX18oaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIGhhc2hfdGFibGVbaWRlbnRpZmllcl0gPSBpdGVtO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRIYXNoKGl0ZW1zKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ19pdGVtcy5sZW50aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlX2l0ZW0gPSBleGlzdGluZ19pdGVtc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFleGlzdGluZ19pdGVtc1t0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGVfaXRlbSldKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3JlbW92ZV9fKGVfaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc2VydChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgX19zZXRGaWx0ZXJzX18odGVybSkge1xyXG4gICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSB0aGlzLl9fZmlsdGVyc19fLmNvbmNhdCh0ZXJtLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX19maWx0ZXJzX18ucHVzaCh0aGlzLnBhcnNlci5wYXJzZSh0ZXJtKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdHJ1ZSBpZiB0aGUgaWRlbnRpZmllciBtYXRjaGVzIGEgcHJlZGVmaW5lZCBmaWx0ZXIgcGF0dGVybiwgd2hpY2ggaXMgZXZhbHVhdGVkIGJ5IHRoaXMucGFyc2VyLiBJZiBhIFxyXG4gICAgICAgIHBhcnNlciB3YXMgbm90IHByZXNlbnQgdGhlIE1vZGVsQ29udGFpbmVycyBzY2hlbWEsIHRoZW4gdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRydWUgdXBvbiBldmVyeSBldmFsdWF0aW9uLlxyXG4gICAgKi9cclxuICAgIF9fZmlsdGVySWRlbnRpZmllcl9fKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5maWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgdGhlIElkZW50aWZpZXIgcHJvcGVydHkgdmFsdWUgaWYgaXQgZXhpc3RzIGluIHRoZSBpdGVtLiBJZiBhbiBhcnJheSB2YWx1ZSBmb3IgZmlsdGVycyBpcyBwYXNzZWQsIHRoZW4gdW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIHRoZSBpZGVudGlmaWVyIHZhbHVlIGRvZXMgbm90IHBhc3MgZmlsdGVyaW5nIGNyaXRlcmlhLlxyXG4gICAgICAgIEBwYXJhbSB7KE9iamVjdHxNb2RlbCl9IGl0ZW1cclxuICAgICAgICBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzIC0gQW4gYXJyYXkgb2YgZmlsdGVyIHRlcm1zIHRvIHRlc3Qgd2hldGhlciB0aGUgaWRlbnRpZmllciBtZWV0cyB0aGUgY3JpdGVyaWEgdG8gYmUgaGFuZGxlZCBieSB0aGUgTW9kZWxDb250YWluZXJCYXNlLlxyXG4gICAgKi9cclxuICAgIF9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0sIGZpbHRlcnMgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIGxldCBpZGVudGlmaWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpdGVtKSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gaXRlbVt0aGlzLnNjaGVtYS5pZGVudGlmaWVyXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllcilcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMucGFyc2VyLnBhcnNlKGlkZW50aWZpZXIpO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVycyAmJiBpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX19maWx0ZXJJZGVudGlmaWVyX18oaWRlbnRpZmllciwgZmlsdGVycykpID8gaWRlbnRpZmllciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlkZW50aWZpZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICAgIE9WRVJSSURFIFNFQ1RJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICBcclxuICAgICAgICBBbGwgb2YgdGhlc2UgZnVuY3Rpb25zIHNob3VsZCBiZSBvdmVycmlkZGVuIGJ5IGluaGVyaXRpbmcgY2xhc3Nlc1xyXG4gICAgKi9cclxuXHJcbiAgICBfX2luc2VydF9fKGl0ZW0sIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18oaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEFsbF9fKF9fcmV0dXJuX2RhdGFfXykge1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVORCBPVkVSUklERSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG59XHJcbiIsImltcG9ydCB7IE1vZGVsQ29udGFpbmVyQmFzZSwgTUNBcnJheSB9IGZyb20gXCIuL2Jhc2VcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgTW9kZWwgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBNdWx0aUluZGV4ZWRDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lckJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiaW5kZXhlZFwiLFxyXG4gICAgICAgICAgICBtb2RlbDogc2NoZW1hLm1vZGVsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xyXG4gICAgICAgIHRoaXMuaW5kZXhlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEluZGV4KHNjaGVtYS5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCBpbmRleCBpbiB0aGlzIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maXJzdF9pbmRleC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0IGEgbmV3IE1vZGVsQ29udGFpbmVyQmFzZSBpbnRvIHRoZSBpbmRleCB0aHJvdWdoIHRoZSBzY2hlbWEuICBcclxuICAgICovXHJcbiAgICBhZGRJbmRleChpbmRleF9zY2hlbWEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpbmRleF9zY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IHNjaGVtZSA9IGluZGV4X3NjaGVtYVtuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hlbWUuY29udGFpbmVyICYmICF0aGlzLmluZGV4ZXNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXSA9IG5ldyBzY2hlbWUuY29udGFpbmVyKHNjaGVtZS5zY2hlbWEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2luZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tuYW1lXS5pbnNlcnQodGhpcy5maXJzdF9pbmRleC5fX2dldEFsbF9fKCkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGl0ZW0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcblxyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W25hbWVdID0gdGhpcy5pbmRleGVzW25hbWVdLmdldChpdGVtW25hbWVdLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIH0gZWxzZVxyXG5cclxuICAgICAgICAgICAgb3V0ID0gdGhpcy5maXJzdF9pbmRleC5nZXQobnVsbCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShpdGVtKSB7XHJcblxyXG4gICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiBpdGVtKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleGVzW2FdKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gb3V0LmNvbmNhdCh0aGlzLmluZGV4ZXNbYV0ucmVtb3ZlKGl0ZW1bYV0pKTtcclxuXHJcbiAgICAgICAgLyogUmVwbGF5IGl0ZW1zIGFnYWluc3QgaW5kZXhlcyB0byBpbnN1cmUgYWxsIGl0ZW1zIGhhdmUgYmVlbiByZW1vdmVkIGZyb20gYWxsIGluZGV4ZXMgKi9cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmluZGV4ZXMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2pdLnJlbW92ZShvdXRbaV0pO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSBhbGwgdmlld3NcclxuICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3NSZW1vdmVkKG91dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXguaW5zZXJ0KG1vZGVsKSlcclxuICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vZWxzZVxyXG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLndhcm4oYEluZGV4ZWQgY29udGFpbmVyICR7YX0gJHtpbmRleH0gZmFpbGVkIHRvIGluc2VydDpgLCBtb2RlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3V0KVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdzKHRoaXMuZmlyc3RfaW5kZXguZ2V0KCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19yZW1vdmVfXyhpdGVtKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleGVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXgucmVtb3ZlKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXguX19yZW1vdmVBbGxfXygpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIE92ZXJyaWRlcyBNb2RlbCBjb250YWluZXIgZGVmYXVsdCBfX2dldElkZW50aWZpZXJfXyB0byBmb3JjZSBpdGVtIHRvIHBhc3MuXHJcbiAgICAgICAgQHByaXZhdGUgXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiW11cIjtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1vZGVsQ29udGFpbmVyQmFzZSwgTUNBcnJheSB9IGZyb20gXCIuL2Jhc2VcIlxyXG5cclxuLyoqXHJcbiAgICBTdG9yZXMgbW9kZWxzIGluIHJhbmRvbSBvcmRlciBpbnNpZGUgYW4gaW50ZXJuYWwgYXJyYXkgb2JqZWN0LiBcclxuICovXHJcbiBcclxuZXhwb3J0IGNsYXNzIEFycmF5TW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lckJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgX19kZWZhdWx0UmV0dXJuX18oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSByZXR1cm4gbmV3IE1DQXJyYXk7XHJcblxyXG4gICAgICAgIGxldCBuID0gbmV3IEFycmF5TW9kZWxDb250YWluZXIodGhpcy5zY2hlbWEpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGlua19fKG4pO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmopID09IGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBvYmouYWRkKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vTW9kZWwgbm90IGFkZGVkIHRvIENvbnRhaW5lci4gTW9kZWwganVzdCB1cGRhdGVkLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRhdGEucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBNb2RlbCBhZGRlZCB0byBDb250YWluZXIuXHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyh0ZXJtLCByZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICBsZXQgdGVybXMgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGVybSlcclxuICAgICAgICAgICAgaWYgKHRlcm0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGVybXMgPSB0ZXJtO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2dldElkZW50aWZpZXJfXyhvYmosIHRlcm1zKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX2RhdGEucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0dXJuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRBbGxfXyhyZXR1cm5fZGF0YSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaCgobSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5fZGF0YS5wdXNoKG0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHJldHVybl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlQWxsX18oKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhLm1hcChkID0+IGQpIHx8IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybSwgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKG9iaiwgdGVybSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShBcnJheU1vZGVsQ29udGFpbmVyKSIsImltcG9ydCB7IE1vZGVsQ29udGFpbmVyQmFzZSwgTUNBcnJheSB9IGZyb20gXCIuL2Jhc2VcIlxyXG5cclxuaW1wb3J0IHsgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vLi4vc2NoZW1hL3NjaGVtYXNcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgTW9kZWwgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBCVHJlZU1vZGVsQ29udGFpbmVyIGV4dGVuZHMgTW9kZWxDb250YWluZXJCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuXHJcbiAgICAgICAgaWYoIXNjaGVtYSB8fCAhKHNjaGVtYS5wYXJzZXIpIHx8ICAhKHNjaGVtYS5wYXJzZXIgaW5zdGFuY2VvZiBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvcikpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJUcmVlTW9kZWxDb250YWluZXIncyBNVVNUIHVzZSBhIHBhcnNlciBzY2hlbWEgdGhhdCBpcyBvciBpbmhlcml0cyBmcm9tIE51bWJlclR5cGUgc2NoZW1hIGFuZCByZXR1cm5zIG51bWVyaWNhbCB2YWx1ZXMuXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5taW4gPSAxMDtcclxuICAgICAgICB0aGlzLm1heCA9IDIwO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIF9faW5zZXJ0X18obW9kZWwsIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGFkZGVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBuZXcgQnRyZWVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnJvb3QuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCB0aGlzLm1heCwgdHJ1ZSwgcmVzdWx0KS5uZXdub2RlO1xyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QpIGFkZF9saXN0LnB1c2gobW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LmFkZGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNpemUrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5hZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldF9fKHRlcm1zLCBfX3JldHVybl9kYXRhX18pIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1swXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zWzBdKSwgcGFyc2VGbG9hdCh0ZXJtc1sxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRlcm1zLmxlbmd0aCAtIDE7IGkgPiBsOyBpICs9IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmdldChwYXJzZUZsb2F0KHRlcm1zW2ldKSwgcGFyc2VGbG9hdCh0ZXJtc1tpICsgMV0pLCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlX18odGVybXMsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiB0ZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXJtcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1swXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gby5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlcm1zLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5yb290LnJlbW92ZSh0ZXJtc1swXSwgdGVybXNbMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG8ub3V0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290ID0gby5vdXRfbm9kZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGVybXMubGVuZ3RoIC0gMTsgaSA+IGw7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5yb290LnJlbW92ZSh0ZXJtc1tpXSwgdGVybXNbaSArIDFdLCB0cnVlLCB0aGlzLm1pbiwgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gby5vdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290ID0gby5vdXRfbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zaXplIC09IHJlc3VsdDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEFsbF9fKF9fcmV0dXJuX2RhdGFfXykge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5nZXQoLUluZmluaXR5LCBJbmZpbml0eSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVtb3ZlQWxsX18oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdClcclxuICAgICAgICAgICAgdGhpcy5yb290LmRlc3RydWN0b3IoKTtcclxuICAgICAgICB0aGlzLnJvb3QgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICBsZXQgb3V0X2RhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290LmdldCgtSW5maW5pdHksIEluZmluaXR5LCBvdXRfZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEJ0cmVlTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihJU19MRUFGID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLkxFQUYgPSBJU19MRUFGO1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmtleXMgPSBbXTtcclxuICAgICAgICB0aGlzLml0ZW1zID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmtleXMgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBiYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAodGhpcy5rZXlzLmxlbmd0aCA+PSBtYXhfc2l6ZSkge1xyXG4gICAgICAgICAgICAvL25lZWQgdG8gc3BsaXQgdGhpcyB1cCFcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdub2RlID0gbmV3IEJ0cmVlTm9kZSh0aGlzLkxFQUYpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwbGl0ID0gKG1heF9zaXplID4+IDEpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbc3BsaXRdO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxlZnRfa2V5cyA9IHRoaXMua2V5cy5zbGljZSgwLCBzcGxpdCk7XHJcbiAgICAgICAgICAgIGxldCBsZWZ0X25vZGVzID0gdGhpcy5ub2Rlcy5zbGljZSgwLCAodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKVxyXG5cclxuICAgICAgICAgICAgbGV0IHJpZ2h0X2tleXMgPSB0aGlzLmtleXMuc2xpY2UoKHRoaXMuTEVBRikgPyBzcGxpdCA6IHNwbGl0ICsgMSk7XHJcbiAgICAgICAgICAgIGxldCByaWdodF9ub2RlcyA9IHRoaXMubm9kZXMuc2xpY2UoKHRoaXMuTEVBRikgPyBzcGxpdCA6IHNwbGl0ICsgMSk7XHJcblxyXG4gICAgICAgICAgICBuZXdub2RlLmtleXMgPSByaWdodF9rZXlzO1xyXG4gICAgICAgICAgICBuZXdub2RlLm5vZGVzID0gcmlnaHRfbm9kZXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXMgPSBsZWZ0X2tleXM7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXMgPSBsZWZ0X25vZGVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKElTX1JPT1QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcm9vdCA9IG5ldyBCdHJlZU5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByb290LmtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgcm9vdC5ub2Rlcy5wdXNoKHRoaXMsIG5ld25vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3bm9kZTogcm9vdCxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5ld25vZGU6IG5ld25vZGUsXHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXdub2RlOiB0aGlzLFxyXG4gICAgICAgICAgICBrZXk6IDBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydHMgbW9kZWwgaW50byB0aGUgdHJlZSwgc29ydGVkIGJ5IGlkZW50aWZpZXIuIFxyXG4gICAgKi9cclxuICAgIGluc2VydChpZGVudGlmaWVyLCBtb2RlbCwgbWF4X3NpemUsIElTX1JPT1QgPSBmYWxzZSwgcmVzdWx0KSB7XHJcblxyXG4gICAgICAgIGxldCBsID0gdGhpcy5rZXlzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciA8IGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG8gPSBub2RlLmluc2VydChpZGVudGlmaWVyLCBtb2RlbCwgbWF4X3NpemUsIGZhbHNlLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXlyID0gby5rZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld25vZGUgPSBvLm5ld25vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlyID09IHVuZGVmaW5lZCkgZGVidWdnZXJcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld25vZGUgIT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGksIDAsIGtleXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpICsgMSwgMCwgbmV3bm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHtcclxuICAgICAgICAgICAgICAgIG5ld25vZGUsXHJcbiAgICAgICAgICAgICAgICBrZXlcclxuICAgICAgICAgICAgfSA9IG5vZGUuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgZmFsc2UsIHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoa2V5ID09IHVuZGVmaW5lZCkgZGVidWdnZXJcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdub2RlICE9IG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobmV3bm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyID09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbaV0uYWRkKGtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdub2RlOiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGlkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpZGVudGlmaWVyIDwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMCwgaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaSwgMCwgbW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXMucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQuYWRkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXdub2RlOiB0aGlzLFxyXG4gICAgICAgICAgICBrZXk6IGlkZW50aWZpZXIsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBiYWxhbmNlUmVtb3ZlKGluZGV4LCBtaW5fc2l6ZSkge1xyXG4gICAgICAgIGxldCBsZWZ0ID0gdGhpcy5ub2Rlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgIGxldCByaWdodCA9IHRoaXMubm9kZXNbaW5kZXggKyAxXTtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaW5kZXhdO1xyXG5cclxuICAgICAgICAvL0xlZnQgcm90YXRlXHJcbiAgICAgICAgaWYgKGxlZnQgJiYgbGVmdC5rZXlzLmxlbmd0aCA+IG1pbl9zaXplKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGsgPSBsZWZ0LmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgbG4gPSBsZWZ0Lm5vZGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIG5vZGUua2V5cy51bnNoaWZ0KChub2RlLkxFQUYpID8gbGVmdC5rZXlzW2xrIC0gMV0gOiB0aGlzLmtleXNbaW5kZXggLSAxXSk7XHJcbiAgICAgICAgICAgIG5vZGUubm9kZXMudW5zaGlmdChsZWZ0Lm5vZGVzW2xuIC0gMV0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlzW2luZGV4IC0gMV0gPSBsZWZ0LmtleXNbbGsgLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGxlZnQua2V5cy5sZW5ndGggPSBsayAtIDE7XHJcbiAgICAgICAgICAgIGxlZnQubm9kZXMubGVuZ3RoID0gbG4gLSAxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAvL1JpZ2h0IHJvdGF0ZVxyXG4gICAgICAgICAgICBpZiAocmlnaHQgJiYgcmlnaHQua2V5cy5sZW5ndGggPiBtaW5fc2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIG5vZGUua2V5cy5wdXNoKChub2RlLkxFQUYpID8gcmlnaHQua2V5c1swXSA6IHRoaXMua2V5c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5ub2Rlcy5wdXNoKHJpZ2h0Lm5vZGVzWzBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICByaWdodC5rZXlzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIHJpZ2h0Lm5vZGVzLnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaW5kZXhdID0gKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzFdIDogcmlnaHQua2V5c1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vTGVmdCBvciBSaWdodCBNZXJnZVxyXG4gICAgICAgICAgICAgICAgaWYgKCFsZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxlZnQubm9kZXMgPSBsZWZ0Lm5vZGVzLmNvbmNhdChub2RlLm5vZGVzKTtcclxuICAgICAgICAgICAgICAgIGlmICghbGVmdC5MRUFGKSBsZWZ0LmtleXMucHVzaChrZXkpXHJcbiAgICAgICAgICAgICAgICBsZWZ0LmtleXMgPSBsZWZ0LmtleXMuY29uY2F0KG5vZGUua2V5cyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0LkxFQUYpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0LmtleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0LmtleXNbaV0gIT0gbGVmdC5ub2Rlc1tpXS5pZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShzdGFydCwgZW5kLCBJU19ST09UID0gZmFsc2UsIG1pbl9zaXplLCBvdXRfY29udGFpbmVyKSB7XHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmtleXMubGVuZ3RoLFxyXG4gICAgICAgICAgICBvdXQgPSAwLFxyXG4gICAgICAgICAgICBvdXRfbm9kZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGtleSlcclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5ub2Rlc1tpXS5yZW1vdmUoc3RhcnQsIGVuZCwgZmFsc2UsIG1pbl9zaXplLCBvdXRfY29udGFpbmVyKS5vdXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG91dCArPSB0aGlzLm5vZGVzW2ldLnJlbW92ZShzdGFydCwgZW5kLCBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpLm91dDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZXNbaV0ua2V5cy5sZW5ndGggPCBtaW5fc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJhbGFuY2VSZW1vdmUoaSwgbWluX3NpemUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgICAgIG91dF9ub2RlID0gdGhpcy5ub2Rlc1swXTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5IDw9IGVuZCAmJiBrZXkgPj0gc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRfY29udGFpbmVyLnB1c2godGhpcy5ub2Rlc1tpXSlcclxuICAgICAgICAgICAgICAgICAgICBvdXQrKztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3V0X25vZGUsXHJcbiAgICAgICAgICAgIG91dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHN0YXJ0LCBlbmQsIG91dF9jb250YWluZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKCFzdGFydCB8fCAhZW5kKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5nZXQoc3RhcnQsIGVuZCwgb3V0X2NvbnRhaW5lcilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5nZXQoc3RhcnQsIGVuZCwgb3V0X2NvbnRhaW5lciwgKVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPD0gZW5kICYmIGtleSA+PSBzdGFydClcclxuICAgICAgICAgICAgICAgICAgICBvdXRfY29udGFpbmVyLnB1c2godGhpcy5ub2Rlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoQlRyZWVNb2RlbENvbnRhaW5lcik7IiwiaW1wb3J0IHsgTW9kZWxCYXNlIH0gZnJvbSBcIi4vYmFzZS5qc1wiXHJcblxyXG5pbXBvcnQgeyBNb2RlbENvbnRhaW5lckJhc2UgfSBmcm9tIFwiLi9jb250YWluZXIvYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBNdWx0aUluZGV4ZWRDb250YWluZXIgfSBmcm9tIFwiLi9jb250YWluZXIvbXVsdGlcIlxyXG5cclxuaW1wb3J0IHsgQXJyYXlNb2RlbENvbnRhaW5lciB9IGZyb20gXCIuL2NvbnRhaW5lci9hcnJheVwiXHJcblxyXG5pbXBvcnQgeyBCVHJlZU1vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4vY29udGFpbmVyL2J0cmVlXCJcclxuXHJcbmltcG9ydCB7IFNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gXCIuLi9zY2hlZHVsZXJcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgTW9kZWwgKi9cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIG5vbi1Nb2RlbENvbnRhaW5lckJhc2UgYW5kIG5vbi1Nb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcbmZ1bmN0aW9uIENyZWF0ZVNjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGlmIChjb25zdHJ1Y3Rvci5wcm90b3R5cGVbc2NoZW1hX25hbWVdKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICBsZXQgX19zaGFkb3dfbmFtZV9fID0gYF9fJHtzY2hlbWFfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsdWU6IHNjaGVtZS5zdGFydF92YWx1ZSB8fCB1bmRlZmluZWRcclxuICAgIH0pXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsID0gc2NoZW1lLnBhcnNlKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHNjaGVtZS52ZXJpZnkodmFsLCByZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC52YWxpZCAmJiB0aGlzW19fc2hhZG93X25hbWVfX10gIT0gdmFsKVxyXG4gICAgICAgICAgICAgICAgKHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IHZhbCwgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIFNjaGVtZWQgTW9kZWxDb250YWluZXJCYXNlIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuZnVuY3Rpb24gQ3JlYXRlTUNTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpIHtcclxuXHJcbiAgICBsZXQgc2NoZW1hID0gc2NoZW1lLnNjaGVtYTtcclxuXHJcbiAgICBsZXQgbWNfY29uc3RydWN0b3IgPSBzY2hlbWUuY29udGFpbmVyO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBfX3NoYWRvd19uYW1lX18sIHtcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbnVsbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzW19fc2hhZG93X25hbWVfX10pXHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSBuZXcgbWNfY29uc3RydWN0b3Ioc2NoZW1lLnNjaGVtYSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IE1DID0gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mKHZhbHVlKSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIE1DID0gbmV3IG1jX2NvbnN0cnVjdG9yKHNjaGVtZS5zY2hlbWEpO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gTUM7XHJcbiAgICAgICAgICAgICAgICBNQy5pbnNlcnQoZGF0YSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgbWNfY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hX25hbWUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIE1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuZnVuY3Rpb24gQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgc2NoZW1lKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbc2NoZW1hX25hbWVdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHt9XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL1RoZSBzY2hlbWEgaXMgc3RvcmVkIGRpcmVjdGx5IG9uIHRoZSBjb25zdHJ1Y3Rvci4gSWYgaXQgaXMgbm90IHRoZXJlLCB0aGVuIGNvbnNpZGVyIHRoaXMgbW9kZWwgdHlwZSB0byBcIkFOWVwiXHJcbiAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xyXG5cclxuICAgICAgICBpZiAoc2NoZW1hKSB7XHJcbiAgICAgICAgICAgIGxldCBfX0ZpbmFsQ29uc3RydWN0b3JfXyA9IHNjaGVtYS5fX0ZpbmFsQ29uc3RydWN0b3JfXztcclxuXHJcbiAgICAgICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XHJcblxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBcInNjaGVtYVwiLCB7XHJcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogc2NoZW1hXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBpZiAoIV9fRmluYWxDb25zdHJ1Y3Rvcl9fKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2hlbWFfbmFtZSBpbiBzY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3NjaGVtYV9uYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWVbMF0gJiYgc2NoZW1lWzBdLmNvbnRhaW5lciAmJiBzY2hlbWVbMF0uc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNQ1NjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lWzBdLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lWzBdIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1vZGVsUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXS5jb25zdHJ1Y3Rvciwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIFNjaGVtYUNvbnN0cnVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgY3JlYXRlIHByb3BlcnR5ICR7c2NoZW1hX25hbWV9LmApXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5zZWFsKGNvbnN0cnVjdG9yKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNjaGVtYSwgXCJfX0ZpbmFsQ29uc3RydWN0b3JfX1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLy9zY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX18gPSBjb25zdHJ1Y3RvcjtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgcHJvY2VzcyBvdmVyIHdpdGggYSBuZXdseSBtaW50ZWQgTW9kZWwgdGhhdCBoYXMgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgU2NoZW1hXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLyogVGhpcyB3aWxsIGJlIGFuIEFOWSBNb2RlbCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFueU1vZGVsKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYWxsIGhlbGQgcmVmZXJlbmNlcyBhbmQgY2FsbHMgdW5zZXRNb2RlbCBvbiBhbGwgbGlzdGVuaW5nIHZpZXdzLlxyXG4gICAgKi9cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZihwcm9wKSA9PSBcIm9iamVjdFwiICYmIHByb3AuZGVzdHJ1Y3RvciBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxyXG4gICAgICAgICAgICAgICAgcHJvcC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXNbYV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIC8vZGVidWdnZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHaXZlbiBhIGtleSwgcmV0dXJucyBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdGF0dXMgb2YgdGhlIHZhbHVlIGNvbnRhaW5lZCwgaWYgaXQgaXMgdmFsaWQgb3Igbm90LCBhY2NvcmRpbmcgdG8gdGhlIHNjaGVtYSBmb3IgdGhhdCBwcm9wZXJ0eS4gXHJcbiAgICAqL1xyXG4gICAgdmVyaWZ5KGtleSkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X2RhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICByZWFzb246IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHRoaXNba2V5XSwgb3V0X2RhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIGEgcGFyc2VkIHZhbHVlIGJhc2VkIG9uIHRoZSBrZXkgXHJcbiAgICAqL1xyXG4gICAgc3RyaW5nKGtleSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgdmFyIHNjaGVtZSA9IHRoaXMuc2NoZW1hW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NoZW1lLnN0cmluZyh0aGlzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEBwYXJhbSBkYXRhIDogQW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5IHZhbHVlIHBhaXJzIHRvIGluc2VydCBpbnRvIHRoZSBtb2RlbC4gXHJcbiAgICAqL1xyXG4gICAgYWRkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSB0aGlzW2FdID0gZGF0YVthXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0KGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSBvdXRfZGF0YVthXSA9IHRoaXNbYV07XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5zY2hlbWE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gc2NoZW1hKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyQmFzZSBhbmQgbm9uLU1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUdlbmVyaWNQcm9wZXJ0eShjb25zdHJ1Y3RvciwgcHJvcF92YWwsIHByb3BfbmFtZSwgbW9kZWwpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3Byb3BfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsOiBwcm9wX3ZhbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCBtb2RlbC5zY2hlZHVsZVVwZGF0ZShwcm9wX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBBbnlNb2RlbFByb3h5U2V0KG9iaiwgcHJvcCwgdmFsKSB7XHJcblxyXG4gICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSA9PSB2YWwpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICBvYmpbcHJvcF0gPSB2YWw7XHJcblxyXG4gICAgb2JqLnNjaGVkdWxlVXBkYXRlKHByb3ApO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQW55TW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcF9uYW1lIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3BfbmFtZV0gPSBkYXRhW3Byb3BfbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgc2V0OiBBbnlNb2RlbFByb3h5U2V0XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBbGlhcyBmb3IgZGVzdHJ1Y3RvclxyXG4gICAgKi9cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG5cclxuICAgICAgICB0aGlzLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGFsbCBoZWxkIHJlZmVyZW5jZXMgYW5kIGNhbGxzIHVuc2V0TW9kZWwgb24gYWxsIGxpc3RlbmluZyB2aWV3cy5cclxuICAgICovXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICB0aGlzW2FdID0gZGF0YVthXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoZGF0YSkge1xyXG5cclxuICAgICAgICB2YXIgb3V0X2RhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzW2FdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRfZGF0YVthXSA9IHByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGl0ZW1zIGluIGNvbnRhaW5lcnMgYmFzZWQgb24gbWF0Y2hpbmcgaW5kZXguXHJcbiAgICAqL1xyXG5cclxuICAgIHJlbW92ZShkYXRhKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3AgPT0gXCJmaXJzdF92aWV3XCIgfHxcclxuICAgICAgICAgICAgICAgIHByb3AgPT0gXCJjaGFuZ2VkX3ZhbHVlc1wiIHx8XHJcbiAgICAgICAgICAgICAgICBwcm9wID09IFwiX19fX1NDSEVEVUxFRF9fX19cIilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pzb25TdHJpbmcoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgKyBcIlwiO1xyXG4gICAgfVxyXG59IiwiY2xhc3MgVHJhbnNpdGlvbmVlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGVsZW1lbnQsIGRhdGEpIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41c1wiO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X2luKGVsZW1lbnQsIGRhdGEsIGluZGV4ID0gMCkge1xyXG4gICAgXHRlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBgb3BhY2l0eSAkezAuOCppbmRleCswLjV9c2A7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9vdXQoZWxlbWVudCwgZGF0YSwgaW5kZXggPSAwKSB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplX291dChlbGVtZW50KSB7XHJcbiAgICBcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSIsImltcG9ydCB7XHJcbiAgICBWaWV3XHJcbn0gZnJvbSBcIi4uL3ZpZXdcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFueU1vZGVsXHJcbn0gZnJvbSBcIi4uL21vZGVsL21vZGVsXCJcclxuXHJcbi8qXHJcbiAgICBUcmFuc2l0aW9uZWVyc1xyXG4qL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSBmcm9tIFwiLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG5sZXQgUHJlc2V0VHJhbnNpdGlvbmVlcnMgPSB7XHJcbiAgICBiYXNlOiBUcmFuc2l0aW9uZWVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTb3VyY2VCYXNlIGV4dGVuZHMgVmlldyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSA9IHt9LCBwcmVzZXRzID0ge30pIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXhwb3J0X3ZhbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuREVTVFJPWUVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0dGluZyB0aGUgdHJhbnNpdGlvbmVyXHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEudHJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJlc2V0cy50cmFuc2l0aW9ucyAmJiBwcmVzZXRzLnRyYW5zaXRpb25zW2RhdGEudHJzXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBwcmVzZXRzLnRyYW5zaXRpb25zW2RhdGEudHJzXSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChQcmVzZXRUcmFuc2l0aW9uZWVyc1tkYXRhLnRyc10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgUHJlc2V0VHJhbnNpdGlvbmVlcnNbZGF0YS50cnNdKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuc2V0KHRoaXMuZWxlbWVudClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkVG9QYXJlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb1BhcmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ERVNUUk9ZRUQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5MT0FERUQpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMudHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ID0gTWF0aC5tYXgodCwgY2hpbGQudHJhbnNpdGlvbk91dCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHQgPiAwKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuZGVzdHJ1Y3RvcigpOyB9LCB0ICogMTAwMCArIDUpXHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IGMuZGVzdHJ1Y3RvcigpKTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1YmJsZUxpbmsobGlua191cmwsIGNoaWxkLCB0cnNfZWxlID0ge30pIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLnRyYW5zaXRpb24pXHJcbiAgICAgICAgICAgICAgICB0cnNfZWxlW3RoaXMuZGF0YS50cmFuc2l0aW9uXSA9IHRoaXMuZWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2ggPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaCAhPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2guZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5idWJibGVMaW5rKGxpbmtfdXJsLCB0aGlzLCB0cnNfZWxlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgbGlua191cmwpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7fVxyXG5cclxuICAgIGdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudHJhbnNpdGlvbiAmJiAhdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0pXHJcbiAgICAgICAgICAgIHRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dID0gdGhpcy5lbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuaXMgPT0gMSlcclxuICAgICAgICAgICAgICAgIGUuZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29weShlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXRfb2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QuZWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW5bdGhpcy5lbGVtZW50XTtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5jaGlsZHJlbiA9IG5ldyBBcnJheSh0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC5jaGlsZHJlbltpXSA9IGNoaWxkLmNvcHkob3V0X29iamVjdC5lbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF9vYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVXJsVXBkYXRlKHd1cmwpIHt9XHJcblxyXG4gICAgZmluYWxpemVUcmFuc2l0aW9uT3V0KCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uZWVyKVxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIuZmluYWxpemVfb3V0KHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAgQHJldHVybnMge251bWJlcn0gVGltZSBpbiBtaWxsaXNlY29uZHMgdGhhdCB0aGUgdHJhbnNpdGlvbiB3aWxsIHRha2UgdG8gY29tcGxldGUuXHJcbiAgICAqL1xyXG4gICAgdHJhbnNpdGlvbkluKGluZGV4ID0gMCkge1xyXG5cclxuICAgICAgICB0aGlzLnNob3coKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuTE9BREVEID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLmNoaWxkcmVuW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uZWVyKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudHJhbnNpdGlvbmVlci5zZXRfaW4odGhpcy5lbGVtZW50LCB0aGlzLmRhdGEsIGluZGV4KSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgVGFrZXMgYXMgYW4gaW5wdXQgYSBsaXN0IG9mIHRyYW5zaXRpb24gb2JqZWN0cyB0aGF0IGNhbiBiZSB1c2VkXHJcbiAgICAqL1xyXG4gICAgdHJhbnNpdGlvbk91dChpbmRleCA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmVlcilcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRyYW5zaXRpb25lZXIuc2V0X291dCh0aGlzLmVsZW1lbnQsIHRoaXMuZGF0YSwgaW5kZXgpKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLmNoaWxkcmVuW2ldLnRyYW5zaXRpb25PdXQoaW5kZXgpKTtcclxuXHJcbiAgICAgICAgaWYgKERFU1RST1kpXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cnVjdG9yKCk7IH0sIHRyYW5zaXRpb25fdGltZSAqIDEwMDApO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURpbWVuc2lvbnMoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGVEaW1lbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIGRvd24gZnJvbSBmdXJ0aGVyIHVwIHRoZSBncmFwaC4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuXHJcbiAgICAgICAgaWYgKHJfdmFsKShkYXRhID0gcl92YWwsIElNUE9SVEVEID0gdHJ1ZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCB1cCBmcm9tIGEgbGVhZi4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX3VwX18oZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KHVwKTtcclxuICAgIH1cclxuXHJcbiAgICB1cChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKVxyXG4gICAgICAgICAgICB0aGlzLl9fdXBfXyhkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlX18oZGF0YSwgRlJPTV9QQVJFTlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgcl9kYXRhID0gdGhpcy51cGRhdGUoZGF0YSwgRlJPTV9QQVJFTlQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fdXBkYXRlX18ocl9kYXRhIHx8IGRhdGEsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIilcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gdGhpcy5kaXNwbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlRXhwb3J0c19fKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEV4cG9ydHNfXyhleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmV4cG9ydF92YWwpXHJcbiAgICAgICAgICAgIGV4cG9ydHNbdGhpcy5kYXRhLmV4cG9ydF0gPSB0aGlzLmV4cG9ydF92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgRXhwb3J0cyBkYXRhIHN0b3JlZCBmcm9tIHVwZGF0ZUV4cG9ydHMoKSBpbnRvIGEgYW4gT2JqZWN0IGV4cG9ydHMgYW5kIGNhbGxzIGl0J3MgcGFyZW50J3MgZXhwb3J0IGZ1bmN0aW9uLCBwYXNzaW5nIGV4cG9ydHNcclxuICAgICovXHJcbiAgICBleHBvcnQgKGV4cG9ydHMgPSBuZXcgQW55TW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmV4cG9ydCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRFeHBvcnRzX18oZXhwb3J0cylcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXBvcnQgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmV4cG9ydChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVFeHBvcnRzKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnQgPSBkYXRhW3RoaXMuZGF0YS5leHBvcnRdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0KHRoaXMubW9kZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuYWRkKVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5hZGQodmFsdWUpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge01vZGVsfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5jbGFzcyBDb250cm9sbGVye1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGRlc3RydWN0b3IoKXtcclxuXHRcdHRoaXMubW9kZWwgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0TW9kZWwobW9kZWwpe1xyXG5cdFx0aWYobW9kZWwgaW5zdGFuY2VvZiBNb2RlbCl7XHJcblx0XHRcdHRoaXMubW9kZWwgPSBtb2RlbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldChkYXRhKXtcclxuXHRcdGlmKHRoaXMubW9kZWwpXHJcblx0XHRcdHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnR7Q29udHJvbGxlcn0iLCJpbXBvcnQge1xyXG4gICAgQ29udHJvbGxlclxyXG59IGZyb20gXCIuL2NvbnRyb2xsZXJcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IEdldHRlclxyXG4gKi9cclxuY2xhc3MgR2V0dGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHByb2Nlc3NfZGF0YSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVybCA9IHByb2Nlc3NfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQocmVxdWVzdF9vYmplY3QsIHN0b3JlX29iamVjdCwgc2VjdXJlID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vaWYodGhpcy5GRVRDSF9JTl9QUk9HUkVTUylcclxuICAgICAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB0aGlzLkZFVENIX0lOX1BST0dSRVNTID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9ICgoc2VjdXJlKSA/IFwiaHR0cHM6Ly9cIiA6IFwiaHR0cDovL1wiKSArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgdGhpcy51cmwgKyAoIChyZXF1ZXN0X29iamVjdCkgPyAoXCI/XCIgKyB0aGlzLl9fcHJvY2Vzc191cmxfXyhyZXF1ZXN0X29iamVjdCkpIDogXCJcIik7XHJcblxyXG4gICAgICAgIHJldHVybiAoKHN0b3JlKSA9PiBmZXRjaCh1cmwsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgKHJlc3BvbnNlLmpzb24oKS50aGVuKChqKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3Byb2Nlc3NfcmVzcG9uc2VfXyhqLCBzdG9yZSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fX3JlamVjdGVkX3JlcG9uc2VfXyhzdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgfSkpIChzdG9yZV9vYmplY3QpXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcmVqZWN0ZWRfcmVwb25zZV9fKHN0b3JlKXtcclxuICAgICAgICBpZihzdG9yZSlcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVucHJvY2Vzc2VkIHN0b3JlZCBkYXRhIGluIGdldHRlci5cIik7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgX19wcm9jZXNzX3Jlc3BvbnNlX18oanNvbiwgc3RvcmUpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5ydXJsICYmIGpzb24pe1xyXG4gICAgICAgICAgICB2YXIgd2F0Y2hfcG9pbnRzID0gdGhpcy5ydXJsLnNwbGl0KFwiPFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB3YXRjaF9wb2ludHMubGVuZ3RoICYmIGpzb247IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBqc29uID0ganNvbltwYXJzZUludCh3YXRjaF9wb2ludHNbaV0pP3BhcnNlSW50KHdhdGNoX3BvaW50c1tpXSk6d2F0Y2hfcG9pbnRzW2ldXTtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvblwiLCBqc29uKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge31cclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHJlc3BvbnNlLnRhcmdldDtcclxuXHJcbiAgICAgICAgLy9yZXN1bHQocmVxdWVzdCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKXtcclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24sIHN0b3JlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBHZXR0ZXJcclxufVxyXG4iLCIvKipcclxuICpcdENvbnZlcnRzIGxpbmtzIGludG8gSmF2YWNyaXB0IGVuYWJsZWQgYnV0dG9ucyB0aGF0IHdpbGwgYmUgaGFuZGxlZCB3aXRoaW4gdGhlIGN1cnJlbnQgQWN0aXZlIHBhZ2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBQYXJlbnQgRWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSA8YT4gZWxlbWVudHMgdG8gYmUgZXZhdWxhdGVkIGJ5IGZ1bmN0aW9uLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBfX2Z1bmN0aW9uX18gLSBBIGZ1bmN0aW9uIHRoZSBsaW5rIHdpbGwgY2FsbCB3aGVuIGl0IGlzIGNsaWNrZWQgYnkgdXNlci4gSWYgaXQgcmV0dXJucyBmYWxzZSwgdGhlIGxpbmsgd2lsbCBhY3QgbGlrZSBhIG5vcm1hbCA8YT4gZWxlbWVudCBhbmQgY2F1c2UgdGhlIGJyb3dzZXIgdG8gbmF2aWdhdGUgdG8gdGhlIFwiaHJlZlwiIHZhbHVlLlxyXG4gKlxyXG4gKiBJZiB0aGUgPGE+IGVsZW1lbnQgaGFzIGEgZGF0YS1pZ25vcmVfbGluayBhdHRyaWJ1dGUgc2V0IHRvIGEgdHJ1dGh5IHZhbHVlLCB0aGVuIHRoaXMgZnVuY3Rpb24gd2lsbCBub3QgY2hhbmdlIHRoZSB3YXkgdGhhdCBsaW5rIG9wZXJhdGVzLlxyXG4gKiBMaWtld2lzZSwgaWYgdGhlIDxhPiBlbGVtZW50IGhhcyBhIGhyZWYgdGhhdCBwb2ludHMgYW5vdGhlciBkb21haW4sIHRoZW4gdGhlIGxpbmsgd2lsbCByZW1haW4gdW5hZmZlY3RlZC5cclxuICovXHJcbmZ1bmN0aW9uIHNldExpbmtzKGVsZW1lbnQsIF9fZnVuY3Rpb25fXykge1xyXG4gICAgbGV0IGxpbmtzID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpbmtzLmxlbmd0aCwgdGVtcCwgaHJlZjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGxldCB0ZW1wID0gbGlua3NbaV07XHJcblxyXG4gICAgICAgIGlmICh0ZW1wLmRhdGFzZXQuaWdub3JlX2xpbmspIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAodGVtcC5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmICghdGVtcC5vbmNsaWNrKSB0ZW1wLm9uY2xpY2sgPSAoKGhyZWYsIGEsIF9fZnVuY3Rpb25fXykgPT4gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoX19mdW5jdGlvbl9fKGhyZWYsIGEpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkodGVtcC5ocmVmLCB0ZW1wLCBfX2Z1bmN0aW9uX18pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtzZXRMaW5rc31cclxuIiwiaW1wb3J0IHsgc2V0TGlua3MgfSBmcm9tIFwiLi4vLi4vcm91dGVyL3NldGxpbmtzXCJcclxuXHJcbmltcG9ydCB7IExleCB9IGZyb20gXCIuLi8uLi9jb21tb25cIlxyXG5cclxuaW1wb3J0IHsgU291cmNlQmFzZSB9IGZyb20gXCIuLi9iYXNlXCJcclxuXHJcbi8qKlxyXG4gICAgRGVhbHMgd2l0aCBzcGVjaWZpYyBwcm9wZXJ0aWVzIG9uIGEgbW9kZWwuIFxyXG4qL1xyXG5leHBvcnQgY2xhc3MgQ2Fzc2V0dGUgZXh0ZW5kcyBTb3VyY2VCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgcHJlc2V0cywgZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIHByZXNldHMsIGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudG9wID0gMDtcclxuICAgICAgICB0aGlzLmxlZnQgPSAwO1xyXG4gICAgICAgIHRoaXMubHZsID0gMDtcclxuICAgICAgICB0aGlzLmlzID0gMTtcclxuICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaW5rKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lMaW5rKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUaGlzIHdpbGwgYXR0YWNoIGEgZnVuY3Rpb24gdG8gdGhlIGxpbmsgZWxlbWVudCB0byBpbnRlcmNlcHQgYW5kIHByb2Nlc3MgZGF0YSBmcm9tIHRoZSBjYXNzZXR0ZS5cclxuICAgICovXHJcbiAgICBwcm9jZXNzTGluayhlbGVtZW50LCBsaW5rKSB7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50Lm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudC5vbmNsaWNrKSBlbGVtZW50Lm9uY2xpY2sgPSAoKGhyZWYsIGEsIF9fZnVuY3Rpb25fXykgPT4gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoX19mdW5jdGlvbl9fKGhyZWYsIGEpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkoZWxlbWVudC5ocmVmLCBlbGVtZW50LCAoaHJlZiwgYSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IFNBTUVfTE9DQUxFID0gKGxvY2F0aW9uLnBhdGhuYW1lID09IGEucGF0aG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhhc2h0YWcgPSBocmVmLmluY2x1ZGVzKFwiI1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgPT0gXCJ7XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhhc2h0YWcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFTQU1FX0xPQ0FMRSlcclxuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlTGluayhyZWFsX2hyZWYpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQub25tb3VzZW92ZXIgPSAoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGhyZWYgPSBlbGVtZW50LmhyZWY7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVhbF9ocmVmID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXggPSBMZXgoaHJlZik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobGV4LnRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgPT0gXCJ7XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IHRoaXNbcHJvcF0gfHwgdGhpcy5kYXRhX2NhY2hlW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRva2VuLnRleHQgIT0gXCJ9XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgaW5jb3JyZWN0IHZhbHVlIGZvdW5kIGluIHVybCAke2hyZWZ9YClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbF9ocmVmICs9IGxleC50b2tlbi50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3lMaW5rKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gbnVsbFxyXG4gICAgICAgIGVsZW1lbnQub25tb3VzZW92ZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUoZGF0YSwgX19GUk9NX1BBUkVOVF9fID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgc3VwZXIuX191cGRhdGVFeHBvcnRzX18oZGF0YSk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLnByb3BdID0gZGF0YVt0aGlzLnByb3BdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhX2NhY2hlID0gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXBvcnQgKGRhdGEpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChtb2RlbCkge1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgZS5sb2FkKG1vZGVsKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLm1vZGVsKVxyXG4gICAgICAgICAgICBtb2RlbC5hZGRWaWV3KHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGltZW5zaW9ucygpIHtcclxuXHJcbiAgICAgICAgdmFyIGQgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBkLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3AgPSBkLnRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBkLmxlZnQ7XHJcblxyXG4gICAgICAgIHN1cGVyLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENsb3NlQ2Fzc2V0dGUgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgcGFyZW50LmhpZGUoKTsgLy9PciBVUkwgYmFjaztcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU291cmNlQmFzZSB9IGZyb20gXCIuL2Jhc2VcIlxyXG5cclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi9jb250cm9sbGVyXCJcclxuXHJcbmltcG9ydCB7IEdldHRlciB9IGZyb20gXCIuLi9nZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHsgQ2Fzc2V0dGUgfSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgU291cmNlIGV4dGVuZHMgU291cmNlQmFzZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU291cmNlIGNvbnN0cnVjdG9yLiBCdWlsZHMgYSBTb3VyY2Ugb2JqZWN0LlxyXG4gICAgICAgIEBwYXJhbXMgW0RPTUVsZW1lbnRdIGVsZW1lbnQgLSBBIERPTSA8dGVtcGxhdGU+IGVsZW1lbnQgdGhhdCBjb250YWlucyBhIDxjYXNlPiBlbGVtZW50LlxyXG4gICAgICAgIEBwYXJhbXMgW1JvdXRlclByZXNldHNdIHByZXNldHNcclxuICAgICAgICBAcGFyYW1zIFtTb3VyY2VdIHBhcmVudCAtIFRoZSBwYXJlbnQgU291cmNlIG9iamVjdCwgdXNlZCBpbnRlcm5hbGx5IHRvIGJ1aWxkIFNvdXJjZSdzIGluIGEgaGllcmFyY2h5XHJcbiAgICAgICAgQHBhcmFtcyBbTW9kZWxdIG1vZGVsIC0gQSBtb2RlbCB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNhc2UgaW5zdGVhZCBvZiBoYXZpbmcgb25lIGNyZWF0ZWQgb3IgcHVsbGVkIGZyb20gcHJlc2V0cy4gXHJcbiAgICAgICAgQHBhcmFtcyBbRE9NXSAgV09SS0lOR19ET00gLSBUaGUgRE9NIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRlbXBsYXRlcyB0byBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBjYXNlIG9iamVjdHMuIFxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cclxuICAgICAgICB0aGlzLlVTRV9TRUNVUkUgPSBwcmVzZXRzLlVTRV9IVFRQUztcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcm9wID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLnJlY2VpdmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRzID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVjZWl2ZXIpXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIuZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2V0cyB1cCBNb2RlbCBjb25uZWN0aW9uIG9yIGNyZWF0ZXMgYSBuZXcgTW9kZWwgZnJvbSBhIHNjaGVtYS5cclxuICAgICovXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgIC8vaW1wb3J0IHF1ZXJ5IGluZm8gZnJvbSB0aGUgd3VybFxyXG4gICAgICAgICAgICBsZXQgc3RyID0gdGhpcy5kYXRhLnVybDtcclxuICAgICAgICAgICAgbGV0IGNhc3NldHRlcyA9IHN0ci5zcGxpdChcIjtcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS51cmwgPSBjYXNzZXR0ZXNbMF07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNhc3NldHRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc3NldHRlID0gY2Fzc2V0dGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2Fzc2V0dGVbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcGFyZW50X2ltcG9ydCA9IGNhc3NldHRlLnNsaWNlKDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJxXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3F1ZXJ5ID0gY2Fzc2V0dGUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3JldHVybiA9IGNhc3NldHRlLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQpIHRoaXMuZXhwb3J0cyA9IHRoaXMuZGF0YS5leHBvcnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbDtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwgJiYgbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBPcGluaW9uYXRlZCBTb3VyY2UgLSBPbmx5IGFjY2VwdHMgTW9kZWxzIHRoYXQgYXJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgaXRzIHNjaGVtYS4qL1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmNvbnN0cnVjdG9yICE9IHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aHJvdyBuZXcgRXJyb3IoYE1vZGVsIFNjaGVtYSAke3RoaXMubW9kZWwuc2NoZW1hfSBkb2VzIG5vdCBtYXRjaCBTb3VyY2UgU2NoZW1hICR7cHJlc2V0cy5zY2hlbWFzW3RoaXMuZGF0YS5zY2hlbWFdLnNjaGVtYX1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSlcclxuICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEoKTtcclxuXHJcbiAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIgPSBuZXcgR2V0dGVyKHRoaXMuZGF0YS51cmwsIHRoaXMudXJsX3JldHVybik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyLnNldE1vZGVsKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19fX3JlcXVlc3RfX19fKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBNb2RlbCBjb3VsZCBiZSBmb3VuZCBmb3IgU291cmNlIGNvbnN0cnVjdG9yISBTb3VyY2Ugc2NoZW1hIFwiJHt0aGlzLmRhdGEuc2NoZW1hfVwiLCBcIiR7dGhpcy5wcmVzZXRzLnNjaGVtYXNbdGhpcy5kYXRhLnNjaGVtYV19XCI7IFNvdXJjZSBtb2RlbCBcIiR7dGhpcy5kYXRhLm1vZGVsfVwiLCBcIiR7dGhpcy5wcmVzZXRzLm1vZGVsc1t0aGlzLmRhdGEubW9kZWxdfVwiO2ApO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZCh0aGlzLm1vZGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBfX19fcmVxdWVzdF9fX18ocXVlcnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlci5nZXQocXVlcnksIG51bGwsIHRoaXMuVVNFX1NFQ1VSRSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuUkVRVUVTVElORyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuUkVRVUVTVElORyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IChleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3Vicyh0aGlzLmNoaWxkcmVuLCBleHBvcnRzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc3VwZXIuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN1YnMoY2Fzc2V0dGVzLCBkYXRhLCBJTVBPUlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNhc3NldHRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXNzZXR0ZSA9IGNhc3NldHRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYXNzZXR0ZSBpbnN0YW5jZW9mIFNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcl92YWw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2Fzc2V0dGUuZGF0YS5pbXBvcnQgJiYgZGF0YVtjYXNzZXR0ZS5kYXRhLmltcG9ydF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcl92YWwgPSBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocl92YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3VicyhjYXNzZXR0ZS5jaGlsZHJlbiwgcl92YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgT3ZlcnJpZGluZyB0aGUgbW9kZWwgZGF0YSBoYXBwZW5zIHdoZW4gYSBjYXNzZXR0ZSByZXR1cm5zIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC4gVGhpcyBpcyBhc3NpZ25lZCB0byB0aGUgXCJyX3ZhbFwiIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFueSBjaGlsZCBjYXNzZXR0ZSBvZiB0aGUgcmV0dXJuaW5nIGNhc3NldHRlIHdpbGwgYmUgZmVkIFwicl92YWxcIiBpbnN0ZWFkIG9mIFwiZGF0YVwiLlxyXG4gICAgICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsIHx8IGRhdGEsIElNUE9SVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBjaGFuZ2VkX3ZhbHVlcykge1xyXG4gICAgICAgIHRoaXMuX19kb3duX18oZGF0YSwgY2hhbmdlZF92YWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge1xyXG4gICAgICAgIGxldCBxdWVyeV9kYXRhID0gbnVsbDtcclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgVGhpcyBwYXJ0IG9mIHRoZSBmdW5jdGlvbiB3aWxsIGltcG9ydCBkYXRhIGludG8gdGhlIG1vZGVsIHRoYXQgaXMgb2J0YWluZWQgZnJvbSB0aGUgcXVlcnkgc3RyaW5nIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHd1cmwgJiYgdGhpcy5kYXRhLmltcG9ydCkge1xyXG4gICAgICAgICAgICBxdWVyeV9kYXRhID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW1wb3J0ID09IFwibnVsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeV9kYXRhID0gd3VybC5nZXRDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocXVlcnlfZGF0YSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy5kYXRhLmltcG9ydC5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbFtpXS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod3VybCAmJiB0aGlzLmRhdGEudXJsKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcXVlcnlfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy51cmxfcXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy51cmxfcXVlcnkuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IGxbaV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXyhxdWVyeV9kYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IHRoaXMubW9kZWxfY29uc3RydWN0b3IoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldHRlci5zZXRNb2RlbCh0aGlzLm1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeV9kYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2RlbC5hZGQocXVlcnlfZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KGluZGV4ID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KGluZGV4KSk7XHJcblxyXG4gICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dChpbmRleCwgREVTVFJPWSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplVHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2ldLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICBzdXBlci5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmF0aW5nKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0QWN0aXZhdGluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wX25hbWUgaW4gdGhpcy5uYW1lZF9lbGVtZW50cylcclxuICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXSA9IHRoaXMubmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbVNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIGRhdGEsIHByZXNldHMpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBGaWx0ZXIgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcblx0XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgcGFyZW50LmZpbHRlcl9saXN0LnB1c2goKGRhdGEpID0+IHRoaXMuZmlsdGVyKGRhdGEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICAvL2FwcGx5IGEgZmlsdGVyIG9iamVjdCB0byB0aGUgcGFyZW50XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgRmlsdGVyXHJcbn0iLCJpbXBvcnQgeyBTb3VyY2UgfSBmcm9tIFwiLi9zb3VyY2VcIlxyXG5cclxuaW1wb3J0IHsgRmlsdGVyIH0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyXCJcclxuXHJcbmltcG9ydCB7IFRlcm0gfSBmcm9tIFwiLi9jYXNzZXR0ZS90ZXJtXCJcclxuXHJcbmltcG9ydCB7IE1DQXJyYXksIE1vZGVsQ29udGFpbmVyQmFzZSB9IGZyb20gXCIuLi9tb2RlbC9jb250YWluZXIvYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBNdWx0aUluZGV4ZWRDb250YWluZXIgfSBmcm9tIFwiLi4vbW9kZWwvY29udGFpbmVyL211bHRpXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBTb3VyY2VUZW1wbGF0ZSBleHRlbmRzIFNvdXJjZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU291cmNlVGVtcGxhdGUgY29uc3RydWN0b3IuIEJ1aWxkcyBhIFNvdXJjZVRlbXBsYXRlIG9iamVjdC5cclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG5cclxuICAgICAgICB0aGlzLmNhc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5hY3RpdmVTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnJhbmdlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wX2VsZW1lbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyVXBkYXRlKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0ID0gdGhpcy5jYXNlcy5zbGljZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5maWx0ZXJzW2ldLmZpbHRlcihvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjdGl2ZVNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlU291cmNlc1tpXS5lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvdXRwdXRbaV0uZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb247XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBvdXRwdXRbaV0udHJhbnNpdGlvbkluKGkpO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZVNvdXJjZXMgPSBvdXRwdXQ7XHJcbiAgICAgICAgLy9Tb3J0IGFuZCBmaWx0ZXIgdGhlIG91dHB1dCB0byBwcmVzZW50IHRoZSByZXN1bHRzIG9uIHNjcmVlbi5cclxuICAgIH1cclxuXHJcbiAgICBjdWxsKG5ld19pdGVtcykge1xyXG5cclxuICAgICAgICBpZiAobmV3X2l0ZW1zLmxlbmd0aCA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhc2VzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gbmV3IE1hcChuZXdfaXRlbXMubWFwKGUgPT4gW2UsIHRydWVdKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2FzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMuaGFzKHRoaXMuY2FzZXNbaV0ubW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tpXS5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0cy5zZXQodGhpcy5jYXNlc1tpXS5tb2RlbCwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGV4aXN0cy5mb3JFYWNoKCh2LCBrLCBtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodikgb3V0LnB1c2goayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG91dC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRlZChvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG1vZGVsKSB7fVxyXG5cclxuICAgIHJlbW92ZWQoaXRlbXMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY2FzZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBTb3VyY2UgPSB0aGlzLmNhc2VzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTb3VyY2UubW9kZWwgPT0gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FzZXMuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNvdXJjZS5kaXNzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZGVkKGl0ZW1zKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IFNvdXJjZSA9IHRoaXMudGVtcGxhdGVzWzBdLmZsZXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgU291cmNlLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FzZXMucHVzaChTb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXZpc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuY2FjaGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUZXJtcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG91dF90ZXJtcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBvdXRfdGVybXMucHVzaCh0aGlzLnRlcm1zW2ldLnRlcm0pO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG91dF90ZXJtcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfdGVybXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEsIElNUE9SVCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEudG9Kc29uKCkpXHJcblxyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkYXRhLmdldENoYW5nZWQodGhpcy5wcm9wKTtcclxuXHJcbiAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IFVQREFURSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlcm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGVybXNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUgJiYgdGhpcy5tb2RlbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG5cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbaV0udXBkYXRlKGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgIFVQREFURSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoVVBEQVRFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGFpbmVyICYmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lckJhc2UgfHwgY29udGFpbmVyLl9fX19zZWxmX19fXykpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IG93bl9jb250YWluZXIgPSBjb250YWluZXIuZ2V0KHRoaXMuZ2V0VGVybXMoKSwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3duX2NvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5waW4oKTtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNQ0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1bGwob3duX2NvbnRhaW5lcilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG93bl9jb250YWluZXIgPSBkYXRhLl9fX19zZWxmX19fXy5kYXRhW3RoaXMucHJvcF1cclxuICAgICAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5hZGRWaWV3KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VsbCh0aGlzLmdldCgpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCBpbnN0YW5jZW9mIE11bHRpSW5kZXhlZENvbnRhaW5lcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgcXVlcnlbaW5kZXhdID0gdGhpcy5nZXRUZXJtcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldChxdWVyeSlbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGluZGV4IHZhbHVlIHByb3ZpZGVkIGZvciBNdWx0aUluZGV4ZWRDb250YWluZXIhXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMubW9kZWwuc291cmNlO1xyXG4gICAgICAgICAgICBsZXQgdGVybXMgPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzb3VyY2UuZ2V0KHRlcm1zLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RlbC5waW4oKTtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCh0ZXJtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4oZWxlbWVudHMsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbigpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25fdGltZSA9IDAsIERFU1RST1kgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KCkpO1xyXG5cclxuICAgICAgICBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lLCBERVNUUk9ZKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uX3RpbWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxuY2xhc3MgSW5kZXhlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5sZXhlciA9IG5ldyBMZXgoZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3AgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChpbmRleCwgUkVETyA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGxleCA9IHRoaXMubGV4ZXI7XHJcblxyXG4gICAgICAgIGlmIChSRURPKSB7XHJcbiAgICAgICAgICAgIGxleC5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3AgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKCFsZXgudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJFRE8pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGluZGV4LCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChsZXgudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnBlZWsoKS50ZXh0ID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIDxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyB0YWduYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoLS10aGlzLnNwIDwgMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2subGVuZ3RoID0gdGhpcy5zcCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2tbdGhpcy5zcF0rKztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIHRhZ25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGxleC50ZXh0ICE9PSBcIj5cIiAmJiBsZXgudGV4dCAhPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIGF0dHJpYiBuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCI9XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxleC5uZXh0KCksIGxleC5uZXh0KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpIC8vIC8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpIC8vID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vID5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnN0YWNrLnB1c2goMCksIHRoaXMuc3ArKylcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiOlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudHlwZSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbnVtYmVyID0gcGFyc2VJbnQobGV4LnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWJlciA9PSBpbmRleCkgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3A7IGkrKykge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlblt0aGlzLnN0YWNrW2ldXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAgICBTb3VyY2Ugc2tlbGV0b25cclxuICAgICAgICBNb2RlbCBwb2ludGVyIE9SIHNjaGVtYSBwb2ludGVyXHJcbiAgICAgICAgICAgIElGIHNjaGVtYSwgdGhlbiB0aGUgc2tlbGV0b24gd2lsbCBjcmVhdGUgYSBuZXcgTW9kZWwgd2hlbiBpdCBpcyBjb3BpZWQsIFVOTEVTUyBhIG1vZGVsIGlzIGdpdmVuIHRvIHRoZSBza2VsZXRvbiBjb3B5IENvbnN0cnVjdG9yLiBcclxuICAgICAgICAgICAgT3RoZXIgd2lzZSwgdGhlIHNrZWxldG9uIHdpbGwgYXV0b21hdGljYWxseSBhc3NpZ24gdGhlIE1vZGVsIHRvIHRoZSBjYXNlIG9iamVjdC4gXHJcblxyXG4gICAgICAgIFRoZSBtb2RlbCB3aWxsIGF1dG9tYXRpY2FsbHkgY29weSBpdCdzIGVsZW1lbnQgZGF0YSBpbnRvIHRoZSBjb3B5LCB6aXBwaW5nIHRoZSBkYXRhIGRvd24gYXMgdGhlIENvbnN0cnVjdG9yIGJ1aWxkcyB0aGUgU291cmNlJ3MgY2hpbGRyZW4uXHJcblxyXG4qL1xyXG5leHBvcnQgY2xhc3MgU291cmNlU2tlbGV0b24ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbnN0cnVjdG9yLCBkYXRhLCBwcmVzZXRzLCBpbmRleCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5Db25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVybXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMucHJlc2V0cyA9IHByZXNldHM7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHJcbiAgICAqL1xyXG4gICAgZmxlc2goTW9kZWwgPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IFNvdXJjZSA9IHRoaXMuX19fX2NvcHlfX19fKG51bGwsIG51bGwsIG51bGwpO1xyXG5cclxuICAgICAgICBTb3VyY2UubG9hZChNb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ29uc3RydWN0cyBhIG5ldyBvYmplY3QsIGF0dGFjaGluZyB0byBlbGVtZW50cyBob3N0ZWQgYnkgYSBjYXNlLiBJZiB0aGUgY29tcG9uZW50IHRvIGNvbnN0cnVjdCBpcyBhIFNvdXJjZSwgdGhlbiB0aGUgXHJcbiAgICAgICAgcGFyZW50X2VsZW1lbnQgZ2V0cyBzd2FwcGVkIG91dCBieSBhIGNsb25lZCBlbGVtZW50IHRoYXQgaXMgaG9zdGVkIGJ5IHRoZSBuZXdseSBjb25zdHJ1Y3RlZCBTb3VyY2UuXHJcbiAgICAqL1xyXG4gICAgX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBwYXJlbnQsIGluZGV4ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIENMQUlNRURfRUxFTUVOVCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbmRleCA+IDApIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGluZGV4ZXIuZ2V0KHRoaXMuaW5kZXgpXHJcbiAgICAgICAgICAgIENMQUlNRURfRUxFTUVOVCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudF9lbGVtZW50ID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VOb2RlKHBhcmVudF9lbGVtZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGluZGV4ZXIgPSBuZXcgSW5kZXhlcihwYXJlbnRfZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3V0X29iamVjdDtcclxuICAgICAgICBpZiAodGhpcy5Db25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gbmV3IHRoaXMuQ29uc3RydWN0b3IocGFyZW50LCB0aGlzLmRhdGEsIHRoaXMucHJlc2V0cyk7XHJcbiAgICAgICAgICAgIGlmIChDTEFJTUVEX0VMRU1FTlQpXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXBhcmVudCkge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gdGhpcy5jaGlsZHJlblswXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG51bGwsIGluZGV4ZXIpO1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0LmVsZW1lbnQgPSBwYXJlbnRfZWxlbWVudDtcclxuICAgICAgICAgICAgcmV0dXJuIG91dF9vYmplY3Q7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSBwYXJlbnQ7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG91dF9vYmplY3QsIGluZGV4ZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC50ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC5maWx0ZXJzLnB1c2godGhpcy5maWx0ZXJzW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcikpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LnRlbXBsYXRlcy5wdXNoKHRoaXMudGVtcGxhdGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgfVxyXG59IiwibGV0IEdMT0JBTCA9ICgoKT0+e1xyXG5cdGxldCBsaW5rZXIgPSBudWxsO1xyXG5cdHJldHVybiB7XHJcblx0XHRnZXQgbGlua2VyKCl7XHJcblx0XHRcdHJldHVybiBsaW5rZXI7XHJcblx0XHR9LFxyXG5cdFx0c2V0IGxpbmtlcihsKXtcclxuXHRcdFx0aWYoIWxpbmtlcilcclxuXHRcdFx0XHRsaW5rZXIgPSBsO1xyXG5cdFx0fVxyXG5cdH1cclxufSlcclxuXHJcbmV4cG9ydCB7R0xPQkFMfSIsImltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmNsYXNzIElucHV0IGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgLy9TY2FuIHRoZSBlbGVtZW50IGFuZCBsb29rIGZvciBpbnB1dHMgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIHRoZVxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIC8vSW5wdXRzIGluIGZvcm1zIGFyZSBhdXRvbWF0aWNhbGx5IGhpZGRlbi5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgICAgICAgICBkYXRhW3RoaXMucHJvcF0gPSB0aGlzLmVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhW3RoaXMucHJvcF0pIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy52YWwgPSBkYXRhW3RoaXMucHJvcF07XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IChuZXcgRGF0ZShwYXJzZUludChkYXRhW3RoaXMucHJvcF0pKSkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRpbWVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IGAkeyhcIjAwXCIrKGRhdGFbdGhpcy5wcm9wXSB8IDApKS5zbGljZSgtMil9OiR7KFwiMDBcIisoKGRhdGFbdGhpcy5wcm9wXSUxKSo2MCkpLnNsaWNlKC0yKX06MDAuMDAwYDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGRhdGFbdGhpcy5wcm9wXSAhPSB1bmRlZmluZWQpID8gZGF0YVt0aGlzLnByb3BdIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdFswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW9kdWxvX3RpbWVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJU19QTSA9ICh0aW1lIC8gMTIgPiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSAoKHRpbWUgJSAxKSAqIDYwKSB8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3VycyA9ICgoKHRpbWUgfCAwKSAlIDEyKSAhPSAwKSA/ICh0aW1lIHwgMCkgJSAxMiA6IDEyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKGhvdXJzICsgXCI6XCIgKyAoXCIwXCIgKyBtaW51dGVzKS5zbGljZSgtMikpICsgKChJU19QTSkgPyBcIiBQTVwiIDogXCIgQU1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAoZGF0YVt0aGlzLnByb3BdICE9IHVuZGVmaW5lZCkgPyBkYXRhW3RoaXMucHJvcF0gOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgSW5wdXRcclxufSIsImltcG9ydCB7IEdMT0JBTCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIlxyXG5cclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbnB1dFwiXHJcblxyXG5pbXBvcnQgeyBDYXNzZXR0ZSB9IGZyb20gXCIuL2Nhc3NldHRlXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBGb3JtIGV4dGVuZHMgQ2Fzc2V0dGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBlbGVtZW50LCBkLCBwKSB7XHJcbiAgICAgICAgLy9TY2FuIHRoZSBlbGVtZW50IGFuZCBsb29rIGZvciBpbnB1dHMgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIHRoZSBcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LCB0aGlzLCBwYXJlbnQpXHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFjY2VwdGVkKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigoZSkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBHTE9CQUwucm91dGVyLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgR0xPQkFMLnJvdXRlci5sb2FkTmV3UGFnZShyZXN1bHQudXJsLCAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoZSwgXCJ0ZXh0L2h0bWxcIikpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlamVjdGVkKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigoZSkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBHTE9CQUwucm91dGVyLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgR0xPQkFMLnJvdXRlci5sb2FkTmV3UGFnZShyZXN1bHQudXJsLCAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoZSwgXCJ0ZXh0L2h0bWxcIikpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKG1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG1vZGVsLnNjaGVtYTtcclxuXHJcbiAgICAgICAgc3VwZXIubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5lbGVtZW50LmFjdGlvbjtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1fZGF0YSA9IChuZXcgRm9ybURhdGEodGhpcy5lbGVtZW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGNoaWxkLmVsZW1lbnQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGNoaWxkLnByb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHRoaXMuc2NoZW1hW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgJiYgcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gc2NoZW1lLnN0cmluZyhjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2RhdGEuc2V0KG5hbWUsIHZhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCwgbmFtZSwgdmFsLCBjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBmZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcInBvc3RcIixcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgICAgYm9keTogZm9ybV9kYXRhLFxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgIT0gMjAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWplY3RlZChyZXN1bHQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2VwdGVkKHJlc3VsdClcclxuXHJcbiAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZChlKTtcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2ljayBGb3JtIFN1Ym1pdHRlZFwiLCB1cmwsIGZvcm1fZGF0YSlcclxuXHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU291cmNlQmFzZSB9IGZyb20gXCIuLi9iYXNlXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBUYXAgZXh0ZW5kcyBTb3VyY2VCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG4gICAgICAgIHRoaXMucHJvcCA9IGRhdGEucHJvcDtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIGltcG9ydGVkKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZWRfcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoYW5nZWRfcHJvcGVydGllcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkX3Byb3BlcnRpZXNbaV0gPT0gdGhpcy5wcm9wKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW3RoaXMucHJvcF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGRhdGFbdGhpcy5wcm9wXSB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gbCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVt0aGlzLnByb3BdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZGF0YVt0aGlzLnByb3BdIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2VlIERlZmluaXRpb24gaW4gU291cmNlQmFzZSBcclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IHJfdmFsID0gdGhpcy5kb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcywgSU1QT1JURUQpO1xyXG4gICAgICAgIGlmIChyX3ZhbClcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18ocl92YWwsIFt0aGlzLnByb3BdLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoZGF0YS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICAgICAgb3V0W3RoaXMucHJvcF0gPSBkYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTb3VyY2VCYXNlIH0gZnJvbSBcIi4uL2Jhc2VcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGUgZXh0ZW5kcyBTb3VyY2VCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd24oZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBgPGI+JHtkYXRhLnZhbHVlfTwvYj5gIH1cclxuICAgIH1cclxufVxyXG5cclxuUGlwZS5BRERTX1RBR1MgPSB0cnVlO1xyXG5QaXBlLkNBTl9CRV9TVEFUSUMgPSB0cnVlOyIsImltcG9ydCB7XHJcbiAgICBTb3VyY2VCYXNlXHJcbn0gZnJvbSBcIi4uL2Jhc2VcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgSU8gKi9cclxuXHJcbi8qKlxyXG5cdFRoZSBJTyBpcyB0aGUgbGFzdCBsaW5rIGluIHRoZSBTb3VyY2UgY2hhaW4uIEl0IGlzIHJlc3BvbnNpYmxlIGZvciBwdXR0aW5nIGRhdGUgaW50byB0aGUgRE9NIHRocm91Z2ggaXQncyBjb25uZWN0ZWQgZWxlbWVudCwgYW5kIHByZXNlbnQgaXQgdG8gdGhlIHZpZXdlci4gXHJcblx0SXQgaXMgYWxzbyByZXNwb25zaWJsZSBmb3IgcmVzcG9uZGluZyB0byB1c2VyIGlucHV0LCB0aG91Z2ggdGhlIGJhc2UgSU8gb2JqZWN0IGRvZXMgbm90IHByb3ZpZGUgYW55IGNvZGUgZm9yIHRoYXQuIFxyXG4qL1xyXG5leHBvcnQgY2xhc3MgSU8gZXh0ZW5kcyBTb3VyY2VCYXNle1xyXG5cclxuXHRjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpe1xyXG5cdFx0c3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cdFx0dGhpcy5wcm9wID0gZGF0YS5wcm9wO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0XHRJbmhlcml0b3JzIG9mIElPIHNob3VsZCB1c2UgdGhpcyBmdW5jdGlvbiB0byBwdXNoIGRhdGEgYmFjayB1cCB0byB0aGUgU291cmNlIGZyb20gaW5wdXQgYnkgdGhlIHVzZXIuIFxyXG5cdCovXHJcblx0dXAoKXtcclxuXHRcdC8vVGhpcyBpcyBlbXB0eSBmb3IgdGhlIGJhc2ljIElPIG9iamVjdC4gXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdFB1dHMgZGF0YSBpbnRvIHRoZSB3YXRjaGVkIGVsZW1lbnQuIFRoZSBkZWZhdWx0IGFjdGlvbiBpcyB0byBzaW1wbHkgdXBkYXRlIHRoZSBlbGVtZW50cyBpbm5lckhUTUwgd2l0aCBkYXRhLnZhbHVlLiAgXHJcblx0Ki9cclxuXHRkb3duKGRhdGEpe1xyXG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGRhdGEudmFsdWU7XHJcblx0fVxyXG59IiwiLypcclxuICAgIEJvcmluZyBTb3VyY2Ugc3R1ZmZcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIFNvdXJjZSxcclxufSBmcm9tIFwiLi9zb3VyY2VcIlxyXG5cclxuaW1wb3J0IHtcclxuICAgIFNvdXJjZVRlbXBsYXRlXHJcbn0gZnJvbSBcIi4vc291cmNlX3RlbXBsYXRlXCJcclxuaW1wb3J0IHtcclxuICAgIFNvdXJjZVNrZWxldG9uXHJcbn0gZnJvbSBcIi4vc291cmNlX3NrZWxldG9uXCJcclxuLyogXHJcbiAgICBDYXNzZXR0ZXNcclxuKi9cclxuaW1wb3J0IHtcclxuICAgIEZpbHRlckxpbWl0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyX2xpbWl0XCJcclxuaW1wb3J0IHtcclxuICAgIENhc3NldHRlLFxyXG4gICAgQ2xvc2VDYXNzZXR0ZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Nhc3NldHRlXCJcclxuaW1wb3J0IHtcclxuICAgIEZvcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9mb3JtXCJcclxuaW1wb3J0IHtcclxuICAgIElucHV0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvaW5wdXRcIlxyXG5pbXBvcnQge1xyXG4gICAgRmlsdGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZmlsdGVyXCJcclxuaW1wb3J0IHtcclxuICAgIFRlcm1cclxufSBmcm9tIFwiLi9jYXNzZXR0ZS90ZXJtXCJcclxuaW1wb3J0IHtcclxuICAgIEV4cG9ydGVyXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZXhwb3J0ZXJcIlxyXG5pbXBvcnQge1xyXG4gICAgSW1wb3J0UXVlcnlcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9pbXBvcnRfcXVlcnlcIlxyXG5pbXBvcnQge1xyXG4gICAgRGF0YUVkaXRcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9kYXRhX2VkaXRcIlxyXG5pbXBvcnQge1xyXG4gICAgRXhpc3RzLFxyXG4gICAgTm90RXhpc3RzXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZXhpc3RzXCJcclxuaW1wb3J0IHtcclxuICAgIEVwb2NoRGF5LFxyXG4gICAgRXBvY2hUaW1lLFxyXG4gICAgRXBvY2hEYXRlLFxyXG4gICAgRXBvY2hNb250aCxcclxuICAgIEVwb2NoWWVhcixcclxuICAgIEVwb2NoVG9EYXRlVGltZVxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2Vwb2NoXCJcclxuXHJcbmxldCBQcmVzZXRDYXNzZXR0ZXMgPSB7XHJcbiAgICByYXc6IENhc3NldHRlLFxyXG4gICAgY2Fzc2V0dGU6IENhc3NldHRlLFxyXG4gICAgZm9ybTogRm9ybSxcclxuICAgIGlucHV0OiBJbnB1dCxcclxuICAgIGV4cG9ydDogRXhwb3J0ZXIsXHJcbiAgICBpcXVlcnk6IEltcG9ydFF1ZXJ5LFxyXG4gICAgZWR0OiBFcG9jaFRvRGF0ZVRpbWUsXHJcbiAgICBldGltZTogRXBvY2hUaW1lLFxyXG4gICAgZWRheTogRXBvY2hEYXksXHJcbiAgICBlZGF0ZTogRXBvY2hEYXRlLFxyXG4gICAgZXllYXI6IEVwb2NoWWVhcixcclxuICAgIGVtb250aDogRXBvY2hNb250aCxcclxuICAgIGV4aXN0czogRXhpc3RzLFxyXG4gICAgbm90X2V4aXN0czogTm90RXhpc3RzLFxyXG4gICAgZGF0YV9lZGl0OiBEYXRhRWRpdCxcclxuICAgIHRlcm06IFRlcm0sXHJcbiAgICBsaW1pdDogRmlsdGVyTGltaXRcclxufVxyXG5cclxuaW1wb3J0IHsgVGFwIH0gZnJvbSBcIi4vdGFwcy90YXBcIlxyXG5pbXBvcnQgeyBQaXBlIH0gZnJvbSBcIi4vcGlwZXMvcGlwZVwiXHJcbmltcG9ydCB7IElPIH0gZnJvbSBcIi4vaW8vaW9cIlxyXG5cclxuZXhwb3J0IGNsYXNzIFJvb3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5odG1sID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy50YWdfaW5kZXggPSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmh0bWw7XHJcbiAgICAgICAgbGV0IHJvb3Rfc2tlbGV0b24gPSBuZXcgU291cmNlU2tlbGV0b24oZWxlbWVudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb25zdHJ1Y3RTa2VsZXRvbihyb290X3NrZWxldG9uLCBwcmVzZXRzKTtcclxuICAgICAgICByZXR1cm4gcm9vdF9za2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbmRleCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWdfaW5kZXgrKztcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgIGh0bWw6IHRoaXMuaHRtbFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmZzZXQoaW5jcmVhc2UgPSAwKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHRoaXMudGFnX2NvdW50O1xyXG4gICAgICAgIHRoaXMudGFnX2NvdW50ICs9IGluY3JlYXNlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmljTm9kZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcclxuICAgICAgICB0aGlzLklTX05VTEwgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19TQU1FID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMucHJvcF9uYW1lID0gbnVsbDtcclxuICAgICAgICB0aGlzLmh0bWwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMub3Blbl90YWcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY2xvc2VfdGFnID0gXCJcIjtcclxuICAgICAgICB0aGlzLnRhZ19pbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKHBhcmVudClcclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMub3Blbl90YWcgKyB0aGlzLmh0bWwgKyB0aGlzLmNsb3NlX3RhZztcclxuICAgIH1cclxuXHJcbiAgICByZXBsYWNlQ2hpbGQoY2hpbGQsIG5ld19jaGlsZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV0gPT0gY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0gPSBuZXdfY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICBuZXdfY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXSA9PSBjaGlsZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUYXBOb2RlICYmICEodGhpcyBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBdHRyaWJ1dGVzKCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICBvdXQucHJvcCA9IHRoaXMucHJvcF9uYW1lO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BfbmFtZSAhPT0gcHJvcF9uYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNwbGl0KG5ldyBJT05vZGUocHJvcF9uYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwsIHRoaXMsIHRoaXMuZ2V0SW5kZXgoKSksIHByb3BfbmFtZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXcgSU9Ob2RlKHByb3BfbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzLCB0aGlzLmdldEluZGV4KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogdGhpcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgdGFnbmFtZTogdGhpcy50YWduYW1lLFxyXG4gICAgICAgICAgICB0YWdfY291bnQ6IHRoaXMudGFnX2NvdW50LFxyXG4gICAgICAgICAgICB0YWc6IHsgb3Blbl90YWc6IHRoaXMub3Blbl90YWcsIGNsb3NlX3RhZzogdGhpcy5jbG9zZV90YWcgfSxcclxuICAgICAgICAgICAgaHRtbDogdGhpcy5odG1sLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgciA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMudGFnbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByLkNPTlNVTUVTX1NBTUUgPSAoci5DT05TVU1FU19UQUcpID8gKCEoci5DT05TVU1FU19UQUcgPSAhMSkpIDogITE7XHJcbiAgICAgICAgICAgICAgICAgICAgci5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgci5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQociwgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHRoaXMsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wX25hbWUgPT0gdGhpcy5wcm9wX25hbWUpIHt9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy50YWduYW1lLCB0aGlzLmF0dHJpYnV0ZXMsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdChyLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQodGhpcywgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0SW5kZXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy50YWdfaW5kZXggPiAwKSByZXR1cm4gdGhpcy50YWdfaW5kZXgrKztcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbmRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHBhcmVudF9za2VsZXRvbiwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICBsZXQgc2tlbGV0b24gPSB0aGlzLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cyk7XHJcblxyXG4gICAgICAgIHBhcmVudF9za2VsZXRvbi5jaGlsZHJlbi5wdXNoKHNrZWxldG9uKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29uc3RydWN0U2tlbGV0b24oc2tlbGV0b24sIHByZXNldHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IG5ldyBTb3VyY2VTa2VsZXRvbih0aGlzLmdldEVsZW1lbnQoKSwgdGhpcy5nZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSwgdGhpcy5wYXJzZUF0dHJpYnV0ZXMoKSwgcHJlc2V0cywgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIHNrZWxldG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTb3VyY2VOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGlmIChsZXhlci50ZXh0ID09IFwiKFwiICYmIGxleGVyLnBlZWsoKS50ZXh0ID09IFwiKFwiKSB7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIihcIik7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIihcIik7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZU5vZGUoXCJsaXN0XCIsIHRoaXMuYXR0cmlidXRlcywgdGhpcywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLnBhcnNlKGxleGVyLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKVwiKTtcclxuICAgICAgICAgICAgbGV0IG91dCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgIGxleGVyLmFzc2VydChcIilcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHRoaXMuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIGN0eCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcclxuICAgICAgICBjdHguaHRtbCArPSBgPGxpc3Q+IyM6JHt0aGlzLmluZGV4fTwvbGlzdD5gXHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRmlsdGVyTm9kZSlcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVGVybU5vZGUpXHJcbiAgICAgICAgICAgIHRoaXMudGVybXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRlbXBsYXRlcy5sZW5ndGggPiAwKSB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG9uZSBTb3VyY2UgYWxsb3dlZCBpbiBhIFRlbXBsYXRlLlwiKTtcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLnRhZ19pbmRleCA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbCA9IGNoaWxkLmh0bWw7XHJcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihcIlRlbXBsYXRlcyBvbmx5IHN1cHBvcnQgRmlsdGVyLCBUZXJtIG9yIFNvdXJjZSBlbGVtZW50cy5cIilcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RTa2VsZXRvbihwYXJlbnRfc2tlbGV0b24sIHByZXNldHMpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmh0bWw7XHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IFNvdXJjZVNrZWxldG9uKHRoaXMuZ2V0RWxlbWVudCgpLCBTb3VyY2VUZW1wbGF0ZSwgdGhpcy5wYXJzZUF0dHJpYnV0ZXMoKSwgcHJlc2V0cywgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgc2tlbGV0b24uZmlsdGVycyA9IHRoaXMuZmlsdGVycy5tYXAoKGZpbHRlcikgPT4gZmlsdGVyLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykpXHJcbiAgICAgICAgc2tlbGV0b24udGVybXMgPSB0aGlzLnRlcm1zLm1hcCgodGVybSkgPT4gdGVybS5jcmVhdGVTa2VsZXRvbkNvbnN0cnVjdG9yKHByZXNldHMpKVxyXG4gICAgICAgIHNrZWxldG9uLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzLm1hcCgodGVtcGxhdGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNrbCA9IHRlbXBsYXRlLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cyk7XHJcbiAgICAgICAgICAgIHNrbC5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgcmV0dXJuIHNrbDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHBhcmVudF9za2VsZXRvbi5jaGlsZHJlbi5wdXNoKHNrZWxldG9uKVxyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgLy9jdHguaHRtbCArPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UobGV4ZXIsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICBsZXQgY3R4ID0geyBodG1sOiBcIlwiIH07XHJcbiAgICAgICAgbGV0IHJvb3QgPSBuZXcgUm9vdCgpO1xyXG4gICAgICAgIHdoaWxlIChsZXhlci50ZXh0ICE9PSBcIilcIiAmJiBsZXhlci5wZWVrKCkudGV4dCAhPT0gXCIpXCIpIHtcclxuICAgICAgICAgICAgaWYgKCFsZXhlci50ZXh0KSB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBPdXRwdXQuIE1pc3NpbmcgJykpJyBcIik7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBwYXJzZUZ1bmN0aW9uKGxleGVyLCB0aGlzLCBwcmVzZXRzKTtcclxuICAgICAgICAgICAgaWYgKG91dCBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmh0bWwgPSBvdXQuaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcblxyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWdfY291bnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUYXBOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4KSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMpIHtcclxuICAgICAgICByZXR1cm4gVGFwO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbHRlck5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXJtTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge31cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHJvcCA9IHByb3BfbmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUGlwZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgsIHByZXNldHMpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cywgZmluYWxpemluZyA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gUGlwZTtcclxuICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKCEodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQaXBlTm9kZSkgJiZcclxuICAgICAgICAgICAgISh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFRhcE5vZGUpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vTmVlZCBhIFRhcE5vZGUgdG8gY29tcGxldGUgdGhlIHBpcGVsaW5lXHJcbiAgICAgICAgICAgIGxldCB0YXAgPSBuZXcgVGFwTm9kZShcIlwiLCB7fSwgbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wcm9wX25hbWUgPSB0aGlzLnByb3BfbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVwbGFjZUNoaWxkKHRoaXMsIHRhcCk7XHJcbiAgICAgICAgICAgIHRhcC5hZGRDaGlsZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLnNwbGl0KG5vZGUsIHByb3BfbmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJT05vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wX25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgY3R4LCBpbmRleCkge1xyXG4gICAgICAgIHN1cGVyKFwiXCIsIG51bGwsIHBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIGN0eC5odG1sICs9IGA8aW8gcHJvcD1cIiR7cHJvcF9uYW1lfVwiPiMjOiR7aW5kZXh9PC9pbz5gXHJcbiAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19UQUcgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIElPO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIExleFxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5cclxuaW1wb3J0ICogYXMgQVNUIGZyb20gXCIuL3NvdXJjZV9jb25zdHJ1Y3Rvcl9hc3RcIlxyXG5cclxuLypcclxuICAgIFRoaXMgZnVuY3Rpb24ncyByb2xlIGlzIHRvIGNvbnN0cnVjdCBhIGNhc2Ugc2tlbGV0b24gZ2l2ZW4gYSB0ZW1wbGF0ZSwgYSBsaXN0IG9mIHByZXNldHMsIGFuZCBcclxuICAgIGFuZCBvcHRpb25hbGx5IGEgd29ya2luZyBET00uIFRoaXMgd2lsbCByZXR1cm4gU291cmNlIFNrZWxldG9uIHRoYXQgY2FuIGJlIGNsb25lZCBpbnRvIGEgbmV3IFNvdXJjZSBvYmplY3QuIFxyXG5cclxuICAgIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFRlbXBsYXRlXHJcbiAgICBAcGFyYW0ge1ByZXNldHN9IHByZXNldHMgXHJcbiAgICBAcGFyYW0ge0RPTUVsZW1lbnR9IFdPUktJTkdfRE9NIC0gU2hvdWxkIGluY2x1ZGUgYW55IG90aGVyIHRlbXBsYXRlcyB0aGF0IG5lZWQgdG8gYmUgcm9sbGVkIGluLiBcclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFNvdXJjZUNvbnN0cnVjdG9yKFRlbXBsYXRlLCBQcmVzZXRzLCBXT1JLSU5HX0RPTSkge1xyXG5cclxuICAgIGxldCBza2VsZXRvbjtcclxuXHJcbiAgICBpZiAoIVRlbXBsYXRlKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgIGlmIChUZW1wbGF0ZS5za2VsZXRvbilcclxuICAgICAgICByZXR1cm4gVGVtcGxhdGUuc2tlbGV0b247XHJcblxyXG5cclxuICAgIC8vVEVtcGxhdGUgRmlsdHJhdGlvbiBoYW5kbGVkIGhlcmUuXHJcbiAgICAvL0ltcG9ydCB0aGUgXHJcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUoVGVtcGxhdGUsIHRydWUpO1xyXG5cclxuICAgIHNrZWxldG9uID0gQ29tcG9uZW50Q29uc3RydWN0b3IoZWxlbWVudCwgUHJlc2V0cywgV09SS0lOR19ET00pO1xyXG5cclxuICAgIGlmICghc2tlbGV0b24pXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgVGVtcGxhdGUuc2tlbGV0b24gPSAoKHNrZWxldG9uKSA9PiAobW9kZWwpID0+IHNrZWxldG9uLmZsZXNoKG1vZGVsKSkoc2tlbGV0b24pO1xyXG5cclxuICAgIHJldHVybiBUZW1wbGF0ZS5za2VsZXRvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50Q29uc3RydWN0b3IoZWxlbWVudCwgcHJlc2V0cywgV09SS0lOR19ET00pIHtcclxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XHJcbiAgICBsZXQgcHJvcHMgPSBbXTtcclxuXHJcbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIlRFTVBMQVRFXCIpIHtcclxuICAgICAgICBsZXQgY29tcG9uZW50X25hbWUgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBsZXhlciA9IExleChpbnB1dCk7XHJcblxyXG4gICAgICAgIC8vTWFrZSBzdXJlIHdlIGFyZSBzdGFydGluZyB3aXRoIGEgY2FzZSBvYmplY3QuIFxyXG5cclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIjxcIikge1xyXG4gICAgICAgICAgICAvL29mZiB0byBhIGdvb2Qgc3RhcnRcclxuICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQVNULlJvb3QoKTtcclxuICAgICAgICAgICAgUGFyc2VUYWcobGV4ZXIsIHJvb3QsIHByZXNldHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm9vdC5jb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSBzZWxlY3Rpb24gb2YgQVNUIG5vZGVzIGJhc2VkIG9uIHRhZ25hbWU7XHJcbiAgICBcclxuICAgIEBwYXJhbSB7TGV4ZXJ9IGxleGVyIC0gVGhlIGxleGljYWwgcGFyc2VyIFxyXG4gICAgQHBhcmFtIHtTdHJpbmd9IHRhZ25hbWUgLSBUaGUgZWxlbWVudHMgdGFnbmFtZVxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgIEBwYXJhbSB7Q0NBc3ROb2RlfSBwYXJlbnRcclxuKi9cclxuZnVuY3Rpb24gRGlzcGF0Y2gobGV4ZXIsIHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgbGV0IGFzdDtcclxuICAgIHN3aXRjaCAodGFnbmFtZSkge1xyXG4gICAgICAgIC8qIFRhcHMgKi9cclxuICAgICAgICBjYXNlIFwid1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWFcIjpcclxuICAgICAgICBjYXNlIFwid19hXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGFwTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LWZpbHRlclwiOlxyXG4gICAgICAgICAgICBhc3QgPSBuZXcgQVNULkZpbHRlck5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy10ZXJtXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuVGVybU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzdDtcclxuICAgICAgICBjYXNlIFwidy1jXCI6XHJcbiAgICAgICAgY2FzZSBcIndfY1wiOlxyXG4gICAgICAgIGNhc2UgXCJ3LWNhc2VcIjpcclxuICAgICAgICBjYXNlIFwid19jYXNlXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuU291cmNlTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGlmICh0YWduYW1lWzBdID09IFwid1wiKSB7XHJcbiAgICAgICAgICAgICAgICBhc3QgPSBuZXcgQVNULlBpcGVOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgYXN0ID0gbmV3IEFTVC5HZW5lcmljTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgcmV0dXJuIGFzdDtcclxufVxyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSBwYXJzaW5nIG9mIEhUTUwgdGFncyBhbmQgY29udGVudFxyXG4gICAgQHBhcmFtIHtTdHJpbmd9IHRhZ25hbWVcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgIEBwYXJhbSB7Q0NBc3ROb2RlfSBwYXJlbnRcclxuKi9cclxuZnVuY3Rpb24gUGFyc2VUYWcobGV4ZXIsIHBhcmVudCwgcHJlc2V0cykge1xyXG4gICAgbGV0IHN0YXJ0ID0gbGV4ZXIucG9zO1xyXG4gICAgbGV0IGF0dHJpYnV0ZXMgPSB7fTtcclxuICAgIFxyXG4gICAgbGV4ZXIuYXNzZXJ0KFwiPFwiKVxyXG4gICAgXHJcbiAgICBsZXQgdGFnbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICBcclxuICAgIGlmIChsZXhlci50eXBlID09IFwiaWRlbnRpZmllclwiKSB7XHJcbiAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgIEdldEF0dHJpYnV0ZXMobGV4ZXIsIGF0dHJpYnV0ZXMpO1xyXG4gICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdGFnLW5hbWUgaWRlbnRpZmllciwgZ290ICR7bGV4ZXIudGV4dH1gKTtcclxuXHJcbiAgICBsZXQgZWxlID0gRGlzcGF0Y2gobGV4ZXIsIHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcblxyXG4gICAgZWxlLm9wZW5fdGFnICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICBzdGFydCA9IGxleGVyLnRva2VuLnBvcztcclxuXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWxleGVyLnRleHQpXHJcbiAgICAgICAgICAgIHRocm93IChcIlVuZXhwZWN0ZWQgZW5kIG9mIG91dHB1dFwiKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChsZXhlci50ZXh0KSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobGV4ZXIucGVlaygpLnRleHQgPT0gXCIvXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmh0bWwgKz0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGxleGVyLnBvcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9TaG91bGQgYmUgY2xvc2luZyBpdCdzIG93biB0YWcuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiPFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydCh0YWduYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG91dCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiPlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmNsb3NlX3RhZyA9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlLmZpbmFsaXplKHBhcmVudCB8fCB7aHRtbDpcIlwifSwgcHJlc2V0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IFBhcnNlVGFnKGxleGVyLCBlbGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgICAgICAgICAgICBlbGUuaHRtbCArPSBsZXhlci5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KClcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wX25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpXHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IGxleGVyLnBvcyArIDE7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBlbGUuYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBQYXJzZVRhZywgcHJlc2V0cykgfHwgc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBSZXR1cm5zIGFsbCBhdHRyaWJ1dGVzIGluIGFuIGVsZW1lbnQgYXMgYSBrZXktdmFsdWUgb2JqZWN0LlxyXG5cclxuICAgIEBwYXJhbSB7TGV4ZXJ9IGxleGVyIC0gVGhlIGxleGljYWwgcGFyc2VyICBcclxuICAgIEBwYXJhbSB7T2JqZWN0fSBhdHRpYnMgLSBBbiBvYmplY3Qgd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBhdHRyaWJ1dGUga2V5cyBhbmQgdmFsdWVzLiBcclxuKi9cclxuZnVuY3Rpb24gR2V0QXR0cmlidXRlcyhsZXhlciwgYXR0cmlicykge1xyXG4gICAgd2hpbGUgKGxleGVyLnRleHQgIT09IFwiPlwiICYmIGxleGVyLnRleHQgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgaWYgKCFsZXhlci50ZXh0KSB0aHJvdyBFcnJvcihcIlVuZXhwZWN0ZWQgZW5kIG9mIGlucHV0LlwiKTtcclxuICAgICAgICBsZXQgYXR0cmliX25hbWUgPSBsZXhlci50ZXh0O1xyXG4gICAgICAgIGxldCBhdHRyaWJfdmFsID0gbnVsbDtcclxuICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobGV4ZXIudG9rZW4udHlwZSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJfdmFsID0gbGV4ZXIudGV4dC5zbGljZSgxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0aW5nIGF0dHJpYnV0ZSBkZWZpbml0aW9uLlwiKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF0dHJpYnNbYXR0cmliX25hbWVdID0gYXR0cmliX3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobGV4ZXIudGV4dCA9PSBcIi9cIikgLy8gVm9pZCBOb2Rlc1xyXG4gICAgICAgIGxleGVyLmFzc2VydChcIi9cIik7XHJcbiAgICBsZXhlci5hc3NlcnQoXCI+XCIpO1xyXG59IiwiaW1wb3J0IHtcclxuICAgIFZpZXdcclxufSBmcm9tIFwiLi92aWV3XCJcclxuLyoqXHJcbiAqIFRoaXMgQ2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHJlcXVlc3RzIHRvIHRoZSBzZXJ2ZXIuIEl0IGNhbiBhY3QgYXMgYSBjb250cm9sbGVyIHRvIHNwZWNpZmljYWxseSBwdWxsIGRhdGEgZG93biBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHB1c2ggaW50byBkYXRhIG1lbWJlcnMuXHJcbiAqXHJcbiAqIHtuYW1lfSBSZXF1ZXN0ZXJcclxuICovXHJcbmNsYXNzIFNldHRlciBleHRlbmRzIFZpZXcge1xyXG4gICAgY29uc3RydWN0b3IodXJsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQocmVxdWVzdF9vYmplY3QpIHtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnVybCArICggKHJlcXVlc3Rfb2JqZWN0KSA/IChcIj9cIiArIHRoaXMuX19wcm9jZXNzX3VybF9fKHJlcXVlc3Rfb2JqZWN0KSkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgZmV0Y2godXJsLCBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAocmVzcG9uc2UuanNvbigpLnRoZW4oKGopPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHJvY2Vzc19yZXNwb25zZV9fKGopO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBSZXNwb25zZTogJHtlcnJvcn0uIEVycm9yIFJlY2VpdmVkOiAke2Vycm9yfWApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc19yZXNwb25zZV9fKGpzb24pIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7fVxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gcmVzcG9uc2UudGFyZ2V0O1xyXG5cclxuICAgICAgICAvL3Jlc3VsdChyZXF1ZXN0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwpe1xyXG5cclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24pKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIFNldHRlclxyXG59IiwiaW1wb3J0IHtcclxuICAgIFR1cm5RdWVyeUludG9EYXRhLFxyXG4gICAgVHVybkRhdGFJbnRvUXVlcnksXHJcbiAgICBRdWVyeVN0cmluZ1RvUXVlcnlNYXAsXHJcbiAgICBRdWVyeU1hcFRvUXVlcnlTdHJpbmdcclxufSBmcm9tIFwiLi4vY29tbW9uL3VybC91cmxcIlxyXG5cclxuY2xhc3MgV1VSTCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihsb2NhdGlvbil7XHJcbiAgICAgICAgLy9wYXJzZSB0aGUgdXJsIGludG8gZGlmZmVyZW50IHNlY3Rpb25zXHJcbiAgICAgICAgdGhpcy5wYXRoID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gbG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IFF1ZXJ5U3RyaW5nVG9RdWVyeU1hcChsb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBhdGgocGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TG9jYXRpb24oKXtcclxuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSxcInJlcGxhY2VkIHN0YXRlXCIsYCR7dGhpc31gKTtcclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGF0aH0/JHtRdWVyeU1hcFRvUXVlcnlTdHJpbmcodGhpcy5xdWVyeSl9YDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGFzcyhjbGFzc19uYW1lKXtcclxuXHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXQgPSB7fSwgY2xhc3NfO1xyXG5cclxuICAgICAgICBpZihjbGFzc18gPSB0aGlzLnF1ZXJ5LmdldChjbGFzc19uYW1lKSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSwgdmFsXSBvZiBjbGFzc18uZW50cmllcygpKXtcclxuICAgICAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldChjbGFzc19uYW1lLCBrZXlfbmFtZSwgdmFsdWUpe1xyXG5cclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnF1ZXJ5LmhhcyhjbGFzc19uYW1lKSkgdGhpcy5xdWVyeS5zZXQoY2xhc3NfbmFtZSwgbmV3IE1hcCgpKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuICAgICAgICBjbGFzc18uc2V0KGtleV9uYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpe1xyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzXyA9IHRoaXMucXVlcnkuZ2V0KGNsYXNzX25hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChjbGFzc18pID8gY2xhc3NfLmdldChrZXlfbmFtZSkgOiBudWxsOyAgXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFdVUkxcclxufVxyXG4iLCIvKlxyXG5cdEhhbmRsZXMgdGhlIHBhcnNpbmcgYW5kIGxvYWRpbmcgb2YgY29tcG9uZW50cyBmb3IgYSBwYXJ0aWN1bGFyIHBhZ2UuXHJcbiovXHJcbmNsYXNzIFBhZ2VWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihVUkwsIGFwcF9wYWdlKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBVUkw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemluZ192aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnR5cGUgPSBcIm5vcm1hbFwiO1xyXG4gICAgICAgIGlmICghYXBwX3BhZ2UpIGRlYnVnZ2VyXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gYXBwX3BhZ2U7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50X2JhY2tlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvYWQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmdldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC51bmxvYWRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGltZSA9IE1hdGgubWF4KHRpbWUsIHRoaXMuZWxlbWVudHNbaV0udHJhbnNpdGlvbk91dCh0cmFuc2l0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5maW5hbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoYXBwX2VsZW1lbnQsIHd1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQubG9hZENvbXBvbmVudHMod3VybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB2YXIgdCA9IHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25Jbih0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGxldCBmaW5hbF90aW1lID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcIm1vZGFsXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRfYmFja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfYmFja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF9iYWNrZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsX2JhY2tlclwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF9iYWNrZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIH0sIDUwKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5nZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZUNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgLy9UaGlzIHdpbGwgdHJhbnNpdGlvbiBvYmplY3RzXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHlwZSh0eXBlKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZSB8fCBcIm5vcm1hbFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgUGFnZVZpZXdcclxufSIsImltcG9ydCB7TGV4fSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmNsYXNzIENvbG9yIGV4dGVuZHMgRmxvYXQ2NEFycmF5e1xyXG5cclxuXHRjb25zdHJ1Y3RvcihyLGcsYixhID0gMCl7XHJcblx0XHRzdXBlcig0KVxyXG5cclxuXHRcdHRoaXMuciA9IDA7XHJcblx0XHR0aGlzLmcgPSAwO1xyXG5cdFx0dGhpcy5iID0gMDtcclxuXHRcdHRoaXMuYSA9IDE7XHJcblxyXG5cdFx0aWYodHlwZW9mKHIpID09IFwic3RyaW5nXCIpe1xyXG5cdFx0XHR0aGlzLmZyb21TdHJpbmcocik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5yID0gciAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQociksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5nID0gZyAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQoZyksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5iID0gYiAvL01hdGgubWF4KE1hdGgubWluKE1hdGgucm91bmQoYiksMjU1KSwtMjU1KTtcclxuXHRcdFx0dGhpcy5hID0gYSAvL01hdGgubWF4KE1hdGgubWluKGEsMSksLTEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0IHIoKXtcclxuXHRcdHJldHVybiB0aGlzWzBdO1xyXG5cdH1cclxuXHJcblx0c2V0IHIocil7XHJcblx0XHR0aGlzWzBdID0gcjtcclxuXHR9XHJcblxyXG5cdGdldCBnKCl7XHJcblx0XHRyZXR1cm4gdGhpc1sxXTtcclxuXHR9XHJcblxyXG5cdHNldCBnKGcpe1xyXG5cdFx0dGhpc1sxXSA9IGc7XHJcblx0fVxyXG5cclxuXHRnZXQgYigpe1xyXG5cdFx0cmV0dXJuIHRoaXNbMl07XHJcblx0fVxyXG5cclxuXHRzZXQgYihiKXtcclxuXHRcdHRoaXNbMl0gPSBiO1xyXG5cdH1cclxuXHJcblx0Z2V0IGEoKXtcclxuXHRcdHJldHVybiB0aGlzWzNdO1xyXG5cdH1cclxuXHJcblx0c2V0IGEoYSl7XHJcblx0XHR0aGlzWzNdID0gYTtcclxuXHR9XHJcblxyXG5cdHNldChjb2xvcil7XHJcblx0XHR0aGlzLnIgPSBjb2xvci5yO1xyXG5cdFx0dGhpcy5nID0gY29sb3IuZztcclxuXHRcdHRoaXMuYiA9IGNvbG9yLmI7XHJcblx0XHR0aGlzLmEgPSAoY29sb3IuYSAhPSB1bmRlZmluZWQpID8gY29sb3IuYSA6IHRoaXMuYTtcclxuXHR9XHJcblxyXG5cdGFkZChjb2xvcil7XHJcblx0XHRyZXR1cm4gbmV3IENvbG9yKFxyXG5cdFx0XHRjb2xvci5yICsgdGhpcy5yLFxyXG5cdFx0XHRjb2xvci5nICsgdGhpcy5nLFxyXG5cdFx0XHRjb2xvci5iICsgdGhpcy5iLFxyXG5cdFx0XHRjb2xvci5hICsgdGhpcy5hXHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHRtdWx0KGNvbG9yKXtcclxuXHRcdGlmKHR5cGVvZihjb2xvcikgPT0gXCJudW1iZXJcIil7XHJcblx0XHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdFx0dGhpcy5yICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5nICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5iICogY29sb3IsXHJcblx0XHRcdFx0dGhpcy5hICogY29sb3JcclxuXHRcdFx0KVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBuZXcgQ29sb3IoXHJcblx0XHRcdFx0dGhpcy5yICogY29sb3IucixcclxuXHRcdFx0XHR0aGlzLmcgKiBjb2xvci5nLFxyXG5cdFx0XHRcdHRoaXMuYiAqIGNvbG9yLmIsXHJcblx0XHRcdFx0dGhpcy5hICogY29sb3IuYVxyXG5cdFx0XHQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdWIoY29sb3Ipe1xyXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihcclxuXHRcdFx0IHRoaXMuciAtIGNvbG9yLnIsXHJcblx0XHRcdCB0aGlzLmcgLSBjb2xvci5nLFxyXG5cdFx0XHQgdGhpcy5iIC0gY29sb3IuYixcclxuXHRcdFx0IHRoaXMuYSAtIGNvbG9yLmFcclxuXHRcdClcclxuXHR9XHJcblxyXG5cdHRvU3RyaW5nKCl7XHJcblx0XHRyZXR1cm4gYHJnYmEoJHt0aGlzLnJ8MH0sICR7dGhpcy5nfDB9LCAke3RoaXMuYnwwfSwgJHt0aGlzLmF9KWA7XHJcblx0fVxyXG5cclxuXHRmcm9tU3RyaW5nKHN0cmluZyl7XHJcblx0XHRcclxuXHRcdGxldCBsZXhlciA9IExleChzdHJpbmcpXHJcblxyXG5cdFx0bGV0IHIsZyxiLGE7XHJcblx0XHRzd2l0Y2gobGV4ZXIudG9rZW4udGV4dCl7XHJcblxyXG5cclxuXHRcdFx0Y2FzZSBcInJnYlwiOlxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAoXHJcblx0XHRcdFx0ciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0ZyA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdGxleGVyLm5leHQoKSAvLyAsXHJcblx0XHRcdFx0YiA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG5cdFx0XHRcdHRoaXMuc2V0KHtyLGcsYn0pO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgXCJyZ2JhXCI6XHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vIChcclxuXHRcdFx0XHRyID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRnID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRiID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcblx0XHRcdFx0bGV4ZXIubmV4dCgpIC8vICxcclxuXHRcdFx0XHRhID0gcGFyc2VGbG9hdChsZXhlci5uZXh0KCkudGV4dClcclxuXHRcdFx0XHR0aGlzLnNldCh7cixnLGIsYX0pO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgXCIjXCI6XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gbGV4ZXIubmV4dCgpLnRleHQ7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHJcblx0XHRcdFx0aWYoQ29sb3IuY29sb3JzW3N0cmluZ10pXHJcblx0XHRcdFx0XHR0aGlzLnNldChDb2xvci5jb2xvcnNbc3RyaW5nXSAgfHwgbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkNvbG9yLmNvbG9ycyA9IHtcclxuXHRcInRyYW5zcGFyZW50XCIgOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSxcclxuXHRcImNsZWFyXCIgOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSxcclxuXHRcInJlZFwiIDogbmV3IENvbG9yKDI1NSwgMCwgMCksXHJcblx0XCJncmVlblwiIDogbmV3IENvbG9yKDAsIDI1NSwgMCksXHJcblx0XCJibHVlXCIgOiBuZXcgQ29sb3IoMCwgMCwgMjU1KSxcclxuXHRcIkJsYWNrXCI6IG5ldyBDb2xvcigwLDAsMCksXHJcbiBcdFwiV2hpdGVcIjogbmV3IENvbG9yKDI1NSwyNTUsMjU1KSxcclxuIFx0XCJ3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNTUpLFxyXG4gXHRcIlJlZFwiOiBuZXcgQ29sb3IoMjU1LDAsMCksXHJcbiBcdFwiTGltZVwiOiBuZXcgQ29sb3IoMCwyNTUsMCksXHJcbiBcdFwiQmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDI1NSksXHJcbiBcdFwiWWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDApLFxyXG4gXHRcIkN5YW5cIjogbmV3IENvbG9yKDAsMjU1LDI1NSksXHJcbiBcdFwiQXF1YVwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJNYWdlbnRhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpICxcclxuIFx0XCJGdWNoc2lhXCI6IG5ldyBDb2xvcigyNTUsMCwyNTUpLFxyXG4gXHRcIlNpbHZlclwiOiBuZXcgQ29sb3IoMTkyLDE5MiwxOTIpLFxyXG4gXHRcIkdyYXlcIjogbmV3IENvbG9yKDEyOCwxMjgsMTI4KSxcclxuIFx0XCJNYXJvb25cIjogbmV3IENvbG9yKDEyOCwwLDApLFxyXG4gXHRcIk9saXZlXCI6IG5ldyBDb2xvcigxMjgsMTI4LDApLFxyXG4gXHRcIkdyZWVuXCI6IG5ldyBDb2xvcigwLDEyOCwwKSxcclxuIFx0XCJQdXJwbGVcIjogbmV3IENvbG9yKDEyOCwwLDEyOCksXHJcbiBcdFwiVGVhbFwiOiBuZXcgQ29sb3IoMCwxMjgsMTI4KSxcclxuIFx0XCJOYXZ5XCI6IG5ldyBDb2xvcigwLDAsMTI4KSxcclxuIFx0XCJtYXJvb25cIjogbmV3IENvbG9yKDEyOCwwLDApLFxyXG4gXHRcImRhcmsgcmVkXCI6IG5ldyBDb2xvcigxMzksMCwwKSxcclxuIFx0XCJicm93blwiOiBuZXcgQ29sb3IoMTY1LDQyLDQyKSxcclxuIFx0XCJmaXJlYnJpY2tcIjogbmV3IENvbG9yKDE3OCwzNCwzNCksXHJcbiBcdFwiY3JpbXNvblwiOiBuZXcgQ29sb3IoMjIwLDIwLDYwKSxcclxuIFx0XCJyZWRcIjogbmV3IENvbG9yKDI1NSwwLDApLFxyXG4gXHRcInRvbWF0b1wiOiBuZXcgQ29sb3IoMjU1LDk5LDcxKSxcclxuIFx0XCJjb3JhbFwiOiBuZXcgQ29sb3IoMjU1LDEyNyw4MCksXHJcbiBcdFwiaW5kaWFuIHJlZFwiOiBuZXcgQ29sb3IoMjA1LDkyLDkyKSxcclxuIFx0XCJsaWdodCBjb3JhbFwiOiBuZXcgQ29sb3IoMjQwLDEyOCwxMjgpLFxyXG4gXHRcImRhcmsgc2FsbW9uXCI6IG5ldyBDb2xvcigyMzMsMTUwLDEyMiksXHJcbiBcdFwic2FsbW9uXCI6IG5ldyBDb2xvcigyNTAsMTI4LDExNCksXHJcbiBcdFwibGlnaHQgc2FsbW9uXCI6IG5ldyBDb2xvcigyNTUsMTYwLDEyMiksXHJcbiBcdFwib3JhbmdlIHJlZFwiOiBuZXcgQ29sb3IoMjU1LDY5LDApLFxyXG4gXHRcImRhcmsgb3JhbmdlXCI6IG5ldyBDb2xvcigyNTUsMTQwLDApLFxyXG4gXHRcIm9yYW5nZVwiOiBuZXcgQ29sb3IoMjU1LDE2NSwwKSxcclxuIFx0XCJnb2xkXCI6IG5ldyBDb2xvcigyNTUsMjE1LDApLFxyXG4gXHRcImRhcmsgZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMTg0LDEzNCwxMSksXHJcbiBcdFwiZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMjE4LDE2NSwzMiksXHJcbiBcdFwicGFsZSBnb2xkZW4gcm9kXCI6IG5ldyBDb2xvcigyMzgsMjMyLDE3MCksXHJcbiBcdFwiZGFyayBraGFraVwiOiBuZXcgQ29sb3IoMTg5LDE4MywxMDcpLFxyXG4gXHRcImtoYWtpXCI6IG5ldyBDb2xvcigyNDAsMjMwLDE0MCksXHJcbiBcdFwib2xpdmVcIjogbmV3IENvbG9yKDEyOCwxMjgsMCksXHJcbiBcdFwieWVsbG93XCI6IG5ldyBDb2xvcigyNTUsMjU1LDApLFxyXG4gXHRcInllbGxvdyBncmVlblwiOiBuZXcgQ29sb3IoMTU0LDIwNSw1MCksXHJcbiBcdFwiZGFyayBvbGl2ZSBncmVlblwiOiBuZXcgQ29sb3IoODUsMTA3LDQ3KSxcclxuIFx0XCJvbGl2ZSBkcmFiXCI6IG5ldyBDb2xvcigxMDcsMTQyLDM1KSxcclxuIFx0XCJsYXduIGdyZWVuXCI6IG5ldyBDb2xvcigxMjQsMjUyLDApLFxyXG4gXHRcImNoYXJ0IHJldXNlXCI6IG5ldyBDb2xvcigxMjcsMjU1LDApLFxyXG4gXHRcImdyZWVuIHllbGxvd1wiOiBuZXcgQ29sb3IoMTczLDI1NSw0NyksXHJcbiBcdFwiZGFyayBncmVlblwiOiBuZXcgQ29sb3IoMCwxMDAsMCksXHJcbiBcdFwiZ3JlZW5cIjogbmV3IENvbG9yKDAsMTI4LDApLFxyXG4gXHRcImZvcmVzdCBncmVlblwiOiBuZXcgQ29sb3IoMzQsMTM5LDM0KSxcclxuIFx0XCJsaW1lXCI6IG5ldyBDb2xvcigwLDI1NSwwKSxcclxuIFx0XCJsaW1lIGdyZWVuXCI6IG5ldyBDb2xvcig1MCwyMDUsNTApLFxyXG4gXHRcImxpZ2h0IGdyZWVuXCI6IG5ldyBDb2xvcigxNDQsMjM4LDE0NCksXHJcbiBcdFwicGFsZSBncmVlblwiOiBuZXcgQ29sb3IoMTUyLDI1MSwxNTIpLFxyXG4gXHRcImRhcmsgc2VhIGdyZWVuXCI6IG5ldyBDb2xvcigxNDMsMTg4LDE0MyksXHJcbiBcdFwibWVkaXVtIHNwcmluZyBncmVlblwiOiBuZXcgQ29sb3IoMCwyNTAsMTU0KSxcclxuIFx0XCJzcHJpbmcgZ3JlZW5cIjogbmV3IENvbG9yKDAsMjU1LDEyNyksXHJcbiBcdFwic2VhIGdyZWVuXCI6IG5ldyBDb2xvcig0NiwxMzksODcpLFxyXG4gXHRcIm1lZGl1bSBhcXVhIG1hcmluZVwiOiBuZXcgQ29sb3IoMTAyLDIwNSwxNzApLFxyXG4gXHRcIm1lZGl1bSBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDYwLDE3OSwxMTMpLFxyXG4gXHRcImxpZ2h0IHNlYSBncmVlblwiOiBuZXcgQ29sb3IoMzIsMTc4LDE3MCksXHJcbiBcdFwiZGFyayBzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcig0Nyw3OSw3OSksXHJcbiBcdFwidGVhbFwiOiBuZXcgQ29sb3IoMCwxMjgsMTI4KSxcclxuIFx0XCJkYXJrIGN5YW5cIjogbmV3IENvbG9yKDAsMTM5LDEzOSksXHJcbiBcdFwiYXF1YVwiOiBuZXcgQ29sb3IoMCwyNTUsMjU1KSxcclxuIFx0XCJjeWFuXCI6IG5ldyBDb2xvcigwLDI1NSwyNTUpLFxyXG4gXHRcImxpZ2h0IGN5YW5cIjogbmV3IENvbG9yKDIyNCwyNTUsMjU1KSxcclxuIFx0XCJkYXJrIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoMCwyMDYsMjA5KSxcclxuIFx0XCJ0dXJxdW9pc2VcIjogbmV3IENvbG9yKDY0LDIyNCwyMDgpLFxyXG4gXHRcIm1lZGl1bSB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDcyLDIwOSwyMDQpLFxyXG4gXHRcInBhbGUgdHVycXVvaXNlXCI6IG5ldyBDb2xvcigxNzUsMjM4LDIzOCksXHJcbiBcdFwiYXF1YSBtYXJpbmVcIjogbmV3IENvbG9yKDEyNywyNTUsMjEyKSxcclxuIFx0XCJwb3dkZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMTc2LDIyNCwyMzApLFxyXG4gXHRcImNhZGV0IGJsdWVcIjogbmV3IENvbG9yKDk1LDE1OCwxNjApLFxyXG4gXHRcInN0ZWVsIGJsdWVcIjogbmV3IENvbG9yKDcwLDEzMCwxODApLFxyXG4gXHRcImNvcm4gZmxvd2VyIGJsdWVcIjogbmV3IENvbG9yKDEwMCwxNDksMjM3KSxcclxuIFx0XCJkZWVwIHNreSBibHVlXCI6IG5ldyBDb2xvcigwLDE5MSwyNTUpLFxyXG4gXHRcImRvZGdlciBibHVlXCI6IG5ldyBDb2xvcigzMCwxNDQsMjU1KSxcclxuIFx0XCJsaWdodCBibHVlXCI6IG5ldyBDb2xvcigxNzMsMjE2LDIzMCksXHJcbiBcdFwic2t5IGJsdWVcIjogbmV3IENvbG9yKDEzNSwyMDYsMjM1KSxcclxuIFx0XCJsaWdodCBza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMTM1LDIwNiwyNTApLFxyXG4gXHRcIm1pZG5pZ2h0IGJsdWVcIjogbmV3IENvbG9yKDI1LDI1LDExMiksXHJcbiBcdFwibmF2eVwiOiBuZXcgQ29sb3IoMCwwLDEyOCksXHJcbiBcdFwiZGFyayBibHVlXCI6IG5ldyBDb2xvcigwLDAsMTM5KSxcclxuIFx0XCJtZWRpdW0gYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDIwNSksXHJcbiBcdFwiYmx1ZVwiOiBuZXcgQ29sb3IoMCwwLDI1NSksXHJcbiBcdFwicm95YWwgYmx1ZVwiOiBuZXcgQ29sb3IoNjUsMTA1LDIyNSksXHJcbiBcdFwiYmx1ZSB2aW9sZXRcIjogbmV3IENvbG9yKDEzOCw0MywyMjYpLFxyXG4gXHRcImluZGlnb1wiOiBuZXcgQ29sb3IoNzUsMCwxMzApLFxyXG4gXHRcImRhcmsgc2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoNzIsNjEsMTM5KSxcclxuIFx0XCJzbGF0ZSBibHVlXCI6IG5ldyBDb2xvcigxMDYsOTAsMjA1KSxcclxuIFx0XCJtZWRpdW0gc2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoMTIzLDEwNCwyMzgpLFxyXG4gXHRcIm1lZGl1bSBwdXJwbGVcIjogbmV3IENvbG9yKDE0NywxMTIsMjE5KSxcclxuIFx0XCJkYXJrIG1hZ2VudGFcIjogbmV3IENvbG9yKDEzOSwwLDEzOSksXHJcbiBcdFwiZGFyayB2aW9sZXRcIjogbmV3IENvbG9yKDE0OCwwLDIxMSksXHJcbiBcdFwiZGFyayBvcmNoaWRcIjogbmV3IENvbG9yKDE1Myw1MCwyMDQpLFxyXG4gXHRcIm1lZGl1bSBvcmNoaWRcIjogbmV3IENvbG9yKDE4Niw4NSwyMTEpLFxyXG4gXHRcInB1cnBsZVwiOiBuZXcgQ29sb3IoMTI4LDAsMTI4KSxcclxuIFx0XCJ0aGlzdGxlXCI6IG5ldyBDb2xvcigyMTYsMTkxLDIxNiksXHJcbiBcdFwicGx1bVwiOiBuZXcgQ29sb3IoMjIxLDE2MCwyMjEpLFxyXG4gXHRcInZpb2xldFwiOiBuZXcgQ29sb3IoMjM4LDEzMCwyMzgpLFxyXG4gXHRcIm1hZ2VudGFcIjogbmV3IENvbG9yKDI1NSwwLDI1NSksXHJcbiBcdFwiZnVjaHNpYVwiOiBuZXcgQ29sb3IoMjU1LDAsMjU1KSxcclxuIFx0XCJvcmNoaWRcIjogbmV3IENvbG9yKDIxOCwxMTIsMjE0KSxcclxuIFx0XCJtZWRpdW0gdmlvbGV0IHJlZFwiOiBuZXcgQ29sb3IoMTk5LDIxLDEzMyksXHJcbiBcdFwicGFsZSB2aW9sZXQgcmVkXCI6IG5ldyBDb2xvcigyMTksMTEyLDE0NyksXHJcbiBcdFwiZGVlcCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsMjAsMTQ3KSxcclxuIFx0XCJob3QgcGlua1wiOiBuZXcgQ29sb3IoMjU1LDEwNSwxODApLFxyXG4gXHRcImxpZ2h0IHBpbmtcIjogbmV3IENvbG9yKDI1NSwxODIsMTkzKSxcclxuIFx0XCJwaW5rXCI6IG5ldyBDb2xvcigyNTUsMTkyLDIwMyksXHJcbiBcdFwiYW50aXF1ZSB3aGl0ZVwiOiBuZXcgQ29sb3IoMjUwLDIzNSwyMTUpLFxyXG4gXHRcImJlaWdlXCI6IG5ldyBDb2xvcigyNDUsMjQ1LDIyMCksXHJcbiBcdFwiYmlzcXVlXCI6IG5ldyBDb2xvcigyNTUsMjI4LDE5NiksXHJcbiBcdFwiYmxhbmNoZWQgYWxtb25kXCI6IG5ldyBDb2xvcigyNTUsMjM1LDIwNSksXHJcbiBcdFwid2hlYXRcIjogbmV3IENvbG9yKDI0NSwyMjIsMTc5KSxcclxuIFx0XCJjb3JuIHNpbGtcIjogbmV3IENvbG9yKDI1NSwyNDgsMjIwKSxcclxuIFx0XCJsZW1vbiBjaGlmZm9uXCI6IG5ldyBDb2xvcigyNTUsMjUwLDIwNSksXHJcbiBcdFwibGlnaHQgZ29sZGVuIHJvZCB5ZWxsb3dcIjogbmV3IENvbG9yKDI1MCwyNTAsMjEwKSxcclxuIFx0XCJsaWdodCB5ZWxsb3dcIjogbmV3IENvbG9yKDI1NSwyNTUsMjI0KSxcclxuIFx0XCJzYWRkbGUgYnJvd25cIjogbmV3IENvbG9yKDEzOSw2OSwxOSksXHJcbiBcdFwic2llbm5hXCI6IG5ldyBDb2xvcigxNjAsODIsNDUpLFxyXG4gXHRcImNob2NvbGF0ZVwiOiBuZXcgQ29sb3IoMjEwLDEwNSwzMCksXHJcbiBcdFwicGVydVwiOiBuZXcgQ29sb3IoMjA1LDEzMyw2MyksXHJcbiBcdFwic2FuZHkgYnJvd25cIjogbmV3IENvbG9yKDI0NCwxNjQsOTYpLFxyXG4gXHRcImJ1cmx5IHdvb2RcIjogbmV3IENvbG9yKDIyMiwxODQsMTM1KSxcclxuIFx0XCJ0YW5cIjogbmV3IENvbG9yKDIxMCwxODAsMTQwKSxcclxuIFx0XCJyb3N5IGJyb3duXCI6IG5ldyBDb2xvcigxODgsMTQzLDE0MyksXHJcbiBcdFwibW9jY2FzaW5cIjogbmV3IENvbG9yKDI1NSwyMjgsMTgxKSxcclxuIFx0XCJuYXZham8gd2hpdGVcIjogbmV3IENvbG9yKDI1NSwyMjIsMTczKSxcclxuIFx0XCJwZWFjaCBwdWZmXCI6IG5ldyBDb2xvcigyNTUsMjE4LDE4NSksXHJcbiBcdFwibWlzdHkgcm9zZVwiOiBuZXcgQ29sb3IoMjU1LDIyOCwyMjUpLFxyXG4gXHRcImxhdmVuZGVyIGJsdXNoXCI6IG5ldyBDb2xvcigyNTUsMjQwLDI0NSksXHJcbiBcdFwibGluZW5cIjogbmV3IENvbG9yKDI1MCwyNDAsMjMwKSxcclxuIFx0XCJvbGQgbGFjZVwiOiBuZXcgQ29sb3IoMjUzLDI0NSwyMzApLFxyXG4gXHRcInBhcGF5YSB3aGlwXCI6IG5ldyBDb2xvcigyNTUsMjM5LDIxMyksXHJcbiBcdFwic2VhIHNoZWxsXCI6IG5ldyBDb2xvcigyNTUsMjQ1LDIzOCksXHJcbiBcdFwibWludCBjcmVhbVwiOiBuZXcgQ29sb3IoMjQ1LDI1NSwyNTApLFxyXG4gXHRcInNsYXRlIGdyYXlcIjogbmV3IENvbG9yKDExMiwxMjgsMTQ0KSxcclxuIFx0XCJsaWdodCBzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcigxMTksMTM2LDE1MyksXHJcbiBcdFwibGlnaHQgc3RlZWwgYmx1ZVwiOiBuZXcgQ29sb3IoMTc2LDE5NiwyMjIpLFxyXG4gXHRcImxhdmVuZGVyXCI6IG5ldyBDb2xvcigyMzAsMjMwLDI1MCksXHJcbiBcdFwiZmxvcmFsIHdoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjUwLDI0MCksXHJcbiBcdFwiYWxpY2UgYmx1ZVwiOiBuZXcgQ29sb3IoMjQwLDI0OCwyNTUpLFxyXG4gXHRcImdob3N0IHdoaXRlXCI6IG5ldyBDb2xvcigyNDgsMjQ4LDI1NSksXHJcbiBcdFwiaG9uZXlkZXdcIjogbmV3IENvbG9yKDI0MCwyNTUsMjQwKSxcclxuIFx0XCJpdm9yeVwiOiBuZXcgQ29sb3IoMjU1LDI1NSwyNDApLFxyXG4gXHRcImF6dXJlXCI6IG5ldyBDb2xvcigyNDAsMjU1LDI1NSksXHJcbiBcdFwic25vd1wiOiBuZXcgQ29sb3IoMjU1LDI1MCwyNTApLFxyXG4gXHRcImJsYWNrXCI6IG5ldyBDb2xvcigwLDAsMCksXHJcbiBcdFwiZGltIGdyYXlcIjogbmV3IENvbG9yKDEwNSwxMDUsMTA1KSxcclxuIFx0XCJkaW0gZ3JleVwiOiBuZXcgQ29sb3IoMTA1LDEwNSwxMDUpLFxyXG4gXHRcImdyYXlcIjogbmV3IENvbG9yKDEyOCwxMjgsMTI4KSxcclxuIFx0XCJncmV5XCI6IG5ldyBDb2xvcigxMjgsMTI4LDEyOCksXHJcbiBcdFwiZGFyayBncmF5XCI6IG5ldyBDb2xvcigxNjksMTY5LDE2OSksXHJcbiBcdFwiZGFyayBncmV5XCI6IG5ldyBDb2xvcigxNjksMTY5LDE2OSksXHJcbiBcdFwic2lsdmVyXCI6IG5ldyBDb2xvcigxOTIsMTkyLDE5MiksXHJcbiBcdFwibGlnaHQgZ3JheVwiOiBuZXcgQ29sb3IoMjExLDIxMSwyMTEpLFxyXG4gXHRcImxpZ2h0IGdyZXlcIjogbmV3IENvbG9yKDIxMSwyMTEsMjExKSxcclxuIFx0XCJnYWluc2Jvcm9cIjogbmV3IENvbG9yKDIyMCwyMjAsMjIwKSxcclxuIFx0XCJ3aGl0ZSBzbW9rZVwiOiBuZXcgQ29sb3IoMjQ1LDI0NSwyNDUpLFxyXG4gXHRcIndoaXRlXCI6IG5ldyBDb2xvcigyNTUsMjU1LDI1NSlcclxufVxyXG5cclxuZXhwb3J0IHtDb2xvcn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENvbG9yXHJcbn0gZnJvbSBcIi4vY29sb3JcIlxyXG5pbXBvcnQge1xyXG4gICAgQ0JlemllclxyXG59IGZyb20gXCIuLi9jb21tb25cIlxyXG5pbXBvcnQge1xyXG4gICAgU2NoZWR1bGVyXHJcbn0gZnJvbSBcIi4uL3NjaGVkdWxlclwiXHJcblxyXG52YXIgZWFzZV9vdXQgPSBuZXcgQ0JlemllcigwLjUsIDAuMiwgMCwgMSk7XHJcblxyXG5pZiAoIXJlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChlKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChlLCAxMDAwKTtcclxuICAgIH1cclxuXHJcbmNsYXNzIFRUX0Zyb20ge1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIC8vZXh0cmFjdGVkIGFuaW1hdGFibGUgY29tcG9uZW50c1xyXG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKSk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJoZWlnaHRcIikpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKSk7XHJcblxyXG4gICAgICAgIC8vKmlmKCF0aGlzLmhlaWdodCB8fCAhdGhpcy53aWR0aCl7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZWN0LmhlaWdodDtcclxuICAgICAgICB0aGlzLndpZHRoID0gcmVjdC53aWR0aDtcclxuICAgICAgICAvL30qL1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gcGFyc2VGbG9hdChyZWN0LmxlZnQpO1xyXG4gICAgICAgIHRoaXMudG9wID0gcGFyc2VGbG9hdChyZWN0LnRvcCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbG9yID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVFRfVG8gZXh0ZW5kcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGZyb20pIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXMgPSAoKGVsZW1lbnQuc3R5bGUudG9wKSAmJiAoZWxlbWVudC5zdHlsZS5sZWZ0KSk7XHJcblxyXG4gICAgICAgIHRoaXMucnQgPSAoZWxlbWVudC5zdHlsZS50b3ApID8gKGVsZW1lbnQuc3R5bGUudG9wKSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5ybCA9IGVsZW1lbnQuc3R5bGUubGVmdCA/IGVsZW1lbnQuc3R5bGUubGVmdCA6IG51bGw7XHJcblxyXG5cclxuICAgICAgICAvL2dldCB0aGUgcmVsYXRpdmUgb2Zmc2V0IG9mIHRoaXMgb2JqZWN0XHJcbiAgICAgICAgdmFyIG9mZnNldF94ID0gMDsgLSBlbGVtZW50LmdldFBhcmVudFdpbmRvd0xlZnQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0X3kgPSAwOyAtIGVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKCk7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRfeCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImxlZnRcIikpO1xyXG4gICAgICAgIHZhciBvZmZzZXRfeSA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInRvcFwiKSk7XHJcbiAgICAgICAgLy9BbmQgYWRqdXN0IHN0YXJ0IHRvIHJlc3BlY3QgdGhlIGVsZW1lbnRzIG93biBwYXJlbnRhbCBvZmZzZXRzXHJcbiAgICAgICAgdmFyIGRpZmZ4ID0gdGhpcy5sZWZ0IC0gdGhpcy5mcm9tLmxlZnQ7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2Zmc2V0X3g7XHJcbiAgICAgICAgdGhpcy5mcm9tLmxlZnQgPSB0aGlzLmxlZnQgLSBkaWZmeDtcclxuXHJcbiAgICAgICAgdmFyIGRpZmZ5ID0gdGhpcy50b3AgLSB0aGlzLmZyb20udG9wO1xyXG4gICAgICAgIHRoaXMudG9wID0gb2Zmc2V0X3k7XHJcbiAgICAgICAgdGhpcy5mcm9tLnRvcCA9IHRoaXMudG9wIC0gZGlmZnk7XHJcblxyXG4gICAgICAgIHRoaXMudGltZSA9IDYwICogLjM1O1xyXG4gICAgICAgIHRoaXMucyA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2xvcl9vID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIik7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRfbyA9IGVsZW1lbnQuc3R5bGUud2lkdGg7XHJcbiAgICAgICAgdGhpcy53aWR0aF9vID0gZWxlbWVudC5zdHlsZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3BfbyA9IHRoaXMudG9wO1xyXG4gICAgICAgIHRoaXMubGVmdF9vID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIHRoaXMucG9zID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInBvc2l0aW9uXCIpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVuZCgpOyAvL1Jlc3RvcmUgZXZlcnl0aGluZyBiYWNrIHRvIGl0J3Mgb3JpZ2luYWwgdHlwZTtcclxuICAgICAgICB0aGlzLmZyb20gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucyA9IEluZmluaXR5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5mcm9tLnRvcCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMuZnJvbS5sZWZ0ICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuZnJvbS53aWR0aCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5mcm9tLmhlaWdodCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIHRoaXMucysrXHJcblxyXG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMucyAvIHRoaXMudGltZTtcclxuXHJcbiAgICAgICAgaWYgKHQgPiAxKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciByYXRpbyA9IGVhc2Vfb3V0LmdldFlhdFgodCk7XHJcblxyXG4gICAgICAgIGlmIChyYXRpbyA+IDEpIHJhdGlvID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IE1hdGgucm91bmQoKHRoaXMudG9wIC0gdGhpcy5mcm9tLnRvcCkgKiByYXRpbyArIHRoaXMuZnJvbS50b3ApICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCgodGhpcy5sZWZ0IC0gdGhpcy5mcm9tLmxlZnQpICogcmF0aW8gKyB0aGlzLmZyb20ubGVmdCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gKCh0aGlzLndpZHRoIC0gdGhpcy5mcm9tLndpZHRoKSAqIHJhdGlvICsgdGhpcy5mcm9tLndpZHRoKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gKCh0aGlzLmhlaWdodCAtIHRoaXMuZnJvbS5oZWlnaHQpICogcmF0aW8gKyB0aGlzLmZyb20uaGVpZ2h0KSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKHRoaXMuY29sb3Iuc3ViKHRoaXMuZnJvbS5jb2xvcikubXVsdChyYXRpbykuYWRkKHRoaXMuZnJvbS5jb2xvcikpICsgXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuICh0IDwgMC45OTk5OTk1KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0X287XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aF9vO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLnJ0O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5ybDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFRUUGFpciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlX3RvLCBlX2Zyb20pIHtcclxuICAgICAgICB0aGlzLmIgPSAoZV9mcm9tIGluc3RhbmNlb2YgVFRfRnJvbSkgPyBlX2Zyb20gOiBuZXcgVFRfRnJvbShlX2Zyb20pO1xyXG4gICAgICAgIHRoaXMuYSA9IG5ldyBUVF9UbyhlX3RvLCB0aGlzLmIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hLmVsZW1lbnQuX19UVF9fKVxyXG4gICAgICAgICAgICB0aGlzLmEuZWxlbWVudC5fX1RUX18uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5iLmVsZW1lbnQuX19UVF9fKVxyXG4gICAgICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICB0aGlzLmEuZWxlbWVudC5fX1RUX18gPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYi5lbGVtZW50Ll9fVFRfXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuYi5lbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLmIuZWxlbWVudC5fX1RUX18gPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmEuZWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5hLmVsZW1lbnQuX19UVF9fID0gbnVsbDtcclxuICAgICAgICB0aGlzLmEuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmEuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEuc3RlcCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBUcmFuc2Zvcm1SdW5uZXIgPSBuZXcgKGNsYXNze1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wYWlycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoUGFpcihwYWlyKSB7XHJcbiAgICAgICAgdGhpcy5wYWlycy5wdXNoKHBhaXIpO1xyXG4gICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUocmF0aW8pIHtcclxuICAgICAgICBsZXQgcnAgPSB0aGlzLnBhaXJzO1xyXG5cclxuICAgICAgICBpZihycC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIF9ycCA9IHJwW2ldO1xyXG4gICAgICAgICAgICBpZiAoIV9ycC5zdGVwKHJhdGlvKSkge1xyXG4gICAgICAgICAgICAgICAgX3JwLmRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgIHJwLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59KSgpXHJcblxyXG5cclxuLyoqXHJcbiAgICBUcmFuc2Zvcm0gb25lIGVsZW1lbnQgZnJvbSBhbm90aGVyIGJhY2sgdG8gaXRzZWxmXHJcbiovXHJcbmZ1bmN0aW9uIFRyYW5zZm9ybVRvKGVsZW1lbnRfZnJvbSwgZWxlbWVudF90bywgSElERV9PVEhFUikge1xyXG5cclxuXHJcbiAgICBpZiAoIWVsZW1lbnRfdG8pIHtcclxuXHJcbiAgICAgICAgbGV0IGEgPSAoZnJvbSkgPT4gKGVsZW1lbnRfdG8sIEhJREVfT1RIRVIpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhaXIgPSBuZXcgVFRQYWlyKGVsZW1lbnRfdG8sIGZyb20pO1xyXG4gICAgICAgICAgICBUcmFuc2Zvcm1SdW5uZXIucHVzaFBhaXIocGFpcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYiA9IGEobmV3IFRUX0Zyb20oZWxlbWVudF9mcm9tKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYWlyID0gbmV3IFRUUGFpcihlbGVtZW50X3RvLCBlbGVtZW50X2Zyb20pO1xyXG5cclxuICAgIFRyYW5zZm9ybVJ1bm5lci5wdXNoUGFpcihwYWlyKTtcclxuXHJcbiAgICBwYWlyLnN0YXJ0KCk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IHtcclxuICAgIFRyYW5zZm9ybVRvXHJcbn0iLCJpbXBvcnQge1xyXG5cdFN0eWxlTWFwcGluZ3NcclxufSBmcm9tIFwiLi9zdHlsZV9tYXBwaW5nc1wiXHJcbmltcG9ydCB7Q29sb3J9IGZyb20gXCIuL2NvbG9yXCIgXHJcbmltcG9ydCB7VHJhbnNmb3JtVG99IGZyb20gXCIuL3RyYW5zZm9ybXRvXCJcclxuXHJcbmNsYXNzIFN0eWxlQW5pbUJsb2Mge1xyXG5cdGNvbnN0cnVjdG9yKHN0eWxlLCB0b192YWwsIGR1cmF0aW9uLCBkZWxheSkge1xyXG5cdFx0dGhpcy5zdHlsZSA9IHN0eWxlO1xyXG5cdFx0dGhpcy5kZWxheSA9IGRlbGF5O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy50b192YWwgPSB0b192YWw7XHJcblx0XHR0aGlzLnN0ZXAgPSAwO1xyXG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcclxuXHRcdHRoaXMucHJldiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgU3R5bGVBbmltQmxvY1BlcmNlbnRhZ2UgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NQaXhlbCBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY0VNIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jQ29sb3IgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcblxyXG5jbGFzcyBTdHlsZUtleUZyYW1lZEFuaW1CbG9jIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7XHJcblx0Y29uc3RydWN0b3Ioc3R5bGUsIGtleV9mcmFtZXMsIGRlbGF5KSB7XHJcblx0XHRzdXBlcigpXHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBbmltQnVkZHkge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdHRoaXMuc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcclxuXHRcdHRoaXMuZmlyc3RfYW5pbWF0aW9uID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldEFuaW1hdGlvbih2YWxzKSB7XHJcblx0XHRsZXQgYW5pbV9ibG9jID0gbnVsbDtcclxuXHRcdGlmICh2YWxzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdH1cclxuXHRcdGlmKGFuaW1fYmxvYyl7XHJcblx0XHRcdHRoaXMuX19pbnNlcnRfXyhhYik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfX2luc2VydF9fKGFiKSB7XHJcblx0XHRsZXQgYmxvYyA9IHRoaXMuZmlyc3RfYW5pbWF0aW9uO1xyXG5cclxuXHRcdHdoaWxlIChibG9jKSB7XHJcblx0XHRcdGlmIChibG9jLnN0eWxlID0gYWIuc3R5bGUpIHtcclxuXHRcdFx0XHRhYi5kZXN0cnVjdG9yKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0YWIubmV4dCA9IHRoaXMuZmlyc3RfYW5pbWF0aW9uO1xyXG5cdFx0aWYgKHRoaXMuZmlyc3RfYW5pbWF0aW9uKVxyXG5cdFx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbi5wcmV2ID0gYWI7XHJcblx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IGFiO1xyXG5cdH1cclxuXHJcblx0c3RlcChzdGVwX211bHRpcGxpZXIpIHtcclxuXHRcdHZhciBhbmltX2Jsb2MgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHRcdGlmIChhbmltX2Jsb2MpXHJcblx0XHRcdHdoaWxlIChhbmltX2Jsb2MpXHJcblx0XHRcdFx0aWYgKCFhbmltX2Jsb2Muc3RlcChzdGVwX211bHRpcGxpZXIpKSB7XHJcblx0XHRcdFx0XHRpZiAoIWFuaW1fYmxvYy5wcmV2KVxyXG5cdFx0XHRcdFx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRhbmltX2Jsb2MucHJldi5uZXh0ID0gYW5pbV9ibG9jLm5leHQ7XHJcblx0XHRcdFx0XHRpZiAoYW5pbV9ibG9jLm5leHQpXHJcblx0XHRcdFx0XHRcdGFuaW1fYmxvYy5uZXh0LnByZXYgPSBhbmltX2Jsb2MucHJldjtcclxuXHJcblx0XHRcdFx0XHRsZXQgbmV4dCA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cclxuXHRcdFx0XHRcdGFuaW1fYmxvYy5kZXN0cnVjdG9yKCk7XHJcblxyXG5cdFx0XHRcdFx0YW5pbV9ibG9jID0gbmV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHRcdGFuaW1fYmxvYyA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGdldFN0eWxlKCkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRzZXRTdHlsZSh2YWx1ZSkge1xyXG5cclxuXHR9XHJcblxyXG5cdG9uUmVzaXplKCkge1xyXG5cdFx0dGhpcy5nZXRTdHlsZSgpXHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBbmltQ29yZXtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYW5pbV9ncm91cCA9IHt9O1xyXG5cdFx0dGhpcy5ydW5uaW5nX2FuaW1hdGlvbnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblx0XHR2YXIgbCA9IHRoaXMucnVubmluZ19hbmltYXRpb25zLmxlbmdodDtcclxuXHRcdGlmIChsID4gMCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cclxuXHRcdFx0XHR2YXIgYWIgPSB0aGlzLnJ1bm5pbmdfYW5pbWF0aW9uc1tpXTtcclxuXHJcblx0XHRcdFx0aWYgKGFiICYmICFhYi5zdGVwKHN0ZXBfbXVsdGlwbGllcikpIHtcclxuXHRcdFx0XHRcdGFiLmRlc3RydWN0b3IoKTtcclxuXHRcdFx0XHRcdHRoaXMucnVubmluZ19hbmltYXRpb25zW2ldID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFkZEJsb2MoYW5pbV9ibG9jKSB7XHJcblx0XHRpZiAoYW5pbV9ibG9jIGluc3RhbmNlb2YgQW5pbUJsb2MpIHtcclxuXHRcdFx0Ly9hZGQgdG8gZ3JvdXAgb2Ygb2JqZWN0XHJcblxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtBbmltQ29yZSwgVHJhbnNmb3JtVG8sIENvbG9yfSIsImltcG9ydCB7IHNldExpbmtzIH0gZnJvbSBcIi4vc2V0bGlua3NcIlxyXG5cclxuaW1wb3J0IHsgVHJhbnNmb3JtVG8gfSBmcm9tIFwiLi4vYW5pbWF0aW9uL2FuaW1hdGlvblwiXHJcblxyXG5pbXBvcnQgeyBTb3VyY2VDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi9zb3VyY2Uvc291cmNlX2NvbnN0cnVjdG9yXCJcclxuXHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi4vdmlld1wiXHJcblxyXG5pbXBvcnQgeyBHZXR0ZXIgfSBmcm9tIFwiLi4vZ2V0dGVyXCJcclxuXHJcbmltcG9ydCB7IFNvdXJjZUJhc2UgfSBmcm9tIFwiLi4vc291cmNlL2Jhc2VcIlxyXG5cclxuaW1wb3J0IHsgVHVybkRhdGFJbnRvUXVlcnkgfSBmcm9tIFwiLi4vY29tbW9uXCJcclxuXHJcbmltcG9ydCB7IERhdGFUZW1wbGF0ZSB9IGZyb20gXCIuL2RhdGFfdGVtcGxhdGVcIlxyXG5cclxuaW1wb3J0IHsgVHJhbnNpdGlvbmVlciB9IGZyb20gXCIuLi9hbmltYXRpb24vdHJhbnNpdGlvbi90cmFuc2l0aW9uZWVyXCJcclxuXHJcbi8qKiBAbmFtZXNwYWNlIFNvdXJjZSAqL1xyXG5cclxuLyoqXHJcbiAgICBIYW5kbGVzIHRoZSB0cmFuc2l0aW9uIG9mIHNlcGFyYXRlIGVsZW1lbnRzLlxyXG4qL1xyXG5jbGFzcyBCYXNpY1NvdXJjZSBleHRlbmRzIFNvdXJjZUJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgc3VwZXIobnVsbCwgZWxlbWVudCwge30sIHt9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmNob3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuTE9BREVEID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBUcmFuc2l0aW9uZWVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZW1lbnQpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uXSA9IGNoaWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIGEgZmFsbGJhY2sgY29tcG9uZW50IGlmIGNvbnN0cnVjdGluZyBhIEN1c3RvbVNvdXJjZSBvciBub3JtYWwgU291cmNlIHRocm93cyBhbiBlcnJvci5cclxuKi9cclxuXHJcbmNsYXNzIEZhaWxlZFNvdXJjZSBleHRlbmRzIFNvdXJjZUJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3JfbWVzc2FnZSwgcHJlc2V0cykge1xyXG5cclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuaW5uZXJIVE1MID0gYDxoMz4gVGhpcyBXaWNrIGNvbXBvbmVudCBoYXMgZmFpbGVkITwvaDM+IDxoND5FcnJvciBNZXNzYWdlOjwvaDQ+PHA+JHtlcnJvcl9tZXNzYWdlLnN0YWNrfTwvcD48cD5QbGVhc2UgY29udGFjdCB0aGUgd2Vic2l0ZSBtYWludGFpbmVycyB0byBhZGRyZXNzIHRoZSBwcm9ibGVtLjwvcD4gPHA+JHtwcmVzZXRzLmVycm9yX2NvbnRhY3R9PC9wPmA7XHJcbiAgICAgICAgc3VwZXIobnVsbCwgZGl2LCB7fSwge30pO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgVHJhbnNpdGlvbmVlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGVtZW50KVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiogQG5hbWVzcGFjZSBDb21wb25lbnQgKi9cclxuXHJcbi8qKlxyXG4gICAgVGhlIG1haW4gY29udGFpbmVyIG9mIFNvdXJjZXMuIFJlcHJlc2VudHMgYW4gYXJlYSBvZiBpbnRlcmVzdCBvbiB0aGUgRE9NLlxyXG4qL1xyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuICAgIC8qKlxyXG4gICAgIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAoZWxlbWVudC5jbGFzc0xpc3QpID8gZWxlbWVudC5jbGFzc0xpc3RbMF0gOiBlbGVtZW50LmlkO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYnViYmxlZF9lbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53cmFwcyA9IFtdO1xyXG5cclxuICAgICAgICAvL1RoZSBvcmlnaW5hbCBlbGVtZW50IGNvbnRhaW5lci5cclxuICAgICAgICAvL3RoaXMucGFyZW50X2VsZW1lbnQgPSBwYXJlbnRfZWxlbWVudDtcclxuXHJcbiAgICAgICAgLy9Db250ZW50IHRoYXQgaXMgd3JhcHBlZCBpbiBhbiBlbGVfd3JhcFxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVubG9hZENvbXBvbmVudHMoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heChjb21wb25lbnQudHJhbnNpdGlvbk91dCgpLCB0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCAmJiBjb21wb25lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5yZW1vdmVDaGlsZChjb21wb25lbnQuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZENvbXBvbmVudHMod3VybCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNvbXBvbmVudC5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3JhcHNbaV0uYXBwZW5kQ2hpbGQoY29tcG9uZW50LmVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LmhhbmRsZVVybFVwZGF0ZSh3dXJsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS5MT0FERUQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkluKCkge1xyXG5cclxuICAgICAgICAvLyBUaGlzIGlzIHRvIGZvcmNlIGEgZG9jdW1lbnQgcmVwYWludCwgd2hpY2ggc2hvdWxkIGNhdXNlIGFsbCBlbGVtZW50cyB0byByZXBvcnQgY29ycmVjdCBwb3NpdGlvbmluZyBoZXJlYWZ0ZXJcclxuXHJcbiAgICAgICAgbGV0IHQgPSB0aGlzLmVsZW1lbnQuc3R5bGUudG9wO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1YmJsZUxpbmsobGlua191cmwsIGNoaWxkLCB0cnNfZWxlID0ge30pIHtcclxuXHJcbiAgICAgICAgdGhpcy5idWJibGVkX2VsZW1lbnRzID0gdHJzX2VsZTtcclxuXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBsaW5rX3VybCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgbGV0IG93bl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXROYW1lZEVsZW1lbnRzKG93bl9lbGVtZW50cyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG93bl9lbGVtZW50cykge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnNbbmFtZV0gPSBUcmFuc2Zvcm1Ubyhvd25fZWxlbWVudHNbbmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25fZWxlbWVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0TmFtZWRFbGVtZW50cyhvd25fZWxlbWVudHMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3duX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG8sIGZyb20gPSB0cmFuc2l0aW9uc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmICgodG8gPSBvd25fZWxlbWVudHNbbmFtZV0pICYmIGZyb20pIHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tKHRvLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG4gICAgICAgIGlmICh0aGlzLmJ1YmJsZWRfZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IHQgPSB0aGlzLmJ1YmJsZWRfZWxlbWVudHM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIHRoaXMuYnViYmxlZF9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW3RdID0gdGhpcy5idWJibGVkX2VsZW1lbnRzW3RdO1xyXG5cclxuICAgICAgICAgICAgLy90aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY2hpbGQuZGF0YXNldC50cmFuc2l0aW9uXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldENvbXBvbmVudHMoQXBwX0NvbXBvbmVudHMsIE1vZGVsX0NvbnN0cnVjdG9ycywgQ29tcG9uZW50X0NvbnN0cnVjdG9ycywgcHJlc2V0cywgRE9NLCB3dXJsKSB7XHJcbiAgICAgICAgLy9pZiB0aGVyZSBpcyBhIGNvbXBvbmVudCBpbnNpZGUgdGhlIGVsZW1lbnQsIHJlZ2lzdGVyIHRoYXQgY29tcG9uZW50IGlmIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICAgICAgICB2YXIgY29tcG9uZW50cyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjb21wb25lbnRcIiksIChhKSA9PiBhKTtcclxuXHJcbiAgICAgICAgc2V0TGlua3ModGhpcy5lbGVtZW50LCAoaHJlZiwgZSkgPT4ge1xyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGhyZWYpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIGEgd3JhcHBlZCBjb21wb25lbnQgZm9yIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhlIDxlbGVtZW50PlxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgY29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJjb21wX3dyYXBcIik7XHJcblxyXG4gICAgICAgICAgICAvL1N0cmFpZ2h0IHVwIHN0cmluZyBjb3B5IG9mIHRoZSBlbGVtZW50J3MgRE9NLlxyXG4gICAgICAgICAgICBjb21wb25lbnQuaW5uZXJIVE1MID0gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZW1wbGF0ZXMgPSBET00uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZW1wbGF0ZVwiKTtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYXBwX2Nhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICBSZXBsYWNlIHRoZSBjb21wb25lbnQgd2l0aCBhIGNvbXBvbmVudCB3cmFwcGVyIHRvIGhlbHAgcHJlc2VydmUgRE9NIGFycmFuZ2VtZW50XHJcbiAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb21wX3dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgY29tcF93cmFwLmNsYXNzTGlzdC5hZGQoXCJjb21wX3dyYXBcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBzLnB1c2goY29tcF93cmFwKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChjb21wX3dyYXAsIGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY29tcG9uZW50LmNsYXNzTGlzdFswXSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgIFdlIG11c3QgZW5zdXJlIHRoYXQgY29tcG9uZW50cyBhY3QgYXMgdGVtcGxhdGUgXCJsYW5kaW5nIHNwb3RzXCIuIEluIG9yZGVyIGZvciB0aGF0IHRvIGhhcHBlbiB3ZSBtdXN0IGNoZWNrIGZvcjpcclxuICAgICAgICAgICAgICAgICAgKDEpIFRoZSBjb21wb25lbnQgaGFzLCBhcyBpdCdzIGZpcnN0IGNsYXNzIG5hbWUsIGFuIGlkIHRoYXQgKDIpIG1hdGNoZXMgdGhlIGlkIG9mIGEgdGVtcGxhdGUuIElmIGVpdGhlciBvZiB0aGVzZSBwcm92ZSB0byBiZSBub3QgdHJ1ZSwgd2Ugc2hvdWxkIHJlamVjdCB0aGUgYWRvcHRpb24gb2YgdGhlIGNvbXBvbmVudCBhcyBhIFdpY2tcclxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50IGFuZCBpbnN0ZWFkIHRyZWF0IGl0IGFzIGEgbm9ybWFsIFwicGFzcyB0aHJvdWdoXCIgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypzZXRMaW5rcyhjb21wb25lbnQsIChocmVmLCBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgaHJlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgQmFzaWNTb3VyY2UoY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUFwcF9Db21wb25lbnRzW2lkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcCA9IENvbXBvbmVudF9Db25zdHJ1Y3RvcnNbaWRdKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgY29tcC5jb25zdHJ1Y3Rvcih0ZW1wbGF0ZXMsIHByZXNldHMsIGNvbXBvbmVudCwgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC5tb2RlbF9uYW1lICYmIE1vZGVsX0NvbnN0cnVjdG9yc1tjb21wLm1vZGVsX25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gTW9kZWxfQ29uc3RydWN0b3JzW2NvbXAubW9kZWxfbmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmdldHRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZ2V0dGVyLmdldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmFkZFZpZXcoYXBwX2Nhc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlLmlkID0gaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwX0NvbXBvbmVudHNbaWRdID0gYXBwX2Nhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB0ZW1wbGF0ZXNbaWRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gU291cmNlQ29uc3RydWN0b3IodGVtcGxhdGUsIHByZXNldHMsIERPTSkoKTsgLy9uZXcgU291cmNlQ29tcG9uZW50KHRlbXBsYXRlLCBwcmVzZXRzLCBNb2RlbF9Db25zdHJ1Y3RvcnMsIG51bGwsIERPTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IFNvdXJjZUNvbnN0cnVjdG9yKGNvbXBvbmVudCwgcHJlc2V0cywgRE9NKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IgPSBTb3VyY2VDb25zdHJ1Y3Rvcihjb21wb25lbnQuY2hpbGRyZW5bMF0sIHByZXNldHMsIERPTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgQmFzaWNTb3VyY2UoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gY29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhcHBfY2FzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQXBwIENvbXBvbmVudCBub3QgY29uc3RydWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiogVE9ETzogSWYgdGhlcmUgaXMgYSBmYWxsYmFjayA8bm8tc2NyaXB0PiBzZWN0aW9uIHVzZSB0aGF0IGluc3RlYWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBGYWlsZWRTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcF9Db21wb25lbnRzW2lkXSA9IGFwcF9jYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBBcHBfQ29tcG9uZW50c1tpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZS5oYW5kbGVVcmxVcGRhdGUod3VybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IG5ldyBGYWlsZWRTb3VyY2UoZSwgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGFwcF9jYXNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXVVJMIH0gZnJvbSBcIi4vd3VybFwiXHJcblxyXG5pbXBvcnQgeyBBbnlNb2RlbCB9IGZyb20gXCIuLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5pbXBvcnQgeyBQYWdlVmlldyB9IGZyb20gXCIuL3BhZ2VcIlxyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCJcclxuXHJcbmltcG9ydCB7IFR1cm5EYXRhSW50b1F1ZXJ5IH0gZnJvbSBcIi4uL2NvbW1vbi91cmwvdXJsXCJcclxuXHJcbmltcG9ydCB7IEdMT0JBTCB9IGZyb20gXCIuLi9nbG9iYWxcIlxyXG5cclxubGV0IFVSTF9IT1NUID0geyB3dXJsOiBudWxsIH07XHJcblxyXG4vKiogQG5hbWVzcGFjZSBSb3V0ZXIgKi9cclxuXHJcbmxldCBVUkwgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgQ2hhbmdlcyB0aGUgVVJMIHRvIHRoZSBvbmUgcHJvdmlkZWQsIHByb21wdHMgcGFnZSB1cGRhdGUuIG92ZXJ3cml0ZXMgY3VycmVudCBVUkwuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcclxuICAgICAgICAgICAgaWYgKFVSTF9IT1NULnd1cmwpXHJcbiAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsLnNldChhLCBiLCBjKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIFJldHVybnMgYSBRdWVyeSBlbnRyeSBpZiBpdCBleGlzdHMgaW4gdGhlIHF1ZXJ5IHN0cmluZy4gXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICBpZiAoVVJMX0hPU1Qud3VybClcclxuICAgICAgICAgICAgICAgIHJldHVybiBVUkxfSE9TVC53dXJsLnNldChhLCBiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHRoZSBVUkwgc3RhdGUgdG8gdGhlIG9uZSBwcm92aWRlZCBhbmQgcHJvbXB0cyB0aGUgQnJvd3NlciB0byByZXNwb25kIG8gdGhlIGNoYW5nZS4gXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIGdvdG86IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBgJHthfSR7ICgoYikgPyBgPyR7VHVybkRhdGFJbnRvUXVlcnkoYil9YCA6IFwiXCIpIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IHsgVVJMIH07XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RhbENvbnRhaW5lcigpIHtcclxuICAgIGxldCBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1vZGFsc1wiKVswXTtcclxuXHJcbiAgICBpZiAoIW1vZGFsX2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxzXCIpO1xyXG5cclxuICAgICAgICB2YXIgZG9tX2FwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICBpZiAoZG9tX2FwcClcclxuICAgICAgICAgICAgZG9tX2FwcC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShtb2RhbF9jb250YWluZXIsIGRvbV9hcHApO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbF9jb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtb2RhbF9jb250YWluZXJcclxufVxyXG5cclxuLyoqIEBuYW1lc3BhY2UgbGlua2VyICovXHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGxvYWRpbmcgcGFnZXMgZHluYW1pY2FsbHksIGhhbmRsaW5nIHRoZSB0cmFuc2l0aW9uIG9mIHBhZ2UgY29tcG9uZW50cywgYW5kIG1vbml0b3JpbmcgYW5kIHJlYWN0aW5nIHRvIFVSTCBjaGFuZ2VzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcclxuXHJcbiAgICAvKlxyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBwcmVzZXRzIC0gQW4gb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGJ5IFdpY2sgZm9yIGhhbmRsaW5nIGN1c3RvbSBjb21wb25lbnRzLiBJcyB2YWxpZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBkZWZpbml0aW9uIG9mIGEgUm91dGVyUHJlc2V0XHJcbiAgICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFnZXMgPSB7fTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnMgPSB7fTtcclxuICAgICAgICB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnMgPSB7fTtcclxuICAgICAgICB0aGlzLnByZXNldHMgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF91cmwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9xdWVyeTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfdmlldyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzID0gW107XHJcblxyXG4gICAgICAgIEdMT0JBTC5yb3V0ZXIgPSB0aGlzO1xyXG5cclxuICAgICAgICAvKiAqL1xyXG4gICAgICAgIHRoaXMubW9kYWxfc3RhY2sgPSBbXTtcclxuXHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VVUkwoZG9jdW1lbnQubG9jYXRpb24pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiB3aWxsIHBhcnNlIGEgVVJMIGFuZCBkZXRlcm1pbmUgd2hhdCBQYWdlIG5lZWRzIHRvIGJlIGxvYWRlZCBpbnRvIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICAqL1xyXG4gICAgcGFyc2VVUkwobG9jYXRpb24pIHtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICBsZXQgSVNfU0FNRV9QQUdFID0gKHRoaXMuY3VycmVudF91cmwgPT0gdXJsKSxcclxuICAgICAgICAgICAgcGFnZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHd1cmwgPSBuZXcgV1VSTChsb2NhdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudF91cmwgPSB1cmw7XHJcblxyXG4gICAgICAgIGlmICgocGFnZSA9IHRoaXMucGFnZXNbdXJsXSkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChJU19TQU1FX1BBR0UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsID0gd3VybDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS50cmFuc2l0aW9uSW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKHBhZ2UudHlwZSA9PSBcIm1vZGFsXCIpID8gZ2V0TW9kYWxDb250YWluZXIoKSA6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwsIHd1cmwsIElTX1NBTUVfUEFHRSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRQYWdlKHBhZ2UsIHd1cmwsIElTX1NBTUVfUEFHRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYXRpb24pXHJcbiAgICAgICAgICAgIGZldGNoKGxvY2F0aW9uLmhyZWYsIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlLnRleHQoKS50aGVuKChodG1sKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBET00gPSAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUGFnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTmV3UGFnZSh1cmwsIERPTSwgd3VybCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElTX1NBTUVfUEFHRVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmaW5hbGl6ZVBhZ2VzKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hcm1lZCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGEgPSB0aGlzLmFybWVkO1xyXG4gICAgICAgICAgICAvLyAgYS5wLnRyYW5zaXRpb25JbihhLmUsIHRoaXMuY3VycmVudF92aWV3LCBhLnd1cmwsIGEuU1AsIGEudGUpO1xyXG4gICAgICAgICAgICB0aGlzLmFybWVkID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5maW5hbGl6aW5nX3BhZ2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmZpbmFsaXppbmdfcGFnZXNbaV07XHJcblxyXG4gICAgICAgICAgICBwYWdlLmZpbmFsaXplKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBMb2FkcyBwYWdlcyBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBjYWNoZSwgYW5kIHNlbmRzIGl0IHRvIHRoZSBwYWdlIHBhcnNlci5cclxuXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMIGlkIG9mIHRoZSBjYWNoZWQgcGFnZSB0byBsb2FkLlxyXG4gICAgICBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLVxyXG4gICAgICBAcGFyYW0ge0Jvb2x9IElTX1NBTUVfUEFHRSAtXHJcbiAgICAqL1xyXG4gICAgbG9hZFBhZ2UocGFnZSwgd3VybCA9IG5ldyBXVVJMKGRvY3VtZW50LmxvY2F0aW9uKSwgSVNfU0FNRV9QQUdFKSB7XHJcblxyXG4gICAgICAgIFVSTF9IT1NULnd1cmwgPSB3dXJsO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBsZXQgYXBwX2VsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICAvL0ZpbmFsaXplIGFueSBleGlzdGluZyBwYWdlIHRyYW5zaXRpb25zO1xyXG4gICAgICAgIC8vIHRoaXMuZmluYWxpemVQYWdlcygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICBpZiAocGFnZS50eXBlID09IFwibW9kYWxcIikge1xyXG5cclxuICAgICAgICAgICAgLy90cmFjZSBtb2RhbCBzdGFjayBhbmQgc2VlIGlmIHRoZSBtb2RhbCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBVTldJTkQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9IHRoaXMubW9kYWxfc3RhY2tbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFVOV0lORCA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RhbCA9PSBwYWdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVTldJTkQgPSBpICsgMTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwudW5sb2FkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cnMgPSBtb2RhbC50cmFuc2l0aW9uT3V0KCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodHJzLCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMucHVzaChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChVTldJTkQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aCA9IFVOV0lORDtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbW9kYWxcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxfc3RhY2sucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChnZXRNb2RhbENvbnRhaW5lcigpLCB3dXJsKTtcclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RhbF9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLm1vZGFsX3N0YWNrW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0cnMgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIG1vZGFsLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0cnMgPSBtb2RhbC50cmFuc2l0aW9uT3V0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2xlbmd0aCA9IE1hdGgubWF4KHRycywgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmFsaXplKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50X3ZpZXcgJiYgdGhpcy5jdXJyZW50X3ZpZXcgIT0gcGFnZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF92aWV3LnVubG9hZCh0cmFuc2l0aW9uX2VsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoYXBwX2VsZSwgd3VybCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHQgPSB0aGlzLmN1cnJlbnRfdmlldy50cmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4odHJhbnNpdGlvbl9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0LCB0cmFuc2l0aW9uX2xlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2godGhpcy5jdXJyZW50X3ZpZXcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmN1cnJlbnRfdmlldykge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2UubG9hZChhcHBfZWxlLCB3dXJsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25Jbih0cmFuc2l0aW9uX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSBwYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVQYWdlcygpO1xyXG4gICAgICAgIH0sICh0cmFuc2l0aW9uX2xlbmd0aCAqIDEwMDApICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUHJlLWxvYWRzIGEgY3VzdG9tIGNvbnN0cnVjdG9yIGZvciBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBpZCBhbmQgcHJvdmlkZXMgYSBtb2RlbCB0byB0aGF0IGNvbnN0cnVjdG9yIHdoZW4gaXQgaXMgY2FsbGVkLlxyXG4gICAgICAgIFRoZSBjb25zdHJ1Y3RvciBtdXN0IGhhdmUgQ29tcG9uZW50IGluIGl0cyBpbmhlcml0YW5jZSBjaGFpbi5cclxuICAgICovXHJcbiAgICBhZGRTdGF0aWMoZWxlbWVudF9pZCwgY29uc3RydWN0b3IsIG1vZGVsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9yc1tlbGVtZW50X2lkXSA9IHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIG1vZGVsX25hbWU6IG1vZGVsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkTW9kZWwobW9kZWxfbmFtZSwgbW9kZWxDb25zdHJ1Y3Rvcikge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGVsc19jb25zdHJ1Y3RvcnNbbW9kZWxfbmFtZV0gPSBtb2RlbENvbnN0cnVjdG9yO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgQ3JlYXRlcyBhIG5ldyBpZnJhbWUgb2JqZWN0IHRoYXQgYWN0cyBhcyBhIG1vZGFsIHRoYXQgd2lsbCBzaXQgb250b3Agb2YgZXZlcnl0aGluZyBlbHNlLlxyXG4gICAgKi9cclxuICAgIGxvYWROb25XaWNrUGFnZShVUkwpIHtcclxuXHJcbiAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IFVSTDtcclxuICAgICAgICBpZnJhbWUuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIsIFwiY29tcF93cmFwXCIpO1xyXG4gICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2VWaWV3KFVSTCwgaWZyYW1lKTtcclxuICAgICAgICBwYWdlLnR5cGUgPSBcIm1vZGFsXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlc1tVUkxdID0gcGFnZSAvL25ldyBNb2RhbChwYWdlLCBpZnJhbWUsIGdldE1vZGFsQ29udGFpbmVyKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW1VSTF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyB0aGUgRE9NIG9mIGFub3RoZXIgcGFnZSBhbmQgc3RyaXBzIGl0LCBsb29raW5nIGZvciBjb21wb25lbnQgYW5kIGFwcCBlbGVtZW50cyB0byB1c2UgdG8gaW50ZWdyYXRlIGludG8gdGhlIFNQQSBzeXN0ZW0uXHJcbiAgICAgICAgSWYgaXQgaXMgdW5hYmxlIHRvIGZpbmQgdGhlc2UgZWxlbWVudHMsIHRoZW4gaXQgd2lsbCBwYXNzIHRoZSBET00gdG8gbG9hZE5vbldpY2tQYWdlIHRvIGhhbmRsZSB3cmFwcGluZyB0aGUgcGFnZSBib2R5IGludG8gYSB3aWNrIGFwcCBlbGVtZW50LlxyXG4gICAgKi9cclxuICAgIGxvYWROZXdQYWdlKFVSTCwgRE9NLCB3dXJsKSB7XHJcbiAgICAgICAgLy9sb29rIGZvciB0aGUgYXBwIHNlY3Rpb24uXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBJZiB0aGUgcGFnZSBzaG91bGQgbm90IGJlIHJldXNlZCwgYXMgaW4gY2FzZXMgd2hlcmUgdGhlIHNlcnZlciBkb2VzIGFsbCB0aGUgcmVuZGVyaW5nIGZvciBhIGR5bmFtaWMgcGFnZSBhbmQgd2UncmUganVzdCBwcmVzZW50aW5nIHRoZSByZXN1bHRzLFxyXG4gICAgICAgICAgICB0aGVuIGhhdmluZyBOT19CVUZGRVIgc2V0IHRvIHRydWUgd2lsbCBjYXVzZSB0aGUgbGlua2VyIHRvIG5vdCBzYXZlIHRoZSBwYWdlIHRvIHRoZSBoYXNodGFibGUgb2YgZXhpc3RpbmcgcGFnZXMsIGZvcmNpbmcgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgZXZlcnkgdGltZSB0aGUgcGFnZSBpcyB2aXNpdGVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IE5PX0JVRkZFUiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgQXBwIGVsZW1lbnRzOiBUaGVyZSBzaG91bGQgb25seSBiZSBvbmUuIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcF9saXN0ID0gRE9NLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpO1xyXG5cclxuICAgICAgICBpZiAoYXBwX2xpc3QubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBXaWNrIGlzIGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBqdXN0IG9uZSA8YXBwPiBlbGVtZW50IGluIGEgcGFnZS4gVGhlcmUgYXJlICR7YXBwX2xpc3QubGVuZ3RofSBhcHBzIGVsZW1lbnRzIGluICR7dXJsfS4gV2ljayB3aWxsIHByb2NlZWQgd2l0aCB0aGUgZmlyc3QgPGFwcD4gZWxlbWVudCBpbiB0aGUgRE9NLiBVbmV4cGVjdGVkIGJlaGF2aW9yIG1heSBvY2N1ci5gKVxyXG5cclxuICAgICAgICBsZXQgYXBwX3NvdXJjZSA9IGFwcF9saXN0WzBdXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgSWYgdGhlcmUgaXMgbm8gPGFwcD4gZWxlbWVudCB3aXRoaW4gdGhlIERPTSwgdGhlbiB3ZSBtdXN0IGhhbmRsZSB0aGlzIGNhc2UgY2FyZWZ1bGx5LiBUaGlzIGxpa2VseSBpbmRpY2F0ZXMgYSBwYWdlIGRlbGl2ZXJlZCBmcm9tIHRoZSBzYW1lIG9yaWdpbiB0aGF0IGhhcyBub3QgYmVlbiBjb252ZXJ0ZWQgdG8gd29yayB3aXRoIHRoZSBXaWNrIHN5c3RlbS5cclxuICAgICAgICAgIFRoZSBlbnRpcmUgY29udGVudHMgb2YgdGhlIHBhZ2UgY2FuIGJlIHdyYXBwZWQgaW50byBhIDxpZnJhbWU+LCB0aGF0IHdpbGwgYmUgY291bGQgc2V0IGFzIGEgbW9kYWwgb24gdG9wIG9mIGV4aXN0aW5nIHBhZ2VzLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKCFhcHBfc291cmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlBhZ2UgZG9lcyBub3QgaGF2ZSBhbiA8YXBwPiBlbGVtZW50IVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZE5vbldpY2tQYWdlKFVSTCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYXBwX3BhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXBwcGFnZVwiKTtcclxuXHJcbiAgICAgICAgYXBwX3BhZ2UuaW5uZXJIVE1MID0gYXBwX3NvdXJjZS5pbm5lckhUTUw7XHJcblxyXG4gICAgICAgIHZhciBhcHAgPSBhcHBfc291cmNlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIGRvbV9hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXTtcclxuXHJcbiAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZVZpZXcoVVJMLCBhcHBfcGFnZSk7XHJcblxyXG4gICAgICAgIGlmIChhcHBfc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwX3NvdXJjZS5kYXRhc2V0Lm1vZGFsID09IFwidHJ1ZVwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZS5zZXRUeXBlKFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxcIik7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5pbm5lckhUTUwgPSBhcHAuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgYXBwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhcHAgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIElmIHRoZSBET00gaXMgdGhlIHNhbWUgZWxlbWVudCBhcyB0aGUgYWN0dWFsIGRvY3VtZW50LCB0aGVuIHdlIHNoYWxsIHJlYnVpbGQgdGhlIGV4aXN0aW5nIDxhcHA+IGVsZW1lbnQsIGNsZWFyaW5nIGl0IG9mIGl0J3MgY29udGVudHMuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKERPTSA9PSBkb2N1bWVudCAmJiBkb21fYXBwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld19hcHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXBwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVwbGFjZUNoaWxkKG5ld19hcHAsIGRvbV9hcHApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbV9hcHAgPSBuZXdfYXBwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwLmRhdGFzZXQubm9fYnVmZmVyID09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgTk9fQlVGRkVSID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGFwcF9wYWdlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZWxlbWVudFwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlID0gZWxlbWVudHNbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXF1aXZpbGFudF9lbGVtZW50X2Zyb21fbWFpbl9kb20gPSBlbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudF9pZCA9IGVsZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZS50eXBlICE9PSBcIm1vZGFsXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChlbGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGUuaW5uZXJIVE1MO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlbGVfd3JhcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChlbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2UuZWxlbWVudHMucHVzaChjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zZXRDb21wb25lbnRzKHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSwgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzLCB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnMsIHRoaXMucHJlc2V0cywgRE9NLCB3dXJsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50ID09IERPTSlcclxuICAgICAgICAgICAgICAgIGRvbV9hcHAuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBwYWdlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFOT19CVUZGRVIpIHRoaXMucGFnZXNbVVJMXSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibGV0IHdpY2tfdmFuaXR5ID0gXCJcXCBcXChcXCBcXCBcXChcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXClcXG5cXCBcXClcXFxcXFwpXFwpXFwoXFwgXFwgXFwgXFwnXFwgXFwoXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwgXFwoXFwgXFwvXFwoXFxuXFwoXFwoXFxfXFwpXFwoXFwpXFxcXFxcIFxcKVxcIFxcIFxcKVxcXFxcXCBcXCBcXCBcXCBcXChcXCBcXCBcXCBcXCBcXClcXFxcXFwoXFwpXFwpXFxuXFxfXFwoXFwoXFwpXFwpXFxcXFxcX1xcKVxcKFxcKVxcKFxcKFxcX1xcKVxcIFxcIFxcIFxcKVxcXFxcXCBcXCBcXChcXChcXF9cXClcXFxcXFxuXFxcXFxcIFxcXFxcXChcXChcXF9cXClcXC9cXCBcXC9cXCBcXChcXF9cXClcXCBcXCBcXChcXChcXF9cXClcXCBcXHxcXCBcXHxcXChcXF9cXClcXG5cXCBcXFxcXFwgXFxcXFxcL1xcXFxcXC9cXCBcXC9cXCBcXCBcXHxcXCBcXHxcXCBcXC9cXCBcXF9cXHxcXCBcXCBcXHxcXCBcXC9cXCBcXC9cXG5cXCBcXCBcXFxcXFxfXFwvXFxcXFxcX1xcL1xcIFxcIFxcIFxcfFxcX1xcfFxcIFxcXFxcXF9cXF9cXHxcXCBcXCBcXHxcXF9cXFxcXFxfXFxcXFxcblwiO1xyXG5cclxuLyoqXHJcbiAgICBMaWdodCBpdCB1cCFcclxuKi9cclxuXHJcbi8vU2NoZW1hXHJcblxyXG5pbXBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciwgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yLCBUaW1lU2NoZW1hQ29uc3RydWN0b3IsIFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yLCBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciwgQm9vbFNjaGVtYUNvbnN0cnVjdG9yLCBzY2hlbWEgYXMgU2NoZW1hcyB9IGZyb20gXCIuL3NjaGVtYS9zY2hlbWFzXCJcclxuXHJcbi8vTW9kZWxzXHJcblxyXG5pbXBvcnQgeyBNb2RlbCwgQW55TW9kZWwgfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5pbXBvcnQgeyBNb2RlbENvbnRhaW5lckJhc2UgfSBmcm9tIFwiLi9tb2RlbC9jb250YWluZXIvYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBNdWx0aUluZGV4ZWRDb250YWluZXIgfSBmcm9tIFwiLi9tb2RlbC9jb250YWluZXIvbXVsdGlcIlxyXG5cclxuaW1wb3J0IHsgQlRyZWVNb2RlbENvbnRhaW5lciB9IGZyb20gXCIuL21vZGVsL2NvbnRhaW5lci9idHJlZVwiXHJcblxyXG5pbXBvcnQgeyBBcnJheU1vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4vbW9kZWwvY29udGFpbmVyL2FycmF5XCJcclxuXHJcbi8vVmlld3NcclxuXHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi92aWV3XCJcclxuXHJcbi8vU291cmNlXHJcblxyXG5pbXBvcnQgeyBTb3VyY2VCYXNlIH0gZnJvbSBcIi4vc291cmNlL2Jhc2VcIlxyXG5cclxuaW1wb3J0IHsgQ3VzdG9tU291cmNlIH0gZnJvbSBcIi4vc291cmNlL3NvdXJjZVwiXHJcblxyXG5pbXBvcnQgeyBTb3VyY2VDb25zdHJ1Y3RvciB9IGZyb20gXCIuL3NvdXJjZS9zb3VyY2VfY29uc3RydWN0b3JcIlxyXG5cclxuaW1wb3J0IHsgRmlsdGVyIH0gZnJvbSBcIi4vc291cmNlL2Nhc3NldHRlL2ZpbHRlclwiXHJcblxyXG5pbXBvcnQgeyBGb3JtIH0gZnJvbSBcIi4vc291cmNlL2Nhc3NldHRlL2Zvcm1cIlxyXG5cclxuaW1wb3J0IHsgQ2Fzc2V0dGUgfSBmcm9tIFwiLi9zb3VyY2UvY2Fzc2V0dGUvY2Fzc2V0dGVcIlxyXG5cclxuLy9OZXR3b3JrXHJcblxyXG5pbXBvcnQgeyBHZXR0ZXIgfSBmcm9tIFwiLi9nZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHsgU2V0dGVyIH0gZnJvbSBcIi4vc2V0dGVyXCJcclxuXHJcbi8vUm91dGluZ1xyXG5cclxuaW1wb3J0IHsgV1VSTCB9IGZyb20gXCIuL3JvdXRlci93dXJsXCJcclxuXHJcbmltcG9ydCB7IFJvdXRlciwgVVJMIH0gZnJvbSBcIi4vcm91dGVyL3JvdXRlclwiXHJcblxyXG4vL090aGVyXHJcblxyXG5pbXBvcnQgKiBhcyBBbmltYXRpb24gZnJvbSBcIi4vYW5pbWF0aW9uL2FuaW1hdGlvblwiXHJcblxyXG5pbXBvcnQgKiBhcyBDb21tb24gZnJvbSBcIi4vY29tbW9uXCJcclxuXHJcbmxldCBMSU5LRVJfTE9BREVEID0gZmFsc2U7XHJcbmxldCBERUJVR0dFUiA9IHRydWU7XHJcblxyXG4vKipcclxuICogICAgQ3JlYXRlcyBhIG5ldyB7Um91dGVyfSBpbnN0YW5jZSwgcGFzc2luZyBhbnkgcHJlc2V0cyBmcm9tIHRoZSBjbGllbnQuXHJcbiAqICAgIEl0IHdpbGwgdGhlbiB3YWl0IGZvciB0aGUgZG9jdW1lbnQgdG8gbG9hZCwgYW5kIG9uY2UgbG9hZGVkLCB3aWxsIHN0YXJ0IHRoZSBsaW5rZXIgYW5kIGxvYWQgdGhlIGN1cnJlbnQgcGFnZSBpbnRvIHRoZSBsaW5rZXIuXHJcbiAqXHJcbiAqICAgIE5vdGU6IFRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2UuIEFueSBzdWJzZXF1ZW50IGNhbGxzIHdpbGwgbm90IGRvIGFueXRoaW5nLlxyXG4gKlxyXG4gKiAgICBAcGFyYW0ge1JvdXRlclByZXNldHN9IHByZXNldHMgLSBBbiBvYmplY3Qgb2YgdXNlciBkZWZpbmVkIFdpY2sgb2JqZWN0cy5cclxuICovXHJcblxyXG5mdW5jdGlvbiBzdGFydFJvdXRpbmcocHJlc2V0cykge1xyXG5cclxuICAgIC8qXHJcbiAgICAgIFRoZSBzdGF0aWMgZmllbGQgaW4gcHJlc2V0cyBhcmUgYWxsIENvbXBvbmVudC1saWtlIG9iamVjdHMgY29uc3RydWN0b3JzIHRoYXQgYXJlIGRlZmluZWQgYnkgdGhlIGNsaWVudFxyXG4gICAgICB0byBiZSB1c2VkIGJ5IFdpY2sgZm9yIGN1c3RvbSBjb21wb25lbnRzLlxyXG5cclxuICAgICAgVGhlIGNvbnN0cnVjdG9ycyBtdXN0IHN1cHBvcnQgc2V2ZXJhbCBDb21wb25lbnQgYmFzZWQgbWV0aG9kcyBpbiBvcmRlcmVkIHRvIGJlIGFjY2VwdGVkIGZvciB1c2UuIFRoZXNlIG1ldGhvZHMgaW5jbHVkZTpcclxuICAgICAgICB0cmFuc2l0aW9uSW5cclxuICAgICAgICB0cmFuc2l0aW9uT3V0XHJcbiAgICAgICAgc2V0TW9kZWxcclxuICAgICAgICB1bnNldE1vZGVsXHJcbiAgICAqL1xyXG5cclxuICAgIGlmIChwcmVzZXRzLnN0YXRpYykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBvbmVudF9uYW1lIGluIHByZXNldHMuc3RhdGljKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gcHJlc2V0cy5zdGF0aWNbY29tcG9uZW50X25hbWVdO1xyXG5cclxuICAgICAgICAgICAgbGV0IGEgPSAwLFxyXG4gICAgICAgICAgICAgICAgYiA9IDAsXHJcbiAgICAgICAgICAgICAgICBjID0gMCxcclxuICAgICAgICAgICAgICAgIGQgPSAwLFxyXG4gICAgICAgICAgICAgICAgZSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoKGEgPSAoY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uSW4gJiYgY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uSW4gaW5zdGFuY2VvZiBGdW5jdGlvbikpICYmXHJcbiAgICAgICAgICAgICAgICAoYiA9IChjb21wb25lbnQucHJvdG90eXBlLnRyYW5zaXRpb25PdXQgJiYgY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uT3V0IGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgKGMgPSAoY29tcG9uZW50LnByb3RvdHlwZS5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnNldE1vZGVsIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgKGQgPSAoY29tcG9uZW50LnByb3RvdHlwZS51bnNldE1vZGVsICYmIGNvbXBvbmVudC5wcm90b3R5cGUudW5zZXRNb2RlbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN0YXRpYyhjb21wb25lbnRfbmFtZSwgY29tcG9uZW50KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdGF0aWMgY29tcG9uZW50ICR7Y29tcG9uZW50X25hbWV9IGxhY2tzIGNvcnJlY3QgY29tcG9uZW50IG1ldGhvZHMsIFxcbkhhcyB0cmFuc2l0aW9uSW4gZnVuY3Rpb246JHthfVxcbkhhcyB0cmFuc2l0aW9uT3V0IGZ1bmN0b246JHtifVxcbkhhcyBzZXQgbW9kZWwgZnVuY3Rpb246JHtjfVxcbkhhcyB1bnNldE1vZGVsIGZ1bmN0aW9uOiR7ZH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFRPRE9cclxuICAgICAgICBAZGVmaW5lIFBhZ2VQYXJzZXJcclxuXHJcbiAgICAgICAgQSBwYWdlIHBhcnNlciB3aWxsIHBhcnNlIHRlbXBsYXRlcyBiZWZvcmUgcGFzc2luZyB0aGF0IGRhdGEgdG8gdGhlIFNvdXJjZSBoYW5kbGVyLlxyXG4gICAgKi9cclxuICAgIGlmIChwcmVzZXRzLnBhcnNlcikge1xyXG4gICAgICAgIGZvciAobGV0IHBhcnNlcl9uYW1lIGluIHByZXNldHMucGFnZV9wYXJzZXIpIHtcclxuICAgICAgICAgICAgbGV0IHBhcnNlciA9IHByZXNldHMucGFnZV9wYXJzZXJbcGFyc2VyX25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBTY2hlbWFzIHByb3ZpZGUgdGhlIGNvbnN0cnVjdG9ycyBmb3IgTW9kZWxzXHJcbiAgICAqL1xyXG4gICAgaWYgKHByZXNldHMuc2NoZW1hcykge1xyXG5cclxuICAgICAgICBwcmVzZXRzLnNjaGVtYXMuYW55ID0gQW55TW9kZWw7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwcmVzZXRzLnNjaGVtYXMgPSB7XHJcbiAgICAgICAgICAgIGFueTogQW55TW9kZWxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcmVzZXRzLm1vZGVscykge1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJlc2V0cy5tb2RlbHMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoREVCVUdHRVIpIGNvbnNvbGUubG9nKHByZXNldHMpXHJcblxyXG4gICAgaWYgKExJTktFUl9MT0FERUQpIHJldHVybjtcclxuXHJcbiAgICBMSU5LRVJfTE9BREVEID0gdHJ1ZTtcclxuXHJcbiAgICAvL1Bhc3MgaW4gdGhlIHByZXNldHMgb3IgYSBwbGFpbiBvYmplY3QgaWYgcHJlc2V0cyBpcyB1bmRlZmluZWQuXHJcblxyXG4gICAgbGV0IGxpbmsgPSBuZXcgUm91dGVyKHByZXNldHMgfHwge30pO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGxpbmsubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgIGxpbmsubG9hZE5ld1BhZ2UoZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUsIGRvY3VtZW50KSxcclxuICAgICAgICAgICAgbmV3IFdVUkwoZG9jdW1lbnQubG9jYXRpb24pLFxyXG4gICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKGAke3dpY2tfdmFuaXR5fUNvcHlyaWdodCAyMDE4IEFudGhvbnkgQyBXZWF0aGVyc2J5XFxuaHR0cHM6Ly9naXRsYWIuY29tL2FudGhvbnljd2VhdGhlcnNieS93aWNrYClcclxufVxyXG5cclxuLyoqXHJcbiAgICBFeHBvcnRzIFxyXG4qL1xyXG5cclxuLy9Db25zdHJ1Y3QgTW9kZWwgRXhwb3J0c1xyXG5sZXQgbW9kZWwgPSBNb2RlbDtcclxuXHJcbm1vZGVsLmFueSA9IChkYXRhKSA9PiBuZXcgQW55TW9kZWwoZGF0YSk7XHJcbm1vZGVsLmFueS5jb25zdHIgPSBBbnlNb2RlbDtcclxuXHJcbm1vZGVsLmNvbnRhaW5lciA9IHtcclxuICAgIG11bHRpOiAoLi4uYXJncykgPT4gbmV3IE11bHRpSW5kZXhlZENvbnRhaW5lciguLi5hcmdzKSxcclxuICAgIGFycmF5OiAoLi4uYXJncykgPT4gbmV3IEFycmF5TW9kZWxDb250YWluZXIoLi4uYXJncyksXHJcbiAgICBidHJlZTogKC4uLmFyZ3MpID0+IG5ldyBCVHJlZU1vZGVsQ29udGFpbmVyKC4uLmFyZ3MpLFxyXG4gICAgY29uc3RyOiBNb2RlbENvbnRhaW5lckJhc2VcclxufVxyXG5cclxubW9kZWwuY29udGFpbmVyLmNvbnN0ci5tdWx0aSA9IE11bHRpSW5kZXhlZENvbnRhaW5lcjtcclxubW9kZWwuY29udGFpbmVyLmNvbnN0ci5hcnJheSA9IEFycmF5TW9kZWxDb250YWluZXI7XHJcbm1vZGVsLmNvbnRhaW5lci5jb25zdHIuYnRyZWUgPSBCVHJlZU1vZGVsQ29udGFpbmVyO1xyXG5cclxuT2JqZWN0LmZyZWV6ZShtb2RlbC5jb250YWluZXIuY29uc3RyKTtcclxuT2JqZWN0LmZyZWV6ZShtb2RlbC5jb250YWluZXIpO1xyXG5PYmplY3QuZnJlZXplKG1vZGVsLmFueSk7XHJcbk9iamVjdC5mcmVlemUobW9kZWwpO1xyXG5cclxuLy9Db25zdHJ1Y3QgU2NoZW1hIEV4cG9ydHNcclxubGV0IHNjaGVtYSA9IFNjaGVtYXM7XHJcbnNjaGVtYS5jb25zdHIgPSBTY2hlbWFDb25zdHJ1Y3Rvcjtcclxuc2NoZW1hLmNvbnN0ci5ib29sID0gQm9vbFNjaGVtYUNvbnN0cnVjdG9yO1xyXG5zY2hlbWEuY29uc3RyLm51bWJlciA9IE51bWJlclNjaGVtYUNvbnN0cnVjdG9yO1xyXG5zY2hlbWEuY29uc3RyLnN0cmluZyA9IFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yO1xyXG5zY2hlbWEuY29uc3RyLmRhdGUgPSBEYXRlU2NoZW1hQ29uc3RydWN0b3I7XHJcbnNjaGVtYS5jb25zdHIudGltZSA9IFRpbWVTY2hlbWFDb25zdHJ1Y3RvcjtcclxuXHJcbk9iamVjdC5mcmVlemUoc2NoZW1hLmNvbnN0cik7XHJcbk9iamVjdC5mcmVlemUoc2NoZW1hKTtcclxuXHJcblxyXG5sZXQgY29yZSA9IHtcclxuICAgIENvbW1vbixcclxuICAgIEFuaW1hdGlvbixcclxuICAgIHZpZXc6IHtWaWV3fSxcclxuICAgIHNjaGVtYToge1xyXG4gICAgICAgIGluc3RhbmNlcyA6IFNjaGVtYXMsXHJcbiAgICAgICAgU2NoZW1hQ29uc3RydWN0b3IsXHJcbiAgICAgICAgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yLFxyXG4gICAgICAgIFRpbWVTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBCb29sU2NoZW1hQ29uc3RydWN0b3JcclxuICAgIH0sXHJcbiAgICBtb2RlbDoge1xyXG4gICAgICAgIE1vZGVsLFxyXG4gICAgICAgIEFueU1vZGVsLFxyXG4gICAgICAgIE1vZGVsQ29udGFpbmVyQmFzZSxcclxuICAgICAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICAgICAgQXJyYXlNb2RlbENvbnRhaW5lcixcclxuICAgICAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbiAgICB9LFxyXG4gICAgbmV0d29yazoge1xyXG4gICAgICAgIHJvdXRlcjoge1xyXG4gICAgICAgICAgICBXVVJMLFxyXG4gICAgICAgICAgICBVUkwsXHJcbiAgICAgICAgICAgIFJvdXRlclxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0dGVyLFxyXG4gICAgICAgIFNldHRlcixcclxuICAgIH0sXHJcbiAgICBzb3VyY2U6IHtcclxuICAgICAgICBDdXN0b21Tb3VyY2UsXHJcbiAgICAgICAgU291cmNlQmFzZSxcclxuICAgICAgICBTb3VyY2VDb25zdHJ1Y3RvcixcclxuICAgICAgICBDYXNzZXR0ZSxcclxuICAgICAgICBGb3JtLFxyXG4gICAgICAgIEZpbHRlclxyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKGNvcmUpO1xyXG5cclxubGV0IGFueSA9IG1vZGVsLmFueTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBjb3JlLFxyXG4gICAgc2NoZW1hLFxyXG4gICAgbW9kZWwsXHJcbiAgICBhbnksXHJcbiAgICBzdGFydFJvdXRpbmdcclxufSJdLCJuYW1lcyI6WyJzY2hlbWEiLCJTb3VyY2UiLCJBU1QuUm9vdCIsIkFTVC5UYXBOb2RlIiwiQVNULkZpbHRlck5vZGUiLCJBU1QuVGVybU5vZGUiLCJBU1QuU291cmNlTm9kZSIsIkFTVC5QaXBlTm9kZSIsIkFTVC5HZW5lcmljTm9kZSIsIlNjaGVtYXMiXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBQ0E7SUFDQTtJQUNBLE1BQU0saUJBQWlCLENBQUM7O0lBRXhCLElBQUksV0FBVyxHQUFHOztJQUVsQixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQ3JDLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFOztJQUVqQixRQUFRLE9BQU8sS0FBSyxDQUFDO0lBQ3JCLEtBQUs7O0lBRUw7O0lBRUE7SUFDQSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFOztJQUUxQixRQUFRLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzVCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLEdBQUc7O0lBRWIsUUFBUSxPQUFPLElBQUksQ0FBQztJQUNwQixLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtJQUNsQjtJQUNBLFFBQVEsT0FBTyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQzFCLEtBQUs7SUFDTCxDQUFDOztJQ2pDRCxNQUFNLHVCQUF1QixTQUFTLGlCQUFpQixDQUFDOztJQUV4RCxJQUFJLFdBQVcsR0FBRzs7SUFFbEIsUUFBUSxLQUFLLEVBQUUsQ0FBQzs7SUFFaEIsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUM3QixLQUFLOztJQUVMLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTs7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QyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDMUQsQ0FBQzs7SUNmRCxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdkQsQ0FBQzs7SUFFRCxTQUFTLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0lBQzNCLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDOztJQUVuQixJQUFJLFNBQVMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7SUFDOUIsUUFBUSxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQzVCLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsWUFBWSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxTQUFTLE1BQU07SUFDZixZQUFZLElBQUksTUFBTSxHQUFHLEdBQUU7SUFDM0IsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENB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LENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLE1BQU0sR0FBRztJQUNiLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztJQUVuQyxRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFMUIsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUMvQixRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQzs7SUFFdkIsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUMvQixRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQzs7SUFFdkIsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDNUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0lBRTVCLFFBQVEsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQixLQUFLOztJQUVMLElBQUksV0FBVyxHQUFHO0lBQ2xCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0lBQ3pGLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0lBQ3pGLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQztJQUN4QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQzs7SUFFeEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDYixFQUFFLE9BQU8sSUFBSSxNQUFNO0lBQ25CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ1IsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDUixFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxFQUFFOztJQUVGLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUNWLEVBQUUsT0FBTyxJQUFJLE9BQU87SUFDcEIsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLEdBQUc7SUFDSCxFQUFFO0lBQ0Y7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOztJQUVBLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNwQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDdEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztJQUM3QixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztJQUVkLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztJQUM3QixHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNiLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRTtJQUNoRCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNiLEdBQUcsWUFBWSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7O0lBRXpDO0lBQ0EsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7O0lBRWxDO0lBQ0EsRUFBRSxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7SUFDeEIsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ25CLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztJQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDeEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN0QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbEIsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztJQUMvQixHQUFHOztJQUVIO0lBQ0EsRUFBRSxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7SUFDMUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0lBQ3hCLEdBQUc7O0lBRUg7SUFDQSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QixFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLEVBQUUsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsRUFBRSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixFQUFFOztJQUVGLENBQUMsTUFBTSxHQUFHO0lBQ1YsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELEVBQUU7O0lBRUYsQ0FBQyxNQUFNLEdBQUc7SUFDVixFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsRUFBRTtJQUNGO0lBQ0EsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1gsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM1RSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFO0lBQ2xDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7SUFDMUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7SUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQzNCLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENB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QyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzdELGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNDLFNBQVM7O0lBRVQsS0FBSzs7SUFFTCxJQUFJLGFBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxHQUFHLEtBQUssRUFBRTtJQUM3QyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO0lBQzFDOztJQUVBLFlBQVksSUFBSSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUVuRCxZQUFZLElBQUksS0FBSyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRTVDLFlBQVksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFdkMsWUFBWSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEQsWUFBWSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFDOztJQUVqRixZQUFZLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlFLFlBQVksSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0lBRWhGLFlBQVksT0FBTyxDQUFDLElB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QUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFDM0MsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM3QixRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDbkMsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUMzQixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDdkIsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUMzQixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQzVCLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDM0IsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QixRQUFRLElBQUksTUFBTTtJQUNsQixZQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsS0FBSzs7OztJQUlMLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtJQUNsQixRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDL0QsS0FBSzs7SUFFTCxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ25DLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUNyRCxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUU7SUFDM0MsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FB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QUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQzlCLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVCLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzVCLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzlCLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzlCLEVBQUUsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9CLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzlCLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzVCLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQy9CLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ25DLEVBQUUsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2pDLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2hDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2hDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ3BDLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xDLEVBQUUsY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25DLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDMUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDckMsRUFB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QUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3JDLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDN0MsRUFBRSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDekMsRUFBRSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDckMsRUFBRSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDdEMsRUFBRSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDeEMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDaEMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEMsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEMsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUM1QyxFQUFFLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzNDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hDLEVBQUUsZUFBZSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3pDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDM0MsRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakMsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDckMsRUFBRSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDekMsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNuRCxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUN0QyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNoQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNwQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvQixFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUN0QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUMvQixFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLGdCQUFnQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzFDLEVBQUUsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3BDLEVBQUUsYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLEVBQUUsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3JDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RDLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDNUMsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM1QyxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN4QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN2QyxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxFQUFFLFdB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Q0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3RELFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4RCxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDMUQsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQzVELEtBQUs7O0lBRUwsSUFBSSxJQUFJLEdBQUc7SUFDWCxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUU7O0lBRWhCLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztJQUV2QyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQzs7SUFFaEMsUUFBUSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUV4QyxRQUFRLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztJQUVqQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkcsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJ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
