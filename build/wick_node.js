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

const
    number = 1,
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

const getNumbrOfTrailingZeroBitsFromPowerOf2 = (value) => debruijnLUT[(value * 0x077CB531) >>> 27];

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
        const pk = this.copy();

        pk.IWS = false;

        while (!pk.END && pk.ty !== Types.nl) { pk.next(); }

        const end = (pk.END) ? this.str.length : pk.off,

            nls = (this.line > 0) ? 2 : 0,

            number_of_tabs =
            this.str
            .slice(this.off - this.char + nls, this.off + nls)
            .split("")
            .reduce((r, v) => (r + ((v.charCodeAt(0) == HORIZONTAL_TAB) | 0)), 0),

            arrow = String.fromCharCode(0x2b89),

            line = String.fromCharCode(0x2500),

            thick_line = String.fromCharCode(0x2501),

            line_number = `    ${this.line}: `,

            line_fill = line_number.length + number_of_tabs,

            line_text = this.str.slice(this.off - this.char + (nls), end).replace(/\t/g, "  "),

            error_border = thick_line.repeat(line_text.length + line_number.length + 2),

            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "",

            msg =[ `${message} at ${this.line}:${this.char}` ,
            `${error_border}` ,
            `${line_number+line_text}` ,
            `${line.repeat(this.char+line_fill-(nls))+arrow}` ,
            `${error_border}` ,
            `${is_iws}`].join("\n");

        return msg
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
                            //intentional
                        case 6: //LINEFEED
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
                } else {
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
    symbols = ["((","))",")(","</","||","^=","$=","*=","<="],

    /* Goto lookup maps */
    gt0 = [0,-1,1,4,-2,6,-134,2,3,-1,5,-1,9,8],
gt1 = [0,-5,11,-137,10,-1,9,8],
gt2 = [0,-147,15,-7,14],
gt3 = [0,-146,36],
gt4 = [0,-151,38,39,40],
gt5 = [0,-151,44,39,40],
gt6 = [0,-151,46,39,40],
gt7 = [0,-151,49,39,40],
gt8 = [0,-156,52,-1,53],
gt9 = [0,-152,59,40],
gt10 = [0,-29,64,68,66,71,67,65,74,72,-2,73,-5,69,-1,99,-4,100,-10,98,-45,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt11 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-118,109,108,-1,105,103,106,-5,111,107,53],
gt12 = [0,-158,132],
gt13 = [0,-154,134,-4,135],
gt14 = [0,-29,141,68,66,71,67,65,74,72,-2,73,-5,69,-1,99,-4,100,-10,98,-45,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt15 = [0,-30,144,-1,71,143,-1,74,72,-2,73,-5,69,-1,99,-4,100,-10,98,-45,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt16 = [0,-32,145,-2,74,72,-2,73,-5,146,-1,99,-4,100,-10,98,-45,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt17 = [0,-39,156,-5,146,-1,99,-4,100,-10,98,-66,157,155,-2,154,-1,158],
gt18 = [0,-107,161,160,-1,79,-1,96,80,163,162,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt19 = [0,-110,168,-1,96,169,-6,87,88,89,-1,90,-3,91,97],
gt20 = [0,-112,96,170,-6,171,88,89,-1,90,-3,91,97],
gt21 = [0,-112,172,-16,97],
gt22 = [0,-117,85,180,179],
gt23 = [0,-128,183],
gt24 = [0,-111,185,-16,186],
gt25 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-118,109,108,-1,105,190,106,-5,111,107,53],
gt26 = [0,-155,194],
gt27 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-118,109,108,-3,195,-5,111,107,53],
gt28 = [0,-9,110,116,112,198,196,199,-3,118,113,120,119,-3,203,202,204,-118,200,-9,111,201,53],
gt29 = [0,-20,120,206],
gt30 = [0,-9,110,116,112,198,209,199,-3,118,113,120,119,-3,203,202,204,208,-117,200,-9,111,201,53],
gt31 = [0,-9,110,116,112,198,211,199,-3,118,113,120,119,-3,203,202,204,-118,200,-9,111,201,53],
gt32 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-129,111,212,53],
gt33 = [0,-147,215],
gt34 = [0,-160,218,217,216,219],
gt35 = [0,-160,218,217,227,219],
gt36 = [0,-40,230,231,-59,234,-4,233],
gt37 = [0,-62,238,-1,241,-1,239,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt38 = [0,-48,254,-57,256],
gt39 = [0,-57,257,259,261,264,263,-21,262],
gt40 = [0,-39,156,-5,146,-1,99,-4,100,-10,98,-66,157,155,-2,267,-1,158],
gt41 = [0,-109,268,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt42 = [0,-39,271,-5,146,-1,99,-4,100,-10,98,-68,273,272,-2,274],
gt43 = [0,-107,277,-2,79,-1,96,80,163,162,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt44 = [0,-110,79,-1,96,80,278,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt45 = [0,-112,96,279,-6,171,88,89,-1,90,-3,91,97],
gt46 = [0,-125,281],
gt47 = [0,-127,287],
gt48 = [0,-128,289],
gt49 = [0,-155,291],
gt50 = [0,-155,292],
gt51 = [0,-9,110,116,112,-2,295,-3,118,113,120,119,-3,203,202,204,-118,200,-9,111,201,53],
gt52 = [0,-9,110,116,112,198,297,199,-3,118,113,120,119,-3,203,202,204,-118,200,-9,111,201,53],
gt53 = [0,-147,302],
gt54 = [0,-160,305,-2,219],
gt55 = [0,-41,309,-59,234,-4,233],
gt56 = [0,-43,311,-18,312,-1,241,-1,239,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt57 = [0,-102,315,314],
gt58 = [0,-104,318,317],
gt59 = [0,-100,320,-5,321],
gt60 = [0,-95,324],
gt61 = [0,-65,326],
gt62 = [0,-70,330,328,-1,332,329],
gt63 = [0,-76,334,-1,250,-4,251],
gt64 = [0,-67,243,335,245,-2,246,-2,244,247,336,250,-4,251,339,-6,341,343,340,342,-1,346,-2,345],
gt65 = [0,-58,350,261,264,263,-21,262],
gt66 = [0,-53,353,351,355,352],
gt67 = [0,-57,357,259,261,264,263,-21,262,-52,358],
gt68 = [0,-130,365,-5,158],
gt69 = [0,-137,369,367,366],
gt70 = [0,-123,372],
gt71 = [0,-109,376,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt72 = [0,-155,377],
gt73 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-129,111,380,53],
gt74 = [0,-43,386,-18,387,-1,241,-1,239,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt75 = [0,-62,388,-1,241,-1,239,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt76 = [0,-102,391],
gt77 = [0,-104,393],
gt78 = [0,-35,74,396,395,394,-70,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt79 = [0,-64,241,-1,397,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt80 = [0,-65,398],
gt81 = [0,-67,399,-1,245,-2,246,-3,400,-1,250,-4,251],
gt82 = [0,-70,401],
gt83 = [0,-73,402],
gt84 = [0,-76,403,-1,250,-4,251],
gt85 = [0,-76,404,-1,250,-4,251],
gt86 = [0,-81,409,407],
gt87 = [0,-85,413],
gt88 = [0,-86,418,419,-1,420],
gt89 = [0,-98,425],
gt90 = [0,-79,432,430],
gt91 = [0,-46,435,-2,437,436,438,-45,441],
gt92 = [0,-35,74,396,395,443,-70,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt93 = [0,-53,444],
gt94 = [0,-55,445],
gt95 = [0,-58,446,261,264,263,-21,262],
gt96 = [0,-58,447,261,264,263,-21,262],
gt97 = [0,-109,450,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt98 = [0,-132,452,-3,274],
gt99 = [0,-135,453,-1,369,367,454],
gt100 = [0,-137,456],
gt101 = [0,-137,369,367,457],
gt102 = [0,-126,458],
gt103 = [0,-9,110,116,112,-6,118,113,120,119,-3,115,114,-129,111,466,53],
gt104 = [0,-62,467,-1,241,-1,239,243,240,245,-2,246,-2,244,247,-1,250,-4,251,-11,242],
gt105 = [0,-42,468,-14,469,259,261,264,263,-21,262,-52,470],
gt106 = [0,-35,74,473,-72,76,79,-1,96,80,77,-1,78,85,82,81,87,88,89,-1,90,-3,91,97],
gt107 = [0,-70,330,328],
gt108 = [0,-81,475],
gt109 = [0,-92,476,-1,477,-1,346,-2,345],
gt110 = [0,-92,479,-1,477,-1,346,-2,345],
gt111 = [0,-94,481],
gt112 = [0,-79,487],
gt113 = [0,-49,437,489,438,-45,441],
gt114 = [0,-137,369,367,454],
gt115 = [0,-88,501],
gt116 = [0,-90,503],
gt117 = [0,-39,156,-5,146,-1,99,-4,100,-10,98,-66,157,155,-2,506,-1,158],
gt118 = [0,-51,507,-45,441],
gt119 = [0,-92,508,-1,477,-1,346,-2,345],
gt120 = [0,-92,510,-1,477,-1,346,-2,345],

    // State action lookup maps
    sm0=[0,-4,0,-4,0,-4,1],
sm1=[0,2,-3,0,-4,0],
sm2=[0,3,-3,0,-4,0],
sm3=[0,4,-3,0,-4,0],
sm4=[0,5,-3,0,-4,0],
sm5=[0,-4,0,-4,0,-4,6],
sm6=[0,-2,7,-1,0,-4,0,-5,8,-2,9,10,11,-58,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
sm7=[0,29,-3,0,-4,0],
sm8=[0,-4,0,-4,0,-4,30],
sm9=[0,31,-3,0,-4,0],
sm10=[0,-4,0,-4,0,-4,32],
sm11=[0,-2,33,-1,0,-4,0,-6,34,-7,34,-71,35,36],
sm12=[0,-2,33,-1,0,-4,0,-14,37,-71,35,36],
sm13=[0,-2,33,-1,0,-4,0,-6,38,-7,39,-71,35,36],
sm14=[0,-2,33,-1,0,-4,0,-6,40,-7,41,-71,35,36],
sm15=[0,-4,42,-4,0,-3,43],
sm16=[0,-2,44,-1,0,-4,0,-6,44,-7,44,-71,44,44],
sm17=[0,-2,34,-1,0,-4,0,-6,34,-7,34,-71,34,34],
sm18=[0,45,-3,0,-4,0],
sm19=[0,-2,7,-1,0,-4,0,-5,46,-2,9,10,11,-59,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
sm20=[0,-2,33,-1,0,-4,0,-6,47,-7,48,-71,35,36],
sm21=[0,-2,49,-1,0,-4,0,-6,49,-7,49,-71,49,49],
sm22=[0,-2,50,-1,0,-4,0,-6,50,-7,50,-30,51,-40,50,50],
sm23=[0,-2,52,-1,0,-4,0],
sm24=[0,-2,53,-1,0,-4,0],
sm25=[0,-2,54,-1,0,-4,0,-6,54,-7,54,-30,54,-40,54,54],
sm26=[0,-2,33,-1,0,-4,0,-14,55,-71,35,36],
sm27=[0,-2,56,-1,0,-4,0,-11,57,58,-7,59,-5,60,-4,61,-25,62,63,64,-8,65],
sm28=[0,-2,33,-1,0,-4,0,-6,66,-7,67,-71,35,36],
sm29=[0,-4,42,-4,0,-3,43,68,-6,69,70,-3,71,-3,72,-33,73,-2,74],
sm30=[0,-4,0,-4,0,-14,75],
sm31=[0,-2,33,-1,0,-4,0,-6,76,-7,77,-71,35,36],
sm32=[0,78,-3,78,-4,78,-3,78,78,-6,79,78,-3,78,-3,78,-3,78,-29,78,-2,78],
sm33=[0,-4,0,-4,0,-14,80],
sm34=[0,-4,42,-4,0,-3,43,-10,81],
sm35=[0,-4,82,-4,82,-3,82,82,-6,82,82,-1,82,-1,82,-3,82,82,-1,82,82,-29,82,-2,82],
sm36=[0,-4,83,-4,83,-3,83,83,-6,83,83,-1,83,-1,83,-3,83,83,-1,83,83,-29,83,-2,83],
sm37=[0,-4,0,-4,0,-14,84],
sm38=[0,-4,0,-4,0,-4,85],
sm39=[0,-2,86,-1,0,-4,0,-6,86,-7,86,-71,86,86],
sm40=[0,-2,87,-1,0,-4,0,-86,88,89],
sm41=[0,-4,0,-4,0,-87,90],
sm42=[0,-4,0,-4,0,-86,91],
sm43=[0,-4,0,-4,0,-11,92],
sm44=[0,-4,0,-4,0,-11,93],
sm45=[0,-2,56,-1,0,-4,0,-11,94,58,-7,59,-5,60,-4,61,-25,62,63,64,-8,65],
sm46=[0,-2,95,-1,0,-4,0,-11,95,95,-7,95,-5,95,-4,95,-25,95,95,95,-8,95],
sm47=[0,-2,96,-1,0,-4,0,-11,96,96,-7,96,-5,96,97,-3,96,-25,96,96,96,-8,96],
sm48=[0,-4,0,-4,0,-5,98,-24,99,-1,100,-7,101],
sm49=[0,-2,102,-1,0,-4,0,-11,102,102,-7,102,-5,102,-4,102,-25,102,102,102,-8,102],
sm50=[0,-2,103,-1,0,-4,0,-11,103,103,-7,103,-5,103,-4,103,-25,103,103,103,-8,103],
sm51=[0,-4,0,-4,0,-25,104,105],
sm52=[0,-2,106,-1,0,-4,0,-31,61],
sm53=[0,-4,0,-4,0,-25,107,107],
sm54=[0,-2,56,-1,0,-4,0,-12,58,-1,108,-5,59,-2,109,-1,109,109,-27,110,111,112,62,63,64,-8,65],
sm55=[0,-2,113,-1,0,-4,0,-12,58,-1,113,-5,59,-2,113,-1,113,113,-27,113,113,113,113,113,64,-8,65],
sm56=[0,-2,113,-1,0,-4,0,-12,113,-1,113,-5,113,-2,113,-1,113,113,-27,113,113,113,113,113,113,-8,114],
sm57=[0,-2,115,-1,0,-4,0,-12,115,-1,115,-5,115,-2,115,-1,115,115,-27,115,115,115,115,115,115,-8,115],
sm58=[0,-2,116,-1,0,-4,0,-57,117],
sm59=[0,-2,115,-1,0,-4,0,-12,115,-1,115,-5,115,-2,115,-1,115,115,-27,115,115,115,115,118,115,-8,115],
sm60=[0,-2,119,-1,0,-4,0,-12,119,-1,119,-5,119,119,-1,119,-1,119,119,-18,119,-8,119,119,119,119,118,119,-1,119,119,119,-4,119],
sm61=[0,-4,0,-4,0,-58,120],
sm62=[0,-2,121,-1,0,-4,0,-57,121],
sm63=[0,-2,122,-1,0,-4,0,-12,122,-1,122,-5,122,-2,122,-1,122,122,-27,122,122,122,122,122,122,-8,122],
sm64=[0,-2,123,-1,0,-4,0,-12,123,-1,123,-5,123,-2,123,-1,123,123,-27,123,123,123,123,123,123,-8,123],
sm65=[0,-2,124,-1,0,-4,0],
sm66=[0,-2,125,-1,0,-4,0],
sm67=[0,-2,56,-1,0,-4,0,-57,126,63],
sm68=[0,-2,127,-1,0,-4,0,-68,128],
sm69=[0,-2,129,-1,0,-4,0,-12,129,-1,129,-5,129,-2,129,-1,129,129,-27,129,129,129,129,129,129,-8,129],
sm70=[0,-2,130,-1,0,-4,0,-12,130,-1,130,-5,130,-2,130,-1,130,130,-27,130,130,130,130,130,130,-8,128],
sm71=[0,-4,0,-4,0,-27,131],
sm72=[0,-4,0,-4,0,-27,132],
sm73=[0,-4,0,-4,0,-27,133],
sm74=[0,-4,42,-4,0,-3,43,68,-6,134,70,-3,71,-3,72,-33,73,-2,74],
sm75=[0,-4,0,-4,0,-14,135],
sm76=[0,-4,0,-4,0,-11,136],
sm77=[0,-2,7,-1,0,-4,0],
sm78=[0,-4,42,-4,0,-3,43,68,-6,137,70,-3,71,-3,72,-33,73,-2,74],
sm79=[0,-4,138,-4,0,-3,138,138,-6,138,138,-3,138,-3,138,-33,138,-2,138],
sm80=[0,-4,139,-4,0,-3,139,139,-6,139,139,-3,139,-3,139,-33,139,-2,139],
sm81=[0,-4,140,-4,0,-3,140,140,-6,140,140,-3,140,-3,140,-33,140,-2,140],
sm82=[0,-4,141,-4,141,-3,141,141,-6,141,141,-3,141,-3,141,141,-1,141,141,-29,141,-2,141],
sm83=[0,-4,42,-4,142,-3,43,142,-6,142,142,-3,142,-3,142,142,-1,142,142,-29,142,-2,142],
sm84=[0,-4,143,-4,143,-3,143,143,-6,143,143,-3,143,-3,143,143,-1,143,143,-29,143,-2,143],
sm85=[0,-4,143,-4,0,-3,143,143,-6,143,143,-3,143,-3,143,143,-1,143,143,-29,143,-2,143],
sm86=[0,-4,42,-4,0,-3,43,30,-7,144,-3,71,-3,72,-3,145,-29,73,-2,74],
sm87=[0,-4,146,-4,0,-3,146,146,-7,146,-3,146,-3,146,-3,146,-29,146,-2,146],
sm88=[0,-4,147,-4,147,-3,147,147,-6,147,147,-3,71,-3,147,147,-1,147,147,-29,73,-2,148],
sm89=[0,-4,149,-4,149,-3,149,149,-6,149,149,-3,149,-3,149,149,-1,149,149,-29,149,-2,149],
sm90=[0,-4,42,-4,0,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,150],
sm91=[0,-4,151,-4,0,-3,151,151,-7,151,-3,151,-3,151,-3,151,-29,151,-2,151],
sm92=[0,-4,42,-4,0,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,74],
sm93=[0,-4,42,-4,0,-3,43,-8,70,-3,71,-3,72,-33,73,-2,74],
sm94=[0,-2,7,-1,0,-4,0,-5,46,-2,9,10,11,-58,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
sm95=[0,152,-3,152,-4,152,-3,152,152,-6,152,152,-3,152,-3,152,-3,152,-29,152,-2,152],
sm96=[0,153,-3,153,-4,153,-3,153,153,-6,154,153,-3,153,-3,153,-3,153,-29,153,-2,153],
sm97=[0,-4,0,-4,0,-14,155],
sm98=[0,-4,0,-4,0,-5,46,-2,9,10,-60,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
sm99=[0,-4,156,-4,0,-3,156,156,-6,156,156,-3,156,-3,156,-33,156,-2,156],
sm100=[0,-4,157,-4,157,-3,157,157,-6,157,157,-1,157,-1,157,-3,157,157,-1,157,157,-29,157,-2,157],
sm101=[0,-4,0,-4,0,-4,158],
sm102=[0,-2,159,-1,0,-4,0,-6,159,-7,159,-71,159,159],
sm103=[0,-2,160,-1,0,-4,0,-6,160,-7,160,-71,160,160],
sm104=[0,-2,161,-1,162,163,164,165,166,0,-3,167],
sm105=[0,-2,168,-1,0,-4,0,-6,168,-7,168,-30,168,-40,168,168],
sm106=[0,-4,0,-4,0,-11,169],
sm107=[0,-4,0,-4,0,-10,170],
sm108=[0,-2,56,-1,0,-4,0,-11,171,58,-7,59,-5,60,-4,61,-25,62,63,64,-8,65],
sm109=[0,-2,172,-1,0,-4,0,-11,172,172,-7,172,-5,172,-4,172,-25,172,172,172,-8,172],
sm110=[0,-2,173,-1,0,-4,0,-11,173,173,-7,173,-5,173,-4,173,-25,173,173,173,-8,173],
sm111=[0,-4,0,-4,0,-27,97],
sm112=[0,-2,174,-1,0,-4,0,-11,174,174,-7,174,-5,174,174,174,-2,174,-25,174,174,174,-8,174],
sm113=[0,-4,175,-4,0,-51,176,-34,177,178],
sm114=[0,-2,179,-1,0,-4,0,-22,180,-15,181,-2,182],
sm115=[0,-4,0,-4,0,-33,183,-52,177,178],
sm116=[0,-2,184,-1,0,185,-3,0,-22,186,-15,187],
sm117=[0,-2,56,-1,0,-4,0,-12,58,-7,59,-36,62,63,64,-8,65],
sm118=[0,-2,106,-1,0,-4,0,-27,188,189,-2,61],
sm119=[0,-2,190,-1,0,-4,0,-27,191,190,-2,190],
sm120=[0,-2,192,-1,0,-4,0,-27,192,192,-2,192],
sm121=[0,-2,193,-1,0,-4,0,-27,193,193,-2,193],
sm122=[0,-2,194,-1,0,-4,0,-27,194,194,-2,194],
sm123=[0,-4,0,-4,0,-68,195],
sm124=[0,-2,56,-1,0,-4,0,-12,58,-1,108,-5,59,-2,196,-1,196,196,-27,110,111,112,62,63,64,-8,65],
sm125=[0,-2,197,-1,0,-4,0,-12,197,-1,197,-5,197,-2,197,-1,197,197,-27,197,197,197,197,197,197,-8,197],
sm126=[0,-2,198,-1,0,-4,0,-12,198,-1,198,-5,198,-2,198,-1,198,198,-27,198,198,198,198,198,198,-8,198],
sm127=[0,-2,199,-1,0,-4,0,-12,199,-7,199,-36,199,199,199,-8,199],
sm128=[0,-2,200,-1,0,-4,0,-12,58,-1,200,-5,59,-2,200,-1,200,200,-27,200,200,200,200,200,64,-8,65],
sm129=[0,-2,200,-1,0,-4,0,-12,200,-1,200,-5,200,-2,200,-1,200,200,-27,200,200,200,200,200,200,-8,114],
sm130=[0,-2,201,-1,0,-4,0,-12,201,-1,201,-5,201,-2,201,-1,201,201,-27,201,201,201,201,201,201,-8,201],
sm131=[0,-2,202,-1,0,-4,0,-12,202,-1,202,-5,202,-2,202,-1,202,202,-27,202,202,202,202,202,202,-8,202],
sm132=[0,-4,0,-4,0,-68,128],
sm133=[0,-2,203,-1,0,-4,0,-12,203,-1,203,-5,203,-2,203,-1,203,203,-27,203,203,203,203,203,203,-8,203],
sm134=[0,-2,204,-1,0,-4,0,-12,204,-1,204,-5,204,204,-1,204,-1,204,204,-18,204,-8,204,204,204,204,204,204,-1,204,204,204,-4,204],
sm135=[0,-2,205,-1,0,-4,0,-57,205],
sm136=[0,-2,206,-1,0,-4,0,-12,206,-1,206,-5,206,-2,206,-1,206,206,-27,206,206,206,206,206,206,-8,206],
sm137=[0,-2,207,-1,0,-4,0,-12,207,-1,207,-5,207,-2,207,-1,207,207,-27,207,207,207,207,207,207,-8,207],
sm138=[0,-4,0,-4,0,-21,208,-23,209,-9,210,-5,211,212,213],
sm139=[0,-2,116,-1,0,-4,0],
sm140=[0,-4,0,-4,0,-58,118],
sm141=[0,-2,214,-1,0,-4,0,-12,214,-1,214,-5,214,-1,215,214,-1,214,214,-27,214,214,214,214,214,214,-8,214],
sm142=[0,-2,216,-1,0,-4,0,-12,216,-1,216,-5,216,-2,216,-1,216,216,-27,216,216,216,216,216,216,-8,216],
sm143=[0,-2,127,-1,0,-4,0],
sm144=[0,-2,217,-1,0,-4,0,-12,217,-1,217,-5,217,-2,217,-1,217,217,-27,217,217,217,217,217,217,-8,128],
sm145=[0,-2,218,-1,0,-4,0,-12,218,-1,218,-5,218,-2,218,-1,218,218,-27,218,218,218,218,218,218,-8,218],
sm146=[0,-4,0,-4,0,-11,219],
sm147=[0,220,-3,220,-4,220,-3,220,220,-6,220,220,-3,220,-3,220,-3,220,-29,220,-2,220],
sm148=[0,-4,0,-4,0,-14,221],
sm149=[0,-4,222,-4,0,-3,222,222,-6,222,222,-3,222,-3,222,-33,222,-2,222],
sm150=[0,-4,0,-4,223],
sm151=[0,-4,224,-4,0,-3,224,224,-7,224,-3,224,-3,224,-3,224,-29,224,-2,224],
sm152=[0,-4,42,-4,225,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,74],
sm153=[0,-4,226,-4,226,-3,226,226,-7,226,-3,226,-3,226,-3,226,-29,226,-2,226],
sm154=[0,-4,227,-4,227,-3,227,227,-7,227,-3,227,-3,227,-3,227,-29,227,-2,227],
sm155=[0,-4,143,-4,143,-3,143,143,-7,143,-3,143,-3,143,-3,143,-29,143,-2,143],
sm156=[0,-4,0,-4,0,-24,228],
sm157=[0,-4,229,-4,229,-3,229,229,-6,229,229,-3,229,-3,229,229,-1,229,229,-29,229,-2,229],
sm158=[0,-4,0,-4,230],
sm159=[0,-4,42,-4,0,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,231],
sm160=[0,-4,0,-4,0,-57,232],
sm161=[0,-4,0,-4,0,-21,233],
sm162=[0,-4,0,-4,0,-14,234],
sm163=[0,-4,0,-4,0,-86,235],
sm164=[0,-2,161,-1,162,163,164,165,166,0,-3,167,-82,236,236],
sm165=[0,-2,237,-1,237,237,237,237,237,0,-3,237,-82,237,237],
sm166=[0,-2,238,-1,238,238,238,238,238,0,-3,238,-82,238,238],
sm167=[0,-2,239,-1,239,239,239,239,239,0,-3,239,-82,239,239],
sm168=[0,-4,0,-4,0,-87,240],
sm169=[0,-4,0,-4,0,-10,241],
sm170=[0,-4,0,-4,0,-14,242],
sm171=[0,-4,243,-4,0,-51,176,-34,177,178],
sm172=[0,-2,179,-1,0,-4,0,-11,244,244,-7,244,-1,180,-3,244,244,-2,245,244,-6,181,-2,182,-15,244,244,244,-8,244],
sm173=[0,-4,246,-4,0,-51,246,-34,246,246],
sm174=[0,-2,247,-1,0,-4,0,-11,247,247,-7,247,-1,247,-3,247,247,-2,247,247,-6,247,-2,247,-15,247,247,247,-8,247],
sm175=[0,-4,0,-4,0,-3,248],
sm176=[0,-4,0,-4,0,-3,249],
sm177=[0,-4,0,-4,0,-86,177,178],
sm178=[0,-4,0,-4,0,-25,250,251],
sm179=[0,-2,252,-1,0,-4,0,-11,252,252,-7,252,-4,252,252,252,-3,252,-25,252,252,252,-8,252],
sm180=[0,-2,253,-1,0,-4,0,-11,253,253,-7,253,-4,253,253,253,-3,253,-25,253,253,253,-8,253],
sm181=[0,-2,254,-1,0,-4,0],
sm182=[0,-2,253,-1,0,-4,0,-11,253,253,-7,253,-4,253,253,253,-3,253,-4,255,-20,253,253,253,-8,253],
sm183=[0,-2,256,-1,0,-4,0,-11,256,256,-7,256,-2,256,-1,256,256,256,-3,256,-25,256,256,256,-8,256],
sm184=[0,-2,257,-1,0,-4,0,-11,257,257,-7,257,-2,257,-1,257,257,257,-3,257,-25,257,257,257,-8,257],
sm185=[0,-2,257,-1,0,-4,0,-11,257,257,-7,257,-2,257,-1,257,257,257,-3,257,-4,258,259,-19,257,257,257,-8,257],
sm186=[0,-2,184,-1,0,-4,0,-22,180],
sm187=[0,-1,260,261,-1,0,-4,0,-22,180,-15,262],
sm188=[0,-2,263,-1,0,-4,0,-11,263,263,-7,263,-2,263,-1,263,263,263,-3,263,-4,263,263,-19,263,263,263,-8,263],
sm189=[0,-2,264,-1,0,-4,0,-11,264,264,-7,264,-1,265,-2,264,264,264,-3,264,-4,264,-20,264,264,264,-8,264],
sm190=[0,-2,266,-1,0,-4,0],
sm191=[0,-4,0,-4,0,-26,267],
sm192=[0,-4,0,-4,0,-26,268],
sm193=[0,-4,0,-4,0,-26,269],
sm194=[0,-2,184,-1,0,185,-3,0,-22,186],
sm195=[0,-4,0,-4,0,-23,270,-2,270,-9,271,272],
sm196=[0,-2,273,-1,0,185,-3,0,-22,186,-15,187],
sm197=[0,-4,0,-4,0,-23,274,-2,274,-9,274,274],
sm198=[0,-4,0,-4,0,-23,275,-2,275,-9,275,275],
sm199=[0,-4,0,-4,0,-22,276],
sm200=[0,-4,0,-4,0,-22,265],
sm201=[0,-2,106,-1,0,-4,0,-27,277,278,-2,61],
sm202=[0,-4,0,-4,0,-25,279,279],
sm203=[0,-4,0,-4,0,-28,280],
sm204=[0,-2,281,-1,0,-4,0,-11,281,281,-7,281,-5,281,-1,281,-2,281,-25,281,281,281,-8,281],
sm205=[0,-2,282,-1,0,-4,0,-27,282,282,-2,282],
sm206=[0,-2,283,-1,0,-4,0,-27,284,283,-2,283],
sm207=[0,-2,285,-1,0,-4,0,-27,285,285,-2,285],
sm208=[0,-2,286,-1,0,-4,0,-27,286,286,-2,286],
sm209=[0,-2,106,-1,0,-4,0,-27,287,287,-2,287],
sm210=[0,-4,288,-4,0,-3,289,-18,290],
sm211=[0,-2,291,-1,0,-4,0,-12,291,-1,291,-5,291,-2,291,-1,291,291,-27,291,291,291,291,291,291,-8,291],
sm212=[0,-2,292,-1,0,-4,0,-12,292,-1,292,-5,292,-2,292,-1,292,292,-27,292,292,292,292,292,292,-8,292],
sm213=[0,-2,293,-1,0,-4,0,-12,293,-1,293,-5,293,-2,293,-1,293,293,-27,293,293,293,293,293,293,-8,114],
sm214=[0,-2,294,-1,0,-4,0,-12,294,-1,294,-5,294,-2,294,-1,294,294,-27,294,294,294,294,294,294,-8,294],
sm215=[0,-2,295,296,0,-4,0],
sm216=[0,-4,0,-4,0,-45,297],
sm217=[0,-2,298,298,0,-4,0],
sm218=[0,-2,299,-1,0,-4,0,-12,299,-1,299,-5,299,-2,299,-1,299,299,-27,299,299,299,299,299,299,-8,299],
sm219=[0,-2,300,-1,0,-4,0,-12,300,-1,300,-5,300,-2,300,-1,300,300,-27,300,300,300,300,300,300,-8,300],
sm220=[0,-4,0,-4,0,-14,301],
sm221=[0,-4,0,-4,0,-14,302],
sm222=[0,303,-3,303,-4,303,-3,303,303,-6,303,303,-3,303,-3,303,-3,303,-29,303,-2,303],
sm223=[0,-4,304,-4,304,-3,304,304,-6,304,304,-3,304,-3,304,304,-1,304,304,-29,304,-2,304],
sm224=[0,-4,305,-4,305,-3,305,305,-7,305,-3,305,-3,305,-3,305,-29,305,-2,305],
sm225=[0,-4,0,-4,306],
sm226=[0,-4,307,-4,307,-3,307,307,-6,307,307,-3,307,-3,307,307,-1,307,307,-29,307,-2,307],
sm227=[0,-4,42,-4,0,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,308],
sm228=[0,-4,309,-4,309,-3,309,309,-6,309,309,-3,309,-3,309,309,-1,309,309,-29,309,-2,309],
sm229=[0,-4,0,-4,0,-22,310],
sm230=[0,-4,0,-4,0,-14,311],
sm231=[0,312,-3,312,-4,312,-3,312,312,-6,312,312,-3,312,-3,312,-3,312,-29,312,-2,312],
sm232=[0,-2,313,-1,0,-4,0,-6,313,-7,313,-71,313,313],
sm233=[0,-2,314,-1,314,314,314,314,314,0,-3,314,-82,314,314],
sm234=[0,-4,0,-4,0,-14,315],
sm235=[0,316,-3,316,-4,316,-3,316,316,-6,316,316,-3,316,-3,316,-3,316,-29,316,-2,316],
sm236=[0,-2,179,-1,0,-4,0,-11,317,317,-7,317,-1,180,-3,317,317,-2,245,317,-6,181,-2,182,-15,317,317,317,-8,317],
sm237=[0,-4,318,-4,0,-51,318,-34,318,318],
sm238=[0,-2,179,-1,0,-4,0,-11,317,317,-7,317,-1,180,-3,317,317,-3,317,-6,181,-2,182,-15,317,317,317,-8,317],
sm239=[0,-2,317,-1,0,-4,0,-11,317,317,-7,317,-4,250,317,317,-3,317,-25,317,317,317,-8,317],
sm240=[0,-4,0,-4,0,-22,319],
sm241=[0,-4,0,-4,0,-3,248,-82,320],
sm242=[0,-4,0,-4,0,-3,321,-82,321],
sm243=[0,-4,0,-4,0,-3,322,-82,322],
sm244=[0,-4,0,-4,0,-3,249,-83,323],
sm245=[0,-4,0,-4,0,-3,324,-83,324],
sm246=[0,-4,0,-4,0,-3,325,-83,325],
sm247=[0,-2,326,-1,0,-4,0,-11,326,326,-7,326,-1,326,-3,326,326,-2,326,326,-6,326,-2,326,-15,326,326,326,-8,326],
sm248=[0,-2,327,-1,0,-4,0,-11,327,327,-7,327,-1,327,-3,327,327,-2,327,327,-6,327,-2,327,-15,327,327,327,-8,327],
sm249=[0,-2,56,-1,0,-4,0,-12,58,-7,59,-5,60,-1,328,-28,62,63,64,-8,65],
sm250=[0,-2,329,-1,0,-4,0,-11,329,329,-7,329,-4,329,329,329,-3,329,-4,255,-20,329,329,329,-8,329],
sm251=[0,-2,264,-1,0,-4,0,-11,264,264,-7,264,-4,264,264,264,-3,264,-4,264,-20,264,264,264,-8,264],
sm252=[0,-2,329,-1,0,-4,0,-11,329,329,-7,329,-4,329,329,329,-3,329,-25,329,329,329,-8,329],
sm253=[0,-2,184,-1,0,-4,0,-22,180,-15,262],
sm254=[0,-2,330,-1,0,-4,0,-11,330,330,-7,330,-2,330,-1,330,330,330,-3,330,-4,258,-20,330,330,330,-8,330],
sm255=[0,-2,331,-1,0,-4,0,-11,331,331,-7,331,-2,331,-1,331,331,331,-3,331,-5,259,-19,331,331,331,-8,331],
sm256=[0,-2,332,-1,0,-4,0,-11,332,332,-7,332,-2,332,-1,332,332,332,-3,332,-4,332,-20,332,332,332,-8,332],
sm257=[0,-2,333,-1,0,-4,0,-11,333,333,-7,333,-2,333,-1,333,333,333,-3,333,-5,333,-19,333,333,333,-8,333],
sm258=[0,-2,334,-1,0,-4,0,-11,334,334,-7,334,-2,334,-1,334,334,334,-3,334,-25,334,334,334,-8,334],
sm259=[0,-4,0,-4,0,-23,335],
sm260=[0,-4,0,-4,0,-23,336],
sm261=[0,-4,337,-4,0,-3,338,339,-9,339,-7,265,340,-20,339,339,-22,339],
sm262=[0,-4,0,-4,0,-23,341],
sm263=[0,-4,0,-4,0,-4,342,-9,343,-29,344,345,-22,346],
sm264=[0,-4,0,-4,0,-4,347,-9,348,-29,349,350],
sm265=[0,-4,0,-4,0,-4,351,-1,352,-7,351,-8,351,-20,351,351,-2,353,354,355],
sm266=[0,-4,0,-4,0,-4,351,-9,351,-8,351,-20,351,351],
sm267=[0,-4,356,-4,0,-3,357,-19,358],
sm268=[0,-1,359,-2,0,-4,0,-34,360,361],
sm269=[0,-4,0,-4,0,-23,362,-2,362],
sm270=[0,-4,0,-4,0,-23,362,-2,362,-9,271],
sm271=[0,-4,0,-4,0,-23,362,-2,362,-10,272],
sm272=[0,-4,0,-4,0,-23,363,-2,363,-9,363],
sm273=[0,-4,0,-4,0,-23,364,-2,364,-10,364],
sm274=[0,-4,0,-4,0,-23,365],
sm275=[0,-4,0,-4,0,-23,366],
sm276=[0,-4,337,-4,0,-3,338,-18,265,340,-44,195],
sm277=[0,-4,0,-4,0,-28,367],
sm278=[0,-2,368,-1,0,-4,0,-11,368,368,-7,368,-5,368,-1,368,-2,368,-25,368,368,368,-8,368],
sm279=[0,-2,106,-1,0,-4,0,-27,369,369,-2,369],
sm280=[0,-2,370,-1,0,-4,0,-27,370,370,-2,370],
sm281=[0,-2,371,-1,288,-4,0,-3,289,-18,290,371,-3,371,371,-2,371,-37,372],
sm282=[0,-2,373,-1,288,-4,0,-3,289,-18,373,373,-3,373,373,-2,373,-37,373],
sm283=[0,-2,374,-1,374,-4,0,-3,374,-18,374,374,-3,374,374,-2,374,-37,374],
sm284=[0,-2,375,-1,375,-4,0,-3,375,-18,375,375,-3,375,375,-2,375,-37,375],
sm285=[0,-4,0,-4,0,-21,376,-42,377,378],
sm286=[0,-4,0,-4,0,-21,379,-42,379,379],
sm287=[0,-2,380,380,0,-4,0],
sm288=[0,-4,0,-4,0,-23,381],
sm289=[0,-4,0,-4,0,-14,382],
sm290=[0,383,-3,383,-4,383,-3,383,383,-6,383,383,-3,383,-3,383,-3,383,-29,383,-2,383],
sm291=[0,-4,0,-4,0,-24,384],
sm292=[0,-4,385,-4,385,-3,385,385,-6,385,385,-3,385,-3,385,385,-1,385,385,-29,385,-2,385],
sm293=[0,-4,42,-4,0,-3,43,30,-7,70,-3,71,-3,72,-3,145,-29,73,-2,386],
sm294=[0,387,-3,387,-4,387,-3,387,387,-6,387,387,-3,387,-3,387,-3,387,-29,387,-2,387],
sm295=[0,388,-3,388,-4,388,-3,388,388,-6,388,388,-3,388,-3,388,-3,388,-29,388,-2,388],
sm296=[0,-2,179,-1,0,-4,0,-11,389,389,-7,389,-1,180,-3,389,389,-3,389,-6,181,-2,182,-15,389,389,389,-8,389],
sm297=[0,-2,389,-1,0,-4,0,-11,389,389,-7,389,-4,250,389,389,-3,389,-25,389,389,389,-8,389],
sm298=[0,-2,390,-1,0,185,-3,0,-22,186,-15,187],
sm299=[0,-2,391,-1,0,-4,0,-11,391,391,-7,391,-1,391,-3,391,391,-2,391,391,-6,391,-2,391,-15,391,391,391,-8,391],
sm300=[0,-4,0,-4,0,-3,392,-82,392],
sm301=[0,-4,0,-4,0,-3,393,-83,393],
sm302=[0,-4,0,-4,0,-28,394],
sm303=[0,-2,56,-1,0,-4,0,-12,58,-7,59,-5,60,-1,395,-28,62,63,64,-8,65],
sm304=[0,-2,396,-1,0,-4,0,-12,396,-7,396,-5,396,-1,396,-28,396,396,396,-8,396],
sm305=[0,-2,397,-1,0,-4,0,-11,397,397,-7,397,-4,397,397,397,-3,397,-25,397,397,397,-8,397],
sm306=[0,-2,398,-1,0,-4,0,-11,398,398,-7,398,-4,398,398,398,-3,398,-25,398,398,398,-8,398],
sm307=[0,-2,399,-1,0,-4,0,-11,399,399,-7,399,-4,399,399,399,-3,399,-25,399,399,399,-8,399],
sm308=[0,-2,257,-1,0,-4,0,-11,257,257,-7,257,-4,257,257,257,-3,257,-4,258,-20,257,257,257,-8,257],
sm309=[0,-2,400,-1,0,-4,0,-11,400,400,-7,400,-2,400,-1,400,400,400,-3,400,-4,400,-20,400,400,400,-8,400],
sm310=[0,-2,401,-1,0,-4,0,-11,401,401,-7,401,-2,401,-1,401,401,401,-3,401,-5,401,-19,401,401,401,-8,401],
sm311=[0,-2,402,-1,0,-4,0,-11,402,402,-7,402,-2,402,-1,402,402,402,-3,402,-4,402,-20,402,402,402,-8,402],
sm312=[0,-2,403,-1,0,-4,0,-11,403,403,-7,403,-2,403,-1,403,403,403,-3,403,-5,403,-19,403,403,403,-8,403],
sm313=[0,-2,404,-1,0,-4,0,-11,404,404,-7,404,-2,404,-1,404,404,404,-3,404,-4,404,404,-19,404,404,404,-8,404],
sm314=[0,-2,405,-1,0,-4,0,-11,405,405,-7,405,-2,405,-1,405,405,405,-3,405,-4,405,405,-19,405,405,405,-8,405],
sm315=[0,-4,337,-4,0,-3,338,-19,406],
sm316=[0,-2,407,-1,0,-4,0,-11,407,407,-7,407,-2,407,-1,407,407,407,-3,407,-4,407,407,-19,407,407,407,-8,407],
sm317=[0,-4,408,-4,0,-3,408,-19,408],
sm318=[0,-4,409,-4,0,-3,409,-19,409],
sm319=[0,-1,260,410,-1,0,-4,0],
sm320=[0,-1,411,411,-1,0,-4,0],
sm321=[0,-1,411,411,-1,0,-4,0,-45,412],
sm322=[0,-2,410,-1,0,-4,0],
sm323=[0,-2,413,-1,0,-4,0],
sm324=[0,-2,414,-1,0,-4,0],
sm325=[0,-2,415,-1,0,-4,0],
sm326=[0,-2,415,-1,0,-4,0,-45,416],
sm327=[0,-4,0,-4,0,-4,417,-9,417,-8,417,-20,417,417],
sm328=[0,-1,418,-2,0,-4,0],
sm329=[0,-4,0,-4,0,-4,419,-9,419,-8,419,-20,419,419],
sm330=[0,-4,356,-4,0,-3,357,-19,420],
sm331=[0,-4,421,-4,0,-3,421,-19,421],
sm332=[0,-4,422,-4,0,-3,422,-19,422],
sm333=[0,-1,359,-2,0,-4,0,-28,423,-5,360,361],
sm334=[0,-1,424,-2,0,-4,0,-28,424,-5,424,424],
sm335=[0,-4,0,-4,0,-25,425,426],
sm336=[0,-4,0,-4,0,-25,427,427],
sm337=[0,-4,0,-4,0,-25,428,428],
sm338=[0,-4,0,-4,0,-47,429],
sm339=[0,-4,0,-4,0,-28,430],
sm340=[0,-4,0,-4,0,-23,431,-2,431,-9,431],
sm341=[0,-4,0,-4,0,-23,432,-2,432,-10,432],
sm342=[0,-4,0,-4,0,-23,433,-2,433,-9,433],
sm343=[0,-4,0,-4,0,-23,434,-2,434,-10,434],
sm344=[0,-4,0,-4,0,-23,435,-2,435,-9,435,435],
sm345=[0,-4,0,-4,0,-23,436,-2,436,-9,436,436],
sm346=[0,-4,0,-4,0,-23,437],
sm347=[0,-2,438,-1,0,-4,0,-11,438,438,-7,438,-5,438,-1,438,-2,438,-25,438,438,438,-8,438],
sm348=[0,-2,439,-1,0,-4,0,-27,439,439,-2,439],
sm349=[0,-2,440,-1,0,-4,0,-23,440,-3,440,440,-2,440],
sm350=[0,-2,441,-1,288,-4,0,-3,289,-18,290,441,-3,441,441,-2,441,-37,441],
sm351=[0,-4,0,-4,0,-67,442],
sm352=[0,-2,443,-1,443,-4,0,-3,443,-18,443,443,-3,443,443,-2,443,-37,443],
sm353=[0,-4,288,-4,0,-3,289,-18,290,444],
sm354=[0,-4,0,-4,0,-21,445],
sm355=[0,-2,446,-1,0,-4,0,-12,446,-1,446,-5,446,-2,446,-1,446,446,-27,446,446,446,446,446,446,-8,446],
sm356=[0,-4,0,-4,0,-21,447],
sm357=[0,-2,448,-1,0,-4,0,-12,448,-1,448,-5,448,-2,448,-1,448,448,-27,448,448,448,448,448,448,-8,448],
sm358=[0,-4,0,-4,0,-24,449],
sm359=[0,-4,0,-4,0,-23,450],
sm360=[0,-2,451,-1,0,-4,0,-11,451,451,-7,451,-4,250,451,451,-3,451,-25,451,451,451,-8,451],
sm361=[0,-4,0,-4,0,-23,452],
sm362=[0,-4,0,-4,0,-23,453],
sm363=[0,-4,0,-4,0,-22,265,-45,195],
sm364=[0,-4,0,-4,0,-27,454],
sm365=[0,-2,455,-1,0,-4,0,-12,455,-7,455,-5,455,-1,455,-28,455,455,455,-8,455],
sm366=[0,-2,456,-1,0,-4,0,-11,456,456,-7,456,-2,456,-1,456,456,456,-3,456,-4,456,456,-19,456,456,456,-8,456],
sm367=[0,-4,457,-4,0,-3,457,-19,457],
sm368=[0,-4,0,-4,0,-23,458],
sm369=[0,-4,0,-4,0,-23,351],
sm370=[0,-4,0,-4,0,-23,339],
sm371=[0,-4,0,-4,0,-23,459],
sm372=[0,-1,460,460,-1,0,-4,0],
sm373=[0,-4,0,-4,0,-14,461],
sm374=[0,-4,0,-4,0,-4,462,-39,463],
sm375=[0,-2,464,-1,0,-4,0],
sm376=[0,-4,0,-4,0,-4,465,-9,465,-8,465,-20,465,465],
sm377=[0,-4,466,-4,0,-3,466,-19,466],
sm378=[0,-4,0,-4,0,-27,467],
sm379=[0,-1,468,-2,0,-4,0,-28,468,-5,468,468],
sm380=[0,-4,0,-4,0,-25,469,469],
sm381=[0,-4,0,-4,0,-27,470],
sm382=[0,-4,0,-4,0,-23,471,-2,471,-9,471,471],
sm383=[0,-2,472,-1,0,-4,0,-23,472,-3,472,472,-2,472],
sm384=[0,-2,473,-1,473,-4,0,-3,473,-18,473,473,-3,473,473,-2,473,-37,473],
sm385=[0,-2,474,-1,0,-4,0,-12,474,-1,474,-5,474,-2,474,-1,474,474,-27,474,474,474,474,474,474,-8,474],
sm386=[0,-4,475,-4,475,-3,475,475,-7,475,-3,475,-3,475,-3,475,-29,475,-2,475],
sm387=[0,-4,476,-4,476,-3,476,476,-6,476,476,-3,476,-3,476,476,-1,476,476,-29,476,-2,476],
sm388=[0,-2,477,-1,0,-4,0,-11,477,477,-7,477,-1,477,-3,477,477,-3,477,-6,477,-2,477,-15,477,477,477,-8,477],
sm389=[0,-1,478,478,-1,0,-4,0,-45,479],
sm390=[0,-1,480,480,-1,0,-4,0],
sm391=[0,-2,106,-1,0,-4,0,-27,481,482,-2,61],
sm392=[0,-4,0,-4,0,-25,483,483],
sm393=[0,-4,0,-4,0,-23,484],
sm394=[0,-1,485,485,-1,0,-4,0],
sm395=[0,-4,0,-4,0,-28,486],
sm396=[0,-1,487,-2,0,-4,0,-28,487,-5,487,487],
sm397=[0,-1,488,-2,0,-4,0,-28,488,-5,488,488],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],["<",14],["import",15],["/",16],[">",24],["f",18],["filter",19],["style",20],["</",21],["#",22],[null,5],["+",64],["-",26],["*",67],["`",34],["[",30],["]",31],["(",32],[")",33],[",",35],["{",36],[";",37],["}",38],["supports",40],["@",41],["keyframes",42],["id",43],["from",44],["to",45],["and",46],["or",47],["not",48],["media",50],["only",51],[":",78],["<=",54],["=",55],["%",57],["px",58],["in",59],["rad",60],["url",61],["\"",96],["'",97],["~",65],["||",66],["|",68],[".",69],["^=",71],["$=",72],["*=",73],["i",74],["s",75],["!",79],["important",77],["input",80],["area",81],["base",82],["br",83],["col",84],["command",85],["embed",86],["hr",87],["img",88],["keygen",89],["link",90],["meta",91],["param",92],["source",93],["track",94],["wbr",95]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,"<"],[15,"import"],[16,"/"],[24,">"],[18,"f"],[19,"filter"],[20,"style"],[21,"</"],[22,"#"],[5,null],[64,"+"],[26,"-"],[67,"*"],[34,"`"],[30,"["],[31,"]"],[32,"("],[33,")"],[35,","],[36,"{"],[37,";"],[38,"}"],[40,"supports"],[41,"@"],[42,"keyframes"],[43,"id"],[44,"from"],[45,"to"],[46,"and"],[47,"or"],[48,"not"],[50,"media"],[51,"only"],[78,":"],[54,"<="],[55,"="],[57,"%"],[58,"px"],[59,"in"],[60,"rad"],[61,"url"],[96,"\""],[97,"'"],[65,"~"],[66,"||"],[68,"|"],[69,"."],[71,"^="],[72,"$="],[73,"*="],[74,"i"],[75,"s"],[79,"!"],[77,"important"],[80,"input"],[81,"area"],[82,"base"],[83,"br"],[84,"col"],[85,"command"],[86,"embed"],[87,"hr"],[88,"img"],[89,"keygen"],[90,"link"],[91,"meta"],[92,"param"],[93,"source"],[94,"track"],[95,"wbr"]]),

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
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
sm17,
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
sm31,
sm32,
sm33,
sm34,
sm35,
sm36,
sm36,
sm17,
sm37,
sm38,
sm39,
sm40,
sm41,
sm42,
sm27,
sm43,
sm44,
sm45,
sm45,
sm46,
sm47,
sm48,
sm49,
sm50,
sm50,
sm51,
sm52,
sm53,
sm54,
sm55,
sm55,
sm56,
sm57,
sm58,
sm59,
sm60,
sm61,
sm62,
sm63,
sm64,
sm64,
sm64,
sm64,
sm65,
sm66,
sm67,
sm68,
sm69,
sm70,
sm71,
sm72,
sm73,
sm74,
sm75,
sm76,
sm77,
sm78,
sm79,
sm80,
sm80,
sm81,
sm82,
sm83,
sm84,
sm84,
sm85,
sm85,
sm86,
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
sm95,
sm99,
sm100,
sm101,
sm102,
sm103,
sm103,
sm104,
sm104,
sm105,
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
sm52,
sm117,
sm118,
sm119,
sm120,
sm121,
sm122,
sm123,
sm124,
sm125,
sm117,
sm126,
sm127,
sm127,
sm127,
sm127,
sm128,
sm129,
sm129,
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
sm145,
sm112,
sm112,
sm112,
sm146,
sm77,
sm147,
sm77,
sm148,
sm149,
sm150,
sm151,
sm152,
sm153,
sm154,
sm154,
sm155,
sm155,
sm154,
sm156,
sm157,
sm91,
sm92,
sm158,
sm159,
sm160,
sm161,
sm98,
sm147,
sm162,
sm163,
sm164,
sm165,
sm166,
sm167,
sm167,
sm167,
sm167,
sm167,
sm167,
sm167,
sm168,
sm169,
sm170,
sm171,
sm172,
sm173,
sm174,
sm174,
sm175,
sm176,
sm177,
sm178,
sm179,
sm180,
sm181,
sm182,
sm183,
sm183,
sm184,
sm184,
sm185,
sm186,
sm187,
sm188,
sm188,
sm189,
sm190,
sm191,
sm192,
sm192,
sm193,
sm194,
sm195,
sm196,
sm197,
sm197,
sm198,
sm198,
sm199,
sm200,
sm201,
sm202,
sm203,
sm204,
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
sm215,
sm216,
sm217,
sm217,
sm217,
sm217,
sm218,
sm117,
sm219,
sm77,
sm220,
sm221,
sm222,
sm223,
sm224,
sm93,
sm225,
sm226,
sm227,
sm228,
sm229,
sm230,
sm231,
sm232,
sm233,
sm232,
sm234,
sm235,
sm236,
sm237,
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
sm114,
sm250,
sm251,
sm252,
sm253,
sm254,
sm255,
sm256,
sm186,
sm257,
sm186,
sm258,
sm259,
sm260,
sm261,
sm186,
sm262,
sm262,
sm262,
sm263,
sm264,
sm265,
sm266,
sm266,
sm267,
sm268,
sm249,
sm269,
sm270,
sm271,
sm272,
sm194,
sm273,
sm194,
sm274,
sm275,
sm276,
sm117,
sm277,
sm278,
sm278,
sm279,
sm280,
sm281,
sm282,
sm210,
sm283,
sm284,
sm284,
sm285,
sm286,
sm286,
sm287,
sm288,
sm289,
sm290,
sm235,
sm291,
sm292,
sm293,
sm93,
sm294,
sm295,
sm296,
sm297,
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
sm309,
sm310,
sm311,
sm312,
sm313,
sm314,
sm315,
sm316,
sm317,
sm318,
sm318,
sm319,
sm319,
sm320,
sm321,
sm320,
sm320,
sm322,
sm323,
sm324,
sm325,
sm326,
sm325,
sm325,
sm327,
sm328,
sm329,
sm329,
sm329,
sm330,
sm316,
sm331,
sm332,
sm332,
sm333,
sm334,
sm335,
sm336,
sm337,
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
sm349,
sm350,
sm351,
sm352,
sm353,
sm354,
sm355,
sm356,
sm356,
sm357,
sm295,
sm358,
sm92,
sm359,
sm360,
sm361,
sm362,
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
sm371,
sm373,
sm374,
sm375,
sm376,
sm366,
sm377,
sm378,
sm379,
sm52,
sm268,
sm380,
sm381,
sm382,
sm383,
sm384,
sm385,
sm386,
sm387,
sm388,
sm319,
sm389,
sm319,
sm390,
sm390,
sm391,
sm392,
sm393,
sm394,
sm393,
sm395,
sm396,
sm397],

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
e$2],

    //Empty Function
    nf = ()=>-1, 

    //Environment Functions
    
redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
redn = (ret, plen, t, e, o, l, s) => {        if(plen > 0){            let ln = max(o.length - plen, 0);            o[ln] = o[o.length -1];            o.length = ln + 1;        }        return ret;    },
shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
R00_S=function (sym,env,lex,state,output,len) {return sym[0]},
R20_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
R21_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return [sym[0]]},
R30_html_BODY=function (sym,env,lex,state,output,len) {return (sym[1].import_list = sym[0],sym[1])},
R50_IMPORT_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
R70_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
R110_md_HEADER=function (sym,env,lex,state,output,len) {return fn.element_selector("h" + sym[0].length,null,sym[1],env,lex)},
R190_md_UNORDERED_LIST_ITEMS=function (sym,env,lex,state,output,len) {return fn.create_ordered_list(sym[0],0,-1,env,lex)},
R210_md_UNORDERED_LIST_ITEM=function (sym,env,lex,state,output,len) {return {lvl : sym[1],li : fn.element_selector("li",null,sym[2],env,lex)}},
R211_md_UNORDERED_LIST_ITEM=function (sym,env,lex,state,output,len) {return {lvl : null,li : fn.element_selector("li",null,sym[1],env,lex)}},
R220_md_CODE_BLOCK2011_group=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,[sym[1]],env,lex)},
R240_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,sym[4],env,lex)},
R241_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,sym[3],env,lex)},
R242_md_CODE_BLOCK=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,null,env,lex)},
R260_md_EMPHASIS=function (sym,env,lex,state,output,len) {return fn.element_selector("b",null,sym[1],env,lex)},
R270_md_CODE_QUOTE=function (sym,env,lex,state,output,len) {return fn.element_selector("code",null,sym[2],env,lex)},
R280_md_code_sentinel=function (sym,env,lex,state,output,len) {return console.log("ASDASDASDASD")},
R350_css_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
C360_css_RULE_SET=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.body = sym[2];},
C470_css_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
C500_css_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
R800_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R801_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R1090_css_COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len > 1 ? [sym[0]].concat(sym[1]) : [sym[0]]},
R1340_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : sym[0],at_rules : []}},
R1341_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : [],at_rules : [sym[0]]}},
R1342_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].at_rules.push(sym[1]),sym[0])},
R1343_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].props.push(...sym[1]),sym[0])},
R1390_css_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
R1430_html_GOAL_TAG=function (sym,env,lex,state,output,len) {return sym[1]},
R1450_html_DTD=function (sym,env,lex,state,output,len) {return null},
R1460_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
R1461_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
R1462_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
R1463_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [()=>(30),
(...v)=>(redv(5,R00_S,1,0,...v)),
(...v)=>(redn(1031,1,...v)),
(...v)=>(redn(143367,1,...v)),
(...v)=>(redn(144391,1,...v)),
(...v)=>(redv(2055,R21_IMPORT_TAG_list,1,0,...v)),
()=>(70),
()=>(50),
()=>(74),
()=>(78),
()=>(54),
()=>(66),
()=>(82),
()=>(86),
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
(...v)=>(redn(146439,1,...v)),
()=>(150),
(...v)=>(redv(144395,R30_html_BODY,2,0,...v)),
(...v)=>(redv(2059,R20_IMPORT_TAG_list,2,0,...v)),
()=>(174),
(...v)=>(redn(150535,1,...v)),
()=>(170),
()=>(166),
()=>(182),
()=>(194),
()=>(190),
()=>(206),
()=>(202),
()=>(222),
()=>(218),
(...v)=>(redn(158727,1,...v)),
(...v)=>(redv(146443,R1430_html_GOAL_TAG,2,0,...v)),
()=>(226),
()=>(230),
()=>(234),
(...v)=>(redv(154631,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(155655,fn.attribute,1,0,...v)),
()=>(242),
()=>(246),
()=>(250),
(...v)=>(redn(156679,1,...v)),
()=>(254),
()=>(338),
(...v)=>((redn(34819,0,...v))),
()=>(370),
()=>(378),
()=>(302),
()=>(282),
()=>(334),
()=>(346),
()=>(374),
()=>(382),
()=>(410),
()=>(406),
()=>(502),
()=>(418),
()=>(470),
()=>(490),
()=>(498),
()=>(486),
()=>(494),
()=>(506),
()=>(514),
()=>(510),
(...v)=>(redv(149519,R1462_html_TAG,3,0,...v)),
()=>(518),
()=>(522),
()=>(526),
(...v)=>(redv(159751,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(161799,1,...v)),
()=>(534),
(...v)=>(redv(5139,R50_IMPORT_TAG,4,0,...v)),
(...v)=>(redv(154635,R20_IMPORT_TAG_list,2,0,...v)),
()=>(546),
()=>(550),
()=>(554),
()=>(558),
()=>(562),
()=>(570),
(...v)=>(redn(29703,1,...v)),
(...v)=>(redn(34823,1,...v)),
(...v)=>(redv(31751,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(30727,1,...v)),
()=>(590),
()=>(594),
()=>(606),
()=>(602),
()=>(598),
(...v)=>(redv(33799,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(32775,1,...v)),
()=>(614),
()=>(610),
()=>(638),
(...v)=>(redv(35847,R21_IMPORT_TAG_list,1,0,...v)),
()=>(658),
(...v)=>(redv(111623,R1090_css_COMPLEX_SELECTOR,1,0,...v)),
()=>(662),
()=>(666),
()=>(670),
(...v)=>(rednv(116743,fn.compoundSelector,1,0,...v)),
()=>(694),
(...v)=>(rednv(118791,fn.selector,1,0,...v)),
()=>(702),
()=>(698),
(...v)=>(redn(119815,1,...v)),
(...v)=>(redn(121863,1,...v)),
()=>(706),
(...v)=>(redn(120839,1,...v)),
(...v)=>(redv(112647,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(122887,1,...v)),
()=>(710),
()=>(714),
()=>(726),
()=>(730),
()=>(738),
(...v)=>(redv(115719,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(114695,1,...v)),
()=>(750),
()=>(754),
()=>(758),
()=>(766),
()=>(770),
()=>(774),
(...v)=>(redn(152583,1,...v)),
(...v)=>(redv(151559,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(153607,1,...v)),
(...v)=>(redv(153607,R1450_html_DTD,1,0,...v)),
(...v)=>(redn(160775,1,...v)),
(...v)=>(rednv(160775,fn.text,1,0,...v)),
(...v)=>(redn(9223,1,...v)),
()=>(790),
()=>(822),
(...v)=>(redv(10247,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(19463,R190_md_UNORDERED_LIST_ITEMS,1,0,...v)),
()=>(830),
(...v)=>(redv(18439,R21_IMPORT_TAG_list,1,0,...v)),
()=>(842),
(...v)=>(redn(20487,1,...v)),
(...v)=>(redv(149523,R1462_html_TAG,4,0,...v)),
(...v)=>(redv(149523,R50_IMPORT_TAG,4,0,...v)),
()=>(854),
()=>(858),
(...v)=>(redv(148499,R1450_html_DTD,4,0,...v)),
(...v)=>(redv(159755,R800_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(5143,R50_IMPORT_TAG,5,0,...v)),
(...v)=>(rednv(155663,fn.attribute,3,0,...v)),
(...v)=>(redn(157703,1,...v)),
()=>(882),
()=>(886),
()=>(906),
()=>(902),
()=>(898),
()=>(894),
()=>(890),
(...v)=>(redv(156687,R1430_html_GOAL_TAG,3,0,...v)),
()=>(914),
()=>(918),
(...v)=>(redn(34827,2,...v)),
(...v)=>(redv(31755,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(33803,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(39947,2,...v)),
()=>(930),
()=>(950),
()=>(942),
()=>(946),
()=>(1010),
()=>(998),
()=>(994),
()=>(1014),
()=>(1022),
()=>(1066),
()=>(1062),
()=>(1042),
()=>(1034),
()=>(1078),
()=>(1082),
(...v)=>(redv(137223,R1340_css_declaration_list,1,0,...v)),
()=>(1102),
(...v)=>(redv(137223,R1341_css_declaration_list,1,0,...v)),
(...v)=>(redv(134151,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(133127,1,...v)),
()=>(1106),
(...v)=>(redv(111627,R1090_css_COMPLEX_SELECTOR,2,0,...v)),
(...v)=>(redv(110599,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(109575,fn.comboSelector,1,0,...v)),
(...v)=>(redn(117767,1,...v)),
(...v)=>(rednv(116747,fn.compoundSelector,2,0,...v)),
(...v)=>(redv(112651,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(115723,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(rednv(118795,fn.selector,2,0,...v)),
(...v)=>(redn(121867,2,...v)),
(...v)=>(redn(120843,2,...v)),
(...v)=>(rednv(123915,fn.idSelector,2,0,...v)),
(...v)=>(rednv(124939,fn.classSelector,2,0,...v)),
()=>(1122),
()=>(1146),
()=>(1130),
()=>(1134),
()=>(1138),
()=>(1142),
(...v)=>(rednv(131083,fn.pseudoClassSelector,2,0,...v)),
()=>(1154),
(...v)=>(rednv(132107,fn.pseudoElementSelector,2,0,...v)),
(...v)=>(redn(114699,2,...v)),
(...v)=>(redv(113671,R21_IMPORT_TAG_list,1,0,...v)),
()=>(1162),
(...v)=>(redv(149527,R50_IMPORT_TAG,5,0,...v)),
()=>(1174),
(...v)=>(redv(151563,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1178),
(...v)=>(redv(10251,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(13319,1,...v)),
(...v)=>(redv(12295,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(14343,1,...v)),
()=>(1186),
(...v)=>(redv(18443,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1194),
()=>(1198),
()=>(1202),
()=>(1206),
()=>(1214),
()=>(1218),
(...v)=>(redn(165895,1,...v)),
(...v)=>(redv(164871,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(163847,1,...v)),
(...v)=>(redn(166919,1,...v)),
()=>(1226),
()=>(1230),
()=>(1234),
()=>(1242),
(...v)=>(redn(46095,3,...v)),
()=>(1254),
(...v)=>(redv(40967,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(41991,1,...v)),
()=>(1266),
()=>(1278),
()=>(1294),
()=>(1290),
(...v)=>(redv(63495,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(67591,1,...v)),
()=>(1302),
()=>(1310),
(...v)=>(redn(69639,1,...v)),
(...v)=>(redn(68615,1,...v)),
()=>(1326),
()=>(1334),
()=>(1378),
()=>(1350),
()=>(1354),
(...v)=>(redn(77831,1,...v)),
(...v)=>(redn(97287,1,...v)),
()=>(1390),
(...v)=>(redn(65543,1,...v)),
()=>(1394),
(...v)=>(redn(49159,1,...v)),
()=>(1398),
(...v)=>(redn(58375,1,...v)),
()=>(1418),
()=>(1426),
()=>(1438),
(...v)=>(redn(59399,1,...v)),
(...v)=>(redn(60423,1,...v)),
()=>(1442),
()=>(1446),
()=>(1450),
(...v)=>(redv(35855,R350_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(1454),
(...v)=>(rednv(36879,C360_css_RULE_SET,3,0,...v)),
(...v)=>(redv(137227,R1342_css_declaration_list,2,0,...v)),
(...v)=>(redv(137227,R1343_css_declaration_list,2,0,...v)),
()=>(1458),
(...v)=>(redv(136199,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(135175,1,...v)),
(...v)=>(redv(137227,R1340_css_declaration_list,2,0,...v)),
()=>(1482),
()=>(1486),
()=>(1474),
(...v)=>(redv(110603,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(109579,fn.comboSelector,2,0,...v)),
(...v)=>(rednv(116751,fn.compoundSelector,3,0,...v)),
(...v)=>(rednv(126991,fn.attribSelector,3,0,...v)),
()=>(1494),
()=>(1498),
()=>(1502),
(...v)=>(redn(128007,1,...v)),
(...v)=>(rednv(131087,fn.pseudoClassSelector,3,0,...v)),
(...v)=>(redv(113675,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1514),
()=>(1518),
(...v)=>(redv(149531,R1462_html_TAG,6,0,...v)),
(...v)=>(redv(11279,R110_md_HEADER,3,0,...v)),
(...v)=>(redv(12299,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1526),
(...v)=>(redv(21519,R211_md_UNORDERED_LIST_ITEM,3,0,...v)),
()=>(1530),
(...v)=>(redv(26639,R260_md_EMPHASIS,3,0,...v)),
()=>(1534),
()=>(1538),
(...v)=>(redv(149531,R1463_html_TAG,6,0,...v)),
(...v)=>(redv(162831,R1430_html_GOAL_TAG,3,0,...v)),
(...v)=>(redv(164875,R800_css_general_enclosed6202_group_list,2,0,...v)),
()=>(1542),
(...v)=>(redv(149535,R1461_html_TAG,7,0,...v)),
(...v)=>(redn(46099,4,...v)),
(...v)=>(redv(40971,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1558),
()=>(1562),
(...v)=>(redv(105479,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(104455,1,...v)),
()=>(1570),
(...v)=>(redv(107527,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(106503,1,...v)),
(...v)=>(redn(103435,2,...v)),
(...v)=>(redn(102407,1,...v)),
(...v)=>((redn(38915,0,...v))),
(...v)=>(redn(67595,2,...v)),
(...v)=>(redn(73739,2,...v)),
(...v)=>(redn(76811,2,...v)),
(...v)=>(redv(72711,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(75783,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(70667,2,...v)),
()=>(1622),
()=>(1626),
()=>(1646),
()=>(1642),
(...v)=>(redn(96263,1,...v)),
()=>(1634),
(...v)=>(redn(78855,1,...v)),
()=>(1658),
()=>(1662),
()=>(1666),
()=>(1670),
()=>(1650),
()=>(1686),
()=>(1690),
()=>(1694),
()=>(1698),
(...v)=>(redn(94215,1,...v)),
()=>(1706),
()=>(1710),
()=>(1714),
()=>(1718),
()=>(1738),
()=>(1734),
()=>(1726),
()=>(1770),
()=>(1758),
()=>(1762),
(...v)=>(redn(58379,2,...v)),
(...v)=>(redv(55303,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(57351,R21_IMPORT_TAG_list,1,0,...v)),
()=>(1794),
()=>(1798),
()=>(1806),
(...v)=>(rednv(36883,C360_css_RULE_SET,4,0,...v)),
(...v)=>(redv(137231,R1343_css_declaration_list,3,0,...v)),
(...v)=>(redv(134159,R350_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(139279,fn.parseDeclaration,3,0,...v)),
()=>(1822),
(...v)=>(redn(142343,1,...v)),
(...v)=>(redv(141319,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(140295,1,...v)),
()=>(1838),
()=>(1842),
()=>(1846),
(...v)=>(redn(125959,1,...v)),
(...v)=>(redn(128011,2,...v)),
()=>(1850),
()=>(1854),
(...v)=>(redv(149535,R50_IMPORT_TAG,7,0,...v)),
()=>(1858),
(...v)=>(redv(21523,R210_md_UNORDERED_LIST_ITEM,4,0,...v)),
()=>(1862),
(...v)=>(redv(149535,R1460_html_TAG,7,0,...v)),
(...v)=>(redv(149539,R70_html_TAG,8,0,...v)),
(...v)=>(redn(46103,5,...v)),
()=>(1886),
(...v)=>(redn(108559,3,...v)),
(...v)=>(redv(105483,R800_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(107531,R800_css_general_enclosed6202_group_list,2,0,...v)),
()=>(1890),
(...v)=>(redn(38919,1,...v)),
(...v)=>(redv(37895,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(63503,R350_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(67599,3,...v)),
(...v)=>(redn(66571,2,...v)),
(...v)=>(redv(72715,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(75787,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(71691,2,...v)),
(...v)=>(redn(74763,2,...v)),
(...v)=>(redn(77839,3,...v)),
(...v)=>(redn(79887,3,...v)),
()=>(1898),
(...v)=>(redn(85007,3,...v)),
(...v)=>(redv(83975,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(82951,1,...v)),
()=>(1914),
(...v)=>(redn(87047,1,...v)),
()=>(1922),
()=>(1930),
()=>(1934),
(...v)=>(redn(88071,1,...v)),
()=>(1938),
(...v)=>(redn(101387,2,...v)),
()=>(1942),
(...v)=>(redn(100359,1,...v)),
()=>(1946),
(...v)=>(redv(81927,R801_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(80903,1,...v)),
()=>(1954),
(...v)=>(redv(47111,R21_IMPORT_TAG_list,1,0,...v)),
()=>(1966),
()=>(1962),
(...v)=>(redv(50183,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(52231,1,...v)),
()=>(1970),
()=>(1974),
(...v)=>(redv(55307,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(57355,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(54283,2,...v)),
(...v)=>(redn(56331,2,...v)),
(...v)=>(redn(59407,3,...v)),
(...v)=>(redn(61455,3,...v)),
()=>(1978),
(...v)=>(rednv(36887,C360_css_RULE_SET,5,0,...v)),
(...v)=>(redv(136207,R350_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(139283,fn.parseDeclaration,4,0,...v)),
(...v)=>(redv(142347,R1390_css_declaration_values,2,0,...v)),
()=>(1982),
(...v)=>(redv(141323,R800_css_general_enclosed6202_group_list,2,0,...v)),
()=>(1986),
()=>(1990),
(...v)=>(rednv(126999,fn.attribSelector,5,0,...v)),
(...v)=>(redn(129031,1,...v)),
(...v)=>(redn(130063,3,...v)),
()=>(1994),
()=>(1998),
(...v)=>(redn(46107,6,...v)),
()=>(2002),
(...v)=>(redn(43015,1,...v)),
(...v)=>(redn(64539,6,...v)),
(...v)=>(redv(37899,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(85011,4,...v)),
(...v)=>(redv(83979,R800_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redn(86031,3,...v)),
(...v)=>(redn(93199,3,...v)),
(...v)=>(redn(87051,2,...v)),
()=>(2010),
()=>(2018),
()=>(2022),
(...v)=>(redn(88075,2,...v)),
(...v)=>(redn(98319,3,...v)),
(...v)=>(redv(81931,R800_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(rednv(48155,C470_css_keyframes,6,0,...v)),
(...v)=>(redv(47115,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(99339,2,...v)),
(...v)=>(redn(53275,6,...v)),
(...v)=>(redn(62483,4,...v)),
(...v)=>(redn(138251,2,...v)),
(...v)=>(redv(142351,R1390_css_declaration_values,3,0,...v)),
(...v)=>(rednv(127003,fn.attribSelector,6,0,...v)),
(...v)=>(redv(27671,R270_md_CODE_QUOTE,5,0,...v)),
(...v)=>(redn(25627,6,...v)),
(...v)=>(redn(44051,4,...v)),
(...v)=>(redn(90119,1,...v)),
()=>(2038),
(...v)=>(redn(92167,1,...v)),
()=>(2046),
()=>(2050),
(...v)=>(redv(50191,R350_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(93207,5,...v)),
(...v)=>(redn(90123,2,...v)),
()=>(2054),
(...v)=>(rednv(51219,C500_css_keyframes_blocks,4,0,...v)),
(...v)=>(rednv(51223,C500_css_keyframes_blocks,5,0,...v))],

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
nf,
nf,
v=>lsm(v,gt4),
v=>lsm(v,gt5),
v=>lsm(v,gt6),
v=>lsm(v,gt7),
v=>lsm(v,gt8),
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
v=>lsm(v,gt9),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt9),
v=>lsm(v,gt10),
v=>lsm(v,gt9),
v=>lsm(v,gt11),
nf,
v=>lsm(v,gt9),
nf,
nf,
v=>lsm(v,gt12),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt13),
nf,
nf,
v=>lsm(v,gt14),
nf,
nf,
v=>lsm(v,gt15),
v=>lsm(v,gt16),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt17),
nf,
v=>lsm(v,gt18),
v=>lsm(v,gt19),
v=>lsm(v,gt20),
v=>lsm(v,gt21),
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
v=>lsm(v,gt22),
v=>lsm(v,gt23),
nf,
v=>lsm(v,gt24),
nf,
nf,
nf,
v=>lsm(v,gt25),
nf,
nf,
v=>lsm(v,gt26),
v=>lsm(v,gt27),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt12),
nf,
nf,
nf,
nf,
v=>lsm(v,gt28),
nf,
v=>lsm(v,gt29),
nf,
v=>lsm(v,gt30),
nf,
nf,
v=>lsm(v,gt31),
v=>lsm(v,gt32),
v=>lsm(v,gt2),
nf,
nf,
nf,
v=>lsm(v,gt33),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt34),
v=>lsm(v,gt35),
nf,
nf,
nf,
nf,
v=>lsm(v,gt16),
nf,
nf,
nf,
nf,
v=>lsm(v,gt36),
v=>lsm(v,gt37),
v=>lsm(v,gt38),
v=>lsm(v,gt39),
v=>lsm(v,gt40),
v=>lsm(v,gt41),
v=>lsm(v,gt42),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt43),
nf,
v=>lsm(v,gt44),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt45),
v=>lsm(v,gt21),
v=>lsm(v,gt21),
nf,
nf,
v=>lsm(v,gt23),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt46),
nf,
nf,
v=>lsm(v,gt47),
nf,
nf,
v=>lsm(v,gt48),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt49),
nf,
v=>lsm(v,gt50),
nf,
nf,
nf,
nf,
v=>lsm(v,gt51),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt52),
nf,
v=>lsm(v,gt31),
nf,
nf,
v=>lsm(v,gt53),
nf,
nf,
nf,
v=>lsm(v,gt54),
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
v=>lsm(v,gt55),
v=>lsm(v,gt56),
nf,
nf,
nf,
v=>lsm(v,gt57),
v=>lsm(v,gt58),
v=>lsm(v,gt59),
nf,
nf,
nf,
v=>lsm(v,gt60),
v=>lsm(v,gt61),
nf,
nf,
nf,
nf,
v=>lsm(v,gt62),
v=>lsm(v,gt63),
v=>lsm(v,gt64),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt65),
v=>lsm(v,gt66),
v=>lsm(v,gt67),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt42),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt68),
v=>lsm(v,gt69),
nf,
nf,
v=>lsm(v,gt21),
nf,
v=>lsm(v,gt70),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt71),
nf,
v=>lsm(v,gt72),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt73),
nf,
nf,
v=>lsm(v,gt31),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt74),
nf,
v=>lsm(v,gt75),
nf,
nf,
v=>lsm(v,gt76),
nf,
nf,
v=>lsm(v,gt77),
nf,
nf,
nf,
nf,
v=>lsm(v,gt78),
v=>lsm(v,gt79),
v=>lsm(v,gt80),
nf,
nf,
v=>lsm(v,gt81),
v=>lsm(v,gt82),
v=>lsm(v,gt83),
nf,
v=>lsm(v,gt84),
nf,
v=>lsm(v,gt85),
nf,
nf,
nf,
v=>lsm(v,gt86),
v=>lsm(v,gt63),
nf,
nf,
nf,
v=>lsm(v,gt87),
v=>lsm(v,gt88),
v=>lsm(v,gt89),
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
v=>lsm(v,gt96),
nf,
nf,
v=>lsm(v,gt86),
v=>lsm(v,gt97),
nf,
nf,
nf,
v=>lsm(v,gt98),
nf,
v=>lsm(v,gt99),
v=>lsm(v,gt100),
v=>lsm(v,gt101),
nf,
nf,
nf,
v=>lsm(v,gt102),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt31),
v=>lsm(v,gt103),
nf,
nf,
v=>lsm(v,gt104),
nf,
nf,
v=>lsm(v,gt105),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt106),
nf,
nf,
nf,
nf,
v=>lsm(v,gt107),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt108),
nf,
nf,
nf,
nf,
v=>lsm(v,gt109),
v=>lsm(v,gt110),
nf,
nf,
nf,
nf,
v=>lsm(v,gt111),
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
v=>lsm(v,gt112),
nf,
nf,
nf,
nf,
v=>lsm(v,gt113),
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
v=>lsm(v,gt114),
nf,
nf,
v=>lsm(v,gt114),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt31),
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
v=>lsm(v,gt115),
v=>lsm(v,gt116),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt117),
v=>lsm(v,gt118),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt119),
nf,
v=>lsm(v,gt120),
nf,
nf,
v=>lsm(v,gt42),
nf,
nf,
nf,
nf,
nf,
nf,
nf];

function getToken(l, SYM_LU) {
    if (l.END) return 0; /*5*/

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
gt121 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,502,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt122 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-1,506,505,504,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt123 = [0,-91,304,-19,508,306,310,311,302,-39,312,313,-3,303,-1,169,71,307],
gt124 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,509,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt125 = [0,-70,510,511,406,405,408,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt126 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-1,516,-2,60,-1,167,-6,166,-3,322,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt127 = [0,-139,518,230,231,-19,517,229,71,70],
gt128 = [0,-112,355,310,311,-27,520,-3,522,-1,354,-6,312,313,-4,356,229,71,307],
gt129 = [0,-139,365,230,231,-5,523,364,-12,356,229,71,70],
gt130 = [0,-119,526,-19,365,230,231,-3,528,-1,363,364,527,-11,356,229,71,70],
gt131 = [0,-28,529,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt132 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,530,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt133 = [0,-28,531,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt134 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,532,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt135 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,535,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt136 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,537,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt137 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,539,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt138 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,541,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt139 = [0,-42,543,-96,545,230,231,-19,544,229,71,70],
gt140 = [0,-42,478,-96,545,230,231,-19,544,229,71,70],
gt141 = [0,-49,546],
gt142 = [0,-28,548,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt143 = [0,-59,549,-79,551,230,231,-19,550,229,71,70],
gt144 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,556,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt145 = [0,-73,559,560,-64,365,230,231,-5,409,364,407,-11,356,229,71,70],
gt146 = [0,-68,66,172,-7,31,90,-4,88,67,173,-10,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,561,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt147 = [0,-74,565,-17,564,-46,365,230,231,-5,409,364,-12,356,229,71,70],
gt148 = [0,-139,365,230,231,-5,457,364,570,-11,356,229,71,70],
gt149 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,575,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt150 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,577,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt151 = [0,-28,580,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt152 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,582,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt153 = [0,-28,585,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt154 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,587,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt155 = [0,-50,589,591,590],
gt156 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,596,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt157 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,598,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt158 = [0,-28,605,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt159 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,607,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt160 = [0,-28,610,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt161 = [0,-28,612,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt162 = [0,-28,613,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt163 = [0,-28,614,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt164 = [0,-28,616,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt165 = [0,-28,617,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt166 = [0,-28,618,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt167 = [0,-51,622,620],
gt168 = [0,-50,623,591],
gt169 = [0,-68,66,172,-7,31,90,-4,88,67,173,-7,28,27,625,32,56,58,61,62,86,57,87,-4,60,-1,167,-6,166,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,-1,64,91,217,71,70],
gt170 = [0,-33,627],
gt171 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,628,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt172 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,632,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt173 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,633,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt174 = [0,-28,636,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt175 = [0,-28,637,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt176 = [0,-28,638,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt177 = [0,-28,639,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt178 = [0,-28,640,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt179 = [0,-51,641],
gt180 = [0,-51,622],
gt181 = [0,-24,6,5,645,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt182 = [0,-24,6,5,446,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-5,649,558,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt183 = [0,-28,650,-2,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-6,66,-8,31,90,-4,88,67,-8,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],
gt184 = [0,-24,6,5,652,7,8,9,110,16,10,24,14,11,15,-3,96,-2,17,18,19,21,20,97,-4,12,-2,22,-3,23,13,-2,111,115,-2,66,113,-7,31,90,-4,88,67,109,-7,28,27,26,32,56,58,61,62,86,57,87,-4,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,-4,76,77,75,74,92,64,91,69,71,70],

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
sm398=[0,-4,0,-4,0,-8,509],
sm399=[0,-4,0,-4,0,-8,510],
sm400=[0,-4,0,-4,0,-21,511],
sm401=[0,-4,0,-4,0,-21,512],
sm402=[0,-4,0,-4,0,-5,513,513,-1,513,513,-2,513,-4,513,-2,513,513,-5,513,-1,513,-7,513,-5,513,-5,513,513,-4,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,-5,513,513],
sm403=[0,-4,0,-4,0,-5,514,-3,514,-11,514,-5,514,-1,514,-19,514,-5,514],
sm404=[0,-4,0,-4,0,-5,515,-3,515,-11,515,-5,515,-1,515,-19,515,-5,515],
sm405=[0,-4,0,-4,0,-49,516],
sm406=[0,-4,0,-4,0,-12,517],
sm407=[0,-1,2,3,-1,0,-4,0,-8,113,-5,6,7,-1,114,-2,10,518,-6,15,-19,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm408=[0,-4,0,-4,0,-21,519],
sm409=[0,-4,0,-4,0,-21,520],
sm410=[0,521,521,521,-1,0,-4,0,-8,521,521,-2,521,521,521,521,521,521,-1,521,521,-1,521,521,521,521,521,-1,521,-1,521,521,521,521,521,521,521,-1,521,-2,521,521,-5,521,-2,521,-2,521,-31,521,521,-3,521,521,521,521,521,521,521,-7,521,521,521,521,521,521],
sm411=[0,-4,0,-4,0,-21,522],
sm412=[0,523,523,523,-1,0,-4,0,-8,523,523,-2,523,523,523,523,523,523,-1,523,523,-1,523,523,523,523,523,-1,523,-1,523,523,523,523,523,523,523,-1,523,-2,523,523,-5,523,-2,523,-2,523,-31,523,523,-3,523,523,523,523,523,523,523,-7,523,523,523,523,523,523],
sm413=[0,-4,0,-4,0,-21,524],
sm414=[0,525,525,525,-1,0,-4,0,-8,525,525,-2,525,525,525,525,525,525,-1,525,525,-1,525,525,525,525,525,-1,525,-1,525,525,525,525,525,525,525,-1,525,-2,525,525,-5,525,-2,525,-2,525,-31,525,525,-3,525,525,525,525,525,525,525,-7,525,525,525,525,525,525],
sm415=[0,-4,0,-4,0,-9,526,-3,494,-22,495],
sm416=[0,-4,0,-4,0,-9,527,-26,495],
sm417=[0,-4,0,-4,0,-9,528,-3,528,-22,528],
sm418=[0,-4,0,-4,0,-9,529,-26,529,530],
sm419=[0,-1,2,3,-1,0,-4,0,-8,4,531,-2,5,-1,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,-2,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm420=[0,-4,0,-4,0,-9,532],
sm421=[0,533,533,533,-1,0,-4,0,-5,533,533,-1,533,533,-2,533,533,533,533,533,533,-1,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,-2,533,533,-5,533,533,533,533,-2,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,533,-7,533,533,533,533,533,533],
sm422=[0,-4,0,-4,0,-9,534],
sm423=[0,535,535,535,-1,0,-4,0,-5,535,535,-1,535,535,-2,535,535,535,535,535,535,-1,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,-2,535,535,-5,535,535,535,535,-2,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,535,-7,535,535,535,535,535,535],
sm424=[0,536,536,536,-1,0,-4,0,-5,536,536,-1,536,536,-2,536,536,536,536,536,536,-1,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,-2,536,536,-5,536,536,536,536,-2,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,536,-7,536,536,536,536,536,536],
sm425=[0,-4,0,-4,0,-8,537],
sm426=[0,-4,0,-4,0,-5,538,-3,538,-11,538,-5,538,-1,538,-19,538,-5,538],
sm427=[0,539,539,539,-1,0,-4,0,-8,539,539,-2,539,539,539,539,539,539,-1,539,539,-1,539,539,539,539,539,-1,539,-1,539,539,539,539,539,539,539,-1,539,-2,539,539,-5,539,-2,539,-2,539,-31,539,539,-3,539,539,539,539,539,539,539,-7,539,539,539,539,539,539],
sm428=[0,540,540,540,-1,0,-4,0,-8,540,540,-2,540,540,540,540,540,540,-1,540,540,-1,540,540,540,540,540,-1,540,-1,540,540,540,540,540,540,540,-1,540,-2,540,540,-5,540,-2,540,-2,540,-31,540,540,-3,540,540,540,540,540,540,540,-7,540,540,540,540,540,540],
sm429=[0,-4,0,-4,0,-21,541],
sm430=[0,542,542,542,-1,0,-4,0,-8,542,542,-2,542,542,542,542,542,542,-1,542,542,-1,542,542,542,542,542,-1,542,-1,542,542,542,542,542,542,542,-1,542,-2,542,542,-5,542,-2,542,-2,542,-31,542,542,-3,542,542,542,542,542,542,542,-7,542,542,542,542,542,542],
sm431=[0,543,543,543,-1,0,-4,0,-8,543,543,-2,543,543,543,543,543,543,-1,543,543,-1,543,543,543,543,543,-1,543,-1,543,543,543,543,543,543,543,-1,543,-2,543,543,-5,543,-2,543,-2,543,-31,543,543,-3,543,543,543,543,543,543,543,-7,543,543,543,543,543,543],
sm432=[0,544,544,544,-1,0,-4,0,-8,544,544,-2,544,544,544,544,544,544,-1,544,544,-1,544,544,544,544,544,-1,544,-1,544,544,544,544,544,544,544,-1,544,-2,544,544,-5,544,-2,544,-2,544,-31,544,544,-3,544,544,544,544,544,544,544,-7,544,544,544,544,544,544],
sm433=[0,545,545,545,-1,0,-4,0,-8,545,545,-2,545,545,545,545,545,545,-1,545,545,-1,545,545,545,545,545,-1,545,-1,545,545,545,545,545,545,545,-1,545,-2,545,545,-5,545,-2,545,-2,545,-31,545,545,-3,545,545,545,545,545,545,545,-7,545,545,545,545,545,545],
sm434=[0,546,546,546,-1,0,-4,0,-8,546,546,-2,546,546,546,546,546,546,-1,546,546,-1,546,546,546,546,546,-1,546,-1,546,546,546,546,546,546,546,-1,546,-2,546,546,-5,546,-2,546,-2,546,-31,546,546,-3,546,546,546,546,546,546,546,-7,546,546,546,546,546,546],
sm435=[0,547,547,547,-1,0,-4,0,-8,547,547,-2,547,547,547,547,547,547,-1,547,547,-1,547,547,547,547,547,-1,547,-1,547,547,547,547,547,547,547,-1,547,-2,547,547,-5,547,-2,547,-2,547,-31,547,547,-3,547,547,547,547,547,547,547,-7,547,547,547,547,547,547],
sm436=[0,548,548,548,-1,0,-4,0,-8,548,548,-2,548,548,548,548,548,548,-1,548,548,-1,548,548,548,548,548,-1,548,-1,548,548,548,548,548,548,548,-1,548,-2,548,548,-5,548,-2,548,-2,548,-31,548,548,-3,548,548,548,548,548,548,548,-7,548,548,548,548,548,548],
sm437=[0,-4,0,-4,0,-9,549,-26,495],
sm438=[0,550,550,550,-1,0,-4,0,-8,550,550,-2,550,550,550,550,550,550,-1,550,550,-1,550,550,550,550,550,-1,550,-1,550,550,550,550,550,550,550,-1,550,-2,550,550,-5,550,-2,550,-2,550,-31,550,550,-3,550,550,550,550,550,550,550,-7,550,550,550,550,550,550],
sm439=[0,-4,0,-4,0,-9,551,-3,551,-22,551],
sm440=[0,-4,0,-4,0,-9,552,-26,495],
sm441=[0,-4,0,-4,0,-37,553],
sm442=[0,554,554,554,-1,0,-4,0,-8,554,554,-2,554,554,554,554,554,554,-1,554,554,-1,554,554,554,554,554,-1,554,-1,554,554,554,554,554,554,554,-1,554,-1,554,554,554,-5,554,-2,554,-2,554,-31,554,554,-3,554,554,554,554,554,554,554,-7,554,554,554,554,554,554],
sm443=[0,-4,0,-4,0,-9,555],
sm444=[0,556,556,556,-1,0,-4,0,-5,556,556,-1,556,556,-2,556,556,556,556,556,556,-1,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,-2,556,556,-5,556,556,556,556,-2,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,-7,556,556,556,556,556,556],
sm445=[0,557,557,557,-1,0,-4,0,-5,557,557,-1,557,557,-2,557,557,557,557,557,557,-1,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,-2,557,557,-5,557,557,557,557,-2,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,-7,557,557,557,557,557,557],
sm446=[0,558,558,558,-1,0,-4,0,-5,558,558,-1,558,558,-2,558,558,558,558,558,558,-1,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-2,558,558,-5,558,558,558,558,-2,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-7,558,558,558,558,558,558],
sm447=[0,-4,0,-4,0,-9,559],
sm448=[0,-4,0,-4,0,-9,560],
sm449=[0,561,561,561,-1,0,-4,0,-8,561,561,-2,561,561,561,561,561,561,-1,561,561,-1,561,561,561,561,561,-1,561,-1,561,561,561,561,561,561,561,-1,561,-2,561,561,-5,561,-2,561,-2,561,-31,561,561,-3,561,561,561,561,561,561,561,-7,561,561,561,561,561,561],
sm450=[0,562,562,562,-1,0,-4,0,-8,562,562,-2,562,562,562,562,562,562,-1,562,562,-1,562,562,562,562,562,-1,562,-1,562,562,562,562,562,562,562,-1,562,-2,562,562,-5,562,-2,562,-2,562,-31,562,562,-3,562,562,562,562,562,562,562,-7,562,562,562,562,562,562],
sm451=[0,563,563,563,-1,0,-4,0,-8,563,563,-2,563,563,563,563,563,563,-1,563,563,-1,563,563,563,563,563,-1,563,-1,563,563,563,563,563,563,563,-1,563,-2,563,563,-5,563,-2,563,-2,563,-31,563,563,-3,563,563,563,563,563,563,563,-7,563,563,563,563,563,563],
sm452=[0,564,564,564,-1,0,-4,0,-8,564,564,-2,564,564,564,564,564,564,-1,564,564,-1,564,564,564,564,564,-1,564,-1,564,564,564,564,564,564,564,-1,564,-2,564,564,-5,564,-2,564,-2,564,-31,564,564,-3,564,564,564,564,564,564,564,-7,564,564,564,564,564,564],
sm453=[0,-4,0,-4,0,-9,565],
sm454=[0,566,566,566,-1,0,-4,0,-8,566,566,-2,566,566,566,566,566,566,-1,566,566,-1,566,566,566,566,566,-1,566,-1,566,566,566,566,566,566,566,-1,566,-2,566,566,-5,566,-2,566,-2,566,-31,566,566,-3,566,566,566,566,566,566,566,-7,566,566,566,566,566,566],
sm455=[0,-1,2,3,-1,0,-4,0,-8,4,567,-2,5,567,6,7,8,-2,9,10,-2,11,12,13,14,-1,15,-1,16,17,18,19,20,21,567,-1,22,-2,23,24,-5,25,-2,26,-2,27,-31,28,29,-3,30,31,32,33,34,35,36,-7,37,38,39,40,41,42],
sm456=[0,-4,0,-4,0,-9,568,-26,568],
sm457=[0,569,569,569,-1,0,-4,0,-5,569,569,-1,569,569,-2,569,569,569,569,569,569,-1,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,-2,569,569,-5,569,569,569,569,-2,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,569,-7,569,569,569,569,569,569],
sm458=[0,-1,570,570,-1,0,-4,0,-5,570,-3,570,-2,570,-4,570,-27,570,570,570,-57,570,570,-3,570],
sm459=[0,-1,571,571,-1,0,-4,0,-5,571,-3,571,-2,571,-4,571,-27,571,571,571,-57,571,571,-3,571],
sm460=[0,-4,0,-4,0,-9,572],
sm461=[0,573,573,573,-1,0,-4,0,-8,573,573,-2,573,573,573,573,573,573,-1,573,573,-1,573,573,573,573,573,-1,573,-1,573,573,573,573,573,573,573,-1,573,-2,573,573,-5,573,-2,573,-2,573,-31,573,573,-3,573,573,573,573,573,573,573,-7,573,573,573,573,573,573],
sm462=[0,574,574,574,-1,0,-4,0,-8,574,574,-2,574,574,574,574,574,574,-1,574,574,-1,574,574,574,574,574,-1,574,-1,574,574,574,574,574,574,574,-1,574,-2,574,574,-5,574,-2,574,-2,574,-31,574,574,-3,574,574,574,574,574,574,574,-7,574,574,574,574,574,574],
sm463=[0,-4,0,-4,0,-9,575,-3,575,-22,575],
sm464=[0,-1,576,576,-1,0,-4,0,-5,576,-3,576,-2,576,-4,576,-27,576,576,576,-57,576,576,-3,576],

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
sm398,
sm399,
sm400,
sm401,
sm402,
sm402,
sm403,
sm404,
sm405,
sm404,
sm63$1,
sm406,
sm407,
sm408,
sm63$1,
sm409,
sm63$1,
sm63$1,
sm410,
sm63$1,
sm411,
sm63$1,
sm63$1,
sm412,
sm63$1,
sm413,
sm414,
sm415,
sm416,
sm417,
sm31$1,
sm418,
sm71$1,
sm419,
sm420,
sm421,
sm422,
sm423,
sm424,
sm11$1,
sm11$1,
sm425,
sm426,
sm427,
sm428,
sm429,
sm63$1,
sm63$1,
sm430,
sm63$1,
sm431,
sm432,
sm433,
sm63$1,
sm434,
sm435,
sm436,
sm63$1,
sm437,
sm438,
sm439,
sm440,
sm438,
sm441,
sm11$1,
sm442,
sm443,
sm444,
sm445,
sm446,
sm447,
sm448,
sm11$1,
sm63$1,
sm449,
sm450,
sm451,
sm451,
sm452,
sm453,
sm454,
sm454,
sm455,
sm456,
sm457,
sm458,
sm459,
sm460,
sm461,
sm462,
sm463,
sm464],

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
v=>lsm$1(v,gt121),
nf$1,
nf$1,
v=>lsm$1(v,gt122),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt123),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt124),
v=>lsm$1(v,gt125),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt126),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt127),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt128),
nf$1,
v=>lsm$1(v,gt129),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt130),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt131),
v=>lsm$1(v,gt132),
v=>lsm$1(v,gt133),
v=>lsm$1(v,gt134),
nf$1,
v=>lsm$1(v,gt135),
v=>lsm$1(v,gt136),
nf$1,
v=>lsm$1(v,gt137),
v=>lsm$1(v,gt138),
nf$1,
nf$1,
v=>lsm$1(v,gt76$1),
v=>lsm$1(v,gt77$1),
nf$1,
v=>lsm$1(v,gt90$1),
v=>lsm$1(v,gt91$1),
nf$1,
nf$1,
v=>lsm$1(v,gt139),
nf$1,
v=>lsm$1(v,gt140),
v=>lsm$1(v,gt141),
v=>lsm$1(v,gt142),
nf$1,
v=>lsm$1(v,gt143),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt144),
v=>lsm$1(v,gt145),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt146),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt147),
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
v=>lsm$1(v,gt148),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt149),
v=>lsm$1(v,gt150),
nf$1,
v=>lsm$1(v,gt151),
nf$1,
v=>lsm$1(v,gt152),
nf$1,
v=>lsm$1(v,gt153),
nf$1,
v=>lsm$1(v,gt154),
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt155),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt156),
v=>lsm$1(v,gt157),
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
v=>lsm$1(v,gt158),
nf$1,
v=>lsm$1(v,gt159),
nf$1,
v=>lsm$1(v,gt160),
nf$1,
v=>lsm$1(v,gt161),
v=>lsm$1(v,gt162),
nf$1,
v=>lsm$1(v,gt163),
nf$1,
v=>lsm$1(v,gt164),
v=>lsm$1(v,gt165),
nf$1,
v=>lsm$1(v,gt166),
nf$1,
nf$1,
v=>lsm$1(v,gt167),
v=>lsm$1(v,gt168),
nf$1,
v=>lsm$1(v,gt169),
nf$1,
v=>lsm$1(v,gt170),
v=>lsm$1(v,gt171),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt172),
v=>lsm$1(v,gt173),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt174),
v=>lsm$1(v,gt175),
nf$1,
v=>lsm$1(v,gt176),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt177),
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt178),
v=>lsm$1(v,gt179),
nf$1,
nf$1,
v=>lsm$1(v,gt180),
nf$1,
nf$1,
v=>lsm$1(v,gt181),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt182),
v=>lsm$1(v,gt183),
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
nf$1,
v=>lsm$1(v,gt184),
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
    e$4 = (tk,r,o,l,p)=>{if(l.END)l.throw("Unexpected end of input");else if(l.ty & (264)) l.throw(`Unexpected space character within input "${1}" `) ; else l.throw(`Unexpected token ${l.tx} within input "${111}" `);}, 
    eh$2 = [e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4,
e$4],

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
class CSSRule {
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

        let c = CSS_Color._fs_(l);

        if (c) {

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
                    c = new CSS_Color();
                    c.set(out);
                    return c;
                }  // intentional
            default:

                let string = l.tx;

                if (l.ty == l.types.str){
                    string = string.slice(1, -1);
                }

                out = CSS_Color.colors[string.toLowerCase()];

                if(out)
                    l.next();
        }

        return out;
    }

    constructor(r, g, b, a) {
        super(r, g, b, a);

        if (typeof(r) == "string")
            this.set(CSS_Color._fs_(r) || {r:255,g:255,b:255,a:0});

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
                return new CSS_Percentage(parseFloat(tx) * mult);
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
            let val = CSS_Percentage.parse(lex);
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
        return new CSS_Percentage(this + (to - this) * t);
    }

    copy(other){
        return new CSS_Percentage(other);
    }

    get type(){
        return "%";
    }
}

CSS_Percentage.label_name = "Percentage";

class CSS_Length extends Number {

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
                return new CSS_Length(parseFloat(tx) * sign, id);
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

class CSS_URL extends URL {
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
            return new CSS_String(tx);
        }
        return null;
    }

    constructor(string){
        if(string[0] == "\"" || string[0] == "\'" || string[0] == "\'")
            string = string.slice(1,-1);
        super(string);
    }
}

class CSS_Id extends String {
    static parse(l) {
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
            return new CSS_Shape(v);
        }
        return null;
    }
}

class CSS_Number extends Number {

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
            return new CSS_Number(sign*(new Number(tx)));
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

	toString(){
		 return `cubic-bezier(${this[2]},${this[3]},${this[4]},${this[5]})`;
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
                    let v = CSS_Color.parse(l, rule, r);
                    let len = null;

                    if(l.ch == ")") {
                        stops.push(new Stop(v, len));
                        break;
                    }
                    
                    if(l.ch != ","){
                        if(!(len = CSS_Length.parse(l)))
                            len = CSS_Percentage.parse(l);
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
        parse: function(a) {
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
    let lex = null;
    lex = string;

    if(typeof(string) == "string")
        lex = whind$1(string);
    
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
        if (px !== undefined) {
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

class CSS_FontName extends String {
	static parse(l) {

		if(l.ty == l.types.str){
			let tx = l.tx;
            l.next();
			return new CSS_String(tx);
		}		

		if(l.ty == l.types.id){

			let pk = l.peek();

			while(pk.type == l.types.id && !pk.END){
				pk.next();
			}

			let str = pk.slice(l);
			
			l.sync();
			return new CSS_String(str);
		}

        return null;
    }
}

/**
 * CSS Type constructors
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
	fontname: CSS_FontName,

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
 */
const property_definitions = {

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

const virtual_property_definitions = {
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
            let lex = whind$1(string);
            while (!lex.END)
                root.parseProperty(lex, this.r, property_definitions);
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
class AND extends JUX {
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

class OR extends JUX {
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

OR.step = 0;

class ONE_OF extends JUX {
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

ONE_OF.step = 0;

class LiteralTerm{

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

class ValueTerm extends LiteralTerm{

    constructor(value, getPropertyParser, definitions, productions) {
        
        super(value);

        if(value instanceof JUX)
            return value;

        this.value = null;

        const IS_VIRTUAL = { is: false };
        
        if(typeof(value) == "string")
            var u_value = value.replace(/\-/g,"_");

        if (!(this.value = types$1[u_value]))
            this.value = getPropertyParser(u_value, IS_VIRTUAL, definitions, productions);

        if (!this.value)
            return new LiteralTerm(value);

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



class SymbolTerm extends LiteralTerm {
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
    AND,
    OR,
    ONE_OF,
    LiteralTerm,
    ValueTerm,
    SymbolTerm
};

function getPropertyParser(property_name, IS_VIRTUAL = { is: false }, definitions = null, productions = standard_productions) {

    let parser_val = definitions[property_name];

    if (parser_val) {

        if (typeof(parser_val) == "string") {
            parser_val = definitions[property_name] = CreatePropertyParser(parser_val, property_name, definitions, productions);
        }
        parser_val.name = property_name;
        return parser_val;
    }

    if (!definitions.__virtual)
        definitions.__virtual = Object.assign({}, virtual_property_definitions);

    parser_val = definitions.__virtual[property_name];

    if (parser_val) {

        IS_VIRTUAL.is = true;

        if (typeof(parser_val) == "string") {
            parser_val = definitions.__virtual[property_name] = CreatePropertyParser(parser_val, "", definitions, productions);
            parser_val.virtual = true;
            parser_val.name = property_name;
        }

        return parser_val;
    }

    return null;
}


function CreatePropertyParser(notation, name, definitions, productions) {

    const l = whind$1(notation);
    const important = { is: false };

    let n = d$1(l, definitions, productions);
    
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

function d$1(l, definitions, productions, super_term = false, oneof_group = false, or_group = false, and_group = false, important = null) {
    let term, nt, v;
    const { JUX, AND, OR, ONE_OF, LiteralTerm, ValueTerm, SymbolTerm } = productions;

    let GROUP_BREAK = false;

    while (!l.END) {

        switch (l.ch) {
            case "]":
                return term;
                break;
            case "[":

                v = d$1(l.next(), definitions, productions, true);
                l.assert("]");
                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX && term.isRepeating()) term = foldIntoProduction(productions, new JUX, term);
                    term = foldIntoProduction(productions, term, v);
                } else
                    term = v;
                break;

            case "<":

                v = new ValueTerm(l.next().tx, getPropertyParser, definitions, productions);
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
                        nt.terms.push(d$1(l, definitions, productions, super_term, oneof_group, or_group, true, important));
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
                            nt.terms.push(d$1(l, definitions, productions, super_term, oneof_group, true, and_group, important));
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
                            nt.terms.push(d$1(l, definitions, productions, super_term, true, or_group, and_group, important));
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
                term.terms.push(new SymbolTerm(","));
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


function parseDeclaration(sym, env, lex) {
    let rule_name = sym[0];
    let body_data = sym[2];
    let important = sym[3] ? true : false;

    const IS_VIRTUAL = { is: false };
    const parser = getPropertyParser(rule_name.replace(/\-/g, "_"), IS_VIRTUAL, property_definitions);

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

const
    CSS_Length$1 = types$1.length,
    CSS_Percentage$1 = types$1.percentage,
    CSS_Color$1 = types$1.color,
    CSS_Transform2D$1 = types$1.transform2D,
    CSS_Path$1 = types$1.path,
    CSS_Bezier$1 = types$1.cubic_bezier,

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

                this.getValue(obj, prop_name, type, k0_val);

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

            getValue(obj, prop_name, type, k0_val) {

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
                    this.current_val = (new this.type(value));

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
                    spark.queueUpdate(this);
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
                spark.queueUpdate(this);
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
                    spark.queueUpdate(this);
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
                this.SCALE = scale;
                this.time = from;
                spark.queueUpdate(this);
                return this;
            }
            //TODO: use repeat to continually play back numation 
            repeat(count = 0){
                this.REPEAT = Math.max(0,parseInt(count));
                return this;
            }    
        }

        const GlowFunction = function(...args) {

            if (args.length > 1) {

                let group = new AnimGroup();

                for (let i = 0; i < args.length; i++) {
                    let data = args[i];

                    let obj = data.obj;
                    let props = {};

                    Object.keys(data).forEach(k => { if (!(({ obj: true, match: true, delay:true })[k])) props[k] = data[k]; });

                    group.add(new AnimSequence(obj, props));
                }

                return group;

            } else {
                let data = args[0];

                let obj = data.obj;
                let props = {};

                Object.keys(data).forEach(k => { if (!(({ obj: true, match: true, delay:true })[k])) props[k] = data[k]; });

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

const CSS_Transform2D$2 = types$1.transform2D;

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

    function $in(...data) {

        let
            seq = null,
            length = data.length,
            delay = 0;

        if (typeof(data[length - 1]) == "number")
            delay = data[length - 1], length--;

        for (let i = 0; i < length; i++) {
            let anim_data = data[i];

            if (typeof(anim_data) == "object") {

                if (anim_data.match && this.TT[anim_data.match]) {
                    let
                        duration = anim_data.duration,
                        easing = anim_data.easing;
                    seq = this.TT[anim_data.match](anim_data.obj, duration, easing);
                } else
                    seq = Animation.createSequence(anim_data);

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
            }
        }

        this.in_duration = Math.max(this.in_duration, parseInt(delay));

        return this.in;
    }


    function $out(...data) {
        //Every time an animating component is added to the Animation stack delay and duration need to be calculated.
        //The highest in_delay value will determine how much time is afforded before the animations for the in portion are started.
        let
            seq = null,
            length = data.length,
            delay = 0,
            in_delay = 0;

        if (typeof(data[length - 1]) == "number") {
            if (typeof(data[length - 2]) == "number") {
                in_delay = data[length - 2];
                delay = data[length - 1];
                length -= 2;
            } else
                delay = data[length - 1], length--;
        }

        for (let i = 0; i < length; i++) {
            let anim_data = data[i];

            if (typeof(anim_data) == "object") {

                if (anim_data.match) {
                    this.TT[anim_data.match] = TransformTo(anim_data.obj);
                } else {
                    let seq = Animation.createSequence(anim_data);
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
            }
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
                    return spark.queueUpdate(this);
            } else {
                if (this.time < this.duration)
                    return spark.queueUpdate(this);
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
        this.ast = ast;
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

class a$1 extends ElementNode{
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

class d$2 {
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
            d$2.web_component_constructor(this, bound_data_object), {}
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
        let element = null;

        if ((HTMLElement_ instanceof HTMLElement)) {
            //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

            element = HTMLElement_.attachShadow({ mode: 'open' });
        }

        const scope = this.ast.mount(element);

        scope.load(bound_data_object);

        return scope;
    }

    connect(h, b) { return this.mount(h, b) }
}

d$2.web_component_constructor = function(wick_component, bound_data) {
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

Object.assign(BaseComponent.prototype,d$2.prototype);
BaseComponent.prototype.mount = d$2.prototype.nonAsyncMount;

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

class v$1 extends ElementNode{
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

function element_selector (tag,attribs,children, env, lex){ 

	const 
        FULL = !!children;
        attribs = attribs || [],
        children =children || [];

    const presets = env.presets;

    let node = null, cstr = null;
    
    switch (tag) {
        case "filter":
        case "f":
            cstr =  fltr; break;
        case "a":
            cstr =  a$1; break;
            /** void elements **/
        case "template":
            cstr =  v$1; break;
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
            cstr =  pre; break;
        case "code":
        default:
            cstr =  ElementNode; break;
    }

    node = new cstr(env, tag, children, attribs, presets);

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

function create_ordered_list(sym, offset = 0, level = -1, env, lex) {

    for (let i = offset; i < sym.length; i++) {
        const s = sym[i],
            lvl = (s.lvl) ? s.lvl.length : 0,
            li = s.li;
            console.log(s.lvl);

        if (lvl > level) {
            create_ordered_list(sym, i, lvl, env, lex);
        } else if (lvl < level) {
            sym[offset] = element_selector("ul", null, sym.splice(offset, i - offset), env, lex);
            return;
        } else
            sym[i] = li;
    }

    return sym[offset] = element_selector("span", null, sym.splice(offset, sym.length - offset), env, lex);
}

const env$3 = {
    table: {},
    ASI: true,
    functions: {
        //HTML
        element_selector,
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

Component.prototype = d$2.prototype;

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
