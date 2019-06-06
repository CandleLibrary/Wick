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
        gt0 = [0,-1,1,-1,126,-1,127,-116,2,4,-20,5,6,9,8,7,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,3,125,-1,27,114,113],
    gt1 = [0,-146,128,-2,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt2 = [0,-146,9,8,132,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt3 = [0,-244,136],
    gt4 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,176,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt5 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,187,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt6 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,188,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt7 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,189,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt8 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,190,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt9 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,191,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt10 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,192,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt11 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,193,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt12 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,194,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt13 = [0,-226,196],
    gt14 = [0,-226,201],
    gt15 = [0,-190,70,185,-14,71,186,-11,202,203,65,66,90,-6,64,-1,180,-6,179,-20,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt16 = [0,-285,75,206],
    gt17 = [0,-273,209,207],
    gt18 = [0,-275,219,217],
    gt19 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,228,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt20 = [0,-226,233],
    gt21 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-17,234,177,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt22 = [0,-176,236],
    gt23 = [0,-184,238,239,-75,241,243,244,-19,240,242,75,74],
    gt24 = [0,-150,248,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt25 = [0,-281,254,-2,255,75,74],
    gt26 = [0,-281,257,-2,255,75,74],
    gt27 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,259,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt28 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,261,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt29 = [0,-155,262],
    gt30 = [0,-292,264],
    gt31 = [0,-293,267,-5,266,-1,270,291],
    gt32 = [0,-208,296,297,-73,295,242,75,74],
    gt33 = [0,-283,300,242,75,74],
    gt34 = [0,-188,302,303,-71,305,243,244,-19,304,242,75,74],
    gt35 = [0,-5,307,-284,306,114,113],
    gt36 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,310,-2,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt37 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,311,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt38 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,312,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt39 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,313,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt40 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-7,314,39,40,41,42,43,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt41 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-8,315,40,41,42,43,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt42 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-9,316,41,42,43,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt43 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-10,317,42,43,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt44 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-11,318,43,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt45 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-12,319,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt46 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-12,320,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt47 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-12,321,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt48 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-12,322,44,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt49 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,323,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt50 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,324,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt51 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,325,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt52 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,326,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt53 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,327,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt54 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-13,328,45,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt55 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-14,329,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt56 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-14,330,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt57 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-14,331,46,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt58 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-15,332,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt59 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-15,333,47,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt60 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-16,334,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt61 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-16,335,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt62 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-16,336,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt63 = [0,-190,70,185,-13,92,71,186,-10,178,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-16,337,48,49,57,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt64 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,338,339,342,341,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt65 = [0,-213,351,-17,345,-1,348,353,357,358,349,-39,359,360,-3,350,-1,182,75,354],
    gt66 = [0,-285,75,362],
    gt67 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,363,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt68 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-1,368,367,364,64,-1,180,-6,179,-3,369,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt69 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,371,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt70 = [0,-285,75,372],
    gt71 = [0,-226,373],
    gt72 = [0,-273,376],
    gt73 = [0,-275,378],
    gt74 = [0,-261,382,243,244,-19,381,242,75,74],
    gt75 = [0,-285,75,383],
    gt76 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,384,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt77 = [0,-190,70,185,-7,35,94,385,-3,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-8,179,-3,386,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt78 = [0,-150,389,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-1,388,25,-3,26,16,-6,70,390,-7,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt79 = [0,-238,393],
    gt80 = [0,-238,395],
    gt81 = [0,-234,402,357,358,-27,397,398,-2,400,-1,401,-6,359,360,-4,403,242,75,354],
    gt82 = [0,-241,405,-19,412,243,244,-2,407,409,-1,410,411,406,-11,403,242,75,74],
    gt83 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,413,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt84 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,415,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt85 = [0,-159,416,418,420,-1,425,-22,417,424,-2,70,185,-7,35,94,-4,92,71,186,-7,32,31,421,423,60,62,65,66,90,61,91,-4,64,-1,180,-10,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt86 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,427,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt87 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,431,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt88 = [0,-179,433,434],
    gt89 = [0,-293,267,-5,266],
    gt90 = [0,-295,437,440,441],
    gt91 = [0,-295,445,440,441],
    gt92 = [0,-295,448,440,441],
    gt93 = [0,-295,450,440,441],
    gt94 = [0,-302,453],
    gt95 = [0,-295,454,440,441],
    gt96 = [0,-208,455,297],
    gt97 = [0,-210,457,459,460,461,-20,464,357,358,-40,359,360,-6,75,465],
    gt98 = [0,-190,70,185,-13,92,71,186,-10,466,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-20,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt99 = [0,-193,468,471,470,473,-64,412,243,244,-5,474,411,472,-11,403,242,75,74],
    gt100 = [0,-238,477],
    gt101 = [0,-238,478],
    gt102 = [0,-241,480],
    gt103 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-2,485,484,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt104 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,487,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt105 = [0,-238,491],
    gt106 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,492,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt107 = [0,-234,495,357,358,-40,359,360,-6,75,465],
    gt108 = [0,-234,496,357,358,-40,359,360,-6,75,465],
    gt109 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,497,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt110 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,503,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt111 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-6,510,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt112 = [0,-185,512,-75,241,243,244,-19,240,242,75,74],
    gt113 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,513,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt114 = [0,-283,517,242,75,74],
    gt115 = [0,-238,519],
    gt116 = [0,-261,412,243,244,-5,522,411,520,-11,403,242,75,74],
    gt117 = [0,-261,527,243,244,-19,526,242,75,74],
    gt118 = [0,-238,528],
    gt119 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,533,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt120 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,536,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt121 = [0,-164,540,-19,539,239,-75,542,243,244,-19,541,242,75,74],
    gt122 = [0,-164,543,-23,302,303,-71,545,243,244,-19,544,242,75,74],
    gt123 = [0,-161,546,-1,549,-23,550,-2,70,185,-13,92,71,186,-10,547,60,62,65,66,90,61,91,-4,64,-1,180,-27,181,-11,69,-4,80,81,79,78,-1,68,-1,182,75,74],
    gt124 = [0,-180,553],
    gt125 = [0,-155,555],
    gt126 = [0,-296,558,441],
    gt127 = [0,-10,564,566,565,-278,562,560,-1,559,-5,561,563,291],
    gt128 = [0,-13,577,579,583,580,578,586,584,-2,585,-5,581,-1,592,-5,593,-10,591,-43,588,-4,589],
    gt129 = [0,-144,595,6,9,8,7,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt130 = [0,-210,599,459,460,461,-20,464,357,358,-40,359,360,-6,75,465],
    gt131 = [0,-212,602,461,-20,464,357,358,-40,359,360,-6,75,465],
    gt132 = [0,-213,603,-20,464,357,358,-40,359,360,-6,75,465],
    gt133 = [0,-193,604,471,470,473,-64,412,243,244,-5,474,411,472,-11,403,242,75,74],
    gt134 = [0,-189,609,-71,305,243,244,-19,304,242,75,74],
    gt135 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,610,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt136 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-1,614,613,612,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt137 = [0,-213,351,-19,616,353,357,358,349,-39,359,360,-3,350,-1,182,75,354],
    gt138 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,617,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt139 = [0,-192,618,619,471,470,473,-64,412,243,244,-5,474,411,472,-11,403,242,75,74],
    gt140 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-1,624,-2,64,-1,180,-6,179,-3,369,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt141 = [0,-261,626,243,244,-19,625,242,75,74],
    gt142 = [0,-234,402,357,358,-27,628,-3,630,-1,401,-6,359,360,-4,403,242,75,354],
    gt143 = [0,-261,412,243,244,-5,631,411,-12,403,242,75,74],
    gt144 = [0,-241,634,-19,412,243,244,-3,636,-1,410,411,635,-11,403,242,75,74],
    gt145 = [0,-150,637,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt146 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,638,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt147 = [0,-150,639,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt148 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,640,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt149 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,643,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt150 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,645,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt151 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,647,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt152 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,649,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt153 = [0,-164,651,-96,653,243,244,-19,652,242,75,74],
    gt154 = [0,-164,543,-96,653,243,244,-19,652,242,75,74],
    gt155 = [0,-171,654],
    gt156 = [0,-150,656,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt157 = [0,-181,657,-79,659,243,244,-19,658,242,75,74],
    gt158 = [0,-10,564,566,565,-278,562,560,-1,660,-5,561,563,291],
    gt159 = [0,-10,564,566,565,-279,664,-7,663,563,291],
    gt160 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,665,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt161 = [0,-10,669,566,565,-285,666,-4,667],
    gt162 = [0,-293,676],
    gt163 = [0,-13,677,579,583,580,578,586,584,-2,585,-5,581,-1,592,-5,593,-10,591,-43,588,-4,589],
    gt164 = [0,-15,583,679,-1,586,584,-2,585,-5,680,-1,592,-5,593,-10,591,-43,588,-4,589],
    gt165 = [0,-15,681,-2,586,584,-2,585,-5,682,-1,592,-5,593,-10,591,-43,588,-4,589],
    gt166 = [0,-22,692,-5,682,-1,592,-5,593,-10,591,-64,693,691,-2,690,-1,694],
    gt167 = [0,-89,697,696,-5,699,698],
    gt168 = [0,-92,705,-1,723,706,-2,704,712,709,708,714,715,716,-1,717,-3,718,724],
    gt169 = [0,-144,728,6,9,8,7,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt170 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,737,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt171 = [0,-195,740,741,-64,412,243,244,-5,474,411,472,-11,403,242,75,74],
    gt172 = [0,-190,70,185,-7,35,94,-4,92,71,186,-10,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,742,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt173 = [0,-196,746,-17,745,-46,412,243,244,-5,474,411,-12,403,242,75,74],
    gt174 = [0,-261,412,243,244,-5,522,411,751,-11,403,242,75,74],
    gt175 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,756,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt176 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,758,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt177 = [0,-150,761,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt178 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,763,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt179 = [0,-150,766,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt180 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,768,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt181 = [0,-172,770,772,771],
    gt182 = [0,-299,777],
    gt183 = [0,-10,780,566,565,-291,783,782,781,784],
    gt184 = [0,-304,783,782,792,784],
    gt185 = [0,-293,793],
    gt186 = [0,-23,797,798,-60,801,-2,800],
    gt187 = [0,-46,805,-1,808,-1,806,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt188 = [0,-31,821,-56,823],
    gt189 = [0,-41,824,826,828,831,830,-21,829],
    gt190 = [0,-22,692,-5,682,-1,592,-5,593,-10,591,-64,693,691,-2,834,-1,694],
    gt191 = [0,-91,835,-4,589],
    gt192 = [0,-22,838,-5,682,-1,592,-5,593,-10,591,-66,840,839,-2,841],
    gt193 = [0,-89,844,-6,699,698],
    gt194 = [0,-96,845],
    gt195 = [0,-92,846,-1,723,847,-6,714,715,716,-1,717,-3,718,724],
    gt196 = [0,-94,723,849,-6,851,715,716,-1,717,-3,718,724],
    gt197 = [0,-94,853,-16,724],
    gt198 = [0,-99,712,861,860],
    gt199 = [0,-110,864],
    gt200 = [0,-93,866,-16,867],
    gt201 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,873,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt202 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,875,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt203 = [0,-150,882,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt204 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,884,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt205 = [0,-150,887,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt206 = [0,-150,889,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt207 = [0,-150,890,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt208 = [0,-150,891,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt209 = [0,-150,893,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt210 = [0,-150,894,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt211 = [0,-150,895,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt212 = [0,-173,899,897],
    gt213 = [0,-172,900,772],
    gt214 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,902,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt215 = [0,-155,904],
    gt216 = [0,-299,905],
    gt217 = [0,-190,70,185,-7,35,94,-4,92,71,186,-7,32,31,907,36,60,62,65,66,90,61,91,-4,64,-1,180,-6,179,-3,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,-1,68,95,230,75,74],
    gt218 = [0,-304,910,-2,784],
    gt219 = [0,-24,915,-60,801,-2,800],
    gt220 = [0,-26,917,-19,918,-1,808,-1,806,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt221 = [0,-87,920],
    gt222 = [0,-87,922],
    gt223 = [0,-84,923,-3,924],
    gt224 = [0,-79,927],
    gt225 = [0,-49,929],
    gt226 = [0,-54,933,931,-1,935,932],
    gt227 = [0,-60,937,-1,817,-4,818],
    gt228 = [0,-51,810,938,812,-2,813,-2,811,814,939,817,-4,818,942,-6,944,946,943,945,-1,949,-2,948],
    gt229 = [0,-42,953,828,831,830,-21,829],
    gt230 = [0,-37,956,954,958,955],
    gt231 = [0,-41,960,826,828,831,830,-21,829,-50,961],
    gt232 = [0,-112,968,-5,694],
    gt233 = [0,-119,972,970,969],
    gt234 = [0,-94,723,975,-6,851,715,716,-1,717,-3,718,724],
    gt235 = [0,-107,980],
    gt236 = [0,-109,986],
    gt237 = [0,-110,988],
    gt238 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,992,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt239 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,996,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt240 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,997,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt241 = [0,-150,1000,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt242 = [0,-150,1001,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt243 = [0,-150,1002,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt244 = [0,-150,1003,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt245 = [0,-150,1004,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt246 = [0,-173,1005],
    gt247 = [0,-173,899],
    gt248 = [0,-146,9,8,1009,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt249 = [0,-26,1013,-19,1014,-1,808,-1,806,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt250 = [0,-46,1015,-1,808,-1,806,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt251 = [0,-18,586,1022,1021,1020,-69,588,-4,589],
    gt252 = [0,-48,808,-1,1023,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt253 = [0,-49,1024],
    gt254 = [0,-51,1025,-1,812,-2,813,-3,1026,-1,817,-4,818],
    gt255 = [0,-54,1027],
    gt256 = [0,-57,1028],
    gt257 = [0,-60,1029,-1,817,-4,818],
    gt258 = [0,-60,1030,-1,817,-4,818],
    gt259 = [0,-65,1035,1033],
    gt260 = [0,-69,1039],
    gt261 = [0,-70,1044,1045,-1,1046],
    gt262 = [0,-82,1051],
    gt263 = [0,-63,1058,1056],
    gt264 = [0,-29,1061,-2,1063,-1,1062,1064,-45,1067],
    gt265 = [0,-18,586,1022,1021,1069,-69,588,-4,589],
    gt266 = [0,-37,1070],
    gt267 = [0,-39,1071],
    gt268 = [0,-42,1072,828,831,830,-21,829],
    gt269 = [0,-42,1073,828,831,830,-21,829],
    gt270 = [0,-91,1076,-4,589],
    gt271 = [0,-114,1078,-3,841],
    gt272 = [0,-117,1079,-1,972,970,1080],
    gt273 = [0,-119,1082],
    gt274 = [0,-119,972,970,1083],
    gt275 = [0,-105,1085],
    gt276 = [0,-91,1089,-4,589],
    gt277 = [0,-146,9,8,511,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-5,1094,739,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt278 = [0,-150,1095,-2,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-6,70,-8,35,94,-4,92,71,-8,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt279 = [0,-146,9,8,1097,10,11,12,117,19,13,28,17,14,18,-3,100,-2,20,21,22,24,23,101,-4,15,-2,25,-3,26,16,-2,118,122,-2,70,120,-7,35,94,-4,92,71,116,-7,32,31,30,36,60,62,65,66,90,61,91,-4,64,-12,33,-1,34,37,38,39,40,41,42,43,44,45,46,47,48,49,57,72,-11,69,-4,80,81,79,78,96,68,95,73,75,74,-3,129,114,113],
    gt280 = [0,-46,1098,-1,808,-1,806,810,807,812,-2,813,-2,811,814,-1,817,-4,818,-11,809],
    gt281 = [0,-25,1099,-15,1100,826,828,831,830,-21,829,-50,1101],
    gt282 = [0,-18,586,1104,-71,588,-4,589],
    gt283 = [0,-54,933,931],
    gt284 = [0,-65,1106],
    gt285 = [0,-76,1107,-1,1108,-1,949,-2,948],
    gt286 = [0,-76,1110,-1,1108,-1,949,-2,948],
    gt287 = [0,-78,1112],
    gt288 = [0,-63,1118],
    gt289 = [0,-32,1063,-1,1120,1064,-45,1067],
    gt290 = [0,-119,972,970,1080],
    gt291 = [0,-108,1128],
    gt292 = [0,-72,1135],
    gt293 = [0,-74,1137],
    gt294 = [0,-22,692,-5,682,-1,592,-5,593,-10,591,-64,693,691,-2,1140,-1,694],
    gt295 = [0,-35,1141,-45,1067],
    gt296 = [0,-76,1143,-1,1108,-1,949,-2,948],
    gt297 = [0,-76,1145,-1,1108,-1,949,-2,948],
    gt298 = [0,-22,838,-5,682,-1,592,-2,1146,-2,593,-10,591,-66,840,839,-2,841],

        // State action lookup maps
        sm0=[0,1,2,3,-1,0,-4,0,-4,4,5,-13,6,-3,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm1=[0,44,-3,0,-4,0],
    sm2=[0,45,-3,0,-4,0],
    sm3=[0,46,-3,0,-4,0],
    sm4=[0,47,-3,0,-4,0],
    sm5=[0,48,-3,0,-4,0,-13,48],
    sm6=[0,49,-3,0,-4,0,-13,49],
    sm7=[0,50,2,3,-1,0,-4,0,-4,4,51,-7,50,-5,6,50,-2,7,-26,8,9,-18,50,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,50,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm8=[0,52,52,52,-1,0,-4,0,-4,52,52,-7,52,-5,52,52,-2,52,-26,52,52,-6,52,-11,52,52,52,52,-1,52,-1,52,52,52,52,52,-1,52,52,52,52,52,52,52,52,-2,52,52,-5,52,52,-2,52,-23,52,-1,52,52,52,52,52,52,-4,52,52,52,52,52,52],
    sm9=[0,53,53,53,-1,0,-4,0,-4,53,53,-7,53,-5,53,53,-2,53,-26,53,53,-6,53,-11,53,53,53,53,-1,53,-1,53,53,53,53,53,-1,53,53,53,53,53,53,53,53,-2,53,53,-5,53,53,-2,53,-23,53,-1,53,53,53,53,53,53,-4,53,53,53,53,53,53],
    sm10=[0,54,54,54,-1,0,-4,0,-4,54,54,-7,54,-5,54,54,-2,54,-26,54,54,-6,54,-11,54,54,54,54,-1,54,-1,54,54,54,54,54,-1,54,54,54,54,54,54,54,54,-2,54,54,-5,54,54,-2,54,-23,54,-1,54,54,54,54,54,54,-4,54,54,54,54,54,54],
    sm11=[0,55,55,55,-1,0,-4,0,-4,55,55,-7,55,-5,55,55,-2,55,-26,55,55,-6,55,-11,55,55,55,55,-1,55,55,55,55,55,55,55,-1,55,55,55,55,55,55,55,55,-2,55,55,-5,55,55,-2,55,-23,55,-1,55,55,55,55,55,55,-4,55,55,55,55,55,55],
    sm12=[0,56,-3,0,-4,0,-4,57],
    sm13=[0,58,58,58,-1,0,-4,0,-4,58,58,-7,58,-5,58,58,-2,58,-26,58,58,-6,58,-11,58,58,58,58,-1,58,58,58,58,58,58,58,-1,58,58,58,58,58,58,58,58,-2,58,58,-5,58,58,-2,58,-23,58,-1,58,58,58,58,58,58,-4,58,58,58,58,58,58],
    sm14=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,-3,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm15=[0,-4,0,-4,0,-4,59],
    sm16=[0,-4,0,-4,0,-4,60,-11,60,60,61,-5,60,-34,60,-7,60],
    sm17=[0,-4,0,-4,0,-4,62,-11,62,62,62,-5,62,-34,62,-7,62],
    sm18=[0,-4,0,-4,0,-4,63,-11,63,63,63,-5,63,-34,63,-7,63],
    sm19=[0,-4,0,-4,0,-4,64,-11,64,64,64,-1,64,-3,64,-34,64,-7,64],
    sm20=[0,-4,0,-4,0,-4,65,65,-1,65,65,-7,65,65,65,-1,65,-3,65,-14,65,66,-1,65,-1,65,-5,65,-1,65,65,65,-4,65,67,-1,68,-4,65,-37,69,70,71,72,73,74,75,76,77,78,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,-4,79,80],
    sm21=[0,-4,0,-4,0,-4,81,-11,81,81,81,-1,81,-3,81,-27,82,-6,81,-7,81,-47,83],
    sm22=[0,-4,0,-4,0,-4,84,-11,84,84,84,-1,84,-3,84,-27,84,-6,84,-7,84,-47,84,85],
    sm23=[0,-4,0,-4,0,-4,86,-11,86,86,86,-1,86,-3,86,-27,86,-1,87,-4,86,-7,86,-47,86,86],
    sm24=[0,-4,0,-4,0,-4,88,-11,88,88,88,-1,88,-3,88,-27,88,-1,88,-4,88,-7,88,-47,88,88,89],
    sm25=[0,-4,0,-4,0,-4,90,-11,90,90,90,-1,90,-3,90,-27,90,-1,90,-4,90,-7,90,-47,90,90,90,91],
    sm26=[0,-4,0,-4,0,-4,92,-11,92,92,92,-1,92,-3,92,-27,92,-1,92,-4,92,-7,92,-47,92,92,92,92,93,94,95,96],
    sm27=[0,-4,0,-4,0,-4,97,98,-2,99,-7,97,97,97,-1,97,-3,97,-14,100,-4,101,-7,97,-1,97,-4,97,-7,97,-47,97,97,97,97,97,97,97,97,102,103],
    sm28=[0,-4,0,-4,0,-4,104,104,-2,104,-7,104,104,104,-1,104,-3,104,-14,104,-4,104,-7,104,-1,104,-4,104,-7,104,-47,104,104,104,104,104,104,104,104,104,104,105,106,107],
    sm29=[0,-4,0,-4,0,-4,108,108,-2,108,-7,108,108,108,-1,108,-3,108,-14,108,-4,108,-5,109,-1,108,-1,108,-4,108,-7,108,-47,108,108,108,108,108,108,108,108,108,108,108,108,108,110],
    sm30=[0,-4,0,-4,0,-4,111,111,-1,112,111,-7,111,111,111,-1,111,-3,111,-14,111,-2,113,-1,111,-5,111,-1,111,114,111,-4,111,-7,111,-47,111,111,111,111,111,111,111,111,111,111,111,111,111,111],
    sm31=[0,-4,0,-4,0,-4,115,115,-1,115,115,-7,115,115,115,-1,115,-3,115,-14,115,-2,115,-1,115,-5,115,-1,115,115,115,-4,115,-7,115,-47,115,115,115,115,115,115,115,115,115,115,115,115,115,115],
    sm32=[0,-4,0,-4,0,-4,116,116,-1,116,116,-7,116,116,116,-1,116,-3,116,-14,116,-2,116,-1,116,-5,116,-1,116,116,116,-4,116,-7,116,-47,116,116,116,116,116,116,116,116,116,116,116,116,116,116],
    sm33=[0,-4,0,-4,0,-4,117,117,-1,117,117,-7,117,117,117,-1,117,-3,117,-14,117,-2,117,-1,117,-5,117,-1,117,117,117,-4,117,-7,117,-47,117,117,117,117,117,117,117,117,117,117,117,117,117,117,118],
    sm34=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm35=[0,-4,0,-4,0,-4,117,117,-1,117,117,-7,117,117,117,-1,117,-3,117,-14,117,-2,117,-1,117,-5,117,-1,117,117,117,-4,117,-7,117,-47,117,117,117,117,117,117,117,117,117,117,117,117,117,117,117],
    sm36=[0,-4,0,-4,0,-4,121,121,-1,121,121,-7,121,121,121,121,121,-3,121,-14,121,121,-1,121,-1,121,-5,121,-1,121,121,121,-4,121,121,-1,121,-4,121,-14,121,-22,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,-4,121,121],
    sm37=[0,-4,0,-4,0,-4,121,121,-1,121,121,-7,121,121,121,121,121,-2,122,121,-14,121,121,-1,121,-1,121,-5,121,-1,121,121,121,-1,123,-1,124,121,121,-1,121,-4,121,-14,121,-22,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,-4,121,121],
    sm38=[0,-4,0,-4,0,-4,125,125,-1,125,125,-7,125,125,125,125,125,-2,122,125,-14,125,125,-1,125,-1,125,-5,125,-1,125,125,125,-1,126,-1,127,125,125,-1,125,-4,125,-14,125,-22,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,-4,125,125],
    sm39=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,-32,128,-1,120,-12,10,11,-27,28,129,-2,30,-35,38,39,40,41,42,43],
    sm40=[0,-4,0,-4,0,-4,130,130,-1,130,130,-7,130,130,130,130,130,-2,130,130,-14,130,130,-1,130,-1,130,-5,130,-1,130,130,130,-1,130,-1,130,130,130,-1,130,-4,130,-14,130,-22,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,-4,130,130],
    sm41=[0,-4,0,-4,0,-4,131,131,-1,131,131,-7,131,131,131,131,131,-2,131,131,-14,131,131,-1,131,-1,131,-5,131,-1,131,131,131,-1,131,-1,131,131,131,-1,131,-4,131,-14,131,-22,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,-4,131,131],
    sm42=[0,-4,0,-4,0,-4,132,132,-1,132,132,-7,132,132,132,132,132,-2,132,132,-14,132,132,-1,132,-1,132,-5,132,-1,132,132,132,-1,132,-1,132,132,132,-1,132,-4,132,-14,132,-22,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,-4,132,132],
    sm43=[0,-4,0,-4,0,-4,132,132,-1,132,132,-7,132,132,132,-1,132,-2,132,132,-14,132,132,-1,132,-1,132,-5,132,-1,132,132,132,-1,132,-1,132,132,132,-1,132,-4,132,-14,132,-12,133,-9,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,132,-4,132,132],
    sm44=[0,-4,0,-4,0,-4,134,134,-1,134,134,-9,134,-4,134,-15,134,134,-1,134,-1,134,-5,134,-1,134,134,134,-1,134,-1,134,-1,134,-1,134,-4,135,-27,136,-9,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-4,134,134],
    sm45=[0,-4,0,-4,0,-4,137,137,-1,137,137,-7,137,137,137,137,137,-2,137,137,-14,137,137,-1,137,-1,137,-5,137,-1,137,137,137,-1,137,-1,137,137,137,-1,137,-4,137,-14,137,-12,137,137,-8,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,137,-4,137,137],
    sm46=[0,-4,0,-4,0,-4,138,138,-1,138,138,-7,138,138,138,138,138,-2,138,138,-14,138,138,-1,138,-1,138,-5,138,-1,138,138,138,-1,138,-1,138,138,138,-1,138,-4,138,-14,138,-12,138,138,-8,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,-4,138,138],
    sm47=[0,-4,0,-4,0,-4,139,139,-1,139,139,-7,139,139,139,139,139,-2,139,139,-14,139,139,-1,139,-1,139,-5,139,-1,139,139,139,-1,139,-1,139,139,139,-1,139,-4,139,-14,139,-12,139,139,-8,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,139,-4,139,139],
    sm48=[0,-2,3,-1,0,-4,0,-4,140,140,-1,140,140,-7,140,140,140,140,140,-2,140,140,-14,140,140,-1,140,-1,140,-5,140,-1,140,140,140,-1,140,-1,140,140,140,-1,140,-4,140,-14,140,-12,140,140,-8,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,-4,140,140,-9,43],
    sm49=[0,-4,0,-4,0,-4,141,141,-1,141,141,-7,141,141,141,141,141,-2,141,141,-14,141,141,-1,141,-1,141,-5,141,-1,141,141,141,-1,141,-1,141,141,141,-1,141,-4,141,-14,141,-22,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,141,-4,141,141],
    sm50=[0,-4,0,-4,0,-4,142,142,-1,142,142,-7,142,142,142,142,142,-2,142,142,-14,142,142,-1,142,-1,142,-5,142,-1,142,142,142,-1,142,-1,142,142,142,-1,142,-4,142,-14,142,-22,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,142,-4,142,142],
    sm51=[0,-4,0,-4,0,-4,143,143,-1,143,143,-7,143,143,143,143,143,-2,143,143,-14,143,143,-1,143,-1,143,-5,143,-1,143,143,143,-1,143,-1,143,143,143,-1,143,-4,143,-14,143,-22,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,143,-4,143,143],
    sm52=[0,-1,144,145,-1,146,147,148,149,150,0,-140,151],
    sm53=[0,-1,152,153,-1,154,155,156,157,158,0,-141,159],
    sm54=[0,-4,0,-4,0,-4,160,160,-1,160,160,-7,160,160,160,160,160,-2,160,160,-14,160,160,-1,160,-1,160,-5,160,-1,160,160,160,-1,160,-1,160,160,160,-1,160,-4,160,-14,160,-22,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,-4,160,160],
    sm55=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,161,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-1,162,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm56=[0,-4,0,-4,0,-23,122,-32,163,-1,164],
    sm57=[0,-4,0,-4,0,-4,165,165,-1,165,165,-7,165,165,165,165,165,-2,165,165,-14,165,165,-1,165,-1,165,-5,165,-1,165,165,165,-1,165,-1,165,165,165,-1,165,-4,165,-14,165,-22,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,-4,165,165],
    sm58=[0,-4,0,-4,0,-4,166,166,-1,166,166,-7,166,166,166,166,166,-2,166,166,-14,166,166,-1,166,-1,166,-5,166,-1,166,166,166,-1,166,-1,166,166,166,-1,166,-4,166,-14,166,-22,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,-4,166,166],
    sm59=[0,-4,0,-4,0,-95,167],
    sm60=[0,-4,0,-4,0,-95,133],
    sm61=[0,-4,0,-4,0,-67,168],
    sm62=[0,-2,3,-1,0,-4,0,-19,169,-38,170,-86,43],
    sm63=[0,171,171,171,-1,0,-4,0,-4,171,171,-7,171,-5,171,171,-2,171,-26,171,171,-6,171,-11,171,171,171,171,-1,171,171,171,171,171,171,171,-1,171,171,171,171,171,171,171,171,-2,171,171,-5,171,171,-2,171,-23,171,-1,171,171,171,171,171,171,-4,171,171,171,171,171,171],
    sm64=[0,-4,0,-4,0,-23,172],
    sm65=[0,173,173,173,-1,0,-4,0,-4,173,173,-7,173,-5,173,173,-2,173,-26,173,173,-6,173,-11,173,173,173,173,-1,173,173,173,173,173,173,173,-1,173,173,173,173,173,173,173,173,-2,173,173,-5,173,173,-2,173,-23,173,-1,173,173,173,173,173,173,-4,173,173,173,173,173,173],
    sm66=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,-3,7,-26,8,9,-23,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-6,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm67=[0,-4,0,-4,0,-23,174],
    sm68=[0,-4,0,-4,0,-23,175,-57,176],
    sm69=[0,-4,0,-4,0,-23,177],
    sm70=[0,-2,3,-1,0,-4,0,-4,178,-140,43],
    sm71=[0,-2,3,-1,0,-4,0,-4,179,-140,43],
    sm72=[0,-1,2,3,-1,0,-4,0,-4,180,-14,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm73=[0,-4,0,-4,0,-23,181],
    sm74=[0,-4,0,-4,0,-19,6],
    sm75=[0,-4,0,-4,0,-4,182],
    sm76=[0,183,-3,0,-4,0,-4,183],
    sm77=[0,-4,0,-4,0,-5,184],
    sm78=[0,-2,185,-1,186,-4,187,-3,188,-2,189,-3,190,191,192,-1,193,-131,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209],
    sm79=[0,210,210,210,-1,0,-4,0,-4,210,210,-7,210,-5,210,210,-2,210,-26,210,210,-6,210,-11,210,210,210,210,-1,210,-1,210,210,210,210,210,-1,210,210,210,210,210,210,210,210,-2,210,210,-5,210,210,-2,210,-23,210,-1,210,210,210,210,210,210,-4,210,210,210,210,210,210],
    sm80=[0,-2,3,-1,0,-4,0,-19,211,-76,212,-48,43],
    sm81=[0,213,213,213,-1,0,-4,0,-4,213,213,-7,213,-5,213,213,-2,213,-26,213,213,-6,213,-11,213,213,213,213,-1,213,-1,213,213,213,213,213,-1,213,213,213,213,213,213,213,213,-2,213,213,-5,213,213,-2,213,-23,213,-1,213,213,213,213,213,213,-4,213,213,213,213,213,213],
    sm82=[0,-2,3,-1,0,-4,0,-23,214,-121,43],
    sm83=[0,-2,215,-1,0,-4,0,-19,215,-38,215,-86,215],
    sm84=[0,-2,216,-1,0,-4,0,-19,216,-38,216,-86,216],
    sm85=[0,217,-3,0,-4,0],
    sm86=[0,-4,0,-4,0,-5,5],
    sm87=[0,-4,0,-4,0,-5,218],
    sm88=[0,219,219,219,-1,0,-4,0,-4,219,219,-7,219,-5,219,219,-2,219,-26,219,219,-6,219,-11,219,219,219,219,-1,219,-1,219,219,219,219,219,-1,219,219,219,219,219,219,219,219,-2,219,219,-5,219,219,-2,219,-23,219,-1,219,219,219,219,219,219,-4,219,219,219,219,219,219],
    sm89=[0,-4,0,-4,0,-4,57],
    sm90=[0,-2,185,-1,186,-4,187,-3,188,-2,220,-3,190,191,192,-1,193,-131,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209],
    sm91=[0,221,221,221,-1,0,-4,0,-4,221,221,-7,221,-5,221,221,-2,221,-26,221,221,-6,221,-11,221,221,221,221,-1,221,221,221,221,221,221,221,-1,221,221,221,221,221,221,221,221,-2,221,221,-5,221,221,-2,221,-23,221,-1,221,221,221,221,221,221,-4,221,221,221,221,221,221],
    sm92=[0,-4,0,-4,0,-20,222],
    sm93=[0,223,223,223,-1,0,-4,0,-4,223,223,-7,223,-5,223,223,-2,223,-26,223,223,-6,223,-11,223,223,223,223,-1,223,223,223,223,223,223,223,-1,223,223,223,223,223,223,223,223,-2,223,223,-5,223,223,-2,223,-23,223,-1,223,223,223,223,223,223,-4,223,223,223,223,223,223],
    sm94=[0,-4,0,-4,0,-4,224,224,-1,224,224,-7,224,224,224,-1,224,-3,224,-14,224,-2,224,-1,224,-5,224,-1,224,224,224,-4,224,-7,224,-47,224,224,224,224,224,224,224,224,224,224,224,224,224,224,224],
    sm95=[0,-4,0,-4,0,-4,225,225,-1,225,225,-7,225,225,225,-1,225,-3,225,-14,225,-2,225,-1,225,-5,225,-1,225,225,225,-4,225,-7,225,-47,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225],
    sm96=[0,-1,226,226,-1,0,-4,0,-19,226,-3,226,-26,226,226,-6,226,-12,226,226,-8,226,-18,226,226,-2,226,-23,226,-1,226,226,226,226,226,226,-4,226,226,226,226,226,226],
    sm97=[0,-4,0,-4,0,-4,227,227,-1,227,227,-7,227,227,227,-1,227,-3,227,-14,227,-2,227,-1,227,-5,227,-1,227,227,227,-4,227,-7,227,-47,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227],
    sm98=[0,-4,0,-4,0,-4,65,65,-1,65,65,-7,65,65,65,-1,65,-3,65,-14,65,-2,65,-1,65,-5,65,-1,65,65,65,-4,65,-7,65,-47,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,-4,79,80],
    sm99=[0,-4,0,-4,0,-4,228,228,-1,228,228,-7,228,228,228,228,228,-2,228,228,-14,228,228,-1,228,-1,228,-5,228,-1,228,228,228,-1,228,-1,228,228,228,-1,228,-4,228,-14,228,-22,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,-4,228,228],
    sm100=[0,-4,0,-4,0,-4,229,229,-1,229,229,-7,229,229,229,229,229,-2,229,229,-14,229,229,-1,229,-1,229,-5,229,-1,229,229,229,-1,229,-1,229,229,229,-1,229,-4,229,-14,229,-22,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,229,-4,229,229],
    sm101=[0,-4,0,-4,0,-4,134,134,-1,134,134,-7,134,134,134,134,134,-2,134,134,-14,134,134,-1,134,-1,134,-5,134,-1,134,134,134,-1,134,-1,134,134,134,-1,134,-4,134,-14,134,-22,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-4,134,134],
    sm102=[0,-1,2,3,-1,0,-4,0,-18,230,119,-3,7,-26,8,9,-6,120,231,-11,10,11,-8,18,-18,28,29,-1,232,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm103=[0,-1,2,3,-1,0,-4,0,-18,233,-1,234,-37,235,-39,236,237,-3,238,-36,38,39,-3,43],
    sm104=[0,-4,0,-4,0,-4,239,239,-1,239,239,-7,239,239,239,239,239,-2,239,239,-14,239,239,-1,239,-1,239,-5,239,-1,239,239,239,-1,239,-1,239,239,239,-1,239,-4,239,-14,239,-22,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,239,-4,239,239],
    sm105=[0,-4,0,-4,0,-4,240,240,-1,240,240,-7,240,240,240,240,240,-2,240,240,-14,240,240,-1,240,-1,240,-5,240,-1,240,240,240,-1,240,-1,240,240,240,-1,240,-4,240,-14,240,-22,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,240,-4,240,240],
    sm106=[0,-4,0,-4,0,-4,241,241,-1,241,241,-7,241,241,241,-1,241,-3,241,-14,241,-2,241,-1,241,-5,241,-1,241,241,241,-4,241,-7,241,-47,241,241,241,241,241,241,241,241,241,241,241,241,241,241,241],
    sm107=[0,-4,0,-4,0,-4,242,242,-1,242,242,-7,242,242,242,-1,242,-3,242,-14,242,-2,242,-1,242,-5,242,-1,242,242,242,-4,242,-7,242,-47,242,242,242,242,242,242,242,242,242,242,242,242,242,242,242],
    sm108=[0,-4,0,-4,0,-4,243,243,-1,243,243,-7,243,243,243,-1,243,-3,243,-14,243,-2,243,-1,243,-5,243,-1,243,243,243,-4,243,-7,243,-47,243,243,243,243,243,243,243,243,243,243,243,243,243,243,243],
    sm109=[0,-4,0,-4,0,-4,244,244,-1,244,244,-7,244,244,244,-1,244,-3,244,-14,244,-2,244,-1,244,-5,244,-1,244,244,244,-4,244,-7,244,-47,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244],
    sm110=[0,-4,0,-4,0,-4,245,245,-1,245,245,-7,245,245,245,-1,245,-3,245,-14,245,-2,245,-1,245,-5,245,-1,245,245,245,-4,245,-7,245,-47,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245],
    sm111=[0,-4,0,-4,0,-4,246,246,-1,246,246,-7,246,246,246,-1,246,-3,246,-14,246,-2,246,-1,246,-5,246,-1,246,246,246,-4,246,-7,246,-47,246,246,246,246,246,246,246,246,246,246,246,246,246,246,246],
    sm112=[0,-4,0,-4,0,-4,247,247,-1,247,247,-7,247,247,247,-1,247,-3,247,-14,247,-2,247,-1,247,-5,247,-1,247,247,247,-4,247,-7,247,-47,247,247,247,247,247,247,247,247,247,247,247,247,247,247,247],
    sm113=[0,-4,0,-4,0,-4,248,248,-1,248,248,-7,248,248,248,-1,248,-3,248,-14,248,-2,248,-1,248,-5,248,-1,248,248,248,-4,248,-7,248,-47,248,248,248,248,248,248,248,248,248,248,248,248,248,248,248],
    sm114=[0,-2,3,-1,0,-4,0,-145,43],
    sm115=[0,-4,0,-4,0,-4,249,249,-1,249,249,-7,249,249,249,249,249,-2,249,249,-14,249,249,-1,249,-1,249,-5,249,-1,249,249,249,-1,249,-1,249,249,249,-1,249,-4,249,-14,249,-22,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,249,-4,249,249],
    sm116=[0,-1,2,3,-1,0,-4,0,-18,250,119,-3,7,251,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-1,252,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm117=[0,-4,0,-4,0,-4,253,253,-1,253,253,-7,253,253,253,253,253,-2,253,253,-14,253,253,-1,253,-1,253,-5,253,-1,253,253,253,-1,253,-1,253,253,253,-1,253,-4,253,-14,253,-22,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,-4,253,253],
    sm118=[0,-4,0,-4,0,-4,254,254,-1,254,254,-7,254,254,254,254,254,-3,254,-14,254,254,-1,254,-1,254,-5,254,-1,254,254,254,-4,254,254,-1,254,-4,254,-14,254,-22,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,254,-4,254,254],
    sm119=[0,-4,0,-4,0,-102,255],
    sm120=[0,-4,0,-4,0,-56,163,-1,164],
    sm121=[0,-4,0,-4,0,-4,256,256,-1,256,256,-7,256,256,256,256,256,-2,256,256,-14,256,256,-1,256,-1,256,-5,256,-1,256,256,256,-1,256,-1,256,256,256,-1,256,-4,256,-14,256,-12,256,256,-8,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,256,-4,256,256],
    sm122=[0,-1,144,145,-1,146,147,148,149,150,0,-140,257],
    sm123=[0,-4,0,-4,0,-4,258,258,-1,258,258,-7,258,258,258,258,258,-2,258,258,-14,258,258,-1,258,-1,258,-5,258,-1,258,258,258,-1,258,-1,258,258,258,-1,258,-4,258,-14,258,-22,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,258,-4,258,258],
    sm124=[0,-1,259,259,-1,259,259,259,259,259,0,-140,259],
    sm125=[0,-1,260,260,-1,260,260,260,260,260,0,-140,260],
    sm126=[0,-1,152,153,-1,154,155,156,157,158,0,-141,261],
    sm127=[0,-1,262,262,-1,262,262,262,262,262,0,-141,262],
    sm128=[0,-1,263,263,-1,263,263,263,263,263,0,-141,263],
    sm129=[0,-4,0,-4,0,-4,264,264,-1,264,264,-7,264,264,264,264,264,-2,264,264,-14,264,264,-1,264,-1,264,-5,264,-1,264,264,264,-1,264,-1,264,264,264,-1,264,-4,264,-14,264,-12,264,-9,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,264,-4,264,264],
    sm130=[0,-4,0,-4,0,-18,265,-5,266],
    sm131=[0,-4,0,-4,0,-4,134,134,-1,134,134,-7,134,134,134,-1,134,-2,134,134,-14,134,134,-1,134,-1,134,-5,134,-1,134,134,134,-1,134,-1,134,134,134,-1,134,-4,134,-14,134,-12,136,-9,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,134,-4,134,134],
    sm132=[0,-4,0,-4,0,-4,267,267,-1,267,267,-7,267,267,267,267,267,-2,267,267,-14,267,267,-1,267,-1,267,-5,267,-1,267,267,267,-1,267,-1,267,267,267,-1,267,-4,267,-14,267,-22,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,267,-4,267,267],
    sm133=[0,-4,0,-4,0,-4,268,268,-1,268,268,-7,268,268,268,-1,268,-3,268,-14,268,-2,268,-1,268,-5,268,-1,268,268,268,-4,268,-7,268,-47,268,268,268,268,268,268,268,268,268,268,268,268,268,268,268],
    sm134=[0,-1,2,3,-1,0,-4,0,-19,269,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm135=[0,270,270,270,-1,0,-4,0,-4,270,270,-7,270,-5,270,270,-2,270,-26,270,270,-6,270,-11,270,270,270,270,-1,270,270,270,270,270,270,270,-1,270,270,270,270,270,270,270,270,-2,270,270,-5,270,270,-2,270,-23,270,-1,270,270,270,270,270,270,-4,270,270,270,270,270,270],
    sm136=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,-3,7,-26,8,9,-19,10,-3,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-6,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm137=[0,-4,0,-4,0,-4,271,-13,272],
    sm138=[0,-4,0,-4,0,-4,273,-13,273],
    sm139=[0,-4,0,-4,0,-4,274,-13,274,-21,275],
    sm140=[0,-4,0,-4,0,-40,275],
    sm141=[0,-4,0,-4,0,-4,136,-13,136,136,136,-2,136,136,-15,136,-3,136,-14,136,-22,136,-13,136],
    sm142=[0,-4,0,-4,0,-18,276,-1,276,-3,276,-15,276,-3,276,-14,276,-22,276],
    sm143=[0,-1,2,3,-1,0,-4,0,-20,277,-37,235,-44,278,-36,38,39,-3,43],
    sm144=[0,-2,3,-1,0,-4,0,-18,230,169,-38,170,279,-43,280,-41,43],
    sm145=[0,-4,0,-4,0,-79,281],
    sm146=[0,-1,2,3,-1,0,-4,0,-4,282,-14,119,-3,7,-26,8,9,-19,10,11,12,-3,283,-3,18,-12,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm147=[0,-4,0,-4,0,-23,284],
    sm148=[0,285,285,285,-1,0,-4,0,-4,285,285,-7,285,-5,285,285,-2,285,-26,285,285,-6,285,-11,285,285,285,285,-1,285,285,285,285,285,285,285,-1,285,285,285,285,285,285,285,285,-2,285,285,-5,285,285,-2,285,-23,285,-1,285,285,285,285,285,285,-4,285,285,285,285,285,285],
    sm149=[0,-4,0,-4,0,-4,286],
    sm150=[0,-4,0,-4,0,-4,135],
    sm151=[0,287,287,287,-1,0,-4,0,-4,287,287,-7,287,-5,287,287,-2,287,-26,287,287,-6,287,-11,287,287,287,287,-1,287,287,287,287,287,287,287,-1,287,287,287,287,287,287,287,287,-2,287,287,-5,287,287,-2,287,-23,287,-1,287,287,287,287,287,287,-4,287,287,287,287,287,287],
    sm152=[0,-4,0,-4,0,-4,288],
    sm153=[0,289,289,289,-1,0,-4,0,-4,289,289,-7,289,-5,289,289,-2,289,-26,289,289,-6,289,-11,289,289,289,289,-1,289,289,289,289,289,289,289,-1,289,289,289,289,289,289,289,289,-2,289,289,-5,289,289,-2,289,-23,289,-1,289,289,289,289,289,289,-4,289,289,289,289,289,289],
    sm154=[0,-4,0,-4,0,-4,290],
    sm155=[0,-4,0,-4,0,-4,291],
    sm156=[0,-4,0,-4,0,-91,292,293],
    sm157=[0,294,294,294,-1,0,-4,0,-4,294,294,-7,294,-5,294,294,-2,294,-26,294,294,-6,294,-11,294,294,294,294,-1,294,294,294,294,294,294,294,-1,294,294,294,294,294,294,294,294,-2,294,294,-5,294,294,-2,294,-23,294,-1,294,294,294,294,294,294,-4,294,294,294,294,294,294],
    sm158=[0,295,-3,0,-4,0,-4,295],
    sm159=[0,-2,185,-1,0,-4,0,-6,220,-3,190,191,192,-1,193,-131,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209],
    sm160=[0,-2,296,-1,0,-4,0,-7,297,298,-131,299,300],
    sm161=[0,-2,296,-1,0,-4,0,-7,301,302,-131,299,300],
    sm162=[0,-2,296,-1,0,-4,0,-8,303,-131,299,300],
    sm163=[0,-2,296,-1,0,-4,0,-8,304,-131,299,300],
    sm164=[0,-4,186,-4,187,-3,188,-4,305],
    sm165=[0,-2,296,-1,0,-4,0,-7,306,306,-131,299,300],
    sm166=[0,-2,307,-1,0,-4,0,-7,307,307,-131,307,307],
    sm167=[0,-2,306,-1,0,-4,0,-7,306,306,-131,306,306],
    sm168=[0,-4,308,-4,308,-3,308,-1,308,-2,308,-4,308,-1,308],
    sm169=[0,-4,309,-4,309,-3,309,-1,309,-2,309,-4,309,-1,309],
    sm170=[0,-4,0,-4,0,-19,211,-76,212],
    sm171=[0,310,310,310,-1,0,-4,0,-4,310,310,-1,310,310,-4,310,-2,310,310,310,310,310,-2,310,310,-14,310,310,-1,310,-1,310,-5,310,310,310,310,310,-1,310,-1,310,310,310,-1,310,-4,310,-2,310,310,310,310,-1,310,-1,310,310,310,310,310,310,310,310,310,310,310,310,310,310,-2,310,310,-5,310,310,-2,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,-4,310,310,310,310,310,310],
    sm172=[0,-4,0,-4,0,-19,311],
    sm173=[0,-1,2,3,-1,0,-4,0,-4,312,-15,313,-37,235,-38,314,236,237,-40,38,39,-3,43],
    sm174=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,-34,120,-12,10,11,-27,28,29,-2,30,-35,38,39,40,41,42,43],
    sm175=[0,-4,0,-4,0,-23,315],
    sm176=[0,-2,3,-1,0,-4,0,-19,169,-4,316,-33,170,-44,280,-41,43],
    sm177=[0,-4,0,-4,0,-4,317,-13,318],
    sm178=[0,-4,0,-4,0,-4,319,-13,319],
    sm179=[0,320,-3,0,-4,0],
    sm180=[0,-4,0,-4,0,-5,321],
    sm181=[0,322,322,322,-1,0,-4,0,-4,322,322,-7,322,-5,322,322,-2,322,-26,322,322,-6,322,-11,322,322,322,322,-1,322,322,322,322,322,322,322,-1,322,322,322,322,322,322,322,322,322,322,322,322,-5,322,322,-2,322,-23,322,-1,322,322,322,322,322,322,-4,322,322,322,322,322,322],
    sm182=[0,-4,0,-4,0,-4,323,-11,323,323,323,-5,323,-34,323,-7,323],
    sm183=[0,-4,0,-4,0,-4,324,-11,324,324,324,-1,324,-3,324,-34,324,-7,324],
    sm184=[0,-4,0,-4,0,-67,325],
    sm185=[0,-4,0,-4,0,-4,326,-11,326,326,326,-1,326,-3,326,-27,326,-6,326,-7,326,-47,326,85],
    sm186=[0,-4,0,-4,0,-4,327,-11,327,327,327,-1,327,-3,327,-27,327,-1,87,-4,327,-7,327,-47,327,327],
    sm187=[0,-4,0,-4,0,-4,328,-11,328,328,328,-1,328,-3,328,-27,328,-1,328,-4,328,-7,328,-47,328,328,89],
    sm188=[0,-4,0,-4,0,-4,329,-11,329,329,329,-1,329,-3,329,-27,329,-1,329,-4,329,-7,329,-47,329,329,329,91],
    sm189=[0,-4,0,-4,0,-4,330,-11,330,330,330,-1,330,-3,330,-27,330,-1,330,-4,330,-7,330,-47,330,330,330,330,93,94,95,96],
    sm190=[0,-4,0,-4,0,-4,331,98,-2,99,-7,331,331,331,-1,331,-3,331,-14,100,-4,101,-7,331,-1,331,-4,331,-7,331,-47,331,331,331,331,331,331,331,331,102,103],
    sm191=[0,-4,0,-4,0,-4,332,332,-2,332,-7,332,332,332,-1,332,-3,332,-14,332,-4,332,-7,332,-1,332,-4,332,-7,332,-47,332,332,332,332,332,332,332,332,332,332,105,106,107],
    sm192=[0,-4,0,-4,0,-4,333,333,-2,333,-7,333,333,333,-1,333,-3,333,-14,333,-4,333,-7,333,-1,333,-4,333,-7,333,-47,333,333,333,333,333,333,333,333,333,333,105,106,107],
    sm193=[0,-4,0,-4,0,-4,334,334,-2,334,-7,334,334,334,-1,334,-3,334,-14,334,-4,334,-7,334,-1,334,-4,334,-7,334,-47,334,334,334,334,334,334,334,334,334,334,105,106,107],
    sm194=[0,-4,0,-4,0,-4,335,335,-2,335,-7,335,335,335,-1,335,-3,335,-14,335,-4,335,-5,109,-1,335,-1,335,-4,335,-7,335,-47,335,335,335,335,335,335,335,335,335,335,335,335,335,110],
    sm195=[0,-4,0,-4,0,-4,336,336,-2,336,-7,336,336,336,-1,336,-3,336,-14,336,-4,336,-5,109,-1,336,-1,336,-4,336,-7,336,-47,336,336,336,336,336,336,336,336,336,336,336,336,336,110],
    sm196=[0,-4,0,-4,0,-4,337,337,-2,337,-7,337,337,337,-1,337,-3,337,-14,337,-4,337,-5,109,-1,337,-1,337,-4,337,-7,337,-47,337,337,337,337,337,337,337,337,337,337,337,337,337,110],
    sm197=[0,-4,0,-4,0,-4,338,338,-1,112,338,-7,338,338,338,-1,338,-3,338,-14,338,-2,113,-1,338,-5,338,-1,338,114,338,-4,338,-7,338,-47,338,338,338,338,338,338,338,338,338,338,338,338,338,338],
    sm198=[0,-4,0,-4,0,-4,339,339,-1,112,339,-7,339,339,339,-1,339,-3,339,-14,339,-2,113,-1,339,-5,339,-1,339,114,339,-4,339,-7,339,-47,339,339,339,339,339,339,339,339,339,339,339,339,339,339],
    sm199=[0,-4,0,-4,0,-4,340,340,-1,340,340,-7,340,340,340,-1,340,-3,340,-14,340,-2,340,-1,340,-5,340,-1,340,340,340,-4,340,-7,340,-47,340,340,340,340,340,340,340,340,340,340,340,340,340,340],
    sm200=[0,-4,0,-4,0,-4,341,341,-1,341,341,-7,341,341,341,-1,341,-3,341,-14,341,-2,341,-1,341,-5,341,-1,341,341,341,-4,341,-7,341,-47,341,341,341,341,341,341,341,341,341,341,341,341,341,341],
    sm201=[0,-4,0,-4,0,-4,342,342,-1,342,342,-7,342,342,342,-1,342,-3,342,-14,342,-2,342,-1,342,-5,342,-1,342,342,342,-4,342,-7,342,-47,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
    sm202=[0,-4,0,-4,0,-4,343,343,-1,343,343,-7,343,343,343,-1,343,-3,343,-14,343,-2,343,-1,343,-5,343,-1,343,343,343,-4,343,-7,343,-47,343,343,343,343,343,343,343,343,343,343,343,343,343,343],
    sm203=[0,-4,0,-4,0,-18,344,-40,345],
    sm204=[0,-1,2,3,-1,0,-4,0,-18,346,119,-3,7,-26,8,9,-6,120,347,-11,10,11,-8,18,-18,28,29,-1,232,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm205=[0,-4,0,-4,0,-4,348,348,-1,348,348,-7,348,348,348,348,348,-2,348,348,-14,348,348,-1,348,-1,348,-5,348,-1,348,348,348,-1,348,-1,348,348,348,-1,348,-4,348,-14,348,-22,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,348,-4,348,348],
    sm206=[0,-4,0,-4,0,-18,349,-40,349],
    sm207=[0,-1,350,350,-1,0,-4,0,-18,350,350,-3,350,-26,350,350,-6,350,350,-11,350,350,-8,350,-18,350,350,-1,350,350,-23,350,-1,350,350,350,350,350,350,-4,350,350,350,350,350,350],
    sm208=[0,-4,0,-4,0,-18,351,-1,352],
    sm209=[0,-4,0,-4,0,-20,353],
    sm210=[0,-4,0,-4,0,-4,354,354,-1,354,354,-7,354,354,354,354,354,-2,354,354,-14,354,354,-1,354,-1,354,-5,354,-1,354,354,354,-1,354,-1,354,354,354,-1,354,-4,354,-14,354,-22,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,354,-4,354,354],
    sm211=[0,-4,0,-4,0,-18,355,-1,355],
    sm212=[0,-4,0,-4,0,-18,356,-1,356],
    sm213=[0,-4,0,-4,0,-18,356,-1,356,-19,275],
    sm214=[0,-4,0,-4,0,-23,357,-43,358],
    sm215=[0,-4,0,-4,0,-18,137,-1,137,-2,359,-16,137,-26,359],
    sm216=[0,-1,2,3,-1,0,-4,0,-58,235,-81,38,39,-3,43],
    sm217=[0,-4,0,-4,0,-23,360,-43,360],
    sm218=[0,-4,0,-4,0,-23,359,-43,359],
    sm219=[0,-4,0,-4,0,-4,361,361,-1,361,361,-7,361,361,361,361,361,-2,361,361,-14,361,361,-1,361,-1,361,-5,361,-1,361,361,361,-1,361,-1,361,361,361,-1,361,-4,361,-14,361,-22,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,361,-4,361,361],
    sm220=[0,-4,0,-4,0,-59,362],
    sm221=[0,-4,0,-4,0,-18,363,-5,364],
    sm222=[0,-4,0,-4,0,-24,365],
    sm223=[0,-4,0,-4,0,-4,366,366,-1,366,366,-7,366,366,366,366,366,-2,366,366,-14,366,366,-1,366,-1,366,-5,366,-1,366,366,366,-1,366,-1,366,366,366,-1,366,-4,366,-14,366,-22,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,366,-4,366,366],
    sm224=[0,-4,0,-4,0,-18,367,-5,368],
    sm225=[0,-4,0,-4,0,-18,369,-5,369],
    sm226=[0,-4,0,-4,0,-18,370,-5,370],
    sm227=[0,-4,0,-4,0,-59,371],
    sm228=[0,-4,0,-4,0,-4,372,372,-1,372,372,-7,372,372,372,372,372,-2,372,372,-14,372,372,-1,372,-1,372,-5,372,-1,372,372,372,-1,372,-1,372,372,372,-1,372,-4,372,-14,372,-22,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,-4,372,372],
    sm229=[0,-4,0,-4,0,-4,373,373,-1,373,373,-7,373,373,373,373,373,-2,373,373,-14,373,373,-1,373,-1,373,-5,373,-1,373,373,373,-1,373,-1,373,373,373,-1,373,-4,373,-14,373,-22,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,-4,373,373],
    sm230=[0,-4,0,-4,0,-4,374,374,-1,374,374,-7,374,374,374,374,374,-2,374,374,-14,374,374,-1,374,-1,374,-5,374,-1,374,374,374,-1,374,-1,374,374,374,-1,374,-4,374,-14,374,-22,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,-4,374,374],
    sm231=[0,-4,0,-4,0,-4,375,375,-1,375,375,-7,375,375,375,375,375,-2,375,375,-14,375,375,-1,375,-1,375,-5,375,-1,375,375,375,-1,375,-1,375,375,375,-1,375,-4,375,-14,375,-22,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,-4,375,375],
    sm232=[0,-1,376,376,-1,376,376,376,376,376,0,-140,376],
    sm233=[0,-1,377,377,-1,377,377,377,377,377,0,-141,377],
    sm234=[0,-4,0,-4,0,-4,378,378,-1,378,378,-7,378,378,378,378,378,-2,378,378,-14,378,378,-1,378,-1,378,-5,378,-1,378,378,378,-1,378,-1,378,378,378,-1,378,-4,378,-14,378,-12,378,-9,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,-4,378,378],
    sm235=[0,-4,0,-4,0,-24,379,-78,380],
    sm236=[0,-4,0,-4,0,-24,381],
    sm237=[0,-4,0,-4,0,-24,382],
    sm238=[0,-4,0,-4,0,-4,383,383,-1,383,383,-7,383,383,383,383,383,-2,383,383,-14,383,383,-1,383,-1,383,-5,383,-1,383,383,383,-1,383,-1,383,383,383,-1,383,-4,383,-14,383,-22,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,-4,383,383],
    sm239=[0,-4,0,-4,0,-59,384],
    sm240=[0,-4,0,-4,0,-4,385,-11,385,385,385,-1,385,-3,385,-34,385,-7,385],
    sm241=[0,-4,0,-4,0,-4,386,-11,386,386,386,-1,386,-3,386,-34,386,-7,386],
    sm242=[0,387,387,387,-1,0,-4,0,-4,387,387,-7,387,-5,387,387,-2,387,-26,387,387,-6,387,-11,387,387,387,387,-1,387,387,387,387,387,387,387,-1,387,387,387,387,387,387,387,387,-2,387,387,-5,387,387,-2,387,-23,387,-1,387,387,387,387,387,387,-4,387,387,387,387,387,387],
    sm243=[0,388,388,388,-1,0,-4,0,-4,388,388,-7,388,-5,388,388,-2,388,-26,388,388,-6,388,-11,388,388,388,388,-1,388,388,388,388,388,388,388,-1,388,388,388,388,388,388,388,388,-2,388,388,-5,388,388,-2,388,-23,388,-1,388,388,388,388,388,388,-4,388,388,388,388,388,388],
    sm244=[0,389,389,389,-1,0,-4,0,-4,389,389,-7,389,-5,389,389,-2,389,-26,389,389,-6,389,-11,389,389,389,389,-1,389,389,389,389,389,389,389,-1,389,389,389,389,389,389,389,389,-2,389,389,-5,389,389,-2,389,-23,389,-1,389,389,389,389,389,389,-4,389,389,389,389,389,389],
    sm245=[0,-4,0,-4,0,-4,390,-13,390],
    sm246=[0,-4,0,-4,0,-18,391,-1,391,-3,391,-15,391,-3,391,-14,391,-22,391],
    sm247=[0,-4,0,-4,0,-20,392],
    sm248=[0,-4,0,-4,0,-18,393,-1,394],
    sm249=[0,-4,0,-4,0,-18,395,-1,395],
    sm250=[0,-4,0,-4,0,-18,396,-1,396],
    sm251=[0,-4,0,-4,0,-67,397],
    sm252=[0,-4,0,-4,0,-18,398,-1,398,-3,398,-15,275,-18,398],
    sm253=[0,-4,0,-4,0,-18,399,-1,399,-3,399,-15,399,-3,399,-14,399,-22,399],
    sm254=[0,-2,3,-1,0,-4,0,-18,346,169,-38,170,400,-43,280,-41,43],
    sm255=[0,-4,0,-4,0,-59,401],
    sm256=[0,-4,0,-4,0,-18,402,-40,403],
    sm257=[0,-4,0,-4,0,-18,404,-40,404],
    sm258=[0,-4,0,-4,0,-18,405,-40,405],
    sm259=[0,-4,0,-4,0,-18,406,-1,406,-3,406,-34,406],
    sm260=[0,-4,0,-4,0,-18,406,-1,406,-3,406,-15,275,-18,406],
    sm261=[0,-4,0,-4,0,-24,407],
    sm262=[0,-4,0,-4,0,-23,408],
    sm263=[0,-4,0,-4,0,-24,409],
    sm264=[0,-4,0,-4,0,-4,410],
    sm265=[0,-1,2,3,-1,0,-4,0,-4,411,-14,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm266=[0,-4,0,-4,0,-44,412],
    sm267=[0,-1,2,3,-1,0,-4,0,-4,413,-14,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm268=[0,-4,0,-4,0,-82,414],
    sm269=[0,-4,0,-4,0,-4,415],
    sm270=[0,-4,0,-4,0,-4,65,65,-1,65,65,-9,65,-20,65,66,-1,65,-1,416,-5,65,-1,65,65,65,-5,67,-1,68,-19,417,-22,69,70,71,72,73,74,75,76,77,78,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,-4,79,80],
    sm271=[0,-4,0,-4,0,-44,416,-37,417],
    sm272=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,-47,10,11,12,-3,418,-16,27,-5,28,29,-2,30,-35,38,39,40,41,42,43],
    sm273=[0,-4,0,-4,0,-24,419],
    sm274=[0,420,420,420,-1,0,-4,0,-4,420,420,-7,420,-5,420,420,-2,420,-26,420,420,-6,420,-11,420,420,420,420,-1,420,420,420,420,420,420,420,-1,420,420,420,420,420,420,420,420,-2,420,420,-5,420,420,-2,420,-23,420,-1,420,420,420,420,420,420,-4,420,420,420,420,420,420],
    sm275=[0,421,421,421,-1,0,-4,0,-4,421,421,-7,421,-5,421,421,-2,421,-26,421,421,-6,421,-11,421,421,421,421,-1,421,421,421,421,421,421,421,-1,421,421,421,421,421,421,421,421,-2,421,421,-5,421,421,-2,421,-23,421,-1,421,421,421,421,421,421,-4,421,421,421,421,421,421],
    sm276=[0,422,422,422,-1,0,-4,0,-4,422,422,-7,422,-5,422,422,-2,422,-26,422,422,-6,422,-11,422,422,422,422,-1,422,422,422,422,422,422,422,-1,422,422,422,422,422,422,422,422,-2,422,422,-5,422,422,-2,422,-23,422,-1,422,422,422,422,422,422,-4,422,422,422,422,422,422],
    sm277=[0,-4,0,-4,0,-24,423],
    sm278=[0,424,424,424,-1,0,-4,0,-4,424,424,-7,424,-5,424,424,-2,424,-26,424,424,-6,424,-11,424,424,424,424,-1,424,424,424,424,424,424,424,-1,424,424,424,424,424,424,424,424,-2,424,424,-5,424,424,-2,424,-23,424,-1,424,424,424,424,424,424,-4,424,424,424,424,424,424],
    sm279=[0,425,425,425,-1,0,-4,0,-4,425,425,-7,425,-5,425,425,-2,425,-26,425,425,-6,425,-11,425,425,425,425,-1,425,425,425,425,425,425,425,-1,425,425,425,425,425,425,425,425,-1,293,425,425,-5,425,425,-2,425,-23,425,-1,425,425,425,425,425,425,-4,425,425,425,425,425,425],
    sm280=[0,426,426,426,-1,0,-4,0,-4,426,426,-7,426,-5,426,426,-2,426,-26,426,426,-6,426,-11,426,426,426,426,-1,426,426,426,426,426,426,426,-1,426,426,426,426,426,426,426,426,-2,426,426,-5,426,426,-2,426,-23,426,-1,426,426,426,426,426,426,-4,426,426,426,426,426,426],
    sm281=[0,-4,0,-4,0,-23,427],
    sm282=[0,-2,296,-1,0,-4,0,-7,428,429,-131,299,300],
    sm283=[0,-4,186,-4,187,-3,188,-1,51,-7,430,-1,431],
    sm284=[0,-4,0,-4,0,-8,432],
    sm285=[0,-2,433,-1,0,-4,0,-7,433,433,-131,433,433],
    sm286=[0,-2,434,-1,0,-4,0,-7,434,434,-31,435,-99,434,434],
    sm287=[0,-2,436,-1,0,-4,0],
    sm288=[0,-2,437,-1,0,-4,0],
    sm289=[0,-2,438,-1,0,-4,0,-7,438,438,-31,438,-99,438,438],
    sm290=[0,-2,296,-1,0,-4,0,-7,439,440,-131,299,300],
    sm291=[0,441,-3,441,-4,441,-3,441,441,441,-7,442,-1,441],
    sm292=[0,-4,0,-4,0,-8,443],
    sm293=[0,-2,296,-1,0,-4,0,-8,444,-131,299,300],
    sm294=[0,-4,0,-4,0,-13,445,-5,446,-5,447,-32,448],
    sm295=[0,-2,296,-1,0,-4,0,-8,449,-131,299,300],
    sm296=[0,-1,2,3,-1,0,-4,0,-4,4,51,-7,450,-5,6,-3,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm297=[0,-4,451,-4,451,-3,451,-1,451,-7,451,-1,451],
    sm298=[0,-4,452,-4,452,-3,452,-1,452,-2,452,-4,452,-1,452],
    sm299=[0,-2,296,-1,0,-4,0,-7,453,454,-131,299,300],
    sm300=[0,455,455,455,-1,0,-4,0,-4,455,455,-1,455,455,-4,455,-2,455,455,455,455,455,-2,455,455,-14,455,455,-1,455,-1,455,-5,455,455,455,455,455,-1,455,-1,455,455,455,-1,455,-4,455,-2,455,455,455,455,-1,455,-1,455,455,455,455,455,455,455,455,455,455,455,455,455,455,-2,455,455,-5,455,455,-2,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,455,-4,455,455,455,455,455,455],
    sm301=[0,-1,2,3,-1,0,-4,0,-4,312,-15,456,-37,235,-38,314,236,237,-40,38,39,-3,43],
    sm302=[0,-4,0,-4,0,-20,457],
    sm303=[0,458,458,458,-1,0,-4,0,-4,458,458,-1,458,458,-4,458,-2,458,458,458,458,458,-2,458,458,-14,458,458,-1,458,-1,458,-5,458,458,458,458,458,-1,458,-1,458,458,458,-1,458,-4,458,-2,458,458,458,458,-1,458,-1,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-2,458,458,-5,458,458,-2,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-4,458,458,458,458,458,458],
    sm304=[0,-1,2,3,-1,0,-4,0,-4,312,-15,459,-37,235,-38,314,236,237,-40,38,39,-3,43],
    sm305=[0,-1,460,460,-1,0,-4,0,-4,460,-15,460,-37,460,-38,460,460,460,-40,460,460,-3,460],
    sm306=[0,-1,461,461,-1,0,-4,0,-4,461,-15,461,-37,461,-38,461,461,461,-40,461,461,-3,461],
    sm307=[0,-1,2,3,-1,0,-4,0,-58,235,-39,236,237,-40,38,39,-3,43],
    sm308=[0,-4,0,-4,0,-23,357],
    sm309=[0,-4,0,-4,0,-23,359],
    sm310=[0,-4,0,-4,0,-19,462],
    sm311=[0,-2,3,-1,0,-4,0,-19,169,-4,463,-33,170,-44,280,-41,43],
    sm312=[0,-4,0,-4,0,-24,464],
    sm313=[0,-4,0,-4,0,-19,465],
    sm314=[0,-4,0,-4,0,-24,466],
    sm315=[0,-4,0,-4,0,-18,467,-5,466],
    sm316=[0,-4,0,-4,0,-24,468],
    sm317=[0,-4,0,-4,0,-18,469,-5,469],
    sm318=[0,-4,0,-4,0,-18,470,-5,470],
    sm319=[0,471,471,471,-1,0,-4,0,-4,471,471,-7,471,-5,471,471,-2,471,-26,471,471,-6,471,-11,471,471,471,471,-1,471,-1,471,471,471,471,471,-1,471,471,471,471,471,471,471,471,-2,471,471,-5,471,471,-2,471,-23,471,-1,471,471,471,471,471,471,-4,471,471,471,471,471,471],
    sm320=[0,-4,0,-4,0,-4,472,-13,472],
    sm321=[0,-4,0,-4,0,-18,346,-40,473],
    sm322=[0,-4,0,-4,0,-4,474,474,-1,474,474,-7,474,474,474,474,474,-2,474,474,-14,474,474,-1,474,-1,474,-5,474,-1,474,474,474,-1,474,-1,474,474,474,-1,474,-4,474,-14,474,-22,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,-4,474,474],
    sm323=[0,-1,2,3,-1,0,-4,0,-18,230,119,-3,7,-26,8,9,-6,120,350,-11,10,11,-8,18,-18,28,29,-1,232,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm324=[0,-4,0,-4,0,-4,475,475,-1,475,475,-7,475,475,475,475,475,-2,475,475,-14,475,475,-1,475,-1,475,-5,475,-1,475,475,475,-1,475,-1,475,475,475,-1,475,-4,475,-14,475,-22,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,-4,475,475],
    sm325=[0,-4,0,-4,0,-18,476,-40,476],
    sm326=[0,-1,477,477,-1,0,-4,0,-18,477,477,-3,477,-26,477,477,-6,477,477,-11,477,477,-8,477,-18,477,477,-1,477,477,-23,477,-1,477,477,477,477,477,477,-4,477,477,477,477,477,477],
    sm327=[0,-4,0,-4,0,-18,478,-40,478],
    sm328=[0,-1,2,3,-1,0,-4,0,-20,479,-37,235,-39,236,237,-3,238,-36,38,39,-3,43],
    sm329=[0,-4,0,-4,0,-4,480,480,-1,480,480,-7,480,480,480,480,480,-2,480,480,-14,480,480,-1,480,-1,480,-5,480,-1,480,480,480,-1,480,-1,480,480,480,-1,480,-4,480,-14,480,-22,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,480,-4,480,480],
    sm330=[0,-4,0,-4,0,-4,481,481,-1,481,481,-7,481,481,481,481,481,-2,481,481,-14,481,481,-1,481,-1,481,-5,481,-1,481,481,481,-1,481,-1,481,481,481,-1,481,-4,481,-14,481,-22,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,481,-4,481,481],
    sm331=[0,-4,0,-4,0,-18,482,-1,482],
    sm332=[0,-4,0,-4,0,-18,483,-1,483],
    sm333=[0,-2,3,-1,0,-4,0,-19,169,-38,170,-44,280,-41,43],
    sm334=[0,-4,0,-4,0,-23,484],
    sm335=[0,-4,0,-4,0,-23,485],
    sm336=[0,-4,0,-4,0,-59,486],
    sm337=[0,-4,0,-4,0,-4,487,487,-1,487,487,-7,487,487,487,487,487,-2,487,487,-14,487,487,-1,487,-1,487,-5,487,-1,487,487,487,-1,487,-1,487,487,487,-1,487,-4,487,-14,487,-22,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,487,-4,487,487],
    sm338=[0,-4,0,-4,0,-24,488],
    sm339=[0,-4,0,-4,0,-4,489,489,-1,489,489,-7,489,489,489,489,489,-2,489,489,-14,489,489,-1,489,-1,489,-5,489,-1,489,489,489,-1,489,-1,489,489,489,-1,489,-4,489,-14,489,-22,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,-4,489,489],
    sm340=[0,-4,0,-4,0,-4,490,490,-1,490,490,-7,490,490,490,490,490,-2,490,490,-14,490,490,-1,490,-1,490,-5,490,-1,490,490,490,-1,490,-1,490,490,490,-1,490,-4,490,-14,490,-22,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,-4,490,490],
    sm341=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-1,252,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm342=[0,-4,0,-4,0,-18,491,-5,491],
    sm343=[0,-4,0,-4,0,-4,492,492,-1,492,492,-7,492,492,492,492,492,-2,492,492,-14,492,492,-1,492,-1,492,-5,492,-1,492,492,492,-1,492,-1,492,492,492,-1,492,-4,492,-14,492,-22,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,-4,492,492],
    sm344=[0,-4,0,-4,0,-4,493,493,-1,493,493,-7,493,493,493,493,493,-2,493,493,-14,493,493,-1,493,-1,493,-5,493,-1,493,493,493,-1,493,-1,493,493,493,-1,493,-4,493,-14,493,-12,493,-9,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,-4,493,493],
    sm345=[0,-4,0,-4,0,-4,494,494,-1,494,494,-7,494,494,494,494,494,-2,494,494,-14,494,494,-1,494,-1,494,-5,494,-1,494,494,494,-1,494,-1,494,494,494,-1,494,-4,494,-14,494,-12,494,-9,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,-4,494,494],
    sm346=[0,-4,0,-4,0,-4,495,495,-1,495,495,-7,495,495,495,495,495,-2,495,495,-14,495,495,-1,495,-1,495,-5,495,-1,495,495,495,-1,495,-1,495,495,495,-1,495,-4,495,-14,495,-22,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,-4,495,495],
    sm347=[0,-4,0,-4,0,-20,496],
    sm348=[0,-4,0,-4,0,-20,497],
    sm349=[0,-4,0,-4,0,-4,498,-13,498],
    sm350=[0,-4,0,-4,0,-4,499,-13,499,-1,499,-3,499,-34,499],
    sm351=[0,-4,0,-4,0,-18,500,-1,500,-3,500,-15,500,-3,500,-14,500,-22,500],
    sm352=[0,-1,2,3,-1,0,-4,0,-20,501,-37,235,-44,278,-36,38,39,-3,43],
    sm353=[0,-4,0,-4,0,-20,502],
    sm354=[0,-4,0,-4,0,-18,503,-1,503,-3,503,-34,503],
    sm355=[0,-4,0,-4,0,-59,504],
    sm356=[0,-4,0,-4,0,-18,505,-1,505,-3,505,-15,505,-3,505,-14,505,-22,505],
    sm357=[0,-4,0,-4,0,-18,506,-40,506],
    sm358=[0,-2,3,-1,0,-4,0,-18,230,169,-38,170,507,-43,280,-41,43],
    sm359=[0,-4,0,-4,0,-24,508,-34,508],
    sm360=[0,-4,0,-4,0,-18,509,-1,509,-3,509,-34,509],
    sm361=[0,-1,2,3,-1,0,-4,0,-4,510,-14,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm362=[0,-4,0,-4,0,-4,511],
    sm363=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,512,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm364=[0,-4,0,-4,0,-4,513],
    sm365=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,514,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm366=[0,-4,0,-4,0,-4,515,-13,272],
    sm367=[0,-4,0,-4,0,-44,516,-37,517],
    sm368=[0,-4,0,-4,0,-4,274,-13,274,-21,275,-3,518,-37,518],
    sm369=[0,-4,0,-4,0,-40,275,-3,518,-37,518],
    sm370=[0,-4,0,-4,0,-44,519,-37,519],
    sm371=[0,-4,0,-4,0,-82,520],
    sm372=[0,-4,0,-4,0,-82,417],
    sm373=[0,-4,0,-4,0,-19,521],
    sm374=[0,522,522,522,-1,0,-4,0,-4,522,522,-7,522,-5,522,522,-2,522,-26,522,522,-6,522,-11,522,522,522,522,-1,522,522,522,522,522,522,522,-1,522,522,522,522,522,522,522,522,-2,522,522,-5,522,522,-2,522,-23,522,-1,522,522,522,522,522,522,-4,522,522,522,522,522,522],
    sm375=[0,523,523,523,-1,0,-4,0,-4,523,523,-7,523,-5,523,523,-2,523,-26,523,523,-6,523,-11,523,523,523,523,-1,523,523,523,523,523,523,523,-1,523,523,523,523,523,523,523,523,-2,523,523,-5,523,523,-2,523,-23,523,-1,523,523,523,523,523,523,-4,523,523,523,523,523,523],
    sm376=[0,-4,0,-4,0,-8,524],
    sm377=[0,-2,525,-1,0,-4,0,-7,525,525,-131,525,525],
    sm378=[0,-4,186,-4,187,-3,188,-1,184,-7,526,-1,431],
    sm379=[0,-4,527,-4,527,-3,527,-1,527,-7,527,-1,527],
    sm380=[0,-4,528,-4,528,-3,528,-1,528,-7,528,-1,528],
    sm381=[0,-4,186,-4,187,-3,188,-1,529,-7,529,-1,529],
    sm382=[0,-4,529,-4,529,-3,529,-1,529,-7,529,-1,529],
    sm383=[0,-2,530,-1,530,-4,530,-3,530,-1,530,-1,530,530,-4,530,-1,530,-124,530,530],
    sm384=[0,531,-3,531,-4,531,-3,531,531,531,-7,531,-1,531],
    sm385=[0,-2,532,-1,0,-4,0,-15,431,-124,533,534],
    sm386=[0,-4,0,-4,0,-141,535],
    sm387=[0,-4,0,-4,0,-140,536],
    sm388=[0,537,-3,537,-4,537,-3,537,537,537,-7,538,-1,537],
    sm389=[0,-4,0,-4,0,-8,539],
    sm390=[0,-4,0,-4,0,-6,220,-3,190,191,-134,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209],
    sm391=[0,-4,0,-4,0,-13,540],
    sm392=[0,-4,0,-4,0,-13,541],
    sm393=[0,-4,0,-4,0,-13,542,-5,446,-5,447,-32,448],
    sm394=[0,-4,0,-4,0,-4,543,-8,544,-5,544,-5,544,-32,544],
    sm395=[0,-4,0,-4,0,-6,545,-15,546,-3,547,-7,548],
    sm396=[0,-4,0,-4,0,-13,549,-5,549,-5,549,-32,549],
    sm397=[0,-4,0,-4,0,-13,550,-5,550,-5,550,-32,550],
    sm398=[0,-4,0,-4,0,-18,551,552],
    sm399=[0,-2,553,-1,0,-4,0,-25,447],
    sm400=[0,-4,0,-4,0,-18,554,554],
    sm401=[0,-4,0,-4,0,-8,555,-9,556,556,-4,556,-25,557,558,559,-5,448],
    sm402=[0,-2,560,-1,0,-4,0,-53,561,562,563,564,-1,565,566,-7,567],
    sm403=[0,-4,0,-4,0,-4,568],
    sm404=[0,-4,0,-4,0,-4,569],
    sm405=[0,-4,0,-4,0,-4,570],
    sm406=[0,-1,2,3,-1,0,-4,0,-4,4,51,-7,571,-5,6,-3,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm407=[0,-4,0,-4,0,-13,572],
    sm408=[0,-4,0,-4,0,-14,573],
    sm409=[0,-4,0,-4,0,-8,574],
    sm410=[0,-4,0,-4,0,-5,575],
    sm411=[0,-4,0,-4,0,-20,576],
    sm412=[0,577,577,577,-1,0,-4,0,-4,577,577,-1,577,577,-4,577,-2,577,577,577,577,577,-2,577,577,-14,577,577,-1,577,-1,577,-5,577,577,577,577,577,-1,577,-1,577,577,577,-1,577,-4,577,-2,577,577,577,577,-1,577,-1,577,577,577,577,577,577,577,577,577,577,577,577,577,577,-2,577,577,-5,577,577,-2,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,577,-4,577,577,577,577,577,577],
    sm413=[0,578,578,578,-1,0,-4,0,-4,578,578,-1,578,578,-4,578,-2,578,578,578,578,578,-2,578,578,-14,578,578,-1,578,-1,578,-5,578,578,578,578,578,-1,578,-1,578,578,578,-1,578,-4,578,-2,578,578,578,578,-1,578,-1,578,578,578,578,578,578,578,578,578,578,578,578,578,578,-2,578,578,-5,578,578,-2,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,-4,578,578,578,578,578,578],
    sm414=[0,-1,579,579,-1,0,-4,0,-4,579,-15,579,-37,579,-38,579,579,579,-40,579,579,-3,579],
    sm415=[0,-1,580,580,-1,0,-4,0,-4,580,-15,580,-37,580,-38,580,580,580,-40,580,580,-3,580],
    sm416=[0,-4,0,-4,0,-24,581],
    sm417=[0,-4,0,-4,0,-19,582],
    sm418=[0,-4,0,-4,0,-19,583],
    sm419=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,584,-2,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm420=[0,-2,3,-1,0,-4,0,-19,169,-4,585,-33,170,-44,280,-41,43],
    sm421=[0,-4,0,-4,0,-4,586,-13,586],
    sm422=[0,-4,0,-4,0,-4,587,-11,587,587,587,-1,587,-3,587,-34,587,-7,587],
    sm423=[0,-4,0,-4,0,-4,588,588,-1,588,588,-7,588,588,588,588,588,-2,588,588,-14,588,588,-1,588,-1,588,-5,588,-1,588,588,588,-1,588,-1,588,588,588,-1,588,-4,588,-14,588,-22,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,588,-4,588,588],
    sm424=[0,-4,0,-4,0,-18,589,-40,589],
    sm425=[0,-1,2,3,-1,0,-4,0,-18,346,119,-3,7,-26,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm426=[0,-4,0,-4,0,-4,590,590,-1,590,590,-7,590,590,590,590,590,-2,590,590,-14,590,590,-1,590,-1,590,-5,590,-1,590,590,590,-1,590,-1,590,590,590,-1,590,-4,590,-14,590,-22,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,-4,590,590],
    sm427=[0,-4,0,-4,0,-18,591,-1,591],
    sm428=[0,-4,0,-4,0,-18,592,-1,592],
    sm429=[0,-4,0,-4,0,-24,593],
    sm430=[0,-4,0,-4,0,-24,594],
    sm431=[0,-4,0,-4,0,-24,595],
    sm432=[0,-4,0,-4,0,-23,596,-43,596],
    sm433=[0,-4,0,-4,0,-4,597,597,-1,597,597,-7,597,597,597,597,597,-2,597,597,-14,597,597,-1,597,-1,597,-5,597,-1,597,597,597,-1,597,-1,597,597,597,-1,597,-4,597,-14,597,-22,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,-4,597,597],
    sm434=[0,-4,0,-4,0,-18,598,-5,598],
    sm435=[0,-4,0,-4,0,-24,599],
    sm436=[0,-4,0,-4,0,-24,600],
    sm437=[0,-4,0,-4,0,-4,601,-11,601,601,601,-1,601,-3,601,-34,601,-7,601],
    sm438=[0,-4,0,-4,0,-20,602],
    sm439=[0,-4,0,-4,0,-18,603,-1,603,-3,603,-15,603,-3,603,-14,603,-22,603],
    sm440=[0,-4,0,-4,0,-18,604,-1,604],
    sm441=[0,-4,0,-4,0,-18,605,-1,605],
    sm442=[0,-4,0,-4,0,-18,606,-1,606,-3,606,-15,606,-3,606,-14,606,-22,606],
    sm443=[0,-2,3,-1,0,-4,0,-18,346,169,-38,170,607,-43,280,-41,43],
    sm444=[0,-4,0,-4,0,-59,608],
    sm445=[0,-4,0,-4,0,-18,609,-40,609],
    sm446=[0,610,610,610,-1,0,-4,0,-4,610,610,-7,610,-5,610,610,-2,610,-26,610,610,-6,610,-11,610,610,610,610,-1,610,611,610,610,610,610,610,-1,610,610,610,610,610,610,610,610,-2,610,610,-5,610,610,-2,610,-23,610,-1,610,610,610,610,610,610,-4,610,610,610,610,610,610],
    sm447=[0,-4,0,-4,0,-24,612],
    sm448=[0,613,613,613,-1,0,-4,0,-4,613,613,-7,613,-5,613,613,-2,613,-26,613,613,-6,613,-11,613,613,613,613,-1,613,613,613,613,613,613,613,-1,613,613,613,613,613,613,613,613,-2,613,613,-5,613,613,-2,613,-23,613,-1,613,613,613,613,613,613,-4,613,613,613,613,613,613],
    sm449=[0,-4,0,-4,0,-4,614],
    sm450=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,615,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm451=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,616,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm452=[0,-4,0,-4,0,-24,617],
    sm453=[0,-4,0,-4,0,-24,618],
    sm454=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,619,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm455=[0,-4,0,-4,0,-24,620],
    sm456=[0,-4,0,-4,0,-24,621],
    sm457=[0,-4,0,-4,0,-82,517],
    sm458=[0,-4,0,-4,0,-82,518],
    sm459=[0,622,622,622,-1,0,-4,0,-4,622,622,-7,622,-5,622,622,-2,622,-26,622,622,-6,622,-11,622,622,622,622,-1,622,622,622,622,622,622,622,-1,622,622,622,622,622,622,622,622,-2,622,622,-5,622,622,-2,622,-23,622,-1,622,622,622,622,622,622,-4,622,622,622,622,622,622],
    sm460=[0,-4,0,-4,0,-20,623,-49,624,-18,625],
    sm461=[0,626,626,626,-1,0,-4,0,-4,626,626,-7,626,-5,626,626,-2,626,-26,626,626,-6,626,-11,626,626,626,626,-1,626,626,626,626,626,626,626,-1,626,626,626,626,626,626,626,626,-2,626,626,-5,626,626,-2,626,-23,626,-1,626,626,626,626,626,626,-4,626,626,626,626,626,626],
    sm462=[0,-4,0,-4,0,-24,627],
    sm463=[0,-4,0,-4,0,-24,628],
    sm464=[0,-4,186,-4,187,-3,188,-1,184,-7,629,-1,431],
    sm465=[0,630,-3,630,-4,630,-3,630,630,630,-7,630,-1,630],
    sm466=[0,-2,185,-1,0,-4,0],
    sm467=[0,-4,631,-4,631,-3,631,-1,631,-7,631,-1,631],
    sm468=[0,-4,0,-4,0,-16,632,633],
    sm469=[0,-2,634,-1,0,-4,0,-7,634,634,-131,634,634],
    sm470=[0,-2,635,-1,0,-4,0,-7,635,635,-131,635,635],
    sm471=[0,-2,636,-1,637,638,639,640,641,0,-3,642,-11,431],
    sm472=[0,-2,636,-1,637,638,639,640,641,0,-3,642],
    sm473=[0,-2,643,-1,0,-4,0,-7,643,643,-31,643,-99,643,643],
    sm474=[0,-4,0,-4,0,-8,644],
    sm475=[0,-4,0,-4,0,-13,645],
    sm476=[0,-4,0,-4,0,-12,646],
    sm477=[0,-4,0,-4,0,-13,647,-5,446,-5,447,-32,448],
    sm478=[0,-4,0,-4,0,-4,543,-8,648,-5,648,-5,648,-32,648],
    sm479=[0,-4,0,-4,0,-13,649,-5,649,-5,649,-32,649],
    sm480=[0,-4,0,-4,0,-4,543],
    sm481=[0,-2,650,-1,0,-4,0,-4,650,-8,650,-5,650,650,-4,650,-32,650],
    sm482=[0,-4,651,-4,0,-46,652,-93,653,654],
    sm483=[0,-2,655,-1,0,-4,0,-23,656,-8,657,-2,658],
    sm484=[0,-4,0,-4,0,-27,659,-112,653,654],
    sm485=[0,-2,660,-1,0,-4,661,-23,662,-8,663],
    sm486=[0,-4,0,-4,0,-58,448],
    sm487=[0,-2,553,-1,0,-4,0,-4,664,-15,665,-4,447],
    sm488=[0,-2,666,-1,0,-4,0,-4,667,-15,666,-4,666],
    sm489=[0,-2,668,-1,0,-4,0,-4,668,-15,668,-4,668],
    sm490=[0,-2,669,-1,0,-4,0,-4,669,-15,669,-4,669],
    sm491=[0,-2,670,-1,0,-4,0,-4,670,-15,670,-4,670],
    sm492=[0,-4,0,-4,0,-67,671],
    sm493=[0,-4,0,-4,0,-8,555,-9,672,672,-4,672,-25,557,558,559,-5,448],
    sm494=[0,-4,0,-4,0,-8,673,-9,673,673,-4,673,-25,673,673,673,-5,673],
    sm495=[0,-4,0,-4,0,-8,674,-9,674,674,-4,674,-25,674,674,674,-5,674],
    sm496=[0,-4,0,-4,0,-58,675],
    sm497=[0,-4,0,-4,0,-55,563,564,-1,565,676,-7,567],
    sm498=[0,-4,0,-4,0,-55,563,564,-1,565,677,-7,567],
    sm499=[0,-4,0,-4,0,-59,678,-7,679],
    sm500=[0,-4,0,-4,0,-8,680,-9,680,680,-4,680,-25,680,680,680,-5,680],
    sm501=[0,-4,0,-4,0,-55,681,681,-1,681,681,-7,681],
    sm502=[0,-2,682,-1,0,-4,0,-53,683],
    sm503=[0,-4,0,-4,0,-54,684,681,681,-1,681,681,-7,681],
    sm504=[0,-4,0,-4,0,-40,685,-10,685,-2,684,685,685,-1,685,685,685,685,685,-4,685],
    sm505=[0,-4,0,-4,0,-54,686],
    sm506=[0,-2,687,-1,0,-4,0,-53,687],
    sm507=[0,-4,0,-4,0,-55,688,688,-1,688,688,-7,688],
    sm508=[0,-4,0,-4,0,-55,689,689,-1,689,689,-7,689],
    sm509=[0,-2,690,-1,0,-4,0],
    sm510=[0,-2,691,-1,0,-4,0],
    sm511=[0,-2,560,-1,0,-4,0,-53,692,562],
    sm512=[0,-2,693,-1,0,-4,0,-67,694],
    sm513=[0,-4,0,-4,0,-59,695,-7,695],
    sm514=[0,-4,0,-4,0,-59,696,-7,694],
    sm515=[0,-4,0,-4,0,-13,697],
    sm516=[0,-4,0,-4,0,-14,698],
    sm517=[0,-4,0,-4,0,-14,699],
    sm518=[0,-4,0,-4,0,-8,700],
    sm519=[0,-4,0,-4,0,-5,701],
    sm520=[0,702,702,702,-1,0,-4,0,-4,702,702,-1,702,702,-4,702,-2,702,702,702,702,702,-2,702,702,-14,702,702,-1,702,-1,702,-5,702,702,702,702,702,-1,702,-1,702,702,702,-1,702,-4,702,-2,702,702,702,702,-1,702,-1,702,702,702,702,702,702,702,702,702,702,702,702,702,702,-2,702,702,-5,702,702,-2,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,702,-4,702,702,702,702,702,702],
    sm521=[0,-4,0,-4,0,-19,703],
    sm522=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,704,-2,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm523=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,705,-2,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm524=[0,-4,0,-4,0,-20,706],
    sm525=[0,707,707,707,-1,0,-4,0,-4,707,707,-1,707,707,-4,707,-2,707,707,707,707,707,-2,707,707,-14,707,707,-1,707,-1,707,-5,707,707,707,707,707,-1,707,-1,707,707,707,-1,707,-4,707,-2,707,707,707,707,-1,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,-2,707,707,-5,707,707,-2,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,707,-4,707,707,707,707,707,707],
    sm526=[0,-4,0,-4,0,-20,708],
    sm527=[0,-4,0,-4,0,-24,709],
    sm528=[0,-4,0,-4,0,-18,710,-5,710],
    sm529=[0,-4,0,-4,0,-18,711,-40,711],
    sm530=[0,-4,0,-4,0,-19,712],
    sm531=[0,-4,0,-4,0,-19,713],
    sm532=[0,-4,0,-4,0,-24,714],
    sm533=[0,-4,0,-4,0,-24,715],
    sm534=[0,-4,0,-4,0,-4,716,716,-1,716,716,-7,716,716,716,716,716,-2,716,716,-14,716,716,-1,716,-1,716,-5,716,-1,716,716,716,-1,716,-1,716,716,716,-1,716,-4,716,-14,716,-12,716,-9,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,716,-4,716,716],
    sm535=[0,-4,0,-4,0,-18,717,-1,717,-3,717,-15,717,-3,717,-14,717,-22,717],
    sm536=[0,-4,0,-4,0,-18,718,-1,718,-3,718,-15,718,-3,718,-14,718,-22,718],
    sm537=[0,-4,0,-4,0,-59,719],
    sm538=[0,-4,0,-4,0,-4,720],
    sm539=[0,-1,2,3,-1,0,-4,0,-19,119,-3,7,721,-25,8,9,-6,120,-12,10,11,-8,18,-18,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm540=[0,-4,0,-4,0,-24,722],
    sm541=[0,-4,0,-4,0,-24,723],
    sm542=[0,724,724,724,-1,0,-4,0,-4,724,724,-7,724,-5,724,724,-2,724,-26,724,724,-6,724,-11,724,724,724,724,-1,724,724,724,724,724,724,724,-1,724,724,724,724,724,724,724,724,-2,724,724,-5,724,724,-2,724,-23,724,-1,724,724,724,724,724,724,-4,724,724,724,724,724,724],
    sm543=[0,-4,0,-4,0,-24,725],
    sm544=[0,726,726,726,-1,0,-4,0,-4,726,726,-7,726,-5,726,726,-2,726,-26,726,726,-6,726,-11,726,726,726,726,-1,726,726,726,726,726,726,726,-1,726,726,726,726,726,726,726,726,-2,726,726,-5,726,726,-2,726,-23,726,-1,726,726,726,726,726,726,-4,726,726,726,726,726,726],
    sm545=[0,-4,0,-4,0,-24,727],
    sm546=[0,728,728,728,-1,0,-4,0,-4,728,728,-7,728,-5,728,728,-2,728,-26,728,728,-6,728,-11,728,728,728,728,-1,728,728,728,728,728,728,728,-1,728,728,728,728,728,728,728,728,-2,728,728,-5,728,728,-2,728,-23,728,-1,728,728,728,728,728,728,-4,728,728,728,728,728,728],
    sm547=[0,-4,0,-4,0,-20,729,-49,624,-18,625],
    sm548=[0,-4,0,-4,0,-20,730,-68,625],
    sm549=[0,-4,0,-4,0,-20,731,-49,731,-18,731],
    sm550=[0,-4,0,-4,0,-20,732,-46,733,-21,732],
    sm551=[0,-4,0,-4,0,-8,734],
    sm552=[0,-2,735,-1,735,-4,735,-3,735,-1,735,-1,735,735,-4,735,-1,735,-124,735,735],
    sm553=[0,-4,0,-4,0,-140,736],
    sm554=[0,-4,0,-4,0,-140,737],
    sm555=[0,-2,636,-1,637,638,639,640,641,0,-3,642,-136,738,738],
    sm556=[0,-2,739,-1,739,739,739,739,739,0,-3,739,-136,739,739],
    sm557=[0,-2,740,-1,740,740,740,740,740,0,-3,740,-136,740,740],
    sm558=[0,-2,741,-1,741,741,741,741,741,0,-3,741,-136,741,741],
    sm559=[0,-4,0,-4,0,-141,742],
    sm560=[0,-4,0,-4,0,-8,743],
    sm561=[0,744,-3,744,-4,744,-3,744,744,744,-7,744,-1,744],
    sm562=[0,-4,0,-4,0,-12,745],
    sm563=[0,-4,0,-4,0,-8,746],
    sm564=[0,-4,747,-4,0,-46,652,-93,653,654],
    sm565=[0,-2,655,-1,0,-4,0,-4,748,-8,748,-5,748,-2,749,656,-1,748,-6,657,-2,658,-22,748],
    sm566=[0,-4,750,-4,0,-46,750,-93,750,750],
    sm567=[0,-2,751,-1,0,-4,0,-4,751,-8,751,-5,751,-2,751,751,-1,751,-6,751,-2,751,-22,751],
    sm568=[0,-4,0,-4,0,-3,752],
    sm569=[0,-4,0,-4,0,-140,653,654],
    sm570=[0,-4,0,-4,0,-18,753,754],
    sm571=[0,-4,0,-4,0,-4,755,-8,755,-4,755,755,-5,755,-32,755],
    sm572=[0,-4,0,-4,0,-4,756,-8,756,-4,756,756,-5,756,-32,756],
    sm573=[0,-2,757,-1,0,-4,0],
    sm574=[0,-4,0,-4,0,-4,756,-8,756,-4,756,756,-5,756,-4,758,-27,756],
    sm575=[0,-4,0,-4,0,-4,759,-8,759,-4,759,759,-4,759,759,-32,759],
    sm576=[0,-4,0,-4,0,-4,760,-8,760,-4,760,760,-4,760,760,-32,760],
    sm577=[0,-4,0,-4,0,-4,760,-8,760,-4,760,760,-4,760,760,-4,761,762,-26,760],
    sm578=[0,-2,660,-1,0,-4,0,-23,656],
    sm579=[0,-1,763,764,-1,0,-4,0,-23,656,-8,765],
    sm580=[0,-4,0,-4,0,-4,766,-8,766,-4,766,766,-4,766,766,-4,766,766,-26,766],
    sm581=[0,-4,0,-4,0,-4,767,-8,767,-4,767,767,-3,768,-1,767,-4,767,-27,767],
    sm582=[0,-2,769,-1,0,-4,0],
    sm583=[0,-4,0,-4,0,-19,770],
    sm584=[0,-4,0,-4,0,-19,771],
    sm585=[0,-4,0,-4,0,-19,772],
    sm586=[0,-2,660,-1,0,-4,661,-23,662],
    sm587=[0,-4,0,-4,0,-19,773,-4,773,-5,774,775],
    sm588=[0,-2,776,-1,0,-4,661,-23,662,-8,663],
    sm589=[0,-4,0,-4,0,-19,777,-4,777,-5,777,777],
    sm590=[0,-4,0,-4,0,-19,778,-4,778,-5,778,778],
    sm591=[0,-4,0,-4,0,-23,779],
    sm592=[0,-4,0,-4,0,-23,768],
    sm593=[0,-2,553,-1,0,-4,0,-4,780,-15,781,-4,447],
    sm594=[0,-4,0,-4,0,-18,782,782],
    sm595=[0,-4,0,-4,0,-20,783],
    sm596=[0,-4,0,-4,0,-13,784,-5,784,784,-4,784,-32,784],
    sm597=[0,-2,785,-1,0,-4,0,-4,785,-15,785,-4,785],
    sm598=[0,-2,786,-1,0,-4,0,-4,787,-15,786,-4,786],
    sm599=[0,-2,788,-1,0,-4,0,-4,788,-15,788,-4,788],
    sm600=[0,-2,789,-1,0,-4,0,-4,789,-15,789,-4,789],
    sm601=[0,-2,553,-1,0,-4,0,-4,790,-15,790,-4,790],
    sm602=[0,-4,791,-4,0,-3,792,-19,793],
    sm603=[0,-4,0,-4,0,-8,794,-9,794,794,-4,794,-25,794,794,794,-5,794],
    sm604=[0,-4,0,-4,0,-8,795,-9,795,795,-4,795,-25,795,795,795,-5,795],
    sm605=[0,-4,0,-4,0,-55,563,564,-1,565,796,-7,567],
    sm606=[0,-4,0,-4,0,-59,797,-7,679],
    sm607=[0,-4,0,-4,0,-8,798,-9,798,798,-4,798,-25,798,798,798,-5,798],
    sm608=[0,-4,0,-4,0,-59,799,-7,679],
    sm609=[0,-4,0,-4,0,-55,800,800,-1,800,800,-7,800],
    sm610=[0,-4,0,-4,0,-59,801,-7,801],
    sm611=[0,-4,0,-4,0,-67,694],
    sm612=[0,-4,0,-4,0,-55,802,802,-1,802,802,-7,802],
    sm613=[0,-4,0,-4,0,-40,803,-10,803,-3,803,803,-1,803,803,803,803,803,-4,803],
    sm614=[0,-2,804,-1,0,-4,0,-53,804],
    sm615=[0,-4,0,-4,0,-55,805,805,-1,805,805,-7,805],
    sm616=[0,-4,0,-4,0,-55,806,806,-1,806,806,-7,806],
    sm617=[0,-4,0,-4,0,-40,807,-10,808,-7,809,810,811,812],
    sm618=[0,-2,682,-1,0,-4,0],
    sm619=[0,-4,0,-4,0,-54,684],
    sm620=[0,-4,0,-4,0,-23,813,-31,814,814,-1,814,814,-7,814],
    sm621=[0,-4,0,-4,0,-59,815,-7,815],
    sm622=[0,-2,693,-1,0,-4,0],
    sm623=[0,-4,0,-4,0,-59,816,-7,694],
    sm624=[0,-4,0,-4,0,-59,817,-7,817],
    sm625=[0,-4,0,-4,0,-14,818],
    sm626=[0,-4,0,-4,0,-8,819],
    sm627=[0,-4,0,-4,0,-8,820],
    sm628=[0,821,-3,821,-4,821,-3,821,821,821,-7,821,-1,821],
    sm629=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,822,-2,7,-26,8,9,-19,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm630=[0,-4,0,-4,0,-20,823],
    sm631=[0,824,824,824,-1,0,-4,0,-4,824,824,-1,824,824,-4,824,-2,824,824,824,824,824,-2,824,824,-14,824,824,-1,824,-1,824,-5,824,824,824,824,824,-1,824,-1,824,824,824,-1,824,-4,824,-2,824,824,824,824,-1,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,-2,824,824,-5,824,824,-2,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,824,-4,824,824,824,824,824,824],
    sm632=[0,-4,0,-4,0,-20,825],
    sm633=[0,826,826,826,-1,0,-4,0,-4,826,826,-1,826,826,-4,826,-2,826,826,826,826,826,-2,826,826,-14,826,826,-1,826,-1,826,-5,826,826,826,826,826,-1,826,-1,826,826,826,-1,826,-4,826,-2,826,826,826,826,-1,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,-2,826,826,-5,826,826,-2,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,-4,826,826,826,826,826,826],
    sm634=[0,827,827,827,-1,0,-4,0,-4,827,827,-1,827,827,-4,827,-2,827,827,827,827,827,-2,827,827,-14,827,827,-1,827,-1,827,-5,827,827,827,827,827,-1,827,-1,827,827,827,-1,827,-4,827,-2,827,827,827,827,-1,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,-2,827,827,-5,827,827,-2,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,-4,827,827,827,827,827,827],
    sm635=[0,-4,0,-4,0,-19,828],
    sm636=[0,-4,0,-4,0,-18,829,-1,829,-3,829,-15,829,-3,829,-14,829,-22,829],
    sm637=[0,830,830,830,-1,0,-4,0,-4,830,830,-7,830,-5,830,830,-2,830,-26,830,830,-6,830,-11,830,830,830,830,-1,830,830,830,830,830,830,830,-1,830,830,830,830,830,830,830,830,-2,830,830,-5,830,830,-2,830,-23,830,-1,830,830,830,830,830,830,-4,830,830,830,830,830,830],
    sm638=[0,831,831,831,-1,0,-4,0,-4,831,831,-7,831,-5,831,831,-2,831,-26,831,831,-6,831,-11,831,831,831,831,-1,831,831,831,831,831,831,831,-1,831,831,831,831,831,831,831,831,-2,831,831,-5,831,831,-2,831,-23,831,-1,831,831,831,831,831,831,-4,831,831,831,831,831,831],
    sm639=[0,-4,0,-4,0,-24,832],
    sm640=[0,833,833,833,-1,0,-4,0,-4,833,833,-7,833,-5,833,833,-2,833,-26,833,833,-6,833,-11,833,833,833,833,-1,833,833,833,833,833,833,833,-1,833,833,833,833,833,833,833,833,-2,833,833,-5,833,833,-2,833,-23,833,-1,833,833,833,833,833,833,-4,833,833,833,833,833,833],
    sm641=[0,834,834,834,-1,0,-4,0,-4,834,834,-7,834,-5,834,834,-2,834,-26,834,834,-6,834,-11,834,834,834,834,-1,834,834,834,834,834,834,834,-1,834,834,834,834,834,834,834,834,-2,834,834,-5,834,834,-2,834,-23,834,-1,834,834,834,834,834,834,-4,834,834,834,834,834,834],
    sm642=[0,835,835,835,-1,0,-4,0,-4,835,835,-7,835,-5,835,835,-2,835,-26,835,835,-6,835,-11,835,835,835,835,-1,835,835,835,835,835,835,835,-1,835,835,835,835,835,835,835,835,-2,835,835,-5,835,835,-2,835,-23,835,-1,835,835,835,835,835,835,-4,835,835,835,835,835,835],
    sm643=[0,836,836,836,-1,0,-4,0,-4,836,836,-7,836,-5,836,836,-2,836,-26,836,836,-6,836,-11,836,836,836,836,-1,836,836,836,836,836,836,836,-1,836,836,836,836,836,836,836,836,-2,836,836,-5,836,836,-2,836,-23,836,-1,836,836,836,836,836,836,-4,836,836,836,836,836,836],
    sm644=[0,837,837,837,-1,0,-4,0,-4,837,837,-7,837,-5,837,837,-2,837,-26,837,837,-6,837,-11,837,837,837,837,-1,837,837,837,837,837,837,837,-1,837,837,837,837,837,837,837,837,-2,837,837,-5,837,837,-2,837,-23,837,-1,837,837,837,837,837,837,-4,837,837,837,837,837,837],
    sm645=[0,838,838,838,-1,0,-4,0,-4,838,838,-7,838,-5,838,838,-2,838,-26,838,838,-6,838,-11,838,838,838,838,-1,838,838,838,838,838,838,838,-1,838,838,838,838,838,838,838,838,-2,838,838,-5,838,838,-2,838,-23,838,-1,838,838,838,838,838,838,-4,838,838,838,838,838,838],
    sm646=[0,839,839,839,-1,0,-4,0,-4,839,839,-7,839,-5,839,839,-2,839,-26,839,839,-6,839,-11,839,839,839,839,-1,839,839,839,839,839,839,839,-1,839,839,839,839,839,839,839,839,-2,839,839,-5,839,839,-2,839,-23,839,-1,839,839,839,839,839,839,-4,839,839,839,839,839,839],
    sm647=[0,-4,0,-4,0,-20,840,-68,625],
    sm648=[0,841,841,841,-1,0,-4,0,-4,841,841,-7,841,-5,841,841,-2,841,-26,841,841,-6,841,-11,841,841,841,841,-1,841,841,841,841,841,841,841,-1,841,841,841,841,841,841,841,841,-2,841,841,-5,841,841,-2,841,-23,841,-1,841,841,841,841,841,841,-4,841,841,841,841,841,841],
    sm649=[0,-4,0,-4,0,-20,842,-49,842,-18,842],
    sm650=[0,-4,0,-4,0,-20,843,-68,625],
    sm651=[0,-4,0,-4,0,-67,844],
    sm652=[0,845,845,845,-1,0,-4,0,-4,845,845,-7,845,-5,845,845,-2,845,-26,845,845,-6,845,-11,845,845,845,845,-1,845,845,845,845,845,845,845,-1,845,845,845,845,845,845,845,845,-1,845,845,845,-5,845,845,-2,845,-23,845,-1,845,845,845,845,845,845,-4,845,845,845,845,845,845],
    sm653=[0,-4,0,-4,0,-8,846],
    sm654=[0,847,-3,847,-4,847,-3,847,847,847,-7,847,-1,847],
    sm655=[0,-4,0,-4,0,-16,848],
    sm656=[0,-2,849,-1,0,-4,0,-7,849,849,-131,849,849],
    sm657=[0,-2,850,-1,0,-4,0,-7,850,850,-131,850,850],
    sm658=[0,-2,851,-1,851,851,851,851,851,0,-3,851,-136,851,851],
    sm659=[0,852,-3,852,-4,852,-3,852,852,852,-7,852,-1,852],
    sm660=[0,-4,0,-4,0,-8,853],
    sm661=[0,-2,655,-1,0,-4,0,-4,854,-8,854,-5,854,-2,749,656,-1,854,-6,657,-2,658,-22,854],
    sm662=[0,-4,855,-4,0,-46,855,-93,855,855],
    sm663=[0,-2,655,-1,0,-4,0,-4,854,-8,854,-5,854,-3,656,-1,854,-6,657,-2,658,-22,854],
    sm664=[0,-4,0,-4,0,-4,854,-8,854,-4,753,854,-5,854,-32,854],
    sm665=[0,-4,0,-4,0,-23,856],
    sm666=[0,-4,0,-4,0,-3,857,-136,858],
    sm667=[0,-4,0,-4,0,-3,859,-136,859,859],
    sm668=[0,-4,0,-4,0,-3,857,-137,860],
    sm669=[0,-2,861,-1,0,-4,0,-4,861,-8,861,-5,861,-2,861,861,-1,861,-6,861,-2,861,-22,861],
    sm670=[0,-2,862,-1,0,-4,0,-4,862,-8,862,-5,862,-2,862,862,-1,862,-6,862,-2,862,-22,862],
    sm671=[0,-4,0,-4,0,-19,446,863,-37,448],
    sm672=[0,-4,0,-4,0,-4,864,-8,864,-4,864,864,-5,864,-4,758,-27,864],
    sm673=[0,-4,0,-4,0,-4,767,-8,767,-4,767,767,-5,767,-4,767,-27,767],
    sm674=[0,-4,0,-4,0,-4,864,-8,864,-4,864,864,-5,864,-32,864],
    sm675=[0,-2,660,-1,0,-4,0,-23,656,-8,765],
    sm676=[0,-4,0,-4,0,-4,865,-8,865,-4,865,865,-4,865,865,-4,761,-27,865],
    sm677=[0,-4,0,-4,0,-4,866,-8,866,-4,866,866,-4,866,866,-5,762,-26,866],
    sm678=[0,-4,0,-4,0,-4,867,-8,867,-4,867,867,-4,867,867,-4,867,-27,867],
    sm679=[0,-4,0,-4,0,-4,868,-8,868,-4,868,868,-4,868,868,-5,868,-26,868],
    sm680=[0,-4,0,-4,0,-4,869,-8,869,-4,869,869,-4,869,869,-32,869],
    sm681=[0,-4,0,-4,0,-24,870],
    sm682=[0,-4,0,-4,0,-24,871],
    sm683=[0,-4,872,-4,0,-3,873,-1,874,-2,874,-14,768,875,-14,874,874,-26,874],
    sm684=[0,-4,0,-4,0,-24,876],
    sm685=[0,-4,0,-4,0,-5,877,-2,878,-30,879,880,-26,881],
    sm686=[0,-4,0,-4,0,-5,882,-2,883,-30,884,885],
    sm687=[0,-4,0,-4,0,-5,886,-1,887,886,-15,886,-14,886,886,-2,888,889,890],
    sm688=[0,-4,0,-4,0,-5,886,-2,886,-15,886,-14,886,886],
    sm689=[0,-4,891,-4,0,-3,892,-20,893],
    sm690=[0,-1,894,-2,0,-4,0,-28,895,896],
    sm691=[0,-4,0,-4,0,-19,897,-4,897],
    sm692=[0,-4,0,-4,0,-19,897,-4,897,-5,774],
    sm693=[0,-4,0,-4,0,-19,897,-4,897,-6,775],
    sm694=[0,-4,0,-4,0,-19,898,-4,898,-5,898],
    sm695=[0,-4,0,-4,0,-19,899,-4,899,-6,899],
    sm696=[0,-4,0,-4,0,-24,900],
    sm697=[0,-4,0,-4,0,-24,901],
    sm698=[0,-4,872,-4,0,-3,873,-19,768,875,-42,671],
    sm699=[0,-4,0,-4,0,-20,902],
    sm700=[0,-4,0,-4,0,-13,903,-5,903,903,-4,903,-32,903],
    sm701=[0,-2,553,-1,0,-4,0,-4,904,-15,904,-4,904],
    sm702=[0,-2,905,-1,0,-4,0,-4,905,-15,905,-4,905],
    sm703=[0,-2,906,-1,791,-4,0,-3,792,906,-15,906,-2,793,906,906,-107,907],
    sm704=[0,-2,908,-1,791,-4,0,-3,792,908,-15,908,-2,908,908,908,-107,908],
    sm705=[0,-2,909,-1,909,-4,0,-3,909,909,-15,909,-2,909,909,909,-107,909],
    sm706=[0,-2,910,-1,910,-4,0,-3,910,910,-15,910,-2,910,910,910,-107,910],
    sm707=[0,-4,0,-4,0,-59,911,-7,679],
    sm708=[0,-4,0,-4,0,-8,912,-9,912,912,-4,912,-25,912,912,912,-5,912],
    sm709=[0,-4,0,-4,0,-55,913,913,-1,913,913,-7,913],
    sm710=[0,-2,914,915,0,-4,0],
    sm711=[0,-4,0,-4,0,-40,916],
    sm712=[0,-2,917,917,0,-4,0],
    sm713=[0,-4,0,-4,0,-55,918,918,-1,918,918,-7,918],
    sm714=[0,-4,0,-4,0,-59,919,-7,919],
    sm715=[0,-4,0,-4,0,-8,920],
    sm716=[0,921,-3,921,-4,921,-3,921,921,921,-7,921,-1,921],
    sm717=[0,-4,0,-4,0,-20,922],
    sm718=[0,923,923,923,-1,0,-4,0,-4,923,923,-1,923,923,-4,923,-2,923,923,923,923,923,-2,923,923,-14,923,923,-1,923,-1,923,-5,923,923,923,923,923,-1,923,-1,923,923,923,-1,923,-4,923,-2,923,923,923,923,-1,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,-2,923,923,-5,923,923,-2,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,923,-4,923,923,923,923,923,923],
    sm719=[0,924,924,924,-1,0,-4,0,-4,924,924,-1,924,924,-4,924,-2,924,924,924,924,924,-2,924,924,-14,924,924,-1,924,-1,924,-5,924,924,924,924,924,-1,924,-1,924,924,924,-1,924,-4,924,-2,924,924,924,924,-1,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,-2,924,924,-5,924,924,-2,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,924,-4,924,924,924,924,924,924],
    sm720=[0,925,925,925,-1,0,-4,0,-4,925,925,-1,925,925,-4,925,-2,925,925,925,925,925,-2,925,925,-14,925,925,-1,925,-1,925,-5,925,925,925,925,925,-1,925,-1,925,925,925,-1,925,-4,925,-2,925,925,925,925,-1,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,-2,925,925,-5,925,925,-2,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,-4,925,925,925,925,925,925],
    sm721=[0,-4,0,-4,0,-20,926],
    sm722=[0,-4,0,-4,0,-20,927],
    sm723=[0,928,928,928,-1,0,-4,0,-4,928,928,-7,928,-5,928,928,-2,928,-26,928,928,-6,928,-11,928,928,928,928,-1,928,928,928,928,928,928,928,-1,928,928,928,928,928,928,928,928,-2,928,928,-5,928,928,-2,928,-23,928,-1,928,928,928,928,928,928,-4,928,928,928,928,928,928],
    sm724=[0,929,929,929,-1,0,-4,0,-4,929,929,-7,929,-5,929,929,-2,929,-26,929,929,-6,929,-11,929,929,929,929,-1,929,929,929,929,929,929,929,-1,929,929,929,929,929,929,929,929,-2,929,929,-5,929,929,-2,929,-23,929,-1,929,929,929,929,929,929,-4,929,929,929,929,929,929],
    sm725=[0,930,930,930,-1,0,-4,0,-4,930,930,-7,930,-5,930,930,-2,930,-26,930,930,-6,930,-11,930,930,930,930,-1,930,930,930,930,930,930,930,-1,930,930,930,930,930,930,930,930,-2,930,930,-5,930,930,-2,930,-23,930,-1,930,930,930,930,930,930,-4,930,930,930,930,930,930],
    sm726=[0,931,931,931,-1,0,-4,0,-4,931,931,-7,931,-5,931,931,-2,931,-26,931,931,-6,931,-11,931,931,931,931,-1,931,931,931,931,931,931,931,-1,931,931,931,931,931,931,931,931,-2,931,931,-5,931,931,-2,931,-23,931,-1,931,931,931,931,931,931,-4,931,931,931,931,931,931],
    sm727=[0,-4,0,-4,0,-20,932],
    sm728=[0,933,933,933,-1,0,-4,0,-4,933,933,-7,933,-5,933,933,-2,933,-26,933,933,-6,933,-11,933,933,933,933,-1,933,933,933,933,933,933,933,-1,933,933,933,933,933,933,933,933,-2,933,933,-5,933,933,-2,933,-23,933,-1,933,933,933,933,933,933,-4,933,933,933,933,933,933],
    sm729=[0,-1,2,3,-1,0,-4,0,-4,4,51,-13,6,934,-2,7,-26,8,9,-18,934,10,11,12,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,934,25,-2,26,27,-5,28,29,-2,30,-23,31,-1,32,33,34,35,36,37,-4,38,39,40,41,42,43],
    sm730=[0,-4,0,-4,0,-20,935,-68,935],
    sm731=[0,936,-3,936,-4,936,-3,936,936,936,-7,936,-1,936],
    sm732=[0,-2,937,-1,937,-4,937,-3,937,-1,937,-1,937,937,-4,937,-1,937,-124,937,937],
    sm733=[0,-2,655,-1,0,-4,0,-4,938,-8,938,-5,938,-3,656,-1,938,-6,657,-2,658,-22,938],
    sm734=[0,-4,0,-4,0,-4,938,-8,938,-4,753,938,-5,938,-32,938],
    sm735=[0,-2,939,-1,0,-4,661,-23,662,-8,663],
    sm736=[0,-2,940,-1,0,-4,0,-4,940,-8,940,-5,940,-2,940,940,-1,940,-6,940,-2,940,-22,940],
    sm737=[0,-4,0,-4,0,-3,941,-136,941,941],
    sm738=[0,-4,0,-4,0,-20,942],
    sm739=[0,-4,0,-4,0,-19,446,943,-37,448],
    sm740=[0,-4,0,-4,0,-19,944,944,-37,944],
    sm741=[0,-4,0,-4,0,-4,945,-8,945,-4,945,945,-5,945,-32,945],
    sm742=[0,-4,0,-4,0,-4,946,-8,946,-4,946,946,-5,946,-32,946],
    sm743=[0,-4,0,-4,0,-4,947,-8,947,-4,947,947,-5,947,-32,947],
    sm744=[0,-4,0,-4,0,-4,760,-8,760,-4,760,760,-5,760,-4,761,-27,760],
    sm745=[0,-4,0,-4,0,-4,948,-8,948,-4,948,948,-4,948,948,-4,948,-27,948],
    sm746=[0,-4,0,-4,0,-4,949,-8,949,-4,949,949,-4,949,949,-5,949,-26,949],
    sm747=[0,-4,0,-4,0,-4,950,-8,950,-4,950,950,-4,950,950,-4,950,-27,950],
    sm748=[0,-4,0,-4,0,-4,951,-8,951,-4,951,951,-4,951,951,-5,951,-26,951],
    sm749=[0,-4,0,-4,0,-4,952,-8,952,-4,952,952,-4,952,952,-4,952,952,-26,952],
    sm750=[0,-4,0,-4,0,-4,953,-8,953,-4,953,953,-4,953,953,-4,953,953,-26,953],
    sm751=[0,-4,872,-4,0,-3,873,-20,954],
    sm752=[0,-4,0,-4,0,-4,955,-8,955,-4,955,955,-4,955,955,-4,955,955,-26,955],
    sm753=[0,-4,956,-4,0,-3,956,-20,956],
    sm754=[0,-4,957,-4,0,-3,957,-20,957],
    sm755=[0,-1,763,958,-1,0,-4,0],
    sm756=[0,-1,959,959,-1,0,-4,0],
    sm757=[0,-1,959,959,-1,0,-4,0,-40,960],
    sm758=[0,-2,958,-1,0,-4,0],
    sm759=[0,-2,961,-1,0,-4,0],
    sm760=[0,-2,962,-1,0,-4,0],
    sm761=[0,-2,963,-1,0,-4,0],
    sm762=[0,-2,963,-1,0,-4,0,-40,964],
    sm763=[0,-4,0,-4,0,-5,965,-2,965,-15,965,-14,965,965],
    sm764=[0,-1,966,-2,0,-4,0],
    sm765=[0,-4,0,-4,0,-5,967,-2,967,-15,967,-14,967,967],
    sm766=[0,-4,891,-4,0,-3,892,-20,968],
    sm767=[0,-4,969,-4,0,-3,969,-20,969],
    sm768=[0,-4,970,-4,0,-3,970,-20,970],
    sm769=[0,-1,894,-2,0,-4,0,-20,971,-7,895,896],
    sm770=[0,-1,972,-2,0,-4,0,-20,972,-7,972,972],
    sm771=[0,-4,0,-4,0,-18,973,974],
    sm772=[0,-4,0,-4,0,-18,975,975],
    sm773=[0,-4,0,-4,0,-18,976,976],
    sm774=[0,-4,0,-4,0,-42,977],
    sm775=[0,-4,0,-4,0,-20,978],
    sm776=[0,-4,0,-4,0,-19,979,-4,979,-5,979],
    sm777=[0,-4,0,-4,0,-19,980,-4,980,-6,980],
    sm778=[0,-4,0,-4,0,-19,981,-4,981,-5,981],
    sm779=[0,-4,0,-4,0,-19,982,-4,982,-6,982],
    sm780=[0,-4,0,-4,0,-19,983,-4,983,-5,983,983],
    sm781=[0,-4,0,-4,0,-19,984,-4,984,-5,984,984],
    sm782=[0,-4,0,-4,0,-24,985],
    sm783=[0,-4,0,-4,0,-13,986,-5,986,986,-4,986,-32,986],
    sm784=[0,-2,987,-1,0,-4,0,-4,987,-15,987,-4,987],
    sm785=[0,-2,988,-1,0,-4,0,-4,988,-15,988,-3,988,988],
    sm786=[0,-2,989,-1,791,-4,0,-3,792,989,-15,989,-2,793,989,989,-107,989],
    sm787=[0,-4,0,-4,0,-66,990],
    sm788=[0,-2,991,-1,991,-4,0,-3,991,991,-15,991,-2,991,991,991,-107,991],
    sm789=[0,-4,791,-4,0,-3,792,-19,793,992],
    sm790=[0,-4,0,-4,0,-8,993,-9,993,993,-4,993,-25,993,993,993,-5,993],
    sm791=[0,-4,0,-4,0,-59,994,-3,995,996],
    sm792=[0,-4,0,-4,0,-59,997,-3,997,997],
    sm793=[0,-2,998,998,0,-4,0],
    sm794=[0,-4,0,-4,0,-24,999],
    sm795=[0,1000,1000,1000,-1,0,-4,0,-4,1000,1000,-1,1000,1000,-4,1000,-2,1000,1000,1000,1000,1000,-2,1000,1000,-14,1000,1000,-1,1000,-1,1000,-5,1000,1000,1000,1000,1000,-1,1000,-1,1000,1000,1000,-1,1000,-4,1000,-2,1000,1000,1000,1000,-1,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,-2,1000,1000,-5,1000,1000,-2,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,-4,1000,1000,1000,1000,1000,1000],
    sm796=[0,-1,1001,1001,-1,0,-4,0,-4,1001,-13,1001,-1,1001,-37,1001,-38,1001,1001,1001,-40,1001,1001,-3,1001],
    sm797=[0,-1,1002,1002,-1,0,-4,0,-4,1002,-13,1002,-1,1002,-37,1002,-38,1002,1002,1002,-40,1002,1002,-3,1002],
    sm798=[0,-4,0,-4,0,-20,1003],
    sm799=[0,1004,1004,1004,-1,0,-4,0,-4,1004,1004,-7,1004,-5,1004,1004,-2,1004,-26,1004,1004,-6,1004,-11,1004,1004,1004,1004,-1,1004,1004,1004,1004,1004,1004,1004,-1,1004,1004,1004,1004,1004,1004,1004,1004,-2,1004,1004,-5,1004,1004,-2,1004,-23,1004,-1,1004,1004,1004,1004,1004,1004,-4,1004,1004,1004,1004,1004,1004],
    sm800=[0,1005,1005,1005,-1,0,-4,0,-4,1005,1005,-7,1005,-5,1005,1005,-2,1005,-26,1005,1005,-6,1005,-11,1005,1005,1005,1005,-1,1005,1005,1005,1005,1005,1005,1005,-1,1005,1005,1005,1005,1005,1005,1005,1005,-2,1005,1005,-5,1005,1005,-2,1005,-23,1005,-1,1005,1005,1005,1005,1005,1005,-4,1005,1005,1005,1005,1005,1005],
    sm801=[0,-4,0,-4,0,-20,1006,-49,1006,-18,1006],
    sm802=[0,-4,0,-4,0,-4,1007,-8,1007,-4,753,1007,-5,1007,-32,1007],
    sm803=[0,-4,0,-4,0,-24,1008],
    sm804=[0,-4,0,-4,0,-24,1009],
    sm805=[0,-4,0,-4,0,-23,768,-43,671],
    sm806=[0,-4,0,-4,0,-4,1010],
    sm807=[0,-4,0,-4,0,-19,1011,1011,-37,1011],
    sm808=[0,-4,0,-4,0,-4,1012,-8,1012,-4,1012,1012,-4,1012,1012,-4,1012,1012,-26,1012],
    sm809=[0,-4,1013,-4,0,-3,1013,-20,1013],
    sm810=[0,-4,0,-4,0,-24,1014],
    sm811=[0,-4,0,-4,0,-24,886],
    sm812=[0,-4,0,-4,0,-24,874],
    sm813=[0,-4,0,-4,0,-24,1015],
    sm814=[0,-1,1016,1016,-1,0,-4,0],
    sm815=[0,-4,0,-4,0,-8,1017],
    sm816=[0,-4,0,-4,0,-5,1018,-33,1019],
    sm817=[0,-2,1020,-1,0,-4,0],
    sm818=[0,-4,0,-4,0,-5,1021,-2,1021,-15,1021,-14,1021,1021],
    sm819=[0,-4,1022,-4,0,-3,1022,-20,1022],
    sm820=[0,-4,0,-4,0,-4,1023],
    sm821=[0,-1,1024,-2,0,-4,0,-20,1024,-7,1024,1024],
    sm822=[0,-4,0,-4,0,-18,1025,1025],
    sm823=[0,-4,0,-4,0,-4,1026],
    sm824=[0,-4,0,-4,0,-19,1027,-4,1027,-5,1027,1027],
    sm825=[0,-2,1028,-1,0,-4,0,-4,1028,-15,1028,-3,1028,1028],
    sm826=[0,-2,1029,-1,1029,-4,0,-3,1029,1029,-15,1029,-2,1029,1029,1029,-107,1029],
    sm827=[0,-4,0,-4,0,-59,1030],
    sm828=[0,-4,0,-4,0,-55,1031,1031,-1,1031,1031,-7,1031],
    sm829=[0,-4,0,-4,0,-59,1032],
    sm830=[0,-4,0,-4,0,-55,1033,1033,-1,1033,1033,-7,1033],
    sm831=[0,-1,1034,1034,-1,0,-4,0,-4,1034,-13,1034,-1,1034,-37,1034,-38,1034,1034,1034,-40,1034,1034,-3,1034],
    sm832=[0,-2,1035,-1,0,-4,0,-4,1035,-8,1035,-5,1035,-3,1035,-1,1035,-6,1035,-2,1035,-22,1035],
    sm833=[0,-1,1036,1036,-1,0,-4,0,-40,1037],
    sm834=[0,-1,1038,1038,-1,0,-4,0],
    sm835=[0,-2,553,-1,0,-4,0,-4,1039,-15,1040,-4,447],
    sm836=[0,-4,0,-4,0,-18,1041,1041],
    sm837=[0,-4,0,-4,0,-55,1042,1042,-1,1042,1042,-7,1042],
    sm838=[0,-4,0,-4,0,-24,1043],
    sm839=[0,-1,1044,1044,-1,0,-4,0],
    sm840=[0,-4,0,-4,0,-20,1045],
    sm841=[0,-1,1046,-2,0,-4,0,-20,1046,-7,1046,1046],
    sm842=[0,-4,0,-4,0,-20,1047],
    sm843=[0,-1,1048,-2,0,-4,0,-20,1048,-7,1048,1048],

        // Symbol Lookup map
        lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[";",14],["<",15],["import",16],["/",17],[">",18],["\"",150],["f",20],["filter",21],["style",22],["</",23],["script",24],["((",25],["))",26],[")(",27],[",",28],["{",29],["}",30],[null,9],["supports",32],["(",33],[")",34],["@",35],["keyframes",36],["id",37],["from",38],["to",39],["and",40],["or",41],["not",42],["media",44],["only",45],[":",77],["<=",49],["=",50],["%",52],["px",53],["in",54],["rad",55],["url",56],["'",151],["[",68],["]",69],["+",60],["~",61],["||",62],["*",63],["|",64],["#",65],[".",66],["^=",70],["$=",71],["*=",72],["i",73],["s",74],["!",143],["important",76],["as",78],["export",79],["default",80],["function",81],["class",82],["let",83],["async",84],["if",85],["else",86],["var",87],["do",88],["while",89],["for",90],["await",91],["of",92],["continue",93],["break",94],["return",95],["throw",96],["with",97],["switch",98],["case",99],["try",100],["catch",101],["finally",102],["debugger",103],["const",104],["=>",105],["extends",106],["static",107],["get",108],["set",109],["new",110],["super",111],["target",112],["...",113],["this",114],["/=",115],["%=",116],["+=",117],["-=",118],["<<=",119],[">>=",120],[">>>=",121],["&=",122],["|=",123],["**=",124],["?",125],["&&",126],["^",127],["&",128],["==",129],["!=",130],["===",131],["!==",132],[">=",133],["instanceof",134],["<<",135],[">>",136],[">>>",137],["-",138],["**",139],["delete",140],["void",141],["typeof",142],["++",144],["--",145],["null",152],["true",153],["false",154],["$",155],["input",156],["area",157],["base",158],["br",159],["col",160],["command",161],["embed",162],["hr",163],["img",164],["keygen",165],["link",166],["meta",167],["param",168],["source",169],["track",170],["wbr",171]]),

        //Reverse Symbol Lookup map
        rlu = new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[11,264],[13,200],[14,";"],[15,"<"],[16,"import"],[17,"/"],[18,">"],[150,"\""],[20,"f"],[21,"filter"],[22,"style"],[23,"</"],[24,"script"],[25,"(("],[26,"))"],[27,")("],[28,","],[29,"{"],[30,"}"],[9,null],[32,"supports"],[33,"("],[34,")"],[35,"@"],[36,"keyframes"],[37,"id"],[38,"from"],[39,"to"],[40,"and"],[41,"or"],[42,"not"],[44,"media"],[45,"only"],[77,":"],[49,"<="],[50,"="],[52,"%"],[53,"px"],[54,"in"],[55,"rad"],[56,"url"],[151,"'"],[68,"["],[69,"]"],[60,"+"],[61,"~"],[62,"||"],[63,"*"],[64,"|"],[65,"#"],[66,"."],[70,"^="],[71,"$="],[72,"*="],[73,"i"],[74,"s"],[143,"!"],[76,"important"],[78,"as"],[79,"export"],[80,"default"],[81,"function"],[82,"class"],[83,"let"],[84,"async"],[85,"if"],[86,"else"],[87,"var"],[88,"do"],[89,"while"],[90,"for"],[91,"await"],[92,"of"],[93,"continue"],[94,"break"],[95,"return"],[96,"throw"],[97,"with"],[98,"switch"],[99,"case"],[100,"try"],[101,"catch"],[102,"finally"],[103,"debugger"],[104,"const"],[105,"=>"],[106,"extends"],[107,"static"],[108,"get"],[109,"set"],[110,"new"],[111,"super"],[112,"target"],[113,"..."],[114,"this"],[115,"/="],[116,"%="],[117,"+="],[118,"-="],[119,"<<="],[120,">>="],[121,">>>="],[122,"&="],[123,"|="],[124,"**="],[125,"?"],[126,"&&"],[127,"^"],[128,"&"],[129,"=="],[130,"!="],[131,"==="],[132,"!=="],[133,">="],[134,"instanceof"],[135,"<<"],[136,">>"],[137,">>>"],[138,"-"],[139,"**"],[140,"delete"],[141,"void"],[142,"typeof"],[144,"++"],[145,"--"],[152,"null"],[153,"true"],[154,"false"],[155,"$"],[156,"input"],[157,"area"],[158,"base"],[159,"br"],[160,"col"],[161,"command"],[162,"embed"],[163,"hr"],[164,"img"],[165,"keygen"],[166,"link"],[167,"meta"],[168,"param"],[169,"source"],[170,"track"],[171,"wbr"]]),

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
    sm10,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
    sm11,
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
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm35,
    sm34,
    sm34,
    sm36,
    sm37,
    sm38,
    sm39,
    sm40,
    sm40,
    sm40,
    sm41,
    sm42,
    sm42,
    sm42,
    sm42,
    sm43,
    sm44,
    sm45,
    sm46,
    sm47,
    sm48,
    sm49,
    sm49,
    sm49,
    sm49,
    sm50,
    sm50,
    sm51,
    sm52,
    sm53,
    sm54,
    sm55,
    sm56,
    sm57,
    sm58,
    sm58,
    sm34,
    sm59,
    sm60,
    sm61,
    sm62,
    sm63,
    sm64,
    sm65,
    sm65,
    sm66,
    sm67,
    sm68,
    sm69,
    sm70,
    sm71,
    sm72,
    sm73,
    sm34,
    sm74,
    sm75,
    sm76,
    sm77,
    sm78,
    sm79,
    sm79,
    sm79,
    sm80,
    sm81,
    sm82,
    sm62,
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
    sm34,
    sm34,
    sm34,
    sm94,
    sm95,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm96,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm34,
    sm97,
    sm35,
    sm98,
    sm99,
    sm100,
    sm42,
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
    sm34,
    sm116,
    sm34,
    sm114,
    sm117,
    sm118,
    sm38,
    sm119,
    sm120,
    sm121,
    sm122,
    sm123,
    sm124,
    sm125,
    sm125,
    sm125,
    sm125,
    sm125,
    sm125,
    sm125,
    sm126,
    sm123,
    sm127,
    sm128,
    sm128,
    sm128,
    sm128,
    sm128,
    sm128,
    sm128,
    sm129,
    sm130,
    sm62,
    sm131,
    sm114,
    sm34,
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
    sm142,
    sm143,
    sm144,
    sm34,
    sm145,
    sm34,
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
    sm34,
    sm155,
    sm156,
    sm157,
    sm158,
    sm159,
    sm160,
    sm161,
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
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm167,
    sm168,
    sm169,
    sm169,
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
    sm140,
    sm140,
    sm179,
    sm180,
    sm167,
    sm181,
    sm182,
    sm183,
    sm183,
    sm184,
    sm185,
    sm186,
    sm187,
    sm188,
    sm189,
    sm190,
    sm190,
    sm190,
    sm190,
    sm191,
    sm191,
    sm191,
    sm191,
    sm192,
    sm193,
    sm194,
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
    sm205,
    sm206,
    sm206,
    sm34,
    sm207,
    sm208,
    sm209,
    sm210,
    sm211,
    sm212,
    sm213,
    sm212,
    sm34,
    sm214,
    sm215,
    sm216,
    sm216,
    sm217,
    sm217,
    sm218,
    sm218,
    sm34,
    sm219,
    sm220,
    sm221,
    sm222,
    sm223,
    sm224,
    sm225,
    sm226,
    sm34,
    sm227,
    sm228,
    sm229,
    sm230,
    sm231,
    sm232,
    sm231,
    sm233,
    sm234,
    sm235,
    sm236,
    sm237,
    sm238,
    sm239,
    sm240,
    sm241,
    sm14,
    sm242,
    sm243,
    sm243,
    sm244,
    sm62,
    sm245,
    sm34,
    sm245,
    sm246,
    sm247,
    sm248,
    sm114,
    sm249,
    sm250,
    sm251,
    sm252,
    sm253,
    sm254,
    sm255,
    sm256,
    sm62,
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
    sm62,
    sm270,
    sm62,
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
    sm74,
    sm282,
    sm283,
    sm284,
    sm285,
    sm286,
    sm287,
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
    sm299,
    sm300,
    sm301,
    sm302,
    sm303,
    sm304,
    sm305,
    sm306,
    sm307,
    sm306,
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
    sm319,
    sm62,
    sm320,
    sm320,
    sm34,
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
    sm330,
    sm331,
    sm332,
    sm34,
    sm333,
    sm334,
    sm335,
    sm336,
    sm337,
    sm338,
    sm339,
    sm340,
    sm341,
    sm342,
    sm343,
    sm344,
    sm62,
    sm345,
    sm345,
    sm346,
    sm347,
    sm348,
    sm349,
    sm350,
    sm351,
    sm351,
    sm352,
    sm353,
    sm62,
    sm354,
    sm355,
    sm356,
    sm357,
    sm356,
    sm356,
    sm358,
    sm359,
    sm359,
    sm360,
    sm66,
    sm34,
    sm66,
    sm361,
    sm362,
    sm363,
    sm34,
    sm364,
    sm365,
    sm34,
    sm366,
    sm367,
    sm368,
    sm369,
    sm370,
    sm369,
    sm369,
    sm371,
    sm372,
    sm62,
    sm372,
    sm62,
    sm373,
    sm66,
    sm374,
    sm62,
    sm375,
    sm283,
    sm376,
    sm377,
    sm378,
    sm379,
    sm379,
    sm380,
    sm381,
    sm382,
    sm383,
    sm383,
    sm34,
    sm384,
    sm385,
    sm386,
    sm387,
    sm388,
    sm389,
    sm390,
    sm384,
    sm294,
    sm391,
    sm392,
    sm393,
    sm393,
    sm394,
    sm395,
    sm396,
    sm397,
    sm397,
    sm398,
    sm399,
    sm400,
    sm401,
    sm402,
    sm403,
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
    sm416,
    sm417,
    sm418,
    sm419,
    sm420,
    sm421,
    sm422,
    sm423,
    sm424,
    sm424,
    sm425,
    sm426,
    sm427,
    sm428,
    sm429,
    sm430,
    sm431,
    sm62,
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
    sm442,
    sm442,
    sm443,
    sm444,
    sm445,
    sm446,
    sm447,
    sm448,
    sm449,
    sm450,
    sm451,
    sm452,
    sm66,
    sm453,
    sm454,
    sm455,
    sm66,
    sm456,
    sm34,
    sm457,
    sm458,
    sm458,
    sm459,
    sm460,
    sm461,
    sm462,
    sm463,
    sm463,
    sm464,
    sm465,
    sm466,
    sm467,
    sm467,
    sm468,
    sm469,
    sm470,
    sm470,
    sm470,
    sm471,
    sm472,
    sm473,
    sm473,
    sm390,
    sm465,
    sm474,
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
    sm399,
    sm486,
    sm487,
    sm488,
    sm489,
    sm490,
    sm491,
    sm492,
    sm493,
    sm494,
    sm486,
    sm495,
    sm496,
    sm496,
    sm496,
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
    sm506,
    sm507,
    sm508,
    sm508,
    sm508,
    sm508,
    sm509,
    sm510,
    sm511,
    sm512,
    sm513,
    sm514,
    sm481,
    sm481,
    sm481,
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
    sm532,
    sm533,
    sm534,
    sm534,
    sm535,
    sm536,
    sm537,
    sm536,
    sm66,
    sm538,
    sm539,
    sm540,
    sm66,
    sm541,
    sm66,
    sm66,
    sm542,
    sm66,
    sm543,
    sm66,
    sm66,
    sm544,
    sm66,
    sm545,
    sm546,
    sm547,
    sm548,
    sm549,
    sm34,
    sm550,
    sm74,
    sm466,
    sm551,
    sm34,
    sm552,
    sm553,
    sm554,
    sm555,
    sm556,
    sm557,
    sm558,
    sm558,
    sm558,
    sm558,
    sm558,
    sm558,
    sm558,
    sm559,
    sm560,
    sm561,
    sm562,
    sm563,
    sm564,
    sm565,
    sm566,
    sm567,
    sm567,
    sm568,
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
    sm607,
    sm609,
    sm607,
    sm610,
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
    sm634,
    sm14,
    sm14,
    sm635,
    sm636,
    sm637,
    sm638,
    sm639,
    sm66,
    sm66,
    sm640,
    sm66,
    sm641,
    sm642,
    sm643,
    sm66,
    sm644,
    sm645,
    sm646,
    sm66,
    sm647,
    sm648,
    sm649,
    sm650,
    sm648,
    sm651,
    sm14,
    sm652,
    sm653,
    sm654,
    sm655,
    sm656,
    sm657,
    sm658,
    sm657,
    sm659,
    sm660,
    sm654,
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
    sm483,
    sm672,
    sm673,
    sm674,
    sm675,
    sm676,
    sm677,
    sm678,
    sm578,
    sm679,
    sm578,
    sm680,
    sm681,
    sm682,
    sm683,
    sm578,
    sm684,
    sm684,
    sm684,
    sm685,
    sm686,
    sm687,
    sm688,
    sm688,
    sm689,
    sm690,
    sm671,
    sm691,
    sm692,
    sm693,
    sm694,
    sm586,
    sm695,
    sm586,
    sm696,
    sm697,
    sm698,
    sm486,
    sm699,
    sm700,
    sm700,
    sm701,
    sm702,
    sm703,
    sm704,
    sm602,
    sm705,
    sm706,
    sm706,
    sm707,
    sm708,
    sm708,
    sm708,
    sm709,
    sm710,
    sm711,
    sm712,
    sm712,
    sm712,
    sm712,
    sm713,
    sm486,
    sm714,
    sm715,
    sm716,
    sm654,
    sm717,
    sm718,
    sm719,
    sm720,
    sm721,
    sm722,
    sm14,
    sm66,
    sm723,
    sm724,
    sm725,
    sm725,
    sm726,
    sm727,
    sm728,
    sm728,
    sm729,
    sm730,
    sm731,
    sm732,
    sm731,
    sm733,
    sm734,
    sm734,
    sm735,
    sm736,
    sm737,
    sm736,
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
    sm753,
    sm754,
    sm754,
    sm755,
    sm755,
    sm756,
    sm757,
    sm756,
    sm756,
    sm758,
    sm759,
    sm760,
    sm761,
    sm762,
    sm761,
    sm761,
    sm763,
    sm764,
    sm765,
    sm765,
    sm765,
    sm766,
    sm752,
    sm767,
    sm768,
    sm768,
    sm769,
    sm770,
    sm771,
    sm772,
    sm773,
    sm773,
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
    sm791,
    sm792,
    sm792,
    sm793,
    sm794,
    sm731,
    sm795,
    sm796,
    sm797,
    sm798,
    sm799,
    sm800,
    sm801,
    sm802,
    sm803,
    sm804,
    sm804,
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
    sm813,
    sm815,
    sm816,
    sm817,
    sm818,
    sm808,
    sm819,
    sm820,
    sm821,
    sm399,
    sm690,
    sm822,
    sm823,
    sm824,
    sm825,
    sm826,
    sm827,
    sm828,
    sm829,
    sm829,
    sm830,
    sm831,
    sm832,
    sm755,
    sm833,
    sm755,
    sm834,
    sm834,
    sm835,
    sm836,
    sm837,
    sm838,
    sm839,
    sm838,
    sm840,
    sm841,
    sm842,
    sm843],

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
    R60_html_ATTRIBUTE_BODY=function (sym,env,lex,state,output,len) {return sym[1]},
    R90_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
    I110_BASIC_BINDING=function (sym,env,lex,state,output,len) {env.start = lex.off+2;},
    R180_css_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
    C190_css_RULE_SET=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.body = sym[2];},
    C300_css_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
    C340_css_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
    R640_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
    R641_css_general_enclosed6202_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
    R910_css_COMPLEX_SELECTOR=function (sym,env,lex,state,output,len) {return len > 1 ? [sym[0]].concat(sym[1]) : [sym[0]]},
    R1160_css_declaration_list=function (sym,env,lex,state,output,len) {return {[props] : sym[0],[at_rules] : []}},
    R1161_css_declaration_list=function (sym,env,lex,state,output,len) {return {[props] : [],[at_rules] : [sym[0]]}},
    R1162_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].at_rules.push(sym[1]),sym[0])},
    R1163_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].props.push(...sym[1]),sym[0])},
    R1210_css_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
    C1560_js_empty_statement=function (sym,env,lex,state,output,len) {this.type = "empty";},
    R1620_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[8])},
    I1621_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
    I1622_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
    R1623_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[7])},
    R1624_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_in_statement(sym[2],sym[4],sym[6])},
    R1625_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(sym[1],sym[3],sym[5],sym[7])},
    R1626_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[7])},
    R1627_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[6],sym[7])},
    R1628_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,sym[4],sym[6])},
    R1629_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],null,sym[6])},
    R16210_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_of_statement(null,sym[2],sym[4],sym[6])},
    R16211_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[6])},
    R16212_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[5],sym[6])},
    R16213_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[4],sym[5],sym[6])},
    R16214_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],null,null,sym[5])},
    R16215_js_iteration_statement=function (sym,env,lex,state,output,len) {return new env.functions.for_statement(sym[2],sym[3],sym[4],sym[5])},
    R1650_js_continue_statement=function (sym,env,lex,state,output,len) {return new env.functions.continue_statement(sym[1])},
    R1660_js_break_statement=function (sym,env,lex,state,output,len) {return new env.functions.break_statement(sym[1])},
    R1710_js_case_block=function (sym,env,lex,state,output,len) {return []},
    R1711_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
    R1712_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
    R1720_js_case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
    R1730_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1],sym[3])},
    R1731_js_case_clause=function (sym,env,lex,state,output,len) {return new env.functions.case_statement(sym[1])},
    R1740_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement(sym[2])},
    R1741_js_default_clause=function (sym,env,lex,state,output,len) {return new env.functions.default_case_statement()},
    R1780_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2])},
    R1781_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],null,sym[2])},
    R1782_js_try_statement=function (sym,env,lex,state,output,len) {return new env.functions.try_statement(sym[1],sym[2],sym[3])},
    R1870_js_let_or_const=function (sym,env,lex,state,output,len) {return "let"},
    R1871_js_let_or_const=function (sym,env,lex,state,output,len) {return "const"},
    R1910_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],sym[6])},
    R1911_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],sym[5])},
    R1912_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,sym[5])},
    R1913_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],null)},
    R1914_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,sym[4])},
    R1915_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],null)},
    R1916_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,null)},
    R1917_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,null)},
    R1990_js_arrow_function=function (sym,env,lex,state,output,len) {return new fn.arrow(null,sym[0],sym[2])},
    R2080_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail(sym)},
    R2081_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([null,...sym[0]])},
    R2082_js_class_tail=function (sym,env,lex,state,output,len) {return new env.functions.class_tail([sym[0],null,null])},
    R2083_js_class_tail=function (sym,env,lex,state,output,len) {return null},
    R2110_js_class_element_list=function (sym,env,lex,state,output,len) {return sym[0].push(sym[1])},
    R2120_js_class_element=function (sym,env,lex,state,output,len) {return (sym[1].static = true,sym[1])},
    R2190_js_new_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],null)},
    R2200_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],sym[2])},
    R2260_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(sym[1])},
    R2261_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(null)},
    R2400_js_element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
    R2600_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new env.functions.spread_expr(env,sym.slice(1,3))},
    R2601_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return Array.isArray(sym[0]) ? (sym[1].push(new env.functions.spread_expr(env,sym.slice(3,5))),sym[1]) : [sym[0],new env.functions.spread_expr(env,sym.slice(3,5))]},
    R2920_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
    R2921_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
    R2922_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
    R2923_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
    R2924_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},

        //Sparse Map Lookup
        lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index+1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

        //State Action Functions
        state_funct = [(...v)=>((redn(147459,0,...v))),
    ()=>(350),
    ()=>(306),
    ()=>(394),
    ()=>(462),
    ()=>(118),
    ()=>(354),
    ()=>(214),
    ()=>(222),
    ()=>(486),
    ()=>(478),
    ()=>(494),
    ()=>(398),
    ()=>(390),
    ()=>(410),
    ()=>(414),
    ()=>(418),
    ()=>(374),
    ()=>(426),
    ()=>(430),
    ()=>(434),
    ()=>(442),
    ()=>(438),
    ()=>(422),
    ()=>(446),
    ()=>(450),
    ()=>(498),
    ()=>(254),
    ()=>(358),
    ()=>(270),
    ()=>(218),
    ()=>(202),
    ()=>(206),
    ()=>(210),
    ()=>(226),
    ()=>(234),
    ()=>(238),
    ()=>(342),
    ()=>(346),
    ()=>(338),
    ()=>(330),
    ()=>(334),
    ()=>(310),
    (...v)=>(redv(5,R00_S,1,0,...v)),
    (...v)=>(redn(1031,1,...v)),
    (...v)=>(redv(124935,R00_S,1,0,...v)),
    (...v)=>(redv(125959,R00_S,1,0,...v)),
    (...v)=>(redv(147463,R00_S,1,0,...v)),
    (...v)=>(redn(148487,1,...v)),
    (...v)=>(rednv(151559,fn.statements,1,0,...v)),
    ()=>(522),
    (...v)=>(redv(150535,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(149511,1,...v)),
    (...v)=>(redn(152583,1,...v)),
    (...v)=>(redn(153607,1,...v)),
    (...v)=>(redn(294919,1,...v)),
    ()=>(526),
    (...v)=>(redn(157703,1,...v)),
    ()=>(534),
    (...v)=>(rednv(222215,fn.expression_list,1,0,...v)),
    ()=>(538),
    (...v)=>(redv(221191,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(220167,1,...v)),
    (...v)=>(redn(248839,1,...v)),
    (...v)=>(redn(264199,1,...v)),
    ()=>(542),
    ()=>(594),
    ()=>(558),
    ()=>(562),
    ()=>(566),
    ()=>(570),
    ()=>(574),
    ()=>(578),
    ()=>(582),
    ()=>(586),
    ()=>(590),
    ()=>(598),
    ()=>(602),
    ()=>(550),
    ()=>(554),
    (...v)=>(redn(250887,1,...v)),
    ()=>(610),
    ()=>(606),
    (...v)=>(redn(251911,1,...v)),
    ()=>(614),
    (...v)=>(redn(252935,1,...v)),
    ()=>(618),
    (...v)=>(redn(253959,1,...v)),
    ()=>(622),
    (...v)=>(redn(254983,1,...v)),
    ()=>(626),
    (...v)=>(redn(256007,1,...v)),
    ()=>(630),
    ()=>(634),
    ()=>(638),
    ()=>(642),
    (...v)=>(redn(257031,1,...v)),
    ()=>(646),
    ()=>(650),
    ()=>(654),
    ()=>(666),
    ()=>(658),
    ()=>(662),
    (...v)=>(redn(258055,1,...v)),
    ()=>(670),
    ()=>(674),
    ()=>(678),
    (...v)=>(redn(259079,1,...v)),
    ()=>(682),
    ()=>(686),
    (...v)=>(redn(260103,1,...v)),
    ()=>(694),
    ()=>(698),
    ()=>(690),
    (...v)=>(redn(261127,1,...v)),
    (...v)=>(redn(262151,1,...v)),
    (...v)=>(redn(263175,1,...v)),
    ()=>(702),
    ()=>(738),
    ()=>(734),
    (...v)=>(redn(223239,1,...v)),
    ()=>(794),
    ()=>(782),
    ()=>(790),
    (...v)=>(redn(224263,1,...v)),
    ()=>(802),
    ()=>(798),
    ()=>(818),
    ()=>(822),
    (...v)=>(redn(225287,1,...v)),
    (...v)=>(rednv(235527,fn.this_literal,1,0,...v)),
    (...v)=>(redn(235527,1,...v)),
    (...v)=>(redn(204807,1,...v)),
    (...v)=>(redn(288775,1,...v)),
    (...v)=>(redn(287751,1,...v)),
    (...v)=>(redn(289799,1,...v)),
    (...v)=>(redn(290823,1,...v)),
    (...v)=>(rednv(292871,fn.identifier,1,0,...v)),
    (...v)=>(redn(291847,1,...v)),
    (...v)=>(redv(291847,R00_S,1,0,...v)),
    (...v)=>(redn(278535,1,...v)),
    (...v)=>(rednv(286727,fn.bool_literal,1,0,...v)),
    (...v)=>(rednv(285703,fn.null_literal,1,0,...v)),
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
    (...v)=>(rednv(284679,fn.numeric_literal,1,0,...v)),
    ()=>(910),
    ()=>(918),
    ()=>(926),
    ()=>(930),
    (...v)=>(redn(227335,1,...v)),
    (...v)=>(redn(229383,1,...v)),
    ()=>(942),
    ()=>(950),
    ()=>(982),
    ()=>(986),
    (...v)=>(rednv(159751,C1560_js_empty_statement,1,0,...v)),
    ()=>(990),
    (...v)=>(redn(156679,1,...v)),
    ()=>(998),
    (...v)=>(shftf(1002,I1621_js_iteration_statement,...v)),
    ()=>(1006),
    ()=>(1010),
    ()=>(1014),
    ()=>(1026),
    ()=>(1034),
    ()=>(1042),
    ()=>(1054),
    (...v)=>(redn(296967,1,...v)),
    ()=>(1062),
    ()=>(1090),
    ()=>(1174),
    ()=>(1178),
    ()=>(1170),
    ()=>(1086),
    ()=>(1158),
    ()=>(1162),
    ()=>(1074),
    ()=>(1078),
    ()=>(1094),
    ()=>(1098),
    ()=>(1102),
    ()=>(1106),
    ()=>(1110),
    ()=>(1114),
    ()=>(1118),
    ()=>(1122),
    ()=>(1126),
    ()=>(1130),
    ()=>(1134),
    ()=>(1138),
    ()=>(1142),
    ()=>(1146),
    ()=>(1150),
    ()=>(1154),
    (...v)=>(redn(154631,1,...v)),
    ()=>(1194),
    ()=>(1198),
    (...v)=>(redn(155655,1,...v)),
    ()=>(1206),
    (...v)=>(redv(191495,R1870_js_let_or_const,1,0,...v)),
    (...v)=>(redv(191495,R1871_js_let_or_const,1,0,...v)),
    (...v)=>(redn(293895,1,...v)),
    (...v)=>(redv(3079,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(150539,R30_IMPORT_TAG_list,2,0,...v)),
    ()=>(1234),
    (...v)=>(redv(153611,R00_S,2,0,...v)),
    ()=>(1238),
    (...v)=>(rednv(160779,fn.expression_statement,2,0,...v)),
    (...v)=>(rednv(264203,fn.post_increment_expression,2,0,...v)),
    (...v)=>(rednv(264203,fn.post_decrement_expression,2,0,...v)),
    (...v)=>(redn(249863,1,...v)),
    (...v)=>(rednv(263179,fn.delete_expression,2,0,...v)),
    (...v)=>(rednv(235527,fn.array_literal,1,0,...v)),
    (...v)=>(rednv(235527,fn.object_literal,1,0,...v)),
    ()=>(1378),
    ()=>(1362),
    ()=>(1374),
    ()=>(1386),
    ()=>(1390),
    ()=>(1446),
    ()=>(1422),
    ()=>(1426),
    ()=>(1410),
    (...v)=>(redn(194567,1,...v)),
    (...v)=>(redn(210951,1,...v)),
    (...v)=>(rednv(263179,fn.void_expression,2,0,...v)),
    (...v)=>(rednv(263179,fn.typeof_expression,2,0,...v)),
    (...v)=>(rednv(263179,fn.plus_expression,2,0,...v)),
    (...v)=>(rednv(263179,fn.negate_expression,2,0,...v)),
    (...v)=>(rednv(263179,fn.unary_or_expression,2,0,...v)),
    (...v)=>(rednv(263179,fn.unary_not_expression,2,0,...v)),
    (...v)=>(rednv(264203,fn.pre_increment_expression,2,0,...v)),
    (...v)=>(rednv(264203,fn.pre_decrement_expression,2,0,...v)),
    (...v)=>(rednv(229387,fn.call_expression,2,0,...v)),
    ()=>(1462),
    ()=>(1466),
    ()=>(1482),
    (...v)=>(rednv(209931,fn.call_expression,2,0,...v)),
    (...v)=>(redv(224267,R2190_js_new_expression,2,0,...v)),
    ()=>(1498),
    (...v)=>(redv(291851,R640_css_general_enclosed6202_group_list,2,0,...v)),
    ()=>(1502),
    (...v)=>(rednv(283659,fn.string_literal,2,0,...v)),
    (...v)=>(redv(280583,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(279559,1,...v)),
    ()=>(1510),
    (...v)=>(redv(282631,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(281607,1,...v)),
    (...v)=>(redv(266251,R2083_js_class_tail,2,0,...v)),
    ()=>(1522),
    ()=>(1518),
    (...v)=>(redn(230411,2,...v)),
    (...v)=>(rednv(265227,fn.await_expression,2,0,...v)),
    ()=>(1550),
    (...v)=>(rednv(179211,fn.label_statement,2,0,...v)),
    ()=>(1566),
    ()=>(1570),
    (...v)=>(redv(188423,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(rednv(189447,fn.binding,1,0,...v)),
    ()=>(1578),
    (...v)=>(redn(267271,1,...v)),
    ()=>(1586),
    ()=>(1598),
    ()=>(1618),
    ()=>(1634),
    ()=>(1658),
    ()=>(1678),
    ()=>(1690),
    ()=>(1706),
    (...v)=>(rednv(168971,fn.continue_statement,2,0,...v)),
    ()=>(1714),
    (...v)=>(rednv(169995,fn.break_statement,2,0,...v)),
    ()=>(1718),
    (...v)=>(rednv(171019,fn.return_statement,2,0,...v)),
    ()=>(1722),
    ()=>(1730),
    ()=>(1742),
    ()=>(1746),
    (...v)=>(rednv(186379,fn.debugger_statement,2,0,...v)),
    (...v)=>(redv(296971,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    ()=>(1778),
    ()=>(1758),
    ()=>(1754),
    ()=>(1774),
    ()=>(1770),
    ()=>(1790),
    ()=>(1786),
    ()=>(1798),
    ()=>(1806),
    ()=>(1810),
    (...v)=>(redn(300039,1,...v)),
    (...v)=>(redn(306183,1,...v)),
    (...v)=>(redv(308231,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(309255,1,...v)),
    (...v)=>(rednv(211979,fn.class_statement,2,0,...v)),
    ()=>(1826),
    ()=>(1854),
    ()=>(1834),
    ()=>(1850),
    ()=>(1870),
    ()=>(1878),
    ()=>(1902),
    ()=>(1906),
    (...v)=>(redv(192519,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(294923,R40_html_BODY,2,0,...v)),
    (...v)=>(redv(3083,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(rednv(158735,fn.block_statement,3,0,...v)),
    (...v)=>(redv(221199,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(rednv(248847,fn.assignment_expression,3,0,...v)),
    ()=>(1918),
    (...v)=>(rednv(251919,fn.or_expression,3,0,...v)),
    (...v)=>(rednv(252943,fn.and_expression,3,0,...v)),
    (...v)=>(rednv(253967,fn.bit_or_expression,3,0,...v)),
    (...v)=>(rednv(254991,fn.bit_xor_expression,3,0,...v)),
    (...v)=>(rednv(256015,fn.bit_and_expression,3,0,...v)),
    (...v)=>(rednv(257039,fn.equality_expression,3,0,...v)),
    (...v)=>(rednv(258063,fn.equality_expression,3,0,...v)),
    (...v)=>(rednv(258063,fn.instanceof_expression,3,0,...v)),
    (...v)=>(rednv(258063,fn.in_expression,3,0,...v)),
    (...v)=>(rednv(259087,fn.left_shift_expression,3,0,...v)),
    (...v)=>(rednv(259087,fn.right_shift_expression,3,0,...v)),
    (...v)=>(rednv(259087,fn.right_shift_fill_expression,3,0,...v)),
    (...v)=>(rednv(260111,fn.add_expression,3,0,...v)),
    (...v)=>(rednv(260111,fn.subtract_expression,3,0,...v)),
    (...v)=>(rednv(261135,fn.multiply_expression,3,0,...v)),
    (...v)=>(rednv(261135,fn.divide_expression,3,0,...v)),
    (...v)=>(rednv(261135,fn.modulo_expression,3,0,...v)),
    (...v)=>(rednv(262159,fn.exponent_expression,3,0,...v)),
    ()=>(1930),
    ()=>(1926),
    ()=>(1946),
    ()=>(1934),
    (...v)=>(redv(244747,R2083_js_class_tail,2,0,...v)),
    (...v)=>(redv(245767,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(246791,1,...v)),
    ()=>(1954),
    ()=>(1958),
    ()=>(1962),
    (...v)=>(redv(237579,R2083_js_class_tail,2,0,...v)),
    (...v)=>(redv(236551,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(238599,1,...v)),
    ()=>(1978),
    ()=>(1974),
    (...v)=>(redn(240647,1,...v)),
    (...v)=>(redn(239623,1,...v)),
    (...v)=>(rednv(229391,fn.member_expression,3,0,...v)),
    ()=>(1994),
    ()=>(1998),
    ()=>(2002),
    ()=>(2006),
    (...v)=>(redv(231435,R2261_js_arguments,2,0,...v)),
    ()=>(2010),
    (...v)=>(redn(234503,1,...v)),
    (...v)=>(redv(233479,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(232455,1,...v)),
    ()=>(2018),
    (...v)=>(rednv(225295,fn.member_expression,3,0,...v)),
    (...v)=>(redv(225295,R2200_js_member_expression,3,0,...v)),
    (...v)=>(rednv(228367,fn.new_target_expression,3,0,...v)),
    (...v)=>(rednv(283663,fn.string_literal,3,0,...v)),
    (...v)=>(redv(280587,R640_css_general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redv(282635,R640_css_general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redv(266255,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    ()=>(2022),
    ()=>(2026),
    ()=>(2030),
    ()=>(2034),
    (...v)=>(rednv(226319,fn.supper_expression,3,0,...v)),
    ()=>(2038),
    (...v)=>(redv(203791,R1990_js_arrow_function,3,0,...v)),
    (...v)=>(redn(205831,1,...v)),
    (...v)=>(redv(180235,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    (...v)=>(redn(181255,1,...v)),
    (...v)=>(rednv(187407,fn.variable_statement,3,0,...v)),
    (...v)=>(rednv(189451,fn.binding,2,0,...v)),
    (...v)=>(redn(268299,2,...v)),
    ()=>(2058),
    ()=>(2066),
    ()=>(2062),
    (...v)=>(redn(271367,1,...v)),
    (...v)=>(redn(274439,1,...v)),
    ()=>(2074),
    (...v)=>(redn(276487,1,...v)),
    (...v)=>(redn(269323,2,...v)),
    ()=>(2086),
    ()=>(2094),
    ()=>(2102),
    ()=>(2098),
    (...v)=>(redn(272391,1,...v)),
    (...v)=>(redn(273415,1,...v)),
    (...v)=>(redn(275463,1,...v)),
    ()=>(2118),
    ()=>(2122),
    ()=>(2126),
    ()=>(2130),
    ()=>(2138),
    ()=>(2142),
    ()=>(2150),
    ()=>(2154),
    (...v)=>(redn(162823,1,...v)),
    (...v)=>(redn(163847,1,...v)),
    (...v)=>(redn(164871,1,...v)),
    ()=>(2194),
    ()=>(2206),
    (...v)=>(redv(168975,R1650_js_continue_statement,3,0,...v)),
    (...v)=>(redv(169999,R1660_js_break_statement,3,0,...v)),
    (...v)=>(rednv(171023,fn.return_statement,3,0,...v)),
    ()=>(2210),
    (...v)=>(rednv(172047,fn.throw_statement,3,0,...v)),
    (...v)=>(redv(182287,R1780_js_try_statement,3,0,...v)),
    (...v)=>(redv(182287,R1781_js_try_statement,3,0,...v)),
    ()=>(2218),
    ()=>(2230),
    ()=>(2226),
    (...v)=>((redn(301059,0,...v))),
    (...v)=>(shftf(2270,I110_BASIC_BINDING,...v)),
    ()=>(2274),
    (...v)=>(redv(302087,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(rednv(303111,fn.attribute,1,0,...v)),
    ()=>(2278),
    ()=>(2282),
    ()=>(2286),
    (...v)=>(redn(304135,1,...v)),
    ()=>(2294),
    ()=>(2290),
    (...v)=>(redv(299023,R2923_html_TAG,3,0,...v)),
    ()=>(2298),
    ()=>(2302),
    ()=>(2306),
    (...v)=>((redn(17411,0,...v))),
    ()=>(2350),
    ()=>(2330),
    ()=>(2362),
    ()=>(2378),
    ()=>(2386),
    (...v)=>(redv(297999,R2083_js_class_tail,3,0,...v)),
    (...v)=>(redv(308235,R640_css_general_enclosed6202_group_list,2,0,...v)),
    ()=>(2390),
    ()=>(2394),
    (...v)=>(rednv(211983,fn.class_statement,3,0,...v)),
    ()=>(2402),
    ()=>(2406),
    (...v)=>(redv(213003,R2083_js_class_tail,2,0,...v)),
    (...v)=>(redn(215047,1,...v)),
    (...v)=>(redv(216071,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(217095,1,...v)),
    (...v)=>(redv(214027,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    ()=>(2422),
    ()=>(2426),
    ()=>(2430),
    (...v)=>(redn(197639,1,...v)),
    ()=>(2434),
    (...v)=>(redn(199687,1,...v)),
    (...v)=>(redv(198663,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(200711,1,...v)),
    (...v)=>(rednv(190479,fn.lexical,3,0,...v)),
    (...v)=>(rednv(193547,fn.binding,2,0,...v)),
    ()=>(2446),
    (...v)=>(redv(244751,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(244751,R2083_js_class_tail,3,0,...v)),
    (...v)=>(redv(245771,R2400_js_element_list,2,0,...v)),
    (...v)=>(redn(246795,2,...v)),
    (...v)=>(rednv(247819,fn.spread_element,2,0,...v)),
    ()=>(2462),
    (...v)=>(redv(237583,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(237583,R2083_js_class_tail,3,0,...v)),
    (...v)=>(rednv(242699,fn.binding,2,0,...v)),
    (...v)=>(rednv(238603,fn.spread_expr,2,0,...v)),
    ()=>(2482),
    ()=>(2486),
    ()=>(2490),
    (...v)=>(rednv(229395,fn.call_expression,4,0,...v)),
    ()=>(2494),
    (...v)=>(redv(231439,R2260_js_arguments,3,0,...v)),
    (...v)=>(redv(231439,R2261_js_arguments,3,0,...v)),
    (...v)=>(rednv(232459,fn.spread_element,2,0,...v)),
    (...v)=>(rednv(225299,fn.member_expression,4,0,...v)),
    (...v)=>(redv(266259,R60_html_ATTRIBUTE_BODY,4,0,...v)),
    (...v)=>(redv(266259,R2600_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
    (...v)=>(rednv(226323,fn.supper_expression,4,0,...v)),
    ()=>(2510),
    (...v)=>(redn(202759,1,...v)),
    (...v)=>(redv(188431,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(243723,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    (...v)=>(redn(268303,3,...v)),
    ()=>(2518),
    (...v)=>(redn(270347,2,...v)),
    (...v)=>(redn(276491,2,...v)),
    ()=>(2530),
    (...v)=>(redn(269327,3,...v)),
    (...v)=>(redn(273419,2,...v)),
    ()=>(2534),
    (...v)=>(redn(277515,2,...v)),
    (...v)=>(redn(275467,2,...v)),
    ()=>(2566),
    ()=>(2570),
    ()=>(2578),
    ()=>(2586),
    (...v)=>(shftf(2594,I1622_js_iteration_statement,...v)),
    (...v)=>(redv(162827,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    (...v)=>(redv(163851,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    (...v)=>(redv(164875,R60_html_ATTRIBUTE_BODY,2,0,...v)),
    (...v)=>(redn(167943,1,...v)),
    (...v)=>(redn(166923,2,...v)),
    ()=>(2602),
    ()=>(2622),
    (...v)=>(redv(182291,R1782_js_try_statement,4,0,...v)),
    (...v)=>(rednv(184331,fn.finally_statement,2,0,...v)),
    ()=>(2646),
    (...v)=>(redv(302091,R30_IMPORT_TAG_list,2,0,...v)),
    ()=>(2650),
    (...v)=>(redv(301063,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(301063,R2083_js_class_tail,1,0,...v)),
    (...v)=>(rednv(307207,fn.text,1,0,...v)),
    (...v)=>(redn(10247,1,...v)),
    (...v)=>(redv(299027,R2923_html_TAG,4,0,...v)),
    ()=>(2674),
    ()=>(2682),
    ()=>(2686),
    ()=>(2690),
    ()=>(2694),
    (...v)=>(redv(299027,R2920_html_TAG,4,0,...v)),
    ()=>(2698),
    ()=>(2702),
    ()=>(2714),
    (...v)=>(redn(13319,1,...v)),
    (...v)=>(redn(17415,1,...v)),
    ()=>(2734),
    (...v)=>(redv(14343,R31_IMPORT_TAG_list,1,0,...v)),
    ()=>(2738),
    ()=>(2750),
    ()=>(2746),
    ()=>(2742),
    (...v)=>(redv(16391,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(15367,1,...v)),
    ()=>(2758),
    ()=>(2754),
    ()=>(2782),
    (...v)=>(redv(18439,R31_IMPORT_TAG_list,1,0,...v)),
    ()=>(2802),
    (...v)=>(redv(93191,R910_css_COMPLEX_SELECTOR,1,0,...v)),
    ()=>(2806),
    ()=>(2810),
    ()=>(2814),
    ()=>(2846),
    ()=>(2842),
    ()=>(2854),
    ()=>(2878),
    ()=>(2882),
    ()=>(2886),
    ()=>(2830),
    ()=>(2890),
    ()=>(2902),
    ()=>(2906),
    ()=>(2910),
    ()=>(2918),
    ()=>(2922),
    ()=>(2926),
    ()=>(2930),
    (...v)=>(rednv(5139,fn.element_selector,4,0,...v)),
    ()=>(2934),
    (...v)=>(redv(213007,R2082_js_class_tail,3,0,...v)),
    (...v)=>(redv(213007,R2081_js_class_tail,3,0,...v)),
    (...v)=>(redv(216075,R2110_js_class_element_list,2,0,...v)),
    (...v)=>(redv(217099,R2120_js_class_element,2,0,...v)),
    ()=>(2938),
    ()=>(2942),
    ()=>(2946),
    ()=>(2954),
    (...v)=>(redv(197643,R31_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(192527,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(rednv(250903,fn.condition_expression,5,0,...v)),
    (...v)=>(redv(244755,R60_html_ATTRIBUTE_BODY,4,0,...v)),
    (...v)=>(redv(245775,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(237587,R60_html_ATTRIBUTE_BODY,4,0,...v)),
    (...v)=>(redv(236559,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(rednv(238607,fn.property_binding,3,0,...v)),
    ()=>(2974),
    (...v)=>(redn(196615,1,...v)),
    ()=>(2978),
    (...v)=>(redv(241679,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(231443,R2260_js_arguments,4,0,...v)),
    (...v)=>(redv(233487,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    ()=>(2990),
    ()=>(2994),
    (...v)=>(redv(205839,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    ()=>(2998),
    (...v)=>(redn(268307,4,...v)),
    (...v)=>(redn(271375,3,...v)),
    (...v)=>(redn(274447,3,...v)),
    (...v)=>(redn(269331,4,...v)),
    ()=>(3002),
    ()=>(3010),
    (...v)=>(redn(272399,3,...v)),
    (...v)=>(rednv(161815,fn.if_statement,5,0,...v)),
    ()=>(3014),
    ()=>(3018),
    (...v)=>(rednv(165911,fn.while_statement,5,0,...v)),
    ()=>(3022),
    (...v)=>(shftf(3030,I1622_js_iteration_statement,...v)),
    ()=>(3038),
    ()=>(3042),
    ()=>(3050),
    (...v)=>(shftf(3058,I1622_js_iteration_statement,...v)),
    (...v)=>(shftf(3062,I1622_js_iteration_statement,...v)),
    ()=>(3070),
    (...v)=>(rednv(174103,fn.switch_statement,5,0,...v)),
    ()=>(3078),
    ()=>(3098),
    ()=>(3094),
    (...v)=>(rednv(173079,fn.with_statement,5,0,...v)),
    ()=>(3102),
    (...v)=>(redn(185351,1,...v)),
    ()=>(3106),
    (...v)=>(redv(299031,R2920_html_TAG,5,0,...v)),
    (...v)=>(redv(301067,R30_IMPORT_TAG_list,2,0,...v)),
    ()=>(3118),
    ()=>(3114),
    (...v)=>(rednv(303119,fn.attribute,3,0,...v)),
    (...v)=>(redn(305159,1,...v)),
    ()=>(3142),
    ()=>(3146),
    ()=>(3166),
    ()=>(3162),
    ()=>(3158),
    ()=>(3154),
    ()=>(3150),
    (...v)=>(redv(304143,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    ()=>(3178),
    ()=>(3182),
    ()=>(3186),
    (...v)=>(redn(17419,2,...v)),
    (...v)=>(redv(14347,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(16395,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redn(22539,2,...v)),
    ()=>(3198),
    ()=>(3218),
    ()=>(3210),
    ()=>(3214),
    ()=>(3278),
    ()=>(3266),
    ()=>(3262),
    ()=>(3282),
    ()=>(3290),
    ()=>(3334),
    ()=>(3330),
    ()=>(3310),
    ()=>(3302),
    ()=>(3346),
    ()=>(3350),
    (...v)=>(redv(118791,R1160_css_declaration_list,1,0,...v)),
    ()=>(3370),
    (...v)=>(redv(118791,R1161_css_declaration_list,1,0,...v)),
    (...v)=>(redv(115719,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(114695,1,...v)),
    ()=>(3374),
    (...v)=>(redv(93195,R910_css_COMPLEX_SELECTOR,2,0,...v)),
    (...v)=>(redv(92167,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(91143,fn.comboSelector,1,0,...v)),
    (...v)=>(redn(99335,1,...v)),
    ()=>(3394),
    ()=>(3402),
    ()=>(3410),
    ()=>(3418),
    (...v)=>(rednv(98315,fn.compoundSelector,2,0,...v)),
    (...v)=>(rednv(100359,fn.selector,1,0,...v)),
    ()=>(3426),
    ()=>(3422),
    (...v)=>(redn(101383,1,...v)),
    (...v)=>(redn(103431,1,...v)),
    ()=>(3430),
    (...v)=>(redn(102407,1,...v)),
    (...v)=>(redv(94215,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(104455,1,...v)),
    ()=>(3434),
    ()=>(3438),
    ()=>(3450),
    ()=>(3454),
    ()=>(3462),
    (...v)=>(redv(97287,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(96263,1,...v)),
    ()=>(3474),
    ()=>(3478),
    ()=>(3482),
    ()=>(3486),
    (...v)=>(rednv(5143,fn.element_selector,5,0,...v)),
    (...v)=>(redv(213011,R2080_js_class_tail,4,0,...v)),
    ()=>(3490),
    ()=>(3498),
    ()=>(3506),
    ()=>(3510),
    (...v)=>(redv(195607,R1917_js_function_declaration,5,0,...v)),
    (...v)=>(redn(201735,1,...v)),
    (...v)=>(redv(197647,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(198671,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(245779,R180_css_COMPLEX_SELECTOR_list,4,0,...v)),
    ()=>(3514),
    ()=>(3518),
    ()=>(3522),
    (...v)=>(redn(219143,1,...v)),
    (...v)=>(redv(266267,R2601_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
    (...v)=>(redn(268311,5,...v)),
    (...v)=>(redn(269335,5,...v)),
    ()=>(3526),
    ()=>(3534),
    (...v)=>(shftf(3542,I1622_js_iteration_statement,...v)),
    (...v)=>(shftf(3546,I1622_js_iteration_statement,...v)),
    ()=>(3554),
    (...v)=>(redv(165915,R16214_js_iteration_statement,6,0,...v)),
    (...v)=>(shftf(3570,I1622_js_iteration_statement,...v)),
    (...v)=>(redv(165915,R16215_js_iteration_statement,6,0,...v)),
    ()=>(3586),
    (...v)=>(redv(175115,R1710_js_case_block,2,0,...v)),
    ()=>(3594),
    ()=>(3606),
    (...v)=>(redv(176135,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(178183,R1741_js_default_clause,1,0,...v)),
    ()=>(3614),
    ()=>(3626),
    (...v)=>(rednv(11279,fn.wick_binding,3,0,...v)),
    ()=>(3634),
    ()=>(3638),
    (...v)=>(redn(313351,1,...v)),
    (...v)=>(redv(312327,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(311303,1,...v)),
    (...v)=>(redn(314375,1,...v)),
    ()=>(3646),
    ()=>(3650),
    (...v)=>(redv(299035,R2924_html_TAG,6,0,...v)),
    ()=>(3654),
    ()=>(3658),
    ()=>(3666),
    (...v)=>(redn(28687,3,...v)),
    ()=>(3678),
    (...v)=>(redv(23559,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(24583,1,...v)),
    ()=>(3686),
    ()=>(3706),
    ()=>(3702),
    (...v)=>(redv(47111,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(51207,1,...v)),
    ()=>(3714),
    ()=>(3722),
    (...v)=>(redn(53255,1,...v)),
    (...v)=>(redn(52231,1,...v)),
    ()=>(3738),
    ()=>(3746),
    ()=>(3790),
    ()=>(3762),
    ()=>(3766),
    (...v)=>(redn(61447,1,...v)),
    (...v)=>(redn(80903,1,...v)),
    ()=>(3802),
    (...v)=>(redn(49159,1,...v)),
    ()=>(3806),
    (...v)=>(redn(31751,1,...v)),
    ()=>(3810),
    (...v)=>(redn(41991,1,...v)),
    ()=>(3830),
    ()=>(3838),
    ()=>(3850),
    (...v)=>(redn(43015,1,...v)),
    (...v)=>(redn(44039,1,...v)),
    ()=>(3854),
    ()=>(3858),
    ()=>(3862),
    (...v)=>(redv(18447,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    ()=>(3866),
    (...v)=>(rednv(19471,C190_css_RULE_SET,3,0,...v)),
    (...v)=>(redv(118795,R1162_css_declaration_list,2,0,...v)),
    (...v)=>(redv(118795,R1163_css_declaration_list,2,0,...v)),
    ()=>(3870),
    (...v)=>(redv(117767,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(116743,1,...v)),
    (...v)=>(redv(118795,R1160_css_declaration_list,2,0,...v)),
    ()=>(3894),
    ()=>(3898),
    ()=>(3886),
    (...v)=>(redv(92171,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(91147,fn.comboSelector,2,0,...v)),
    ()=>(3906),
    ()=>(3910),
    (...v)=>(rednv(98319,fn.compoundSelector,3,0,...v)),
    ()=>(3914),
    (...v)=>(redv(94219,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(97291,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(rednv(100363,fn.selector,2,0,...v)),
    (...v)=>(redn(103435,2,...v)),
    (...v)=>(redn(102411,2,...v)),
    (...v)=>(rednv(105483,fn.idSelector,2,0,...v)),
    (...v)=>(rednv(106507,fn.classSelector,2,0,...v)),
    ()=>(3942),
    ()=>(3926),
    ()=>(3918),
    ()=>(3930),
    ()=>(3934),
    ()=>(3938),
    ()=>(3950),
    (...v)=>(rednv(112651,fn.pseudoClassSelector,2,0,...v)),
    (...v)=>(rednv(113675,fn.pseudoElementSelector,2,0,...v)),
    (...v)=>(redn(96267,2,...v)),
    (...v)=>(redv(95239,R31_IMPORT_TAG_list,1,0,...v)),
    ()=>(3958),
    ()=>(3962),
    ()=>(3966),
    (...v)=>(redv(299035,R2923_html_TAG,6,0,...v)),
    ()=>(3974),
    ()=>(3978),
    (...v)=>(redv(195611,R1916_js_function_declaration,6,0,...v)),
    ()=>(3982),
    (...v)=>(redv(195611,R1915_js_function_declaration,6,0,...v)),
    (...v)=>(redv(195611,R1914_js_function_declaration,6,0,...v)),
    ()=>(3994),
    (...v)=>(redn(269339,6,...v)),
    (...v)=>(rednv(161823,fn.if_statement,7,0,...v)),
    (...v)=>(rednv(165919,fn.do_while_statement,7,0,...v)),
    (...v)=>(shftf(3998,I1622_js_iteration_statement,...v)),
    (...v)=>(redv(165919,R16213_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R1629_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R1628_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R1624_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R16212_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R16211_js_iteration_statement,7,0,...v)),
    (...v)=>(redv(165919,R16210_js_iteration_statement,7,0,...v)),
    ()=>(4026),
    (...v)=>(redv(175119,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(176139,R1720_js_case_clauses,2,0,...v)),
    ()=>(4030),
    ()=>(4034),
    (...v)=>(rednv(183319,fn.catch_statement,5,0,...v)),
    ()=>(4042),
    (...v)=>(redv(299039,R2922_html_TAG,7,0,...v)),
    ()=>(4046),
    (...v)=>(redv(305167,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(310287,R60_html_ATTRIBUTE_BODY,3,0,...v)),
    (...v)=>(redv(312331,R640_css_general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redv(299039,R2921_html_TAG,7,0,...v)),
    ()=>(4050),
    (...v)=>(redn(28691,4,...v)),
    (...v)=>(redv(23563,R30_IMPORT_TAG_list,2,0,...v)),
    ()=>(4066),
    ()=>(4074),
    ()=>(4070),
    (...v)=>(redv(89095,R641_css_general_enclosed6202_group_list,1,0,...v)),
    ()=>(4078),
    (...v)=>(redn(87051,2,...v)),
    (...v)=>(redn(86023,1,...v)),
    (...v)=>((redn(21507,0,...v))),
    (...v)=>(redn(51211,2,...v)),
    (...v)=>(redn(57355,2,...v)),
    (...v)=>(redn(60427,2,...v)),
    (...v)=>(redv(56327,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(59399,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(54283,2,...v)),
    ()=>(4126),
    ()=>(4130),
    ()=>(4150),
    ()=>(4146),
    (...v)=>(redn(79879,1,...v)),
    ()=>(4138),
    (...v)=>(redn(62471,1,...v)),
    ()=>(4162),
    ()=>(4166),
    ()=>(4170),
    ()=>(4174),
    ()=>(4154),
    ()=>(4190),
    ()=>(4194),
    ()=>(4198),
    ()=>(4202),
    (...v)=>(redn(77831,1,...v)),
    ()=>(4210),
    ()=>(4214),
    ()=>(4218),
    ()=>(4222),
    ()=>(4242),
    ()=>(4238),
    ()=>(4230),
    ()=>(4274),
    ()=>(4262),
    ()=>(4266),
    (...v)=>(redn(41995,2,...v)),
    (...v)=>(redv(38919,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(40967,R31_IMPORT_TAG_list,1,0,...v)),
    ()=>(4298),
    ()=>(4302),
    ()=>(4310),
    (...v)=>(rednv(19475,C190_css_RULE_SET,4,0,...v)),
    (...v)=>(redv(118799,R1163_css_declaration_list,3,0,...v)),
    (...v)=>(redv(115727,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(120847,fn.parseDeclaration,3,0,...v)),
    ()=>(4326),
    (...v)=>(redn(123911,1,...v)),
    (...v)=>(redv(122887,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(121863,1,...v)),
    ()=>(4338),
    (...v)=>(rednv(98323,fn.compoundSelector,4,0,...v)),
    (...v)=>(rednv(108559,fn.attribSelector,3,0,...v)),
    ()=>(4346),
    ()=>(4350),
    ()=>(4354),
    (...v)=>(redn(109575,1,...v)),
    (...v)=>(rednv(112655,fn.pseudoClassSelector,3,0,...v)),
    (...v)=>(redv(95243,R30_IMPORT_TAG_list,2,0,...v)),
    ()=>(4362),
    (...v)=>(redv(299039,R2920_html_TAG,7,0,...v)),
    ()=>(4366),
    (...v)=>(redv(195615,R1913_js_function_declaration,7,0,...v)),
    (...v)=>(redv(195615,R1912_js_function_declaration,7,0,...v)),
    (...v)=>(redv(195615,R1911_js_function_declaration,7,0,...v)),
    ()=>(4370),
    ()=>(4374),
    (...v)=>(redv(165923,R1627_js_iteration_statement,8,0,...v)),
    (...v)=>(redv(165923,R1626_js_iteration_statement,8,0,...v)),
    (...v)=>(redv(165923,R1623_js_iteration_statement,8,0,...v)),
    (...v)=>(redv(165923,R1625_js_iteration_statement,8,0,...v)),
    ()=>(4386),
    (...v)=>(redv(175123,R1712_js_case_block,4,0,...v)),
    (...v)=>(redv(177167,R1731_js_case_clause,3,0,...v)),
    (...v)=>(redv(178191,R1740_js_default_clause,3,0,...v)),
    (...v)=>(redv(299043,R90_html_TAG,8,0,...v)),
    (...v)=>(rednv(12311,fn.wick_binding,5,0,...v)),
    (...v)=>(redn(28695,5,...v)),
    ()=>(4410),
    (...v)=>(redn(90127,3,...v)),
    (...v)=>(redv(89099,R640_css_general_enclosed6202_group_list,2,0,...v)),
    ()=>(4414),
    (...v)=>(redn(21511,1,...v)),
    (...v)=>(redv(20487,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redv(47119,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redn(51215,3,...v)),
    (...v)=>(redn(50187,2,...v)),
    (...v)=>(redv(56331,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(59403,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redn(55307,2,...v)),
    (...v)=>(redn(58379,2,...v)),
    (...v)=>(redn(61455,3,...v)),
    (...v)=>(redn(63503,3,...v)),
    ()=>(4422),
    (...v)=>(redn(68623,3,...v)),
    (...v)=>(redv(67591,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(66567,1,...v)),
    ()=>(4438),
    (...v)=>(redn(70663,1,...v)),
    ()=>(4446),
    ()=>(4454),
    ()=>(4458),
    (...v)=>(redn(71687,1,...v)),
    ()=>(4462),
    (...v)=>(redn(85003,2,...v)),
    ()=>(4466),
    (...v)=>(redn(83975,1,...v)),
    ()=>(4470),
    (...v)=>(redv(65543,R641_css_general_enclosed6202_group_list,1,0,...v)),
    (...v)=>(redn(64519,1,...v)),
    ()=>(4478),
    (...v)=>(redv(29703,R31_IMPORT_TAG_list,1,0,...v)),
    ()=>(4490),
    ()=>(4486),
    (...v)=>(redv(32775,R31_IMPORT_TAG_list,1,0,...v)),
    (...v)=>(redn(35847,1,...v)),
    ()=>(4494),
    ()=>(4498),
    (...v)=>(redv(38923,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redv(40971,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redn(37899,2,...v)),
    (...v)=>(redn(39947,2,...v)),
    (...v)=>(redn(43023,3,...v)),
    (...v)=>(redn(45071,3,...v)),
    ()=>(4502),
    (...v)=>(rednv(19479,C190_css_RULE_SET,5,0,...v)),
    (...v)=>(redv(117775,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(redv(120851,fn.parseDeclaration,4,0,...v)),
    (...v)=>(redv(123915,R1210_css_declaration_values,2,0,...v)),
    ()=>(4506),
    (...v)=>(redv(122891,R640_css_general_enclosed6202_group_list,2,0,...v)),
    ()=>(4510),
    (...v)=>(rednv(98327,fn.compoundSelector,5,0,...v)),
    ()=>(4518),
    ()=>(4522),
    ()=>(4526),
    (...v)=>(redn(107527,1,...v)),
    (...v)=>(redn(109579,2,...v)),
    ()=>(4530),
    (...v)=>(redv(195619,R1910_js_function_declaration,8,0,...v)),
    (...v)=>(rednv(218143,fn.class_method,7,0,...v)),
    (...v)=>(rednv(218143,fn.class_get_method,7,0,...v)),
    ()=>(4534),
    (...v)=>(redv(165927,R1620_js_iteration_statement,9,0,...v)),
    (...v)=>(redv(175127,R1711_js_case_block,5,0,...v)),
    (...v)=>(redv(177171,R1730_js_case_clause,4,0,...v)),
    (...v)=>(redn(28699,6,...v)),
    ()=>(4538),
    (...v)=>(redn(25607,1,...v)),
    (...v)=>(redn(48155,6,...v)),
    (...v)=>(redv(20491,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redn(68627,4,...v)),
    (...v)=>(redv(67595,R640_css_general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(redn(69647,3,...v)),
    (...v)=>(redn(76815,3,...v)),
    (...v)=>(redn(70667,2,...v)),
    ()=>(4546),
    ()=>(4554),
    ()=>(4558),
    (...v)=>(redn(71691,2,...v)),
    (...v)=>(redn(81935,3,...v)),
    (...v)=>(redv(65547,R640_css_general_enclosed6202_group_list,2,0,...v)),
    (...v)=>(rednv(30747,C300_css_keyframes,6,0,...v)),
    (...v)=>(redv(29707,R30_IMPORT_TAG_list,2,0,...v)),
    (...v)=>(redn(82955,2,...v)),
    (...v)=>(redn(36891,6,...v)),
    (...v)=>(redn(46099,4,...v)),
    (...v)=>(redn(119819,2,...v)),
    (...v)=>(redv(123919,R1210_css_declaration_values,3,0,...v)),
    ()=>(4570),
    (...v)=>(rednv(108567,fn.attribSelector,5,0,...v)),
    (...v)=>(redn(110599,1,...v)),
    (...v)=>(redn(111631,3,...v)),
    (...v)=>(rednv(218147,fn.class_set_method,8,0,...v)),
    (...v)=>(redn(26643,4,...v)),
    (...v)=>(redn(73735,1,...v)),
    ()=>(4578),
    (...v)=>(redn(75783,1,...v)),
    ()=>(4594),
    ()=>(4590),
    (...v)=>(redv(32783,R180_css_COMPLEX_SELECTOR_list,3,0,...v)),
    (...v)=>(rednv(108571,fn.attribSelector,6,0,...v)),
    (...v)=>(redn(76823,5,...v)),
    (...v)=>(redn(73739,2,...v)),
    ()=>(4598),
    (...v)=>(rednv(34835,C340_css_keyframes_blocks,4,0,...v)),
    (...v)=>(redn(33799,1,...v)),
    (...v)=>(rednv(34839,C340_css_keyframes_blocks,5,0,...v))],

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
    nf,
    nf,
    v=>lsm(v,gt2),
    nf,
    nf,
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
    v=>lsm(v,gt16),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt17),
    v=>lsm(v,gt18),
    nf,
    v=>lsm(v,gt19),
    v=>lsm(v,gt20),
    nf,
    nf,
    nf,
    v=>lsm(v,gt21),
    nf,
    nf,
    v=>lsm(v,gt22),
    v=>lsm(v,gt23),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt24),
    nf,
    nf,
    nf,
    v=>lsm(v,gt25),
    v=>lsm(v,gt26),
    v=>lsm(v,gt27),
    nf,
    v=>lsm(v,gt28),
    v=>lsm(v,gt29),
    nf,
    nf,
    v=>lsm(v,gt30),
    v=>lsm(v,gt31),
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
    nf,
    nf,
    nf,
    v=>lsm(v,gt31),
    nf,
    nf,
    nf,
    v=>lsm(v,gt36),
    v=>lsm(v,gt37),
    v=>lsm(v,gt38),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt64),
    v=>lsm(v,gt65),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt66),
    nf,
    v=>lsm(v,gt67),
    v=>lsm(v,gt68),
    v=>lsm(v,gt69),
    v=>lsm(v,gt70),
    nf,
    nf,
    v=>lsm(v,gt71),
    nf,
    nf,
    nf,
    v=>lsm(v,gt72),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt73),
    nf,
    nf,
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
    v=>lsm(v,gt76),
    nf,
    nf,
    v=>lsm(v,gt77),
    nf,
    v=>lsm(v,gt78),
    nf,
    nf,
    v=>lsm(v,gt79),
    v=>lsm(v,gt80),
    nf,
    nf,
    nf,
    v=>lsm(v,gt81),
    v=>lsm(v,gt82),
    v=>lsm(v,gt83),
    nf,
    v=>lsm(v,gt84),
    v=>lsm(v,gt85),
    nf,
    v=>lsm(v,gt86),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt87),
    nf,
    v=>lsm(v,gt88),
    nf,
    nf,
    v=>lsm(v,gt89),
    v=>lsm(v,gt90),
    v=>lsm(v,gt91),
    v=>lsm(v,gt92),
    v=>lsm(v,gt93),
    v=>lsm(v,gt94),
    v=>lsm(v,gt95),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt96),
    nf,
    nf,
    v=>lsm(v,gt97),
    v=>lsm(v,gt98),
    nf,
    v=>lsm(v,gt99),
    nf,
    nf,
    v=>lsm(v,gt100),
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
    nf,
    nf,
    nf,
    v=>lsm(v,gt102),
    v=>lsm(v,gt103),
    nf,
    nf,
    nf,
    v=>lsm(v,gt104),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt105),
    nf,
    v=>lsm(v,gt106),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt110),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt111),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt112),
    nf,
    v=>lsm(v,gt113),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt114),
    nf,
    nf,
    nf,
    v=>lsm(v,gt115),
    nf,
    v=>lsm(v,gt116),
    nf,
    nf,
    v=>lsm(v,gt117),
    nf,
    nf,
    nf,
    v=>lsm(v,gt118),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt119),
    nf,
    v=>lsm(v,gt120),
    nf,
    nf,
    v=>lsm(v,gt121),
    v=>lsm(v,gt3),
    v=>lsm(v,gt122),
    nf,
    v=>lsm(v,gt123),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt124),
    nf,
    nf,
    v=>lsm(v,gt125),
    v=>lsm(v,gt126),
    v=>lsm(v,gt127),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt126),
    nf,
    nf,
    v=>lsm(v,gt126),
    v=>lsm(v,gt128),
    v=>lsm(v,gt126),
    v=>lsm(v,gt129),
    nf,
    nf,
    v=>lsm(v,gt126),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt137),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt138),
    v=>lsm(v,gt139),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt140),
    nf,
    nf,
    nf,
    v=>lsm(v,gt141),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt142),
    nf,
    v=>lsm(v,gt143),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt144),
    nf,
    nf,
    nf,
    v=>lsm(v,gt145),
    v=>lsm(v,gt146),
    v=>lsm(v,gt147),
    v=>lsm(v,gt148),
    nf,
    v=>lsm(v,gt149),
    v=>lsm(v,gt150),
    nf,
    v=>lsm(v,gt151),
    v=>lsm(v,gt152),
    nf,
    nf,
    v=>lsm(v,gt79),
    v=>lsm(v,gt80),
    nf,
    v=>lsm(v,gt100),
    v=>lsm(v,gt101),
    nf,
    nf,
    v=>lsm(v,gt153),
    nf,
    v=>lsm(v,gt154),
    v=>lsm(v,gt155),
    v=>lsm(v,gt156),
    nf,
    v=>lsm(v,gt157),
    nf,
    v=>lsm(v,gt158),
    nf,
    nf,
    v=>lsm(v,gt159),
    nf,
    nf,
    nf,
    v=>lsm(v,gt94),
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
    v=>lsm(v,gt162),
    nf,
    v=>lsm(v,gt163),
    nf,
    nf,
    v=>lsm(v,gt164),
    v=>lsm(v,gt165),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt166),
    nf,
    v=>lsm(v,gt167),
    v=>lsm(v,gt168),
    nf,
    nf,
    nf,
    v=>lsm(v,gt169),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt170),
    v=>lsm(v,gt171),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt172),
    nf,
    nf,
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
    nf,
    nf,
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
    v=>lsm(v,gt175),
    v=>lsm(v,gt176),
    nf,
    v=>lsm(v,gt177),
    nf,
    v=>lsm(v,gt178),
    nf,
    v=>lsm(v,gt179),
    nf,
    v=>lsm(v,gt180),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt181),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt159),
    nf,
    v=>lsm(v,gt182),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt183),
    v=>lsm(v,gt184),
    nf,
    nf,
    v=>lsm(v,gt185),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt165),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt186),
    v=>lsm(v,gt187),
    v=>lsm(v,gt188),
    v=>lsm(v,gt189),
    v=>lsm(v,gt190),
    v=>lsm(v,gt191),
    v=>lsm(v,gt192),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt193),
    nf,
    v=>lsm(v,gt194),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt195),
    v=>lsm(v,gt196),
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
    nf,
    nf,
    v=>lsm(v,gt198),
    v=>lsm(v,gt199),
    nf,
    v=>lsm(v,gt200),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt204),
    nf,
    v=>lsm(v,gt205),
    nf,
    v=>lsm(v,gt206),
    v=>lsm(v,gt207),
    nf,
    v=>lsm(v,gt208),
    nf,
    v=>lsm(v,gt209),
    v=>lsm(v,gt210),
    nf,
    v=>lsm(v,gt211),
    nf,
    nf,
    v=>lsm(v,gt212),
    v=>lsm(v,gt213),
    nf,
    v=>lsm(v,gt214),
    nf,
    v=>lsm(v,gt215),
    v=>lsm(v,gt216),
    nf,
    v=>lsm(v,gt217),
    nf,
    nf,
    nf,
    v=>lsm(v,gt218),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt219),
    v=>lsm(v,gt220),
    nf,
    nf,
    nf,
    v=>lsm(v,gt221),
    v=>lsm(v,gt222),
    v=>lsm(v,gt223),
    nf,
    nf,
    nf,
    v=>lsm(v,gt224),
    v=>lsm(v,gt225),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt226),
    v=>lsm(v,gt227),
    v=>lsm(v,gt228),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt229),
    v=>lsm(v,gt230),
    v=>lsm(v,gt231),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt192),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt232),
    v=>lsm(v,gt233),
    nf,
    nf,
    v=>lsm(v,gt234),
    v=>lsm(v,gt197),
    nf,
    v=>lsm(v,gt197),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt199),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt235),
    nf,
    nf,
    v=>lsm(v,gt236),
    nf,
    nf,
    v=>lsm(v,gt237),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt238),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt239),
    v=>lsm(v,gt240),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt241),
    v=>lsm(v,gt242),
    nf,
    v=>lsm(v,gt243),
    nf,
    nf,
    nf,
    v=>lsm(v,gt244),
    nf,
    nf,
    nf,
    v=>lsm(v,gt245),
    v=>lsm(v,gt246),
    nf,
    nf,
    v=>lsm(v,gt247),
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
    nf,
    nf,
    v=>lsm(v,gt249),
    nf,
    v=>lsm(v,gt250),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt251),
    v=>lsm(v,gt252),
    v=>lsm(v,gt253),
    nf,
    nf,
    v=>lsm(v,gt254),
    v=>lsm(v,gt255),
    v=>lsm(v,gt256),
    nf,
    v=>lsm(v,gt257),
    nf,
    v=>lsm(v,gt258),
    nf,
    nf,
    nf,
    v=>lsm(v,gt259),
    v=>lsm(v,gt227),
    nf,
    nf,
    nf,
    v=>lsm(v,gt260),
    v=>lsm(v,gt261),
    v=>lsm(v,gt262),
    nf,
    nf,
    v=>lsm(v,gt263),
    v=>lsm(v,gt264),
    v=>lsm(v,gt265),
    nf,
    v=>lsm(v,gt266),
    v=>lsm(v,gt267),
    nf,
    v=>lsm(v,gt268),
    nf,
    v=>lsm(v,gt269),
    nf,
    nf,
    v=>lsm(v,gt259),
    v=>lsm(v,gt270),
    nf,
    nf,
    nf,
    v=>lsm(v,gt271),
    nf,
    v=>lsm(v,gt272),
    v=>lsm(v,gt273),
    v=>lsm(v,gt274),
    nf,
    nf,
    nf,
    v=>lsm(v,gt197),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt279),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt280),
    nf,
    nf,
    v=>lsm(v,gt281),
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt287),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt288),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt289),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt290),
    nf,
    nf,
    v=>lsm(v,gt290),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt294),
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
    add_expression:1,
    and_expression:2,
    array_literal:3,
    arrow_function_declaration:4,
    assignment_expression:5,
    await_expression:6,
    binding:7,
    block_statement:8,
    bool_literal:9,
    call_expression:10,
    catch_statement:11,
    condition_expression:12,
    debugger_statement:13,
    delete_expression:14,
    divide_expression:15,
    equality_expression:16,
    exponent_expression:17,
    expression_list:18,
    expression_statement:19,
    for_statement:20,
    function_declaration:21,
    identifier:22,
    if_statement:23,
    in_expression:24,
    instanceof_expression:25,
    left_shift_expression:26,
    lexical_declaration:27,
    member_expression:28,
    modulo_expression:29,
    multiply_expression:30,
    negate_expression:31,
    new_expression:32,
    null_literal:33,
    numeric_literal:34,
    object_literal:35,
    or_expression:36,
    plus_expression:37,
    post_decrement_expression:38,
    post_increment_expression:39,
    pre_decrement_expression:40,
    pre_increment_expression:41,
    property_binding:42,
    right_shift_expression:43,
    right_shift_fill_expression:44,
    return_statement:45,
    spread_element:46,
    statements:47,
    string:48,
    subtract_expression:49,
    this_literal:50,
    try_statement:51,
    typeof_expression:52,
    unary_not_expression:53,
    unary_or_expression:54,
    unary_xor_expression:55,
    void_expression:56,
    argument_list:57,
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
        render() { return `${this.id.type > 4 ? `[${this.id.render()}]` : this.id.render()} : ${this.init.render()}` }
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
    R0_arrow_function=function (sym,env,lex,state,output,len) {return new fn$1.arrow(null,sym[0],sym[2])},
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
            const fs = (import('fs')).promises;
            const path = (import('path'));


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

    const env$2 = {
        table: {},
        ASI: true,
        functions: {
            //HTML
            element_selector,
            attribute: Attribute,
            wick_binding: Binding,
            text: TextNode,

            //JS
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
exponent_expression:     equality_expression$1,
    expression_list,
    expression_statement,
    for_statement,
    function_declaration,
identifier:     identifier$1,
    if_statement,
    in_expression,
    instanceof_expression,
    left_shift_expression,
    lexical:lexical_declaration,
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
string:     string$2,
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
            env$2.prst.push(prst);
        },
        popPresets() {
            return env$2.prst.pop();
        },
        get presets() {
            return env$2.prst[env$2.prst.length - 1] || null;
        },

        options: {
            integrate: false,
            onstart: () => {
                env$2.table = {};
                env$2.ASI = true;
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
                        const compiler_env = new CompilerEnvironment(presets, env$2);
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
                                        let c_env = new CompilerEnvironment(presets, env$2);
                                        
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
