/** @lends model */

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

/**
 * The types object bound to Lexer#types
 * @type       {Object}
 * @alias module:wick~internals.lexer.Types
 * @see {@link module:wick.core.common.Lexer}
 */
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

/**
 * Array of functions used to process Lexer strings and identify tokens.
 * @type       {Array}
 * @alias module:wick~internals.lexer.TK
 */
const TK = [{
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
    scanToEnd(code) { return (inRange(code, 47, 58) || inRange(code, 64, 91) || inRange(code, 96, 123) || compareCode(code, 36, 45, 95)) ? -1 : 0; }
}, {
    type: Types.str,
    match: 0,
    check(code, text) { if (code === 34 || code === 39) { this.match = code; return 1 } return 0 },
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
const TK_length = TK.length;

var null_token = {
    type: "",
    text: ""
};

/**
 * @classdesc A simple Lexical tokenizer for use with text processing. 
 * 
 * The Lexer parses an input string and yield lexical tokens.  It also provides methods for looking ahead and asserting token values. 
 *
 * There are 9 types of tokens that the Lexer will create:
 * 
 * > 1. **Identifier** - `types.identifier` or `types.id` 
 * >    - Any set of characters beginning with `_`|`a-z`|`A-Z`, and followed by `0-9`|`a-z`|`A-Z`|`-`|`_`|`#`|`$`.
 * > 2. **Number** - `types.number` or `types.num`
 * >    - Any set of characters beginning with `0-9`|`.`, and followed by `0-9`|`.`.
 * > 3. **String**: 2 - `types.string` or `types.str`
 * >    - A set of characters beginning with either `'` or `"` and ending with a matching `'` or `"`.
 * > 4. **Open Bracket** - `types.open_bracket` or `types.ob`
 * >    - A single character from the set `<`|`(`|`{`|`[`.
 * > 5. **Close Bracket** - `types.close_bracket` or `types.cb`
 * >    - A single character from the set `>`|`)`|`}`|`]`.
 * > 7. **Operator**: 
 * >    - A single character from the set `*`|`+`|`<`|`=`|`>`|`\`|`&`|`%`|`!`|`|`|`^`|`:`.
 * > 8. **New Line**: 
 * >    - A single `newline` character.
 * > 9. **White Space**: 
 * >    - An uninterrupted set of `tab` or `space` characters.
 * > 10. **Symbol**:
 * >        - All other characters not defined by the the above, with each symbol token being comprised of one character.
 * 
 * Types are identified by a binary index value and are defined in Lexer.prototype.types. A token's type can be verified by with 
 * ```js
 * lexer.token.type === lexer.types.*`
 * ```
 * @alias Lexer
 * @memberof module:wick.core.common
 * @param {external:String} string - The string to parse. 
 * @param {Boolean} [IGNORE_WHITE_SPACE=true] - If set to true, the Lexer will not generate tokens for newline and whitespace characters, and instead skip to the next no whitespace/newline token. 
 * @throws     {Error} Throws "String value must be passed to Lexer" if a non-string value is passed as `string`.
 */
class Lexer {

    constructor(string = "", IGNORE_WHITE_SPACE = true) {

        if (typeof(string) !== "string") throw new Error("String value must be passed to Lexer");

        this.str = string;

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

    /**
     * Copies the Lexer.
     * @instance
     * @return     {Lexer}  Returns a new Lexer instance with the same property values as this one.
     */
    copy() {

        let out = new Lexer(this.str, this.IWS);
        out.type = this.type;
        out.off = this.off;
        out.tl = this.tl;
        out.char = this.char;
        out.line = this.line;
        return out;
    }

    /**
     * Given another Lexer with the same `str` property value, it will copy the state of that Lexer.
     * @instance
     * @param      {Lexer}  [marker=this.peek]  The Lexer to clone the state from. 
     * @public
     */
    sync(marker = this.p) {

        if (marker instanceof Lexer) {
            if (marker.str !== this.str) throw new Error("Cannot sync Lexers with different strings!");
            this.type = marker.type;
            this.off = marker.off;
            this.tl = marker.tl;
            this.char = marker.char;
            this.line = marker.line;
            this.END = marker.END;
        }

        return this;
    }

    /**
     * Will throw a new Error, appending the parsed string line and position information to the the error message passed into the function.
     * @instance
     * @public
     * @param {external:String} message - The error message.
     */
    throw (message) {
        let t = ("________________________________________________")
        throw new Error(`${message} at ${this.line}:${this.char} "\n${t}\n${this.str.slice(this.pos-30,this.pos) + " !---> " + this.str.slice(this.pos, this.pos+30)} \n${t}\n"`)
    }

    /**
     * Proxy for Lexer.prototype.reset
     * @public
     */
    r() { return this.reset() }

    /**
     * Restore the Lexer back to it's initial state.
     * @public
     */
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
    /**
     * Proxy for Lexer.prototype.next
     * @public
     */
    n() { return this.next() }
    /**
     * Sets the internal state to point to the next token. Sets Lexer.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    next(marker = this) {

        let offset = marker.off,
            str = marker.str;

        if (str.length < 1) {
            marker.off = -1;
            marker.type = -1;
            marker.tl = 0;
            return;
        };

        let char = marker.char,
            line = marker.line,
            type = -1,
            token_length = marker.tl,
            TK_function;

        do {

            offset += token_length;
            char += token_length;

            let code = str.charCodeAt(offset);

            type = -1;

            for (let i = 0; i < TK_length; i++) {
                TK_function = TK[i];
                let test_index = TK_function.check(code, str, offset);
                if (test_index > 0) {
                    type = TK_function.type;
                    let e = 0,
                        i = test_index;
                    for (let l = str.length; i < l; i++) {
                        e = TK_function.scanToEnd(str.charCodeAt(i + offset));
                        if (e > -1) break;
                        e = 0;
                    }
                    token_length = i + e;
                    break;
                }
            }

            if (type < 0)
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

    /**
     * Proxy for Lexer.prototype.assert
     * @public
     */
    a(text) { return this.assert(text) }
    /**
     * Compares the the string value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {external:String} text - The string to compare.
     */
    assert(text) {

        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        var bool = this.text == text;

        if (bool)
            this.next();
        else
            this.throw(`Expecting "${text}" got "${this.text}"`);

        return this;
    }

    /**
     * Proxy for Lexer.prototype.peek
     * @public
     * @readonly
     * @type {Lexer}
     */
    get pk() { return this.peek() }
    /**
     * Returns the Lexer bound to Lexer.prototype.p, or creates and binds a new Lexer to Lexer.prototype.p. Advences the other Lexer to the token ahead of the calling Lexer.
     * @public
     * @type {Lexer}
     * @param {Lexer} [marker=this] - The marker to originate the peek from. 
     * @param {Lexer} [peek_marker=this.p] - The Lexer to set to the next token state.
     * @return {Lexer} - The Lexer that contains the peeked at token.
     */
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

    /**
     * Proxy for Lexer.prototype.text
     * @public
     * @type {external:String}
     * @readonly
     */
    get tx() { return this.text }
    /**
     * The string value of the current token.
     * @type {external:String}
     * @public
     * @readonly
     */
    get text() {
        if (this.off < 0) return null;
        return this.str.slice(this.off, this.off + this.tl);
    }

    /**
     * The binary type id of the current token
     * @type {Number}
     * @public
     * @readonly
     */
    get ty() { return this.type }

    /**
     * The current token's offset position from the start of the string.
     * @type {Number}
     * @public
     * @readonly
     */
    get pos() {
        return this.off;
    }

    /**
     * Proxy for Lexer.prototype.slice
     * @public
     */
    s(start) { return this.slice(start) }
    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | Lexer} start - The offset in this.str to begin the slice. If this value is a Lexer, sets the start point to the value of start.off.
     * @return {external:String} A substring of the parsed string.
     * @public
     */
    slice(start) {
        if (start instanceof Lexer) start = start.off;
        return this.str.slice(start, this.off)
    }

    /**
     * The current token in the form of a new Lexer with the current state.
     * Proxy property for Lexer.prototyp.copy
     * @type {Lexer}
     * @public
     * @readonly
     */
    get token() {
        return this.copy();
    }
    /**
     * Skips to the end of a comment section
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if(!(marker instanceof Lexer)) return marker;
        
        if (marker.tx == "/") {
            if (marker.pk.tx == "*") {
                marker.sync();
                while (!marker.END && (marker.n().tx != "*" || marker.pk.tx != "/")) { /* NO OP */ }
                marker.a("*").a("/");
            }if(marker.pk.tx == "/"){
                let IWS = marker.IWS;
                while (marker.n().ty != types.new_line && !marker.END) { /* NO OP */ }
                marker.IWS = IWS;
                marker.n();
            } else
                if(ASSERT) marker.throw("Expecting the start of a comment");
        }

        return marker;
    }
}

export { Lexer }