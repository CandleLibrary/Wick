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
    symbols = ["((","))",")(","</","||","^=","$=","*=","<=","...","<",">",">=","==","!=","===","!==","**","++","--","<<",">>",">>>","&&","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>"],

    /* Goto lookup maps */
    gt0 = [0,-1,1,-1,6,-1,10,-118,3,11,-20,12,13,16,15,14,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,2,4,-1,5,8,7],
gt1 = [0,-5,130,-286,129,8,7],
gt2 = [0,-294,131],
gt3 = [0,-295,134,-5,133],
gt4 = [0,-148,158,-2,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt5 = [0,-148,16,15,161,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt6 = [0,-246,165],
gt7 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,205,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt8 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,216,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt9 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,217,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt10 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,218,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt11 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,219,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt12 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,220,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt13 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,221,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt14 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,222,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt15 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,223,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt16 = [0,-228,225],
gt17 = [0,-228,230],
gt18 = [0,-192,76,214,-14,77,215,-11,231,232,71,72,96,-6,70,-1,209,-6,208,-20,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt19 = [0,-287,81,235],
gt20 = [0,-275,238,236],
gt21 = [0,-277,248,246],
gt22 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,257,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt23 = [0,-228,262],
gt24 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-17,263,206,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt25 = [0,-178,265],
gt26 = [0,-186,267,268,-75,270,272,273,-19,269,271,81,80],
gt27 = [0,-152,277,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt28 = [0,-283,283,-2,284,81,80],
gt29 = [0,-283,286,-2,284,81,80],
gt30 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,288,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt31 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,290,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt32 = [0,-157,291],
gt33 = [0,-210,294,295,-73,293,271,81,80],
gt34 = [0,-285,298,271,81,80],
gt35 = [0,-190,300,301,-71,303,272,273,-19,302,271,81,80],
gt36 = [0,-297,305,308,309],
gt37 = [0,-297,313,308,309],
gt38 = [0,-297,316,308,309],
gt39 = [0,-297,318,308,309],
gt40 = [0,-303,320,321],
gt41 = [0,-297,325,308,309],
gt42 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,327,-2,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt43 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,328,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt44 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,329,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt45 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,330,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt46 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-7,331,45,46,47,48,49,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt47 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-8,332,46,47,48,49,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt48 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-9,333,47,48,49,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt49 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-10,334,48,49,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt50 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-11,335,49,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt51 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-12,336,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt52 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-12,337,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt53 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-12,338,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt54 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-12,339,50,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt55 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,340,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt56 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,341,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt57 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,342,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt58 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,343,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt59 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,344,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt60 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-13,345,51,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt61 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-14,346,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt62 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-14,347,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt63 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-14,348,52,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt64 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-15,349,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt65 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-15,350,53,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt66 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-16,351,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt67 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-16,352,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt68 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-16,353,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt69 = [0,-192,76,214,-13,98,77,215,-10,207,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-16,354,54,55,63,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt70 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,355,356,359,358,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt71 = [0,-215,368,-17,362,-1,365,370,374,375,366,-39,376,377,-3,367,-1,211,81,371],
gt72 = [0,-287,81,379],
gt73 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,380,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt74 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-1,385,384,381,70,-1,209,-6,208,-3,386,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt75 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,388,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt76 = [0,-287,81,389],
gt77 = [0,-228,390],
gt78 = [0,-275,393],
gt79 = [0,-277,395],
gt80 = [0,-263,399,272,273,-19,398,271,81,80],
gt81 = [0,-287,81,400],
gt82 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,401,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt83 = [0,-192,76,214,-7,41,100,402,-3,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-8,208,-3,403,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt84 = [0,-152,406,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-1,405,32,-3,33,23,-6,76,407,-7,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt85 = [0,-240,410],
gt86 = [0,-240,412],
gt87 = [0,-236,419,374,375,-27,414,415,-2,417,-1,418,-6,376,377,-4,420,271,81,371],
gt88 = [0,-243,422,-19,429,272,273,-2,424,426,-1,427,428,423,-11,420,271,81,80],
gt89 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,430,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt90 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,432,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt91 = [0,-161,433,435,437,-1,442,-22,434,441,-2,76,214,-7,41,100,-4,98,77,215,-7,38,37,438,440,66,68,71,72,96,67,97,-4,70,-1,209,-10,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt92 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,444,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt93 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,448,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt94 = [0,-181,450,451],
gt95 = [0,-210,454,295],
gt96 = [0,-212,456,458,459,460,-20,463,374,375,-40,376,377,-6,81,464],
gt97 = [0,-192,76,214,-13,98,77,215,-10,465,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-20,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt98 = [0,-195,467,470,469,472,-64,429,272,273,-5,473,428,471,-11,420,271,81,80],
gt99 = [0,-240,476],
gt100 = [0,-240,477],
gt101 = [0,-298,480,309],
gt102 = [0,-10,487,489,488,-280,485,483,-1,481,-5,484,486,321],
gt103 = [0,-13,500,504,502,507,503,501,510,508,-2,509,-5,505,-1,535,-4,536,-10,534,-45,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt104 = [0,-146,538,13,16,15,14,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt105 = [0,-304,541],
gt106 = [0,-243,545],
gt107 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-2,550,549,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt108 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,552,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt109 = [0,-240,556],
gt110 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,557,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt111 = [0,-236,560,374,375,-40,376,377,-6,81,464],
gt112 = [0,-236,561,374,375,-40,376,377,-6,81,464],
gt113 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,562,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt114 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,568,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt115 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-6,575,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt116 = [0,-187,577,-75,270,272,273,-19,269,271,81,80],
gt117 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,578,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt118 = [0,-285,582,271,81,80],
gt119 = [0,-240,584],
gt120 = [0,-263,429,272,273,-5,587,428,585,-11,420,271,81,80],
gt121 = [0,-263,592,272,273,-19,591,271,81,80],
gt122 = [0,-240,593],
gt123 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,598,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt124 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,601,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt125 = [0,-166,605,-19,604,268,-75,607,272,273,-19,606,271,81,80],
gt126 = [0,-166,608,-23,300,301,-71,610,272,273,-19,609,271,81,80],
gt127 = [0,-163,611,-1,614,-23,615,-2,76,214,-13,98,77,215,-10,612,66,68,71,72,96,67,97,-4,70,-1,209,-27,210,-11,75,-4,86,87,85,84,-1,74,-1,211,81,80],
gt128 = [0,-182,618],
gt129 = [0,-157,620],
gt130 = [0,-212,621,458,459,460,-20,463,374,375,-40,376,377,-6,81,464],
gt131 = [0,-214,624,460,-20,463,374,375,-40,376,377,-6,81,464],
gt132 = [0,-215,625,-20,463,374,375,-40,376,377,-6,81,464],
gt133 = [0,-195,626,470,469,472,-64,429,272,273,-5,473,428,471,-11,420,271,81,80],
gt134 = [0,-191,631,-71,303,272,273,-19,302,271,81,80],
gt135 = [0,-10,487,489,488,-280,485,483,-1,632,-5,484,486,321],
gt136 = [0,-10,487,489,488,-281,637,-7,636,486,321],
gt137 = [0,-301,638],
gt138 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,639,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt139 = [0,-10,643,489,488,-287,640,-4,641],
gt140 = [0,-295,650],
gt141 = [0,-13,651,504,502,507,503,501,510,508,-2,509,-5,505,-1,535,-4,536,-10,534,-45,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt142 = [0,-14,654,-1,507,653,-1,510,508,-2,509,-5,505,-1,535,-4,536,-10,534,-45,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt143 = [0,-16,655,-2,510,508,-2,509,-5,656,-1,535,-4,536,-10,534,-45,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt144 = [0,-23,666,-5,656,-1,535,-4,536,-10,534,-66,667,665,-2,664,-1,668],
gt145 = [0,-91,671,670,-1,515,-1,532,516,673,672,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt146 = [0,-94,678,-1,532,679,-6,523,524,525,-1,526,-3,527,533],
gt147 = [0,-96,532,680,-6,681,524,525,-1,526,-3,527,533],
gt148 = [0,-96,682,-16,533],
gt149 = [0,-101,521,690,689],
gt150 = [0,-112,693],
gt151 = [0,-95,695,-16,696],
gt152 = [0,-146,700,13,16,15,14,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt153 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,705,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt154 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-1,709,708,707,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt155 = [0,-215,368,-19,711,370,374,375,366,-39,376,377,-3,367,-1,211,81,371],
gt156 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,712,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt157 = [0,-194,713,714,470,469,472,-64,429,272,273,-5,473,428,471,-11,420,271,81,80],
gt158 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-1,719,-2,70,-1,209,-6,208,-3,386,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt159 = [0,-263,721,272,273,-19,720,271,81,80],
gt160 = [0,-236,419,374,375,-27,723,-3,725,-1,418,-6,376,377,-4,420,271,81,371],
gt161 = [0,-263,429,272,273,-5,726,428,-12,420,271,81,80],
gt162 = [0,-243,729,-19,429,272,273,-3,731,-1,427,428,730,-11,420,271,81,80],
gt163 = [0,-152,732,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt164 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,733,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt165 = [0,-152,734,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt166 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,735,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt167 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,738,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt168 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,740,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt169 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,742,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt170 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,744,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt171 = [0,-166,746,-96,748,272,273,-19,747,271,81,80],
gt172 = [0,-166,608,-96,748,272,273,-19,747,271,81,80],
gt173 = [0,-173,749],
gt174 = [0,-152,751,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt175 = [0,-183,752,-79,754,272,273,-19,753,271,81,80],
gt176 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,759,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt177 = [0,-197,762,763,-64,429,272,273,-5,473,428,471,-11,420,271,81,80],
gt178 = [0,-301,765],
gt179 = [0,-301,766],
gt180 = [0,-10,770,489,488,-293,773,772,771,774],
gt181 = [0,-306,773,772,782,774],
gt182 = [0,-295,783],
gt183 = [0,-24,787,788,-59,791,-4,790],
gt184 = [0,-46,795,-1,798,-1,796,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt185 = [0,-32,811,-57,813],
gt186 = [0,-41,814,816,818,821,820,-21,819],
gt187 = [0,-23,666,-5,656,-1,535,-4,536,-10,534,-66,667,665,-2,824,-1,668],
gt188 = [0,-93,825,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt189 = [0,-23,828,-5,656,-1,535,-4,536,-10,534,-68,830,829,-2,831],
gt190 = [0,-91,834,-2,515,-1,532,516,673,672,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt191 = [0,-94,515,-1,532,516,835,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt192 = [0,-96,532,836,-6,681,524,525,-1,526,-3,527,533],
gt193 = [0,-109,838],
gt194 = [0,-111,844],
gt195 = [0,-112,846],
gt196 = [0,-192,76,214,-7,41,100,-4,98,77,215,-10,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,851,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt197 = [0,-198,855,-17,854,-46,429,272,273,-5,473,428,-12,420,271,81,80],
gt198 = [0,-263,429,272,273,-5,587,428,860,-11,420,271,81,80],
gt199 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,865,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt200 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,867,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt201 = [0,-152,870,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt202 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,872,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt203 = [0,-152,875,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt204 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,877,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt205 = [0,-174,879,881,880],
gt206 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,886,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt207 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,888,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt208 = [0,-301,891],
gt209 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,894,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt210 = [0,-306,897,-2,774],
gt211 = [0,-25,902,-59,791,-4,790],
gt212 = [0,-27,904,-18,905,-1,798,-1,796,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt213 = [0,-86,908,907],
gt214 = [0,-88,911,910],
gt215 = [0,-84,913,-5,914],
gt216 = [0,-79,917],
gt217 = [0,-49,919],
gt218 = [0,-54,923,921,-1,925,922],
gt219 = [0,-60,927,-1,807,-4,808],
gt220 = [0,-51,800,928,802,-2,803,-2,801,804,929,807,-4,808,932,-6,934,936,933,935,-1,939,-2,938],
gt221 = [0,-42,943,818,821,820,-21,819],
gt222 = [0,-37,946,944,948,945],
gt223 = [0,-41,950,816,818,821,820,-21,819,-52,951],
gt224 = [0,-114,958,-5,668],
gt225 = [0,-121,962,960,959],
gt226 = [0,-107,965],
gt227 = [0,-93,969,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt228 = [0,-152,977,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt229 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,979,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt230 = [0,-152,982,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt231 = [0,-152,984,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt232 = [0,-152,985,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt233 = [0,-152,986,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt234 = [0,-152,988,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt235 = [0,-152,989,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt236 = [0,-152,990,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt237 = [0,-175,994,992],
gt238 = [0,-174,995,881],
gt239 = [0,-192,76,214,-7,41,100,-4,98,77,215,-7,38,37,997,42,66,68,71,72,96,67,97,-4,70,-1,209,-6,208,-3,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,-1,74,101,259,81,80],
gt240 = [0,-157,999],
gt241 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,1000,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt242 = [0,-27,1007,-18,1008,-1,798,-1,796,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt243 = [0,-46,1009,-1,798,-1,796,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt244 = [0,-86,1012],
gt245 = [0,-88,1014],
gt246 = [0,-19,510,1017,1016,1015,-70,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt247 = [0,-48,798,-1,1018,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt248 = [0,-49,1019],
gt249 = [0,-51,1020,-1,802,-2,803,-3,1021,-1,807,-4,808],
gt250 = [0,-54,1022],
gt251 = [0,-57,1023],
gt252 = [0,-60,1024,-1,807,-4,808],
gt253 = [0,-60,1025,-1,807,-4,808],
gt254 = [0,-65,1030,1028],
gt255 = [0,-69,1034],
gt256 = [0,-70,1039,1040,-1,1041],
gt257 = [0,-82,1046],
gt258 = [0,-63,1053,1051],
gt259 = [0,-30,1056,-2,1058,1057,1059,-45,1062],
gt260 = [0,-19,510,1017,1016,1064,-70,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt261 = [0,-37,1065],
gt262 = [0,-39,1066],
gt263 = [0,-42,1067,818,821,820,-21,819],
gt264 = [0,-42,1068,818,821,820,-21,819],
gt265 = [0,-93,1071,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt266 = [0,-116,1073,-3,831],
gt267 = [0,-119,1074,-1,962,960,1075],
gt268 = [0,-121,1077],
gt269 = [0,-121,962,960,1078],
gt270 = [0,-110,1079],
gt271 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,1085,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt272 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,1086,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt273 = [0,-152,1089,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt274 = [0,-152,1090,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt275 = [0,-152,1091,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt276 = [0,-152,1092,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt277 = [0,-152,1093,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt278 = [0,-175,1094],
gt279 = [0,-175,994],
gt280 = [0,-148,16,15,1098,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt281 = [0,-46,1100,-1,798,-1,796,800,797,802,-2,803,-2,801,804,-1,807,-4,808,-11,799],
gt282 = [0,-26,1101,-14,1102,816,818,821,820,-21,819,-52,1103],
gt283 = [0,-19,510,1106,-72,512,515,-1,532,516,513,-1,514,521,518,517,523,524,525,-1,526,-3,527,533],
gt284 = [0,-54,923,921],
gt285 = [0,-65,1108],
gt286 = [0,-76,1109,-1,1110,-1,939,-2,938],
gt287 = [0,-76,1112,-1,1110,-1,939,-2,938],
gt288 = [0,-78,1114],
gt289 = [0,-63,1120],
gt290 = [0,-33,1058,1122,1059,-45,1062],
gt291 = [0,-121,962,960,1075],
gt292 = [0,-148,16,15,576,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-5,1133,761,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt293 = [0,-152,1134,-2,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-6,76,-8,41,100,-4,98,77,-8,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt294 = [0,-148,16,15,1136,17,18,19,120,26,20,34,24,21,25,-3,106,-2,27,28,29,31,30,107,-4,22,-2,32,-3,33,23,-2,121,125,-2,76,123,-7,41,100,-4,98,77,119,-7,38,37,36,42,66,68,71,72,96,67,97,-4,70,-12,39,-1,40,43,44,45,46,47,48,49,50,51,52,53,54,55,63,78,-11,75,-4,86,87,85,84,102,74,101,79,81,80,-3,159,8,7],
gt295 = [0,-72,1138],
gt296 = [0,-74,1140],
gt297 = [0,-23,666,-5,656,-1,535,-4,536,-10,534,-66,667,665,-2,1143,-1,668],
gt298 = [0,-35,1144,-45,1062],
gt299 = [0,-76,1146,-1,1110,-1,939,-2,938],
gt300 = [0,-76,1148,-1,1110,-1,939,-2,938],

    // State action lookup maps
    sm0=[0,1,2,3,-1,0,-4,0,-4,4,5,-13,6,-3,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm1=[0,44,-3,0,-4,0],
sm2=[0,45,-3,0,-4,0],
sm3=[0,46,-3,0,-4,0],
sm4=[0,47,-3,0,-4,0,-4,48],
sm5=[0,-4,0,-4,0,-5,5],
sm6=[0,49,-3,0,-4,0,-4,49],
sm7=[0,-4,0,-4,0,-5,50],
sm8=[0,-2,51,-1,0,-4,0,-6,52,-3,53,54,55,-1,56,-117,57,-12,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73],
sm9=[0,-4,0,-4,0,-5,74],
sm10=[0,75,-3,0,-4,0],
sm11=[0,76,-3,0,-4,0],
sm12=[0,77,-3,0,-4,0,-13,77],
sm13=[0,78,-3,0,-4,0,-13,78],
sm14=[0,79,2,3,-1,0,-4,0,-4,4,80,-7,79,-5,6,79,-2,7,-24,8,9,-19,79,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,79,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm15=[0,81,81,81,-1,0,-4,0,-4,81,81,-7,81,-5,81,81,-2,81,-24,81,81,-7,81,-11,81,81,81,81,-1,81,-1,81,81,81,81,81,-1,81,81,81,81,81,81,81,81,-2,81,81,-5,81,81,-2,81,-23,81,-1,81,81,81,81,81,81,-4,81,81,81,81,81,81],
sm16=[0,82,82,82,-1,0,-4,0,-4,82,82,-7,82,-5,82,82,-2,82,-24,82,82,-7,82,-11,82,82,82,82,-1,82,-1,82,82,82,82,82,-1,82,82,82,82,82,82,82,82,-2,82,82,-5,82,82,-2,82,-23,82,-1,82,82,82,82,82,82,-4,82,82,82,82,82,82],
sm17=[0,83,83,83,-1,0,-4,0,-4,83,83,-7,83,-5,83,83,-2,83,-24,83,83,-7,83,-11,83,83,83,83,-1,83,-1,83,83,83,83,83,-1,83,83,83,83,83,83,83,83,-2,83,83,-5,83,83,-2,83,-23,83,-1,83,83,83,83,83,83,-4,83,83,83,83,83,83],
sm18=[0,84,84,84,-1,0,-4,0,-4,84,84,-7,84,-5,84,84,-2,84,-24,84,84,-7,84,-11,84,84,84,84,-1,84,84,84,84,84,84,84,-1,84,84,84,84,84,84,84,84,-2,84,84,-5,84,84,-2,84,-23,84,-1,84,84,84,84,84,84,-4,84,84,84,84,84,84],
sm19=[0,85,85,85,-1,0,-4,0,-4,85,85,-7,85,-5,85,85,-2,85,-24,85,85,-7,85,-11,85,85,85,85,-1,85,85,85,85,85,85,85,-1,85,85,85,85,85,85,85,85,-2,85,85,-5,85,85,-2,85,-23,85,-1,85,85,85,85,85,85,-4,85,85,85,85,85,85],
sm20=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,-3,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm21=[0,-4,0,-4,0,-4,86],
sm22=[0,-4,0,-4,0,-4,87,-11,87,87,88,-5,87,-33,87,-7,87],
sm23=[0,-4,0,-4,0,-4,89,-11,89,89,89,-5,89,-33,89,-7,89],
sm24=[0,-4,0,-4,0,-4,90,-11,90,90,90,-5,90,-33,90,-7,90],
sm25=[0,-4,0,-4,0,-4,91,-11,91,91,91,-1,91,-3,91,-33,91,-7,91],
sm26=[0,-4,0,-4,0,-4,92,92,-1,92,92,-7,92,92,92,-1,92,-3,92,-14,92,93,-1,92,-1,92,-3,92,-1,92,-1,92,92,-4,92,94,-1,95,-4,92,-37,96,97,98,99,100,101,102,103,104,105,92,92,92,92,92,92,92,92,92,92,92,92,92,92,92,-4,106,107],
sm27=[0,-4,0,-4,0,-4,108,-11,108,108,108,-1,108,-3,108,-25,109,-7,108,-7,108,-47,110],
sm28=[0,-4,0,-4,0,-4,111,-11,111,111,111,-1,111,-3,111,-25,111,-7,111,-7,111,-47,111,112],
sm29=[0,-4,0,-4,0,-4,113,-11,113,113,113,-1,113,-3,113,-25,113,-2,114,-4,113,-7,113,-47,113,113],
sm30=[0,-4,0,-4,0,-4,115,-11,115,115,115,-1,115,-3,115,-25,115,-2,115,-4,115,-7,115,-47,115,115,116],
sm31=[0,-4,0,-4,0,-4,117,-11,117,117,117,-1,117,-3,117,-25,117,-2,117,-4,117,-7,117,-47,117,117,117,118],
sm32=[0,-4,0,-4,0,-4,119,-11,119,119,119,-1,119,-3,119,-25,119,-2,119,-4,119,-7,119,-47,119,119,119,119,120,121,122,123],
sm33=[0,-4,0,-4,0,-4,124,125,-2,126,-7,124,124,124,-1,124,-3,124,-14,127,-4,128,-5,124,-2,124,-4,124,-7,124,-47,124,124,124,124,124,124,124,124,129,130],
sm34=[0,-4,0,-4,0,-4,131,131,-2,131,-7,131,131,131,-1,131,-3,131,-14,131,-4,131,-5,131,-2,131,-4,131,-7,131,-47,131,131,131,131,131,131,131,131,131,131,132,133,134],
sm35=[0,-4,0,-4,0,-4,135,135,-2,135,-7,135,135,135,-1,135,-3,135,-14,135,-4,135,-3,136,-1,135,-2,135,-4,135,-7,135,-47,135,135,135,135,135,135,135,135,135,135,135,135,135,137],
sm36=[0,-4,0,-4,0,-4,138,138,-1,139,138,-7,138,138,138,-1,138,-3,138,-14,138,-2,140,-1,138,-3,138,-1,138,-1,141,138,-4,138,-7,138,-47,138,138,138,138,138,138,138,138,138,138,138,138,138,138],
sm37=[0,-4,0,-4,0,-4,142,142,-1,142,142,-7,142,142,142,-1,142,-3,142,-14,142,-2,142,-1,142,-3,142,-1,142,-1,142,142,-4,142,-7,142,-47,142,142,142,142,142,142,142,142,142,142,142,142,142,142],
sm38=[0,-4,0,-4,0,-4,143,143,-1,143,143,-7,143,143,143,-1,143,-3,143,-14,143,-2,143,-1,143,-3,143,-1,143,-1,143,143,-4,143,-7,143,-47,143,143,143,143,143,143,143,143,143,143,143,143,143,143],
sm39=[0,-4,0,-4,0,-4,144,144,-1,144,144,-7,144,144,144,-1,144,-3,144,-14,144,-2,144,-1,144,-3,144,-1,144,-1,144,144,-4,144,-7,144,-47,144,144,144,144,144,144,144,144,144,144,144,144,144,144,145],
sm40=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm41=[0,-4,0,-4,0,-4,144,144,-1,144,144,-7,144,144,144,-1,144,-3,144,-14,144,-2,144,-1,144,-3,144,-1,144,-1,144,144,-4,144,-7,144,-47,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144],
sm42=[0,-4,0,-4,0,-4,148,148,-1,148,148,-7,148,148,148,148,148,-3,148,-14,148,148,-1,148,-1,148,-3,148,-1,148,-1,148,148,-4,148,148,-1,148,-4,148,-14,148,-22,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,-4,148,148],
sm43=[0,-4,0,-4,0,-4,148,148,-1,148,148,-7,148,148,148,148,148,-2,149,148,-14,148,148,-1,148,-1,148,-3,148,-1,148,-1,148,148,-1,150,-1,151,148,148,-1,148,-4,148,-14,148,-22,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,148,-4,148,148],
sm44=[0,-4,0,-4,0,-4,152,152,-1,152,152,-7,152,152,152,152,152,-2,149,152,-14,152,152,-1,152,-1,152,-3,152,-1,152,-1,152,152,-1,153,-1,154,152,152,-1,152,-4,152,-14,152,-22,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,152,-4,152,152],
sm45=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,-31,155,-1,147,-12,10,11,-27,28,156,-2,30,-35,38,39,40,41,42,43],
sm46=[0,-4,0,-4,0,-4,157,157,-1,157,157,-7,157,157,157,157,157,-2,157,157,-14,157,157,-1,157,-1,157,-3,157,-1,157,-1,157,157,-1,157,-1,157,157,157,-1,157,-4,157,-14,157,-22,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,-4,157,157],
sm47=[0,-4,0,-4,0,-4,158,158,-1,158,158,-7,158,158,158,158,158,-2,158,158,-14,158,158,-1,158,-1,158,-3,158,-1,158,-1,158,158,-1,158,-1,158,158,158,-1,158,-4,158,-14,158,-22,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,158,-4,158,158],
sm48=[0,-4,0,-4,0,-4,159,159,-1,159,159,-7,159,159,159,159,159,-2,159,159,-14,159,159,-1,159,-1,159,-3,159,-1,159,-1,159,159,-1,159,-1,159,159,159,-1,159,-4,159,-14,159,-22,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,-4,159,159],
sm49=[0,-4,0,-4,0,-4,159,159,-1,159,159,-7,159,159,159,-1,159,-2,159,159,-14,159,159,-1,159,-1,159,-3,159,-1,159,-1,159,159,-1,159,-1,159,159,159,-1,159,-4,159,-14,159,-12,160,-9,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,-4,159,159],
sm50=[0,-4,0,-4,0,-4,161,161,-1,161,161,-9,161,-4,161,-15,161,161,-1,161,-1,161,-3,161,-1,161,-1,161,161,-1,161,-1,161,-1,161,-1,161,-4,162,-27,163,-9,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-4,161,161],
sm51=[0,-4,0,-4,0,-4,164,164,-1,164,164,-7,164,164,164,164,164,-2,164,164,-14,164,164,-1,164,-1,164,-3,164,-1,164,-1,164,164,-1,164,-1,164,164,164,-1,164,-4,164,-14,164,-12,164,164,-8,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,-4,164,164],
sm52=[0,-4,0,-4,0,-4,165,165,-1,165,165,-7,165,165,165,165,165,-2,165,165,-14,165,165,-1,165,-1,165,-3,165,-1,165,-1,165,165,-1,165,-1,165,165,165,-1,165,-4,165,-14,165,-12,165,165,-8,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,-4,165,165],
sm53=[0,-4,0,-4,0,-4,166,166,-1,166,166,-7,166,166,166,166,166,-2,166,166,-14,166,166,-1,166,-1,166,-3,166,-1,166,-1,166,166,-1,166,-1,166,166,166,-1,166,-4,166,-14,166,-12,166,166,-8,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,-4,166,166],
sm54=[0,-2,3,-1,0,-4,0,-4,167,167,-1,167,167,-7,167,167,167,167,167,-2,167,167,-14,167,167,-1,167,-1,167,-3,167,-1,167,-1,167,167,-1,167,-1,167,167,167,-1,167,-4,167,-14,167,-12,167,167,-8,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,-4,167,167,-9,43],
sm55=[0,-4,0,-4,0,-4,168,168,-1,168,168,-7,168,168,168,168,168,-2,168,168,-14,168,168,-1,168,-1,168,-3,168,-1,168,-1,168,168,-1,168,-1,168,168,168,-1,168,-4,168,-14,168,-22,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,-4,168,168],
sm56=[0,-4,0,-4,0,-4,169,169,-1,169,169,-7,169,169,169,169,169,-2,169,169,-14,169,169,-1,169,-1,169,-3,169,-1,169,-1,169,169,-1,169,-1,169,169,169,-1,169,-4,169,-14,169,-22,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,-4,169,169],
sm57=[0,-4,0,-4,0,-4,170,170,-1,170,170,-7,170,170,170,170,170,-2,170,170,-14,170,170,-1,170,-1,170,-3,170,-1,170,-1,170,170,-1,170,-1,170,170,170,-1,170,-4,170,-14,170,-22,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,-4,170,170],
sm58=[0,-1,171,172,-1,173,174,175,176,177,0,-139,178],
sm59=[0,-1,179,180,-1,181,182,183,184,185,0,-140,186],
sm60=[0,-4,0,-4,0,-4,187,187,-1,187,187,-7,187,187,187,187,187,-2,187,187,-14,187,187,-1,187,-1,187,-3,187,-1,187,-1,187,187,-1,187,-1,187,187,187,-1,187,-4,187,-14,187,-22,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,-4,187,187],
sm61=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,188,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-1,189,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm62=[0,-4,0,-4,0,-23,149,-31,190,-1,191],
sm63=[0,-4,0,-4,0,-4,192,192,-1,192,192,-7,192,192,192,192,192,-2,192,192,-14,192,192,-1,192,-1,192,-3,192,-1,192,-1,192,192,-1,192,-1,192,192,192,-1,192,-4,192,-14,192,-22,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,192,-4,192,192],
sm64=[0,-4,0,-4,0,-4,193,193,-1,193,193,-7,193,193,193,193,193,-2,193,193,-14,193,193,-1,193,-1,193,-3,193,-1,193,-1,193,193,-1,193,-1,193,193,193,-1,193,-4,193,-14,193,-22,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,193,-4,193,193],
sm65=[0,-4,0,-4,0,-94,194],
sm66=[0,-4,0,-4,0,-94,160],
sm67=[0,-4,0,-4,0,-66,195],
sm68=[0,-2,3,-1,0,-4,0,-19,196,-37,197,-86,43],
sm69=[0,198,198,198,-1,0,-4,0,-4,198,198,-7,198,-5,198,198,-2,198,-24,198,198,-7,198,-11,198,198,198,198,-1,198,198,198,198,198,198,198,-1,198,198,198,198,198,198,198,198,-2,198,198,-5,198,198,-2,198,-23,198,-1,198,198,198,198,198,198,-4,198,198,198,198,198,198],
sm70=[0,-4,0,-4,0,-23,199],
sm71=[0,200,200,200,-1,0,-4,0,-4,200,200,-7,200,-5,200,200,-2,200,-24,200,200,-7,200,-11,200,200,200,200,-1,200,200,200,200,200,200,200,-1,200,200,200,200,200,200,200,200,-2,200,200,-5,200,200,-2,200,-23,200,-1,200,200,200,200,200,200,-4,200,200,200,200,200,200],
sm72=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,-3,7,-24,8,9,-24,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-6,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm73=[0,-4,0,-4,0,-23,201],
sm74=[0,-4,0,-4,0,-23,202,-56,203],
sm75=[0,-4,0,-4,0,-23,204],
sm76=[0,-2,3,-1,0,-4,0,-4,205,-139,43],
sm77=[0,-2,3,-1,0,-4,0,-4,206,-139,43],
sm78=[0,-1,2,3,-1,0,-4,0,-4,207,-14,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm79=[0,-4,0,-4,0,-23,208],
sm80=[0,-4,0,-4,0,-19,6],
sm81=[0,-4,0,-4,0,-4,209],
sm82=[0,210,210,210,-1,0,-4,0,-4,210,210,-7,210,-5,210,210,-2,210,-24,210,210,-7,210,-11,210,210,210,210,-1,210,-1,210,210,210,210,210,-1,210,210,210,210,210,210,210,210,-2,210,210,-5,210,210,-2,210,-23,210,-1,210,210,210,210,210,210,-4,210,210,210,210,210,210],
sm83=[0,-2,3,-1,0,-4,0,-19,211,-75,212,-48,43],
sm84=[0,213,213,213,-1,0,-4,0,-4,213,213,-7,213,-5,213,213,-2,213,-24,213,213,-7,213,-11,213,213,213,213,-1,213,-1,213,213,213,213,213,-1,213,213,213,213,213,213,213,213,-2,213,213,-5,213,213,-2,213,-23,213,-1,213,213,213,213,213,213,-4,213,213,213,213,213,213],
sm85=[0,-2,3,-1,0,-4,0,-23,214,-120,43],
sm86=[0,-2,215,-1,0,-4,0,-19,215,-37,215,-86,215],
sm87=[0,-2,216,-1,0,-4,0,-19,216,-37,216,-86,216],
sm88=[0,217,217,217,-1,0,-4,0,-4,217,217,-7,217,-5,217,217,-2,217,-24,217,217,-7,217,-11,217,217,217,217,-1,217,217,217,217,217,217,217,-1,217,217,217,217,217,217,217,217,-2,217,217,-5,217,217,-2,217,-23,217,-1,217,217,217,217,217,217,-4,217,217,217,217,217,217],
sm89=[0,218,-3,0,-4,0],
sm90=[0,-4,0,-4,0,-5,219],
sm91=[0,220,-3,0,-4,0,-4,220],
sm92=[0,-2,51,-1,0,-4,0,-6,221,-3,53,54,55,-1,56,-130,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73],
sm93=[0,-2,222,-1,0,-4,0,-7,223,224,-130,225,226],
sm94=[0,-2,222,-1,0,-4,0,-7,227,228,-130,225,226],
sm95=[0,-2,222,-1,0,-4,0,-8,229,-130,225,226],
sm96=[0,-2,222,-1,0,-4,0,-8,230,-130,225,226],
sm97=[0,-4,231,-4,232,-3,233],
sm98=[0,-2,222,-1,0,-4,0,-7,234,234,-130,225,226],
sm99=[0,-2,235,-1,0,-4,0,-7,235,235,-130,235,235],
sm100=[0,-2,234,-1,0,-4,0,-7,234,234,-130,234,234],
sm101=[0,236,236,236,-1,0,-4,0,-4,236,236,-7,236,-5,236,236,-2,236,-24,236,236,-7,236,-11,236,236,236,236,-1,236,-1,236,236,236,236,236,-1,236,236,236,236,236,236,236,236,-2,236,236,-5,236,236,-2,236,-23,236,-1,236,236,236,236,236,236,-4,236,236,236,236,236,236],
sm102=[0,-4,0,-4,0,-4,48],
sm103=[0,-2,51,-1,0,-4,0,-6,221,-3,53,54,55,-1,56,-117,57,-12,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73],
sm104=[0,-4,0,-4,0,-20,237],
sm105=[0,238,238,238,-1,0,-4,0,-4,238,238,-7,238,-5,238,238,-2,238,-24,238,238,-7,238,-11,238,238,238,238,-1,238,238,238,238,238,238,238,-1,238,238,238,238,238,238,238,238,-2,238,238,-5,238,238,-2,238,-23,238,-1,238,238,238,238,238,238,-4,238,238,238,238,238,238],
sm106=[0,-4,0,-4,0,-4,239,239,-1,239,239,-7,239,239,239,-1,239,-3,239,-14,239,-2,239,-1,239,-3,239,-1,239,-1,239,239,-4,239,-7,239,-47,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239],
sm107=[0,-4,0,-4,0,-4,240,240,-1,240,240,-7,240,240,240,-1,240,-3,240,-14,240,-2,240,-1,240,-3,240,-1,240,-1,240,240,-4,240,-7,240,-47,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240],
sm108=[0,-1,241,241,-1,0,-4,0,-19,241,-3,241,-24,241,241,-7,241,-12,241,241,-8,241,-18,241,241,-2,241,-23,241,-1,241,241,241,241,241,241,-4,241,241,241,241,241,241],
sm109=[0,-4,0,-4,0,-4,242,242,-1,242,242,-7,242,242,242,-1,242,-3,242,-14,242,-2,242,-1,242,-3,242,-1,242,-1,242,242,-4,242,-7,242,-47,242,242,242,242,242,242,242,242,242,242,242,242,242,242,242],
sm110=[0,-4,0,-4,0,-4,92,92,-1,92,92,-7,92,92,92,-1,92,-3,92,-14,92,-2,92,-1,92,-3,92,-1,92,-1,92,92,-4,92,-7,92,-47,92,92,92,92,92,92,92,92,92,92,92,92,92,92,92,-4,106,107],
sm111=[0,-4,0,-4,0,-4,243,243,-1,243,243,-7,243,243,243,243,243,-2,243,243,-14,243,243,-1,243,-1,243,-3,243,-1,243,-1,243,243,-1,243,-1,243,243,243,-1,243,-4,243,-14,243,-22,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243,-4,243,243],
sm112=[0,-4,0,-4,0,-4,244,244,-1,244,244,-7,244,244,244,244,244,-2,244,244,-14,244,244,-1,244,-1,244,-3,244,-1,244,-1,244,244,-1,244,-1,244,244,244,-1,244,-4,244,-14,244,-22,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,-4,244,244],
sm113=[0,-4,0,-4,0,-4,161,161,-1,161,161,-7,161,161,161,161,161,-2,161,161,-14,161,161,-1,161,-1,161,-3,161,-1,161,-1,161,161,-1,161,-1,161,161,161,-1,161,-4,161,-14,161,-22,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-4,161,161],
sm114=[0,-1,2,3,-1,0,-4,0,-18,245,146,-3,7,-24,8,9,-7,147,246,-11,10,11,-8,18,-18,28,29,-1,247,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm115=[0,-1,2,3,-1,0,-4,0,-18,248,-1,249,-36,250,-39,251,252,-3,253,-36,38,39,-3,43],
sm116=[0,-4,0,-4,0,-4,254,254,-1,254,254,-7,254,254,254,254,254,-2,254,254,-14,254,254,-1,254,-1,254,-3,254,-1,254,-1,254,254,-1,254,-1,254,254,254,-1,254,-4,254,-14,254,-22,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,-4,254,254],
sm117=[0,-4,0,-4,0,-4,255,255,-1,255,255,-7,255,255,255,255,255,-2,255,255,-14,255,255,-1,255,-1,255,-3,255,-1,255,-1,255,255,-1,255,-1,255,255,255,-1,255,-4,255,-14,255,-22,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,-4,255,255],
sm118=[0,-4,0,-4,0,-4,256,256,-1,256,256,-7,256,256,256,-1,256,-3,256,-14,256,-2,256,-1,256,-3,256,-1,256,-1,256,256,-4,256,-7,256,-47,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256],
sm119=[0,-4,0,-4,0,-4,257,257,-1,257,257,-7,257,257,257,-1,257,-3,257,-14,257,-2,257,-1,257,-3,257,-1,257,-1,257,257,-4,257,-7,257,-47,257,257,257,257,257,257,257,257,257,257,257,257,257,257,257],
sm120=[0,-4,0,-4,0,-4,258,258,-1,258,258,-7,258,258,258,-1,258,-3,258,-14,258,-2,258,-1,258,-3,258,-1,258,-1,258,258,-4,258,-7,258,-47,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258],
sm121=[0,-4,0,-4,0,-4,259,259,-1,259,259,-7,259,259,259,-1,259,-3,259,-14,259,-2,259,-1,259,-3,259,-1,259,-1,259,259,-4,259,-7,259,-47,259,259,259,259,259,259,259,259,259,259,259,259,259,259,259],
sm122=[0,-4,0,-4,0,-4,260,260,-1,260,260,-7,260,260,260,-1,260,-3,260,-14,260,-2,260,-1,260,-3,260,-1,260,-1,260,260,-4,260,-7,260,-47,260,260,260,260,260,260,260,260,260,260,260,260,260,260,260],
sm123=[0,-4,0,-4,0,-4,261,261,-1,261,261,-7,261,261,261,-1,261,-3,261,-14,261,-2,261,-1,261,-3,261,-1,261,-1,261,261,-4,261,-7,261,-47,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261],
sm124=[0,-4,0,-4,0,-4,262,262,-1,262,262,-7,262,262,262,-1,262,-3,262,-14,262,-2,262,-1,262,-3,262,-1,262,-1,262,262,-4,262,-7,262,-47,262,262,262,262,262,262,262,262,262,262,262,262,262,262,262],
sm125=[0,-4,0,-4,0,-4,263,263,-1,263,263,-7,263,263,263,-1,263,-3,263,-14,263,-2,263,-1,263,-3,263,-1,263,-1,263,263,-4,263,-7,263,-47,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263],
sm126=[0,-2,3,-1,0,-4,0,-144,43],
sm127=[0,-4,0,-4,0,-4,264,264,-1,264,264,-7,264,264,264,264,264,-2,264,264,-14,264,264,-1,264,-1,264,-3,264,-1,264,-1,264,264,-1,264,-1,264,264,264,-1,264,-4,264,-14,264,-22,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,-4,264,264],
sm128=[0,-1,2,3,-1,0,-4,0,-18,265,146,-3,7,266,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-1,267,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm129=[0,-4,0,-4,0,-4,268,268,-1,268,268,-7,268,268,268,268,268,-2,268,268,-14,268,268,-1,268,-1,268,-3,268,-1,268,-1,268,268,-1,268,-1,268,268,268,-1,268,-4,268,-14,268,-22,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,-4,268,268],
sm130=[0,-4,0,-4,0,-4,269,269,-1,269,269,-7,269,269,269,269,269,-3,269,-14,269,269,-1,269,-1,269,-3,269,-1,269,-1,269,269,-4,269,269,-1,269,-4,269,-14,269,-22,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,-4,269,269],
sm131=[0,-4,0,-4,0,-101,270],
sm132=[0,-4,0,-4,0,-55,190,-1,191],
sm133=[0,-4,0,-4,0,-4,271,271,-1,271,271,-7,271,271,271,271,271,-2,271,271,-14,271,271,-1,271,-1,271,-3,271,-1,271,-1,271,271,-1,271,-1,271,271,271,-1,271,-4,271,-14,271,-12,271,271,-8,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,-4,271,271],
sm134=[0,-1,171,172,-1,173,174,175,176,177,0,-139,272],
sm135=[0,-4,0,-4,0,-4,273,273,-1,273,273,-7,273,273,273,273,273,-2,273,273,-14,273,273,-1,273,-1,273,-3,273,-1,273,-1,273,273,-1,273,-1,273,273,273,-1,273,-4,273,-14,273,-22,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,-4,273,273],
sm136=[0,-1,274,274,-1,274,274,274,274,274,0,-139,274],
sm137=[0,-1,275,275,-1,275,275,275,275,275,0,-139,275],
sm138=[0,-1,179,180,-1,181,182,183,184,185,0,-140,276],
sm139=[0,-1,277,277,-1,277,277,277,277,277,0,-140,277],
sm140=[0,-1,278,278,-1,278,278,278,278,278,0,-140,278],
sm141=[0,-4,0,-4,0,-4,279,279,-1,279,279,-7,279,279,279,279,279,-2,279,279,-14,279,279,-1,279,-1,279,-3,279,-1,279,-1,279,279,-1,279,-1,279,279,279,-1,279,-4,279,-14,279,-12,279,-9,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279,-4,279,279],
sm142=[0,-4,0,-4,0,-18,280,-5,281],
sm143=[0,-4,0,-4,0,-4,161,161,-1,161,161,-7,161,161,161,-1,161,-2,161,161,-14,161,161,-1,161,-1,161,-3,161,-1,161,-1,161,161,-1,161,-1,161,161,161,-1,161,-4,161,-14,161,-12,163,-9,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-4,161,161],
sm144=[0,-4,0,-4,0,-4,282,282,-1,282,282,-7,282,282,282,282,282,-2,282,282,-14,282,282,-1,282,-1,282,-3,282,-1,282,-1,282,282,-1,282,-1,282,282,282,-1,282,-4,282,-14,282,-22,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,-4,282,282],
sm145=[0,-4,0,-4,0,-4,283,283,-1,283,283,-7,283,283,283,-1,283,-3,283,-14,283,-2,283,-1,283,-3,283,-1,283,-1,283,283,-4,283,-7,283,-47,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283],
sm146=[0,-1,2,3,-1,0,-4,0,-19,284,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm147=[0,285,285,285,-1,0,-4,0,-4,285,285,-7,285,-5,285,285,-2,285,-24,285,285,-7,285,-11,285,285,285,285,-1,285,285,285,285,285,285,285,-1,285,285,285,285,285,285,285,285,-2,285,285,-5,285,285,-2,285,-23,285,-1,285,285,285,285,285,285,-4,285,285,285,285,285,285],
sm148=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,-3,7,-24,8,9,-20,10,-3,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-6,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm149=[0,-4,0,-4,0,-4,286,-13,287],
sm150=[0,-4,0,-4,0,-4,288,-13,288],
sm151=[0,-4,0,-4,0,-4,289,-13,289,-21,290],
sm152=[0,-4,0,-4,0,-40,290],
sm153=[0,-4,0,-4,0,-4,163,-13,163,163,163,-2,163,163,-15,163,-3,163,-13,163,-22,163,-13,163],
sm154=[0,-4,0,-4,0,-18,291,-1,291,-3,291,-15,291,-3,291,-13,291,-22,291],
sm155=[0,-1,2,3,-1,0,-4,0,-20,292,-36,250,-44,293,-36,38,39,-3,43],
sm156=[0,-2,3,-1,0,-4,0,-18,245,196,-37,197,294,-43,295,-41,43],
sm157=[0,-4,0,-4,0,-78,296],
sm158=[0,-1,2,3,-1,0,-4,0,-4,297,-14,146,-3,7,-24,8,9,-20,10,11,12,-3,298,-3,18,-12,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm159=[0,-4,0,-4,0,-23,299],
sm160=[0,300,300,300,-1,0,-4,0,-4,300,300,-7,300,-5,300,300,-2,300,-24,300,300,-7,300,-11,300,300,300,300,-1,300,300,300,300,300,300,300,-1,300,300,300,300,300,300,300,300,-2,300,300,-5,300,300,-2,300,-23,300,-1,300,300,300,300,300,300,-4,300,300,300,300,300,300],
sm161=[0,-4,0,-4,0,-4,301],
sm162=[0,-4,0,-4,0,-4,162],
sm163=[0,302,302,302,-1,0,-4,0,-4,302,302,-7,302,-5,302,302,-2,302,-24,302,302,-7,302,-11,302,302,302,302,-1,302,302,302,302,302,302,302,-1,302,302,302,302,302,302,302,302,-2,302,302,-5,302,302,-2,302,-23,302,-1,302,302,302,302,302,302,-4,302,302,302,302,302,302],
sm164=[0,-4,0,-4,0,-4,303],
sm165=[0,304,304,304,-1,0,-4,0,-4,304,304,-7,304,-5,304,304,-2,304,-24,304,304,-7,304,-11,304,304,304,304,-1,304,304,304,304,304,304,304,-1,304,304,304,304,304,304,304,304,-2,304,304,-5,304,304,-2,304,-23,304,-1,304,304,304,304,304,304,-4,304,304,304,304,304,304],
sm166=[0,-4,0,-4,0,-4,305],
sm167=[0,-4,0,-4,0,-4,306],
sm168=[0,-4,0,-4,0,-90,307,308],
sm169=[0,309,309,309,-1,0,-4,0,-4,309,309,-7,309,-5,309,309,-2,309,-24,309,309,-7,309,-11,309,309,309,309,-1,309,309,309,309,309,309,309,-1,309,309,309,309,309,309,309,309,-2,309,309,-5,309,309,-2,309,-23,309,-1,309,309,309,309,309,309,-4,309,309,309,309,309,309],
sm170=[0,-4,0,-4,0,-19,211,-75,212],
sm171=[0,310,310,310,-1,0,-4,0,-4,310,310,-1,310,310,-4,310,-2,310,310,310,310,310,-2,310,310,-14,310,310,-1,310,-1,310,-3,310,310,310,-1,310,310,-1,310,-1,310,310,310,-1,310,-4,310,-2,310,310,310,310,-1,310,-1,310,310,310,310,310,310,310,310,310,310,310,310,310,310,-2,310,310,-5,310,310,-2,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,-4,310,310,310,310,310,310],
sm172=[0,-4,0,-4,0,-19,311],
sm173=[0,-1,2,3,-1,0,-4,0,-4,312,-15,313,-36,250,-38,314,251,252,-40,38,39,-3,43],
sm174=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,-33,147,-12,10,11,-27,28,29,-2,30,-35,38,39,40,41,42,43],
sm175=[0,-4,0,-4,0,-23,315],
sm176=[0,-2,3,-1,0,-4,0,-19,196,-4,316,-32,197,-44,295,-41,43],
sm177=[0,-4,0,-4,0,-4,317,-13,318],
sm178=[0,-4,0,-4,0,-4,319,-13,319],
sm179=[0,-2,222,-1,0,-4,0,-7,320,321,-130,225,226],
sm180=[0,-4,231,-4,232,-3,233,-1,80,-7,322,-1,323],
sm181=[0,-4,0,-4,0,-8,324],
sm182=[0,-2,325,-1,0,-4,0,-7,325,325,-130,325,325],
sm183=[0,-2,326,-1,0,-4,0,-7,326,326,-31,327,-98,326,326],
sm184=[0,-2,328,-1,0,-4,0],
sm185=[0,-2,329,-1,0,-4,0],
sm186=[0,-2,330,-1,0,-4,0,-7,330,330,-31,330,-98,330,330],
sm187=[0,-2,222,-1,0,-4,0,-7,331,332,-130,225,226],
sm188=[0,333,-3,333,-4,333,-3,333,333,333,-7,334,-1,333],
sm189=[0,-4,0,-4,0,-8,335],
sm190=[0,-2,222,-1,0,-4,0,-8,336,-130,225,226],
sm191=[0,-2,337,-1,0,-4,0,-13,338,-5,339,-5,340,-26,341,342,343,344,-1,345,-8,346],
sm192=[0,-2,222,-1,0,-4,0,-8,347,-130,225,226],
sm193=[0,-1,2,3,-1,0,-4,0,-4,4,80,-7,348,-5,6,-3,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm194=[0,-4,231,-4,232,-3,233,-4,349],
sm195=[0,-4,350,-4,350,-3,350,-1,350,-2,350,-4,350,-1,350],
sm196=[0,-4,351,-4,351,-3,351,-1,351,-2,351,-4,351,-1,351],
sm197=[0,-2,222,-1,0,-4,0,-7,352,353,-130,225,226],
sm198=[0,354,354,354,-1,0,-4,0,-4,354,354,-7,354,-5,354,354,-2,354,-24,354,354,-7,354,-11,354,354,354,354,-1,354,354,354,354,354,354,354,-1,354,354,354,354,354,354,354,354,354,354,354,354,-5,354,354,-2,354,-23,354,-1,354,354,354,354,354,354,-4,354,354,354,354,354,354],
sm199=[0,-4,0,-4,0,-4,355,-11,355,355,355,-5,355,-33,355,-7,355],
sm200=[0,-4,0,-4,0,-4,356,-11,356,356,356,-1,356,-3,356,-33,356,-7,356],
sm201=[0,-4,0,-4,0,-66,357],
sm202=[0,-4,0,-4,0,-4,358,-11,358,358,358,-1,358,-3,358,-25,358,-7,358,-7,358,-47,358,112],
sm203=[0,-4,0,-4,0,-4,359,-11,359,359,359,-1,359,-3,359,-25,359,-2,114,-4,359,-7,359,-47,359,359],
sm204=[0,-4,0,-4,0,-4,360,-11,360,360,360,-1,360,-3,360,-25,360,-2,360,-4,360,-7,360,-47,360,360,116],
sm205=[0,-4,0,-4,0,-4,361,-11,361,361,361,-1,361,-3,361,-25,361,-2,361,-4,361,-7,361,-47,361,361,361,118],
sm206=[0,-4,0,-4,0,-4,362,-11,362,362,362,-1,362,-3,362,-25,362,-2,362,-4,362,-7,362,-47,362,362,362,362,120,121,122,123],
sm207=[0,-4,0,-4,0,-4,363,125,-2,126,-7,363,363,363,-1,363,-3,363,-14,127,-4,128,-5,363,-2,363,-4,363,-7,363,-47,363,363,363,363,363,363,363,363,129,130],
sm208=[0,-4,0,-4,0,-4,364,364,-2,364,-7,364,364,364,-1,364,-3,364,-14,364,-4,364,-5,364,-2,364,-4,364,-7,364,-47,364,364,364,364,364,364,364,364,364,364,132,133,134],
sm209=[0,-4,0,-4,0,-4,365,365,-2,365,-7,365,365,365,-1,365,-3,365,-14,365,-4,365,-5,365,-2,365,-4,365,-7,365,-47,365,365,365,365,365,365,365,365,365,365,132,133,134],
sm210=[0,-4,0,-4,0,-4,366,366,-2,366,-7,366,366,366,-1,366,-3,366,-14,366,-4,366,-5,366,-2,366,-4,366,-7,366,-47,366,366,366,366,366,366,366,366,366,366,132,133,134],
sm211=[0,-4,0,-4,0,-4,367,367,-2,367,-7,367,367,367,-1,367,-3,367,-14,367,-4,367,-3,136,-1,367,-2,367,-4,367,-7,367,-47,367,367,367,367,367,367,367,367,367,367,367,367,367,137],
sm212=[0,-4,0,-4,0,-4,368,368,-2,368,-7,368,368,368,-1,368,-3,368,-14,368,-4,368,-3,136,-1,368,-2,368,-4,368,-7,368,-47,368,368,368,368,368,368,368,368,368,368,368,368,368,137],
sm213=[0,-4,0,-4,0,-4,369,369,-2,369,-7,369,369,369,-1,369,-3,369,-14,369,-4,369,-3,136,-1,369,-2,369,-4,369,-7,369,-47,369,369,369,369,369,369,369,369,369,369,369,369,369,137],
sm214=[0,-4,0,-4,0,-4,370,370,-1,139,370,-7,370,370,370,-1,370,-3,370,-14,370,-2,140,-1,370,-3,370,-1,370,-1,141,370,-4,370,-7,370,-47,370,370,370,370,370,370,370,370,370,370,370,370,370,370],
sm215=[0,-4,0,-4,0,-4,371,371,-1,139,371,-7,371,371,371,-1,371,-3,371,-14,371,-2,140,-1,371,-3,371,-1,371,-1,141,371,-4,371,-7,371,-47,371,371,371,371,371,371,371,371,371,371,371,371,371,371],
sm216=[0,-4,0,-4,0,-4,372,372,-1,372,372,-7,372,372,372,-1,372,-3,372,-14,372,-2,372,-1,372,-3,372,-1,372,-1,372,372,-4,372,-7,372,-47,372,372,372,372,372,372,372,372,372,372,372,372,372,372],
sm217=[0,-4,0,-4,0,-4,373,373,-1,373,373,-7,373,373,373,-1,373,-3,373,-14,373,-2,373,-1,373,-3,373,-1,373,-1,373,373,-4,373,-7,373,-47,373,373,373,373,373,373,373,373,373,373,373,373,373,373],
sm218=[0,-4,0,-4,0,-4,374,374,-1,374,374,-7,374,374,374,-1,374,-3,374,-14,374,-2,374,-1,374,-3,374,-1,374,-1,374,374,-4,374,-7,374,-47,374,374,374,374,374,374,374,374,374,374,374,374,374,374],
sm219=[0,-4,0,-4,0,-4,375,375,-1,375,375,-7,375,375,375,-1,375,-3,375,-14,375,-2,375,-1,375,-3,375,-1,375,-1,375,375,-4,375,-7,375,-47,375,375,375,375,375,375,375,375,375,375,375,375,375,375],
sm220=[0,-4,0,-4,0,-18,376,-39,377],
sm221=[0,-1,2,3,-1,0,-4,0,-18,378,146,-3,7,-24,8,9,-7,147,379,-11,10,11,-8,18,-18,28,29,-1,247,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm222=[0,-4,0,-4,0,-4,380,380,-1,380,380,-7,380,380,380,380,380,-2,380,380,-14,380,380,-1,380,-1,380,-3,380,-1,380,-1,380,380,-1,380,-1,380,380,380,-1,380,-4,380,-14,380,-22,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,380,-4,380,380],
sm223=[0,-4,0,-4,0,-18,381,-39,381],
sm224=[0,-1,382,382,-1,0,-4,0,-18,382,382,-3,382,-24,382,382,-7,382,382,-11,382,382,-8,382,-18,382,382,-1,382,382,-23,382,-1,382,382,382,382,382,382,-4,382,382,382,382,382,382],
sm225=[0,-4,0,-4,0,-18,383,-1,384],
sm226=[0,-4,0,-4,0,-20,385],
sm227=[0,-4,0,-4,0,-4,386,386,-1,386,386,-7,386,386,386,386,386,-2,386,386,-14,386,386,-1,386,-1,386,-3,386,-1,386,-1,386,386,-1,386,-1,386,386,386,-1,386,-4,386,-14,386,-22,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,386,-4,386,386],
sm228=[0,-4,0,-4,0,-18,387,-1,387],
sm229=[0,-4,0,-4,0,-18,388,-1,388],
sm230=[0,-4,0,-4,0,-18,388,-1,388,-19,290],
sm231=[0,-4,0,-4,0,-23,389,-42,390],
sm232=[0,-4,0,-4,0,-18,164,-1,164,-2,391,-16,164,-25,391],
sm233=[0,-1,2,3,-1,0,-4,0,-57,250,-81,38,39,-3,43],
sm234=[0,-4,0,-4,0,-23,392,-42,392],
sm235=[0,-4,0,-4,0,-23,391,-42,391],
sm236=[0,-4,0,-4,0,-4,393,393,-1,393,393,-7,393,393,393,393,393,-2,393,393,-14,393,393,-1,393,-1,393,-3,393,-1,393,-1,393,393,-1,393,-1,393,393,393,-1,393,-4,393,-14,393,-22,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,393,-4,393,393],
sm237=[0,-4,0,-4,0,-58,394],
sm238=[0,-4,0,-4,0,-18,395,-5,396],
sm239=[0,-4,0,-4,0,-24,397],
sm240=[0,-4,0,-4,0,-4,398,398,-1,398,398,-7,398,398,398,398,398,-2,398,398,-14,398,398,-1,398,-1,398,-3,398,-1,398,-1,398,398,-1,398,-1,398,398,398,-1,398,-4,398,-14,398,-22,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,398,-4,398,398],
sm241=[0,-4,0,-4,0,-18,399,-5,400],
sm242=[0,-4,0,-4,0,-18,401,-5,401],
sm243=[0,-4,0,-4,0,-18,402,-5,402],
sm244=[0,-4,0,-4,0,-58,403],
sm245=[0,-4,0,-4,0,-4,404,404,-1,404,404,-7,404,404,404,404,404,-2,404,404,-14,404,404,-1,404,-1,404,-3,404,-1,404,-1,404,404,-1,404,-1,404,404,404,-1,404,-4,404,-14,404,-22,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,-4,404,404],
sm246=[0,-4,0,-4,0,-4,405,405,-1,405,405,-7,405,405,405,405,405,-2,405,405,-14,405,405,-1,405,-1,405,-3,405,-1,405,-1,405,405,-1,405,-1,405,405,405,-1,405,-4,405,-14,405,-22,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,405,-4,405,405],
sm247=[0,-4,0,-4,0,-4,406,406,-1,406,406,-7,406,406,406,406,406,-2,406,406,-14,406,406,-1,406,-1,406,-3,406,-1,406,-1,406,406,-1,406,-1,406,406,406,-1,406,-4,406,-14,406,-22,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,-4,406,406],
sm248=[0,-4,0,-4,0,-4,407,407,-1,407,407,-7,407,407,407,407,407,-2,407,407,-14,407,407,-1,407,-1,407,-3,407,-1,407,-1,407,407,-1,407,-1,407,407,407,-1,407,-4,407,-14,407,-22,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,-4,407,407],
sm249=[0,-1,408,408,-1,408,408,408,408,408,0,-139,408],
sm250=[0,-1,409,409,-1,409,409,409,409,409,0,-140,409],
sm251=[0,-4,0,-4,0,-4,410,410,-1,410,410,-7,410,410,410,410,410,-2,410,410,-14,410,410,-1,410,-1,410,-3,410,-1,410,-1,410,410,-1,410,-1,410,410,410,-1,410,-4,410,-14,410,-12,410,-9,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,-4,410,410],
sm252=[0,-4,0,-4,0,-24,411,-77,412],
sm253=[0,-4,0,-4,0,-24,413],
sm254=[0,-4,0,-4,0,-24,414],
sm255=[0,-4,0,-4,0,-4,415,415,-1,415,415,-7,415,415,415,415,415,-2,415,415,-14,415,415,-1,415,-1,415,-3,415,-1,415,-1,415,415,-1,415,-1,415,415,415,-1,415,-4,415,-14,415,-22,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,415,-4,415,415],
sm256=[0,-4,0,-4,0,-58,416],
sm257=[0,-4,0,-4,0,-4,417,-11,417,417,417,-1,417,-3,417,-33,417,-7,417],
sm258=[0,-4,0,-4,0,-4,418,-11,418,418,418,-1,418,-3,418,-33,418,-7,418],
sm259=[0,419,419,419,-1,0,-4,0,-4,419,419,-7,419,-5,419,419,-2,419,-24,419,419,-7,419,-11,419,419,419,419,-1,419,419,419,419,419,419,419,-1,419,419,419,419,419,419,419,419,-2,419,419,-5,419,419,-2,419,-23,419,-1,419,419,419,419,419,419,-4,419,419,419,419,419,419],
sm260=[0,420,420,420,-1,0,-4,0,-4,420,420,-7,420,-5,420,420,-2,420,-24,420,420,-7,420,-11,420,420,420,420,-1,420,420,420,420,420,420,420,-1,420,420,420,420,420,420,420,420,-2,420,420,-5,420,420,-2,420,-23,420,-1,420,420,420,420,420,420,-4,420,420,420,420,420,420],
sm261=[0,421,421,421,-1,0,-4,0,-4,421,421,-7,421,-5,421,421,-2,421,-24,421,421,-7,421,-11,421,421,421,421,-1,421,421,421,421,421,421,421,-1,421,421,421,421,421,421,421,421,-2,421,421,-5,421,421,-2,421,-23,421,-1,421,421,421,421,421,421,-4,421,421,421,421,421,421],
sm262=[0,-4,0,-4,0,-4,422,-13,422],
sm263=[0,-4,0,-4,0,-18,423,-1,423,-3,423,-15,423,-3,423,-13,423,-22,423],
sm264=[0,-4,0,-4,0,-20,424],
sm265=[0,-4,0,-4,0,-18,425,-1,426],
sm266=[0,-4,0,-4,0,-18,427,-1,427],
sm267=[0,-4,0,-4,0,-18,428,-1,428],
sm268=[0,-4,0,-4,0,-66,429],
sm269=[0,-4,0,-4,0,-18,430,-1,430,-3,430,-15,290,-17,430],
sm270=[0,-4,0,-4,0,-18,431,-1,431,-3,431,-15,431,-3,431,-13,431,-22,431],
sm271=[0,-2,3,-1,0,-4,0,-18,378,196,-37,197,432,-43,295,-41,43],
sm272=[0,-4,0,-4,0,-58,433],
sm273=[0,-4,0,-4,0,-18,434,-39,435],
sm274=[0,-4,0,-4,0,-18,436,-39,436],
sm275=[0,-4,0,-4,0,-18,437,-39,437],
sm276=[0,-4,0,-4,0,-18,438,-1,438,-3,438,-33,438],
sm277=[0,-4,0,-4,0,-18,438,-1,438,-3,438,-15,290,-17,438],
sm278=[0,-4,0,-4,0,-24,439],
sm279=[0,-4,0,-4,0,-23,440],
sm280=[0,-4,0,-4,0,-24,441],
sm281=[0,-4,0,-4,0,-4,442],
sm282=[0,-1,2,3,-1,0,-4,0,-4,443,-14,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm283=[0,-4,0,-4,0,-44,444],
sm284=[0,-1,2,3,-1,0,-4,0,-4,445,-14,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm285=[0,-4,0,-4,0,-81,446],
sm286=[0,-4,0,-4,0,-4,447],
sm287=[0,-4,0,-4,0,-4,92,92,-1,92,92,-9,92,-20,92,93,-1,92,-1,448,-3,92,-1,92,-1,92,92,-5,94,-1,95,-19,449,-22,96,97,98,99,100,101,102,103,104,105,92,92,92,92,92,92,92,92,92,92,92,92,92,92,92,-4,106,107],
sm288=[0,-4,0,-4,0,-44,448,-36,449],
sm289=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,-46,10,11,12,-3,450,-16,27,-5,28,29,-2,30,-35,38,39,40,41,42,43],
sm290=[0,-4,0,-4,0,-24,451],
sm291=[0,452,452,452,-1,0,-4,0,-4,452,452,-7,452,-5,452,452,-2,452,-24,452,452,-7,452,-11,452,452,452,452,-1,452,452,452,452,452,452,452,-1,452,452,452,452,452,452,452,452,-2,452,452,-5,452,452,-2,452,-23,452,-1,452,452,452,452,452,452,-4,452,452,452,452,452,452],
sm292=[0,453,453,453,-1,0,-4,0,-4,453,453,-7,453,-5,453,453,-2,453,-24,453,453,-7,453,-11,453,453,453,453,-1,453,453,453,453,453,453,453,-1,453,453,453,453,453,453,453,453,-2,453,453,-5,453,453,-2,453,-23,453,-1,453,453,453,453,453,453,-4,453,453,453,453,453,453],
sm293=[0,454,454,454,-1,0,-4,0,-4,454,454,-7,454,-5,454,454,-2,454,-24,454,454,-7,454,-11,454,454,454,454,-1,454,454,454,454,454,454,454,-1,454,454,454,454,454,454,454,454,-2,454,454,-5,454,454,-2,454,-23,454,-1,454,454,454,454,454,454,-4,454,454,454,454,454,454],
sm294=[0,-4,0,-4,0,-24,455],
sm295=[0,456,456,456,-1,0,-4,0,-4,456,456,-7,456,-5,456,456,-2,456,-24,456,456,-7,456,-11,456,456,456,456,-1,456,456,456,456,456,456,456,-1,456,456,456,456,456,456,456,456,-2,456,456,-5,456,456,-2,456,-23,456,-1,456,456,456,456,456,456,-4,456,456,456,456,456,456],
sm296=[0,457,457,457,-1,0,-4,0,-4,457,457,-7,457,-5,457,457,-2,457,-24,457,457,-7,457,-11,457,457,457,457,-1,457,457,457,457,457,457,457,-1,457,457,457,457,457,457,457,457,-1,308,457,457,-5,457,457,-2,457,-23,457,-1,457,457,457,457,457,457,-4,457,457,457,457,457,457],
sm297=[0,458,458,458,-1,0,-4,0,-4,458,458,-7,458,-5,458,458,-2,458,-24,458,458,-7,458,-11,458,458,458,458,-1,458,458,458,458,458,458,458,-1,458,458,458,458,458,458,458,458,-2,458,458,-5,458,458,-2,458,-23,458,-1,458,458,458,458,458,458,-4,458,458,458,458,458,458],
sm298=[0,-4,0,-4,0,-23,459],
sm299=[0,460,460,460,-1,0,-4,0,-4,460,460,-1,460,460,-4,460,-2,460,460,460,460,460,-2,460,460,-14,460,460,-1,460,-1,460,-3,460,460,460,-1,460,460,-1,460,-1,460,460,460,-1,460,-4,460,-2,460,460,460,460,-1,460,-1,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-2,460,460,-5,460,460,-2,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-4,460,460,460,460,460,460],
sm300=[0,-1,2,3,-1,0,-4,0,-4,312,-15,461,-36,250,-38,314,251,252,-40,38,39,-3,43],
sm301=[0,-4,0,-4,0,-20,462],
sm302=[0,463,463,463,-1,0,-4,0,-4,463,463,-1,463,463,-4,463,-2,463,463,463,463,463,-2,463,463,-14,463,463,-1,463,-1,463,-3,463,463,463,-1,463,463,-1,463,-1,463,463,463,-1,463,-4,463,-2,463,463,463,463,-1,463,-1,463,463,463,463,463,463,463,463,463,463,463,463,463,463,-2,463,463,-5,463,463,-2,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,463,-4,463,463,463,463,463,463],
sm303=[0,-1,2,3,-1,0,-4,0,-4,312,-15,464,-36,250,-38,314,251,252,-40,38,39,-3,43],
sm304=[0,-1,465,465,-1,0,-4,0,-4,465,-15,465,-36,465,-38,465,465,465,-40,465,465,-3,465],
sm305=[0,-1,466,466,-1,0,-4,0,-4,466,-15,466,-36,466,-38,466,466,466,-40,466,466,-3,466],
sm306=[0,-1,2,3,-1,0,-4,0,-57,250,-39,251,252,-40,38,39,-3,43],
sm307=[0,-4,0,-4,0,-23,389],
sm308=[0,-4,0,-4,0,-23,391],
sm309=[0,-4,0,-4,0,-19,467],
sm310=[0,-2,3,-1,0,-4,0,-19,196,-4,468,-32,197,-44,295,-41,43],
sm311=[0,-4,0,-4,0,-24,469],
sm312=[0,-4,0,-4,0,-19,470],
sm313=[0,-4,0,-4,0,-24,471],
sm314=[0,-4,0,-4,0,-18,472,-5,471],
sm315=[0,-4,0,-4,0,-24,473],
sm316=[0,-4,0,-4,0,-18,474,-5,474],
sm317=[0,-4,0,-4,0,-18,475,-5,475],
sm318=[0,476,476,476,-1,0,-4,0,-4,476,476,-7,476,-5,476,476,-2,476,-24,476,476,-7,476,-11,476,476,476,476,-1,476,-1,476,476,476,476,476,-1,476,476,476,476,476,476,476,476,-2,476,476,-5,476,476,-2,476,-23,476,-1,476,476,476,476,476,476,-4,476,476,476,476,476,476],
sm319=[0,-4,0,-4,0,-4,477,-13,477],
sm320=[0,-4,231,-4,232,-3,233,-1,80,-7,478,-1,323],
sm321=[0,-4,0,-4,0,-8,479],
sm322=[0,-2,480,-1,0,-4,0,-7,480,480,-130,480,480],
sm323=[0,-4,231,-4,232,-3,233,-1,50,-7,481,-1,323],
sm324=[0,-2,51,-1,0,-4,0],
sm325=[0,-4,482,-4,482,-3,482,-1,482,-7,482,-1,482],
sm326=[0,-4,483,-4,483,-3,483,-1,483,-7,483,-1,483],
sm327=[0,-4,231,-4,232,-3,233,-1,484,-7,484,-1,484],
sm328=[0,-4,484,-4,484,-3,484,-1,484,-7,484,-1,484],
sm329=[0,-2,485,-1,485,-4,485,-3,485,-1,485,-1,485,485,-4,485,-1,485,-123,485,485],
sm330=[0,486,-3,486,-4,486,-3,486,486,486,-7,486,-1,486],
sm331=[0,-2,487,-1,0,-4,0,-15,323,-123,488,489],
sm332=[0,-4,0,-4,0,-140,490],
sm333=[0,-4,0,-4,0,-139,491],
sm334=[0,492,-3,492,-4,492,-3,492,492,492,-7,493,-1,492],
sm335=[0,-4,0,-4,0,-8,494],
sm336=[0,-4,0,-4,0,-6,221,-3,53,54,-133,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73],
sm337=[0,-4,0,-4,0,-13,495],
sm338=[0,-4,0,-4,0,-13,496],
sm339=[0,-2,337,-1,0,-4,0,-13,497,-5,339,-5,340,-26,341,342,343,344,-1,345,-8,346],
sm340=[0,-2,498,-1,0,-4,0,-13,498,-5,498,-5,498,-26,498,498,498,498,-1,498,-8,498],
sm341=[0,-2,499,-1,0,-4,0,-4,500,-8,499,-5,499,-5,499,-26,499,499,499,499,-1,499,-8,499],
sm342=[0,-4,0,-4,0,-6,501,-15,502,-3,503,-7,504],
sm343=[0,-2,505,-1,0,-4,0,-13,505,-5,505,-5,505,-26,505,505,505,505,-1,505,-8,505],
sm344=[0,-2,506,-1,0,-4,0,-13,506,-5,506,-5,506,-26,506,506,506,506,-1,506,-8,506],
sm345=[0,-4,0,-4,0,-18,507,508],
sm346=[0,-2,509,-1,0,-4,0,-25,340],
sm347=[0,-4,0,-4,0,-18,510,510],
sm348=[0,-2,337,-1,0,-4,0,-8,511,-9,512,512,-4,512,-23,513,514,515,-1,341,342,343,344,-1,345,-8,346],
sm349=[0,-2,516,-1,0,-4,0,-8,516,-9,516,516,-4,516,-23,516,516,516,-1,516,516,343,344,-1,345,-8,346],
sm350=[0,-2,516,-1,0,-4,0,-8,516,-9,516,516,-4,516,-23,516,516,516,-1,516,516,516,516,-1,516,-8,517],
sm351=[0,-2,518,-1,0,-4,0,-8,518,-9,518,518,-4,518,-23,518,518,518,-1,518,518,518,518,-1,518,-8,518],
sm352=[0,-2,519,-1,0,-4,0,-52,520],
sm353=[0,-2,518,-1,0,-4,0,-8,518,-9,518,518,-4,518,-23,518,518,518,-1,518,521,518,518,-1,518,-8,518],
sm354=[0,-2,522,-1,0,-4,0,-8,522,-9,522,522,-4,522,-15,522,-7,522,522,522,-1,522,521,522,522,-1,522,522,522,522,522,-4,522],
sm355=[0,-4,0,-4,0,-53,523],
sm356=[0,-2,524,-1,0,-4,0,-52,524],
sm357=[0,-2,525,-1,0,-4,0,-8,525,-9,525,525,-4,525,-23,525,525,525,-1,525,525,525,525,-1,525,-8,525],
sm358=[0,-2,526,-1,0,-4,0,-8,526,-9,526,526,-4,526,-23,526,526,526,-1,526,526,526,526,-1,526,-8,526],
sm359=[0,-2,527,-1,0,-4,0],
sm360=[0,-2,528,-1,0,-4,0],
sm361=[0,-2,337,-1,0,-4,0,-52,529,342],
sm362=[0,-2,530,-1,0,-4,0,-66,531],
sm363=[0,-2,532,-1,0,-4,0,-8,532,-9,532,532,-4,532,-23,532,532,532,-1,532,532,532,532,-1,532,-8,532],
sm364=[0,-2,533,-1,0,-4,0,-8,533,-9,533,533,-4,533,-23,533,533,533,-1,533,533,533,533,-1,533,-8,531],
sm365=[0,-4,0,-4,0,-4,534],
sm366=[0,-4,0,-4,0,-4,535],
sm367=[0,-4,0,-4,0,-4,536],
sm368=[0,-1,2,3,-1,0,-4,0,-4,4,80,-7,537,-5,6,-3,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm369=[0,-4,0,-4,0,-13,538],
sm370=[0,-4,0,-4,0,-14,539],
sm371=[0,-4,540,-4,540,-3,540,-1,540,-7,540,-1,540],
sm372=[0,-4,541,-4,541,-3,541,-1,541,-2,541,-4,541,-1,541],
sm373=[0,-4,0,-4,0,-8,542],
sm374=[0,-4,0,-4,0,-5,543],
sm375=[0,-4,0,-4,0,-18,378,-39,544],
sm376=[0,-4,0,-4,0,-4,545,545,-1,545,545,-7,545,545,545,545,545,-2,545,545,-14,545,545,-1,545,-1,545,-3,545,-1,545,-1,545,545,-1,545,-1,545,545,545,-1,545,-4,545,-14,545,-22,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,545,-4,545,545],
sm377=[0,-1,2,3,-1,0,-4,0,-18,245,146,-3,7,-24,8,9,-7,147,382,-11,10,11,-8,18,-18,28,29,-1,247,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm378=[0,-4,0,-4,0,-4,546,546,-1,546,546,-7,546,546,546,546,546,-2,546,546,-14,546,546,-1,546,-1,546,-3,546,-1,546,-1,546,546,-1,546,-1,546,546,546,-1,546,-4,546,-14,546,-22,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,546,-4,546,546],
sm379=[0,-4,0,-4,0,-18,547,-39,547],
sm380=[0,-1,548,548,-1,0,-4,0,-18,548,548,-3,548,-24,548,548,-7,548,548,-11,548,548,-8,548,-18,548,548,-1,548,548,-23,548,-1,548,548,548,548,548,548,-4,548,548,548,548,548,548],
sm381=[0,-4,0,-4,0,-18,549,-39,549],
sm382=[0,-1,2,3,-1,0,-4,0,-20,550,-36,250,-39,251,252,-3,253,-36,38,39,-3,43],
sm383=[0,-4,0,-4,0,-4,551,551,-1,551,551,-7,551,551,551,551,551,-2,551,551,-14,551,551,-1,551,-1,551,-3,551,-1,551,-1,551,551,-1,551,-1,551,551,551,-1,551,-4,551,-14,551,-22,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,551,-4,551,551],
sm384=[0,-4,0,-4,0,-4,552,552,-1,552,552,-7,552,552,552,552,552,-2,552,552,-14,552,552,-1,552,-1,552,-3,552,-1,552,-1,552,552,-1,552,-1,552,552,552,-1,552,-4,552,-14,552,-22,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,552,-4,552,552],
sm385=[0,-4,0,-4,0,-18,553,-1,553],
sm386=[0,-4,0,-4,0,-18,554,-1,554],
sm387=[0,-2,3,-1,0,-4,0,-19,196,-37,197,-44,295,-41,43],
sm388=[0,-4,0,-4,0,-23,555],
sm389=[0,-4,0,-4,0,-23,556],
sm390=[0,-4,0,-4,0,-58,557],
sm391=[0,-4,0,-4,0,-4,558,558,-1,558,558,-7,558,558,558,558,558,-2,558,558,-14,558,558,-1,558,-1,558,-3,558,-1,558,-1,558,558,-1,558,-1,558,558,558,-1,558,-4,558,-14,558,-22,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-4,558,558],
sm392=[0,-4,0,-4,0,-24,559],
sm393=[0,-4,0,-4,0,-4,560,560,-1,560,560,-7,560,560,560,560,560,-2,560,560,-14,560,560,-1,560,-1,560,-3,560,-1,560,-1,560,560,-1,560,-1,560,560,560,-1,560,-4,560,-14,560,-22,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,-4,560,560],
sm394=[0,-4,0,-4,0,-4,561,561,-1,561,561,-7,561,561,561,561,561,-2,561,561,-14,561,561,-1,561,-1,561,-3,561,-1,561,-1,561,561,-1,561,-1,561,561,561,-1,561,-4,561,-14,561,-22,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,-4,561,561],
sm395=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-1,267,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm396=[0,-4,0,-4,0,-18,562,-5,562],
sm397=[0,-4,0,-4,0,-4,563,563,-1,563,563,-7,563,563,563,563,563,-2,563,563,-14,563,563,-1,563,-1,563,-3,563,-1,563,-1,563,563,-1,563,-1,563,563,563,-1,563,-4,563,-14,563,-22,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,563,-4,563,563],
sm398=[0,-4,0,-4,0,-4,564,564,-1,564,564,-7,564,564,564,564,564,-2,564,564,-14,564,564,-1,564,-1,564,-3,564,-1,564,-1,564,564,-1,564,-1,564,564,564,-1,564,-4,564,-14,564,-12,564,-9,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,564,-4,564,564],
sm399=[0,-4,0,-4,0,-4,565,565,-1,565,565,-7,565,565,565,565,565,-2,565,565,-14,565,565,-1,565,-1,565,-3,565,-1,565,-1,565,565,-1,565,-1,565,565,565,-1,565,-4,565,-14,565,-12,565,-9,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,565,-4,565,565],
sm400=[0,-4,0,-4,0,-4,566,566,-1,566,566,-7,566,566,566,566,566,-2,566,566,-14,566,566,-1,566,-1,566,-3,566,-1,566,-1,566,566,-1,566,-1,566,566,566,-1,566,-4,566,-14,566,-22,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,566,-4,566,566],
sm401=[0,-4,0,-4,0,-20,567],
sm402=[0,-4,0,-4,0,-20,568],
sm403=[0,-4,0,-4,0,-4,569,-13,569],
sm404=[0,-4,0,-4,0,-4,570,-13,570,-1,570,-3,570,-33,570],
sm405=[0,-4,0,-4,0,-18,571,-1,571,-3,571,-15,571,-3,571,-13,571,-22,571],
sm406=[0,-1,2,3,-1,0,-4,0,-20,572,-36,250,-44,293,-36,38,39,-3,43],
sm407=[0,-4,0,-4,0,-20,573],
sm408=[0,-4,0,-4,0,-18,574,-1,574,-3,574,-33,574],
sm409=[0,-4,0,-4,0,-58,575],
sm410=[0,-4,0,-4,0,-18,576,-1,576,-3,576,-15,576,-3,576,-13,576,-22,576],
sm411=[0,-4,0,-4,0,-18,577,-39,577],
sm412=[0,-2,3,-1,0,-4,0,-18,245,196,-37,197,578,-43,295,-41,43],
sm413=[0,-4,0,-4,0,-24,579,-33,579],
sm414=[0,-4,0,-4,0,-18,580,-1,580,-3,580,-33,580],
sm415=[0,-1,2,3,-1,0,-4,0,-4,581,-14,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm416=[0,-4,0,-4,0,-4,582],
sm417=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,583,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm418=[0,-4,0,-4,0,-4,584],
sm419=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,585,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm420=[0,-4,0,-4,0,-4,586,-13,287],
sm421=[0,-4,0,-4,0,-44,587,-36,588],
sm422=[0,-4,0,-4,0,-4,289,-13,289,-21,290,-3,589,-36,589],
sm423=[0,-4,0,-4,0,-40,290,-3,589,-36,589],
sm424=[0,-4,0,-4,0,-44,590,-36,590],
sm425=[0,-4,0,-4,0,-81,591],
sm426=[0,-4,0,-4,0,-81,449],
sm427=[0,-4,0,-4,0,-19,592],
sm428=[0,593,593,593,-1,0,-4,0,-4,593,593,-7,593,-5,593,593,-2,593,-24,593,593,-7,593,-11,593,593,593,593,-1,593,593,593,593,593,593,593,-1,593,593,593,593,593,593,593,593,-2,593,593,-5,593,593,-2,593,-23,593,-1,593,593,593,593,593,593,-4,593,593,593,593,593,593],
sm429=[0,594,594,594,-1,0,-4,0,-4,594,594,-7,594,-5,594,594,-2,594,-24,594,594,-7,594,-11,594,594,594,594,-1,594,594,594,594,594,594,594,-1,594,594,594,594,594,594,594,594,-2,594,594,-5,594,594,-2,594,-23,594,-1,594,594,594,594,594,594,-4,594,594,594,594,594,594],
sm430=[0,-4,0,-4,0,-20,595],
sm431=[0,596,596,596,-1,0,-4,0,-4,596,596,-1,596,596,-4,596,-2,596,596,596,596,596,-2,596,596,-14,596,596,-1,596,-1,596,-3,596,596,596,-1,596,596,-1,596,-1,596,596,596,-1,596,-4,596,-2,596,596,596,596,-1,596,-1,596,596,596,596,596,596,596,596,596,596,596,596,596,596,-2,596,596,-5,596,596,-2,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,-4,596,596,596,596,596,596],
sm432=[0,597,597,597,-1,0,-4,0,-4,597,597,-1,597,597,-4,597,-2,597,597,597,597,597,-2,597,597,-14,597,597,-1,597,-1,597,-3,597,597,597,-1,597,597,-1,597,-1,597,597,597,-1,597,-4,597,-2,597,597,597,597,-1,597,-1,597,597,597,597,597,597,597,597,597,597,597,597,597,597,-2,597,597,-5,597,597,-2,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,-4,597,597,597,597,597,597],
sm433=[0,-1,598,598,-1,0,-4,0,-4,598,-15,598,-36,598,-38,598,598,598,-40,598,598,-3,598],
sm434=[0,-1,599,599,-1,0,-4,0,-4,599,-15,599,-36,599,-38,599,599,599,-40,599,599,-3,599],
sm435=[0,-4,0,-4,0,-24,600],
sm436=[0,-4,0,-4,0,-19,601],
sm437=[0,-4,0,-4,0,-19,602],
sm438=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,603,-2,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm439=[0,-2,3,-1,0,-4,0,-19,196,-4,604,-32,197,-44,295,-41,43],
sm440=[0,-4,0,-4,0,-4,605,-13,605],
sm441=[0,-4,231,-4,232,-3,233,-1,50,-7,606,-1,323],
sm442=[0,607,-3,607,-4,607,-3,607,607,607,-7,607,-1,607],
sm443=[0,-4,608,-4,608,-3,608,-1,608,-7,608,-1,608],
sm444=[0,-4,0,-4,0,-8,609],
sm445=[0,-4,0,-4,0,-16,610,611],
sm446=[0,-2,612,-1,0,-4,0,-7,612,612,-130,612,612],
sm447=[0,-2,613,-1,0,-4,0,-7,613,613,-130,613,613],
sm448=[0,-2,614,-1,615,616,617,618,619,0,-3,620,-11,323],
sm449=[0,-2,614,-1,615,616,617,618,619,0,-3,620],
sm450=[0,-2,621,-1,0,-4,0,-7,621,621,-31,621,-98,621,621],
sm451=[0,-4,0,-4,0,-8,622],
sm452=[0,-4,0,-4,0,-13,623],
sm453=[0,-4,0,-4,0,-12,624],
sm454=[0,-2,337,-1,0,-4,0,-13,625,-5,339,-5,340,-26,341,342,343,344,-1,345,-8,346],
sm455=[0,-2,626,-1,0,-4,0,-13,626,-5,626,-5,626,-26,626,626,626,626,-1,626,-8,626],
sm456=[0,-2,627,-1,0,-4,0,-13,627,-5,627,-5,627,-26,627,627,627,627,-1,627,-8,627],
sm457=[0,-4,0,-4,0,-4,500],
sm458=[0,-2,628,-1,0,-4,0,-4,628,-8,628,-5,628,628,-4,628,-26,628,628,628,628,-1,628,-8,628],
sm459=[0,-4,629,-4,0,-46,630,-92,631,632],
sm460=[0,-2,633,-1,0,-4,0,-23,634,-8,635,-2,636],
sm461=[0,-4,0,-4,0,-27,637,-111,631,632],
sm462=[0,-2,638,-1,0,-4,639,-23,640,-8,641],
sm463=[0,-2,337,-1,0,-4,0,-52,341,342,343,344,-1,345,-8,346],
sm464=[0,-2,509,-1,0,-4,0,-4,642,-15,643,-4,340],
sm465=[0,-2,644,-1,0,-4,0,-4,645,-15,644,-4,644],
sm466=[0,-2,646,-1,0,-4,0,-4,646,-15,646,-4,646],
sm467=[0,-2,647,-1,0,-4,0,-4,647,-15,647,-4,647],
sm468=[0,-2,648,-1,0,-4,0,-4,648,-15,648,-4,648],
sm469=[0,-4,0,-4,0,-66,649],
sm470=[0,-2,337,-1,0,-4,0,-8,511,-9,650,650,-4,650,-23,513,514,515,-1,341,342,343,344,-1,345,-8,346],
sm471=[0,-2,651,-1,0,-4,0,-8,651,-9,651,651,-4,651,-23,651,651,651,-1,651,651,651,651,-1,651,-8,651],
sm472=[0,-2,652,-1,0,-4,0,-8,652,-9,652,652,-4,652,-23,652,652,652,-1,652,652,652,652,-1,652,-8,652],
sm473=[0,-2,653,-1,0,-4,0,-52,653,653,653,653,-1,653,-8,653],
sm474=[0,-2,654,-1,0,-4,0,-8,654,-9,654,654,-4,654,-23,654,654,654,-1,654,654,343,344,-1,345,-8,346],
sm475=[0,-2,654,-1,0,-4,0,-8,654,-9,654,654,-4,654,-23,654,654,654,-1,654,654,654,654,-1,654,-8,517],
sm476=[0,-2,655,-1,0,-4,0,-8,655,-9,655,655,-4,655,-23,655,655,655,-1,655,655,655,655,-1,655,-8,655],
sm477=[0,-2,656,-1,0,-4,0,-8,656,-9,656,656,-4,656,-23,656,656,656,-1,656,656,656,656,-1,656,-8,656],
sm478=[0,-4,0,-4,0,-66,531],
sm479=[0,-2,657,-1,0,-4,0,-8,657,-9,657,657,-4,657,-23,657,657,657,-1,657,657,657,657,-1,657,-8,657],
sm480=[0,-2,658,-1,0,-4,0,-8,658,-9,658,658,-4,658,-15,658,-7,658,658,658,-1,658,658,658,658,-1,658,658,658,658,658,-4,658],
sm481=[0,-2,659,-1,0,-4,0,-52,659],
sm482=[0,-2,660,-1,0,-4,0,-8,660,-9,660,660,-4,660,-23,660,660,660,-1,660,660,660,660,-1,660,-8,660],
sm483=[0,-2,661,-1,0,-4,0,-8,661,-9,661,661,-4,661,-23,661,661,661,-1,661,661,661,661,-1,661,-8,661],
sm484=[0,-4,0,-4,0,-40,662,-8,663,-8,664,665,666,667],
sm485=[0,-2,519,-1,0,-4,0],
sm486=[0,-4,0,-4,0,-53,521],
sm487=[0,-2,668,-1,0,-4,0,-8,668,-9,668,668,-3,669,668,-23,668,668,668,-1,668,668,668,668,-1,668,-8,668],
sm488=[0,-2,670,-1,0,-4,0,-8,670,-9,670,670,-4,670,-23,670,670,670,-1,670,670,670,670,-1,670,-8,670],
sm489=[0,-2,530,-1,0,-4,0],
sm490=[0,-2,671,-1,0,-4,0,-8,671,-9,671,671,-4,671,-23,671,671,671,-1,671,671,671,671,-1,671,-8,531],
sm491=[0,-2,672,-1,0,-4,0,-8,672,-9,672,672,-4,672,-23,672,672,672,-1,672,672,672,672,-1,672,-8,672],
sm492=[0,-4,0,-4,0,-13,673],
sm493=[0,-4,0,-4,0,-14,674],
sm494=[0,-4,0,-4,0,-14,675],
sm495=[0,-4,0,-4,0,-8,676],
sm496=[0,-4,0,-4,0,-5,677],
sm497=[0,-4,0,-4,0,-4,678,-11,678,678,678,-1,678,-3,678,-33,678,-7,678],
sm498=[0,-4,0,-4,0,-4,679,679,-1,679,679,-7,679,679,679,679,679,-2,679,679,-14,679,679,-1,679,-1,679,-3,679,-1,679,-1,679,679,-1,679,-1,679,679,679,-1,679,-4,679,-14,679,-22,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,679,-4,679,679],
sm499=[0,-4,0,-4,0,-18,680,-39,680],
sm500=[0,-1,2,3,-1,0,-4,0,-18,378,146,-3,7,-24,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm501=[0,-4,0,-4,0,-4,681,681,-1,681,681,-7,681,681,681,681,681,-2,681,681,-14,681,681,-1,681,-1,681,-3,681,-1,681,-1,681,681,-1,681,-1,681,681,681,-1,681,-4,681,-14,681,-22,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,-4,681,681],
sm502=[0,-4,0,-4,0,-18,682,-1,682],
sm503=[0,-4,0,-4,0,-18,683,-1,683],
sm504=[0,-4,0,-4,0,-24,684],
sm505=[0,-4,0,-4,0,-24,685],
sm506=[0,-4,0,-4,0,-24,686],
sm507=[0,-4,0,-4,0,-23,687,-42,687],
sm508=[0,-4,0,-4,0,-4,688,688,-1,688,688,-7,688,688,688,688,688,-2,688,688,-14,688,688,-1,688,-1,688,-3,688,-1,688,-1,688,688,-1,688,-1,688,688,688,-1,688,-4,688,-14,688,-22,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,688,-4,688,688],
sm509=[0,-4,0,-4,0,-18,689,-5,689],
sm510=[0,-4,0,-4,0,-24,690],
sm511=[0,-4,0,-4,0,-24,691],
sm512=[0,-4,0,-4,0,-4,692,-11,692,692,692,-1,692,-3,692,-33,692,-7,692],
sm513=[0,-4,0,-4,0,-20,693],
sm514=[0,-4,0,-4,0,-18,694,-1,694,-3,694,-15,694,-3,694,-13,694,-22,694],
sm515=[0,-4,0,-4,0,-18,695,-1,695],
sm516=[0,-4,0,-4,0,-18,696,-1,696],
sm517=[0,-4,0,-4,0,-18,697,-1,697,-3,697,-15,697,-3,697,-13,697,-22,697],
sm518=[0,-2,3,-1,0,-4,0,-18,378,196,-37,197,698,-43,295,-41,43],
sm519=[0,-4,0,-4,0,-58,699],
sm520=[0,-4,0,-4,0,-18,700,-39,700],
sm521=[0,701,701,701,-1,0,-4,0,-4,701,701,-7,701,-5,701,701,-2,701,-24,701,701,-7,701,-11,701,701,701,701,-1,701,702,701,701,701,701,701,-1,701,701,701,701,701,701,701,701,-2,701,701,-5,701,701,-2,701,-23,701,-1,701,701,701,701,701,701,-4,701,701,701,701,701,701],
sm522=[0,-4,0,-4,0,-24,703],
sm523=[0,704,704,704,-1,0,-4,0,-4,704,704,-7,704,-5,704,704,-2,704,-24,704,704,-7,704,-11,704,704,704,704,-1,704,704,704,704,704,704,704,-1,704,704,704,704,704,704,704,704,-2,704,704,-5,704,704,-2,704,-23,704,-1,704,704,704,704,704,704,-4,704,704,704,704,704,704],
sm524=[0,-4,0,-4,0,-4,705],
sm525=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,706,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm526=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,707,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm527=[0,-4,0,-4,0,-24,708],
sm528=[0,-4,0,-4,0,-24,709],
sm529=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,710,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm530=[0,-4,0,-4,0,-24,711],
sm531=[0,-4,0,-4,0,-24,712],
sm532=[0,-4,0,-4,0,-81,588],
sm533=[0,-4,0,-4,0,-81,589],
sm534=[0,713,713,713,-1,0,-4,0,-4,713,713,-7,713,-5,713,713,-2,713,-24,713,713,-7,713,-11,713,713,713,713,-1,713,713,713,713,713,713,713,-1,713,713,713,713,713,713,713,713,-2,713,713,-5,713,713,-2,713,-23,713,-1,713,713,713,713,713,713,-4,713,713,713,713,713,713],
sm535=[0,-4,0,-4,0,-20,714,-48,715,-18,716],
sm536=[0,717,717,717,-1,0,-4,0,-4,717,717,-7,717,-5,717,717,-2,717,-24,717,717,-7,717,-11,717,717,717,717,-1,717,717,717,717,717,717,717,-1,717,717,717,717,717,717,717,717,-2,717,717,-5,717,717,-2,717,-23,717,-1,717,717,717,717,717,717,-4,717,717,717,717,717,717],
sm537=[0,-4,0,-4,0,-24,718],
sm538=[0,-4,0,-4,0,-24,719],
sm539=[0,720,720,720,-1,0,-4,0,-4,720,720,-1,720,720,-4,720,-2,720,720,720,720,720,-2,720,720,-14,720,720,-1,720,-1,720,-3,720,720,720,-1,720,720,-1,720,-1,720,720,720,-1,720,-4,720,-2,720,720,720,720,-1,720,-1,720,720,720,720,720,720,720,720,720,720,720,720,720,720,-2,720,720,-5,720,720,-2,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,-4,720,720,720,720,720,720],
sm540=[0,-4,0,-4,0,-19,721],
sm541=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,722,-2,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm542=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,723,-2,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm543=[0,-4,0,-4,0,-20,724],
sm544=[0,725,725,725,-1,0,-4,0,-4,725,725,-1,725,725,-4,725,-2,725,725,725,725,725,-2,725,725,-14,725,725,-1,725,-1,725,-3,725,725,725,-1,725,725,-1,725,-1,725,725,725,-1,725,-4,725,-2,725,725,725,725,-1,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,-2,725,725,-5,725,725,-2,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,-4,725,725,725,725,725,725],
sm545=[0,-4,0,-4,0,-20,726],
sm546=[0,-4,0,-4,0,-24,727],
sm547=[0,-4,0,-4,0,-18,728,-5,728],
sm548=[0,-4,0,-4,0,-8,729],
sm549=[0,-4,0,-4,0,-8,730],
sm550=[0,731,-3,731,-4,731,-3,731,731,731,-7,731,-1,731],
sm551=[0,-2,732,-1,732,-4,732,-3,732,-1,732,-1,732,732,-4,732,-1,732,-123,732,732],
sm552=[0,-4,0,-4,0,-139,733],
sm553=[0,-4,0,-4,0,-139,734],
sm554=[0,-2,614,-1,615,616,617,618,619,0,-3,620,-135,735,735],
sm555=[0,-2,736,-1,736,736,736,736,736,0,-3,736,-135,736,736],
sm556=[0,-2,737,-1,737,737,737,737,737,0,-3,737,-135,737,737],
sm557=[0,-2,738,-1,738,738,738,738,738,0,-3,738,-135,738,738],
sm558=[0,-4,0,-4,0,-140,739],
sm559=[0,-4,0,-4,0,-8,740],
sm560=[0,741,-3,741,-4,741,-3,741,741,741,-7,741,-1,741],
sm561=[0,-4,0,-4,0,-12,742],
sm562=[0,-4,0,-4,0,-8,743],
sm563=[0,-4,744,-4,0,-46,630,-92,631,632],
sm564=[0,-2,633,-1,0,-4,0,-4,745,-8,745,-5,745,-2,746,634,-1,745,-6,635,-2,636,-16,745,745,745,745,-1,745,-8,745],
sm565=[0,-4,747,-4,0,-46,747,-92,747,747],
sm566=[0,-2,748,-1,0,-4,0,-4,748,-8,748,-5,748,-2,748,748,-1,748,-6,748,-2,748,-16,748,748,748,748,-1,748,-8,748],
sm567=[0,-4,0,-4,0,-3,749],
sm568=[0,-4,0,-4,0,-3,750],
sm569=[0,-4,0,-4,0,-139,631,632],
sm570=[0,-4,0,-4,0,-18,751,752],
sm571=[0,-2,753,-1,0,-4,0,-4,753,-8,753,-4,753,753,-5,753,-26,753,753,753,753,-1,753,-8,753],
sm572=[0,-2,754,-1,0,-4,0,-4,754,-8,754,-4,754,754,-5,754,-26,754,754,754,754,-1,754,-8,754],
sm573=[0,-2,755,-1,0,-4,0],
sm574=[0,-2,754,-1,0,-4,0,-4,754,-8,754,-4,754,754,-5,754,-4,756,-21,754,754,754,754,-1,754,-8,754],
sm575=[0,-2,757,-1,0,-4,0,-4,757,-8,757,-4,757,757,-4,757,757,-26,757,757,757,757,-1,757,-8,757],
sm576=[0,-2,758,-1,0,-4,0,-4,758,-8,758,-4,758,758,-4,758,758,-26,758,758,758,758,-1,758,-8,758],
sm577=[0,-2,758,-1,0,-4,0,-4,758,-8,758,-4,758,758,-4,758,758,-4,759,760,-20,758,758,758,758,-1,758,-8,758],
sm578=[0,-2,638,-1,0,-4,0,-23,634],
sm579=[0,-1,761,762,-1,0,-4,0,-23,634,-8,763],
sm580=[0,-2,764,-1,0,-4,0,-4,764,-8,764,-4,764,764,-4,764,764,-4,764,764,-20,764,764,764,764,-1,764,-8,764],
sm581=[0,-2,765,-1,0,-4,0,-4,765,-8,765,-4,765,765,-3,766,-1,765,-4,765,-21,765,765,765,765,-1,765,-8,765],
sm582=[0,-2,767,-1,0,-4,0],
sm583=[0,-4,0,-4,0,-19,768],
sm584=[0,-4,0,-4,0,-19,769],
sm585=[0,-4,0,-4,0,-19,770],
sm586=[0,-2,638,-1,0,-4,639,-23,640],
sm587=[0,-4,0,-4,0,-19,771,-4,771,-5,772,773],
sm588=[0,-2,774,-1,0,-4,639,-23,640,-8,641],
sm589=[0,-4,0,-4,0,-19,775,-4,775,-5,775,775],
sm590=[0,-4,0,-4,0,-19,776,-4,776,-5,776,776],
sm591=[0,-4,0,-4,0,-23,777],
sm592=[0,-4,0,-4,0,-23,766],
sm593=[0,-2,509,-1,0,-4,0,-4,778,-15,779,-4,340],
sm594=[0,-4,0,-4,0,-18,780,780],
sm595=[0,-4,0,-4,0,-20,781],
sm596=[0,-2,782,-1,0,-4,0,-13,782,-5,782,782,-4,782,-26,782,782,782,782,-1,782,-8,782],
sm597=[0,-2,783,-1,0,-4,0,-4,783,-15,783,-4,783],
sm598=[0,-2,784,-1,0,-4,0,-4,785,-15,784,-4,784],
sm599=[0,-2,786,-1,0,-4,0,-4,786,-15,786,-4,786],
sm600=[0,-2,787,-1,0,-4,0,-4,787,-15,787,-4,787],
sm601=[0,-2,509,-1,0,-4,0,-4,788,-15,788,-4,788],
sm602=[0,-4,789,-4,0,-3,790,-19,791],
sm603=[0,-2,792,-1,0,-4,0,-8,792,-9,792,792,-4,792,-23,792,792,792,-1,792,792,792,792,-1,792,-8,792],
sm604=[0,-2,793,-1,0,-4,0,-8,793,-9,793,793,-4,793,-23,793,793,793,-1,793,793,793,793,-1,793,-8,793],
sm605=[0,-2,794,-1,0,-4,0,-8,794,-9,794,794,-4,794,-23,794,794,794,-1,794,794,794,794,-1,794,-8,517],
sm606=[0,-2,795,-1,0,-4,0,-8,795,-9,795,795,-4,795,-23,795,795,795,-1,795,795,795,795,-1,795,-8,795],
sm607=[0,-2,796,797,0,-4,0],
sm608=[0,-4,0,-4,0,-40,798],
sm609=[0,-2,799,799,0,-4,0],
sm610=[0,-2,800,-1,0,-4,0,-8,800,-9,800,800,-4,800,-23,800,800,800,-1,800,800,800,800,-1,800,-8,800],
sm611=[0,-2,801,-1,0,-4,0,-8,801,-9,801,801,-4,801,-23,801,801,801,-1,801,801,801,801,-1,801,-8,801],
sm612=[0,-4,0,-4,0,-14,802],
sm613=[0,-4,0,-4,0,-8,803],
sm614=[0,-4,0,-4,0,-8,804],
sm615=[0,-4,0,-4,0,-18,805,-39,805],
sm616=[0,-4,0,-4,0,-19,806],
sm617=[0,-4,0,-4,0,-19,807],
sm618=[0,-4,0,-4,0,-24,808],
sm619=[0,-4,0,-4,0,-24,809],
sm620=[0,-4,0,-4,0,-4,810,810,-1,810,810,-7,810,810,810,810,810,-2,810,810,-14,810,810,-1,810,-1,810,-3,810,-1,810,-1,810,810,-1,810,-1,810,810,810,-1,810,-4,810,-14,810,-12,810,-9,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,-4,810,810],
sm621=[0,-4,0,-4,0,-18,811,-1,811,-3,811,-15,811,-3,811,-13,811,-22,811],
sm622=[0,-4,0,-4,0,-18,812,-1,812,-3,812,-15,812,-3,812,-13,812,-22,812],
sm623=[0,-4,0,-4,0,-58,813],
sm624=[0,-4,0,-4,0,-4,814],
sm625=[0,-1,2,3,-1,0,-4,0,-19,146,-3,7,815,-23,8,9,-7,147,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm626=[0,-4,0,-4,0,-24,816],
sm627=[0,-4,0,-4,0,-24,817],
sm628=[0,818,818,818,-1,0,-4,0,-4,818,818,-7,818,-5,818,818,-2,818,-24,818,818,-7,818,-11,818,818,818,818,-1,818,818,818,818,818,818,818,-1,818,818,818,818,818,818,818,818,-2,818,818,-5,818,818,-2,818,-23,818,-1,818,818,818,818,818,818,-4,818,818,818,818,818,818],
sm629=[0,-4,0,-4,0,-24,819],
sm630=[0,820,820,820,-1,0,-4,0,-4,820,820,-7,820,-5,820,820,-2,820,-24,820,820,-7,820,-11,820,820,820,820,-1,820,820,820,820,820,820,820,-1,820,820,820,820,820,820,820,820,-2,820,820,-5,820,820,-2,820,-23,820,-1,820,820,820,820,820,820,-4,820,820,820,820,820,820],
sm631=[0,-4,0,-4,0,-24,821],
sm632=[0,822,822,822,-1,0,-4,0,-4,822,822,-7,822,-5,822,822,-2,822,-24,822,822,-7,822,-11,822,822,822,822,-1,822,822,822,822,822,822,822,-1,822,822,822,822,822,822,822,822,-2,822,822,-5,822,822,-2,822,-23,822,-1,822,822,822,822,822,822,-4,822,822,822,822,822,822],
sm633=[0,-4,0,-4,0,-20,823,-48,715,-18,716],
sm634=[0,-4,0,-4,0,-20,824,-67,716],
sm635=[0,-4,0,-4,0,-20,825,-48,825,-18,825],
sm636=[0,-4,0,-4,0,-20,826,-45,827,-21,826],
sm637=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,828,-2,7,-24,8,9,-20,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm638=[0,-4,0,-4,0,-20,829],
sm639=[0,830,830,830,-1,0,-4,0,-4,830,830,-1,830,830,-4,830,-2,830,830,830,830,830,-2,830,830,-14,830,830,-1,830,-1,830,-3,830,830,830,-1,830,830,-1,830,-1,830,830,830,-1,830,-4,830,-2,830,830,830,830,-1,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,-2,830,830,-5,830,830,-2,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,830,-4,830,830,830,830,830,830],
sm640=[0,-4,0,-4,0,-20,831],
sm641=[0,832,832,832,-1,0,-4,0,-4,832,832,-1,832,832,-4,832,-2,832,832,832,832,832,-2,832,832,-14,832,832,-1,832,-1,832,-3,832,832,832,-1,832,832,-1,832,-1,832,832,832,-1,832,-4,832,-2,832,832,832,832,-1,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,-2,832,832,-5,832,832,-2,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,832,-4,832,832,832,832,832,832],
sm642=[0,833,833,833,-1,0,-4,0,-4,833,833,-1,833,833,-4,833,-2,833,833,833,833,833,-2,833,833,-14,833,833,-1,833,-1,833,-3,833,833,833,-1,833,833,-1,833,-1,833,833,833,-1,833,-4,833,-2,833,833,833,833,-1,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,-2,833,833,-5,833,833,-2,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,833,-4,833,833,833,833,833,833],
sm643=[0,-4,0,-4,0,-8,834],
sm644=[0,835,-3,835,-4,835,-3,835,835,835,-7,835,-1,835],
sm645=[0,836,-3,836,-4,836,-3,836,836,836,-7,836,-1,836],
sm646=[0,-4,0,-4,0,-16,837],
sm647=[0,-2,838,-1,0,-4,0,-7,838,838,-130,838,838],
sm648=[0,-2,839,-1,0,-4,0,-7,839,839,-130,839,839],
sm649=[0,-2,840,-1,840,840,840,840,840,0,-3,840,-135,840,840],
sm650=[0,841,-3,841,-4,841,-3,841,841,841,-7,841,-1,841],
sm651=[0,-4,0,-4,0,-8,842],
sm652=[0,-2,633,-1,0,-4,0,-4,843,-8,843,-5,843,-2,746,634,-1,843,-6,635,-2,636,-16,843,843,843,843,-1,843,-8,843],
sm653=[0,-4,844,-4,0,-46,844,-92,844,844],
sm654=[0,-2,633,-1,0,-4,0,-4,843,-8,843,-5,843,-3,634,-1,843,-6,635,-2,636,-16,843,843,843,843,-1,843,-8,843],
sm655=[0,-2,843,-1,0,-4,0,-4,843,-8,843,-4,751,843,-5,843,-26,843,843,843,843,-1,843,-8,843],
sm656=[0,-4,0,-4,0,-23,845],
sm657=[0,-4,0,-4,0,-3,749,-135,846],
sm658=[0,-4,0,-4,0,-3,847,-135,847],
sm659=[0,-4,0,-4,0,-3,848,-135,848],
sm660=[0,-4,0,-4,0,-3,750,-136,849],
sm661=[0,-4,0,-4,0,-3,850,-136,850],
sm662=[0,-4,0,-4,0,-3,851,-136,851],
sm663=[0,-2,852,-1,0,-4,0,-4,852,-8,852,-5,852,-2,852,852,-1,852,-6,852,-2,852,-16,852,852,852,852,-1,852,-8,852],
sm664=[0,-2,853,-1,0,-4,0,-4,853,-8,853,-5,853,-2,853,853,-1,853,-6,853,-2,853,-16,853,853,853,853,-1,853,-8,853],
sm665=[0,-2,337,-1,0,-4,0,-19,339,854,-31,341,342,343,344,-1,345,-8,346],
sm666=[0,-2,855,-1,0,-4,0,-4,855,-8,855,-4,855,855,-5,855,-4,756,-21,855,855,855,855,-1,855,-8,855],
sm667=[0,-2,765,-1,0,-4,0,-4,765,-8,765,-4,765,765,-5,765,-4,765,-21,765,765,765,765,-1,765,-8,765],
sm668=[0,-2,855,-1,0,-4,0,-4,855,-8,855,-4,855,855,-5,855,-26,855,855,855,855,-1,855,-8,855],
sm669=[0,-2,638,-1,0,-4,0,-23,634,-8,763],
sm670=[0,-2,856,-1,0,-4,0,-4,856,-8,856,-4,856,856,-4,856,856,-4,759,-21,856,856,856,856,-1,856,-8,856],
sm671=[0,-2,857,-1,0,-4,0,-4,857,-8,857,-4,857,857,-4,857,857,-5,760,-20,857,857,857,857,-1,857,-8,857],
sm672=[0,-2,858,-1,0,-4,0,-4,858,-8,858,-4,858,858,-4,858,858,-4,858,-21,858,858,858,858,-1,858,-8,858],
sm673=[0,-2,859,-1,0,-4,0,-4,859,-8,859,-4,859,859,-4,859,859,-5,859,-20,859,859,859,859,-1,859,-8,859],
sm674=[0,-2,860,-1,0,-4,0,-4,860,-8,860,-4,860,860,-4,860,860,-26,860,860,860,860,-1,860,-8,860],
sm675=[0,-4,0,-4,0,-24,861],
sm676=[0,-4,0,-4,0,-24,862],
sm677=[0,-4,863,-4,0,-3,864,-1,865,-2,865,-14,766,866,-14,865,865,-25,865],
sm678=[0,-4,0,-4,0,-24,867],
sm679=[0,-4,0,-4,0,-5,868,-2,869,-30,870,871,-25,872],
sm680=[0,-4,0,-4,0,-5,873,-2,874,-30,875,876],
sm681=[0,-4,0,-4,0,-5,877,-1,878,877,-15,877,-14,877,877,-2,879,880,881],
sm682=[0,-4,0,-4,0,-5,877,-2,877,-15,877,-14,877,877],
sm683=[0,-4,882,-4,0,-3,883,-20,884],
sm684=[0,-1,885,-2,0,-4,0,-28,886,887],
sm685=[0,-4,0,-4,0,-19,888,-4,888],
sm686=[0,-4,0,-4,0,-19,888,-4,888,-5,772],
sm687=[0,-4,0,-4,0,-19,888,-4,888,-6,773],
sm688=[0,-4,0,-4,0,-19,889,-4,889,-5,889],
sm689=[0,-4,0,-4,0,-19,890,-4,890,-6,890],
sm690=[0,-4,0,-4,0,-24,891],
sm691=[0,-4,0,-4,0,-24,892],
sm692=[0,-4,863,-4,0,-3,864,-19,766,866,-41,649],
sm693=[0,-4,0,-4,0,-20,893],
sm694=[0,-2,894,-1,0,-4,0,-13,894,-5,894,894,-4,894,-26,894,894,894,894,-1,894,-8,894],
sm695=[0,-2,509,-1,0,-4,0,-4,895,-15,895,-4,895],
sm696=[0,-2,896,-1,0,-4,0,-4,896,-15,896,-4,896],
sm697=[0,-2,897,-1,789,-4,0,-3,790,897,-15,897,-2,791,897,897,-106,898],
sm698=[0,-2,899,-1,789,-4,0,-3,790,899,-15,899,-2,899,899,899,-106,899],
sm699=[0,-2,900,-1,900,-4,0,-3,900,900,-15,900,-2,900,900,900,-106,900],
sm700=[0,-2,901,-1,901,-4,0,-3,901,901,-15,901,-2,901,901,901,-106,901],
sm701=[0,-4,0,-4,0,-58,902,-3,903,904],
sm702=[0,-4,0,-4,0,-58,905,-3,905,905],
sm703=[0,-2,906,906,0,-4,0],
sm704=[0,-4,0,-4,0,-24,907],
sm705=[0,-4,0,-4,0,-8,908],
sm706=[0,-4,0,-4,0,-19,909],
sm707=[0,-4,0,-4,0,-18,910,-1,910,-3,910,-15,910,-3,910,-13,910,-22,910],
sm708=[0,911,911,911,-1,0,-4,0,-4,911,911,-7,911,-5,911,911,-2,911,-24,911,911,-7,911,-11,911,911,911,911,-1,911,911,911,911,911,911,911,-1,911,911,911,911,911,911,911,911,-2,911,911,-5,911,911,-2,911,-23,911,-1,911,911,911,911,911,911,-4,911,911,911,911,911,911],
sm709=[0,912,912,912,-1,0,-4,0,-4,912,912,-7,912,-5,912,912,-2,912,-24,912,912,-7,912,-11,912,912,912,912,-1,912,912,912,912,912,912,912,-1,912,912,912,912,912,912,912,912,-2,912,912,-5,912,912,-2,912,-23,912,-1,912,912,912,912,912,912,-4,912,912,912,912,912,912],
sm710=[0,-4,0,-4,0,-24,913],
sm711=[0,914,914,914,-1,0,-4,0,-4,914,914,-7,914,-5,914,914,-2,914,-24,914,914,-7,914,-11,914,914,914,914,-1,914,914,914,914,914,914,914,-1,914,914,914,914,914,914,914,914,-2,914,914,-5,914,914,-2,914,-23,914,-1,914,914,914,914,914,914,-4,914,914,914,914,914,914],
sm712=[0,915,915,915,-1,0,-4,0,-4,915,915,-7,915,-5,915,915,-2,915,-24,915,915,-7,915,-11,915,915,915,915,-1,915,915,915,915,915,915,915,-1,915,915,915,915,915,915,915,915,-2,915,915,-5,915,915,-2,915,-23,915,-1,915,915,915,915,915,915,-4,915,915,915,915,915,915],
sm713=[0,916,916,916,-1,0,-4,0,-4,916,916,-7,916,-5,916,916,-2,916,-24,916,916,-7,916,-11,916,916,916,916,-1,916,916,916,916,916,916,916,-1,916,916,916,916,916,916,916,916,-2,916,916,-5,916,916,-2,916,-23,916,-1,916,916,916,916,916,916,-4,916,916,916,916,916,916],
sm714=[0,917,917,917,-1,0,-4,0,-4,917,917,-7,917,-5,917,917,-2,917,-24,917,917,-7,917,-11,917,917,917,917,-1,917,917,917,917,917,917,917,-1,917,917,917,917,917,917,917,917,-2,917,917,-5,917,917,-2,917,-23,917,-1,917,917,917,917,917,917,-4,917,917,917,917,917,917],
sm715=[0,918,918,918,-1,0,-4,0,-4,918,918,-7,918,-5,918,918,-2,918,-24,918,918,-7,918,-11,918,918,918,918,-1,918,918,918,918,918,918,918,-1,918,918,918,918,918,918,918,918,-2,918,918,-5,918,918,-2,918,-23,918,-1,918,918,918,918,918,918,-4,918,918,918,918,918,918],
sm716=[0,919,919,919,-1,0,-4,0,-4,919,919,-7,919,-5,919,919,-2,919,-24,919,919,-7,919,-11,919,919,919,919,-1,919,919,919,919,919,919,919,-1,919,919,919,919,919,919,919,919,-2,919,919,-5,919,919,-2,919,-23,919,-1,919,919,919,919,919,919,-4,919,919,919,919,919,919],
sm717=[0,920,920,920,-1,0,-4,0,-4,920,920,-7,920,-5,920,920,-2,920,-24,920,920,-7,920,-11,920,920,920,920,-1,920,920,920,920,920,920,920,-1,920,920,920,920,920,920,920,920,-2,920,920,-5,920,920,-2,920,-23,920,-1,920,920,920,920,920,920,-4,920,920,920,920,920,920],
sm718=[0,-4,0,-4,0,-20,921,-67,716],
sm719=[0,922,922,922,-1,0,-4,0,-4,922,922,-7,922,-5,922,922,-2,922,-24,922,922,-7,922,-11,922,922,922,922,-1,922,922,922,922,922,922,922,-1,922,922,922,922,922,922,922,922,-2,922,922,-5,922,922,-2,922,-23,922,-1,922,922,922,922,922,922,-4,922,922,922,922,922,922],
sm720=[0,-4,0,-4,0,-20,923,-48,923,-18,923],
sm721=[0,-4,0,-4,0,-20,924,-67,716],
sm722=[0,-4,0,-4,0,-66,925],
sm723=[0,926,926,926,-1,0,-4,0,-4,926,926,-7,926,-5,926,926,-2,926,-24,926,926,-7,926,-11,926,926,926,926,-1,926,926,926,926,926,926,926,-1,926,926,926,926,926,926,926,926,-1,926,926,926,-5,926,926,-2,926,-23,926,-1,926,926,926,926,926,926,-4,926,926,926,926,926,926],
sm724=[0,-4,0,-4,0,-20,927],
sm725=[0,928,928,928,-1,0,-4,0,-4,928,928,-1,928,928,-4,928,-2,928,928,928,928,928,-2,928,928,-14,928,928,-1,928,-1,928,-3,928,928,928,-1,928,928,-1,928,-1,928,928,928,-1,928,-4,928,-2,928,928,928,928,-1,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,-2,928,928,-5,928,928,-2,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,928,-4,928,928,928,928,928,928],
sm726=[0,929,929,929,-1,0,-4,0,-4,929,929,-1,929,929,-4,929,-2,929,929,929,929,929,-2,929,929,-14,929,929,-1,929,-1,929,-3,929,929,929,-1,929,929,-1,929,-1,929,929,929,-1,929,-4,929,-2,929,929,929,929,-1,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,-2,929,929,-5,929,929,-2,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,929,-4,929,929,929,929,929,929],
sm727=[0,930,930,930,-1,0,-4,0,-4,930,930,-1,930,930,-4,930,-2,930,930,930,930,930,-2,930,930,-14,930,930,-1,930,-1,930,-3,930,930,930,-1,930,930,-1,930,-1,930,930,930,-1,930,-4,930,-2,930,930,930,930,-1,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,-2,930,930,-5,930,930,-2,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,930,-4,930,930,930,930,930,930],
sm728=[0,931,-3,931,-4,931,-3,931,931,931,-7,931,-1,931],
sm729=[0,-2,932,-1,932,-4,932,-3,932,-1,932,-1,932,932,-4,932,-1,932,-123,932,932],
sm730=[0,-2,633,-1,0,-4,0,-4,933,-8,933,-5,933,-3,634,-1,933,-6,635,-2,636,-16,933,933,933,933,-1,933,-8,933],
sm731=[0,-2,933,-1,0,-4,0,-4,933,-8,933,-4,751,933,-5,933,-26,933,933,933,933,-1,933,-8,933],
sm732=[0,-2,934,-1,0,-4,639,-23,640,-8,641],
sm733=[0,-2,935,-1,0,-4,0,-4,935,-8,935,-5,935,-2,935,935,-1,935,-6,935,-2,935,-16,935,935,935,935,-1,935,-8,935],
sm734=[0,-4,0,-4,0,-3,936,-135,936],
sm735=[0,-4,0,-4,0,-3,937,-136,937],
sm736=[0,-4,0,-4,0,-20,938],
sm737=[0,-2,337,-1,0,-4,0,-19,339,939,-31,341,342,343,344,-1,345,-8,346],
sm738=[0,-2,940,-1,0,-4,0,-19,940,940,-31,940,940,940,940,-1,940,-8,940],
sm739=[0,-2,941,-1,0,-4,0,-4,941,-8,941,-4,941,941,-5,941,-26,941,941,941,941,-1,941,-8,941],
sm740=[0,-2,942,-1,0,-4,0,-4,942,-8,942,-4,942,942,-5,942,-26,942,942,942,942,-1,942,-8,942],
sm741=[0,-2,943,-1,0,-4,0,-4,943,-8,943,-4,943,943,-5,943,-26,943,943,943,943,-1,943,-8,943],
sm742=[0,-2,758,-1,0,-4,0,-4,758,-8,758,-4,758,758,-5,758,-4,759,-21,758,758,758,758,-1,758,-8,758],
sm743=[0,-2,944,-1,0,-4,0,-4,944,-8,944,-4,944,944,-4,944,944,-4,944,-21,944,944,944,944,-1,944,-8,944],
sm744=[0,-2,945,-1,0,-4,0,-4,945,-8,945,-4,945,945,-4,945,945,-5,945,-20,945,945,945,945,-1,945,-8,945],
sm745=[0,-2,946,-1,0,-4,0,-4,946,-8,946,-4,946,946,-4,946,946,-4,946,-21,946,946,946,946,-1,946,-8,946],
sm746=[0,-2,947,-1,0,-4,0,-4,947,-8,947,-4,947,947,-4,947,947,-5,947,-20,947,947,947,947,-1,947,-8,947],
sm747=[0,-2,948,-1,0,-4,0,-4,948,-8,948,-4,948,948,-4,948,948,-4,948,948,-20,948,948,948,948,-1,948,-8,948],
sm748=[0,-2,949,-1,0,-4,0,-4,949,-8,949,-4,949,949,-4,949,949,-4,949,949,-20,949,949,949,949,-1,949,-8,949],
sm749=[0,-4,863,-4,0,-3,864,-20,950],
sm750=[0,-2,951,-1,0,-4,0,-4,951,-8,951,-4,951,951,-4,951,951,-4,951,951,-20,951,951,951,951,-1,951,-8,951],
sm751=[0,-4,952,-4,0,-3,952,-20,952],
sm752=[0,-4,953,-4,0,-3,953,-20,953],
sm753=[0,-1,761,954,-1,0,-4,0],
sm754=[0,-1,955,955,-1,0,-4,0],
sm755=[0,-1,955,955,-1,0,-4,0,-40,956],
sm756=[0,-2,954,-1,0,-4,0],
sm757=[0,-2,957,-1,0,-4,0],
sm758=[0,-2,958,-1,0,-4,0],
sm759=[0,-2,959,-1,0,-4,0],
sm760=[0,-2,959,-1,0,-4,0,-40,960],
sm761=[0,-4,0,-4,0,-5,961,-2,961,-15,961,-14,961,961],
sm762=[0,-1,962,-2,0,-4,0],
sm763=[0,-4,0,-4,0,-5,963,-2,963,-15,963,-14,963,963],
sm764=[0,-4,882,-4,0,-3,883,-20,964],
sm765=[0,-4,965,-4,0,-3,965,-20,965],
sm766=[0,-4,966,-4,0,-3,966,-20,966],
sm767=[0,-1,885,-2,0,-4,0,-20,967,-7,886,887],
sm768=[0,-1,968,-2,0,-4,0,-20,968,-7,968,968],
sm769=[0,-4,0,-4,0,-18,969,970],
sm770=[0,-4,0,-4,0,-18,971,971],
sm771=[0,-4,0,-4,0,-18,972,972],
sm772=[0,-4,0,-4,0,-42,973],
sm773=[0,-4,0,-4,0,-20,974],
sm774=[0,-4,0,-4,0,-19,975,-4,975,-5,975],
sm775=[0,-4,0,-4,0,-19,976,-4,976,-6,976],
sm776=[0,-4,0,-4,0,-19,977,-4,977,-5,977],
sm777=[0,-4,0,-4,0,-19,978,-4,978,-6,978],
sm778=[0,-4,0,-4,0,-19,979,-4,979,-5,979,979],
sm779=[0,-4,0,-4,0,-19,980,-4,980,-5,980,980],
sm780=[0,-4,0,-4,0,-24,981],
sm781=[0,-2,982,-1,0,-4,0,-13,982,-5,982,982,-4,982,-26,982,982,982,982,-1,982,-8,982],
sm782=[0,-2,983,-1,0,-4,0,-4,983,-15,983,-4,983],
sm783=[0,-2,984,-1,0,-4,0,-4,984,-15,984,-3,984,984],
sm784=[0,-2,985,-1,789,-4,0,-3,790,985,-15,985,-2,791,985,985,-106,985],
sm785=[0,-4,0,-4,0,-65,986],
sm786=[0,-2,987,-1,987,-4,0,-3,987,987,-15,987,-2,987,987,987,-106,987],
sm787=[0,-4,789,-4,0,-3,790,-19,791,988],
sm788=[0,-4,0,-4,0,-58,989],
sm789=[0,-2,990,-1,0,-4,0,-8,990,-9,990,990,-4,990,-23,990,990,990,-1,990,990,990,990,-1,990,-8,990],
sm790=[0,-4,0,-4,0,-58,991],
sm791=[0,-2,992,-1,0,-4,0,-8,992,-9,992,992,-4,992,-23,992,992,992,-1,992,992,992,992,-1,992,-8,992],
sm792=[0,-4,0,-4,0,-20,993],
sm793=[0,-4,0,-4,0,-20,994],
sm794=[0,995,995,995,-1,0,-4,0,-4,995,995,-7,995,-5,995,995,-2,995,-24,995,995,-7,995,-11,995,995,995,995,-1,995,995,995,995,995,995,995,-1,995,995,995,995,995,995,995,995,-2,995,995,-5,995,995,-2,995,-23,995,-1,995,995,995,995,995,995,-4,995,995,995,995,995,995],
sm795=[0,996,996,996,-1,0,-4,0,-4,996,996,-7,996,-5,996,996,-2,996,-24,996,996,-7,996,-11,996,996,996,996,-1,996,996,996,996,996,996,996,-1,996,996,996,996,996,996,996,996,-2,996,996,-5,996,996,-2,996,-23,996,-1,996,996,996,996,996,996,-4,996,996,996,996,996,996],
sm796=[0,997,997,997,-1,0,-4,0,-4,997,997,-7,997,-5,997,997,-2,997,-24,997,997,-7,997,-11,997,997,997,997,-1,997,997,997,997,997,997,997,-1,997,997,997,997,997,997,997,997,-2,997,997,-5,997,997,-2,997,-23,997,-1,997,997,997,997,997,997,-4,997,997,997,997,997,997],
sm797=[0,998,998,998,-1,0,-4,0,-4,998,998,-7,998,-5,998,998,-2,998,-24,998,998,-7,998,-11,998,998,998,998,-1,998,998,998,998,998,998,998,-1,998,998,998,998,998,998,998,998,-2,998,998,-5,998,998,-2,998,-23,998,-1,998,998,998,998,998,998,-4,998,998,998,998,998,998],
sm798=[0,-4,0,-4,0,-20,999],
sm799=[0,1000,1000,1000,-1,0,-4,0,-4,1000,1000,-7,1000,-5,1000,1000,-2,1000,-24,1000,1000,-7,1000,-11,1000,1000,1000,1000,-1,1000,1000,1000,1000,1000,1000,1000,-1,1000,1000,1000,1000,1000,1000,1000,1000,-2,1000,1000,-5,1000,1000,-2,1000,-23,1000,-1,1000,1000,1000,1000,1000,1000,-4,1000,1000,1000,1000,1000,1000],
sm800=[0,-1,2,3,-1,0,-4,0,-4,4,80,-13,6,1001,-2,7,-24,8,9,-19,1001,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,1001,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
sm801=[0,-4,0,-4,0,-20,1002,-67,1002],
sm802=[0,1003,1003,1003,-1,0,-4,0,-4,1003,1003,-1,1003,1003,-4,1003,-2,1003,1003,1003,1003,1003,-2,1003,1003,-14,1003,1003,-1,1003,-1,1003,-3,1003,1003,1003,-1,1003,1003,-1,1003,-1,1003,1003,1003,-1,1003,-4,1003,-2,1003,1003,1003,1003,-1,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,-2,1003,1003,-5,1003,1003,-2,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,1003,-4,1003,1003,1003,1003,1003,1003],
sm803=[0,-2,1004,-1,0,-4,0,-4,1004,-8,1004,-4,751,1004,-5,1004,-26,1004,1004,1004,1004,-1,1004,-8,1004],
sm804=[0,-4,0,-4,0,-24,1005],
sm805=[0,-4,0,-4,0,-24,1006],
sm806=[0,-4,0,-4,0,-23,766,-42,649],
sm807=[0,-4,0,-4,0,-4,1007],
sm808=[0,-2,1008,-1,0,-4,0,-19,1008,1008,-31,1008,1008,1008,1008,-1,1008,-8,1008],
sm809=[0,-2,1009,-1,0,-4,0,-4,1009,-8,1009,-4,1009,1009,-4,1009,1009,-4,1009,1009,-20,1009,1009,1009,1009,-1,1009,-8,1009],
sm810=[0,-4,1010,-4,0,-3,1010,-20,1010],
sm811=[0,-4,0,-4,0,-24,1011],
sm812=[0,-4,0,-4,0,-24,877],
sm813=[0,-4,0,-4,0,-24,865],
sm814=[0,-4,0,-4,0,-24,1012],
sm815=[0,-1,1013,1013,-1,0,-4,0],
sm816=[0,-4,0,-4,0,-8,1014],
sm817=[0,-4,0,-4,0,-5,1015,-33,1016],
sm818=[0,-2,1017,-1,0,-4,0],
sm819=[0,-4,0,-4,0,-5,1018,-2,1018,-15,1018,-14,1018,1018],
sm820=[0,-4,1019,-4,0,-3,1019,-20,1019],
sm821=[0,-4,0,-4,0,-4,1020],
sm822=[0,-1,1021,-2,0,-4,0,-20,1021,-7,1021,1021],
sm823=[0,-4,0,-4,0,-18,1022,1022],
sm824=[0,-4,0,-4,0,-4,1023],
sm825=[0,-4,0,-4,0,-19,1024,-4,1024,-5,1024,1024],
sm826=[0,-2,1025,-1,0,-4,0,-4,1025,-15,1025,-3,1025,1025],
sm827=[0,-2,1026,-1,1026,-4,0,-3,1026,1026,-15,1026,-2,1026,1026,1026,-106,1026],
sm828=[0,-2,1027,-1,0,-4,0,-8,1027,-9,1027,1027,-4,1027,-23,1027,1027,1027,-1,1027,1027,1027,1027,-1,1027,-8,1027],
sm829=[0,-1,1028,1028,-1,0,-4,0,-4,1028,-13,1028,-1,1028,-36,1028,-38,1028,1028,1028,-40,1028,1028,-3,1028],
sm830=[0,-1,1029,1029,-1,0,-4,0,-4,1029,-13,1029,-1,1029,-36,1029,-38,1029,1029,1029,-40,1029,1029,-3,1029],
sm831=[0,-4,0,-4,0,-20,1030],
sm832=[0,1031,1031,1031,-1,0,-4,0,-4,1031,1031,-7,1031,-5,1031,1031,-2,1031,-24,1031,1031,-7,1031,-11,1031,1031,1031,1031,-1,1031,1031,1031,1031,1031,1031,1031,-1,1031,1031,1031,1031,1031,1031,1031,1031,-2,1031,1031,-5,1031,1031,-2,1031,-23,1031,-1,1031,1031,1031,1031,1031,1031,-4,1031,1031,1031,1031,1031,1031],
sm833=[0,1032,1032,1032,-1,0,-4,0,-4,1032,1032,-7,1032,-5,1032,1032,-2,1032,-24,1032,1032,-7,1032,-11,1032,1032,1032,1032,-1,1032,1032,1032,1032,1032,1032,1032,-1,1032,1032,1032,1032,1032,1032,1032,1032,-2,1032,1032,-5,1032,1032,-2,1032,-23,1032,-1,1032,1032,1032,1032,1032,1032,-4,1032,1032,1032,1032,1032,1032],
sm834=[0,-4,0,-4,0,-20,1033,-48,1033,-18,1033],
sm835=[0,-2,1034,-1,0,-4,0,-4,1034,-8,1034,-5,1034,-3,1034,-1,1034,-6,1034,-2,1034,-16,1034,1034,1034,1034,-1,1034,-8,1034],
sm836=[0,-1,1035,1035,-1,0,-4,0,-40,1036],
sm837=[0,-1,1037,1037,-1,0,-4,0],
sm838=[0,-2,509,-1,0,-4,0,-4,1038,-15,1039,-4,340],
sm839=[0,-4,0,-4,0,-18,1040,1040],
sm840=[0,-1,1041,1041,-1,0,-4,0,-4,1041,-13,1041,-1,1041,-36,1041,-38,1041,1041,1041,-40,1041,1041,-3,1041],
sm841=[0,-4,0,-4,0,-24,1042],
sm842=[0,-1,1043,1043,-1,0,-4,0],
sm843=[0,-4,0,-4,0,-20,1044],
sm844=[0,-1,1045,-2,0,-4,0,-20,1045,-7,1045,1045],
sm845=[0,-1,1046,-2,0,-4,0,-20,1046,-7,1046,1046],

    // Symbol Lookup map
    lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[";",14],["<",15],["import",16],["/",17],[">",18],["\"",149],["f",20],["filter",21],["style",22],["</",23],["script",24],["((",25],["))",26],[")(",27],[",",28],["{",29],["}",30],[null,9],["supports",32],["(",33],[")",34],["@",35],["keyframes",36],["id",37],["from",38],["to",39],["and",40],["or",41],["not",42],["media",44],["only",45],[":",76],["<=",49],["=",50],["%",52],["px",53],["in",54],["rad",55],["url",56],["'",150],["+",58],["~",59],["||",60],["*",62],["|",63],["#",64],[".",65],["[",67],["]",68],["^=",69],["$=",70],["*=",71],["i",72],["s",73],["!",142],["important",75],["as",77],["export",78],["default",79],["function",80],["class",81],["let",82],["async",83],["if",84],["else",85],["var",86],["do",87],["while",88],["for",89],["await",90],["of",91],["continue",92],["break",93],["return",94],["throw",95],["with",96],["switch",97],["case",98],["try",99],["catch",100],["finally",101],["debugger",102],["const",103],["=>",104],["extends",105],["static",106],["get",107],["set",108],["new",109],["super",110],["target",111],["...",112],["this",113],["/=",114],["%=",115],["+=",116],["-=",117],["<<=",118],[">>=",119],[">>>=",120],["&=",121],["|=",122],["**=",123],["?",124],["&&",125],["^",126],["&",127],["==",128],["!=",129],["===",130],["!==",131],[">=",132],["instanceof",133],["<<",134],[">>",135],[">>>",136],["-",137],["**",138],["delete",139],["void",140],["typeof",141],["++",143],["--",144],["null",151],["true",152],["false",153],["$",154],["input",155],["area",156],["base",157],["br",158],["col",159],["command",160],["embed",161],["hr",162],["img",163],["keygen",164],["link",165],["meta",166],["param",167],["source",168],["track",169],["wbr",170]]),

    //Reverse Symbol Lookup map
    rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,";"],[15,"<"],[16,"import"],[17,"/"],[18,">"],[149,"\""],[20,"f"],[21,"filter"],[22,"style"],[23,"</"],[24,"script"],[25,"(("],[26,"))"],[27,")("],[28,","],[29,"{"],[30,"}"],[9,null],[32,"supports"],[33,"("],[34,")"],[35,"@"],[36,"keyframes"],[37,"id"],[38,"from"],[39,"to"],[40,"and"],[41,"or"],[42,"not"],[44,"media"],[45,"only"],[76,":"],[49,"<="],[50,"="],[52,"%"],[53,"px"],[54,"in"],[55,"rad"],[56,"url"],[150,"'"],[58,"+"],[59,"~"],[60,"||"],[62,"*"],[63,"|"],[64,"#"],[65,"."],[67,"["],[68,"]"],[69,"^="],[70,"$="],[71,"*="],[72,"i"],[73,"s"],[142,"!"],[75,"important"],[77,"as"],[78,"export"],[79,"default"],[80,"function"],[81,"class"],[82,"let"],[83,"async"],[84,"if"],[85,"else"],[86,"var"],[87,"do"],[88,"while"],[89,"for"],[90,"await"],[91,"of"],[92,"continue"],[93,"break"],[94,"return"],[95,"throw"],[96,"with"],[97,"switch"],[98,"case"],[99,"try"],[100,"catch"],[101,"finally"],[102,"debugger"],[103,"const"],[104,"=>"],[105,"extends"],[106,"static"],[107,"get"],[108,"set"],[109,"new"],[110,"super"],[111,"target"],[112,"..."],[113,"this"],[114,"/="],[115,"%="],[116,"+="],[117,"-="],[118,"<<="],[119,">>="],[120,">>>="],[121,"&="],[122,"|="],[123,"**="],[124,"?"],[125,"&&"],[126,"^"],[127,"&"],[128,"=="],[129,"!="],[130,"==="],[131,"!=="],[132,">="],[133,"instanceof"],[134,"<<"],[135,">>"],[136,">>>"],[137,"-"],[138,"**"],[139,"delete"],[140,"void"],[141,"typeof"],[143,"++"],[144,"--"],[151,"null"],[152,"true"],[153,"false"],[154,"$"],[155,"input"],[156,"area"],[157,"base"],[158,"br"],[159,"col"],[160,"command"],[161,"embed"],[162,"hr"],[163,"img"],[164,"keygen"],[165,"link"],[166,"meta"],[167,"param"],[168,"source"],[169,"track"],[170,"wbr"]]),

    // States 
    state = [sm0,
sm1,
sm2,
sm2,
sm3,
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
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm18,
sm19,
sm20,
sm21,
sm22,
sm23,
sm24,
sm25,
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
sm37,
sm38,
sm39,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm41,
sm40,
sm40,
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
sm48,
sm48,
sm49,
sm50,
sm51,
sm52,
sm53,
sm54,
sm55,
sm55,
sm55,
sm55,
sm56,
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
sm40,
sm65,
sm66,
sm67,
sm68,
sm69,
sm70,
sm71,
sm71,
sm72,
sm73,
sm74,
sm75,
sm76,
sm77,
sm78,
sm79,
sm40,
sm80,
sm81,
sm82,
sm82,
sm82,
sm83,
sm84,
sm85,
sm68,
sm86,
sm87,
sm88,
sm89,
sm90,
sm91,
sm92,
sm93,
sm94,
sm95,
sm96,
sm97,
sm98,
sm99,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm100,
sm101,
sm102,
sm103,
sm104,
sm105,
sm40,
sm40,
sm40,
sm106,
sm107,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm108,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm40,
sm109,
sm41,
sm110,
sm111,
sm112,
sm48,
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
sm123,
sm124,
sm125,
sm126,
sm127,
sm40,
sm128,
sm40,
sm126,
sm129,
sm130,
sm44,
sm131,
sm132,
sm133,
sm134,
sm135,
sm136,
sm137,
sm137,
sm137,
sm137,
sm137,
sm137,
sm137,
sm138,
sm135,
sm139,
sm140,
sm140,
sm140,
sm140,
sm140,
sm140,
sm140,
sm141,
sm142,
sm68,
sm143,
sm126,
sm40,
sm144,
sm145,
sm146,
sm147,
sm148,
sm149,
sm150,
sm151,
sm152,
sm153,
sm154,
sm154,
sm155,
sm156,
sm40,
sm157,
sm40,
sm158,
sm159,
sm40,
sm160,
sm161,
sm162,
sm163,
sm164,
sm165,
sm166,
sm40,
sm167,
sm168,
sm169,
sm170,
sm171,
sm172,
sm173,
sm174,
sm175,
sm176,
sm177,
sm178,
sm152,
sm152,
sm100,
sm179,
sm180,
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
sm196,
sm196,
sm197,
sm198,
sm199,
sm200,
sm200,
sm201,
sm202,
sm203,
sm204,
sm205,
sm206,
sm207,
sm207,
sm207,
sm207,
sm208,
sm208,
sm208,
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
sm218,
sm219,
sm220,
sm221,
sm222,
sm223,
sm223,
sm40,
sm224,
sm225,
sm226,
sm227,
sm228,
sm229,
sm230,
sm229,
sm40,
sm231,
sm232,
sm233,
sm233,
sm234,
sm234,
sm235,
sm235,
sm40,
sm236,
sm237,
sm238,
sm239,
sm240,
sm241,
sm242,
sm243,
sm40,
sm244,
sm245,
sm246,
sm247,
sm248,
sm249,
sm248,
sm250,
sm251,
sm252,
sm253,
sm254,
sm255,
sm256,
sm257,
sm258,
sm20,
sm259,
sm260,
sm260,
sm261,
sm68,
sm262,
sm40,
sm262,
sm263,
sm264,
sm265,
sm126,
sm266,
sm267,
sm268,
sm269,
sm270,
sm271,
sm272,
sm273,
sm68,
sm274,
sm275,
sm276,
sm277,
sm278,
sm279,
sm280,
sm281,
sm282,
sm283,
sm284,
sm285,
sm286,
sm68,
sm287,
sm68,
sm288,
sm289,
sm290,
sm291,
sm292,
sm293,
sm294,
sm295,
sm296,
sm297,
sm298,
sm80,
sm299,
sm300,
sm301,
sm302,
sm303,
sm304,
sm305,
sm306,
sm305,
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
sm68,
sm319,
sm319,
sm320,
sm321,
sm322,
sm323,
sm324,
sm325,
sm325,
sm326,
sm327,
sm328,
sm329,
sm329,
sm40,
sm330,
sm331,
sm332,
sm333,
sm334,
sm335,
sm336,
sm330,
sm191,
sm337,
sm338,
sm339,
sm339,
sm340,
sm341,
sm342,
sm343,
sm344,
sm344,
sm345,
sm346,
sm347,
sm348,
sm349,
sm349,
sm350,
sm351,
sm352,
sm353,
sm354,
sm355,
sm356,
sm357,
sm358,
sm358,
sm358,
sm358,
sm359,
sm360,
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
sm40,
sm375,
sm376,
sm377,
sm378,
sm379,
sm379,
sm380,
sm381,
sm382,
sm383,
sm384,
sm385,
sm386,
sm40,
sm387,
sm388,
sm389,
sm390,
sm391,
sm392,
sm393,
sm394,
sm395,
sm396,
sm397,
sm398,
sm68,
sm399,
sm399,
sm400,
sm401,
sm402,
sm403,
sm404,
sm405,
sm405,
sm406,
sm407,
sm68,
sm408,
sm409,
sm410,
sm411,
sm410,
sm410,
sm412,
sm413,
sm413,
sm414,
sm72,
sm40,
sm72,
sm415,
sm416,
sm417,
sm40,
sm418,
sm419,
sm40,
sm420,
sm421,
sm422,
sm423,
sm424,
sm423,
sm423,
sm425,
sm426,
sm68,
sm426,
sm68,
sm427,
sm72,
sm428,
sm68,
sm429,
sm430,
sm431,
sm432,
sm433,
sm434,
sm435,
sm436,
sm437,
sm438,
sm439,
sm440,
sm441,
sm324,
sm442,
sm324,
sm443,
sm443,
sm444,
sm445,
sm446,
sm447,
sm447,
sm447,
sm448,
sm449,
sm450,
sm450,
sm336,
sm442,
sm451,
sm452,
sm453,
sm454,
sm455,
sm456,
sm457,
sm458,
sm459,
sm460,
sm461,
sm462,
sm346,
sm463,
sm464,
sm465,
sm466,
sm467,
sm468,
sm469,
sm470,
sm471,
sm463,
sm472,
sm473,
sm473,
sm473,
sm473,
sm474,
sm475,
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
sm485,
sm486,
sm487,
sm488,
sm489,
sm490,
sm491,
sm458,
sm458,
sm458,
sm492,
sm493,
sm494,
sm495,
sm496,
sm497,
sm498,
sm499,
sm499,
sm500,
sm501,
sm502,
sm503,
sm504,
sm505,
sm506,
sm68,
sm507,
sm508,
sm509,
sm510,
sm511,
sm512,
sm513,
sm514,
sm515,
sm516,
sm517,
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
sm72,
sm528,
sm529,
sm530,
sm72,
sm531,
sm40,
sm532,
sm533,
sm533,
sm534,
sm535,
sm536,
sm537,
sm538,
sm538,
sm539,
sm540,
sm541,
sm542,
sm543,
sm544,
sm545,
sm546,
sm547,
sm324,
sm548,
sm549,
sm550,
sm40,
sm551,
sm552,
sm553,
sm554,
sm555,
sm556,
sm557,
sm557,
sm557,
sm557,
sm557,
sm557,
sm557,
sm558,
sm559,
sm560,
sm561,
sm562,
sm563,
sm564,
sm565,
sm566,
sm566,
sm567,
sm568,
sm569,
sm570,
sm571,
sm572,
sm573,
sm574,
sm575,
sm575,
sm576,
sm576,
sm577,
sm578,
sm579,
sm580,
sm580,
sm581,
sm582,
sm583,
sm584,
sm584,
sm585,
sm586,
sm587,
sm588,
sm589,
sm589,
sm590,
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
sm605,
sm606,
sm607,
sm608,
sm609,
sm609,
sm609,
sm609,
sm610,
sm463,
sm611,
sm612,
sm613,
sm614,
sm550,
sm615,
sm616,
sm617,
sm618,
sm619,
sm620,
sm620,
sm621,
sm622,
sm623,
sm622,
sm72,
sm624,
sm625,
sm626,
sm72,
sm627,
sm72,
sm72,
sm628,
sm72,
sm629,
sm72,
sm72,
sm630,
sm72,
sm631,
sm632,
sm633,
sm634,
sm635,
sm40,
sm636,
sm80,
sm637,
sm638,
sm639,
sm640,
sm641,
sm642,
sm643,
sm644,
sm645,
sm646,
sm647,
sm648,
sm649,
sm648,
sm650,
sm651,
sm645,
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
sm664,
sm665,
sm460,
sm666,
sm667,
sm668,
sm669,
sm670,
sm671,
sm672,
sm578,
sm673,
sm578,
sm674,
sm675,
sm676,
sm677,
sm578,
sm678,
sm678,
sm678,
sm679,
sm680,
sm681,
sm682,
sm682,
sm683,
sm684,
sm665,
sm685,
sm686,
sm687,
sm688,
sm586,
sm689,
sm586,
sm690,
sm691,
sm692,
sm463,
sm693,
sm694,
sm694,
sm695,
sm696,
sm697,
sm698,
sm602,
sm699,
sm700,
sm700,
sm701,
sm702,
sm702,
sm703,
sm704,
sm705,
sm644,
sm645,
sm20,
sm20,
sm706,
sm707,
sm708,
sm709,
sm710,
sm72,
sm72,
sm711,
sm72,
sm712,
sm713,
sm714,
sm72,
sm715,
sm716,
sm717,
sm72,
sm718,
sm719,
sm720,
sm721,
sm719,
sm722,
sm20,
sm723,
sm724,
sm725,
sm726,
sm727,
sm728,
sm729,
sm728,
sm730,
sm731,
sm731,
sm732,
sm733,
sm734,
sm733,
sm735,
sm736,
sm737,
sm738,
sm739,
sm740,
sm741,
sm742,
sm743,
sm744,
sm745,
sm746,
sm747,
sm748,
sm749,
sm750,
sm751,
sm752,
sm752,
sm753,
sm753,
sm754,
sm755,
sm754,
sm754,
sm756,
sm757,
sm758,
sm759,
sm760,
sm759,
sm759,
sm761,
sm762,
sm763,
sm763,
sm763,
sm764,
sm750,
sm765,
sm766,
sm766,
sm767,
sm768,
sm769,
sm770,
sm771,
sm771,
sm771,
sm772,
sm773,
sm774,
sm775,
sm776,
sm777,
sm778,
sm779,
sm780,
sm781,
sm782,
sm783,
sm784,
sm785,
sm786,
sm787,
sm788,
sm789,
sm790,
sm790,
sm791,
sm728,
sm792,
sm793,
sm20,
sm72,
sm794,
sm795,
sm796,
sm796,
sm797,
sm798,
sm799,
sm799,
sm800,
sm801,
sm802,
sm803,
sm804,
sm805,
sm805,
sm806,
sm807,
sm808,
sm809,
sm810,
sm811,
sm812,
sm813,
sm814,
sm815,
sm814,
sm816,
sm817,
sm818,
sm819,
sm809,
sm820,
sm821,
sm822,
sm346,
sm684,
sm823,
sm824,
sm825,
sm826,
sm827,
sm828,
sm829,
sm830,
sm831,
sm832,
sm833,
sm834,
sm835,
sm753,
sm836,
sm753,
sm837,
sm837,
sm838,
sm839,
sm840,
sm841,
sm842,
sm841,
sm843,
sm844,
sm845],

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
R40_html_BODY=function (sym,env,lex,state,output,len) {return (sym[0].import_list = sym[1],sym[0])},
R60_html_ATTRIBUTE_BODY=function (sym,env,lex,state,output,len) {return sym[1]},
R90_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
I110_BASIC_BINDING=function (sym,env,lex,state,output,len) {env.start = lex.off+2;},
R190_css_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
C200_css_RULE_SET=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.body = sym[2];},
C310_css_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
C340_css_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
R640_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
R641_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
R930_css_COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len > 1 ? [sym[0]].concat(sym[1]) : [sym[0]]},
R1180_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : sym[0],at_rules : []}},
R1181_css_declaration_list=function (sym,env,lex,state,output,len) {return {props : [],at_rules : [sym[0]]}},
R1182_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].at_rules.push(sym[1]),sym[0])},
R1183_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].props.push(...sym[1]),sym[0])},
R1230_css_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
C1580_js_empty_statement=function (sym,env,lex,state,output,len) {this.type = "empty";},
R1640_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[8])},
I1641_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
I1642_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
R1643_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[7])},
R1644_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_in_statement(sym[2],sym[4],sym[6])},
R1645_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(sym[1],sym[3],sym[5],sym[7])},
R1646_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[7])},
R1647_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[7])},
R1648_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,sym[4],sym[6])},
R1649_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],null,sym[6])},
R16410_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(null,sym[2],sym[4],sym[6])},
R16411_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[6])},
R16412_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[6])},
R16413_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[6])},
R16414_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,null,sym[5])},
R16415_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[5])},
R1670_js_continue_statement=function (sym,env,lex,state,output,len) {return new env.functions.continue_statement(sym[1])},
R1680_js_break_statement=function (sym,env,lex,state,output,len) {return new env.functions.break_statement(sym[1])},
R1730_js_case_block=function (sym,env,lex,state,output,len) {return []},
R1731_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
R1732_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
R1740_js_case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
R1750_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1],sym[3])},
R1751_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1])},
R1760_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement(sym[2])},
R1761_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement()},
R1800_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2])},
R1801_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],null,sym[2])},
R1802_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2],sym[3])},
R1890_js_let_or_const=function (sym,env,lex,state,output,len) {return "let"},
R1891_js_let_or_const=function (sym,env,lex,state,output,len) {return "const"},
R1930_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],sym[6])},
R1931_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],sym[5])},
R1932_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,sym[5])},
R1933_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],null)},
R1934_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,sym[4])},
R1935_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],null)},
R1936_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,null)},
R1937_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,null)},
R2010_js_arrow_function=function (sym,env,lex,state,output,len) {return new fn.arrow(null,sym[0],sym[2])},
R2100_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail(sym)},
R2101_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([null,...sym[0]])},
R2102_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([sym[0],null,null])},
R2103_js_class_tail=function (sym,env,lex,state,output,len) {return null},
R2130_js_class_element_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1])},
R2140_js_class_element=function (sym,env,lex,state,output,len) {return (sym[1].static = true,sym[1])},
R2210_js_new_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],null)},
R2220_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],sym[2])},
R2280_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(sym[1])},
R2281_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(null)},
R2420_js_element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
R2620_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new env.functions.spread_expr(env,sym.slice(1,3))},
R2621_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env,sym.slice(3,5))),sym[1]) : [sym[0],new env.functions.spread_expr(env,sym.slice(3,5))]},
R2940_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
R2941_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
R2942_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
R2943_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
R2944_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},

    //Sparse Map Lookup
    lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

    //State Action Functions
    state_funct = [(...v)=>((redn(149507,0,...v))),
()=>(374),
()=>(330),
()=>(418),
()=>(38),
()=>(142),
()=>(378),
()=>(238),
()=>(246),
()=>(498),
()=>(490),
()=>(506),
()=>(422),
()=>(414),
()=>(434),
()=>(438),
()=>(442),
()=>(398),
()=>(450),
()=>(454),
()=>(458),
()=>(466),
()=>(462),
()=>(446),
()=>(470),
()=>(474),
()=>(510),
()=>(278),
()=>(382),
()=>(294),
()=>(242),
()=>(226),
()=>(230),
()=>(234),
()=>(250),
()=>(258),
()=>(262),
()=>(366),
()=>(370),
()=>(362),
()=>(354),
()=>(358),
()=>(334),
(...v)=>(redv(5,R00_S,1,0,...v)),
(...v)=>(redn(1031,1,...v)),
(...v)=>(redn(295943,1,...v)),
(...v)=>(redn(296967,1,...v)),
()=>(514),
(...v)=>(redn(299015,1,...v)),
()=>(530),
()=>(558),
()=>(554),
()=>(626),
()=>(630),
()=>(542),
()=>(546),
()=>(550),
()=>(562),
()=>(566),
()=>(570),
()=>(574),
()=>(578),
()=>(582),
()=>(586),
()=>(590),
()=>(594),
()=>(598),
()=>(602),
()=>(606),
()=>(610),
()=>(614),
()=>(618),
()=>(622),
(...v)=>(redv(3079,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(126983,R00_S,1,0,...v)),
(...v)=>(redv(128007,R00_S,1,0,...v)),
(...v)=>(redv(149511,R00_S,1,0,...v)),
(...v)=>(redn(150535,1,...v)),
(...v)=>(rednv(153607,fn.statements,1,0,...v)),
()=>(642),
(...v)=>(redv(152583,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(151559,1,...v)),
(...v)=>(redn(154631,1,...v)),
(...v)=>(redn(155655,1,...v)),
(...v)=>(redn(159751,1,...v)),
()=>(650),
(...v)=>(rednv(224263,fn.expression_list,1,0,...v)),
()=>(654),
(...v)=>(redv(223239,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(222215,1,...v)),
(...v)=>(redn(250887,1,...v)),
(...v)=>(redn(266247,1,...v)),
()=>(658),
()=>(710),
()=>(674),
()=>(678),
()=>(682),
()=>(686),
()=>(690),
()=>(694),
()=>(698),
()=>(702),
()=>(706),
()=>(714),
()=>(718),
()=>(666),
()=>(670),
(...v)=>(redn(252935,1,...v)),
()=>(726),
()=>(722),
(...v)=>(redn(253959,1,...v)),
()=>(730),
(...v)=>(redn(254983,1,...v)),
()=>(734),
(...v)=>(redn(256007,1,...v)),
()=>(738),
(...v)=>(redn(257031,1,...v)),
()=>(742),
(...v)=>(redn(258055,1,...v)),
()=>(746),
()=>(750),
()=>(754),
()=>(758),
(...v)=>(redn(259079,1,...v)),
()=>(762),
()=>(766),
()=>(770),
()=>(782),
()=>(774),
()=>(778),
(...v)=>(redn(260103,1,...v)),
()=>(786),
()=>(790),
()=>(794),
(...v)=>(redn(261127,1,...v)),
()=>(798),
()=>(802),
(...v)=>(redn(262151,1,...v)),
()=>(810),
()=>(814),
()=>(806),
(...v)=>(redn(263175,1,...v)),
(...v)=>(redn(264199,1,...v)),
(...v)=>(redn(265223,1,...v)),
()=>(818),
()=>(854),
()=>(850),
(...v)=>(redn(225287,1,...v)),
()=>(910),
()=>(898),
()=>(906),
(...v)=>(redn(226311,1,...v)),
()=>(918),
()=>(914),
()=>(934),
()=>(938),
(...v)=>(redn(227335,1,...v)),
(...v)=>(rednv(237575,fn.this_literal,1,0,...v)),
(...v)=>(redn(237575,1,...v)),
(...v)=>(redn(206855,1,...v)),
(...v)=>(redn(290823,1,...v)),
(...v)=>(redn(289799,1,...v)),
(...v)=>(redn(291847,1,...v)),
(...v)=>(redn(292871,1,...v)),
(...v)=>(rednv(294919,fn.identifier,1,0,...v)),
(...v)=>(redn(293895,1,...v)),
(...v)=>(redv(293895,R00_S,1,0,...v)),
(...v)=>(redn(280583,1,...v)),
(...v)=>(rednv(288775,fn.bool_literal,1,0,...v)),
(...v)=>(rednv(287751,fn.null_literal,1,0,...v)),
()=>(970),
()=>(962),
()=>(958),
()=>(978),
()=>(982),
()=>(974),
()=>(966),
()=>(950),
()=>(1010),
()=>(1002),
()=>(998),
()=>(1018),
()=>(1022),
()=>(1014),
()=>(1006),
()=>(990),
(...v)=>(rednv(286727,fn.numeric_literal,1,0,...v)),
()=>(1026),
()=>(1034),
()=>(1042),
()=>(1046),
(...v)=>(redn(229383,1,...v)),
(...v)=>(redn(231431,1,...v)),
()=>(1058),
()=>(1066),
()=>(1098),
()=>(1102),
(...v)=>(rednv(161799,C1580_js_empty_statement,1,0,...v)),
()=>(1106),
(...v)=>(redn(158727,1,...v)),
()=>(1114),
(...v)=>(shftf(1118,I1641_js_iteration_statement,...v)),
()=>(1122),
()=>(1126),
()=>(1130),
()=>(1142),
()=>(1150),
()=>(1158),
()=>(1170),
(...v)=>(redn(156679,1,...v)),
()=>(1186),
()=>(1190),
(...v)=>(redn(157703,1,...v)),
()=>(1198),
(...v)=>(redv(193543,R1890_js_let_or_const,1,0,...v)),
(...v)=>(redv(193543,R1891_js_let_or_const,1,0,...v)),
(...v)=>(redv(155659,R00_S,2,0,...v)),
(...v)=>(redv(296971,R40_html_BODY,2,0,...v)),
(...v)=>(redv(3083,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(299019,R60_html_ATTRIBUTE_BODY,2,0,...v)),
()=>(1218),
()=>(1250),
()=>(1230),
()=>(1226),
()=>(1246),
()=>(1242),
()=>(1262),
()=>(1258),
()=>(1270),
()=>(1278),
()=>(1294),
()=>(1298),
()=>(1290),
(...v)=>(redn(302087,1,...v)),
(...v)=>(redn(308231,1,...v)),
(...v)=>(redv(152587,R30_IMPORT_TAG_list,2,0,...v)),
()=>(1306),
(...v)=>(rednv(162827,fn.expression_statement,2,0,...v)),
(...v)=>(rednv(266251,fn.post_increment_expression,2,0,...v)),
(...v)=>(rednv(266251,fn.post_decrement_expression,2,0,...v)),
(...v)=>(redn(251911,1,...v)),
(...v)=>(rednv(265227,fn.delete_expression,2,0,...v)),
(...v)=>(rednv(237575,fn.array_literal,1,0,...v)),
(...v)=>(rednv(237575,fn.object_literal,1,0,...v)),
()=>(1446),
()=>(1430),
()=>(1442),
()=>(1454),
()=>(1458),
()=>(1514),
()=>(1490),
()=>(1494),
()=>(1478),
(...v)=>(redn(196615,1,...v)),
(...v)=>(redn(212999,1,...v)),
(...v)=>(rednv(265227,fn.void_expression,2,0,...v)),
(...v)=>(rednv(265227,fn.typeof_expression,2,0,...v)),
(...v)=>(rednv(265227,fn.plus_expression,2,0,...v)),
(...v)=>(rednv(265227,fn.negate_expression,2,0,...v)),
(...v)=>(rednv(265227,fn.unary_or_expression,2,0,...v)),
(...v)=>(rednv(265227,fn.unary_not_expression,2,0,...v)),
(...v)=>(rednv(266251,fn.pre_increment_expression,2,0,...v)),
(...v)=>(rednv(266251,fn.pre_decrement_expression,2,0,...v)),
(...v)=>(rednv(231435,fn.call_expression,2,0,...v)),
()=>(1530),
()=>(1534),
()=>(1550),
(...v)=>(rednv(211979,fn.call_expression,2,0,...v)),
(...v)=>(redv(226315,R2210_js_new_expression,2,0,...v)),
()=>(1566),
(...v)=>(redv(293899,R640_css_general_enclosed6202_group_list,2,0,...v)),
()=>(1570),
(...v)=>(rednv(285707,fn.string_literal,2,0,...v)),
(...v)=>(redv(282631,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(281607,1,...v)),
()=>(1578),
(...v)=>(redv(284679,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(283655,1,...v)),
(...v)=>(redv(268299,R2103_js_class_tail,2,0,...v)),
()=>(1590),
()=>(1586),
(...v)=>(redn(232459,2,...v)),
(...v)=>(rednv(267275,fn.await_expression,2,0,...v)),
()=>(1618),
(...v)=>(rednv(181259,fn.label_statement,2,0,...v)),
()=>(1634),
()=>(1638),
(...v)=>(redv(190471,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(191495,fn.binding,1,0,...v)),
()=>(1646),
(...v)=>(redn(269319,1,...v)),
()=>(1654),
()=>(1666),
()=>(1686),
()=>(1702),
()=>(1726),
()=>(1746),
()=>(1758),
()=>(1774),
(...v)=>(rednv(171019,fn.continue_statement,2,0,...v)),
()=>(1782),
(...v)=>(rednv(172043,fn.break_statement,2,0,...v)),
()=>(1786),
(...v)=>(rednv(173067,fn.return_statement,2,0,...v)),
()=>(1790),
()=>(1798),
()=>(1810),
()=>(1814),
(...v)=>(rednv(188427,fn.debugger_statement,2,0,...v)),
(...v)=>(rednv(214027,fn.class_statement,2,0,...v)),
()=>(1822),
()=>(1850),
()=>(1830),
()=>(1846),
()=>(1866),
()=>(1874),
()=>(1898),
()=>(1902),
(...v)=>(redv(194567,R31_IMPORT_TAG_list,1,0,...v)),
()=>(1918),
()=>(1914),
()=>(1930),
(...v)=>(shftf(1962,I110_BASIC_BINDING,...v)),
()=>(1966),
(...v)=>(redv(304135,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(305159,fn.attribute,1,0,...v)),
()=>(1970),
()=>(1974),
()=>(1978),
(...v)=>(redn(306183,1,...v)),
()=>(1986),
()=>(1982),
(...v)=>(redv(301071,R2943_html_TAG,3,0,...v)),
()=>(1990),
()=>(1994),
()=>(1998),
()=>(2082),
(...v)=>((redn(18435,0,...v))),
()=>(2046),
()=>(2026),
()=>(2078),
()=>(2090),
()=>(2114),
()=>(2118),
()=>(2122),
()=>(2126),
()=>(2150),
()=>(2158),
()=>(2162),
(...v)=>(redv(310279,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(311303,1,...v)),
()=>(2170),
()=>(2174),
(...v)=>(rednv(160783,fn.block_statement,3,0,...v)),
(...v)=>(redv(223247,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(250895,fn.assignment_expression,3,0,...v)),
()=>(2178),
(...v)=>(rednv(253967,fn.or_expression,3,0,...v)),
(...v)=>(rednv(254991,fn.and_expression,3,0,...v)),
(...v)=>(rednv(256015,fn.bit_or_expression,3,0,...v)),
(...v)=>(rednv(257039,fn.bit_xor_expression,3,0,...v)),
(...v)=>(rednv(258063,fn.bit_and_expression,3,0,...v)),
(...v)=>(rednv(259087,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(260111,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(260111,fn.instanceof_expression,3,0,...v)),
(...v)=>(rednv(260111,fn.in_expression,3,0,...v)),
(...v)=>(rednv(261135,fn.left_shift_expression,3,0,...v)),
(...v)=>(rednv(261135,fn.right_shift_expression,3,0,...v)),
(...v)=>(rednv(261135,fn.right_shift_fill_expression,3,0,...v)),
(...v)=>(rednv(262159,fn.add_expression,3,0,...v)),
(...v)=>(rednv(262159,fn.subtract_expression,3,0,...v)),
(...v)=>(rednv(263183,fn.multiply_expression,3,0,...v)),
(...v)=>(rednv(263183,fn.divide_expression,3,0,...v)),
(...v)=>(rednv(263183,fn.modulo_expression,3,0,...v)),
(...v)=>(rednv(264207,fn.exponent_expression,3,0,...v)),
()=>(2190),
()=>(2186),
()=>(2206),
()=>(2194),
(...v)=>(redv(246795,R2103_js_class_tail,2,0,...v)),
(...v)=>(redv(247815,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(248839,1,...v)),
()=>(2214),
()=>(2218),
()=>(2222),
(...v)=>(redv(239627,R2103_js_class_tail,2,0,...v)),
(...v)=>(redv(238599,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(240647,1,...v)),
()=>(2238),
()=>(2234),
(...v)=>(redn(242695,1,...v)),
(...v)=>(redn(241671,1,...v)),
(...v)=>(rednv(231439,fn.member_expression,3,0,...v)),
()=>(2254),
()=>(2258),
()=>(2262),
()=>(2266),
(...v)=>(redv(233483,R2281_js_arguments,2,0,...v)),
()=>(2270),
(...v)=>(redn(236551,1,...v)),
(...v)=>(redv(235527,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(234503,1,...v)),
()=>(2278),
(...v)=>(rednv(227343,fn.member_expression,3,0,...v)),
(...v)=>(redv(227343,R2220_js_member_expression,3,0,...v)),
(...v)=>(rednv(230415,fn.new_target_expression,3,0,...v)),
(...v)=>(rednv(285711,fn.string_literal,3,0,...v)),
(...v)=>(redv(282635,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(284683,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(268303,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(2282),
()=>(2286),
()=>(2290),
()=>(2294),
(...v)=>(rednv(228367,fn.supper_expression,3,0,...v)),
()=>(2298),
(...v)=>(redv(205839,R2010_js_arrow_function,3,0,...v)),
(...v)=>(redn(207879,1,...v)),
(...v)=>(redv(182283,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redn(183303,1,...v)),
(...v)=>(rednv(189455,fn.variable_statement,3,0,...v)),
(...v)=>(rednv(191499,fn.binding,2,0,...v)),
(...v)=>(redn(270347,2,...v)),
()=>(2318),
()=>(2326),
()=>(2322),
(...v)=>(redn(273415,1,...v)),
(...v)=>(redn(276487,1,...v)),
()=>(2334),
(...v)=>(redn(278535,1,...v)),
(...v)=>(redn(271371,2,...v)),
()=>(2346),
()=>(2354),
()=>(2362),
()=>(2358),
(...v)=>(redn(274439,1,...v)),
(...v)=>(redn(275463,1,...v)),
(...v)=>(redn(277511,1,...v)),
()=>(2378),
()=>(2382),
()=>(2386),
()=>(2390),
()=>(2398),
()=>(2402),
()=>(2410),
()=>(2414),
(...v)=>(redn(164871,1,...v)),
(...v)=>(redn(165895,1,...v)),
(...v)=>(redn(166919,1,...v)),
()=>(2454),
()=>(2466),
(...v)=>(redv(171023,R1670_js_continue_statement,3,0,...v)),
(...v)=>(redv(172047,R1680_js_break_statement,3,0,...v)),
(...v)=>(rednv(173071,fn.return_statement,3,0,...v)),
()=>(2470),
(...v)=>(rednv(174095,fn.throw_statement,3,0,...v)),
(...v)=>(redv(184335,R1800_js_try_statement,3,0,...v)),
(...v)=>(redv(184335,R1801_js_try_statement,3,0,...v)),
()=>(2478),
(...v)=>(rednv(214031,fn.class_statement,3,0,...v)),
()=>(2490),
()=>(2494),
(...v)=>(redv(215051,R2103_js_class_tail,2,0,...v)),
(...v)=>(redn(217095,1,...v)),
(...v)=>(redv(218119,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(219143,1,...v)),
(...v)=>(redv(216075,R60_html_ATTRIBUTE_BODY,2,0,...v)),
()=>(2510),
()=>(2514),
()=>(2518),
(...v)=>(redn(199687,1,...v)),
()=>(2522),
(...v)=>(redn(201735,1,...v)),
(...v)=>(redv(200711,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(202759,1,...v)),
(...v)=>(rednv(192527,fn.lexical,3,0,...v)),
(...v)=>(rednv(195595,fn.binding,2,0,...v)),
()=>(2534),
()=>(2538),
(...v)=>(redv(304139,R30_IMPORT_TAG_list,2,0,...v)),
()=>(2542),
(...v)=>(redv(303111,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(303111,R2103_js_class_tail,1,0,...v)),
(...v)=>(rednv(309255,fn.text,1,0,...v)),
(...v)=>(redn(10247,1,...v)),
(...v)=>(redv(301075,R2943_html_TAG,4,0,...v)),
()=>(2570),
()=>(2578),
()=>(2582),
()=>(2586),
()=>(2590),
(...v)=>(redv(301075,R2940_html_TAG,4,0,...v)),
()=>(2594),
()=>(2598),
()=>(2610),
(...v)=>(redn(13319,1,...v)),
(...v)=>(redn(18439,1,...v)),
(...v)=>(redv(15367,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(14343,1,...v)),
()=>(2630),
()=>(2634),
()=>(2646),
()=>(2642),
()=>(2638),
(...v)=>(redv(17415,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(16391,1,...v)),
()=>(2654),
()=>(2650),
()=>(2678),
(...v)=>(redv(19463,R31_IMPORT_TAG_list,1,0,...v)),
()=>(2698),
(...v)=>(redv(95239,R930_css_COMPLEX_SELECTOR,1,0,...v)),
()=>(2702),
()=>(2706),
()=>(2710),
(...v)=>(rednv(100359,fn.compoundSelector,1,0,...v)),
()=>(2734),
(...v)=>(rednv(102407,fn.selector,1,0,...v)),
()=>(2742),
()=>(2738),
(...v)=>(redn(103431,1,...v)),
(...v)=>(redn(105479,1,...v)),
()=>(2746),
(...v)=>(redn(104455,1,...v)),
(...v)=>(redv(96263,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(106503,1,...v)),
()=>(2750),
()=>(2754),
()=>(2766),
()=>(2770),
()=>(2778),
(...v)=>(redv(99335,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(98311,1,...v)),
()=>(2790),
()=>(2794),
()=>(2798),
()=>(2806),
()=>(2810),
()=>(2814),
(...v)=>(redv(300051,R2103_js_class_tail,4,0,...v)),
(...v)=>(redv(310283,R640_css_general_enclosed6202_group_list,2,0,...v)),
()=>(2818),
(...v)=>(rednv(5139,fn.element_selector,4,0,...v)),
()=>(2826),
(...v)=>(redv(246799,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(246799,R2103_js_class_tail,3,0,...v)),
(...v)=>(redv(247819,R2420_js_element_list,2,0,...v)),
(...v)=>(redn(248843,2,...v)),
(...v)=>(rednv(249867,fn.spread_element,2,0,...v)),
()=>(2842),
(...v)=>(redv(239631,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(239631,R2103_js_class_tail,3,0,...v)),
(...v)=>(rednv(244747,fn.binding,2,0,...v)),
(...v)=>(rednv(240651,fn.spread_expr,2,0,...v)),
()=>(2862),
()=>(2866),
()=>(2870),
(...v)=>(rednv(231443,fn.call_expression,4,0,...v)),
()=>(2874),
(...v)=>(redv(233487,R2280_js_arguments,3,0,...v)),
(...v)=>(redv(233487,R2281_js_arguments,3,0,...v)),
(...v)=>(rednv(234507,fn.spread_element,2,0,...v)),
(...v)=>(rednv(227347,fn.member_expression,4,0,...v)),
(...v)=>(redv(268307,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(268307,R2620_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv(228371,fn.supper_expression,4,0,...v)),
()=>(2890),
(...v)=>(redn(204807,1,...v)),
(...v)=>(redv(190479,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(245771,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redn(270351,3,...v)),
()=>(2898),
(...v)=>(redn(272395,2,...v)),
(...v)=>(redn(278539,2,...v)),
()=>(2910),
(...v)=>(redn(271375,3,...v)),
(...v)=>(redn(275467,2,...v)),
()=>(2914),
(...v)=>(redn(279563,2,...v)),
(...v)=>(redn(277515,2,...v)),
()=>(2946),
()=>(2950),
()=>(2958),
()=>(2966),
(...v)=>(shftf(2974,I1642_js_iteration_statement,...v)),
(...v)=>(redv(164875,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redv(165899,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redv(166923,R60_html_ATTRIBUTE_BODY,2,0,...v)),
(...v)=>(redn(169991,1,...v)),
(...v)=>(redn(168971,2,...v)),
()=>(2982),
()=>(3002),
(...v)=>(redv(184339,R1802_js_try_statement,4,0,...v)),
(...v)=>(rednv(186379,fn.finally_statement,2,0,...v)),
()=>(3022),
(...v)=>(redv(215055,R2102_js_class_tail,3,0,...v)),
(...v)=>(redv(215055,R2101_js_class_tail,3,0,...v)),
(...v)=>(redv(218123,R2130_js_class_element_list,2,0,...v)),
(...v)=>(redv(219147,R2140_js_class_element,2,0,...v)),
()=>(3026),
()=>(3030),
()=>(3034),
()=>(3042),
(...v)=>(redv(199691,R31_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(194575,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(3058),
(...v)=>(redv(301079,R2940_html_TAG,5,0,...v)),
(...v)=>(redv(303115,R30_IMPORT_TAG_list,2,0,...v)),
()=>(3070),
()=>(3078),
()=>(3074),
(...v)=>(rednv(305167,fn.attribute,3,0,...v)),
(...v)=>(redn(307207,1,...v)),
()=>(3102),
()=>(3106),
()=>(3126),
()=>(3122),
()=>(3118),
()=>(3114),
()=>(3110),
(...v)=>(redv(306191,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(3138),
()=>(3142),
()=>(3146),
(...v)=>(redn(18443,2,...v)),
(...v)=>(redv(15371,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(17419,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(23563,2,...v)),
()=>(3158),
()=>(3178),
()=>(3170),
()=>(3174),
()=>(3238),
()=>(3226),
()=>(3222),
()=>(3242),
()=>(3250),
()=>(3294),
()=>(3290),
()=>(3270),
()=>(3262),
()=>(3306),
()=>(3310),
(...v)=>(redv(120839,R1180_css_declaration_list,1,0,...v)),
()=>(3330),
(...v)=>(redv(120839,R1181_css_declaration_list,1,0,...v)),
(...v)=>(redv(117767,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(116743,1,...v)),
()=>(3334),
(...v)=>(redv(95243,R930_css_COMPLEX_SELECTOR,2,0,...v)),
(...v)=>(redv(94215,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(93191,fn.comboSelector,1,0,...v)),
(...v)=>(redn(101383,1,...v)),
(...v)=>(rednv(100363,fn.compoundSelector,2,0,...v)),
(...v)=>(redv(96267,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(99339,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(rednv(102411,fn.selector,2,0,...v)),
(...v)=>(redn(105483,2,...v)),
(...v)=>(redn(104459,2,...v)),
(...v)=>(rednv(107531,fn.idSelector,2,0,...v)),
(...v)=>(rednv(108555,fn.classSelector,2,0,...v)),
()=>(3374),
()=>(3358),
()=>(3350),
()=>(3362),
()=>(3366),
()=>(3370),
(...v)=>(rednv(114699,fn.pseudoClassSelector,2,0,...v)),
()=>(3382),
(...v)=>(rednv(115723,fn.pseudoElementSelector,2,0,...v)),
(...v)=>(redn(98315,2,...v)),
(...v)=>(redv(97287,R31_IMPORT_TAG_list,1,0,...v)),
()=>(3390),
()=>(3394),
()=>(3398),
()=>(3402),
(...v)=>(rednv(5143,fn.element_selector,5,0,...v)),
(...v)=>(rednv(252951,fn.condition_expression,5,0,...v)),
(...v)=>(redv(246803,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(247823,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(239635,R60_html_ATTRIBUTE_BODY,4,0,...v)),
(...v)=>(redv(238607,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(240655,fn.property_binding,3,0,...v)),
()=>(3410),
(...v)=>(redn(198663,1,...v)),
()=>(3414),
(...v)=>(redv(243727,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(233491,R2280_js_arguments,4,0,...v)),
(...v)=>(redv(235535,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(3426),
()=>(3430),
(...v)=>(redv(207887,R60_html_ATTRIBUTE_BODY,3,0,...v)),
()=>(3434),
(...v)=>(redn(270355,4,...v)),
(...v)=>(redn(273423,3,...v)),
(...v)=>(redn(276495,3,...v)),
(...v)=>(redn(271379,4,...v)),
()=>(3438),
()=>(3446),
(...v)=>(redn(274447,3,...v)),
(...v)=>(rednv(163863,fn.if_statement,5,0,...v)),
()=>(3450),
()=>(3454),
(...v)=>(rednv(167959,fn.while_statement,5,0,...v)),
()=>(3458),
(...v)=>(shftf(3466,I1642_js_iteration_statement,...v)),
()=>(3474),
()=>(3478),
()=>(3486),
(...v)=>(shftf(3494,I1642_js_iteration_statement,...v)),
(...v)=>(shftf(3498,I1642_js_iteration_statement,...v)),
()=>(3506),
(...v)=>(rednv(176151,fn.switch_statement,5,0,...v)),
()=>(3514),
()=>(3534),
()=>(3530),
(...v)=>(rednv(175127,fn.with_statement,5,0,...v)),
()=>(3538),
(...v)=>(redn(187399,1,...v)),
(...v)=>(redv(215059,R2100_js_class_tail,4,0,...v)),
()=>(3542),
()=>(3550),
()=>(3558),
()=>(3562),
(...v)=>(redv(197655,R1937_js_function_declaration,5,0,...v)),
(...v)=>(redn(203783,1,...v)),
(...v)=>(redv(199695,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(200719,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(3570),
()=>(3574),
(...v)=>(redv(301083,R2943_html_TAG,6,0,...v)),
(...v)=>(rednv(11279,fn.wick_binding,3,0,...v)),
()=>(3582),
()=>(3586),
(...v)=>(redn(315399,1,...v)),
(...v)=>(redv(314375,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(313351,1,...v)),
(...v)=>(redn(316423,1,...v)),
()=>(3594),
()=>(3598),
(...v)=>(redv(301083,R2944_html_TAG,6,0,...v)),
()=>(3602),
()=>(3606),
()=>(3614),
(...v)=>(redn(29711,3,...v)),
()=>(3626),
(...v)=>(redv(24583,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(25607,1,...v)),
()=>(3638),
()=>(3650),
()=>(3666),
()=>(3662),
(...v)=>(redv(47111,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(51207,1,...v)),
()=>(3674),
()=>(3682),
(...v)=>(redn(53255,1,...v)),
(...v)=>(redn(52231,1,...v)),
()=>(3698),
()=>(3706),
()=>(3750),
()=>(3722),
()=>(3726),
(...v)=>(redn(61447,1,...v)),
(...v)=>(redn(80903,1,...v)),
()=>(3762),
(...v)=>(redn(49159,1,...v)),
()=>(3766),
(...v)=>(redn(32775,1,...v)),
()=>(3770),
(...v)=>(redn(41991,1,...v)),
()=>(3790),
()=>(3798),
()=>(3810),
(...v)=>(redn(43015,1,...v)),
(...v)=>(redn(44039,1,...v)),
()=>(3814),
()=>(3818),
()=>(3822),
(...v)=>(redv(19471,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(3826),
(...v)=>(rednv(20495,C200_css_RULE_SET,3,0,...v)),
(...v)=>(redv(120843,R1182_css_declaration_list,2,0,...v)),
(...v)=>(redv(120843,R1183_css_declaration_list,2,0,...v)),
()=>(3830),
(...v)=>(redv(119815,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(118791,1,...v)),
(...v)=>(redv(120843,R1180_css_declaration_list,2,0,...v)),
()=>(3854),
()=>(3858),
()=>(3846),
(...v)=>(redv(94219,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(93195,fn.comboSelector,2,0,...v)),
(...v)=>(rednv(100367,fn.compoundSelector,3,0,...v)),
(...v)=>(rednv(110607,fn.attribSelector,3,0,...v)),
()=>(3866),
()=>(3870),
()=>(3874),
(...v)=>(redn(111623,1,...v)),
(...v)=>(rednv(114703,fn.pseudoClassSelector,3,0,...v)),
(...v)=>(redv(97291,R30_IMPORT_TAG_list,2,0,...v)),
()=>(3882),
()=>(3886),
()=>(3890),
(...v)=>(redv(247827,R190_css_COMPLEX_SELECTOR_list,4,0,...v)),
()=>(3894),
()=>(3898),
()=>(3902),
(...v)=>(redn(221191,1,...v)),
(...v)=>(redv(268315,R2621_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
(...v)=>(redn(270359,5,...v)),
(...v)=>(redn(271383,5,...v)),
()=>(3906),
()=>(3914),
(...v)=>(shftf(3922,I1642_js_iteration_statement,...v)),
(...v)=>(shftf(3926,I1642_js_iteration_statement,...v)),
()=>(3934),
(...v)=>(redv(167963,R16414_js_iteration_statement,6,0,...v)),
(...v)=>(shftf(3950,I1642_js_iteration_statement,...v)),
(...v)=>(redv(167963,R16415_js_iteration_statement,6,0,...v)),
()=>(3966),
(...v)=>(redv(177163,R1730_js_case_block,2,0,...v)),
()=>(3974),
()=>(3986),
(...v)=>(redv(178183,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(180231,R1761_js_default_clause,1,0,...v)),
()=>(3994),
()=>(4006),
()=>(4010),
(...v)=>(redv(197659,R1936_js_function_declaration,6,0,...v)),
()=>(4014),
(...v)=>(redv(197659,R1935_js_function_declaration,6,0,...v)),
(...v)=>(redv(197659,R1934_js_function_declaration,6,0,...v)),
()=>(4018),
(...v)=>(redv(301087,R2940_html_TAG,7,0,...v)),
(...v)=>(redv(301087,R2942_html_TAG,7,0,...v)),
()=>(4022),
(...v)=>(redv(307215,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(312335,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(314379,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(301087,R2941_html_TAG,7,0,...v)),
()=>(4026),
(...v)=>(redn(29715,4,...v)),
(...v)=>(redv(24587,R30_IMPORT_TAG_list,2,0,...v)),
()=>(4042),
()=>(4046),
(...v)=>(redv(89095,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(88071,1,...v)),
()=>(4054),
(...v)=>(redv(91143,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(90119,1,...v)),
(...v)=>(redn(87051,2,...v)),
(...v)=>(redn(86023,1,...v)),
(...v)=>((redn(22531,0,...v))),
(...v)=>(redn(51211,2,...v)),
(...v)=>(redn(57355,2,...v)),
(...v)=>(redn(60427,2,...v)),
(...v)=>(redv(56327,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(59399,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(54283,2,...v)),
()=>(4106),
()=>(4110),
()=>(4130),
()=>(4126),
(...v)=>(redn(79879,1,...v)),
()=>(4118),
(...v)=>(redn(62471,1,...v)),
()=>(4142),
()=>(4146),
()=>(4150),
()=>(4154),
()=>(4134),
()=>(4170),
()=>(4174),
()=>(4178),
()=>(4182),
(...v)=>(redn(77831,1,...v)),
()=>(4190),
()=>(4194),
()=>(4198),
()=>(4202),
()=>(4222),
()=>(4218),
()=>(4210),
()=>(4254),
()=>(4242),
()=>(4246),
(...v)=>(redn(41995,2,...v)),
(...v)=>(redv(38919,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(40967,R31_IMPORT_TAG_list,1,0,...v)),
()=>(4278),
()=>(4282),
()=>(4290),
(...v)=>(rednv(20499,C200_css_RULE_SET,4,0,...v)),
(...v)=>(redv(120847,R1183_css_declaration_list,3,0,...v)),
(...v)=>(redv(117775,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(122895,fn.parseDeclaration,3,0,...v)),
()=>(4306),
(...v)=>(redn(125959,1,...v)),
(...v)=>(redv(124935,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(123911,1,...v)),
()=>(4322),
()=>(4326),
()=>(4330),
(...v)=>(redn(109575,1,...v)),
(...v)=>(redn(111627,2,...v)),
()=>(4334),
()=>(4338),
()=>(4350),
(...v)=>(redn(271387,6,...v)),
(...v)=>(rednv(163871,fn.if_statement,7,0,...v)),
(...v)=>(rednv(167967,fn.do_while_statement,7,0,...v)),
(...v)=>(shftf(4354,I1642_js_iteration_statement,...v)),
(...v)=>(redv(167967,R16413_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R1649_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R1648_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R1644_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R16412_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R16411_js_iteration_statement,7,0,...v)),
(...v)=>(redv(167967,R16410_js_iteration_statement,7,0,...v)),
()=>(4382),
(...v)=>(redv(177167,R60_html_ATTRIBUTE_BODY,3,0,...v)),
(...v)=>(redv(178187,R1740_js_case_clauses,2,0,...v)),
()=>(4386),
()=>(4390),
(...v)=>(rednv(185367,fn.catch_statement,5,0,...v)),
()=>(4398),
(...v)=>(redv(197663,R1933_js_function_declaration,7,0,...v)),
(...v)=>(redv(197663,R1932_js_function_declaration,7,0,...v)),
(...v)=>(redv(197663,R1931_js_function_declaration,7,0,...v)),
(...v)=>(redv(301091,R90_html_TAG,8,0,...v)),
(...v)=>(rednv(12311,fn.wick_binding,5,0,...v)),
(...v)=>(redn(29719,5,...v)),
()=>(4418),
(...v)=>(redn(92175,3,...v)),
(...v)=>(redv(89099,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redv(91147,R640_css_general_enclosed6202_group_list,2,0,...v)),
()=>(4422),
(...v)=>(redn(22535,1,...v)),
(...v)=>(redv(21511,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(47119,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(51215,3,...v)),
(...v)=>(redn(50187,2,...v)),
(...v)=>(redv(56331,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(59403,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(55307,2,...v)),
(...v)=>(redn(58379,2,...v)),
(...v)=>(redn(61455,3,...v)),
(...v)=>(redn(63503,3,...v)),
()=>(4430),
(...v)=>(redn(68623,3,...v)),
(...v)=>(redv(67591,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(66567,1,...v)),
()=>(4446),
(...v)=>(redn(70663,1,...v)),
()=>(4454),
()=>(4462),
()=>(4466),
(...v)=>(redn(71687,1,...v)),
()=>(4470),
(...v)=>(redn(85003,2,...v)),
()=>(4474),
(...v)=>(redn(83975,1,...v)),
()=>(4478),
(...v)=>(redv(65543,R641_css_general_enclosed6202_group_list,1,0,...v)),
(...v)=>(redn(64519,1,...v)),
()=>(4486),
(...v)=>(redv(30727,R31_IMPORT_TAG_list,1,0,...v)),
()=>(4498),
()=>(4494),
(...v)=>(redv(33799,R31_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(35847,1,...v)),
()=>(4502),
()=>(4506),
(...v)=>(redv(38923,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(40971,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(37899,2,...v)),
(...v)=>(redn(39947,2,...v)),
(...v)=>(redn(43023,3,...v)),
(...v)=>(redn(45071,3,...v)),
()=>(4510),
(...v)=>(rednv(20503,C200_css_RULE_SET,5,0,...v)),
(...v)=>(redv(119823,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(122899,fn.parseDeclaration,4,0,...v)),
(...v)=>(redv(125963,R1230_css_declaration_values,2,0,...v)),
()=>(4514),
(...v)=>(redv(124939,R640_css_general_enclosed6202_group_list,2,0,...v)),
()=>(4518),
()=>(4522),
(...v)=>(rednv(110615,fn.attribSelector,5,0,...v)),
(...v)=>(redn(112647,1,...v)),
(...v)=>(redn(113679,3,...v)),
()=>(4526),
()=>(4530),
(...v)=>(redv(167971,R1647_js_iteration_statement,8,0,...v)),
(...v)=>(redv(167971,R1646_js_iteration_statement,8,0,...v)),
(...v)=>(redv(167971,R1643_js_iteration_statement,8,0,...v)),
(...v)=>(redv(167971,R1645_js_iteration_statement,8,0,...v)),
()=>(4542),
(...v)=>(redv(177171,R1732_js_case_block,4,0,...v)),
(...v)=>(redv(179215,R1751_js_case_clause,3,0,...v)),
(...v)=>(redv(180239,R1760_js_default_clause,3,0,...v)),
(...v)=>(redv(197667,R1930_js_function_declaration,8,0,...v)),
(...v)=>(redn(29723,6,...v)),
()=>(4550),
(...v)=>(redn(26631,1,...v)),
(...v)=>(redn(48155,6,...v)),
(...v)=>(redv(21515,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(68627,4,...v)),
(...v)=>(redv(67595,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(redn(69647,3,...v)),
(...v)=>(redn(76815,3,...v)),
(...v)=>(redn(70667,2,...v)),
()=>(4558),
()=>(4566),
()=>(4570),
(...v)=>(redn(71691,2,...v)),
(...v)=>(redn(81935,3,...v)),
(...v)=>(redv(65547,R640_css_general_enclosed6202_group_list,2,0,...v)),
(...v)=>(rednv(31771,C310_css_keyframes,6,0,...v)),
(...v)=>(redv(30731,R30_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(82955,2,...v)),
(...v)=>(redn(36891,6,...v)),
(...v)=>(redn(46099,4,...v)),
(...v)=>(redn(121867,2,...v)),
(...v)=>(redv(125967,R1230_css_declaration_values,3,0,...v)),
(...v)=>(rednv(110619,fn.attribSelector,6,0,...v)),
(...v)=>(rednv(220191,fn.class_method,7,0,...v)),
(...v)=>(rednv(220191,fn.class_get_method,7,0,...v)),
()=>(4582),
(...v)=>(redv(167975,R1640_js_iteration_statement,9,0,...v)),
(...v)=>(redv(177175,R1731_js_case_block,5,0,...v)),
(...v)=>(redv(179219,R1750_js_case_clause,4,0,...v)),
(...v)=>(redn(27667,4,...v)),
(...v)=>(redn(73735,1,...v)),
()=>(4590),
(...v)=>(redn(75783,1,...v)),
()=>(4598),
()=>(4602),
(...v)=>(redv(33807,R190_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(220195,fn.class_set_method,8,0,...v)),
(...v)=>(redn(76823,5,...v)),
(...v)=>(redn(73739,2,...v)),
()=>(4606),
(...v)=>(rednv(34835,C340_css_keyframes_blocks,4,0,...v)),
(...v)=>(rednv(34839,C340_css_keyframes_blocks,5,0,...v))],

    //Goto Lookup Functions
    goto = [v=>lsm(v,gt0),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt1),
nf,
v=>lsm(v,gt2),
v=>lsm(v,gt3),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt4),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt5),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt6),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt7),
v=>lsm(v,gt8),
v=>lsm(v,gt9),
v=>lsm(v,gt10),
v=>lsm(v,gt11),
v=>lsm(v,gt12),
v=>lsm(v,gt13),
nf,
v=>lsm(v,gt14),
v=>lsm(v,gt15),
nf,
v=>lsm(v,gt16),
v=>lsm(v,gt17),
v=>lsm(v,gt18),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt19),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt20),
v=>lsm(v,gt21),
nf,
v=>lsm(v,gt22),
v=>lsm(v,gt23),
nf,
nf,
nf,
v=>lsm(v,gt24),
nf,
nf,
v=>lsm(v,gt25),
v=>lsm(v,gt26),
nf,
nf,
nf,
nf,
v=>lsm(v,gt27),
nf,
nf,
nf,
v=>lsm(v,gt28),
v=>lsm(v,gt29),
v=>lsm(v,gt30),
nf,
v=>lsm(v,gt31),
v=>lsm(v,gt32),
nf,
nf,
nf,
nf,
v=>lsm(v,gt33),
nf,
v=>lsm(v,gt34),
v=>lsm(v,gt35),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt3),
v=>lsm(v,gt36),
v=>lsm(v,gt37),
v=>lsm(v,gt38),
v=>lsm(v,gt39),
v=>lsm(v,gt40),
v=>lsm(v,gt41),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt3),
nf,
nf,
v=>lsm(v,gt42),
v=>lsm(v,gt43),
v=>lsm(v,gt44),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
v=>lsm(v,gt68),
v=>lsm(v,gt69),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt70),
v=>lsm(v,gt71),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt72),
nf,
v=>lsm(v,gt73),
v=>lsm(v,gt74),
v=>lsm(v,gt75),
v=>lsm(v,gt76),
nf,
nf,
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
nf,
nf,
nf,
v=>lsm(v,gt79),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt80),
nf,
v=>lsm(v,gt81),
v=>lsm(v,gt82),
nf,
nf,
v=>lsm(v,gt83),
nf,
v=>lsm(v,gt84),
nf,
nf,
v=>lsm(v,gt85),
v=>lsm(v,gt86),
nf,
nf,
nf,
v=>lsm(v,gt87),
v=>lsm(v,gt88),
v=>lsm(v,gt89),
nf,
v=>lsm(v,gt90),
v=>lsm(v,gt91),
nf,
v=>lsm(v,gt92),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt93),
nf,
v=>lsm(v,gt94),
nf,
v=>lsm(v,gt95),
nf,
nf,
v=>lsm(v,gt96),
v=>lsm(v,gt97),
nf,
v=>lsm(v,gt98),
nf,
nf,
v=>lsm(v,gt99),
v=>lsm(v,gt100),
nf,
v=>lsm(v,gt101),
v=>lsm(v,gt102),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt101),
nf,
nf,
v=>lsm(v,gt101),
v=>lsm(v,gt103),
v=>lsm(v,gt101),
v=>lsm(v,gt104),
v=>lsm(v,gt105),
nf,
nf,
nf,
nf,
v=>lsm(v,gt101),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt106),
v=>lsm(v,gt107),
nf,
nf,
nf,
v=>lsm(v,gt108),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt109),
nf,
v=>lsm(v,gt110),
nf,
nf,
v=>lsm(v,gt111),
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
v=>lsm(v,gt114),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
nf,
nf,
nf,
nf,
v=>lsm(v,gt116),
nf,
v=>lsm(v,gt117),
nf,
nf,
nf,
nf,
v=>lsm(v,gt118),
nf,
nf,
nf,
v=>lsm(v,gt119),
nf,
v=>lsm(v,gt120),
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
v=>lsm(v,gt123),
nf,
v=>lsm(v,gt124),
nf,
nf,
v=>lsm(v,gt125),
v=>lsm(v,gt6),
v=>lsm(v,gt126),
nf,
v=>lsm(v,gt127),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt128),
nf,
nf,
v=>lsm(v,gt129),
nf,
v=>lsm(v,gt130),
nf,
nf,
v=>lsm(v,gt131),
nf,
nf,
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
nf,
nf,
nf,
v=>lsm(v,gt134),
nf,
nf,
v=>lsm(v,gt135),
nf,
nf,
v=>lsm(v,gt136),
v=>lsm(v,gt137),
nf,
nf,
nf,
v=>lsm(v,gt105),
nf,
nf,
nf,
v=>lsm(v,gt138),
nf,
v=>lsm(v,gt139),
nf,
nf,
nf,
nf,
v=>lsm(v,gt140),
nf,
v=>lsm(v,gt141),
nf,
nf,
v=>lsm(v,gt142),
v=>lsm(v,gt143),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt144),
nf,
v=>lsm(v,gt145),
v=>lsm(v,gt146),
v=>lsm(v,gt147),
v=>lsm(v,gt148),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt149),
v=>lsm(v,gt150),
nf,
v=>lsm(v,gt151),
nf,
nf,
nf,
v=>lsm(v,gt152),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt153),
nf,
nf,
v=>lsm(v,gt154),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt155),
nf,
nf,
nf,
nf,
v=>lsm(v,gt156),
v=>lsm(v,gt157),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt158),
nf,
nf,
nf,
v=>lsm(v,gt159),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt160),
nf,
v=>lsm(v,gt161),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt162),
nf,
nf,
nf,
v=>lsm(v,gt163),
v=>lsm(v,gt164),
v=>lsm(v,gt165),
v=>lsm(v,gt166),
nf,
v=>lsm(v,gt167),
v=>lsm(v,gt168),
nf,
v=>lsm(v,gt169),
v=>lsm(v,gt170),
nf,
nf,
v=>lsm(v,gt85),
v=>lsm(v,gt86),
nf,
v=>lsm(v,gt99),
v=>lsm(v,gt100),
nf,
nf,
v=>lsm(v,gt171),
nf,
v=>lsm(v,gt172),
v=>lsm(v,gt173),
v=>lsm(v,gt174),
nf,
v=>lsm(v,gt175),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt176),
v=>lsm(v,gt177),
nf,
v=>lsm(v,gt136),
v=>lsm(v,gt178),
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
v=>lsm(v,gt180),
v=>lsm(v,gt181),
nf,
nf,
v=>lsm(v,gt182),
nf,
nf,
nf,
nf,
v=>lsm(v,gt143),
nf,
nf,
nf,
nf,
v=>lsm(v,gt183),
v=>lsm(v,gt184),
v=>lsm(v,gt185),
v=>lsm(v,gt186),
v=>lsm(v,gt187),
v=>lsm(v,gt188),
v=>lsm(v,gt189),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt190),
nf,
v=>lsm(v,gt191),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt192),
v=>lsm(v,gt148),
v=>lsm(v,gt148),
nf,
nf,
v=>lsm(v,gt150),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt193),
nf,
nf,
v=>lsm(v,gt194),
nf,
nf,
v=>lsm(v,gt195),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt196),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt197),
nf,
nf,
nf,
nf,
nf,
nf,
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
v=>lsm(v,gt199),
v=>lsm(v,gt200),
nf,
v=>lsm(v,gt201),
nf,
v=>lsm(v,gt202),
nf,
v=>lsm(v,gt203),
nf,
v=>lsm(v,gt204),
nf,
nf,
nf,
nf,
v=>lsm(v,gt205),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt206),
v=>lsm(v,gt207),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt208),
nf,
nf,
nf,
v=>lsm(v,gt209),
nf,
nf,
nf,
v=>lsm(v,gt210),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt211),
v=>lsm(v,gt212),
nf,
nf,
nf,
v=>lsm(v,gt213),
v=>lsm(v,gt214),
v=>lsm(v,gt215),
nf,
nf,
nf,
v=>lsm(v,gt216),
v=>lsm(v,gt217),
nf,
nf,
nf,
nf,
v=>lsm(v,gt218),
v=>lsm(v,gt219),
v=>lsm(v,gt220),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt221),
v=>lsm(v,gt222),
v=>lsm(v,gt223),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt189),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt224),
v=>lsm(v,gt225),
nf,
nf,
v=>lsm(v,gt148),
nf,
v=>lsm(v,gt226),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt227),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt228),
nf,
v=>lsm(v,gt229),
nf,
v=>lsm(v,gt230),
nf,
v=>lsm(v,gt231),
v=>lsm(v,gt232),
nf,
v=>lsm(v,gt233),
nf,
v=>lsm(v,gt234),
v=>lsm(v,gt235),
nf,
v=>lsm(v,gt236),
nf,
nf,
v=>lsm(v,gt237),
v=>lsm(v,gt238),
nf,
v=>lsm(v,gt239),
nf,
v=>lsm(v,gt240),
v=>lsm(v,gt241),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt242),
nf,
v=>lsm(v,gt243),
nf,
nf,
v=>lsm(v,gt244),
nf,
nf,
v=>lsm(v,gt245),
nf,
nf,
nf,
nf,
v=>lsm(v,gt246),
v=>lsm(v,gt247),
v=>lsm(v,gt248),
nf,
nf,
v=>lsm(v,gt249),
v=>lsm(v,gt250),
v=>lsm(v,gt251),
nf,
v=>lsm(v,gt252),
nf,
v=>lsm(v,gt253),
nf,
nf,
nf,
v=>lsm(v,gt254),
v=>lsm(v,gt219),
nf,
nf,
nf,
v=>lsm(v,gt255),
v=>lsm(v,gt256),
v=>lsm(v,gt257),
nf,
nf,
v=>lsm(v,gt258),
v=>lsm(v,gt259),
v=>lsm(v,gt260),
nf,
v=>lsm(v,gt261),
v=>lsm(v,gt262),
nf,
v=>lsm(v,gt263),
nf,
v=>lsm(v,gt264),
nf,
nf,
v=>lsm(v,gt254),
v=>lsm(v,gt265),
nf,
nf,
nf,
v=>lsm(v,gt266),
nf,
v=>lsm(v,gt267),
v=>lsm(v,gt268),
v=>lsm(v,gt269),
nf,
nf,
nf,
v=>lsm(v,gt270),
nf,
nf,
nf,
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
nf,
v=>lsm(v,gt273),
v=>lsm(v,gt274),
nf,
v=>lsm(v,gt275),
nf,
nf,
nf,
v=>lsm(v,gt276),
nf,
nf,
nf,
v=>lsm(v,gt277),
v=>lsm(v,gt278),
nf,
nf,
v=>lsm(v,gt279),
nf,
nf,
v=>lsm(v,gt280),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt281),
nf,
nf,
v=>lsm(v,gt282),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt283),
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
v=>lsm(v,gt285),
nf,
nf,
nf,
nf,
v=>lsm(v,gt286),
v=>lsm(v,gt287),
nf,
nf,
nf,
nf,
v=>lsm(v,gt288),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt289),
nf,
nf,
nf,
nf,
v=>lsm(v,gt290),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt291),
nf,
nf,
v=>lsm(v,gt291),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt292),
v=>lsm(v,gt293),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt294),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt295),
v=>lsm(v,gt296),
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt297),
v=>lsm(v,gt298),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt299),
nf,
v=>lsm(v,gt300),
nf,
nf,
v=>lsm(v,gt189),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf];

function getToken(l, SYM_LU) {
    if (l.END) return 0; /*9*/

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

        if(vals == this.vals)
            yield this;

        for (let i = 0; i < vals.length; i++) {

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

    skip(trvs) {

        for (let val = trvs.next().value; val && val !== this; val = trvs.next().value);

        return trvs;
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

    * traverseDepthFirst(p) {
        this.parent = p;

        yield this;

        if (this.id)
            yield* this.id.traverseDepthFirst(this);

        for (const arg of this.args)
            yield* arg.traverseDepthFirst(this);

        yield* this.body.traverseDepthFirst(this);

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

    * traverseDepthFirst(p) {
        this.parent = p;

        yield this;

        if (this.id)
            yield* this.id.traverseDepthFirst(this);

        for (const arg of this.args)
            yield* arg.traverseDepthFirst(this);

        yield* this.body.traverseDepthFirst(this);

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
        this.id.root = false;
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

    * traverseDepthFirst(p) {
        this.parent = p;
        yield this;
        yield* this.id.traverseDepthFirst(this);
        yield* this.init.traverseDepthFirst(this);
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

    render() { return `debugger` }
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
    constructor(sym) {super(sym); this.op = sym[1]; }
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

    getRootIds(ids, closuere) { if (!closuere.has(this.val)) ids.add(this.val); }

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
            args_str = this.args.render();

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
		let
            tvrs = ast.traverseDepthFirst(),
            node = tvrs.next().value,
            non_global = new Set(),
            globals = new Set(),
            assignments = new Map();

        //Retrieve undeclared variables to inject as function arguments.
        while (node) {
            if (
                node.type == types.identifier ||
                node.type == types.member_expression
            ) {
                if (node.root && !non_global.has(node.name)){
                    globals.add(node.name);
                }else{
                	non_global.add(node.name);
                }
            }

            if (
                node.type == types.lexical_declaration ||
                node.type == types.var
            ) {
                node.bindings.forEach(b => (non_global.add(b.id.name), globals.delete(b.id.name)));
            }

            node = tvrs.next().value;
        }

        return [...globals.values()].reduce((red, out) => {
            if ((window[out] && !(window[out] instanceof HTMLElement)) || out == "this") 
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

		return JSParser(lex, env$1);
	},

	validate(lex){
		let l = lex.copy();

		console.log(l.slice());
		try{
			let result = JSParser(lex, env$1);
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
    });
}

function AddEmit(ast, presets, ignore) {
    JS.processType(types.assignment_expression, ast, assign => {
        const k = assign.id.name;

        if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
            return;
        
        assign.connect.id.replace(new member_expression([new identifier$1(["emit"]), null, assign.id]));
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
        this.args = GetOutGlobals(this.ast, presets);
        AddEmit(this.ast, presets);
        let r = new return_statement([this.ast]);
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


        while_stmt: function(sym) {
            this.bool = sym[1];
            this.body = sym[3];
        },
        var_stmt: function(sym) { this.declarations = sym[1]; },
        mod_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "MOD";
        },
        seq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_EQ";
        },
        neq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "NEQ";
        },
        sneq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_NEQ";
        },
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
