'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const A = 65;
const a = 97;
const ACKNOWLEDGE = 6;
const AMPERSAND = 38;
const ASTERISK = 42;
const AT = 64;
const B = 66;
const b = 98;
const BACKSLASH = 92;
const BACKSPACE = 8;
const BELL = 7;
const C = 67;
const c = 99;
const CANCEL = 24;
const CARET = 94;
const CARRIAGE_RETURN = 13;
const CLOSE_CURLY = 125;
const CLOSE_PARENTH = 41;
const CLOSE_SQUARE = 93;
const COLON = 58;
const COMMA = 44;
const d = 100;
const D = 68;
const DATA_LINK_ESCAPE = 16;
const DELETE = 127;
const DEVICE_CTRL_1 = 17;
const DEVICE_CTRL_2 = 18;
const DEVICE_CTRL_3 = 19;
const DEVICE_CTRL_4 = 20;
const DOLLAR = 36;
const DOUBLE_QUOTE = 34;
const e$1 = 101;
const E = 69;
const EIGHT = 56;
const END_OF_MEDIUM = 25;
const END_OF_TRANSMISSION = 4;
const END_OF_TRANSMISSION_BLOCK = 23;
const END_OF_TXT = 3;
const ENQUIRY = 5;
const EQUAL = 61;
const ESCAPE = 27;
const EXCLAMATION = 33;
const f = 102;
const F = 70;
const FILE_SEPERATOR = 28;
const FIVE = 53;
const FORM_FEED = 12;
const FORWARD_SLASH = 47;
const FOUR = 52;
const g = 103;
const G = 71;
const GRAVE = 96;
const GREATER_THAN = 62;
const GROUP_SEPERATOR = 29;
const h = 104;
const H = 72;
const HASH = 35;
const HORIZONTAL_TAB = 9;
const HYPHEN = 45;
const i$1 = 105;
const I = 73;
const j = 106;
const J = 74;
const k = 107;
const K = 75;
const l = 108;
const L = 76;
const LESS_THAN = 60;
const LINE_FEED = 10;
const m = 109;
const M = 77;
const n = 110;
const N = 78;
const NEGATIVE_ACKNOWLEDGE = 21;
const NINE = 57;
const NULL = 0;
const o = 111;
const O = 79;
const ONE = 49;
const OPEN_CURLY = 123;
const OPEN_PARENTH = 40;
const OPEN_SQUARE = 91;
const p = 112;
const P = 80;
const PERCENT = 37;
const PERIOD = 46;
const PLUS = 43;
const q = 113;
const Q = 81;
const QMARK = 63;
const QUOTE = 39;
const r$1 = 114;
const R = 82;
const RECORD_SEPERATOR = 30;
const s = 115;
const S = 83;
const SEMICOLON = 59;
const SEVEN = 55;
const SHIFT_IN = 15;
const SHIFT_OUT = 14;
const SIX = 54;
const SPACE = 32;
const START_OF_HEADER = 1;
const START_OF_TEXT = 2;
const SUBSTITUTE = 26;
const SYNCH_IDLE = 22;
const t = 116;
const T = 84;
const THREE = 51;
const TILDE = 126;
const TWO = 50;
const u = 117;
const U = 85;
const UNDER_SCORE = 95;
const UNIT_SEPERATOR = 31;
const v = 118;
const V = 86;
const VERTICAL_BAR = 124;
const VERTICAL_TAB = 11;
const w = 119;
const W = 87;
const x = 120;
const X = 88;
const y = 121;
const Y = 89;
const z = 122;
const Z = 90;
const ZERO = 48;

/**
 * Lexer Jump table reference 
 * 0. NUMBER
 * 1. IDENTIFIER
 * 2. QUOTE STRING
 * 3. SPACE SET
 * 4. TAB SET
 * 5. CARIAGE RETURN
 * 6. LINEFEED
 * 7. SYMBOL
 * 8. OPERATOR
 * 9. OPEN BRACKET
 * 10. CLOSE BRACKET 
 * 11. DATA_LINK
 */ 
const jump_table = [
7, 	 	/* NULL */
7, 	 	/* START_OF_HEADER */
7, 	 	/* START_OF_TEXT */
7, 	 	/* END_OF_TXT */
7, 	 	/* END_OF_TRANSMISSION */
7, 	 	/* ENQUIRY */
7, 	 	/* ACKNOWLEDGE */
7, 	 	/* BELL */
7, 	 	/* BACKSPACE */
4, 	 	/* HORIZONTAL_TAB */
6, 	 	/* LINEFEED */
7, 	 	/* VERTICAL_TAB */
7, 	 	/* FORM_FEED */
5, 	 	/* CARRIAGE_RETURN */
7, 	 	/* SHIFT_OUT */
7, 		/* SHIFT_IN */
11,	 	/* DATA_LINK_ESCAPE */
7, 	 	/* DEVICE_CTRL_1 */
7, 	 	/* DEVICE_CTRL_2 */
7, 	 	/* DEVICE_CTRL_3 */
7, 	 	/* DEVICE_CTRL_4 */
7, 	 	/* NEGATIVE_ACKNOWLEDGE */
7, 	 	/* SYNCH_IDLE */
7, 	 	/* END_OF_TRANSMISSION_BLOCK */
7, 	 	/* CANCEL */
7, 	 	/* END_OF_MEDIUM */
7, 	 	/* SUBSTITUTE */
7, 	 	/* ESCAPE */
7, 	 	/* FILE_SEPERATOR */
7, 	 	/* GROUP_SEPERATOR */
7, 	 	/* RECORD_SEPERATOR */
7, 	 	/* UNIT_SEPERATOR */
3, 	 	/* SPACE */
8, 	 	/* EXCLAMATION */
2, 	 	/* DOUBLE_QUOTE */
7, 	 	/* HASH */
7, 	 	/* DOLLAR */
8, 	 	/* PERCENT */
8, 	 	/* AMPERSAND */
2, 	 	/* QUOTE */
9, 	 	/* OPEN_PARENTH */
10, 	 /* CLOSE_PARENTH */
8, 	 	/* ASTERISK */
8, 	 	/* PLUS */
7, 	 	/* COMMA */
7, 	 	/* HYPHEN */
7, 	 	/* PERIOD */
7, 	 	/* FORWARD_SLASH */
0, 	 	/* ZERO */
0, 	 	/* ONE */
0, 	 	/* TWO */
0, 	 	/* THREE */
0, 	 	/* FOUR */
0, 	 	/* FIVE */
0, 	 	/* SIX */
0, 	 	/* SEVEN */
0, 	 	/* EIGHT */
0, 	 	/* NINE */
8, 	 	/* COLON */
7, 	 	/* SEMICOLON */
8, 	 	/* LESS_THAN */
8, 	 	/* EQUAL */
8, 	 	/* GREATER_THAN */
7, 	 	/* QMARK */
7, 	 	/* AT */
1, 	 	/* A*/
1, 	 	/* B */
1, 	 	/* C */
1, 	 	/* D */
1, 	 	/* E */
1, 	 	/* F */
1, 	 	/* G */
1, 	 	/* H */
1, 	 	/* I */
1, 	 	/* J */
1, 	 	/* K */
1, 	 	/* L */
1, 	 	/* M */
1, 	 	/* N */
1, 	 	/* O */
1, 	 	/* P */
1, 	 	/* Q */
1, 	 	/* R */
1, 	 	/* S */
1, 	 	/* T */
1, 	 	/* U */
1, 	 	/* V */
1, 	 	/* W */
1, 	 	/* X */
1, 	 	/* Y */
1, 	 	/* Z */
9, 	 	/* OPEN_SQUARE */
7, 	 	/* TILDE */
10, 	/* CLOSE_SQUARE */
7, 	 	/* CARET */
7, 	 	/* UNDER_SCORE */
2, 	 	/* GRAVE */
1, 	 	/* a */
1, 	 	/* b */
1, 	 	/* c */
1, 	 	/* d */
1, 	 	/* e */
1, 	 	/* f */
1, 	 	/* g */
1, 	 	/* h */
1, 	 	/* i */
1, 	 	/* j */
1, 	 	/* k */
1, 	 	/* l */
1, 	 	/* m */
1, 	 	/* n */
1, 	 	/* o */
1, 	 	/* p */
1, 	 	/* q */
1, 	 	/* r */
1, 	 	/* s */
1, 	 	/* t */
1, 	 	/* u */
1, 	 	/* v */
1, 	 	/* w */
1, 	 	/* x */
1, 	 	/* y */
1, 	 	/* z */
9, 	 	/* OPEN_CURLY */
7, 	 	/* VERTICAL_BAR */
10,  	/* CLOSE_CURLY */
7,  	/* TILDE */
7 		/* DELETE */
];	

/**
 * LExer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
 * entries marked as `2` are in the identifier set but not the number set
 * entries marked as `4` are in the number set but not the identifier set
 * entries marked as `8` are in both number and identifier sets
 */
const number_and_identifier_table = [
0, 		/* NULL */
0, 		/* START_OF_HEADER */
0, 		/* START_OF_TEXT */
0, 		/* END_OF_TXT */
0, 		/* END_OF_TRANSMISSION */
0, 		/* ENQUIRY */
0,		/* ACKNOWLEDGE */
0,		/* BELL */
0,		/* BACKSPACE */
0,		/* HORIZONTAL_TAB */
0,		/* LINEFEED */
0,		/* VERTICAL_TAB */
0,		/* FORM_FEED */
0,		/* CARRIAGE_RETURN */
0,		/* SHIFT_OUT */
0,		/* SHIFT_IN */
0,		/* DATA_LINK_ESCAPE */
0,		/* DEVICE_CTRL_1 */
0,		/* DEVICE_CTRL_2 */
0,		/* DEVICE_CTRL_3 */
0,		/* DEVICE_CTRL_4 */
0,		/* NEGATIVE_ACKNOWLEDGE */
0,		/* SYNCH_IDLE */
0,		/* END_OF_TRANSMISSION_BLOCK */
0,		/* CANCEL */
0,		/* END_OF_MEDIUM */
0,		/* SUBSTITUTE */
0,		/* ESCAPE */
0,		/* FILE_SEPERATOR */
0,		/* GROUP_SEPERATOR */
0,		/* RECORD_SEPERATOR */
0,		/* UNIT_SEPERATOR */
0,		/* SPACE */
0,		/* EXCLAMATION */
0,		/* DOUBLE_QUOTE */
0,		/* HASH */
8,		/* DOLLAR */
0,		/* PERCENT */
0,		/* AMPERSAND */
2,		/* QUOTE */
0,		/* OPEN_PARENTH */
0,		 /* CLOSE_PARENTH */
0,		/* ASTERISK */
0,		/* PLUS */
0,		/* COMMA */
2,		/* HYPHEN */
4,		/* PERIOD */
0,		/* FORWARD_SLASH */
8,		/* ZERO */
8,		/* ONE */
8,		/* TWO */
8,		/* THREE */
8,		/* FOUR */
8,		/* FIVE */
8,		/* SIX */
8,		/* SEVEN */
8,		/* EIGHT */
8,		/* NINE */
0,		/* COLON */
0,		/* SEMICOLON */
0,		/* LESS_THAN */
0,		/* EQUAL */
0,		/* GREATER_THAN */
0,		/* QMARK */
0,		/* AT */
2,		/* A*/
8,		/* B */
2,		/* C */
2,		/* D */
8,		/* E */
2,		/* F */
2,		/* G */
2,		/* H */
2,		/* I */
2,		/* J */
2,		/* K */
2,		/* L */
2,		/* M */
2,		/* N */
8,		/* O */
2,		/* P */
2,		/* Q */
2,		/* R */
2,		/* S */
2,		/* T */
2,		/* U */
2,		/* V */
2,		/* W */
8,		/* X */
2,		/* Y */
2,		/* Z */
0,		/* OPEN_SQUARE */
0,		/* TILDE */
0,		/* CLOSE_SQUARE */
0,		/* CARET */
2,		/* UNDER_SCORE */
0,		/* GRAVE */
2,		/* a */
8,		/* b */
2,		/* c */
2,		/* d */
2,		/* e */
2,		/* f */
2,		/* g */
2,		/* h */
2,		/* i */
2,		/* j */
2,		/* k */
2,		/* l */
2,		/* m */
2,		/* n */
8,		/* o */
2,		/* p */
2,		/* q */
2,		/* r */
2,		/* s */
2,		/* t */
2,		/* u */
2,		/* v */
2,		/* w */
8,		/* x */
2,		/* y */
2,		/* z */
0,		/* OPEN_CURLY */
0,		/* VERTICAL_BAR */
0,		/* CLOSE_CURLY */
0,		/* TILDE */
0		/* DELETE */
];

const number = 1,
    identifier = 2,
    string = 4,
    white_space = 8,
    open_bracket = 16,
    close_bracket = 32,
    operator = 64,
    symbol = 128,
    new_line = 256,
    data_link = 512,
    alpha_numeric = (identifier | number),
    white_space_new_line = (white_space | new_line),
    Types = {
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
        new_line,
        dl: data_link,
        data_link,
        alpha_numeric,
        white_space_new_line,
    },

    /*** MASKS ***/

    TYPE_MASK = 0xF,
    PARSE_STRING_MASK = 0x10,
    IGNORE_WHITESPACE_MASK = 0x20,
    CHARACTERS_ONLY_MASK = 0x40,
    TOKEN_LENGTH_MASK = 0xFFFFFF80,

    //De Bruijn Sequence for finding index of right most bit set.
    //http://supertech.csail.mit.edu/papers/debruijn.pdf
    debruijnLUT = [
        0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
        31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
    ];

const  getNumbrOfTrailingZeroBitsFromPowerOf2 = (value) => debruijnLUT[(value * 0x077CB531) >>> 27];

class Lexer {

    constructor(string = "", INCLUDE_WHITE_SPACE_TOKENS = false, PEEKING = false) {

        if (typeof(string) !== "string") throw new Error(`String value must be passed to Lexer. A ${typeof(string)} was passed as the \`string\` argument.`);

        /**
         * The string that the Lexer tokenizes.
         */
        this.str = string;

        /**
         * Reference to the peeking Lexer.
         */
        this.p = null;

        /**
         * The type id of the current token.
         */
        this.type = 32768; //Default "non-value" for types is 1<<15;

        /**
         * The offset in the string of the start of the current token.
         */
        this.off = 0;

        this.masked_values = 0;

        /**
         * The character offset of the current token within a line.
         */
        this.char = 0;
        /**
         * The line position of the current token.
         */
        this.line = 0;
        /**
         * The length of the string being parsed
         */
        this.sl = string.length;
        /**
         * The length of the current token.
         */
        this.tl = 0;

        /**
         * Flag to ignore white spaced.
         */
        this.IWS = !INCLUDE_WHITE_SPACE_TOKENS;

        /**
         * Flag to force the lexer to parse string contents
         */
        this.PARSE_STRING = false;

        if (!PEEKING) this.next();
    }

    /**
     * Restricts max parse distance to the other Lexer's current position.
     * @param      {Lexer}  Lexer   The Lexer to limit parse distance by.
     */
    fence(marker = this) {
        if (marker.str !== this.str)
            return;
        this.sl = marker.off;
        return this;
    }

    /**
     * Copies the Lexer.
     * @return     {Lexer}  Returns a new Lexer instance with the same property values.
     */
    copy(destination = new Lexer(this.str, false, true)) {
        destination.off = this.off;
        destination.char = this.char;
        destination.line = this.line;
        destination.sl = this.sl;
        destination.masked_values = this.masked_values;
        return destination;
    }

    /**
     * Given another Lexer with the same `str` property value, it will copy the state of that Lexer.
     * @param      {Lexer}  [marker=this.peek]  The Lexer to clone the state from. 
     * @throws     {Error} Throws an error if the Lexers reference different strings.
     * @public
     */
    sync(marker = this.p) {

        if (marker instanceof Lexer) {
            if (marker.str !== this.str) throw new Error("Cannot sync Lexers with different strings!");
            this.off = marker.off;
            this.char = marker.char;
            this.line = marker.line;
            this.masked_values = marker.masked_values;
        }

        return this;
    }

    /**
    Creates and error message with a diagrame illustrating the location of the error. 
    */
    errorMessage(message = "") {
        const arrow = String.fromCharCode(0x2b89),
            trs = String.fromCharCode(0x2500),
            line = String.fromCharCode(0x2500),
            thick_line = String.fromCharCode(0x2501),
            line_number = "    " + this.line + ": ",
            line_fill = line_number.length,
            t = thick_line.repeat(line_fill + 48),
            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
        const pk = this.copy();
        pk.IWS = false;
        while (!pk.END && pk.ty !== Types.nl) { pk.next(); }
        const end = (pk.END) ? this.str.length : pk.off ;

    //console.log(`"${this.str.slice(this.off-this.char+((this.line > 0) ? 2 :2), end).split("").map((e,i,s)=>e.charCodeAt(0))}"`)
    let v = "", length = 0;
    v = this.str.slice(this.off-this.char+((this.line > 0) ? 2 :1), end);
    length = this.char;
    return `${message} at ${this.line}:${this.char}
${t}
${line_number+v}
${line.repeat(length+line_fill-((this.line > 0) ? 2 :1))+arrow}
${t}
${is_iws}`;
    }

    /**
     * Will throw a new Error, appending the parsed string line and position information to the the error message passed into the function.
     * @instance
     * @public
     * @param {String} message - The error message.
     * @param {Bool} DEFER - if true, returns an Error object instead of throwing.
     */
    throw (message, DEFER = false) {
        const error = new Error(this.errorMessage(message));
        if (DEFER)
            return error;
        throw error;
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
        this.type = 32768;
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.n;
        return this;
    }

    resetHead() {
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.p = null;
        this.type = 32768;
    }

    /**
     * Sets the internal state to point to the next token. Sets Lexer.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    next(marker = this) {

        if (marker.sl < 1) {
            marker.off = 0;
            marker.type = 32768;
            marker.tl = 0;
            marker.line = 0;
            marker.char = 0;
            return marker;
        }

        //Token builder
        const l = marker.sl,
            str = marker.str,
            IWS = marker.IWS;

        let length = marker.tl,
            off = marker.off + length,
            type = symbol,
            line = marker.line,
            base = off,
            char = marker.char,
            root = marker.off;

        if (off >= l) {
            length = 0;
            base = l;
            //char -= base - off;
            marker.char = char + (base - marker.off);
            marker.type = type;
            marker.off = base;
            marker.tl = 0;
            marker.line = line;
            return marker;
        }

        const USE_CUSTOM_SYMBOLS = !!this.symbol_map;
        let NORMAL_PARSE = true;

        if (USE_CUSTOM_SYMBOLS) {

            let code = str.charCodeAt(off);
            let off2 = off;
            let map = this.symbol_map,
                m;
            let i = 0;

            while (code == 32 && IWS)
                (code = str.charCodeAt(++off2), off++);

            while ((m = map.get(code))) {
                map = m;
                off2 += 1;
                code = str.charCodeAt(off2);
            }

            if (map.IS_SYM) {
                NORMAL_PARSE = false;
                base = off;
                length = off2 - off;
                //char += length;
            }
        }

        if (NORMAL_PARSE) {

            for (;;) {

                base = off;

                length = 1;

                const code = str.charCodeAt(off);

                if (code < 128) {

                    switch (jump_table[code]) {
                        case 0: //NUMBER
                            while (++off < l && (12 & number_and_identifier_table[str.charCodeAt(off)]));

                            if ((str[off] == "e" || str[off] == "E") && (12 & number_and_identifier_table[str.charCodeAt(off + 1)])) {
                                off++;
                                if (str[off] == "-") off++;
                                marker.off = off;
                                marker.tl = 0;
                                marker.next();
                                off = marker.off + marker.tl;
                                //Add e to the number string
                            }

                            type = number;
                            length = off - base;

                            break;
                        case 1: //IDENTIFIER
                            while (++off < l && ((10 & number_and_identifier_table[str.charCodeAt(off)])));
                            type = identifier;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol;
                            } else {
                                while (++off < l && str.charCodeAt(off) !== code);
                                type = string;
                                length = off - base + 1;
                            }
                            break;
                        case 3: //SPACE SET
                            while (++off < l && str.charCodeAt(off) === SPACE);
                            type = white_space;
                            length = off - base;
                            break;
                        case 4: //TAB SET
                            while (++off < l && str[off] === HORIZONTAL_TAB);
                            type = white_space;
                            length = off - base;
                            break;
                        case 5: //CARIAGE RETURN
                            length = 2;
                        case 6: //LINEFEED
                            //Intentional
                            type = new_line;
                            line++;
                            base = off;
                            root = off;
                            off += length;
                            char = 0;
                            break;
                        case 7: //SYMBOL
                            type = symbol;
                            break;
                        case 8: //OPERATOR
                            type = operator;
                            break;
                        case 9: //OPEN BRACKET
                            type = open_bracket;
                            break;
                        case 10: //CLOSE BRACKET
                            type = close_bracket;
                            break;
                        case 11: //Data Link Escape
                            type = data_link;
                            length = 4; //Stores two UTF16 values and a data link sentinel
                            break;
                    }
                }else{
                    break;
                }

                if (IWS && (type & white_space_new_line)) {
                    if (off < l) {
                        type = symbol;
                        //off += length;
                        continue;
                    } else {
                        //Trim white space from end of string
                        //base = l - off;
                        //marker.sl -= off;
                        //length = 0;
                    }
                }
                break;
            }
        }

        marker.type = type;
        marker.off = base;
        marker.tl = (this.masked_values & CHARACTERS_ONLY_MASK) ? Math.min(1, length) : length;
        marker.char = char + base - root;
        marker.line = line;
        return marker;
    }


    /**
     * Proxy for Lexer.prototype.assert
     * @public
     */
    a(text) {
        return this.assert(text);
    }

    /**
     * Compares the string value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assert(text) {

        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        if (this.text == text)
            this.next();
        else
            this.throw(`Expecting "${text}" got "${this.text}"`);

        return this;
    }

    /**
     * Proxy for Lexer.prototype.assertCharacter
     * @public
     */
    aC(char) { return this.assertCharacter(char) }
    /**
     * Compares the character value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assertCharacter(char) {

        if (this.off < 0) this.throw(`Expecting ${char[0]} got null`);

        if (this.ch == char[0])
            this.next();
        else
            this.throw(`Expecting "${char[0]}" got "${this.tx[this.off]}"`);

        return this;
    }

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
                this.p = new Lexer(this.str, false, true);
                peek_marker = this.p;
            }
        }
        peek_marker.masked_values = marker.masked_values;
        peek_marker.type = marker.type;
        peek_marker.off = marker.off;
        peek_marker.tl = marker.tl;
        peek_marker.char = marker.char;
        peek_marker.line = marker.line;
        this.next(peek_marker);
        return peek_marker;
    }


    /**
     * Proxy for Lexer.prototype.slice
     * @public
     */
    s(start) { return this.slice(start) }

    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | LexerBeta} start - The offset in this.str to begin the slice. If this value is a LexerBeta, sets the start point to the value of start.off.
     * @return {String} A substring of the parsed string.
     * @public
     */
    slice(start = this.off) {

        if (start instanceof Lexer) start = start.off;

        return this.str.slice(start, (this.off <= start) ? this.sl : this.off);
    }

    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof Lexer)) return marker;

        if (marker.ch == "/") {
            if (marker.pk.ch == "*") {
                marker.sync();
                while (!marker.END && (marker.next().ch != "*" || marker.pk.ch != "/")) { /* NO OP */ }
                marker.sync().assert("/");
            } else if (marker.pk.ch == "/") {
                const IWS = marker.IWS;
                while (marker.next().ty != Types.new_line && !marker.END) { /* NO OP */ }
                marker.IWS = IWS;
                marker.next();
            } else
            if (ASSERT) marker.throw("Expecting the start of a comment");
        }

        return marker;
    }

    setString(string, RESET = true) {
        this.str = string;
        this.sl = string.length;
        if (RESET) this.resetHead();
    }

    toString() {
        return this.slice();
    }

    /**
     * Returns new Whind Lexer that has leading and trailing whitespace characters removed from input. 
     * leave_leading_amount - Maximum amount of leading space caracters to leave behind. Default is zero
     * leave_trailing_amount - Maximum amount of trailing space caracters to leave behind. Default is zero
     */
    trim(leave_leading_amount = 0, leave_trailing_amount = leave_leading_amount) {
        const lex = this.copy();

        let space_count = 0,
            off = lex.off;

        for (; lex.off < lex.sl; lex.off++) {
            const c = jump_table[lex.string.charCodeAt(lex.off)];

            if (c > 2 && c < 7) {

                if (space_count >= leave_leading_amount) {
                    off++;
                } else {
                    space_count++;
                }
                continue;
            }

            break;
        }

        lex.off = off;
        space_count = 0;
        off = lex.sl;

        for (; lex.sl > lex.off; lex.sl--) {
            const c = jump_table[lex.string.charCodeAt(lex.sl - 1)];

            if (c > 2 && c < 7) {
                if (space_count >= leave_trailing_amount) {
                    off--;
                } else {
                    space_count++;
                }
                continue;
            }

            break;
        }

        lex.sl = off;

        if (leave_leading_amount > 0)
            lex.IWS = false;

        lex.token_length = 0;

        lex.next();

        return lex;
    }

    /** Adds symbol to symbol_map. This allows custom symbols to be defined and tokenized by parser. **/
    addSymbol(sym) {
        if (!this.symbol_map)
            this.symbol_map = new Map;


        let map = this.symbol_map;

        for (let i = 0; i < sym.length; i++) {
            let code = sym.charCodeAt(i);
            let m = map.get(code);
            if (!m) {
                m = map.set(code, new Map).get(code);
            }
            map = m;
        }
        map.IS_SYM = true;
    }

    /*** Getters and Setters ***/
    get string() {
        return this.str;
    }

    get string_length() {
        return this.sl - this.off;
    }

    set string_length(s) {}

    /**
     * The current token in the form of a new Lexer with the current state.
     * Proxy property for Lexer.prototype.copy
     * @type {Lexer}
     * @public
     * @readonly
     */
    get token() {
        return this.copy();
    }


    get ch() {
        return this.str[this.off];
    }

    /**
     * Proxy for Lexer.prototype.text
     * @public
     * @type {String}
     * @readonly
     */
    get tx() { return this.text }

    /**
     * The string value of the current token.
     * @type {String}
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
     * Proxy for Lexer.prototype.peek
     * @public
     * @readonly
     * @type {Lexer}
     */
    get pk() { return this.peek() }

    /**
     * Proxy for Lexer.prototype.next
     * @public
     */
    get n() { return this.next() }

    get END() { return this.off >= this.sl }
    set END(v) {}

    get type() {
        return 1 << (this.masked_values & TYPE_MASK);
    }

    set type(value) {
        //assuming power of 2 value.
        this.masked_values = (this.masked_values & ~TYPE_MASK) | ((getNumbrOfTrailingZeroBitsFromPowerOf2(value)) & TYPE_MASK);
    }

    get tl() {
        return this.token_length;
    }

    set tl(value) {
        this.token_length = value;
    }

    get token_length() {
        return ((this.masked_values & TOKEN_LENGTH_MASK) >> 7);
    }

    set token_length(value) {
        this.masked_values = (this.masked_values & ~TOKEN_LENGTH_MASK) | (((value << 7) | 0) & TOKEN_LENGTH_MASK);
    }

    get IGNORE_WHITE_SPACE() {
        return this.IWS;
    }

    set IGNORE_WHITE_SPACE(bool) {
        this.iws = !!bool;
    }

    get CHARACTERS_ONLY() {
        return !!(this.masked_values & CHARACTERS_ONLY_MASK);
    }

    set CHARACTERS_ONLY(boolean) {
        this.masked_values = (this.masked_values & ~CHARACTERS_ONLY_MASK) | ((boolean | 0) << 6);
    }

    get IWS() {
        return !!(this.masked_values & IGNORE_WHITESPACE_MASK);
    }

    set IWS(boolean) {
        this.masked_values = (this.masked_values & ~IGNORE_WHITESPACE_MASK) | ((boolean | 0) << 5);
    }

    get PARSE_STRING() {
        return !!(this.masked_values & PARSE_STRING_MASK);
    }

    set PARSE_STRING(boolean) {
        this.masked_values = (this.masked_values & ~PARSE_STRING_MASK) | ((boolean | 0) << 4);
    }

    /**
     * Reference to token id types.
     */
    get types() {
        return Types;
    }
}

Lexer.prototype.addCharacter = Lexer.prototype.addSymbol;

function whind$1(string, INCLUDE_WHITE_SPACE_TOKENS = false) { return new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS) }

whind$1.constructor = Lexer;

Lexer.types = Types;
whind$1.types = Types;

const uri_reg_ex = /(?:([a-zA-Z][\dA-Za-z\+\.\-]*)(?:\:\/\/))?(?:([a-zA-Z][\dA-Za-z\+\.\-]*)(?:\:([^\<\>\:\?\[\]\@\/\#\b\s]*)?)?\@)?(?:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((?:\[[0-9a-f]{1,4})+(?:\:[0-9a-f]{0,4}){2,7}\])|([^\<\>\:\?\[\]\@\/\#\b\s\.]{2,}(?:\.[^\<\>\:\?\[\]\@\/\#\b\s]*)*))?(?:\:(\d+))?((?:[^\?\[\]\#\s\b]*)+)?(?:\?([^\[\]\#\s\b]*))?(?:\#([^\#\s\b]*))?/i;

const STOCK_LOCATION = {
    protocol: "",
    host: "",
    port: "",
    path: "",
    hash: "",
    query: "",
    search: ""
};

function fetchLocalText(URL, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "GET"
        }).then(r => {

            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.text().then(res);
        }).catch(e => rej(e));
    });
}

function fetchLocalJSON(URL, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "GET"
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res).catch(rej);
        }).catch(e => rej(e));
    });
}

function submitForm(URL, form_data, m = "same-origin") {
    return new Promise((res, rej) => {
        var form;

        if (form_data instanceof FormData)
            form = form_data;
        else {
            form = new FormData();
            for (let name in form_data)
                form.append(name, form_data[name] + "");
        }

        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "POST",
            body: form,
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}

function submitJSON(URL, json_data, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: m, // CORs not allowed
            credentials: m,
            method: "POST",
            body: JSON.stringify(json_data),
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}



/**
 * Used for processing URLs, handling `document.location`, and fetching data.
 * @param      {string}   url           The URL string to wrap.
 * @param      {boolean}  USE_LOCATION  If `true` missing URL parts are filled in with data from `document.location`. 
 * @return     {URL}   If a falsy value is passed to `url`, and `USE_LOCATION` is `true` a Global URL is returned. This is directly linked to the page and will _update_ the actual page URL when its values are change. Use with caution. 
 * @alias URL
 * @memberof module:wick.core.network
 */
class URL {

    static resolveRelative(URL_or_url_new, URL_or_url_original = document.location.toString(), ) {

        let URL_old = (URL_or_url_original instanceof URL) ? URL_or_url_original : new URL(URL_or_url_original);
        let URL_new = (URL_or_url_new instanceof URL) ? URL_or_url_new : new URL(URL_or_url_new);

        if (!(URL_old + "") || !(URL_new + "")) return null;

        let new_path = "";
        if (URL_new.path[0] != "/") {

            let a = URL_old.path.split("/");
            let b = URL_new.path.split("/");


            if (b[0] == "..") a.splice(a.length - 1, 1);
            for (let i = 0; i < b.length; i++) {
                switch (b[i]) {
                    case "..":
                    case ".":
                        a.splice(a.length - 1, 1);
                        break;
                    default:
                        a.push(b[i]);
                }
            }
            URL_new.path = a.join("/");
        }

        return URL_new;
    }

    constructor(url = "", USE_LOCATION = false) {

        let IS_STRING = true,
            IS_LOCATION = false;


        let location = (typeof(document) !== "undefined") ? document.location : STOCK_LOCATION;

        if (typeof(Location) !== "undefined" && url instanceof Location) {
            location = url;
            url = "";
            IS_LOCATION = true;
        }
        if (!url || typeof(url) != "string") {
            IS_STRING = false;
            IS_LOCATION = true;
            if (URL.GLOBAL && USE_LOCATION)
                return URL.GLOBAL;
        }

        /**
         * URL protocol
         */
        this.protocol = "";

        /**
         * Username string
         */
        this.user = "";

        /**
         * Password string
         */
        this.pwd = "";

        /**
         * URL hostname
         */
        this.host = "";

        /**
         * URL network port number.
         */
        this.port = 0;

        /**
         * URL resource path
         */
        this.path = "";

        /**
         * URL query string.
         */
        this.query = "";

        /**
         * Hashtag string
         */
        this.hash = "";

        /**
         * Map of the query data
         */
        this.map = null;

        if (IS_STRING) {
            if (url instanceof URL) {
                this.protocol = url.protocol;
                this.user = url.user;
                this.pwd = url.pwd;
                this.host = url.host;
                this.port = url.port;
                this.path = url.path;
                this.query = url.query;
                this.hash = url.hash;
            } else {
                let part = url.match(uri_reg_ex);

                //If the complete string is not matched than we are dealing with something other 
                //than a pure URL. Thus, no object is returned. 
                if (part[0] !== url) return null;

                this.protocol = part[1] || ((USE_LOCATION) ? location.protocol : "");
                this.user = part[2] || "";
                this.pwd = part[3] || "";
                this.host = part[4] || part[5] || part[6] || ((USE_LOCATION) ? location.hostname : "");
                this.port = parseInt(part[7] || ((USE_LOCATION) ? location.port : 0));
                this.path = part[8] || ((USE_LOCATION) ? location.pathname : "");
                this.query = part[9] || ((USE_LOCATION) ? location.search.slice(1) : "");
                this.hash = part[10] || ((USE_LOCATION) ? location.hash.slice(1) : "");

            }
        } else if (IS_LOCATION) {
            this.protocol = location.protocol.replace(/\:/g, "");
            this.host = location.hostname;
            this.port = location.port;
            this.path = location.pathname;
            this.hash = location.hash.slice(1);
            this.query = location.search.slice(1);
            this._getQuery_(this.query);

            if (USE_LOCATION) {
                URL.G = this;
                return URL.R;
            }
        }
        this._getQuery_(this.query);
    }


    /**
    URL Query Syntax

    root => [root_class] [& [class_list]]
         => [class_list]

    root_class = key_list

    class_list [class [& key_list] [& class_list]]

    class => name & key_list

    key_list => [key_val [& key_list]]

    key_val => name = val

    name => ALPHANUMERIC_ID

    val => NUMBER
        => ALPHANUMERIC_ID
    */

    /**
     * Pulls query string info into this.map
     * @private
     */
    _getQuery_() {
        let map = (this.map) ? this.map : (this.map = new Map());

        let lex = whind$1(this.query);


        const get_map = (k, m) => (m.has(k)) ? m.get(k) : m.set(k, new Map).get(k);

        let key = 0,
            key_val = "",
            class_map = get_map(key_val, map),
            lfv = 0;

        while (!lex.END) {
            switch (lex.tx) {
                case "&": //At new class or value
                    if (lfv > 0)
                        key = (class_map.set(key_val, lex.s(lfv)), lfv = 0, lex.n.pos);
                    else {
                        key_val = lex.s(key);
                        key = (class_map = get_map(key_val, map), lex.n.pos);
                    }
                    continue;
                case "=":
                    //looking for a value now
                    key_val = lex.s(key);
                    lfv = lex.n.pos;
                    continue;
            }
            lex.n;
        }

        if (lfv > 0) class_map.set(key_val, lex.s(lfv));
    }

    setPath(path) {

        this.path = path;

        return new URL(this);
    }

    setLocation() {
        history.replaceState({}, "replaced state", `${this}`);
        window.onpopstate();
    }

    toString() {
        let str = [];

        if (this.host) {

            if (this.protocol)
                str.push(`${this.protocol}://`);

            str.push(`${this.host}`);
        }

        if (this.port)
            str.push(`:${this.port}`);

        if (this.path)
            str.push(`${this.path[0] == "/" ? "" : "/"}${this.path}`);

        if (this.query)
            str.push(((this.query[0] == "?" ? "" : "?") + this.query));

        if (this.hash)
            str.push("#" + this.hash);


        return str.join("");
    }

    /**
     * Pulls data stored in query string into an object an returns that.
     * @param      {string}  class_name  The class name
     * @return     {object}  The data.
     */
    getData(class_name = "") {
        if (this.map) {
            let out = {};
            let _c = this.map.get(class_name);
            if (_c) {
                for (let [key, val] of _c.entries())
                    out[key] = val;
                return out;
            }
        }
        return null;
    }

    /**
     * Sets the data in the query string. Wick data is added after a second `?` character in the query field, and appended to the end of any existing data.
     * @param      {string}  class_name  Class name to use in query string. Defaults to root, no class 
     * @param      {object | Model | AnyModel}  data        The data
     */
    setData(data = null, class_name = "") {

        if (data) {

            let map = this.map = new Map();

            let store = (map.has(class_name)) ? map.get(class_name) : (map.set(class_name, new Map()).get(class_name));

            //If the data is a falsy value, delete the association.

            for (let n in data) {
                if (data[n] !== undefined && typeof data[n] !== "object")
                    store.set(n, data[n]);
                else
                    store.delete(n);
            }

            //set query
            let class_, null_class, str = "";

            if ((null_class = map.get(""))) {
                if (null_class.size > 0) {
                    for (let [key, val] of null_class.entries())
                        str += `&${key}=${val}`;

                }
            }

            for (let [key, class_] of map.entries()) {
                if (key === "")
                    continue;
                if (class_.size > 0) {
                    str += `&${key}`;
                    for (let [key, val] of class_.entries())
                        str += `&${key}=${val}`;
                }
            }
            
            str = str.slice(1);

            this.query = this.query.split("?")[0] + "?" + str;

            if (URL.G == this)
                this.goto();
        } else {
            this.query = "";
        }

        return this;

    }

    /**
     * Fetch a string value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchText(ALLOW_CACHE = true) {

        if (ALLOW_CACHE) {

            let resource = URL.RC.get(this.path);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalText(this.path).then(res => (URL.RC.set(this.path, res), res));
    }

    /**
     * Fetch a JSON value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchJSON(ALLOW_CACHE = true) {

        let string_url = this.toString();

        if (ALLOW_CACHE) {

            let resource = URL.RC.get(string_url);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalJSON(string_url).then(res => (URL.RC.set(this.path, res), res));
    }

    /**
     * Cache a local resource at the value 
     * @param    {object}  resource  The resource to store at this URL path value.
     * @returns {boolean} `true` if a resource was already cached for this URL, false otherwise.
     */
    cacheResource(resource) {

        let occupied = URL.RC.has(this.path);

        URL.RC.set(this.path, resource);

        return occupied;
    }

    submitForm(form_data) {
        return submitForm(this.toString(), form_data);
    }

    submitJSON(json_data, mode) {
        return submitJSON(this.toString(), json_data, mode);
    }
    /**
     * Goes to the current URL.
     */
    goto() {
        return;
        let url = this.toString();
        history.pushState({}, "ignored title", url);
        window.onpopstate();
        URL.G = this;
    }
    //Returns the last segment of the path
    get file() {
        return this.path.split("/").pop();
    }


    //Returns the all but the last segment of the path
    get dir() {
        return this.path.split("/").slice(0, -1).join("/") || "/";
    }

    get pathname() {
        return this.path;
    }

    get href() {
        return this.toString();
    }

    get ext() {
        const m = this.path.match(/\.([^\.]*)$/);
        return m ? m[1] : "";
    }

    get search() {
        return this.query;
    }
}

/**
 * The fetched resource cache.
 */
URL.RC = new Map();

/**
 * The Default Global URL object. 
 */
URL.G = null;

/**
 * The Global object Proxy.
 */
URL.R = {
    get protocol() {
        return URL.G.protocol;
    },
    set protocol(v) {
        return;
        URL.G.protocol = v;
    },
    get user() {
        return URL.G.user;
    },
    set user(v) {
        return;
        URL.G.user = v;
    },
    get pwd() {
        return URL.G.pwd;
    },
    set pwd(v) {
        return;
        URL.G.pwd = v;
    },
    get host() {
        return URL.G.host;
    },
    set host(v) {
        return;
        URL.G.host = v;
    },
    get port() {
        return URL.G.port;
    },
    set port(v) {
        return;
        URL.G.port = v;
    },
    get path() {
        return URL.G.path;
    },
    set path(v) {
        return;
        URL.G.path = v;
    },
    get query() {
        return URL.G.query;
    },
    set query(v) {
        return;
        URL.G.query = v;
    },
    get hash() {
        return URL.G.hash;
    },
    set hash(v) {
        return;
        URL.G.hash = v;
    },
    get map() {
        return URL.G.map;
    },
    set map(v) {
        return;
        URL.G.map = v;
    },
    setPath(path) {
        return URL.G.setPath(path);
    },
    setLocation() {
        return URL.G.setLocation();
    },
    toString() {
        return URL.G.toString();
    },
    getData(class_name = "") {
        return URL.G.getData(class_name = "");
    },
    setData(class_name = "", data = null) {
        return URL.G.setData(class_name, data);
    },
    fetchText(ALLOW_CACHE = true) {
        return URL.G.fetchText(ALLOW_CACHE);
    },
    cacheResource(resource) {
        return URL.G.cacheResource(resource);
    }
};





let SIMDATA = null;

/* Replaces the fetch actions with functions that simulate network fetches. Resources are added by the user to a Map object. */
URL.simulate = function() {
    SIMDATA = new Map;
    URL.prototype.fetchText = async d => ((d = this.toString()), SIMDATA.get(d)) ? SIMDATA.get(d) : "";
    URL.prototype.fetchJSON = async d => ((d = this.toString()), SIMDATA.get(d)) ? JSON.parse(SIMDATA.get(d).toString()) : {};
};

//Allows simulated resources to be added as a key value pair, were the key is a URI string and the value is string data.
URL.addResource = (n, v) => (n && v && (SIMDATA || (SIMDATA = new Map())) && SIMDATA.set(n.toString(), v.toString));

URL.polyfill = async function() {
    if (typeof(global) !== "undefined") {

        const 
            fs = (await Promise.resolve(require('fs'))).promises,
            path = (await Promise.resolve(require('path')));


        global.Location = (class extends URL {});

        global.document = global.document || {};

        global.document.location = new URL(process.env.PWD);
        /**
         * Global `fetch` polyfill - basic support
         */
        global.fetch = async (url, data) => {
            let
                p = path.resolve(process.cwd(), "" + url),
                d = await fs.readFile(p, "utf8");

            try {
                return {
                    status: 200,
                    text: () => {
                        return {
                            then: (f) => f(d)
                        }
                    }
                };
            } catch (err) {
                throw err;
            }
        };
    }
};

Object.freeze(URL.R);
Object.freeze(URL.RC);
Object.seal(URL);

/**
 * Global Document instance short name
 * @property DOC
 * @package
 * @memberof module:wick~internals
 * @type 	{Document}
 */
const DOC = (typeof(document) !== "undefined") ? document : ()=>{};

/**
 * Global Window Instance short name
 * @property WIN
 * @package
 * @memberof module:wick~internals
 * @type 	{Window}
 */
const WIN = (typeof(window) !== "undefined") ? window : ()=>{};

/**
 * Global HTMLElement class short name
 * @property EL
 * @package
 * @memberof module:wick~internals
 * @type 	{HTMLElement}
 */
const EL = (typeof(HTMLElement) !== "undefined") ? HTMLElement : ()=>{};

/**
 * Global Object class short name
 * @property OB
 * @package
 * @memberof module:wick~internals
 * @type Object
 */
const OB = Object;

/**
 * Global String class short name
 * @property STR
 * @package
 * @memberof module:wick~internals
 * @type String
 */
const STR = String;

/**
 * Global Array class short name
 * @property AR
 * @package
 * @memberof module:wick~internals
 * @type 	{Array}
 */
const AR = Array;

/**
 * Global Number class short name
 * @property NUM
 * @package
 * @memberof module:wick~internals
 * @type 	{Number}
 */
const NUM = Number;

/**
 * Global Date class short name
 * @property DT
 * @package
 * @memberof module:wick~internals
 * @type 	{Date}
 */
const DT = Date;

/**
 * Global Boolean class short name
 * @property BO
 * @package
 * @memberof module:wick~internals
 * @type 	{Boolean}
 */
const BO = Boolean;

/***************** Functions ********************/

/**
 *  Global document.createElement short name function.
 * @method DOC
 * @package
 * @memberof module:wick~internals
 * @param 	{String}  		e   - tagname of element to create. 
 * @return  {HTMLElement}  		- HTMLElement instance generated by the document. 
 */
const createElement = (e) => document.createElement(e);

/**
 *  Element.prototype.appendChild short name wrapper.
 * @method appendChild
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el  	- parent HTMLElement.
 * @return  {HTMLElement | HTMLNode}  		ch_el 	- child HTMLElement or HTMLNode. 
 */
const appendChild = (el, ch_el) => el.appendChild(ch_el);

/**
 *  Element.prototype.cloneNode short name wrapper.
 * @method cloneNode
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el   - HTMLElement to clone.
 * @return  {Boolean}  			bool - Switch for deep clone
 */
const cloneNode = (el, bool) => el.cloneNode(bool);

/**
 *  Element.prototype.getElementsByTagName short name wrapper.
 * @method _getElementByTag_
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el   - HTMLElement to find tags on.
 * @return  {String}  			tag - tagnames of elements to find.
 */
const _getElementByTag_ = (el, tag) => el.getElementsByTagName(tag);

/**
 *  Shortname for `instanceof` expression
 * @method _instanceOf_
 * @package
 * @param      {object}  inst    The instance
 * @param      {object}  constr  The constructor
 * @return     {boolean}  the result of `inst instanceof constr`
 */
const _instanceOf_ = (inst, constr) => inst instanceof constr;

const _SealedProperty_ = (object, name, value) => OB.defineProperty(object, name, {value, configurable: false, enumerable: false, writable: true});
const _FrozenProperty_ = (object, name, value) => OB.defineProperty(object, name, {value, configurable: false, enumerable: false, writable: false});

/**
 * Used to call the Scheduler after a JavaScript runtime tick.
 *
 * Depending on the platform, caller will either map to requestAnimationFrame or it will be a setTimout.
 */
 
const caller = (typeof(window) == "object" && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1);
};

const perf = (typeof(performance) == "undefined") ? { now: () => Date.now() } : performance;


/**
 * Handles updating objects. It does this by splitting up update cycles, to respect the browser event model. 
 *    
 * If any object is scheduled to be updated, it will be blocked from scheduling more updates until the next ES VM tick.
 */
class Spark {
    /**
     * Constructs the object.
     */
    constructor() {

        this.update_queue_a = [];
        this.update_queue_b = [];

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;

        this.callback = ()=>{};


        if(typeof(window) !== "undefined"){
            window.addEventListener("load",()=>{
                this.callback = () => this.update();
                caller(this.callback);
            });
        }else{
            this.callback = () => this.update();
        }


        this.frame_time = perf.now();

        this.SCHEDULE_PENDING = false;
    }

    /**
     * Given an object that has a _SCHD_ Boolean property, the Scheduler will queue the object and call its .update function 
     * the following tick. If the object does not have a _SCHD_ property, the Scheduler will persuade the object to have such a property.
     * 
     * If there are currently no queued objects when this is called, then the Scheduler will user caller to schedule an update.
     */
    queueUpdate(object, timestart = 1, timeend = 0) {

        if (object._SCHD_ || object._SCHD_ > 0) {
            if (this.SCHEDULE_PENDING)
                return;
            else
                return caller(this.callback);
        }

        object._SCHD_ = ((timestart & 0xFFFF) | ((timeend) << 16));

        this.update_queue.push(object);

        if (this._SCHD_)
            return;

        this.frame_time = perf.now() | 0;


        if(!this.SCHEDULE_PENDING){
            this.SCHEDULE_PENDING = true;
            caller(this.callback);
        }
    }

    removeFromQueue(object){

        if(object._SCHD_)
            for(let i = 0, l = this.update_queue.length; i < l; i++)
                if(this.update_queue[i] === object){
                    this.update_queue.splice(i,1);
                    object._SCHD_ = 0;

                    if(l == 1)
                        this.SCHEDULE_PENDING = false;

                    return;
                }
    }

    /**
     * Called by the caller function every tick. Calls .update on any object queued for an update. 
     */
    update() {

        this.SCHEDULE_PENDING = false;

        const uq = this.update_queue;
        const time = perf.now() | 0;
        const diff = Math.ceil(time - this.frame_time) | 1;
        const step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

        this.frame_time = time;
        
        if (this.queue_switch == 0)
            (this.update_queue = this.update_queue_b, this.queue_switch = 1);
        else
            (this.update_queue = this.update_queue_a, this.queue_switch = 0);

        for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]) {
            let timestart = ((o._SCHD_ & 0xFFFF)) - diff;
            let timeend = ((o._SCHD_ >> 16) & 0xFFFF);

            o._SCHD_ = 0;
            
            if (timestart > 0) {
                this.queueUpdate(o, timestart, timeend);
                continue;
            }

            timestart = 0;

            if (timeend > 0) 
                this.queueUpdate(o, timestart, timeend - diff);

            /** 
                To ensure on code path doesn't block any others, 
                scheduledUpdate methods are called within a try catch block. 
                Errors by default are printed to console. 
            **/
            try {
                o.scheduledUpdate(step_ratio, diff);
            } catch (e) {
                console.error(e);
            }
        }

        uq.length = 0;
    }
}

const spark = new Spark();

/**
 * The base class which all Model classes extend.
 * @memberof module:wick~internal .model
 * @alias ModelBase
 */
class ModelBase {
    constructor(root = null, address = []) {
        _SealedProperty_(this, "_cv_", []);
        _SealedProperty_(this, "fv", null);
        _SealedProperty_(this, "par", null);
        _SealedProperty_(this, "MUTATION_ID", 0);
        _SealedProperty_(this, "address", address);
        _SealedProperty_(this, "root", root || this);
        _SealedProperty_(this, "prop_name", "");
    }


    /**
     *   Remove all references to any objects still held by this object.
     *   @protected
     *   @instance
     */
    destroy() {

        //inform observers of the models demise
        var observer = this.fv;

        while (observer) {
            let nx = observer.nx;
            observer.unsetModel();
            observer = nx;
        }

        this._cv_ = null;
    }

    setHook(prop_name, data) { return data; }

    getHook(prop_name, data) { return data; }


    /**
     * Called by a class that extends ModelBase when on of its property values changes.
     * @param      {string}  changed_value  The changed value
     * @private
     */
    scheduleUpdate(changed_value) {
        if (!this.fv)
            return;


        this._cv_.push(changed_value);

        spark.queueUpdate(this);
    }


    getChanged(prop_name) {


        for (let i = 0, l = this._cv_.length; i < l; i++)
            if (this._cv_[i] == prop_name)
                return this[prop_name];

        return null;
    }

    addListener(listener) {
        return this.addObserver(listener);
    }


    /**
     * Adds a observer to the linked list of observers on the model. argument observer MUST be an instance of View. 
     * @param {View} observer - The observer to _bind_ to the ModelBase
     * @throws {Error} throws an error if the value of `observer` is not an instance of {@link View}.
     */
    addObserver(observer) {
        if (observer.model)
            if (observer.model !== this) {
                observer.model.removeView(observer);
            } else return;

        if (this.fv) this.fv.pv = observer;
        observer.nx = this.fv;
        this.fv = observer;

        observer.pv = null;
        observer.model = this;
        observer.update(this);
    }

    /**
     * Removes observer from set of observers if the passed in observer is a member of model. 
     * @param {View} observer - The observer to unbind from ModelBase
     */
    removeView(observer) {
        

        if (observer.model == this) {
            if (observer == this.fv)
                this.fv = observer.nx;

            if (observer.nx)
                observer.nx.pv = observer.pv;
            if (observer.pv)
                observer.pv.nx = observer.nx;

            observer.nx = null;
            observer.pv = null;
        }
    }


    /**
        Should return the value of the property if it is in the model and has been updated since the last cycle. Null otherwise.
        This should be overridden by a more efficient version by inheriting objects
    */
    isUpdated(prop_name) {

        let changed_properties = this._cv_;

        for (var i = 0, l = changed_properties.length; i < l; i++)
            if (changed_properties[i] == prop_name)
                if (this[prop_name] !== undefined)
                    return this[prop_name];

        return null;
    }



    /**
     * Called by the {@link spark} when if the ModelBase is scheduled for an update
     * @param      {number}  step    The step
     */
    scheduledUpdate(step) { this.updateViews(); }



    /**
     * Calls View#update on every bound View, passing the current state of the ModelBase.
     */
    updateViews() {

        let o = {};

        for (let p = null, i = 0, l = this._cv_.length; i < l; i++)
            (p = this._cv_[i], o[p] = this[p]);

        this._cv_.length = 0;

        var observer = this.fv;

        while (observer) {

            observer.update(this, o);
            observer = observer.nx;
        }

        return;
    }



    /**
     * Updates observers with a list of models that have been removed. 
     * Primarily used in conjunction with container based observers, such as Templates.
     * @private
     */
    updateViewsRemoved(data) {

        var observer = this.fv;

        while (observer) {

            observer.removed(data);

            observer = observer.nx;
        }
    }



    /** MUTATION FUNCTIONS **************************************************************************************/



    _deferUpdateToRoot_(data, MUTATION_ID = this.MUTATION_ID) {
        
        if(!this.root)
            return this;

        return this.root._setThroughRoot_(data, this.address, 0, this.address.length, MUTATION_ID);
    }



    _setThroughRoot_(data, address, index, len, m_id) {

        if (index >= len) {

            if (m_id !== this.MUTATION_ID) {
                let clone = this.clone();
                clone.set(data, true);
                clone.MUTATION_ID = (this.par) ? this.par.MUTATION_ID : this.MUTATION_ID + 1;
                return clone;
            }

            this.set(data, true);
            return this;
        }

        let i = address[index++];

        let model_prop = this.prop_array[i];

        if (model_prop.MUTATION_ID !== this.MUTATION_ID) {

            model_prop = model_prop.clone();

            model_prop.MUTATION_ID = this.MUTATION_ID;
        }

        this.prop_array[i] = model_prop;

        return model_prop._setThroughRoot_(data, address, index, len, model_prop.MUTATION_ID);
    }

    seal() {

        let clone = this._deferUpdateToRoot_(null, this.MUTATION_ID + 1);

        return clone;
    }

    clone() {

        let clone = new this.constructor(this);

        clone.prop_name = this.prop_name;
        clone._cv_ = this._cv_;
        clone.fv = this.fv;
        clone.par = this.par;
        clone.MUTATION_ID = this.MUTATION_ID;
        clone.address = this.address;
        clone.prop_name = this.prop_name;

        clone.root = (this.root == this) ? clone : this.root;

        return clone;
    }

    /**
     * Updates observers with a list of models that have been added. 
     * Primarily used in conjunction with container based observers, such as Templates.
     * @private
     */
    updateViewsAdded(data) {

        var observer = this.fv;

        while (observer) {

            observer.added(data);

            observer = observer.nx;
        }
    }

    toJSON() { return JSON.stringify(this, null, '\t'); }


    /**
     * This will update the branch state of the data tree with a new branch if the MUTATION_ID is higher or lower than the current branch's parent level.
     * In this case, the new branch will stem from the root node, and all ancestor nodes from the originating child will be cloned.
     *
     * @param      {Object}         child_obj    The child object
     * @param      {(Object|number)}  MUTATION_ID  The mutation id
     * @return     {Object}         { description_of_the_return_value }
     */
    setMutation(child_obj, MUTATION_ID = child_obj.MUTATION_ID) {
        let clone = child_obj,
            result = this;

        if (MUTATION_ID == this.MUTATION_ID) return child_obj;

        if (this.par)
            result = this.par.setMutation(this, MUTATION_ID);

        if (MUTATION_ID > this.MUTATION_ID) {
            result = this.clone();
            result.MUTATION_ID = this.MUTATION_ID + 1;
        }

        clone = child_obj.clone();
        clone.MUTATION_ID = result.MUTATION_ID;
        result[clone.prop_name] = clone;

        return clone;
    }
}

/**
    Schema type. Handles the parsing, validation, and filtering of Model data properties. 
*/
class SchemeConstructor {

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

    filter(id, filters) {
        for (let i = 0, l = filters.length; i < l; i++)
            if (id === filters[i]) return true;
        return false;
    }

    string(value) {

        return value + "";
    }
}

class MCArray extends Array {

    constructor() {
        super();
    }

    push(...item) {
        item.forEach(item => {
            if (item instanceof Array)
                item.forEach((i) => {
                    super.push(i);
                });
            else
                super.push(item);
        });
    }

    //For compatibility
    __setFilters__() {

    }

    getChanged() {

    }

    toJSON() { return this; }

    toJson() { return JSON.stringify(this, null, '\t'); }
}

// A no op function
let EmptyFunction = () => {};
let EmptyArray = [];

class ModelContainerBase extends ModelBase {

    constructor(root = null, address = []) {

        super(root, address);

        _SealedProperty_(this, "scope", null);
        _SealedProperty_(this, "first_link", null);

        //For keeping the container from garbage collection.
        _SealedProperty_(this, "pin", EmptyFunction);

        //For Linking to original 
        _SealedProperty_(this, "next", null);
        _SealedProperty_(this, "prev", null);

        //Filters are a series of strings or number selectors used to determine if a model should be inserted into or retrieved from the container.
        _SealedProperty_(this, "_filters_", null);

        this.validator = new SchemeConstructor();

        return this;
    }

    setByIndex(index) { /* NO OP **/ }

    getByIndex(index, value) { /* NO OP **/ }

    destroy() {


        this._filters_ = null;

        if (this.scope) {
            this.scope.__unlink__(this);
        }

        super.destroy();
    }

    /**
        Get the number of Models held in this._mContainerBase

        @returns {Number}
    */
    get length() { return 0; }

    set length(e) { /* NO OP */ }

    /** 
        Returns a ModelContainerBase type to store the results of a get().
    */
    __defaultReturn__(USE_ARRAY) {
        if (USE_ARRAY) return new MCArray;

        let n = new this.constructor();

        n.key = this.key;
        n.validator = this.validator;
        n.model = this.model;

        this.__link__(n);

        return n;
    }

    /**
        Array emulating kludge

        @returns The result of calling this.insert
    */
    push(...item) {
        item.forEach(item => {
            if (this.scope) {
                if (item instanceof Array)
                    item.forEach((i) => {
                        this.insert(i, true, true);
                    });
                else
                    this.insert(item, true, true);

            } else {
                if (item instanceof Array)
                    item.forEach((i) => {
                        this.insert(i);
                    });
                else
                    this.insert(item);

            }
        });
    }

    /**
        Retrieves a list of items that match the term/terms. 

        @param {(Array|SearchTerm)} term - A single term or a set of terms to look for in the ModelContainerBase. 
        @param {Array} __return_data__ - Set to true by a scope Container if it is calling a SubContainer insert function. 

        @returns {(ModelContainerBase|Array)} Returns a Model container or an Array of Models matching the search terms. 
    */
    get(term, __return_data__) {

        let out = null;

        term = this.getHook("term", term);

        let USE_ARRAY = (__return_data__ === null) ? false : true;

        if (term) {

            if (__return_data__) {
                out = __return_data__;
            } else {

                if (!this.scope)
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

            if (!Array.isArray(term))
                terms = [term];

            //Need to convert terms into a form that will work for the identifier type
            terms = terms.map(t => this.validator.parse(t));

            this.__get__(terms, out);
        }

        return out;
    }

    set(item, from_root = false) {
        if (!from_root)
            return this._deferUpdateToRoot_(item).insert(item, true);
        else
            this.insert(item, true);
    }

    /**
        Inserts an item into the container. If the item is not a {Model}, an attempt will be made to convert the data in the Object into a Model.
        If the item is an array of objects, each object in the array will be considered separately. 

        @param {Object} item - An Object to insert into the container. On of the properties of the object MUST have the same name as the ModelContainerBase's 
        @param {Array} item - An array of Objects to insert into the container.
        @param {Boolean} __FROM_SCOPE__ - Set to true by a scope Container if it is calling a SubContainer insert function. 

        @returns {Boolean} Returns true if an insertion into the ModelContainerBase occurred, false otherwise.
    */
    insert(item, from_root = false, __FROM_SCOPE__ = false) {


        item = this.setHook("", item);

        if (!from_root)
            return this._deferUpdateToRoot_(item).insert(item, true);

        let add_list = (this.fv) ? [] : null;

        let out_data = false;

        if (!__FROM_SCOPE__ && this.scope)
            return this.scope.insert(item);


        if (item instanceof Array) {
            for (var i = 0; i < item.length; i++)
                if (this.__insertSub__(item[i], out_data, add_list))
                    out_data = true;
        } else if (item)
            out_data = this.__insertSub__(item, out_data, add_list);


        if (out_data) {
            if (this.par)
                this.par.scheduleUpdate(this.prop_name);


            if (add_list && add_list.length > 0) {
                this.updateViewsAdded(add_list);
                this.scheduleUpdate();
            }
        }

        return out_data;
    }

    /**
        A subset of the insert function. Handles the testing of presence of an identifier value, the conversion of an Object into a Model, and the calling of the implementation specific __insert__ function.
    */
    __insertSub__(item, out, add_list) {

        let model = item;

        var identifier = this._gI_(item);

        if (identifier !== undefined) {

            if (!(model instanceof ModelBase)) {
                model = new this.model(item);
                model.MUTATION_ID = this.MUTATION_ID;
            }

            identifier = this._gI_(model, this._filters_);

            if (identifier !== undefined) {
                out = this.__insert__(model, add_list, identifier);
                this.__linksInsert__(model);
            }
        }

        return out;
    }

    delete(term, from_root = false) {
        if (!from_root)
            return this._deferUpdateToRoot_(term).remove(term);
        else
            this.remove(term);
    }

    /**
        Removes an item from the container. 
    */
    remove(term, from_root = false, __FROM_SCOPE__ = false) {

        if (!from_root)
            return this._deferUpdateToRoot_(term).remove(term, true);

        //term = this.getHook("term", term);

        if (!__FROM_SCOPE__ && this.scope) {

            if (!term)
                return this.scope.remove(this._filters_);
            else
                return this.scope.remove(term);
        }

        let out_container = [];

        if (!term)
            this.__removeAll__();

        else {

            let terms = (Array.isArray(term)) ? term : [term];

            //Need to convert terms into a form that will work for the identifier type
            terms = terms.map(t => (t instanceof ModelBase) ? t : this.validator.parse(t));

            this.__remove__(terms, out_container);
        }

        if (out_container.length > 0) {
            if (this.par)
                this.par.scheduleUpdate(this.prop_name);


            if (out_container && out_container.length > 0) {
                this.updateViewsRemoved(out_container);
                this.scheduleUpdate();
            }
        }

        return out_container;
    }

    /**
        Removes a ModelContainerBase from list of linked containers. 

        @param {ModelContainerBase} container - The ModelContainerBase instance to remove from the set of linked containers. Must be a member of the linked containers. 
    */
    __unlink__(container) {

        if (container instanceof ModelContainerBase && container.scope == this) {

            if (container == this.first_link)
                this.first_link = container.next;

            if (container.next)
                container.next.prev = container.prev;

            if (container.prev)
                container.prev.next = container.next;

            container.scope = null;
        }
    }

    /**
        Adds a container to the list of tracked containers. 

        @param {ModelContainerBase} container - The ModelContainerBase instance to add the set of linked containers.
    */
    __link__(container) {
        if (container instanceof ModelContainerBase && !container.scope) {

            container.scope = this;

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
                    if (!container.scope)
                        console.warn("failed to clear the destruction of container in time!");
                };
            })(container);
        }
    }

    /**
     * Remove items from linked ModelContainers according to the terms provided.
     * @param      {Array}  terms   Array of terms.
     * @private
     */
    __linksRemove__(item) {
        let a = this.first_link;
        while (a) {
            for (let i = 0; i < item.length; i++)
                if (a._gI_(item[i], a._filters_)) {
                    a.scheduleUpdate();
                    a.__linksRemove__(item);
                    break;
                }

            a = a.next;
        }
    }

    /**
     * Add items to linked ModelContainers.
     * @param      {Model}  item   Item to add.
     * @private
     */
    __linksInsert__(item) {
        let a = this.first_link;
        while (a) {
            if (a._gI_(item, a._filters_))
                a.scheduleUpdate();
            a = a.next;
        }
    }

    /**
        Removes any items in the ModelConatiner not included in the array "items", and adds any item in `items` not already in the ModelContainerBase.
        @param {Array} items - An array of identifiable Models or objects. 
    */
    cull(items) {

        let hash_table = {};
        let existing_items = __getAll__([], true);

        let loadHash = (item) => {
            if (item instanceof Array)
                return item.forEach((e) => loadHash(e));

            let identifier = this._gI_(item);

            if (identifier !== undefined)
                hash_table[identifier] = item;

        };

        loadHash(items);

        for (let i = 0; i < existing_items.lenth; i++) {
            let e_item = existing_items[i];
            if (!existing_items[this._gI_(e_item)])
                this.__remove__(e_item);
        }

        this.insert(items);
    }

    __setFilters__(term) {

        if (!this._filters_) this._filters_ = [];

        if (Array.isArray(term))
            this._filters_ = this._filters_.concat(term.map(t => this.validator.parse(t)));
        else
            this._filters_.push(this.validator.parse(term));

    }

    /**
        Returns true if the identifier matches a predefined filter pattern, which is evaluated by this.parser. If a 
        parser was not present the ModelContainers schema, then the function will return true upon every evaluation.
    */
    __filterIdentifier__(identifier, filters) {
        if (filters.length > 0) {
            return this.validator.filter(identifier, filters);
        }
        return true;
    }

    _gIf_(item, term) {
        let t = this._gI_(item, this.filters);
    }

    /**
        Returns the Identifier property value if it exists in the item. If an array value for filters is passed, then undefined is returned if the identifier value does not pass filtering criteria.
        @param {(Object|Model)} item
        @param {Array} filters - An array of filter terms to test whether the identifier meets the criteria to be handled by the ModelContainerBase.
    */
    _gI_(item, filters = null) {

        let identifier;

        if (typeof(item) == "object" && this.key)
            identifier = item[this.key];
        else
            identifier = item;

        if (identifier && this.validator)
            identifier = this.validator.parse(identifier);

        if (filters && identifier)
            return (this.__filterIdentifier__(identifier, filters)) ? identifier : undefined;

        return identifier;
    }

    /** 
        OVERRIDE SECTION ********************************************************************
        
        All of these functions should be overridden by inheriting classes
    */

    __insert__() { return this; }

    __get__(item, __return_data__) { return __return_data__; }

    __getAll__(__return_data__) { return __return_data__; }

    __removeAll__() { return []; }

    __remove__() { return []; }

    clone() {
        let clone = super.clone();
        clone.key = this.key;
        clone.model = this.model;
        clone.validator = this.validator;
        clone.first_link = this.first_link;
        return clone;
    }

    // END OVERRIDE *************************************************************************
}

const proto = ModelContainerBase.prototype;
_SealedProperty_(proto, "model", null);
_SealedProperty_(proto, "key", "");
_SealedProperty_(proto, "validator", null);

class MultiIndexedContainer extends ModelContainerBase {

    constructor(data = [], root = null, address = []) {

        super(root, address);

        this.secondary_indexes = {};
        this.primary_index = null;
        this.primary_key = "";

        if (data[0] && data[0].key) {

            let key = data[0].key;

            if (data[0].model)
                this.model = data[0].model;

            if (Array.isArray(key))
                key.forEach((k) => (this.addKey(k)));

            data = data.slice(1);
        }

        if (Array.isArray(data) && data.length > 0)
            this.insert(data);
    }

    /**
        Returns the length of the first index in this container. 
    */
    get length() { return this.primary_index.length; }

    /**
        Insert a new ModelContainerBase into the index through the key.  
    */
    addKey(key) {
        let name = key.name;

        let container = new MultiIndexedContainer.array([{ key, model: this.model }]);

        if (this.primary_index) {
            this.secondary_indexes[name] = container;
            this.secondary_indexes[name].insert(this.primary_index.__getAll__());
        } else {
            this.primary_key = name;
            this.primary_index = container;
        }
    }

    get(item, __return_data__) {
        
        item = this.getHook("query", item);

        if (item) {
            for (let name in item) {
                if (name == this.primary_key)
                    return this.primary_index.get(item[name], __return_data__);

                else if (this.secondary_indexes[name])
                    return this.secondary_indexes[name].get(item[name], __return_data__);

            }
        } else
            return this.primary_index.get(null, __return_data__);
    }

    __insert__(model, add_list, identifier) {

        let out = false;

        model.par = this;

        if ((out = this.primary_index.insert(model))) {
            for (let name in this.secondary_indexes) {

                let index = this.secondary_indexes[name];

                index.insert(model);
            }
        }

        if (out)
            this.updateViews(this.primary_index.get());

        return out;
    }
    /**
        @private 
    */
    __remove__(term, out_container) {

        let out = false;

        if ((out = this.primary_index.__remove__(term, out_container))) {

            for (let name in this.secondary_indexes) {

                let index = this.secondary_indexes[name];

                index.__remove__(out_container);
            }
        }

        return out;
    }

    __removeAll__() {

        let out = false;

        out = this.primary_index.__removeAll__();

        for (let name in this.secondary_indexes) {

            let index = this.secondary_indexes[name];

            if (index.__removeAll__())
                out = true;
        }

        return out;
    }


    /**
        Overrides Model container default _gI_ to force item to pass.
        @private 
    */
    _gI_(item, filters = null) {
        return true;
    }

    toJSON() {
        return this.primary_index.toJSON();
    }

    clone() {
        let clone = super.clone();
        clone.secondary_indexes = this.secondary_indexes;
        clone.primary_index = this.primary_index;
        return clone;
    }
}

class NumberSchemeConstructor extends SchemeConstructor {

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

let number$1 = new NumberSchemeConstructor();

let scape_date = new Date();
scape_date.setHours(0);
scape_date.setMilliseconds(0);
scape_date.setSeconds(0);
scape_date.setTime(0);

class DateSchemeConstructor extends NumberSchemeConstructor {

    parse(value) {

        if(!value)
            return undefined;

        if(value instanceof Date)
            return value.valueOf();

        if (!isNaN(value))
            return parseInt(value);

        let date = (new Date(value)).valueOf();

        if(date) return date;

        let lex = whind$1(value);

        let year = parseInt(lex.text);

        if (year) {

            scape_date.setHours(0);
            scape_date.setMilliseconds(0);
            scape_date.setSeconds(0);
            scape_date.setTime(0);

            lex.next();
            lex.next();
            let month = parseInt(lex.text) - 1;
            lex.next();
            lex.next();
            let day = parseInt(lex.text);
            scape_date.setFullYear(year);
            scape_date.setDate(day);
            scape_date.setMonth(month);

            lex.next();

            if (lex.pos > -1) {

                let hours = parseInt(lex.text);
                lex.next();
                lex.next();
                let minutes = parseInt(lex.text);

                scape_date.setHours(hours);
                scape_date.setMinutes(minutes);
            }



            return scape_date.valueOf();
        } 
    }

    /**
     
     */
    verify(value, result) {

        value = this.parse(value);

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

let date = new DateSchemeConstructor();

class TimeSchemeConstructor extends NumberSchemeConstructor {

    parse(value) {
        if (!isNaN(value))
            return parseFloat(value);
        try {
            var hour = parseInt(value.split(":")[0]);
            var min = parseInt(value.split(":")[1].split(" ")[0]);
            if (value.split(":")[1].split(" ")[1])
                half = (value.split(":")[1].split(" ")[1].toLowerCase() == "pm");
            else
                half = 0;
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

let time = new TimeSchemeConstructor();

class StringSchemeConstructor extends SchemeConstructor {
    
    constructor() {

        super();

        this.start_value = "";
    }
    parse(value) {

        return value + "";
    }

    verify(value, result) {
        result.valid = true;

        if (value === undefined) {
            result.valid = false;
            result.reason = " value is undefined";
        } else if (!value instanceof String) {
            result.valid = false;
            result.reason = " value is not a string.";
        }
    }

    filter(identifier, filters) {

        for (let i = 0, l = filters.length; i < l; i++)
            if (identifier.match(filters[i] + ""))
                return true;

        return false;
    }
}

let string$1 = new StringSchemeConstructor();

class BoolSchemeConstructor extends SchemeConstructor {

    constructor() {

        super();

        this.start_value = false;
    }

    parse(value) {

        return (value) ? true : false;
    }

    verify(value, result) {

        result.valid = true;

        if (value === undefined) {
            result.valid = false;
            result.reason = " value is undefined";
        } else if (!value instanceof Boolean) {
            result.valid = false;
            result.reason = " value is not a Boolean.";
        }
    }

    filter(identifier, filters) {

        if (value instanceof Boolean)
            return true;

        return false;
    }
}

let bool = new BoolSchemeConstructor();

let schemes = { date, string: string$1, number: number$1, bool, time };


/**
 * Used by Models to ensure conformance to a predefined data structure. Becomes immutable once created.
 * @param {Object} data - An Object of `key`:`value` pairs used to define the Scheme. `value`s must be instances of or SchemeConstructor or classes that extend SchemeConstructor.
 * @readonly
 */
class Schema {}

class BTreeModelContainer extends ModelContainerBase {

    constructor(data = [], root = null, address = []) {

        super(root, address);

        this.validator = schemes.number;

        if (data[0] && data[0].key) {

            let key = data[0].key;

            if (typeof key == "object") {

                if (key.type)
                    this.validator = (key.type instanceof NumberSchemeConstructor) ? key.type : this.validator;

                if (key.name)
                    this.key = key.name;

                if (key.unique_key)
                    this.unique_key = key.unique_key;
            } else
                this.key = key;

            if (data[0].model)
                this.model = data[0].model;

            data = data.slice(1);
        }

        this.min = 10;
        this.max = 20;
        this.size = 0;
        this.btree = null;

        if (Array.isArray(data) && data.length > 0)
            this.insert(data);
    }

    destroy() {
        if (this.btree)
            this.btree.destroy();

        super.destroy();
    }

    get length() {
        return this.size;
    }

    __insert__(model, add_list, identifier) {

        let result = {
            added: false
        };

        if (!this.btree)
            this.btree = new BtreeNode(true);

        this.btree = this.btree.insert(identifier, model, this.unique_key, this.max, true, result).newnode;

        if (add_list) add_list.push(model);

        if (result.added) {
            this.size++;
            this.__updateLinks__();
        }

        return result.added;
    }

    __get__(terms, __return_data__) {

        if(!this.btree) return __return_data__;

        if (__return_data__ instanceof BTreeModelContainer){
            __return_data__.btree = this.btree;
            return __return_data__;
        }

        let out = [];

        for (let i = 0, l = terms.length; i < l; i++) {
            let b, a = terms[i];

            if (a instanceof ModelBase)
                continue;

            if (i < l-1 && !(terms[i + 1] instanceof ModelBase)) {
                b = terms[++i];
            } else
                b = a;

            this.btree.get(a, b, out);
        }

        if (this._filters_) {
            for (let i = 0, l = out.length; i < l; i++) {
                let model = out[i];

                if (this._gI_(model, this._filters_))
                    __return_data__.push(model);
            }
        } else
            for (let i = 0, l = out.length; i < l; i++)
                __return_data__.push(out[i]);



        return __return_data__;
    }

    __remove__(terms, out_container = []) {

        if(!this.btree) return false;

        let result = 0;

        for (let i = 0, l = terms.length; i < l; i++) {
            let b, a = terms[i];

            if ((a instanceof ModelBase)) {
                let v = this._gI_(a);
                let o = this.btree.remove(v, v, this.unique_key, this.unique_key ? a[this.unique_key] : "", true, this.min, out_container);
                result += o.out;
                this.btree = o.out_node;
                continue;
            }

            if (i < l-1 && !(terms[i + 1] instanceof ModelBase)) {
                b = terms[++i];
            } else
                b = a;

            let o = this.btree.remove(a, b, "", "", true, this.min, out_container);
            result += o.out;
            this.btree = o.out_node;
        }

        if (result > 0) {
            this.size -= result;
            this.__updateLinks__();
            this.__linksRemove__(out_container);
        }


        return result !== 0;
    }

    __updateLinks__() {
        let a = this.first_link;
        while (a) {
            a.btree = this.btree;
            a = a.next;
        }
    }

    __getAll__(__return_data__) {

        if (this._filters_) {
            this.__get__(this._filters_, __return_data__);
        } else if (this.btree)
            this.btree.get(-Infinity, Infinity, __return_data__);

        return __return_data__;
    }

    __removeAll__() {
        if (this.btree)
            this.btree.destroy();
        this.btree = null;
    }

    toJSON() {
        let out_data = [];

        if (this.btree) {

            this.btree.get(this.min, this.max, out_data);
        }

        return out_data;
    }

    clone() {
        let clone = super.clone();
        clone.btree = this.btree;
        return clone;
    }
}

class BtreeNode {
    constructor(IS_LEAF = false) {
        this.LEAF = IS_LEAF;
        this.nodes = [];
        this.keys = [];
        this.items = 0;
    }

    destroy() {

        this.nodes = null;
        this.keys = null;

        if (!this.LEAF) {
            for (let i = 0, l = this.nodes.length; i < l; i++)
                this.nodes[i].destroy();
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
            };
        }

        return {
            newnode: this,
            key: 0
        };
    }

    /**
        Inserts model into the tree, sorted by identifier. 
    */
    insert(identifier, model, unique_key, max_size, IS_ROOT = false, result) {

        let l = this.keys.length;

        if (!this.LEAF) {

            for (var i = 0; i < l; i++) {

                let key = this.keys[i];

                if (identifier < key) {
                    let node = this.nodes[i];

                    let o = node.insert(identifier, model, unique_key, max_size, false, result);
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
            } = node.insert(identifier, model, unique_key, max_size, false, result);

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

                    if (unique_key) {
                        if (this.nodes[i][unique_key] !== model[unique_key]) { continue; }
                    } else
                        this.nodes[i].set(model);
                    

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
                            {/*debugger*/};

                return true;
            }

    }

    remove(start, end, unique_key, unique_id, IS_ROOT = false, min_size, out_container) {
        let l = this.keys.length,
            out = 0,
            out_node = this;

        if (!this.LEAF) {

            for (var i = 0; i < l; i++) {

                let key = this.keys[i];

                if (start <= key)
                    out += this.nodes[i].remove(start, end, unique_key, unique_id, false, min_size, out_container).out;
            }

            out += this.nodes[i].remove(start, end, unique_key, unique_id, false, min_size, out_container).out;

            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].keys.length < min_size) {
                    if (this.balanceRemove(i, min_size)) {
                        l--;
                        i--;
                    }
                }
            }

            if (this.nodes.length == 1)
                out_node = this.nodes[0];

        } else {

            for (let i = 0, l = this.keys.length; i < l; i++) {
                let key = this.keys[i];

                if (key <= end && key >= start) {
                    if (unique_key, unique_id && this.nodes[i][unique_key] !== unique_id) continue;
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

            this.nodes[i].get(start, end, out_container);

        } else {

            let out = false;

            for (let i = 0, l = this.keys.length; i < l; i++) {
                let key = this.keys[i];

                if (key <= end && key >= start)
                    out_container.push(this.nodes[i]);
            }
        }
    }
}

MultiIndexedContainer.btree = BTreeModelContainer;

const ArrayContainerProxySettings = {

    set: function(obj, prop, val) {

        if (prop in obj && obj[prop] == val)
            return true;

        let property = obj[prop];

        if (property && typeof(property) == "object")
            property.set(val);
        else
            obj[prop] = val;

        obj.scheduleUpdate(prop);

        return true;
    },

    get: function(obj, prop, val) {

        if (prop in obj)
            return obj[prop];

        if (!isNaN(prop))
            return obj.data[prop];

        let term = {};

        term[obj.key] = prop;

        return obj.get(prop, [])[0];
    }
};

/**
    Stores models in random order inside an internal array object. 
 */

class ArrayModelContainer extends ModelContainerBase {

    constructor(data = [], root = null, address = []) {

        super(root, address);

        if (data[0] && data[0].key) {

            let key = data[0].key;

            /* Custom selection of container types happens here. 
             * If there are multiple keys present, then a MultiIndexedContainer is used.
             * If the value of the key is a Numerical type, then a BtreeModelContainer is used.
             **/
            if (typeof(key) == "object") {

                if (Array.isArray(key))
                    return new MultiIndexedContainer(data, root, address);

                if (key.type) {
                    if (key.type instanceof NumberSchemeConstructor)
                        return new BTreeModelContainer(data, root, address);
                    this.validator = (key.type instanceof SchemeConstructor) ? key.type : this.validator;
                }

                if (key.name)
                    this.key = key.name;
            } else
                this.key = key;

            if (data[0].model)
                this.model = data[0].model;

            data = data.slice(1);
        }

        this.data = [];

        if (Array.isArray(data) && data.length > 0)
            this.insert(data, true);
    }

    destroy() {

        this.data = null;

        super.destroy();
    }

    get proxy() { return new Proxy(this, ArrayContainerProxySettings); }

    set proxy(v) {}

    get length() { return this.data.length; }

    __defaultReturn__(USE_ARRAY) {

        if (USE_ARRAY) return new MCArray();

        let n = this.clone();

        this.__link__(n);

        return n;
    }

    __insert__(model, add_list, identifier) {

        for (var i = 0, l = this.data.length; i < l; i++) {

            var obj = this.data[i];

            if (this._gI_(obj) == identifier) {

                if (obj.MUTATION_ID !== this.MUTATION_ID) {
                    obj = obj.clone();
                    obj.MUTATION_ID = this.MUTATION_ID;
                }

                obj.set(model, true);

                this.data[i] = obj;

                return false; //Model not added to Container. Model just updated.
            }
        }

        this.data.push(model);

        model.address = this.address.slice();
        model.address.push(this.data.length - 1);

        model.root = this.root;

        if (add_list) add_list.push(model);

        return true; // Model added to Container.
    }

    getByIndex(i) {
        return this.data[i];
    }

    setByIndex(i, m) {
        this.data[i] = m;
    }

    __get__(term, return_data) {

        let terms = null;

        if (term)
            if (term instanceof Array)
                terms = term;
            else
                terms = [term];

        for (let i = 0, l = this.data.length; i < l; i++) {
            let obj = this.data[i];
            if (this._gI_(obj, terms)) {
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

    _setThroughRoot_(data, address, index, len, m_id) {

        if (index >= len)
            return this;

        let i = address[index++];

        let model_prop = this.data[i];

        if (model_prop.MUTATION_ID !== this.MUTATION_ID) {
            model_prop = model_prop.clone();
            model_prop.MUTATION_ID = this.MUTATION_ID;
        }

        this.data[i] = model_prop;

        return model_prop._setThroughRoot_(data, address, index, len, model_prop.MUTATION_ID);
    }

    __remove__(term, out_container) {

        let result = false;

        term = term.map(t => (t instanceof ModelBase) ? this._gI_(t) : t);
        
        for (var i = 0, l = this.data.length; i < l; i++) {
            var obj = this.data[i];

            if (this._gI_(obj, term)) {

                result = true;

                this.data.splice(i, 1);

                l--;
                i--;

                out_container.push(obj);

                break;
            }
        }

        return result;
    }

    toJSON() { return this.data; }

    clone() {
        let clone = super.clone();
        clone.data = this.data.slice();
        return clone;
    }
}

MultiIndexedContainer.array = ArrayModelContainer;

Object.freeze(ArrayModelContainer);

class Model extends ModelBase {

    constructor(data, root = null, address = []) {

        super(root, address);

        _SealedProperty_(this, "prop_array", []);
        _SealedProperty_(this, "prop_offset", 0);
        _SealedProperty_(this, "look_up", {});

        if (data)
            for (let name in data)
                this.createProp(name, data[name]);

    }

    get proxy() { return this;}

    set(data, FROM_ROOT = false) {

        if (!FROM_ROOT)
            return this._deferUpdateToRoot_(data).set(data, true);

        if (!data)
            return false;

        let out = false;

        for (let prop_name in data) {

            let index = this.look_up[prop_name];

            if (index !== undefined) {

                let prop = this.prop_array[index];

                if (typeof(prop) == "object") {

                    if (prop.MUTATION_ID !== this.MUTATION_ID) {
                        prop = prop.clone();
                        prop.MUTATION_ID = this.MUTATION_ID;
                        this.prop_array[index] = prop;
                    }

                    if (prop.set(data[prop_name], true)){
                        this.scheduleUpdate(prop_name);
                        out = true;
                    }

                } else if (prop !== data[prop_name]) {
                    this.prop_array[index] = data[prop_name];
                     this.scheduleUpdate(prop_name);
                     out = true;
                }
            } else{
                this.createProp(prop_name, data[prop_name]);
                out = true;
            }
        }

        return out;
    }
    createProp(name, value) {

        let index = this.prop_offset++;

        this.look_up[name] = index;
        var address = this.address.slice();
        address.push(index);

        switch (typeof(value)) {

            case "object":
                if (Array.isArray(value))
                    this.prop_array.push(new ArrayModelContainer(value, this.root, address));
                else {
                    if (value instanceof ModelBase) {
                        value.address = address;
                        this.prop_array.push(value);
                    } else
                        this.prop_array.push(new Model(value, this.root, address));
                }

                this.prop_array[index].prop_name = name;
                this.prop_array[index].par = this;

                Object.defineProperty(this, name, {

                    configurable: false,

                    enumerable: true,

                    get: function() { return this.getHook(name, this.prop_array[index]); },

                    set: (v) => {}
                });

                break;

            case "function":

                let object = new value(null, this.root, address);

                object.par = this;
                object.prop_name = name;

                this.prop_array.push(object);

                Object.defineProperty(this, name, {

                    configurable: false,

                    enumerable: true,

                    get: function() { return this.getHook(name, this.prop_array[index]); },

                    set: (v) => {}
                });

                break;

            default:
                this.prop_array.push(value);

                Object.defineProperty(this, name, {

                    configurable: false,

                    enumerable: true,

                    get: function() { return this.getHook(name, this.prop_array[index]); },

                    set: function(value) {

                        let val = this.prop_array[index];

                        if (val !== value) {
                            this.prop_array[index] = this.setHook(name, value);
                            this.scheduleUpdate(name);
                        }
                    }
                });
        }

        this.scheduleUpdate(name);
    }

    toJSON(HOST = true){
        let data = {};

        for(let name in this.look_up){
            let index = this.look_up[name];
            let prop = this.prop_array[index];

            if(prop){
                if(prop instanceof ModelBase)
                    data[name] = prop.toJSON(false);
                else
                    data[name] = prop;
            }
        }

        return HOST ? JSON.stringify(data) : data;    
    }
}

ModelContainerBase.prototype.model = Model;

class Store {
    constructor(data) {

        this.history = [{ model: new Model(data, this), actions: [{ d: data, a: null }] }];
        this.MUTATION_ID = 0;
    }

    seal() { this.MUTATION_ID++; }

    getHistory(index) { return (this.history[index]) ? this.history[index].model : null; }

    get current() { return this.history[this.history.length - 1].model; }

    set current(v) {}

    get(data){
        return this.current.get(data);
    }

    set(data){
        return this.current.set(data);
    }

    _getParentMutationID_() { return this.MUTATION_ID; }

    _setThroughRoot_(data, address, index, len_minus_1, m_id) {

        let model_prop = this.current;

        if (m_id !== this.MUTATION_ID) {

            if (m_id > this.MUTATION_ID)
                this.MUTATION_ID = this.MUTATION_ID + 1;
            else
                this.MUTATION_ID = this.MUTATION_ID;

            model_prop = model_prop.clone();

            model_prop.MUTATION_ID = this.MUTATION_ID;

            this.history.push({ model: model_prop, actions: [] });
        }

        if (data)
            this.history[this.history.length - 1].actions.push({ d: data, a: address });

        return model_prop._setThroughRoot_(data, address, index, len_minus_1, this.MUTATION_ID);
    }
}

//import { CustomComponent } from "../page/component"

let CachedPresets = null;
/**
 // There are a number of configurable options and global objects that can be passed to wick to be used throughout the PWA. The instances of the Presets class are objects that hosts all these global properties. 
 * 
 // Presets are designed to be created once, upfront, and not changed once defined. This reinforces a holistic design for a PWA should have in terms of the types of Schemas, global Models, and overall form the PWA takes, e.g whether to use the ShadowDOM or not.
 * 
 // Note: *This object is made immutable once created. There may only be one instance of Presets*
 * 
 */
class Presets {
    constructor(preset_options = {}) {

        //if(Presets.global.v)
        //    return Presets.global.v;

        this.store = (preset_options.store instanceof Store) ? preset_options.store : null;

        /**
         * {Object} Store for optional parameters used in the app
         */
        this.options = {
            USE_SECURE: true,
            USE_SHADOW: false,
        };

        //Declaring the properties upfront to give the VM a chance to build an appropriate virtual class.
        this.components = {};

        this.custom_components = {};

        /** 
         * Store of user defined CustomScopePackage factories that can be used in place of the components built by the Wick templating system. Accepts any class extending the CustomComponent class. Adds these classes from preset_options.custom_scopes or preset_options.components. 
         * 
         * In routing mode, a HTML `<component>` tag whose first classname matches a property name of a member of presets.custom_scopes will be assigned to an instance of that member.
         * 
         * ### Example
         * In HTML:
         * ```html
         * <component class="my_scope class_style">
         * 
         * ```
         * In JavaScript:
         * ```javascript
         * let MyScope = CustomScopePackage( ele =>{
         *      ele.append
         * }, {});
         * 
         * preset_options.custom_componets = {
         *      my_scope : MyScope
         * }
         * ```
         * @instance
         * @readonly
         */
        this.custom_scopes = {};

        /**
         * { Object } Store of user defined classes that extend the Model or Model classes. `<w-scope>` tags in templates that have a value set for the  `schema` attribute, e.g. `<w-s schema="my_favorite_model_type">...</w-s>`, will be bound to a new instance of the class in presets.schema whose property name matches the "schema" attribute.
         * 
         * Assign classes that extend Model or SchemedModel to preset_options.schemas to have them available to Wick.
         * 
         * In JavaScript:
         * ```javascript
         * class MyFavoriteModelType extends Model {};
         * preset_options.custom_componets = {
         *      my_favorite_model_type : MyFavoriteModelType
         * }
         * ```
         * note: presets.schema.any is always assigned to the Model class.
         * @instance
         * @readonly
         */
        this.schemas = { any: Model };

        /**
         * { Object } Store of user defined Model instances that serve as global models, which are available to the whole application. Multiple Scopes will be able to _bind_ to the Models. `<w-scope>` tags in templates that have a value set for the  `model` attribute, e.g. `<w-s model="my_global_model">...</w-s>`, will be bound to the model in presets .model whose property name matches the "model" attribute.
         * 
         * Assign instances of Model or Model or any class that extends these to preset_options.models to have them used by Wick.
         * 
         * In JavaScript:
         * ```javascript
         * const MyGlobalModel = new Model({global_data: "This is global!"});
         * preset_options.custom_componets = {
         *      my_global_model : MyGlobalModel
         * }
         * ```
         * @instance
         * @readonly
         */
        this.models = {};

        /**
         * Configured by `preset_options.USE_SHADOW`. If set to true, and if the browser supports it, compiled and rendered template elements will be bound to a `<component>` shadow DOM, instead being appended as a child node.
         * @instance
         * @readonly
         */
        this.USE_SHADOW = false;

        /**
         * { Object } Contains all user defined HTMLElement templates 
         */
        this.templates = {};

        /**
         * Custom objects that can be used throughout component scripts. User defined. 
         */
        this.custom = preset_options.custom || {};

        let c = preset_options.options;
        if (c)
            for (let cn in c)
                this.options[cn] = c[cn];


        c = preset_options.components;
        if (c)
            for (let cn in c)
                this.components[cn] = c[cn];

        c = preset_options.custom_scopes;
        if (c)
            for (let cn in c)
                if (cn instanceof CustomComponent)
                    this.custom_scopes[cn] = c[cn];

        c = preset_options.custom_components;
        if (c)
            for (let cn in c)
                this.custom_components[cn] = c[cn];

        c = preset_options.models;

        if (c)
            for (let cn in c)
                if (c[cn] instanceof ModelBase)
                    this.models[cn] = c[cn];

        c = preset_options.schemas;
        if (c)
            for (let cn in c)
                if (ModelBase.isPrototypeOf(c[cn]))
                    this.schemas[cn] = c[cn];

        this.options.USE_SHADOW = (this.options.USE_SHADOW) ? (DOC.head.createShadowRoot || DOC.head.attachShadow) : false;

        this.url = URL;

        Object.freeze(this.options);
        Object.freeze(this.custom_scopes);
        Object.freeze(this.schemas);
        Object.freeze(this.models);

        CachedPresets = this;
    }

    processLink(link) {}

    /**
        Copies values of the Presets object into a generic object. The new object is not frozen.
    */
    copy() {
        let obj = {};

        for (let a in this) {
            if (a == "components")
                obj.components = this.components;
            else if (typeof(this[a]) == "object")
                obj[a] = Object.assign({}, this[a]);
            else if (typeof(this[a]) == "array")
                obj[a] = this[a].slice();
            else
                obj[a] = this[a];
        }

        obj.processLink = this.processLink.bind(this);

        return obj;
    }
}

Presets.global = {get v(){return CachedPresets}, set v(e){}};

let fn = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols = ["((","))",")(","</","```","``","||","^=","$=","*=","<=","...","<",">",">=","==","!=","===","!==","**","++","--","<<",">>",">>>","&&","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>"],

    /* Goto lookup maps */
    gt0 = [0,-1,1,-1,4,-1,6,-322,2,3,-1,5,-1,9,8],
gt1 = [0,-5,12,-325,11,-1,9,8],
gt2 = [0,-335,17,-7,16],
gt3 = [0,-334,38],
gt4 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,40,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt5 = [0,-339,114,115,116],
gt6 = [0,-339,120,115,116],
gt7 = [0,-339,122,115,116],
gt8 = [0,-339,124,115,116],
gt9 = [0,-339,127,115,116],
gt10 = [0,-344,130,-1,131],
gt11 = [0,-285,142],
gt12 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,182,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt13 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,187,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt14 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,188,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt15 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,189,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt16 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,190,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt17 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,191,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt18 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,192,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt19 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,193,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt20 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,194,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt21 = [0,-267,196],
gt22 = [0,-267,201],
gt23 = [0,-231,82,102,-14,83,104,-11,202,203,75,76,108,-6,74,-1,81,-6,80,-20,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt24 = [0,-326,87,206],
gt25 = [0,-314,209,207],
gt26 = [0,-316,219,217],
gt27 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,227,228,231,230,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt28 = [0,-254,240,-17,234,-1,237,242,246,247,238,-39,248,249,-3,239,-1,186,87,243],
gt29 = [0,-324,251,253,87,86],
gt30 = [0,-249,255,256,-73,254,253,87,86],
gt31 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,260,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt32 = [0,-267,264],
gt33 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-17,265,183,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt34 = [0,-340,269,116],
gt35 = [0,-52,274,278,276,281,277,275,284,282,-2,283,-5,279,-1,309,-4,310,-10,308,-45,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt36 = [0,-185,312,314,317,316,315,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt37 = [0,-10,377,380,379,-1,371,-2,375,-315,374,373,-1,369,367,370,-5,378,372,131],
gt38 = [0,-346,388],
gt39 = [0,-185,389,314,317,316,315,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt40 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,391,-2,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt41 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,392,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt42 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,393,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt43 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,394,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt44 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-7,395,49,50,51,52,53,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt45 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-8,396,50,51,52,53,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt46 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-9,397,51,52,53,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt47 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-10,398,52,53,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt48 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-11,399,53,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt49 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-12,400,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt50 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-12,401,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt51 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-12,402,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt52 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-12,403,54,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt53 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,404,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt54 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,405,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt55 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,406,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt56 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,407,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt57 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,408,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt58 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-13,409,55,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt59 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-14,410,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt60 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-14,411,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt61 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-14,412,56,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt62 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-15,413,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt63 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-15,414,57,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt64 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-16,415,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt65 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-16,416,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt66 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-16,417,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt67 = [0,-231,82,102,-13,110,83,104,-10,184,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-16,418,58,59,67,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt68 = [0,-326,87,419],
gt69 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,420,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt70 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-1,425,424,421,74,-1,81,-6,80,-3,426,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt71 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,428,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt72 = [0,-326,87,429],
gt73 = [0,-267,430],
gt74 = [0,-314,433],
gt75 = [0,-316,435],
gt76 = [0,-282,436],
gt77 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-2,441,440,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt78 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,443,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt79 = [0,-279,447],
gt80 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,449,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt81 = [0,-275,452,246,247,-40,248,249,-6,87,453],
gt82 = [0,-275,454,246,247,-40,248,249,-6,87,453],
gt83 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,455,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt84 = [0,-234,457,460,459,463,-64,466,468,469,-5,464,465,461,-11,467,253,87,86],
gt85 = [0,-249,472,256],
gt86 = [0,-251,474,476,477,478,-20,481,246,247,-40,248,249,-6,87,453],
gt87 = [0,-231,82,102,-13,110,83,104,-10,482,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-20,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt88 = [0,-302,486,468,469,-19,485,253,87,86],
gt89 = [0,-326,87,487],
gt90 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,488,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt91 = [0,-231,82,102,-7,45,112,489,-3,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-8,80,-3,490,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt92 = [0,-10,494,380,379,-329,493,-4,496],
gt93 = [0,-52,501,278,276,281,277,275,284,282,-2,283,-5,279,-1,309,-4,310,-10,308,-45,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt94 = [0,-53,504,-1,281,503,-1,284,282,-2,283,-5,279,-1,309,-4,310,-10,308,-45,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt95 = [0,-55,505,-2,284,282,-2,283,-5,506,-1,309,-4,310,-10,308,-45,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt96 = [0,-62,516,-5,506,-1,309,-4,310,-10,308,-66,517,515,-2,514,-1,518],
gt97 = [0,-130,521,520,-1,289,-1,306,290,523,522,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt98 = [0,-133,528,-1,306,529,-6,297,298,299,-1,300,-3,301,307],
gt99 = [0,-135,306,530,-6,531,298,299,-1,300,-3,301,307],
gt100 = [0,-135,532,-16,307],
gt101 = [0,-140,295,540,539],
gt102 = [0,-151,543],
gt103 = [0,-134,545,-16,546],
gt104 = [0,-185,550,314,317,316,315,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt105 = [0,-187,554,-2,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt106 = [0,-187,317,316,557,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,559,-7,45,112,-4,110,83,560,-7,42,41,556,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt107 = [0,-217,562],
gt108 = [0,-225,564,565,-75,567,468,469,-19,566,253,87,86],
gt109 = [0,-191,569,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt110 = [0,-322,575,-2,576,87,86],
gt111 = [0,-322,578,-2,576,87,86],
gt112 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,580,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt113 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,582,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt114 = [0,-196,583],
gt115 = [0,-229,586,587,-71,589,468,469,-19,588,253,87,86],
gt116 = [0,-10,377,380,379,-1,371,-2,375,-315,374,373,-1,369,590,370,-5,378,372,131],
gt117 = [0,-343,594],
gt118 = [0,-10,377,380,379,-1,371,-2,375,-315,374,373,-3,595,-5,378,372,131],
gt119 = [0,-10,377,380,379,-5,601,600,-3,596,604,603,-3,599,-304,598,-9,378,597,131],
gt120 = [0,-16,606],
gt121 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,608,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt122 = [0,-335,611],
gt123 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,620,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt124 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-1,625,624,623,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt125 = [0,-254,240,-19,627,242,246,247,238,-39,248,249,-3,239,-1,186,87,243],
gt126 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,628,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt127 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,629,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt128 = [0,-233,630,631,460,459,463,-64,466,468,469,-5,464,465,461,-11,467,253,87,86],
gt129 = [0,-234,635,460,459,463,-64,466,468,469,-5,464,465,461,-11,467,253,87,86],
gt130 = [0,-302,641,468,469,-19,640,253,87,86],
gt131 = [0,-279,642],
gt132 = [0,-279,643],
gt133 = [0,-275,650,246,247,-27,645,646,-2,648,-1,649,-6,248,249,-4,467,253,87,243],
gt134 = [0,-282,652,-19,466,468,469,-2,654,655,-1,656,465,653,-11,467,253,87,86],
gt135 = [0,-251,657,476,477,478,-20,481,246,247,-40,248,249,-6,87,453],
gt136 = [0,-253,660,478,-20,481,246,247,-40,248,249,-6,87,453],
gt137 = [0,-254,661,-20,481,246,247,-40,248,249,-6,87,453],
gt138 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-6,667,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt139 = [0,-10,669,380,379,-335,672,671,670,673],
gt140 = [0,-348,672,671,681,673],
gt141 = [0,-63,684,685,-59,688,-4,687],
gt142 = [0,-85,692,-1,695,-1,693,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt143 = [0,-71,708,-57,710],
gt144 = [0,-80,711,713,715,718,717,-21,716],
gt145 = [0,-62,516,-5,506,-1,309,-4,310,-10,308,-66,517,515,-2,721,-1,518],
gt146 = [0,-132,722,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt147 = [0,-62,725,-5,506,-1,309,-4,310,-10,308,-68,727,726,-2,728],
gt148 = [0,-130,731,-2,289,-1,306,290,523,522,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt149 = [0,-133,289,-1,306,290,732,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt150 = [0,-135,306,733,-6,531,298,299,-1,300,-3,301,307],
gt151 = [0,-148,735],
gt152 = [0,-150,741],
gt153 = [0,-151,743],
gt154 = [0,-187,317,316,557,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,559,-7,45,112,-4,110,83,560,-5,240,-1,42,41,556,46,70,72,75,76,108,71,109,-4,74,234,81,237,242,246,247,238,-1,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,750,751,91,90,341,749,113,340,87,243,-3,321,-1,9,8],
gt155 = [0,-191,754,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-1,753,334,-3,335,325,-6,82,755,-7,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt156 = [0,-279,758],
gt157 = [0,-279,759],
gt158 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,760,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt159 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,762,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt160 = [0,-200,763,765,767,-1,772,-22,764,771,-2,82,102,-7,45,112,-4,110,83,104,-7,42,41,768,770,70,72,75,76,108,71,109,-4,74,-1,81,-10,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt161 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,774,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt162 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,778,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt163 = [0,-220,780,781],
gt164 = [0,-187,317,316,557,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt165 = [0,-279,786],
gt166 = [0,-279,787],
gt167 = [0,-343,789],
gt168 = [0,-343,790],
gt169 = [0,-10,377,380,379,-5,794,-1,792,796,793,-311,798,-9,378,797,131],
gt170 = [0,-10,377,380,379,-11,802,-1,800,804,801,-305,806,-9,378,805,131],
gt171 = [0,-335,811],
gt172 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,814,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt173 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-1,816,-2,74,-1,81,-6,80,-3,426,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt174 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,817,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt175 = [0,-237,821,-17,820,-46,466,468,469,-5,464,465,-12,467,253,87,86],
gt176 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,825,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt177 = [0,-236,828,829,-64,466,468,469,-5,464,465,461,-11,467,253,87,86],
gt178 = [0,-324,833,253,87,86],
gt179 = [0,-302,466,468,469,-5,837,465,835,-11,467,253,87,86],
gt180 = [0,-302,843,468,469,-19,842,253,87,86],
gt181 = [0,-348,847,-2,673],
gt182 = [0,-64,851,-59,688,-4,687],
gt183 = [0,-66,853,-18,854,-1,695,-1,693,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt184 = [0,-125,857,856],
gt185 = [0,-127,860,859],
gt186 = [0,-123,862,-5,863],
gt187 = [0,-118,866],
gt188 = [0,-88,868],
gt189 = [0,-93,872,870,-1,874,871],
gt190 = [0,-99,876,-1,704,-4,705],
gt191 = [0,-90,697,877,699,-2,700,-2,698,701,878,704,-4,705,881,-6,883,885,882,884,-1,888,-2,887],
gt192 = [0,-81,892,715,718,717,-21,716],
gt193 = [0,-76,895,893,897,894],
gt194 = [0,-80,899,713,715,718,717,-21,716,-52,900],
gt195 = [0,-153,907,-5,518],
gt196 = [0,-160,911,909,908],
gt197 = [0,-146,914],
gt198 = [0,-132,918,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt199 = [0,-231,82,102,-7,45,112,-4,110,83,104,-10,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,227,228,231,922,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt200 = [0,-226,923,-75,567,468,469,-19,566,253,87,86],
gt201 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,928,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt202 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,931,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt203 = [0,-205,935,-19,934,565,-75,937,468,469,-19,936,253,87,86],
gt204 = [0,-205,938,-23,586,587,-71,940,468,469,-19,939,253,87,86],
gt205 = [0,-202,941,-1,944,-23,945,-2,82,102,-13,110,83,104,-10,942,70,72,75,76,108,71,109,-4,74,-1,81,-27,185,-11,79,-4,92,93,91,90,-1,78,-1,186,87,86],
gt206 = [0,-221,948],
gt207 = [0,-196,950],
gt208 = [0,-230,951,-71,589,468,469,-19,588,253,87,86],
gt209 = [0,-343,952],
gt210 = [0,-10,377,380,379,-8,796,955,-311,798,-9,378,797,131],
gt211 = [0,-10,377,380,379,-8,957,-312,798,-9,378,797,131],
gt212 = [0,-10,377,380,379,-14,804,958,-305,806,-9,378,805,131],
gt213 = [0,-10,377,380,379,-14,960,-306,806,-9,378,805,131],
gt214 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,961,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt215 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,967,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt216 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,969,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt217 = [0,-275,650,246,247,-27,972,-3,974,-1,649,-6,248,249,-4,467,253,87,243],
gt218 = [0,-302,466,468,469,-5,975,465,-12,467,253,87,86],
gt219 = [0,-282,978,-19,466,468,469,-3,980,-1,656,465,979,-11,467,253,87,86],
gt220 = [0,-66,984,-18,985,-1,695,-1,693,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt221 = [0,-85,986,-1,695,-1,693,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt222 = [0,-125,989],
gt223 = [0,-127,991],
gt224 = [0,-58,284,994,993,992,-70,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt225 = [0,-87,695,-1,995,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt226 = [0,-88,996],
gt227 = [0,-90,997,-1,699,-2,700,-3,998,-1,704,-4,705],
gt228 = [0,-93,999],
gt229 = [0,-96,1000],
gt230 = [0,-99,1001,-1,704,-4,705],
gt231 = [0,-99,1002,-1,704,-4,705],
gt232 = [0,-104,1007,1005],
gt233 = [0,-108,1011],
gt234 = [0,-109,1016,1017,-1,1018],
gt235 = [0,-121,1023],
gt236 = [0,-102,1030,1028],
gt237 = [0,-69,1033,-2,1035,1034,1036,-45,1039],
gt238 = [0,-58,284,994,993,1041,-70,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt239 = [0,-76,1042],
gt240 = [0,-78,1043],
gt241 = [0,-81,1044,715,718,717,-21,716],
gt242 = [0,-81,1045,715,718,717,-21,716],
gt243 = [0,-132,1048,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt244 = [0,-155,1050,-3,728],
gt245 = [0,-158,1051,-1,911,909,1052],
gt246 = [0,-160,1054],
gt247 = [0,-160,911,909,1055],
gt248 = [0,-149,1056],
gt249 = [0,-191,1062,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt250 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1063,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt251 = [0,-191,1064,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt252 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1065,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt253 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1068,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt254 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1070,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt255 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1072,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt256 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1074,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt257 = [0,-205,1076,-96,1078,468,469,-19,1077,253,87,86],
gt258 = [0,-205,938,-96,1078,468,469,-19,1077,253,87,86],
gt259 = [0,-212,1079],
gt260 = [0,-191,1081,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt261 = [0,-222,1082,-79,1084,468,469,-19,1083,253,87,86],
gt262 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,1087,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt263 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,1088,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt264 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,1090,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt265 = [0,-302,466,468,469,-5,837,465,1096,-11,467,253,87,86],
gt266 = [0,-85,1098,-1,695,-1,693,697,694,699,-2,700,-2,698,701,-1,704,-4,705,-11,696],
gt267 = [0,-65,1099,-14,1100,713,715,718,717,-21,716,-52,1101],
gt268 = [0,-58,284,1104,-72,286,289,-1,306,290,287,-1,288,295,292,291,297,298,299,-1,300,-3,301,307],
gt269 = [0,-93,872,870],
gt270 = [0,-104,1106],
gt271 = [0,-115,1107,-1,1108,-1,888,-2,887],
gt272 = [0,-115,1110,-1,1108,-1,888,-2,887],
gt273 = [0,-117,1112],
gt274 = [0,-102,1118],
gt275 = [0,-72,1035,1120,1036,-45,1039],
gt276 = [0,-160,911,909,1052],
gt277 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1132,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt278 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1134,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt279 = [0,-191,1137,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt280 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1139,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt281 = [0,-191,1142,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt282 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1144,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt283 = [0,-213,1146,1148,1147],
gt284 = [0,-187,317,316,668,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-5,1154,827,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt285 = [0,-111,1158],
gt286 = [0,-113,1160],
gt287 = [0,-62,516,-5,506,-1,309,-4,310,-10,308,-66,517,515,-2,1163,-1,518],
gt288 = [0,-74,1164,-45,1039],
gt289 = [0,-191,1165,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt290 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1167,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt291 = [0,-191,1170,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt292 = [0,-191,1172,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt293 = [0,-191,1173,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt294 = [0,-191,1174,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt295 = [0,-191,1176,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt296 = [0,-191,1177,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt297 = [0,-191,1178,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt298 = [0,-214,1182,1180],
gt299 = [0,-213,1183,1148],
gt300 = [0,-231,82,102,-7,45,112,-4,110,83,104,-7,42,41,1185,46,70,72,75,76,108,71,109,-4,74,-1,81,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,-1,78,113,85,87,86],
gt301 = [0,-196,1187],
gt302 = [0,-115,1189,-1,1108,-1,888,-2,887],
gt303 = [0,-115,1191,-1,1108,-1,888,-2,887],
gt304 = [0,-191,1195,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt305 = [0,-191,1196,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt306 = [0,-191,1197,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt307 = [0,-191,1198,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt308 = [0,-191,1199,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt309 = [0,-214,1200],
gt310 = [0,-214,1182],
gt311 = [0,-187,317,316,1204,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt312 = [0,-191,1206,-2,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-6,82,-8,45,112,-4,110,83,-8,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],
gt313 = [0,-187,317,316,1208,318,319,320,359,328,322,338,326,323,327,-3,345,-2,329,330,331,333,332,346,-4,324,-2,334,-3,335,325,-2,360,362,-2,82,361,-7,45,112,-4,110,83,358,-7,42,41,339,46,70,72,75,76,108,71,109,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,84,-11,79,-4,92,93,91,90,341,78,113,340,87,86,-3,321,-1,9,8],

    // State action lookup maps
    sm0=[0,-4,0,-4,0,-5,1,-29,2],
sm1=[0,3,-3,0,-4,0],
sm2=[0,4,-3,0,-4,0],
sm3=[0,5,-3,0,-4,0],
sm4=[0,6,-3,0,-4,0],
sm5=[0,-4,0,-4,0,-5,7,-29,7],
sm6=[0,-2,8,-1,0,-4,0,-6,9,-3,10,11,12,-1,13,-124,14,-11,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
sm7=[0,31,-3,0,-4,0,-4,31],
sm8=[0,-4,0,-4,0,-5,32,-29,2],
sm9=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm10=[0,59,-3,0,-4,0],
sm11=[0,-4,0,-4,0,-5,60,-29,60],
sm12=[0,-2,61,-1,0,-4,0,-7,62,-15,62,-121,63,64],
sm13=[0,-2,61,-1,0,-4,0,-23,65,-121,63,64],
sm14=[0,-2,61,-1,0,-4,0,-23,66,-121,63,64],
sm15=[0,-2,61,-1,0,-4,0,-7,67,-15,68,-121,63,64],
sm16=[0,-2,61,-1,0,-4,0,-7,69,-15,70,-121,63,64],
sm17=[0,-2,71,-1,72,73,74,75,76,0],
sm18=[0,-2,77,-1,0,-4,0,-7,77,-15,77,-121,77,77],
sm19=[0,-2,62,-1,0,-4,0,-7,62,-15,62,-121,62,62],
sm20=[0,78,-3,0,-4,0,-4,78],
sm21=[0,-2,8,-1,0,-4,0,-6,79,-3,10,11,12,-1,13,-136,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
sm22=[0,-4,0,-4,0,-35,80],
sm23=[0,-4,0,-4,0,-4,81,-13,81,81,-8,81,-1,81,-3,82,81,-37,81],
sm24=[0,-4,0,-4,0,-4,83,-13,83,83,-8,83,-1,83,-3,83,83,-37,83],
sm25=[0,-4,0,-4,0,-4,84,-13,84,84,-8,84,-1,84,-3,84,84,-37,84],
sm26=[0,-4,0,-4,0,-4,85,-13,85,85,-8,85,-1,85,-3,85,85,85,-36,85],
sm27=[0,-4,0,-4,0,-4,86,86,-1,86,-10,86,86,-3,86,-4,86,-1,86,-3,86,86,86,-13,86,87,-1,86,-1,86,-3,86,-1,86,86,86,-2,88,-1,89,-4,86,-37,90,91,92,93,94,95,96,97,98,99,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,-4,100,101],
sm28=[0,-4,0,-4,0,-4,102,-13,102,102,-8,102,-1,102,-3,102,102,102,-24,103,-11,102,-47,104],
sm29=[0,-4,0,-4,0,-4,105,-13,105,105,-8,105,-1,105,-3,105,105,105,-24,105,-11,105,-47,105,106],
sm30=[0,-4,0,-4,0,-4,107,-13,107,107,-8,107,-1,107,-3,107,107,107,-24,107,-1,108,-9,107,-47,107,107],
sm31=[0,-4,0,-4,0,-4,109,-13,109,109,-8,109,-1,109,-3,109,109,109,-24,109,-1,109,-9,109,-47,109,109,110],
sm32=[0,-4,0,-4,0,-4,111,-13,111,111,-8,111,-1,111,-3,111,111,111,-24,111,-1,111,-9,111,-47,111,111,111,112],
sm33=[0,-4,0,-4,0,-4,113,-13,113,113,-8,113,-1,113,-3,113,113,113,-24,113,-1,113,-9,113,-47,113,113,113,113,114,115,116,117],
sm34=[0,-4,0,-4,0,-4,118,119,-12,118,118,-3,120,-4,118,-1,118,-3,118,118,118,-13,121,-4,122,-5,118,-1,118,-9,118,-47,118,118,118,118,118,118,118,118,123,124],
sm35=[0,-4,0,-4,0,-4,125,125,-12,125,125,-3,125,-4,125,-1,125,-3,125,125,125,-13,125,-4,125,-5,125,-1,125,-9,125,-47,125,125,125,125,125,125,125,125,125,125,126,127,128],
sm36=[0,-4,0,-4,0,-4,129,129,-12,129,129,-3,129,-4,129,-1,129,-3,129,129,129,-13,129,-4,129,-3,130,-1,129,-1,129,-9,129,-47,129,129,129,129,129,129,129,129,129,129,129,129,129,131],
sm37=[0,-4,0,-4,0,-4,132,132,-1,133,-10,132,132,-3,132,-4,132,-1,132,-3,132,132,132,-13,132,-2,134,-1,132,-3,132,-1,132,135,132,-9,132,-47,132,132,132,132,132,132,132,132,132,132,132,132,132,132],
sm38=[0,-4,0,-4,0,-4,136,136,-1,136,-10,136,136,-3,136,-4,136,-1,136,-3,136,136,136,-13,136,-2,136,-1,136,-3,136,-1,136,136,136,-9,136,-47,136,136,136,136,136,136,136,136,136,136,136,136,136,136],
sm39=[0,-4,0,-4,0,-4,137,137,-1,137,-10,137,137,-3,137,-4,137,-1,137,-3,137,137,137,-13,137,-2,137,-1,137,-3,137,-1,137,137,137,-9,137,-47,137,137,137,137,137,137,137,137,137,137,137,137,137,137],
sm40=[0,-4,0,-4,0,-4,138,138,-1,138,-10,138,138,-3,138,-4,138,-1,138,-3,138,138,138,-13,138,-2,138,-1,138,-3,138,-1,138,138,138,-9,138,-47,138,138,138,138,138,138,138,138,138,138,138,138,138,138,139],
sm41=[0,-4,0,-4,0,-4,138,138,-1,138,-10,138,138,-3,138,-4,138,-1,138,-3,138,138,138,-13,138,-2,138,-1,138,-3,138,-1,138,138,138,-9,138,-47,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138],
sm42=[0,-4,0,-4,0,-4,140,140,-1,140,-10,140,140,-3,140,-4,140,-1,140,-3,140,140,140,-13,140,140,-1,140,-1,140,-3,140,-1,140,140,140,-2,140,-1,140,-4,140,-14,140,-22,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,-4,140,140],
sm43=[0,-4,0,-4,0,-4,140,140,-1,140,-10,140,140,-3,140,-3,141,140,142,140,-3,140,140,140,-13,140,140,-1,140,-1,140,-3,140,-1,140,140,140,143,-1,140,-1,140,-4,140,-14,140,-22,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,-4,140,140],
sm44=[0,-4,0,-4,0,-4,144,144,-1,144,-10,144,144,-3,144,-3,145,144,142,144,-3,144,144,144,-13,144,144,-1,144,-1,144,-3,144,-1,144,144,144,146,-1,144,-1,144,-4,144,-14,144,-22,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,-4,144,144],
sm45=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-5,37,-28,147,-12,40,41,-27,43,148,-2,45,-34,53,54,55,56,57,58],
sm46=[0,-4,0,-4,0,-4,149,149,-1,149,-10,149,149,-3,149,-3,149,149,149,149,-3,149,149,149,-13,149,149,-1,149,-1,149,-3,149,-1,149,149,149,149,-1,149,-1,149,-4,149,-14,149,-22,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,149,-4,149,149],
sm47=[0,-4,0,-4,0,-4,150,150,-1,150,-10,150,150,-3,150,-3,150,150,150,150,-3,150,150,150,-13,150,150,-1,150,-1,150,-3,150,-1,150,150,150,150,-1,150,-1,150,-4,150,-14,150,-22,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,-4,150,150],
sm48=[0,-4,0,-4,0,-4,151,151,-1,151,-10,151,151,-3,151,-3,151,151,151,151,-3,151,151,151,-13,151,151,-1,151,-1,151,-3,151,-1,151,151,151,151,-1,151,-1,151,-4,151,-14,151,-22,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,-4,151,151],
sm49=[0,-4,0,-4,0,-4,152,152,-1,152,-10,152,152,-3,152,-3,152,152,152,152,-3,152,152,152,-13,152,152,-1,152,-1,152,-3,152,-1,152,152,152,152,-1,152,-1,152,-4,152,-14,152,-22,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,-4,152,152],
sm50=[0,-4,0,-4,0,-4,153,153,-1,153,-10,153,153,-3,153,-3,153,153,153,153,-3,153,153,153,-13,153,153,-1,153,-1,153,-3,153,-1,153,153,153,153,-1,153,-1,153,-4,153,-14,153,-22,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,153,-4,153,153],
sm51=[0,-4,0,-4,0,-4,151,151,-1,151,-10,151,151,-3,151,-3,151,151,151,151,-3,151,151,151,-13,151,151,-1,151,-1,151,-3,151,-1,151,151,151,151,-1,151,-1,151,-4,151,-14,151,-12,154,-9,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,-4,151,151],
sm52=[0,-4,0,-4,0,-4,155,155,-1,155,-10,155,155,-3,155,-3,155,155,155,155,-3,155,155,155,-13,155,155,-1,155,-1,155,-3,155,-1,155,155,155,155,-1,155,-1,155,-4,155,-14,155,-12,156,-9,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,-4,155,155],
sm53=[0,-4,0,-4,0,-4,157,157,-1,157,-10,157,157,-3,157,-3,157,157,157,157,-3,157,157,157,-13,157,157,-1,157,-1,157,-3,157,-1,157,157,157,157,-1,157,-1,157,-4,157,-14,157,-12,157,157,-8,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,-4,157,157],
sm54=[0,-4,0,-4,0,-4,158,158,-1,158,-10,158,158,-3,158,-3,158,158,158,158,-3,158,158,158,-13,158,158,-1,158,-1,158,-3,158,-1,158,158,158,158,-1,158,-1,158,-4,158,-14,158,-12,158,158,-8,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,-4,158,158],
sm55=[0,-4,0,-4,0,-4,159,159,-1,159,-10,159,159,-3,159,-3,159,159,159,159,-3,159,159,159,-13,159,159,-1,159,-1,159,-3,159,-1,159,159,159,159,-1,159,-1,159,-4,159,-14,159,-12,159,159,-8,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,-4,159,159],
sm56=[0,-2,34,-1,0,-4,0,-4,160,160,-1,160,-10,160,160,-3,160,-3,160,160,160,160,-3,160,160,160,-13,160,160,-1,160,-1,160,-3,160,-1,160,160,160,160,-1,160,-1,160,-4,160,-14,160,-12,160,160,-8,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,-4,160,160,-8,58],
sm57=[0,-4,0,-4,0,-4,161,161,-1,161,-10,161,161,-3,161,-3,161,161,161,161,-3,161,161,161,-13,161,161,-1,161,-1,161,-3,161,-1,161,161,161,161,-1,161,-1,161,-4,161,-14,161,-22,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-4,161,161],
sm58=[0,-4,0,-4,0,-4,162,162,-1,162,-10,162,162,-3,162,-3,162,162,162,162,-3,162,162,162,-13,162,162,-1,162,-1,162,-3,162,-1,162,162,162,162,-1,162,-1,162,-4,162,-14,162,-22,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,-4,162,162],
sm59=[0,-4,0,-4,0,-4,163,163,-1,163,-10,163,163,-3,163,-3,163,163,163,163,-3,163,163,163,-13,163,163,-1,163,-1,163,-3,163,-1,163,163,163,163,-1,163,-1,163,-4,163,-14,163,-22,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,-4,163,163],
sm60=[0,-1,164,165,-1,166,167,168,169,170,0,-145,171],
sm61=[0,-1,172,173,-1,174,175,176,177,178,0,-146,179],
sm62=[0,-4,0,-4,0,-4,180,180,-1,180,-10,180,180,-3,180,-3,180,180,180,180,-3,180,180,180,-13,180,180,-1,180,-1,180,-3,180,-1,180,180,180,180,-1,180,-1,180,-4,180,-14,180,-22,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,180,-4,180,180],
sm63=[0,-1,33,34,-1,0,-4,0,-27,35,181,36,-4,182,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,183,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm64=[0,-1,33,34,-1,0,-4,0,-27,184,-6,185,-1,186,-67,187,188,-3,189,-35,53,54,-3,58],
sm65=[0,-4,0,-4,0,-4,190,190,-1,190,-10,190,190,-3,190,-3,190,190,190,190,-3,190,190,190,-13,190,190,-1,190,-1,190,-3,190,-1,190,190,190,190,-1,190,-1,190,-4,190,-14,190,-22,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,-4,190,190],
sm66=[0,-2,34,-1,0,-4,0,-29,191,-120,58],
sm67=[0,-4,0,-4,0,-4,192,192,-1,192,-10,192,192,-3,192,-3,192,192,192,192,-3,192,192,192,-13,192,192,-1,192,-1,192,-3,192,-1,192,192,192,192,-1,192,-1,192,-4,192,-14,192,-22,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,-4,192,192],
sm68=[0,-2,34,-1,0,-4,0,-35,193,-66,194,-47,58],
sm69=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,195,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,196,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm70=[0,-4,0,-4,0,-27,197,-1,142,-34,198],
sm71=[0,-4,0,-4,0,-4,199,199,-1,199,-10,199,199,-3,199,-3,199,199,199,199,-3,199,199,199,-13,199,199,-1,199,-1,199,-3,199,-1,199,199,199,199,-1,199,-1,199,-4,199,-14,199,-22,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,-4,199,199],
sm72=[0,-4,0,-4,0,-4,200,200,-1,200,-10,200,200,-3,200,-3,200,200,200,200,-3,200,200,200,-13,200,200,-1,200,-1,200,-3,200,-1,200,200,200,200,-1,200,-1,200,-4,200,-14,200,-22,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,-4,200,200],
sm73=[0,-4,0,-4,0,-101,201],
sm74=[0,-4,0,-4,0,-101,154],
sm75=[0,-2,61,-1,0,-4,0,-7,202,-15,203,-121,63,64],
sm76=[0,-2,204,-1,0,-4,0,-7,204,-15,204,-121,204,204],
sm77=[0,-2,205,-1,0,-4,0,-7,205,-15,205,-27,206,-93,205,205],
sm78=[0,-2,207,-1,0,-4,0],
sm79=[0,-2,208,-1,0,-4,0],
sm80=[0,-2,209,-1,0,-4,0,-7,209,-15,209,-27,209,-93,209,209],
sm81=[0,-2,61,-1,0,-4,0,-23,210,-121,63,64],
sm82=[0,-2,211,-1,0,-4,0,-13,212,-10,213,-2,214,-7,215,-2,216,-23,217,218,219,-8,220],
sm83=[0,-2,61,-1,0,-4,0,-23,221,-121,63,64],
sm84=[0,-1,33,34,-1,0,-4,0,-4,222,223,-7,224,-15,36,-5,225,-23,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm85=[0,-2,61,-1,0,-4,0,-7,241,-15,242,-121,63,64],
sm86=[0,-2,71,-1,72,73,74,75,76,243,-5,223,-7,244,-3,245,-17,2],
sm87=[0,-4,0,-4,0,-23,246],
sm88=[0,-2,61,-1,0,-4,0,-7,247,-15,248,-121,63,64],
sm89=[0,249,-1,249,-1,249,249,249,249,249,249,-4,249,249,-7,250,-3,249,-17,249],
sm90=[0,-4,0,-4,0,-23,251],
sm91=[0,-2,71,-1,72,73,74,75,76,0,-23,252],
sm92=[0,-2,253,-1,253,253,253,253,253,253,-5,253,-7,253,-3,253,-5,253,-11,253],
sm93=[0,-2,254,-1,254,254,254,254,254,254,-5,254,-7,254,-3,254,-5,254,-11,254],
sm94=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,255,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm95=[0,-4,0,-4,0,-4,256,256,-1,256,-10,256,256,-3,256,-4,256,-1,256,-3,256,256,256,-13,256,-2,256,-1,256,-3,256,-1,256,256,256,-9,256,-47,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256],
sm96=[0,-4,0,-4,0,-4,257,257,-1,257,-10,257,257,-3,257,-4,257,-1,257,-3,257,257,257,-13,257,-2,257,-1,257,-3,257,-1,257,257,257,-9,257,-47,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257],
sm97=[0,-1,258,258,-1,0,-4,0,-27,258,-1,258,-5,258,-23,258,258,-16,258,258,-8,258,-18,258,258,-2,258,-23,258,-1,258,258,258,258,258,258,-3,258,258,258,258,258,258],
sm98=[0,-4,0,-4,0,-4,259,259,-1,259,-10,259,259,-3,259,-4,259,-1,259,-3,259,259,259,-13,259,-2,259,-1,259,-3,259,-1,259,259,259,-9,259,-47,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259],
sm99=[0,-4,0,-4,0,-4,86,86,-1,86,-10,86,86,-3,86,-4,86,-1,86,-3,86,86,86,-13,86,-2,86,-1,86,-3,86,-1,86,86,86,-9,86,-47,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,-4,100,101],
sm100=[0,-4,0,-4,0,-4,155,155,-1,155,-10,155,155,-3,155,-3,155,155,155,155,-3,155,155,155,-13,155,155,-1,155,-1,155,-3,155,-1,155,155,155,155,-1,155,-1,155,-4,155,-14,155,-22,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,-4,155,155],
sm101=[0,-4,0,-4,0,-4,260,260,-1,260,-10,260,260,-3,260,-4,260,-1,260,-3,260,260,260,-13,260,-2,260,-1,260,-3,260,-1,260,260,260,-9,260,-47,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260],
sm102=[0,-4,0,-4,0,-4,261,261,-1,261,-10,261,261,-3,261,-4,261,-1,261,-3,261,261,261,-13,261,-2,261,-1,261,-3,261,-1,261,261,261,-9,261,-47,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261],
sm103=[0,-4,0,-4,0,-4,262,262,-1,262,-10,262,262,-3,262,-4,262,-1,262,-3,262,262,262,-13,262,-2,262,-1,262,-3,262,-1,262,262,262,-9,262,-47,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262],
sm104=[0,-4,0,-4,0,-4,263,263,-1,263,-10,263,263,-3,263,-4,263,-1,263,-3,263,263,263,-13,263,-2,263,-1,263,-3,263,-1,263,263,263,-9,263,-47,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263],
sm105=[0,-4,0,-4,0,-4,264,264,-1,264,-10,264,264,-3,264,-4,264,-1,264,-3,264,264,264,-13,264,-2,264,-1,264,-3,264,-1,264,264,264,-9,264,-47,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264],
sm106=[0,-4,0,-4,0,-4,265,265,-1,265,-10,265,265,-3,265,-4,265,-1,265,-3,265,265,265,-13,265,-2,265,-1,265,-3,265,-1,265,265,265,-9,265,-47,265,265,265,265,265,265,265,265,265,265,265,265,265,265,265],
sm107=[0,-4,0,-4,0,-4,266,266,-1,266,-10,266,266,-3,266,-4,266,-1,266,-3,266,266,266,-13,266,-2,266,-1,266,-3,266,-1,266,266,266,-9,266,-47,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266],
sm108=[0,-4,0,-4,0,-4,267,267,-1,267,-10,267,267,-3,267,-4,267,-1,267,-3,267,267,267,-13,267,-2,267,-1,267,-3,267,-1,267,267,267,-9,267,-47,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267],
sm109=[0,-2,34,-1,0,-4,0,-150,58],
sm110=[0,-4,0,-4,0,-4,268,268,-1,268,-10,268,268,-3,268,-3,268,268,268,268,-3,268,268,268,-13,268,268,-1,268,-1,268,-3,268,-1,268,268,268,268,-1,268,-1,268,-4,268,-14,268,-22,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,-4,268,268],
sm111=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,269,-3,270,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,271,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm112=[0,-4,0,-4,0,-4,272,272,-1,272,-10,272,272,-3,272,-3,272,272,272,272,-3,272,272,272,-13,272,272,-1,272,-1,272,-3,272,-1,272,272,272,272,-1,272,-1,272,-4,272,-14,272,-22,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,-4,272,272],
sm113=[0,-4,0,-4,0,-4,273,273,-1,273,-10,273,273,-3,273,-4,273,-1,273,-3,273,273,273,-13,273,273,-1,273,-1,273,-3,273,-1,273,273,273,-2,273,-1,273,-4,273,-14,273,-22,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,-4,273,273],
sm114=[0,-4,0,-4,0,-108,274],
sm115=[0,-4,0,-4,0,-27,197,-36,198],
sm116=[0,-4,0,-4,0,-4,275,275,-1,275,-10,275,275,-3,275,-3,275,275,275,275,-3,275,275,275,-13,275,275,-1,275,-1,275,-3,275,-1,275,275,275,275,-1,275,-1,275,-4,275,-14,275,-12,275,275,-8,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,-4,275,275],
sm117=[0,-1,164,165,-1,166,167,168,169,170,0,-145,276],
sm118=[0,-4,0,-4,0,-4,277,277,-1,277,-10,277,277,-3,277,-3,277,277,277,277,-3,277,277,277,-13,277,277,-1,277,-1,277,-3,277,-1,277,277,277,277,-1,277,-1,277,-4,277,-14,277,-22,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,-4,277,277],
sm119=[0,-1,278,278,-1,278,278,278,278,278,0,-145,278],
sm120=[0,-1,279,279,-1,279,279,279,279,279,0,-145,279],
sm121=[0,-1,172,173,-1,174,175,176,177,178,0,-146,280],
sm122=[0,-1,281,281,-1,281,281,281,281,281,0,-146,281],
sm123=[0,-1,282,282,-1,282,282,282,282,282,0,-146,282],
sm124=[0,-4,0,-4,0,-28,283,-5,284],
sm125=[0,-1,33,34,-1,0,-4,0,-27,35,285,36,-4,286,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,183,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm126=[0,-4,0,-4,0,-4,287,287,-1,287,-10,287,287,-3,287,-3,287,287,287,287,-3,287,287,287,-13,287,287,-1,287,-1,287,-3,287,-1,287,287,287,287,-1,287,-1,287,-4,287,-14,287,-22,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,-4,287,287],
sm127=[0,-4,0,-4,0,-28,288,-5,288],
sm128=[0,-1,289,289,-1,0,-4,0,-27,289,289,289,-4,289,289,-23,289,289,-16,289,289,-8,289,-18,289,289,-1,289,289,-23,289,-1,289,289,289,289,289,289,-3,289,289,289,289,289,289],
sm129=[0,-4,0,-4,0,-34,290,-1,291],
sm130=[0,-4,0,-4,0,-36,292],
sm131=[0,-4,0,-4,0,-4,293,293,-1,293,-10,293,293,-3,293,-3,293,293,293,293,-3,293,293,293,-13,293,293,-1,293,-1,293,-3,293,-1,293,293,293,293,-1,293,-1,293,-4,293,-14,293,-22,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,-4,293,293],
sm132=[0,-4,0,-4,0,-34,294,-1,294],
sm133=[0,-4,0,-4,0,-34,295,-1,295],
sm134=[0,-4,0,-4,0,-34,295,-1,295,-14,296],
sm135=[0,-4,0,-4,0,-29,297,-43,298],
sm136=[0,-4,0,-4,0,-4,157,157,-1,157,-15,157,-3,157,-1,299,-4,157,157,157,-13,157,157,-1,157,-1,157,-3,157,-1,157,157,157,157,-1,157,-1,157,-4,299,-27,157,-9,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,-4,157,157],
sm137=[0,-1,33,34,-1,0,-4,0,-27,184,-117,53,54,-3,58],
sm138=[0,-4,0,-4,0,-29,300,-43,300],
sm139=[0,-4,0,-4,0,-29,299,-43,299],
sm140=[0,-4,0,-4,0,-29,301],
sm141=[0,-2,34,-1,0,-4,0,-27,302,-2,303,-4,304,-73,305,-40,58],
sm142=[0,-4,0,-4,0,-4,156,-23,156,156,156,-3,156,156,156,-14,156,-3,156,-32,156,-13,156],
sm143=[0,-4,0,-4,0,-35,193,-66,194],
sm144=[0,-1,306,306,-1,0,-4,0,-4,306,306,-1,306,-5,306,-4,306,306,-3,306,-3,306,306,306,306,-3,306,306,306,-13,306,306,-1,306,-1,306,-3,306,306,306,306,306,306,-1,306,-1,306,-4,306,-2,306,306,306,306,-1,306,-1,306,306,306,306,306,306,306,306,306,306,306,306,306,306,-2,306,306,-5,306,306,-2,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,-3,306,306,306,306,306,306],
sm145=[0,-4,0,-4,0,-35,307],
sm146=[0,-1,33,34,-1,0,-4,0,-4,308,-22,184,-8,309,-66,310,187,188,-39,53,54,-3,58],
sm147=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-5,37,-41,40,41,-27,43,44,-2,45,-34,53,54,55,56,57,58],
sm148=[0,-4,0,-4,0,-4,311,311,-1,311,-10,311,311,-3,311,-3,311,311,311,311,-3,311,311,311,-13,311,311,-1,311,-1,311,-3,311,-1,311,311,311,311,-1,311,-1,311,-4,311,-14,311,-12,311,-9,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,-4,311,311],
sm149=[0,-4,0,-4,0,-30,312,-3,313],
sm150=[0,-2,34,-1,0,-4,0,-27,302,-7,304,-114,58],
sm151=[0,-4,0,-4,0,-4,314,314,-1,314,-10,314,314,-3,314,-3,314,314,314,314,-3,314,314,314,-13,314,314,-1,314,-1,314,-3,314,-1,314,314,314,314,-1,314,-1,314,-4,314,-14,314,-22,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,-4,314,314],
sm152=[0,-4,0,-4,0,-4,315,315,-1,315,-10,315,315,-3,315,-4,315,-1,315,-3,315,315,315,-13,315,-2,315,-1,315,-3,315,-1,315,315,315,-9,315,-47,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315],
sm153=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-5,316,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm154=[0,-4,0,-4,0,-23,317],
sm155=[0,-4,0,-4,0,-5,318,-29,318],
sm156=[0,-2,319,-1,0,-4,0,-7,319,-15,319,-121,319,319],
sm157=[0,-2,320,-1,0,-4,0,-17,245,-127,321,322],
sm158=[0,-4,0,-4,0,-146,323],
sm159=[0,-4,0,-4,0,-145,324],
sm160=[0,-4,0,-4,0,-13,325],
sm161=[0,-4,0,-4,0,-13,326],
sm162=[0,-2,211,-1,0,-4,0,-13,327,-10,213,-2,214,-7,215,-2,216,-23,217,218,219,-8,220],
sm163=[0,-2,328,-1,0,-4,0,-13,328,-10,328,-2,328,-7,328,-2,328,-23,328,328,328,-8,328],
sm164=[0,-2,329,-1,0,-4,0,-4,330,-8,329,-10,329,-2,329,-7,329,-2,329,-23,329,329,329,-8,329],
sm165=[0,-4,0,-4,0,-6,331,-30,332,-1,333,-7,334],
sm166=[0,-2,335,-1,0,-4,0,-13,335,-10,335,-2,335,-7,335,-2,335,-23,335,335,335,-8,335],
sm167=[0,-2,336,-1,0,-4,0,-13,336,-10,336,-2,336,-7,336,-2,336,-23,336,336,336,-8,336],
sm168=[0,-4,0,-4,0,-34,337,338],
sm169=[0,-2,339,-1,0,-4,0,-38,216],
sm170=[0,-4,0,-4,0,-34,340,340],
sm171=[0,-2,211,-1,0,-4,0,-23,341,213,-2,214,-2,342,-3,342,342,-23,343,344,345,217,218,219,-8,220],
sm172=[0,-2,346,-1,0,-4,0,-23,346,213,-2,214,-2,346,-3,346,346,-23,346,346,346,346,346,219,-8,220],
sm173=[0,-2,346,-1,0,-4,0,-23,346,346,-2,346,-2,346,-3,346,346,-23,346,346,346,346,346,346,-8,347],
sm174=[0,-2,348,-1,0,-4,0,-23,348,348,-2,348,-2,348,-3,348,348,-23,348,348,348,348,348,348,-8,348],
sm175=[0,-2,349,-1,0,-4,0,-62,350],
sm176=[0,-2,348,-1,0,-4,0,-23,348,348,-2,348,-2,348,-3,348,348,-23,348,348,348,348,351,348,-8,348],
sm177=[0,-2,352,-1,0,-4,0,-23,352,352,-2,352,352,-1,352,-3,352,352,-15,352,-7,352,352,352,352,351,352,-1,352,352,352,-4,352],
sm178=[0,-4,0,-4,0,-63,353],
sm179=[0,-2,354,-1,0,-4,0,-62,354],
sm180=[0,-2,355,-1,0,-4,0,-23,355,355,-2,355,-2,355,-3,355,355,-23,355,355,355,355,355,355,-8,355],
sm181=[0,-2,356,-1,0,-4,0,-23,356,356,-2,356,-2,356,-3,356,356,-23,356,356,356,356,356,356,-8,356],
sm182=[0,-2,357,-1,0,-4,0],
sm183=[0,-2,358,-1,0,-4,0],
sm184=[0,-2,211,-1,0,-4,0,-62,359,218],
sm185=[0,-2,360,-1,0,-4,0,-73,361],
sm186=[0,-2,362,-1,0,-4,0,-23,362,362,-2,362,-2,362,-3,362,362,-23,362,362,362,362,362,362,-8,362],
sm187=[0,-2,363,-1,0,-4,0,-23,363,363,-2,363,-2,363,-3,363,363,-23,363,363,363,363,363,363,-8,361],
sm188=[0,-4,0,-4,0,-4,364],
sm189=[0,-4,0,-4,0,-4,365],
sm190=[0,-4,0,-4,0,-4,366],
sm191=[0,-1,33,34,-1,0,-4,0,-4,222,223,-7,367,-15,36,-5,225,-23,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm192=[0,-4,0,-4,0,-13,368],
sm193=[0,-4,0,-4,0,-14,369],
sm194=[0,-4,0,-4,0,-13,370,-22,370],
sm195=[0,-4,0,-4,0,-13,371,-22,371],
sm196=[0,-1,33,34,-1,0,-4,0,-4,222,223,-7,372,-15,36,-5,225,372,-22,38,39,-15,372,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,372,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm197=[0,-1,373,373,-1,0,-4,0,-4,373,373,-7,373,-13,373,-1,373,-5,373,373,-22,373,373,-15,373,373,373,373,-1,373,-1,373,373,373,373,373,-1,373,373,373,373,373,373,373,373,-2,373,373,-5,373,373,-2,373,-23,373,-1,373,373,373,373,373,373,-3,373,373,373,373,373,373],
sm198=[0,-1,374,374,-1,0,-4,0,-4,374,374,-7,374,-13,374,-1,374,-5,374,374,-22,374,374,-15,374,374,374,374,-1,374,-1,374,374,374,374,374,-1,374,374,374,374,374,374,374,374,-2,374,374,-5,374,374,-2,374,-23,374,-1,374,374,374,374,374,374,-3,374,374,374,374,374,374],
sm199=[0,-1,375,375,-1,0,-4,0,-4,375,375,-7,375,-13,375,-1,375,-5,375,375,-22,375,375,-15,375,375,375,375,-1,375,-1,375,375,375,375,375,-1,375,375,375,375,375,375,375,375,-2,375,375,-5,375,375,-2,375,-23,375,-1,375,375,375,375,375,375,-3,375,375,375,375,375,375],
sm200=[0,-4,0,-4,0,-4,376],
sm201=[0,-1,377,377,-1,0,-4,0,-4,377,377,-7,377,-13,377,-1,377,-5,377,377,-22,377,377,-15,377,377,377,377,-1,377,377,377,377,377,377,377,-1,377,377,377,377,377,377,377,377,-2,377,377,-5,377,377,-2,377,-23,377,-1,377,377,377,377,377,377,-3,377,377,377,377,377,377],
sm202=[0,-2,8,-1,0,-4,0,-6,79,-3,10,11,12,-1,13,-124,14,-11,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
sm203=[0,-1,33,34,-1,0,-4,0,-4,222,223,-21,35,-1,36,-5,378,-23,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm204=[0,-1,379,379,-1,0,-4,0,-4,379,379,-7,379,-13,379,-1,379,-5,379,379,-22,379,379,-15,379,379,379,379,-1,379,379,379,379,379,379,379,-1,379,379,379,379,379,379,379,379,-2,379,379,-5,379,379,-2,379,-23,379,-1,379,379,379,379,379,379,-3,379,379,379,379,379,379],
sm205=[0,-4,0,-4,0,-4,380],
sm206=[0,-4,0,-4,0,-4,155,155,-1,155,-15,155,-3,155,-1,155,-4,155,155,155,-13,155,155,-1,155,-1,155,-3,155,-1,155,155,155,155,-1,155,-1,155,-4,381,-27,156,-9,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,-4,155,155],
sm207=[0,-4,0,-4,0,-73,382],
sm208=[0,-1,383,383,-1,0,-4,0,-4,383,383,-7,383,-13,383,-1,383,-5,383,383,-22,383,383,-15,383,383,383,383,-1,383,383,383,383,383,383,383,-1,383,383,383,383,383,383,383,383,-2,383,383,-5,383,383,-2,383,-23,383,-1,383,383,383,383,383,383,-3,383,383,383,383,383,383],
sm209=[0,-4,0,-4,0,-29,384],
sm210=[0,-1,385,385,-1,0,-4,0,-4,385,385,-7,385,-13,385,-1,385,-5,385,385,-22,385,385,-15,385,385,385,385,-1,385,385,385,385,385,385,385,-1,385,385,385,385,385,385,385,385,-2,385,385,-5,385,385,-2,385,-23,385,-1,385,385,385,385,385,385,-3,385,385,385,385,385,385],
sm211=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,-23,38,39,-20,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,-6,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm212=[0,-4,0,-4,0,-29,386],
sm213=[0,-4,0,-4,0,-29,387,-57,388],
sm214=[0,-4,0,-4,0,-29,389],
sm215=[0,-2,34,-1,0,-4,0,-4,390,-145,58],
sm216=[0,-2,34,-1,0,-4,0,-4,391,-145,58],
sm217=[0,-1,33,34,-1,0,-4,0,-4,392,-22,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm218=[0,-4,0,-4,0,-29,393],
sm219=[0,-4,0,-4,0,-35,394],
sm220=[0,-4,0,-4,0,-4,395],
sm221=[0,-1,396,396,-1,0,-4,0,-4,396,396,-7,396,-13,396,-1,396,-5,396,396,-22,396,396,-15,396,396,396,396,-1,396,-1,396,396,396,396,396,-1,396,396,396,396,396,396,396,396,-2,396,396,-5,396,396,-2,396,-23,396,-1,396,396,396,396,396,396,-3,396,396,396,396,396,396],
sm222=[0,-1,397,397,-1,0,-4,0,-4,397,397,-7,397,-13,397,-1,397,-5,397,397,-22,397,397,-15,397,397,397,397,-1,397,-1,397,397,397,397,397,-1,397,397,397,397,397,397,397,397,-2,397,397,-5,397,397,-2,397,-23,397,-1,397,397,397,397,397,397,-3,397,397,397,397,397,397],
sm223=[0,-2,398,-1,0,-4,0,-27,398,-7,398,-114,398],
sm224=[0,-2,399,-1,0,-4,0,-27,399,-7,399,-114,399],
sm225=[0,-2,71,-1,72,73,74,75,76,243,-5,223,-7,400,-3,245,-17,2],
sm226=[0,-4,0,-4,0,-23,401],
sm227=[0,-4,0,-4,0,-13,402],
sm228=[0,-2,8,-1,0,-4,0],
sm229=[0,-2,71,-1,72,73,74,75,76,243,-5,223,-7,403,-3,245,-17,2],
sm230=[0,-2,404,-1,404,404,404,404,404,404,-5,404,-7,404,-3,404,-17,404],
sm231=[0,-2,405,-1,405,405,405,405,405,405,-5,405,-7,405,-3,405,-17,405],
sm232=[0,-2,406,-1,406,406,406,406,406,406,-5,406,-7,406,-3,406,-17,406],
sm233=[0,-2,71,-1,72,73,74,75,76,407,-5,32,-7,407,-3,245,-5,408,-11,2,-26,409],
sm234=[0,-2,410,-1,411,410,410,410,410,410,-5,410,-7,410,-3,410,-5,410,-11,410,-26,410],
sm235=[0,-2,412,-1,412,412,412,412,412,412,-5,412,-7,412,-3,412,-17,412],
sm236=[0,-2,71,-1,72,73,74,75,76,412,-5,412,-7,412,-3,412,-17,412],
sm237=[0,-2,413,-1,413,413,413,413,413,413,-5,413,-1,413,-5,413,-3,413,-5,413,-11,413,-109,413,413],
sm238=[0,414,-1,414,-1,414,414,414,414,414,414,-4,414,414,-7,414,-3,414,-17,414],
sm239=[0,415,-1,415,-1,415,415,415,415,415,415,-4,415,415,-7,416,-3,415,-17,415],
sm240=[0,-4,0,-4,0,-23,417],
sm241=[0,-4,0,-4,0,-6,79,-3,10,11,-139,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
sm242=[0,-2,418,-1,418,418,418,418,418,418,-5,418,-7,418,-3,418,-17,418],
sm243=[0,-2,419,-1,419,419,419,419,419,419,-5,419,-7,419,-3,419,-5,419,-11,419],
sm244=[0,-4,0,-4,0,-36,420],
sm245=[0,-4,0,-4,0,-36,421],
sm246=[0,-4,0,-4,0,-4,422,-13,422,422,-8,422,-1,422,-3,422,422,-37,422],
sm247=[0,-4,0,-4,0,-4,423,-13,423,423,-8,423,-1,423,-3,423,423,423,-36,423],
sm248=[0,-4,0,-4,0,-73,424],
sm249=[0,-4,0,-4,0,-4,425,-13,425,425,-8,425,-1,425,-3,425,425,425,-24,425,-11,425,-47,425,106],
sm250=[0,-4,0,-4,0,-4,426,-13,426,426,-8,426,-1,426,-3,426,426,426,-24,426,-1,108,-9,426,-47,426,426],
sm251=[0,-4,0,-4,0,-4,427,-13,427,427,-8,427,-1,427,-3,427,427,427,-24,427,-1,427,-9,427,-47,427,427,110],
sm252=[0,-4,0,-4,0,-4,428,-13,428,428,-8,428,-1,428,-3,428,428,428,-24,428,-1,428,-9,428,-47,428,428,428,112],
sm253=[0,-4,0,-4,0,-4,429,-13,429,429,-8,429,-1,429,-3,429,429,429,-24,429,-1,429,-9,429,-47,429,429,429,429,114,115,116,117],
sm254=[0,-4,0,-4,0,-4,430,119,-12,430,430,-3,120,-4,430,-1,430,-3,430,430,430,-13,121,-4,122,-5,430,-1,430,-9,430,-47,430,430,430,430,430,430,430,430,123,124],
sm255=[0,-4,0,-4,0,-4,431,431,-12,431,431,-3,431,-4,431,-1,431,-3,431,431,431,-13,431,-4,431,-5,431,-1,431,-9,431,-47,431,431,431,431,431,431,431,431,431,431,126,127,128],
sm256=[0,-4,0,-4,0,-4,432,432,-12,432,432,-3,432,-4,432,-1,432,-3,432,432,432,-13,432,-4,432,-5,432,-1,432,-9,432,-47,432,432,432,432,432,432,432,432,432,432,126,127,128],
sm257=[0,-4,0,-4,0,-4,433,433,-12,433,433,-3,433,-4,433,-1,433,-3,433,433,433,-13,433,-4,433,-5,433,-1,433,-9,433,-47,433,433,433,433,433,433,433,433,433,433,126,127,128],
sm258=[0,-4,0,-4,0,-4,434,434,-12,434,434,-3,434,-4,434,-1,434,-3,434,434,434,-13,434,-4,434,-3,130,-1,434,-1,434,-9,434,-47,434,434,434,434,434,434,434,434,434,434,434,434,434,131],
sm259=[0,-4,0,-4,0,-4,435,435,-12,435,435,-3,435,-4,435,-1,435,-3,435,435,435,-13,435,-4,435,-3,130,-1,435,-1,435,-9,435,-47,435,435,435,435,435,435,435,435,435,435,435,435,435,131],
sm260=[0,-4,0,-4,0,-4,436,436,-12,436,436,-3,436,-4,436,-1,436,-3,436,436,436,-13,436,-4,436,-3,130,-1,436,-1,436,-9,436,-47,436,436,436,436,436,436,436,436,436,436,436,436,436,131],
sm261=[0,-4,0,-4,0,-4,437,437,-1,133,-10,437,437,-3,437,-4,437,-1,437,-3,437,437,437,-13,437,-2,134,-1,437,-3,437,-1,437,135,437,-9,437,-47,437,437,437,437,437,437,437,437,437,437,437,437,437,437],
sm262=[0,-4,0,-4,0,-4,438,438,-1,133,-10,438,438,-3,438,-4,438,-1,438,-3,438,438,438,-13,438,-2,134,-1,438,-3,438,-1,438,135,438,-9,438,-47,438,438,438,438,438,438,438,438,438,438,438,438,438,438],
sm263=[0,-4,0,-4,0,-4,439,439,-1,439,-10,439,439,-3,439,-4,439,-1,439,-3,439,439,439,-13,439,-2,439,-1,439,-3,439,-1,439,439,439,-9,439,-47,439,439,439,439,439,439,439,439,439,439,439,439,439,439],
sm264=[0,-4,0,-4,0,-4,440,440,-1,440,-10,440,440,-3,440,-4,440,-1,440,-3,440,440,440,-13,440,-2,440,-1,440,-3,440,-1,440,440,440,-9,440,-47,440,440,440,440,440,440,440,440,440,440,440,440,440,440],
sm265=[0,-4,0,-4,0,-4,441,441,-1,441,-10,441,441,-3,441,-4,441,-1,441,-3,441,441,441,-13,441,-2,441,-1,441,-3,441,-1,441,441,441,-9,441,-47,441,441,441,441,441,441,441,441,441,441,441,441,441,441],
sm266=[0,-4,0,-4,0,-4,442,442,-1,442,-10,442,442,-3,442,-4,442,-1,442,-3,442,442,442,-13,442,-2,442,-1,442,-3,442,-1,442,442,442,-9,442,-47,442,442,442,442,442,442,442,442,442,442,442,442,442,442],
sm267=[0,-4,0,-4,0,-4,443,443,-1,443,-10,443,443,-3,443,-3,443,443,443,443,-3,443,443,443,-13,443,443,-1,443,-1,443,-3,443,-1,443,443,443,443,-1,443,-1,443,-4,443,-14,443,-22,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,443,-4,443,443],
sm268=[0,-4,0,-4,0,-28,444],
sm269=[0,-4,0,-4,0,-30,445,-3,446],
sm270=[0,-4,0,-4,0,-30,447],
sm271=[0,-4,0,-4,0,-4,448,448,-1,448,-10,448,448,-3,448,-3,448,448,448,448,-3,448,448,448,-13,448,448,-1,448,-1,448,-3,448,-1,448,448,448,448,-1,448,-1,448,-4,448,-14,448,-22,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,-4,448,448],
sm272=[0,-4,0,-4,0,-30,449,-3,450],
sm273=[0,-4,0,-4,0,-30,451,-3,451],
sm274=[0,-4,0,-4,0,-30,452,-3,452],
sm275=[0,-4,0,-4,0,-28,453],
sm276=[0,-4,0,-4,0,-4,454,454,-1,454,-10,454,454,-3,454,-3,454,454,454,454,-3,454,454,454,-13,454,454,-1,454,-1,454,-3,454,-1,454,454,454,454,-1,454,-1,454,-4,454,-14,454,-22,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,-4,454,454],
sm277=[0,-4,0,-4,0,-4,455,455,-1,455,-10,455,455,-3,455,-3,455,455,455,455,-3,455,455,455,-13,455,455,-1,455,-1,455,-3,455,-1,455,455,455,455,-1,455,-1,455,-4,455,-14,455,-22,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,-4,455,455],
sm278=[0,-4,0,-4,0,-4,456,456,-1,456,-10,456,456,-3,456,-3,456,456,456,456,-3,456,456,456,-13,456,456,-1,456,-1,456,-3,456,-1,456,456,456,456,-1,456,-1,456,-4,456,-14,456,-22,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,-4,456,456],
sm279=[0,-4,0,-4,0,-4,457,457,-1,457,-10,457,457,-3,457,-3,457,457,457,457,-3,457,457,457,-13,457,457,-1,457,-1,457,-3,457,-1,457,457,457,457,-1,457,-1,457,-4,457,-14,457,-22,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,-4,457,457],
sm280=[0,-1,458,458,-1,458,458,458,458,458,0,-145,458],
sm281=[0,-1,459,459,-1,459,459,459,459,459,0,-146,459],
sm282=[0,-4,0,-4,0,-28,460,-5,286],
sm283=[0,-4,0,-4,0,-4,461,461,-1,461,-10,461,461,-3,461,-3,461,461,461,461,-3,461,461,461,-13,461,461,-1,461,-1,461,-3,461,-1,461,461,461,461,-1,461,-1,461,-4,461,-14,461,-22,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-4,461,461],
sm284=[0,-1,33,34,-1,0,-4,0,-27,35,289,36,-4,182,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,183,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm285=[0,-4,0,-4,0,-4,462,462,-1,462,-10,462,462,-3,462,-3,462,462,462,462,-3,462,462,462,-13,462,462,-1,462,-1,462,-3,462,-1,462,462,462,462,-1,462,-1,462,-4,462,-14,462,-22,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,-4,462,462],
sm286=[0,-4,0,-4,0,-28,463,-5,463],
sm287=[0,-1,464,464,-1,0,-4,0,-27,464,464,464,-4,464,464,-23,464,464,-16,464,464,-8,464,-18,464,464,-1,464,464,-23,464,-1,464,464,464,464,464,464,-3,464,464,464,464,464,464],
sm288=[0,-4,0,-4,0,-28,465,-5,465],
sm289=[0,-1,33,34,-1,0,-4,0,-27,184,-8,466,-67,187,188,-3,189,-35,53,54,-3,58],
sm290=[0,-4,0,-4,0,-4,467,467,-1,467,-10,467,467,-3,467,-3,467,467,467,467,-3,467,467,467,-13,467,467,-1,467,-1,467,-3,467,-1,467,467,467,467,-1,467,-1,467,-4,467,-14,467,-22,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,-4,467,467],
sm291=[0,-4,0,-4,0,-4,468,468,-1,468,-10,468,468,-3,468,-3,468,468,468,468,-3,468,468,468,-13,468,468,-1,468,-1,468,-3,468,-1,468,468,468,468,-1,468,-1,468,-4,468,-14,468,-22,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,468,-4,468,468],
sm292=[0,-4,0,-4,0,-34,469,-1,469],
sm293=[0,-4,0,-4,0,-34,470,-1,470],
sm294=[0,-2,34,-1,0,-4,0,-27,302,-7,304,-73,305,-40,58],
sm295=[0,-4,0,-4,0,-29,471],
sm296=[0,-4,0,-4,0,-29,299],
sm297=[0,-4,0,-4,0,-29,472],
sm298=[0,-4,0,-4,0,-28,473],
sm299=[0,-2,34,-1,0,-4,0,-27,302,-2,474,-4,304,-73,305,-40,58],
sm300=[0,-4,0,-4,0,-30,475],
sm301=[0,-4,0,-4,0,-35,476],
sm302=[0,-4,0,-4,0,-30,477],
sm303=[0,-4,0,-4,0,-30,477,-3,478],
sm304=[0,-4,0,-4,0,-30,479],
sm305=[0,-4,0,-4,0,-30,480,-3,480],
sm306=[0,-4,0,-4,0,-30,481,-3,481],
sm307=[0,-4,0,-4,0,-28,482,-1,482,-3,482,-1,482],
sm308=[0,-4,0,-4,0,-28,482,-1,482,-3,482,-1,482,-14,296],
sm309=[0,-4,0,-4,0,-28,483,-1,483,-3,483,-1,483,-14,296],
sm310=[0,-4,0,-4,0,-28,484,-1,484,-3,484,-1,484,-14,484,-3,484,-32,484],
sm311=[0,-1,33,34,-1,0,-4,0,-27,184,-8,485,-72,486,-35,53,54,-3,58],
sm312=[0,-2,34,-1,0,-4,0,-27,302,487,-5,182,304,-73,305,-40,58],
sm313=[0,-1,488,488,-1,0,-4,0,-4,488,488,-1,488,-5,488,-4,488,488,-3,488,-3,488,488,488,488,-3,488,488,488,-13,488,488,-1,488,-1,488,-3,488,488,488,488,488,488,-1,488,-1,488,-4,488,-2,488,488,488,488,-1,488,-1,488,488,488,488,488,488,488,488,488,488,488,488,488,488,-2,488,488,-5,488,488,-2,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,-3,488,488,488,488,488,488],
sm314=[0,-1,33,34,-1,0,-4,0,-4,308,-22,184,-8,489,-66,310,187,188,-39,53,54,-3,58],
sm315=[0,-4,0,-4,0,-36,490],
sm316=[0,-1,491,491,-1,0,-4,0,-4,491,491,-1,491,-5,491,-4,491,491,-3,491,-3,491,491,491,491,-3,491,491,491,-13,491,491,-1,491,-1,491,-3,491,491,491,491,491,491,-1,491,-1,491,-4,491,-2,491,491,491,491,-1,491,-1,491,491,491,491,491,491,491,491,491,491,491,491,491,491,-2,491,491,-5,491,491,-2,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,491,-3,491,491,491,491,491,491],
sm317=[0,-1,33,34,-1,0,-4,0,-4,308,-22,184,-8,492,-66,310,187,188,-39,53,54,-3,58],
sm318=[0,-1,493,493,-1,0,-4,0,-4,493,-22,493,-8,493,-66,493,493,493,-39,493,493,-3,493],
sm319=[0,-1,494,494,-1,0,-4,0,-4,494,-22,494,-8,494,-66,494,494,494,-39,494,494,-3,494],
sm320=[0,-1,33,34,-1,0,-4,0,-27,184,-76,187,188,-39,53,54,-3,58],
sm321=[0,-4,0,-4,0,-29,297],
sm322=[0,-4,0,-4,0,-35,495],
sm323=[0,-4,0,-4,0,-4,496,496,-1,496,-10,496,496,-3,496,-3,496,496,496,496,-3,496,496,496,-13,496,496,-1,496,-1,496,-3,496,-1,496,496,496,496,-1,496,-1,496,-4,496,-14,496,-12,496,-9,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,496,-4,496,496],
sm324=[0,-4,0,-4,0,-30,497,-78,498],
sm325=[0,-4,0,-4,0,-30,499],
sm326=[0,-4,0,-4,0,-30,500],
sm327=[0,-4,0,-4,0,-4,501,501,-1,501,-10,501,501,-3,501,-3,501,501,501,501,-3,501,501,501,-13,501,501,-1,501,-1,501,-3,501,-1,501,501,501,501,-1,501,-1,501,-4,501,-14,501,-22,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,-4,501,501],
sm328=[0,-4,0,-4,0,-28,502],
sm329=[0,-4,0,-4,0,-4,503,-13,503,503,-8,503,-1,503,-3,503,503,503,-36,503],
sm330=[0,-4,0,-4,0,-4,504,-13,504,504,-8,504,-1,504,-3,504,504,504,-36,504],
sm331=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,-23,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm332=[0,-4,0,-4,0,-5,505,-29,505],
sm333=[0,-2,506,-1,0,-4,0,-7,506,-15,506,-121,506,506],
sm334=[0,-2,507,-1,0,-4,0,-7,507,-15,507,-121,507,507],
sm335=[0,-2,508,-1,509,510,511,512,513,0,-3,514,-13,245],
sm336=[0,-2,508,-1,509,510,511,512,513,0,-3,514],
sm337=[0,-2,515,-1,0,-4,0,-7,515,-15,515,-27,515,-93,515,515],
sm338=[0,-4,0,-4,0,-13,516],
sm339=[0,-4,0,-4,0,-12,517],
sm340=[0,-2,211,-1,0,-4,0,-13,518,-10,213,-2,214,-7,215,-2,216,-23,217,218,219,-8,220],
sm341=[0,-2,519,-1,0,-4,0,-13,519,-10,519,-2,519,-7,519,-2,519,-23,519,519,519,-8,519],
sm342=[0,-2,520,-1,0,-4,0,-13,520,-10,520,-2,520,-7,520,-2,520,-23,520,520,520,-8,520],
sm343=[0,-4,0,-4,0,-4,330],
sm344=[0,-2,521,-1,0,-4,0,-4,521,-8,521,-10,521,-2,521,-7,521,521,-1,521,-23,521,521,521,-8,521],
sm345=[0,-4,522,-4,0,-57,523,-87,524,525],
sm346=[0,-2,526,-1,0,-4,0,-29,527,-15,528,-2,529],
sm347=[0,-4,0,-4,0,-40,530,-104,524,525],
sm348=[0,-2,531,-1,0,-1,532,-2,0,-29,533,-15,534],
sm349=[0,-2,211,-1,0,-4,0,-24,213,-2,214,-34,217,218,219,-8,220],
sm350=[0,-2,339,-1,0,-4,0,-4,535,-31,536,-1,216],
sm351=[0,-2,537,-1,0,-4,0,-4,538,-31,537,-1,537],
sm352=[0,-2,539,-1,0,-4,0,-4,539,-31,539,-1,539],
sm353=[0,-2,540,-1,0,-4,0,-4,540,-31,540,-1,540],
sm354=[0,-2,541,-1,0,-4,0,-4,541,-31,541,-1,541],
sm355=[0,-4,0,-4,0,-73,542],
sm356=[0,-2,211,-1,0,-4,0,-23,341,213,-2,214,-2,543,-3,543,543,-23,343,344,345,217,218,219,-8,220],
sm357=[0,-2,544,-1,0,-4,0,-23,544,544,-2,544,-2,544,-3,544,544,-23,544,544,544,544,544,544,-8,544],
sm358=[0,-2,545,-1,0,-4,0,-23,545,545,-2,545,-2,545,-3,545,545,-23,545,545,545,545,545,545,-8,545],
sm359=[0,-2,546,-1,0,-4,0,-24,546,-2,546,-34,546,546,546,-8,546],
sm360=[0,-2,547,-1,0,-4,0,-23,547,213,-2,214,-2,547,-3,547,547,-23,547,547,547,547,547,219,-8,220],
sm361=[0,-2,547,-1,0,-4,0,-23,547,547,-2,547,-2,547,-3,547,547,-23,547,547,547,547,547,547,-8,347],
sm362=[0,-2,548,-1,0,-4,0,-23,548,548,-2,548,-2,548,-3,548,548,-23,548,548,548,548,548,548,-8,548],
sm363=[0,-2,549,-1,0,-4,0,-23,549,549,-2,549,-2,549,-3,549,549,-23,549,549,549,549,549,549,-8,549],
sm364=[0,-4,0,-4,0,-73,361],
sm365=[0,-2,550,-1,0,-4,0,-23,550,550,-2,550,-2,550,-3,550,550,-23,550,550,550,550,550,550,-8,550],
sm366=[0,-2,551,-1,0,-4,0,-23,551,551,-2,551,551,-1,551,-3,551,551,-15,551,-7,551,551,551,551,551,551,-1,551,551,551,-4,551],
sm367=[0,-2,552,-1,0,-4,0,-62,552],
sm368=[0,-2,553,-1,0,-4,0,-23,553,553,-2,553,-2,553,-3,553,553,-23,553,553,553,553,553,553,-8,553],
sm369=[0,-2,554,-1,0,-4,0,-23,554,554,-2,554,-2,554,-3,554,554,-23,554,554,554,554,554,554,-8,554],
sm370=[0,-4,0,-4,0,-28,555,-22,556,-8,557,-5,558,559,560],
sm371=[0,-2,349,-1,0,-4,0],
sm372=[0,-4,0,-4,0,-63,351],
sm373=[0,-2,561,-1,0,-4,0,-23,561,561,-2,561,-1,562,561,-3,561,561,-23,561,561,561,561,561,561,-8,561],
sm374=[0,-2,563,-1,0,-4,0,-23,563,563,-2,563,-2,563,-3,563,563,-23,563,563,563,563,563,563,-8,563],
sm375=[0,-2,360,-1,0,-4,0],
sm376=[0,-2,564,-1,0,-4,0,-23,564,564,-2,564,-2,564,-3,564,564,-23,564,564,564,564,564,564,-8,361],
sm377=[0,-2,565,-1,0,-4,0,-23,565,565,-2,565,-2,565,-3,565,565,-23,565,565,565,565,565,565,-8,565],
sm378=[0,-4,0,-4,0,-13,566],
sm379=[0,-4,0,-4,0,-14,567],
sm380=[0,-4,0,-4,0,-14,568],
sm381=[0,-4,0,-4,0,-23,569],
sm382=[0,-1,570,570,-1,0,-4,0,-4,570,570,-7,570,-13,570,-1,570,-5,570,570,-22,570,570,-15,570,570,570,570,-1,570,-1,570,570,570,570,570,-1,570,570,570,570,570,570,570,570,-2,570,570,-5,570,570,-2,570,-23,570,-1,570,570,570,570,570,570,-3,570,570,570,570,570,570],
sm383=[0,-1,571,571,-1,0,-4,0,-4,571,571,-7,571,-13,571,-1,571,-5,571,571,-22,571,571,-15,571,571,571,571,-1,571,571,571,571,571,571,571,-1,571,571,571,571,571,571,571,571,-2,571,571,-5,571,571,-2,571,-23,571,-1,571,571,571,571,571,571,-3,571,571,571,571,571,571],
sm384=[0,-4,0,-4,0,-4,380,-30,80],
sm385=[0,-4,0,-4,0,-36,572],
sm386=[0,-1,33,34,-1,0,-4,0,-4,222,223,-21,573,-1,36,-4,185,378,186,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-3,187,188,43,44,-1,189,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm387=[0,-1,397,397,-1,0,-4,0,-4,397,190,-1,190,-15,190,-3,190,-1,190,-4,190,190,397,-13,190,190,-1,190,-1,190,-3,190,397,190,190,190,190,-1,190,-1,190,-8,397,397,397,-1,397,-1,397,397,397,397,397,-1,397,397,397,397,397,397,-1,397,-2,397,397,-5,397,397,-2,397,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,397,397,397,397,190,190,-3,397,397,397,397,397,397],
sm388=[0,-1,396,396,-1,0,-4,0,-4,396,192,-1,192,-15,192,-3,192,-1,192,-4,192,192,396,-13,192,192,-1,192,-1,192,-3,192,396,192,192,192,192,-1,192,-1,192,-8,396,396,396,-1,396,-1,396,396,396,396,396,-1,396,396,396,396,396,396,-1,396,-2,396,396,-5,396,396,-2,396,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,396,396,396,396,192,192,-3,396,396,396,396,396,396],
sm389=[0,-1,574,574,-1,0,-4,0,-4,574,574,-7,574,-13,574,-1,574,-5,574,574,-22,574,574,-15,574,574,574,574,-1,574,574,574,574,574,574,574,-1,574,574,574,574,574,574,574,574,-2,574,574,-5,574,574,-2,574,-23,574,-1,574,574,574,574,574,574,-3,574,574,574,574,574,574],
sm390=[0,-1,575,575,-1,0,-4,0,-4,575,575,-7,575,-13,575,-1,575,-5,575,575,-22,575,575,-15,575,575,575,575,-1,575,575,575,575,575,575,575,-1,575,575,575,575,575,575,575,575,-2,575,575,-5,575,575,-2,575,-23,575,-1,575,575,575,575,575,575,-3,575,575,575,575,575,575],
sm391=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,-23,38,39,-16,40,-3,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,-6,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm392=[0,-4,0,-4,0,-4,576,-29,577],
sm393=[0,-4,0,-4,0,-4,578,-29,578],
sm394=[0,-4,0,-4,0,-4,579,-29,579,-16,296],
sm395=[0,-4,0,-4,0,-51,296],
sm396=[0,-4,0,-4,0,-85,580],
sm397=[0,-1,33,34,-1,0,-4,0,-4,581,-24,36,-5,37,-23,38,39,-16,40,41,226,-3,582,-3,42,-12,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm398=[0,-4,0,-4,0,-29,583],
sm399=[0,-1,584,584,-1,0,-4,0,-4,584,584,-7,584,-13,584,-1,584,-5,584,584,-22,584,584,-15,584,584,584,584,-1,584,584,584,584,584,584,584,-1,584,584,584,584,584,584,584,584,-2,584,584,-5,584,584,-2,584,-23,584,-1,584,584,584,584,584,584,-3,584,584,584,584,584,584],
sm400=[0,-4,0,-4,0,-4,585],
sm401=[0,-4,0,-4,0,-4,381],
sm402=[0,-1,586,586,-1,0,-4,0,-4,586,586,-7,586,-13,586,-1,586,-5,586,586,-22,586,586,-15,586,586,586,586,-1,586,586,586,586,586,586,586,-1,586,586,586,586,586,586,586,586,-2,586,586,-5,586,586,-2,586,-23,586,-1,586,586,586,586,586,586,-3,586,586,586,586,586,586],
sm403=[0,-4,0,-4,0,-4,587],
sm404=[0,-1,588,588,-1,0,-4,0,-4,588,588,-7,588,-13,588,-1,588,-5,588,588,-22,588,588,-15,588,588,588,588,-1,588,588,588,588,588,588,588,-1,588,588,588,588,588,588,588,588,-2,588,588,-5,588,588,-2,588,-23,588,-1,588,588,588,588,588,588,-3,588,588,588,588,588,588],
sm405=[0,-4,0,-4,0,-4,589],
sm406=[0,-4,0,-4,0,-4,590],
sm407=[0,-4,0,-4,0,-97,591,592],
sm408=[0,-1,593,593,-1,0,-4,0,-4,593,593,-7,593,-13,593,-1,593,-5,593,593,-22,593,593,-15,593,593,593,593,-1,593,593,593,593,593,593,593,-1,593,593,593,593,593,593,593,593,-2,593,593,-5,593,593,-2,593,-23,593,-1,593,593,593,593,593,593,-3,593,593,593,593,593,593],
sm409=[0,-4,0,-4,0,-4,594,-29,595],
sm410=[0,-4,0,-4,0,-4,596,-29,596],
sm411=[0,-4,0,-4,0,-13,597],
sm412=[0,598,-1,598,-1,598,598,598,598,598,598,-4,598,598,-7,598,-3,598,-17,598],
sm413=[0,-4,0,-4,0,-23,599],
sm414=[0,-2,600,-1,600,600,600,600,600,600,-5,600,-7,600,-3,600,-17,600],
sm415=[0,-2,601,-1,601,601,601,601,601,601,-5,601,-7,601,-3,601,-17,601],
sm416=[0,-2,71,-1,602,73,74,75,76,-6,32,-11,245,-17,2,-26,409],
sm417=[0,-2,603,-1,603,603,603,603,603,-6,603,-11,603,-17,603,-26,603],
sm418=[0,-4,604],
sm419=[0,-2,71,-1,605,73,74,75,76,-6,32,-11,245,-5,408,-11,2],
sm420=[0,-2,606,-1,606,606,606,606,606,-6,606,-11,606,-5,606,-11,606],
sm421=[0,-4,607],
sm422=[0,-2,608,-1,609,608,608,608,608,608,-5,608,-7,608,-3,608,-5,608,-11,608,-26,608],
sm423=[0,-2,610,-1,610,610,610,610,610,610,-5,610,-7,610,-3,610,-5,610,-11,610,-26,610],
sm424=[0,-4,0,-4,0,-18,611,612],
sm425=[0,-4,0,-4,0,-23,613],
sm426=[0,-4,0,-4,0,-36,614],
sm427=[0,615,-1,615,-1,615,615,615,615,615,615,-4,615,615,-7,615,-3,615,-17,615],
sm428=[0,-4,0,-4,0,-4,616,616,-1,616,-10,616,616,-3,616,-3,616,616,616,616,-3,616,616,616,-13,616,616,-1,616,-1,616,-3,616,-1,616,616,616,616,-1,616,-1,616,-4,616,-14,616,-22,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,-4,616,616],
sm429=[0,-4,0,-4,0,-30,617],
sm430=[0,-4,0,-4,0,-4,618,618,-1,618,-10,618,618,-3,618,-3,618,618,618,618,-3,618,618,618,-13,618,618,-1,618,-1,618,-3,618,-1,618,618,618,618,-1,618,-1,618,-4,618,-14,618,-22,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,-4,618,618],
sm431=[0,-4,0,-4,0,-4,619,619,-1,619,-10,619,619,-3,619,-3,619,619,619,619,-3,619,619,619,-13,619,619,-1,619,-1,619,-3,619,-1,619,619,619,619,-1,619,-1,619,-4,619,-14,619,-22,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,-4,619,619],
sm432=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-1,271,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm433=[0,-4,0,-4,0,-30,620,-3,620],
sm434=[0,-4,0,-4,0,-4,621,621,-1,621,-10,621,621,-3,621,-3,621,621,621,621,-3,621,621,621,-13,621,621,-1,621,-1,621,-3,621,-1,621,621,621,621,-1,621,-1,621,-4,621,-14,621,-22,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,-4,621,621],
sm435=[0,-4,0,-4,0,-4,622,622,-1,622,-10,622,622,-3,622,-3,622,622,622,622,-3,622,622,622,-13,622,622,-1,622,-1,622,-3,622,-1,622,622,622,622,-1,622,-1,622,-4,622,-14,622,-22,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,-4,622,622],
sm436=[0,-4,0,-4,0,-28,623,-5,623],
sm437=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,-4,286,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm438=[0,-4,0,-4,0,-4,624,624,-1,624,-10,624,624,-3,624,-3,624,624,624,624,-3,624,624,624,-13,624,624,-1,624,-1,624,-3,624,-1,624,624,624,624,-1,624,-1,624,-4,624,-14,624,-22,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,-4,624,624],
sm439=[0,-4,0,-4,0,-34,625,-1,625],
sm440=[0,-4,0,-4,0,-4,626,-23,626,-1,626,-3,626,-1,626],
sm441=[0,-4,0,-4,0,-34,627,-1,627],
sm442=[0,-4,0,-4,0,-30,628],
sm443=[0,-4,0,-4,0,-30,629],
sm444=[0,-4,0,-4,0,-30,630],
sm445=[0,-4,0,-4,0,-29,631,-43,631],
sm446=[0,-4,0,-4,0,-30,632],
sm447=[0,-4,0,-4,0,-35,633],
sm448=[0,-4,0,-4,0,-35,634],
sm449=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,635,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm450=[0,-2,34,-1,0,-4,0,-27,302,-2,636,-4,304,-73,305,-40,58],
sm451=[0,-4,0,-4,0,-28,637,-1,637],
sm452=[0,-4,0,-4,0,-28,638,-1,638,-3,638,-1,638],
sm453=[0,-4,0,-4,0,-28,639,-1,639,-3,639,-1,639],
sm454=[0,-4,0,-4,0,-28,640,-1,640,-3,640,-1,640,-14,640,-3,640,-32,640],
sm455=[0,-4,0,-4,0,-36,641],
sm456=[0,-4,0,-4,0,-34,642,-1,643],
sm457=[0,-4,0,-4,0,-34,644,-1,644],
sm458=[0,-4,0,-4,0,-34,645,-1,645],
sm459=[0,-4,0,-4,0,-73,646],
sm460=[0,-4,0,-4,0,-28,647,-1,647,-3,647,-1,647,-14,647,-3,647,-32,647],
sm461=[0,-2,34,-1,0,-4,0,-27,302,648,-5,286,304,-73,305,-40,58],
sm462=[0,-4,0,-4,0,-28,649],
sm463=[0,-4,0,-4,0,-28,650,-5,651],
sm464=[0,-4,0,-4,0,-28,652,-5,652],
sm465=[0,-4,0,-4,0,-28,653,-5,653],
sm466=[0,-4,0,-4,0,-36,654],
sm467=[0,-1,655,655,-1,0,-4,0,-4,655,655,-1,655,-5,655,-4,655,655,-3,655,-3,655,655,655,655,-3,655,655,655,-13,655,655,-1,655,-1,655,-3,655,655,655,655,655,655,-1,655,-1,655,-4,655,-2,655,655,655,655,-1,655,-1,655,655,655,655,655,655,655,655,655,655,655,655,655,655,-2,655,655,-5,655,655,-2,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,655,-3,655,655,655,655,655,655],
sm468=[0,-1,656,656,-1,0,-4,0,-4,656,656,-1,656,-5,656,-4,656,656,-3,656,-3,656,656,656,656,-3,656,656,656,-13,656,656,-1,656,-1,656,-3,656,656,656,656,656,656,-1,656,-1,656,-4,656,-2,656,656,656,656,-1,656,-1,656,656,656,656,656,656,656,656,656,656,656,656,656,656,-2,656,656,-5,656,656,-2,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,656,-3,656,656,656,656,656,656],
sm469=[0,-1,657,657,-1,0,-4,0,-4,657,-22,657,-8,657,-66,657,657,657,-39,657,657,-3,657],
sm470=[0,-1,658,658,-1,0,-4,0,-4,658,-22,658,-8,658,-66,658,658,658,-39,658,658,-3,658],
sm471=[0,-4,0,-4,0,-4,659,659,-1,659,-10,659,659,-3,659,-3,659,659,659,659,-3,659,659,659,-13,659,659,-1,659,-1,659,-3,659,-1,659,659,659,659,-1,659,-1,659,-4,659,-14,659,-12,659,-9,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,659,-4,659,659],
sm472=[0,-4,0,-4,0,-4,660,660,-1,660,-10,660,660,-3,660,-3,660,660,660,660,-3,660,660,660,-13,660,660,-1,660,-1,660,-3,660,-1,660,660,660,660,-1,660,-1,660,-4,660,-14,660,-12,660,-9,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,660,-4,660,660],
sm473=[0,-4,0,-4,0,-4,661,661,-1,661,-10,661,661,-3,661,-3,661,661,661,661,-3,661,661,661,-13,661,661,-1,661,-1,661,-3,661,-1,661,661,661,661,-1,661,-1,661,-4,661,-14,661,-22,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,661,-4,661,661],
sm474=[0,-4,0,-4,0,-36,662],
sm475=[0,-4,0,-4,0,-36,663],
sm476=[0,-4,0,-4,0,-145,664],
sm477=[0,-4,0,-4,0,-145,665],
sm478=[0,-2,508,-1,509,510,511,512,513,0,-3,514,-141,666,666],
sm479=[0,-2,667,-1,667,667,667,667,667,0,-3,667,-141,667,667],
sm480=[0,-2,668,-1,668,668,668,668,668,0,-3,668,-141,668,668],
sm481=[0,-2,669,-1,669,669,669,669,669,0,-3,669,-141,669,669],
sm482=[0,-4,0,-4,0,-146,670],
sm483=[0,-4,0,-4,0,-12,671],
sm484=[0,-4,0,-4,0,-23,672],
sm485=[0,-4,673,-4,0,-57,523,-87,524,525],
sm486=[0,-2,526,-1,0,-4,0,-4,674,-8,674,-10,674,-2,674,-1,527,-5,674,-1,675,674,-6,528,-2,529,-13,674,674,674,-8,674],
sm487=[0,-4,676,-4,0,-57,676,-87,676,676],
sm488=[0,-2,677,-1,0,-4,0,-4,677,-8,677,-10,677,-2,677,-1,677,-5,677,-1,677,677,-6,677,-2,677,-13,677,677,677,-8,677],
sm489=[0,-4,0,-4,0,-3,678],
sm490=[0,-4,0,-4,0,-3,679],
sm491=[0,-4,0,-4,0,-145,524,525],
sm492=[0,-4,0,-4,0,-34,680,681],
sm493=[0,-2,682,-1,0,-4,0,-4,682,-8,682,-10,682,-2,682,-6,682,682,-2,682,-23,682,682,682,-8,682],
sm494=[0,-2,683,-1,0,-4,0,-4,683,-8,683,-10,683,-2,683,-6,683,683,-2,683,-23,683,683,683,-8,683],
sm495=[0,-2,684,-1,0,-4,0],
sm496=[0,-2,683,-1,0,-4,0,-4,683,-8,683,-10,683,-2,683,-6,683,683,-2,683,-4,685,-18,683,683,683,-8,683],
sm497=[0,-2,686,-1,0,-4,0,-4,686,-8,686,-10,686,-2,686,-2,686,-3,686,686,-2,686,-23,686,686,686,-8,686],
sm498=[0,-2,687,-1,0,-4,0,-4,687,-8,687,-10,687,-2,687,-2,687,-3,687,687,-2,687,-23,687,687,687,-8,687],
sm499=[0,-2,687,-1,0,-4,0,-4,687,-8,687,-10,687,-2,687,-2,687,-3,687,687,-2,687,-4,688,689,-17,687,687,687,-8,687],
sm500=[0,-2,531,-1,0,-4,0,-29,527],
sm501=[0,-1,690,691,-1,0,-4,0,-29,527,-15,692],
sm502=[0,-2,693,-1,0,-4,0,-4,693,-8,693,-10,693,-2,693,-2,693,-3,693,693,-2,693,-4,693,693,-17,693,693,693,-8,693],
sm503=[0,-2,694,-1,0,-4,0,-4,694,-8,694,-10,694,-2,694,-1,695,-4,694,694,-2,694,-4,694,-18,694,694,694,-8,694],
sm504=[0,-2,696,-1,0,-4,0],
sm505=[0,-4,0,-4,0,-35,697],
sm506=[0,-4,0,-4,0,-35,698],
sm507=[0,-4,0,-4,0,-35,699],
sm508=[0,-2,531,-1,0,-1,532,-2,0,-29,533],
sm509=[0,-4,0,-4,0,-30,700,-4,700,-7,701,702],
sm510=[0,-2,703,-1,0,-1,532,-2,0,-29,533,-15,534],
sm511=[0,-4,0,-4,0,-30,704,-4,704,-7,704,704],
sm512=[0,-4,0,-4,0,-30,705,-4,705,-7,705,705],
sm513=[0,-4,0,-4,0,-29,706],
sm514=[0,-4,0,-4,0,-29,695],
sm515=[0,-2,339,-1,0,-4,0,-4,707,-31,708,-1,216],
sm516=[0,-4,0,-4,0,-34,709,709],
sm517=[0,-4,0,-4,0,-36,710],
sm518=[0,-2,711,-1,0,-4,0,-13,711,-10,711,-2,711,-7,711,711,-1,711,-23,711,711,711,-8,711],
sm519=[0,-2,712,-1,0,-4,0,-4,712,-31,712,-1,712],
sm520=[0,-2,713,-1,0,-4,0,-4,714,-31,713,-1,713],
sm521=[0,-2,715,-1,0,-4,0,-4,715,-31,715,-1,715],
sm522=[0,-2,716,-1,0,-4,0,-4,716,-31,716,-1,716],
sm523=[0,-2,339,-1,0,-4,0,-4,717,-31,717,-1,717],
sm524=[0,-4,718,-4,0,-3,719,-25,720],
sm525=[0,-2,721,-1,0,-4,0,-23,721,721,-2,721,-2,721,-3,721,721,-23,721,721,721,721,721,721,-8,721],
sm526=[0,-2,722,-1,0,-4,0,-23,722,722,-2,722,-2,722,-3,722,722,-23,722,722,722,722,722,722,-8,722],
sm527=[0,-2,723,-1,0,-4,0,-23,723,723,-2,723,-2,723,-3,723,723,-23,723,723,723,723,723,723,-8,347],
sm528=[0,-2,724,-1,0,-4,0,-23,724,724,-2,724,-2,724,-3,724,724,-23,724,724,724,724,724,724,-8,724],
sm529=[0,-2,725,726,0,-4,0],
sm530=[0,-4,0,-4,0,-51,727],
sm531=[0,-2,728,728,0,-4,0],
sm532=[0,-2,729,-1,0,-4,0,-23,729,729,-2,729,-2,729,-3,729,729,-23,729,729,729,729,729,729,-8,729],
sm533=[0,-2,730,-1,0,-4,0,-23,730,730,-2,730,-2,730,-3,730,730,-23,730,730,730,730,730,730,-8,730],
sm534=[0,-4,0,-4,0,-14,731],
sm535=[0,-4,0,-4,0,-23,732],
sm536=[0,-4,0,-4,0,-23,733],
sm537=[0,734,-1,734,-1,734,734,734,734,734,734,-4,734,734,-7,734,-3,734,-17,734],
sm538=[0,-1,735,735,-1,0,-4,0,-4,735,735,-7,735,-13,735,-1,735,-5,735,735,-22,735,735,-15,735,735,735,735,-1,735,735,735,735,735,735,735,-1,735,735,735,735,735,735,735,735,735,735,735,735,-5,735,735,-2,735,-23,735,-1,735,735,735,735,735,735,-3,735,735,735,735,735,735],
sm539=[0,-4,0,-4,0,-4,151,151,-1,151,-15,151,-3,151,-1,151,-4,151,151,295,-13,151,296,-1,151,-1,151,-3,151,-1,151,151,151,151,-1,151,-1,151,-42,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,-4,151,151],
sm540=[0,-4,0,-4,0,-4,161,161,-1,161,-15,161,-3,161,-1,161,-4,161,161,-14,161,161,-1,161,-1,161,-3,161,-1,161,161,161,161,-1,161,-1,161,-4,299,-37,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-4,161,161],
sm541=[0,-1,736,736,-1,0,-4,0,-4,736,736,-7,736,-13,736,-1,736,-5,736,736,-22,736,736,-15,736,736,736,736,-1,736,736,736,736,736,736,736,-1,736,736,736,736,736,736,736,736,-2,736,736,-5,736,736,-2,736,-23,736,-1,736,736,736,736,736,736,-3,736,736,736,736,736,736],
sm542=[0,-1,737,737,-1,0,-4,0,-4,737,737,-7,737,-13,737,-1,737,-5,737,737,-22,737,737,-15,737,737,737,737,-1,737,737,737,737,737,737,737,-1,737,737,737,737,737,737,737,737,-2,737,737,-5,737,737,-2,737,-23,737,-1,737,737,737,737,737,737,-3,737,737,737,737,737,737],
sm543=[0,-1,738,738,-1,0,-4,0,-4,738,738,-7,738,-13,738,-1,738,-5,738,738,-22,738,738,-15,738,738,738,738,-1,738,738,738,738,738,738,738,-1,738,738,738,738,738,738,738,738,-2,738,738,-5,738,738,-2,738,-23,738,-1,738,738,738,738,738,738,-3,738,738,738,738,738,738],
sm544=[0,-4,0,-4,0,-4,739,-29,739],
sm545=[0,-4,0,-4,0,-30,740],
sm546=[0,-4,0,-4,0,-29,741],
sm547=[0,-4,0,-4,0,-30,742],
sm548=[0,-4,0,-4,0,-4,743],
sm549=[0,-1,33,34,-1,0,-4,0,-4,744,-22,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm550=[0,-4,0,-4,0,-55,745],
sm551=[0,-1,33,34,-1,0,-4,0,-4,746,-22,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm552=[0,-4,0,-4,0,-88,747],
sm553=[0,-4,0,-4,0,-4,748],
sm554=[0,-4,0,-4,0,-4,86,86,-1,86,-15,86,-10,86,-15,86,87,-1,86,-1,86,-3,86,-1,86,86,86,-2,88,-1,89,-19,749,-22,90,91,92,93,94,95,96,97,98,99,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,-4,100,101],
sm555=[0,-4,0,-4,0,-55,750,-32,749],
sm556=[0,-1,33,34,-1,0,-4,0,-29,36,-5,37,-41,40,41,226,-3,751,-16,240,-5,43,44,-2,45,-34,53,54,55,56,57,58],
sm557=[0,-4,0,-4,0,-30,752],
sm558=[0,-1,753,753,-1,0,-4,0,-4,753,753,-7,753,-13,753,-1,753,-5,753,753,-22,753,753,-15,753,753,753,753,-1,753,753,753,753,753,753,753,-1,753,753,753,753,753,753,753,753,-2,753,753,-5,753,753,-2,753,-23,753,-1,753,753,753,753,753,753,-3,753,753,753,753,753,753],
sm559=[0,-1,754,754,-1,0,-4,0,-4,754,754,-7,754,-13,754,-1,754,-5,754,754,-22,754,754,-15,754,754,754,754,-1,754,754,754,754,754,754,754,-1,754,754,754,754,754,754,754,754,-2,754,754,-5,754,754,-2,754,-23,754,-1,754,754,754,754,754,754,-3,754,754,754,754,754,754],
sm560=[0,-1,755,755,-1,0,-4,0,-4,755,755,-7,755,-13,755,-1,755,-5,755,755,-22,755,755,-15,755,755,755,755,-1,755,755,755,755,755,755,755,-1,755,755,755,755,755,755,755,755,-2,755,755,-5,755,755,-2,755,-23,755,-1,755,755,755,755,755,755,-3,755,755,755,755,755,755],
sm561=[0,-4,0,-4,0,-30,756],
sm562=[0,-1,757,757,-1,0,-4,0,-4,757,757,-7,757,-13,757,-1,757,-5,757,757,-22,757,757,-15,757,757,757,757,-1,757,757,757,757,757,757,757,-1,757,757,757,757,757,757,757,757,-2,757,757,-5,757,757,-2,757,-23,757,-1,757,757,757,757,757,757,-3,757,757,757,757,757,757],
sm563=[0,-1,758,758,-1,0,-4,0,-4,758,758,-7,758,-13,758,-1,758,-5,758,758,-22,758,758,-15,758,758,758,758,-1,758,758,758,758,758,758,758,-1,758,758,758,758,758,758,758,758,-1,592,758,758,-5,758,758,-2,758,-23,758,-1,758,758,758,758,758,758,-3,758,758,758,758,758,758],
sm564=[0,-1,759,759,-1,0,-4,0,-4,759,759,-7,759,-13,759,-1,759,-5,759,759,-22,759,759,-15,759,759,759,759,-1,759,759,759,759,759,759,759,-1,759,759,759,759,759,759,759,759,-2,759,759,-5,759,759,-2,759,-23,759,-1,759,759,759,759,759,759,-3,759,759,759,759,759,759],
sm565=[0,-4,0,-4,0,-29,760],
sm566=[0,-1,761,761,-1,0,-4,0,-4,761,761,-7,761,-13,761,-1,761,-5,761,761,-22,761,761,-15,761,761,761,761,-1,761,-1,761,761,761,761,761,-1,761,761,761,761,761,761,761,761,-2,761,761,-5,761,761,-2,761,-23,761,-1,761,761,761,761,761,761,-3,761,761,761,761,761,761],
sm567=[0,-4,0,-4,0,-4,762,-29,762],
sm568=[0,-4,0,-4,0,-23,763],
sm569=[0,-4,0,-4,0,-23,764],
sm570=[0,-2,71,-1,765,73,74,75,76,-6,32,-11,245,-17,2],
sm571=[0,-2,71,-1,72,73,74,75,76,766,-5,32,-7,766,-3,245,-17,2],
sm572=[0,-2,767,-1,767,767,767,767,767,-6,767,-11,767,-17,767,-26,767],
sm573=[0,-2,254,-1,254,254,254,254,254,254,-5,254,-7,254,-3,254,-17,254],
sm574=[0,-2,768,-1,768,768,768,768,768,768,-5,768,-7,768,-3,768,-17,768],
sm575=[0,-2,769,-1,769,769,769,769,769,769,-5,769,-7,769,-3,769,-17,769],
sm576=[0,-2,770,-1,770,770,770,770,770,-6,770,-11,770,-17,770,-26,770],
sm577=[0,-2,71,-1,771,73,74,75,76,-6,32,-11,245,-17,2],
sm578=[0,-2,71,-1,72,73,74,75,76,772,-5,32,-7,772,-3,245,-17,2],
sm579=[0,-2,773,-1,773,773,773,773,773,-6,773,-11,773,-5,773,-11,773],
sm580=[0,-2,774,-1,774,774,774,774,774,774,-5,774,-7,774,-3,774,-17,774],
sm581=[0,-2,775,-1,775,775,775,775,775,775,-5,775,-7,775,-3,775,-17,775],
sm582=[0,-2,776,-1,776,776,776,776,776,-6,776,-11,776,-5,776,-11,776],
sm583=[0,-2,777,-1,777,777,777,777,777,777,-5,777,-7,777,-3,777,-5,777,-11,777,-26,777],
sm584=[0,-2,778,-1,778,778,778,778,778,778,-5,778,-1,778,-5,778,-3,778,-5,778,-11,778,-109,778,778],
sm585=[0,-4,0,-4,0,-23,779],
sm586=[0,780,-1,780,-1,780,780,780,780,780,780,-4,780,780,-7,780,-3,780,-17,780],
sm587=[0,781,-1,781,-1,781,781,781,781,781,781,-4,781,781,-7,781,-3,781,-17,781],
sm588=[0,-4,0,-4,0,-4,782,-13,782,782,-8,782,-1,782,-3,782,782,782,-36,782],
sm589=[0,-4,0,-4,0,-4,783,783,-1,783,-10,783,783,-3,783,-3,783,783,783,783,-3,783,783,783,-13,783,783,-1,783,-1,783,-3,783,-1,783,783,783,783,-1,783,-1,783,-4,783,-14,783,-22,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,-4,783,783],
sm590=[0,-4,0,-4,0,-30,784,-3,784],
sm591=[0,-4,0,-4,0,-28,785,-5,785],
sm592=[0,-4,0,-4,0,-35,786],
sm593=[0,-4,0,-4,0,-35,787],
sm594=[0,-4,0,-4,0,-30,788],
sm595=[0,-4,0,-4,0,-30,789],
sm596=[0,-4,0,-4,0,-35,790],
sm597=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,791,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm598=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,792,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm599=[0,-4,0,-4,0,-36,793],
sm600=[0,-1,794,794,-1,0,-4,0,-4,794,794,-1,794,-5,794,-4,794,794,-3,794,-3,794,794,794,794,-3,794,794,794,-13,794,794,-1,794,-1,794,-3,794,794,794,794,794,794,-1,794,-1,794,-4,794,-2,794,794,794,794,-1,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,-2,794,794,-5,794,794,-2,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,794,-3,794,794,794,794,794,794],
sm601=[0,-4,0,-4,0,-36,795],
sm602=[0,-4,0,-4,0,-30,796],
sm603=[0,-4,0,-4,0,-30,797,-3,797],
sm604=[0,-4,0,-4,0,-28,798,-1,798,-3,798,-1,798,-14,798,-3,798,-32,798],
sm605=[0,-1,33,34,-1,0,-4,0,-27,184,-8,799,-72,486,-35,53,54,-3,58],
sm606=[0,-4,0,-4,0,-36,800],
sm607=[0,-4,0,-4,0,-28,801],
sm608=[0,-4,0,-4,0,-28,802,-1,802,-3,802,-1,802,-14,802,-3,802,-32,802],
sm609=[0,-4,0,-4,0,-28,803,-5,803],
sm610=[0,-2,34,-1,0,-4,0,-27,302,804,-5,182,304,-73,305,-40,58],
sm611=[0,-1,805,805,-1,0,-4,0,-4,805,805,-1,805,-5,805,-4,805,805,-3,805,-3,805,805,805,805,-3,805,805,805,-13,805,805,-1,805,-1,805,-3,805,805,805,805,805,805,-1,805,-1,805,-4,805,-2,805,805,805,805,-1,805,-1,805,805,805,805,805,805,805,805,805,805,805,805,805,805,-2,805,805,-5,805,805,-2,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,-3,805,805,805,805,805,805],
sm612=[0,-4,0,-4,0,-30,806],
sm613=[0,-4,0,-4,0,-30,807],
sm614=[0,-4,0,-4,0,-4,808,-13,808,808,-8,808,-1,808,-3,808,808,808,-36,808],
sm615=[0,-2,809,-1,0,-4,0,-7,809,-15,809,-121,809,809],
sm616=[0,-2,810,-1,0,-4,0,-7,810,-15,810,-121,810,810],
sm617=[0,-2,811,-1,811,811,811,811,811,0,-3,811,-141,811,811],
sm618=[0,-4,0,-4,0,-23,812],
sm619=[0,813,-1,813,-1,813,813,813,813,813,813,-4,813,813,-7,813,-3,813,-17,813],
sm620=[0,-2,526,-1,0,-4,0,-4,814,-8,814,-10,814,-2,814,-1,527,-5,814,-1,675,814,-6,528,-2,529,-13,814,814,814,-8,814],
sm621=[0,-4,815,-4,0,-57,815,-87,815,815],
sm622=[0,-2,526,-1,0,-4,0,-4,814,-8,814,-10,814,-2,814,-1,527,-5,814,-2,814,-6,528,-2,529,-13,814,814,814,-8,814],
sm623=[0,-2,814,-1,0,-4,0,-4,814,-8,814,-10,814,-2,814,-6,680,814,-2,814,-23,814,814,814,-8,814],
sm624=[0,-4,0,-4,0,-29,816],
sm625=[0,-4,0,-4,0,-3,678,-141,817],
sm626=[0,-4,0,-4,0,-3,818,-141,818],
sm627=[0,-4,0,-4,0,-3,819,-141,819],
sm628=[0,-4,0,-4,0,-3,679,-142,820],
sm629=[0,-4,0,-4,0,-3,821,-142,821],
sm630=[0,-4,0,-4,0,-3,822,-142,822],
sm631=[0,-2,823,-1,0,-4,0,-4,823,-8,823,-10,823,-2,823,-1,823,-5,823,-1,823,823,-6,823,-2,823,-13,823,823,823,-8,823],
sm632=[0,-2,824,-1,0,-4,0,-4,824,-8,824,-10,824,-2,824,-1,824,-5,824,-1,824,824,-6,824,-2,824,-13,824,824,824,-8,824],
sm633=[0,-2,211,-1,0,-4,0,-24,213,-2,214,-7,215,825,-25,217,218,219,-8,220],
sm634=[0,-2,826,-1,0,-4,0,-4,826,-8,826,-10,826,-2,826,-6,826,826,-2,826,-4,685,-18,826,826,826,-8,826],
sm635=[0,-2,694,-1,0,-4,0,-4,694,-8,694,-10,694,-2,694,-6,694,694,-2,694,-4,694,-18,694,694,694,-8,694],
sm636=[0,-2,826,-1,0,-4,0,-4,826,-8,826,-10,826,-2,826,-6,826,826,-2,826,-23,826,826,826,-8,826],
sm637=[0,-2,531,-1,0,-4,0,-29,527,-15,692],
sm638=[0,-2,827,-1,0,-4,0,-4,827,-8,827,-10,827,-2,827,-2,827,-3,827,827,-2,827,-4,688,-18,827,827,827,-8,827],
sm639=[0,-2,828,-1,0,-4,0,-4,828,-8,828,-10,828,-2,828,-2,828,-3,828,828,-2,828,-5,689,-17,828,828,828,-8,828],
sm640=[0,-2,829,-1,0,-4,0,-4,829,-8,829,-10,829,-2,829,-2,829,-3,829,829,-2,829,-4,829,-18,829,829,829,-8,829],
sm641=[0,-2,830,-1,0,-4,0,-4,830,-8,830,-10,830,-2,830,-2,830,-3,830,830,-2,830,-5,830,-17,830,830,830,-8,830],
sm642=[0,-2,831,-1,0,-4,0,-4,831,-8,831,-10,831,-2,831,-2,831,-3,831,831,-2,831,-23,831,831,831,-8,831],
sm643=[0,-4,0,-4,0,-30,832],
sm644=[0,-4,0,-4,0,-30,833],
sm645=[0,-4,834,-4,0,-3,835,-1,836,-17,836,-5,695,837,-19,836,836,-21,836],
sm646=[0,-4,0,-4,0,-30,838],
sm647=[0,-4,0,-4,0,-5,839,-17,840,-26,841,842,-21,843],
sm648=[0,-4,0,-4,0,-5,844,-17,845,-26,846,847],
sm649=[0,-4,0,-4,0,-5,848,-1,849,-15,848,-6,848,-19,848,848,-2,850,851,852],
sm650=[0,-4,0,-4,0,-5,848,-17,848,-6,848,-19,848,848],
sm651=[0,-4,853,-4,0,-3,854,-26,855],
sm652=[0,-1,856,-2,0,-4,0,-41,857,858],
sm653=[0,-4,0,-4,0,-30,859,-4,859],
sm654=[0,-4,0,-4,0,-30,859,-4,859,-7,701],
sm655=[0,-4,0,-4,0,-30,859,-4,859,-8,702],
sm656=[0,-4,0,-4,0,-30,860,-4,860,-7,860],
sm657=[0,-4,0,-4,0,-30,861,-4,861,-8,861],
sm658=[0,-4,0,-4,0,-30,862],
sm659=[0,-4,0,-4,0,-30,863],
sm660=[0,-4,834,-4,0,-3,835,-25,695,837,-42,542],
sm661=[0,-4,0,-4,0,-36,864],
sm662=[0,-2,865,-1,0,-4,0,-13,865,-10,865,-2,865,-7,865,865,-1,865,-23,865,865,865,-8,865],
sm663=[0,-2,339,-1,0,-4,0,-4,866,-31,866,-1,866],
sm664=[0,-2,867,-1,0,-4,0,-4,867,-31,867,-1,867],
sm665=[0,-2,868,-1,718,-4,0,-3,719,868,-24,720,868,-5,868,-1,868,-100,869],
sm666=[0,-2,870,-1,718,-4,0,-3,719,870,-24,870,870,-5,870,-1,870,-100,870],
sm667=[0,-2,871,-1,871,-4,0,-3,871,871,-24,871,871,-5,871,-1,871,-100,871],
sm668=[0,-2,872,-1,872,-4,0,-3,872,872,-24,872,872,-5,872,-1,872,-100,872],
sm669=[0,-4,0,-4,0,-28,873,-40,874,875],
sm670=[0,-4,0,-4,0,-28,876,-40,876,876],
sm671=[0,-2,877,877,0,-4,0],
sm672=[0,-4,0,-4,0,-30,878],
sm673=[0,-4,0,-4,0,-23,879],
sm674=[0,880,-1,880,-1,880,880,880,880,880,880,-4,880,880,-7,880,-3,880,-17,880],
sm675=[0,-4,0,-4,0,-28,473,-5,288],
sm676=[0,-4,0,-4,0,-4,881,-29,881],
sm677=[0,-1,33,34,-1,0,-4,0,-4,882,-22,35,-1,36,-5,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm678=[0,-4,0,-4,0,-4,883],
sm679=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,884,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm680=[0,-4,0,-4,0,-4,885],
sm681=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,886,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm682=[0,-4,0,-4,0,-4,887,-29,577],
sm683=[0,-4,0,-4,0,-55,888,-32,889],
sm684=[0,-4,0,-4,0,-4,579,-29,579,-16,296,-3,890,-32,890],
sm685=[0,-4,0,-4,0,-51,296,-3,890,-32,890],
sm686=[0,-4,0,-4,0,-55,891,-32,891],
sm687=[0,-4,0,-4,0,-88,892],
sm688=[0,-4,0,-4,0,-88,749],
sm689=[0,-4,0,-4,0,-35,893],
sm690=[0,-1,894,894,-1,0,-4,0,-4,894,894,-7,894,-13,894,-1,894,-5,894,894,-22,894,894,-15,894,894,894,894,-1,894,894,894,894,894,894,894,-1,894,894,894,894,894,894,894,894,-2,894,894,-5,894,894,-2,894,-23,894,-1,894,894,894,894,894,894,-3,894,894,894,894,894,894],
sm691=[0,-1,895,895,-1,0,-4,0,-4,895,895,-7,895,-13,895,-1,895,-5,895,895,-22,895,895,-15,895,895,895,895,-1,895,895,895,895,895,895,895,-1,895,895,895,895,895,895,895,895,-2,895,895,-5,895,895,-2,895,-23,895,-1,895,895,895,895,895,895,-3,895,895,895,895,895,895],
sm692=[0,-4,0,-4,0,-4,896,-29,896],
sm693=[0,-4,0,-4,0,-23,897],
sm694=[0,-2,71,-1,72,73,74,75,76,898,-5,32,-7,898,-3,245,-17,2],
sm695=[0,-2,899,-1,899,899,899,899,899,899,-5,899,-7,899,-3,899,-17,899],
sm696=[0,-2,71,-1,72,73,74,75,76,900,-5,32,-7,900,-3,245,-17,2],
sm697=[0,-2,901,-1,901,901,901,901,901,901,-5,901,-7,901,-3,901,-17,901],
sm698=[0,-4,0,-4,0,-18,902],
sm699=[0,903,-1,903,-1,903,903,903,903,903,903,-4,903,903,-7,903,-3,903,-17,903],
sm700=[0,-4,0,-4,0,-35,904],
sm701=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,905,-22,38,39,-16,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,-1,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm702=[0,-4,0,-4,0,-36,906],
sm703=[0,-1,907,907,-1,0,-4,0,-4,907,907,-1,907,-5,907,-4,907,907,-3,907,-3,907,907,907,907,-3,907,907,907,-13,907,907,-1,907,-1,907,-3,907,907,907,907,907,907,-1,907,-1,907,-4,907,-2,907,907,907,907,-1,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,-2,907,907,-5,907,907,-2,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,907,-3,907,907,907,907,907,907],
sm704=[0,-4,0,-4,0,-36,908],
sm705=[0,-1,909,909,-1,0,-4,0,-4,909,909,-1,909,-5,909,-4,909,909,-3,909,-3,909,909,909,909,-3,909,909,909,-13,909,909,-1,909,-1,909,-3,909,909,909,909,909,909,-1,909,-1,909,-4,909,-2,909,909,909,909,-1,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,-2,909,909,-5,909,909,-2,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,909,-3,909,909,909,909,909,909],
sm706=[0,-1,910,910,-1,0,-4,0,-4,910,910,-1,910,-5,910,-4,910,910,-3,910,-3,910,910,910,910,-3,910,910,910,-13,910,910,-1,910,-1,910,-3,910,910,910,910,910,910,-1,910,-1,910,-4,910,-2,910,910,910,910,-1,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,-2,910,910,-5,910,910,-2,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,910,-3,910,910,910,910,910,910],
sm707=[0,-4,0,-4,0,-36,911],
sm708=[0,-4,0,-4,0,-28,912,-1,912,-3,912,-1,912,-14,912,-3,912,-32,912],
sm709=[0,-4,0,-4,0,-34,913,-1,913],
sm710=[0,-4,0,-4,0,-34,914,-1,914],
sm711=[0,-4,0,-4,0,-28,915,-1,915,-3,915,-1,915,-14,915,-3,915,-32,915],
sm712=[0,-2,34,-1,0,-4,0,-27,302,916,-5,286,304,-73,305,-40,58],
sm713=[0,-4,0,-4,0,-28,917],
sm714=[0,-4,0,-4,0,-28,918,-5,918],
sm715=[0,-4,0,-4,0,-4,919,919,-1,919,-10,919,919,-3,919,-3,919,919,919,919,-3,919,919,919,-13,919,919,-1,919,-1,919,-3,919,-1,919,919,919,919,-1,919,-1,919,-4,919,-14,919,-12,919,-9,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,919,-4,919,919],
sm716=[0,920,-1,920,-1,920,920,920,920,920,920,-4,920,920,-7,920,-3,920,-17,920],
sm717=[0,-2,526,-1,0,-4,0,-4,921,-8,921,-10,921,-2,921,-1,527,-5,921,-2,921,-6,528,-2,529,-13,921,921,921,-8,921],
sm718=[0,-2,921,-1,0,-4,0,-4,921,-8,921,-10,921,-2,921,-6,680,921,-2,921,-23,921,921,921,-8,921],
sm719=[0,-2,922,-1,0,-1,532,-2,0,-29,533,-15,534],
sm720=[0,-2,923,-1,0,-4,0,-4,923,-8,923,-10,923,-2,923,-1,923,-5,923,-1,923,923,-6,923,-2,923,-13,923,923,923,-8,923],
sm721=[0,-4,0,-4,0,-3,924,-141,924],
sm722=[0,-4,0,-4,0,-3,925,-142,925],
sm723=[0,-4,0,-4,0,-36,926],
sm724=[0,-2,211,-1,0,-4,0,-24,213,-2,214,-7,215,927,-25,217,218,219,-8,220],
sm725=[0,-2,928,-1,0,-4,0,-24,928,-2,928,-7,928,928,-25,928,928,928,-8,928],
sm726=[0,-2,929,-1,0,-4,0,-4,929,-8,929,-10,929,-2,929,-6,929,929,-2,929,-23,929,929,929,-8,929],
sm727=[0,-2,930,-1,0,-4,0,-4,930,-8,930,-10,930,-2,930,-6,930,930,-2,930,-23,930,930,930,-8,930],
sm728=[0,-2,931,-1,0,-4,0,-4,931,-8,931,-10,931,-2,931,-6,931,931,-2,931,-23,931,931,931,-8,931],
sm729=[0,-2,687,-1,0,-4,0,-4,687,-8,687,-10,687,-2,687,-6,687,687,-2,687,-4,688,-18,687,687,687,-8,687],
sm730=[0,-2,932,-1,0,-4,0,-4,932,-8,932,-10,932,-2,932,-2,932,-3,932,932,-2,932,-4,932,-18,932,932,932,-8,932],
sm731=[0,-2,933,-1,0,-4,0,-4,933,-8,933,-10,933,-2,933,-2,933,-3,933,933,-2,933,-5,933,-17,933,933,933,-8,933],
sm732=[0,-2,934,-1,0,-4,0,-4,934,-8,934,-10,934,-2,934,-2,934,-3,934,934,-2,934,-4,934,-18,934,934,934,-8,934],
sm733=[0,-2,935,-1,0,-4,0,-4,935,-8,935,-10,935,-2,935,-2,935,-3,935,935,-2,935,-5,935,-17,935,935,935,-8,935],
sm734=[0,-2,936,-1,0,-4,0,-4,936,-8,936,-10,936,-2,936,-2,936,-3,936,936,-2,936,-4,936,936,-17,936,936,936,-8,936],
sm735=[0,-2,937,-1,0,-4,0,-4,937,-8,937,-10,937,-2,937,-2,937,-3,937,937,-2,937,-4,937,937,-17,937,937,937,-8,937],
sm736=[0,-4,834,-4,0,-3,835,-26,938],
sm737=[0,-2,939,-1,0,-4,0,-4,939,-8,939,-10,939,-2,939,-2,939,-3,939,939,-2,939,-4,939,939,-17,939,939,939,-8,939],
sm738=[0,-4,940,-4,0,-3,940,-26,940],
sm739=[0,-4,941,-4,0,-3,941,-26,941],
sm740=[0,-1,690,942,-1,0,-4,0],
sm741=[0,-1,943,943,-1,0,-4,0],
sm742=[0,-1,943,943,-1,0,-4,0,-51,944],
sm743=[0,-2,942,-1,0,-4,0],
sm744=[0,-2,945,-1,0,-4,0],
sm745=[0,-2,946,-1,0,-4,0],
sm746=[0,-2,947,-1,0,-4,0],
sm747=[0,-2,947,-1,0,-4,0,-51,948],
sm748=[0,-4,0,-4,0,-5,949,-17,949,-6,949,-19,949,949],
sm749=[0,-1,950,-2,0,-4,0],
sm750=[0,-4,0,-4,0,-5,951,-17,951,-6,951,-19,951,951],
sm751=[0,-4,853,-4,0,-3,854,-26,952],
sm752=[0,-4,953,-4,0,-3,953,-26,953],
sm753=[0,-4,954,-4,0,-3,954,-26,954],
sm754=[0,-1,856,-2,0,-4,0,-36,955,-4,857,858],
sm755=[0,-1,956,-2,0,-4,0,-36,956,-4,956,956],
sm756=[0,-4,0,-4,0,-34,957,958],
sm757=[0,-4,0,-4,0,-34,959,959],
sm758=[0,-4,0,-4,0,-34,960,960],
sm759=[0,-4,0,-4,0,-53,961],
sm760=[0,-4,0,-4,0,-36,962],
sm761=[0,-4,0,-4,0,-30,963,-4,963,-7,963],
sm762=[0,-4,0,-4,0,-30,964,-4,964,-8,964],
sm763=[0,-4,0,-4,0,-30,965,-4,965,-7,965],
sm764=[0,-4,0,-4,0,-30,966,-4,966,-8,966],
sm765=[0,-4,0,-4,0,-30,967,-4,967,-7,967,967],
sm766=[0,-4,0,-4,0,-30,968,-4,968,-7,968,968],
sm767=[0,-4,0,-4,0,-30,969],
sm768=[0,-2,970,-1,0,-4,0,-13,970,-10,970,-2,970,-7,970,970,-1,970,-23,970,970,970,-8,970],
sm769=[0,-2,971,-1,0,-4,0,-4,971,-31,971,-1,971],
sm770=[0,-2,972,-1,0,-4,0,-4,972,-25,972,-5,972,-1,972],
sm771=[0,-2,973,-1,718,-4,0,-3,719,973,-24,720,973,-5,973,-1,973,-100,973],
sm772=[0,-4,0,-4,0,-72,974],
sm773=[0,-2,975,-1,975,-4,0,-3,975,975,-24,975,975,-5,975,-1,975,-100,975],
sm774=[0,-4,718,-4,0,-3,719,-25,720,976],
sm775=[0,-4,0,-4,0,-28,977],
sm776=[0,-2,978,-1,0,-4,0,-23,978,978,-2,978,-2,978,-3,978,978,-23,978,978,978,978,978,978,-8,978],
sm777=[0,-4,0,-4,0,-28,979],
sm778=[0,-2,980,-1,0,-4,0,-23,980,980,-2,980,-2,980,-3,980,980,-23,980,980,980,980,980,980,-8,980],
sm779=[0,-1,981,981,-1,0,-4,0,-4,981,981,-7,981,-13,981,-1,981,-5,981,981,-22,981,981,-15,981,981,981,981,-1,981,982,981,981,981,981,981,-1,981,981,981,981,981,981,981,981,-2,981,981,-5,981,981,-2,981,-23,981,-1,981,981,981,981,981,981,-3,981,981,981,981,981,981],
sm780=[0,-4,0,-4,0,-30,983],
sm781=[0,-1,984,984,-1,0,-4,0,-4,984,984,-7,984,-13,984,-1,984,-5,984,984,-22,984,984,-15,984,984,984,984,-1,984,984,984,984,984,984,984,-1,984,984,984,984,984,984,984,984,-2,984,984,-5,984,984,-2,984,-23,984,-1,984,984,984,984,984,984,-3,984,984,984,984,984,984],
sm782=[0,-4,0,-4,0,-4,985],
sm783=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,986,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm784=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,987,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm785=[0,-4,0,-4,0,-30,988],
sm786=[0,-4,0,-4,0,-30,989],
sm787=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,990,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm788=[0,-4,0,-4,0,-30,991],
sm789=[0,-4,0,-4,0,-30,992],
sm790=[0,-4,0,-4,0,-88,889],
sm791=[0,-4,0,-4,0,-88,890],
sm792=[0,-1,993,993,-1,0,-4,0,-4,993,993,-7,993,-13,993,-1,993,-5,993,993,-22,993,993,-15,993,993,993,993,-1,993,993,993,993,993,993,993,-1,993,993,993,993,993,993,993,993,-2,993,993,-5,993,993,-2,993,-23,993,-1,993,993,993,993,993,993,-3,993,993,993,993,993,993],
sm793=[0,-4,0,-4,0,-36,994,-39,995,-18,996],
sm794=[0,-1,997,997,-1,0,-4,0,-4,997,997,-7,997,-13,997,-1,997,-5,997,997,-22,997,997,-15,997,997,997,997,-1,997,997,997,997,997,997,997,-1,997,997,997,997,997,997,997,997,-2,997,997,-5,997,997,-2,997,-23,997,-1,997,997,997,997,997,997,-3,997,997,997,997,997,997],
sm795=[0,-4,0,-4,0,-30,998],
sm796=[0,-4,0,-4,0,-30,999],
sm797=[0,-2,1000,-1,1000,1000,1000,1000,1000,1000,-5,1000,-1,1000,-5,1000,-3,1000,-5,1000,-11,1000,-109,1000,1000],
sm798=[0,-4,0,-4,0,-36,1001],
sm799=[0,-4,0,-4,0,-36,1002],
sm800=[0,-4,0,-4,0,-36,1003],
sm801=[0,-1,1004,1004,-1,0,-4,0,-4,1004,1004,-1,1004,-5,1004,-4,1004,1004,-3,1004,-3,1004,1004,1004,1004,-3,1004,1004,1004,-13,1004,1004,-1,1004,-1,1004,-3,1004,1004,1004,1004,1004,1004,-1,1004,-1,1004,-4,1004,-2,1004,1004,1004,1004,-1,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,-2,1004,1004,-5,1004,1004,-2,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,-3,1004,1004,1004,1004,1004,1004],
sm802=[0,-1,1005,1005,-1,0,-4,0,-4,1005,1005,-1,1005,-5,1005,-4,1005,1005,-3,1005,-3,1005,1005,1005,1005,-3,1005,1005,1005,-13,1005,1005,-1,1005,-1,1005,-3,1005,1005,1005,1005,1005,1005,-1,1005,-1,1005,-4,1005,-2,1005,1005,1005,1005,-1,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,-2,1005,1005,-5,1005,1005,-2,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,-3,1005,1005,1005,1005,1005,1005],
sm803=[0,-1,1006,1006,-1,0,-4,0,-4,1006,1006,-1,1006,-5,1006,-4,1006,1006,-3,1006,-3,1006,1006,1006,1006,-3,1006,1006,1006,-13,1006,1006,-1,1006,-1,1006,-3,1006,1006,1006,1006,1006,1006,-1,1006,-1,1006,-4,1006,-2,1006,1006,1006,1006,-1,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,-2,1006,1006,-5,1006,1006,-2,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,-3,1006,1006,1006,1006,1006,1006],
sm804=[0,-4,0,-4,0,-28,1007,-1,1007,-3,1007,-1,1007,-14,1007,-3,1007,-32,1007],
sm805=[0,-4,0,-4,0,-28,1008,-1,1008,-3,1008,-1,1008,-14,1008,-3,1008,-32,1008],
sm806=[0,-4,0,-4,0,-28,1009],
sm807=[0,-2,1010,-1,0,-4,0,-4,1010,-8,1010,-10,1010,-2,1010,-6,680,1010,-2,1010,-23,1010,1010,1010,-8,1010],
sm808=[0,-4,0,-4,0,-30,1011],
sm809=[0,-4,0,-4,0,-30,1012],
sm810=[0,-4,0,-4,0,-29,695,-43,542],
sm811=[0,-4,0,-4,0,-4,1013],
sm812=[0,-2,1014,-1,0,-4,0,-24,1014,-2,1014,-7,1014,1014,-25,1014,1014,1014,-8,1014],
sm813=[0,-2,1015,-1,0,-4,0,-4,1015,-8,1015,-10,1015,-2,1015,-2,1015,-3,1015,1015,-2,1015,-4,1015,1015,-17,1015,1015,1015,-8,1015],
sm814=[0,-4,1016,-4,0,-3,1016,-26,1016],
sm815=[0,-4,0,-4,0,-30,1017],
sm816=[0,-4,0,-4,0,-30,848],
sm817=[0,-4,0,-4,0,-30,836],
sm818=[0,-4,0,-4,0,-30,1018],
sm819=[0,-1,1019,1019,-1,0,-4,0],
sm820=[0,-4,0,-4,0,-23,1020],
sm821=[0,-4,0,-4,0,-5,1021,-44,1022],
sm822=[0,-2,1023,-1,0,-4,0],
sm823=[0,-4,0,-4,0,-5,1024,-17,1024,-6,1024,-19,1024,1024],
sm824=[0,-4,1025,-4,0,-3,1025,-26,1025],
sm825=[0,-4,0,-4,0,-4,1026],
sm826=[0,-1,1027,-2,0,-4,0,-36,1027,-4,1027,1027],
sm827=[0,-4,0,-4,0,-34,1028,1028],
sm828=[0,-4,0,-4,0,-4,1029],
sm829=[0,-4,0,-4,0,-30,1030,-4,1030,-7,1030,1030],
sm830=[0,-2,1031,-1,0,-4,0,-4,1031,-25,1031,-5,1031,-1,1031],
sm831=[0,-2,1032,-1,1032,-4,0,-3,1032,1032,-24,1032,1032,-5,1032,-1,1032,-100,1032],
sm832=[0,-2,1033,-1,0,-4,0,-23,1033,1033,-2,1033,-2,1033,-3,1033,1033,-23,1033,1033,1033,1033,1033,1033,-8,1033],
sm833=[0,-4,0,-4,0,-4,1034],
sm834=[0,-1,33,34,-1,0,-4,0,-27,35,-1,36,1035,-4,37,-23,38,39,-16,40,41,-8,42,-18,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm835=[0,-4,0,-4,0,-30,1036],
sm836=[0,-4,0,-4,0,-30,1037],
sm837=[0,-1,1038,1038,-1,0,-4,0,-4,1038,1038,-7,1038,-13,1038,-1,1038,-5,1038,1038,-22,1038,1038,-15,1038,1038,1038,1038,-1,1038,1038,1038,1038,1038,1038,1038,-1,1038,1038,1038,1038,1038,1038,1038,1038,-2,1038,1038,-5,1038,1038,-2,1038,-23,1038,-1,1038,1038,1038,1038,1038,1038,-3,1038,1038,1038,1038,1038,1038],
sm838=[0,-4,0,-4,0,-30,1039],
sm839=[0,-1,1040,1040,-1,0,-4,0,-4,1040,1040,-7,1040,-13,1040,-1,1040,-5,1040,1040,-22,1040,1040,-15,1040,1040,1040,1040,-1,1040,1040,1040,1040,1040,1040,1040,-1,1040,1040,1040,1040,1040,1040,1040,1040,-2,1040,1040,-5,1040,1040,-2,1040,-23,1040,-1,1040,1040,1040,1040,1040,1040,-3,1040,1040,1040,1040,1040,1040],
sm840=[0,-4,0,-4,0,-30,1041],
sm841=[0,-1,1042,1042,-1,0,-4,0,-4,1042,1042,-7,1042,-13,1042,-1,1042,-5,1042,1042,-22,1042,1042,-15,1042,1042,1042,1042,-1,1042,1042,1042,1042,1042,1042,1042,-1,1042,1042,1042,1042,1042,1042,1042,1042,-2,1042,1042,-5,1042,1042,-2,1042,-23,1042,-1,1042,1042,1042,1042,1042,1042,-3,1042,1042,1042,1042,1042,1042],
sm842=[0,-4,0,-4,0,-36,1043,-39,995,-18,996],
sm843=[0,-4,0,-4,0,-36,1044,-58,996],
sm844=[0,-4,0,-4,0,-36,1045,-39,1045,-18,1045],
sm845=[0,-4,0,-4,0,-36,1046,-36,1047,-21,1046],
sm846=[0,-1,1048,1048,-1,0,-4,0,-4,1048,-22,1048,-6,1048,-1,1048,-66,1048,1048,1048,-39,1048,1048,-3,1048],
sm847=[0,-1,1049,1049,-1,0,-4,0,-4,1049,-22,1049,-6,1049,-1,1049,-66,1049,1049,1049,-39,1049,1049,-3,1049],
sm848=[0,-4,0,-4,0,-36,1050],
sm849=[0,-1,1051,1051,-1,0,-4,0,-4,1051,1051,-1,1051,-5,1051,-4,1051,1051,-3,1051,-3,1051,1051,1051,1051,-3,1051,1051,1051,-13,1051,1051,-1,1051,-1,1051,-3,1051,1051,1051,1051,1051,1051,-1,1051,-1,1051,-4,1051,-2,1051,1051,1051,1051,-1,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,-2,1051,1051,-5,1051,1051,-2,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,1051,-3,1051,1051,1051,1051,1051,1051],
sm850=[0,-4,0,-4,0,-28,1052,-1,1052,-3,1052,-1,1052,-14,1052,-3,1052,-32,1052],
sm851=[0,-2,1053,-1,0,-4,0,-4,1053,-8,1053,-10,1053,-2,1053,-1,1053,-5,1053,-2,1053,-6,1053,-2,1053,-13,1053,1053,1053,-8,1053],
sm852=[0,-1,1054,1054,-1,0,-4,0,-51,1055],
sm853=[0,-1,1056,1056,-1,0,-4,0],
sm854=[0,-2,339,-1,0,-4,0,-4,1057,-31,1058,-1,216],
sm855=[0,-4,0,-4,0,-34,1059,1059],
sm856=[0,-1,1060,1060,-1,0,-4,0,-4,1060,1060,-7,1060,-13,1060,-1,1060,-5,1060,1060,-22,1060,1060,-15,1060,1060,1060,1060,-1,1060,1060,1060,1060,1060,1060,1060,-1,1060,1060,1060,1060,1060,1060,1060,1060,-2,1060,1060,-5,1060,1060,-2,1060,-23,1060,-1,1060,1060,1060,1060,1060,1060,-3,1060,1060,1060,1060,1060,1060],
sm857=[0,-1,1061,1061,-1,0,-4,0,-4,1061,1061,-7,1061,-13,1061,-1,1061,-5,1061,1061,-22,1061,1061,-15,1061,1061,1061,1061,-1,1061,1061,1061,1061,1061,1061,1061,-1,1061,1061,1061,1061,1061,1061,1061,1061,-2,1061,1061,-5,1061,1061,-2,1061,-23,1061,-1,1061,1061,1061,1061,1061,1061,-3,1061,1061,1061,1061,1061,1061],
sm858=[0,-4,0,-4,0,-30,1062],
sm859=[0,-1,1063,1063,-1,0,-4,0,-4,1063,1063,-7,1063,-13,1063,-1,1063,-5,1063,1063,-22,1063,1063,-15,1063,1063,1063,1063,-1,1063,1063,1063,1063,1063,1063,1063,-1,1063,1063,1063,1063,1063,1063,1063,1063,-2,1063,1063,-5,1063,1063,-2,1063,-23,1063,-1,1063,1063,1063,1063,1063,1063,-3,1063,1063,1063,1063,1063,1063],
sm860=[0,-1,1064,1064,-1,0,-4,0,-4,1064,1064,-7,1064,-13,1064,-1,1064,-5,1064,1064,-22,1064,1064,-15,1064,1064,1064,1064,-1,1064,1064,1064,1064,1064,1064,1064,-1,1064,1064,1064,1064,1064,1064,1064,1064,-2,1064,1064,-5,1064,1064,-2,1064,-23,1064,-1,1064,1064,1064,1064,1064,1064,-3,1064,1064,1064,1064,1064,1064],
sm861=[0,-1,1065,1065,-1,0,-4,0,-4,1065,1065,-7,1065,-13,1065,-1,1065,-5,1065,1065,-22,1065,1065,-15,1065,1065,1065,1065,-1,1065,1065,1065,1065,1065,1065,1065,-1,1065,1065,1065,1065,1065,1065,1065,1065,-2,1065,1065,-5,1065,1065,-2,1065,-23,1065,-1,1065,1065,1065,1065,1065,1065,-3,1065,1065,1065,1065,1065,1065],
sm862=[0,-1,1066,1066,-1,0,-4,0,-4,1066,1066,-7,1066,-13,1066,-1,1066,-5,1066,1066,-22,1066,1066,-15,1066,1066,1066,1066,-1,1066,1066,1066,1066,1066,1066,1066,-1,1066,1066,1066,1066,1066,1066,1066,1066,-2,1066,1066,-5,1066,1066,-2,1066,-23,1066,-1,1066,1066,1066,1066,1066,1066,-3,1066,1066,1066,1066,1066,1066],
sm863=[0,-1,1067,1067,-1,0,-4,0,-4,1067,1067,-7,1067,-13,1067,-1,1067,-5,1067,1067,-22,1067,1067,-15,1067,1067,1067,1067,-1,1067,1067,1067,1067,1067,1067,1067,-1,1067,1067,1067,1067,1067,1067,1067,1067,-2,1067,1067,-5,1067,1067,-2,1067,-23,1067,-1,1067,1067,1067,1067,1067,1067,-3,1067,1067,1067,1067,1067,1067],
sm864=[0,-1,1068,1068,-1,0,-4,0,-4,1068,1068,-7,1068,-13,1068,-1,1068,-5,1068,1068,-22,1068,1068,-15,1068,1068,1068,1068,-1,1068,1068,1068,1068,1068,1068,1068,-1,1068,1068,1068,1068,1068,1068,1068,1068,-2,1068,1068,-5,1068,1068,-2,1068,-23,1068,-1,1068,1068,1068,1068,1068,1068,-3,1068,1068,1068,1068,1068,1068],
sm865=[0,-1,1069,1069,-1,0,-4,0,-4,1069,1069,-7,1069,-13,1069,-1,1069,-5,1069,1069,-22,1069,1069,-15,1069,1069,1069,1069,-1,1069,1069,1069,1069,1069,1069,1069,-1,1069,1069,1069,1069,1069,1069,1069,1069,-2,1069,1069,-5,1069,1069,-2,1069,-23,1069,-1,1069,1069,1069,1069,1069,1069,-3,1069,1069,1069,1069,1069,1069],
sm866=[0,-4,0,-4,0,-36,1070,-58,996],
sm867=[0,-1,1071,1071,-1,0,-4,0,-4,1071,1071,-7,1071,-13,1071,-1,1071,-5,1071,1071,-22,1071,1071,-15,1071,1071,1071,1071,-1,1071,1071,1071,1071,1071,1071,1071,-1,1071,1071,1071,1071,1071,1071,1071,1071,-2,1071,1071,-5,1071,1071,-2,1071,-23,1071,-1,1071,1071,1071,1071,1071,1071,-3,1071,1071,1071,1071,1071,1071],
sm868=[0,-4,0,-4,0,-36,1072,-39,1072,-18,1072],
sm869=[0,-4,0,-4,0,-36,1073,-58,996],
sm870=[0,-4,0,-4,0,-73,1074],
sm871=[0,-1,1075,1075,-1,0,-4,0,-4,1075,1075,-7,1075,-13,1075,-1,1075,-5,1075,1075,-22,1075,1075,-15,1075,1075,1075,1075,-1,1075,1075,1075,1075,1075,1075,1075,-1,1075,1075,1075,1075,1075,1075,1075,1075,-1,1075,1075,1075,-5,1075,1075,-2,1075,-23,1075,-1,1075,1075,1075,1075,1075,1075,-3,1075,1075,1075,1075,1075,1075],
sm872=[0,-1,1076,1076,-1,0,-4,0,-4,1076,-22,1076,-6,1076,-1,1076,-66,1076,1076,1076,-39,1076,1076,-3,1076],
sm873=[0,-4,0,-4,0,-30,1077],
sm874=[0,-1,1078,1078,-1,0,-4,0],
sm875=[0,-4,0,-4,0,-36,1079],
sm876=[0,-1,1080,-2,0,-4,0,-36,1080,-4,1080,1080],
sm877=[0,-1,1081,1081,-1,0,-4,0,-4,1081,1081,-7,1081,-13,1081,-1,1081,-5,1081,1081,-22,1081,1081,-15,1081,1081,1081,1081,-1,1081,1081,1081,1081,1081,1081,1081,-1,1081,1081,1081,1081,1081,1081,1081,1081,-2,1081,1081,-5,1081,1081,-2,1081,-23,1081,-1,1081,1081,1081,1081,1081,1081,-3,1081,1081,1081,1081,1081,1081],
sm878=[0,-1,1082,1082,-1,0,-4,0,-4,1082,1082,-7,1082,-13,1082,-1,1082,-5,1082,1082,-22,1082,1082,-15,1082,1082,1082,1082,-1,1082,1082,1082,1082,1082,1082,1082,-1,1082,1082,1082,1082,1082,1082,1082,1082,-2,1082,1082,-5,1082,1082,-2,1082,-23,1082,-1,1082,1082,1082,1082,1082,1082,-3,1082,1082,1082,1082,1082,1082],
sm879=[0,-1,1083,1083,-1,0,-4,0,-4,1083,1083,-7,1083,-13,1083,-1,1083,-5,1083,1083,-22,1083,1083,-15,1083,1083,1083,1083,-1,1083,1083,1083,1083,1083,1083,1083,-1,1083,1083,1083,1083,1083,1083,1083,1083,-2,1083,1083,-5,1083,1083,-2,1083,-23,1083,-1,1083,1083,1083,1083,1083,1083,-3,1083,1083,1083,1083,1083,1083],
sm880=[0,-1,1084,1084,-1,0,-4,0,-4,1084,1084,-7,1084,-13,1084,-1,1084,-5,1084,1084,-22,1084,1084,-15,1084,1084,1084,1084,-1,1084,1084,1084,1084,1084,1084,1084,-1,1084,1084,1084,1084,1084,1084,1084,1084,-2,1084,1084,-5,1084,1084,-2,1084,-23,1084,-1,1084,1084,1084,1084,1084,1084,-3,1084,1084,1084,1084,1084,1084],
sm881=[0,-4,0,-4,0,-36,1085],
sm882=[0,-1,1086,1086,-1,0,-4,0,-4,1086,1086,-7,1086,-13,1086,-1,1086,-5,1086,1086,-22,1086,1086,-15,1086,1086,1086,1086,-1,1086,1086,1086,1086,1086,1086,1086,-1,1086,1086,1086,1086,1086,1086,1086,1086,-2,1086,1086,-5,1086,1086,-2,1086,-23,1086,-1,1086,1086,1086,1086,1086,1086,-3,1086,1086,1086,1086,1086,1086],
sm883=[0,-1,33,34,-1,0,-4,0,-4,222,223,-23,36,-5,225,1087,-22,38,39,-15,1087,40,41,226,-1,227,-1,228,229,230,231,42,-1,232,233,234,235,236,237,1087,238,-2,239,240,-5,43,44,-2,45,-23,46,-1,47,48,49,50,51,52,-3,53,54,55,56,57,58],
sm884=[0,-4,0,-4,0,-36,1088,-58,1088],
sm885=[0,-1,1089,-2,0,-4,0,-36,1089,-4,1089,1089],
sm886=[0,-1,1090,1090,-1,0,-4,0,-4,1090,1090,-7,1090,-13,1090,-1,1090,-5,1090,1090,-22,1090,1090,-15,1090,1090,1090,1090,-1,1090,1090,1090,1090,1090,1090,1090,-1,1090,1090,1090,1090,1090,1090,1090,1090,-2,1090,1090,-5,1090,1090,-2,1090,-23,1090,-1,1090,1090,1090,1090,1090,1090,-3,1090,1090,1090,1090,1090,1090],
sm887=[0,-1,1091,1091,-1,0,-4,0,-4,1091,1091,-7,1091,-13,1091,-1,1091,-5,1091,1091,-22,1091,1091,-15,1091,1091,1091,1091,-1,1091,1091,1091,1091,1091,1091,1091,-1,1091,1091,1091,1091,1091,1091,1091,1091,-2,1091,1091,-5,1091,1091,-2,1091,-23,1091,-1,1091,1091,1091,1091,1091,1091,-3,1091,1091,1091,1091,1091,1091],
sm888=[0,-4,0,-4,0,-36,1092,-39,1092,-18,1092],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[";",14],["<",15],["import",16],["/",17],[">",33],["\"",155],["f",20],["filter",21],["style",22],["</",23],["script",24],["{",45],["}",46],["((",27],["))",28],[")(",29],[null,6],["*",72],["#",34],["```",35],["[",37],["]",38],["(",39],[")",40],["``",41],[",",44],["supports",47],["@",48],["keyframes",49],["id",50],["from",51],["to",52],["and",53],["or",54],["not",55],["media",57],["only",58],[":",83],["<=",60],["=",61],["%",63],["px",64],["in",65],["rad",66],["url",67],["'",156],["+",69],["~",70],["||",71],["|",73],[".",74],["^=",76],["$=",77],["*=",78],["i",79],["s",80],["!",149],["important",82],["as",84],["export",85],["default",86],["function",87],["class",88],["let",89],["async",90],["if",91],["else",92],["var",93],["do",94],["while",95],["for",96],["await",97],["of",98],["continue",99],["break",100],["return",101],["throw",102],["with",103],["switch",104],["case",105],["try",106],["catch",107],["finally",108],["debugger",109],["const",110],["=>",111],["extends",112],["static",113],["get",114],["set",115],["new",116],["super",117],["target",118],["...",119],["this",120],["/=",121],["%=",122],["+=",123],["-=",124],["<<=",125],[">>=",126],[">>>=",127],["&=",128],["|=",129],["**=",130],["?",131],["&&",132],["^",133],["&",134],["==",135],["!=",136],["===",137],["!==",138],[">=",139],["instanceof",140],["<<",141],[">>",142],[">>>",143],["-",144],["**",145],["delete",146],["void",147],["typeof",148],["++",150],["--",151],["null",157],["true",158],["false",159],["$",160],["input",161],["area",162],["base",163],["br",164],["col",165],["command",166],["embed",167],["hr",168],["img",169],["keygen",170],["link",171],["meta",172],["param",173],["source",174],["track",175],["wbr",176]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,";"],[15,"<"],[16,"import"],[17,"/"],[33,">"],[155,"\""],[20,"f"],[21,"filter"],[22,"style"],[23,"</"],[24,"script"],[45,"{"],[46,"}"],[27,"(("],[28,"))"],[29,")("],[6,null],[72,"*"],[34,"#"],[35,"```"],[37,"["],[38,"]"],[39,"("],[40,")"],[41,"``"],[44,","],[47,"supports"],[48,"@"],[49,"keyframes"],[50,"id"],[51,"from"],[52,"to"],[53,"and"],[54,"or"],[55,"not"],[57,"media"],[58,"only"],[83,":"],[60,"<="],[61,"="],[63,"%"],[64,"px"],[65,"in"],[66,"rad"],[67,"url"],[156,"'"],[69,"+"],[70,"~"],[71,"||"],[73,"|"],[74,"."],[76,"^="],[77,"$="],[78,"*="],[79,"i"],[80,"s"],[149,"!"],[82,"important"],[84,"as"],[85,"export"],[86,"default"],[87,"function"],[88,"class"],[89,"let"],[90,"async"],[91,"if"],[92,"else"],[93,"var"],[94,"do"],[95,"while"],[96,"for"],[97,"await"],[98,"of"],[99,"continue"],[100,"break"],[101,"return"],[102,"throw"],[103,"with"],[104,"switch"],[105,"case"],[106,"try"],[107,"catch"],[108,"finally"],[109,"debugger"],[110,"const"],[111,"=>"],[112,"extends"],[113,"static"],[114,"get"],[115,"set"],[116,"new"],[117,"super"],[118,"target"],[119,"..."],[120,"this"],[121,"/="],[122,"%="],[123,"+="],[124,"-="],[125,"<<="],[126,">>="],[127,">>>="],[128,"&="],[129,"|="],[130,"**="],[131,"?"],[132,"&&"],[133,"^"],[134,"&"],[135,"=="],[136,"!="],[137,"==="],[138,"!=="],[139,">="],[140,"instanceof"],[141,"<<"],[142,">>"],[143,">>>"],[144,"-"],[145,"**"],[146,"delete"],[147,"void"],[148,"typeof"],[150,"++"],[151,"--"],[157,"null"],[158,"true"],[159,"false"],[160,"$"],[161,"input"],[162,"area"],[163,"base"],[164,"br"],[165,"col"],[166,"command"],[167,"embed"],[168,"hr"],[169,"img"],[170,"keygen"],[171,"link"],[172,"meta"],[173,"param"],[174,"source"],[175,"track"],[176,"wbr"]]),

    // States 
    state = [sm0,
sm1,
sm2,
sm3,
sm0,
sm4,
sm5,
sm6,
sm7,
sm8,
sm9,
sm10,
sm11,
sm12,
sm13,
sm14,
sm15,
sm16,
sm17,
sm18,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm19,
sm20,
sm21,
sm22,
sm23,
sm24,
sm25,
sm26,
sm26,
sm27,
sm28,
sm29,
sm30,
sm31,
sm32,
sm33,
sm34,
sm35,
sm36,
sm37,
sm38,
sm39,
sm40,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm41,
sm9,
sm9,
sm42,
sm43,
sm44,
sm45,
sm46,
sm46,
sm46,
sm47,
sm48,
sm48,
sm49,
sm50,
sm48,
sm48,
sm51,
sm52,
sm53,
sm54,
sm55,
sm56,
sm57,
sm57,
sm57,
sm57,
sm58,
sm58,
sm59,
sm60,
sm61,
sm62,
sm63,
sm64,
sm65,
sm66,
sm67,
sm68,
sm69,
sm70,
sm71,
sm72,
sm72,
sm9,
sm73,
sm74,
sm75,
sm76,
sm77,
sm78,
sm79,
sm80,
sm81,
sm82,
sm83,
sm84,
sm85,
sm86,
sm87,
sm88,
sm89,
sm90,
sm91,
sm92,
sm93,
sm93,
sm93,
sm93,
sm93,
sm93,
sm19,
sm94,
sm9,
sm9,
sm9,
sm95,
sm96,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm97,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm9,
sm98,
sm41,
sm99,
sm48,
sm100,
sm101,
sm102,
sm103,
sm104,
sm105,
sm106,
sm107,
sm108,
sm109,
sm110,
sm9,
sm111,
sm9,
sm109,
sm112,
sm113,
sm44,
sm114,
sm115,
sm116,
sm117,
sm118,
sm119,
sm120,
sm120,
sm120,
sm120,
sm120,
sm120,
sm120,
sm121,
sm118,
sm122,
sm123,
sm123,
sm123,
sm123,
sm123,
sm123,
sm123,
sm124,
sm125,
sm126,
sm127,
sm127,
sm9,
sm128,
sm129,
sm130,
sm131,
sm132,
sm133,
sm134,
sm133,
sm9,
sm135,
sm136,
sm137,
sm137,
sm138,
sm138,
sm139,
sm139,
sm9,
sm140,
sm141,
sm142,
sm143,
sm144,
sm145,
sm146,
sm147,
sm148,
sm149,
sm150,
sm109,
sm9,
sm151,
sm152,
sm153,
sm154,
sm155,
sm156,
sm157,
sm158,
sm159,
sm82,
sm160,
sm161,
sm162,
sm162,
sm163,
sm164,
sm165,
sm166,
sm167,
sm167,
sm168,
sm169,
sm170,
sm171,
sm172,
sm172,
sm173,
sm174,
sm175,
sm176,
sm177,
sm178,
sm179,
sm180,
sm181,
sm181,
sm181,
sm181,
sm182,
sm183,
sm184,
sm185,
sm186,
sm187,
sm188,
sm189,
sm190,
sm191,
sm192,
sm193,
sm194,
sm195,
sm196,
sm197,
sm198,
sm199,
sm199,
sm200,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm201,
sm202,
sm203,
sm204,
sm205,
sm206,
sm207,
sm150,
sm208,
sm209,
sm210,
sm210,
sm211,
sm212,
sm213,
sm214,
sm215,
sm216,
sm217,
sm218,
sm9,
sm219,
sm220,
sm221,
sm221,
sm221,
sm222,
sm150,
sm223,
sm224,
sm225,
sm226,
sm227,
sm228,
sm229,
sm230,
sm231,
sm231,
sm231,
sm232,
sm233,
sm234,
sm235,
sm236,
sm237,
sm237,
sm9,
sm238,
sm239,
sm240,
sm241,
sm238,
sm242,
sm243,
sm244,
sm245,
sm246,
sm247,
sm247,
sm248,
sm249,
sm250,
sm251,
sm252,
sm253,
sm254,
sm254,
sm254,
sm254,
sm255,
sm255,
sm255,
sm255,
sm256,
sm257,
sm258,
sm259,
sm260,
sm261,
sm262,
sm263,
sm264,
sm265,
sm266,
sm267,
sm268,
sm269,
sm270,
sm271,
sm272,
sm273,
sm274,
sm9,
sm275,
sm276,
sm277,
sm278,
sm279,
sm280,
sm279,
sm281,
sm282,
sm283,
sm284,
sm285,
sm286,
sm286,
sm287,
sm288,
sm289,
sm290,
sm291,
sm292,
sm9,
sm293,
sm9,
sm294,
sm295,
sm296,
sm297,
sm298,
sm299,
sm300,
sm301,
sm302,
sm303,
sm304,
sm150,
sm305,
sm306,
sm307,
sm308,
sm309,
sm310,
sm310,
sm311,
sm312,
sm313,
sm314,
sm315,
sm316,
sm317,
sm318,
sm319,
sm320,
sm319,
sm321,
sm322,
sm323,
sm324,
sm325,
sm326,
sm327,
sm328,
sm329,
sm330,
sm331,
sm332,
sm333,
sm334,
sm335,
sm334,
sm334,
sm336,
sm337,
sm337,
sm338,
sm339,
sm340,
sm341,
sm342,
sm343,
sm344,
sm345,
sm346,
sm347,
sm348,
sm169,
sm349,
sm350,
sm351,
sm352,
sm353,
sm354,
sm355,
sm356,
sm357,
sm349,
sm358,
sm359,
sm359,
sm359,
sm359,
sm360,
sm361,
sm361,
sm362,
sm363,
sm364,
sm365,
sm366,
sm367,
sm368,
sm369,
sm370,
sm371,
sm372,
sm373,
sm374,
sm375,
sm376,
sm377,
sm344,
sm344,
sm344,
sm378,
sm379,
sm380,
sm381,
sm382,
sm383,
sm384,
sm385,
sm386,
sm387,
sm388,
sm389,
sm390,
sm391,
sm392,
sm393,
sm394,
sm395,
sm9,
sm396,
sm9,
sm397,
sm398,
sm9,
sm399,
sm400,
sm401,
sm402,
sm403,
sm404,
sm405,
sm9,
sm406,
sm407,
sm331,
sm408,
sm409,
sm410,
sm395,
sm395,
sm411,
sm228,
sm412,
sm228,
sm413,
sm414,
sm415,
sm415,
sm415,
sm415,
sm416,
sm417,
sm418,
sm419,
sm420,
sm421,
sm422,
sm423,
sm424,
sm241,
sm412,
sm425,
sm426,
sm427,
sm9,
sm428,
sm429,
sm430,
sm431,
sm432,
sm433,
sm434,
sm435,
sm436,
sm436,
sm437,
sm438,
sm439,
sm440,
sm441,
sm442,
sm443,
sm444,
sm150,
sm445,
sm446,
sm447,
sm448,
sm449,
sm450,
sm451,
sm451,
sm452,
sm453,
sm454,
sm455,
sm456,
sm109,
sm457,
sm458,
sm459,
sm460,
sm461,
sm462,
sm463,
sm464,
sm465,
sm466,
sm467,
sm468,
sm469,
sm470,
sm471,
sm150,
sm472,
sm472,
sm473,
sm474,
sm475,
sm476,
sm477,
sm478,
sm479,
sm480,
sm481,
sm481,
sm481,
sm481,
sm481,
sm481,
sm481,
sm482,
sm483,
sm484,
sm485,
sm486,
sm487,
sm488,
sm488,
sm489,
sm490,
sm491,
sm492,
sm493,
sm494,
sm495,
sm496,
sm497,
sm497,
sm498,
sm498,
sm499,
sm500,
sm501,
sm502,
sm502,
sm503,
sm504,
sm505,
sm506,
sm506,
sm507,
sm508,
sm509,
sm510,
sm511,
sm511,
sm512,
sm512,
sm513,
sm514,
sm515,
sm516,
sm517,
sm518,
sm519,
sm520,
sm521,
sm522,
sm523,
sm524,
sm525,
sm526,
sm527,
sm528,
sm529,
sm530,
sm531,
sm531,
sm531,
sm531,
sm532,
sm349,
sm533,
sm534,
sm535,
sm536,
sm537,
sm538,
sm539,
sm540,
sm540,
sm63,
sm541,
sm542,
sm542,
sm543,
sm150,
sm544,
sm544,
sm545,
sm546,
sm547,
sm548,
sm549,
sm550,
sm551,
sm552,
sm553,
sm150,
sm554,
sm150,
sm555,
sm556,
sm557,
sm558,
sm559,
sm560,
sm561,
sm562,
sm563,
sm564,
sm565,
sm219,
sm566,
sm150,
sm567,
sm567,
sm228,
sm568,
sm569,
sm537,
sm570,
sm571,
sm572,
sm573,
sm574,
sm575,
sm575,
sm576,
sm577,
sm578,
sm579,
sm573,
sm580,
sm581,
sm581,
sm582,
sm583,
sm9,
sm584,
sm585,
sm586,
sm587,
sm588,
sm589,
sm590,
sm591,
sm592,
sm593,
sm594,
sm595,
sm596,
sm597,
sm598,
sm599,
sm600,
sm601,
sm602,
sm603,
sm604,
sm604,
sm605,
sm606,
sm150,
sm607,
sm608,
sm609,
sm608,
sm608,
sm610,
sm611,
sm612,
sm613,
sm614,
sm615,
sm616,
sm617,
sm616,
sm618,
sm619,
sm620,
sm621,
sm622,
sm623,
sm624,
sm625,
sm626,
sm627,
sm628,
sm629,
sm630,
sm631,
sm632,
sm633,
sm346,
sm634,
sm635,
sm636,
sm637,
sm638,
sm639,
sm640,
sm500,
sm641,
sm500,
sm642,
sm643,
sm644,
sm645,
sm500,
sm646,
sm646,
sm646,
sm647,
sm648,
sm649,
sm650,
sm650,
sm651,
sm652,
sm633,
sm653,
sm654,
sm655,
sm656,
sm508,
sm657,
sm508,
sm658,
sm659,
sm660,
sm349,
sm661,
sm662,
sm662,
sm663,
sm664,
sm665,
sm666,
sm524,
sm667,
sm668,
sm668,
sm669,
sm670,
sm670,
sm671,
sm672,
sm673,
sm674,
sm619,
sm675,
sm676,
sm211,
sm9,
sm211,
sm677,
sm678,
sm679,
sm9,
sm680,
sm681,
sm9,
sm682,
sm683,
sm684,
sm685,
sm686,
sm685,
sm685,
sm687,
sm688,
sm150,
sm688,
sm150,
sm689,
sm211,
sm690,
sm150,
sm691,
sm692,
sm693,
sm674,
sm619,
sm694,
sm573,
sm695,
sm696,
sm573,
sm697,
sm698,
sm699,
sm331,
sm331,
sm700,
sm701,
sm702,
sm703,
sm704,
sm705,
sm706,
sm707,
sm708,
sm709,
sm710,
sm711,
sm711,
sm712,
sm713,
sm714,
sm715,
sm715,
sm716,
sm717,
sm718,
sm718,
sm719,
sm720,
sm721,
sm720,
sm722,
sm723,
sm724,
sm725,
sm726,
sm727,
sm728,
sm729,
sm730,
sm731,
sm732,
sm733,
sm734,
sm735,
sm736,
sm737,
sm738,
sm739,
sm739,
sm740,
sm740,
sm741,
sm742,
sm741,
sm741,
sm743,
sm744,
sm745,
sm746,
sm747,
sm746,
sm746,
sm748,
sm749,
sm750,
sm750,
sm750,
sm751,
sm737,
sm752,
sm753,
sm753,
sm754,
sm755,
sm756,
sm757,
sm758,
sm758,
sm758,
sm759,
sm760,
sm761,
sm762,
sm763,
sm764,
sm765,
sm766,
sm767,
sm768,
sm769,
sm770,
sm771,
sm772,
sm773,
sm774,
sm775,
sm776,
sm777,
sm777,
sm778,
sm716,
sm779,
sm780,
sm781,
sm782,
sm783,
sm784,
sm785,
sm211,
sm786,
sm787,
sm788,
sm211,
sm789,
sm9,
sm790,
sm791,
sm791,
sm792,
sm793,
sm794,
sm795,
sm796,
sm796,
sm716,
sm797,
sm798,
sm799,
sm331,
sm800,
sm801,
sm802,
sm803,
sm804,
sm805,
sm806,
sm805,
sm807,
sm808,
sm809,
sm809,
sm810,
sm811,
sm812,
sm813,
sm814,
sm815,
sm816,
sm817,
sm818,
sm819,
sm818,
sm820,
sm821,
sm822,
sm823,
sm813,
sm824,
sm825,
sm826,
sm169,
sm652,
sm827,
sm828,
sm829,
sm830,
sm831,
sm832,
sm211,
sm833,
sm834,
sm835,
sm211,
sm836,
sm211,
sm211,
sm837,
sm211,
sm838,
sm211,
sm211,
sm839,
sm211,
sm840,
sm841,
sm842,
sm843,
sm844,
sm9,
sm845,
sm219,
sm846,
sm847,
sm848,
sm849,
sm850,
sm851,
sm740,
sm852,
sm740,
sm853,
sm853,
sm854,
sm855,
sm856,
sm857,
sm858,
sm211,
sm211,
sm859,
sm211,
sm860,
sm861,
sm862,
sm211,
sm863,
sm864,
sm865,
sm211,
sm866,
sm867,
sm868,
sm869,
sm867,
sm870,
sm331,
sm871,
sm872,
sm873,
sm874,
sm873,
sm875,
sm876,
sm211,
sm877,
sm878,
sm879,
sm879,
sm880,
sm881,
sm882,
sm882,
sm883,
sm884,
sm885,
sm886,
sm887,
sm888],

/************ Functions *************/

    max = Math.max, min = Math.min,

    //Error Functions
    e$2 = (...d)=>fn.defaultError(...d), 
    eh = [e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2,
e$2],

    //Empty Function
    nf = ()=>-1, 

    //Environment Functions
    
redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
redn = (ret, plen, t, e, o, l, s) => {        if(plen > 0){            let ln = max(o.length - plen, 0);            o[ln] = o[o.length -1];            o.length = ln + 1;        }        return ret;    },
shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R00_S=function (sym,env,lex,state,output,len) {return sym[0]},
R30_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
R31_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return [sym[0]]},
R40_html_BODY=function (sym,env,lex,state,output,len) {return (sym[1].import_list = sym[0],sym[1])},
R50_IMPORT_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
R60_html_ATTRIBUTE_BODY=function (sym,env,lex,state,output,len) {return sym[1]},
R90_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
R91_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector("script",["on",null,new env.wick_binding(["on",null,sym[1]])],sym[3],env,lex)},
I110_BASIC_BINDING=function (sym,env,lex,state,output,len) {env.start = lex.off+2;},
R230_md_UNORDERED_LIST_ITEMS=function (sym,env,lex,state,output,len) {return fn.element_selector("li",null,sym[2],env,lex,sym[0].length)},
R231_md_UNORDERED_LIST_ITEMS=function (sym,env,lex,state,output,len) {return fn.element_selector("li",null,sym[1],env,lex,sym[0].length)},
R290_md_BLOCK_QUOTES=function (sym,env,lex,state,output,len) {return fn.element_selector("blockquote",null,sym[2],env,lex,sym[0].length)},
R291_md_BLOCK_QUOTES=function (sym,env,lex,state,output,len) {return fn.element_selector("blockquote",null,sym[1],env,lex,sym[0].length)},
R300_md_HEADER=function (sym,env,lex,state,output,len) {return fn.element_selector("h" + sym[0].length,null,sym[1],env,lex)},
R350_md_CODE_BLOCK2411_group=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,[sym[1]],env,lex)},
R370_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return (console.log("RAINBOW"),fn.element_selector("pre",null,sym[2],env,lex))},
R371_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return (console.log("RAINBOW"),fn.element_selector("pre",null,sym[1],env,lex))},
R372_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return (console.log("RAINBOW"),fn.element_selector("pre",null,null,env,lex))},
R390_md_EMPHASIS=function (sym,env,lex,state,output,len) {return fn.element_selector("b",null,sym[1],env,lex)},
R430_md_BODY_SYMBOLS_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R431_md_BODY_SYMBOLS_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R440_md_CODE_QUOTE=function (sym,env,lex,state,output,len) {return fn.element_selector("code",null,new fn.text([sym[1]],env),env,lex)},
R470_md_TEXT_NODE=function (sym,env,lex,state,output,len) {return new fn.text([sym[0]],env)},
R580_css_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
C590_css_RULE_SET=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.body = sym[2];},
C700_css_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
C730_css_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
R1320_css_COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len > 1 ? [sym[0]].concat(sym[1]) : [sym[0]]},
R1570_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : sym[0],at_rules : []}},
R1571_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : [],at_rules : [sym[0]]}},
R1572_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].at_rules.push(sym[1]),sym[0])},
R1573_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].props.push(...sym[1]),sym[0])},
R1620_css_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
C1970_js_empty_statement=function (sym,env,lex,state,output,len) {this.type = "empty";},
R2030_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[8])},
I2031_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
I2032_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
R2033_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[7])},
R2034_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_in_statement(sym[2],sym[4],sym[6])},
R2035_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(sym[1],sym[3],sym[5],sym[7])},
R2036_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[7])},
R2037_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[7])},
R2038_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,sym[4],sym[6])},
R2039_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],null,sym[6])},
R20310_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(null,sym[2],sym[4],sym[6])},
R20311_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[6])},
R20312_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[6])},
R20313_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[6])},
R20314_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,null,sym[5])},
R20315_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[5])},
R2060_js_continue_statement=function (sym,env,lex,state,output,len) {return new env.functions.continue_statement(sym[1])},
R2070_js_break_statement=function (sym,env,lex,state,output,len) {return new env.functions.break_statement(sym[1])},
R2120_js_case_block=function (sym,env,lex,state,output,len) {return []},
R2121_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
R2122_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
R2130_js_case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
R2140_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1],sym[3])},
R2141_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1])},
R2150_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement(sym[2])},
R2151_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement()},
R2190_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2])},
R2191_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],null,sym[2])},
R2192_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2],sym[3])},
R2280_js_let_or_const=function (sym,env,lex,state,output,len) {return "let"},
R2281_js_let_or_const=function (sym,env,lex,state,output,len) {return "const"},
R2320_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],sym[6])},
R2321_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],sym[5])},
R2322_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,sym[5])},
R2323_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],null)},
R2324_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,sym[4])},
R2325_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],null)},
R2326_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,null)},
R2327_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,null)},
R2400_js_arrow_function=function (sym,env,lex,state,output,len) {return new fn.arrow(null,sym[0],sym[2])},
R2490_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail(sym)},
R2491_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([null,...sym[0]])},
R2492_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([sym[0],null,null])},
R2493_js_class_tail=function (sym,env,lex,state,output,len) {return null},
R2520_js_class_element_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1])},
R2530_js_class_element=function (sym,env,lex,state,output,len) {return (sym[1].static = true,sym[1])},
R2600_js_new_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],null)},
R2610_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],sym[2])},
R2670_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(sym[1])},
R2671_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(null)},
R2810_js_element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
R3010_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new env.functions.spread_expr(env,sym.slice(1,3))},
R3011_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env,sym.slice(3,5))),sym[1]) : [sym[0],new env.functions.spread_expr(env,sym.slice(3,5))]},
R3340_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
R3341_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
R3342_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
R3343_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},
R3344_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector("script",["on",null,new env.wick_binding(["on",null,sym[1]])],env,lex)},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [()=>(30),
()=>(42),
(...v)=>(redv(5,R00_S,1,0,...v)),
(...v)=>(redn(1031,1,...v)),
(...v)=>(redn(335879,1,...v)),
(...v)=>(redn(336903,1,...v)),
(...v)=>(redv(3079,R31_IMPORT_TAG_list,1,0,...v)),
()=>(78),
()=>(54),
()=>(82),
()=>(86),
()=>(58),
()=>(62),
()=>(74),
()=>(90),
()=>(94),
()=>(98),
()=>(102),
()=>(106),
()=>(110),
()=>(114),
()=>(118),
()=>(122),
()=>(126),
()=>(130),
()=>(134),
()=>(138),
()=>(142),
()=>(146),
()=>(150),
(...v)=>(redn(338951,1,...v)),
()=>(158),
()=>(398),
()=>(354),
()=>(402),
()=>(426),
()=>(406),
()=>(254),
()=>(262),
()=>(414),
()=>(422),
()=>(446),
()=>(294),
()=>(430),
()=>(310),
()=>(258),
()=>(242),
()=>(246),
()=>(250),
()=>(266),
()=>(274),
()=>(278),
()=>(390),
()=>(394),
()=>(386),
()=>(378),
()=>(382),
()=>(358),
(...v)=>(redv(336907,R40_html_BODY,2,0,...v)),
(...v)=>(redv(3083,R30_IMPORT_TAG_list,2,0,...v)),
()=>(478),
(...v)=>(redn(343047,1,...v)),
()=>(474),
()=>(470),
()=>(486),
()=>(494),
()=>(506),
()=>(502),
()=>(518),
()=>(514),
()=>(530),
()=>(534),
()=>(546),
()=>(550),
()=>(542),
()=>(538),
(...v)=>(redn(351239,1,...v)),
(...v)=>(redv(338955,R60_html_ATTRIBUTE_BODY,2,0,...v)),
()=>(554),
()=>(558),
(...v)=>(rednv(264199,fn.expression_list,1,0,...v)),
()=>(562),
(...v)=>(redv(263175,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(262151,1,...v)),
(...v)=>(redn(290823,1,...v)),
(...v)=>(redn(306183,1,...v)),
()=>(566),
()=>(618),
()=>(582),
()=>(586),
()=>(590),
()=>(594),
()=>(598),
()=>(602),
()=>(606),
()=>(610),
()=>(614),
()=>(622),
()=>(626),
()=>(574),
()=>(578),
(...v)=>(redn(292871,1,...v)),
()=>(634),
()=>(630),
(...v)=>(redn(293895,1,...v)),
()=>(638),
(...v)=>(redn(294919,1,...v)),
()=>(642),
(...v)=>(redn(295943,1,...v)),
()=>(646),
(...v)=>(redn(296967,1,...v)),
()=>(650),
(...v)=>(redn(297991,1,...v)),
()=>(654),
()=>(658),
()=>(662),
()=>(666),
(...v)=>(redn(299015,1,...v)),
()=>(670),
()=>(674),
()=>(678),
()=>(690),
()=>(682),
()=>(686),
(...v)=>(redn(300039,1,...v)),
()=>(694),
()=>(698),
()=>(702),
(...v)=>(redn(301063,1,...v)),
()=>(706),
()=>(710),
(...v)=>(redn(302087,1,...v)),
()=>(718),
()=>(722),
()=>(714),
(...v)=>(redn(303111,1,...v)),
(...v)=>(redn(304135,1,...v)),
(...v)=>(redn(305159,1,...v)),
()=>(726),
(...v)=>(redn(265223,1,...v)),
()=>(790),
()=>(794),
()=>(782),
(...v)=>(redn(266247,1,...v)),
()=>(798),
()=>(802),
()=>(818),
()=>(822),
(...v)=>(redn(267271,1,...v)),
(...v)=>(rednv(277511,fn.this_literal,1,0,...v)),
(...v)=>(redn(277511,1,...v)),
(...v)=>(rednv(277511,fn.array_literal,1,0,...v)),
(...v)=>(rednv(277511,fn.object_literal,1,0,...v)),
(...v)=>(redn(246791,1,...v)),
(...v)=>(redn(330759,1,...v)),
(...v)=>(redn(331783,1,...v)),
(...v)=>(redn(332807,1,...v)),
(...v)=>(rednv(334855,fn.identifier,1,0,...v)),
(...v)=>(redn(333831,1,...v)),
(...v)=>(redv(333831,R00_S,1,0,...v)),
(...v)=>(redn(320519,1,...v)),
(...v)=>(rednv(328711,fn.bool_literal,1,0,...v)),
(...v)=>(rednv(327687,fn.null_literal,1,0,...v)),
()=>(854),
()=>(846),
()=>(842),
()=>(862),
()=>(866),
()=>(858),
()=>(850),
()=>(834),
()=>(894),
()=>(886),
()=>(882),
()=>(902),
()=>(906),
()=>(898),
()=>(890),
()=>(874),
(...v)=>(rednv(326663,fn.numeric_literal,1,0,...v)),
()=>(918),
()=>(934),
()=>(930),
()=>(1002),
()=>(942),
()=>(946),
()=>(978),
()=>(982),
()=>(966),
(...v)=>(redn(236551,1,...v)),
()=>(1010),
(...v)=>(redn(252935,1,...v)),
()=>(1030),
()=>(1034),
()=>(1038),
()=>(1046),
()=>(1054),
()=>(1050),
(...v)=>(redn(269319,1,...v)),
(...v)=>(redn(271367,1,...v)),
()=>(1066),
()=>(1070),
()=>(1074),
(...v)=>(redv(347143,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(348167,fn.attribute,1,0,...v)),
()=>(1082),
()=>(1086),
()=>(1090),
(...v)=>(redn(349191,1,...v)),
()=>(1094),
()=>(1178),
(...v)=>((redn(58371,0,...v))),
()=>(1210),
()=>(1218),
()=>(1142),
()=>(1122),
()=>(1174),
()=>(1186),
()=>(1214),
()=>(1222),
()=>(1246),
()=>(1374),
()=>(1346),
()=>(1254),
()=>(1350),
()=>(1454),
()=>(1378),
()=>(1370),
()=>(1390),
()=>(1394),
()=>(1398),
()=>(1406),
()=>(1410),
()=>(1414),
()=>(1422),
()=>(1418),
()=>(1402),
()=>(1426),
()=>(1430),
()=>(1458),
()=>(1466),
()=>(1462),
()=>(1506),
()=>(1474),
(...v)=>(shftf(1526,I110_BASIC_BINDING,...v)),
()=>(1530),
()=>(1538),
()=>(1534),
(...v)=>(redv(342031,R3342_html_TAG,3,0,...v)),
()=>(1542),
()=>(1546),
()=>(1550),
(...v)=>(redv(352263,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(354311,1,...v)),
()=>(1562),
(...v)=>(rednv(306187,fn.post_increment_expression,2,0,...v)),
(...v)=>(rednv(306187,fn.post_decrement_expression,2,0,...v)),
(...v)=>(redn(291847,1,...v)),
(...v)=>(rednv(305163,fn.delete_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.void_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.typeof_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.plus_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.negate_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.unary_or_expression,2,0,...v)),
(...v)=>(rednv(305163,fn.unary_not_expression,2,0,...v)),
(...v)=>(rednv(306187,fn.pre_increment_expression,2,0,...v)),
(...v)=>(rednv(306187,fn.pre_decrement_expression,2,0,...v)),
(...v)=>(rednv(271371,fn.call_expression,2,0,...v)),
()=>(1694),
()=>(1690),
()=>(1710),
(...v)=>(rednv(251915,fn.call_expression,2,0,...v)),
(...v)=>(redv(266251,R2600_js_new_expression,2,0,...v)),
()=>(1726),
(...v)=>(redv(333835,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(1730),
(...v)=>(rednv(325643,fn.string_literal,2,0,...v)),
(...v)=>(redv(322567,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(321543,1,...v)),
()=>(1738),
(...v)=>(redv(324615,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(323591,1,...v)),
()=>(1750),
()=>(1754),
()=>(1758),
()=>(1770),
(...v)=>(redv(286731,R2493_js_class_tail,2,0,...v)),
(...v)=>(redv(287751,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(288775,1,...v)),
()=>(1778),
()=>(1782),
()=>(1786),
(...v)=>(redv(279563,R2493_js_class_tail,2,0,...v)),
(...v)=>(redv(278535,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(280583,1,...v)),
()=>(1794),
()=>(1806),
()=>(1802),
(...v)=>(redn(282631,1,...v)),
(...v)=>(redn(281607,1,...v)),
()=>(1826),
()=>(1886),
()=>(1834),
()=>(1882),
()=>(1850),
(...v)=>(rednv(253963,fn.class_statement,2,0,...v)),
()=>(1894),
()=>(1922),
()=>(1902),
()=>(1918),
(...v)=>(redv(308235,R2493_js_class_tail,2,0,...v)),
()=>(1934),
()=>(1938),
(...v)=>(redn(272395,2,...v)),
(...v)=>(rednv(307211,fn.await_expression,2,0,...v)),
()=>(1966),
()=>(1970),
(...v)=>(redv(5139,R50_IMPORT_TAG,4,0,...v)),
(...v)=>(redv(347147,R30_IMPORT_TAG_list,2,0,...v)),
()=>(1990),
()=>(1982),
()=>(1994),
()=>(1998),
()=>(2002),
()=>(2010),
(...v)=>(redn(53255,1,...v)),
(...v)=>(redn(58375,1,...v)),
(...v)=>(redv(55303,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(54279,1,...v)),
()=>(2030),
()=>(2034),
()=>(2046),
()=>(2042),
()=>(2038),
(...v)=>(redv(57351,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(56327,1,...v)),
()=>(2054),
()=>(2050),
()=>(2078),
(...v)=>(redv(59399,R31_IMPORT_TAG_list,1,0,...v)),
()=>(2098),
(...v)=>(redv(135175,R1320_css_COMPLEX_SELECTOR,1,0,...v)),
()=>(2102),
()=>(2106),
()=>(2110),
(...v)=>(rednv(140295,fn.compoundSelector,1,0,...v)),
()=>(2134),
(...v)=>(rednv(142343,fn.selector,1,0,...v)),
()=>(2142),
()=>(2138),
(...v)=>(redn(143367,1,...v)),
(...v)=>(redn(145415,1,...v)),
()=>(2146),
(...v)=>(redn(144391,1,...v)),
(...v)=>(redv(136199,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(146439,1,...v)),
()=>(2150),
()=>(2154),
()=>(2166),
()=>(2170),
()=>(2178),
(...v)=>(redv(139271,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(138247,1,...v)),
()=>(2190),
()=>(2194),
()=>(2198),
()=>(2206),
()=>(2210),
()=>(2214),
(...v)=>(redv(189447,R00_S,1,0,...v)),
(...v)=>(redn(190471,1,...v)),
(...v)=>(rednv(193543,fn.statements,1,0,...v)),
(...v)=>(redv(192519,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(191495,1,...v)),
(...v)=>(redn(194567,1,...v)),
()=>(2222),
(...v)=>(redn(195591,1,...v)),
()=>(2234),
(...v)=>(redn(199687,1,...v)),
()=>(2246),
(...v)=>(redn(329735,1,...v)),
()=>(2254),
(...v)=>(rednv(201735,C1970_js_empty_statement,1,0,...v)),
()=>(2274),
(...v)=>(redn(198663,1,...v)),
()=>(2282),
(...v)=>(shftf(2286,I2031_js_iteration_statement,...v)),
()=>(2290),
()=>(2294),
()=>(2298),
()=>(2310),
()=>(2318),
()=>(2326),
()=>(2338),
()=>(2342),
(...v)=>(redn(196615,1,...v)),
(...v)=>(redn(197639,1,...v)),
(...v)=>(redv(233479,R2280_js_let_or_const,1,0,...v)),
(...v)=>(redv(233479,R2281_js_let_or_const,1,0,...v)),
()=>(2366),
()=>(2370),
()=>(2374),
(...v)=>(redn(345095,1,...v)),
(...v)=>(redv(344071,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(346119,1,...v)),
(...v)=>(redv(346119,R2493_js_class_tail,1,0,...v)),
(...v)=>(rednv(14343,fn.text,1,0,...v)),
()=>(2422),
()=>(2410),
(...v)=>(redv(17415,R00_S,1,0,...v)),
()=>(2430),
(...v)=>(rednv(353287,fn.text,1,0,...v)),
(...v)=>(redn(10247,1,...v)),
(...v)=>(redv(342035,R3342_html_TAG,4,0,...v)),
(...v)=>(redv(342035,R50_IMPORT_TAG,4,0,...v)),
()=>(2438),
()=>(2442),
(...v)=>(redv(341011,R2493_js_class_tail,4,0,...v)),
(...v)=>(redv(352267,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(2450),
()=>(2454),
(...v)=>(redv(263183,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(290831,fn.assignment_expression,3,0,...v)),
()=>(2458),
(...v)=>(rednv(293903,fn.or_expression,3,0,...v)),
(...v)=>(rednv(294927,fn.and_expression,3,0,...v)),
(...v)=>(rednv(295951,fn.bit_or_expression,3,0,...v)),
(...v)=>(rednv(296975,fn.bit_xor_expression,3,0,...v)),
(...v)=>(rednv(297999,fn.bit_and_expression,3,0,...v)),
(...v)=>(rednv(299023,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(300047,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(300047,fn.instanceof_expression,3,0,...v)),
(...v)=>(rednv(300047,fn.in_expression,3,0,...v)),
(...v)=>(rednv(301071,fn.left_shift_expression,3,0,...v)),
(...v)=>(rednv(301071,fn.right_shift_expression,3,0,...v)),
(...v)=>(rednv(301071,fn.right_shift_fill_expression,3,0,...v)),
(...v)=>(rednv(302095,fn.add_expression,3,0,...v)),
(...v)=>(rednv(302095,fn.subtract_expression,3,0,...v)),
(...v)=>(rednv(303119,fn.multiply_expression,3,0,...v)),
(...v)=>(rednv(303119,fn.divide_expression,3,0,...v)),
(...v)=>(rednv(303119,fn.modulo_expression,3,0,...v)),
(...v)=>(rednv(304143,fn.exponent_expression,3,0,...v)),
(...v)=>(rednv(271375,fn.member_expression,3,0,...v)),
()=>(2462),
()=>(2470),
()=>(2466),
()=>(2474),
(...v)=>(redv(273419,R2671_js_arguments,2,0,...v)),
(...v)=>(redn(276487,1,...v)),
()=>(2478),
(...v)=>(redv(275463,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(274439,1,...v)),
()=>(2486),
(...v)=>(rednv(267279,fn.member_expression,3,0,...v)),
(...v)=>(redv(267279,R2610_js_member_expression,3,0,...v)),
(...v)=>(rednv(270351,fn.new_target_expression,3,0,...v)),
(...v)=>(rednv(325647,fn.string_literal,3,0,...v)),
(...v)=>(redv(322571,R430_md_BODY_SYMBOLS_list,2,0,...v)),
(...v)=>(redv(324619,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(2490),
(...v)=>(redv(286735,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(286735,R2493_js_class_tail,3,0,...v)),
(...v)=>(redv(287755,R2810_js_element_list,2,0,...v)),
(...v)=>(redn(288779,2,...v)),
(...v)=>(rednv(289803,fn.spread_element,2,0,...v)),
()=>(2506),
(...v)=>(redv(279567,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(279567,R2493_js_class_tail,3,0,...v)),
(...v)=>(rednv(284683,fn.binding,2,0,...v)),
(...v)=>(rednv(280587,fn.spread_expr,2,0,...v)),
()=>(2530),
()=>(2534),
()=>(2538),
()=>(2546),
()=>(2550),
()=>(2554),
(...v)=>(redn(239623,1,...v)),
()=>(2558),
(...v)=>(redn(241671,1,...v)),
(...v)=>(redv(240647,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(242695,1,...v)),
(...v)=>(redn(317447,1,...v)),
(...v)=>(redn(318471,1,...v)),
(...v)=>(redn(309255,1,...v)),
()=>(2578),
()=>(2590),
()=>(2606),
(...v)=>(rednv(253967,fn.class_statement,3,0,...v)),
()=>(2634),
()=>(2638),
(...v)=>(redv(254987,R2493_js_class_tail,2,0,...v)),
(...v)=>(redn(257031,1,...v)),
(...v)=>(redv(258055,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(259079,1,...v)),
(...v)=>(redv(256011,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redv(308239,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(2650),
()=>(2654),
()=>(2658),
()=>(2662),
(...v)=>(rednv(268303,fn.supper_expression,3,0,...v)),
()=>(2666),
(...v)=>(redv(245775,R2400_js_arrow_function,3,0,...v)),
(...v)=>(redn(247815,1,...v)),
(...v)=>(redv(5143,R50_IMPORT_TAG,5,0,...v)),
(...v)=>(rednv(348175,fn.attribute,3,0,...v)),
(...v)=>(redn(350215,1,...v)),
()=>(2698),
()=>(2702),
()=>(2722),
()=>(2718),
()=>(2714),
()=>(2710),
()=>(2706),
(...v)=>(redv(349199,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(2730),
()=>(2734),
(...v)=>(redn(58379,2,...v)),
(...v)=>(redv(55307,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(57355,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(63499,2,...v)),
()=>(2746),
()=>(2766),
()=>(2758),
()=>(2762),
()=>(2826),
()=>(2814),
()=>(2810),
()=>(2830),
()=>(2838),
()=>(2882),
()=>(2878),
()=>(2858),
()=>(2850),
()=>(2894),
()=>(2898),
(...v)=>(redv(160775,R1570_css_declaration_list,1,0,...v)),
()=>(2918),
(...v)=>(redv(160775,R1571_css_declaration_list,1,0,...v)),
(...v)=>(redv(157703,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(156679,1,...v)),
()=>(2922),
(...v)=>(redv(135179,R1320_css_COMPLEX_SELECTOR,2,0,...v)),
(...v)=>(redv(134151,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(133127,fn.comboSelector,1,0,...v)),
(...v)=>(redn(141319,1,...v)),
(...v)=>(rednv(140299,fn.compoundSelector,2,0,...v)),
(...v)=>(redv(136203,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(139275,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(rednv(142347,fn.selector,2,0,...v)),
(...v)=>(redn(145419,2,...v)),
(...v)=>(redn(144395,2,...v)),
(...v)=>(rednv(147467,fn.idSelector,2,0,...v)),
(...v)=>(rednv(148491,fn.classSelector,2,0,...v)),
()=>(2938),
()=>(2962),
()=>(2946),
()=>(2950),
()=>(2954),
()=>(2958),
(...v)=>(rednv(154635,fn.pseudoClassSelector,2,0,...v)),
()=>(2970),
(...v)=>(rednv(155659,fn.pseudoElementSelector,2,0,...v)),
(...v)=>(redn(138251,2,...v)),
(...v)=>(redv(137223,R31_IMPORT_TAG_list,1,0,...v)),
()=>(2978),
()=>(2982),
()=>(2986),
()=>(2990),
(...v)=>(redv(192523,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(195595,R00_S,2,0,...v)),
()=>(2994),
()=>(3010),
(...v)=>(rednv(202763,fn.expression_statement,2,0,...v)),
(...v)=>(rednv(221195,fn.label_statement,2,0,...v)),
()=>(3026),
()=>(3030),
(...v)=>(redv(230407,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(231431,fn.binding,1,0,...v)),
()=>(3046),
()=>(3066),
()=>(3078),
()=>(3094),
(...v)=>(rednv(210955,fn.continue_statement,2,0,...v)),
()=>(3102),
(...v)=>(rednv(211979,fn.break_statement,2,0,...v)),
()=>(3106),
(...v)=>(rednv(213003,fn.return_statement,2,0,...v)),
()=>(3110),
()=>(3118),
()=>(3130),
()=>(3134),
(...v)=>(rednv(228363,fn.debugger_statement,2,0,...v)),
()=>(3138),
()=>(3142),
(...v)=>(redv(234503,R31_IMPORT_TAG_list,1,0,...v)),
()=>(3154),
(...v)=>(redv(342039,R50_IMPORT_TAG,5,0,...v)),
()=>(3166),
(...v)=>(redv(344075,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(14347,R60_html_ATTRIBUTE_BODY,2,0,...v)),
()=>(3182),
(...v)=>(redv(19463,R31_IMPORT_TAG_list,1,0,...v)),
()=>(3198),
()=>(3214),
(...v)=>(redv(25607,R31_IMPORT_TAG_list,1,0,...v)),
()=>(3230),
(...v)=>(redv(17419,R00_S,2,0,...v)),
()=>(3234),
(...v)=>(redv(16391,R31_IMPORT_TAG_list,1,0,...v)),
()=>(3242),
()=>(3238),
()=>(3250),
()=>(3254),
(...v)=>(redv(342039,R3344_html_TAG,5,0,...v)),
(...v)=>(rednv(271379,fn.call_expression,4,0,...v)),
()=>(3262),
(...v)=>(redv(273423,R2670_js_arguments,3,0,...v)),
(...v)=>(redv(273423,R2671_js_arguments,3,0,...v)),
(...v)=>(rednv(274443,fn.spread_element,2,0,...v)),
(...v)=>(rednv(267283,fn.member_expression,4,0,...v)),
(...v)=>(redv(286739,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(287759,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(279571,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(278543,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(285707,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(rednv(280591,fn.property_binding,3,0,...v)),
()=>(3274),
(...v)=>(redn(238599,1,...v)),
()=>(3278),
(...v)=>(redv(283663,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(3290),
()=>(3294),
()=>(3298),
()=>(3306),
(...v)=>(redv(239627,R31_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(319499,2,...v)),
(...v)=>(redn(317451,2,...v)),
(...v)=>(redn(318475,2,...v)),
(...v)=>(redn(310283,2,...v)),
()=>(3322),
()=>(3330),
()=>(3326),
(...v)=>(redn(313351,1,...v)),
(...v)=>(redn(316423,1,...v)),
()=>(3338),
(...v)=>(redn(311307,2,...v)),
()=>(3346),
()=>(3354),
()=>(3358),
()=>(3362),
(...v)=>(redn(314375,1,...v)),
(...v)=>(redn(315399,1,...v)),
()=>(3366),
(...v)=>(redv(254991,R2492_js_class_tail,3,0,...v)),
(...v)=>(redv(254991,R2491_js_class_tail,3,0,...v)),
(...v)=>(redv(258059,R2520_js_class_element_list,2,0,...v)),
(...v)=>(redv(259083,R2530_js_class_element,2,0,...v)),
(...v)=>(redv(308243,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(308243,R3010_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv(268307,fn.supper_expression,4,0,...v)),
()=>(3378),
(...v)=>(redn(244743,1,...v)),
()=>(3382),
()=>(3386),
(...v)=>(redn(358407,1,...v)),
(...v)=>(redv(357383,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(356359,1,...v)),
(...v)=>(redn(359431,1,...v)),
()=>(3394),
()=>(3398),
()=>(3402),
()=>(3410),
(...v)=>(redn(69647,3,...v)),
()=>(3422),
(...v)=>(redv(64519,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(65543,1,...v)),
()=>(3434),
()=>(3446),
()=>(3462),
()=>(3458),
(...v)=>(redv(87047,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(91143,1,...v)),
()=>(3470),
()=>(3478),
(...v)=>(redn(93191,1,...v)),
(...v)=>(redn(92167,1,...v)),
()=>(3494),
()=>(3502),
()=>(3546),
()=>(3518),
()=>(3522),
(...v)=>(redn(101383,1,...v)),
(...v)=>(redn(120839,1,...v)),
()=>(3558),
(...v)=>(redn(89095,1,...v)),
()=>(3562),
(...v)=>(redn(72711,1,...v)),
()=>(3566),
(...v)=>(redn(81927,1,...v)),
()=>(3586),
()=>(3594),
()=>(3606),
(...v)=>(redn(82951,1,...v)),
(...v)=>(redn(83975,1,...v)),
()=>(3610),
()=>(3614),
()=>(3618),
(...v)=>(redv(59407,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(3622),
(...v)=>(rednv(60431,C590_css_RULE_SET,3,0,...v)),
(...v)=>(redv(160779,R1572_css_declaration_list,2,0,...v)),
(...v)=>(redv(160779,R1573_css_declaration_list,2,0,...v)),
()=>(3626),
(...v)=>(redv(159751,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(158727,1,...v)),
(...v)=>(redv(160779,R1570_css_declaration_list,2,0,...v)),
()=>(3650),
()=>(3654),
()=>(3642),
(...v)=>(redv(134155,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(133131,fn.comboSelector,2,0,...v)),
(...v)=>(rednv(140303,fn.compoundSelector,3,0,...v)),
(...v)=>(rednv(150543,fn.attribSelector,3,0,...v)),
()=>(3662),
()=>(3666),
()=>(3670),
(...v)=>(redn(151559,1,...v)),
(...v)=>(rednv(154639,fn.pseudoClassSelector,3,0,...v)),
(...v)=>(redv(137227,R30_IMPORT_TAG_list,2,0,...v)),
()=>(3678),
()=>(3682),
()=>(3686),
(...v)=>(redv(342043,R3342_html_TAG,6,0,...v)),
(...v)=>(rednv(200719,fn.block_statement,3,0,...v)),
(...v)=>(redv(222219,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redn(223239,1,...v)),
(...v)=>(rednv(229391,fn.variable_statement,3,0,...v)),
(...v)=>(rednv(231435,fn.binding,2,0,...v)),
()=>(3698),
()=>(3702),
()=>(3706),
()=>(3710),
()=>(3718),
()=>(3722),
()=>(3730),
()=>(3734),
(...v)=>(redn(204807,1,...v)),
(...v)=>(redn(206855,1,...v)),
(...v)=>(redn(205831,1,...v)),
()=>(3774),
()=>(3786),
(...v)=>(redv(210959,R2060_js_continue_statement,3,0,...v)),
(...v)=>(redv(211983,R2070_js_break_statement,3,0,...v)),
(...v)=>(rednv(213007,fn.return_statement,3,0,...v)),
()=>(3790),
(...v)=>(rednv(214031,fn.throw_statement,3,0,...v)),
(...v)=>(redv(224271,R2190_js_try_statement,3,0,...v)),
(...v)=>(redv(224271,R2191_js_try_statement,3,0,...v)),
()=>(3798),
(...v)=>(rednv(232463,fn.lexical,3,0,...v)),
(...v)=>(rednv(235531,fn.binding,2,0,...v)),
()=>(3814),
()=>(3818),
()=>(3826),
(...v)=>(redv(23563,R231_md_UNORDERED_LIST_ITEMS,2,0,...v)),
(...v)=>(redv(19467,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(22535,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(21511,1,...v)),
(...v)=>(redn(18443,2,...v)),
()=>(3838),
(...v)=>(redv(29707,R291_md_BLOCK_QUOTES,2,0,...v)),
(...v)=>(redv(25611,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(28679,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(27655,1,...v)),
(...v)=>(redn(24587,2,...v)),
(...v)=>(redv(16395,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(rednv(11279,fn.wick_binding,3,0,...v)),
()=>(3850),
(...v)=>(redv(342043,R3343_html_TAG,6,0,...v)),
(...v)=>(redv(342043,R91_html_TAG,6,0,...v)),
(...v)=>(rednv(292887,fn.condition_expression,5,0,...v)),
(...v)=>(redv(273427,R2670_js_arguments,4,0,...v)),
(...v)=>(redv(275471,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(287763,R580_css_COMPLEX_SELECTOR_list,4,0,...v)),
()=>(3854),
()=>(3858),
()=>(3862),
(...v)=>(redn(261127,1,...v)),
()=>(3866),
()=>(3874),
()=>(3882),
()=>(3886),
(...v)=>(redv(237591,R2327_js_function_declaration,5,0,...v)),
(...v)=>(redn(243719,1,...v)),
(...v)=>(redv(239631,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(240655,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(310287,3,...v)),
()=>(3894),
(...v)=>(redn(312331,2,...v)),
()=>(3906),
(...v)=>(redn(311311,3,...v)),
(...v)=>(redn(315403,2,...v)),
()=>(3910),
(...v)=>(redv(254995,R2490_js_class_tail,4,0,...v)),
()=>(3926),
()=>(3930),
(...v)=>(redv(247823,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(350223,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(355343,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(357387,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(3934),
(...v)=>(redv(342047,R3341_html_TAG,7,0,...v)),
(...v)=>(redn(69651,4,...v)),
(...v)=>(redv(64523,R30_IMPORT_TAG_list,2,0,...v)),
()=>(3950),
()=>(3954),
(...v)=>(redv(129031,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(128007,1,...v)),
()=>(3962),
(...v)=>(redv(131079,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(130055,1,...v)),
(...v)=>(redn(126987,2,...v)),
(...v)=>(redn(125959,1,...v)),
(...v)=>((redn(62467,0,...v))),
(...v)=>(redn(91147,2,...v)),
(...v)=>(redn(97291,2,...v)),
(...v)=>(redn(100363,2,...v)),
(...v)=>(redv(96263,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(99335,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(94219,2,...v)),
()=>(4014),
()=>(4018),
()=>(4038),
()=>(4034),
(...v)=>(redn(119815,1,...v)),
()=>(4026),
(...v)=>(redn(102407,1,...v)),
()=>(4050),
()=>(4054),
()=>(4058),
()=>(4062),
()=>(4042),
()=>(4078),
()=>(4082),
()=>(4086),
()=>(4090),
(...v)=>(redn(117767,1,...v)),
()=>(4098),
()=>(4102),
()=>(4106),
()=>(4110),
()=>(4130),
()=>(4126),
()=>(4118),
()=>(4162),
()=>(4150),
()=>(4154),
(...v)=>(redn(81931,2,...v)),
(...v)=>(redv(78855,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(80903,R31_IMPORT_TAG_list,1,0,...v)),
()=>(4186),
()=>(4190),
()=>(4198),
(...v)=>(rednv(60435,C590_css_RULE_SET,4,0,...v)),
(...v)=>(redv(160783,R1573_css_declaration_list,3,0,...v)),
(...v)=>(redv(157711,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(162831,fn.parseDeclaration,3,0,...v)),
()=>(4214),
(...v)=>(redn(165895,1,...v)),
(...v)=>(redv(164871,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(163847,1,...v)),
()=>(4230),
()=>(4234),
()=>(4238),
(...v)=>(redn(149511,1,...v)),
(...v)=>(redn(151563,2,...v)),
()=>(4242),
()=>(4246),
(...v)=>(redv(342047,R50_IMPORT_TAG,7,0,...v)),
(...v)=>(redv(230415,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(4266),
()=>(4270),
()=>(4278),
()=>(4286),
(...v)=>(shftf(4294,I2032_js_iteration_statement,...v)),
(...v)=>(redv(204811,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redv(205835,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redv(206859,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redn(209927,1,...v)),
(...v)=>(redn(208907,2,...v)),
()=>(4302),
()=>(4322),
(...v)=>(redv(224275,R2192_js_try_statement,4,0,...v)),
(...v)=>(rednv(226315,fn.finally_statement,2,0,...v)),
(...v)=>(redv(234511,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(4342),
(...v)=>(redv(23567,R230_md_UNORDERED_LIST_ITEMS,3,0,...v)),
(...v)=>(redv(22539,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(29711,R290_md_BLOCK_QUOTES,3,0,...v)),
(...v)=>(redv(28683,R30_IMPORT_TAG_list,2,0,...v)),
()=>(4346),
(...v)=>(redv(342047,R3340_html_TAG,7,0,...v)),
()=>(4358),
()=>(4366),
()=>(4370),
(...v)=>(redv(237595,R2326_js_function_declaration,6,0,...v)),
()=>(4374),
(...v)=>(redv(237595,R2325_js_function_declaration,6,0,...v)),
(...v)=>(redv(237595,R2324_js_function_declaration,6,0,...v)),
()=>(4378),
(...v)=>(redn(310291,4,...v)),
(...v)=>(redn(313359,3,...v)),
(...v)=>(redn(316431,3,...v)),
(...v)=>(redn(311315,4,...v)),
()=>(4382),
()=>(4390),
(...v)=>(redn(314383,3,...v)),
(...v)=>(redv(308251,R3011_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
(...v)=>(redv(342051,R90_html_TAG,8,0,...v)),
(...v)=>(redn(69655,5,...v)),
()=>(4410),
(...v)=>(redn(132111,3,...v)),
(...v)=>(redv(129035,R430_md_BODY_SYMBOLS_list,2,0,...v)),
(...v)=>(redv(131083,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(4414),
(...v)=>(redn(62471,1,...v)),
(...v)=>(redv(61447,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(87055,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(91151,3,...v)),
(...v)=>(redn(90123,2,...v)),
(...v)=>(redv(96267,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(99339,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(95243,2,...v)),
(...v)=>(redn(98315,2,...v)),
(...v)=>(redn(101391,3,...v)),
(...v)=>(redn(103439,3,...v)),
()=>(4422),
(...v)=>(redn(108559,3,...v)),
(...v)=>(redv(107527,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(106503,1,...v)),
()=>(4438),
(...v)=>(redn(110599,1,...v)),
()=>(4446),
()=>(4454),
()=>(4458),
(...v)=>(redn(111623,1,...v)),
()=>(4462),
(...v)=>(redn(124939,2,...v)),
()=>(4466),
(...v)=>(redn(123911,1,...v)),
()=>(4470),
(...v)=>(redv(105479,R431_md_BODY_SYMBOLS_list,1,0,...v)),
(...v)=>(redn(104455,1,...v)),
()=>(4478),
(...v)=>(redv(70663,R31_IMPORT_TAG_list,1,0,...v)),
()=>(4490),
()=>(4486),
(...v)=>(redv(73735,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(75783,1,...v)),
()=>(4494),
()=>(4498),
(...v)=>(redv(78859,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(80907,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(77835,2,...v)),
(...v)=>(redn(79883,2,...v)),
(...v)=>(redn(82959,3,...v)),
(...v)=>(redn(85007,3,...v)),
()=>(4502),
(...v)=>(rednv(60439,C590_css_RULE_SET,5,0,...v)),
(...v)=>(redv(159759,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(162835,fn.parseDeclaration,4,0,...v)),
(...v)=>(redv(165899,R1620_css_declaration_values,2,0,...v)),
()=>(4506),
(...v)=>(redv(164875,R430_md_BODY_SYMBOLS_list,2,0,...v)),
()=>(4510),
()=>(4514),
(...v)=>(rednv(150551,fn.attribSelector,5,0,...v)),
(...v)=>(redn(152583,1,...v)),
(...v)=>(redn(153615,3,...v)),
(...v)=>(rednv(203799,fn.if_statement,5,0,...v)),
()=>(4518),
()=>(4522),
(...v)=>(rednv(207895,fn.while_statement,5,0,...v)),
()=>(4526),
(...v)=>(shftf(4534,I2032_js_iteration_statement,...v)),
()=>(4542),
()=>(4546),
()=>(4554),
(...v)=>(shftf(4562,I2032_js_iteration_statement,...v)),
(...v)=>(shftf(4566,I2032_js_iteration_statement,...v)),
()=>(4574),
(...v)=>(rednv(216087,fn.switch_statement,5,0,...v)),
()=>(4582),
()=>(4602),
()=>(4598),
(...v)=>(rednv(215063,fn.with_statement,5,0,...v)),
()=>(4606),
(...v)=>(redn(227335,1,...v)),
(...v)=>(rednv(12311,fn.wick_binding,5,0,...v)),
()=>(4610),
()=>(4614),
()=>(4622),
(...v)=>(redv(237599,R2323_js_function_declaration,7,0,...v)),
(...v)=>(redv(237599,R2322_js_function_declaration,7,0,...v)),
(...v)=>(redv(237599,R2321_js_function_declaration,7,0,...v)),
(...v)=>(redn(310295,5,...v)),
(...v)=>(redn(311319,5,...v)),
()=>(4626),
(...v)=>(redn(69659,6,...v)),
()=>(4630),
(...v)=>(redn(66567,1,...v)),
(...v)=>(redn(88091,6,...v)),
(...v)=>(redv(61451,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(108563,4,...v)),
(...v)=>(redv(107531,R430_md_BODY_SYMBOLS_list,2,0,...v)),
(...v)=>(redn(109583,3,...v)),
(...v)=>(redn(116751,3,...v)),
(...v)=>(redn(110603,2,...v)),
()=>(4638),
()=>(4646),
()=>(4650),
(...v)=>(redn(111627,2,...v)),
(...v)=>(redn(121871,3,...v)),
(...v)=>(redv(105483,R430_md_BODY_SYMBOLS_list,2,0,...v)),
(...v)=>(rednv(71707,C700_css_keyframes,6,0,...v)),
(...v)=>(redv(70667,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(122891,2,...v)),
(...v)=>(redn(76827,6,...v)),
(...v)=>(redn(86035,4,...v)),
(...v)=>(redn(161803,2,...v)),
(...v)=>(redv(165903,R1620_css_declaration_values,3,0,...v)),
(...v)=>(rednv(150555,fn.attribSelector,6,0,...v)),
()=>(4666),
(...v)=>(shftf(4674,I2032_js_iteration_statement,...v)),
(...v)=>(shftf(4678,I2032_js_iteration_statement,...v)),
()=>(4686),
(...v)=>(redv(207899,R20314_js_iteration_statement,6,0,...v)),
(...v)=>(shftf(4702,I2032_js_iteration_statement,...v)),
(...v)=>(redv(207899,R20315_js_iteration_statement,6,0,...v)),
()=>(4718),
(...v)=>(redv(217099,R2120_js_case_block,2,0,...v)),
()=>(4726),
()=>(4738),
(...v)=>(redv(218119,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(220167,R2151_js_default_clause,1,0,...v)),
()=>(4746),
(...v)=>(rednv(260127,fn.class_method,7,0,...v)),
(...v)=>(rednv(260127,fn.class_get_method,7,0,...v)),
()=>(4754),
(...v)=>(redv(237603,R2320_js_function_declaration,8,0,...v)),
(...v)=>(redn(311323,6,...v)),
(...v)=>(redn(67603,4,...v)),
(...v)=>(redn(113671,1,...v)),
()=>(4762),
(...v)=>(redn(115719,1,...v)),
()=>(4770),
()=>(4774),
(...v)=>(redv(73743,R580_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(203807,fn.if_statement,7,0,...v)),
(...v)=>(rednv(207903,fn.do_while_statement,7,0,...v)),
(...v)=>(shftf(4778,I2032_js_iteration_statement,...v)),
(...v)=>(redv(207903,R20313_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R2039_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R2038_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R2034_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R20312_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R20311_js_iteration_statement,7,0,...v)),
(...v)=>(redv(207903,R20310_js_iteration_statement,7,0,...v)),
()=>(4806),
(...v)=>(redv(217103,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(218123,R2130_js_case_clauses,2,0,...v)),
()=>(4810),
()=>(4814),
(...v)=>(rednv(225303,fn.catch_statement,5,0,...v)),
(...v)=>(rednv(260131,fn.class_set_method,8,0,...v)),
(...v)=>(redn(116759,5,...v)),
(...v)=>(redn(113675,2,...v)),
()=>(4822),
(...v)=>(rednv(74771,C730_css_keyframes_blocks,4,0,...v)),
(...v)=>(redv(207907,R2037_js_iteration_statement,8,0,...v)),
(...v)=>(redv(207907,R2036_js_iteration_statement,8,0,...v)),
(...v)=>(redv(207907,R2033_js_iteration_statement,8,0,...v)),
(...v)=>(redv(207907,R2035_js_iteration_statement,8,0,...v)),
()=>(4830),
(...v)=>(redv(217107,R2122_js_case_block,4,0,...v)),
(...v)=>(redv(219151,R2141_js_case_clause,3,0,...v)),
(...v)=>(redv(220175,R2150_js_default_clause,3,0,...v)),
(...v)=>(rednv(74775,C730_css_keyframes_blocks,5,0,...v)),
(...v)=>(redv(207911,R2030_js_iteration_statement,9,0,...v)),
(...v)=>(redv(217111,R2121_js_case_block,5,0,...v)),
(...v)=>(redv(219155,R2140_js_case_clause,4,0,...v))],

    //Goto Lookup Functions
    goto = [v=>lsm(v,gt0),
nf,
nf,
nf,
v=>lsm(v,gt1),
nf,
nf,
v=>lsm(v,gt2),
nf,
v=>lsm(v,gt3),
v=>lsm(v,gt4),
nf,
nf,
v=>lsm(v,gt5),
v=>lsm(v,gt6),
v=>lsm(v,gt7),
v=>lsm(v,gt8),
v=>lsm(v,gt9),
v=>lsm(v,gt10),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt2),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt11),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt12),
v=>lsm(v,gt13),
v=>lsm(v,gt14),
v=>lsm(v,gt15),
v=>lsm(v,gt16),
v=>lsm(v,gt17),
v=>lsm(v,gt18),
nf,
v=>lsm(v,gt19),
v=>lsm(v,gt20),
nf,
v=>lsm(v,gt21),
v=>lsm(v,gt22),
v=>lsm(v,gt23),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt24),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt25),
v=>lsm(v,gt26),
nf,
v=>lsm(v,gt27),
v=>lsm(v,gt28),
nf,
v=>lsm(v,gt29),
nf,
v=>lsm(v,gt30),
v=>lsm(v,gt31),
v=>lsm(v,gt32),
nf,
nf,
nf,
v=>lsm(v,gt33),
nf,
nf,
v=>lsm(v,gt34),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt34),
v=>lsm(v,gt35),
v=>lsm(v,gt34),
v=>lsm(v,gt36),
v=>lsm(v,gt34),
v=>lsm(v,gt37),
nf,
v=>lsm(v,gt34),
nf,
nf,
v=>lsm(v,gt38),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt39),
v=>lsm(v,gt40),
v=>lsm(v,gt41),
v=>lsm(v,gt42),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt43),
v=>lsm(v,gt44),
v=>lsm(v,gt45),
v=>lsm(v,gt46),
v=>lsm(v,gt47),
v=>lsm(v,gt48),
v=>lsm(v,gt49),
v=>lsm(v,gt50),
v=>lsm(v,gt51),
v=>lsm(v,gt52),
v=>lsm(v,gt53),
v=>lsm(v,gt54),
v=>lsm(v,gt55),
v=>lsm(v,gt56),
v=>lsm(v,gt57),
v=>lsm(v,gt58),
v=>lsm(v,gt59),
v=>lsm(v,gt60),
v=>lsm(v,gt61),
v=>lsm(v,gt62),
v=>lsm(v,gt63),
v=>lsm(v,gt64),
v=>lsm(v,gt65),
v=>lsm(v,gt66),
v=>lsm(v,gt67),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt68),
nf,
v=>lsm(v,gt69),
v=>lsm(v,gt70),
v=>lsm(v,gt71),
v=>lsm(v,gt72),
nf,
nf,
v=>lsm(v,gt73),
nf,
nf,
nf,
v=>lsm(v,gt74),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt75),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt76),
v=>lsm(v,gt77),
nf,
nf,
nf,
v=>lsm(v,gt78),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt79),
nf,
v=>lsm(v,gt80),
nf,
nf,
v=>lsm(v,gt81),
v=>lsm(v,gt82),
nf,
nf,
nf,
nf,
v=>lsm(v,gt83),
nf,
v=>lsm(v,gt84),
nf,
v=>lsm(v,gt85),
nf,
nf,
v=>lsm(v,gt86),
v=>lsm(v,gt87),
nf,
nf,
v=>lsm(v,gt88),
v=>lsm(v,gt89),
v=>lsm(v,gt90),
nf,
nf,
v=>lsm(v,gt91),
nf,
nf,
nf,
v=>lsm(v,gt92),
nf,
nf,
v=>lsm(v,gt93),
nf,
nf,
v=>lsm(v,gt94),
v=>lsm(v,gt95),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt96),
nf,
v=>lsm(v,gt97),
v=>lsm(v,gt98),
v=>lsm(v,gt99),
v=>lsm(v,gt100),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt101),
v=>lsm(v,gt102),
nf,
v=>lsm(v,gt103),
nf,
nf,
nf,
v=>lsm(v,gt104),
nf,
nf,
nf,
nf,
v=>lsm(v,gt105),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt2),
v=>lsm(v,gt106),
nf,
nf,
nf,
v=>lsm(v,gt107),
v=>lsm(v,gt108),
nf,
nf,
nf,
nf,
v=>lsm(v,gt109),
nf,
nf,
nf,
v=>lsm(v,gt110),
v=>lsm(v,gt111),
v=>lsm(v,gt112),
nf,
v=>lsm(v,gt113),
v=>lsm(v,gt114),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt115),
nf,
nf,
v=>lsm(v,gt116),
nf,
nf,
v=>lsm(v,gt117),
v=>lsm(v,gt118),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt119),
v=>lsm(v,gt120),
nf,
v=>lsm(v,gt38),
nf,
nf,
v=>lsm(v,gt121),
nf,
nf,
nf,
v=>lsm(v,gt122),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt123),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt124),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt125),
nf,
nf,
nf,
v=>lsm(v,gt126),
nf,
v=>lsm(v,gt127),
v=>lsm(v,gt128),
nf,
nf,
nf,
nf,
v=>lsm(v,gt129),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt130),
nf,
nf,
nf,
v=>lsm(v,gt131),
v=>lsm(v,gt132),
nf,
nf,
v=>lsm(v,gt133),
v=>lsm(v,gt134),
nf,
v=>lsm(v,gt135),
nf,
nf,
v=>lsm(v,gt136),
nf,
nf,
v=>lsm(v,gt137),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt138),
nf,
nf,
nf,
v=>lsm(v,gt139),
nf,
nf,
v=>lsm(v,gt140),
nf,
nf,
nf,
nf,
v=>lsm(v,gt95),
nf,
nf,
nf,
nf,
v=>lsm(v,gt141),
v=>lsm(v,gt142),
v=>lsm(v,gt143),
v=>lsm(v,gt144),
v=>lsm(v,gt145),
v=>lsm(v,gt146),
v=>lsm(v,gt147),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt148),
nf,
v=>lsm(v,gt149),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt150),
v=>lsm(v,gt100),
v=>lsm(v,gt100),
nf,
nf,
v=>lsm(v,gt102),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt151),
nf,
nf,
v=>lsm(v,gt152),
nf,
nf,
v=>lsm(v,gt153),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt154),
nf,
nf,
nf,
nf,
v=>lsm(v,gt155),
nf,
nf,
v=>lsm(v,gt156),
v=>lsm(v,gt157),
v=>lsm(v,gt158),
nf,
v=>lsm(v,gt159),
v=>lsm(v,gt160),
nf,
v=>lsm(v,gt161),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt162),
nf,
v=>lsm(v,gt163),
v=>lsm(v,gt164),
nf,
nf,
nf,
v=>lsm(v,gt165),
v=>lsm(v,gt166),
nf,
v=>lsm(v,gt167),
nf,
v=>lsm(v,gt168),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt169),
nf,
nf,
v=>lsm(v,gt170),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt171),
nf,
nf,
nf,
nf,
v=>lsm(v,gt172),
nf,
nf,
nf,
nf,
v=>lsm(v,gt173),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt174),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt175),
nf,
nf,
nf,
nf,
v=>lsm(v,gt176),
v=>lsm(v,gt177),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt178),
nf,
nf,
nf,
nf,
v=>lsm(v,gt179),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt180),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt181),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt182),
v=>lsm(v,gt183),
nf,
nf,
nf,
v=>lsm(v,gt184),
v=>lsm(v,gt185),
v=>lsm(v,gt186),
nf,
nf,
nf,
v=>lsm(v,gt187),
v=>lsm(v,gt188),
nf,
nf,
nf,
nf,
v=>lsm(v,gt189),
v=>lsm(v,gt190),
v=>lsm(v,gt191),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt192),
v=>lsm(v,gt193),
v=>lsm(v,gt194),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt147),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt195),
v=>lsm(v,gt196),
nf,
nf,
v=>lsm(v,gt100),
nf,
v=>lsm(v,gt197),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt198),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt79),
nf,
nf,
v=>lsm(v,gt199),
nf,
nf,
nf,
nf,
v=>lsm(v,gt200),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt201),
nf,
v=>lsm(v,gt202),
nf,
nf,
v=>lsm(v,gt203),
v=>lsm(v,gt11),
v=>lsm(v,gt204),
nf,
v=>lsm(v,gt205),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt206),
nf,
nf,
v=>lsm(v,gt207),
nf,
v=>lsm(v,gt208),
nf,
nf,
v=>lsm(v,gt209),
nf,
nf,
nf,
v=>lsm(v,gt210),
v=>lsm(v,gt211),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt212),
v=>lsm(v,gt213),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt214),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt215),
v=>lsm(v,gt216),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt217),
nf,
v=>lsm(v,gt218),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt219),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt220),
nf,
v=>lsm(v,gt221),
nf,
nf,
v=>lsm(v,gt222),
nf,
nf,
v=>lsm(v,gt223),
nf,
nf,
nf,
nf,
v=>lsm(v,gt224),
v=>lsm(v,gt225),
v=>lsm(v,gt226),
nf,
nf,
v=>lsm(v,gt227),
v=>lsm(v,gt228),
v=>lsm(v,gt229),
nf,
v=>lsm(v,gt230),
nf,
v=>lsm(v,gt231),
nf,
nf,
nf,
v=>lsm(v,gt232),
v=>lsm(v,gt190),
nf,
nf,
nf,
v=>lsm(v,gt233),
v=>lsm(v,gt234),
v=>lsm(v,gt235),
nf,
nf,
v=>lsm(v,gt236),
v=>lsm(v,gt237),
v=>lsm(v,gt238),
nf,
v=>lsm(v,gt239),
v=>lsm(v,gt240),
nf,
v=>lsm(v,gt241),
nf,
v=>lsm(v,gt242),
nf,
nf,
v=>lsm(v,gt232),
v=>lsm(v,gt243),
nf,
nf,
nf,
v=>lsm(v,gt244),
nf,
v=>lsm(v,gt245),
v=>lsm(v,gt246),
v=>lsm(v,gt247),
nf,
nf,
nf,
v=>lsm(v,gt248),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt249),
v=>lsm(v,gt250),
v=>lsm(v,gt251),
v=>lsm(v,gt252),
nf,
v=>lsm(v,gt253),
v=>lsm(v,gt254),
nf,
v=>lsm(v,gt255),
v=>lsm(v,gt256),
nf,
nf,
v=>lsm(v,gt156),
v=>lsm(v,gt157),
nf,
v=>lsm(v,gt165),
v=>lsm(v,gt166),
nf,
nf,
v=>lsm(v,gt257),
nf,
v=>lsm(v,gt258),
v=>lsm(v,gt259),
v=>lsm(v,gt260),
nf,
v=>lsm(v,gt261),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt211),
nf,
nf,
v=>lsm(v,gt213),
nf,
nf,
nf,
nf,
v=>lsm(v,gt262),
v=>lsm(v,gt263),
nf,
v=>lsm(v,gt264),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt265),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt266),
nf,
nf,
v=>lsm(v,gt267),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt268),
nf,
nf,
nf,
nf,
v=>lsm(v,gt269),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt270),
nf,
nf,
nf,
nf,
v=>lsm(v,gt271),
v=>lsm(v,gt272),
nf,
nf,
nf,
nf,
v=>lsm(v,gt273),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt274),
nf,
nf,
nf,
nf,
v=>lsm(v,gt275),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt276),
nf,
nf,
v=>lsm(v,gt276),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt277),
v=>lsm(v,gt278),
nf,
v=>lsm(v,gt279),
nf,
v=>lsm(v,gt280),
nf,
v=>lsm(v,gt281),
nf,
v=>lsm(v,gt282),
nf,
nf,
nf,
nf,
v=>lsm(v,gt283),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt284),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt285),
v=>lsm(v,gt286),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt287),
v=>lsm(v,gt288),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt289),
nf,
v=>lsm(v,gt290),
nf,
v=>lsm(v,gt291),
nf,
v=>lsm(v,gt292),
v=>lsm(v,gt293),
nf,
v=>lsm(v,gt294),
nf,
v=>lsm(v,gt295),
v=>lsm(v,gt296),
nf,
v=>lsm(v,gt297),
nf,
nf,
v=>lsm(v,gt298),
v=>lsm(v,gt299),
nf,
v=>lsm(v,gt300),
nf,
v=>lsm(v,gt301),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt302),
nf,
v=>lsm(v,gt303),
nf,
nf,
v=>lsm(v,gt147),
nf,
nf,
nf,
nf,
v=>lsm(v,gt304),
v=>lsm(v,gt305),
nf,
v=>lsm(v,gt306),
nf,
nf,
nf,
v=>lsm(v,gt307),
nf,
nf,
nf,
v=>lsm(v,gt308),
v=>lsm(v,gt309),
nf,
nf,
v=>lsm(v,gt310),
nf,
nf,
v=>lsm(v,gt311),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt312),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt313),
nf,
nf,
nf,
nf,
nf];

function getToken(l, SYM_LU) {
    if (l.END) return 0; /*6*/

    switch (l.ty) {
        case 2:
            if (SYM_LU.has(l.tx)) return SYM_LU.get(l.tx);
            return 2;
        case 1:
            return 1;
        case 4:
            return 3;
        case 256:
            return 9;
        case 8:
            return 4;
        case 512:
            return 10;
        default:
            return SYM_LU.get(l.tx) || SYM_LU.get(l.ty);
    }
}

/************ Parser *************/

function parser(l, e = {}) {
    
    fn = e.functions;

    l.IWS = false;
    l.PARSE_STRING = true;

    if (symbols.length > 0) {
        symbols.forEach(s => { l.addSymbol(s); });
        l.tl = 0;
        l.next();
    }

    const o = [],
        ss = [0, 0];

    let time = 1000000,
        RECOVERING = 100,
        tk = getToken(l, lu),
        p = l.copy(),
        sp = 1,
        len = 0,
        off = 0;

    outer:

        while (time-- > 0) {

            const fn = lsm(tk, state[ss[sp]]) || 0;

            /*@*/// console.log({end:l.END, state:ss[sp], tx:l.tx, ty:l.ty, tk:tk, rev:rlu.get(tk), s_map:state[ss[sp]], res:lsm(tk, state[ss[sp]])});

            let r,
                gt = -1;

            if (fn == 0) {
                /*Ignore the token*/
                l.next();
                tk = getToken(l, lu);
                continue;
            }

            if (fn > 0) {
                r = state_funct[fn - 1](tk, e, o, l, ss[sp - 1]);
            } else {
                
                if(l.ty == 8 && l.tl > 1){ 
                    // Make sure that special tokens are not getting in the way
                    l.tl = 0;
                    // This will skip the generation of a custom symbol
                    l.next(l, false);
                    console.log(1);
                    if(l.tl == 0)
                        continue;
                }

                if (RECOVERING > 1 && !l.END) {



                    if (tk !== lu.get(l.ty)) {
                        //console.log("ABLE", rlu.get(tk), l.tx, tk )
                        tk = lu.get(l.ty);
                        continue;
                    }

                    if (tk !== 13) {
                        //console.log("MABLE")
                        tk = 13;
                        RECOVERING = 1;
                        continue;
                    }
                }

                tk = getToken(l, lu);

                const recovery_token = eh[ss[sp]](tk, e, o, l, p, ss[sp], lu);

                if (RECOVERING > 0 && recovery_token) {
                    RECOVERING = -1; /* To prevent infinite recursion */
                    tk = recovery_token;
                    l.tl = 0; /*reset current token */
                    continue;
                }
            }

            switch (r & 3) {
                case 0:
                    /* ERROR */

                    if (tk == "$eof")
                        l.throw("Unexpected end of input");
                    l.throw(`Unexpected token [${RECOVERING ? l.next().tx : l.tx}]`);
                    return [null];

                case 1:
                    /* ACCEPT */
                    break outer;

                case 2:
                    /*SHIFT */
                    o.push(l.tx);
                    ss.push(off, r >> 2);
                    sp += 2;
                    p.sync(l);
                    l.next();
                    off = l.off;
                    tk = getToken(l, lu);
                    RECOVERING++;
                    break;

                case 3:
                    /* REDUCE */

                    len = (r & 0x3FC) >> 1;

                    ss.length -= len;
                    sp -= len;
                    gt = goto[ss[sp]](r >> 10);

                    if (gt < 0)
                        l.throw("Invalid state reached!");

                    ss.push(off, gt);
                    sp += 2;
                    break;
            }
        }
    return o[0];
};

// This prevents env variable access conflicts when concurrent compilation
// are processing text data. 

class CompilerEnvironment {
    constructor(presets, env, url) {
        this.functions = env.functions;
        this.prst = [presets];
        this.url = "";
        this.pending = 0;
        this.parent = null;
        this.ASI = true; // Automatic Semi-Colon Insertion
        this.pendingResolvedFunction = () => {};
    }

    pushPresets(prst) {
        this.prst.push(prst);
    }

    popPresets() {
        return this.prst.pop();
    }

    get presets() {
        return this.prst[this.prst.length - 1] || null;
    }

    setParent(parent){
        this.parent = parent;
        parent.pending++;
    }

    resolve() {
        this.pending--;
        if (this.pending < 1) {
            if (this.parent)
                this.parent.resolve();
            else
                this.pendingResolvedFunction();
        }
    }
}

var types = {
	//Identifier
identifier:1,
string:2,
//
add_expression:3,
and_expression:4,
array_literal:5,
arrow_function_declaration:6,
assignment_expression:7,
await_expression:8,
binding:9,
block_statement:10,
bool_literal:11,
call_expression:12,
catch_statement:13,
condition_expression:14,
debugger_statement:15,
delete_expression:16,
divide_expression:17,
equality_expression:18,
exponent_expression:19,
expression_list:20,
expression_statement:21,
for_statement:22,
function_declaration:23,
if_statement:25,
in_expression:26,
instanceof_expression:27,
left_shift_expression:28,
lexical_declaration:29,
member_expression:30,
modulo_expression:31,
multiply_expression:32,
negate_expression:33,
new_expression:34,
null_literal:35,
numeric_literal:36,
object_literal:37,
or_expression:38,
plus_expression:39,
post_decrement_expression:40,
post_increment_expression:41,
pre_decrement_expression:42,
pre_increment_expression:43,
property_binding:44,
right_shift_expression:45,
right_shift_fill_expression:46,
return_statement:47,
spread_element:48,
statements:49,
subtract_expression:51,
this_literal:52,
try_statement:53,
typeof_expression:54,
unary_not_expression:55,
unary_or_expression:56,
unary_xor_expression:57,
void_expression:58,
argument_list:59,
	};

class base {
    constructor(...vals) {

        this.vals = vals;
        this.parent = null;
    }

    replaceNode(original, _new = null, vals = this.vals) {
        for (let i = 0; i < vals.length; i++) {
            if (vals[i] === original)
                if (_new === null) {
                    return i;
                } else
                    return vals[i] = _new, -1;
        }
    }

    replace(node) {
        if (this.parent)
            this.parent.replaceNode(this, node);
    }

    getRootIds() {}

    * traverseDepthFirst(p, vals = this.vals) {
        this.parent = p;
        this.SKIP = false;

        if(vals == this.vals)
            yield this;

        for (let i = 0; i < vals.length; i++) {
            if(this.SKIP == true)
                break;

            const node = vals[i];

            if (!node) continue;

            if(Array.isArray(node)){
                yield* this.traverseDepthFirst(p, node);
            }else
                yield* node.traverseDepthFirst(this);

            if (vals[i] !== node) // Check to see if node has been replaced. 
                i--; //Reparse the node
        }
    }

    skip() {
        this.SKIP = true;
    }

    spin(trvs) {
        let val = trvs.next().value;
        while (val !== undefined && val !== this) { val = trvs.next().value; };
    }
    toString() { return this.render() }

    render() { return this.vals.join("") }

    get connect(){
        this.vals.forEach(v=>{
            try{
                v.parent = this;
            }catch(e){
                
            }
        });
        return this;
    }
}

/** OPERATOR **/
class operator$1 extends base {

    constructor(sym) {
        super(sym[0], sym[2]);
        this.op = "";
    }

    get left() { return this.vals[0] }
    get right() { return this.vals[1] }

    replaceNode(original, _new = null) {
        var index;

        if ((index = super.replaceNode(original, _new)) > -1){
            this.replace(this.vals[(index+1)%2]);
        }
    }

    render() { return `${this.left.render()} ${this.op} ${this.right.render()}` }
}

/** ADD **/
class add_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "+";
    }

    get type() { return types.add_expression }
}

/** AND **/
class and_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "&&";
    }

    get type() { return types.and_expression }
}

class array_literal extends base {
    constructor(sym) {
        super(sym[0] || []);
    }

    get exprs() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.exprs.forEach(e => e.getRootIds(ids, closure));
    }

    replaceNode(original, _new = null) {
        let index = 0;
        if ((index = super.replaceNode(original, _new, this.vals[0])) > -1) {
            this.vals[0].splice(index, 1);
        }
    }

    * traverseDepthFirst(p) {
        this.parent = p;

        yield this;

        for (let i = 0; i < this.exprs.length; i++) {

            const expr = this.exprs[i];

            yield* expr.traverseDepthFirst(this);

            if (this.exprs[i] !== expr)
                yield* this.exprs[i].traverseDepthFirst(this);
        }
    }

    get name() { return this.id.name }

    get type() { return types.array_literal }

    render() { return `[${this.exprs.map(a=>a.render()).join(",")}]` }
}

class function_declaration extends base {
    constructor(id, args, body) {
        
        args = (Array.isArray(args)) ? args : [args];

        super(id, args || [], body || []);

        //This is a declaration and id cannot be a closure variable. 
        if (this.id)
            this.id.root = false;
    }

    get id() { return this.vals[0] }
    get args() { return this.vals[1] }
    get body() { return this.vals[2] }

    getRootIds(ids, closure) {
        if (this.id)
            this.id.getRootIds(ids, closure);
        this.args.forEach(e => e.getRootIds(ids, closure));
    }

    get name() { return this.id.name }

    get type() { return types.function_declaration }

    render() {
        const
            body_str = this.body.render(),
            args_str = this.args.map(e => e.render()).join(","),
            id = this.id ? this.id.render() : "";

        return `function ${id}(${args_str}){${body_str}}`;
    }
}

class arrow_function_declaration extends function_declaration {
    constructor(...sym) {
        super(...sym);
    }

    getRootIds(ids, closure) {
        this.args.forEach(e => e.getRootIds(ids, closure));
    }

    get name() { return null }

    get type() { return types.arrow_function_declaration }

    render() {
        const
            body_str = this.body.render(),
            args_str = this.args.map(e => e.render()).join(",");
        return `${this.args.length == 1 ? args_str : `(${args_str})`} => ${body_str}`;
    }
}

/** ASSIGNEMENT EXPRESSION **/

class assignment_expression extends operator$1 {
    constructor(sym) {
        super(sym);
        this.op = sym[1];
        //this.id.root = false;
    }
    get id() { return this.vals[0] }
    get expr() { return this.vals[2] }
    get type() { return types.assignment_expression }
}

/** OPERATOR **/
class unary_pre extends base {

    constructor(sym) {
        super(sym[1]);
        this.op = "";
    }

    get expr() { return this.vals[0] }

    render() { return `${this.op}${this.expr.render()}` }
}

/** VOID **/

class await_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "await";
    }

    get type() { return types.await_expression }
}

/** BINDING DECLARATION **/
class binding extends base {
    constructor(sym) {
        super(sym[0], sym[1] || null);
        this.id.root = false;
    }

    get id() { return this.vals[0] }
    get init() { return this.vals[1] }
    get type(){return types.binding}

    getRootIds(ids, closure) {
        this.id.getRootIds(closure, closure);
        if (this.init) this.init.getRootIds(ids, closure);
    }

    render() { return `${this.id}${this.init ? ` = ${this.init.render()}` : ""}` }
}

/** STATEMENTS **/
class statements extends base {
    constructor(sym) {

        if (sym[0].length == 1)
            return sym[0][0];
        
        super(sym[0]);
    }

    get stmts() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.stmts.forEach(s => s.getRootIds(ids, closure));
    }

    replaceNode(original, _new = null) {
        let index = -1;
        if ((index = super.replaceNode(original, _new, this.vals[0])) > -1) {
            this.vals[0].splice(index, 1);
        }
    }

    * traverseDepthFirst(p) {
        yield * super.traverseDepthFirst(p, this.vals[0]);
    }

    get type() { return types.statements }

    render() { 
        return this.stmts.map(s=>(s.render())).join("") ;
    }
}

/** BLOCK **/
class block_statement extends statements {

    constructor(sym) {
        if (!(sym[1] instanceof statements))
            return sym[1];

        super(sym[1].vals);
    }

    getRootIds(ids, closure) {
        super.getRootIds(ids, new Set([...closure.values()]));
    }

    get type() { return types.block_statement }

    render() { return `{${super.render()}}` }
}

/** BOOLEAN **/

class bool_literal extends base {
    constructor(sym) { super(sym[0]); }

    get type() { return types.bool_literal }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
    }
}

class call_expression extends base {
    constructor(sym) {
        super(sym[0],sym[1]);
        if(this.args)
        this.args.clearRoots();
    }

    get id() { return this.vals[0] }
    get args() { return this.vals[1] }

    getRootIds(ids, closure) {
        this.id.getRootIds(ids, closure);
        this.args.getRootIds(ids, closure);
    }

    get name() { return this.id.name }
    get type() { return types.call_expression }

    render() { 
        return `${this.id.render()}(${this.args.render()})` 
    }
}

/** CATCH **/
class catch_statement extends base {
    constructor(sym) {
        super(sym[2], sym[4]);
    }

    get param() { return this.vals[0] }
    get body() { return this.vals[1] }

    getRootIds(ids, closure) {
        if (this.body) this.body.getRootIds(ids, closure);
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        yield* this.param.traverseDepthFirst(this);
        yield* this.body.traverseDepthFirst(this);
    }

    get type() { return types.catch_statement }
}

/** CONDITION EXPRESSIONS **/
class condition_expression extends base {
    constructor(sym) {
        super(sym[0], sym[2], sym[4]);
    }

    get bool() { return this.vals[0] }
    get left() { return this.vals[1] }
    get right() { return this.vals[2] }

    getRootIds(ids, closure) {
        this.bool.getRootIds(ids, closure);
        this.left.getRootIds(ids, closure);
        this.right.getRootIds(ids, closure);
    }

    get type() { return types.condition_expression }

    render() {
        const
            bool = this.bool.render(),
            left = this.left.render(),
            right = this.right.render();

        return `${bool} ? ${left} : ${right}`;
    }
}

/** DEBUGGER STATEMENT  **/

class debugger_statement extends base {
    constructor() {
        super();
    }

    getRootIds(ids, closure) {
        if (this.expr) this.expr.getRootIds(ids, closure);
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
    }

    get type() { return types.debugger_statement }

    render() { return `debugger;` }
}

/** POSTFIX INCREMENT **/

class delete_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "delete";
    }

    get type() { return types.delete_expression }
}

/** DIVIDE EXPRESSION **/
class divide_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "/";
    }

    get type () { return types.divide_expression }
}

/** EQ **/
class equality_expression extends operator$1 {
    constructor(sym) {super(sym); this.op = sym[1];  }
    get type() { return types.equality_expression }
}

/** EXPONENT **/
class equality_expression$1 extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "**";
    }

    get type() { return types.equality_expression }
}

/** EXPRESSION_LIST **/

class expression_list extends base {
    constructor(sym) {

        if (sym[0].length == 1)
            return sym[0][0];

        super(sym[0]);
    }

    get expressions() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.expressions.forEach(s => s.getRootIds(ids, closure));
    }

    replaceNode(original, _new = null) {
        let index = -1;
        if ((index = super.replaceNode(original, _new, this.vals[0])) > -1) {
            this.vals[0].splice(index, 1);
        }
    }

    * traverseDepthFirst(p) {
        yield * super.traverseDepthFirst(p, this.vals[0]);
    }

    get type() { return types.expression_list }

    render() { return `(${this.expressions.map(s=>s.render()).join(",")})` }
}

/** EXPRESSION_LIST **/

class expression_statement extends base {

    constructor(sym) {
        super(sym[0]);
    }

    get expression() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.expression.getRootIds(ids, closure);
    }

    replaceNode(original, _new = null) {
        if(!super.replaceNode(original, _new, this.vals[0]))
            this.replace();
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        yield* this.expression.traverseDepthFirst(this);

    }

    get type() { return types.expression_statement }

    render() { return this.expression.render() + ";" }
}

/** FOR **/
class for_statement extends base {

    get init() { return this.vals[0] }
    get bool() { return this.vals[1] }
    get iter() { return this.vals[2] }
    get body() { return this.vals[3] }

    getRootIds(ids, closure) {

        closure = new Set([...closure.values()]);

        if (this.bool) this.bool.getRootIds(ids, closure);
        if (this.iter) this.iter.getRootIds(ids, closure);
        if (this.body) this.body.getRootIds(ids, closure);
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        if (this.init) yield* this.init.traverseDepthFirst(this);
        if (this.bool) yield* this.bool.traverseDepthFirst(this);
        if (this.iter) yield* this.iter.traverseDepthFirst(this);
        if (this.body) yield* this.body.traverseDepthFirst(this);
        yield this;
    }

    get type() { return types.for_statement }

    render() {
        let init, bool, iter, body;

        if (this.init) init = this.init.render();
        if (this.bool) bool = this.bool.render();
        if (this.iter) iter = this.iter.render();
        if (this.body) body = this.body.render();

        return `for(${init};${bool};${iter})${body}`;
    }
}

/** IDENTIFIER **/
class identifier$1 extends base {
    constructor(sym) {
        super(sym[0]);
        this.root = true;
    }

    get val() { return this.vals[0] }

    getRootIds(ids, closuere) { ids.add(this.val); }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
    }

    get name() { return this.val }

    get type() { return types.identifier }

    render() { return this.val }
}

/** STATEMENTS **/

class if_statement extends base {
    constructor(sym) {
        const expr = sym[2],
            stmt = sym[4],
            else_stmt = (sym.length > 5) ? sym[6] : null;

        super(expr, stmt, else_stmt);
    }

    get expr() { return this.vals[0] }
    get stmt() { return this.vals[1] }
    get else_stmt() { return this.vals[2] }

    getRootIds(ids, closure) {
        this.expr.getRootIds(ids, closure);
        this.stmt.getRootIds(ids, closure);
        if (this.else_stmt)
            this.else_stmt.getRootIds(ids, closure);
    }

    * traverseDepthFirst(p) {

        this.parent = p;

        yield this;

        yield* this.expr.traverseDepthFirst(this);
        yield* this.stmt.traverseDepthFirst(this);

        if (this.else_stmt)
            yield* this.else_stmt.traverseDepthFirst(this);
    }

    get type() { return types.if_statement }

    render() {
        const
            expr = this.expr.render(),
            stmt = this.stmt.render(),
            _else = (this.else_stmt) ? " else " + this.else_stmt.render() : "";
        return `if(${expr})${stmt}${_else}`;
    }
}

/** IN **/
class in_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "in";
    }

    get type() { return types.in_expression }
}

/** INSTANCEOF **/
class instanceof_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "instanceof";
    }

    get type() { return types.instanceof_expression }
}

/** LEFT_SHIFT **/
class left_shift_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "<<";
    }

    get type() { return types.left_shift_expression }
}

/** LEXICAL DECLARATION **/
class lexical_declaration extends base {
    constructor(sym) {
        super(sym[1]);
        this.mode = sym[0];
    }

    get bindings() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.bindings.forEach(b => b.getRootIds(ids, closure));
    }

    get type() { return types.lexical_declaration }

    render() { return `${this.mode} ${this.bindings.map(b=>b.render()).join(",")};` }
}

/** MEMBER **/

class member_expression extends base {
    constructor(sym) { super(sym[0], sym[2]);
        this.root = true;
        this.mem.root = false;
    }

    get id() { return this.vals[0] }
    get mem() { return this.vals[1] }

    getRootIds(ids, closuere) {
        this.id.getRootIds(ids, closuere);
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        yield* this.id.traverseDepthFirst(this);
        yield* this.mem.traverseDepthFirst(this);
    }

    get name() { return this.id.name }
    get type() { return types.member_expression }

    render() { 
        if(this.mem.type == types.member_expression || this.mem.type == types.identifier){
            return `${this.id.render()}.${this.mem.render()}`;
        }else{
            return `${this.id.render()}[${this.mem.render()}]`;
        }
    }
}

/** MODULO **/
class modulo_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "%";
    }

    get type() { return types.modulo_expression }
}

/** MULTIPLY **/
class multiply_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "*";
    }

    get type () { return types.multiply_expression }

    
}

/** NEGATE **/

class negate_expression extends unary_pre {
    constructor(sym) { super(sym);
        this.op = "-";
    }
    get type() { return types.negate_expression }
}

/** NEW EXPRESSION **/

class new_expression extends call_expression {
    constructor(id, args) { 
        super([id, args]);
        this.root = false;
        this.id.root = false;
    }

    get type(){return types.new_expression}

    render() { 
        const
            args_str = (this.args) ? this.args.render() : "";

        return `new ${this.id.render()}(${args_str})`;
    }
}

/** NULL **/
class null_literal extends base {
    constructor() { super(); }
    get type() { return types.null_literal }
    render() { return "null" }
}

/** NUMBER **/
class numeric_literal extends base {
    constructor(sym) { super(parseFloat(sym)); }
    get val() { return this.vals[0] }
    get type() { return types.numeric_literal }
    render() { return this.val + "" }
    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
    }
}

/** OBJECT **/

class object_literal extends base {
    constructor(sym) {
        super(sym[0] || []);
    }

    get props() { return this.vals[0] }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        for (const prop of this.props)
            yield* prop.traverseDepthFirst(this);
    }

    get type() { return types.object_literal }

    render() { return `{${this.props.map(p=>p.render()).join(",")}}` }
}

/** OR **/
class or_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "||";
    }

    get type() { return types.or_expression }
}

/** PLUS **/

class plus_expression extends unary_pre {
    constructor(sym) { super(sym);
        this.op = "+";
    }
    get type() { return types.plus_expression }
}

/** OPERATOR **/

class unary_post extends base {

    constructor(sym) {
        super(sym[0]);
        this.op = "";
    }

    get expr() { return this.vals[0] }
    render() { return `${this.expr.render()}${this.op}` }
}

/** POSTFIX INCREMENT **/

class post_decrement_expression extends unary_post {

    constructor(sym) {
        super(sym);
        this.op = "--";
    }

    get type() { return types.post_decrement_expression }
}

/** POSTFIX INCREMENT **/

class post_increment_expression extends unary_post {

    constructor(sym) {
        super(sym);
        this.op = "++";
    }

    get type() { return types.post_increment_expression }

}

/** UNARY NOT **/

class pre_decrement_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "--";
    }

    get type() { return types.pre_decrement_expression }
}

/** UNARY NOT **/

class pre_increment_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "--";
    }

    get type() { return types.pre_increment_expression }
}

/** PROPERTY BINDING DECLARATION **/
class property_binding extends binding {
    constructor(sym) {
        super([sym[0], sym[2]]);
    }
    get type( ){return types.property_binding}
    render() { return `${this.id.type > 2 ? `[${this.id.render()}]` : this.id.render()} : ${this.init.render()}` }
}

/** RIGHT SHIFT **/
class right_shift_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = ">>";
    }

    get type() { return types.right_shift_expression }
}

/** RIGHT SHIFT **/
class right_shift_fill_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = ">>>";
    }

    get type() { return types.right_shift_fill_expression }
}

/** RETURN STATMENT  **/



class return_statement extends base {
    constructor(sym) {
        super((sym.length > 2) ? sym[1] : null);
    }

    get expr() { return this.vals[0] }

    getRootIds(ids, closure) {
        if (this.expr) this.expr.getRootIds(ids, closure);
    }

    get type() { return types.return_statement }

    render() {
        let expr_str = "";
        if (this.expr) {
            if (Array.isArray(this.expr)) {
                expr_str = this.expr.map(e=>e.render()).join(",");
            } else
                expr_str = this.expr.render();
        }
        return `return ${expr_str};`;
    }
}

/** SPREAD **/

class spread_element extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "...";
    }

    get type() { return types.spread_element }

}

/** STRING **/

class string$2 extends base {
    constructor(sym) { super(sym.length === 3 ? sym[1]: ""); }

    get val() { return this.vals[0] }

    getRootIds(ids, closuere) { if (!closuere.has(this.val)) ids.add(this.val); }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
    }


    get type() { return types.string }

    render() { return `"${this.val}"` }
}

/** SUBTRACT **/
class subtract_expression extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "-";
    }

    get type () { return types.subtract_expression }
}

/** THIS LITERAL  **/

class this_literal extends base {
    constructor() {
        super();
        this.root = false;
    }

    get name() { return "this" }
    get type() { return types.this_literal }

    render() { return `this` }
}

/** TRY **/
class try_statement extends base {
    constructor(body, _catch, _finally) {
        super(body, _catch, _finally);


    }
    get catch() { return this.vals[0] }
    get body() { return this.vals[1] }
    get finally() { return this.vals[2] }

    getRootIds(ids, clsr) {
        this.body.getRootIds(ids, clsr);
        if (this.catch) this.catch.getRootIds(ids, clsr);
        if (this.finally) this.finally.getRootIds(ids, clsr);
    }

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        if (this.body) yield* this.body.traverseDepthFirst(p);
        if (this.catch) yield* this.catch.traverseDepthFirst(p);
        if (this.finally) yield* this.finally.traverseDepthFirst(p);
    }

    get type() { return types.try_statement }
}

/** TYPEOF **/

class typeof_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "typeof";
    }

    get type() { return types.typeof_expression }
}

/** UNARY NOT **/

class unary_not_expression extends unary_pre {
    constructor(sym) {
        super(sym);
        this.op = "!";
    }
    get type() { return types.unary_not_expression }
}

/** UNARY BIT OR **/

class unary_or_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "|";
    }

    get type() { return types.unary_or_expression }
}

/** UNARY BIT XOR **/

class unary_xor_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "~";
    }

    get type() { return types.unary_xor_expression }
}

/** VOID **/

class void_expression extends unary_pre {

    constructor(sym) {
        super(sym);
        this.op = "void";
    }

    get type() { return types.void_expression }
}

/** ARGUMENT_LIST **/
class argument_list extends base {
    constructor(sym) {

        //if (sym && sym.length == 1)
        //    return sym[0];
        
        super(sym || []);
    }

    clearRoots(){
        this.args.forEach(a=>a.root = false);
    }

    get args() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.args.forEach(s => s.getRootIds(ids, closure));
    }

    replaceNode(original, _new = null) {
        let index = -1;
        if ((index = super.replaceNode(original, _new, this.vals[0])) > -1) {
            this.vals[0].splice(index, 1);
        }
    }

    * traverseDepthFirst(p) {
        yield * super.traverseDepthFirst(p, this.vals[0]);
    }

    get type() { return types.argument_list }

    render() { 
        return this.args.map(s=>(s.render())).join(",") ;
    }
}

//continue_statement
//break_statement
//return_statement
//throw_statement
//with_statement
//switch_statement
//label_statement
//finally_statement
//variable_statement
//class_statement


const env = {
    table: {},
    ASI: true,
    functions: {

        //JS
        plus_expression,
        add_expression,
        and_expression,
        array_literal,
        arrow_function_declaration,
        assignment_expression,
        await_expression,
        await_expression,
        binding,
        //bit_and_expression,
        //bit_or_expression,
        //bit_xor_expression,
        block_statement,
        bool_literal,
        call_expression,
        catch_statement,
        condition_expression,
        debugger_statement,
        delete_expression,
        divide_expression,
        equality_expression,
        exponent_expression: equality_expression$1,
        expression_list,
        expression_statement,
        for_statement,
        function_declaration,
        identifier: identifier$1,
        if_statement,
        in_expression,
        instanceof_expression,
        left_shift_expression,
        lexical: lexical_declaration,
        member_expression,
        modulo_expression,
        multiply_expression,
        negate_expression,
        new_expression,
        null_literal,
        numeric_literal,
        object_literal,
        or_expression,
        post_decrement_expression,
        post_increment_expression,
        pre_decrement_expression,
        pre_increment_expression,
        property_binding,
        return_statement,
        right_shift_expression,
        right_shift_fill_expression,
        spread_element,
        statements,
        string_literal: string$2,
        subtract_expression,
        this_literal,
        try_statement,
        typeof_expression,
        unary_not_expression,
        unary_not_expression,
        unary_or_expression,
        void_expression,
        argument_list,
        while_stmt: function(sym) {
            this.bool = sym[1];
            this.body = sym[3];
        },
        var_stmt: function(sym) { this.declarations = sym[1]; },
        unary_plus: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        unary_minus: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        pre_inc_expr: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        pre_dec_expr: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE DEC";
        },

        label_stmt: function(sym) {
            this.label = sym[0];
            this.stmt = sym[1];
        },

        defaultError: (tk, env, output, lex, prv_lex, ss, lu) => {
            /*USED for ASI*/

            if (env.ASI && lex.tx !== ")" && !lex.END) {

                if (lex.tx == "</") // As in "<script> script body => (</)script>"
                    return lu.get(";");

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_END_CHAR = true;
                }

                if (ENCOUNTERED_END_CHAR)
                    return lu.get(";");
            }

            if (lex.END)
                return lu.get(";");
        }
    },

    options: {
        integrate: false,
        onstart: () => {
            env.table = {};
            env.ASI = true;
        }
    }
};

let fn$1 = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols$1 = ["...","<",">","<=",">=","==","!=","===","!==","**","++","--","<<",">>",">>>","&&","||","+=","-=","*=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","^=","=>"],

    /* Goto lookup maps */
    gt0$1 = [0,-1,1,-20,2,3,6,5,4,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt1$1 = [0,-24,118,-2,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt2$1 = [0,-24,6,5,119,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt3$1 = [0,-122,123],
gt4$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,163,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt5$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,174,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt6$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,175,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt7$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,176,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt8$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,177,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt9$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,178,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt10$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,179,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt11$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,180,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt12$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,181,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt13$1 = [0,-104,183],
gt14$1 = [0,-104,188],
gt15$1 = [0,-68,66,172,-14,67,173,-11,189,190,61,62,86,-6,60,-1,167,-6,166,-20,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt16$1 = [0,-163,71,193],
gt17$1 = [0,-151,196,194],
gt18$1 = [0,-153,206,204],
gt19$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,215,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt20$1 = [0,-104,220],
gt21$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-17,221,164,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt22$1 = [0,-54,223],
gt23$1 = [0,-62,225,226,-75,228,230,231,-19,227,229,71,70],
gt24$1 = [0,-28,235,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt25$1 = [0,-159,241,-2,242,71,70],
gt26$1 = [0,-159,244,-2,242,71,70],
gt27$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,246,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt28$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,248,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt29$1 = [0,-33,249],
gt30$1 = [0,-86,252,253,-73,251,229,71,70],
gt31$1 = [0,-161,256,229,71,70],
gt32$1 = [0,-66,258,259,-71,261,230,231,-19,260,229,71,70],
gt33$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,263,-2,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt34$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,264,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt35$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,265,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt36$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,266,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt37$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-7,267,35,36,37,38,39,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt38$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-8,268,36,37,38,39,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt39$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-9,269,37,38,39,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt40$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-10,270,38,39,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt41$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-11,271,39,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt42$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-12,272,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt43$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-12,273,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt44$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-12,274,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt45$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-12,275,40,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt46$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,276,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt47$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,277,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt48$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,278,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt49$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,279,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt50$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,280,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt51$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-13,281,41,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt52$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-14,282,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt53$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-14,283,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt54$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-14,284,42,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt55$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-15,285,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt56$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-15,286,43,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt57$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-16,287,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt58$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-16,288,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt59$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-16,289,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt60$1 = [0,-68,66,172,-13,88,67,173,-10,165,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-16,290,44,45,53,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt61$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,291,292,295,294,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt62$1 = [0,-91,304,-17,298,-1,301,306,310,311,302,-39,312,313,-3,303,-1,169,71,307],
gt63$1 = [0,-163,71,315],
gt64$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,316,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt65$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-1,321,320,317,60,-1,167,-6,166,-3,322,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt66$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,324,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt67$1 = [0,-163,71,325],
gt68$1 = [0,-104,326],
gt69$1 = [0,-151,329],
gt70$1 = [0,-153,331],
gt71$1 = [0,-139,335,230,231,-19,334,229,71,70],
gt72$1 = [0,-163,71,336],
gt73$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,337,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt74$1 = [0,-68,66,172,-7,31,90,338,-3,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-8,166,-3,339,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt75$1 = [0,-28,342,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-1,341,22,-3,23,13,-6,66,343,-7,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt76$1 = [0,-116,346],
gt77$1 = [0,-116,348],
gt78$1 = [0,-112,355,310,311,-27,350,351,-2,353,-1,354,-6,312,313,-4,356,229,71,307],
gt79$1 = [0,-119,358,-19,365,230,231,-2,360,362,-1,363,364,359,-11,356,229,71,70],
gt80$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,366,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt81$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,368,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt82$1 = [0,-37,369,371,373,-1,378,-22,370,377,-2,66,172,-7,31,90,-4,88,67,173,-7,28,27,374,376,56,58,61,62,86,57,87,-4,60,-1,167,-10,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt83$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,380,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt84$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,384,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt85$1 = [0,-57,386,387],
gt86$1 = [0,-86,390,253],
gt87$1 = [0,-88,392,394,395,396,-20,399,310,311,-40,312,313,-6,71,400],
gt88$1 = [0,-68,66,172,-13,88,67,173,-10,401,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-20,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt89$1 = [0,-71,403,406,405,408,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt90$1 = [0,-116,412],
gt91$1 = [0,-116,413],
gt92$1 = [0,-119,415],
gt93$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-2,420,419,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt94$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,422,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt95$1 = [0,-116,426],
gt96$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,427,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt97$1 = [0,-112,430,310,311,-40,312,313,-6,71,400],
gt98$1 = [0,-112,431,310,311,-40,312,313,-6,71,400],
gt99$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,432,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt100$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,438,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt101$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-6,445,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt102$1 = [0,-63,447,-75,228,230,231,-19,227,229,71,70],
gt103$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,448,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt104$1 = [0,-161,452,229,71,70],
gt105$1 = [0,-116,454],
gt106$1 = [0,-139,365,230,231,-5,457,364,455,-11,356,229,71,70],
gt107$1 = [0,-139,462,230,231,-19,461,229,71,70],
gt108$1 = [0,-116,463],
gt109$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,468,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt110$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,471,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt111$1 = [0,-42,475,-19,474,226,-75,477,230,231,-19,476,229,71,70],
gt112$1 = [0,-42,478,-23,258,259,-71,480,230,231,-19,479,229,71,70],
gt113$1 = [0,-39,481,-1,484,-23,485,-2,66,172,-13,88,67,173,-10,482,56,58,61,62,86,57,87,-4,60,-1,167,-27,168,-11,65,-4,76,77,75,74,-1,64,-1,169,71,70],
gt114$1 = [0,-58,488],
gt115$1 = [0,-33,490],
gt116$1 = [0,-88,491,394,395,396,-20,399,310,311,-40,312,313,-6,71,400],
gt117$1 = [0,-90,494,396,-20,399,310,311,-40,312,313,-6,71,400],
gt118$1 = [0,-91,495,-20,399,310,311,-40,312,313,-6,71,400],
gt119$1 = [0,-71,496,406,405,408,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt120$1 = [0,-67,501,-71,261,230,231,-19,260,229,71,70],
gt121$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,502,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt122$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-1,506,505,504,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt123$1 = [0,-91,304,-19,508,306,310,311,302,-39,312,313,-3,303,-1,169,71,307],
gt124$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,509,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt125$1 = [0,-70,510,511,406,405,408,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt126$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-1,516,-2,60,-1,167,-6,166,-3,322,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt127$1 = [0,-139,518,230,231,-19,517,229,71,70],
gt128$1 = [0,-112,355,310,311,-27,520,-3,522,-1,354,-6,312,313,-4,356,229,71,307],
gt129$1 = [0,-139,365,230,231,-5,523,364,-12,356,229,71,70],
gt130$1 = [0,-119,526,-19,365,230,231,-3,528,-1,363,364,527,-11,356,229,71,70],
gt131$1 = [0,-28,529,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt132$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,530,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt133$1 = [0,-28,531,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt134$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,532,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt135$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,535,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt136$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,537,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt137$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,539,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt138$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,541,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt139$1 = [0,-42,543,-96,545,230,231,-19,544,229,71,70],
gt140$1 = [0,-42,478,-96,545,230,231,-19,544,229,71,70],
gt141$1 = [0,-49,546],
gt142$1 = [0,-28,548,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt143$1 = [0,-59,549,-79,551,230,231,-19,550,229,71,70],
gt144$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,556,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt145$1 = [0,-73,559,560,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt146$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,561,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt147$1 = [0,-74,565,-17,564,-46,365,230,231,-5,409,364,-12,356,229,71,70],
gt148$1 = [0,-139,365,230,231,-5,457,364,570,-11,356,229,71,70],
gt149$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,575,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt150$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,577,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt151$1 = [0,-28,580,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt152$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,582,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt153$1 = [0,-28,585,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt154$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,587,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt155$1 = [0,-50,589,591,590],
gt156$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,596,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt157$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,598,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt158$1 = [0,-28,605,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt159$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,607,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt160$1 = [0,-28,610,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt161$1 = [0,-28,612,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt162$1 = [0,-28,613,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt163$1 = [0,-28,614,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt164$1 = [0,-28,616,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt165$1 = [0,-28,617,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt166$1 = [0,-28,618,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt167$1 = [0,-51,622,620],
gt168$1 = [0,-50,623,591],
gt169$1 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,625,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt170$1 = [0,-33,627],
gt171$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,628,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt172$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,632,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt173$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,633,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt174$1 = [0,-28,636,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt175$1 = [0,-28,637,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt176$1 = [0,-28,638,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt177$1 = [0,-28,639,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt178$1 = [0,-28,640,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt179$1 = [0,-51,641],
gt180$1 = [0,-51,622],
gt181$1 = [0,-24,6,5,645,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt182$1 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,649,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt183$1 = [0,-28,650,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt184$1 = [0,-24,6,5,652,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],

    // State action lookup maps
    sm0$1=[0,1,2,3,-1,0,-4,0,-8,4,-3,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm1$1=[0,43,-3,0,-4,0],
sm2$1=[0,44,-3,0,-4,0],
sm3$1=[0,45,-3,0,-4,0],
sm4$1=[0,46,-3,0,-4,0],
sm5$1=[0,47,2,3,-1,0,-4,0,-8,4,47,-2,5,47,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,47,-1,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm6$1=[0,48,48,48,-1,0,-4,0,-8,48,48,-2,48,48,48,48,48,48,-1,48,48,-2,48,48,48,48,-1,48,-1,48,48,48,48,48,48,48,-1,48,-2,48,48,-5,48,-2,48,-2,48,-31,48,48,-3,48,48,48,48,48,48,48,-7,48,48,48,48,48,48],
sm7$1=[0,49,49,49,-1,0,-4,0,-8,49,49,-2,49,49,49,49,49,49,-1,49,49,-2,49,49,49,49,-1,49,-1,49,49,49,49,49,49,49,-1,49,-2,49,49,-5,49,-2,49,-2,49,-31,49,49,-3,49,49,49,49,49,49,49,-7,49,49,49,49,49,49],
sm8$1=[0,50,50,50,-1,0,-4,0,-8,50,50,-2,50,50,50,50,50,50,-1,50,50,-2,50,50,50,50,-1,50,-1,50,50,50,50,50,50,50,-1,50,-2,50,50,-5,50,-2,50,-2,50,-31,50,50,-3,50,50,50,50,50,50,50,-7,50,50,50,50,50,50],
sm9$1=[0,51,51,51,-1,0,-4,0,-8,51,51,-2,51,51,51,51,51,51,-1,51,51,-1,51,51,51,51,51,-1,51,-1,51,51,51,51,51,51,51,-1,51,-2,51,51,-5,51,-2,51,-2,51,-31,51,51,-3,51,51,51,51,51,51,51,-7,51,51,51,51,51,51],
sm10$1=[0,52,52,52,-1,0,-4,0,-8,52,52,-2,52,52,52,52,52,52,-1,52,52,-1,52,52,52,52,52,-1,52,-1,52,52,52,52,52,52,52,-1,52,-2,52,52,-5,52,-2,52,-2,52,-31,52,52,-3,52,52,52,52,52,52,52,-7,52,52,52,52,52,52],
sm11$1=[0,-1,2,3,-1,0,-4,0,-8,4,-3,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm12$1=[0,-4,0,-4,0,-12,53],
sm13$1=[0,-4,0,-4,0,-5,54,-6,55,-8,55,-15,55,-11,55],
sm14$1=[0,-4,0,-4,0,-5,56,-6,56,-8,56,-15,56,-11,56],
sm15$1=[0,-4,0,-4,0,-5,57,-6,57,-8,57,-15,57,-11,57],
sm16$1=[0,-4,0,-4,0,-5,58,-3,58,-2,58,-8,58,-15,58,-11,58],
sm17$1=[0,-4,0,-4,0,-5,59,59,-2,59,-2,59,-8,59,-5,59,-9,59,-11,59,-5,60,61,62,63,64,65,66,67,68,69,70,71,72,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,-5,73,74],
sm18$1=[0,-4,0,-4,0,-5,75,-3,75,-2,75,-8,75,-15,75,-11,75,-18,76,77],
sm19$1=[0,-4,0,-4,0,-5,78,-3,78,-2,78,-8,78,-15,78,-11,78,-18,78,78,79],
sm20$1=[0,-4,0,-4,0,-5,80,-3,80,-2,80,-8,80,-15,80,-11,80,-18,80,80,80,81],
sm21$1=[0,-4,0,-4,0,-5,82,-3,82,-2,82,-8,82,-15,82,-11,82,-18,82,82,82,82,83],
sm22$1=[0,-4,0,-4,0,-5,84,-3,84,-2,84,-8,84,-15,84,-11,84,-18,84,84,84,84,84,85],
sm23$1=[0,-4,0,-4,0,-5,86,-3,86,-2,86,-8,86,-15,86,-11,86,-18,86,86,86,86,86,86,87,88,89,90],
sm24$1=[0,-4,0,-4,0,-5,91,-3,91,-2,91,-8,91,-5,92,-9,91,-11,91,-18,91,91,91,91,91,91,91,91,91,91,93,94,95,96,97],
sm25$1=[0,-4,0,-4,0,-5,98,-3,98,-2,98,-8,98,-5,98,-9,98,-11,98,-18,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,99,100,101],
sm26$1=[0,-4,0,-4,0,-5,102,-3,102,-2,102,-8,102,-5,102,-9,102,-11,102,-18,102,102,102,102,102,102,102,102,102,102,102,102,102,102,102,102,102,102,103,104],
sm27$1=[0,-4,0,-4,0,-5,105,106,-2,105,-2,105,-8,105,-5,105,-9,105,-11,105,-18,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,107,108],
sm28$1=[0,-4,0,-4,0,-5,109,109,-2,109,-2,109,-8,109,-5,109,-9,109,-11,109,-18,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109],
sm29$1=[0,-4,0,-4,0,-5,110,110,-2,110,-2,110,-8,110,-5,110,-9,110,-11,110,-18,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110],
sm30$1=[0,-4,0,-4,0,-5,111,111,-2,111,-2,111,-8,111,-5,111,-9,111,-11,111,-18,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,112],
sm31$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm32$1=[0,-4,0,-4,0,-5,111,111,-2,111,-2,111,-8,111,-5,111,-9,111,-11,111,-18,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111],
sm33$1=[0,-4,0,-4,0,-5,115,115,-1,115,115,-2,115,-8,115,-5,115,-1,115,-7,115,-11,115,-5,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,-5,115,115],
sm34$1=[0,-4,0,-4,0,-5,115,115,-1,115,115,-2,115,-4,116,-2,117,115,-5,115,-1,115,-7,115,-11,115,118,-4,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,-5,115,115],
sm35$1=[0,-4,0,-4,0,-5,119,119,-1,119,119,-2,119,-4,120,-2,117,119,-5,119,-1,119,-7,119,-11,119,121,-4,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,-5,119,119],
sm36$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,-27,25,-1,122,123,-2,27,-50,37,38,39,40,41,42],
sm37$1=[0,-4,0,-4,0,-5,124,124,-1,124,124,-2,124,-4,124,-2,124,124,-5,124,-1,124,-7,124,-11,124,124,-4,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,-5,124,124],
sm38$1=[0,-4,0,-4,0,-5,125,125,-1,125,125,-2,125,-4,125,-2,125,125,-5,125,-1,125,-7,125,-11,125,125,-4,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,-5,125,125],
sm39$1=[0,-4,0,-4,0,-5,126,126,-1,126,126,-2,126,-4,126,-2,126,126,-5,126,-1,126,-7,126,-11,126,126,-4,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,-5,126,126],
sm40$1=[0,-4,0,-4,0,-5,126,126,-2,126,-2,126,-4,126,-2,126,126,-5,126,-1,126,-7,126,-5,127,-5,126,126,-4,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,126,-5,126,126],
sm41$1=[0,-4,0,-4,0,-5,128,128,-5,128,-4,128,-2,128,-6,128,-9,129,-5,130,-6,128,-4,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-5,128,128],
sm42$1=[0,-4,0,-4,0,-5,131,131,-1,131,131,-2,131,-4,131,-2,131,131,-5,131,-1,131,-7,131,-5,131,131,-4,131,131,-4,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,-5,131,131],
sm43$1=[0,-4,0,-4,0,-5,132,132,-1,132,132,-2,132,-4,132,-2,132,132,-5,132,-1,132,-7,132,-5,132,132,-4,132,132,-4,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,-5,132,132],
sm44$1=[0,-4,0,-4,0,-5,133,133,-1,133,133,-2,133,-4,133,-2,133,133,-5,133,-1,133,-7,133,-5,133,133,-4,133,133,-4,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,-5,133,133],
sm45$1=[0,-2,3,-1,0,-4,0,-5,134,134,-1,134,134,-2,134,-4,134,-2,134,134,-5,134,-1,134,-7,134,-5,134,134,-4,134,134,-4,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-5,134,134,-12,42],
sm46$1=[0,-4,0,-4,0,-5,135,135,-1,135,135,-2,135,-4,135,-2,135,135,-5,135,-1,135,-7,135,-11,135,135,-4,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,-5,135,135],
sm47$1=[0,-4,0,-4,0,-5,136,136,-1,136,136,-2,136,-4,136,-2,136,136,-5,136,-1,136,-7,136,-11,136,136,-4,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,-5,136,136],
sm48$1=[0,-4,0,-4,0,-5,137,137,-1,137,137,-2,137,-4,137,-2,137,137,-5,137,-1,137,-7,137,-11,137,137,-4,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-5,137,137],
sm49$1=[0,-1,138,139,-1,140,141,142,143,144,0,-105,145],
sm50$1=[0,-1,146,147,-1,148,149,150,151,152,0,-106,153],
sm51$1=[0,-4,0,-4,0,-5,154,154,-1,154,154,-2,154,-4,154,-2,154,154,-5,154,-1,154,-7,154,-11,154,154,-4,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,154,-5,154,154],
sm52$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,155,-6,15,-19,25,-2,26,-1,156,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm53$1=[0,-4,0,-4,0,-17,157,-2,117,-29,158],
sm54$1=[0,-4,0,-4,0,-5,159,159,-1,159,159,-2,159,-4,159,-2,159,159,-5,159,-1,159,-7,159,-11,159,159,-4,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,-5,159,159],
sm55$1=[0,-4,0,-4,0,-5,160,160,-1,160,160,-2,160,-4,160,-2,160,160,-5,160,-1,160,-7,160,-11,160,160,-4,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,-5,160,160],
sm56$1=[0,-4,0,-4,0,-43,161],
sm57$1=[0,-4,0,-4,0,-43,127],
sm58$1=[0,-4,0,-4,0,-37,162],
sm59$1=[0,-2,3,-1,0,-4,0,-8,163,-8,164,-92,42],
sm60$1=[0,165,165,165,-1,0,-4,0,-8,165,165,-2,165,165,165,165,165,165,-1,165,165,-1,165,165,165,165,165,-1,165,-1,165,165,165,165,165,165,165,-1,165,-2,165,165,-5,165,-2,165,-2,165,-31,165,165,-3,165,165,165,165,165,165,165,-7,165,165,165,165,165,165],
sm61$1=[0,-4,0,-4,0,-20,166],
sm62$1=[0,167,167,167,-1,0,-4,0,-8,167,167,-2,167,167,167,167,167,167,-1,167,167,-1,167,167,167,167,167,-1,167,-1,167,167,167,167,167,167,167,-1,167,-2,167,167,-5,167,-2,167,-2,167,-31,167,167,-3,167,167,167,167,167,167,167,-7,167,167,167,167,167,167],
sm63$1=[0,-1,2,3,-1,0,-4,0,-8,4,-3,5,-6,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,-6,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm64$1=[0,-4,0,-4,0,-20,168],
sm65$1=[0,-4,0,-4,0,-20,169,-7,170],
sm66$1=[0,-4,0,-4,0,-20,171],
sm67$1=[0,-2,3,-1,0,-4,0,-12,172,-97,42],
sm68$1=[0,-2,3,-1,0,-4,0,-12,173,-97,42],
sm69$1=[0,-1,2,3,-1,0,-4,0,-8,113,-3,174,-1,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm70$1=[0,-4,0,-4,0,-20,175],
sm71$1=[0,-4,0,-4,0,-8,4],
sm72$1=[0,-4,0,-4,0,-12,176],
sm73$1=[0,177,177,177,-1,0,-4,0,-8,177,177,-2,177,177,177,177,177,177,-1,177,177,-2,177,177,177,177,-1,177,-1,177,177,177,177,177,177,177,-1,177,-2,177,177,-5,177,-2,177,-2,177,-31,177,177,-3,177,177,177,177,177,177,177,-7,177,177,177,177,177,177],
sm74$1=[0,-2,3,-1,0,-4,0,-8,178,-35,179,-65,42],
sm75$1=[0,180,180,180,-1,0,-4,0,-8,180,180,-2,180,180,180,180,180,180,-1,180,180,-2,180,180,180,180,-1,180,-1,180,180,180,180,180,180,180,-1,180,-2,180,180,-5,180,-2,180,-2,180,-31,180,180,-3,180,180,180,180,180,180,180,-7,180,180,180,180,180,180],
sm76$1=[0,-2,3,-1,0,-4,0,-20,181,-89,42],
sm77$1=[0,-2,182,-1,0,-4,0,-8,182,-8,182,-92,182],
sm78$1=[0,-2,183,-1,0,-4,0,-8,183,-8,183,-92,183],
sm79$1=[0,184,184,184,-1,0,-4,0,-8,184,184,-2,184,184,184,184,184,184,-1,184,184,-2,184,184,184,184,-1,184,-1,184,184,184,184,184,184,184,-1,184,-2,184,184,-5,184,-2,184,-2,184,-31,184,184,-3,184,184,184,184,184,184,184,-7,184,184,184,184,184,184],
sm80$1=[0,-4,0,-4,0,-9,185],
sm81$1=[0,186,186,186,-1,0,-4,0,-8,186,186,-2,186,186,186,186,186,186,-1,186,186,-1,186,186,186,186,186,-1,186,-1,186,186,186,186,186,186,186,-1,186,-2,186,186,-5,186,-2,186,-2,186,-31,186,186,-3,186,186,186,186,186,186,186,-7,186,186,186,186,186,186],
sm82$1=[0,-4,0,-4,0,-5,187,187,-2,187,-2,187,-8,187,-5,187,-9,187,-11,187,-18,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187],
sm83$1=[0,-4,0,-4,0,-5,188,188,-2,188,-2,188,-8,188,-5,188,-9,188,-11,188,-18,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188],
sm84$1=[0,-1,189,189,-1,0,-4,0,-8,189,-5,189,189,-1,189,-2,189,-7,189,-19,189,-2,189,-2,189,-31,189,189,-3,189,189,189,189,189,189,189,-7,189,189,189,189,189,189],
sm85$1=[0,-4,0,-4,0,-5,190,190,-2,190,-2,190,-8,190,-5,190,-9,190,-11,190,-18,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190,190],
sm86$1=[0,-4,0,-4,0,-5,59,59,-2,59,-2,59,-8,59,-5,59,-9,59,-11,59,-18,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,-5,73,74],
sm87$1=[0,-4,0,-4,0,-5,191,191,-1,191,191,-2,191,-4,191,-2,191,191,-5,191,-1,191,-7,191,-11,191,191,-4,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,191,-5,191,191],
sm88$1=[0,-4,0,-4,0,-5,192,192,-1,192,192,-2,192,-4,192,-2,192,192,-5,192,-1,192,-7,192,-11,192,192,-4,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,-5,192,192],
sm89$1=[0,-4,0,-4,0,-5,128,128,-1,128,128,-2,128,-4,128,-2,128,128,-5,128,-1,128,-7,128,-11,128,128,-4,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-5,128,128],
sm90$1=[0,-1,2,3,-1,0,-4,0,-5,193,-2,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,194,-1,26,-1,195,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm91$1=[0,-1,2,3,-1,0,-4,0,-5,196,-3,197,-7,198,-28,199,200,-5,201,-51,37,38,-3,42],
sm92$1=[0,-4,0,-4,0,-5,202,202,-1,202,202,-2,202,-4,202,-2,202,202,-5,202,-1,202,-7,202,-11,202,202,-4,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,202,-5,202,202],
sm93$1=[0,-4,0,-4,0,-5,203,203,-1,203,203,-2,203,-4,203,-2,203,203,-5,203,-1,203,-7,203,-11,203,203,-4,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,-5,203,203],
sm94$1=[0,-4,0,-4,0,-5,204,204,-2,204,-2,204,-8,204,-5,204,-9,204,-11,204,-18,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204],
sm95$1=[0,-4,0,-4,0,-5,205,205,-2,205,-2,205,-8,205,-5,205,-9,205,-11,205,-18,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],
sm96$1=[0,-4,0,-4,0,-5,206,206,-2,206,-2,206,-8,206,-5,206,-9,206,-11,206,-18,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],
sm97$1=[0,-4,0,-4,0,-5,207,207,-2,207,-2,207,-8,207,-5,207,-9,207,-11,207,-18,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207],
sm98$1=[0,-4,0,-4,0,-5,208,208,-2,208,-2,208,-8,208,-5,208,-9,208,-11,208,-18,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208],
sm99$1=[0,-4,0,-4,0,-5,209,209,-2,209,-2,209,-8,209,-5,209,-9,209,-11,209,-18,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209],
sm100$1=[0,-4,0,-4,0,-5,210,210,-2,210,-2,210,-8,210,-5,210,-9,210,-11,210,-18,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210],
sm101$1=[0,-4,0,-4,0,-5,211,211,-2,211,-2,211,-8,211,-5,211,-9,211,-11,211,-18,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211],
sm102$1=[0,-2,3,-1,0,-4,0,-110,42],
sm103$1=[0,-4,0,-4,0,-5,212,212,-1,212,212,-2,212,-4,212,-2,212,212,-5,212,-1,212,-7,212,-11,212,212,-4,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,-5,212,212],
sm104$1=[0,-1,2,3,-1,0,-4,0,-5,213,-2,113,-5,6,7,-1,114,-2,10,214,-6,15,-19,25,-2,26,-1,215,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm105$1=[0,-4,0,-4,0,-5,216,216,-1,216,216,-2,216,-4,216,-2,216,216,-5,216,-1,216,-7,216,-11,216,216,-4,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,216,-5,216,216],
sm106$1=[0,-4,0,-4,0,-5,217,217,-1,217,217,-2,217,-8,217,-5,217,-1,217,-7,217,-11,217,-5,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,217,-5,217,217],
sm107$1=[0,-4,0,-4,0,-52,218],
sm108$1=[0,-4,0,-4,0,-17,157,-32,158],
sm109$1=[0,-4,0,-4,0,-5,219,219,-1,219,219,-2,219,-4,219,-2,219,219,-5,219,-1,219,-7,219,-5,219,219,-4,219,219,-4,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,-5,219,219],
sm110$1=[0,-1,138,139,-1,140,141,142,143,144,0,-105,220],
sm111$1=[0,-4,0,-4,0,-5,221,221,-1,221,221,-2,221,-4,221,-2,221,221,-5,221,-1,221,-7,221,-11,221,221,-4,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,-5,221,221],
sm112$1=[0,-1,222,222,-1,222,222,222,222,222,0,-105,222],
sm113$1=[0,-1,223,223,-1,223,223,223,223,223,0,-105,223],
sm114$1=[0,-1,146,147,-1,148,149,150,151,152,0,-106,224],
sm115$1=[0,-1,225,225,-1,225,225,225,225,225,0,-106,225],
sm116$1=[0,-1,226,226,-1,226,226,226,226,226,0,-106,226],
sm117$1=[0,-4,0,-4,0,-5,227,227,-1,227,227,-2,227,-4,227,-2,227,227,-5,227,-1,227,-7,227,-5,227,-5,227,227,-4,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,-5,227,227],
sm118$1=[0,-4,0,-4,0,-5,228,-15,229],
sm119$1=[0,-4,0,-4,0,-5,128,128,-2,128,-2,128,-4,128,-2,128,128,-5,128,-1,128,-7,128,-5,130,-5,128,128,-4,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-5,128,128],
sm120$1=[0,-4,0,-4,0,-5,230,230,-1,230,230,-2,230,-4,230,-2,230,230,-5,230,-1,230,-7,230,-11,230,230,-4,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,230,-5,230,230],
sm121$1=[0,-4,0,-4,0,-5,231,231,-2,231,-2,231,-8,231,-5,231,-9,231,-11,231,-18,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231],
sm122$1=[0,-1,2,3,-1,0,-4,0,-8,232,-5,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm123$1=[0,233,233,233,-1,0,-4,0,-8,233,233,-2,233,233,233,233,233,233,-1,233,233,-1,233,233,233,233,233,-1,233,-1,233,233,233,233,233,233,233,-1,233,-2,233,233,-5,233,-2,233,-2,233,-31,233,233,-3,233,233,233,233,233,233,233,-7,233,233,233,233,233,233],
sm124$1=[0,-1,2,3,-1,0,-4,0,-8,4,-3,5,-1,6,-4,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,-6,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm125$1=[0,-4,0,-4,0,-5,234,-6,235],
sm126$1=[0,-4,0,-4,0,-5,236,-6,236],
sm127$1=[0,-4,0,-4,0,-5,237,-6,237,-42,238],
sm128$1=[0,-4,0,-4,0,-55,238],
sm129$1=[0,-4,0,-4,0,-5,130,-2,130,130,-2,130,-7,130,130,-5,130,-1,130,-14,130,-4,130,-5,130],
sm130$1=[0,-4,0,-4,0,-5,239,-3,239,-11,239,-5,239,-1,239,-19,239,-5,239],
sm131$1=[0,-1,2,3,-1,0,-4,0,-9,240,-7,198,-35,241,-51,37,38,-3,42],
sm132$1=[0,-2,3,-1,0,-4,0,-5,193,-2,163,-8,164,-31,242,-3,243,-56,42],
sm133$1=[0,-4,0,-4,0,-25,244],
sm134$1=[0,-1,2,3,-1,0,-4,0,-8,113,-3,245,-1,6,7,8,-3,10,-2,246,-4,15,-13,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm135$1=[0,-4,0,-4,0,-20,247],
sm136$1=[0,248,248,248,-1,0,-4,0,-8,248,248,-2,248,248,248,248,248,248,-1,248,248,-1,248,248,248,248,248,-1,248,-1,248,248,248,248,248,248,248,-1,248,-2,248,248,-5,248,-2,248,-2,248,-31,248,248,-3,248,248,248,248,248,248,248,-7,248,248,248,248,248,248],
sm137$1=[0,-4,0,-4,0,-12,249],
sm138$1=[0,-4,0,-4,0,-12,129],
sm139$1=[0,250,250,250,-1,0,-4,0,-8,250,250,-2,250,250,250,250,250,250,-1,250,250,-1,250,250,250,250,250,-1,250,-1,250,250,250,250,250,250,250,-1,250,-2,250,250,-5,250,-2,250,-2,250,-31,250,250,-3,250,250,250,250,250,250,250,-7,250,250,250,250,250,250],
sm140$1=[0,-4,0,-4,0,-12,251],
sm141$1=[0,252,252,252,-1,0,-4,0,-8,252,252,-2,252,252,252,252,252,252,-1,252,252,-1,252,252,252,252,252,-1,252,-1,252,252,252,252,252,252,252,-1,252,-2,252,252,-5,252,-2,252,-2,252,-31,252,252,-3,252,252,252,252,252,252,252,-7,252,252,252,252,252,252],
sm142$1=[0,-4,0,-4,0,-12,253],
sm143$1=[0,-4,0,-4,0,-12,254],
sm144$1=[0,-4,0,-4,0,-39,255,256],
sm145$1=[0,257,257,257,-1,0,-4,0,-8,257,257,-2,257,257,257,257,257,257,-1,257,257,-1,257,257,257,257,257,-1,257,-1,257,257,257,257,257,257,257,-1,257,-2,257,257,-5,257,-2,257,-2,257,-31,257,257,-3,257,257,257,257,257,257,257,-7,257,257,257,257,257,257],
sm146$1=[0,-4,0,-4,0,-8,178,-35,179],
sm147$1=[0,258,258,258,-1,0,-4,0,-5,258,258,-1,258,258,-2,258,258,258,258,258,258,-1,258,258,258,-1,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,-2,258,258,-5,258,258,258,258,-2,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,-7,258,258,258,258,258,258],
sm148$1=[0,-4,0,-4,0,-8,259],
sm149$1=[0,-1,2,3,-1,0,-4,0,-9,260,-2,261,-4,198,-27,262,199,200,-57,37,38,-3,42],
sm150$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,-27,25,-2,26,-2,27,-50,37,38,39,40,41,42],
sm151$1=[0,-4,0,-4,0,-20,263],
sm152$1=[0,-2,3,-1,0,-4,0,-8,163,-8,164,-3,264,-31,243,-56,42],
sm153$1=[0,-4,0,-4,0,-5,265,-6,266],
sm154$1=[0,-4,0,-4,0,-5,267,-6,267],
sm155$1=[0,268,268,268,-1,0,-4,0,-8,268,268,-2,268,268,268,268,268,268,-1,268,268,-1,268,268,268,268,268,-1,268,-1,268,268,268,268,268,268,268,-1,268,268,268,268,268,-5,268,-2,268,-2,268,-31,268,268,-3,268,268,268,268,268,268,268,-7,268,268,268,268,268,268],
sm156$1=[0,-4,0,-4,0,-5,269,-6,269,-8,269,-15,269,-11,269],
sm157$1=[0,-4,0,-4,0,-5,270,-3,270,-2,270,-8,270,-15,270,-11,270],
sm158$1=[0,-4,0,-4,0,-37,271],
sm159$1=[0,-4,0,-4,0,-5,272,-3,272,-2,272,-8,272,-15,272,-11,272,-18,272,272,79],
sm160$1=[0,-4,0,-4,0,-5,273,-3,273,-2,273,-8,273,-15,273,-11,273,-18,273,273,273,81],
sm161$1=[0,-4,0,-4,0,-5,274,-3,274,-2,274,-8,274,-15,274,-11,274,-18,274,274,274,274,83],
sm162$1=[0,-4,0,-4,0,-5,275,-3,275,-2,275,-8,275,-15,275,-11,275,-18,275,275,275,275,275,85],
sm163$1=[0,-4,0,-4,0,-5,276,-3,276,-2,276,-8,276,-15,276,-11,276,-18,276,276,276,276,276,276,87,88,89,90],
sm164$1=[0,-4,0,-4,0,-5,277,-3,277,-2,277,-8,277,-5,92,-9,277,-11,277,-18,277,277,277,277,277,277,277,277,277,277,93,94,95,96,97],
sm165$1=[0,-4,0,-4,0,-5,278,-3,278,-2,278,-8,278,-5,278,-9,278,-11,278,-18,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,99,100,101],
sm166$1=[0,-4,0,-4,0,-5,279,-3,279,-2,279,-8,279,-5,279,-9,279,-11,279,-18,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,99,100,101],
sm167$1=[0,-4,0,-4,0,-5,280,-3,280,-2,280,-8,280,-5,280,-9,280,-11,280,-18,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,99,100,101],
sm168$1=[0,-4,0,-4,0,-5,281,-3,281,-2,281,-8,281,-5,281,-9,281,-11,281,-18,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,99,100,101],
sm169$1=[0,-4,0,-4,0,-5,282,-3,282,-2,282,-8,282,-5,282,-9,282,-11,282,-18,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,99,100,101],
sm170$1=[0,-4,0,-4,0,-5,283,-3,283,-2,283,-8,283,-5,283,-9,283,-11,283,-18,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,99,100,101],
sm171$1=[0,-4,0,-4,0,-5,284,-3,284,-2,284,-8,284,-5,284,-9,284,-11,284,-18,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,103,104],
sm172$1=[0,-4,0,-4,0,-5,285,-3,285,-2,285,-8,285,-5,285,-9,285,-11,285,-18,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,103,104],
sm173$1=[0,-4,0,-4,0,-5,286,-3,286,-2,286,-8,286,-5,286,-9,286,-11,286,-18,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,103,104],
sm174$1=[0,-4,0,-4,0,-5,287,106,-2,287,-2,287,-8,287,-5,287,-9,287,-11,287,-18,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,107,108],
sm175$1=[0,-4,0,-4,0,-5,288,106,-2,288,-2,288,-8,288,-5,288,-9,288,-11,288,-18,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,107,108],
sm176$1=[0,-4,0,-4,0,-5,289,289,-2,289,-2,289,-8,289,-5,289,-9,289,-11,289,-18,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289,289],
sm177$1=[0,-4,0,-4,0,-5,290,290,-2,290,-2,290,-8,290,-5,290,-9,290,-11,290,-18,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290],
sm178$1=[0,-4,0,-4,0,-5,291,291,-2,291,-2,291,-8,291,-5,291,-9,291,-11,291,-18,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291],
sm179$1=[0,-4,0,-4,0,-5,292,292,-2,292,-2,292,-8,292,-5,292,-9,292,-11,292,-18,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292],
sm180$1=[0,-4,0,-4,0,-5,293,-43,294],
sm181$1=[0,-1,2,3,-1,0,-4,0,-5,295,-2,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,296,-1,26,-1,195,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm182$1=[0,-4,0,-4,0,-5,297,297,-1,297,297,-2,297,-4,297,-2,297,297,-5,297,-1,297,-7,297,-11,297,297,-4,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,-5,297,297],
sm183$1=[0,-4,0,-4,0,-5,298,-43,298],
sm184$1=[0,-1,299,299,-1,0,-4,0,-5,299,-2,299,-5,299,299,-1,299,-2,299,-7,299,-19,299,299,-1,299,-1,299,299,-31,299,299,-3,299,299,299,299,299,299,299,-7,299,299,299,299,299,299],
sm185$1=[0,-4,0,-4,0,-5,300,-3,301],
sm186$1=[0,-4,0,-4,0,-9,302],
sm187$1=[0,-4,0,-4,0,-5,303,303,-1,303,303,-2,303,-4,303,-2,303,303,-5,303,-1,303,-7,303,-11,303,303,-4,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303,-5,303,303],
sm188$1=[0,-4,0,-4,0,-5,304,-3,304],
sm189$1=[0,-4,0,-4,0,-5,305,-3,305],
sm190$1=[0,-4,0,-4,0,-5,305,-3,305,-45,238],
sm191$1=[0,-4,0,-4,0,-20,306,-16,307],
sm192$1=[0,-4,0,-4,0,-5,131,-3,131,-10,308,-16,308,-17,131],
sm193$1=[0,-1,2,3,-1,0,-4,0,-17,198,-87,37,38,-3,42],
sm194$1=[0,-4,0,-4,0,-20,309,-16,309],
sm195$1=[0,-4,0,-4,0,-20,308,-16,308],
sm196$1=[0,-4,0,-4,0,-5,310,310,-1,310,310,-2,310,-4,310,-2,310,310,-5,310,-1,310,-7,310,-11,310,310,-4,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,-5,310,310],
sm197$1=[0,-4,0,-4,0,-49,311],
sm198$1=[0,-4,0,-4,0,-5,312,-15,313],
sm199$1=[0,-4,0,-4,0,-21,314],
sm200$1=[0,-4,0,-4,0,-5,315,315,-1,315,315,-2,315,-4,315,-2,315,315,-5,315,-1,315,-7,315,-11,315,315,-4,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,-5,315,315],
sm201$1=[0,-4,0,-4,0,-5,316,-15,317],
sm202$1=[0,-4,0,-4,0,-5,318,-15,318],
sm203$1=[0,-4,0,-4,0,-5,319,-15,319],
sm204$1=[0,-4,0,-4,0,-49,320],
sm205$1=[0,-4,0,-4,0,-5,321,321,-1,321,321,-2,321,-4,321,-2,321,321,-5,321,-1,321,-7,321,-11,321,321,-4,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,-5,321,321],
sm206$1=[0,-4,0,-4,0,-5,322,322,-1,322,322,-2,322,-4,322,-2,322,322,-5,322,-1,322,-7,322,-11,322,322,-4,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,-5,322,322],
sm207$1=[0,-4,0,-4,0,-5,323,323,-1,323,323,-2,323,-4,323,-2,323,323,-5,323,-1,323,-7,323,-11,323,323,-4,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,-5,323,323],
sm208$1=[0,-4,0,-4,0,-5,324,324,-1,324,324,-2,324,-4,324,-2,324,324,-5,324,-1,324,-7,324,-11,324,324,-4,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,-5,324,324],
sm209$1=[0,-1,325,325,-1,325,325,325,325,325,0,-105,325],
sm210$1=[0,-1,326,326,-1,326,326,326,326,326,0,-106,326],
sm211$1=[0,-4,0,-4,0,-5,327,327,-1,327,327,-2,327,-4,327,-2,327,327,-5,327,-1,327,-7,327,-5,327,-5,327,327,-4,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,-5,327,327],
sm212$1=[0,-4,0,-4,0,-21,328,-31,329],
sm213$1=[0,-4,0,-4,0,-21,330],
sm214$1=[0,-4,0,-4,0,-21,331],
sm215$1=[0,-4,0,-4,0,-5,332,332,-1,332,332,-2,332,-4,332,-2,332,332,-5,332,-1,332,-7,332,-11,332,332,-4,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,332,-5,332,332],
sm216$1=[0,-4,0,-4,0,-49,333],
sm217$1=[0,-4,0,-4,0,-5,334,-3,334,-2,334,-8,334,-15,334,-11,334],
sm218$1=[0,-4,0,-4,0,-5,335,-3,335,-2,335,-8,335,-15,335,-11,335],
sm219$1=[0,336,336,336,-1,0,-4,0,-8,336,336,-2,336,336,336,336,336,336,-1,336,336,-1,336,336,336,336,336,-1,336,-1,336,336,336,336,336,336,336,-1,336,-2,336,336,-5,336,-2,336,-2,336,-31,336,336,-3,336,336,336,336,336,336,336,-7,336,336,336,336,336,336],
sm220$1=[0,337,337,337,-1,0,-4,0,-8,337,337,-2,337,337,337,337,337,337,-1,337,337,-1,337,337,337,337,337,-1,337,-1,337,337,337,337,337,337,337,-1,337,-2,337,337,-5,337,-2,337,-2,337,-31,337,337,-3,337,337,337,337,337,337,337,-7,337,337,337,337,337,337],
sm221$1=[0,338,338,338,-1,0,-4,0,-8,338,338,-2,338,338,338,338,338,338,-1,338,338,-1,338,338,338,338,338,-1,338,-1,338,338,338,338,338,338,338,-1,338,-2,338,338,-5,338,-2,338,-2,338,-31,338,338,-3,338,338,338,338,338,338,338,-7,338,338,338,338,338,338],
sm222$1=[0,-4,0,-4,0,-5,339,-6,339],
sm223$1=[0,-4,0,-4,0,-5,340,-3,340,-11,340,-5,340,-1,340,-19,340,-5,340],
sm224$1=[0,-4,0,-4,0,-9,341],
sm225$1=[0,-4,0,-4,0,-5,342,-3,343],
sm226$1=[0,-4,0,-4,0,-5,344,-3,344],
sm227$1=[0,-4,0,-4,0,-5,345,-3,345],
sm228$1=[0,-4,0,-4,0,-37,346],
sm229$1=[0,-4,0,-4,0,-5,347,-3,347,-11,347,-27,347,-5,238],
sm230$1=[0,-4,0,-4,0,-5,348,-3,348,-11,348,-5,348,-1,348,-19,348,-5,348],
sm231$1=[0,-2,3,-1,0,-4,0,-5,295,-2,163,-8,164,-31,349,-3,243,-56,42],
sm232$1=[0,-4,0,-4,0,-49,350],
sm233$1=[0,-4,0,-4,0,-5,351,-43,352],
sm234$1=[0,-4,0,-4,0,-5,353,-43,353],
sm235$1=[0,-4,0,-4,0,-5,354,-43,354],
sm236$1=[0,-4,0,-4,0,-5,355,-3,355,-11,355,-27,355],
sm237$1=[0,-4,0,-4,0,-5,355,-3,355,-11,355,-27,355,-5,238],
sm238$1=[0,-4,0,-4,0,-21,356],
sm239$1=[0,-4,0,-4,0,-20,357],
sm240$1=[0,-4,0,-4,0,-21,358],
sm241$1=[0,-4,0,-4,0,-12,359],
sm242$1=[0,-1,2,3,-1,0,-4,0,-8,113,-3,360,-1,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm243$1=[0,-4,0,-4,0,-27,361],
sm244$1=[0,-1,2,3,-1,0,-4,0,-8,113,-3,362,-1,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm245$1=[0,-4,0,-4,0,-29,363],
sm246$1=[0,-4,0,-4,0,-12,364],
sm247$1=[0,-4,0,-4,0,-5,59,59,-5,59,-14,365,-1,366,-25,60,61,62,63,64,65,66,67,68,69,70,71,72,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,-5,73,74],
sm248$1=[0,-4,0,-4,0,-27,365,-1,366],
sm249$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,8,-3,10,-2,367,-18,24,-5,25,-2,26,-2,27,-50,37,38,39,40,41,42],
sm250$1=[0,-4,0,-4,0,-21,368],
sm251$1=[0,369,369,369,-1,0,-4,0,-8,369,369,-2,369,369,369,369,369,369,-1,369,369,-1,369,369,369,369,369,-1,369,-1,369,369,369,369,369,369,369,-1,369,-2,369,369,-5,369,-2,369,-2,369,-31,369,369,-3,369,369,369,369,369,369,369,-7,369,369,369,369,369,369],
sm252$1=[0,370,370,370,-1,0,-4,0,-8,370,370,-2,370,370,370,370,370,370,-1,370,370,-1,370,370,370,370,370,-1,370,-1,370,370,370,370,370,370,370,-1,370,-2,370,370,-5,370,-2,370,-2,370,-31,370,370,-3,370,370,370,370,370,370,370,-7,370,370,370,370,370,370],
sm253$1=[0,371,371,371,-1,0,-4,0,-8,371,371,-2,371,371,371,371,371,371,-1,371,371,-1,371,371,371,371,371,-1,371,-1,371,371,371,371,371,371,371,-1,371,-2,371,371,-5,371,-2,371,-2,371,-31,371,371,-3,371,371,371,371,371,371,371,-7,371,371,371,371,371,371],
sm254$1=[0,-4,0,-4,0,-21,372],
sm255$1=[0,373,373,373,-1,0,-4,0,-8,373,373,-2,373,373,373,373,373,373,-1,373,373,-1,373,373,373,373,373,-1,373,-1,373,373,373,373,373,373,373,-1,373,-2,373,373,-5,373,-2,373,-2,373,-31,373,373,-3,373,373,373,373,373,373,373,-7,373,373,373,373,373,373],
sm256$1=[0,374,374,374,-1,0,-4,0,-8,374,374,-2,374,374,374,374,374,374,-1,374,374,-1,374,374,374,374,374,-1,374,-1,374,374,374,374,374,374,374,-1,374,-1,256,374,374,-5,374,-2,374,-2,374,-31,374,374,-3,374,374,374,374,374,374,374,-7,374,374,374,374,374,374],
sm257$1=[0,375,375,375,-1,0,-4,0,-8,375,375,-2,375,375,375,375,375,375,-1,375,375,-1,375,375,375,375,375,-1,375,-1,375,375,375,375,375,375,375,-1,375,-2,375,375,-5,375,-2,375,-2,375,-31,375,375,-3,375,375,375,375,375,375,375,-7,375,375,375,375,375,375],
sm258$1=[0,-4,0,-4,0,-20,376],
sm259$1=[0,377,377,377,-1,0,-4,0,-5,377,377,-1,377,377,-2,377,377,377,377,377,377,-1,377,377,377,-1,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,-2,377,377,-5,377,377,377,377,-2,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,-7,377,377,377,377,377,377],
sm260$1=[0,-1,2,3,-1,0,-4,0,-9,378,-2,261,-4,198,-27,262,199,200,-57,37,38,-3,42],
sm261$1=[0,-4,0,-4,0,-9,379],
sm262$1=[0,380,380,380,-1,0,-4,0,-5,380,380,-1,380,380,-2,380,380,380,380,380,380,-1,380,380,380,-1,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,-2,380,380,-5,380,380,380,380,-2,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,-7,380,380,380,380,380,380],
sm263$1=[0,-1,2,3,-1,0,-4,0,-9,381,-2,261,-4,198,-27,262,199,200,-57,37,38,-3,42],
sm264$1=[0,-1,382,382,-1,0,-4,0,-9,382,-2,382,-4,382,-27,382,382,382,-57,382,382,-3,382],
sm265$1=[0,-1,383,383,-1,0,-4,0,-9,383,-2,383,-4,383,-27,383,383,383,-57,383,383,-3,383],
sm266$1=[0,-1,2,3,-1,0,-4,0,-17,198,-28,199,200,-57,37,38,-3,42],
sm267$1=[0,-4,0,-4,0,-20,306],
sm268$1=[0,-4,0,-4,0,-20,308],
sm269$1=[0,-4,0,-4,0,-8,384],
sm270$1=[0,-2,3,-1,0,-4,0,-8,163,-8,164,-3,385,-31,243,-56,42],
sm271$1=[0,-4,0,-4,0,-21,386],
sm272$1=[0,-4,0,-4,0,-8,387],
sm273$1=[0,-4,0,-4,0,-21,388],
sm274$1=[0,-4,0,-4,0,-5,389,-15,388],
sm275$1=[0,-4,0,-4,0,-21,390],
sm276$1=[0,-4,0,-4,0,-5,391,-15,391],
sm277$1=[0,-4,0,-4,0,-5,392,-15,392],
sm278$1=[0,393,393,393,-1,0,-4,0,-8,393,393,-2,393,393,393,393,393,393,-1,393,393,-2,393,393,393,393,-1,393,-1,393,393,393,393,393,393,393,-1,393,-2,393,393,-5,393,-2,393,-2,393,-31,393,393,-3,393,393,393,393,393,393,393,-7,393,393,393,393,393,393],
sm279$1=[0,-4,0,-4,0,-5,394,-6,394],
sm280$1=[0,-4,0,-4,0,-5,295,-43,395],
sm281$1=[0,-4,0,-4,0,-5,396,396,-1,396,396,-2,396,-4,396,-2,396,396,-5,396,-1,396,-7,396,-11,396,396,-4,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,-5,396,396],
sm282$1=[0,-1,2,3,-1,0,-4,0,-5,193,-2,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,299,-1,26,-1,195,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm283$1=[0,-4,0,-4,0,-5,397,397,-1,397,397,-2,397,-4,397,-2,397,397,-5,397,-1,397,-7,397,-11,397,397,-4,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,397,-5,397,397],
sm284$1=[0,-4,0,-4,0,-5,398,-43,398],
sm285$1=[0,-1,399,399,-1,0,-4,0,-5,399,-2,399,-5,399,399,-1,399,-2,399,-7,399,-19,399,399,-1,399,-1,399,399,-31,399,399,-3,399,399,399,399,399,399,399,-7,399,399,399,399,399,399],
sm286$1=[0,-4,0,-4,0,-5,400,-43,400],
sm287$1=[0,-1,2,3,-1,0,-4,0,-9,401,-7,198,-28,199,200,-5,201,-51,37,38,-3,42],
sm288$1=[0,-4,0,-4,0,-5,402,402,-1,402,402,-2,402,-4,402,-2,402,402,-5,402,-1,402,-7,402,-11,402,402,-4,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,402,-5,402,402],
sm289$1=[0,-4,0,-4,0,-5,403,403,-1,403,403,-2,403,-4,403,-2,403,403,-5,403,-1,403,-7,403,-11,403,403,-4,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,-5,403,403],
sm290$1=[0,-4,0,-4,0,-5,404,-3,404],
sm291$1=[0,-4,0,-4,0,-5,405,-3,405],
sm292$1=[0,-2,3,-1,0,-4,0,-8,163,-8,164,-35,243,-56,42],
sm293$1=[0,-4,0,-4,0,-20,406],
sm294$1=[0,-4,0,-4,0,-20,407],
sm295$1=[0,-4,0,-4,0,-49,408],
sm296$1=[0,-4,0,-4,0,-5,409,409,-1,409,409,-2,409,-4,409,-2,409,409,-5,409,-1,409,-7,409,-11,409,409,-4,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,-5,409,409],
sm297$1=[0,-4,0,-4,0,-21,410],
sm298$1=[0,-4,0,-4,0,-5,411,411,-1,411,411,-2,411,-4,411,-2,411,411,-5,411,-1,411,-7,411,-11,411,411,-4,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,-5,411,411],
sm299$1=[0,-4,0,-4,0,-5,412,412,-1,412,412,-2,412,-4,412,-2,412,412,-5,412,-1,412,-7,412,-11,412,412,-4,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,-5,412,412],
sm300$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-1,215,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm301$1=[0,-4,0,-4,0,-5,413,-15,413],
sm302$1=[0,-4,0,-4,0,-5,414,414,-1,414,414,-2,414,-4,414,-2,414,414,-5,414,-1,414,-7,414,-11,414,414,-4,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,-5,414,414],
sm303$1=[0,-4,0,-4,0,-5,415,415,-1,415,415,-2,415,-4,415,-2,415,415,-5,415,-1,415,-7,415,-5,415,-5,415,415,-4,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,-5,415,415],
sm304$1=[0,-4,0,-4,0,-5,416,416,-1,416,416,-2,416,-4,416,-2,416,416,-5,416,-1,416,-7,416,-5,416,-5,416,416,-4,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,416,-5,416,416],
sm305$1=[0,-4,0,-4,0,-5,417,417,-1,417,417,-2,417,-4,417,-2,417,417,-5,417,-1,417,-7,417,-11,417,417,-4,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,417,-5,417,417],
sm306$1=[0,-4,0,-4,0,-9,418],
sm307$1=[0,-4,0,-4,0,-9,419],
sm308$1=[0,-4,0,-4,0,-5,420,-6,420],
sm309$1=[0,-4,0,-4,0,-5,421,-3,421,-2,421,-8,421,-27,421],
sm310$1=[0,-4,0,-4,0,-5,422,-3,422,-11,422,-5,422,-1,422,-19,422,-5,422],
sm311$1=[0,-1,2,3,-1,0,-4,0,-9,423,-7,198,-35,241,-51,37,38,-3,42],
sm312$1=[0,-4,0,-4,0,-9,424],
sm313$1=[0,-4,0,-4,0,-5,425,-3,425,-11,425,-27,425],
sm314$1=[0,-4,0,-4,0,-49,426],
sm315$1=[0,-4,0,-4,0,-5,427,-3,427,-11,427,-5,427,-1,427,-19,427,-5,427],
sm316$1=[0,-4,0,-4,0,-5,428,-43,428],
sm317$1=[0,-2,3,-1,0,-4,0,-5,193,-2,163,-8,164,-31,429,-3,243,-56,42],
sm318$1=[0,-4,0,-4,0,-21,430,-27,430],
sm319$1=[0,-4,0,-4,0,-5,431,-3,431,-11,431,-27,431],
sm320$1=[0,-1,2,3,-1,0,-4,0,-8,113,-3,432,-1,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm321$1=[0,-4,0,-4,0,-12,433],
sm322$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,434,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm323$1=[0,-4,0,-4,0,-12,435],
sm324$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,436,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm325$1=[0,-4,0,-4,0,-5,234,-6,437],
sm326$1=[0,-4,0,-4,0,-27,438,-1,439],
sm327$1=[0,-4,0,-4,0,-5,237,-6,237,-14,440,-1,440,-25,238],
sm328$1=[0,-4,0,-4,0,-27,440,-1,440,-25,238],
sm329$1=[0,-4,0,-4,0,-27,441,-1,441],
sm330$1=[0,-4,0,-4,0,-29,442],
sm331$1=[0,-4,0,-4,0,-29,366],
sm332$1=[0,-4,0,-4,0,-8,443],
sm333$1=[0,444,444,444,-1,0,-4,0,-8,444,444,-2,444,444,444,444,444,444,-1,444,444,-1,444,444,444,444,444,-1,444,-1,444,444,444,444,444,444,444,-1,444,-2,444,444,-5,444,-2,444,-2,444,-31,444,444,-3,444,444,444,444,444,444,444,-7,444,444,444,444,444,444],
sm334$1=[0,445,445,445,-1,0,-4,0,-8,445,445,-2,445,445,445,445,445,445,-1,445,445,-1,445,445,445,445,445,-1,445,-1,445,445,445,445,445,445,445,-1,445,-2,445,445,-5,445,-2,445,-2,445,-31,445,445,-3,445,445,445,445,445,445,445,-7,445,445,445,445,445,445],
sm335$1=[0,-4,0,-4,0,-9,446],
sm336$1=[0,447,447,447,-1,0,-4,0,-5,447,447,-1,447,447,-2,447,447,447,447,447,447,-1,447,447,447,-1,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,-2,447,447,-5,447,447,447,447,-2,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,447,-7,447,447,447,447,447,447],
sm337$1=[0,448,448,448,-1,0,-4,0,-5,448,448,-1,448,448,-2,448,448,448,448,448,448,-1,448,448,448,-1,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,-2,448,448,-5,448,448,448,448,-2,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,448,-7,448,448,448,448,448,448],
sm338$1=[0,-1,449,449,-1,0,-4,0,-9,449,-2,449,-4,449,-27,449,449,449,-57,449,449,-3,449],
sm339$1=[0,-1,450,450,-1,0,-4,0,-9,450,-2,450,-4,450,-27,450,450,450,-57,450,450,-3,450],
sm340$1=[0,-4,0,-4,0,-21,451],
sm341$1=[0,-4,0,-4,0,-8,452],
sm342$1=[0,-4,0,-4,0,-8,453],
sm343$1=[0,-1,2,3,-1,0,-4,0,-8,4,454,-2,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm344$1=[0,-2,3,-1,0,-4,0,-8,163,-8,164,-3,455,-31,243,-56,42],
sm345$1=[0,-4,0,-4,0,-5,456,-6,456],
sm346$1=[0,-4,0,-4,0,-5,457,-3,457,-2,457,-8,457,-15,457,-11,457],
sm347$1=[0,-4,0,-4,0,-5,458,458,-1,458,458,-2,458,-4,458,-2,458,458,-5,458,-1,458,-7,458,-11,458,458,-4,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-5,458,458],
sm348$1=[0,-4,0,-4,0,-5,459,-43,459],
sm349$1=[0,-1,2,3,-1,0,-4,0,-5,295,-2,113,-5,6,7,-1,114,-2,10,-7,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm350$1=[0,-4,0,-4,0,-5,460,460,-1,460,460,-2,460,-4,460,-2,460,460,-5,460,-1,460,-7,460,-11,460,460,-4,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-5,460,460],
sm351$1=[0,-4,0,-4,0,-5,461,-3,461],
sm352$1=[0,-4,0,-4,0,-5,462,-3,462],
sm353$1=[0,-4,0,-4,0,-21,463],
sm354$1=[0,-4,0,-4,0,-21,464],
sm355$1=[0,-4,0,-4,0,-21,465],
sm356$1=[0,-4,0,-4,0,-20,466,-16,466],
sm357$1=[0,-4,0,-4,0,-5,467,467,-1,467,467,-2,467,-4,467,-2,467,467,-5,467,-1,467,-7,467,-11,467,467,-4,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,-5,467,467],
sm358$1=[0,-4,0,-4,0,-5,468,-15,468],
sm359$1=[0,-4,0,-4,0,-21,469],
sm360$1=[0,-4,0,-4,0,-21,470],
sm361$1=[0,-4,0,-4,0,-5,471,-3,471,-2,471,-8,471,-15,471,-11,471],
sm362$1=[0,-4,0,-4,0,-9,472],
sm363$1=[0,-4,0,-4,0,-5,473,-3,473,-11,473,-5,473,-1,473,-19,473,-5,473],
sm364$1=[0,-4,0,-4,0,-5,474,-3,474],
sm365$1=[0,-4,0,-4,0,-5,475,-3,475],
sm366$1=[0,-4,0,-4,0,-5,476,-3,476,-11,476,-5,476,-1,476,-19,476,-5,476],
sm367$1=[0,-2,3,-1,0,-4,0,-5,295,-2,163,-8,164,-31,477,-3,243,-56,42],
sm368$1=[0,-4,0,-4,0,-49,478],
sm369$1=[0,-4,0,-4,0,-5,479,-43,479],
sm370$1=[0,480,480,480,-1,0,-4,0,-8,480,480,-2,480,480,480,480,480,480,-1,480,480,-1,481,480,480,480,480,-1,480,-1,480,480,480,480,480,480,480,-1,480,-2,480,480,-5,480,-2,480,-2,480,-31,480,480,-3,480,480,480,480,480,480,480,-7,480,480,480,480,480,480],
sm371$1=[0,-4,0,-4,0,-21,482],
sm372$1=[0,483,483,483,-1,0,-4,0,-8,483,483,-2,483,483,483,483,483,483,-1,483,483,-1,483,483,483,483,483,-1,483,-1,483,483,483,483,483,483,483,-1,483,-2,483,483,-5,483,-2,483,-2,483,-31,483,483,-3,483,483,483,483,483,483,483,-7,483,483,483,483,483,483],
sm373$1=[0,-4,0,-4,0,-12,484],
sm374$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,485,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm375$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,486,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm376$1=[0,-4,0,-4,0,-21,487],
sm377$1=[0,-4,0,-4,0,-21,488],
sm378$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,489,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm379$1=[0,-4,0,-4,0,-21,490],
sm380$1=[0,-4,0,-4,0,-21,491],
sm381$1=[0,-4,0,-4,0,-29,439],
sm382$1=[0,-4,0,-4,0,-29,440],
sm383$1=[0,492,492,492,-1,0,-4,0,-8,492,492,-2,492,492,492,492,492,492,-1,492,492,-1,492,492,492,492,492,-1,492,-1,492,492,492,492,492,492,492,-1,492,-2,492,492,-5,492,-2,492,-2,492,-31,492,492,-3,492,492,492,492,492,492,492,-7,492,492,492,492,492,492],
sm384$1=[0,-4,0,-4,0,-9,493,-3,494,-22,495],
sm385$1=[0,496,496,496,-1,0,-4,0,-8,496,496,-2,496,496,496,496,496,496,-1,496,496,-1,496,496,496,496,496,-1,496,-1,496,496,496,496,496,496,496,-1,496,-2,496,496,-5,496,-2,496,-2,496,-31,496,496,-3,496,496,496,496,496,496,496,-7,496,496,496,496,496,496],
sm386$1=[0,-4,0,-4,0,-21,497],
sm387$1=[0,-4,0,-4,0,-21,498],
sm388$1=[0,499,499,499,-1,0,-4,0,-5,499,499,-1,499,499,-2,499,499,499,499,499,499,-1,499,499,499,-1,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,-2,499,499,-5,499,499,499,499,-2,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,-7,499,499,499,499,499,499],
sm389$1=[0,-4,0,-4,0,-8,500],
sm390$1=[0,-1,2,3,-1,0,-4,0,-8,4,501,-2,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm391$1=[0,-1,2,3,-1,0,-4,0,-8,4,502,-2,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm392$1=[0,-4,0,-4,0,-9,503],
sm393$1=[0,504,504,504,-1,0,-4,0,-5,504,504,-1,504,504,-2,504,504,504,504,504,504,-1,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,-2,504,504,-5,504,504,504,504,-2,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,-7,504,504,504,504,504,504],
sm394$1=[0,-4,0,-4,0,-9,505],
sm395$1=[0,-4,0,-4,0,-21,506],
sm396$1=[0,-4,0,-4,0,-5,507,-15,507],
sm397$1=[0,-4,0,-4,0,-5,508,-43,508],
sm398$1=[0,-4,0,-4,0,-8,509],
sm399$1=[0,-4,0,-4,0,-8,510],
sm400$1=[0,-4,0,-4,0,-21,511],
sm401$1=[0,-4,0,-4,0,-21,512],
sm402$1=[0,-4,0,-4,0,-5,513,513,-1,513,513,-2,513,-4,513,-2,513,513,-5,513,-1,513,-7,513,-5,513,-5,513,513,-4,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,-5,513,513],
sm403$1=[0,-4,0,-4,0,-5,514,-3,514,-11,514,-5,514,-1,514,-19,514,-5,514],
sm404$1=[0,-4,0,-4,0,-5,515,-3,515,-11,515,-5,515,-1,515,-19,515,-5,515],
sm405$1=[0,-4,0,-4,0,-49,516],
sm406$1=[0,-4,0,-4,0,-12,517],
sm407$1=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,518,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm408$1=[0,-4,0,-4,0,-21,519],
sm409$1=[0,-4,0,-4,0,-21,520],
sm410$1=[0,521,521,521,-1,0,-4,0,-8,521,521,-2,521,521,521,521,521,521,-1,521,521,-1,521,521,521,521,521,-1,521,-1,521,521,521,521,521,521,521,-1,521,-2,521,521,-5,521,-2,521,-2,521,-31,521,521,-3,521,521,521,521,521,521,521,-7,521,521,521,521,521,521],
sm411$1=[0,-4,0,-4,0,-21,522],
sm412$1=[0,523,523,523,-1,0,-4,0,-8,523,523,-2,523,523,523,523,523,523,-1,523,523,-1,523,523,523,523,523,-1,523,-1,523,523,523,523,523,523,523,-1,523,-2,523,523,-5,523,-2,523,-2,523,-31,523,523,-3,523,523,523,523,523,523,523,-7,523,523,523,523,523,523],
sm413$1=[0,-4,0,-4,0,-21,524],
sm414$1=[0,525,525,525,-1,0,-4,0,-8,525,525,-2,525,525,525,525,525,525,-1,525,525,-1,525,525,525,525,525,-1,525,-1,525,525,525,525,525,525,525,-1,525,-2,525,525,-5,525,-2,525,-2,525,-31,525,525,-3,525,525,525,525,525,525,525,-7,525,525,525,525,525,525],
sm415$1=[0,-4,0,-4,0,-9,526,-3,494,-22,495],
sm416$1=[0,-4,0,-4,0,-9,527,-26,495],
sm417$1=[0,-4,0,-4,0,-9,528,-3,528,-22,528],
sm418$1=[0,-4,0,-4,0,-9,529,-26,529,530],
sm419$1=[0,-1,2,3,-1,0,-4,0,-8,4,531,-2,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm420$1=[0,-4,0,-4,0,-9,532],
sm421$1=[0,533,533,533,-1,0,-4,0,-5,533,533,-1,533,533,-2,533,533,533,533,533,533,-1,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,-2,533,533,-5,533,533,533,533,-2,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,-7,533,533,533,533,533,533],
sm422$1=[0,-4,0,-4,0,-9,534],
sm423$1=[0,535,535,535,-1,0,-4,0,-5,535,535,-1,535,535,-2,535,535,535,535,535,535,-1,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,-2,535,535,-5,535,535,535,535,-2,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,-7,535,535,535,535,535,535],
sm424$1=[0,536,536,536,-1,0,-4,0,-5,536,536,-1,536,536,-2,536,536,536,536,536,536,-1,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,-2,536,536,-5,536,536,536,536,-2,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,-7,536,536,536,536,536,536],
sm425$1=[0,-4,0,-4,0,-8,537],
sm426$1=[0,-4,0,-4,0,-5,538,-3,538,-11,538,-5,538,-1,538,-19,538,-5,538],
sm427$1=[0,539,539,539,-1,0,-4,0,-8,539,539,-2,539,539,539,539,539,539,-1,539,539,-1,539,539,539,539,539,-1,539,-1,539,539,539,539,539,539,539,-1,539,-2,539,539,-5,539,-2,539,-2,539,-31,539,539,-3,539,539,539,539,539,539,539,-7,539,539,539,539,539,539],
sm428$1=[0,540,540,540,-1,0,-4,0,-8,540,540,-2,540,540,540,540,540,540,-1,540,540,-1,540,540,540,540,540,-1,540,-1,540,540,540,540,540,540,540,-1,540,-2,540,540,-5,540,-2,540,-2,540,-31,540,540,-3,540,540,540,540,540,540,540,-7,540,540,540,540,540,540],
sm429$1=[0,-4,0,-4,0,-21,541],
sm430$1=[0,542,542,542,-1,0,-4,0,-8,542,542,-2,542,542,542,542,542,542,-1,542,542,-1,542,542,542,542,542,-1,542,-1,542,542,542,542,542,542,542,-1,542,-2,542,542,-5,542,-2,542,-2,542,-31,542,542,-3,542,542,542,542,542,542,542,-7,542,542,542,542,542,542],
sm431$1=[0,543,543,543,-1,0,-4,0,-8,543,543,-2,543,543,543,543,543,543,-1,543,543,-1,543,543,543,543,543,-1,543,-1,543,543,543,543,543,543,543,-1,543,-2,543,543,-5,543,-2,543,-2,543,-31,543,543,-3,543,543,543,543,543,543,543,-7,543,543,543,543,543,543],
sm432$1=[0,544,544,544,-1,0,-4,0,-8,544,544,-2,544,544,544,544,544,544,-1,544,544,-1,544,544,544,544,544,-1,544,-1,544,544,544,544,544,544,544,-1,544,-2,544,544,-5,544,-2,544,-2,544,-31,544,544,-3,544,544,544,544,544,544,544,-7,544,544,544,544,544,544],
sm433$1=[0,545,545,545,-1,0,-4,0,-8,545,545,-2,545,545,545,545,545,545,-1,545,545,-1,545,545,545,545,545,-1,545,-1,545,545,545,545,545,545,545,-1,545,-2,545,545,-5,545,-2,545,-2,545,-31,545,545,-3,545,545,545,545,545,545,545,-7,545,545,545,545,545,545],
sm434$1=[0,546,546,546,-1,0,-4,0,-8,546,546,-2,546,546,546,546,546,546,-1,546,546,-1,546,546,546,546,546,-1,546,-1,546,546,546,546,546,546,546,-1,546,-2,546,546,-5,546,-2,546,-2,546,-31,546,546,-3,546,546,546,546,546,546,546,-7,546,546,546,546,546,546],
sm435$1=[0,547,547,547,-1,0,-4,0,-8,547,547,-2,547,547,547,547,547,547,-1,547,547,-1,547,547,547,547,547,-1,547,-1,547,547,547,547,547,547,547,-1,547,-2,547,547,-5,547,-2,547,-2,547,-31,547,547,-3,547,547,547,547,547,547,547,-7,547,547,547,547,547,547],
sm436$1=[0,548,548,548,-1,0,-4,0,-8,548,548,-2,548,548,548,548,548,548,-1,548,548,-1,548,548,548,548,548,-1,548,-1,548,548,548,548,548,548,548,-1,548,-2,548,548,-5,548,-2,548,-2,548,-31,548,548,-3,548,548,548,548,548,548,548,-7,548,548,548,548,548,548],
sm437$1=[0,-4,0,-4,0,-9,549,-26,495],
sm438$1=[0,550,550,550,-1,0,-4,0,-8,550,550,-2,550,550,550,550,550,550,-1,550,550,-1,550,550,550,550,550,-1,550,-1,550,550,550,550,550,550,550,-1,550,-2,550,550,-5,550,-2,550,-2,550,-31,550,550,-3,550,550,550,550,550,550,550,-7,550,550,550,550,550,550],
sm439$1=[0,-4,0,-4,0,-9,551,-3,551,-22,551],
sm440$1=[0,-4,0,-4,0,-9,552,-26,495],
sm441$1=[0,-4,0,-4,0,-37,553],
sm442$1=[0,554,554,554,-1,0,-4,0,-8,554,554,-2,554,554,554,554,554,554,-1,554,554,-1,554,554,554,554,554,-1,554,-1,554,554,554,554,554,554,554,-1,554,-1,554,554,554,-5,554,-2,554,-2,554,-31,554,554,-3,554,554,554,554,554,554,554,-7,554,554,554,554,554,554],
sm443$1=[0,-4,0,-4,0,-9,555],
sm444$1=[0,556,556,556,-1,0,-4,0,-5,556,556,-1,556,556,-2,556,556,556,556,556,556,-1,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,-2,556,556,-5,556,556,556,556,-2,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,-7,556,556,556,556,556,556],
sm445$1=[0,557,557,557,-1,0,-4,0,-5,557,557,-1,557,557,-2,557,557,557,557,557,557,-1,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,-2,557,557,-5,557,557,557,557,-2,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,-7,557,557,557,557,557,557],
sm446$1=[0,558,558,558,-1,0,-4,0,-5,558,558,-1,558,558,-2,558,558,558,558,558,558,-1,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-2,558,558,-5,558,558,558,558,-2,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-7,558,558,558,558,558,558],
sm447$1=[0,-4,0,-4,0,-9,559],
sm448$1=[0,-4,0,-4,0,-9,560],
sm449$1=[0,561,561,561,-1,0,-4,0,-8,561,561,-2,561,561,561,561,561,561,-1,561,561,-1,561,561,561,561,561,-1,561,-1,561,561,561,561,561,561,561,-1,561,-2,561,561,-5,561,-2,561,-2,561,-31,561,561,-3,561,561,561,561,561,561,561,-7,561,561,561,561,561,561],
sm450$1=[0,562,562,562,-1,0,-4,0,-8,562,562,-2,562,562,562,562,562,562,-1,562,562,-1,562,562,562,562,562,-1,562,-1,562,562,562,562,562,562,562,-1,562,-2,562,562,-5,562,-2,562,-2,562,-31,562,562,-3,562,562,562,562,562,562,562,-7,562,562,562,562,562,562],
sm451$1=[0,563,563,563,-1,0,-4,0,-8,563,563,-2,563,563,563,563,563,563,-1,563,563,-1,563,563,563,563,563,-1,563,-1,563,563,563,563,563,563,563,-1,563,-2,563,563,-5,563,-2,563,-2,563,-31,563,563,-3,563,563,563,563,563,563,563,-7,563,563,563,563,563,563],
sm452$1=[0,564,564,564,-1,0,-4,0,-8,564,564,-2,564,564,564,564,564,564,-1,564,564,-1,564,564,564,564,564,-1,564,-1,564,564,564,564,564,564,564,-1,564,-2,564,564,-5,564,-2,564,-2,564,-31,564,564,-3,564,564,564,564,564,564,564,-7,564,564,564,564,564,564],
sm453$1=[0,-4,0,-4,0,-9,565],
sm454$1=[0,566,566,566,-1,0,-4,0,-8,566,566,-2,566,566,566,566,566,566,-1,566,566,-1,566,566,566,566,566,-1,566,-1,566,566,566,566,566,566,566,-1,566,-2,566,566,-5,566,-2,566,-2,566,-31,566,566,-3,566,566,566,566,566,566,566,-7,566,566,566,566,566,566],
sm455$1=[0,-1,2,3,-1,0,-4,0,-8,4,567,-2,5,567,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,567,-1,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm456$1=[0,-4,0,-4,0,-9,568,-26,568],
sm457$1=[0,569,569,569,-1,0,-4,0,-5,569,569,-1,569,569,-2,569,569,569,569,569,569,-1,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,-2,569,569,-5,569,569,569,569,-2,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,-7,569,569,569,569,569,569],
sm458$1=[0,-1,570,570,-1,0,-4,0,-5,570,-3,570,-2,570,-4,570,-27,570,570,570,-57,570,570,-3,570],
sm459$1=[0,-1,571,571,-1,0,-4,0,-5,571,-3,571,-2,571,-4,571,-27,571,571,571,-57,571,571,-3,571],
sm460$1=[0,-4,0,-4,0,-9,572],
sm461$1=[0,573,573,573,-1,0,-4,0,-8,573,573,-2,573,573,573,573,573,573,-1,573,573,-1,573,573,573,573,573,-1,573,-1,573,573,573,573,573,573,573,-1,573,-2,573,573,-5,573,-2,573,-2,573,-31,573,573,-3,573,573,573,573,573,573,573,-7,573,573,573,573,573,573],
sm462$1=[0,574,574,574,-1,0,-4,0,-8,574,574,-2,574,574,574,574,574,574,-1,574,574,-1,574,574,574,574,574,-1,574,-1,574,574,574,574,574,574,574,-1,574,-2,574,574,-5,574,-2,574,-2,574,-31,574,574,-3,574,574,574,574,574,574,574,-7,574,574,574,574,574,574],
sm463$1=[0,-4,0,-4,0,-9,575,-3,575,-22,575],
sm464$1=[0,-1,576,576,-1,0,-4,0,-5,576,-3,576,-2,576,-4,576,-27,576,576,576,-57,576,576,-3,576],

    // Symbol Lookup map
    lu$1 = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],["import",14],[",",15],["*",16],["as",17],["{",18],["}",19],["from",20],["export",21],[";",22],["default",23],["function",24],["class",25],["let",26],["[",27],["async",28],["if",29],["(",30],[")",31],["else",32],["var",33],["do",34],["while",35],["for",36],["in",37],["await",38],["of",39],["continue",40],["break",41],["return",42],["throw",43],["with",44],["switch",45],["case",46],[":",47],["try",48],["catch",49],["finally",50],["debugger",51],["const",52],["=>",53],["extends",54],["static",55],["get",56],["set",57],["new",58],["]",59],[".",60],["super",61],["target",62],["...",63],["this",64],["=",65],["*=",66],["/=",67],["%=",68],["+=",69],["-=",70],["<<=",71],[">>=",72],[">>>=",73],["&=",74],["^=",75],["|=",76],["**=",77],["?",78],["||",79],["&&",80],["|",81],["^",82],["&",83],["==",84],["!=",85],["===",86],["!==",87],["<",88],[">",89],["<=",90],[">=",91],["instanceof",92],["<<",93],[">>",94],[">>>",95],["+",96],["-",97],["/",98],["%",99],["**",100],["delete",101],["void",102],["typeof",103],["~",104],["!",105],["++",106],["--",107],[null,6],["\"",115],["'",116],["null",117],["true",118],["false",119],["$",120]]),

    //Reverse Symbol Lookup map
    rlu$1 = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,"import"],[15,","],[16,"*"],[17,"as"],[18,"{"],[19,"}"],[20,"from"],[21,"export"],[22,";"],[23,"default"],[24,"function"],[25,"class"],[26,"let"],[27,"["],[28,"async"],[29,"if"],[30,"("],[31,")"],[32,"else"],[33,"var"],[34,"do"],[35,"while"],[36,"for"],[37,"in"],[38,"await"],[39,"of"],[40,"continue"],[41,"break"],[42,"return"],[43,"throw"],[44,"with"],[45,"switch"],[46,"case"],[47,":"],[48,"try"],[49,"catch"],[50,"finally"],[51,"debugger"],[52,"const"],[53,"=>"],[54,"extends"],[55,"static"],[56,"get"],[57,"set"],[58,"new"],[59,"]"],[60,"."],[61,"super"],[62,"target"],[63,"..."],[64,"this"],[65,"="],[66,"*="],[67,"/="],[68,"%="],[69,"+="],[70,"-="],[71,"<<="],[72,">>="],[73,">>>="],[74,"&="],[75,"^="],[76,"|="],[77,"**="],[78,"?"],[79,"||"],[80,"&&"],[81,"|"],[82,"^"],[83,"&"],[84,"=="],[85,"!="],[86,"==="],[87,"!=="],[88,"<"],[89,">"],[90,"<="],[91,">="],[92,"instanceof"],[93,"<<"],[94,">>"],[95,">>>"],[96,"+"],[97,"-"],[98,"/"],[99,"%"],[100,"**"],[101,"delete"],[102,"void"],[103,"typeof"],[104,"~"],[105,"!"],[106,"++"],[107,"--"],[6,null],[115,"\""],[116,"'"],[117,"null"],[118,"true"],[119,"false"],[120,"$"]]),

    // States 
    state$1 = [sm0$1,
sm1$1,
sm2$1,
sm3$1,
sm4$1,
sm5$1,
sm6$1,
sm7$1,
sm8$1,
sm8$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm9$1,
sm10$1,
sm11$1,
sm12$1,
sm13$1,
sm14$1,
sm15$1,
sm16$1,
sm16$1,
sm17$1,
sm18$1,
sm19$1,
sm20$1,
sm21$1,
sm22$1,
sm23$1,
sm24$1,
sm25$1,
sm26$1,
sm27$1,
sm28$1,
sm29$1,
sm30$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm32$1,
sm31$1,
sm31$1,
sm33$1,
sm34$1,
sm35$1,
sm36$1,
sm37$1,
sm37$1,
sm37$1,
sm38$1,
sm39$1,
sm39$1,
sm39$1,
sm39$1,
sm40$1,
sm41$1,
sm42$1,
sm43$1,
sm44$1,
sm45$1,
sm46$1,
sm46$1,
sm46$1,
sm46$1,
sm47$1,
sm47$1,
sm48$1,
sm49$1,
sm50$1,
sm51$1,
sm52$1,
sm53$1,
sm54$1,
sm55$1,
sm55$1,
sm31$1,
sm56$1,
sm57$1,
sm58$1,
sm59$1,
sm60$1,
sm61$1,
sm62$1,
sm62$1,
sm63$1,
sm64$1,
sm65$1,
sm66$1,
sm67$1,
sm68$1,
sm69$1,
sm70$1,
sm31$1,
sm71$1,
sm72$1,
sm73$1,
sm73$1,
sm73$1,
sm74$1,
sm75$1,
sm76$1,
sm59$1,
sm77$1,
sm78$1,
sm79$1,
sm80$1,
sm81$1,
sm31$1,
sm31$1,
sm31$1,
sm82$1,
sm83$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm84$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm31$1,
sm85$1,
sm32$1,
sm86$1,
sm87$1,
sm88$1,
sm39$1,
sm89$1,
sm90$1,
sm91$1,
sm92$1,
sm93$1,
sm94$1,
sm95$1,
sm96$1,
sm97$1,
sm98$1,
sm99$1,
sm100$1,
sm101$1,
sm102$1,
sm103$1,
sm31$1,
sm104$1,
sm31$1,
sm102$1,
sm105$1,
sm106$1,
sm35$1,
sm107$1,
sm108$1,
sm109$1,
sm110$1,
sm111$1,
sm112$1,
sm113$1,
sm113$1,
sm113$1,
sm113$1,
sm113$1,
sm113$1,
sm113$1,
sm114$1,
sm111$1,
sm115$1,
sm116$1,
sm116$1,
sm116$1,
sm116$1,
sm116$1,
sm116$1,
sm116$1,
sm117$1,
sm118$1,
sm59$1,
sm119$1,
sm102$1,
sm31$1,
sm120$1,
sm121$1,
sm122$1,
sm123$1,
sm124$1,
sm125$1,
sm126$1,
sm127$1,
sm128$1,
sm129$1,
sm130$1,
sm130$1,
sm131$1,
sm132$1,
sm31$1,
sm133$1,
sm31$1,
sm134$1,
sm135$1,
sm31$1,
sm136$1,
sm137$1,
sm138$1,
sm139$1,
sm140$1,
sm141$1,
sm142$1,
sm31$1,
sm143$1,
sm144$1,
sm145$1,
sm146$1,
sm147$1,
sm148$1,
sm149$1,
sm150$1,
sm151$1,
sm152$1,
sm153$1,
sm154$1,
sm128$1,
sm128$1,
sm155$1,
sm156$1,
sm157$1,
sm157$1,
sm158$1,
sm159$1,
sm160$1,
sm161$1,
sm162$1,
sm163$1,
sm164$1,
sm164$1,
sm164$1,
sm164$1,
sm165$1,
sm166$1,
sm167$1,
sm168$1,
sm169$1,
sm170$1,
sm171$1,
sm172$1,
sm173$1,
sm174$1,
sm175$1,
sm176$1,
sm177$1,
sm178$1,
sm179$1,
sm180$1,
sm181$1,
sm182$1,
sm183$1,
sm183$1,
sm31$1,
sm184$1,
sm185$1,
sm186$1,
sm187$1,
sm188$1,
sm189$1,
sm190$1,
sm189$1,
sm31$1,
sm191$1,
sm192$1,
sm193$1,
sm193$1,
sm194$1,
sm194$1,
sm195$1,
sm195$1,
sm31$1,
sm196$1,
sm197$1,
sm198$1,
sm199$1,
sm200$1,
sm201$1,
sm202$1,
sm203$1,
sm31$1,
sm204$1,
sm205$1,
sm206$1,
sm207$1,
sm208$1,
sm209$1,
sm208$1,
sm210$1,
sm211$1,
sm212$1,
sm213$1,
sm214$1,
sm215$1,
sm216$1,
sm217$1,
sm218$1,
sm11$1,
sm219$1,
sm220$1,
sm220$1,
sm221$1,
sm59$1,
sm222$1,
sm31$1,
sm222$1,
sm223$1,
sm224$1,
sm225$1,
sm102$1,
sm226$1,
sm227$1,
sm228$1,
sm229$1,
sm230$1,
sm231$1,
sm232$1,
sm233$1,
sm59$1,
sm234$1,
sm235$1,
sm236$1,
sm237$1,
sm238$1,
sm239$1,
sm240$1,
sm241$1,
sm242$1,
sm243$1,
sm244$1,
sm245$1,
sm246$1,
sm59$1,
sm247$1,
sm59$1,
sm248$1,
sm249$1,
sm250$1,
sm251$1,
sm252$1,
sm253$1,
sm254$1,
sm255$1,
sm256$1,
sm257$1,
sm258$1,
sm71$1,
sm259$1,
sm260$1,
sm261$1,
sm262$1,
sm263$1,
sm264$1,
sm265$1,
sm266$1,
sm265$1,
sm267$1,
sm268$1,
sm269$1,
sm270$1,
sm271$1,
sm272$1,
sm273$1,
sm274$1,
sm275$1,
sm276$1,
sm277$1,
sm278$1,
sm59$1,
sm279$1,
sm279$1,
sm31$1,
sm280$1,
sm281$1,
sm282$1,
sm283$1,
sm284$1,
sm284$1,
sm285$1,
sm286$1,
sm287$1,
sm288$1,
sm289$1,
sm290$1,
sm291$1,
sm31$1,
sm292$1,
sm293$1,
sm294$1,
sm295$1,
sm296$1,
sm297$1,
sm298$1,
sm299$1,
sm300$1,
sm301$1,
sm302$1,
sm303$1,
sm59$1,
sm304$1,
sm304$1,
sm305$1,
sm306$1,
sm307$1,
sm308$1,
sm309$1,
sm310$1,
sm310$1,
sm311$1,
sm312$1,
sm59$1,
sm313$1,
sm314$1,
sm315$1,
sm316$1,
sm315$1,
sm315$1,
sm317$1,
sm318$1,
sm318$1,
sm319$1,
sm63$1,
sm31$1,
sm63$1,
sm320$1,
sm321$1,
sm322$1,
sm31$1,
sm323$1,
sm324$1,
sm31$1,
sm325$1,
sm326$1,
sm327$1,
sm328$1,
sm329$1,
sm328$1,
sm328$1,
sm330$1,
sm331$1,
sm59$1,
sm331$1,
sm59$1,
sm332$1,
sm63$1,
sm333$1,
sm59$1,
sm334$1,
sm335$1,
sm336$1,
sm337$1,
sm338$1,
sm339$1,
sm340$1,
sm341$1,
sm342$1,
sm343$1,
sm344$1,
sm345$1,
sm346$1,
sm347$1,
sm348$1,
sm348$1,
sm349$1,
sm350$1,
sm351$1,
sm352$1,
sm353$1,
sm354$1,
sm355$1,
sm59$1,
sm356$1,
sm357$1,
sm358$1,
sm359$1,
sm360$1,
sm361$1,
sm362$1,
sm363$1,
sm364$1,
sm365$1,
sm366$1,
sm366$1,
sm367$1,
sm368$1,
sm369$1,
sm370$1,
sm371$1,
sm372$1,
sm373$1,
sm374$1,
sm375$1,
sm376$1,
sm63$1,
sm377$1,
sm378$1,
sm379$1,
sm63$1,
sm380$1,
sm31$1,
sm381$1,
sm382$1,
sm382$1,
sm383$1,
sm384$1,
sm385$1,
sm386$1,
sm387$1,
sm387$1,
sm388$1,
sm389$1,
sm390$1,
sm391$1,
sm392$1,
sm393$1,
sm394$1,
sm395$1,
sm396$1,
sm397$1,
sm398$1,
sm399$1,
sm400$1,
sm401$1,
sm402$1,
sm402$1,
sm403$1,
sm404$1,
sm405$1,
sm404$1,
sm63$1,
sm406$1,
sm407$1,
sm408$1,
sm63$1,
sm409$1,
sm63$1,
sm63$1,
sm410$1,
sm63$1,
sm411$1,
sm63$1,
sm63$1,
sm412$1,
sm63$1,
sm413$1,
sm414$1,
sm415$1,
sm416$1,
sm417$1,
sm31$1,
sm418$1,
sm71$1,
sm419$1,
sm420$1,
sm421$1,
sm422$1,
sm423$1,
sm424$1,
sm11$1,
sm11$1,
sm425$1,
sm426$1,
sm427$1,
sm428$1,
sm429$1,
sm63$1,
sm63$1,
sm430$1,
sm63$1,
sm431$1,
sm432$1,
sm433$1,
sm63$1,
sm434$1,
sm435$1,
sm436$1,
sm63$1,
sm437$1,
sm438$1,
sm439$1,
sm440$1,
sm438$1,
sm441$1,
sm11$1,
sm442$1,
sm443$1,
sm444$1,
sm445$1,
sm446$1,
sm447$1,
sm448$1,
sm11$1,
sm63$1,
sm449$1,
sm450$1,
sm451$1,
sm451$1,
sm452$1,
sm453$1,
sm454$1,
sm454$1,
sm455$1,
sm456$1,
sm457$1,
sm458$1,
sm459$1,
sm460$1,
sm461$1,
sm462$1,
sm463$1,
sm464$1],

/************ Functions *************/

    max$1 = Math.max, min$1 = Math.min,

    //Error Functions
    e$3 = (...d)=>fn$1.defaultError(...d), 
    eh$1 = [e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3],

    //Empty Function
    nf$1 = ()=>-1, 

    //Environment Functions
    
redv$1 = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max$1(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
rednv$1 = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max$1(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
redn$1 = (ret, plen, t, e, o, l, s) => {        if(plen > 0){            let ln = max$1(o.length - plen, 0);            o[ln] = o[o.length -1];            o.length = ln + 1;        }        return ret;    },
shftf$1 = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R0_javascript=function (sym,env,lex,state,output,len) {return sym[0]},
R0_named_imports1901_group_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
R1_named_imports1901_group_list=function (sym,env,lex,state,output,len) {return [sym[0]]},
R0_statement_list4101_group_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
C0_empty_statement=function (sym,env,lex,state,output,len) {this.type = "empty";},
R0_iteration_statement7412_group=function (sym,env,lex,state,output,len) {return sym[1]},
R1_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[8])},
I2_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
I3_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
R4_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[7])},
R5_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_in_statement(sym[2],sym[4],sym[6])},
R6_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(sym[1],sym[3],sym[5],sym[7])},
R7_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[7])},
R8_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[7])},
R9_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,sym[4],sym[6])},
R10_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],null,sym[6])},
R11_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(null,sym[2],sym[4],sym[6])},
R12_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[6])},
R13_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[6])},
R14_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[6])},
R15_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,null,sym[5])},
R16_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[5])},
R0_continue_statement=function (sym,env,lex,state,output,len) {return new env.functions.continue_statement(sym[1])},
R0_break_statement=function (sym,env,lex,state,output,len) {return new env.functions.break_statement(sym[1])},
R0_case_block=function (sym,env,lex,state,output,len) {return []},
R1_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
R3_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
R0_case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
R0_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1],sym[3])},
R1_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1])},
R0_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement(sym[2])},
R1_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement()},
R0_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2])},
R1_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],null,sym[2])},
R3_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2],sym[3])},
R0_variable_declaration_list=function (sym,env,lex,state,output,len) {return ($sym1.push(sym[2]),sym[0])},
R0_let_or_const=function (sym,env,lex,state,output,len) {return "let"},
R1_let_or_const=function (sym,env,lex,state,output,len) {return "const"},
R0_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(sym[1],sym[3],sym[6])},
R1_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(null,sym[2],sym[5])},
R3_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(sym[1],null,sym[5])},
R4_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(sym[1],sym[3],null)},
R5_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(null,null,sym[4])},
R6_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(null,sym[2],null)},
R7_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(sym[1],null,null)},
R8_function_declaration=function (sym,env,lex,state,output,len) {return new fn$1.function_declaration(null,null,null)},
R0_arrow_function=function (sym,env,lex,state,output,len) {return new fn$1.arrow_function_declaration(null,sym[0],sym[2])},
R0_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail(sym)},
R1_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([null,...sym[0]])},
R3_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([sym[0],null,null])},
R4_class_tail=function (sym,env,lex,state,output,len) {return null},
R0_class_element_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1])},
R0_class_element=function (sym,env,lex,state,output,len) {return (sym[1].static = true,sym[1])},
R0_new_expression=function (sym,env,lex,state,output,len) {return new fn$1.new_expression(sym[1],null)},
R1_member_expression=function (sym,env,lex,state,output,len) {return new fn$1.new_expression(sym[1],sym[2])},
R0_arguments=function (sym,env,lex,state,output,len) {return new fn$1.argument_list(sym[1])},
R1_arguments=function (sym,env,lex,state,output,len) {return new fn$1.argument_list(null)},
R1_element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
R1_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new env.functions.spread_expr(env,sym.slice(1,3))},
R2_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env,sym.slice(3,5))),sym[1]) : [sym[0],new env.functions.spread_expr(env,sym.slice(3,5))]},
R0_string_literal35307_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R1_string_literal35307_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},

    //Sparse Map Lookup
    lsm$1 = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct$1 = [(...v)=>((redn$1(22531,0,...v))),
()=>(334),
()=>(290),
()=>(102),
()=>(378),
()=>(458),
()=>(450),
()=>(466),
()=>(382),
()=>(338),
()=>(374),
()=>(394),
()=>(398),
()=>(402),
()=>(358),
()=>(410),
()=>(414),
()=>(418),
()=>(426),
()=>(422),
()=>(406),
()=>(430),
()=>(434),
()=>(470),
()=>(238),
()=>(342),
()=>(254),
()=>(198),
()=>(202),
()=>(186),
()=>(190),
()=>(194),
()=>(206),
()=>(210),
()=>(218),
()=>(222),
()=>(326),
()=>(330),
()=>(322),
()=>(314),
()=>(318),
()=>(294),
(...v)=>(redv$1(5,R0_javascript,1,0,...v)),
(...v)=>(redv$1(1031,R0_javascript,1,0,...v)),
(...v)=>(redv$1(22535,R0_javascript,1,0,...v)),
(...v)=>(redn$1(23559,1,...v)),
(...v)=>(rednv$1(26631,fn$1.statements,1,0,...v)),
(...v)=>(redv$1(25607,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(24583,1,...v)),
(...v)=>(redn$1(27655,1,...v)),
(...v)=>(redn$1(28679,1,...v)),
(...v)=>(redn$1(32775,1,...v)),
()=>(482),
()=>(486),
(...v)=>(rednv$1(97287,fn$1.expression_list,1,0,...v)),
(...v)=>(redv$1(96263,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(95239,1,...v)),
(...v)=>(redn$1(123911,1,...v)),
(...v)=>(redn$1(139271,1,...v)),
()=>(490),
()=>(506),
()=>(510),
()=>(514),
()=>(518),
()=>(522),
()=>(526),
()=>(530),
()=>(534),
()=>(538),
()=>(542),
()=>(546),
()=>(550),
()=>(498),
()=>(502),
(...v)=>(redn$1(125959,1,...v)),
()=>(554),
()=>(558),
(...v)=>(redn$1(126983,1,...v)),
()=>(562),
(...v)=>(redn$1(128007,1,...v)),
()=>(566),
(...v)=>(redn$1(129031,1,...v)),
()=>(570),
(...v)=>(redn$1(130055,1,...v)),
()=>(574),
(...v)=>(redn$1(131079,1,...v)),
()=>(578),
()=>(582),
()=>(586),
()=>(590),
(...v)=>(redn$1(132103,1,...v)),
()=>(614),
()=>(594),
()=>(598),
()=>(602),
()=>(606),
()=>(610),
(...v)=>(redn$1(133127,1,...v)),
()=>(618),
()=>(622),
()=>(626),
(...v)=>(redn$1(134151,1,...v)),
()=>(630),
()=>(634),
(...v)=>(redn$1(135175,1,...v)),
()=>(638),
()=>(642),
()=>(646),
(...v)=>(redn$1(136199,1,...v)),
(...v)=>(redn$1(137223,1,...v)),
(...v)=>(redn$1(138247,1,...v)),
()=>(650),
()=>(686),
()=>(682),
(...v)=>(redn$1(98311,1,...v)),
()=>(738),
()=>(742),
()=>(730),
(...v)=>(redn$1(99335,1,...v)),
()=>(746),
()=>(750),
()=>(766),
()=>(770),
(...v)=>(redn$1(100359,1,...v)),
(...v)=>(rednv$1(110599,fn$1.this_literal,1,0,...v)),
(...v)=>(redn$1(110599,1,...v)),
(...v)=>(redn$1(79879,1,...v)),
(...v)=>(redn$1(163847,1,...v)),
(...v)=>(redn$1(162823,1,...v)),
(...v)=>(redn$1(164871,1,...v)),
(...v)=>(redn$1(165895,1,...v)),
(...v)=>(rednv$1(167943,fn$1.identifier,1,0,...v)),
(...v)=>(redn$1(166919,1,...v)),
(...v)=>(redv$1(166919,R0_javascript,1,0,...v)),
(...v)=>(redn$1(153607,1,...v)),
(...v)=>(rednv$1(161799,fn$1.bool_literal,1,0,...v)),
(...v)=>(rednv$1(160775,fn$1.null_literal,1,0,...v)),
()=>(802),
()=>(794),
()=>(790),
()=>(810),
()=>(814),
()=>(806),
()=>(798),
()=>(782),
()=>(842),
()=>(834),
()=>(830),
()=>(850),
()=>(854),
()=>(846),
()=>(838),
()=>(822),
(...v)=>(rednv$1(159751,fn$1.numeric_literal,1,0,...v)),
()=>(858),
()=>(866),
()=>(878),
()=>(874),
(...v)=>(redn$1(102407,1,...v)),
(...v)=>(redn$1(104455,1,...v)),
()=>(890),
()=>(898),
()=>(930),
()=>(934),
(...v)=>(rednv$1(34823,C0_empty_statement,1,0,...v)),
()=>(938),
(...v)=>(redn$1(31751,1,...v)),
()=>(946),
(...v)=>(shftf$1(950,I2_iteration_statement,...v)),
()=>(954),
()=>(958),
()=>(962),
()=>(974),
()=>(982),
()=>(990),
()=>(1002),
(...v)=>(redn$1(29703,1,...v)),
()=>(1018),
()=>(1022),
(...v)=>(redn$1(30727,1,...v)),
()=>(1030),
(...v)=>(redv$1(66567,R0_let_or_const,1,0,...v)),
(...v)=>(redv$1(66567,R1_let_or_const,1,0,...v)),
(...v)=>(redv$1(25611,R0_statement_list4101_group_list,2,0,...v)),
()=>(1050),
(...v)=>(rednv$1(35851,fn$1.expression_statement,2,0,...v)),
(...v)=>(rednv$1(139275,fn$1.post_increment_expression,2,0,...v)),
(...v)=>(rednv$1(139275,fn$1.post_decrement_expression,2,0,...v)),
(...v)=>(redn$1(124935,1,...v)),
(...v)=>(rednv$1(138251,fn$1.delete_expression,2,0,...v)),
(...v)=>(rednv$1(110599,fn$1.array_literal,1,0,...v)),
(...v)=>(rednv$1(110599,fn$1.object_literal,1,0,...v)),
()=>(1190),
()=>(1174),
()=>(1186),
()=>(1198),
()=>(1202),
()=>(1258),
()=>(1234),
()=>(1238),
()=>(1222),
(...v)=>(redn$1(69639,1,...v)),
(...v)=>(redn$1(86023,1,...v)),
(...v)=>(rednv$1(138251,fn$1.void_expression,2,0,...v)),
(...v)=>(rednv$1(138251,fn$1.typeof_expression,2,0,...v)),
(...v)=>(rednv$1(138251,fn$1.plus_expression,2,0,...v)),
(...v)=>(rednv$1(138251,fn$1.negate_expression,2,0,...v)),
(...v)=>(rednv$1(138251,fn$1.unary_or_expression,2,0,...v)),
(...v)=>(rednv$1(138251,fn$1.unary_not_expression,2,0,...v)),
(...v)=>(rednv$1(139275,fn$1.pre_increment_expression,2,0,...v)),
(...v)=>(rednv$1(139275,fn$1.pre_decrement_expression,2,0,...v)),
(...v)=>(rednv$1(104459,fn$1.call_expression,2,0,...v)),
()=>(1274),
()=>(1278),
()=>(1294),
(...v)=>(rednv$1(85003,fn$1.call_expression,2,0,...v)),
(...v)=>(redv$1(99339,R0_new_expression,2,0,...v)),
()=>(1310),
(...v)=>(redv$1(166923,R0_string_literal35307_group_list,2,0,...v)),
()=>(1314),
(...v)=>(rednv$1(158731,fn$1.string_literal,2,0,...v)),
(...v)=>(redv$1(155655,R1_string_literal35307_group_list,1,0,...v)),
(...v)=>(redn$1(154631,1,...v)),
()=>(1322),
(...v)=>(redv$1(157703,R1_string_literal35307_group_list,1,0,...v)),
(...v)=>(redn$1(156679,1,...v)),
(...v)=>(redv$1(141323,R4_class_tail,2,0,...v)),
()=>(1334),
()=>(1330),
(...v)=>(redn$1(105483,2,...v)),
(...v)=>(rednv$1(140299,fn$1.await_expression,2,0,...v)),
()=>(1362),
(...v)=>(rednv$1(54283,fn$1.label_statement,2,0,...v)),
()=>(1382),
()=>(1378),
(...v)=>(redv$1(63495,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(rednv$1(64519,fn$1.binding,1,0,...v)),
()=>(1390),
(...v)=>(redn$1(142343,1,...v)),
()=>(1398),
()=>(1410),
()=>(1430),
()=>(1446),
()=>(1470),
()=>(1490),
()=>(1502),
()=>(1518),
(...v)=>(rednv$1(44043,fn$1.continue_statement,2,0,...v)),
()=>(1526),
(...v)=>(rednv$1(45067,fn$1.break_statement,2,0,...v)),
()=>(1530),
(...v)=>(rednv$1(46091,fn$1.return_statement,2,0,...v)),
()=>(1534),
()=>(1542),
()=>(1554),
()=>(1558),
(...v)=>(rednv$1(61451,fn$1.debugger_statement,2,0,...v)),
(...v)=>(rednv$1(87051,fn$1.class_statement,2,0,...v)),
()=>(1566),
()=>(1574),
()=>(1594),
()=>(1590),
()=>(1610),
()=>(1618),
()=>(1646),
()=>(1642),
(...v)=>(redv$1(67591,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(rednv$1(33807,fn$1.block_statement,3,0,...v)),
(...v)=>(redv$1(96271,R0_named_imports1901_group_list,3,0,...v)),
(...v)=>(rednv$1(123919,fn$1.assignment_expression,3,0,...v)),
()=>(1658),
(...v)=>(rednv$1(126991,fn$1.or_expression,3,0,...v)),
(...v)=>(rednv$1(128015,fn$1.and_expression,3,0,...v)),
(...v)=>(rednv$1(129039,fn$1.bit_or_expression,3,0,...v)),
(...v)=>(rednv$1(130063,fn$1.bit_xor_expression,3,0,...v)),
(...v)=>(rednv$1(131087,fn$1.bit_and_expression,3,0,...v)),
(...v)=>(rednv$1(132111,fn$1.equality_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.equality_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.equality_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.equality_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.equality_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.instanceof_expression,3,0,...v)),
(...v)=>(rednv$1(133135,fn$1.in_expression,3,0,...v)),
(...v)=>(rednv$1(134159,fn$1.left_shift_expression,3,0,...v)),
(...v)=>(rednv$1(134159,fn$1.right_shift_expression,3,0,...v)),
(...v)=>(rednv$1(134159,fn$1.right_shift_fill_expression,3,0,...v)),
(...v)=>(rednv$1(135183,fn$1.add_expression,3,0,...v)),
(...v)=>(rednv$1(135183,fn$1.subtract_expression,3,0,...v)),
(...v)=>(rednv$1(136207,fn$1.multiply_expression,3,0,...v)),
(...v)=>(rednv$1(136207,fn$1.divide_expression,3,0,...v)),
(...v)=>(rednv$1(136207,fn$1.modulo_expression,3,0,...v)),
(...v)=>(rednv$1(137231,fn$1.exponent_expression,3,0,...v)),
()=>(1670),
()=>(1666),
()=>(1686),
()=>(1674),
(...v)=>(redv$1(119819,R4_class_tail,2,0,...v)),
(...v)=>(redv$1(120839,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(121863,1,...v)),
()=>(1694),
()=>(1698),
()=>(1702),
(...v)=>(redv$1(112651,R4_class_tail,2,0,...v)),
(...v)=>(redv$1(111623,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(113671,1,...v)),
()=>(1718),
()=>(1714),
(...v)=>(redn$1(115719,1,...v)),
(...v)=>(redn$1(114695,1,...v)),
(...v)=>(rednv$1(104463,fn$1.member_expression,3,0,...v)),
()=>(1734),
()=>(1738),
()=>(1742),
()=>(1746),
(...v)=>(redv$1(106507,R1_arguments,2,0,...v)),
()=>(1750),
(...v)=>(redn$1(109575,1,...v)),
(...v)=>(redv$1(108551,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(107527,1,...v)),
()=>(1758),
(...v)=>(rednv$1(100367,fn$1.member_expression,3,0,...v)),
(...v)=>(redv$1(100367,R1_member_expression,3,0,...v)),
(...v)=>(rednv$1(103439,fn$1.new_expression,3,0,...v)),
(...v)=>(rednv$1(158735,fn$1.string_literal,3,0,...v)),
(...v)=>(redv$1(155659,R0_string_literal35307_group_list,2,0,...v)),
(...v)=>(redv$1(157707,R0_string_literal35307_group_list,2,0,...v)),
(...v)=>(redv$1(141327,R0_iteration_statement7412_group,3,0,...v)),
()=>(1762),
()=>(1766),
()=>(1770),
()=>(1774),
(...v)=>(rednv$1(101391,fn$1.supper_expression,3,0,...v)),
()=>(1778),
(...v)=>(redv$1(78863,R0_arrow_function,3,0,...v)),
(...v)=>(redn$1(80903,1,...v)),
(...v)=>(redv$1(55307,R0_iteration_statement7412_group,2,0,...v)),
(...v)=>(redn$1(56327,1,...v)),
(...v)=>(rednv$1(62479,fn$1.variable_statement,3,0,...v)),
(...v)=>(rednv$1(64523,fn$1.binding,2,0,...v)),
(...v)=>(redn$1(143371,2,...v)),
()=>(1798),
()=>(1806),
()=>(1802),
(...v)=>(redn$1(146439,1,...v)),
(...v)=>(redn$1(149511,1,...v)),
()=>(1814),
(...v)=>(redn$1(151559,1,...v)),
(...v)=>(redn$1(144395,2,...v)),
()=>(1826),
()=>(1834),
()=>(1842),
()=>(1838),
(...v)=>(redn$1(147463,1,...v)),
(...v)=>(redn$1(148487,1,...v)),
(...v)=>(redn$1(150535,1,...v)),
()=>(1858),
()=>(1862),
()=>(1866),
()=>(1870),
()=>(1878),
()=>(1882),
()=>(1890),
()=>(1894),
(...v)=>(redn$1(37895,1,...v)),
(...v)=>(redn$1(38919,1,...v)),
(...v)=>(redn$1(39943,1,...v)),
()=>(1934),
()=>(1946),
(...v)=>(redv$1(44047,R0_continue_statement,3,0,...v)),
(...v)=>(redv$1(45071,R0_break_statement,3,0,...v)),
(...v)=>(rednv$1(46095,fn$1.return_statement,3,0,...v)),
()=>(1950),
(...v)=>(rednv$1(47119,fn$1.throw_statement,3,0,...v)),
(...v)=>(redv$1(57359,R0_try_statement,3,0,...v)),
(...v)=>(redv$1(57359,R1_try_statement,3,0,...v)),
()=>(1958),
(...v)=>(rednv$1(87055,fn$1.class_statement,3,0,...v)),
()=>(1970),
()=>(1974),
(...v)=>(redv$1(88075,R4_class_tail,2,0,...v)),
(...v)=>(redn$1(90119,1,...v)),
(...v)=>(redv$1(91143,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(92167,1,...v)),
(...v)=>(redv$1(89099,R0_iteration_statement7412_group,2,0,...v)),
()=>(1990),
()=>(1994),
()=>(1998),
(...v)=>(redn$1(72711,1,...v)),
()=>(2002),
(...v)=>(redn$1(74759,1,...v)),
(...v)=>(redv$1(73735,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redn$1(75783,1,...v)),
(...v)=>(rednv$1(65551,fn$1.lexical,3,0,...v)),
(...v)=>(rednv$1(68619,fn$1.binding,2,0,...v)),
()=>(2014),
(...v)=>(redv$1(119823,R0_iteration_statement7412_group,3,0,...v)),
(...v)=>(redv$1(119823,R4_class_tail,3,0,...v)),
(...v)=>(redv$1(120843,R1_element_list,2,0,...v)),
(...v)=>(redn$1(121867,2,...v)),
(...v)=>(rednv$1(122891,fn$1.spread_element,2,0,...v)),
()=>(2030),
(...v)=>(redv$1(112655,R0_iteration_statement7412_group,3,0,...v)),
(...v)=>(redv$1(112655,R4_class_tail,3,0,...v)),
(...v)=>(rednv$1(117771,fn$1.binding,2,0,...v)),
(...v)=>(rednv$1(113675,fn$1.spread_expr,2,0,...v)),
()=>(2050),
()=>(2054),
()=>(2058),
(...v)=>(rednv$1(104467,fn$1.call_expression,4,0,...v)),
()=>(2062),
(...v)=>(redv$1(106511,R0_arguments,3,0,...v)),
(...v)=>(redv$1(106511,R1_arguments,3,0,...v)),
(...v)=>(rednv$1(107531,fn$1.spread_element,2,0,...v)),
(...v)=>(rednv$1(100371,fn$1.member_expression,4,0,...v)),
(...v)=>(redv$1(141331,R0_iteration_statement7412_group,4,0,...v)),
(...v)=>(redv$1(141331,R1_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv$1(101395,fn$1.supper_expression,4,0,...v)),
()=>(2078),
(...v)=>(redn$1(77831,1,...v)),
(...v)=>(redv$1(63503,R0_variable_declaration_list,3,0,...v)),
(...v)=>(redv$1(118795,R0_iteration_statement7412_group,2,0,...v)),
(...v)=>(redn$1(143375,3,...v)),
()=>(2086),
(...v)=>(redn$1(145419,2,...v)),
(...v)=>(redn$1(151563,2,...v)),
()=>(2098),
(...v)=>(redn$1(144399,3,...v)),
(...v)=>(redn$1(148491,2,...v)),
()=>(2102),
(...v)=>(redn$1(152587,2,...v)),
(...v)=>(redn$1(150539,2,...v)),
()=>(2134),
()=>(2138),
()=>(2146),
()=>(2154),
(...v)=>(shftf$1(2162,I3_iteration_statement,...v)),
(...v)=>(redv$1(37899,R0_iteration_statement7412_group,2,0,...v)),
(...v)=>(redv$1(38923,R0_iteration_statement7412_group,2,0,...v)),
(...v)=>(redv$1(39947,R0_iteration_statement7412_group,2,0,...v)),
(...v)=>(redn$1(43015,1,...v)),
(...v)=>(redn$1(41995,2,...v)),
()=>(2170),
()=>(2190),
(...v)=>(redv$1(57363,R3_try_statement,4,0,...v)),
(...v)=>(rednv$1(59403,fn$1.finally_statement,2,0,...v)),
()=>(2210),
(...v)=>(redv$1(88079,R3_class_tail,3,0,...v)),
(...v)=>(redv$1(88079,R1_class_tail,3,0,...v)),
(...v)=>(redv$1(91147,R0_class_element_list,2,0,...v)),
(...v)=>(redv$1(92171,R0_class_element,2,0,...v)),
()=>(2214),
()=>(2218),
()=>(2222),
()=>(2230),
(...v)=>(redv$1(72715,R1_named_imports1901_group_list,2,0,...v)),
(...v)=>(redv$1(67599,R0_variable_declaration_list,3,0,...v)),
(...v)=>(rednv$1(125975,fn$1.condition_expression,5,0,...v)),
(...v)=>(redv$1(119827,R0_iteration_statement7412_group,4,0,...v)),
(...v)=>(redv$1(120847,R0_named_imports1901_group_list,3,0,...v)),
(...v)=>(redv$1(112659,R0_iteration_statement7412_group,4,0,...v)),
(...v)=>(redv$1(111631,R0_named_imports1901_group_list,3,0,...v)),
(...v)=>(rednv$1(113679,fn$1.property_binding,3,0,...v)),
()=>(2250),
(...v)=>(redn$1(71687,1,...v)),
()=>(2254),
(...v)=>(redv$1(116751,R0_iteration_statement7412_group,3,0,...v)),
(...v)=>(redv$1(106515,R0_arguments,4,0,...v)),
(...v)=>(redv$1(108559,R0_named_imports1901_group_list,3,0,...v)),
()=>(2266),
()=>(2270),
(...v)=>(redv$1(80911,R0_iteration_statement7412_group,3,0,...v)),
()=>(2274),
(...v)=>(redn$1(143379,4,...v)),
(...v)=>(redn$1(146447,3,...v)),
(...v)=>(redn$1(149519,3,...v)),
(...v)=>(redn$1(144403,4,...v)),
()=>(2278),
()=>(2286),
(...v)=>(redn$1(147471,3,...v)),
(...v)=>(rednv$1(36887,fn$1.if_statement,5,0,...v)),
()=>(2290),
()=>(2294),
(...v)=>(rednv$1(40983,fn$1.while_statement,5,0,...v)),
()=>(2298),
(...v)=>(shftf$1(2306,I3_iteration_statement,...v)),
()=>(2314),
()=>(2318),
()=>(2326),
(...v)=>(shftf$1(2334,I3_iteration_statement,...v)),
(...v)=>(shftf$1(2338,I3_iteration_statement,...v)),
()=>(2346),
(...v)=>(rednv$1(49175,fn$1.switch_statement,5,0,...v)),
()=>(2354),
()=>(2374),
()=>(2370),
(...v)=>(rednv$1(48151,fn$1.with_statement,5,0,...v)),
()=>(2378),
(...v)=>(redn$1(60423,1,...v)),
(...v)=>(redv$1(88083,R0_class_tail,4,0,...v)),
()=>(2382),
()=>(2390),
()=>(2398),
()=>(2402),
(...v)=>(redv$1(70679,R8_function_declaration,5,0,...v)),
(...v)=>(redn$1(76807,1,...v)),
(...v)=>(redv$1(72719,R0_variable_declaration_list,3,0,...v)),
(...v)=>(redv$1(73743,R0_variable_declaration_list,3,0,...v)),
(...v)=>(redv$1(120851,R0_named_imports1901_group_list,4,0,...v)),
()=>(2406),
()=>(2410),
()=>(2414),
(...v)=>(redn$1(94215,1,...v)),
(...v)=>(redv$1(141339,R2_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
(...v)=>(redn$1(143383,5,...v)),
(...v)=>(redn$1(144407,5,...v)),
()=>(2418),
()=>(2426),
(...v)=>(shftf$1(2434,I3_iteration_statement,...v)),
(...v)=>(shftf$1(2438,I3_iteration_statement,...v)),
()=>(2446),
(...v)=>(redv$1(40987,R15_iteration_statement,6,0,...v)),
(...v)=>(shftf$1(2462,I3_iteration_statement,...v)),
(...v)=>(redv$1(40987,R16_iteration_statement,6,0,...v)),
()=>(2478),
(...v)=>(redv$1(50187,R0_case_block,2,0,...v)),
()=>(2486),
()=>(2498),
(...v)=>(redv$1(51207,R1_named_imports1901_group_list,1,0,...v)),
(...v)=>(redv$1(53255,R1_default_clause,1,0,...v)),
()=>(2506),
()=>(2518),
()=>(2522),
(...v)=>(redv$1(70683,R7_function_declaration,6,0,...v)),
()=>(2526),
(...v)=>(redv$1(70683,R6_function_declaration,6,0,...v)),
(...v)=>(redv$1(70683,R5_function_declaration,6,0,...v)),
()=>(2538),
(...v)=>(redn$1(144411,6,...v)),
(...v)=>(rednv$1(36895,fn$1.if_statement,7,0,...v)),
(...v)=>(rednv$1(40991,fn$1.do_while_statement,7,0,...v)),
(...v)=>(shftf$1(2542,I3_iteration_statement,...v)),
(...v)=>(redv$1(40991,R14_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R10_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R9_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R5_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R13_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R12_iteration_statement,7,0,...v)),
(...v)=>(redv$1(40991,R11_iteration_statement,7,0,...v)),
()=>(2570),
(...v)=>(redv$1(50191,R0_iteration_statement7412_group,3,0,...v)),
(...v)=>(redv$1(51211,R0_case_clauses,2,0,...v)),
()=>(2574),
()=>(2578),
(...v)=>(rednv$1(58391,fn$1.catch_statement,5,0,...v)),
()=>(2586),
(...v)=>(redv$1(70687,R4_function_declaration,7,0,...v)),
(...v)=>(redv$1(70687,R3_function_declaration,7,0,...v)),
(...v)=>(redv$1(70687,R1_function_declaration,7,0,...v)),
()=>(2590),
()=>(2594),
(...v)=>(redv$1(40995,R8_iteration_statement,8,0,...v)),
(...v)=>(redv$1(40995,R7_iteration_statement,8,0,...v)),
(...v)=>(redv$1(40995,R4_iteration_statement,8,0,...v)),
(...v)=>(redv$1(40995,R6_iteration_statement,8,0,...v)),
()=>(2606),
(...v)=>(redv$1(50195,R3_case_block,4,0,...v)),
(...v)=>(redv$1(52239,R1_case_clause,3,0,...v)),
(...v)=>(redv$1(53263,R0_default_clause,3,0,...v)),
(...v)=>(redv$1(70691,R0_function_declaration,8,0,...v)),
(...v)=>(rednv$1(93215,fn$1.class_method,7,0,...v)),
(...v)=>(rednv$1(93215,fn$1.class_get_method,7,0,...v)),
()=>(2614),
(...v)=>(redv$1(40999,R1_iteration_statement,9,0,...v)),
(...v)=>(redv$1(50199,R1_case_block,5,0,...v)),
(...v)=>(redv$1(52243,R0_case_clause,4,0,...v)),
(...v)=>(rednv$1(93219,fn$1.class_set_method,8,0,...v))],

    //Goto Lookup Functions
    goto$1 = [v=>lsm$1(v,gt0$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt1$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt2$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt3$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt4$1),
v=>lsm$1(v,gt5$1),
v=>lsm$1(v,gt6$1),
v=>lsm$1(v,gt7$1),
v=>lsm$1(v,gt8$1),
v=>lsm$1(v,gt9$1),
v=>lsm$1(v,gt10$1),
nf$1,
v=>lsm$1(v,gt11$1),
v=>lsm$1(v,gt12$1),
nf$1,
v=>lsm$1(v,gt13$1),
v=>lsm$1(v,gt14$1),
v=>lsm$1(v,gt15$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt16$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt17$1),
v=>lsm$1(v,gt18$1),
nf$1,
v=>lsm$1(v,gt19$1),
v=>lsm$1(v,gt20$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt21$1),
nf$1,
nf$1,
v=>lsm$1(v,gt22$1),
v=>lsm$1(v,gt23$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt24$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt25$1),
v=>lsm$1(v,gt26$1),
v=>lsm$1(v,gt27$1),
nf$1,
v=>lsm$1(v,gt28$1),
v=>lsm$1(v,gt29$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt30$1),
nf$1,
v=>lsm$1(v,gt31$1),
v=>lsm$1(v,gt32$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt33$1),
v=>lsm$1(v,gt34$1),
v=>lsm$1(v,gt35$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt36$1),
v=>lsm$1(v,gt37$1),
v=>lsm$1(v,gt38$1),
v=>lsm$1(v,gt39$1),
v=>lsm$1(v,gt40$1),
v=>lsm$1(v,gt41$1),
v=>lsm$1(v,gt42$1),
v=>lsm$1(v,gt43$1),
v=>lsm$1(v,gt44$1),
v=>lsm$1(v,gt45$1),
v=>lsm$1(v,gt46$1),
v=>lsm$1(v,gt47$1),
v=>lsm$1(v,gt48$1),
v=>lsm$1(v,gt49$1),
v=>lsm$1(v,gt50$1),
v=>lsm$1(v,gt51$1),
v=>lsm$1(v,gt52$1),
v=>lsm$1(v,gt53$1),
v=>lsm$1(v,gt54$1),
v=>lsm$1(v,gt55$1),
v=>lsm$1(v,gt56$1),
v=>lsm$1(v,gt57$1),
v=>lsm$1(v,gt58$1),
v=>lsm$1(v,gt59$1),
v=>lsm$1(v,gt60$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt61$1),
v=>lsm$1(v,gt62$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt63$1),
nf$1,
v=>lsm$1(v,gt64$1),
v=>lsm$1(v,gt65$1),
v=>lsm$1(v,gt66$1),
v=>lsm$1(v,gt67$1),
nf$1,
nf$1,
v=>lsm$1(v,gt68$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt69$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt70$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt71$1),
nf$1,
v=>lsm$1(v,gt72$1),
v=>lsm$1(v,gt73$1),
nf$1,
nf$1,
v=>lsm$1(v,gt74$1),
nf$1,
v=>lsm$1(v,gt75$1),
nf$1,
nf$1,
v=>lsm$1(v,gt76$1),
v=>lsm$1(v,gt77$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt78$1),
v=>lsm$1(v,gt79$1),
v=>lsm$1(v,gt80$1),
nf$1,
v=>lsm$1(v,gt81$1),
v=>lsm$1(v,gt82$1),
nf$1,
v=>lsm$1(v,gt83$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt84$1),
nf$1,
v=>lsm$1(v,gt85$1),
nf$1,
v=>lsm$1(v,gt86$1),
nf$1,
nf$1,
v=>lsm$1(v,gt87$1),
v=>lsm$1(v,gt88$1),
nf$1,
v=>lsm$1(v,gt89$1),
nf$1,
nf$1,
v=>lsm$1(v,gt90$1),
v=>lsm$1(v,gt91$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt92$1),
v=>lsm$1(v,gt93$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt94$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt95$1),
nf$1,
v=>lsm$1(v,gt96$1),
nf$1,
nf$1,
v=>lsm$1(v,gt97$1),
v=>lsm$1(v,gt98$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt99$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt100$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt101$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt102$1),
nf$1,
v=>lsm$1(v,gt103$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt104$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt105$1),
nf$1,
v=>lsm$1(v,gt106$1),
nf$1,
nf$1,
v=>lsm$1(v,gt107$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt108$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt109$1),
nf$1,
v=>lsm$1(v,gt110$1),
nf$1,
nf$1,
v=>lsm$1(v,gt111$1),
v=>lsm$1(v,gt3$1),
v=>lsm$1(v,gt112$1),
nf$1,
v=>lsm$1(v,gt113$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt114$1),
nf$1,
nf$1,
v=>lsm$1(v,gt115$1),
nf$1,
v=>lsm$1(v,gt116$1),
nf$1,
nf$1,
v=>lsm$1(v,gt117$1),
nf$1,
nf$1,
v=>lsm$1(v,gt118$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt119$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt120$1),
nf$1,
nf$1,
v=>lsm$1(v,gt121$1),
nf$1,
nf$1,
v=>lsm$1(v,gt122$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt123$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt124$1),
v=>lsm$1(v,gt125$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt126$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt127$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt128$1),
nf$1,
v=>lsm$1(v,gt129$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt130$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt131$1),
v=>lsm$1(v,gt132$1),
v=>lsm$1(v,gt133$1),
v=>lsm$1(v,gt134$1),
nf$1,
v=>lsm$1(v,gt135$1),
v=>lsm$1(v,gt136$1),
nf$1,
v=>lsm$1(v,gt137$1),
v=>lsm$1(v,gt138$1),
nf$1,
nf$1,
v=>lsm$1(v,gt76$1),
v=>lsm$1(v,gt77$1),
nf$1,
v=>lsm$1(v,gt90$1),
v=>lsm$1(v,gt91$1),
nf$1,
nf$1,
v=>lsm$1(v,gt139$1),
nf$1,
v=>lsm$1(v,gt140$1),
v=>lsm$1(v,gt141$1),
v=>lsm$1(v,gt142$1),
nf$1,
v=>lsm$1(v,gt143$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt144$1),
v=>lsm$1(v,gt145$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt146$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt147$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt148$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt149$1),
v=>lsm$1(v,gt150$1),
nf$1,
v=>lsm$1(v,gt151$1),
nf$1,
v=>lsm$1(v,gt152$1),
nf$1,
v=>lsm$1(v,gt153$1),
nf$1,
v=>lsm$1(v,gt154$1),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt155$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt156$1),
v=>lsm$1(v,gt157$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt158$1),
nf$1,
v=>lsm$1(v,gt159$1),
nf$1,
v=>lsm$1(v,gt160$1),
nf$1,
v=>lsm$1(v,gt161$1),
v=>lsm$1(v,gt162$1),
nf$1,
v=>lsm$1(v,gt163$1),
nf$1,
v=>lsm$1(v,gt164$1),
v=>lsm$1(v,gt165$1),
nf$1,
v=>lsm$1(v,gt166$1),
nf$1,
nf$1,
v=>lsm$1(v,gt167$1),
v=>lsm$1(v,gt168$1),
nf$1,
v=>lsm$1(v,gt169$1),
nf$1,
v=>lsm$1(v,gt170$1),
v=>lsm$1(v,gt171$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt172$1),
v=>lsm$1(v,gt173$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt174$1),
v=>lsm$1(v,gt175$1),
nf$1,
v=>lsm$1(v,gt176$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt177$1),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt178$1),
v=>lsm$1(v,gt179$1),
nf$1,
nf$1,
v=>lsm$1(v,gt180$1),
nf$1,
nf$1,
v=>lsm$1(v,gt181$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt182$1),
v=>lsm$1(v,gt183$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt184$1),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1];

function getToken$1(l, SYM_LU) {
    if (l.END) return 0; /*6*/

    switch (l.ty) {
        case 2:
            if (SYM_LU.has(l.tx)) return SYM_LU.get(l.tx);
            return 2;
        case 1:
            return 1;
        case 4:
            return 3;
        case 256:
            return 9;
        case 8:
            return 4;
        case 512:
            return 10;
        default:
            return SYM_LU.get(l.tx) || SYM_LU.get(l.ty);
    }
}

/************ Parser *************/

function parser$1(l, e = {}) {
    
    fn$1 = e.functions;

    l.IWS = false;
    l.PARSE_STRING = true;

    if (symbols$1.length > 0) {
        symbols$1.forEach(s => { l.addSymbol(s); });
        l.tl = 0;
        l.next();
    }

    const o = [],
        ss = [0, 0];

    let time = 1000000,
        RECOVERING = 100,
        tk = getToken$1(l, lu$1),
        p = l.copy(),
        sp = 1,
        len = 0,
        off = 0;

    outer:

        while (time-- > 0) {

            const fn = lsm$1(tk, state$1[ss[sp]]) || 0;

            /*@*/// console.log({end:l.END, state:ss[sp], tx:l.tx, ty:l.ty, tk:tk, rev:rlu.get(tk), s_map:state[ss[sp]], res:lsm(tk, state[ss[sp]])});

            let r,
                gt = -1;

            if (fn == 0) {
                /*Ignore the token*/
                l.next();
                tk = getToken$1(l, lu$1);
                continue;
            }

            if (fn > 0) {
                r = state_funct$1[fn - 1](tk, e, o, l, ss[sp - 1]);
            } else {
                if (RECOVERING > 1 && !l.END) {
                    if (tk !== lu$1.get(l.ty)) {
                        //console.log("ABLE", rlu.get(tk), l.tx, tk )
                        tk = lu$1.get(l.ty);
                        continue;
                    }

                    if (tk !== 13) {
                        //console.log("MABLE")
                        tk = 13;
                        RECOVERING = 1;
                        continue;
                    }
                }

                tk = getToken$1(l, lu$1);

                const recovery_token = eh$1[ss[sp]](tk, e, o, l, p, ss[sp], lu$1);

                if (RECOVERING > 0 && recovery_token) {
                    RECOVERING = -1; /* To prevent infinite recursion */
                    tk = recovery_token;
                    l.tl = 0; /*reset current token */
                    continue;
                }
            }

            switch (r & 3) {
                case 0:
                    /* ERROR */

                    if (tk == "$eof")
                        l.throw("Unexpected end of input");
                    l.throw(`Unexpected token [${RECOVERING ? l.next().tx : l.tx}]`);
                    return [null];

                case 1:
                    /* ACCEPT */
                    break outer;

                case 2:
                    /*SHIFT */
                    o.push(l.tx);
                    ss.push(off, r >> 2);
                    sp += 2;
                    p.sync(l);
                    l.next();
                    off = l.off;
                    tk = getToken$1(l, lu$1);
                    RECOVERING++;
                    break;

                case 3:
                    /* REDUCE */

                    len = (r & 0x3FC) >> 1;

                    ss.length -= len;
                    sp -= len;
                    gt = goto$1[ss[sp]](r >> 10);

                    if (gt < 0)
                        l.throw("Invalid state reached!");

                    ss.push(off, gt);
                    sp += 2;
                    break;
            }
        }
    return o[0];
};

function parse(string){
	return parser$1(whind$1(string), env);
}

const removeFromArray = (array, ...elems) => {
    const results = [];
    outer:
        for (let j = 0; j < elems.length; j++) {
            const ele = elems[i];
            for (let i = 0; i < array.length; i++) {
                if (array[i] === ele) {
                    array.splice(i, 1);
                    results.push(true);
                    continue outer;
                }
            }
            results.push(false);
        }

    return results;
};

// Mode Flag
const KEEP = 0;
const IMPORT = 1;
const EXPORT = 2;
const PUT = 4;

/**
 * Gateway for data flow. Represents a single "channel" of data flow. 
 * 
 * By using different modes, one can control how data enters and exits the scope context.
 * -`keep`: 
 *  This mode is the default and treats any data on the channel as coming from the model. The model itself is not changed, and any data flow from outside the scope context is ignored.
 * -`put`:
 *  This mode will update the model to reflect updates on the channel. This will also cause any bindings to update to reflect the change on the model.
 * -`import`:
 *  This mode will allow data from outside the scope context to enter the context as if it came from the model. The model itself is unchanged unless put is specified for the same property.
 *  -`export`:
 *  This mode will propagate data flow to the parent scope context, allowing other scopes to listen on the data flow of the originating scope context.
 *  
 *  if `import` is active, then `keep` is implicitly inactive and the model no longer has any bearing on the value of the bindings.
 */
class Tap {

    constructor(scope, prop, modes = 0) {
        this.scope = scope;
        this.prop = prop;
        this.modes = modes; // 0 implies keep
        this.ios = [];

        if (modes & IMPORT && scope.parent)
            scope.parent.getTap(prop).ios.push(this);

    }

    destroy() {

        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i].destroy();

        this.ios = null;
        this.scope = null;
        this.prop = null;
        this.modes = null;
    }

    load(data) {
        this.downS(data);

        //Make sure export occures as soon as data is ready. 
        const value = data[this.prop];

        if ((typeof(value) !== "undefined") && (this.modes & EXPORT))
            this.scope.up(this, data[this.prop]);
    }

    down(value, meta) {
        for (let i = 0, l = this.ios.length; i < l; i++) {
            this.ios[i].down(value, meta);
        }
    }

    downS(model, IMPORTED = false) {
        const value = model[this.prop];

        if (typeof(value) !== "undefined") {

            if (IMPORTED) {
                if (!(this.modes & IMPORT))
                    return;

                if ((this.modes & PUT) && typeof(value) !== "function") {
                    if (this.scope.model.set)
                        this.scope.model.set({
                            [this.prop]: value
                        });
                    else
                        this.scope.model[this.prop] = value;
                }

            }

            for (let i = 0, l = this.ios.length; i < l; i++) {
                if (this.ios[i] instanceof Tap) {
                    this.ios[i].downS(model, true);
                } else
                    this.ios[i].down(value);
            }
        }
    }

    up(value, meta) {

        if (!(this.modes & (EXPORT | PUT)))
            this.down(value, meta);
        
        if ((this.modes & PUT) && typeof(value) !== "undefined") {

            if (this.scope.model.set)
                this.scope.model.set({
                    [this.prop]: value
                });
            else
                this.scope.model[this.prop] = value;
        }

        if (this.modes & EXPORT)
            this.scope.up(this, value, meta);
    }

    addIO(io) {
        if (io.parent === this)
            return;

        if (io.parent)
            io.parent.removeIO(io);

        this.ios.push(io);

        io.parent = this;
    }

    removeIO(io) {
        if (removeFromArray(this.ios, io)[0])
            io.parent = null;
    }
}

class UpdateTap extends Tap {
    downS(model) {
        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i].down(model);
    }
    up() {}
}

// This serves as a NOOP for io methods that expect a Tap with addIO and RemoveIO operations
const noop = () => {};
const NOOPTap = { addIO: noop, removeIO: noop, up: noop };

/**
 * Base class for an object that binds to and observes a Model.
 *@alias module:wick.core.observer
 */
class View{

	constructor(){
		/**
		 * property
		 */
		this.nx = null;
		this.pv = null;
		this .model = null;
	}

	/**
     * Unbinds the View from its Model and sets all properties to undefined. Should be called by any class extending View
	 * ``` js
	 * class ExtendingView extends wick.core.observer.View{
	 * 		destroy(){
	 * 			//... do some stuff ...
	 * 			super.destroy();
	 * 		}
	 * }
	 * ```
     * @protected
     */
	destroy(){

		if(this.model && this.model.removeView)
			this.model.removeView(this);
	
		this .model = undefined;
		this.nx = undefined;
	}	
	/**
		Called by a Model when its data has changed.
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

		this.nx = null;
		this .model = null;
	}
}

class Scope extends View {

    /**
     *   In the Wick dynamic template system, Scopes serve as the primary access to Model data. They, along with {@link ScopeContainer}s, are the only types of objects the directly _bind_ to a Model. When a Model is updated, the Scope will transmit the updated data to their descendants, which are comprised of {@link Tap}s and {@link ScopeContainer}s.
     *   A Scope will also _bind_ to an HTML element. It has no methodes to update the element, but it's descendants, primarily instances of the {@link IO} class, can update attributes and values of then element and its sub-elements.
     *   @param {Scope} parent - The parent {@link Scope}, used internally to build a hierarchy of Scopes.
     *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
     *   @param {Presets} presets - An instance of the {@link Presets} object.
     *   @param {HTMLElement} element - The HTMLElement the Scope will _bind_ to.
     *   @memberof module:wick~internals.scope
     *   @alias Scope
     *   @extends ScopeBase
     */
    constructor(parent, presets, element, ast) {
        //if(!presets)
        //    debugger;
        super();

        this.ast = ast;

        //ast.setScope(this);
        
        this.parent = parent;
        this.ele = element;
        this.presets = presets;
        this.model = null;
        this.statics = null;

        this.taps = {};
        this.children = [];
        this.scopes = [];
        this.badges = {};
        this.ios = [];
        this.containers = [];
        this.hooks = [];
        this.update_tap = null;

        this._model_name_ = "";
        this._schema_name_ = "";

        this.DESTROYED = false;
        this.LOADED = false;
        this.CONNECTED = false;
        this.TRANSITIONED_IN = false;

        this.addToParent();
    }

    destroy() {

        //Lifecycle Events: Destroying <======================================================================
        this.update({destroying:true});

        this.DESTROYED = true;
        this.LOADED = false;

        if (this.parent && this.parent.removeScope)
            this.parent.removeScope(this);

        this.children.forEach((c) => c.destroy());
        this.children.length = 0;
        this.data = null;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        this.ele = null;

        while (this.scopes[0])
            this.scopes[0].destroy();

        super.destroy();
    }

    getBadges(par) {
        for (let a in this.badges) 
            if (!par.badges[a])
                par.badges[a] = this.badges[a];
    }

    addToParent() {
        if (this.parent)
            this.parent.scopes.push(this);
    }

    addTemplate(template) {
        template.parent = this;
        this.containers.push(template);
    }

    addScope(scope) {
        if (scope.parent == this)
            return;
        scope.parent = this;
        this.scopes.push(scope);
    }

    removeScope(scope) {
        if (scope.parent !== this)
            return;

        for (let i = 0; i < this.scopes.length; i++)
            if (this.scopes[i] == scope)
                return (this.scopes.splice(i, 1), scope.parent = null);
    }

    getTap(name) {
        let tap = this.taps[name];

        if (!tap) {
            if (name == "update")
                this.update_tap = new UpdateTap(this, name);
            else
                tap = this.taps[name] = new Tap(this, name);
        }
        return tap;
    }

    /**
     * Return an array of Tap objects that
     * match the input array.
     */

    linkTaps(tap_list) {
        let out_taps = [];
        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i];
            let name = tap.name;
            if (this.taps[name])
                out_taps.push(this.taps[name]);
            else {
                let bool = name == "update";
                let t = bool ? new UpdateTap(this, name, tap.modes) : new Tap(this, name, tap.modes);

                if (bool)
                    this.update_tap = t;

                this.taps[name] = t;
                out_taps.push(this.taps[name]);
            }
        }

        return out_taps;
    }

    /**
        Makes the scope a observer of the given Model. If no model passed, then the scope will bind to another model depending on its `scheme` or `model` attributes. 
    */
    load(model) {

        let
            m = null,
            SchemedConstructor = null;

        if (this._model_name_ && this.presets.models)
            m = this.presets.models[this._model_name_];
        if (this._schema_name_ && this.presets.schemas)
            SchemedConstructor = this.presets.schemas[this._schema_name_];

        if (m)
            model = m;
        else if (SchemedConstructor) {
            model = new SchemedConstructor();
        } else if (!model)
            model = new Model(model);

        this.LOADED = true;

        for (let i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].load(model);
            this.scopes[i].getBadges(this);
        }


        if (model.addObserver)
            model.addObserver(this);

        this.model = model;

        for (let name in this.taps)
            this.taps[name].load(this.model, false);

        //Lifecycle Events: Loaded <======================================================================
        this.update({loaded:true}); 
    }

    /*************** DATA HANDLING CODE **************************************/

    down(data, changed_values) {
        this.update(data, changed_values, true);
    }

    up(tap, data, meta) {
        if (this.parent)
            this.parent.upImport(tap.prop, data, meta, this);
    }

    upImport(prop_name, data, meta) {
        if (this.taps[prop_name])
            this.taps[prop_name].up(data, meta);
    }

    update(data, changed_values, IMPORTED = false) {

        if (this.update_tap)
            this.update_tap.downS(data, IMPORTED);

        if (changed_values) {

            for (let name in changed_values)
                if (this.taps[name])
                    this.taps[name].downS(data, IMPORTED);
        } else
            for (let name in this.taps)
                this.taps[name].downS(data, IMPORTED);

        for (let i = 0, l = this.containers.length; i < l; i++)
            this.containers[i].down(data, changed_values);
    }

    bubbleLink(child) {
        if (child)
            for (let a in child.badges)
                this.badges[a] = child.badges[a];
        if (this.parent)
            this.parent.bubbleLink(this);
    }

    /*************** DOM CODE ****************************/

    appendToDOM(element, before_element) {

        //Lifecycle Events: Connecting <======================================================================
        this.update({connecting:true});
        
        this.CONNECTED = true;

        if (before_element)
            element.insertBefore(this.ele, before_element);
        else
            element.appendChild(this.ele);

        //Lifecycle Events: Connected <======================================================================
        this.update({connected:true});
    }

    removeFromDOM() {
        //Lifecycle Events: Disconnecting <======================================================================
        this.update({disconnecting:true});

        if (this.CONNECTED == true) return;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);

        //Lifecycle Events: Disconnected <======================================================================
        this.update({disconnectied:true});
    }

    transitionIn(transition, transition_name = "trs_in") {

        if (transition) 
            this.update({[transition_name]:transition});

        this.TRANSITIONED_IN = true;
    }

    transitionOut(transition, transition_name = "trs_out", DESTROY_AFTER_TRANSITION = false) {
        
        this.CONNECTED = false;

        if (this.TRANSITIONED_IN === false) {
            this.removeFromDOM();
            if (DESTROY_AFTER_TRANSITION) this.destroy();
            return;
        }

        let transition_time = 0;

        if (transition) {

            this.update({[transition_name]:transition});

            if (transition.trs)
                transition_time = transition.trs.out_duration;
            else
                transition_time = transition.out_duration;
        }

        this.TRANSITIONED_IN = false;
        
        transition_time = Math.max(transition_time, 0);

        setTimeout(() => {
            this.removeFromDOM();
            if (DESTROY_AFTER_TRANSITION) this.destroy();
        }, transition_time + 2);

        return transition_time;
    }
}

Scope.prototype.removeIO = Tap.prototype.removeIO;
Scope.prototype.addIO = Tap.prototype.addIO;

class ElementNode {

    constructor(env, tag = "", children = [], attribs = [], presets) {

        if (children)
            for (const child of children)
                child.parent = this;

        this.SINGLE = false;
        this.MERGED = false;

        this.presets = presets;
        this.tag = tag;
        this.attribs = attribs || [];
        this.children = children || [];
        this.proxied = null;
        this.slots = null;

        this.component = this.getAttrib("component").value;

        if (this.component)
            presets.components[this.component] = this;

        this.url = this.getAttribute("url") ? URL.resolveRelative(this.getAttribute("url")) : null;
        this.id = this.getAttribute("id");
        this.class = this.getAttribute("id");
        this.name = this.getAttribute("name");
        this.slot = this.getAttribute("slot");
        this.pinned = (this.getAttribute("pin")) ? this.getAttribute("pin") + "$" : "";


        //Prepare attributes with data from this element
        for (const attrib of this.attribs)
            attrib.link(this);

        if (this.url)
            this.loadURL(env);

        return this;
    }

    // Traverse the contructed AST and apply any necessary transforms. 
    finalize(slots_in = {}) {


        if (this.slot) {

            if (!this.proxied_mount)
                this.proxied_mount = this.mount.bind(this);

            //if(!slots_in[this.slot])
            slots_in[this.slot] = this.proxied_mount;

            this.mount = () => {};
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            this.children[i] = child.finalize(slots_in);
        }

        const slots_out = Object.assign({}, slots_in);

        if (this.presets.components[this.tag])
            this.proxied = this.presets.components[this.tag].merge(this);

        if (this.proxied) {
            let ele = this.proxied.finalize(slots_out);
            ele.slots = slots_out;
            this.mount = ele.mount.bind(ele);
        }

        this.children.sort(function(a,b){
            if(a.tag == "script" && b.tag !== "script")
                return 1;
            if(a.tag !== "script" && b.tag == "script")
                return -1;
            return 0;
        });

        return this;
    }

    getAttribute(name) {
        return this.getAttrib(name).value;
    }

    getAttrib(name) {
        for (const attrib of this.attribs) {
            if (attrib.name === name)
                return attrib;
        }

        return { name: "", value: "" }
    }

    createElement() {
        return createElement(this.tag);
    }

    toString(off = 0) {

        let o = offset.repeat(off);

        let str = `${o}<${this.tag}`,
            atr = this.attribs,
            i = -1,
            l = atr.length;

        while (++i < l) {
            let attr = atr[i];

            if (attr.name)
                str += ` ${attr.name}="${attr.value}"`;
        }

        str += ">\n";

        if (this.SINGLE)
            return str;

        str += this.innerToString(off + 1);

        return str + `${o}</${this.tag}>\n`;
    }

    innerToString(off) {
        return this.children.map(e=>e.toString()).join("");
    }

    /****************************************** COMPONENTIZATION *****************************************/


    async loadURL(env) {

        try {
            const own_env = new CompilerEnvironment(env.presets, env);
            own_env.setParent(env);

            const txt_data = await this.url.fetchText();

            own_env.pending++;

            const ast = parser(whind$1(txt_data), own_env);

            this.proxied = ast.merge(this);

            own_env.resolve();

        } catch (err) {
            console.error(err);
        }
    }

    merge(node, merged_node = new this.constructor(null, this.tag, null, null, this.presets)) {

        merged_node.line = this.line;
        merged_node.char = this.char;
        merged_node.offset = this.offset;
        merged_node.single = this.single;
        merged_node.url = this.url;
        merged_node.tag = this.tag;
        merged_node.children = (node.children || this.children) ? [...node.children, ...this.children] : [];
        merged_node.css = this.css;
        merged_node.HAS_TAPS = this.HAS_TAPS;
        merged_node.MERGED = true;
        merged_node._badge_name_ = node._badge_name_;
        merged_node.presets = this.presets;
        merged_node.par = node.par;

        if (this.tap_list)
            merged_node.tap_list = this.tap_list.map(e => Object.assign({}, e));

        merged_node.attribs = merged_node.attribs.concat(this.attribs, node.attribs);

        merged_node.statics = node.statics;

        return merged_node;
    }

    /******************************************* BUILD ****************************************************/

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}) {

        if (this.slots)
            slots = Object.assign({}, slots, this.slots);

        const own_element = this.createElement(scope);
        if (element) appendChild(element, own_element);

        if(this.pinned){
            pinned[this.pinned] = own_element;
        }

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        //if (this.HAS_TAPS)
            //taps = scope.linkTaps(this.tap_list);

        if (!scope.ele) scope.ele = own_element;

        if (this._badge_name_)
            scope.badges[this._badge_name_] = own_element;

        for (let i = 0, l = this.attribs.length; i < l; i++)
            this.attribs[i].bind(own_element, scope, pinned);

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i];
            node.mount(own_element, scope, presets, slots, pinned);
        }

        return scope;
    }
}

//Node that allows the combination of two sets of children from separate nodes that are merged together
class MergerNode {
    constructor(...children_arrays) {
        this.c = [];

        for (let i = 0, l = children_arrays.length; i < l; i++)
            if (Array.isArray(children_arrays))
                this.c = this.c.concat(children_arrays[i]);
    }

    mount(element, scope, presets, statics, pinned) {
        for (let i = 0, l = this.c.length; i < l; i++) {
            if (this.c[i].SLOTED == true) continue;
            this.c[i].build(element, scope, presets, statics, pinned);
        }

        return scope;
    }

    linkCSS() {}

    toString(off = 0) {
        return `${("    ").repeat(off)}${this.binding}\n`;
    }
}

const env$1 = {};
var JS = {

	processType(type, ast, fn){
		for(const a of ast.traverseDepthFirst()){
			if(a.type == type)
				fn(a);
		}
	},

	getFirst(ast, type){
		const tvrs = ast.traverseDepthFirst(); let node = null;

		while((node = tvrs.next().value)){
			if(node.type == type){
				return node;
			}
		}

		return null;
	},
	
	getClosureVariableNames(ast, ...global_objects){
		if(!ast)
			return;
		let
            tvrs = ast.traverseDepthFirst(),
            node = tvrs.next().value,
            non_global = new Set(...global_objects),
            globals = new Set(),
            assignments = new Map();

        //Retrieve undeclared variables to inject as function arguments.
        while (node) {
            if (
                node.type == types.identifier ||
                node.type == types.member_expression
            ) {
                if (node.root && !non_global.has(node.name)){
                    globals.add(node);
                }else{
                	//non_global.add(node.name);
                }
            }

            if(ast !== node && node.type == types.arrow_function_declaration){

            	let glbl = new Set; 

            	node.getRootIds(glbl);

            	let g = this.getClosureVariableNames(node,glbl);

            	g.forEach(v=>globals.add(g));

            	node.skip();
            }

            if (
                node.type == types.lexical_declaration ||
                node.type == types.var
            ) {
                node.bindings.forEach(b => (non_global.add(b.id.name), globals.forEach(g=>{if(g.name == b.id.name) globals.delete(b.id.name);})));
            }

            node = tvrs.next().value;
        }

        return [...globals.values()].reduce((red, out) => {
        	const name = out.name;
            if ((window[name] && !(window[name] instanceof HTMLElement)) || name == "this") 
            	//Skip anything already defined on the global object. 
                return red;

            red.push(out);
            return red;
        }, [])
	},

	getRootVariables(ast){
		const tvrs = ast.traverseDepthFirst(); let node = null;
		var vars = [];
		while((node = tvrs.next().value)){
			if(node.type == types.function_declaration || node.type == types.arrow_function_declaration){
				return node.args.map(e=>e.name);
			}
		}
		return vars
	},

	//Returns the argument names of the first function declaration defined in the ast
	getFunctionDeclarationArgumentNames(ast){
		
		const tvrs = ast.traverseDepthFirst(); let node = null;

		while((node = tvrs.next().value)){
			if(node.type == types.function_declaration || node.type == types.arrow_function_declaration){
				return node.args.map(e=>e.name);
			}
		}
		return [];
	},
	parse(lex){
		let l = lex.copy();

		return JSParser(lex, env$1);
	},

	validate(lex){
		let l = lex.copy();

		try{
			let result = JSParser(lex, env$1);
			return true;
		}catch(e){
			console.error(e);
			return false;
		}
	},

	getRootVariables(lex){
		let l = lex.copy();
		
		let ids = new Set();
		let closure = new Set();

		try{
			let result = JSParser(lex, env$1);

			if(result instanceof identifier$1){
				ids.add(result.val);
			}else
				result.getRootIds(ids, closure);

			return {ids, ast:result, SUCCESS : true}
		}catch(e){
			return {ids, ast:null, SUCCESS : false};
		}
	},

	types : types
};

class IOBase {

    constructor(parent) {

        this.parent = null;
        this.ele = null;

        parent.addIO(this);
    }

    destroy() {

        this.parent.removeIO(this);

        this.parent = null;
    }

    down() {}

    up(value, meta) { this.parent.up(value, meta); }

    //For IO composition.
    set data(data){this.down(data);}

    addIO(child){
        this.ele = child;
    }

    removeIO(){
        this.ele = null;
    }
}

/**
 *   The IO is the last link in the Scope chain. It is responsible for putting date into the DOM through the element it binds to. Alternativly, in derived versions of `IO`, it is responsible for retriving values from user inputs from input elements and events.
 *   @param {Scope} tap - The tap {@link Scope}, used internally to build a hierarchy of Scopes.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @param {HTMLElement} element - The HTMLElement that the IO will _bind_ to.
 *   @memberof module:wick.core.scope
 *   @alias IO
 *   @extends IOBase
 */
class IO extends IOBase {

    constructor(scope, errors, tap, element = null, default_val = null) {

        super(tap);
        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 
        this.ele = element;
        this.argument = null;

        if (default_val) this.down(default_val);
    }

    destroy() {
        this.ele = null;
        super.destroy();
    }

    down(value) {
        this.ele.data = value;
    }
}

class RedirectAttribIO extends IOBase{
    constructor(scope, errors, down_tap, up_tap){
        super(down_tap);
        this.up_tap = up_tap;
    }

    down(value){
        this.up_tap.up(value);
    }
}

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
class AttribIO extends IOBase {
    constructor(scope, errors, tap, attr, element, default_val) {

        if(element.io){
            let down_tap = element.io.parent;
            let root = scope.parent;
            tap.modes |= EXPORT;
            return new RedirectAttribIO(scope, errors, element.io.parent, tap)
        }

        super(tap);

        this.attrib = attr;
        this.ele = element;
        this.ele.io = this;
        

        if (default_val) this.down(default_val);
    }

    destroy() {
        this.ele = null;
        this.attrib = null;
        super.destroy();
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data._value_.  
    */
    down(value) {
        this.ele.setAttribute(this.attrib, value);
    }

    set data(v){
        this.down();
    }

    get data(){

    }
}

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
class DataNodeIO extends IOBase {
    constructor(scope, tap, element, default_val) {
        super(tap);
        this.ele = element;
        if (default_val) this.down(default_val);
    }

    destroy() {
        this.ele = null;
        this.attrib = null;
        super.destroy();
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data._value_.  
    */
    down(value) {
        this.ele.data = value;
    }
}

class EventIO extends IOBase {

    constructor(scope, errors, tap, attrib_name, element, default_val) {

        super(tap);

        this.ele = element;

        const up_tap = default_val ? scope.getTap(default_val) : tap;

        this.event = (e) => { up_tap.up(e.target.value, { event: e }); };

        this.event_name = attrib_name.replace("on", "");

        this.ele.addEventListener(this.event_name, this.event);
    }

    destroy() {
        this.ele.removeEventListener("input", this.event);
        this.ele = null;
        this.event = null;
        this.event_name = null;
        this.attrib = null;
    }

    down(value) {
        this.ele.value = value;
    }
}

class InputIO extends IOBase {

    constructor(scope, errors, tap, attrib_name, element, default_val) {

        super(tap);

        this.ele = element;

        const up_tap = default_val ? scope.getTap(default_val) : tap;

        if(element.type == "checkbox")
            this.event = (e) => {up_tap.up(e.target.checked, { event: e }); };
        else
            this.event = (e) => {up_tap.up(e.target.value, { event: e }); };

        this.ele.addEventListener("input", this.event);
    }

    destroy() {
        this.ele.removeEventListener("input", this.event);
        this.ele = null;
        this.event = null;
        this.attrib = null;
    }

    down(value) {
        this.ele.value = value;
    }
}

/**
 * Used to call the Scheduler after a JavaScript runtime tick.
 *
 * Depending on the platform, caller will either map to requestAnimationFrame or it will be a setTimout.
 */
 
const caller$1 = (typeof(window) == "object" && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1);
};

const perf$1 = (typeof(performance) == "undefined") ? { now: () => Date.now() } : performance;


/**
 * Handles updating objects. It does this by splitting up update cycles, to respect the browser event model. 
 *    
 * If any object is scheduled to be updated, it will be blocked from scheduling more updates until the next ES VM tick.
 */
class Spark$1 {
    /**
     * Constructs the object.
     */
    constructor() {

        this.update_queue_a = [];
        this.update_queue_b = [];

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;

        this.callback = ()=>{};


        if(typeof(window) !== "undefined"){
            window.addEventListener("load",()=>{
                this.callback = () => this.update();
                caller$1(this.callback);
            });
        }else{
            this.callback = () => this.update();
        }


        this.frame_time = perf$1.now();

        this.SCHEDULE_PENDING = false;
    }

    /**
     * Given an object that has a _SCHD_ Boolean property, the Scheduler will queue the object and call its .update function 
     * the following tick. If the object does not have a _SCHD_ property, the Scheduler will persuade the object to have such a property.
     * 
     * If there are currently no queued objects when this is called, then the Scheduler will user caller to schedule an update.
     */
    queueUpdate(object, timestart = 1, timeend = 0) {

        if (object._SCHD_ || object._SCHD_ > 0) {
            if (this.SCHEDULE_PENDING)
                return;
            else
                return caller$1(this.callback);
        }

        object._SCHD_ = ((timestart & 0xFFFF) | ((timeend) << 16));

        this.update_queue.push(object);

        if (this._SCHD_)
            return;

        this.frame_time = perf$1.now() | 0;


        if(!this.SCHEDULE_PENDING){
            this.SCHEDULE_PENDING = true;
            caller$1(this.callback);
        }
    }

    removeFromQueue(object){

        if(object._SCHD_)
            for(let i = 0, l = this.update_queue.length; i < l; i++)
                if(this.update_queue[i] === object){
                    this.update_queue.splice(i,1);
                    object._SCHD_ = 0;

                    if(l == 1)
                        this.SCHEDULE_PENDING = false;

                    return;
                }
    }

    /**
     * Called by the caller function every tick. Calls .update on any object queued for an update. 
     */
    update() {

        this.SCHEDULE_PENDING = false;

        const uq = this.update_queue;
        const time = perf$1.now() | 0;
        const diff = Math.ceil(time - this.frame_time) | 1;
        const step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

        this.frame_time = time;
        
        if (this.queue_switch == 0)
            (this.update_queue = this.update_queue_b, this.queue_switch = 1);
        else
            (this.update_queue = this.update_queue_a, this.queue_switch = 0);

        for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]) {
            let timestart = ((o._SCHD_ & 0xFFFF)) - diff;
            let timeend = ((o._SCHD_ >> 16) & 0xFFFF);

            o._SCHD_ = 0;
            
            if (timestart > 0) {
                this.queueUpdate(o, timestart, timeend);
                continue;
            }

            timestart = 0;

            if (timeend > 0) 
                this.queueUpdate(o, timestart, timeend - diff);

            /** 
                To ensure on code path doesn't block any others, 
                scheduledUpdate methods are called within a try catch block. 
                Errors by default are printed to console. 
            **/
            try {
                o.scheduledUpdate(step_ratio, diff);
            } catch (e) {
                console.error(e);
            }
        }

        uq.length = 0;
    }
}

const spark$1 = new Spark$1();

/**
 * To be extended by objects needing linked list methods.
 */
const LinkedList = {

    props: {
        /**
         * Properties for horizontal graph traversal
         * @property {object}
         */
        defaults: {
            /**
             * Next sibling node
             * @property {object | null}
             */
            nxt: null,

            /**
             * Previous sibling node
             * @property {object | null}
             */
            prv: null
        },

        /**
         * Properties for vertical graph traversal
         * @property {object}
         */
        children: {
            /**
             * Number of children nodes.
             * @property {number}
             */
            noc: 0,
            /**
             * First child node
             * @property {object | null}
             */
            fch: null,
        },
        parent: {
            /**
             * Parent node
             * @property {object | null}
             */
            par: null
        }
    },

    methods: {
        /**
         * Default methods for Horizontal traversal
         */
        defaults: {

            insertBefore: function(node) {

                if (!this.nxt && !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if(node){
                    if (node.prv)
                       node.prv.nxt = node.nxt;
                    
                    if(node.nxt) 
                        node.nxt.prv = node.prv;
                
                    node.prv = this.prv;
                    node.nxt = this;
                    this.prv.nxt = node;
                    this.prv = node;
                }else{
                    if (this.prv)
                        this.prv.nxt = node;
                    this.prv = node;
                } 
            },

            insertAfter: function(node) {

                if (!this.nxt && !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if(node){
                    if (node.prv)
                       node.prv.nxt = node.nxt;
                    
                    if(node.nxt) 
                        node.nxt.prv = node.prv;
                
                    node.nxt = this.nxt;
                    node.prv = this;
                    this.nxt.prv = node;
                    this.nxt = node;
                }else{
                    if (this.nxt)
                        this.nxt.prv = node;
                    this.nxt = node;
                } 
            }
        },
        /**
         * Methods for both horizontal and vertical traversal.
         */
        parent_child: {
            /**
             *  Returns eve. 
             * @return     {<type>}  { description_of_the_return_value }
             */
            root() {
                return this.eve();
            },
            /**
             * Returns the root node. 
             * @return     {Object}  return the very first node in the linked list graph.
             */
            eve() {
                if (this.par)
                    return this.par.eve();
                return this;
            },

            push(node) {
                this.addChild(node);
            },

            unshift(node) {
                this.addChild(node, (this.fch) ? this.fch.pre : null);
            },

            replace(old_node, new_node) {
                if (old_node.par == this && old_node !== new_node) {
                    if (new_node.par) new_node.par.remove(new_node);

                    if (this.fch == old_node) this.fch = new_node;
                    new_node.par = this;


                    if (old_node.nxt == old_node) {
                        new_node.nxt = new_node;
                        new_node.prv = new_node;
                    } else {
                        new_node.prv = old_node.prv;
                        new_node.nxt = old_node.nxt;
                        old_node.nxt.prv = new_node;
                        old_node.prv.nxt = new_node;
                    }

                    old_node.par = null;
                    old_node.prv = null;
                    old_node.nxt = null;
                }
            },

            insertBefore: function(node) {
                if (this.par)
                    this.par.addChild(node, this.pre);
                else
                    LinkedList.methods.defaults.insertBefore.call(this, node);
            },

            insertAfter: function(node) {
                if (this.par)
                    this.par.addChild(node, this);
                else
                    LinkedList.methods.defaults.insertAfter.call(this, node);
            },

            addChild: function(child = null, prev = null) {

                if (!child) return;

                if (child.par)
                    child.par.removeChild(child);

                if (prev && prev.par && prev.par == this) {
                    if (child == prev) return;
                    child.prv = prev;
                    prev.nxt.prv = child;
                    child.nxt = prev.nxt;
                    prev.nxt = child;
                } else if (this.fch) {
                    child.prv = this.fch.prv;
                    this.fch.prv.nxt = child;
                    child.nxt = this.fch;
                    this.fch.prv = child;
                } else {
                    this.fch = child;
                    child.nxt = child;
                    child.prv = child;
                }

                child.par = this;
                this.noc++;
            },

            /**
             * Analogue to HTMLElement.removeChild()
             *
             * @param      {HTMLNode}  child   The child
             */
            removeChild: function(child) {
                if (child.par && child.par == this) {
                    child.prv.nxt = child.nxt;
                    child.nxt.prv = child.prv;

                    if (child.prv == child || child.nxt == child) {
                        if (this.fch == child)
                            this.fch = null;
                    } else if (this.fch == child)
                        this.fch = child.nxt;

                    child.prv = null;
                    child.nxt = null;
                    child.par = null;
                    this.noc--;
                }
            },

            /**
             * Gets the next node. 
             *
             * @param      {HTMLNode}  node    The node to get the sibling of.
             * @return {HTMLNode | TextNode | undefined}
             */
            getNextChild: function(node = this.fch) {
                if (node && node.nxt != this.fch && this.fch)
                    return node.nxt;
                return null;
            },

            /**
             * Gets the child at index.
             *
             * @param      {number}  index   The index
             */
            getChildAtIndex: function(index, node = this.fch) {
                if(node.par !== this)
                    node = this.fch;

                let first = node;
                let i = 0;
                while (node && node != first) {
                    if (i++ == index)
                        return node;
                    node = node.nxt;
                }

                return null;
            },
        }
    },

    gettersAndSetters : {
        peer : {
            next: {
                enumerable: true,
                configurable: true,
                get: function() {
                    return this.nxt;
                },
                set: function(n) {
                    this.insertAfter(n);
                }
            },
            previous: {
                enumerable: true,
                configurable: true,
                get: function() {
                    return this.prv;
                },
                set: function(n) {
                    this.insertBefore(n);
                }   
            }
        },
        tree : {
            children: {
                enumerable: true,
                configurable: true,
                /**
                 * @return {array} Returns an array of all children.
                 */
                get: function() {
                    for (var z = [], i = 0, node = this.fch; i++ < this.noc;)(
                        z.push(node), node = node.nxt
                    );
                    return z;
                },
                set: function(e) {
                    /* No OP */
                }
            },
            parent: {
                enumerable: true,
                configurable: true,
                /**
                 * @return parent node
                 */
                get: function() {
                    return this.par;
                },
                set: function(p) {
                    if(p && p.addChild)
                        p.addChild(this);
                    else if(p === null && this.par)
                        this.par.removeChild(this);
                }
            }
        }
    },


    mixin : (constructor)=>{
        const proto = (typeof(constructor) == "function") ? constructor.prototype : (typeof(constructor) == "object") ? constructor : null;
        if(proto){
            Object.assign(proto, 
                LinkedList.props.defaults, 
                LinkedList.methods.defaults
            );
        }
        Object.defineProperties(proto, LinkedList.gettersAndSetters.peer);
    },

    mixinTree : (constructor)=>{
        const proto = (typeof(constructor) == "function") ? constructor.prototype : (typeof(constructor) == "object") ? constructor : null;
        if(proto){
            Object.assign(proto, 
                LinkedList.props.defaults, 
                LinkedList.props.children, 
                LinkedList.props.parent, 
                LinkedList.methods.defaults, 
                LinkedList.methods.parent_child
                );
            Object.defineProperties(proto, LinkedList.gettersAndSetters.tree);
            Object.defineProperties(proto, LinkedList.gettersAndSetters.peer);
        }
    }
};

const A$1 = 65;
const a$1 = 97;
const ACKNOWLEDGE$1 = 6;
const AMPERSAND$1 = 38;
const ASTERISK$1 = 42;
const AT$1 = 64;
const B$1 = 66;
const b$1 = 98;
const BACKSLASH$1 = 92;
const BACKSPACE$1 = 8;
const BELL$1 = 7;
const C$1 = 67;
const c$1 = 99;
const CANCEL$1 = 24;
const CARET$1 = 94;
const CARRIAGE_RETURN$1 = 13;
const CLOSE_CURLY$1 = 125;
const CLOSE_PARENTH$1 = 41;
const CLOSE_SQUARE$1 = 93;
const COLON$1 = 58;
const COMMA$1 = 44;
const d$1 = 100;
const D$1 = 68;
const DATA_LINK_ESCAPE$1 = 16;
const DELETE$1 = 127;
const DEVICE_CTRL_1$1 = 17;
const DEVICE_CTRL_2$1 = 18;
const DEVICE_CTRL_3$1 = 19;
const DEVICE_CTRL_4$1 = 20;
const DOLLAR$1 = 36;
const DOUBLE_QUOTE$1 = 34;
const e$4 = 101;
const E$1 = 69;
const EIGHT$1 = 56;
const END_OF_MEDIUM$1 = 25;
const END_OF_TRANSMISSION$1 = 4;
const END_OF_TRANSMISSION_BLOCK$1 = 23;
const END_OF_TXT$1 = 3;
const ENQUIRY$1 = 5;
const EQUAL$1 = 61;
const ESCAPE$1 = 27;
const EXCLAMATION$1 = 33;
const f$1 = 102;
const F$1 = 70;
const FILE_SEPERATOR$1 = 28;
const FIVE$1 = 53;
const FORM_FEED$1 = 12;
const FORWARD_SLASH$1 = 47;
const FOUR$1 = 52;
const g$1 = 103;
const G$1 = 71;
const GRAVE$1 = 96;
const GREATER_THAN$1 = 62;
const GROUP_SEPERATOR$1 = 29;
const h$1 = 104;
const H$1 = 72;
const HASH$1 = 35;
const HORIZONTAL_TAB$1 = 9;
const HYPHEN$1 = 45;
const i$2 = 105;
const I$1 = 73;
const j$1 = 106;
const J$1 = 74;
const k$1 = 107;
const K$1 = 75;
const l$1 = 108;
const L$1 = 76;
const LESS_THAN$1 = 60;
const LINE_FEED$1 = 10;
const m$1 = 109;
const M$1 = 77;
const n$1 = 110;
const N$1 = 78;
const NEGATIVE_ACKNOWLEDGE$1 = 21;
const NINE$1 = 57;
const NULL$1 = 0;
const o$1 = 111;
const O$1 = 79;
const ONE$1 = 49;
const OPEN_CURLY$1 = 123;
const OPEN_PARENTH$1 = 40;
const OPEN_SQUARE$1 = 91;
const p$1 = 112;
const P$1 = 80;
const PERCENT$1 = 37;
const PERIOD$1 = 46;
const PLUS$1 = 43;
const q$1 = 113;
const Q$1 = 81;
const QMARK$1 = 63;
const QUOTE$1 = 39;
const r$2 = 114;
const R$1 = 82;
const RECORD_SEPERATOR$1 = 30;
const s$1 = 115;
const S$1 = 83;
const SEMICOLON$1 = 59;
const SEVEN$1 = 55;
const SHIFT_IN$1 = 15;
const SHIFT_OUT$1 = 14;
const SIX$1 = 54;
const SPACE$1 = 32;
const START_OF_HEADER$1 = 1;
const START_OF_TEXT$1 = 2;
const SUBSTITUTE$1 = 26;
const SYNCH_IDLE$1 = 22;
const t$1 = 116;
const T$1 = 84;
const THREE$1 = 51;
const TILDE$1 = 126;
const TWO$1 = 50;
const u$1 = 117;
const U$1 = 85;
const UNDER_SCORE$1 = 95;
const UNIT_SEPERATOR$1 = 31;
const v$1 = 118;
const V$1 = 86;
const VERTICAL_BAR$1 = 124;
const VERTICAL_TAB$1 = 11;
const w$1 = 119;
const W$1 = 87;
const x$1 = 120;
const X$1 = 88;
const y$1 = 121;
const Y$1 = 89;
const z$1 = 122;
const Z$1 = 90;
const ZERO$1 = 48;

/**
 * Lexer Jump table reference 
 * 0. NUMBER
 * 1. IDENTIFIER
 * 2. QUOTE STRING
 * 3. SPACE SET
 * 4. TAB SET
 * 5. CARIAGE RETURN
 * 6. LINEFEED
 * 7. SYMBOL
 * 8. OPERATOR
 * 9. OPEN BRACKET
 * 10. CLOSE BRACKET 
 * 11. DATA_LINK
 */ 
const jump_table$1 = [
7, 	 	/* NULL */
7, 	 	/* START_OF_HEADER */
7, 	 	/* START_OF_TEXT */
7, 	 	/* END_OF_TXT */
7, 	 	/* END_OF_TRANSMISSION */
7, 	 	/* ENQUIRY */
7, 	 	/* ACKNOWLEDGE */
7, 	 	/* BELL */
7, 	 	/* BACKSPACE */
4, 	 	/* HORIZONTAL_TAB */
6, 	 	/* LINEFEED */
7, 	 	/* VERTICAL_TAB */
7, 	 	/* FORM_FEED */
5, 	 	/* CARRIAGE_RETURN */
7, 	 	/* SHIFT_OUT */
7, 		/* SHIFT_IN */
11,	 	/* DATA_LINK_ESCAPE */
7, 	 	/* DEVICE_CTRL_1 */
7, 	 	/* DEVICE_CTRL_2 */
7, 	 	/* DEVICE_CTRL_3 */
7, 	 	/* DEVICE_CTRL_4 */
7, 	 	/* NEGATIVE_ACKNOWLEDGE */
7, 	 	/* SYNCH_IDLE */
7, 	 	/* END_OF_TRANSMISSION_BLOCK */
7, 	 	/* CANCEL */
7, 	 	/* END_OF_MEDIUM */
7, 	 	/* SUBSTITUTE */
7, 	 	/* ESCAPE */
7, 	 	/* FILE_SEPERATOR */
7, 	 	/* GROUP_SEPERATOR */
7, 	 	/* RECORD_SEPERATOR */
7, 	 	/* UNIT_SEPERATOR */
3, 	 	/* SPACE */
8, 	 	/* EXCLAMATION */
2, 	 	/* DOUBLE_QUOTE */
7, 	 	/* HASH */
7, 	 	/* DOLLAR */
8, 	 	/* PERCENT */
8, 	 	/* AMPERSAND */
2, 	 	/* QUOTE */
9, 	 	/* OPEN_PARENTH */
10, 	 /* CLOSE_PARENTH */
8, 	 	/* ASTERISK */
8, 	 	/* PLUS */
7, 	 	/* COMMA */
7, 	 	/* HYPHEN */
7, 	 	/* PERIOD */
7, 	 	/* FORWARD_SLASH */
0, 	 	/* ZERO */
0, 	 	/* ONE */
0, 	 	/* TWO */
0, 	 	/* THREE */
0, 	 	/* FOUR */
0, 	 	/* FIVE */
0, 	 	/* SIX */
0, 	 	/* SEVEN */
0, 	 	/* EIGHT */
0, 	 	/* NINE */
8, 	 	/* COLON */
7, 	 	/* SEMICOLON */
8, 	 	/* LESS_THAN */
8, 	 	/* EQUAL */
8, 	 	/* GREATER_THAN */
7, 	 	/* QMARK */
7, 	 	/* AT */
1, 	 	/* A*/
1, 	 	/* B */
1, 	 	/* C */
1, 	 	/* D */
1, 	 	/* E */
1, 	 	/* F */
1, 	 	/* G */
1, 	 	/* H */
1, 	 	/* I */
1, 	 	/* J */
1, 	 	/* K */
1, 	 	/* L */
1, 	 	/* M */
1, 	 	/* N */
1, 	 	/* O */
1, 	 	/* P */
1, 	 	/* Q */
1, 	 	/* R */
1, 	 	/* S */
1, 	 	/* T */
1, 	 	/* U */
1, 	 	/* V */
1, 	 	/* W */
1, 	 	/* X */
1, 	 	/* Y */
1, 	 	/* Z */
9, 	 	/* OPEN_SQUARE */
7, 	 	/* TILDE */
10, 	/* CLOSE_SQUARE */
7, 	 	/* CARET */
7, 	 	/* UNDER_SCORE */
2, 	 	/* GRAVE */
1, 	 	/* a */
1, 	 	/* b */
1, 	 	/* c */
1, 	 	/* d */
1, 	 	/* e */
1, 	 	/* f */
1, 	 	/* g */
1, 	 	/* h */
1, 	 	/* i */
1, 	 	/* j */
1, 	 	/* k */
1, 	 	/* l */
1, 	 	/* m */
1, 	 	/* n */
1, 	 	/* o */
1, 	 	/* p */
1, 	 	/* q */
1, 	 	/* r */
1, 	 	/* s */
1, 	 	/* t */
1, 	 	/* u */
1, 	 	/* v */
1, 	 	/* w */
1, 	 	/* x */
1, 	 	/* y */
1, 	 	/* z */
9, 	 	/* OPEN_CURLY */
7, 	 	/* VERTICAL_BAR */
10,  	/* CLOSE_CURLY */
7,  	/* TILDE */
7 		/* DELETE */
];	

/**
 * LExer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
 * entries marked as `2` are in the identifier set but not the number set
 * entries marked as `4` are in the number set but not the identifier set
 * entries marked as `8` are in both number and identifier sets
 */
const number_and_identifier_table$1 = [
0, 		/* NULL */
0, 		/* START_OF_HEADER */
0, 		/* START_OF_TEXT */
0, 		/* END_OF_TXT */
0, 		/* END_OF_TRANSMISSION */
0, 		/* ENQUIRY */
0,		/* ACKNOWLEDGE */
0,		/* BELL */
0,		/* BACKSPACE */
0,		/* HORIZONTAL_TAB */
0,		/* LINEFEED */
0,		/* VERTICAL_TAB */
0,		/* FORM_FEED */
0,		/* CARRIAGE_RETURN */
0,		/* SHIFT_OUT */
0,		/* SHIFT_IN */
0,		/* DATA_LINK_ESCAPE */
0,		/* DEVICE_CTRL_1 */
0,		/* DEVICE_CTRL_2 */
0,		/* DEVICE_CTRL_3 */
0,		/* DEVICE_CTRL_4 */
0,		/* NEGATIVE_ACKNOWLEDGE */
0,		/* SYNCH_IDLE */
0,		/* END_OF_TRANSMISSION_BLOCK */
0,		/* CANCEL */
0,		/* END_OF_MEDIUM */
0,		/* SUBSTITUTE */
0,		/* ESCAPE */
0,		/* FILE_SEPERATOR */
0,		/* GROUP_SEPERATOR */
0,		/* RECORD_SEPERATOR */
0,		/* UNIT_SEPERATOR */
0,		/* SPACE */
0,		/* EXCLAMATION */
0,		/* DOUBLE_QUOTE */
0,		/* HASH */
8,		/* DOLLAR */
0,		/* PERCENT */
0,		/* AMPERSAND */
2,		/* QUOTE */
0,		/* OPEN_PARENTH */
0,		 /* CLOSE_PARENTH */
0,		/* ASTERISK */
0,		/* PLUS */
0,		/* COMMA */
2,		/* HYPHEN */
4,		/* PERIOD */
0,		/* FORWARD_SLASH */
8,		/* ZERO */
8,		/* ONE */
8,		/* TWO */
8,		/* THREE */
8,		/* FOUR */
8,		/* FIVE */
8,		/* SIX */
8,		/* SEVEN */
8,		/* EIGHT */
8,		/* NINE */
0,		/* COLON */
0,		/* SEMICOLON */
0,		/* LESS_THAN */
0,		/* EQUAL */
0,		/* GREATER_THAN */
0,		/* QMARK */
0,		/* AT */
2,		/* A*/
8,		/* B */
2,		/* C */
2,		/* D */
8,		/* E */
2,		/* F */
2,		/* G */
2,		/* H */
2,		/* I */
2,		/* J */
2,		/* K */
2,		/* L */
2,		/* M */
2,		/* N */
8,		/* O */
2,		/* P */
2,		/* Q */
2,		/* R */
2,		/* S */
2,		/* T */
2,		/* U */
2,		/* V */
2,		/* W */
8,		/* X */
2,		/* Y */
2,		/* Z */
0,		/* OPEN_SQUARE */
0,		/* TILDE */
0,		/* CLOSE_SQUARE */
0,		/* CARET */
2,		/* UNDER_SCORE */
0,		/* GRAVE */
2,		/* a */
8,		/* b */
2,		/* c */
2,		/* d */
2,		/* e */
2,		/* f */
2,		/* g */
2,		/* h */
2,		/* i */
2,		/* j */
2,		/* k */
2,		/* l */
2,		/* m */
2,		/* n */
8,		/* o */
2,		/* p */
2,		/* q */
2,		/* r */
2,		/* s */
2,		/* t */
2,		/* u */
2,		/* v */
2,		/* w */
8,		/* x */
2,		/* y */
2,		/* z */
0,		/* OPEN_CURLY */
0,		/* VERTICAL_BAR */
0,		/* CLOSE_CURLY */
0,		/* TILDE */
0		/* DELETE */
];

const number$2 = 1,
    identifier$2 = 2,
    string$3 = 4,
    white_space$1 = 8,
    open_bracket$1 = 16,
    close_bracket$1 = 32,
    operator$2 = 64,
    symbol$1 = 128,
    new_line$1 = 256,
    data_link$1 = 512,
    alpha_numeric$1 = (identifier$2 | number$2),
    white_space_new_line$1 = (white_space$1 | new_line$1),
    Types$1 = {
        num: number$2,
        number: number$2,
        id: identifier$2,
        identifier: identifier$2,
        str: string$3,
        string: string$3,
        ws: white_space$1,
        white_space: white_space$1,
        ob: open_bracket$1,
        open_bracket: open_bracket$1,
        cb: close_bracket$1,
        close_bracket: close_bracket$1,
        op: operator$2,
        operator: operator$2,
        sym: symbol$1,
        symbol: symbol$1,
        nl: new_line$1,
        new_line: new_line$1,
        dl: data_link$1,
        data_link: data_link$1,
        alpha_numeric: alpha_numeric$1,
        white_space_new_line: white_space_new_line$1,
    },

    /*** MASKS ***/

    TYPE_MASK$1 = 0xF,
    PARSE_STRING_MASK$1 = 0x10,
    IGNORE_WHITESPACE_MASK$1 = 0x20,
    CHARACTERS_ONLY_MASK$1 = 0x40,
    TOKEN_LENGTH_MASK$1 = 0xFFFFFF80,

    //De Bruijn Sequence for finding index of right most bit set.
    //http://supertech.csail.mit.edu/papers/debruijn.pdf
    debruijnLUT$1 = [
        0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
        31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
    ];

const  getNumbrOfTrailingZeroBitsFromPowerOf2$1 = (value) => debruijnLUT$1[(value * 0x077CB531) >>> 27];

class Lexer$1 {

    constructor(string = "", INCLUDE_WHITE_SPACE_TOKENS = false, PEEKING = false) {

        if (typeof(string) !== "string") throw new Error(`String value must be passed to Lexer. A ${typeof(string)} was passed as the \`string\` argument.`);

        /**
         * The string that the Lexer tokenizes.
         */
        this.str = string;

        /**
         * Reference to the peeking Lexer.
         */
        this.p = null;

        /**
         * The type id of the current token.
         */
        this.type = 32768; //Default "non-value" for types is 1<<15;

        /**
         * The offset in the string of the start of the current token.
         */
        this.off = 0;

        this.masked_values = 0;

        /**
         * The character offset of the current token within a line.
         */
        this.char = 0;
        /**
         * The line position of the current token.
         */
        this.line = 0;
        /**
         * The length of the string being parsed
         */
        this.sl = string.length;
        /**
         * The length of the current token.
         */
        this.tl = 0;

        /**
         * Flag to ignore white spaced.
         */
        this.IWS = !INCLUDE_WHITE_SPACE_TOKENS;

        /**
         * Flag to force the lexer to parse string contents
         */
        this.PARSE_STRING = false;

        if (!PEEKING) this.next();
    }

    /**
     * Restricts max parse distance to the other Lexer's current position.
     * @param      {Lexer}  Lexer   The Lexer to limit parse distance by.
     */
    fence(marker = this) {
        if (marker.str !== this.str)
            return;
        this.sl = marker.off;
        return this;
    }

    /**
     * Copies the Lexer.
     * @return     {Lexer}  Returns a new Lexer instance with the same property values.
     */
    copy(destination = new Lexer$1(this.str, false, true)) {
        destination.off = this.off;
        destination.char = this.char;
        destination.line = this.line;
        destination.sl = this.sl;
        destination.masked_values = this.masked_values;
        return destination;
    }

    /**
     * Given another Lexer with the same `str` property value, it will copy the state of that Lexer.
     * @param      {Lexer}  [marker=this.peek]  The Lexer to clone the state from. 
     * @throws     {Error} Throws an error if the Lexers reference different strings.
     * @public
     */
    sync(marker = this.p) {

        if (marker instanceof Lexer$1) {
            if (marker.str !== this.str) throw new Error("Cannot sync Lexers with different strings!");
            this.off = marker.off;
            this.char = marker.char;
            this.line = marker.line;
            this.masked_values = marker.masked_values;
        }

        return this;
    }

    /**
    Creates and error message with a diagrame illustrating the location of the error. 
    */
    errorMessage(message = "") {
        const arrow = String.fromCharCode(0x2b89),
            trs = String.fromCharCode(0x2500),
            line = String.fromCharCode(0x2500),
            thick_line = String.fromCharCode(0x2501),
            line_number = "    " + this.line + ": ",
            line_fill = line_number.length,
            t = thick_line.repeat(line_fill + 48),
            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
        const pk = this.copy();
        pk.IWS = false;
        while (!pk.END && pk.ty !== Types$1.nl) { pk.next(); }
        const end = (pk.END) ? this.str.length : pk.off ;

    //console.log(`"${this.str.slice(this.off-this.char+((this.line > 0) ? 2 :2), end).split("").map((e,i,s)=>e.charCodeAt(0))}"`)
    let v = "", length = 0;
    v = this.str.slice(this.off-this.char+((this.line > 0) ? 2 :1), end);
    length = this.char;
    return `${message} at ${this.line}:${this.char}
${t}
${line_number+v}
${line.repeat(length+line_fill-((this.line > 0) ? 2 :1))+arrow}
${t}
${is_iws}`;
    }

    /**
     * Will throw a new Error, appending the parsed string line and position information to the the error message passed into the function.
     * @instance
     * @public
     * @param {String} message - The error message.
     * @param {Bool} DEFER - if true, returns an Error object instead of throwing.
     */
    throw (message, DEFER = false) {
        const error = new Error(this.errorMessage(message));
        if (DEFER)
            return error;
        throw error;
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
        this.type = 32768;
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.n;
        return this;
    }

    resetHead() {
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.p = null;
        this.type = 32768;
    }

    /**
     * Sets the internal state to point to the next token. Sets Lexer.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    next(marker = this) {

        if (marker.sl < 1) {
            marker.off = 0;
            marker.type = 32768;
            marker.tl = 0;
            marker.line = 0;
            marker.char = 0;
            return marker;
        }

        //Token builder
        const l = marker.sl,
            str = marker.str,
            IWS = marker.IWS;

        let length = marker.tl,
            off = marker.off + length,
            type = symbol$1,
            line = marker.line,
            base = off,
            char = marker.char,
            root = marker.off;

        if (off >= l) {
            length = 0;
            base = l;
            //char -= base - off;
            marker.char = char + (base - marker.off);
            marker.type = type;
            marker.off = base;
            marker.tl = 0;
            marker.line = line;
            return marker;
        }

        const USE_CUSTOM_SYMBOLS = !!this.symbol_map;
        let NORMAL_PARSE = true;

        if (USE_CUSTOM_SYMBOLS) {

            let code = str.charCodeAt(off);
            let off2 = off;
            let map = this.symbol_map,
                m;
            let i = 0;

            while (code == 32 && IWS)
                (code = str.charCodeAt(++off2), off++);

            while ((m = map.get(code))) {
                map = m;
                off2 += 1;
                code = str.charCodeAt(off2);
            }

            if (map.IS_SYM) {
                NORMAL_PARSE = false;
                base = off;
                length = off2 - off;
                //char += length;
            }
        }

        if (NORMAL_PARSE) {

            for (;;) {

                base = off;

                length = 1;

                const code = str.charCodeAt(off);

                if (code < 128) {

                    switch (jump_table$1[code]) {
                        case 0: //NUMBER
                            while (++off < l && (12 & number_and_identifier_table$1[str.charCodeAt(off)]));

                            if ((str[off] == "e" || str[off] == "E") && (12 & number_and_identifier_table$1[str.charCodeAt(off + 1)])) {
                                off++;
                                if (str[off] == "-") off++;
                                marker.off = off;
                                marker.tl = 0;
                                marker.next();
                                off = marker.off + marker.tl;
                                //Add e to the number string
                            }

                            type = number$2;
                            length = off - base;

                            break;
                        case 1: //IDENTIFIER
                            while (++off < l && ((10 & number_and_identifier_table$1[str.charCodeAt(off)])));
                            type = identifier$2;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol$1;
                            } else {
                                while (++off < l && str.charCodeAt(off) !== code);
                                type = string$3;
                                length = off - base + 1;
                            }
                            break;
                        case 3: //SPACE SET
                            while (++off < l && str.charCodeAt(off) === SPACE$1);
                            type = white_space$1;
                            length = off - base;
                            break;
                        case 4: //TAB SET
                            while (++off < l && str[off] === HORIZONTAL_TAB$1);
                            type = white_space$1;
                            length = off - base;
                            break;
                        case 5: //CARIAGE RETURN
                            length = 2;
                        case 6: //LINEFEED
                            //Intentional
                            type = new_line$1;
                            line++;
                            base = off;
                            root = off;
                            off += length;
                            char = 0;
                            break;
                        case 7: //SYMBOL
                            type = symbol$1;
                            break;
                        case 8: //OPERATOR
                            type = operator$2;
                            break;
                        case 9: //OPEN BRACKET
                            type = open_bracket$1;
                            break;
                        case 10: //CLOSE BRACKET
                            type = close_bracket$1;
                            break;
                        case 11: //Data Link Escape
                            type = data_link$1;
                            length = 4; //Stores two UTF16 values and a data link sentinel
                            break;
                    }
                }else{
                    break;
                }

                if (IWS && (type & white_space_new_line$1)) {
                    if (off < l) {
                        type = symbol$1;
                        //off += length;
                        continue;
                    } else {
                        //Trim white space from end of string
                        //base = l - off;
                        //marker.sl -= off;
                        //length = 0;
                    }
                }
                break;
            }
        }

        marker.type = type;
        marker.off = base;
        marker.tl = (this.masked_values & CHARACTERS_ONLY_MASK$1) ? Math.min(1, length) : length;
        marker.char = char + base - root;
        marker.line = line;
        return marker;
    }


    /**
     * Proxy for Lexer.prototype.assert
     * @public
     */
    a(text) {
        return this.assert(text);
    }

    /**
     * Compares the string value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assert(text) {

        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        if (this.text == text)
            this.next();
        else
            this.throw(`Expecting "${text}" got "${this.text}"`);

        return this;
    }

    /**
     * Proxy for Lexer.prototype.assertCharacter
     * @public
     */
    aC(char) { return this.assertCharacter(char) }
    /**
     * Compares the character value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assertCharacter(char) {

        if (this.off < 0) this.throw(`Expecting ${char[0]} got null`);

        if (this.ch == char[0])
            this.next();
        else
            this.throw(`Expecting "${char[0]}" got "${this.tx[this.off]}"`);

        return this;
    }

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
                this.p = new Lexer$1(this.str, false, true);
                peek_marker = this.p;
            }
        }
        peek_marker.masked_values = marker.masked_values;
        peek_marker.type = marker.type;
        peek_marker.off = marker.off;
        peek_marker.tl = marker.tl;
        peek_marker.char = marker.char;
        peek_marker.line = marker.line;
        this.next(peek_marker);
        return peek_marker;
    }


    /**
     * Proxy for Lexer.prototype.slice
     * @public
     */
    s(start) { return this.slice(start) }

    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | LexerBeta} start - The offset in this.str to begin the slice. If this value is a LexerBeta, sets the start point to the value of start.off.
     * @return {String} A substring of the parsed string.
     * @public
     */
    slice(start = this.off) {

        if (start instanceof Lexer$1) start = start.off;

        return this.str.slice(start, (this.off <= start) ? this.sl : this.off);
    }

    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof Lexer$1)) return marker;

        if (marker.ch == "/") {
            if (marker.pk.ch == "*") {
                marker.sync();
                while (!marker.END && (marker.next().ch != "*" || marker.pk.ch != "/")) { /* NO OP */ }
                marker.sync().assert("/");
            } else if (marker.pk.ch == "/") {
                const IWS = marker.IWS;
                while (marker.next().ty != Types$1.new_line && !marker.END) { /* NO OP */ }
                marker.IWS = IWS;
                marker.next();
            } else
            if (ASSERT) marker.throw("Expecting the start of a comment");
        }

        return marker;
    }

    setString(string, RESET = true) {
        this.str = string;
        this.sl = string.length;
        if (RESET) this.resetHead();
    }

    toString() {
        return this.slice();
    }

    /**
     * Returns new Whind Lexer that has leading and trailing whitespace characters removed from input. 
     * leave_leading_amount - Maximum amount of leading space caracters to leave behind. Default is zero
     * leave_trailing_amount - Maximum amount of trailing space caracters to leave behind. Default is zero
     */
    trim(leave_leading_amount = 0, leave_trailing_amount = leave_leading_amount) {
        const lex = this.copy();

        let space_count = 0,
            off = lex.off;

        for (; lex.off < lex.sl; lex.off++) {
            const c = jump_table$1[lex.string.charCodeAt(lex.off)];

            if (c > 2 && c < 7) {

                if (space_count >= leave_leading_amount) {
                    off++;
                } else {
                    space_count++;
                }
                continue;
            }

            break;
        }

        lex.off = off;
        space_count = 0;
        off = lex.sl;

        for (; lex.sl > lex.off; lex.sl--) {
            const c = jump_table$1[lex.string.charCodeAt(lex.sl - 1)];

            if (c > 2 && c < 7) {
                if (space_count >= leave_trailing_amount) {
                    off--;
                } else {
                    space_count++;
                }
                continue;
            }

            break;
        }

        lex.sl = off;

        if (leave_leading_amount > 0)
            lex.IWS = false;

        lex.token_length = 0;

        lex.next();

        return lex;
    }

    /** Adds symbol to symbol_map. This allows custom symbols to be defined and tokenized by parser. **/
    addSymbol(sym) {
        if (!this.symbol_map)
            this.symbol_map = new Map;


        let map = this.symbol_map;

        for (let i = 0; i < sym.length; i++) {
            let code = sym.charCodeAt(i);
            let m = map.get(code);
            if (!m) {
                m = map.set(code, new Map).get(code);
            }
            map = m;
        }
        map.IS_SYM = true;
    }

    /*** Getters and Setters ***/
    get string() {
        return this.str;
    }

    get string_length() {
        return this.sl - this.off;
    }

    set string_length(s) {}

    /**
     * The current token in the form of a new Lexer with the current state.
     * Proxy property for Lexer.prototype.copy
     * @type {Lexer}
     * @public
     * @readonly
     */
    get token() {
        return this.copy();
    }


    get ch() {
        return this.str[this.off];
    }

    /**
     * Proxy for Lexer.prototype.text
     * @public
     * @type {String}
     * @readonly
     */
    get tx() { return this.text }

    /**
     * The string value of the current token.
     * @type {String}
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
     * Proxy for Lexer.prototype.peek
     * @public
     * @readonly
     * @type {Lexer}
     */
    get pk() { return this.peek() }

    /**
     * Proxy for Lexer.prototype.next
     * @public
     */
    get n() { return this.next() }

    get END() { return this.off >= this.sl }
    set END(v) {}

    get type() {
        return 1 << (this.masked_values & TYPE_MASK$1);
    }

    set type(value) {
        //assuming power of 2 value.
        this.masked_values = (this.masked_values & ~TYPE_MASK$1) | ((getNumbrOfTrailingZeroBitsFromPowerOf2$1(value)) & TYPE_MASK$1);
    }

    get tl() {
        return this.token_length;
    }

    set tl(value) {
        this.token_length = value;
    }

    get token_length() {
        return ((this.masked_values & TOKEN_LENGTH_MASK$1) >> 7);
    }

    set token_length(value) {
        this.masked_values = (this.masked_values & ~TOKEN_LENGTH_MASK$1) | (((value << 7) | 0) & TOKEN_LENGTH_MASK$1);
    }

    get IGNORE_WHITE_SPACE() {
        return this.IWS;
    }

    set IGNORE_WHITE_SPACE(bool) {
        this.iws = !!bool;
    }

    get CHARACTERS_ONLY() {
        return !!(this.masked_values & CHARACTERS_ONLY_MASK$1);
    }

    set CHARACTERS_ONLY(boolean) {
        this.masked_values = (this.masked_values & ~CHARACTERS_ONLY_MASK$1) | ((boolean | 0) << 6);
    }

    get IWS() {
        return !!(this.masked_values & IGNORE_WHITESPACE_MASK$1);
    }

    set IWS(boolean) {
        this.masked_values = (this.masked_values & ~IGNORE_WHITESPACE_MASK$1) | ((boolean | 0) << 5);
    }

    get PARSE_STRING() {
        return !!(this.masked_values & PARSE_STRING_MASK$1);
    }

    set PARSE_STRING(boolean) {
        this.masked_values = (this.masked_values & ~PARSE_STRING_MASK$1) | ((boolean | 0) << 4);
    }

    /**
     * Reference to token id types.
     */
    get types() {
        return Types$1;
    }
}

Lexer$1.prototype.addCharacter = Lexer$1.prototype.addSymbol;

function whind$2(string, INCLUDE_WHITE_SPACE_TOKENS = false) { return new Lexer$1(string, INCLUDE_WHITE_SPACE_TOKENS) }

whind$2.constructor = Lexer$1;

Lexer$1.types = Types$1;
whind$2.types = Types$1;

class Color extends Float64Array {

    constructor(r, g, b, a = 0) {
        super(4);

        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;

        if (typeof(r) === "number") {
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
        );
    }

    mult(color) {
        if (typeof(color) == "number") {
            return new Color(
                this.r * color,
                this.g * color,
                this.b * color,
                this.a * color
            );
        } else {
            return new Color(
                this.r * color.r,
                this.g * color.g,
                this.b * color.b,
                this.a * color.a
            );
        }
    }

    sub(color) {
        return new Color(
            this.r - color.r,
            this.g - color.g,
            this.b - color.b,
            this.a - color.a
        );
    }

    lerp(to, t){
        return this.add(to.sub(this).mult(t));
    }

    toString() {
        return `rgba(${this.r|0},${this.g|0},${this.b|0},${this.a})`;
    }

    toJSON() {
        return `rgba(${this.r|0},${this.g|0},${this.b|0},${this.a})`;
    }

    copy(other){
        let out = new Color(other);
        return out;
    }
}

/*
    BODY {color: black; background: white }
    H1 { color: maroon }
    H2 { color: olive }
    EM { color: #f00 }              // #rgb //
    EM { color: #ff0000 }           // #rrggbb //
    EM { color: rgb(255,0,0) }      // integer range 0 - 255 //
    EM { color: rgb(100%, 0%, 0%) } // float range 0.0% - 100.0% //
*/
class CSS_Color extends Color {

    constructor(r, g, b, a) {
        super(r, g, b, a);

        if (typeof(r) == "string")
            this.set(CSS_Color._fs_(r) || {r:255,g:255,b:255,a:0});

    }

    static parse(l, rule, r) {

        let c = CSS_Color._fs_(l);

        if (c) {
            l.next();

            let color = new CSS_Color();

            color.set(c);

            return color;
        }

        return null;
    }
    static _verify_(l) {
        let c = CSS_Color._fs_(l, true);
        if (c)
            return true;
        return false;
    }
    /**
        Creates a new Color from a string or a Lexer.
    */
    static _fs_(l, v = false) {

        let c;

        if (typeof(l) == "string")
            l = whind$2(l);

        let out = { r: 0, g: 0, b: 0, a: 1 };

        switch (l.ch) {
            case "#":
                var value = l.next().tx;
                let num = parseInt(value,16);
                
                out = { r: 0, g: 0, b: 0, a: 1 };
                if(value.length == 3){
                    out.r = (num >> 8) & 0xF;
                    out.g = (num >> 4) & 0xF;
                    out.b = (num) & 0xF;
                }else{
                    if(value.length == 6){
                        out.r = (num >> 16) & 0xFF;
                        out.g = (num >> 8) & 0xFF;
                        out.b = (num) & 0xFF;
                    }if(value.length == 8){
                        out.r = (num >> 24) & 0xFF;
                        out.g = (num >> 16) & 0xFF;
                        out.b = (num >> 8) & 0xFF;
                        out.a = ((num) & 0xFF);
                    }
                }
                l.next();
                break;
            case "r":
                let tx = l.tx;
                if (tx == "rgba") {
                    out = { r: 0, g: 0, b: 0, a: 1 };
                    l.next(); // (
                    out.r = parseInt(l.next().tx);
                    l.next(); // ,
                    out.g = parseInt(l.next().tx);
                    l.next(); // ,
                    out.b = parseInt(l.next().tx);
                    l.next(); // ,
                    out.a = parseFloat(l.next().tx);
                    l.next();
                    c = new CSS_Color();
                    c.set(out);
                    return c;
                } else if (tx == "rgb") {
                    out = { r: 0, g: 0, b: 0, a: 1 };
                    l.next(); // (
                    out.r = parseInt(l.next().tx);
                    l.next(); // ,
                    out.g = parseInt(l.next().tx);
                    l.next(); // ,
                    out.b = parseInt(l.next().tx);
                    l.next();
                    c = new CSS_Color();
                    c.set(out);
                    return c;
                } // intentional
            default:
                let string = l.tx;

                if (l.ty == l.types.str)
                    string = string.slice(1, -1);

                out = CSS_Color.colors[string.toLowerCase()];
        }

        return out;
    }
} {

    let _$ = (r = 0, g = 0, b = 0, a = 1) => ({ r, g, b, a });
    let c = _$(0, 255, 25);
    CSS_Color.colors = {
        "alice blue": _$(240, 248, 255),
        "antique white": _$(250, 235, 215),
        "aqua marine": _$(127, 255, 212),
        "aqua": c,
        "azure": _$(240, 255, 255),
        "beige": _$(245, 245, 220),
        "bisque": _$(255, 228, 196),
        "black": _$(),
        "blanched almond": _$(255, 235, 205),
        "blue violet": _$(138, 43, 226),
        "blue": _$(0, 0, 255),
        "brown": _$(165, 42, 42),
        "burly wood": _$(222, 184, 135),
        "cadet blue": _$(95, 158, 160),
        "chart reuse": _$(127, 255),
        "chocolate": _$(210, 105, 30),
        "clear": _$(255, 255, 255),
        "coral": _$(255, 127, 80),
        "corn flower blue": _$(100, 149, 237),
        "corn silk": _$(255, 248, 220),
        "crimson": _$(220, 20, 60),
        "cyan": c,
        "dark blue": _$(0, 0, 139),
        "dark cyan": _$(0, 139, 139),
        "dark golden rod": _$(184, 134, 11),
        "dark gray": _$(169, 169, 169),
        "dark green": _$(0, 100),
        "dark khaki": _$(189, 183, 107),
        "dark magenta": _$(139, 0, 139),
        "dark olive green": _$(85, 107, 47),
        "dark orange": _$(255, 140),
        "dark orchid": _$(153, 50, 204),
        "dark red": _$(139),
        "dark salmon": _$(233, 150, 122),
        "dark sea green": _$(143, 188, 143),
        "dark slate blue": _$(72, 61, 139),
        "dark slate gray": _$(47, 79, 79),
        "dark turquoise": _$(0, 206, 209),
        "dark violet": _$(148, 0, 211),
        "deep pink": _$(255, 20, 147),
        "deep sky blue": _$(0, 191, 255),
        "dim gray": _$(105, 105, 105),
        "dodger blue": _$(30, 144, 255),
        "firebrick": _$(178, 34, 34),
        "floral white": _$(255, 250, 240),
        "forest green": _$(34, 139, 34),
        "fuchsia": _$(255, 0, 255),
        "gainsboro": _$(220, 220, 220),
        "ghost white": _$(248, 248, 255),
        "gold": _$(255, 215),
        "golden rod": _$(218, 165, 32),
        "gray": _$(128, 128, 128),
        "green yellow": _$(173, 255, 47),
        "green": _$(0, 128),
        "honeydew": _$(240, 255, 240),
        "hot pink": _$(255, 105, 180),
        "indian red": _$(205, 92, 92),
        "indigo": _$(75, 0, 130),
        "ivory": _$(255, 255, 240),
        "khaki": _$(240, 230, 140),
        "lavender blush": _$(255, 240, 245),
        "lavender": _$(230, 230, 250),
        "lawn green": _$(124, 252),
        "lemon chiffon": _$(255, 250, 205),
        "light blue": _$(173, 216, 230),
        "light coral": _$(240, 128, 128),
        "light cyan": _$(224, 255, 255),
        "light golden rod yellow": _$(250, 250, 210),
        "light gray": _$(211, 211, 211),
        "light green": _$(144, 238, 144),
        "light pink": _$(255, 182, 193),
        "light salmon": _$(255, 160, 122),
        "light sea green": _$(32, 178, 170),
        "light sky blue": _$(135, 206, 250),
        "light slate gray": _$(119, 136, 153),
        "light steel blue": _$(176, 196, 222),
        "light yellow": _$(255, 255, 224),
        "lime green": _$(50, 205, 50),
        "lime": _$(0, 255),
        "lime": _$(0, 255),
        "linen": _$(250, 240, 230),
        "magenta": _$(255, 0, 255),
        "maroon": _$(128),
        "medium aqua marine": _$(102, 205, 170),
        "medium blue": _$(0, 0, 205),
        "medium orchid": _$(186, 85, 211),
        "medium purple": _$(147, 112, 219),
        "medium sea green": _$(60, 179, 113),
        "medium slate blue": _$(123, 104, 238),
        "medium spring green": _$(0, 250, 154),
        "medium turquoise": _$(72, 209, 204),
        "medium violet red": _$(199, 21, 133),
        "midnight blue": _$(25, 25, 112),
        "mint cream": _$(245, 255, 250),
        "misty rose": _$(255, 228, 225),
        "moccasin": _$(255, 228, 181),
        "navajo white": _$(255, 222, 173),
        "navy": _$(0, 0, 128),
        "old lace": _$(253, 245, 230),
        "olive drab": _$(107, 142, 35),
        "olive": _$(128, 128),
        "orange red": _$(255, 69),
        "orange": _$(255, 165),
        "orchid": _$(218, 112, 214),
        "pale golden rod": _$(238, 232, 170),
        "pale green": _$(152, 251, 152),
        "pale turquoise": _$(175, 238, 238),
        "pale violet red": _$(219, 112, 147),
        "papaya whip": _$(255, 239, 213),
        "peach puff": _$(255, 218, 185),
        "peru": _$(205, 133, 63),
        "pink": _$(255, 192, 203),
        "plum": _$(221, 160, 221),
        "powder blue": _$(176, 224, 230),
        "purple": _$(128, 0, 128),
        "red": _$(255),
        "rosy brown": _$(188, 143, 143),
        "royal blue": _$(65, 105, 225),
        "saddle brown": _$(139, 69, 19),
        "salmon": _$(250, 128, 114),
        "sandy brown": _$(244, 164, 96),
        "sea green": _$(46, 139, 87),
        "sea shell": _$(255, 245, 238),
        "sienna": _$(160, 82, 45),
        "silver": _$(192, 192, 192),
        "sky blue": _$(135, 206, 235),
        "slate blue": _$(106, 90, 205),
        "slate gray": _$(112, 128, 144),
        "snow": _$(255, 250, 250),
        "spring green": _$(0, 255, 127),
        "steel blue": _$(70, 130, 180),
        "tan": _$(210, 180, 140),
        "teal": _$(0, 128, 128),
        "thistle": _$(216, 191, 216),
        "tomato": _$(255, 99, 71),
        "transparent": _$(0, 0, 0, 0),
        "turquoise": _$(64, 224, 208),
        "violet": _$(238, 130, 238),
        "wheat": _$(245, 222, 179),
        "white smoke": _$(245, 245, 245),
        "white": _$(255, 255, 255),
        "yellow green": _$(154, 205, 50),
        "yellow": _$(255, 255)
    };
}

class CSS_Percentage extends Number {
    
    static parse(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;

        if (l.ty == l.types.num || tx == "-" && pky == l.types.num) {
            let mult = 1;

            if (l.ch == "-") {
                mult = -1;
                tx = l.p.tx;
                l.p.next();
            }

            if (l.p.ch == "%") {
                l.sync().next();
                return new CSS_Percentage(parseFloat(tx) * mult);
            }
        }
        return null;
    }

    constructor(v) {

        if (typeof(v) == "string") {
            let lex = whind(v);
            let val = CSS_Percentage.parse(lex);
            if (val) 
                return val;
        }
        
        super(v);
    }

    static _verify_(l) {
        if(typeof(l) == "string" &&  !isNaN(parseInt(l)) && l.includes("%"))
            return true;
        return false;
    }

    toJSON() {
        return super.toString() + "%";
    }

    toString(radix) {
        return super.toString(radix) + "%";
    }

    get str() {
        return this.toString();
    }

    lerp(to, t) {
        return new CSS_Percentage(this + (to - this) * t);
    }

    copy(other){
        return new CSS_Percentage(other);
    }

    get type(){
        return "%";
    }
}

class CSS_Length extends Number {
    static parse(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;
        if (l.ty == l.types.num || tx == "-" && pky == l.types.num) {
            let mult = 1;
            if (l.ch == "-") {
                mult = -1;
                tx = l.p.tx;
                l.p.next();
            }
            if (l.p.ty == l.types.id) {
                let id = l.sync().tx;
                l.next();
                return new CSS_Length(parseFloat(tx) * mult, id);
            }
        }
        return null;
    }

    static _verify_(l) {
        if (typeof(l) == "string" && !isNaN(parseInt(l)) && !l.includes("%")) return true;
        return false;
    }

    constructor(v, u = "") {
        
        if (typeof(v) == "string") {
            let lex = whind$2(v);
            let val = CSS_Length.parse(lex);
            if (val) return val;
        }

        if(u){
            switch(u){
                //Absolute
                case "px": return new PXLength(v);
                case "mm": return new MMLength(v);
                case "cm": return new CMLength(v);
                case "in": return new INLength(v);
                case "pc": return new PCLength(v);
                case "pt": return new PTLength(v);
                
                //Relative
                case "ch": return new CHLength(v);
                case "em": return new EMLength(v);
                case "ex": return new EXLength(v);
                case "rem": return new REMLength(v);

                //View Port
                case "vh": return new VHLength(v);
                case "vw": return new VWLength(v);
                case "vmin": return new VMINLength(v);
                case "vmax": return new VMAXLength(v);

                //Deg
                case "deg": return new DEGLength(v);

                case "%" : return new CSS_Percentage(v);
            }
        }

        super(v);
    }

    get milliseconds() {
        switch (this.unit) {
            case ("s"):
                return parseFloat(this) * 1000;
        }
        return parseFloat(this);
    }

    toString(radix) {
        return super.toString(radix) + "" + this.unit;
    }

    toJSON() {
        return super.toString() + "" + this.unit;
    }

    get str() {
        return this.toString();
    }

    lerp(to, t) {
        return new CSS_Length(this + (to - this) * t, this.unit);
    }

    copy(other) {
        return new CSS_Length(other, this.unit);
    }

    set unit(t){}
    get unit(){return "";}
}

class PXLength extends CSS_Length {
    get unit(){return "px";}
}
class MMLength extends CSS_Length {
    get unit(){return "mm";}
}
class CMLength extends CSS_Length {
    get unit(){return "cm";}
}
class INLength extends CSS_Length {
    get unit(){return "in";}
}
class PTLength extends CSS_Length {
    get unit(){return "pt";}
}
class PCLength extends CSS_Length {
    get unit(){return "pc";}
}
class CHLength extends CSS_Length {
    get unit(){return "ch";}
}
class EMLength extends CSS_Length {
    get unit(){return "em";}
}
class EXLength extends CSS_Length {
    get unit(){return "ex";}
}
class REMLength extends CSS_Length {
    get unit(){return "rem";}
}
class VHLength extends CSS_Length {
    get unit(){return "vh";}
}
class VWLength extends CSS_Length {
    get unit(){return "vw";}
}
class VMINLength extends CSS_Length {
    get unit(){return "vmin";}
}
class VMAXLength extends CSS_Length {
    get unit(){return "vmax";}
}
class DEGLength extends CSS_Length {
    get unit(){return "deg";}
}

const uri_reg_ex$1 = /(?:([^\:\?\[\]\@\/\#\b\s][^\:\?\[\]\@\/\#\b\s]*)(?:\:\/\/))?(?:([^\:\?\[\]\@\/\#\b\s][^\:\?\[\]\@\/\#\b\s]*)(?:\:([^\:\?\[\]\@\/\#\b\s]*)?)?\@)?(?:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((?:\[[0-9a-f]{1,4})+(?:\:[0-9a-f]{0,4}){2,7}\])|([^\:\?\[\]\@\/\#\b\s\.]{2,}(?:\.[^\:\?\[\]\@\/\#\b\s]*)*))?(?:\:(\d+))?((?:[^\?\[\]\#\s\b]*)+)?(?:\?([^\[\]\#\s\b]*))?(?:\#([^\#\s\b]*))?/i;

const STOCK_LOCATION$1 = {
    protocol: "",
    host: "",
    port: "",
    path: "",
    hash: "",
    query: "",
    search: ""
};
function fetchLocalText$1(URL, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "GET"
        }).then(r => {

            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.text().then(res);
        }).catch(e => rej(e));
    });
}

function fetchLocalJSON$1(URL, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "GET"
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res).catch(rej);
        }).catch(e => rej(e));
    });
}

function submitForm$1(URL, form_data, m = "same-origin") {
    return new Promise((res, rej) => {
        var form;

        if (form_data instanceof FormData)
            form = form_data;
        else {
            form = new FormData();
            for (let name in form_data)
                form.append(name, form_data[name] + "");
        }

        fetch(URL, {
            mode: m, // CORs not allowed
            credentials: m,
            method: "POST",
            body: form,
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}

function submitJSON$1(URL, json_data, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: m, // CORs not allowed
            credentials: m,
            method: "POST",
            body: JSON.stringify(json_data),
        }).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}



/**
 * Used for processing URLs, handling `document.location`, and fetching data.
 * @param      {string}   url           The URL string to wrap.
 * @param      {boolean}  USE_LOCATION  If `true` missing URL parts are filled in with data from `document.location`. 
 * @return     {URL}   If a falsy value is passed to `url`, and `USE_LOCATION` is `true` a Global URL is returned. This is directly linked to the page and will _update_ the actual page URL when its values are change. Use with caution. 
 * @alias URL
 * @memberof module:wick.core.network
 */
class URL$1 {

    static resolveRelative(URL_or_url_new, URL_or_url_original = document.location.toString(), ) {

        let URL_old = (URL_or_url_original instanceof URL$1) ? URL_or_url_original : new URL$1(URL_or_url_original);
        let URL_new = (URL_or_url_new instanceof URL$1) ? URL_or_url_new : new URL$1(URL_or_url_new);
        
        if (!(URL_old + "") || !(URL_new + "")) return null;

        let new_path = "";
        if (URL_new.path[0] != "/") {

            let a = URL_old.path.split("/");
            let b = URL_new.path.split("/");


            if (b[0] == "..") a.splice(a.length - 1, 1);
            for (let i = 0; i < b.length; i++) {
                switch (b[i]) {
                    case "..":
                    case ".":
                        a.splice(a.length - 1, 1);
                        break;
                    default:
                        a.push(b[i]);
                }
            }
            URL_new.path = a.join("/");
        }

        return URL_new;
    }

    constructor(url = "", USE_LOCATION = false) {

        let IS_STRING = true,
            IS_LOCATION = false;


        let location = (typeof(document) !== "undefined") ? document.location : STOCK_LOCATION$1;

        if (typeof(Location) !== "undefined" && url instanceof Location) {
            location = url;
            url = "";
            IS_LOCATION = true;
        }
        if (!url || typeof(url) != "string") {
            IS_STRING = false;
            IS_LOCATION = true;
            if (URL$1.GLOBAL && USE_LOCATION)
                return URL$1.GLOBAL;
        }

        /**
         * URL protocol
         */
        this.protocol = "";

        /**
         * Username string
         */
        this.user = "";

        /**
         * Password string
         */
        this.pwd = "";

        /**
         * URL hostname
         */
        this.host = "";

        /**
         * URL network port number.
         */
        this.port = 0;

        /**
         * URL resource path
         */
        this.path = "";

        /**
         * URL query string.
         */
        this.query = "";

        /**
         * Hashtag string
         */
        this.hash = "";

        /**
         * Map of the query data
         */
        this.map = null;

        if (IS_STRING) {
            if (url instanceof URL$1) {
                this.protocol = url.protocol;
                this.user = url.user;
                this.pwd = url.pwd;
                this.host = url.host;
                this.port = url.port;
                this.path = url.path;
                this.query = url.query;
                this.hash = url.hash;
            } else {
                let part = url.match(uri_reg_ex$1);

                //If the complete string is not matched than we are dealing with something other 
                //than a pure URL. Thus, no object is returned. 
                if (part[0] !== url) return null;

                this.protocol = part[1] || ((USE_LOCATION) ? location.protocol : "");
                this.user = part[2] || "";
                this.pwd = part[3] || "";
                this.host = part[4] || part[5] || part[6] || ((USE_LOCATION) ? location.hostname : "");
                this.port = parseInt(part[7] || ((USE_LOCATION) ? location.port : 0));
                this.path = part[8] || ((USE_LOCATION) ? location.pathname : "");
                this.query = part[9] || ((USE_LOCATION) ? location.search.slice(1) : "");
                this.hash = part[10] || ((USE_LOCATION) ? location.hash.slice(1) : "");

            }
        } else if (IS_LOCATION) {
            this.protocol = location.protocol.replace(/\:/g, "");
            this.host = location.hostname;
            this.port = location.port;
            this.path = location.pathname;
            this.hash = location.hash.slice(1);
            this.query = location.search.slice(1);
            this._getQuery_(this.query);

            if (USE_LOCATION) {
                URL$1.G = this;
                return URL$1.R;
            }
        }
        this._getQuery_(this.query);
    }


    /**
    URL Query Syntax

    root => [root_class] [& [class_list]]
         => [class_list]

    root_class = key_list

    class_list [class [& key_list] [& class_list]]

    class => name & key_list

    key_list => [key_val [& key_list]]

    key_val => name = val

    name => ALPHANUMERIC_ID

    val => NUMBER
        => ALPHANUMERIC_ID
    */

    /**
     * Pulls query string info into this.map
     * @private
     */
    _getQuery_() {
        let map = (this.map) ? this.map : (this.map = new Map());

        let lex = whind$2(this.query);


        const get_map = (k, m) => (m.has(k)) ? m.get(k) : m.set(k, new Map).get(k);

        let key = 0,
            key_val = "",
            class_map = get_map(key_val, map),
            lfv = 0;

        while (!lex.END) {
            switch (lex.tx) {
                case "&": //At new class or value
                    if (lfv > 0)
                        key = (class_map.set(key_val, lex.s(lfv)), lfv = 0, lex.n.pos);
                    else {
                        key_val = lex.s(key);
                        key = (class_map = get_map(key_val, map), lex.n.pos);
                    }
                    continue;
                case "=":
                    //looking for a value now
                    key_val = lex.s(key);
                    lfv = lex.n.pos;
                    continue;
            }
            lex.n;
        }

        if (lfv > 0) class_map.set(key_val, lex.s(lfv));
    }

    setPath(path) {

        this.path = path;

        return new URL$1(this);
    }

    setLocation() {
        history.replaceState({}, "replaced state", `${this}`);
        window.onpopstate();
    }

    toString() {
        let str = [];

        if (this.host) {

            if (this.protocol)
                str.push(`${this.protocol}://`);

            str.push(`${this.host}`);
        }

        if (this.port)
            str.push(`:${this.port}`);

        if (this.path)
            str.push(`${this.path[0] == "/" ? "" : "/"}${this.path}`);

        if (this.query)
            str.push(((this.query[0] == "?" ? "" : "?") + this.query));

        if (this.hash)
            str.push("#" + this.hash);


        return str.join("");
    }

    /**
     * Pulls data stored in query string into an object an returns that.
     * @param      {string}  class_name  The class name
     * @return     {object}  The data.
     */
    getData(class_name = "") {
        if (this.map) {
            let out = {};
            let _c = this.map.get(class_name);
            if (_c) {
                for (let [key, val] of _c.entries())
                    out[key] = val;
                return out;
            }
        }
        return null;
    }

    /**
     * Sets the data in the query string. Wick data is added after a second `?` character in the query field, and appended to the end of any existing data.
     * @param      {string}  class_name  Class name to use in query string. Defaults to root, no class 
     * @param      {object | Model | AnyModel}  data        The data
     */
    setData(data = null, class_name = "") {

        if (data) {

            let map = this.map = new Map();

            let store = (map.has(class_name)) ? map.get(class_name) : (map.set(class_name, new Map()).get(class_name));

            //If the data is a falsy value, delete the association.

            for (let n in data) {
                if (data[n] !== undefined && typeof data[n] !== "object")
                    store.set(n, data[n]);
                else
                    store.delete(n);
            }

            //set query
            let class_, null_class, str = "";

            if ((null_class = map.get(""))) {
                if (null_class.size > 0) {
                    for (let [key, val] of null_class.entries())
                        str += `&${key}=${val}`;

                }
            }

            for (let [key, class_] of map.entries()) {
                if (key === "")
                    continue;
                if (class_.size > 0) {
                    str += `&${key}`;
                    for (let [key, val] of class_.entries())
                        str += `&${key}=${val}`;
                }
            }

            str = str.slice(1);

            this.query = this.query.split("?")[0] + "?" + str;

            if (URL$1.G == this)
                this.goto();
        } else {
            this.query = "";
        }

        return this;

    }

    /**
     * Fetch a string value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchText(ALLOW_CACHE = true) {

        if (ALLOW_CACHE) {

            let resource = URL$1.RC.get(this.path);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalText$1(this.path).then(res => (URL$1.RC.set(this.path, res), res));
    }

    /**
     * Fetch a JSON value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchJSON(ALLOW_CACHE = true) {

        let string_url = this.toString();

        if (ALLOW_CACHE) {

            let resource = URL$1.RC.get(string_url);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalJSON$1(string_url).then(res => (URL$1.RC.set(this.path, res), res));
    }

    /**
     * Cache a local resource at the value 
     * @param    {object}  resource  The resource to store at this URL path value.
     * @returns {boolean} `true` if a resource was already cached for this URL, false otherwise.
     */
    cacheResource(resource) {

        let occupied = URL$1.RC.has(this.path);

        URL$1.RC.set(this.path, resource);

        return occupied;
    }

    submitForm(form_data) {
        return submitForm$1(this.toString(), form_data);
    }

    submitJSON(json_data, mode) {
        return submitJSON$1(this.toString(), json_data, mode);
    }
    /**
     * Goes to the current URL.
     */
    goto() {
        return;
        let url = this.toString();
        history.pushState({}, "ignored title", url);
        window.onpopstate();
        URL$1.G = this;
    }
    //Returns the last segment of the path
    get file(){
        return this.path.split("/").pop();
    }


    //Returns the all but the last segment of the path
    get dir(){
        return this.path.split("/").slice(0,-1).join("/") || "/";
    }

    get pathname() {
        return this.path;
    }

    get href() {
        return this.toString();
    }

    get ext() {
        const m = this.path.match(/\.([^\.]*)$/);
        return m ? m[1] : "";
    }
}

/**
 * The fetched resource cache.
 */
URL$1.RC = new Map();

/**
 * The Default Global URL object. 
 */
URL$1.G = null;

/**
 * The Global object Proxy.
 */
URL$1.R = {
    get protocol() {
        return URL$1.G.protocol;
    },
    set protocol(v) {
        return;
        URL$1.G.protocol = v;
    },
    get user() {
        return URL$1.G.user;
    },
    set user(v) {
        return;
        URL$1.G.user = v;
    },
    get pwd() {
        return URL$1.G.pwd;
    },
    set pwd(v) {
        return;
        URL$1.G.pwd = v;
    },
    get host() {
        return URL$1.G.host;
    },
    set host(v) {
        return;
        URL$1.G.host = v;
    },
    get port() {
        return URL$1.G.port;
    },
    set port(v) {
        return;
        URL$1.G.port = v;
    },
    get path() {
        return URL$1.G.path;
    },
    set path(v) {
        return;
        URL$1.G.path = v;
    },
    get query() {
        return URL$1.G.query;
    },
    set query(v) {
        return;
        URL$1.G.query = v;
    },
    get hash() {
        return URL$1.G.hash;
    },
    set hash(v) {
        return;
        URL$1.G.hash = v;
    },
    get map() {
        return URL$1.G.map;
    },
    set map(v) {
        return;
        URL$1.G.map = v;
    },
    setPath(path) {
        return URL$1.G.setPath(path);
    },
    setLocation() {
        return URL$1.G.setLocation();
    },
    toString() {
        return URL$1.G.toString();
    },
    getData(class_name = "") {
        return URL$1.G.getData(class_name = "");
    },
    setData(class_name = "", data = null) {
        return URL$1.G.setData(class_name, data);
    },
    fetchText(ALLOW_CACHE = true) {
        return URL$1.G.fetchText(ALLOW_CACHE);
    },
    cacheResource(resource) {
        return URL$1.G.cacheResource(resource);
    }
};


/** Implement Basic Fetch Mechanism for NodeJS **/
if (typeof(fetch) == "undefined" && typeof(global) !== "undefined") {
    (async () => {
        console.log("Moonshot");
        
        global.fetch = (url, data) =>
            new Promise(async (res, rej) => {
                let p = await path.resolve(process.cwd(), (url[0] == ".") ? url + "" : "." + url);
                try {
                    let data = await fs.readFile(p, "utf8");
                    return res({
                        status: 200,
                        text: () => {
                            return {
                                then: (f) => f(data)
                            }
                        }
                    })
                } catch (err) {
                    return rej(err);
                }
            });
    })();
}


let SIMDATA$1 = null;

/* Replaces the fetch actions with functions that simulate network fetches. Resources are added by the user to a Map object. */
URL$1.simulate = function(){
    SIMDATA$1 = new Map;
    URL$1.prototype.fetchText = async d => ((d = this.toString()), SIMDATA$1.get(d)) ? SIMDATA$1.get(d) : "" ;
    URL$1.prototype.fetchJSON = async d => ((d = this.toString()), SIMDATA$1.get(d)) ? JSON.parse(SIMDATA$1.get(d).toString()) : {} ;
};

//Allows simulated resources to be added as a key value pair, were the key is a URI string and the value is string data.
URL$1.addResource = (n,v) => (n && v && (SIMDATA$1 || (SIMDATA$1 = new Map())) && SIMDATA$1.set(n.toString(), v.toString));

URL$1.polyfill = function() {    if (typeof(global) !== "undefined") {
    console.log("AAAAAAAAAAAAAAAAAAAAAA");
        const fs = (Promise.resolve(require('fs'))).promises;
        const path = (Promise.resolve(require('path')));


        global.Location =  (class extends URL$1{});
        
        global.document = global.document || {};

        global.document.location = new URL$1(process.env.PWD);
        /**
         * Global `fetch` polyfill - basic support
         */
        global.fetch = (url, data) =>
            new Promise((res, rej) => {
                let p = path.resolve(process.cwd(), (url[0] == ".") ? url + "" : "." + url);
                fs.readFile(p, "utf8", (err, data) => {
                    if (err) {
                        rej(err);
                    } else {
                        res({
                            status: 200,
                            text: () => {
                                return {
                                    then: (f) => f(data)
                                }
                            }
                        });
                    }
                });
            });
    }
};

Object.freeze(URL$1.R);
Object.freeze(URL$1.RC);
Object.seal(URL$1);

class CSS_URL extends URL$1 {
    static parse(l, rule, r) {
        if (l.tx == "url" || l.tx == "uri") {
            l.next().a("(");
            let v = "";
            if (l.ty == l.types.str) {
                v = l.tx.slice(1,-1);
                l.next().a(")");
            } else {
                let p = l.p;
                while (!p.END && p.next().tx !== ")") { /* NO OP */ }
                v = p.slice(l);
                l.sync().a(")");
            }
            return new CSS_URL(v);
        } if (l.ty == l.types.str){
            let v = l.tx.slice(1,-1);
            l.next();
            return new CSS_URL(v);
        }

        return null;
    }
}

class CSS_String extends String {
    static parse(l, rule, r) {
        if (l.ty == l.types.str) {
            let tx = l.tx;
            l.next();
            return new CSS_String(tx);
        }
        return null;
    }
}

class CSS_Id extends String {
    static parse(l, rule, r) {
        if (l.ty == l.types.id) {
            let tx = l.tx;
            l.next();
            return new CSS_Id(tx);
        }
        return null;
    }
}

/* https://www.w3.org/TR/css-shapes-1/#typedef-basic-shape */
class CSS_Shape extends Array {
    static parse(l, rule, r) {
        if (l.tx == "inset" || l.tx == "circle" || l.tx == "ellipse" || l.tx == "polygon") {
            l.next().a("(");
            let v = "";
            if (l.ty == l.types.str) {
                v = l.tx.slice(1,-1);
                l.next().a(")");
            } else {
                let p = l.p;
                while (!p.END && p.next().tx !== ")") { /* NO OP */ }
                v = p.slice(l);
                l.sync().a(")");
            }
            return new CSS_Shape(v);
        }
        return null;
    }
}

class CSS_Number extends Number {
    static parse(l, rule, r) {
        let tx = l.tx;
        if(l.ty == l.types.num){
            l.next();
            return new CSS_Number(tx);
        }
        return null;
    }
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

const sqrt = Math.sqrt;
const cos = Math.cos;
const acos = Math.acos;
const PI = Math.PI; 
const pow = Math.pow;

// A helper function to filter for values in the [0,1] interval:
function accept(t) {
  return 0<=t && t <=1;
}

// A real-cuberoots-only function:
function cuberoot(v) {
  if(v<0) return -pow(-v,1/3);
  return pow(v,1/3);
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
		Acquired from : https://pomax.github.io/bezierinfo/
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
			return [root2, root1];
		}

		// one real root, two complex roots
		var sd = sqrt(discriminant);
		u1 = cuberoot(sd - q2);
		v1 = cuberoot(sd + q2);
		root1 = u1 - v1 - a / 3;
		return [root1];
	}

	rootsY() {
		return this.roots(this[1],this[3],this[5],this[7]);
	}

	rootsX() {
		return this.roots(this[0],this[2],this[4],this[6]);
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

function curvePoint(curve, t) {
    var point = {
        x: 0,
        y: 0
    };
    point.x = posOnCurve(t, curve[0], curve[2], curve[4]);
    point.y = posOnCurve(t, curve[1], curve[3], curve[5]);
    return point;
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

    if (b == 0) {} else if (Math.abs(a) < 0.00000000005) {
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

    rootsX() {
        return this.roots(
            this.x1,
            this.x2,
            this.x3
        )

    }

    roots(p1, p2, p3) {
        var curve = this.toArray();

        var c = p1 - (2 * p2) + p3;
        var b = 2 * (p2 - p1);
        var a = p1;
        var a2 = a * 2;
        var sqrt = Math.sqrt(b * b - (a * 4 * c));
        var t1 = (-b + sqrt) / a2;
        var t2 = (-b - sqrt) / a2;

        return [t1, t2];
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

        return [t1, t2];
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

class CSS_Bezier extends CBezier {
	static parse(l, rule, r) {

		let out = null;

		switch(l.tx){
			case "cubic":
				l.next().a("(");
				let v1 = parseFloat(l.tx);
				let v2 = parseFloat(l.next().a(",").tx);
				let v3 = parseFloat(l.next().a(",").tx);
				let v4 = parseFloat(l.next().a(",").tx);
				l.a(")");
				out = new CSS_Bezier(v1, v2, v3, v4);
				break;
			case "ease":
				l.next();
				out = new CSS_Bezier(0.25, 0.1, 0.25, 1);
				break;
			case "ease-in":
				l.next();
				out = new CSS_Bezier(0.42, 0, 1, 1);
				break;
			case "ease-out":
				l.next();
				out = new CSS_Bezier(0, 0, 0.58, 1);
				break;
			case "ease-in-out":
				l.next();
				out = new CSS_Bezier(0.42, 0, 0.58, 1);
				break;
		}

		return out;
	}
}

class Stop{
    constructor(color, percentage){
        this.color = color;
        this.percentage = percentage || null;
    }

    toString(){
        return `${this.color}${(this.percentage)?" "+this.percentage:""}`;
    }
}

class CSS_Gradient{

    static parse(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;
        if (l.ty == l.types.id) {
            switch(l.tx){
                case "linear-gradient":
                l.next().a("(");
                let dir,num,type ="deg";
                if(l.tx == "to"){

                }else if(l.ty == l.types.num){
                    num = parseFloat(l.ty);
                    type = l.next().tx;
                    l.next().a(',');
                }

                let stops = [];
                
                while(!l.END && l.ch != ")"){
                    let v = CSS_Color.parse(l, rule, r);
                    let len = null;

                    if(l.ch == ")") {
                        stops.push(new Stop(v, len));
                        break;
                    }
                    
                    if(l.ch != ","){
                        if(!(len = CSS_Length.parse(l, rule, r)))
                            len = CSS_Percentage.parse(l,rule,r);
                    }else
                        l.next();
                    

                    stops.push(new Stop(v, len));
                }
                l.a(")");
                let grad = new CSS_Gradient();
                grad.stops = stops;
                return grad;
            }
        }
        return null;
    }


    constructor(type = 0){
        this.type = type; //linear gradient
        this.direction = new CSS_Length(0, "deg");
        this.stops = [];
    }

    toString(){
        let str = [];
        switch(this.type){
            case 0:
            str.push("linear-gradient(");
            if(this.direction !== 0)
                str.push(this.direction.toString() + ",");
            break;
        }

        for(let i = 0; i < this.stops.length; i++)
            str.push(this.stops[i].toString()+((i<this.stops.length-1)?",":""));

        str.push(")");

        return str.join(" ");
    }
}

const $medh = (prefix) => ({
    parse: (l, r, a, n = 0) => (n = CSS_Length.parse(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.innerHeight <= n : (win) => win.innerHeight >= n) : (win) => win.screen.height == n)
});


const $medw = (prefix) => ({
    parse: (l, r, a, n = 0) => 
        (n = CSS_Length.parse(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.innerWidth >= n : (win) => win.innerWidth <= n) : (win) => win.screen.width == n)
});

function CSS_Media_handle(type, prefix) {
    switch (type) {
        case "h":
            return $medh(prefix);
        case "w":
            return $medw(prefix);
    }

    return {
        parse: function(a, b, c) {
            debugger;
        }
    };
}

function getValue(lex, attribute) {
    let v = lex.tx,
        mult = 1;

    if (v == "-")
        v = lex.n.tx, mult = -1;

    let n = parseFloat(v) * mult;

    lex.next();

    if (lex.ch !== ")" && lex.ch !== ",") {
        switch (lex.tx) {
            case "%":
                break;

            /* Rotational Values */
            case "grad":
                n *= Math.PI / 200;
                break;
            case "deg":
                n *= Math.PI / 180;
                break;
            case "turn":
                n *= Math.PI * 2;
                break;
            case "px":
                break;
            case "em":
                break;
        }
        lex.next();
    }
    return n;
}

function ParseString(string, transform) {
    var lex = whind$2(string);
    
    while (!lex.END) {
        let tx = lex.tx;
        lex.next();
        switch (tx) {
            case "matrix":

                let a = getValue(lex.a("(")),
                    b = getValue(lex.a(",")),
                    c = getValue(lex.a(",")),
                    d = getValue(lex.a(",")),
                    r = -Math.atan2(b, a),
                    sx1 = (a / Math.cos(r)) || 0,
                    sx2 = (b / -Math.sin(r)) || 0,
                    sy1 = (c / Math.sin(r)) || 0,
                    sy2 = (d / Math.cos(r)) || 0;
                
                if(sx2 !== 0)
                    transform.sx = (sx1 + sx2) * 0.5;
                else
                    transform.sx = sx1;

                if(sy1 !== 0)
                    transform.sy = (sy1 + sy2) * 0.5;
                else
                    transform.sy = sy2;

                transform.px = getValue(lex.a(","));
                transform.py = getValue(lex.a(","));
                transform.r = r;
                lex.a(")");
                break;
            case "matrix3d":
                break;
            case "translate":
                transform.px = getValue(lex.a("("), "left");
                lex.a(",");
                transform.py = getValue(lex, "left");
                lex.a(")");
                continue;
            case "translateX":
                transform.px = getValue(lex.a("("), "left");
                lex.a(")");
                continue;
            case "translateY":
                transform.py = getValue(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scale":
                transform.sx = getValue(lex.a("("), "left");
                if(lex.ch ==","){
                    lex.a(",");
                    transform.sy = getValue(lex, "left");
                }
                else transform.sy = transform.sx;
                lex.a(")");
                continue;
            case "scaleX":
                transform.sx = getValue(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scaleY":
                transform.sy = getValue(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scaleZ":
                break;
            case "rotate":
                transform.r = getValue(lex.a("("));
                lex.a(")");
                continue;
            case "rotateX":
                break;
            case "rotateY":
                break;
            case "rotateZ":
                break;
            case "rotate3d":
                break;
            case "perspective":
                break;
        }
        lex.next();
    }
}
// A 2D transform composition of 2D position, 2D scale, and 1D rotation.

class CSS_Transform2D extends Float64Array {
    static ToString(pos = [0, 0], scl = [1, 1], rot = 0) {
        var px = 0,
            py = 0,
            sx = 1,
            sy = 1,
            r = 0, cos = 1, sin = 0;
        if (pos.length == 5) {
            px = pos[0];
            py = pos[1];
            sx = pos[2];
            sy = pos[3];
            r = pos[4];
        } else {
            px = pos[0];
            py = pos[1];
            sx = scl[0];
            sy = scl[1];
            r = rot;
        }
        
        if(r !== 0){
            cos = Math.cos(r);
            sin = Math.sin(r);
        }

        return `matrix(${cos * sx}, ${-sin * sx}, ${sy * sin}, ${sy * cos}, ${px}, ${py})`;
    }


    constructor(px, py, sx, sy, r) {
        super(5);
        this.sx = 1;
        this.sy = 1;
        if (px) {
            if (px instanceof CSS_Transform2D) {
                this[0] = px[0];
                this[1] = px[1];
                this[2] = px[2];
                this[3] = px[3];
                this[4] = px[4];
            } else if (typeof(px) == "string") ParseString(px, this);
            else {
                this[0] = px;
                this[1] = py;
                this[2] = sx;
                this[3] = sy;
                this[4] = r;
            }
        }
    }
    get px() {
        return this[0];
    }
    set px(v) {
        this[0] = v;
    }
    get py() {
        return this[1];
    }
    set py(v) {
        this[1] = v;
    }
    get sx() {
        return this[2];
    }
    set sx(v) {
        this[2] = v;
    }
    get sy() {
        return this[3];
    }
    set sy(v) {
        this[3] = v;
    }
    get r() {
        return this[4];
    }
    set r(v) {
        this[4] = v;
    }

    set scale(s){
        this.sx = s;
        this.sy = s;
    }

    get scale(){
        return this.sx;
    }
    
    lerp(to, t) {
        let out = new CSS_Transform2D();
        for (let i = 0; i < 5; i++) out[i] = this[i] + (to[i] - this[i]) * t;
        return out;
    }
    toString() {
        return CSS_Transform2D.ToString(this);
    }

    copy(v) {
        let copy = new CSS_Transform2D(this);


        if (typeof(v) == "string")
            ParseString(v, copy);

        return copy;
    }

    /**
     * Sets the transform value of a canvas 2D context;
     */
    setCTX(ctx){       
        let cos = 1, sin = 0;
        if(this[4] != 0){
            cos = Math.cos(this[4]);
            sin = Math.sin(this[4]);
        }
        ctx.transform(cos * this[2], -sin * this[2], this[3] * sin, this[3] * cos, this[0], this[1]);
    }

    getLocalX(X){
        return (X - this.px) / this.sx;
    }

    getLocalY(Y){
        return (Y - this.py) / this.sy;
    }
}

/**
 * @brief Path Info
 * @details Path syntax information for reference
 * 
 * MoveTo: M, m
 * LineTo: L, l, H, h, V, v
 * Cubic Bézier Curve: C, c, S, s
 * Quadratic Bézier Curve: Q, q, T, t
 * Elliptical Arc Curve: A, a
 * ClosePath: Z, z
 * 
 * Capital symbols represent absolute positioning, lowercase is relative
 */
const PathSym = {
    M: 0,
    m: 1,
    L: 2,
    l: 3,
    h: 4,
    H: 5,
    V: 6,
    v: 7,
    C: 8,
    c: 9,
    S: 10,
    s: 11,
    Q: 12,
    q: 13,
    T: 14,
    t: 15,
    A: 16,
    a: 17,
    Z: 18,
    z: 19,
    pairs: 20
};

function getSignedNumber(lex) {
    let mult = 1,
        tx = lex.tx;
    if (tx == "-") {
        mult = -1;
        tx = lex.n.tx;
    }
    lex.next();
    return parseFloat(tx) * mult;
}

function getNumberPair(lex, array) {
    let x = getSignedNumber(lex);
    if (lex.ch == ',') lex.next();
    let y = getSignedNumber(lex);
    array.push(x, y);
}

function parseNumberPairs(lex, array) {
    while ((lex.ty == lex.types.num || lex.ch == "-") && !lex.END) {    	
    	array.push(PathSym.pairs);
        getNumberPair(lex, array);
    }
}
/**
 * @brief An array store of path data in numerical form
 */
class CSS_Path extends Array {
    static FromString(string, array) {
        let lex = whind(string);
        while (!lex.END) {
            let relative = false,
                x = 0,
                y = 0;
            switch (lex.ch) {
                //Move to
                case "m":
                    relative = true;
                case "M":
                    lex.next(); //
                    array.push((relative) ? PathSym.m : PathSym.M);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                    //Line to
                case "h":
                    relative = true;
                case "H":
                    lex.next();
                    x = getSignedNumber(lex);
                    array.push((relative) ? PathSym.h : PathSym.H, x);
                    continue;
                case "v":
                    relative = true;
                case "V":
                    lex.next();
                    y = getSignedNumber(lex);
                    array.push((relative) ? PathSym.v : PathSym.V, y);
                    continue;
                case "l":
                    relative = true;
                case "L":
                    lex.next();
                    array.push((relative) ? PathSym.l : PathSym.L);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                    //Cubic Curve
                case "c":
                    relative = true;
                case "C":
                    array.push((relative) ? PathSym.c : PathSym.C);
                    getNumberPair(lex, array);
                    getNumberPair(lex, array);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                case "s":
                    relative = true;
                case "S":
                    array.push((relative) ? PathSym.s : PathSym.S);
                    getNumberPair(lex, array);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                    //Quadratic Curve0
                case "q":
                    relative = true;
                case "Q":
                    array.push((relative) ? PathSym.q : PathSym.Q);
                    getNumberPair(lex, array);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                case "t":
                    relative = true;
                case "T":
                    array.push((relative) ? PathSym.t : PathSym.T);
                    getNumberPair(lex, array);
                    parseNumberPairs(lex, array);
                    continue;
                    //Elliptical Arc
                    //Close path:
                case "z":
                    relative = true;
                case "Z":
                    array.push((relative) ? PathSym.z : PathSym.Z);
            }
            lex.next();
        }
    }

    static ToString(array) {
    	let string = [], l = array.length, i = 0;
    	while(i < l){
    		switch(array[i++]){
    			case PathSym.M:
    				string.push("M", array[i++], array[i++]);
    				break;
			    case PathSym.m:
			    	string.push("m", array[i++], array[i++]);
			    	break;
			    case PathSym.L:
			    	string.push("L", array[i++], array[i++]);
			    	break;
			    case PathSym.l:
			    	string.push("l", array[i++], array[i++]);
			    	break;
			    case PathSym.h:
			    	string.push("h", array[i++]);
			    	break;
			    case PathSym.H:
			    	string.push("H", array[i++]);
			    	break;
			    case PathSym.V:
			    	string.push("V", array[i++]);
			    	break;
			    case PathSym.v:
			    	string.push("v", array[i++]);
			    	break;
			    case PathSym.C:
			    	string.push("C", array[i++], array[i++], array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.c:
			    	string.push("c", array[i++], array[i++], array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.S:
			    	string.push("S", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.s:
			    	string.push("s", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.Q:
			    	string.push("Q", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.q:
			    	string.push("q", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym.T:
			    	string.push("T", array[i++], array[i++]);
			    	break;
			    case PathSym.t:
			    	string.push("t", array[i++], array[i++]);
			    	break;
			    case PathSym.Z:
			    	string.push("Z");
			    	break;
			    case PathSym.z:
			    	string.push("z");
			    	break;
			    case PathSym.pairs:
			    	string.push(array[i++], array[i++]);
			    	break;
			 	case PathSym.A:
			    case PathSym.a:
			    default:
			    	i++;
    		}
    	}

    	return string.join(" ");
    }

    
    constructor(data) {
        super();	

    	if(typeof(data) == "string"){
    		Path.FromString(data, this);
    	}else if(Array.isArray(data)){
    		for(let i = 0; i < data.length;i++){
    			this.push(parseFloat(data[i]));
    		}
    	}
    }

    toString(){
    	return Path.ToString(this);
    }

    lerp(to, t, array = new Path){
    	let l = Math.min(this.length, to.length);

    	for(let i = 0; i < l; i++)
    		array[i] = this[i] + (to[i] - this[i]) * t;

    	return array;
    }	
}

/**
 * CSS Type constructors
 * @alias module:wick~internals.css.types.
 * @enum {object}
 */
const types$1 = {
    color: CSS_Color,
    length: CSS_Length,
    time: CSS_Length,
    flex: CSS_Length,
    angle: CSS_Length,
    frequency: CSS_Length,
    resolution: CSS_Length,
    percentage: CSS_Percentage,
    url: CSS_URL,
    uri: CSS_URL,
    number: CSS_Number,
    id: CSS_Id,
    string: CSS_String,
    shape: CSS_Shape,
    cubic_bezier: CSS_Bezier,
    integer: CSS_Number,
    gradient: CSS_Gradient,
    transform2D : CSS_Transform2D,
    path: CSS_Path,

    /* Media parsers */
    m_width: CSS_Media_handle("w", 0),
    m_min_width: CSS_Media_handle("w", 1),
    m_max_width: CSS_Media_handle("w", 2),
    m_height: CSS_Media_handle("h", 0),
    m_min_height: CSS_Media_handle("h", 1),
    m_max_height: CSS_Media_handle("h", 2),
    m_device_width: CSS_Media_handle("dw", 0),
    m_min_device_width: CSS_Media_handle("dw", 1),
    m_max_device_width: CSS_Media_handle("dw", 2),
    m_device_height: CSS_Media_handle("dh", 0),
    m_min_device_height: CSS_Media_handle("dh", 1),
    m_max_device_height: CSS_Media_handle("dh", 2)
};

/**
 * CSS Property Definitions https://www.w3.org/TR/css3-values/#value-defs
 * @alias module:wick~internals.css.property_definitions.
 * @enum {string}
 */
const property_definitions = {
    //https://www.w3.org/TR/2018/REC-css-color-3-20180619//
    
    color: `<color>`,

    opacity: `<alphavalue>|inherit`,


    /*https://www.w3.org/TR/css-backgrounds-3/*/
    /* Background */
    background_color: `<color>`,
    background_image: `<bg_image>#`,
    background_repeat: `<repeat_style>#`,
    background_attachment: `scroll|fixed|local`,
    background_position: `[<percentage>|<length>]{1,2}|[top|center|bottom]||[left|center|right]`,
    background_clip: `<box>#`,
    background_origin: `<box>#`,
    background_size: `<bg_size>#`,
    background: `<bg_layer>#,<final_bg_layer>`,

    /* Font https://www.w3.org/TR/css-fonts-4*/
    font_family: `[[<family_name>|<generic_family>],]*[<family_name>|<generic_family>]`,
    family_name: `<id>||<string>`,
    generic_name: `serif|sans_serif|cursive|fantasy|monospace`,
    font: `[<font_style>||<font_variant>||<font_weight>]?<font_size>[/<line_height>]?<font_family>`,
    font_variant: `normal|small_caps`,
    font_style: `normal | italic | oblique <angle>?`,
    font_kerning: ` auto | normal | none`,
    font_variant_ligatures:`normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values> ]`,
    font_variant_position:`normal|sub|super`,
    font_variant_caps:`normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps`,


    /*CSS Clipping https://www.w3.org/TR/css-masking-1/#clipping `normal|italic|oblique`, */
    font_size: `<absolute_size>|<relative_size>|<length>|<percentage>`,
    absolute_size: `xx_small|x_small|small|medium|large|x_large|xx_large`,
    relative_size: `larger|smaller`,
    font_wight: `normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900`,

    /* Text */
    word_spacing: `normal|<length>`,
    letter_spacing: `normal|<length>`,
    text_decoration: `none|[underline||overline||line-through||blink]`,
    text_transform: `capitalize|uppercase|lowercase|none`,
    text_align: `left|right|center|justify`,
    text_indent: `<length>|<percentage>`,


    /* Border  https://www.w3.org/TR/css-backgrounds-3 */
    border_color: `<color>{1,4}`,
    border_top_color: `<color>`,
    border_right_color: `<color>`,
    border_bottom_color: `<color>`,
    border_left_color: `<color>`,

    border_width: `<line_width>{1,4}`,
    border_top_width: `<line_width>`,
    border_right_width: `<line_width>`,
    border_bottom_width: `<line_width>`,
    border_left_width: `<line_width>`,

    border_style: `<line_style>{1,4}`,
    border_top_style: `<line_style>`,
    border_right_style: `<line_style>`,
    border_bottom_style: `<line_style>`,
    border_left_style: `<line_style>`,

    border_top: `<line_width>||<line_style>||<color>`,
    border_right: `<line_width>||<line_style>||<color>`,
    border_bottom: `<line_width>||<line_style>||<color>`,
    border_left: `<line_width>||<line_style>||<color>`,

    border_radius: `<length_percentage>{1,4}[/<length_percentage>{1,4}]?`,
    border_top_left_radius: `<length_percentage>{1,2}`,
    border_top_right_radius: `<length_percentage>{1,2}`,
    border_bottom_right_radius: `<length_percentage>{1,2}`,
    border_bottom_left_radius: `<length_percentage>{1,2}`,

    border_image: `<border_image_source>||<border_image_slice>[/<border_image_width>|/<border_image_width>?/<border_image_outset>]?||<border_image_repeat>`,
    border_image_source: `none|<image>`,
    border_image_slice: `[<number>|<percentage>]{1,4}&&fill?`,
    border_image_width: `[<length_percentage>|<number>|auto]{1,4}`,
    border_image_outset: `[<length>|<number>]{1,4}`,
    border_image_repeat: `[stretch|repeat|round|space]{1,2}`,

    box_shadow: `none|<shadow>#`,

    border: `<line_width>||<line_style>||<color>`,

    width: `<length>|<percentage>|auto|inherit`,
    height: `<length>|<percentage>|auto|inherit`,
    float: `left|right|none`,
    clear: `left|right|both`,

    /* Classification */

    display: `[ <display_outside> || <display_inside> ] | <display_listitem> | <display_internal> | <display_box> | <display_legacy>`,
    white_space: `normal|pre|nowrap`,
    list_style_type: `disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit`,
    list_style_image: `<url>|none`,
    list_style_position: `inside|outside`,
    list_style: `[disc|circle|square|decimal|lower-roman|upper-roman|lower-alpha|upper-alpha|none]||[inside|outside]||[<url>|none]`,
    vertical_align: `baseline|sub|super|top|text-top|middle|bottom|text-bottom|<percentage>|<length>|inherit`,

    /* Layout https://www.w3.org/TR/css-position-3 */ 
    position: "static|relative|absolute|sticky|fixed",
    top: `<length>|<percentage>|auto|inherit`,
    left: `<length>|<percentage>|auto|inherit`,
    bottom: `<length>|<percentage>|auto|inherit`,
    right: `<length>|<percentage>|auto|inherit`,

    
    /* Box Model https://www.w3.org/TR/css-box-3 */
    margin: `[<length>|<percentage>|0|auto]{1,4}`,
    margin_top: `<length>|<percentage>|0|auto`,
    margin_right: `<length>|<percentage>|0|auto`,
    margin_bottom: `<length>|<percentage>|0|auto`,
    margin_left: `<length>|<percentage>|0|auto`,

    padding: `[<length>|<percentage>|0|auto]{1,4}`,
    padding_top: `<length>|<percentage>|0|auto`,
    padding_right: `<length>|<percentage>|0|auto`,
    padding_bottom: `<length>|<percentage>|0|auto`,
    padding_left: `<length>|<percentage>|0|auto`,

    min_width: `<length>|<percentage>|inherit`,
    max_width: `<length>|<percentage>|none|inherit`,
    min_height: `<length>|<percentage>|inherit`,
    max_height: `<length>|<percentage>|none|inherit`,
    line_height: `normal|<number>|<length>|<percentage>|inherit`,
    overflow: 'visible|hidden|scroll|auto|inherit',

    /* Flex Box https://www.w3.org/TR/css-flexbox-1/ */
    align_items: `flex-start | flex-end | center | baseline | stretch`,
    align_self: `auto | flex-start | flex-end | center | baseline | stretch`,
    align_content: `flex-start | flex-end | center | space-between | space-around | stretch`,
    flex_direction:`row | row-reverse | column | column-reverse`,
    flex_flow:`<flex-direction>||<flex-wrap>`,
    flex_wrap:`nowrap|wrap|wrap-reverse`,
    order:`<integer>`,
    flex:`none|[<flex-grow> <flex-shrink>?||<flex-basis>]`,
    flex_grow:`<number>`,
    flex_shrink:`<number>`,
    flex_basis:`content|<width>`,
    width:`<length>|<percentage>|auto|inherit`,

    box_sizing: `content-box | border-box`,

    /* Visual Effects */
    clip: '<shape>|auto|inherit',
    visibility: `visible|hidden|collapse|inherit`,
    content: `normal|none|[<string>|<uri>|<counter>|attr(<identifier>)|open-quote|close-quote|no-open-quote|no-close-quote]+|inherit`,
    quotas: `[<string><string>]+|none|inherit`,
    counter_reset: `[<identifier><integer>?]+|none|inherit`,
    counter_increment: `[<identifier><integer>?]+|none|inherit`,

    /* CSS3 Animation https://drafts.csswg.org/css-animations-1/ */
    animation: `<single_animation>#`,

    animation_name: `[none|<keyframes_name>]#`,
    animation_duration: `<time>#`,
    animation_timing_function: `<timing_function>#`,
    animation_iteration_count: `<single_animation_iteration_count>#`,
    animation_direction: `<single_animation_direction>#`,
    animation_play_state: `<single_animation_play_state>#`,
    animation_delayed: `<time>#`,
    animation_fill_mode: `<single_animation_fill_mode>#`,

    /* https://drafts.csswg.org/css-transitions-1/ */

    transition: `<single_transition>#`,
    transition_property: `none|<single_transition_property>#`,
    transition_duration: `<time>#`,
    transition_timing_function: `<timing_function>#`,
    transition_delay: `<time>#`,

    
    /* https://www.w3.org/TR/SVG11/interact.html#PointerEventsProperty */
    pointer_events : `visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|none|inherit|auto`,
};

/* Properties that are not directly accessible by CSS prop creator */

const virtual_property_definitions = {


    alphavalue: '<number>',

    box: `border-box|padding-box|content-box`,

    /*https://www.w3.org/TR/css-backgrounds-3/*/

    bg_layer: `<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
    final_bg_layer: `<background_color>||<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
    bg_image: `<url>|<gradient>|none`,
    repeat_style: `repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}`,
    background_attachment: `<attachment>#`,
    bg_size: `<length_percentage>|auto]{1,2}|cover|contain`,
    bg_position: `[[left|center|right|top|bottom|<length_percentage>]|[left|center|right|<length_percentage>][top|center|bottom|<length_percentage>]|[center|[left|right]<length_percentage>?]&&[center|[top|bottom]<length_percentage>?]]`,
    attachment: `scroll|fixed|local`,
    line_style: `none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset`,
    line_width: `thin|medium|thick|<length>`,

    shadow: `inset?&&<length>{2,4}&&<color>?`,

    /* Identifier https://drafts.csswg.org/css-values-4/ */

    identifier: `<id>`,
    custom_ident: `<id>`,

    /* https://drafts.csswg.org/css-timing-1/#typedef-timing-function */

    timing_function: `linear|<cubic_bezier_timing_function>|<step_timing_function>|<frames_timing_function>`,
    cubic_bezier_timing_function: `<cubic_bezier>`,
    step_timing_function: `step-start|step-end|'steps()'`,
    frames_timing_function: `'frames()'`,

    /* https://drafts.csswg.org/css-transitions-1/ */

    single_animation_fill_mode: `none|forwards|backwards|both`,
    single_animation_play_state: `running|paused`,
    single_animation_direction: `normal|reverse|alternate|alternate-reverse`,
    single_animation_iteration_count: `infinite|<number>`,
    single_transition_property: `all|<custom_ident>`,
    single_transition: `[none|<single_transition_property>]||<time>||<timing_function>||<time>`,

    /* CSS3 Animation https://drafts.csswg.org/css-animations-1/ */

    single_animation: `<time>||<timing_function>||<time>||<single_animation_iteration_count>||<single_animation_direction>||<single_animation_fill_mode>||<single_animation_play_state>||[none|<keyframes_name>]`,
    keyframes_name: `<string>`,

    /* CSS3 Stuff */
    length_percentage: `<length>|<percentage>`,
    frequency_percentage: `<frequency>|<percentage>`,
    angle_percentage: `<angle>|<percentage>`,
    time_percentage: `<time>|<percentage>`,
    number_percentage: `<number>|<percentage>`,

    /*CSS Clipping https://www.w3.org/TR/css-masking-1/#clipping */
    clip_path: `<clip_source>|[<basic_shape>||<geometry_box>]|none`,
    clip_source: `<url>`,
    shape_box: `<box>|margin-box`,
    geometry_box: `<shape_box>|fill-box|stroke-box|view-box`,
    basic_shape: `<CSS_Shape>`,
    ratio: `<integer>/<integer>`,

    /* https://www.w3.org/TR/css-fonts-3/*/
    common_lig_values        : `[ common-ligatures | no-common-ligatures ]`,
    discretionary_lig_values : `[ discretionary-ligatures | no-discretionary-ligatures ]`,
    historical_lig_values    : `[ historical-ligatures | no-historical-ligatures ]`,
    contextual_alt_values    : `[ contextual | no-contextual ]`,

    //Display
    display_outside  : `block | inline | run-in`,
    display_inside   : `flow | flow-root | table | flex | grid | ruby`,
    display_listitem : `<display-outside>? && [ flow | flow-root ]? && list-item`,
    display_internal : `table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-base | ruby-text | ruby-base-container | ruby-text-container`,
    display_box      : `contents | none`,
    display_legacy   : `inline-block | inline-table | inline-flex | inline-grid`,
};

const media_feature_definitions = {
    width: "<m_width>",
    min_width: "<m_max_width>",
    max_width: "<m_min_width>",
    height: "<m_height>",
    min_height: "<m_min_height>",
    max_height: "<m_max_height>",
    orientation: "portrait  | landscape",
    aspect_ratio: "<ratio>",
    min_aspect_ratio: "<ratio>",
    max_aspect_ratio: "<ratio>",
    resolution: "<length>",
    min_resolution: "<length>",
    max_resolution: "<length>",
    scan: "progressive|interlace",
    grid: "",
    monochrome: "",
    min_monochrome: "<integer>",
    max_monochrome: "<integer>",
    color: "",
    min_color: "<integer>",
    max_color: "<integer>",
    color_index: "",
    min_color_index: "<integer>",
    max_color_index: "<integer>",

};

/**
 * Used to _bind_ a rule to a CSS selector.
 * @param      {string}  selector        The raw selector string value
 * @param      {array}  selector_array  An array of selector group identifiers.
 * @memberof module:wick~internals.css
 * @alias CSSSelector
 */
class CSSSelector {

    constructor(selectors /* string */ , selectors_arrays /* array */ ) {

        /**
         * The raw selector string value
         * @package
         */

        this.v = selectors;

        /**
         * Array of separated selector strings in reverse order.
         * @package
         */

        this.a = selectors_arrays;

        /**
         * The CSSRule.
         * @package
         */
        this.r = null;
    }

    get id() {
        return this.v.join("");
    }
    /**
     * Returns a string representation of the object.
     * @return     {string}  String representation of the object.
     */
    toString(off = 0) {
        let offset = ("    ").repeat(off);

        let str = `${offset}${this.v.join(", ")} {\n`;

        if (this.r)
            str += this.r.toString(off + 1);

        return str + `${offset}}\n`;
    }

    addProp(string) {
        let root = this.r.root;
        if (root) {
            let lex = whind$2(string);
            while (!lex.END)
                root.parseProperty(lex, this.r, property_definitions);
        }
    }

}

/**
 * Holds a set of rendered CSS properties.
 * @memberof module:wick~internals.css
 * @alias CSSRule
 */
class CSSRule {
    constructor(root) {
        /**
         * Collection of properties held by this rule.
         * @public
         */
        this.props = {};
        this.LOADED = false;
        this.root = root;
    }

    addProperty(prop, rule) {
        if (prop)
            this.props[prop.name] = prop.value;
    }

    toString(off = 0) {
        let str = [],
            offset = ("    ").repeat(off);

        for (let a in this.props) {
            if (this.props[a] !== null) {
                if (Array.isArray(this.props[a]))
                    str.push(offset, a.replace(/\_/g, "-"), ":", this.props[a].join(" "), ";\n");
                else
                    str.push(offset, a.replace(/\_/g, "-"), ":", this.props[a].toString(), ";\n");
            }
        }

        return str.join(""); //JSON.stringify(this.props).replace(/\"/g, "").replace(/\_/g, "-");
    }

    merge(rule) {
        if (rule.props) {
            for (let n in rule.props)
                this.props[n] = rule.props[n];
            this.LOADED = true;
        }
    }

    get _wick_type_() { return 0; }

    set _wick_type_(v) {}
}

/**
 * wick internals.
 * @class      NR (name)
 */
class NR { //Notation Rule

    constructor() {

        this.r = [NaN, NaN];
        this._terms_ = [];
        this._prop_ = null;
        this._virtual_ = false;
    }

    sp(value, rule) { //Set Property
        if (this._prop_){
            if (value)
                if (Array.isArray(value) && value.length === 1 && Array.isArray(value[0]))
                    rule[this._prop_] = value[0];
                else
                    rule[this._prop_] = value;
        }
    }

    isRepeating() {
        return !(isNaN(this.r[0]) && isNaN(this.r[1]));
    }

    parse(lx, rule, out_val) {
        if (typeof(lx) == "string")
            lx = whind$2(lx);

        let r = out_val || { v: null },
            start = isNaN(this.r[0]) ? 1 : this.r[0],
            end = isNaN(this.r[1]) ? 1 : this.r[1];

        return this.___(lx, rule, out_val, r, start, end);
    }

    ___(lx, rule, out_val, r, start, end) {
        let bool = true;
        for (let j = 0; j < end && !lx.END; j++) {

            for (let i = 0, l = this._terms_.length; i < l; i++) {
                bool = this._terms_[i].parse(lx, rule, r);
                if (!bool) break;
            }

            if (!bool) {

                this.sp(r.v, rule);

                if (j < start)
                    return false;
                else
                    return true;
            }
        }

        this.sp(r.v, rule);

        return true;
    }
}

class AND extends NR {
    ___(lx, rule, out_val, r, start, end) {

        outer:
            for (let j = 0; j < end && !lx.END; j++) {
                for (let i = 0, l = this._terms_.length; i < l; i++)
                    if (!this._terms_[i].parse(lx, rule, r)) return false;
            }

        this.sp(r.v, rule);

        return true;
    }
}

class OR extends NR {
    ___(lx, rule, out_val, r, start, end) {
        let bool = false;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this._terms_.length; i < l; i++)
                if (this._terms_[i].parse(lx, rule, r)) bool = true;

            if (!bool && j < start) {
                this.sp(r.v, rule);
                return false;
            }
        }

        this.sp(r.v, rule);

        return true;
    }
}

class ONE_OF extends NR {
    ___(lx, rule, out_val, r, start, end) {
        let bool = false;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this._terms_.length; i < l; i++) {
                bool = this._terms_[i].parse(lx, rule, r);
                if (bool) break;
            }

            if (!bool)
                if (j < start) {
                    this.sp(r.v, rule);
                    return false;
                }
        }

        this.sp(r.v, rule);

        return bool;
    }
}

class ValueTerm {

    constructor(value, getPropertyParser, definitions) {

        this._value_ = null;

        const IS_VIRTUAL = { is: false };

        if (!(this._value_ = types$1[value]))
            this._value_ = getPropertyParser(value, IS_VIRTUAL, definitions);

        this._prop_ = "";

        if (!this._value_)
            return new LiteralTerm(value);

        if (this._value_ instanceof NR && IS_VIRTUAL.is)
            this._virtual_ = true;
    }

    parse(l, rule, r) {
        if (typeof(l) == "string")
            l = whind$2(l);

        let rn = { v: null };

        let v = this._value_.parse(l, rule, rn);

        if (rn.v) {
            if (r)
                if (r.v) {
                    if (Array.isArray(r.v)) {
                        if (Array.isArray(rn.v) && !this._virtual_)
                            r.v = r.v.concat(rn.v);
                        else
                            r.v.push(rn.v);
                    } else {
                        if (Array.isArray(rn.v) && !this._virtual_)
                            r.v = ([r.v]).concat(rn.v);
                        else
                            r.v = [r.v, rn.v];
                    }
                } else
                    r.v = (this._virtual_) ? [rn.v] : rn.v;

            if (this._prop_)
                rule[this._prop_] = rn.v;

            return true;

        } else if (v) {
            if (r)
                if (r.v) {
                    if (Array.isArray(r.v))
                        r.v.push(v);
                    else
                        r.v = [r.v, v];
                } else
                    r.v = v;

            if (this._prop_)
                rule[this._prop_] = v;

            return true;
        } else
            return false;
    }
}

class LiteralTerm {

    constructor(value) {
        this._value_ = value;
        this._prop_ = null;
    }

    parse(l, rule, r) {

        if (typeof(l) == "string")
            l = whind$2(l);

        let v = l.tx;
        if (v == this._value_) {
            l.next();

            if (r)
                if (r.v) {
                    if (Array.isArray(r.v))
                        r.v.push(v);
                    else {
                        let t = r.v;
                        r.v = [t, v];
                    }
                } else
                    r.v = v;

            if (this._prop_)
                rule[this._prop_] = v;

            return true;
        }
        return false;
    }
}

class SymbolTerm extends LiteralTerm {
    parse(l, rule, r) {
        if (typeof(l) == "string")
            l = whind$2(l);

        if (l.tx == this._value_) {
            l.next();
            return true;
        }

        return false;
    }
};

function getPropertyParser(property_name, IS_VIRTUAL = { is: false }, definitions = null) {

    let prop = definitions[property_name];

    if (prop) {

        if (typeof(prop) == "string")
            prop = definitions[property_name] = CreatePropertyParser(prop, property_name, definitions);

        return prop;
    }

    prop = virtual_property_definitions[property_name];

    if (prop) {

        IS_VIRTUAL.is = true;

        if (typeof(prop) == "string")
            prop = virtual_property_definitions[property_name] = CreatePropertyParser(prop, "", definitions);

        return prop;
    }

    return null;
}


function CreatePropertyParser(notation, name, definitions) {

    const l = whind$2(notation);

    const important = { is: false };

    let n = d$2(l, definitions);

    if (n instanceof NR && n._terms_.length == 1)
        n = n._terms_[0];

    n._prop_ = name;
    n.IMP = important.is;

    return n;
}

function d$2(l, definitions, super_term = false, group = false, need_group = false, and_group = false, important = null) {
    let term, nt;

    while (!l.END) {
        switch (l.ch) {
            case "]":
                if (term) return term;
                else 
                    throw new Error("Expected to have term before \"]\"");
            case "[":
                if (term) return term;
                term = d$2(l.next(), definitions);
                l.a("]");
                break;
            case "&":
                if (l.pk.ch == "&") {
                    if (and_group)
                        return term;

                    nt = new AND();

                    nt._terms_.push(term);

                    l.sync().next();

                    while (!l.END) {
                        nt._terms_.push(d$2(l, definitions, super_term, group, need_group, true, important));
                        if (l.ch !== "&" || l.pk.ch !== "&") break;
                        l.a("&").a("&");
                    }

                    return nt;
                }
            case "|":
                {
                    if (l.pk.ch == "|") {

                        if (need_group)
                            return term;

                        nt = new OR();

                        nt._terms_.push(term);

                        l.sync().next();

                        while (!l.END) {
                            nt._terms_.push(d$2(l, definitions, super_term, group, true, and_group, important));
                            if (l.ch !== "|" || l.pk.ch !== "|") break;
                            l.a("|").a("|");
                        }

                        return nt;

                    } else {
                        if (group) {
                            return term;
                        }

                        nt = new ONE_OF();

                        nt._terms_.push(term);

                        l.next();

                        while (!l.END) {
                            nt._terms_.push(d$2(l, definitions, super_term, true, need_group, and_group, important));
                            if (l.ch !== "|") break;
                            l.a("|");
                        }

                        return nt;
                    }
                }
                break;
            case "{":
                term = _Jux_(term);
                term.r[0] = parseInt(l.next().tx);
                if (l.next().ch == ",") {
                    l.next();
                    if (l.next().ch == "}")
                        term.r[1] = Infinity;
                    else {
                        term.r[1] = parseInt(l.tx);
                        l.next();
                    }
                } else
                    term.r[1] = term.r[0];
                l.a("}");
                if (super_term) return term;
                break;
            case "*":
                term = _Jux_(term);
                term.r[0] = 0;
                term.r[1] = Infinity;
                l.next();
                if (super_term) return term;
                break;
            case "+":
                term = _Jux_(term);
                term.r[0] = 1;
                term.r[1] = Infinity;
                l.next();
                if (super_term) return term;
                break;
            case "?":
                term = _Jux_(term);
                term.r[0] = 0;
                term.r[1] = 1;
                l.next();
                if (super_term) return term;
                break;
            case "#":
                term = _Jux_(term);
                term._terms_.push(new SymbolTerm(","));
                term.r[0] = 1;
                term.r[1] = Infinity;
                l.next();
                if (l.ch == "{") {
                    term.r[0] = parseInt(l.next().tx);
                    term.r[1] = parseInt(l.next().a(",").tx);
                    l.next().a("}");
                }
                if (super_term) return term;
                break;
            case "<":
                let v;

                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = _Jux_(new NR, term);
                    let v = d$2(l, definitions, true);
                    term = _Jux_(term, v);
                } else {
                    let v = new ValueTerm(l.next().tx, getPropertyParser, definitions);
                    l.next().a(">");
                    term = v;
                }
                break;
            case "!":
                /* https://www.w3.org/TR/CSS21/cascade.html#important-rules */

                l.next().a("important");
                important.is = true;
                break;
            default:
                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = _Jux_(new NR, term);
                    let v = d$2(l, definitions, true);
                    term = _Jux_(term, v);
                } else {
                    let v = (l.ty == l.types.symbol) ? new SymbolTerm(l.tx) : new LiteralTerm(l.tx);
                    l.next();
                    term = v;
                }
        }
    }
    return term;
}

function _Jux_(term, new_term = null) {
    if (term) {
        if (!(term instanceof NR)) {
            let nr = new NR();
            nr._terms_.push(term);
            term = nr;
        }
        if (new_term) term._terms_.push(new_term);
        return term;
    }
    return new_term;
}

/**
 * Checks to make sure token is an Identifier.
 * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}.
 * @alias module:wick~internals.css.elementIsIdentifier
 */
function _eID_(lexer) {
    if (lexer.ty != lexer.types.id) lexer.throw("Expecting Identifier");
}

/**
 * The empty CSSRule instance
 * @alias module:wick~internals.css.empty_rule
 */
const er = Object.freeze(new CSSRule());

class _selectorPart_ {
    constructor() {
        this.e = "";
        this.ss = [];
        this.c = "";
    }
}
class _mediaSelectorPart_ {
    constructor() {
        this.id = "";
        this.props = {};
        this.c = "";
    }
}

class CSSRuleBody {
    constructor() {
        this.media_selector = null;
        /**
         * All selectors indexed by their value
         */
        this._selectors_ = {};
        /**
         * All selectors in order of appearance
         */
        this._sel_a_ = [];
    }

    _applyProperties_(lexer, rule) {
        while (!lexer.END && lexer.tx !== "}") this.parseProperty(lexer, rule, property_definitions);
        lexer.next();
    }

    /**
     * Gets the last rule matching the selector
     * @param      {string}  string  The string
     * @return     {CSSRule}  The combined set of rules that match the selector.
     */
    getRule(string, r) {
        let selector = this._selectors_[string];
        if (selector) return selector.r;
        return r;
    }


    /**
     * Hook method for hijacking the property parsing function. Return true if default property parsing should not take place
     * @param      {Lexer}   value_lexer    The value lexer
     * @param      {<type>}   property_name  The property name
     * @param      {<type>}   rule           The rule
     * @return     {boolean}  The property hook.
     */
    _getPropertyHook_(value_lexer, property_name, rule) {
        return false;
    }

    /**
     * Used to match selectors to elements
     * @param      {ele}   ele       The ele
     * @param      {string}   criteria  The criteria
     * @return     {boolean}  { description_of_the_return_value }
     * @private
     */
    matchCriteria(ele, criteria) {
        if (criteria.e && ele.tagName !== criteria.e.toUpperCase()) return false;
        outer: for (let i = 0, l = criteria.ss.length; i < l; i++) {
            let ss = criteria.ss[i];
            switch (ss.t) {
                case "attribute":
                    let lex = whind$2(ss.v);
                    if (lex.ch == "[" && lex.pk.ty == lex.types.id) {
                        let id = lex.sync().tx;
                        let attrib = ele.getAttribute(id);
                        if (!attrib) return;
                        if (lex.next().ch == "=") {
                            let value = lex.next().tx;
                            if (attrib !== value) return false;
                        }
                    }
                    break;
                case "pseudo":
                    debugger;
                    break;
                case "class":
                    let class_list = ele.classList;
                    for (let j = 0, jl = class_list.length; j < jl; j++) {
                        if (class_list[j] == ss.v) continue outer;
                    }
                    return false;
                case "id":
                    if (ele.id !== ss.v) return false;
            }
        }
        return true;
    }

    matchMedia(win = window) {

        if (this.media_selector) {
            for (let i = 0; i < this.media_selector.length; i++) {
                let m = this.media_selector[i];
                let props = m.props;
                for (let a in props) {
                    let prop = props[a];
                    if (!prop(win))
                        return false;
                }
            };
        }

        return true;
    }

    /**
     * Retrieves the set of rules from all matching selectors for an element.
     * @param      {HTMLElement}  element - An element to retrieve CSS rules.
     * @public
     */
    getApplicableRules(element, rule = new CSSRule(), win = window) {

        if (!this.matchMedia(win)) return;

        let gen = this.getApplicableSelectors(element),
            sel = null;

        while (sel = gen.next().value) rule.merge(sel.r);
    }

    * getApplicableSelectors(element) {
        for (let j = 0, jl = this._sel_a_.length; j < jl; j++) {
            let ancestor = element;
            let selector = this._sel_a_[j];
            let sn = selector.a;
            let criteria = null;
            outer: for (let x = 0; x < sn.length; x++) {

                let sa = sn[x];

                inner: for (let i = 0, l = sa.length; i < l; i++) {
                    criteria = sa[i];
                    switch (criteria.c) {
                        case "child":
                            if (!(ancestor = ancestor.parentElement) || !this.matchCriteria(ancestor, criteria)) continue outer;
                            break;
                        case "preceded":
                            while ((ancestor = ancestor.previousElementSibling))
                                if (this.matchCriteria(ancestor, criteria)) continue inner;
                            continue outer;
                        case "immediately preceded":
                            if (!(ancestor = ancestor.previousElementSibling) || !this.matchCriteria(ancestor, criteria)) continue outer;
                            break;
                        case "descendant":
                            while ((ancestor = ancestor.parentElement))
                                if (this.matchCriteria(ancestor, criteria)) continue inner;
                            continue outer;
                        default:
                            if (!this.matchCriteria(ancestor, criteria)) continue outer;
                    }
                }
                yield selector;
            }
        }
    }

    /**
     * Parses properties
     * @param      {Lexer}  lexer        The lexer
     * @param      {<type>}  rule         The rule
     * @param      {<type>}  definitions  The definitions
     */
    parseProperty(lexer, rule, definitions) {
        const name = lexer.tx.replace(/\-/g, "_");

        //Catch any comments
        if (lexer.ch == "/") {
            lexer.comment(true);
            return this.parseProperty(lexer, rule, definitions);
        }
        lexer.next().a(":");
        //allow for short circuit < | > | =
        const p = lexer.pk;
        while ((p.ch !== "}" && p.ch !== ";") && !p.END) {
            //look for end of property;
            p.next();
        }
        const out_lex = lexer.copy();
        lexer.sync();
        out_lex.fence(p);
        if (!this._getPropertyHook_(out_lex, name, rule)) {
            try {
                const IS_VIRTUAL = {
                    is: false
                };
                const parser = getPropertyParser(name, IS_VIRTUAL, definitions);
                if (parser && !IS_VIRTUAL.is) {
                    if (!rule.props) rule.props = {};
                    parser.parse(out_lex, rule.props);
                } else
                    //Need to know what properties have not been defined
                    console.warn(`Unable to get parser for css property ${name}`);
            } catch (e) {
                console.log(e);
            }
        }
        if (lexer.ch == ";") lexer.next();
    }

    /** 
    Parses a selector up to a token '{', creating or accessing necessary rules as it progresses. 

    Reference: https://www.w3.org/TR/selectors-3/ 
    https://www.w3.org/TR/css3-mediaqueries/
    https://www.w3.org/TR/selectors-3/

    @param {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}.

    @protected

    */
    parseSelector(lexer) {
        let rule = this,
            id = "",
            selector_array = [],
            selectors_array = [];
        let start = lexer.pos;
        let selectors = [];
        let sel = new _selectorPart_(),
            RETURN = false;
        while (!lexer.END) {
            if (!sel) sel = new _selectorPart_();
            switch (lexer.tx) {
                case "{":
                    RETURN = true;
                case ",":
                    selector_array.unshift(sel);
                    selectors_array.push(selector_array);
                    selector_array = [];
                    selectors.push(lexer.s(start).trim().slice(0));
                    sel = new _selectorPart_();
                    if (RETURN) return new CSSSelector(selectors, selectors_array, this);
                    lexer.next();
                    start = lexer.pos;
                    break;
                case "[":
                    let p = lexer.pk;
                    while (!p.END && p.next().tx !== "]") {};
                    p.a("]");
                    if (p.END) throw new _Error_("Unexpected end of input.");
                    sel.ss.push({
                        t: "attribute",
                        v: p.s(lexer)
                    });
                    lexer.sync();
                    break;
                case ":":
                    sel.ss.push({
                        t: "pseudo",
                        v: lexer.next().tx
                    });
                    _eID_(lexer);
                    lexer.next();
                    break;
                case ".":
                    sel.ss.push({
                        t: "class",
                        v: lexer.next().tx
                    });
                    _eID_(lexer);
                    lexer.next();
                    break;
                case "#":
                    sel.ss.push({
                        t: "id",
                        v: lexer.next().tx
                    });
                    _eID_(lexer);
                    lexer.next();
                    break;
                case "*":
                    lexer.next();
                    break;
                case ">":
                    sel.c = "child";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.next();
                    break;
                case "~":
                    sel.c = "preceded";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.next();
                    break;
                case "+":
                    sel.c = "immediately preceded";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.next();
                    break;
                default:
                    if (sel.e) {
                        sel.c = "descendant";
                        selector_array.unshift(sel);
                        sel = null;
                    } else {
                        sel.e = lexer.tx;

                        _eID_(lexer);
                        lexer.next();
                    }
                    break;
            }
        }
        selector_array.unshift(sel);
        selectors_array.push(selector_array);
        selectors.push(lexer.s(start).trim().slice(0));
        return new CSSSelector(selectors, selectors_array, this);
    }

    /**
     * Parses CSS string
     * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}
     * @param      {(Array|CSSRuleBody|Object|_mediaSelectorPart_)}  root    The root
     * @return     {Promise}  A promise which will resolve to a CSSRuleBody
     * @private
     */
    parse(lexer, root, res = null, rej = null) {

        if (root && !this.par) root.push(this);

        return new Promise((res, rej) => {
            let selectors = [],
                l = 0;
            while (!lexer.END) {
                switch (lexer.ch) {
                    case "@":
                        lexer.next();
                        switch (lexer.tx) {
                            case "media": //Ignored at this iteration /* https://drafts.csswg.org/mediaqueries/ */
                                //create media query selectors
                                let _med_ = [],
                                    sel = null;
                                while (!lexer.END && lexer.next().ch !== "{") {
                                    if (!sel) sel = new _mediaSelectorPart_();
                                    if (lexer.ch == ",") _med_.push(sel), sel = null;
                                    else if (lexer.ch == "(") {
                                        let start = lexer.next().off;
                                        while (!lexer.END && lexer.ch !== ")") lexer.next();
                                        let out_lex = lexer.copy();
                                        out_lex.off = start;
                                        out_lex.tl = 0;
                                        out_lex.next().fence(lexer);
                                        this.parseProperty(out_lex, sel, media_feature_definitions);
                                        if (lexer.pk.tx.toLowerCase() == "and") lexer.sync();
                                    } else {
                                        let id = lexer.tx.toLowerCase(),
                                            condition = "";
                                        if (id === "only" || id === "not")
                                            (condition = id, id = lexer.next().tx);
                                        sel.c = condition;
                                        sel.id = id;
                                        if (lexer.pk.tx.toLowerCase() == "and") lexer.sync();
                                    }
                                }
                                //debugger
                                lexer.a("{");
                                if (sel)
                                    _med_.push(sel);

                                if (_med_.length == 0)
                                    this.parse(lexer, null); // discard results
                                else {
                                    let media_root = new this.constructor();
                                    media_root.media_selector = _med_;
                                    res(media_root.parse(lexer, root).then(b => {
                                        let body = new this.constructor();
                                        return body.parse(lexer, root);
                                    }));
                                }
                                continue;
                            case "import":
                                /* https://drafts.csswg.org/css-cascade/#at-ruledef-import */
                                let type;
                                if (type = types$1.url.parse(lexer.next())) {
                                    lexer.a(";");
                                    /**
                                     * The {@link CSS_URL} incorporates a fetch mechanism that returns a Promise instance.
                                     * We use that promise to hook into the existing promise returned by CSSRoot#parse,
                                     * executing a new parse sequence on the fetched string data using the existing CSSRoot instance,
                                     * and then resume the current parse sequence.
                                     * @todo Conform to CSS spec and only parse if @import is at the top of the CSS string.
                                     */
                                    return type.fetchText().then((str) =>
                                        //Successfully fetched content, proceed to parse in the current root.
                                        //let import_lexer = ;
                                        res(this.parse(whind$2(str), this).then((r) => this.parse(lexer, r)))
                                        //parse returns Promise. 
                                        // return;
                                    ).catch((e) => res(this.parse(lexer)));
                                } else {
                                    //Failed to fetch resource, attempt to find the end to of the import clause.
                                    while (!lexer.END && lexer.next().tx !== ";") {};
                                    lexer.next();
                                }
                        }
                        break;
                    case "/":
                        lexer.comment(true);
                        break;
                    case "}":
                        lexer.next();
                        return res(this);
                    case "{":
                        let rule = new CSSRule(this);
                        this._applyProperties_(lexer.next(), rule);
                        for (let i = -1, sel = null; sel = selectors[++i];)
                            if (sel.r) sel.r.merge(rule);
                            else sel.r = rule;
                        selectors.length = l = 0;
                        continue;
                }

                let selector = this.parseSelector(lexer, this);

                if (selector) {
                    if (!this._selectors_[selector.id]) {
                        l = selectors.push(selector);
                        this._selectors_[selector.id] = selector;
                        this._sel_a_.push(selector);
                    } else l = selectors.push(this._selectors_[selector.id]);
                }
            }

            return res(this);
        });

    }

    isSame(inCSSRuleBody) {
        if (inCSSRuleBody instanceof CSSRuleBody) {
            if (this.media_selector) {
                if (inCSSRuleBody.media_selector) {
                    //TODO compare media selectors;
                }
            } else if (!inCSSRuleBody.media_selector)
                return true;
        }
        return false;
    }

    merge(inCSSRuleBody) {
        this.parse(whind$2(inCSSRuleBody + ""));
    }

    /**
     * Gets the media.
     * @return     {Object}  The media.
     * @public
     */
    getMedia(win = window) {
        let start = this;
        this._media_.forEach((m) => {
            if (m._med_) {
                let accept = true;
                for (let i = 0, l = m._med_.length; i < l; i++) {
                    let ms = m._med_[i];
                    if (ms.props) {
                        for (let n in ms.props) {
                            if (!ms.props[n](win)) accept = false;
                        }
                    }
                    //if(not)
                    //    accept = !accept;
                    if (accept)
                        (m._next_ = start, start = m);
                }
            }
        });
        return start;
    }

    updated() {
        this.par.updated();
    }

    toString(off = 0) {
        let str = "";
        for (let i = 0; i < this._sel_a_.length; i++) {
            str += this._sel_a_[i].toString(off);
        }
        return str;
    }

    createSelector(selector_value) {
        let selector = this.parseSelector(whind$2(selector_value));

        if (selector)
            if (!this._selectors_[selector.id]) {
                this._selectors_[selector.id] = selector;
                this._sel_a_.push(selector);
                selector.r = new CSSRule(this);
            } else
                selector = this._selectors_[selector.id];

        return selector;
    }
}

LinkedList.mixinTree(CSSRuleBody);

/**
 * Container for all rules found in a CSS string or strings.
 *
 * @memberof module:wick~internals.css
 * @alias CSSRootNode
 */
class CSSRootNode {
    constructor() {
        this.promise = null;
        /**
         * Media query selector
         */
        this.pending_build = 0;
        this.resolves = [];
        this.res = null;
        this.observers = [];
        
        this.addChild(new CSSRuleBody());
    }

    _resolveReady_(res, rej) {
        if (this.pending_build > 0) this.resolves.push(res);
        res(this);
    }

    _setREADY_() {
        if (this.pending_build < 1) {
            for (let i = 0, l = this.resolves; i < l; i++) this.resolves[i](this);
            this.resolves.length = 0;
            this.res = null;
        }
    }

    READY() {
        if (!this.res) this.res = this._resolveReady_.bind(this);
        return new Promise(this.res);
    }
    /**
     * Creates a new instance of the object with same properties as the original.
     * @return     {CSSRootNode}  Copy of this object.
     * @public
     */
    clone() {
        let rn = new this.constructor();
        rn._selectors_ = this._selectors_;
        rn._sel_a_ = this._sel_a_;
        rn._media_ = this._media_;
        return rn;
    }

    * getApplicableSelectors(element, win = window) {

        for (let node = this.fch; node; node = this.getNextChild(node)) {

            if(node.matchMedia(win)){
                let gen = node.getApplicableSelectors(element, win);
                let v = null;
                while ((v = gen.next().value))
                    yield v;
            }
        }
    }

    /**
     * Retrieves the set of rules from all matching selectors for an element.
     * @param      {HTMLElement}  element - An element to retrieve CSS rules.
     * @public
     */
    getApplicableRules(element, rule = new CSSRule(), win = window) {
        for (let node = this.fch; node; node = this.getNextChild(node))
            node.getApplicableRules(element, rule, win);
        return rule;
    }

    /**
     * Gets the last rule matching the selector
     * @param      {string}  string  The string
     * @return     {CSSRule}  The combined set of rules that match the selector.
     */
    getRule(string) {
        let r = null;
        for (let node = this.fch; node; node = this.getNextChild(node))
            r = node.getRule(string, r);
        return r;
    }

    toString(off = 0) {
        let str = "";
        for (let node = this.fch; node; node = this.getNextChild(node))
            str += node.toString(off);
        return str;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        for (let i = 0; i < this.observers.length; i++)
            if (this.observers[i] == observer) return this.observers.splice(i, 1);
    }

    updated() {
        if (this.observers.length > 0)
            for (let i = 0; i < this.observers.length; i++) this.observers[i].updatedCSS(this);
    }

    parse(lex, root) {
        if (lex.sl > 0) {

            if (!root && root !== null) {
                root = this;
                this.pending_build++;
            }

            return this.fch.parse(lex, this).then(e => {
                this._setREADY_();
                return this;
            });
        }
    }

    merge(inCSSRootNode){
        if(inCSSRootNode instanceof CSSRootNode){
            
            let children = inCSSRootNode.children;
            outer:
            for(let i = 0; i < children.length; i++){
                //determine if this child matches any existing selectors
                let child = children[i];
                
                for(let i = 0; i < this.children.length; i++){
                    let own_child = this.children[i];

                    if(own_child.isSame(child)){
                        own_child.merge(child);
                        continue outer;
                    }
                }

                this.children.push(child);
            }
        }
    }
}

/**
 * CSSRootNode implements all of ll
 * @extends ll
 * @memberof  module:wick~internals.html.CSSRootNode
 * @private
 */
LinkedList.mixinTree(CSSRootNode);
/*
 * Expecting ID error check.
 */
const _err_ = "Expecting Identifier";

/**
 * Builds a CSS object graph that stores `selectors` and `rules` pulled from a CSS string. 
 * @function
 * @param {string} css_string - A string containing CSS data.
 * @param {string} css_string - An existing CSSRootNode to merge with new `selectors` and `rules`.
 * @return {Promise} A `Promise` that will return a new or existing CSSRootNode.
 * @memberof module:wick.core
 * @alias css
 */
const CSSParser = (css_string, root = null) => (root = (!root || !(root instanceof CSSRootNode)) ? new CSSRootNode() : root, root.parse(whind$2(css_string)));

CSSParser.types = types$1;

const
    CSS_Length$1 = CSSParser.types.length,
    CSS_Percentage$1 = CSSParser.types.percentage,
    CSS_Color$1 = CSSParser.types.color,
    CSS_Transform2D$1 = CSSParser.types.transform2D,
    CSS_Path$1 = CSSParser.types.path,
    CSS_Bezier$1 = CSSParser.types.cubic_bezier,

    Animation = (function anim() {

        var USE_TRANSFORM = false;

        const
            CSS_STYLE = 0,
            JS_OBJECT = 1,
            SVG = 3;

        function setType(obj) {
            if (obj instanceof HTMLElement) {
                if (obj.tagName == "SVG")
                    return SVG;
                return CSS_STYLE;
            }
            return JS_OBJECT;
        }

        const Linear = { getYatX: x => x, toString: () => "linear" };


        // Class to linearly interpolate number.
        class lerpNumber extends Number { lerp(to, t, from = 0) { return this + (to - this) * t; } copy(val) { return new lerpNumber(val); } }
        class lerpNonNumeric { constructor(v) { this.v = v; } lerp(to, t) { return to.v } copy(val) { return new lerpNonNumeric(val) } }


        // Store animation data for a single property on a single object. Hosts methods that can create CSS based interpolation and regular JS property animations. 
        class AnimProp {

            constructor(keys, obj, prop_name, type) {

                this.duration = 0;
                this.end = false;
                this.keys = [];
                this.current_val = null;

                const
                    IS_ARRAY = Array.isArray(keys),
                    k0 = IS_ARRAY ? keys[0] : keys,
                    k0_val = typeof(k0.value) !== "undefined" ? k0.value : k0.v;

                if (prop_name == "transform")
                    this.type = CSS_Transform2D$1;
                else {
                    this.type = this.getType(k0_val);
                }

                this.getValue(obj, prop_name, type);

                let p = this.current_val;

                if (IS_ARRAY)
                    keys.forEach(k => p = this.addKey(k, p));
                else
                    this.addKey(keys, p);
            }

            destroy() {
                this.keys = null;
                this.type = null;
                this.current_val = null;
            }

            getValue(obj, prop_name, type) {
                if (type == CSS_STYLE) {
                    let name = prop_name.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
                    let cs = window.getComputedStyle(obj);

                    //Try to get computed value. If it does not exist, then get value from the style attribtute.
                    let value = cs.getPropertyValue(name);
                    
                    if(!value)
                        value = obj.style[prop_name];

                    if (this.type == CSS_Percentage$1) {
                        if (obj.parentElement) {
                            let pcs = window.getComputedStyle(obj.parentElement);
                            let pvalue = pcs.getPropertyValue(name);
                            let ratio = parseFloat(value) / parseFloat(pvalue);
                            value = (ratio * 100);
                        }
                    }

                    this.current_val = new this.type(value);

                } else {
                    this.current_val = new this.type(obj[prop_name]);
                }
            }

            getType(value) {

                switch (typeof(value)) {
                    case "number":
                        return lerpNumber;
                        break
                    case "string":
                        if (CSS_Length$1._verify_(value))
                            return CSS_Length$1;
                        if (CSS_Percentage$1._verify_(value))
                            return CSS_Percentage$1;
                        if (CSS_Color$1._verify_(value))
                            return CSS_Color$1;
                        //intentional
                    case "object":
                        return lerpNonNumeric;
                }
            }

            addKey(key, prev) {
                let
                    l = this.keys.length,
                    pkey = this.keys[l - 1],
                    v = (key.value !== undefined) ? key.value : key.v,
                    own_key = {
                        val: (prev) ? prev.copy(v) : new this.type(v) || 0,
                        dur: key.duration || key.dur || 0,
                        del: key.delay || key.del || 0,
                        ease: key.easing || key.e || ((pkey) ? pkey.ease : Linear),
                        len: 0
                    };

                own_key.len = own_key.dur + own_key.del;

                this.keys.push(own_key);

                this.duration += own_key.len;

                return own_key.val;
            }

            getValueAtTime(time = 0) {
                let val_start = this.current_val,
                    val_end = this.current_val,
                    key, val_out = val_start;


                for (let i = 0; i < this.keys.length; i++) {
                    key = this.keys[i];
                    val_end = key.val;
                    if (time < key.len) {
                        break;
                    } else
                        time -= key.len;
                    val_start = key.val;
                }


                if (key) {
                    if (time < key.len) {
                        if (time < key.del) {
                            val_out = val_start;
                        } else {
                            let x = (time - key.del) / key.dur;
                            let s = key.ease.getYatX(x);
                            val_out = val_start.lerp(val_end, s, val_start);
                        }
                    } else {
                        val_out = val_end;
                    }
                }

                return val_out;
            }

            run(obj, prop_name, time, type) {
                const val_out = this.getValueAtTime(time);
                this.setProp(obj, prop_name, val_out, type);
                return time < this.duration;
            }

            setProp(obj, prop_name, value, type) {

                if (type == CSS_STYLE) {
                    obj.style[prop_name] = value;
                } else
                    obj[prop_name] = value;
            }

            unsetProp(obj, prop_name) {
                this.setProp(obj, prop_name, "", CSS_STYLE);
            }

            toCSSString(time = 0, prop_name = "") {
                const value = this.getValueAtTime(time);
                return `${prop_name}:${value.toString()}`;
            }
        }

        // Stores animation data for a group of properties. Defines delay and repeat.
        class AnimSequence {
            constructor(obj, props) {
                this.duration = 0;
                this.time = 0;
                this.obj = null;
                this.type = setType(obj);
                this.DESTROYED = false;
                this.FINISHED = false;
                this.CSS_ANIMATING = false;
                this.events = {};
                this.SHUTTLE = false;
                this.REPEAT = 0;
                this.SCALE = 1;

                switch (this.type) {
                    case CSS_STYLE:
                        this.obj = obj;
                        break;
                    case SVG:
                    case JS_OBJECT:
                        this.obj = obj;
                        break;
                }

                this.props = {};

                this.setProps(props);
            }

            destroy() {
                for (let name in this.props)
                    if (this.props[name])
                        this.props[name].destroy();
                this.DESTROYED = true;
                this.duration = 0;
                this.obj = null;
                this.props = null;
                this.time = 0;
            }

            // Removes AnimProps based on object of keys that should be removed from this sequence.
            removeProps(props) {
                if (props instanceof AnimSequence)
                    props = props.props;

                for (let name in props) {
                    if (this.props[name])
                        this.props[name] = null;
                }
            }


            unsetProps(props) {
                for (let name in this.props)
                    this.props[name].unsetProp(this.obj, name);
            }

            setProps(props) {
                for (let name in this.props)
                    this.props[name].destroy();

                this.props = {};

                for (let name in props)
                    this.configureProp(name, props[name]);
            }

            configureProp(name, keys) {
                let prop;
                if (prop = this.props[name]) {
                    this.duration = Math.max(prop.duration || prop.dur, this.duration);
                } else {
                    prop = new AnimProp(keys, this.obj, name, this.type);
                    this.props[name] = prop;
                    this.duration = Math.max(prop.duration || prop.dur, this.duration);
                }
            }

            run(i) {

                for (let n in this.props) {
                    let prop = this.props[n];
                    if (prop)
                        prop.run(this.obj, n, i, this.type);
                }

                if (i >= this.duration || i <= 0)
                    return false;

                return true;
            }

            scheduledUpdate(a, t) {

                this.time += t * this.SCALE;
                if (this.run(this.time)){
                    spark$1.queueUpdate(this);
                }
                else if(this.REPEAT){
                    let scale = this.SCALE;
                    
                    this.REPEAT--;

                    if(this.SHUTTLE)
                        scale = -scale;
                    
                    let from = (scale > 0) ? 0 : this.duration;
                         
                    this.play(scale, from);
                }else
                    this.issueEvent("stopped");

            }

            //TODO: use repeat to continually play back numation 
            repeat(count = 1){
                this.REPEAT = Math.max(0,parseFloat(count));
                return this;
            } 
             //TODO: allow scale to control playback speed and direction
            play(scale = 1, from = 0) {
                this.SCALE = scale;
                this.time = from;
                spark$1.queueUpdate(this);
                this.issueEvent("started");
                return this;
            }

            set(i=0){
                if(i >= 0)
                    this.run(i*this.duration);
                else
                    this.run(this.duration - i*this.duration);
            }


            shuttle(SHUTTLE = true){
                this.SHUTTLE = !!SHUTTLE;
                return this;
            }

            addEventListener(event, listener) {
                if (typeof(listener) === "function") {
                    if (!this.events[event])
                        this.events[event] = [];
                    this.events[event].push(listener);
                }
            }

            removeEventListener(event, listener) {
                if (typeof(listener) === "function") {
                    let events = this.events[event];
                    if (events) {
                        for (let i = 0; i < events.length; i++)
                            if (events[i] === listener)
                                return e(vents.splice(i, 1), true);
                    }
                }
                return false;
            }

            issueEvent(event) {
                let events = this.events[event];

                if (events)
                    events.forEach(e => e(this));
            }

            toCSSString(keyfram_id) {

                const easing = "linear";

                const strings = [`.${keyfram_id}{animation:${keyfram_id} ${this.duration}ms ${Animation.ease_out.toString()}}`, `@keyframes ${keyfram_id}{`];

                // TODO: Use some function to determine the number of steps that should be taken
                // This should reflect the different keyframe variations that can occure between
                // properties.
                // For now, just us an arbitrary number

                const len = 2;
                const len_m_1 = len - 1;
                for (let i = 0; i < len; i++) {

                    strings.push(`${Math.round((i/len_m_1)*100)}%{`);

                    for (let name in this.props)
                        strings.push(this.props[name].toCSSString((i / len_m_1) * this.duration, name.replace(/([A-Z])/g, (match, p1) => "-" + match.toLowerCase())) + ";");

                    strings.push("}");
                }

                strings.push("}");

                return strings.join("\n");
            }

            beginCSSAnimation() {
                if (!this.CSS_ANIMATING) {

                    const anim_class = "class" + ((Math.random() * 10000) | 0);
                    this.CSS_ANIMATING = anim_class;

                    this.obj.classList.add(anim_class);
                    let style = document.createElement("style");
                    style.innerHTML = this.toCSSString(anim_class);
                    document.head.appendChild(style);
                    this.style = style;

                    setTimeout(this.endCSSAnimation.bind(this), this.duration);
                }
            }

            endCSSAnimation() {
                if (this.CSS_ANIMATING) {
                    this.obj.classList.remove(this.CSS_ANIMATING);
                    this.CSS_ANIMATING = "";
                    this.style.parentElement.removeChild(this.style);
                    this.style = null;
                }
            }
        }

        class AnimGroup {

            constructor() {
                this.seq = [];
                this.time = 0;
                this.duration = 0;
                this.SHUTTLE = false;
                this.REPEAT = 0;
                this.SCALE = 1;
            }

            destroy() {
                this.seq.forEach(seq => seq.destroy());
                this.seq = null;
            }

            add(seq) {
                this.seq.push(seq);
                this.duration = Math.max(this.duration, seq.duration);
            }

            run(t) {
                for (let i = 0, l = this.seq.length; i < l; i++) {
                    let seq = this.seq[i];
                    seq.run(t);
                }

                if (t >= this.duration)
                    return false;

                return true;
            }

            scheduledUpdate(a, t) {
                this.time += t * this.SCALE;
                if (this.run(this.time))
                    spark$1.queueUpdate(this);
                else if(repeat){
                    let scale = this.scale;
                    
                    repeat--;

                    if(this.SHUTTLE)
                        scale = -scale;
                    
                    let from = (scale > 0) ? 0 : this.duration;
                         
                    this.play(scale, from);
                }
            }

            shuttle(SHUTTLE = true){
                this.SHUTTLE = !!SHUTTLE;
                return this;
            }

            stop(){
                return this;
            }

            set(i=0){
                if(i >= 0)
                    this.run(i*this.duration);
                else
                    this.run(this.duration - i*this.duration);
            }

            //TODO: allow scale to control playback speed and direction
            play(scale = 1, from = 0) {
                this.SCALE = 0;
                this.time = from;
                spark$1.queueUpdate(this);
                return this;
            }
            //TODO: use repeat to continually play back numation 
            repeat(count = 0){
                this.REPEAT = Math.max(0,parseInt(count));
                return this;
            }    
        }

        const GlowFunction = function() {

            if (arguments.length > 1) {

                let group = new AnimGroup();

                for (let i = 0; i < arguments.length; i++) {
                    let data = arguments[i];

                    let obj = data.obj;
                    let props = {};

                    Object.keys(data).forEach(k => { if (!(({ obj: true, match: true })[k])) props[k] = data[k]; });

                    group.add(new AnimSequence(obj, props));
                }

                return group;

            } else {
                let data = arguments[0];

                let obj = data.obj;
                let props = {};

                Object.keys(data).forEach(k => { if (!(({ obj: true, match: true })[k])) props[k] = data[k]; });

                let seq = new AnimSequence(obj, props);

                return seq;
            }
        };

        Object.assign(GlowFunction, {

            createSequence: GlowFunction,

            createGroup: function(...rest) {
                let group = new AnimGroup;
                rest.forEach(seq => group.add(seq));
                return group;
            },

            set USE_TRANSFORM(v) { USE_TRANSFORM = !!v; },
            get USE_TRANSFORM() { return USE_TRANSFORM; },

            linear: Linear,
            ease: new CSS_Bezier$1(0.25, 0.1, 0.25, 1),
            ease_in: new CSS_Bezier$1(0.42, 0, 1, 1),
            ease_out: new CSS_Bezier$1(0.2, 0.8, 0.3, 0.99),
            ease_in_out: new CSS_Bezier$1(0.42, 0, 0.58, 1),
            overshoot: new CSS_Bezier$1(0.2, 1.5, 0.2, 0.8),
            custom: (x1, y1, x2, y2) => new CSS_Bezier$1(x1, y1, x2, y2)
        });

        return GlowFunction;
    })();

const CSS_Transform2D$2 = CSSParser.types.transform2D;

function setToWithTransform(box_a, box_b, seq){
    const start_width_as_percentage = box_a.width / box_b.width;
    const start_height_as_percentage = box_a.height / box_b.height;
    const pos_x_diff = -(box_b.x - box_a.x);
    const pos_y_diff = -(box_b.y - box_a.y);

    let ATransform = new CSS_Transform2D$2(pos_x_diff, pos_y_diff, start_width_as_percentage, start_height_as_percentage, 0);
    let BTransform = new CSS_Transform2D$2(0, 0, 1, 1, 0);

    seq.props.transform.keys[0].val = ATransform;
    seq.props.transform.keys[1].val = BTransform;
}

function setTo(to, seq, duration, easing, from){

    const cs = window.getComputedStyle(to, null);
    const rect = to.getBoundingClientRect();
    const from_rect = from.getBoundingClientRect();

    let to_width = cs.getPropertyValue("width");
    let to_height = cs.getPropertyValue("height");
    let margin_left = parseFloat(cs.getPropertyValue("margin-left"));
    let to_bgc = cs.getPropertyValue("background-color");
    let to_c = cs.getPropertyValue("color");
    const pos = cs.getPropertyValue("position");

    /* USING TRANSFORM */

    //Use width and height a per

    if(false){
        setToWithTransform(from_rect, rect, seq);
        //left.keys[0].val = new left.type(start_left, "px");
        //left.keys[1].val = new left.type(final_left,"px");
        seq.props.transform.keys[1].dur = duration;
        seq.props.transform.keys[1].len = duration;
        seq.props.transform.keys[1].ease = easing;
        seq.props.transform.duration = duration;
    }else{
        ////////////////////// LEFT ////////////////////// 

        const left = seq.props.left;
        let start_left = 0, final_left = 0, abs_diff = 0;

        abs_diff = (left.keys[0].val - rect.left);

        if(pos== "relative"){
            //get existing offset 
            const left = parseFloat(cs.getPropertyValue("left")) || 0;

            start_left = abs_diff +left;
            final_left = left;
        }else{
            start_left = to.offsetLeft + abs_diff;
            final_left = to.offsetLeft;
        }

        left.keys[0].val = new left.type(start_left, "px");
        left.keys[1].val = new left.type(final_left,"px");
        left.keys[1].dur = duration;
        left.keys[1].len = duration;
        left.keys[1].ease = easing;
        left.duration = duration;

        ////////////////////// TOP ////////////////////// 
        const top = seq.props.top;
        let start_top = 0, final_top = 0;

        abs_diff = (top.keys[0].val - rect.top);

        if(pos== "relative"){
             const top = parseFloat(cs.getPropertyValue("top")) || 0;
            start_top = abs_diff + top;
            final_top = top;
        }else{
            start_top = to.offsetTop + abs_diff;
            final_top = to.offsetTop;
        }

        top.keys[0].val = new top.type(start_top, "px");
        top.keys[1].val = new top.type(final_top,"px");
        top.keys[1].dur = duration;
        top.keys[1].len = duration;
        top.keys[1].ease = easing;
        top.duration = duration;

        ////////////////////// WIDTH ////////////////////// 

        seq.props.width.keys[0].val = new seq.props.width.type(to_width);
        seq.props.width.keys[0].dur = duration;
        seq.props.width.keys[0].len = duration;
        seq.props.width.keys[0].ease = easing;
        seq.props.width.duration = duration;

        ////////////////////// HEIGHT ////////////////////// 

        seq.props.height.keys[0].val = new seq.props.height.type(to_height);
        seq.props.height.keys[0].dur = duration;
        seq.props.height.keys[0].len = duration; 
        seq.props.height.keys[0].ease = easing; 
        seq.props.height.duration = duration;

    }
        to.style.transformOrigin = "top left";

    ////////////////////// BG COLOR ////////////////////// 

    seq.props.backgroundColor.keys[0].val = new seq.props.backgroundColor.type(to_bgc);
    seq.props.backgroundColor.keys[0].dur = duration; 
    seq.props.backgroundColor.keys[0].len = duration; 
    seq.props.backgroundColor.keys[0].ease = easing; 
    seq.props.backgroundColor.duration = duration;

    ////////////////////// COLOR ////////////////////// 

    seq.props.color.keys[0].val = new seq.props.color.type(to_c);
    seq.props.color.keys[0].dur = duration; 
    seq.props.color.keys[0].len = duration; 
    seq.props.color.keys[0].ease = easing; 
    seq.props.color.duration = duration;

    seq.obj = to;



    seq.addEventListener("stopped", ()=>{
        seq.unsetProps();
    });
}

/**
    Transform one element from another back to itself
    @alias module:wick~internals.TransformTo
*/
function TransformTo(element_from, element_to, duration = 500, easing = Animation.linear, HIDE_OTHER = false) {
    let rect = element_from.getBoundingClientRect();
    let cs = window.getComputedStyle(element_from, null);
    let margin_left = parseFloat(cs.getPropertyValue("margin"));

    let seq = Animation.createSequence({
        obj: element_from,
        // /transform: [{value:"translate(0,0)"},{value:"translate(0,0)"}],
        width: { value: "0px"},
        height: { value: "0px"},
        backgroundColor: { value: "rgb(1,1,1)"},
        color: { value: "rgb(1,1,1)"},
        left: [{value:rect.left+"px"},{ value: "0px"}],
        top: [{value:rect.top+"px"},{ value: "0px"}]
    });

    if (!element_to) {

        let a = (seq) => (element_to, duration = 500, easing = Animation.linear,  HIDE_OTHER = false) => {
            setTo(element_to, seq, duration, easing, element_from);
            seq.duration = duration;
        console.log(seq.toCSSString("MumboJumbo"));
            return seq;
        };

        return a(seq);
    }

    setTo(element_to, duration, easing, element_from);
    seq.duration = duration;
    return seq;
}

const Transitioneer = (function() {

    let obj_map = new Map();
    let ActiveTransition = null;

    function $in(anim_data_or_duration = 0, delay = 0) {

        let seq;

        if (typeof(anim_data_or_duration) == "object") {
            if (anim_data_or_duration.match && this.TT[anim_data_or_duration.match]) {
                let duration = anim_data_or_duration.duration;
                let easing = anim_data_or_duration.easing;
                seq = this.TT[anim_data_or_duration.match](anim_data_or_duration.obj, duration, easing);
            } else
                seq = Animation.createSequence(anim_data_or_duration);

            //Parse the object and convert into animation props. 
            if (seq) {
                this.in_seq.push(seq);
                this.in_duration = Math.max(this.in_duration, seq.duration);
                if (this.OVERRIDE) {

                    if (obj_map.get(seq.obj)) {
                        let other_seq = obj_map.get(seq.obj);
                        other_seq.removeProps(seq);
                    }

                    obj_map.set(seq.obj, seq);
                }
            }

        } else
            this.in_duration = Math.max(this.in_duration, parseInt(delay) + parseInt(anim_data_or_duration));

        return this.in;
    }


    function $out(anim_data_or_duration = 0, delay = 0, in_delay = 0) {
        //Every time an animating component is added to the Animation stack delay and duration need to be calculated.
        //The highest in_delay value will determine how much time is afforded before the animations for the in portion are started.

        if (typeof(anim_data_or_duration) == "object") {

            if (anim_data_or_duration.match) {
                this.TT[anim_data_or_duration.match] = TransformTo(anim_data_or_duration.obj);
            } else {
                let seq = Animation.createSequence(anim_data_or_duration);
                if (seq) {
                    this.out_seq.push(seq);
                    this.out_duration = Math.max(this.out_duration, seq.duration);
                    if (this.OVERRIDE) {

                        if (obj_map.get(seq.obj)) {
                            let other_seq = obj_map.get(seq.obj);
                            other_seq.removeProps(seq);
                        }

                        obj_map.set(seq.obj, seq);
                    }
                }
                this.in_delay = Math.max(this.in_delay, parseInt(delay));
            }
        } else {
            this.out_duration = Math.max(this.out_duration, parseInt(delay) + parseInt(anim_data_or_duration));
            this.in_delay = Math.max(this.in_delay, parseInt(in_delay));
        }
    }



    class Transition {
        constructor(override = true) {
            this.in_duration = 0;
            this.out_duration = 0;
            this.PLAY = true;

            this.reverse = false;

            this.time = 0;

            // If set to zero transitions for out and in will happen simultaneously.
            this.in_delay = 0;

            this.in_seq = [];
            this.out_seq = [];

            this.TT = {};
            //Final transition time is given by max(start_len+in_delay, end_len);\
            ActiveTransition = this;

            this.out = $out.bind(this);
            this.in = $in.bind(this);

            Object.defineProperty(this.out, "out_duration", {
                get: () => this.out_duration
            });

            this.OVERRIDE = override;
        }

        destroy() {
            let removeProps = function(seq) {

                if (!seq.DESTROYED) {
                    if (obj_map.get(seq.obj) == seq)
                        obj_map.delete(seq.obj);
                }

                seq.destroy();
            };
            this.in_seq.forEach(removeProps);
            this.out_seq.forEach(removeProps);
            this.in_seq.length = 0;
            this.out_seq.length = 0;
            this.res = null;
            this.out = null;
            this.in = null;
        }

        get duration() {
            return Math.max(this.in_duration + this.in_delay, this.out_duration);
        }


        start(time = 0, speed = 1, reverse = false) {

            for (let i = 0; i < this.in_seq.length; i++) {
                // let seq = this.in_seq[i];
                // seq.beginCSSAnimation()
            }

            this.time = time;
            this.speed = Math.abs(speed);
            this.reverse = reverse;

            if (this.reverse)
                this.speed = -this.speed;

            return new Promise((res, rej) => {
                if (this.duration > 0)
                    this.scheduledUpdate(0, 0);
                if (this.duration < 1)
                    return res();
                this.res = res;
            });
        }

        play(t) {


            this.PLAY = true;
            let time = this.duration * t;
            this.step(time);
            return time;
        }

        stop() {
            this.PLAY = false;
            //There may be a need to kill any existing CSS based animations
        }

        step(t) {
            
            for (let i = 0; i < this.out_seq.length; i++) {
                let seq = this.out_seq[i];
                if (!seq.run(t) && !seq.FINISHED) {
                    seq.issueEvent("stopped");
                    seq.FINISHED = true;
                }
            }

            t = Math.max(t - this.in_delay, 0);

            for (let i = 0; i < this.in_seq.length; i++) {
                let seq = this.in_seq[i];
                if (!seq.run(t) && !seq.FINISHED) {
                    seq.issueEvent("stopped");
                    seq.FINISHED = true;
                }
            }

        }

        scheduledUpdate(step, time) {
            if (!this.PLAY) return;

            this.time += time * this.speed;

            this.step(this.time);


            if (this.res && this.time >= this.in_delay) {
                this.res();
                this.res = null;
            }

            if (this.reverse) {
                if (this.time > 0)
                    return spark$1.queueUpdate(this);
            } else {
                if (this.time < this.duration)
                    return spark$1.queueUpdate(this);
            }

            if (this.res)
                this.res();

            this.destroy();
        }
    }

    return { createTransition: (OVERRIDE) => new Transition(OVERRIDE) };
})();

Object.assign(Animation, {
	createTransition:(...args) => Transitioneer.createTransition(...args),
	transformTo:(...args) => TransformTo(...args)
});

const Globals = new Set([
    "window",
    "document",
    "JSON",
    "HTMLElement",
]);

class argumentIO extends IO {
    constructor(scope, errors, tap, script, id) {
        super(scope, errors, tap);
        this.ele = script;
        this.id = id;
        this.ACTIVE = false;
    }

    destroy() {
        this.id = null;
        super.destroy();
    }

    down(value) {
        this.ele.updateProp(this, value);
    }
}


//Function.apply(Function, [binding.arg_key || binding.tap_name, "event", "model", "emit", "presets", "static", "src", binding.val]);
class ScriptIO extends IOBase {
    constructor(scope, errors, tap, script, lex, pinned) {

        const HAVE_CLOSURE = false;

        super(tap);

        this.scope = scope;
        this.TAP_BINDING_INDEX = script.args.reduce((r,a,i)=>(a.name == tap.name) ? i: r,0);
        this.ACTIVE_IOS = 0;
        this.IO_ACTIVATIONS = 0;
        
        this.function = null;
        
        this.HAVE_CLOSURE = HAVE_CLOSURE;
        if (this.HAVE_CLOSURE)
            this.function = script.function;
        else
            this.function = script.function.bind(scope);

        //Embedded emit functions
        const func_bound = this.emit.bind(this);
        func_bound.onTick = this.onTick.bind(this);

        //TODO: only needed if emit is called in function. Though highly probably. 
        this.arg_props = [];
        this.arg_ios = {};
        
        this.initProps(script.args, tap, errors, pinned);
        
        this.arg_props.push(new Proxy(func_bound, { set: (obj, name, value) => { obj(name, value); } }));
    }

    /*
        Removes all references to other objects.
        Calls destroy on any child objects.
     */
    destroy() {
        this.function = null;
        this.scope = null;
        this._bound_emit_function_ = null;
        this._meta = null;
        this.arg_props = null;
        this.props = null;

        for (const a of this.arg_ios)
            a.destroy();

        this.arg_ios = null;
    }

    initProps(arg_array, tap, errors, pinned){
        for(let i = 0; i < arg_array.length; i++){
            
            const a = arg_array[i];

            if(a.IS_ELEMENT){
                
                this.arg_props.push(pinned[a.name]);

            }else if(a.IS_TAPPED){

                let val = null;
                
                const name = a.name;
                
                if(name == tap.name){
                    val = tap.prop;
                    this.TAP_BINDING_INDEX = i;
                }
                
                this.ACTIVE_IOS++;
                
                this.arg_ios[name] = new argumentIO(this.scope, errors, this.scope.getTap(name), this, i);

                this.arg_props.push(val);
            }else{
                this.arg_props.push(a.val);
            }
        }
    }

    updateProp(io, val) {
        this.arg_props[io.id] = val;

        if (!io.ACTIVE) {
            io.ACTIVE = true;
            this.ACTIVE_IOS++;
        }
    }

    setValue(value) {
        if (typeof(value) == "object") {
            //Distribute iterable properties amongst the IO_Script's own props.
            for (const a in value) {
                if (this.arg_ios[a])
                    this.arg_ios[a].down(value[a]);
            }
        } else {
            if (this.TAP_BINDING_INDEX !== -1)
                this.arg_props[this.TAP_BINDING_INDEX] = value;
        }
    }

    down(value) {

        const src = this.scope;

        if (value)
            this.setValue(value);


        if (this.ACTIVE_IOS < this.IO_ACTIVATIONS)
            return

        try {

            if (this.HAVE_CLOSURE)
                return this.function.apply(this, this.arg_props);
            else
                return this.function.apply(this, this.arg_props);
        } catch (e) {
            console.error(`Script error encountered in ${this.url || "virtual file"}:${this.line+1}:${this.char}`);
            console.warn(this.function);
            console.error(e);
        }
    }

    emit(name, value) {
        if (
            typeof(name) !== "undefined" &&
            typeof(value) !== "undefined"
        ) {
            this.scope.upImport(name, value, this.meta);
        }
    }

    /* 
        Same as emit, except the message is generated on the next global tick. 
        Useful for actions which require incremental updates to the UI.
    */
    onTick(name) {
        spark.queueUpdate({
            _SCHD_: 0, // Meta value for spark;
            scheduledUpdate: (s, d) => this.emit(name, { step: s, diff: d })
        });
    }
}

//Cache for scripts that have already been built. Keys are the final strings of processed ASTs
var FUNCTION_CACHE = new Map();

const defaults = { glow: Animation };

function GetOutGlobals(ast, presets) {
    const args = [];
    const ids = [];
    const arg_lu = new Set();

    JS.getClosureVariableNames(ast).forEach(out => {

        const name = out.name;

        if (!arg_lu.has(name)) {
            arg_lu.add(name);

            const out_object = { name, val: null, IS_TAPPED: false, IS_ELEMENT: false };

            if (presets.custom[name])
                out_object.val = presets.custom[name];
            else if (presets[name])
                out_object.val = presets[name];
            else if (defaults[name])
                out_object.val = defaults[name];
            else if (name[name.length - 1] == "$") {
                out_object.IS_ELEMENT = true;
                //out_object.name = out.slice(0,-1);
            } else {
                out_object.IS_TAPPED = true;
            }
            args.push(out_object);
        }
        ids.push(out);
    });

    return { args, ids };
}

function AddEmit(ast, presets, ignore) {
    ast.forEach( node => {

        if(node.parent.type == types.assignment_expression){
            const assign = node.parent;

            const k = node.name;

            if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
                return;

            node.replace(new member_expression([new identifier$1(["emit"]), null, node]));
        }
    });
}

class scr extends ElementNode {
    
    constructor(env, tag, ast, attribs, presets) {
        super(env, "script", null, attribs, presets);
        this.function = null;
        this.args = null;
        this.ast = ast[0];
        this.READY = false;
        this.val = "";

        this.processJSAST(presets);

        this.on = this.getAttrib("on").value;
    }

    processJSAST(presets = { custom: {} }) {
        const {args, ids} = GetOutGlobals(this.ast, presets);
        this.args = args;
        AddEmit(ids, presets, this.args.reduce((r, a)=> ((a.IS_TAPPED) ? null : r.push(a.name), r), []));
        this.val = this.ast + "";
    }

    finalize() {
        if (!FUNCTION_CACHE.has(this.val)) {

            let func, HAVE_CLOSURE = false;

            const
                args = this.args,
                names = args.map(a => a.name);

            // For the injected emit function
            names.push("emit");

            try {
                this.function = Function.apply(Function, names.concat([this.val]));
                this.READY = true;
                FUNCTION_CACHE.set(this.val, this.function);
            } catch (e) {
                //errors.push(e);
                //console.error(`Script error encountered in ${statics.url || "virtual file"}:${node.line+1}:${node.char}`)
                console.warn(this.val);
                console.error(e);
            }
        } else {
            this.function = FUNCTION_CACHE.get(this.val);
        }

        return this;
    }

    mount(element, scope, presets, slots, pinned) {
        if (this.READY) {
            const tap = this.on.bind(scope);
            new ScriptIO(scope, [], tap, this, {}, pinned);
        }
    }
}

class scp extends ElementNode {

    constructor(env, tag, children, attribs, presets) {

        super(env, "scope", children, attribs, presets);

        this.HAS_TAPS = false;
        this.tap_list = [];

        (this.getAttrib("put").value || "").split(" ").forEach(e => this.checkTapMethod("put", e));
        (this.getAttrib("export").value || "").split(" ").forEach(e => this.checkTapMethod("export", e));
        (this.getAttrib("import").value || "").split(" ").forEach(e => this.checkTapMethod("import", e));

        this.model_name = this.getAttrib("model").value;
        this.schema_name = this.getAttrib("scheme").value;

        if (this.getAttrib("scheme"))
            this.getAttrib("scheme").RENDER = false;

        if (this.getAttrib("model"))
            this.getAttrib("model").RENDER = false;

        if (this.getAttrib("put"))
            this.getAttrib("put").RENDER = false;

        if (this.getAttrib("import"))
            this.getAttrib("import").RENDER = false;

        if (this.getAttrib("export"))
            this.getAttrib("export").RENDER = false;

        this.element = this.getAttrib("element").value;
    }

    createElement() {
        return createElement(this.element || "div");
    }

    getTap(tap_name) {

        this.HAS_TAPS = true;

        const l = this.tap_list.length;

        for (let i = 0; i < l; i++)
            if (this.tap_list[i].name == tap_name)
                return this.tap_list[i];

        const tap = {
            name: tap_name,
            id: l,
            modes: 0
        };

        this.tap_list.push(tap);

        return tap;
    }

    checkTapMethod(type, name) {

        let tap_mode = KEEP;

        let SET_TAP_METHOD = false;

        switch (type) {
            case "import": // Imports data updates, messages - valid on scope and top level objects.
                SET_TAP_METHOD = true;
                tap_mode |= IMPORT;
                break;
            case "export": // Exports data updates, messages - valid on scopes and top level objects.
                SET_TAP_METHOD = true;
                tap_mode |= EXPORT;
                break;
            case "put": // Pushes updates to model
                SET_TAP_METHOD = true;
                tap_mode |= PUT;
        }

        if (SET_TAP_METHOD) {
            this.getTap(name).modes |= tap_mode;
            return true;
        }
    }

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}) {

        const runtime_scope = new Scope(scope, presets, element, this);

        if (this.slots)
            slots = Object.assign({}, slots, this.slots);

        //Reset pinned
        pinned = {};

        if (this.pinned)
            pinned[this.pinned] = runtime_scope.ele;


        runtime_scope._model_name_ = this.model_name;
        runtime_scope._schema_name_ = this.schema_name;

        if(this.HAS_TAPS){ 
            let tap_list = this.tap_list;

            for (let i = 0, l = tap_list.length; i < l; i++) {
                let tap = tap_list[i],
                    name = tap.name;

                let bool = name == "update";

                runtime_scope.taps[name] = bool ? new UpdateTap(runtime_scope, name, tap.modes) : new Tap(runtime_scope, name, tap.modes);

                if (bool)
                    runtime_scope.update_tap = runtime_scope.taps[name];

                //out_taps.push(runtime_scope.taps[name]);
            }
        }

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a scope object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the scope virtual tag (defaulted to a "div"), 
         * will be created to allow the scope object to bind to an actual HTMLElement. 
         */
        if (!element || this.getAttrib("element").value) {

            let ele = this.createElement();

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this.getAttribute("id"))
                ele.id = this.getAttribute("id");

            if (this.getAttribute("style"))
                ele.style = this.getAttribute("style");

            runtime_scope.ele = ele;

            if (element) {
                appendChild(element, ele);
            }

            element = ele;

            if (this._badge_name_)
                runtime_scope.badges[this._badge_name_] = element;
        }

        for (let i = 0, l = this.attribs.length; i < l; i++){
            this.attribs[i].bind(element, runtime_scope, pinned);
        }

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i];
            node.mount(element, runtime_scope, presets, slots, pinned);
        }

        return runtime_scope;
    }
}

class a$2 extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "a", children, attribs, presets);
	}
}

function getColumnRow(index, offset, set_size) {
    const adjusted_index = index - offset * set_size;
    const row = Math.floor(adjusted_index / set_size);
    const col = (index) % (set_size);
    return { row, col };
}

/**
 * ScopeContainer provide the mechanisms for dealing with lists and sets of components. 
 *
 * @param      {Scope}  parent   The Scope parent object.
 * @param      {Object}  data     The data object hosting attribute properties from the HTML template. 
 * @param      {Object}  presets  The global presets object.
 * @param      {HTMLElement}  element  The element that the Scope will _bind_ to. 
 */
class ScopeContainer extends View {

    constructor(parent, presets, element) {
        
        super();

        this.ele = element;
        this.parent = null;
        this.activeScopes = [];
        this.dom_scopes = [];
        this.filters = [];
        this.ios = [];
        this.terms = [];
        this.scopes = [];
        this.range = null;
        this._SCHD_ = 0;
        this.prop = null;
        this.component = null;
        this.transition_in = 0;
        this.limit = 0;
        this.shift_amount = 1;
        this.dom_dn = [];
        this.dom_up = [];
        this.trs_ascending = null;
        this.trs_descending = null;
        this.UPDATE_FILTER = false;
        this.dom_up_appended = false;
        this.dom_dn_appended = false;
        this.root = 0;
        this.AUTO_SCRUB = false;
        this.taps = {};

        this.scrub_velocity = 0;

        this.offset = 0;
        this.offset_diff = 0;
        this.offset_fractional = 0;

        parent.addTemplate(this);
    }

    get data() {}

    set data(container) {
        if (container instanceof ModelContainerBase) {
            container.pin();
            container.addObserver(this);
            return;
        }
        if (!container) return;
        if (Array.isArray(container)) this.cull(container);
        else this.cull(container.data);
    }

    update(container) {
        if (container instanceof ModelContainerBase) container = container.get();
        if (!container) return;
        //let results = container.get(this.getTerms());
        // if (container.length > 0) {
        if (Array.isArray(container)) this.cull(container);
        else this.cull(container.data);
        // }
    }


    /**
     * Called by Spark when a change is made to the Template HTML structure. 
     * 
     * @protected
     */
    scheduledUpdate() {

        if (this.SCRUBBING) {

            if (!this.AUTO_SCRUB) {
                this.SCRUBBING = false;
                return;
            }

            if (
                Math.abs(this.scrub_velocity) > 0.0001
            ) {
                if (this.scrub(this.scrub_velocity)) {

                    this.scrub_velocity *= (this.drag);

                    let pos = this.offset + this.scrub_velocity;

                    if (pos < 0 || pos > this.max)
                        this.scrub_velocity = 0;

                    spark.queueUpdate(this);
                }

            } else {
                this.scrub_velocity = 0;
                this.scrub(Infinity);
                this.SCRUBBING = false;
            }
        } else {

           // const offset_a = this.offset;

            //this.limitUpdate();

            //const offset_b = this.offset;

            //this.offset = offset_a;
            this.forceMount();
            this.arrange();
            //this.offset = offset_b;
            this.render();
            this.offset_diff = 0;
        }
    }

    forceMount() {
        const active_window_size = this.limit;
        const offset = this.offset;


        const min = Math.min(offset + this.offset_diff, offset) * this.shift_amount;
        const max = Math.max(offset + this.offset_diff, offset) * this.shift_amount + active_window_size;


        let i = min;

        this.ele.innerHTML = "";
        const output_length = this.activeScopes.length;
        this.dom_scopes.length = 0;

        while (i < max && i < output_length) {
            const node = this.activeScopes[i++];
            this.dom_scopes.push(node);
            node.appendToDOM(this.ele);
        }
    }

    /**
     * Scrub provides a mechanism to scroll through components of a container that have been limited through the limit filter.
     * @param  {Number} scrub_amount [description]
     */
    scrub(scrub_delta, SCRUBBING = true) {
        // scrub_delta is the relative ammunt of change from the previous offset. 

        if (!this.SCRUBBING)
            this.render(null, this.activeScopes, true);

        this.SCRUBBING = true;

        if (this.AUTO_SCRUB && !SCRUBBING && scrub_delta != Infinity) {
            this.scrub_velocity = 0;
            this.AUTO_SCRUB = false;
        }

        let delta_offset = scrub_delta + this.offset_fractional;
        if (scrub_delta !== Infinity) {

            if (Math.abs(delta_offset) > 1) {
                if (delta_offset > 1) {

                    delta_offset = delta_offset % 1;
                    this.offset_fractional = delta_offset;
                    this.scrub_velocity = scrub_delta;

                    if (this.offset < this.max)
                        this.trs_ascending.play(1);

                    this.offset++;
                    this.offset_diff = 1;
                    this.render(null, this.activeScopes, true).play(1);
                } else {
                    delta_offset = delta_offset % 1;
                    this.offset_fractional = delta_offset;
                    this.scrub_velocity = scrub_delta;

                    if (this.offset >= 1)
                        this.trs_descending.play(1);
                    this.offset--;
                    this.offset_diff = -1;

                    this.render(null, this.activeScopes, true).play(1);
                }

            }

            //Make Sure the the transition animation is completed before moving on to new animation sequences.

            if (delta_offset > 0) {

                if (this.offset + delta_offset >= this.max - 1) delta_offset = 0;

                if (!this.dom_up_appended) {

                    for (let i = 0; i < this.dom_up.length; i++) {
                        this.dom_up[i].appendToDOM(this.ele);
                        this.dom_up[i].index = -1;
                        this.dom_scopes.push(this.dom_up[i]);
                    }

                    this.dom_up_appended = true;
                }

                this.trs_ascending.play(delta_offset);
            } else {

                if (this.offset < 1) delta_offset = 0;

                if (!this.dom_dn_appended) {

                    for (let i = 0; i < this.dom_dn.length; i++) {
                        this.dom_dn[i].appendToDOM(this.ele, this.dom_scopes[0].ele);
                        this.dom_dn[i].index = -1;
                    }

                    this.dom_scopes = this.dom_dn.concat(this.dom_scopes);

                    this.dom_dn_appended = true;
                }

                this.trs_descending.play(-delta_offset);
            }

            this.offset_fractional = delta_offset;
            this.scrub_velocity = scrub_delta;

            return true;
        } else {

            if (Math.abs(this.scrub_velocity) > 0.0001) {
                const sign = Math.sign(this.scrub_velocity);

                if (Math.abs(this.scrub_velocity) < 0.1) this.scrub_velocity = 0.1 * sign;
                if (Math.abs(this.scrub_velocity) > 0.5) this.scrub_velocity = 0.5 * sign;

                this.AUTO_SCRUB = true;

                //Determine the distance traveled with normal drag decay of 0.5
                let dist = this.scrub_velocity * (1 / (-0.5 + 1));
                //get the distance to nearest page given the distance traveled
                let nearest = (this.offset + this.offset_fractional + dist);
                nearest = (this.scrub_velocity > 0) ? Math.min(this.max, Math.ceil(nearest)) : Math.max(0, Math.floor(nearest));
                //get the ratio of the distance from the current position and distance to the nearest 
                let nearest_dist = nearest - (this.offset + this.offset_fractional);
                let drag = Math.abs(1 - (1 / (nearest_dist / this.scrub_velocity)));

                this.drag = drag;
                this.scrub_velocity = this.scrub_velocity;
                this.SCRUBBING = true;
                spark.queueUpdate(this);
                return true;
            } else {
                this.offset += Math.round(this.offset_fractional);
                this.scrub_velocity = 0;
                this.offset_fractional = 0;
                this.render(null, this.activeScopes, true).play(1);
                this.SCRUBBING = false;
                return false;
            }
        }
    }

    arrange(output = this.activeScopes) {

        //Arranges active scopes according to their arrange handler.
        const
            limit = this.limit,
            offset = this.offset,
            transition = Animation.createTransition(),
            output_length = output.length,
            active_window_start = offset * this.shift_amount;

        let i = 0;

        //Scopes on the ascending edge of the transition window
        while (i < active_window_start && i < output_length)
            output[i].update({ trs_asc_out: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }), i++;

        //Scopes in the transtion window
        while (i < active_window_start + limit && i < output_length)
            output[i].update({ arrange: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }), i++;

        //Scopes on the descending edge of the transition window
        while (i < output_length)
            output[i].update({ trs_dec_out: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }), i++;

        transition.play(1);

    }

    render(transition, output = this.activeScopes, NO_TRANSITION = false) {


        let
            active_window_size = this.limit,
            offset = this.offset,
            j = 0,
            output_length = output.length,
            active_length = this.dom_scopes.length,
            direction = 1,
            OWN_TRANSITION = false;

        if (!transition) transition = Animation.createTransition(), OWN_TRANSITION = true;

        offset = Math.max(0, offset);

        const active_window_start = offset * this.shift_amount;

        direction = Math.sign(this.offset_diff);

        if (active_window_size > 0) {

            this.shift_amount = Math.max(1, Math.min(active_window_size, this.shift_amount));

            let
                i = 0,
                oa = 0,
                ein = [],
                shift_points = Math.ceil(output_length / this.shift_amount);

            this.max = shift_points - 1;
            this.offset = Math.max(0, Math.min(shift_points - 1, offset));

            //Two transitions to support scrubbing from an offset in either direction
            this.trs_ascending = Animation.createTransition(false);
            this.trs_descending = Animation.createTransition(false);

            this.dom_dn.length = 0;
            this.dom_up.length = 0;
            this.dom_up_appended = false;
            this.dom_dn_appended = false;

            //Scopes preceeding the transition window
            while (i < active_window_start - this.shift_amount) output[i++].index = -2;

            //Scopes entering the transition window ascending
            while (i < active_window_start) {
                this.dom_dn.push(output[i]);
                output[i].update({ trs_dec_in: { trs: this.trs_descending.in, pos: getColumnRow(i, this.offset - 1, this.shift_amount) } });
                output[i++].index = -2;
            }

            //Scopes in the transtion window
            while (i < active_window_start + active_window_size && i < output_length) {
                //Scopes on the descending edge of the transition window
                if (oa < this.shift_amount && ++oa) {
                    //console.log("pos",i, getColumnRow(i, this.offset+1, this.shift_amount), output[i].scopes[0].ele.style.transform)
                    output[i].update({ trs_asc_out: { trs: this.trs_ascending.out, pos: getColumnRow(i, this.offset + 1, this.shift_amount) } });
                } else
                    output[i].update({ arrange: { trs: this.trs_ascending.in, pos: getColumnRow(i, this.offset + 1, this.shift_amount) } });


                //Scopes on the ascending edge of the transition window
                if (i >= active_window_start + active_window_size - this.shift_amount)
                    output[i].update({ trs_dec_out: { trs: this.trs_descending.out, pos: getColumnRow(i, this.offset - 1, this.shift_amount) } });
                else
                    output[i].update({ arrange: { trs: this.trs_descending.in, pos: getColumnRow(i, this.offset - 1, this.shift_amount) } });


                output[i].index = i;
                ein.push(output[i++]);
            }

            //Scopes entering the transition window while offset is descending
            while (i < active_window_start + active_window_size + this.shift_amount && i < output_length) {
                this.dom_up.push(output[i]);
                output[i].update({
                    trs_asc_in: {
                        pos: getColumnRow(i, this.offset + 1, this.shift_amount),
                        trs: this.trs_ascending.in
                    }
                });
                output[i++].index = -3;
            }

            //Scopes following the transition window
            while (i < output_length) output[i++].index = -3;

            output = ein;
            output_length = ein.length;
        } else {
            this.max = 0;
            this.limit = 0;
        }

        let trs_in = { trs: transition.in, index: 0 };
        let trs_out = { trs: transition.out, index: 0 };

        for (let i = 0; i < output_length; i++) output[i].index = i;

        for (let i = 0; i < active_length; i++) {

            const as = this.dom_scopes[i];

            if (as.index > j) {
                while (j < as.index && j < output_length) {
                    const os = output[j];
                    os.index = -1;
                    trs_in.pos = getColumnRow(j, this.offset, this.shift_amount);

                    os.appendToDOM(this.ele, as.ele);
                    os.transitionIn(trs_in, (direction) ? "trs_asc_in" : "trs_dec_in");
                    j++;
                }
            } else if (as.index < 0) {
                trs_out.pos = getColumnRow(i, 0, this.shift_amount);
                if (!NO_TRANSITION) {
                    switch (as.index) {
                        case -2:
                        case -3:
                            as.transitionOut(trs_out, (direction > 0) ? "trs_asc_out" : "trs_dec_out");
                            break;
                        default:{
                            as.transitionOut(trs_out);
                        }
                    }
                } else {
                    as.transitionOut();
                }

                continue;
            }
            trs_in.pos = getColumnRow(j++, 0, this.shift_amount);
            as.update({ arrange: trs_in });
            as._TRANSITION_STATE_ = true;
            as.index = -1;
        }

        while (j < output.length) {
            output[j].appendToDOM(this.ele);
            output[j].index = -1;
            trs_in.pos = getColumnRow(j, this.offset, this.shift_amount);

            output[j].transitionIn(trs_in, (direction) ? "arrange" : "arrange");
            j++;
        }

        this.ele.style.position = this.ele.style.position;
        this.dom_scopes = output;

        this.parent.upImport("template_count_changed", {
            displayed: output_length,
            offset: offset,
            count: this.activeScopes.length,
            pages: this.max,
            ele: this.ele,
            template: this,
            trs: transition.in
        });

        if (OWN_TRANSITION) {
            if (NO_TRANSITION)
                return transition;
            transition.start();
        }

        return transition;
    }

    /**
     * Filters stored Scopes with search terms and outputs the matching Scopes to the DOM.
     * 
     * @protected
     */
    filterUpdate() {

        let output = this.scopes.slice();

        if (output.length < 1) return;
        
        for (let i = 0, l = this.filters.length; i < l; i++) {
            const filter = this.filters[i];
            
            if(filter.ARRAY_ACTION)
                output = filter.action(output);
        }

        this.activeScopes = output;
        
        this.UPDATE_FILTER = false;

        return output;
    }

    filterExpressionUpdate(transition = Animation.createTransition()) {
        // Filter the current components. 
        this.filterUpdate();

        this.limitExpressionUpdate(transition);
    }

    limitExpressionUpdate(transition = Animation.createTransition()){
        //Preset the positions of initial components. 
        this.arrange();

        this.render(transition);

        // If scrubbing is currently occuring, if the transition were to auto play then the results 
        // would interfere with the expected behavior of scrubbing. So the transition
        // is instead set to it's end state, and scrub is called to set intermittent 
        // position. 
        if (!this.SCRUBBING)
            transition.start();
    }

    /**
     * Removes stored Scopes that do not match the ModelContainer contents. 
     *
     * @param      {Array}  new_items  Array of Models that are currently stored in the ModelContainer. 
     * 
     * @protected
     */
    cull(new_items = []) {

        const transition = Animation.createTransition();

        if (new_items.length == 0) {
            let sl = this.scopes.length;
            for (let i = 0; i < sl; i++) this.scopes[i].transitionOut(transition, "", true);
            this.scopes.length = 0;
            this.parent.upImport("template_count_changed", {
                displayed: 0,
                offset: 0,
                count: 0,
                pages: 0,
                ele: this.ele,
                template: this,
                trs: transition.in
            });

            if (!this.SCRUBBING)
                transition.start();

        } else {

            const
                exists = new Map(new_items.map(e => [e, true])),
                out = [];

            for (let i = 0, l = this.activeScopes.length; i < l; i++)
                if (exists.has(this.activeScopes[i].model))
                    exists.set(this.activeScopes[i].model, false);


            for (let i = 0, l = this.scopes.length; i < l; i++)
                if (!exists.has(this.scopes[i].model)) {
                    this.scopes[i].transitionOut(transition, "dismounting", true);
                    this.scopes[i].index = -1;
                    this.scopes.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.scopes[i].model, false);

            exists.forEach((v, k, m) => { if (v) out.push(k); });

            if (out.length > 0) {
                // Wrap models into components
                this.added(out, transition);

            } else {
                for (let i = 0, j = 0, l = this.activeScopes.length; i < l; i++, j++) {

                    if (this.activeScopes[i]._TRANSITION_STATE_) {
                        if (j !== i) {
                            this.activeScopes[i].update({
                                arrange: {
                                    pos: getColumnRow(i, this.offset, this.shift_amount),
                                    trs: transition.in
                                }
                            });
                        }
                    } else
                        this.activeScopes.splice(i, 1), i--, l--;
                }
            }

            this.filterExpressionUpdate(transition);
        }
    }
    /**
     * Called by the ModelContainer when Models have been removed from its set.
     *
     * @param      {Array}  items   An array of items no longer stored in the ModelContainer. 
     */
    removed(items, transition = Animation.createTransition()) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            for (let j = 0; j < this.scopes.length; j++) {
                let Scope = this.scopes[j];
                if (Scope.model == item) {
                    this.scopes.splice(j, 1);
                    Scope.transitionOut(transition, "", true);
                    break;
                }
            }
        }

        this.filterExpressionUpdate(transition);
    }
    /**
     * Called by the ModelContainer when Models have been added to its set.
     *
     * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
     */
    added(items, transition) {
        let OWN_TRANSITION = false;

        if (!transition)
            transition = Animation.createTransition(), OWN_TRANSITION = true;

        for (let i = 0; i < items.length; i++) {
            const scope = this.component.mount(null, items[i]);

            //TODO: Make sure both of there references are removed when the scope is destroyed.
            this.scopes.push(scope);
            this.parent.addScope(scope);
        }


        if (OWN_TRANSITION) 
            this.filterExpressionUpdate(transition);
    }

    revise() {
        if (this.cache) this.update(this.cache);
    }

    getTerms() {
        let out_terms = [];
        for (let i = 0, l = this.terms.length; i < l; i++) {
            let term = this.terms[i].term;
            if (term) out_terms.push(term);
        }
        if (out_terms.length == 0) return null;
        return out_terms;
    }

    get() {
        if (this.model instanceof MultiIndexedContainer) {
            if (this.data.index) {
                let index = this.data.index;
                let query = {};
                query[index] = this.getTerms();
                return this.model.get(query)[index];
            } else console.warn("No index value provided for MultiIndexedContainer!");
        } else {
            let scope = this.model.scope;
            let terms = this.getTerms();
            if (scope) {
                this.model.destroy();
                let model = scope.get(terms, null);
                model.pin();
                model.addObserver(this);
            }
            return this.model.get(terms);
        }
        return [];
    }

    down(data, changed_values) {
        for (let i = 0, l = this.activeScopes.length; i < l; i++) this.activeScopes[i].down(data, changed_values);
    }
}

ScopeContainer.prototype.removeIO = Tap.prototype.removeIO;
ScopeContainer.prototype.addIO = Tap.prototype.addIO;

class d$3 {
    // Compiles the component to a HTML file. 
    // Returns a string representing the file data.
    compileToHTML(bound_data_object) {

    }

    // Compiles the component to a JS file
    // Returns a string representing the file data.
    compileToJS(bound_data_object) {

    }

    //Registers the component as a Web Component.
    //Herafter the Web Component API will be used to mount this component. 
    register(bound_data_object) {

        if (!this.name)
            throw new Error("This component has not been defined with a name. Unable to register it as a Web Component.");

        if (customElements.get(this.name))
            console.trace(`Web Component for name ${this.name} has already been defined. It is now being redefined.`);

        customElements.define(
            this.name,
            d$3.web_component_constructor(this, bound_data_object), {}
        );
    }

    //Mounts component data to new HTMLElement object.
    async mount(HTMLElement_, bound_data_object) {

        if (this.READY !== true) {
            if (!this.__pending)
                this.__pending = [];

            return new Promise(res =>this.__pending.push([HTMLElement_, bound_data_object, res]))
        }

        return this.nonAsyncMount(HTMLElement_, bound_data_object);
    }

    nonAsyncMount(HTMLElement_, bound_data_object = null){
        let element = HTMLElement_;

        if ((HTMLElement_ instanceof HTMLElement)) {
            //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

            //element = HTMLElement_.attachShadow({ mode: 'open' });
        }

        const scope = this.ast.mount(element);

        scope.load(bound_data_object);

        return scope;
    }

    connect(h, b) { return this.mount(h, b) }
}

d$3.web_component_constructor = function(wick_component, bound_data) {
    return class extends HTMLElement {
        constructor() {
            super();
            wick_component.mount(this, bound_data);
        }
    };
};

class fltr extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "f", null, attribs, presets);

		this.type = 0;

		if(this.attribs[0])
			this.attribs[0].value.setForContainer();
	}

	mount(scope, container){
		const io = this.attribs[0].value.bind(scope);
		io.bindToContainer(this.attribs[0].name, container);
	}
}

/******************** Expressions **********************/

class ExpressionIO extends ScriptIO {
    constructor(ele, scope, errors, tap, binding, lex, pinned) {
        super(scope, errors, tap, binding, lex, pinned);
        this.ele = ele;
        this.old_val = null;
        this._SCHD_ = 0;
        this.ACTIVE = true;
        this.containerFunction = this.containerFunction.bind(this);
    }

    updateProp(io, val) {
        super.updateProp(io, val);
        this.down();
    }

    down(v, m) {
        this.val = super.down(v, m);
        
        if (!this._SCHD_){
            this.ele.data = this.val;
            this.old_val = this.val;
            spark.queueUpdate(this);
        }
    }

    scheduledUpdate() {
        if(this.val !== this.old_val)
            this.ele.data = this.val;
    }
}

/******************** Expressions **********************/

class Container extends ScriptIO {
    constructor(container, scope, errors, tap, binding, lex, pinned) {
        super(scope, errors, tap, binding, lex, pinned);

        this.container = container;

        //Reference to function that is called to modify the host container. 
        this.action = null;

        this.ARRAY_ACTION = false;
    }

    bindToContainer(type, container) {
        this.container = container;

        switch (type) {
            case "sort":
                this.ARRAY_ACTION = true;
                container.filters.push(this);
                this.action = this.sort;
                break;
            case "filter":
                this.ARRAY_ACTION = true;
                container.filters.push(this);
                this.action = this.filter;
                break;
            case "scrub":
                this.action = this.scrub;
                break;
            case "offset":
                this.action = this.offset;
                break;
            case "limit":
                this.action = this.limit;
                break;
            case "shift_amount":
                this.action = this.shift_amount;
                break;
        }
    }

    destroy() {
        super.destroy;
        this.container = null;
    }

    updateProp(io, val) {
        super.updateProp(io, val);
        this.down();
    }

    setValue(value) {
        if (Array.isArray(value)) {
            value.forEach((v, i) => this.arg_props[i] = v);
            this.active_IOS = this.IO_ACTIVATIONS;
        } else if (typeof(value) == "object") {
            //Distribute iterable properties amongst the IO_Script's own props.
            for (const a in value) {
                if (this.arg_ios[a])
                    this.arg_ios[a].down(value[a]);
            }
        } else {
            if (this.TAP_BINDING !== -1)
                this.arg_props[this.TAP_BINDING] = value;
        }
    }

    down(v, m) {
        let old = this.val;
        this.val = super.down(v, m);

        if (this.ARRAY_ACTION){
            this.container.filterExpressionUpdate();
        }

        else if (this.val !== undefined && val !== old) {
            this.action();
            this.container.limitExpressionUpdate();
        }
    }

    containerFunction(...data) {
        return super.down(data);
    }

    scheduledUpdate() {
        this.ele.data = this.val;
    }

    filter(array) {
        return array.filter((a) => super.down([a]));
    }

    sort(array) {
        return array.sort((a, b) => super.down([a, b]));
    }

    scrub() {
        this.container.scrub = this.val;
    }

    offset() {
        this.container.offset_diff = this.val - this.container.offset;
        this.container.offset = this.val;
    }

    limit() {
        this.container.limit = this.val;
    }

    shift_amount() {
        this.container.shift_amount = this.val;
    }
}

const EXPRESSION = 5;
const IDENTIFIER = 6;
const CONTAINER = 7;
const BOOL = 8;

class Binding {

    constructor(sym, env, lex) {
        this.lex = lex.copy();
        this.lex.sl = lex.off - 3;
        this.lex.off = env.start;

        this.METHOD = IDENTIFIER;

        this.ast = sym[1];
        this.prop = (sym.length > 3) ? sym[3] : null;

        this.function = null;
        this.args = null;
        this.READY = false;

        this.val = this.ast + "";

        if (!(this.ast instanceof identifier$1) && !(this.ast instanceof member_expression))
            this.processJSAST(env.presets);
        
    }

    toString() {
        if (this.prop)
            return `((${this.ast + ""})(${this.prop + ""}))`;
        else
            return `((${this.ast + ""}))`;
    }

    processJSAST(presets = { custom: {} }) {
        const {args, ids} = GetOutGlobals(this.ast, presets);

        this.args = args;

        AddEmit(ids, presets);

        let r = new return_statement([]);
        r.vals[0] = this.ast;
        this.ast = r;
        this.val = r + "";
        this.METHOD = EXPRESSION;
        scr.prototype.finalize.call(this);
    }

    setForContainer() {
        if (this.METHOD == EXPRESSION)
            this.METHOD = CONTAINER;
    }

    bind(scope, element, pinned) {
        if (this.METHOD == EXPRESSION) {
            return new ExpressionIO(element, scope, [], scope, this, this.lex, pinned);
        } else if (this.METHOD == CONTAINER)
            return new Container(element, scope, [], scope, this, this.lex, pinned);
        else
            return scope.getTap(this.val);
    }
}

Binding.type = {
    Attribute: 0,
    TextNode: 1,
    Style: 2
};

class TextNode {

    constructor(sym, env) {
        this.data = sym[0];
        this.IS_BINDING = (this.data instanceof Binding);
        this.tag = "text";
    }

    toString(off = 0) {
        return `${offset.repeat(off)} ${this.data.toString()}\n`;
    }

    finalize(){
        return this;
    }

    get IS_WHITESPACE(){
        return !this.IS_BINDING && (!this.data.trim());
    }

    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {

        if (ele instanceof Text)
            element.appendChild(ele);

        if (this.IS_BINDING)
            return new DataNodeIO(scope, this.data.bind(scope), ele, this.data.exprb);
        else
            ele.data = this.data;
    }
}

function BaseComponent(ast, presets) {
    this.ast = ast;
    this.READY = true;
    this.presets = presets;
    //Reference to the component name. Used with the Web Component API
    this.name = "";
}

Object.assign(BaseComponent.prototype,d$3.prototype);
BaseComponent.prototype.mount = d$3.prototype.nonAsyncMount;

class ctr extends ElementNode {
    
    constructor(env, tag, children, attribs, presets) {
        super(env, "container", children, attribs, presets);

        this.filters = null;
        this.property_bind = null;
        this.scope_children = null;

        //Tag name of HTMLElement the container will create;
        this.element = this.getAttribute("element") || "ul";

        this.filters = null;
        this.nodes = null;
        this.binds = null;
    }

    finalize(slots = {}){
        super.finalize(slots);

        const children = this.children;

        this.filters = children.reduce((r, c) => { if (c instanceof fltr) r.push(c); return r }, []);
        this.nodes = children.reduce((r, c) => { if (c instanceof ElementNode && !(c instanceof fltr)) r.push(c); return r }, []);
        this.binds = children.reduce((r, c) => { if (c instanceof TextNode && c.IS_BINDING) r.push(c); return r }, []);

        //Keep in mind slots!;
        this.component_constructor = (this.nodes.length > 0) ? new BaseComponent(this.nodes[0], this.presets) : null;

        return this;
    }

    merge(node) {
        const merged_node = super.merge(node);
        merged_node.filters = this.filters;
        merged_node.nodes = this.filters;
        merged_node.binds = this.binds;
        merged_node.MERGED = true;
        return merged_node;
    }

    mount(element, scope, presets, slots, pinned) {
        
        scope = scope || new Scope(null, presets, element, this);

        const
            ele = createElement(this.element),
            container = new ScopeContainer(scope, presets, ele);

        appendChild(element, ele);

        this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

        if(this.component_constructor)
            container.component = this.component_constructor;

        for (let i = 0; i < this.filters.length; i++)
            this.filters[i].mount(scope, container);

        for (let i = 0, l = this.attribs.length; i < l; i++)
            this.attribs[i].bind(ele, scope, pinned);

        if (this.binds.length > 0) {
            for (let i = 0; i < this.binds.length; i++)
                this.binds[i].mount(null, scope, presets, slots, pinned, container);
        }else{ 
            //If there is no binding, then there is no potential to have ModelContainer borne components.
            //Instead, load any existing children as component entries for the container element. 
            for (let i = 0; i < this.nodes.length; i++)
                container.scopes.push(this.nodes[i].mount(null, null, presets, slots));
            container.filterUpdate();
            container.render();
        }

        return scope;
    }
}

//import css from "@candlefw/css";

class sty extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		//css;

		let data = children[0].data;
		/*
		css(data).then(css=>{
			debugger
		});
		*/
		super(env, "style", children, attribs, presets);
	}

	finalize(){return this}
	render(){}
	mount(){}
}

class v$2 extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, tag, children, attribs, presets);
	}
}

class svg extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "svg", children, attribs, presets);
	}
}

class slt extends ElementNode{
	finalize(){
		this.name = this.getAttribute("name");
		return this;
	}

	mount(element, scope, presets, slots, pinned){
		if(slots && slots[this.name]){
			let ele = slots[this.name];
			slots[this.name] = null;
			ele(element, scope, presets, slots, pinned);
		}
	}
}

class pre extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "pre", children, attribs, presets);
	}
}

class Import extends ElementNode{

	constructor(env, tag, children, attribs, presets){
		super(env, "import", null, attribs, presets);
		this.url = URL.resolveRelative(this.getAttribute("url"), env.url);
		this.load(env);
	}

	async load(env){
		try{
			const own_env = new CompilerEnvironment(env.presets, env);
			own_env.setParent(env);

			const txt_data = await this.url.fetchText();

			own_env.pending++;

			const ast = parser(whind$1(txt_data), own_env);
			own_env.resolve();

		}catch(err){
			console.error(err);
		}
	}
		
	loadURL(){/*Intentional*/ return;}
}

//import Plugin from "./../plugin.mjs";

function processChildren(children, env, lex) {

    let PREVIOUS_NODE = null;
    let RETRY = false;
    let previous = null;
    if (children.length > 1){
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            //If meta is true, then a wickup node was created. Use the tag name to determine the next course of action. 
            const tag = node.tag;
            const meta = node.wickup;

            if (meta) {
                switch (tag) {
                    case "blockquote":
                        node.wickup = false;
                        RETRY = true;
                        if (PREVIOUS_NODE && PREVIOUS_NODE.tag == "blockquote") {
                            let level = 1,
                                ul = PREVIOUS_NODE;
                            while (level < meta) {
                                let ul_child = ul.children[ul.children.length - 1];
                                if (ul_child && ul_child.tag == "blockquote") {
                                    ul = ul_child;
                                } else {
                                    ul_child = es("blockquote", null, [], env, lex);
                                    ul.children.push(ul_child);
                                    ul = ul_child;
                                }

                                level++;
                            }
                            ul.children.push(...node.children);
                            children.splice(i, 1);
                            i--;
                            node = PREVIOUS_NODE;
                        }
                        break;
                }
            } else {

                //This will roll new nodes into the previous node as children of the previous node if the following conditions are met:
                // 1. The previous node is a wickup node of type either UL or Blockquote
                // 2. The new node is anything other than a text node containing only white space. 
                if (PREVIOUS_NODE) {
                    if (node.tag !== "text" || (!node.IS_WHITESPACE)) {

                        if (PREVIOUS_NODE.wickup)
                            switch (PREVIOUS_NODE.tag) {
                                case "blockquote":

                                    let bq = PREVIOUS_NODE;
                                    //Insert into last li. if the last 
                                    while (1) {
                                        let bq_child = bq.children[bq.children.length - 1];
                                        if (!bq_child) throw "Messing up!";
                                        if (bq_child.tag == "blockquote") {
                                            bq = bq_child;
                                            break;
                                        } else {
                                            bq = bq_child;
                                        }
                                    }
                                    bq.children.push(node);
                                    children.splice(i, 1);
                                    i--;
                                    node = PREVIOUS_NODE;
                                    break;
                                    //return null;
                            }
                    } else {
                        let node2 = children[i + 1];
                        if (node2) {
                            if (node2.tag !== "text" || node2.IS_WHITESPACE){
                                continue;
                            }
                        }
                    }
                }
            }

            PREVIOUS_NODE = node;
        }
        PREVIOUS_NODE= null;
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            //If meta is true, then a wickup node was created. Use the tag name to determine the next course of action. 
            const tag = node.tag;
            const meta = node.wickup;

            if (meta) {
                switch (tag) {
                    case "li":
                        if (PREVIOUS_NODE && PREVIOUS_NODE.tag == "ul") {
                            let level = 1,
                                ul = PREVIOUS_NODE;
                            while (level < meta) {
                                let ul_child = ul.children[ul.children.length - 1];
                                if (ul_child && ul_child.tag == "ul") {
                                    ul = ul_child;
                                } else {
                                    ul_child = es("ul", null, [], env, lex);
                                    ul.children.push(ul_child);
                                    ul = ul_child;
                                }

                                level++;
                            }
                            ul.children.push(node);
                            children.splice(i, 1);
                            i--;
                            node = PREVIOUS_NODE;
                        } else {
                            children[i] = es("ul", null, [node], env, lex, true);
                            node = children[i];
                        }
                        break;
                    }
            } else {

                //This will roll new nodes into the previous node as children of the previous node if the following conditions are met:
                // 1. The previous node is a wickup node of type either UL or Blockquote
                // 2. The new node is anything other than a text node containing only white space. 
                if (PREVIOUS_NODE) {
                    if (node.tag !== "text" || (!node.IS_WHITESPACE)) {

                        if (PREVIOUS_NODE.wickup)
                            switch (PREVIOUS_NODE.tag) {
                                case "ul":
                                    let ul = PREVIOUS_NODE;
                                    //Insert into last li. if the last 
                                    while (1) {
                                        let ul_child = ul.children[ul.children.length - 1];
                                        if (!ul_child) throw "Messing up!";
                                        if (ul_child.tag == "li") {
                                            ul = ul_child;
                                            break;
                                        } else {
                                            ul = ul_child;
                                        }
                                    }
                                    ul.children.push(node);

                                   const node2 = children[i + 1];

                                    if (node2) {
                                        if (node2.tag == "text" && node2.IS_WHITESPACE){
                                            children.splice(i+1, 1);
                                             //i--;
                                        }

                                    }

                                    children.splice(i, 1);
                                    i--;


                                    node = PREVIOUS_NODE;
                                    break;

                                    //return null;
                            }
                    } else {
                        let node2 = children[i + 1];
                        if (node2) {
                            if (node2.tag !== "text" || node2.IS_WHITESPACE){
                                console.log("node2:",node2);
                                //continue;
                            }
                        }
                    }
                }
            }
            PREVIOUS_NODE = node;
        }
    }
}

function es(tag, attribs, children, env, lex, meta = 0) {

    const
        FULL = !!children;
        attribs = attribs || [],
        children = (Array.isArray(children)) ? children : children ? [children] : [];


    if (children) processChildren(children, env, lex);

    const presets = env.presets;

    let node = null,
        cstr = null;
    console.log(tag);

    switch (tag) {
        case "text":
            break;
        case "filter":


        case "f":
            cstr = fltr;
            break;
        case "a":
            cstr = a$2;
            break;
            /** void elements **/
        case "template":
            cstr = v$2;
            break;
        case "css":
        case "style":
            cstr = sty;
            break;
        case "script":
            cstr = scr;
            break;
        case "svg":
        case "path":
            cstr = svg;
            break;
        case "container":
            cstr = ctr;
            break;
        case "scope":
            cstr = scp;
            break;
        case "slot":
            cstr = slt;
            break;
        case "import":
            cstr = Import;
            break;
            //Elements that should not be parsed for binding points.
        case "pre":
            cstr = pre;
            break;
        case "code":
        default:
            cstr = ElementNode;
            break;
    }

    node = new cstr(env, tag, children, attribs, presets);

    node.wickup = meta || false;

    node.SINGLE = !FULL;


    return node;
}

//import EventIO from "../component/io/event_io.mjs"

class Attribute {

    constructor(sym) {

        const
            HAS_VALUE = sym.length > 1,
            name = sym[0],
            val = (HAS_VALUE) ? sym[2] : null;

        this.name = name;
        this.value = val;
        this.io_constr = AttribIO;
        this.isBINDING = false;
        this.RENDER = true;

        if (this.value instanceof Binding)
            this.isBINDING = true;
    }

    link(element) {
        const tag = element.tag;

        if (this.isBINDING) {

            if (this.name.slice(0, 2) == "on")
                this.io_constr = EventIO;

            else

            if (this.name == "value" && (tag == "input" || tag == "textarea"))
                this.io_constr = InputIO;
        }

    }

    bind(element, scope, pinned) {
        if (this.RENDER)
            if (!this.isBINDING)
                element.setAttribute(this.name, this.value);
            else {
                const
                    bind = this.value.bind(scope, pinned),
                    io = new this.io_constr(scope, [], bind, this.name, element, this.value.default);
            }
    }
}

/**
 * To be extended by objects needing linked list methods.
 */
const LinkedList$1 = {

    props: {
        /**
         * Properties for horizontal graph traversal
         * @property {object}
         */
        defaults: {
            /**
             * Next sibling node
             * @property {object | null}
             */
            nxt: null,

            /**
             * Previous sibling node
             * @property {object | null}
             */
            prv: null
        },

        /**
         * Properties for vertical graph traversal
         * @property {object}
         */
        children: {
            /**
             * Number of children nodes.
             * @property {number}
             */
            noc: 0,
            /**
             * First child node
             * @property {object | null}
             */
            fch: null,
        },
        parent: {
            /**
             * Parent node
             * @property {object | null}
             */
            par: null
        }
    },

    methods: {
        /**
         * Default methods for Horizontal traversal
         */
        defaults: {

            insertBefore: function(node) {

                if (!this.nxt && !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if(node){
                    if (node.prv)
                       node.prv.nxt = node.nxt;
                    
                    if(node.nxt) 
                        node.nxt.prv = node.prv;
                
                    node.prv = this.prv;
                    node.nxt = this;
                    this.prv.nxt = node;
                    this.prv = node;
                }else{
                    if (this.prv)
                        this.prv.nxt = node;
                    this.prv = node;
                } 
            },

            insertAfter: function(node) {

                if (!this.nxt && !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if(node){
                    if (node.prv)
                       node.prv.nxt = node.nxt;
                    
                    if(node.nxt) 
                        node.nxt.prv = node.prv;
                
                    node.nxt = this.nxt;
                    node.prv = this;
                    this.nxt.prv = node;
                    this.nxt = node;
                }else{
                    if (this.nxt)
                        this.nxt.prv = node;
                    this.nxt = node;
                } 
            }
        },
        /**
         * Methods for both horizontal and vertical traversal.
         */
        parent_child: {
            /**
             *  Returns eve. 
             * @return     {<type>}  { description_of_the_return_value }
             */
            root() {
                return this.eve();
            },
            /**
             * Returns the root node. 
             * @return     {Object}  return the very first node in the linked list graph.
             */
            eve() {
                if (this.par)
                    return this.par.eve();
                return this;
            },

            push(node) {
                this.addChild(node);
            },

            unshift(node) {
                this.addChild(node, (this.fch) ? this.fch.pre : null);
            },

            replace(old_node, new_node) {
                if (old_node.par == this && old_node !== new_node) {
                    if (new_node.par) new_node.par.remove(new_node);

                    if (this.fch == old_node) this.fch = new_node;
                    new_node.par = this;


                    if (old_node.nxt == old_node) {
                        new_node.nxt = new_node;
                        new_node.prv = new_node;
                    } else {
                        new_node.prv = old_node.prv;
                        new_node.nxt = old_node.nxt;
                        old_node.nxt.prv = new_node;
                        old_node.prv.nxt = new_node;
                    }

                    old_node.par = null;
                    old_node.prv = null;
                    old_node.nxt = null;
                }
            },

            insertBefore: function(node) {
                if (this.par)
                    this.par.addChild(node, this.pre);
                else
                    LinkedList$1.methods.defaults.insertBefore.call(this, node);
            },

            insertAfter: function(node) {
                if (this.par)
                    this.par.addChild(node, this);
                else
                    LinkedList$1.methods.defaults.insertAfter.call(this, node);
            },

            addChild: function(child = null, prev = null) {

                if (!child) return;

                if (child.par)
                    child.par.removeChild(child);

                if (prev && prev.par && prev.par == this) {
                    if (child == prev) return;
                    child.prv = prev;
                    prev.nxt.prv = child;
                    child.nxt = prev.nxt;
                    prev.nxt = child;
                } else if (this.fch) {
                    child.prv = this.fch.prv;
                    this.fch.prv.nxt = child;
                    child.nxt = this.fch;
                    this.fch.prv = child;
                } else {
                    this.fch = child;
                    child.nxt = child;
                    child.prv = child;
                }

                child.par = this;
                this.noc++;
            },

            /**
             * Analogue to HTMLElement.removeChild()
             *
             * @param      {HTMLNode}  child   The child
             */
            removeChild: function(child) {
                if (child.par && child.par == this) {
                    child.prv.nxt = child.nxt;
                    child.nxt.prv = child.prv;

                    if (child.prv == child || child.nxt == child) {
                        if (this.fch == child)
                            this.fch = null;
                    } else if (this.fch == child)
                        this.fch = child.nxt;

                    child.prv = null;
                    child.nxt = null;
                    child.par = null;
                    this.noc--;
                }
            },

            /**
             * Gets the next node. 
             *
             * @param      {HTMLNode}  node    The node to get the sibling of.
             * @return {HTMLNode | TextNode | undefined}
             */
            getNextChild: function(node = this.fch) {
                if (node && node.nxt != this.fch && this.fch)
                    return node.nxt;
                return null;
            },

            /**
             * Gets the child at index.
             *
             * @param      {number}  index   The index
             */
            getChildAtIndex: function(index, node = this.fch) {
                if(node.par !== this)
                    node = this.fch;

                let first = node;
                let i = 0;
                while (node && node != first) {
                    if (i++ == index)
                        return node;
                    node = node.nxt;
                }

                return null;
            },
        }
    },

    gettersAndSetters : {
        peer : {
            next: {
                enumerable: true,
                configurable: true,
                get: function() {
                    return this.nxt;
                },
                set: function(n) {
                    this.insertAfter(n);
                }
            },
            previous: {
                enumerable: true,
                configurable: true,
                get: function() {
                    return this.prv;
                },
                set: function(n) {
                    this.insertBefore(n);
                }   
            }
        },
        tree : {
            children: {
                enumerable: true,
                configurable: true,
                /**
                 * @return {array} Returns an array of all children.
                 */
                get: function() {
                    for (var z = [], i = 0, node = this.fch; i++ < this.noc;)(
                        z.push(node), node = node.nxt
                    );
                    return z;
                },
                set: function(e) {
                    /* No OP */
                }
            },
            parent: {
                enumerable: true,
                configurable: true,
                /**
                 * @return parent node
                 */
                get: function() {
                    return this.par;
                },
                set: function(p) {
                    if(p && p.addChild)
                        p.addChild(this);
                    else if(p === null && this.par)
                        this.par.removeChild(this);
                }
            }
        }
    },


    mixin : (constructor)=>{
        const proto = (typeof(constructor) == "function") ? constructor.prototype : (typeof(constructor) == "object") ? constructor : null;
        if(proto){
            Object.assign(proto, 
                LinkedList$1.props.defaults, 
                LinkedList$1.methods.defaults
            );
        }
        Object.defineProperties(proto, LinkedList$1.gettersAndSetters.peer);
    },

    mixinTree : (constructor)=>{
        const proto = (typeof(constructor) == "function") ? constructor.prototype : (typeof(constructor) == "object") ? constructor : null;
        if(proto){
            Object.assign(proto, 
                LinkedList$1.props.defaults, 
                LinkedList$1.props.children, 
                LinkedList$1.props.parent, 
                LinkedList$1.methods.defaults, 
                LinkedList$1.methods.parent_child
                );
            Object.defineProperties(proto, LinkedList$1.gettersAndSetters.tree);
            Object.defineProperties(proto, LinkedList$1.gettersAndSetters.peer);
        }
    }
};

let fn$2 = {}; const 
/************** Maps **************/

    /* Symbols To Inject into the Lexer */
    symbols$2 = ["||","^=","$=","*=","<="],

    /* Goto lookup maps */
    gt0$2 = [0,-1,4,2,7,3,1,10,8,-2,9,-5,5,-1,16,-4,17,-10,15,-45,12,-4,13],
gt1$2 = [0,-1,19,-1,7,18,-1,10,8,-2,9,-5,5,-1,16,-4,17,-10,15,-45,12,-4,13],
gt2$2 = [0,-3,20,-2,10,8,-2,9,-5,21,-1,16,-4,17,-10,15,-45,12,-4,13],
gt3$2 = [0,-10,31,-5,21,-1,16,-4,17,-10,15,-66,32,30,-2,29,-1,33],
gt4$2 = [0,-78,36,35,-5,38,37],
gt5$2 = [0,-81,44,-1,62,45,-2,43,51,48,47,53,54,55,-1,56,-3,57,63],
gt6$2 = [0,-11,67,68,-59,71,-4,70],
gt7$2 = [0,-33,75,-1,78,-1,76,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt8$2 = [0,-19,91,-57,93],
gt9$2 = [0,-28,94,96,98,101,100,-21,99],
gt10$2 = [0,-10,31,-5,21,-1,16,-4,17,-10,15,-66,32,30,-2,104,-1,33],
gt11$2 = [0,-80,105,-4,13],
gt12$2 = [0,-10,108,-5,21,-1,16,-4,17,-10,15,-68,110,109,-2,111],
gt13$2 = [0,-78,114,-6,38,37],
gt14$2 = [0,-85,115],
gt15$2 = [0,-81,116,-1,62,117,-6,53,54,55,-1,56,-3,57,63],
gt16$2 = [0,-83,62,119,-6,121,54,55,-1,56,-3,57,63],
gt17$2 = [0,-83,123,-16,63],
gt18$2 = [0,-88,51,131,130],
gt19$2 = [0,-99,134],
gt20$2 = [0,-82,136,-16,137],
gt21$2 = [0,-12,138,-59,71,-4,70],
gt22$2 = [0,-14,140,-18,141,-1,78,-1,76,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt23$2 = [0,-73,144,143],
gt24$2 = [0,-75,147,146],
gt25$2 = [0,-71,149,-5,150],
gt26$2 = [0,-66,153],
gt27$2 = [0,-36,155],
gt28$2 = [0,-41,159,157,-1,161,158],
gt29$2 = [0,-47,163,-1,87,-4,88],
gt30$2 = [0,-38,80,164,82,-2,83,-2,81,84,165,87,-4,88,168,-6,170,172,169,171,-1,175,-2,174],
gt31$2 = [0,-29,179,98,101,100,-21,99],
gt32$2 = [0,-24,182,180,184,181],
gt33$2 = [0,-28,186,96,98,101,100,-21,99,-52,187],
gt34$2 = [0,-101,194,-5,33],
gt35$2 = [0,-108,198,196,195],
gt36$2 = [0,-83,62,201,-6,121,54,55,-1,56,-3,57,63],
gt37$2 = [0,-96,206],
gt38$2 = [0,-98,212],
gt39$2 = [0,-99,214],
gt40$2 = [0,-14,215,-18,216,-1,78,-1,76,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt41$2 = [0,-33,217,-1,78,-1,76,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt42$2 = [0,-73,220],
gt43$2 = [0,-75,222],
gt44$2 = [0,-6,10,225,224,223,-70,12,-4,13],
gt45$2 = [0,-35,78,-1,226,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt46$2 = [0,-36,227],
gt47$2 = [0,-38,228,-1,82,-2,83,-3,229,-1,87,-4,88],
gt48$2 = [0,-41,230],
gt49$2 = [0,-44,231],
gt50$2 = [0,-47,232,-1,87,-4,88],
gt51$2 = [0,-47,233,-1,87,-4,88],
gt52$2 = [0,-52,238,236],
gt53$2 = [0,-56,242],
gt54$2 = [0,-57,247,248,-1,249],
gt55$2 = [0,-69,254],
gt56$2 = [0,-50,261,259],
gt57$2 = [0,-17,264,-2,266,265,267,-45,270],
gt58$2 = [0,-6,10,225,224,272,-70,12,-4,13],
gt59$2 = [0,-24,273],
gt60$2 = [0,-26,274],
gt61$2 = [0,-29,275,98,101,100,-21,99],
gt62$2 = [0,-29,276,98,101,100,-21,99],
gt63$2 = [0,-80,279,-4,13],
gt64$2 = [0,-103,281,-3,111],
gt65$2 = [0,-106,282,-1,198,196,283],
gt66$2 = [0,-108,285],
gt67$2 = [0,-108,198,196,286],
gt68$2 = [0,-94,288],
gt69$2 = [0,-80,292,-4,13],
gt70$2 = [0,-33,293,-1,78,-1,76,80,77,82,-2,83,-2,81,84,-1,87,-4,88,-11,79],
gt71$2 = [0,-13,294,-14,295,96,98,101,100,-21,99,-52,296],
gt72$2 = [0,-6,10,299,-72,12,-4,13],
gt73$2 = [0,-41,159,157],
gt74$2 = [0,-52,301],
gt75$2 = [0,-63,302,-1,303,-1,175,-2,174],
gt76$2 = [0,-63,305,-1,303,-1,175,-2,174],
gt77$2 = [0,-65,307],
gt78$2 = [0,-50,313],
gt79$2 = [0,-20,266,315,267,-45,270],
gt80$2 = [0,-108,198,196,283],
gt81$2 = [0,-97,323],
gt82$2 = [0,-59,329],
gt83$2 = [0,-61,331],
gt84$2 = [0,-10,31,-5,21,-1,16,-4,17,-10,15,-66,32,30,-2,334,-1,33],
gt85$2 = [0,-22,335,-45,270],
gt86$2 = [0,-63,337,-1,303,-1,175,-2,174],
gt87$2 = [0,-63,339,-1,303,-1,175,-2,174],

    // State action lookup maps
    sm0$2=[0,1,-3,0,-4,0,-5,2,-6,3,-37,4],
sm1$2=[0,5,-3,0,-4,0],
sm2$2=[0,6,-3,0,-4,0,-5,2,-6,3,-37,4],
sm3$2=[0,7,-3,0,-4,0,-5,7,-6,7,-37,7],
sm4$2=[0,8,-3,0,-4,0,-5,8,9,-5,8,-37,8],
sm5$2=[0,-4,0,-4,0,-9,10,-3,11,12,-7,13],
sm6$2=[0,14,-3,0,-4,0,-5,14,-6,14,-37,14],
sm7$2=[0,15,-3,0,-4,0,-5,15,-6,15,-37,15],
sm8$2=[0,-4,0,-4,0,-4,16,17],
sm9$2=[0,-2,18,-1,0,-4,0,-12,3],
sm10$2=[0,-4,0,-4,0,-4,19,19],
sm11$2=[0,-4,0,-4,0,-4,20,20,-5,20,-16,21,-13,22,23,24,-5,4],
sm12$2=[0,-2,25,-1,0,-4,0,-45,26,27,28,29,-1,30,31,-7,32],
sm13$2=[0,-4,0,-4,0,-6,33],
sm14$2=[0,-4,0,-4,0,-6,34],
sm15$2=[0,-4,0,-4,0,-6,35],
sm16$2=[0,36,-3,0,-4,0,-5,2,-6,3,-37,4],
sm17$2=[0,37,-3,0,-4,0,-5,37,-6,37,-37,37],
sm18$2=[0,38,-3,0,-4,0,-5,38,-6,38,-37,38],
sm19$2=[0,-4,0,-4,0,-6,9],
sm20$2=[0,39,-1,39,-1,0,-4,0,-5,39,39,39,-4,39,-37,39],
sm21$2=[0,-4,40,-4,0,-37,41,42,43],
sm22$2=[0,-2,44,-1,0,-4,0,-10,45,-9,46,-2,47],
sm23$2=[0,-4,0,-4,0,-15,48,-22,42,43],
sm24$2=[0,-2,49,50,0,-4,0,-10,51,-9,52],
sm25$2=[0,-4,0,-4,0,-50,4],
sm26$2=[0,-2,18,-1,0,-4,0,-6,53,54,-4,3],
sm27$2=[0,-2,55,-1,0,-4,0,-6,56,55,-4,55],
sm28$2=[0,-2,57,-1,0,-4,0,-6,57,57,-4,57],
sm29$2=[0,-2,58,-1,0,-4,0,-6,58,58,-4,58],
sm30$2=[0,-2,59,-1,0,-4,0,-6,59,59,-4,59],
sm31$2=[0,-4,0,-4,0,-59,60],
sm32$2=[0,-4,0,-4,0,-4,61,61,-5,61,-16,21,-13,22,23,24,-5,4],
sm33$2=[0,-4,0,-4,0,-4,62,62,-5,62,-16,62,-13,62,62,62,-5,62],
sm34$2=[0,-4,0,-4,0,-4,63,63,-5,63,-16,63,-13,63,63,63,-5,63],
sm35$2=[0,-4,0,-4,0,-50,64],
sm36$2=[0,-4,0,-4,0,-47,28,29,-1,30,65,-7,32],
sm37$2=[0,-4,0,-4,0,-47,28,29,-1,30,66,-7,32],
sm38$2=[0,-4,0,-4,0,-51,67,-7,68],
sm39$2=[0,-4,0,-4,0,-4,69,69,-5,69,-16,69,-13,69,69,69,-5,69],
sm40$2=[0,-4,0,-4,0,-47,70,70,-1,70,70,-7,70],
sm41$2=[0,-2,71,-1,0,-4,0,-45,72],
sm42$2=[0,-4,0,-4,0,-46,73,70,70,-1,70,70,-7,70],
sm43$2=[0,-4,0,-4,0,-30,74,-12,74,-2,73,74,74,-1,74,74,74,74,74,-4,74],
sm44$2=[0,-4,0,-4,0,-46,75],
sm45$2=[0,-2,76,-1,0,-4,0,-45,76],
sm46$2=[0,-4,0,-4,0,-47,77,77,-1,77,77,-7,77],
sm47$2=[0,-4,0,-4,0,-47,78,78,-1,78,78,-7,78],
sm48$2=[0,-2,79,-1,0,-4,0],
sm49$2=[0,-2,80,-1,0,-4,0],
sm50$2=[0,-2,25,-1,0,-4,0,-45,81,27],
sm51$2=[0,-2,82,-1,0,-4,0,-59,83],
sm52$2=[0,-4,0,-4,0,-51,84,-7,84],
sm53$2=[0,-4,0,-4,0,-51,85,-7,83],
sm54$2=[0,-4,86,-4,0,-37,41,42,43],
sm55$2=[0,87,-1,44,-1,0,-4,0,-5,87,87,-2,88,45,-1,87,-7,46,-2,47,-26,87],
sm56$2=[0,-4,89,-4,0,-37,89,89,89],
sm57$2=[0,90,-1,90,-1,0,-4,0,-5,90,90,-2,90,90,-1,90,-7,90,-2,90,-26,90],
sm58$2=[0,-4,0,-4,0,-3,91],
sm59$2=[0,-4,0,-4,0,-3,92],
sm60$2=[0,-4,0,-4,0,-38,42,43],
sm61$2=[0,-4,0,-4,0,-4,93,94],
sm62$2=[0,95,-3,0,-4,0,-4,95,95,95,-5,95,-37,95],
sm63$2=[0,96,-3,0,-4,0,-4,96,96,96,-5,96,-37,96],
sm64$2=[0,-2,97,-1,0,-4,0],
sm65$2=[0,96,-3,0,-4,0,-4,96,96,96,-5,96,-5,98,-31,96],
sm66$2=[0,99,-3,0,-4,0,-4,99,99,99,-4,99,99,-37,99],
sm67$2=[0,100,-3,0,-4,0,-4,100,100,100,-4,100,100,-37,100],
sm68$2=[0,100,-3,0,-4,0,-4,100,100,100,-4,100,100,-5,101,102,-30,100],
sm69$2=[0,-2,49,-1,0,-4,0,-10,45],
sm70$2=[0,-1,103,104,-1,0,-4,0,-10,45,-9,105],
sm71$2=[0,106,-3,0,-4,0,-4,106,106,106,-4,106,106,-5,106,106,-30,106],
sm72$2=[0,107,-3,0,-4,0,-4,107,107,107,-3,108,-1,107,-5,107,-31,107],
sm73$2=[0,-2,109,-1,0,-4,0],
sm74$2=[0,-4,0,-4,0,-5,110],
sm75$2=[0,-4,0,-4,0,-5,111],
sm76$2=[0,-4,0,-4,0,-5,112],
sm77$2=[0,-2,49,50,0,-4,0,-10,51],
sm78$2=[0,-4,0,-4,0,-5,113,-5,113,-6,114,115],
sm79$2=[0,-2,116,50,0,-4,0,-10,51,-9,52],
sm80$2=[0,-4,0,-4,0,-5,117,-5,117,-6,117,117],
sm81$2=[0,-4,0,-4,0,-5,118,-5,118,-6,118,118],
sm82$2=[0,-4,0,-4,0,-10,119],
sm83$2=[0,-4,0,-4,0,-10,108],
sm84$2=[0,-2,18,-1,0,-4,0,-6,120,121,-4,3],
sm85$2=[0,-4,0,-4,0,-4,122,122],
sm86$2=[0,-4,0,-4,0,-7,123],
sm87$2=[0,124,-3,0,-4,0,-5,124,-1,124,-4,124,-37,124],
sm88$2=[0,-2,125,-1,0,-4,0,-6,125,125,-4,125],
sm89$2=[0,-2,126,-1,0,-4,0,-6,127,126,-4,126],
sm90$2=[0,-2,128,-1,0,-4,0,-6,128,128,-4,128],
sm91$2=[0,-2,129,-1,0,-4,0,-6,129,129,-4,129],
sm92$2=[0,-2,18,-1,0,-4,0,-6,130,130,-4,130],
sm93$2=[0,-4,131,-4,0,-3,132,-6,133],
sm94$2=[0,-4,0,-4,0,-4,134,134,-5,134,-16,134,-13,134,134,134,-5,134],
sm95$2=[0,-4,0,-4,0,-4,135,135,-5,135,-16,135,-13,135,135,135,-5,135],
sm96$2=[0,-4,0,-4,0,-47,28,29,-1,30,136,-7,32],
sm97$2=[0,-4,0,-4,0,-51,137,-7,68],
sm98$2=[0,-4,0,-4,0,-4,138,138,-5,138,-16,138,-13,138,138,138,-5,138],
sm99$2=[0,-4,0,-4,0,-51,139,-7,68],
sm100$2=[0,-4,0,-4,0,-47,140,140,-1,140,140,-7,140],
sm101$2=[0,-4,0,-4,0,-51,141,-7,141],
sm102$2=[0,-4,0,-4,0,-59,83],
sm103$2=[0,-4,0,-4,0,-47,142,142,-1,142,142,-7,142],
sm104$2=[0,-4,0,-4,0,-30,143,-12,143,-3,143,143,-1,143,143,143,143,143,-4,143],
sm105$2=[0,-2,144,-1,0,-4,0,-45,144],
sm106$2=[0,-4,0,-4,0,-47,145,145,-1,145,145,-7,145],
sm107$2=[0,-4,0,-4,0,-47,146,146,-1,146,146,-7,146],
sm108$2=[0,-4,0,-4,0,-30,147,-12,148,-7,149,150,151,152],
sm109$2=[0,-2,71,-1,0,-4,0],
sm110$2=[0,-4,0,-4,0,-46,73],
sm111$2=[0,-4,0,-4,0,-10,153,-36,154,154,-1,154,154,-7,154],
sm112$2=[0,-4,0,-4,0,-51,155,-7,155],
sm113$2=[0,-2,82,-1,0,-4,0],
sm114$2=[0,-4,0,-4,0,-51,156,-7,83],
sm115$2=[0,-4,0,-4,0,-51,157,-7,157],
sm116$2=[0,158,-1,44,-1,0,-4,0,-5,158,158,-2,88,45,-1,158,-7,46,-2,47,-26,158],
sm117$2=[0,-4,159,-4,0,-37,159,159,159],
sm118$2=[0,158,-1,44,-1,0,-4,0,-5,158,158,-3,45,-1,158,-7,46,-2,47,-26,158],
sm119$2=[0,158,-3,0,-4,0,-4,93,158,158,-5,158,-37,158],
sm120$2=[0,-4,0,-4,0,-10,160],
sm121$2=[0,-4,0,-4,0,-3,91,-34,161],
sm122$2=[0,-4,0,-4,0,-3,162,-34,162],
sm123$2=[0,-4,0,-4,0,-3,163,-34,163],
sm124$2=[0,-4,0,-4,0,-3,92,-35,164],
sm125$2=[0,-4,0,-4,0,-3,165,-35,165],
sm126$2=[0,-4,0,-4,0,-3,166,-35,166],
sm127$2=[0,167,-1,167,-1,0,-4,0,-5,167,167,-2,167,167,-1,167,-7,167,-2,167,-26,167],
sm128$2=[0,168,-1,168,-1,0,-4,0,-5,168,168,-2,168,168,-1,168,-7,168,-2,168,-26,168],
sm129$2=[0,-4,0,-4,0,-5,2,-1,169,-42,4],
sm130$2=[0,170,-3,0,-4,0,-4,170,170,170,-5,170,-5,98,-31,170],
sm131$2=[0,107,-3,0,-4,0,-4,107,107,107,-5,107,-5,107,-31,107],
sm132$2=[0,170,-3,0,-4,0,-4,170,170,170,-5,170,-37,170],
sm133$2=[0,-2,49,-1,0,-4,0,-10,45,-9,105],
sm134$2=[0,171,-3,0,-4,0,-4,171,171,171,-4,171,171,-5,101,-31,171],
sm135$2=[0,172,-3,0,-4,0,-4,172,172,172,-4,172,172,-6,102,-30,172],
sm136$2=[0,173,-3,0,-4,0,-4,173,173,173,-4,173,173,-5,173,-31,173],
sm137$2=[0,174,-3,0,-4,0,-4,174,174,174,-4,174,174,-6,174,-30,174],
sm138$2=[0,175,-3,0,-4,0,-4,175,175,175,-4,175,175,-37,175],
sm139$2=[0,-4,0,-4,0,-11,176],
sm140$2=[0,-4,0,-4,0,-11,177],
sm141$2=[0,-4,178,-4,0,-3,179,-6,108,180,-15,181,181,181,181,-28,181],
sm142$2=[0,-4,0,-4,0,-11,182],
sm143$2=[0,-4,0,-4,0,-27,183,184,185,186,-28,187],
sm144$2=[0,-4,0,-4,0,-27,188,189,190,191],
sm145$2=[0,-4,0,-4,0,-11,192,-15,192,192,192,192,-1,193,-1,194,195,196],
sm146$2=[0,-4,0,-4,0,-11,192,-15,192,192,192,192],
sm147$2=[0,-4,197,-4,0,-3,198,-7,199],
sm148$2=[0,-1,200,-2,0,-4,0,-16,201,202],
sm149$2=[0,-4,0,-4,0,-5,203,-5,203],
sm150$2=[0,-4,0,-4,0,-5,203,-5,203,-6,114],
sm151$2=[0,-4,0,-4,0,-5,203,-5,203,-7,115],
sm152$2=[0,-4,0,-4,0,-5,204,-5,204,-6,204],
sm153$2=[0,-4,0,-4,0,-5,205,-5,205,-7,205],
sm154$2=[0,-4,0,-4,0,-11,206],
sm155$2=[0,-4,0,-4,0,-11,207],
sm156$2=[0,-4,178,-4,0,-3,179,-6,108,180,-47,60],
sm157$2=[0,-4,0,-4,0,-7,208],
sm158$2=[0,209,-3,0,-4,0,-5,209,-1,209,-4,209,-37,209],
sm159$2=[0,-2,18,-1,0,-4,0,-6,210,210,-4,210],
sm160$2=[0,-2,211,-1,0,-4,0,-6,211,211,-4,211],
sm161$2=[0,-2,212,-1,131,-4,0,-3,132,-2,212,212,-2,133,212,212,-44,213],
sm162$2=[0,-2,214,-1,131,-4,0,-3,132,-2,214,214,-2,214,214,214,-44,214],
sm163$2=[0,-2,215,-1,215,-4,0,-3,215,-2,215,215,-2,215,215,215,-44,215],
sm164$2=[0,-2,216,-1,216,-4,0,-3,216,-2,216,216,-2,216,216,216,-44,216],
sm165$2=[0,-4,0,-4,0,-51,217,-7,68],
sm166$2=[0,-4,0,-4,0,-4,218,218,-5,218,-16,218,-13,218,218,218,-5,218],
sm167$2=[0,-4,0,-4,0,-47,219,219,-1,219,219,-7,219],
sm168$2=[0,-2,220,221,0,-4,0],
sm169$2=[0,-4,0,-4,0,-30,222],
sm170$2=[0,-2,223,223,0,-4,0],
sm171$2=[0,-4,0,-4,0,-47,224,224,-1,224,224,-7,224],
sm172$2=[0,-4,0,-4,0,-51,225,-7,225],
sm173$2=[0,226,-1,44,-1,0,-4,0,-5,226,226,-3,45,-1,226,-7,46,-2,47,-26,226],
sm174$2=[0,226,-3,0,-4,0,-4,93,226,226,-5,226,-37,226],
sm175$2=[0,-2,227,50,0,-4,0,-10,51,-9,52],
sm176$2=[0,228,-1,228,-1,0,-4,0,-5,228,228,-2,228,228,-1,228,-7,228,-2,228,-26,228],
sm177$2=[0,-4,0,-4,0,-3,229,-34,229],
sm178$2=[0,-4,0,-4,0,-3,230,-35,230],
sm179$2=[0,-4,0,-4,0,-7,231],
sm180$2=[0,-4,0,-4,0,-5,2,-1,232,-42,4],
sm181$2=[0,-4,0,-4,0,-5,233,-1,233,-42,233],
sm182$2=[0,234,-3,0,-4,0,-4,234,234,234,-5,234,-37,234],
sm183$2=[0,235,-3,0,-4,0,-4,235,235,235,-5,235,-37,235],
sm184$2=[0,236,-3,0,-4,0,-4,236,236,236,-5,236,-37,236],
sm185$2=[0,100,-3,0,-4,0,-4,100,100,100,-5,100,-5,101,-31,100],
sm186$2=[0,237,-3,0,-4,0,-4,237,237,237,-4,237,237,-5,237,-31,237],
sm187$2=[0,238,-3,0,-4,0,-4,238,238,238,-4,238,238,-6,238,-30,238],
sm188$2=[0,239,-3,0,-4,0,-4,239,239,239,-4,239,239,-5,239,-31,239],
sm189$2=[0,240,-3,0,-4,0,-4,240,240,240,-4,240,240,-6,240,-30,240],
sm190$2=[0,241,-3,0,-4,0,-4,241,241,241,-4,241,241,-5,241,241,-30,241],
sm191$2=[0,242,-3,0,-4,0,-4,242,242,242,-4,242,242,-5,242,242,-30,242],
sm192$2=[0,-4,178,-4,0,-3,179,-7,243],
sm193$2=[0,244,-3,0,-4,0,-4,244,244,244,-4,244,244,-5,244,244,-30,244],
sm194$2=[0,-4,245,-4,0,-3,245,-7,245],
sm195$2=[0,-4,246,-4,0,-3,246,-7,246],
sm196$2=[0,-1,103,247,-1,0,-4,0],
sm197$2=[0,-1,248,248,-1,0,-4,0],
sm198$2=[0,-1,248,248,-1,0,-4,0,-30,249],
sm199$2=[0,-2,247,-1,0,-4,0],
sm200$2=[0,-2,250,-1,0,-4,0],
sm201$2=[0,-2,251,-1,0,-4,0],
sm202$2=[0,-2,252,-1,0,-4,0],
sm203$2=[0,-2,252,-1,0,-4,0,-30,253],
sm204$2=[0,-4,0,-4,0,-11,254,-15,254,254,254,254],
sm205$2=[0,-1,255,-2,0,-4,0],
sm206$2=[0,-4,0,-4,0,-11,256,-15,256,256,256,256],
sm207$2=[0,-4,197,-4,0,-3,198,-7,257],
sm208$2=[0,-4,258,-4,0,-3,258,-7,258],
sm209$2=[0,-4,259,-4,0,-3,259,-7,259],
sm210$2=[0,-1,200,-2,0,-4,0,-7,260,-8,201,202],
sm211$2=[0,-1,261,-2,0,-4,0,-7,261,-8,261,261],
sm212$2=[0,-4,0,-4,0,-4,262,263],
sm213$2=[0,-4,0,-4,0,-4,264,264],
sm214$2=[0,-4,0,-4,0,-4,265,265],
sm215$2=[0,-4,0,-4,0,-33,266],
sm216$2=[0,-4,0,-4,0,-7,267],
sm217$2=[0,-4,0,-4,0,-5,268,-5,268,-6,268],
sm218$2=[0,-4,0,-4,0,-5,269,-5,269,-7,269],
sm219$2=[0,-4,0,-4,0,-5,270,-5,270,-6,270],
sm220$2=[0,-4,0,-4,0,-5,271,-5,271,-7,271],
sm221$2=[0,-4,0,-4,0,-5,272,-5,272,-6,272,272],
sm222$2=[0,-4,0,-4,0,-5,273,-5,273,-6,273,273],
sm223$2=[0,-4,0,-4,0,-11,274],
sm224$2=[0,275,-3,0,-4,0,-5,275,-1,275,-4,275,-37,275],
sm225$2=[0,-2,276,-1,0,-4,0,-6,276,276,-4,276],
sm226$2=[0,-2,277,-1,0,-4,0,-6,277,277,-3,277,277],
sm227$2=[0,-2,278,-1,131,-4,0,-3,132,-2,278,278,-2,133,278,278,-44,278],
sm228$2=[0,-4,0,-4,0,-58,279],
sm229$2=[0,-2,280,-1,280,-4,0,-3,280,-2,280,280,-2,280,280,280,-44,280],
sm230$2=[0,-4,131,-4,0,-3,132,-6,133,281],
sm231$2=[0,-4,0,-4,0,-4,282,282,-5,282,-16,282,-13,282,282,282,-5,282],
sm232$2=[0,-4,0,-4,0,-51,283,-3,284,285],
sm233$2=[0,-4,0,-4,0,-51,286,-3,286,286],
sm234$2=[0,-2,287,287,0,-4,0],
sm235$2=[0,-4,0,-4,0,-11,288],
sm236$2=[0,289,-3,0,-4,0,-4,93,289,289,-5,289,-37,289],
sm237$2=[0,-4,0,-4,0,-11,290],
sm238$2=[0,-4,0,-4,0,-11,291],
sm239$2=[0,-4,0,-4,0,-10,108,-48,60],
sm240$2=[0,-4,0,-4,0,-6,292],
sm241$2=[0,-4,0,-4,0,-5,293,-1,293,-42,293],
sm242$2=[0,294,-3,0,-4,0,-4,294,294,294,-4,294,294,-5,294,294,-30,294],
sm243$2=[0,-4,295,-4,0,-3,295,-7,295],
sm244$2=[0,-4,0,-4,0,-11,296],
sm245$2=[0,-4,0,-4,0,-11,192],
sm246$2=[0,-4,0,-4,0,-11,181],
sm247$2=[0,-4,0,-4,0,-11,297],
sm248$2=[0,-1,298,298,-1,0,-4,0],
sm249$2=[0,-4,0,-4,0,-28,299],
sm250$2=[0,-4,0,-4,0,-27,300,-1,301],
sm251$2=[0,-2,302,-1,0,-4,0],
sm252$2=[0,-4,0,-4,0,-11,303,-15,303,303,303,303],
sm253$2=[0,-4,304,-4,0,-3,304,-7,304],
sm254$2=[0,-4,0,-4,0,-6,305],
sm255$2=[0,-1,306,-2,0,-4,0,-7,306,-8,306,306],
sm256$2=[0,-4,0,-4,0,-4,307,307],
sm257$2=[0,-4,0,-4,0,-6,308],
sm258$2=[0,-4,0,-4,0,-5,309,-5,309,-6,309,309],
sm259$2=[0,-2,310,-1,0,-4,0,-6,310,310,-3,310,310],
sm260$2=[0,-2,311,-1,311,-4,0,-3,311,-2,311,311,-2,311,311,311,-44,311],
sm261$2=[0,-4,0,-4,0,-51,312],
sm262$2=[0,-4,0,-4,0,-47,313,313,-1,313,313,-7,313],
sm263$2=[0,-4,0,-4,0,-51,314],
sm264$2=[0,-4,0,-4,0,-47,315,315,-1,315,315,-7,315],
sm265$2=[0,316,-1,316,-1,0,-4,0,-5,316,316,-3,316,-1,316,-7,316,-2,316,-26,316],
sm266$2=[0,-1,317,317,-1,0,-4,0,-30,318],
sm267$2=[0,-1,319,319,-1,0,-4,0],
sm268$2=[0,-2,18,-1,0,-4,0,-6,320,321,-4,3],
sm269$2=[0,-4,0,-4,0,-4,322,322],
sm270$2=[0,-4,0,-4,0,-47,323,323,-1,323,323,-7,323],
sm271$2=[0,-4,0,-4,0,-11,324],
sm272$2=[0,-1,325,325,-1,0,-4,0],
sm273$2=[0,-4,0,-4,0,-7,326],
sm274$2=[0,-1,327,-2,0,-4,0,-7,327,-8,327,327],
sm275$2=[0,-1,328,-2,0,-4,0,-7,328,-8,328,328],

    // Symbol Lookup map
    lu$2 = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[",",14],["{",15],[";",16],["}",17],[null,3],["supports",19],["(",20],[")",21],["@",22],["import",23],["keyframes",24],["id",25],["from",26],["to",27],["and",28],["or",29],["not",30],["media",32],["only",33],[":",69],["<",37],[">",38],["<=",39],["=",40],["/",42],["%",43],["px",44],["in",45],["rad",46],["url",47],["\"",48],["'",49],["[",60],["]",61],["+",52],["~",53],["||",54],["*",55],["|",56],["#",57],[".",58],["^=",62],["$=",63],["*=",64],["i",65],["s",66],["!",67],["important",68]]),

    //Reverse Symbol Lookup map
    rlu$2 = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,","],[15,"{"],[16,";"],[17,"}"],[3,null],[19,"supports"],[20,"("],[21,")"],[22,"@"],[23,"import"],[24,"keyframes"],[25,"id"],[26,"from"],[27,"to"],[28,"and"],[29,"or"],[30,"not"],[32,"media"],[33,"only"],[69,":"],[37,"<"],[38,">"],[39,"<="],[40,"="],[42,"/"],[43,"%"],[44,"px"],[45,"in"],[46,"rad"],[47,"url"],[48,"\""],[49,"'"],[60,"["],[61,"]"],[52,"+"],[53,"~"],[54,"||"],[55,"*"],[56,"|"],[57,"#"],[58,"."],[62,"^="],[63,"$="],[64,"*="],[65,"i"],[66,"s"],[67,"!"],[68,"important"]]),

    // States 
    state$2 = [sm0$2,
sm1$2,
sm2$2,
sm2$2,
sm3$2,
sm4$2,
sm5$2,
sm6$2,
sm7$2,
sm7$2,
sm8$2,
sm9$2,
sm10$2,
sm11$2,
sm12$2,
sm13$2,
sm14$2,
sm15$2,
sm16$2,
sm17$2,
sm18$2,
sm19$2,
sm20$2,
sm21$2,
sm22$2,
sm23$2,
sm24$2,
sm9$2,
sm25$2,
sm26$2,
sm27$2,
sm28$2,
sm29$2,
sm30$2,
sm31$2,
sm32$2,
sm33$2,
sm25$2,
sm34$2,
sm35$2,
sm35$2,
sm35$2,
sm35$2,
sm36$2,
sm37$2,
sm38$2,
sm39$2,
sm40$2,
sm41$2,
sm42$2,
sm43$2,
sm44$2,
sm45$2,
sm46$2,
sm47$2,
sm47$2,
sm47$2,
sm47$2,
sm48$2,
sm49$2,
sm50$2,
sm51$2,
sm52$2,
sm53$2,
sm20$2,
sm20$2,
sm20$2,
sm54$2,
sm55$2,
sm56$2,
sm57$2,
sm57$2,
sm58$2,
sm59$2,
sm60$2,
sm61$2,
sm62$2,
sm63$2,
sm64$2,
sm65$2,
sm66$2,
sm66$2,
sm67$2,
sm67$2,
sm68$2,
sm69$2,
sm70$2,
sm71$2,
sm71$2,
sm72$2,
sm73$2,
sm74$2,
sm75$2,
sm75$2,
sm76$2,
sm77$2,
sm78$2,
sm79$2,
sm80$2,
sm80$2,
sm81$2,
sm81$2,
sm82$2,
sm83$2,
sm84$2,
sm85$2,
sm86$2,
sm87$2,
sm88$2,
sm89$2,
sm90$2,
sm91$2,
sm92$2,
sm93$2,
sm94$2,
sm95$2,
sm96$2,
sm97$2,
sm98$2,
sm99$2,
sm98$2,
sm100$2,
sm98$2,
sm101$2,
sm102$2,
sm103$2,
sm104$2,
sm105$2,
sm106$2,
sm107$2,
sm108$2,
sm109$2,
sm110$2,
sm111$2,
sm112$2,
sm113$2,
sm114$2,
sm115$2,
sm116$2,
sm117$2,
sm118$2,
sm119$2,
sm120$2,
sm121$2,
sm122$2,
sm123$2,
sm124$2,
sm125$2,
sm126$2,
sm127$2,
sm128$2,
sm129$2,
sm22$2,
sm130$2,
sm131$2,
sm132$2,
sm133$2,
sm134$2,
sm135$2,
sm136$2,
sm69$2,
sm137$2,
sm69$2,
sm138$2,
sm139$2,
sm140$2,
sm141$2,
sm69$2,
sm142$2,
sm142$2,
sm142$2,
sm143$2,
sm144$2,
sm145$2,
sm146$2,
sm146$2,
sm147$2,
sm148$2,
sm129$2,
sm149$2,
sm150$2,
sm151$2,
sm152$2,
sm77$2,
sm153$2,
sm77$2,
sm154$2,
sm155$2,
sm156$2,
sm25$2,
sm157$2,
sm158$2,
sm158$2,
sm159$2,
sm160$2,
sm161$2,
sm162$2,
sm93$2,
sm163$2,
sm164$2,
sm164$2,
sm165$2,
sm166$2,
sm166$2,
sm166$2,
sm167$2,
sm168$2,
sm169$2,
sm170$2,
sm170$2,
sm170$2,
sm170$2,
sm171$2,
sm25$2,
sm172$2,
sm173$2,
sm174$2,
sm174$2,
sm175$2,
sm176$2,
sm177$2,
sm176$2,
sm178$2,
sm179$2,
sm180$2,
sm181$2,
sm182$2,
sm183$2,
sm184$2,
sm185$2,
sm186$2,
sm187$2,
sm188$2,
sm189$2,
sm190$2,
sm191$2,
sm192$2,
sm193$2,
sm194$2,
sm195$2,
sm195$2,
sm196$2,
sm196$2,
sm197$2,
sm198$2,
sm197$2,
sm197$2,
sm199$2,
sm200$2,
sm201$2,
sm202$2,
sm203$2,
sm202$2,
sm202$2,
sm204$2,
sm205$2,
sm206$2,
sm206$2,
sm206$2,
sm207$2,
sm193$2,
sm208$2,
sm209$2,
sm209$2,
sm210$2,
sm211$2,
sm212$2,
sm213$2,
sm214$2,
sm214$2,
sm214$2,
sm215$2,
sm216$2,
sm217$2,
sm218$2,
sm219$2,
sm220$2,
sm221$2,
sm222$2,
sm223$2,
sm224$2,
sm225$2,
sm226$2,
sm227$2,
sm228$2,
sm229$2,
sm230$2,
sm231$2,
sm232$2,
sm233$2,
sm233$2,
sm234$2,
sm235$2,
sm236$2,
sm237$2,
sm238$2,
sm238$2,
sm239$2,
sm240$2,
sm241$2,
sm242$2,
sm243$2,
sm244$2,
sm245$2,
sm246$2,
sm247$2,
sm248$2,
sm247$2,
sm249$2,
sm250$2,
sm251$2,
sm252$2,
sm242$2,
sm253$2,
sm254$2,
sm255$2,
sm9$2,
sm148$2,
sm256$2,
sm257$2,
sm258$2,
sm259$2,
sm260$2,
sm261$2,
sm262$2,
sm263$2,
sm263$2,
sm264$2,
sm265$2,
sm196$2,
sm266$2,
sm196$2,
sm267$2,
sm267$2,
sm268$2,
sm269$2,
sm270$2,
sm271$2,
sm272$2,
sm271$2,
sm273$2,
sm274$2,
sm275$2],

/************ Functions *************/

    max$2 = Math.max, min$2 = Math.min,

    //Error Functions
    e$5 = (tk,r,o,l,p)=>{if(l.END)l.throw("Unexpected end of input");else if(l.ty & (264)) l.throw(`Unexpected space character within input "${1}" `) ; else l.throw(`Unexpected token ${l.tx} within input "${111}" `);}, 
    eh$2 = [e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5,
e$5],

    //Empty Function
    nf$2 = ()=>-1, 

    //Environment Functions
    
redv$2 = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max$2(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
rednv$2 = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max$2(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
redn$2 = (ret, plen, t, e, o, l, s) => {        if(plen > 0){            let ln = max$2(o.length - plen, 0);            o[ln] = o[o.length -1];            o.length = ln + 1;        }        return ret;    },
shftf$2 = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R20_STYLE_SHEET201_group_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
R21_STYLE_SHEET201_group_list=function (sym,env,lex,state,output,len) {return [sym[0]]},
R60_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
C70_RULE_SET=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.body = sym[2];},
C180_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
C210_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
R510_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R511_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R800_COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len > 1 ? [sym[0]].concat(sym[1]) : [sym[0]]},
R1050_declaration_list=function (sym,env,lex,state,output,len) {return {[props] : sym[0],[at_rules] : []}},
R1051_declaration_list=function (sym,env,lex,state,output,len) {return {[props] : [],[at_rules] : [sym[0]]}},
R1052_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].at_rules.push(sym[1]),sym[0])},
R1053_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].props.push(...sym[1]),sym[0])},
R1100_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},

    //Sparse Map Lookup
    lsm$2 = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct$2 = [(...v)=>((redn$2(5123,0,...v))),
()=>(46),
()=>(26),
()=>(58),
(...v)=>(redn$2(5,1,...v)),
(...v)=>(redn$2(5127,1,...v)),
(...v)=>(redv$2(2055,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(1031,1,...v)),
()=>(90),
()=>(106),
()=>(94),
()=>(102),
()=>(98),
(...v)=>(redv$2(4103,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(3079,1,...v)),
()=>(114),
()=>(110),
()=>(138),
(...v)=>(redv$2(6151,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redv$2(81927,R800_COMPLEX_SELECTOR,1,0,...v)),
()=>(158),
()=>(162),
()=>(166),
()=>(170),
()=>(202),
()=>(198),
()=>(210),
()=>(234),
()=>(238),
()=>(242),
()=>(186),
()=>(246),
()=>(258),
()=>(262),
()=>(266),
(...v)=>(redn$2(5131,2,...v)),
(...v)=>(redv$2(2059,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redv$2(4107,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(10251,2,...v)),
()=>(278),
()=>(298),
()=>(290),
()=>(294),
()=>(358),
()=>(346),
()=>(342),
()=>(362),
()=>(370),
()=>(414),
()=>(410),
()=>(390),
()=>(382),
()=>(426),
()=>(430),
(...v)=>(redv$2(107527,R1050_declaration_list,1,0,...v)),
()=>(450),
(...v)=>(redv$2(107527,R1051_declaration_list,1,0,...v)),
(...v)=>(redv$2(104455,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(103431,1,...v)),
()=>(454),
(...v)=>(redv$2(81931,R800_COMPLEX_SELECTOR,2,0,...v)),
(...v)=>(redv$2(80903,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redv$2(79879,fn$2.comboSelector,1,0,...v)),
(...v)=>(redn$2(88071,1,...v)),
()=>(474),
()=>(482),
()=>(490),
()=>(498),
(...v)=>(rednv$2(87051,fn$2.compoundSelector,2,0,...v)),
(...v)=>(rednv$2(89095,fn$2.selector,1,0,...v)),
()=>(506),
()=>(502),
(...v)=>(redn$2(90119,1,...v)),
(...v)=>(redn$2(92167,1,...v)),
()=>(510),
(...v)=>(redn$2(91143,1,...v)),
(...v)=>(redv$2(82951,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(93191,1,...v)),
()=>(514),
()=>(518),
()=>(530),
()=>(534),
()=>(542),
(...v)=>(redv$2(86023,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(84999,1,...v)),
()=>(558),
(...v)=>(redn$2(16399,3,...v)),
()=>(570),
(...v)=>(redv$2(11271,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(12295,1,...v)),
()=>(582),
()=>(594),
()=>(610),
()=>(606),
(...v)=>(redv$2(33799,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(37895,1,...v)),
()=>(618),
()=>(626),
(...v)=>(redn$2(39943,1,...v)),
(...v)=>(redn$2(38919,1,...v)),
()=>(642),
()=>(650),
()=>(694),
()=>(666),
()=>(670),
(...v)=>(redn$2(48135,1,...v)),
(...v)=>(redn$2(67591,1,...v)),
()=>(706),
(...v)=>(redn$2(35847,1,...v)),
()=>(710),
(...v)=>(redn$2(19463,1,...v)),
()=>(714),
(...v)=>(redn$2(28679,1,...v)),
()=>(734),
()=>(742),
()=>(754),
(...v)=>(redn$2(29703,1,...v)),
(...v)=>(redn$2(30727,1,...v)),
()=>(758),
()=>(762),
()=>(766),
(...v)=>(redv$2(6159,R60_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(770),
(...v)=>(rednv$2(7183,C70_RULE_SET,3,0,...v)),
(...v)=>(redv$2(107531,R1052_declaration_list,2,0,...v)),
(...v)=>(redv$2(107531,R1053_declaration_list,2,0,...v)),
()=>(774),
(...v)=>(redv$2(106503,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(105479,1,...v)),
(...v)=>(redv$2(107531,R1050_declaration_list,2,0,...v)),
()=>(798),
()=>(802),
()=>(790),
(...v)=>(redv$2(80907,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redv$2(79883,fn$2.comboSelector,2,0,...v)),
()=>(810),
()=>(814),
(...v)=>(rednv$2(87055,fn$2.compoundSelector,3,0,...v)),
()=>(818),
(...v)=>(redv$2(82955,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redv$2(86027,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(rednv$2(89099,fn$2.selector,2,0,...v)),
(...v)=>(redn$2(92171,2,...v)),
(...v)=>(redn$2(91147,2,...v)),
(...v)=>(rednv$2(94219,fn$2.idSelector,2,0,...v)),
(...v)=>(rednv$2(95243,fn$2.classSelector,2,0,...v)),
()=>(846),
()=>(830),
()=>(822),
()=>(834),
()=>(838),
()=>(842),
()=>(854),
(...v)=>(rednv$2(101387,fn$2.pseudoClassSelector,2,0,...v)),
(...v)=>(rednv$2(102411,fn$2.pseudoElementSelector,2,0,...v)),
(...v)=>(redn$2(85003,2,...v)),
(...v)=>(redv$2(83975,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(16403,4,...v)),
(...v)=>(redv$2(11275,R20_STYLE_SHEET201_group_list,2,0,...v)),
()=>(874),
()=>(878),
(...v)=>(redv$2(75783,R511_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn$2(74759,1,...v)),
()=>(886),
(...v)=>(redv$2(77831,R511_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn$2(76807,1,...v)),
(...v)=>(redn$2(73739,2,...v)),
(...v)=>(redn$2(72711,1,...v)),
(...v)=>((redn$2(9219,0,...v))),
(...v)=>(redn$2(37899,2,...v)),
(...v)=>(redn$2(44043,2,...v)),
(...v)=>(redn$2(47115,2,...v)),
(...v)=>(redv$2(43015,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redv$2(46087,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(40971,2,...v)),
()=>(938),
()=>(942),
()=>(962),
()=>(958),
()=>(950),
(...v)=>(redn$2(66567,1,...v)),
(...v)=>(redn$2(49159,1,...v)),
()=>(974),
()=>(978),
()=>(982),
()=>(986),
()=>(966),
()=>(1002),
()=>(1006),
()=>(1010),
()=>(1014),
(...v)=>(redn$2(64519,1,...v)),
()=>(1022),
()=>(1026),
()=>(1030),
()=>(1034),
()=>(1054),
()=>(1050),
()=>(1042),
()=>(1086),
()=>(1074),
()=>(1078),
(...v)=>(redn$2(28683,2,...v)),
(...v)=>(redv$2(25607,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redv$2(27655,R21_STYLE_SHEET201_group_list,1,0,...v)),
()=>(1110),
()=>(1114),
()=>(1122),
(...v)=>(rednv$2(7187,C70_RULE_SET,4,0,...v)),
(...v)=>(redv$2(107535,R1053_declaration_list,3,0,...v)),
(...v)=>(redv$2(104463,R60_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv$2(109583,fn$2.parseDeclaration,3,0,...v)),
()=>(1138),
(...v)=>(redn$2(112647,1,...v)),
(...v)=>(redv$2(111623,R511_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn$2(110599,1,...v)),
()=>(1150),
(...v)=>(rednv$2(87059,fn$2.compoundSelector,4,0,...v)),
(...v)=>(rednv$2(97295,fn$2.attribSelector,3,0,...v)),
()=>(1158),
()=>(1162),
()=>(1166),
(...v)=>(redn$2(98311,1,...v)),
(...v)=>(rednv$2(101391,fn$2.pseudoClassSelector,3,0,...v)),
(...v)=>(redv$2(83979,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(16407,5,...v)),
()=>(1190),
(...v)=>(redn$2(78863,3,...v)),
(...v)=>(redv$2(75787,R510_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv$2(77835,R510_general_enclosed6202_group_list,2,0,...v)),
()=>(1194),
(...v)=>(redn$2(9223,1,...v)),
(...v)=>(redv$2(8199,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redv$2(33807,R60_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn$2(37903,3,...v)),
(...v)=>(redn$2(36875,2,...v)),
(...v)=>(redv$2(43019,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redv$2(46091,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(41995,2,...v)),
(...v)=>(redn$2(45067,2,...v)),
(...v)=>(redn$2(48143,3,...v)),
(...v)=>(redn$2(50191,3,...v)),
()=>(1202),
(...v)=>(redn$2(55311,3,...v)),
(...v)=>(redv$2(54279,R511_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn$2(53255,1,...v)),
()=>(1218),
(...v)=>(redn$2(57351,1,...v)),
()=>(1226),
()=>(1234),
()=>(1238),
(...v)=>(redn$2(58375,1,...v)),
()=>(1242),
(...v)=>(redn$2(71691,2,...v)),
()=>(1246),
(...v)=>(redn$2(70663,1,...v)),
()=>(1250),
(...v)=>(redv$2(52231,R511_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn$2(51207,1,...v)),
()=>(1258),
(...v)=>(redv$2(17415,R21_STYLE_SHEET201_group_list,1,0,...v)),
()=>(1270),
()=>(1266),
(...v)=>(redv$2(20487,R21_STYLE_SHEET201_group_list,1,0,...v)),
(...v)=>(redn$2(22535,1,...v)),
()=>(1274),
()=>(1278),
(...v)=>(redv$2(25611,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redv$2(27659,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(24587,2,...v)),
(...v)=>(redn$2(26635,2,...v)),
(...v)=>(redn$2(29711,3,...v)),
(...v)=>(redn$2(31759,3,...v)),
()=>(1282),
(...v)=>(rednv$2(7191,C70_RULE_SET,5,0,...v)),
(...v)=>(redv$2(106511,R60_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv$2(109587,fn$2.parseDeclaration,4,0,...v)),
(...v)=>(redv$2(112651,R1100_declaration_values,2,0,...v)),
()=>(1286),
(...v)=>(redv$2(111627,R510_general_enclosed6202_group_list,2,0,...v)),
()=>(1290),
(...v)=>(rednv$2(87063,fn$2.compoundSelector,5,0,...v)),
()=>(1298),
()=>(1302),
()=>(1306),
(...v)=>(redn$2(96263,1,...v)),
(...v)=>(redn$2(98315,2,...v)),
()=>(1310),
(...v)=>(redn$2(16411,6,...v)),
()=>(1314),
(...v)=>(redn$2(13319,1,...v)),
(...v)=>(redn$2(34843,6,...v)),
(...v)=>(redv$2(8203,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(55315,4,...v)),
(...v)=>(redv$2(54283,R510_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redn$2(56335,3,...v)),
(...v)=>(redn$2(63503,3,...v)),
(...v)=>(redn$2(57355,2,...v)),
()=>(1322),
()=>(1330),
()=>(1334),
(...v)=>(redn$2(58379,2,...v)),
(...v)=>(redn$2(68623,3,...v)),
(...v)=>(redv$2(52235,R510_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(rednv$2(18459,C180_keyframes,6,0,...v)),
(...v)=>(redv$2(17419,R20_STYLE_SHEET201_group_list,2,0,...v)),
(...v)=>(redn$2(69643,2,...v)),
(...v)=>(redn$2(23579,6,...v)),
(...v)=>(redn$2(32787,4,...v)),
(...v)=>(redn$2(108555,2,...v)),
(...v)=>(redv$2(112655,R1100_declaration_values,3,0,...v)),
()=>(1346),
(...v)=>(rednv$2(97303,fn$2.attribSelector,5,0,...v)),
(...v)=>(redn$2(99335,1,...v)),
(...v)=>(redn$2(100367,3,...v)),
(...v)=>(redn$2(14355,4,...v)),
(...v)=>(redn$2(60423,1,...v)),
()=>(1354),
(...v)=>(redn$2(62471,1,...v)),
()=>(1362),
()=>(1366),
(...v)=>(redv$2(20495,R60_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv$2(97307,fn$2.attribSelector,6,0,...v)),
(...v)=>(redn$2(63511,5,...v)),
(...v)=>(redn$2(60427,2,...v)),
()=>(1370),
(...v)=>(rednv$2(21523,C210_keyframes_blocks,4,0,...v)),
(...v)=>(rednv$2(21527,C210_keyframes_blocks,5,0,...v))],

    //Goto Lookup Functions
    goto$2 = [v=>lsm$2(v,gt0$2),
nf$2,
v=>lsm$2(v,gt1$2),
v=>lsm$2(v,gt2$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt3$2),
nf$2,
v=>lsm$2(v,gt4$2),
v=>lsm$2(v,gt5$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt2$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt6$2),
v=>lsm$2(v,gt7$2),
v=>lsm$2(v,gt8$2),
v=>lsm$2(v,gt9$2),
v=>lsm$2(v,gt10$2),
v=>lsm$2(v,gt11$2),
v=>lsm$2(v,gt12$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt13$2),
nf$2,
v=>lsm$2(v,gt14$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt15$2),
v=>lsm$2(v,gt16$2),
v=>lsm$2(v,gt17$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt18$2),
v=>lsm$2(v,gt19$2),
nf$2,
v=>lsm$2(v,gt20$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt21$2),
v=>lsm$2(v,gt22$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt23$2),
v=>lsm$2(v,gt24$2),
v=>lsm$2(v,gt25$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt26$2),
v=>lsm$2(v,gt27$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt28$2),
v=>lsm$2(v,gt29$2),
v=>lsm$2(v,gt30$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt31$2),
v=>lsm$2(v,gt32$2),
v=>lsm$2(v,gt33$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt12$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt34$2),
v=>lsm$2(v,gt35$2),
nf$2,
nf$2,
v=>lsm$2(v,gt36$2),
v=>lsm$2(v,gt17$2),
nf$2,
v=>lsm$2(v,gt17$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt19$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt37$2),
nf$2,
nf$2,
v=>lsm$2(v,gt38$2),
nf$2,
nf$2,
v=>lsm$2(v,gt39$2),
nf$2,
v=>lsm$2(v,gt40$2),
nf$2,
v=>lsm$2(v,gt41$2),
nf$2,
nf$2,
v=>lsm$2(v,gt42$2),
nf$2,
nf$2,
v=>lsm$2(v,gt43$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt44$2),
v=>lsm$2(v,gt45$2),
v=>lsm$2(v,gt46$2),
nf$2,
nf$2,
v=>lsm$2(v,gt47$2),
v=>lsm$2(v,gt48$2),
v=>lsm$2(v,gt49$2),
nf$2,
v=>lsm$2(v,gt50$2),
nf$2,
v=>lsm$2(v,gt51$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt52$2),
v=>lsm$2(v,gt29$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt53$2),
v=>lsm$2(v,gt54$2),
v=>lsm$2(v,gt55$2),
nf$2,
nf$2,
v=>lsm$2(v,gt56$2),
v=>lsm$2(v,gt57$2),
v=>lsm$2(v,gt58$2),
nf$2,
v=>lsm$2(v,gt59$2),
v=>lsm$2(v,gt60$2),
nf$2,
v=>lsm$2(v,gt61$2),
nf$2,
v=>lsm$2(v,gt62$2),
nf$2,
nf$2,
v=>lsm$2(v,gt52$2),
v=>lsm$2(v,gt63$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt64$2),
nf$2,
v=>lsm$2(v,gt65$2),
v=>lsm$2(v,gt66$2),
v=>lsm$2(v,gt67$2),
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt17$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt68$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt69$2),
nf$2,
v=>lsm$2(v,gt70$2),
nf$2,
nf$2,
v=>lsm$2(v,gt71$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt72$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt73$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt74$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt75$2),
v=>lsm$2(v,gt76$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt77$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt78$2),
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt79$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt80$2),
nf$2,
nf$2,
v=>lsm$2(v,gt80$2),
nf$2,
v=>lsm$2(v,gt81$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt82$2),
v=>lsm$2(v,gt83$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt84$2),
v=>lsm$2(v,gt85$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
v=>lsm$2(v,gt86$2),
nf$2,
v=>lsm$2(v,gt87$2),
nf$2,
nf$2,
v=>lsm$2(v,gt12$2),
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2,
nf$2];

function getToken$2(l, SYM_LU) {
    if (l.END) return 0; /*3*/

    switch (l.ty) {
        case 2:
            if (SYM_LU.has(l.tx)) return SYM_LU.get(l.tx);
            return 2;
        case 1:
            return 1;
        case 4:
            return 3;
        case 256:
            return 9;
        case 8:
            return 4;
        case 512:
            return 10;
        default:
            return SYM_LU.get(l.tx) || SYM_LU.get(l.ty);
    }
}

/************ Parser *************/

function parser$2(l, e = {}) {
    
    fn$2 = e.functions;

    l.IWS = false;
    l.PARSE_STRING = true;

    if (symbols$2.length > 0) {
        symbols$2.forEach(s => { l.addSymbol(s); });
        l.tl = 0;
        l.next();
    }

    const o = [],
        ss = [0, 0];

    let time = 1000000,
        RECOVERING = 100,
        tk = getToken$2(l, lu$2),
        p = l.copy(),
        sp = 1,
        len = 0,
        off = 0;

    outer:

        while (time-- > 0) {

            const fn = lsm$2(tk, state$2[ss[sp]]) || 0;

            /*@*/// console.log({end:l.END, state:ss[sp], tx:l.tx, ty:l.ty, tk:tk, rev:rlu.get(tk), s_map:state[ss[sp]], res:lsm(tk, state[ss[sp]])});

            let r,
                gt = -1;

            if (fn == 0) {
                /*Ignore the token*/
                l.next();
                tk = getToken$2(l, lu$2);
                continue;
            }

            if (fn > 0) {
                r = state_funct$2[fn - 1](tk, e, o, l, ss[sp - 1]);
            } else {
                if (RECOVERING > 1 && !l.END) {
                    if (tk !== lu$2.get(l.ty)) {
                        //console.log("ABLE", rlu.get(tk), l.tx, tk )
                        tk = lu$2.get(l.ty);
                        continue;
                    }

                    if (tk !== 13) {
                        //console.log("MABLE")
                        tk = 13;
                        RECOVERING = 1;
                        continue;
                    }
                }

                tk = getToken$2(l, lu$2);

                const recovery_token = eh$2[ss[sp]](tk, e, o, l, p, ss[sp], lu$2);

                if (RECOVERING > 0 && recovery_token) {
                    RECOVERING = -1; /* To prevent infinite recursion */
                    tk = recovery_token;
                    l.tl = 0; /*reset current token */
                    continue;
                }
            }

            switch (r & 3) {
                case 0:
                    /* ERROR */

                    if (tk == "$eof")
                        l.throw("Unexpected end of input");
                    l.throw(`Unexpected token [${RECOVERING ? l.next().tx : l.tx}]`);
                    return [null];

                case 1:
                    /* ACCEPT */
                    break outer;

                case 2:
                    /*SHIFT */
                    o.push(l.tx);
                    ss.push(off, r >> 2);
                    sp += 2;
                    p.sync(l);
                    l.next();
                    off = l.off;
                    tk = getToken$2(l, lu$2);
                    RECOVERING++;
                    break;

                case 3:
                    /* REDUCE */

                    len = (r & 0x3FC) >> 1;

                    ss.length -= len;
                    sp -= len;
                    gt = goto$2[ss[sp]](r >> 10);

                    if (gt < 0)
                        l.throw("Invalid state reached!");

                    ss.push(off, gt);
                    sp += 2;
                    break;
            }
        }
    return o[0];
};

/**
 * Holds a set of rendered CSS properties.
 * @memberof module:wick~internals.css
 * @alias CSSRule
 */
class CSSRule$1 {
    constructor(root) {
        /**
         * Collection of properties held by this rule.
         * @public
         */
        this.props = [];
        this.LOADED = false;
        this.root = root;

        //Reference Counting
        this.refs = 0;

        //Versioning
        this.ver = 0;
    }

    incrementRef(){
        this.refs++;
    }

    decrementRef(){
        this.refs--;
        if(this.refs <= 0){
            //TODO: remove from rules entries.
            debugger
        }
    }

    addProperty(prop, rule) {
        if (prop)
            this.props[prop.name] = prop.value;
    }



    toString(off = 0, rule = "") {
        let str = [],
            offset = ("    ").repeat(off);

        if (rule) {
            if (this.props[rule]) {
                if (Array.isArray(this.props[rule]))
                    str.push(this.props[rule].join(" "));
                else
                    str.push(this.props[rule].toString());
            }else
                return "";
        } else {
            for (const a of this.props) {
                if (a !== null) {
                    if (Array.isArray(this.props[a]))
                        str.push(offset, a.replace(/\_/g, "-"), ":", this.props[a].join(" "), ";\n");
                    else
                        str.push(offset, a.replace(/\_/g, "-"), ":", this.props[a].toString(), ";\n");
                }
            }
        }

        return str.join(""); //JSON.stringify(this.props).replace(/\"/g, "").replace(/\_/g, "-");
    }

    merge(rule) {
        if (rule.props) {
            for (let n in rule.props)
                this.props[n] = rule.props[n];
            this.LOADED = true;
            this.ver++;
        }
    }

    get _wick_type_() { return 0; }

    set _wick_type_(v) {}
}

class Color$1 extends Float64Array {

    constructor(r, g, b, a = 0) {
        super(4);

        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;

        if (typeof(r) === "number") {
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
        return new Color$1(
            color.r + this.r,
            color.g + this.g,
            color.b + this.b,
            color.a + this.a
        );
    }

    mult(color) {
        if (typeof(color) == "number") {
            return new Color$1(
                this.r * color,
                this.g * color,
                this.b * color,
                this.a * color
            );
        } else {
            return new Color$1(
                this.r * color.r,
                this.g * color.g,
                this.b * color.b,
                this.a * color.a
            );
        }
    }

    sub(color) {
        return new Color$1(
            this.r - color.r,
            this.g - color.g,
            this.b - color.b,
            this.a - color.a
        );
    }

    lerp(to, t){
        return this.add(to.sub(this).mult(t));
    }

    toString() {
        return `rgba(${this.r|0},${this.g|0},${this.b|0},${this.a})`;
    }

    toJSON() {
        return `rgba(${this.r|0},${this.g|0},${this.b|0},${this.a})`;
    }

    copy(other){
        let out = new Color$1(other);
        return out;
    }
}

/*
    BODY {color: black; background: white }
    H1 { color: maroon }
    H2 { color: olive }
    EM { color: #f00 }              // #rgb //
    EM { color: #ff0000 }           // #rrggbb //
    EM { color: rgb(255,0,0) }      // integer range 0 - 255 //
    EM { color: rgb(100%, 0%, 0%) } // float range 0.0% - 100.0% //
*/
class CSS_Color$2 extends Color$1 {

    /** UI FUNCTIONS **/

    static list(){}

    static valueHandler(existing_value){
        let ele = document.createElement("input");
        ele.type = "color";
        ele.value = (existing_value) ? existing_value+ "" : "#000000";
        ele.addEventListener("change", (e)=>{
            ele.css_value = ele.value;
        });
        return ele;
    }

    static setInput(input, value){
        input.type = "color";
        input.value = value;
    }

    static buildInput(){
        let ele = document.createElement("input");
        ele.type = "color";
        return ele;
    }

    static parse(l) {

        let c = CSS_Color$2._fs_(l);

        if (c) {

            let color = new CSS_Color$2();

            color.set(c);

            return color;
        }

        return null;
    }
    static _verify_(l) {
        let c = CSS_Color$2._fs_(l, true);
        if (c)
            return true;
        return false;
    }
    /**
        Creates a new Color from a string or a Lexer.
    */
    static _fs_(l, v = false) {
        let c;

        if (typeof(l) == "string")
            l = whind$1(l);

        let out = { r: 0, g: 0, b: 0, a: 1 };

        switch (l.ch) {
            case "#":
                l.next();
                let pk = l.copy();

                let type = l.types;
                pk.IWS = false;


                while(!(pk.ty & (type.newline | type.ws)) && !pk.END && pk.ch !== ";"){
                    pk.next();
                }

                var value = pk.slice(l);
                l.sync(pk);
                l.tl = 0;
                l.next();
                
                let num = parseInt(value,16);

                if(value.length == 3 || value.length == 4){
                    
                    if(value.length == 4){
                        const a = (num >> 8) & 0xF;
                        out.a = a | a << 4;
                        num >>= 4;
                    }

                    const r = (num >> 8) & 0xF;
                    out.r = r | r << 4;
                    
                    const g = (num >> 4) & 0xF;
                    out.g = g | g << 4;
                    
                    const b = (num) & 0xF;
                    out.b = b | b << 4;

                }else{

                    if(value.length == 8){
                        out.a = num & 0xFF;
                        num >>= 8;
                    }

                    out.r = (num >> 16) & 0xFF;       
                    out.g = (num >> 8) & 0xFF;
                    out.b = (num) & 0xFF;
                }
                l.next();
                break;
            case "r":
                let tx = l.tx;

                const RGB_TYPE = tx === "rgba"  ? 1 : tx === "rgb" ? 2 : 0;
                
                if(RGB_TYPE > 0){

                    l.next(); // (
                    
                    out.r = parseInt(l.next().tx);
                    
                    l.next(); // , or  %

                    if(l.ch == "%"){
                        l.next(); out.r = out.r * 255 / 100;
                    }
                    
                    
                    out.g = parseInt(l.next().tx);
                    
                    l.next(); // , or  %
                   
                    if(l.ch == "%"){
                        l.next(); out.g = out.g * 255 / 100;
                    }
                    
                    
                    out.b = parseInt(l.next().tx);
                    
                    l.next(); // , or ) or %
                    
                    if(l.ch == "%")
                        l.next(), out.b = out.b * 255 / 100;

                    if(RGB_TYPE < 2){
                        out.a = parseFloat(l.next().tx);

                        l.next();
                        
                        if(l.ch == "%")
                            l.next(), out.a = out.a * 255 / 100;
                    }

                    l.a(")");
                    c = new CSS_Color$2();
                    c.set(out);
                    return c;
                }  // intentional
            default:

                let string = l.tx;

                if (l.ty == l.types.str){
                    string = string.slice(1, -1);
                }

                out = CSS_Color$2.colors[string.toLowerCase()];

                if(out)
                    l.next();
        }

        return out;
    }

    constructor(r, g, b, a) {
        super(r, g, b, a);

        if (typeof(r) == "string")
            this.set(CSS_Color$2._fs_(r) || {r:255,g:255,b:255,a:0});

    }

    toString(){
        return `#${("0"+this.r.toString(16)).slice(-2)}${("0"+this.g.toString(16)).slice(-2)}${("0"+this.b.toString(16)).slice(-2)}`
    }
    toRGBString(){
        return `rgba(${this.r.toString()},${this.g.toString()},${this.b.toString()},${this.a.toString()})`   
    }
} {

    let _$ = (r = 0, g = 0, b = 0, a = 1) => ({ r, g, b, a });
    let c = _$(0, 255, 25);
    CSS_Color$2.colors = {
        "alice blue": _$(240, 248, 255),
        "antique white": _$(250, 235, 215),
        "aqua marine": _$(127, 255, 212),
        "aqua": c,
        "azure": _$(240, 255, 255),
        "beige": _$(245, 245, 220),
        "bisque": _$(255, 228, 196),
        "black": _$(),
        "blanched almond": _$(255, 235, 205),
        "blue violet": _$(138, 43, 226),
        "blue": _$(0, 0, 255),
        "brown": _$(165, 42, 42),
        "burly wood": _$(222, 184, 135),
        "cadet blue": _$(95, 158, 160),
        "chart reuse": _$(127, 255),
        "chocolate": _$(210, 105, 30),
        "clear": _$(255, 255, 255),
        "coral": _$(255, 127, 80),
        "corn flower blue": _$(100, 149, 237),
        "corn silk": _$(255, 248, 220),
        "crimson": _$(220, 20, 60),
        "cyan": c,
        "dark blue": _$(0, 0, 139),
        "dark cyan": _$(0, 139, 139),
        "dark golden rod": _$(184, 134, 11),
        "dark gray": _$(169, 169, 169),
        "dark green": _$(0, 100),
        "dark khaki": _$(189, 183, 107),
        "dark magenta": _$(139, 0, 139),
        "dark olive green": _$(85, 107, 47),
        "dark orange": _$(255, 140),
        "dark orchid": _$(153, 50, 204),
        "dark red": _$(139),
        "dark salmon": _$(233, 150, 122),
        "dark sea green": _$(143, 188, 143),
        "dark slate blue": _$(72, 61, 139),
        "dark slate gray": _$(47, 79, 79),
        "dark turquoise": _$(0, 206, 209),
        "dark violet": _$(148, 0, 211),
        "deep pink": _$(255, 20, 147),
        "deep sky blue": _$(0, 191, 255),
        "dim gray": _$(105, 105, 105),
        "dodger blue": _$(30, 144, 255),
        "firebrick": _$(178, 34, 34),
        "floral white": _$(255, 250, 240),
        "forest green": _$(34, 139, 34),
        "fuchsia": _$(255, 0, 255),
        "gainsboro": _$(220, 220, 220),
        "ghost white": _$(248, 248, 255),
        "gold": _$(255, 215),
        "golden rod": _$(218, 165, 32),
        "gray": _$(128, 128, 128),
        "green yellow": _$(173, 255, 47),
        "green": _$(0, 128),
        "honeydew": _$(240, 255, 240),
        "hot pink": _$(255, 105, 180),
        "indian red": _$(205, 92, 92),
        "indigo": _$(75, 0, 130),
        "ivory": _$(255, 255, 240),
        "khaki": _$(240, 230, 140),
        "lavender blush": _$(255, 240, 245),
        "lavender": _$(230, 230, 250),
        "lawn green": _$(124, 252),
        "lemon chiffon": _$(255, 250, 205),
        "light blue": _$(173, 216, 230),
        "light coral": _$(240, 128, 128),
        "light cyan": _$(224, 255, 255),
        "light golden rod yellow": _$(250, 250, 210),
        "light gray": _$(211, 211, 211),
        "light green": _$(144, 238, 144),
        "light pink": _$(255, 182, 193),
        "light salmon": _$(255, 160, 122),
        "light sea green": _$(32, 178, 170),
        "light sky blue": _$(135, 206, 250),
        "light slate gray": _$(119, 136, 153),
        "light steel blue": _$(176, 196, 222),
        "light yellow": _$(255, 255, 224),
        "lime green": _$(50, 205, 50),
        "lime": _$(0, 255),
        "lime": _$(0, 255),
        "linen": _$(250, 240, 230),
        "magenta": _$(255, 0, 255),
        "maroon": _$(128),
        "medium aqua marine": _$(102, 205, 170),
        "medium blue": _$(0, 0, 205),
        "medium orchid": _$(186, 85, 211),
        "medium purple": _$(147, 112, 219),
        "medium sea green": _$(60, 179, 113),
        "medium slate blue": _$(123, 104, 238),
        "medium spring green": _$(0, 250, 154),
        "medium turquoise": _$(72, 209, 204),
        "medium violet red": _$(199, 21, 133),
        "midnight blue": _$(25, 25, 112),
        "mint cream": _$(245, 255, 250),
        "misty rose": _$(255, 228, 225),
        "moccasin": _$(255, 228, 181),
        "navajo white": _$(255, 222, 173),
        "navy": _$(0, 0, 128),
        "old lace": _$(253, 245, 230),
        "olive drab": _$(107, 142, 35),
        "olive": _$(128, 128),
        "orange red": _$(255, 69),
        "orange": _$(255, 165),
        "orchid": _$(218, 112, 214),
        "pale golden rod": _$(238, 232, 170),
        "pale green": _$(152, 251, 152),
        "pale turquoise": _$(175, 238, 238),
        "pale violet red": _$(219, 112, 147),
        "papaya whip": _$(255, 239, 213),
        "peach puff": _$(255, 218, 185),
        "peru": _$(205, 133, 63),
        "pink": _$(255, 192, 203),
        "plum": _$(221, 160, 221),
        "powder blue": _$(176, 224, 230),
        "purple": _$(128, 0, 128),
        "red": _$(255),
        "rosy brown": _$(188, 143, 143),
        "royal blue": _$(65, 105, 225),
        "saddle brown": _$(139, 69, 19),
        "salmon": _$(250, 128, 114),
        "sandy brown": _$(244, 164, 96),
        "sea green": _$(46, 139, 87),
        "sea shell": _$(255, 245, 238),
        "sienna": _$(160, 82, 45),
        "silver": _$(192, 192, 192),
        "sky blue": _$(135, 206, 235),
        "slate blue": _$(106, 90, 205),
        "slate gray": _$(112, 128, 144),
        "snow": _$(255, 250, 250),
        "spring green": _$(0, 255, 127),
        "steel blue": _$(70, 130, 180),
        "tan": _$(210, 180, 140),
        "teal": _$(0, 128, 128),
        "thistle": _$(216, 191, 216),
        "tomato": _$(255, 99, 71),
        "transparent": _$(0, 0, 0, 0),
        "turquoise": _$(64, 224, 208),
        "violet": _$(238, 130, 238),
        "wheat": _$(245, 222, 179),
        "white smoke": _$(245, 245, 245),
        "white": _$(255, 255, 255),
        "yellow green": _$(154, 205, 50),
        "yellow": _$(255, 255)
    };
}

class CSS_Percentage$2 extends Number {
    static setInput(input, value){
        input.type = "number";
        input.value = parseFloat(value);
    }

    static buildInput(value){
        let ele = document.createElement("input");
        ele.type = "number";
        ele.value = parseFloat(value) || 0;
        ele.addEventListener("change", (e)=>{
            ele.css_value = ele.value + "%";
        });
        return ele;
    }
    
    static parse(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;

        if (l.ty == l.types.num || tx == "-" && pky == l.types.num) {
            let mult = 1;

            if (l.ch == "-") {
                mult = -1;
                tx = l.p.tx;
                l.p.next();
            }

            if (l.p.ch == "%") {
                l.sync().next();
                return new CSS_Percentage$2(parseFloat(tx) * mult);
            }
        }
        return null;
    }

    static _verify_(l) {
        if(typeof(l) == "string" &&  !isNaN(parseInt(l)) && l.includes("%"))
            return true;
        return false;
    }

    static valueHandler(){
        let ele = document.createElement("input");
        ele.type = "number";
        ele.value = 100;
        return ele;
    }

    constructor(v) {

        if (typeof(v) == "string") {
            let lex = whind(v);
            let val = CSS_Percentage$2.parse(lex);
            if (val) 
                return val;
        }
        
        super(v);
    }

    toJSON() {
        return super.toString() + "%";
    }

    toString(radix) {
        return super.toString(radix) + "%";
    }

    get str() {
        return this.toString();
    }

    lerp(to, t) {
        return new CSS_Percentage$2(this + (to - this) * t);
    }

    copy(other){
        return new CSS_Percentage$2(other);
    }

    get type(){
        return "%";
    }
}

CSS_Percentage$2.label_name = "Percentage";

class CSS_Length$2 extends Number {

    static valueHandler(value, ui_seg){
        let ele = document.createElement("input");


        ele.type = "number";
        ele.value = (value) ? value + 0 : 0;
        
        ui_seg.css_value = ele.value + "%";
        
        ele.addEventListener("change", (e)=>{
            ele.css_value = ele.value + "px";
        });
        return ele;
    }

    static setInput(input, value){
        input.type = "number";
        input.value = value;
    }

    static buildInput(){
        let ele = document.createElement("input");
        ele.type = "number";
        return ele;
    }

    static parse(l) {
        let tx = l.tx,
            pky = l.pk.ty;
        if (l.ty == l.types.num || tx == "-" && pky == l.types.num) {
            let sign = 1;
            if (l.ch == "-") {
                sign = -1;
                tx = l.p.tx;
                l.p.next();
            }
            if (l.p.ty == l.types.id) {
                let id = l.sync().tx;
                l.next();
                return new CSS_Length$2(parseFloat(tx) * sign, id);
            }
        }
        return null;
    }

    static _verify_(l) {
        if (typeof(l) == "string" && !isNaN(parseInt(l)) && !l.includes("%")) return true;
        return false;
    }

    constructor(v, u = "") {
        
        if (typeof(v) == "string") {
            let lex = whind$1(v);
            let val = CSS_Length$2.parse(lex);
            if (val) return val;
        }

        if(u){
            switch(u){
                //Absolute
                case "px": return new PXLength$1(v);
                case "mm": return new MMLength$1(v);
                case "cm": return new CMLength$1(v);
                case "in": return new INLength$1(v);
                case "pc": return new PCLength$1(v);
                case "pt": return new PTLength$1(v);
                
                //Relative
                case "ch": return new CHLength$1(v);
                case "em": return new EMLength$1(v);
                case "ex": return new EXLength$1(v);
                case "rem": return new REMLength$1(v);

                //View Port
                case "vh": return new VHLength$1(v);
                case "vw": return new VWLength$1(v);
                case "vmin": return new VMINLength$1(v);
                case "vmax": return new VMAXLength$1(v);

                //Deg
                case "deg": return new DEGLength$1(v);

                case "%" : return new CSS_Percentage$2(v);
            }
        }

        super(v);
    }

    get milliseconds() {
        switch (this.unit) {
            case ("s"):
                return parseFloat(this) * 1000;
        }
        return parseFloat(this);
    }

    toString(radix) {
        return super.toString(radix) + "" + this.unit;
    }

    toJSON() {
        return super.toString() + "" + this.unit;
    }

    get str() {
        return this.toString();
    }

    lerp(to, t) {
        return new CSS_Length$2(this + (to - this) * t, this.unit);
    }

    copy(other) {
        return new CSS_Length$2(other, this.unit);
    }

    set unit(t){}
    get unit(){return "";}
}

class PXLength$1 extends CSS_Length$2 {
    get unit(){return "px";}
}
class MMLength$1 extends CSS_Length$2 {
    get unit(){return "mm";}
}
class CMLength$1 extends CSS_Length$2 {
    get unit(){return "cm";}
}
class INLength$1 extends CSS_Length$2 {
    get unit(){return "in";}
}
class PTLength$1 extends CSS_Length$2 {
    get unit(){return "pt";}
}
class PCLength$1 extends CSS_Length$2 {
    get unit(){return "pc";}
}
class CHLength$1 extends CSS_Length$2 {
    get unit(){return "ch";}
}
class EMLength$1 extends CSS_Length$2 {
    get unit(){return "em";}
}
class EXLength$1 extends CSS_Length$2 {
    get unit(){return "ex";}
}
class REMLength$1 extends CSS_Length$2 {
    get unit(){return "rem";}
}
class VHLength$1 extends CSS_Length$2 {
    get unit(){return "vh";}
}
class VWLength$1 extends CSS_Length$2 {
    get unit(){return "vw";}
}
class VMINLength$1 extends CSS_Length$2 {
    get unit(){return "vmin";}
}
class VMAXLength$1 extends CSS_Length$2 {
    get unit(){return "vmax";}
}
class DEGLength$1 extends CSS_Length$2 {
    get unit(){return "deg";}
}

class CSS_URL$1 extends URL {
    static parse(l) {
        if (l.tx == "url" || l.tx == "uri") {
            l.next().a("(");
            let v = "";
            if (l.ty == l.types.str) {
                v = l.tx.slice(1,-1);
                l.next().a(")");
            } else {
                const p = l.peek();
                while (!p.END && p.next().tx !== ")") { /* NO OP */ }
                v = p.slice(l);
                l.sync().a(")");
            }
            return new CSS_URL$1(v);
        } if (l.ty == l.types.str){
            let v = l.tx.slice(1,-1);
            l.next();
            return new CSS_URL$1(v);
        }

        return null;
    }
}

class CSS_String$1 extends String {
    
    static list(){}

    static valueHandler(existing_value){
        let ele = document.createElement("input");
        ele.type = "text";
        ele.value = existing_value || "";
        return ele;
    }

    static setInput(input, value){
        input.type = "text";
        input.value = value;
    }

    static buildInput(){
        let ele = document.createElement("input");
        ele.type = "text";
        return ele;
    }

    static parse(l) {
        if (l.ty == l.types.str) {
            let tx = l.tx;
            l.next();
            return new CSS_String$1(tx);
        }
        return null;
    }

    constructor(string){
        if(string[0] == "\"" || string[0] == "\'" || string[0] == "\'")
            string = string.slice(1,-1);
        super(string);
    }
}

class CSS_Id$1 extends String {
    static parse(l) {
        if (l.ty == l.types.id) {
            let tx = l.tx;
            l.next();
            return new CSS_Id$1(tx);
        }
        return null;
    }
}

/* https://www.w3.org/TR/css-shapes-1/#typedef-basic-shape */
class CSS_Shape$1 extends Array {
    static parse(l) {
        if (l.tx == "inset" || l.tx == "circle" || l.tx == "ellipse" || l.tx == "polygon" || l.tx == "rect") {
            l.next().a("(");
            let v = "";
            if (l.ty == l.types.str) {
                v = l.tx.slice(1,-1);
                l.next().a(")");
            } else {
                let p = l.pk;
                while (!p.END && p.next().tx !== ")") { /* NO OP */ }
                v = p.slice(l);
                l.sync().a(")");
            }
            return new CSS_Shape$1(v);
        }
        return null;
    }
}

class CSS_Number$1 extends Number {

    static valueHandler(value){
        let ele = document.createElement("input");
        ele.type = "number";
        ele.value = (value) ? value + 0 : 0;
        ele.addEventListener("change", (e)=>{
            ele.css_value = ele.value;
        });
        return ele;
    }

    static setInput(input, value){
        input.type = "number";
        input.value = value;
    }

    static buildInput(){
        let ele = document.createElement("input");
        ele.type = "number";
        return ele;
    }

    static parse(l) {
        
        let sign = 1;

        if(l.ch == "-" && l.pk.ty == l.types.num){
        	l.sync();
        	sign = -1;
        }

        if(l.ty == l.types.num){
        	let tx = l.tx;
            l.next();
            return new CSS_Number$1(sign*(new Number(tx)));
        }
        return null;
    }
}

class Point2D$1 extends Float64Array{
	
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

const sqrt$1 = Math.sqrt;
const cos$1 = Math.cos;
const acos$1 = Math.acos;
const PI$1 = Math.PI; 
const pow$1 = Math.pow;

// A helper function to filter for values in the [0,1] interval:
function accept$1(t) {
  return 0<=t && t <=1;
}

// A real-cuberoots-only function:
function cuberoot$1(v) {
  if(v<0) return -pow$1(-v,1/3);
  return pow$1(v,1/3);
}

function point$1(t, p1, p2, p3, p4) {
	var ti = 1 - t;
	var ti2 = ti * ti;
	var t2 = t * t;
	return ti * ti2 * p1 + 3 * ti2 * t * p2 + t2 * 3 * ti * p3 + t2 * t * p4;
}


class CBezier$1 extends Float64Array{
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
		return point$1(t, this[1], this[3], this[5], this[7]);
	}

	valX(t){
		return point$1(t, this[0], this[2], this[4], this[6]);
	}

	point(t) {
		return new Point2D$1(
			point$1(t, this[0], this[2], this[4], this[6]),
			point$1(t, this[1], this[3], this[5], this[7])
		)
	}
	
	/** 
		Acquired from : https://pomax.github.io/bezierinfo/
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
				r = sqrt$1(mp33),
				t = -q / (2 * r),
				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
				phi = acos$1(cosphi),
				crtr = cuberoot$1(r),
				t1 = 2 * crtr;
			root1 = t1 * cos$1(phi / 3) - a / 3;
			root2 = t1 * cos$1((phi + 2 * PI$1) / 3) - a / 3;
			root3 = t1 * cos$1((phi + 4 * PI$1) / 3) - a / 3;
			return [root3, root1, root2]
		}

		// three real roots, but two of them are equal:
		if (discriminant === 0) {
			u1 = q2 < 0 ? cuberoot$1(-q2) : -cuberoot$1(q2);
			root1 = 2 * u1 - a / 3;
			root2 = -u1 - a / 3;
			return [root2, root1];
		}

		// one real root, two complex roots
		var sd = sqrt$1(discriminant);
		u1 = cuberoot$1(sd - q2);
		v1 = cuberoot$1(sd + q2);
		root1 = u1 - v1 - a / 3;
		return [root1];
	}

	rootsY() {
		return this.roots(this[1],this[3],this[5],this[7]);
	}

	rootsX() {
		return this.roots(this[0],this[2],this[4],this[6]);
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
				r = sqrt$1(mp33),
				t = -q / (2 * r),
				cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
				phi = acos$1(cosphi),
				crtr = cuberoot$1(r),
				t1 = 2 * crtr;
			root = t1 * cos$1((phi + 4 * PI$1) / 3) - a / 3;
		}else if (discriminant === 0) {
			u1 = q2 < 0 ? cuberoot$1(-q2) : -cuberoot$1(q2);
			root = -u1 - a * i3;
		}else{
			var sd = sqrt$1(discriminant);
			// one real root, two complex roots
			u1 = cuberoot$1(sd - q2);
			v1 = cuberoot$1(sd + q2);
			root = u1 - v1 - a * i3;	
		}

		return point$1(root, this[1], this[3], this[5], this[7]);
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

function curvePoint$1(curve, t) {
    var point = {
        x: 0,
        y: 0
    };
    point.x = posOnCurve$1(t, curve[0], curve[2], curve[4]);
    point.y = posOnCurve$1(t, curve[1], curve[3], curve[5]);
    return point;
}

function posOnCurve$1(t, p1, p2, p3) {
    var ti = 1 - t;
    return ti * ti * p1 + 2 * ti * t * p2 + t * t * p3;
}

function splitCurve$1(bp, t) {
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
        x: new QBezier$1(right),
        y: new QBezier$1(left)
    };
}

function curveIntersections$1(p1, p2, p3) {
    var intersections = {
        a: Infinity,
        b: Infinity
    };

    var a = p1 - 2 * p2 + p3;

    var b = 2 * (p2 - p1);

    var c = p1;

    if (b == 0) {} else if (Math.abs(a) < 0.00000000005) {
        intersections.a = (-c / b); //c / b;
    } else {

        intersections.a = ((-b - Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
        intersections.b = ((-b + Math.sqrt((b * b) - 4 * a * c)) / (2 * a));
    }
    return intersections
}

class QBezier$1 {
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

        if (x1 instanceof QBezier$1) {
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
        return new QBezier$1(
            this.x3,
            this.y3,
            this.x2,
            this.y2,
            this.x1,
            this.y1
        )
    }

    point(t) {
        return new Point2D$1(
            posOnCurve$1(t, this.x1, this.x2, this.x3),
            posOnCurve$1(t, this.y1, this.y2, this.y3))

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
        return splitCurve$1(this.toArray(), t);
    }

    rootsX() {
        return this.roots(
            this.x1,
            this.x2,
            this.x3
        )

    }

    roots(p1, p2, p3) {
        var curve = this.toArray();

        var c = p1 - (2 * p2) + p3;
        var b = 2 * (p2 - p1);
        var a = p1;
        var a2 = a * 2;
        var sqrt = Math.sqrt(b * b - (a * 4 * c));
        var t1 = (-b + sqrt) / a2;
        var t2 = (-b - sqrt) / a2;

        return [t1, t2];
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

        return [t1, t2];
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

        return new QBezier$1(new_curve);
    }

    intersects() {
        return {
            x: curveIntersections$1(this.x1, this.x2, this.x3),
            y: curveIntersections$1(this.y1, this.y2, this.y3)
        }
    }

    add(x, y) {
        if (typeof(x) == "number") {
            return new QBezier$1(
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

class CSS_Bezier$2 extends CBezier$1 {
	static parse(l) {

		let out = null;

		switch(l.tx){
			case "cubic":
				l.next().a("(");
				let v1 = parseFloat(l.tx);
				let v2 = parseFloat(l.next().a(",").tx);
				let v3 = parseFloat(l.next().a(",").tx);
				let v4 = parseFloat(l.next().a(",").tx);
				l.a(")");
				out = new CSS_Bezier$2(v1, v2, v3, v4);
				break;
			case "ease":
				l.next();
				out = new CSS_Bezier$2(0.25, 0.1, 0.25, 1);
				break;
			case "ease-in":
				l.next();
				out = new CSS_Bezier$2(0.42, 0, 1, 1);
				break;
			case "ease-out":
				l.next();
				out = new CSS_Bezier$2(0, 0, 0.58, 1);
				break;
			case "ease-in-out":
				l.next();
				out = new CSS_Bezier$2(0.42, 0, 0.58, 1);
				break;
		}

		return out;
	}

	toString(){
		 return `cubic-bezier(${this[2]},${this[3]},${this[4]},${this[5]})`;
	}
}

class Stop$1{
    constructor(color, percentage){
        this.color = color;
        this.percentage = percentage || null;
    }

    toString(){
        return `${this.color}${(this.percentage)?" "+this.percentage:""}`;
    }
}

class CSS_Gradient$1{

    static parse(l) {
        let tx = l.tx,
            pky = l.pk.ty;
        if (l.ty == l.types.id) {
            switch(l.tx){
                case "linear-gradient":
                l.next().a("(");
                let dir,num,type ="deg";
                if(l.tx == "to"){

                }else if(l.ty == l.types.num){
                    num = parseFloat(l.ty);
                    type = l.next().tx;
                    l.next().a(',');
                }

                let stops = [];
                
                while(!l.END && l.ch != ")"){
                    let v = CSS_Color$2.parse(l, rule, r);
                    let len = null;

                    if(l.ch == ")") {
                        stops.push(new Stop$1(v, len));
                        break;
                    }
                    
                    if(l.ch != ","){
                        if(!(len = CSS_Length$2.parse(l)))
                            len = CSS_Percentage$2.parse(l);
                    }else
                        l.next();
                    

                    stops.push(new Stop$1(v, len));
                }
                l.a(")");
                let grad = new CSS_Gradient$1();
                grad.stops = stops;
                return grad;
            }
        }
        return null;
    }


    constructor(type = 0){
        this.type = type; //linear gradient
        this.direction = new CSS_Length$2(0, "deg");
        this.stops = [];
    }

    toString(){
        let str = [];
        switch(this.type){
            case 0:
            str.push("linear-gradient(");
            if(this.direction !== 0)
                str.push(this.direction.toString() + ",");
            break;
        }

        for(let i = 0; i < this.stops.length; i++)
            str.push(this.stops[i].toString()+((i<this.stops.length-1)?",":""));

        str.push(")");

        return str.join(" ");
    }
}

const $medh$1 = (prefix) => ({
    parse: (l, r, a, n = 0) => (n = CSS_Length$2.parse(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.innerHeight <= n : (win) => win.innerHeight >= n) : (win) => win.screen.height == n)
});


const $medw$1 = (prefix) => ({
    parse: (l, r, a, n = 0) => 
        (n = CSS_Length$2.parse(l, r, a), (prefix > 0) ? ((prefix > 1) ? (win) => win.innerWidth >= n : (win) => win.innerWidth <= n) : (win) => win.screen.width == n)
});

function CSS_Media_handle$1(type, prefix) {
    switch (type) {
        case "h":
            return $medh$1(prefix);
        case "w":
            return $medw$1(prefix);
    }

    return {
        parse: function(a) {
            debugger;
        }
    };
}

function getValue$1(lex, attribute) {
    let v = lex.tx,
        mult = 1;

    if (v == "-")
        v = lex.n.tx, mult = -1;

    let n = parseFloat(v) * mult;

    lex.next();

    if (lex.ch !== ")" && lex.ch !== ",") {
        switch (lex.tx) {
            case "%":
                break;

            /* Rotational Values */
            case "grad":
                n *= Math.PI / 200;
                break;
            case "deg":
                n *= Math.PI / 180;
                break;
            case "turn":
                n *= Math.PI * 2;
                break;
            case "px":
                break;
            case "em":
                break;
        }
        lex.next();
    }
    return n;
}

function ParseString$1(string, transform) {
    let lex = null;
    lex = string;

    if(typeof(string) == "string")
        lex = whind$1(string);
    
    while (!lex.END) {
        let tx = lex.tx;
        lex.next();
        switch (tx) {
            case "matrix":

                let a = getValue$1(lex.a("(")),
                    b = getValue$1(lex.a(",")),
                    c = getValue$1(lex.a(",")),
                    d = getValue$1(lex.a(",")),
                    r = -Math.atan2(b, a),
                    sx1 = (a / Math.cos(r)) || 0,
                    sx2 = (b / -Math.sin(r)) || 0,
                    sy1 = (c / Math.sin(r)) || 0,
                    sy2 = (d / Math.cos(r)) || 0;
                
                if(sx2 !== 0)
                    transform.sx = (sx1 + sx2) * 0.5;
                else
                    transform.sx = sx1;

                if(sy1 !== 0)
                    transform.sy = (sy1 + sy2) * 0.5;
                else
                    transform.sy = sy2;

                transform.px = getValue$1(lex.a(","));
                transform.py = getValue$1(lex.a(","));
                transform.r = r;
                lex.a(")");
                break;
            case "matrix3d":
                break;
            case "translate":
                transform.px = getValue$1(lex.a("("), "left");
                lex.a(",");
                transform.py = getValue$1(lex, "left");
                lex.a(")");
                continue;
            case "translateX":
                transform.px = getValue$1(lex.a("("), "left");
                lex.a(")");
                continue;
            case "translateY":
                transform.py = getValue$1(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scale":
                transform.sx = getValue$1(lex.a("("), "left");
                if(lex.ch ==","){
                    lex.a(",");
                    transform.sy = getValue$1(lex, "left");
                }
                else transform.sy = transform.sx;
                lex.a(")");
                continue;
            case "scaleX":
                transform.sx = getValue$1(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scaleY":
                transform.sy = getValue$1(lex.a("("), "left");
                lex.a(")");
                continue;
            case "scaleZ":
                break;
            case "rotate":
                transform.r = getValue$1(lex.a("("));
                lex.a(")");
                continue;
            case "rotateX":
                break;
            case "rotateY":
                break;
            case "rotateZ":
                break;
            case "rotate3d":
                break;
            case "perspective":
                break;
        }
        lex.next();
    }
}
// A 2D transform composition of 2D position, 2D scale, and 1D rotation.

class CSS_Transform2D$3 extends Float64Array {
    static ToString(pos = [0, 0], scl = [1, 1], rot = 0) {
        var px = 0,
            py = 0,
            sx = 1,
            sy = 1,
            r = 0, cos = 1, sin = 0;
        if (pos.length == 5) {
            px = pos[0];
            py = pos[1];
            sx = pos[2];
            sy = pos[3];
            r = pos[4];
        } else {
            px = pos[0];
            py = pos[1];
            sx = scl[0];
            sy = scl[1];
            r = rot;
        }
        
        if(r !== 0){
            cos = Math.cos(r);
            sin = Math.sin(r);
        }

        return `matrix(${cos * sx}, ${-sin * sx}, ${sy * sin}, ${sy * cos}, ${px}, ${py})`;
    }


    constructor(px, py, sx, sy, r) {
        super(5);
        this.sx = 1;
        this.sy = 1;
        if (px !== undefined) {
            if (px instanceof CSS_Transform2D$3) {
                this[0] = px[0];
                this[1] = px[1];
                this[2] = px[2];
                this[3] = px[3];
                this[4] = px[4];
            } else if (typeof(px) == "string") ParseString$1(px, this);
            else {
                this[0] = px;
                this[1] = py;
                this[2] = sx;
                this[3] = sy;
                this[4] = r;
            }
        }
    }
    get px() {
        return this[0];
    }
    set px(v) {
        this[0] = v;
    }
    get py() {
        return this[1];
    }
    set py(v) {
        this[1] = v;
    }
    get sx() {
        return this[2];
    }
    set sx(v) {
        this[2] = v;
    }
    get sy() {
        return this[3];
    }
    set sy(v) {
        this[3] = v;
    }
    get r() {
        return this[4];
    }
    set r(v) {
        this[4] = v;
    }

    set scale(s){
        this.sx = s;
        this.sy = s;
    }

    get scale(){
        return this.sx;
    }
    
    lerp(to, t) {
        let out = new CSS_Transform2D$3();
        for (let i = 0; i < 5; i++) out[i] = this[i] + (to[i] - this[i]) * t;
        return out;
    }
    toString() {
        return CSS_Transform2D$3.ToString(this);
    }

    copy(v) {
        let copy = new CSS_Transform2D$3(this);


        if (typeof(v) == "string")
            ParseString$1(v, copy);

        return copy;
    }

    /**
     * Sets the transform value of a canvas 2D context;
     */
    setCTX(ctx){       
        let cos = 1, sin = 0;
        if(this[4] != 0){
            cos = Math.cos(this[4]);
            sin = Math.sin(this[4]);
        }
        ctx.transform(cos * this[2], -sin * this[2], this[3] * sin, this[3] * cos, this[0], this[1]);
    }

    getLocalX(X){
        return (X - this.px) / this.sx;
    }

    getLocalY(Y){
        return (Y - this.py) / this.sy;
    }
}

/**
 * @brief Path Info
 * @details Path syntax information for reference
 * 
 * MoveTo: M, m
 * LineTo: L, l, H, h, V, v
 * Cubic Bézier Curve: C, c, S, s
 * Quadratic Bézier Curve: Q, q, T, t
 * Elliptical Arc Curve: A, a
 * ClosePath: Z, z
 * 
 * Capital symbols represent absolute positioning, lowercase is relative
 */
const PathSym$1 = {
    M: 0,
    m: 1,
    L: 2,
    l: 3,
    h: 4,
    H: 5,
    V: 6,
    v: 7,
    C: 8,
    c: 9,
    S: 10,
    s: 11,
    Q: 12,
    q: 13,
    T: 14,
    t: 15,
    A: 16,
    a: 17,
    Z: 18,
    z: 19,
    pairs: 20
};

function getSignedNumber$1(lex) {
    let mult = 1,
        tx = lex.tx;
    if (tx == "-") {
        mult = -1;
        tx = lex.n.tx;
    }
    lex.next();
    return parseFloat(tx) * mult;
}

function getNumberPair$1(lex, array) {
    let x = getSignedNumber$1(lex);
    if (lex.ch == ',') lex.next();
    let y = getSignedNumber$1(lex);
    array.push(x, y);
}

function parseNumberPairs$1(lex, array) {
    while ((lex.ty == lex.types.num || lex.ch == "-") && !lex.END) {    	
    	array.push(PathSym$1.pairs);
        getNumberPair$1(lex, array);
    }
}
/**
 * @brief An array store of path data in numerical form
 */
class CSS_Path$2 extends Array {
    static FromString(string, array) {
        let lex = whind(string);
        while (!lex.END) {
            let relative = false,
                x = 0,
                y = 0;
            switch (lex.ch) {
                //Move to
                case "m":
                    relative = true;
                case "M":
                    lex.next(); //
                    array.push((relative) ? PathSym$1.m : PathSym$1.M);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                    //Line to
                case "h":
                    relative = true;
                case "H":
                    lex.next();
                    x = getSignedNumber$1(lex);
                    array.push((relative) ? PathSym$1.h : PathSym$1.H, x);
                    continue;
                case "v":
                    relative = true;
                case "V":
                    lex.next();
                    y = getSignedNumber$1(lex);
                    array.push((relative) ? PathSym$1.v : PathSym$1.V, y);
                    continue;
                case "l":
                    relative = true;
                case "L":
                    lex.next();
                    array.push((relative) ? PathSym$1.l : PathSym$1.L);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                    //Cubic Curve
                case "c":
                    relative = true;
                case "C":
                    array.push((relative) ? PathSym$1.c : PathSym$1.C);
                    getNumberPair$1(lex, array);
                    getNumberPair$1(lex, array);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                case "s":
                    relative = true;
                case "S":
                    array.push((relative) ? PathSym$1.s : PathSym$1.S);
                    getNumberPair$1(lex, array);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                    //Quadratic Curve0
                case "q":
                    relative = true;
                case "Q":
                    array.push((relative) ? PathSym$1.q : PathSym$1.Q);
                    getNumberPair$1(lex, array);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                case "t":
                    relative = true;
                case "T":
                    array.push((relative) ? PathSym$1.t : PathSym$1.T);
                    getNumberPair$1(lex, array);
                    parseNumberPairs$1(lex, array);
                    continue;
                    //Elliptical Arc
                    //Close path:
                case "z":
                    relative = true;
                case "Z":
                    array.push((relative) ? PathSym$1.z : PathSym$1.Z);
            }
            lex.next();
        }
    }

    static ToString(array) {
    	let string = [], l = array.length, i = 0;
    	while(i < l){
    		switch(array[i++]){
    			case PathSym$1.M:
    				string.push("M", array[i++], array[i++]);
    				break;
			    case PathSym$1.m:
			    	string.push("m", array[i++], array[i++]);
			    	break;
			    case PathSym$1.L:
			    	string.push("L", array[i++], array[i++]);
			    	break;
			    case PathSym$1.l:
			    	string.push("l", array[i++], array[i++]);
			    	break;
			    case PathSym$1.h:
			    	string.push("h", array[i++]);
			    	break;
			    case PathSym$1.H:
			    	string.push("H", array[i++]);
			    	break;
			    case PathSym$1.V:
			    	string.push("V", array[i++]);
			    	break;
			    case PathSym$1.v:
			    	string.push("v", array[i++]);
			    	break;
			    case PathSym$1.C:
			    	string.push("C", array[i++], array[i++], array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.c:
			    	string.push("c", array[i++], array[i++], array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.S:
			    	string.push("S", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.s:
			    	string.push("s", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.Q:
			    	string.push("Q", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.q:
			    	string.push("q", array[i++], array[i++], array[i++], array[i++]);
			    	break;
			    case PathSym$1.T:
			    	string.push("T", array[i++], array[i++]);
			    	break;
			    case PathSym$1.t:
			    	string.push("t", array[i++], array[i++]);
			    	break;
			    case PathSym$1.Z:
			    	string.push("Z");
			    	break;
			    case PathSym$1.z:
			    	string.push("z");
			    	break;
			    case PathSym$1.pairs:
			    	string.push(array[i++], array[i++]);
			    	break;
			 	case PathSym$1.A:
			    case PathSym$1.a:
			    default:
			    	i++;
    		}
    	}

    	return string.join(" ");
    }

    
    constructor(data) {
        super();	

    	if(typeof(data) == "string"){
    		Path.FromString(data, this);
    	}else if(Array.isArray(data)){
    		for(let i = 0; i < data.length;i++){
    			this.push(parseFloat(data[i]));
    		}
    	}
    }

    toString(){
    	return Path.ToString(this);
    }

    lerp(to, t, array = new Path){
    	let l = Math.min(this.length, to.length);

    	for(let i = 0; i < l; i++)
    		array[i] = this[i] + (to[i] - this[i]) * t;

    	return array;
    }	
}

class CSS_FontName extends String {
	static parse(l) {

		if(l.ty == l.types.str){
			let tx = l.tx;
            l.next();
			return new CSS_String$1(tx);
		}		

		if(l.ty == l.types.id){

			let pk = l.peek();

			while(pk.type == l.types.id && !pk.END){
				pk.next();
			}

			let str = pk.slice(l);
			
			l.sync();
			return new CSS_String$1(str);
		}

        return null;
    }
}

/**
 * CSS Type constructors
 */
const types$2 = {
	color: CSS_Color$2,
	length: CSS_Length$2,
	time: CSS_Length$2,
	flex: CSS_Length$2,
	angle: CSS_Length$2,
	frequency: CSS_Length$2,
	resolution: CSS_Length$2,
	percentage: CSS_Percentage$2,
	url: CSS_URL$1,
	uri: CSS_URL$1,
	number: CSS_Number$1,
	id: CSS_Id$1,
	string: CSS_String$1,
	shape: CSS_Shape$1,
	cubic_bezier: CSS_Bezier$2,
	integer: CSS_Number$1,
	gradient: CSS_Gradient$1,
	transform2D : CSS_Transform2D$3,
	path: CSS_Path$2,
	fontname: CSS_FontName,

	/* Media parsers */
	m_width: CSS_Media_handle$1("w", 0),
	m_min_width: CSS_Media_handle$1("w", 1),
	m_max_width: CSS_Media_handle$1("w", 2),
	m_height: CSS_Media_handle$1("h", 0),
	m_min_height: CSS_Media_handle$1("h", 1),
	m_max_height: CSS_Media_handle$1("h", 2),
	m_device_width: CSS_Media_handle$1("dw", 0),
	m_min_device_width: CSS_Media_handle$1("dw", 1),
	m_max_device_width: CSS_Media_handle$1("dw", 2),
	m_device_height: CSS_Media_handle$1("dh", 0),
	m_min_device_height: CSS_Media_handle$1("dh", 1),
	m_max_device_height: CSS_Media_handle$1("dh", 2)
};

/**
 * CSS Property Definitions https://www.w3.org/TR/css3-values/#value-defs
 */
const property_definitions$1 = {

	/* https://drafts.csswg.org/css-writing-modes-3/ */
		direction:"ltr|rtl",
		unicode_bidi:"normal|embed|isolate|bidi-override|isolate-override|plaintext",
		writing_mode:"horizontal-tb|vertical-rl|vertical-lr",
		text_orientation:"mixed|upright|sideways",
		glyph_orientation_vertical:`auto|0deg|90deg|"0"|"90"`,
		text_combine_upright:"none|all",

	/* https://www.w3.org/TR/css-position-3 */ 
		position: "static|relative|absolute|sticky|fixed",
		top: `<length>|<percentage>|auto`,
		left: `<length>|<percentage>|auto`,
		bottom: `<length>|<percentage>|auto`,
		right: `<length>|<percentage>|auto`,
		offset_before: `<length>|<percentage>|auto`,
		offset_after: `<length>|<percentage>|auto`,
		offset_start: `<length>|<percentage>|auto`,
		offset_end: `<length>|<percentage>|auto`,
		z_index:"auto|<integer>",

	/* https://www.w3.org/TR/css-display-3/ */
		display: `[ <display_outside> || <display_inside> ] | <display_listitem> | <display_internal> | <display_box> | <display_legacy>`,

	/* https://www.w3.org/TR/css-box-3 */
		margin: `[<length>|<percentage>|0|auto]{1,4}`,
		margin_top: `<length>|<percentage>|0|auto`,
		margin_right: `<length>|<percentage>|0|auto`,
		margin_bottom: `<length>|<percentage>|0|auto`,
		margin_left: `<length>|<percentage>|0|auto`,

		margin_trim:"none|in-flow|all",

		padding: `[<length>|<percentage>|0|auto]{1,4}`,
		padding_top: `<length>|<percentage>|0|auto`,
		padding_right: `<length>|<percentage>|0|auto`,
		padding_bottom: `<length>|<percentage>|0|auto`,
		padding_left: `<length>|<percentage>|0|auto`,

	/* https://www.w3.org/TR/CSS2/visuren.html */
		float: `left|right|none`,
		clear: `left|right|both|none`,

	/* https://drafts.csswg.org/css-sizing-3 todo:implement fit-content(%) function */
		box_sizing: `content-box | border-box`,
		width: `<length>|<percentage>|min-content|max-content|fit-content|auto`,
		height: `<length>|<percentage>|min-content|max-content|fit-content|auto`,
		min_width: `<length>|<percentage>|min-content|max-content|fit-content|auto`,
		max_width: `<length>|<percentage>|min-content|max-content|fit-content|auto|none`,
		min_height: `<length>|<percentage>|min-content|max-content|fit-content|auto`,
		max_height: `<length>|<percentage>|min-content|max-content|fit-content|auto|none`,

	/* https://www.w3.org/TR/2018/REC-css-color-3-20180619 */
		color: `<color>`,
		opacity: `<alphavalue>`,

	/* https://www.w3.org/TR/css-backgrounds-3/ */
		background_color: `<color>`,
		background_image: `<bg_image>#`,
		background_repeat: `<repeat_style>#`,
		background_attachment: `scroll|fixed|local`,
		background_position: `[<percentage>|<length>]{1,2}|[top|center|bottom]||[left|center|right]`,
		background_clip: `<box>#`,
		background_origin: `<box>#`,
		background_size: `<bg_size>#`,
		background: `[<bg_layer>#,]?<final_bg_layer>`,
		border_color: `<color>{1,4}`,
		border_top_color: `<color>`,
		border_right_color: `<color>`,
		border_bottom_color: `<color>`,
		border_left_color: `<color>`,

		border_top_width: `<line_width>`,
		border_right_width: `<line_width>`,
		border_bottom_width: `<line_width>`,
		border_left_width: `<line_width>`,
		border_width: `<line_width>{1,4}`,

		border_style: `<line_style>{1,4}`,
		border_top_style: `<line_style>`,
		border_right_style: `<line_style>`,
		border_bottom_style: `<line_style>`,
		border_left_style: `<line_style>`,

		border_top: `<line_width>||<line_style>||<color>`,
		border_right: `<line_width>||<line_style>||<color>`,
		border_bottom: `<line_width>||<line_style>||<color>`,
		border_left: `<line_width>||<line_style>||<color>`,

		border_radius: `<length_percentage>{1,4}[ / <length_percentage>{1,4}]?`,
		border_top_left_radius: `<length_percentage>{1,2}`,
		border_top_right_radius: `<length_percentage>{1,2}`,
		border_bottom_right_radius: `<length_percentage>{1,2}`,
		border_bottom_left_radius: `<length_percentage>{1,2}`,

		border: `<line_width>||<line_style>||<color>`,

		border_image: `<border_image_source>||<border_image_slice>[/<border_image_width>|/<border_image_width>?/<border_image_outset>]?||<border_image_repeat>`,
		border_image_source: `none|<image>`,
		border_image_slice: `[<number>|<percentage>]{1,4}&&fill?`,
		border_image_width: `[<length_percentage>|<number>|auto]{1,4}`,
		border_image_outset: `[<length>|<number>]{1,4}`,
		border_image_repeat: `[stretch|repeat|round|space]{1,2}`,
		box_shadow: `none|<shadow>#`,
		line_height: `normal|<percentage>|<length>|<number>`,
		overflow: 'visible|hidden|scroll|auto',

	/* https://www.w3.org/TR/css-fonts-4 */
		font_display: "auto|block|swap|fallback|optional",
		font_family: `[[<generic_family>|<family_name>],]*[<generic_family>|<family_name>]`,
		font_language_override:"normal|<string>",
		font: `[[<font_style>||<font_variant>||<font_weight>]?<font_size>[/<line_height>]?<font_family>]|caption|icon|menu|message-box|small-caption|status-bar`,
		font_max_size: `<absolute_size>|<relative_size>|<length>|<percentage>|infinity`,
		font_min_size: `<absolute_size>|<relative_size>|<length>|<percentage>`,
		font_optical_sizing: `auto|none`,
		font_pallette: `normal|light|dark|<identifier>`,
		font_size: `<absolute_size>|<relative_size>|<length>|<percentage>`,
		font_stretch:"<percentage>|normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",
		font_style: `normal|italic|oblique<angle>?`,
		font_synthesis:"none|[weight||style]",
		font_synthesis_small_caps:"auto|none",
		font_synthesis_style:"auto|none",
		font_synthesis_weight:"auto|none",
		font_variant_alternates:"normal|[stylistic(<feature-value-name>)||historical-forms||styleset(<feature-value-name>#)||character-variant(<feature-value-name>#)||swash(<feature-value-name>)||ornaments(<feature-value-name>)||annotation(<feature-value-name>)]",
		font_variant_emoji:"auto|text|emoji|unicode",
		font_variation_settings:" normal|[<string><number>]#",
		font_size_adjust: `<number>|none`,
		
		font_weight: `normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900`,

	/* https://www.w3.org/TR/css-fonts-3/ */
		font_kerning: ` auto | normal | none`,
		font_variant: `normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby||[sub|super]]`,
		font_variant_ligatures:`normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values> ]`,
		font_variant_position:`normal|sub|super`,
		font_variant_caps:`normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps`,
		font_variant_numeric: "normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]",
		font_variant_east_asian:" normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]",

	/* https://drafts.csswg.org/css-text-3 */
		hanging_punctuation : "none|[first||[force-end|allow-end]||last]",
		hyphens : "none|manual|auto",
		letter_spacing: `normal|<length>`,
		line_break : "auto|loose|normal|strict|anywhere",
		overflow_wrap : "normal|break-word|anywhere",
		tab_size : "<length>|<number>",
		text_align : "start|end|left|right|center|justify|match-parent|justify-all",
		text_align_all : "start|end|left|right|center|justify|match-parent",
		text_align_last : "auto|start|end|left|right|center|justify|match-parent",
		text_indent : "[[<length>|<percentage>]&&hanging?&&each-line?]",
		text_justify : "auto|none|inter-word|inter-character",
		text_transform : "none|[capitalize|uppercase|lowercase]||full-width||full-size-kana",
		white_space : "normal|pre|nowrap|pre-wrap|break-spaces|pre-line",
		word_break : " normal|keep-all|break-all|break-word",
		word_spacing : "normal|<length>",
		word_wrap : "  normal | break-word | anywhere",

	/* https://drafts.csswg.org/css-text-decor-3 */
		text_decoration: "<text-decoration-line>||<text-decoration-style>||<color>",
		text_decoration_color:"<color>",
		text_decoration_line:"none|[underline||overline||line-through||blink]",
		text_decoration_style:"solid|double|dotted|dashed|wavy",
		text_emphasis:"<text-emphasis-style>||<text-emphasis-color>",
		text_emphasis_color:"<color>",
		text_emphasis_position:"[over|under]&&[right|left]?",
		text_emphasis_style:"none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
		text_shadow:"none|[<color>?&&<length>{2,3}]#",
		text_underline_position:"auto|[under||[left|right]]",

	/* Flex Box https://www.w3.org/TR/css-flexbox-1/ */
		align_content: `flex-start | flex-end | center | space-between | space-around | stretch`,
		align_items: `flex-start | flex-end | center | baseline | stretch`,
		align_self: `auto | flex-start | flex-end | center | baseline | stretch`,
		flex:`none|[<flex-grow> <flex-shrink>?||<flex-basis>]`,
		flex_basis:`content|<width>`,
		flex_direction:`row | row-reverse | column | column-reverse`,
		flex_flow:`<flex-direction>||<flex-wrap>`,
		flex_grow:`<number>`,
		flex_shrink:`<number>`,
		flex_wrap:`nowrap|wrap|wrap-reverse`,
		justify_content :"flex-start | flex-end | center | space-between | space-around",
		order:`<integer>`,

	/* https://drafts.csswg.org/css-transitions-1/ */
		transition: `<single_transition>#`,
		transition_delay: `<time>#`,
		transition_duration: `<time>#`,
		transition_property: `none|<single_transition_property>#`,
		transition_timing_function: `<timing_function>#`,

	/* CSS3 Animation https://drafts.csswg.org/css-animations-1/ */
		animation: `<single_animation>#`,
		animation_name: `[none|<keyframes_name>]#`,
		animation_duration: `<time>#`,
		animation_timing_function: `<timing_function>#`,
		animation_iteration_count: `<single_animation_iteration_count>#`,
		animation_direction: `<single_animation_direction>#`,
		animation_play_state: `<single_animation_play_state>#`,
		animation_delayed: `<time>#`,
		animation_fill_mode: `<single_animation_fill_mode>#`,

	/* https://svgwg.org/svg2-draft/interact.html#PointerEventsProperty */
		pointer_events : `visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|none|auto`,

	/* https://drafts.csswg.org/css-ui-3 */
		caret_color :"auto|<color>",
		cursor:"[[<url> [<number><number>]?,]*[auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|grab|grabbing|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out]]",
		outline:"[<outline-color>||<outline-style>||<outline-width>]",
		outline_color:"<color>|invert",
		outline_offset:"<length>",
		outline_style:"auto|<border-style>",
		outline_width:"<line-width>",
		resize:"none|both|horizontal|vertical",
		text_overflow:"clip|ellipsis",

	/* https://drafts.csswg.org/css-content-3/ */
		bookmark_label:"<content-list>",
		bookmark_level:"none|<integer>",
		bookmark_state:"open|closed",
		content:"normal|none|[<content-replacement>|<content-list>][/<string>]?",
		quotes:"none|[<string><string>]+",
		string_set:"none|[<custom-ident><string>+]#",
	
	/*https://www.w3.org/TR/CSS22/tables.html*/
		caption_side:"top|bottom",
		table_layout:"auto|fixed",
		border_collapse:"collapse|separate",
		border_spacing:"<length><length>?",
		empty_cells:"show|hide",

	/* https://www.w3.org/TR/CSS2/page.html */
		page_break_before:"auto|always|avoid|left|right",
		page_break_after:"auto|always|avoid|left|right",
		page_break_inside:"auto|avoid|left|right",
		orphans:"<integer>",
		widows:"<integer>",

	/* https://drafts.csswg.org/css-lists-3 */
		counter_increment:"[<custom-ident> <integer>?]+ | none",
		counter_reset:"[<custom-ident> <integer>?]+|none",
		counter_set:"[<custom-ident> <integer>?]+|none",
		list_style:"<list-style-type>||<list-style-position>||<list-style-image>",
		list_style_image:"<url>|none",
		list_style_position:"inside|outside",
		list_style_type:"<counter-style>|<string>|none",
		marker_side:"list-item|list-container",


	vertical_align: `baseline|sub|super|top|text-top|middle|bottom|text-bottom|<percentage>|<length>`,

	/* Visual Effects */
	clip: '<shape>|auto',
	visibility: `visible|hidden|collapse`,
	content: `normal|none|[<string>|<uri>|<counter>|attr(<identifier>)|open-quote|close-quote|no-open-quote|no-close-quote]+`,
	quotas: `[<string><string>]+|none`,
	counter_reset: `[<identifier><integer>?]+|none`,
	counter_increment: `[<identifier><integer>?]+|none`,
};

/* Properties that are not directly accessible by CSS prop creator */

const virtual_property_definitions$1 = {
    /* https://drafts.csswg.org/css-counter-styles-3 */
        /*system:`cyclic|numeric|alphabetic|symbolic|additive|[fixed<integer>?]|[extends<counter-style-name>]`,
        negative:`<symbol><symbol>?`,
        prefix:`<symbol>`,
        suffix:`<symbol>`,
        range:`[[<integer>|infinite]{2}]#|auto`,
        pad:`<integer>&&<symbol>`,
        fallback:`<counter-style-name>`
        symbols:`<symbol>+`,*/

        counter_style:`<numeric_counter_style>|<alphabetic_counter_style>|<symbolic_counter_style>|<japanese_counter_style>|<korean_counter_style>|<chinese_counter_style>|ethiopic-numeric`,
        numeric_counter_style:`decimal|decimal-leading-zero|arabic-indic|armenian|upper-armenian|lower-armenian|bengali|cambodian|khmer|cjk-decimal|devanagari|georgian|gujarati|gurmukhi|hebrew|kannada|lao|malayalam|mongolian|myanmar|oriya|persian|lower-roman|upper-roman|tamil|telugu|thai|tibetan`,
        symbolic_counter_style:`disc|circle|square|disclosure-open|disclosure-closed`,
        alphabetic_counter_style:`lower-alpha|lower-latin|upper-alpha|upper-latin|cjk-earthly-branch|cjk-heavenly-stem|lower-greek|hiragana|hiragana-iroha|katakana|katakana-iroha`,
        japanese_counter_style:`japanese-informal|japanese-formal`,
        korean_counter_style:`korean-hangul-formal|korean-hanja-informal|and korean-hanja-formal`,
        chinese_counter_style:`simp-chinese-informal|simp-chinese-formal|trad-chinese-informal|and trad-chinese-formal`,

	/* https://drafts.csswg.org/css-content-3/ */
		content_list:"[<string>|contents|<image>|<quote>|<target>|<leader()>]+",
		content_replacement:"<image>",

	/* https://drafts.csswg.org/css-values-4 */
		custom_ident:"<identifier>",
		position:"[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>][top|center|bottom|<length-percentage>]?|[[left|right]<length-percentage>]&&[[top|bottom]<length-percentage>]]",
	
	/* https://drafts.csswg.org/css-lists-3 */

	east_asian_variant_values:"[jis78|jis83|jis90|jis04|simplified|traditional]",

	alphavalue: '<number>',

	box: `border-box|padding-box|content-box`,

	/*Font-Size: www.w3.org/TR/CSS2/fonts.html#propdef-font-size */
	absolute_size: `xx-small|x-small|small|medium|large|x-large|xx-large`,
	relative_size: `larger|smaller`,

	/*https://www.w3.org/TR/css-backgrounds-3/*/

	bg_layer: `<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
	final_bg_layer: `<background_color>||<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
	bg_image: `<url>|<gradient>|none`,
	repeat_style: `repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}`,
	background_attachment: `<attachment>#`,
	bg_size: `<length_percentage>|auto]{1,2}|cover|contain`,
	bg_position: `[[left|center|right|top|bottom|<length_percentage>]|[left|center|right|<length_percentage>][top|center|bottom|<length_percentage>]|[center|[left|right]<length_percentage>?]&&[center|[top|bottom]<length_percentage>?]]`,
	attachment: `scroll|fixed|local`,
	line_style: `none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset`,
	line_width: `thin|medium|thick|<length>`,
	shadow: `inset?&&<length>{2,4}&&<color>?`,

	/* Font https://www.w3.org/TR/css-fonts-4/#family-name-value */
	
	family_name: `<fontname>`,
	generic_family: `serif|sans-serif|cursive|fantasy|monospace`,
	
	/* Identifier https://drafts.csswg.org/css-values-4/ */

	identifier: `<id>`,
	custom_ident: `<id>`,

	/* https://drafts.csswg.org/css-timing-1/#typedef-timing-function */

	timing_function: `linear|<cubic_bezier_timing_function>|<step_timing_function>|<frames_timing_function>`,
	cubic_bezier_timing_function: `<cubic_bezier>`,
	step_timing_function: `step-start|step-end|'steps()'`,
	frames_timing_function: `'frames()'`,

	/* https://drafts.csswg.org/css-transitions-1/ */

	single_animation_fill_mode: `none|forwards|backwards|both`,
	single_animation_play_state: `running|paused`,
	single_animation_direction: `normal|reverse|alternate|alternate-reverse`,
	single_animation_iteration_count: `infinite|<number>`,
	single_transition_property: `all|<custom_ident>`,
	single_transition: `[none|<single_transition_property>]||<time>||<timing_function>||<time>`,

	/* CSS3 Animation https://drafts.csswg.org/css-animations-1/ */

	single_animation: `<time>||<timing_function>||<time>||<single_animation_iteration_count>||<single_animation_direction>||<single_animation_fill_mode>||<single_animation_play_state>||[none|<keyframes_name>]`,
	keyframes_name: `<string>`,

	/* CSS3 Stuff */
	length_percentage: `<length>|<percentage>`,
	frequency_percentage: `<frequency>|<percentage>`,
	angle_percentage: `<angle>|<percentage>`,
	time_percentage: `<time>|<percentage>`,
	number_percentage: `<number>|<percentage>`,

	/*CSS Clipping https://www.w3.org/TR/css-masking-1/#clipping */
	clip_path: `<clip_source>|[<basic_shape>||<geometry_box>]|none`,
	clip_source: `<url>`,
	shape_box: `<box>|margin-box`,
	geometry_box: `<shape_box>|fill-box|stroke-box|view-box`,
	basic_shape: `<CSS_Shape>`,
	ratio: `<integer>/<integer>`,

	/* https://www.w3.org/TR/css-fonts-3/*/
	common_lig_values        : `[ common-ligatures | no-common-ligatures ]`,
	discretionary_lig_values : `[ discretionary-ligatures | no-discretionary-ligatures ]`,
	historical_lig_values    : `[ historical-ligatures | no-historical-ligatures ]`,
	contextual_alt_values    : `[ contextual | no-contextual ]`,

	//Display
	display_outside  : `block | inline | run-in`,
	display_inside   : `flow | flow-root | table | flex | grid | ruby`,
	display_listitem : `<display_outside>? && [ flow | flow-root ]? && list-item`,
	display_internal : `table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-base | ruby-text | ruby-base-container | ruby-text-container`,
	display_box      : `contents | none`,
	display_legacy   : `inline-block | inline-table | inline-flex | inline-grid`,
};

const media_feature_definitions$1 = {
	width: "<m_width>",
	min_width: "<m_max_width>",
	max_width: "<m_min_width>",
	height: "<m_height>",
	min_height: "<m_min_height>",
	max_height: "<m_max_height>",
	orientation: "portrait  | landscape",
	aspect_ratio: "<ratio>",
	min_aspect_ratio: "<ratio>",
	max_aspect_ratio: "<ratio>",
	resolution: "<length>",
	min_resolution: "<length>",
	max_resolution: "<length>",
	scan: "progressive|interlace",
	grid: "",
	monochrome: "",
	min_monochrome: "<integer>",
	max_monochrome: "<integer>",
	color: "",
	min_color: "<integer>",
	max_color: "<integer>",
	color_index: "",
	min_color_index: "<integer>",
	max_color_index: "<integer>",

};

/**
 * Used to _bind_ a rule to a CSS selector.
 * @param      {string}  selector        The raw selector string value
 * @param      {array}  selector_array  An array of selector group identifiers.
 * @memberof module:wick~internals.css
 * @alias CSSSelector
 */
class CSSSelector$1 {

    constructor(selectors /* string */ , selectors_arrays /* array */ ) {

        /**
         * The raw selector string value
         * @package
         */

        this.v = selectors;

        /**
         * Array of separated selector strings in reverse order.
         * @package
         */

        this.a = selectors_arrays;

        /**
         * The CSSRule.
         * @package
         */
        this.r = null;
    }

    get id() {
        return this.v.join("");
    }
    /**
     * Returns a string representation of the object.
     * @return     {string}  String representation of the object.
     */
    toString(off = 0) {
        let offset = ("    ").repeat(off);

        let str = `${offset}${this.v.join(", ")} {\n`;

        if (this.r)
            str += this.r.toString(off + 1);

        return str + `${offset}}\n`;
    }

    addProp(string) {
        let root = this.r.root;
        if (root) {
            let lex = whind$1(string);
            while (!lex.END)
                root.parseProperty(lex, this.r, property_definitions$1);
        }
    }

    removeRule(){
        if(this.r)
            this.r.decrementRef();

        this.r = null;
    }

    addRule(rule = null){
        
        this.removeRule();

        if(rule !== null)
            rule.incrementRef();

        this.r = rule;
    }

}

var step = 0;

function checkDefaults(lx) {
    const tx = lx.tx;
    /* https://drafts.csswg.org/css-cascade/#inherited-property */
    switch (lx.tx) {
        case "initial": //intentional
        case "inherit": //intentional
        case "unset": //intentional
        case "revert": //intentional
            if (!lx.pk.pk.END) // These values should be the only ones present. Failure otherwise.
                return 0; // Default value present among other values. Invalid
            return 1; // Default value present only. Valid
    };
    return 2; // Default value not present. Ignore
}

class JUX { /* Juxtaposition */

    constructor() {
        this.id = JUX.step++;
        this.r = [NaN, NaN];
        this.terms = [];
        this.HAS_PROP = false;
        this.name = "";
        this.virtual = false;
        this.REQUIRE_COMMA = false;
    }
    mergeValues(existing_v, new_v) {
        if (existing_v)
            if (existing_v.v) {
                if (Array.isArray(existing_v.v))
                    existing_v.v.push(new_v.v);
                else {
                    existing_v.v = [existing_v.v, new_v.v];
                }
            } else
                existing_v.v = new_v.v;
    }

    seal() {

    }

    sp(value, rule) { /* Set Property */
        if (this.HAS_PROP) {
            if (value)
                if (Array.isArray(value) && value.length === 1 && Array.isArray(value[0]))
                    rule[0] = value[0];
                else
                    rule[0] = value;
        }
    }

    isRepeating() {
        return !(isNaN(this.r[0]) && isNaN(this.r[1]));
    }

    parse(data){
        const prop_data = [];

        this.parseLVL1(data instanceof whind$1.constructor ? data : whind$1(data + ""), prop_data);

        return prop_data;
    }



    parseLVL1(lx, out_val = [], ROOT = true) {
            
        if (typeof(lx) == "string")
            lx = whind$1(lx);

        let bool = false;

        if (ROOT) {
            switch (checkDefaults(lx)) {
                case 1:
                    this.sp(lx.tx, rule);
                    return true;
                case 0:
                    return false;
            }

            bool = this.parseLVL2(lx, out_val, this.start, this.end);

            //if (!lx.END)
            //    return false;
            //else
                //this.sp(r.v, rule);
        } else
            bool = this.parseLVL2(lx, out_val, this.start, this.end);

        return bool;
    }

    checkForComma(lx) {
        if (this.REQUIRE_COMMA) {
            if (lx.ch == ",")
                lx.next();
            else return false;
        }
        return true;
    }

    parseLVL2(lx, out_val, start, end) {

        let bool = false;

        repeat:
            for (let j = 0; j < end && !lx.END; j++) {
                const copy = lx.copy();
                //let temp_r = { v: null }

                for (let i = 0, l = this.terms.length; i < l; i++) {

                    let term = this.terms[i];

                    if (!term.parseLVL1(copy, out_val, false)) {
                        if (!term.OPTIONAL) {
                            break repeat;
                        }
                    }
                }

                //if (temp_r.v)
                //    this.mergeValues(r, temp_r)

                lx.sync(copy);

                bool = true;

                if (!this.checkForComma(lx))
                    break;
            }

        if (bool)
            //console.log("JUX", s, bool)
            return bool;
    }

    get start() {
        return isNaN(this.r[0]) ? 1 : this.r[0];
    }
    set start(e) {}

    get end() {
        return isNaN(this.r[1]) ? 1 : this.r[1];
    }
    set end(e) {}

    get OPTIONAL() { return this.r[0] === 0 }
    set OPTIONAL(a) {}
}
JUX.step = 0;
class AND$1 extends JUX {
    parseLVL2(lx, out_val, start, end) {

        const
            PROTO = new Array(this.terms.length),
            l = this.terms.length;

        let bool = false;

        repeat:
            for (let j = 0; j < end && !lx.END; j++) {

                const
                    HIT = PROTO.fill(0),
                    copy = lx.copy();
                    //temp_r = [];

                and:
                    while (true) {
                        let FAILED = false;



                        for (let i = 0; i < l; i++) {

                            if (HIT[i] === 2) continue;

                            let term = this.terms[i];

                            if (!term.parseLVL1(copy, out_val, false)) {
                                if (term.OPTIONAL)
                                    HIT[i] = 1;
                            } else {
                                HIT[i] = 2;
                                continue and;
                            }
                        }

                        if (HIT.reduce((a, v) => a * v, 1) === 0)
                            break repeat;

                        break
                    }



                lx.sync(copy);

                // if (temp_r.length > 0)
                //     r.push(...temp);

                bool = true;

                if (!this.checkForComma(lx))
                    break;
            }

        return bool;
    }
}

class OR$1 extends JUX {
    parseLVL2(lx, out_val, start, end) {

        const
            PROTO = new Array(this.terms.length),
            l = this.terms.length;

        let
            bool = false,
            NO_HIT = true;

        repeat:
            for (let j = 0; j < end && !lx.END; j++) {

                const HIT = PROTO.fill(0);
                let copy = lx.copy();
                let temp_r = { v: null };

                or:
                    while (true) {
                        let FAILED = false;
                        for (let i = 0; i < l; i++) {

                            if (HIT[i] === 2) continue;

                            let term = this.terms[i];

                            if (term.parseLVL1(copy, out_val, false)) {
                                NO_HIT = false;
                                HIT[i] = 2;
                                continue or;
                            }
                        }

                        if (NO_HIT) break repeat;

                        break;
                    }

                lx.sync(copy);

                //if (temp_r.v)
                //    this.mergeValues(r, temp_r)

                bool = true;

                if (!this.checkForComma(lx))
                    break;
            }

        return bool;
    }
}

OR$1.step = 0;

class ONE_OF$1 extends JUX {
    parseLVL2(lx, out_val, start, end) {

        let BOOL = false;

        for (let j = 0; j < end && !lx.END; j++) {

            const 
                copy = lx.copy(),
                temp_r = [];
            
            let bool = false;

            for (let i = 0, l = this.terms.length; i < l; i++) {
                if (this.terms[i].parseLVL1(copy, out_val, false)) {
                    bool = true;
                    break;
                }
            }

            if (!bool)
                break;

            lx.sync(copy);
            
            //if (temp_r.v)
            //    this.mergeValues(r, temp_r)

            BOOL = true;

            if (!this.checkForComma(lx))
                break;
        }

        return BOOL;
    }
}

ONE_OF$1.step = 0;

class LiteralTerm$1{

    constructor(value, type) {
        
        if(type == whind$1.types.string)
            value = value.slice(1,-1);

        this.value = value;
        this.HAS_PROP = false;
    }

    seal(){}

    parse(data){
        const prop_data = [];

        this.parseLVL1(data instanceof whind$1.constructor ? data : whind$1(data + ""), prop_data);

        return prop_data;
    }

    parseLVL1(l, r, root = true) {

        if (typeof(l) == "string")
            l = whind$1(l);

        if (root) {
            switch(checkDefaults(l)){
                case 1:
                rule.push(l.tx);
                return true;
                case 0:
                return false;
            }
        }

        let v = l.tx;
        
        if (v == this.value) {
            l.next();
            r.push(v);
            //if (this.HAS_PROP  && !this.virtual && root)
            //    rule[0] = v;

            return true;
        }
        return false;
    }

    get OPTIONAL (){ return false }
    set OPTIONAL (a){}
}

class ValueTerm$1 extends LiteralTerm$1{

    constructor(value, getPropertyParser, definitions, productions) {
        
        super(value);

        if(value instanceof JUX)
            return value;

        this.value = null;

        const IS_VIRTUAL = { is: false };
        
        if(typeof(value) == "string")
            var u_value = value.replace(/\-/g,"_");

        if (!(this.value = types$2[u_value]))
            this.value = getPropertyParser(u_value, IS_VIRTUAL, definitions, productions);

        if (!this.value)
            return new LiteralTerm$1(value);

        if(this.value instanceof JUX){

            if (IS_VIRTUAL.is)
                this.value.virtual = true;

            return this.value;
        }
    }

    parseLVL1(l, r, ROOT = true) {
        if (typeof(l) == "string")
            l = whind$1(l);

        if (ROOT) {
            switch(checkDefaults(l)){
                case 1:
                r.push(l.tx);
                return true;
                case 0:
                return false;
            }
        }

        //const rn = [];

        const v = this.value.parse(l);

        /*if (rn.length > 0) {
            
           // r.push(...rn);

            // if (this.HAS_PROP && !this.virtual)
            //     rule[0] = rn.v;

            return true;

        } else */if (v) {

            r.push(v);

            //if (this.HAS_PROP && !this.virtual && ROOT)
            //    rule[0] = v;

            return true;
        } else
            return false;
    }
}



class SymbolTerm$1 extends LiteralTerm$1 {
    parseLVL1(l, rule, r) {
        if (typeof(l) == "string")
            l = whind$1(l);

        if (l.tx == this.value) {
            l.next();
            return true;
        }

        return false;
    }
};

//import util from "util"
const standard_productions = {
    JUX,
    AND: AND$1,
    OR: OR$1,
    ONE_OF: ONE_OF$1,
    LiteralTerm: LiteralTerm$1,
    ValueTerm: ValueTerm$1,
    SymbolTerm: SymbolTerm$1
};

function getPropertyParser$1(property_name, IS_VIRTUAL = { is: false }, definitions = null, productions = standard_productions) {

    let parser_val = definitions[property_name];

    if (parser_val) {

        if (typeof(parser_val) == "string") {
            parser_val = definitions[property_name] = CreatePropertyParser$1(parser_val, property_name, definitions, productions);
        }
        parser_val.name = property_name;
        return parser_val;
    }

    if (!definitions.__virtual)
        definitions.__virtual = Object.assign({}, virtual_property_definitions$1);

    parser_val = definitions.__virtual[property_name];

    if (parser_val) {

        IS_VIRTUAL.is = true;

        if (typeof(parser_val) == "string") {
            parser_val = definitions.__virtual[property_name] = CreatePropertyParser$1(parser_val, "", definitions, productions);
            parser_val.virtual = true;
            parser_val.name = property_name;
        }

        return parser_val;
    }

    return null;
}


function CreatePropertyParser$1(notation, name, definitions, productions) {

    const l = whind$1(notation);
    const important = { is: false };

    let n = d$4(l, definitions, productions);
    
    n.seal();

    //if (n instanceof productions.JUX && n.terms.length == 1 && n.r[1] < 2)
    //    n = n.terms[0];

    n.HAS_PROP = true;
    n.IMP = important.is;

    /*//******** DEV 
    console.log("")
    console.log("")
    console.log(util.inspect(n, { showHidden: false, depth: null })) 
    //********** END Dev*/

    return n;
}

function d$4(l, definitions, productions, super_term = false, oneof_group = false, or_group = false, and_group = false, important = null) {
    let term, nt, v;
    const { JUX, AND, OR, ONE_OF, LiteralTerm, ValueTerm, SymbolTerm } = productions;

    let GROUP_BREAK = false;

    while (!l.END) {

        switch (l.ch) {
            case "]":
                return term;
                break;
            case "[":

                v = d$4(l.next(), definitions, productions, true);
                l.assert("]");
                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX && term.isRepeating()) term = foldIntoProduction(productions, new JUX, term);
                    term = foldIntoProduction(productions, term, v);
                } else
                    term = v;
                break;

            case "<":

                v = new ValueTerm(l.next().tx, getPropertyParser$1, definitions, productions);
                l.next().assert(">");

                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX /*&& term.isRepeating()*/) term = foldIntoProduction(productions, new JUX, term);
                    term = foldIntoProduction(productions, term, v);
                } else {
                    term = v;
                }
                break;

            case "&":

                if (l.pk.ch == "&") {

                    if (and_group)
                        return term;

                    nt = new AND();

                    if (!term) throw new Error("missing term!");

                    nt.terms.push(term);

                    l.sync().next();

                    while (!l.END) {
                        nt.terms.push(d$4(l, definitions, productions, super_term, oneof_group, or_group, true, important));
                        if (l.ch !== "&" || l.pk.ch !== "&") break;
                        l.a("&").a("&");
                    }

                    return nt;
                }
                break;
            case "|":

                {
                    if (l.pk.ch == "|") {

                        if (or_group || and_group)
                            return term;

                        nt = new OR();

                        nt.terms.push(term);

                        l.sync().next();

                        while (!l.END) {
                            nt.terms.push(d$4(l, definitions, productions, super_term, oneof_group, true, and_group, important));
                            if (l.ch !== "|" || l.pk.ch !== "|") break;
                            l.a("|").a("|");
                        }

                        return nt;

                    } else {

                        if (oneof_group || or_group || and_group)
                            return term;

                        nt = new ONE_OF();

                        nt.terms.push(term);

                        l.next();

                        while (!l.END) {
                            nt.terms.push(d$4(l, definitions, productions, super_term, true, or_group, and_group, important));
                            if (l.ch !== "|") break;
                            l.a("|");
                        }

                        return nt;
                    }
                }
                break;
            default:

                v = (l.ty == l.types.symbol) ? new SymbolTerm(l.tx) : new LiteralTerm(l.tx, l.ty);
                l.next();
                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX /*&& (term.isRepeating() || term instanceof ONE_OF)*/) term = foldIntoProduction(productions, new JUX, term);
                    term = foldIntoProduction(productions, term, v);
                } else {
                    term = v;
                }
        }
    }

    return term;
}

function checkExtensions(l, term, productions) {
    outer:
    while (true) {

        switch (l.ch) {
            case "!":
                /* https://www.w3.org/TR/CSS21/cascade.html#important-rules */
                term.IMPORTANT = true;
                l.next();
                continue outer;
            case "{":
                term = foldIntoProduction(productions, term);
                term.r[0] = parseInt(l.next().tx);
                if (l.next().ch == ",") {
                    l.next();
                    if (l.pk.ch == "}") {

                        term.r[1] = parseInt(l.tx);
                        l.next();
                    } else {
                        term.r[1] = Infinity;
                    }
                } else
                    term.r[1] = term.r[0];
                l.a("}");
                break;
            case "*":
                term = foldIntoProduction(productions, term);
                term.r[0] = 0;
                term.r[1] = Infinity;
                l.next();
                break;
            case "+":
                term = foldIntoProduction(productions, term);
                term.r[0] = 1;
                term.r[1] = Infinity;
                l.next();
                break;
            case "?":
                term = foldIntoProduction(productions, term);
                term.r[0] = 0;
                term.r[1] = 1;
                l.next();
                break;
            case "#":
                term = foldIntoProduction(productions, term);
                term.terms.push(new SymbolTerm$1(","));
                term.r[0] = 1;
                term.r[1] = Infinity;
                term.REQUIRE_COMMA = true;
                l.next();
                if (l.ch == "{") {
                    term.r[0] = parseInt(l.next().tx);
                    term.r[1] = parseInt(l.next().a(",").tx);
                    l.next().a("}");
                }
                break;
        }
        break;
    }
    return term;
}

function foldIntoProduction(productions, term, new_term = null) {
    if (term) {
        if (!(term instanceof productions.JUX)) {
            let nr = new productions.JUX();
            nr.terms.push(term);
            term = nr;
        }
        if (new_term) {
            term.seal();
            term.terms.push(new_term);
        }
        return term;
    }
    return new_term;
}

class compoundSelector {
    constructor(sym, env) {
        this.subclass = null;
        this.tag = null;
        this.pseudo = null;

        if (sym[0].type == "type")
            this.tag = sym.shift();

        if (sym[0] && sym[0][0] && sym[0][0].type !== "pseudoElement")
            this.subclass = sym.shift();

        this.pseudo = sym[0];
    }

    get type() {
        return "basic"
    }

    match(element) {
        if (this.tag) {
            if (!this.tag.match(element))
                return null;
        }

        if (this.subclass) {
            for (const sel of this.subclass) {
                if (!sel.match(element))
                    return null;
            }
        }

        if (this.pseudo) {
            if (!this.subclass.match(element))
                return null;
        }

        return element;
    }

    matchBU(element, selector_array, selector = null, index = 0) {
        if (index + 1 < selector_array.length) {
            return selector_array[index + 1].matchBU(element, selector_array, this, index + 1);
        } else {
            return this.match(element);
        }
    }
}

class comboSelector {
    constructor(sym, env) {
        if (sym.length > 1) {
            this.op = sym[0];
            this.selector = sym[1];
        } else {
            this.op = "";
            this.selector = sym[0];
        }

    }

    get type() {
        return "basic"
    }

    matchBU(element, selector_array, selector = null, index = 0) {
        let ele;
        if (index < selector_array.length) {
            if ((ele = this.selector.matchBU(element, selector_array, null, index))) {
                switch (this.op) {
                    case ">":
                        return selector.match(ele.parentElement);
                    case "+":
                        return selector.match(ele.previousElementSibling);
                    case "~":
                        let children = ele.parentElement.children.slice(0, element.index);

                        for (const child of children) {
                            if (selector.match(child))
                                return child;
                        }
                        return null;
                    default:
                        ele = ele.parentElement;
                        while (ele) {
                            if (selector.match(ele))
                                return ele;
                            ele = ele.parentElement;
                        }
                }
            }
        }

        return null;
    }

    toString() {

    }
}

class selector{
	constructor(sym,env){
		if(sym.len > 1)
			this.namespace = sym[0];
		this.val = ((sym.len > 1) ? sym[2] : sym[0]).toLowerCase();
	}

	get type(){
		return "type"
	}

	match(element, result){
		return element.tagName.toLowerCase() == this.val;
	}

	toString(){

	}
}

class idSelector{
	constructor(sym,env){
		this.val = sym[1];
	}

	get type(){
		return "id"
	}

	match(element){
		return element.id == this.val;
	}

	toString(){

	}
}

class classSelector{
	constructor(sym,env){
		this.val = sym[1];
	}

	get type(){
		return "class"
	}

	match(element, result){
		return element.classList.contains(this.val);
	}

	toString(){

	}
}

class attribSelector{
	constructor(sym,env){
		this.key = sym[1];
		this.val = "";
		this.op = "";
		this.mod = "";

		if(sym.length > 3){
			this.val = sym[3];
			this.op = sym[2];
			this.mod = sym.length > 5 ? sym[4] : "";
		}

	}

	get type(){
		return "attrib"
	}

	match(element, result){
		
		let attr = element.getAttribute(this.key);

		if(!attr)
			return false
		if(this.val && attr !== this.val)
			return false;
		
		return true;
	}

	toString(){

	}
}

class pseudoClassSelector{
	constructor(sym,env){
		this.val = sym[1];
	}

	get type(){
		return "pseudoClass"
	}

	match(element){
		return true;
	}

	toString(){

	}
}

class pseudoElementSelector{
	constructor(sym,env){
		this.val = sym[1].val;
	}

	get type(){
		return "pseudoElement"
	}

	match(element){
		return true;
	}

	toString(){

	}
}

function parseProperty(lexer, rule, definitions) {
    const name = lexer.tx.replace(/\-/g, "_");

    //Catch any comments
    if (lexer.ch == "/") {
        lexer.comment(true);
        let bool = parseProperty(lexer, rule, definitions);
        return
    }
    lexer.next().a(":");
    //allow for short circuit < | > | =
    const p = lexer.pk;
    while ((p.ch !== "}" && p.ch !== ";") && !p.END) {
        //look for end of property;
        p.next();
    }
    const out_lex = lexer.copy();
    lexer.sync();
    out_lex.fence(p);
    if (!false /*this._getPropertyHook_(out_lex, name, rule)*/ ) {
        try {
            const IS_VIRTUAL = {
                is: false
            };
            const parser = getPropertyParser$1(name, IS_VIRTUAL, definitions);
            if (parser && !IS_VIRTUAL.is) {
                if (!rule.props) rule.props = {};
                parser.parse(out_lex, rule.props);
            } else
                //Need to know what properties have not been defined
                console.warn(`Unable to get parser for css property ${name}`);
        } catch (e) {
            console.log(e);
        }
    }
    if (lexer.ch == ";") lexer.next();
}


function parseDeclaration(sym, env, lex) {
    let rule_name = sym[0];
    let body_data = sym[2];
    let important = sym[3] ? true : false;

    const IS_VIRTUAL = { is: false };
    const parser = getPropertyParser$1(rule_name.replace(/\-/g, "_"), IS_VIRTUAL, property_definitions$1);

    if (parser && !IS_VIRTUAL.is) {

        const prop = parser.parse(whind$1(body_data));

        if (prop.length > 0)
            return { name: rule_name, val: prop, original: body_data };

    } else
        //Need to know what properties have not been defined
        console.warn(`Unable to get parser for css property ${rule_name}`);

    return { name: rule_name, val: null, original: body_data };
}

const env$2 = {
    functions: {
        compoundSelector,
        comboSelector,
        selector,
        idSelector,
        classSelector,
        attribSelector,
        pseudoClassSelector,
        pseudoElementSelector,
        parseDeclaration

    },
    body: null
};

function parse$1(string_data) {
    try {
        const nodes = parser$2(whind$1(string_data), env$2);

        for (const node of nodes) {

            let selectors = node.selectors;


            selectors.forEach(sel_array => {

                let element = document.getElementById("test"),
                    match = { match: true };

                if (sel_array[0].matchBU(element, sel_array) !== null) {
                    element.style.backgroundColor = "red";
                } else {
                    element.style.backgroundColor = "blue";
                }
            });
        }
        console.log(nodes);
    } catch (e) {
        console.error(e);
    }
}

function create_ordered_list(sym, offset = 0, level = -1, env, lex) {

    for (let i = offset; i < sym.length; i++) {
        const s = sym[i],
            lvl = (s.lvl) ? s.lvl.length : 0,
            li = s.li;
            console.log(s.lvl);

        if (lvl > level) {
            create_ordered_list(sym, i, lvl, env, lex);
        } else if (lvl < level) {
            sym[offset] = es("ul", null, sym.splice(offset, i - offset), env, lex);
            return;
        } else
            sym[i] = li;
    }

    return sym[offset] = es("span", null, sym.splice(offset, sym.length - offset), env, lex);
}

const env$3 = {
    table: {},
    ASI: true,
    functions: {
        //HTML
        element_selector: es,
        attribute: Attribute,
        wick_binding: Binding,
        text: TextNode,

        //CSS
        compoundSelector,
        comboSelector,
        selector,
        idSelector,
        classSelector,
        attribSelector,
        pseudoClassSelector,
        pseudoElementSelector,
        parseDeclaration,

        //JS
        add_expression,
        and_expression,
        array_literal,
        arrow_function_declaration,
        assignment_expression,
        await_expression,
        binding,
        block_statement,
        bool_literal,
        call_expression,
        catch_statement,
        condition_expression,
        debugger_statement,
        delete_expression,
        divide_expression,
        equality_expression,
        exponent_expression: equality_expression$1,
        expression_list,
        expression_statement,
        for_statement,
        function_declaration,
        identifier: identifier$1,
        if_statement,
        in_expression,
        instanceof_expression,
        left_shift_expression,
        lexical: lexical_declaration,
        member_expression,
        modulo_expression,
        multiply_expression,
        negate_expression,
        new_expression,
        null_literal,
        numeric_literal,
        object_literal,
        or_expression,
        plus_expression,
        post_decrement_expression,
        post_increment_expression,
        pre_decrement_expression,
        pre_increment_expression,
        property_binding,
        right_shift_expression,
        right_shift_fill_expression,
        return_statement,
        spread_element,
        statements,
        string_literal: string$2,
        string: string$2,
        subtract_expression,
        this_literal,
        try_statement,
        typeof_expression,
        unary_not_expression,
        unary_or_expression,
        unary_xor_expression,
        void_expression,
        argument_list,
        arrow: arrow_function_declaration,

        //MARKDOWN
        create_ordered_list,

        while_stmt: function(sym) {
            this.bool = sym[1];
            this.body = sym[3];
        },
        var_stmt: function(sym) { this.declarations = sym[1]; },

        label_stmt: function(sym) {
            this.label = sym[0];
            this.stmt = sym[1];
        },

        defaultError: (tk, env, output, lex, prv_lex, ss, lu) => {
            /*USED for ASI*/

            if (env.ASI && lex.tx !== ")" && !lex.END) {

                if (lex.tx == "</") // As in "<script> script body => (</)script>"
                    return lu.get(";");

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_END_CHAR = true;
                }

                if (ENCOUNTERED_END_CHAR)
                    return lu.get(";");
            }

            if (lex.END)
                return lu.get(";");
        }
    },

    prst: [],
    pushPresets(prst) {
        env$3.prst.push(prst);
    },
    popPresets() {
        return env$3.prst.pop();
    },
    get presets() {
        return env$3.prst[env$3.prst.length - 1] || null;
    },

    options: {
        integrate: false,
        onstart: () => {
            env$3.table = {};
            env$3.ASI = true;
        }
    }
};

const

    default_presets = new Presets,

    // If compilation fails, failure component is generated that provides 
    // error information. Should be fancy though.

    compileAST = async (component_data, presets) => {
            var
                ast = null,
                string_data = "";

            switch (typeof component_data) {

                case "string":
                    /* Need to determine if string is:
                           URL to component resource
                           HTML data
                           JS data
                           or incompatible data that should throw.
                    */

                    string_data = component_data;

                    var url;

                    if ((url = URL.resolveRelative(component_data, ""))){
                        try{
                            string_data = await url.fetchText();
                        }catch(e){
                            console.log(e);
                        }
                    }

                    break;

                case "object":
                    if (component_data instanceof URL) {

                    } else if (component_data instanceof HTMLElement) {

                        if (component_data.tagName == "TEMPLATE")
                            if (component_data.tagName == "TEMPLATE") {
                                const temp = document.createElement("div");
                                temp.appendChild(component_data.content);
                                component_data = temp;
                            }

                        string_data = component_data.innerHTML;
                    }
                    // Extract properties from the object that relate to wick component attributes. 
                    break;
            }

            try {

                return await (new Promise(res => {
                    const compiler_env = new CompilerEnvironment(presets, env$3);
                    compiler_env.pending++;


                    compiler_env.pendingResolvedFunction = () => { res(ast); };

                    ast = parser(whind$1(string_data), compiler_env);

                    compiler_env.resolve();
                }));

            } catch (err) {
                console.error(err);
            }

            return ast;
        },


        // This is a variadic function that accepts objects, string, and urls, 
        //  and compiles data from the argument sources into a wick component. 
        Component = function(...data) {
            // The presets object provides global values to this component
            // and all its derivatives and descendents. 
            let presets = default_presets;

            if (data.length > 1)
                presets = new Presets(data[1]);

            if (data.length === 0)
                throw new Error("This function requires arguments. Please Refere to wick docs on what arguments may be passed to this function.");

            const component_data = data[0];

            // If this function is an operand of the new operator, run an alternative 
            // compiler on the calling object.
            if (new.target) {

                this.ast = null;

                this.READY = false;

                this.presets = data[1] || default_presets;

                //Reference to the component name. Used with the Web Component API
                this.name = "";
                
                this.pending = new Promise(res => {
                    compileAST(component_data, presets).then(ast => {

                        if (this.constructor.prototype !== Component.prototype) {
                                                
                            //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                            for(const a of Object.getOwnPropertyNames(this.constructor.prototype)){
                                if(a == "constructor") continue;

                                const r = this.constructor.prototype[a];

                                if(typeof r == "function"){

                                    //extract and process function information. 
                                    let c_env = new CompilerEnvironment(presets, env$3);
                                    
                                    let js_ast = parser(whind$1("function " + r.toString().trim()+";"), c_env);

                                    let func_ast = JS.getFirst(js_ast, types.function_declaration);
                                    let ids = JS.getClosureVariableNames(func_ast);
                                    let args = JS.getFunctionDeclarationArgumentNames(js_ast); // Function arguments in wick class component definitions are treated as TAP variables. 
                                    const HAS_CLOSURE = (ids.filter(a=>!args.includes(a))).length > 0;

                                    const binding = new Binding([null, func_ast.id], {presets, start:0}, whind$1("ddddd"));
                                    const attrib = new Attribute(["on", null, binding], presets);
                                    const stmt = func_ast.body;
                            
                                    let script = new scr({}, null, stmt, [attrib], presets);

                                    script.finalize();

                                    ast.children.push(script);

                                    //Create and attach a script IO to the HTML ast. 


                                    //Checking for variable leaks. 
                                    //if all closure variables match all argument variables, then the function is self contained and can be completely enclosed by the 
                                }
                            }
                        }

                        this.READY = true;
                        this.ast = ast;
                        this.ast.finalize();

                        if (!this.name)
                            this.name = this.ast.getAttrib("component").value || "undefined-component";

                        if(this.__pending){
                            this.__pending.forEach(e=>e[2](this.mount(...e.slice(0,2))));
                            this.__pending = null;
                        }

                        return res(this)
                    });
                });
            } else {
                const comp = new Component(...data);

                return comp;
            }
        };

Component.prototype = d$3.prototype;

//TODO: Fancy schmancy to string method.
Component.toString = function() {
    return "WICK 2019";
};

/**
 *   This is used by Model to create custom property getter and setters on non-ModelContainerBase and non-Model properties of the Model constructor.
 *   @protected
 *   @memberof module:wick~internals.model
 */
function CreateSchemedProperty(object, scheme, schema_name, index) {
    if (object[schema_name])
        return;

    Object.defineProperty(object, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {
            return this.getHook(schema_name, this.prop_array[index]);
        },
        set: function(value) {

            let result = { valid: false };

            let val = scheme.parse(value);

            scheme.verify(val, result);

            if (result.valid && this.prop_array[index] != val) {
                this.prop_array[index] = this.setHook(schema_name, val);
                this.scheduleUpdate(schema_name);
                this._changed_ = true;
            }
        }
    });
}

/**
    This is used by Model to create custom property getter and setters on Model properties of the Model constructor.
    @protected
    @memberof module:wick~internals.model
*/
function CreateModelProperty(object, model, schema_name, index) {

    Object.defineProperty(object, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {

            let m = this.prop_array[index];

            if (!m) {
                let address = this.address.slice();
                address.push(index);
                m = new model(null, this.root, address);
                m.par = this;
                m.prop_name = schema_name;
                m.MUTATION_ID = this.MUTATION_ID;
                this.prop_array[index] = m;
            }

            return this.getHook(schema_name, m);
        }
    });
}

class SchemedModel extends ModelBase {

    constructor(data, root = null, address = [], _schema_ = null) {

        super(root, address);

        if (this.constructor === SchemedModel)
            this.constructor = (class extends SchemedModel {});

        if (!this.schema) {

            let schema = this.constructor.schema || _schema_;

            this.constructor.schema = schema;

            if (schema) {

                let __FinalConstructor__ = schema.__FinalConstructor__;

                let constructor = this.constructor;
                let prototype = constructor.prototype;

                if (!__FinalConstructor__) {
                    let count = 0;
                    let look_up = {};

                    for (let schema_name in schema) {
                        let scheme = schema[schema_name];

                        if (schema_name == "self" && Array.isArray(scheme)) 
                            return new SchemedContainer(schema, root, address);
                        

                        if (schema_name == "getHook") {
                            prototype.getHook = scheme;
                            continue;
                        }

                        if (schema_name == "setHook") {
                            prototype.setHook = scheme;
                            continue;
                        }

                        if (schema_name == "proto") {
                            for (let name in schema.proto)
                                _SealedProperty_(prototype, name, schema.proto[name]);
                            continue;
                        }

                        if (typeof(scheme) == "function") {
                            CreateModelProperty(prototype, scheme, schema_name, count);
                        } else if (typeof(scheme) == "object") {
                            if (Array.isArray(scheme)) {
                                if (scheme[0] && scheme[0].container && scheme[0].schema)
                                    CreateModelProperty(prototype, scheme[0], schema_name, count);
                                else if (scheme[0] instanceof ModelContainerBase)
                                    CreateModelProperty(prototype, scheme[0].constructor, schema_name, count);
                                else
                                    CreateModelProperty(prototype, Model, schema_name, count);
                            } else if (scheme instanceof SchemeConstructor)
                                CreateSchemedProperty(prototype, scheme, schema_name, count);
                            else {
                                CreateModelProperty(prototype, scheme.constructor, schema_name, count);
                            }
                        } else {
                            console.warn(`Could not create property ${schema_name}.`);

                            continue;
                        }

                        look_up[schema_name] = count;
                        count++;
                    }

                    _SealedProperty_(prototype, "prop_offset", count);
                    _SealedProperty_(prototype, "look_up", look_up);
                    _SealedProperty_(prototype, "changed", false);

                    Object.seal(constructor);

                    schema.__FinalConstructor__ = constructor;
                    //_FrozenProperty_(schema, "__FinalConstructor__", constructor);

                    //Start the process over with a newly minted Model that has the properties defined in the Schema
                    return new schema.__FinalConstructor__(data, root, address);
                }

                _FrozenProperty_(prototype, "schema", schema);
            } else
                return new Model(data, root, address);
        }

        Object.defineProperty(this, "prop_array", { value: new Array(this.prop_offset), enumerable: false, configurable: false, writable: true });

        if (data)
            this.set(data, true);
    }

    destroy() { this.root = null; }

    set(data, FROM_ROOT = false) {

        if (!FROM_ROOT)
            return this._deferUpdateToRoot_(data).set(data, true);

        if (!data)
            return false;

        this._changed_ = false;

        for (let prop_name in data) {

            let data_prop = data[prop_name];

            let index = this.look_up[prop_name];

            if (index !== undefined) {

                let prop = this[prop_name];

                if (typeof(prop) == "object") {

                    if (prop.MUTATION_ID !== this.MUTATION_ID) {
                        prop = prop.clone();
                        prop.MUTATION_ID = this.MUTATION_ID;
                        this.prop_array[index] = prop;
                    }

                    if (prop.set(data_prop, true))
                        this.scheduleUpdate(prop_name);

                } else {
                    this[prop_name] = data_prop;
                }
            }
        }

        return this._changed_;
    }

    createProp() {}
}
SchemedModel.prototype.toJSON = Model.prototype.toJSON;

class SchemedContainer extends ArrayModelContainer {
    
    constructor(schema, root, address) {

        super(schema.self, root, address);

        if (schema.proto)
            for (let name in schema.proto)
                _SealedProperty_(this, name, schema.proto[name]);
    }
}

const wick = Component;

const model = (data, schema) => new SchemedModel(data, undefined, undefined, schema);
model.scheme = Object.assign((s, scheme) => (scheme = class extends SchemedModel {}, scheme.schema = s, scheme), schemes);
model.constr = SchemedModel;
model.any = (data) => new Model(data);
model.any.constr = Model;
model.container = {
    multi: MultiIndexedContainer,
    array: ArrayModelContainer,
    btree: BTreeModelContainer,
    constr: ModelContainerBase
};
model.store = (data) => new Store(data);
wick.scheme = model.scheme;
wick.model = model;

wick.astCompiler = function(string){
	return parser(whind$1(string), CompilerEnvironment);
};

exports.default = wick;
