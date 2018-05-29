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
            check(code, text) {
                if (inRange(code, 47, 58)) {
                    code = text.charCodeAt(1);
                    if (compareCode(code, 66, 98, 88, 120, 79, 111)) {
                        return 2;
                    }
                    return 1;
                } else if (code == 46) {
                    code = text.charCodeAt(1);
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
                return (inRange(code, 47, 58) || inRange(code, 64, 91) || inRange(code, 96, 123) || compareCode(code, 35, 36, 38, 45, 95)) ? -1 : 0;
            },
            format(token) {

                //token.color = randomColor();
            }

        }, {
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

        }, {
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

        var code = this.string.charCodeAt(0);
        let SPF_function;
        for (var i = 0; i < SPF_length; i++) {
            SPF_function = SPF[i];
            let test_index = SPF_function.check(code, this.string);
            if (test_index > 0) {
                this.type = SPF_function.type;
                var e = 0;
                for (i = test_index; i < this.string.length; i++) {
                    e = SPF_function.scanToEnd(this.string.charCodeAt(i));
                    if (e > -1) break;
                }
                token_length = i + e;
                break;
            }
        }

        var temp = this.string.slice(0, token_length);
        this.string = this.string.slice(token_length);

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

export {Tokenizer}