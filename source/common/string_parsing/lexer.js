//Compares code with argument list and returns true if match is found, otherwise false is returned
function compareCode(code) {
    var list = arguments;
    for (var i = 1, l = list.length; i < l; i++) {
        if (list[i] === code) return true;
    }
    return false;
}

//Returns true if code lies between the other two arguments
function inRange(code, s, e) { return (code > s && code < e); }

/** Lex Token Type Enum */
const Types = {
    num: 1,
    number: 1,
    id: 2,
    identifier: 2,
    str: 4,
    string: 4,
    ws: 8,
    white_space: 8,
    ob: 16,
    open_bracket: 16,
    cb: 32,
    close_bracket: 32,
    op: 64,
    operator: 64,
    sym: 128,
    symbol: 128,
    nl: 256,
    new_line: 256
}

const SPF = [{
    type: Types.num,
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
    scanToEnd(code) { return (inRange(code, 47, 58) || code === 46) ? -1 : 0; }
}, {
    type: Types.id,
    check(code) { return (inRange(code, 64, 91) || inRange(code, 96, 123)) ? 1 : 0; },
    scanToEnd(code) { return (inRange(code, 47, 58) || inRange(code, 64, 91) || inRange(code, 96, 123) || compareCode(code, 35, 36, 45, 95)) ? -1 : 0; }
}, {
    type: Types.str, match:0,
    check(code, text) {if (code === 34 || code === 39) {this.match = code; return 1 } return 0},
    scanToEnd(code) { return (code === this.match) ? 1 : -1; }

}, {
    type: Types.ws,
    check(code) { return (code === 32 || code === 9) ? 1 : 0; },
    scanToEnd(code) { return (code === 32 || code === 9) ? -1 : 0; }
}, {
    type: Types.nl,
    check(code) { return (code === 10) ? 1 : 0; },
    scanToEnd(code) { return 0; }
}, {
    type: Types.ob,
    check(code) { return compareCode(code, 123, 40, 91) ? 1 : 0; },
    scanToEnd(code) { return 0; }
}, {
    type: Types.cb,
    check(code) { return compareCode(code, 125, 41, 93) ? 1 : 0; },
    scanToEnd(code) { return 0; }
}, {
    type: Types.op,
    check(code) { return compareCode(code, 42, 43, 60, 61, 62, 92, 38, 37, 33, 94, 124, 58) ? 1 : 0; },
    scanToEnd(code) { return 0; }
}, {
    type: Types.sym, //Everything else should be generic symbols
    check(code) { return 1; },
    scanToEnd(code) { return 0; } //Generic will capture ANY remainder character sets.
}];
const SPF_length = SPF.length;

var null_token = {
    type: "",
    text: ""
};

export class Lexer {

    constructor(str, IGNORE_WHITE_SPACE = true) {

        if (typeof(str) !== "string") throw new Error("String value must be passed to Lexer");

        this.str = str;

        this.IWS = IGNORE_WHITE_SPACE;

        this.type = -1;
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.END = false;

        this.p = null;

        this.types = Types;

        this.next();
    }

    copy() {

        let out = new Lexer(this.str, this.IWS);
        out.type = this.type;
        out.off = this.off;
        out.tl = this.tl;
        out.char = this.char;
        out.line = this.line;
        return out;
    }

    sync(marker = this.p) {

        if (marker instanceof Lexer) {
            if(marker.str !== this.str) throw new Error("Cannot sync Lexers with different strings!");
            this.type = marker.type;
            this.off = marker.off;
            this.tl = marker.tl;
            this.char = marker.char;
            this.line = marker.line;
            this.END = marker.END;
        }

        return this;
    }

    r() { return this.reset() }
    reset() {

        this.p = null;
        this.type = -1;
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.END = false;

        return this;
    }

    n() { return this.next() }
    next(marker = this) {

        let offset = marker.off,
            str = this.str;

        if (str.length < 1 ) {
            marker.off = -1;
            marker.type = -1;
            marker.tl = 0;
            return;
        };

        let char = marker.char,
            line = marker.line,
            type = -1,
            token_length = marker.tl,
            SPF_function;

        do {

            offset += token_length;
            char += token_length;

            let code = str.charCodeAt(offset);

            type = -1;

            for (let i = 0; i < SPF_length; i++) {
                SPF_function = SPF[i];
                let test_index = SPF_function.check(code, str, offset);
                if (test_index > 0) {
                    type = SPF_function.type;
                    let e = 0,
                        i = test_index;
                    for (let l = str.length; i < l; i++) {
                        e = SPF_function.scanToEnd(str.charCodeAt(i + offset));
                        if (e > -1) break;
                        e = 0;
                    }
                    token_length = i + e;
                    break;
                }
            }

            if(type < 0)
                marker.off = -1;

            if (type & Types.nl)(char = 0, line++);
        } while (marker.IWS && (type & (Types.ws | Types.nl)))

        if (offset >= str.length) {
            this.END = true;
            this.off = str.length;
            return null;
        };

        marker.type = type;
        marker.off = offset;
        marker.tl = token_length;
        marker.char = char;
        marker.line = line;

        return this;
    }

    a(text) { return this.assert(text) }
    assert(text) {

        if (this.off < 0) throw new Error(`Expecting ${text} got null`);

        var bool = this.text == text;

        if (bool)
            this.next();
        else
            throw new Error(`Expecting "${text}" got "${this.text}" at char:${this.char} line:${this.line} "${this.str.slice(0,this.pos) + "*==>" + this.str.slice(this.pos)}"`)

        return this;
    }

    get pk() { return this.peek() }
    peek(marker = this, peek_marker = this.p) {

        if (!peek_marker) {
            if (!marker) return null;
            if (!this.p) {
                this.p = new Lexer(this.str, this.IWS);
                peek_marker = this.p;
            }
        }

        peek_marker.type = marker.type;
        peek_marker.off = marker.off;
        peek_marker.tl = marker.tl;
        peek_marker.char = marker.char;
        peek_marker.line = marker.line;
        this.next(peek_marker);
        return peek_marker;
    }

    get tx() { return this.text }
    get text() {
        if(this.off < 0) return null;
        return this.str.slice(this.off, this.off + this.tl);
    }

    get ty() { return this.type }

    get pos() {

        return this.off;
    }

    s(start) { return this.slice(start) }
    slice(start) {
        if(start instanceof Lexer) start = start.off;
        return this.str.slice(start, this.off)
    }

    get token() {

        return this.copy();
    }
}