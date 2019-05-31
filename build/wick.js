var wick = (function () {
    'use strict';

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
                fs = (await import('fs')).promises,
                path = (await import('path'));


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
        symbols = ["((","))",")(","</","||","^=","$=","*=","<=",")","{","}","(","[","]",".","...",";",",","<",">",">=","==","!=","===","!==","+","-","*","%","/","**","++","--","<<",">>",">>>","&","|","^","!","~","&&","?",":","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>","\"","'"],

        /* Goto lookup maps */
        gt0 = [0,-1,1,-3,4,125,129,126,124,132,130,-2,131,-5,127,-1,155,-5,156,-10,154,-42,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153,-10,2,5,-18,6,7,8,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,3,114,108,111,110,-10,79],
    gt1 = [0,-136,158,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt2 = [0,-14,166,-5,169,-1,155,-5,156,-10,154,-63,167,165,-2,163,-1,168,-25,162,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt3 = [0,-224,173],
    gt4 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,213,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt5 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,224,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt6 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,225,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt7 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,226,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt8 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,227,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt9 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,228,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt10 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,229,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt11 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,230,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt12 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,231,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt13 = [0,-208,233],
    gt14 = [0,-208,238],
    gt15 = [0,-174,66,222,-14,67,223,-9,239,240,61,62,85,-4,60,217,-7,216,-20,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt16 = [0,-280,245,244,243,246],
    gt17 = [0,-280,245,244,250,246],
    gt18 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,252,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt19 = [0,-208,257],
    gt20 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-17,258,214,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt21 = [0,-160,260],
    gt22 = [0,-168,262,263,-71,265,267,268,-15,264,266,70],
    gt23 = [0,-137,272,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt24 = [0,-257,278,-2,279,70],
    gt25 = [0,-257,281,-2,279,70],
    gt26 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,283,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt27 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,285,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt28 = [0,-142,286],
    gt29 = [0,-262,289,-2,114,288,111,110],
    gt30 = [0,-268,290],
    gt31 = [0,-269,293,-5,292,-1,296,317],
    gt32 = [0,-192,322,323,-65,321,266,70],
    gt33 = [0,-259,327,266,70],
    gt34 = [0,-172,328,329,-67,331,267,268,-15,330,266,70],
    gt35 = [0,-7,129,332,-1,132,130,-2,131,-5,333,-1,155,-5,156,-10,154,-42,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt36 = [0,-7,336,-2,132,130,-2,131,-5,169,-1,155,-5,156,-10,154,-42,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt37 = [0,-80,345,344,-1,136,-1,152,137,347,346,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt38 = [0,-83,352,-1,152,353,-6,143,144,145,-1,146,-3,147,153],
    gt39 = [0,-85,152,354,-6,355,144,145,-1,146,-3,147,153],
    gt40 = [0,-85,356,-16,153],
    gt41 = [0,-90,141,364,363],
    gt42 = [0,-101,367],
    gt43 = [0,-84,369,-16,370],
    gt44 = [0,-135,162,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt45 = [0,-14,377,-5,169,-1,155,-5,156,-10,154,-65,379,378,-2,380],
    gt46 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,384,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt47 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,385,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt48 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,386,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt49 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,387,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt50 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-7,388,35,36,37,38,39,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt51 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-8,389,36,37,38,39,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt52 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-9,390,37,38,39,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt53 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-10,391,38,39,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt54 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-11,392,39,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt55 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-12,393,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt56 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-12,394,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt57 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-12,395,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt58 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-12,396,40,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt59 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,397,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt60 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,398,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt61 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,399,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt62 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,400,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt63 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,401,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt64 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-13,402,41,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt65 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-14,403,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt66 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-14,404,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt67 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-14,405,42,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt68 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-15,406,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt69 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-15,407,43,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt70 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-16,408,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt71 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-16,409,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt72 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-16,410,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt73 = [0,-174,66,222,-13,87,67,223,-8,215,56,58,61,62,85,57,86,-2,60,217,-7,216,-16,411,44,45,53,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt74 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,414,413,417,416,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt75 = [0,-197,424,-14,420,421,426,430,431,422,-35,432,433,-3,423,-1,219,427,-17,79],
    gt76 = [0,-261,435],
    gt77 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,436,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt78 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-1,438,60,217,-7,216,-3,439,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt79 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,441,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt80 = [0,-261,442],
    gt81 = [0,-208,443],
    gt82 = [0,-280,446,-2,246],
    gt83 = [0,-241,451,267,268,-15,450,266,70],
    gt84 = [0,-261,452],
    gt85 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,453,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt86 = [0,-174,66,222,-7,31,89,454,-3,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,-8,216,-3,455,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt87 = [0,-137,458,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-1,457,24,-3,25,15,-6,66,459,-7,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt88 = [0,-218,462],
    gt89 = [0,-218,464],
    gt90 = [0,-214,471,430,431,-27,466,467,-2,469,-1,470,-2,432,433,-4,472,266,427,-17,79],
    gt91 = [0,-221,474,-19,481,267,268,-2,476,478,-1,479,480,475,-7,472,266,70],
    gt92 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,482,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt93 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,484,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt94 = [0,-147,490,-22,488,491,-2,66,222,-7,31,89,-4,87,67,223,-7,485,489,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt95 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,493,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt96 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,497,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt97 = [0,-163,499,500],
    gt98 = [0,-269,293,-5,292],
    gt99 = [0,-271,503,506,507],
    gt100 = [0,-271,511,506,507],
    gt101 = [0,-271,514,506,507],
    gt102 = [0,-271,515,506,507],
    gt103 = [0,-278,517],
    gt104 = [0,-271,518,506,507],
    gt105 = [0,-192,519,323],
    gt106 = [0,-194,521,523,524,525,-16,528,430,431,-36,432,433,-6,529,-17,79],
    gt107 = [0,-174,66,222,-13,87,67,223,-8,530,56,58,61,62,85,57,86,-2,60,217,-7,216,-20,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt108 = [0,-177,531,533,532,535,-60,481,267,268,-5,536,480,534,-7,472,266,70],
    gt109 = [0,-218,540],
    gt110 = [0,-218,541],
    gt111 = [0,-14,166,-5,169,-1,155,-5,156,-10,154,-63,167,165,-2,163,-1,168],
    gt112 = [0,-15,542,543,-59,546,-2,545],
    gt113 = [0,-38,550,-1,553,-1,551,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt114 = [0,-23,566,-55,568],
    gt115 = [0,-33,569,571,573,576,575,-21,574],
    gt116 = [0,-14,166,-5,169,-1,155,-5,156,-10,154,-63,167,165,-2,579,-1,168],
    gt117 = [0,-82,580,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt118 = [0,-80,581,-2,136,-1,152,137,347,346,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt119 = [0,-83,136,-1,152,137,582,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt120 = [0,-85,152,583,-6,355,144,145,-1,146,-3,147,153],
    gt121 = [0,-98,585],
    gt122 = [0,-100,591],
    gt123 = [0,-101,593],
    gt124 = [0,-110,599,597,596],
    gt125 = [0,-103,602,-5,168],
    gt126 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-2,607,606,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt127 = [0,-221,609],
    gt128 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,611,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt129 = [0,-218,614],
    gt130 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,615,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt131 = [0,-214,618,430,431,-36,432,433,-6,529,-17,79],
    gt132 = [0,-214,619,430,431,-36,432,433,-6,529,-17,79],
    gt133 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,620,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt134 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,624,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt135 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-6,631,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt136 = [0,-169,633,-71,265,267,268,-15,264,266,70],
    gt137 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,634,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt138 = [0,-259,638,266,70],
    gt139 = [0,-218,640],
    gt140 = [0,-241,481,267,268,-5,643,480,641,-7,472,266,70],
    gt141 = [0,-241,648,267,268,-15,647,266,70],
    gt142 = [0,-218,649],
    gt143 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,654,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt144 = [0,-148,657,-19,656,263,-71,659,267,268,-15,658,266,70],
    gt145 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,660,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt146 = [0,-148,666,-23,328,329,-67,668,267,268,-15,667,266,70],
    gt147 = [0,-147,671,-23,672,-2,66,222,-13,87,67,223,-8,669,56,58,61,62,85,57,86,-2,60,217,-7,216,-20,218,-11,65,74,75,73,72,-1,64,-1,219,70,-17,79],
    gt148 = [0,-164,675],
    gt149 = [0,-142,677],
    gt150 = [0,-272,680,507],
    gt151 = [0,-2,687,689,688,-262,684,682,-1,681,-5,683,686,317],
    gt152 = [0,-194,703,523,524,525,-16,528,430,431,-36,432,433,-6,529,-17,79],
    gt153 = [0,-196,706,525,-16,528,430,431,-36,432,433,-6,529,-17,79],
    gt154 = [0,-197,707,-16,528,430,431,-36,432,433,-6,529,-17,79],
    gt155 = [0,-177,710,533,532,535,-60,481,267,268,-5,536,480,534,-7,472,266,70],
    gt156 = [0,-173,711,-67,331,267,268,-15,330,266,70],
    gt157 = [0,-16,712,-59,546,-2,545],
    gt158 = [0,-18,714,-19,715,-1,553,-1,551,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt159 = [0,-78,717],
    gt160 = [0,-78,719],
    gt161 = [0,-71,723],
    gt162 = [0,-41,725],
    gt163 = [0,-46,729,727,-1,731,728],
    gt164 = [0,-52,733,-1,562,-4,563],
    gt165 = [0,-43,555,734,557,-2,558,-2,556,559,735,562,-4,563,738,-6,740,742,739,741,-1,745,-2,744],
    gt166 = [0,-34,749,573,576,575,-21,574],
    gt167 = [0,-29,752,750,754,751],
    gt168 = [0,-33,756,571,573,576,575,-21,574,-49,757],
    gt169 = [0,-96,762],
    gt170 = [0,-82,766,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt171 = [0,-105,767,-3,380],
    gt172 = [0,-108,768,-1,599,597,769],
    gt173 = [0,-110,771],
    gt174 = [0,-110,599,597,772],
    gt175 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,773,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt176 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-1,777,776,775,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt177 = [0,-197,424,-15,779,426,430,431,422,-35,432,433,-3,423,-1,219,427,-17,79],
    gt178 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,780,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt179 = [0,-176,781,782,533,532,535,-60,481,267,268,-5,536,480,534,-7,472,266,70],
    gt180 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,787,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt181 = [0,-241,790,267,268,-15,789,266,70],
    gt182 = [0,-214,471,430,431,-27,792,-3,794,-1,470,-2,432,433,-4,472,266,427,-17,79],
    gt183 = [0,-241,481,267,268,-5,795,480,-8,472,266,70],
    gt184 = [0,-221,798,-19,481,267,268,-3,800,-1,479,480,799,-7,472,266,70],
    gt185 = [0,-137,801,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt186 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,802,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt187 = [0,-137,803,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt188 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,804,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt189 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,807,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt190 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,813,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt191 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,815,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt192 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,816,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt193 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,817,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt194 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,818,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt195 = [0,-148,820,-92,822,267,268,-15,821,266,70],
    gt196 = [0,-148,666,-92,822,267,268,-15,821,266,70],
    gt197 = [0,-155,824],
    gt198 = [0,-137,826,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt199 = [0,-165,827,-75,829,267,268,-15,828,266,70],
    gt200 = [0,-2,687,689,688,-262,684,682,-1,830,-5,683,686,317],
    gt201 = [0,-2,687,689,688,-263,834,-7,833,686,317],
    gt202 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,835,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt203 = [0,-2,839,689,688,-269,836,-4,837],
    gt204 = [0,-269,845],
    gt205 = [0,-5,846,125,129,126,124,132,130,-2,131,-5,127,-1,155,-5,156,-10,154,-42,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt206 = [0,-113,847,5,-18,6,7,8,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt207 = [0,-179,851,852,-60,481,267,268,-5,536,480,534,-7,472,266,70],
    gt208 = [0,-18,854,-19,855,-1,553,-1,551,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt209 = [0,-38,856,-1,553,-1,551,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt210 = [0,-79,861],
    gt211 = [0,-10,132,864,863,862,-68,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt212 = [0,-40,553,-1,865,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt213 = [0,-41,866],
    gt214 = [0,-43,867,-1,557,-2,558,-3,868,-1,562,-4,563],
    gt215 = [0,-46,869],
    gt216 = [0,-49,870],
    gt217 = [0,-52,871,-1,562,-4,563],
    gt218 = [0,-52,872,-1,562,-4,563],
    gt219 = [0,-57,877,875],
    gt220 = [0,-61,881],
    gt221 = [0,-62,886,887,-1,888],
    gt222 = [0,-74,893],
    gt223 = [0,-55,900,898],
    gt224 = [0,-21,903,-2,905,-1,904,906,-45,909],
    gt225 = [0,-10,132,864,863,911,-68,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt226 = [0,-29,912],
    gt227 = [0,-31,913],
    gt228 = [0,-34,914,573,576,575,-21,574],
    gt229 = [0,-34,915,573,576,575,-21,574],
    gt230 = [0,-82,918,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt231 = [0,-99,920],
    gt232 = [0,-110,599,597,769],
    gt233 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,927,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt234 = [0,-180,931,-17,930,-42,481,267,268,-5,536,480,-8,472,266,70],
    gt235 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,932,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt236 = [0,-241,481,267,268,-5,643,480,937,-7,472,266,70],
    gt237 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,942,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt238 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,944,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt239 = [0,-137,946,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt240 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,947,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt241 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,949,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt242 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,950,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt243 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,951,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt244 = [0,-137,954,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt245 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,959,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt246 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,961,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt247 = [0,-156,963,965,964],
    gt248 = [0,-275,970],
    gt249 = [0,-2,973,689,688,-275,245,244,243,246],
    gt250 = [0,-269,974],
    gt251 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-5,978,979,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt252 = [0,-38,981,-1,553,-1,551,555,552,557,-2,558,-2,556,559,-1,562,-4,563,-11,554],
    gt253 = [0,-17,982,-15,983,571,573,576,575,-21,574,-49,984],
    gt254 = [0,-10,132,988,-70,133,136,-1,152,137,134,-1,135,141,139,138,143,144,145,-1,146,-3,147,153],
    gt255 = [0,-46,729,727],
    gt256 = [0,-57,990],
    gt257 = [0,-68,991,-1,992,-1,745,-2,744],
    gt258 = [0,-68,994,-1,992,-1,745,-2,744],
    gt259 = [0,-70,996],
    gt260 = [0,-55,1002],
    gt261 = [0,-24,905,-1,1004,906,-45,909],
    gt262 = [0,-137,1015,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt263 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,1017,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt264 = [0,-137,1020,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt265 = [0,-137,1022,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt266 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,1024,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt267 = [0,-137,1029,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt268 = [0,-137,1030,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt269 = [0,-137,1031,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt270 = [0,-137,1032,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt271 = [0,-137,1033,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt272 = [0,-137,1034,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt273 = [0,-174,66,222,-7,31,89,-4,87,67,223,-8,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,1036,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt274 = [0,-157,1040,1038],
    gt275 = [0,-156,1041,965],
    gt276 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,1043,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt277 = [0,-142,1045],
    gt278 = [0,-275,1046],
    gt279 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,1048,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt280 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-5,1054,979,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt281 = [0,-64,1056],
    gt282 = [0,-66,1058],
    gt283 = [0,-14,166,-5,169,-1,155,-5,156,-10,154,-63,167,165,-2,1061,-1,168],
    gt284 = [0,-27,1062,-45,909],
    gt285 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-5,1063,979,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt286 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-5,1064,979,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt287 = [0,-137,1067,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt288 = [0,-137,1068,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt289 = [0,-137,1069,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt290 = [0,-174,66,222,-7,31,89,-4,87,67,223,-7,1070,32,56,58,61,62,85,57,86,-2,60,217,-7,216,-3,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,-1,64,90,254,70,-17,79],
    gt291 = [0,-137,1073,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt292 = [0,-137,1074,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt293 = [0,-137,1075,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt294 = [0,-137,1076,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt295 = [0,-137,1077,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt296 = [0,-137,1079,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt297 = [0,-157,1080],
    gt298 = [0,-157,1040],
    gt299 = [0,-135,1084,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt300 = [0,-68,1090,-1,992,-1,745,-2,744],
    gt301 = [0,-68,1092,-1,992,-1,745,-2,744],
    gt302 = [0,-14,377,-5,169,-1,155,-2,1093,-2,156,-10,154,-65,379,378,-2,380],
    gt303 = [0,-135,632,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-5,1098,979,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt304 = [0,-137,1099,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt305 = [0,-137,1101,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt306 = [0,-137,1102,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt307 = [0,-137,1103,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt308 = [0,-135,1105,9,10,11,116,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-2,117,121,-2,66,119,-7,31,89,-4,87,67,115,-7,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],
    gt309 = [0,-137,1108,-2,18,12,26,16,13,17,95,-2,19,20,21,23,22,96,-4,14,-2,24,-3,25,15,-6,66,-8,31,89,-4,87,67,-8,28,32,56,58,61,62,85,57,86,-2,60,-12,29,-1,30,33,34,35,36,37,38,39,40,41,42,43,44,45,53,68,-11,65,74,75,73,72,91,64,90,69,70,113,109,159,114,108,111,110,-10,79],

        // State action lookup maps
        sm0=[0,1,2,3,-1,0,-4,0,-8,4,5,-5,6,-14,7,-12,8,9,-1,10,11,12,13,-1,14,-8,15,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm1=[0,50,-3,0,-4,0],
    sm2=[0,51,-3,0,-4,0],
    sm3=[0,51,-3,0,-4,0,-9,52],
    sm4=[0,53,-3,0,-4,0,-134,53],
    sm5=[0,54,-3,0,-4,0,-134,54],
    sm6=[0,55,-3,0,-4,0,-134,55],
    sm7=[0,56,2,57,-1,0,-4,0,-8,58,5,-20,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,56,-21,48,49],
    sm8=[0,59,59,59,-1,0,-4,0,-8,59,59,59,-19,59,-12,59,59,-6,59,-9,59,-3,59,59,59,59,-1,59,-1,59,59,59,59,-1,59,59,59,59,59,59,59,59,59,-2,59,59,-5,59,59,-2,59,-23,59,-1,59,59,59,59,59,59,59,59,59,59,-21,59,59],
    sm9=[0,60,60,60,-1,0,-4,0,-8,60,60,60,-19,60,-12,60,60,-6,60,-9,60,-3,60,60,60,60,-1,60,-1,60,60,60,60,-1,60,60,60,60,60,60,60,60,60,-2,60,60,-5,60,60,-2,60,-23,60,-1,60,60,60,60,60,60,60,60,60,60,-21,60,60],
    sm10=[0,61,61,61,-1,0,-4,0,-8,61,61,61,-19,61,-12,61,61,-6,61,-9,61,-3,61,61,61,61,-1,61,61,61,61,61,61,-1,61,61,61,61,61,61,61,61,61,-2,61,61,-5,61,61,-2,61,-23,61,-1,61,61,61,61,61,61,61,61,61,61,-21,61,61],
    sm11=[0,62,62,62,-1,0,-4,0,-8,62,62,62,-19,62,-12,62,62,-6,62,-9,62,-3,62,62,62,62,-1,62,62,62,62,62,62,-1,62,62,62,62,62,62,62,62,62,-2,62,62,-5,62,62,-2,62,-23,62,-1,62,62,62,62,62,62,62,62,62,62,-21,62,62],
    sm12=[0,-1,2,63,-1,0,-4,0,-8,58,5,-5,6,-14,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm13=[0,-4,0,-4,0,-7,64,-1,65],
    sm14=[0,-4,0,-4,0,-5,66,66,66,-1,66,-42,66,-7,66,-1,66],
    sm15=[0,-4,0,-4,0,-5,67,67,67,-1,67,67,-41,67,-7,67,-1,67],
    sm16=[0,-4,0,-4,0,-5,68,68,68,-1,68,68,-19,68,68,68,69,-1,68,68,-1,68,-4,68,-1,68,68,68,-4,68,70,-1,71,-4,68,-1,68,-37,72,73,74,75,76,77,78,79,80,81,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
    sm17=[0,-4,0,-4,0,-5,84,84,84,-1,84,84,-34,85,-6,84,-7,84,-1,84,-47,86],
    sm18=[0,-4,0,-4,0,-5,87,87,87,-1,87,87,-34,87,-6,87,-7,87,-1,87,-47,87,88],
    sm19=[0,-4,0,-4,0,-5,89,89,89,-1,89,89,-34,89,-1,90,-4,89,-7,89,-1,89,-47,89,89],
    sm20=[0,-4,0,-4,0,-5,91,91,91,-1,91,91,-34,91,-1,91,-4,91,-7,91,-1,91,-47,91,91,92],
    sm21=[0,-4,0,-4,0,-5,93,93,93,-1,93,93,-34,93,-1,93,-4,93,-7,93,-1,93,-47,93,93,93,94],
    sm22=[0,-4,0,-4,0,-5,95,95,95,-1,95,95,-34,95,-1,95,-4,95,-7,95,-1,95,-47,95,95,95,95,96,97,98,99],
    sm23=[0,-4,0,-4,0,-5,100,100,100,-1,100,100,-19,101,102,103,-5,104,-6,100,-1,100,-4,100,-7,100,-1,100,-47,100,100,100,100,100,100,100,100,105,106],
    sm24=[0,-4,0,-4,0,-5,107,107,107,-1,107,107,-19,107,107,107,-5,107,-6,107,-1,107,-4,107,-7,107,-1,107,-47,107,107,107,107,107,107,107,107,107,107,108,109,110],
    sm25=[0,-4,0,-4,0,-5,111,111,111,-1,111,111,-19,111,111,111,-5,111,-4,112,-1,111,-1,111,-4,111,-7,111,-1,111,-47,111,111,111,111,111,111,111,111,111,111,111,111,111,113],
    sm26=[0,-4,0,-4,0,-5,114,114,114,-1,114,114,-19,114,114,114,-2,115,116,-1,114,-4,114,-1,114,117,114,-4,114,-7,114,-1,114,-47,114,114,114,114,114,114,114,114,114,114,114,114,114,114],
    sm27=[0,-4,0,-4,0,-5,118,118,118,-1,118,118,-19,118,118,118,-2,118,118,-1,118,-4,118,-1,118,118,118,-4,118,-7,118,-1,118,-47,118,118,118,118,118,118,118,118,118,118,118,118,118,118],
    sm28=[0,-4,0,-4,0,-5,119,119,119,-1,119,119,-19,119,119,119,-2,119,119,-1,119,-4,119,-1,119,119,119,-4,119,-7,119,-1,119,-47,119,119,119,119,119,119,119,119,119,119,119,119,119,119],
    sm29=[0,-4,0,-4,0,-5,120,120,120,-1,120,120,-19,120,120,120,-2,120,120,-1,120,-4,120,-1,120,120,120,-4,120,-7,120,-1,120,-47,120,120,120,120,120,120,120,120,120,120,120,120,120,120,121],
    sm30=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm31=[0,-4,0,-4,0,-5,120,120,120,-1,120,120,-19,120,120,120,-2,120,120,-1,120,-4,120,-1,120,120,120,-4,120,-7,120,-1,120,-47,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120],
    sm32=[0,-4,0,-4,0,-5,124,124,124,124,124,124,-19,124,124,124,124,-1,124,124,-1,124,-4,124,-1,124,124,124,-4,124,124,-1,124,-4,124,-1,124,-13,124,-23,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,-4,124,124],
    sm33=[0,-4,0,-4,0,-5,124,124,124,124,124,124,-19,124,124,124,124,-1,124,124,-1,124,-4,124,-1,124,124,124,-1,125,-1,126,124,124,-1,124,-4,124,127,124,-13,124,-23,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,-4,124,124],
    sm34=[0,-4,0,-4,0,-5,128,128,128,128,128,128,-19,128,128,128,128,-1,128,128,-1,128,-4,128,-1,128,128,128,-1,129,-1,130,128,128,-1,128,-4,128,127,128,-13,128,-23,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,-4,128,128],
    sm35=[0,-1,2,57,-1,0,-4,0,-8,122,-40,131,-1,123,-9,16,-4,17,18,-27,35,132,-2,37,-31,45,46,47,-22,48,49],
    sm36=[0,-4,0,-4,0,-5,133,133,133,133,133,133,-19,133,133,133,133,-1,133,133,-1,133,-4,133,-1,133,133,133,-1,133,-1,133,133,133,-1,133,-4,133,133,133,-13,133,-23,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,133,-4,133,133],
    sm37=[0,-4,0,-4,0,-5,134,134,134,134,134,134,-19,134,134,134,134,-1,134,134,-1,134,-4,134,-1,134,134,134,-1,134,-1,134,134,134,-1,134,-4,134,134,134,-13,134,-23,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-4,134,134],
    sm38=[0,-4,0,-4,0,-5,135,135,135,135,135,135,-19,135,135,135,135,-1,135,135,-1,135,-4,135,-1,135,135,135,-1,135,-1,135,135,135,-1,135,-4,135,135,135,-13,135,-23,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,-4,135,135],
    sm39=[0,-4,0,-4,0,-5,135,135,135,-1,135,135,-19,135,135,135,135,-1,135,135,-1,135,-4,135,-1,135,135,135,-1,135,-1,135,135,135,-1,135,-4,135,135,135,-13,135,-13,136,-9,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,-4,135,135],
    sm40=[0,-4,0,-4,0,-7,137,-1,137,-20,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,-1,137,-1,137,-4,138,137,-28,139,-9,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
    sm41=[0,-4,0,-4,0,-5,140,140,140,140,140,140,-19,140,140,140,140,-1,140,140,-1,140,-4,140,-1,140,140,140,-1,140,-1,140,140,140,-1,140,-4,140,140,140,-13,140,-13,140,140,-8,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,-4,140,140],
    sm42=[0,-2,141,-1,0,-4,0,-7,141,141,142,-20,142,141,142,142,-1,142,142,-1,142,-4,141,141,141,141,143,141,141,-1,141,-1,142,-1,142,-4,141,142,-28,142,-9,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
    sm43=[0,-4,0,-4,0,-5,144,144,144,144,144,144,-19,144,144,144,144,-1,144,144,-1,144,-4,144,-1,144,144,144,-1,144,-1,144,144,144,-1,144,-4,144,144,144,-13,144,-23,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,144,-4,144,144],
    sm44=[0,-4,0,-4,0,-5,145,145,145,145,145,145,-19,145,145,145,145,-1,145,145,-1,145,-4,145,-1,145,145,145,-1,145,-1,145,145,145,-1,145,-4,145,145,145,-13,145,-23,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,-4,145,145],
    sm45=[0,-4,0,-4,0,-5,146,146,146,146,146,146,-19,146,146,146,146,-1,146,146,-1,146,-4,146,-1,146,146,146,-1,146,-1,146,146,146,-1,146,-4,146,146,146,-13,146,-23,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,146,-4,146,146],
    sm46=[0,-4,0,-4,0,-5,147,147,147,147,147,147,-19,147,147,147,147,-1,147,147,-1,147,-4,147,-1,147,147,147,-1,147,-1,147,147,147,-1,147,-4,147,147,147,-13,147,-23,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,147,-4,147,147],
    sm47=[0,-2,148,-1,149,-4,0,-3,150],
    sm48=[0,-4,0,-4,0,-5,151,151,151,151,151,151,-19,151,151,151,151,-1,151,151,-1,151,-4,151,-1,151,151,151,-1,151,-1,151,151,151,-1,151,-4,151,151,151,-13,151,-23,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,-4,151,151],
    sm49=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,152,-3,17,18,-9,25,-17,35,36,-1,153,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm50=[0,-4,0,-4,0,-49,154,-1,155,-9,127],
    sm51=[0,-4,0,-4,0,-5,156,156,156,156,156,156,-19,156,156,156,156,-1,156,156,-1,156,-4,156,-1,156,156,156,-1,156,-1,156,156,156,-1,156,-4,156,156,156,-13,156,-23,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,-4,156,156],
    sm52=[0,-4,0,-4,0,-5,157,157,157,157,157,157,-19,157,157,157,157,-1,157,157,-1,157,-4,157,-1,157,157,157,-1,157,-1,157,157,157,-1,157,-4,157,157,157,-13,157,-23,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,157,-4,157,157],
    sm53=[0,-4,0,-4,0,-90,158],
    sm54=[0,-4,0,-4,0,-90,136],
    sm55=[0,-4,0,-4,0,-60,159],
    sm56=[0,-2,57,-1,0,-4,0,-8,160,-42,161],
    sm57=[0,162,162,162,-1,0,-4,0,-8,162,162,162,-19,162,-12,162,162,-6,162,-9,162,-3,162,162,162,162,-1,162,162,162,162,162,162,-1,162,162,162,162,162,162,162,162,162,-2,162,162,-5,162,162,-2,162,-23,162,-1,162,162,162,162,162,162,162,162,162,162,-21,162,162],
    sm58=[0,-4,0,-4,0,-61,163],
    sm59=[0,164,164,164,-1,0,-4,0,-8,164,164,164,-19,164,-12,164,164,-6,164,-9,164,-3,164,164,164,164,-1,164,164,164,164,164,164,-1,164,164,164,164,164,164,164,164,164,-2,164,164,-5,164,164,-2,164,-23,164,-1,164,164,164,164,164,164,164,164,164,164,-21,164,164],
    sm60=[0,-1,2,57,-1,0,-4,0,-8,58,5,-20,7,-12,8,9,-16,16,-8,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,-6,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm61=[0,-4,0,-4,0,-61,165],
    sm62=[0,-4,0,-4,0,-61,166,-15,167],
    sm63=[0,-4,0,-4,0,-61,168],
    sm64=[0,-2,57,-1,0,-4,0,-9,169],
    sm65=[0,-2,57,-1,0,-4,0,-9,170],
    sm66=[0,-1,2,57,-1,0,-4,0,-8,122,171,-33,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm67=[0,-4,0,-4,0,-61,172],
    sm68=[0,-4,0,-4,0,-8,58],
    sm69=[0,-4,0,-4,0,-9,173],
    sm70=[0,174,-3,0,-4,0,-9,174],
    sm71=[0,-4,0,-4,0,-30,7],
    sm72=[0,175,-3,0,-4,0,-9,175],
    sm73=[0,-4,0,-4,0,-30,176],
    sm74=[0,-2,177,-1,178,-4,179,-3,180,-12,181,-118,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201],
    sm75=[0,-4,0,-4,0,-30,202],
    sm76=[0,-4,0,-4,0,-30,203],
    sm77=[0,204,204,204,-1,0,-4,0,-8,204,204,204,-19,204,-12,204,204,-6,204,-9,204,-3,204,204,204,204,-1,204,-1,204,204,204,204,-1,204,204,204,204,204,204,204,204,204,-2,204,204,-5,204,204,-2,204,-23,204,-1,204,204,204,204,204,204,204,204,204,204,-21,204,204],
    sm78=[0,-2,57,-1,0,-4,0,-8,205,-82,206],
    sm79=[0,207,207,207,-1,0,-4,0,-8,207,207,207,-19,207,-12,207,207,-6,207,-9,207,-3,207,207,207,207,-1,207,-1,207,207,207,207,-1,207,207,207,207,207,207,207,207,207,-2,207,207,-5,207,207,-2,207,-23,207,-1,207,207,207,207,207,207,207,207,207,207,-21,207,207],
    sm80=[0,-2,57,-1,0,-4,0,-61,208],
    sm81=[0,-2,209,-1,0,-4,0,-8,209,-42,209],
    sm82=[0,-2,210,-1,0,-4,0,-8,210,-42,210],
    sm83=[0,211,-3,0,-4,0,-134,211],
    sm84=[0,212,-1,213,-1,0,-4,0,-8,214,-6,6,-30,10,11,12,13,-1,14,-8,15,-73,212],
    sm85=[0,215,-1,215,-1,0,-4,0,-8,215,216,-5,215,-30,215,215,215,215,-1,215,-8,215,-73,215],
    sm86=[0,-4,0,-4,0,-12,217,-3,218,219,-7,220],
    sm87=[0,221,-1,221,-1,0,-4,0,-8,221,-6,221,-30,221,221,221,221,-1,221,-8,221,-73,221],
    sm88=[0,222,-1,222,-1,0,-4,0,-8,222,-6,222,-30,222,222,222,222,-1,222,-8,222,-73,222],
    sm89=[0,-4,0,-4,0,-7,223,224],
    sm90=[0,-4,0,-4,0,-7,225,225],
    sm91=[0,-2,213,-1,0,-4,0,-7,226,226,-22,227,-11,228,229,230,10,11,12,13,-1,14,-8,15,-1,226],
    sm92=[0,-2,231,-1,0,-4,0,-7,231,231,-22,231,-11,231,231,231,231,231,12,13,-1,14,-8,15,-1,231],
    sm93=[0,-2,231,-1,0,-4,0,-7,231,231,-22,231,-11,231,231,231,231,231,231,231,-1,231,-8,232,-1,231],
    sm94=[0,-2,233,-1,0,-4,0,-7,233,233,-22,233,-11,233,233,233,233,233,233,233,-1,233,-8,233,-1,233],
    sm95=[0,-2,234,-1,0,-4,0,-46,235],
    sm96=[0,-2,233,-1,0,-4,0,-7,233,233,-22,233,-11,233,233,233,233,143,233,233,-1,233,-8,233,-1,233],
    sm97=[0,-4,0,-4,0,-47,236],
    sm98=[0,-2,237,-1,0,-4,0,-46,237],
    sm99=[0,-2,238,-1,0,-4,0,-7,238,238,-22,238,-11,238,238,238,238,238,238,238,-1,238,-8,238,-1,238],
    sm100=[0,-2,239,-1,0,-4,0,-7,239,239,-22,239,-11,239,239,239,239,239,239,239,-1,239,-8,239,-1,239],
    sm101=[0,-2,240,-1,0,-4,0],
    sm102=[0,-2,241,-1,0,-4,0],
    sm103=[0,-2,213,-1,0,-4,0,-46,242,11],
    sm104=[0,-2,243,-1,0,-4,0,-60,244],
    sm105=[0,-2,245,-1,0,-4,0,-7,245,245,-22,245,-11,245,245,245,245,245,245,245,-1,245,-8,245,-1,245],
    sm106=[0,-2,246,-1,0,-4,0,-7,246,246,-22,246,-11,246,246,246,246,246,246,246,-1,246,-8,244,-1,246],
    sm107=[0,-4,0,-4,0,-9,247],
    sm108=[0,-4,0,-4,0,-9,248],
    sm109=[0,-4,0,-4,0,-9,249],
    sm110=[0,250,250,250,-1,0,-4,0,-8,250,250,250,-19,250,-12,250,250,-6,250,-9,250,-3,250,250,250,250,-1,250,250,250,250,250,250,-1,250,250,250,250,250,250,250,250,250,-2,250,250,-5,250,250,-2,250,-23,250,-1,250,250,250,250,250,250,250,250,250,250,-21,250,250],
    sm111=[0,251,251,251,-1,0,-4,0,-8,251,251,251,-19,251,-12,251,251,-6,251,-9,251,-3,251,251,251,251,-1,251,-1,251,251,251,251,-1,251,251,251,251,251,251,251,251,251,-2,251,251,-5,251,251,-2,251,-23,251,-1,251,251,251,251,251,251,251,251,251,251,-21,251,251],
    sm112=[0,-4,0,-4,0,-9,52],
    sm113=[0,-1,2,57,-1,0,-4,0,-8,58,5,-20,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm114=[0,-4,0,-4,0,-5,142,142,142,142,142,142,-19,142,142,142,142,-1,142,142,-1,142,-4,142,-1,142,142,142,-1,142,-1,142,142,142,-1,142,-4,142,142,142,-13,142,-13,142,142,-8,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
    sm115=[0,-1,2,57,-1,0,-4,0,-8,58,5,252,-19,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm116=[0,-2,253,-1,0,-4,0,-9,254,255,-4,6],
    sm117=[0,-4,0,-4,0,-7,142,-1,142,-20,142,142,142,142,-1,142,142,-1,142,-4,142,-1,142,142,142,-1,142,-1,142,-1,142,-1,142,-4,256,142,-28,142,-9,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
    sm118=[0,-2,257,-1,0,-4,0,-9,258,257,-4,257],
    sm119=[0,-2,259,-1,0,-4,0,-9,259,259,-4,259],
    sm120=[0,-2,260,-1,0,-4,0,-9,260,260,-4,260],
    sm121=[0,-2,261,-1,0,-4,0,-9,261,261,-4,261],
    sm122=[0,-4,0,-4,0,-9,216],
    sm123=[0,262,262,262,-1,0,-4,0,-8,262,262,262,-19,262,-12,262,262,-6,262,-9,262,-3,262,262,262,262,-1,262,262,262,262,262,262,-1,262,262,262,262,262,262,262,262,262,-2,262,262,-5,262,262,-2,262,-23,262,-1,262,262,262,262,262,262,262,262,262,262,-21,262,262],
    sm124=[0,-4,0,-4,0,-5,263,263,263,-1,263,263,-19,263,263,263,-2,263,263,-1,263,-4,263,-1,263,263,263,-4,263,-7,263,-1,263,-47,263,263,263,263,263,263,263,263,263,263,263,263,263,263,263],
    sm125=[0,-4,0,-4,0,-5,264,264,264,-1,264,264,-19,264,264,264,-2,264,264,-1,264,-4,264,-1,264,264,264,-4,264,-7,264,-1,264,-47,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264],
    sm126=[0,-1,265,265,-1,0,-4,0,-8,265,-34,265,265,-6,265,-9,265,-4,265,265,-9,265,-17,265,265,-2,265,-23,265,-1,265,265,265,265,265,265,265,265,265,-22,265,265],
    sm127=[0,-4,0,-4,0,-5,266,266,266,-1,266,266,-19,266,266,266,-2,266,266,-1,266,-4,266,-1,266,266,266,-4,266,-7,266,-1,266,-47,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266],
    sm128=[0,-4,0,-4,0,-5,68,68,68,-1,68,68,-19,68,68,68,-2,68,68,-1,68,-4,68,-1,68,68,68,-4,68,-7,68,-1,68,-47,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
    sm129=[0,-4,0,-4,0,-5,267,267,267,267,267,267,-19,267,267,267,267,-1,267,267,-1,267,-4,267,-1,267,267,267,-1,267,-1,267,267,267,-1,267,-4,267,267,267,-13,267,-23,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,-4,267,267],
    sm130=[0,-4,0,-4,0,-5,268,268,268,268,268,268,-19,268,268,268,268,-1,268,268,-1,268,-4,268,-1,268,268,268,-1,268,-1,268,268,268,-1,268,-4,268,268,268,-13,268,-23,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268,-4,268,268],
    sm131=[0,-4,0,-4,0,-5,137,137,137,137,137,137,-19,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,137,137,-1,137,-4,137,137,137,-13,137,-23,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
    sm132=[0,-1,2,57,-1,0,-4,0,-7,269,122,-34,8,9,-6,123,270,-8,16,-4,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm133=[0,-1,2,57,-1,0,-4,0,-10,272,-40,273,-41,274,275,-3,276,-57,48,49],
    sm134=[0,-4,0,-4,0,-5,277,277,277,277,277,277,-19,277,277,277,277,-1,277,277,-1,277,-4,277,-1,277,277,277,-1,277,-1,277,277,277,-1,277,-4,277,277,277,-13,277,-23,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,277,-4,277,277],
    sm135=[0,-4,0,-4,0,-5,278,278,278,278,278,278,-19,278,278,278,278,-1,278,278,-1,278,-4,278,-1,278,278,278,-1,278,-1,278,278,278,-1,278,-4,278,278,278,-13,278,-23,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,278,-4,278,278],
    sm136=[0,-4,0,-4,0,-5,279,279,279,-1,279,279,-19,279,279,279,-2,279,279,-1,279,-4,279,-1,279,279,279,-4,279,-7,279,-1,279,-47,279,279,279,279,279,279,279,279,279,279,279,279,279,279,279],
    sm137=[0,-4,0,-4,0,-5,280,280,280,-1,280,280,-19,280,280,280,-2,280,280,-1,280,-4,280,-1,280,280,280,-4,280,-7,280,-1,280,-47,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280],
    sm138=[0,-4,0,-4,0,-5,281,281,281,-1,281,281,-19,281,281,281,-2,281,281,-1,281,-4,281,-1,281,281,281,-4,281,-7,281,-1,281,-47,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281],
    sm139=[0,-4,0,-4,0,-5,282,282,282,-1,282,282,-19,282,282,282,-2,282,282,-1,282,-4,282,-1,282,282,282,-4,282,-7,282,-1,282,-47,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282],
    sm140=[0,-4,0,-4,0,-5,283,283,283,-1,283,283,-19,283,283,283,-2,283,283,-1,283,-4,283,-1,283,283,283,-4,283,-7,283,-1,283,-47,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283],
    sm141=[0,-4,0,-4,0,-5,284,284,284,-1,284,284,-19,284,284,284,-2,284,284,-1,284,-4,284,-1,284,284,284,-4,284,-7,284,-1,284,-47,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284],
    sm142=[0,-4,0,-4,0,-5,285,285,285,-1,285,285,-19,285,285,285,-2,285,285,-1,285,-4,285,-1,285,285,285,-4,285,-7,285,-1,285,-47,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285],
    sm143=[0,-4,0,-4,0,-5,286,286,286,-1,286,286,-19,286,286,286,-2,286,286,-1,286,-4,286,-1,286,286,286,-4,286,-7,286,-1,286,-47,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286],
    sm144=[0,-2,57,-1,0,-4,0],
    sm145=[0,-4,0,-4,0,-5,287,287,287,287,287,287,-19,287,287,287,287,-1,287,287,-1,287,-4,287,-1,287,287,287,-1,287,-1,287,287,287,-1,287,-4,287,287,287,-13,287,-23,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,-4,287,287],
    sm146=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,288,-3,17,18,-9,25,-17,35,36,-1,289,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm147=[0,-4,0,-4,0,-5,290,290,290,290,290,290,-19,290,290,290,290,-1,290,290,-1,290,-4,290,-1,290,290,290,-1,290,-1,290,290,290,-1,290,-4,290,290,290,-13,290,-23,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,290,-4,290,290],
    sm148=[0,-4,0,-4,0,-5,291,291,291,291,291,291,-19,291,291,291,291,-1,291,291,-1,291,-4,291,-1,291,291,291,-4,291,291,-1,291,-4,291,-1,291,-13,291,-23,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,291,-4,291,291],
    sm149=[0,-4,0,-4,0,-97,292],
    sm150=[0,-4,0,-4,0,-49,154,-1,155],
    sm151=[0,-4,0,-4,0,-156,293],
    sm152=[0,-2,148,-1,149,-4,0,-3,150,-152,294,294],
    sm153=[0,-2,295,-1,295,-4,0,-3,295,-152,295,295],
    sm154=[0,-2,296,-1,296,-4,0,-3,296,-152,296,296],
    sm155=[0,-2,297,-1,297,-4,0,-3,297,-152,297,297],
    sm156=[0,-4,0,-4,0,-157,298],
    sm157=[0,-4,0,-4,0,-5,299,299,299,299,299,299,-19,299,299,299,299,-1,299,299,-1,299,-4,299,-1,299,299,299,-1,299,-1,299,299,299,-1,299,-4,299,299,299,-13,299,-13,299,-9,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,-4,299,299],
    sm158=[0,-4,0,-4,0,-7,300,-54,301],
    sm159=[0,-4,0,-4,0,-5,137,137,137,-1,137,137,-19,137,137,137,137,-1,137,137,-1,137,-4,137,-1,137,137,137,-1,137,-1,137,137,137,-1,137,-4,137,137,137,-13,137,-13,139,-9,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
    sm160=[0,-4,0,-4,0,-5,302,302,302,302,302,302,-19,302,302,302,302,-1,302,302,-1,302,-4,302,-1,302,302,302,-1,302,-1,302,302,302,-1,302,-4,302,302,302,-13,302,-23,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,302,-4,302,302],
    sm161=[0,-4,0,-4,0,-5,303,303,303,-1,303,303,-19,303,303,303,-2,303,303,-1,303,-4,303,-1,303,303,303,-4,303,-7,303,-1,303,-47,303,303,303,303,303,303,303,303,303,303,303,303,303,303,303],
    sm162=[0,-1,2,57,-1,0,-4,0,-8,304,-34,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm163=[0,305,305,305,-1,0,-4,0,-8,305,305,305,-19,305,-12,305,305,-6,305,-9,305,-3,305,305,305,305,-1,305,305,305,305,305,305,-1,305,305,305,305,305,305,305,305,305,-2,305,305,-5,305,305,-2,305,-23,305,-1,305,305,305,305,305,305,305,305,305,305,-21,305,305],
    sm164=[0,-1,2,57,-1,0,-4,0,-8,58,5,-20,7,-12,8,9,-16,16,-4,17,-3,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,-6,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm165=[0,-4,0,-4,0,-7,306,-1,307],
    sm166=[0,-4,0,-4,0,-7,308,-1,308],
    sm167=[0,-4,0,-4,0,-7,309,-1,309,-23,310],
    sm168=[0,-4,0,-4,0,-33,310],
    sm169=[0,-4,0,-4,0,-7,139,139,139,139,-22,139,-4,139,-13,139,-8,139,139,-13,139,-14,139],
    sm170=[0,-4,0,-4,0,-7,311,-2,311,-22,311,-4,311,-13,311,-9,311,-13,311],
    sm171=[0,-1,2,57,-1,0,-4,0,-10,312,-40,273,-46,313,-57,48,49],
    sm172=[0,-2,57,-1,0,-4,0,-7,269,160,-42,161,314,-45,315],
    sm173=[0,-4,0,-4,0,-73,316],
    sm174=[0,-1,2,57,-1,0,-4,0,-8,122,317,-33,8,9,-6,123,-9,16,-4,17,18,19,-6,318,-1,25,-11,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm175=[0,-4,0,-4,0,-61,319],
    sm176=[0,320,320,320,-1,0,-4,0,-8,320,320,320,-19,320,-12,320,320,-6,320,-9,320,-3,320,320,320,320,-1,320,320,320,320,320,320,-1,320,320,320,320,320,320,320,320,320,-2,320,320,-5,320,320,-2,320,-23,320,-1,320,320,320,320,320,320,320,320,320,320,-21,320,320],
    sm177=[0,-4,0,-4,0,-9,321],
    sm178=[0,-4,0,-4,0,-9,138],
    sm179=[0,322,322,322,-1,0,-4,0,-8,322,322,322,-19,322,-12,322,322,-6,322,-9,322,-3,322,322,322,322,-1,322,322,322,322,322,322,-1,322,322,322,322,322,322,322,322,322,-2,322,322,-5,322,322,-2,322,-23,322,-1,322,322,322,322,322,322,322,322,322,322,-21,322,322],
    sm180=[0,-4,0,-4,0,-9,323],
    sm181=[0,324,324,324,-1,0,-4,0,-8,324,324,324,-19,324,-12,324,324,-6,324,-9,324,-3,324,324,324,324,-1,324,324,324,324,324,324,-1,324,324,324,324,324,324,324,324,324,-2,324,324,-5,324,324,-2,324,-23,324,-1,324,324,324,324,324,324,324,324,324,324,-21,324,324],
    sm182=[0,-4,0,-4,0,-7,64,-1,325],
    sm183=[0,-4,0,-4,0,-7,64,-1,326],
    sm184=[0,-4,0,-4,0,-86,327,328],
    sm185=[0,329,329,329,-1,0,-4,0,-8,329,329,329,-19,329,-12,329,329,-6,329,-9,329,-3,329,329,329,329,-1,329,329,329,329,329,329,-1,329,329,329,329,329,329,329,329,329,-2,329,329,-5,329,329,-2,329,-23,329,-1,329,329,329,329,329,329,329,329,329,329,-21,329,329],
    sm186=[0,330,-3,0,-4,0,-9,330],
    sm187=[0,-4,0,-4,0,-30,331],
    sm188=[0,332,-3,0,-4,0,-9,332],
    sm189=[0,-2,177,-1,0,-4,0,-135,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201],
    sm190=[0,-2,333,-1,0,-4,0,-31,334,-3,335,-120,336,337],
    sm191=[0,-2,333,-1,0,-4,0,-31,338,-3,339,-120,336,337],
    sm192=[0,-2,333,-1,0,-4,0,-156,336,337],
    sm193=[0,-4,178,-4,179,-3,180,-27,340],
    sm194=[0,-2,341,-1,0,-4,0,-31,341,-3,341,-120,341,341],
    sm195=[0,-2,342,-1,0,-4,0,-31,342,-3,342,-120,342,342],
    sm196=[0,-4,343,-4,343,-3,343,343,-25,343,343,-102,343],
    sm197=[0,-4,344,-4,344,-3,344,344,-25,344,344,-102,344],
    sm198=[0,-4,0,-4,0,-8,205,-82,206],
    sm199=[0,345,345,345,-1,0,-4,0,-5,345,345,345,345,345,345,-19,345,345,345,345,-1,345,345,-1,345,-4,345,345,345,345,345,-1,345,-1,345,345,345,-1,345,-4,345,345,345,-2,345,345,345,345,-1,345,-1,345,345,345,345,345,345,345,345,345,345,345,345,345,345,-2,345,345,-5,345,345,-2,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,345,-21,345,345],
    sm200=[0,-4,0,-4,0,-8,346],
    sm201=[0,-1,2,57,-1,0,-4,0,-9,347,348,-40,273,-40,349,274,275,-61,48,49],
    sm202=[0,-1,2,57,-1,0,-4,0,-8,122,-42,123,-9,16,-4,17,18,-27,35,36,-2,37,-31,45,46,47,-22,48,49],
    sm203=[0,-2,57,-1,0,-4,0,-8,160,-42,161,-10,350,-35,315],
    sm204=[0,-4,0,-4,0,-61,351],
    sm205=[0,-4,0,-4,0,-7,352,-1,353],
    sm206=[0,-4,0,-4,0,-7,354,-1,354],
    sm207=[0,355,-1,213,-1,0,-4,0,-8,214,-6,6,-30,10,11,12,13,-1,14,-8,15,-73,355],
    sm208=[0,356,-1,356,-1,0,-4,0,-8,356,216,-5,356,-30,356,356,356,356,-1,356,-8,356,-73,356],
    sm209=[0,-2,253,-1,0,-4,0,-15,6],
    sm210=[0,-2,141,-1,0,-4,0,-7,141,141,-22,141,-1,141,-9,141,141,141,141,143,141,141,-1,141,141,141,141,141,-4,141,-1,141],
    sm211=[0,357,-1,357,-1,0,-4,0,-8,357,-6,357,-30,357,357,357,357,-1,357,-8,357,-73,357],
    sm212=[0,358,-1,358,-1,0,-4,0,-8,358,358,358,-4,358,-30,358,358,358,358,-1,358,-8,358,-73,358],
    sm213=[0,-4,359,-4,0,-40,360,-115,361,362],
    sm214=[0,-2,363,-1,0,-4,0,-23,364,-2,365,-34,366],
    sm215=[0,-4,0,-4,0,-18,367,-137,361,362],
    sm216=[0,-2,368,-1,0,-4,369,-23,370,-37,371],
    sm217=[0,-2,213,-1,0,-4,0,-46,10,11,12,13,-1,14,-8,15],
    sm218=[0,-2,213,-1,0,-4,0,-7,372,372,-22,227,-11,228,229,230,10,11,12,13,-1,14,-8,15,-1,372],
    sm219=[0,-2,373,-1,0,-4,0,-7,373,373,-22,373,-11,373,373,373,373,373,373,373,-1,373,-8,373,-1,373],
    sm220=[0,-2,374,-1,0,-4,0,-7,374,374,-22,374,-11,374,374,374,374,374,374,374,-1,374,-8,374,-1,374],
    sm221=[0,-2,375,-1,0,-4,0,-46,375,375,375,375,-1,375,-8,375],
    sm222=[0,-2,376,-1,0,-4,0,-7,376,376,-22,376,-11,376,376,376,376,376,12,13,-1,14,-8,15,-1,376],
    sm223=[0,-2,376,-1,0,-4,0,-7,376,376,-22,376,-11,376,376,376,376,376,376,376,-1,376,-8,232,-1,376],
    sm224=[0,-2,377,-1,0,-4,0,-7,377,377,-22,377,-11,377,377,377,377,377,377,377,-1,377,-8,377,-1,377],
    sm225=[0,-2,378,-1,0,-4,0,-7,378,378,-22,378,-11,378,378,378,378,378,378,378,-1,378,-8,378,-1,378],
    sm226=[0,-4,0,-4,0,-60,244],
    sm227=[0,-2,379,-1,0,-4,0,-7,379,379,-22,379,-11,379,379,379,379,379,379,379,-1,379,-8,379,-1,379],
    sm228=[0,-2,380,-1,0,-4,0,-7,380,380,-22,380,-1,380,-9,380,380,380,380,380,380,380,-1,380,380,380,380,380,-4,380,-1,380],
    sm229=[0,-2,381,-1,0,-4,0,-46,381],
    sm230=[0,-2,382,-1,0,-4,0,-7,382,382,-22,382,-11,382,382,382,382,382,382,382,-1,382,-8,382,-1,382],
    sm231=[0,-2,383,-1,0,-4,0,-7,383,383,-22,383,-11,383,383,383,383,383,383,383,-1,383,-8,383,-1,383],
    sm232=[0,-4,0,-4,0,-33,384,-10,385,-7,386,387,388,389],
    sm233=[0,-2,234,-1,0,-4,0],
    sm234=[0,-4,0,-4,0,-47,143],
    sm235=[0,-2,390,-1,0,-4,0,-7,390,390,-22,390,-11,390,390,390,390,390,390,390,-1,390,-8,390,391,390],
    sm236=[0,-2,392,-1,0,-4,0,-7,392,392,-22,392,-11,392,392,392,392,392,392,392,-1,392,-8,392,-1,392],
    sm237=[0,-2,243,-1,0,-4,0],
    sm238=[0,-2,393,-1,0,-4,0,-7,393,393,-22,393,-11,393,393,393,393,393,393,393,-1,393,-8,244,-1,393],
    sm239=[0,-2,394,-1,0,-4,0,-7,394,394,-22,394,-11,394,394,394,394,394,394,394,-1,394,-8,394,-1,394],
    sm240=[0,395,395,395,-1,0,-4,0,-8,395,395,395,-19,395,-12,395,395,-6,395,-9,395,-3,395,395,395,395,-1,395,395,395,395,395,395,-1,395,395,395,395,395,395,395,395,395,395,395,395,395,-5,395,395,-2,395,-23,395,-1,395,395,395,395,395,395,395,395,395,395,-21,395,395],
    sm241=[0,-4,0,-4,0,-10,396],
    sm242=[0,397,-1,397,-1,0,-4,0,-8,397,-1,397,-4,397,-30,397,397,397,397,-1,397,-8,397,-73,397],
    sm243=[0,-2,398,-1,0,-4,0,-9,398,398,-4,398],
    sm244=[0,-2,399,-1,0,-4,0,-9,400,399,-4,399],
    sm245=[0,-2,401,-1,0,-4,0,-9,401,401,-4,401],
    sm246=[0,-2,402,-1,0,-4,0,-9,402,402,-4,402],
    sm247=[0,-4,0,-4,0,-60,256],
    sm248=[0,-4,403,-4,0,-3,404,-57,405],
    sm249=[0,-2,253,-1,0,-4,0,-9,406,406,-4,406],
    sm250=[0,-4,0,-4,0,-5,407,407,407,-1,407,-42,407,-7,407,-1,407],
    sm251=[0,-4,0,-4,0,-5,408,408,408,-1,408,408,-41,408,-7,408,-1,408],
    sm252=[0,-4,0,-4,0,-60,409],
    sm253=[0,-4,0,-4,0,-5,410,410,410,-1,410,410,-34,410,-6,410,-7,410,-1,410,-47,410,88],
    sm254=[0,-4,0,-4,0,-5,411,411,411,-1,411,411,-34,411,-1,90,-4,411,-7,411,-1,411,-47,411,411],
    sm255=[0,-4,0,-4,0,-5,412,412,412,-1,412,412,-34,412,-1,412,-4,412,-7,412,-1,412,-47,412,412,92],
    sm256=[0,-4,0,-4,0,-5,413,413,413,-1,413,413,-34,413,-1,413,-4,413,-7,413,-1,413,-47,413,413,413,94],
    sm257=[0,-4,0,-4,0,-5,414,414,414,-1,414,414,-34,414,-1,414,-4,414,-7,414,-1,414,-47,414,414,414,414,96,97,98,99],
    sm258=[0,-4,0,-4,0,-5,415,415,415,-1,415,415,-19,101,102,103,-5,104,-6,415,-1,415,-4,415,-7,415,-1,415,-47,415,415,415,415,415,415,415,415,105,106],
    sm259=[0,-4,0,-4,0,-5,416,416,416,-1,416,416,-19,101,102,103,-5,104,-6,416,-1,416,-4,416,-7,416,-1,416,-47,416,416,416,416,416,416,416,416,105,106],
    sm260=[0,-4,0,-4,0,-5,417,417,417,-1,417,417,-19,101,102,103,-5,104,-6,417,-1,417,-4,417,-7,417,-1,417,-47,417,417,417,417,417,417,417,417,105,106],
    sm261=[0,-4,0,-4,0,-5,418,418,418,-1,418,418,-19,101,102,103,-5,104,-6,418,-1,418,-4,418,-7,418,-1,418,-47,418,418,418,418,418,418,418,418,105,106],
    sm262=[0,-4,0,-4,0,-5,419,419,419,-1,419,419,-19,419,419,419,-5,419,-6,419,-1,419,-4,419,-7,419,-1,419,-47,419,419,419,419,419,419,419,419,419,419,108,109,110],
    sm263=[0,-4,0,-4,0,-5,420,420,420,-1,420,420,-19,420,420,420,-5,420,-6,420,-1,420,-4,420,-7,420,-1,420,-47,420,420,420,420,420,420,420,420,420,420,108,109,110],
    sm264=[0,-4,0,-4,0,-5,421,421,421,-1,421,421,-19,421,421,421,-5,421,-6,421,-1,421,-4,421,-7,421,-1,421,-47,421,421,421,421,421,421,421,421,421,421,108,109,110],
    sm265=[0,-4,0,-4,0,-5,422,422,422,-1,422,422,-19,422,422,422,-5,422,-6,422,-1,422,-4,422,-7,422,-1,422,-47,422,422,422,422,422,422,422,422,422,422,108,109,110],
    sm266=[0,-4,0,-4,0,-5,423,423,423,-1,423,423,-19,423,423,423,-5,423,-6,423,-1,423,-4,423,-7,423,-1,423,-47,423,423,423,423,423,423,423,423,423,423,108,109,110],
    sm267=[0,-4,0,-4,0,-5,424,424,424,-1,424,424,-19,424,424,424,-5,424,-6,424,-1,424,-4,424,-7,424,-1,424,-47,424,424,424,424,424,424,424,424,424,424,108,109,110],
    sm268=[0,-4,0,-4,0,-5,425,425,425,-1,425,425,-19,425,425,425,-5,425,-4,112,-1,425,-1,425,-4,425,-7,425,-1,425,-47,425,425,425,425,425,425,425,425,425,425,425,425,425,113],
    sm269=[0,-4,0,-4,0,-5,426,426,426,-1,426,426,-19,426,426,426,-5,426,-4,112,-1,426,-1,426,-4,426,-7,426,-1,426,-47,426,426,426,426,426,426,426,426,426,426,426,426,426,113],
    sm270=[0,-4,0,-4,0,-5,427,427,427,-1,427,427,-19,427,427,427,-5,427,-4,112,-1,427,-1,427,-4,427,-7,427,-1,427,-47,427,427,427,427,427,427,427,427,427,427,427,427,427,113],
    sm271=[0,-4,0,-4,0,-5,428,428,428,-1,428,428,-19,428,428,428,-2,115,116,-1,428,-4,428,-1,428,117,428,-4,428,-7,428,-1,428,-47,428,428,428,428,428,428,428,428,428,428,428,428,428,428],
    sm272=[0,-4,0,-4,0,-5,429,429,429,-1,429,429,-19,429,429,429,-2,115,116,-1,429,-4,429,-1,429,117,429,-4,429,-7,429,-1,429,-47,429,429,429,429,429,429,429,429,429,429,429,429,429,429],
    sm273=[0,-4,0,-4,0,-5,430,430,430,-1,430,430,-19,430,430,430,-2,430,430,-1,430,-4,430,-1,430,430,430,-4,430,-7,430,-1,430,-47,430,430,430,430,430,430,430,430,430,430,430,430,430,430],
    sm274=[0,-4,0,-4,0,-5,431,431,431,-1,431,431,-19,431,431,431,-2,431,431,-1,431,-4,431,-1,431,431,431,-4,431,-7,431,-1,431,-47,431,431,431,431,431,431,431,431,431,431,431,431,431,431],
    sm275=[0,-4,0,-4,0,-5,432,432,432,-1,432,432,-19,432,432,432,-2,432,432,-1,432,-4,432,-1,432,432,432,-4,432,-7,432,-1,432,-47,432,432,432,432,432,432,432,432,432,432,432,432,432,432],
    sm276=[0,-4,0,-4,0,-5,433,433,433,-1,433,433,-19,433,433,433,-2,433,433,-1,433,-4,433,-1,433,433,433,-4,433,-7,433,-1,433,-47,433,433,433,433,433,433,433,433,433,433,433,433,433,433],
    sm277=[0,-4,0,-4,0,-5,434,434,434,434,434,434,-19,434,434,434,434,-1,434,434,-1,434,-4,434,-1,434,434,434,-1,434,-1,434,434,434,-1,434,-4,434,434,434,-13,434,-23,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,-4,434,434],
    sm278=[0,-1,2,57,-1,0,-4,0,-7,435,122,-34,8,9,-6,123,436,-8,16,-4,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm279=[0,-4,0,-4,0,-7,437,-44,438],
    sm280=[0,-1,439,439,-1,0,-4,0,-7,439,439,-34,439,439,-6,439,439,-8,439,-4,439,439,-9,439,-17,439,439,-1,439,439,-23,439,-1,439,439,439,439,439,439,439,439,439,-22,439,439],
    sm281=[0,-4,0,-4,0,-7,440,-44,440],
    sm282=[0,-4,0,-4,0,-5,441,441,441,441,441,441,-19,441,441,441,441,-1,441,441,-1,441,-4,441,-1,441,441,441,-1,441,-1,441,441,441,-1,441,-4,441,441,441,-13,441,-23,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,-4,441,441],
    sm283=[0,-4,0,-4,0,-7,442,-2,443],
    sm284=[0,-4,0,-4,0,-7,444,-2,444],
    sm285=[0,-4,0,-4,0,-7,445,-2,445],
    sm286=[0,-4,0,-4,0,-7,445,-2,445,-22,310],
    sm287=[0,-4,0,-4,0,-60,446,447],
    sm288=[0,-4,0,-4,0,-7,140,-2,140,-22,140,-26,448,448],
    sm289=[0,-1,2,57,-1,0,-4,0,-51,273,-104,48,49],
    sm290=[0,-4,0,-4,0,-60,449,449],
    sm291=[0,-4,0,-4,0,-60,448,448],
    sm292=[0,-4,0,-4,0,-5,450,450,450,450,450,450,-19,450,450,450,450,-1,450,450,-1,450,-4,450,-1,450,450,450,-1,450,-1,450,450,450,-1,450,-4,450,450,450,-13,450,-23,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,-4,450,450],
    sm293=[0,-4,0,-4,0,-7,64,-44,451],
    sm294=[0,-4,0,-4,0,-5,452,452,452,452,452,452,-19,452,452,452,452,-1,452,452,-1,452,-4,452,-1,452,452,452,-1,452,-1,452,452,452,-1,452,-4,452,452,452,-13,452,-23,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,452,-4,452,452],
    sm295=[0,-4,0,-4,0,-7,453,-54,454],
    sm296=[0,-4,0,-4,0,-7,455,-54,455],
    sm297=[0,-4,0,-4,0,-7,64,-44,456],
    sm298=[0,-4,0,-4,0,-5,457,457,457,457,457,457,-19,457,457,457,457,-1,457,457,-1,457,-4,457,-1,457,457,457,-1,457,-1,457,457,457,-1,457,-4,457,457,457,-13,457,-23,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,-4,457,457],
    sm299=[0,-4,0,-4,0,-5,458,458,458,458,458,458,-19,458,458,458,458,-1,458,458,-1,458,-4,458,-1,458,458,458,-1,458,-1,458,458,458,-1,458,-4,458,458,458,-13,458,-23,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-4,458,458],
    sm300=[0,-4,0,-4,0,-5,459,459,459,459,459,459,-19,459,459,459,459,-1,459,459,-1,459,-4,459,-1,459,459,459,-1,459,-1,459,459,459,-1,459,-4,459,459,459,-13,459,-23,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,-4,459,459],
    sm301=[0,-2,460,-1,0,-4,0,-5,460,460,460,460,460,460,-19,460,460,460,460,-1,460,460,-1,460,-4,460,-1,460,460,460,-1,460,-1,460,460,460,-1,460,-4,460,460,460,-13,460,-23,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-4,460,460,-25,460,460],
    sm302=[0,-2,461,-1,461,-4,0,-3,461,-152,461,461],
    sm303=[0,-4,0,-4,0,-5,462,462,462,462,462,462,-19,462,462,462,462,-1,462,462,-1,462,-4,462,-1,462,462,462,-1,462,-1,462,462,462,-1,462,-4,462,462,462,-13,462,-13,462,-9,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,462,-4,462,462],
    sm304=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,463,-3,17,18,-9,25,-17,35,36,-1,464,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm305=[0,-4,0,-4,0,-62,465],
    sm306=[0,-4,0,-4,0,-62,466],
    sm307=[0,-4,0,-4,0,-5,467,467,467,467,467,467,-19,467,467,467,467,-1,467,467,-1,467,-4,467,-1,467,467,467,-1,467,-1,467,467,467,-1,467,-4,467,467,467,-13,467,-23,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,467,-4,467,467],
    sm308=[0,-4,0,-4,0,-7,64,-44,468],
    sm309=[0,-4,0,-4,0,-5,469,469,469,-1,469,469,-41,469,-7,469,-1,469],
    sm310=[0,-4,0,-4,0,-5,470,470,470,-1,470,470,-41,470,-7,470,-1,470],
    sm311=[0,471,471,471,-1,0,-4,0,-8,471,471,471,-19,471,-12,471,471,-6,471,-9,471,-3,471,471,471,471,-1,471,471,471,471,471,471,-1,471,471,471,471,471,471,471,471,471,-2,471,471,-5,471,471,-2,471,-23,471,-1,471,471,471,471,471,471,471,471,471,471,-21,471,471],
    sm312=[0,472,472,472,-1,0,-4,0,-8,472,472,472,-19,472,-12,472,472,-6,472,-9,472,-3,472,472,472,472,-1,472,472,472,472,472,472,-1,472,472,472,472,472,472,472,472,472,-2,472,472,-5,472,472,-2,472,-23,472,-1,472,472,472,472,472,472,472,472,472,472,-21,472,472],
    sm313=[0,473,473,473,-1,0,-4,0,-8,473,473,473,-19,473,-12,473,473,-6,473,-9,473,-3,473,473,473,473,-1,473,473,473,473,473,473,-1,473,473,473,473,473,473,473,473,473,-2,473,473,-5,473,473,-2,473,-23,473,-1,473,473,473,473,473,473,473,473,473,473,-21,473,473],
    sm314=[0,-4,0,-4,0,-7,474,-1,474],
    sm315=[0,-4,0,-4,0,-7,475,-2,475,-22,475,-4,475,-13,475,-9,475,-13,475],
    sm316=[0,-4,0,-4,0,-10,476],
    sm317=[0,-4,0,-4,0,-7,477,-2,478],
    sm318=[0,-4,0,-4,0,-7,479,-2,479],
    sm319=[0,-4,0,-4,0,-7,480,-2,480],
    sm320=[0,-4,0,-4,0,-60,481],
    sm321=[0,-4,0,-4,0,-7,482,-2,482,-22,310,-18,482,-9,482],
    sm322=[0,-4,0,-4,0,-7,483,-2,483,-22,483,-4,483,-13,483,-9,483,-13,483],
    sm323=[0,-2,57,-1,0,-4,0,-7,435,160,-42,161,484,-45,315],
    sm324=[0,-4,0,-4,0,-52,485],
    sm325=[0,-4,0,-4,0,-7,486,-44,487],
    sm326=[0,-4,0,-4,0,-7,488,-44,488],
    sm327=[0,-4,0,-4,0,-7,489,-44,489],
    sm328=[0,-4,0,-4,0,-7,490,-2,490,-41,490,-9,490],
    sm329=[0,-4,0,-4,0,-7,490,-2,490,-22,310,-18,490,-9,490],
    sm330=[0,-4,0,-4,0,-7,64,-54,491],
    sm331=[0,-4,0,-4,0,-61,492],
    sm332=[0,-4,0,-4,0,-7,64,-54,493],
    sm333=[0,-4,0,-4,0,-7,64,-1,494],
    sm334=[0,-1,2,57,-1,0,-4,0,-8,122,495,-33,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm335=[0,-1,2,57,-1,0,-4,0,-8,122,496,-33,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm336=[0,-4,0,-4,0,-7,68,-1,68,-20,68,68,68,69,-1,68,68,-1,497,-4,68,-1,68,68,68,-5,70,-1,71,-20,498,-23,72,73,74,75,76,77,78,79,80,81,68,68,68,68,68,68,68,68,68,68,68,68,68,68,68,-4,82,83],
    sm337=[0,-4,0,-4,0,-38,499,-37,500],
    sm338=[0,-1,2,57,-1,0,-4,0,-8,122,-42,123,-9,16,-4,17,18,19,-6,501,-13,34,-5,35,36,-2,37,-31,45,46,47,-22,48,49],
    sm339=[0,-4,0,-4,0,-7,64,-54,502],
    sm340=[0,503,503,503,-1,0,-4,0,-8,503,503,503,-19,503,-12,503,503,-6,503,-9,503,-3,503,503,503,503,-1,503,503,503,503,503,503,-1,503,503,503,503,503,503,503,503,503,-2,503,503,-5,503,503,-2,503,-23,503,-1,503,503,503,503,503,503,503,503,503,503,-21,503,503],
    sm341=[0,504,504,504,-1,0,-4,0,-8,504,504,504,-19,504,-12,504,504,-6,504,-9,504,-3,504,504,504,504,-1,504,504,504,504,504,504,-1,504,504,504,504,504,504,504,504,504,-2,504,504,-5,504,504,-2,504,-23,504,-1,504,504,504,504,504,504,504,504,504,504,-21,504,504],
    sm342=[0,505,505,505,-1,0,-4,0,-8,505,505,505,-19,505,-12,505,505,-6,505,-9,505,-3,505,505,505,505,-1,505,505,505,505,505,505,-1,505,505,505,505,505,505,505,505,505,-2,505,505,-5,505,505,-2,505,-23,505,-1,505,505,505,505,505,505,505,505,505,505,-21,505,505],
    sm343=[0,-4,0,-4,0,-7,64,-54,506],
    sm344=[0,507,507,507,-1,0,-4,0,-8,507,507,507,-19,507,-12,507,507,-6,507,-9,507,-3,507,507,507,507,-1,507,507,507,507,507,507,-1,507,507,507,507,507,507,507,507,507,-2,507,507,-5,507,507,-2,507,-23,507,-1,507,507,507,507,507,507,507,507,507,507,-21,507,507],
    sm345=[0,508,508,508,-1,0,-4,0,-8,508,508,508,-19,508,-12,508,508,-6,508,-9,508,-3,508,508,508,508,-1,508,508,508,508,508,508,-1,508,508,508,508,508,508,508,508,508,-1,328,508,508,-5,508,508,-2,508,-23,508,-1,508,508,508,508,508,508,508,508,508,508,-21,508,508],
    sm346=[0,509,509,509,-1,0,-4,0,-8,509,509,509,-19,509,-12,509,509,-6,509,-9,509,-3,509,509,509,509,-1,509,509,509,509,509,509,-1,509,509,509,509,509,509,509,509,509,-2,509,509,-5,509,509,-2,509,-23,509,-1,509,509,509,509,509,509,509,509,509,509,-21,509,509],
    sm347=[0,-4,0,-4,0,-61,510],
    sm348=[0,-2,333,-1,0,-4,0,-31,511,-3,512,-120,336,337],
    sm349=[0,-4,178,-4,179,-3,180,513,-25,514,-103,515],
    sm350=[0,-4,0,-4,0,-31,516],
    sm351=[0,-2,517,-1,0,-4,0,-31,517,-3,517,-120,517,517],
    sm352=[0,-2,518,-1,0,-4,0,-31,518,-1,519,-1,518,-120,518,518],
    sm353=[0,-2,520,-1,0,-4,0],
    sm354=[0,-2,521,-1,0,-4,0],
    sm355=[0,-2,522,-1,0,-4,0,-31,522,-1,522,-1,522,-120,522,522],
    sm356=[0,-2,333,-1,0,-4,0,-31,523,-3,524,-120,336,337],
    sm357=[0,525,-3,525,-4,525,-3,525,525,-4,525,-20,525,-103,526],
    sm358=[0,-4,0,-4,0,-31,527],
    sm359=[0,-2,333,-1,0,-4,0,-31,528,-124,336,337],
    sm360=[0,-2,333,-1,0,-4,0,-31,529,-124,336,337],
    sm361=[0,-4,530,-4,530,-3,530,530,-25,530,-103,530],
    sm362=[0,-4,531,-4,531,-3,531,531,-25,531,531,-102,531],
    sm363=[0,-2,333,-1,0,-4,0,-31,532,-3,533,-120,336,337],
    sm364=[0,534,534,534,-1,0,-4,0,-5,534,534,534,534,534,534,-19,534,534,534,534,-1,534,534,-1,534,-4,534,534,534,534,534,-1,534,-1,534,534,534,-1,534,-4,534,534,534,-2,534,534,534,534,-1,534,-1,534,534,534,534,534,534,534,534,534,534,534,534,534,534,-2,534,534,-5,534,534,-2,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,534,-21,534,534],
    sm365=[0,-1,2,57,-1,0,-4,0,-9,347,535,-40,273,-40,349,274,275,-61,48,49],
    sm366=[0,-4,0,-4,0,-10,536],
    sm367=[0,537,537,537,-1,0,-4,0,-5,537,537,537,537,537,537,-19,537,537,537,537,-1,537,537,-1,537,-4,537,537,537,537,537,-1,537,-1,537,537,537,-1,537,-4,537,537,537,-2,537,537,537,537,-1,537,-1,537,537,537,537,537,537,537,537,537,537,537,537,537,537,-2,537,537,-5,537,537,-2,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,537,-21,537,537],
    sm368=[0,-1,2,57,-1,0,-4,0,-9,347,538,-40,273,-40,349,274,275,-61,48,49],
    sm369=[0,-1,539,539,-1,0,-4,0,-9,539,539,-40,539,-40,539,539,539,-61,539,539],
    sm370=[0,-1,540,540,-1,0,-4,0,-9,540,540,-40,540,-40,540,540,540,-61,540,540],
    sm371=[0,-1,2,57,-1,0,-4,0,-51,273,-41,274,275,-61,48,49],
    sm372=[0,-4,0,-4,0,-61,447],
    sm373=[0,-4,0,-4,0,-61,448],
    sm374=[0,-4,0,-4,0,-8,541],
    sm375=[0,-4,0,-4,0,-62,542],
    sm376=[0,-4,0,-4,0,-62,543],
    sm377=[0,-4,0,-4,0,-7,544,-54,543],
    sm378=[0,-4,0,-4,0,-62,545],
    sm379=[0,-4,0,-4,0,-7,546,-54,546],
    sm380=[0,-4,0,-4,0,-7,547,-54,547],
    sm381=[0,548,548,548,-1,0,-4,0,-8,548,548,548,-19,548,-12,548,548,-6,548,-9,548,-3,548,548,548,548,-1,548,-1,548,548,548,548,-1,548,548,548,548,548,548,548,548,548,-2,548,548,-5,548,548,-2,548,-23,548,-1,548,548,548,548,548,548,548,548,548,548,-21,548,548],
    sm382=[0,-4,0,-4,0,-7,549,-1,549],
    sm383=[0,-4,550,-4,0,-40,360,-115,361,362],
    sm384=[0,551,-1,363,-1,0,-4,0,-8,551,551,-2,552,-2,551,-7,364,-2,365,-19,551,551,551,551,-1,551,-8,551,366,-72,551],
    sm385=[0,-4,553,-4,0,-40,553,-115,553,553],
    sm386=[0,554,-1,554,-1,0,-4,0,-8,554,554,-2,554,-2,554,-7,554,-2,554,-19,554,554,554,554,-1,554,-8,554,554,-72,554],
    sm387=[0,-4,0,-4,0,-3,555],
    sm388=[0,-4,0,-4,0,-61,556],
    sm389=[0,-4,0,-4,0,-7,557,558],
    sm390=[0,559,-1,559,-1,0,-4,0,-7,559,559,559,-5,559,-30,559,559,559,559,-1,559,-8,559,-73,559],
    sm391=[0,560,-1,560,-1,0,-4,0,-7,560,560,560,-5,560,-30,560,560,560,560,-1,560,-8,560,-73,560],
    sm392=[0,-2,561,-1,0,-4,0],
    sm393=[0,560,-1,560,-1,0,-4,0,-7,560,560,560,-5,560,-5,562,-24,560,560,560,560,-1,560,-8,560,-73,560],
    sm394=[0,563,-1,563,-1,0,-4,0,-7,563,563,563,-5,563,-30,563,563,563,563,-1,563,-8,563,-1,563,-71,563],
    sm395=[0,564,-1,564,-1,0,-4,0,-7,564,564,564,-5,564,-30,564,564,564,564,-1,564,-8,564,-1,564,-71,564],
    sm396=[0,564,-1,564,-1,0,-4,0,-7,564,564,564,-5,564,-5,565,566,-23,564,564,564,564,-1,564,-8,564,-1,564,-71,564],
    sm397=[0,-2,368,-1,0,-4,0,-61,366],
    sm398=[0,-1,567,568,-1,0,-4,0,-23,569,-37,366],
    sm399=[0,570,-1,570,-1,0,-4,0,-7,570,570,570,-5,570,-5,570,570,-23,570,570,570,570,-1,570,-8,570,-1,570,-71,570],
    sm400=[0,571,-1,571,-1,0,-4,0,-7,571,571,571,-5,571,-5,571,-24,571,571,571,571,-1,571,-8,571,572,-72,571],
    sm401=[0,-2,573,-1,0,-4,0],
    sm402=[0,-4,0,-4,0,-8,574],
    sm403=[0,-4,0,-4,0,-8,575],
    sm404=[0,-4,0,-4,0,-8,576],
    sm405=[0,-2,368,-1,0,-4,369,-61,371],
    sm406=[0,-4,0,-4,0,-8,577,-12,578,579,-39,577],
    sm407=[0,-2,580,-1,0,-4,369,-23,370,-37,371],
    sm408=[0,-4,0,-4,0,-8,581,-12,581,581,-39,581],
    sm409=[0,-4,0,-4,0,-8,582,-12,582,582,-39,582],
    sm410=[0,-4,0,-4,0,-61,583],
    sm411=[0,-4,0,-4,0,-61,572],
    sm412=[0,-2,253,-1,0,-4,0,-9,584,585,-4,6],
    sm413=[0,-4,0,-4,0,-7,586,586],
    sm414=[0,-2,587,-1,0,-4,0,-7,587,587,-22,587,-11,587,587,587,587,587,587,587,-1,587,-8,587,-1,587],
    sm415=[0,-2,588,-1,0,-4,0,-7,588,588,-22,588,-11,588,588,588,588,588,588,588,-1,588,-8,588,-1,588],
    sm416=[0,-2,589,-1,0,-4,0,-7,589,589,-22,589,-11,589,589,589,589,589,589,589,-1,589,-8,232,-1,589],
    sm417=[0,-2,590,-1,0,-4,0,-7,590,590,-22,590,-11,590,590,590,590,590,590,590,-1,590,-8,590,-1,590],
    sm418=[0,-2,591,592,0,-4,0],
    sm419=[0,-4,0,-4,0,-33,593],
    sm420=[0,-2,594,594,0,-4,0],
    sm421=[0,-2,595,-1,0,-4,0,-7,595,595,-22,595,-11,595,595,595,595,595,595,595,-1,595,-8,595,-1,595],
    sm422=[0,-2,596,-1,0,-4,0,-7,596,596,-22,596,-11,596,596,596,596,596,596,596,-1,596,-8,596,-1,596],
    sm423=[0,597,-1,597,-1,0,-4,0,-8,597,-1,597,-4,597,-30,597,597,597,597,-1,597,-8,597,-73,597],
    sm424=[0,-2,253,-1,0,-4,0,-9,598,598,-4,598],
    sm425=[0,-2,599,-1,403,-4,0,-3,404,-5,599,599,-4,599,-45,405,599,-65,600],
    sm426=[0,-2,601,-1,403,-4,0,-3,404,-5,601,601,-4,601,-45,601,601,-65,601],
    sm427=[0,-2,602,-1,602,-4,0,-3,602,-5,602,602,-4,602,-45,602,602,-65,602],
    sm428=[0,-2,603,-1,603,-4,0,-3,603,-5,603,603,-4,603,-45,603,603,-65,603],
    sm429=[0,-2,604,-1,0,-4,0,-9,604,604,-4,604],
    sm430=[0,-4,0,-4,0,-5,605,605,605,605,605,605,-19,605,605,605,605,-1,605,605,-1,605,-4,605,-1,605,605,605,-1,605,-1,605,605,605,-1,605,-4,605,605,605,-13,605,-23,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,-4,605,605],
    sm431=[0,-1,606,606,-1,0,-4,0,-7,606,606,-34,606,606,-6,606,606,-8,606,-4,606,606,-9,606,-17,606,606,-1,606,606,-23,606,-1,606,606,606,606,606,606,606,606,606,-22,606,606],
    sm432=[0,-4,0,-4,0,-7,607,-44,607],
    sm433=[0,-4,0,-4,0,-5,608,608,608,608,608,608,-19,608,608,608,608,-1,608,608,-1,608,-4,608,-1,608,608,608,-1,608,-1,608,608,608,-1,608,-4,608,608,608,-13,608,-23,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,-4,608,608],
    sm434=[0,-4,0,-4,0,-7,435,-44,609],
    sm435=[0,-1,2,57,-1,0,-4,0,-7,269,122,-34,8,9,-6,123,439,-8,16,-4,17,18,-9,25,-17,35,36,-1,271,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm436=[0,-4,0,-4,0,-7,610,-44,610],
    sm437=[0,-4,0,-4,0,-5,611,611,611,611,611,611,-19,611,611,611,611,-1,611,611,-1,611,-4,611,-1,611,611,611,-1,611,-1,611,611,611,-1,611,-4,611,611,611,-13,611,-23,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,611,-4,611,611],
    sm438=[0,-1,2,57,-1,0,-4,0,-10,612,-40,273,-41,274,275,-3,276,-57,48,49],
    sm439=[0,-4,0,-4,0,-7,613,-2,613],
    sm440=[0,-4,0,-4,0,-7,614,-2,614],
    sm441=[0,-4,0,-4,0,-61,615],
    sm442=[0,-4,0,-4,0,-61,616],
    sm443=[0,-4,0,-4,0,-52,617],
    sm444=[0,-4,0,-4,0,-5,618,618,618,618,618,618,-19,618,618,618,618,-1,618,618,-1,618,-4,618,-1,618,618,618,-1,618,-1,618,618,618,-1,618,-4,618,618,618,-13,618,-23,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,-4,618,618],
    sm445=[0,-4,0,-4,0,-5,619,619,619,619,619,619,-19,619,619,619,619,-1,619,619,-1,619,-4,619,-1,619,619,619,-1,619,-1,619,619,619,-1,619,-4,619,619,619,-13,619,-23,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,619,-4,619,619],
    sm446=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,620,-3,17,18,-9,25,-17,35,36,-1,621,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm447=[0,-4,0,-4,0,-7,622,-54,622],
    sm448=[0,-4,0,-4,0,-5,623,623,623,623,623,623,-19,623,623,623,623,-1,623,623,-1,623,-4,623,-1,623,623,623,-1,623,-1,623,623,623,-1,623,-4,623,623,623,-13,623,-23,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,-4,623,623],
    sm449=[0,-4,0,-4,0,-5,624,624,624,624,624,624,-19,624,624,624,624,-1,624,624,-1,624,-4,624,-1,624,624,624,-1,624,-1,624,624,624,-1,624,-4,624,624,624,-13,624,-13,624,-9,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,-4,624,624],
    sm450=[0,-4,0,-4,0,-5,625,625,625,625,625,625,-19,625,625,625,625,-1,625,625,-1,625,-4,625,-1,625,625,625,-1,625,-1,625,625,625,-1,625,-4,625,625,625,-13,625,-13,625,-9,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,-4,625,625],
    sm451=[0,-4,0,-4,0,-5,626,626,626,626,626,626,-19,626,626,626,626,-1,626,626,-1,626,-4,626,-1,626,626,626,-1,626,-1,626,626,626,-1,626,-4,626,626,626,-13,626,-23,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,626,-4,626,626],
    sm452=[0,-4,0,-4,0,-10,627],
    sm453=[0,-1,2,57,-1,0,-4,0,-8,58,5,628,-19,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm454=[0,-4,0,-4,0,-7,629,-1,629],
    sm455=[0,-4,0,-4,0,-7,630,-1,630,630,-41,630,-9,630],
    sm456=[0,-4,0,-4,0,-7,631,-2,631,-22,631,-4,631,-13,631,-9,631,-13,631],
    sm457=[0,-1,2,57,-1,0,-4,0,-10,632,-40,273,-46,313,-57,48,49],
    sm458=[0,-4,0,-4,0,-10,633],
    sm459=[0,-4,0,-4,0,-7,634,-2,634,-41,634,-9,634],
    sm460=[0,-4,0,-4,0,-52,635],
    sm461=[0,-4,0,-4,0,-7,636,-2,636,-22,636,-4,636,-13,636,-9,636,-13,636],
    sm462=[0,-4,0,-4,0,-7,637,-44,637],
    sm463=[0,-2,57,-1,0,-4,0,-7,269,160,-42,161,638,-45,315],
    sm464=[0,-4,0,-4,0,-52,639,-9,639],
    sm465=[0,-4,0,-4,0,-7,640,-2,640,-41,640,-9,640],
    sm466=[0,-1,2,57,-1,0,-4,0,-8,122,641,-33,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm467=[0,-4,0,-4,0,-7,64,-1,642],
    sm468=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,643,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm469=[0,-4,0,-4,0,-7,306,-1,644],
    sm470=[0,-4,0,-4,0,-38,645,-37,646],
    sm471=[0,-4,0,-4,0,-7,309,-1,309,-23,310,-4,647,-37,647],
    sm472=[0,-4,0,-4,0,-33,310,-4,647,-37,647],
    sm473=[0,-4,0,-4,0,-7,64,-1,648],
    sm474=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,649,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm475=[0,-4,0,-4,0,-38,650,-37,650],
    sm476=[0,-4,0,-4,0,-76,651],
    sm477=[0,-4,0,-4,0,-76,652],
    sm478=[0,-4,0,-4,0,-8,653],
    sm479=[0,654,654,654,-1,0,-4,0,-8,654,654,654,-19,654,-12,654,654,-6,654,-9,654,-3,654,654,654,654,-1,654,654,654,654,654,654,-1,654,654,654,654,654,654,654,654,654,-2,654,654,-5,654,654,-2,654,-23,654,-1,654,654,654,654,654,654,654,654,654,654,-21,654,654],
    sm480=[0,655,655,655,-1,0,-4,0,-8,655,655,655,-19,655,-12,655,655,-6,655,-9,655,-3,655,655,655,655,-1,655,655,655,655,655,655,-1,655,655,655,655,655,655,655,655,655,-2,655,655,-5,655,655,-2,655,-23,655,-1,655,655,655,655,655,655,655,655,655,655,-21,655,655],
    sm481=[0,-4,0,-4,0,-31,656],
    sm482=[0,-2,657,-1,0,-4,0,-31,657,-3,657,-120,657,657],
    sm483=[0,-4,178,-4,179,-3,180,513,-25,176,-103,658],
    sm484=[0,-4,659,-4,659,-3,659,659,-25,659,-103,659],
    sm485=[0,-4,660,-4,660,-3,660,660,-25,660,-103,660],
    sm486=[0,-2,177,-1,178,-4,179,-3,180,-131,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201],
    sm487=[0,-4,178,-4,179,-3,180,661,-25,661,-103,661],
    sm488=[0,-4,661,-4,661,-3,661,661,-25,661,-103,661],
    sm489=[0,-2,662,-1,662,-4,662,-3,662,662,-25,662,662,-3,662,-98,662,-21,662,662],
    sm490=[0,663,-3,663,-4,663,-3,663,663,-4,663,-20,663,-103,663],
    sm491=[0,-2,664,-1,0,-4,0,-4,513,-151,665,49],
    sm492=[0,-4,0,-4,0,-157,666],
    sm493=[0,-4,0,-4,0,-156,667],
    sm494=[0,663,-3,663,-4,663,-3,663,663,-4,663,-20,663,-103,668],
    sm495=[0,-4,0,-4,0,-31,669],
    sm496=[0,-4,0,-4,0,-137,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201],
    sm497=[0,-2,213,-1,0,-4,0,-8,214,-6,6,-30,10,11,12,13,-1,14,-8,15,-73,1],
    sm498=[0,-1,2,57,-1,0,-4,0,-8,58,5,-20,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,670,-21,48,49],
    sm499=[0,-4,0,-4,0,-31,671],
    sm500=[0,-4,0,-4,0,-30,672],
    sm501=[0,-4,0,-4,0,-10,673],
    sm502=[0,674,674,674,-1,0,-4,0,-5,674,674,674,674,674,674,-19,674,674,674,674,-1,674,674,-1,674,-4,674,674,674,674,674,-1,674,-1,674,674,674,-1,674,-4,674,674,674,-2,674,674,674,674,-1,674,-1,674,674,674,674,674,674,674,674,674,674,674,674,674,674,-2,674,674,-5,674,674,-2,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,674,-21,674,674],
    sm503=[0,675,675,675,-1,0,-4,0,-5,675,675,675,675,675,675,-19,675,675,675,675,-1,675,675,-1,675,-4,675,675,675,675,675,-1,675,-1,675,675,675,-1,675,-4,675,675,675,-2,675,675,675,675,-1,675,-1,675,675,675,675,675,675,675,675,675,675,675,675,675,675,-2,675,675,-5,675,675,-2,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,675,-21,675,675],
    sm504=[0,-1,676,676,-1,0,-4,0,-9,676,676,-40,676,-40,676,676,676,-61,676,676],
    sm505=[0,-1,677,677,-1,0,-4,0,-9,677,677,-40,677,-40,677,677,677,-61,677,677],
    sm506=[0,-4,0,-4,0,-8,678],
    sm507=[0,-2,57,-1,0,-4,0,-8,160,-42,161,-10,679,-35,315],
    sm508=[0,-4,0,-4,0,-62,680],
    sm509=[0,-4,0,-4,0,-7,681,-1,681],
    sm510=[0,682,-1,363,-1,0,-4,0,-8,682,682,-2,552,-2,682,-7,364,-2,365,-19,682,682,682,682,-1,682,-8,682,366,-72,682],
    sm511=[0,-4,683,-4,0,-40,683,-115,683,683],
    sm512=[0,682,-1,363,-1,0,-4,0,-8,682,682,-5,682,-7,364,-2,365,-19,682,682,682,682,-1,682,-8,682,366,-72,682],
    sm513=[0,682,-1,682,-1,0,-4,0,-7,557,682,682,-5,682,-30,682,682,682,682,-1,682,-8,682,-73,682],
    sm514=[0,-4,0,-4,0,-61,684],
    sm515=[0,-4,0,-4,0,-3,685,-152,686],
    sm516=[0,-4,0,-4,0,-3,687,-152,687,687],
    sm517=[0,-4,0,-4,0,-3,685,-153,688],
    sm518=[0,-4,0,-4,0,-156,361,362],
    sm519=[0,-2,213,-1,0,-4,0,-8,214,-1,689,-35,10,11,12,13,-1,14,-8,15],
    sm520=[0,690,-1,690,-1,0,-4,0,-7,690,690,690,-5,690,-5,562,-24,690,690,690,690,-1,690,-8,690,-73,690],
    sm521=[0,571,-1,571,-1,0,-4,0,-7,571,571,571,-5,571,-5,571,-24,571,571,571,571,-1,571,-8,571,-73,571],
    sm522=[0,690,-1,690,-1,0,-4,0,-7,690,690,690,-5,690,-30,690,690,690,690,-1,690,-8,690,-73,690],
    sm523=[0,-2,368,-1,0,-4,0,-23,569,-37,366],
    sm524=[0,691,-1,691,-1,0,-4,0,-7,691,691,691,-5,691,-5,565,-24,691,691,691,691,-1,691,-8,691,-1,691,-71,691],
    sm525=[0,692,-1,692,-1,0,-4,0,-7,692,692,692,-5,692,-6,566,-23,692,692,692,692,-1,692,-8,692,-1,692,-71,692],
    sm526=[0,693,-1,693,-1,0,-4,0,-7,693,693,693,-5,693,-5,693,-24,693,693,693,693,-1,693,-8,693,-1,693,-71,693],
    sm527=[0,694,-1,694,-1,0,-4,0,-7,694,694,694,-5,694,-6,694,-23,694,694,694,694,-1,694,-8,694,-1,694,-71,694],
    sm528=[0,695,-1,695,-1,0,-4,0,-7,695,695,695,-5,695,-30,695,695,695,695,-1,695,-8,695,-1,695,-71,695],
    sm529=[0,-4,0,-4,0,-62,696],
    sm530=[0,-4,0,-4,0,-62,697],
    sm531=[0,-4,698,-4,0,-3,699,-26,700,700,700,700,-26,700,572,701],
    sm532=[0,-4,0,-4,0,-62,702],
    sm533=[0,-4,0,-4,0,-30,703,704,705,706,-26,707],
    sm534=[0,-4,0,-4,0,-30,708,709,710,711],
    sm535=[0,-4,0,-4,0,-30,712,712,712,712,-1,713,-1,714,715,716,-22,712],
    sm536=[0,-4,0,-4,0,-30,712,712,712,712,-28,712],
    sm537=[0,-4,717,-4,0,-3,718,-58,719],
    sm538=[0,-1,720,-2,0,-4,0,-19,721,722],
    sm539=[0,-4,0,-4,0,-8,723,-53,723],
    sm540=[0,-4,0,-4,0,-8,723,-12,578,-40,723],
    sm541=[0,-4,0,-4,0,-8,723,-13,579,-39,723],
    sm542=[0,-4,0,-4,0,-8,724,-12,724,-40,724],
    sm543=[0,-4,0,-4,0,-8,725,-13,725,-39,725],
    sm544=[0,-4,0,-4,0,-62,726],
    sm545=[0,-4,0,-4,0,-62,727],
    sm546=[0,-4,698,-4,0,-3,699,-56,256,572,701],
    sm547=[0,-4,0,-4,0,-10,728],
    sm548=[0,-4,0,-4,0,-52,729,-3,730,731],
    sm549=[0,-4,0,-4,0,-52,732,-3,732,732],
    sm550=[0,-2,733,733,0,-4,0],
    sm551=[0,-4,0,-4,0,-62,734],
    sm552=[0,-2,735,-1,0,-4,0,-9,735,735,-4,735],
    sm553=[0,-2,736,-1,0,-4,0,-9,736,736,-4,736,-46,736],
    sm554=[0,-2,737,-1,403,-4,0,-3,404,-5,737,737,-4,737,-45,405,737,-65,737],
    sm555=[0,-4,0,-4,0,-59,738],
    sm556=[0,-2,739,-1,739,-4,0,-3,739,-5,739,739,-4,739,-45,739,739,-65,739],
    sm557=[0,-4,403,-4,0,-3,404,-57,405,740],
    sm558=[0,-4,0,-4,0,-5,741,741,741,-1,741,741,-41,741,-7,741,-1,741],
    sm559=[0,-4,0,-4,0,-5,742,742,742,742,742,742,-19,742,742,742,742,-1,742,742,-1,742,-4,742,-1,742,742,742,-1,742,-1,742,742,742,-1,742,-4,742,742,742,-13,742,-23,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,742,-4,742,742],
    sm560=[0,-4,0,-4,0,-7,743,-44,743],
    sm561=[0,-1,2,57,-1,0,-4,0,-7,435,122,-34,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm562=[0,-4,0,-4,0,-5,744,744,744,744,744,744,-19,744,744,744,744,-1,744,744,-1,744,-4,744,-1,744,744,744,-1,744,-1,744,744,744,-1,744,-4,744,744,744,-13,744,-23,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,744,-4,744,744],
    sm563=[0,-4,0,-4,0,-7,745,-2,745],
    sm564=[0,-4,0,-4,0,-7,746,-2,746],
    sm565=[0,-4,0,-4,0,-62,747],
    sm566=[0,-4,0,-4,0,-62,748],
    sm567=[0,-4,0,-4,0,-62,749],
    sm568=[0,-4,0,-4,0,-60,750,750],
    sm569=[0,-4,0,-4,0,-5,751,751,751,751,751,751,-19,751,751,751,751,-1,751,751,-1,751,-4,751,-1,751,751,751,-1,751,-1,751,751,751,-1,751,-4,751,751,751,-13,751,-23,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,751,-4,751,751],
    sm570=[0,-4,0,-4,0,-7,752,-54,752],
    sm571=[0,-4,0,-4,0,-62,753],
    sm572=[0,-4,0,-4,0,-62,754],
    sm573=[0,-4,0,-4,0,-5,755,755,755,-1,755,755,-41,755,-7,755,-1,755],
    sm574=[0,-4,0,-4,0,-10,756],
    sm575=[0,-4,0,-4,0,-7,757,-2,757,-22,757,-4,757,-13,757,-9,757,-13,757],
    sm576=[0,-4,0,-4,0,-7,758,-2,758],
    sm577=[0,-4,0,-4,0,-7,759,-2,759],
    sm578=[0,-4,0,-4,0,-7,760,-2,760,-22,760,-4,760,-13,760,-9,760,-13,760],
    sm579=[0,-2,57,-1,0,-4,0,-7,435,160,-42,161,761,-45,315],
    sm580=[0,-4,0,-4,0,-52,762],
    sm581=[0,-4,0,-4,0,-7,763,-44,763],
    sm582=[0,764,764,764,-1,0,-4,0,-8,764,764,764,-19,764,-12,764,764,-6,764,-9,764,-3,764,764,764,764,-1,764,765,764,764,764,764,-1,764,764,764,764,764,764,764,764,764,-2,764,764,-5,764,764,-2,764,-23,764,-1,764,764,764,764,764,764,764,764,764,764,-21,764,764],
    sm583=[0,-4,0,-4,0,-7,64,-54,766],
    sm584=[0,767,767,767,-1,0,-4,0,-8,767,767,767,-19,767,-12,767,767,-6,767,-9,767,-3,767,767,767,767,-1,767,767,767,767,767,767,-1,767,767,767,767,767,767,767,767,767,-2,767,767,-5,767,767,-2,767,-23,767,-1,767,767,767,767,767,767,767,767,767,767,-21,767,767],
    sm585=[0,-4,0,-4,0,-7,64,-1,768],
    sm586=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,769,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm587=[0,-4,0,-4,0,-7,64,-54,770],
    sm588=[0,-1,2,57,-1,0,-4,0,-8,122,771,-33,8,9,-6,123,-9,16,-4,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm589=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,772,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm590=[0,-4,0,-4,0,-7,64,-54,773],
    sm591=[0,-4,0,-4,0,-7,64,-54,774],
    sm592=[0,-4,0,-4,0,-62,775],
    sm593=[0,-4,0,-4,0,-7,64,-54,776],
    sm594=[0,-4,0,-4,0,-62,777],
    sm595=[0,-4,0,-4,0,-76,778],
    sm596=[0,-4,0,-4,0,-76,647],
    sm597=[0,779,779,779,-1,0,-4,0,-8,779,779,779,-19,779,-12,779,779,-6,779,-9,779,-3,779,779,779,779,-1,779,779,779,779,779,779,-1,779,779,779,779,779,779,779,779,779,-2,779,779,-5,779,779,-2,779,-23,779,-1,779,779,779,779,779,779,779,779,779,779,-21,779,779],
    sm598=[0,-4,0,-4,0,-10,780,-54,781,-18,782],
    sm599=[0,783,783,783,-1,0,-4,0,-8,783,783,783,-19,783,-12,783,783,-6,783,-9,783,-3,783,783,783,783,-1,783,783,783,783,783,783,-1,783,783,783,783,783,783,783,783,783,-2,783,783,-5,783,783,-2,783,-23,783,-1,783,783,783,783,783,783,783,783,783,783,-21,783,783],
    sm600=[0,-4,0,-4,0,-62,784],
    sm601=[0,-4,0,-4,0,-62,785],
    sm602=[0,-4,178,-4,179,-3,180,513,-25,176,-103,786],
    sm603=[0,787,-3,787,-4,787,-3,787,787,-4,787,-20,787,-103,787],
    sm604=[0,-2,177,-1,0,-4,0],
    sm605=[0,-4,788,-4,788,-3,788,788,-25,788,-103,788],
    sm606=[0,-4,0,-4,0,-5,789,790,64],
    sm607=[0,-2,791,-1,0,-4,0,-31,791,-3,791,-120,791,791],
    sm608=[0,-2,792,-1,0,-4,0,-31,792,-3,792,-120,792,792],
    sm609=[0,-2,148,-1,149,-4,0,-3,150,513],
    sm610=[0,-2,793,-1,0,-4,0,-31,793,-1,793,-1,793,-120,793,793],
    sm611=[0,-4,0,-4,0,-31,794],
    sm612=[0,-4,0,-4,0,-134,795],
    sm613=[0,-4,0,-4,0,-134,796],
    sm614=[0,-4,0,-4,0,-30,797],
    sm615=[0,798,798,798,-1,0,-4,0,-5,798,798,798,798,798,798,-19,798,798,798,798,-1,798,798,-1,798,-4,798,798,798,798,798,-1,798,-1,798,798,798,-1,798,-4,798,798,798,-2,798,798,798,798,-1,798,-1,798,798,798,798,798,798,798,798,798,798,798,798,798,798,-2,798,798,-5,798,798,-2,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,798,-21,798,798],
    sm616=[0,-1,2,57,-1,0,-4,0,-8,58,5,799,-19,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,-1,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm617=[0,-4,0,-4,0,-62,800],
    sm618=[0,-4,0,-4,0,-7,801,-54,801],
    sm619=[0,-4,0,-4,0,-8,802],
    sm620=[0,803,-1,363,-1,0,-4,0,-8,803,803,-5,803,-7,364,-2,365,-19,803,803,803,803,-1,803,-8,803,366,-72,803],
    sm621=[0,803,-1,803,-1,0,-4,0,-7,557,803,803,-5,803,-30,803,803,803,803,-1,803,-8,803,-73,803],
    sm622=[0,-2,804,-1,0,-4,369,-23,370,-37,371],
    sm623=[0,805,-1,805,-1,0,-4,0,-8,805,805,-2,805,-2,805,-7,805,-2,805,-19,805,805,805,805,-1,805,-8,805,805,805,-71,805],
    sm624=[0,-4,0,-4,0,-3,806,-152,806,806],
    sm625=[0,-4,0,-4,0,-62,807],
    sm626=[0,-4,0,-4,0,-10,808],
    sm627=[0,-2,213,-1,0,-4,0,-8,214,-1,809,-35,10,11,12,13,-1,14,-8,15],
    sm628=[0,-2,810,-1,0,-4,0,-8,810,-1,810,-35,810,810,810,810,-1,810,-8,810],
    sm629=[0,811,-1,811,-1,0,-4,0,-7,811,811,811,-5,811,-30,811,811,811,811,-1,811,-8,811,-73,811],
    sm630=[0,812,-1,812,-1,0,-4,0,-7,812,812,812,-5,812,-30,812,812,812,812,-1,812,-8,812,-73,812],
    sm631=[0,813,-1,813,-1,0,-4,0,-7,813,813,813,-5,813,-30,813,813,813,813,-1,813,-8,813,-73,813],
    sm632=[0,564,-1,564,-1,0,-4,0,-7,564,564,564,-5,564,-5,565,-24,564,564,564,564,-1,564,-8,564,-73,564],
    sm633=[0,814,-1,814,-1,0,-4,0,-7,814,814,814,-5,814,-5,814,-24,814,814,814,814,-1,814,-8,814,-1,814,-71,814],
    sm634=[0,815,-1,815,-1,0,-4,0,-7,815,815,815,-5,815,-6,815,-23,815,815,815,815,-1,815,-8,815,-1,815,-71,815],
    sm635=[0,816,-1,816,-1,0,-4,0,-7,816,816,816,-5,816,-5,816,-24,816,816,816,816,-1,816,-8,816,-1,816,-71,816],
    sm636=[0,817,-1,817,-1,0,-4,0,-7,817,817,817,-5,817,-6,817,-23,817,817,817,817,-1,817,-8,817,-1,817,-71,817],
    sm637=[0,818,-1,818,-1,0,-4,0,-7,818,818,818,-5,818,-5,818,818,-23,818,818,818,818,-1,818,-8,818,-1,818,-71,818],
    sm638=[0,819,-1,819,-1,0,-4,0,-7,819,819,819,-5,819,-5,819,819,-23,819,819,819,819,-1,819,-8,819,-1,819,-71,819],
    sm639=[0,-4,698,-4,0,-3,699,-58,820],
    sm640=[0,821,-1,821,-1,0,-4,0,-7,821,821,821,-5,821,-5,821,821,-23,821,821,821,821,-1,821,-8,821,-1,821,-71,821],
    sm641=[0,-4,822,-4,0,-3,822,-58,822],
    sm642=[0,-4,823,-4,0,-3,823,-58,823],
    sm643=[0,-1,567,824,-1,0,-4,0],
    sm644=[0,-1,825,825,-1,0,-4,0],
    sm645=[0,-1,825,825,-1,0,-4,0,-33,826],
    sm646=[0,-2,824,-1,0,-4,0],
    sm647=[0,-2,827,-1,0,-4,0],
    sm648=[0,-2,828,-1,0,-4,0],
    sm649=[0,-2,829,-1,0,-4,0],
    sm650=[0,-2,829,-1,0,-4,0,-33,830],
    sm651=[0,-4,0,-4,0,-30,831,831,831,831,-28,831],
    sm652=[0,-1,832,-2,0,-4,0],
    sm653=[0,-4,0,-4,0,-30,833,833,833,833,-28,833],
    sm654=[0,-4,717,-4,0,-3,718,-58,834],
    sm655=[0,-4,835,-4,0,-3,835,-58,835],
    sm656=[0,-4,836,-4,0,-3,836,-58,836],
    sm657=[0,-1,720,-2,0,-4,0,-10,837,-8,721,722],
    sm658=[0,-1,838,-2,0,-4,0,-10,838,-8,838,838],
    sm659=[0,-4,0,-4,0,-7,839,840],
    sm660=[0,-4,0,-4,0,-7,841,841],
    sm661=[0,-4,0,-4,0,-7,842,842],
    sm662=[0,-4,0,-4,0,-36,843],
    sm663=[0,-4,0,-4,0,-10,844],
    sm664=[0,-4,0,-4,0,-8,845,-12,845,-40,845],
    sm665=[0,-4,0,-4,0,-8,846,-13,846,-39,846],
    sm666=[0,-4,0,-4,0,-8,847,-12,847,-40,847],
    sm667=[0,-4,0,-4,0,-8,848,-13,848,-39,848],
    sm668=[0,-4,0,-4,0,-8,849,-12,849,849,-39,849],
    sm669=[0,-4,0,-4,0,-8,850,-12,850,850,-39,850],
    sm670=[0,-4,0,-4,0,-62,851],
    sm671=[0,852,-1,852,-1,0,-4,0,-8,852,-1,852,-4,852,-30,852,852,852,852,-1,852,-8,852,-73,852],
    sm672=[0,-4,0,-4,0,-52,853],
    sm673=[0,-2,854,-1,0,-4,0,-7,854,854,-22,854,-11,854,854,854,854,854,854,854,-1,854,-8,854,-1,854],
    sm674=[0,-4,0,-4,0,-52,855],
    sm675=[0,-2,856,-1,0,-4,0,-7,856,856,-22,856,-11,856,856,856,856,856,856,856,-1,856,-8,856,-1,856],
    sm676=[0,-2,857,-1,0,-4,0,-9,857,857,-4,857,-46,857],
    sm677=[0,-2,858,-1,858,-4,0,-3,858,-5,858,858,-4,858,-45,858,858,-65,858],
    sm678=[0,-4,0,-4,0,-7,859,-44,859],
    sm679=[0,-4,0,-4,0,-8,860],
    sm680=[0,-4,0,-4,0,-8,861],
    sm681=[0,-4,0,-4,0,-62,862],
    sm682=[0,-4,0,-4,0,-62,863],
    sm683=[0,-4,0,-4,0,-7,864,-54,864],
    sm684=[0,-4,0,-4,0,-5,865,865,865,865,865,865,-19,865,865,865,865,-1,865,865,-1,865,-4,865,-1,865,865,865,-1,865,-1,865,865,865,-1,865,-4,865,865,865,-13,865,-13,865,-9,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,865,-4,865,865],
    sm685=[0,-4,0,-4,0,-7,866,-2,866,-22,866,-4,866,-13,866,-9,866,-13,866],
    sm686=[0,-4,0,-4,0,-7,867,-2,867,-22,867,-4,867,-13,867,-9,867,-13,867],
    sm687=[0,-4,0,-4,0,-52,868],
    sm688=[0,-4,0,-4,0,-9,869],
    sm689=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,870,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm690=[0,-4,0,-4,0,-7,64,-54,871],
    sm691=[0,-4,0,-4,0,-7,64,-54,872],
    sm692=[0,873,873,873,-1,0,-4,0,-8,873,873,873,-19,873,-12,873,873,-6,873,-9,873,-3,873,873,873,873,-1,873,873,873,873,873,873,-1,873,873,873,873,873,873,873,873,873,-2,873,873,-5,873,873,-2,873,-23,873,-1,873,873,873,873,873,873,873,873,873,873,-21,873,873],
    sm693=[0,-4,0,-4,0,-7,64,-1,874],
    sm694=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,875,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm695=[0,-4,0,-4,0,-7,64,-54,876],
    sm696=[0,-4,0,-4,0,-62,877],
    sm697=[0,-4,0,-4,0,-7,64,-54,878],
    sm698=[0,879,879,879,-1,0,-4,0,-8,879,879,879,-19,879,-12,879,879,-6,879,-9,879,-3,879,879,879,879,-1,879,879,879,879,879,879,-1,879,879,879,879,879,879,879,879,879,-2,879,879,-5,879,879,-2,879,-23,879,-1,879,879,879,879,879,879,879,879,879,879,-21,879,879],
    sm699=[0,-4,0,-4,0,-62,880],
    sm700=[0,-4,0,-4,0,-62,881],
    sm701=[0,882,882,882,-1,0,-4,0,-8,882,882,882,-19,882,-12,882,882,-6,882,-9,882,-3,882,882,882,882,-1,882,882,882,882,882,882,-1,882,882,882,882,882,882,882,882,882,-2,882,882,-5,882,882,-2,882,-23,882,-1,882,882,882,882,882,882,882,882,882,882,-21,882,882],
    sm702=[0,-4,0,-4,0,-10,883,-54,781,-18,782],
    sm703=[0,-4,0,-4,0,-10,884,-73,782],
    sm704=[0,-4,0,-4,0,-10,885,-54,885,-18,885],
    sm705=[0,-4,0,-4,0,-10,886,-49,887,-23,886],
    sm706=[0,-4,0,-4,0,-31,888],
    sm707=[0,-2,889,-1,889,-4,889,-3,889,889,-25,889,889,-3,889,-98,889,-21,889,889],
    sm708=[0,-4,0,-4,0,-156,890],
    sm709=[0,-4,0,-4,0,-31,891],
    sm710=[0,892,-3,892,-4,892,-3,892,892,-4,892,-20,892,-103,892],
    sm711=[0,-4,0,-4,0,-135,893],
    sm712=[0,-4,0,-4,0,-136,894],
    sm713=[0,-4,0,-4,0,-10,895],
    sm714=[0,-4,0,-4,0,-10,896],
    sm715=[0,897,-1,897,-1,0,-4,0,-7,557,897,897,-5,897,-30,897,897,897,897,-1,897,-8,897,-73,897],
    sm716=[0,-4,0,-4,0,-62,898],
    sm717=[0,-4,0,-4,0,-62,899],
    sm718=[0,-4,0,-4,0,-60,256,572],
    sm719=[0,900,-1,900,-1,0,-4,0,-8,900,900,-2,900,-2,900,-7,900,-2,900,-19,900,900,900,900,-1,900,-8,900,900,-72,900],
    sm720=[0,-4,0,-4,0,-9,901],
    sm721=[0,-2,902,-1,0,-4,0,-8,902,-1,902,-35,902,902,902,902,-1,902,-8,902],
    sm722=[0,903,-1,903,-1,0,-4,0,-7,903,903,903,-5,903,-5,903,903,-23,903,903,903,903,-1,903,-8,903,-1,903,-71,903],
    sm723=[0,-4,904,-4,0,-3,904,-58,904],
    sm724=[0,-4,0,-4,0,-62,905],
    sm725=[0,-4,0,-4,0,-62,712],
    sm726=[0,-4,0,-4,0,-62,700],
    sm727=[0,-4,0,-4,0,-62,906],
    sm728=[0,-1,907,907,-1,0,-4,0],
    sm729=[0,-4,0,-4,0,-31,908],
    sm730=[0,-4,0,-4,0,-30,909,-1,910],
    sm731=[0,-2,911,-1,0,-4,0],
    sm732=[0,-4,0,-4,0,-30,912,912,912,912,-28,912],
    sm733=[0,-4,913,-4,0,-3,913,-58,913],
    sm734=[0,-4,0,-4,0,-9,914],
    sm735=[0,-1,915,-2,0,-4,0,-10,915,-8,915,915],
    sm736=[0,-4,0,-4,0,-7,916,916],
    sm737=[0,-4,0,-4,0,-9,917],
    sm738=[0,-4,0,-4,0,-8,918,-12,918,918,-39,918],
    sm739=[0,-2,919,-1,0,-4,0,-7,919,919,-22,919,-11,919,919,919,919,919,919,919,-1,919,-8,919,-1,919],
    sm740=[0,-4,0,-4,0,-8,920],
    sm741=[0,-4,0,-4,0,-7,921,-2,921,-22,921,-4,921,-13,921,-9,921,-13,921],
    sm742=[0,922,922,922,-1,0,-4,0,-8,922,922,922,-19,922,-12,922,922,-6,922,-9,922,-3,922,922,922,922,-1,922,922,922,922,922,922,-1,922,922,922,922,922,922,922,922,922,-2,922,922,-5,922,922,-2,922,-23,922,-1,922,922,922,922,922,922,922,922,922,922,-21,922,922],
    sm743=[0,923,923,923,-1,0,-4,0,-8,923,923,923,-19,923,-12,923,923,-6,923,-9,923,-3,923,923,923,923,-1,923,923,923,923,923,923,-1,923,923,923,923,923,923,923,923,923,-2,923,923,-5,923,923,-2,923,-23,923,-1,923,923,923,923,923,923,923,923,923,923,-21,923,923],
    sm744=[0,-4,0,-4,0,-7,64,-54,924],
    sm745=[0,925,925,925,-1,0,-4,0,-8,925,925,925,-19,925,-12,925,925,-6,925,-9,925,-3,925,925,925,925,-1,925,925,925,925,925,925,-1,925,925,925,925,925,925,925,925,925,-2,925,925,-5,925,925,-2,925,-23,925,-1,925,925,925,925,925,925,925,925,925,925,-21,925,925],
    sm746=[0,926,926,926,-1,0,-4,0,-8,926,926,926,-19,926,-12,926,926,-6,926,-9,926,-3,926,926,926,926,-1,926,926,926,926,926,926,-1,926,926,926,926,926,926,926,926,926,-2,926,926,-5,926,926,-2,926,-23,926,-1,926,926,926,926,926,926,926,926,926,926,-21,926,926],
    sm747=[0,-1,2,57,-1,0,-4,0,-8,122,-34,8,9,-6,123,-9,16,927,-3,17,18,-9,25,-17,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm748=[0,-4,0,-4,0,-7,64,-54,928],
    sm749=[0,929,929,929,-1,0,-4,0,-8,929,929,929,-19,929,-12,929,929,-6,929,-9,929,-3,929,929,929,929,-1,929,929,929,929,929,929,-1,929,929,929,929,929,929,929,929,929,-2,929,929,-5,929,929,-2,929,-23,929,-1,929,929,929,929,929,929,929,929,929,929,-21,929,929],
    sm750=[0,930,930,930,-1,0,-4,0,-8,930,930,930,-19,930,-12,930,930,-6,930,-9,930,-3,930,930,930,930,-1,930,930,930,930,930,930,-1,930,930,930,930,930,930,930,930,930,-2,930,930,-5,930,930,-2,930,-23,930,-1,930,930,930,930,930,930,930,930,930,930,-21,930,930],
    sm751=[0,931,931,931,-1,0,-4,0,-8,931,931,931,-19,931,-12,931,931,-6,931,-9,931,-3,931,931,931,931,-1,931,931,931,931,931,931,-1,931,931,931,931,931,931,931,931,931,-2,931,931,-5,931,931,-2,931,-23,931,-1,931,931,931,931,931,931,931,931,931,931,-21,931,931],
    sm752=[0,932,932,932,-1,0,-4,0,-8,932,932,932,-19,932,-12,932,932,-6,932,-9,932,-3,932,932,932,932,-1,932,932,932,932,932,932,-1,932,932,932,932,932,932,932,932,932,-2,932,932,-5,932,932,-2,932,-23,932,-1,932,932,932,932,932,932,932,932,932,932,-21,932,932],
    sm753=[0,-4,0,-4,0,-62,933],
    sm754=[0,-4,0,-4,0,-10,934,-73,782],
    sm755=[0,935,935,935,-1,0,-4,0,-8,935,935,935,-19,935,-12,935,935,-6,935,-9,935,-3,935,935,935,935,-1,935,935,935,935,935,935,-1,935,935,935,935,935,935,935,935,935,-2,935,935,-5,935,935,-2,935,-23,935,-1,935,935,935,935,935,935,935,935,935,935,-21,935,935],
    sm756=[0,-4,0,-4,0,-10,936,-54,936,-18,936],
    sm757=[0,-4,0,-4,0,-10,937,-73,782],
    sm758=[0,-4,0,-4,0,-7,64,-52,938],
    sm759=[0,939,939,939,-1,0,-4,0,-8,939,939,939,-19,939,-12,939,939,-6,939,-9,939,-3,939,939,939,939,-1,939,939,939,939,939,939,-1,939,939,939,939,939,939,939,939,939,-1,939,939,939,-5,939,939,-2,939,-23,939,-1,939,939,939,939,939,939,939,939,939,939,-21,939,939],
    sm760=[0,-4,0,-4,0,-31,940],
    sm761=[0,941,-3,941,-4,941,-3,941,941,-4,941,-20,941,-103,941],
    sm762=[0,-4,0,-4,0,-5,942,-1,64],
    sm763=[0,-2,943,-1,0,-4,0,-31,943,-3,943,-120,943,943],
    sm764=[0,-4,0,-4,0,-31,944],
    sm765=[0,-4,0,-4,0,-31,945],
    sm766=[0,946,946,946,-1,0,-4,0,-5,946,946,946,946,946,946,-19,946,946,946,946,-1,946,946,-1,946,-4,946,946,946,946,946,-1,946,-1,946,946,946,-1,946,-4,946,946,946,-2,946,946,946,946,-1,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,-2,946,946,-5,946,946,-2,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,946,-21,946,946],
    sm767=[0,-4,0,-4,0,-10,947],
    sm768=[0,948,-1,948,-1,0,-4,0,-8,948,948,-5,948,-7,948,-2,948,-19,948,948,948,948,-1,948,-8,948,948,-72,948],
    sm769=[0,-1,949,949,-1,0,-4,0,-33,950],
    sm770=[0,-1,951,951,-1,0,-4,0],
    sm771=[0,-2,253,-1,0,-4,0,-9,952,953,-4,6],
    sm772=[0,-4,0,-4,0,-7,954,954],
    sm773=[0,-4,0,-4,0,-10,955],
    sm774=[0,-4,0,-4,0,-10,956],
    sm775=[0,957,957,957,-1,0,-4,0,-8,957,957,957,-19,957,-12,957,957,-6,957,-9,957,-3,957,957,957,957,-1,957,957,957,957,957,957,-1,957,957,957,957,957,957,957,957,957,-2,957,957,-5,957,957,-2,957,-23,957,-1,957,957,957,957,957,957,957,957,957,957,-21,957,957],
    sm776=[0,958,958,958,-1,0,-4,0,-8,958,958,958,-19,958,-12,958,958,-6,958,-9,958,-3,958,958,958,958,-1,958,958,958,958,958,958,-1,958,958,958,958,958,958,958,958,958,-2,958,958,-5,958,958,-2,958,-23,958,-1,958,958,958,958,958,958,958,958,958,958,-21,958,958],
    sm777=[0,959,959,959,-1,0,-4,0,-8,959,959,959,-19,959,-12,959,959,-6,959,-9,959,-3,959,959,959,959,-1,959,959,959,959,959,959,-1,959,959,959,959,959,959,959,959,959,-2,959,959,-5,959,959,-2,959,-23,959,-1,959,959,959,959,959,959,959,959,959,959,-21,959,959],
    sm778=[0,-4,0,-4,0,-7,64,-54,960],
    sm779=[0,961,961,961,-1,0,-4,0,-8,961,961,961,-19,961,-12,961,961,-6,961,-9,961,-3,961,961,961,961,-1,961,961,961,961,961,961,-1,961,961,961,961,961,961,961,961,961,-2,961,961,-5,961,961,-2,961,-23,961,-1,961,961,961,961,961,961,961,961,961,961,-21,961,961],
    sm780=[0,962,962,962,-1,0,-4,0,-8,962,962,962,-19,962,-12,962,962,-6,962,-9,962,-3,962,962,962,962,-1,962,962,962,962,962,962,-1,962,962,962,962,962,962,962,962,962,-2,962,962,-5,962,962,-2,962,-23,962,-1,962,962,962,962,962,962,962,962,962,962,-21,962,962],
    sm781=[0,963,963,963,-1,0,-4,0,-8,963,963,963,-19,963,-12,963,963,-6,963,-9,963,-3,963,963,963,963,-1,963,963,963,963,963,963,-1,963,963,963,963,963,963,963,963,963,-2,963,963,-5,963,963,-2,963,-23,963,-1,963,963,963,963,963,963,963,963,963,963,-21,963,963],
    sm782=[0,964,964,964,-1,0,-4,0,-8,964,964,964,-19,964,-12,964,964,-6,964,-9,964,-3,964,964,964,964,-1,964,964,964,964,964,964,-1,964,964,964,964,964,964,964,964,964,-2,964,964,-5,964,964,-2,964,-23,964,-1,964,964,964,964,964,964,964,964,964,964,-21,964,964],
    sm783=[0,965,965,965,-1,0,-4,0,-8,965,965,965,-19,965,-12,965,965,-6,965,-9,965,-3,965,965,965,965,-1,965,965,965,965,965,965,-1,965,965,965,965,965,965,965,965,965,-2,965,965,-5,965,965,-2,965,-23,965,-1,965,965,965,965,965,965,965,965,965,965,-21,965,965],
    sm784=[0,-4,0,-4,0,-10,966],
    sm785=[0,967,967,967,-1,0,-4,0,-8,967,967,967,-19,967,-12,967,967,-6,967,-9,967,-3,967,967,967,967,-1,967,967,967,967,967,967,-1,967,967,967,967,967,967,967,967,967,-2,967,967,-5,967,967,-2,967,-23,967,-1,967,967,967,967,967,967,967,967,967,967,-21,967,967],
    sm786=[0,-1,2,57,-1,0,-4,0,-8,58,5,968,-19,7,-12,8,9,-16,16,-3,968,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,968,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm787=[0,-1,2,57,-1,0,-4,0,-8,58,5,969,-19,7,-12,8,9,-16,16,-4,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,969,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm788=[0,970,-3,970,-4,970,-3,970,970,-4,970,-20,970,-103,970],
    sm789=[0,-2,971,-1,971,-4,971,-3,971,971,-25,971,971,-3,971,-98,971,-21,971,971],
    sm790=[0,972,972,972,-1,0,-4,0,-5,972,972,972,972,972,972,-19,972,972,972,972,-1,972,972,-1,972,-4,972,972,972,972,972,-1,972,-1,972,972,972,-1,972,-4,972,972,972,-2,972,972,972,972,-1,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,-2,972,972,-5,972,972,-2,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,972,-21,972,972],
    sm791=[0,-4,0,-4,0,-62,973],
    sm792=[0,-1,974,974,-1,0,-4,0],
    sm793=[0,-4,0,-4,0,-10,975],
    sm794=[0,-1,976,-2,0,-4,0,-10,976,-8,976,976],
    sm795=[0,-4,0,-4,0,-10,977],
    sm796=[0,-1,978,978,-1,0,-4,0,-7,978,-1,978,978,-40,978,-40,978,978,978,-61,978,978],
    sm797=[0,-1,979,979,-1,0,-4,0,-7,979,-1,979,979,-40,979,-40,979,979,979,-61,979,979],
    sm798=[0,-4,0,-4,0,-10,980],
    sm799=[0,981,981,981,-1,0,-4,0,-8,981,981,981,-19,981,-12,981,981,-6,981,-9,981,-3,981,981,981,981,-1,981,981,981,981,981,981,-1,981,981,981,981,981,981,981,981,981,-2,981,981,-5,981,981,-2,981,-23,981,-1,981,981,981,981,981,981,981,981,981,981,-21,981,981],
    sm800=[0,982,982,982,-1,0,-4,0,-8,982,982,982,-19,982,-12,982,982,-6,982,-9,982,-3,982,982,982,982,-1,982,982,982,982,982,982,-1,982,982,982,982,982,982,982,982,982,-2,982,982,-5,982,982,-2,982,-23,982,-1,982,982,982,982,982,982,982,982,982,982,-21,982,982],
    sm801=[0,983,983,983,-1,0,-4,0,-8,983,983,983,-19,983,-12,983,983,-6,983,-9,983,-3,983,983,983,983,-1,983,983,983,983,983,983,-1,983,983,983,983,983,983,983,983,983,-2,983,983,-5,983,983,-2,983,-23,983,-1,983,983,983,983,983,983,983,983,983,983,-21,983,983],
    sm802=[0,984,984,984,-1,0,-4,0,-8,984,984,984,-19,984,-12,984,984,-6,984,-9,984,-3,984,984,984,984,-1,984,984,984,984,984,984,-1,984,984,984,984,984,984,984,984,984,-2,984,984,-5,984,984,-2,984,-23,984,-1,984,984,984,984,984,984,984,984,984,984,-21,984,984],
    sm803=[0,985,985,985,-1,0,-4,0,-8,985,985,985,-19,985,-12,985,985,-6,985,-9,985,-3,985,985,985,985,-1,985,985,985,985,985,985,-1,985,985,985,985,985,985,985,985,985,-2,985,985,-5,985,985,-2,985,-23,985,-1,985,985,985,985,985,985,985,985,985,985,-21,985,985],
    sm804=[0,-1,2,57,-1,0,-4,0,-8,58,5,986,-19,7,-12,8,9,-16,16,-3,986,17,18,19,-1,20,-1,21,22,23,24,-1,25,26,27,28,29,30,31,986,32,-2,33,34,-5,35,36,-2,37,-23,38,-1,39,40,41,42,43,44,45,46,47,-22,48,49],
    sm805=[0,-1,987,-2,0,-4,0,-10,987,-8,987,987],
    sm806=[0,-1,988,988,-1,0,-4,0,-7,988,-1,988,988,-40,988,-40,988,988,988,-61,988,988],
    sm807=[0,989,989,989,-1,0,-4,0,-8,989,989,989,-19,989,-12,989,989,-6,989,-9,989,-3,989,989,989,989,-1,989,989,989,989,989,989,-1,989,989,989,989,989,989,989,989,989,-2,989,989,-5,989,989,-2,989,-23,989,-1,989,989,989,989,989,989,989,989,989,989,-21,989,989],

        // Symbol Lookup map
        lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],["((",14],["))",15],[")(",16],[",",17],["{",18],[";",19],["}",20],[null,9],["supports",22],["(",71],[")",72],["@",25],["import",26],["keyframes",27],["id",28],["from",29],["to",30],["and",31],["or",32],["not",33],["media",35],["only",36],[":",70],["<",40],[">",41],["<=",42],["=",43],["/",45],["%",46],["px",47],["in",48],["rad",49],["url",50],["\"",166],["'",167],["+",53],["~",54],["||",55],["*",56],["|",57],["#",58],[".",59],["[",61],["]",62],["^=",63],["$=",64],["*=",65],["i",66],["s",67],["!",138],["important",69],["as",73],["export",74],["default",75],["function",76],["class",77],["let",78],["async",79],["if",80],["else",81],["do",82],["while",83],["for",84],["var",85],["of",86],["await",87],["continue",88],["break",89],["return",90],["throw",91],["with",92],["switch",93],["case",94],["try",95],["catch",96],["finally",97],["debugger",98],["const",99],["=>",100],["extends",101],["static",102],["get",103],["set",104],["new",105],["super",106],["target",107],["...",108],["this",109],["/=",110],["%=",111],["+=",112],["-=",113],["<<=",114],[">>=",115],[">>>=",116],["&=",117],["|=",118],["**=",119],["?",120],["&&",121],["^",122],["&",123],["==",124],["!=",125],["===",126],["!==",127],[">=",128],["instanceof",129],["<<",130],[">>",131],[">>>",132],["-",133],["**",134],["delete",135],["void",136],["typeof",137],["++",139],["--",140],["null",141],["true",142],["false",143],["</",144],["style",145],["script",146],["input",147],["area",148],["base",149],["br",150],["col",151],["command",152],["embed",153],["hr",154],["img",155],["keygen",156],["link",157],["meta",158],["param",159],["source",160],["track",161],["wbr",162],["f",163],["filter",164]]),

        //Reverse Symbol Lookup map
        rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,"(("],[15,"))"],[16,")("],[17,","],[18,"{"],[19,";"],[20,"}"],[9,null],[22,"supports"],[71,"("],[72,")"],[25,"@"],[26,"import"],[27,"keyframes"],[28,"id"],[29,"from"],[30,"to"],[31,"and"],[32,"or"],[33,"not"],[35,"media"],[36,"only"],[70,":"],[40,"<"],[41,">"],[42,"<="],[43,"="],[45,"/"],[46,"%"],[47,"px"],[48,"in"],[49,"rad"],[50,"url"],[166,"\""],[167,"'"],[53,"+"],[54,"~"],[55,"||"],[56,"*"],[57,"|"],[58,"#"],[59,"."],[61,"["],[62,"]"],[63,"^="],[64,"$="],[65,"*="],[66,"i"],[67,"s"],[138,"!"],[69,"important"],[73,"as"],[74,"export"],[75,"default"],[76,"function"],[77,"class"],[78,"let"],[79,"async"],[80,"if"],[81,"else"],[82,"do"],[83,"while"],[84,"for"],[85,"var"],[86,"of"],[87,"await"],[88,"continue"],[89,"break"],[90,"return"],[91,"throw"],[92,"with"],[93,"switch"],[94,"case"],[95,"try"],[96,"catch"],[97,"finally"],[98,"debugger"],[99,"const"],[100,"=>"],[101,"extends"],[102,"static"],[103,"get"],[104,"set"],[105,"new"],[106,"super"],[107,"target"],[108,"..."],[109,"this"],[110,"/="],[111,"%="],[112,"+="],[113,"-="],[114,"<<="],[115,">>="],[116,">>>="],[117,"&="],[118,"|="],[119,"**="],[120,"?"],[121,"&&"],[122,"^"],[123,"&"],[124,"=="],[125,"!="],[126,"==="],[127,"!=="],[128,">="],[129,"instanceof"],[130,"<<"],[131,">>"],[132,">>>"],[133,"-"],[134,"**"],[135,"delete"],[136,"void"],[137,"typeof"],[139,"++"],[140,"--"],[141,"null"],[142,"true"],[143,"false"],[144,"</"],[145,"style"],[146,"script"],[147,"input"],[148,"area"],[149,"base"],[150,"br"],[151,"col"],[152,"command"],[153,"embed"],[154,"hr"],[155,"img"],[156,"keygen"],[157,"link"],[158,"meta"],[159,"param"],[160,"source"],[161,"track"],[162,"wbr"],[163,"f"],[164,"filter"]]),

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
    sm77,
    sm77,
    sm77,
    sm78,
    sm79,
    sm80,
    sm56,
    sm81,
    sm82,
    sm83,
    sm84,
    sm84,
    sm85,
    sm86,
    sm87,
    sm88,
    sm88,
    sm89,
    sm90,
    sm91,
    sm92,
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
    sm123,
    sm30,
    sm30,
    sm30,
    sm124,
    sm125,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
    sm126,
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
    sm127,
    sm31,
    sm128,
    sm129,
    sm130,
    sm38,
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
    sm30,
    sm146,
    sm30,
    sm144,
    sm147,
    sm148,
    sm34,
    sm149,
    sm150,
    sm151,
    sm152,
    sm153,
    sm154,
    sm155,
    sm155,
    sm155,
    sm156,
    sm157,
    sm158,
    sm56,
    sm159,
    sm144,
    sm30,
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
    sm170,
    sm170,
    sm171,
    sm172,
    sm30,
    sm173,
    sm30,
    sm174,
    sm175,
    sm30,
    sm176,
    sm177,
    sm178,
    sm179,
    sm180,
    sm181,
    sm182,
    sm30,
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
    sm192,
    sm193,
    sm192,
    sm194,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm195,
    sm196,
    sm197,
    sm197,
    sm197,
    sm198,
    sm199,
    sm200,
    sm201,
    sm202,
    sm203,
    sm204,
    sm205,
    sm206,
    sm168,
    sm168,
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
    sm209,
    sm217,
    sm218,
    sm219,
    sm217,
    sm220,
    sm221,
    sm221,
    sm221,
    sm221,
    sm222,
    sm223,
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
    sm238,
    sm239,
    sm212,
    sm212,
    sm212,
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
    sm250,
    sm251,
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
    sm280,
    sm281,
    sm281,
    sm30,
    sm282,
    sm283,
    sm284,
    sm285,
    sm286,
    sm285,
    sm30,
    sm287,
    sm288,
    sm289,
    sm289,
    sm290,
    sm290,
    sm291,
    sm291,
    sm30,
    sm292,
    sm293,
    sm294,
    sm295,
    sm296,
    sm30,
    sm297,
    sm298,
    sm299,
    sm300,
    sm301,
    sm302,
    sm301,
    sm303,
    sm304,
    sm305,
    sm306,
    sm307,
    sm308,
    sm309,
    sm310,
    sm113,
    sm311,
    sm312,
    sm312,
    sm313,
    sm56,
    sm314,
    sm30,
    sm314,
    sm315,
    sm316,
    sm317,
    sm144,
    sm318,
    sm319,
    sm320,
    sm321,
    sm322,
    sm323,
    sm324,
    sm325,
    sm56,
    sm326,
    sm327,
    sm328,
    sm329,
    sm330,
    sm331,
    sm332,
    sm333,
    sm334,
    sm56,
    sm335,
    sm336,
    sm337,
    sm56,
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
    sm68,
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
    sm370,
    sm372,
    sm373,
    sm374,
    sm375,
    sm376,
    sm377,
    sm378,
    sm379,
    sm380,
    sm203,
    sm381,
    sm56,
    sm382,
    sm382,
    sm383,
    sm384,
    sm385,
    sm386,
    sm386,
    sm387,
    sm387,
    sm388,
    sm389,
    sm390,
    sm391,
    sm392,
    sm393,
    sm394,
    sm394,
    sm395,
    sm395,
    sm396,
    sm397,
    sm398,
    sm399,
    sm399,
    sm400,
    sm401,
    sm402,
    sm403,
    sm403,
    sm404,
    sm405,
    sm406,
    sm407,
    sm408,
    sm408,
    sm409,
    sm409,
    sm410,
    sm411,
    sm412,
    sm413,
    sm414,
    sm415,
    sm416,
    sm417,
    sm418,
    sm419,
    sm420,
    sm420,
    sm420,
    sm420,
    sm421,
    sm217,
    sm422,
    sm423,
    sm424,
    sm425,
    sm426,
    sm248,
    sm427,
    sm428,
    sm428,
    sm429,
    sm30,
    sm430,
    sm431,
    sm432,
    sm432,
    sm433,
    sm434,
    sm435,
    sm436,
    sm437,
    sm438,
    sm439,
    sm440,
    sm30,
    sm203,
    sm441,
    sm442,
    sm443,
    sm444,
    sm445,
    sm446,
    sm447,
    sm448,
    sm449,
    sm56,
    sm450,
    sm450,
    sm451,
    sm452,
    sm453,
    sm454,
    sm455,
    sm456,
    sm456,
    sm457,
    sm458,
    sm56,
    sm459,
    sm460,
    sm461,
    sm462,
    sm461,
    sm461,
    sm463,
    sm464,
    sm464,
    sm465,
    sm60,
    sm30,
    sm60,
    sm466,
    sm467,
    sm468,
    sm469,
    sm470,
    sm471,
    sm472,
    sm473,
    sm474,
    sm30,
    sm30,
    sm30,
    sm30,
    sm475,
    sm472,
    sm472,
    sm476,
    sm56,
    sm477,
    sm56,
    sm478,
    sm60,
    sm479,
    sm56,
    sm480,
    sm349,
    sm481,
    sm482,
    sm483,
    sm484,
    sm484,
    sm485,
    sm486,
    sm487,
    sm488,
    sm489,
    sm489,
    sm30,
    sm490,
    sm491,
    sm492,
    sm493,
    sm494,
    sm495,
    sm496,
    sm490,
    sm497,
    sm498,
    sm499,
    sm500,
    sm501,
    sm502,
    sm503,
    sm504,
    sm505,
    sm506,
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
    sm518,
    sm519,
    sm214,
    sm520,
    sm521,
    sm522,
    sm523,
    sm524,
    sm525,
    sm526,
    sm397,
    sm527,
    sm397,
    sm528,
    sm529,
    sm530,
    sm531,
    sm397,
    sm532,
    sm532,
    sm532,
    sm533,
    sm534,
    sm535,
    sm536,
    sm536,
    sm537,
    sm538,
    sm519,
    sm539,
    sm540,
    sm541,
    sm542,
    sm405,
    sm543,
    sm405,
    sm544,
    sm545,
    sm546,
    sm217,
    sm547,
    sm423,
    sm548,
    sm549,
    sm549,
    sm550,
    sm551,
    sm552,
    sm553,
    sm554,
    sm555,
    sm556,
    sm557,
    sm558,
    sm559,
    sm560,
    sm560,
    sm561,
    sm562,
    sm563,
    sm564,
    sm565,
    sm566,
    sm567,
    sm56,
    sm568,
    sm569,
    sm570,
    sm30,
    sm571,
    sm572,
    sm573,
    sm574,
    sm575,
    sm576,
    sm577,
    sm578,
    sm578,
    sm579,
    sm580,
    sm581,
    sm582,
    sm583,
    sm584,
    sm585,
    sm586,
    sm30,
    sm587,
    sm60,
    sm588,
    sm30,
    sm30,
    sm589,
    sm590,
    sm60,
    sm591,
    sm592,
    sm593,
    sm594,
    sm30,
    sm595,
    sm596,
    sm596,
    sm30,
    sm597,
    sm598,
    sm599,
    sm600,
    sm601,
    sm601,
    sm602,
    sm603,
    sm604,
    sm605,
    sm605,
    sm606,
    sm607,
    sm608,
    sm608,
    sm608,
    sm609,
    sm610,
    sm610,
    sm496,
    sm603,
    sm611,
    sm612,
    sm613,
    sm614,
    sm615,
    sm616,
    sm617,
    sm618,
    sm619,
    sm620,
    sm621,
    sm621,
    sm622,
    sm623,
    sm624,
    sm623,
    sm625,
    sm626,
    sm627,
    sm628,
    sm629,
    sm630,
    sm631,
    sm632,
    sm633,
    sm634,
    sm635,
    sm636,
    sm637,
    sm638,
    sm639,
    sm640,
    sm641,
    sm642,
    sm642,
    sm643,
    sm643,
    sm644,
    sm645,
    sm644,
    sm644,
    sm646,
    sm647,
    sm648,
    sm649,
    sm650,
    sm649,
    sm649,
    sm651,
    sm652,
    sm653,
    sm653,
    sm653,
    sm654,
    sm640,
    sm655,
    sm656,
    sm656,
    sm657,
    sm658,
    sm659,
    sm660,
    sm661,
    sm661,
    sm661,
    sm662,
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
    sm674,
    sm674,
    sm675,
    sm676,
    sm677,
    sm678,
    sm679,
    sm680,
    sm681,
    sm682,
    sm683,
    sm684,
    sm684,
    sm685,
    sm686,
    sm687,
    sm686,
    sm60,
    sm688,
    sm689,
    sm690,
    sm60,
    sm691,
    sm60,
    sm692,
    sm693,
    sm694,
    sm695,
    sm696,
    sm697,
    sm60,
    sm60,
    sm698,
    sm60,
    sm60,
    sm60,
    sm60,
    sm699,
    sm30,
    sm700,
    sm701,
    sm702,
    sm703,
    sm704,
    sm30,
    sm705,
    sm68,
    sm604,
    sm706,
    sm30,
    sm707,
    sm708,
    sm709,
    sm710,
    sm711,
    sm712,
    sm713,
    sm714,
    sm616,
    sm715,
    sm716,
    sm717,
    sm717,
    sm718,
    sm719,
    sm720,
    sm721,
    sm722,
    sm723,
    sm724,
    sm725,
    sm726,
    sm727,
    sm728,
    sm727,
    sm729,
    sm730,
    sm731,
    sm732,
    sm722,
    sm733,
    sm734,
    sm735,
    sm209,
    sm538,
    sm736,
    sm737,
    sm738,
    sm739,
    sm616,
    sm616,
    sm740,
    sm741,
    sm742,
    sm743,
    sm744,
    sm60,
    sm60,
    sm745,
    sm60,
    sm746,
    sm747,
    sm748,
    sm60,
    sm60,
    sm60,
    sm60,
    sm749,
    sm750,
    sm751,
    sm752,
    sm751,
    sm752,
    sm60,
    sm753,
    sm60,
    sm754,
    sm755,
    sm756,
    sm757,
    sm755,
    sm758,
    sm113,
    sm759,
    sm760,
    sm761,
    sm762,
    sm763,
    sm761,
    sm764,
    sm765,
    sm766,
    sm767,
    sm768,
    sm643,
    sm769,
    sm643,
    sm770,
    sm770,
    sm771,
    sm772,
    sm773,
    sm774,
    sm616,
    sm60,
    sm775,
    sm776,
    sm777,
    sm778,
    sm60,
    sm60,
    sm779,
    sm780,
    sm781,
    sm782,
    sm783,
    sm60,
    sm783,
    sm784,
    sm785,
    sm785,
    sm786,
    sm787,
    sm788,
    sm789,
    sm788,
    sm788,
    sm790,
    sm791,
    sm792,
    sm791,
    sm793,
    sm794,
    sm795,
    sm796,
    sm797,
    sm798,
    sm799,
    sm60,
    sm800,
    sm801,
    sm802,
    sm803,
    sm804,
    sm805,
    sm806,
    sm807],

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
    e$2],

        //Empty Function
        nf = ()=>-1, 

        //Environment Functions
        
    redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
    rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);        o.length = ln + 1;        return ret;    },
    redn = (ret, plen, t, e, o, l, s) => {        if(plen > 0){            let ln = max(o.length - plen, 0);            o[ln] = o[o.length -1];            o.length = ln + 1;        }        return ret;    },
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
    R0_html$TAG_BODY=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1]), sym[0]},

        //Sparse Map Lookup
        lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

        //State Action Functions
        state_funct = [(...v)=>((redn(9219,0,...v))),
    ()=>(330),
    ()=>(286),
    ()=>(110),
    ()=>(374),
    ()=>(514),
    ()=>(450),
    ()=>(198),
    ()=>(206),
    ()=>(562),
    ()=>(570),
    ()=>(594),
    ()=>(598),
    ()=>(602),
    ()=>(606),
    ()=>(334),
    ()=>(482),
    ()=>(474),
    ()=>(490),
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
    ()=>(494),
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
    ()=>(630),
    (...v)=>(redv(115719,R0_S,1,0,...v)),
    (...v)=>(redv(116743,R0_S,1,0,...v)),
    (...v)=>(redv(136199,R0_S,1,0,...v)),
    (...v)=>(rednv(137223,fn.stmts,1,0,...v)),
    ()=>(646),
    ()=>(642),
    (...v)=>(redv(138247,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(139271,1,...v)),
    (...v)=>(redn(140295,1,...v)),
    (...v)=>(redn(144391,1,...v)),
    ()=>(658),
    ()=>(686),
    ()=>(682),
    (...v)=>(redv(203783,R0_S,1,0,...v)),
    (...v)=>(redn(228359,1,...v)),
    (...v)=>(redn(243719,1,...v)),
    ()=>(690),
    ()=>(742),
    ()=>(706),
    ()=>(710),
    ()=>(714),
    ()=>(718),
    ()=>(722),
    ()=>(726),
    ()=>(730),
    ()=>(734),
    ()=>(738),
    ()=>(746),
    ()=>(750),
    ()=>(698),
    ()=>(702),
    (...v)=>(redn(230407,1,...v)),
    ()=>(758),
    ()=>(754),
    (...v)=>(redn(231431,1,...v)),
    ()=>(762),
    (...v)=>(redn(232455,1,...v)),
    ()=>(766),
    (...v)=>(redn(233479,1,...v)),
    ()=>(770),
    (...v)=>(redn(234503,1,...v)),
    ()=>(774),
    (...v)=>(redn(235527,1,...v)),
    ()=>(778),
    ()=>(782),
    ()=>(786),
    ()=>(790),
    (...v)=>(redn(236551,1,...v)),
    ()=>(794),
    ()=>(798),
    ()=>(802),
    ()=>(814),
    ()=>(806),
    ()=>(810),
    (...v)=>(redn(237575,1,...v)),
    ()=>(818),
    ()=>(822),
    ()=>(826),
    (...v)=>(redn(238599,1,...v)),
    ()=>(830),
    ()=>(834),
    (...v)=>(redn(239623,1,...v)),
    ()=>(842),
    ()=>(846),
    ()=>(838),
    (...v)=>(redn(240647,1,...v)),
    (...v)=>(redn(241671,1,...v)),
    (...v)=>(redn(242695,1,...v)),
    ()=>(850),
    ()=>(886),
    ()=>(882),
    (...v)=>(redn(204807,1,...v)),
    ()=>(930),
    ()=>(938),
    ()=>(942),
    (...v)=>(redn(205831,1,...v)),
    ()=>(950),
    ()=>(946),
    ()=>(966),
    ()=>(970),
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
    ()=>(990),
    ()=>(994),
    ()=>(998),
    (...v)=>(rednv(260103,fn.numeric_literal,1,0,...v)),
    ()=>(1006),
    ()=>(1014),
    ()=>(1022),
    ()=>(1026),
    (...v)=>(redn(208903,1,...v)),
    (...v)=>(redn(210951,1,...v)),
    ()=>(1038),
    ()=>(1046),
    ()=>(1078),
    ()=>(1082),
    (...v)=>(rednv(146439,C0_js$empty_statement,1,0,...v)),
    ()=>(1086),
    (...v)=>(redn(143367,1,...v)),
    ()=>(1094),
    (...v)=>(shftf(1098,I1_js$iteration_statement,...v)),
    ()=>(1102),
    ()=>(1106),
    ()=>(1110),
    ()=>(1122),
    ()=>(1130),
    ()=>(1138),
    ()=>(1150),
    (...v)=>(redn(270343,1,...v)),
    (...v)=>(redn(272391,1,...v)),
    ()=>(1166),
    ()=>(1194),
    ()=>(1278),
    ()=>(1282),
    ()=>(1274),
    ()=>(1190),
    ()=>(1178),
    ()=>(1182),
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
    ()=>(1266),
    (...v)=>(redv(269319,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(268295,1,...v)),
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
    (...v)=>(redn(288775,1,...v)),
    (...v)=>(redv(287751,R1_css$general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(286727,1,...v)),
    (...v)=>(redn(289799,1,...v)),
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
    (...v)=>(redv(270347,R0_html$HTML,2,0,...v)),
    (...v)=>(redv(269323,R0_css$import_list,2,0,...v)),
    (...v)=>(redv(272395,R3_js$case_block,2,0,...v)),
    ()=>(2042),
    ()=>(2018),
    ()=>(2022),
    ()=>(2038),
    ()=>(2034),
    ()=>(2050),
    ()=>(2054),
    ()=>(2066),
    (...v)=>(redn(281607,1,...v)),
    (...v)=>(redn(275463,1,...v)),
    (...v)=>(redv(283655,R1_css$general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(284679,1,...v)),
    (...v)=>(rednv(195595,fn.class_stmt,2,0,...v)),
    ()=>(2082),
    ()=>(2110),
    ()=>(2090),
    ()=>(2106),
    (...v)=>((redn(181251,0,...v))),
    ()=>(2150),
    ()=>(2158),
    ()=>(2154),
    (...v)=>(redv(176135,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(9227,2,...v)),
    (...v)=>(redv(6155,R0_css$import_list,2,0,...v)),
    (...v)=>(redv(8203,R0_css$import_list,2,0,...v)),
    (...v)=>(redn(14347,2,...v)),
    ()=>(2178),
    ()=>(2198),
    ()=>(2190),
    ()=>(2194),
    ()=>(2258),
    ()=>(2242),
    ()=>(2262),
    ()=>(2246),
    ()=>(2270),
    ()=>(2314),
    ()=>(2310),
    ()=>(2282),
    ()=>(2290),
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
    ()=>(2362),
    ()=>(2346),
    ()=>(2338),
    ()=>(2350),
    ()=>(2354),
    ()=>(2358),
    (...v)=>(rednv(103435,fn.pseudoClassSelector,2,0,...v)),
    ()=>(2370),
    (...v)=>(rednv(104459,fn.pseudoElementSelector,2,0,...v)),
    (...v)=>(redn(87051,2,...v)),
    (...v)=>(redv(86023,R1_css$import_list,1,0,...v)),
    (...v)=>(rednv(145423,fn.block,3,0,...v)),
    ()=>(2378),
    (...v)=>(rednv(11279,C0_css$RULE_SET,3,0,...v)),
    (...v)=>(redv(109579,R2_css$declaration_list,2,0,...v)),
    (...v)=>(redv(109579,R3_css$declaration_list,2,0,...v)),
    ()=>(2382),
    (...v)=>(redv(108551,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(107527,1,...v)),
    ()=>(2402),
    ()=>(2406),
    ()=>(2394),
    (...v)=>(redv(109579,R0_css$declaration_list,2,0,...v)),
    (...v)=>(redv(203791,R0_js$expression,3,0,...v)),
    (...v)=>(rednv(228367,fn.assign,3,0,...v)),
    ()=>(2414),
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
    ()=>(2422),
    ()=>(2418),
    ()=>(2442),
    ()=>(2434),
    (...v)=>(redn(226311,1,...v)),
    (...v)=>(redv(225287,R1_css$import_list,1,0,...v)),
    (...v)=>(redv(216075,R3_js$class_tail,2,0,...v)),
    ()=>(2454),
    ()=>(2450),
    (...v)=>(redv(217095,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(218119,1,...v)),
    ()=>(2466),
    ()=>(2470),
    (...v)=>(redn(220167,1,...v)),
    (...v)=>(redn(219143,1,...v)),
    (...v)=>(rednv(210959,fn.call_expr,3,0,...v)),
    ()=>(2486),
    (...v)=>(redv(213003,R0_js$arguments,2,0,...v)),
    ()=>(2494),
    ()=>(2490),
    (...v)=>(redv(214023,R1_css$import_list,1,0,...v)),
    ()=>(2502),
    (...v)=>(rednv(206863,fn.member,3,0,...v)),
    (...v)=>(rednv(206863,fn.new_member_stmt,3,0,...v)),
    (...v)=>(rednv(209935,fn.new_target_expr,3,0,...v)),
    (...v)=>(redv(285711,R3_js$case_block,3,0,...v)),
    (...v)=>(redv(287755,R0_css$general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redv(245775,R3_js$case_block,3,0,...v)),
    ()=>(2506),
    ()=>(2510),
    ()=>(2514),
    ()=>(2518),
    (...v)=>(rednv(207887,fn.supper_expr,3,0,...v)),
    ()=>(2522),
    (...v)=>(redv(187407,R0_js$arrow_function,3,0,...v)),
    (...v)=>(redn(189447,1,...v)),
    (...v)=>(redv(163851,R3_js$case_block,2,0,...v)),
    (...v)=>(redn(164871,1,...v)),
    (...v)=>(rednv(171023,fn.var_stmt,3,0,...v)),
    (...v)=>(rednv(173067,fn.binding,2,0,...v)),
    (...v)=>(redn(247819,2,...v)),
    ()=>(2542),
    ()=>(2550),
    ()=>(2546),
    (...v)=>(redn(250887,1,...v)),
    (...v)=>(redn(253959,1,...v)),
    ()=>(2558),
    (...v)=>(redn(256007,1,...v)),
    (...v)=>(redn(248843,2,...v)),
    ()=>(2570),
    ()=>(2578),
    ()=>(2586),
    ()=>(2582),
    (...v)=>(redn(251911,1,...v)),
    (...v)=>(redn(252935,1,...v)),
    (...v)=>(redn(254983,1,...v)),
    ()=>(2602),
    ()=>(2606),
    ()=>(2610),
    ()=>(2614),
    ()=>(2622),
    ()=>(2646),
    ()=>(2650),
    ()=>(2654),
    ()=>(2658),
    ()=>(2662),
    ()=>(2682),
    ()=>(2694),
    (...v)=>(redv(152591,R0_js$continue_statement,3,0,...v)),
    (...v)=>(redv(153615,R0_js$break_statement,3,0,...v)),
    (...v)=>(rednv(154639,fn.return_stmt,3,0,...v)),
    ()=>(2698),
    (...v)=>(rednv(155663,fn.throw_stmt,3,0,...v)),
    (...v)=>(redv(165903,R0_js$try_statement,3,0,...v)),
    (...v)=>(redv(165903,R1_js$try_statement,3,0,...v)),
    ()=>(2706),
    ()=>(2714),
    ()=>(2718),
    (...v)=>(shftf(2762,I0_BASIC_BINDING,...v)),
    ()=>(2742),
    (...v)=>((redn(276483,0,...v))),
    ()=>(2766),
    (...v)=>(redv(277511,R1_css$import_list,1,0,...v)),
    (...v)=>(rednv(278535,fn.attribute,1,0,...v)),
    ()=>(2770),
    ()=>(2774),
    ()=>(2778),
    (...v)=>(redn(279559,1,...v)),
    ()=>(2782),
    ()=>(2786),
    (...v)=>(rednv(274447,fn.element_selector,3,0,...v)),
    ()=>(2790),
    ()=>(2794),
    ()=>(2798),
    ()=>(2802),
    (...v)=>(redv(273423,R3_js$class_tail,3,0,...v)),
    (...v)=>(redv(283659,R0_css$general_enclosed6202_group_list,2,0,...v)),
    ()=>(2810),
    ()=>(2806),
    (...v)=>(rednv(195599,fn.class_stmt,3,0,...v)),
    ()=>(2818),
    ()=>(2822),
    (...v)=>(redv(196619,R3_js$class_tail,2,0,...v)),
    (...v)=>(redn(198663,1,...v)),
    (...v)=>(redv(199687,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(200711,1,...v)),
    (...v)=>(redv(197643,R3_js$case_block,2,0,...v)),
    ()=>(2834),
    (...v)=>(redn(181255,1,...v)),
    ()=>(2838),
    (...v)=>(redn(183303,1,...v)),
    (...v)=>(redv(182279,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(184327,1,...v)),
    (...v)=>(rednv(174095,fn.lexical,3,0,...v)),
    (...v)=>(rednv(177163,fn.binding,2,0,...v)),
    ()=>(2854),
    (...v)=>(redn(20495,3,...v)),
    ()=>(2866),
    (...v)=>(redv(15367,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(16391,1,...v)),
    ()=>(2874),
    ()=>(2882),
    ()=>(2890),
    ()=>(2886),
    (...v)=>(redv(38919,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(43015,1,...v)),
    ()=>(2898),
    ()=>(2906),
    (...v)=>(redn(45063,1,...v)),
    (...v)=>(redn(44039,1,...v)),
    ()=>(2922),
    ()=>(2930),
    ()=>(2974),
    ()=>(2946),
    ()=>(2950),
    (...v)=>(redn(53255,1,...v)),
    (...v)=>(redn(72711,1,...v)),
    ()=>(2986),
    (...v)=>(redn(40967,1,...v)),
    ()=>(2990),
    (...v)=>(redn(23559,1,...v)),
    ()=>(2994),
    (...v)=>(redn(33799,1,...v)),
    ()=>(3014),
    ()=>(3022),
    ()=>(3034),
    (...v)=>(redn(34823,1,...v)),
    (...v)=>(redn(35847,1,...v)),
    ()=>(3038),
    ()=>(3042),
    ()=>(3046),
    (...v)=>(redv(10255,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(82955,R0_css$import_list,2,0,...v)),
    (...v)=>(redv(81931,fn.comboSelector,2,0,...v)),
    (...v)=>(rednv(89103,fn.compoundSelector,3,0,...v)),
    (...v)=>(rednv(99343,fn.attribSelector,3,0,...v)),
    ()=>(3054),
    ()=>(3058),
    ()=>(3062),
    (...v)=>(redn(100359,1,...v)),
    (...v)=>(rednv(103439,fn.pseudoClassSelector,3,0,...v)),
    (...v)=>(redv(86027,R0_css$import_list,2,0,...v)),
    (...v)=>(rednv(11283,C0_css$RULE_SET,4,0,...v)),
    (...v)=>(redv(109583,R3_css$declaration_list,3,0,...v)),
    (...v)=>(redv(111631,fn.parseDeclaration,3,0,...v)),
    ()=>(3082),
    (...v)=>(redn(114695,1,...v)),
    (...v)=>(redv(113671,R1_css$general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(112647,1,...v)),
    (...v)=>(redv(106511,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(224271,R0_js$array_literal,3,0,...v)),
    (...v)=>(redn(226315,2,...v)),
    (...v)=>(redv(225291,R0_js$element_list,2,0,...v)),
    (...v)=>(redv(224271,R3_js$case_block,3,0,...v)),
    ()=>(3098),
    (...v)=>(rednv(227339,fn.spread_expr,2,0,...v)),
    (...v)=>(redv(216079,R3_js$case_block,3,0,...v)),
    ()=>(3114),
    (...v)=>(rednv(222219,fn.binding,2,0,...v)),
    (...v)=>(rednv(218123,fn.spread_expr,2,0,...v)),
    ()=>(3134),
    ()=>(3138),
    ()=>(3142),
    (...v)=>(rednv(210963,fn.call_expr,4,0,...v)),
    (...v)=>(redv(213007,R3_js$case_block,3,0,...v)),
    ()=>(3146),
    ()=>(3154),
    (...v)=>(rednv(214027,fn.spread_expr,2,0,...v)),
    (...v)=>(rednv(206867,fn.member,4,0,...v)),
    (...v)=>(redv(245779,R3_js$case_block,4,0,...v)),
    (...v)=>(redv(245779,R1_js$cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
    (...v)=>(rednv(207891,fn.supper_expr,4,0,...v)),
    ()=>(3166),
    (...v)=>(redn(186375,1,...v)),
    (...v)=>(redv(172047,R0_js$variable_declaration_list,3,0,...v)),
    (...v)=>(redv(223243,R3_js$case_block,2,0,...v)),
    (...v)=>(redn(247823,3,...v)),
    ()=>(3174),
    (...v)=>(redn(249867,2,...v)),
    (...v)=>(redn(256011,2,...v)),
    ()=>(3186),
    (...v)=>(redn(248847,3,...v)),
    (...v)=>(redn(252939,2,...v)),
    ()=>(3190),
    (...v)=>(redn(257035,2,...v)),
    (...v)=>(redn(254987,2,...v)),
    ()=>(3222),
    ()=>(3226),
    ()=>(3234),
    ()=>(3238),
    ()=>(3242),
    ()=>(3246),
    (...v)=>(redn(151559,1,...v)),
    ()=>(3250),
    ()=>(3258),
    (...v)=>(redn(150539,2,...v)),
    ()=>(3278),
    ()=>(3294),
    ()=>(3302),
    (...v)=>(redv(165907,R2_js$try_statement,4,0,...v)),
    (...v)=>(rednv(167947,fn.finally_stmt,2,0,...v)),
    ()=>(3326),
    (...v)=>(redv(277515,R0_html$TAG_BODY,2,0,...v)),
    ()=>(3330),
    (...v)=>(redv(276487,R1_css$import_list,1,0,...v)),
    (...v)=>(redv(276487,R3_js$class_tail,1,0,...v)),
    (...v)=>(rednv(282631,fn.text,1,0,...v)),
    (...v)=>(redn(2055,1,...v)),
    (...v)=>(rednv(274451,fn.element_selector,4,0,...v)),
    ()=>(3354),
    ()=>(3362),
    ()=>(3366),
    ()=>(3370),
    ()=>(3374),
    ()=>(3378),
    (...v)=>((redn(136195,0,...v))),
    ()=>(3394),
    (...v)=>(rednv(271379,fn.element_selector,4,0,...v)),
    ()=>(3398),
    (...v)=>(redv(196623,R2_js$class_tail,3,0,...v)),
    (...v)=>(redv(196623,R1_js$class_tail,3,0,...v)),
    (...v)=>(redv(199691,R0_js$class_element_list,2,0,...v)),
    (...v)=>(redv(200715,R0_js$class_element,2,0,...v)),
    ()=>(3402),
    (...v)=>(redv(181259,R0_S,2,0,...v)),
    ()=>(3414),
    (...v)=>(redv(176143,R0_js$variable_declaration_list,3,0,...v)),
    (...v)=>(redn(20499,4,...v)),
    (...v)=>(redv(15371,R0_css$import_list,2,0,...v)),
    ()=>(3430),
    ()=>(3438),
    ()=>(3434),
    (...v)=>(redv(79879,R1_css$general_enclosed6202_group_list,1,0,...v)),
    ()=>(3442),
    (...v)=>((redn(13315,0,...v))),
    (...v)=>(redn(43019,2,...v)),
    (...v)=>(redn(49163,2,...v)),
    (...v)=>(redn(52235,2,...v)),
    (...v)=>(redv(48135,R1_css$import_list,1,0,...v)),
    (...v)=>(redv(51207,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(46091,2,...v)),
    ()=>(3494),
    ()=>(3498),
    ()=>(3518),
    ()=>(3514),
    (...v)=>(redn(71687,1,...v)),
    ()=>(3506),
    (...v)=>(redn(54279,1,...v)),
    ()=>(3530),
    ()=>(3534),
    ()=>(3538),
    ()=>(3542),
    ()=>(3522),
    ()=>(3558),
    ()=>(3562),
    ()=>(3566),
    ()=>(3570),
    (...v)=>(redn(69639,1,...v)),
    ()=>(3578),
    ()=>(3582),
    ()=>(3586),
    ()=>(3590),
    ()=>(3610),
    ()=>(3606),
    ()=>(3598),
    ()=>(3642),
    ()=>(3630),
    ()=>(3634),
    (...v)=>(redn(33803,2,...v)),
    (...v)=>(redv(30727,R1_css$import_list,1,0,...v)),
    (...v)=>(redv(32775,R1_css$import_list,1,0,...v)),
    ()=>(3666),
    ()=>(3670),
    ()=>(3678),
    ()=>(3686),
    ()=>(3690),
    ()=>(3694),
    (...v)=>(redn(98311,1,...v)),
    (...v)=>(redn(100363,2,...v)),
    ()=>(3698),
    (...v)=>(redv(108559,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(111635,fn.parseDeclaration,4,0,...v)),
    (...v)=>(redv(114699,R0_css$declaration_values,2,0,...v)),
    ()=>(3702),
    (...v)=>(redv(113675,R0_css$general_enclosed6202_group_list,2,0,...v)),
    ()=>(3706),
    (...v)=>(rednv(230423,fn.condition_expr,5,0,...v)),
    (...v)=>(redv(224275,R3_js$case_block,4,0,...v)),
    (...v)=>(redv(225295,R1_js$element_list,3,0,...v)),
    (...v)=>(redv(216083,R3_js$case_block,4,0,...v)),
    (...v)=>(redv(217103,R0_js$formal_parameters,3,0,...v)),
    (...v)=>(rednv(218127,fn.property_binding,3,0,...v)),
    ()=>(3714),
    (...v)=>(redn(180231,1,...v)),
    ()=>(3718),
    (...v)=>(redv(221199,R3_js$case_block,3,0,...v)),
    (...v)=>(redv(213011,R3_js$case_block,4,0,...v)),
    (...v)=>(redv(214031,R0_js$formal_parameters,3,0,...v)),
    ()=>(3734),
    ()=>(3738),
    (...v)=>(redv(189455,R3_js$case_block,3,0,...v)),
    ()=>(3742),
    (...v)=>(redn(247827,4,...v)),
    (...v)=>(redn(250895,3,...v)),
    (...v)=>(redn(253967,3,...v)),
    (...v)=>(redn(248851,4,...v)),
    ()=>(3746),
    ()=>(3754),
    (...v)=>(redn(251919,3,...v)),
    (...v)=>(rednv(148503,fn.if_stmt,5,0,...v)),
    ()=>(3758),
    ()=>(3762),
    (...v)=>(rednv(149527,fn.while_stmt,5,0,...v)),
    ()=>(3766),
    ()=>(3774),
    ()=>(3782),
    ()=>(3794),
    ()=>(3810),
    ()=>(3814),
    ()=>(3822),
    ()=>(3826),
    ()=>(3830),
    ()=>(3834),
    ()=>(3842),
    (...v)=>(rednv(157719,fn.switch_stmt,5,0,...v)),
    ()=>(3850),
    ()=>(3870),
    ()=>(3866),
    (...v)=>(rednv(156695,fn.with_stmt,5,0,...v)),
    ()=>(3874),
    (...v)=>(redn(168967,1,...v)),
    ()=>(3878),
    (...v)=>(rednv(274455,fn.element_selector,5,0,...v)),
    (...v)=>(redv(276491,R0_html$TAG_BODY,2,0,...v)),
    ()=>(3890),
    ()=>(3886),
    (...v)=>(rednv(278543,fn.attribute,3,0,...v)),
    (...v)=>(redn(280583,1,...v)),
    (...v)=>(redv(279567,R3_js$case_block,3,0,...v)),
    ()=>(3902),
    ()=>(3906),
    ()=>(3910),
    (...v)=>(rednv(271383,fn.element_selector,5,0,...v)),
    (...v)=>(redv(196627,R0_js$class_tail,4,0,...v)),
    (...v)=>((redn(185347,0,...v))),
    (...v)=>(redv(181263,R0_js$formal_parameters,3,0,...v)),
    (...v)=>(redv(182287,R0_js$formal_parameters,3,0,...v)),
    ()=>(3922),
    (...v)=>(redn(20503,5,...v)),
    ()=>(3942),
    (...v)=>(redn(80911,3,...v)),
    (...v)=>(redv(79883,R0_css$general_enclosed6202_group_list,2,0,...v)),
    ()=>(3946),
    ()=>(3950),
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
    ()=>(3958),
    (...v)=>(redn(60431,3,...v)),
    (...v)=>(redv(59399,R1_css$general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(58375,1,...v)),
    ()=>(3974),
    (...v)=>(redn(62471,1,...v)),
    ()=>(3982),
    ()=>(3990),
    ()=>(3994),
    (...v)=>(redn(63495,1,...v)),
    ()=>(3998),
    (...v)=>(redn(76811,2,...v)),
    ()=>(4002),
    (...v)=>(redn(75783,1,...v)),
    ()=>(4006),
    (...v)=>(redv(57351,R1_css$general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(56327,1,...v)),
    ()=>(4014),
    (...v)=>(redv(21511,R1_css$import_list,1,0,...v)),
    ()=>(4026),
    ()=>(4022),
    (...v)=>(redv(24583,R1_css$import_list,1,0,...v)),
    (...v)=>(redn(27655,1,...v)),
    ()=>(4030),
    ()=>(4034),
    (...v)=>(redv(30731,R0_css$import_list,2,0,...v)),
    (...v)=>(redv(32779,R0_css$import_list,2,0,...v)),
    (...v)=>(redn(29707,2,...v)),
    (...v)=>(redn(31755,2,...v)),
    (...v)=>(redn(34831,3,...v)),
    (...v)=>(redn(36879,3,...v)),
    ()=>(4038),
    (...v)=>(rednv(11287,C0_css$RULE_SET,5,0,...v)),
    ()=>(4042),
    (...v)=>(rednv(99351,fn.attribSelector,5,0,...v)),
    (...v)=>(redn(101383,1,...v)),
    (...v)=>(redn(102415,3,...v)),
    (...v)=>(redn(110603,2,...v)),
    (...v)=>(redv(114703,R0_css$declaration_values,3,0,...v)),
    (...v)=>(redv(225299,R1_js$element_list,4,0,...v)),
    ()=>(4046),
    ()=>(4050),
    ()=>(4054),
    (...v)=>(redn(202759,1,...v)),
    (...v)=>(redv(214035,R0_js$argument_list,4,0,...v)),
    (...v)=>(redv(245787,R2_js$cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
    (...v)=>(redn(247831,5,...v)),
    (...v)=>(redn(248855,5,...v)),
    ()=>(4058),
    ()=>(4066),
    ()=>(4074),
    ()=>(4078),
    ()=>(4086),
    (...v)=>(redv(149531,R8_js$iteration_statement,6,0,...v)),
    ()=>(4094),
    ()=>(4102),
    ()=>(4106),
    ()=>(4110),
    ()=>(4114),
    (...v)=>(redv(149531,R15_js$iteration_statement,6,0,...v)),
    ()=>(4142),
    ()=>(4150),
    (...v)=>(redv(158731,R0_js$case_block,2,0,...v)),
    ()=>(4158),
    ()=>(4170),
    (...v)=>(redv(159751,R1_css$import_list,1,0,...v)),
    (...v)=>(redv(161799,R1_js$default_clause,1,0,...v)),
    ()=>(4178),
    ()=>(4190),
    (...v)=>(rednv(3087,fn.wick_binding,3,0,...v)),
    ()=>(4198),
    ()=>(4202),
    (...v)=>(rednv(274459,fn.element_selector,6,0,...v)),
    ()=>(4206),
    ()=>(4210),
    ()=>(4214),
    (...v)=>(redn(185351,1,...v)),
    (...v)=>(redn(20507,6,...v)),
    ()=>(4222),
    (...v)=>(redn(17415,1,...v)),
    (...v)=>(redn(77843,4,...v)),
    (...v)=>(redn(39963,6,...v)),
    (...v)=>(redv(12299,R0_css$import_list,2,0,...v)),
    (...v)=>(redn(60435,4,...v)),
    (...v)=>(redv(59403,R0_css$general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redn(61455,3,...v)),
    (...v)=>(redn(68623,3,...v)),
    (...v)=>(redn(62475,2,...v)),
    ()=>(4230),
    ()=>(4238),
    ()=>(4242),
    (...v)=>(redn(63499,2,...v)),
    (...v)=>(redn(73743,3,...v)),
    (...v)=>(redv(57355,R0_css$general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(rednv(22555,C0_css$keyframes,6,0,...v)),
    (...v)=>(redv(21515,R0_css$import_list,2,0,...v)),
    (...v)=>(redn(74763,2,...v)),
    (...v)=>(redn(28699,6,...v)),
    (...v)=>(redn(37907,4,...v)),
    (...v)=>(rednv(99355,fn.attribSelector,6,0,...v)),
    ()=>(4262),
    (...v)=>(redn(248859,6,...v)),
    (...v)=>(rednv(148511,fn.if_stmt,7,0,...v)),
    (...v)=>(rednv(149535,fn.do_while_stmt,7,0,...v)),
    (...v)=>(shftf(4266,I2_js$iteration_statement,...v)),
    (...v)=>(redv(149535,R7_js$iteration_statement,7,0,...v)),
    (...v)=>(redv(149535,R6_js$iteration_statement,7,0,...v)),
    ()=>(4286),
    ()=>(4290),
    (...v)=>(redv(149535,R13_js$iteration_statement,7,0,...v)),
    (...v)=>(redv(149535,R14_js$iteration_statement,7,0,...v)),
    (...v)=>(redv(149535,R16_js$iteration_statement,7,0,...v)),
    (...v)=>(redv(149535,R18_js$iteration_statement,7,0,...v)),
    ()=>(4314),
    ()=>(4326),
    (...v)=>(redv(158735,R3_js$case_block,3,0,...v)),
    (...v)=>(redv(159755,R0_js$case_clauses,2,0,...v)),
    ()=>(4330),
    ()=>(4334),
    (...v)=>(rednv(166935,fn.catch_stmt,5,0,...v)),
    ()=>(4342),
    (...v)=>(rednv(274463,fn.element_selector,7,0,...v)),
    ()=>(4346),
    (...v)=>(redv(280591,R3_js$case_block,3,0,...v)),
    ()=>(4350),
    ()=>(4354),
    (...v)=>(redv(179231,R0_js$function_declaration,7,0,...v)),
    ()=>(4358),
    (...v)=>(redn(18451,4,...v)),
    (...v)=>(redn(65543,1,...v)),
    ()=>(4366),
    (...v)=>(redn(67591,1,...v)),
    ()=>(4382),
    ()=>(4378),
    (...v)=>(redv(24591,R0_css$COMPLEX_SELECTOR_list,3,0,...v)),
    ()=>(4386),
    ()=>(4390),
    (...v)=>(redv(149539,R5_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R4_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R3_js$iteration_statement,8,0,...v)),
    ()=>(4402),
    (...v)=>(redv(149539,R12_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R17_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R18_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R0_js$iteration_statement,8,0,...v)),
    (...v)=>(redv(149539,R19_js$iteration_statement,8,0,...v)),
    ()=>(4418),
    (...v)=>(redv(158739,R2_js$case_block,4,0,...v)),
    (...v)=>(redv(160783,R1_js$case_clause,3,0,...v)),
    (...v)=>(redv(161807,R0_js$default_clause,3,0,...v)),
    (...v)=>(rednv(274467,fn.element_selector,8,0,...v)),
    (...v)=>(rednv(4119,fn.wick_binding,5,0,...v)),
    (...v)=>(redv(179235,R1_js$function_declaration,8,0,...v)),
    (...v)=>(redn(68631,5,...v)),
    (...v)=>(redn(65547,2,...v)),
    ()=>(4426),
    (...v)=>(rednv(26643,C0_css$keyframes_blocks,4,0,...v)),
    (...v)=>(redn(25607,1,...v)),
    (...v)=>(rednv(201759,fn.class_method,7,0,...v)),
    (...v)=>(rednv(201759,fn.class_get_method,7,0,...v)),
    ()=>(4430),
    (...v)=>(redv(149543,R0_js$iteration_statement,9,0,...v)),
    (...v)=>(redv(149543,R10_js$iteration_statement,9,0,...v)),
    (...v)=>(redv(149543,R11_js$iteration_statement,9,0,...v)),
    (...v)=>(redv(149543,R20_js$iteration_statement,9,0,...v)),
    (...v)=>(redv(158743,R1_js$case_block,5,0,...v)),
    (...v)=>(redv(160787,R0_js$case_clause,4,0,...v)),
    (...v)=>(rednv(26647,C0_css$keyframes_blocks,5,0,...v)),
    (...v)=>(rednv(201763,fn.class_set_method,8,0,...v)),
    (...v)=>(redv(149547,R9_js$iteration_statement,10,0,...v))],

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
    v=>lsm(v,gt150),
    v=>lsm(v,gt151),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt150),
    nf,
    nf,
    v=>lsm(v,gt150),
    v=>lsm(v,gt150),
    nf,
    nf,
    v=>lsm(v,gt150),
    nf,
    v=>lsm(v,gt152),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt155),
    nf,
    v=>lsm(v,gt156),
    nf,
    nf,
    v=>lsm(v,gt157),
    v=>lsm(v,gt158),
    nf,
    nf,
    nf,
    v=>lsm(v,gt159),
    v=>lsm(v,gt160),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt161),
    v=>lsm(v,gt162),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt163),
    v=>lsm(v,gt164),
    v=>lsm(v,gt165),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt166),
    v=>lsm(v,gt167),
    v=>lsm(v,gt168),
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
    v=>lsm(v,gt169),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt170),
    nf,
    nf,
    v=>lsm(v,gt171),
    v=>lsm(v,gt172),
    v=>lsm(v,gt173),
    v=>lsm(v,gt174),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt175),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt176),
    nf,
    nf,
    v=>lsm(v,gt177),
    nf,
    nf,
    v=>lsm(v,gt178),
    v=>lsm(v,gt179),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt180),
    nf,
    nf,
    nf,
    v=>lsm(v,gt181),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt1),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt182),
    nf,
    v=>lsm(v,gt183),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt184),
    nf,
    nf,
    nf,
    v=>lsm(v,gt185),
    v=>lsm(v,gt186),
    v=>lsm(v,gt187),
    v=>lsm(v,gt188),
    nf,
    v=>lsm(v,gt189),
    nf,
    nf,
    v=>lsm(v,gt88),
    v=>lsm(v,gt89),
    nf,
    v=>lsm(v,gt190),
    v=>lsm(v,gt191),
    v=>lsm(v,gt192),
    v=>lsm(v,gt193),
    v=>lsm(v,gt194),
    nf,
    v=>lsm(v,gt109),
    v=>lsm(v,gt110),
    nf,
    v=>lsm(v,gt195),
    nf,
    v=>lsm(v,gt196),
    v=>lsm(v,gt197),
    v=>lsm(v,gt198),
    nf,
    v=>lsm(v,gt199),
    nf,
    v=>lsm(v,gt200),
    nf,
    nf,
    v=>lsm(v,gt201),
    nf,
    nf,
    nf,
    v=>lsm(v,gt31),
    v=>lsm(v,gt103),
    nf,
    nf,
    nf,
    v=>lsm(v,gt202),
    nf,
    v=>lsm(v,gt203),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt204),
    nf,
    v=>lsm(v,gt205),
    v=>lsm(v,gt206),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt207),
    nf,
    nf,
    v=>lsm(v,gt208),
    nf,
    v=>lsm(v,gt209),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt210),
    v=>lsm(v,gt211),
    v=>lsm(v,gt212),
    v=>lsm(v,gt213),
    nf,
    nf,
    v=>lsm(v,gt214),
    v=>lsm(v,gt215),
    v=>lsm(v,gt216),
    nf,
    v=>lsm(v,gt217),
    nf,
    v=>lsm(v,gt218),
    nf,
    nf,
    nf,
    v=>lsm(v,gt219),
    v=>lsm(v,gt164),
    nf,
    nf,
    nf,
    v=>lsm(v,gt220),
    v=>lsm(v,gt221),
    v=>lsm(v,gt222),
    nf,
    nf,
    v=>lsm(v,gt223),
    v=>lsm(v,gt224),
    v=>lsm(v,gt225),
    nf,
    v=>lsm(v,gt226),
    v=>lsm(v,gt227),
    nf,
    v=>lsm(v,gt228),
    nf,
    v=>lsm(v,gt229),
    nf,
    nf,
    v=>lsm(v,gt219),
    v=>lsm(v,gt230),
    nf,
    nf,
    v=>lsm(v,gt231),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt232),
    nf,
    nf,
    v=>lsm(v,gt232),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt233),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt234),
    nf,
    nf,
    nf,
    v=>lsm(v,gt235),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt236),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt237),
    v=>lsm(v,gt238),
    nf,
    v=>lsm(v,gt239),
    v=>lsm(v,gt240),
    v=>lsm(v,gt241),
    v=>lsm(v,gt242),
    v=>lsm(v,gt243),
    nf,
    v=>lsm(v,gt244),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt245),
    nf,
    nf,
    nf,
    v=>lsm(v,gt246),
    nf,
    v=>lsm(v,gt247),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt201),
    nf,
    v=>lsm(v,gt248),
    nf,
    nf,
    nf,
    nf,
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
    nf,
    v=>lsm(v,gt251),
    nf,
    nf,
    nf,
    v=>lsm(v,gt252),
    nf,
    nf,
    v=>lsm(v,gt253),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt254),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt255),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt256),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt257),
    v=>lsm(v,gt258),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt259),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt260),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt261),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt262),
    nf,
    v=>lsm(v,gt263),
    nf,
    v=>lsm(v,gt264),
    nf,
    v=>lsm(v,gt265),
    nf,
    nf,
    v=>lsm(v,gt266),
    nf,
    nf,
    nf,
    v=>lsm(v,gt267),
    v=>lsm(v,gt268),
    nf,
    v=>lsm(v,gt269),
    v=>lsm(v,gt270),
    v=>lsm(v,gt271),
    v=>lsm(v,gt272),
    nf,
    v=>lsm(v,gt273),
    nf,
    nf,
    v=>lsm(v,gt274),
    v=>lsm(v,gt275),
    nf,
    v=>lsm(v,gt276),
    nf,
    v=>lsm(v,gt277),
    v=>lsm(v,gt278),
    nf,
    v=>lsm(v,gt279),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    nf,
    nf,
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
    nf,
    v=>lsm(v,gt283),
    v=>lsm(v,gt284),
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
    v=>lsm(v,gt287),
    v=>lsm(v,gt288),
    nf,
    v=>lsm(v,gt289),
    nf,
    v=>lsm(v,gt290),
    nf,
    v=>lsm(v,gt291),
    v=>lsm(v,gt292),
    v=>lsm(v,gt293),
    v=>lsm(v,gt294),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt295),
    nf,
    v=>lsm(v,gt296),
    v=>lsm(v,gt297),
    nf,
    nf,
    v=>lsm(v,gt298),
    nf,
    nf,
    v=>lsm(v,gt299),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt300),
    nf,
    v=>lsm(v,gt301),
    nf,
    nf,
    v=>lsm(v,gt302),
    nf,
    nf,
    nf,
    v=>lsm(v,gt303),
    v=>lsm(v,gt304),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt305),
    v=>lsm(v,gt306),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt307),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt308),
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
    v=>lsm(v,gt309),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt1),
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
    const er = Object.freeze(new CSSRule$1());

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

            // 
            this.media_selector = null;
            
            // All selectors indexed by their value
            this._selectors_ = {};

            //All selectors in order of appearance
            this._sel_a_ = [];

            //
            this.rules = []; 
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
                        let lex = whind$1(ss.v);
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

        matchMedia (win = window) {

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

        
        /* 
            Retrieves the set of rules from all matching selectors for an element.
                element HTMLElement - An DOM element that should be matched to applicable rules. 
        */
        getApplicableRules(element, rule = new CSSRule$1(), win = window) {

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
                let bool = this.parseProperty(lexer, rule, definitions);
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
                
                let selectors = [], l = 0;
                
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
                                         * @todo Conform to CSS spec and only parse if @import is at the head of the CSS string.
                                         */
                                        return type.fetchText().then((str) =>
                                            //Successfully fetched content, proceed to parse in the current root.
                                            //let import_lexer = ;
                                            res(this.parse(whind$1(str), this).then((r) => this.parse(lexer, r)))
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
                            //Check to see if a rule body for the selector exists already.
                            let MERGED = false;
                            let rule = new CSSRule$1(this);
                            this._applyProperties_(lexer.next(), rule);
                            for (let i = -1, sel = null; sel = selectors[++i];)
                                if (sel.r) {sel.r.merge(rule); MERGED = true;}
                                else sel.addRule(rule);

                            if(!MERGED){
                                this.rules.push(rule);
                            }
                                
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
            this.parse(whind$1(inCSSRuleBody + ""));
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
            let selector = this.parseSelector(whind$1(selector_value));

            if (selector)
                if (!this._selectors_[selector.id]) {
                    this._selectors_[selector.id] = selector;
                    this._sel_a_.push(selector);
                    const rule = new CSSRule$1(this);
                    selector.addRule(rule);
                    this.rules.push(rule);
                } else
                    selector = this._selectors_[selector.id];

            return selector;
        }
    }

    LinkedList.mixinTree(CSSRuleBody);

    class Segment {
        constructor(parent) {
            this.parent = null;

            this.css_val = "";

            this.val = document.createElement("span");
            this.val.classList.add("prop_value");

            this.list = document.createElement("div");
            this.list.classList.add("prop_list");
            //this.list.style.display = "none"

            this.ext = document.createElement("button");
            this.ext.classList.add("prop_extender");
            this.ext.style.display = "none";
            this.ext.setAttribute("action","ext");

            this.menu_icon = document.createElement("span");
            this.menu_icon.classList.add("prop_list_icon");
            //this.menu_icon.innerHTML = "+"
            this.menu_icon.style.display = "none";
            this.menu_icon.setAttribute("superset", false);
            this.menu_icon.appendChild(this.list);

            this.element = document.createElement("span");
            this.element.classList.add("prop_segment");

            this.element.appendChild(this.menu_icon);
            this.element.appendChild(this.val);
            this.element.appendChild(this.ext);

            this.value_list = [];
            this.subs = [];
            this.old_subs = [];
            this.sib = null;
            this.value_set;
            this.HAS_VALUE = false;
            this.DEMOTED = false;

            this.element.addEventListener("mouseover", e => {
                //this.setList();
            });
        }

        destroy() {
            this.parent = null;
            this.element = null;
            this.val = null;
            this.list = null;
            this.ext = null;
            this.menu_icon = null;
            this.subs.forEach(e => e.destroy());
            this.subs = null;
        }

        reset() {
            this.list.innerHTML = "";
            this.val.innerHTML = "";
            //this.subs.forEach(e => e.destroy);
            this.subs = [];
            this.setElement = null;
            this.changeEvent = null;
        }

        clearSegments(){
            if(this.subs.length > 0){
                this.val.innerHTML = "";
                for(let i = 0; i < this.subs.length; i++){
                    let sub = this.subs[i];
                    sub.destroy();
                }   
                this.subs.length = 0;
            }
        }

        replaceSub(old_sub, new_sub) {
            for (let i = 0; i < this.subs.length; i++) {
                if (this.subs[i] == old_sub) {
                    this.sub[i] = new_sub;
                    this.val.replaceChild(old_sub.element, new_sub.element);
                    return;
                }
            }
        }

        mount(element) {
            element.appendChild(this.element);
        }


        addSub(seg) {
            this.menu_icon.setAttribute("superset", true);
            seg.parent = this;
            this.subs.push(seg);
            this.val.appendChild(seg.element);
        }

        removeSub(seg) {
            if (seg.parent == this) {
                for (let i = 0; i < this.subs.length; i++) {
                    if (this.subs[i] == seg) {
                        this.val.removeChild(seg.element);
                        seg.parent = null;
                        break;
                    }
                }
            }
            return seg;
        }

        setList() {
            if(this.DEMOTED) debugger
            if (this.prod && this.list.innerHTML == "") {
                if (this.DEMOTED || !this.prod.buildList(this.list, this))
                    this.menu_icon.style.display = "none";
                else
                    this.menu_icon.style.display = "inline-block";
            }
        }
        change(e) {
            if (this.changeEvent)
                this.changeEvent(this.setElement, this, e);
        }

        setValueHandler(element, change_event_function) {
            this.val.innerHTML = "";
            this.val.appendChild(element);

            if (change_event_function) {
                this.setElement = element;
                this.changeEvent = change_event_function;
                this.setElement.onchange = this.change.bind(this);
            }

            this.HAS_VALUE = true;
            //this.menu_icon.style.display = "none";
            this.setList();
        }

        set value(v) {
            this.val.innerHTML = v;
            this.css_val = v;
            this.HAS_VALUE = true;
            this.setList();
        }

        get value_count() {
            if (this.subs.length > 0)
                return this.subs.length
            return (this.HAS_VALUE) ? 1 : 0;
        }

        promote() {

        }

        demote() {
            let seg = new Segment;
            seg.prod = this.prod;
            seg.css_val = this.css_val;

            if (this.change_event_function) {
                seg.changeEvent = this.changeEvent;
                seg.setElement = this.setElement;
                seg.setElement.onchange = seg.change.bind(seg);
            }

            let subs = this.subs;

            if (subs.length > 0) {

                for (let i = 0; i < this.subs.length; i++) 
                    seg.addSub(this.subs[i]);
                
            } else {


                let children = this.val.childNodes;

                if (children.length > 0) {
                    for (let i = 0, l = children.length; i < l; i++) {
                        seg.val.appendChild(children[0]);
                    }
                } else {
                    seg.val.innerHTML = this.val.innerHTML;
                }
            }


            this.menu_icon.innerHTML = "";
            this.menu_icon.style.display = "none";
            this.menu_icon.setAttribute("superset", false);
            this.list.innerHTML = "";

            this.reset();

            this.addSub(seg);
            seg.setList();
            
            this.DEMOTED = true;
        }

        addRepeat(seg) {
            if (!this.DEMOTED)
                //Turn self into own sub seg
                this.demote();
            this.addSub(seg);
            seg.setList();
        }

        repeat(prod = this.prod) {
            
            if (this.value_count <= this.end && this.prod.end > 1) {
                this.ext.style.display = "inline-block";

                let root_x = 0;
                let width = 0;
                let diff_width = 0;

                const move = (e) => {

                    let diff = e.clientX - root_x;
                    let min_diff = diff + diff_width;   

                    let EXTENDABLE = this.value_count < this.end;
                    let RETRACTABLE = this.value_count > 1;

                    if(EXTENDABLE && RETRACTABLE)
                        this.ext.setAttribute("action","both");
                    else if(EXTENDABLE)
                        this.ext.setAttribute("action","ext");
                    else
                        this.ext.setAttribute("action","ret");

                    if (diff > 15 && EXTENDABLE) {
                        let bb = this.element;

                        if (!this.DEMOTED) {
                            //Turn self into own sub seg
                            this.demote();
                        }

                        if (this.old_subs.length > 1) {
                            this.addSub(this.old_subs.pop());
                        } else {
                            prod.default(this, true);
                        }

                        let w = this.element.clientWidth;
                        diff_width = w - width;
                        width = w;
                        root_x += diff_width;

                        return;
                    }

                    let last_sub = this.subs[this.subs.length - 1];

                    if (diff < -5 - last_sub.width && RETRACTABLE) {
                        const sub = this.subs[this.subs.length - 1];
                        this.old_subs.push(sub);
                        this.removeSub(sub);
                        this.subs.length = this.subs.length - 1;

                        let w = this.element.clientWidth;
                        diff_width = w - width;
                        width = w;

                        root_x += diff_width;
                    }
                };

                const up = (e) => {
                    window.removeEventListener("pointermove", move);
                    window.removeEventListener("pointerup", up);
                };

                this.ext.onpointerdown = e => {
                    width = this.element.clientWidth;
                    root_x = e.clientX;
                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                };


                /*
                this.ext.onclick = e => {
                    if (this.subs.length == 0)
                        //Turn self into own sub seg
                        this.demote()

                    prod.default(this, true);

                    if (this.value_count >= this.end)
                        this.ext.style.display = "none";
                }
                */
            } else {
                this.ext.style.display = "none";
            }
            this.setList();
            this.update();
        }

        get width() {
            return this.element.clientWidth;
        }

        update() {
            if (this.parent)
                this.parent.update(this);
            else {
                let val = this.getValue();
            }
        }

        getValue() {
            let val = "";

            if (this.subs.length > 0)
                for (let i = 0; i < this.subs.length; i++)
                    val += " " + this.subs[i].getValue();
            else
                val = this.css_val;
            return val;
        }

        toString() {
            return this.getValue();
        }
    }

    class ValueTerm$1 extends ValueTerm {

        default (seg, APPEND = false, value = null) {
            if (!APPEND) {
                let element = this.value.valueHandler(value, seg);

                if (value) {
                    seg.css_val = value.toString();
                }
                seg.setValueHandler(element, (ele, seg, event) => {
                    seg.css_val = element.css_value;
                    seg.update();
                });
            } else {
                let sub = new Segment();
                let element = this.value.valueHandler(value, sub);
                if (value)
                    sub.css_val = value.toString();

                sub.setValueHandler(element, (ele, seg, event) => {
                    seg.css_val = element.css_value;
                    seg.update();
                });
                //sub.prod = list;
                seg.addSub(sub);
            }
        }

        buildInput(rep = 1, value) {
            let seg = new Segment();
            this.default(seg, false, value);
            return seg;
        }

        parseInput(l, seg, APPEND = false) {
            let val = this.value.parse(l);

            if (val) {
                this.default(seg, APPEND, val);
                return true;
            }

            return val;
        }

        list(ele, slot) {
            let element = document.createElement("div");
            element.classList.add("option");
            element.innerHTML = this.value.label_name || this.value.name;
            ele.appendChild(element);

            element.addEventListener("click", e => {

                slot.innerHTML = this.value;
                if (slot) {
                    let element = this.value.valueHandler();
                    element.addEventListener("change", e => {

                        let value = element.value;
                        slot.css_val = value;
                        slot.update();
                    });
                    slot.setValueHandler(element);
                } else {
                    let sub = new Segment();
                    sub.setValueHandler(this.value);
                    seg.addSub(sub);
                }
            });

            return 1;
        }

        setSegment(segment) {
            segment.element.innerHTML = this.value.name;
        }
    }

    class BlankTerm extends LiteralTerm {

        default (seg, APPEND = false) {

            if (!APPEND) {
                seg.value = "  ";
            } else {
                let sub = new Segment();
                sub.value = "";
                seg.addSub(sub);
            }
        }

        list(ele, slot) {
            let element = document.createElement("div");
            element.innerHTML = this.value;
            element.classList.add("option");
            //        ele.appendChild(element) 

            return 1;
        }

        parseInput(seg, APPEND = false) {
            this.default(seg, APPEND);
            return false;
        }
    }

    class LiteralTerm$1 extends LiteralTerm {

        default (seg, APPEND = false) {
            if (!APPEND) {
                seg.value = this.value;
            } else {
                let sub = new Segment();
                sub.value = this.value;
                seg.addSub(sub);
            }
        }

        list(ele, slot) {
            let element = document.createElement("div");
            element.innerHTML = this.value;
            element.classList.add("option");
            ele.appendChild(element);
            element.addEventListener("click", e => {
                slot.value = this.value + "";
                slot.update();
            });

            return 1;
        }

        parseInput(l, seg, APPEND = false) {
            if (typeof(l) == "string")
                l = whind(l);

            if (l.tx == this.value) {
                l.next();
                this.default(seg, APPEND);
                return true;
            }

            return false;
        }
    }

    class SymbolTerm$1 extends LiteralTerm$1 {
        list() { return 0 }

        parseInput(l, seg, r) {
            if (typeof(l) == "string")
                l = whind(l);

            if (l.tx == this.value) {
                l.next();
                let sub = new Segment();
                sub.value = this.value + "";
                seg.addSub(sub);
                return true;
            }

            return false;
        }
    }

    /**
     * wick internals.
     * @class      JUX (name)
     */
    class JUX$1 extends JUX {
        //Adds an entry in options list. 


        createSegment() {
            let segment = new Segment();
            segment.start = this.start;
            segment.end = this.end;
            segment.prod = this;
            return segment
        }

        insertBlank(seg){
            let blank = new BlankTerm;
            blank.parseInput(seg);
        }

        buildList(list, slot) {

            if (!slot) {
                let element = document.createElement("div");
                element.classList.add("prop_slot");
                slot = element;
            }

            if (!list) {
                list = document.createElement("div");
                list.classList.add("prop_slot");
                slot.appendChild(list);
            }
            let count = 0;
            //Build List
            for (let i = 0, l = this.terms.length; i < l; i++) {
                count += this.terms[i].list(list, slot);
            }

            return count > 1;
        }

        seal() {}

        parseInput(lx, segment, list) {

            if (typeof(lx) == "string")
                lx = whind$1(lx);

            return this.pi(lx, segment, list);
        }

        default (segment, EXTENDED = true) {
            let seg = this.createSegment();

            segment.addSub(seg);

            for (let i = 0, l = this.terms.length; i < l; i++) {
                this.terms[i].default(seg, l > 1);
            }
            seg.setList();

            if (!EXTENDED) seg.repeat();
        }

        pi(lx, ele, lister = this, start = this.start, end = this.end) {
            
            let segment = this.createSegment();

            let bool = false,
                j = 0,
                last_segment = null,
                first;

            repeat:
                for (let j = 0; j < end && !lx.END; j++) {
                    const REPEAT = j > 0;

                    let copy = lx.copy();

                    let seg = (REPEAT) ? new Segment : segment;

                    seg.prod = this;

                    for (let i = 0, l = this.terms.length; i < l; i++) {

                        let term = this.terms[i];

                        if (!term.parseInput(copy, seg, l > 1)) {
                            if (!term.OPTIONAL) {
                                break repeat;
                            }
                        }
                    }

                    lx.sync(copy);

                    bool = true;

                    if (!this.checkForComma(lx))
                        break;

                    if (REPEAT)
                        segment.addRepeat(seg);
                }

                this.capParse(segment, ele, bool);
                
                return bool;
        }

        capParse(segment, ele, bool){
            if (bool) {
                segment.repeat();
                if (ele)
                    ele.addSub(segment);
                this.last_segment = segment;
            }else {
                segment.destroy();
                if(this.OPTIONAL){
                    if(ele){
                        let segment = this.createSegment();
                        let blank = new BlankTerm();
                        blank.parseInput(segment);
                        segment.prod = this;
                        
                        segment.repeat();
                        ele.addSub(segment);
                    }
                }
            }
        }

        buildInput(repeat = 1, lex) {

            this.last_segment = null;
            let seg = new Segment;
            seg.start = this.start;
            seg.end = this.end;
            seg.prod = this;
            this.parseInput(lex, seg, this);
            return this.last_segment;
        }

        list(){
            
        }
    }

    class AND$1 extends JUX$1 {

        default (segment, EXTENDED = false) {
            //let seg = this.createSegment();
            //segment.addSub(seg);
            for (let i = 0, l = this.terms.length; i < l; i++) {
                this.terms[i].default(segment, i > 1);
            }
            //seg.repeat();
        }

        list(ele, slot) {

            let name = (this.name) ? this.name.replace("\_\g", " ") : this.terms.reduce((r, t) => r += " | " + t.name, "");
            let element = document.createElement("div");
            element.classList.add("option");
            element.innerHTML = name;
            ele.appendChild(element);

            element.addEventListener("click", e => {
                
                slot.innerHTML = this.value;
                if (slot) {
                    slot.clearSegments();
                    this.default(slot);
                    slot.update();
                } else {
                    let sub = new Segment();
                    sub.setValueHandler(this.value);
                    seg.addSub(sub);
                }
            });

            return 1;
        }

        pi(lx, ele, lister = this, start = 1, end = 1) {

            outer: for (let j = 0; j < end && !lx.END; j++) {
                for (let i = 0, l = this.terms.length; i < l; i++)
                    if (!this.terms[i].parseInput(lx, ele)) return (start === 0) ? true : false
            }

            segment.repeat();

            return true;
        }
    }
    Object.assign(AND$1.prototype, AND.prototype);

    class OR$1 extends JUX$1 {

        default (segment, EXTENDED = false) {
            //let seg = this.createSegment();
            //segment.addSub(seg);
            for (let i = 0, l = this.terms.length; i < l; i++) {
                this.terms[i].default(segment, l > 1);
            }
            //seg.repeat();
        }

        buildList(list, slot) {
            return false;
        }

        list(ele, slot) {

            let name = this.terms.reduce((r, t) => r += " | " + t.name, "");
            let element = document.createElement("div");
            element.classList.add("option");
            element.innerHTML = name;
            ele.appendChild(element);

            element.addEventListener("click", e => {
                
                slot.innerHTML = this.value;
                if (slot) {
                    slot.clearSegments();
                    this.default(slot);
                    slot.update();
                } else {
                    let sub = new Segment();
                    sub.setValueHandler(this.value);
                    seg.addSub(sub);
                }
            });

            return 1;
        }

        pi(lx, ele, lister = this, start = this.start, end = this.end) {
            
            let segment = ele; //this.createSegment()

            let bool = false;

            let j = 0;

            let OVERALL_BOOL = false;

            for (let j = 0; j < end && !lx.END; j++) {
                const REPEAT = j > 0;

                let seg = (REPEAT) ? new Segment : segment;


                bool = false;

                this.count = (this.count) ? this.count:this.count = 0;
                
                outer:
                //User "factorial" expression to isolate used results in a continous match. 
                while(true){
                    for (let i = 0, l = this.terms.length; i < l; i++) {
                        //if(this.terms[i].count == this.count) continue

                        if (this.terms[i].parseInput(lx, seg, true)) {
                            this.terms[i].count = this.count;
                            OVERALL_BOOL = true;
                            bool = true;
                            continue outer;
                        }
                    }
                    break;
                }

                {
                    //Go through unmatched and make placeholders.
                }

                {
                    //Sort everything based on parse 
                }

                if (!bool && j < start) {
                    bool = false;
                } else if (start === 0)
                    bool = true;
                    if (REPEAT)
                segment.addRepeat(seg);
            }

            if (OVERALL_BOOL) {
                segment.repeat();
                //if (ele)
                //    ele.addSub(segment);
                this.last_segment = segment;
            }


            return (!bool && start === 0) ? true : bool;
        }
    }

    Object.assign(OR$1.prototype, OR.prototype);

    class ONE_OF$1 extends JUX$1 {

        default (segment, EXTENDED = false) {
            let seg = this.createSegment();
            this.terms[0].default(seg);
            segment.addSub(seg);
            seg.setList();
            if (!EXTENDED) seg.repeat();
        }

        list(ele, slot) {
            let name = (this.name) ? this.name.replace(/_/g, " ") : this.terms.reduce((r, t) => r += " | " + t.name, "");
            let element = document.createElement("div");
            element.classList.add("option");
            element.innerHTML = name;
            ele.appendChild(element);

            element.addEventListener("click", e => {
                //debugger
                slot.innerHTML = this.value;
                if (slot) {
                    slot.clearSegments();
                    this.default(slot);
                    slot.update();
                } else {
                    let sub = new Segment();
                    sub.setValueHandler(this.value);
                    seg.addSub(sub);
                }
            });

            return 1;
        }

        pi(lx, ele, lister = this, start = this.start, end = this.end) {
            //List
            let segment = this.createSegment();

            //Add new
            let bool = false;

            let j = 0;

            //Parse Input
            for (; j < end && !lx.END; j++) {
                const REPEAT = j > 0;

                let seg = segment;
                
                if(REPEAT){
                    seg = new Segment;
                    seg.prod = this;
                }

                bool = false;

                for (let i = 0, l = this.terms.length; i < l; i++) {
                    bool = this.terms[i].parseInput(lx, seg);
                    if (bool) break;
                }

                if (!bool) {
                    if (j < start) {
                        bool = false;
                        break;
                    }
                }
                if (REPEAT)
                    segment.addRepeat(seg);

            }

            this.capParse(segment, ele, bool);

            return  bool;
        }
    }

    Object.assign(ONE_OF$1.prototype, ONE_OF.prototype);

    var ui_productions = /*#__PURE__*/Object.freeze({
        JUX: JUX$1,
        AND: AND$1,
        OR: OR$1,
        ONE_OF: ONE_OF$1,
        LiteralTerm: LiteralTerm$1,
        ValueTerm: ValueTerm$1,
        SymbolTerm: SymbolTerm$1
    });

    function dragstart(e){
        event.dataTransfer.setData('text/plain',null);
        UISelectorPart.dragee = this;
    }

    function dragover(e){
        e.preventDefault();
    }

    class UISelectorPart{

        constructor(name, index){
            this.txt = name;
            this.index = index;
            this.element = document.createElement("span");
            this.element.classList.add("selector");
            this.element.innerHTML = this.txt;
            this.element.setAttribute("draggable", true);
            this.parent = null;
            this.element.addEventListener("dragstart",dragstart.bind(this));
        }

        mount(element, parent){
            this.parent = parent;
            if (element instanceof HTMLElement)
                element.appendChild(this.element);
        }

        unmount(){
            this.parent = null;
            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        compare(other_part){
            return other_part.txt === this.txt
        }

        toString(){
            return this.txt;
        }

    };


    function drop(e){
        if(UISelectorPart.dragee){
            const part = UISelectorPart.dragee;
            const parent = part.parent;

            loop:
            while(parent != this){

                //Ignore if part is already present in the selector area
                for(let i = 0; i < this.parts.length; i++)
                    if(this.parts[i].compare(part)) break loop;

                part.unmount();
                let d = parent.remove(part);
                this.add(part, ...d);
                part.mount(this.element, this);
                break;
            }
        }
        UISelectorPart.dragee = null;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }

    class UISelector {
        constructor(selector) {
            this.selector = selector;
            this.parts = [];
            
            selector.v.forEach((e, i) => {
                this.parts.push(new UISelectorPart(e, i));
            });
            
            this.text = selector.v.join();
        }

        update() {
            this.parent.update();
        }

        mount(parent) {
            this.element = parent.selector_space;
            this.element.ondrop = drop.bind(this);
            this.element.ondragover = dragover;
            
            this.parent = parent;

            this.parts.forEach(e=>e.mount(this.element, this));
        }

        unmount() {
            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        remove(part){
            let index = part.index;
            this.parts.splice(index,1);
            this.parts.forEach((e,i)=>e.index = i);
            const a = this.selector.a.splice(index,1)[0];
            const v = this.selector.v.splice(index,1)[0];
            this.update();
            return [a,v]
        }

        add(part, a, v){
            this.parts.push(part);
            this.selector.a.push(a);
            this.selector.v.push(v);
            this.parts.forEach((e,i)=>e.index = i);
            this.update();
        }

        rebuild(selector){
            this.parts.forEach(e=>e.unmount(false));
            this.parts.length = 0;
            selector.v.forEach((e,i) => {
                this.parts.push(new UISelectorPart(e, i));
            });
            this.mount(this.parent);

        }
    }

    function createCache(cacher){
        let cache = null;
        const destroy = cacher.prototype.destroy;
        const init = cacher.prototype.init;

        cacher.prototype.destroy = function(...args){

            if(destroy)
                destroy.call(this, ...args);

            this.next_cached = cache;
            cache = this;
        };

        return function(...args){
                let r;
            if(cache){
                r = cache;
                cache = cache.next_cached;
                r.next_cached = null;
                init.call(r,...args);
            }else{
                r = new cacher(...args);
                r.next_cached = null;
                r.CACHED = true;
            }
            return r;
        };
    };

    const props = Object.assign({}, property_definitions);

    var dragee = null;

    function dragstart$1(e){
        event.dataTransfer.setData('text/plain',null);
        UIProp.dragee = this;
    }

    class UIProp {
        constructor(type,  parent) {
            // Predefine all members of this object.
            this.hash = 0;
            this.type = "";
            this.parent = null;
            this._value = null;
            this.setupElement(type);
            this.init(type, parent);
        }

        init(type,  parent){
            this.type = type;
            this.parent = parent;
        }

        destroy(){
            this.hash = 0;
            this.type = "";
            this.parent = null;
            this._value = null;
            this.type = null;
            this.parent = null;
            this.unmount();
        }

        build(type, value){
            this.element.innerHTML ="";
            this.element.appendChild(this.label);
            let pp = getPropertyParser(type, undefined, props, ui_productions);
            this._value = pp.buildInput(1, whind$1(value));
            this._value.parent = this;
            this._value.mount(this.element);
        }

        update(value) {
            this.parent.update(this.type, value.toString());
        }

        mount(element) {
            if (element instanceof HTMLElement)
                element.appendChild(this.element);
        }

        unmount() {
            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        setupElement(type) {
            this.element = document.createElement("div");
            this.element.setAttribute("draggable", "true");
            this.element.classList.add("prop");
            this.element.addEventListener("dragstart", dragstart$1.bind(this));
            this.label = document.createElement("span");
            this.label.classList.add("prop_label");
            this.label.innerHTML = `${type.replace(/[\-\_]/g, " ")}`;
        }

        get value(){
            return this._value.toString();
        }
    }

    UIProp = createCache(UIProp);

    var UIProp$1 = UIProp;

    const props$1 = Object.assign({}, property_definitions);
    class UIRuleSet {
        constructor(rule_body, parent) {

            this.parent = parent;
            this.hash = 0;
            this.rules = [];
            this.selectors = null;

            this.element = document.createElement("div");
            this.element.classList.add("rule");
            this.selector_space = document.createElement("div");
            this.selector_space.classList.add("rule_selectors");
            this.rule_space = document.createElement("div");
            this.rule_space.classList.add("rule_body");

            this.element.addEventListener("dragover", dragover$1);
            this.element.addEventListener("drop", (e)=>{
                
                let prop = UIProp$1.dragee;
                let parent = prop.parent;
                let value = prop.value;
                let type = prop.type;

                if(parent === this)
                    return;

                this.addProp(type, value);
                parent.removeProp(type);

                //move the dragee's data into this ruleset
            });

            this.element.appendChild(this.selector_space);
            this.element.appendChild(this.rule_space);

            this.build(rule_body);
            this.mount(this.parent.element);

            this.ver = rule_body;
        }

        addData(){

        }

        updateSelectors(obj){
            if(obj.parts.length < 1){
                //remove selector from the rule set.
            }
        }

        addSelector(selector){

            //Add to list of selectors and update UI
            if(!this.selectors){

                this.selectors = new UISelector(selector);

                this.selectors.mount(this);
            }else{
                this.selectors.rebuild(selector);
            }
        }

        mount(element) {
            if (element instanceof HTMLElement)
                element.appendChild(this.element);
        }

        unmount() {
            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        build(rule_body = this.rule_body) {


            this.rule_body = rule_body;

            let i = -1;

            for (let a in rule_body.props) {
                let rule;
                
                //Reuse Existing Rule Bodies
                if(++i < this.rules.length){
                    rule = this.rules[i];
                }else{
                    rule = new UIProp$1(a,  this);
                    this.rules.push(rule);
                }
                rule.build(a, rule_body.toString(0, a));
                rule.mount(this.rule_space);
            }
        }

        rebuild(rule_body){
            if(true || this.ver !== rule_body.ver){
                this.rule_space.innerHTML = "";
                this.rules.length = 0;
                this.build(rule_body);
                this.ver = this.rule_body.ver;
            }
        }

        update(type, value) {

            if(type && value){

                console.log(type, value);

                let lexer = whind$1(value);
                
                const IS_VIRTUAL = {
                    is: false
                };
                
                const parser = getPropertyParser(type, IS_VIRTUAL, property_definitions);
                const rule = this.rule_body;
                if (parser && !IS_VIRTUAL.is) {
                    if (!rule.props) rule.props = {};
                    parser.parse(lexer, rule.props);
                }
            }

            this.parent.update();
        }

        addProp(type, value){
            this.update(type, value);
            //Increment the version of the rule_body
            this.rule_body.ver++;
           
            this.rebuild(this.rule_body);
        }

        removeProp(type){
            const rule = this.rule_body;
            if(rule.props[type]){
                delete rule.props[type];


                //Increment the version of the rule_body
                this.rule_body.ver++;

                this.parent.update();
                this.rebuild(this.rule_body);
            }
        }

        generateHash() {}
    }

    function dragover$1(e){
        e.preventDefault();
    }

    //import { UIValue } from "./ui_value.mjs";

    const props$2 = Object.assign({}, property_definitions);

    class UIMaster {
        constructor(css) {
            css.addObserver(this);
            this.css = css;
            this.rule_sets = [];
            this.selectors = [];
            this.element = document.createElement("div");
            this.element.classList.add("cfw_css");


            this.rule_map = new Map();
        }

        // Builds out the UI elements from collection of rule bodies and associated selector groups. 
        // css - A CandleFW_CSS object. 
        // meta - internal 
        build(css = this.css) {

            //Extract rule bodies and set as keys for the rule_map. 
            //Any existing mapped body that does not have a matching rule should be removed. 
            
            const rule_sets = css.children;

            for(let i= 0; i < rule_sets.length; i++){
                let rule_set = rule_sets[i];

                for(let i = 0; i < rule_set.rules.length; i++){

                    let rule = rule_set.rules[i];

                    if(!this.rule_map.get(rule))
                        this.rule_map.set(rule, new UIRuleSet(rule, this));
                    else {
                        this.rule_map.get(rule).rebuild(rule);
                    }
                }

            
                const selector_array = rule_set._sel_a_;

                for(let i = 0; i < selector_array.length; i++){
                    let selector = selector_array[i];
                    let rule_ref = selector.r;

                    let rule_ui = this.rule_map.get(rule_ref);

                    rule_ui.addSelector(selector);
                }
            }


            this.css = css;

            let children = css.children;

            this.rule_sets = [];
            this.selectors = [];
        }

        updatedCSS(css) {
            if(this.UPDATE_MATCHED) return void (this.UPDATE_MATCHED = false);      
            //this.element.innerHTML = "";
            this.build(css);
            //this.render();
        }

        render() {
            for (let i = 0; i < this.rule_sets.length; i++)
                this.rule_sets.render(this.element);
        }

        mount(element) {
            if (element instanceof HTMLElement)
                element.appendChild(this.element);
        }

        unmount() {
            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);
        }

        update(){
            this.UPDATE_MATCHED = true;
        	this.css.updated();
        }
    }

    //export { CSSRule, CSSSelector };



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
            if (typeof(lex) == "string")
                lex = whind$1(lex);

            if (lex.sl > 0) {

                if (!root && root !== null) {
                    root = this;
                    this.pending_build++;
                }

                return this.fch.parse(lex, this).then(e => {
                    this._setREADY_();
                    this.updated();
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
    const CSSParser = (css_string, root = null) => (root = (!root || !(root instanceof CSSRootNode)) ? new CSSRootNode() : root, root.parse(whind$1(css_string)));

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

    function element_selector (sym, env, lex, st, stack, len){ 
        
    	const 
            FULL = len > 5,
            tag = sym[1],
            attribs = (Array.isArray(sym[2]))  ? sym[2] : [],
            children = (FULL) ? (Array.isArray(sym[2])) ? sym[4] : sym[3] : [];

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

    return wick;

}());
