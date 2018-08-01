/** @lends module:wick~internals */
//import { jump_table, num_id } from "./look_up_tables"
import { SPACE, DOUBLE_QUOTE, QUOTE, HORIZONTAL_TAB } from "./ascii_code_points"

/**
 * The types object bound to LexerBetaString#types
 * @type       {Object}
 * @alias module:wick~internals.lexer.Types
 * @see {@link module:wick.core.common.LexerBetaString}
 */
const number = 1,
    identifier = 2,
    string = 4,
    white_space = 8,
    open_bracket = 16,
    close_bracket = 32,
    operator = 64,
    symbol = 128,
    new_line = 256;

const white_space_new_line = (white_space | new_line);

const Types = {
    num: number,
    number,
    id: identifier,
    identifier,
    str: string,
    string,
    ws: white_space,
    white_space,
    ob: open_bracket,
    open_bracket,
    cb: close_bracket,
    close_bracket,
    op: operator,
    operator,
    sym: symbol,
    symbol,
    nl: new_line,
    new_line
}

const jump_table = [0, 8, 8, 8, 8, 8, 8, 8, 8, 5, 7, 8, 8, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 9, 2, 8, 8, 9, 9, 3, 10, 11, 9, 9, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 9, 9, 9, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 0, 11, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 0, 11, 0, 0]
const num_id = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 2, 8, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 0, 0, 0, 0, 0, 0, 2, 8, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 0, 0, 0, 0, 0]


/**
 * @classdesc A simple Lexical tokenizer for use with text processing. 
 * 
 * The LexerBetaString parses an input string and yield lexical tokens.  It also provides methods for looking ahead and asserting token values. 
 *
 * There are 9 types of tokens that the LexerBetaString will create:
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
 * >    - A single `newline` (`LF` or `NL`) character. It may also be `LFCR` if the text is formated for Windows.
 * > 9. **White Space**: 
 * >    - An uninterrupted set of `tab` or `space` characters.
 * > 10. **Symbol**:
 * >        - All other characters not defined by the the above, with each symbol token being comprised of one character.
 * 
 * Types are identified by a binary index value and are defined in LexerBetaString.prototype.types. A token's type can be verified by with 
 * ```js
 * LexerBetaString.token.type === LexerBetaString.types.*`
 * ```
 * @alias LexerBetaString
 * @memberof module:wick.core.common
 * @param {external:String} string - The string to parse. 
 * @param {Boolean} [IGNORE_WHITE_SPACE=true] - If set to true, the LexerBetaString will not generate tokens for newline and whitespace characters, and instead skip to the next no whitespace/newline token. 
 * @throws     {Error} Throws "String value must be passed to LexerBetaString" if a non-string value is passed as `string`.
 */
class LexerBetaString {

    constructor(string = "", IGNORE_WHITE_SPACE = true, PEEKING = false) {

        if (typeof(string) !== "string") throw new Error("String value must be passed to LexerBetaString");



        /**
         * The string that the LexerBetaString tokenizes.
         */
        this.str = string;

        /**
         * Flag to ignore white spaced.
         */
        this.IWS = IGNORE_WHITE_SPACE;

        /**
         * The type id of the current token.
         */
        this.type = -1;

        /**
         * The offset in the string of the start of the current token.
         */
        this.off = 0;

        /**
         * The length of the current token.
         */
        this.tl = 0;

        /**
         * The character offset of the current token within a line.
         */
        this.char = 0;

        /**
         * The line position of the current token.
         */
        this.line = 0;

        /**
         * Flag set to true if the end of the string is met.
         */
        this.END = false;

        /**
         * Reference to the peeking LexerBetaString.
         */
        this.p = null;

        /**
         * The length of the string being parsed
         */
        this.sl = string.length;

        /**
         * Reference to token id types.
         */
        this.types = Types;

        if (!PEEKING) this.next();
    }

    /**
     * Defines max parse distance to a subset with an upper bound set to the other LexerBetaString's current position.
     * @param      {LexerBetaString}  LexerBetaString   The LexerBetaString to limit parse distance by.
     */
    fence(lexer = this) {
        if (lexer.str !== this.str)
            return;
        this.sl = lexer.pos;
    }

    /**
     * Copies the LexerBetaString.
     * @return     {LexerBetaString}  Returns a new LexerBetaString instance with the same property values.
     */
    copy() {
        let out = new LexerBetaString(this.str, this.IWS, true);
        out.type = this.type;
        out.off = this.off;
        out.tl = this.tl;
        out.char = this.char;
        out.line = this.line;
        out.sl = this.sl;
        out.END = this.END;
        return out;
    }

    /**
     * Given another LexerBetaString with the same `str` property value, it will copy the state of that LexerBetaString.
     * @param      {LexerBetaString}  [marker=this.peek]  The LexerBetaString to clone the state from. 
     * @throws     {Error} Throws an error if the LexerBetaStrings reference different strings.
     * @public
     */
    sync(marker = this.p) {

        if (marker instanceof LexerBetaString) {
            if (marker.str !== this.str) throw new Error("Cannot sync LexerBetaStrings with different strings!");
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
        throw new Error(`${message} at ${this.line}:${this.char} "\n${t}\n${this.str.slice(this.pos-this.char,this.pos+this.tl)}\n${("").padStart(this.char-1) + "^"}\n${t}\n"`)
    }

    /**
     * Proxy for LexerBetaString.prototype.reset
     * @public
     */
    r() { return this.reset() }

    /**
     * Restore the LexerBetaString back to it's initial state.
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

        this.n();

        return this;
    }

    /**
     * Proxy for LexerBetaString.prototype.next
     * @public
     */
    n() { return this.next() }

    /**
     * Sets the internal state to point to the next token. Sets LexerBetaString.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {LexerBetaString} [marker=this] - If another LexerBetaString is passed into this method, it will advance the token state of that LexerBetaString.
     */
    next(marker = this) {

        let str = marker.str;

        if (marker.sl < 1) {
            marker.off = -1;
            marker.type = -1;
            marker.tl = 0;
            marker.END = true;
            return marker;
        };

        //Token builder
        let length = marker.tl;
        let off = marker.off + marker.tl;
        let l = marker.sl;
        let IWS = this.IWS;
        let type = symbol;
        let char = marker.char;
        let line = marker.line;
        let base = off;

        while (true) {

            base = off;

            length = 1;

            let code = str.charCodeAt(off);

            if (code < 128) {

                switch (jump_table[code]) {
                    case 0: //NUMBER
                        while (++off < l && (12 & num_id[str.charCodeAt(off)])) {};
                        type = number;
                        length = off - base;
                        break;
                    case 1: //IDENTIFIER
                        while (++off < l && (10 & num_id[str.charCodeAt(off)])) {};
                        type = identifier;
                        length = off - base;
                        break;
                    case 2: //DOUBLE QUOTE STRING
                        while (++off < l && str.charCodeAt(off) !== DOUBLE_QUOTE) {};
                        type = string;
                        length = off - base + 1;
                        break;
                    case 3: //SINGLE QUOTE STRING
                        while (++off < l && str.charCodeAt(off) !== QUOTE) {};
                        type = string;
                        length = off - base + 1;
                        break;
                    case 4: //SPACE SET
                        while (++off < l && str.charCodeAt(off) === SPACE) {};
                        type = white_space;
                        length = off - base;
                        break;
                    case 5: //TAB SET
                        while (++off < l && str[off] === HORIZONTAL_TAB) {};
                        type = white_space;
                        length = off - base;
                        break;
                    case 6: //CARIAGE RETURN
                        length = 2;
                    case 7: //LINEFEED
                        type = new_line;
                        char = 0;
                        line++;
                        off += length;
                        break;
                    case 8: //SYMBOL
                        type = symbol;
                        break;
                    case 9: //OPERATOR
                        type = operator;
                        break;
                    case 10: //OPEN BRACKET
                        type = open_bracket;
                        break;
                    case 11: //CLOSE BRACKET
                        type = close_bracket;
                        break;
                }
            }

            if (IWS && (type & white_space_new_line) && off < l) {
                char += length;
                type = symbol;
                continue;
            }

            break;
        }

        if (off >= l) {
            marker.END = true;
            off = l - 1;
        }

        marker.type = type;
        marker.off = base;
        marker.tl = length;
        marker.char = char;
        marker.line = line;

        return marker;
    }

    /**
     * Proxy for LexerBetaString.prototype.assert
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
     * Proxy for LexerBetaString.prototype.peek
     * @public
     * @readonly
     * @type {LexerBetaString}
     */
    get pk() { return this.peek() }

    /**
     * Returns the LexerBetaString bound to LexerBetaString.prototype.p, or creates and binds a new LexerBetaString to LexerBetaString.prototype.p. Advences the other LexerBetaString to the token ahead of the calling LexerBetaString.
     * @public
     * @type {LexerBetaString}
     * @param {LexerBetaString} [marker=this] - The marker to originate the peek from. 
     * @param {LexerBetaString} [peek_marker=this.p] - The LexerBetaString to set to the next token state.
     * @return {LexerBetaString} - The LexerBetaString that contains the peeked at token.
     */
    peek(marker = this, peek_marker = this.p) {

        if (!peek_marker) {
            if (!marker) return null;
            if (!this.p) {
                this.p = new LexerBetaString(this.str, this.IWS, true);
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
     * Proxy for LexerBetaString.prototype.text
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
        return (this.off < 0) ? "" : this.str.slice(this.off, this.off + this.tl);
    }

    /**
     * The type id of the current token.
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
     * Proxy for LexerBetaString.prototype.slice
     * @public
     */
    s(start) { return this.slice(start) }
    
    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | LexerBeta} start - The offset in this.str to begin the slice. If this value is a LexerBeta, sets the start point to the value of start.off.
     * @return {external:String} A substring of the parsed string.
     * @public
     */
    slice(start) {

        if (typeof start === "number" || typeof start === "object") {
            if (start instanceof LexerBetaString) start = start.off;
            return this.str.slice(start, this.off)
        }

        return this.str.slice(this.off, this.sl);
    }

    get ch() {
        return this.str[this.off]
    }

    /**
     * The current token in the form of a new LexerBetaString with the current state.
     * Proxy property for LexerBetaString.prototyp.copy
     * @type {LexerBetaString}
     * @public
     * @readonly
     */
    get token() {
        return this.copy();
    }
    /**
     * Skips to the end of a comment section
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {LexerBetaString} [marker=this] - If another LexerBetaString is passed into this method, it will advance the token state of that LexerBetaString.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof LexerBetaString)) return marker;

        if (marker.tx == "/") {
            if (marker.pk.tx == "*") {
                marker.sync();
                while (!marker.END && (marker.n().tx != "*" || marker.pk.tx != "/")) { /* NO OP */ }
                marker.sync().a("/");
            } else if (marker.pk.tx == "/") {
                let IWS = marker.IWS;
                while (marker.n().ty != types.new_line && !marker.END) { /* NO OP */ }
                marker.IWS = IWS;
                marker.n();
            } else
            if (ASSERT) marker.throw("Expecting the start of a comment");
        }

        return marker;
    }
}

LexerBetaString.prototype.types = Types;

export { LexerBetaString }