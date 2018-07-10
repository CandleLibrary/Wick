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
            this.ele = element;

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

            this.ele.addEventListener("touchstart", this.event_a);

            this.listeners = [];

        }

        destructor() {
            this.listeners = null;
            this.ele.removeEventListener("touchstart", this.event_a);
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

    class Model$1 extends ModelBase {
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
                        } else if (scheme instanceof Model$1)
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
                if (scheme instanceof Array) ; else if (scheme instanceof Model$1) ; else {
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
                    } else if (scheme instanceof Model$1) {
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

    let PresetTransitioneers = { base: Transitioneer };

    class SourceBase extends View {

        constructor(parent = null, data = {}, presets = {}) {

            super();

            this.parent = parent;
            this.ele = null;
            this.children = [];
            this.data = data;
            this.named_elements = null;
            this.active = false;
            this.export_val = null;

            this.DESTROYED = false;

            //Setting the transitioner
            this.trs = null;

            if (data.trs) {

                if (presets.transitions && presets.transitions[data.trs])
                    this.trs = new presets.transitions[data.trs]();
                else if (PresetTransitioneers[data.trs])
                    this.trs = new PresetTransitioneers[data.trs]();

                this.trs.set(this.ele);
            }

            this.addToParent();
        }

        addToParent() {
            if (this.parent) this.parent.children.push(this);
        }

        dstr() {

            this.DESTROYED = true;

            if (this.LOADED) {


                let t = this.transitionOut();

                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];

                    t = Math.max(t, child.transitionOut());
                }

                if (t > 0)
                    setTimeout(() => { this.dstr(); }, t * 1000 + 5);


            } else {
                this.finalizeTransitionOut();
                this.children.forEach((c) => c.dstr());
                this.children.length = 0;
                this.data = null;

                if (this.ele && this.ele.parentElement)
                    this.ele.parentElement.removeChild(this.ele);

                this.ele = null;

                super.dstr();
            }
        }

        bubbleLink(link_url, child, trs_ele = {}) {

            if (this.parent) {

                if (this.data.transition)
                    trs_ele[this.data.transition] = this.ele;

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
                trs_ele[this.data.transition] = this.ele;

            this.children.forEach((e) => {
                if (e.is == 1)
                    e.gatherTransitionElements(trs_ele);
            });
        }

        copy(element, index) {

            let out_object = {};

            if (!element)
                element = this.ele.cloneNode(true);

            if (this.children) {
                out_object.ele = element.children[this.ele];
                out_object.children = new Array(this.children.length);

                for (var i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];
                    out_object.children[i] = child.copy(out_object.ele);
                }
            }

            return out_object;
        }

        handleUrlUpdate(wurl) {}

        finalizeTransitionOut() {

            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].finalizeTransitionOut();

            if (this.trs)
                this.trs.finalize_out(this.ele);

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

            if (this.trs)
                transition_time = Math.max(transition_time, this.trs.set_in(this.ele, this.data, index));

            return transition_time;
        }

        /**
            Takes as an input a list of transition objects that can be used
        */
        transitionOut(index = 0, DESTROY = false) {

            let transition_time = 0;

            this.LOADED = false;

            if (this.trs)
                transition_time = Math.max(transition_time, this.trs.set_out(this.ele, this.data, index));

            for (let i = 0, l = this.children.length; i < l; i++)
                transition_time = Math.max(transition_time, this.children[i].transitionOut(index));

            if (DESTROY)
                setTimeout(() => {
                    this.finalizeTransitionOut();
                    this.dstr();
                }, transition_time * 1000);

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

            if (this.ele) {

                this.display = this.ele.style.display;
                this.ele.style.display = "none";
            }
        }

        show() {

            if (this.ele)
                if (this.ele.style.display == "none")
                    this.ele.style.display = this.display;
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

    /**
     * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
     *
     * {name} Getter
     */
    class Getter {
        constructor(url, process_data) {
            this.url = url;
            this.FETCH_IN_PROGRESS = false;
            this.rurl = process_data;
            this.model = null;
        }

        destructor() {
            this.model = null;
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

        setModel(model){
            if(model instanceof Model){
                this.model = model;
            }
        }

        set(data){
            if(this.model)
                this.model.add(data);
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

            if (this.ele.tagName == "A")
                this.processLink(this.ele);
        }

        dstr() {

            if (this.ele.tagName == "A")
                this.destroyLink(this.ele);

            this.data_cache = null;

            super.dstr();
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
                    this.ele.innerHTML = data[this.prop];
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

            var d = this.ele.getBoundingClientRect();

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

        dstr() {

            this.parent = null;

            if (this.receiver)
                this.receiver.dstr();

            for (let i = 0, l = this.templates.length; i < l; i++)
                this.templates[i].dstr();

            super.dstr();
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

            if (model && model instanceof Model$1) {

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

            this.ele.addEventListener("input", () => {
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
                this.ele.removeChild(this.activeSources[i].ele);
            }

            for (var i = 0; i < output.length; i++) {
                this.ele.appendChild(output[i].ele);
            }

            this.ele.style.position = this.ele.style.position;

            for (var i = 0; i < output.length; i++)
                output[i].transitionIn(i);

            this.activeSources = output;
            //Sort and filter the output to present the results on screen.
        }

        cull(new_items) {

            if (new_items.length == 0) {

                for (let i = 0, l = this.cases.length; i < l; i++)
                    this.cases[i].dstr();

                this.cases.length = 0;

            } else {

                let exists = new Map(new_items.map(e => [e, true]));

                var out = [];

                for (let i = 0, l = this.cases.length; i < l; i++)
                    if (!exists.has(this.cases[i].model)) {
                        this.cases[i].dstr();
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
                    this.model.dstr();

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

        constructor(ele) {

            this.lexer = new Lex(ele.innerHTML);
            this.ele = ele;
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
                            if (--this.sp < 0) return null;
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
            let element = this.ele;
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
            this.ele = element;
            this.Constructor = constructor;
            this.children = [];
            this.templates = [];
            this.filters = [];
            this.terms = [];
            this.d = data;
            this.p = presets;
            this.i = index;
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

            if (this.i > 0) {
                element = indexer.get(this.i);
                CLAIMED_ELEMENT = true;
            }

            if (this.ele) {
                parent_element = this.ele.cloneNode(true);

                if (parent_element.parentElement) {
                    parent_element.parentElement.replaceNode(parent_element, element);
                }


                indexer = new Indexer(parent_element);
            }

            let out_object;
            if (this.Constructor) {
                out_object = new this.Constructor(parent, this.d, this.p, element);
                if (CLAIMED_ELEMENT)
                    out_object.ele = element;
            } else if (!parent) {
                out_object = this.children[0].____copy____(parent_element, null, indexer);
                out_object.ele = parent_element;
                console.log(parent_element.innerHTML);
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

    class Input extends Cassette {
        constructor(parent, element, d, p) {
            //Scan the element and look for inputs that can be mapped to the
            super(parent, element, d, p);

            //Inputs in forms are automatically hidden.
            this.ele.display = "none";

            this.ele.addEventListener("input", () => {
                var data = {};
                data[this.prop] = this.ele.value;
                this.add(data);
            });
        }

        update(data) {

            if (!data[this.prop]) return;

            this.val = data[this.prop];

            switch (this.ele.type) {
                case "date":
                    this.ele.value = (new Date(parseInt(data[this.prop]))).toISOString().split("T")[0];
                    break;
                case "time":
                    this.ele.value = `${("00"+(data[this.prop] | 0)).slice(-2)}:${("00"+((data[this.prop]%1)*60)).slice(-2)}:00.000`;
                    break;
                case "text":
                    this.ele.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                    break;
                default:

                    var t = this.ele.classList[0];

                    switch (t) {
                        case "modulo_time":
                            var time = data[this.prop];
                            var IS_PM = (time / 12 > 1);
                            var minutes = ((time % 1) * 60) | 0;
                            var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

                            this.ele.value = (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? " PM" : " AM");
                            break;

                        default:
                            this.ele.value = (data[this.prop] != undefined) ? data[this.prop] : "";
                    }
                    break;
            }
        }
    }

    class Form extends Cassette {
        constructor(parent, element, d, p) {
            //Scan the element and look for inputs that can be mapped to the 
            super(parent, element, d, p);

            this.router = p.router;

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

        dstr() {

        }

        accepted(result) {
            result.text().then((e) => {
                this.router.loadPage(
                    this.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                    false
                );
            });
        }

        rejected(result) {
            result.text().then((e) => {
                this.router.loadPage(
                    this.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
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

            let url = this.ele.action;

            var form_data = (new FormData(this.ele));
            if (this.schema) {
                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];

                    if (child instanceof Input) {
                        let name = child.ele.name;
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

    class PipeBase {

        constructor(parent = null, data = {}, presets = {}) {
            this.parent = parent;
            this.data = data;
            this.children = [];
            if (this.parent) this.parent.children.push(this);
        }

        load(){
            // NO OP
        }

        dstr() {
            this.data = null;
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
    }

    class Tap extends PipeBase {

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

    class Pipe extends PipeBase {

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
    class IO extends PipeBase {

        constructor(parent, data, presets, element = null) {

            if (element && element.tagName !== "IO") return new AttribIO(parent, data, presets, element);

            super(parent, data, presets);
            this.prop = data.prop;
            this.ele = element;
        }


        down(data) {
            this.ele.innerHTML = data.value;
        }
    }

    /** @namespace IO */

    /**
    	This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
    */
    class AttribIO extends IO {
        constructor(parent, data, presets, element) {
            super(parent, data, presets);

            this.element = element;

            //Remove the index marker
            element.childNodes[0].data = element.childNodes[0].data.replace(/\#\#\:\d*\s/, "");
        }

        /**
        	Puts data into the watched element's attribute. The default action is to simply update the attribute with data.value.  
        */
        down(data) {
            if (this.prop == "style"){
                this.ele.style = data.value;
            }
            else
                this.ele.attributes[this.prop] = data.value;
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

        constructor(tagname, attributes, parent, MiniParse, presets) {
            this.parent = null;
            this.tagname = tagname;
            this.attributes = attributes || {};
            this.IS_NULL = false;
            this.CONSUMES_TAG = true;
            this.CONSUMES_SAME = false;
            this.children = [];
            this.prop_name = null;
            this.html = "";
            this.index_tag = "";
            this.open_tag = "";
            this.close_tag = "";
            this.tag_index = 0;
            this.index = 0;
            if (parent)
                parent.addChild(this);
            if(MiniParse)
                this.treeParseAttributes(MiniParse, presets);
        };

        finalize(ctx) {
            ctx.html += this.open_tag + this.index_tag + this.html + this.close_tag;
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

            if (child instanceof TapNode && !(this instanceof SourceNode))
                return this.parent.addChild(child);

            child.parent = this;
            this.children.push(child);
        }

        setAttribProp(name){
            if(!this.prop_name) this.prop_name = name;

            for (let i = 0; i < this.children.length; i++)
                    this.children[i].setAttribProp(name);
        }

        treeParseAttributes(MiniParse, presets){
             for (let a in this.attributes) {
                let attrib = this.attributes[a];
                if (attrib[0] == "<") {
                    const root = new SourceNode("", null, null);
                    this.index = this.getIndex();
                    root.tag_index = this.index;
                    this.index_tag = "##:" + this.index + " ";
                    let sub_tree = MiniParse(attrib, root, presets);
                    let child = root.children[0];
                    child.setAttribProp(a);
                    this.addChild(child);
                }
            }
        }

        parseAttributes() {
            let out = {};
            out.prop = this.prop_name;

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
            if (this.tag_index > 0) return this.tag_index++;
            if (this.parent) this.index = this.parent.getIndex();
            return this.index;
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
                skl.ele = element;
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

    function MiniParse(string, root, presets){
        const lexer = Lex(string);
        if (lexer.text == "<") {
            ParseTag(lexer, root, presets);
        }
    }


    /**
        Handles the selection of AST nodes based on tagname;
        
        @param {Lexer} lexer - The lexical parser 
        @param {String} tagname - The elements tagname
        @param {Object} attributes - 
        @param {Object} ctx
        @param {CCAstNode} parent
    */
    function Dispatch(lexer, tagname, attributes, parent, presets) {
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
        ast = new GenericNode(tagname, attributes, parent, MiniParse, presets);
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

        let ele = Dispatch(lexer, tagname, attributes, parent, presets);

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

                        ele.finalize(parent || { html: "" }, presets);

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
            this.eles = [];
            this.finalizing_view = null;
            this.type = "normal";
            if (!app_page) debugger
            this.ele = app_page;
            this.ele_backer = null;
            this.LOADED = false;
        }

        destructor() {

            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
                element.destructor();
            }

            this.eles = null;
            this.ele = null;
        }

        unload(transitions) {

            this.LOADED = false;
            
            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
                element.getTransformTo(transitions);
                element.unloadComponents();
            }
        }

        transitionOut(transitions) {

            let time = 0;

            for (var i = 0; i < this.eles.length; i++) 
                time = Math.max(time, this.eles[i].transitionOut(transitions));
            

            return time;
        }

        finalize() {

            if(this.LOADED) return;

            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
                element.finalize();
            }

            if (this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);
        }

        load(app_element, wurl) {

            this.LOADED = true;
            
            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
                element.loadComponents(wurl);
            }

            app_element.appendChild(this.ele);

            var t = this.ele.style.opacity;
        }

        transitionIn(transitions) {

            if (this.type == "modal") {
                if (!this.ele_backer) {
                    this.ele_backer = document.createElement("div");
                    this.ele_backer.classList.add("modal_backer");
                    this.ele.appendChild(this.ele_backer);
                }
                setTimeout(() => {
                    this.ele.style.opacity = 1;
                }, 50);
            }

            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
                element.parent = this;
                element.setTransformTo(transitions);
                element.transitionIn();
            }        
        }

        getNamedElements(named_elements) {

            for (var i = 0; i < this.eles.length; i++) {
                let element = this.eles[i];
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

    class Color extends Float64Array {

        constructor(r, g, b, a = 0) {
            super(4);

            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1;

            if (typeof(r) == "string") {
                this.fromString(r);
            } else {
                this.r = r; //Math.max(Math.min(Math.round(r),255),-255);
                this.g = g; //Math.max(Math.min(Math.round(g),255),-255);
                this.b = b; //Math.max(Math.min(Math.round(b),255),-255);
                this.a = a; //Math.max(Math.min(a,1),-1);
            }
        }

        get r() {
            return this[0];
        }

        set r(r) {
            this[0] = r;
        }

        get g() {
            return this[1];
        }

        set g(g) {
            this[1] = g;
        }

        get b() {
            return this[2];
        }

        set b(b) {
            this[2] = b;
        }

        get a() {
            return this[3];
        }

        set a(a) {
            this[3] = a;
        }

        set(color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            this.a = (color.a != undefined) ? color.a : this.a;
        }

        add(color) {
            return new Color(
                color.r + this.r,
                color.g + this.g,
                color.b + this.b,
                color.a + this.a
            )
        }

        mult(color) {
            if (typeof(color) == "number") {
                return new Color(
                    this.r * color,
                    this.g * color,
                    this.b * color,
                    this.a * color
                )
            } else {
                return new Color(
                    this.r * color.r,
                    this.g * color.g,
                    this.b * color.b,
                    this.a * color.a
                )
            }
        }

        sub(color) {
            return new Color(
                this.r - color.r,
                this.g - color.g,
                this.b - color.b,
                this.a - color.a
            )
        }

        toString() {
            return `rgba(${this.r|0}, ${this.g|0}, ${this.b|0}, ${this.a})`;
        }

        fromString(string) {

            let lexer = Lex(string);

            let r, g, b, a;
            switch (lexer.token.text) {


                case "rgb":
                    lexer.next(); // (
                    r = parseInt(lexer.next().text);
                    lexer.next(); // ,
                    g = parseInt(lexer.next().text);
                    lexer.next(); // ,
                    b = parseInt(lexer.next().text);
                    this.set({ r, g, b });
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
                    this.set({ r, g, b, a });
                    break;

                case "#":
                    var value = lexer.next().text;
                    break;

                default:

                    if (Color.colors[string])
                        this.set(Color.colors[string] || new Color(255, 255, 255, 0.0001));
                    break;
            }
        }
    }

    Color.colors = {
        "transparent": new Color(255, 255, 255, 0.0001),
        "clear": new Color(255, 255, 255, 0.0001),
        "red": new Color(255, 0, 0),
        "green": new Color(0, 255, 0),
        "blue": new Color(0, 0, 255),
        "Black": new Color(0, 0, 0),
        "White": new Color(255, 255, 255),
        "white": new Color(255, 255, 255),
        "Red": new Color(255, 0, 0),
        "Lime": new Color(0, 255, 0),
        "Blue": new Color(0, 0, 255),
        "Yellow": new Color(255, 255, 0),
        "Cyan": new Color(0, 255, 255),
        "Aqua": new Color(0, 255, 255),
        "Magenta": new Color(255, 0, 255),
        "Fuchsia": new Color(255, 0, 255),
        "Silver": new Color(192, 192, 192),
        "Gray": new Color(128, 128, 128),
        "Maroon": new Color(128, 0, 0),
        "Olive": new Color(128, 128, 0),
        "Green": new Color(0, 128, 0),
        "Purple": new Color(128, 0, 128),
        "Teal": new Color(0, 128, 128),
        "Navy": new Color(0, 0, 128),
        "maroon": new Color(128, 0, 0),
        "dark red": new Color(139, 0, 0),
        "brown": new Color(165, 42, 42),
        "firebrick": new Color(178, 34, 34),
        "crimson": new Color(220, 20, 60),
        "red": new Color(255, 0, 0),
        "tomato": new Color(255, 99, 71),
        "coral": new Color(255, 127, 80),
        "indian red": new Color(205, 92, 92),
        "light coral": new Color(240, 128, 128),
        "dark salmon": new Color(233, 150, 122),
        "salmon": new Color(250, 128, 114),
        "light salmon": new Color(255, 160, 122),
        "orange red": new Color(255, 69, 0),
        "dark orange": new Color(255, 140, 0),
        "orange": new Color(255, 165, 0),
        "gold": new Color(255, 215, 0),
        "dark golden rod": new Color(184, 134, 11),
        "golden rod": new Color(218, 165, 32),
        "pale golden rod": new Color(238, 232, 170),
        "dark khaki": new Color(189, 183, 107),
        "khaki": new Color(240, 230, 140),
        "olive": new Color(128, 128, 0),
        "yellow": new Color(255, 255, 0),
        "yellow green": new Color(154, 205, 50),
        "dark olive green": new Color(85, 107, 47),
        "olive drab": new Color(107, 142, 35),
        "lawn green": new Color(124, 252, 0),
        "chart reuse": new Color(127, 255, 0),
        "green yellow": new Color(173, 255, 47),
        "dark green": new Color(0, 100, 0),
        "green": new Color(0, 128, 0),
        "forest green": new Color(34, 139, 34),
        "lime": new Color(0, 255, 0),
        "lime green": new Color(50, 205, 50),
        "light green": new Color(144, 238, 144),
        "pale green": new Color(152, 251, 152),
        "dark sea green": new Color(143, 188, 143),
        "medium spring green": new Color(0, 250, 154),
        "spring green": new Color(0, 255, 127),
        "sea green": new Color(46, 139, 87),
        "medium aqua marine": new Color(102, 205, 170),
        "medium sea green": new Color(60, 179, 113),
        "light sea green": new Color(32, 178, 170),
        "dark slate gray": new Color(47, 79, 79),
        "teal": new Color(0, 128, 128),
        "dark cyan": new Color(0, 139, 139),
        "aqua": new Color(0, 255, 255),
        "cyan": new Color(0, 255, 255),
        "light cyan": new Color(224, 255, 255),
        "dark turquoise": new Color(0, 206, 209),
        "turquoise": new Color(64, 224, 208),
        "medium turquoise": new Color(72, 209, 204),
        "pale turquoise": new Color(175, 238, 238),
        "aqua marine": new Color(127, 255, 212),
        "powder blue": new Color(176, 224, 230),
        "cadet blue": new Color(95, 158, 160),
        "steel blue": new Color(70, 130, 180),
        "corn flower blue": new Color(100, 149, 237),
        "deep sky blue": new Color(0, 191, 255),
        "dodger blue": new Color(30, 144, 255),
        "light blue": new Color(173, 216, 230),
        "sky blue": new Color(135, 206, 235),
        "light sky blue": new Color(135, 206, 250),
        "midnight blue": new Color(25, 25, 112),
        "navy": new Color(0, 0, 128),
        "dark blue": new Color(0, 0, 139),
        "medium blue": new Color(0, 0, 205),
        "blue": new Color(0, 0, 255),
        "royal blue": new Color(65, 105, 225),
        "blue violet": new Color(138, 43, 226),
        "indigo": new Color(75, 0, 130),
        "dark slate blue": new Color(72, 61, 139),
        "slate blue": new Color(106, 90, 205),
        "medium slate blue": new Color(123, 104, 238),
        "medium purple": new Color(147, 112, 219),
        "dark magenta": new Color(139, 0, 139),
        "dark violet": new Color(148, 0, 211),
        "dark orchid": new Color(153, 50, 204),
        "medium orchid": new Color(186, 85, 211),
        "purple": new Color(128, 0, 128),
        "thistle": new Color(216, 191, 216),
        "plum": new Color(221, 160, 221),
        "violet": new Color(238, 130, 238),
        "magenta": new Color(255, 0, 255),
        "fuchsia": new Color(255, 0, 255),
        "orchid": new Color(218, 112, 214),
        "medium violet red": new Color(199, 21, 133),
        "pale violet red": new Color(219, 112, 147),
        "deep pink": new Color(255, 20, 147),
        "hot pink": new Color(255, 105, 180),
        "light pink": new Color(255, 182, 193),
        "pink": new Color(255, 192, 203),
        "antique white": new Color(250, 235, 215),
        "beige": new Color(245, 245, 220),
        "bisque": new Color(255, 228, 196),
        "blanched almond": new Color(255, 235, 205),
        "wheat": new Color(245, 222, 179),
        "corn silk": new Color(255, 248, 220),
        "lemon chiffon": new Color(255, 250, 205),
        "light golden rod yellow": new Color(250, 250, 210),
        "light yellow": new Color(255, 255, 224),
        "saddle brown": new Color(139, 69, 19),
        "sienna": new Color(160, 82, 45),
        "chocolate": new Color(210, 105, 30),
        "peru": new Color(205, 133, 63),
        "sandy brown": new Color(244, 164, 96),
        "burly wood": new Color(222, 184, 135),
        "tan": new Color(210, 180, 140),
        "rosy brown": new Color(188, 143, 143),
        "moccasin": new Color(255, 228, 181),
        "navajo white": new Color(255, 222, 173),
        "peach puff": new Color(255, 218, 185),
        "misty rose": new Color(255, 228, 225),
        "lavender blush": new Color(255, 240, 245),
        "linen": new Color(250, 240, 230),
        "old lace": new Color(253, 245, 230),
        "papaya whip": new Color(255, 239, 213),
        "sea shell": new Color(255, 245, 238),
        "mint cream": new Color(245, 255, 250),
        "slate gray": new Color(112, 128, 144),
        "light slate gray": new Color(119, 136, 153),
        "light steel blue": new Color(176, 196, 222),
        "lavender": new Color(230, 230, 250),
        "floral white": new Color(255, 250, 240),
        "alice blue": new Color(240, 248, 255),
        "ghost white": new Color(248, 248, 255),
        "honeydew": new Color(240, 255, 240),
        "ivory": new Color(255, 255, 240),
        "azure": new Color(240, 255, 255),
        "snow": new Color(255, 250, 250),
        "black": new Color(0, 0, 0),
        "dim gray": new Color(105, 105, 105),
        "dim grey": new Color(105, 105, 105),
        "gray": new Color(128, 128, 128),
        "grey": new Color(128, 128, 128),
        "dark gray": new Color(169, 169, 169),
        "dark grey": new Color(169, 169, 169),
        "silver": new Color(192, 192, 192),
        "light gray": new Color(211, 211, 211),
        "light grey": new Color(211, 211, 211),
        "gainsboro": new Color(220, 220, 220),
        "white smoke": new Color(245, 245, 245),
        "white": new Color(255, 255, 255)
    };

    const ease_out = new CBezier(0.5, 0.2, 0, 1);

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

            this.ele = element;

        }

        destructor() {
            this.ele = null;
            this.color = null;
        }

        start() {
            this.ele.style.opacity = 0;
        }

        end() {
            this.ele.style.opacity = 1;
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
            this.ele = null;
            super.destructor();
        }

        start() {
            this.ele.style.opacity = 1;
            this.ele.style.top = this.from.top + "px";
            this.ele.style.left = this.from.left + "px";
            this.ele.style.width = this.from.width + "px";
            this.ele.style.height = this.from.height + "px";
        }

        step() {
            this.s++;

                var t = this.s / this.time;

            if (t > 1) return false;

            var ratio = ease_out.getYatX(t);

            if (ratio > 1) ratio = 1;

            this.ele.style.top = Math.round((this.top - this.from.top) * ratio + this.from.top) + "px";
            this.ele.style.left = Math.round((this.left - this.from.left) * ratio + this.from.left) + "px";
            this.ele.style.width = ((this.width - this.from.width) * ratio + this.from.width) + "px";
            this.ele.style.height = ((this.height - this.from.height) * ratio + this.from.height) + "px";
            this.ele.style.backgroundColor = (this.color.sub(this.from.color).mult(ratio).add(this.from.color)) + "";

            return (t < 0.9999995);
        }

        end() {
            this.ele.style.backgroundColor = null;
            this.ele.style.height = this.height_o;
            this.ele.style.width = this.width_o;
            this.ele.style.top = this.rt;
            this.ele.style.left = this.rl;
        }
    }


    class TTPair {
        constructor(e_to, e_from) {
            this.b = (e_from instanceof TT_From) ? e_from : new TT_From(e_from);
            this.a = new TT_To(e_to, this.b);

            if (this.a.ele.__TT__)
                this.a.ele.__TT__.destructor();

            if (this.b.ele.__TT__)
                this.b.ele.__TT__.destructor();

            this.a.ele.__TT__ = this;
            this.b.ele.__TT__ = this;

            this.destroyed = false;

            this.start();
        }

        destructor() {
            if (this.destroyed) return
            if (this.b.ele)
                this.b.ele.__TT__ = null;
            if (this.a.ele)
                this.a.ele.__TT__ = null;
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

    const TransformRunner = new(class {
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

            if (rp.length > 0)
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
            this.transitioneer.set(this.ele);
        }

        getNamedElements(named_elements) {

            let children = this.ele.children;

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
            this.transitioneer.set(this.ele);
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
            this.ele = element;
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
                    this.wraps[i].removeChild(component.ele);
                }

                component.LOADED = false;
            }
        }

        loadComponents(wurl) {

            for (let i = 0; i < this.components.length; i++) {

                let component = this.components[i];

                component.parent = this;

                if (component.ele.parentElement)
                    component.ele.parentElement.removeChild(component.ele);

                this.wraps[i].appendChild(component.ele);

                component.handleUrlUpdate(wurl);

                this.components[i].LOADED = true;
            }    }

        transitionIn() {

            // This is to force a document repaint, which should cause all elements to report correct positioning hereafter

            let t = this.ele.style.top;

            this.ele.style.top = t;

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

            let children = this.ele.children;

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
            var components = Array.prototype.map.call(this.ele.getElementsByTagName("component"), (a) => a);

            setLinks(this.ele, (href, e) => {
                history.pushState({}, "ignored title", href);
                window.onpopstate();
                return true;
            });

            if (components.length < 1) {
                //Create a wrapped component for the elements inside the <element>
                let component = document.createElement("div");
                component.classList.add("comp_wrap");

                //Straight up string copy of the element's DOM.
                component.innerHTML = this.ele.innerHTML;
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

    const URL_HOST = { wurl: null };

    /** @namespace Router */

    const URL = (function() {

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

            presets.router = this;

            this.pages = {};
            this.components = {};
            this.component_constructors = {};
            this.models_constructors = {};
            this.presets = presets;
            this.current_url = null;
            this.current_query;
            this.current_view = null;
            this.finalizing_pages = [];

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

                    page.eles.push(component);

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

    const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

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
    const model = Model$1;

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
    const schema$1 = schema;
    schema$1.constr = SchemaConstructor;
    schema$1.constr.bool = BoolSchemaConstructor;
    schema$1.constr.number = NumberSchemaConstructor;
    schema$1.constr.string = StringSchemaConstructor;
    schema$1.constr.date = DateSchemaConstructor;
    schema$1.constr.time = TimeSchemaConstructor;

    Object.freeze(schema$1.constr);
    Object.freeze(schema$1);


    const core = {
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
            Model: Model$1,
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

    const any = model.any;

    exports.core = core;
    exports.schema = schema$1;
    exports.model = model;
    exports.any = any;
    exports.startRouting = startRouting;

    return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ljay1kZXYuanMiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9zY2hlbWEvY29uc3RydWN0b3IuanMiLCIuLi9zb3VyY2Uvc2NoZW1hL3R5cGVzL251bWJlci5qcyIsIi4uL3NvdXJjZS9jb21tb24vc3RyaW5nX3BhcnNpbmcvbGV4ZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL3N0cmluZ19wYXJzaW5nL3Rva2VuaXplci5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL21vbnRocy5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL2RheXNfb2Zfd2Vlay5qcyIsIi4uL3NvdXJjZS9jb21tb24vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoLmpzIiwiLi4vc291cmNlL2NvbW1vbi9kYXRlX3RpbWUvdGltZS5qcyIsIi4uL3NvdXJjZS9jb21tb24vbWF0aC9wb2ludDJELmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL3F1YWRyYXRpY19iZXppZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL21hdGgvY29uc3RzLmpzIiwiLi4vc291cmNlL2NvbW1vbi9tYXRoL2N1YmljX2Jlemllci5qcyIsIi4uL3NvdXJjZS9jb21tb24vdXJsL3VybC5qcyIsIi4uL3NvdXJjZS9jb21tb24vZXZlbnQvdG91Y2hfc2Nyb2xsZXIuanMiLCIuLi9zb3VyY2UvY29tbW9uL2NvbW1vbi5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvdHlwZXMvZGF0ZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvdHlwZXMvdGltZS5qcyIsIi4uL3NvdXJjZS9zY2hlbWEvdHlwZXMvc3RyaW5nLmpzIiwiLi4vc291cmNlL3NjaGVtYS90eXBlcy9ib29sLmpzIiwiLi4vc291cmNlL3NjaGVtYS9zY2hlbWFzLmpzIiwiLi4vc291cmNlL3ZpZXcvdmlldy5qcyIsIi4uL3NvdXJjZS9jb21tb24vc2NoZWR1bGVyLmpzIiwiLi4vc291cmNlL21vZGVsL2Jhc2UuanMiLCIuLi9zb3VyY2UvbW9kZWwvY29udGFpbmVyL2Jhc2UuanMiLCIuLi9zb3VyY2UvbW9kZWwvY29udGFpbmVyL211bHRpLmpzIiwiLi4vc291cmNlL21vZGVsL2NvbnRhaW5lci9hcnJheS5qcyIsIi4uL3NvdXJjZS9tb2RlbC9jb250YWluZXIvYnRyZWUuanMiLCIuLi9zb3VyY2UvbW9kZWwvbW9kZWwuanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlci5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvYmFzZS5qcyIsIi4uL3NvdXJjZS9uZXR3b3JrL2dldHRlci5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvY2Fzc2V0dGUvY2Fzc2V0dGUuanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZS5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvY2Fzc2V0dGUvZmlsdGVyLmpzIiwiLi4vc291cmNlL3NvdXJjZS9zb3VyY2VfdGVtcGxhdGUuanMiLCIuLi9zb3VyY2Uvc291cmNlL3NvdXJjZV9za2VsZXRvbi5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvY2Fzc2V0dGUvaW5wdXQuanMiLCIuLi9zb3VyY2Uvc291cmNlL2Nhc3NldHRlL2Zvcm0uanMiLCIuLi9zb3VyY2Uvc291cmNlL3BpcGVfYmFzZS5qcyIsIi4uL3NvdXJjZS9zb3VyY2UvdGFwcy90YXAuanMiLCIuLi9zb3VyY2Uvc291cmNlL3BpcGVzL3BpcGUuanMiLCIuLi9zb3VyY2Uvc291cmNlL2lvL2lvLmpzIiwiLi4vc291cmNlL3NvdXJjZS9zb3VyY2VfY29uc3RydWN0b3JfYXN0LmpzIiwiLi4vc291cmNlL3NvdXJjZS9zb3VyY2VfY29uc3RydWN0b3IuanMiLCIuLi9zb3VyY2UvbmV0d29yay9zZXR0ZXIuanMiLCIuLi9zb3VyY2UvbmV0d29yay9yb3V0ZXIvd3VybC5qcyIsIi4uL3NvdXJjZS9uZXR3b3JrL3JvdXRlci9wYWdlLmpzIiwiLi4vc291cmNlL25ldHdvcmsvcm91dGVyL3NldGxpbmtzLmpzIiwiLi4vc291cmNlL2FuaW1hdGlvbi9jb2xvci5qcyIsIi4uL3NvdXJjZS9hbmltYXRpb24vdHJhbnNmb3JtdG8uanMiLCIuLi9zb3VyY2UvYW5pbWF0aW9uL2FuaW1hdGlvbi5qcyIsIi4uL3NvdXJjZS9uZXR3b3JrL3JvdXRlci9jb21wb25lbnQuanMiLCIuLi9zb3VyY2UvbmV0d29yay9yb3V0ZXIvcm91dGVyLmpzIiwiLi4vc291cmNlL3dpY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcblx0U2NoZW1hIHR5cGUuIEhhbmRsZXMgdGhlIHBhcnNpbmcsIHZhbGlkYXRpb24sIGFuZCBmaWx0ZXJpbmcgb2YgTW9kZWwgZGF0YSBwcm9wZXJ0aWVzLiBcclxuKi9cclxuY2xhc3MgU2NoZW1hQ29uc3RydWN0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRQYXJzZXMgdmFsdWUgcmV0dXJucyBhbiBhcHByb3ByaWF0ZSB0cmFuc2Zvcm1lZCB2YWx1ZVxyXG4gICAgKi9cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuXHJcbiAgICAqL1xyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgXHRcclxuICAgICAgICByZXR1cm4gdmFsdWUgKyBcIlwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciB9OyIsImltcG9ydCB7IFNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL2NvbnN0cnVjdG9yLmpzXCJcclxuXHJcbmNsYXNzIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yIGV4dGVuZHMgU2NoZW1hQ29uc3RydWN0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbHVlID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09IE5hTiB8fCB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlc3VsdC5yZWFzb24gPSBcIkludmFsaWQgbnVtYmVyIHR5cGUuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyID09IGZpbHRlcnNbaV0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbnVtYmVyID0gbmV3IE51bWJlclNjaGVtYUNvbnN0cnVjdG9yKClcclxuXHJcbmV4cG9ydCB7IG51bWJlciwgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IgfTsiLCJ2YXIgbnVsbF90b2tlbiA9IHtcclxuICAgIHR5cGU6IFwiXCIsXHJcbiAgICB0ZXh0OiBcIlwiXHJcbn07XHJcblxyXG5jbGFzcyBMZXhlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbml6ZXIpIHtcclxuICAgICAgICB0aGlzLnRrID0gdG9rZW5pemVyO1xyXG5cclxuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW5pemVyLm5leHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbDtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMudG9rZW4gJiYgKHRoaXMudG9rZW4udHlwZSA9PT0gXCJuZXdfbGluZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJ3aGl0ZV9zcGFjZVwiIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gXCJnZW5lcmljXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKXtcclxuICAgICAgICB0aGlzLnRrLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy50b2tlbiA9IHRoaXMudGsubmV4dCgpO1xyXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5ob2xkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLmhvbGQ7XHJcbiAgICAgICAgICAgIHRoaXMuaG9sZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSB0aGlzLnRrLm5leHQoKTtcclxuICAgICAgICB9IHdoaWxlICh0aGlzLnRva2VuICYmICh0aGlzLnRva2VuLnR5cGUgPT09IFwibmV3X2xpbmVcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwid2hpdGVfc3BhY2VcIiB8fCB0aGlzLnRva2VuLnR5cGUgPT09IFwiZ2VuZXJpY1wiKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRva2VuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQodGV4dCkge1xyXG4gICAgICAgIGlmICghdGhpcy50b2tlbikgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RpbmcgJHt0ZXh0fSBnb3QgbnVsbGApO1xyXG5cclxuICAgICAgICB2YXIgYm9vbCA9IHRoaXMudG9rZW4udGV4dCA9PSB0ZXh0O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGJvb2wpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nIFwiJHt0ZXh0fVwiIGdvdCBcIiR7dGhpcy50b2tlbi50ZXh0fVwiYClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib29sO1xyXG4gICAgfVxyXG5cclxuICAgIHBlZWsoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ob2xkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ob2xkID0gdGhpcy50ay5uZXh0KCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ob2xkKSByZXR1cm4gbnVsbF90b2tlbjtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMuaG9sZCAmJiAodGhpcy5ob2xkLnR5cGUgPT09IFwibmV3X2xpbmVcIiB8fCB0aGlzLmhvbGQudHlwZSA9PT0gXCJ3aGl0ZV9zcGFjZVwiIHx8IHRoaXMuaG9sZC50eXBlID09PSBcImdlbmVyaWNcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5ob2xkID0gdGhpcy50ay5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ob2xkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhvbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbF90b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy50b2tlbilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4udGV4dDtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdHlwZSgpIHtcclxuICAgICAgICBpZiAodGhpcy50b2tlbilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4udHlwZTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcG9zKCl7XHJcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuLnBvcztcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpY2Uoc3RhcnQpIHtcclxuICAgICAgICBpZiAodGhpcy50b2tlbilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGsuc3RyaW5nLnNsaWNlKHN0YXJ0LCB0aGlzLnRva2VuLnBvcylcclxuICAgICAgICByZXR1cm4gdGhpcy50ay5zdHJpbmcuc2xpY2Uoc3RhcnQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IExleGVyIH0iLCIvL0NvbXBhcmVzIGNvZGUgd2l0aCBhcmd1bWVudCBsaXN0IGFuZCByZXR1cm5zIHRydWUgaWYgbWF0Y2ggaXMgZm91bmQsIG90aGVyd2lzZSBmYWxzZSBpcyByZXR1cm5lZFxyXG5mdW5jdGlvbiBjb21wYXJlQ29kZShjb2RlKSB7XHJcbiAgICB2YXIgbGlzdCA9IGFyZ3VtZW50cztcclxuICAgIGZvciAodmFyIGkgPSAxLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAobGlzdFtpXSA9PT0gY29kZSkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vUmV0dXJucyB0cnVlIGlmIGNvZGUgbGllcyBiZXR3ZWVuIHRoZSBvdGhlciB0d28gYXJndW1lbnRzXHJcbmZ1bmN0aW9uIGluUmFuZ2UoY29kZSkge1xyXG4gICAgcmV0dXJuIChjb2RlID4gYXJndW1lbnRzWzFdICYmIGNvZGUgPCBhcmd1bWVudHNbMl0pO1xyXG59XHJcblxyXG4vL1RoZSByZXN1bHRpbmcgYXJyYXkgaXMgdXNlZCB3aGlsZSBwYXJzaW5nIGFuZCB0b2tlbml6aW5nIHRva2VuIHN0cmluZ3NcclxudmFyIHN0cmluZ19wYXJzZV9hbmRfZm9ybWF0X2Z1bmN0aW9ucyA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciBhcnJheSA9IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgICAgICAgIC8vSW5pdGlhbCBjaGVjayBmdW5jdGlvbi4gUmV0dXJuIGluZGV4IG9mZnNldCB0byBzdGFydCBmb3Igc2Nhbi4gSWYgMCBpcyByZXR1cm5lZCB0aGVuIHRoZSBwYXJzZXIgd2lsbCBtb3ZlIG9uIHRvIHRoZSBuZXh0IGNoZWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNoZWNrKGNvZGUsIHRleHQsIG9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluUmFuZ2UoY29kZSwgNDcsIDU4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSB0ZXh0LmNoYXJDb2RlQXQoMSArIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBhcmVDb2RlKGNvZGUsIDY2LCA5OCwgODgsIDEyMCwgNzksIDExMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb2RlID09IDQ2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IHRleHQuY2hhckNvZGVBdCgxICsgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5SYW5nZShjb2RlLCA0NywgNTgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCA0NywgNTgpIHx8IGNvZGUgPT09IDQ2KSA/IC0xIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmdiKDIwLDQwLDE4MClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaWRlbnRpZmllclwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgNjQsIDkxKSB8fCBpblJhbmdlKGNvZGUsIDk2LCAxMjMpKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoaW5SYW5nZShjb2RlLCA0NywgNTgpIHx8IGluUmFuZ2UoY29kZSwgNjQsIDkxKSB8fCBpblJhbmdlKGNvZGUsIDk2LCAxMjMpIHx8IGNvbXBhcmVDb2RlKGNvZGUsIDM1LCAzNiwgNDUsIDk1KSkgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vdG9rZW4uY29sb3IgPSByYW5kb21Db2xvcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sLyoge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbW1lbnRcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSwgdGV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgoY29kZSA9PT0gNDcpICYmICh0ZXh0LmNoYXJDb2RlQXQoMSkgPT09IDQ3KSkgPyAyIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluUmFuZ2UoY29kZSwgMzIsIDEyOCkgfHwgY29kZSA9PT0gMzIgfHwgY29kZSA9PT0gOSkgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCAqL3tcclxuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSwgdGV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzNCkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvZGUgPT09IDM0KSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwid2hpdGVfc3BhY2VcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAzMiB8fCBjb2RlID09PSA5KSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY29kZSA9PT0gMzIgfHwgY29kZSA9PT0gOSkgPyAtMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwibmV3X2xpbmVcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb2RlID09PSAxMCkgPyAxIDogMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm9wZW5fYnJhY2tldFwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZUNvZGUoY29kZSwgMTIzLCA0MCwgOTEpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9TaW5nbGUgY2hhcmFjdGVyLCBlbmQgY29tZXMgaW1tZWRpYXRseVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigxMDAsMTAwLDEwMClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2xvc2VfYnJhY2tldFwiLFxyXG4gICAgICAgICAgICAvL0luaXRpYWwgY2hlY2sgZnVuY3Rpb24uIFJldHVybiBpbmRleCBvZmZzZXQgdG8gc3RhcnQgZm9yIHNjYW4uIElmIDAgaXMgcmV0dXJuZWQgdGhlbiB0aGUgcGFyc2VyIHdpbGwgbW92ZSBvbiB0byB0aGUgbmV4dCBjaGVjayBmdW5jdGlvblxyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZUNvZGUoY29kZSwgMTI1LCA0MSwgOTMpID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFNjYW4gZm9yIGVuZCBvZiB0b2tlbi4gUmV0dXJuIGZhbHNlIGlmIGNoYXJhY3RlciBub3QgcGFydCBvZiB0b2tlblxyXG4gICAgICAgICAgICBzY2FuVG9FbmQoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgLy9TaW5nbGUgY2hhcmFjdGVyLCBlbmQgY29tZXMgaW1tZWRpYXRseVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdCh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4uY29sb3IgPSBcInJnYigxMDAsMTAwLDEwMClcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiT3BlcmF0b3JcIixcclxuICAgICAgICAgICAgLy9Jbml0aWFsIGNoZWNrIGZ1bmN0aW9uLiBSZXR1cm4gaW5kZXggb2Zmc2V0IHRvIHN0YXJ0IGZvciBzY2FuLiBJZiAwIGlzIHJldHVybmVkIHRoZW4gdGhlIHBhcnNlciB3aWxsIG1vdmUgb24gdG8gdGhlIG5leHQgY2hlY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgY2hlY2soY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVDb2RlKGNvZGUsIDQyLCA0MywgNjAsIDYxLCA2MiwgOTIsIDM4LCAzNywgMzMsIDk0LCAxMjQsIDU4KSA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBTY2FuIGZvciBlbmQgb2YgdG9rZW4uIFJldHVybiBmYWxzZSBpZiBjaGFyYWN0ZXIgbm90IHBhcnQgb2YgdG9rZW5cclxuICAgICAgICAgICAgc2NhblRvRW5kKGNvZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vU2luZ2xlIGNoYXJhY3RlciwgZW5kIGNvbWVzIGltbWVkaWF0bHlcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLmNvbG9yID0gXCJyZ2IoMjA1LDEyMCwwKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJTeW1ib2xcIiwgLy9FdmVyeXRoaW5nIGVsc2Ugc2hvdWxkIGJlIGdlbmVyaWMgc3ltYm9sc1xyXG4gICAgICAgICAgICBjaGVjayhjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gU2NhbiBmb3IgZW5kIG9mIHRva2VuLiBSZXR1cm4gZmFsc2UgaWYgY2hhcmFjdGVyIG5vdCBwYXJ0IG9mIHRva2VuXHJcbiAgICAgICAgICAgIHNjYW5Ub0VuZChjb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvL0dlbmVyaWMgd2lsbCBjYXB0dXJlIEFOWSByZW1haW5kZXIgY2hhcmFjdGVyIHNldHMuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0KHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5jb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIC8vVGhpcyBhbGxvd3MgZm9yIGNyZWF0aW9uIGN1c3RvbSBwYXJzZXJzIGFuZCBmb3JtYXR0ZXJzIGJhc2VkIHVwb24gdGhpcyBvYmplY3QuXHJcbiAgICBhcnJheS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmdfcGFyc2VfYW5kX2Zvcm1hdF9mdW5jdGlvbnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFycmF5O1xyXG59KTtcclxuXHJcbnZhciBTUEYgPSBzdHJpbmdfcGFyc2VfYW5kX2Zvcm1hdF9mdW5jdGlvbnMoKTtcclxudmFyIFNQRl9sZW5ndGggPSBTUEYubGVuZ3RoO1xyXG5cclxuY2xhc3MgVG9rZW5pemVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0cmluZykge1xyXG4gICAgXHR0aGlzLmggPSBudWxsO1xyXG5cdCAgICB0aGlzLmxpbmUgPSAwO1xyXG5cdCAgICB0aGlzLmNoYXIgPSAwO1xyXG5cdCAgICB0aGlzLm9mZnNldCA9IDA7XHJcblx0ICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy5saW5lID0gMDtcclxuICAgICAgICB0aGlzLmNoYXIgPSAwO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBob2xkKHRva2VuKSB7XHJcbiAgICAgICAgdGhpcy5oID0gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHRva2VuX2xlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmgpIHtcclxuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLmg7XHJcbiAgICAgICAgICAgIHRoaXMuaCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RyaW5nLmxlbmd0aCA8IDEpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG9mZnNldCA+PSB0aGlzLnN0cmluZy5sZW5ndGgpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICB2YXIgY29kZSA9IHRoaXMuc3RyaW5nLmNoYXJDb2RlQXQob2Zmc2V0KTtcclxuICAgICAgICBsZXQgU1BGX2Z1bmN0aW9uO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgU1BGX2xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFNQRl9mdW5jdGlvbiA9IFNQRltpXTtcclxuICAgICAgICAgICAgbGV0IHRlc3RfaW5kZXggPSBTUEZfZnVuY3Rpb24uY2hlY2soY29kZSwgdGhpcy5zdHJpbmcsIG9mZnNldCk7XHJcbiAgICAgICAgICAgIGlmICh0ZXN0X2luZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gU1BGX2Z1bmN0aW9uLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSB0ZXN0X2luZGV4OyBpIDwgdGhpcy5zdHJpbmcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBlID0gU1BGX2Z1bmN0aW9uLnNjYW5Ub0VuZCh0aGlzLnN0cmluZy5jaGFyQ29kZUF0KGkgKyBvZmZzZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IC0xKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBlID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRva2VuX2xlbmd0aCA9IGkgKyBlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZW1wID0gdGhpcy5zdHJpbmcuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b2tlbl9sZW5ndGgpO1xyXG5cclxuICAgICAgICBpZiAoU1BGX2Z1bmN0aW9uLnR5cGUgPT09IFwibmV3X2xpbmVcIikge1xyXG4gICAgICAgICAgICB0aGlzLmNoYXIgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxpbmUrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvdXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IFNQRl9mdW5jdGlvbi50eXBlLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZW1wLFxyXG4gICAgICAgICAgICBwb3M6IHRoaXMub2Zmc2V0LFxyXG4gICAgICAgICAgICBsZW5ndGg6IHRva2VuX2xlbmd0aCxcclxuICAgICAgICAgICAgY2hhcjogdGhpcy5jaGFyLFxyXG4gICAgICAgICAgICBsaW5lOiB0aGlzLmxpbmVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9mZnNldCArPSB0b2tlbl9sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5jaGFyICs9IHRva2VuX2xlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtUb2tlbml6ZXJ9XHJcbiIsImNvbnN0IG1vbnRocyA9IFt7XHJcbiAgICBuYW1lOiBcIkphbnVhcnlcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMCxcclxuICAgIGRheV9vZmZzZV9sZWFwdDogMFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkZlYnJ1YXJ5XCIsXHJcbiAgICBkYXlzOiAyOCxcclxuICAgIGRheV9vZmZzZXQ6IDMxLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAzMVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk1hcmNoXCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDU5LFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiA2MFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkFwcmlsXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDkwLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiA5MVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk1heVwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAxMjAsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDEyMVxyXG59LCB7XHJcbiAgICBuYW1lOiBcIkp1bmVcIixcclxuICAgIGRheXM6IDMwLFxyXG4gICAgZGF5X29mZnNldDogMTUxLFxyXG4gICAgZGF5X29mZnNldF9sZWFwOiAxNTJcclxufSwge1xyXG4gICAgbmFtZTogXCJKdWx5XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDE4MSxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMTgyXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiQXVndXN0XCIsXHJcbiAgICBkYXlzOiAzMSxcclxuICAgIGRheV9vZmZzZXQ6IDIxMixcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMjEzXHJcbn0sIHtcclxuICAgIG5hbWU6IFwiU2VwdGVtYmVyXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDI0MyxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMjQ0XHJcbn0sIHtcclxuICAgIG5hbWU6IFwiT2N0b2JlclwiLFxyXG4gICAgZGF5czogMzEsXHJcbiAgICBkYXlfb2Zmc2V0OiAyNzMsXHJcbiAgICBkYXlfb2Zmc2V0X2xlYXA6IDI3NFxyXG59LCB7XHJcbiAgICBuYW1lOiBcIk5vdmVtYmVyXCIsXHJcbiAgICBkYXlzOiAzMCxcclxuICAgIGRheV9vZmZzZXQ6IDMwNCxcclxuICAgIGRheV9vZmZzZXRfbGVhcDogMzA1XHJcbn0sIHtcclxuICAgIG5hbWU6IFwiRGVjZW1iZXJcIixcclxuICAgIGRheXM6IDMxLFxyXG4gICAgZGF5X29mZnNldDogMzMsXHJcbiAgICBkYXlfb2Zmc2VfbGVhcHQ6IDMzNVxyXG59XVxyXG5cclxuZXhwb3J0IHttb250aHN9IiwiXHJcbnZhciBkb3cgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcclxuXHJcbmV4cG9ydCB7ZG93fSIsImZ1bmN0aW9uIEdldERheVN0YXJ0QW5kRW5kKGRhdGUpIHtcclxuICAgIHZhciBydmFsID0ge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGVuZDogMFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mKGRhdGUpID09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShkYXRlKTtcclxuXHJcbiAgICAgICAgZC5zZXRIb3VycygwKTtcclxuICAgICAgICBkLnNldE1pbnV0ZXMoMCk7XHJcbiAgICAgICAgZC5zZXRTZWNvbmRzKDApO1xyXG4gICAgICAgIGQuc2V0TWlsbGlzZWNvbmRzKDApXHJcblxyXG4gICAgICAgIHJ2YWwuc3RhcnQgPSBkLnZhbHVlT2YoKTtcclxuICAgICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICBkLnNldFNlY29uZHMoLTEpO1xyXG4gICAgICAgIHJ2YWwuZW5kID0gZC52YWx1ZU9mKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJ2YWw7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBHZXREYXlTdGFydEFuZEVuZFxyXG59IiwiZnVuY3Rpb24gZmxvYXQyNHRvMTJNb2RUaW1lKHRpbWUsIENBUElUQUwpIHtcclxuICAgIHZhciBJU19QTSA9IHRpbWUgPj0gMTIgJiYgdGltZSA8IDI0O1xyXG4gICAgdmFyIG1pbnV0ZXMgPSAoKHRpbWUgJSAxKSAqIDYwKSB8IDA7XHJcbiAgICB2YXIgaG91cnMgPSAoKCh0aW1lIHwgMCkgJSAxMikgIT0gMCkgPyAodGltZSB8IDApICUgMTIgOiAxMjtcclxuXHJcbiAgICByZXR1cm4gKGhvdXJzICsgXCI6XCIgKyAoXCIwXCIgKyBtaW51dGVzKS5zbGljZSgtMikpICsgKChJU19QTSkgPyAoQ0FQSVRBTCkgPyBcIlBNXCIgOlwicG1cIiA6IChDQVBJVEFMKSA/IFwiQU1cIiA6IFwiYW1cIik7XHJcbn1cclxuXHJcbmV4cG9ydCB7ZmxvYXQyNHRvMTJNb2RUaW1lfSIsImNsYXNzIFBvaW50MkQgZXh0ZW5kcyBGbG9hdDY0QXJyYXl7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoeCwgeSkge1xyXG5cdFx0c3VwZXIoMilcclxuXHJcblx0XHRpZiAodHlwZW9mKHgpID09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0dGhpc1swXSA9IHg7XHJcblx0XHRcdHRoaXNbMV0gPSB5O1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHR0aGlzWzBdID0geFswXTtcclxuXHRcdFx0dGhpc1sxXSA9IHhbMV07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkcmF3KGN0eCwgcyA9IDEpe1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbyh0aGlzLngqcyx0aGlzLnkqcyk7XHJcblx0XHRjdHguYXJjKHRoaXMueCpzLCB0aGlzLnkqcywgcyowLjAxLCAwLCAyKk1hdGguUEkpO1xyXG5cdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdH1cclxuXHJcblx0Z2V0IHggKCl7IHJldHVybiB0aGlzWzBdfVxyXG5cdHNldCB4ICh2KXtpZih0eXBlb2YodikgIT09IFwibnVtYmVyXCIpIHJldHVybjsgdGhpc1swXSA9IHZ9XHJcblxyXG5cdGdldCB5ICgpeyByZXR1cm4gdGhpc1sxXX1cclxuXHRzZXQgeSAodil7aWYodHlwZW9mKHYpICE9PSBcIm51bWJlclwiKSByZXR1cm47IHRoaXNbMV0gPSB2fVxyXG59XHJcblxyXG5leHBvcnQge1BvaW50MkR9IiwiaW1wb3J0IHtcclxuICAgIFBvaW50MkRcclxufSBmcm9tIFwiLi9wb2ludDJEXCJcclxuXHJcbmZ1bmN0aW9uIGN1cnZlUG9pbnQoY3VydmUsIHQpIHtcclxuICAgIHZhciBwb2ludCA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICBwb2ludC54ID0gcG9zT25DdXJ2ZSh0LCBjdXJ2ZVswXSwgY3VydmVbMl0sIGN1cnZlWzRdKTtcclxuICAgIHBvaW50LnkgPSBwb3NPbkN1cnZlKHQsIGN1cnZlWzFdLCBjdXJ2ZVszXSwgY3VydmVbNV0pO1xyXG4gICAgcmV0dXJuIHBvaW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3NPbkN1cnZlKHQsIHAxLCBwMiwgcDMpIHtcclxuICAgIHZhciB0aSA9IDEgLSB0O1xyXG4gICAgcmV0dXJuIHRpICogdGkgKiBwMSArIDIgKiB0aSAqIHQgKiBwMiArIHQgKiB0ICogcDM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0Q3VydmUoYnAsIHQpIHtcclxuICAgIHZhciBsZWZ0ID0gW107XHJcbiAgICB2YXIgcmlnaHQgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3Q3VydmUoYnAsIHQpIHtcclxuICAgICAgICBpZiAoYnAubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgbGVmdC5wdXNoKGJwWzBdLCBicFsxXSk7XHJcbiAgICAgICAgICAgIHJpZ2h0LnB1c2goYnBbMF0sIGJwWzFdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbmV3X2JwID0gW10gLy9icC5zbGljZSgwLC0yKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBicC5sZW5ndGggLSAyOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0LnB1c2goYnBbaV0sIGJwW2kgKyAxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBicC5sZW5ndGggLSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQucHVzaChicFtpICsgMl0sIGJwW2kgKyAzXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdfYnAucHVzaCgoMSAtIHQpICogYnBbaV0gKyB0ICogYnBbaSArIDJdKTtcclxuICAgICAgICAgICAgICAgIG5ld19icC5wdXNoKCgxIC0gdCkgKiBicFtpICsgMV0gKyB0ICogYnBbaSArIDNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkcmF3Q3VydmUobmV3X2JwLCB0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0N1cnZlKGJwLCB0KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHg6IG5ldyBRQmV6aWVyKHJpZ2h0KSxcclxuICAgICAgICB5OiBuZXcgUUJlemllcihsZWZ0KVxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3VydmVJbnRlcnNlY3Rpb25zKHAxLCBwMiwgcDMpIHtcclxuICAgIHZhciBpbnRlcnNlY3Rpb25zID0ge1xyXG4gICAgICAgIGE6IEluZmluaXR5LFxyXG4gICAgICAgIGI6IEluZmluaXR5XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBhID0gcDEgLSAyICogcDIgKyBwMztcclxuXHJcbiAgICB2YXIgYiA9IDIgKiAocDIgLSBwMSk7XHJcblxyXG4gICAgdmFyIGMgPSBwMTtcclxuXHJcbiAgICBpZiAoYiA9PSAwKSB7fSBlbHNlIGlmIChNYXRoLmFicyhhKSA8IDAuMDAwMDAwMDAwMDUpIHtcclxuICAgICAgICBpbnRlcnNlY3Rpb25zLmEgPSAoLWMgLyBiKTsgLy9jIC8gYjtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGludGVyc2VjdGlvbnMuYSA9ICgoLWIgLSBNYXRoLnNxcnQoKGIgKiBiKSAtIDQgKiBhICogYykpIC8gKDIgKiBhKSk7XHJcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5iID0gKCgtYiArIE1hdGguc3FydCgoYiAqIGIpIC0gNCAqIGEgKiBjKSkgLyAoMiAqIGEpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zXHJcbn1cclxuXHJcbmNsYXNzIFFCZXppZXIge1xyXG4gICAgY29uc3RydWN0b3IoeDEsIHkxLCB4MiwgeTIsIHgzLCB5Mykge1xyXG4gICAgICAgIHRoaXMueDEgPSAwO1xyXG4gICAgICAgIHRoaXMueDIgPSAwO1xyXG4gICAgICAgIHRoaXMueDMgPSAwO1xyXG4gICAgICAgIHRoaXMueTEgPSAwO1xyXG4gICAgICAgIHRoaXMueTIgPSAwO1xyXG4gICAgICAgIHRoaXMueTMgPSAwO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKHgxKSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMueDEgPSB4MTtcclxuICAgICAgICAgICAgdGhpcy54MiA9IHgyO1xyXG4gICAgICAgICAgICB0aGlzLngzID0geDM7XHJcbiAgICAgICAgICAgIHRoaXMueTEgPSB5MTtcclxuICAgICAgICAgICAgdGhpcy55MiA9IHkyO1xyXG4gICAgICAgICAgICB0aGlzLnkzID0geTM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4MSBpbnN0YW5jZW9mIFFCZXppZXIpIHtcclxuICAgICAgICAgICAgdGhpcy54MSA9IHgxLngxO1xyXG4gICAgICAgICAgICB0aGlzLngyID0geDEueDI7XHJcbiAgICAgICAgICAgIHRoaXMueDMgPSB4MS54MztcclxuICAgICAgICAgICAgdGhpcy55MSA9IHgxLnkxO1xyXG4gICAgICAgICAgICB0aGlzLnkyID0geDEueTI7XHJcbiAgICAgICAgICAgIHRoaXMueTMgPSB4MS55MztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHgxIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgdGhpcy54MSA9IHgxWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkxID0geDFbMV07XHJcbiAgICAgICAgICAgIHRoaXMueDIgPSB4MVsyXTtcclxuICAgICAgICAgICAgdGhpcy55MiA9IHgxWzNdO1xyXG4gICAgICAgICAgICB0aGlzLngzID0geDFbNF07XHJcbiAgICAgICAgICAgIHRoaXMueTMgPSB4MVs1XTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUUJlemllcihcclxuICAgICAgICAgICAgdGhpcy54MyxcclxuICAgICAgICAgICAgdGhpcy55MyxcclxuICAgICAgICAgICAgdGhpcy54MixcclxuICAgICAgICAgICAgdGhpcy55MixcclxuICAgICAgICAgICAgdGhpcy54MSxcclxuICAgICAgICAgICAgdGhpcy55MVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBwb2ludCh0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKFxyXG4gICAgICAgICAgICBwb3NPbkN1cnZlKHQsIHRoaXMueDEsIHRoaXMueDIsIHRoaXMueDMpLFxyXG4gICAgICAgICAgICBwb3NPbkN1cnZlKHQsIHRoaXMueTEsIHRoaXMueTIsIHRoaXMueTMpKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0YW5nZW50KHQpIHtcclxuICAgICAgICB2YXIgdGFuID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHB4MSA9IHRoaXMueDIgLSB0aGlzLngxO1xyXG4gICAgICAgIHZhciBweTEgPSB0aGlzLnkyIC0gdGhpcy55MTtcclxuXHJcbiAgICAgICAgdmFyIHB4MiA9IHRoaXMueDMgLSB0aGlzLngyO1xyXG4gICAgICAgIHZhciBweTIgPSB0aGlzLnkzIC0gdGhpcy55MjtcclxuXHJcbiAgICAgICAgdGFuLnggPSAoMSAtIHQpICogcHgxICsgdCAqIHB4MjtcclxuICAgICAgICB0YW4ueSA9ICgxIC0gdCkgKiBweTEgKyB0ICogcHkyO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFuO1xyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngxLCB0aGlzLnkxLCB0aGlzLngyLCB0aGlzLnkyLCB0aGlzLngzLCB0aGlzLnkzXTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdCh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHNwbGl0Q3VydmUodGhpcy50b0FycmF5KCksIHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJvb3RzWCAoKXtcclxuICAgIFx0cmV0dXJuIHRoaXMucm9vdHMoXHJcbiAgICBcdFx0dGhpcy54MSwgXHJcbiAgICBcdFx0dGhpcy54MixcclxuICAgIFx0XHR0aGlzLngzXHJcbiAgICBcdFx0KVxyXG4gICAgXHRcclxuICAgIH1cclxuXHJcbiAgICByb290cyhwMSwgcDIsIHAzKSB7XHJcbiAgICAgICAgdmFyIGN1cnZlID0gdGhpcy50b0FycmF5KCk7XHJcblxyXG4gICAgICAgIHZhciBjID0gcDEgLSAoMipwMikgKyBwMztcclxuICAgICAgICB2YXIgYiA9IDIqKHAyIC0gcDEpO1xyXG4gICAgICAgIHZhciBhID0gcDE7XHJcbiAgICAgICAgdmFyIGEyID0gYSoyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGMgLFwiIGNcIilcclxuICAgICAgICB2YXIgc3FydCA9IE1hdGguc3FydChiKmIgLSAoYSAqIDQgKmMpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzcXJ0LCBiLCBhMiwgcDMpXHJcbiAgICAgICAgdmFyIHQxID0gKC1iICsgc3FydCkgLyBhMjtcclxuICAgICAgICB2YXIgdDIgPSAoLWIgLSBzcXJ0KSAvIGEyO1xyXG5cclxuICAgICAgICByZXR1cm4gWyB0MSAsIHQyIF07XHJcbiAgICB9IFxyXG5cclxuICAgIHJvb3RzYSgpIHtcclxuICAgICAgICB2YXIgY3VydmUgPSB0aGlzLnRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdmFyIHAxID0gY3VydmVbMV07XHJcbiAgICAgICAgdmFyIHAyID0gY3VydmVbM107XHJcbiAgICAgICAgdmFyIHAzID0gY3VydmVbNV07XHJcbiAgICAgICAgdmFyIHgxID0gY3VydmVbMF07XHJcbiAgICAgICAgdmFyIHgyID0gY3VydmVbMl07XHJcbiAgICAgICAgdmFyIHgzID0gY3VydmVbNF07XHJcblxyXG4gICAgICAgIHZhciBweTFkID0gMiAqIChwMiAtIHAxKTtcclxuICAgICAgICB2YXIgcHkyZCA9IDIgKiAocDMgLSBwMik7XHJcbiAgICAgICAgdmFyIGFkMSA9IC1weTFkICsgcHkyZDtcclxuICAgICAgICB2YXIgYmQxID0gcHkxZDtcclxuXHJcbiAgICAgICAgdmFyIHB4MWQgPSAyICogKHgyIC0geDEpO1xyXG4gICAgICAgIHZhciBweDJkID0gMiAqICh4MyAtIHgyKTtcclxuICAgICAgICB2YXIgYWQyID0gLXB4MWQgKyBweDJkO1xyXG4gICAgICAgIHZhciBiZDIgPSBweDFkO1xyXG5cclxuICAgICAgICB2YXIgdDEgPSAtYmQxIC8gYWQxO1xyXG4gICAgICAgIHZhciB0MiA9IC1iZDIgLyBhZDI7XHJcblxyXG4gICAgICAgIHJldHVybiBbIHQxICwgdDIgXTtcclxuICAgIH1cclxuXHJcbiAgICBib3VuZGluZ0JveCgpIHtcclxuICAgICAgICB2YXIgeDEgPSBjdXJ2ZVswXTtcclxuICAgICAgICB2YXIgeTEgPSBjdXJ2ZVsxXTtcclxuICAgICAgICB2YXIgeDIgPSBjdXJ2ZVsyXTtcclxuICAgICAgICB2YXIgeTIgPSBjdXJ2ZVszXTtcclxuICAgICAgICB2YXIgeDMgPSBjdXJ2ZVs0XTtcclxuICAgICAgICB2YXIgeTMgPSBjdXJ2ZVs1XTtcclxuICAgICAgICB2YXIgcm9vdHMgPSBnZXRSb290c0NsYW1wZWQoY3VydmUpO1xyXG4gICAgICAgIHZhciBtaW5feCA9IE1hdGgubWluKHgxLCB4MiwgeDMsIHJvb3RzLnlbMF0gfHwgSW5maW5pdHksIHJvb3RzLnhbMF0gfHwgSW5maW5pdHkpO1xyXG4gICAgICAgIHZhciBtaW5feSA9IE1hdGgubWluKHkxLCB5MiwgeTMsIHJvb3RzLnlbMV0gfHwgSW5maW5pdHksIHJvb3RzLnhbMV0gfHwgSW5maW5pdHkpO1xyXG4gICAgICAgIHZhciBtYXhfeCA9IE1hdGgubWF4KHgxLCB4MiwgeDMsIHJvb3RzLnlbMF0gfHwgLUluZmluaXR5LCByb290cy54WzBdIHx8IC1JbmZpbml0eSk7XHJcbiAgICAgICAgdmFyIG1heF95ID0gTWF0aC5tYXgoeTEsIHkyLCB5Mywgcm9vdHMueVsxXSB8fCAtSW5maW5pdHksIHJvb3RzLnhbMV0gfHwgLUluZmluaXR5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWluOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBtaW5feCxcclxuICAgICAgICAgICAgICAgIHk6IG1pbl95XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1heDoge1xyXG4gICAgICAgICAgICAgICAgeDogbWF4X3gsXHJcbiAgICAgICAgICAgICAgICB5OiBtYXhfeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGUoYW5nbGUsIG9mZnNldCkge1xyXG4gICAgICAgIGFuZ2xlID0gKGFuZ2xlIC8gMTgwKSAqIE1hdGguUEk7XHJcblxyXG4gICAgICAgIHZhciBuZXdfY3VydmUgPSB0aGlzLnRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpICs9IDIpIHtcclxuICAgICAgICAgICAgdmFyIHggPSBjdXJ2ZVtpXSAtIG9mZnNldC54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IGN1cnZlW2kgKyAxXSAtIG9mZnNldC55O1xyXG4gICAgICAgICAgICBuZXdfY3VydmVbaV0gPSAoKHggKiBNYXRoLmNvcyhhbmdsZSkgLSB5ICogTWF0aC5zaW4oYW5nbGUpKSkgKyBvZmZzZXQueDtcclxuICAgICAgICAgICAgbmV3X2N1cnZlW2kgKyAxXSA9ICgoeCAqIE1hdGguc2luKGFuZ2xlKSArIHkgKiBNYXRoLmNvcyhhbmdsZSkpKSArIG9mZnNldC55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBRQmV6aWVyKG5ld19jdXJ2ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJzZWN0cygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBjdXJ2ZUludGVyc2VjdGlvbnModGhpcy54MSwgdGhpcy54MiwgdGhpcy54MyksXHJcbiAgICAgICAgICAgIHk6IGN1cnZlSW50ZXJzZWN0aW9ucyh0aGlzLnkxLCB0aGlzLnkyLCB0aGlzLnkzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGQoeCwgeSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoeCkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFFCZXppZXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLngxICsgeCxcclxuICAgICAgICAgICAgICAgIHRoaXMueTEgKyB5LFxyXG4gICAgICAgICAgICAgICAgdGhpcy54MiArIHgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkyICsgeSxcclxuICAgICAgICAgICAgICAgIHRoaXMueDMgKyB4LFxyXG4gICAgICAgICAgICAgICAgdGhpcy55MyArIHksXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBRQmV6aWVyXHJcbn0iLCJjb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xyXG5jb25zdCBjb3MgPSBNYXRoLmNvcztcclxuY29uc3QgYWNvcyA9IE1hdGguYWNvcztcclxuY29uc3QgUEkgPSBNYXRoLlBJO1xyXG5jb25zdCBzaW4gPSBNYXRoLnNpbjtcclxuXHJcbmV4cG9ydHtcclxuXHRzcXJ0LFxyXG5cdGNvcyxcclxuXHRzaW4sXHJcblx0YWNvcyxcclxuXHRhY29zMixcclxuXHRQSVxyXG59IiwiaW1wb3J0IHtQb2ludDJEfSBmcm9tIFwiLi9wb2ludDJEXCJcclxuaW1wb3J0IHtzcXJ0LGNvcyxhY29zLFBJfSBmcm9tIFwiLi9jb25zdHNcIlxyXG5cclxuLy8gQSBoZWxwZXIgZnVuY3Rpb24gdG8gZmlsdGVyIGZvciB2YWx1ZXMgaW4gdGhlIFswLDFdIGludGVydmFsOlxyXG5mdW5jdGlvbiBhY2NlcHQodCkge1xyXG4gIHJldHVybiAwPD10ICYmIHQgPD0xO1xyXG59XHJcblxyXG4vLyBBIHJlYWwtY3ViZXJvb3RzLW9ubHkgZnVuY3Rpb246XHJcbmZ1bmN0aW9uIGN1YmVyb290KHYpIHtcclxuICBpZih2PDApIHJldHVybiAtTWF0aC5wb3coLXYsMS8zKTtcclxuICByZXR1cm4gTWF0aC5wb3codiwxLzMpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHBvaW50KHQsIHAxLCBwMiwgcDMsIHA0KSB7XHJcblx0dmFyIHRpID0gMSAtIHQ7XHJcblx0dmFyIHRpMiA9IHRpICogdGk7XHJcblx0dmFyIHQyID0gdCAqIHQ7XHJcblxyXG5cdHJldHVybiB0aSAqIHRpMiAqIHAxICsgMyAqIHRpMiAqIHQgKiBwMiArIHQyICogMyAqIHRpICogcDMgKyB0MiAqIHQgKiBwNDtcclxufVxyXG5cclxuXHJcbmNsYXNzIENCZXppZXIgZXh0ZW5kcyBGbG9hdDY0QXJyYXl7XHJcblx0Y29uc3RydWN0b3IoeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0KSB7XHJcblx0XHRzdXBlcig4KVxyXG5cclxuXHRcdC8vTWFwIFAxIGFuZCBQMiB0byB7MCwwLDEsMX0gaWYgb25seSBmb3VyIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQ7IGZvciB1c2Ugd2l0aCBhbmltYXRpb25zXHJcblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID09IDQpe1xyXG5cdFx0XHR0aGlzWzBdID0gMDtcclxuXHRcdFx0dGhpc1sxXSA9IDA7XHJcblx0XHRcdHRoaXNbMl0gPSB4MTtcclxuXHRcdFx0dGhpc1szXSA9IHkxO1xyXG5cdFx0XHR0aGlzWzRdID0geDI7XHJcblx0XHRcdHRoaXNbNV0gPSB5MjtcclxuXHRcdFx0dGhpc1s2XSA9IDE7XHJcblx0XHRcdHRoaXNbN10gPSAxO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICh0eXBlb2YoeDEpID09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0dGhpc1swXSA9IHgxO1xyXG5cdFx0XHR0aGlzWzFdID0geTE7XHJcblx0XHRcdHRoaXNbMl0gPSB4MjtcclxuXHRcdFx0dGhpc1szXSA9IHkyO1xyXG5cdFx0XHR0aGlzWzRdID0geDM7XHJcblx0XHRcdHRoaXNbNV0gPSB5MztcclxuXHRcdFx0dGhpc1s2XSA9IHg0O1xyXG5cdFx0XHR0aGlzWzddID0geTQ7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoeDEgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHR0aGlzWzBdID0geDFbMF07XHJcblx0XHRcdHRoaXNbMV0gPSB4MVsxXTtcclxuXHRcdFx0dGhpc1syXSA9IHgxWzJdO1xyXG5cdFx0XHR0aGlzWzNdID0geDFbM107XHJcblx0XHRcdHRoaXNbNF0gPSB4MVs0XTtcclxuXHRcdFx0dGhpc1s1XSA9IHgxWzVdO1xyXG5cdFx0XHR0aGlzWzZdID0geDFbNl07XHJcblx0XHRcdHRoaXNbN10gPSB4MVs0XTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0IHgxICgpeyByZXR1cm4gdGhpc1swXX1cclxuXHRzZXQgeDEgKHYpe3RoaXNbMF0gPSB2fVxyXG5cdGdldCB4MiAoKXsgcmV0dXJuIHRoaXNbMl19XHJcblx0c2V0IHgyICh2KXt0aGlzWzJdID0gdn1cclxuXHRnZXQgeDMgKCl7IHJldHVybiB0aGlzWzRdfVxyXG5cdHNldCB4MyAodil7dGhpc1s0XSA9IHZ9XHJcblx0Z2V0IHg0ICgpeyByZXR1cm4gdGhpc1s2XX1cclxuXHRzZXQgeDQgKHYpe3RoaXNbNl0gPSB2fVxyXG5cdGdldCB5MSAoKXsgcmV0dXJuIHRoaXNbMV19XHJcblx0c2V0IHkxICh2KXt0aGlzWzFdID0gdn1cclxuXHRnZXQgeTIgKCl7IHJldHVybiB0aGlzWzNdfVxyXG5cdHNldCB5MiAodil7dGhpc1szXSA9IHZ9XHJcblx0Z2V0IHkzICgpeyByZXR1cm4gdGhpc1s1XX1cclxuXHRzZXQgeTMgKHYpe3RoaXNbNV0gPSB2fVxyXG5cdGdldCB5NCAoKXsgcmV0dXJuIHRoaXNbN119XHJcblx0c2V0IHk0ICh2KXt0aGlzWzddID0gdn1cclxuXHJcblx0YWRkKHgseSA9IDApe1xyXG5cdFx0cmV0dXJuIG5ldyBDQ3VydmUoXHJcblx0XHRcdHRoaXNbMF0gKyB4LFxyXG5cdFx0XHR0aGlzWzFdICsgeSxcclxuXHRcdFx0dGhpc1syXSArIHgsXHJcblx0XHRcdHRoaXNbM10gKyB5LFxyXG5cdFx0XHR0aGlzWzRdICsgeCxcclxuXHRcdFx0dGhpc1s1XSArIHksXHJcblx0XHRcdHRoaXNbNl0gKyB4LFxyXG5cdFx0XHR0aGlzWzddICsgeVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0dmFsWSh0KXtcclxuXHRcdHJldHVybiBwb2ludCh0LCB0aGlzWzFdLCB0aGlzWzNdLCB0aGlzWzVdLCB0aGlzWzddKTtcclxuXHR9XHJcblxyXG5cdHZhbFgodCl7XHJcblx0XHRyZXR1cm4gcG9pbnQodCwgdGhpc1swXSwgdGhpc1syXSwgdGhpc1s0XSwgdGhpc1s2XSk7XHJcblx0fVxyXG5cclxuXHRwb2ludCh0KSB7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50MkQoXHJcblx0XHRcdHBvaW50KHQsIHRoaXNbMF0sIHRoaXNbMl0sIHRoaXNbNF0sIHRoaXNbNl0pLFxyXG5cdFx0XHRwb2ludCh0LCB0aGlzWzFdLCB0aGlzWzNdLCB0aGlzWzVdLCB0aGlzWzddKVxyXG5cdFx0KVxyXG5cdH1cclxuXHRcclxuXHQvKiogXHJcblx0XHRBcXVpcmVkIGZyb20gOiBodHRwczovL3BvbWF4LmdpdGh1Yi5pby9iZXppZXJpbmZvL1xyXG5cdFx0QXV0aG9yOiAgTWlrZSBcIlBvbWF4XCIgS2FtZXJtYW5zXHJcblx0XHRHaXRIdWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9Qb21heC9cclxuXHQqL1xyXG5cclxuXHRyb290cyhwMSxwMixwMyxwNCkge1xyXG5cdFx0dmFyIGQgPSAoLXAxICsgMyAqIHAyIC0gMyAqIHAzICsgcDQpLFxyXG5cdFx0XHRhID0gKDMgKiBwMSAtIDYgKiBwMiArIDMgKiBwMykgLyBkLFxyXG5cdFx0XHRiID0gKC0zICogcDEgKyAzICogcDIpIC8gZCxcclxuXHRcdFx0YyA9IHAxIC8gZDtcclxuXHJcblx0XHR2YXIgcCA9ICgzICogYiAtIGEgKiBhKSAvIDMsXHJcblx0XHRcdHAzID0gcCAvIDMsXHJcblx0XHRcdHEgPSAoMiAqIGEgKiBhICogYSAtIDkgKiBhICogYiArIDI3ICogYykgLyAyNyxcclxuXHRcdFx0cTIgPSBxIC8gMixcclxuXHRcdFx0ZGlzY3JpbWluYW50ID0gcTIgKiBxMiArIHAzICogcDMgKiBwMztcclxuXHJcblx0XHQvLyBhbmQgc29tZSB2YXJpYWJsZXMgd2UncmUgZ29pbmcgdG8gdXNlIGxhdGVyIG9uOlxyXG5cdFx0dmFyIHUxLCB2MSwgcm9vdDEsIHJvb3QyLCByb290MztcclxuXHJcblx0XHQvLyB0aHJlZSBwb3NzaWJsZSByZWFsIHJvb3RzOlxyXG5cdFx0aWYgKGRpc2NyaW1pbmFudCA8IDApIHtcclxuXHRcdFx0dmFyIG1wMyA9IC1wIC8gMyxcclxuXHRcdFx0XHRtcDMzID0gbXAzICogbXAzICogbXAzLFxyXG5cdFx0XHRcdHIgPSBzcXJ0KG1wMzMpLFxyXG5cdFx0XHRcdHQgPSAtcSAvICgyICogciksXHJcblx0XHRcdFx0Y29zcGhpID0gdCA8IC0xID8gLTEgOiB0ID4gMSA/IDEgOiB0LFxyXG5cdFx0XHRcdHBoaSA9IGFjb3MoY29zcGhpKSxcclxuXHRcdFx0XHRjcnRyID0gY3ViZXJvb3QociksXHJcblx0XHRcdFx0dDEgPSAyICogY3J0cjtcclxuXHRcdFx0cm9vdDEgPSB0MSAqIGNvcyhwaGkgLyAzKSAtIGEgLyAzO1xyXG5cdFx0XHRyb290MiA9IHQxICogY29zKChwaGkgKyAyICogUEkpIC8gMykgLSBhIC8gMztcclxuXHRcdFx0cm9vdDMgPSB0MSAqIGNvcygocGhpICsgNCAqIFBJKSAvIDMpIC0gYSAvIDM7XHJcblx0XHRcdHJldHVybiBbcm9vdDMsIHJvb3QxLCByb290Ml1cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0aHJlZSByZWFsIHJvb3RzLCBidXQgdHdvIG9mIHRoZW0gYXJlIGVxdWFsOlxyXG5cdFx0aWYgKGRpc2NyaW1pbmFudCA9PT0gMCkge1xyXG5cdFx0XHR1MSA9IHEyIDwgMCA/IGN1YmVyb290KC1xMikgOiAtY3ViZXJvb3QocTIpO1xyXG5cdFx0XHRyb290MSA9IDIgKiB1MSAtIGEgLyAzO1xyXG5cdFx0XHRyb290MiA9IC11MSAtIGEgLyAzO1xyXG5cdFx0XHRyZXR1cm4gW3Jvb3QyLCByb290MV1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvbmUgcmVhbCByb290LCB0d28gY29tcGxleCByb290c1xyXG5cdFx0dmFyIHNkID0gc3FydChkaXNjcmltaW5hbnQpO1xyXG5cdFx0dTEgPSBjdWJlcm9vdChzZCAtIHEyKTtcclxuXHRcdHYxID0gY3ViZXJvb3Qoc2QgKyBxMik7XHJcblx0XHRyb290MSA9IHUxIC0gdjEgLSBhIC8gMztcclxuXHRcdHJldHVybiBbcm9vdDFdXHJcblx0fVxyXG5cclxuXHRyb290c1koKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yb290cyh0aGlzWzFdLHRoaXNbM10sdGhpc1s1XSx0aGlzWzddKVxyXG5cdH1cclxuXHJcblx0cm9vdHNYKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucm9vdHModGhpc1swXSx0aGlzWzJdLHRoaXNbNF0sdGhpc1s2XSlcclxuXHR9XHJcblx0XHJcblx0Z2V0WWF0WCh4KXtcclxuXHRcdHZhciB4MSA9IHRoaXNbMF0gLSB4LCB4MiA9IHRoaXNbMl0gLSB4LCB4MyA9IHRoaXNbNF0gLSB4LCB4NCA9IHRoaXNbNl0gLSB4LFxyXG5cdFx0XHR4Ml8zID0geDIgKiAzLCB4MV8zID0geDEgKjMsIHgzXzMgPSB4MyAqIDMsXHJcblx0XHRcdGQgPSAoLXgxICsgeDJfMyAtIHgzXzMgKyB4NCksIGRpID0gMS9kLCBpMyA9IDEvMyxcclxuXHRcdFx0YSA9ICh4MV8zIC0gNiAqIHgyICsgeDNfMykgKiBkaSxcclxuXHRcdFx0YiA9ICgteDFfMyArIHgyXzMpICogZGksXHJcblx0XHRcdGMgPSB4MSAqIGRpLFxyXG5cdFx0XHRwID0gKDMgKiBiIC0gYSAqIGEpICogaTMsXHJcblx0XHRcdHAzID0gcCAqIGkzLFxyXG5cdFx0XHRxID0gKDIgKiBhICogYSAqIGEgLSA5ICogYSAqIGIgKyAyNyAqIGMpICogKDEvMjcpLFxyXG5cdFx0XHRxMiA9IHEgKiAwLjUsXHJcblx0XHRcdGRpc2NyaW1pbmFudCA9IHEyICogcTIgKyBwMyAqIHAzICogcDM7XHJcblxyXG5cdFx0Ly8gYW5kIHNvbWUgdmFyaWFibGVzIHdlJ3JlIGdvaW5nIHRvIHVzZSBsYXRlciBvbjpcclxuXHRcdHZhciB1MSwgdjEsIHJvb3Q7XHJcblxyXG5cdFx0Ly9UaHJlZSByZWFsIHJvb3RzIGNhbiBuZXZlciBoYXBwZW4gaWYgcDEoMCwwKSBhbmQgcDQoMSwxKTtcclxuXHJcblx0XHQvLyB0aHJlZSByZWFsIHJvb3RzLCBidXQgdHdvIG9mIHRoZW0gYXJlIGVxdWFsOlxyXG5cdFx0aWYgKGRpc2NyaW1pbmFudCA8IDApIHtcclxuXHRcdFx0dmFyIG1wMyA9IC1wIC8gMyxcclxuXHRcdFx0XHRtcDMzID0gbXAzICogbXAzICogbXAzLFxyXG5cdFx0XHRcdHIgPSBzcXJ0KG1wMzMpLFxyXG5cdFx0XHRcdHQgPSAtcSAvICgyICogciksXHJcblx0XHRcdFx0Y29zcGhpID0gdCA8IC0xID8gLTEgOiB0ID4gMSA/IDEgOiB0LFxyXG5cdFx0XHRcdHBoaSA9IGFjb3MoY29zcGhpKSxcclxuXHRcdFx0XHRjcnRyID0gY3ViZXJvb3QociksXHJcblx0XHRcdFx0dDEgPSAyICogY3J0cjtcclxuXHRcdFx0cm9vdCA9IHQxICogY29zKChwaGkgKyA0ICogUEkpIC8gMykgLSBhIC8gMztcclxuXHRcdH1lbHNlIGlmIChkaXNjcmltaW5hbnQgPT09IDApIHtcclxuXHRcdFx0dTEgPSBxMiA8IDAgPyBjdWJlcm9vdCgtcTIpIDogLWN1YmVyb290KHEyKTtcclxuXHRcdFx0cm9vdCA9IC11MSAtIGEgKiBpMztcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR2YXIgc2QgPSBzcXJ0KGRpc2NyaW1pbmFudCk7XHJcblx0XHRcdC8vIG9uZSByZWFsIHJvb3QsIHR3byBjb21wbGV4IHJvb3RzXHJcblx0XHRcdHUxID0gY3ViZXJvb3Qoc2QgLSBxMik7XHJcblx0XHRcdHYxID0gY3ViZXJvb3Qoc2QgKyBxMik7XHJcblx0XHRcdHJvb3QgPSB1MSAtIHYxIC0gYSAqIGkzO1x0XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHBvaW50KHJvb3QsIHRoaXNbMV0sIHRoaXNbM10sIHRoaXNbNV0sIHRoaXNbN10pO1xyXG5cdH1cclxuXHQvKipcclxuXHRcdEdpdmVuIGEgQ2FudmFzIDJEIGNvbnRleHQgb2JqZWN0IGFuZCBzY2FsZSB2YWx1ZSwgc3Ryb2tlcyBhIGN1YmljIGJlemllciBjdXJ2ZS5cclxuXHQqL1xyXG5cdGRyYXcoY3R4LCBzID0gMSl7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKHRoaXNbMF0qcywgdGhpc1sxXSpzKVxyXG5cdFx0Y3R4LmJlemllckN1cnZlVG8oXHJcblx0XHRcdHRoaXNbMl0qcywgdGhpc1szXSpzLFxyXG5cdFx0XHR0aGlzWzRdKnMsIHRoaXNbNV0qcyxcclxuXHRcdFx0dGhpc1s2XSpzLCB0aGlzWzddKnNcclxuXHRcdFx0KVxyXG5cdFx0Y3R4LnN0cm9rZSgpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge0NCZXppZXJ9IiwiaW1wb3J0IHtMZXhlcn0gZnJvbSBcIi4uL3N0cmluZ19wYXJzaW5nL2xleGVyXCJcclxuaW1wb3J0IHtUb2tlbml6ZXJ9IGZyb20gXCIuLi9zdHJpbmdfcGFyc2luZy90b2tlbml6ZXJcIlxyXG5cclxuLyoqXHJcblVSTCBRdWVyeSBTeW50YXhcclxuXHJcbnJvb3QgPT4gW3Jvb3RfY2xhc3NdIFsmIFtjbGFzc2VzXV1cclxuICAgICA9PiBbY2xhc3Nlc11cclxuXHJcbnJvb3RfY2xhc3MgPSBrZXlfbGlzdFxyXG5cclxuY2xhc3NfbGlzdCBbY2xhc3MgWyYgY2xhc3NfbGlzdF1dXHJcblxyXG5jbGFzcyA9PiBuYW1lICYga2V5X2xpc3RcclxuXHJcbmtleV9saXN0ID0+IFtrZXlfdmFsIFsmIGtleV9saXN0XV1cclxuXHJcbmtleV92YWwgPT4gbmFtZSA9IHZhbFxyXG5cclxubmFtZSA9PiBBTFBIQU5VTUVSSUNfSURcclxuXHJcbnZhbCA9PiBOVU1CRVJcclxuICAgID0+IEFMUEhBTlVNRVJJQ19JRFxyXG4qL1xyXG5mdW5jdGlvbiBRdWVyeVN0cmluZ1RvUXVlcnlNYXAocXVlcnkpe1xyXG5cclxuICBsZXQgbWFwcGVkX29iamVjdCA9IG5ldyBNYXA7XHJcblxyXG4gIGlmKCFxdWVyeSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICBjb25zb2xlLndhcm4oXCJxdWVyeSBhcmd1bWVudCBwcm92aWRlZCBpcyBub3QgYSBzdHJpbmchXCIpXHJcbiAgICByZXR1cm4gbWFwcGVkX29iamVjdDtcclxuICB9XHJcblxyXG4gIGlmKHF1ZXJ5WzBdID09IFwiP1wiKSBxdWVyeSA9IHF1ZXJ5LnNsaWNlKDEpO1xyXG5cclxuICBsZXQgbGV4ID0gbmV3IExleGVyKG5ldyBUb2tlbml6ZXIocXVlcnkpKTtcclxuXHJcbiAgZnVuY3Rpb24ga2V5X3ZhbF9saXN0KGxleCwgbWFwKXtcclxuICAgIGxldCB0b2tlbjtcclxuICAgIHdoaWxlKCh0b2tlbiA9IGxleC50b2tlbikgJiYgdG9rZW4udGV4dCAhPT0gXCImXCIpe1xyXG4gICAgICBpZihsZXgucGVlaygpLnRleHQgPT0gXCI9XCIpe1xyXG4gICAgICAgIGxldCBrZXkgPSB0b2tlbi50ZXh0O1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBsZXQgdmFsID0gbGV4LnRva2VuO1xyXG4gICAgICAgIG1hcC5zZXQoa2V5LCAodmFsLnR5cGUgPT0gXCJudW1iZXJcIik/cGFyc2VGbG9hdCh2YWwudGV4dCk6dmFsLnRleHQpO1xyXG4gICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGFzc18obGV4LCBtYXApe1xyXG5cclxuICAgIGxldCB0b2tlbjtcclxuXHJcbiAgICBpZigodG9rZW4gPSBsZXgucGVlaygpKSAmJiB0b2tlbi50ZXh0ID09IFwiJlwiKXtcclxuXHJcbiAgICAgIHRva2VuID0gbGV4LnRva2VuO1xyXG5cclxuICAgICAgbGV4Lm5leHQoKTtsZXgubmV4dCgpO1xyXG4gICAgICBtYXAuc2V0KHRva2VuLnRleHQsIG5ldyBNYXAoKSk7XHJcbiAgICAgIGtleV92YWxfbGlzdChsZXgsbWFwLmdldCh0b2tlbi50ZXh0KSk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByb290KGxleCxtYXApe1xyXG4gICAgICAgbWFwLnNldChudWxsLCBuZXcgTWFwKCkpO1xyXG5cclxuICAgICAgaWYobGV4LnBlZWsoKS50ZXh0ID09IFwiJlwiKXtcclxuICAgICAgICAgIGNsYXNzXyhsZXgsIG1hcClcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBrZXlfdmFsX2xpc3QobGV4LCBtYXAuZ2V0KG51bGwpKTtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgd2hpbGUobGV4LnRva2VuICYmIGxleC50b2tlbi50ZXh0ID09XCImXCIpe1xyXG4gICAgICBsZXgubmV4dCgpO1xyXG4gICAgICBjbGFzc18obGV4LCBtYXApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb290KGxleCwgbWFwcGVkX29iamVjdCk7XHJcbiAgcmV0dXJuIG1hcHBlZF9vYmplY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFF1ZXJ5TWFwVG9RdWVyeVN0cmluZyhtYXApe1xyXG4gICAgbGV0IGNsYXNzXywgbnVsbF9jbGFzcyxzdHIgPVwiXCI7XHJcbiAgICBpZigobnVsbF9jbGFzcyA9IG1hcC5nZXQobnVsbCkpKXtcclxuICAgICAgICBpZihudWxsX2NsYXNzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBmb3IobGV0IFtrZXksdmFsXSBvZiBudWxsX2NsYXNzLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gYCYke2tleX09JHt2YWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IFtrZXksY2xhc3NfXSBvZiBtYXAuZW50cmllcygpKXtcclxuICAgICAgICAgICAgaWYoa2V5ID09IG51bGwpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBzdHIgKz0gYCYke2tleX1gXHJcbiAgICAgICAgICAgIGZvcihsZXQgW2tleSx2YWxdIG9mIGNsYXNzXy5lbnRyaWVzKCkpe1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IGAmJHtrZXl9PSR7dmFsfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuZnVuY3Rpb24gVHVybkRhdGFJbnRvUXVlcnkoZGF0YSkge1xyXG4gICAgdmFyIHN0ciA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdfc3RyID0gYCR7ZGF0YS5jb21wb25lbnR9JmA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld19zdHIgKz0gKGEgIT0gXCJjb21wb25lbnRcIikgPyBgJHthfT0ke2RhdGFbYV19XFwmYCA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RyICs9IG5ld19zdHIuc2xpY2UoMCwgLTEpICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcblxyXG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCAtMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFR1cm5RdWVyeUludG9EYXRhKHF1ZXJ5KSB7XHJcbiAgICB2YXIgb3V0ID0ge307XHJcblxyXG4gICAgbGV0IHQgPSBxdWVyeS5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgaWYgKHQubGVuZ3RoID4gMClcclxuICAgICAgICB0LmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgdmFyIHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKGEubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgYS5zcGxpdChcIiZcIikuZm9yRWFjaCgoYSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMSkgb3V0W2FdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBhLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0W2JbMF1dID0gYlsxXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHF1ZXJ5LnNwbGl0KFwiJlwiKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBiID0gYS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIG91dFtiWzBdXSA9IGJbMV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBUdXJuUXVlcnlJbnRvRGF0YSxcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG4gICAgUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nLFxyXG4gICAgUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwXHJcbn1cclxuIiwiLyoqXHJcblx0SmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBhIHRvdWNoIHNjcm9sbGluZyBpbnRlcmZhY2UgdXNpbmcgdG91Y2ggZXZlbnRzXHJcbiovXHJcbmNsYXNzIFRvdWNoU2Nyb2xsZXIge1xyXG4gICAgLyoqIFxyXG4gICAgICAgIENvbnN0cnVjdHMgYSB0b3VjaCBvYmplY3QgYXJvdW5kIGEgZ2l2ZW4gZG9tIGVsZW1lbnQuIEZ1bmN0aW9ucyBsaXN0ZW5lcnMgY2FuIGJlIGJvdW5kIHRvIHRoaXMgb2JqZWN0IHVzaW5nXHJcbiAgICAgICAgdGhpcyBhZGRFdmVudExpc3RlbmVyIG1ldGhvZC5cclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkcmFnID0gMC4wMiwgdG91Y2hpZCA9IDApIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9yaWdpbl94ID0gMDtcclxuICAgICAgICB0aGlzLm9yaWdpbl95ID0gMDtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSAwO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHlfeSA9IDA7XHJcbiAgICAgICAgdGhpcy5HTyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnID0gKGRyYWcgPiAwKSA/IGRyYWcgOiAwLjAyO1xyXG4gICAgICAgIHRoaXMuZWxlID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCF0b3VjaGlkIGluc3RhbmNlb2YgTnVtYmVyKVxyXG4gICAgICAgICAgICB0b3VjaGlkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVfb2xkID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGZyYW1lID0gKGR4LCBkeSwgc3RlcHMsIHJhdGlvID0gMSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGRyYWdfdmFsID0gdGhpcy5kcmFnO1xyXG5cclxuICAgICAgICAgICAgZHggLT0gZHggKiBkcmFnX3ZhbCAqIHN0ZXBzICogcmF0aW87XHJcbiAgICAgICAgICAgIGR5IC09IGR5ICogZHJhZ192YWwgKiBzdGVwcyAqIHJhdGlvO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRtID0gTWF0aC5tYXgoTWF0aC5hYnMoZHkpLCBNYXRoLmFicyhkeSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVuZCA9ICEoc3RlcHMgPiAwICYmIGRtID4gMC4xICYmIHRoaXMuR08pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmQpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUoZHgsIGR5LCAxKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVuZCA9IGVuZCAmJiBzdGVwcyAhPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbaV0oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5HTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9iID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSB0aGlzLm9yaWdpbl94IC0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eV95ID0gdGhpcy5vcmlnaW5feSAtIHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbl94ID0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcblxyXG4gICAgICAgICAgICBmcmFtZSh0aGlzLnZlbG9jaXR5X3gsIHRoaXMudmVsb2NpdHlfeSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2MgPSAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRpbWVfbmV3ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlmZiA9IHRpbWVfbmV3IC0gdGltZV9vbGQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3RlcHMgPSBNYXRoLm1pbihkaWZmIC8gOC42NjY2NjY2LCAxIC8gdGhpcy5kcmFnKTsgLy8gNjAgRlBTXHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGZyYW1lKHRoaXMudmVsb2NpdHlfeCwgdGhpcy52ZWxvY2l0eV95LCBzdGVwcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3ggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5X3kgPSAwO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ldmVudF9hID0gKGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLkdPKXtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZnVhbHQoKTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRpbWVfb2xkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkdPID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbdG91Y2hpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRvdWNoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5feSA9IHRvdWNoLmNsaWVudFk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luX3ggPSB0b3VjaC5jbGllbnRYO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5ldmVudF9iKTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLmV2ZW50X2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5ldmVudF9hKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5ldmVudF9hKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFkZEV2ZW50TGlzdGVuZXIoY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW2ldID09IGNhbGxiYWNrKSByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoY2FsbGJhY2spIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1tpXSA9PSBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgVG91Y2hTY3JvbGxlclxyXG59IiwiaW1wb3J0IHtMZXhlcn0gZnJvbSBcIi4vc3RyaW5nX3BhcnNpbmcvbGV4ZXJcIlxyXG5pbXBvcnQge1Rva2VuaXplcn0gZnJvbSBcIi4vc3RyaW5nX3BhcnNpbmcvdG9rZW5pemVyXCJcclxuXHJcbi8vVGltZVxyXG5pbXBvcnQge21vbnRoc30gZnJvbSBcIi4vZGF0ZV90aW1lL21vbnRoc1wiXHJcbmltcG9ydCB7ZG93fSBmcm9tIFwiLi9kYXRlX3RpbWUvZGF5c19vZl93ZWVrXCJcclxuaW1wb3J0IHtHZXREYXlTdGFydEFuZEVuZH0gZnJvbSBcIi4vZGF0ZV90aW1lL2RheV9zdGFydF9hbmRfZW5kX2Vwb2NoXCJcclxuaW1wb3J0IHtmbG9hdDI0dG8xMk1vZFRpbWV9IGZyb20gXCIuL2RhdGVfdGltZS90aW1lLmpzXCJcclxuXHJcbi8vTWF0aFxyXG5pbXBvcnQge1FCZXppZXJ9IGZyb20gXCIuL21hdGgvcXVhZHJhdGljX2JlemllclwiXHJcbmltcG9ydCB7Q0Jlemllcn0gZnJvbSBcIi4vbWF0aC9jdWJpY19iZXppZXJcIlxyXG5pbXBvcnQge1R1cm5RdWVyeUludG9EYXRhLCBUdXJuRGF0YUludG9RdWVyeX0gZnJvbSBcIi4vdXJsL3VybFwiXHJcbmltcG9ydCB7VG91Y2hTY3JvbGxlcn0gZnJvbSBcIi4vZXZlbnQvdG91Y2hfc2Nyb2xsZXJcIlxyXG5cclxuXHJcbi8qKioqKioqKioqKiBTdHJpbmcgUGFyc2luZyBCYXNpYyBGdW5jdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG5cdElmIGEgc3RyaW5nIG9iamVjdCBpcyBwYXNzZWQsIGNyZWF0ZXMgYSBsZXhlciB0aGF0IHRva2VuaXplIHRoZSBpbnB1dCBzdHJpbmcuIFxyXG4qL1xyXG5mdW5jdGlvbiBMZXgoc3RyaW5nKXtcclxuXHRpZih0eXBlb2Yoc3RyaW5nKSAhPT0gXCJzdHJpbmdcIil7XHJcblx0XHRjb25zb2xlLndhcm4oXCJDYW5ub3QgY3JlYXRlIGEgbGV4ZXIgb24gYSBub24tc3RyaW5nIG9iamVjdCFcIik7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBuZXcgTGV4ZXIobmV3IFRva2VuaXplcihzdHJpbmcpKTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuXHRMZXgsXHJcblx0TGV4ZXIsIFxyXG5cdFRva2VuaXplcixcclxuXHRtb250aHMsXHJcblx0ZG93LFxyXG5cdFFCZXppZXIsXHJcblx0Q0JlemllcixcclxuXHRUdXJuUXVlcnlJbnRvRGF0YSxcclxuXHRUdXJuRGF0YUludG9RdWVyeSxcclxuXHRHZXREYXlTdGFydEFuZEVuZCxcclxuXHRUb3VjaFNjcm9sbGVyLFxyXG5cdGZsb2F0MjR0bzEyTW9kVGltZVxyXG59O1xyXG5cclxuLyoqKioqKiBHbG9iYWwgT2JqZWN0IEV4dGVuZGVycyAqKioqKioqKioqKioqL1xyXG4vLypcclxuRWxlbWVudC5wcm90b3R5cGUuZ2V0V2luZG93VG9wID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiAodGhpcy5vZmZzZXRUb3AgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93VG9wKCkgOiAwKSk7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmdldFdpbmRvd0xlZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICh0aGlzLm9mZnNldExlZnQgKyAoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0V2luZG93TGVmdCgpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dUb3AgPSBmdW5jdGlvbihib29sID0gZmFsc2Upe1xyXG4gICAgcmV0dXJuICgoKGJvb2wgPyB0aGlzLm9mZnNldFRvcCA6IDApKSsoKHRoaXMucGFyZW50RWxlbWVudCkgPyB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRQYXJlbnRXaW5kb3dMZWZ0ID0gZnVuY3Rpb24oYm9vbCA9IGZhbHNlKXtcclxuICAgIHJldHVybiAoKChib29sID8gdGhpcy5vZmZzZXRMZWZ0IDogMCkpKygodGhpcy5wYXJlbnRFbGVtZW50KSA/IHRoaXMucGFyZW50RWxlbWVudC5nZXRXaW5kb3dMZWZ0KHRydWUpIDogMCkpO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5nZXRTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlX25hbWUpe1xyXG5cdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLG51bGwpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVfbmFtZSk7XHJcbn1cclxuLy8qLyIsImltcG9ydCB7IE51bWJlclNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vbnVtYmVyLmpzXCJcclxuXHJcbmltcG9ydCB7IExleCB9IGZyb20gXCIuLi8uLi9jb21tb24vY29tbW9uXCJcclxuXHJcbmxldCBzY2FwZV9kYXRlID0gbmV3IERhdGUoKTtcclxuc2NhcGVfZGF0ZS5zZXRIb3VycygwKTtcclxuc2NhcGVfZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XHJcbnNjYXBlX2RhdGUuc2V0U2Vjb25kcygwKTtcclxuc2NhcGVfZGF0ZS5zZXRUaW1lKDApO1xyXG5cclxuY2xhc3MgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yIGV4dGVuZHMgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3Ige1xyXG5cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4odmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xyXG5cclxuICAgICAgICBsZXQgbGV4ID0gTGV4KHZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuXHJcbiAgICAgICAgaWYgKHllYXIpIHtcclxuXHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgICAgICBzY2FwZV9kYXRlLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0VGltZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KSAtIDE7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGxldCBkYXkgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTtcclxuICAgICAgICAgICAgc2NhcGVfZGF0ZS5zZXREYXRlKGRheSk7XHJcbiAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TW9udGgobW9udGgpO1xyXG5cclxuICAgICAgICAgICAgbGV4Lm5leHQoKVxyXG5cclxuICAgICAgICAgICAgaWYgKGxleC50b2tlbikge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBob3VycyA9IHBhcnNlSW50KGxleC50b2tlbi50ZXh0KVxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKVxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKVxyXG4gICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBwYXJzZUludChsZXgudG9rZW4udGV4dClcclxuXHJcbiAgICAgICAgICAgICAgICBzY2FwZV9kYXRlLnNldEhvdXJzKGhvdXJzKTtcclxuICAgICAgICAgICAgICAgIHNjYXBlX2RhdGUuc2V0TWludXRlcyhtaW51dGVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNjYXBlX2RhdGUudmFsdWVPZigpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgIFxyXG4gICAgICovXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG5cclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuXHJcbiAgICAgICAgc3VwZXIudmVyaWZ5KHZhbHVlLCByZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKSB7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDEpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGggLSAxOyBpIDwgbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBmaWx0ZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IGZpbHRlcnNbaSArIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA8PSBpZGVudGlmaWVyICYmIGlkZW50aWZpZXIgPD0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmcodmFsdWUpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHZhbHVlKSkgKyBcIlwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgZGF0ZSA9IG5ldyBEYXRlU2NoZW1hQ29uc3RydWN0b3IoKVxyXG5cclxuZXhwb3J0IHsgZGF0ZSwgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yIH0iLCJpbXBvcnQgeyBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL251bWJlci5qc1wiXHJcblxyXG5jbGFzcyBUaW1lU2NoZW1hQ29uc3RydWN0b3IgZXh0ZW5kcyBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciB7XHJcblxyXG4gICAgcGFyc2UodmFsdWUpIHtcclxuICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgaG91ciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KFwiOlwiKVswXSk7XHJcbiAgICAgICAgICAgIHZhciBtaW4gPSBwYXJzZUludCh2YWx1ZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIgXCIpWzBdKTtcclxuICAgICAgICAgICAgdmFyIGhhbGYgPSAodmFsdWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiIFwiKVsxXS50b0xvd2VyU291cmNlKCkgPT0gXCJwbVwiKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gMDtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoYWxmID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KChob3VyICsgKChoYWxmKSA/IDEyIDogMCkgKyAobWluIC8gNjApKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICBzdXBlci52ZXJpZnkodmFsdWUsIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUodmFsdWUpKSArIFwiXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCB0aW1lID0gbmV3IFRpbWVTY2hlbWFDb25zdHJ1Y3RvcigpXHJcblxyXG5leHBvcnQgeyB0aW1lLCBUaW1lU2NoZW1hQ29uc3RydWN0b3IgfSIsImltcG9ydCB7IFNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL2NvbnN0cnVjdG9yLmpzXCJcclxuXHJcbmNsYXNzIFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yIGV4dGVuZHMgU2NoZW1hQ29uc3RydWN0b3Ige1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF92YWx1ZSA9IFwiXCJcclxuICAgIH1cclxuICAgIHBhcnNlKHZhbHVlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZSArIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdmVyaWZ5KHZhbHVlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgcmVzdWx0LnZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoaWRlbnRpZmllciwgZmlsdGVycykge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllci5tYXRjaChmaWx0ZXJzW2ldICsgXCJcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgc3RyaW5nID0gbmV3IFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yKClcclxuXHJcbmV4cG9ydCB7IHN0cmluZywgU3RyaW5nU2NoZW1hQ29uc3RydWN0b3IgfTsiLCJpbXBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi9jb25zdHJ1Y3Rvci5qc1wiXHJcblxyXG5jbGFzcyBCb29sU2NoZW1hQ29uc3RydWN0b3IgZXh0ZW5kcyBTY2hlbWFDb25zdHJ1Y3RvciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRfdmFsdWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gKHZhbHVlKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2ZXJpZnkodmFsdWUsIHJlc3VsdCkge1xyXG5cclxuICAgICAgICByZXN1bHQudmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIXZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbikge1xyXG4gICAgICAgICAgICByZXN1bHQudmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmVzdWx0LnJlYXNvbiA9IFwiIFZhbHVlIGlzIG5vdCBhIEJvb2xlYW4uXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGlkZW50aWZpZXIsIGZpbHRlcnMpIHtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGJvb2wgPSBuZXcgQm9vbFNjaGVtYUNvbnN0cnVjdG9yICgpXHJcblxyXG5leHBvcnQgeyBib29sLCBCb29sU2NoZW1hQ29uc3RydWN0b3IgfTsiLCJpbXBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL2NvbnN0cnVjdG9yXCJcclxuXHJcbmltcG9ydCB7IGRhdGUsIERhdGVTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuL3R5cGVzL2RhdGVcIlxyXG5cclxuaW1wb3J0IHsgdGltZSwgVGltZVNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vdHlwZXMvdGltZVwiXHJcblxyXG5pbXBvcnQgeyBzdHJpbmcsIFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vdHlwZXMvc3RyaW5nXCJcclxuXHJcbmltcG9ydCB7IG51bWJlciwgTnVtYmVyU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi90eXBlcy9udW1iZXJcIlxyXG5cclxuaW1wb3J0IHsgYm9vbCwgQm9vbFNjaGVtYUNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vdHlwZXMvYm9vbFwiXHJcblxyXG5sZXQgc2NoZW1hID0geyBkYXRlLCBzdHJpbmcsIG51bWJlciwgYm9vbCwgdGltZSB9XHJcblxyXG5leHBvcnQgeyBTY2hlbWFDb25zdHJ1Y3RvciwgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yLCBUaW1lU2NoZW1hQ29uc3RydWN0b3IsIFN0cmluZ1NjaGVtYUNvbnN0cnVjdG9yLCBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciwgQm9vbFNjaGVtYUNvbnN0cnVjdG9yLCBzY2hlbWEgfTsiLCJleHBvcnQgY2xhc3MgVmlld3tcclxuXHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHJcblx0XHR0aGlzLm5leHQgPSBudWxsO1xyXG5cdFx0dGhpcy5tb2RlbCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkZXN0cnVjdG9yKCl7XHJcblxyXG5cdFx0aWYodGhpcy5tb2RlbClcclxuXHRcdFx0dGhpcy5tb2RlbC5yZW1vdmVWaWV3KHRoaXMpO1xyXG5cdH1cdFxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGEgTW9kZWwgd2hlbiBpdHMgZGF0YSBoYXMgY2hhbmdlZC5cclxuXHQqL1xyXG5cdHVwZGF0ZShkYXRhKXtcclxuXHJcblx0fVxyXG5cdC8qKlxyXG5cdFx0Q2FsbGVkIGJ5IGEgTW9kZWxDb250YWluZXJCYXNlIHdoZW4gYW4gaXRlbSBoYXMgYmVlbiByZW1vdmVkLlxyXG5cdCovXHJcblx0cmVtb3ZlZChkYXRhKXtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHRcdENhbGxlZCBieSBhIE1vZGVsQ29udGFpbmVyQmFzZSB3aGVuIGFuIGl0ZW0gaGFzIGJlZW4gYWRkZWQuXHJcblx0Ki9cclxuXHRhZGRlZChkYXRhKXtcclxuXHJcblx0fVxyXG5cdHNldE1vZGVsKG1vZGVsKXtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCl7XHJcblx0XHRcclxuXHR9XHJcblx0dW5zZXRNb2RlbCgpe1xyXG5cclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLm1vZGVsID0gbnVsbDtcclxuXHR9XHJcbn0iLCJjb25zdCBjYWxsZXIgPSAod2luZG93ICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA6IChmKSA9PiB7XHJcbiAgICBzZXRUaW1lb3V0KGYsIDEpXHJcbn07XHJcbi8qKiBcclxuICAgIFRoZSBTY2hlZHVsZXIgaGFuZGxlcyB1cGRhdGluZyBvYmplY3RzLiBJdCBkb2VzIHRoaXMgYnkgc3BsaXR0aW5nIHVwIHVwZGF0ZSBjeWNsZXMsIFxyXG4gICAgdG8gcmVzcGVjdCB0aGUgYnJvd3NlciBldmVudCBtb2RlbC4gXHJcblxyXG4gICAgSWYgYW55IG9iamVjdCBpcyBzY2hlZHVsZWQgdG8gYmUgdXBkYXRlZCwgaXQgd2lsbCBiZSBibG9ja2VkIGZyb20gc2NoZWR1bGluZyBtb3JlIHVwZGF0ZXMgXHJcbiAgICB1bnRpbCBpdHMgb3duIHVwZGF0ZSBtZXRob2QgaXMgY2FsbGVkLlxyXG4qL1xyXG5cclxuY29uc3QgU2NoZWR1bGVyID0gbmV3KGNsYXNzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVfcXVldWVfYSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlX3F1ZXVlX2IgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVfcXVldWUgPSB0aGlzLnVwZGF0ZV9xdWV1ZV9hO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXVlX3N3aXRjaCA9IDA7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gKCkgPT4gdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZV90aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBxdWV1ZVVwZGF0ZShvYmplY3QpIHtcclxuXHJcbiAgICAgICAgaWYgKG9iamVjdC5fX19fU0NIRURVTEVEX19fXyB8fCAhb2JqZWN0LnVwZGF0ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX19fU0NIRURVTEVEX19fXylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxlcih0aGlzLmNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgb2JqZWN0Ll9fX19TQ0hFRFVMRURfX19fID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVfcXVldWUucHVzaChvYmplY3QpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX19fX1NDSEVEVUxFRF9fX18pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fU0NIRURVTEVEX19fXyA9IHRydWU7XHJcblxyXG4gICAgICAgIGNhbGxlcih0aGlzLmNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX1NDSEVEVUxFRF9fX18gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHVxID0gdGhpcy51cGRhdGVfcXVldWU7XHJcblxyXG4gICAgICAgIGlmKHRoaXMucXVldWVfc3dpdGNoID09IDApXHJcbiAgICAgICAgICAgICh0aGlzLnVwZGF0ZV9xdWV1ZSA9IHRoaXMudXBkYXRlX3F1ZXVlX2IsIHRoaXMucXVldWVfc3dpdGNoID0gMSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAodGhpcy51cGRhdGVfcXVldWUgPSB0aGlzLnVwZGF0ZV9xdWV1ZV9hLCB0aGlzLnF1ZXVlX3N3aXRjaCA9IDApO1xyXG5cclxuICAgICAgICBsZXQgdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICBsZXQgZGlmZiA9IHRpbWUgLSB0aGlzLmZyYW1lX3RpbWU7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVfdGltZSA9IHRpbWU7XHJcblxyXG4gICAgICAgIGxldCBzdGVwX3JhdGlvID0gKGRpZmYgKiAwLjA2KTsgLy8gIHN0ZXBfcmF0aW8gb2YgMSA9IDE2LjY2NjY2NjY2IG9yIDEwMDAgLyA2MCBmb3IgNjAgRlBTXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdXEubGVuZ3RoLCBvID0gdXFbMF07IGkgPCBsOyBvID0gdXFbKytpXSl7XHJcbiAgICAgICAgICAgIG8uX19fX1NDSEVEVUxFRF9fX18gPSBmYWxzZTtcclxuICAgICAgICAgICAgby51cGRhdGUoc3RlcF9yYXRpbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cS5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59KSgpXHJcblxyXG5leHBvcnQge1xyXG4gICAgU2NoZWR1bGVyXHJcbn0iLCJpbXBvcnQgeyBWaWV3IH0gZnJvbSBcIi4uL3ZpZXcvdmlld1wiXHJcblxyXG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tIFwiLi4vY29tbW9uL3NjaGVkdWxlclwiXHJcblxyXG4vKiogQG5hbWVzcGFjZSBNb2RlbCAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vZGVsQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICAvL2luZm9ybSB2aWV3cyBvZiB0aGUgbW9kZWxzIGRlbWlzZVxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuICAgICAgICB3aGlsZSAodmlldykge1xyXG4gICAgICAgICAgICB2aWV3LnVuc2V0TW9kZWwoKTtcclxuICAgICAgICAgICAgdmlldyA9IHZpZXcubmV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy5maXJzdF92aWV3ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcdFxyXG4gICAgKi9cclxuICAgIHNjaGVkdWxlVXBkYXRlKGNoYW5nZWRfdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpcnN0X3ZpZXcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fLnB1c2goY2hhbmdlZF92YWx1ZSk7XHJcblxyXG4gICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFuZ2VkKHByb3BfbmFtZSkge1xyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fW2ldID09IHByb3BfbmFtZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3Byb3BfbmFtZV07XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRBZGRzIGEgdmlldyB0byB0aGUgbGlua2VkIGxpc3Qgb2Ygdmlld3Mgb24gdGhlIG1vZGVsLiBhcmd1bWVudCB2aWV3IE1VU1QgYmUgYW4gaW5zdGFuY2Ugb2YgVmlldy4gXHJcbiAgICAqL1xyXG4gICAgYWRkVmlldyh2aWV3KSB7XHJcblxyXG4gICAgICAgIGlmICh2aWV3IGluc3RhbmNlb2YgVmlldykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHZpZXcubW9kZWwpXHJcbiAgICAgICAgICAgICAgICB2aWV3Lm1vZGVsLnJlbW92ZVZpZXcodmlldyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hpbGRfdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjaGlsZF92aWV3KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcgPT0gY2hpbGRfdmlldykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRfdmlldyA9IGNoaWxkX3ZpZXcubmV4dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5tb2RlbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZpZXcubmV4dCA9IHRoaXMuZmlyc3RfdmlldztcclxuICAgICAgICAgICAgdGhpcy5maXJzdF92aWV3ID0gdmlldztcclxuXHJcbiAgICAgICAgICAgIHZpZXcuc2V0TW9kZWwodGhpcyk7XHJcbiAgICAgICAgICAgIHZpZXcudXBkYXRlKHRoaXMuZ2V0KCkpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiUGFzc2VkIGluIHZpZXcgaXMgbm90IGFuIGluc3RhbmNlIG9mIHdpY2suVmlldyFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcdFJlbW92ZXMgdmlldyBmcm9tIHNldCBvZiB2aWV3cyBpZiB0aGUgcGFzc2VkIGluIHZpZXcgaXMgYSBtZW1iZXIgb2YgbW9kZWwuIFxyXG4gICAgKi9cclxuICAgIHJlbW92ZVZpZXcodmlldykge1xyXG5cclxuICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIFZpZXcgJiYgdmlldy5tb2RlbCA9PSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hpbGRfdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuICAgICAgICAgICAgdmFyIHByZXZfY2hpbGQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGNoaWxkX3ZpZXcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldyA9PSBjaGlsZF92aWV3KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2NoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfY2hpbGQubmV4dCA9IHZpZXcubmV4dDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X3ZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3Lm5leHQgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgcHJldl9jaGlsZCA9IGNoaWxkX3ZpZXc7XHJcbiAgICAgICAgICAgICAgICBjaGlsZF92aWV3ID0gY2hpbGRfdmlldy5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShzdGVwKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19fX2NoYW5nZWRfdmFsdWVzX19fXy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRDYWxscyB1cGRhdGUoKSBvbiBldmVyeSB2aWV3IG9iamVjdCwgcGFzc2luZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgTW9kZWwuXHJcbiAgICAqL1xyXG4gICAgdXBkYXRlVmlld3MoKSB7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5maXJzdF92aWV3O1xyXG5cclxuICAgICAgICB3aGlsZSAodmlldykge1xyXG5cclxuICAgICAgICAgICAgdmlldy51cGRhdGUodGhpcywgdGhpcy5fX19fY2hhbmdlZF92YWx1ZXNfX19fKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9fX19jaGFuZ2VkX3ZhbHVlc19fX18ubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgIFx0VXBkYXRlcyB2aWV3cyB3aXRoIGEgbGlzdCBvZiBtb2RlbHMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZC4gXHJcbiAgICBcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIFNvdXJjZVRlbXBsYXRlcy5cclxuICAgICovXHJcbiAgICB1cGRhdGVWaWV3c1JlbW92ZWQoZGF0YSkge1xyXG5cclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZmlyc3RfdmlldztcclxuXHJcbiAgICAgICAgd2hpbGUgKHZpZXcpIHtcclxuXHJcbiAgICAgICAgICAgIHZpZXcucmVtb3ZlZChkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcgPSB2aWV3Lm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHRVcGRhdGVzIHZpZXdzIHdpdGggYSBsaXN0IG9mIG1vZGVscyB0aGF0IGhhdmUgYmVlbiBhZGRlZC4gXHJcbiAgICBcdFByaW1hcmlseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggY29udGFpbmVyIGJhc2VkIHZpZXdzLCBzdWNoIGFzIFNvdXJjZVRlbXBsYXRlcy5cclxuICAgICovXHJcbiAgICB1cGRhdGVWaWV3c0FkZGVkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLmZpcnN0X3ZpZXc7XHJcblxyXG4gICAgICAgIHdoaWxlICh2aWV3KSB7XHJcblxyXG4gICAgICAgICAgICB2aWV3LmFkZGVkKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgdmlldyA9IHZpZXcubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCAnXFx0Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShNb2RlbEJhc2UucHJvdG90eXBlLCBcImZpcnN0X3ZpZXdcIiwge1xyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbn0pXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kZWxCYXNlLnByb3RvdHlwZSwgXCJfX19fY2hhbmdlZF92YWx1ZXNfX19fXCIsIHtcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG59KVxyXG5cclxuT2JqZWN0LnNlYWwoTW9kZWxCYXNlLnByb3RvdHlwZSk7IiwiaW1wb3J0IHsgTW9kZWxCYXNlIH0gZnJvbSBcIi4uL2Jhc2UuanNcIlxyXG5cclxuaW1wb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vLi4vc2NoZW1hL2NvbnN0cnVjdG9yXCJcclxuXHJcbi8qKiBAbmFtZXNwYWNlIE1vZGVsICovXHJcblxyXG5leHBvcnQgY2xhc3MgTUNBcnJheSBleHRlbmRzIEFycmF5IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2goaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIGl0ZW0uZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdXBlci5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRm9yIGNvbXBhdGliaWxpdHlcclxuICAgIF9fc2V0RmlsdGVyc19fKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFuZ2VkKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdG9Kc29uKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCAnXFx0Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEEgXCJudWxsXCIgZnVuY3Rpb25cclxubGV0IEVtcHR5RnVuY3Rpb24gPSAoKSA9PiB7fTtcclxubGV0IEVtcHR5QXJyYXkgPSBbXTtcclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RlbENvbnRhaW5lckJhc2UgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvL0ZvciBMaW5raW5nIHRvIG9yaWdpbmFsIFxyXG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpcnN0X2xpbmsgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy9Gb3Iga2VlcGluZyB0aGUgY29udGFpbmVyIGZyb20gYXV0b21hdGljIGRlbGV0aW9uLlxyXG4gICAgICAgIHRoaXMucGluID0gRW1wdHlGdW5jdGlvbjtcclxuXHJcbiAgICAgICAgLy9GaWx0ZXJzIGFyZSBhIHNlcmllcyBvZiBzdHJpbmdzIG9yIG51bWJlciBzZWxlY3RvcnMgdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBtb2RlbCBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBvciByZXRyaWV2ZWQgZnJvbSB0aGUgY29udGFpbmVyLlxyXG4gICAgICAgIHRoaXMuX19maWx0ZXJzX18gPSBFbXB0eUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYSB8fCB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYSB8fCB7fTtcclxuXHJcbiAgICAgICAgLy9UaGUgcGFyc2VyIHdpbGwgaGFuZGxlIHRoZSBldmFsdWF0aW9uIG9mIGlkZW50aWZpZXJzIGFjY29yZGluZyB0byB0aGUgY3JpdGVyaWEgc2V0IGJ5IHRoZSBfX2ZpbHRlcnNfXyBsaXN0LiBcclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEucGFyc2VyICYmIHRoaXMuc2NoZW1hLnBhcnNlciBpbnN0YW5jZW9mIFNjaGVtYUNvbnN0cnVjdG9yKVxyXG4gICAgICAgICAgICB0aGlzLnBhcnNlciA9IHRoaXMuc2NoZW1hLnBhcnNlclxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgU2NoZW1hQ29uc3RydWN0b3IoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEuaWRlbnRpZmllciAmJiB0eXBlb2YodGhpcy5zY2hlbWEuaWRlbnRpZmllcikgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuc2NoZW1hLmlkZW50aWZpZXI7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRocm93IChgV3Jvbmcgc2NoZW1hIGlkZW50aWZpZXIgdHlwZSBnaXZlbiB0byBNb2RlbENvbnRhaW5lckJhc2UuIEV4cGVjdGVkIHR5cGUgU3RyaW5nLCBnb3Q6ICR7dHlwZW9mKHRoaXMuc2NoZW1hLmlkZW50aWZpZXIpfSFgLCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgZ2V0OiAob2JqLCBwcm9wLCB2YWwpID0+IChwcm9wIGluIG9iaikgPyBvYmpbcHJvcF0gOiBvYmouZ2V0KHZhbClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5fX3VubGlua19fKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEdldCB0aGUgbnVtYmVyIG9mIE1vZGVscyBoZWxkIGluIHRoaXMgTW9kZWxDb250YWluZXJCYXNlXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAqL1xyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbGVuZ3RoKGUpIHtcclxuICAgICAgICAvL05VTEwgZnVuY3Rpb24uIERvIE5vdCBPdmVycmlkZSFcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgUmV0dXJucyBhIE1vZGVsQ29udGFpbmVyQmFzZSB0eXBlIHRvIHN0b3JlIHRoZSByZXN1bHRzIG9mIGEgZ2V0KCkuXHJcbiAgICAqL1xyXG4gICAgX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKSB7XHJcbiAgICAgICAgaWYgKFVTRV9BUlJBWSkgcmV0dXJuIG5ldyBNQ0FycmF5O1xyXG5cclxuICAgICAgICBsZXQgbiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2xpbmtfXyhuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQXJyYXkgZW11bGF0aW5nIGtsdWRnZVxyXG5cclxuICAgICAgICBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhpcy5pbnNlcnRcclxuICAgICovXHJcbiAgICBwdXNoKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnQoaXRlbSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0cmlldmVzIGEgbGlzdCBvZiBpdGVtcyB0aGF0IG1hdGNoIHRoZSB0ZXJtL3Rlcm1zLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHsoQXJyYXl8U2VhcmNoVGVybSl9IHRlcm0gLSBBIHNpbmdsZSB0ZXJtIG9yIGEgc2V0IG9mIHRlcm1zIHRvIGxvb2sgZm9yIGluIHRoZSBNb2RlbENvbnRhaW5lckJhc2UuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IF9fcmV0dXJuX2RhdGFfXyAtIFNldCB0byB0cnVlIGJ5IGEgc291cmNlIENvbnRhaW5lciBpZiBpdCBpcyBjYWxsaW5nIGEgU3ViQ29udGFpbmVyIGluc2VydCBmdW5jdGlvbi4gXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHsoTW9kZWxDb250YWluZXJCYXNlfEFycmF5KX0gUmV0dXJucyBhIE1vZGVsIGNvbnRhaW5lciBvciBhbiBBcnJheSBvZiBNb2RlbHMgbWF0Y2hpbmcgdGhlIHNlYXJjaCB0ZXJtcy4gXHJcbiAgICAqL1xyXG4gICAgZ2V0KHRlcm0sIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IFVTRV9BUlJBWSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0ZXJtKSB7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBfX3JldHVybl9kYXRhX187XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF9fcmV0dXJuX2RhdGFfXyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBVU0VfQVJSQVkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291cmNlKVxyXG4gICAgICAgICAgICAgICAgICAgIFVTRV9BUlJBWSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuICAgICAgICAgICAgICAgIG91dC5fX3NldEZpbHRlcnNfXyh0ZXJtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBvdXQgPSAoX19yZXR1cm5fZGF0YV9fKSA/IF9fcmV0dXJuX2RhdGFfXyA6IHRoaXMuX19kZWZhdWx0UmV0dXJuX18oVVNFX0FSUkFZKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0QWxsX18ob3V0KTtcclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0gaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG5cclxuICAgICAgICAgICAgLy9OZWVkIHRvIGNvbnZlcnQgdGVybXMgaW50byBhIGZvcm0gdGhhdCB3aWxsIHdvcmsgZm9yIHRoZSBpZGVudGlmaWVyIHR5cGVcclxuICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5tYXAodCA9PiB0aGlzLnBhcnNlci5wYXJzZSh0KSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5fX2dldF9fKHRlcm1zLCBvdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEluc2VydHMgYW4gaXRlbSBpbnRvIHRoZSBjb250YWluZXIuIElmIHRoZSBpdGVtIGlzIG5vdCBhIHtNb2RlbH0sIGFuIGF0dGVtcHQgd2lsbCBiZSBtYWRlIHRvIGNvbnZlcnQgdGhlIGRhdGEgaW4gdGhlIE9iamVjdCBpbnRvIGEgTW9kZWwuXHJcbiAgICAgICAgSWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgaW4gdGhlIGFycmF5IHdpbGwgYmUgY29uc2lkZXJlZCBzZXBhcmF0ZWx5LiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtPYmplY3R9IGl0ZW0gLSBBbiBPYmplY3QgdG8gaW5zZXJ0IGludG8gdGhlIGNvbnRhaW5lci4gT24gb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBNVVNUIGhhdmUgdGhlIHNhbWUgbmFtZSBhcyB0aGUgTW9kZWxDb250YWluZXJCYXNlJ3MgXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gaXRlbSAtIEFuIGFycmF5IG9mIE9iamVjdHMgdG8gaW5zZXJ0IGludG8gdGhlIGNvbnRhaW5lci5cclxuICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IF9fRlJPTV9TT1VSQ0VfXyAtIFNldCB0byB0cnVlIGJ5IGEgc291cmNlIENvbnRhaW5lciBpZiBpdCBpcyBjYWxsaW5nIGEgU3ViQ29udGFpbmVyIGluc2VydCBmdW5jdGlvbi4gXHJcblxyXG4gICAgICAgIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYW4gaW5zZXJ0aW9uIGludG8gdGhlIE1vZGVsQ29udGFpbmVyQmFzZSBvY2N1cnJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgKi9cclxuICAgIGluc2VydChpdGVtLCBfX0ZST01fU09VUkNFX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgYWRkX2xpc3QgPSAodGhpcy5maXJzdF92aWV3KSA/IFtdIDogbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIV9fRlJPTV9TT1VSQ0VfXyAmJiB0aGlzLnNvdXJjZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLmluc2VydChpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2luc2VydFN1Yl9fKGl0ZW1baV0sIG91dCwgYWRkX2xpc3QpKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtKVxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLl9faW5zZXJ0U3ViX18oaXRlbSwgb3V0LCBhZGRfbGlzdCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoYWRkX2xpc3QgJiYgYWRkX2xpc3QubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c0FkZGVkKGFkZF9saXN0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBIHN1YnNldCBvZiB0aGUgaW5zZXJ0IGZ1bmN0aW9uLiBIYW5kbGVzIHRoZSB0ZXN0IG9mIGlkZW50aWZpZXIsIHRoZSBjb252ZXJzaW9uIG9mIGFuIE9iamVjdCBpbnRvIGEgTW9kZWwsIGFuZCB0aGUgY2FsbGluZyBvZiB0aGUgaW50ZXJuYWwgX19pbnNlcnRfXyBmdW5jdGlvbi5cclxuICAgICovXHJcbiAgICBfX2luc2VydFN1Yl9fKGl0ZW0sIG91dCwgYWRkX2xpc3QpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsID0gaXRlbTtcclxuXHJcbiAgICAgICAgdmFyIGlkZW50aWZpZXIgPSB0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKGl0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoaWRlbnRpZmllciAhPSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghKG1vZGVsIGluc3RhbmNlb2YgdGhpcy5zY2hlbWEubW9kZWwpICYmICEobW9kZWwgPSBtb2RlbC5fX19fc2VsZl9fX18pKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyB0aGlzLnNjaGVtYS5tb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhtb2RlbCwgdGhpcy5fX2ZpbHRlcnNfXyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5fX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcilcclxuICAgICAgICAgICAgICAgIHRoaXMuX19saW5rc0luc2VydF9fKG1vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIGNvbnRhaW5lci4gXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlKHRlcm0sIF9fRlJPTV9TT1VSQ0VfXyA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXJtcyA9IHRlcm07XHJcblxyXG4gICAgICAgIGlmICghX19GUk9NX1NPVVJDRV9fICYmIHRoaXMuc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlcm0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRoaXMuX19maWx0ZXJzX18pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UucmVtb3ZlKHRlcm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dF9jb250YWluZXIgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXJtKVxyXG4gICAgICAgICAgICB0aGlzLl9fcmVtb3ZlQWxsX18oKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXJtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1zID0gW3Rlcm1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL05lZWQgdG8gY29udmVydCB0ZXJtcyBpbnRvIGEgZm9ybSB0aGF0IHdpbGwgd29yayBmb3IgdGhlIGlkZW50aWZpZXIgdHlwZVxyXG4gICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLm1hcCh0ID0+IHRoaXMucGFyc2VyLnBhcnNlKHQpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9fbGlua3NSZW1vdmVfXyh0ZXJtcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYSBNb2RlbENvbnRhaW5lckJhc2UgZnJvbSBsaXN0IG9mIGxpbmtlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lckJhc2V9IGNvbnRhaW5lciAtIFRoZSBNb2RlbENvbnRhaW5lckJhc2UgaW5zdGFuY2UgdG8gcmVtb3ZlIGZyb20gdGhlIHNldCBvZiBsaW5rZWQgY29udGFpbmVycy4gTXVzdCBiZSBhIG1lbWJlciBvZiB0aGUgbGlua2VkIGNvbnRhaW5lcnMuIFxyXG4gICAgKi9cclxuICAgIF9fdW5saW5rX18oY29udGFpbmVyKSB7XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lckJhc2UgJiYgY29udGFpbmVyLnNvdXJjZSA9PSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZmlyc3RfbGluaylcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5uZXh0KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLm5leHQucHJldiA9IGNvbnRhaW5lci5wcmV2O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5wcmV2KVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnByZXYubmV4dCA9IGNvbnRhaW5lci5uZXh0O1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEFkZHMgYSBjb250YWluZXIgdG8gdGhlIGxpc3Qgb2YgdHJhY2tlZCBjb250YWluZXJzLiBcclxuXHJcbiAgICAgICAgQHBhcmFtIHtNb2RlbENvbnRhaW5lckJhc2V9IGNvbnRhaW5lciAtIFRoZSBNb2RlbENvbnRhaW5lckJhc2UgaW5zdGFuY2UgdG8gYWRkIHRoZSBzZXQgb2YgbGlua2VkIGNvbnRhaW5lcnMuXHJcbiAgICAqL1xyXG4gICAgX19saW5rX18oY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyQmFzZSAmJiAhY29udGFpbmVyLnNvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLnNvdXJjZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIubmV4dCA9IHRoaXMuZmlyc3RfbGluaztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2xpbmspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2xpbmsucHJldiA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGluayA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5waW4gPSAoKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLl9fdW5saW5rX18oKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5zb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImZhaWxlZCB0byBjbGVhciB0aGUgZGVzdHJ1Y3Rpb24gb2YgY29udGFpbmVyIGluIHRpbWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShjb250YWluZXIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fbGlua3NSZW1vdmVfXyh0ZXJtcykge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5maXJzdF9saW5rO1xyXG4gICAgICAgIHdoaWxlIChhKSB7XHJcbiAgICAgICAgICAgIGEucmVtb3ZlKHRlcm1zLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19saW5rc0luc2VydF9fKGl0ZW0pIHtcclxuICAgICAgICBsZXQgYSA9IHRoaXMuZmlyc3RfbGluaztcclxuICAgICAgICB3aGlsZSAoYSkge1xyXG4gICAgICAgICAgICBhLmluc2VydChpdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgYSA9IGEubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmVtb3ZlcyBhbnkgaXRlbXMgaW4gdGhlIG1vZGVsIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkgXCJpdGVtc1wiLCBhbmQgYWRkcyBhbnkgaXRlbXMgaW4gaXRlbXMgbm90IGFscmVhZHkgaW4gdGhlIE1vZGVsQ29udGFpbmVyQmFzZS5cclxuXHJcbiAgICAgICAgQHBhcmFtIHtBcnJheX0gaXRlbXMgLSBBbiBhcnJheSBvZiBpZGVudGlmaWFibGUgTW9kZWxzIG9yIG9iamVjdHMuIFxyXG4gICAgKi9cclxuICAgIGN1bGwoaXRlbXMpIHtcclxuXHJcbiAgICAgICAgbGV0IGhhc2hfdGFibGUgPSB7fTtcclxuICAgICAgICBsZXQgZXhpc3RpbmdfaXRlbXMgPSBfX2dldEFsbF9fKFtdLCB0cnVlKTtcclxuXHJcbiAgICAgICAgbGV0IGxvYWRIYXNoID0gKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmZvckVhY2goKGUpID0+IGxvYWRIYXNoKGUpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpZGVudGlmaWVyID0gdGhpcy5fX2dldElkZW50aWZpZXJfXyhpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICAgICAgaGFzaF90YWJsZVtpZGVudGlmaWVyXSA9IGl0ZW07XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9hZEhhc2goaXRlbXMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nX2l0ZW1zLmxlbnRoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVfaXRlbSA9IGV4aXN0aW5nX2l0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIWV4aXN0aW5nX2l0ZW1zW3RoaXMuX19nZXRJZGVudGlmaWVyX18oZV9pdGVtKV0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcmVtb3ZlX18oZV9pdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5zZXJ0KGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3NldEZpbHRlcnNfXyh0ZXJtKSB7XHJcbiAgICAgICAgaWYgKHRlcm0gaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXyA9IHRoaXMuX19maWx0ZXJzX18uY29uY2F0KHRlcm0ubWFwKHQgPT4gdGhpcy5wYXJzZXIucGFyc2UodCkpKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fX2ZpbHRlcnNfXy5wdXNoKHRoaXMucGFyc2VyLnBhcnNlKHRlcm0pKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyB0cnVlIGlmIHRoZSBpZGVudGlmaWVyIG1hdGNoZXMgYSBwcmVkZWZpbmVkIGZpbHRlciBwYXR0ZXJuLCB3aGljaCBpcyBldmFsdWF0ZWQgYnkgdGhpcy5wYXJzZXIuIElmIGEgXHJcbiAgICAgICAgcGFyc2VyIHdhcyBub3QgcHJlc2VudCB0aGUgTW9kZWxDb250YWluZXJzIHNjaGVtYSwgdGhlbiB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gdHJ1ZSB1cG9uIGV2ZXJ5IGV2YWx1YXRpb24uXHJcbiAgICAqL1xyXG4gICAgX19maWx0ZXJJZGVudGlmaWVyX18oaWRlbnRpZmllciwgZmlsdGVycykge1xyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLmZpbHRlcihpZGVudGlmaWVyLCBmaWx0ZXJzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyB0aGUgSWRlbnRpZmllciBwcm9wZXJ0eSB2YWx1ZSBpZiBpdCBleGlzdHMgaW4gdGhlIGl0ZW0uIElmIGFuIGFycmF5IHZhbHVlIGZvciBmaWx0ZXJzIGlzIHBhc3NlZCwgdGhlbiB1bmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgdGhlIGlkZW50aWZpZXIgdmFsdWUgZG9lcyBub3QgcGFzcyBmaWx0ZXJpbmcgY3JpdGVyaWEuXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0fE1vZGVsKX0gaXRlbVxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGZpbHRlcnMgLSBBbiBhcnJheSBvZiBmaWx0ZXIgdGVybXMgdG8gdGVzdCB3aGV0aGVyIHRoZSBpZGVudGlmaWVyIG1lZXRzIHRoZSBjcml0ZXJpYSB0byBiZSBoYW5kbGVkIGJ5IHRoZSBNb2RlbENvbnRhaW5lckJhc2UuXHJcbiAgICAqL1xyXG4gICAgX19nZXRJZGVudGlmaWVyX18oaXRlbSwgZmlsdGVycyA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgbGV0IGlkZW50aWZpZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGl0ZW0pID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXIgPSBpdGVtW3RoaXMuc2NoZW1hLmlkZW50aWZpZXJdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWRlbnRpZmllciA9IGl0ZW07XHJcblxyXG4gICAgICAgIGlmIChpZGVudGlmaWVyKVxyXG4gICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy5wYXJzZXIucGFyc2UoaWRlbnRpZmllcik7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXJzICYmIGlkZW50aWZpZXIpXHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fX2ZpbHRlcklkZW50aWZpZXJfXyhpZGVudGlmaWVyLCBmaWx0ZXJzKSkgPyBpZGVudGlmaWVyIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICByZXR1cm4gaWRlbnRpZmllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgICAgT1ZFUlJJREUgU0VDVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIFxyXG4gICAgICAgIEFsbCBvZiB0aGVzZSBmdW5jdGlvbnMgc2hvdWxkIGJlIG92ZXJyaWRkZW4gYnkgaW5oZXJpdGluZyBjbGFzc2VzXHJcbiAgICAqL1xyXG5cclxuICAgIF9faW5zZXJ0X18oaXRlbSwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgX19nZXRfXyhpdGVtLCBfX3JldHVybl9kYXRhX18pIHtcclxuICAgICAgICByZXR1cm4gX19yZXR1cm5fZGF0YV9fO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fcmV0dXJuX2RhdGFfXztcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRU5EIE9WRVJSSURFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTW9kZWxDb250YWluZXJCYXNlLCBNQ0FycmF5IH0gZnJvbSBcIi4vYmFzZVwiXHJcblxyXG4vKiogQG5hbWVzcGFjZSBNb2RlbCAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIE11bHRpSW5kZXhlZENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWRlbnRpZmllcjogXCJpbmRleGVkXCIsXHJcbiAgICAgICAgICAgIG1vZGVsOiBzY2hlbWEubW9kZWxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBzY2hlbWE7XHJcbiAgICAgICAgdGhpcy5pbmRleGVzID0ge307XHJcbiAgICAgICAgdGhpcy5maXJzdF9pbmRleCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkSW5kZXgoc2NoZW1hLmluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IGluZGV4IGluIHRoaXMgY29udGFpbmVyLiBcclxuICAgICovXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpcnN0X2luZGV4Lmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBJbnNlcnQgYSBuZXcgTW9kZWxDb250YWluZXJCYXNlIGludG8gdGhlIGluZGV4IHRocm91Z2ggdGhlIHNjaGVtYS4gIFxyXG4gICAgKi9cclxuICAgIGFkZEluZGV4KGluZGV4X3NjaGVtYSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIGluZGV4X3NjaGVtYSkge1xyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gaW5kZXhfc2NoZW1hW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaGVtZS5jb250YWluZXIgJiYgIXRoaXMuaW5kZXhlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdID0gbmV3IHNjaGVtZS5jb250YWluZXIoc2NoZW1lLnNjaGVtYSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RfaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW25hbWVdLmluc2VydCh0aGlzLmZpcnN0X2luZGV4Ll9fZ2V0QWxsX18oKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9pbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQoaXRlbSwgX19yZXR1cm5fZGF0YV9fKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhlc1tuYW1lXSlcclxuICAgICAgICAgICAgICAgICAgICBvdXRbbmFtZV0gPSB0aGlzLmluZGV4ZXNbbmFtZV0uZ2V0KGl0ZW1bbmFtZV0sIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgfSBlbHNlXHJcblxyXG4gICAgICAgICAgICBvdXQgPSB0aGlzLmZpcnN0X2luZGV4LmdldChudWxsKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBhIGluIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ZXNbYV0pXHJcbiAgICAgICAgICAgICAgICBvdXQgPSBvdXQuY29uY2F0KHRoaXMuaW5kZXhlc1thXS5yZW1vdmUoaXRlbVthXSkpO1xyXG5cclxuICAgICAgICAvKiBSZXBsYXkgaXRlbXMgYWdhaW5zdCBpbmRleGVzIHRvIGluc3VyZSBhbGwgaXRlbXMgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSBhbGwgaW5kZXhlcyAqL1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuaW5kZXhlcy5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbal0ucmVtb3ZlKG91dFtpXSk7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIGFsbCB2aWV3c1xyXG4gICAgICAgIGlmIChvdXQubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3c1JlbW92ZWQob3V0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX2luc2VydF9fKG1vZGVsLCBhZGRfbGlzdCwgaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2VcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLmluZGV4ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmRleC5pbnNlcnQobW9kZWwpKVxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9lbHNlXHJcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUud2FybihgSW5kZXhlZCBjb250YWluZXIgJHthfSAke2luZGV4fSBmYWlsZWQgdG8gaW5zZXJ0OmAsIG1vZGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdXQpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld3ModGhpcy5maXJzdF9pbmRleC5nZXQoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX3JlbW92ZV9fKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuaW5kZXhlcykge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5yZW1vdmUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlbW92ZUFsbF9fKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5pbmRleGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleC5fX3JlbW92ZUFsbF9fKCkpXHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgT3ZlcnJpZGVzIE1vZGVsIGNvbnRhaW5lciBkZWZhdWx0IF9fZ2V0SWRlbnRpZmllcl9fIHRvIGZvcmNlIGl0ZW0gdG8gcGFzcy5cclxuICAgICAgICBAcHJpdmF0ZSBcclxuICAgICovXHJcbiAgICBfX2dldElkZW50aWZpZXJfXyhpdGVtLCBmaWx0ZXJzID0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gXCJbXVwiO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTW9kZWxDb250YWluZXJCYXNlLCBNQ0FycmF5IH0gZnJvbSBcIi4vYmFzZVwiXHJcblxyXG4vKipcclxuICAgIFN0b3JlcyBtb2RlbHMgaW4gcmFuZG9tIG9yZGVyIGluc2lkZSBhbiBpbnRlcm5hbCBhcnJheSBvYmplY3QuIFxyXG4gKi9cclxuIFxyXG5leHBvcnQgY2xhc3MgQXJyYXlNb2RlbENvbnRhaW5lciBleHRlbmRzIE1vZGVsQ29udGFpbmVyQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XHJcbiAgICAgICAgc3VwZXIoc2NoZW1hKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBfX2RlZmF1bHRSZXR1cm5fXygpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHJldHVybiBuZXcgTUNBcnJheTtcclxuXHJcbiAgICAgICAgbGV0IG4gPSBuZXcgQXJyYXlNb2RlbENvbnRhaW5lcih0aGlzLnNjaGVtYSk7XHJcblxyXG4gICAgICAgIHRoaXMuX19saW5rX18obik7XHJcblxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG5cclxuICAgIF9faW5zZXJ0X18obW9kZWwsIGFkZF9saXN0LCBpZGVudGlmaWVyKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5kYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YVtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKG9iaikgPT0gaWRlbnRpZmllcikge1xyXG5cclxuICAgICAgICAgICAgICAgIG9iai5hZGQobW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Nb2RlbCBub3QgYWRkZWQgdG8gQ29udGFpbmVyLiBNb2RlbCBqdXN0IHVwZGF0ZWQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKG1vZGVsKTtcclxuXHJcbiAgICAgICAgaWYgKGFkZF9saXN0KSBhZGRfbGlzdC5wdXNoKG1vZGVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIE1vZGVsIGFkZGVkIHRvIENvbnRhaW5lci5cclxuICAgIH1cclxuXHJcbiAgICBfX2dldF9fKHRlcm0sIHJldHVybl9kYXRhKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXJtcyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0ZXJtKVxyXG4gICAgICAgICAgICBpZiAodGVybSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IHRlcm07XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdGVybXMgPSBbdGVybV07XHJcblxyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBvYmogPSB0aGlzLmRhdGFbaV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9fZ2V0SWRlbnRpZmllcl9fKG9iaiwgdGVybXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5fZGF0YS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXR1cm5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEFsbF9fKHJldHVybl9kYXRhKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKChtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybl9kYXRhLnB1c2gobSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0dXJuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLmRhdGEubWFwKGQgPT4gZCkgfHwgW107XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YS5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyh0ZXJtLCBvdXRfY29udGFpbmVyKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5kYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqID0gdGhpcy5kYXRhW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX19nZXRJZGVudGlmaWVyX18ob2JqLCB0ZXJtKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICBpLS07XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0X2NvbnRhaW5lci5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKEFycmF5TW9kZWxDb250YWluZXIpIiwiaW1wb3J0IHsgTW9kZWxDb250YWluZXJCYXNlLCBNQ0FycmF5IH0gZnJvbSBcIi4vYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi8uLi9zY2hlbWEvc2NoZW1hc1wiXHJcblxyXG4vKiogQG5hbWVzcGFjZSBNb2RlbCAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIEJUcmVlTW9kZWxDb250YWluZXIgZXh0ZW5kcyBNb2RlbENvbnRhaW5lckJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xyXG5cclxuICAgICAgICBpZighc2NoZW1hIHx8ICEoc2NoZW1hLnBhcnNlcikgfHwgICEoc2NoZW1hLnBhcnNlciBpbnN0YW5jZW9mIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yKSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQlRyZWVNb2RlbENvbnRhaW5lcidzIE1VU1QgdXNlIGEgcGFyc2VyIHNjaGVtYSB0aGF0IGlzIG9yIGluaGVyaXRzIGZyb20gTnVtYmVyVHlwZSBzY2hlbWEgYW5kIHJldHVybnMgbnVtZXJpY2FsIHZhbHVlcy5cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIoc2NoZW1hKTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1pbiA9IDEwO1xyXG4gICAgICAgIHRoaXMubWF4ID0gMjA7XHJcbiAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5kZXN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgX19pbnNlcnRfXyhtb2RlbCwgYWRkX2xpc3QsIGlkZW50aWZpZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgYWRkZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3QpXHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5ldyBCdHJlZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMucm9vdC5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIHRoaXMubWF4LCB0cnVlLCByZXN1bHQpLm5ld25vZGU7XHJcblxyXG4gICAgICAgIGlmIChhZGRfbGlzdCkgYWRkX2xpc3QucHVzaChtb2RlbCk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuYWRkZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0LmFkZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0X18odGVybXMsIF9fcmV0dXJuX2RhdGFfXykge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzBdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXJtcy5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbMF0pLCBwYXJzZUZsb2F0KHRlcm1zWzFdKSwgX19yZXR1cm5fZGF0YV9fKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGVybXMubGVuZ3RoIC0gMTsgaSA+IGw7IGkgKz0gMilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KHBhcnNlRmxvYXQodGVybXNbaV0pLCBwYXJzZUZsb2F0KHRlcm1zW2kgKyAxXSksIF9fcmV0dXJuX2RhdGFfXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVfXyh0ZXJtcywgb3V0X2NvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290ICYmIHRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRlcm1zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMucm9vdC5yZW1vdmUodGVybXNbMF0sIHRlcm1zWzBdLCB0cnVlLCB0aGlzLm1pbiwgb3V0X2NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IG8ub3V0X25vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybXMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zWzBdLCB0ZXJtc1sxXSwgdHJ1ZSwgdGhpcy5taW4sIG91dF9jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gby5vdXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0ZXJtcy5sZW5ndGggLSAxOyBpID4gbDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLnJvb3QucmVtb3ZlKHRlcm1zW2ldLCB0ZXJtc1tpICsgMV0sIHRydWUsIHRoaXMubWluLCBvdXRfY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBvLm91dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBvLm91dF9ub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNpemUgLT0gcmVzdWx0O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZ2V0QWxsX18oX19yZXR1cm5fZGF0YV9fKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdClcclxuICAgICAgICAgICAgdGhpcy5yb290LmdldCgtSW5maW5pdHksIEluZmluaXR5LCBfX3JldHVybl9kYXRhX18pO1xyXG4gICAgICAgIHJldHVybiBfX3JldHVybl9kYXRhX187XHJcbiAgICB9XHJcblxyXG4gICAgX19yZW1vdmVBbGxfXygpIHtcclxuICAgICAgICBpZiAodGhpcy5yb290KVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yb290KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuZ2V0KC1JbmZpbml0eSwgSW5maW5pdHksIG91dF9kYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQnRyZWVOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKElTX0xFQUYgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuTEVBRiA9IElTX0xFQUY7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXRlbXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMua2V5cyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5MRUFGKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmtleXMubGVuZ3RoID49IG1heF9zaXplKSB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBzcGxpdCB0aGlzIHVwIVxyXG5cclxuICAgICAgICAgICAgbGV0IG5ld25vZGUgPSBuZXcgQnRyZWVOb2RlKHRoaXMuTEVBRik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BsaXQgPSAobWF4X3NpemUgPj4gMSkgfCAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tzcGxpdF07XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVmdF9rZXlzID0gdGhpcy5rZXlzLnNsaWNlKDAsIHNwbGl0KTtcclxuICAgICAgICAgICAgbGV0IGxlZnRfbm9kZXMgPSB0aGlzLm5vZGVzLnNsaWNlKDAsICh0aGlzLkxFQUYpID8gc3BsaXQgOiBzcGxpdCArIDEpXHJcblxyXG4gICAgICAgICAgICBsZXQgcmlnaHRfa2V5cyA9IHRoaXMua2V5cy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0X25vZGVzID0gdGhpcy5ub2Rlcy5zbGljZSgodGhpcy5MRUFGKSA/IHNwbGl0IDogc3BsaXQgKyAxKTtcclxuXHJcbiAgICAgICAgICAgIG5ld25vZGUua2V5cyA9IHJpZ2h0X2tleXM7XHJcbiAgICAgICAgICAgIG5ld25vZGUubm9kZXMgPSByaWdodF9ub2RlcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5cyA9IGxlZnRfa2V5cztcclxuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IGxlZnRfbm9kZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoSVNfUk9PVCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb290ID0gbmV3IEJ0cmVlTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvb3Qua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICByb290Lm5vZGVzLnB1c2godGhpcywgbmV3bm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdub2RlOiByb290LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZTogbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgSW5zZXJ0cyBtb2RlbCBpbnRvIHRoZSB0cmVlLCBzb3J0ZWQgYnkgaWRlbnRpZmllci4gXHJcbiAgICAqL1xyXG4gICAgaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgSVNfUk9PVCA9IGZhbHNlLCByZXN1bHQpIHtcclxuXHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuTEVBRikge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIDwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbyA9IG5vZGUuaW5zZXJ0KGlkZW50aWZpZXIsIG1vZGVsLCBtYXhfc2l6ZSwgZmFsc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleXIgPSBvLmtleTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3bm9kZSA9IG8ubmV3bm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXIgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3bm9kZSAhPSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMCwga2V5cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGkgKyAxLCAwLCBuZXdub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICAgICAgbmV3bm9kZSxcclxuICAgICAgICAgICAgICAgIGtleVxyXG4gICAgICAgICAgICB9ID0gbm9kZS5pbnNlcnQoaWRlbnRpZmllciwgbW9kZWwsIG1heF9zaXplLCBmYWxzZSwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gdW5kZWZpbmVkKSBkZWJ1Z2dlclxyXG5cclxuICAgICAgICAgICAgaWYgKG5ld25vZGUgIT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMucHVzaChuZXdub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZUluc2VydChtYXhfc2l6ZSwgSVNfUk9PVCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5hZGQoa2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogaWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXIgPCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpLCAwLCBpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAwLCBtb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VJbnNlcnQobWF4X3NpemUsIElTX1JPT1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXMucHVzaChpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5hZGRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlSW5zZXJ0KG1heF9zaXplLCBJU19ST09UKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ld25vZGU6IHRoaXMsXHJcbiAgICAgICAgICAgIGtleTogaWRlbnRpZmllcixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGJhbGFuY2VSZW1vdmUoaW5kZXgsIG1pbl9zaXplKSB7XHJcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLm5vZGVzW2luZGV4IC0gMV07XHJcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ub2Rlc1tpbmRleCArIDFdO1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpbmRleF07XHJcblxyXG4gICAgICAgIC8vTGVmdCByb3RhdGVcclxuICAgICAgICBpZiAobGVmdCAmJiBsZWZ0LmtleXMubGVuZ3RoID4gbWluX3NpemUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBsayA9IGxlZnQua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBsbiA9IGxlZnQubm9kZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgbm9kZS5rZXlzLnVuc2hpZnQoKG5vZGUuTEVBRikgPyBsZWZ0LmtleXNbbGsgLSAxXSA6IHRoaXMua2V5c1tpbmRleCAtIDFdKTtcclxuICAgICAgICAgICAgbm9kZS5ub2Rlcy51bnNoaWZ0KGxlZnQubm9kZXNbbG4gLSAxXSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleXNbaW5kZXggLSAxXSA9IGxlZnQua2V5c1tsayAtIDFdO1xyXG5cclxuICAgICAgICAgICAgbGVmdC5rZXlzLmxlbmd0aCA9IGxrIC0gMTtcclxuICAgICAgICAgICAgbGVmdC5ub2Rlcy5sZW5ndGggPSBsbiAtIDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIC8vUmlnaHQgcm90YXRlXHJcbiAgICAgICAgICAgIGlmIChyaWdodCAmJiByaWdodC5rZXlzLmxlbmd0aCA+IG1pbl9zaXplKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5rZXlzLnB1c2goKG5vZGUuTEVBRikgPyByaWdodC5rZXlzWzBdIDogdGhpcy5rZXlzW2luZGV4XSk7XHJcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVzLnB1c2gocmlnaHQubm9kZXNbMF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJpZ2h0LmtleXMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQubm9kZXMuc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpbmRleF0gPSAobm9kZS5MRUFGKSA/IHJpZ2h0LmtleXNbMV0gOiByaWdodC5rZXlzWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9MZWZ0IG9yIFJpZ2h0IE1lcmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoIWxlZnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSByaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGluZGV4IC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGVmdC5ub2RlcyA9IGxlZnQubm9kZXMuY29uY2F0KG5vZGUubm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsZWZ0LkxFQUYpIGxlZnQua2V5cy5wdXNoKGtleSlcclxuICAgICAgICAgICAgICAgIGxlZnQua2V5cyA9IGxlZnQua2V5cy5jb25jYXQobm9kZS5rZXlzKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQuTEVBRilcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZnQua2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQua2V5c1tpXSAhPSBsZWZ0Lm5vZGVzW2ldLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKHN0YXJ0LCBlbmQsIElTX1JPT1QgPSBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMua2V5cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIG91dCA9IDAsXHJcbiAgICAgICAgICAgIG91dF9ub2RlID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMua2V5c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPD0ga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLm5vZGVzW2ldLnJlbW92ZShzdGFydCwgZW5kLCBmYWxzZSwgbWluX3NpemUsIG91dF9jb250YWluZXIpLm91dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3V0ICs9IHRoaXMubm9kZXNbaV0ucmVtb3ZlKHN0YXJ0LCBlbmQsIGZhbHNlLCBtaW5fc2l6ZSwgb3V0X2NvbnRhaW5lcikub3V0O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlc1tpXS5rZXlzLmxlbmd0aCA8IG1pbl9zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFsYW5jZVJlbW92ZShpLCBtaW5fc2l6ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICAgICAgb3V0X25vZGUgPSB0aGlzLm5vZGVzWzBdO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5rZXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPD0gZW5kICYmIGtleSA+PSBzdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBvdXRfbm9kZSxcclxuICAgICAgICAgICAgb3V0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc3RhcnQsIGVuZCwgb3V0X2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkxFQUYpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0IDw9IGtleSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGVzW2ldLmdldChzdGFydCwgZW5kLCBvdXRfY29udGFpbmVyLCApXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMua2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmtleXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA8PSBlbmQgJiYga2V5ID49IHN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIG91dF9jb250YWluZXIucHVzaCh0aGlzLm5vZGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShCVHJlZU1vZGVsQ29udGFpbmVyKTsiLCJpbXBvcnQgeyBNb2RlbEJhc2UgfSBmcm9tIFwiLi9iYXNlLmpzXCJcclxuXHJcbmltcG9ydCB7IE1vZGVsQ29udGFpbmVyQmFzZSB9IGZyb20gXCIuL2NvbnRhaW5lci9iYXNlXCJcclxuXHJcbmltcG9ydCB7IE11bHRpSW5kZXhlZENvbnRhaW5lciB9IGZyb20gXCIuL2NvbnRhaW5lci9tdWx0aVwiXHJcblxyXG5pbXBvcnQgeyBBcnJheU1vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4vY29udGFpbmVyL2FycmF5XCJcclxuXHJcbmltcG9ydCB7IEJUcmVlTW9kZWxDb250YWluZXIgfSBmcm9tIFwiLi9jb250YWluZXIvYnRyZWVcIlxyXG5cclxuaW1wb3J0IHsgU2NoZW1hQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vc2NoZW1hL3NjaGVtYXNcIlxyXG5cclxuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSBcIi4uL2NvbW1vbi9zY2hlZHVsZXJcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgTW9kZWwgKi9cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIG5vbi1Nb2RlbENvbnRhaW5lckJhc2UgYW5kIG5vbi1Nb2RlbCBwcm9wZXJ0aWVzIG9mIHRoZSBOTW9kZWwgY29uc3RydWN0b3IuXHJcbiovXHJcbmZ1bmN0aW9uIENyZWF0ZVNjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGlmIChjb25zdHJ1Y3Rvci5wcm90b3R5cGVbc2NoZW1hX25hbWVdKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICBsZXQgX19zaGFkb3dfbmFtZV9fID0gYF9fJHtzY2hlbWFfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsdWU6IHNjaGVtZS5zdGFydF92YWx1ZSB8fCB1bmRlZmluZWRcclxuICAgIH0pXHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgc2NoZW1hX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX19zaGFkb3dfbmFtZV9fXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsID0gc2NoZW1lLnBhcnNlKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHNjaGVtZS52ZXJpZnkodmFsLCByZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC52YWxpZCAmJiB0aGlzW19fc2hhZG93X25hbWVfX10gIT0gdmFsKVxyXG4gICAgICAgICAgICAgICAgKHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IHZhbCwgdGhpcy5zY2hlZHVsZVVwZGF0ZShzY2hlbWFfbmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIFNjaGVtZWQgTW9kZWxDb250YWluZXJCYXNlIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuZnVuY3Rpb24gQ3JlYXRlTUNTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpIHtcclxuXHJcbiAgICBsZXQgc2NoZW1hID0gc2NoZW1lLnNjaGVtYTtcclxuXHJcbiAgICBsZXQgbWNfY29uc3RydWN0b3IgPSBzY2hlbWUuY29udGFpbmVyO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBfX3NoYWRvd19uYW1lX18sIHtcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbnVsbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzW19fc2hhZG93X25hbWVfX10pXHJcbiAgICAgICAgICAgICAgICB0aGlzW19fc2hhZG93X25hbWVfX10gPSBuZXcgbWNfY29uc3RydWN0b3Ioc2NoZW1lLnNjaGVtYSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IE1DID0gdGhpc1tfX3NoYWRvd19uYW1lX19dO1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mKHZhbHVlKSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIE1DID0gbmV3IG1jX2NvbnN0cnVjdG9yKHNjaGVtZS5zY2hlbWEpO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tfX3NoYWRvd19uYW1lX19dID0gTUM7XHJcbiAgICAgICAgICAgICAgICBNQy5pbnNlcnQoZGF0YSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUoc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgbWNfY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbX19zaGFkb3dfbmFtZV9fXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hX25hbWUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gICAgVGhpcyBpcyB1c2VkIGJ5IE5Nb2RlbCB0byBjcmVhdGUgY3VzdG9tIHByb3BlcnR5IGdldHRlciBhbmQgc2V0dGVycyBcclxuICAgIG9uIE1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuZnVuY3Rpb24gQ3JlYXRlTW9kZWxQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lLCBzY2hlbWFfbmFtZSkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWUuc2NoZW1hO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3NjaGVtYV9uYW1lfV9fYDtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBzY2hlbWFfbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHNjaGVtYV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgc2NoZW1lKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbc2NoZW1hX25hbWVdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHt9XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvL1RoZSBzY2hlbWEgaXMgc3RvcmVkIGRpcmVjdGx5IG9uIHRoZSBjb25zdHJ1Y3Rvci4gSWYgaXQgaXMgbm90IHRoZXJlLCB0aGVuIGNvbnNpZGVyIHRoaXMgbW9kZWwgdHlwZSB0byBcIkFOWVwiXHJcbiAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xyXG5cclxuICAgICAgICBpZiAoc2NoZW1hKSB7XHJcbiAgICAgICAgICAgIGxldCBfX0ZpbmFsQ29uc3RydWN0b3JfXyA9IHNjaGVtYS5fX0ZpbmFsQ29uc3RydWN0b3JfXztcclxuXHJcbiAgICAgICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XHJcblxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBcInNjaGVtYVwiLCB7XHJcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogc2NoZW1hXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBpZiAoIV9fRmluYWxDb25zdHJ1Y3Rvcl9fKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2hlbWFfbmFtZSBpbiBzY2hlbWEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3NjaGVtYV9uYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWVbMF0gJiYgc2NoZW1lWzBdLmNvbnRhaW5lciAmJiBzY2hlbWVbMF0uc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNQ1NjaGVtZWRQcm9wZXJ0eShjb25zdHJ1Y3Rvciwgc2NoZW1lWzBdLCBzY2hlbWFfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lWzBdIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVNb2RlbFByb3BlcnR5KGNvbnN0cnVjdG9yLCBzY2hlbWVbMF0uY29uc3RydWN0b3IsIHNjaGVtYV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZU1vZGVsUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZVswXS5jb25zdHJ1Y3Rvciwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIFNjaGVtYUNvbnN0cnVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVTY2hlbWVkUHJvcGVydHkoY29uc3RydWN0b3IsIHNjaGVtZSwgc2NoZW1hX25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgY3JlYXRlIHByb3BlcnR5ICR7c2NoZW1hX25hbWV9LmApXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5zZWFsKGNvbnN0cnVjdG9yKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNjaGVtYSwgXCJfX0ZpbmFsQ29uc3RydWN0b3JfX1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLy9zY2hlbWEuX19GaW5hbENvbnN0cnVjdG9yX18gPSBjb25zdHJ1Y3RvcjtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgcHJvY2VzcyBvdmVyIHdpdGggYSBuZXdseSBtaW50ZWQgTW9kZWwgdGhhdCBoYXMgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgU2NoZW1hXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLyogVGhpcyB3aWxsIGJlIGFuIEFOWSBNb2RlbCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFueU1vZGVsKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFJlbW92ZXMgYWxsIGhlbGQgcmVmZXJlbmNlcyBhbmQgY2FsbHMgdW5zZXRNb2RlbCBvbiBhbGwgbGlzdGVuaW5nIHZpZXdzLlxyXG4gICAgKi9cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hID0gbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpc1thXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZihwcm9wKSA9PSBcIm9iamVjdFwiICYmIHByb3AuZGVzdHJ1Y3RvciBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxyXG4gICAgICAgICAgICAgICAgcHJvcC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXNbYV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgIC8vZGVidWdnZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBHaXZlbiBhIGtleSwgcmV0dXJucyBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdGF0dXMgb2YgdGhlIHZhbHVlIGNvbnRhaW5lZCwgaWYgaXQgaXMgdmFsaWQgb3Igbm90LCBhY2NvcmRpbmcgdG8gdGhlIHNjaGVtYSBmb3IgdGhhdCBwcm9wZXJ0eS4gXHJcbiAgICAqL1xyXG4gICAgdmVyaWZ5KGtleSkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X2RhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICByZWFzb246IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2NoZW1lID0gdGhpcy5zY2hlbWFba2V5XTtcclxuXHJcbiAgICAgICAgaWYgKHNjaGVtZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZW1lIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY2hlbWUudmVyaWZ5KHRoaXNba2V5XSwgb3V0X2RhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X2RhdGFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZXR1cm5zIGEgcGFyc2VkIHZhbHVlIGJhc2VkIG9uIHRoZSBrZXkgXHJcbiAgICAqL1xyXG4gICAgc3RyaW5nKGtleSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvdXRfZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYXNvbjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgdmFyIHNjaGVtZSA9IHRoaXMuc2NoZW1hW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1lIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0uc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtZSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NoZW1lLnN0cmluZyh0aGlzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEBwYXJhbSBkYXRhIDogQW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5IHZhbHVlIHBhaXJzIHRvIGluc2VydCBpbnRvIHRoZSBtb2RlbC4gXHJcbiAgICAqL1xyXG4gICAgYWRkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSB0aGlzW2FdID0gZGF0YVthXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0KGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIG91dF9kYXRhID0ge307XHJcblxyXG4gICAgICAgIGlmICghZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICBpZiAoYSBpbiB0aGlzKSBvdXRfZGF0YVthXSA9IHRoaXNbYV07XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgbGV0IG91dCA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgc2NoZW1hID0gdGhpcy5zY2hlbWE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gc2NoZW1hKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2NoZW1lID0gc2NoZW1hW3Byb3BdO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAgICBUaGlzIGlzIHVzZWQgYnkgTk1vZGVsIHRvIGNyZWF0ZSBjdXN0b20gcHJvcGVydHkgZ2V0dGVyIGFuZCBzZXR0ZXJzIFxyXG4gICAgb24gbm9uLU1vZGVsQ29udGFpbmVyQmFzZSBhbmQgbm9uLU1vZGVsIHByb3BlcnRpZXMgb2YgdGhlIE5Nb2RlbCBjb25zdHJ1Y3Rvci5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUdlbmVyaWNQcm9wZXJ0eShjb25zdHJ1Y3RvciwgcHJvcF92YWwsIHByb3BfbmFtZSwgbW9kZWwpIHtcclxuXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BfbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBfX3NoYWRvd19uYW1lX18gPSBgX18ke3Byb3BfbmFtZX1fX2A7XHJcblxyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIF9fc2hhZG93X25hbWVfXywge1xyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsOiBwcm9wX3ZhbFxyXG4gICAgfSlcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wX25hbWUsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19fc2hhZG93X25hbWVfX107XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnZhbGlkICYmIHRoaXNbX19zaGFkb3dfbmFtZV9fXSAhPSB2YWwpXHJcbiAgICAgICAgICAgICAgICAodGhpc1tfX3NoYWRvd19uYW1lX19dID0gdmFsLCBtb2RlbC5zY2hlZHVsZVVwZGF0ZShwcm9wX25hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBBbnlNb2RlbFByb3h5U2V0KG9iaiwgcHJvcCwgdmFsKSB7XHJcblxyXG4gICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSA9PSB2YWwpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICBvYmpbcHJvcF0gPSB2YWw7XHJcblxyXG4gICAgb2JqLnNjaGVkdWxlVXBkYXRlKHByb3ApO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQW55TW9kZWwgZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcF9uYW1lIGluIGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3BfbmFtZV0gPSBkYXRhW3Byb3BfbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgc2V0OiBBbnlNb2RlbFByb3h5U2V0XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBBbGlhcyBmb3IgZGVzdHJ1Y3RvclxyXG4gICAgKi9cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG5cclxuICAgICAgICB0aGlzLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGFsbCBoZWxkIHJlZmVyZW5jZXMgYW5kIGNhbGxzIHVuc2V0TW9kZWwgb24gYWxsIGxpc3RlbmluZyB2aWV3cy5cclxuICAgICovXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGRhdGEpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKVxyXG4gICAgICAgICAgICB0aGlzW2FdID0gZGF0YVthXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoZGF0YSkge1xyXG5cclxuICAgICAgICB2YXIgb3V0X2RhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzW2FdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRfZGF0YVthXSA9IHByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBSZW1vdmVzIGl0ZW1zIGluIGNvbnRhaW5lcnMgYmFzZWQgb24gbWF0Y2hpbmcgaW5kZXguXHJcbiAgICAqL1xyXG5cclxuICAgIHJlbW92ZShkYXRhKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3AgPT0gXCJmaXJzdF92aWV3XCIgfHxcclxuICAgICAgICAgICAgICAgIHByb3AgPT0gXCJjaGFuZ2VkX3ZhbHVlc1wiIHx8XHJcbiAgICAgICAgICAgICAgICBwcm9wID09IFwiX19fX1NDSEVEVUxFRF9fX19cIilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgb3V0W3Byb3BdID0gdGhpc1twcm9wXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICB0b0pzb25TdHJpbmcoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgKyBcIlwiO1xyXG4gICAgfVxyXG59IiwiY2xhc3MgVHJhbnNpdGlvbmVlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGVsZW1lbnQsIGRhdGEpIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41c1wiO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X2luKGVsZW1lbnQsIGRhdGEsIGluZGV4ID0gMCkge1xyXG4gICAgXHRlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBgb3BhY2l0eSAkezAuOCppbmRleCswLjV9c2A7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9vdXQoZWxlbWVudCwgZGF0YSwgaW5kZXggPSAwKSB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICByZXR1cm4gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplX291dChlbGVtZW50KSB7XHJcbiAgICBcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtcclxuICAgIFRyYW5zaXRpb25lZXJcclxufSIsImltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi4vdmlldy92aWV3XCJcclxuXHJcbmltcG9ydCB7IEFueU1vZGVsIH0gZnJvbSBcIi4uL21vZGVsL21vZGVsXCJcclxuXHJcbi8qIFRyYW5zaXRpb25lZXJzICovXHJcblxyXG5pbXBvcnQgeyBUcmFuc2l0aW9uZWVyIH0gZnJvbSBcIi4uL2FuaW1hdGlvbi90cmFuc2l0aW9uL3RyYW5zaXRpb25lZXJcIlxyXG5cclxubGV0IFByZXNldFRyYW5zaXRpb25lZXJzID0geyBiYXNlOiBUcmFuc2l0aW9uZWVyIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBTb3VyY2VCYXNlIGV4dGVuZHMgVmlldyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgZGF0YSA9IHt9LCBwcmVzZXRzID0ge30pIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5lbGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubmFtZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ERVNUUk9ZRUQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR0aW5nIHRoZSB0cmFuc2l0aW9uZXJcclxuICAgICAgICB0aGlzLnRycyA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLnRycykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXNldHMudHJhbnNpdGlvbnMgJiYgcHJlc2V0cy50cmFuc2l0aW9uc1tkYXRhLnRyc10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRycyA9IG5ldyBwcmVzZXRzLnRyYW5zaXRpb25zW2RhdGEudHJzXSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChQcmVzZXRUcmFuc2l0aW9uZWVyc1tkYXRhLnRyc10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRycyA9IG5ldyBQcmVzZXRUcmFuc2l0aW9uZWVyc1tkYXRhLnRyc10oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJzLnNldCh0aGlzLmVsZSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkVG9QYXJlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb1BhcmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZHN0cigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ERVNUUk9ZRUQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5MT0FERUQpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMudHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ID0gTWF0aC5tYXgodCwgY2hpbGQudHJhbnNpdGlvbk91dCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHQgPiAwKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuZHN0cigpOyB9LCB0ICogMTAwMCArIDUpXHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IGMuZHN0cigpKTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlICYmIHRoaXMuZWxlLnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyLmRzdHIoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWJibGVMaW5rKGxpbmtfdXJsLCBjaGlsZCwgdHJzX2VsZSA9IHt9KSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS50cmFuc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0gPSB0aGlzLmVsZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2ggPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaCAhPT0gY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2guZ2F0aGVyVHJhbnNpdGlvbkVsZW1lbnRzKHRyc19lbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5idWJibGVMaW5rKGxpbmtfdXJsLCB0aGlzLCB0cnNfZWxlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgbGlua191cmwpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7fVxyXG5cclxuICAgIGdhdGhlclRyYW5zaXRpb25FbGVtZW50cyh0cnNfZWxlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudHJhbnNpdGlvbiAmJiAhdHJzX2VsZVt0aGlzLmRhdGEudHJhbnNpdGlvbl0pXHJcbiAgICAgICAgICAgIHRyc19lbGVbdGhpcy5kYXRhLnRyYW5zaXRpb25dID0gdGhpcy5lbGU7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5pcyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgZS5nYXRoZXJUcmFuc2l0aW9uRWxlbWVudHModHJzX2VsZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb3B5KGVsZW1lbnQsIGluZGV4KSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRfb2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5lbGUgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuZWxlXTtcclxuICAgICAgICAgICAgb3V0X29iamVjdC5jaGlsZHJlbiA9IG5ldyBBcnJheSh0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgb3V0X29iamVjdC5jaGlsZHJlbltpXSA9IGNoaWxkLmNvcHkob3V0X29iamVjdC5lbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0X29iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge31cclxuXHJcbiAgICBmaW5hbGl6ZVRyYW5zaXRpb25PdXQoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uZmluYWxpemVUcmFuc2l0aW9uT3V0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRycylcclxuICAgICAgICAgICAgdGhpcy50cnMuZmluYWxpemVfb3V0KHRoaXMuZWxlKTtcclxuXHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICBAcmV0dXJucyB7bnVtYmVyfSBUaW1lIGluIG1pbGxpc2Vjb25kcyB0aGF0IHRoZSB0cmFuc2l0aW9uIHdpbGwgdGFrZSB0byBjb21wbGV0ZS5cclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uSW4oaW5kZXggPSAwKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSB0cnVlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMuY2hpbGRyZW5baV0udHJhbnNpdGlvbkluKGluZGV4KSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRycylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRycy5zZXRfaW4odGhpcy5lbGUsIHRoaXMuZGF0YSwgaW5kZXgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KGluZGV4ID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50cnMpXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50cnMuc2V0X291dCh0aGlzLmVsZSwgdGhpcy5kYXRhLCBpbmRleCkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMuY2hpbGRyZW5baV0udHJhbnNpdGlvbk91dChpbmRleCkpO1xyXG5cclxuICAgICAgICBpZiAoREVTVFJPWSlcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kc3RyKCk7XHJcbiAgICAgICAgICAgIH0sIHRyYW5zaXRpb25fdGltZSAqIDEwMDApO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURpbWVuc2lvbnMoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGVEaW1lbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIGRvd24gZnJvbSBmdXJ0aGVyIHVwIHRoZSBncmFwaC4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuXHJcbiAgICAgICAgaWYgKHJfdmFsKShkYXRhID0gcl92YWwsIElNUE9SVEVEID0gdHJ1ZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCB1cCBmcm9tIGEgbGVhZi4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX3VwX18oZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KHVwKTtcclxuICAgIH1cclxuXHJcbiAgICB1cChkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKVxyXG4gICAgICAgICAgICB0aGlzLl9fdXBfXyhkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlX18oZGF0YSwgRlJPTV9QQVJFTlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBsZXQgcl9kYXRhID0gdGhpcy51cGRhdGUoZGF0YSwgRlJPTV9QQVJFTlQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fdXBkYXRlX18ocl9kYXRhIHx8IGRhdGEsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmVsZS5zdHlsZS5kaXNwbGF5O1xyXG4gICAgICAgICAgICB0aGlzLmVsZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZSlcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlLnN0eWxlLmRpc3BsYXkgPT0gXCJub25lXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS5zdHlsZS5kaXNwbGF5ID0gdGhpcy5kaXNwbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlRXhwb3J0c19fKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnRfdmFsID0gZGF0YVt0aGlzLmRhdGEuZXhwb3J0XTtcclxuICAgIH1cclxuXHJcbiAgICBfX2dldEV4cG9ydHNfXyhleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmV4cG9ydF92YWwpXHJcbiAgICAgICAgICAgIGV4cG9ydHNbdGhpcy5kYXRhLmV4cG9ydF0gPSB0aGlzLmV4cG9ydF92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgRXhwb3J0cyBkYXRhIHN0b3JlZCBmcm9tIHVwZGF0ZUV4cG9ydHMoKSBpbnRvIGEgYW4gT2JqZWN0IGV4cG9ydHMgYW5kIGNhbGxzIGl0J3MgcGFyZW50J3MgZXhwb3J0IGZ1bmN0aW9uLCBwYXNzaW5nIGV4cG9ydHNcclxuICAgICovXHJcbiAgICBleHBvcnQgKGV4cG9ydHMgPSBuZXcgQW55TW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmV4cG9ydCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXRFeHBvcnRzX18oZXhwb3J0cylcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9fZ2V0RXhwb3J0c19fKGV4cG9ydHMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXBvcnQgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmV4cG9ydChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVFeHBvcnRzKGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQgJiYgZGF0YVt0aGlzLmRhdGEuZXhwb3J0XSlcclxuICAgICAgICAgICAgdGhpcy5leHBvcnQgPSBkYXRhW3RoaXMuZGF0YS5leHBvcnRdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwb3J0KHRoaXMubW9kZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuYWRkKVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5hZGQodmFsdWUpXHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IEdldHRlclxyXG4gKi9cclxuY2xhc3MgR2V0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHVybCwgcHJvY2Vzc19kYXRhKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVybCA9IHByb2Nlc3NfZGF0YTtcclxuICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChyZXF1ZXN0X29iamVjdCwgc3RvcmVfb2JqZWN0LCBzZWN1cmUgPSB0cnVlKSB7XHJcbiAgICAgICAgLy9pZih0aGlzLkZFVENIX0lOX1BST0dSRVNTKVxyXG4gICAgICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHRoaXMuRkVUQ0hfSU5fUFJPR1JFU1MgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gKChzZWN1cmUpID8gXCJodHRwczovL1wiIDogXCJodHRwOi8vXCIpICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnVybCArICggKHJlcXVlc3Rfb2JqZWN0KSA/IChcIj9cIiArIHRoaXMuX19wcm9jZXNzX3VybF9fKHJlcXVlc3Rfb2JqZWN0KSkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoc3RvcmUpID0+IGZldGNoKHVybCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIFNlbmRzIGNvb2tpZXMgYmFjayB0byBzZXJ2ZXIgd2l0aCByZXF1ZXN0XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAocmVzcG9uc2UuanNvbigpLnRoZW4oKGopPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHJvY2Vzc19yZXNwb25zZV9fKGosIHN0b3JlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgdGhpcy5GRVRDSF9JTl9QUk9HUkVTUyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9fcmVqZWN0ZWRfcmVwb25zZV9fKHN0b3JlKTtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gUmVzcG9uc2U6ICR7ZXJyb3J9LiBFcnJvciBSZWNlaXZlZDogJHtlcnJvcn1gKTtcclxuICAgICAgICB9KSkgKHN0b3JlX29iamVjdClcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUpzb24oaW5fanNvbil7XHJcbiAgICAgICAgcmV0dXJuIGluX2pzb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TW9kZWwobW9kZWwpe1xyXG4gICAgICAgIGlmKG1vZGVsIGluc3RhbmNlb2YgTW9kZWwpe1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldChkYXRhKXtcclxuICAgICAgICBpZih0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmFkZChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3Byb2Nlc3NfdXJsX18oZGF0YSkge1xyXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGEgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBzdHIgKz0gYCR7YX09JHtkYXRhW2FdfVxcJmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3JlamVjdGVkX3JlcG9uc2VfXyhzdG9yZSl7XHJcbiAgICAgICAgaWYoc3RvcmUpXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnByb2Nlc3NlZCBzdG9yZWQgZGF0YSBpbiBnZXR0ZXIuXCIpO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIF9fcHJvY2Vzc19yZXNwb25zZV9fKGpzb24sIHN0b3JlKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMucnVybCAmJiBqc29uKXtcclxuICAgICAgICAgICAgdmFyIHdhdGNoX3BvaW50cyA9IHRoaXMucnVybC5zcGxpdChcIjxcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgd2F0Y2hfcG9pbnRzLmxlbmd0aCAmJiBqc29uOyBpKyspe1xyXG4gICAgICAgICAgICAgICAganNvbiA9IGpzb25bcGFyc2VJbnQod2F0Y2hfcG9pbnRzW2ldKT9wYXJzZUludCh3YXRjaF9wb2ludHNbaV0pOndhdGNoX3BvaW50c1tpXV07XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb25cIiwganNvbilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXNwb25zZSA9IHt9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSByZXNwb25zZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIC8vcmVzdWx0KHJlcXVlc3QpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCl7XHJcbiAgICAgICAgICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gcGlwZSByZXNwb25zZXMgYXMgb2JqZWN0cyBjcmVhdGVkIGZyb20gd2VsbCBmb3JtdWxhdGVkIGRhdGEgZGlyZWN0bHkgaW50byB0aGUgbW9kZWwuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh0aGlzLnBhcnNlSnNvbihqc29uLCBzdG9yZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFRoZXJlIGlzIG5vIG1vZGVsIGF0dGFjaGVkIHRvIHRoaXMgcmVxdWVzdCBjb250cm9sbGVyIWApXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgR2V0dGVyXHJcbn1cclxuIiwiaW1wb3J0IHsgTGV4IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9jb21tb25cIlxyXG5cclxuaW1wb3J0IHsgU291cmNlQmFzZSB9IGZyb20gXCIuLi9iYXNlXCJcclxuXHJcbi8qKlxyXG4gICAgRGVhbHMgd2l0aCBzcGVjaWZpYyBwcm9wZXJ0aWVzIG9uIGEgbW9kZWwuIFxyXG4qL1xyXG5leHBvcnQgY2xhc3MgQ2Fzc2V0dGUgZXh0ZW5kcyBTb3VyY2VCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgZWxlbWVudCwgcHJlc2V0cywgZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIHByZXNldHMsIGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudG9wID0gMDtcclxuICAgICAgICB0aGlzLmxlZnQgPSAwO1xyXG4gICAgICAgIHRoaXMubHZsID0gMDtcclxuICAgICAgICB0aGlzLmlzID0gMTtcclxuICAgICAgICB0aGlzLmRhdGFfY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlLnRhZ05hbWUgPT0gXCJBXCIpXHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpbmsodGhpcy5lbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRzdHIoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZS50YWdOYW1lID09IFwiQVwiKVxyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lMaW5rKHRoaXMuZWxlKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhX2NhY2hlID0gbnVsbDtcclxuXHJcbiAgICAgICAgc3VwZXIuZHN0cigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRoaXMgd2lsbCBhdHRhY2ggYSBmdW5jdGlvbiB0byB0aGUgbGluayBlbGVtZW50IHRvIGludGVyY2VwdCBhbmQgcHJvY2VzcyBkYXRhIGZyb20gdGhlIGNhc3NldHRlLlxyXG4gICAgKi9cclxuICAgIHByb2Nlc3NMaW5rKGVsZW1lbnQsIGxpbmspIHtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50Lm9uY2xpY2spIGVsZW1lbnQub25jbGljayA9ICgoaHJlZiwgYSwgX19mdW5jdGlvbl9fKSA9PiAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChfX2Z1bmN0aW9uX18oaHJlZiwgYSkpIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KShlbGVtZW50LmhyZWYsIGVsZW1lbnQsIChocmVmLCBhKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgU0FNRV9MT0NBTEUgPSAobG9jYXRpb24ucGF0aG5hbWUgPT0gYS5wYXRobmFtZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGFzaHRhZyA9IGhyZWYuaW5jbHVkZXMoXCIjXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlYWxfaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGV4ID0gTGV4KGhyZWYpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGxleC50b2tlbikge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCA9PSBcIntcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSB0aGlzW3Byb3BdIHx8IHRoaXMuZGF0YV9jYWNoZVtwcm9wXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50b2tlbi50ZXh0ICE9IFwifVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYGluY29ycmVjdCB2YWx1ZSBmb3VuZCBpbiB1cmwgJHtocmVmfWApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxfaHJlZiArPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzaHRhZylcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhwb3J0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIVNBTUVfTE9DQUxFKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVMaW5rKHJlYWxfaHJlZik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9ICgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaHJlZiA9IGVsZW1lbnQuaHJlZjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWFsX2hyZWYgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxleCA9IExleChocmVmKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZXgudG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCA9PSBcIntcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSBsZXgudG9rZW4udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gdGhpc1twcm9wXSB8fCB0aGlzLmRhdGFfY2FjaGVbcHJvcF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgudG9rZW4udGV4dCAhPSBcIn1cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBpbmNvcnJlY3QgdmFsdWUgZm91bmQgaW4gdXJsICR7aHJlZn1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsX2hyZWYgKz0gbGV4LnRva2VuLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveUxpbmsoZWxlbWVudCkge1xyXG5cclxuICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBudWxsXHJcbiAgICAgICAgZWxlbWVudC5vbm1vdXNlb3ZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBfX0ZST01fUEFSRU5UX18gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBzdXBlci5fX3VwZGF0ZUV4cG9ydHNfXyhkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IGRhdGFbdGhpcy5wcm9wXTtcclxuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy5wcm9wXSA9IGRhdGFbdGhpcy5wcm9wXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YV9jYWNoZSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1wb3J0IChkYXRhKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUubG9hZChtb2RlbCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tb2RlbClcclxuICAgICAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURpbWVuc2lvbnMoKSB7XHJcblxyXG4gICAgICAgIHZhciBkID0gdGhpcy5lbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBkLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3AgPSBkLnRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBkLmxlZnQ7XHJcblxyXG4gICAgICAgIHN1cGVyLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENsb3NlQ2Fzc2V0dGUgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBwYXJlbnQuaGlkZSgpOyAvL09yIFVSTCBiYWNrO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTb3VyY2VCYXNlIH0gZnJvbSBcIi4vYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbC9tb2RlbFwiXHJcblxyXG5pbXBvcnQgeyBHZXR0ZXIgfSBmcm9tIFwiLi4vbmV0d29yay9nZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHsgQ2Fzc2V0dGUgfSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgU291cmNlIGV4dGVuZHMgU291cmNlQmFzZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU291cmNlIGNvbnN0cnVjdG9yLiBCdWlsZHMgYSBTb3VyY2Ugb2JqZWN0LlxyXG4gICAgICAgIEBwYXJhbXMgW0RPTUVsZW1lbnRdIGVsZW1lbnQgLSBBIERPTSA8dGVtcGxhdGU+IGVsZW1lbnQgdGhhdCBjb250YWlucyBhIDxjYXNlPiBlbGVtZW50LlxyXG4gICAgICAgIEBwYXJhbXMgW1JvdXRlclByZXNldHNdIHByZXNldHNcclxuICAgICAgICBAcGFyYW1zIFtTb3VyY2VdIHBhcmVudCAtIFRoZSBwYXJlbnQgU291cmNlIG9iamVjdCwgdXNlZCBpbnRlcm5hbGx5IHRvIGJ1aWxkIFNvdXJjZSdzIGluIGEgaGllcmFyY2h5XHJcbiAgICAgICAgQHBhcmFtcyBbTW9kZWxdIG1vZGVsIC0gQSBtb2RlbCB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNhc2UgaW5zdGVhZCBvZiBoYXZpbmcgb25lIGNyZWF0ZWQgb3IgcHVsbGVkIGZyb20gcHJlc2V0cy4gXHJcbiAgICAgICAgQHBhcmFtcyBbRE9NXSAgV09SS0lOR19ET00gLSBUaGUgRE9NIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRlbXBsYXRlcyB0byBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBjYXNlIG9iamVjdHMuIFxyXG4gICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIGRhdGEsIHByZXNldHMpIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cclxuICAgICAgICB0aGlzLlVTRV9TRUNVUkUgPSBwcmVzZXRzLlVTRV9IVFRQUztcclxuICAgICAgICB0aGlzLm5hbWVkX2VsZW1lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcm9wID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcclxuICAgICAgICB0aGlzLnJlY2VpdmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XHJcbiAgICAgICAgdGhpcy5SRVFVRVNUSU5HID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5leHBvcnRzID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGRzdHIoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVjZWl2ZXIpXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIuZHN0cigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbaV0uZHN0cigpO1xyXG5cclxuICAgICAgICBzdXBlci5kc3RyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2V0cyB1cCBNb2RlbCBjb25uZWN0aW9uIG9yIGNyZWF0ZXMgYSBuZXcgTW9kZWwgZnJvbSBhIHNjaGVtYS5cclxuICAgICovXHJcbiAgICBsb2FkKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgIC8vaW1wb3J0IHF1ZXJ5IGluZm8gZnJvbSB0aGUgd3VybFxyXG4gICAgICAgICAgICBsZXQgc3RyID0gdGhpcy5kYXRhLnVybDtcclxuICAgICAgICAgICAgbGV0IGNhc3NldHRlcyA9IHN0ci5zcGxpdChcIjtcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS51cmwgPSBjYXNzZXR0ZXNbMF07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNhc3NldHRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc3NldHRlID0gY2Fzc2V0dGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2Fzc2V0dGVbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cmxfcGFyZW50X2ltcG9ydCA9IGNhc3NldHRlLnNsaWNlKDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJxXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3F1ZXJ5ID0gY2Fzc2V0dGUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsX3JldHVybiA9IGNhc3NldHRlLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb3AgPSB0aGlzLmRhdGEucHJvcDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5leHBvcnQpIHRoaXMuZXhwb3J0cyA9IHRoaXMuZGF0YS5leHBvcnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbDtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobW9kZWwgJiYgbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBPcGluaW9uYXRlZCBTb3VyY2UgLSBPbmx5IGFjY2VwdHMgTW9kZWxzIHRoYXQgYXJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgaXRzIHNjaGVtYS4qL1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmNvbnN0cnVjdG9yICE9IHRoaXMuc2NoZW1hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aHJvdyBuZXcgRXJyb3IoYE1vZGVsIFNjaGVtYSAke3RoaXMubW9kZWwuc2NoZW1hfSBkb2VzIG5vdCBtYXRjaCBTb3VyY2UgU2NoZW1hICR7cHJlc2V0cy5zY2hlbWFzW3RoaXMuZGF0YS5zY2hlbWFdLnNjaGVtYX1gKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSlcclxuICAgICAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5zY2hlbWEoKTtcclxuXHJcbiAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZXIgPSBuZXcgR2V0dGVyKHRoaXMuZGF0YS51cmwsIHRoaXMudXJsX3JldHVybik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVyLnNldE1vZGVsKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19fX3JlcXVlc3RfX19fKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBNb2RlbCBjb3VsZCBiZSBmb3VuZCBmb3IgU291cmNlIGNvbnN0cnVjdG9yISBTb3VyY2Ugc2NoZW1hIFwiJHt0aGlzLmRhdGEuc2NoZW1hfVwiLCBcIiR7dGhpcy5wcmVzZXRzLnNjaGVtYXNbdGhpcy5kYXRhLnNjaGVtYV19XCI7IFNvdXJjZSBtb2RlbCBcIiR7dGhpcy5kYXRhLm1vZGVsfVwiLCBcIiR7dGhpcy5wcmVzZXRzLm1vZGVsc1t0aGlzLmRhdGEubW9kZWxdfVwiO2ApO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ubG9hZCh0aGlzLm1vZGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBfX19fcmVxdWVzdF9fX18ocXVlcnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlci5nZXQocXVlcnksIG51bGwsIHRoaXMuVVNFX1NFQ1VSRSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuUkVRVUVTVElORyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuUkVRVUVTVElORyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IChleHBvcnRzKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3Vicyh0aGlzLmNoaWxkcmVuLCBleHBvcnRzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc3VwZXIuZXhwb3J0KGV4cG9ydHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN1YnMoY2Fzc2V0dGVzLCBkYXRhLCBJTVBPUlQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNhc3NldHRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXNzZXR0ZSA9IGNhc3NldHRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYXNzZXR0ZSBpbnN0YW5jZW9mIFNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNhc3NldHRlLnVwZGF0ZShkYXRhLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcl92YWw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKElNUE9SVCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2Fzc2V0dGUuZGF0YS5pbXBvcnQgJiYgZGF0YVtjYXNzZXR0ZS5kYXRhLmltcG9ydF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcl92YWwgPSBjYXNzZXR0ZS51cGRhdGUoZGF0YSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocl92YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3VicyhjYXNzZXR0ZS5jaGlsZHJlbiwgcl92YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgT3ZlcnJpZGluZyB0aGUgbW9kZWwgZGF0YSBoYXBwZW5zIHdoZW4gYSBjYXNzZXR0ZSByZXR1cm5zIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC4gVGhpcyBpcyBhc3NpZ25lZCB0byB0aGUgXCJyX3ZhbFwiIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFueSBjaGlsZCBjYXNzZXR0ZSBvZiB0aGUgcmV0dXJuaW5nIGNhc3NldHRlIHdpbGwgYmUgZmVkIFwicl92YWxcIiBpbnN0ZWFkIG9mIFwiZGF0YVwiLlxyXG4gICAgICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJfdmFsID0gY2Fzc2V0dGUudXBkYXRlKGRhdGEsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnMoY2Fzc2V0dGUuY2hpbGRyZW4sIHJfdmFsIHx8IGRhdGEsIElNUE9SVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhLCBjaGFuZ2VkX3ZhbHVlcykge1xyXG4gICAgICAgIHRoaXMuX19kb3duX18oZGF0YSwgY2hhbmdlZF92YWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYW5kbGVVcmxVcGRhdGUod3VybCkge1xyXG4gICAgICAgIGxldCBxdWVyeV9kYXRhID0gbnVsbDtcclxuICAgICAgICAvKiBcclxuICAgICAgICAgICAgVGhpcyBwYXJ0IG9mIHRoZSBmdW5jdGlvbiB3aWxsIGltcG9ydCBkYXRhIGludG8gdGhlIG1vZGVsIHRoYXQgaXMgb2J0YWluZWQgZnJvbSB0aGUgcXVlcnkgc3RyaW5nIFxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKHd1cmwgJiYgdGhpcy5kYXRhLmltcG9ydCkge1xyXG4gICAgICAgICAgICBxdWVyeV9kYXRhID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW1wb3J0ID09IFwibnVsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeV9kYXRhID0gd3VybC5nZXRDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocXVlcnlfZGF0YSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy5kYXRhLmltcG9ydC5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbFtpXS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod3VybCAmJiB0aGlzLmRhdGEudXJsKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcXVlcnlfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy51cmxfcXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy51cmxfcXVlcnkuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IGxbaV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gblswXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IG5bMV0uc3BsaXQoXCI9PlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5X25hbWUgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRfbmFtZSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzX25hbWUgPT0gXCJyb290XCIpIGNsYXNzX25hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5X2RhdGFbaW1wb3J0X25hbWVdID0gd3VybC5nZXQoY2xhc3NfbmFtZSwga2V5X25hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fX19yZXF1ZXN0X19fXyhxdWVyeV9kYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IHRoaXMubW9kZWxfY29uc3RydWN0b3IoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldHRlci5zZXRNb2RlbCh0aGlzLm1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeV9kYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2RlbC5hZGQocXVlcnlfZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMubW9kZWwuZ2V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihpbmRleCA9IDApIHtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fdGltZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHN1cGVyLnRyYW5zaXRpb25JbihpbmRleCkpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBUYWtlcyBhcyBhbiBpbnB1dCBhIGxpc3Qgb2YgdHJhbnNpdGlvbiBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWRcclxuICAgICovXHJcbiAgICB0cmFuc2l0aW9uT3V0KGluZGV4ID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVtcGxhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgdHJhbnNpdGlvbl90aW1lID0gTWF0aC5tYXgodHJhbnNpdGlvbl90aW1lLCB0aGlzLnRlbXBsYXRlc1tpXS50cmFuc2l0aW9uT3V0KGluZGV4KSk7XHJcblxyXG4gICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dChpbmRleCwgREVTVFJPWSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplVHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2ldLmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICBzdXBlci5maW5hbGl6ZVRyYW5zaXRpb25PdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmF0aW5nKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0QWN0aXZhdGluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wX25hbWUgaW4gdGhpcy5uYW1lZF9lbGVtZW50cylcclxuICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXSA9IHRoaXMubmFtZWRfZWxlbWVudHNbY29tcF9uYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbVNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIGRhdGEsIHByZXNldHMpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZVwiXHJcblxyXG5jbGFzcyBGaWx0ZXIgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcblx0XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgcGFyZW50LmZpbHRlcl9saXN0LnB1c2goKGRhdGEpID0+IHRoaXMuZmlsdGVyKGRhdGEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIC8vYXBwbHkgYSBmaWx0ZXIgb2JqZWN0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBGaWx0ZXJcclxufSIsImltcG9ydCB7IFNvdXJjZSB9IGZyb20gXCIuL3NvdXJjZVwiXHJcblxyXG5pbXBvcnQgeyBGaWx0ZXIgfSBmcm9tIFwiLi9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5cclxuaW1wb3J0IHsgVGVybSB9IGZyb20gXCIuL2Nhc3NldHRlL3Rlcm1cIlxyXG5cclxuaW1wb3J0IHsgTUNBcnJheSwgTW9kZWxDb250YWluZXJCYXNlIH0gZnJvbSBcIi4uL21vZGVsL2NvbnRhaW5lci9iYXNlXCJcclxuXHJcbmltcG9ydCB7IE11bHRpSW5kZXhlZENvbnRhaW5lciB9IGZyb20gXCIuLi9tb2RlbC9jb250YWluZXIvbXVsdGlcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXJjZVRlbXBsYXRlIGV4dGVuZHMgU291cmNlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAgICBTb3VyY2VUZW1wbGF0ZSBjb25zdHJ1Y3Rvci4gQnVpbGRzIGEgU291cmNlVGVtcGxhdGUgb2JqZWN0LlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBkYXRhLCBwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZGF0YSwgcHJlc2V0cyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FzZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFjdGl2ZVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BfZWxlbWVudHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJVcGRhdGUoKSB7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLmNhc2VzLnNsaWNlKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoLCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmZpbHRlcnNbaV0uZmlsdGVyKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWN0aXZlU291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZS5yZW1vdmVDaGlsZCh0aGlzLmFjdGl2ZVNvdXJjZXNbaV0uZWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlLmFwcGVuZENoaWxkKG91dHB1dFtpXS5lbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUucG9zaXRpb24gPSB0aGlzLmVsZS5zdHlsZS5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIG91dHB1dFtpXS50cmFuc2l0aW9uSW4oaSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlU291cmNlcyA9IG91dHB1dDtcclxuICAgICAgICAvL1NvcnQgYW5kIGZpbHRlciB0aGUgb3V0cHV0IHRvIHByZXNlbnQgdGhlIHJlc3VsdHMgb24gc2NyZWVuLlxyXG4gICAgfVxyXG5cclxuICAgIGN1bGwobmV3X2l0ZW1zKSB7XHJcblxyXG4gICAgICAgIGlmIChuZXdfaXRlbXMubGVuZ3RoID09IDApIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRzdHIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FzZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBuZXcgTWFwKG5ld19pdGVtcy5tYXAoZSA9PiBbZSwgdHJ1ZV0pKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jYXNlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cy5oYXModGhpcy5jYXNlc1tpXS5tb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2ldLmRzdHIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2VzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzLnNldCh0aGlzLmNhc2VzW2ldLm1vZGVsLCBmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgZXhpc3RzLmZvckVhY2goKHYsIGssIG0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2KSBvdXQucHVzaChrKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3V0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGVkKG91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHt9XHJcblxyXG4gICAgcmVtb3ZlZChpdGVtcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jYXNlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IFNvdXJjZSA9IHRoaXMuY2FzZXNbal07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFNvdXJjZS5tb2RlbCA9PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNlcy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgU291cmNlLmRpc3NvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkZWQoaXRlbXMpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgU291cmNlID0gdGhpcy50ZW1wbGF0ZXNbMF0uZmxlc2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICBTb3VyY2UucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jYXNlcy5wdXNoKFNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmlzZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSlcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5jYWNoZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFRlcm1zKCkge1xyXG5cclxuICAgICAgICBsZXQgb3V0X3Rlcm1zID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIG91dF90ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0udGVybSk7XHJcblxyXG5cclxuICAgICAgICBpZiAob3V0X3Rlcm1zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dF90ZXJtcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSwgSU1QT1JUID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS50b0pzb24oKSlcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRhdGEuZ2V0Q2hhbmdlZCh0aGlzLnByb3ApO1xyXG5cclxuICAgICAgICBpZiAoSU1QT1JUKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgVVBEQVRFID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMudGVybXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFVQREFURSAmJiB0aGlzLm1vZGVsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1tpXS51cGRhdGUoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgVVBEQVRFID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChVUERBVEUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIgJiYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIE1vZGVsQ29udGFpbmVyQmFzZSB8fCBjb250YWluZXIuX19fX3NlbGZfX19fKSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3duX2NvbnRhaW5lciA9IGNvbnRhaW5lci5nZXQodGhpcy5nZXRUZXJtcygpLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvd25fY29udGFpbmVyIGluc3RhbmNlb2YgTW9kZWxDb250YWluZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLnBpbigpO1xyXG4gICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lci5hZGRWaWV3KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3duX2NvbnRhaW5lciBpbnN0YW5jZW9mIE1DQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VsbChvd25fY29udGFpbmVyKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3duX2NvbnRhaW5lciA9IGRhdGEuX19fX3NlbGZfX19fLmRhdGFbdGhpcy5wcm9wXVxyXG4gICAgICAgICAgICAgICAgaWYgKG93bl9jb250YWluZXIgaW5zdGFuY2VvZiBNb2RlbENvbnRhaW5lckJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBvd25fY29udGFpbmVyLmFkZFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWxsKHRoaXMuZ2V0KCkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsIGluc3RhbmNlb2YgTXVsdGlJbmRleGVkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBxdWVyeVtpbmRleF0gPSB0aGlzLmdldFRlcm1zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHF1ZXJ5KVtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gaW5kZXggdmFsdWUgcHJvdmlkZWQgZm9yIE11bHRpSW5kZXhlZENvbnRhaW5lciFcIilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgc291cmNlID0gdGhpcy5tb2RlbC5zb3VyY2U7XHJcbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHRoaXMuZ2V0VGVybXMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZHN0cigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNvdXJjZS5nZXQodGVybXMsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1vZGVsLnBpbigpO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KHRlcm1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbihlbGVtZW50cywgd3VybCkge1xyXG5cclxuICAgICAgICBsZXQgdHJhbnNpdGlvbl90aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25fdGltZSA9IE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgdGhpcy50ZW1wbGF0ZXNbaV0udHJhbnNpdGlvbkluKGVsZW1lbnRzLCB3dXJsKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbkluKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFRha2VzIGFzIGFuIGlucHV0IGEgbGlzdCBvZiB0cmFuc2l0aW9uIG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgKi9cclxuICAgIHRyYW5zaXRpb25PdXQodHJhbnNpdGlvbl90aW1lID0gMCwgREVTVFJPWSA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uX3RpbWUgPSBNYXRoLm1heCh0cmFuc2l0aW9uX3RpbWUsIHRoaXMudGVtcGxhdGVzW2ldLnRyYW5zaXRpb25PdXQoKSk7XHJcblxyXG4gICAgICAgIE1hdGgubWF4KHRyYW5zaXRpb25fdGltZSwgc3VwZXIudHJhbnNpdGlvbk91dCh0cmFuc2l0aW9uX3RpbWUsIERFU1RST1kpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25fdGltZTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBMZXggfSBmcm9tIFwiLi4vY29tbW9uL2NvbW1vblwiXHJcblxyXG5jbGFzcyBJbmRleGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5sZXhlciA9IG5ldyBMZXgoZWxlLmlubmVySFRNTCk7XHJcbiAgICAgICAgdGhpcy5lbGUgPSBlbGU7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3AgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChpbmRleCwgUkVETyA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCBsZXggPSB0aGlzLmxleGVyO1xyXG5cclxuICAgICAgICBpZiAoUkVETykge1xyXG4gICAgICAgICAgICBsZXgucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnNwID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIWxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUkVETylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoaW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGxleC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXgucGVlaygpLnRleHQgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyAvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIHRhZ25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTsgLy8gPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLS10aGlzLnNwIDwgMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2subGVuZ3RoID0gdGhpcy5zcCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2tbdGhpcy5zcF0rKztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpOyAvLyA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIHRhZ25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGxleC50ZXh0ICE9PSBcIj5cIiAmJiBsZXgudGV4dCAhPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vIGF0dHJpYiBuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGV4LnRleHQgPT0gXCI9XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxleC5uZXh0KCksIGxleC5uZXh0KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpIC8vIC8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpIC8vID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7IC8vID5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnN0YWNrLnB1c2goMCksIHRoaXMuc3ArKylcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4Lm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudGV4dCA9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxleC50ZXh0ID09IFwiOlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxleC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZXgudHlwZSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbnVtYmVyID0gcGFyc2VJbnQobGV4LnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWJlciA9PSBpbmRleCkgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBsZXgubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuW3RoaXMuc3RhY2tbaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICAgIFNvdXJjZSBza2VsZXRvblxyXG4gICAgICAgIE1vZGVsIHBvaW50ZXIgT1Igc2NoZW1hIHBvaW50ZXJcclxuICAgICAgICAgICAgSUYgc2NoZW1hLCB0aGVuIHRoZSBza2VsZXRvbiB3aWxsIGNyZWF0ZSBhIG5ldyBNb2RlbCB3aGVuIGl0IGlzIGNvcGllZCwgVU5MRVNTIGEgbW9kZWwgaXMgZ2l2ZW4gdG8gdGhlIHNrZWxldG9uIGNvcHkgQ29uc3RydWN0b3IuIFxyXG4gICAgICAgICAgICBPdGhlciB3aXNlLCB0aGUgc2tlbGV0b24gd2lsbCBhdXRvbWF0aWNhbGx5IGFzc2lnbiB0aGUgTW9kZWwgdG8gdGhlIGNhc2Ugb2JqZWN0LiBcclxuXHJcbiAgICAgICAgVGhlIG1vZGVsIHdpbGwgYXV0b21hdGljYWxseSBjb3B5IGl0J3MgZWxlbWVudCBkYXRhIGludG8gdGhlIGNvcHksIHppcHBpbmcgdGhlIGRhdGEgZG93biBhcyB0aGUgQ29uc3RydWN0b3IgYnVpbGRzIHRoZSBTb3VyY2UncyBjaGlsZHJlbi5cclxuXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBTb3VyY2VTa2VsZXRvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uc3RydWN0b3IsIGRhdGEsIHByZXNldHMsIGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5lbGUgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcbiAgICAgICAgdGhpcy5kID0gZGF0YTtcclxuICAgICAgICB0aGlzLnAgPSBwcmVzZXRzO1xyXG4gICAgICAgIHRoaXMuaSA9IGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgXHJcbiAgICAqL1xyXG4gICAgZmxlc2goTW9kZWwgPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IFNvdXJjZSA9IHRoaXMuX19fX2NvcHlfX19fKG51bGwsIG51bGwsIG51bGwpO1xyXG5cclxuICAgICAgICBTb3VyY2UubG9hZChNb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ29uc3RydWN0cyBhIG5ldyBvYmplY3QsIGF0dGFjaGluZyB0byBlbGVtZW50cyBob3N0ZWQgYnkgYSBjYXNlLiBJZiB0aGUgY29tcG9uZW50IHRvIGNvbnN0cnVjdCBpcyBhIFNvdXJjZSwgdGhlbiB0aGUgXHJcbiAgICAgICAgcGFyZW50X2VsZW1lbnQgZ2V0cyBzd2FwcGVkIG91dCBieSBhIGNsb25lZCBlbGVtZW50IHRoYXQgaXMgaG9zdGVkIGJ5IHRoZSBuZXdseSBjb25zdHJ1Y3RlZCBTb3VyY2UuXHJcbiAgICAqL1xyXG4gICAgX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBwYXJlbnQsIGluZGV4ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIENMQUlNRURfRUxFTUVOVCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pID4gMCkge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gaW5kZXhlci5nZXQodGhpcy5pKTtcclxuICAgICAgICAgICAgQ0xBSU1FRF9FTEVNRU5UID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZSkge1xyXG4gICAgICAgICAgICBwYXJlbnRfZWxlbWVudCA9IHRoaXMuZWxlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRfZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VOb2RlKHBhcmVudF9lbGVtZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGluZGV4ZXIgPSBuZXcgSW5kZXhlcihwYXJlbnRfZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3V0X29iamVjdDtcclxuICAgICAgICBpZiAodGhpcy5Db25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBvdXRfb2JqZWN0ID0gbmV3IHRoaXMuQ29uc3RydWN0b3IocGFyZW50LCB0aGlzLmQsIHRoaXMucCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChDTEFJTUVEX0VMRU1FTlQpXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LmVsZSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICghcGFyZW50KSB7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSB0aGlzLmNoaWxkcmVuWzBdLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcik7XHJcbiAgICAgICAgICAgIG91dF9vYmplY3QuZWxlID0gcGFyZW50X2VsZW1lbnQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhcmVudF9lbGVtZW50LmlubmVySFRNTClcclxuICAgICAgICAgICAgcmV0dXJuIG91dF9vYmplY3Q7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG91dF9vYmplY3QgPSBwYXJlbnQ7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fX19fY29weV9fX18ocGFyZW50X2VsZW1lbnQsIG91dF9vYmplY3QsIGluZGV4ZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy50ZXJtcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC50ZXJtcy5wdXNoKHRoaXMudGVybXNbaV0uX19fX2NvcHlfX19fKHBhcmVudF9lbGVtZW50LCBudWxsLCBpbmRleGVyKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0X29iamVjdC5maWx0ZXJzLnB1c2godGhpcy5maWx0ZXJzW2ldLl9fX19jb3B5X19fXyhwYXJlbnRfZWxlbWVudCwgbnVsbCwgaW5kZXhlcikpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgICAgICBvdXRfb2JqZWN0LnRlbXBsYXRlcy5wdXNoKHRoaXMudGVtcGxhdGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRfb2JqZWN0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtcclxuICAgIENhc3NldHRlXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuY2xhc3MgSW5wdXQgZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICAvL1NjYW4gdGhlIGVsZW1lbnQgYW5kIGxvb2sgZm9yIGlucHV0cyB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gdGhlXHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBlbGVtZW50LCBkLCBwKTtcclxuXHJcbiAgICAgICAgLy9JbnB1dHMgaW4gZm9ybXMgYXJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuLlxyXG4gICAgICAgIHRoaXMuZWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgICAgICAgICBkYXRhW3RoaXMucHJvcF0gPSB0aGlzLmVsZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5hZGQoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGFbdGhpcy5wcm9wXSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnZhbCA9IGRhdGFbdGhpcy5wcm9wXTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmVsZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS52YWx1ZSA9IChuZXcgRGF0ZShwYXJzZUludChkYXRhW3RoaXMucHJvcF0pKSkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRpbWVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlLnZhbHVlID0gYCR7KFwiMDBcIisoZGF0YVt0aGlzLnByb3BdIHwgMCkpLnNsaWNlKC0yKX06JHsoXCIwMFwiKygoZGF0YVt0aGlzLnByb3BdJTEpKjYwKSkuc2xpY2UoLTIpfTowMC4wMDBgO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS52YWx1ZSA9IChkYXRhW3RoaXMucHJvcF0gIT0gdW5kZWZpbmVkKSA/IGRhdGFbdGhpcy5wcm9wXSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHRoaXMuZWxlLmNsYXNzTGlzdFswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW9kdWxvX3RpbWVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBkYXRhW3RoaXMucHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJU19QTSA9ICh0aW1lIC8gMTIgPiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSAoKHRpbWUgJSAxKSAqIDYwKSB8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob3VycyA9ICgoKHRpbWUgfCAwKSAlIDEyKSAhPSAwKSA/ICh0aW1lIHwgMCkgJSAxMiA6IDEyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGUudmFsdWUgPSAoaG91cnMgKyBcIjpcIiArIChcIjBcIiArIG1pbnV0ZXMpLnNsaWNlKC0yKSkgKyAoKElTX1BNKSA/IFwiIFBNXCIgOiBcIiBBTVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlLnZhbHVlID0gKGRhdGFbdGhpcy5wcm9wXSAhPSB1bmRlZmluZWQpID8gZGF0YVt0aGlzLnByb3BdIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIElucHV0XHJcbn0iLCJpbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2lucHV0XCJcclxuXHJcbmltcG9ydCB7IENhc3NldHRlIH0gZnJvbSBcIi4vY2Fzc2V0dGVcIlxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcm0gZXh0ZW5kcyBDYXNzZXR0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGVsZW1lbnQsIGQsIHApIHtcclxuICAgICAgICAvL1NjYW4gdGhlIGVsZW1lbnQgYW5kIGxvb2sgZm9yIGlucHV0cyB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gdGhlIFxyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgZWxlbWVudCwgZCwgcCk7XHJcblxyXG4gICAgICAgIHRoaXMucm91dGVyID0gcC5yb3V0ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBudWxsO1xyXG5cclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQsIHRoaXMsIHBhcmVudClcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdWJtaXR0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZHN0cigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWNjZXB0ZWQocmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnRleHQoKS50aGVuKChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubG9hZE5ld1BhZ2UocmVzdWx0LnVybCwgKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGUsIFwidGV4dC9odG1sXCIpKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZWplY3RlZChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5sb2FkTmV3UGFnZShyZXN1bHQudXJsLCAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoZSwgXCJ0ZXh0L2h0bWxcIikpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobW9kZWwpIHtcclxuXHJcbiAgICAgICAgaWYgKG1vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG1vZGVsLnNjaGVtYTtcclxuXHJcbiAgICAgICAgc3VwZXIubG9hZChtb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5lbGUuYWN0aW9uO1xyXG5cclxuICAgICAgICB2YXIgZm9ybV9kYXRhID0gKG5ldyBGb3JtRGF0YSh0aGlzLmVsZSkpO1xyXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIElucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBjaGlsZC5lbGUubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGNoaWxkLnByb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjaGVtZSA9IHRoaXMuc2NoZW1hW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWUgJiYgcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gc2NoZW1lLnN0cmluZyhjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2RhdGEuc2V0KG5hbWUsIHZhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcCwgbmFtZSwgdmFsLCBjaGlsZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBmZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcInBvc3RcIixcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgICAgYm9keTogZm9ybV9kYXRhLFxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgIT0gMjAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWplY3RlZChyZXN1bHQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2VwdGVkKHJlc3VsdClcclxuXHJcbiAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZChlKTtcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2ljayBGb3JtIFN1Ym1pdHRlZFwiLCB1cmwsIGZvcm1fZGF0YSlcclxuXHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlldyB9IGZyb20gXCIuLi92aWV3L3ZpZXdcIlxyXG5cclxuaW1wb3J0IHsgQW55TW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuLyogVHJhbnNpdGlvbmVlcnMgKi9cclxuXHJcbmltcG9ydCB7IFRyYW5zaXRpb25lZXIgfSBmcm9tIFwiLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG5sZXQgUHJlc2V0VHJhbnNpdGlvbmVlcnMgPSB7IGJhc2U6IFRyYW5zaXRpb25lZXIgfVxyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGVCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBkYXRhID0ge30sIHByZXNldHMgPSB7fSkge1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkgdGhpcy5wYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKCl7XHJcbiAgICAgICAgLy8gTk8gT1BcclxuICAgIH1cclxuXHJcbiAgICBkc3RyKCkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQ2FsbGVkIGJ5ICBwYXJlbnQgd2hlbiBkYXRhIGlzIHVwZGF0ZSBhbmQgcGFzc2VkIGRvd24gZnJvbSBmdXJ0aGVyIHVwIHRoZSBncmFwaC4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGxldCByX3ZhbCA9IHRoaXMuZG93bihkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMsIElNUE9SVEVEKTtcclxuXHJcbiAgICAgICAgaWYgKHJfdmFsKShkYXRhID0gcl92YWwsIElNUE9SVEVEID0gdHJ1ZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18oZGF0YSwgY2hhbmdlZF9wcm9wZXJ0aWVzLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIElNUE9SVEVEKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIENhbGxlZCBieSAgcGFyZW50IHdoZW4gZGF0YSBpcyB1cGRhdGUgYW5kIHBhc3NlZCB1cCBmcm9tIGEgbGVhZi4gXHJcbiAgICAgICAgQHBhcmFtIHsoT2JqZWN0IHwgTW9kZWwpfSBkYXRhIC0gRGF0YSB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIGlzIHRvIGJlIHJlYWQuIFxyXG4gICAgICAgIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRfcHJvcGVydGllcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQuIFxyXG4gICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gSU1QT1JURUQgLSBUcnVlIGlmIHRoZSBkYXRhIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gdGhlIG1vZGVsIHdhdGNoZWQgYnkgdGhlIHBhcmVudCBTb3VyY2UuIEZhbHNlIG90aGVyd2lzZS5cclxuICAgICovXHJcbiAgICBfX3VwX18oZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KHVwKTtcclxuICAgIH1cclxuXHJcbiAgICB1cChkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuX191cF9fKGRhdGEpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBQaXBlQmFzZSB9IGZyb20gXCIuLi9waXBlX2Jhc2VcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFRhcCBleHRlbmRzIFBpcGVCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGRhdGEsIHByZXNldHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpO1xyXG4gICAgICAgIHRoaXMucHJvcCA9IGRhdGEucHJvcDtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcyA9IG51bGwsIGltcG9ydGVkKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZWRfcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoYW5nZWRfcHJvcGVydGllcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkX3Byb3BlcnRpZXNbaV0gPT0gdGhpcy5wcm9wKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW3RoaXMucHJvcF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGRhdGFbdGhpcy5wcm9wXSB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gbCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVt0aGlzLnByb3BdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZGF0YVt0aGlzLnByb3BdIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2VlIERlZmluaXRpb24gaW4gU291cmNlQmFzZSBcclxuICAgICovXHJcbiAgICBfX2Rvd25fXyhkYXRhLCBjaGFuZ2VkX3Byb3BlcnRpZXMgPSBudWxsLCBJTVBPUlRFRCA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IHJfdmFsID0gdGhpcy5kb3duKGRhdGEsIGNoYW5nZWRfcHJvcGVydGllcywgSU1QT1JURUQpO1xyXG4gICAgICAgIGlmIChyX3ZhbClcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX19kb3duX18ocl92YWwsIFt0aGlzLnByb3BdLCBJTVBPUlRFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoZGF0YS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSB7fTtcclxuICAgICAgICAgICAgb3V0W3RoaXMucHJvcF0gPSBkYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBQaXBlQmFzZSB9IGZyb20gXCIuLi9waXBlX2Jhc2VcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGUgZXh0ZW5kcyBQaXBlQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3duKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4geyB2YWx1ZTogYDxiPiR7ZGF0YS52YWx1ZX08L2I+YCB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBpcGUuQUREU19UQUdTID0gdHJ1ZTtcclxuUGlwZS5DQU5fQkVfU1RBVElDID0gdHJ1ZTsiLCJpbXBvcnQgeyBQaXBlQmFzZSB9IGZyb20gXCIuLi9waXBlX2Jhc2VcIlxyXG5cclxuLyoqIEBuYW1lc3BhY2UgSU8gKi9cclxuXHJcbi8qKlxyXG5cdFRoZSBJTyBpcyB0aGUgbGFzdCBsaW5rIGluIHRoZSBTb3VyY2UgY2hhaW4uIEl0IGlzIHJlc3BvbnNpYmxlIGZvciBwdXR0aW5nIGRhdGUgaW50byB0aGUgRE9NIHRocm91Z2ggaXQncyBjb25uZWN0ZWQgZWxlbWVudCwgYW5kIHByZXNlbnQgaXQgdG8gdGhlIHZpZXdlci4gXHJcblx0SXQgaXMgYWxzbyByZXNwb25zaWJsZSBmb3IgcmVzcG9uZGluZyB0byB1c2VyIGlucHV0LCB0aG91Z2ggdGhlIGJhc2UgSU8gb2JqZWN0IGRvZXMgbm90IHByb3ZpZGUgYW55IGNvZGUgZm9yIHRoYXQuIFxyXG4qL1xyXG5leHBvcnQgY2xhc3MgSU8gZXh0ZW5kcyBQaXBlQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzLCBlbGVtZW50ID0gbnVsbCkge1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUgIT09IFwiSU9cIikgcmV0dXJuIG5ldyBBdHRyaWJJTyhwYXJlbnQsIGRhdGEsIHByZXNldHMsIGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBzdXBlcihwYXJlbnQsIGRhdGEsIHByZXNldHMpXHJcbiAgICAgICAgdGhpcy5wcm9wID0gZGF0YS5wcm9wO1xyXG4gICAgICAgIHRoaXMuZWxlID0gZWxlbWVudDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZG93bihkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5lbGUuaW5uZXJIVE1MID0gZGF0YS52YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqIEBuYW1lc3BhY2UgSU8gKi9cclxuXHJcbi8qKlxyXG5cdFRoaXMgSU8gb2JqZWN0IHdpbGwgdXBkYXRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUgb2YgdGhlIHdhdGNoZWQgZWxlbWVudCwgdXNpbmcgdGhlIFwicHJvcFwiIHByb3BlcnR5IHRvIHNlbGVjdCB0aGUgYXR0cmlidXRlIHRvIHVwZGF0ZS5cclxuKi9cclxuZXhwb3J0IGNsYXNzIEF0dHJpYklPIGV4dGVuZHMgSU8ge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkYXRhLCBwcmVzZXRzLCBlbGVtZW50KSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBkYXRhLCBwcmVzZXRzKVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICAvL1JlbW92ZSB0aGUgaW5kZXggbWFya2VyXHJcbiAgICAgICAgZWxlbWVudC5jaGlsZE5vZGVzWzBdLmRhdGEgPSBlbGVtZW50LmNoaWxkTm9kZXNbMF0uZGF0YS5yZXBsYWNlKC9cXCNcXCNcXDpcXGQqXFxzLywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBcdFB1dHMgZGF0YSBpbnRvIHRoZSB3YXRjaGVkIGVsZW1lbnQncyBhdHRyaWJ1dGUuIFRoZSBkZWZhdWx0IGFjdGlvbiBpcyB0byBzaW1wbHkgdXBkYXRlIHRoZSBhdHRyaWJ1dGUgd2l0aCBkYXRhLnZhbHVlLiAgXHJcbiAgICAqL1xyXG4gICAgZG93bihkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcCA9PSBcInN0eWxlXCIpe1xyXG4gICAgICAgICAgICB0aGlzLmVsZS5zdHlsZSA9IGRhdGEudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lbGUuYXR0cmlidXRlc1t0aGlzLnByb3BdID0gZGF0YS52YWx1ZTtcclxuICAgIH1cclxufSIsIi8qXHJcbiAgICBCb3JpbmcgU291cmNlIHN0dWZmXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBTb3VyY2UsXHJcbn0gZnJvbSBcIi4vc291cmNlXCJcclxuXHJcbmltcG9ydCB7XHJcbiAgICBTb3VyY2VUZW1wbGF0ZVxyXG59IGZyb20gXCIuL3NvdXJjZV90ZW1wbGF0ZVwiXHJcbmltcG9ydCB7XHJcbiAgICBTb3VyY2VTa2VsZXRvblxyXG59IGZyb20gXCIuL3NvdXJjZV9za2VsZXRvblwiXHJcbi8qIFxyXG4gICAgQ2Fzc2V0dGVzXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBGaWx0ZXJMaW1pdFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlcl9saW1pdFwiXHJcbmltcG9ydCB7XHJcbiAgICBDYXNzZXR0ZSxcclxuICAgIENsb3NlQ2Fzc2V0dGVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9jYXNzZXR0ZVwiXHJcbmltcG9ydCB7XHJcbiAgICBGb3JtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZm9ybVwiXHJcbmltcG9ydCB7XHJcbiAgICBJbnB1dFxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2lucHV0XCJcclxuaW1wb3J0IHtcclxuICAgIEZpbHRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2ZpbHRlclwiXHJcbmltcG9ydCB7XHJcbiAgICBUZXJtXHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvdGVybVwiXHJcbmltcG9ydCB7XHJcbiAgICBFeHBvcnRlclxyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4cG9ydGVyXCJcclxuaW1wb3J0IHtcclxuICAgIEltcG9ydFF1ZXJ5XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvaW1wb3J0X3F1ZXJ5XCJcclxuaW1wb3J0IHtcclxuICAgIERhdGFFZGl0XHJcbn0gZnJvbSBcIi4vY2Fzc2V0dGUvZGF0YV9lZGl0XCJcclxuaW1wb3J0IHtcclxuICAgIEV4aXN0cyxcclxuICAgIE5vdEV4aXN0c1xyXG59IGZyb20gXCIuL2Nhc3NldHRlL2V4aXN0c1wiXHJcbmltcG9ydCB7XHJcbiAgICBFcG9jaERheSxcclxuICAgIEVwb2NoVGltZSxcclxuICAgIEVwb2NoRGF0ZSxcclxuICAgIEVwb2NoTW9udGgsXHJcbiAgICBFcG9jaFllYXIsXHJcbiAgICBFcG9jaFRvRGF0ZVRpbWVcclxufSBmcm9tIFwiLi9jYXNzZXR0ZS9lcG9jaFwiXHJcblxyXG5sZXQgUHJlc2V0Q2Fzc2V0dGVzID0ge1xyXG4gICAgcmF3OiBDYXNzZXR0ZSxcclxuICAgIGNhc3NldHRlOiBDYXNzZXR0ZSxcclxuICAgIGZvcm06IEZvcm0sXHJcbiAgICBpbnB1dDogSW5wdXQsXHJcbiAgICBleHBvcnQ6IEV4cG9ydGVyLFxyXG4gICAgaXF1ZXJ5OiBJbXBvcnRRdWVyeSxcclxuICAgIGVkdDogRXBvY2hUb0RhdGVUaW1lLFxyXG4gICAgZXRpbWU6IEVwb2NoVGltZSxcclxuICAgIGVkYXk6IEVwb2NoRGF5LFxyXG4gICAgZWRhdGU6IEVwb2NoRGF0ZSxcclxuICAgIGV5ZWFyOiBFcG9jaFllYXIsXHJcbiAgICBlbW9udGg6IEVwb2NoTW9udGgsXHJcbiAgICBleGlzdHM6IEV4aXN0cyxcclxuICAgIG5vdF9leGlzdHM6IE5vdEV4aXN0cyxcclxuICAgIGRhdGFfZWRpdDogRGF0YUVkaXQsXHJcbiAgICB0ZXJtOiBUZXJtLFxyXG4gICAgbGltaXQ6IEZpbHRlckxpbWl0XHJcbn1cclxuXHJcbmltcG9ydCB7IFRhcCB9IGZyb20gXCIuL3RhcHMvdGFwXCJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gXCIuL3BpcGVzL3BpcGVcIlxyXG5pbXBvcnQgeyBJTyB9IGZyb20gXCIuL2lvL2lvXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBSb290IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFnX2luZGV4ID0gMTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocHJlc2V0cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5odG1sO1xyXG4gICAgICAgIGxldCByb290X3NrZWxldG9uID0gbmV3IFNvdXJjZVNrZWxldG9uKGVsZW1lbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29uc3RydWN0U2tlbGV0b24ocm9vdF9za2VsZXRvbiwgcHJlc2V0cyk7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Rfc2tlbGV0b247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW5kZXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnX2luZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLmNoaWxkcmVuLFxyXG4gICAgICAgICAgICBodG1sOiB0aGlzLmh0bWxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2Zmc2V0KGluY3JlYXNlID0gMCkge1xyXG4gICAgICAgIGxldCBvdXQgPSB0aGlzLnRhZ19jb3VudDtcclxuICAgICAgICB0aGlzLnRhZ19jb3VudCArPSBpbmNyZWFzZTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJpY05vZGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgTWluaVBhcnNlLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcclxuICAgICAgICB0aGlzLklTX05VTEwgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5DT05TVU1FU19TQU1FID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMucHJvcF9uYW1lID0gbnVsbDtcclxuICAgICAgICB0aGlzLmh0bWwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuaW5kZXhfdGFnID0gXCJcIlxyXG4gICAgICAgIHRoaXMub3Blbl90YWcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY2xvc2VfdGFnID0gXCJcIjtcclxuICAgICAgICB0aGlzLnRhZ19pbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKHBhcmVudClcclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xyXG4gICAgICAgIGlmKE1pbmlQYXJzZSlcclxuICAgICAgICAgICAgdGhpcy50cmVlUGFyc2VBdHRyaWJ1dGVzKE1pbmlQYXJzZSwgcHJlc2V0cyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMub3Blbl90YWcgKyB0aGlzLmluZGV4X3RhZyArIHRoaXMuaHRtbCArIHRoaXMuY2xvc2VfdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGxhY2VDaGlsZChjaGlsZCwgbmV3X2NoaWxkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXSA9PSBjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXSA9IG5ld19jaGlsZDtcclxuICAgICAgICAgICAgICAgIG5ld19jaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldID09IGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRhcE5vZGUgJiYgISh0aGlzIGluc3RhbmNlb2YgU291cmNlTm9kZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hZGRDaGlsZChjaGlsZCk7XHJcblxyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJQcm9wKG5hbWUpe1xyXG4gICAgICAgIGlmKCF0aGlzLnByb3BfbmFtZSkgdGhpcy5wcm9wX25hbWUgPSBuYW1lO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnNldEF0dHJpYlByb3AobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJlZVBhcnNlQXR0cmlidXRlcyhNaW5pUGFyc2UsIHByZXNldHMpe1xyXG4gICAgICAgICBmb3IgKGxldCBhIGluIHRoaXMuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmliID0gdGhpcy5hdHRyaWJ1dGVzW2FdO1xyXG4gICAgICAgICAgICBpZiAoYXR0cmliWzBdID09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb290ID0gbmV3IFNvdXJjZU5vZGUoXCJcIiwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgcm9vdC50YWdfaW5kZXggPSB0aGlzLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleF90YWcgPSBcIiMjOlwiICsgdGhpcy5pbmRleCArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN1Yl90cmVlID0gTWluaVBhcnNlKGF0dHJpYiwgcm9vdCwgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSByb290LmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuc2V0QXR0cmliUHJvcChhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQXR0cmlidXRlcygpIHtcclxuICAgICAgICBsZXQgb3V0ID0ge307XHJcbiAgICAgICAgb3V0LnByb3AgPSB0aGlzLnByb3BfbmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wX25hbWUgIT09IHByb3BfbmFtZSlcclxuICAgICAgICAgICAgdGhpcy5zcGxpdChuZXcgSU9Ob2RlKHByb3BfbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsLCB0aGlzLCB0aGlzLmdldEluZGV4KCkpLCBwcm9wX25hbWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbmV3IElPTm9kZShwcm9wX25hbWUsIHRoaXMuYXR0cmlidXRlcywgdGhpcywgdGhpcywgdGhpcy5nZXRJbmRleCgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgIHRhZ25hbWU6IHRoaXMudGFnbmFtZSxcclxuICAgICAgICAgICAgdGFnX2NvdW50OiB0aGlzLnRhZ19jb3VudCxcclxuICAgICAgICAgICAgdGFnOiB7IG9wZW5fdGFnOiB0aGlzLm9wZW5fdGFnLCBjbG9zZV90YWc6IHRoaXMuY2xvc2VfdGFnIH0sXHJcbiAgICAgICAgICAgIGh0bWw6IHRoaXMuaHRtbCxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQobm9kZSwgcHJvcF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcF9uYW1lID09IHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnRhZ25hbWUsIHRoaXMuYXR0cmlidXRlcywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgci5DT05TVU1FU19TQU1FID0gKHIuQ09OU1VNRVNfVEFHKSA/ICghKHIuQ09OU1VNRVNfVEFHID0gITEpKSA6ICExO1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHJvcF9uYW1lID0gcHJvcF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHIuYWRkQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHIsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wX25hbWUgPSBwcm9wX25hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zcGxpdCh0aGlzLCBwcm9wX25hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcF9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcF9uYW1lID09IHRoaXMucHJvcF9uYW1lKSB7fSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgciA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMudGFnbmFtZSwgdGhpcy5hdHRyaWJ1dGVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByLnByb3BfbmFtZSA9IHByb3BfbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuc3BsaXQociwgcHJvcF9uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNwbGl0KHRoaXMsIHByb3BfbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldEluZGV4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRhZ19pbmRleCA+IDApIHJldHVybiB0aGlzLnRhZ19pbmRleCsrO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkgdGhpcy5pbmRleCA9IHRoaXMucGFyZW50LmdldEluZGV4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0U2tlbGV0b24ocGFyZW50X3NrZWxldG9uLCBwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIGxldCBza2VsZXRvbiA9IHRoaXMuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgcGFyZW50X3NrZWxldG9uLmNoaWxkcmVuLnB1c2goc2tlbGV0b24pXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb25zdHJ1Y3RTa2VsZXRvbihza2VsZXRvbiwgcHJlc2V0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IFNvdXJjZVNrZWxldG9uKHRoaXMuZ2V0RWxlbWVudCgpLCB0aGlzLmdldENvbnN0cnVjdG9yKHByZXNldHMpLCB0aGlzLnBhcnNlQXR0cmlidXRlcygpLCBwcmVzZXRzLCB0aGlzLmluZGV4KTtcclxuICAgICAgICByZXR1cm4gc2tlbGV0b247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXJjZU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHtcclxuICAgICAgICBjdHguaHRtbCArPSB0aGlzLmh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgaWYgKGxleGVyLnRleHQgPT0gXCIoXCIgJiYgbGV4ZXIucGVlaygpLnRleHQgPT0gXCIoXCIpIHtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKFwiKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlTm9kZShcImxpc3RcIiwgdGhpcy5hdHRyaWJ1dGVzLCB0aGlzLCB0aGlzKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUucGFyc2UobGV4ZXIsIHBhcnNlRnVuY3Rpb24sIHByZXNldHMpO1xyXG4gICAgICAgICAgICBsZXhlci5hc3NlcnQoXCIpXCIpO1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiKVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIFNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdChub2RlLCBwcm9wX25hbWUpIHtcclxuICAgICAgICBpZiAobm9kZSkgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgY3R4KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xyXG4gICAgICAgIGN0eC5odG1sICs9IGA8bGlzdD4jIzoke3RoaXMuaW5kZXh9PC9saXN0PmBcclxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcm1zID0gW107XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBGaWx0ZXJOb2RlKVxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUZXJtTm9kZSlcclxuICAgICAgICAgICAgdGhpcy50ZXJtcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzLmxlbmd0aCA+IDApIHRocm93IG5ldyBFcnJvcihcIk9ubHkgb25lIFNvdXJjZSBhbGxvd2VkIGluIGEgVGVtcGxhdGUuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQudGFnX2luZGV4ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5odG1sID0gY2hpbGQuaHRtbDtcclxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiVGVtcGxhdGVzIG9ubHkgc3VwcG9ydCBGaWx0ZXIsIFRlcm0gb3IgU291cmNlIGVsZW1lbnRzLlwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdFNrZWxldG9uKHBhcmVudF9za2VsZXRvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuaHRtbDtcclxuICAgICAgICBsZXQgc2tlbGV0b24gPSBuZXcgU291cmNlU2tlbGV0b24odGhpcy5nZXRFbGVtZW50KCksIFNvdXJjZVRlbXBsYXRlLCB0aGlzLnBhcnNlQXR0cmlidXRlcygpLCBwcmVzZXRzLCB0aGlzLmluZGV4KTtcclxuICAgICAgICBza2VsZXRvbi5maWx0ZXJzID0gdGhpcy5maWx0ZXJzLm1hcCgoZmlsdGVyKSA9PiBmaWx0ZXIuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKSlcclxuICAgICAgICBza2VsZXRvbi50ZXJtcyA9IHRoaXMudGVybXMubWFwKCh0ZXJtKSA9PiB0ZXJtLmNyZWF0ZVNrZWxldG9uQ29uc3RydWN0b3IocHJlc2V0cykpXHJcbiAgICAgICAgc2tlbGV0b24udGVtcGxhdGVzID0gdGhpcy50ZW1wbGF0ZXMubWFwKCh0ZW1wbGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2tsID0gdGVtcGxhdGUuY3JlYXRlU2tlbGV0b25Db25zdHJ1Y3RvcihwcmVzZXRzKTtcclxuICAgICAgICAgICAgc2tsLmVsZSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBza2w7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBwYXJlbnRfc2tlbGV0b24uY2hpbGRyZW4ucHVzaChza2VsZXRvbilcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlzdFwiKTtcclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb3AobGV4ZXIsIHByb3BfbmFtZSwgcGFyc2VGdW5jdGlvbiwgcHJlc2V0cykge1xyXG4gICAgICAgIC8vY3R4Lmh0bWwgKz0gcHJvcF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKGxleGVyLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHsgaHRtbDogXCJcIiB9O1xyXG4gICAgICAgIGxldCByb290ID0gbmV3IFJvb3QoKTtcclxuICAgICAgICB3aGlsZSAobGV4ZXIudGV4dCAhPT0gXCIpXCIgJiYgbGV4ZXIucGVlaygpLnRleHQgIT09IFwiKVwiKSB7XHJcbiAgICAgICAgICAgIGlmICghbGV4ZXIudGV4dCkgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgT3V0cHV0LiBNaXNzaW5nICcpKScgXCIpO1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gcGFyc2VGdW5jdGlvbihsZXhlciwgdGhpcywgcHJlc2V0cyk7XHJcbiAgICAgICAgICAgIGlmIChvdXQgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5odG1sID0gb3V0Lmh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG5cclxuICAgICAgICBpZiAobm9kZSlcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChub2RlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnX2NvdW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFwTm9kZSBleHRlbmRzIEdlbmVyaWNOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbmFsaXplKGN0eCkge1xyXG4gICAgICAgIGN0eC5odG1sICs9IHRoaXMuaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFRhcDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWx0ZXJOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICB0aGlzLkNPTlNVTUVTX1RBRyA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHt9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBUYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnByb3AgPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVybU5vZGUgZXh0ZW5kcyBHZW5lcmljTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcih0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaW5hbGl6ZShjdHgpIHt9XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBUYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvcChsZXhlciwgcHJvcF9uYW1lLCBwYXJzZUZ1bmN0aW9uLCBwcmVzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnByb3AgPSBwcm9wX25hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGVOb2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZmluYWxpemUoY3R4LCBwcmVzZXRzKSB7XHJcbiAgICAgICAgY3R4Lmh0bWwgKz0gdGhpcy5odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnN0cnVjdG9yKHByZXNldHMsIGZpbmFsaXppbmcgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IFBpcGU7XHJcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KG5vZGUsIHByb3BfbmFtZSkge1xyXG4gICAgICAgIGlmICghKHRoaXMucGFyZW50IGluc3RhbmNlb2YgUGlwZU5vZGUpICYmXHJcbiAgICAgICAgICAgICEodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBUYXBOb2RlKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvL05lZWQgYSBUYXBOb2RlIHRvIGNvbXBsZXRlIHRoZSBwaXBlbGluZVxyXG4gICAgICAgICAgICBsZXQgdGFwID0gbmV3IFRhcE5vZGUoXCJcIiwge30sIG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMucHJvcF9uYW1lID0gdGhpcy5wcm9wX25hbWU7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlcGxhY2VDaGlsZCh0aGlzLCB0YXApO1xyXG4gICAgICAgICAgICB0YXAuYWRkQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5zcGxpdChub2RlLCBwcm9wX25hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSU9Ob2RlIGV4dGVuZHMgR2VuZXJpY05vZGUge1xyXG4gICAgY29uc3RydWN0b3IocHJvcF9uYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIGN0eCwgaW5kZXgpIHtcclxuICAgICAgICBzdXBlcihcIlwiLCBudWxsLCBwYXJlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICBjdHguaHRtbCArPSBgPGlvIHByb3A9XCIke3Byb3BfbmFtZX1cIj4jIzoke2luZGV4fTwvaW8+YFxyXG4gICAgICAgIHRoaXMuQ09OU1VNRVNfVEFHID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZ2V0Q29uc3RydWN0b3IocHJlc2V0cykge1xyXG4gICAgICAgIHJldHVybiBJTztcclxuICAgIH1cclxufSIsImltcG9ydCB7IExleCB9IGZyb20gXCIuLi9jb21tb24vY29tbW9uXCJcclxuXHJcbmltcG9ydCAqIGFzIEFTVCBmcm9tIFwiLi9zb3VyY2VfY29uc3RydWN0b3JfYXN0XCJcclxuXHJcbi8qXHJcbiAgICBUaGlzIGZ1bmN0aW9uJ3Mgcm9sZSBpcyB0byBjb25zdHJ1Y3QgYSBjYXNlIHNrZWxldG9uIGdpdmVuIGEgdGVtcGxhdGUsIGEgbGlzdCBvZiBwcmVzZXRzLCBhbmQgXHJcbiAgICBhbmQgb3B0aW9uYWxseSBhIHdvcmtpbmcgRE9NLiBUaGlzIHdpbGwgcmV0dXJuIFNvdXJjZSBTa2VsZXRvbiB0aGF0IGNhbiBiZSBjbG9uZWQgaW50byBhIG5ldyBTb3VyY2Ugb2JqZWN0LiBcclxuXHJcbiAgICBAcGFyYW0ge0hUTUxFbGVtZW50fSBUZW1wbGF0ZVxyXG4gICAgQHBhcmFtIHtQcmVzZXRzfSBwcmVzZXRzIFxyXG4gICAgQHBhcmFtIHtET01FbGVtZW50fSBXT1JLSU5HX0RPTSAtIFNob3VsZCBpbmNsdWRlIGFueSBvdGhlciB0ZW1wbGF0ZXMgdGhhdCBuZWVkIHRvIGJlIHJvbGxlZCBpbi4gXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBTb3VyY2VDb25zdHJ1Y3RvcihUZW1wbGF0ZSwgUHJlc2V0cywgV09SS0lOR19ET00pIHtcclxuXHJcbiAgICBsZXQgc2tlbGV0b247XHJcblxyXG4gICAgaWYgKCFUZW1wbGF0ZSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBpZiAoVGVtcGxhdGUuc2tlbGV0b24pXHJcbiAgICAgICAgcmV0dXJuIFRlbXBsYXRlLnNrZWxldG9uO1xyXG5cclxuXHJcbiAgICAvL1RFbXBsYXRlIEZpbHRyYXRpb24gaGFuZGxlZCBoZXJlLlxyXG4gICAgLy9JbXBvcnQgdGhlIFxyXG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKFRlbXBsYXRlLCB0cnVlKTtcclxuXHJcbiAgICBza2VsZXRvbiA9IENvbXBvbmVudENvbnN0cnVjdG9yKGVsZW1lbnQsIFByZXNldHMsIFdPUktJTkdfRE9NKTtcclxuXHJcbiAgICBpZiAoIXNrZWxldG9uKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgIFRlbXBsYXRlLnNrZWxldG9uID0gKChza2VsZXRvbikgPT4gKG1vZGVsKSA9PiBza2VsZXRvbi5mbGVzaChtb2RlbCkpKHNrZWxldG9uKTtcclxuXHJcbiAgICByZXR1cm4gVGVtcGxhdGUuc2tlbGV0b247XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBDb21wb25lbnRDb25zdHJ1Y3RvcihlbGVtZW50LCBwcmVzZXRzLCBXT1JLSU5HX0RPTSkge1xyXG5cclxuICAgIGxldCBhdHRyaWJ1dGVzID0gW107XHJcbiAgICBsZXQgcHJvcHMgPSBbXTtcclxuXHJcbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIlRFTVBMQVRFXCIpIHtcclxuICAgICAgICBsZXQgY29tcG9uZW50X25hbWUgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBsZXhlciA9IExleChpbnB1dCk7XHJcblxyXG4gICAgICAgIC8vTWFrZSBzdXJlIHdlIGFyZSBzdGFydGluZyB3aXRoIGEgY2FzZSBvYmplY3QuIFxyXG5cclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIjxcIikge1xyXG4gICAgICAgICAgICAvL29mZiB0byBhIGdvb2Qgc3RhcnRcclxuICAgICAgICAgICAgbGV0IHJvb3QgPSBuZXcgQVNULlJvb3QoKTtcclxuICAgICAgICAgICAgUGFyc2VUYWcobGV4ZXIsIHJvb3QsIHByZXNldHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm9vdC5jb25zdHJ1Y3RTa2VsZXRvbihwcmVzZXRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gTWluaVBhcnNlKHN0cmluZywgcm9vdCwgcHJlc2V0cyl7XHJcbiAgICBjb25zdCBsZXhlciA9IExleChzdHJpbmcpO1xyXG4gICAgaWYgKGxleGVyLnRleHQgPT0gXCI8XCIpIHtcclxuICAgICAgICBQYXJzZVRhZyhsZXhlciwgcm9vdCwgcHJlc2V0cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICAgIEhhbmRsZXMgdGhlIHNlbGVjdGlvbiBvZiBBU1Qgbm9kZXMgYmFzZWQgb24gdGFnbmFtZTtcclxuICAgIFxyXG4gICAgQHBhcmFtIHtMZXhlcn0gbGV4ZXIgLSBUaGUgbGV4aWNhbCBwYXJzZXIgXHJcbiAgICBAcGFyYW0ge1N0cmluZ30gdGFnbmFtZSAtIFRoZSBlbGVtZW50cyB0YWduYW1lXHJcbiAgICBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICAgQHBhcmFtIHtDQ0FzdE5vZGV9IHBhcmVudFxyXG4qL1xyXG5mdW5jdGlvbiBEaXNwYXRjaChsZXhlciwgdGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50LCBwcmVzZXRzKSB7XHJcbiAgICBsZXQgYXN0O1xyXG4gICAgc3dpdGNoICh0YWduYW1lKSB7XHJcbiAgICAgICAgLyogVGFwcyAqL1xyXG4gICAgICAgIGNhc2UgXCJ3XCI6XHJcbiAgICAgICAgY2FzZSBcInctYVwiOlxyXG4gICAgICAgIGNhc2UgXCJ3X2FcIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5UYXBOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgY2FzZSBcInctZmlsdGVyXCI6XHJcbiAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuRmlsdGVyTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LXRlcm1cIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5UZXJtTm9kZSh0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXN0O1xyXG4gICAgICAgIGNhc2UgXCJ3LWNcIjpcclxuICAgICAgICBjYXNlIFwid19jXCI6XHJcbiAgICAgICAgY2FzZSBcInctY2FzZVwiOlxyXG4gICAgICAgIGNhc2UgXCJ3X2Nhc2VcIjpcclxuICAgICAgICAgICAgYXN0ID0gbmV3IEFTVC5Tb3VyY2VOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgaWYgKHRhZ25hbWVbMF0gPT0gXCJ3XCIpIHtcclxuICAgICAgICAgICAgICAgIGFzdCA9IG5ldyBBU1QuUGlwZU5vZGUodGFnbmFtZSwgYXR0cmlidXRlcywgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBhc3QgPSBuZXcgQVNULkdlbmVyaWNOb2RlKHRhZ25hbWUsIGF0dHJpYnV0ZXMsIHBhcmVudCwgTWluaVBhcnNlLCBwcmVzZXRzKTtcclxuICAgIHJldHVybiBhc3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgcGFyc2luZyBvZiBIVE1MIHRhZ3MgYW5kIGNvbnRlbnRcclxuICAgIEBwYXJhbSB7U3RyaW5nfSB0YWduYW1lXHJcbiAgICBAcGFyYW0ge09iamVjdH0gY3R4XHJcbiAgICBAcGFyYW0ge0NDQXN0Tm9kZX0gcGFyZW50XHJcbiovXHJcbmZ1bmN0aW9uIFBhcnNlVGFnKGxleGVyLCBwYXJlbnQsIHByZXNldHMpIHtcclxuICAgIGxldCBzdGFydCA9IGxleGVyLnBvcztcclxuICAgIGxldCBhdHRyaWJ1dGVzID0ge307XHJcblxyXG4gICAgbGV4ZXIuYXNzZXJ0KFwiPFwiKVxyXG5cclxuICAgIGxldCB0YWduYW1lID0gbGV4ZXIudGV4dDtcclxuXHJcbiAgICBpZiAobGV4ZXIudHlwZSA9PSBcImlkZW50aWZpZXJcIikge1xyXG4gICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICBHZXRBdHRyaWJ1dGVzKGxleGVyLCBhdHRyaWJ1dGVzKTtcclxuICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRhZy1uYW1lIGlkZW50aWZpZXIsIGdvdCAke2xleGVyLnRleHR9YCk7XHJcblxyXG4gICAgbGV0IGVsZSA9IERpc3BhdGNoKGxleGVyLCB0YWduYW1lLCBhdHRyaWJ1dGVzLCBwYXJlbnQsIHByZXNldHMpO1xyXG5cclxuICAgIGVsZS5vcGVuX3RhZyArPSBsZXhlci5zbGljZShzdGFydCk7XHJcblxyXG4gICAgc3RhcnQgPSBsZXhlci50b2tlbi5wb3M7XHJcblxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFsZXhlci50ZXh0KVxyXG4gICAgICAgICAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIGVuZCBvZiBvdXRwdXRcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobGV4ZXIudGV4dCkge1xyXG4gICAgICAgICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxleGVyLnBlZWsoKS50ZXh0ID09IFwiL1wiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5odG1sICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBsZXhlci5wb3M7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vU2hvdWxkIGJlIGNsb3NpbmcgaXQncyBvd24gdGFnLlxyXG4gICAgICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIjxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQodGFnbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdXQgPSBsZXhlci5wb3MgKyAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXhlci5hc3NlcnQoXCI+XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGUuY2xvc2VfdGFnID0gbGV4ZXIuc2xpY2Uoc3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGUuZmluYWxpemUocGFyZW50IHx8IHsgaHRtbDogXCJcIiB9LCBwcmVzZXRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gUGFyc2VUYWcobGV4ZXIsIGVsZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIltcIjpcclxuICAgICAgICAgICAgICAgIGVsZS5odG1sICs9IGxleGVyLnNsaWNlKHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKVxyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BfbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KClcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gbGV4ZXIucG9zICsgMTtcclxuICAgICAgICAgICAgICAgIGxleGVyLmFzc2VydChcIl1cIik7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IGVsZS5hZGRQcm9wKGxleGVyLCBwcm9wX25hbWUsIFBhcnNlVGFnLCBwcmVzZXRzKSB8fCBzdGFydDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICAgIFJldHVybnMgYWxsIGF0dHJpYnV0ZXMgaW4gYW4gZWxlbWVudCBhcyBhIGtleS12YWx1ZSBvYmplY3QuXHJcblxyXG4gICAgQHBhcmFtIHtMZXhlcn0gbGV4ZXIgLSBUaGUgbGV4aWNhbCBwYXJzZXIgIFxyXG4gICAgQHBhcmFtIHtPYmplY3R9IGF0dGlicyAtIEFuIG9iamVjdCB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIGF0dHJpYnV0ZSBrZXlzIGFuZCB2YWx1ZXMuIFxyXG4qL1xyXG5mdW5jdGlvbiBHZXRBdHRyaWJ1dGVzKGxleGVyLCBhdHRyaWJzKSB7XHJcbiAgICB3aGlsZSAobGV4ZXIudGV4dCAhPT0gXCI+XCIgJiYgbGV4ZXIudGV4dCAhPT0gXCIvXCIpIHtcclxuICAgICAgICBpZiAoIWxleGVyLnRleHQpIHRocm93IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgaW5wdXQuXCIpO1xyXG4gICAgICAgIGxldCBhdHRyaWJfbmFtZSA9IGxleGVyLnRleHQ7XHJcbiAgICAgICAgbGV0IGF0dHJpYl92YWwgPSBudWxsO1xyXG4gICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICBpZiAobGV4ZXIudGV4dCA9PSBcIj1cIikge1xyXG4gICAgICAgICAgICBsZXhlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChsZXhlci50b2tlbi50eXBlID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYl92YWwgPSBsZXhlci50ZXh0LnNsaWNlKDEsIC0xKTtcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RpbmcgYXR0cmlidXRlIGRlZmluaXRpb24uXCIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgYXR0cmlic1thdHRyaWJfbmFtZV0gPSBhdHRyaWJfdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsZXhlci50ZXh0ID09IFwiL1wiKSAvLyBWb2lkIE5vZGVzXHJcbiAgICAgICAgbGV4ZXIuYXNzZXJ0KFwiL1wiKTtcclxuICAgIGxleGVyLmFzc2VydChcIj5cIik7XHJcbn0iLCJpbXBvcnQge1xyXG4gICAgVmlld1xyXG59IGZyb20gXCIuLi92aWV3L3ZpZXdcIlxyXG4vKipcclxuICogVGhpcyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgcmVxdWVzdHMgdG8gdGhlIHNlcnZlci4gSXQgY2FuIGFjdCBhcyBhIGNvbnRyb2xsZXIgdG8gc3BlY2lmaWNhbGx5IHB1bGwgZGF0YSBkb3duIGZyb20gdGhlIHNlcnZlciBhbmQgcHVzaCBpbnRvIGRhdGEgbWVtYmVycy5cclxuICpcclxuICoge25hbWV9IFJlcXVlc3RlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNldHRlciBleHRlbmRzIFZpZXcge1xyXG4gICAgY29uc3RydWN0b3IodXJsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3RydWN0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQocmVxdWVzdF9vYmplY3QpIHtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnVybCArICggKHJlcXVlc3Rfb2JqZWN0KSA/IChcIj9cIiArIHRoaXMuX19wcm9jZXNzX3VybF9fKHJlcXVlc3Rfb2JqZWN0KSkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgZmV0Y2godXJsLCBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAocmVzcG9uc2UuanNvbigpLnRoZW4oKGopPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHJvY2Vzc19yZXNwb25zZV9fKGopO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBwcm9jZXNzIHJlc3BvbnNlIGZvciByZXF1ZXN0IG1hZGUgdG86ICR7dGhpcy51cmx9LiBSZXNwb25zZTogJHtlcnJvcn0uIEVycm9yIFJlY2VpdmVkOiAke2Vycm9yfWApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VKc29uKGluX2pzb24pe1xyXG4gICAgICAgIHJldHVybiBpbl9qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc191cmxfXyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgYSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBgJHthfT0ke2RhdGFbYV19XFwmYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcHJvY2Vzc19yZXNwb25zZV9fKGpzb24pIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7fVxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gcmVzcG9uc2UudGFyZ2V0O1xyXG5cclxuICAgICAgICAvL3Jlc3VsdChyZXF1ZXN0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwpe1xyXG5cclxuICAgICAgICAgICAgLy9zaG91bGQgYmUgYWJsZSB0byBwaXBlIHJlc3BvbnNlcyBhcyBvYmplY3RzIGNyZWF0ZWQgZnJvbSB3ZWxsIGZvcm11bGF0ZWQgZGF0YSBkaXJlY3RseSBpbnRvIHRoZSBtb2RlbC5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMucGFyc2VKc29uKGpzb24pKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubW9kZWwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gcHJvY2VzcyByZXNwb25zZSBmb3IgcmVxdWVzdCBtYWRlIHRvOiAke3RoaXMudXJsfS4gVGhlcmUgaXMgbm8gbW9kZWwgYXR0YWNoZWQgdG8gdGhpcyByZXF1ZXN0IGNvbnRyb2xsZXIhYClcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7XHJcbiAgICBUdXJuUXVlcnlJbnRvRGF0YSxcclxuICAgIFR1cm5EYXRhSW50b1F1ZXJ5LFxyXG4gICAgUXVlcnlTdHJpbmdUb1F1ZXJ5TWFwLFxyXG4gICAgUXVlcnlNYXBUb1F1ZXJ5U3RyaW5nXHJcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi91cmwvdXJsXCJcclxuXHJcbmNsYXNzIFdVUkwge1xyXG4gICAgY29uc3RydWN0b3IobG9jYXRpb24pe1xyXG4gICAgICAgIC8vcGFyc2UgdGhlIHVybCBpbnRvIGRpZmZlcmVudCBzZWN0aW9uc1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lO1xyXG4gICAgICAgIHRoaXMuaG9zdCA9IGxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgICAgIHRoaXMucXVlcnkgPSBRdWVyeVN0cmluZ1RvUXVlcnlNYXAobG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQYXRoKHBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExvY2F0aW9uKCl7XHJcbiAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sXCJyZXBsYWNlZCBzdGF0ZVwiLGAke3RoaXN9YCk7XHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhdGh9PyR7UXVlcnlNYXBUb1F1ZXJ5U3RyaW5nKHRoaXMucXVlcnkpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2xhc3MoY2xhc3NfbmFtZSl7XHJcblxyXG4gICAgICAgIGlmKCFjbGFzc19uYW1lKSBjbGFzc19uYW1lID0gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb3V0ID0ge30sIGNsYXNzXztcclxuXHJcbiAgICAgICAgaWYoY2xhc3NfID0gdGhpcy5xdWVyeS5nZXQoY2xhc3NfbmFtZSkpe1xyXG4gICAgICAgICAgICBmb3IobGV0IFtrZXksIHZhbF0gb2YgY2xhc3NfLmVudHJpZXMoKSl7XHJcbiAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQoY2xhc3NfbmFtZSwga2V5X25hbWUsIHZhbHVlKXtcclxuXHJcbiAgICAgICAgaWYoIWNsYXNzX25hbWUpIGNsYXNzX25hbWUgPSBudWxsO1xyXG5cclxuICAgICAgICBpZighdGhpcy5xdWVyeS5oYXMoY2xhc3NfbmFtZSkpIHRoaXMucXVlcnkuc2V0KGNsYXNzX25hbWUsIG5ldyBNYXAoKSk7XHJcblxyXG4gICAgICAgIGxldCBjbGFzc18gPSB0aGlzLnF1ZXJ5LmdldChjbGFzc19uYW1lKTtcclxuXHJcbiAgICAgICAgY2xhc3NfLnNldChrZXlfbmFtZSwgdmFsdWUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGNsYXNzX25hbWUsIGtleV9uYW1lKXtcclxuICAgICAgICBpZighY2xhc3NfbmFtZSkgY2xhc3NfbmFtZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBjbGFzc18gPSB0aGlzLnF1ZXJ5LmdldChjbGFzc19uYW1lKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoY2xhc3NfKSA/IGNsYXNzXy5nZXQoa2V5X25hbWUpIDogbnVsbDsgIFxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBXVVJMXHJcbn1cclxuIiwiLypcclxuXHRIYW5kbGVzIHRoZSBwYXJzaW5nIGFuZCBsb2FkaW5nIG9mIGNvbXBvbmVudHMgZm9yIGEgcGFydGljdWxhciBwYWdlLlxyXG4qL1xyXG5leHBvcnQgY2xhc3MgUGFnZVZpZXcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFVSTCwgYXBwX3BhZ2UpIHtcclxuXHJcbiAgICAgICAgdGhpcy51cmwgPSBVUkw7XHJcbiAgICAgICAgdGhpcy5lbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3ZpZXcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFwibm9ybWFsXCI7XHJcbiAgICAgICAgaWYgKCFhcHBfcGFnZSkgZGVidWdnZXJcclxuICAgICAgICB0aGlzLmVsZSA9IGFwcF9wYWdlO1xyXG4gICAgICAgIHRoaXMuZWxlX2JhY2tlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlc1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5kZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWxlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvYWQodHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5MT0FERUQgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlc1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5nZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudW5sb2FkQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uT3V0KHRyYW5zaXRpb25zKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lID0gMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZXMubGVuZ3RoOyBpKyspIFxyXG4gICAgICAgICAgICB0aW1lID0gTWF0aC5tYXgodGltZSwgdGhpcy5lbGVzW2ldLnRyYW5zaXRpb25PdXQodHJhbnNpdGlvbnMpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemUoKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuTE9BREVEKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmZpbmFsaXplKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGUucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5lbGUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChhcHBfZWxlbWVudCwgd3VybCkge1xyXG5cclxuICAgICAgICB0aGlzLkxPQURFRCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZXNbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQubG9hZENvbXBvbmVudHMod3VybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZSk7XHJcblxyXG4gICAgICAgIHZhciB0ID0gdGhpcy5lbGUuc3R5bGUub3BhY2l0eTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uSW4odHJhbnNpdGlvbnMpIHtcclxuXHJcbiAgICAgICAgbGV0IGZpbmFsX3RpbWUgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFwibW9kYWxcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZWxlX2JhY2tlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVfYmFja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlX2JhY2tlci5jbGFzc0xpc3QuYWRkKFwibW9kYWxfYmFja2VyXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS5hcHBlbmRDaGlsZCh0aGlzLmVsZV9iYWNrZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZS5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSwgNTApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlc1tpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldFRyYW5zZm9ybVRvKHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVzW2ldO1xyXG4gICAgICAgICAgICBlbGVtZW50LmdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJlQ29tcG9uZW50cygpIHtcclxuICAgICAgICAvL1RoaXMgd2lsbCB0cmFuc2l0aW9uIG9iamVjdHNcclxuICAgIH1cclxuXHJcbiAgICBzZXRUeXBlKHR5cGUpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IFwibm9ybWFsXCI7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICpcdENvbnZlcnRzIGxpbmtzIGludG8gSmF2YWNyaXB0IGVuYWJsZWQgYnV0dG9ucyB0aGF0IHdpbGwgYmUgaGFuZGxlZCB3aXRoaW4gdGhlIGN1cnJlbnQgQWN0aXZlIHBhZ2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBQYXJlbnQgRWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSA8YT4gZWxlbWVudHMgdG8gYmUgZXZhdWxhdGVkIGJ5IGZ1bmN0aW9uLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBfX2Z1bmN0aW9uX18gLSBBIGZ1bmN0aW9uIHRoZSBsaW5rIHdpbGwgY2FsbCB3aGVuIGl0IGlzIGNsaWNrZWQgYnkgdXNlci4gSWYgaXQgcmV0dXJucyBmYWxzZSwgdGhlIGxpbmsgd2lsbCBhY3QgbGlrZSBhIG5vcm1hbCA8YT4gZWxlbWVudCBhbmQgY2F1c2UgdGhlIGJyb3dzZXIgdG8gbmF2aWdhdGUgdG8gdGhlIFwiaHJlZlwiIHZhbHVlLlxyXG4gKlxyXG4gKiBJZiB0aGUgPGE+IGVsZW1lbnQgaGFzIGEgZGF0YS1pZ25vcmVfbGluayBhdHRyaWJ1dGUgc2V0IHRvIGEgdHJ1dGh5IHZhbHVlLCB0aGVuIHRoaXMgZnVuY3Rpb24gd2lsbCBub3QgY2hhbmdlIHRoZSB3YXkgdGhhdCBsaW5rIG9wZXJhdGVzLlxyXG4gKiBMaWtld2lzZSwgaWYgdGhlIDxhPiBlbGVtZW50IGhhcyBhIGhyZWYgdGhhdCBwb2ludHMgYW5vdGhlciBkb21haW4sIHRoZW4gdGhlIGxpbmsgd2lsbCByZW1haW4gdW5hZmZlY3RlZC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMaW5rcyhlbGVtZW50LCBfX2Z1bmN0aW9uX18pIHtcclxuICAgIGxldCBsaW5rcyA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5rcy5sZW5ndGgsIHRlbXAsIGhyZWY7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBsZXQgdGVtcCA9IGxpbmtzW2ldO1xyXG5cclxuICAgICAgICBpZiAodGVtcC5kYXRhc2V0Lmlnbm9yZV9saW5rKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXAub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXAub25jbGljaykgdGVtcC5vbmNsaWNrID0gKChocmVmLCBhLCBfX2Z1bmN0aW9uX18pID0+IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKF9fZnVuY3Rpb25fXyhocmVmLCBhKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pKHRlbXAuaHJlZiwgdGVtcCwgX19mdW5jdGlvbl9fKTtcclxuICAgIH1cclxufTtcclxuIiwiaW1wb3J0IHsgTGV4IH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tb25cIlxyXG5cclxuY2xhc3MgQ29sb3IgZXh0ZW5kcyBGbG9hdDY0QXJyYXkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHIsIGcsIGIsIGEgPSAwKSB7XHJcbiAgICAgICAgc3VwZXIoNClcclxuXHJcbiAgICAgICAgdGhpcy5yID0gMDtcclxuICAgICAgICB0aGlzLmcgPSAwO1xyXG4gICAgICAgIHRoaXMuYiA9IDA7XHJcbiAgICAgICAgdGhpcy5hID0gMTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihyKSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJvbVN0cmluZyhyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnIgPSByIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChyKSwyNTUpLC0yNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmcgPSBnIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChnKSwyNTUpLC0yNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmIgPSBiIC8vTWF0aC5tYXgoTWF0aC5taW4oTWF0aC5yb3VuZChiKSwyNTUpLC0yNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhIC8vTWF0aC5tYXgoTWF0aC5taW4oYSwxKSwtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCByKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByKHIpIHtcclxuICAgICAgICB0aGlzWzBdID0gcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1sxXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZyhnKSB7XHJcbiAgICAgICAgdGhpc1sxXSA9IGc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbMl07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGIoYikge1xyXG4gICAgICAgIHRoaXNbMl0gPSBiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzWzNdO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBhKGEpIHtcclxuICAgICAgICB0aGlzWzNdID0gYTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQoY29sb3IpIHtcclxuICAgICAgICB0aGlzLnIgPSBjb2xvci5yO1xyXG4gICAgICAgIHRoaXMuZyA9IGNvbG9yLmc7XHJcbiAgICAgICAgdGhpcy5iID0gY29sb3IuYjtcclxuICAgICAgICB0aGlzLmEgPSAoY29sb3IuYSAhPSB1bmRlZmluZWQpID8gY29sb3IuYSA6IHRoaXMuYTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoY29sb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICBjb2xvci5yICsgdGhpcy5yLFxyXG4gICAgICAgICAgICBjb2xvci5nICsgdGhpcy5nLFxyXG4gICAgICAgICAgICBjb2xvci5iICsgdGhpcy5iLFxyXG4gICAgICAgICAgICBjb2xvci5hICsgdGhpcy5hXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIG11bHQoY29sb3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mKGNvbG9yKSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnIgKiBjb2xvcixcclxuICAgICAgICAgICAgICAgIHRoaXMuZyAqIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5iICogY29sb3IsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmEgKiBjb2xvclxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgICAgIHRoaXMuciAqIGNvbG9yLnIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmcgKiBjb2xvci5nLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5iICogY29sb3IuYixcclxuICAgICAgICAgICAgICAgIHRoaXMuYSAqIGNvbG9yLmFcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdWIoY29sb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICB0aGlzLnIgLSBjb2xvci5yLFxyXG4gICAgICAgICAgICB0aGlzLmcgLSBjb2xvci5nLFxyXG4gICAgICAgICAgICB0aGlzLmIgLSBjb2xvci5iLFxyXG4gICAgICAgICAgICB0aGlzLmEgLSBjb2xvci5hXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBgcmdiYSgke3RoaXMucnwwfSwgJHt0aGlzLmd8MH0sICR7dGhpcy5ifDB9LCAke3RoaXMuYX0pYDtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tU3RyaW5nKHN0cmluZykge1xyXG5cclxuICAgICAgICBsZXQgbGV4ZXIgPSBMZXgoc3RyaW5nKVxyXG5cclxuICAgICAgICBsZXQgciwgZywgYiwgYTtcclxuICAgICAgICBzd2l0Y2ggKGxleGVyLnRva2VuLnRleHQpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBjYXNlIFwicmdiXCI6XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCkgLy8gKFxyXG4gICAgICAgICAgICAgICAgciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpIC8vICxcclxuICAgICAgICAgICAgICAgIGcgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKSAvLyAsXHJcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh7IHIsIGcsIGIgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJyZ2JhXCI6XHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCkgLy8gKFxyXG4gICAgICAgICAgICAgICAgciA9IHBhcnNlSW50KGxleGVyLm5leHQoKS50ZXh0KVxyXG4gICAgICAgICAgICAgICAgbGV4ZXIubmV4dCgpIC8vICxcclxuICAgICAgICAgICAgICAgIGcgPSBwYXJzZUludChsZXhlci5uZXh0KCkudGV4dClcclxuICAgICAgICAgICAgICAgIGxleGVyLm5leHQoKSAvLyAsXHJcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VJbnQobGV4ZXIubmV4dCgpLnRleHQpXHJcbiAgICAgICAgICAgICAgICBsZXhlci5uZXh0KCkgLy8gLFxyXG4gICAgICAgICAgICAgICAgYSA9IHBhcnNlRmxvYXQobGV4ZXIubmV4dCgpLnRleHQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh7IHIsIGcsIGIsIGEgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBsZXhlci5uZXh0KCkudGV4dDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ29sb3IuY29sb3JzW3N0cmluZ10pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoQ29sb3IuY29sb3JzW3N0cmluZ10gfHwgbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDAuMDAwMSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5Db2xvci5jb2xvcnMgPSB7XHJcbiAgICBcInRyYW5zcGFyZW50XCI6IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjAwMDEpLFxyXG4gICAgXCJjbGVhclwiOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC4wMDAxKSxcclxuICAgIFwicmVkXCI6IG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgXCJncmVlblwiOiBuZXcgQ29sb3IoMCwgMjU1LCAwKSxcclxuICAgIFwiYmx1ZVwiOiBuZXcgQ29sb3IoMCwgMCwgMjU1KSxcclxuICAgIFwiQmxhY2tcIjogbmV3IENvbG9yKDAsIDAsIDApLFxyXG4gICAgXCJXaGl0ZVwiOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSksXHJcbiAgICBcIndoaXRlXCI6IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KSxcclxuICAgIFwiUmVkXCI6IG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgXCJMaW1lXCI6IG5ldyBDb2xvcigwLCAyNTUsIDApLFxyXG4gICAgXCJCbHVlXCI6IG5ldyBDb2xvcigwLCAwLCAyNTUpLFxyXG4gICAgXCJZZWxsb3dcIjogbmV3IENvbG9yKDI1NSwgMjU1LCAwKSxcclxuICAgIFwiQ3lhblwiOiBuZXcgQ29sb3IoMCwgMjU1LCAyNTUpLFxyXG4gICAgXCJBcXVhXCI6IG5ldyBDb2xvcigwLCAyNTUsIDI1NSksXHJcbiAgICBcIk1hZ2VudGFcIjogbmV3IENvbG9yKDI1NSwgMCwgMjU1KSxcclxuICAgIFwiRnVjaHNpYVwiOiBuZXcgQ29sb3IoMjU1LCAwLCAyNTUpLFxyXG4gICAgXCJTaWx2ZXJcIjogbmV3IENvbG9yKDE5MiwgMTkyLCAxOTIpLFxyXG4gICAgXCJHcmF5XCI6IG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4KSxcclxuICAgIFwiTWFyb29uXCI6IG5ldyBDb2xvcigxMjgsIDAsIDApLFxyXG4gICAgXCJPbGl2ZVwiOiBuZXcgQ29sb3IoMTI4LCAxMjgsIDApLFxyXG4gICAgXCJHcmVlblwiOiBuZXcgQ29sb3IoMCwgMTI4LCAwKSxcclxuICAgIFwiUHVycGxlXCI6IG5ldyBDb2xvcigxMjgsIDAsIDEyOCksXHJcbiAgICBcIlRlYWxcIjogbmV3IENvbG9yKDAsIDEyOCwgMTI4KSxcclxuICAgIFwiTmF2eVwiOiBuZXcgQ29sb3IoMCwgMCwgMTI4KSxcclxuICAgIFwibWFyb29uXCI6IG5ldyBDb2xvcigxMjgsIDAsIDApLFxyXG4gICAgXCJkYXJrIHJlZFwiOiBuZXcgQ29sb3IoMTM5LCAwLCAwKSxcclxuICAgIFwiYnJvd25cIjogbmV3IENvbG9yKDE2NSwgNDIsIDQyKSxcclxuICAgIFwiZmlyZWJyaWNrXCI6IG5ldyBDb2xvcigxNzgsIDM0LCAzNCksXHJcbiAgICBcImNyaW1zb25cIjogbmV3IENvbG9yKDIyMCwgMjAsIDYwKSxcclxuICAgIFwicmVkXCI6IG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgXCJ0b21hdG9cIjogbmV3IENvbG9yKDI1NSwgOTksIDcxKSxcclxuICAgIFwiY29yYWxcIjogbmV3IENvbG9yKDI1NSwgMTI3LCA4MCksXHJcbiAgICBcImluZGlhbiByZWRcIjogbmV3IENvbG9yKDIwNSwgOTIsIDkyKSxcclxuICAgIFwibGlnaHQgY29yYWxcIjogbmV3IENvbG9yKDI0MCwgMTI4LCAxMjgpLFxyXG4gICAgXCJkYXJrIHNhbG1vblwiOiBuZXcgQ29sb3IoMjMzLCAxNTAsIDEyMiksXHJcbiAgICBcInNhbG1vblwiOiBuZXcgQ29sb3IoMjUwLCAxMjgsIDExNCksXHJcbiAgICBcImxpZ2h0IHNhbG1vblwiOiBuZXcgQ29sb3IoMjU1LCAxNjAsIDEyMiksXHJcbiAgICBcIm9yYW5nZSByZWRcIjogbmV3IENvbG9yKDI1NSwgNjksIDApLFxyXG4gICAgXCJkYXJrIG9yYW5nZVwiOiBuZXcgQ29sb3IoMjU1LCAxNDAsIDApLFxyXG4gICAgXCJvcmFuZ2VcIjogbmV3IENvbG9yKDI1NSwgMTY1LCAwKSxcclxuICAgIFwiZ29sZFwiOiBuZXcgQ29sb3IoMjU1LCAyMTUsIDApLFxyXG4gICAgXCJkYXJrIGdvbGRlbiByb2RcIjogbmV3IENvbG9yKDE4NCwgMTM0LCAxMSksXHJcbiAgICBcImdvbGRlbiByb2RcIjogbmV3IENvbG9yKDIxOCwgMTY1LCAzMiksXHJcbiAgICBcInBhbGUgZ29sZGVuIHJvZFwiOiBuZXcgQ29sb3IoMjM4LCAyMzIsIDE3MCksXHJcbiAgICBcImRhcmsga2hha2lcIjogbmV3IENvbG9yKDE4OSwgMTgzLCAxMDcpLFxyXG4gICAgXCJraGFraVwiOiBuZXcgQ29sb3IoMjQwLCAyMzAsIDE0MCksXHJcbiAgICBcIm9saXZlXCI6IG5ldyBDb2xvcigxMjgsIDEyOCwgMCksXHJcbiAgICBcInllbGxvd1wiOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDApLFxyXG4gICAgXCJ5ZWxsb3cgZ3JlZW5cIjogbmV3IENvbG9yKDE1NCwgMjA1LCA1MCksXHJcbiAgICBcImRhcmsgb2xpdmUgZ3JlZW5cIjogbmV3IENvbG9yKDg1LCAxMDcsIDQ3KSxcclxuICAgIFwib2xpdmUgZHJhYlwiOiBuZXcgQ29sb3IoMTA3LCAxNDIsIDM1KSxcclxuICAgIFwibGF3biBncmVlblwiOiBuZXcgQ29sb3IoMTI0LCAyNTIsIDApLFxyXG4gICAgXCJjaGFydCByZXVzZVwiOiBuZXcgQ29sb3IoMTI3LCAyNTUsIDApLFxyXG4gICAgXCJncmVlbiB5ZWxsb3dcIjogbmV3IENvbG9yKDE3MywgMjU1LCA0NyksXHJcbiAgICBcImRhcmsgZ3JlZW5cIjogbmV3IENvbG9yKDAsIDEwMCwgMCksXHJcbiAgICBcImdyZWVuXCI6IG5ldyBDb2xvcigwLCAxMjgsIDApLFxyXG4gICAgXCJmb3Jlc3QgZ3JlZW5cIjogbmV3IENvbG9yKDM0LCAxMzksIDM0KSxcclxuICAgIFwibGltZVwiOiBuZXcgQ29sb3IoMCwgMjU1LCAwKSxcclxuICAgIFwibGltZSBncmVlblwiOiBuZXcgQ29sb3IoNTAsIDIwNSwgNTApLFxyXG4gICAgXCJsaWdodCBncmVlblwiOiBuZXcgQ29sb3IoMTQ0LCAyMzgsIDE0NCksXHJcbiAgICBcInBhbGUgZ3JlZW5cIjogbmV3IENvbG9yKDE1MiwgMjUxLCAxNTIpLFxyXG4gICAgXCJkYXJrIHNlYSBncmVlblwiOiBuZXcgQ29sb3IoMTQzLCAxODgsIDE0MyksXHJcbiAgICBcIm1lZGl1bSBzcHJpbmcgZ3JlZW5cIjogbmV3IENvbG9yKDAsIDI1MCwgMTU0KSxcclxuICAgIFwic3ByaW5nIGdyZWVuXCI6IG5ldyBDb2xvcigwLCAyNTUsIDEyNyksXHJcbiAgICBcInNlYSBncmVlblwiOiBuZXcgQ29sb3IoNDYsIDEzOSwgODcpLFxyXG4gICAgXCJtZWRpdW0gYXF1YSBtYXJpbmVcIjogbmV3IENvbG9yKDEwMiwgMjA1LCAxNzApLFxyXG4gICAgXCJtZWRpdW0gc2VhIGdyZWVuXCI6IG5ldyBDb2xvcig2MCwgMTc5LCAxMTMpLFxyXG4gICAgXCJsaWdodCBzZWEgZ3JlZW5cIjogbmV3IENvbG9yKDMyLCAxNzgsIDE3MCksXHJcbiAgICBcImRhcmsgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoNDcsIDc5LCA3OSksXHJcbiAgICBcInRlYWxcIjogbmV3IENvbG9yKDAsIDEyOCwgMTI4KSxcclxuICAgIFwiZGFyayBjeWFuXCI6IG5ldyBDb2xvcigwLCAxMzksIDEzOSksXHJcbiAgICBcImFxdWFcIjogbmV3IENvbG9yKDAsIDI1NSwgMjU1KSxcclxuICAgIFwiY3lhblwiOiBuZXcgQ29sb3IoMCwgMjU1LCAyNTUpLFxyXG4gICAgXCJsaWdodCBjeWFuXCI6IG5ldyBDb2xvcigyMjQsIDI1NSwgMjU1KSxcclxuICAgIFwiZGFyayB0dXJxdW9pc2VcIjogbmV3IENvbG9yKDAsIDIwNiwgMjA5KSxcclxuICAgIFwidHVycXVvaXNlXCI6IG5ldyBDb2xvcig2NCwgMjI0LCAyMDgpLFxyXG4gICAgXCJtZWRpdW0gdHVycXVvaXNlXCI6IG5ldyBDb2xvcig3MiwgMjA5LCAyMDQpLFxyXG4gICAgXCJwYWxlIHR1cnF1b2lzZVwiOiBuZXcgQ29sb3IoMTc1LCAyMzgsIDIzOCksXHJcbiAgICBcImFxdWEgbWFyaW5lXCI6IG5ldyBDb2xvcigxMjcsIDI1NSwgMjEyKSxcclxuICAgIFwicG93ZGVyIGJsdWVcIjogbmV3IENvbG9yKDE3NiwgMjI0LCAyMzApLFxyXG4gICAgXCJjYWRldCBibHVlXCI6IG5ldyBDb2xvcig5NSwgMTU4LCAxNjApLFxyXG4gICAgXCJzdGVlbCBibHVlXCI6IG5ldyBDb2xvcig3MCwgMTMwLCAxODApLFxyXG4gICAgXCJjb3JuIGZsb3dlciBibHVlXCI6IG5ldyBDb2xvcigxMDAsIDE0OSwgMjM3KSxcclxuICAgIFwiZGVlcCBza3kgYmx1ZVwiOiBuZXcgQ29sb3IoMCwgMTkxLCAyNTUpLFxyXG4gICAgXCJkb2RnZXIgYmx1ZVwiOiBuZXcgQ29sb3IoMzAsIDE0NCwgMjU1KSxcclxuICAgIFwibGlnaHQgYmx1ZVwiOiBuZXcgQ29sb3IoMTczLCAyMTYsIDIzMCksXHJcbiAgICBcInNreSBibHVlXCI6IG5ldyBDb2xvcigxMzUsIDIwNiwgMjM1KSxcclxuICAgIFwibGlnaHQgc2t5IGJsdWVcIjogbmV3IENvbG9yKDEzNSwgMjA2LCAyNTApLFxyXG4gICAgXCJtaWRuaWdodCBibHVlXCI6IG5ldyBDb2xvcigyNSwgMjUsIDExMiksXHJcbiAgICBcIm5hdnlcIjogbmV3IENvbG9yKDAsIDAsIDEyOCksXHJcbiAgICBcImRhcmsgYmx1ZVwiOiBuZXcgQ29sb3IoMCwgMCwgMTM5KSxcclxuICAgIFwibWVkaXVtIGJsdWVcIjogbmV3IENvbG9yKDAsIDAsIDIwNSksXHJcbiAgICBcImJsdWVcIjogbmV3IENvbG9yKDAsIDAsIDI1NSksXHJcbiAgICBcInJveWFsIGJsdWVcIjogbmV3IENvbG9yKDY1LCAxMDUsIDIyNSksXHJcbiAgICBcImJsdWUgdmlvbGV0XCI6IG5ldyBDb2xvcigxMzgsIDQzLCAyMjYpLFxyXG4gICAgXCJpbmRpZ29cIjogbmV3IENvbG9yKDc1LCAwLCAxMzApLFxyXG4gICAgXCJkYXJrIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDcyLCA2MSwgMTM5KSxcclxuICAgIFwic2xhdGUgYmx1ZVwiOiBuZXcgQ29sb3IoMTA2LCA5MCwgMjA1KSxcclxuICAgIFwibWVkaXVtIHNsYXRlIGJsdWVcIjogbmV3IENvbG9yKDEyMywgMTA0LCAyMzgpLFxyXG4gICAgXCJtZWRpdW0gcHVycGxlXCI6IG5ldyBDb2xvcigxNDcsIDExMiwgMjE5KSxcclxuICAgIFwiZGFyayBtYWdlbnRhXCI6IG5ldyBDb2xvcigxMzksIDAsIDEzOSksXHJcbiAgICBcImRhcmsgdmlvbGV0XCI6IG5ldyBDb2xvcigxNDgsIDAsIDIxMSksXHJcbiAgICBcImRhcmsgb3JjaGlkXCI6IG5ldyBDb2xvcigxNTMsIDUwLCAyMDQpLFxyXG4gICAgXCJtZWRpdW0gb3JjaGlkXCI6IG5ldyBDb2xvcigxODYsIDg1LCAyMTEpLFxyXG4gICAgXCJwdXJwbGVcIjogbmV3IENvbG9yKDEyOCwgMCwgMTI4KSxcclxuICAgIFwidGhpc3RsZVwiOiBuZXcgQ29sb3IoMjE2LCAxOTEsIDIxNiksXHJcbiAgICBcInBsdW1cIjogbmV3IENvbG9yKDIyMSwgMTYwLCAyMjEpLFxyXG4gICAgXCJ2aW9sZXRcIjogbmV3IENvbG9yKDIzOCwgMTMwLCAyMzgpLFxyXG4gICAgXCJtYWdlbnRhXCI6IG5ldyBDb2xvcigyNTUsIDAsIDI1NSksXHJcbiAgICBcImZ1Y2hzaWFcIjogbmV3IENvbG9yKDI1NSwgMCwgMjU1KSxcclxuICAgIFwib3JjaGlkXCI6IG5ldyBDb2xvcigyMTgsIDExMiwgMjE0KSxcclxuICAgIFwibWVkaXVtIHZpb2xldCByZWRcIjogbmV3IENvbG9yKDE5OSwgMjEsIDEzMyksXHJcbiAgICBcInBhbGUgdmlvbGV0IHJlZFwiOiBuZXcgQ29sb3IoMjE5LCAxMTIsIDE0NyksXHJcbiAgICBcImRlZXAgcGlua1wiOiBuZXcgQ29sb3IoMjU1LCAyMCwgMTQ3KSxcclxuICAgIFwiaG90IHBpbmtcIjogbmV3IENvbG9yKDI1NSwgMTA1LCAxODApLFxyXG4gICAgXCJsaWdodCBwaW5rXCI6IG5ldyBDb2xvcigyNTUsIDE4MiwgMTkzKSxcclxuICAgIFwicGlua1wiOiBuZXcgQ29sb3IoMjU1LCAxOTIsIDIwMyksXHJcbiAgICBcImFudGlxdWUgd2hpdGVcIjogbmV3IENvbG9yKDI1MCwgMjM1LCAyMTUpLFxyXG4gICAgXCJiZWlnZVwiOiBuZXcgQ29sb3IoMjQ1LCAyNDUsIDIyMCksXHJcbiAgICBcImJpc3F1ZVwiOiBuZXcgQ29sb3IoMjU1LCAyMjgsIDE5NiksXHJcbiAgICBcImJsYW5jaGVkIGFsbW9uZFwiOiBuZXcgQ29sb3IoMjU1LCAyMzUsIDIwNSksXHJcbiAgICBcIndoZWF0XCI6IG5ldyBDb2xvcigyNDUsIDIyMiwgMTc5KSxcclxuICAgIFwiY29ybiBzaWxrXCI6IG5ldyBDb2xvcigyNTUsIDI0OCwgMjIwKSxcclxuICAgIFwibGVtb24gY2hpZmZvblwiOiBuZXcgQ29sb3IoMjU1LCAyNTAsIDIwNSksXHJcbiAgICBcImxpZ2h0IGdvbGRlbiByb2QgeWVsbG93XCI6IG5ldyBDb2xvcigyNTAsIDI1MCwgMjEwKSxcclxuICAgIFwibGlnaHQgeWVsbG93XCI6IG5ldyBDb2xvcigyNTUsIDI1NSwgMjI0KSxcclxuICAgIFwic2FkZGxlIGJyb3duXCI6IG5ldyBDb2xvcigxMzksIDY5LCAxOSksXHJcbiAgICBcInNpZW5uYVwiOiBuZXcgQ29sb3IoMTYwLCA4MiwgNDUpLFxyXG4gICAgXCJjaG9jb2xhdGVcIjogbmV3IENvbG9yKDIxMCwgMTA1LCAzMCksXHJcbiAgICBcInBlcnVcIjogbmV3IENvbG9yKDIwNSwgMTMzLCA2MyksXHJcbiAgICBcInNhbmR5IGJyb3duXCI6IG5ldyBDb2xvcigyNDQsIDE2NCwgOTYpLFxyXG4gICAgXCJidXJseSB3b29kXCI6IG5ldyBDb2xvcigyMjIsIDE4NCwgMTM1KSxcclxuICAgIFwidGFuXCI6IG5ldyBDb2xvcigyMTAsIDE4MCwgMTQwKSxcclxuICAgIFwicm9zeSBicm93blwiOiBuZXcgQ29sb3IoMTg4LCAxNDMsIDE0MyksXHJcbiAgICBcIm1vY2Nhc2luXCI6IG5ldyBDb2xvcigyNTUsIDIyOCwgMTgxKSxcclxuICAgIFwibmF2YWpvIHdoaXRlXCI6IG5ldyBDb2xvcigyNTUsIDIyMiwgMTczKSxcclxuICAgIFwicGVhY2ggcHVmZlwiOiBuZXcgQ29sb3IoMjU1LCAyMTgsIDE4NSksXHJcbiAgICBcIm1pc3R5IHJvc2VcIjogbmV3IENvbG9yKDI1NSwgMjI4LCAyMjUpLFxyXG4gICAgXCJsYXZlbmRlciBibHVzaFwiOiBuZXcgQ29sb3IoMjU1LCAyNDAsIDI0NSksXHJcbiAgICBcImxpbmVuXCI6IG5ldyBDb2xvcigyNTAsIDI0MCwgMjMwKSxcclxuICAgIFwib2xkIGxhY2VcIjogbmV3IENvbG9yKDI1MywgMjQ1LCAyMzApLFxyXG4gICAgXCJwYXBheWEgd2hpcFwiOiBuZXcgQ29sb3IoMjU1LCAyMzksIDIxMyksXHJcbiAgICBcInNlYSBzaGVsbFwiOiBuZXcgQ29sb3IoMjU1LCAyNDUsIDIzOCksXHJcbiAgICBcIm1pbnQgY3JlYW1cIjogbmV3IENvbG9yKDI0NSwgMjU1LCAyNTApLFxyXG4gICAgXCJzbGF0ZSBncmF5XCI6IG5ldyBDb2xvcigxMTIsIDEyOCwgMTQ0KSxcclxuICAgIFwibGlnaHQgc2xhdGUgZ3JheVwiOiBuZXcgQ29sb3IoMTE5LCAxMzYsIDE1MyksXHJcbiAgICBcImxpZ2h0IHN0ZWVsIGJsdWVcIjogbmV3IENvbG9yKDE3NiwgMTk2LCAyMjIpLFxyXG4gICAgXCJsYXZlbmRlclwiOiBuZXcgQ29sb3IoMjMwLCAyMzAsIDI1MCksXHJcbiAgICBcImZsb3JhbCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LCAyNTAsIDI0MCksXHJcbiAgICBcImFsaWNlIGJsdWVcIjogbmV3IENvbG9yKDI0MCwgMjQ4LCAyNTUpLFxyXG4gICAgXCJnaG9zdCB3aGl0ZVwiOiBuZXcgQ29sb3IoMjQ4LCAyNDgsIDI1NSksXHJcbiAgICBcImhvbmV5ZGV3XCI6IG5ldyBDb2xvcigyNDAsIDI1NSwgMjQwKSxcclxuICAgIFwiaXZvcnlcIjogbmV3IENvbG9yKDI1NSwgMjU1LCAyNDApLFxyXG4gICAgXCJhenVyZVwiOiBuZXcgQ29sb3IoMjQwLCAyNTUsIDI1NSksXHJcbiAgICBcInNub3dcIjogbmV3IENvbG9yKDI1NSwgMjUwLCAyNTApLFxyXG4gICAgXCJibGFja1wiOiBuZXcgQ29sb3IoMCwgMCwgMCksXHJcbiAgICBcImRpbSBncmF5XCI6IG5ldyBDb2xvcigxMDUsIDEwNSwgMTA1KSxcclxuICAgIFwiZGltIGdyZXlcIjogbmV3IENvbG9yKDEwNSwgMTA1LCAxMDUpLFxyXG4gICAgXCJncmF5XCI6IG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4KSxcclxuICAgIFwiZ3JleVwiOiBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCksXHJcbiAgICBcImRhcmsgZ3JheVwiOiBuZXcgQ29sb3IoMTY5LCAxNjksIDE2OSksXHJcbiAgICBcImRhcmsgZ3JleVwiOiBuZXcgQ29sb3IoMTY5LCAxNjksIDE2OSksXHJcbiAgICBcInNpbHZlclwiOiBuZXcgQ29sb3IoMTkyLCAxOTIsIDE5MiksXHJcbiAgICBcImxpZ2h0IGdyYXlcIjogbmV3IENvbG9yKDIxMSwgMjExLCAyMTEpLFxyXG4gICAgXCJsaWdodCBncmV5XCI6IG5ldyBDb2xvcigyMTEsIDIxMSwgMjExKSxcclxuICAgIFwiZ2FpbnNib3JvXCI6IG5ldyBDb2xvcigyMjAsIDIyMCwgMjIwKSxcclxuICAgIFwid2hpdGUgc21va2VcIjogbmV3IENvbG9yKDI0NSwgMjQ1LCAyNDUpLFxyXG4gICAgXCJ3aGl0ZVwiOiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSlcclxufVxyXG5cclxuZXhwb3J0IHsgQ29sb3IgfSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIlxyXG5cclxuaW1wb3J0IHsgQ0JlemllciB9IGZyb20gXCIuLi9jb21tb24vY29tbW9uXCJcclxuXHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gXCIuLi9jb21tb24vc2NoZWR1bGVyXCJcclxuXHJcbmNvbnN0IGVhc2Vfb3V0ID0gbmV3IENCZXppZXIoMC41LCAwLjIsIDAsIDEpO1xyXG5cclxuaWYgKCFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZSkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG5jbGFzcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICAvL2V4dHJhY3RlZCBhbmltYXRhYmxlIGNvbXBvbmVudHNcclxuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBuZXcgQ29sb3Iod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIikpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiaGVpZ2h0XCIpKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikpO1xyXG5cclxuICAgICAgICAvLyppZighdGhpcy5oZWlnaHQgfHwgIXRoaXMud2lkdGgpe1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJlY3Qud2lkdGg7XHJcbiAgICAgICAgLy99Ki9cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGVmdCA9IHBhcnNlRmxvYXQocmVjdC5sZWZ0KTtcclxuICAgICAgICB0aGlzLnRvcCA9IHBhcnNlRmxvYXQocmVjdC50b3ApO1xyXG5cclxuICAgICAgICB0aGlzLmVsZSA9IGVsZW1lbnQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlLnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVFRfVG8gZXh0ZW5kcyBUVF9Gcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGZyb20pIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXMgPSAoKGVsZW1lbnQuc3R5bGUudG9wKSAmJiAoZWxlbWVudC5zdHlsZS5sZWZ0KSk7XHJcblxyXG4gICAgICAgIHRoaXMucnQgPSAoZWxlbWVudC5zdHlsZS50b3ApID8gKGVsZW1lbnQuc3R5bGUudG9wKSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5ybCA9IGVsZW1lbnQuc3R5bGUubGVmdCA/IGVsZW1lbnQuc3R5bGUubGVmdCA6IG51bGw7XHJcblxyXG5cclxuICAgICAgICAvL2dldCB0aGUgcmVsYXRpdmUgb2Zmc2V0IG9mIHRoaXMgb2JqZWN0XHJcbiAgICAgICAgdmFyIG9mZnNldF94ID0gMDsgLSBlbGVtZW50LmdldFBhcmVudFdpbmRvd0xlZnQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0X3kgPSAwOyAtIGVsZW1lbnQuZ2V0UGFyZW50V2luZG93VG9wKCk7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRfeCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImxlZnRcIikpO1xyXG4gICAgICAgIHZhciBvZmZzZXRfeSA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInRvcFwiKSk7XHJcbiAgICAgICAgLy9BbmQgYWRqdXN0IHN0YXJ0IHRvIHJlc3BlY3QgdGhlIGVsZW1lbnRzIG93biBwYXJlbnRhbCBvZmZzZXRzXHJcbiAgICAgICAgdmFyIGRpZmZ4ID0gdGhpcy5sZWZ0IC0gdGhpcy5mcm9tLmxlZnQ7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2Zmc2V0X3g7XHJcbiAgICAgICAgdGhpcy5mcm9tLmxlZnQgPSB0aGlzLmxlZnQgLSBkaWZmeDtcclxuXHJcbiAgICAgICAgdmFyIGRpZmZ5ID0gdGhpcy50b3AgLSB0aGlzLmZyb20udG9wO1xyXG4gICAgICAgIHRoaXMudG9wID0gb2Zmc2V0X3k7XHJcbiAgICAgICAgdGhpcy5mcm9tLnRvcCA9IHRoaXMudG9wIC0gZGlmZnk7XHJcblxyXG4gICAgICAgIHRoaXMudGltZSA9IDYwICogLjM1O1xyXG4gICAgICAgIHRoaXMucyA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2xvcl9vID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIik7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRfbyA9IGVsZW1lbnQuc3R5bGUud2lkdGg7XHJcbiAgICAgICAgdGhpcy53aWR0aF9vID0gZWxlbWVudC5zdHlsZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50b3BfbyA9IHRoaXMudG9wO1xyXG4gICAgICAgIHRoaXMubGVmdF9vID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIHRoaXMucG9zID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInBvc2l0aW9uXCIpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVuZCgpOyAvL1Jlc3RvcmUgZXZlcnl0aGluZyBiYWNrIHRvIGl0J3Mgb3JpZ2luYWwgdHlwZTtcclxuICAgICAgICB0aGlzLmZyb20gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucyA9IEluZmluaXR5O1xyXG4gICAgICAgIHRoaXMuZWxlID0gbnVsbDtcclxuICAgICAgICBzdXBlci5kZXN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUudG9wID0gdGhpcy5mcm9tLnRvcCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS5sZWZ0ID0gdGhpcy5mcm9tLmxlZnQgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUud2lkdGggPSB0aGlzLmZyb20ud2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUuaGVpZ2h0ID0gdGhpcy5mcm9tLmhlaWdodCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIHRoaXMucysrXHJcblxyXG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMucyAvIHRoaXMudGltZTtcclxuXHJcbiAgICAgICAgaWYgKHQgPiAxKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciByYXRpbyA9IGVhc2Vfb3V0LmdldFlhdFgodCk7XHJcblxyXG4gICAgICAgIGlmIChyYXRpbyA+IDEpIHJhdGlvID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUudG9wID0gTWF0aC5yb3VuZCgodGhpcy50b3AgLSB0aGlzLmZyb20udG9wKSAqIHJhdGlvICsgdGhpcy5mcm9tLnRvcCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoKHRoaXMubGVmdCAtIHRoaXMuZnJvbS5sZWZ0KSAqIHJhdGlvICsgdGhpcy5mcm9tLmxlZnQpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlLnN0eWxlLndpZHRoID0gKCh0aGlzLndpZHRoIC0gdGhpcy5mcm9tLndpZHRoKSAqIHJhdGlvICsgdGhpcy5mcm9tLndpZHRoKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS5oZWlnaHQgPSAoKHRoaXMuaGVpZ2h0IC0gdGhpcy5mcm9tLmhlaWdodCkgKiByYXRpbyArIHRoaXMuZnJvbS5oZWlnaHQpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuZWxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICh0aGlzLmNvbG9yLnN1Yih0aGlzLmZyb20uY29sb3IpLm11bHQocmF0aW8pLmFkZCh0aGlzLmZyb20uY29sb3IpKSArIFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAodCA8IDAuOTk5OTk5NSk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZWxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbGUuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHRfbztcclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGhfbztcclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS50b3AgPSB0aGlzLnJ0O1xyXG4gICAgICAgIHRoaXMuZWxlLnN0eWxlLmxlZnQgPSB0aGlzLnJsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY2xhc3MgVFRQYWlyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVfdG8sIGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuYiA9IChlX2Zyb20gaW5zdGFuY2VvZiBUVF9Gcm9tKSA/IGVfZnJvbSA6IG5ldyBUVF9Gcm9tKGVfZnJvbSk7XHJcbiAgICAgICAgdGhpcy5hID0gbmV3IFRUX1RvKGVfdG8sIHRoaXMuYik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmEuZWxlLl9fVFRfXylcclxuICAgICAgICAgICAgdGhpcy5hLmVsZS5fX1RUX18uZGVzdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5iLmVsZS5fX1RUX18pXHJcbiAgICAgICAgICAgIHRoaXMuYi5lbGUuX19UVF9fLmRlc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hLmVsZS5fX1RUX18gPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYi5lbGUuX19UVF9fID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5iLmVsZSlcclxuICAgICAgICAgICAgdGhpcy5iLmVsZS5fX1RUX18gPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmEuZWxlKVxyXG4gICAgICAgICAgICB0aGlzLmEuZWxlLl9fVFRfXyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hLmRlc3RydWN0b3IoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5iLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5hLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hLnN0ZXAoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVHJhbnNmb3JtUnVubmVyID0gbmV3KGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGFpcnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9fX19TQ0hFRFVMRURfX19fID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaFBhaXIocGFpcikge1xyXG4gICAgICAgIHRoaXMucGFpcnMucHVzaChwYWlyKTtcclxuICAgICAgICBTY2hlZHVsZXIucXVldWVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHJhdGlvKSB7XHJcbiAgICAgICAgbGV0IHJwID0gdGhpcy5wYWlycztcclxuXHJcbiAgICAgICAgaWYgKHJwLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIFNjaGVkdWxlci5xdWV1ZVVwZGF0ZSh0aGlzKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBycC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgX3JwID0gcnBbaV07XHJcbiAgICAgICAgICAgIGlmICghX3JwLnN0ZXAocmF0aW8pKSB7XHJcbiAgICAgICAgICAgICAgICBfcnAuZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICAgICAgcnAuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KSgpXHJcblxyXG5cclxuLyoqXHJcbiAgICBUcmFuc2Zvcm0gb25lIGVsZW1lbnQgZnJvbSBhbm90aGVyIGJhY2sgdG8gaXRzZWxmXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBUcmFuc2Zvcm1UbyhlbGVtZW50X2Zyb20sIGVsZW1lbnRfdG8sIEhJREVfT1RIRVIpIHtcclxuXHJcblxyXG4gICAgaWYgKCFlbGVtZW50X3RvKSB7XHJcblxyXG4gICAgICAgIGxldCBhID0gKGZyb20pID0+IChlbGVtZW50X3RvLCBISURFX09USEVSKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYWlyID0gbmV3IFRUUGFpcihlbGVtZW50X3RvLCBmcm9tKTtcclxuICAgICAgICAgICAgVHJhbnNmb3JtUnVubmVyLnB1c2hQYWlyKHBhaXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGIgPSBhKG5ldyBUVF9Gcm9tKGVsZW1lbnRfZnJvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFpciA9IG5ldyBUVFBhaXIoZWxlbWVudF90bywgZWxlbWVudF9mcm9tKTtcclxuXHJcbiAgICBUcmFuc2Zvcm1SdW5uZXIucHVzaFBhaXIocGFpcik7XHJcblxyXG4gICAgcGFpci5zdGFydCgpO1xyXG59IiwiaW1wb3J0IHtcclxuXHRTdHlsZU1hcHBpbmdzXHJcbn0gZnJvbSBcIi4vc3R5bGVfbWFwcGluZ3NcIlxyXG5pbXBvcnQge0NvbG9yfSBmcm9tIFwiLi9jb2xvclwiIFxyXG5pbXBvcnQge1RyYW5zZm9ybVRvfSBmcm9tIFwiLi90cmFuc2Zvcm10b1wiXHJcblxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jIHtcclxuXHRjb25zdHJ1Y3RvcihzdHlsZSwgdG9fdmFsLCBkdXJhdGlvbiwgZGVsYXkpIHtcclxuXHRcdHRoaXMuc3R5bGUgPSBzdHlsZTtcclxuXHRcdHRoaXMuZGVsYXkgPSBkZWxheTtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudG9fdmFsID0gdG9fdmFsO1xyXG5cdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdHRoaXMubmV4dCA9IG51bGw7XHJcblx0XHR0aGlzLnByZXYgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NQZXJjZW50YWdlIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5jbGFzcyBTdHlsZUFuaW1CbG9jUGl4ZWwgZXh0ZW5kcyBTdHlsZUFuaW1CbG9jIHt9XHJcbmNsYXNzIFN0eWxlQW5pbUJsb2NFTSBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge31cclxuY2xhc3MgU3R5bGVBbmltQmxvY0NvbG9yIGV4dGVuZHMgU3R5bGVBbmltQmxvYyB7fVxyXG5cclxuY2xhc3MgU3R5bGVLZXlGcmFtZWRBbmltQmxvYyBleHRlbmRzIFN0eWxlQW5pbUJsb2Mge1xyXG5cdGNvbnN0cnVjdG9yKHN0eWxlLCBrZXlfZnJhbWVzLCBkZWxheSkge1xyXG5cdFx0c3VwZXIoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUJ1ZGR5IHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblx0XHR0aGlzLnN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XHJcblx0XHR0aGlzLmZpcnN0X2FuaW1hdGlvbiA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzZXRBbmltYXRpb24odmFscykge1xyXG5cdFx0bGV0IGFuaW1fYmxvYyA9IG51bGw7XHJcblx0XHRpZiAodmFscyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHR9XHJcblx0XHRpZihhbmltX2Jsb2Mpe1xyXG5cdFx0XHR0aGlzLl9faW5zZXJ0X18oYWIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X19pbnNlcnRfXyhhYikge1xyXG5cdFx0bGV0IGJsb2MgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHJcblx0XHR3aGlsZSAoYmxvYykge1xyXG5cdFx0XHRpZiAoYmxvYy5zdHlsZSA9IGFiLnN0eWxlKSB7XHJcblx0XHRcdFx0YWIuZGVzdHJ1Y3RvcigpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGFiLm5leHQgPSB0aGlzLmZpcnN0X2FuaW1hdGlvbjtcclxuXHRcdGlmICh0aGlzLmZpcnN0X2FuaW1hdGlvbilcclxuXHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24ucHJldiA9IGFiO1xyXG5cdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhYjtcclxuXHR9XHJcblxyXG5cdHN0ZXAoc3RlcF9tdWx0aXBsaWVyKSB7XHJcblx0XHR2YXIgYW5pbV9ibG9jID0gdGhpcy5maXJzdF9hbmltYXRpb247XHJcblx0XHRpZiAoYW5pbV9ibG9jKVxyXG5cdFx0XHR3aGlsZSAoYW5pbV9ibG9jKVxyXG5cdFx0XHRcdGlmICghYW5pbV9ibG9jLnN0ZXAoc3RlcF9tdWx0aXBsaWVyKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFhbmltX2Jsb2MucHJldilcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdF9hbmltYXRpb24gPSBhbmltX2Jsb2MubmV4dDtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YW5pbV9ibG9jLnByZXYubmV4dCA9IGFuaW1fYmxvYy5uZXh0O1xyXG5cdFx0XHRcdFx0aWYgKGFuaW1fYmxvYy5uZXh0KVxyXG5cdFx0XHRcdFx0XHRhbmltX2Jsb2MubmV4dC5wcmV2ID0gYW5pbV9ibG9jLnByZXY7XHJcblxyXG5cdFx0XHRcdFx0bGV0IG5leHQgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblx0XHRcdFx0XHRhbmltX2Jsb2MuZGVzdHJ1Y3RvcigpO1xyXG5cclxuXHRcdFx0XHRcdGFuaW1fYmxvYyA9IG5leHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRhbmltX2Jsb2MgPSBhbmltX2Jsb2MubmV4dDtcclxuXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ZGVzdHJ1Y3RvcigpIHtcclxuXHJcblx0fVxyXG5cclxuXHRnZXRTdHlsZSgpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0c2V0U3R5bGUodmFsdWUpIHtcclxuXHJcblx0fVxyXG5cclxuXHRvblJlc2l6ZSgpIHtcclxuXHRcdHRoaXMuZ2V0U3R5bGUoKVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQW5pbUNvcmV7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmFuaW1fZ3JvdXAgPSB7fTtcclxuXHRcdHRoaXMucnVubmluZ19hbmltYXRpb25zID0gW107XHJcblx0fVxyXG5cclxuXHRzdGVwKHN0ZXBfbXVsdGlwbGllcikge1xyXG5cdFx0dmFyIGwgPSB0aGlzLnJ1bm5pbmdfYW5pbWF0aW9ucy5sZW5naHQ7XHJcblx0XHRpZiAobCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHJcblx0XHRcdFx0dmFyIGFiID0gdGhpcy5ydW5uaW5nX2FuaW1hdGlvbnNbaV07XHJcblxyXG5cdFx0XHRcdGlmIChhYiAmJiAhYWIuc3RlcChzdGVwX211bHRpcGxpZXIpKSB7XHJcblx0XHRcdFx0XHRhYi5kZXN0cnVjdG9yKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJ1bm5pbmdfYW5pbWF0aW9uc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhZGRCbG9jKGFuaW1fYmxvYykge1xyXG5cdFx0aWYgKGFuaW1fYmxvYyBpbnN0YW5jZW9mIEFuaW1CbG9jKSB7XHJcblx0XHRcdC8vYWRkIHRvIGdyb3VwIG9mIG9iamVjdFxyXG5cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7QW5pbUNvcmUsIFRyYW5zZm9ybVRvLCBDb2xvcn0iLCJpbXBvcnQgeyBzZXRMaW5rcyB9IGZyb20gXCIuL3NldGxpbmtzXCJcclxuXHJcbmltcG9ydCB7IFRyYW5zZm9ybVRvIH0gZnJvbSBcIi4uLy4uL2FuaW1hdGlvbi9hbmltYXRpb25cIlxyXG5cclxuaW1wb3J0IHsgU291cmNlQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vLi4vc291cmNlL3NvdXJjZV9jb25zdHJ1Y3RvclwiXHJcblxyXG5pbXBvcnQgeyBTb3VyY2VCYXNlIH0gZnJvbSBcIi4uLy4uL3NvdXJjZS9iYXNlXCJcclxuXHJcbmltcG9ydCB7IFRyYW5zaXRpb25lZXIgfSBmcm9tIFwiLi4vLi4vYW5pbWF0aW9uL3RyYW5zaXRpb24vdHJhbnNpdGlvbmVlclwiXHJcblxyXG4vKiogQG5hbWVzcGFjZSBTb3VyY2UgKi9cclxuXHJcbi8qKlxyXG4gICAgSGFuZGxlcyB0aGUgdHJhbnNpdGlvbiBvZiBzZXBhcmF0ZSBlbGVtZW50cy5cclxuKi9cclxuY2xhc3MgQmFzaWNTb3VyY2UgZXh0ZW5kcyBTb3VyY2VCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHN1cGVyKG51bGwsIGVsZW1lbnQsIHt9LCB7fSk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLkxPQURFRCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25lZXIgPSBuZXcgVHJhbnNpdGlvbmVlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlci5zZXQodGhpcy5lbGUpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZWRFbGVtZW50cyhuYW1lZF9lbGVtZW50cykge1xyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb24pXHJcbiAgICAgICAgICAgICAgICBuYW1lZF9lbGVtZW50c1tjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb25dID0gY2hpbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICAgIFRoaXMgaXMgYSBmYWxsYmFjayBjb21wb25lbnQgaWYgY29uc3RydWN0aW5nIGEgQ3VzdG9tU291cmNlIG9yIG5vcm1hbCBTb3VyY2UgdGhyb3dzIGFuIGVycm9yLlxyXG4qL1xyXG5cclxuY2xhc3MgRmFpbGVkU291cmNlIGV4dGVuZHMgU291cmNlQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihlcnJvcl9tZXNzYWdlLCBwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBgPGgzPiBUaGlzIFdpY2sgY29tcG9uZW50IGhhcyBmYWlsZWQhPC9oMz4gPGg0PkVycm9yIE1lc3NhZ2U6PC9oND48cD4ke2Vycm9yX21lc3NhZ2Uuc3RhY2t9PC9wPjxwPlBsZWFzZSBjb250YWN0IHRoZSB3ZWJzaXRlIG1haW50YWluZXJzIHRvIGFkZHJlc3MgdGhlIHByb2JsZW0uPC9wPiA8cD4ke3ByZXNldHMuZXJyb3JfY29udGFjdH08L3A+YDtcclxuICAgICAgICBzdXBlcihudWxsLCBkaXYsIHt9LCB7fSk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbmVlciA9IG5ldyBUcmFuc2l0aW9uZWVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uZWVyLnNldCh0aGlzLmVsZSlcclxuICAgIH1cclxufVxyXG5cclxuLyoqIEBuYW1lc3BhY2UgQ29tcG9uZW50ICovXHJcblxyXG4vKipcclxuICAgIFRoZSBtYWluIGNvbnRhaW5lciBvZiBTb3VyY2VzLiBSZXByZXNlbnRzIGFuIGFyZWEgb2YgaW50ZXJlc3Qgb24gdGhlIERPTS5cclxuKi9cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gKGVsZW1lbnQuY2xhc3NMaXN0KSA/IGVsZW1lbnQuY2xhc3NMaXN0WzBdIDogZWxlbWVudC5pZDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud3JhcHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9UaGUgb3JpZ2luYWwgZWxlbWVudCBjb250YWluZXIuXHJcbiAgICAgICAgLy90aGlzLnBhcmVudF9lbGVtZW50ID0gcGFyZW50X2VsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vQ29udGVudCB0aGF0IGlzIHdyYXBwZWQgaW4gYW4gZWxlX3dyYXBcclxuICAgICAgICB0aGlzLmVsZSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVubG9hZENvbXBvbmVudHMoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbk91dCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHQgPSBNYXRoLm1heChjb21wb25lbnQudHJhbnNpdGlvbk91dCgpLCB0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsaXplKCkge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LkxPQURFRCAmJiBjb21wb25lbnQucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmZpbmFsaXplVHJhbnNpdGlvbk91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5yZW1vdmVDaGlsZChjb21wb25lbnQuZWxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LkxPQURFRCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkQ29tcG9uZW50cyh3dXJsKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LnBhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVsZS5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNvbXBvbmVudC5lbGUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cmFwc1tpXS5hcHBlbmRDaGlsZChjb21wb25lbnQuZWxlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5oYW5kbGVVcmxVcGRhdGUod3VybCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbaV0uTE9BREVEID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25JbigpIHtcclxuXHJcbiAgICAgICAgLy8gVGhpcyBpcyB0byBmb3JjZSBhIGRvY3VtZW50IHJlcGFpbnQsIHdoaWNoIHNob3VsZCBjYXVzZSBhbGwgZWxlbWVudHMgdG8gcmVwb3J0IGNvcnJlY3QgcG9zaXRpb25pbmcgaGVyZWFmdGVyXHJcblxyXG4gICAgICAgIGxldCB0ID0gdGhpcy5lbGUuc3R5bGUudG9wO1xyXG5cclxuICAgICAgICB0aGlzLmVsZS5zdHlsZS50b3AgPSB0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC50cmFuc2l0aW9uSW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnViYmxlTGluayhsaW5rX3VybCwgY2hpbGQsIHRyc19lbGUgPSB7fSkge1xyXG5cclxuICAgICAgICB0aGlzLmJ1YmJsZWRfZWxlbWVudHMgPSB0cnNfZWxlO1xyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGxpbmtfdXJsKTtcclxuXHJcbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUcmFuc2Zvcm1Ubyh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBsZXQgb3duX2VsZW1lbnRzID0ge307XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldE5hbWVkRWxlbWVudHMob3duX2VsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3duX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IFRyYW5zZm9ybVRvKG93bl9lbGVtZW50c1tuYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VHJhbnNmb3JtVG8odHJhbnNpdGlvbnMpIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgbGV0IG93bl9lbGVtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXROYW1lZEVsZW1lbnRzKG93bl9lbGVtZW50cyk7XHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBvd25fZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0bywgZnJvbSA9IHRyYW5zaXRpb25zW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0byA9IG93bl9lbGVtZW50c1tuYW1lXSkgJiYgZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb20odG8sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lZEVsZW1lbnRzKG5hbWVkX2VsZW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnViYmxlZF9lbGVtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuYnViYmxlZF9lbGVtZW50cztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gdGhpcy5idWJibGVkX2VsZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgbmFtZWRfZWxlbWVudHNbdF0gPSB0aGlzLmJ1YmJsZWRfZWxlbWVudHNbdF07XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMuYnViYmxlZF9lbGVtZW50cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmVsZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIG5hbWVkX2VsZW1lbnRzW2NoaWxkLmRhdGFzZXQudHJhbnNpdGlvbl0gPSBjaGlsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpXTtcclxuICAgICAgICAgICAgY29tcG9uZW50LmdldE5hbWVkRWxlbWVudHMobmFtZWRfZWxlbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRDb21wb25lbnRzKEFwcF9Db21wb25lbnRzLCBNb2RlbF9Db25zdHJ1Y3RvcnMsIENvbXBvbmVudF9Db25zdHJ1Y3RvcnMsIHByZXNldHMsIERPTSwgd3VybCkge1xyXG4gICAgICAgIC8vaWYgdGhlcmUgaXMgYSBjb21wb25lbnQgaW5zaWRlIHRoZSBlbGVtZW50LCByZWdpc3RlciB0aGF0IGNvbXBvbmVudCBpZiBpdCBoYXMgbm90IGFscmVhZHkgYmVlbiByZWdpc3RlcmVkXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwodGhpcy5lbGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjb21wb25lbnRcIiksIChhKSA9PiBhKTtcclxuXHJcbiAgICAgICAgc2V0TGlua3ModGhpcy5lbGUsIChocmVmLCBlKSA9PiB7XHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcImlnbm9yZWQgdGl0bGVcIiwgaHJlZik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgYSB3cmFwcGVkIGNvbXBvbmVudCBmb3IgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgPGVsZW1lbnQ+XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImNvbXBfd3JhcFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vU3RyYWlnaHQgdXAgc3RyaW5nIGNvcHkgb2YgdGhlIGVsZW1lbnQncyBET00uXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5pbm5lckhUTUwgPSB0aGlzLmVsZS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVtcGxhdGVzID0gRE9NLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGVtcGxhdGVcIik7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGFwcF9jYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgUmVwbGFjZSB0aGUgY29tcG9uZW50IHdpdGggYSBjb21wb25lbnQgd3JhcHBlciB0byBoZWxwIHByZXNlcnZlIERPTSBhcnJhbmdlbWVudFxyXG4gICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcF93cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbXBfd3JhcC5jbGFzc0xpc3QuYWRkKFwiY29tcF93cmFwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcy5wdXNoKGNvbXBfd3JhcCk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoY29tcF93cmFwLCBjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IGNvbXBvbmVudC5jbGFzc0xpc3RbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcDtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICBXZSBtdXN0IGVuc3VyZSB0aGF0IGNvbXBvbmVudHMgYWN0IGFzIHRlbXBsYXRlIFwibGFuZGluZyBzcG90c1wiLiBJbiBvcmRlciBmb3IgdGhhdCB0byBoYXBwZW4gd2UgbXVzdCBjaGVjayBmb3I6XHJcbiAgICAgICAgICAgICAgICAgICgxKSBUaGUgY29tcG9uZW50IGhhcywgYXMgaXQncyBmaXJzdCBjbGFzcyBuYW1lLCBhbiBpZCB0aGF0ICgyKSBtYXRjaGVzIHRoZSBpZCBvZiBhIHRlbXBsYXRlLiBJZiBlaXRoZXIgb2YgdGhlc2UgcHJvdmUgdG8gYmUgbm90IHRydWUsIHdlIHNob3VsZCByZWplY3QgdGhlIGFkb3B0aW9uIG9mIHRoZSBjb21wb25lbnQgYXMgYSBXaWNrXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBhbmQgaW5zdGVhZCB0cmVhdCBpdCBhcyBhIG5vcm1hbCBcInBhc3MgdGhyb3VnaFwiIGVsZW1lbnQuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qc2V0TGlua3MoY29tcG9uZW50LCAoaHJlZiwgZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJpZ25vcmVkIHRpdGxlXCIsIGhyZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEJhc2ljU291cmNlKGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFBcHBfQ29tcG9uZW50c1tpZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAgPSBDb21wb25lbnRfQ29uc3RydWN0b3JzW2lkXSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IGNvbXAuY29uc3RydWN0b3IodGVtcGxhdGVzLCBwcmVzZXRzLCBjb21wb25lbnQsIERPTSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAubW9kZWxfbmFtZSAmJiBNb2RlbF9Db25zdHJ1Y3RvcnNbY29tcC5tb2RlbF9uYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IE1vZGVsX0NvbnN0cnVjdG9yc1tjb21wLm1vZGVsX25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5nZXR0ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmdldHRlci5nZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5hZGRWaWV3KGFwcF9jYXNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZS5pZCA9IGlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcF9Db21wb25lbnRzW2lkXSA9IGFwcF9jYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gdGVtcGxhdGVzW2lkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IFNvdXJjZUNvbnN0cnVjdG9yKHRlbXBsYXRlLCBwcmVzZXRzLCBET00pKCk7IC8vbmV3IFNvdXJjZUNvbXBvbmVudCh0ZW1wbGF0ZSwgcHJlc2V0cywgTW9kZWxfQ29uc3RydWN0b3JzLCBudWxsLCBET00pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29uc3RydWN0b3IgPSBTb3VyY2VDb25zdHJ1Y3Rvcihjb21wb25lbnQsIHByZXNldHMsIERPTSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uc3RydWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gU291cmNlQ29uc3RydWN0b3IoY29tcG9uZW50LmNoaWxkcmVuWzBdLCBwcmVzZXRzLCBET00pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uc3RydWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gbmV3IEJhc2ljU291cmNlKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBfY2FzZSA9IGNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXBwX2Nhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkFwcCBDb21wb25lbnQgbm90IGNvbnN0cnVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqIFRPRE86IElmIHRoZXJlIGlzIGEgZmFsbGJhY2sgPG5vLXNjcmlwdD4gc2VjdGlvbiB1c2UgdGhhdCBpbnN0ZWFkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgRmFpbGVkU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBfQ29tcG9uZW50c1tpZF0gPSBhcHBfY2FzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcF9jYXNlID0gQXBwX0NvbXBvbmVudHNbaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwX2Nhc2UuaGFuZGxlVXJsVXBkYXRlKHd1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgYXBwX2Nhc2UgPSBuZXcgRmFpbGVkU291cmNlKGUsIHByZXNldHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChhcHBfY2FzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV1VSTCB9IGZyb20gXCIuL3d1cmxcIlxyXG5cclxuaW1wb3J0IHsgQW55TW9kZWwgfSBmcm9tIFwiLi4vLi4vbW9kZWwvbW9kZWxcIlxyXG5cclxuaW1wb3J0IHsgUGFnZVZpZXcgfSBmcm9tIFwiLi9wYWdlXCJcclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiXHJcblxyXG5pbXBvcnQgeyBUdXJuRGF0YUludG9RdWVyeSB9IGZyb20gXCIuLi8uLi9jb21tb24vdXJsL3VybFwiXHJcblxyXG5jb25zdCBVUkxfSE9TVCA9IHsgd3VybDogbnVsbCB9O1xyXG5cclxuLyoqIEBuYW1lc3BhY2UgUm91dGVyICovXHJcblxyXG5jb25zdCBVUkwgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgQ2hhbmdlcyB0aGUgVVJMIHRvIHRoZSBvbmUgcHJvdmlkZWQsIHByb21wdHMgcGFnZSB1cGRhdGUuIG92ZXJ3cml0ZXMgY3VycmVudCBVUkwuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcclxuICAgICAgICAgICAgaWYgKFVSTF9IT1NULnd1cmwpXHJcbiAgICAgICAgICAgICAgICBVUkxfSE9TVC53dXJsLnNldChhLCBiLCBjKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgIFJldHVybnMgYSBRdWVyeSBlbnRyeSBpZiBpdCBleGlzdHMgaW4gdGhlIHF1ZXJ5IHN0cmluZy4gXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICBpZiAoVVJMX0hPU1Qud3VybClcclxuICAgICAgICAgICAgICAgIHJldHVybiBVUkxfSE9TVC53dXJsLnNldChhLCBiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHRoZSBVUkwgc3RhdGUgdG8gdGhlIG9uZSBwcm92aWRlZCBhbmQgcHJvbXB0cyB0aGUgQnJvd3NlciB0byByZXNwb25kIG8gdGhlIGNoYW5nZS4gXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIGdvdG86IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiaWdub3JlZCB0aXRsZVwiLCBgJHthfSR7ICgoYikgPyBgPyR7VHVybkRhdGFJbnRvUXVlcnkoYil9YCA6IFwiXCIpIH1gKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IHsgVVJMIH07XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RhbENvbnRhaW5lcigpIHtcclxuICAgIGxldCBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1vZGFsc1wiKVswXTtcclxuXHJcbiAgICBpZiAoIW1vZGFsX2NvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBtb2RhbF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibW9kYWxzXCIpO1xyXG5cclxuICAgICAgICB2YXIgZG9tX2FwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXBwXCIpWzBdO1xyXG5cclxuICAgICAgICBpZiAoZG9tX2FwcClcclxuICAgICAgICAgICAgZG9tX2FwcC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShtb2RhbF9jb250YWluZXIsIGRvbV9hcHApO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbF9jb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtb2RhbF9jb250YWluZXJcclxufVxyXG5cclxuLyoqIEBuYW1lc3BhY2UgbGlua2VyICovXHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGxvYWRpbmcgcGFnZXMgZHluYW1pY2FsbHksIGhhbmRsaW5nIHRoZSB0cmFuc2l0aW9uIG9mIHBhZ2UgY29tcG9uZW50cywgYW5kIG1vbml0b3JpbmcgYW5kIHJlYWN0aW5nIHRvIFVSTCBjaGFuZ2VzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcclxuXHJcbiAgICAvKlxyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBwcmVzZXRzIC0gQW4gb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGJ5IFdpY2sgZm9yIGhhbmRsaW5nIGN1c3RvbSBjb21wb25lbnRzLiBJcyB2YWxpZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBkZWZpbml0aW9uIG9mIGEgUm91dGVyUHJlc2V0XHJcbiAgICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwcmVzZXRzKSB7XHJcblxyXG4gICAgICAgIHByZXNldHMucm91dGVyID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMubW9kZWxzX2NvbnN0cnVjdG9ycyA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJlc2V0cyA9IHByZXNldHM7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3VybCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3F1ZXJ5O1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMgPSBbXTtcclxuXHJcbiAgICAgICAgLyogKi9cclxuICAgICAgICB0aGlzLm1vZGFsX3N0YWNrID0gW107XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVVJMKGRvY3VtZW50LmxvY2F0aW9uKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFRoaXMgZnVuY3Rpb24gd2lsbCBwYXJzZSBhIFVSTCBhbmQgZGV0ZXJtaW5lIHdoYXQgUGFnZSBuZWVkcyB0byBiZSBsb2FkZWQgaW50byB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAgKi9cclxuICAgIHBhcnNlVVJMKGxvY2F0aW9uKSB7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZTtcclxuXHJcbiAgICAgICAgbGV0IElTX1NBTUVfUEFHRSA9ICh0aGlzLmN1cnJlbnRfdXJsID09IHVybCksXHJcbiAgICAgICAgICAgIHBhZ2UgPSBudWxsLFxyXG4gICAgICAgICAgICB3dXJsID0gbmV3IFdVUkwobG9jYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRfdXJsID0gdXJsO1xyXG5cclxuICAgICAgICBpZiAoKHBhZ2UgPSB0aGlzLnBhZ2VzW3VybF0pKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoSVNfU0FNRV9QQUdFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgVVJMX0hPU1Qud3VybCA9IHd1cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UudHJhbnNpdGlvbkluKFxyXG4gICAgICAgICAgICAgICAgICAgIChwYWdlLnR5cGUgPT0gXCJtb2RhbFwiKSA/IGdldE1vZGFsQ29udGFpbmVyKCkgOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXSxcclxuICAgICAgICAgICAgICAgICAgICBudWxsLCB3dXJsLCBJU19TQU1FX1BBR0UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkUGFnZShwYWdlLCB3dXJsLCBJU19TQU1FX1BBR0UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvY2F0aW9uKVxyXG4gICAgICAgICAgICBmZXRjaChsb2NhdGlvbi5ocmVmLCB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBTZW5kcyBjb29raWVzIGJhY2sgdG8gc2VydmVyIHdpdGggcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xyXG4gICAgICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIChyZXNwb25zZS50ZXh0KCkudGhlbigoaHRtbCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgRE9NID0gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFBhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZE5ld1BhZ2UodXJsLCBET00sIHd1cmwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3dXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJU19TQU1FX1BBR0VcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHByb2Nlc3MgcmVzcG9uc2UgZm9yIHJlcXVlc3QgbWFkZSB0bzogJHt0aGlzLnVybH0uIFJlc3BvbnNlOiAke2Vycm9yfS4gRXJyb3IgUmVjZWl2ZWQ6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxpemVQYWdlcygpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXJtZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBhID0gdGhpcy5hcm1lZDtcclxuICAgICAgICAgICAgLy8gIGEucC50cmFuc2l0aW9uSW4oYS5lLCB0aGlzLmN1cnJlbnRfdmlldywgYS53dXJsLCBhLlNQLCBhLnRlKTtcclxuICAgICAgICAgICAgdGhpcy5hcm1lZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmluYWxpemluZ19wYWdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5maW5hbGl6aW5nX3BhZ2VzW2ldO1xyXG5cclxuICAgICAgICAgICAgcGFnZS5maW5hbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgTG9hZHMgcGFnZXMgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgY2FjaGUsIGFuZCBzZW5kcyBpdCB0byB0aGUgcGFnZSBwYXJzZXIuXHJcblxyXG4gICAgICBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBpZCBvZiB0aGUgY2FjaGVkIHBhZ2UgdG8gbG9hZC5cclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IC1cclxuICAgICAgQHBhcmFtIHtCb29sfSBJU19TQU1FX1BBR0UgLVxyXG4gICAgKi9cclxuICAgIGxvYWRQYWdlKHBhZ2UsIHd1cmwgPSBuZXcgV1VSTChkb2N1bWVudC5sb2NhdGlvbiksIElTX1NBTUVfUEFHRSkge1xyXG5cclxuICAgICAgICBVUkxfSE9TVC53dXJsID0gd3VybDtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fbGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGFwcF9lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKVswXTtcclxuXHJcbiAgICAgICAgLy9GaW5hbGl6ZSBhbnkgZXhpc3RpbmcgcGFnZSB0cmFuc2l0aW9ucztcclxuICAgICAgICAvLyB0aGlzLmZpbmFsaXplUGFnZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25fZWxlbWVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKHBhZ2UudHlwZSA9PSBcIm1vZGFsXCIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vdHJhY2UgbW9kYWwgc3RhY2sgYW5kIHNlZSBpZiB0aGUgbW9kYWwgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgaWYgKElTX1NBTUVfUEFHRSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgVU5XSU5EID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RhbF9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLm1vZGFsX3N0YWNrW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVTldJTkQgPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobW9kYWwgPT0gcGFnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgVU5XSU5EID0gaSArIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJzID0gbW9kYWwudHJhbnNpdGlvbk91dCgpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX2xlbmd0aCA9IE1hdGgubWF4KHRycywgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6aW5nX3BhZ2VzLnB1c2gobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5maW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoVU5XSU5EID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5sZW5ndGggPSBVTldJTkQ7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoZ2V0TW9kYWxDb250YWluZXIoKSwgd3VybCk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9jcmVhdGUgbmV3IG1vZGFsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsX3N0YWNrLnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoZ2V0TW9kYWxDb250YWluZXIoKSwgd3VybCk7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnRyYW5zaXRpb25JbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubW9kYWxfc3RhY2subGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gdGhpcy5tb2RhbF9zdGFja1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RhbC51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHJzID0gbW9kYWwudHJhbnNpdGlvbk91dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9sZW5ndGggPSBNYXRoLm1heCh0cnMsIHRyYW5zaXRpb25fbGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsaXppbmdfcGFnZXMucHVzaChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC5maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RhbF9zdGFjay5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRycyA9IDA7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF92aWV3ICYmIHRoaXMuY3VycmVudF92aWV3ICE9IHBhZ2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfdmlldy51bmxvYWQodHJhbnNpdGlvbl9lbGVtZW50cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZS5sb2FkKGFwcF9lbGUsIHd1cmwpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0ID0gdGhpcy5jdXJyZW50X3ZpZXcudHJhbnNpdGlvbk91dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UudHJhbnNpdGlvbkluKHRyYW5zaXRpb25fZWxlbWVudHMpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fbGVuZ3RoID0gTWF0aC5tYXgodCwgdHJhbnNpdGlvbl9sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmluYWxpemluZ19wYWdlcy5wdXNoKHRoaXMuY3VycmVudF92aWV3KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5jdXJyZW50X3ZpZXcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlLmxvYWQoYXBwX2VsZSwgd3VybCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS50cmFuc2l0aW9uSW4odHJhbnNpdGlvbl9lbGVtZW50cylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gcGFnZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplUGFnZXMoKTtcclxuICAgICAgICB9LCAodHJhbnNpdGlvbl9sZW5ndGggKiAxMDAwKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIFByZS1sb2FkcyBhIGN1c3RvbSBjb25zdHJ1Y3RvciBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgaWQgYW5kIHByb3ZpZGVzIGEgbW9kZWwgdG8gdGhhdCBjb25zdHJ1Y3RvciB3aGVuIGl0IGlzIGNhbGxlZC5cclxuICAgICAgICBUaGUgY29uc3RydWN0b3IgbXVzdCBoYXZlIENvbXBvbmVudCBpbiBpdHMgaW5oZXJpdGFuY2UgY2hhaW4uXHJcbiAgICAqL1xyXG4gICAgYWRkU3RhdGljKGVsZW1lbnRfaWQsIGNvbnN0cnVjdG9yLCBtb2RlbCkge1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnNbZWxlbWVudF9pZF0gPSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBtb2RlbF9uYW1lOiBtb2RlbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1vZGVsKG1vZGVsX25hbWUsIG1vZGVsQ29uc3RydWN0b3IpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzW21vZGVsX25hbWVdID0gbW9kZWxDb25zdHJ1Y3RvcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAgIENyZWF0ZXMgYSBuZXcgaWZyYW1lIG9iamVjdCB0aGF0IGFjdHMgYXMgYSBtb2RhbCB0aGF0IHdpbGwgc2l0IG9udG9wIG9mIGV2ZXJ5dGhpbmcgZWxzZS5cclxuICAgICovXHJcbiAgICBsb2FkTm9uV2lja1BhZ2UoVVJMKSB7XHJcblxyXG4gICAgICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xyXG4gICAgICAgIGlmcmFtZS5zcmMgPSBVUkw7XHJcbiAgICAgICAgaWZyYW1lLmNsYXNzTGlzdC5hZGQoXCJtb2RhbFwiLCBcImNvbXBfd3JhcFwiKTtcclxuICAgICAgICB2YXIgcGFnZSA9IG5ldyBQYWdlVmlldyhVUkwsIGlmcmFtZSk7XHJcbiAgICAgICAgcGFnZS50eXBlID0gXCJtb2RhbFwiO1xyXG4gICAgICAgIHRoaXMucGFnZXNbVVJMXSA9IHBhZ2UgLy9uZXcgTW9kYWwocGFnZSwgaWZyYW1lLCBnZXRNb2RhbENvbnRhaW5lcigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tVUkxdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAgVGFrZXMgdGhlIERPTSBvZiBhbm90aGVyIHBhZ2UgYW5kIHN0cmlwcyBpdCwgbG9va2luZyBmb3IgY29tcG9uZW50IGFuZCBhcHAgZWxlbWVudHMgdG8gdXNlIHRvIGludGVncmF0ZSBpbnRvIHRoZSBTUEEgc3lzdGVtLlxyXG4gICAgICAgIElmIGl0IGlzIHVuYWJsZSB0byBmaW5kIHRoZXNlIGVsZW1lbnRzLCB0aGVuIGl0IHdpbGwgcGFzcyB0aGUgRE9NIHRvIGxvYWROb25XaWNrUGFnZSB0byBoYW5kbGUgd3JhcHBpbmcgdGhlIHBhZ2UgYm9keSBpbnRvIGEgd2ljayBhcHAgZWxlbWVudC5cclxuICAgICovXHJcbiAgICBsb2FkTmV3UGFnZShVUkwsIERPTSwgd3VybCkge1xyXG4gICAgICAgIC8vbG9vayBmb3IgdGhlIGFwcCBzZWN0aW9uLlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgSWYgdGhlIHBhZ2Ugc2hvdWxkIG5vdCBiZSByZXVzZWQsIGFzIGluIGNhc2VzIHdoZXJlIHRoZSBzZXJ2ZXIgZG9lcyBhbGwgdGhlIHJlbmRlcmluZyBmb3IgYSBkeW5hbWljIHBhZ2UgYW5kIHdlJ3JlIGp1c3QgcHJlc2VudGluZyB0aGUgcmVzdWx0cyxcclxuICAgICAgICAgICAgdGhlbiBoYXZpbmcgTk9fQlVGRkVSIHNldCB0byB0cnVlIHdpbGwgY2F1c2UgdGhlIGxpbmtlciB0byBub3Qgc2F2ZSB0aGUgcGFnZSB0byB0aGUgaGFzaHRhYmxlIG9mIGV4aXN0aW5nIHBhZ2VzLCBmb3JjaW5nIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIGV2ZXJ5IHRpbWUgdGhlIHBhZ2UgaXMgdmlzaXRlZC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBOT19CVUZGRVIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogXHJcbiAgICAgICAgICAgIEFwcCBlbGVtZW50czogVGhlcmUgc2hvdWxkIG9ubHkgYmUgb25lLiBcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBfbGlzdCA9IERPTS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFwcFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGFwcF9saXN0Lmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgV2ljayBpcyBkZXNpZ25lZCB0byB3b3JrIHdpdGgganVzdCBvbmUgPGFwcD4gZWxlbWVudCBpbiBhIHBhZ2UuIFRoZXJlIGFyZSAke2FwcF9saXN0Lmxlbmd0aH0gYXBwcyBlbGVtZW50cyBpbiAke3VybH0uIFdpY2sgd2lsbCBwcm9jZWVkIHdpdGggdGhlIGZpcnN0IDxhcHA+IGVsZW1lbnQgaW4gdGhlIERPTS4gVW5leHBlY3RlZCBiZWhhdmlvciBtYXkgb2NjdXIuYClcclxuXHJcbiAgICAgICAgbGV0IGFwcF9zb3VyY2UgPSBhcHBfbGlzdFswXVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgIElmIHRoZXJlIGlzIG5vIDxhcHA+IGVsZW1lbnQgd2l0aGluIHRoZSBET00sIHRoZW4gd2UgbXVzdCBoYW5kbGUgdGhpcyBjYXNlIGNhcmVmdWxseS4gVGhpcyBsaWtlbHkgaW5kaWNhdGVzIGEgcGFnZSBkZWxpdmVyZWQgZnJvbSB0aGUgc2FtZSBvcmlnaW4gdGhhdCBoYXMgbm90IGJlZW4gY29udmVydGVkIHRvIHdvcmsgd2l0aCB0aGUgV2ljayBzeXN0ZW0uXHJcbiAgICAgICAgICBUaGUgZW50aXJlIGNvbnRlbnRzIG9mIHRoZSBwYWdlIGNhbiBiZSB3cmFwcGVkIGludG8gYSA8aWZyYW1lPiwgdGhhdCB3aWxsIGJlIGNvdWxkIHNldCBhcyBhIG1vZGFsIG9uIHRvcCBvZiBleGlzdGluZyBwYWdlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGlmICghYXBwX3NvdXJjZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQYWdlIGRvZXMgbm90IGhhdmUgYW4gPGFwcD4gZWxlbWVudCFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWROb25XaWNrUGFnZShVUkwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGFwcF9wYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFwcHBhZ2VcIik7XHJcblxyXG4gICAgICAgIGFwcF9wYWdlLmlubmVySFRNTCA9IGFwcF9zb3VyY2UuaW5uZXJIVE1MO1xyXG5cclxuICAgICAgICB2YXIgYXBwID0gYXBwX3NvdXJjZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciBkb21fYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhcHBcIilbMF07XHJcblxyXG4gICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2VWaWV3KFVSTCwgYXBwX3BhZ2UpO1xyXG5cclxuICAgICAgICBpZiAoYXBwX3NvdXJjZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFwcF9zb3VyY2UuZGF0YXNldC5tb2RhbCA9PSBcInRydWVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2Uuc2V0VHlwZShcIm1vZGFsXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1vZGFsXCIpO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuaW5uZXJIVE1MID0gYXBwLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIGFwcC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYXBwID0gbW9kYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBJZiB0aGUgRE9NIGlzIHRoZSBzYW1lIGVsZW1lbnQgYXMgdGhlIGFjdHVhbCBkb2N1bWVudCwgdGhlbiB3ZSBzaGFsbCByZWJ1aWxkIHRoZSBleGlzdGluZyA8YXBwPiBlbGVtZW50LCBjbGVhcmluZyBpdCBvZiBpdCdzIGNvbnRlbnRzLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChET00gPT0gZG9jdW1lbnQgJiYgZG9tX2FwcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdfYXBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFwcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlcGxhY2VDaGlsZChuZXdfYXBwLCBkb21fYXBwKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21fYXBwID0gbmV3X2FwcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFwcC5kYXRhc2V0Lm5vX2J1ZmZlciA9PSBcInRydWVcIilcclxuICAgICAgICAgICAgICAgIE5PX0JVRkZFUiA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBhcHBfcGFnZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImVsZW1lbnRcIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsZSA9IGVsZW1lbnRzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGVxdWl2aWxhbnRfZWxlbWVudF9mcm9tX21haW5fZG9tID0gZWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRfaWQgPSBlbGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UudHlwZSAhPT0gXCJtb2RhbFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoZWxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZWxlLmlubmVySFRNTDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZWxlX3dyYXBcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoZWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlLmVsZXMucHVzaChjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzW2VsZW1lbnRfaWRdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zZXRDb21wb25lbnRzKHRoaXMuY29tcG9uZW50c1tlbGVtZW50X2lkXSwgdGhpcy5tb2RlbHNfY29uc3RydWN0b3JzLCB0aGlzLmNvbXBvbmVudF9jb25zdHJ1Y3RvcnMsIHRoaXMucHJlc2V0cywgRE9NLCB3dXJsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50ID09IERPTSlcclxuICAgICAgICAgICAgICAgIGRvbV9hcHAuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBwYWdlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFOT19CVUZGRVIpIHRoaXMucGFnZXNbVVJMXSA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiY29uc3Qgd2lja192YW5pdHkgPSBcIlxcIFxcKFxcIFxcIFxcKFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcIFxcKVxcblxcIFxcKVxcXFxcXClcXClcXChcXCBcXCBcXCBcXCdcXCBcXChcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXCBcXChcXCBcXC9cXChcXG5cXChcXChcXF9cXClcXChcXClcXFxcXFwgXFwpXFwgXFwgXFwpXFxcXFxcIFxcIFxcIFxcIFxcKFxcIFxcIFxcIFxcIFxcKVxcXFxcXChcXClcXClcXG5cXF9cXChcXChcXClcXClcXFxcXFxfXFwpXFwoXFwpXFwoXFwoXFxfXFwpXFwgXFwgXFwgXFwpXFxcXFxcIFxcIFxcKFxcKFxcX1xcKVxcXFxcXG5cXFxcXFwgXFxcXFxcKFxcKFxcX1xcKVxcL1xcIFxcL1xcIFxcKFxcX1xcKVxcIFxcIFxcKFxcKFxcX1xcKVxcIFxcfFxcIFxcfFxcKFxcX1xcKVxcblxcIFxcXFxcXCBcXFxcXFwvXFxcXFxcL1xcIFxcL1xcIFxcIFxcfFxcIFxcfFxcIFxcL1xcIFxcX1xcfFxcIFxcIFxcfFxcIFxcL1xcIFxcL1xcblxcIFxcIFxcXFxcXF9cXC9cXFxcXFxfXFwvXFwgXFwgXFwgXFx8XFxfXFx8XFwgXFxcXFxcX1xcX1xcfFxcIFxcIFxcfFxcX1xcXFxcXF9cXFxcXFxuXCI7XHJcblxyXG4vKipcclxuICAgIExpZ2h0IGl0IHVwIVxyXG4qL1xyXG5cclxuLy9TY2hlbWFcclxuXHJcbmltcG9ydCB7IFNjaGVtYUNvbnN0cnVjdG9yLCBEYXRlU2NoZW1hQ29uc3RydWN0b3IsIFRpbWVTY2hlbWFDb25zdHJ1Y3RvciwgU3RyaW5nU2NoZW1hQ29uc3RydWN0b3IsIE51bWJlclNjaGVtYUNvbnN0cnVjdG9yLCBCb29sU2NoZW1hQ29uc3RydWN0b3IsIHNjaGVtYSBhcyBTY2hlbWFzIH0gZnJvbSBcIi4vc2NoZW1hL3NjaGVtYXNcIlxyXG5cclxuLy9Nb2RlbHNcclxuXHJcbmltcG9ydCB7IE1vZGVsLCBBbnlNb2RlbCB9IGZyb20gXCIuL21vZGVsL21vZGVsXCJcclxuXHJcbmltcG9ydCB7IE1vZGVsQ29udGFpbmVyQmFzZSB9IGZyb20gXCIuL21vZGVsL2NvbnRhaW5lci9iYXNlXCJcclxuXHJcbmltcG9ydCB7IE11bHRpSW5kZXhlZENvbnRhaW5lciB9IGZyb20gXCIuL21vZGVsL2NvbnRhaW5lci9tdWx0aVwiXHJcblxyXG5pbXBvcnQgeyBCVHJlZU1vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4vbW9kZWwvY29udGFpbmVyL2J0cmVlXCJcclxuXHJcbmltcG9ydCB7IEFycmF5TW9kZWxDb250YWluZXIgfSBmcm9tIFwiLi9tb2RlbC9jb250YWluZXIvYXJyYXlcIlxyXG5cclxuLy9WaWV3c1xyXG5cclxuaW1wb3J0IHsgVmlldyB9IGZyb20gXCIuL3ZpZXcvdmlld1wiXHJcblxyXG4vL1NvdXJjZVxyXG5cclxuaW1wb3J0IHsgU291cmNlQmFzZSB9IGZyb20gXCIuL3NvdXJjZS9iYXNlXCJcclxuXHJcbmltcG9ydCB7IEN1c3RvbVNvdXJjZSB9IGZyb20gXCIuL3NvdXJjZS9zb3VyY2VcIlxyXG5cclxuaW1wb3J0IHsgU291cmNlQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9zb3VyY2Uvc291cmNlX2NvbnN0cnVjdG9yXCJcclxuXHJcbmltcG9ydCB7IEZpbHRlciB9IGZyb20gXCIuL3NvdXJjZS9jYXNzZXR0ZS9maWx0ZXJcIlxyXG5cclxuaW1wb3J0IHsgRm9ybSB9IGZyb20gXCIuL3NvdXJjZS9jYXNzZXR0ZS9mb3JtXCJcclxuXHJcbmltcG9ydCB7IENhc3NldHRlIH0gZnJvbSBcIi4vc291cmNlL2Nhc3NldHRlL2Nhc3NldHRlXCJcclxuXHJcbi8vTmV0d29ya1xyXG5cclxuaW1wb3J0IHsgR2V0dGVyIH0gZnJvbSBcIi4vbmV0d29yay9nZXR0ZXJcIlxyXG5cclxuaW1wb3J0IHsgU2V0dGVyIH0gZnJvbSBcIi4vbmV0d29yay9zZXR0ZXJcIlxyXG5cclxuLy9Sb3V0aW5nXHJcblxyXG5pbXBvcnQgeyBXVVJMIH0gZnJvbSBcIi4vbmV0d29yay9yb3V0ZXIvd3VybFwiXHJcblxyXG5pbXBvcnQgeyBSb3V0ZXIsIFVSTCB9IGZyb20gXCIuL25ldHdvcmsvcm91dGVyL3JvdXRlclwiXHJcblxyXG4vL090aGVyXHJcblxyXG5pbXBvcnQgKiBhcyBBbmltYXRpb24gZnJvbSBcIi4vYW5pbWF0aW9uL2FuaW1hdGlvblwiXHJcblxyXG5pbXBvcnQgKiBhcyBDb21tb24gZnJvbSBcIi4vY29tbW9uL2NvbW1vblwiXHJcblxyXG5sZXQgTElOS0VSX0xPQURFRCA9IGZhbHNlO1xyXG5sZXQgREVCVUdHRVIgPSB0cnVlO1xyXG5cclxuLyoqXHJcbiAqICAgIENyZWF0ZXMgYSBuZXcge1JvdXRlcn0gaW5zdGFuY2UsIHBhc3NpbmcgYW55IHByZXNldHMgZnJvbSB0aGUgY2xpZW50LlxyXG4gKiAgICBJdCB3aWxsIHRoZW4gd2FpdCBmb3IgdGhlIGRvY3VtZW50IHRvIGxvYWQsIGFuZCBvbmNlIGxvYWRlZCwgd2lsbCBzdGFydCB0aGUgbGlua2VyIGFuZCBsb2FkIHRoZSBjdXJyZW50IHBhZ2UgaW50byB0aGUgbGlua2VyLlxyXG4gKlxyXG4gKiAgICBOb3RlOiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlLiBBbnkgc3Vic2VxdWVudCBjYWxscyB3aWxsIG5vdCBkbyBhbnl0aGluZy5cclxuICpcclxuICogICAgQHBhcmFtIHtSb3V0ZXJQcmVzZXRzfSBwcmVzZXRzIC0gQW4gb2JqZWN0IG9mIHVzZXIgZGVmaW5lZCBXaWNrIG9iamVjdHMuXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gc3RhcnRSb3V0aW5nKHByZXNldHMpIHtcclxuXHJcbiAgICAvKlxyXG4gICAgICBUaGUgc3RhdGljIGZpZWxkIGluIHByZXNldHMgYXJlIGFsbCBDb21wb25lbnQtbGlrZSBvYmplY3RzIGNvbnN0cnVjdG9ycyB0aGF0IGFyZSBkZWZpbmVkIGJ5IHRoZSBjbGllbnRcclxuICAgICAgdG8gYmUgdXNlZCBieSBXaWNrIGZvciBjdXN0b20gY29tcG9uZW50cy5cclxuXHJcbiAgICAgIFRoZSBjb25zdHJ1Y3RvcnMgbXVzdCBzdXBwb3J0IHNldmVyYWwgQ29tcG9uZW50IGJhc2VkIG1ldGhvZHMgaW4gb3JkZXJlZCB0byBiZSBhY2NlcHRlZCBmb3IgdXNlLiBUaGVzZSBtZXRob2RzIGluY2x1ZGU6XHJcbiAgICAgICAgdHJhbnNpdGlvbkluXHJcbiAgICAgICAgdHJhbnNpdGlvbk91dFxyXG4gICAgICAgIHNldE1vZGVsXHJcbiAgICAgICAgdW5zZXRNb2RlbFxyXG4gICAgKi9cclxuXHJcbiAgICBpZiAocHJlc2V0cy5zdGF0aWMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wb25lbnRfbmFtZSBpbiBwcmVzZXRzLnN0YXRpYykge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHByZXNldHMuc3RhdGljW2NvbXBvbmVudF9uYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhID0gMCxcclxuICAgICAgICAgICAgICAgIGIgPSAwLFxyXG4gICAgICAgICAgICAgICAgYyA9IDAsXHJcbiAgICAgICAgICAgICAgICBkID0gMCxcclxuICAgICAgICAgICAgICAgIGUgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKChhID0gKGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluICYmIGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbkluIGluc3RhbmNlb2YgRnVuY3Rpb24pKSAmJlxyXG4gICAgICAgICAgICAgICAgKGIgPSAoY29tcG9uZW50LnByb3RvdHlwZS50cmFuc2l0aW9uT3V0ICYmIGNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNpdGlvbk91dCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgJiZcclxuICAgICAgICAgICAgICAgIChjID0gKGNvbXBvbmVudC5wcm90b3R5cGUuc2V0TW9kZWwgJiYgY29tcG9uZW50LnByb3RvdHlwZS5zZXRNb2RlbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgJiZcclxuICAgICAgICAgICAgICAgIChkID0gKGNvbXBvbmVudC5wcm90b3R5cGUudW5zZXRNb2RlbCAmJiBjb21wb25lbnQucHJvdG90eXBlLnVuc2V0TW9kZWwgaW5zdGFuY2VvZiBGdW5jdGlvbikpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTdGF0aWMoY29tcG9uZW50X25hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RhdGljIGNvbXBvbmVudCAke2NvbXBvbmVudF9uYW1lfSBsYWNrcyBjb3JyZWN0IGNvbXBvbmVudCBtZXRob2RzLCBcXG5IYXMgdHJhbnNpdGlvbkluIGZ1bmN0aW9uOiR7YX1cXG5IYXMgdHJhbnNpdGlvbk91dCBmdW5jdG9uOiR7Yn1cXG5IYXMgc2V0IG1vZGVsIGZ1bmN0aW9uOiR7Y31cXG5IYXMgdW5zZXRNb2RlbCBmdW5jdGlvbjoke2R9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBUT0RPXHJcbiAgICAgICAgQGRlZmluZSBQYWdlUGFyc2VyXHJcblxyXG4gICAgICAgIEEgcGFnZSBwYXJzZXIgd2lsbCBwYXJzZSB0ZW1wbGF0ZXMgYmVmb3JlIHBhc3NpbmcgdGhhdCBkYXRhIHRvIHRoZSBTb3VyY2UgaGFuZGxlci5cclxuICAgICovXHJcbiAgICBpZiAocHJlc2V0cy5wYXJzZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBwYXJzZXJfbmFtZSBpbiBwcmVzZXRzLnBhZ2VfcGFyc2VyKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJzZXIgPSBwcmVzZXRzLnBhZ2VfcGFyc2VyW3BhcnNlcl9uYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgU2NoZW1hcyBwcm92aWRlIHRoZSBjb25zdHJ1Y3RvcnMgZm9yIE1vZGVsc1xyXG4gICAgKi9cclxuICAgIGlmIChwcmVzZXRzLnNjaGVtYXMpIHtcclxuXHJcbiAgICAgICAgcHJlc2V0cy5zY2hlbWFzLmFueSA9IEFueU1vZGVsO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJlc2V0cy5zY2hlbWFzID0ge1xyXG4gICAgICAgICAgICBhbnk6IEFueU1vZGVsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJlc2V0cy5tb2RlbHMpIHtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByZXNldHMubW9kZWxzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKERFQlVHR0VSKSBjb25zb2xlLmxvZyhwcmVzZXRzKVxyXG5cclxuICAgIGlmIChMSU5LRVJfTE9BREVEKSByZXR1cm47XHJcblxyXG4gICAgTElOS0VSX0xPQURFRCA9IHRydWU7XHJcblxyXG4gICAgLy9QYXNzIGluIHRoZSBwcmVzZXRzIG9yIGEgcGxhaW4gb2JqZWN0IGlmIHByZXNldHMgaXMgdW5kZWZpbmVkLlxyXG5cclxuICAgIGxldCBsaW5rID0gbmV3IFJvdXRlcihwcmVzZXRzIHx8IHt9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG5cclxuICAgICAgICBsaW5rLmxvYWRQYWdlKFxyXG4gICAgICAgICAgICBsaW5rLmxvYWROZXdQYWdlKGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLCBkb2N1bWVudCksXHJcbiAgICAgICAgICAgIG5ldyBXVVJMKGRvY3VtZW50LmxvY2F0aW9uKSxcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICApO1xyXG4gICAgfSlcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgJHt3aWNrX3Zhbml0eX1Db3B5cmlnaHQgMjAxOCBBbnRob255IEMgV2VhdGhlcnNieVxcbmh0dHBzOi8vZ2l0bGFiLmNvbS9hbnRob255Y3dlYXRoZXJzYnkvd2lja2ApXHJcbn1cclxuXHJcbi8qKlxyXG4gICAgRXhwb3J0cyBcclxuKi9cclxuXHJcbi8vQ29uc3RydWN0IE1vZGVsIEV4cG9ydHNcclxuY29uc3QgbW9kZWwgPSBNb2RlbDtcclxuXHJcbm1vZGVsLmFueSA9IChkYXRhKSA9PiBuZXcgQW55TW9kZWwoZGF0YSk7XHJcbm1vZGVsLmFueS5jb25zdHIgPSBBbnlNb2RlbDtcclxubW9kZWwuY29udGFpbmVyID0ge1xyXG4gICAgbXVsdGk6ICguLi5hcmdzKSA9PiBuZXcgTXVsdGlJbmRleGVkQ29udGFpbmVyKC4uLmFyZ3MpLFxyXG4gICAgYXJyYXk6ICguLi5hcmdzKSA9PiBuZXcgQXJyYXlNb2RlbENvbnRhaW5lciguLi5hcmdzKSxcclxuICAgIGJ0cmVlOiAoLi4uYXJncykgPT4gbmV3IEJUcmVlTW9kZWxDb250YWluZXIoLi4uYXJncyksXHJcbiAgICBjb25zdHI6IE1vZGVsQ29udGFpbmVyQmFzZVxyXG59XHJcblxyXG5tb2RlbC5jb250YWluZXIuY29uc3RyLm11bHRpID0gTXVsdGlJbmRleGVkQ29udGFpbmVyO1xyXG5tb2RlbC5jb250YWluZXIuY29uc3RyLmFycmF5ID0gQXJyYXlNb2RlbENvbnRhaW5lcjtcclxubW9kZWwuY29udGFpbmVyLmNvbnN0ci5idHJlZSA9IEJUcmVlTW9kZWxDb250YWluZXI7XHJcblxyXG5PYmplY3QuZnJlZXplKG1vZGVsLmNvbnRhaW5lci5jb25zdHIpO1xyXG5PYmplY3QuZnJlZXplKG1vZGVsLmNvbnRhaW5lcik7XHJcbk9iamVjdC5mcmVlemUobW9kZWwuYW55KTtcclxuT2JqZWN0LmZyZWV6ZShtb2RlbCk7XHJcblxyXG4vL0NvbnN0cnVjdCBTY2hlbWEgRXhwb3J0c1xyXG5jb25zdCBzY2hlbWEgPSBTY2hlbWFzO1xyXG5zY2hlbWEuY29uc3RyID0gU2NoZW1hQ29uc3RydWN0b3I7XHJcbnNjaGVtYS5jb25zdHIuYm9vbCA9IEJvb2xTY2hlbWFDb25zdHJ1Y3Rvcjtcclxuc2NoZW1hLmNvbnN0ci5udW1iZXIgPSBOdW1iZXJTY2hlbWFDb25zdHJ1Y3Rvcjtcclxuc2NoZW1hLmNvbnN0ci5zdHJpbmcgPSBTdHJpbmdTY2hlbWFDb25zdHJ1Y3Rvcjtcclxuc2NoZW1hLmNvbnN0ci5kYXRlID0gRGF0ZVNjaGVtYUNvbnN0cnVjdG9yO1xyXG5zY2hlbWEuY29uc3RyLnRpbWUgPSBUaW1lU2NoZW1hQ29uc3RydWN0b3I7XHJcblxyXG5PYmplY3QuZnJlZXplKHNjaGVtYS5jb25zdHIpO1xyXG5PYmplY3QuZnJlZXplKHNjaGVtYSk7XHJcblxyXG5cclxuY29uc3QgY29yZSA9IHtcclxuICAgIENvbW1vbixcclxuICAgIEFuaW1hdGlvbixcclxuICAgIHZpZXc6IHtWaWV3fSxcclxuICAgIHNjaGVtYToge1xyXG4gICAgICAgIGluc3RhbmNlcyA6IFNjaGVtYXMsXHJcbiAgICAgICAgU2NoZW1hQ29uc3RydWN0b3IsXHJcbiAgICAgICAgRGF0ZVNjaGVtYUNvbnN0cnVjdG9yLFxyXG4gICAgICAgIFRpbWVTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBTdHJpbmdTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBOdW1iZXJTY2hlbWFDb25zdHJ1Y3RvcixcclxuICAgICAgICBCb29sU2NoZW1hQ29uc3RydWN0b3JcclxuICAgIH0sXHJcbiAgICBtb2RlbDoge1xyXG4gICAgICAgIE1vZGVsLFxyXG4gICAgICAgIEFueU1vZGVsLFxyXG4gICAgICAgIE1vZGVsQ29udGFpbmVyQmFzZSxcclxuICAgICAgICBNdWx0aUluZGV4ZWRDb250YWluZXIsXHJcbiAgICAgICAgQXJyYXlNb2RlbENvbnRhaW5lcixcclxuICAgICAgICBCVHJlZU1vZGVsQ29udGFpbmVyXHJcbiAgICB9LFxyXG4gICAgbmV0d29yazoge1xyXG4gICAgICAgIHJvdXRlcjoge1xyXG4gICAgICAgICAgICBXVVJMLFxyXG4gICAgICAgICAgICBVUkwsXHJcbiAgICAgICAgICAgIFJvdXRlclxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0dGVyLFxyXG4gICAgICAgIFNldHRlcixcclxuICAgIH0sXHJcbiAgICBzb3VyY2U6IHtcclxuICAgICAgICBDdXN0b21Tb3VyY2UsXHJcbiAgICAgICAgU291cmNlQmFzZSxcclxuICAgICAgICBTb3VyY2VDb25zdHJ1Y3RvcixcclxuICAgICAgICBDYXNzZXR0ZSxcclxuICAgICAgICBGb3JtLFxyXG4gICAgICAgIEZpbHRlclxyXG4gICAgfVxyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKGNvcmUpO1xyXG5cclxuY29uc3QgYW55ID0gbW9kZWwuYW55O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIGNvcmUsXHJcbiAgICBzY2hlbWEsXHJcbiAgICBtb2RlbCxcclxuICAgIGFueSxcclxuICAgIHN0YXJ0Um91dGluZ1xyXG59Il0sIm5hbWVzIjpbInNjaGVtYSIsIk1vZGVsIiwiU291cmNlIiwiQVNULlJvb3QiLCJBU1QuVGFwTm9kZSIsIkFTVC5GaWx0ZXJOb2RlIiwiQVNULlRlcm1Ob2RlIiwiQVNULlNvdXJjZU5vZGUiLCJBU1QuUGlwZU5vZGUiLCJBU1QuR2VuZXJpY05vZGUiLCJTY2hlbWFzIl0sIm1hcHBpbmdzIjoiOzs7SUFBQTtJQUNBO0lBQ0E7SUFDQSxNQUFNLGlCQUFpQixDQUFDOztJQUV4QixJQUFJLFdBQVcsR0FBRzs7SUFFbEIsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNyQyxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTs7SUFFakIsUUFBUSxPQUFPLEtBQUssQ0FBQztJQUNyQixLQUFLOztJQUVMOztJQUVBO0lBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTs7SUFFMUIsUUFBUSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUM1QixLQUFLOztJQUVMLElBQUksTUFBTSxHQUFHOztJQUViLFFBQVEsT0FBTyxJQUFJLENBQUM7SUFDcEIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7SUFDbEI7SUFDQSxRQUFRLE9BQU8sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUMxQixLQUFLO0lBQ0wsQ0FBQzs7SUNqQ0QsTUFBTSx1QkFBdUIsU0FBUyxpQkFBaUIsQ0FBQzs7SUFFeEQsSUFBSSxXQUFXLEdBQUc7O0lBRWxCLFFBQVEsS0FBSyxFQUFFLENBQUM7O0lBRWhCLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDN0IsS0FBSzs7SUFFTCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7O0lBRWpCLFFBQVEsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFOztJQUUxQixRQUFRLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztJQUU1QixRQUFRLElBQUks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QUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixHQUFHO0lBQ0gsRUFBRTs7SUFFRixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsQixFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRCxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7O0lBRTFELENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDO0lBQzFELENBQUM7O0lD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QUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsUUFBUSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTFCLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O0lBRXZCLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O0lBRXZCLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQzVCLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztJQUU1QixRQUFRLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLFdBQVcsR0FBRztJQUNsQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixRQUFRLElBQUksS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN6RixRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN6RixRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0YsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFF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QzNCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLE9BQU87SUFDVixHQUFHO0lBQ0g7SUFDQSxFQUFFLElBQUksT0FBTyxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUU7SUFDOUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixHQUFHLE9BQU87SUFDVixHQUFHOztJQUVILEVBQUUsSUFBSSxFQUFFLFlBQVksS0FBSyxFQUFFO0lBQzNCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsR0FBRyxPQUFPO0lBQ1YsR0FBRztJQUNILEVBQUU7O0lBRUYsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7SUFDeEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUM7O0lBRXhCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsRUFBRSxPQUFPLElBQUksTUFBTTtJQUNuQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDZCxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNkLEdBQUc7SUFDSCxFQUFFOztJQUVGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNSLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELEVBQUU7O0lBRUYsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ1IsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsRUFBRTs7SUFFRixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDVixFQUFFLE9BQU8sSUFBSSxPQUFPO0lBQ3BCLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxHQUFHO0lBQ0gsRUFBRTtJQUNGO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7SUFFQSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztJQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFDN0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7SUFFZCxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDN0IsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDYixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFDaEQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDYixHQUFHLFlBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOztJQUV6QztJQUNBLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDOztJQUVsQztJQUNBLEVBQUUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3hCLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDL0IsR0FBRzs7SUFFSDtJQUNBLEVBQUUsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQzFCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztJQUN4QixHQUFHOztJQUVIO0lBQ0EsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsRUFBRSxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLEVBQUUsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDaEIsRUFBRTs7SUFFRixDQUFDLE1BQU0sR0FBRztJQUNWLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxFQUFFOztJQUVGLENBQUMsTUFBTSxHQUFHO0lBQ1YsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELEVBQUU7SUFDRjtJQUNBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNYLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDN0MsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRTtJQUNsQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0lBQzFCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0lBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtJQUMzQixHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNwRCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztJQUNmLEdBQUcsWUFBWSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7O0lBRXpDO0lBQ0EsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDOztJQUVuQjs7SUFFQTtJQUNBLEVBQUUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3hCLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLEdBQUcsS0FBSyxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7SUFDaEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLEdBQUcsSUFBSTtJQUNQLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9CO0lBQ0EsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFD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LEdBQUcsRUFBRSxDQUFDOztJQUV6QyxZQUFZLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0lBRTNDLFlBQVksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDNUQsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7SUFFNUQsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDMUMsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7O0lBRTFDLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsVUFBUzs7SUFFVCxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUs7O0lBRTlCLFlBQVksSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDOztJQUU3QyxZQUFZLElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7O0lBRTNDLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRWxFLFlBQVksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7O0lBRTNCLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7SUFFM0QsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNoQyxZQUFZLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDOztJQUVoQyxZQUFZLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLFlBQVksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakUsVUFBUzs7SUFFVCxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUs7O0lBRTlCLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDeEIsZ0JBQWdCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQyxnQkFBZ0IsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3BDLGdCQUFnQixPQUFPLEtBQUssQ0FBQztJQUM3QixhQUFhOztJQUViLFlBQVksUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7SUFFekMsWUFBWSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQzs7SUFFNUIsWUFBWSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztJQUUzQyxZQUFZLElBQUksQ0FBQyxLQUFLO0lBQ3RCLGdCQUFnQixPQUFPOztJQUV2QixZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUMxQyxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7SUFFMUMsWUFBWSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvRCxZQUFZLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELFVBQVM7O0lBRVQsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0lBRTlELFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0lBRTVCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLEdBQUc7SUFDakIsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUM5QixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRSxLQUFLOzs7O0lBSUwsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFDL0IsUUFBUSxJQUFJLFFBQVEsWUFBWSxRQUFRLEVBQUU7O0lBRTFDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVELGdCQUFnQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLE1BQU07SUFDekQsYUFBYTs7SUFFYixZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksbUJBQW1CLENBQUMsUUFBUSxFQUFFO0lBQ2xDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3hELFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtJQUMvQyxnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWE7SUFDYixTQUFTO0lBQ1QsS0FBSztJQUNMLENBQUM7O0lDaElEO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUMsR0FBRyxPQUFPLE1BQU0sQ0FBQyxLQUFLLFFBQVEsQ0FBQztJQUNoQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNoRSxFQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsRUFBRTs7SUFFRixDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0FBQ0QsQUFlQTtJQUNBO0lBQ0E7SUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFVO0lBQzNDLElBQUksUUFBUSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzdGLEVBQUM7O0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVTtJQUM1QyxJQUFJLFFBQVEsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUMvRixFQUFDOztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQzdELElBQUksUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNwSCxFQUFDOztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQzlELElBQUksUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDaEgsRUFBQzs7SUFFRCxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFVBQVUsQ0FBQztJQUNqRCxDQUFDLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RSxFQUFDO0lBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBQUksSkM3REosSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM1QixVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUV0QixNQUFNLHFCQUFxQixTQUFTLHVCQUF1QixDQUFDOztJQUU1RCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7O0lBRWpCLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDekIsWUFBWSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFbkMsUUFBUSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRTdCLFFBQVEsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDOztJQUUzQyxRQUFRLElBQUksSUFBSSxFQUFFOztJQUVsQixZQUFZLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsWUFBWSxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLFlBQVksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxZQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRWxDLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLFlBQVksSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLFlBQVksSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDO0lBQzlDLFlBQVksVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxZQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsWUFBWSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUV2QyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEdBQUU7O0lBRXRCLFlBQVksSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFOztJQUUzQixnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDO0lBQ3BELGdCQUFnQixHQUFHLENBQUMsSUFBSSxHQUFFO0lBQzFCLGdCQUFnQixHQUFHLENBQUMsSUFBSSxHQUFFO0lBQzFCLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUM7O0lBRXRELGdCQUFnQixVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLGdCQUFnQixVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLGFBQWE7O0lBRWIsWUFBWSxPQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QyxTQUFTO0lBQ1QsWUFBWSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDL0MsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFOztJQUUxQixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRTFCLFFBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEMsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFOztJQUVoQyxRQUFRLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O0lBRWhDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNuRSxnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLGdCQUFnQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztJQUV6QyxnQkFBZ0IsSUFBSSxLQUFLLElBQUksVUFBVSxJQUFJLFVBQVUsSUFBSSxHQUFHLEVBQUU7SUFDOUQsb0JBQW9CLE9BQU8sSUFBSSxDQUFDO0lBQ2hDLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUzs7SUFFVCxRQUFRLE9BQU8sS0FBSyxDQUFDO0lBQ3JCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0lBQ2xCO0lBQ0EsUUFBUSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLEtBQUs7SUFDTCxDQUFDOztJQUVELElBQUksSUFBSSxHQUFHLElBQUkscUJBQXFCLEVBQUU7O0lDdkZ0QyxNQUFNLHFCQUFxQixTQUFTLHVCQUF1QixDQUFDOztJQUU1RCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDakIsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUN6QixZQUFZLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLFFBQVEsSUFBSTtJQUNaLFlBQVksSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxZQUFZLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLFlBQVksSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksSUFBSSxDQUFDLENBQUM7SUFDbkYsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3BCLFlBQVksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLFlBQVksSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLFlBQVksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLFNBQVM7O0lBRVQsUUFBUSxPQUFPLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ25FLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUMxQixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsUUFBUSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7SUFDaEMsUUFBUSxPQUFPLElBQUk7SUFDbkIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7SUFDbEIsUUFBUSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLEtBQUs7SUFDTCxDQUFDOztJQUVELElBQUksSUFBSSxHQUFHLElBQUkscUJBQXFCLEVBQUU7O0lDaEN0QyxNQUFNLHVCQUF1QixTQUFTLGlCQUFpQixDQUFDO0lBQ3hEO0lBQ0EsSUFBSSxXQUFXLEdBQUc7O0lBRWxCLFFBQVEsS0FBSyxFQUFFLENBQUM7O0lBRWhCLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFFO0lBQzdCLEtBQUs7SUFDTCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7O0lBRWpCLFFBQVEsT0FBTyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQzFCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTs7SUFFMUIsUUFBUSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUM1QixLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7O0lBRWhDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdEQsWUFBWSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNqRCxnQkFBZ0IsT0FBTyxJQUFJLENBQUM7O0lBRTVCLFFBQVEsT0FBTyxLQUFLLENBQUM7SUFDckIsS0FBSztJQUNMLENBQUM7O0lBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSx1QkFBdUIsRUFBRTs7SUM1QjFDLE1BQU0scUJBQXFCLFNBQVMsaUJBQWlCLENBQUM7O0lBRXRELElBQUksV0FBVyxHQUFHOztJQUVsQixRQUFRLEtBQUssRUFBRSxDQUFDOztJQUVoQixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLEtBQUs7O0lBRUwsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFOztJQUVqQixRQUFRLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QyxLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7O0lBRTFCLFFBQVEsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRTVCLFFBQVEsSUFBSSxDQUFDLEtBQUssWUFBWSxPQUFPLEVBQUU7SUFDdkMsWUFBWSxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNqQyxZQUFZLE1BQU0sQ0FBQyxNQUFNLEdBQUcsMkJBQTBCO0lBQ3RELFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7O0lBRWhDLFFBQVEsSUFBSSxLQUFLLFlBQVksT0FBTztJQUNwQyxZQUFZLE9BQU8sSUFBSSxDQUFDOztJQUV4QixRQUFRLE9BQU8sS0FBSyxDQUFDO0lBQ3JCLEtBQUs7SUFDTCxDQUFDOztJQUVELElBQUksSUFBSSxHQUFHLElBQUkscUJBQXFCLEdBQUc7O0lDdkJ2QyxJQUFJLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7O0lDWjFDLE1BQU0sSUFBSTs7SUFFakIsQ0FBQyxXQUFXLEVBQUU7O0lBRWQsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLEVBQUU7O0lBRUYsQ0FBQyxVQUFVLEVBQUU7O0lBRWIsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLO0lBQ2YsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixFQUFFO0lBQ0Y7SUFDQTtJQUNBO0lBQ0EsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDOztJQUViLEVBQUU7SUFDRjtJQUNBO0lBQ0E7SUFDQSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7O0lBRWQsRUFBRTs7SUFFRjtJQUNBO0lBQ0E7SUFDQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7O0lBRVosRUFBRTtJQUNGLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNoQixFQUFFOztJQUVGLENBQUMsS0FBSyxFQUFFO0lBQ1I7SUFDQSxFQUFFO0lBQ0YsQ0FBQyxVQUFVLEVBQUU7O0lBRWIsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLEVBQUU7SUFDRjs7SUMzQ0EsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLHFCQUFxQixJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUMsS0FBSztJQUNoRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGO0lBQ0E7SUFDQTs7SUFFQTtJQUNBO0lBQ0E7O0lBRUEsTUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNOztJQUU1QixJQUFJLFdBQVcsR0FBRzs7SUFFbEIsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDMUMsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7O0lBRTFDLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDOztJQUVoRCxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDOzs7SUFHOUIsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztJQUU1QyxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDOztJQUU1QyxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDdkMsS0FBSzs7SUFFTCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7O0lBRXhCLFFBQVEsSUFBSSxNQUFNLENBQUMsaUJBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxZQUFZLFFBQVE7SUFDMUUsWUFBWSxJQUFJLElBQUksQ0FBQyxpQkFBaUI7SUFDdEMsZ0JBQWdCLE9BQU87SUFDdkI7SUFDQSxnQkFBZ0IsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUU3QyxRQUFRLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7O0lBRXhDLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztJQUd2QyxRQUFRLElBQUksSUFBSSxDQUFDLGlCQUFpQjtJQUNsQyxZQUFZLE9BQU87O0lBRW5CLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQzs7SUFFdEMsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLEdBQUc7O0lBRWIsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDOztJQUV2QyxRQUFRLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7O0lBRW5DLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUM7SUFDakMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRTtJQUM3RTtJQUNBLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEVBQUU7O0lBRTdFLFFBQVEsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDOztJQUVyQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztJQUUxQyxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDOztJQUUvQixRQUFRLElBQUksVUFBVSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7SUFFdkMsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLFlBQVksQ0FBQyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUN4QyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsU0FBUzs7SUFFVCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLEtBQUs7SUFDTCxDQUFDLEdBQUc7O0lDekVKOztBQUVBLElBQU8sTUFBTSxTQUFTLENBQUM7O0lBRXZCLElBQUksV0FBVyxHQUFHOztJQUVsQixRQUFRLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDekMsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRzs7SUFFakI7SUFDQSxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0lBRW5DLFFBQVEsT0FBTyxJQUFJLEVBQUU7SUFDckIsWUFBWSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsWUFBWSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM3QixTQUFTOztJQUVUOztJQUVBLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUMzQyxLQUFLOztJQUVMLElBQUksR0FBRyxHQUFHO0lBQ1YsUUFBUSxPQUFPLElBQUksQ0FBQztJQUNwQixLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksY0FBYyxDQUFDLGFBQWEsRUFBRTs7SUFFbEMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7SUFDNUIsWUFBWSxPQUFPOztJQUVuQixRQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7O0lBRXhELFFBQVEsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRTs7O0lBRzFCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDMUUsWUFBWSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTO0lBQzNELGdCQUFnQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7SUFFdkMsUUFBUSxPQUFPLElBQUksQ0FBQztJQUNwQixLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTs7SUFFbEIsUUFBUSxJQUFJLElBQUksWUFBWSxJQUFJLEVBQUU7O0lBRWxDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSztJQUMxQixnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRTVDLFlBQVksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7SUFFN0MsWUFBWSxPQUFPLFVBQVUsRUFBRTs7SUFFL0IsZ0JBQWdCLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPO0lBQy9DLGdCQUFnQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztJQUM3QyxhQUFhOztJQUViLFlBQVksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDOUIsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDeEMsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7SUFFbkMsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwQyxTQUFTO0lBQ1QsWUFBWSxNQUFNLElBQUksU0FBUyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDbkYsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7O0lBRXJCLFFBQVEsSUFBSSxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFOztJQUV4RCxZQUFZLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDN0MsWUFBWSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7O0lBRWxDLFlBQVksT0FBTyxVQUFVLEVBQUU7O0lBRS9CLGdCQUFnQixJQUFJLElBQUksSUFBSSxVQUFVLEVBQUU7O0lBRXhDLG9CQUFvQixJQUFJLFVBQVUsRUFBRTtJQUNwQyx3QkFBd0IsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3BELHFCQUFxQixNQUFNO0lBQzNCLHdCQUF3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDcEQscUJBQXFCOztJQUVyQixvQkFBb0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFJO0lBQ3BDLG9CQUFvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QyxvQkFBb0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pDLG9CQUFvQixPQUFPO0lBQzNCLGlCQUFpQixBQUNqQjtJQUNBLGdCQUFnQixVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ3hDLGdCQUFnQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztJQUM3QyxhQUFhO0lBQ2IsU0FBUztJQUNULEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFOztJQUVqQixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRS9CLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDL0MsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLFdBQVcsR0FBRzs7SUFFbEIsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztJQUVuQyxRQUFRLE9BQU8sSUFBSSxFQUFFOztJQUVyQixZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztJQUUzRCxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLFNBQVM7O0lBRVQsUUFBUSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMvQyxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7O0lBRTdCLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7SUFFbkMsUUFBUSxPQUFPLElBQUksRUFBRTs7SUFFckIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUUvQixZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLFNBQVM7SUFDVCxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7O0lBRTNCLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7SUFFbkMsUUFBUSxPQUFPLElBQUksRUFBRTs7SUFFckIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU3QixZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksTUFBTSxHQUFHO0lBQ2IsUUFBUSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxLQUFLO0lBQ0wsQ0FBQzs7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFO0lBQ3pELElBQUksUUFBUSxFQUFFLElBQUk7SUFDbEIsSUFBSSxZQUFZLEVBQUUsS0FBSztJQUN2QixJQUFJLFVBQVUsRUFBRSxLQUFLO0lBQ3JCLENBQUMsRUFBQzs7SUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUU7SUFDckUsSUFBSSxRQUFRLEVBQUUsSUFBSTtJQUNsQixJQUFJLFlBQVksRUFBRSxLQUFLO0lBQ3ZCLElBQUksVUFBVSxFQUFFLEtBQUs7SUFDckIsQ0FBQyxFQUFDOztJQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQzs7cUNBQUMsakNDeExqQzs7QUFFQSxJQUFPLE1BQU0sT0FBTyxTQUFTLEtBQUssQ0FBQzs7SUFFbkMsSUFBSSxXQUFXLEdBQUc7SUFDbEIsUUFBUSxLQUFLLEVBQUUsQ0FBQztJQUNoQixLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtJQUNmLFFBQVEsSUFBSSxJQUFJLFlBQVksS0FBSztJQUNqQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUs7SUFDaEMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0lBQzVCLGFBQWEsRUFBQztJQUNkO0lBQ0EsWUFBWSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLEtBQUs7O0lBRUw7SUFDQSxJQUFJLGNBQWMsR0FBRzs7SUFFckIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRzs7SUFFakIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sR0FBRztJQUNiLFFBQVEsT0FBTyxJQUFJLENBQUM7SUFDcEIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sR0FBRztJQUNiLFFBQVEsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEQsS0FBSztJQUNMLENBQUM7O0lBRUQ7SUFDQSxJQUFJLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQztJQUM3QixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXBCLElBQU8sTUFBTSxrQkFBa0IsU0FBUyxTQUFTLENBQUM7O0lBRWxELElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTs7SUFFeEIsUUFBUSxLQUFLLEVBQUUsQ0FBQzs7SUFFaEI7SUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQzNCLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztJQUV6QjtJQUNBLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUM7O0lBRWpDO0lBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7SUFFdEMsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7O0lBRTlEO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxZQUFZLGlCQUFpQjtJQUNqRixZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFNO0lBQzVDO0lBQ0EsWUFBWSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQzs7O0lBR2xELFFBQVEsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0lBRXJCLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUTtJQUNoRixZQUFZLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQUFHcEM7O0lBRVQsUUFBUSxPQUFPLElBQUksQ0FBQzs7SUFFcEIsUUFBUSxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtJQUMvQixZQUFZLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDN0UsU0FBUyxDQUFDO0lBQ1YsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRzs7SUFFakIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7SUFFM0IsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7SUFFaEMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7SUFDekIsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxTQUFTOztJQUVULFFBQVEsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUw7SUFDQTs7SUFFQTtJQUNBO0lBQ0EsSUFBSSxJQUFJLE1BQU0sR0FBRztJQUNqQixRQUFRLE9BQU8sQ0FBQyxDQUFDO0lBQ2pCLEtBQUs7O0lBRUwsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUU7SUFDbEI7SUFDQSxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFO0lBQ2pDLFFBQVEsSUFBSSxTQUFTLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQzs7SUFFMUMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUVsRCxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXpCLFFBQVEsT0FBTyxDQUFDLENBQUM7SUFDakIsS0FBSzs7SUFFTDtJQUNBOztJQUVBO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7SUFDZixRQUFRLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkMsS0FBSzs7SUFFTDtJQUNBOztJQUVBO0lBQ0E7O0lBRUE7SUFDQTtJQUNBLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7O0lBRS9CLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztJQUV2QixRQUFRLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7SUFFN0IsUUFBUSxJQUFJLElBQUksRUFBRTs7Ozs7SUFLbEIsWUFBWSxJQUFJLGVBQWUsRUFBRTtJQUNqQyxnQkFBZ0IsR0FBRyxHQUFHLGVBQWUsQ0FBQztJQUN0QyxhQUFhLE1BQU07O0lBRW5CLGdCQUFnQixJQUFJLGVBQWUsS0FBSyxJQUFJO0lBQzVDLG9CQUFvQixTQUFTLEdBQUcsS0FBSyxDQUFDOztJQUV0QyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO0lBQ2hDLG9CQUFvQixTQUFTLEdBQUcsS0FBSyxDQUFDOztJQUV0QyxnQkFBZ0IsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxhQUFhO0lBQ2IsU0FBUztJQUNULFlBQVksR0FBRyxHQUFHLENBQUMsZUFBZSxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7O0lBRTFGLFFBQVEsSUFBSSxDQUFDLElBQUk7SUFDakIsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLGFBQWE7O0lBRWIsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRTdCLFlBQVksSUFBSSxDQUFDLElBQUksWUFBWSxLQUFLO0lBQ3RDLGdCQUFnQixLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFL0I7SUFDQSxZQUFZLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7SUFHekQsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyQyxTQUFTOztJQUVULFFBQVEsT0FBTyxHQUFHO0lBQ2xCLEtBQUs7O0lBRUw7SUFDQTtJQUNBOztJQUVBO0lBQ0E7SUFDQTs7SUFFQTtJQUNBO0lBQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRyxLQUFLLEVBQUU7O0lBRTFDLFFBQVEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7O0lBRXJELFFBQVEsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDOztJQUV4QixRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE1BQU07SUFDM0MsWUFBWSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU1QyxRQUFRLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtJQUNuQyxZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUNoRCxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO0lBQzlELG9CQUFvQixHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQy9CLFNBQVMsTUFBTSxJQUFJLElBQUk7SUFDdkIsWUFBWSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7SUFHMUQsUUFBUSxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDM0MsWUFBWSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRTVDLFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTs7SUFFdkMsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRXpCLFFBQVEsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztJQUV0RCxRQUFRLElBQUksVUFBVSxJQUFJLFNBQVMsRUFBRTs7SUFFckMsWUFBWSxJQUFJLEVBQUUsS0FBSyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO0lBQ3hGLGdCQUFnQixLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hELGdCQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLGFBQWE7O0lBRWIsWUFBWSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0lBRXpFLFlBQVksSUFBSSxVQUFVLEVBQUU7SUFDNUIsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDO0lBQ2xFLGdCQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLGFBQWE7SUFDYixTQUFTOztJQUVULFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7O0lBR0w7SUFDQTtJQUNBO0lBQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRyxLQUFLLEVBQUU7O0lBRTFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztJQUV6QixRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTs7SUFFN0MsWUFBWSxJQUFJLENBQUMsSUFBSTtJQUNyQixnQkFBZ0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUQ7SUFDQSxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxTQUFTOztJQUVULFFBQVEsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDOztJQUUvQixRQUFRLElBQUksQ0FBQyxJQUFJO0lBQ2pCLFlBQVksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2pDLGFBQWE7SUFDYixZQUFZLElBQUksQ0FBQyxJQUFJLFlBQVksS0FBSyxFQUFFO0lBQ3hDLGdCQUFnQixLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixhQUFhOztJQUViO0lBQ0EsWUFBWSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFekQsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRCxTQUFTOztJQUVULFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFcEMsUUFBUSxPQUFPLGFBQWEsQ0FBQztJQUM3QixLQUFLOztJQUVMO0lBQ0E7O0lBRUE7SUFDQTtJQUNBLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRTs7SUFFMUIsUUFBUSxJQUFJLFNBQVMsWUFBWSxrQkFBa0IsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTs7SUFFakYsWUFBWSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVTtJQUM1QyxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDOztJQUVqRCxZQUFZLElBQUksU0FBUyxDQUFDLElBQUk7SUFDOUIsZ0JBQWdCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7O0lBRXJELFlBQVksSUFBSSxTQUFTLENBQUMsSUFBSTtJQUM5QixnQkFBZ0IsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQzs7SUFFckQsWUFBWSxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNwQyxTQUFTO0lBQ1QsS0FBSzs7SUFFTDtJQUNBOztJQUVBO0lBQ0E7SUFDQSxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDeEIsUUFBUSxJQUFJLFNBQVMsWUFBWSxrQkFBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7O0lBRTFFLFlBQVksU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0lBRXBDLFlBQVksU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztJQUU3QyxZQUFZLElBQUksSUFBSSxDQUFDLFVBQVU7SUFDL0IsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzs7SUFFakQsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7SUFFeEMsWUFBWSxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFTLEtBQUs7SUFDNUMsZ0JBQWdCLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNO0lBQzFDLG9CQUFvQixTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0MsaUJBQWlCLEVBQUUsRUFBRSxFQUFDOztJQUV0QixnQkFBZ0IsT0FBTyxNQUFNO0lBQzdCLG9CQUFvQixZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsb0JBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtJQUN6Qyx3QkFBd0IsT0FBTyxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0lBQzlGLGlCQUFpQjtJQUNqQixhQUFhLEVBQUUsU0FBUyxFQUFDO0lBQ3pCLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksZUFBZSxDQUFDLEtBQUssRUFBRTtJQUMzQixRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDaEMsUUFBUSxPQUFPLENBQUMsRUFBRTtJQUNsQixZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdkIsU0FBUztJQUNULEtBQUs7O0lBRUwsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFO0lBQzFCLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNoQyxRQUFRLE9BQU8sQ0FBQyxFQUFFO0lBQ2xCLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2QixTQUFTO0lBQ1QsS0FBSzs7SUFFTDtJQUNBOztJQUVBO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDaEIsSUFFQSxRQUFRLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7O0lBRWxELFFBQVEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEtBQUs7SUFDakMsWUFBWSxJQUFJLElBQUksWUFBWSxLQUFLO0lBQ3JDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXhELFlBQVksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFELEFBR0E7SUFDQSxVQUFTOztJQUVULFFBQVEsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUV4QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3ZELFlBQVksSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0QsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsU0FBUzs7SUFFVCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUU7SUFDekIsUUFBUSxJQUFJLElBQUksWUFBWSxLQUFLO0lBQ2pDLFlBQVksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO0lBQzNGO0lBQ0EsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztJQUUzRCxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFO0lBQzlDLFFBQVEsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUNoQyxZQUFZLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELFNBQVM7SUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUU7O0lBRTVDLFFBQVEsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztJQUU5QixRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxRQUFRO0lBQ3BDLFlBQVksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3REO0lBQ0EsWUFBWSxVQUFVLEdBQUcsSUFBSSxDQUFDOztJQUU5QixRQUFRLElBQUksVUFBVTtJQUN0QixZQUFZLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQzs7SUFFdkQsUUFBUSxJQUFJLE9BQU8sSUFBSSxVQUFVO0lBQ2pDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQzs7SUFFN0YsUUFBUSxPQUFPLFVBQVUsQ0FBQztJQUMxQixLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0lBRUEsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7SUFDM0MsUUFBUSxPQUFPLEtBQUssQ0FBQztJQUNyQixLQUFLOztJQUVMLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7SUFDbkMsUUFBUSxPQUFPLGVBQWUsQ0FBQztJQUMvQixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtJQUNoQyxRQUFRLE9BQU8sZUFBZSxDQUFDO0lBQy9CLEtBQUs7O0lBRUwsSUFBSSxhQUFhLEdBQUc7SUFDcEIsUUFBUSxPQUFPLEVBQUUsQ0FBQztJQUNsQixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtJQUNyQixRQUFRLE9BQU8sRUFBRSxDQUFDO0lBQ2xCLEtBQUs7O0lBRUw7O0lBRUEsQ0FBQzs7SUNwY0Q7O0FBRUEsSUFBTyxNQUFNLHFCQUFxQixTQUFTLGtCQUFrQixDQUFDOztJQUU5RCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7O0lBRXhCLFFBQVEsS0FBSyxDQUFDO0lBQ2QsWUFBWSxVQUFVLEVBQUUsU0FBUztJQUNqQyxZQUFZLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztJQUMvQixTQUFTLENBQUMsQ0FBQzs7SUFFWCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQzdCLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDMUIsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7SUFFaEMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksSUFBSSxNQUFNLEdBQUc7SUFDakIsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFOztJQUUzQixRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksWUFBWSxFQUFFO0lBQ3ZDLFlBQVksSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU1QyxZQUFZLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDekQsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFekUsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVc7SUFDcEMsb0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUM3RTtJQUNBLG9CQUFvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsYUFBYTtJQUNiLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7O0lBRS9CLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDOztJQUVyQixRQUFRLElBQUksSUFBSSxFQUFFO0lBQ2xCLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJO0lBQ2pDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3RDLG9CQUFvQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3BGLFNBQVM7O0lBRVQsWUFBWSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7OztJQUc3QyxRQUFRLE9BQU8sR0FBRyxDQUFDO0lBQ25CLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFOztJQUVqQixRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQzs7SUFFckIsUUFBUSxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUk7SUFDMUIsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9CLGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUVsRTs7SUFFQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7SUFDcEQsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7SUFDL0MsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUUvQztJQUNBLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDMUIsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRXpDLFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTs7SUFFNUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxNQUFLOztJQUV2QixRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs7SUFFdkMsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUUzQyxZQUFZLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDbkMsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDM0I7SUFDQTtJQUNBLFNBQVM7O0lBRVQsUUFBUSxJQUFJLEdBQUc7SUFDZixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDOztJQUVyRCxRQUFRLE9BQU8sR0FBRyxDQUFDO0lBQ25CLEtBQUs7SUFDTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7O0lBRXJCLFFBQVEsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDOztJQUV4QixRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUN2QyxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2xDLGdCQUFnQixHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQzNCLFNBQVM7O0lBRVQsUUFBUSxPQUFPLEdBQUcsQ0FBQztJQUNuQixLQUFLOztJQUVMLElBQUksYUFBYSxHQUFHOztJQUVwQixRQUFRLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQzs7SUFFeEIsUUFBUSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDdkMsWUFBWSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7SUFDckMsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDM0IsU0FBUzs7SUFFVCxRQUFRLE9BQU8sR0FBRyxDQUFDO0lBQ25CLEtBQUs7OztJQUdMO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLElBQUksRUFBRTtJQUM1QyxRQUFRLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLEdBQUc7SUFDYixRQUFRLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLEtBQUs7SUFDTDs7S0FBQyxEQzVJRDtJQUNBO0lBQ0E7SUFDQTtBQUNBLElBQU8sTUFBTSxtQkFBbUIsU0FBUyxrQkFBa0IsQ0FBQzs7SUFFNUQsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO0lBQ3hCLFFBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDdkIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRzs7SUFFakIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7SUFFekIsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLElBQUksTUFBTSxHQUFHO0lBQ2pCLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNoQyxLQUFLOztJQUVMLElBQUksaUJBQWlCLEdBQUc7SUFDeEIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQzs7SUFFNUMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFckQsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUV6QixRQUFRLE9BQU8sQ0FBQyxDQUFDO0lBQ2pCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7O0lBRTVDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0lBRTFELFlBQVksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFbkMsWUFBWSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUU7O0lBRTNELGdCQUFnQixHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUvQixnQkFBZ0IsT0FBTyxLQUFLLENBQUM7SUFDN0IsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFOUIsUUFBUSxJQUFJLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUzQyxRQUFRLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTs7SUFFL0IsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRXpCLFFBQVEsSUFBSSxJQUFJO0lBQ2hCLFlBQVksSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO0lBQ3ZDLGdCQUFnQixLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzdCLGFBQWE7SUFDYixnQkFBZ0IsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7SUFJL0IsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxRCxZQUFZLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsWUFBWSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7SUFDcEQsZ0JBQWdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxPQUFPLFdBQVcsQ0FBQztJQUMzQixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTs7SUFFNUIsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSztJQUNqQyxZQUFZLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0lBQy9CLFNBQVMsRUFBQzs7SUFFVixRQUFRLE9BQU8sV0FBVyxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxhQUFhLEdBQUc7SUFDcEIsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztJQUVoRCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7SUFFN0IsUUFBUSxPQUFPLEtBQUssQ0FBQztJQUNyQixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7SUFDcEMsUUFBUSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDM0IsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxRCxZQUFZLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRW5DLFlBQVksSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFOztJQUVuRCxnQkFBZ0IsTUFBTSxHQUFHLElBQUksQ0FBQzs7SUFFOUIsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUFFdkMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO0lBQ3BCLGdCQUFnQixDQUFDLEVBQUUsQ0FBQzs7SUFFcEIsZ0JBQWdCLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxPQUFPLE1BQU0sQ0FBQztJQUN0QixLQUFLOztJQUVMLElBQUksTUFBTSxHQUFHOztJQUViLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3pCLEtBQUs7SUFDTCxDQUFDOztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1COztzQ0FBQyxsQ0NySGxDOztBQUVBLElBQU8sTUFBTSxtQkFBbUIsU0FBUyxrQkFBa0IsQ0FBQzs7SUFFNUQsSUFBSSxXQUFXLENBQUNBLFNBQU0sRUFBRTs7SUFFeEIsUUFBUSxHQUFHLENBQUNBLFNBQU0sSUFBSSxFQUFFQSxTQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRUEsU0FBTSxDQUFDLE1BQU0sWUFBWSx1QkFBdUIsQ0FBQztJQUM5RixZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMseUhBQXlILENBQUMsQ0FBQztJQUN2SjtJQUNBLFFBQVEsS0FBSyxDQUFDQSxTQUFNLENBQUMsQ0FBQzs7SUFFdEIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDdEIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN0QixLQUFLOztJQUVMLElBQUksVUFBVSxHQUFHO0lBQ2pCLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSTtJQUNyQixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0lBRW5DLFFBQVEsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxJQUFJLE1BQU0sR0FBRztJQUNqQixRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUN6QixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFOztJQUU1QyxRQUFRLElBQUksTUFBTSxHQUFHO0lBQ3JCLFlBQVksS0FBSyxFQUFFLEtBQUs7SUFDeEIsU0FBUyxDQUFDOztJQUVWLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO0lBQ3RCLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFNUMsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDOztJQUV4RixRQUFRLElBQUksUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRTNDLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSztJQUN4QixZQUFZLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFFeEIsUUFBUSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDNUIsS0FBSzs7SUFFTCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFOztJQUVwQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMzQyxZQUFZLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7SUFDbkMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDM0YsYUFBYSxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDekMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDM0YsYUFBYSxNQUFNO0lBQ25CLGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNuRSxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDbkcsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxPQUFPLGVBQWUsQ0FBQztJQUMvQixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDckMsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7O0lBRXZCLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzNDLFlBQVksSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUNuQyxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1RixnQkFBZ0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDL0IsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN2QyxhQUFhLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN6QyxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1RixnQkFBZ0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDL0IsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN2QyxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDckUsb0JBQW9CLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BHLG9CQUFvQixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzNDLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUzs7SUFFVCxRQUFRLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDOztJQUU1QixRQUFRLE9BQU8sTUFBTSxLQUFLLENBQUMsQ0FBQztJQUM1QixLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtJQUNoQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUk7SUFDckIsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDaEUsUUFBUSxPQUFPLGVBQWUsQ0FBQztJQUMvQixLQUFLOztJQUVMLElBQUksYUFBYSxHQUFHO0lBQ3BCLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSTtJQUNyQixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkMsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN6QixLQUFLOztJQUVMLElBQUksTUFBTSxHQUFHO0lBQ2IsUUFBUSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0lBRTFCLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztJQUV2QixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6RCxTQUFTOztJQUVULFFBQVEsT0FBTyxRQUFRLENBQUM7SUFDeEIsS0FBSztJQUNMLENBQUM7O0lBRUQsTUFBTSxTQUFTLENBQUM7SUFDaEIsSUFBSSxXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRTtJQUNqQyxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQzVCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDeEIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN2QixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLEdBQUc7O0lBRWpCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDMUIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7SUFFekIsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtJQUN4QixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUM3RCxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMzQyxTQUFTOztJQUVULEtBQUs7O0lBRUwsSUFBSSxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUU7SUFDN0MsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtJQUMxQzs7SUFFQSxZQUFZLElBQUksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFbkQsWUFBWSxJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU1QyxZQUFZLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRXZDLFlBQVksSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RELFlBQVksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBQzs7SUFFakYsWUFBWSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RSxZQUFZLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOztJQUVoRixZQUFZLE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0lBQ3RDLFlBQVksT0FBTyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7O0lBRXhDLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7SUFDbEMsWUFBWSxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQzs7SUFFcEMsWUFBWSxJQUFJLE9BQU8sRUFBRTs7SUFFekIsZ0JBQWdCLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7O0lBRTNDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztJQUUvQyxnQkFBZ0IsT0FBTztJQUN2QixvQkFBb0IsT0FBTyxFQUFFLElBQUk7SUFDakMsb0JBQW9CLEdBQUcsRUFBRSxHQUFHO0lBQzVCLGlCQUFpQixDQUFDO0lBQ2xCLGFBQWE7O0lBRWIsWUFBWSxPQUFPO0lBQ25CLGdCQUFnQixPQUFPLEVBQUUsT0FBTztJQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLEdBQUc7SUFDeEIsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxPQUFPO0lBQ2YsWUFBWSxPQUFPLEVBQUUsSUFBSTtJQUN6QixZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLFNBQVMsQ0FBQztJQUNWLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxHQUFHLEtBQUssRUFBRSxNQUFNLEVBQUU7O0lBRWpFLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0lBRWpDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7O0lBRXhCLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7SUFFeEMsZ0JBQWdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXZDLGdCQUFnQixJQUFJLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDdEMsb0JBQW9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTdDLG9CQUFvQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRixvQkFBb0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxvQkFBb0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7SUFFNUMsb0JBQW9CLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRSxRQUFROztJQUVuRCxvQkFBb0IsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0lBQ3pDLHdCQUF3QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JELHdCQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3RCxxQkFBcUI7O0lBRXJCLG9CQUFvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLGlCQUFpQjtJQUNqQixhQUFhOztJQUViLFlBQVksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFckMsWUFBWSxJQUFJO0lBQ2hCLGdCQUFnQixPQUFPO0lBQ3ZCLGdCQUFnQixHQUFHO0lBQ25CLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7SUFFeEUsWUFBWSxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUUsUUFBUTs7SUFFMUMsWUFBWSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7SUFDakMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxhQUFhOztJQUViLFlBQVksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7SUFFekQsU0FBUyxNQUFNOztJQUVmLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUQsZ0JBQWdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXZDLGdCQUFnQixJQUFJLFVBQVUsSUFBSSxHQUFHLEVBQUU7SUFDdkMsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUUzQyxvQkFBb0IsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0lBRXpDLG9CQUFvQixPQUFPO0lBQzNCLHdCQUF3QixPQUFPLEVBQUUsSUFBSTtJQUNyQyx3QkFBd0IsR0FBRyxFQUFFLFVBQVU7SUFDdkMscUJBQXFCLENBQUM7SUFDdEIsaUJBQWlCLE1BQU0sSUFBSSxVQUFVLEdBQUcsR0FBRyxFQUFFOztJQUU3QyxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RCxvQkFBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7SUFFbkQsb0JBQW9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztJQUV4QyxvQkFBb0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxpQkFBaUI7SUFDakIsYUFBYTs7SUFFYixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZDLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRW5DLFlBQVksTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRWhDLFlBQVksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxTQUFTOztJQUVULFFBQVEsT0FBTztJQUNmLFlBQVksT0FBTyxFQUFFLElBQUk7SUFDekIsWUFBWSxHQUFHLEVBQUUsVUFBVTtJQUMzQixTQUFTLENBQUM7SUFDVixLQUFLOztJQUVMLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDbkMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6QyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFDLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFckM7SUFDQSxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsRUFBRTs7SUFFakQsWUFBWSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN0QyxZQUFZLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDOztJQUV2QyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFbkQsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7SUFFckQsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7SUFFdkMsWUFBWSxPQUFPLEtBQUssQ0FBQztJQUN6QixTQUFTO0lBQ1Q7SUFDQSxZQUFZLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsRUFBRTs7SUFFdkQsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRSxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUVoRCxnQkFBZ0IsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0lBRXpDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRS9FLGdCQUFnQixPQUFPLEtBQUssQ0FBQzs7SUFFN0IsYUFBYSxNQUFNOztJQUVuQjtJQUNBLGdCQUFnQixJQUFJLENBQUMsSUFBSSxFQUFFO0lBQzNCLG9CQUFvQixLQUFLLEVBQUUsQ0FBQztJQUM1QixvQkFBb0IsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQyxvQkFBb0IsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQyxpQkFBaUI7O0lBRWpCLGdCQUFnQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUU1QyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNuRCxnQkFBZ0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OztJQUd4RCxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsSUFBSTtJQUM3QixvQkFBb0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUM3RCx3QkFBd0IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUM1RCw0QkFBNEIsU0FBUzs7SUFFckMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDO0lBQzVCLGFBQWE7O0lBRWIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRTtJQUNqRSxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtJQUNoQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQ25CLFlBQVksUUFBUSxHQUFHLElBQUksQ0FBQzs7SUFFNUIsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTs7SUFFeEIsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztJQUV4QyxnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFdkMsZ0JBQWdCLElBQUksS0FBSyxJQUFJLEdBQUc7SUFDaEMsb0JBQW9CLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2hHLGFBQWE7O0lBRWIsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs7SUFFeEYsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEQsZ0JBQWdCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsRUFBRTtJQUMxRCxvQkFBb0IsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRTtJQUN6RCx3QkFBd0IsQ0FBQyxFQUFFLENBQUM7SUFDNUIsd0JBQXdCLENBQUMsRUFBRSxDQUFDO0lBQzVCLHFCQUFxQixBQUNyQixpQkFBaUIsQUFDakIsYUFBYTs7SUFFYixZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztJQUN0QyxnQkFBZ0IsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXpDLFNBQVMsTUFBTTs7SUFFZixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzlELGdCQUFnQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUV2QyxnQkFBZ0IsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7SUFDaEQsb0JBQW9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQztJQUNyRCxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUM7SUFDMUMsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFDeEIsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQ3hCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUzs7SUFFVCxRQUFRLE9BQU87SUFDZixZQUFZLFFBQVE7SUFDcEIsWUFBWSxHQUFHO0lBQ2YsU0FBUyxDQUFDO0lBQ1YsS0FBSzs7SUFFTCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTs7SUFFbkMsUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRztJQUMxQixZQUFZLE9BQU8sS0FBSyxDQUFDOztJQUV6QixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFOztJQUV4QixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztJQUU5RCxnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFdkMsZ0JBQWdCLElBQUksS0FBSyxJQUFJLEdBQUc7SUFDaEMsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFDO0lBQ2hFLGFBQWE7O0lBRWIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsSUFBRzs7SUFFMUQsU0FBUyxNQUFNO0FBQ2YsQUFFQTtJQUNBLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUQsZ0JBQWdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXZDLGdCQUFnQixJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEtBQUs7SUFDOUMsb0JBQW9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELGFBQWE7SUFDYixTQUFTO0lBQ1QsS0FBSztJQUNMLENBQUM7O0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQzs7dUNBQUMsbkNDaFpuQzs7SUFFQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQVMscUJBQXFCLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7O0lBRWpFLElBQUksSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztJQUMxQyxRQUFRLE9BQU87O0lBRWYsSUFBSSxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7OztJQUcvQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUU7SUFDbEUsUUFBUSxRQUFRLEVBQUUsSUFBSTtJQUN0QixRQUFRLFlBQVksRUFBRSxLQUFLO0lBQzNCLFFBQVEsVUFBVSxFQUFFLEtBQUs7SUFDekIsUUFBUSxLQUFLLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxTQUFTO0lBQzlDLEtBQUssRUFBQzs7SUFFTixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUU7SUFDOUQsUUFBUSxZQUFZLEVBQUUsS0FBSztJQUMzQixRQUFRLFVBQVUsRUFBRSxJQUFJO0lBQ3hCLFFBQVEsR0FBRyxFQUFFLFdBQVc7SUFDeEIsWUFBWSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN6QyxTQUFTOztJQUVULFFBQVEsR0FBRyxFQUFFLFNBQVMsS0FBSyxFQUFFOztJQUU3QixZQUFZLElBQUksTUFBTSxHQUFHO0lBQ3pCLGdCQUFnQixLQUFLLEVBQUUsS0FBSztJQUM1QixhQUFhLENBQUM7O0lBRWQsWUFBWSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUxQyxZQUFZLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztJQUV2QyxZQUFZLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRztJQUM1RCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFDaEYsU0FBUztJQUNULEtBQUssRUFBQztJQUNOLENBQUM7O0lBRUQ7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFOztJQUVuRSxJQUFJLElBQUlBLFNBQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDOztJQUUvQixJQUFJLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7O0lBRTFDLElBQUksSUFBSSxlQUFlLEdBQUcsQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztJQUUvQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUU7SUFDbEUsUUFBUSxVQUFVLEVBQUUsS0FBSztJQUN6QixRQUFRLFFBQVEsRUFBRSxJQUFJO0lBQ3RCLFFBQVEsS0FBSyxFQUFFLElBQUk7SUFDbkIsS0FBSyxFQUFDOztJQUVOLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRTtJQUM5RCxRQUFRLFlBQVksRUFBRSxLQUFLO0lBQzNCLFFBQVEsVUFBVSxFQUFFLElBQUk7SUFDeEIsUUFBUSxHQUFHLEVBQUUsV0FBVzs7SUFFeEIsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUM7O0lBRXpFLFlBQVksT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekMsU0FBUzs7SUFFVCxRQUFRLEdBQUcsRUFBRSxTQUFTLEtBQUssRUFBRTs7SUFFN0IsWUFBWSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsWUFBWSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0lBRTVCLFlBQVksSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLFFBQVE7SUFDekMsZ0JBQWdCLElBQUk7SUFDcEIsb0JBQW9CLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQzVCLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztJQUNsQyxvQkFBb0IsT0FBTztJQUMzQixpQkFBaUI7O0lBRWpCLFlBQVksSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0lBQ3hDLGdCQUFnQixJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQzdCLGdCQUFnQixFQUFFLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELGdCQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQztJQUMvQixnQkFBZ0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxhQUFhLE1BQU0sSUFBSSxLQUFLLFlBQVksY0FBYyxFQUFFO0lBQ3hELGdCQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzlDLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQztJQUN4QyxnQkFBZ0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxhQUFhO0lBQ2IsU0FBUztJQUNULEtBQUssRUFBQztJQUNOLENBQUM7O0lBRUQ7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFOztJQUUvRCxJQUFJLElBQUlBLFNBQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQy9CLEFBRUE7SUFDQSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUU7SUFDOUQsUUFBUSxZQUFZLEVBQUUsS0FBSztJQUMzQixRQUFRLFVBQVUsRUFBRSxJQUFJOztJQUV4QixRQUFRLEdBQUcsRUFBRSxXQUFXO0lBQ3hCLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQ3JELGdCQUFnQixZQUFZLEVBQUUsS0FBSztJQUNuQyxnQkFBZ0IsVUFBVSxFQUFFLElBQUk7SUFDaEMsZ0JBQWdCLFFBQVEsRUFBRSxLQUFLO0lBQy9CLGdCQUFnQixLQUFLLEVBQUUsSUFBSSxNQUFNLEVBQUU7SUFDbkMsYUFBYSxFQUFDO0lBQ2QsWUFBWSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxTQUFTOztJQUVULFFBQVEsR0FBRyxFQUFFLFNBQVMsS0FBSyxFQUFFLEVBQUU7SUFDL0IsS0FBSyxFQUFDO0lBQ04sQ0FBQzs7QUFFRCxJQUFPLE1BQU1DLE9BQUssU0FBUyxTQUFTLENBQUM7SUFDckM7SUFDQTtJQUNBO0lBQ0EsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFOztJQUV0QixRQUFRLEtBQUssRUFBRSxDQUFDO0lBQ2hCO0lBQ0EsUUFBUSxJQUFJRCxTQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0lBRTdDLFFBQVEsSUFBSUEsU0FBTSxFQUFFO0lBQ3BCLFlBQVksSUFBSSxvQkFBb0IsR0FBR0EsU0FBTSxDQUFDLG9CQUFvQixDQUFDOztJQUVuRSxZQUFZLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7O0lBRS9DLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtJQUNuRSxnQkFBZ0IsUUFBUSxFQUFFLEtBQUs7SUFDL0IsZ0JBQWdCLFVBQVUsRUFBRSxLQUFLO0lBQ2pDLGdCQUFnQixZQUFZLEVBQUUsS0FBSztJQUNuQyxnQkFBZ0IsS0FBSyxFQUFFQSxTQUFNO0lBQzdCLGFBQWEsRUFBQzs7SUFFZCxZQUFZLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtJQUN2QyxnQkFBZ0IsS0FBSyxJQUFJLFdBQVcsSUFBSUEsU0FBTSxFQUFFO0lBQ2hELG9CQUFvQixJQUFJLE1BQU0sR0FBR0EsU0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztJQUVyRCxvQkFBb0IsSUFBSSxNQUFNLFlBQVksS0FBSyxFQUFFO0lBQ2pELHdCQUF3QixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7SUFDbEYsNEJBQTRCLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekYseUJBQXlCLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksa0JBQWtCLEVBQUU7SUFDNUUsNEJBQTRCLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2pHLHlCQUF5QjtJQUN6QixxQkFBcUIsTUFBTSxJQUFJLE1BQU0sWUFBWUMsT0FBSztJQUN0RCx3QkFBd0IsbUJBQW1CLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDN0YseUJBQXlCLElBQUksTUFBTSxZQUFZLGlCQUFpQjtJQUNoRSx3QkFBd0IscUJBQXFCLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRjtJQUNBLHdCQUF3QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFDOztJQUVqRixpQkFBaUI7O0lBRWpCLGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7SUFHekMsZ0JBQWdCLE1BQU0sQ0FBQyxjQUFjLENBQUNELFNBQU0sRUFBRSxzQkFBc0IsRUFBRTtJQUN0RSxvQkFBb0IsUUFBUSxFQUFFLEtBQUs7SUFDbkMsb0JBQW9CLFVBQVUsRUFBRSxLQUFLO0lBQ3JDLG9CQUFvQixZQUFZLEVBQUUsS0FBSztJQUN2QyxvQkFBb0IsS0FBSyxFQUFFLFdBQVc7SUFDdEMsaUJBQWlCLEVBQUM7SUFDbEI7OztJQUdBO0lBQ0EsZ0JBQWdCLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsYUFBYTtJQUNiLFNBQVMsTUFBTTtJQUNmO0lBQ0EsWUFBWSxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLFNBQVM7O0lBRVQsUUFBUSxJQUFJLElBQUk7SUFDaEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxVQUFVLEdBQUc7O0lBRWpCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0lBRTNCLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7SUFDNUIsWUFBWSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsWUFBWSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLFlBQVksUUFBUTtJQUMvRSxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2xDO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0IsU0FBUzs7SUFFVCxRQUFRLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMzQjtJQUNBLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFOztJQUVoQixRQUFRLElBQUksUUFBUSxHQUFHO0lBQ3ZCLFlBQVksS0FBSyxFQUFFLElBQUk7SUFDdkIsWUFBWSxNQUFNLEVBQUUsRUFBRTtJQUN0QixTQUFTLENBQUM7O0lBRVYsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUV0QyxRQUFRLElBQUksTUFBTSxFQUFFO0lBQ3BCLFlBQVksSUFBSSxNQUFNLFlBQVksS0FBSyxFQUFFLENBRTVCLE1BQU0sSUFBSSxNQUFNLFlBQVlDLE9BQUssRUFBRSxDQUVuQyxNQUFNO0lBQ25CLGdCQUFnQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxhQUFhO0lBQ2IsU0FBUzs7SUFFVCxRQUFRLE9BQU8sUUFBUTtJQUN2QixLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNoQixBQUtBO0lBQ0EsUUFBUSxJQUFJLEdBQUcsRUFBRTtJQUNqQixZQUFZLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTFDLFlBQVksSUFBSSxNQUFNLEVBQUU7SUFDeEIsZ0JBQWdCLElBQUksTUFBTSxZQUFZLEtBQUssRUFBRTtJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZDLGlCQUFpQixNQUFNLElBQUksTUFBTSxZQUFZQSxPQUFLLEVBQUU7SUFDcEQsb0JBQW9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN2QyxpQkFBaUIsTUFBTTtJQUN2QixvQkFBb0IsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUztJQUNULEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFOztJQUVkLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJO0lBQzFCLFlBQVksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsS0FBSzs7O0lBR0wsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFOztJQUVkLFFBQVEsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztJQUUxQixRQUFRLElBQUksQ0FBQyxJQUFJO0lBQ2pCLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEI7SUFDQSxZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSTtJQUM5QixnQkFBZ0IsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXJELFFBQVEsT0FBTyxRQUFRLENBQUM7SUFDeEIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sR0FBRztJQUNiLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDOztJQUVyQixRQUFRLElBQUlELFNBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztJQUVqQyxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUlBLFNBQU0sRUFBRTs7SUFFakMsWUFBWSxJQUFJLE1BQU0sR0FBR0EsU0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUV0QyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFDO0lBQ2xDLFNBQVM7O0lBRVQsUUFBUSxPQUFPLEdBQUcsQ0FBQztJQUNuQixLQUFLO0lBQ0wsQ0FBQztBQUNELEFBbUNBO0lBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTs7SUFFMUMsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUc7SUFDdkMsUUFBUSxPQUFPLElBQUk7O0lBRW5CLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7SUFFcEIsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU3QixJQUFJLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O0FBRUQsSUFBTyxNQUFNLFFBQVEsU0FBUyxTQUFTLENBQUM7O0lBRXhDLElBQUksV0FBVyxDQUFDLElBQUksRUFBRTs7SUFFdEIsUUFBUSxLQUFLLEVBQUUsQ0FBQzs7SUFFaEIsUUFBUSxJQUFJLElBQUksRUFBRTtJQUNsQixZQUFZLEtBQUssSUFBSSxTQUFTLElBQUksSUFBSTtJQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCxTQUFTOztJQUVULFFBQVEsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7SUFDL0IsWUFBWSxHQUFHLEVBQUUsZ0JBQWdCO0lBQ2pDLFNBQVMsQ0FBQztJQUNWLEtBQUs7O0lBRUw7SUFDQTtJQUNBOztJQUVBLElBQUksT0FBTyxHQUFHOztJQUVkLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxVQUFVLEdBQUc7O0lBRWpCLFFBQVEsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFOztJQUVkLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJO0lBQzFCLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixLQUFLOztJQUVMLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTs7SUFFZCxRQUFRLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7SUFFMUIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO0lBQ25CLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEIsU0FBUyxNQUFNO0lBQ2YsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtJQUNoQyxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLGdCQUFnQixJQUFJLElBQUksRUFBRTtJQUMxQixvQkFBb0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN2QyxpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxPQUFPLFFBQVEsQ0FBQztJQUN4QixLQUFLOztJQUVMO0lBQ0E7SUFDQTs7SUFFQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7O0lBRWpCLFFBQVEsT0FBTyxFQUFFLENBQUM7SUFDbEIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sR0FBRzs7SUFFYixRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQzs7O0lBR3JCLFFBQVEsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7O0lBRS9CLFlBQVksSUFBSSxJQUFJLElBQUksWUFBWTtJQUNwQyxnQkFBZ0IsSUFBSSxJQUFJLGdCQUFnQjtJQUN4QyxnQkFBZ0IsSUFBSSxJQUFJLG1CQUFtQjtJQUMzQyxnQkFBZ0IsU0FBUzs7SUFFekIsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBQztJQUNsQyxTQUFTOztJQUVULFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7SUFFTCxJQUFJLFlBQVksR0FBRzs7SUFFbkIsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzlCLEtBQUs7SUFDTDs7SUNuY0EsTUFBTSxhQUFhLENBQUM7SUFDcEIsSUFBSSxXQUFXLEdBQUc7O0lBRWxCLEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtJQUN2QixRQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQztJQUNsRCxRQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNsQyxLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRTtJQUNyQyxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7SUFFTCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUU7SUFDdEMsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDbEMsUUFBUSxPQUFPLEdBQUcsQ0FBQztJQUNuQixLQUFLOztJQUVMLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRTtJQUMxQixLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUMvQixLQUFLO0lBQ0wsQ0FBQzs7SUNoQkQsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLElBQUksRUFBRSxhQUFhLEdBQUU7O0FBRWxELElBQU8sTUFBTSxVQUFVLFNBQVMsSUFBSSxDQUFDOztJQUVyQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTs7SUFFeEQsUUFBUSxLQUFLLEVBQUUsQ0FBQzs7SUFFaEIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUM3QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDM0IsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQ25DLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDNUIsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7SUFFL0IsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7SUFFL0I7SUFDQSxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDOztJQUV4QixRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTs7SUFFdEIsWUFBWSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BFLGdCQUFnQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvRCxpQkFBaUIsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25ELGdCQUFnQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7O0lBRWhFLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNsQyxTQUFTOztJQUVULFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxXQUFXLEdBQUc7SUFDbEIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELEtBQUs7O0lBRUwsSUFBSSxJQUFJLEdBQUc7O0lBRVgsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7SUFFOUIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7OztJQUd6QixZQUFZLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7SUFFekMsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsRSxnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFN0MsZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUN2RCxhQUFhOztJQUViLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNyQixnQkFBZ0IsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFDOzs7SUFHaEUsU0FBUyxNQUFNO0lBQ2YsWUFBWSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUN6QyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O0lBRTdCLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYTtJQUNsRCxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFN0QsWUFBWSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQzs7SUFFNUIsWUFBWSxLQUFLLENBQUMsSUFBSSxHQUFFO0lBQ3hCLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTs7SUFFOUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7O0lBRXpCLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7SUFDcEMsZ0JBQWdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7O0lBRXpELFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0lBRWxFLGdCQUFnQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUUxQyxnQkFBZ0IsSUFBSSxFQUFFLEtBQUssS0FBSztJQUNoQyxvQkFBb0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELGFBQWE7O0lBRWIsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQztJQUMzRCxTQUFTLE1BQU07SUFDZixZQUFZLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxZQUFZLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNoQyxTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxFQUFFOztJQUV2QyxJQUFJLHdCQUF3QixDQUFDLE9BQU8sRUFBRTs7SUFFdEMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ2xFLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7SUFFckQsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSztJQUNyQyxZQUFZLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ3pCLGdCQUFnQixDQUFDLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsU0FBUyxFQUFDO0lBQ1YsS0FBSzs7SUFFTCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFOztJQUV6QixRQUFRLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7SUFFNUIsUUFBUSxJQUFJLENBQUMsT0FBTztJQUNwQixZQUFZLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFL0MsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDM0IsWUFBWSxVQUFVLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELFlBQVksVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUVsRSxZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2xFLGdCQUFnQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLGdCQUFnQixVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLGFBQWE7SUFDYixTQUFTOztJQUVULFFBQVEsT0FBTyxVQUFVLENBQUM7SUFDMUIsS0FBSzs7SUFFTCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRTs7SUFFNUIsSUFBSSxxQkFBcUIsR0FBRzs7SUFFNUIsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDNUQsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0lBRXJELFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRztJQUNwQixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFNUMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsS0FBSzs7O0lBR0w7SUFDQTtJQUNBO0lBQ0EsSUFBSSxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTs7SUFFNUIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0lBRXBCLFFBQVEsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDOztJQUVoQyxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztJQUUzQixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUM1RCxZQUFZLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUU5RixRQUFRLElBQUksSUFBSSxDQUFDLEdBQUc7SUFDcEIsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7O0lBRXJHLFFBQVEsT0FBTyxlQUFlLENBQUM7SUFDL0IsS0FBSzs7SUFFTDtJQUNBO0lBQ0E7SUFDQSxJQUFJLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUU7O0lBRTlDLFFBQVEsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDOztJQUVoQyxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztJQUU1QixRQUFRLElBQUksSUFBSSxDQUFDLEdBQUc7SUFDcEIsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7O0lBRXRHLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzVELFlBQVksZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0lBRS9GLFFBQVEsSUFBSSxPQUFPO0lBQ25CLFlBQVksVUFBVSxDQUFDLE1BQU07SUFDN0IsZ0JBQWdCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsYUFBYSxFQUFFLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQzs7SUFFdkMsUUFBUSxPQUFPLGVBQWUsQ0FBQztJQUMvQixLQUFLOztJQUVMLElBQUksZ0JBQWdCLEdBQUc7O0lBRXZCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUNyRCxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNoRCxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsUUFBUSxHQUFHLEtBQUssRUFBRTs7SUFFaEUsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQzs7SUFFbEUsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLEVBQUUsUUFBUSxHQUFHLElBQUksRUFBRTs7SUFFbEQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDNUQsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUUsS0FBSztJQUNMLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUU7O0lBRXREO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTs7SUFFakIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNO0lBQ3ZCLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixLQUFLOztJQUVMLElBQUksRUFBRSxDQUFDLElBQUksRUFBRTs7SUFFYixRQUFRLElBQUksSUFBSTtJQUNoQixZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDO0lBQzdCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRyxLQUFLLEVBQUU7O0lBRTFDLFFBQVEsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7O0lBRXBELFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzVELFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtJQUNoQixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7SUFDckQsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxLQUFLOztJQUVMLElBQUksSUFBSSxHQUFHOztJQUVYLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFOztJQUV0QixZQUFZLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ2xELFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUM1QyxTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLElBQUksR0FBRzs7SUFFWCxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUc7SUFDcEIsWUFBWSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNO0lBQ2hELGdCQUFnQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0RCxLQUFLOztJQUVMLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFOztJQUU1QixRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3RELFlBQVksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxLQUFLOztJQUVMLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRTs7SUFFNUIsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVO0lBQzNCLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN4RCxLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksTUFBTSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxFQUFFOztJQUVwQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTs7O0lBRy9DLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUM7O0lBRXhDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2hFLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7SUFFekQsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRTs7SUFFbEIsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLO0lBQ3RCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRWpDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixLQUFLOztJQUVMLElBQUksYUFBYSxDQUFDLElBQUksRUFBRTs7SUFFeEIsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN0RCxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsS0FBSzs7SUFFTCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7O0lBRWYsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7SUFDeEIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLFNBQVMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0lBQ2pELFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDO0lBQ2xDLEtBQUs7SUFDTDs7SUMxVEE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLE1BQU0sTUFBTSxDQUFDO0lBQ2IsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRTtJQUNuQyxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUN2QyxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDMUIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRztJQUNqQixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzFCLEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxNQUFNLEdBQUcsSUFBSSxFQUFFO0lBQ3JEO0lBQ0E7SUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7O0lBRXRDLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxVQUFVLEdBQUcsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxjQUFjLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0lBRWxLLFFBQVEsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxHQUFHO0lBQ3BDLFFBQVE7SUFDUixZQUFZLFdBQVcsRUFBRSxhQUFhO0lBQ3RDLFlBQVksTUFBTSxFQUFFLEtBQUs7SUFDekIsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHO0lBQzVCLFlBQVksSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUMzQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztJQUN2QyxnQkFBZ0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwRCxhQUFhLENBQUMsRUFBRTtJQUNoQixTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUc7SUFDMUIsWUFBWSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNDLFlBQVksSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGdEQUFnRCxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEksU0FBUyxDQUFDLEdBQUcsWUFBWSxDQUFDO0lBQzFCLEtBQUs7O0lBRUwsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3RCLFFBQVEsT0FBTyxPQUFPLENBQUM7SUFDdkIsS0FBSzs7SUFFTCxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDbkIsUUFBUSxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUM7SUFDbEMsWUFBWSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUMvQixTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDYixRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUs7SUFDckIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxLQUFLOztJQUVMLElBQUksZUFBZSxDQUFDLElBQUksRUFBRTtJQUMxQixRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNyQixRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0lBQzVCLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QyxTQUFTOztJQUVULFFBQVEsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLEtBQUs7O0lBRUwsSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLENBQUM7SUFDL0IsUUFBUSxHQUFHLEtBQUs7SUFDaEIsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDaEUsS0FBSzs7SUFFTCxJQUFJLG9CQUFvQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7O0lBRXRDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUM3QixZQUFZLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BEO0lBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDaEUsZ0JBQWdCLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRyxhQUFhOztJQUViLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO0lBQ3JDLFNBQVM7QUFDVCxBQUdBO0lBQ0E7SUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztJQUMzQjtJQUNBLGdCQUFnQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEQsYUFBYTtJQUNiO0lBQ0EsZ0JBQWdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxnREFBZ0QsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLEVBQUM7O0lBRW5KLEtBQUs7SUFDTCxDQUFDOztJQ3pGRDtJQUNBO0lBQ0E7QUFDQSxJQUFPLE1BQU0sUUFBUSxTQUFTLFVBQVUsQ0FBQztJQUN6QyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7O0lBRWhELFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUU5QyxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0lBRW5DLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDdkIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDdEIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNyQixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7SUFFM0IsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUc7SUFDbkMsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxLQUFLOztJQUVMLElBQUksSUFBSSxHQUFHOztJQUVYLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHO0lBQ25DLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRXZDLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0lBRS9CLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTs7SUFFL0IsUUFBUSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPOztJQUV2RCxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsWUFBWSxLQUFLLENBQUMsQ0FBQyxLQUFLO0lBQ25GLFlBQVksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQy9CLFlBQVksSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxRCxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLOztJQUUvQyxZQUFZLElBQUksV0FBVyxJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUVoRSxZQUFZLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTdDLFlBQVksSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztJQUUvQixZQUFZLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFaEMsWUFBWSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUU7O0lBRTlCLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRTtJQUMzQyxvQkFBb0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9CLG9CQUFvQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUM5QyxvQkFBb0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9CLG9CQUFvQixTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRXJFLG9CQUFvQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUc7SUFDN0Msd0JBQXdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFDO0lBQzVFLGlCQUFpQixNQUFNO0lBQ3ZCLG9CQUFvQixTQUFTLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDaEQsaUJBQWlCOztJQUVqQixnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLGFBQWE7O0lBRWIsWUFBWSxJQUFJLE9BQU87SUFDdkIsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7SUFFOUIsWUFBWSxJQUFJLENBQUMsV0FBVztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7SUFFM0MsWUFBWSxPQUFPLElBQUksQ0FBQztJQUN4QixTQUFTLENBQUMsQ0FBQzs7SUFFWCxRQUFRLE9BQU8sQ0FBQyxXQUFXLElBQUksTUFBTTs7SUFFckMsWUFBWSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDOztJQUVwQyxZQUFZLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzs7SUFFL0IsWUFBWSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRWhDLFlBQVksT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFO0lBQzlCLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRTtJQUMzQyxvQkFBb0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9CLG9CQUFvQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUM5QyxvQkFBb0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztJQUUvQixvQkFBb0IsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUVyRSxvQkFBb0IsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHO0lBQzdDLHdCQUF3QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQztJQUM1RSxpQkFBaUIsTUFBTTtJQUN2QixvQkFBb0IsU0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ2hELGlCQUFpQjs7SUFFakIsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixhQUFhO0lBQ2IsU0FBUyxFQUFDO0lBQ1YsS0FBSzs7SUFFTCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7O0lBRXpCLFFBQVEsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFJO0lBQzlCLFFBQVEsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkMsS0FBSzs7O0lBR0wsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRyxLQUFLLEVBQUU7O0lBRTFDLFFBQVEsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztJQUV0QyxRQUFRLElBQUksSUFBSSxFQUFFOztJQUVsQixZQUFZLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELGFBQWEsTUFBTTtJQUNuQixnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDdkMsYUFBYTtJQUNiLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFOztJQUVsQixLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTs7SUFFaEIsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSztJQUNyQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsU0FBUyxFQUFDOztJQUVWLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7SUFDM0IsWUFBWSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQztJQUMvQixLQUFLOztJQUVMLElBQUksZ0JBQWdCLEdBQUc7O0lBRXZCLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztJQUVqRCxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3QixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMvQixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzs7SUFFM0IsUUFBUSxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNqQyxLQUFLO0lBQ0wsQ0FBQzs7SUNySk0sTUFBTSxNQUFNLFNBQVMsVUFBVSxDQUFDOztJQUV2QztJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztJQUU5QyxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQzs7SUFFcEMsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDNUMsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUNqQyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQzdCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQy9CLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDN0IsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7OztJQUc1QixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzlCLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUMxQixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxJQUFJLEdBQUc7O0lBRVgsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7SUFFM0IsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRO0lBQ3pCLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFFakMsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDN0QsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztJQUVyQyxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixLQUFLOztJQUVMO0lBQ0E7SUFDQTtJQUNBLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTs7SUFFaEIsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0lBQzNCO0lBQ0EsWUFBWSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQyxZQUFZLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXpDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkQsZ0JBQWdCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFNUMsZ0JBQWdCLFFBQVEsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNuQyxvQkFBb0IsS0FBSyxHQUFHO0lBQzVCO0lBQ0Esd0JBQXdCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztJQUNsRSx3QkFBd0IsTUFBTTtJQUM5QixvQkFBb0IsS0FBSyxHQUFHO0lBQzVCLHdCQUF3QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0Qsd0JBQXdCLE1BQU07SUFDOUIsb0JBQW9CLEtBQUssR0FBRztJQUM1Qix3QkFBd0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUzs7SUFFVCxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0lBRW5DLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztJQUU5RCxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtJQUN4QixZQUFZLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQy9CLFlBQVksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDOUIsU0FBUzs7SUFFVCxRQUFRLElBQUksS0FBSyxJQUFJLEtBQUssWUFBWUMsT0FBSyxFQUFFOztJQUU3QyxZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUM3QjtJQUNBLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUVyQztJQUNqQixvQkFBb0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0lBRXZDLGFBQWE7SUFDYixZQUFZLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzlCLFNBQVM7O0lBRVQsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNO0lBQ3ZCLFlBQVksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztJQUV0QyxRQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRTVCLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0lBQ3hCLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUMvQixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0UsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLGdCQUFnQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkMsYUFBYTtJQUNiLFNBQVM7SUFDVCxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQywrREFBK0QsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUUvTyxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7SUFDckQsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsS0FBSzs7SUFFTCxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7O0lBRTNCLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07SUFDbkUsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNwQyxTQUFTLENBQUMsQ0FBQztJQUNYLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDL0IsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRTs7SUFFckIsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUV0RCxRQUFRLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUU7O0lBRWhELFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7SUFFMUQsWUFBWSxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXhDLFlBQVksSUFBSSxRQUFRLFlBQVksTUFBTTtJQUMxQyxnQkFBZ0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLEtBQUssQ0FBQzs7SUFFMUIsZ0JBQWdCLElBQUksTUFBTSxFQUFFOztJQUU1QixvQkFBb0IsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUM1RSx3QkFBd0IsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUU1RCx3QkFBd0IsSUFBSSxLQUFLLEVBQUU7SUFDbkMsNEJBQTRCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RSw0QkFBNEIsU0FBUztJQUNyQyx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLGlCQUFpQixNQUFNO0lBQ3ZCO0lBQ0E7SUFDQTtJQUNBOztJQUVBLG9CQUFvQixLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsaUJBQWlCOzs7SUFHakIsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFFLGFBQWE7SUFDYixTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUU7SUFDYixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtJQUNqQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLEtBQUs7OztJQUdMLElBQUksZUFBZSxDQUFDLElBQUksRUFBRTtJQUMxQixRQUFRLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztJQUM5QjtJQUNBO0lBQ0E7SUFDQSxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ3RDLFlBQVksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUM1QixZQUFZLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFO0lBQzVDLGdCQUFnQixVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdDLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBQztJQUN2QyxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUM7SUFDbkQsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25ELG9CQUFvQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUU1QyxvQkFBb0IsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLG9CQUFvQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsb0JBQW9CLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxvQkFBb0IsSUFBSSxVQUFVLElBQUksTUFBTSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDaEUsb0JBQW9CLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RSxpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVM7O0lBRVQsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTs7SUFFbkMsWUFBWSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDaEMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7SUFDaEMsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQztJQUNqRCxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkQsb0JBQW9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsb0JBQW9CLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxvQkFBb0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLG9CQUFvQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0Msb0JBQW9CLElBQUksVUFBVSxJQUFJLE1BQU0sRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ2hFLG9CQUFvQixVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0UsaUJBQWlCO0lBQ2pCLGFBQWE7O0lBRWIsWUFBWSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBQztJQUM1QyxTQUFTOztJQUVULFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7O0lBRXpCLFlBQVksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOzs7SUFHdEQsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNO0lBQzNCLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRWpELFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsU0FBUzs7SUFFVCxRQUFRLElBQUksVUFBVSxFQUFFO0lBQ3hCLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM5QyxhQUFhO0lBQ2IsU0FBUztJQUNULFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUMsS0FBSzs7SUFFTCxJQUFJLFlBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFOztJQUU1QixRQUFRLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQzs7SUFFaEMsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDN0QsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7SUFFL0YsUUFBUSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUUvRSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztJQUVoQyxRQUFRLE9BQU8sZUFBZSxDQUFDO0lBQy9CLEtBQUs7O0lBRUw7SUFDQTtJQUNBO0lBQ0EsSUFBSSxhQUFhLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFOztJQUU5QyxRQUFRLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQzs7SUFFaEMsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDN0QsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7SUFFaEcsUUFBUSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzs7SUFFekYsUUFBUSxPQUFPLGVBQWUsQ0FBQztJQUMvQixLQUFLOztJQUVMLElBQUkscUJBQXFCLEdBQUc7O0lBRTVCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQzdELFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztJQUV0RCxRQUFRLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3RDLEtBQUs7O0lBRUwsSUFBSSxhQUFhLEdBQUc7SUFDcEIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNO0lBQ3ZCLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN4QyxLQUFLOztJQUVMLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFO0lBQ3JDLFFBQVEsS0FBSyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYztJQUNqRCxZQUFZLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZFLEtBQUs7SUFDTCxDQUFDOztBQUVELElBQU8sTUFBTSxZQUFZLFNBQVMsTUFBTSxDQUFDO0lBQ3pDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUU7SUFDbEQsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0lBQzNDLEtBQUs7SUFDTDs7S0FBQyxEQ3BTRCxNQUFNLE1BQU0sU0FBUyxRQUFRLENBQUM7SUFDOUI7SUFDQSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7O0lBRXZDLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUVyQyxRQUFRLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7SUFFN0QsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ2pELFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNqQyxTQUFTLEVBQUM7SUFDVixLQUFLOztJQUVMLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtJQUNqQjtJQUNBLFFBQVEsT0FBTyxLQUFLLENBQUM7SUFDckIsS0FBSzs7SUFFTCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7SUFDakIsUUFBUSxPQUFPLEtBQUssQ0FBQztJQUNyQixLQUFLO0lBQ0wsQ0FBQzs7SUNmTSxNQUFNLGNBQWMsU0FBUyxNQUFNLENBQUM7O0lBRTNDO0lBQ0E7SUFDQTs7SUFFQSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0lBRTlDLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7O0lBRXJDLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDeEIsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs7SUFFaEMsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQzFCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0lBRXhCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBRTFCLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDaEMsS0FBSzs7SUFFTCxJQUFJLFlBQVksR0FBRzs7SUFFbkIsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUV4QyxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzdELFlBQVksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELFNBQVM7O0lBRVQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUQsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVELFNBQVM7O0lBRVQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNoRCxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxTQUFTOztJQUVULFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzs7SUFFMUQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7SUFDOUMsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUV0QyxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0lBQ3BDO0lBQ0EsS0FBSzs7SUFFTCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7O0lBRXBCLFFBQVEsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTs7SUFFbkMs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USxPQUFPLFdBQVcsQ0FBQztJQUMzQixLQUFLOztJQUVMLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDM0IsUUFBUSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sWUFBWSxRQUFRLENBQUM7SUFDOUMsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLFlBQVksT0FBTyxDQUFDO0lBQzdDLFVBQVU7SUFDVjtJQUNBLFlBQVksSUFBSSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUM7SUFDL0MsWUFBWSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDNUMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEQsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLFNBQVM7O0lBRVQsUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyQyxLQUFLO0lBQ0wsQ0FBQzs7QUFFRCxJQUFPLE1BQU0sTUFBTSxTQUFTLFdBQVcsQ0FBQztJQUN4QyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0lBQzNELFFBQVEsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEMsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUMzQixRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFDO0lBQzlELFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDakMsS0FBSzs7SUFFTCxJQUFJLGNBQWMsQ0FBQyxPQUFPLEVBQUU7SUFDNUIsUUFBUSxPQUFPLEVBQUUsQ0FBQztJQUNsQixLQUFLO0lBQ0w7O0tBQUMsRENyZEQ7SUFDQTtJQUNBOztJQUVBO0lBQ0E7SUFDQTtJQUNBO0FBQ0EsSUFBTyxTQUFTLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFOztJQUVsRSxJQUFJLElBQUksUUFBUSxDQUFDOztJQUVqQixJQUFJLElBQUksQ0FBQyxRQUFRO0lBQ2pCLFFBQVEsT0FBTyxJQUFJLENBQUM7O0lBRXBCLElBQUksSUFBSSxRQUFRLENBQUMsUUFBUTtJQUN6QixRQUFRLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQzs7O0lBR2pDO0lBQ0E7SUFDQSxJQUFJLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUV0RCxJQUFJLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztJQUVuRSxJQUFJLElBQUksQ0FBQyxRQUFRO0lBQ2pCLFFBQVEsT0FBTyxJQUFJLENBQUM7O0lBRXBCLElBQUksUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7O0lBRW5GLElBQUksT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQzdCLENBQUM7OztJQUdELFNBQVMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDN0QsQUFHQTtJQUNBLElBQUksSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtJQUN4QyxRQUFRLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDeEMsUUFBUSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ3RDLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUvQjs7SUFFQSxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUU7SUFDL0I7SUFDQSxZQUFZLElBQUksSUFBSSxHQUFHLElBQUlDLElBQVEsRUFBRSxDQUFDO0lBQ3RDLFlBQVksUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsWUFBWSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxTQUFTO0lBQ1QsS0FBSztJQUNMLElBQUksT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7SUFFRCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUN6QyxJQUFJLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixJQUFJLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUU7SUFDM0IsUUFBUSxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2QyxLQUFLO0lBQ0wsQ0FBQzs7O0lBR0Q7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUMvRCxJQUFJLElBQUksR0FBRyxDQUFDO0lBQ1osSUFBSSxRQUFRLE9BQU87SUFDbkI7SUFDQSxRQUFRLEtBQUssR0FBRyxDQUFDO0lBQ2pCLFFBQVEsS0FBSyxLQUFLLENBQUM7SUFDbkIsUUFBUSxLQUFLLEtBQUs7SUFDbEIsWUFBWSxHQUFHLEdBQUcsSUFBSUMsT0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0QsWUFBWSxPQUFPLEdBQUcsQ0FBQztJQUN2QixRQUFRLEtBQUssVUFBVTtJQUN2QixZQUFZLEdBQUcsR0FBRyxJQUFJQyxVQUFjLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRSxZQUFZLE9BQU8sR0FBRyxDQUFDO0lBQ3ZCLFFBQVEsS0FBSyxRQUFRO0lBQ3JCLFlBQVksR0FBRyxHQUFHLElBQUlDLFFBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLFlBQVksT0FBTyxHQUFHLENBQUM7SUFDdkIsUUFBUSxLQUFLLEtBQUssQ0FBQztJQUNuQixRQUFRLEtBQUssS0FBSyxDQUFDO0lBQ25CLFFBQVEsS0FBSyxRQUFRLENBQUM7SUFDdEIsUUFBUSxLQUFLLFFBQVE7SUFDckIsWUFBWSxHQUFHLEdBQUcsSUFBSUMsVUFBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEUsWUFBWSxPQUFPLEdBQUcsQ0FBQztJQUN2QixRQUFRO0lBQ1IsWUFBWSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7SUFDbkMsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJQyxRQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRSxnQkFBZ0IsT0FBTyxHQUFHLENBQUM7SUFDM0IsYUFBYTtJQUNiLFlBQVksTUFBTTtJQUNsQixLQUFLO0lBQ0wsSUFBSSxHQUFHLEdBQUcsSUFBSUMsV0FBZSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRSxJQUFJLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7SUFFRDtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUMxQyxJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDMUIsSUFBSSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0lBRXhCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUM7O0lBRXJCLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzs7SUFFN0IsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksWUFBWSxFQUFFO0lBQ3BDLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLFFBQVEsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6QyxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTlFLElBQUksSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7SUFFcEUsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRXZDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztJQUU1QixJQUFJLE9BQU8sSUFBSSxFQUFFOztJQUVqQixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtJQUN2QixZQUFZLE9BQU8sMEJBQTBCLEVBQUU7O0lBRS9DLFFBQVEsUUFBUSxLQUFLLENBQUMsSUFBSTtJQUMxQixZQUFZLEtBQUssR0FBRztJQUNwQixnQkFBZ0IsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRTs7SUFFOUMsb0JBQW9CLEdBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFbkQsb0JBQW9CLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDOztJQUV0QztJQUNBLG9CQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLG9CQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLG9CQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztJQUUxQyxvQkFBb0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0lBRTVDLG9CQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUV0QyxvQkFBb0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUV2RCxvQkFBb0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7O0lBRWxFLG9CQUFvQixPQUFPLEdBQUcsQ0FBQztJQUMvQixpQkFBaUI7SUFDakIsb0JBQW9CLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELGdCQUFnQixNQUFNO0lBQ3RCLFlBQVksS0FBSyxHQUFHO0lBQ3BCLGdCQUFnQixHQUFHLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsZ0JBQWdCLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDNUIsZ0JBQWdCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDM0MsZ0JBQWdCLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDNUIsZ0JBQWdCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN0QyxnQkFBZ0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxnQkFBZ0IsS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDO0lBQ2xGLGdCQUFnQixNQUFNO0lBQ3RCLFlBQVk7SUFDWixnQkFBZ0IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLGdCQUFnQixNQUFNO0lBQ3RCLFNBQVM7SUFDVCxLQUFLO0lBQ0wsQ0FBQzs7SUFFRDtJQUNBOztJQUVBO0lBQ0E7SUFDQTtJQUNBLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdkMsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO0lBQ3JELFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUNqRSxRQUFRLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDckMsUUFBUSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDOUIsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO0lBQy9CLFlBQVksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLFlBQVksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7SUFDOUMsZ0JBQWdCLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxnQkFBZ0IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLGFBQWE7SUFDYixnQkFBZ0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOztJQUVuRSxTQUFTO0lBQ1QsUUFBUSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQzFDLEtBQUs7O0lBRUwsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksR0FBRztJQUN6QixRQUFRLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCOztLQUFDLERDNU1EO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7QUFDQSxJQUFPLE1BQU0sTUFBTSxTQUFTLElBQUksQ0FBQztJQUNqQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDckIsUUFBUSxLQUFLLEVBQUUsQ0FBQztJQUNoQixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLEtBQUs7O0lBRUwsSUFBSSxVQUFVLEdBQUc7SUFDakIsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUU7O0lBRXhCLFFBQVEsSUFBSSxHQUFHLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxjQUFjLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0lBRXhJLFFBQVEsS0FBSyxDQUFDLEdBQUc7SUFDakIsUUFBUTtJQUNSLFlBQVksV0FBVyxFQUFFLGFBQWE7SUFDdEMsWUFBWSxNQUFNLEVBQUUsTUFBTTtJQUMxQixTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUc7SUFDNUIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDdkMsZ0JBQWdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxhQUFhLENBQUMsRUFBRTtJQUNoQixTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUc7SUFDMUIsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsZ0RBQWdELEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0SSxTQUFTLEVBQUM7SUFDVixLQUFLOztJQUVMLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQztJQUN0QixRQUFRLE9BQU8sT0FBTyxDQUFDO0lBQ3ZCLEtBQUs7O0lBRUwsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFO0lBQzFCLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7SUFDNUIsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLFNBQVM7O0lBRVQsUUFBUSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsS0FBSzs7SUFFTCxJQUFJLG9CQUFvQixDQUFDLElBQUksRUFBRTtBQUMvQixBQUdBO0lBQ0E7SUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQzs7SUFFM0I7SUFDQSxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0MsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQztJQUN2QyxhQUFhO0lBQ2I7SUFDQSxnQkFBZ0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGdEQUFnRCxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsRUFBQztJQUNuSjtJQUNBLEtBQUs7SUFDTDs7S0FBQyxEQ3pERCxNQUFNLElBQUksQ0FBQztJQUNYLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUN6QjtJQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ3RDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ3RDLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLEtBQUs7O0lBRUwsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDM0IsS0FBSzs7SUFFTCxJQUFJLFdBQVcsRUFBRTtJQUNqQixRQUFRLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsUUFBUSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDNUIsS0FBSzs7SUFFTCxJQUFJLFFBQVEsRUFBRTtJQUNkLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxLQUFLOztJQUVMLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQzs7SUFFeEIsUUFBUSxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDMUM7SUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUM7O0lBRTdCLFFBQVEsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsWUFBWSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELGdCQUFnQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQy9CLGFBQWE7SUFDYixTQUFTOztJQUVULFFBQVEsT0FBTyxHQUFHLENBQUM7SUFDbkIsS0FBSzs7SUFFTCxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQzs7SUFFcEMsUUFBUSxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUM7O0lBRTFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7O0lBRTlFLFFBQVEsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBRWhELFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0lBRXBDLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNCLEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztJQUM3QixRQUFRLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQzs7SUFFMUMsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7O0lBR2hELFFBQVEsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN0RCxLQUFLOztJQUVMLENBQUM7O0lDbEVEO0lBQ0E7SUFDQTtBQUNBLElBQU8sTUFBTSxRQUFRLENBQUM7O0lBRXRCLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7O0lBRS9CLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDdkIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN2QixRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7SUFDN0IsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVE7SUFDL0IsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztJQUM1QixRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQy9CLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDNUIsS0FBSzs7SUFFTCxJQUFJLFVBQVUsR0FBRzs7SUFFakIsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkQsWUFBWSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLFlBQVksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pDLFNBQVM7O0lBRVQsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLEtBQUs7O0lBRUwsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFOztJQUV4QixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQzVCO0lBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkQsWUFBWSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLFlBQVksT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxZQUFZLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRTs7SUFFL0IsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7O0lBRXJCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUNqRCxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzNFOztJQUVBLFFBQVEsT0FBTyxJQUFJLENBQUM7SUFDcEIsS0FBSzs7SUFFTCxJQUFJLFFBQVEsR0FBRzs7SUFFZixRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPOztJQUUvQixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuRCxZQUFZLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsWUFBWSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsU0FBUzs7SUFFVCxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhO0lBQ2xDLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RCxLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUU7O0lBRTVCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDM0I7SUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuRCxZQUFZLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsWUFBWSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLFNBQVM7O0lBRVQsUUFBUSxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFMUMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDdkMsS0FBSzs7SUFFTCxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUU7QUFDOUIsQUFFQTtJQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sRUFBRTtJQUNsQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0lBQ2xDLGdCQUFnQixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEUsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUM7SUFDN0QsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUM7SUFDckQsYUFBYTtJQUNiLFlBQVksVUFBVSxDQUFDLE1BQU07SUFDN0IsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDM0MsYUFBYSxFQUFFLEVBQUUsRUFBQztJQUNsQixTQUFTOztJQUVULFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25ELFlBQVksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QyxZQUFZLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLFlBQVksT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxZQUFZLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNuQyxTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRTs7SUFFckMsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkQsWUFBWSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLFlBQVksT0FBTyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JELFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksaUJBQWlCLEdBQUc7SUFDeEI7SUFDQSxLQUFLOztJQUVMLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtJQUNsQixRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsQ0FBQztJQUNyQyxLQUFLO0lBQ0w7O0lDbkhBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtBQUNBLElBQU8sU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRTtJQUNoRCxJQUFJLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxJQUFJLEtBQUssQUFBRyxJQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUQsUUFBUSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTVCLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTOztJQUUvQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVM7O0lBRXRELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxZQUFZLEtBQUssQ0FBQyxDQUFDLEtBQUs7SUFDN0UsWUFBWSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDL0IsWUFBWSxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFELFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMxQyxLQUFLO0lBQ0wsQ0FBQzs7SUNyQkQsTUFBTSxLQUFLLFNBQVMsWUFBWSxDQUFDOztJQUVqQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2hDLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBQzs7SUFFaEIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFbkIsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFO0lBQ25DLFlBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixTQUFTLE1BQU07SUFDZixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBQztJQUN0QixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBQztJQUN0QixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBQztJQUN0QixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBQztJQUN0QixTQUFTO0lBQ1QsS0FBSzs7SUFFTCxJQUFJLElBQUksQ0FBQyxHQUFHO0lBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2IsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxJQUFJLENBQUMsR0FBRztJQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsS0FBSzs7SUFFTCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNiLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQixLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLEdBQUc7SUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLEtBQUs7O0lBRUwsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDYixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEIsS0FBSzs7SUFFTCxJQUFJLElBQUksQ0FBQyxHQUFHO0lBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixLQUFLOztJQUVMLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2IsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO0lBQ2YsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELEtBQUs7O0lBRUwsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO0lBQ2YsUUFBUSxPQUFPLElBQUksS0FBSztJQUN4QixZQUFZLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUIsWUFBWSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVCLFlBQVksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1QixZQUFZLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUIsU0FBUztJQUNULEtBQUs7O0lBRUwsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0lBQ2hCLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtJQUN2QyxZQUFZLE9BQU8sSUFBSSxLQUFLO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDOUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSztJQUM5QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLO0lBQzlCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDOUIsYUFBYTtJQUNiLFNBQVMsTUFBTTtJQUNmLFlBQVksT0FBTyxJQUFJLEtBQUs7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEMsYUFBYTtJQUNiLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtJQUNmLFFBQVEsT0FBTyxJQUFJLEtBQUs7SUFDeEIsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzVCLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUM1QixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDNUIsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzVCLFNBQVM7SUFDVCxLQUFLOztJQUVMLElBQUksUUFBUSxHQUFHO0lBQ2YsUUFBUSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsS0FBSzs7SUFFTCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7O0lBRXZCLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBQzs7SUFFL0IsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QixRQUFRLFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJOzs7SUFHaEMsWUFBWSxLQUFLLEtBQUs7SUFDdEIsZ0JBQWdCLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDNUIsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUMvQyxnQkFBZ0IsS0FBSyxDQUFDLElBQUksR0FBRTtJQUM1QixnQkFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQy9DLGdCQUFnQixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQzVCLGdCQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDL0MsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsZ0JBQWdCLE1BQU07O0lBRXRCLFlBQVksS0FBSyxNQUFNO0lBQ3ZCLGdCQUFnQixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQzVCLGdCQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDL0MsZ0JBQWdCLEtBQUssQ0FBQyxJQUFJLEdBQUU7SUFDNUIsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztJQUMvQyxnQkFBZ0IsS0FBSyxDQUFDLElBQUksR0FBRTtJQUM1QixnQkFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQy9DLGdCQUFnQixLQUFLLENBQUMsSUFBSSxHQUFFO0lBQzVCLGdCQUFnQixDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7SUFDakQsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLGdCQUFnQixNQUFNOztJQUV0QixZQUFZLEtBQUssR0FBRztJQUNwQixnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztJQUM5QyxnQkFBZ0IsTUFBTTs7SUFFdEIsWUFBWTs7SUFFWixnQkFBZ0IsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN4QyxvQkFBb0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsZ0JBQWdCLE1BQU07SUFDdEIsU0FBUztJQUNULEtBQUs7SUFDTCxDQUFDOztJQUVELEtBQUssQ0FBQyxNQUFNLEdBQUc7SUFDZixJQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUM7SUFDbkQsSUFBSSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO0lBQzdDLElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ2hDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ2hDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3RDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3BDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ3BDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ2hDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLElBQUksVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ25DLElBQUksV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3ZDLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3JDLElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3BDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQ3BDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3hDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3RDLElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzVDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLElBQUksaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDOUMsSUFBSSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDekMsSUFBSSxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMvQyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNyQyxJQUFJLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuQyxJQUFJLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwQyxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxJQUFJLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzlDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQ3pDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzNDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzFDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQ3hDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFDLElBQUksZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDOUMsSUFBSSxxQkFBcUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNqRCxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUN2QyxJQUFJLG9CQUFvQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xELElBQUksa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDL0MsSUFBSSxpQkFBaUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM5QyxJQUFJLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzVDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3ZDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2xDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFDLElBQUksZ0JBQWdCLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDNUMsSUFBSSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDeEMsSUFBSSxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMvQyxJQUFJLGdCQUFnQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzlDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3pDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3pDLElBQUksa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDaEQsSUFBSSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDM0MsSUFBSSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDMUMsSUFBSSxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDMUMsSUFBSSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDeEMsSUFBSSxnQkFBZ0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM5QyxJQUFJLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztJQUMzQyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNoQyxJQUFJLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNyQyxJQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN2QyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNoQyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN6QyxJQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNuQyxJQUFJLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0lBQzdDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0lBQ3pDLElBQUksbUJBQW1CLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDakQsSUFBSSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDN0MsSUFBSSxjQUFjLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDMUMsSUFBSSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDekMsSUFBSSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7SUFDMUMsSUFBSSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7SUFDNUMsSUFBSSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDcEMsSUFBSSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDdkMsSUFBSSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDcEMsSUFBSSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDdEMsSUFBSSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDckMsSUFBSSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDckMsSUFBSSxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDdEMsSUFBSSxtQkFBbUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztJQUNoRCxJQUFJLGlCQUFpQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQy9DLElBQUksV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0lBQ3hDLElBQUksVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3hDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFDLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3BDLElBQUksZUFBZSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzdDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksUUFBUSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3RDLElBQUksaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDL0MsSUFBSSxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDckMsSUFBSSxXQUFXLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDekMsSUFBSSxlQUFlLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDN0MsSUFBSSx5QkFBeUIsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN2RCxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM1QyxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMxQyxJQUFJLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNwQyxJQUFJLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUN4QyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUNuQyxJQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMxQyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNuQyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN4QyxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM1QyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLGdCQUFnQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzlDLElBQUksT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3JDLElBQUksVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3hDLElBQUksYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzNDLElBQUksV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ3pDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFDLElBQUksWUFBWSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFDLElBQUksa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDaEQsSUFBSSxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNoRCxJQUFJLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN4QyxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUM1QyxJQUFJLFlBQVksRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQyxJQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMzQyxJQUFJLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN4QyxJQUFJLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNyQyxJQUFJLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNyQyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNwQyxJQUFJLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixJQUFJLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN4QyxJQUFJLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN4QyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNwQyxJQUFJLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNwQyxJQUFJLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUN6QyxJQUFJLFdBQVcs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LElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbkcsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZHLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7SUFDakcsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztJQUNyRyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFFakgsUUFBUSxRQUFRLENBQUMsR0FB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
