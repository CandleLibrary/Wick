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
const r = 114;
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
    identifier$1 = 2,
    string = 4,
    white_space = 8,
    open_bracket = 16,
    close_bracket = 32,
    operator = 64,
    symbol = 128,
    new_line = 256,
    data_link = 512,
    alpha_numeric = (identifier$1 | number),
    white_space_new_line = (white_space | new_line),
    Types = {
        num: number,
        number,
        id: identifier$1,
        identifier: identifier$1,
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
                            type = identifier$1;
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

        if(Presets.global.v)
            return Presets.global.v;

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
    symbols = ["((","))",")()","||","^=","$=","*=","<=",")","{","}","(","[","]",".","...",";",",","<",">",">=","==","!=","===","!==","+","-","*","%","/","**","++","--","<<",">>",">>>","&","|","^","!","~","&&","?",":","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>","</",")(","\"","'"],

    /* Goto lookup maps */
    gt0 = [0,-1,1,-3,4,124,128,125,123,131,129,-2,130,-5,126,-1,154,-5,155,-10,153,-42,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152,-10,2,5,-18,6,7,8,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,3,109,113,108,111,110,-10,79],
gt1 = [0,-136,157,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt2 = [0,-14,165,-5,168,-1,154,-5,155,-10,153,-63,166,164,-2,162,-1,167,-25,161,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt3 = [0,-224,172],
gt4 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,212,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt5 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,223,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt6 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,224,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt7 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,225,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt8 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,226,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt9 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,227,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt10 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,228,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt11 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,229,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt12 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,230,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt13 = [0,-208,232],
gt14 = [0,-208,237],
gt15 = [0,-174,66,221,-14,67,222,-9,238,239,61,62,85,-4,60,216,-7,215,-20,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt16 = [0,-279,244,243,242,245],
gt17 = [0,-279,244,243,249,245],
gt18 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,251,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt19 = [0,-208,256],
gt20 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-17,257,213,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt21 = [0,-160,259],
gt22 = [0,-168,261,262,-71,264,266,267,-15,263,265,70],
gt23 = [0,-137,271,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt24 = [0,-257,277,-2,278,70],
gt25 = [0,-257,280,-2,278,70],
gt26 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,282,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt27 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,284,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt28 = [0,-142,285],
gt29 = [0,-264,288,287,111,110],
gt30 = [0,-267,289],
gt31 = [0,-268,292,-5,291,-1,295,316],
gt32 = [0,-192,322,323,-65,321,265,70],
gt33 = [0,-259,327,265,70],
gt34 = [0,-172,328,329,-67,331,266,267,-15,330,265,70],
gt35 = [0,-7,128,332,-1,131,129,-2,130,-5,333,-1,154,-5,155,-10,153,-42,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt36 = [0,-7,336,-2,131,129,-2,130,-5,168,-1,154,-5,155,-10,153,-42,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt37 = [0,-80,345,344,-1,135,-1,151,136,347,346,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt38 = [0,-83,352,-1,151,353,-6,142,143,144,-1,145,-3,146,152],
gt39 = [0,-85,151,354,-6,355,143,144,-1,145,-3,146,152],
gt40 = [0,-85,356,-16,152],
gt41 = [0,-90,140,364,363],
gt42 = [0,-101,367],
gt43 = [0,-84,369,-16,370],
gt44 = [0,-135,161,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt45 = [0,-14,377,-5,168,-1,154,-5,155,-10,153,-65,379,378,-2,380],
gt46 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,384,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt47 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,385,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt48 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,386,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt49 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,387,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt50 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-7,388,35,36,37,38,39,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt51 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-8,389,36,37,38,39,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt52 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-9,390,37,38,39,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt53 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-10,391,38,39,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt54 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-11,392,39,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt55 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-12,393,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt56 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-12,394,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt57 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-12,395,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt58 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-12,396,40,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt59 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,397,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt60 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,398,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt61 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,399,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt62 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,400,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt63 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,401,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt64 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-13,402,41,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt65 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-14,403,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt66 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-14,404,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt67 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-14,405,42,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt68 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-15,406,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt69 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-15,407,43,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt70 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-16,408,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt71 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-16,409,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt72 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-16,410,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt73 = [0,-174,66,221,-13,87,67,222,-8,214,56,58,61,62,85,57,86,-2,60,216,-7,215,-16,411,44,45,53,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt74 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,414,413,417,416,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt75 = [0,-197,424,-14,420,421,426,430,431,422,-35,432,433,-3,423,-1,218,427,-16,79],
gt76 = [0,-261,435],
gt77 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,436,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt78 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-1,438,60,216,-7,215,-3,439,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt79 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,441,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt80 = [0,-261,442],
gt81 = [0,-208,443],
gt82 = [0,-279,446,-2,245],
gt83 = [0,-241,451,266,267,-15,450,265,70],
gt84 = [0,-261,452],
gt85 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,453,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt86 = [0,-174,66,221,-7,31,89,454,-3,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,-8,215,-3,455,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt87 = [0,-137,458,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-1,457,24,-3,25,15,-6,66,459,-7,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt88 = [0,-218,462],
gt89 = [0,-218,464],
gt90 = [0,-214,471,430,431,-27,466,467,-2,469,-1,470,-2,432,433,-4,472,265,427,-16,79],
gt91 = [0,-221,474,-19,481,266,267,-2,476,478,-1,479,480,475,-7,472,265,70],
gt92 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,482,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt93 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,484,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt94 = [0,-147,490,-22,488,491,-2,66,221,-7,31,89,-4,87,67,222,-7,485,489,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt95 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,493,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt96 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,497,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt97 = [0,-163,499,500],
gt98 = [0,-268,292,-5,291],
gt99 = [0,-270,504,505,506],
gt100 = [0,-270,510,505,506],
gt101 = [0,-270,511,505,506],
gt102 = [0,-270,512,505,506],
gt103 = [0,-277,514],
gt104 = [0,-270,516,505,506],
gt105 = [0,-192,517,323],
gt106 = [0,-194,519,521,522,523,-16,526,430,431,-36,432,433,-6,527,-16,79],
gt107 = [0,-174,66,221,-13,87,67,222,-8,528,56,58,61,62,85,57,86,-2,60,216,-7,215,-20,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt108 = [0,-177,529,531,530,533,-60,481,266,267,-5,534,480,532,-7,472,265,70],
gt109 = [0,-218,538],
gt110 = [0,-218,539],
gt111 = [0,-14,165,-5,168,-1,154,-5,155,-10,153,-63,166,164,-2,162,-1,167],
gt112 = [0,-15,540,541,-59,544,-2,543],
gt113 = [0,-38,548,-1,551,-1,549,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt114 = [0,-23,564,-55,566],
gt115 = [0,-33,567,569,571,574,573,-21,572],
gt116 = [0,-14,165,-5,168,-1,154,-5,155,-10,153,-63,166,164,-2,577,-1,167],
gt117 = [0,-82,578,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt118 = [0,-80,579,-2,135,-1,151,136,347,346,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt119 = [0,-83,135,-1,151,136,580,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt120 = [0,-85,151,581,-6,355,143,144,-1,145,-3,146,152],
gt121 = [0,-98,583],
gt122 = [0,-100,589],
gt123 = [0,-101,591],
gt124 = [0,-110,597,595,594],
gt125 = [0,-103,600,-5,167],
gt126 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-2,605,604,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt127 = [0,-221,607],
gt128 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,609,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt129 = [0,-218,612],
gt130 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,613,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt131 = [0,-214,616,430,431,-36,432,433,-6,527,-16,79],
gt132 = [0,-214,617,430,431,-36,432,433,-6,527,-16,79],
gt133 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,618,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt134 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,622,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt135 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-6,629,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt136 = [0,-169,631,-71,264,266,267,-15,263,265,70],
gt137 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,632,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt138 = [0,-259,636,265,70],
gt139 = [0,-218,638],
gt140 = [0,-241,481,266,267,-5,641,480,639,-7,472,265,70],
gt141 = [0,-241,646,266,267,-15,645,265,70],
gt142 = [0,-218,647],
gt143 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,652,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt144 = [0,-148,655,-19,654,262,-71,657,266,267,-15,656,265,70],
gt145 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,658,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt146 = [0,-148,664,-23,328,329,-67,666,266,267,-15,665,265,70],
gt147 = [0,-147,669,-23,670,-2,66,221,-13,87,67,222,-8,667,56,58,61,62,85,57,86,-2,60,216,-7,215,-20,217,-11,65,74,75,73,72,-1,64,-1,218,70,-16,79],
gt148 = [0,-164,673],
gt149 = [0,-142,675],
gt150 = [0,-271,678,506],
gt151 = [0,-194,688,521,522,523,-16,526,430,431,-36,432,433,-6,527,-16,79],
gt152 = [0,-196,691,523,-16,526,430,431,-36,432,433,-6,527,-16,79],
gt153 = [0,-197,692,-16,526,430,431,-36,432,433,-6,527,-16,79],
gt154 = [0,-177,695,531,530,533,-60,481,266,267,-5,534,480,532,-7,472,265,70],
gt155 = [0,-173,696,-67,331,266,267,-15,330,265,70],
gt156 = [0,-16,697,-59,544,-2,543],
gt157 = [0,-18,699,-19,700,-1,551,-1,549,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt158 = [0,-78,702],
gt159 = [0,-78,704],
gt160 = [0,-71,708],
gt161 = [0,-41,710],
gt162 = [0,-46,714,712,-1,716,713],
gt163 = [0,-52,718,-1,560,-4,561],
gt164 = [0,-43,553,719,555,-2,556,-2,554,557,720,560,-4,561,723,-6,725,727,724,726,-1,730,-2,729],
gt165 = [0,-34,734,571,574,573,-21,572],
gt166 = [0,-29,737,735,739,736],
gt167 = [0,-33,741,569,571,574,573,-21,572,-49,742],
gt168 = [0,-96,747],
gt169 = [0,-82,751,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt170 = [0,-105,752,-3,380],
gt171 = [0,-108,753,-1,597,595,754],
gt172 = [0,-110,756],
gt173 = [0,-110,597,595,757],
gt174 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,758,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt175 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-1,762,761,760,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt176 = [0,-197,424,-15,764,426,430,431,422,-35,432,433,-3,423,-1,218,427,-16,79],
gt177 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,765,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt178 = [0,-176,766,767,531,530,533,-60,481,266,267,-5,534,480,532,-7,472,265,70],
gt179 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,772,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt180 = [0,-241,775,266,267,-15,774,265,70],
gt181 = [0,-214,471,430,431,-27,777,-3,779,-1,470,-2,432,433,-4,472,265,427,-16,79],
gt182 = [0,-241,481,266,267,-5,780,480,-8,472,265,70],
gt183 = [0,-221,783,-19,481,266,267,-3,785,-1,479,480,784,-7,472,265,70],
gt184 = [0,-137,786,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt185 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,787,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt186 = [0,-137,788,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt187 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,789,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt188 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,792,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt189 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,798,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt190 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,800,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt191 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,801,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt192 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,802,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt193 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,803,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt194 = [0,-148,805,-92,807,266,267,-15,806,265,70],
gt195 = [0,-148,664,-92,807,266,267,-15,806,265,70],
gt196 = [0,-155,809],
gt197 = [0,-137,811,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt198 = [0,-165,812,-75,814,266,267,-15,813,265,70],
gt199 = [0,-2,821,823,822,-261,818,816,-1,815,-5,817,820,316],
gt200 = [0,-2,829,823,822,-268,826,-4,827],
gt201 = [0,-5,835,124,128,125,123,131,129,-2,130,-5,126,-1,154,-5,155,-10,153,-42,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt202 = [0,-113,836,5,-18,6,7,8,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt203 = [0,-179,840,841,-60,481,266,267,-5,534,480,532,-7,472,265,70],
gt204 = [0,-18,843,-19,844,-1,551,-1,549,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt205 = [0,-38,845,-1,551,-1,549,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt206 = [0,-79,850],
gt207 = [0,-10,131,853,852,851,-68,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt208 = [0,-40,551,-1,854,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt209 = [0,-41,855],
gt210 = [0,-43,856,-1,555,-2,556,-3,857,-1,560,-4,561],
gt211 = [0,-46,858],
gt212 = [0,-49,859],
gt213 = [0,-52,860,-1,560,-4,561],
gt214 = [0,-52,861,-1,560,-4,561],
gt215 = [0,-57,866,864],
gt216 = [0,-61,870],
gt217 = [0,-62,875,876,-1,877],
gt218 = [0,-74,882],
gt219 = [0,-55,889,887],
gt220 = [0,-21,892,-2,894,-1,893,895,-45,898],
gt221 = [0,-10,131,853,852,900,-68,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt222 = [0,-29,901],
gt223 = [0,-31,902],
gt224 = [0,-34,903,571,574,573,-21,572],
gt225 = [0,-34,904,571,574,573,-21,572],
gt226 = [0,-82,907,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt227 = [0,-99,909],
gt228 = [0,-110,597,595,754],
gt229 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,916,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt230 = [0,-180,920,-17,919,-42,481,266,267,-5,534,480,-8,472,265,70],
gt231 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,921,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt232 = [0,-241,481,266,267,-5,641,480,926,-7,472,265,70],
gt233 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,931,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt234 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,933,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt235 = [0,-137,935,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt236 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,936,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt237 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,938,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt238 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,939,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt239 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,940,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt240 = [0,-137,943,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt241 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,948,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt242 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,950,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt243 = [0,-156,952,954,953],
gt244 = [0,-2,821,823,822,-262,960,-7,959,820,316],
gt245 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,961,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt246 = [0,-2,962,823,822,-274,244,243,242,245],
gt247 = [0,-268,963],
gt248 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-5,966,967,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt249 = [0,-38,969,-1,551,-1,549,553,550,555,-2,556,-2,554,557,-1,560,-4,561,-11,552],
gt250 = [0,-17,970,-15,971,569,571,574,573,-21,572,-49,972],
gt251 = [0,-10,131,976,-70,132,135,-1,151,136,133,-1,134,140,138,137,142,143,144,-1,145,-3,146,152],
gt252 = [0,-46,714,712],
gt253 = [0,-57,978],
gt254 = [0,-68,979,-1,980,-1,730,-2,729],
gt255 = [0,-68,982,-1,980,-1,730,-2,729],
gt256 = [0,-70,984],
gt257 = [0,-55,990],
gt258 = [0,-24,894,-1,992,895,-45,898],
gt259 = [0,-137,1003,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt260 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,1005,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt261 = [0,-137,1008,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt262 = [0,-137,1010,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt263 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,1012,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt264 = [0,-137,1017,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt265 = [0,-137,1018,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt266 = [0,-137,1019,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt267 = [0,-137,1020,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt268 = [0,-137,1021,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt269 = [0,-137,1022,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt270 = [0,-174,66,221,-7,31,89,-4,87,67,222,-8,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,1024,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt271 = [0,-157,1028,1026],
gt272 = [0,-156,1029,954],
gt273 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,1031,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt274 = [0,-142,1033],
gt275 = [0,-274,1034],
gt276 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-5,1042,967,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt277 = [0,-64,1044],
gt278 = [0,-66,1046],
gt279 = [0,-14,165,-5,168,-1,154,-5,155,-10,153,-63,166,164,-2,1049,-1,167],
gt280 = [0,-27,1050,-45,898],
gt281 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-5,1051,967,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt282 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-5,1052,967,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt283 = [0,-137,1055,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt284 = [0,-137,1056,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt285 = [0,-137,1057,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt286 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,1058,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt287 = [0,-137,1061,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt288 = [0,-137,1062,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt289 = [0,-137,1063,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt290 = [0,-137,1064,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt291 = [0,-137,1065,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt292 = [0,-137,1067,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt293 = [0,-157,1068],
gt294 = [0,-157,1028],
gt295 = [0,-135,1072,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt296 = [0,-68,1078,-1,980,-1,730,-2,729],
gt297 = [0,-68,1080,-1,980,-1,730,-2,729],
gt298 = [0,-14,377,-5,168,-1,154,-2,1081,-2,155,-10,153,-65,379,378,-2,380],
gt299 = [0,-135,630,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-5,1086,967,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt300 = [0,-137,1087,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt301 = [0,-137,1089,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt302 = [0,-137,1090,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt303 = [0,-137,1091,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt304 = [0,-135,1093,9,10,11,115,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,116,120,-2,66,118,-7,31,89,-4,87,67,114,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],
gt305 = [0,-174,66,221,-7,31,89,-4,87,67,222,-7,1094,32,56,58,61,62,85,57,86,-2,60,216,-7,215,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,253,70,-16,79],
gt306 = [0,-137,1099,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,158,109,113,108,111,110,-10,79],

    // State action lookup maps
    sm0=[0,1,2,3,-1,0,-4,0,-9,4,5,-4,6,-14,7,-12,8,9,-1,10,11,12,13,-1,14,-8,15,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm1=[0,50,-3,0,-4,0],
sm2=[0,51,-3,0,-4,0],
sm3=[0,51,-3,0,-4,0,-10,52],
sm4=[0,53,-3,0,-4,0,-30,53],
sm5=[0,54,-3,0,-4,0,-30,54],
sm6=[0,55,-3,0,-4,0,-30,55],
sm7=[0,56,2,57,-1,0,-4,0,-9,58,5,-19,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm8=[0,59,59,59,-1,0,-4,0,-9,59,59,59,-18,59,-12,59,59,-6,59,-9,59,-2,59,59,59,59,-1,59,-1,59,59,59,59,-1,59,59,59,59,59,59,59,59,59,-2,59,59,-5,59,59,-2,59,-23,59,-1,59,59,59,59,59,59,59,59,59,-23,59,59],
sm9=[0,60,60,60,-1,0,-4,0,-9,60,60,60,-18,60,-12,60,60,-6,60,-9,60,-2,60,60,60,60,-1,60,-1,60,60,60,60,-1,60,60,60,60,60,60,60,60,60,-2,60,60,-5,60,60,-2,60,-23,60,-1,60,60,60,60,60,60,60,60,60,-23,60,60],
sm10=[0,61,61,61,-1,0,-4,0,-9,61,61,61,-18,61,-12,61,61,-6,61,-9,61,-2,61,61,61,61,-1,61,61,61,61,61,61,-1,61,61,61,61,61,61,61,61,61,-2,61,61,-5,61,61,-2,61,-23,61,-1,61,61,61,61,61,61,61,61,61,-23,61,61],
sm11=[0,62,62,62,-1,0,-4,0,-9,62,62,62,-18,62,-12,62,62,-6,62,-9,62,-2,62,62,62,62,-1,62,62,62,62,62,62,-1,62,62,62,62,62,62,62,62,62,-2,62,62,-5,62,62,-2,62,-23,62,-1,62,62,62,62,62,62,62,62,62,-23,62,62],
sm12=[0,-1,2,63,-1,0,-4,0,-9,58,5,-4,6,-14,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm13=[0,-4,0,-4,0,-8,64,-1,65],
sm14=[0,-4,0,-4,0,-5,66,-2,66,-1,66,-3,66,-37,66,-7,66],
sm15=[0,-4,0,-4,0,-5,67,-2,67,-1,67,67,-2,67,-37,67,-7,67],
sm16=[0,-4,0,-4,0,-5,68,-2,68,-1,68,68,-2,68,-15,68,68,68,69,-1,68,68,-1,68,-4,68,-1,68,68,68,-4,68,70,-1,71,-4,68,-38,72,73,74,75,76,77,78,79,80,81,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
sm17=[0,-4,0,-4,0,-5,84,-2,84,-1,84,84,-2,84,-30,85,-6,84,-7,84,-48,86],
sm18=[0,-4,0,-4,0,-5,87,-2,87,-1,87,87,-2,87,-30,87,-6,87,-7,87,-48,87,88],
sm19=[0,-4,0,-4,0,-5,89,-2,89,-1,89,89,-2,89,-30,89,-1,90,-4,89,-7,89,-48,89,89],
sm20=[0,-4,0,-4,0,-5,91,-2,91,-1,91,91,-2,91,-30,91,-1,91,-4,91,-7,91,-48,91,91,92],
sm21=[0,-4,0,-4,0,-5,93,-2,93,-1,93,93,-2,93,-30,93,-1,93,-4,93,-7,93,-48,93,93,93,94],
sm22=[0,-4,0,-4,0,-5,95,-2,95,-1,95,95,-2,95,-30,95,-1,95,-4,95,-7,95,-48,95,95,95,95,96,97,98,99],
sm23=[0,-4,0,-4,0,-5,100,-2,100,-1,100,100,-2,100,-15,101,102,103,-5,104,-6,100,-1,100,-4,100,-7,100,-48,100,100,100,100,100,100,100,100,105,106],
sm24=[0,-4,0,-4,0,-5,107,-2,107,-1,107,107,-2,107,-15,107,107,107,-5,107,-6,107,-1,107,-4,107,-7,107,-48,107,107,107,107,107,107,107,107,107,107,108,109,110],
sm25=[0,-4,0,-4,0,-5,111,-2,111,-1,111,111,-2,111,-15,111,111,111,-5,111,-4,112,-1,111,-1,111,-4,111,-7,111,-48,111,111,111,111,111,111,111,111,111,111,111,111,111,113],
sm26=[0,-4,0,-4,0,-5,114,-2,114,-1,114,114,-2,114,-15,114,114,114,-2,115,116,-1,114,-4,114,-1,114,117,114,-4,114,-7,114,-48,114,114,114,114,114,114,114,114,114,114,114,114,114,114],
sm27=[0,-4,0,-4,0,-5,118,-2,118,-1,118,118,-2,118,-15,118,118,118,-2,118,118,-1,118,-4,118,-1,118,118,118,-4,118,-7,118,-48,118,118,118,118,118,118,118,118,118,118,118,118,118,118],
sm28=[0,-4,0,-4,0,-5,119,-2,119,-1,119,119,-2,119,-15,119,119,119,-2,119,119,-1,119,-4,119,-1,119,119,119,-4,119,-7,119,-48,119,119,119,119,119,119,119,119,119,119,119,119,119,119],
sm29=[0,-4,0,-4,0,-5,120,-2,120,-1,120,120,-2,120,-15,120,120,120,-2,120,120,-1,120,-4,120,-1,120,120,120,-4,120,-7,120,-48,120,120,120,120,120,120,120,120,120,120,120,120,120,120,121],
sm30=[0,-1,2,57,-1,0,-4,0,-9,122,-33,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm31=[0,-4,0,-4,0,-5,120,-2,120,-1,120,120,-2,120,-15,120,120,120,-2,120,120,-1,120,-4,120,-1,120,120,120,-4,120,-7,120,-48,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120],
sm32=[0,-4,0,-4,0,-5,124,-2,124,124,124,124,-2,124,-15,124,124,124,124,-1,124,124,-1,124,-4,124,-1,124,124,124,-4,124,124,-1,124,-4,124,-14,124,-23,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,-4,124,124],
sm33=[0,-4,0,-4,0,-5,124,-2,124,124,124,124,-2,124,-15,124,124,124,124,-1,124,124,-1,124,-4,124,-1,124,124,124,-1,125,-1,126,124,124,-1,124,-4,124,127,-13,124,-23,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,-4,124,124],
sm34=[0,-4,0,-4,0,-5,128,-2,128,128,128,128,-2,128,-15,128,128,128,128,-1,128,128,-1,128,-4,128,-1,128,128,128,-1,129,-1,130,128,128,-1,128,-4,128,127,-13,128,-23,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-4,128,128],
sm35=[0,-1,2,57,-1,0,-4,0,-9,122,-39,131,-1,123,-9,16,-3,17,18,-27,35,132,-2,37,-31,45,46,47,-23,48,49],
sm36=[0,-4,0,-4,0,-5,133,-2,133,133,133,133,-2,133,-15,133,133,133,133,-1,133,133,-1,133,-4,133,-1,133,133,133,-1,133,-1,133,133,133,-1,133,-4,133,133,-13,133,-23,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,-4,133,133],
sm37=[0,-4,0,-4,0,-5,134,-2,134,134,134,134,-2,134,-15,134,134,134,134,-1,134,134,-1,134,-4,134,-1,134,134,134,-1,134,-1,134,134,134,-1,134,-4,134,134,-13,134,-23,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-4,134,134],
sm38=[0,-4,0,-4,0,-5,135,-2,135,135,135,135,-2,135,-15,135,135,135,135,-1,135,135,-1,135,-4,135,-1,135,135,135,-1,135,-1,135,135,135,-1,135,-4,135,135,-13,135,-23,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,-4,135,135],
sm39=[0,-4,0,-4,0,-5,135,-2,135,-1,135,135,-2,135,-15,135,135,135,135,-1,135,135,-1,135,-4,135,-1,135,135,135,-1,135,-1,135,135,135,-1,135,-4,135,135,-13,135,-13,136,-9,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,-4,135,135],
sm40=[0,-4,0,-4,0,-8,137,-1,137,-19,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,-1,137,-1,137,-4,138,137,-27,139,-9,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
sm41=[0,-4,0,-4,0,-5,140,-2,140,140,140,140,-2,140,-15,140,140,140,140,-1,140,140,-1,140,-4,140,-1,140,140,140,-1,140,-1,140,140,140,-1,140,-4,140,140,-13,140,-13,140,140,-8,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,-4,140,140],
sm42=[0,-2,141,-1,0,-4,0,-8,141,141,142,-19,142,141,142,142,-1,142,142,-1,142,-4,141,141,141,141,143,141,141,-1,141,-1,142,-1,142,-4,141,142,-27,142,-9,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
sm43=[0,-4,0,-4,0,-5,144,-2,144,144,144,144,-2,144,-15,144,144,144,144,-1,144,144,-1,144,-4,144,-1,144,144,144,-1,144,-1,144,144,144,-1,144,-4,144,144,-13,144,-23,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,-4,144,144],
sm44=[0,-4,0,-4,0,-5,145,-2,145,145,145,145,-2,145,-15,145,145,145,145,-1,145,145,-1,145,-4,145,-1,145,145,145,-1,145,-1,145,145,145,-1,145,-4,145,145,-13,145,-23,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,-4,145,145],
sm45=[0,-4,0,-4,0,-5,146,-2,146,146,146,146,-2,146,-15,146,146,146,146,-1,146,146,-1,146,-4,146,-1,146,146,146,-1,146,-1,146,146,146,-1,146,-4,146,146,-13,146,-23,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,-4,146,146],
sm46=[0,-4,0,-4,0,-5,147,-2,147,147,147,147,-2,147,-15,147,147,147,147,-1,147,147,-1,147,-4,147,-1,147,147,147,-1,147,-1,147,147,147,-1,147,-4,147,147,-13,147,-23,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,-4,147,147],
sm47=[0,-2,148,-1,149,-8,150],
sm48=[0,-4,0,-4,0,-5,151,-2,151,151,151,151,-2,151,-15,151,151,151,151,-1,151,151,-1,151,-4,151,-1,151,151,151,-1,151,-1,151,151,151,-1,151,-4,151,151,-13,151,-23,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,-4,151,151],
sm49=[0,-1,2,57,-1,0,-4,0,-9,122,-4,152,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-1,153,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm50=[0,-4,0,-4,0,-49,154,-1,155,-9,127],
sm51=[0,-4,0,-4,0,-5,156,-2,156,156,156,156,-2,156,-15,156,156,156,156,-1,156,156,-1,156,-4,156,-1,156,156,156,-1,156,-1,156,156,156,-1,156,-4,156,156,-13,156,-23,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,-4,156,156],
sm52=[0,-4,0,-4,0,-5,157,-2,157,157,157,157,-2,157,-15,157,157,157,157,-1,157,157,-1,157,-4,157,-1,157,157,157,-1,157,-1,157,157,157,-1,157,-4,157,157,-13,157,-23,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,-4,157,157],
sm53=[0,-4,0,-4,0,-89,158],
sm54=[0,-4,0,-4,0,-89,136],
sm55=[0,-4,0,-4,0,-60,159],
sm56=[0,-2,57,-1,0,-4,0,-9,160,-41,161],
sm57=[0,162,162,162,-1,0,-4,0,-9,162,162,162,-18,162,-12,162,162,-6,162,-9,162,-2,162,162,162,162,-1,162,162,162,162,162,162,-1,162,162,162,162,162,162,162,162,162,-2,162,162,-5,162,162,-2,162,-23,162,-1,162,162,162,162,162,162,162,162,162,-23,162,162],
sm58=[0,-4,0,-4,0,-61,163],
sm59=[0,164,164,164,-1,0,-4,0,-9,164,164,164,-18,164,-12,164,164,-6,164,-9,164,-2,164,164,164,164,-1,164,164,164,164,164,164,-1,164,164,164,164,164,164,164,164,164,-2,164,164,-5,164,164,-2,164,-23,164,-1,164,164,164,164,164,164,164,164,164,-23,164,164],
sm60=[0,-1,2,57,-1,0,-4,0,-9,58,5,-19,7,-12,8,9,-16,16,-7,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,-6,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm61=[0,-4,0,-4,0,-61,165],
sm62=[0,-4,0,-4,0,-61,166,-14,167],
sm63=[0,-4,0,-4,0,-61,168],
sm64=[0,-2,57,-1,0,-4,0,-10,169],
sm65=[0,-2,57,-1,0,-4,0,-10,170],
sm66=[0,-1,2,57,-1,0,-4,0,-9,122,171,-32,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm67=[0,-4,0,-4,0,-61,172],
sm68=[0,-4,0,-4,0,-9,58],
sm69=[0,-4,0,-4,0,-10,173],
sm70=[0,174,-3,0,-4,0,-10,174],
sm71=[0,-4,0,-4,0,-30,7],
sm72=[0,175,-3,0,-4,0,-10,175],
sm73=[0,-4,0,-4,0,-30,176],
sm74=[0,-2,177,-1,178,-3,179,180,-3,181,-12,182,-117,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202],
sm75=[0,-4,0,-4,0,-30,203],
sm76=[0,204,204,204,-1,0,-4,0,-9,204,204,204,-18,204,-12,204,204,-6,204,-9,204,-2,204,204,204,204,-1,204,-1,204,204,204,204,-1,204,204,204,204,204,204,204,204,204,-2,204,204,-5,204,204,-2,204,-23,204,-1,204,204,204,204,204,204,204,204,204,-23,204,204],
sm77=[0,-2,57,-1,0,-4,0,-9,205,-80,206],
sm78=[0,207,207,207,-1,0,-4,0,-9,207,207,207,-18,207,-12,207,207,-6,207,-9,207,-2,207,207,207,207,-1,207,-1,207,207,207,207,-1,207,207,207,207,207,207,207,207,207,-2,207,207,-5,207,207,-2,207,-23,207,-1,207,207,207,207,207,207,207,207,207,-23,207,207],
sm79=[0,-2,57,-1,0,-4,0,-61,208],
sm80=[0,-2,209,-1,0,-4,0,-9,209,-41,209],
sm81=[0,-2,210,-1,0,-4,0,-9,210,-41,210],
sm82=[0,211,-3,0,-4,0,-30,211],
sm83=[0,212,-1,213,-1,0,-4,0,-9,214,-5,6,-14,212,-15,10,11,12,13,-1,14,-8,15],
sm84=[0,215,-1,215,-1,0,-4,0,-9,215,216,-4,215,-14,215,-15,215,215,215,215,-1,215,-8,215],
sm85=[0,-4,0,-4,0,-13,217,-2,218,219,-7,220],
sm86=[0,221,-1,221,-1,0,-4,0,-9,221,-5,221,-14,221,-15,221,221,221,221,-1,221,-8,221],
sm87=[0,222,-1,222,-1,0,-4,0,-9,222,-5,222,-14,222,-15,222,222,222,222,-1,222,-8,222],
sm88=[0,-4,0,-4,0,-8,223,224],
sm89=[0,-4,0,-4,0,-8,225,225],
sm90=[0,-2,213,-1,0,-4,0,-8,226,226,-4,226,-16,227,-11,228,229,230,10,11,12,13,-1,14,-8,15],
sm91=[0,-2,231,-1,0,-4,0,-8,231,231,-4,231,-16,231,-11,231,231,231,231,231,12,13,-1,14,-8,15],
sm92=[0,-2,231,-1,0,-4,0,-8,231,231,-4,231,-16,231,-11,231,231,231,231,231,231,231,-1,231,-8,232],
sm93=[0,-2,233,-1,0,-4,0,-8,233,233,-4,233,-16,233,-11,233,233,233,233,233,233,233,-1,233,-8,233],
sm94=[0,-2,234,-1,0,-4,0,-46,235],
sm95=[0,-2,233,-1,0,-4,0,-8,233,233,-4,233,-16,233,-11,233,233,233,233,143,233,233,-1,233,-8,233],
sm96=[0,-4,0,-4,0,-47,236],
sm97=[0,-2,237,-1,0,-4,0,-46,237],
sm98=[0,-2,238,-1,0,-4,0,-8,238,238,-4,238,-16,238,-11,238,238,238,238,238,238,238,-1,238,-8,238],
sm99=[0,-2,239,-1,0,-4,0,-8,239,239,-4,239,-16,239,-11,239,239,239,239,239,239,239,-1,239,-8,239],
sm100=[0,-2,240,-1,0,-4,0],
sm101=[0,-2,241,-1,0,-4,0],
sm102=[0,-2,213,-1,0,-4,0,-46,242,11],
sm103=[0,-2,243,-1,0,-4,0,-60,244],
sm104=[0,-2,245,-1,0,-4,0,-8,245,245,-4,245,-16,245,-11,245,245,245,245,245,245,245,-1,245,-8,245],
sm105=[0,-2,246,-1,0,-4,0,-8,246,246,-4,246,-16,246,-11,246,246,246,246,246,246,246,-1,246,-8,244],
sm106=[0,-4,0,-4,0,-10,247],
sm107=[0,-4,0,-4,0,-10,248],
sm108=[0,-4,0,-4,0,-10,249],
sm109=[0,250,250,250,-1,0,-4,0,-9,250,250,250,-18,250,-12,250,250,-6,250,-9,250,-2,250,250,250,250,-1,250,250,250,250,250,250,-1,250,250,250,250,250,250,250,250,250,-2,250,250,-5,250,250,-2,250,-23,250,-1,250,250,250,250,250,250,250,250,250,-23,250,250],
sm110=[0,251,251,251,-1,0,-4,0,-9,251,251,251,-18,251,-12,251,251,-6,251,-9,251,-2,251,251,251,251,-1,251,-1,251,251,251,251,-1,251,251,251,251,251,251,251,251,251,-2,251,251,-5,251,251,-2,251,-23,251,-1,251,251,251,251,251,251,251,251,251,-23,251,251],
sm111=[0,-4,0,-4,0,-10,52],
sm112=[0,-1,2,57,-1,0,-4,0,-9,58,5,-19,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm113=[0,-4,0,-4,0,-5,142,-2,142,142,142,142,-2,142,-15,142,142,142,142,-1,142,142,-1,142,-4,142,-1,142,142,142,-1,142,-1,142,142,142,-1,142,-4,142,142,-13,142,-13,142,142,-8,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
sm114=[0,-1,2,57,-1,0,-4,0,-9,58,5,252,-18,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm115=[0,-2,253,-1,0,-4,0,-10,254,255,-3,6],
sm116=[0,-4,0,-4,0,-8,142,-1,142,-19,142,142,142,142,-1,142,142,-1,142,-4,142,-1,142,142,142,-1,142,-1,142,-1,142,-1,142,-4,256,142,-27,142,-9,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
sm117=[0,-2,257,-1,0,-4,0,-10,258,257,-3,257],
sm118=[0,-2,259,-1,0,-4,0,-10,259,259,-3,259],
sm119=[0,-2,260,-1,0,-4,0,-10,260,260,-3,260],
sm120=[0,-2,261,-1,0,-4,0,-10,261,261,-3,261],
sm121=[0,-4,0,-4,0,-10,216],
sm122=[0,262,262,262,-1,0,-4,0,-9,262,262,262,-18,262,-12,262,262,-6,262,-9,262,-2,262,262,262,262,-1,262,262,262,262,262,262,-1,262,262,262,262,262,262,262,262,262,-2,262,262,-5,262,262,-2,262,-23,262,-1,262,262,262,262,262,262,262,262,262,-23,262,262],
sm123=[0,-4,0,-4,0,-5,263,-2,263,-1,263,263,-2,263,-15,263,263,263,-2,263,263,-1,263,-4,263,-1,263,263,263,-4,263,-7,263,-48,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263],
sm124=[0,-4,0,-4,0,-5,264,-2,264,-1,264,264,-2,264,-15,264,264,264,-2,264,264,-1,264,-4,264,-1,264,264,264,-4,264,-7,264,-48,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264],
sm125=[0,-1,265,265,-1,0,-4,0,-9,265,-33,265,265,-6,265,-9,265,-3,265,265,-9,265,-17,265,265,-2,265,-23,265,-1,265,265,265,265,265,265,265,265,265,-23,265,265],
sm126=[0,-4,0,-4,0,-5,266,-2,266,-1,266,266,-2,266,-15,266,266,266,-2,266,266,-1,266,-4,266,-1,266,266,266,-4,266,-7,266,-48,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266],
sm127=[0,-4,0,-4,0,-5,68,-2,68,-1,68,68,-2,68,-15,68,68,68,-2,68,68,-1,68,-4,68,-1,68,68,68,-4,68,-7,68,-48,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
sm128=[0,-4,0,-4,0,-5,267,-2,267,267,267,267,-2,267,-15,267,267,267,267,-1,267,267,-1,267,-4,267,-1,267,267,267,-1,267,-1,267,267,267,-1,267,-4,267,267,-13,267,-23,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,-4,267,267],
sm129=[0,-4,0,-4,0,-5,268,-2,268,268,268,268,-2,268,-15,268,268,268,268,-1,268,268,-1,268,-4,268,-1,268,268,268,-1,268,-1,268,268,268,-1,268,-4,268,268,-13,268,-23,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,-4,268,268],
sm130=[0,-4,0,-4,0,-5,137,-2,137,137,137,137,-2,137,-15,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,137,137,-1,137,-4,137,137,-13,137,-23,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
sm131=[0,-1,2,57,-1,0,-4,0,-8,269,122,-33,8,9,-6,123,270,-8,16,-3,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm132=[0,-1,2,57,-1,0,-4,0,-11,272,-39,273,-40,274,275,-3,276,-58,48,49],
sm133=[0,-4,0,-4,0,-5,277,-2,277,277,277,277,-2,277,-15,277,277,277,277,-1,277,277,-1,277,-4,277,-1,277,277,277,-1,277,-1,277,277,277,-1,277,-4,277,277,-13,277,-23,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,-4,277,277],
sm134=[0,-4,0,-4,0,-5,278,-2,278,278,278,278,-2,278,-15,278,278,278,278,-1,278,278,-1,278,-4,278,-1,278,278,278,-1,278,-1,278,278,278,-1,278,-4,278,278,-13,278,-23,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,-4,278,278],
sm135=[0,-4,0,-4,0,-5,279,-2,279,-1,279,279,-2,279,-15,279,279,279,-2,279,279,-1,279,-4,279,-1,279,279,279,-4,279,-7,279,-48,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279],
sm136=[0,-4,0,-4,0,-5,280,-2,280,-1,280,280,-2,280,-15,280,280,280,-2,280,280,-1,280,-4,280,-1,280,280,280,-4,280,-7,280,-48,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280],
sm137=[0,-4,0,-4,0,-5,281,-2,281,-1,281,281,-2,281,-15,281,281,281,-2,281,281,-1,281,-4,281,-1,281,281,281,-4,281,-7,281,-48,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281],
sm138=[0,-4,0,-4,0,-5,282,-2,282,-1,282,282,-2,282,-15,282,282,282,-2,282,282,-1,282,-4,282,-1,282,282,282,-4,282,-7,282,-48,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282],
sm139=[0,-4,0,-4,0,-5,283,-2,283,-1,283,283,-2,283,-15,283,283,283,-2,283,283,-1,283,-4,283,-1,283,283,283,-4,283,-7,283,-48,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283],
sm140=[0,-4,0,-4,0,-5,284,-2,284,-1,284,284,-2,284,-15,284,284,284,-2,284,284,-1,284,-4,284,-1,284,284,284,-4,284,-7,284,-48,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284],
sm141=[0,-4,0,-4,0,-5,285,-2,285,-1,285,285,-2,285,-15,285,285,285,-2,285,285,-1,285,-4,285,-1,285,285,285,-4,285,-7,285,-48,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285],
sm142=[0,-4,0,-4,0,-5,286,-2,286,-1,286,286,-2,286,-15,286,286,286,-2,286,286,-1,286,-4,286,-1,286,286,286,-4,286,-7,286,-48,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286],
sm143=[0,-2,57,-1,0,-4,0],
sm144=[0,-4,0,-4,0,-5,287,-2,287,287,287,287,-2,287,-15,287,287,287,287,-1,287,287,-1,287,-4,287,-1,287,287,287,-1,287,-1,287,287,287,-1,287,-4,287,287,-13,287,-23,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,-4,287,287],
sm145=[0,-1,2,57,-1,0,-4,0,-9,122,-4,288,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-1,289,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm146=[0,-4,0,-4,0,-5,290,-2,290,290,290,290,-2,290,-15,290,290,290,290,-1,290,290,-1,290,-4,290,-1,290,290,290,-1,290,-1,290,290,290,-1,290,-4,290,290,-13,290,-23,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,-4,290,290],
sm147=[0,-4,0,-4,0,-5,291,-2,291,291,291,291,-2,291,-15,291,291,291,291,-1,291,291,-1,291,-4,291,-1,291,291,291,-4,291,291,-1,291,-4,291,-14,291,-23,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,-4,291,291],
sm148=[0,-4,0,-4,0,-96,292],
sm149=[0,-4,0,-4,0,-49,154,-1,155],
sm150=[0,-166,293],
sm151=[0,-2,148,-1,149,-8,150,-152,294,294],
sm152=[0,-2,295,-1,295,-8,295,-152,295,295],
sm153=[0,-2,296,-1,296,-8,296,-152,296,296],
sm154=[0,-2,297,-1,297,-8,297,-152,297,297],
sm155=[0,-167,298],
sm156=[0,-4,0,-4,0,-5,299,-2,299,299,299,299,-2,299,-15,299,299,299,299,-1,299,299,-1,299,-4,299,-1,299,299,299,-1,299,-1,299,299,299,-1,299,-4,299,299,-13,299,-13,299,-9,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,-4,299,299],
sm157=[0,-4,0,-4,0,-8,300,-5,301],
sm158=[0,-4,0,-4,0,-5,137,-2,137,-1,137,137,-2,137,-15,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,137,137,-1,137,-4,137,137,-13,137,-13,139,-9,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
sm159=[0,-4,0,-4,0,-5,302,-2,302,302,302,302,-2,302,-15,302,302,302,302,-1,302,302,-1,302,-4,302,-1,302,302,302,-1,302,-1,302,302,302,-1,302,-4,302,302,-13,302,-23,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,-4,302,302],
sm160=[0,-4,0,-4,0,-5,303,-2,303,-1,303,303,-2,303,-15,303,303,303,-2,303,303,-1,303,-4,303,-1,303,303,303,-4,303,-7,303,-48,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303],
sm161=[0,-1,2,57,-1,0,-4,0,-9,304,-33,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm162=[0,305,305,305,-1,0,-4,0,-9,305,305,305,-18,305,-12,305,305,-6,305,-9,305,-2,305,305,305,305,-1,305,305,305,305,305,305,-1,305,305,305,305,305,305,305,305,305,-2,305,305,-5,305,305,-2,305,-23,305,-1,305,305,305,305,305,305,305,305,305,-23,305,305],
sm163=[0,-1,2,57,-1,0,-4,0,-9,58,5,-19,7,-12,8,9,-16,16,-3,17,-3,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,-6,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm164=[0,-4,0,-4,0,-8,306,-1,307],
sm165=[0,-4,0,-4,0,-8,308,-1,308],
sm166=[0,-4,0,-4,0,-8,309,-1,309,-22,310],
sm167=[0,-4,0,-4,0,-33,310],
sm168=[0,-4,0,-4,0,-8,139,139,139,139,-2,139,-18,139,-4,139,-13,139,-8,139,-13,139,-14,139],
sm169=[0,-4,0,-4,0,-8,311,-2,311,-2,311,-18,311,-4,311,-13,311,-22,311],
sm170=[0,-1,2,57,-1,0,-4,0,-11,312,-39,273,-45,313,-58,48,49],
sm171=[0,-2,57,-1,0,-4,0,-8,269,160,-41,161,314,-44,315],
sm172=[0,-4,0,-4,0,-72,316],
sm173=[0,-1,2,57,-1,0,-4,0,-9,122,317,-32,8,9,-6,123,-9,16,-3,17,18,19,-6,318,-1,25,-11,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm174=[0,-4,0,-4,0,-61,319],
sm175=[0,320,320,320,-1,0,-4,0,-9,320,320,320,-18,320,-12,320,320,-6,320,-9,320,-2,320,320,320,320,-1,320,320,320,320,320,320,-1,320,320,320,320,320,320,320,320,320,-2,320,320,-5,320,320,-2,320,-23,320,-1,320,320,320,320,320,320,320,320,320,-23,320,320],
sm176=[0,-4,0,-4,0,-10,321],
sm177=[0,-4,0,-4,0,-10,138],
sm178=[0,322,322,322,-1,0,-4,0,-9,322,322,322,-18,322,-12,322,322,-6,322,-9,322,-2,322,322,322,322,-1,322,322,322,322,322,322,-1,322,322,322,322,322,322,322,322,322,-2,322,322,-5,322,322,-2,322,-23,322,-1,322,322,322,322,322,322,322,322,322,-23,322,322],
sm179=[0,-4,0,-4,0,-10,323],
sm180=[0,324,324,324,-1,0,-4,0,-9,324,324,324,-18,324,-12,324,324,-6,324,-9,324,-2,324,324,324,324,-1,324,324,324,324,324,324,-1,324,324,324,324,324,324,324,324,324,-2,324,324,-5,324,324,-2,324,-23,324,-1,324,324,324,324,324,324,324,324,324,-23,324,324],
sm181=[0,-4,0,-4,0,-8,64,-1,325],
sm182=[0,-4,0,-4,0,-8,64,-1,326],
sm183=[0,-4,0,-4,0,-85,327,328],
sm184=[0,329,329,329,-1,0,-4,0,-9,329,329,329,-18,329,-12,329,329,-6,329,-9,329,-2,329,329,329,329,-1,329,329,329,329,329,329,-1,329,329,329,329,329,329,329,329,329,-2,329,329,-5,329,329,-2,329,-23,329,-1,329,329,329,329,329,329,329,329,329,-23,329,329],
sm185=[0,330,-3,0,-4,0,-10,330],
sm186=[0,-4,0,-4,0,-30,331],
sm187=[0,332,-3,0,-4,0,-10,332],
sm188=[0,-2,333,-1,0,-4,0,-134,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202],
sm189=[0,-2,334,-1,0,-4,0,-31,335,-3,335,-120,336,337],
sm190=[0,-2,334,-1,0,-4,0,-31,335,-124,336,337],
sm191=[0,-2,338,-1,178,-3,179,180,-3,181,-27,339],
sm192=[0,-2,340,-1,341,-3,341,341,-3,341,-27,340,-3,340,-120,340,340],
sm193=[0,-2,342,-1,0,-4,0,-31,342,-3,342,-120,342,342],
sm194=[0,-2,343,-1,343,-3,343,343,-3,343,343,-25,343,343,-101,343],
sm195=[0,-2,341,-1,341,-3,341,341,-3,341,341,-25,341,341,-101,341],
sm196=[0,-4,0,-4,0,-9,205,-80,206],
sm197=[0,344,344,344,-1,0,-4,0,-5,344,-2,344,344,344,344,-2,344,-15,344,344,344,344,-1,344,344,-1,344,-4,344,344,344,344,344,-1,344,-1,344,344,344,-1,344,-4,344,344,-2,344,344,344,344,-1,344,-1,344,344,344,344,344,344,344,344,344,344,344,344,344,344,-2,344,344,-5,344,344,-2,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,344,-23,344,344],
sm198=[0,-4,0,-4,0,-9,345],
sm199=[0,-1,2,57,-1,0,-4,0,-10,346,347,-39,273,-39,348,274,275,-62,48,49],
sm200=[0,-1,2,57,-1,0,-4,0,-9,122,-41,123,-9,16,-3,17,18,-27,35,36,-2,37,-31,45,46,47,-23,48,49],
sm201=[0,-2,57,-1,0,-4,0,-9,160,-4,349,-36,161,-45,315],
sm202=[0,-4,0,-4,0,-61,350],
sm203=[0,-4,0,-4,0,-8,351,-1,352],
sm204=[0,-4,0,-4,0,-8,353,-1,353],
sm205=[0,354,-1,213,-1,0,-4,0,-9,214,-5,6,-14,354,-15,10,11,12,13,-1,14,-8,15],
sm206=[0,355,-1,355,-1,0,-4,0,-9,355,216,-4,355,-14,355,-15,355,355,355,355,-1,355,-8,355],
sm207=[0,-2,253,-1,0,-4,0,-15,6],
sm208=[0,-2,141,-1,0,-4,0,-8,141,141,-4,141,-16,141,-1,141,-9,141,141,141,141,143,141,141,-1,141,141,141,141,141,-4,141],
sm209=[0,356,-1,356,-1,0,-4,0,-9,356,-5,356,-14,356,-15,356,356,356,356,-1,356,-8,356],
sm210=[0,357,-1,357,-1,0,-4,0,-9,357,357,357,-3,357,-14,357,-15,357,357,357,357,-1,357,-8,357],
sm211=[0,-4,358,-4,0,-40,359,-115,360,361],
sm212=[0,-2,362,-1,0,-4,0,-23,363,-2,364,-34,365],
sm213=[0,-4,0,-4,0,-18,366,-137,360,361],
sm214=[0,-2,367,-1,0,-3,368,0,-23,369,-37,370],
sm215=[0,-2,213,-1,0,-4,0,-46,10,11,12,13,-1,14,-8,15],
sm216=[0,-2,213,-1,0,-4,0,-8,371,371,-4,371,-16,227,-11,228,229,230,10,11,12,13,-1,14,-8,15],
sm217=[0,-2,372,-1,0,-4,0,-8,372,372,-4,372,-16,372,-11,372,372,372,372,372,372,372,-1,372,-8,372],
sm218=[0,-2,373,-1,0,-4,0,-8,373,373,-4,373,-16,373,-11,373,373,373,373,373,373,373,-1,373,-8,373],
sm219=[0,-2,374,-1,0,-4,0,-46,374,374,374,374,-1,374,-8,374],
sm220=[0,-2,375,-1,0,-4,0,-8,375,375,-4,375,-16,375,-11,375,375,375,375,375,12,13,-1,14,-8,15],
sm221=[0,-2,375,-1,0,-4,0,-8,375,375,-4,375,-16,375,-11,375,375,375,375,375,375,375,-1,375,-8,232],
sm222=[0,-2,376,-1,0,-4,0,-8,376,376,-4,376,-16,376,-11,376,376,376,376,376,376,376,-1,376,-8,376],
sm223=[0,-2,377,-1,0,-4,0,-8,377,377,-4,377,-16,377,-11,377,377,377,377,377,377,377,-1,377,-8,377],
sm224=[0,-4,0,-4,0,-60,244],
sm225=[0,-2,378,-1,0,-4,0,-8,378,378,-4,378,-16,378,-11,378,378,378,378,378,378,378,-1,378,-8,378],
sm226=[0,-2,379,-1,0,-4,0,-8,379,379,-4,379,-16,379,-1,379,-9,379,379,379,379,379,379,379,-1,379,379,379,379,379,-4,379],
sm227=[0,-2,380,-1,0,-4,0,-46,380],
sm228=[0,-2,381,-1,0,-4,0,-8,381,381,-4,381,-16,381,-11,381,381,381,381,381,381,381,-1,381,-8,381],
sm229=[0,-2,382,-1,0,-4,0,-8,382,382,-4,382,-16,382,-11,382,382,382,382,382,382,382,-1,382,-8,382],
sm230=[0,-4,0,-4,0,-33,383,-10,384,-7,385,386,387,388],
sm231=[0,-2,234,-1,0,-4,0],
sm232=[0,-4,0,-4,0,-47,143],
sm233=[0,-2,389,-1,0,-4,0,-8,389,389,-4,389,-16,389,-11,389,389,389,389,389,389,389,-1,389,-8,389,390],
sm234=[0,-2,391,-1,0,-4,0,-8,391,391,-4,391,-16,391,-11,391,391,391,391,391,391,391,-1,391,-8,391],
sm235=[0,-2,243,-1,0,-4,0],
sm236=[0,-2,392,-1,0,-4,0,-8,392,392,-4,392,-16,392,-11,392,392,392,392,392,392,392,-1,392,-8,244],
sm237=[0,-2,393,-1,0,-4,0,-8,393,393,-4,393,-16,393,-11,393,393,393,393,393,393,393,-1,393,-8,393],
sm238=[0,394,394,394,-1,0,-4,0,-9,394,394,394,-18,394,-12,394,394,-6,394,-9,394,-2,394,394,394,394,-1,394,394,394,394,394,394,-1,394,394,394,394,394,394,394,394,394,394,394,394,394,-5,394,394,-2,394,-23,394,-1,394,394,394,394,394,394,394,394,394,-23,394,394],
sm239=[0,-4,0,-4,0,-11,395],
sm240=[0,396,-1,396,-1,0,-4,0,-9,396,-1,396,-3,396,-14,396,-15,396,396,396,396,-1,396,-8,396],
sm241=[0,-2,397,-1,0,-4,0,-10,397,397,-3,397],
sm242=[0,-2,398,-1,0,-4,0,-10,399,398,-3,398],
sm243=[0,-2,400,-1,0,-4,0,-10,400,400,-3,400],
sm244=[0,-2,401,-1,0,-4,0,-10,401,401,-3,401],
sm245=[0,-4,0,-4,0,-60,256],
sm246=[0,-4,402,-4,0,-3,403,-57,404],
sm247=[0,-2,253,-1,0,-4,0,-10,405,405,-3,405],
sm248=[0,-4,0,-4,0,-5,406,-2,406,-1,406,-3,406,-37,406,-7,406],
sm249=[0,-4,0,-4,0,-5,407,-2,407,-1,407,407,-2,407,-37,407,-7,407],
sm250=[0,-4,0,-4,0,-60,408],
sm251=[0,-4,0,-4,0,-5,409,-2,409,-1,409,409,-2,409,-30,409,-6,409,-7,409,-48,409,88],
sm252=[0,-4,0,-4,0,-5,410,-2,410,-1,410,410,-2,410,-30,410,-1,90,-4,410,-7,410,-48,410,410],
sm253=[0,-4,0,-4,0,-5,411,-2,411,-1,411,411,-2,411,-30,411,-1,411,-4,411,-7,411,-48,411,411,92],
sm254=[0,-4,0,-4,0,-5,412,-2,412,-1,412,412,-2,412,-30,412,-1,412,-4,412,-7,412,-48,412,412,412,94],
sm255=[0,-4,0,-4,0,-5,413,-2,413,-1,413,413,-2,413,-30,413,-1,413,-4,413,-7,413,-48,413,413,413,413,96,97,98,99],
sm256=[0,-4,0,-4,0,-5,414,-2,414,-1,414,414,-2,414,-15,101,102,103,-5,104,-6,414,-1,414,-4,414,-7,414,-48,414,414,414,414,414,414,414,414,105,106],
sm257=[0,-4,0,-4,0,-5,415,-2,415,-1,415,415,-2,415,-15,101,102,103,-5,104,-6,415,-1,415,-4,415,-7,415,-48,415,415,415,415,415,415,415,415,105,106],
sm258=[0,-4,0,-4,0,-5,416,-2,416,-1,416,416,-2,416,-15,101,102,103,-5,104,-6,416,-1,416,-4,416,-7,416,-48,416,416,416,416,416,416,416,416,105,106],
sm259=[0,-4,0,-4,0,-5,417,-2,417,-1,417,417,-2,417,-15,101,102,103,-5,104,-6,417,-1,417,-4,417,-7,417,-48,417,417,417,417,417,417,417,417,105,106],
sm260=[0,-4,0,-4,0,-5,418,-2,418,-1,418,418,-2,418,-15,418,418,418,-5,418,-6,418,-1,418,-4,418,-7,418,-48,418,418,418,418,418,418,418,418,418,418,108,109,110],
sm261=[0,-4,0,-4,0,-5,419,-2,419,-1,419,419,-2,419,-15,419,419,419,-5,419,-6,419,-1,419,-4,419,-7,419,-48,419,419,419,419,419,419,419,419,419,419,108,109,110],
sm262=[0,-4,0,-4,0,-5,420,-2,420,-1,420,420,-2,420,-15,420,420,420,-5,420,-6,420,-1,420,-4,420,-7,420,-48,420,420,420,420,420,420,420,420,420,420,108,109,110],
sm263=[0,-4,0,-4,0,-5,421,-2,421,-1,421,421,-2,421,-15,421,421,421,-5,421,-6,421,-1,421,-4,421,-7,421,-48,421,421,421,421,421,421,421,421,421,421,108,109,110],
sm264=[0,-4,0,-4,0,-5,422,-2,422,-1,422,422,-2,422,-15,422,422,422,-5,422,-6,422,-1,422,-4,422,-7,422,-48,422,422,422,422,422,422,422,422,422,422,108,109,110],
sm265=[0,-4,0,-4,0,-5,423,-2,423,-1,423,423,-2,423,-15,423,423,423,-5,423,-6,423,-1,423,-4,423,-7,423,-48,423,423,423,423,423,423,423,423,423,423,108,109,110],
sm266=[0,-4,0,-4,0,-5,424,-2,424,-1,424,424,-2,424,-15,424,424,424,-5,424,-4,112,-1,424,-1,424,-4,424,-7,424,-48,424,424,424,424,424,424,424,424,424,424,424,424,424,113],
sm267=[0,-4,0,-4,0,-5,425,-2,425,-1,425,425,-2,425,-15,425,425,425,-5,425,-4,112,-1,425,-1,425,-4,425,-7,425,-48,425,425,425,425,425,425,425,425,425,425,425,425,425,113],
sm268=[0,-4,0,-4,0,-5,426,-2,426,-1,426,426,-2,426,-15,426,426,426,-5,426,-4,112,-1,426,-1,426,-4,426,-7,426,-48,426,426,426,426,426,426,426,426,426,426,426,426,426,113],
sm269=[0,-4,0,-4,0,-5,427,-2,427,-1,427,427,-2,427,-15,427,427,427,-2,115,116,-1,427,-4,427,-1,427,117,427,-4,427,-7,427,-48,427,427,427,427,427,427,427,427,427,427,427,427,427,427],
sm270=[0,-4,0,-4,0,-5,428,-2,428,-1,428,428,-2,428,-15,428,428,428,-2,115,116,-1,428,-4,428,-1,428,117,428,-4,428,-7,428,-48,428,428,428,428,428,428,428,428,428,428,428,428,428,428],
sm271=[0,-4,0,-4,0,-5,429,-2,429,-1,429,429,-2,429,-15,429,429,429,-2,429,429,-1,429,-4,429,-1,429,429,429,-4,429,-7,429,-48,429,429,429,429,429,429,429,429,429,429,429,429,429,429],
sm272=[0,-4,0,-4,0,-5,430,-2,430,-1,430,430,-2,430,-15,430,430,430,-2,430,430,-1,430,-4,430,-1,430,430,430,-4,430,-7,430,-48,430,430,430,430,430,430,430,430,430,430,430,430,430,430],
sm273=[0,-4,0,-4,0,-5,431,-2,431,-1,431,431,-2,431,-15,431,431,431,-2,431,431,-1,431,-4,431,-1,431,431,431,-4,431,-7,431,-48,431,431,431,431,431,431,431,431,431,431,431,431,431,431],
sm274=[0,-4,0,-4,0,-5,432,-2,432,-1,432,432,-2,432,-15,432,432,432,-2,432,432,-1,432,-4,432,-1,432,432,432,-4,432,-7,432,-48,432,432,432,432,432,432,432,432,432,432,432,432,432,432],
sm275=[0,-4,0,-4,0,-5,433,-2,433,433,433,433,-2,433,-15,433,433,433,433,-1,433,433,-1,433,-4,433,-1,433,433,433,-1,433,-1,433,433,433,-1,433,-4,433,433,-13,433,-23,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,-4,433,433],
sm276=[0,-1,2,57,-1,0,-4,0,-8,434,122,-33,8,9,-6,123,435,-8,16,-3,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm277=[0,-4,0,-4,0,-8,436,-43,437],
sm278=[0,-1,438,438,-1,0,-4,0,-8,438,438,-33,438,438,-6,438,438,-8,438,-3,438,438,-9,438,-17,438,438,-1,438,438,-23,438,-1,438,438,438,438,438,438,438,438,438,-23,438,438],
sm279=[0,-4,0,-4,0,-8,439,-43,439],
sm280=[0,-4,0,-4,0,-5,440,-2,440,440,440,440,-2,440,-15,440,440,440,440,-1,440,440,-1,440,-4,440,-1,440,440,440,-1,440,-1,440,440,440,-1,440,-4,440,440,-13,440,-23,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,-4,440,440],
sm281=[0,-4,0,-4,0,-8,441,-2,442],
sm282=[0,-4,0,-4,0,-8,443,-2,443],
sm283=[0,-4,0,-4,0,-8,444,-2,444],
sm284=[0,-4,0,-4,0,-8,444,-2,444,-21,310],
sm285=[0,-4,0,-4,0,-60,445,446],
sm286=[0,-4,0,-4,0,-8,140,-2,140,-21,140,-26,447,447],
sm287=[0,-1,2,57,-1,0,-4,0,-51,273,-104,48,49],
sm288=[0,-4,0,-4,0,-60,448,448],
sm289=[0,-4,0,-4,0,-60,447,447],
sm290=[0,-4,0,-4,0,-5,449,-2,449,449,449,449,-2,449,-15,449,449,449,449,-1,449,449,-1,449,-4,449,-1,449,449,449,-1,449,-1,449,449,449,-1,449,-4,449,449,-13,449,-23,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,449,-4,449,449],
sm291=[0,-4,0,-4,0,-8,64,-43,450],
sm292=[0,-4,0,-4,0,-5,451,-2,451,451,451,451,-2,451,-15,451,451,451,451,-1,451,451,-1,451,-4,451,-1,451,451,451,-1,451,-1,451,451,451,-1,451,-4,451,451,-13,451,-23,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,-4,451,451],
sm293=[0,-4,0,-4,0,-8,452,-5,453],
sm294=[0,-4,0,-4,0,-8,454,-5,454],
sm295=[0,-4,0,-4,0,-8,64,-43,455],
sm296=[0,-4,0,-4,0,-5,456,-2,456,456,456,456,-2,456,-15,456,456,456,456,-1,456,456,-1,456,-4,456,-1,456,456,456,-1,456,-1,456,456,456,-1,456,-4,456,456,-13,456,-23,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,-4,456,456],
sm297=[0,-4,0,-4,0,-5,457,-2,457,457,457,457,-2,457,-15,457,457,457,457,-1,457,457,-1,457,-4,457,-1,457,457,457,-1,457,-1,457,457,457,-1,457,-4,457,457,-13,457,-23,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,-4,457,457],
sm298=[0,-4,0,-4,0,-5,458,-2,458,458,458,458,-2,458,-15,458,458,458,458,-1,458,458,-1,458,-4,458,-1,458,458,458,-1,458,-1,458,458,458,-1,458,-4,458,458,-13,458,-23,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-4,458,458],
sm299=[0,-2,459,-12,459,-2,459,459,459,459,-2,459,-15,459,459,459,459,-1,459,459,-1,459,-4,459,-1,459,459,459,-1,459,-1,459,459,459,-1,459,-4,459,459,-13,459,-23,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,-4,459,459,-26,459,459],
sm300=[0,-2,460,-1,460,-8,460,-152,460,460],
sm301=[0,-4,0,-4,0,-5,461,-2,461,461,461,461,-2,461,-15,461,461,461,461,-1,461,461,-1,461,-4,461,-1,461,461,461,-1,461,-1,461,461,461,-1,461,-4,461,461,-13,461,-13,461,-9,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-4,461,461],
sm302=[0,-1,2,57,-1,0,-4,0,-9,122,-4,462,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-1,463,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm303=[0,-4,0,-4,0,-14,464],
sm304=[0,-4,0,-4,0,-14,465],
sm305=[0,-4,0,-4,0,-5,466,-2,466,466,466,466,-2,466,-15,466,466,466,466,-1,466,466,-1,466,-4,466,-1,466,466,466,-1,466,-1,466,466,466,-1,466,-4,466,466,-13,466,-23,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,466,-4,466,466],
sm306=[0,-4,0,-4,0,-8,64,-43,467],
sm307=[0,-4,0,-4,0,-5,468,-2,468,-1,468,468,-2,468,-37,468,-7,468],
sm308=[0,-4,0,-4,0,-5,469,-2,469,-1,469,469,-2,469,-37,469,-7,469],
sm309=[0,470,470,470,-1,0,-4,0,-9,470,470,470,-18,470,-12,470,470,-6,470,-9,470,-2,470,470,470,470,-1,470,470,470,470,470,470,-1,470,470,470,470,470,470,470,470,470,-2,470,470,-5,470,470,-2,470,-23,470,-1,470,470,470,470,470,470,470,470,470,-23,470,470],
sm310=[0,471,471,471,-1,0,-4,0,-9,471,471,471,-18,471,-12,471,471,-6,471,-9,471,-2,471,471,471,471,-1,471,471,471,471,471,471,-1,471,471,471,471,471,471,471,471,471,-2,471,471,-5,471,471,-2,471,-23,471,-1,471,471,471,471,471,471,471,471,471,-23,471,471],
sm311=[0,472,472,472,-1,0,-4,0,-9,472,472,472,-18,472,-12,472,472,-6,472,-9,472,-2,472,472,472,472,-1,472,472,472,472,472,472,-1,472,472,472,472,472,472,472,472,472,-2,472,472,-5,472,472,-2,472,-23,472,-1,472,472,472,472,472,472,472,472,472,-23,472,472],
sm312=[0,-4,0,-4,0,-8,473,-1,473],
sm313=[0,-4,0,-4,0,-8,474,-2,474,-2,474,-18,474,-4,474,-13,474,-22,474],
sm314=[0,-4,0,-4,0,-11,475],
sm315=[0,-4,0,-4,0,-8,476,-2,477],
sm316=[0,-4,0,-4,0,-8,478,-2,478],
sm317=[0,-4,0,-4,0,-8,479,-2,479],
sm318=[0,-4,0,-4,0,-60,480],
sm319=[0,-4,0,-4,0,-8,481,-2,481,-2,481,-18,310,-18,481],
sm320=[0,-4,0,-4,0,-8,482,-2,482,-2,482,-18,482,-4,482,-13,482,-22,482],
sm321=[0,-2,57,-1,0,-4,0,-8,434,160,-41,161,483,-44,315],
sm322=[0,-4,0,-4,0,-52,484],
sm323=[0,-4,0,-4,0,-8,485,-43,486],
sm324=[0,-4,0,-4,0,-8,487,-43,487],
sm325=[0,-4,0,-4,0,-8,488,-43,488],
sm326=[0,-4,0,-4,0,-8,489,-2,489,-2,489,-37,489],
sm327=[0,-4,0,-4,0,-8,489,-2,489,-2,489,-18,310,-18,489],
sm328=[0,-4,0,-4,0,-8,64,-5,490],
sm329=[0,-4,0,-4,0,-61,491],
sm330=[0,-4,0,-4,0,-8,64,-5,492],
sm331=[0,-4,0,-4,0,-8,64,-1,493],
sm332=[0,-1,2,57,-1,0,-4,0,-9,122,494,-32,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm333=[0,-1,2,57,-1,0,-4,0,-9,122,495,-32,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm334=[0,-4,0,-4,0,-8,68,-1,68,-19,68,68,68,69,-1,68,68,-1,496,-4,68,-1,68,68,68,-5,70,-1,71,-19,497,-23,72,73,74,75,76,77,78,79,80,81,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
sm335=[0,-4,0,-4,0,-38,498,-36,499],
sm336=[0,-1,2,57,-1,0,-4,0,-9,122,-41,123,-9,16,-3,17,18,19,-6,500,-13,34,-5,35,36,-2,37,-31,45,46,47,-23,48,49],
sm337=[0,-4,0,-4,0,-8,64,-5,501],
sm338=[0,502,502,502,-1,0,-4,0,-9,502,502,502,-18,502,-12,502,502,-6,502,-9,502,-2,502,502,502,502,-1,502,502,502,502,502,502,-1,502,502,502,502,502,502,502,502,502,-2,502,502,-5,502,502,-2,502,-23,502,-1,502,502,502,502,502,502,502,502,502,-23,502,502],
sm339=[0,503,503,503,-1,0,-4,0,-9,503,503,503,-18,503,-12,503,503,-6,503,-9,503,-2,503,503,503,503,-1,503,503,503,503,503,503,-1,503,503,503,503,503,503,503,503,503,-2,503,503,-5,503,503,-2,503,-23,503,-1,503,503,503,503,503,503,503,503,503,-23,503,503],
sm340=[0,504,504,504,-1,0,-4,0,-9,504,504,504,-18,504,-12,504,504,-6,504,-9,504,-2,504,504,504,504,-1,504,504,504,504,504,504,-1,504,504,504,504,504,504,504,504,504,-2,504,504,-5,504,504,-2,504,-23,504,-1,504,504,504,504,504,504,504,504,504,-23,504,504],
sm341=[0,-4,0,-4,0,-8,64,-5,505],
sm342=[0,506,506,506,-1,0,-4,0,-9,506,506,506,-18,506,-12,506,506,-6,506,-9,506,-2,506,506,506,506,-1,506,506,506,506,506,506,-1,506,506,506,506,506,506,506,506,506,-2,506,506,-5,506,506,-2,506,-23,506,-1,506,506,506,506,506,506,506,506,506,-23,506,506],
sm343=[0,507,507,507,-1,0,-4,0,-9,507,507,507,-18,507,-12,507,507,-6,507,-9,507,-2,507,507,507,507,-1,507,507,507,507,507,507,-1,507,507,507,507,507,507,507,507,507,-1,328,507,507,-5,507,507,-2,507,-23,507,-1,507,507,507,507,507,507,507,507,507,-23,507,507],
sm344=[0,508,508,508,-1,0,-4,0,-9,508,508,508,-18,508,-12,508,508,-6,508,-9,508,-2,508,508,508,508,-1,508,508,508,508,508,508,-1,508,508,508,508,508,508,508,508,508,-2,508,508,-5,508,508,-2,508,-23,508,-1,508,508,508,508,508,508,508,508,508,-23,508,508],
sm345=[0,-4,0,-4,0,-61,509],
sm346=[0,-2,340,-1,0,-4,0,-31,340,-3,340,-120,340,340],
sm347=[0,-2,334,-1,0,-4,0,-31,510,-3,511,-120,336,337],
sm348=[0,-2,512,-1,0,-4,0,-31,512,-3,512,-120,512,512],
sm349=[0,-2,513,-1,0,-4,0,-31,513,-1,514,-1,513,-120,513,513],
sm350=[0,-2,515,-1,0,-4,0],
sm351=[0,-2,516,-1,0,-4,0],
sm352=[0,-2,517,-1,0,-4,0,-31,517,-1,517,-1,517,-120,517,517],
sm353=[0,-2,334,-1,0,-4,0,-31,518,-3,519,-120,336,337],
sm354=[0,-2,334,-1,0,-4,0,-31,520,-124,336,337],
sm355=[0,-2,334,-1,0,-4,0,-31,521,-124,336,337],
sm356=[0,-2,522,-1,522,-3,522,522,-3,522,522,-25,522,-102,522],
sm357=[0,-2,523,-1,523,-3,523,523,-3,523,523,-25,523,523,-101,523],
sm358=[0,-2,334,-1,0,-4,0,-31,524,-3,525,-120,336,337],
sm359=[0,526,526,526,-1,0,-4,0,-5,526,-2,526,526,526,526,-2,526,-15,526,526,526,526,-1,526,526,-1,526,-4,526,526,526,526,526,-1,526,-1,526,526,526,-1,526,-4,526,526,-2,526,526,526,526,-1,526,-1,526,526,526,526,526,526,526,526,526,526,526,526,526,526,-2,526,526,-5,526,526,-2,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,526,-23,526,526],
sm360=[0,-1,2,57,-1,0,-4,0,-10,346,527,-39,273,-39,348,274,275,-62,48,49],
sm361=[0,-4,0,-4,0,-11,528],
sm362=[0,529,529,529,-1,0,-4,0,-5,529,-2,529,529,529,529,-2,529,-15,529,529,529,529,-1,529,529,-1,529,-4,529,529,529,529,529,-1,529,-1,529,529,529,-1,529,-4,529,529,-2,529,529,529,529,-1,529,-1,529,529,529,529,529,529,529,529,529,529,529,529,529,529,-2,529,529,-5,529,529,-2,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,529,-23,529,529],
sm363=[0,-1,2,57,-1,0,-4,0,-10,346,530,-39,273,-39,348,274,275,-62,48,49],
sm364=[0,-1,531,531,-1,0,-4,0,-10,531,531,-39,531,-39,531,531,531,-62,531,531],
sm365=[0,-1,532,532,-1,0,-4,0,-10,532,532,-39,532,-39,532,532,532,-62,532,532],
sm366=[0,-1,2,57,-1,0,-4,0,-51,273,-40,274,275,-62,48,49],
sm367=[0,-4,0,-4,0,-61,446],
sm368=[0,-4,0,-4,0,-61,447],
sm369=[0,-4,0,-4,0,-9,533],
sm370=[0,-4,0,-4,0,-14,534],
sm371=[0,-4,0,-4,0,-14,535],
sm372=[0,-4,0,-4,0,-8,536,-5,535],
sm373=[0,-4,0,-4,0,-14,537],
sm374=[0,-4,0,-4,0,-8,538,-5,538],
sm375=[0,-4,0,-4,0,-8,539,-5,539],
sm376=[0,540,540,540,-1,0,-4,0,-9,540,540,540,-18,540,-12,540,540,-6,540,-9,540,-2,540,540,540,540,-1,540,-1,540,540,540,540,-1,540,540,540,540,540,540,540,540,540,-2,540,540,-5,540,540,-2,540,-23,540,-1,540,540,540,540,540,540,540,540,540,-23,540,540],
sm377=[0,-4,0,-4,0,-8,541,-1,541],
sm378=[0,-4,542,-4,0,-40,359,-115,360,361],
sm379=[0,543,-1,362,-1,0,-4,0,-9,543,543,-2,544,-1,543,-7,363,-2,364,-3,543,-15,543,543,543,543,-1,543,-8,543,365],
sm380=[0,-4,545,-4,0,-40,545,-115,545,545],
sm381=[0,546,-1,546,-1,0,-4,0,-9,546,546,-2,546,-1,546,-7,546,-2,546,-3,546,-15,546,546,546,546,-1,546,-8,546,546],
sm382=[0,-4,0,-4,0,-3,547],
sm383=[0,-4,0,-4,0,-61,548],
sm384=[0,-4,0,-4,0,-8,549,550],
sm385=[0,551,-1,551,-1,0,-4,0,-8,551,551,551,-4,551,-14,551,-15,551,551,551,551,-1,551,-8,551],
sm386=[0,552,-1,552,-1,0,-4,0,-8,552,552,552,-4,552,-14,552,-15,552,552,552,552,-1,552,-8,552],
sm387=[0,-2,553,-1,0,-4,0],
sm388=[0,552,-1,552,-1,0,-4,0,-8,552,552,552,-4,552,-5,554,-8,552,-15,552,552,552,552,-1,552,-8,552],
sm389=[0,555,-1,555,-1,0,-4,0,-8,555,555,555,-3,555,555,-14,555,-15,555,555,555,555,-1,555,-8,555],
sm390=[0,556,-1,556,-1,0,-4,0,-8,556,556,556,-3,556,556,-14,556,-15,556,556,556,556,-1,556,-8,556],
sm391=[0,556,-1,556,-1,0,-4,0,-8,556,556,556,-3,556,556,-5,557,558,-7,556,-15,556,556,556,556,-1,556,-8,556],
sm392=[0,-2,367,-1,0,-4,0,-61,365],
sm393=[0,-1,559,560,-1,0,-4,0,-23,561,-37,365],
sm394=[0,562,-1,562,-1,0,-4,0,-8,562,562,562,-3,562,562,-5,562,562,-7,562,-15,562,562,562,562,-1,562,-8,562],
sm395=[0,563,-1,563,-1,0,-4,0,-8,563,563,563,-4,563,-5,563,-8,563,-15,563,563,563,563,-1,563,-8,563,564],
sm396=[0,-2,565,-1,0,-4,0],
sm397=[0,-4,0,-4,0,-9,566],
sm398=[0,-4,0,-4,0,-9,567],
sm399=[0,-4,0,-4,0,-9,568],
sm400=[0,-2,367,-1,0,-3,368,0,-61,370],
sm401=[0,-4,0,-4,0,-9,569,-4,569,-6,570,571],
sm402=[0,-2,572,-1,0,-3,368,0,-23,369,-37,370],
sm403=[0,-4,0,-4,0,-9,573,-4,573,-6,573,573],
sm404=[0,-4,0,-4,0,-9,574,-4,574,-6,574,574],
sm405=[0,-4,0,-4,0,-61,575],
sm406=[0,-4,0,-4,0,-61,564],
sm407=[0,-2,253,-1,0,-4,0,-10,576,577,-3,6],
sm408=[0,-4,0,-4,0,-8,578,578],
sm409=[0,-2,579,-1,0,-4,0,-8,579,579,-4,579,-16,579,-11,579,579,579,579,579,579,579,-1,579,-8,579],
sm410=[0,-2,580,-1,0,-4,0,-8,580,580,-4,580,-16,580,-11,580,580,580,580,580,580,580,-1,580,-8,580],
sm411=[0,-2,581,-1,0,-4,0,-8,581,581,-4,581,-16,581,-11,581,581,581,581,581,581,581,-1,581,-8,232],
sm412=[0,-2,582,-1,0,-4,0,-8,582,582,-4,582,-16,582,-11,582,582,582,582,582,582,582,-1,582,-8,582],
sm413=[0,-2,583,584,0,-4,0],
sm414=[0,-4,0,-4,0,-33,585],
sm415=[0,-2,586,586,0,-4,0],
sm416=[0,-2,587,-1,0,-4,0,-8,587,587,-4,587,-16,587,-11,587,587,587,587,587,587,587,-1,587,-8,587],
sm417=[0,-2,588,-1,0,-4,0,-8,588,588,-4,588,-16,588,-11,588,588,588,588,588,588,588,-1,588,-8,588],
sm418=[0,589,-1,589,-1,0,-4,0,-9,589,-1,589,-3,589,-14,589,-15,589,589,589,589,-1,589,-8,589],
sm419=[0,-2,253,-1,0,-4,0,-10,590,590,-3,590],
sm420=[0,-2,591,-1,402,-4,0,-3,403,-6,591,591,-2,591,591,-45,404,-65,592],
sm421=[0,-2,593,-1,402,-4,0,-3,403,-6,593,593,-2,593,593,-45,593,-65,593],
sm422=[0,-2,594,-1,594,-4,0,-3,594,-6,594,594,-2,594,594,-45,594,-65,594],
sm423=[0,-2,595,-1,595,-4,0,-3,595,-6,595,595,-2,595,595,-45,595,-65,595],
sm424=[0,-2,596,-1,0,-4,0,-10,596,596,-3,596],
sm425=[0,-4,0,-4,0,-5,597,-2,597,597,597,597,-2,597,-15,597,597,597,597,-1,597,597,-1,597,-4,597,-1,597,597,597,-1,597,-1,597,597,597,-1,597,-4,597,597,-13,597,-23,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,-4,597,597],
sm426=[0,-1,598,598,-1,0,-4,0,-8,598,598,-33,598,598,-6,598,598,-8,598,-3,598,598,-9,598,-17,598,598,-1,598,598,-23,598,-1,598,598,598,598,598,598,598,598,598,-23,598,598],
sm427=[0,-4,0,-4,0,-8,599,-43,599],
sm428=[0,-4,0,-4,0,-5,600,-2,600,600,600,600,-2,600,-15,600,600,600,600,-1,600,600,-1,600,-4,600,-1,600,600,600,-1,600,-1,600,600,600,-1,600,-4,600,600,-13,600,-23,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,-4,600,600],
sm429=[0,-4,0,-4,0,-8,434,-43,601],
sm430=[0,-1,2,57,-1,0,-4,0,-8,269,122,-33,8,9,-6,123,438,-8,16,-3,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm431=[0,-4,0,-4,0,-8,602,-43,602],
sm432=[0,-4,0,-4,0,-5,603,-2,603,603,603,603,-2,603,-15,603,603,603,603,-1,603,603,-1,603,-4,603,-1,603,603,603,-1,603,-1,603,603,603,-1,603,-4,603,603,-13,603,-23,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,603,-4,603,603],
sm433=[0,-1,2,57,-1,0,-4,0,-11,604,-39,273,-40,274,275,-3,276,-58,48,49],
sm434=[0,-4,0,-4,0,-8,605,-2,605],
sm435=[0,-4,0,-4,0,-8,606,-2,606],
sm436=[0,-4,0,-4,0,-61,607],
sm437=[0,-4,0,-4,0,-61,608],
sm438=[0,-4,0,-4,0,-52,609],
sm439=[0,-4,0,-4,0,-5,610,-2,610,610,610,610,-2,610,-15,610,610,610,610,-1,610,610,-1,610,-4,610,-1,610,610,610,-1,610,-1,610,610,610,-1,610,-4,610,610,-13,610,-23,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,610,-4,610,610],
sm440=[0,-4,0,-4,0,-5,611,-2,611,611,611,611,-2,611,-15,611,611,611,611,-1,611,611,-1,611,-4,611,-1,611,611,611,-1,611,-1,611,611,611,-1,611,-4,611,611,-13,611,-23,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,-4,611,611],
sm441=[0,-1,2,57,-1,0,-4,0,-9,122,-4,612,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-1,613,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm442=[0,-4,0,-4,0,-8,614,-5,614],
sm443=[0,-4,0,-4,0,-5,615,-2,615,615,615,615,-2,615,-15,615,615,615,615,-1,615,615,-1,615,-4,615,-1,615,615,615,-1,615,-1,615,615,615,-1,615,-4,615,615,-13,615,-23,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,-4,615,615],
sm444=[0,-4,0,-4,0,-5,616,-2,616,616,616,616,-2,616,-15,616,616,616,616,-1,616,616,-1,616,-4,616,-1,616,616,616,-1,616,-1,616,616,616,-1,616,-4,616,616,-13,616,-13,616,-9,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,-4,616,616],
sm445=[0,-4,0,-4,0,-5,617,-2,617,617,617,617,-2,617,-15,617,617,617,617,-1,617,617,-1,617,-4,617,-1,617,617,617,-1,617,-1,617,617,617,-1,617,-4,617,617,-13,617,-13,617,-9,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,-4,617,617],
sm446=[0,-4,0,-4,0,-5,618,-2,618,618,618,618,-2,618,-15,618,618,618,618,-1,618,618,-1,618,-4,618,-1,618,618,618,-1,618,-1,618,618,618,-1,618,-4,618,618,-13,618,-23,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,-4,618,618],
sm447=[0,-4,0,-4,0,-11,619],
sm448=[0,-1,2,57,-1,0,-4,0,-9,58,5,620,-18,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm449=[0,-4,0,-4,0,-8,621,-1,621],
sm450=[0,-4,0,-4,0,-8,622,-1,622,622,-2,622,-37,622],
sm451=[0,-4,0,-4,0,-8,623,-2,623,-2,623,-18,623,-4,623,-13,623,-22,623],
sm452=[0,-1,2,57,-1,0,-4,0,-11,624,-39,273,-45,313,-58,48,49],
sm453=[0,-4,0,-4,0,-11,625],
sm454=[0,-4,0,-4,0,-8,626,-2,626,-2,626,-37,626],
sm455=[0,-4,0,-4,0,-52,627],
sm456=[0,-4,0,-4,0,-8,628,-2,628,-2,628,-18,628,-4,628,-13,628,-22,628],
sm457=[0,-4,0,-4,0,-8,629,-43,629],
sm458=[0,-2,57,-1,0,-4,0,-8,269,160,-41,161,630,-44,315],
sm459=[0,-4,0,-4,0,-14,631,-37,631],
sm460=[0,-4,0,-4,0,-8,632,-2,632,-2,632,-37,632],
sm461=[0,-1,2,57,-1,0,-4,0,-9,122,633,-32,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm462=[0,-4,0,-4,0,-8,64,-1,634],
sm463=[0,-1,2,57,-1,0,-4,0,-9,122,-4,635,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm464=[0,-4,0,-4,0,-8,306,-1,636],
sm465=[0,-4,0,-4,0,-38,637,-36,638],
sm466=[0,-4,0,-4,0,-8,309,-1,309,-22,310,-4,639,-36,639],
sm467=[0,-4,0,-4,0,-33,310,-4,639,-36,639],
sm468=[0,-4,0,-4,0,-8,64,-1,640],
sm469=[0,-1,2,57,-1,0,-4,0,-9,122,-4,641,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm470=[0,-4,0,-4,0,-38,642,-36,642],
sm471=[0,-4,0,-4,0,-75,643],
sm472=[0,-4,0,-4,0,-75,644],
sm473=[0,-4,0,-4,0,-9,645],
sm474=[0,646,646,646,-1,0,-4,0,-9,646,646,646,-18,646,-12,646,646,-6,646,-9,646,-2,646,646,646,646,-1,646,646,646,646,646,646,-1,646,646,646,646,646,646,646,646,646,-2,646,646,-5,646,646,-2,646,-23,646,-1,646,646,646,646,646,646,646,646,646,-23,646,646],
sm475=[0,647,647,647,-1,0,-4,0,-9,647,647,647,-18,647,-12,647,647,-6,647,-9,647,-2,647,647,647,647,-1,647,647,647,647,647,647,-1,647,647,647,647,647,647,647,647,647,-2,647,647,-5,647,647,-2,647,-23,647,-1,647,647,647,647,647,647,647,647,647,-23,647,647],
sm476=[0,-2,338,-1,178,-3,179,180,-3,181,648,-25,649,-102,650],
sm477=[0,-4,0,-4,0,-31,651],
sm478=[0,-2,652,-1,0,-4,0,-31,652,-3,652,-120,652,652],
sm479=[0,-2,653,-1,0,-4,0,-4,648,-151,654,49],
sm480=[0,-4,0,-4,0,-157,655],
sm481=[0,-4,0,-4,0,-156,656],
sm482=[0,657,-1,657,-1,657,-3,657,657,-3,657,657,-5,657,-19,657,-102,658],
sm483=[0,-4,0,-4,0,-31,659],
sm484=[0,-2,213,-1,0,-4,0,-9,214,-5,6,-14,1,-15,10,11,12,13,-1,14,-8,15],
sm485=[0,-4,0,-4,0,-31,660],
sm486=[0,-4,0,-4,0,-30,661],
sm487=[0,-4,0,-4,0,-11,662],
sm488=[0,663,663,663,-1,0,-4,0,-5,663,-2,663,663,663,663,-2,663,-15,663,663,663,663,-1,663,663,-1,663,-4,663,663,663,663,663,-1,663,-1,663,663,663,-1,663,-4,663,663,-2,663,663,663,663,-1,663,-1,663,663,663,663,663,663,663,663,663,663,663,663,663,663,-2,663,663,-5,663,663,-2,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,663,-23,663,663],
sm489=[0,664,664,664,-1,0,-4,0,-5,664,-2,664,664,664,664,-2,664,-15,664,664,664,664,-1,664,664,-1,664,-4,664,664,664,664,664,-1,664,-1,664,664,664,-1,664,-4,664,664,-2,664,664,664,664,-1,664,-1,664,664,664,664,664,664,664,664,664,664,664,664,664,664,-2,664,664,-5,664,664,-2,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,664,-23,664,664],
sm490=[0,-1,665,665,-1,0,-4,0,-10,665,665,-39,665,-39,665,665,665,-62,665,665],
sm491=[0,-1,666,666,-1,0,-4,0,-10,666,666,-39,666,-39,666,666,666,-62,666,666],
sm492=[0,-4,0,-4,0,-9,667],
sm493=[0,-2,57,-1,0,-4,0,-9,160,-4,668,-36,161,-45,315],
sm494=[0,-4,0,-4,0,-14,669],
sm495=[0,-4,0,-4,0,-8,670,-1,670],
sm496=[0,671,-1,362,-1,0,-4,0,-9,671,671,-2,544,-1,671,-7,363,-2,364,-3,671,-15,671,671,671,671,-1,671,-8,671,365],
sm497=[0,-4,672,-4,0,-40,672,-115,672,672],
sm498=[0,671,-1,362,-1,0,-4,0,-9,671,671,-4,671,-7,363,-2,364,-3,671,-15,671,671,671,671,-1,671,-8,671,365],
sm499=[0,671,-1,671,-1,0,-4,0,-8,549,671,671,-4,671,-14,671,-15,671,671,671,671,-1,671,-8,671],
sm500=[0,-4,0,-4,0,-61,673],
sm501=[0,-4,0,-4,0,-3,674,-152,675],
sm502=[0,-4,0,-4,0,-3,676,-152,676,676],
sm503=[0,-4,0,-4,0,-3,674,-153,677],
sm504=[0,-4,0,-4,0,-156,360,361],
sm505=[0,-2,213,-1,0,-4,0,-9,214,-1,678,-34,10,11,12,13,-1,14,-8,15],
sm506=[0,679,-1,679,-1,0,-4,0,-8,679,679,679,-4,679,-5,554,-8,679,-15,679,679,679,679,-1,679,-8,679],
sm507=[0,563,-1,563,-1,0,-4,0,-8,563,563,563,-4,563,-5,563,-8,563,-15,563,563,563,563,-1,563,-8,563],
sm508=[0,679,-1,679,-1,0,-4,0,-8,679,679,679,-4,679,-14,679,-15,679,679,679,679,-1,679,-8,679],
sm509=[0,-2,367,-1,0,-4,0,-23,561,-37,365],
sm510=[0,680,-1,680,-1,0,-4,0,-8,680,680,680,-3,680,680,-5,557,-8,680,-15,680,680,680,680,-1,680,-8,680],
sm511=[0,681,-1,681,-1,0,-4,0,-8,681,681,681,-3,681,681,-6,558,-7,681,-15,681,681,681,681,-1,681,-8,681],
sm512=[0,682,-1,682,-1,0,-4,0,-8,682,682,682,-3,682,682,-5,682,-8,682,-15,682,682,682,682,-1,682,-8,682],
sm513=[0,683,-1,683,-1,0,-4,0,-8,683,683,683,-3,683,683,-6,683,-7,683,-15,683,683,683,683,-1,683,-8,683],
sm514=[0,684,-1,684,-1,0,-4,0,-8,684,684,684,-3,684,684,-14,684,-15,684,684,684,684,-1,684,-8,684],
sm515=[0,-4,0,-4,0,-14,685],
sm516=[0,-4,0,-4,0,-14,686],
sm517=[0,-4,687,-4,0,-3,688,-10,689,-15,690,690,690,690,-26,690,564],
sm518=[0,-4,0,-4,0,-14,691],
sm519=[0,-4,0,-4,0,-30,692,693,694,695,-26,696],
sm520=[0,-4,0,-4,0,-30,697,698,699,700],
sm521=[0,-4,0,-4,0,-14,701,-15,701,701,701,701,-1,702,-1,703,704,705],
sm522=[0,-4,0,-4,0,-14,701,-15,701,701,701,701],
sm523=[0,-4,706,-4,0,-3,707,-10,708],
sm524=[0,-1,709,-2,0,-4,0,-19,710,711],
sm525=[0,-4,0,-4,0,-9,712,-4,712],
sm526=[0,-4,0,-4,0,-9,712,-4,712,-6,570],
sm527=[0,-4,0,-4,0,-9,712,-4,712,-7,571],
sm528=[0,-4,0,-4,0,-9,713,-4,713,-6,713],
sm529=[0,-4,0,-4,0,-9,714,-4,714,-7,714],
sm530=[0,-4,0,-4,0,-14,715],
sm531=[0,-4,0,-4,0,-14,716],
sm532=[0,-4,687,-4,0,-3,688,-10,689,-45,256,564],
sm533=[0,-4,0,-4,0,-11,717],
sm534=[0,-4,0,-4,0,-52,718,-3,719,720],
sm535=[0,-4,0,-4,0,-52,721,-3,721,721],
sm536=[0,-2,722,722,0,-4,0],
sm537=[0,-4,0,-4,0,-14,723],
sm538=[0,-2,724,-1,0,-4,0,-10,724,724,-3,724],
sm539=[0,-2,725,-1,0,-4,0,-10,725,725,-2,725,725],
sm540=[0,-2,726,-1,402,-4,0,-3,403,-6,726,726,-2,726,726,-45,404,-65,726],
sm541=[0,-4,0,-4,0,-59,727],
sm542=[0,-2,728,-1,728,-4,0,-3,728,-6,728,728,-2,728,728,-45,728,-65,728],
sm543=[0,-4,402,-4,0,-3,403,-10,729,-46,404],
sm544=[0,-4,0,-4,0,-5,730,-2,730,-1,730,730,-2,730,-37,730,-7,730],
sm545=[0,-4,0,-4,0,-5,731,-2,731,731,731,731,-2,731,-15,731,731,731,731,-1,731,731,-1,731,-4,731,-1,731,731,731,-1,731,-1,731,731,731,-1,731,-4,731,731,-13,731,-23,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,731,-4,731,731],
sm546=[0,-4,0,-4,0,-8,732,-43,732],
sm547=[0,-1,2,57,-1,0,-4,0,-8,434,122,-33,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm548=[0,-4,0,-4,0,-5,733,-2,733,733,733,733,-2,733,-15,733,733,733,733,-1,733,733,-1,733,-4,733,-1,733,733,733,-1,733,-1,733,733,733,-1,733,-4,733,733,-13,733,-23,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,733,-4,733,733],
sm549=[0,-4,0,-4,0,-8,734,-2,734],
sm550=[0,-4,0,-4,0,-8,735,-2,735],
sm551=[0,-4,0,-4,0,-14,736],
sm552=[0,-4,0,-4,0,-14,737],
sm553=[0,-4,0,-4,0,-14,738],
sm554=[0,-4,0,-4,0,-60,739,739],
sm555=[0,-4,0,-4,0,-5,740,-2,740,740,740,740,-2,740,-15,740,740,740,740,-1,740,740,-1,740,-4,740,-1,740,740,740,-1,740,-1,740,740,740,-1,740,-4,740,740,-13,740,-23,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,-4,740,740],
sm556=[0,-4,0,-4,0,-8,741,-5,741],
sm557=[0,-4,0,-4,0,-14,742],
sm558=[0,-4,0,-4,0,-14,743],
sm559=[0,-4,0,-4,0,-5,744,-2,744,-1,744,744,-2,744,-37,744,-7,744],
sm560=[0,-4,0,-4,0,-11,745],
sm561=[0,-4,0,-4,0,-8,746,-2,746,-2,746,-18,746,-4,746,-13,746,-22,746],
sm562=[0,-4,0,-4,0,-8,747,-2,747],
sm563=[0,-4,0,-4,0,-8,748,-2,748],
sm564=[0,-4,0,-4,0,-8,749,-2,749,-2,749,-18,749,-4,749,-13,749,-22,749],
sm565=[0,-2,57,-1,0,-4,0,-8,434,160,-41,161,750,-44,315],
sm566=[0,-4,0,-4,0,-52,751],
sm567=[0,-4,0,-4,0,-8,752,-43,752],
sm568=[0,753,753,753,-1,0,-4,0,-9,753,753,753,-18,753,-12,753,753,-6,753,-9,753,-2,753,753,753,753,-1,753,754,753,753,753,753,-1,753,753,753,753,753,753,753,753,753,-2,753,753,-5,753,753,-2,753,-23,753,-1,753,753,753,753,753,753,753,753,753,-23,753,753],
sm569=[0,-4,0,-4,0,-8,64,-5,755],
sm570=[0,756,756,756,-1,0,-4,0,-9,756,756,756,-18,756,-12,756,756,-6,756,-9,756,-2,756,756,756,756,-1,756,756,756,756,756,756,-1,756,756,756,756,756,756,756,756,756,-2,756,756,-5,756,756,-2,756,-23,756,-1,756,756,756,756,756,756,756,756,756,-23,756,756],
sm571=[0,-4,0,-4,0,-8,64,-1,757],
sm572=[0,-1,2,57,-1,0,-4,0,-9,122,-4,758,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm573=[0,-4,0,-4,0,-8,64,-5,759],
sm574=[0,-1,2,57,-1,0,-4,0,-9,122,760,-32,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm575=[0,-1,2,57,-1,0,-4,0,-9,122,-4,761,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm576=[0,-4,0,-4,0,-8,64,-5,762],
sm577=[0,-4,0,-4,0,-8,64,-5,763],
sm578=[0,-4,0,-4,0,-14,764],
sm579=[0,-4,0,-4,0,-8,64,-5,765],
sm580=[0,-4,0,-4,0,-14,766],
sm581=[0,-4,0,-4,0,-75,767],
sm582=[0,-4,0,-4,0,-75,639],
sm583=[0,768,768,768,-1,0,-4,0,-9,768,768,768,-18,768,-12,768,768,-6,768,-9,768,-2,768,768,768,768,-1,768,768,768,768,768,768,-1,768,768,768,768,768,768,768,768,768,-2,768,768,-5,768,768,-2,768,-23,768,-1,768,768,768,768,768,768,768,768,768,-23,768,768],
sm584=[0,-4,0,-4,0,-11,769,-52,770,-18,771],
sm585=[0,772,772,772,-1,0,-4,0,-9,772,772,772,-18,772,-12,772,772,-6,772,-9,772,-2,772,772,772,772,-1,772,772,772,772,772,772,-1,772,772,772,772,772,772,772,772,772,-2,772,772,-5,772,772,-2,772,-23,772,-1,772,772,772,772,772,772,772,772,772,-23,772,772],
sm586=[0,-4,0,-4,0,-14,773],
sm587=[0,-4,0,-4,0,-14,774],
sm588=[0,-2,338,-1,178,-3,179,180,-3,181,648,-25,176,-102,775],
sm589=[0,-2,776,-1,776,-3,776,776,-3,776,776,-25,776,-102,776],
sm590=[0,-2,777,-1,777,-3,777,777,-3,777,777,-25,777,-102,777],
sm591=[0,-2,177,-1,178,-3,179,180,-3,181,-130,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202],
sm592=[0,-2,338,-1,178,-3,179,180,-3,181,778,-25,778,-102,778],
sm593=[0,-2,778,-1,778,-3,778,778,-3,778,778,-25,778,-102,778],
sm594=[0,-2,779,-1,779,-3,779,779,-3,779,779,-25,779,779,-3,779,-97,779,-22,779,779],
sm595=[0,780,-1,780,-1,780,-3,780,780,-3,780,780,-5,780,-19,780,-102,780],
sm596=[0,-2,781,-1,0,-4,0,-31,781,-3,781,-120,781,781],
sm597=[0,-2,782,-1,0,-4,0,-31,782,-3,782,-120,782,782],
sm598=[0,-2,148,-1,149,-4,0,-3,150,648],
sm599=[0,-2,783,-1,0,-4,0,-31,783,-1,783,-1,783,-120,783,783],
sm600=[0,-4,0,-4,0,-136,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202],
sm601=[0,-4,0,-4,0,-30,784],
sm602=[0,-4,0,-4,0,-30,785],
sm603=[0,-4,0,-4,0,-30,786],
sm604=[0,787,787,787,-1,0,-4,0,-5,787,-2,787,787,787,787,-2,787,-15,787,787,787,787,-1,787,787,-1,787,-4,787,787,787,787,787,-1,787,-1,787,787,787,-1,787,-4,787,787,-2,787,787,787,787,-1,787,-1,787,787,787,787,787,787,787,787,787,787,787,787,787,787,-2,787,787,-5,787,787,-2,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,787,-23,787,787],
sm605=[0,-1,2,57,-1,0,-4,0,-9,58,5,788,-18,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm606=[0,-4,0,-4,0,-14,789],
sm607=[0,-4,0,-4,0,-8,790,-5,790],
sm608=[0,-4,0,-4,0,-9,791],
sm609=[0,792,-1,362,-1,0,-4,0,-9,792,792,-4,792,-7,363,-2,364,-3,792,-15,792,792,792,792,-1,792,-8,792,365],
sm610=[0,792,-1,792,-1,0,-4,0,-8,549,792,792,-4,792,-14,792,-15,792,792,792,792,-1,792,-8,792],
sm611=[0,-2,793,-1,0,-3,368,0,-23,369,-37,370],
sm612=[0,794,-1,794,-1,0,-4,0,-9,794,794,-2,794,794,794,-7,794,-2,794,-3,794,-15,794,794,794,794,-1,794,-8,794,794],
sm613=[0,-4,0,-4,0,-3,795,-152,795,795],
sm614=[0,-4,0,-4,0,-14,796],
sm615=[0,-4,0,-4,0,-11,797],
sm616=[0,-2,213,-1,0,-4,0,-9,214,-1,798,-34,10,11,12,13,-1,14,-8,15],
sm617=[0,-2,799,-1,0,-4,0,-9,799,-1,799,-34,799,799,799,799,-1,799,-8,799],
sm618=[0,800,-1,800,-1,0,-4,0,-8,800,800,800,-4,800,-14,800,-15,800,800,800,800,-1,800,-8,800],
sm619=[0,801,-1,801,-1,0,-4,0,-8,801,801,801,-4,801,-14,801,-15,801,801,801,801,-1,801,-8,801],
sm620=[0,802,-1,802,-1,0,-4,0,-8,802,802,802,-4,802,-14,802,-15,802,802,802,802,-1,802,-8,802],
sm621=[0,556,-1,556,-1,0,-4,0,-8,556,556,556,-4,556,-5,557,-8,556,-15,556,556,556,556,-1,556,-8,556],
sm622=[0,803,-1,803,-1,0,-4,0,-8,803,803,803,-3,803,803,-5,803,-8,803,-15,803,803,803,803,-1,803,-8,803],
sm623=[0,804,-1,804,-1,0,-4,0,-8,804,804,804,-3,804,804,-6,804,-7,804,-15,804,804,804,804,-1,804,-8,804],
sm624=[0,805,-1,805,-1,0,-4,0,-8,805,805,805,-3,805,805,-5,805,-8,805,-15,805,805,805,805,-1,805,-8,805],
sm625=[0,806,-1,806,-1,0,-4,0,-8,806,806,806,-3,806,806,-6,806,-7,806,-15,806,806,806,806,-1,806,-8,806],
sm626=[0,807,-1,807,-1,0,-4,0,-8,807,807,807,-3,807,807,-5,807,807,-7,807,-15,807,807,807,807,-1,807,-8,807],
sm627=[0,808,-1,808,-1,0,-4,0,-8,808,808,808,-3,808,808,-5,808,808,-7,808,-15,808,808,808,808,-1,808,-8,808],
sm628=[0,-4,687,-4,0,-3,688,-10,809],
sm629=[0,810,-1,810,-1,0,-4,0,-8,810,810,810,-3,810,810,-5,810,810,-7,810,-15,810,810,810,810,-1,810,-8,810],
sm630=[0,-4,811,-4,0,-3,811,-10,811],
sm631=[0,-4,812,-4,0,-3,812,-10,812],
sm632=[0,-1,559,813,-1,0,-4,0],
sm633=[0,-1,814,814,-1,0,-4,0],
sm634=[0,-1,814,814,-1,0,-4,0,-33,815],
sm635=[0,-2,813,-1,0,-4,0],
sm636=[0,-2,816,-1,0,-4,0],
sm637=[0,-2,817,-1,0,-4,0],
sm638=[0,-2,818,-1,0,-4,0],
sm639=[0,-2,818,-1,0,-4,0,-33,819],
sm640=[0,-4,0,-4,0,-14,820,-15,820,820,820,820],
sm641=[0,-1,821,-2,0,-4,0],
sm642=[0,-4,0,-4,0,-14,822,-15,822,822,822,822],
sm643=[0,-4,706,-4,0,-3,707,-10,823],
sm644=[0,-4,824,-4,0,-3,824,-10,824],
sm645=[0,-4,825,-4,0,-3,825,-10,825],
sm646=[0,-1,709,-2,0,-4,0,-11,826,-7,710,711],
sm647=[0,-1,827,-2,0,-4,0,-11,827,-7,827,827],
sm648=[0,-4,0,-4,0,-8,828,829],
sm649=[0,-4,0,-4,0,-8,830,830],
sm650=[0,-4,0,-4,0,-8,831,831],
sm651=[0,-4,0,-4,0,-36,832],
sm652=[0,-4,0,-4,0,-11,833],
sm653=[0,-4,0,-4,0,-9,834,-4,834,-6,834],
sm654=[0,-4,0,-4,0,-9,835,-4,835,-7,835],
sm655=[0,-4,0,-4,0,-9,836,-4,836,-6,836],
sm656=[0,-4,0,-4,0,-9,837,-4,837,-7,837],
sm657=[0,-4,0,-4,0,-9,838,-4,838,-6,838,838],
sm658=[0,-4,0,-4,0,-9,839,-4,839,-6,839,839],
sm659=[0,-4,0,-4,0,-14,840],
sm660=[0,841,-1,841,-1,0,-4,0,-9,841,-1,841,-3,841,-14,841,-15,841,841,841,841,-1,841,-8,841],
sm661=[0,-4,0,-4,0,-52,842],
sm662=[0,-2,843,-1,0,-4,0,-8,843,843,-4,843,-16,843,-11,843,843,843,843,843,843,843,-1,843,-8,843],
sm663=[0,-4,0,-4,0,-52,844],
sm664=[0,-2,845,-1,0,-4,0,-8,845,845,-4,845,-16,845,-11,845,845,845,845,845,845,845,-1,845,-8,845],
sm665=[0,-2,846,-1,0,-4,0,-10,846,846,-2,846,846],
sm666=[0,-2,847,-1,847,-4,0,-3,847,-6,847,847,-2,847,847,-45,847,-65,847],
sm667=[0,-4,0,-4,0,-8,848,-43,848],
sm668=[0,-4,0,-4,0,-9,849],
sm669=[0,-4,0,-4,0,-9,850],
sm670=[0,-4,0,-4,0,-14,851],
sm671=[0,-4,0,-4,0,-14,852],
sm672=[0,-4,0,-4,0,-8,853,-5,853],
sm673=[0,-4,0,-4,0,-5,854,-2,854,854,854,854,-2,854,-15,854,854,854,854,-1,854,854,-1,854,-4,854,-1,854,854,854,-1,854,-1,854,854,854,-1,854,-4,854,854,-13,854,-13,854,-9,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,854,-4,854,854],
sm674=[0,-4,0,-4,0,-8,855,-2,855,-2,855,-18,855,-4,855,-13,855,-22,855],
sm675=[0,-4,0,-4,0,-8,856,-2,856,-2,856,-18,856,-4,856,-13,856,-22,856],
sm676=[0,-4,0,-4,0,-52,857],
sm677=[0,-4,0,-4,0,-10,858],
sm678=[0,-1,2,57,-1,0,-4,0,-9,122,-4,859,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm679=[0,-4,0,-4,0,-8,64,-5,860],
sm680=[0,-4,0,-4,0,-8,64,-5,861],
sm681=[0,862,862,862,-1,0,-4,0,-9,862,862,862,-18,862,-12,862,862,-6,862,-9,862,-2,862,862,862,862,-1,862,862,862,862,862,862,-1,862,862,862,862,862,862,862,862,862,-2,862,862,-5,862,862,-2,862,-23,862,-1,862,862,862,862,862,862,862,862,862,-23,862,862],
sm682=[0,-4,0,-4,0,-8,64,-1,863],
sm683=[0,-1,2,57,-1,0,-4,0,-9,122,-4,864,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm684=[0,-4,0,-4,0,-8,64,-5,865],
sm685=[0,-4,0,-4,0,-14,866],
sm686=[0,-4,0,-4,0,-8,64,-5,867],
sm687=[0,868,868,868,-1,0,-4,0,-9,868,868,868,-18,868,-12,868,868,-6,868,-9,868,-2,868,868,868,868,-1,868,868,868,868,868,868,-1,868,868,868,868,868,868,868,868,868,-2,868,868,-5,868,868,-2,868,-23,868,-1,868,868,868,868,868,868,868,868,868,-23,868,868],
sm688=[0,-4,0,-4,0,-14,869],
sm689=[0,-4,0,-4,0,-14,870],
sm690=[0,871,871,871,-1,0,-4,0,-9,871,871,871,-18,871,-12,871,871,-6,871,-9,871,-2,871,871,871,871,-1,871,871,871,871,871,871,-1,871,871,871,871,871,871,871,871,871,-2,871,871,-5,871,871,-2,871,-23,871,-1,871,871,871,871,871,871,871,871,871,-23,871,871],
sm691=[0,-4,0,-4,0,-11,872,-52,770,-18,771],
sm692=[0,-4,0,-4,0,-11,873,-71,771],
sm693=[0,-4,0,-4,0,-11,874,-52,874,-18,874],
sm694=[0,-4,0,-4,0,-11,875,-48,876,-22,875],
sm695=[0,-2,333,-1,0,-4,0],
sm696=[0,-2,877,-1,877,-3,877,877,-3,877,877,-25,877,-102,877],
sm697=[0,-4,0,-4,0,-5,878,-2,64,-5,879],
sm698=[0,-4,0,-4,0,-156,880],
sm699=[0,-4,0,-4,0,-31,881],
sm700=[0,-4,0,-4,0,-35,882],
sm701=[0,-4,0,-4,0,-35,883],
sm702=[0,-4,0,-4,0,-11,884],
sm703=[0,-4,0,-4,0,-11,885],
sm704=[0,886,-1,886,-1,0,-4,0,-8,549,886,886,-4,886,-14,886,-15,886,886,886,886,-1,886,-8,886],
sm705=[0,-4,0,-4,0,-14,887],
sm706=[0,-4,0,-4,0,-14,888],
sm707=[0,-4,0,-4,0,-60,256,564],
sm708=[0,889,-1,889,-1,0,-4,0,-9,889,889,-2,889,-1,889,-7,889,-2,889,-3,889,-15,889,889,889,889,-1,889,-8,889,889],
sm709=[0,-4,0,-4,0,-10,890],
sm710=[0,-2,891,-1,0,-4,0,-9,891,-1,891,-34,891,891,891,891,-1,891,-8,891],
sm711=[0,892,-1,892,-1,0,-4,0,-8,892,892,892,-3,892,892,-5,892,892,-7,892,-15,892,892,892,892,-1,892,-8,892],
sm712=[0,-4,893,-4,0,-3,893,-10,893],
sm713=[0,-4,0,-4,0,-14,894],
sm714=[0,-4,0,-4,0,-14,701],
sm715=[0,-4,0,-4,0,-14,690],
sm716=[0,-4,0,-4,0,-14,895],
sm717=[0,-1,896,896,-1,0,-4,0],
sm718=[0,-4,0,-4,0,-31,897],
sm719=[0,-4,0,-4,0,-30,898,-1,899],
sm720=[0,-2,900,-1,0,-4,0],
sm721=[0,-4,0,-4,0,-14,901,-15,901,901,901,901],
sm722=[0,-4,902,-4,0,-3,902,-10,902],
sm723=[0,-4,0,-4,0,-10,903],
sm724=[0,-1,904,-2,0,-4,0,-11,904,-7,904,904],
sm725=[0,-4,0,-4,0,-8,905,905],
sm726=[0,-4,0,-4,0,-10,906],
sm727=[0,-4,0,-4,0,-9,907,-4,907,-6,907,907],
sm728=[0,-2,908,-1,0,-4,0,-8,908,908,-4,908,-16,908,-11,908,908,908,908,908,908,908,-1,908,-8,908],
sm729=[0,-4,0,-4,0,-9,909],
sm730=[0,-4,0,-4,0,-8,910,-2,910,-2,910,-18,910,-4,910,-13,910,-22,910],
sm731=[0,911,911,911,-1,0,-4,0,-9,911,911,911,-18,911,-12,911,911,-6,911,-9,911,-2,911,911,911,911,-1,911,911,911,911,911,911,-1,911,911,911,911,911,911,911,911,911,-2,911,911,-5,911,911,-2,911,-23,911,-1,911,911,911,911,911,911,911,911,911,-23,911,911],
sm732=[0,912,912,912,-1,0,-4,0,-9,912,912,912,-18,912,-12,912,912,-6,912,-9,912,-2,912,912,912,912,-1,912,912,912,912,912,912,-1,912,912,912,912,912,912,912,912,912,-2,912,912,-5,912,912,-2,912,-23,912,-1,912,912,912,912,912,912,912,912,912,-23,912,912],
sm733=[0,-4,0,-4,0,-8,64,-5,913],
sm734=[0,914,914,914,-1,0,-4,0,-9,914,914,914,-18,914,-12,914,914,-6,914,-9,914,-2,914,914,914,914,-1,914,914,914,914,914,914,-1,914,914,914,914,914,914,914,914,914,-2,914,914,-5,914,914,-2,914,-23,914,-1,914,914,914,914,914,914,914,914,914,-23,914,914],
sm735=[0,915,915,915,-1,0,-4,0,-9,915,915,915,-18,915,-12,915,915,-6,915,-9,915,-2,915,915,915,915,-1,915,915,915,915,915,915,-1,915,915,915,915,915,915,915,915,915,-2,915,915,-5,915,915,-2,915,-23,915,-1,915,915,915,915,915,915,915,915,915,-23,915,915],
sm736=[0,-1,2,57,-1,0,-4,0,-9,122,-4,916,-28,8,9,-6,123,-9,16,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm737=[0,-4,0,-4,0,-8,64,-5,917],
sm738=[0,918,918,918,-1,0,-4,0,-9,918,918,918,-18,918,-12,918,918,-6,918,-9,918,-2,918,918,918,918,-1,918,918,918,918,918,918,-1,918,918,918,918,918,918,918,918,918,-2,918,918,-5,918,918,-2,918,-23,918,-1,918,918,918,918,918,918,918,918,918,-23,918,918],
sm739=[0,919,919,919,-1,0,-4,0,-9,919,919,919,-18,919,-12,919,919,-6,919,-9,919,-2,919,919,919,919,-1,919,919,919,919,919,919,-1,919,919,919,919,919,919,919,919,919,-2,919,919,-5,919,919,-2,919,-23,919,-1,919,919,919,919,919,919,919,919,919,-23,919,919],
sm740=[0,920,920,920,-1,0,-4,0,-9,920,920,920,-18,920,-12,920,920,-6,920,-9,920,-2,920,920,920,920,-1,920,920,920,920,920,920,-1,920,920,920,920,920,920,920,920,920,-2,920,920,-5,920,920,-2,920,-23,920,-1,920,920,920,920,920,920,920,920,920,-23,920,920],
sm741=[0,921,921,921,-1,0,-4,0,-9,921,921,921,-18,921,-12,921,921,-6,921,-9,921,-2,921,921,921,921,-1,921,921,921,921,921,921,-1,921,921,921,921,921,921,921,921,921,-2,921,921,-5,921,921,-2,921,-23,921,-1,921,921,921,921,921,921,921,921,921,-23,921,921],
sm742=[0,-4,0,-4,0,-14,922],
sm743=[0,-4,0,-4,0,-11,923,-71,771],
sm744=[0,924,924,924,-1,0,-4,0,-9,924,924,924,-18,924,-12,924,924,-6,924,-9,924,-2,924,924,924,924,-1,924,924,924,924,924,924,-1,924,924,924,924,924,924,924,924,924,-2,924,924,-5,924,924,-2,924,-23,924,-1,924,924,924,924,924,924,924,924,924,-23,924,924],
sm745=[0,-4,0,-4,0,-11,925,-52,925,-18,925],
sm746=[0,-4,0,-4,0,-11,926,-71,771],
sm747=[0,-4,0,-4,0,-8,64,-51,927],
sm748=[0,928,928,928,-1,0,-4,0,-9,928,928,928,-18,928,-12,928,928,-6,928,-9,928,-2,928,928,928,928,-1,928,928,928,928,928,928,-1,928,928,928,928,928,928,928,928,928,-1,928,928,928,-5,928,928,-2,928,-23,928,-1,928,928,928,928,928,928,928,928,928,-23,928,928],
sm749=[0,-4,0,-4,0,-31,929],
sm750=[0,-4,0,-4,0,-61,930],
sm751=[0,-2,931,-1,931,-3,931,931,-3,931,931,-25,931,931,-3,931,-97,931,-22,931,931],
sm752=[0,-2,932,-1,0,-4,0,-31,932,-3,932,-120,932,932],
sm753=[0,933,-1,933,-1,933,-3,933,933,-3,933,933,-5,933,-19,933,-102,933],
sm754=[0,-4,0,-4,0,-134,934],
sm755=[0,-4,0,-4,0,-135,935],
sm756=[0,936,936,936,-1,0,-4,0,-5,936,-2,936,936,936,936,-2,936,-15,936,936,936,936,-1,936,936,-1,936,-4,936,936,936,936,936,-1,936,-1,936,936,936,-1,936,-4,936,936,-2,936,936,936,936,-1,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,-2,936,936,-5,936,936,-2,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,-23,936,936],
sm757=[0,-4,0,-4,0,-11,937],
sm758=[0,938,-1,938,-1,0,-4,0,-9,938,938,-4,938,-7,938,-2,938,-3,938,-15,938,938,938,938,-1,938,-8,938,938],
sm759=[0,-1,939,939,-1,0,-4,0,-33,940],
sm760=[0,-1,941,941,-1,0,-4,0],
sm761=[0,-2,253,-1,0,-4,0,-10,942,943,-3,6],
sm762=[0,-4,0,-4,0,-8,944,944],
sm763=[0,-4,0,-4,0,-11,945],
sm764=[0,-4,0,-4,0,-11,946],
sm765=[0,947,947,947,-1,0,-4,0,-9,947,947,947,-18,947,-12,947,947,-6,947,-9,947,-2,947,947,947,947,-1,947,947,947,947,947,947,-1,947,947,947,947,947,947,947,947,947,-2,947,947,-5,947,947,-2,947,-23,947,-1,947,947,947,947,947,947,947,947,947,-23,947,947],
sm766=[0,948,948,948,-1,0,-4,0,-9,948,948,948,-18,948,-12,948,948,-6,948,-9,948,-2,948,948,948,948,-1,948,948,948,948,948,948,-1,948,948,948,948,948,948,948,948,948,-2,948,948,-5,948,948,-2,948,-23,948,-1,948,948,948,948,948,948,948,948,948,-23,948,948],
sm767=[0,949,949,949,-1,0,-4,0,-9,949,949,949,-18,949,-12,949,949,-6,949,-9,949,-2,949,949,949,949,-1,949,949,949,949,949,949,-1,949,949,949,949,949,949,949,949,949,-2,949,949,-5,949,949,-2,949,-23,949,-1,949,949,949,949,949,949,949,949,949,-23,949,949],
sm768=[0,-4,0,-4,0,-8,64,-5,950],
sm769=[0,951,951,951,-1,0,-4,0,-9,951,951,951,-18,951,-12,951,951,-6,951,-9,951,-2,951,951,951,951,-1,951,951,951,951,951,951,-1,951,951,951,951,951,951,951,951,951,-2,951,951,-5,951,951,-2,951,-23,951,-1,951,951,951,951,951,951,951,951,951,-23,951,951],
sm770=[0,952,952,952,-1,0,-4,0,-9,952,952,952,-18,952,-12,952,952,-6,952,-9,952,-2,952,952,952,952,-1,952,952,952,952,952,952,-1,952,952,952,952,952,952,952,952,952,-2,952,952,-5,952,952,-2,952,-23,952,-1,952,952,952,952,952,952,952,952,952,-23,952,952],
sm771=[0,953,953,953,-1,0,-4,0,-9,953,953,953,-18,953,-12,953,953,-6,953,-9,953,-2,953,953,953,953,-1,953,953,953,953,953,953,-1,953,953,953,953,953,953,953,953,953,-2,953,953,-5,953,953,-2,953,-23,953,-1,953,953,953,953,953,953,953,953,953,-23,953,953],
sm772=[0,954,954,954,-1,0,-4,0,-9,954,954,954,-18,954,-12,954,954,-6,954,-9,954,-2,954,954,954,954,-1,954,954,954,954,954,954,-1,954,954,954,954,954,954,954,954,954,-2,954,954,-5,954,954,-2,954,-23,954,-1,954,954,954,954,954,954,954,954,954,-23,954,954],
sm773=[0,955,955,955,-1,0,-4,0,-9,955,955,955,-18,955,-12,955,955,-6,955,-9,955,-2,955,955,955,955,-1,955,955,955,955,955,955,-1,955,955,955,955,955,955,955,955,955,-2,955,955,-5,955,955,-2,955,-23,955,-1,955,955,955,955,955,955,955,955,955,-23,955,955],
sm774=[0,-4,0,-4,0,-11,956],
sm775=[0,957,957,957,-1,0,-4,0,-9,957,957,957,-18,957,-12,957,957,-6,957,-9,957,-2,957,957,957,957,-1,957,957,957,957,957,957,-1,957,957,957,957,957,957,957,957,957,-2,957,957,-5,957,957,-2,957,-23,957,-1,957,957,957,957,957,957,957,957,957,-23,957,957],
sm776=[0,-1,2,57,-1,0,-4,0,-9,58,5,958,-18,7,-12,8,9,-16,16,-2,958,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,958,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm777=[0,-1,2,57,-1,0,-4,0,-9,58,5,959,-18,7,-12,8,9,-16,16,-3,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,959,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm778=[0,960,-1,960,-1,960,-3,960,960,-3,960,960,-5,960,-19,960,-102,960],
sm779=[0,-4,0,-4,0,-31,961],
sm780=[0,-4,0,-4,0,-31,962],
sm781=[0,963,963,963,-1,0,-4,0,-5,963,-2,963,963,963,963,-2,963,-15,963,963,963,963,-1,963,963,-1,963,-4,963,963,963,963,963,-1,963,-1,963,963,963,-1,963,-4,963,963,-2,963,963,963,963,-1,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,-2,963,963,-5,963,963,-2,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,963,-23,963,963],
sm782=[0,-4,0,-4,0,-14,964],
sm783=[0,-1,965,965,-1,0,-4,0],
sm784=[0,-4,0,-4,0,-11,966],
sm785=[0,-1,967,-2,0,-4,0,-11,967,-7,967,967],
sm786=[0,-4,0,-4,0,-11,968],
sm787=[0,-1,969,969,-1,0,-4,0,-8,969,-1,969,969,-39,969,-39,969,969,969,-62,969,969],
sm788=[0,-1,970,970,-1,0,-4,0,-8,970,-1,970,970,-39,970,-39,970,970,970,-62,970,970],
sm789=[0,-4,0,-4,0,-11,971],
sm790=[0,972,972,972,-1,0,-4,0,-9,972,972,972,-18,972,-12,972,972,-6,972,-9,972,-2,972,972,972,972,-1,972,972,972,972,972,972,-1,972,972,972,972,972,972,972,972,972,-2,972,972,-5,972,972,-2,972,-23,972,-1,972,972,972,972,972,972,972,972,972,-23,972,972],
sm791=[0,973,973,973,-1,0,-4,0,-9,973,973,973,-18,973,-12,973,973,-6,973,-9,973,-2,973,973,973,973,-1,973,973,973,973,973,973,-1,973,973,973,973,973,973,973,973,973,-2,973,973,-5,973,973,-2,973,-23,973,-1,973,973,973,973,973,973,973,973,973,-23,973,973],
sm792=[0,974,974,974,-1,0,-4,0,-9,974,974,974,-18,974,-12,974,974,-6,974,-9,974,-2,974,974,974,974,-1,974,974,974,974,974,974,-1,974,974,974,974,974,974,974,974,974,-2,974,974,-5,974,974,-2,974,-23,974,-1,974,974,974,974,974,974,974,974,974,-23,974,974],
sm793=[0,975,975,975,-1,0,-4,0,-9,975,975,975,-18,975,-12,975,975,-6,975,-9,975,-2,975,975,975,975,-1,975,975,975,975,975,975,-1,975,975,975,975,975,975,975,975,975,-2,975,975,-5,975,975,-2,975,-23,975,-1,975,975,975,975,975,975,975,975,975,-23,975,975],
sm794=[0,976,976,976,-1,0,-4,0,-9,976,976,976,-18,976,-12,976,976,-6,976,-9,976,-2,976,976,976,976,-1,976,976,976,976,976,976,-1,976,976,976,976,976,976,976,976,976,-2,976,976,-5,976,976,-2,976,-23,976,-1,976,976,976,976,976,976,976,976,976,-23,976,976],
sm795=[0,-1,2,57,-1,0,-4,0,-9,58,5,977,-18,7,-12,8,9,-16,16,-2,977,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,977,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-23,48,49],
sm796=[0,-4,0,-4,0,-5,978,-2,64],
sm797=[0,979,-1,979,-1,979,-3,979,979,-3,979,979,-5,979,-19,979,-102,979],
sm798=[0,-1,980,-2,0,-4,0,-11,980,-7,980,980],
sm799=[0,-1,981,981,-1,0,-4,0,-8,981,-1,981,981,-39,981,-39,981,981,981,-62,981,981],
sm800=[0,982,982,982,-1,0,-4,0,-9,982,982,982,-18,982,-12,982,982,-6,982,-9,982,-2,982,982,982,982,-1,982,982,982,982,982,982,-1,982,982,982,982,982,982,982,982,982,-2,982,982,-5,982,982,-2,982,-23,982,-1,982,982,982,982,982,982,982,982,982,-23,982,982],
sm801=[0,-2,983,-1,983,-3,983,983,-3,983,983,-25,983,983,-3,983,-97,983,-22,983,983],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],["((",14],["))",15],[")",24],["(",71],[",",18],["{",19],[";",20],["}",21],[null,8],["supports",23],["@",25],["import",26],["keyframes",27],["id",28],["from",29],["to",30],["and",31],["or",32],["not",33],["media",35],["only",36],[":",70],["<",40],[">",41],["<=",42],["=",43],["/",45],["%",46],["px",47],["in",48],["rad",49],["url",50],["\"",166],["'",167],["+",53],["~",54],["||",55],["*",56],["|",57],["#",58],[".",59],["[",61],["]",62],["^=",63],["$=",64],["*=",65],["i",66],["s",67],["!",137],["important",69],["as",72],["export",73],["default",74],["function",75],["class",76],["let",77],["async",78],["if",79],["else",80],["do",81],["while",82],["for",83],["var",84],["of",85],["await",86],["continue",87],["break",88],["return",89],["throw",90],["with",91],["switch",92],["case",93],["try",94],["catch",95],["finally",96],["debugger",97],["const",98],["=>",99],["extends",100],["static",101],["get",102],["set",103],["new",104],["super",105],["target",106],["...",107],["this",108],["/=",109],["%=",110],["+=",111],["-=",112],["<<=",113],[">>=",114],[">>>=",115],["&=",116],["|=",117],["**=",118],["?",119],["&&",120],["^",121],["&",122],["==",123],["!=",124],["===",125],["!==",126],[">=",127],["instanceof",128],["<<",129],[">>",130],[">>>",131],["-",132],["**",133],["delete",134],["void",135],["typeof",136],["++",138],["--",139],["null",140],["true",141],["false",142],["</",143],["style",144],["script",145],["input",146],["area",147],["base",148],["br",149],["col",150],["command",151],["embed",152],["hr",153],["img",154],["keygen",155],["link",156],["meta",157],["param",158],["source",159],["track",160],["wbr",161],["f",162],["filter",163]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,"(("],[15,"))"],[24,")"],[71,"("],[18,","],[19,"{"],[20,";"],[21,"}"],[8,null],[23,"supports"],[25,"@"],[26,"import"],[27,"keyframes"],[28,"id"],[29,"from"],[30,"to"],[31,"and"],[32,"or"],[33,"not"],[35,"media"],[36,"only"],[70,":"],[40,"<"],[41,">"],[42,"<="],[43,"="],[45,"/"],[46,"%"],[47,"px"],[48,"in"],[49,"rad"],[50,"url"],[166,"\""],[167,"'"],[53,"+"],[54,"~"],[55,"||"],[56,"*"],[57,"|"],[58,"#"],[59,"."],[61,"["],[62,"]"],[63,"^="],[64,"$="],[65,"*="],[66,"i"],[67,"s"],[137,"!"],[69,"important"],[72,"as"],[73,"export"],[74,"default"],[75,"function"],[76,"class"],[77,"let"],[78,"async"],[79,"if"],[80,"else"],[81,"do"],[82,"while"],[83,"for"],[84,"var"],[85,"of"],[86,"await"],[87,"continue"],[88,"break"],[89,"return"],[90,"throw"],[91,"with"],[92,"switch"],[93,"case"],[94,"try"],[95,"catch"],[96,"finally"],[97,"debugger"],[98,"const"],[99,"=>"],[100,"extends"],[101,"static"],[102,"get"],[103,"set"],[104,"new"],[105,"super"],[106,"target"],[107,"..."],[108,"this"],[109,"/="],[110,"%="],[111,"+="],[112,"-="],[113,"<<="],[114,">>="],[115,">>>="],[116,"&="],[117,"|="],[118,"**="],[119,"?"],[120,"&&"],[121,"^"],[122,"&"],[123,"=="],[124,"!="],[125,"==="],[126,"!=="],[127,">="],[128,"instanceof"],[129,"<<"],[130,">>"],[131,">>>"],[132,"-"],[133,"**"],[134,"delete"],[135,"void"],[136,"typeof"],[138,"++"],[139,"--"],[140,"null"],[141,"true"],[142,"false"],[143,"</"],[144,"style"],[145,"script"],[146,"input"],[147,"area"],[148,"base"],[149,"br"],[150,"col"],[151,"command"],[152,"embed"],[153,"hr"],[154,"img"],[155,"keygen"],[156,"link"],[157,"meta"],[158,"param"],[159,"source"],[160,"track"],[161,"wbr"],[162,"f"],[163,"filter"]]),

    // States 
    state = [sm0,
sm1,
sm2,
sm3,
sm2,
sm4,
sm5,
sm6,
sm7,
sm8,
sm9,
sm9,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm10,
sm11,
sm12,
sm13,
sm14,
sm15,
sm15,
sm16,
sm17,
sm18,
sm19,
sm20,
sm21,
sm22,
sm23,
sm24,
sm25,
sm26,
sm27,
sm28,
sm29,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm31,
sm30,
sm30,
sm32,
sm33,
sm34,
sm35,
sm36,
sm36,
sm36,
sm37,
sm38,
sm38,
sm38,
sm38,
sm39,
sm40,
sm41,
sm42,
sm43,
sm43,
sm43,
sm43,
sm44,
sm44,
sm45,
sm46,
sm47,
sm47,
sm48,
sm49,
sm50,
sm51,
sm52,
sm52,
sm30,
sm53,
sm54,
sm55,
sm56,
sm57,
sm58,
sm59,
sm59,
sm60,
sm61,
sm62,
sm63,
sm64,
sm65,
sm66,
sm67,
sm30,
sm68,
sm69,
sm70,
sm71,
sm72,
sm73,
sm74,
sm75,
sm76,
sm76,
sm76,
sm77,
sm78,
sm79,
sm56,
sm80,
sm81,
sm82,
sm83,
sm83,
sm84,
sm85,
sm86,
sm87,
sm87,
sm88,
sm89,
sm90,
sm91,
sm91,
sm92,
sm93,
sm94,
sm95,
sm96,
sm97,
sm98,
sm99,
sm99,
sm99,
sm99,
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
sm111,
sm112,
sm113,
sm114,
sm115,
sm116,
sm117,
sm118,
sm119,
sm120,
sm121,
sm122,
sm30,
sm30,
sm30,
sm123,
sm124,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm125,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm30,
sm126,
sm31,
sm127,
sm128,
sm129,
sm38,
sm130,
sm131,
sm132,
sm133,
sm134,
sm135,
sm136,
sm137,
sm138,
sm139,
sm140,
sm141,
sm142,
sm143,
sm144,
sm30,
sm145,
sm30,
sm143,
sm146,
sm147,
sm34,
sm148,
sm149,
sm150,
sm151,
sm152,
sm153,
sm154,
sm154,
sm154,
sm155,
sm156,
sm157,
sm56,
sm158,
sm143,
sm30,
sm159,
sm160,
sm161,
sm162,
sm163,
sm164,
sm165,
sm166,
sm167,
sm168,
sm169,
sm169,
sm170,
sm171,
sm30,
sm172,
sm30,
sm173,
sm174,
sm30,
sm175,
sm176,
sm177,
sm178,
sm179,
sm180,
sm181,
sm30,
sm182,
sm183,
sm184,
sm185,
sm186,
sm187,
sm188,
sm189,
sm189,
sm190,
sm190,
sm191,
sm189,
sm192,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm193,
sm194,
sm195,
sm195,
sm195,
sm195,
sm196,
sm197,
sm198,
sm199,
sm200,
sm201,
sm202,
sm203,
sm204,
sm167,
sm167,
sm205,
sm206,
sm207,
sm208,
sm209,
sm210,
sm211,
sm212,
sm213,
sm214,
sm207,
sm215,
sm216,
sm217,
sm215,
sm218,
sm219,
sm219,
sm219,
sm219,
sm220,
sm221,
sm221,
sm222,
sm223,
sm224,
sm225,
sm226,
sm227,
sm228,
sm229,
sm230,
sm231,
sm232,
sm233,
sm234,
sm235,
sm236,
sm237,
sm210,
sm210,
sm210,
sm238,
sm239,
sm240,
sm241,
sm242,
sm243,
sm244,
sm245,
sm246,
sm247,
sm248,
sm249,
sm249,
sm250,
sm251,
sm252,
sm253,
sm254,
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
sm275,
sm276,
sm277,
sm278,
sm279,
sm279,
sm30,
sm280,
sm281,
sm282,
sm283,
sm284,
sm283,
sm30,
sm285,
sm286,
sm287,
sm287,
sm288,
sm288,
sm289,
sm289,
sm30,
sm290,
sm291,
sm292,
sm293,
sm294,
sm30,
sm295,
sm296,
sm297,
sm298,
sm299,
sm300,
sm299,
sm301,
sm302,
sm303,
sm304,
sm305,
sm306,
sm307,
sm308,
sm112,
sm309,
sm310,
sm310,
sm311,
sm56,
sm312,
sm30,
sm312,
sm313,
sm314,
sm315,
sm143,
sm316,
sm317,
sm318,
sm319,
sm320,
sm321,
sm322,
sm323,
sm56,
sm324,
sm325,
sm326,
sm327,
sm328,
sm329,
sm330,
sm331,
sm332,
sm56,
sm333,
sm334,
sm335,
sm56,
sm336,
sm337,
sm338,
sm339,
sm340,
sm341,
sm342,
sm343,
sm344,
sm345,
sm68,
sm346,
sm347,
sm348,
sm349,
sm350,
sm351,
sm352,
sm353,
sm354,
sm355,
sm356,
sm357,
sm195,
sm358,
sm359,
sm360,
sm361,
sm362,
sm363,
sm364,
sm365,
sm366,
sm365,
sm367,
sm368,
sm369,
sm370,
sm371,
sm372,
sm373,
sm374,
sm375,
sm201,
sm376,
sm56,
sm377,
sm377,
sm378,
sm379,
sm380,
sm381,
sm381,
sm382,
sm382,
sm383,
sm384,
sm385,
sm386,
sm387,
sm388,
sm389,
sm389,
sm390,
sm390,
sm391,
sm392,
sm393,
sm394,
sm394,
sm395,
sm396,
sm397,
sm398,
sm398,
sm399,
sm400,
sm401,
sm402,
sm403,
sm403,
sm404,
sm404,
sm405,
sm406,
sm407,
sm408,
sm409,
sm410,
sm411,
sm412,
sm413,
sm414,
sm415,
sm415,
sm415,
sm415,
sm416,
sm215,
sm417,
sm418,
sm419,
sm420,
sm421,
sm246,
sm422,
sm423,
sm423,
sm424,
sm30,
sm425,
sm426,
sm427,
sm427,
sm428,
sm429,
sm430,
sm431,
sm432,
sm433,
sm434,
sm435,
sm30,
sm201,
sm436,
sm437,
sm438,
sm439,
sm440,
sm441,
sm442,
sm443,
sm444,
sm56,
sm445,
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
sm56,
sm454,
sm455,
sm456,
sm457,
sm456,
sm456,
sm458,
sm459,
sm459,
sm460,
sm60,
sm30,
sm60,
sm461,
sm462,
sm463,
sm464,
sm465,
sm466,
sm467,
sm468,
sm469,
sm30,
sm30,
sm30,
sm30,
sm470,
sm467,
sm467,
sm471,
sm56,
sm472,
sm56,
sm473,
sm60,
sm474,
sm56,
sm475,
sm476,
sm477,
sm478,
sm479,
sm480,
sm481,
sm482,
sm483,
sm484,
sm112,
sm485,
sm486,
sm487,
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
sm498,
sm499,
sm500,
sm501,
sm502,
sm503,
sm504,
sm505,
sm212,
sm506,
sm507,
sm508,
sm509,
sm510,
sm511,
sm512,
sm392,
sm513,
sm392,
sm514,
sm515,
sm516,
sm517,
sm392,
sm518,
sm518,
sm518,
sm519,
sm520,
sm521,
sm522,
sm522,
sm523,
sm524,
sm505,
sm525,
sm526,
sm527,
sm528,
sm400,
sm529,
sm400,
sm530,
sm531,
sm532,
sm215,
sm533,
sm418,
sm534,
sm535,
sm535,
sm536,
sm537,
sm538,
sm539,
sm540,
sm541,
sm542,
sm543,
sm544,
sm545,
sm546,
sm546,
sm547,
sm548,
sm549,
sm550,
sm551,
sm552,
sm553,
sm56,
sm554,
sm555,
sm556,
sm30,
sm557,
sm558,
sm559,
sm560,
sm561,
sm562,
sm563,
sm564,
sm564,
sm565,
sm566,
sm567,
sm568,
sm569,
sm570,
sm571,
sm572,
sm30,
sm573,
sm60,
sm574,
sm30,
sm30,
sm575,
sm576,
sm60,
sm577,
sm578,
sm579,
sm580,
sm30,
sm581,
sm582,
sm582,
sm30,
sm583,
sm584,
sm585,
sm586,
sm587,
sm587,
sm588,
sm589,
sm589,
sm590,
sm591,
sm592,
sm593,
sm594,
sm594,
sm30,
sm595,
sm596,
sm597,
sm597,
sm597,
sm598,
sm599,
sm599,
sm600,
sm595,
sm601,
sm602,
sm603,
sm604,
sm605,
sm606,
sm607,
sm608,
sm609,
sm610,
sm610,
sm611,
sm612,
sm613,
sm612,
sm614,
sm615,
sm616,
sm617,
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
sm631,
sm632,
sm632,
sm633,
sm634,
sm633,
sm633,
sm635,
sm636,
sm637,
sm638,
sm639,
sm638,
sm638,
sm640,
sm641,
sm642,
sm642,
sm642,
sm643,
sm629,
sm644,
sm645,
sm645,
sm646,
sm647,
sm648,
sm649,
sm650,
sm650,
sm650,
sm651,
sm652,
sm653,
sm654,
sm655,
sm656,
sm657,
sm658,
sm659,
sm660,
sm661,
sm662,
sm663,
sm663,
sm664,
sm665,
sm666,
sm667,
sm668,
sm669,
sm670,
sm671,
sm672,
sm673,
sm673,
sm674,
sm675,
sm676,
sm675,
sm60,
sm677,
sm678,
sm679,
sm60,
sm680,
sm60,
sm681,
sm682,
sm683,
sm684,
sm685,
sm686,
sm60,
sm60,
sm687,
sm60,
sm60,
sm60,
sm60,
sm688,
sm30,
sm689,
sm690,
sm691,
sm692,
sm693,
sm30,
sm694,
sm68,
sm695,
sm696,
sm696,
sm697,
sm698,
sm699,
sm700,
sm701,
sm702,
sm703,
sm605,
sm704,
sm705,
sm706,
sm706,
sm707,
sm708,
sm709,
sm710,
sm711,
sm712,
sm713,
sm714,
sm715,
sm716,
sm717,
sm716,
sm718,
sm719,
sm720,
sm721,
sm711,
sm722,
sm723,
sm724,
sm207,
sm524,
sm725,
sm726,
sm727,
sm728,
sm605,
sm605,
sm729,
sm730,
sm731,
sm732,
sm733,
sm60,
sm60,
sm734,
sm60,
sm735,
sm736,
sm737,
sm60,
sm60,
sm60,
sm60,
sm738,
sm739,
sm740,
sm741,
sm740,
sm741,
sm60,
sm742,
sm60,
sm743,
sm744,
sm745,
sm746,
sm744,
sm747,
sm112,
sm748,
sm749,
sm750,
sm751,
sm752,
sm753,
sm754,
sm755,
sm756,
sm757,
sm758,
sm632,
sm759,
sm632,
sm760,
sm760,
sm761,
sm762,
sm763,
sm764,
sm605,
sm60,
sm765,
sm766,
sm767,
sm768,
sm60,
sm60,
sm769,
sm770,
sm771,
sm772,
sm773,
sm60,
sm773,
sm774,
sm775,
sm775,
sm776,
sm777,
sm778,
sm30,
sm779,
sm780,
sm781,
sm782,
sm783,
sm782,
sm784,
sm785,
sm786,
sm787,
sm788,
sm789,
sm790,
sm60,
sm791,
sm792,
sm793,
sm794,
sm795,
sm796,
sm797,
sm797,
sm798,
sm799,
sm800,
sm801],

/************ Functions *************/

    max = Math.max,

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
e$2],

    //Empty Function
    nf = ()=>-1, 

    //Environment Functions
    
redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
redn = (ret, plen, t, e, o, l, s) => {        let ln = max(o.length - plen, 0);        o[ln] = o[o.length -1];        o.length = ln + 1;        return ret;    },
shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R0_S=function (sym,env,lex,state,output,len) {return sym[0]},
I0_BASIC_BINDING=function (sym,env,lex,state,output,len) {env.start = lex.off+2;},
R0_css$import_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1]),sym[0]},
R1_css$import_list=function (sym,env,lex,state,output,len) {return [sym[0]]},
R0_css$COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[2]),sym[0]},
C0_css$RULE_SET=function (sym,env,lex,state,output,len) {this.selectors=sym[0]; this.body = sym[2];},
C0_css$keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
C0_css$keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0]; this.props = sym[2].props;},
R0_css$general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R1_css$general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R0_css$COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len>1? [sym[0]].concat(sym[1]) : [sym[0]]},
R0_css$declaration_list=function (sym,env,lex,state,output,len) {return ({props: sym[0], at_rules:[]})},
R1_css$declaration_list=function (sym,env,lex,state,output,len) {return ({props: [], at_rules:[sym[0]]})},
R2_css$declaration_list=function (sym,env,lex,state,output,len) {return sym[0].at_rules.push(sym[1]), sym[0]},
R3_css$declaration_list=function (sym,env,lex,state,output,len) {return sym[0].props.push(...sym[1]), sym[0]},
R0_css$declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
R0_js$statement_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]), sym[0]);},
C0_js$empty_statement=function (sym,env,lex,state,output,len) {this.type = "empty";},
R0_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], sym[4], sym[6], sym[8]))},
I1_js$iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
I2_js$iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
R3_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(null, sym[4], sym[6], sym[8]))},
R4_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], null, sym[6], sym[8]))},
R5_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], sym[4], null, sym[8]))},
R6_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(null, null, sym[4], sym[6]))},
R7_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], null, null, sym[8]))},
R8_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(null, null, null, sym[5]))},
R9_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[3], sym[5], sym[7], sym[9]))},
R10_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[3], sym[5], null, sym[9]))},
R11_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[3], null, sym[7], sym[9]))},
R12_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[3], null , null, sym[9]))},
R13_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], sym[3], null, sym[6]))},
R14_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], null, sym[5], sym[6]))},
R15_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_stmt(sym[2], null, null, sym[5]))},
R16_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_in_stmt(sym[2], sym[4], sym[6]))},
R17_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_in_stmt(sym[3], sym[5], sym[7]))},
R18_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_of_stmt(sym[2], sym[4], sym[6]))},
R19_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_of_stmt(sym[3], sym[5], sym[7], true))},
R20_js$iteration_statement=function (sym,env,lex,state,output,len) {return (new env.functions.for_of_stmt(sym[4], sym[6], sym[8], true))},
R0_js$continue_statement=function (sym,env,lex,state,output,len) {return (new env.functions.continue_stmt(sym[1]))},
R0_js$break_statement=function (sym,env,lex,state,output,len) {return (new env.functions.break_stmt(sym[1]))},
R0_js$case_block=function (sym,env,lex,state,output,len) {return []},
R1_js$case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
R2_js$case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
R3_js$case_block=function (sym,env,lex,state,output,len) {return sym[1]},
R0_js$case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
R0_js$case_clause=function (sym,env,lex,state,output,len) {return (new env.functions.case_stmt(sym[1], sym[3]))},
R1_js$case_clause=function (sym,env,lex,state,output,len) {return (new env.functions.case_stmt(sym[1]))},
R0_js$default_clause=function (sym,env,lex,state,output,len) {return (new env.functions.default_case_stmt(sym[2]))},
R1_js$default_clause=function (sym,env,lex,state,output,len) {return (new env.functions.default_case_stmt())},
R0_js$try_statement=function (sym,env,lex,state,output,len) {return (new env.functions.try_stmt(sym[1],sym[2]))},
R1_js$try_statement=function (sym,env,lex,state,output,len) {return (new env.functions.try_stmt(sym[1],null ,sym[2]))},
R2_js$try_statement=function (sym,env,lex,state,output,len) {return (new env.functions.try_stmt(sym[1], sym[2], sym[3]))},
R0_js$variable_declaration_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[2])},
R0_js$let_or_const=function (sym,env,lex,state,output,len) {return "let"},
R1_js$let_or_const=function (sym,env,lex,state,output,len) {return "const"},
R0_js$function_declaration=function (sym,env,lex,state,output,len) {return new env.functions.funct_decl(null, sym[2], sym[5])},
R1_js$function_declaration=function (sym,env,lex,state,output,len) {return new env.functions.funct_decl(sym[1], sym[3], sym[6])},
R0_js$formal_parameters=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]), sym[0])},
R0_js$arrow_function=function (sym,env,lex,state,output,len) {return new env.functions.funct_decl(null, sym[0], sym[2])},
R0_js$class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail(sym)},
R1_js$class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([null, ... sym[0]])},
R2_js$class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([sym[0], null, null])},
R3_js$class_tail=function (sym,env,lex,state,output,len) {return null},
R0_js$class_element_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]))},
R0_js$class_element=function (sym,env,lex,state,output,len) {return (sym[1].static = true, sym[1])},
R0_js$expression=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[0].push(sym[2]) , sym[0]) : [sym[0], sym[2]];},
R0_js$arguments=function (sym,env,lex,state,output,len) {return [];},
R0_js$argument_list=function (sym,env,lex,state,output,len) {return (sym[0].push(new env.functions.spread_expr(env, sym.slice(2,4))), env[0])},
R0_js$array_literal=function (sym,env,lex,state,output,len) {return [ ]},
R0_js$element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
R1_js$element_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
R0_js$cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return null;},
R1_js$cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new env.functions.spread_expr(env, sym.slice(1,3))},
R2_js$cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env, sym.slice(3,5))) , sym[1]) : [sym[0], new env.functions.spread_expr(env, sym.slice(3,5))];},
R0_html$HTML=function (sym,env,lex,state,output,len) {return sym[1].import_list = sym[0], sym[1]},
R0_html$IMPORT_LIST=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1]), sym[0]},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [(...v)=>((redn(9219,0,...v))),
()=>(330),
()=>(286),
()=>(110),
()=>(374),
()=>(510),
()=>(450),
()=>(198),
()=>(206),
()=>(558),
()=>(566),
()=>(590),
()=>(594),
()=>(598),
()=>(602),
()=>(334),
()=>(478),
()=>(470),
()=>(486),
()=>(378),
()=>(390),
()=>(394),
()=>(398),
()=>(370),
()=>(354),
()=>(406),
()=>(410),
()=>(414),
()=>(422),
()=>(418),
()=>(402),
()=>(426),
()=>(430),
()=>(490),
()=>(238),
()=>(338),
()=>(254),
()=>(202),
()=>(186),
()=>(190),
()=>(194),
()=>(210),
()=>(218),
()=>(222),
()=>(314),
()=>(306),
()=>(310),
()=>(322),
()=>(326),
(...v)=>(redv(5,R0_S,1,0,...v)),
(...v)=>(redn(1031,1,...v)),
()=>(626),
(...v)=>(redv(115719,R0_S,1,0,...v)),
(...v)=>(redv(116743,R0_S,1,0,...v)),
(...v)=>(redv(136199,R0_S,1,0,...v)),
(...v)=>(rednv(137223,fn.stmts,1,0,...v)),
()=>(642),
()=>(638),
(...v)=>(redv(138247,R1_css$import_list,1,0,...v)),
(...v)=>(redn(139271,1,...v)),
(...v)=>(redn(140295,1,...v)),
(...v)=>(redn(144391,1,...v)),
()=>(654),
()=>(682),
()=>(678),
(...v)=>(redv(203783,R0_S,1,0,...v)),
(...v)=>(redn(228359,1,...v)),
(...v)=>(redn(243719,1,...v)),
()=>(686),
()=>(738),
()=>(702),
()=>(706),
()=>(710),
()=>(714),
()=>(718),
()=>(722),
()=>(726),
()=>(730),
()=>(734),
()=>(742),
()=>(746),
()=>(694),
()=>(698),
(...v)=>(redn(230407,1,...v)),
()=>(754),
()=>(750),
(...v)=>(redn(231431,1,...v)),
()=>(758),
(...v)=>(redn(232455,1,...v)),
()=>(762),
(...v)=>(redn(233479,1,...v)),
()=>(766),
(...v)=>(redn(234503,1,...v)),
()=>(770),
(...v)=>(redn(235527,1,...v)),
()=>(774),
()=>(778),
()=>(782),
()=>(786),
(...v)=>(redn(236551,1,...v)),
()=>(790),
()=>(794),
()=>(798),
()=>(810),
()=>(802),
()=>(806),
(...v)=>(redn(237575,1,...v)),
()=>(814),
()=>(818),
()=>(822),
(...v)=>(redn(238599,1,...v)),
()=>(826),
()=>(830),
(...v)=>(redn(239623,1,...v)),
()=>(838),
()=>(842),
()=>(834),
(...v)=>(redn(240647,1,...v)),
(...v)=>(redn(241671,1,...v)),
(...v)=>(redn(242695,1,...v)),
()=>(846),
()=>(882),
()=>(878),
(...v)=>(redn(204807,1,...v)),
()=>(926),
()=>(934),
()=>(938),
(...v)=>(redn(205831,1,...v)),
()=>(946),
()=>(942),
()=>(962),
()=>(966),
(...v)=>(redn(206855,1,...v)),
(...v)=>(rednv(215047,fn.this_expr,1,0,...v)),
(...v)=>(redn(215047,1,...v)),
(...v)=>(redn(188423,1,...v)),
(...v)=>(redn(264199,1,...v)),
(...v)=>(redn(263175,1,...v)),
(...v)=>(redn(265223,1,...v)),
(...v)=>(redn(266247,1,...v)),
(...v)=>(redn(94215,1,...v)),
(...v)=>(rednv(267271,fn.identifier,1,0,...v)),
(...v)=>(redn(92167,1,...v)),
(...v)=>(redn(258055,1,...v)),
(...v)=>(rednv(262151,fn.bool_literal,1,0,...v)),
(...v)=>(rednv(261127,fn.null_literal,1,0,...v)),
(...v)=>(rednv(259079,fn.string_literal,1,0,...v)),
()=>(986),
()=>(990),
()=>(994),
(...v)=>(rednv(260103,fn.numeric_literal,1,0,...v)),
()=>(1002),
()=>(1010),
()=>(1018),
()=>(1022),
(...v)=>(redn(208903,1,...v)),
(...v)=>(redn(210951,1,...v)),
()=>(1034),
()=>(1042),
()=>(1074),
()=>(1078),
(...v)=>(rednv(146439,C0_js$empty_statement,1,0,...v)),
()=>(1082),
(...v)=>(redn(143367,1,...v)),
()=>(1090),
(...v)=>(shftf(1094,I1_js$iteration_statement,...v)),
()=>(1098),
()=>(1102),
()=>(1106),
()=>(1118),
()=>(1126),
()=>(1134),
()=>(1146),
(...v)=>(redn(268295,1,...v)),
(...v)=>(redn(271367,1,...v)),
()=>(1162),
()=>(1190),
()=>(1274),
()=>(1282),
()=>(1278),
()=>(1270),
()=>(1186),
()=>(1174),
()=>(1178),
()=>(1194),
()=>(1198),
()=>(1202),
()=>(1206),
()=>(1210),
()=>(1214),
()=>(1218),
()=>(1222),
()=>(1226),
()=>(1230),
()=>(1234),
()=>(1238),
()=>(1242),
()=>(1246),
()=>(1250),
()=>(1254),
()=>(1258),
()=>(1262),
(...v)=>(redv(269319,R1_css$import_list,1,0,...v)),
(...v)=>(redn(141319,1,...v)),
()=>(1298),
()=>(1302),
(...v)=>(redn(142343,1,...v)),
()=>(1306),
(...v)=>(redv(175111,R0_js$let_or_const,1,0,...v)),
(...v)=>(redv(175111,R1_js$let_or_const,1,0,...v)),
(...v)=>(redn(5127,1,...v)),
(...v)=>(redn(9223,1,...v)),
()=>(1342),
()=>(1338),
(...v)=>(redv(6151,R1_css$import_list,1,0,...v)),
()=>(1350),
()=>(1366),
()=>(1354),
()=>(1362),
()=>(1358),
(...v)=>(redv(8199,R1_css$import_list,1,0,...v)),
(...v)=>(redn(7175,1,...v)),
()=>(1374),
()=>(1370),
(...v)=>(redv(10247,R1_css$import_list,1,0,...v)),
(...v)=>(redv(83975,R0_css$COMPLEX_SELECTOR,1,0,...v)),
()=>(1394),
()=>(1398),
()=>(1402),
()=>(1406),
(...v)=>(rednv(89095,fn.compoundSelector,1,0,...v)),
()=>(1430),
(...v)=>(rednv(91143,fn.selector,1,0,...v)),
()=>(1438),
()=>(1434),
()=>(1442),
(...v)=>(redn(93191,1,...v)),
(...v)=>(redv(84999,R1_css$import_list,1,0,...v)),
(...v)=>(redn(95239,1,...v)),
()=>(1446),
()=>(1450),
()=>(1462),
()=>(1466),
()=>(1474),
(...v)=>(redv(88071,R1_css$import_list,1,0,...v)),
(...v)=>(redn(87047,1,...v)),
()=>(1486),
()=>(1490),
()=>(1494),
(...v)=>(redv(140299,R0_S,2,0,...v)),
(...v)=>(redv(138251,R0_js$statement_list,2,0,...v)),
()=>(1498),
()=>(1526),
()=>(1502),
()=>(1506),
()=>(1530),
(...v)=>(redv(109575,R0_css$declaration_list,1,0,...v)),
()=>(1534),
(...v)=>(redv(109575,R1_css$declaration_list,1,0,...v)),
(...v)=>(redv(106503,R1_css$import_list,1,0,...v)),
(...v)=>(redn(105479,1,...v)),
(...v)=>(redv(147467,R0_S,2,0,...v)),
(...v)=>(rednv(243723,fn.post_inc_expr,2,0,...v)),
(...v)=>(rednv(243723,fn.post_dec_expr,2,0,...v)),
(...v)=>(redn(229383,1,...v)),
(...v)=>(rednv(242699,fn.delete_expr,2,0,...v)),
(...v)=>(rednv(215047,fn.array_literal,1,0,...v)),
(...v)=>(rednv(215047,fn.object,1,0,...v)),
()=>(1662),
()=>(1650),
()=>(1674),
()=>(1678),
()=>(1738),
()=>(1714),
()=>(1718),
()=>(1702),
(...v)=>(redn(178183,1,...v)),
(...v)=>(redn(194567,1,...v)),
(...v)=>(rednv(242699,fn.void_expr,2,0,...v)),
(...v)=>(rednv(242699,fn.typeof_expr,2,0,...v)),
(...v)=>(rednv(242699,fn.plus_expr,2,0,...v)),
(...v)=>(rednv(242699,fn.negate_expr,2,0,...v)),
(...v)=>(rednv(242699,fn.unary_or_expr,2,0,...v)),
(...v)=>(rednv(242699,fn.unary_not_expr,2,0,...v)),
(...v)=>(rednv(243723,fn.pre_inc_expr,2,0,...v)),
(...v)=>(rednv(243723,fn.pre_dec_expr,2,0,...v)),
(...v)=>(rednv(210955,fn.call_expr,2,0,...v)),
()=>(1750),
()=>(1762),
(...v)=>(rednv(193547,fn.call_expr,2,0,...v)),
(...v)=>(rednv(205835,fn.new_expr,2,0,...v)),
()=>(1778),
()=>(1782),
(...v)=>(redn(287751,1,...v)),
(...v)=>(redv(286727,R1_css$general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(285703,1,...v)),
(...v)=>(redn(288775,1,...v)),
()=>(1790),
(...v)=>(redv(245771,R0_js$cover_parenthesized_expression_and_arrow_parameter_list,2,0,...v)),
()=>(1798),
()=>(1794),
(...v)=>(redn(211979,2,...v)),
(...v)=>(rednv(244747,fn.await_expr,2,0,...v)),
()=>(1826),
(...v)=>(rednv(162827,fn.label_stmt,2,0,...v)),
()=>(1846),
()=>(1842),
(...v)=>(redv(172039,R1_css$import_list,1,0,...v)),
(...v)=>(rednv(173063,fn.binding,1,0,...v)),
()=>(1854),
(...v)=>(redn(246791,1,...v)),
()=>(1862),
()=>(1874),
()=>(1894),
()=>(1910),
()=>(1934),
()=>(1946),
()=>(1950),
()=>(1970),
(...v)=>(rednv(152587,fn.continue_stmt,2,0,...v)),
()=>(1978),
(...v)=>(rednv(153611,fn.break_stmt,2,0,...v)),
()=>(1982),
(...v)=>(rednv(154635,fn.return_stmt,2,0,...v)),
()=>(1986),
()=>(1994),
()=>(2006),
()=>(2010),
(...v)=>(rednv(169995,fn.debugger_stmt,2,0,...v)),
(...v)=>(redv(268299,R0_html$HTML,2,0,...v)),
(...v)=>(redv(269323,R0_html$IMPORT_LIST,2,0,...v)),
(...v)=>(redv(271371,R3_js$case_block,2,0,...v)),
()=>(2014),
()=>(2038),
(...v)=>((redn(276483,0,...v))),
()=>(2034),
()=>(2030),
()=>(2062),
()=>(2054),
(...v)=>(redn(280583,1,...v)),
(...v)=>(redn(283655,1,...v)),
(...v)=>(redn(274439,1,...v)),
(...v)=>(redv(282631,R1_css$general_enclosed6202_group_list,1,0,...v)),
(...v)=>(rednv(195595,fn.class_stmt,2,0,...v)),
()=>(2074),
()=>(2102),
()=>(2082),
()=>(2098),
(...v)=>((redn(181251,0,...v))),
()=>(2142),
()=>(2150),
()=>(2146),
(...v)=>(redv(176135,R1_css$import_list,1,0,...v)),
(...v)=>(redn(9227,2,...v)),
(...v)=>(redv(6155,R0_css$import_list,2,0,...v)),
(...v)=>(redv(8203,R0_css$import_list,2,0,...v)),
(...v)=>(redn(14347,2,...v)),
()=>(2170),
()=>(2190),
()=>(2182),
()=>(2186),
()=>(2250),
()=>(2234),
()=>(2254),
()=>(2238),
()=>(2262),
()=>(2306),
()=>(2302),
()=>(2274),
()=>(2282),
(...v)=>(redv(83979,R0_css$COMPLEX_SELECTOR,2,0,...v)),
(...v)=>(redv(82951,R1_css$import_list,1,0,...v)),
(...v)=>(redv(81927,fn.comboSelector,1,0,...v)),
(...v)=>(redn(90119,1,...v)),
(...v)=>(rednv(89099,fn.compoundSelector,2,0,...v)),
(...v)=>(redv(85003,R0_css$import_list,2,0,...v)),
(...v)=>(redv(88075,R0_css$import_list,2,0,...v)),
(...v)=>(rednv(91147,fn.selector,2,0,...v)),
(...v)=>(redn(94219,2,...v)),
(...v)=>(redn(93195,2,...v)),
(...v)=>(rednv(96267,fn.idSelector,2,0,...v)),
(...v)=>(rednv(97291,fn.classSelector,2,0,...v)),
()=>(2354),
()=>(2338),
()=>(2330),
()=>(2342),
()=>(2346),
()=>(2350),
(...v)=>(rednv(103435,fn.pseudoClassSelector,2,0,...v)),
()=>(2362),
(...v)=>(rednv(104459,fn.pseudoElementSelector,2,0,...v)),
(...v)=>(redn(87051,2,...v)),
(...v)=>(redv(86023,R1_css$import_list,1,0,...v)),
(...v)=>(rednv(145423,fn.block,3,0,...v)),
()=>(2370),
(...v)=>(rednv(11279,C0_css$RULE_SET,3,0,...v)),
(...v)=>(redv(109579,R2_css$declaration_list,2,0,...v)),
(...v)=>(redv(109579,R3_css$declaration_list,2,0,...v)),
()=>(2374),
(...v)=>(redv(108551,R1_css$import_list,1,0,...v)),
(...v)=>(redn(107527,1,...v)),
()=>(2394),
()=>(2398),
()=>(2386),
(...v)=>(redv(109579,R0_css$declaration_list,2,0,...v)),
(...v)=>(redv(203791,R0_js$expression,3,0,...v)),
(...v)=>(rednv(228367,fn.assign,3,0,...v)),
()=>(2406),
(...v)=>(rednv(231439,fn.or,3,0,...v)),
(...v)=>(rednv(232463,fn.and,3,0,...v)),
(...v)=>(rednv(233487,fn.bit_or,3,0,...v)),
(...v)=>(rednv(234511,fn.bit_xor,3,0,...v)),
(...v)=>(rednv(235535,fn.bit_and,3,0,...v)),
(...v)=>(rednv(236559,fn.eq,3,0,...v)),
(...v)=>(rednv(236559,fn.neq,3,0,...v)),
(...v)=>(rednv(236559,fn.strict_eq,3,0,...v)),
(...v)=>(rednv(236559,fn.strict_neq,3,0,...v)),
(...v)=>(rednv(237583,fn.lt,3,0,...v)),
(...v)=>(rednv(237583,fn.gt,3,0,...v)),
(...v)=>(rednv(237583,fn.lteq,3,0,...v)),
(...v)=>(rednv(237583,fn.gteq,3,0,...v)),
(...v)=>(rednv(237583,fn.instanceof_expr,3,0,...v)),
(...v)=>(rednv(237583,fn.in,3,0,...v)),
(...v)=>(rednv(238607,fn.l_shift,3,0,...v)),
(...v)=>(rednv(238607,fn.r_shift,3,0,...v)),
(...v)=>(rednv(238607,fn.r_shift_fill,3,0,...v)),
(...v)=>(rednv(239631,fn.add,3,0,...v)),
(...v)=>(rednv(239631,fn.sub,3,0,...v)),
(...v)=>(rednv(240655,fn.mult,3,0,...v)),
(...v)=>(rednv(240655,fn.div,3,0,...v)),
(...v)=>(rednv(240655,fn.mod,3,0,...v)),
(...v)=>(rednv(241679,fn.exp,3,0,...v)),
(...v)=>(redv(224267,R0_js$array_literal,2,0,...v)),
()=>(2414),
()=>(2410),
()=>(2434),
()=>(2426),
(...v)=>(redn(226311,1,...v)),
(...v)=>(redv(225287,R1_css$import_list,1,0,...v)),
(...v)=>(redv(216075,R3_js$class_tail,2,0,...v)),
()=>(2446),
()=>(2442),
(...v)=>(redv(217095,R1_css$import_list,1,0,...v)),
(...v)=>(redn(218119,1,...v)),
()=>(2458),
()=>(2462),
(...v)=>(redn(220167,1,...v)),
(...v)=>(redn(219143,1,...v)),
(...v)=>(rednv(210959,fn.call_expr,3,0,...v)),
()=>(2478),
(...v)=>(redv(213003,R0_js$arguments,2,0,...v)),
()=>(2486),
()=>(2482),
(...v)=>(redv(214023,R1_css$import_list,1,0,...v)),
()=>(2494),
(...v)=>(rednv(206863,fn.member,3,0,...v)),
(...v)=>(rednv(206863,fn.new_member_stmt,3,0,...v)),
(...v)=>(rednv(209935,fn.new_target_expr,3,0,...v)),
(...v)=>(redv(284687,R3_js$case_block,3,0,...v)),
(...v)=>(redv(286731,R0_css$general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(245775,R3_js$case_block,3,0,...v)),
()=>(2498),
()=>(2502),
()=>(2506),
()=>(2510),
(...v)=>(rednv(207887,fn.supper_expr,3,0,...v)),
()=>(2514),
(...v)=>(redv(187407,R0_js$arrow_function,3,0,...v)),
(...v)=>(redn(189447,1,...v)),
(...v)=>(redv(163851,R3_js$case_block,2,0,...v)),
(...v)=>(redn(164871,1,...v)),
(...v)=>(rednv(171023,fn.var_stmt,3,0,...v)),
(...v)=>(rednv(173067,fn.binding,2,0,...v)),
(...v)=>(redn(247819,2,...v)),
()=>(2534),
()=>(2542),
()=>(2538),
(...v)=>(redn(250887,1,...v)),
(...v)=>(redn(253959,1,...v)),
()=>(2550),
(...v)=>(redn(256007,1,...v)),
(...v)=>(redn(248843,2,...v)),
()=>(2562),
()=>(2570),
()=>(2578),
()=>(2574),
(...v)=>(redn(251911,1,...v)),
(...v)=>(redn(252935,1,...v)),
(...v)=>(redn(254983,1,...v)),
()=>(2594),
()=>(2598),
()=>(2602),
()=>(2606),
()=>(2614),
()=>(2638),
()=>(2642),
()=>(2646),
()=>(2650),
()=>(2654),
()=>(2674),
()=>(2686),
(...v)=>(redv(152591,R0_js$continue_statement,3,0,...v)),
(...v)=>(redv(153615,R0_js$break_statement,3,0,...v)),
(...v)=>(rednv(154639,fn.return_stmt,3,0,...v)),
()=>(2690),
(...v)=>(rednv(155663,fn.throw_stmt,3,0,...v)),
(...v)=>(redv(165903,R0_js$try_statement,3,0,...v)),
(...v)=>(redv(165903,R1_js$try_statement,3,0,...v)),
()=>(2698),
()=>(2706),
()=>(2710),
(...v)=>(redv(276487,R1_css$import_list,1,0,...v)),
(...v)=>(rednv(277511,fn.attribute,1,0,...v)),
()=>(2718),
()=>(2722),
()=>(2726),
(...v)=>(redn(278535,1,...v)),
()=>(2730),
()=>(2734),
()=>(2738),
()=>(2742),
(...v)=>(redv(272399,R3_js$class_tail,3,0,...v)),
(...v)=>(redv(282635,R0_css$general_enclosed6202_group_list,2,0,...v)),
()=>(2750),
()=>(2746),
(...v)=>(rednv(195599,fn.class_stmt,3,0,...v)),
()=>(2758),
()=>(2762),
(...v)=>(redv(196619,R3_js$class_tail,2,0,...v)),
(...v)=>(redn(198663,1,...v)),
(...v)=>(redv(199687,R1_css$import_list,1,0,...v)),
(...v)=>(redn(200711,1,...v)),
(...v)=>(redv(197643,R3_js$case_block,2,0,...v)),
()=>(2774),
(...v)=>(redn(181255,1,...v)),
()=>(2778),
(...v)=>(redn(183303,1,...v)),
(...v)=>(redv(182279,R1_css$import_list,1,0,...v)),
(...v)=>(redn(184327,1,...v)),
(...v)=>(rednv(174095,fn.lexical,3,0,...v)),
(...v)=>(rednv(177163,fn.binding,2,0,...v)),
()=>(2794),
(...v)=>(redn(20495,3,...v)),
()=>(2806),
(...v)=>(redv(15367,R1_css$import_list,1,0,...v)),
(...v)=>(redn(16391,1,...v)),
()=>(2814),
()=>(2822),
()=>(2830),
()=>(2826),
(...v)=>(redv(38919,R1_css$import_list,1,0,...v)),
(...v)=>(redn(43015,1,...v)),
()=>(2838),
()=>(2846),
(...v)=>(redn(45063,1,...v)),
(...v)=>(redn(44039,1,...v)),
()=>(2862),
()=>(2870),
()=>(2914),
()=>(2886),
()=>(2890),
(...v)=>(redn(53255,1,...v)),
(...v)=>(redn(72711,1,...v)),
()=>(2926),
(...v)=>(redn(40967,1,...v)),
()=>(2930),
(...v)=>(redn(23559,1,...v)),
()=>(2934),
(...v)=>(redn(33799,1,...v)),
()=>(2954),
()=>(2962),
()=>(2974),
(...v)=>(redn(34823,1,...v)),
(...v)=>(redn(35847,1,...v)),
()=>(2978),
()=>(2982),
()=>(2986),
(...v)=>(redv(10255,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(82955,R0_css$import_list,2,0,...v)),
(...v)=>(redv(81931,fn.comboSelector,2,0,...v)),
(...v)=>(rednv(89103,fn.compoundSelector,3,0,...v)),
(...v)=>(rednv(99343,fn.attribSelector,3,0,...v)),
()=>(2994),
()=>(2998),
()=>(3002),
(...v)=>(redn(100359,1,...v)),
(...v)=>(rednv(103439,fn.pseudoClassSelector,3,0,...v)),
(...v)=>(redv(86027,R0_css$import_list,2,0,...v)),
(...v)=>(rednv(11283,C0_css$RULE_SET,4,0,...v)),
(...v)=>(redv(109583,R3_css$declaration_list,3,0,...v)),
(...v)=>(redv(111631,fn.parseDeclaration,3,0,...v)),
()=>(3022),
(...v)=>(redn(114695,1,...v)),
(...v)=>(redv(113671,R1_css$general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(112647,1,...v)),
(...v)=>(redv(106511,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(224271,R0_js$array_literal,3,0,...v)),
(...v)=>(redn(226315,2,...v)),
(...v)=>(redv(225291,R0_js$element_list,2,0,...v)),
(...v)=>(redv(224271,R3_js$case_block,3,0,...v)),
()=>(3038),
(...v)=>(rednv(227339,fn.spread_expr,2,0,...v)),
(...v)=>(redv(216079,R3_js$case_block,3,0,...v)),
()=>(3054),
(...v)=>(rednv(222219,fn.binding,2,0,...v)),
(...v)=>(rednv(218123,fn.spread_expr,2,0,...v)),
()=>(3074),
()=>(3078),
()=>(3082),
(...v)=>(rednv(210963,fn.call_expr,4,0,...v)),
(...v)=>(redv(213007,R3_js$case_block,3,0,...v)),
()=>(3086),
()=>(3094),
(...v)=>(rednv(214027,fn.spread_expr,2,0,...v)),
(...v)=>(rednv(206867,fn.member,4,0,...v)),
(...v)=>(redv(245779,R3_js$case_block,4,0,...v)),
(...v)=>(redv(245779,R1_js$cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv(207891,fn.supper_expr,4,0,...v)),
()=>(3106),
(...v)=>(redn(186375,1,...v)),
(...v)=>(redv(172047,R0_js$variable_declaration_list,3,0,...v)),
(...v)=>(redv(223243,R3_js$case_block,2,0,...v)),
(...v)=>(redn(247823,3,...v)),
()=>(3114),
(...v)=>(redn(249867,2,...v)),
(...v)=>(redn(256011,2,...v)),
()=>(3126),
(...v)=>(redn(248847,3,...v)),
(...v)=>(redn(252939,2,...v)),
()=>(3130),
(...v)=>(redn(257035,2,...v)),
(...v)=>(redn(254987,2,...v)),
()=>(3162),
()=>(3166),
()=>(3174),
()=>(3178),
()=>(3182),
()=>(3186),
(...v)=>(redn(151559,1,...v)),
()=>(3190),
()=>(3198),
(...v)=>(redn(150539,2,...v)),
()=>(3218),
()=>(3234),
()=>(3242),
(...v)=>(redv(165907,R2_js$try_statement,4,0,...v)),
(...v)=>(rednv(167947,fn.finally_stmt,2,0,...v)),
(...v)=>(shftf(3298,I0_BASIC_BINDING,...v)),
()=>(3278),
(...v)=>((redn(275459,0,...v))),
()=>(3302),
(...v)=>(redv(276491,R0_html$IMPORT_LIST,2,0,...v)),
()=>(3314),
()=>(3322),
()=>(3326),
()=>(3330),
(...v)=>(rednv(273427,fn.element_selector,4,0,...v)),
()=>(3334),
()=>(3338),
()=>(3350),
(...v)=>(rednv(270355,fn.element_selector,4,0,...v)),
()=>(3354),
(...v)=>(redv(196623,R2_js$class_tail,3,0,...v)),
(...v)=>(redv(196623,R1_js$class_tail,3,0,...v)),
(...v)=>(redv(199691,R0_js$class_element_list,2,0,...v)),
(...v)=>(redv(200715,R0_js$class_element,2,0,...v)),
()=>(3358),
(...v)=>(redv(181259,R0_S,2,0,...v)),
()=>(3370),
(...v)=>(redv(176143,R0_js$variable_declaration_list,3,0,...v)),
(...v)=>(redn(20499,4,...v)),
(...v)=>(redv(15371,R0_css$import_list,2,0,...v)),
()=>(3386),
()=>(3394),
()=>(3390),
(...v)=>(redv(79879,R1_css$general_enclosed6202_group_list,1,0,...v)),
()=>(3398),
(...v)=>((redn(13315,0,...v))),
(...v)=>(redn(43019,2,...v)),
(...v)=>(redn(49163,2,...v)),
(...v)=>(redn(52235,2,...v)),
(...v)=>(redv(48135,R1_css$import_list,1,0,...v)),
(...v)=>(redv(51207,R1_css$import_list,1,0,...v)),
(...v)=>(redn(46091,2,...v)),
()=>(3450),
()=>(3454),
()=>(3474),
()=>(3470),
()=>(3462),
(...v)=>(redn(71687,1,...v)),
(...v)=>(redn(54279,1,...v)),
()=>(3486),
()=>(3490),
()=>(3494),
()=>(3498),
()=>(3478),
()=>(3514),
()=>(3518),
()=>(3522),
()=>(3526),
(...v)=>(redn(69639,1,...v)),
()=>(3534),
()=>(3538),
()=>(3542),
()=>(3546),
()=>(3566),
()=>(3562),
()=>(3554),
()=>(3598),
()=>(3586),
()=>(3590),
(...v)=>(redn(33803,2,...v)),
(...v)=>(redv(30727,R1_css$import_list,1,0,...v)),
(...v)=>(redv(32775,R1_css$import_list,1,0,...v)),
()=>(3622),
()=>(3626),
()=>(3634),
()=>(3642),
()=>(3646),
()=>(3650),
(...v)=>(redn(98311,1,...v)),
(...v)=>(redn(100363,2,...v)),
()=>(3654),
(...v)=>(redv(108559,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(111635,fn.parseDeclaration,4,0,...v)),
(...v)=>(redv(114699,R0_css$declaration_values,2,0,...v)),
()=>(3658),
(...v)=>(redv(113675,R0_css$general_enclosed6202_group_list,2,0,...v)),
()=>(3662),
(...v)=>(rednv(230423,fn.condition_expr,5,0,...v)),
(...v)=>(redv(224275,R3_js$case_block,4,0,...v)),
(...v)=>(redv(225295,R1_js$element_list,3,0,...v)),
(...v)=>(redv(216083,R3_js$case_block,4,0,...v)),
(...v)=>(redv(217103,R0_js$formal_parameters,3,0,...v)),
(...v)=>(rednv(218127,fn.property_binding,3,0,...v)),
()=>(3670),
(...v)=>(redn(180231,1,...v)),
()=>(3674),
(...v)=>(redv(221199,R3_js$case_block,3,0,...v)),
(...v)=>(redv(213011,R3_js$case_block,4,0,...v)),
(...v)=>(redv(214031,R0_js$formal_parameters,3,0,...v)),
()=>(3690),
()=>(3694),
(...v)=>(redv(189455,R3_js$case_block,3,0,...v)),
()=>(3698),
(...v)=>(redn(247827,4,...v)),
(...v)=>(redn(250895,3,...v)),
(...v)=>(redn(253967,3,...v)),
(...v)=>(redn(248851,4,...v)),
()=>(3702),
()=>(3710),
(...v)=>(redn(251919,3,...v)),
(...v)=>(rednv(148503,fn.if_stmt,5,0,...v)),
()=>(3714),
()=>(3718),
(...v)=>(rednv(149527,fn.while_stmt,5,0,...v)),
()=>(3722),
()=>(3730),
()=>(3738),
()=>(3750),
()=>(3766),
()=>(3770),
()=>(3778),
()=>(3782),
()=>(3786),
()=>(3790),
()=>(3798),
(...v)=>(rednv(157719,fn.switch_stmt,5,0,...v)),
()=>(3806),
()=>(3826),
()=>(3822),
(...v)=>(rednv(156695,fn.with_stmt,5,0,...v)),
()=>(3830),
(...v)=>(redn(168967,1,...v)),
()=>(3834),
(...v)=>(redv(275463,R1_css$import_list,1,0,...v)),
(...v)=>(redv(275463,R3_js$class_tail,1,0,...v)),
(...v)=>(rednv(281607,fn.text,1,0,...v)),
(...v)=>(redn(2055,1,...v)),
(...v)=>(rednv(273431,fn.element_selector,5,0,...v)),
(...v)=>(rednv(277519,fn.attribute,3,0,...v)),
(...v)=>(redn(279559,1,...v)),
(...v)=>(redv(278543,R3_js$case_block,3,0,...v)),
()=>(3858),
()=>(3862),
(...v)=>(rednv(270359,fn.element_selector,5,0,...v)),
(...v)=>(redv(196627,R0_js$class_tail,4,0,...v)),
(...v)=>((redn(185347,0,...v))),
(...v)=>(redv(181263,R0_js$formal_parameters,3,0,...v)),
(...v)=>(redv(182287,R0_js$formal_parameters,3,0,...v)),
()=>(3874),
(...v)=>(redn(20503,5,...v)),
()=>(3894),
(...v)=>(redn(80911,3,...v)),
(...v)=>(redv(79883,R0_css$general_enclosed6202_group_list,2,0,...v)),
()=>(3898),
()=>(3902),
(...v)=>(redn(13319,1,...v)),
(...v)=>(redv(12295,R1_css$import_list,1,0,...v)),
(...v)=>(redv(38927,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(43023,3,...v)),
(...v)=>(redn(41995,2,...v)),
(...v)=>(redv(48139,R0_css$import_list,2,0,...v)),
(...v)=>(redv(51211,R0_css$import_list,2,0,...v)),
(...v)=>(redn(47115,2,...v)),
(...v)=>(redn(50187,2,...v)),
(...v)=>(redn(53263,3,...v)),
(...v)=>(redn(55311,3,...v)),
()=>(3910),
(...v)=>(redn(60431,3,...v)),
(...v)=>(redv(59399,R1_css$general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(58375,1,...v)),
()=>(3926),
(...v)=>(redn(62471,1,...v)),
()=>(3934),
()=>(3942),
()=>(3946),
(...v)=>(redn(63495,1,...v)),
()=>(3950),
(...v)=>(redn(76811,2,...v)),
()=>(3954),
(...v)=>(redn(75783,1,...v)),
()=>(3958),
(...v)=>(redv(57351,R1_css$general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(56327,1,...v)),
()=>(3966),
(...v)=>(redv(21511,R1_css$import_list,1,0,...v)),
()=>(3978),
()=>(3974),
(...v)=>(redv(24583,R1_css$import_list,1,0,...v)),
(...v)=>(redn(27655,1,...v)),
()=>(3982),
()=>(3986),
(...v)=>(redv(30731,R0_css$import_list,2,0,...v)),
(...v)=>(redv(32779,R0_css$import_list,2,0,...v)),
(...v)=>(redn(29707,2,...v)),
(...v)=>(redn(31755,2,...v)),
(...v)=>(redn(34831,3,...v)),
(...v)=>(redn(36879,3,...v)),
()=>(3990),
(...v)=>(rednv(11287,C0_css$RULE_SET,5,0,...v)),
()=>(3994),
(...v)=>(rednv(99351,fn.attribSelector,5,0,...v)),
(...v)=>(redn(101383,1,...v)),
(...v)=>(redn(102415,3,...v)),
(...v)=>(redn(110603,2,...v)),
(...v)=>(redv(114703,R0_css$declaration_values,3,0,...v)),
(...v)=>(redv(225299,R1_js$element_list,4,0,...v)),
()=>(3998),
()=>(4002),
()=>(4006),
(...v)=>(redn(202759,1,...v)),
(...v)=>(redv(214035,R0_js$argument_list,4,0,...v)),
(...v)=>(redv(245787,R2_js$cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
(...v)=>(redn(247831,5,...v)),
(...v)=>(redn(248855,5,...v)),
()=>(4010),
()=>(4018),
()=>(4026),
()=>(4030),
()=>(4038),
(...v)=>(redv(149531,R8_js$iteration_statement,6,0,...v)),
()=>(4046),
()=>(4054),
()=>(4058),
()=>(4062),
()=>(4066),
(...v)=>(redv(149531,R15_js$iteration_statement,6,0,...v)),
()=>(4094),
()=>(4102),
(...v)=>(redv(158731,R0_js$case_block,2,0,...v)),
()=>(4110),
()=>(4122),
(...v)=>(redv(159751,R1_css$import_list,1,0,...v)),
(...v)=>(redv(161799,R1_js$default_clause,1,0,...v)),
()=>(4130),
(...v)=>(redv(275467,R0_html$IMPORT_LIST,2,0,...v)),
()=>(4146),
()=>(4142),
()=>(4150),
()=>(4154),
()=>(4158),
()=>(4162),
()=>(4166),
(...v)=>(redn(185351,1,...v)),
(...v)=>(redn(20507,6,...v)),
()=>(4174),
(...v)=>(redn(17415,1,...v)),
(...v)=>(redn(77843,4,...v)),
(...v)=>(redn(39963,6,...v)),
(...v)=>(redv(12299,R0_css$import_list,2,0,...v)),
(...v)=>(redn(60435,4,...v)),
(...v)=>(redv(59403,R0_css$general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redn(61455,3,...v)),
(...v)=>(redn(68623,3,...v)),
(...v)=>(redn(62475,2,...v)),
()=>(4182),
()=>(4190),
()=>(4194),
(...v)=>(redn(63499,2,...v)),
(...v)=>(redn(73743,3,...v)),
(...v)=>(redv(57355,R0_css$general_enclosed6202_group_list,2,0,...v)),
(...v)=>(rednv(22555,C0_css$keyframes,6,0,...v)),
(...v)=>(redv(21515,R0_css$import_list,2,0,...v)),
(...v)=>(redn(74763,2,...v)),
(...v)=>(redn(28699,6,...v)),
(...v)=>(redn(37907,4,...v)),
(...v)=>(rednv(99355,fn.attribSelector,6,0,...v)),
()=>(4214),
(...v)=>(redn(248859,6,...v)),
(...v)=>(rednv(148511,fn.if_stmt,7,0,...v)),
(...v)=>(rednv(149535,fn.do_while_stmt,7,0,...v)),
(...v)=>(shftf(4218,I2_js$iteration_statement,...v)),
(...v)=>(redv(149535,R7_js$iteration_statement,7,0,...v)),
(...v)=>(redv(149535,R6_js$iteration_statement,7,0,...v)),
()=>(4238),
()=>(4242),
(...v)=>(redv(149535,R13_js$iteration_statement,7,0,...v)),
(...v)=>(redv(149535,R14_js$iteration_statement,7,0,...v)),
(...v)=>(redv(149535,R16_js$iteration_statement,7,0,...v)),
(...v)=>(redv(149535,R18_js$iteration_statement,7,0,...v)),
()=>(4266),
()=>(4278),
(...v)=>(redv(158735,R3_js$case_block,3,0,...v)),
(...v)=>(redv(159755,R0_js$case_clauses,2,0,...v)),
()=>(4282),
()=>(4286),
(...v)=>(rednv(166935,fn.catch_stmt,5,0,...v)),
()=>(4294),
()=>(4298),
(...v)=>(rednv(3087,fn.wick_binding,3,0,...v)),
(...v)=>(redv(279567,R3_js$case_block,3,0,...v)),
(...v)=>(rednv(273439,fn.element_selector,7,0,...v)),
()=>(4302),
()=>(4306),
(...v)=>(redv(179231,R0_js$function_declaration,7,0,...v)),
()=>(4310),
(...v)=>(redn(18451,4,...v)),
(...v)=>(redn(65543,1,...v)),
()=>(4318),
(...v)=>(redn(67591,1,...v)),
()=>(4334),
()=>(4330),
(...v)=>(redv(24591,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
()=>(4338),
()=>(4342),
(...v)=>(redv(149539,R5_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R4_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R3_js$iteration_statement,8,0,...v)),
()=>(4354),
(...v)=>(redv(149539,R12_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R17_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R18_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R0_js$iteration_statement,8,0,...v)),
(...v)=>(redv(149539,R19_js$iteration_statement,8,0,...v)),
()=>(4370),
(...v)=>(redv(158739,R2_js$case_block,4,0,...v)),
(...v)=>(redv(160783,R1_js$case_clause,3,0,...v)),
(...v)=>(redv(161807,R0_js$default_clause,3,0,...v)),
(...v)=>(rednv(273443,fn.element_selector,8,0,...v)),
()=>(4382),
()=>(4386),
(...v)=>(redv(179235,R1_js$function_declaration,8,0,...v)),
(...v)=>(redn(68631,5,...v)),
(...v)=>(redn(65547,2,...v)),
()=>(4390),
(...v)=>(rednv(26643,C0_css$keyframes_blocks,4,0,...v)),
(...v)=>(redn(25607,1,...v)),
(...v)=>(rednv(201759,fn.class_method,7,0,...v)),
(...v)=>(rednv(201759,fn.class_get_method,7,0,...v)),
()=>(4394),
(...v)=>(redv(149543,R0_js$iteration_statement,9,0,...v)),
(...v)=>(redv(149543,R10_js$iteration_statement,9,0,...v)),
(...v)=>(redv(149543,R11_js$iteration_statement,9,0,...v)),
(...v)=>(redv(149543,R20_js$iteration_statement,9,0,...v)),
(...v)=>(redv(158743,R1_js$case_block,5,0,...v)),
(...v)=>(redv(160787,R0_js$case_clause,4,0,...v)),
()=>(4402),
(...v)=>(rednv(273447,fn.element_selector,9,0,...v)),
(...v)=>(rednv(26647,C0_css$keyframes_blocks,5,0,...v)),
(...v)=>(rednv(201763,fn.class_set_method,8,0,...v)),
(...v)=>(redv(149547,R9_js$iteration_statement,10,0,...v)),
(...v)=>(rednv(4123,fn.wick_binding,6,0,...v))],

    //Goto Lookup Functions
    goto = [v=>lsm(v,gt0),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt1),
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
v=>lsm(v,gt3),
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
v=>lsm(v,gt4),
v=>lsm(v,gt5),
v=>lsm(v,gt6),
v=>lsm(v,gt7),
v=>lsm(v,gt8),
v=>lsm(v,gt9),
v=>lsm(v,gt10),
nf,
v=>lsm(v,gt11),
v=>lsm(v,gt12),
nf,
v=>lsm(v,gt13),
v=>lsm(v,gt14),
v=>lsm(v,gt15),
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
v=>lsm(v,gt16),
v=>lsm(v,gt17),
nf,
v=>lsm(v,gt18),
v=>lsm(v,gt19),
nf,
nf,
nf,
v=>lsm(v,gt20),
nf,
nf,
v=>lsm(v,gt21),
v=>lsm(v,gt22),
nf,
nf,
nf,
nf,
v=>lsm(v,gt23),
nf,
nf,
nf,
v=>lsm(v,gt24),
v=>lsm(v,gt25),
v=>lsm(v,gt26),
nf,
v=>lsm(v,gt27),
v=>lsm(v,gt28),
nf,
nf,
v=>lsm(v,gt29),
nf,
v=>lsm(v,gt30),
v=>lsm(v,gt31),
nf,
nf,
nf,
nf,
v=>lsm(v,gt32),
nf,
v=>lsm(v,gt33),
v=>lsm(v,gt34),
nf,
nf,
nf,
v=>lsm(v,gt35),
v=>lsm(v,gt36),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt37),
v=>lsm(v,gt38),
v=>lsm(v,gt39),
v=>lsm(v,gt40),
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
v=>lsm(v,gt41),
v=>lsm(v,gt42),
nf,
v=>lsm(v,gt43),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt44),
nf,
v=>lsm(v,gt1),
v=>lsm(v,gt45),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt46),
v=>lsm(v,gt47),
v=>lsm(v,gt48),
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
v=>lsm(v,gt68),
v=>lsm(v,gt69),
v=>lsm(v,gt70),
v=>lsm(v,gt71),
v=>lsm(v,gt72),
v=>lsm(v,gt73),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt74),
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
nf,
v=>lsm(v,gt76),
nf,
v=>lsm(v,gt77),
v=>lsm(v,gt78),
v=>lsm(v,gt79),
v=>lsm(v,gt80),
nf,
nf,
v=>lsm(v,gt81),
nf,
nf,
nf,
v=>lsm(v,gt82),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt83),
nf,
v=>lsm(v,gt84),
v=>lsm(v,gt85),
nf,
nf,
v=>lsm(v,gt86),
nf,
v=>lsm(v,gt87),
nf,
nf,
v=>lsm(v,gt88),
v=>lsm(v,gt89),
nf,
nf,
nf,
v=>lsm(v,gt90),
v=>lsm(v,gt91),
v=>lsm(v,gt92),
nf,
v=>lsm(v,gt93),
v=>lsm(v,gt94),
nf,
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
nf,
nf,
nf,
nf,
v=>lsm(v,gt98),
v=>lsm(v,gt99),
v=>lsm(v,gt100),
v=>lsm(v,gt101),
v=>lsm(v,gt102),
v=>lsm(v,gt103),
v=>lsm(v,gt104),
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
v=>lsm(v,gt105),
nf,
nf,
v=>lsm(v,gt106),
v=>lsm(v,gt107),
v=>lsm(v,gt108),
nf,
nf,
nf,
v=>lsm(v,gt109),
v=>lsm(v,gt110),
v=>lsm(v,gt36),
nf,
v=>lsm(v,gt111),
nf,
nf,
nf,
v=>lsm(v,gt112),
v=>lsm(v,gt113),
v=>lsm(v,gt114),
v=>lsm(v,gt115),
v=>lsm(v,gt116),
v=>lsm(v,gt117),
v=>lsm(v,gt118),
nf,
v=>lsm(v,gt119),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt120),
v=>lsm(v,gt40),
v=>lsm(v,gt40),
nf,
nf,
v=>lsm(v,gt42),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt121),
nf,
nf,
v=>lsm(v,gt122),
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
nf,
nf,
v=>lsm(v,gt124),
v=>lsm(v,gt125),
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
v=>lsm(v,gt126),
v=>lsm(v,gt127),
nf,
nf,
nf,
v=>lsm(v,gt128),
nf,
nf,
nf,
nf,
v=>lsm(v,gt129),
nf,
v=>lsm(v,gt130),
nf,
nf,
v=>lsm(v,gt131),
v=>lsm(v,gt132),
nf,
nf,
nf,
nf,
v=>lsm(v,gt133),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt134),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt46),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt135),
nf,
nf,
nf,
nf,
v=>lsm(v,gt136),
nf,
v=>lsm(v,gt137),
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
v=>lsm(v,gt140),
nf,
nf,
v=>lsm(v,gt141),
nf,
nf,
nf,
v=>lsm(v,gt142),
nf,
nf,
nf,
nf,
v=>lsm(v,gt143),
v=>lsm(v,gt144),
v=>lsm(v,gt145),
v=>lsm(v,gt3),
nf,
v=>lsm(v,gt146),
v=>lsm(v,gt147),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt148),
nf,
nf,
v=>lsm(v,gt149),
nf,
v=>lsm(v,gt150),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt150),
v=>lsm(v,gt150),
v=>lsm(v,gt150),
nf,
nf,
nf,
v=>lsm(v,gt150),
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
v=>lsm(v,gt154),
nf,
v=>lsm(v,gt155),
nf,
nf,
v=>lsm(v,gt156),
v=>lsm(v,gt157),
nf,
nf,
nf,
v=>lsm(v,gt158),
v=>lsm(v,gt159),
nf,
nf,
nf,
nf,
v=>lsm(v,gt160),
v=>lsm(v,gt161),
nf,
nf,
nf,
nf,
v=>lsm(v,gt162),
v=>lsm(v,gt163),
v=>lsm(v,gt164),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt165),
v=>lsm(v,gt166),
v=>lsm(v,gt167),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt45),
nf,
nf,
nf,
v=>lsm(v,gt40),
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
v=>lsm(v,gt171),
v=>lsm(v,gt172),
v=>lsm(v,gt173),
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
v=>lsm(v,gt175),
nf,
nf,
v=>lsm(v,gt176),
nf,
nf,
v=>lsm(v,gt177),
v=>lsm(v,gt178),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt179),
nf,
nf,
nf,
v=>lsm(v,gt180),
nf,
nf,
nf,
nf,
v=>lsm(v,gt1),
nf,
nf,
nf,
nf,
v=>lsm(v,gt181),
nf,
v=>lsm(v,gt182),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt183),
nf,
nf,
nf,
v=>lsm(v,gt184),
v=>lsm(v,gt185),
v=>lsm(v,gt186),
v=>lsm(v,gt187),
nf,
v=>lsm(v,gt188),
nf,
nf,
v=>lsm(v,gt88),
v=>lsm(v,gt89),
nf,
v=>lsm(v,gt189),
v=>lsm(v,gt190),
v=>lsm(v,gt191),
v=>lsm(v,gt192),
v=>lsm(v,gt193),
nf,
v=>lsm(v,gt109),
v=>lsm(v,gt110),
nf,
v=>lsm(v,gt194),
nf,
v=>lsm(v,gt195),
v=>lsm(v,gt196),
v=>lsm(v,gt197),
nf,
v=>lsm(v,gt198),
nf,
v=>lsm(v,gt199),
nf,
nf,
v=>lsm(v,gt200),
nf,
nf,
nf,
nf,
v=>lsm(v,gt201),
v=>lsm(v,gt202),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt203),
nf,
nf,
v=>lsm(v,gt204),
nf,
v=>lsm(v,gt205),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt206),
v=>lsm(v,gt207),
v=>lsm(v,gt208),
v=>lsm(v,gt209),
nf,
nf,
v=>lsm(v,gt210),
v=>lsm(v,gt211),
v=>lsm(v,gt212),
nf,
v=>lsm(v,gt213),
nf,
v=>lsm(v,gt214),
nf,
nf,
nf,
v=>lsm(v,gt215),
v=>lsm(v,gt163),
nf,
nf,
nf,
v=>lsm(v,gt216),
v=>lsm(v,gt217),
v=>lsm(v,gt218),
nf,
nf,
v=>lsm(v,gt219),
v=>lsm(v,gt220),
v=>lsm(v,gt221),
nf,
v=>lsm(v,gt222),
v=>lsm(v,gt223),
nf,
v=>lsm(v,gt224),
nf,
v=>lsm(v,gt225),
nf,
nf,
v=>lsm(v,gt215),
v=>lsm(v,gt226),
nf,
nf,
v=>lsm(v,gt227),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt228),
nf,
nf,
v=>lsm(v,gt228),
nf,
nf,
nf,
nf,
v=>lsm(v,gt229),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt230),
nf,
nf,
nf,
v=>lsm(v,gt231),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt232),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt233),
v=>lsm(v,gt234),
nf,
v=>lsm(v,gt235),
v=>lsm(v,gt236),
v=>lsm(v,gt237),
v=>lsm(v,gt238),
v=>lsm(v,gt239),
nf,
v=>lsm(v,gt240),
nf,
nf,
nf,
nf,
v=>lsm(v,gt241),
nf,
nf,
nf,
v=>lsm(v,gt242),
nf,
v=>lsm(v,gt243),
nf,
nf,
nf,
nf,
v=>lsm(v,gt244),
nf,
nf,
nf,
v=>lsm(v,gt31),
v=>lsm(v,gt103),
nf,
nf,
nf,
v=>lsm(v,gt245),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt246),
nf,
nf,
v=>lsm(v,gt247),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt248),
nf,
nf,
nf,
v=>lsm(v,gt249),
nf,
nf,
v=>lsm(v,gt250),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt251),
nf,
nf,
nf,
nf,
v=>lsm(v,gt252),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt253),
nf,
nf,
nf,
nf,
v=>lsm(v,gt254),
v=>lsm(v,gt255),
nf,
nf,
nf,
nf,
v=>lsm(v,gt256),
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
v=>lsm(v,gt257),
nf,
nf,
nf,
nf,
v=>lsm(v,gt258),
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
v=>lsm(v,gt259),
nf,
v=>lsm(v,gt260),
nf,
v=>lsm(v,gt261),
nf,
v=>lsm(v,gt262),
nf,
nf,
v=>lsm(v,gt263),
nf,
nf,
nf,
v=>lsm(v,gt264),
v=>lsm(v,gt265),
nf,
v=>lsm(v,gt266),
v=>lsm(v,gt267),
v=>lsm(v,gt268),
v=>lsm(v,gt269),
nf,
v=>lsm(v,gt270),
nf,
nf,
v=>lsm(v,gt271),
v=>lsm(v,gt272),
nf,
v=>lsm(v,gt273),
nf,
v=>lsm(v,gt274),
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
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt277),
v=>lsm(v,gt278),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt279),
v=>lsm(v,gt280),
nf,
nf,
nf,
nf,
v=>lsm(v,gt281),
v=>lsm(v,gt282),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt283),
v=>lsm(v,gt284),
nf,
v=>lsm(v,gt285),
nf,
v=>lsm(v,gt286),
nf,
v=>lsm(v,gt287),
v=>lsm(v,gt288),
v=>lsm(v,gt289),
v=>lsm(v,gt290),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt291),
nf,
v=>lsm(v,gt292),
v=>lsm(v,gt293),
nf,
nf,
v=>lsm(v,gt294),
nf,
nf,
v=>lsm(v,gt295),
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
v=>lsm(v,gt296),
nf,
v=>lsm(v,gt297),
nf,
nf,
v=>lsm(v,gt298),
nf,
nf,
nf,
v=>lsm(v,gt299),
v=>lsm(v,gt300),
nf,
nf,
nf,
nf,
v=>lsm(v,gt301),
v=>lsm(v,gt302),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt303),
nf,
nf,
nf,
nf,
v=>lsm(v,gt304),
v=>lsm(v,gt1),
nf,
v=>lsm(v,gt305),
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
v=>lsm(v,gt306),
nf,
nf,
nf,
nf,
v=>lsm(v,gt1),
nf,
nf,
nf,
nf,
nf,
nf,
nf];

function getToken(l, SYM_LU) {
    if (l.END) return 0; /*8*/

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

                    if (tk == "$")
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
		number:1,
		string:2,
		id:3,
		object:4,
		null:5,
		stmts:6,
		for:7,
		lex:8,
		var:9,
		const:10,
		try:11,
		catch:12,
		finally:13,
		while:14,
		do:15,
		add:16,
		sub:17,
		mult:18,
		div:19,
		mod:20,
		strict_eq:21,
		exp:22,
		shift_r:23,
		shift_l:24,
		shift_l_fill:25,
		array:26,
		function:27,
		bool:28,
		label:29,
		new:30,
		lt:31,
		gt:32,
		lte:33,
		gte:34,
		assign:35,
		assignment:35,
		equal:36,
		or:37,
		and:38,
		bit_or:39,
		bit_and:40,
		member:41,
		call:42,
		return:43,
		if:44,
		post_inc:45,
		post_dec:46,
		pre_inc:47,
		pre_dec:48,
		condition:49,
		class:50,
		negate:51,
		array_literal:52,
		this_expr:53,
		prop_bind:54,
		function_declaration:55,
		debugger:56
	};

class base{
	constructor(){
	}
	getRootIds(ids) {}
	*traverseDepthFirst (){ yield this; }
	skip (trvs) {

		for(let val = trvs.next().value; val && val !== this ;val = trvs.next().value);

		return trvs;
	}
	spin(trvs){
        let val = trvs.next().value;
        while(val !== undefined && val !== this ){val = trvs.next().value;};
     }
     toString(){return this.render()}
     render(){return ""}
}

/** FOR **/
class for_stmt extends base{
	constructor(init,bool,iter, body){super();this.init = init; this.bool = bool, this.iter=iter, this.body = body;}
	
	getRootIds(ids, closure){
		
		closure = new Set([...closure.values()]);

		if(this.bool) this.bool.getRootIds(ids,closure);
		if(this.iter) this.iter.getRootIds(ids,closure);
		if(this.body) this.body.getRootIds(ids,closure);
	}

	*traverseDepthFirst (){ 
	 	yield this;
	 	if(this.init) yield * this.init.traverseDepthFirst();
	 	if(this.bool) yield * this.bool.traverseDepthFirst();
	 	if(this.iter) yield * this.iter.traverseDepthFirst();
	 	if(this.body) yield * this.body.traverseDepthFirst();
	 	yield this;
	 }

	 get type () { return types.for }

	 render(){
	 	let init, bool, iter, body;
	 	
	 	if(this.init) init = this.init.render();
	 	if(this.bool) bool = this.bool.render();
	 	if(this.iter) iter = this.iter.render();
	 	if(this.body) body = this.body.render();

	 	return `for(${init};${bool};${iter})${body}`}
}

/** IDENTIFIER **/
class identifier$2 extends base{
	 constructor (sym){super(); this.val = sym[0]; this.root = true;}
	 getRootIds(ids, closuere){if(!closuere.has(this.val))ids.add(this.val);}
	 *traverseDepthFirst (){ 
	 	yield this;
	 }

	 get name () {return this.val}

	 get type () { return types.id }

	 render  () { return this.val}
}

class call_expr extends base {
    constructor(sym) {

        super();
        this.id = sym[0];
        this.args = sym[1];
    }

    getRootIds(ids, closure) {
        this.id.getRootIds(ids, closure);
        this.args.forEach(e => e.getRootIds(ids, closure));
    }

    *traverseDepthFirst (){ 
        yield this;
        yield * this.id.traverseDepthFirst();
        for(let arg of this.args)
            yield * arg.traverseDepthFirst();
     }

    get name() { return this.id.name }
    get type() { return types.call }
    render() { return `${this.id.render()}(${this.args.map(a=>a.render()).join(",")})` }
}

/** CATCH **/
class catch_stmt extends base {
    constructor(sym) {
        super();
        this.param = sym[2];
        this.body = sym[4];
    }

    getRootIds(ids,closure) {
        if (this.body) this.body.getRootIds(ids,closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.param.traverseDepthFirst();
	 	yield * this.body.traverseDepthFirst();
	 	yield this;
	 }

     get type () { return types.catch }
}

/** TRY **/
class try_stmt extends base {
    constructor(body, _catch, _finally) {
        super();
        this.catch = _catch;
        this.body = body;
        this.finally = _finally;
    }

    getRootIds(ids,clsr) {
        this.body.getRootIds(ids,clsr);
        if (this.catch) this.catch.getRootIds(ids,clsr);
        if (this.finally) this.finally.getRootIds(ids,clsr);
    }

    *traverseDepthFirst (){ 
        yield this;
        if(this.body) yield * this.body.traverseDepthFirst();
        if(this.catch) yield * this.catch.traverseDepthFirst();
        if(this.finally) yield * this.finally.traverseDepthFirst();
        yield this;
     }

     get type () { return types.try }
}

/** STATEMENTS **/
class Statements extends base {
    constructor(sym) {
        super();
        this.stmts = sym[0];
    }

    getRootIds(ids, closure) {
        this.stmts.forEach(s=>s.getRootIds(ids, closure));
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	for(let stmt of this.stmts){
            if(!stmt.traverseDepthFirst) continue; // kludge for empty statements
	 		yield * stmt.traverseDepthFirst();
        }
	 	yield this;
	 }

     get type () { return types.stmts }

     render(){return `${this.stmts.map(s=>s.render()).join(";\n")}`};
}

/** BLOCK **/
class block extends Statements {

    constructor(sym,clsr) {
        super([sym[1]]);
    }

    getRootIds(ids, closure) {
    	super.getRootIds(ids, new Set([...closure.values()]));
    }

    get type () { return types.block }
}

/** LEXICAL DECLARATION **/
class lexical extends base {
    constructor(sym) {

    	super();
    	this.mode = sym[0];
        this.bindings = sym[1];
    }

    getRootIds(ids, closure) {
    	this.bindings.forEach(b=>b.getRootIds(ids, closure));
    }

    get type () { return types.lex }

    render(){return `${this.mode} ${this.bindings.map(b=>b.render()).join(",")};`}
}

/** BINDING DECLARATION **/
class binding extends base {
    constructor(sym) {
        super();
        this.id = sym[0];
        this.id.root = false;
        this.init = sym[1] ? sym[1] : null;
    }

    getRootIds(ids, closure) {
        this.id.getRootIds(closure, closure);
        if (this.init) this.init.getRootIds(ids, closure);
    }

    * traverseDepthFirst() {
        yield this;
        yield* this.id.traverseDepthFirst();
        yield* this.init.traverseDepthFirst();
    }

    render() { return `${this.id}${this.init ? ` = ${this.init.render()}` : ""}` }
}

/** MEMBER **/

class mem extends base {
    constructor(sym) { super();
        this.id = sym[0];
        this.mem = sym[2];
        this.root = true;
        this.mem.root = false; 
    }

    getRootIds(ids, closuere) {
        this.id.getRootIds(ids, closuere);
    }

    * traverseDepthFirst() {
        yield this;
        yield* this.id.traverseDepthFirst();
        yield* this.mem.traverseDepthFirst();
        //yield this;
    }

    get name() { return this.id.name }
    get type() { return types.member }

    render() { return `${this.id.render()}.${this.mem.render()}` }
}

/** ASSIGNEMENT EXPRESSION **/

class assign extends base {
    constructor(sym) {
        super();
        this.id = sym[0];
        this.op = sym[1];
        this.expr = sym[2];
    }

    getRootIds(ids, closure) {
    	this.id.getRootIds(ids, closure);
    	this.expr.getRootIds(ids, closure);
    }

    *traverseDepthFirst (){ 
        yield this;
        yield * this.id.traverseDepthFirst();
        yield * this.expr.traverseDepthFirst();
        //yield this;
     }

    get type () { return types.assign }

    render(){return `${this.id.render()} ${this.op} ${this.expr.render()}`}
}

/** OPERATOR **/
class operator$1 extends base {

    constructor(sym) {
        super();
        this.left = sym[0];
        this.right = sym[2];
        this.op = "";
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.left.traverseDepthFirst();
	 	yield * this.right.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.left.render()} ${this.op} ${this.right.render()}` }
}

/** MULTIPLY **/
class add extends operator$1 {

    constructor(sym) {
        super(sym);
       	this.op = "+";
    }

    get type () { return types.add }
}

/** EXPONENT **/
class exp extends operator$1 {

    constructor(sym) {
        super(sym);
       	this.op = "**";
    }

    get type () { return types.exp }
}

/** SUBTRACT **/
class sub extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "-";
    }

    get type () { return types.sub }
}

/** MULTIPLY **/
class div extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "/";
    }

    get type () { return types.div }
}

/** MULTIPLY **/
class mult extends operator$1 {

    constructor(sym) {
        super(sym);
        this.op = "*";
    }

    get type () { return types.mult }

    
}

/** OBJECT **/

class object extends base {
    constructor(sym) {
        super();
    this.props = sym[0] || [];
    }

    * traverseDepthFirst (){ 
	 	yield this;
	 	for(let prop of this.props)
	 		yield * prop.traverseDepthFirst();
	 	yield this;
	 }

	 get type () { return types.object }

	 render(){return `{${this.props.map(p=>p.render()).join(",")}}`}
}

/** DEBUGGER STATEMENT  **/

class debugger_stmt extends base {
    constructor() {
        super();
    }

    getRootIds(ids, closure) {
        if (this.expr) this.expr.getRootIds(ids, closure);
    }

    * traverseDepthFirst() {
        yield this;
    }

    get type() { return types.debugger }

    render() { return `debugger` }
}

/** STRING **/

class string$2 extends base{
	 constructor (sym){super(); this.val = sym[0];}
	 getRootIds(ids, closuere){if(!closuere.has(this.val))ids.add(this.val);}

     get type () { return types.string }

     render(){return `"${this.val}"`}

}

/** NULL **/
class null_ extends base{
	 constructor (sym){super();}
	 get type () { return types.null }

	 render(){return "null"}
}

/** NUMBER **/
class number$2 extends base{
	 constructor (sym){super();this.val = parseFloat(sym); this.ty = "num";}
	 get type () { return types.number }
	 render(){return this.val}
}

/** BOOLEAN **/

class bool$1 extends base{
	 constructor (sym){super();this.val = sym[0].slice(1) == "true";}

     get type () { return types.bool }

}

/** OPERATOR **/
class unary_prefix_op extends base {

    constructor(sym) {
        super();
        this.expr = sym[1];
        this.op = "";
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.expr.traverseDepthFirst();
	 	yield this;
	 }

     render(){return `${this.op}${this.expr.render()}` }
}

/** NEGATE **/

class negate extends unary_prefix_op{
	 constructor (sym){super(sym);this.val = parseFloat(sym); this.op = "-";}
	 get type () { return types.negate }
}

/** RETURN STATMENT  **/



class rtrn extends base {
    constructor(sym) {
        super();
        this.expr = (sym.length > 2) ? sym[1] : null;
    }

    getRootIds(ids,closure) {
        if (this.expr) this.expr.getRootIds(ids,closure);
    }

    *traverseDepthFirst (){ 
	 	yield this;
	 	yield * this.expr.traverseDepthFirst();
	 }

     get type () { return types.return }

     render  () { return `return ${(this.expr) ? this.expr.render() : ""};`}
}

/** LESS_THAN **/
class lt extends operator$1 {

    constructor(sym) {
        super(sym);
       	this.op = "<";
    }

    get type () { return types.lt }
}

/** EQUALITY **/
class eq extends operator$1 {

    constructor(sym) {
        super(sym);
       	this.op = "==";
    }

    get type () { return types.eq }
}

/** CONDITION EXPRESSIONS **/
class condition extends base {
    constructor(sym) {
        super();

        this.bool = sym[0];
        this.left = sym[2];
        this.right = sym[4];
    }

    getRootIds(ids, closure) {
        this.bool.getRootIds(ids, closure);
        this.left.getRootIds(ids, closure);
        this.right.getRootIds(ids, closure);
    }

    * traverseDepthFirst() {
        yield this;
        yield* this.bool.traverseDepthFirst();
        yield* this.left.traverseDepthFirst();
        yield* this.right.traverseDepthFirst();
    }

    get type() { return types.condition }

    render() {
        let
            bool = this.bool.render(),
            left = this.left.render(),
            right = this.right.render();

        return `${bool} ? ${left} : ${right}`
    }
}

class array_literal extends base {
    constructor(sym) {
        super();
        this.exprs = sym[0];
    }

    getRootIds(ids, closure) {
        this.exprs.forEach(e => e.getRootIds(ids, closure));
    }

    * traverseDepthFirst() {
        yield this;
        for (let expr of this.exprs)
            yield* expr.traverseDepthFirst();
    }

    get name() { return this.id.name }
    
    get type() { return types.array_literal }

    render() { return `[${this.exprs.map(a=>a.render()).join(",")}]` }
}

/** THIS EXPRESSION  **/



class this_expr extends base {
    constructor() {
        super();
        this.root = false;
    }

    getRootIds(ids, closure) {
        if (this.expr) this.expr.getRootIds(ids, closure);
    }

    * traverseDepthFirst() {
        yield this;
    }
    get name() { return "this" }
    get type() { return types.this_expr }

    render() { return `this` }
}

/** PROPERTY BINDING DECLARATION **/
class property_binding extends binding {
    constructor(sym) {
        super([sym[0], sym[2]]);
    }
    get type( ){return types.prop_bind}
    render() { return `${this.id.type > 4 ? `[${this.id.render()}]` : this.id.render()} : ${this.init.render()}` }
}

class funct_decl extends base {
    constructor(id, args, body) {

        super();

        this.id = id;

        //This is a declaration and id cannot be a closure variable. 
        this.id.root = false;

        this.args = args || [];
        this.body = body || [];
    }

    getRootIds(ids, closure) {
        this.id.getRootIds(ids, closure);
        this.args.forEach(e => e.getRootIds(ids, closure));
    }

    *traverseDepthFirst (){ 
        yield this;
        
        yield * this.id.traverseDepthFirst();
        
        for(let arg of this.args)
            yield * arg.traverseDepthFirst();

        for(let arg of this.body)
            yield * arg.traverseDepthFirst();
     }

    get name() { return this.id.name }
    
    get type() { return types.function_declaration }

    render() { return `function ${this.id.render()}(${this.args.map(a=>a.render()).join(",")}){${this.body.render()}}` }
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

const env = {};
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
		let
            tvrs = ast.traverseDepthFirst(),
            node = tvrs.next().value,
            non_global = new Set(),
            globals = new Set(),
            assignments = new Map();

        //Retrieve undeclared variables to inject as function arguments.
        while (node) {

            if (
                node.type == types.id ||
                node.type == types.member
            ) {
                if (node.root)
                    globals.add(node.name);
            }

            if (
                node.type == types.lex ||
                node.type == types.var
            ) {
                node.bindings.forEach(b => (non_global.add(b.id.name), globals.delete(b.id.name)));
            }

            node = tvrs.next().value;
        }

        return [...globals.values()].reduce((red, out) => {
            if (window[out] || out == "this") 
            	//Skip anything already defined on the global object. 
                return red;

            red.push(out);
            return red;
        }, [])
	},

	//Returns the argument names of the first function declaration defined in the ast
	getFunctionDeclarationArgumentNames(ast){
		const tvrs = ast.traverseDepthFirst(); let node = null;

		while((node = tvrs.next().value)){
			if(node.type == types.function_declaration){
				return node.args.map(e=>e.name);
			}
		}
		return [];
	},
	parse(lex){
		let l = lex.copy();

		return JSParser(lex, env);
	},

	validate(lex){
		let l = lex.copy();

		console.log(l.slice());
		try{
			let result = JSParser(lex, env);
			console.log(result);
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
			let result = JSParser(lex, env);

			if(result instanceof identifier$2){
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

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
class AttribIO extends IOBase {
    constructor(scope, errors, tap, attr, element, default_val) {
        super(tap);

        this.attrib = attr;
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

class InputIO extends IOBase {

    constructor(scope, errors, tap, attrib_name, element, default_val) {

        super(tap);

        this.ele = element;

        const up_tap = default_val ? scope.getTap(default_val) : tap;

        this.event = (e) => { up_tap.up(e.target.value, { event: e }); };

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
const e$3 = 101;
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
const r$1 = 114;
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

const number$3 = 1,
    identifier$3 = 2,
    string$3 = 4,
    white_space$1 = 8,
    open_bracket$1 = 16,
    close_bracket$1 = 32,
    operator$2 = 64,
    symbol$1 = 128,
    new_line$1 = 256,
    data_link$1 = 512,
    alpha_numeric$1 = (identifier$3 | number$3),
    white_space_new_line$1 = (white_space$1 | new_line$1),
    Types$1 = {
        num: number$3,
        number: number$3,
        id: identifier$3,
        identifier: identifier$3,
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

                            type = number$3;
                            length = off - base;

                            break;
                        case 1: //IDENTIFIER
                            while (++off < l && ((10 & number_and_identifier_table$1[str.charCodeAt(off)])));
                            type = identifier$3;
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

    return JS.getClosureVariableNames(ast).map(out => {
        const out_object = { name: out, val: null, IS_TAPPED: false, IS_ELEMENT : false};

        if (presets.custom[out])
            out_object.val = presets.custom[out];
        else if (presets[out])
            out_object.val = presets[out];
        else if (defaults[out])
            out_object.val = defaults[out];
        else if (out[out.length -1] == "$"){
            out_object.IS_ELEMENT = true;
            //out_object.name = out.slice(0,-1);
        } else {
            out_object.IS_TAPPED = true;
        }

        return out_object;
    })
}

function AddEmit(ast, presets, ignore) {
    JS.processType(types.assignment, ast, assign => {
        const k = assign.id.name;

        if (window[k] || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
            return;
        
        assign.id = new member([new identifier(["emit"]), null, assign.id]);
    });
}

class scr extends ElementNode {
    
    constructor(env, tag, ast, attribs, presets) {
        super(env, "script", null, attribs, presets);
        this.function = null;
        this.args = null;
        this.ast = ast;
        this.READY = false;
        this.val = "";

        this.processJSAST(presets);

        this.on = this.getAttrib("on").value;
    }

    processJSAST(presets = { custom: {} }) {
        this.args = GetOutGlobals(this.ast, presets);
        AddEmit(this.ast, presets, this.args.map(a=>a.name));
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
                console.error(`Script error encountered in ${statics.url || "virtual file"}:${node.line+1}:${node.char}`);
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

class scp extends ElementNode{

	constructor(env, tag, children, attribs, presets){
        
		super(env, "scope", children, attribs, presets);

		this.import = this.getAttrib("import").value;
		this.export = this.getAttrib("export").value;
		this.put = this.getAttrib("put").value;
		this.model_name = this.getAttrib("model").value;
		this.schema_name = this.getAttrib("schema").value;
        this.element = this.getAttrib("element").value;
	}

    createElement() {
        return createElement(this.element || "div");
    }

	mount(element, scope, presets = this.presets, slots = {}, pinned = {}){

        let me = new Scope(scope, presets, element, this);

        if(this.slots)
            slots = Object.assign({}, slots, this.slots);

        //Reset pinned
        pinned = {};

        if(this.pinned)
            pinned[this.pinned] = me.ele;
        

        me._model_name_ = this.model_name;
        me._schema_name_ = this.schema_name;

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

            me.ele = ele;

            if (element) {
                appendChild(element, ele);
            }

            element = ele;

            if (this._badge_name_)
                me.badges[this._badge_name_] = element;
        }

        for (let i = 0, l = this.attribs.length; i < l; i++)
            this.attribs[i].bind(element, scope, pinned);

        for(let i = 0; i < this.children.length; i++){
            const node = this.children[i];
            node.mount(element, me, presets, slots, pinned);
        }

        return me;
	}
}

class a$2 extends ElementNode{
	constructor(env, tag, children, attribs, presets){
		super(env, "a", children, attribs, presets);
	}
}

//import glow from "@candlefw/glow";

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
            transition = glow.createTransition(),
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

        if (!transition) transition = glow.createTransition(), OWN_TRANSITION = true;

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
            this.trs_ascending = glow.createTransition(false);
            this.trs_descending = glow.createTransition(false);

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

    filterExpressionUpdate(transition = glow.createTransition()) {
        // Filter the current components. 
        this.filterUpdate();

        this.limitExpressionUpdate(transition);
    }

    limitExpressionUpdate(transition = glow.createTransition()){
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

        const transition = glow.createTransition();

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
    removed(items, transition = glow.createTransition()) {
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
            transition = glow.createTransition(), OWN_TRANSITION = true;

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

    nonAsyncMount(HTMLElement_, bound_data_object){
        let element = null;

        if ((HTMLElement_ instanceof HTMLElement)) {
            //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

            element = HTMLElement_.attachShadow({ mode: 'open' });
        }

        const scope = this.ast.mount(element);

        if (bound_data_object)
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

        if (!(this.ast instanceof identifier$2) && !(this.ast instanceof mem))
            this.processJSAST(env.presets);
        
    }

    toString() {
        if (this.prop)
            return `((${this.ast + ""})(${this.prop + ""}))`;
        else
            return `((${this.ast + ""}))`;
    }

    processJSAST(presets = { custom: {} }) {
        this.args = GetOutGlobals(this.ast, presets);
        AddEmit(this.ast, presets);
        let r = new rtrn([]);
        r.expr = this.ast;
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
    }

    toString(off = 0) {
        return `${offset.repeat(off)} ${this.data.toString()}\n`;
    }

    finalize(){
        return this;
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

function element_selector (sym, env, lex){ 

	const 
        FULL = sym.length > 5,
        tag = sym[1],
        attribs = sym[2],
        children = (FULL) ? sym[4] : [];

    const presets = env.presets;

    let node = null, cstr = null;
    
    switch (tag) {
        case "filter":
        case "f":
            cstr =  fltr; break;
        case "a":
            cstr =  a$2; break;
            /** void elements **/
        case "template":
            cstr =  v$2; break;
        case "css":
        case "style":
            cstr =  sty; break;
        case "script":
            cstr =  scr; break;
        case "svg":
        case "path":
            cstr =  svg; break;
        case "container":
            cstr =  ctr; break;
        case "scope":
            cstr =  scp; break;
        case "slot":
            cstr =  slt; break;
        case "import":
            cstr =  Import; break;
            //Elements that should not be parsed for binding points.
        case "pre":
        case "code":
            cstr =  pre; break;
        default:
            cstr =  ElementNode; break;
    }

    node = new cstr(env, tag, children, attribs, presets);

    node.SINGLE = !FULL;

    return node;
}

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

        if (this.value instanceof Binding)
            this.isBINDING = true;
    }

    link(element) {
        const tag = element.tag;

        if (this.isBINDING) {
            if (this.name == "value" && (tag == "input" || tag == "textarea"))
                this.io_constr = InputIO;
        }

    }

    bind(element, scope, pinned) {
        
        if (!this.isBINDING)
            element.setAttribute(this.name, this.value);
        else {
            const
                bind = this.value.bind(scope, pinned),
                io = new this.io_constr(scope, [], bind, this.name, element, this.value.default);
        }
    }
}

const env$1 = {
    table: {},
    ASI: true,
    functions: {
        //HTML
        element_selector,
        attribute: Attribute,
        wick_binding: Binding,
        text: TextNode,

        //JS
        for_stmt,
        call_expr,
        identifier: identifier$2,
        catch_stmt,
        try_stmt,
        stmts: Statements,
        lexical,
        binding,
        member: mem,
        block,
        assign,
        object,
        add,
        sub,
        div,
        mult,
        exp,
        lt,
        negate_expr: negate,
        eq,
        array_literal,
        property_binding,
        if_stmt: function(sym) { this.bool = sym[2];
            this.body = sym[4];
            this.else = sym[6];},
        while_stmt: function(sym) { this.bool = sym[1];
            this.body = sym[3];},
        return_stmt: rtrn,
        class_stmt: function(sym) { this.id = sym[1], this.tail = sym[2];},
        class_tail: function(sym) { this.heritage = sym[0];
            this.body = sym[2];},
        debugger_stmt,
        lex_stmt: function(sym) { this.ty = sym[0];
            this.declarations = sym[1];},
        var_stmt: function(sym) { this.declarations = sym[1]; },
        member_expr: function(sym) { this.id = sym[0];
            this.expr = sym[2];},
        add_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "ADD";},
        or_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "OR";},
        and_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "AND";},
        sub_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "SUB";},
        mult_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "MUL";},
        div_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "DIV";},
        mod_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "MOD";},
        lt_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "LT";},
        gt_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "GT";},
        lte_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "LTE";},
        gte_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "GTE";},
        seq_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_EQ";},
        neq_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "NEQ";},
        sneq_expr: function(sym) { this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_NEQ";},
        unary_not_expr: function(sym) { this.expr = sym[1];
            this.ty = "NOT";},
        unary_plus: function(sym) { this.expr = sym[1];
            this.ty = "PRE INCR";},
        unary_minus: function(sym) { this.expr = sym[1];
            this.ty = "PRE INCR";},
        pre_inc_expr: function(sym) { this.expr = sym[1];
            this.ty = "PRE INCR";},
        pre_dec_expr: function(sym) { this.expr = sym[1];
            this.ty = "PRE DEC";},
        post_inc_expr: function(sym) { this.expr = sym[0];
            this.ty = "POST INCR";},
        post_dec_expr: function(sym) { this.expr = sym[0];
            this.ty = "POST DEC";},
        condition_expr: condition,
        null_literal: null_,
        numeric_literal: number$2,
        bool_literal: bool$1,
        string_literal: string$2,
        label_stmt: function(sym) { this.label = sym[0];
            this.stmt = sym[1];},
        funct_decl,
        this_expr,

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
        env$1.prst.push(prst);
    },
    popPresets() {
        return env$1.prst.pop();
    },
    get presets() {
        return env$1.prst[env$1.prst.length - 1] || null;
    },

    options: {
        integrate: false,
        onstart: () => {
            env$1.table = {};
            env$1.ASI = true;
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
                    const compiler_env = new CompilerEnvironment(presets, env$1);
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
                                    let c_env = new CompilerEnvironment(presets, env$1);
                                    
                                    let js_ast = parser(whind$1("function " + r.toString().trim()+";"), c_env);

                                    let func_ast = JS.getFirst(js_ast, types.function_declaration);
                                    let ids = JS.getClosureVariableNames(func_ast);
                                    let args = JS.getFunctionDeclarationArgumentNames(js_ast); // Function arguments in wick class component definitions are treated as TAP variables. 
                                    const HAS_CLOSURE = (ids.filter(a=>!args.includes(a))).length > 0;

                                    const binding = new Binding([null, func_ast.id], {presets, start:0}, whind$1("ddddd"));
                                    const attrib = new Attribute(["on", null, binding], presets);
                                    const stmt = new Statements([func_ast.body]);
                            
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
model.scheme = (s, scheme) => (scheme = class extends SchemedModel {}, scheme.schema = s, scheme);
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

wick.model = model;

exports.default = wick;
