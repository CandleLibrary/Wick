var wick = (function () {
    'use strict';

    const HORIZONTAL_TAB = 9;
    const SPACE = 32;

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
    0,		/* DOLLAR */
    0,		/* PERCENT */
    0,		/* AMPERSAND */
    0,		/* QUOTE */
    0,		/* OPEN_PARENTH */
    0,		 /* CLOSE_PARENTH */
    0,		/* ASTERISK */
    0,		/* PLUS */
    0,		/* COMMA */
    0,		/* HYPHEN */
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
    0,		/* UNDER_SCORE */
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

    const extended_number_and_identifier_table = number_and_identifier_table.slice();
    extended_number_and_identifier_table[45] = 2;
    extended_number_and_identifier_table[95] = 2;

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

            this.USE_EXTENDED_ID = false;

            /**
             * Flag to force the lexer to parse string contents
             */
            this.PARSE_STRING = false;

            this.id_lu = number_and_identifier_table;

            if (!PEEKING) this.next();
        }

        useExtendedId(){
            this.id_lu = extended_number_and_identifier_table;
            this.tl = 0;
            this.next();
            return this;
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
            destination.USE_EXTENDED_ID = this.USE_EXTENDED_ID;
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
        Creates an error message with a diagram illustrating the location of the error. 
        */
        errorMessage(message = "") {
            const pk = this.copy();

            pk.IWS = false;

            while (!pk.END && pk.ty !== Types.nl) { pk.next(); }

            const end = (pk.END) ? this.str.length : pk.off,

                nls = (this.line > 0) ? 1 : 0,
                number_of_tabs = this.str
                    .slice(this.off - this.char + nls + nls, this.off + nls)
                    .split("")
                    .reduce((r, v) => (r + ((v.charCodeAt(0) == HORIZONTAL_TAB) | 0)), 0),

                arrow = String.fromCharCode(0x2b89),

                line = String.fromCharCode(0x2500),

                thick_line = String.fromCharCode(0x2501),

                line_number = `    ${this.line+1}: `,

                line_fill = line_number.length + number_of_tabs,

                line_text = this.str.slice(this.off - this.char + nls + (nls), end).replace(/\t/g, "  "),

                error_border = thick_line.repeat(line_text.length + line_number.length + 2),

                is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "",

                msg =[ `${message} at ${this.line+1}:${this.char - nls}` ,
                `${error_border}` ,
                `${line_number+line_text}` ,
                `${line.repeat(this.char-nls+line_fill-(nls))+arrow}` ,
                `${error_border}` ,
                `${is_iws}`].join("\n");

            return msg;
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
        next(marker = this, USE_CUSTOM_SYMBOLS = !!this.symbol_map) {

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
                number_and_identifier_table = this.id_lu,
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

            let NORMAL_PARSE = true;

            if (USE_CUSTOM_SYMBOLS) {

                let code = str.charCodeAt(off);
                let off2 = off;
                let map = this.symbol_map,
                    m;

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
                let null_class, str = "";

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
        //returns the name of the file less the extension
        get filename() {
            return this.file.split(".").shift();
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
     * Global Object class short name
     * @property OB
     * @package
     * @memberof module:wick~internals
     * @type Object
     */
    const OB = Object;

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
    const appendChild = (el, ch_el) => el && el.appendChild(ch_el);

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
            let existing_items = __getAll__([], true);

            let loadHash = (item) => {
                if (item instanceof Array)
                    return item.forEach((e) => loadHash(e));

                let identifier = this._gI_(item);

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
                                ;
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
                        if (unique_id && this.nodes[i][unique_key] !== unique_id) continue;
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
        constructor(preset_options) {

            if (!preset_options)
                preset_options = {};

            //if(Presets.global.v)
            //    return Presets.global.v;

            this.store = (preset_options.store instanceof Store) ? preset_options.store : null;

            /**
             * {Object} Store for optional parameters used in the app
             */
            this.options = {
                USE_SECURE: true,
                USE_SHADOW: false,
                INJECT_ERROR_HANDLER_INTO_SUBFUNCTIONS: false,
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
            const obj = {};

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

            const presets = new Presets(obj);

            presets.processLink = this.processLink.bind(this);

            return presets;
        }
    }

    Presets.global = {get v(){return CachedPresets}, set v(e){}};

    let fn = {}; const  
    /************** Maps **************/

        /* Symbols To Inject into the Lexer */
        symbols = ["</","||","^=","$=","*=","<=",">=","...","<",">","==","!=","===","!==","**","++","--","<<",">>",">>>","&&","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>","//","/*"],

        /* Goto lookup maps */
        gt0 = [0,-1,1,7,5,-1,8,-110,3,11,12,15,14,13,16,17,-10,18,-9,19,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,2,4,6,10],
    gt1 = [0,-2,135,-2,8,-280,134,136],
    gt2 = [0,-288,139,-7,138,141,-3,140],
    gt3 = [0,-119,161,-2,16,17,-10,18,-9,19,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt4 = [0,-124,164,166,167,-2,168,-2,165,169,-136,173,-6,170,83,85,-3,84],
    gt5 = [0,-137,175,-8,177,126,-29,176,-2,127,131,-3,129,-14,125],
    gt6 = [0,-141,182,181,180,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt7 = [0,-238,187],
    gt8 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,227,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt9 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,238,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt10 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,239,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt11 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,240,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt12 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,241,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt13 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,242,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt14 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,243,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt15 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,244,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt16 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,245,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt17 = [0,-220,247],
    gt18 = [0,-220,252],
    gt19 = [0,-184,231,-16,232,-11,253,254,75,76,102,-6,74,-1,230,-6,80,-20,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt20 = [0,-280,259,257,258],
    gt21 = [0,-267,270,-1,268],
    gt22 = [0,-267,270,-1,278],
    gt23 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,280,281,284,283,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt24 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,289,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt25 = [0,-220,293],
    gt26 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-17,294,228,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt27 = [0,-170,296],
    gt28 = [0,-178,298,299,-75,301,303,304,-18,300,302,83,85,-3,84],
    gt29 = [0,-145,308,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt30 = [0,-274,313,-2,315,83,85,-3,84],
    gt31 = [0,-274,316,-2,315,83,85,-3,84],
    gt32 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,318,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt33 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,321,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt34 = [0,-150,322],
    gt35 = [0,-202,325,326,-72,324,302,83,85,-3,84],
    gt36 = [0,-276,329,302,83,85,-3,84],
    gt37 = [0,-182,331,332,-71,334,303,304,-18,333,302,83,85,-3,84],
    gt38 = [0,-292,335,338,339,-2,141,-3,342],
    gt39 = [0,-292,343,338,339,-2,141,-3,342],
    gt40 = [0,-292,346,338,339,-2,141,-3,342],
    gt41 = [0,-298,351,349,350],
    gt42 = [0,-130,358],
    gt43 = [0,-127,366,363,-2,367,-1,368,-143,369,83,85,-3,84],
    gt44 = [0,-130,370],
    gt45 = [0,-130,371],
    gt46 = [0,-147,373,-37,129,-7,45,106,-4,104,374,-11,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,375,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt47 = [0,-135,379,376,-1,380,-138,381,83,85,-3,84],
    gt48 = [0,-141,383,-2,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt49 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,384,-2,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt50 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,385,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt51 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,386,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt52 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,387,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt53 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-7,388,49,50,51,52,53,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt54 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-8,389,50,51,52,53,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt55 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-9,390,51,52,53,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt56 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-10,391,52,53,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt57 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-11,392,53,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt58 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-12,393,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt59 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-12,394,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt60 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-12,395,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt61 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-12,396,54,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt62 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,397,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt63 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,398,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt64 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,399,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt65 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,400,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt66 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,401,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt67 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-13,402,55,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt68 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-14,403,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt69 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-14,404,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt70 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-14,405,56,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt71 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-15,406,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt72 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-15,407,57,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt73 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-16,408,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt74 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-16,409,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt75 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-16,410,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt76 = [0,-184,231,-14,104,-1,232,-10,229,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-16,411,58,59,67,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt77 = [0,-207,418,-17,412,-1,415,420,424,425,416,-38,426,427,-3,417,-1,234,421,85,-3,84],
    gt78 = [0,-276,429,302,83,85,-3,84],
    gt79 = [0,-202,432,326,-72,431,302,83,85,-3,84],
    gt80 = [0,-278,433,85,-3,84],
    gt81 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,434,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt82 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-1,439,438,435,74,-1,230,-6,80,-3,440,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt83 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,442,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt84 = [0,-278,443,85,-3,84],
    gt85 = [0,-220,444],
    gt86 = [0,-280,447,-1,446],
    gt87 = [0,-267,449],
    gt88 = [0,-235,451],
    gt89 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-2,456,455,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt90 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,458,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt91 = [0,-255,462,303,304,-18,461,302,83,85,-3,84],
    gt92 = [0,-278,463,85,-3,84],
    gt93 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,464,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt94 = [0,-184,231,-8,45,106,465,-3,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,466,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt95 = [0,-145,469,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-1,468,36,-3,37,27,-7,470,-7,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt96 = [0,-232,473],
    gt97 = [0,-232,475],
    gt98 = [0,-228,482,424,425,-27,477,478,-2,480,-1,481,-5,426,427,-4,483,302,421,85,-3,84],
    gt99 = [0,-235,485,-19,492,303,304,-2,487,489,-1,490,491,486,-10,483,302,83,85,-3,84],
    gt100 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,493,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt101 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,495,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt102 = [0,-154,496,498,-1,504,-22,497,503,-2,231,-8,45,106,-4,104,-1,232,-7,42,41,500,502,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt103 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,506,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt104 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,510,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt105 = [0,-173,512,513],
    gt106 = [0,-202,516,326],
    gt107 = [0,-204,518,520,521,522,-20,525,424,425,-39,426,427,-6,526,85,-3,84],
    gt108 = [0,-184,231,-14,104,-1,232,-10,527,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-20,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt109 = [0,-187,529,532,531,534,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt110 = [0,-232,538],
    gt111 = [0,-232,539],
    gt112 = [0,-293,542,339,-2,141,-3,342],
    gt113 = [0,-4,544],
    gt114 = [0,-297,141,-3,547],
    gt115 = [0,-297,141,-3,549],
    gt116 = [0,-6,560,563,562,-278,559,-1,555,553,556,-10,561,558,565],
    gt117 = [0,-298,579,-1,578],
    gt118 = [0,-132,581,-137,173],
    gt119 = [0,-126,582,-2,583],
    gt120 = [0,-133,584,-143,170,83,85,-3,84],
    gt121 = [0,-232,599],
    gt122 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,600,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt123 = [0,-228,603,424,425,-39,426,427,-6,526,85,-3,84],
    gt124 = [0,-228,604,424,425,-39,426,427,-6,526,85,-3,84],
    gt125 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,605,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt126 = [0,-187,607,532,531,534,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt127 = [0,-202,609,326],
    gt128 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,615,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt129 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-1,620,619,618,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt130 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-6,626,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt131 = [0,-179,628,-75,301,303,304,-18,300,302,83,85,-3,84],
    gt132 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,629,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt133 = [0,-276,633,302,83,85,-3,84],
    gt134 = [0,-232,635],
    gt135 = [0,-255,492,303,304,-5,638,491,636,-10,483,302,83,85,-3,84],
    gt136 = [0,-255,643,303,304,-18,642,302,83,85,-3,84],
    gt137 = [0,-232,644],
    gt138 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,649,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt139 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,653,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt140 = [0,-158,656,-19,655,299,-75,658,303,304,-18,657,302,83,85,-3,84],
    gt141 = [0,-158,659,-23,331,332,-71,661,303,304,-18,660,302,83,85,-3,84],
    gt142 = [0,-155,662,-1,504,-23,665,-2,231,-14,104,-1,232,-10,663,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-20,233,-11,79,-3,91,92,90,89,-1,78,-1,234,83,85,-3,84,-3,162],
    gt143 = [0,-174,668],
    gt144 = [0,-150,670],
    gt145 = [0,-204,671,520,521,522,-20,525,424,425,-39,426,427,-6,526,85,-3,84],
    gt146 = [0,-206,674,522,-20,525,424,425,-39,426,427,-6,526,85,-3,84],
    gt147 = [0,-207,675,-20,525,424,425,-39,426,427,-6,526,85,-3,84],
    gt148 = [0,-187,676,532,531,534,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt149 = [0,-183,681,-71,334,303,304,-18,333,302,83,85,-3,84],
    gt150 = [0,-4,683],
    gt151 = [0,-4,684],
    gt152 = [0,-6,687,563,562,-286,686,-1,141,-3,690,-3,689],
    gt153 = [0,-6,560,563,562,-278,559,-1,555,694,556,-10,561,558,565],
    gt154 = [0,-296,698,141,-3,140],
    gt155 = [0,-6,560,563,562,-278,559,-3,699,-10,561,558,565],
    gt156 = [0,-304,703],
    gt157 = [0,-288,707],
    gt158 = [0,-127,709,-3,367,-1,368,-143,369,83,85,-3,84],
    gt159 = [0,-133,710,-143,170,83,85,-3,84],
    gt160 = [0,-135,712,-2,380,-138,381,83,85,-3,84],
    gt161 = [0,-277,713,83,85,-3,84],
    gt162 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,714,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt163 = [0,-207,418,-19,716,420,424,425,416,-38,426,427,-3,417,-1,234,421,85,-3,84],
    gt164 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,717,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt165 = [0,-186,718,719,532,531,534,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt166 = [0,-187,723,532,531,534,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt167 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-1,728,-2,74,-1,230,-6,80,-3,440,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt168 = [0,-184,231,-8,45,106,-4,104,-1,232,-10,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,729,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt169 = [0,-255,731,303,304,-18,730,302,83,85,-3,84],
    gt170 = [0,-228,482,424,425,-27,733,-3,735,-1,481,-5,426,427,-4,483,302,421,85,-3,84],
    gt171 = [0,-255,492,303,304,-5,736,491,-11,483,302,83,85,-3,84],
    gt172 = [0,-235,739,-19,492,303,304,-3,741,-1,490,491,740,-10,483,302,83,85,-3,84],
    gt173 = [0,-145,742,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt174 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,743,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt175 = [0,-145,744,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt176 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,745,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt177 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,748,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt178 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,750,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt179 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,751,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt180 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,753,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt181 = [0,-158,656,-96,757,303,304,-18,756,302,83,85,-3,84],
    gt182 = [0,-158,659,-96,757,303,304,-18,756,302,83,85,-3,84],
    gt183 = [0,-165,758],
    gt184 = [0,-145,760,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt185 = [0,-175,761,-79,763,303,304,-18,762,302,83,85,-3,84],
    gt186 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,768,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt187 = [0,-189,771,772,-64,492,303,304,-5,535,491,533,-10,483,302,83,85,-3,84],
    gt188 = [0,-4,773],
    gt189 = [0,-6,775,563,562,-297,778,777,776,779],
    gt190 = [0,-306,778,777,787,779],
    gt191 = [0,-296,789,141,-3,140],
    gt192 = [0,-296,790,141,-3,140],
    gt193 = [0,-292,792,338,339,-2,141,-3,342],
    gt194 = [0,-292,794,338,339,-2,141,-3,342],
    gt195 = [0,-292,796,338,339,-2,141,-3,342],
    gt196 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,798,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt197 = [0,-288,800],
    gt198 = [0,-190,805,-17,804,-46,492,303,304,-5,535,491,-11,483,302,83,85,-3,84],
    gt199 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,809,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt200 = [0,-255,492,303,304,-5,638,491,815,-10,483,302,83,85,-3,84],
    gt201 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,820,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt202 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,822,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt203 = [0,-145,825,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt204 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,828,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt205 = [0,-145,831,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt206 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,832,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt207 = [0,-166,834,836,835],
    gt208 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,841,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt209 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,843,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt210 = [0,-306,848,-2,779],
    gt211 = [0,-296,850,141,-3,140],
    gt212 = [0,-9,854,859,857,862,858,856,865,863,-2,864,-5,860,-1,892,-4,893,-9,891,-38,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt213 = [0,-139,895,897,182,181,898,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt214 = [0,-139,900,897,182,181,898,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt215 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,910,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt216 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,912,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt217 = [0,-145,916,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt218 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,918,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt219 = [0,-145,921,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt220 = [0,-145,923,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt221 = [0,-145,924,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt222 = [0,-145,925,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt223 = [0,-145,926,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt224 = [0,-145,928,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt225 = [0,-145,929,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt226 = [0,-167,933,931],
    gt227 = [0,-166,934,836],
    gt228 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,936,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt229 = [0,-150,938],
    gt230 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,939,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt231 = [0,-9,944,859,857,862,858,856,865,863,-2,864,-5,860,-1,892,-4,893,-9,891,-38,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt232 = [0,-10,949,-1,862,948,-1,865,863,-2,864,-5,860,-1,892,-4,893,-9,891,-38,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt233 = [0,-12,950,-2,865,863,-2,864,-5,951,-1,892,-4,893,-9,891,-38,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt234 = [0,-19,961,-5,951,-1,892,-4,893,-9,891,-59,962,-1,960,959,-1,963,-3,878,-3,964],
    gt235 = [0,-79,966,965,-1,870,-1,889,871,968,967,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt236 = [0,-82,973,-1,889,974,-6,880,881,882,-1,883,-3,884,890],
    gt237 = [0,-84,889,975,-6,976,881,882,-1,883,-3,884,890],
    gt238 = [0,-84,977,-16,890],
    gt239 = [0,-111,878,-3,980],
    gt240 = [0,-112,984,982,983],
    gt241 = [0,-111,878,-3,990],
    gt242 = [0,-111,878,-3,991],
    gt243 = [0,-89,876,993,992,-19,878,-3,875],
    gt244 = [0,-100,996,-10,878,-3,995],
    gt245 = [0,-83,998,-16,999],
    gt246 = [0,-139,1003,897,182,181,898,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt247 = [0,-139,1007,897,182,181,898,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt248 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,1013,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt249 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,1015,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt250 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,1016,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt251 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,1018,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt252 = [0,-145,1023,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt253 = [0,-145,1024,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt254 = [0,-145,1025,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt255 = [0,-145,1026,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt256 = [0,-145,1027,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt257 = [0,-167,1028],
    gt258 = [0,-167,933],
    gt259 = [0,-141,182,181,1032,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt260 = [0,-21,1039,-53,1042,-1,1038,1041],
    gt261 = [0,-41,1046,-1,1049,-1,1047,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt262 = [0,-28,1062,-49,1064],
    gt263 = [0,-36,1065,1067,1069,1072,1071,-20,1070,-49,878,-3,1074],
    gt264 = [0,-19,961,-5,951,-1,892,-4,893,-9,891,-59,962,-1,960,1075,-1,963,-3,878,-3,964],
    gt265 = [0,-81,1076,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt266 = [0,-19,1079,-5,951,-1,892,-4,893,-9,891,-59,962,-1,1080,-2,963,-3,878,-3,964],
    gt267 = [0,-79,1083,-2,870,-1,889,871,968,967,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt268 = [0,-82,870,-1,889,871,1084,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt269 = [0,-84,889,1085,-6,976,881,882,-1,883,-3,884,890],
    gt270 = [0,-100,996],
    gt271 = [0,-112,1087,-1,1086],
    gt272 = [0,-97,1089],
    gt273 = [0,-99,1095],
    gt274 = [0,-111,878,-3,995],
    gt275 = [0,-100,1097],
    gt276 = [0,-184,231,-8,45,106,-4,104,-1,232,-7,42,41,1106,46,70,72,75,76,102,71,103,-4,74,-1,230,-6,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,-1,78,107,285,83,85,-3,84,-3,162],
    gt277 = [0,-141,182,181,627,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-5,1112,770,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt278 = [0,-145,1114,-2,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-15,45,106,-4,104,-9,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt279 = [0,-141,182,181,1116,183,22,23,126,30,24,38,28,25,29,-2,112,-2,31,32,33,35,34,113,-4,26,-2,36,-3,37,27,-2,127,131,-3,129,-7,45,106,-4,104,125,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-8,80,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,81,-11,79,-3,91,92,90,89,108,78,107,82,83,85,-3,84,-3,162],
    gt280 = [0,-21,1120,-53,1042,-2,1041],
    gt281 = [0,-23,1122,-17,1123,-1,1049,-1,1047,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt282 = [0,-77,1125],
    gt283 = [0,-77,1126],
    gt284 = [0,-70,1130,-40,878,-3,1131],
    gt285 = [0,-44,1132],
    gt286 = [0,-49,1136,1134,-1,1138,1135],
    gt287 = [0,-55,1140,-1,1058,-3,1059,-49,878,-3,1074],
    gt288 = [0,-46,1051,1141,1053,-2,1054,-2,1052,1055,1142,1058,-3,1059,1145,-3,1147,1149,1146,1148,-1,1152,-2,1151,-36,878,-3,1143],
    gt289 = [0,-37,1156,1069,1072,1071,-20,1070,-49,878,-3,1074],
    gt290 = [0,-33,1159,1158,1157],
    gt291 = [0,-36,1162,1067,1069,1072,1071,-20,1070,-45,1163,-3,878,-3,1164],
    gt292 = [0,-102,1170,-4,963,-3,878,-3,964],
    gt293 = [0,-108,1174,1172,1171],
    gt294 = [0,-95,1178,-15,878,-3,1179],
    gt295 = [0,-81,1182,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt296 = [0,-23,1194,-17,1195,-1,1049,-1,1047,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt297 = [0,-41,1196,-1,1049,-1,1047,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt298 = [0,-78,1200],
    gt299 = [0,-15,865,1203,1202,1201,-62,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt300 = [0,-43,1049,-1,1204,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt301 = [0,-44,1205],
    gt302 = [0,-46,1206,-1,1053,-2,1054,-3,1207,-1,1058,-3,1059,-49,878,-3,1074],
    gt303 = [0,-49,1208],
    gt304 = [0,-52,1209],
    gt305 = [0,-55,1210,-1,1058,-3,1059,-49,878,-3,1074],
    gt306 = [0,-55,1211,-1,1058,-3,1059,-49,878,-3,1074],
    gt307 = [0,-58,1216,-1,1214],
    gt308 = [0,-63,1220],
    gt309 = [0,-63,1226,1227,1228],
    gt310 = [0,-73,1233],
    gt311 = [0,-58,1216,-1,1238],
    gt312 = [0,-26,1240,-2,1242,1241,1243,-40,1246],
    gt313 = [0,-15,865,1203,1202,1248,-62,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt314 = [0,-33,1159,1249],
    gt315 = [0,-37,1250,1069,1072,1071,-20,1070,-49,878,-3,1074],
    gt316 = [0,-81,1253,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt317 = [0,-106,1255,-1,1174,1172,1256],
    gt318 = [0,-108,1258],
    gt319 = [0,-108,1174,1172,1259],
    gt320 = [0,-98,1260],
    gt321 = [0,-41,1268,-1,1049,-1,1047,1051,1048,1053,-2,1054,-2,1052,1055,-1,1058,-3,1059,-8,1050,-40,878,-3,1060],
    gt322 = [0,-22,1269,-13,1270,1067,1069,1072,1071,-20,1070,-45,1271,-3,878,-3,1272],
    gt323 = [0,-15,865,1275,-64,867,870,-1,889,871,868,-1,869,876,873,872,880,881,882,-1,883,-3,884,890,-9,878,-3,875],
    gt324 = [0,-49,1136,1134],
    gt325 = [0,-58,1277],
    gt326 = [0,-67,1278,-1,1279,-1,1152,-2,1151,-36,878,-3,1280],
    gt327 = [0,-67,1281,-1,1279,-1,1152,-2,1151,-36,878,-3,1280],
    gt328 = [0,-69,1282,-41,878,-3,1280],
    gt329 = [0,-111,878,-3,1283],
    gt330 = [0,-111,878,-3,1284],
    gt331 = [0,-29,1242,1288,1243,-40,1246],
    gt332 = [0,-108,1174,1172,1256],
    gt333 = [0,-64,1298],
    gt334 = [0,-65,1301],
    gt335 = [0,-19,961,-5,951,-1,892,-4,893,-9,891,-59,962,-1,960,1304,-1,963,-3,878,-3,964],
    gt336 = [0,-31,1305,-40,1246],
    gt337 = [0,-67,1306,-1,1279,-1,1152,-2,1151,-36,878,-3,1280],
    gt338 = [0,-67,1307,-1,1279,-1,1152,-2,1151,-36,878,-3,1280],

        // State action lookup maps
        sm0=[0,-1,1,2,-1,0,-4,0,-6,3,-1,4,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-2,12,-2,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm1=[0,47,-3,0,-4,0],
    sm2=[0,48,-3,0,-4,0],
    sm3=[0,49,-3,0,-4,0,-4,-1],
    sm4=[0,-4,0,-4,0,-8,4],
    sm5=[0,50,-3,0,-4,0,-4,-1],
    sm6=[0,-4,0,-4,0,-8,51],
    sm7=[0,-4,0,-4,0,-8,52],
    sm8=[0,-2,53,-1,0,-4,0,-6,54,-138,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],
    sm9=[0,73,-3,0,-4,0,-4,-1,-2,74,74,74,74,-2,74,-17,74,74,74,-1,74,-1,74,-4,74,-1,74,-1,74,74,-1,74,-1,74,-1,74,-1,74,-2,74,-45,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,-4,74,74],
    sm10=[0,75,-3,0,-4,0,-4,-1],
    sm11=[0,76,-3,0,-4,0,-4,-1],
    sm12=[0,77,-3,0,-4,0,-4,-1],
    sm13=[0,78,1,2,-1,0,-4,0,-4,-1,-1,3,-1,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-2,12,-2,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm14=[0,80,80,80,-1,0,-4,0,-4,-1,-1,80,-1,80,-1,80,-3,80,-27,80,80,-7,80,-6,80,-5,80,-2,80,-2,80,-1,80,80,80,80,80,-1,80,80,80,80,80,80,-1,80,-2,80,80,80,80,-2,80,-4,80,80,-2,80,-22,80,-1,80,80,80,80,80,80,-4,80,80,80,80,80,80],
    sm15=[0,81,81,81,-1,0,-4,0,-4,-1,-1,81,-1,81,-1,81,-3,81,-27,81,81,-7,81,-6,81,-5,81,-2,81,-2,81,-1,81,81,81,81,81,-1,81,81,81,81,81,81,-1,81,-2,81,81,81,81,-2,81,-4,81,81,-2,81,-22,81,-1,81,81,81,81,81,81,-4,81,81,81,81,81,81],
    sm16=[0,82,82,82,-1,0,-4,0,-4,-1,-1,82,-1,82,-1,82,-3,82,-27,82,82,-7,82,-6,82,-5,82,-2,82,-2,82,-1,82,82,82,82,82,-1,82,82,82,82,82,82,-1,82,-2,82,82,82,82,-2,82,-4,82,82,-2,82,-22,82,-1,82,82,82,82,82,82,-4,82,82,82,82,82,82],
    sm17=[0,83,83,83,-1,0,-4,0,-4,-1,-1,83,-1,83,-1,83,-3,83,-27,83,83,-7,83,-6,83,-5,83,-2,83,-2,83,-1,83,83,83,83,83,-1,83,83,83,83,83,83,-1,83,-2,83,83,83,83,-2,83,-4,83,83,-2,83,-22,83,-1,83,83,83,83,83,83,-4,83,83,83,83,83,83],
    sm18=[0,-2,2,-1,0,-4,0,-4,-1,-9,84,-31,85,-17,11,-73,41,42,-3,46],
    sm19=[0,-4,0,-4,0,-4,-1,-9,86,-31,87,-21,88,-3,14,-16,27,28,29,-2,30],
    sm20=[0,89,89,89,-1,0,-4,0,-4,-1,89,89,-1,89,-1,89,-3,89,-1,89,-25,89,89,-7,89,-6,89,-5,89,-2,89,89,-1,89,-1,89,89,89,89,89,-1,89,89,89,89,89,89,89,89,-2,89,89,89,89,-2,89,-4,89,89,-2,89,-22,89,-1,89,89,89,89,89,89,-4,89,89,89,89,89,89],
    sm21=[0,90,90,90,-1,0,-4,0,-4,-1,90,90,-1,90,-1,90,-3,90,-1,90,-25,90,90,-7,90,-6,90,-5,90,-2,90,90,-1,90,90,90,90,90,90,90,-1,90,90,90,90,90,90,90,90,-2,90,90,90,90,-2,90,-4,90,90,-2,90,-22,90,-1,90,90,90,90,90,90,-4,90,90,90,90,90,90],
    sm22=[0,91,91,91,-1,0,-4,0,-4,-1,91,91,-1,91,-1,91,-3,91,-1,91,-25,91,91,-7,91,-6,91,-5,91,-2,91,91,-1,91,91,91,91,91,91,91,-1,91,91,91,91,91,91,91,91,-2,91,91,91,91,-2,91,-4,91,91,-2,91,-22,91,-1,91,91,91,91,91,91,-4,91,91,91,91,91,91],
    sm23=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm24=[0,-4,0,-4,0,-4,-1,-53,92],
    sm25=[0,-4,0,-4,0,-4,-1,-6,93,-1,94,-38,93,-5,93,-2,93],
    sm26=[0,-4,0,-4,0,-4,-1,-6,95,-1,95,-38,95,-5,95,-2,95],
    sm27=[0,-4,0,-4,0,-4,-1,-6,96,-1,96,-38,96,-5,96,-2,96],
    sm28=[0,97,97,97,-1,0,-4,0,-4,-1,-1,97,-1,97,-1,97,97,-1,97,97,-1,97,-25,97,97,-7,97,97,-5,97,-2,97,-2,97,-2,97,-2,97,-1,97,97,97,97,97,-1,97,97,97,97,97,97,-1,97,-2,97,97,97,97,-2,97,-4,97,97,-2,97,-22,97,-1,97,97,97,97,97,97,-4,97,97,97,97,97,97],
    sm29=[0,98,98,98,-1,0,-4,0,-4,-1,-1,98,98,98,98,98,98,-1,98,98,-1,98,-14,98,98,99,-1,98,-1,98,-4,98,98,98,-1,98,98,-3,98,98,100,-1,101,-2,98,-2,98,-2,98,-2,98,-2,98,-1,98,98,98,98,98,-1,98,98,98,98,98,98,-1,98,-2,98,98,98,98,-2,98,-4,98,98,-2,98,102,103,104,105,106,107,108,109,110,111,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,112,113,-4,98,98,98,98,98,98],
    sm30=[0,114,114,114,-1,0,-4,0,-4,-1,-1,114,-1,114,-1,114,114,-1,114,114,-1,114,-25,114,114,115,-6,114,114,-5,114,-2,114,-2,114,-2,114,-2,114,-1,114,114,114,114,114,-1,114,114,114,114,114,114,-1,114,-2,114,114,114,114,-2,114,-4,114,114,-2,114,-10,116,-11,114,-1,114,114,114,114,114,114,-4,114,114,114,114,114,114],
    sm31=[0,117,117,117,-1,0,-4,0,-4,-1,-1,117,-1,117,-1,117,117,-1,117,117,-1,117,-25,117,117,117,-6,117,117,-5,117,-2,117,-2,117,-2,117,-2,117,-1,117,117,117,117,117,-1,117,117,117,117,117,117,-1,117,-2,117,117,117,117,-2,117,-4,117,117,-2,117,-10,117,118,-10,117,-1,117,117,117,117,117,117,-4,117,117,117,117,117,117],
    sm32=[0,119,119,119,-1,0,-4,0,-4,-1,-1,119,-1,119,-1,119,119,-1,119,119,-1,119,-25,119,119,119,-2,120,-3,119,119,-5,119,-2,119,-2,119,-2,119,-2,119,-1,119,119,119,119,119,-1,119,119,119,119,119,119,-1,119,-2,119,119,119,119,-2,119,-4,119,119,-2,119,-10,119,119,-10,119,-1,119,119,119,119,119,119,-4,119,119,119,119,119,119],
    sm33=[0,121,121,121,-1,0,-4,0,-4,-1,-1,121,-1,121,-1,121,121,-1,121,121,-1,121,-25,121,121,121,-2,121,-3,121,121,-5,121,-2,121,-2,121,-2,121,-2,121,-1,121,121,121,121,121,-1,121,121,121,121,121,121,-1,121,-2,121,121,121,121,-2,121,-4,121,121,-2,121,-10,121,121,122,-9,121,-1,121,121,121,121,121,121,-4,121,121,121,121,121,121],
    sm34=[0,123,123,123,-1,0,-4,0,-4,-1,-1,123,-1,123,-1,123,123,-1,123,123,-1,123,-25,123,123,123,-2,123,-3,123,123,-5,123,-2,123,-2,123,-2,123,-2,123,-1,123,123,123,123,123,-1,123,123,123,123,123,123,-1,123,-2,123,123,123,123,-2,123,-4,123,123,-2,123,-10,123,123,123,124,-8,123,-1,123,123,123,123,123,123,-4,123,123,123,123,123,123],
    sm35=[0,125,125,125,-1,0,-4,0,-4,-1,-1,125,-1,125,-1,125,125,-1,125,125,-1,125,-25,125,125,125,-2,125,-3,125,125,-5,125,-2,125,-2,125,-2,125,-2,125,-1,125,125,125,125,125,-1,125,125,125,125,125,125,-1,125,-2,125,125,125,125,-2,125,-4,125,125,-2,125,-10,125,125,125,125,126,127,128,129,-4,125,-1,125,125,125,125,125,125,-4,125,125,125,125,125,125],
    sm36=[0,130,130,130,-1,0,-4,0,-4,-1,-1,130,131,132,-1,130,130,-1,130,130,-1,130,-14,133,134,-4,135,-4,130,130,130,-2,130,-3,130,130,-5,130,-2,130,-2,130,-2,130,-2,130,-1,130,130,130,130,130,-1,130,130,130,130,130,130,-1,130,-2,130,130,130,130,-2,130,-4,130,130,-2,130,-10,130,130,130,130,130,130,130,130,136,-3,130,-1,130,130,130,130,130,130,-4,130,130,130,130,130,130],
    sm37=[0,137,137,137,-1,0,-4,0,-4,-1,-1,137,137,137,-1,137,137,-1,137,137,-1,137,-14,137,137,-4,137,-4,137,137,137,-2,137,-3,137,137,-5,137,-2,137,-2,137,-2,137,-2,137,-1,137,137,137,137,137,-1,137,137,137,137,137,137,-1,137,-2,137,137,137,137,-2,137,-4,137,137,-2,137,-10,137,137,137,137,137,137,137,137,137,138,139,140,137,-1,137,137,137,137,137,137,-4,137,137,137,137,137,137],
    sm38=[0,141,141,141,-1,0,-4,0,-4,-1,-1,141,141,141,-1,141,141,-1,141,141,-1,141,-14,141,141,-4,141,-4,142,141,141,-2,141,-3,141,141,-5,141,-2,141,-2,141,-2,141,-2,141,-1,141,141,141,141,141,-1,141,141,141,141,141,141,-1,141,-2,141,141,141,141,-2,141,-4,141,141,-2,141,-10,141,141,141,141,141,141,141,141,141,141,141,141,143,-1,141,141,141,141,141,141,-4,141,141,141,141,141,141],
    sm39=[0,144,144,144,-1,0,-4,0,-4,-1,-1,144,144,144,145,144,144,-1,144,144,-1,144,-14,144,144,-2,146,-1,144,-4,144,144,144,-1,147,144,-3,144,144,-5,144,-2,144,-2,144,-2,144,-2,144,-1,144,144,144,144,144,-1,144,144,144,144,144,144,-1,144,-2,144,144,144,144,-2,144,-4,144,144,-2,144,-10,144,144,144,144,144,144,144,144,144,144,144,144,144,-1,144,144,144,144,144,144,-4,144,144,144,144,144,144],
    sm40=[0,148,148,148,-1,0,-4,0,-4,-1,-1,148,148,148,148,148,148,-1,148,148,-1,148,-14,148,148,-2,148,-1,148,-4,148,148,148,-1,148,148,-3,148,148,-5,148,-2,148,-2,148,-2,148,-2,148,-1,148,148,148,148,148,-1,148,148,148,148,148,148,-1,148,-2,148,148,148,148,-2,148,-4,148,148,-2,148,-10,148,148,148,148,148,148,148,148,148,148,148,148,148,-1,148,148,148,148,148,148,-4,148,148,148,148,148,148],
    sm41=[0,149,149,149,-1,0,-4,0,-4,-1,-1,149,149,149,149,149,149,-1,149,149,-1,149,-14,149,149,-2,149,-1,149,-4,149,149,149,-1,149,149,-3,149,149,-5,149,-2,149,-2,149,-2,149,-2,149,-1,149,149,149,149,149,-1,149,149,149,149,149,149,-1,149,-2,149,149,149,149,-2,149,-4,149,149,-2,149,-10,149,149,149,149,149,149,149,149,149,149,149,149,149,-1,149,149,149,149,149,149,-4,149,149,149,149,149,149],
    sm42=[0,150,150,150,-1,0,-4,0,-4,-1,-1,150,150,150,150,150,150,-1,150,150,-1,150,-14,150,150,-2,150,-1,150,-4,150,150,150,-1,150,150,-3,150,150,-5,150,-2,150,-2,150,-2,150,-2,150,-1,150,150,150,150,150,-1,150,150,150,150,150,150,-1,150,-2,150,150,150,150,-2,150,-4,150,150,-2,150,-10,150,150,150,150,150,150,150,150,150,150,150,150,150,151,150,150,150,150,150,150,-4,150,150,150,150,150,150],
    sm43=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm44=[0,150,150,150,-1,0,-4,0,-4,-1,-1,150,150,150,150,150,150,-1,150,150,-1,150,-14,150,150,-2,150,-1,150,-4,150,150,150,-1,150,150,-3,150,150,-5,150,-2,150,-2,150,-2,150,-2,150,-1,150,150,150,150,150,-1,150,150,150,150,150,150,-1,150,-2,150,150,150,150,-2,150,-4,150,150,-2,150,-10,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,-4,150,150,150,150,150,150],
    sm45=[0,155,155,155,-1,0,-4,0,-4,-1,-1,155,155,155,155,155,155,-1,155,155,-1,155,-14,155,155,155,-1,155,-1,155,-4,155,155,155,-1,155,155,-3,155,155,155,-1,155,-2,155,-2,155,-2,155,-2,155,-2,155,-1,155,155,155,155,155,155,155,155,155,155,155,155,-1,155,-2,155,155,155,155,-2,155,-4,155,155,-2,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,-4,155,155,155,155,155,155],
    sm46=[0,155,155,155,-1,0,-4,0,-4,-1,-1,155,155,155,155,156,155,-1,155,155,-1,155,-14,155,155,155,-1,155,-1,155,-4,155,155,155,-1,155,155,-1,157,-1,158,155,155,-1,155,-2,155,-2,155,-2,155,-2,155,-2,155,-1,155,155,155,155,155,155,155,155,155,155,155,155,-1,155,-2,155,155,155,155,-2,155,-4,155,155,-2,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,155,-4,155,155,155,155,155,155],
    sm47=[0,159,159,159,-1,0,-4,0,-4,-1,-1,159,159,159,159,156,159,-1,159,159,-1,159,-14,159,159,159,-1,159,-1,159,-4,159,159,159,-1,159,159,-1,160,-1,161,159,159,-1,159,-2,159,-2,159,-2,159,-2,159,-2,159,-1,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,-2,159,159,159,159,-2,159,-4,159,159,-2,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,-4,159,159,159,159,159,159],
    sm48=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-34,162,-1,9,-12,11,-26,153,-2,154,-4,31,163,-2,33,-34,41,42,43,44,45,46],
    sm49=[0,164,164,164,-1,0,-4,0,-4,-1,-1,164,164,164,164,164,164,-1,164,164,-1,164,-14,164,164,164,-1,164,-1,164,-4,164,164,164,-1,164,164,-1,164,-1,164,164,164,-1,164,-2,164,-2,164,-2,164,-2,164,-2,164,-1,164,164,164,164,164,164,164,164,164,164,164,164,-1,164,-2,164,164,164,164,-2,164,-4,164,164,-2,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,164,-4,164,164,164,164,164,164],
    sm50=[0,165,165,165,-1,0,-4,0,-4,-1,-1,165,165,165,165,165,165,-1,165,165,-1,165,-14,165,165,165,-1,165,-1,165,-4,165,165,165,-1,165,165,-1,165,-1,165,165,165,-1,165,-2,165,-2,165,-2,165,-2,165,-2,165,-1,165,165,165,165,165,165,165,165,165,165,165,165,-1,165,-2,165,165,165,165,-2,165,-4,165,165,-2,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,165,-4,165,165,165,165,165,165],
    sm51=[0,166,166,166,-1,0,-4,0,-4,-1,-1,166,166,166,166,166,166,-1,166,166,-1,166,-14,166,166,166,-1,166,-1,166,-4,166,166,166,-1,166,166,-1,166,-1,166,166,166,-1,166,-2,166,-2,166,-2,166,-2,166,-2,166,-1,166,166,166,166,166,166,166,166,166,166,166,166,-1,166,-2,166,166,166,166,-2,166,-4,166,166,-2,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,-4,166,166,166,166,166,166],
    sm52=[0,166,166,166,-1,0,-4,0,-4,-1,-1,166,166,166,166,166,166,-1,166,166,-1,166,-14,166,166,166,-1,166,-1,166,-4,166,166,166,-1,166,166,-1,166,-1,166,166,166,-1,166,-2,166,-2,166,-2,166,-2,166,-2,166,-1,166,166,166,166,166,166,166,166,166,166,166,166,-1,166,-2,166,166,166,166,167,-1,166,-4,166,166,-2,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,166,-4,166,166,166,166,166,166],
    sm53=[0,-4,0,-4,0,-4,-1,-2,168,168,168,168,-2,168,-17,168,168,168,-1,168,-1,168,-4,168,-1,168,-1,168,168,-1,168,-1,168,-1,168,-1,168,-2,168,-2,169,-30,170,-11,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,-4,168,168],
    sm54=[0,171,171,171,-1,0,-4,0,-4,-1,-1,171,171,171,171,171,171,-1,171,171,-1,171,-4,171,-9,171,171,171,-1,171,-1,171,-4,171,171,171,-1,171,171,-1,171,-1,171,171,171,-1,171,-2,171,-2,171,-2,171,-1,171,171,-2,171,-1,171,171,171,171,171,171,171,171,171,171,171,171,-1,171,-2,171,171,171,171,171,-1,171,171,-3,171,171,-2,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,-4,171,171,171,171,171,171],
    sm55=[0,172,172,172,-1,0,-4,0,-4,-1,-1,172,172,172,172,172,172,-1,172,172,-1,172,-4,172,-9,172,172,172,-1,172,-1,172,-4,172,172,172,-1,172,172,-1,172,-1,172,172,172,-1,172,-2,172,-2,172,-2,172,-1,172,172,-2,172,-1,172,172,172,172,172,172,172,172,172,172,172,172,-1,172,-2,172,172,172,172,172,-1,172,172,-3,172,172,-2,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,-4,172,172,172,172,172,172],
    sm56=[0,173,174,175,-1,176,-4,177,-4,178,-1,173,173,173,173,173,173,-1,173,173,-1,173,-4,173,-9,173,173,173,-1,173,-1,173,-4,173,173,173,-1,173,173,179,173,-1,173,173,173,-1,173,-2,173,-2,173,-2,180,-1,173,173,-2,173,-1,173,173,173,173,173,173,173,173,173,173,173,173,-1,173,-2,173,173,173,173,173,-1,173,173,-3,173,173,-2,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,173,-4,173,173,173,173,173,181],
    sm57=[0,182,182,182,-1,182,-4,182,-4,182,-1,182,182,182,182,182,182,-1,182,182,-1,182,-4,182,-9,182,182,182,-1,182,-1,182,-4,182,182,182,-1,182,182,182,182,-1,182,182,182,-1,182,-2,182,-2,182,-2,182,-1,182,182,-2,182,-1,182,182,182,182,182,182,182,182,182,182,182,182,-1,182,-2,182,182,182,182,182,-1,182,182,-3,182,182,-2,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,182,-4,182,182,182,182,182,182],
    sm58=[0,183,183,183,-1,0,-4,0,-4,-1,-1,183,183,183,183,183,183,-1,183,183,-1,183,-14,183,183,183,-1,183,-1,183,-4,183,183,183,-1,183,183,-1,183,-1,183,183,183,-1,183,-2,183,-2,183,-2,183,-2,183,-2,183,-1,183,183,183,183,183,183,183,183,183,183,183,183,-1,183,-2,183,183,183,183,-2,183,-4,183,183,-2,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,183,-4,183,183,183,183,183,183],
    sm59=[0,184,184,184,-1,0,-4,0,-4,-1,-1,184,184,184,184,184,184,-1,184,184,-1,184,-14,184,184,184,-1,184,-1,184,-4,184,184,184,-1,184,184,-1,184,-1,184,184,184,-1,184,-2,184,-2,184,-2,184,-2,184,-2,184,-1,184,184,184,184,184,184,184,184,184,184,184,184,-1,184,-2,184,184,184,184,-2,184,-4,184,184,-2,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,-4,184,184,184,184,184,184],
    sm60=[0,185,185,185,-1,0,-4,0,-4,-1,-1,185,185,185,185,185,185,-1,185,185,-1,185,-14,185,185,185,-1,185,-1,185,-4,185,185,185,-1,185,185,-1,185,-1,185,185,185,-1,185,-2,185,-2,185,-2,185,-2,185,-2,185,-1,185,185,185,185,185,185,185,185,185,185,185,185,-1,185,-2,185,185,185,185,-2,185,-4,185,185,-2,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,-4,185,185,185,185,185,185],
    sm61=[0,-1,186,187,-1,188,189,190,191,192,0,-4,-1,-133,193],
    sm62=[0,-1,186,187,-1,188,189,190,191,192,0,-4,-1,-134,194],
    sm63=[0,195,195,195,-1,0,-4,0,-4,-1,-1,195,195,195,195,195,195,-1,195,195,-1,195,-14,195,195,195,-1,195,-1,195,-4,195,195,195,-1,195,195,-1,195,-1,195,195,195,-1,195,-2,195,-2,195,-2,195,-2,195,-2,195,-1,195,195,195,195,195,195,195,195,195,195,195,195,-1,195,-2,195,195,195,195,-2,195,-4,195,195,-2,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,-4,195,195,195,195,195,195],
    sm64=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-2,196,152,-27,7,8,-7,9,197,-11,11,-11,18,-14,153,-2,154,-4,31,32,-1,198,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm65=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,199,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-1,200,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm66=[0,-4,0,-4,0,-4,-1,-5,156,-38,201,-1,202],
    sm67=[0,203,203,203,-1,0,-4,0,-4,-1,-1,203,203,203,203,203,203,-1,203,203,-1,203,-14,203,203,203,-1,203,-1,203,-4,203,203,203,-1,203,203,-1,203,-1,203,203,203,-1,203,-2,203,-2,203,-2,203,-2,203,-2,203,-1,203,203,203,203,203,203,203,203,203,203,203,203,-1,203,-2,203,203,203,203,-2,203,-4,203,203,-2,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,203,-4,203,203,203,203,203,203],
    sm68=[0,204,204,204,-1,0,-4,0,-4,-1,-1,204,204,204,204,204,204,-1,204,204,-1,204,-14,204,204,204,-1,204,-1,204,-4,204,204,204,-1,204,204,-1,204,-1,204,204,204,-1,204,-2,204,-2,204,-2,204,-2,204,-2,204,-1,204,204,204,204,204,204,204,204,204,204,204,204,-1,204,-2,204,204,204,204,-2,204,-4,204,204,-2,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,204,-4,204,204,204,204,204,204],
    sm69=[0,-4,0,-4,0,-4,-1,-87,205],
    sm70=[0,-4,0,-4,0,-4,-1,-87,206],
    sm71=[0,-4,0,-4,0,-4,-1,-56,207],
    sm72=[0,-2,2,-1,0,-4,0,-4,-1,-9,208,-36,209,-12,11,-78,46],
    sm73=[0,210,210,210,-1,0,-4,0,-4,-1,210,210,-1,210,-1,210,-3,210,-1,210,-25,210,210,-7,210,-6,210,-5,210,-2,210,210,-1,210,210,210,210,210,210,210,-1,210,210,210,210,210,210,210,210,-2,210,210,210,210,-2,210,-4,210,210,-2,210,-22,210,-1,210,210,210,210,210,210,-4,210,210,210,210,210,210],
    sm74=[0,-4,0,-4,0,-4,-1,-5,211],
    sm75=[0,212,212,212,-1,0,-4,0,-4,-1,212,212,-1,212,-1,212,-3,212,-1,212,-25,212,212,-7,212,-6,212,-5,212,-2,212,212,-1,212,212,212,212,212,212,212,-1,212,212,212,212,212,212,212,212,-2,212,212,212,212,-2,212,-4,212,212,-2,212,-22,212,-1,212,212,212,212,212,212,-4,212,212,212,212,212,212],
    sm76=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-10,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm77=[0,-4,0,-4,0,-4,-1,-5,213],
    sm78=[0,-4,0,-4,0,-4,-1,-5,214,-65,215],
    sm79=[0,-4,0,-4,0,-4,-1,-5,216],
    sm80=[0,-2,2,-1,0,-4,0,-4,-1,-53,217,-5,11,-78,46],
    sm81=[0,-2,2,-1,0,-4,0,-4,-1,-53,218,-5,11,-78,46],
    sm82=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-6,219,-5,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm83=[0,-4,0,-4,0,-4,-1,-5,220],
    sm84=[0,-4,0,-4,0,-4,-1,-9,6],
    sm85=[0,-4,0,-4,0,-4,-1,-53,221],
    sm86=[0,222,222,222,-1,0,-4,0,-4,-1,222,222,-1,222,-1,222,-3,222,-1,222,-25,222,222,-7,222,-6,222,-5,222,-2,222,222,-1,222,-1,222,222,222,222,222,-1,222,222,222,222,222,222,222,222,-2,222,222,222,222,-2,222,-4,222,222,-2,222,-22,222,-1,222,222,222,222,222,222,-4,222,222,222,222,222,222],
    sm87=[0,-2,2,-1,0,-4,0,-4,-1,-9,223,-49,11,-30,224,-47,46],
    sm88=[0,225,225,225,-1,0,-4,0,-4,-1,225,225,-1,225,-1,225,-3,225,-1,225,-25,225,225,-7,225,-6,225,-5,225,-2,225,225,-1,225,-1,225,225,225,225,225,-1,225,225,225,225,225,225,225,225,-2,225,225,225,225,-2,225,-4,225,225,-2,225,-22,225,-1,225,225,225,225,225,225,-4,225,225,225,225,225,225],
    sm89=[0,-2,2,-1,0,-4,0,-4,-1,-5,226,-53,11,-78,46],
    sm90=[0,-2,227,-1,0,-4,0,-4,-1,-9,227,-36,227,-12,227,-78,227],
    sm91=[0,-2,228,-1,0,-4,0,-4,-1,-9,228,-36,228,-12,228,-78,228],
    sm92=[0,229,-3,0,-4,0],
    sm93=[0,-4,0,-4,0,-8,230],
    sm94=[0,73,-3,0,-4,0,-4,-1],
    sm95=[0,-2,53,-1,0,-4,0,-7,231,-1,232,-128,233,234],
    sm96=[0,-2,53,-1,0,-4,0,-4,-1,-2,235,-1,236,-128,233,234],
    sm97=[0,-2,53,-1,0,-4,0,-4,-1,-2,237,-1,238,-128,233,234],
    sm98=[0,-2,239,-1,0,-4,0,-4,-1,-2,239,-1,239,-128,239,239],
    sm99=[0,-2,240,-1,241,-4,242,-4,-1,-2,243,-1,243,-23,243,-27,244,-2,245,-61,246,-11,243,243],
    sm100=[0,-2,247,-1,247,-4,247,-4,-1,-2,247,-1,247,-23,247,-27,247,-2,247,-61,247,-11,247,247],
    sm101=[0,-2,248,-1,0,-4,0,-7,248,-1,248,-128,248,248],
    sm102=[0,-2,248,-1,0,-4,0,-4,-1,-2,248,-1,248,-128,248,248],
    sm103=[0,249,249,249,-1,0,-4,0,-4,-1,-1,249,-1,249,-1,249,-3,249,-27,249,249,-7,249,-6,249,-5,249,-2,249,-2,249,-1,249,249,249,249,249,-1,249,249,249,249,249,249,-1,249,-2,249,249,249,249,-2,249,-4,249,249,-2,249,-22,249,-1,249,249,249,249,249,249,-4,249,249,249,249,249,249],
    sm104=[0,74,74,74,-1,0,-4,0,-6,74,74,74,74,74,74,-1,74,74,-1,74,-14,74,74,74,-1,74,-1,74,-4,74,74,74,-1,74,74,-1,74,-1,74,74,74,-1,74,-2,74,-2,74,-2,74,-2,74,-2,74,-1,74,74,74,74,74,74,74,74,74,74,74,74,-1,74,-2,74,74,74,74,-2,74,-4,74,74,-2,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,-4,74,74,74,74,74,74],
    sm105=[0,-2,53,-1,0,-4,0,-4,-1,-140,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],
    sm106=[0,-4,0,-4,0,-4,-1,-16,250],
    sm107=[0,-4,0,-4,0,-4,-1,-53,251],
    sm108=[0,-4,0,-4,0,-4,-1,-8,252,-7,253],
    sm109=[0,-4,0,-4,0,-4,-1,-16,253],
    sm110=[0,-4,0,-4,0,-4,-1,-8,254,-7,254],
    sm111=[0,-4,0,-4,0,-4,-1,-8,255,-2,255,-4,255],
    sm112=[0,-4,0,-4,0,-4,-1,-61,256],
    sm113=[0,-2,2,-1,0,-4,0,-4,-1,-8,257,-2,258,-47,11,-78,46],
    sm114=[0,-4,0,-4,0,-4,-1,-53,259],
    sm115=[0,-4,0,-4,0,-4,-1,-16,250,-36,260],
    sm116=[0,261,261,261,-1,0,-4,0,-4,-1,-1,261,-1,261,-1,261,-3,261,-27,261,261,-7,261,-6,261,-5,261,-2,261,-2,261,-1,261,261,261,261,261,-1,261,261,261,261,261,261,-1,261,-2,261,261,261,261,-2,261,-4,261,261,-2,261,-22,261,-1,261,261,261,261,261,261,-4,261,261,261,261,261,261],
    sm117=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-12,11,-11,18,-14,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm118=[0,-2,2,-1,0,-4,0,-4,-1,-8,262,-2,263,-47,11,-78,46],
    sm119=[0,-4,0,-4,0,-4,-1,-11,264],
    sm120=[0,-1,1,2,-1,0,-4,0,-4,-1,265,-2,79,-1,5,-3,6,-1,265,-25,7,8,-7,9,-6,10,-5,11,-3,265,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,265,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm121=[0,-1,266,266,-1,0,-4,0,-4,-1,266,-2,266,-1,266,-3,266,-1,266,-25,266,266,-7,266,-6,266,-5,266,-3,266,-1,266,-1,266,266,266,266,266,-1,266,266,266,266,266,266,266,266,-2,266,266,266,266,-2,266,-4,266,266,-2,266,-22,266,-1,266,266,266,266,266,266,-4,266,266,266,266,266,266],
    sm122=[0,-1,267,267,-1,0,-4,0,-4,-1,267,-2,267,-1,267,-3,267,-1,267,-25,267,267,-7,267,-6,267,-5,267,-3,267,-1,267,-1,267,267,267,267,267,-1,267,267,267,267,267,267,267,267,-2,267,267,267,267,-2,267,-4,267,267,-2,267,-22,267,-1,267,267,267,267,267,267,-4,267,267,267,267,267,267],
    sm123=[0,268,268,268,-1,0,-4,0,-4,-1,268,268,-1,268,-1,268,-3,268,-1,268,-25,268,268,-7,268,-6,268,-5,268,-2,268,268,-1,268,268,268,268,268,268,268,-1,268,268,268,268,268,268,268,268,-2,268,268,268,268,-2,268,-4,268,268,-2,268,-22,268,-1,268,268,268,268,268,268,-4,268,268,268,268,268,268],
    sm124=[0,269,269,269,-1,0,-4,0,-4,-1,-1,269,269,269,269,269,269,-1,269,269,-1,269,-14,269,269,-2,269,-1,269,-4,269,269,269,-1,269,269,-3,269,269,-5,269,-2,269,-2,269,-2,269,-2,269,-1,269,269,269,269,269,-1,269,269,269,269,269,269,-1,269,-2,269,269,269,269,-2,269,-4,269,269,-2,269,-10,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,269,-4,269,269,269,269,269,269],
    sm125=[0,270,270,270,-1,0,-4,0,-4,-1,-1,270,270,270,270,270,270,-1,270,270,-1,270,-14,270,270,-2,270,-1,270,-4,270,270,270,-1,270,270,-3,270,270,-5,270,-2,270,-2,270,-2,270,-2,270,-1,270,270,270,270,270,-1,270,270,270,270,270,270,-1,270,-2,270,270,270,270,-2,270,-4,270,270,-2,270,-10,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,270,-4,270,270,270,270,270,270],
    sm126=[0,-1,271,271,-1,0,-4,0,-4,-1,-3,271,-1,271,-3,271,-27,271,271,-7,271,-12,271,-11,271,-14,271,-2,271,-4,271,271,-2,271,-22,271,-1,271,271,271,271,271,271,-4,271,271,271,271,271,271],
    sm127=[0,272,272,272,-1,0,-4,0,-4,-1,-1,272,272,272,272,272,272,-1,272,272,-1,272,-14,272,272,-2,272,-1,272,-4,272,272,272,-1,272,272,-3,272,272,-5,272,-2,272,-2,272,-2,272,-2,272,-1,272,272,272,272,272,-1,272,272,272,272,272,272,-1,272,-2,272,272,272,272,-2,272,-4,272,272,-2,272,-10,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,-4,272,272,272,272,272,272],
    sm128=[0,98,98,98,-1,0,-4,0,-4,-1,-1,98,98,98,98,98,98,-1,98,98,-1,98,-14,98,98,-2,98,-1,98,-4,98,98,98,-1,98,98,-3,98,98,-5,98,-2,98,-2,98,-2,98,-2,98,-1,98,98,98,98,98,-1,98,98,98,98,98,98,-1,98,-2,98,98,98,98,-2,98,-4,98,98,-2,98,-10,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,112,113,-4,98,98,98,98,98,98],
    sm129=[0,168,168,168,-1,0,-4,0,-4,-1,-1,168,168,168,168,168,168,-1,168,168,-1,168,-14,168,168,168,-1,168,-1,168,-4,168,168,168,-1,168,168,-1,168,-1,168,168,168,-1,168,-2,168,-2,168,-2,168,-2,168,-2,168,-1,168,168,168,168,168,168,168,168,168,168,168,168,-1,168,-2,168,168,168,168,-2,168,-4,168,168,-2,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,-4,168,168,168,168,168,168],
    sm130=[0,-1,1,2,-1,0,-4,0,-4,-1,-8,273,-2,274,-34,275,-12,11,-32,276,277,-3,278,-35,41,42,-3,46],
    sm131=[0,-2,2,-1,0,-4,0,-4,-1,-5,279,-53,11,-78,46],
    sm132=[0,280,280,280,-1,0,-4,0,-4,-1,-1,280,280,280,280,280,280,-1,280,280,-1,280,-14,280,280,-2,280,-1,280,-4,280,280,280,-1,280,280,-3,280,280,-5,280,-2,280,-2,280,-2,280,-2,280,-1,280,280,280,280,280,-1,280,280,280,280,280,280,-1,280,-2,280,280,280,280,-2,280,-4,280,280,-2,280,-10,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,-4,280,280,280,280,280,280],
    sm133=[0,281,281,281,-1,0,-4,0,-4,-1,-1,281,281,281,281,281,281,-1,281,281,-1,281,-14,281,281,-2,281,-1,281,-4,281,281,281,-1,281,281,-3,281,281,-5,281,-2,281,-2,281,-2,281,-2,281,-1,281,281,281,281,281,-1,281,281,281,281,281,281,-1,281,-2,281,281,281,281,-2,281,-4,281,281,-2,281,-10,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,-4,281,281,281,281,281,281],
    sm134=[0,282,282,282,-1,0,-4,0,-4,-1,-1,282,282,282,282,282,282,-1,282,282,-1,282,-14,282,282,-2,282,-1,282,-4,282,282,282,-1,282,282,-3,282,282,-5,282,-2,282,-2,282,-2,282,-2,282,-1,282,282,282,282,282,-1,282,282,282,282,282,282,-1,282,-2,282,282,282,282,-2,282,-4,282,282,-2,282,-10,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,-4,282,282,282,282,282,282],
    sm135=[0,283,283,283,-1,0,-4,0,-4,-1,-1,283,283,283,283,283,283,-1,283,283,-1,283,-14,283,283,-2,283,-1,283,-4,283,283,283,-1,283,283,-3,283,283,-5,283,-2,283,-2,283,-2,283,-2,283,-1,283,283,283,283,283,-1,283,283,283,283,283,283,-1,283,-2,283,283,283,283,-2,283,-4,283,283,-2,283,-10,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,-4,283,283,283,283,283,283],
    sm136=[0,284,284,284,-1,0,-4,0,-4,-1,-1,284,284,284,284,284,284,-1,284,284,-1,284,-14,284,284,-2,284,-1,284,-4,284,284,284,-1,284,284,-3,284,284,-5,284,-2,284,-2,284,-2,284,-2,284,-1,284,284,284,284,284,-1,284,284,284,284,284,284,-1,284,-2,284,284,284,284,-2,284,-4,284,284,-2,284,-10,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,-4,284,284,284,284,284,284],
    sm137=[0,285,285,285,-1,0,-4,0,-4,-1,-1,285,285,285,285,285,285,-1,285,285,-1,285,-14,285,285,-2,285,-1,285,-4,285,285,285,-1,285,285,-3,285,285,-5,285,-2,285,-2,285,-2,285,-2,285,-1,285,285,285,285,285,-1,285,285,285,285,285,285,-1,285,-2,285,285,285,285,-2,285,-4,285,285,-2,285,-10,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,-4,285,285,285,285,285,285],
    sm138=[0,286,286,286,-1,0,-4,0,-4,-1,-1,286,286,286,286,286,286,-1,286,286,-1,286,-14,286,286,-2,286,-1,286,-4,286,286,286,-1,286,286,-3,286,286,-5,286,-2,286,-2,286,-2,286,-2,286,-1,286,286,286,286,286,-1,286,286,286,286,286,286,-1,286,-2,286,286,286,286,-2,286,-4,286,286,-2,286,-10,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,286,-4,286,286,286,286,286,286],
    sm139=[0,287,287,287,-1,0,-4,0,-4,-1,-1,287,287,287,287,287,287,-1,287,287,-1,287,-14,287,287,-2,287,-1,287,-4,287,287,287,-1,287,287,-3,287,287,-5,287,-2,287,-2,287,-2,287,-2,287,-1,287,287,287,287,287,-1,287,287,287,287,287,287,-1,287,-2,287,287,287,287,-2,287,-4,287,287,-2,287,-10,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,287,-4,287,287,287,287,287,287],
    sm140=[0,-2,2,-1,0,-4,0,-4,-1,-59,11,-78,46],
    sm141=[0,288,288,288,-1,0,-4,0,-4,-1,-1,288,288,288,288,288,288,-1,288,288,-1,288,-14,288,288,288,-1,288,-1,288,-4,288,288,288,-1,288,288,-1,288,-1,288,288,288,-1,288,-2,288,-2,288,-2,288,-2,288,-2,288,-1,288,288,288,288,288,288,288,288,288,288,288,288,-1,288,-2,288,288,288,288,-2,288,-4,288,288,-2,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,288,-4,288,288,288,288,288,288],
    sm142=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,289,-1,290,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-1,291,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm143=[0,292,292,292,-1,0,-4,0,-4,-1,-1,292,292,292,292,292,292,-1,292,292,-1,292,-14,292,292,292,-1,292,-1,292,-4,292,292,292,-1,292,292,-1,292,-1,292,292,292,-1,292,-2,292,-2,292,-2,292,-2,292,-2,292,-1,292,292,292,292,292,292,292,292,292,292,292,292,-1,292,-2,292,292,292,292,-2,292,-4,292,292,-2,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,292,-4,292,292,292,292,292,292],
    sm144=[0,293,293,293,-1,0,-4,0,-4,-1,-1,293,293,293,293,293,293,-1,293,293,-1,293,-14,293,293,293,-1,293,-1,293,-4,293,293,293,-1,293,293,-3,293,293,293,-1,293,-2,293,-2,293,-2,293,-2,293,-2,293,-1,293,293,293,293,293,293,293,293,293,293,293,293,-1,293,-2,293,293,293,293,-2,293,-4,293,293,-2,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,293,-4,293,293,293,293,293,293],
    sm145=[0,-4,0,-4,0,-4,-1,-96,294],
    sm146=[0,-4,0,-4,0,-4,-1,-44,201,-1,202],
    sm147=[0,295,174,175,-1,176,-4,177,-4,178,-1,295,295,295,295,295,295,-1,295,295,-1,295,-4,295,-9,295,295,295,-1,295,-1,295,-4,295,295,295,-1,295,295,179,295,-1,295,295,295,-1,295,-2,295,-2,295,-2,180,-1,295,295,-2,295,-1,295,295,295,295,295,295,295,295,295,295,295,295,-1,295,-2,295,295,295,295,295,-1,295,295,-3,295,295,-2,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,295,-4,295,295,295,295,295,181],
    sm148=[0,296,296,296,-1,0,-4,0,-4,-1,-1,296,296,296,296,296,296,-1,296,296,-1,296,-4,296,-9,296,296,296,-1,296,-1,296,-4,296,296,296,-1,296,296,-1,296,-1,296,296,296,-1,296,-2,296,-2,296,-2,296,-1,296,296,-2,296,-1,296,296,296,296,296,296,296,296,296,296,296,296,-1,296,-2,296,296,296,296,296,-1,296,296,-3,296,296,-2,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,296,-4,296,296,296,296,296,296],
    sm149=[0,297,297,297,-1,297,-4,297,-4,297,-1,297,297,297,297,297,297,-1,297,297,-1,297,-4,297,-9,297,297,297,-1,297,-1,297,-4,297,297,297,-1,297,297,297,297,-1,297,297,297,-1,297,-2,297,-2,297,-2,297,-1,297,297,-2,297,-1,297,297,297,297,297,297,297,297,297,297,297,297,-1,297,-2,297,297,297,297,297,-1,297,297,-3,297,297,-2,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,297,-4,297,297,297,297,297,297],
    sm150=[0,298,298,298,-1,298,-4,298,-4,298,-1,298,298,298,298,298,298,-1,298,298,-1,298,-4,298,-9,298,298,298,-1,298,-1,298,-4,298,298,298,-1,298,298,298,298,-1,298,298,298,-1,298,-2,298,-2,298,-2,298,-1,298,298,-2,298,-1,298,298,298,298,298,298,298,298,298,298,298,298,-1,298,-2,298,298,298,298,298,-1,298,298,-3,298,298,-2,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,-4,298,298,298,298,298,298],
    sm151=[0,299,299,299,-1,0,-4,0,-4,-1,-1,299,299,299,299,299,299,-1,299,299,-1,299,-4,299,-9,299,299,299,-1,299,-1,299,-4,299,299,299,-1,299,299,-1,299,-1,299,299,299,-1,299,-2,299,-2,299,-2,299,-1,299,299,-2,299,-1,299,299,299,299,299,299,299,299,299,299,299,299,-1,299,-2,299,299,299,299,299,-1,299,299,-3,299,299,-2,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,299,-4,299,299,299,299,299,299],
    sm152=[0,-1,186,187,-1,188,189,190,191,192,0,-4,-1,-133,300],
    sm153=[0,301,301,301,-1,0,-4,0,-4,-1,-1,301,301,301,301,301,301,-1,301,301,-1,301,-14,301,301,301,-1,301,-1,301,-4,301,301,301,-1,301,301,-1,301,-1,301,301,301,-1,301,-2,301,-2,301,-2,301,-2,301,-2,301,-1,301,301,301,301,301,301,301,301,301,301,301,301,-1,301,-2,301,301,301,301,-2,301,-4,301,301,-2,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,301,-4,301,301,301,301,301,301],
    sm154=[0,-1,302,302,-1,302,302,302,302,302,0,-4,-1,-133,302,302],
    sm155=[0,-1,303,303,-1,303,303,303,303,303,0,-4,-1,-133,303,303],
    sm156=[0,-1,186,187,-1,188,189,190,191,192,0,-4,-1,-134,304],
    sm157=[0,-4,0,-4,0,-4,-1,-8,305,-38,306],
    sm158=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-2,307,152,-27,7,8,-7,9,308,-11,11,-11,18,-14,153,-2,154,-4,31,32,-1,198,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm159=[0,309,309,309,-1,0,-4,0,-4,-1,-1,309,309,309,309,309,309,-1,309,309,-1,309,-14,309,309,309,-1,309,-1,309,-4,309,309,309,-1,309,309,-1,309,-1,309,309,309,-1,309,-2,309,-2,309,-2,309,-2,309,-2,309,-1,309,309,309,309,309,309,309,309,309,309,309,309,-1,309,-2,309,309,309,309,-2,309,-4,309,309,-2,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,-4,309,309,309,309,309,309],
    sm160=[0,-4,0,-4,0,-4,-1,-8,310,-38,310],
    sm161=[0,168,168,168,-1,0,-4,0,-4,-1,-1,168,168,168,168,168,168,-1,168,168,-1,168,-14,168,168,168,-1,168,-1,168,-4,168,168,168,-1,168,168,-1,168,-1,168,168,168,-1,168,-2,168,-2,168,-2,168,-2,168,-2,168,-1,168,168,168,168,168,168,168,168,168,168,168,168,-1,168,-2,168,168,168,168,170,-1,168,-4,168,168,-2,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,-4,168,168,168,168,168,168],
    sm162=[0,-1,311,311,-1,0,-4,0,-4,-1,-3,311,-1,311,-2,311,311,-27,311,311,-7,311,311,-11,311,-11,311,-14,311,-2,311,-4,311,311,-1,311,311,-22,311,-1,311,311,311,311,311,311,-4,311,311,311,311,311,311],
    sm163=[0,312,312,312,-1,0,-4,0,-4,-1,-1,312,312,312,312,312,312,-1,312,312,-1,312,-14,312,312,312,-1,312,-1,312,-4,312,312,312,-1,312,312,-1,312,-1,312,312,312,-1,312,-2,312,-2,312,-2,312,-2,312,-2,312,-1,312,312,312,312,312,312,312,312,312,312,312,312,-1,312,-2,312,312,312,312,312,-1,312,-4,312,312,-2,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,-4,312,312,312,312,312,312],
    sm164=[0,-4,0,-4,0,-4,-1,-6,313,-1,314],
    sm165=[0,315,315,315,-1,0,-4,0,-4,-1,-1,315,315,315,315,315,315,-1,315,315,-1,315,-14,315,315,315,-1,315,-1,315,-4,315,315,315,-1,315,315,-1,315,-1,315,315,315,-1,315,-2,315,-2,315,-2,315,-2,315,-2,315,-1,315,315,315,315,315,315,315,315,315,315,315,315,-1,315,-2,315,315,315,315,-2,315,-4,315,315,-2,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,-4,315,315,315,315,315,315],
    sm166=[0,316,316,316,-1,0,-4,0,-4,-1,-1,316,316,316,316,316,316,-1,316,316,-1,316,-14,316,316,-2,316,-1,316,-4,316,316,316,-1,316,316,-3,316,316,-5,316,-2,316,-2,316,-2,316,-2,316,-1,316,316,316,316,316,-1,316,316,316,316,316,316,-1,316,-2,316,316,316,316,-2,316,-4,316,316,-2,316,-10,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,-4,316,316,316,316,316,316],
    sm167=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,317,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm168=[0,318,318,318,-1,0,-4,0,-4,-1,318,318,-1,318,-1,318,-3,318,-1,318,-25,318,318,-7,318,-6,318,-5,318,-2,318,318,-1,318,318,318,318,318,318,318,-1,318,318,318,318,318,318,318,318,-2,318,318,318,318,-2,318,-4,318,318,-2,318,-22,318,-1,318,318,318,318,318,318,-4,318,318,318,318,318,318],
    sm169=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,-2,29,-7,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm170=[0,-4,0,-4,0,-4,-1,-8,319,-44,320],
    sm171=[0,-4,0,-4,0,-4,-1,-8,321,-44,321],
    sm172=[0,-4,0,-4,0,-4,-1,-8,322,-19,323,-24,322],
    sm173=[0,-4,0,-4,0,-4,-1,-28,323],
    sm174=[0,-4,0,-4,0,-4,-1,-5,170,170,-1,170,170,-1,170,-16,170,-3,170,-14,170,-5,170,-18,170,-17,170],
    sm175=[0,-4,0,-4,0,-4,-1,-6,324,-1,324,-2,324,-16,324,-3,324,-14,324,-24,324],
    sm176=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,325,-34,275,-12,11,-37,326,-35,41,42,-3,46],
    sm177=[0,-2,2,-1,0,-4,0,-4,-1,-8,196,208,-36,209,327,-11,11,-37,328,-40,46],
    sm178=[0,-4,0,-4,0,-4,-1,-69,329],
    sm179=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-6,330,-5,11,-7,331,-3,18,-12,27,28,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm180=[0,-4,0,-4,0,-4,-1,-5,332],
    sm181=[0,-4,0,-4,0,-4,-1,-53,333],
    sm182=[0,334,334,334,-1,0,-4,0,-4,-1,334,334,-1,334,-1,334,-3,334,-1,334,-25,334,334,-7,334,-6,334,-5,334,-2,334,334,-1,334,334,334,334,334,334,334,-1,334,334,334,334,334,334,334,334,-2,334,334,334,334,-2,334,-4,334,334,-2,334,-22,334,-1,334,334,334,334,334,334,-4,334,334,334,334,334,334],
    sm183=[0,-4,0,-4,0,-4,-1,-53,169],
    sm184=[0,-4,0,-4,0,-4,-1,-53,335],
    sm185=[0,336,336,336,-1,0,-4,0,-4,-1,336,336,-1,336,-1,336,-3,336,-1,336,-25,336,336,-7,336,-6,336,-5,336,-2,336,336,-1,336,336,336,336,336,336,336,-1,336,336,336,336,336,336,336,336,-2,336,336,336,336,-2,336,-4,336,336,-2,336,-22,336,-1,336,336,336,336,336,336,-4,336,336,336,336,336,336],
    sm186=[0,-4,0,-4,0,-4,-1,-53,337],
    sm187=[0,338,338,338,-1,0,-4,0,-4,-1,338,338,-1,338,-1,338,-3,338,-1,338,-25,338,338,-7,338,-6,338,-5,338,-2,338,338,-1,338,338,338,338,338,338,338,-1,338,338,338,338,338,338,338,338,-2,338,338,338,338,-2,338,-4,338,338,-2,338,-22,338,-1,338,338,338,338,338,338,-4,338,338,338,338,338,338],
    sm188=[0,-4,0,-4,0,-4,-1,-53,339],
    sm189=[0,-4,0,-4,0,-4,-1,-81,340,341],
    sm190=[0,342,342,342,-1,0,-4,0,-4,-1,342,342,-1,342,-1,342,-3,342,-1,342,-25,342,342,-7,342,-6,342,-5,342,-2,342,342,-1,342,342,342,342,342,342,342,-1,342,342,342,342,342,342,342,342,-2,342,342,342,342,-2,342,-4,342,342,-2,342,-22,342,-1,342,342,342,342,342,342,-4,342,342,342,342,342,342],
    sm191=[0,-4,0,-4,0,-4,-1,-9,223,-80,224],
    sm192=[0,343,343,343,-1,0,-4,0,-4,-1,343,343,-1,343,-1,343,-3,343,-1,343,-25,343,343,-7,343,-6,343,-5,343,-2,343,343,-1,343,-1,343,343,343,343,343,-1,343,343,343,343,343,343,343,343,-2,343,343,343,343,-2,343,-4,343,343,-2,343,-22,343,-1,343,343,343,343,343,343,-4,343,343,343,343,343,343],
    sm193=[0,-4,0,-4,0,-4,-1,-9,344],
    sm194=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,345,-34,275,-6,346,-5,11,-31,347,276,277,-39,41,42,-3,46],
    sm195=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-36,9,-12,11,-26,153,-2,154,-4,31,32,-2,33,-34,41,42,43,44,45,46],
    sm196=[0,-4,0,-4,0,-4,-1,-5,348],
    sm197=[0,-2,2,-1,0,-4,0,-4,-1,-6,349,-2,208,-36,209,-12,11,-37,328,-40,46],
    sm198=[0,-4,0,-4,0,-4,-1,-8,350,-44,351],
    sm199=[0,-4,0,-4,0,-4,-1,-8,352,-44,352],
    sm200=[0,-2,53,-1,0,-4,0,-7,353,-1,354,-128,233,234],
    sm201=[0,-4,0,-4,0,-7,355],
    sm202=[0,-4,0,-4,0,-5,356,-2,357],
    sm203=[0,-2,358,-1,0,-4,0,-4,-1,-2,358,-1,358,-128,358,358],
    sm204=[0,-2,359,-1,0,-4,0,-4,-1,-2,359,-1,359,-23,360,-104,359,359],
    sm205=[0,-2,53,-1,0,-4,0,-4,-1,-134,361],
    sm206=[0,-2,53,-1,0,-4,0,-4,-1,-133,362],
    sm207=[0,-2,363,-1,0,-4,0,-4,-1,-2,363,-1,363,-23,363,-104,363,363],
    sm208=[0,-2,53,-1,0,-4,0,-4,-1,-2,364,-1,365,-128,233,234],
    sm209=[0,-1,366,367,-1,368,369,370,371,372,0,-4,-1,373,-2,374,-1,375],
    sm210=[0,-4,0,-4,0,-4,-1,-2,376],
    sm211=[0,-2,53,-1,0,-4,0,-4,-1,-2,377,-1,378,-128,233,234],
    sm212=[0,379,379,379,-1,379,379,379,379,379,0,-4,-1,380,379,379,379,379,379,379,-1,379,379,-1,379,-14,379,379,379,-1,379,-1,379,-4,379,379,379,-1,379,379,-1,379,-1,379,379,379,-1,379,-2,379,-2,379,-2,379,-2,379,-2,379,-1,379,379,379,379,379,379,379,379,379,379,379,379,-1,379,-2,379,379,379,379,-2,379,-4,379,379,-2,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,-4,379,379,379,379,379,379],
    sm213=[0,-4,0,-4,0,-4,-1,-2,381],
    sm214=[0,-2,240,-1,241,-4,242,-4,-1,-2,382,-1,382,-23,382,-27,244,-2,245,-61,246,-11,382,382],
    sm215=[0,-2,383,-1,0,-4,0,-4,-1,-2,383,-1,383,-23,383,-104,383,383],
    sm216=[0,-2,384,-1,384,-4,384,-4,-1,-2,384,-1,384,-23,384,-27,384,-2,384,-61,384,-11,384,384],
    sm217=[0,-2,385,-1,385,-4,385,-4,-1,-2,385,-1,385,-23,385,-27,385,-2,385,-61,385,-11,385,385],
    sm218=[0,-2,386,-1,0,-4,0,-4,-1,-2,386,-1,386,-23,386,-104,386,386],
    sm219=[0,-4,0,-4,0,-4,-1,-53,387],
    sm220=[0,-4,0,-4,0,-4,-1,-133,41,42],
    sm221=[0,388,388,388,-1,0,-4,0,-4,-1,-1,388,-1,388,-1,388,-3,388,-27,388,388,-7,388,-6,388,-5,388,-2,388,-2,388,-1,388,388,388,388,388,-1,388,388,388,388,388,388,-1,388,-2,388,388,388,388,-2,388,-4,388,388,-2,388,-22,388,-1,388,388,388,388,388,388,-4,388,388,388,388,388,388],
    sm222=[0,-4,0,-4,0,-4,-1,-9,84,-31,85],
    sm223=[0,-4,0,-4,0,-4,-1,-8,389,-2,390],
    sm224=[0,-4,0,-4,0,-4,-1,-11,391],
    sm225=[0,-4,0,-4,0,-4,-1,-16,392],
    sm226=[0,-4,0,-4,0,-4,-1,-8,393,-2,393],
    sm227=[0,-4,0,-4,0,-4,-1,-8,394,-2,394],
    sm228=[0,-4,0,-4,0,-4,-1,-8,395,-2,395],
    sm229=[0,-4,0,-4,0,-4,-1,-8,255,-2,255,-49,396],
    sm230=[0,-4,0,-4,0,-4,-1,-53,397],
    sm231=[0,-4,0,-4,0,-4,-1,-53,398],
    sm232=[0,399,399,399,-1,0,-4,0,-4,-1,-1,399,-1,399,-1,399,-3,399,-27,399,399,-7,399,-6,399,-5,399,-2,399,-2,399,-1,399,399,399,399,399,-1,399,399,399,399,399,399,-1,399,-2,399,399,399,399,-2,399,-4,399,399,-2,399,-22,399,-1,399,399,399,399,399,399,-4,399,399,399,399,399,399],
    sm233=[0,400,400,400,-1,0,-4,0,-4,-1,-1,400,-1,400,-1,400,-3,400,-27,400,400,-7,400,-6,400,-5,400,-2,400,-2,400,-1,400,400,400,400,400,-1,400,400,400,400,400,400,-1,400,-2,400,400,400,400,-2,400,-4,400,400,-2,400,-22,400,-1,400,400,400,400,400,400,-4,400,400,400,400,400,400],
    sm234=[0,-4,0,-4,0,-4,-1,-8,401,-2,402],
    sm235=[0,-4,0,-4,0,-4,-1,-11,403],
    sm236=[0,-4,0,-4,0,-4,-1,-16,404,-36,404],
    sm237=[0,-4,0,-4,0,-4,-1,-8,405,-2,405],
    sm238=[0,-4,0,-4,0,-4,-1,-8,406,-2,406],
    sm239=[0,-4,0,-4,0,-4,-1,-8,407,-2,407,-49,408],
    sm240=[0,409,409,409,-1,0,-4,0,-4,-1,409,409,-1,409,-1,409,-3,409,-1,409,-25,409,409,-7,409,-6,409,-5,409,-2,409,409,-1,409,409,409,409,409,409,409,-1,409,409,409,409,409,409,409,409,409,409,409,409,409,409,-2,409,-4,409,409,-2,409,-22,409,-1,409,409,409,409,409,409,-4,409,409,409,409,409,409],
    sm241=[0,-1,410,410,-1,0,-4,0,-4,-1,410,-2,410,-1,410,-3,410,-1,410,-25,410,410,-7,410,-6,410,-5,410,-3,410,-1,410,-1,410,410,410,410,410,-1,410,410,410,410,410,410,410,410,-2,410,410,410,410,-2,410,-4,410,410,-2,410,-22,410,-1,410,410,410,410,410,410,-4,410,410,410,410,410,410],
    sm242=[0,-4,0,-4,0,-4,-1,-6,411,-1,411,-38,411,-5,411,-2,411],
    sm243=[0,412,412,412,-1,0,-4,0,-4,-1,-1,412,-1,412,-1,412,412,-1,412,412,-1,412,-25,412,412,-7,412,412,-5,412,-2,412,-2,412,-2,412,-2,412,-1,412,412,412,412,412,-1,412,412,412,412,412,412,-1,412,-2,412,412,412,412,-2,412,-4,412,412,-2,412,-22,412,-1,412,412,412,412,412,412,-4,412,412,412,412,412,412],
    sm244=[0,-4,0,-4,0,-4,-1,-56,413],
    sm245=[0,414,414,414,-1,0,-4,0,-4,-1,-1,414,-1,414,-1,414,414,-1,414,414,-1,414,-25,414,414,414,-6,414,414,-5,414,-2,414,-2,414,-2,414,-2,414,-1,414,414,414,414,414,-1,414,414,414,414,414,414,-1,414,-2,414,414,414,414,-2,414,-4,414,414,-2,414,-10,414,118,-10,414,-1,414,414,414,414,414,414,-4,414,414,414,414,414,414],
    sm246=[0,415,415,415,-1,0,-4,0,-4,-1,-1,415,-1,415,-1,415,415,-1,415,415,-1,415,-25,415,415,415,-2,120,-3,415,415,-5,415,-2,415,-2,415,-2,415,-2,415,-1,415,415,415,415,415,-1,415,415,415,415,415,415,-1,415,-2,415,415,415,415,-2,415,-4,415,415,-2,415,-10,415,415,-10,415,-1,415,415,415,415,415,415,-4,415,415,415,415,415,415],
    sm247=[0,416,416,416,-1,0,-4,0,-4,-1,-1,416,-1,416,-1,416,416,-1,416,416,-1,416,-25,416,416,416,-2,416,-3,416,416,-5,416,-2,416,-2,416,-2,416,-2,416,-1,416,416,416,416,416,-1,416,416,416,416,416,416,-1,416,-2,416,416,416,416,-2,416,-4,416,416,-2,416,-10,416,416,122,-9,416,-1,416,416,416,416,416,416,-4,416,416,416,416,416,416],
    sm248=[0,417,417,417,-1,0,-4,0,-4,-1,-1,417,-1,417,-1,417,417,-1,417,417,-1,417,-25,417,417,417,-2,417,-3,417,417,-5,417,-2,417,-2,417,-2,417,-2,417,-1,417,417,417,417,417,-1,417,417,417,417,417,417,-1,417,-2,417,417,417,417,-2,417,-4,417,417,-2,417,-10,417,417,417,124,-8,417,-1,417,417,417,417,417,417,-4,417,417,417,417,417,417],
    sm249=[0,418,418,418,-1,0,-4,0,-4,-1,-1,418,-1,418,-1,418,418,-1,418,418,-1,418,-25,418,418,418,-2,418,-3,418,418,-5,418,-2,418,-2,418,-2,418,-2,418,-1,418,418,418,418,418,-1,418,418,418,418,418,418,-1,418,-2,418,418,418,418,-2,418,-4,418,418,-2,418,-10,418,418,418,418,126,127,128,129,-4,418,-1,418,418,418,418,418,418,-4,418,418,418,418,418,418],
    sm250=[0,419,419,419,-1,0,-4,0,-4,-1,-1,419,131,132,-1,419,419,-1,419,419,-1,419,-14,133,134,-4,135,-4,419,419,419,-2,419,-3,419,419,-5,419,-2,419,-2,419,-2,419,-2,419,-1,419,419,419,419,419,-1,419,419,419,419,419,419,-1,419,-2,419,419,419,419,-2,419,-4,419,419,-2,419,-10,419,419,419,419,419,419,419,419,136,-3,419,-1,419,419,419,419,419,419,-4,419,419,419,419,419,419],
    sm251=[0,420,420,420,-1,0,-4,0,-4,-1,-1,420,420,420,-1,420,420,-1,420,420,-1,420,-14,420,420,-4,420,-4,420,420,420,-2,420,-3,420,420,-5,420,-2,420,-2,420,-2,420,-2,420,-1,420,420,420,420,420,-1,420,420,420,420,420,420,-1,420,-2,420,420,420,420,-2,420,-4,420,420,-2,420,-10,420,420,420,420,420,420,420,420,420,138,139,140,420,-1,420,420,420,420,420,420,-4,420,420,420,420,420,420],
    sm252=[0,421,421,421,-1,0,-4,0,-4,-1,-1,421,421,421,-1,421,421,-1,421,421,-1,421,-14,421,421,-4,421,-4,421,421,421,-2,421,-3,421,421,-5,421,-2,421,-2,421,-2,421,-2,421,-1,421,421,421,421,421,-1,421,421,421,421,421,421,-1,421,-2,421,421,421,421,-2,421,-4,421,421,-2,421,-10,421,421,421,421,421,421,421,421,421,138,139,140,421,-1,421,421,421,421,421,421,-4,421,421,421,421,421,421],
    sm253=[0,422,422,422,-1,0,-4,0,-4,-1,-1,422,422,422,-1,422,422,-1,422,422,-1,422,-14,422,422,-4,422,-4,422,422,422,-2,422,-3,422,422,-5,422,-2,422,-2,422,-2,422,-2,422,-1,422,422,422,422,422,-1,422,422,422,422,422,422,-1,422,-2,422,422,422,422,-2,422,-4,422,422,-2,422,-10,422,422,422,422,422,422,422,422,422,138,139,140,422,-1,422,422,422,422,422,422,-4,422,422,422,422,422,422],
    sm254=[0,423,423,423,-1,0,-4,0,-4,-1,-1,423,423,423,-1,423,423,-1,423,423,-1,423,-14,423,423,-4,423,-4,142,423,423,-2,423,-3,423,423,-5,423,-2,423,-2,423,-2,423,-2,423,-1,423,423,423,423,423,-1,423,423,423,423,423,423,-1,423,-2,423,423,423,423,-2,423,-4,423,423,-2,423,-10,423,423,423,423,423,423,423,423,423,423,423,423,143,-1,423,423,423,423,423,423,-4,423,423,423,423,423,423],
    sm255=[0,424,424,424,-1,0,-4,0,-4,-1,-1,424,424,424,-1,424,424,-1,424,424,-1,424,-14,424,424,-4,424,-4,142,424,424,-2,424,-3,424,424,-5,424,-2,424,-2,424,-2,424,-2,424,-1,424,424,424,424,424,-1,424,424,424,424,424,424,-1,424,-2,424,424,424,424,-2,424,-4,424,424,-2,424,-10,424,424,424,424,424,424,424,424,424,424,424,424,143,-1,424,424,424,424,424,424,-4,424,424,424,424,424,424],
    sm256=[0,425,425,425,-1,0,-4,0,-4,-1,-1,425,425,425,-1,425,425,-1,425,425,-1,425,-14,425,425,-4,425,-4,142,425,425,-2,425,-3,425,425,-5,425,-2,425,-2,425,-2,425,-2,425,-1,425,425,425,425,425,-1,425,425,425,425,425,425,-1,425,-2,425,425,425,425,-2,425,-4,425,425,-2,425,-10,425,425,425,425,425,425,425,425,425,425,425,425,143,-1,425,425,425,425,425,425,-4,425,425,425,425,425,425],
    sm257=[0,426,426,426,-1,0,-4,0,-4,-1,-1,426,426,426,145,426,426,-1,426,426,-1,426,-14,426,426,-2,146,-1,426,-4,426,426,426,-1,147,426,-3,426,426,-5,426,-2,426,-2,426,-2,426,-2,426,-1,426,426,426,426,426,-1,426,426,426,426,426,426,-1,426,-2,426,426,426,426,-2,426,-4,426,426,-2,426,-10,426,426,426,426,426,426,426,426,426,426,426,426,426,-1,426,426,426,426,426,426,-4,426,426,426,426,426,426],
    sm258=[0,427,427,427,-1,0,-4,0,-4,-1,-1,427,427,427,145,427,427,-1,427,427,-1,427,-14,427,427,-2,146,-1,427,-4,427,427,427,-1,147,427,-3,427,427,-5,427,-2,427,-2,427,-2,427,-2,427,-1,427,427,427,427,427,-1,427,427,427,427,427,427,-1,427,-2,427,427,427,427,-2,427,-4,427,427,-2,427,-10,427,427,427,427,427,427,427,427,427,427,427,427,427,-1,427,427,427,427,427,427,-4,427,427,427,427,427,427],
    sm259=[0,428,428,428,-1,0,-4,0,-4,-1,-1,428,428,428,428,428,428,-1,428,428,-1,428,-14,428,428,-2,428,-1,428,-4,428,428,428,-1,428,428,-3,428,428,-5,428,-2,428,-2,428,-2,428,-2,428,-1,428,428,428,428,428,-1,428,428,428,428,428,428,-1,428,-2,428,428,428,428,-2,428,-4,428,428,-2,428,-10,428,428,428,428,428,428,428,428,428,428,428,428,428,-1,428,428,428,428,428,428,-4,428,428,428,428,428,428],
    sm260=[0,429,429,429,-1,0,-4,0,-4,-1,-1,429,429,429,429,429,429,-1,429,429,-1,429,-14,429,429,-2,429,-1,429,-4,429,429,429,-1,429,429,-3,429,429,-5,429,-2,429,-2,429,-2,429,-2,429,-1,429,429,429,429,429,-1,429,429,429,429,429,429,-1,429,-2,429,429,429,429,-2,429,-4,429,429,-2,429,-10,429,429,429,429,429,429,429,429,429,429,429,429,429,-1,429,429,429,429,429,429,-4,429,429,429,429,429,429],
    sm261=[0,430,430,430,-1,0,-4,0,-4,-1,-1,430,430,430,430,430,430,-1,430,430,-1,430,-14,430,430,-2,430,-1,430,-4,430,430,430,-1,430,430,-3,430,430,-5,430,-2,430,-2,430,-2,430,-2,430,-1,430,430,430,430,430,-1,430,430,430,430,430,430,-1,430,-2,430,430,430,430,-2,430,-4,430,430,-2,430,-10,430,430,430,430,430,430,430,430,430,430,430,430,430,-1,430,430,430,430,430,430,-4,430,430,430,430,430,430],
    sm262=[0,431,431,431,-1,0,-4,0,-4,-1,-1,431,431,431,431,431,431,-1,431,431,-1,431,-14,431,431,-2,431,-1,431,-4,431,431,431,-1,431,431,-3,431,431,-5,431,-2,431,-2,431,-2,431,-2,431,-1,431,431,431,431,431,-1,431,431,431,431,431,431,-1,431,-2,431,431,431,431,-2,431,-4,431,431,-2,431,-10,431,431,431,431,431,431,431,431,431,431,431,431,431,-1,431,431,431,431,431,431,-4,431,431,431,431,431,431],
    sm263=[0,-4,0,-4,0,-4,-1,-8,432,-2,433],
    sm264=[0,-4,0,-4,0,-4,-1,-11,434],
    sm265=[0,435,435,435,-1,0,-4,0,-4,-1,-1,435,435,435,435,435,435,-1,435,435,-1,435,-14,435,435,435,-1,435,-1,435,-4,435,435,435,-1,435,435,-1,435,-1,435,435,435,-1,435,-2,435,-2,435,-2,435,-2,435,-2,435,-1,435,435,435,435,435,435,435,435,435,435,435,435,-1,435,-2,435,435,435,435,-2,435,-4,435,435,-2,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,-4,435,435,435,435,435,435],
    sm266=[0,-4,0,-4,0,-4,-1,-8,436,-2,436],
    sm267=[0,-4,0,-4,0,-4,-1,-8,437,-2,437],
    sm268=[0,-4,0,-4,0,-4,-1,-8,437,-2,437,-16,323],
    sm269=[0,-4,0,-4,0,-4,-1,-5,438,-50,439],
    sm270=[0,-4,0,-4,0,-4,-1,-5,440,-2,171,-2,171,-16,171,-27,440],
    sm271=[0,-1,1,2,-1,0,-4,0,-4,-1,-46,275,-12,11,-73,41,42,-3,46],
    sm272=[0,-4,0,-4,0,-4,-1,-5,441,-50,441],
    sm273=[0,-4,0,-4,0,-4,-1,-5,440,-50,440],
    sm274=[0,-4,0,-4,0,-4,-1,-5,442],
    sm275=[0,-2,2,-1,0,-4,0,-4,-1,-6,443,-2,208,-36,209,-12,11,-37,328,-40,46],
    sm276=[0,444,444,444,-1,0,-4,0,-4,-1,-1,444,444,444,444,444,444,-1,444,444,-1,444,-14,444,444,444,-1,444,-1,444,-4,444,444,444,-1,444,444,-1,444,-1,444,444,444,-1,444,-2,444,-2,444,-2,444,-2,444,-2,444,-1,444,444,444,444,444,444,444,444,444,444,444,444,-1,444,-2,444,444,444,444,-2,444,-4,444,444,-2,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,444,-4,444,444,444,444,444,444],
    sm277=[0,445,445,445,-1,0,-4,0,-4,-1,-1,445,445,445,445,445,445,-1,445,445,-1,445,-14,445,445,445,-1,445,-1,445,-4,445,445,445,-1,445,445,-1,445,-1,445,445,445,-1,445,-2,445,-2,445,-2,445,-2,445,-2,445,-1,445,445,445,445,445,445,445,445,445,445,445,445,-1,445,-2,445,445,445,445,-2,445,-4,445,445,-2,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,-4,445,445,445,445,445,445],
    sm278=[0,-4,0,-4,0,-4,-1,-47,446],
    sm279=[0,-4,0,-4,0,-4,-1,-6,447,-1,448],
    sm280=[0,-4,0,-4,0,-4,-1,-6,449],
    sm281=[0,450,450,450,-1,0,-4,0,-4,-1,-1,450,450,450,450,450,450,-1,450,450,-1,450,-14,450,450,450,-1,450,-1,450,-4,450,450,450,-1,450,450,-1,450,-1,450,450,450,-1,450,-2,450,-2,450,-2,450,-2,450,-2,450,-1,450,450,450,450,450,450,450,450,450,450,450,450,-1,450,-2,450,450,450,450,-2,450,-4,450,450,-2,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,-4,450,450,450,450,450,450],
    sm282=[0,-4,0,-4,0,-4,-1,-6,451,-1,452],
    sm283=[0,-4,0,-4,0,-4,-1,-6,453,-1,453],
    sm284=[0,-4,0,-4,0,-4,-1,-6,454,-1,454],
    sm285=[0,-4,0,-4,0,-4,-1,-47,455],
    sm286=[0,456,456,456,-1,0,-4,0,-4,-1,-1,456,456,456,456,456,456,-1,456,456,-1,456,-14,456,456,456,-1,456,-1,456,-4,456,456,456,-1,456,456,-1,456,-1,456,456,456,-1,456,-2,456,-2,456,-2,456,-2,456,-2,456,-1,456,456,456,456,456,456,456,456,456,456,456,456,-1,456,-2,456,456,456,456,-2,456,-4,456,456,-2,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,-4,456,456,456,456,456,456],
    sm287=[0,457,457,457,-1,0,-4,0,-4,-1,-1,457,457,457,457,457,457,-1,457,457,-1,457,-14,457,457,457,-1,457,-1,457,-4,457,457,457,-1,457,457,-1,457,-1,457,457,457,-1,457,-2,457,-2,457,-2,457,-2,457,-2,457,-1,457,457,457,457,457,457,457,457,457,457,457,457,-1,457,-2,457,457,457,457,-2,457,-4,457,457,-2,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,-4,457,457,457,457,457,457],
    sm288=[0,458,458,458,-1,0,-4,0,-4,-1,-1,458,458,458,458,458,458,-1,458,458,-1,458,-14,458,458,458,-1,458,-1,458,-4,458,458,458,-1,458,458,-1,458,-1,458,458,458,-1,458,-2,458,-2,458,-2,458,-2,458,-2,458,-1,458,458,458,458,458,458,458,458,458,458,458,458,-1,458,-2,458,458,458,458,-2,458,-4,458,458,-2,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,458,-4,458,458,458,458,458,458],
    sm289=[0,459,459,459,-1,0,-4,0,-4,-1,-1,459,459,459,459,459,459,-1,459,459,-1,459,-4,459,-9,459,459,459,-1,459,-1,459,-4,459,459,459,-1,459,459,-1,459,-1,459,459,459,-1,459,-2,459,-2,459,-2,459,-1,459,459,-2,459,-1,459,459,459,459,459,459,459,459,459,459,459,459,-1,459,-2,459,459,459,459,459,-1,459,459,-3,459,459,-2,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,459,-4,459,459,459,459,459,459],
    sm290=[0,460,460,460,-1,460,-4,460,-4,460,-1,460,460,460,460,460,460,-1,460,460,-1,460,-4,460,-9,460,460,460,-1,460,-1,460,-4,460,460,460,-1,460,460,460,460,-1,460,460,460,-1,460,-2,460,-2,460,-2,460,-1,460,460,-2,460,-1,460,460,460,460,460,460,460,460,460,460,460,460,-1,460,-2,460,460,460,460,460,-1,460,460,-3,460,460,-2,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-4,460,460,460,460,460,460],
    sm291=[0,461,461,461,-1,0,-4,0,-4,-1,-1,461,461,461,461,461,461,-1,461,461,-1,461,-14,461,461,461,-1,461,-1,461,-4,461,461,461,-1,461,461,-1,461,-1,461,461,461,-1,461,-2,461,-2,461,-2,461,-2,461,-2,461,-1,461,461,461,461,461,461,461,461,461,461,461,461,-1,461,-2,461,461,461,461,-2,461,-4,461,461,-2,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-4,461,461,461,461,461,461],
    sm292=[0,-1,462,462,-1,462,462,462,462,462,0,-4,-1,-133,462,462],
    sm293=[0,-4,0,-4,0,-4,-1,-8,307,-38,463],
    sm294=[0,464,464,464,-1,0,-4,0,-4,-1,-1,464,464,464,464,464,464,-1,464,464,-1,464,-14,464,464,464,-1,464,-1,464,-4,464,464,464,-1,464,464,-1,464,-1,464,464,464,-1,464,-2,464,-2,464,-2,464,-2,464,-2,464,-1,464,464,464,464,464,464,464,464,464,464,464,464,-1,464,-2,464,464,464,464,-2,464,-4,464,464,-2,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,464,-4,464,464,464,464,464,464],
    sm295=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-2,196,152,-27,7,8,-7,9,311,-11,11,-11,18,-14,153,-2,154,-4,31,32,-1,198,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm296=[0,465,465,465,-1,0,-4,0,-4,-1,-1,465,465,465,465,465,465,-1,465,465,-1,465,-14,465,465,465,-1,465,-1,465,-4,465,465,465,-1,465,465,-1,465,-1,465,465,465,-1,465,-2,465,-2,465,-2,465,-2,465,-2,465,-1,465,465,465,465,465,465,465,465,465,465,465,465,-1,465,-2,465,465,465,465,-2,465,-4,465,465,-2,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,465,-4,465,465,465,465,465,465],
    sm297=[0,-4,0,-4,0,-4,-1,-8,466,-38,466],
    sm298=[0,-1,467,467,-1,0,-4,0,-4,-1,-3,467,-1,467,-2,467,467,-27,467,467,-7,467,467,-11,467,-11,467,-14,467,-2,467,-4,467,467,-1,467,467,-22,467,-1,467,467,467,467,467,467,-4,467,467,467,467,467,467],
    sm299=[0,-4,0,-4,0,-4,-1,-8,468,-38,468],
    sm300=[0,469,469,469,-1,0,-4,0,-4,-1,-1,469,469,469,469,469,469,-1,469,469,-1,469,-14,469,469,469,-1,469,-1,469,-4,469,469,469,-1,469,469,-1,469,-1,469,469,469,-1,469,-2,469,-2,469,-2,469,-2,469,-2,469,-1,469,469,469,469,469,469,469,469,469,469,469,469,-1,469,-2,469,469,469,469,469,-1,469,-4,469,469,-2,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,469,-4,469,469,469,469,469,469],
    sm301=[0,-4,0,-4,0,-4,-1,-6,470,-90,471],
    sm302=[0,-4,0,-4,0,-4,-1,-6,472],
    sm303=[0,-4,0,-4,0,-4,-1,-6,473],
    sm304=[0,474,474,474,-1,0,-4,0,-4,-1,-1,474,474,474,474,474,474,-1,474,474,-1,474,-14,474,474,474,-1,474,-1,474,-4,474,474,474,-1,474,474,-1,474,-1,474,474,474,-1,474,-2,474,-2,474,-2,474,-2,474,-2,474,-1,474,474,474,474,474,474,474,474,474,474,474,474,-1,474,-2,474,474,474,474,-2,474,-4,474,474,-2,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,474,-4,474,474,474,474,474,474],
    sm305=[0,-4,0,-4,0,-4,-1,-47,475],
    sm306=[0,476,476,476,-1,0,-4,0,-4,-1,-1,476,-1,476,-1,476,476,-1,476,476,-1,476,-25,476,476,-7,476,476,-5,476,-2,476,-2,476,-2,476,-2,476,-1,476,476,476,476,476,-1,476,476,476,476,476,476,-1,476,-2,476,476,476,476,-2,476,-4,476,476,-2,476,-22,476,-1,476,476,476,476,476,476,-4,476,476,476,476,476,476],
    sm307=[0,477,477,477,-1,0,-4,0,-4,-1,-1,477,-1,477,-1,477,477,-1,477,477,-1,477,-25,477,477,-7,477,477,-5,477,-2,477,-2,477,-2,477,-2,477,-1,477,477,477,477,477,-1,477,477,477,477,477,477,-1,477,-2,477,477,477,477,-2,477,-4,477,477,-2,477,-22,477,-1,477,477,477,477,477,477,-4,477,477,477,477,477,477],
    sm308=[0,478,478,478,-1,0,-4,0,-4,-1,478,478,-1,478,-1,478,-3,478,-1,478,-25,478,478,-7,478,-6,478,-5,478,-2,478,478,-1,478,478,478,478,478,478,478,-1,478,478,478,478,478,478,478,478,-2,478,478,478,478,-2,478,-4,478,478,-2,478,-22,478,-1,478,478,478,478,478,478,-4,478,478,478,478,478,478],
    sm309=[0,479,479,479,-1,0,-4,0,-4,-1,479,479,-1,479,-1,479,-3,479,-1,479,-25,479,479,-7,479,-6,479,-5,479,-2,479,479,-1,479,479,479,479,479,479,479,-1,479,479,479,479,479,479,479,479,-2,479,479,479,479,-2,479,-4,479,479,-2,479,-22,479,-1,479,479,479,479,479,479,-4,479,479,479,479,479,479],
    sm310=[0,480,480,480,-1,0,-4,0,-4,-1,480,480,-1,480,-1,480,-3,480,-1,480,-25,480,480,-7,480,-6,480,-5,480,-2,480,480,-1,480,480,480,480,480,480,480,-1,480,480,480,480,480,480,480,480,-2,480,480,480,480,-2,480,-4,480,480,-2,480,-22,480,-1,480,480,480,480,480,480,-4,480,480,480,480,480,480],
    sm311=[0,-4,0,-4,0,-4,-1,-8,481,-44,481],
    sm312=[0,-4,0,-4,0,-4,-1,-6,482,-1,482,-2,482,-16,482,-3,482,-14,482,-24,482],
    sm313=[0,-4,0,-4,0,-4,-1,-11,483],
    sm314=[0,-4,0,-4,0,-4,-1,-8,484,-2,485],
    sm315=[0,-4,0,-4,0,-4,-1,-8,486,-2,486],
    sm316=[0,-4,0,-4,0,-4,-1,-8,487,-2,487],
    sm317=[0,-4,0,-4,0,-4,-1,-56,488],
    sm318=[0,-4,0,-4,0,-4,-1,-6,489,-1,489,-2,489,-16,323,-18,489],
    sm319=[0,-4,0,-4,0,-4,-1,-6,490,-1,490,-2,490,-16,490,-3,490,-14,490,-24,490],
    sm320=[0,-2,2,-1,0,-4,0,-4,-1,-8,307,208,-36,209,491,-11,11,-37,328,-40,46],
    sm321=[0,-4,0,-4,0,-4,-1,-47,492],
    sm322=[0,-4,0,-4,0,-4,-1,-8,493,-38,494],
    sm323=[0,-4,0,-4,0,-4,-1,-8,495,-38,495],
    sm324=[0,-4,0,-4,0,-4,-1,-8,496,-38,496],
    sm325=[0,-4,0,-4,0,-4,-1,-6,497,-1,497,-2,497,-35,497],
    sm326=[0,-4,0,-4,0,-4,-1,-6,497,-1,497,-2,497,-16,323,-18,497],
    sm327=[0,-4,0,-4,0,-4,-1,-6,498],
    sm328=[0,-4,0,-4,0,-4,-1,-5,499],
    sm329=[0,-4,0,-4,0,-4,-1,-6,500],
    sm330=[0,-4,0,-4,0,-4,-1,-53,501],
    sm331=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-6,502,-5,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm332=[0,-4,0,-4,0,-4,-1,-32,503,-39,504],
    sm333=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-6,505,-5,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm334=[0,-4,0,-4,0,-4,-1,-53,506],
    sm335=[0,-4,0,-4,0,-4,-1,-2,98,98,98,-3,98,-17,98,98,99,-1,98,-1,98,-4,98,-1,98,-1,98,98,-5,100,-1,101,-2,98,-18,507,-26,102,103,104,105,106,107,108,109,110,111,98,98,98,98,98,98,98,98,98,98,98,98,98,98,-4,112,113],
    sm336=[0,-4,0,-4,0,-4,-1,-32,507,-39,507],
    sm337=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-36,9,-12,11,-7,508,-16,27,28,153,-2,154,-4,31,32,-2,33,-34,41,42,43,44,45,46],
    sm338=[0,-4,0,-4,0,-4,-1,-6,509],
    sm339=[0,510,510,510,-1,0,-4,0,-4,-1,510,510,-1,510,-1,510,-3,510,-1,510,-25,510,510,-7,510,-6,510,-5,510,-2,510,510,-1,510,510,510,510,510,510,510,-1,510,510,510,510,510,510,510,510,-2,510,510,510,510,-2,510,-4,510,510,-2,510,-22,510,-1,510,510,510,510,510,510,-4,510,510,510,510,510,510],
    sm340=[0,511,511,511,-1,0,-4,0,-4,-1,511,511,-1,511,-1,511,-3,511,-1,511,-25,511,511,-7,511,-6,511,-5,511,-2,511,511,-1,511,511,511,511,511,511,511,-1,511,511,511,511,511,511,511,511,-2,511,511,511,511,-2,511,-4,511,511,-2,511,-22,511,-1,511,511,511,511,511,511,-4,511,511,511,511,511,511],
    sm341=[0,512,512,512,-1,0,-4,0,-4,-1,512,512,-1,512,-1,512,-3,512,-1,512,-25,512,512,-7,512,-6,512,-5,512,-2,512,512,-1,512,512,512,512,512,512,512,-1,512,512,512,512,512,512,512,512,-2,512,512,512,512,-2,512,-4,512,512,-2,512,-22,512,-1,512,512,512,512,512,512,-4,512,512,512,512,512,512],
    sm342=[0,-4,0,-4,0,-4,-1,-6,513],
    sm343=[0,514,514,514,-1,0,-4,0,-4,-1,514,514,-1,514,-1,514,-3,514,-1,514,-25,514,514,-7,514,-6,514,-5,514,-2,514,514,-1,514,514,514,514,514,514,514,-1,514,514,514,514,514,514,514,514,-2,514,514,514,514,-2,514,-4,514,514,-2,514,-22,514,-1,514,514,514,514,514,514,-4,514,514,514,514,514,514],
    sm344=[0,515,515,515,-1,0,-4,0,-4,-1,515,515,-1,515,-1,515,-3,515,-1,515,-25,515,515,-7,515,-6,515,-5,515,-2,515,515,-1,515,515,515,515,515,515,515,-1,515,515,515,515,515,515,515,515,-1,341,515,515,515,515,-2,515,-4,515,515,-2,515,-22,515,-1,515,515,515,515,515,515,-4,515,515,515,515,515,515],
    sm345=[0,516,516,516,-1,0,-4,0,-4,-1,516,516,-1,516,-1,516,-3,516,-1,516,-25,516,516,-7,516,-6,516,-5,516,-2,516,516,-1,516,516,516,516,516,516,516,-1,516,516,516,516,516,516,516,516,-2,516,516,516,516,-2,516,-4,516,516,-2,516,-22,516,-1,516,516,516,516,516,516,-4,516,516,516,516,516,516],
    sm346=[0,-4,0,-4,0,-4,-1,-5,517],
    sm347=[0,518,518,518,-1,0,-4,0,-4,-1,518,518,-1,518,-1,518,-3,518,-1,518,-25,518,518,-7,518,-6,518,-5,518,-2,518,518,-1,518,-1,518,518,518,518,518,-1,518,518,518,518,518,518,518,518,-2,518,518,518,518,-2,518,-4,518,518,-2,518,-22,518,-1,518,518,518,518,518,518,-4,518,518,518,518,518,518],
    sm348=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,519,-34,275,-6,346,-5,11,-31,347,276,277,-39,41,42,-3,46],
    sm349=[0,-4,0,-4,0,-4,-1,-11,520],
    sm350=[0,521,521,521,-1,0,-4,0,-4,-1,521,521,521,521,521,521,521,-1,521,521,-1,521,-14,521,521,521,-1,521,-1,521,-4,521,521,521,-1,521,521,-1,521,-1,521,521,521,-1,521,-2,521,-2,521,-2,521,-2,521,521,-1,521,-1,521,521,521,521,521,521,521,521,521,521,521,521,521,521,-2,521,521,521,521,-2,521,-4,521,521,-2,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,521,-4,521,521,521,521,521,521],
    sm351=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,522,-34,275,-6,346,-5,11,-31,347,276,277,-39,41,42,-3,46],
    sm352=[0,-1,523,523,-1,0,-4,0,-4,-1,-11,523,-34,523,-6,523,-5,523,-31,523,523,523,-39,523,523,-3,523],
    sm353=[0,-1,524,524,-1,0,-4,0,-4,-1,-11,524,-34,524,-6,524,-5,524,-31,524,524,524,-39,524,524,-3,524],
    sm354=[0,-1,1,2,-1,0,-4,0,-4,-1,-46,275,-12,11,-32,276,277,-39,41,42,-3,46],
    sm355=[0,-4,0,-4,0,-4,-1,-5,438],
    sm356=[0,-4,0,-4,0,-4,-1,-5,440],
    sm357=[0,-4,0,-4,0,-4,-1,-9,525],
    sm358=[0,-2,2,-1,0,-4,0,-4,-1,-6,526,-2,208,-36,209,-12,11,-37,328,-40,46],
    sm359=[0,-4,0,-4,0,-4,-1,-6,527],
    sm360=[0,-4,0,-4,0,-4,-1,-9,528],
    sm361=[0,-4,0,-4,0,-4,-1,-6,529],
    sm362=[0,-4,0,-4,0,-4,-1,-6,530,-1,531],
    sm363=[0,-4,0,-4,0,-4,-1,-6,532],
    sm364=[0,-4,0,-4,0,-4,-1,-6,533,-1,533],
    sm365=[0,-4,0,-4,0,-4,-1,-6,534,-1,534],
    sm366=[0,535,535,535,-1,0,-4,0,-4,-1,535,535,-1,535,-1,535,-3,535,-1,535,-25,535,535,-7,535,-6,535,-5,535,-2,535,535,-1,535,-1,535,535,535,535,535,-1,535,535,535,535,535,535,535,535,-2,535,535,535,535,-2,535,-4,535,535,-2,535,-22,535,-1,535,535,535,535,535,535,-4,535,535,535,535,535,535],
    sm367=[0,-4,0,-4,0,-4,-1,-8,536,-44,536],
    sm368=[0,-4,0,-4,0,-7,537],
    sm369=[0,-4,0,-4,0,-5,356,-2,538],
    sm370=[0,-2,539,-1,0,-4,0,-4,-1,-2,539,-1,539,-128,539,539],
    sm371=[0,-4,0,-4,0,-5,356,-2,540],
    sm372=[0,-4,0,-4,0,-8,540],
    sm373=[0,-4,0,-4,0,-6,541],
    sm374=[0,-2,53,-1,0,-4,0,-4,-1,-5,375,-127,542,543],
    sm375=[0,-4,0,-4,0,-4,-1,-134,544],
    sm376=[0,-2,545,-1,0,-4,0,-4,-1,-2,545,-1,545,-23,545,-104,545,545],
    sm377=[0,-4,0,-4,0,-4,-1,-133,546],
    sm378=[0,-1,366,367,-1,368,369,370,371,372,0,-4,-1,547,-2,374,-1,375],
    sm379=[0,-4,0,-4,0,-4,-1,-2,548],
    sm380=[0,-4,0,-4,0,-4,-1,549],
    sm381=[0,-2,53,-1,0,-4,0,-4,-1],
    sm382=[0,-1,366,367,-1,368,369,370,371,372,0,-4,-1,550,-2,374,-1,375],
    sm383=[0,-1,551,551,-1,551,551,551,551,551,0,-4,-1,551,-2,551,-1,551],
    sm384=[0,-2,53,-1,0,-4,0,-145,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,552,553,554],
    sm385=[0,-1,555,555,-1,555,555,555,555,555,0,-4,-1,555,-2,555,-1,555],
    sm386=[0,-1,556,556,-1,556,556,556,556,556,0,-5,556,-2,556,-1,556],
    sm387=[0,-1,366,367,-1,368,369,370,371,372,0,-4,-1,556,-2,556,-1,556],
    sm388=[0,-1,557,557,-1,557,557,557,557,557,0,-5,557,-1,557,557,557,557,-127,557,557],
    sm389=[0,-4,-1,-4,0,-10,558],
    sm390=[0,-1,559,559,-1,559,559,559,559,559,0,-4,-1,559,-2,559,-1,559],
    sm391=[0,-1,560,560,-1,560,560,560,560,560,0,-4,-1,560,-2,560,-1,560],
    sm392=[0,561,561,561,-1,561,561,561,561,561,0,-4,-1,561,561,561,561,561,561,561,-1,561,561,-1,561,-14,561,561,561,-1,561,-1,561,-4,561,561,561,-1,561,561,-1,561,-1,561,561,561,-1,561,-2,561,-2,561,-2,561,-2,561,-2,561,-1,561,561,561,561,561,561,561,561,561,561,561,561,-1,561,-2,561,561,561,561,-2,561,-4,561,561,-2,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,-4,561,561,561,561,561,561],
    sm393=[0,562,562,562,-1,562,562,562,562,562,0,-4,-1,563,562,562,562,562,562,562,-1,562,562,-1,562,-14,562,562,562,-1,562,-1,562,-4,562,562,562,-1,562,562,-1,562,-1,562,562,562,-1,562,-2,562,-2,562,-2,562,-2,562,-2,562,-1,562,562,562,562,562,562,562,562,562,562,562,562,-1,562,-2,562,562,562,562,-2,562,-4,562,562,-2,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,562,-4,562,562,562,562,562,562],
    sm394=[0,-4,0,-4,0,-4,-1,-2,564],
    sm395=[0,-4,0,-4,0,-4,-1,-140,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],
    sm396=[0,-2,565,-1,0,-4,0,-4,-1,-2,565,-1,565,-23,565,-104,565,565],
    sm397=[0,-2,566,-1,566,-4,566,-4,-1,-2,566,-1,566,-23,566,-27,566,-2,566,-61,566,-11,566,566],
    sm398=[0,567,567,567,-1,0,-4,0,-4,-1,-1,567,-1,567,-1,567,-3,567,-27,567,567,-7,567,-6,567,-5,567,-2,567,-2,567,-1,567,567,567,567,567,-1,567,567,567,567,567,567,-1,567,-2,567,567,567,567,-2,567,-4,567,567,-2,567,-22,567,-1,567,567,567,567,567,567,-4,567,567,567,567,567,567],
    sm399=[0,-4,0,-4,0,-4,-1,-53,568],
    sm400=[0,-4,0,-4,0,-4,-1,-16,569],
    sm401=[0,-4,0,-4,0,-4,-1,-16,570],
    sm402=[0,-2,2,-1,0,-4,0,-4,-1,-11,571,-47,11,-78,46],
    sm403=[0,-4,0,-4,0,-4,-1,-16,572],
    sm404=[0,-4,0,-4,0,-4,-1,-16,573],
    sm405=[0,574,574,574,-1,0,-4,0,-4,-1,-1,574,-1,574,-1,574,-3,574,-27,574,574,-7,574,-6,574,-5,574,-2,574,-2,574,-1,574,574,574,574,574,-1,574,574,574,574,574,574,-1,574,-2,574,574,574,574,-2,574,-4,574,574,-2,574,-22,574,-1,574,574,574,574,574,574,-4,574,574,574,574,574,574],
    sm406=[0,575,575,575,-1,0,-4,0,-4,-1,-1,575,-1,575,-1,575,-3,575,-27,575,575,-7,575,-6,575,-5,575,-2,575,-2,575,-1,575,575,575,575,575,-1,575,575,575,575,575,575,-1,575,-2,575,575,575,575,-2,575,-4,575,575,-2,575,-22,575,-1,575,575,575,575,575,575,-4,575,575,575,575,575,575],
    sm407=[0,-2,2,-1,0,-4,0,-4,-1,-11,576,-47,11,-78,46],
    sm408=[0,-4,0,-4,0,-4,-1,-16,577,-36,577],
    sm409=[0,-4,0,-4,0,-4,-1,-16,578,-36,578],
    sm410=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,579,-34,275,-12,11,-32,276,277,-3,278,-35,41,42,-3,46],
    sm411=[0,580,580,580,-1,0,-4,0,-4,-1,-1,580,580,580,580,580,580,-1,580,580,-1,580,-14,580,580,580,-1,580,-1,580,-4,580,580,580,-1,580,580,-1,580,-1,580,580,580,-1,580,-2,580,-2,580,-2,580,-2,580,-2,580,-1,580,580,580,580,580,580,580,580,580,580,580,580,-1,580,-2,580,580,580,580,-2,580,-4,580,580,-2,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,580,-4,580,580,580,580,580,580],
    sm412=[0,581,581,581,-1,0,-4,0,-4,-1,-1,581,581,581,581,581,581,-1,581,581,-1,581,-14,581,581,581,-1,581,-1,581,-4,581,581,581,-1,581,581,-1,581,-1,581,581,581,-1,581,-2,581,-2,581,-2,581,-2,581,-2,581,-1,581,581,581,581,581,581,581,581,581,581,581,581,-1,581,-2,581,581,581,581,-2,581,-4,581,581,-2,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,581,-4,581,581,581,581,581,581],
    sm413=[0,-4,0,-4,0,-4,-1,-8,582,-2,582],
    sm414=[0,-4,0,-4,0,-4,-1,-8,583,-2,583],
    sm415=[0,-2,2,-1,0,-4,0,-4,-1,-9,208,-36,209,-12,11,-37,328,-40,46],
    sm416=[0,-4,0,-4,0,-4,-1,-5,584],
    sm417=[0,-4,0,-4,0,-4,-1,-5,585],
    sm418=[0,-4,0,-4,0,-4,-1,-47,586],
    sm419=[0,-2,2,-1,0,-4,0,-4,-1,-6,587,-2,208,-36,209,-12,11,-37,328,-40,46],
    sm420=[0,-4,0,-4,0,-4,-1,-6,588],
    sm421=[0,-4,0,-4,0,-4,-1,-9,589],
    sm422=[0,590,590,590,-1,0,-4,0,-4,-1,-1,590,590,590,590,590,590,-1,590,590,-1,590,-14,590,590,590,-1,590,-1,590,-4,590,590,590,-1,590,590,-1,590,-1,590,590,590,-1,590,-2,590,-2,590,-2,590,-2,590,-2,590,-1,590,590,590,590,590,590,590,590,590,590,590,590,-1,590,-2,590,590,590,590,-2,590,-4,590,590,-2,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,-4,590,590,590,590,590,590],
    sm423=[0,591,591,591,-1,0,-4,0,-4,-1,-1,591,591,591,591,591,591,-1,591,591,-1,591,-14,591,591,591,-1,591,-1,591,-4,591,591,591,-1,591,591,-1,591,-1,591,591,591,-1,591,-2,591,-2,591,-2,591,-2,591,-2,591,-1,591,591,591,591,591,591,591,591,591,591,591,591,-1,591,-2,591,591,591,591,-2,591,-4,591,591,-2,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,591,-4,591,591,591,591,591,591],
    sm424=[0,-4,0,-4,0,-4,-1,-6,592],
    sm425=[0,593,593,593,-1,0,-4,0,-4,-1,-1,593,593,593,593,593,593,-1,593,593,-1,593,-14,593,593,593,-1,593,-1,593,-4,593,593,593,-1,593,593,-1,593,-1,593,593,593,-1,593,-2,593,-2,593,-2,593,-2,593,-2,593,-1,593,593,593,593,593,593,593,593,593,593,593,593,-1,593,-2,593,593,593,593,-2,593,-4,593,593,-2,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,-4,593,593,593,593,593,593],
    sm426=[0,594,594,594,-1,0,-4,0,-4,-1,-1,594,594,594,594,594,594,-1,594,594,-1,594,-14,594,594,594,-1,594,-1,594,-4,594,594,594,-1,594,594,-1,594,-1,594,594,594,-1,594,-2,594,-2,594,-2,594,-2,594,-2,594,-1,594,594,594,594,594,594,594,594,594,594,594,594,-1,594,-2,594,594,594,594,-2,594,-4,594,594,-2,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,594,-4,594,594,594,594,594,594],
    sm427=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-1,291,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm428=[0,-4,0,-4,0,-4,-1,-6,595,-1,595],
    sm429=[0,596,596,596,-1,0,-4,0,-4,-1,-1,596,596,596,596,596,596,-1,596,596,-1,596,-14,596,596,596,-1,596,-1,596,-4,596,596,596,-1,596,596,-1,596,-1,596,596,596,-1,596,-2,596,-2,596,-2,596,-2,596,-2,596,-1,596,596,596,596,596,596,596,596,596,596,596,596,-1,596,-2,596,596,596,596,-2,596,-4,596,596,-2,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,596,-4,596,596,596,596,596,596],
    sm430=[0,597,597,597,-1,0,-4,0,-4,-1,-1,597,597,597,597,597,597,-1,597,597,-1,597,-14,597,597,597,-1,597,-1,597,-4,597,597,597,-1,597,597,-1,597,-1,597,597,597,-1,597,-2,597,-2,597,-2,597,-2,597,-2,597,-1,597,597,597,597,597,597,597,597,597,597,597,597,-1,597,-2,597,597,597,597,-2,597,-4,597,597,-2,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,597,-4,597,597,597,597,597,597],
    sm431=[0,-4,0,-4,0,-4,-1,-8,598,-38,598],
    sm432=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-2,307,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm433=[0,599,599,599,-1,0,-4,0,-4,-1,-1,599,599,599,599,599,599,-1,599,599,-1,599,-14,599,599,599,-1,599,-1,599,-4,599,599,599,-1,599,599,-1,599,-1,599,599,599,-1,599,-2,599,-2,599,-2,599,-2,599,-2,599,-1,599,599,599,599,599,599,599,599,599,599,599,599,-1,599,-2,599,599,599,599,599,-1,599,-4,599,599,-2,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,599,-4,599,599,599,599,599,599],
    sm434=[0,600,600,600,-1,0,-4,0,-4,-1,-1,600,600,600,600,600,600,-1,600,600,-1,600,-14,600,600,600,-1,600,-1,600,-4,600,600,600,-1,600,600,-1,600,-1,600,600,600,-1,600,-2,600,-2,600,-2,600,-2,600,-2,600,-1,600,600,600,600,600,600,600,600,600,600,600,600,-1,600,-2,600,600,600,600,600,-1,600,-4,600,600,-2,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,600,-4,600,600,600,600,600,600],
    sm435=[0,601,601,601,-1,0,-4,0,-4,-1,-1,601,601,601,601,601,601,-1,601,601,-1,601,-14,601,601,601,-1,601,-1,601,-4,601,601,601,-1,601,601,-1,601,-1,601,601,601,-1,601,-2,601,-2,601,-2,601,-2,601,-2,601,-1,601,601,601,601,601,601,601,601,601,601,601,601,-1,601,-2,601,601,601,601,-2,601,-4,601,601,-2,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,601,-4,601,601,601,601,601,601],
    sm436=[0,-4,0,-4,0,-4,-1,-11,602],
    sm437=[0,-4,0,-4,0,-4,-1,-11,603],
    sm438=[0,-4,0,-4,0,-4,-1,-8,604,-44,604],
    sm439=[0,-4,0,-4,0,-4,-1,-6,605,-1,605,-2,605,-35,605,-5,605],
    sm440=[0,-4,0,-4,0,-4,-1,-6,606,-1,606,-2,606,-16,606,-3,606,-14,606,-24,606],
    sm441=[0,-1,1,2,-1,0,-4,0,-4,-1,-11,607,-34,275,-12,11,-37,326,-35,41,42,-3,46],
    sm442=[0,-4,0,-4,0,-4,-1,-11,608],
    sm443=[0,-4,0,-4,0,-4,-1,-6,609,-1,609,-2,609,-35,609],
    sm444=[0,-4,0,-4,0,-4,-1,-47,610],
    sm445=[0,-4,0,-4,0,-4,-1,-6,611,-1,611,-2,611,-16,611,-3,611,-14,611,-24,611],
    sm446=[0,-4,0,-4,0,-4,-1,-8,612,-38,612],
    sm447=[0,-2,2,-1,0,-4,0,-4,-1,-8,196,208,-36,209,613,-11,11,-37,328,-40,46],
    sm448=[0,-4,0,-4,0,-4,-1,-6,614,-40,614],
    sm449=[0,-4,0,-4,0,-4,-1,-6,615,-1,615,-2,615,-35,615],
    sm450=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,152,-27,7,8,-7,9,-6,616,-5,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm451=[0,-4,0,-4,0,-4,-1,-53,617],
    sm452=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,618,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm453=[0,-4,0,-4,0,-4,-1,-53,619],
    sm454=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,620,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm455=[0,-4,0,-4,0,-4,-1,-8,319,-44,621],
    sm456=[0,-4,0,-4,0,-4,-1,-32,622,-39,622],
    sm457=[0,-4,0,-4,0,-4,-1,-8,322,-19,323,-3,623,-20,322,-18,623],
    sm458=[0,-4,0,-4,0,-4,-1,-28,323,-3,623,-39,623],
    sm459=[0,-4,0,-4,0,-4,-1,-32,624,-39,624],
    sm460=[0,-4,0,-4,0,-4,-1,-72,625],
    sm461=[0,-4,0,-4,0,-4,-1,-72,507],
    sm462=[0,-4,0,-4,0,-4,-1,-9,626],
    sm463=[0,627,627,627,-1,0,-4,0,-4,-1,627,627,-1,627,-1,627,-3,627,-1,627,-25,627,627,-7,627,-6,627,-5,627,-2,627,627,-1,627,627,627,627,627,627,627,-1,627,627,627,627,627,627,627,627,-2,627,627,627,627,-2,627,-4,627,627,-2,627,-22,627,-1,627,627,627,627,627,627,-4,627,627,627,627,627,627],
    sm464=[0,628,628,628,-1,0,-4,0,-4,-1,628,628,-1,628,-1,628,-3,628,-1,628,-25,628,628,-7,628,-6,628,-5,628,-2,628,628,-1,628,628,628,628,628,628,628,-1,628,628,628,628,628,628,628,628,-2,628,628,628,628,-2,628,-4,628,628,-2,628,-22,628,-1,628,628,628,628,628,628,-4,628,628,628,628,628,628],
    sm465=[0,-4,0,-4,0,-4,-1,-11,629],
    sm466=[0,630,630,630,-1,0,-4,0,-4,-1,630,630,630,630,630,630,630,-1,630,630,-1,630,-14,630,630,630,-1,630,-1,630,-4,630,630,630,-1,630,630,-1,630,-1,630,630,630,-1,630,-2,630,-2,630,-2,630,-2,630,630,-1,630,-1,630,630,630,630,630,630,630,630,630,630,630,630,630,630,-2,630,630,630,630,-2,630,-4,630,630,-2,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,630,-4,630,630,630,630,630,630],
    sm467=[0,631,631,631,-1,0,-4,0,-4,-1,631,631,631,631,631,631,631,-1,631,631,-1,631,-14,631,631,631,-1,631,-1,631,-4,631,631,631,-1,631,631,-1,631,-1,631,631,631,-1,631,-2,631,-2,631,-2,631,-2,631,631,-1,631,-1,631,631,631,631,631,631,631,631,631,631,631,631,631,631,-2,631,631,631,631,-2,631,-4,631,631,-2,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,631,-4,631,631,631,631,631,631],
    sm468=[0,-1,632,632,-1,0,-4,0,-4,-1,-11,632,-34,632,-6,632,-5,632,-31,632,632,632,-39,632,632,-3,632],
    sm469=[0,-1,633,633,-1,0,-4,0,-4,-1,-11,633,-34,633,-6,633,-5,633,-31,633,633,633,-39,633,633,-3,633],
    sm470=[0,-4,0,-4,0,-4,-1,-6,634],
    sm471=[0,-4,0,-4,0,-4,-1,-9,635],
    sm472=[0,-4,0,-4,0,-4,-1,-9,636],
    sm473=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,637,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm474=[0,-2,2,-1,0,-4,0,-4,-1,-6,638,-2,208,-36,209,-12,11,-37,328,-40,46],
    sm475=[0,-4,0,-4,0,-4,-1,-8,639,-44,639],
    sm476=[0,-4,0,-4,0,-5,356,-2,640],
    sm477=[0,-4,0,-4,0,-8,640],
    sm478=[0,-4,0,-4,0,-8,641],
    sm479=[0,-4,0,-4,0,-7,642],
    sm480=[0,-2,643,-1,0,-4,0,-4,-1,-2,643,-1,643,-128,643,643],
    sm481=[0,-2,644,-1,0,-4,0,-7,644,-1,644,-128,644,644],
    sm482=[0,-2,645,-1,646,647,648,649,650,0,-3,651,-6,375],
    sm483=[0,-2,644,-1,0,-4,0,-4,-1,-2,644,-1,644,-128,644,644],
    sm484=[0,-2,645,-1,646,647,648,649,650,0,-3,651,-1],
    sm485=[0,-2,652,-1,0,-4,0,-4,-1,-2,652,-1,652,-23,652,-104,652,652],
    sm486=[0,-4,0,-4,0,-4,-1,653],
    sm487=[0,654,654,654,-1,654,654,654,654,654,0,-4,-1,654,654,654,654,654,654,654,-1,654,654,-1,654,-14,654,654,654,-1,654,-1,654,-4,654,654,654,-1,654,654,-1,654,-1,654,654,654,-1,654,-2,654,-2,654,-2,654,-2,654,-2,654,-1,654,654,654,654,654,654,654,654,654,654,654,654,-1,654,-2,654,654,654,654,-2,654,-4,654,654,-2,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,654,-4,654,654,654,654,654,654],
    sm488=[0,-4,0,-4,0,-4,-1,-2,655],
    sm489=[0,-1,656,656,-1,656,656,656,656,656,0,-4,-1,656,-2,656,-1,656],
    sm490=[0,-2,53,-1,0,-4,0,-7,657,-130,233,234],
    sm491=[0,-2,53,-1,0,-4,0,-7,658,-130,233,234],
    sm492=[0,-2,53,-1,0,-4,0,-7,659,-130,233,234],
    sm493=[0,-1,660,660,-1,660,660,660,660,660,0,-4,-1,660,-2,660,-1,660],
    sm494=[0,-1,1,2,-1,0,-4,0,-8,79,-1,5,661,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm495=[0,-4,0,-4,0,-4,-1,-2,662],
    sm496=[0,-4,0,-4,0,-4,-1,-16,663],
    sm497=[0,-4,0,-4,0,-4,-1,-8,664,-2,664],
    sm498=[0,-4,0,-4,0,-4,-1,-8,665,-2,665],
    sm499=[0,-4,0,-4,0,-4,-1,-16,666,-36,666],
    sm500=[0,-4,0,-4,0,-4,-1,-8,667,-2,667],
    sm501=[0,-4,0,-4,0,-4,-1,-8,668,-2,668],
    sm502=[0,669,669,669,-1,0,-4,0,-4,-1,-1,669,-1,669,-1,669,669,-1,669,669,-1,669,-25,669,669,-7,669,669,-5,669,-2,669,-2,669,-2,669,-2,669,-1,669,669,669,669,669,-1,669,669,669,669,669,669,-1,669,-2,669,669,669,669,-2,669,-4,669,669,-2,669,-22,669,-1,669,669,669,669,669,669,-4,669,669,669,669,669,669],
    sm503=[0,670,670,670,-1,0,-4,0,-4,-1,-1,670,670,670,670,670,670,-1,670,670,-1,670,-14,670,670,670,-1,670,-1,670,-4,670,670,670,-1,670,670,-1,670,-1,670,670,670,-1,670,-2,670,-2,670,-2,670,-2,670,-2,670,-1,670,670,670,670,670,670,670,670,670,670,670,670,-1,670,-2,670,670,670,670,-2,670,-4,670,670,-2,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,670,-4,670,670,670,670,670,670],
    sm504=[0,-4,0,-4,0,-4,-1,-8,671,-2,671],
    sm505=[0,-4,0,-4,0,-4,-1,-8,672,-2,672],
    sm506=[0,-4,0,-4,0,-4,-1,-6,673],
    sm507=[0,-4,0,-4,0,-4,-1,-6,674],
    sm508=[0,-4,0,-4,0,-4,-1,-6,675],
    sm509=[0,-4,0,-4,0,-4,-1,-5,676,-50,676],
    sm510=[0,-4,0,-4,0,-4,-1,-6,677],
    sm511=[0,-4,0,-4,0,-4,-1,-9,678],
    sm512=[0,-4,0,-4,0,-4,-1,-9,679],
    sm513=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,680,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm514=[0,681,681,681,-1,0,-4,0,-4,-1,-1,681,681,681,681,681,681,-1,681,681,-1,681,-14,681,681,681,-1,681,-1,681,-4,681,681,681,-1,681,681,-1,681,-1,681,681,681,-1,681,-2,681,-2,681,-2,681,-2,681,-2,681,-1,681,681,681,681,681,681,681,681,681,681,681,681,-1,681,-2,681,681,681,681,-2,681,-4,681,681,-2,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,-4,681,681,681,681,681,681],
    sm515=[0,-4,0,-4,0,-4,-1,-6,682,-1,682],
    sm516=[0,-4,0,-4,0,-4,-1,-8,683,-38,683],
    sm517=[0,-4,0,-4,0,-4,-1,-6,684],
    sm518=[0,-4,0,-4,0,-4,-1,-6,685],
    sm519=[0,686,686,686,-1,0,-4,0,-4,-1,-1,686,-1,686,-1,686,686,-1,686,686,-1,686,-25,686,686,-7,686,686,-5,686,-2,686,-2,686,-2,686,-2,686,-1,686,686,686,686,686,-1,686,686,686,686,686,686,-1,686,-2,686,686,686,686,-2,686,-4,686,686,-2,686,-22,686,-1,686,686,686,686,686,686,-4,686,686,686,686,686,686],
    sm520=[0,-4,0,-4,0,-4,-1,-11,687],
    sm521=[0,-4,0,-4,0,-4,-1,-6,688,-1,688,-2,688,-16,688,-3,688,-14,688,-24,688],
    sm522=[0,-4,0,-4,0,-4,-1,-8,689,-2,689],
    sm523=[0,-4,0,-4,0,-4,-1,-8,690,-2,690],
    sm524=[0,-4,0,-4,0,-4,-1,-6,691,-1,691,-2,691,-16,691,-3,691,-14,691,-24,691],
    sm525=[0,-2,2,-1,0,-4,0,-4,-1,-8,307,208,-36,209,692,-11,11,-37,328,-40,46],
    sm526=[0,-4,0,-4,0,-4,-1,-47,693],
    sm527=[0,-4,0,-4,0,-4,-1,-8,694,-38,694],
    sm528=[0,695,695,695,-1,0,-4,0,-4,-1,695,695,-1,695,-1,695,-3,695,-1,695,-25,695,695,-7,695,-6,695,-5,695,-2,695,695,-1,695,696,695,695,695,695,695,-1,695,695,695,695,695,695,695,695,-2,695,695,695,695,-2,695,-4,695,695,-2,695,-22,695,-1,695,695,695,695,695,695,-4,695,695,695,695,695,695],
    sm529=[0,-4,0,-4,0,-4,-1,-6,697],
    sm530=[0,698,698,698,-1,0,-4,0,-4,-1,698,698,-1,698,-1,698,-3,698,-1,698,-25,698,698,-7,698,-6,698,-5,698,-2,698,698,-1,698,698,698,698,698,698,698,-1,698,698,698,698,698,698,698,698,-2,698,698,698,698,-2,698,-4,698,698,-2,698,-22,698,-1,698,698,698,698,698,698,-4,698,698,698,698,698,698],
    sm531=[0,-4,0,-4,0,-4,-1,-53,699],
    sm532=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,700,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm533=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,701,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm534=[0,-4,0,-4,0,-4,-1,-6,702],
    sm535=[0,-4,0,-4,0,-4,-1,-6,703],
    sm536=[0,-4,0,-4,0,-4,-1,-6,704],
    sm537=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,705,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm538=[0,-4,0,-4,0,-4,-1,-6,706],
    sm539=[0,-4,0,-4,0,-4,-1,-72,623],
    sm540=[0,707,707,707,-1,0,-4,0,-4,-1,707,707,-1,707,-1,707,-3,707,-1,707,-25,707,707,-7,707,-6,707,-5,707,-2,707,707,-1,707,707,707,707,707,707,707,-1,707,707,707,707,707,707,707,707,-2,707,707,707,707,-2,707,-4,707,707,-2,707,-22,707,-1,707,707,707,707,707,707,-4,707,707,707,707,707,707],
    sm541=[0,-4,0,-4,0,-4,-1,-11,708,-51,709,-15,710],
    sm542=[0,711,711,711,-1,0,-4,0,-4,-1,711,711,-1,711,-1,711,-3,711,-1,711,-25,711,711,-7,711,-6,711,-5,711,-2,711,711,-1,711,711,711,711,711,711,711,-1,711,711,711,711,711,711,711,711,-2,711,711,711,711,-2,711,-4,711,711,-2,711,-22,711,-1,711,711,711,711,711,711,-4,711,711,711,711,711,711],
    sm543=[0,-4,0,-4,0,-4,-1,-6,712],
    sm544=[0,-4,0,-4,0,-4,-1,-6,713],
    sm545=[0,714,714,714,-1,0,-4,0,-4,-1,714,714,714,714,714,714,714,-1,714,714,-1,714,-14,714,714,714,-1,714,-1,714,-4,714,714,714,-1,714,714,-1,714,-1,714,714,714,-1,714,-2,714,-2,714,-2,714,-2,714,714,-1,714,-1,714,714,714,714,714,714,714,714,714,714,714,714,714,714,-2,714,714,714,714,-2,714,-4,714,714,-2,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,714,-4,714,714,714,714,714,714],
    sm546=[0,-4,0,-4,0,-4,-1,-9,715],
    sm547=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,716,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm548=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,717,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm549=[0,-4,0,-4,0,-4,-1,-11,718],
    sm550=[0,719,719,719,-1,0,-4,0,-4,-1,719,719,-1,719,-1,719,-3,719,-1,719,-25,719,719,-7,719,-6,719,-5,719,-2,719,719,-1,719,719,719,719,719,719,719,-1,719,719,719,719,719,719,719,719,-2,719,719,719,719,-2,719,-4,719,719,-2,719,-22,719,-1,719,719,719,719,719,719,-4,719,719,719,719,719,719],
    sm551=[0,-4,0,-4,0,-4,-1,-11,720],
    sm552=[0,-4,0,-4,0,-4,-1,-6,721],
    sm553=[0,-4,0,-4,0,-4,-1,-6,722,-1,722],
    sm554=[0,-4,0,-4,0,-8,723],
    sm555=[0,-4,0,-4,0,-8,724],
    sm556=[0,-4,0,-4,0,-138,725],
    sm557=[0,-4,0,-4,0,-4,-1,-133,726],
    sm558=[0,-2,645,-1,646,647,648,649,650,0,-3,651,-1,-133,727,727],
    sm559=[0,-2,728,-1,728,728,728,728,728,0,-3,728,-1,-133,728,728],
    sm560=[0,-2,729,-1,729,729,729,729,729,0,-3,729,-1,-133,729,729],
    sm561=[0,-2,730,-1,730,730,730,730,730,0,-3,730,-1,-133,730,730],
    sm562=[0,-4,0,-4,0,-4,-1,-134,731],
    sm563=[0,-4,0,-4,0,-4,-1,-2,732],
    sm564=[0,-4,0,-4,0,-4,-1,-2,733],
    sm565=[0,734,734,734,-1,734,734,734,734,734,0,-4,-1,734,734,734,734,734,734,734,-1,734,734,-1,734,-14,734,734,734,-1,734,-1,734,-4,734,734,734,-1,734,734,-1,734,-1,734,734,734,-1,734,-2,734,-2,734,-2,734,-2,734,-2,734,-1,734,734,734,734,734,734,734,734,734,734,734,734,-1,734,-2,734,734,734,734,-2,734,-4,734,734,-2,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,734,-4,734,734,734,734,734,734],
    sm566=[0,-2,53,-1,0,-4,0,-7,735,-130,233,234],
    sm567=[0,-2,736,-1,0,-4,0,-5,737,-8,738,-3,739,-27,740,741,742,743,-1,744,-9,745],
    sm568=[0,-2,53,-1,0,-4,0,-7,746,-130,233,234],
    sm569=[0,-1,1,2,-1,0,-4,0,-5,747,-2,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm570=[0,-2,53,-1,0,-4,0,-7,748,-130,233,234],
    sm571=[0,-1,1,2,-1,0,-4,0,-5,749,-2,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm572=[0,-4,0,-4,0,-11,750],
    sm573=[0,-4,-1,-4,0,-10,751,752],
    sm574=[0,-4,0,-4,0,-4,-1,-2,753],
    sm575=[0,754,754,754,-1,754,754,754,754,754,0,-4,-1,754,754,754,754,754,754,754,-1,754,754,-1,754,-14,754,754,754,-1,754,-1,754,-4,754,754,754,-1,754,754,-1,754,-1,754,754,754,-1,754,-2,754,-2,754,-2,754,-2,754,-2,754,-1,754,754,754,754,754,754,754,754,754,754,754,754,-1,754,-2,754,754,754,754,-2,754,-4,754,754,-2,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,754,-4,754,754,754,754,754,754],
    sm576=[0,-4,0,-4,0,-4,-1,-9,755],
    sm577=[0,-4,0,-4,0,-4,-1,-9,756],
    sm578=[0,-4,0,-4,0,-4,-1,-6,757],
    sm579=[0,-4,0,-4,0,-4,-1,-6,758],
    sm580=[0,-4,0,-4,0,-4,-1,-9,759],
    sm581=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,760,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm582=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,761,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm583=[0,-4,0,-4,0,-4,-1,-11,762],
    sm584=[0,763,763,763,-1,0,-4,0,-4,-1,-1,763,763,763,763,763,763,-1,763,763,-1,763,-14,763,763,763,-1,763,-1,763,-4,763,763,763,-1,763,763,-1,763,-1,763,763,763,-1,763,-2,763,-2,763,-2,763,-2,763,-2,763,-1,763,763,763,763,763,763,763,763,763,763,763,763,-1,763,-2,763,763,763,763,-2,763,-4,763,763,-2,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,763,-4,763,763,763,763,763,763],
    sm585=[0,764,764,764,-1,0,-4,0,-4,-1,-1,764,764,764,764,764,764,-1,764,764,-1,764,-14,764,764,764,-1,764,-1,764,-4,764,764,764,-1,764,764,-1,764,-1,764,764,764,-1,764,-2,764,-2,764,-2,764,-2,764,-2,764,-1,764,764,764,764,764,764,764,764,764,764,764,764,-1,764,-2,764,764,764,764,764,-1,764,-4,764,764,-2,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,764,-4,764,764,764,764,764,764],
    sm586=[0,-4,0,-4,0,-4,-1,-6,765,-1,765,-2,765,-16,765,-3,765,-14,765,-24,765],
    sm587=[0,-4,0,-4,0,-4,-1,-6,766,-1,766,-2,766,-16,766,-3,766,-14,766,-24,766],
    sm588=[0,-4,0,-4,0,-4,-1,-47,767],
    sm589=[0,-4,0,-4,0,-4,-1,-53,768],
    sm590=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,769,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm591=[0,-4,0,-4,0,-4,-1,-6,770],
    sm592=[0,-4,0,-4,0,-4,-1,-6,771],
    sm593=[0,772,772,772,-1,0,-4,0,-4,-1,772,772,-1,772,-1,772,-3,772,-1,772,-25,772,772,-7,772,-6,772,-5,772,-2,772,772,-1,772,772,772,772,772,772,772,-1,772,772,772,772,772,772,772,772,-2,772,772,772,772,-2,772,-4,772,772,-2,772,-22,772,-1,772,772,772,772,772,772,-4,772,772,772,772,772,772],
    sm594=[0,-4,0,-4,0,-4,-1,-6,773],
    sm595=[0,774,774,774,-1,0,-4,0,-4,-1,774,774,-1,774,-1,774,-3,774,-1,774,-25,774,774,-7,774,-6,774,-5,774,-2,774,774,-1,774,774,774,774,774,774,774,-1,774,774,774,774,774,774,774,774,-2,774,774,774,774,-2,774,-4,774,774,-2,774,-22,774,-1,774,774,774,774,774,774,-4,774,774,774,774,774,774],
    sm596=[0,-4,0,-4,0,-4,-1,-6,775],
    sm597=[0,776,776,776,-1,0,-4,0,-4,-1,776,776,-1,776,-1,776,-3,776,-1,776,-25,776,776,-7,776,-6,776,-5,776,-2,776,776,-1,776,776,776,776,776,776,776,-1,776,776,776,776,776,776,776,776,-2,776,776,776,776,-2,776,-4,776,776,-2,776,-22,776,-1,776,776,776,776,776,776,-4,776,776,776,776,776,776],
    sm598=[0,-4,0,-4,0,-4,-1,-11,777,-51,709,-15,710],
    sm599=[0,-4,0,-4,0,-4,-1,-11,778,-67,710],
    sm600=[0,-4,0,-4,0,-4,-1,-11,779,-51,779,-15,779],
    sm601=[0,-4,0,-4,0,-4,-1,-56,780],
    sm602=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,781,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm603=[0,-4,0,-4,0,-4,-1,-11,782],
    sm604=[0,783,783,783,-1,0,-4,0,-4,-1,783,783,-1,783,-1,783,-3,783,-1,783,-25,783,783,-7,783,-6,783,-5,783,-2,783,783,-1,783,783,783,783,783,783,783,-1,783,783,783,783,783,783,783,783,-2,783,783,783,783,-2,783,-4,783,783,-2,783,-22,783,-1,783,783,783,783,783,783,-4,783,783,783,783,783,783],
    sm605=[0,-4,0,-4,0,-4,-1,-11,784],
    sm606=[0,785,785,785,-1,0,-4,0,-4,-1,785,785,-1,785,-1,785,-3,785,-1,785,-25,785,785,-7,785,-6,785,-5,785,-2,785,785,-1,785,785,785,785,785,785,785,-1,785,785,785,785,785,785,785,785,-2,785,785,785,785,-2,785,-4,785,785,-2,785,-22,785,-1,785,785,785,785,785,785,-4,785,785,785,785,785,785],
    sm607=[0,786,786,786,-1,0,-4,0,-4,-1,786,786,-1,786,-1,786,-3,786,-1,786,-25,786,786,-7,786,-6,786,-5,786,-2,786,786,-1,786,786,786,786,786,786,786,-1,786,786,786,786,786,786,786,786,-2,786,786,786,786,-2,786,-4,786,786,-2,786,-22,786,-1,786,786,786,786,786,786,-4,786,786,786,786,786,786],
    sm608=[0,-2,787,-1,0,-4,0,-7,787,-1,787,-128,787,787],
    sm609=[0,-2,788,-1,0,-4,0,-4,-1,-2,788,-1,788,-128,788,788],
    sm610=[0,-2,789,-1,789,789,789,789,789,0,-3,789,-1,-133,789,789],
    sm611=[0,-4,0,-4,0,-4,-1,-2,790],
    sm612=[0,791,791,791,-1,791,791,791,791,791,0,-4,-1,791,791,791,791,791,791,791,-1,791,791,-1,791,-14,791,791,791,-1,791,-1,791,-4,791,791,791,-1,791,791,-1,791,-1,791,791,791,-1,791,-2,791,-2,791,-2,791,-2,791,-2,791,-1,791,791,791,791,791,791,791,791,791,791,791,791,-1,791,-2,791,791,791,791,-2,791,-4,791,791,-2,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,791,-4,791,791,791,791,791,791],
    sm613=[0,792,792,792,-1,792,792,792,792,792,0,-4,-1,792,792,792,792,792,792,792,-1,792,792,-1,792,-14,792,792,792,-1,792,-1,792,-4,792,792,792,-1,792,792,-1,792,-1,792,792,792,-1,792,-2,792,-2,792,-2,792,-2,792,-2,792,-1,792,792,792,792,792,792,792,792,792,792,792,792,-1,792,-2,792,792,792,792,-2,792,-4,792,792,-2,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,-4,792,792,792,792,792,792],
    sm614=[0,-2,736,-1,0,-4,0,-5,793,-8,738,-3,739,-27,740,741,742,743,-1,744,-9,745],
    sm615=[0,-4,0,-4,0,-5,794],
    sm616=[0,-4,0,-4,0,-163,795],
    sm617=[0,-4,0,-4,0,-4,-1,796],
    sm618=[0,-2,736,-1,0,-4,0,-4,-1,797,-8,738,-3,739,-27,740,741,742,743,-1,744,-9,745],
    sm619=[0,-2,736,-1,0,-4,0,-4,-1,798,-8,738,-3,739,-27,740,741,742,743,-1,744,-9,745],
    sm620=[0,-2,799,-1,0,-4,0,-4,-1,799,-8,799,-3,799,-27,799,799,799,799,-1,799,-9,799],
    sm621=[0,-2,800,-1,0,-4,0,-4,-1,800,-8,800,-3,800,-27,800,800,800,800,-1,800,-6,801,-2,800],
    sm622=[0,-4,0,-4,0,-4,-1,-1,802,-10,803,-1,804,-7,805],
    sm623=[0,-2,806,-1,0,-4,0,-4,-1,806,-8,806,-3,806,-27,806,806,806,806,-1,806,-9,806],
    sm624=[0,-2,807,-1,0,-4,0,-4,-1,807,-8,807,-3,807,-27,807,807,807,807,-1,807,-9,807],
    sm625=[0,-4,0,-4,0,-4,-1,-8,808,809],
    sm626=[0,-2,736,-1,0,-4,0,-4,-1,-13,739],
    sm627=[0,-4,0,-4,0,-4,-1,-8,810,810],
    sm628=[0,-2,736,-1,0,-4,0,-4,-1,-2,811,-3,812,-1,812,812,-27,813,814,815,-1,740,741,742,743,-1,744,-9,745],
    sm629=[0,-2,816,-1,0,-4,0,-4,-1,-2,816,-3,816,-1,816,816,-27,816,816,816,-1,816,816,742,743,-1,744,-9,745],
    sm630=[0,-2,816,-1,0,-4,0,-4,-1,-2,816,-3,816,-1,816,816,-27,816,816,816,-1,816,816,816,816,-1,816,-9,817],
    sm631=[0,-2,818,-1,0,-4,0,-4,-1,-2,818,-3,818,-1,818,818,-27,818,818,818,-1,818,818,818,818,-1,818,-9,818],
    sm632=[0,-2,736,-1,0,-4,0,-4,-1,-41,819],
    sm633=[0,-2,820,-1,0,-4,0,-4,-1,-2,820,-3,820,-1,820,820,-27,820,820,820,-1,820,821,820,820,-1,820,-9,820],
    sm634=[0,-2,822,-1,0,-4,0,-4,-1,-2,822,-3,822,-1,822,822,-18,822,-8,822,822,822,-1,822,821,822,822,-1,822,822,822,822,822,-5,822],
    sm635=[0,-4,0,-4,0,-4,-1,-42,823],
    sm636=[0,-2,824,-1,0,-4,0,-4,-1,-41,824],
    sm637=[0,-2,825,-1,826,-4,827,-3,828,-1,828,-1,828,828,-1,828,828,-1,828,828,-3,828,-4,828,-7,828,828,828,-8,828,828,828,-1,828,828,828,828,-1,828,828,828,828,828,828,828,828,-2,828,-2,829,-61,830],
    sm638=[0,-2,831,-1,831,-4,831,-3,831,-1,831,-1,831,831,-1,831,831,-1,831,831,-3,831,-4,831,-7,831,831,831,-8,831,831,831,-1,831,831,831,831,-1,831,831,831,831,831,831,831,831,-2,831,-2,831,-61,831],
    sm639=[0,-2,832,-1,0,-4,0,-4,-1,-2,832,-3,832,-1,832,832,-27,832,832,832,-1,832,832,832,832,-1,832,-9,832],
    sm640=[0,-2,833,-1,0,-4,0,-4,-1,-2,833,-3,833,-1,833,833,-27,833,833,833,-1,833,833,833,833,-1,833,-9,833],
    sm641=[0,-2,736,-1,0,-4,0,-4,-1],
    sm642=[0,-2,736,-1,0,-4,0,-4,-1,-41,834,741],
    sm643=[0,-2,736,-1,0,-4,0,-4,-1,-56,835],
    sm644=[0,-2,836,-1,0,-4,0,-4,-1,-2,836,-3,836,-1,836,836,-27,836,836,836,-1,836,836,836,836,-1,836,-9,836],
    sm645=[0,-2,837,-1,0,-4,0,-4,-1,-2,837,-3,837,-1,837,837,-27,837,837,837,-1,837,837,837,837,-1,837,-9,835],
    sm646=[0,-4,0,-4,0,-4,-1,-53,838],
    sm647=[0,-4,0,-4,0,-4,-1,-53,839],
    sm648=[0,-4,0,-4,0,-4,-1,-53,840],
    sm649=[0,-1,1,2,-1,0,-4,0,-5,841,-2,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm650=[0,-4,0,-4,0,-5,842],
    sm651=[0,-4,0,-4,0,-164,843],
    sm652=[0,-4,0,-4,0,-4,-1,844],
    sm653=[0,-4,0,-4,0,-4,-1,845],
    sm654=[0,-1,1,2,-1,0,-4,0,-5,846,-2,79,-1,5,-3,6,-27,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm655=[0,-4,0,-4,0,-5,847],
    sm656=[0,-4,0,-4,0,-165,848],
    sm657=[0,-4,-1,-4,0,-10,849,850],
    sm658=[0,-1,1,2,-1,0,-4,0,-8,79,-1,5,851,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm659=[0,-1,852,852,-1,852,852,852,852,852,0,-5,852,-1,852,852,852,852,-127,852,852],
    sm660=[0,853,853,853,-1,853,853,853,853,853,0,-4,-1,853,853,853,853,853,853,853,-1,853,853,-1,853,-14,853,853,853,-1,853,-1,853,-4,853,853,853,-1,853,853,-1,853,-1,853,853,853,-1,853,-2,853,-2,853,-2,853,-2,853,-2,853,-1,853,853,853,853,853,853,853,853,853,853,853,853,-1,853,-2,853,853,853,853,-2,853,-4,853,853,-2,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,853,-4,853,853,853,853,853,853],
    sm661=[0,-4,0,-4,0,-4,-1,-9,854],
    sm662=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,855,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,-1,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm663=[0,-4,0,-4,0,-4,-1,-11,856],
    sm664=[0,857,857,857,-1,0,-4,0,-4,-1,-1,857,857,857,857,857,857,-1,857,857,-1,857,-14,857,857,857,-1,857,-1,857,-4,857,857,857,-1,857,857,-1,857,-1,857,857,857,-1,857,-2,857,-2,857,-2,857,-2,857,-2,857,-1,857,857,857,857,857,857,857,857,857,857,857,857,-1,857,-2,857,857,857,857,-2,857,-4,857,857,-2,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,857,-4,857,857,857,857,857,857],
    sm665=[0,-4,0,-4,0,-4,-1,-11,858],
    sm666=[0,859,859,859,-1,0,-4,0,-4,-1,-1,859,859,859,859,859,859,-1,859,859,-1,859,-14,859,859,859,-1,859,-1,859,-4,859,859,859,-1,859,859,-1,859,-1,859,859,859,-1,859,-2,859,-2,859,-2,859,-2,859,-2,859,-1,859,859,859,859,859,859,859,859,859,859,859,859,-1,859,-2,859,859,859,859,-2,859,-4,859,859,-2,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,859,-4,859,859,859,859,859,859],
    sm667=[0,860,860,860,-1,0,-4,0,-4,-1,-1,860,860,860,860,860,860,-1,860,860,-1,860,-14,860,860,860,-1,860,-1,860,-4,860,860,860,-1,860,860,-1,860,-1,860,860,860,-1,860,-2,860,-2,860,-2,860,-2,860,-2,860,-1,860,860,860,860,860,860,860,860,860,860,860,860,-1,860,-2,860,860,860,860,-2,860,-4,860,860,-2,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,-4,860,860,860,860,860,860],
    sm668=[0,-4,0,-4,0,-4,-1,-6,861,-1,861,-2,861,-16,861,-3,861,-14,861,-24,861],
    sm669=[0,862,862,862,-1,0,-4,0,-4,-1,862,862,-1,862,-1,862,-3,862,-1,862,-25,862,862,-7,862,-6,862,-5,862,-2,862,862,-1,862,862,862,862,862,862,862,-1,862,862,862,862,862,862,862,862,-2,862,862,862,862,-2,862,-4,862,862,-2,862,-22,862,-1,862,862,862,862,862,862,-4,862,862,862,862,862,862],
    sm670=[0,863,863,863,-1,0,-4,0,-4,-1,863,863,-1,863,-1,863,-3,863,-1,863,-25,863,863,-7,863,-6,863,-5,863,-2,863,863,-1,863,863,863,863,863,863,863,-1,863,863,863,863,863,863,863,863,-2,863,863,863,863,-2,863,-4,863,863,-2,863,-22,863,-1,863,863,863,863,863,863,-4,863,863,863,863,863,863],
    sm671=[0,-4,0,-4,0,-4,-1,-6,864],
    sm672=[0,865,865,865,-1,0,-4,0,-4,-1,865,865,-1,865,-1,865,-3,865,-1,865,-25,865,865,-7,865,-6,865,-5,865,-2,865,865,-1,865,865,865,865,865,865,865,-1,865,865,865,865,865,865,865,865,-2,865,865,865,865,-2,865,-4,865,865,-2,865,-22,865,-1,865,865,865,865,865,865,-4,865,865,865,865,865,865],
    sm673=[0,866,866,866,-1,0,-4,0,-4,-1,866,866,-1,866,-1,866,-3,866,-1,866,-25,866,866,-7,866,-6,866,-5,866,-2,866,866,-1,866,866,866,866,866,866,866,-1,866,866,866,866,866,866,866,866,-2,866,866,866,866,-2,866,-4,866,866,-2,866,-22,866,-1,866,866,866,866,866,866,-4,866,866,866,866,866,866],
    sm674=[0,867,867,867,-1,0,-4,0,-4,-1,867,867,-1,867,-1,867,-3,867,-1,867,-25,867,867,-7,867,-6,867,-5,867,-2,867,867,-1,867,867,867,867,867,867,867,-1,867,867,867,867,867,867,867,867,-2,867,867,867,867,-2,867,-4,867,867,-2,867,-22,867,-1,867,867,867,867,867,867,-4,867,867,867,867,867,867],
    sm675=[0,868,868,868,-1,0,-4,0,-4,-1,868,868,-1,868,-1,868,-3,868,-1,868,-25,868,868,-7,868,-6,868,-5,868,-2,868,868,-1,868,868,868,868,868,868,868,-1,868,868,868,868,868,868,868,868,-2,868,868,868,868,-2,868,-4,868,868,-2,868,-22,868,-1,868,868,868,868,868,868,-4,868,868,868,868,868,868],
    sm676=[0,869,869,869,-1,0,-4,0,-4,-1,869,869,-1,869,-1,869,-3,869,-1,869,-25,869,869,-7,869,-6,869,-5,869,-2,869,869,-1,869,869,869,869,869,869,869,-1,869,869,869,869,869,869,869,869,-2,869,869,869,869,-2,869,-4,869,869,-2,869,-22,869,-1,869,869,869,869,869,869,-4,869,869,869,869,869,869],
    sm677=[0,870,870,870,-1,0,-4,0,-4,-1,870,870,-1,870,-1,870,-3,870,-1,870,-25,870,870,-7,870,-6,870,-5,870,-2,870,870,-1,870,870,870,870,870,870,870,-1,870,870,870,870,870,870,870,870,-2,870,870,870,870,-2,870,-4,870,870,-2,870,-22,870,-1,870,870,870,870,870,870,-4,870,870,870,870,870,870],
    sm678=[0,871,871,871,-1,0,-4,0,-4,-1,871,871,-1,871,-1,871,-3,871,-1,871,-25,871,871,-7,871,-6,871,-5,871,-2,871,871,-1,871,871,871,871,871,871,871,-1,871,871,871,871,871,871,871,871,-2,871,871,871,871,-2,871,-4,871,871,-2,871,-22,871,-1,871,871,871,871,871,871,-4,871,871,871,871,871,871],
    sm679=[0,-4,0,-4,0,-4,-1,-11,872,-67,710],
    sm680=[0,873,873,873,-1,0,-4,0,-4,-1,873,873,-1,873,-1,873,-3,873,-1,873,-25,873,873,-7,873,-6,873,-5,873,-2,873,873,-1,873,873,873,873,873,873,873,-1,873,873,873,873,873,873,873,873,-2,873,873,873,873,-2,873,-4,873,873,-2,873,-22,873,-1,873,873,873,873,873,873,-4,873,873,873,873,873,873],
    sm681=[0,-4,0,-4,0,-4,-1,-11,874,-51,874,-15,874],
    sm682=[0,-4,0,-4,0,-4,-1,-11,875,-67,710],
    sm683=[0,-4,0,-4,0,-4,-1,-56,876],
    sm684=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,877,-25,7,8,-7,9,-6,10,-5,11,-5,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,877,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm685=[0,878,878,878,-1,0,-4,0,-4,-1,878,878,-1,878,-1,878,-3,878,-1,878,-25,878,878,-7,878,-6,878,-5,878,-2,878,878,-1,878,878,878,878,878,878,878,-1,878,878,878,878,878,878,878,878,-1,878,878,878,878,878,-2,878,-4,878,878,-2,878,-22,878,-1,878,878,878,878,878,878,-4,878,878,878,878,878,878],
    sm686=[0,-4,0,-4,0,-4,-1,-11,879],
    sm687=[0,880,880,880,-1,0,-4,0,-4,-1,880,880,-1,880,-1,880,-3,880,-1,880,-25,880,880,-7,880,-6,880,-5,880,-2,880,880,-1,880,880,880,880,880,880,880,-1,880,880,880,880,880,880,880,880,-2,880,880,880,880,-2,880,-4,880,880,-2,880,-22,880,-1,880,880,880,880,880,880,-4,880,880,880,880,880,880],
    sm688=[0,881,881,881,-1,0,-4,0,-4,-1,881,881,-1,881,-1,881,-3,881,-1,881,-25,881,881,-7,881,-6,881,-5,881,-2,881,881,-1,881,881,881,881,881,881,881,-1,881,881,881,881,881,881,881,881,-2,881,881,881,881,-2,881,-4,881,881,-2,881,-22,881,-1,881,881,881,881,881,881,-4,881,881,881,881,881,881],
    sm689=[0,882,882,882,-1,0,-4,0,-4,-1,882,882,-1,882,-1,882,-3,882,-1,882,-25,882,882,-7,882,-6,882,-5,882,-2,882,882,-1,882,882,882,882,882,882,882,-1,882,882,882,882,882,882,882,882,-2,882,882,882,882,-2,882,-4,882,882,-2,882,-22,882,-1,882,882,882,882,882,882,-4,882,882,882,882,882,882],
    sm690=[0,883,883,883,-1,883,883,883,883,883,0,-4,-1,883,883,883,883,883,883,883,-1,883,883,-1,883,-14,883,883,883,-1,883,-1,883,-4,883,883,883,-1,883,883,-1,883,-1,883,883,883,-1,883,-2,883,-2,883,-2,883,-2,883,-2,883,-1,883,883,883,883,883,883,883,883,883,883,883,883,-1,883,-2,883,883,883,883,-2,883,-4,883,883,-2,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,-4,883,883,883,883,883,883],
    sm691=[0,-4,0,-4,0,-5,884],
    sm692=[0,-4,0,-4,0,-163,885],
    sm693=[0,-4,0,-4,0,-163,886],
    sm694=[0,-4,0,-4,0,-7,887],
    sm695=[0,-2,736,-1,0,-4,0,-4,-1,888,-8,738,-3,739,-27,740,741,742,743,-1,744,-9,745],
    sm696=[0,-2,889,-1,0,-4,0,-4,-1,889,-8,889,-3,889,-27,889,889,889,889,-1,889,-9,889],
    sm697=[0,-2,890,-1,0,-4,0,-4,-1,890,-8,890,-3,890,-27,890,890,890,890,-1,890,-9,890],
    sm698=[0,-4,0,-4,0,-4,-1,-53,801],
    sm699=[0,-2,891,-1,0,-4,0,-4,-1,891,-8,891,-1,891,-1,891,-27,891,891,891,891,-1,891,-6,891,-2,891],
    sm700=[0,-4,0,-4,0,-3,892,-1,-34,893,-98,894,895],
    sm701=[0,-2,736,-1,0,-4,0,-4,-1,-5,896,-14,897,-2,898],
    sm702=[0,-4,0,-4,0,-4,-1,-15,899,-117,894,895],
    sm703=[0,-2,736,-1,0,-4,0,-4,900,-5,901,-14,902],
    sm704=[0,-2,736,-1,0,-4,0,-4,-1,-41,740,741,742,743,-1,744,-9,745],
    sm705=[0,-2,736,-1,0,-4,0,-4,-1,-11,903,-1,739,-39,904],
    sm706=[0,-2,905,-1,0,-4,0,-4,-1,-11,905,-1,905,-39,906],
    sm707=[0,-2,905,-1,0,-4,0,-4,-1,-11,905,-1,905,-39,905],
    sm708=[0,-2,907,-1,0,-4,0,-4,-1,-11,907,-1,907,-39,907],
    sm709=[0,-2,908,-1,0,-4,0,-4,-1,-11,908,-1,908,-39,908],
    sm710=[0,-4,0,-4,0,-4,-1,-56,909],
    sm711=[0,-2,736,-1,0,-4,0,-4,-1,-2,811,-3,910,-1,910,910,-27,813,814,815,-1,740,741,742,743,-1,744,-9,745],
    sm712=[0,-2,911,-1,0,-4,0,-4,-1,-2,911,-3,911,-1,911,911,-27,911,911,911,-1,911,911,911,911,-1,911,-9,911],
    sm713=[0,-2,912,-1,0,-4,0,-4,-1,-2,912,-3,912,-1,912,912,-27,912,912,912,-1,912,912,912,912,-1,912,-9,912],
    sm714=[0,-2,913,-1,0,-4,0,-4,-1,-41,913,913,913,913,-1,913,-9,913],
    sm715=[0,-2,914,-1,0,-4,0,-4,-1,-2,914,-3,914,-1,914,914,-27,914,914,914,-1,914,914,742,743,-1,744,-9,745],
    sm716=[0,-2,914,-1,0,-4,0,-4,-1,-2,914,-3,914,-1,914,914,-27,914,914,914,-1,914,914,914,914,-1,914,-9,817],
    sm717=[0,-2,915,-1,0,-4,0,-4,-1,-2,915,-3,915,-1,915,915,-27,915,915,915,-1,915,915,915,915,-1,915,-9,915],
    sm718=[0,-2,916,-1,0,-4,0,-4,-1,-2,916,-3,916,-1,916,916,-27,916,916,916,-1,916,916,916,916,-1,916,-9,916],
    sm719=[0,-4,0,-4,0,-4,-1,-56,835],
    sm720=[0,-2,917,-1,0,-4,0,-4,-1,-2,917,-3,917,-1,917,917,-27,917,917,917,-1,917,917,917,917,-1,917,-9,917],
    sm721=[0,-2,918,-1,0,-4,0,-4,-1,-2,918,-3,918,-1,918,918,-18,918,-8,918,918,918,-1,918,918,918,918,-1,918,918,918,918,918,-5,918],
    sm722=[0,-2,919,-1,0,-4,0,-4,-1,-41,919],
    sm723=[0,-2,825,-1,826,-4,827,-3,920,-1,920,-1,920,920,-1,920,920,-1,920,920,-3,920,-4,920,-7,920,920,920,-8,920,920,920,-1,920,920,920,920,-1,920,920,920,920,920,920,920,920,-2,920,-2,829,-61,830],
    sm724=[0,-2,921,-1,921,-4,0,-3,921,-1,921,-1,921,921,-1,921,921,-1,921,921,-3,921,-4,921,-7,921,921,921,-8,921,921,921,-1,921,921,921,921,-1,921,921,921,921,921,921,921,921,-2,921],
    sm725=[0,-2,922,-1,922,-4,922,-3,922,-1,922,-1,922,922,-1,922,922,-1,922,922,-3,922,-4,922,-7,922,922,922,-8,922,922,922,-1,922,922,922,922,-1,922,922,922,922,922,922,922,922,-2,922,-2,922,-61,922],
    sm726=[0,-2,923,-1,923,-4,923,-3,923,-1,923,-1,923,923,-1,923,923,-1,923,923,-3,923,-4,923,-7,923,923,923,-8,923,923,923,-1,923,923,923,923,-1,923,923,923,923,923,923,923,923,-2,923,-2,923,-61,923],
    sm727=[0,-2,924,-1,924,-4,0,-3,924,-1,924,-1,924,924,-1,924,924,-1,924,924,-3,924,-4,924,-7,924,924,924,-8,924,924,924,-1,924,924,924,924,-1,924,924,924,924,924,924,924,924,-2,924],
    sm728=[0,-2,925,-1,0,-4,0,-4,-1,-2,925,-3,925,-1,925,925,-27,925,925,925,-1,925,925,925,925,-1,925,-9,925],
    sm729=[0,-2,926,-1,0,-4,0,-4,-1,-2,926,-3,926,-1,926,926,-27,926,926,926,-1,926,926,926,926,-1,926,-9,926],
    sm730=[0,-4,0,-4,0,-4,-1,-28,927,-9,928,-8,929,930,931,932],
    sm731=[0,-4,0,-4,0,-4,-1,-42,821],
    sm732=[0,-2,933,-1,0,-4,0,-4,-1,-2,933,-2,934,933,-1,933,933,-27,933,933,933,-1,933,933,933,933,-1,933,-9,933],
    sm733=[0,-2,935,-1,0,-4,0,-4,-1,-2,935,-3,935,-1,935,935,-27,935,935,935,-1,935,935,935,935,-1,935,-9,935],
    sm734=[0,-2,936,-1,0,-4,0,-4,-1,-2,936,-3,936,-1,936,936,-27,936,936,936,-1,936,936,936,936,-1,936,-9,835],
    sm735=[0,-2,937,-1,0,-4,0,-4,-1,-2,937,-3,937,-1,937,937,-27,937,937,937,-1,937,937,937,937,-1,937,-9,937],
    sm736=[0,-4,0,-4,0,-5,938],
    sm737=[0,-4,0,-4,0,-164,939],
    sm738=[0,-4,0,-4,0,-164,940],
    sm739=[0,-4,0,-4,0,-7,941],
    sm740=[0,-4,0,-4,0,-5,942],
    sm741=[0,-4,0,-4,0,-165,943],
    sm742=[0,-4,0,-4,0,-165,944],
    sm743=[0,-4,0,-4,0,-7,945],
    sm744=[0,-1,1,2,-1,0,-4,0,-8,79,-1,5,946,-2,152,-27,7,8,-7,9,-12,11,-11,18,-14,153,-2,154,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm745=[0,-1,947,947,-1,947,947,947,947,947,0,-5,947,-1,947,947,947,947,-127,947,947],
    sm746=[0,-4,0,-4,0,-11,948],
    sm747=[0,-4,-1,-4,0,-11,949],
    sm748=[0,-4,0,-4,0,-4,-1,-11,950],
    sm749=[0,-4,0,-4,0,-4,-1,-11,951],
    sm750=[0,-4,0,-4,0,-4,-1,-11,952],
    sm751=[0,953,953,953,-1,0,-4,0,-4,-1,-1,953,953,953,953,953,953,-1,953,953,-1,953,-14,953,953,953,-1,953,-1,953,-4,953,953,953,-1,953,953,-1,953,-1,953,953,953,-1,953,-2,953,-2,953,-2,953,-2,953,-2,953,-1,953,953,953,953,953,953,953,953,953,953,953,953,-1,953,-2,953,953,953,953,-2,953,-4,953,953,-2,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,-4,953,953,953,953,953,953],
    sm752=[0,954,954,954,-1,0,-4,0,-4,-1,-1,954,954,954,954,954,954,-1,954,954,-1,954,-14,954,954,954,-1,954,-1,954,-4,954,954,954,-1,954,954,-1,954,-1,954,954,954,-1,954,-2,954,-2,954,-2,954,-2,954,-2,954,-1,954,954,954,954,954,954,954,954,954,954,954,954,-1,954,-2,954,954,954,954,-2,954,-4,954,954,-2,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,954,-4,954,954,954,954,954,954],
    sm753=[0,955,955,955,-1,0,-4,0,-4,-1,-1,955,955,955,955,955,955,-1,955,955,-1,955,-14,955,955,955,-1,955,-1,955,-4,955,955,955,-1,955,955,-1,955,-1,955,955,955,-1,955,-2,955,-2,955,-2,955,-2,955,-2,955,-1,955,955,955,955,955,955,955,955,955,955,955,955,-1,955,-2,955,955,955,955,-2,955,-4,955,955,-2,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,955,-4,955,955,955,955,955,955],
    sm754=[0,956,956,956,-1,0,-4,0,-4,-1,956,956,-1,956,-1,956,-3,956,-1,956,-25,956,956,-7,956,-6,956,-5,956,-2,956,956,-1,956,956,956,956,956,956,956,-1,956,956,956,956,956,956,956,956,-2,956,956,956,956,-2,956,-4,956,956,-2,956,-22,956,-1,956,956,956,956,956,956,-4,956,956,956,956,956,956],
    sm755=[0,957,957,957,-1,0,-4,0,-4,-1,957,957,-1,957,-1,957,-3,957,-1,957,-25,957,957,-7,957,-6,957,-5,957,-2,957,957,-1,957,957,957,957,957,957,957,-1,957,957,957,957,957,957,957,957,-2,957,957,957,957,-2,957,-4,957,957,-2,957,-22,957,-1,957,957,957,957,957,957,-4,957,957,957,957,957,957],
    sm756=[0,958,958,958,-1,0,-4,0,-4,-1,958,958,-1,958,-1,958,-3,958,-1,958,-25,958,958,-7,958,-6,958,-5,958,-2,958,958,-1,958,958,958,958,958,958,958,-1,958,958,958,958,958,958,958,958,-2,958,958,958,958,-2,958,-4,958,958,-2,958,-22,958,-1,958,958,958,958,958,958,-4,958,958,958,958,958,958],
    sm757=[0,959,959,959,-1,0,-4,0,-4,-1,959,959,-1,959,-1,959,-3,959,-1,959,-25,959,959,-7,959,-6,959,-5,959,-2,959,959,-1,959,959,959,959,959,959,959,-1,959,959,959,959,959,959,959,959,-2,959,959,959,959,-2,959,-4,959,959,-2,959,-22,959,-1,959,959,959,959,959,959,-4,959,959,959,959,959,959],
    sm758=[0,960,960,960,-1,0,-4,0,-4,-1,960,960,-1,960,-1,960,-3,960,-1,960,-25,960,960,-7,960,-6,960,-5,960,-2,960,960,-1,960,960,960,960,960,960,960,-1,960,960,960,960,960,960,960,960,-2,960,960,960,960,-2,960,-4,960,960,-2,960,-22,960,-1,960,960,960,960,960,960,-4,960,960,960,960,960,960],
    sm759=[0,-4,0,-4,0,-4,-1,-11,961],
    sm760=[0,962,962,962,-1,0,-4,0,-4,-1,962,962,-1,962,-1,962,-3,962,-1,962,-25,962,962,-7,962,-6,962,-5,962,-2,962,962,-1,962,962,962,962,962,962,962,-1,962,962,962,962,962,962,962,962,-2,962,962,962,962,-2,962,-4,962,962,-2,962,-22,962,-1,962,962,962,962,962,962,-4,962,962,962,962,962,962],
    sm761=[0,-1,1,2,-1,0,-4,0,-4,-1,-3,79,-1,5,-3,6,-1,963,-25,7,8,-7,9,-6,10,-5,11,-3,963,-1,13,-1,14,15,16,17,18,-1,19,20,21,22,23,24,963,25,-2,26,27,28,29,-2,30,-4,31,32,-2,33,-22,34,-1,35,36,37,38,39,40,-4,41,42,43,44,45,46],
    sm762=[0,-4,0,-4,0,-4,-1,-11,964,-67,964],
    sm763=[0,965,965,965,-1,0,-4,0,-4,-1,965,965,-1,965,-1,965,-3,965,-1,965,-25,965,965,-7,965,-6,965,-5,965,-2,965,965,-1,965,965,965,965,965,965,965,-1,965,965,965,965,965,965,965,965,-2,965,965,965,965,-2,965,-4,965,965,-2,965,-22,965,-1,965,965,965,965,965,965,-4,965,965,965,965,965,965],
    sm764=[0,-4,0,-4,0,-163,966],
    sm765=[0,-4,0,-4,0,-7,967],
    sm766=[0,-4,0,-4,0,-7,968],
    sm767=[0,-1,969,969,-1,969,969,969,969,969,0,-5,969,-2,969,-1,969],
    sm768=[0,-4,0,-4,0,-3,970,-1,-34,893,-98,894,895],
    sm769=[0,-2,736,-1,0,-4,0,-4,-1,971,-4,896,-3,971,-2,972,971,-6,897,-2,898,-17,971,971,971,971,-1,971,-6,971,-2,971],
    sm770=[0,-4,0,-4,0,-3,973,-1,-34,973,-98,973,973],
    sm771=[0,-2,974,-1,0,-4,0,-4,-1,974,-4,974,-3,974,-2,974,974,-6,974,-2,974,-17,974,974,974,974,-1,974,-6,974,-2,974],
    sm772=[0,-4,0,-4,0,-3,892,-1],
    sm773=[0,-4,0,-4,0,-4,-1,-5,975],
    sm774=[0,-4,0,-4,0,-4,-1,-8,976,977],
    sm775=[0,-2,978,-1,0,-4,0,-4,-1,978,-7,978,978,-3,978,-27,978,978,978,978,-1,978,-6,978,-2,978],
    sm776=[0,-2,979,-1,0,-4,0,-4,-1,979,-7,979,979,-3,979,-27,979,979,979,979,-1,979,-6,979,-2,979],
    sm777=[0,-2,979,-1,0,-4,0,-4,-1,979,-7,979,979,-3,979,-4,980,-22,979,979,979,979,-1,979,-6,979,-2,979],
    sm778=[0,-2,981,-1,0,-4,0,-4,-1,981,-5,981,-1,981,981,-3,981,-27,981,981,981,981,-1,981,-6,981,-2,981],
    sm779=[0,-2,982,-1,0,-4,0,-4,-1,982,-5,982,-1,982,982,-3,982,-27,982,982,982,982,-1,982,-6,982,-2,982],
    sm780=[0,-2,982,-1,0,-4,0,-4,-1,982,-5,982,-1,982,982,-3,982,-4,983,984,-21,982,982,982,982,-1,982,-6,982,-2,982],
    sm781=[0,-2,736,-1,0,-4,0,-4,-1,-5,896],
    sm782=[0,-1,985,736,-1,0,-4,0,-4,-1,-5,896,-14,986],
    sm783=[0,-2,987,-1,0,-4,0,-4,-1,987,-5,987,-1,987,987,-3,987,-4,987,987,-21,987,987,987,987,-1,987,-6,987,-2,987],
    sm784=[0,-2,988,-1,0,-4,0,-4,-1,988,-4,989,-2,988,988,-3,988,-4,988,-22,988,988,988,988,-1,988,-6,988,-2,988],
    sm785=[0,-2,990,-1,0,-4,0,-4,-1],
    sm786=[0,-4,0,-4,0,-4,-1,-9,991],
    sm787=[0,-4,0,-4,0,-4,-1,-9,992],
    sm788=[0,-4,0,-4,0,-4,-1,-9,993],
    sm789=[0,-2,736,-1,0,-4,0,-4,900,-5,901],
    sm790=[0,-4,0,-4,0,-4,-1,-6,994,-2,994,-8,995,996],
    sm791=[0,-4,0,-4,0,-4,-1,-6,997,-2,997,-8,997,997],
    sm792=[0,-4,0,-4,0,-4,-1,-6,998,-2,998,-8,998,998],
    sm793=[0,-4,0,-4,0,-4,-1,-5,999],
    sm794=[0,-4,0,-4,0,-4,-1,-5,989],
    sm795=[0,-2,736,-1,0,-4,0,-4,-1,-11,1000,-1,739,-39,1001],
    sm796=[0,-4,0,-4,0,-4,-1,-8,1002,1002],
    sm797=[0,-4,0,-4,0,-4,-1,-11,1003],
    sm798=[0,-2,1004,-1,0,-4,0,-4,-1,1004,-8,1004,-1,1004,-1,1004,-27,1004,1004,1004,1004,-1,1004,-9,1004],
    sm799=[0,-2,1005,-1,0,-4,0,-4,-1,-11,1005,-1,1005,-39,1005],
    sm800=[0,-2,1006,-1,0,-4,0,-4,-1,-11,1006,-1,1006,-39,1007],
    sm801=[0,-2,736,-1,0,-4,0,-4,-1,-11,1008,-1,1008,-39,1008],
    sm802=[0,-2,1009,-1,1010,-4,0,-3,1011,-1,-5,1012],
    sm803=[0,-2,1013,-1,0,-4,0,-4,-1,-2,1013,-3,1013,-1,1013,1013,-27,1013,1013,1013,-1,1013,1013,1013,1013,-1,1013,-9,1013],
    sm804=[0,-2,1014,-1,0,-4,0,-4,-1,-2,1014,-3,1014,-1,1014,1014,-27,1014,1014,1014,-1,1014,1014,1014,1014,-1,1014,-9,1014],
    sm805=[0,-2,1015,-1,0,-4,0,-4,-1,-2,1015,-3,1015,-1,1015,1015,-27,1015,1015,1015,-1,1015,1015,1015,1015,-1,1015,-9,817],
    sm806=[0,-2,1016,-1,1016,-4,0,-3,1016,-1,1016,-1,1016,1016,-1,1016,1016,-1,1016,1016,-3,1016,-4,1016,-7,1016,1016,1016,-8,1016,1016,1016,-1,1016,1016,1016,1016,-1,1016,1016,1016,1016,1016,1016,1016,1016,-2,1016],
    sm807=[0,-2,1017,-1,1017,-4,1017,-3,1017,-1,1017,-1,1017,1017,-1,1017,1017,-1,1017,1017,-3,1017,-4,1017,-7,1017,1017,1017,-8,1017,1017,1017,-1,1017,1017,1017,1017,-1,1017,1017,1017,1017,1017,1017,1017,1017,-2,1017,-2,1017,-61,1017],
    sm808=[0,-2,1018,-1,0,-4,0,-4,-1,-2,1018,-3,1018,-1,1018,1018,-27,1018,1018,1018,-1,1018,1018,1018,1018,-1,1018,-9,1018],
    sm809=[0,-2,736,1019,0,-4,0,-4,-1],
    sm810=[0,-4,0,-4,0,-4,-1,-28,1020],
    sm811=[0,-2,1021,1021,0,-4,0,-4,-1],
    sm812=[0,-2,1022,-1,0,-4,0,-4,-1,-2,1022,-3,1022,-1,1022,1022,-27,1022,1022,1022,-1,1022,1022,1022,1022,-1,1022,-9,1022],
    sm813=[0,-2,1023,-1,0,-4,0,-4,-1,-2,1023,-3,1023,-1,1023,1023,-27,1023,1023,1023,-1,1023,1023,1023,1023,-1,1023,-9,1023],
    sm814=[0,-4,0,-4,0,-164,1024],
    sm815=[0,-4,0,-4,0,-7,1025],
    sm816=[0,-4,0,-4,0,-7,1026],
    sm817=[0,-4,0,-4,0,-165,1027],
    sm818=[0,-4,0,-4,0,-7,1028],
    sm819=[0,-4,0,-4,0,-7,1029],
    sm820=[0,-4,0,-4,0,-11,1030],
    sm821=[0,-4,-1,-4,0,-11,1031],
    sm822=[0,-4,-1,-4,0,-11,1032],
    sm823=[0,-1,1033,1033,-1,1033,1033,1033,1033,1033,0,-5,1033,-1,1033,1033,1033,1033,-127,1033,1033],
    sm824=[0,-1,1034,1034,-1,0,-4,0,-4,-1,-8,1034,-2,1034,-34,1034,-6,1034,-5,1034,-31,1034,1034,1034,-39,1034,1034,-3,1034],
    sm825=[0,-1,1035,1035,-1,0,-4,0,-4,-1,-8,1035,-2,1035,-34,1035,-6,1035,-5,1035,-31,1035,1035,1035,-39,1035,1035,-3,1035],
    sm826=[0,-4,0,-4,0,-4,-1,-11,1036],
    sm827=[0,1037,1037,1037,-1,0,-4,0,-4,-1,-1,1037,1037,1037,1037,1037,1037,-1,1037,1037,-1,1037,-14,1037,1037,1037,-1,1037,-1,1037,-4,1037,1037,1037,-1,1037,1037,-1,1037,-1,1037,1037,1037,-1,1037,-2,1037,-2,1037,-2,1037,-2,1037,-2,1037,-1,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,-1,1037,-2,1037,1037,1037,1037,-2,1037,-4,1037,1037,-2,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,1037,-4,1037,1037,1037,1037,1037,1037],
    sm828=[0,1038,1038,1038,-1,0,-4,0,-4,-1,1038,1038,-1,1038,-1,1038,-3,1038,-1,1038,-25,1038,1038,-7,1038,-6,1038,-5,1038,-2,1038,1038,-1,1038,1038,1038,1038,1038,1038,1038,-1,1038,1038,1038,1038,1038,1038,1038,1038,-2,1038,1038,1038,1038,-2,1038,-4,1038,1038,-2,1038,-22,1038,-1,1038,1038,1038,1038,1038,1038,-4,1038,1038,1038,1038,1038,1038],
    sm829=[0,1039,1039,1039,-1,0,-4,0,-4,-1,1039,1039,-1,1039,-1,1039,-3,1039,-1,1039,-25,1039,1039,-7,1039,-6,1039,-5,1039,-2,1039,1039,-1,1039,1039,1039,1039,1039,1039,1039,-1,1039,1039,1039,1039,1039,1039,1039,1039,-2,1039,1039,1039,1039,-2,1039,-4,1039,1039,-2,1039,-22,1039,-1,1039,1039,1039,1039,1039,1039,-4,1039,1039,1039,1039,1039,1039],
    sm830=[0,-4,0,-4,0,-4,-1,-11,1040,-51,1040,-15,1040],
    sm831=[0,-4,0,-4,0,-7,1041],
    sm832=[0,-1,1042,1042,-1,1042,1042,1042,1042,1042,0,-5,1042,-2,1042,-1,1042],
    sm833=[0,-1,1043,1043,-1,1043,1043,1043,1043,1043,0,-5,1043,-2,1043,-1,1043],
    sm834=[0,-2,736,-1,0,-4,0,-4,-1,1044,-4,896,-3,1044,-2,972,1044,-6,897,-2,898,-17,1044,1044,1044,1044,-1,1044,-6,1044,-2,1044],
    sm835=[0,-4,0,-4,0,-3,1045,-1,-34,1045,-98,1045,1045],
    sm836=[0,-2,736,-1,0,-4,0,-4,-1,1044,-4,896,-3,1044,-3,1044,-6,897,-2,898,-17,1044,1044,1044,1044,-1,1044,-6,1044,-2,1044],
    sm837=[0,-2,1044,-1,0,-4,0,-4,-1,1044,-7,976,1044,-3,1044,-27,1044,1044,1044,1044,-1,1044,-6,1044,-2,1044],
    sm838=[0,-4,0,-4,0,-4,-1,-5,1046],
    sm839=[0,-4,0,-4,0,-3,970,-1,-133,1047],
    sm840=[0,-4,0,-4,0,-3,970,-1,-134,1048],
    sm841=[0,-4,0,-4,0,-4,-1,-133,894,895],
    sm842=[0,-2,736,-1,0,-4,0,-4,-1,-9,738,-1,1049,-29,740,741,742,743,-1,744,-9,745],
    sm843=[0,-2,1050,-1,0,-4,0,-4,-1,1050,-7,1050,1050,-3,1050,-4,980,-22,1050,1050,1050,1050,-1,1050,-6,1050,-2,1050],
    sm844=[0,-2,988,-1,0,-4,0,-4,-1,988,-7,988,988,-3,988,-4,988,-22,988,988,988,988,-1,988,-6,988,-2,988],
    sm845=[0,-2,1050,-1,0,-4,0,-4,-1,1050,-7,1050,1050,-3,1050,-27,1050,1050,1050,1050,-1,1050,-6,1050,-2,1050],
    sm846=[0,-2,736,-1,0,-4,0,-4,-1,-5,896,-14,986],
    sm847=[0,-2,1051,-1,0,-4,0,-4,-1,1051,-5,1051,-1,1051,1051,-3,1051,-4,983,-22,1051,1051,1051,1051,-1,1051,-6,1051,-2,1051],
    sm848=[0,-2,1052,-1,0,-4,0,-4,-1,1052,-5,1052,-1,1052,1052,-3,1052,-5,984,-21,1052,1052,1052,1052,-1,1052,-6,1052,-2,1052],
    sm849=[0,-2,1053,-1,0,-4,0,-4,-1,1053,-5,1053,-1,1053,1053,-3,1053,-4,1053,-22,1053,1053,1053,1053,-1,1053,-6,1053,-2,1053],
    sm850=[0,-2,1054,-1,0,-4,0,-4,-1,1054,-5,1054,-1,1054,1054,-3,1054,-5,1054,-21,1054,1054,1054,1054,-1,1054,-6,1054,-2,1054],
    sm851=[0,-2,1055,-1,0,-4,0,-4,-1,1055,-5,1055,-1,1055,1055,-3,1055,-27,1055,1055,1055,1055,-1,1055,-6,1055,-2,1055],
    sm852=[0,-4,0,-4,0,-4,-1,-6,1056],
    sm853=[0,-4,0,-4,0,-4,-1,-6,1057],
    sm854=[0,-4,1058,-4,0,-3,1059,-1,-2,1060,1060,-1,989,1061,-19,1060,1060,1060,-27,1060],
    sm855=[0,-4,0,-4,0,-4,-1,-6,1062],
    sm856=[0,-4,0,-4,0,-4,-1,-2,1063,1064,-22,1065,1066,1067,-27,1068],
    sm857=[0,-4,0,-4,0,-4,-1,-2,1069,1070,-22,1071,1072,1067],
    sm858=[0,-4,0,-4,0,-4,-1,-2,1073,1073,1074,-1,1073,-19,1073,1073,1073,-2,1075,1076,1077],
    sm859=[0,-4,0,-4,0,-4,-1,-2,1073,1073,-2,1073,-19,1073,1073,1073],
    sm860=[0,-4,1058,-4,0,-3,1059,-1,-6,1078],
    sm861=[0,-1,1079,-2,0,-4,0,-4,-1,-16,1080,1081],
    sm862=[0,-4,0,-4,0,-4,-1,-6,1082,-2,1082],
    sm863=[0,-4,0,-4,0,-4,-1,-6,1082,-2,1082,-8,995,996],
    sm864=[0,-4,0,-4,0,-4,-1,-6,1083,-2,1083,-8,1083,1083],
    sm865=[0,-2,1084,-1,0,-4,0,-4,1084,-5,1084],
    sm866=[0,-4,0,-4,0,-4,-1,-6,1085],
    sm867=[0,-4,0,-4,0,-4,-1,-6,1086],
    sm868=[0,-4,1058,-4,0,-3,1059,-1,-5,989,1061,-49,909],
    sm869=[0,-4,0,-4,0,-4,-1,-11,1087],
    sm870=[0,-2,1088,-1,0,-4,0,-4,-1,1088,-8,1088,-1,1088,-1,1088,-27,1088,1088,1088,1088,-1,1088,-9,1088],
    sm871=[0,-2,1089,-1,0,-4,0,-4,-1,1089,-8,1089,-1,1089,-1,1089,-27,1089,1089,1089,1089,-1,1089,-9,1089],
    sm872=[0,-2,736,-1,0,-4,0,-4,-1,-11,1090,-1,1090,-39,1090],
    sm873=[0,-2,1091,-1,0,-4,0,-4,-1,-11,1091,-1,1091,-39,1091],
    sm874=[0,-2,1009,-1,1010,-4,0,-3,1011,-1,-5,1012,1092,-4,1092,-1,1092,-39,1092,-72,1093],
    sm875=[0,-2,1009,-1,1010,-4,0,-3,1011,-1,-5,1094,1094,-4,1094,-1,1094,-39,1094,-72,1094],
    sm876=[0,-2,1095,-1,1095,-4,0,-3,1095,-1,-5,1095,1095,-4,1095,-1,1095,-39,1095,-72,1095],
    sm877=[0,-2,1096,-1,1096,-4,0,-3,1096,-1,-5,1096,1096,-4,1096,-1,1096,-39,1096,-72,1096],
    sm878=[0,-4,0,-4,0,-4,-1,-47,1097,-3,1098,1099],
    sm879=[0,-4,0,-4,0,-4,-1,-47,1100,-3,1100,1100],
    sm880=[0,-2,1101,1101,0,-4,0,-4,-1],
    sm881=[0,-4,0,-4,0,-4,-1,-6,1102],
    sm882=[0,-4,0,-4,0,-7,1103],
    sm883=[0,-4,0,-4,0,-7,1104],
    sm884=[0,-4,-1,-4,0,-11,1105],
    sm885=[0,-1,1106,1106,-1,1106,1106,1106,1106,1106,0,-5,1106,-1,1106,1106,1106,1106,-127,1106,1106],
    sm886=[0,-1,1107,1107,-1,1107,1107,1107,1107,1107,0,-5,1107,-1,1107,1107,1107,1107,-127,1107,1107],
    sm887=[0,-1,1108,1108,-1,0,-4,0,-4,-1,-8,1108,-2,1108,-34,1108,-6,1108,-5,1108,-31,1108,1108,1108,-39,1108,1108,-3,1108],
    sm888=[0,-1,1109,1109,-1,1109,1109,1109,1109,1109,0,-5,1109,-2,1109,-1,1109],
    sm889=[0,-2,736,-1,0,-4,0,-4,-1,1110,-4,896,-3,1110,-3,1110,-6,897,-2,898,-17,1110,1110,1110,1110,-1,1110,-6,1110,-2,1110],
    sm890=[0,-2,1110,-1,0,-4,0,-4,-1,1110,-7,976,1110,-3,1110,-27,1110,1110,1110,1110,-1,1110,-6,1110,-2,1110],
    sm891=[0,-2,1111,-1,0,-4,0,-4,-1,1111,-4,1111,1111,-2,1111,-2,1111,1111,-6,1111,-2,1111,-17,1111,1111,1111,1111,-1,1111,-6,1111,-2,1111],
    sm892=[0,-4,0,-4,0,-4,-1,-6,1112],
    sm893=[0,-4,0,-4,0,-4,-1,-11,1113],
    sm894=[0,-2,736,-1,0,-4,0,-4,-1,-9,738,-1,1114,-29,740,741,742,743,-1,744,-9,745],
    sm895=[0,-2,1115,-1,0,-4,0,-4,-1,-9,1115,-1,1115,-29,1115,1115,1115,1115,-1,1115,-9,1115],
    sm896=[0,-2,1116,-1,0,-4,0,-4,-1,1116,-7,1116,1116,-3,1116,-27,1116,1116,1116,1116,-1,1116,-6,1116,-2,1116],
    sm897=[0,-2,1117,-1,0,-4,0,-4,-1,1117,-7,1117,1117,-3,1117,-27,1117,1117,1117,1117,-1,1117,-6,1117,-2,1117],
    sm898=[0,-2,1118,-1,0,-4,0,-4,-1,1118,-7,1118,1118,-3,1118,-27,1118,1118,1118,1118,-1,1118,-6,1118,-2,1118],
    sm899=[0,-2,982,-1,0,-4,0,-4,-1,982,-7,982,982,-3,982,-4,983,-22,982,982,982,982,-1,982,-6,982,-2,982],
    sm900=[0,-2,1119,-1,0,-4,0,-4,-1,1119,-5,1119,-1,1119,1119,-3,1119,-4,1119,-22,1119,1119,1119,1119,-1,1119,-6,1119,-2,1119],
    sm901=[0,-2,1120,-1,0,-4,0,-4,-1,1120,-5,1120,-1,1120,1120,-3,1120,-5,1120,-21,1120,1120,1120,1120,-1,1120,-6,1120,-2,1120],
    sm902=[0,-2,1121,-1,0,-4,0,-4,-1,1121,-5,1121,-1,1121,1121,-3,1121,-4,1121,-22,1121,1121,1121,1121,-1,1121,-6,1121,-2,1121],
    sm903=[0,-2,1122,-1,0,-4,0,-4,-1,1122,-5,1122,-1,1122,1122,-3,1122,-5,1122,-21,1122,1122,1122,1122,-1,1122,-6,1122,-2,1122],
    sm904=[0,-2,1123,-1,0,-4,0,-4,-1,1123,-5,1123,-1,1123,1123,-3,1123,-4,1123,1123,-21,1123,1123,1123,1123,-1,1123,-6,1123,-2,1123],
    sm905=[0,-2,1124,-1,0,-4,0,-4,-1,1124,-5,1124,-1,1124,1124,-3,1124,-4,1124,1124,-21,1124,1124,1124,1124,-1,1124,-6,1124,-2,1124],
    sm906=[0,-4,1058,-4,0,-3,1059,-1,-6,1125],
    sm907=[0,-2,1126,-1,0,-4,0,-4,-1,1126,-5,1126,-1,1126,1126,-3,1126,-4,1126,1126,-21,1126,1126,1126,1126,-1,1126,-6,1126,-2,1126],
    sm908=[0,-4,1127,-4,0,-3,1127,-1,-6,1127],
    sm909=[0,-4,1128,-4,0,-3,1128,-1,-6,1128],
    sm910=[0,-1,985,736,-1,0,-4,0,-4,-1],
    sm911=[0,-1,1129,1129,-1,0,-4,0,-4,-1],
    sm912=[0,-2,1129,-1,0,-4,0,-4,-1],
    sm913=[0,-4,0,-4,0,-4,-1,-2,1130,1130,-2,1130,-19,1130,1130,1130],
    sm914=[0,-1,1131,-2,0,-4,0,-4,-1],
    sm915=[0,-4,0,-4,0,-4,-1,-2,1132,1132,-2,1132,-19,1132,1132,1132],
    sm916=[0,-4,1058,-4,0,-3,1059,-1,-6,1133],
    sm917=[0,-1,1079,-2,0,-4,0,-4,-1,-11,1134,-4,1080,1081],
    sm918=[0,-1,1135,-2,0,-4,0,-4,-1,-11,1135,-4,1135,1135],
    sm919=[0,-4,0,-4,0,-4,-1,-8,1136,1137],
    sm920=[0,-4,0,-4,0,-4,-1,-8,1138,1138],
    sm921=[0,-4,0,-4,0,-4,-1,-8,1139,1139],
    sm922=[0,-4,0,-4,0,-4,-1,-30,1140],
    sm923=[0,-4,0,-4,0,-4,-1,-11,1141],
    sm924=[0,-4,0,-4,0,-4,-1,-6,1142,-2,1142,-8,1142,1142],
    sm925=[0,-4,0,-4,0,-4,-1,-6,1143,-2,1143,-8,1143,1143],
    sm926=[0,-4,0,-4,0,-4,-1,-6,1144,-2,1144,-8,1144,1144],
    sm927=[0,-4,0,-4,0,-4,-1,-6,1145,-2,1145,-8,1145,1145],
    sm928=[0,-4,0,-4,0,-4,-1,-6,1146],
    sm929=[0,-2,1147,-1,0,-4,0,-4,-1,1147,-8,1147,-1,1147,-1,1147,-27,1147,1147,1147,1147,-1,1147,-9,1147],
    sm930=[0,-2,1148,-1,0,-4,0,-4,-1,-6,1148,-4,1148,-1,1148,-39,1148],
    sm931=[0,-2,1009,-1,1010,-4,0,-3,1011,-1,-5,1012,1149,-4,1149,-1,1149,-39,1149,-72,1149],
    sm932=[0,-4,0,-4,0,-4,-1,-55,1150],
    sm933=[0,-2,1151,-1,1151,-4,0,-3,1151,-1,-5,1151,1151,-4,1151,-1,1151,-39,1151,-72,1151],
    sm934=[0,-2,1009,-1,1010,-4,0,-3,1011,-1,-5,1012,1152],
    sm935=[0,-4,0,-4,0,-4,-1,-47,1153],
    sm936=[0,-2,1154,-1,0,-4,0,-4,-1,-2,1154,-3,1154,-1,1154,1154,-27,1154,1154,1154,-1,1154,1154,1154,1154,-1,1154,-9,1154],
    sm937=[0,-4,0,-4,0,-4,-1,-47,1155],
    sm938=[0,-2,1156,-1,0,-4,0,-4,-1,-2,1156,-3,1156,-1,1156,1156,-27,1156,1156,1156,-1,1156,1156,1156,1156,-1,1156,-9,1156],
    sm939=[0,-1,1157,1157,-1,1157,1157,1157,1157,1157,0,-5,1157,-1,1157,1157,1157,1157,-127,1157,1157],
    sm940=[0,-2,1158,-1,0,-4,0,-4,-1,1158,-7,976,1158,-3,1158,-27,1158,1158,1158,1158,-1,1158,-6,1158,-2,1158],
    sm941=[0,-4,0,-4,0,-4,-1,-6,1159],
    sm942=[0,-4,0,-4,0,-4,-1,-6,1160],
    sm943=[0,-4,0,-4,0,-4,-1,-5,989,-50,909],
    sm944=[0,-2,1161,-1,0,-4,0,-4,-1,1161,-4,1161,-3,1161,-2,1161,1161,-6,1161,-2,1161,-17,1161,1161,1161,1161,-1,1161,-6,1161,-2,1161],
    sm945=[0,-4,0,-4,0,-4,-1,-53,1162],
    sm946=[0,-2,1163,-1,0,-4,0,-4,-1,-9,1163,-1,1163,-29,1163,1163,1163,1163,-1,1163,-9,1163],
    sm947=[0,-2,1164,-1,0,-4,0,-4,-1,1164,-5,1164,-1,1164,1164,-3,1164,-4,1164,1164,-21,1164,1164,1164,1164,-1,1164,-6,1164,-2,1164],
    sm948=[0,-4,1165,-4,0,-3,1165,-1,-6,1165],
    sm949=[0,-4,0,-4,0,-4,-1,-6,1166],
    sm950=[0,-4,0,-4,0,-4,-1,-6,1073],
    sm951=[0,-4,0,-4,0,-4,-1,-6,1060],
    sm952=[0,-4,0,-4,0,-4,-1,-6,1167],
    sm953=[0,-4,0,-4,0,-4,-1,-2,1168,-24,1169],
    sm954=[0,-4,0,-4,0,-4,-1,-3,1170,-22,1171],
    sm955=[0,-4,0,-4,0,-4,-1,-2,1172,1172,-2,1172,-19,1172,1172,1172],
    sm956=[0,-4,0,-4,0,-4,-1,-53,1173],
    sm957=[0,-1,1174,-2,0,-4,0,-4,-1,-11,1174,-4,1174,1174],
    sm958=[0,-4,0,-4,0,-4,-1,-8,1175,1175],
    sm959=[0,-4,0,-4,0,-4,-1,-53,1176],
    sm960=[0,-4,0,-4,0,-4,-1,-6,1177,-2,1177,-8,1177,1177],
    sm961=[0,-2,1178,-1,0,-4,0,-4,-1,-6,1178,-4,1178,-1,1178,-39,1178],
    sm962=[0,-2,1179,-1,1179,-4,0,-3,1179,-1,-5,1179,1179,-4,1179,-1,1179,-39,1179,-72,1179],
    sm963=[0,-2,1180,-1,0,-4,0,-4,-1,-2,1180,-3,1180,-1,1180,1180,-27,1180,1180,1180,-1,1180,1180,1180,1180,-1,1180,-9,1180],
    sm964=[0,-2,1181,-1,0,-4,0,-4,-1,1181,-4,1181,-3,1181,-3,1181,-6,1181,-2,1181,-17,1181,1181,1181,1181,-1,1181,-6,1181,-2,1181],
    sm965=[0,-1,1182,1182,-1,0,-4,0,-4,-1],
    sm966=[0,-1,1183,1183,-1,0,-4,0,-4,-1],
    sm967=[0,-2,736,-1,0,-4,0,-4,-1,-11,1184,-1,739,-39,1185],
    sm968=[0,-4,0,-4,0,-4,-1,-8,1186,1186],
    sm969=[0,-4,0,-4,0,-4,-1,-6,1187],
    sm970=[0,-4,0,-4,0,-4,-1,-11,1188],
    sm971=[0,-1,1189,-2,0,-4,0,-4,-1,-11,1189,-4,1189,1189],
    sm972=[0,-1,1190,-2,0,-4,0,-4,-1,-11,1190,-4,1190,1190],

        // Symbol Lookup map
        lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[201,14],["</",15],["import",16],[">",17],["<",18],["/",19],["(",20],[")",21],[null,14],[",",23],["{",24],[";",68],["}",26],["supports",27],["@",28],["keyframes",29],["id",30],["from",31],["to",32],["and",33],["or",34],["not",35],["media",37],["only",38],[":",71],["<=",41],[">=",42],["=",43],["%",45],["px",46],["in",47],["rad",48],["url",49],["\"",148],["'",149],["+",52],["~",53],["||",54],["*",56],["|",57],["#",58],[".",59],["[",61],["]",62],["^=",63],["$=",64],["*=",65],["i",66],["s",67],["!",141],["important",70],["-",136],["_",74],["as",76],["export",77],["default",78],["if",80],["else",81],["var",82],["do",83],["while",84],["for",85],["await",86],["of",87],["continue",88],["break",89],["return",90],["throw",91],["with",92],["switch",93],["case",94],["try",95],["catch",96],["finally",97],["debugger",98],["let",99],["const",100],["function",101],["=>",102],["async",103],["class",104],["extends",105],["static",106],["get",107],["set",108],["new",109],["super",110],["target",111],["...",112],["this",113],["/=",114],["%=",115],["+=",116],["-=",117],["<<=",118],[">>=",119],[">>>=",120],["&=",121],["|=",122],["**=",123],["?",124],["&&",125],["^",126],["&",127],["==",128],["!=",129],["===",130],["!==",131],["instanceof",132],["<<",133],[">>",134],[">>>",135],["**",137],["delete",138],["void",139],["typeof",140],["++",142],["--",143],["null",150],["true",151],["false",152],["$",153],["f",155],["filter",156],["input",157],["area",158],["base",159],["br",160],["col",161],["command",162],["embed",163],["hr",164],["img",165],["keygen",166],["link",167],["meta",168],["param",169],["source",170],["track",171],["wbr",172],["style",173],["script",174],["js",175]]),

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
    sm16,
    sm17,
    sm18,
    sm19,
    sm20,
    sm20,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm21,
    sm22,
    sm23,
    sm24,
    sm25,
    sm26,
    sm27,
    sm28,
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
    sm41,
    sm42,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm44,
    sm43,
    sm43,
    sm45,
    sm46,
    sm47,
    sm48,
    sm49,
    sm49,
    sm49,
    sm50,
    sm51,
    sm51,
    sm51,
    sm52,
    sm53,
    sm54,
    sm55,
    sm56,
    sm57,
    sm57,
    sm57,
    sm58,
    sm58,
    sm58,
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
    sm68,
    sm68,
    sm43,
    sm69,
    sm70,
    sm71,
    sm72,
    sm73,
    sm74,
    sm75,
    sm75,
    sm76,
    sm77,
    sm78,
    sm79,
    sm80,
    sm81,
    sm82,
    sm83,
    sm43,
    sm84,
    sm85,
    sm86,
    sm86,
    sm86,
    sm87,
    sm88,
    sm89,
    sm72,
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
    sm101,
    sm101,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm102,
    sm103,
    sm104,
    sm105,
    sm106,
    sm107,
    sm108,
    sm109,
    sm109,
    sm110,
    sm111,
    sm112,
    sm113,
    sm114,
    sm106,
    sm115,
    sm116,
    sm116,
    sm117,
    sm118,
    sm119,
    sm120,
    sm121,
    sm122,
    sm123,
    sm43,
    sm43,
    sm43,
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
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm43,
    sm127,
    sm44,
    sm128,
    sm51,
    sm51,
    sm51,
    sm51,
    sm129,
    sm130,
    sm131,
    sm87,
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
    sm43,
    sm142,
    sm43,
    sm140,
    sm143,
    sm144,
    sm47,
    sm145,
    sm146,
    sm147,
    sm148,
    sm149,
    sm150,
    sm150,
    sm150,
    sm150,
    sm150,
    sm150,
    sm151,
    sm151,
    sm152,
    sm153,
    sm154,
    sm155,
    sm155,
    sm155,
    sm155,
    sm155,
    sm155,
    sm155,
    sm156,
    sm153,
    sm157,
    sm158,
    sm159,
    sm160,
    sm160,
    sm161,
    sm43,
    sm162,
    sm163,
    sm164,
    sm72,
    sm140,
    sm43,
    sm165,
    sm166,
    sm167,
    sm168,
    sm169,
    sm170,
    sm171,
    sm172,
    sm173,
    sm174,
    sm175,
    sm175,
    sm176,
    sm177,
    sm43,
    sm178,
    sm43,
    sm179,
    sm180,
    sm43,
    sm181,
    sm182,
    sm183,
    sm184,
    sm185,
    sm186,
    sm187,
    sm43,
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
    sm173,
    sm173,
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
    sm218,
    sm219,
    sm220,
    sm221,
    sm222,
    sm140,
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
    sm233,
    sm233,
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
    sm243,
    sm244,
    sm245,
    sm246,
    sm247,
    sm248,
    sm249,
    sm250,
    sm250,
    sm250,
    sm250,
    sm251,
    sm251,
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
    sm267,
    sm43,
    sm269,
    sm270,
    sm271,
    sm271,
    sm272,
    sm272,
    sm273,
    sm273,
    sm43,
    sm274,
    sm275,
    sm191,
    sm276,
    sm277,
    sm278,
    sm279,
    sm280,
    sm281,
    sm282,
    sm283,
    sm284,
    sm43,
    sm285,
    sm286,
    sm287,
    sm288,
    sm289,
    sm290,
    sm291,
    sm292,
    sm291,
    sm293,
    sm294,
    sm295,
    sm296,
    sm297,
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
    sm23,
    sm308,
    sm309,
    sm309,
    sm310,
    sm72,
    sm311,
    sm43,
    sm311,
    sm312,
    sm313,
    sm314,
    sm140,
    sm315,
    sm316,
    sm317,
    sm318,
    sm319,
    sm320,
    sm321,
    sm322,
    sm72,
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
    sm72,
    sm335,
    sm72,
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
    sm346,
    sm84,
    sm347,
    sm348,
    sm349,
    sm350,
    sm351,
    sm352,
    sm353,
    sm354,
    sm353,
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
    sm72,
    sm367,
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
    sm376,
    sm378,
    sm379,
    sm380,
    sm381,
    sm382,
    sm383,
    sm384,
    sm385,
    sm385,
    sm386,
    sm387,
    sm388,
    sm388,
    sm389,
    sm390,
    sm391,
    sm391,
    sm391,
    sm391,
    sm391,
    sm391,
    sm391,
    sm392,
    sm393,
    sm394,
    sm395,
    sm392,
    sm396,
    sm397,
    sm398,
    sm399,
    sm400,
    sm400,
    sm401,
    sm402,
    sm403,
    sm404,
    sm140,
    sm405,
    sm406,
    sm407,
    sm408,
    sm409,
    sm140,
    sm43,
    sm410,
    sm411,
    sm412,
    sm413,
    sm414,
    sm43,
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
    sm425,
    sm426,
    sm427,
    sm428,
    sm429,
    sm430,
    sm431,
    sm431,
    sm432,
    sm433,
    sm72,
    sm434,
    sm434,
    sm435,
    sm436,
    sm437,
    sm438,
    sm439,
    sm440,
    sm440,
    sm441,
    sm442,
    sm72,
    sm443,
    sm444,
    sm445,
    sm446,
    sm445,
    sm445,
    sm447,
    sm448,
    sm448,
    sm449,
    sm76,
    sm43,
    sm76,
    sm450,
    sm451,
    sm452,
    sm43,
    sm43,
    sm453,
    sm454,
    sm455,
    sm456,
    sm457,
    sm458,
    sm459,
    sm458,
    sm458,
    sm460,
    sm461,
    sm72,
    sm72,
    sm462,
    sm76,
    sm463,
    sm72,
    sm464,
    sm465,
    sm466,
    sm467,
    sm468,
    sm469,
    sm470,
    sm471,
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
    sm482,
    sm483,
    sm483,
    sm484,
    sm485,
    sm485,
    sm486,
    sm381,
    sm487,
    sm381,
    sm488,
    sm489,
    sm490,
    sm491,
    sm492,
    sm493,
    sm494,
    sm395,
    sm487,
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
    sm506,
    sm507,
    sm508,
    sm72,
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
    sm520,
    sm521,
    sm522,
    sm523,
    sm524,
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
    sm76,
    sm535,
    sm536,
    sm537,
    sm538,
    sm76,
    sm43,
    sm539,
    sm539,
    sm540,
    sm541,
    sm542,
    sm543,
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
    sm554,
    sm555,
    sm556,
    sm557,
    sm558,
    sm559,
    sm560,
    sm561,
    sm561,
    sm561,
    sm561,
    sm561,
    sm561,
    sm561,
    sm562,
    sm381,
    sm563,
    sm564,
    sm565,
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
    sm576,
    sm577,
    sm578,
    sm579,
    sm580,
    sm581,
    sm582,
    sm583,
    sm584,
    sm585,
    sm585,
    sm586,
    sm587,
    sm588,
    sm587,
    sm76,
    sm589,
    sm590,
    sm591,
    sm76,
    sm592,
    sm76,
    sm76,
    sm593,
    sm76,
    sm76,
    sm594,
    sm76,
    sm76,
    sm595,
    sm596,
    sm597,
    sm598,
    sm599,
    sm600,
    sm43,
    sm601,
    sm84,
    sm602,
    sm603,
    sm604,
    sm605,
    sm606,
    sm607,
    sm608,
    sm609,
    sm610,
    sm609,
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
    sm624,
    sm625,
    sm626,
    sm627,
    sm628,
    sm629,
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
    sm640,
    sm640,
    sm640,
    sm641,
    sm641,
    sm642,
    sm643,
    sm644,
    sm645,
    sm646,
    sm647,
    sm648,
    sm649,
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
    sm23,
    sm23,
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
    sm76,
    sm76,
    sm672,
    sm76,
    sm673,
    sm674,
    sm675,
    sm676,
    sm76,
    sm677,
    sm678,
    sm76,
    sm679,
    sm680,
    sm681,
    sm682,
    sm680,
    sm683,
    sm684,
    sm685,
    sm686,
    sm687,
    sm688,
    sm689,
    sm690,
    sm691,
    sm692,
    sm693,
    sm694,
    sm695,
    sm696,
    sm697,
    sm698,
    sm699,
    sm700,
    sm701,
    sm702,
    sm703,
    sm626,
    sm704,
    sm705,
    sm706,
    sm707,
    sm708,
    sm709,
    sm710,
    sm711,
    sm712,
    sm704,
    sm713,
    sm714,
    sm714,
    sm714,
    sm714,
    sm715,
    sm716,
    sm716,
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
    sm726,
    sm726,
    sm727,
    sm727,
    sm728,
    sm729,
    sm730,
    sm641,
    sm731,
    sm732,
    sm733,
    sm641,
    sm734,
    sm735,
    sm699,
    sm699,
    sm699,
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
    sm23,
    sm750,
    sm751,
    sm752,
    sm753,
    sm76,
    sm754,
    sm755,
    sm756,
    sm757,
    sm758,
    sm759,
    sm760,
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
    sm771,
    sm772,
    sm772,
    sm773,
    sm774,
    sm775,
    sm776,
    sm641,
    sm777,
    sm778,
    sm778,
    sm779,
    sm779,
    sm780,
    sm781,
    sm782,
    sm783,
    sm783,
    sm784,
    sm785,
    sm786,
    sm787,
    sm787,
    sm788,
    sm789,
    sm790,
    sm703,
    sm791,
    sm791,
    sm792,
    sm792,
    sm793,
    sm794,
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
    sm805,
    sm806,
    sm807,
    sm808,
    sm809,
    sm810,
    sm811,
    sm811,
    sm811,
    sm811,
    sm812,
    sm704,
    sm813,
    sm814,
    sm815,
    sm816,
    sm767,
    sm817,
    sm818,
    sm819,
    sm767,
    sm820,
    sm821,
    sm822,
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
    sm836,
    sm837,
    sm838,
    sm839,
    sm840,
    sm841,
    sm842,
    sm701,
    sm843,
    sm844,
    sm845,
    sm846,
    sm847,
    sm848,
    sm849,
    sm781,
    sm850,
    sm781,
    sm851,
    sm852,
    sm853,
    sm854,
    sm781,
    sm855,
    sm855,
    sm855,
    sm856,
    sm857,
    sm858,
    sm859,
    sm859,
    sm860,
    sm861,
    sm842,
    sm862,
    sm863,
    sm864,
    sm789,
    sm865,
    sm865,
    sm866,
    sm867,
    sm868,
    sm704,
    sm869,
    sm870,
    sm871,
    sm872,
    sm873,
    sm874,
    sm875,
    sm802,
    sm876,
    sm877,
    sm877,
    sm877,
    sm878,
    sm879,
    sm879,
    sm880,
    sm881,
    sm882,
    sm832,
    sm833,
    sm883,
    sm832,
    sm833,
    sm884,
    sm885,
    sm886,
    sm887,
    sm888,
    sm889,
    sm890,
    sm890,
    sm703,
    sm891,
    sm891,
    sm892,
    sm893,
    sm894,
    sm895,
    sm896,
    sm897,
    sm898,
    sm899,
    sm900,
    sm901,
    sm902,
    sm903,
    sm904,
    sm905,
    sm906,
    sm907,
    sm908,
    sm909,
    sm909,
    sm910,
    sm910,
    sm911,
    sm911,
    sm911,
    sm911,
    sm911,
    sm641,
    sm641,
    sm641,
    sm912,
    sm912,
    sm912,
    sm912,
    sm913,
    sm914,
    sm915,
    sm915,
    sm915,
    sm916,
    sm907,
    sm917,
    sm918,
    sm919,
    sm920,
    sm921,
    sm921,
    sm921,
    sm922,
    sm923,
    sm924,
    sm925,
    sm926,
    sm927,
    sm928,
    sm929,
    sm930,
    sm931,
    sm932,
    sm933,
    sm934,
    sm935,
    sm936,
    sm937,
    sm937,
    sm938,
    sm888,
    sm888,
    sm939,
    sm940,
    sm941,
    sm942,
    sm942,
    sm943,
    sm944,
    sm945,
    sm946,
    sm947,
    sm948,
    sm949,
    sm950,
    sm951,
    sm952,
    sm952,
    sm953,
    sm954,
    sm955,
    sm947,
    sm956,
    sm957,
    sm626,
    sm861,
    sm958,
    sm959,
    sm960,
    sm961,
    sm962,
    sm963,
    sm964,
    sm910,
    sm965,
    sm965,
    sm910,
    sm966,
    sm966,
    sm967,
    sm968,
    sm969,
    sm969,
    sm970,
    sm971,
    sm972],

    /************ Functions *************/

        max = Math.max, //Error Functions
        e$1 = (...d)=>fn.defaultError(...d), 
        eh = [e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1],

        //Empty Function
        nf = ()=>-1, 

        //Environment Functions
        
    redv = (ret, fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        const slice = o.slice(-plen);        o.length = ln + 1;        o[ln] = fn(slice, e, l, s, o, plen);        return ret;    },
    rednv = (ret, Fn, plen, ln, t, e, o, l, s) => {        ln = max(o.length - plen, 0);        const slice = o.slice(-plen);        o.length = ln + 1;        o[ln] = new Fn(slice, e, l, s, o, plen);        return ret;    },
    redn = (ret, plen, t, e, o) => {        if (plen > 0) {            let ln = max(o.length - plen, 0);            o[ln] = o[o.length - 1];            o.length = ln + 1;        }        return ret;    },
    shftf = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret),
    R00_S=sym=>sym[0],
    R30_undefined501_group_list=sym=>(((sym[1] !== null) ? sym[0].push(sym[1]) : null,sym[0])),
    R31_undefined501_group_list=sym=>(sym[0] !== null) ? [sym[0]] : [],
    R50_IMPORT_TAG=(sym,env,lex)=>fn.element_selector(sym[1],sym[2],null,env,lex),
    R51_IMPORT_TAG=(sym,env,lex)=>fn.element_selector(sym[1],null,null,env,lex),
    R70_BASIC_BINDING=(sym,env,lex)=>new fn.wick_binding(sym[2],null,env,lex),
    I71_BASIC_BINDING=function (sym,env,lex){env.start = lex.off + 2;},
    R72_BASIC_BINDING=(sym,env,lex)=>new fn.wick_binding(null,null,env,lex),
    R80_CALL_BINDING=(sym,env,lex)=>new fn.wick_binding(sym[2],sym[5],env,lex),
    R81_CALL_BINDING=(sym,env,lex)=>new fn.wick_binding(null,sym[4],env,lex),
    R140_css_STYLE_SHEET=sym=>new fn.ruleset(sym[0],sym[1]),
    R141_css_STYLE_SHEET=sym=>new fn.ruleset(null,sym[0]),
    R142_css_STYLE_SHEET=sym=>new fn.ruleset(sym[0],null),
    R150_css_COMPLEX_SELECTOR_list=sym=>(((sym[1] !== null) ? sym[0].push(sym[2]) : null,sym[0])),
    R160_css_STYLE_RULE=sym=>new fn.stylerule(sym[0],sym[2]),
    R161_css_STYLE_RULE=sym=>new fn.stylerule(null,sym[1]),
    C270_css_keyframes=function (sym){this.keyframes = sym[4];},
    C300_css_keyframes_blocks=function (sym){this.selectors = sym[0];this.props = sym[2].props;},
    R590_css_undefined6202_group_list=sym=>sym[0] + sym[1],
    R591_css_undefined6202_group_list=sym=>sym[0] + "",
    R880_css_TYPE_SELECTOR=sym=>new fn.type_selector([sym[0],sym[1]]),
    R881_css_TYPE_SELECTOR=sym=>new fn.type_selector([sym[0]]),
    R910_css_WQ_NAME=sym=>[sym[0],sym[1]],
    R911_css_WQ_NAME=sym=>[sym[0]],
    R1050_css_declaration_list=sym=>((sym[0].push(sym[1]),sym[0])),
    R1051_css_declaration_list=sym=>((sym[0].push(...sym[1]),sym[0])),
    R1100_css_declaration_values=sym=>sym.join(""),
    I1160_js_javascript=function (sym,env){env.IS_MODULE = false;},
    R1170_js_start=(sym,env)=>(env.IS_MODULE) ? new fn.module(sym[0]) : new fn.script(sym[0]),
    I1220_js_module_item=function (sym,env){env.IS_MODULE = true;},
    R1230_js_import_declaration=sym=>new fn.import_declaration(sym[2],sym[1]),
    R1231_js_import_declaration=sym=>new fn.import_declaration(sym[1]),
    R1240_js_import_clause=sym=>[sym[0],sym[2]],
    R1290_js_named_imports=sym=>new fn.named_imports(sym[1]),
    R1291_js_named_imports=()=>new fn.named_imports(null),
    R1300_js_from_clause=sym=>sym[1],
    R1310_js_import_specifier=sym=>new fn.import_specifier(sym[0]),
    R1311_js_import_specifier=sym=>new fn.import_specifier(sym[0],sym[1]),
    R1340_js_export_declaration=sym=>new fn.export_declaration(null,sym[2],false),
    R1341_js_export_declaration=sym=>new fn.export_declaration(sym[1],sym[2],false),
    R1342_js_export_declaration=sym=>new fn.export_declaration(sym[1],null,false),
    R1343_js_export_declaration=sym=>new fn.export_declaration(sym[1],null,true),
    R1370_js_export_clause=sym=>new fn.export_clause(sym[1]),
    R1371_js_export_clause=()=>new fn.export_clause(null),
    R1380_js_export_specifier=sym=>new fn.export_specifier(sym[0]),
    R1381_js_export_specifier=sym=>new fn.export_specifier(sym[0],sym[1]),
    R1560_js_iteration_statement=sym=>(new fn.for_statement(sym[2],sym[4],sym[6],sym[8])),
    I1561_js_iteration_statement=function (sym,env){env.ASI = false;},
    I1562_js_iteration_statement=function (sym,env){env.ASI = true;},
    R1563_js_iteration_statement=sym=>(new fn.for_statement(sym[2],sym[3],sym[5],sym[7])),
    R1564_js_iteration_statement=sym=>(new fn.for_in_statement(sym[2],sym[4],sym[6])),
    R1565_js_iteration_statement=sym=>(new fn.for_of_statement(sym[1],sym[3],sym[5],sym[7])),
    R1566_js_iteration_statement=sym=>(new fn.for_statement(null,sym[3],sym[5],sym[7])),
    R1567_js_iteration_statement=sym=>(new fn.for_statement(sym[2],null,sym[5],sym[7])),
    R1568_js_iteration_statement=sym=>(new fn.for_statement(sym[2],sym[4],null,sym[7])),
    R1569_js_iteration_statement=sym=>(new fn.for_statement(sym[2],null,sym[4],sym[6])),
    R15610_js_iteration_statement=sym=>(new fn.for_statement(sym[2],sym[3],null,sym[6])),
    R15611_js_iteration_statement=sym=>(new fn.for_of_statement(null,sym[2],sym[4],sym[6])),
    R15612_js_iteration_statement=sym=>(new fn.for_statement(null,null,sym[4],sym[6])),
    R15613_js_iteration_statement=sym=>(new fn.for_statement(null,sym[3],null,sym[6])),
    R15614_js_iteration_statement=sym=>(new fn.for_statement(sym[2],null,null,sym[6])),
    R15615_js_iteration_statement=sym=>(new fn.for_statement(sym[2],null,null,sym[5])),
    R15616_js_iteration_statement=sym=>(new fn.for_statement(null,null,null,sym[5])),
    R1590_js_continue_statement=sym=>(new fn.continue_statement(sym[1])),
    R1591_js_continue_statement=()=>(new fn.continue_statement(null)),
    R1600_js_break_statement=sym=>(new fn.break_statement(sym[1])),
    R1601_js_break_statement=()=>(new fn.break_statement(null)),
    R1610_js_return_statement=sym=>new fn.return_statement(sym[1]),
    R1611_js_return_statement=()=>new fn.return_statement(null),
    R1620_js_throw_statement=sym=>new fn.throw_statement(sym[1]),
    R1630_js_with_statement=sym=>new fn.with_statement(sym[2],sym[4]),
    R1640_js_switch_statement=sym=>new fn.switch_statement(sym[2],sym[4]),
    R1650_js_case_block=()=>[],
    R1651_js_case_block=sym=>sym[1].concat(sym[2].concat(sym[3])),
    R1652_js_case_block=sym=>sym[1].concat(sym[2]),
    R1660_js_case_clauses=sym=>sym[0].concat(sym[1]),
    R1670_js_case_clause=sym=>(new fn.case_statement(sym[1],sym[3])),
    R1671_js_case_clause=sym=>(new fn.case_statement(sym[1],null)),
    R1680_js_default_clause=sym=>(new fn.default_case_statement(sym[2])),
    R1681_js_default_clause=()=>(new fn.default_case_statement(null)),
    R1720_js_try_statement=sym=>(new fn.try_statement(sym[1],sym[2])),
    R1721_js_try_statement=sym=>(new fn.try_statement(sym[1],null,sym[2])),
    R1722_js_try_statement=sym=>(new fn.try_statement(sym[1],sym[2],sym[3])),
    R1780_js_variable_declaration_list=sym=>((sym[0].push(sym[2]),sym[0])),
    R1810_js_let_or_const=()=>"let",
    R1811_js_let_or_const=()=>"const",
    R1840_js_function_expression=sym=>new fn.function_declaration(sym[1],sym[3],sym[6]),
    R1841_js_function_expression=sym=>new fn.function_declaration(null,sym[2],sym[5]),
    R1842_js_function_expression=sym=>new fn.function_declaration(sym[1],null,sym[5]),
    R1843_js_function_expression=sym=>new fn.function_declaration(sym[1],sym[3],null),
    R1844_js_function_expression=sym=>new fn.function_declaration(null,null,sym[4]),
    R1845_js_function_expression=sym=>new fn.function_declaration(null,sym[2],null),
    R1846_js_function_expression=sym=>new fn.function_declaration(sym[1],null,null),
    R1847_js_function_expression=()=>new fn.function_declaration(null,null,null),
    R1870_js_formal_parameters=sym=>new fn.parenthasized(sym[0]),
    R1871_js_formal_parameters=sym=>new fn.parenthasized(...sym[0]),
    R1872_js_formal_parameters=sym=>new fn.parenthasized(...sym[0],sym[2]),
    R1930_js_arrow_function=sym=>new fn.arrow_function_declaration(null,sym[0],sym[2]),
    R2000_js_class_declaration=sym=>new fn.class_declaration([sym[1],sym[2]]),
    R2001_js_class_declaration=()=>new fn.class_declaration([null,null]),
    R2010_js_class_expression=sym=>new fn.class_expression([sym[1],sym[2]]),
    R2011_js_class_expression=sym=>new fn.class_expression([null,sym[1]]),
    R2020_js_class_tail=sym=>({h : sym[0],t : sym[2]}),
    R2021_js_class_tail=sym=>({h : null,t : sym[1]}),
    R2022_js_class_tail=sym=>({h : sym[0],t : null}),
    R2023_js_class_tail=()=>({h : null,t : null}),
    R2050_js_class_element_list=sym=>(sym[0].push(sym[1])),
    R2060_js_class_element=sym=>(((sym[1].static = true,sym[1]))),
    R2130_js_new_expression=sym=>new fn.new_expression(sym[1],null),
    R2140_js_member_expression=sym=>new fn.member_expression(sym[0],sym[2],true),
    R2141_js_member_expression=sym=>new fn.member_expression(sym[0],sym[2],false),
    R2142_js_member_expression=sym=>new fn.new_expression(sym[1],sym[2]),
    R2200_js_arguments=sym=>new fn.parenthasized(...sym[1]),
    R2201_js_arguments=()=>new fn.parenthasized(),
    R2240_js_primary_expression=sym=>new fn.js_wick_node(sym[0]),
    R2260_js_object_literal=sym=>new fn.object_literal(sym[1]),
    R2261_js_object_literal=()=>new fn.object_literal(null),
    R2330_js_array_literal=sym=>new fn.array_literal(sym[1]),
    R2331_js_array_literal=()=>new fn.array_literal(null),
    R2340_js_element_list=sym=>[sym[1]],
    R2341_js_element_list=sym=>(((sym[0].push(sym[2]),sym[0]))),
    R2540_js_cover_parenthesized_expression_and_arrow_parameter_list=()=>null,
    R2541_js_cover_parenthesized_expression_and_arrow_parameter_list=sym=>new fn.parenthasized(sym[1]),
    R2542_js_cover_parenthesized_expression_and_arrow_parameter_list=sym=>new fn.parenthasized(new fn.spread_element(sym.slice(1,3))),
    R2543_js_cover_parenthesized_expression_and_arrow_parameter_list=sym=>new fn.parenthasized(sym$2,new fn.spread_element(sym.slice(3,5))),
    R2850_html_BODY=sym=>((sym[1].import_list = sym[0],sym[1])),
    R2870_html_TAG=(sym,env,lex)=>fn.element_selector(sym[1],sym[2],sym[4],env,lex),
    R2871_html_TAG=(sym,env,lex)=>fn.element_selector(sym[1],sym[2],sym[3],env,lex),
    R2872_html_TAG=(sym,env,lex)=>fn.element_selector(sym[1],null,sym[3],env,lex),
    R2873_html_TAG=(sym,env,lex)=>fn.element_selector(sym[1],null,sym[2],env,lex),

        //Sparse Map Lookup
        lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index + 1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

        //State Action Functions
        state_funct = [e=>394,
    e=>350,
    e=>82,
    e=>38,
    e=>402,
    e=>158,
    e=>254,
    e=>262,
    e=>398,
    e=>442,
    e=>354,
    e=>86,
    e=>446,
    e=>438,
    e=>458,
    e=>462,
    e=>466,
    e=>422,
    e=>474,
    e=>478,
    e=>482,
    e=>490,
    e=>486,
    e=>470,
    e=>494,
    e=>498,
    e=>530,
    e=>534,
    e=>522,
    e=>514,
    e=>294,
    e=>406,
    e=>310,
    e=>258,
    e=>242,
    e=>246,
    e=>250,
    e=>266,
    e=>274,
    e=>278,
    e=>386,
    e=>390,
    e=>382,
    e=>374,
    e=>378,
    e=>346,
    (...v)=>redv(5,R00_S,1,0),
    (...v)=>redn(1031,1),
    (...v)=>redn(290823,1),
    (...v)=>redn(291847,1),
    (...v)=>redv(3079,R31_undefined501_group_list,1,0),
    (...v)=>redn(2055,1),
    e=>570,
    e=>550,
    e=>574,
    e=>578,
    e=>582,
    e=>586,
    e=>590,
    e=>594,
    e=>598,
    e=>602,
    e=>606,
    e=>610,
    e=>614,
    e=>618,
    e=>622,
    e=>626,
    e=>630,
    e=>634,
    e=>638,
    e=>642,
    (...v)=>redn(292871,1),
    (...v)=>redv(229383,R2240_js_primary_expression,1,0),
    (...v)=>(redv(118791,R00_S,1,0),shftf(118791,I1160_js_javascript)),
    (...v)=>redv(119815,R1170_js_start,1,0),
    (...v)=>redn(120839,1),
    (...v)=>rednv(123911,fn.statements,1,0),
    e=>654,
    (...v)=>redv(122887,R31_undefined501_group_list,1,0),
    (...v)=>redn(121863,1),
    (...v)=>(redn(124935,1),shftf(124935,I1220_js_module_item)),
    (...v)=>redn(124935,1),
    e=>690,
    e=>686,
    e=>718,
    e=>698,
    e=>714,
    (...v)=>redn(147463,1),
    (...v)=>redn(148487,1),
    (...v)=>redn(152583,1),
    e=>738,
    (...v)=>rednv(216071,fn.expression_list,1,0),
    e=>742,
    (...v)=>redv(215047,R31_undefined501_group_list,1,0),
    (...v)=>redn(214023,1),
    (...v)=>redn(242695,1),
    (...v)=>redn(258055,1),
    e=>746,
    e=>798,
    e=>762,
    e=>766,
    e=>770,
    e=>774,
    e=>778,
    e=>782,
    e=>786,
    e=>790,
    e=>794,
    e=>802,
    e=>806,
    e=>754,
    e=>758,
    (...v)=>redn(244743,1),
    e=>814,
    e=>810,
    (...v)=>redn(245767,1),
    e=>818,
    (...v)=>redn(246791,1),
    e=>822,
    (...v)=>redn(247815,1),
    e=>826,
    (...v)=>redn(248839,1),
    e=>830,
    (...v)=>redn(249863,1),
    e=>834,
    e=>838,
    e=>842,
    e=>846,
    (...v)=>redn(250887,1),
    e=>854,
    e=>850,
    e=>858,
    e=>862,
    e=>870,
    e=>866,
    (...v)=>redn(251911,1),
    e=>874,
    e=>878,
    e=>882,
    (...v)=>redn(252935,1),
    e=>886,
    e=>890,
    (...v)=>redn(253959,1),
    e=>898,
    e=>902,
    e=>894,
    (...v)=>redn(254983,1),
    (...v)=>redn(256007,1),
    (...v)=>redn(257031,1),
    e=>906,
    e=>942,
    e=>946,
    e=>950,
    (...v)=>redn(217095,1),
    e=>998,
    e=>986,
    e=>994,
    (...v)=>redn(218119,1),
    e=>1006,
    e=>1002,
    e=>1022,
    e=>1026,
    (...v)=>redn(219143,1),
    (...v)=>rednv(229383,fn.this_literal,1,0),
    (...v)=>redn(229383,1),
    (...v)=>redn(198663,1),
    (...v)=>redn(281607,1),
    (...v)=>redn(280583,1),
    (...v)=>redn(282631,1),
    (...v)=>redn(283655,1),
    (...v)=>rednv(284679,fn.identifier,1,0),
    (...v)=>redv(289799,R00_S,1,0),
    e=>1058,
    e=>1054,
    e=>1066,
    e=>1070,
    e=>1050,
    e=>1042,
    e=>1062,
    e=>1046,
    (...v)=>redn(285703,1),
    (...v)=>redn(272391,1),
    (...v)=>rednv(279559,fn.bool_literal,1,0),
    (...v)=>rednv(278535,fn.null_literal,1,0),
    e=>1098,
    e=>1090,
    e=>1086,
    e=>1106,
    e=>1110,
    e=>1102,
    e=>1094,
    e=>1078,
    e=>1118,
    (...v)=>rednv(277511,fn.numeric_literal,1,0),
    e=>1150,
    e=>1130,
    e=>1146,
    e=>1154,
    e=>1162,
    e=>1166,
    e=>1170,
    (...v)=>redn(221191,1),
    (...v)=>redn(223239,1),
    e=>1182,
    (...v)=>redv(198663,R1870_js_formal_parameters,1,0),
    e=>1190,
    e=>1222,
    e=>1226,
    (...v)=>rednv(154631,fn.empty_statement,1,0),
    e=>1230,
    (...v)=>redn(151559,1),
    e=>1238,
    (...v)=>shftf(1242,I1561_js_iteration_statement),
    e=>1246,
    e=>1250,
    e=>1258,
    e=>1270,
    e=>1278,
    e=>1282,
    e=>1294,
    (...v)=>redn(149511,1),
    e=>1310,
    e=>1314,
    (...v)=>redn(150535,1),
    e=>1322,
    (...v)=>redv(185351,R1810_js_let_or_const,1,0),
    (...v)=>redv(185351,R1811_js_let_or_const,1,0),
    (...v)=>redv(291851,R2850_html_BODY,2,0),
    (...v)=>redv(3083,R30_undefined501_group_list,2,0),
    e=>1350,
    e=>1346,
    e=>1366,
    e=>1362,
    e=>1378,
    e=>1382,
    e=>1390,
    e=>1394,
    (...v)=>redn(303111,1),
    e=>1410,
    e=>1426,
    e=>1430,
    (...v)=>redv(308231,R00_S,1,0),
    e=>1422,
    e=>1418,
    e=>1414,
    (...v)=>redn(304135,1),
    (...v)=>redn(294919,1),
    (...v)=>redv(122891,R30_undefined501_group_list,2,0),
    e=>1438,
    e=>1442,
    e=>1446,
    (...v)=>redn(126983,1),
    (...v)=>rednv(128007,fn.default_import,1,0),
    (...v)=>redn(136199,1),
    e=>1450,
    e=>1458,
    e=>1462,
    (...v)=>redn(135175,1),
    e=>1490,
    (...v)=>redv(137227,R1342_js_export_declaration,2,0),
    e=>1510,
    e=>1514,
    e=>1530,
    (...v)=>rednv(146439,fn.statements,1,0),
    (...v)=>redv(145415,R31_undefined501_group_list,1,0),
    (...v)=>redn(144391,1),
    (...v)=>rednv(155659,fn.expression_statement,2,0),
    (...v)=>rednv(258059,fn.post_increment_expression,2,0),
    (...v)=>rednv(258059,fn.post_decrement_expression,2,0),
    (...v)=>redn(243719,1),
    (...v)=>rednv(257035,fn.delete_expression,2,0),
    e=>1654,
    e=>1658,
    e=>1714,
    e=>1690,
    e=>1694,
    e=>1678,
    e=>1722,
    (...v)=>rednv(257035,fn.void_expression,2,0),
    (...v)=>rednv(257035,fn.typeof_expression,2,0),
    (...v)=>rednv(257035,fn.plus_expression,2,0),
    (...v)=>rednv(257035,fn.negate_expression,2,0),
    (...v)=>rednv(257035,fn.unary_or_expression,2,0),
    (...v)=>rednv(257035,fn.unary_not_expression,2,0),
    (...v)=>rednv(258059,fn.pre_increment_expression,2,0),
    (...v)=>rednv(258059,fn.pre_decrement_expression,2,0),
    (...v)=>rednv(223243,fn.call_expression,2,0),
    e=>1750,
    e=>1746,
    e=>1766,
    (...v)=>rednv(203787,fn.call_expression,2,0),
    (...v)=>redv(218123,R2130_js_new_expression,2,0),
    e=>1782,
    (...v)=>redv(289803,R590_css_undefined6202_group_list,2,0),
    (...v)=>redv(289803,R00_S,2,0),
    (...v)=>redv(287751,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(286727,1),
    (...v)=>redn(288775,1),
    e=>1794,
    (...v)=>rednv(276491,fn.string_literal,2,0),
    (...v)=>redv(275463,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(273415,1),
    e=>1802,
    e=>1814,
    e=>1810,
    e=>1830,
    e=>1818,
    (...v)=>redv(238603,R2331_js_array_literal,2,0),
    (...v)=>redv(239623,R911_css_WQ_NAME,1,0),
    (...v)=>redn(240647,1),
    (...v)=>redv(260107,R2540_js_cover_parenthesized_expression_and_arrow_parameter_list,2,0),
    e=>1838,
    e=>1842,
    (...v)=>redn(224267,2),
    (...v)=>rednv(259083,fn.await_expression,2,0),
    e=>1870,
    (...v)=>rednv(173067,fn.label_statement,2,0),
    e=>1890,
    e=>1886,
    (...v)=>redv(182279,R911_css_WQ_NAME,1,0),
    (...v)=>rednv(183303,fn.binding,1,0),
    e=>1898,
    (...v)=>redn(261127,1),
    e=>1906,
    e=>1918,
    e=>1938,
    e=>1954,
    e=>1978,
    e=>1998,
    e=>2006,
    e=>2022,
    e=>2030,
    (...v)=>redv(162827,R1591_js_continue_statement,2,0),
    e=>2034,
    (...v)=>redv(163851,R1601_js_break_statement,2,0),
    e=>2038,
    (...v)=>redv(164875,R1611_js_return_statement,2,0),
    e=>2046,
    e=>2058,
    e=>2062,
    (...v)=>rednv(180235,fn.debugger_statement,2,0),
    (...v)=>redv(204811,R2001_js_class_declaration,2,0),
    e=>2070,
    e=>2078,
    e=>2098,
    e=>2094,
    e=>2114,
    e=>2122,
    e=>2150,
    e=>2146,
    (...v)=>redv(186375,R911_css_WQ_NAME,1,0),
    e=>2166,
    e=>2162,
    e=>2174,
    e=>2182,
    (...v)=>redv(5135,R51_IMPORT_TAG,3,0),
    (...v)=>redv(299015,R911_css_WQ_NAME,1,0),
    (...v)=>rednv(300039,fn.attribute,1,0),
    e=>2186,
    e=>2194,
    e=>2202,
    (...v)=>redn(301063,1),
    e=>2206,
    e=>2210,
    e=>2290,
    e=>2266,
    e=>2270,
    e=>2282,
    e=>2286,
    e=>2278,
    e=>2274,
    e=>2218,
    e=>2230,
    e=>2258,
    e=>2294,
    e=>2298,
    e=>2302,
    (...v)=>redv(293903,R51_IMPORT_TAG,3,0),
    e=>2306,
    e=>2310,
    (...v)=>redv(308235,R590_css_undefined6202_group_list,2,0),
    (...v)=>redv(308235,R00_S,2,0),
    (...v)=>redv(306183,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(305159,1),
    (...v)=>redn(307207,1),
    e=>2322,
    (...v)=>redv(125967,R1231_js_import_declaration,3,0),
    e=>2342,
    e=>2346,
    e=>2350,
    (...v)=>redv(132107,R1291_js_named_imports,2,0),
    (...v)=>redv(131079,R31_undefined501_group_list,1,0),
    (...v)=>redn(130055,1),
    (...v)=>redv(134151,R1310_js_import_specifier,1,0),
    e=>2354,
    e=>2358,
    e=>2362,
    (...v)=>redv(137231,R1342_js_export_declaration,3,0),
    (...v)=>redv(137231,R1343_js_export_declaration,3,0),
    e=>2366,
    e=>2370,
    e=>2374,
    (...v)=>redv(140299,R1371_js_export_clause,2,0),
    (...v)=>redv(139271,R31_undefined501_group_list,1,0),
    (...v)=>redn(138247,1),
    (...v)=>redv(141319,R1380_js_export_specifier,1,0),
    e=>2378,
    (...v)=>rednv(153615,fn.block_statement,3,0),
    (...v)=>redv(145419,R30_undefined501_group_list,2,0),
    (...v)=>redv(215055,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>rednv(242703,fn.assignment_expression,3,0),
    e=>2382,
    (...v)=>rednv(245775,fn.or_expression,3,0),
    (...v)=>rednv(246799,fn.and_expression,3,0),
    (...v)=>rednv(247823,fn.bit_or_expression,3,0),
    (...v)=>rednv(248847,fn.bit_xor_expression,3,0),
    (...v)=>rednv(249871,fn.bit_and_expression,3,0),
    (...v)=>rednv(250895,fn.equality_expression,3,0),
    (...v)=>rednv(251919,fn.equality_expression,3,0),
    (...v)=>rednv(251919,fn.instanceof_expression,3,0),
    (...v)=>rednv(251919,fn.in_expression,3,0),
    (...v)=>rednv(252943,fn.left_shift_expression,3,0),
    (...v)=>rednv(252943,fn.right_shift_expression,3,0),
    (...v)=>rednv(252943,fn.right_shift_fill_expression,3,0),
    (...v)=>rednv(253967,fn.add_expression,3,0),
    (...v)=>rednv(253967,fn.subtract_expression,3,0),
    (...v)=>rednv(254991,fn.multiply_expression,3,0),
    (...v)=>rednv(254991,fn.divide_expression,3,0),
    (...v)=>rednv(254991,fn.modulo_expression,3,0),
    (...v)=>rednv(256015,fn.exponent_expression,3,0),
    e=>2386,
    e=>2390,
    e=>2394,
    (...v)=>redv(231435,R2261_js_object_literal,2,0),
    (...v)=>redv(230407,R31_undefined501_group_list,1,0),
    (...v)=>redn(232455,1),
    e=>2410,
    e=>2406,
    (...v)=>redn(234503,1),
    (...v)=>redn(233479,1),
    e=>2426,
    e=>2434,
    (...v)=>redv(205835,R2011_js_class_expression,2,0),
    (...v)=>redv(223247,R2141_js_member_expression,3,0),
    e=>2442,
    e=>2450,
    e=>2446,
    e=>2454,
    (...v)=>redv(225291,R2201_js_arguments,2,0),
    (...v)=>redn(228359,1),
    e=>2458,
    (...v)=>redv(227335,R31_undefined501_group_list,1,0),
    (...v)=>redn(226311,1),
    e=>2466,
    (...v)=>redv(219151,R2141_js_member_expression,3,0),
    (...v)=>redv(219151,R2142_js_member_expression,3,0),
    (...v)=>rednv(222223,fn.new_target_expression,3,0),
    (...v)=>redv(289807,R590_css_undefined6202_group_list,3,0),
    (...v)=>redv(287755,R590_css_undefined6202_group_list,2,0),
    (...v)=>rednv(276495,fn.string_literal,3,0),
    (...v)=>redv(275467,R590_css_undefined6202_group_list,2,0),
    e=>2470,
    (...v)=>redv(238607,R2330_js_array_literal,3,0),
    (...v)=>redv(238607,R2331_js_array_literal,3,0),
    (...v)=>redv(239627,R2340_js_element_list,2,0),
    (...v)=>redn(240651,2),
    (...v)=>rednv(241675,fn.spread_element,2,0),
    (...v)=>redv(260111,R2541_js_cover_parenthesized_expression_and_arrow_parameter_list,3,0),
    e=>2486,
    e=>2490,
    e=>2494,
    e=>2498,
    (...v)=>rednv(220175,fn.super_expression,3,0),
    e=>2502,
    (...v)=>redv(197647,R1930_js_arrow_function,3,0),
    (...v)=>redn(199687,1),
    (...v)=>redv(174091,R1300_js_from_clause,2,0),
    (...v)=>redn(175111,1),
    (...v)=>rednv(181263,fn.variable_statement,3,0),
    (...v)=>rednv(183307,fn.binding,2,0),
    (...v)=>redn(262155,2),
    e=>2522,
    e=>2530,
    e=>2526,
    (...v)=>redn(265223,1),
    (...v)=>redn(268295,1),
    e=>2538,
    (...v)=>redn(270343,1),
    (...v)=>redn(263179,2),
    e=>2550,
    e=>2558,
    e=>2566,
    e=>2562,
    (...v)=>redn(266247,1),
    (...v)=>redn(267271,1),
    (...v)=>redn(269319,1),
    e=>2582,
    e=>2586,
    e=>2590,
    e=>2594,
    e=>2602,
    e=>2606,
    e=>2610,
    e=>2618,
    (...v)=>redn(157703,1),
    (...v)=>redn(158727,1),
    e=>2658,
    e=>2666,
    (...v)=>redv(162831,R1590_js_continue_statement,3,0),
    (...v)=>redv(163855,R1600_js_break_statement,3,0),
    (...v)=>redv(164879,R1610_js_return_statement,3,0),
    e=>2670,
    (...v)=>redv(165903,R1620_js_throw_statement,3,0),
    (...v)=>redv(176143,R1720_js_try_statement,3,0),
    (...v)=>redv(176143,R1721_js_try_statement,3,0),
    e=>2678,
    (...v)=>redv(204815,R2000_js_class_declaration,3,0),
    e=>2690,
    e=>2694,
    (...v)=>redv(206859,R2023_js_class_tail,2,0),
    (...v)=>redn(208903,1),
    (...v)=>redv(209927,R911_css_WQ_NAME,1,0),
    (...v)=>redn(210951,1),
    (...v)=>redv(207883,R1300_js_from_clause,2,0),
    e=>2710,
    e=>2714,
    e=>2718,
    (...v)=>redv(191495,R1870_js_formal_parameters,1,0),
    (...v)=>redv(191495,R1871_js_formal_parameters,1,0),
    e=>2722,
    (...v)=>redn(193543,1),
    (...v)=>redv(192519,R911_css_WQ_NAME,1,0),
    (...v)=>redn(194567,1),
    (...v)=>rednv(184335,fn.lexical,3,0),
    (...v)=>rednv(187403,fn.binding,2,0),
    e=>2730,
    (...v)=>redv(5139,R50_IMPORT_TAG,4,0),
    (...v)=>redv(299019,R1050_css_declaration_list,2,0),
    (...v)=>redv(5139,R51_IMPORT_TAG,4,0),
    e=>2742,
    e=>2754,
    e=>2766,
    e=>2770,
    (...v)=>redv(301067,R1300_js_from_clause,2,0),
    e=>2774,
    e=>2782,
    e=>2786,
    e=>2790,
    (...v)=>redn(296967,1),
    (...v)=>redv(295943,R31_undefined501_group_list,1,0),
    e=>2802,
    e=>2806,
    e=>2810,
    (...v)=>redn(297991,1),
    (...v)=>rednv(310279,fn.text,1,0),
    (...v)=>redn(6151,1),
    (...v)=>shftf(2818,I71_BASIC_BINDING),
    (...v)=>redv(309255,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(311303,1),
    (...v)=>redv(293907,R51_IMPORT_TAG,4,0),
    (...v)=>redv(293907,R50_IMPORT_TAG,4,0),
    e=>2822,
    e=>2826,
    (...v)=>redv(308239,R590_css_undefined6202_group_list,3,0),
    (...v)=>redv(306187,R590_css_undefined6202_group_list,2,0),
    (...v)=>redv(125971,R1230_js_import_declaration,4,0),
    (...v)=>redv(133131,R1300_js_from_clause,2,0),
    (...v)=>redv(126991,R1240_js_import_clause,3,0),
    (...v)=>rednv(129039,fn.name_space_import,3,0),
    e=>2834,
    (...v)=>redv(132111,R1290_js_named_imports,3,0),
    (...v)=>redv(132111,R1291_js_named_imports,3,0),
    (...v)=>redv(137235,R1340_js_export_declaration,4,0),
    (...v)=>redv(137235,R1341_js_export_declaration,4,0),
    e=>2846,
    (...v)=>redv(140303,R1370_js_export_clause,3,0),
    (...v)=>redv(140303,R1371_js_export_clause,3,0),
    e=>2862,
    (...v)=>redv(231439,R2260_js_object_literal,3,0),
    (...v)=>redv(231439,R2261_js_object_literal,3,0),
    (...v)=>rednv(236555,fn.binding,2,0),
    (...v)=>rednv(232459,fn.spread_element,2,0),
    e=>2882,
    e=>2886,
    e=>2890,
    e=>2898,
    e=>2902,
    e=>2906,
    (...v)=>redv(205839,R2010_js_class_expression,3,0),
    (...v)=>redv(223251,R2140_js_member_expression,4,0),
    e=>2910,
    (...v)=>redv(225295,R2200_js_arguments,3,0),
    (...v)=>redv(225295,R2201_js_arguments,3,0),
    (...v)=>rednv(226315,fn.spread_element,2,0),
    (...v)=>redv(219155,R2140_js_member_expression,4,0),
    (...v)=>redv(238611,R2330_js_array_literal,4,0),
    (...v)=>redv(239631,R2341_js_element_list,3,0),
    (...v)=>redv(260115,R2541_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0),
    (...v)=>redv(260115,R2542_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0),
    (...v)=>rednv(220179,fn.super_expression,4,0),
    e=>2930,
    (...v)=>redn(196615,1),
    (...v)=>redv(182287,R1780_js_variable_declaration_list,3,0),
    (...v)=>redv(237579,R1300_js_from_clause,2,0),
    (...v)=>redn(262159,3),
    e=>2938,
    (...v)=>redn(264203,2),
    (...v)=>redn(270347,2),
    e=>2950,
    (...v)=>redn(263183,3),
    (...v)=>redn(267275,2),
    e=>2954,
    (...v)=>redn(271371,2),
    (...v)=>redn(269323,2),
    e=>2986,
    e=>2990,
    e=>2998,
    e=>3010,
    (...v)=>shftf(3018,I1562_js_iteration_statement),
    (...v)=>rednv(157707,fn.variable_statement,2,0),
    (...v)=>redv(158731,R1300_js_from_clause,2,0),
    (...v)=>redn(161799,1),
    (...v)=>redn(160779,2),
    e=>3022,
    e=>3038,
    (...v)=>redv(176147,R1722_js_try_statement,4,0),
    (...v)=>rednv(178187,fn.finally_statement,2,0),
    e=>3058,
    (...v)=>redv(206863,R2022_js_class_tail,3,0),
    (...v)=>redv(206863,R2021_js_class_tail,3,0),
    (...v)=>redv(209931,R2050_js_class_element_list,2,0),
    (...v)=>redv(210955,R2060_js_class_element,2,0),
    e=>3062,
    e=>3066,
    e=>3070,
    e=>3078,
    (...v)=>redv(191499,R1871_js_formal_parameters,2,0),
    (...v)=>redv(186383,R1780_js_variable_declaration_list,3,0),
    (...v)=>redv(5143,R50_IMPORT_TAG,5,0),
    (...v)=>redv(5143,R51_IMPORT_TAG,5,0),
    e=>3098,
    (...v)=>rednv(300047,fn.attribute,3,0),
    (...v)=>redn(302087,1),
    e=>3122,
    e=>3126,
    e=>3146,
    e=>3142,
    e=>3138,
    e=>3134,
    e=>3130,
    (...v)=>redv(301071,R1300_js_from_clause,3,0),
    e=>3154,
    (...v)=>redv(293911,R50_IMPORT_TAG,5,0),
    e=>3166,
    (...v)=>redv(295947,R30_undefined501_group_list,2,0),
    e=>3174,
    e=>3182,
    e=>3190,
    (...v)=>redv(309259,R590_css_undefined6202_group_list,2,0),
    e=>3198,
    e=>3206,
    (...v)=>redv(132115,R1290_js_named_imports,4,0),
    (...v)=>redv(131087,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redv(134159,R1311_js_import_specifier,3,0),
    (...v)=>redv(140307,R1370_js_export_clause,4,0),
    (...v)=>redv(139279,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redv(141327,R1381_js_export_specifier,3,0),
    (...v)=>rednv(244759,fn.condition_expression,5,0),
    (...v)=>redv(231443,R2260_js_object_literal,4,0),
    (...v)=>redv(230415,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>rednv(232463,fn.property_binding,3,0),
    e=>3210,
    (...v)=>redn(190471,1),
    e=>3214,
    (...v)=>redv(235535,R1300_js_from_clause,3,0),
    e=>3226,
    e=>3230,
    e=>3234,
    e=>3242,
    (...v)=>redv(225299,R2200_js_arguments,4,0),
    (...v)=>redv(227343,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redv(239635,R2341_js_element_list,4,0),
    e=>3246,
    e=>3250,
    (...v)=>redv(199695,R1300_js_from_clause,3,0),
    e=>3254,
    (...v)=>redn(262163,4),
    (...v)=>redn(265231,3),
    (...v)=>redn(268303,3),
    (...v)=>redn(263187,4),
    e=>3258,
    e=>3266,
    (...v)=>redn(266255,3),
    (...v)=>rednv(156695,fn.if_statement,5,0),
    e=>3270,
    e=>3274,
    (...v)=>rednv(159767,fn.while_statement,5,0),
    e=>3278,
    (...v)=>shftf(3286,I1562_js_iteration_statement),
    e=>3294,
    e=>3298,
    e=>3306,
    e=>3310,
    (...v)=>shftf(3318,I1562_js_iteration_statement),
    (...v)=>shftf(3322,I1562_js_iteration_statement),
    (...v)=>redv(167959,R1640_js_switch_statement,5,0),
    e=>3334,
    e=>3354,
    e=>3350,
    (...v)=>redv(166935,R1630_js_with_statement,5,0),
    e=>3358,
    (...v)=>redn(179207,1),
    (...v)=>redv(206867,R2020_js_class_tail,4,0),
    e=>3362,
    e=>3370,
    e=>3378,
    e=>3382,
    (...v)=>redv(189463,R1847_js_function_expression,5,0),
    (...v)=>redn(195591,1),
    (...v)=>redv(191503,R1872_js_formal_parameters,3,0),
    (...v)=>redv(192527,R1780_js_variable_declaration_list,3,0),
    (...v)=>redv(5147,R50_IMPORT_TAG,6,0),
    (...v)=>redn(4111,3),
    e=>3386,
    e=>3390,
    (...v)=>redn(315399,1),
    (...v)=>redv(314375,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(313351,1),
    (...v)=>redn(316423,1),
    e=>3398,
    e=>3406,
    e=>3410,
    (...v)=>redv(293915,R51_IMPORT_TAG,6,0),
    e=>3414,
    e=>3518,
    e=>3422,
    e=>3466,
    e=>3446,
    e=>3498,
    e=>3510,
    e=>3542,
    e=>3546,
    e=>3550,
    e=>3554,
    e=>3578,
    e=>3586,
    e=>3598,
    e=>3606,
    e=>3610,
    e=>3614,
    e=>3618,
    e=>3622,
    (...v)=>redv(293915,R2873_html_TAG,6,0),
    e=>3626,
    e=>3630,
    e=>3634,
    (...v)=>redn(212999,1),
    e=>3638,
    e=>3646,
    e=>3654,
    e=>3658,
    (...v)=>redv(188439,R1847_js_function_expression,5,0),
    (...v)=>redv(260123,R2543_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0),
    (...v)=>redn(262167,5),
    (...v)=>redn(263191,5),
    e=>3662,
    e=>3670,
    (...v)=>shftf(3678,I1562_js_iteration_statement),
    (...v)=>shftf(3682,I1562_js_iteration_statement),
    e=>3690,
    (...v)=>redv(159771,R15615_js_iteration_statement,6,0),
    (...v)=>shftf(3710,I1562_js_iteration_statement),
    (...v)=>redv(159771,R15616_js_iteration_statement,6,0),
    e=>3722,
    (...v)=>redv(168971,R1650_js_case_block,2,0),
    e=>3730,
    e=>3742,
    (...v)=>redv(169991,R911_css_WQ_NAME,1,0),
    e=>3750,
    e=>3762,
    e=>3766,
    (...v)=>redv(189467,R1846_js_function_expression,6,0),
    e=>3770,
    (...v)=>redv(189467,R1845_js_function_expression,6,0),
    (...v)=>redv(189467,R1844_js_function_expression,6,0),
    (...v)=>redv(302095,R1300_js_from_clause,3,0),
    (...v)=>redv(312335,R1300_js_from_clause,3,0),
    (...v)=>redv(314379,R590_css_undefined6202_group_list,2,0),
    e=>3774,
    (...v)=>redv(293919,R50_IMPORT_TAG,7,0),
    (...v)=>redv(293919,R2872_html_TAG,7,0),
    e=>3782,
    e=>3786,
    e=>3790,
    (...v)=>rednv(9223,fn.stylesheet,1,0),
    (...v)=>redv(14343,R142_css_STYLE_SHEET,1,0),
    (...v)=>redv(14343,R141_css_STYLE_SHEET,1,0),
    (...v)=>redv(11271,R31_undefined501_group_list,1,0),
    (...v)=>redn(10247,1),
    e=>3810,
    e=>3814,
    e=>3826,
    e=>3822,
    e=>3818,
    (...v)=>redv(13319,R31_undefined501_group_list,1,0),
    (...v)=>redn(12295,1),
    e=>3834,
    e=>3830,
    (...v)=>redv(15367,R31_undefined501_group_list,1,0),
    e=>3878,
    (...v)=>rednv(82951,fn.selector,1,0),
    e=>3882,
    e=>3886,
    e=>3890,
    (...v)=>rednv(88071,fn.compoundSelector,1,0),
    e=>3914,
    (...v)=>rednv(90119,fn.typeselector,1,0),
    e=>3918,
    (...v)=>redv(90119,R881_css_TYPE_SELECTOR,1,0),
    (...v)=>redn(91143,1),
    (...v)=>redv(93191,R911_css_WQ_NAME,1,0),
    e=>3926,
    (...v)=>redn(92167,1),
    e=>3942,
    e=>3954,
    e=>3958,
    (...v)=>redv(117767,R00_S,1,0),
    e=>3950,
    e=>3946,
    (...v)=>redn(113671,1),
    (...v)=>redv(83975,R31_undefined501_group_list,1,0),
    (...v)=>redn(94215,1),
    e=>3978,
    e=>3990,
    (...v)=>redv(87047,R31_undefined501_group_list,1,0),
    (...v)=>redn(86023,1),
    e=>4002,
    e=>4006,
    e=>4010,
    e=>4018,
    e=>4022,
    e=>4026,
    (...v)=>rednv(142343,fn.script,1,0),
    (...v)=>redn(143367,1),
    e=>4034,
    e=>4038,
    e=>4042,
    e=>4046,
    e=>4050,
    e=>4058,
    (...v)=>redv(7187,R72_BASIC_BINDING,4,0),
    (...v)=>redv(293919,R2871_html_TAG,7,0),
    e=>4070,
    e=>4078,
    e=>4082,
    (...v)=>redv(188443,R1846_js_function_expression,6,0),
    e=>4086,
    (...v)=>redv(188443,R1845_js_function_expression,6,0),
    (...v)=>redv(188443,R1844_js_function_expression,6,0),
    (...v)=>redn(263195,6),
    (...v)=>rednv(156703,fn.if_statement,7,0),
    (...v)=>rednv(159775,fn.do_while_statement,7,0),
    (...v)=>shftf(4090,I1562_js_iteration_statement),
    (...v)=>redv(159775,R15614_js_iteration_statement,7,0),
    (...v)=>redv(159775,R15610_js_iteration_statement,7,0),
    (...v)=>redv(159775,R1569_js_iteration_statement,7,0),
    (...v)=>redv(159775,R1564_js_iteration_statement,7,0),
    (...v)=>redv(159775,R15611_js_iteration_statement,7,0),
    (...v)=>redv(159775,R15613_js_iteration_statement,7,0),
    (...v)=>redv(159775,R15612_js_iteration_statement,7,0),
    e=>4118,
    (...v)=>redv(168975,R1300_js_from_clause,3,0),
    (...v)=>redv(169995,R1660_js_case_clauses,2,0),
    e=>4122,
    e=>4126,
    (...v)=>redv(172043,R1681_js_default_clause,2,0),
    (...v)=>rednv(177175,fn.catch_statement,5,0),
    e=>4134,
    (...v)=>redv(189471,R1843_js_function_expression,7,0),
    (...v)=>redv(189471,R1842_js_function_expression,7,0),
    (...v)=>redv(189471,R1841_js_function_expression,7,0),
    (...v)=>redv(293923,R2870_html_TAG,8,0),
    e=>4138,
    e=>4142,
    e=>4146,
    e=>4150,
    (...v)=>redv(14347,R140_css_STYLE_SHEET,2,0),
    (...v)=>redv(11275,R30_undefined501_group_list,2,0),
    (...v)=>redv(13323,R30_undefined501_group_list,2,0),
    (...v)=>redn(19467,2),
    e=>4162,
    e=>4182,
    e=>4174,
    e=>4178,
    e=>4230,
    e=>4226,
    e=>4246,
    e=>4254,
    e=>4294,
    e=>4274,
    e=>4266,
    e=>4314,
    e=>4310,
    (...v)=>redv(107527,R00_S,1,0),
    e=>4326,
    (...v)=>redv(106503,R31_undefined501_group_list,1,0),
    (...v)=>redn(104455,1),
    e=>4330,
    (...v)=>rednv(82955,fn.selector,2,0),
    (...v)=>redv(81927,R31_undefined501_group_list,1,0),
    (...v)=>rednv(80903,fn.comboSelector,1,0),
    (...v)=>redn(89095,1),
    (...v)=>rednv(88075,fn.compoundSelector,2,0),
    (...v)=>redv(83979,R30_undefined501_group_list,2,0),
    (...v)=>redv(87051,R30_undefined501_group_list,2,0),
    (...v)=>redv(90123,R880_css_TYPE_SELECTOR,2,0),
    (...v)=>redv(93195,R910_css_WQ_NAME,2,0),
    (...v)=>redn(92171,2),
    (...v)=>redv(117771,R590_css_undefined6202_group_list,2,0),
    (...v)=>redv(117771,R00_S,2,0),
    (...v)=>redv(115719,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(114695,1),
    (...v)=>redn(116743,1),
    (...v)=>rednv(95243,fn.idSelector,2,0),
    (...v)=>rednv(96267,fn.classSelector,2,0),
    e=>4378,
    e=>4362,
    e=>4354,
    e=>4366,
    e=>4370,
    e=>4374,
    (...v)=>rednv(102411,fn.pseudoClassSelector,2,0),
    e=>4386,
    (...v)=>rednv(103435,fn.pseudoElementSelector,2,0),
    (...v)=>redn(86027,2),
    (...v)=>redv(84999,R31_undefined501_group_list,1,0),
    e=>4394,
    e=>4398,
    e=>4402,
    e=>4406,
    e=>4410,
    e=>4414,
    e=>4418,
    e=>4422,
    e=>4430,
    (...v)=>redv(7191,R70_BASIC_BINDING,5,0),
    e=>4434,
    e=>4438,
    e=>4442,
    e=>4446,
    e=>4454,
    (...v)=>redv(188447,R1843_js_function_expression,7,0),
    (...v)=>redv(188447,R1842_js_function_expression,7,0),
    (...v)=>redv(188447,R1841_js_function_expression,7,0),
    (...v)=>redv(159779,R1568_js_iteration_statement,8,0),
    (...v)=>redv(159779,R1567_js_iteration_statement,8,0),
    (...v)=>redv(159779,R1563_js_iteration_statement,8,0),
    (...v)=>redv(159779,R1566_js_iteration_statement,8,0),
    (...v)=>redv(159779,R1565_js_iteration_statement,8,0),
    e=>4462,
    (...v)=>redv(168979,R1652_js_case_block,4,0),
    (...v)=>redv(171023,R1671_js_case_clause,3,0),
    (...v)=>redv(172047,R1680_js_default_clause,3,0),
    (...v)=>redv(189475,R1840_js_function_expression,8,0),
    e=>4470,
    e=>4474,
    e=>4478,
    (...v)=>redv(298011,R51_IMPORT_TAG,6,0),
    e=>4486,
    (...v)=>redn(25615,3),
    e=>4498,
    (...v)=>redv(78855,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(21511,1),
    e=>4510,
    e=>4518,
    e=>4514,
    (...v)=>redv(41991,R31_undefined501_group_list,1,0),
    (...v)=>redn(46087,1),
    e=>4534,
    (...v)=>redn(48135,1),
    (...v)=>redn(47111,1),
    e=>4550,
    e=>4558,
    e=>4602,
    e=>4578,
    (...v)=>redn(56327,1),
    (...v)=>redn(71687,1),
    e=>4614,
    (...v)=>redn(44039,1),
    e=>4618,
    (...v)=>redn(28679,1),
    e=>4622,
    (...v)=>redn(36871,1),
    e=>4642,
    e=>4646,
    (...v)=>redn(37895,1),
    (...v)=>redn(38919,1),
    e=>4662,
    e=>4670,
    e=>4666,
    (...v)=>redv(15375,R150_css_COMPLEX_SELECTOR_list,3,0),
    e=>4674,
    (...v)=>redv(16399,R161_css_STYLE_RULE,3,0),
    (...v)=>redv(107531,R1050_css_declaration_list,2,0),
    (...v)=>redv(107531,R1051_css_declaration_list,2,0),
    e=>4678,
    (...v)=>redv(107531,R00_S,2,0),
    e=>4710,
    e=>4702,
    e=>4706,
    e=>4694,
    (...v)=>redv(81931,R30_undefined501_group_list,2,0),
    (...v)=>rednv(80907,fn.comboSelector,2,0),
    (...v)=>rednv(88079,fn.compoundSelector,3,0),
    (...v)=>redv(117775,R590_css_undefined6202_group_list,3,0),
    (...v)=>redv(115723,R590_css_undefined6202_group_list,2,0),
    (...v)=>rednv(98319,fn.attribSelector,3,0),
    e=>4722,
    e=>4726,
    (...v)=>redn(99335,1),
    (...v)=>rednv(102415,fn.pseudoClassSelector,3,0),
    (...v)=>redv(85003,R30_undefined501_group_list,2,0),
    e=>4734,
    e=>4738,
    e=>4742,
    e=>4746,
    e=>4750,
    e=>4754,
    e=>4758,
    e=>4762,
    e=>4766,
    (...v)=>redv(8219,R72_BASIC_BINDING,6,0),
    (...v)=>rednv(211999,fn.class_method,7,0),
    (...v)=>rednv(211999,fn.class_get_method,7,0),
    e=>4770,
    (...v)=>redv(188451,R1840_js_function_expression,8,0),
    (...v)=>redv(159783,R1560_js_iteration_statement,9,0),
    (...v)=>redv(168983,R1651_js_case_block,5,0),
    (...v)=>redv(171027,R1670_js_case_clause,4,0),
    e=>4774,
    (...v)=>redv(298015,R50_IMPORT_TAG,7,0),
    (...v)=>redv(298015,R2872_html_TAG,7,0),
    (...v)=>redn(25619,4),
    (...v)=>redv(78859,R590_css_undefined6202_group_list,2,0),
    e=>4790,
    e=>4794,
    e=>4798,
    (...v)=>(redn(18435,0)),
    (...v)=>redn(46091,2),
    (...v)=>redn(52235,2),
    (...v)=>redn(55307,2),
    (...v)=>redv(51207,R31_undefined501_group_list,1,0),
    (...v)=>redv(54279,R31_undefined501_group_list,1,0),
    (...v)=>redn(49163,2),
    e=>4850,
    e=>4854,
    e=>4874,
    e=>4870,
    (...v)=>redn(70663,1),
    e=>4862,
    (...v)=>redn(57351,1),
    e=>4890,
    e=>4886,
    e=>4894,
    e=>4898,
    e=>4902,
    e=>4878,
    e=>4922,
    e=>4918,
    e=>4926,
    e=>4930,
    (...v)=>redn(68615,1),
    e=>4938,
    e=>4942,
    e=>4946,
    e=>4950,
    e=>4958,
    e=>4990,
    e=>4978,
    e=>4982,
    (...v)=>redn(36875,2),
    (...v)=>redv(35847,R31_undefined501_group_list,1,0),
    (...v)=>redn(33799,1),
    e=>5006,
    e=>5010,
    e=>5018,
    (...v)=>redv(16403,R160_css_STYLE_RULE,4,0),
    (...v)=>redv(16403,R161_css_STYLE_RULE,4,0),
    (...v)=>redv(107535,R1051_css_declaration_list,3,0),
    (...v)=>redv(106511,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redv(109583,fn.parseDeclaration,3,0),
    e=>5030,
    (...v)=>redn(112647,1),
    (...v)=>redv(111623,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(110599,1),
    e=>5046,
    e=>5050,
    e=>5054,
    (...v)=>redn(97287,1),
    (...v)=>redn(99339,2),
    e=>5058,
    e=>5062,
    e=>5066,
    e=>5070,
    (...v)=>redv(8223,R70_BASIC_BINDING,7,0),
    (...v)=>redv(8223,R81_CALL_BINDING,7,0),
    (...v)=>rednv(212003,fn.class_set_method,8,0),
    (...v)=>redv(298019,R2870_html_TAG,8,0),
    (...v)=>redn(25623,5),
    (...v)=>redn(79887,3),
    e=>5094,
    e=>5098,
    (...v)=>redn(18439,1),
    (...v)=>redv(17415,R31_undefined501_group_list,1,0),
    (...v)=>redv(41999,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redn(46095,3),
    (...v)=>redn(45067,2),
    (...v)=>redv(51211,R30_undefined501_group_list,2,0),
    (...v)=>redv(54283,R30_undefined501_group_list,2,0),
    (...v)=>redn(50187,2),
    (...v)=>redn(53259,2),
    (...v)=>redn(56335,3),
    (...v)=>redn(58383,3),
    e=>5106,
    (...v)=>redn(62479,3),
    (...v)=>redv(61447,R591_css_undefined6202_group_list,1,0),
    (...v)=>redn(59399,1),
    (...v)=>redn(64519,1),
    (...v)=>redn(75787,2),
    e=>5142,
    (...v)=>redn(74759,1),
    e=>5146,
    e=>5150,
    (...v)=>redv(26631,R31_undefined501_group_list,1,0),
    e=>5162,
    e=>5158,
    (...v)=>redv(29703,R31_undefined501_group_list,1,0),
    (...v)=>redn(31751,1),
    e=>5166,
    e=>5170,
    (...v)=>redv(35851,R30_undefined501_group_list,2,0),
    (...v)=>redn(34827,2),
    (...v)=>redn(37903,3),
    (...v)=>redn(39951,3),
    e=>5174,
    (...v)=>redv(16407,R160_css_STYLE_RULE,5,0),
    (...v)=>redv(109587,fn.parseDeclaration,4,0),
    (...v)=>redv(112651,R1100_css_declaration_values,2,0),
    e=>5178,
    (...v)=>redv(111627,R590_css_undefined6202_group_list,2,0),
    e=>5182,
    e=>5186,
    (...v)=>rednv(98327,fn.attribSelector,5,0),
    (...v)=>redn(100359,1),
    (...v)=>redn(101391,3),
    (...v)=>redv(8227,R80_CALL_BINDING,8,0),
    (...v)=>redn(25627,6),
    e=>5190,
    (...v)=>redn(22535,1),
    (...v)=>redn(76819,4),
    (...v)=>redn(43035,6),
    (...v)=>redv(17419,R30_undefined501_group_list,2,0),
    (...v)=>redn(62483,4),
    (...v)=>redv(61451,R590_css_undefined6202_group_list,2,0),
    (...v)=>redn(63503,3),
    (...v)=>redn(67599,3),
    e=>5198,
    e=>5202,
    e=>5210,
    e=>5214,
    (...v)=>redn(72719,3),
    (...v)=>rednv(27675,C270_css_keyframes,6,0),
    (...v)=>redv(26635,R30_undefined501_group_list,2,0),
    (...v)=>redn(73739,2),
    (...v)=>redn(32795,6),
    (...v)=>redn(40979,4),
    (...v)=>redn(108555,2),
    (...v)=>redv(112655,R1100_css_declaration_values,3,0),
    (...v)=>rednv(98331,fn.attribSelector,6,0),
    (...v)=>redn(23571,4),
    (...v)=>redn(65543,1),
    (...v)=>redn(66567,1),
    e=>5238,
    e=>5234,
    (...v)=>redv(29711,R150_css_COMPLEX_SELECTOR_list,3,0),
    (...v)=>redn(67607,5),
    e=>5242,
    (...v)=>rednv(30739,C300_css_keyframes_blocks,4,0),
    (...v)=>rednv(30743,C300_css_keyframes_blocks,5,0)],

        //Goto Lookup Functions
        goto = [v=>lsm(v,gt0),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt1),
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
    v=>lsm(v,gt4),
    v=>lsm(v,gt5),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt7),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt8),
    v=>lsm(v,gt9),
    v=>lsm(v,gt10),
    v=>lsm(v,gt11),
    v=>lsm(v,gt12),
    v=>lsm(v,gt13),
    v=>lsm(v,gt14),
    nf,
    v=>lsm(v,gt15),
    v=>lsm(v,gt16),
    nf,
    v=>lsm(v,gt17),
    v=>lsm(v,gt18),
    v=>lsm(v,gt19),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt20),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt21),
    v=>lsm(v,gt22),
    nf,
    v=>lsm(v,gt23),
    v=>lsm(v,gt24),
    v=>lsm(v,gt25),
    nf,
    nf,
    nf,
    v=>lsm(v,gt26),
    nf,
    nf,
    v=>lsm(v,gt27),
    v=>lsm(v,gt28),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt29),
    nf,
    nf,
    nf,
    v=>lsm(v,gt30),
    v=>lsm(v,gt31),
    v=>lsm(v,gt32),
    nf,
    v=>lsm(v,gt33),
    v=>lsm(v,gt34),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt35),
    nf,
    v=>lsm(v,gt36),
    v=>lsm(v,gt37),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt38),
    v=>lsm(v,gt39),
    v=>lsm(v,gt40),
    nf,
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
    v=>lsm(v,gt2),
    v=>lsm(v,gt42),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt43),
    nf,
    v=>lsm(v,gt44),
    v=>lsm(v,gt45),
    nf,
    nf,
    v=>lsm(v,gt46),
    v=>lsm(v,gt47),
    nf,
    v=>lsm(v,gt48),
    nf,
    nf,
    nf,
    v=>lsm(v,gt49),
    v=>lsm(v,gt50),
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
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt74),
    v=>lsm(v,gt75),
    v=>lsm(v,gt76),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt77),
    v=>lsm(v,gt78),
    v=>lsm(v,gt79),
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
    v=>lsm(v,gt83),
    v=>lsm(v,gt84),
    nf,
    nf,
    v=>lsm(v,gt85),
    nf,
    nf,
    v=>lsm(v,gt86),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt87),
    nf,
    nf,
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
    v=>lsm(v,gt89),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt90),
    nf,
    nf,
    nf,
    v=>lsm(v,gt91),
    v=>lsm(v,gt92),
    v=>lsm(v,gt93),
    nf,
    nf,
    v=>lsm(v,gt94),
    nf,
    v=>lsm(v,gt95),
    nf,
    nf,
    v=>lsm(v,gt96),
    v=>lsm(v,gt97),
    nf,
    nf,
    nf,
    v=>lsm(v,gt98),
    v=>lsm(v,gt99),
    v=>lsm(v,gt100),
    nf,
    v=>lsm(v,gt101),
    v=>lsm(v,gt102),
    nf,
    v=>lsm(v,gt103),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt104),
    nf,
    v=>lsm(v,gt105),
    nf,
    v=>lsm(v,gt106),
    nf,
    nf,
    v=>lsm(v,gt107),
    v=>lsm(v,gt108),
    nf,
    v=>lsm(v,gt109),
    nf,
    nf,
    v=>lsm(v,gt110),
    v=>lsm(v,gt111),
    v=>lsm(v,gt112),
    nf,
    v=>lsm(v,gt113),
    nf,
    nf,
    v=>lsm(v,gt114),
    v=>lsm(v,gt115),
    nf,
    v=>lsm(v,gt112),
    v=>lsm(v,gt116),
    nf,
    v=>lsm(v,gt112),
    nf,
    nf,
    v=>lsm(v,gt117),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt118),
    nf,
    v=>lsm(v,gt119),
    v=>lsm(v,gt120),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt121),
    nf,
    v=>lsm(v,gt122),
    nf,
    nf,
    v=>lsm(v,gt123),
    v=>lsm(v,gt124),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt125),
    nf,
    v=>lsm(v,gt126),
    v=>lsm(v,gt127),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt128),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt130),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt131),
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
    v=>lsm(v,gt134),
    nf,
    v=>lsm(v,gt135),
    nf,
    nf,
    v=>lsm(v,gt136),
    nf,
    nf,
    nf,
    v=>lsm(v,gt137),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt138),
    nf,
    v=>lsm(v,gt139),
    nf,
    v=>lsm(v,gt140),
    v=>lsm(v,gt7),
    v=>lsm(v,gt141),
    nf,
    v=>lsm(v,gt142),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt143),
    nf,
    nf,
    v=>lsm(v,gt144),
    nf,
    v=>lsm(v,gt145),
    nf,
    nf,
    v=>lsm(v,gt146),
    nf,
    nf,
    v=>lsm(v,gt147),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt148),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt149),
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
    nf,
    nf,
    v=>lsm(v,gt153),
    nf,
    nf,
    v=>lsm(v,gt154),
    v=>lsm(v,gt155),
    nf,
    v=>lsm(v,gt2),
    nf,
    nf,
    nf,
    v=>lsm(v,gt156),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt157),
    nf,
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
    v=>lsm(v,gt159),
    nf,
    nf,
    v=>lsm(v,gt160),
    nf,
    nf,
    v=>lsm(v,gt161),
    v=>lsm(v,gt162),
    v=>lsm(v,gt163),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt164),
    v=>lsm(v,gt165),
    nf,
    nf,
    nf,
    v=>lsm(v,gt166),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt167),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt168),
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
    v=>lsm(v,gt170),
    nf,
    v=>lsm(v,gt171),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt172),
    nf,
    nf,
    nf,
    v=>lsm(v,gt173),
    v=>lsm(v,gt174),
    v=>lsm(v,gt175),
    v=>lsm(v,gt176),
    nf,
    v=>lsm(v,gt177),
    v=>lsm(v,gt178),
    v=>lsm(v,gt179),
    nf,
    v=>lsm(v,gt180),
    nf,
    nf,
    v=>lsm(v,gt96),
    v=>lsm(v,gt97),
    nf,
    v=>lsm(v,gt110),
    v=>lsm(v,gt111),
    nf,
    nf,
    v=>lsm(v,gt181),
    v=>lsm(v,gt182),
    v=>lsm(v,gt183),
    v=>lsm(v,gt184),
    nf,
    v=>lsm(v,gt185),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt186),
    v=>lsm(v,gt187),
    nf,
    v=>lsm(v,gt188),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt189),
    nf,
    nf,
    v=>lsm(v,gt190),
    nf,
    nf,
    nf,
    v=>lsm(v,gt191),
    nf,
    v=>lsm(v,gt192),
    nf,
    nf,
    v=>lsm(v,gt193),
    v=>lsm(v,gt194),
    v=>lsm(v,gt195),
    nf,
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
    nf,
    v=>lsm(v,gt198),
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
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt202),
    nf,
    v=>lsm(v,gt203),
    nf,
    nf,
    v=>lsm(v,gt204),
    nf,
    v=>lsm(v,gt205),
    v=>lsm(v,gt206),
    nf,
    nf,
    nf,
    v=>lsm(v,gt207),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt208),
    v=>lsm(v,gt209),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt211),
    nf,
    nf,
    nf,
    v=>lsm(v,gt112),
    v=>lsm(v,gt212),
    v=>lsm(v,gt112),
    v=>lsm(v,gt213),
    v=>lsm(v,gt112),
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
    v=>lsm(v,gt215),
    v=>lsm(v,gt216),
    nf,
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
    v=>lsm(v,gt219),
    nf,
    v=>lsm(v,gt220),
    v=>lsm(v,gt221),
    nf,
    v=>lsm(v,gt222),
    v=>lsm(v,gt223),
    nf,
    v=>lsm(v,gt224),
    v=>lsm(v,gt225),
    nf,
    nf,
    nf,
    v=>lsm(v,gt226),
    v=>lsm(v,gt227),
    nf,
    v=>lsm(v,gt228),
    nf,
    v=>lsm(v,gt229),
    v=>lsm(v,gt230),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt231),
    nf,
    nf,
    nf,
    v=>lsm(v,gt232),
    v=>lsm(v,gt233),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt234),
    nf,
    v=>lsm(v,gt235),
    v=>lsm(v,gt236),
    v=>lsm(v,gt237),
    v=>lsm(v,gt238),
    nf,
    v=>lsm(v,gt239),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt240),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt241),
    v=>lsm(v,gt242),
    v=>lsm(v,gt243),
    v=>lsm(v,gt244),
    nf,
    v=>lsm(v,gt245),
    nf,
    nf,
    nf,
    v=>lsm(v,gt246),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt247),
    nf,
    nf,
    nf,
    v=>lsm(v,gt248),
    nf,
    nf,
    v=>lsm(v,gt249),
    v=>lsm(v,gt250),
    nf,
    v=>lsm(v,gt251),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt252),
    v=>lsm(v,gt253),
    nf,
    v=>lsm(v,gt254),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt255),
    nf,
    nf,
    v=>lsm(v,gt256),
    v=>lsm(v,gt257),
    nf,
    nf,
    v=>lsm(v,gt258),
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
    v=>lsm(v,gt233),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt260),
    v=>lsm(v,gt261),
    v=>lsm(v,gt262),
    v=>lsm(v,gt263),
    v=>lsm(v,gt264),
    v=>lsm(v,gt265),
    v=>lsm(v,gt266),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt267),
    nf,
    v=>lsm(v,gt268),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt269),
    v=>lsm(v,gt238),
    v=>lsm(v,gt238),
    nf,
    nf,
    v=>lsm(v,gt270),
    nf,
    nf,
    nf,
    v=>lsm(v,gt271),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt272),
    v=>lsm(v,gt239),
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
    nf,
    nf,
    nf,
    v=>lsm(v,gt276),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt277),
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    v=>lsm(v,gt280),
    v=>lsm(v,gt281),
    nf,
    nf,
    nf,
    v=>lsm(v,gt282),
    v=>lsm(v,gt283),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt284),
    v=>lsm(v,gt285),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt286),
    v=>lsm(v,gt287),
    v=>lsm(v,gt288),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt289),
    v=>lsm(v,gt290),
    v=>lsm(v,gt291),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt266),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt292),
    v=>lsm(v,gt293),
    nf,
    nf,
    v=>lsm(v,gt238),
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
    nf,
    nf,
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
    nf,
    nf,
    v=>lsm(v,gt298),
    v=>lsm(v,gt299),
    v=>lsm(v,gt300),
    v=>lsm(v,gt301),
    nf,
    nf,
    v=>lsm(v,gt302),
    v=>lsm(v,gt303),
    v=>lsm(v,gt304),
    nf,
    v=>lsm(v,gt305),
    nf,
    v=>lsm(v,gt306),
    nf,
    nf,
    nf,
    v=>lsm(v,gt307),
    v=>lsm(v,gt287),
    nf,
    nf,
    nf,
    v=>lsm(v,gt308),
    v=>lsm(v,gt309),
    v=>lsm(v,gt310),
    nf,
    nf,
    v=>lsm(v,gt311),
    v=>lsm(v,gt312),
    v=>lsm(v,gt313),
    nf,
    v=>lsm(v,gt314),
    nf,
    v=>lsm(v,gt315),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt307),
    v=>lsm(v,gt316),
    nf,
    nf,
    nf,
    v=>lsm(v,gt292),
    nf,
    v=>lsm(v,gt317),
    v=>lsm(v,gt318),
    v=>lsm(v,gt319),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt320),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt321),
    nf,
    nf,
    v=>lsm(v,gt322),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt323),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt324),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt325),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt326),
    v=>lsm(v,gt327),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt328),
    v=>lsm(v,gt329),
    v=>lsm(v,gt330),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt325),
    nf,
    v=>lsm(v,gt331),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt332),
    nf,
    nf,
    v=>lsm(v,gt332),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt333),
    v=>lsm(v,gt334),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt335),
    v=>lsm(v,gt336),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt337),
    nf,
    nf,
    v=>lsm(v,gt338),
    nf,
    nf,
    v=>lsm(v,gt266),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf];

    function getToken(l, SYM_LU) {
        if (l.END) return 0; /*$eof*/

        switch (l.ty) {
            case 2:
                //*
                if (SYM_LU.has(l.tx)) return 14;
                /*/
                    console.log(l.tx, SYM_LU.has(l.tx), SYM_LU.get(l.tx))
                    if (SYM_LU.has(l.tx)) return SYM_LU.get(l.tx);
                //*/
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
            reduceStack = (e.reduceStack = []),
            off = 0;

        outer:

            while (time-- > 0) {

                const fn = lsm(tk, state[ss[sp]]) || 0;

                let r,
                    gt = -1;

                if (fn == 0) {
                    /*Ignore the token*/
                    tk = getToken(l.next(), lu);
                    continue;
                }

                if (fn > 0) {
                    r = state_funct[fn - 1](tk, e, o, l, ss[sp - 1]);
                } else {

                    if (tk == 14) {
                        tk = lu.get(l.tx);
                        continue;
                    }

                    if (l.ty == 8 && l.tl > 1) {
                        // Make sure that special tokens are not getting in the way
                        l.tl = 0;
                        // This will skip the generation of a custom symbol
                        l.next(l, false);

                        if (l.tl == 1)
                            continue;
                    }

                    if (RECOVERING > 1 && !l.END) {

                        if (tk !== lu.get(l.ty)) {
                            tk = lu.get(l.ty);
                            continue;
                        }

                        if (tk !== 13) {
                            tk = 13;
                            RECOVERING = 1;
                            continue;
                        }
                    }

                    tk = getToken(l, lu);

                    const recovery_token = eh[ss[sp]](tk, e, o, l, p, ss[sp], (lex) => getToken(lex, lu));

                    if (RECOVERING > 0 && recovery_token >= 0) {
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
                        l.next();
                        off = l.off;
                        tk = getToken(l, lu);
                        RECOVERING++;
                        break;

                    case 3:

                        len = (r & 0x3FC) >> 1;

                        ss.length -= len;
                        sp -= len;
                        gt = goto[ss[sp]](r >> 10);

                        if (gt < 0)
                            l.throw("Invalid state reached!");

                        if (reduceStack.length > 0) {
                            let i = reduceStack.length - 1;
                            while (i > -1) {
                                let item = reduceStack[i--];

                                if (item.index == sp) {
                                    item.action(output);
                                } else if (item.index > sp) {
                                    reduceStack.length--;
                                } else {
                                    break;
                                }
                            }
                        }

                        ss.push(off, gt);
                        sp += 2;
                        break;
                }
            }
        return o[0];
    }

    // This prevents env variable access conflicts when concurrent compilation
    // are processing text data. 

    class CompilerEnvironment {
        constructor(presets, env, url) {
            this.functions = env.functions;
            this.prst = [presets];
            this.url = url || new URL;
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

    var types$1 = {
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
    variable_declaration:61,
    cover_parenthesized_expression_and_arrow_parameter_list:60,
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

        getRootIds(ids, closure) {
            for(const id of this.vals)
                if(id && id.getRootIds)
                    id.getRootIds(ids, closure);
        }

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
                }else{
                    yield* node.traverseDepthFirst(this);
                }

                if (vals[i] !== node) // Check to see if node has been replaced. 
                    i--; //Reparse the node
            }
        }

        skip() {
            this.SKIP = true;
        }

        spin(trvs) {
            let val = trvs.next().value;
            while (val !== undefined && val !== this) { val = trvs.next().value; }    }

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

    class statement extends base {get IS_STATEMENT(){return true}}

    /** OPERATOR **/
    class operator$1 extends base {

        constructor(sym) {
            super(sym[0], sym[2]);
            this.op = "";
        }

        get left() { return this.vals[0] }
        get right() { return this.vals[1] }

        getRootIds(ids, closure) { 
            this.left.getRootIds(ids, closure);
            this.right.getRootIds(ids, closure);
        }

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

        get type() { return types$1.add_expression }
    }

    /** AND **/
    class and_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "&&";
        }

        get type() { return types$1.and_expression }
    }

    /** THROW STATEMENT  **/

    class throw_statement extends statement {
        constructor(sym) {
            super(sym[1] == ";" ? null : sym[1]);
        }

        get expr() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.expr) this.expr.getRootIds(ids, closure);
        }

        get type() { return types$1.throw_statement }

        render() {
            let expr_str = "";
            if (this.expr) {
                if (Array.isArray(this.expr)) {
                    expr_str = this.expr.map(e=>e.render()).join(",");
                } else
                    expr_str = this.expr.render();
            }
            return `throw ${expr_str};`;
        }
    }

    class array_literal extends base {
        constructor(list) {

            
            super(list || []);
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

        get type() { return types$1.array_literal }

        render() { return `[${this.exprs.map(a=>a.render()).join(",")}]` }
    }

    class function_declaration extends base {
        constructor(id, args, body) {

            super(id, args || null, body || null);

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
            if (this.args)
                this.args.getRootIds(ids, closure);
            if (this.body)
                this.body.getRootIds(ids, closure);
        }

        get name() { return this.id.name }

        get type() { return types$1.function_declaration }

        render() {
            const
                body_str = (this.body) ? this.body.render() : "",
                args_str = this.args.render(),
                id = this.id ? this.id.render() : "";

            return `function ${id}${args_str}{${body_str}}`;
        }
    }

    /** cover_parenthesized_expression_and_arrow_parameter_list **/

    class argument_list extends base {
        constructor(...sym) {
            if(!sym || !sym[0])        
                super();
            else
                super(...sym);

            this.looking = this.render() == "($$sym3,$$sym6,env,lex)";
        }

        clearRoots(){
            this.vals.forEach(a=>a.root = false);
        }

        get args() { return this.vals }

        get length (){
            return this.vals.length;
        }

        replaceNode(original, _new = null) {

            if(this.looking){
                console.log("AAAAAAAAAAAA11111111111111111AAAAAAAAAAAA11111111111111111AAAAAAAAAAAA11111111111111111AAAAAAAAAAAA11111111111111111");
                console.log( this.render());
                console.log("parenthasized", _new);
            }
            let index = -1;
            if ((index = super.replaceNode(original, _new)) > -1) {
                this.vals.splice(index, 1);
            }
            if(this.looking)
            console.log( this.render());
        }

        get type() { return types$1.argument_list }

        render(USE_PARENTHASIS = true) { 
            const str = this.vals.map(s=>(s.render())).join(",") ;
            return USE_PARENTHASIS ? `(${str})` : str;
        }
    }

    class arrow_function_declaration extends function_declaration {
        constructor(...sym) {

            super(...sym);

            if (!this.args)
                this.vals[1] = new argument_list();
        }

        getRootIds(ids, closure) {
            if (this.args)
                this.args.getRootIds(ids, closure);
            if (this.body)
                this.body.getRootIds(ids, closure);
        }

        get IS_STATEMENT() { return false }

        get name() { return null }

        get type() { return types$1.arrow_function_declaration }

        render() {
            const
                body_str = ((this.body) ?
                    ((this.body.IS_STATEMENT || (this.body.type == types$1.statements && this.body.stmts.length > 1)) ?
                        `{${this.body.render()}}` :
                        this.body.render()) :
                    "{}"),
                args_str = this.args.render(this.args.length !== 1);

            if (body_str[0] == "{")
                return `${args_str}=>(${body_str})`;
            return `${args_str}=>${body_str}`;
        }
    }

    /** BITWISE AND EXPRESSION **/
    class bitwise_and_espression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "&";
        }

        get type () { return types$1.bitwise_and_espression }
    }

    /** BITWISE OR EXPRESSION **/
    class bitwise_or_espression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "|";
        }

        get type () { return types$1.bitwise_or_espression }
    }

    /** BITWISE XOR EXPRESSION **/
    class bitwise_xor_espression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "^";
        }

        get type () { return types$1.bitwise_xor_espression }
    }

    /** ASSIGNEMENT EXPRESSION **/

    class assignment_expression extends operator$1 {
        constructor(sym) {
            super(sym);
            this.op = sym[1];
            //this.id.root = false;
        }
        
        getRootIds(ids, closure) { 
            if(this.left.type !== types$1.identifier)
                this.left.getRootIds(ids, closure);
            this.right.getRootIds(ids, closure);
        }

        get id() { return this.vals[0] }
        get expr() { return this.vals[2] }
        get type() { return types$1.assignment_expression }
    }

    /** OPERATOR **/
    class unary_pre extends base {

        constructor(sym) {
            super(sym[1]);
            this.op = "";
        }

        get expr() { return this.vals[0] }

        replaceNode(original, _new = null) {
            if(_new === null || _new.type == types$1.null_literal){
                this.replace(_new);
            }
            else
                this.vals[0] = _new;
        }

        render() { return `${this.op}${this.expr.render()}` }
    }

    /** VOID **/

    class await_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "await";
        }

        get type() { return types$1.await_expression }
    }

    /** BINDING DECLARATION **/
    class binding extends base {
        constructor(sym) {
            super(sym[0], sym[1] || null);
            this.id.root = false;
        }

        get id() { return this.vals[0] }
        get init() { return this.vals[1] }
        get type(){return types$1.binding}

        getRootIds(ids, closure, declaration = false) {
            if(declaration)
                closure.add(this.id.val);
                //this.id.getRootIds(closure, closure);
            //closure.add(this.id.val)
            if (this.init) this.init.getRootIds(ids, closure);
        }

        render() { return `${this.id}${this.init ? ` = ${this.init.render()}` : ""}` }
    }

    /** STATEMENTS **/
    class statements extends statement {
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

        get type() { return types$1.statements }

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

        get type() { return types$1.block_statement }

        render() { return `{${super.render()}}` }
    }

    /** BOOLEAN **/

    class bool_literal extends base {
        constructor(sym) { super(sym[0]); }

        get type() { return types$1.bool_literal }

        * traverseDepthFirst(p) {
            this.parent = p;
            yield this;
        }
    }

    class call_expression extends base {
        constructor(sym) {
            super(...sym);
        }

        get id() { return this.vals[0] }
        get args() { return this.vals[1] }

        getRootIds(ids, closure) {
            this.id.getRootIds(ids, closure);
            this.args.getRootIds(ids, closure);
        }

        replaceNode(original, _new = null) {
            let index = 0;
            if ((index = super.replaceNode(original, _new, this.vals)) > -1) {
                if(index == 0)
                    this.replace(_new);
                else
                    this.replace(null);
            }
        }

        get name() { return this.id.name }
        get type() { return types$1.call_expression }

        render() { 
            return `${this.id.render()}${this.args.render()}` 
        }
    }

    /** CATCH **/
    class catch_statement extends statement {
        constructor(sym) {
            super(sym[2], sym[4]);
        }

        get expression() { return this.vals[0] }
        get body() { return this.vals[1] }

        getRootIds(ids, closure) {
            this.expression.getRootIds(ids, closure);
            this.body.getRootIds(ids, closure);
        }

        get type() { return types$1.catch_statement }

        render(){
            return `catch (${this.expression})${this.body.type == types$1.block_statement ? this.body : `{${this.body}}`}`
        }
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

        get type() { return types$1.condition_expression }

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

        get type() { return types$1.debugger_statement }

        render() { return `debugger;` }
    }

    /** POSTFIX INCREMENT **/

    class delete_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "delete";
        }

        get type() { return types$1.delete_expression }
    }

    /** DIVIDE EXPRESSION **/
    class divide_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "/";
        }

        get type () { return types$1.divide_expression }
    }

    /** EQ **/
    class equality_expression extends operator$1 {
        constructor(sym) {super(sym); this.op = sym[1];  }
        get type() { return types$1.equality_expression }
    }

    /** EXPONENT **/
    class equality_expression$1 extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "**";
        }

        get type() { return types$1.equality_expression }
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

        get type() { return types$1.expression_list }

        render() { return `(${this.expressions.map(s=>s.render()).join(",")})` }
    }

    /** EXPRESSION STATEMENT **/

    class expression_statement extends statement {

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

        get type() { return types$1.expression_statement }

        render() { return this.expression.render() + ";" }
    }

    /** FOR **/
    class for_statement extends base {

        get init() { return this.vals[0] }
        get bool() { return this.vals[1] }
        get iter() { return this.vals[2] }
        get body() { return this.vals[3] }

        getRootIds(ids, closure) {  
            if (this.init) this.init.getRootIds(ids, closure);
            if (this.bool) this.bool.getRootIds(ids, closure);
            if (this.iter) this.iter.getRootIds(ids, closure);

           // closure = new Set([...closure.values()]);
            
            if (this.body) this.body.getRootIds(ids, new Set);

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

        get type() { return types$1.for_statement }

        render() {
            let init, bool, iter, body;

            if (this.init) init = this.init.render();
            if (this.bool) bool = this.bool.render();
            if (this.iter) iter = this.iter.render();
            if (this.body) body = this.body.render();

            const init_simicolon = init[init.length-1] == ";";

            return `for(${init}${init_simicolon ? "" : ";"}${bool};${iter})${body}`;
        }
    }

    /** IDENTIFIER **/
    class identifier$1 extends base {
        constructor(sym) {
            super(sym[0]);
            this.root = true;
        }

        get val() { return this.vals[0] }

        getRootIds(ids, closure) { 
            if(!closure.has(this.val)){
                ids.add(this.val);
            }
        }

        * traverseDepthFirst(p) {
            this.parent = p;
            yield this;
        }

        get name() { return this.val }

        get type() { return types$1.identifier }

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

        get type() { return types$1.if_statement }

        render() {
            const
                expr = this.expr.render(),
                stmt = this.stmt.type == types$1.statements ? `{${this.stmt.render()}}` : this.stmt.render(),
                _else = (this.else_stmt) ? " else " + (
                    this.else_stmt.type == types$1.statements || this.else_stmt.type == types$1.if_statement ? `{${this.else_stmt.render()}}` : this.else_stmt.render()
                ) : "";
            return `if(${expr})${stmt}${_else}`;
        }
    }

    /** IN **/
    class in_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "in";
        }

        get type() { return types$1.in_expression }
    }

    /** INSTANCEOF **/
    class instanceof_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "instanceof";
        }

        get type() { return types$1.instanceof_expression }
    }

    /** LEFT_SHIFT **/
    class left_shift_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "<<";
        }

        get type() { return types$1.left_shift_expression }
    }

    /** LEXICAL DECLARATION **/
    class lexical_declaration extends base {
        constructor(sym) {
            super(sym[1]);
            this.mode = sym[0];
        }

        get bindings() { return this.vals[0] }

        getRootIds(ids, closure) {
            this.bindings.forEach(b => b.getRootIds(ids, closure, true));
        }

        get type() { return types$1.lexical_declaration }

        render() { return `${this.mode} ${this.bindings.map(b=>b.render()).join(",")};` }
    }

    /** RETURN STATMENT  **/



    class label_statement extends base {
        constructor(sym) {
            super(sym[0], sym[1]);
        }

        get id(){return this.vals[0]}
        get stmt(){return this.vals[1]}

        get type() { return types$1.label_statement }

        render() {
            return `${this.id.render()}: ${this.stmt.render()}`;
        }
    }

    /** MEMBER **/

    class member_expression extends base {
        constructor(id, mem, evaluated = false) { 
            super(id, mem);
            this.evaluated = evaluated;
            this.root = true;
            this.mem.root = false;
        }

        get id() { return this.vals[0] }
        get mem() { return this.vals[1] }

        getRootIds(ids, closuere) {
            this.id.getRootIds(ids, closuere);
        }

        replaceNode(original, _new = null) {
            let index = 0;
            if ((index = super.replaceNode(original, _new, this.vals)) > -1) {
                if(index == 0)
                    this.replace(_new);
                else
                    this.replace(null);
            }
        }

        get name() { return this.id.name }
        get type() { return types$1.member_expression }

        render() { 
            if(this.evaluated){
                return `${this.id.render()}[${this.mem.render()}]`;
            }else{
                return `${this.id.render()}.${this.mem.render()}`;
            }
        }
    }

    /** MODULO **/
    class modulo_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "%";
        }

        get type() { return types$1.modulo_expression }
    }

    /** MULTIPLY **/
    class multiply_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "*";
        }

        get type () { return types$1.multiply_expression }

        
    }

    /** NEGATE **/

    class negate_expression extends unary_pre {
        constructor(sym) { super(sym);
            this.op = "-";
        }
        get type() { return types$1.negate_expression }
    }

    /** NEW EXPRESSION **/

    class new_expression extends call_expression {
        constructor(id, args) { 
            super([id, args]);
            this.root = false;
            this.id.root = false;
        }

        get type(){return types$1.new_expression}

        render() { 
            const
                args_str = (this.args) ? this.args.render() : "";

            return `new ${this.id.render()}${args_str}`;
        }
    }

    /** NULL **/
    class null_literal extends base {
        constructor() { super(); }
        get type() { return types$1.null_literal }
        render() { return "null" }
    }

    /** NUMBER **/
    class numeric_literal extends base {
        constructor(sym) { super(parseFloat(sym)); }
        get val() { return this.vals[0] }
        get type() { return types$1.numeric_literal }
        render() { return this.val + "" }
        * traverseDepthFirst(p) {
            this.parent = p;
            yield this;
        }
    }

    /** OBJECT **/

    class object_literal extends base {
        constructor(props) {
            super(props);
        }

        get props() { return this.vals[0] }

        * traverseDepthFirst(p) {
            this.parent = p;
            yield this;
            for (const prop of this.props)
                yield* prop.traverseDepthFirst(this);
        }

        getRootIds(ids, closure) {
            for(const id of this.props)
                if(id && id.getRootIds)
                    id.getRootIds(ids, closure);
        }

        get type() { return types$1.object_literal }

        render() { return `{${this.props.map(p=>p.render()).join(",")}}` }
    }

    /** OR **/
    class or_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "||";
        }

        get type() { return types$1.or_expression }
    }

    /** PLUS **/

    class plus_expression extends unary_pre {
        constructor(sym) { super(sym);
            this.op = "+";
        }
        get type() { return types$1.plus_expression }
    }

    /** OPERATOR **/

    class unary_post extends base {

        constructor(sym) {
            super(sym[0]);
            this.op = "";
        }

        replaceNode(original, _new = null) {
            if(_new === null || _new.type == types.null_literal){
                this.replace(_new);
            }
            else
                this.vals[0] = _new;
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

        get type() { return types$1.post_decrement_expression }
    }

    /** POSTFIX INCREMENT **/

    class post_increment_expression extends unary_post {

        constructor(sym) {
            super(sym);
            this.op = "++";
        }

        get type() { return types$1.post_increment_expression }

    }

    /** UNARY NOT **/

    class pre_decrement_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "--";
        }

        get type() { return types$1.pre_decrement_expression }
    }

    /** UNARY NOT **/

    class pre_increment_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "--";
        }

        get type() { return types$1.pre_increment_expression }
    }

    /** PROPERTY BINDING DECLARATION **/
    class property_binding extends binding {
        constructor(sym) {
            super([sym[0], sym[2]]);
        }
        get type( ){return types$1.property_binding}
        render() { return `${this.id.type > 2 ? `[${this.id.render()}]` : this.id.render()} : ${this.init.render()}` }
    }

    /** RIGHT SHIFT **/
    class right_shift_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = ">>";
        }

        get type() { return types$1.right_shift_expression }
    }

    /** RIGHT SHIFT **/
    class right_shift_fill_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = ">>>";
        }

        get type() { return types$1.right_shift_fill_expression }
    }

    /** RETURN STATMENT  **/



    class return_statement extends base {
        constructor(sym) {
            super(sym);
        }

        get expr() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.expr) this.expr.getRootIds(ids, closure);
        }

        get type() { return types$1.return_statement }

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

        get type() { return types$1.spread_element }

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


        get type() { return types$1.string }

        render() { return `"${this.val}"` }
    }

    /** SUBTRACT **/
    class subtract_expression extends operator$1 {

        constructor(sym) {
            super(sym);
            this.op = "-";
        }

        get type () { return types$1.subtract_expression }
    }

    /** THIS LITERAL  **/

    class this_literal extends base {
        constructor() {
            super();
            this.root = false;
        }

        get name() { return "this" }
        get type() { return types$1.this_literal }

        render() { return `this` }
    }

    /** TRY STATEMENT **/
    class try_statement extends statement {
        constructor(body, _catch, _finally) {
            super(body, _catch, _finally);
        }

        get body() { return this.vals[0] }
        get catch() { return this.vals[1] }
        get finally() { return this.vals[2] }

        getRootIds(ids, clsr) {
            this.body.getRootIds(ids, clsr);
            if (this.catch) this.catch.getRootIds(ids, clsr);
            if (this.finally) this.finally.getRootIds(ids, clsr);
        }

        get type() { return types$1.try_statement }

        render(){
            return `try ${this.body}${this.catch ? " "+ this.catch : ""}${this.finally ? " "+this.finally : ""}`
        }
    }

    /** TYPEOF **/

    class typeof_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "typeof";
        }

        get type() { return types$1.typeof_expression }
    }

    /** UNARY NOT **/

    class unary_not_expression extends unary_pre {
        constructor(sym) {
            super(sym);
            this.op = "!";
        }
        get type() { return types$1.unary_not_expression }
    }

    /** UNARY BIT OR **/

    class unary_or_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "|";
        }

        get type() { return types$1.unary_or_expression }
    }

    /** UNARY BIT XOR **/

    class unary_xor_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "~";
        }

        get type() { return types$1.unary_xor_expression }
    }

    /** VOID **/

    class void_expression extends unary_pre {

        constructor(sym) {
            super(sym);
            this.op = "void";
        }

        get type() { return types$1.void_expression }
    }

    /** ARGUMENT_LIST **/
    class argument_list$1 extends base {
        constructor(sym) {

            //if (sym && sym.length == 1)
            //    return sym[0];
            
            super( sym || []);
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

        get length (){
            return this.args.length;
        }

        get type() { return types$1.argument_list }

        render(USE_PARENTHASIZ) { 
            return this.args.map(s=>(s.render())).join(",") ;
        }
    }

    /** SCRIPT TL  **/



    class script extends base {
        constructor(sym) {
            super((Array.isArray(sym)) ? sym[0] : sym) ;
        }

        get statements() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.statements) this.statements.getRootIds(ids, closure);
        }

        get type() { return types$1.script }

        render() {
            return this.statements.render();
        }
    }

    /** MODULE TL  **/

    class return_statement$1 extends base {
        constructor(sym) {
            super((sym.length > 2) ? sym[1] : null);
        }

        get expr() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.expr) this.expr.getRootIds(ids, closure);
        }

        get type() { return types$1.module }

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

    /** IMPORT STATEMENT  **/



    class import_declaration extends base {

        constructor(specifier, import_clause = null) {
            console.log(import_clause);
            super((Array.isArray(import_clause)) ? new base(import_clause) : import_clause , specifier);
        }

        get import_clause() { return this.vals[0] }
        get specifier() { return this.vals[1] }

        getRootIds(ids, closure) {
            if (this.expr) this.expr.getRootIds(ids, closure);
        }

        get type() { return types$1.import_declaration }

        render() {
            if(this.import_clause)
                return `import ${this.import_clause.render()} from ${this.specifier.render()};`
            else
                return `import ${this.specifier.render()};`
        }
    }

    class import_clause extends base {

        constructor(imports) {
            super(imports);
        }

        get imports() { return this.vals[0] }

        getRootIds(ids, closure) {
            this.imports.getRootIds(ids, closure);
        }

        get type() { return types$1.import_clause }

        render() {
            return this.imports.render();
        }
    }

    class default_import extends base {
        constructor(sym) {
            super(sym[0]);

        }

        get id() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.id)
                this.id.getRootIds(ids, closure);
        }

        get name() { return this.id.name }

        get type() { return types$1.default_import }

        render() {
            return this.id.render();
        }
    }

    class name_space_import extends base {
        constructor(sym) {

            super(sym[0]);

            //This is a declaration and id cannot be a closure variable. 
            if (this.id)
                this.id.root = false;
        }

        get id() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.id)
                this.id.getRootIds(ids, closure);
        }

        get name() { return this.id.name }

        get type() { return types$1.name_space_import }

        render() {
            return `* as ${this.id.render()}`;
        }
    }

    class named_imports extends base {
        constructor(imports) {
            super(imports);
        }

        get imports() { return this.vals[0] }

        get type() { return types$1.named_imports }

        render() {
            const
                imports = this.imports.map(e => e.render()).join(",");

            return `{${imports}}`;
        }
    }

    class import_specifier extends base {
         constructor(id, alt_id) {

             super(id, alt_id );

             //This is a declaration and id cannot be a closure variable. 
             if (this.id)
                 this.id.root = false;
         }

         get id() { return this.vals[0] }
         get alt_id() { return this.vals[1] }

         getRootIds(ids, closure) {
             if (this.alt_id)
                 this.alt_id.getRootIds(ids, closure);
             else this.id.getRootIds(ids, closure);
         }

         get name() { return this.alt_id.name }

         get type() { return types$1.import_specifier }

         render() {
    		if (this.alt_id)
                return `${this.id.render()} as ${this.alt_id.render()}`
             else return `${this.id.render()} `
         }
     }

    class export_declaration extends base {
        constructor(exports, specifier, DEFAULT = false) {

            super(exports, specifier);

            this.DEFAULT = DEFAULT;
        }

        get exports() { return this.vals[0] }
        get specifier() { return this.vals[1] }

        getRootIds(ids, closure) {
            if (this.exports)
                this.exports.getRootIds(ids, closure);
        }

        get type() { return types$1.export_declaration }

        render() {
            const
                exports = this.exports ? this.exports.render() : "",
            	specifier  = this.specifier ? ` from ${this.specifier.render()}` : "";

            return `export ${this.DEFAULT ? "default " : ""}${exports}${specifier}`;
        }
    }

    class export_clause extends base {
    	
        constructor(exports) {
            super(exports);
        }

        get exports() { return this.vals[0] }

        get type() { return types$1.named_exports }

        render() {
            const
                exports = this.exports.map(e => e.render()).join(",");

            return `{${exports}}`;
        }
    }

    class export_specifier extends base {
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

        get type() { return types$1.export_specifier }

        render() {
            const
                body_str = (this.body) ? this.body.render() : "",
                args_str = this.args.map(e => e.render()).join(","),
                id = this.id ? this.id.render() : "";

            return `function ${id}(${args_str}){${body_str}}`;
        }
    }

    /** BREAK STATMENT  **/



    class break_statement extends base {
        constructor(sym) {
            super((Array.isArray(sym)) ? null : sym );
        }

        get label() { return this.vals[0] }

        get type() { return types$1.break_statement }

        render() {
            let label_str = this.label ? " " + this.label.render(): "";        
            return `break${label_str};`;
        }
    }

    /** CONTINUE STATMENT  **/

    class continue_statement extends base {
        get label() { return this.vals[0] }

        get type() { return types$1.continue_statement }

        render() {
            let label_str = this.label ? " " + this.label.render(): "";        
            return `continue${label_str};`;
        }
    }

    /** CASE STATMENT  **/

    class case_statement extends base {
        get expression() { return this.vals[0] }
        get statements() { return this.vals[1] }

        getRootIds(ids, closure) {
            this.expression.getRootIds(ids, closure);
            if (this.statements) this.statements.getRootIds(ids, closure);
        }

        get type() { return types$1.case_statement }

        render() {
            return `case ${this.expression.render()}:${this.statements?this.statements.render():""}`;
        }
    }

    /** DEFAULT CASE STATMENT  **/

    class default_case_statement extends base {
        get statements() { return this.vals[0] }

        getRootIds(ids, closure) {
            if (this.statements) this.statements.getRootIds(ids, closure);
        }

        get type() { return types$1.default_case_statement }

        render() {
            return `default:${this.statements?this.statements.render():""}`;
        }
    }

    /** SWITCH STATEMENT **/
    class switch_statement extends base {

        get expression() { return this.vals[0] }
        get caseblock() { return this.vals[1] }

        getRootIds(ids, closure) {
            //closure = new Set([...closure.values()]);
            this.expression.getRootIds(ids, closure);
            if (this.caseblock) this.caseblock.forEach(c=>c.getRootIds(ids, closure));
        }

        get type() { return types$1.switch_statement }

        render() {
            let
                expression = this.expression.render(),
                caseblock = this.caseblock.map(
                    c =>
                    c.render()).join("");

            return `switch(${expression}){${caseblock}}`;
        }
    }

    /** empty **/
    class empty_statement extends base {
        constructor() {
            super();
        }
        get type() { return types$1.empty }
        render() { return ";" }
    }

    /** VARIABLE STATEMENT **/
    class variable_declaration extends statement {
        constructor(sym) {
            super(sym[1]);
        }

        get bindings() { return this.vals[0] }

        getRootIds(ids, closure) {
            this.bindings.forEach(b => b.getRootIds(ids, closure, true));
        }

        get type() { return types$1.variable_declaration }

        render() { return `var ${this.bindings.map(b=>b.render()).join(",")};` }
    }

    const removeFromArray = (array, ...elems) => {
        const results = [];
        outer:
            for (let j = 0; j < elems.length; j++) {
                const ele = elems[j];
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
     *  This mode is the default and treats any data on the channel as coming from the model. The model itself is not changed from any input on the channel, and any data flow from outside the scope context is ignored.
     * -`put`:
     *  This mode will update the model to reflect inputs on the channel. This will also cause any binding to update to reflect the change on the model.
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
            this.value;
        }

        destroy() {
            this.ios.forEach(io => io.destroy());
            this.ios = null;
            this.scope = null;
            this.prop = null;
            this.modes = null;
            this.value = null;
        }

        linkImport(parent_scope){
            if ((this.modes & IMPORT)){
                const tap = parent_scope.getTap(this.prop);
                tap.addIO(this);
                
            }

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

        downS(model, IMPORTED = false, meta = null) {
            const value = model[this.prop];

            if (typeof(value) !== "undefined") {
                this.value = value;

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
                        this.ios[i].downS(model, true, meta);
                    } else
                        this.ios[i].down(value, meta);
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

            if (this.modes & EXPORT){

                
                this.scope.up(this, value, meta);
            }
        }
        
        pruneIO(ele){
            const pending_delete = [];

            for(const io of this.ios)
                if(io.ele === ele)
                    pending_delete = io;

            pending_delete.forEach(io=>io.destroy());
        }

        addIO(io) {
            if (io.parent === this)
                return;

            if (io.parent)
                io.parent.removeIO(io);

            this.ios.push(io);

            io.parent = this;

            if(this.value !== undefined)
                io.down(this.value);
            
        }

        removeIO(io) {
            if (removeFromArray(this.ios, io)[0])
                io.parent = null;
        }

        discardElement(ele){
            this.scope.discardElement(ele);
        }
    }

    class UpdateTap extends Tap {
        downS(model) {
            for (let i = 0, l = this.ios.length; i < l; i++)
                this.ios[i].down(model);
        }
        up() {}
    }

    class IOBase {

        constructor(parent, element = null) {

            this.parent = null;
            this.ele = element;

            parent.addIO(this);
        }

        discardElement(ele){
            this.parent.discardElement(ele);
        }

        destroy() {
            this.parent.removeIO(this);

            this.parent = null;
        }

        init(default_val){
            ((default_val = (this.parent.value || default_val))
                && this.down(default_val));
        }

        down() {}

        up(value, meta) { this.parent.up(value, meta); }

        //For IO composition.
        set data(data) { this.down(data); }

        addIO(child) {
            this.ele = child;
            child.parent = this;
        }

        removeIO() {
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

            super(tap, element);
            //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 

            this.argument = null;

           // if (default_val) this.down(default_val);
        }

        destroy() {
            this.ele = null;
            super.destroy();
        }

        down(value) {
            this.ele.data = value;
        }
    }

    class RedirectAttribIO extends IOBase {
        constructor(scope, errors, down_tap, up_tap) {
            super(down_tap);
            this.up_tap = up_tap;
        }

        down(value) {
            this.up_tap.up(value);
        }
    }

    /**
        This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
    */
    class AttribIO extends IOBase {
        constructor(scope, errors, tap, attr, element, default_val) {

            if (element.io) {
                let down_tap = element.io.parent;
                let root = scope.parent;
                tap.modes |= EXPORT;
                return new RedirectAttribIO(scope, errors, element.io.parent, tap);
            }

            super(tap, element);

            this.attrib = attr;
            this.ele.io = this;

            this.init(default_val);
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

        set data(v) {
            this.down(v);
        }

        get data() {

        }
    }

    class DataNodeIO extends IOBase {
        constructor(scope, tap, element, default_val) {
            super(tap, element);
            
            this.ele = element;
        }

        destroy() {
            this.ele = null;
            this.attrib = null;
            super.destroy();
        }
        down(value) {
            
            this.ele.data = value;
        }
    }

    /**
        This io updates the value of a TextNode or it replaces the TextNode with another element if it is passed an HTMLElement
    */
    class TextNodeIO extends DataNodeIO {
        constructor(scope, tap, element, default_val) {
            super(scope, tap, element, default_val);
            
            this.ELEMENT_IS_TEXT = element instanceof Text;

            this.init(default_val);
        }
        
        down(value) {

            const ele = this.ele;
            if (value instanceof HTMLElement) {
                
                if (value !== this.ele) {
                    this.ELEMENT_IS_TEXT = false;
                    this.ele = value;
                    ele.parentElement.replaceChild(value, ele);
                    this.discardElement(ele);
                }
            } else {
                if (!this.ELEMENT_IS_TEXT) {
                    this.ELEMENT_IS_TEXT = true;
                    this.ele = new Text();
                    ele.parentElement.replaceChild(this.ele, ele);
                    this.discardElement(ele);
                }
                this.ele.data = value;
            }
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
            super.destroy();
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

            if (element.type == "checkbox")
                this.event = (e) => { up_tap.up(e.target.checked, { event: e }); };
            else
                this.event = (e) => { up_tap.up(e.target.value, { event: e }); };

            this.ele.addEventListener("input", this.event);
        }

        destroy() {
            this.ele.removeEventListener("input", this.event);
            this.ele = null;
            this.event = null;
            this.attrib = null;
            super.destroy();
        }

        down(value) {
            this.ele.value = value;
        }
    }

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
    		this.model = null;
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
    		this.unsetModel();
    		this.model = undefined;
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
    		if(this.model && this.model.removeView)
    			this.model.removeView(this);
    		this.nx = null;
    		this.model = null;
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

            super();

            this.ast = ast;
            this.ele = element;
            
            if(element)
                element.wick_scope = this;

            this.parent = null;
            this.model = null;
            this.update_tap = null;

            this.ios = [];
            this.taps = new Map;
            this.scopes = [];
            this.containers = [];
            this.css = [];

            this.DESTROYED = false;
            this.LOADED = false;
            this.CONNECTED = false;
            this.TRANSITIONED_IN = false;
            this.PENDING_LOADS = 1; //set to one for self

            this.addToParent(parent);
        }

        discardElement(ele, ios) {
            if (!ios) {
                ios = [];

                for (const tap of this.taps.values())
                    for (let io of tap.ios) {
                        while (io.ele instanceof IOBase)
                            io = io.ele;
                        ios.push(io);
                    }

            }

            for (let i = 0; i < ios.length; i++) {
                const io = ios[i];
                if (io.ele == ele) {
                    io.destroy();
                    ios.splice(i--, 1);
                }
            }

            const children = ele.children;
            
            if(children)
                for (let i = 0; i < children.length; i++)
                    this.discardElement(children[i], ios);

            if (ele.wick_scope)
                ele.wick_scope.destroy();
        }

        destroy() {

            this.update({ destroying: true }); //Lifecycle Events: Destroying <======================================================================

            this.DESTROYED = true;
            this.LOADED = false;

            if (this.parent && this.parent.removeScope)
                this.parent.removeScope(this);

            //this.children.forEach((c) => c.destroy());
            //this.children.length = 0;
            this.data = null;

            if (this.ele && this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);

            //for(const io of this.ios)
            //    io.destroy();

            for (const tap of this.taps.values())
                tap.destroy();

            this.taps = null;
            //this.ios = null;
            this.ele = null;

            while (this.scopes[0])
                this.scopes[0].destroy();

            super.destroy();
        }

        addToParent(parent) {
            if (parent)
                parent.addScope(this);
        }

        addTemplate(template) {
            template.parent = this;
            this.PENDING_LOADS++;
            this.containers.push(template);
        }

        addScope(scope) {
            if (scope.parent == this)
                return;
            scope.parent = this;
            this.scopes.push(scope);
            this.PENDING_LOADS++;
            scope.linkImportTaps(this);
        }

        removeScope(scope) {
            if (scope.parent !== this)
                return;

            for (let i = 0; i < this.scopes.length; i++)
                if (this.scopes[i] == scope)
                    return (this.scopes.splice(i, 1), scope.parent = null);
        }

        linkImportTaps(parent_scope) {
            for (const tap of this.taps.values()) {
                tap.linkImport(parent_scope);
            }
        }

        getTap(name) {

            if (!name) return null;

            let tap = this.taps.get(name);

            if (!tap) {
                if (name == "update")
                    tap = this.update_tap = new UpdateTap(this, name);
                else {
                    tap = new Tap(this, name);
                    this.taps.set(name, tap);
                }

                if (this.temp_data_cache)
                    tap.downS(this.temp_data_cache);
            }
            return tap;
        }

        /**
            Makes the scope a observer of the given Model. If no model passed, then the scope will bind to another model depending on its `scheme` or `model` attributes. 
        */
        load(model) {

            let
                m = null,
                SchemedConstructor = null,
                presets = this.ast.presets,
                model_name = this.ast.model_name,
                scheme_name = this.ast.scheme_name;

            if (model_name && this.presets.models)
                m = presets.models[model_name];
            if (scheme_name && presets.schemas) {
                SchemedConstructor = presets.schemas[scheme_name];
            }

            if (m)
                model = m;
            else if (SchemedConstructor) {
                model = new SchemedConstructor();
            } else if (!model)
                model = new Model(model);

            if (this.css.length > 0)
                this.loadCSS();

            for (const scope of this.scopes) {
                scope.load(model);
                // /scope.getBadges(this);
            }

            if (model.addObserver)
                model.addObserver(this);

            this.model = model;

            for (const tap of this.taps.values())
                tap.load(this.model, false);

            this.update({ loading: true }); //Lifecycle Events: Loading <======================================================================
            //this.update({loaded:true});  //Lifecycle Events: Loaded <======================================================================
            //this.LOADED = true

            //Allow one tick to happen before acknowledging load
            setTimeout(this.loadAcknowledged.bind(this), 1);
        }

        loadCSS(element = this.ele) {

            for (const css of this.css) {

                const rules = css.getApplicableRules(element);

                element.style = ("" + rules).slice(1, -1) + "";
            }

            Array.prototype.slice.apply(element.children).forEach(child => this.loadCSS(child));
        }

        loadAcknowledged() {
            //This is called when all elements of responded with a loaded signal.

            if (!this.LOADED && --this.PENDING_LOADS <= 0) {
                this.LOADED = true;
                this.update({ loaded: true }); //Lifecycle Events: Loaded <======================================================================
                if (this.parent && this.parent.loadAcknowledged)
                    this.parent.loadAcknowledged();
            }
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

            
            if (this.taps.has(prop_name)){
                this.taps.get(prop_name).up(data, meta);
            }
        }

        update(data, changed_values, IMPORTED = false, meta = null) {

            this.temp_data_cache = data;

            (this.update_tap && this.update_tap.downS(data, IMPORTED));

            if (changed_values) {
                for (let name in changed_values)
                    if (this.taps.has(name))
                        this.taps.get(name).downS(data, IMPORTED, meta);
            } else 
                for (const tap of this.taps.values())
                    tap.downS(data, IMPORTED, meta);

            for (const container of this.containers)
                container.down(data, changed_values);
        }

        bubbleLink(child) {
            if (this.parent)
                this.parent.bubbleLink(this);
        }

        /*************** DOM CODE ****************************/

        appendToDOM(element, before_element) {

            //Lifecycle Events: Connecting <======================================================================
            this.update({ connecting: true });

            this.CONNECTED = true;

            if (before_element)
                element.insertBefore(this.ele, before_element);
            else
                element.appendChild(this.ele);

            //Lifecycle Events: Connected <======================================================================
            this.update({ connected: true });
        }

        removeFromDOM() {
            //Prevent erroneous removal of scope.
            if (this.CONNECTED == true) return;

            //Lifecycle Events: Disconnecting <======================================================================
            this.update({ disconnecting: true });

            if (this.ele && this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);

            //Lifecycle Events: Disconnected <======================================================================
            this.update({ disconnectied: true });
        }

        transitionIn(transition, transition_name = "trs_in") {

            if (transition)
                this.update({ trs: transition, [transition_name]: transition }, null, false, { IMMEDIATE: true });

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

                this.update({ trs: transition, [transition_name]: transition }, null, false, { IMMEDIATE: true });

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

    const err = function(...vals){
        vals[vals.length-1].message = vals.slice(0,-1).join("\n") + "\n"+ vals[vals.length-1].message;
        return vals[vals.length-1];
    };

    var defaults = {
        IO_FUNCTION_FAIL : (e, o) => {
           return err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`
                ,e );
        },
        ELEMENT_PARSE_FAILURE : (e, o) => {
           return err(`Problem found while parsing resource ${o.url + ""}`,e);
        },
        COMPONENT_PARSE_FAILURE : (e, o) => {
           return err(`Problem found while parsing component defined in ${o.url + ""}`,e);
        },
        RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
           return err(`Error while trying to fetch ${o.url + ""}`,e);
        },
        SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
           return err(`Error while trying to create function from script

${o.val + ""} 

in file ${o.url || o.origin_url}`,e);
            
        },
        default: e => {
            return err(`Unable to retrieve error handler`, e);
        }
    };

    const error_list = {};

    function integrateErrors(error_list_object) {
        if (typeof error_list_object !== "object") return void console.trace("An object of function properties must be passed to this function");
        for (const label in error_list_object) {
            const prop = error_list_object[label];
            if (typeof prop == "function") {
                error_list[label] = prop;
                prop.error_name = label;
            }
        }
    }

    integrateErrors(defaults);

    var error = new Proxy(function(error_function, error_object, errored_node) {
    	//console.warn(`Encountered error ${error_function.error_name}`);
        return error_function(error_object, errored_node);
    }, {
        get: (obj, prop) => {

            if (prop == "integrateErrors")
                return integrateErrors;

            if (!error_list[prop]) {
                error_list.default.error_name = prop;
                return error_list.default;
            }

            return error_list[prop];
        }
    });

    const offset = "    ";

    class ElementNode {

        constructor(env, tag = "", children = [], attribs = [], presets, USE_PENDING_LOAD_ATTRIB) {

            if (children)
                for (const child of children)
                    child.parent = this;

            this.SINGLE = false;
            this.MERGED = false;

            this.presets = presets;
            this.tag = tag;
            this.children = children || [];
            this.proxied = null;
            this.slots = null;
            this.origin_url = env.url;
            this.attribs = new Map((attribs || []).map(a => (a.link(this), [a.name, a])));

            if(this.attribs.has(""))
                this.attribs.delete("");

            this.pending_load_attrib = USE_PENDING_LOAD_ATTRIB;

            this.component = this.getAttrib("component").value;

            if (this.component)
                presets.components[this.component] = this;

            this.url = this.getAttribute("url") ? URL.resolveRelative(this.getAttribute("url"), env.url) : null;
            this.id = this.getAttribute("id");
            this.class = this.getAttribute("id");
            this.name = this.getAttribute("name");
            this.slot = this.getAttribute("slot");
            this.pinned = (this.getAttribute("pin")) ? this.getAttribute("pin") + "$" : "";

            if (this.url)
                this.loadAndParseUrl(env);

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
                const ele = this.proxied.finalize(slots_out);
                ele.slots = slots_out;
                this.mount = ele.mount.bind(ele);
            }

            this.children.sort(function(a, b) {
                if (a.tag == "script" && b.tag !== "script")
                    return 1;
                if (a.tag !== "script" && b.tag == "script")
                    return -1;
                return 0;
            });

            return this;
        }

        getAttribute(name) {
            return this.getAttrib(name).value;
        }

        getAttrib(name) {
            return this.attribs.get(name) || { name: "", value: "" };
        }

        createElement() {
            return createElement(this.tag);
        }

        toString(off = 0) {

            var o = offset.repeat(off),
                str = `${o}<${this.tag}`;

            for (const attr of this.attribs.values()) {
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
            return this.children.map(e => e.toString()).join("");
        }

        /****************************************** COMPONENTIZATION *****************************************/

        loadAST(ast) {
            if (ast instanceof ElementNode)
                this.proxied = ast;//.merge();
        }

        async loadAndParseUrl(env) {
            var ast = null,
                text_data = "",
                own_env = new CompilerEnvironment(env.presets, env, this.url);

            own_env.setParent(env);

            try {
                own_env.pending++;
                text_data = await this.url.fetchText();
            } catch (e) {
                error(error.RESOURCE_FETCHED_FROM_NODE_FAILURE, e, this);
            }

            if (text_data)
                try {
                    ast = parser(whind$1(text_data), own_env);
                } catch (e) { error(error.ELEMENT_PARSE_FAILURE, e, this); }

            this.loadAST(ast);

            own_env.resolve();

            return;
        }

        merge(node, merged_node = new this.constructor({}, this.tag, null, null, this.presets)) {

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
            merged_node.pinned = node.pinned || this.pinned;
            merged_node.origin_url = node.url;

            if (this.tap_list)
                merged_node.tap_list = this.tap_list.map(e => Object.assign({}, e));

            merged_node.attribs = new Map(function*(...a) { for (const e of a) yield* e; }(this.attribs, node.attribs));

            merged_node.statics = node.statics;

            return merged_node;
        }

        /******************************************* BUILD ****************************************************/

        mount(element, scope, presets = this.presets, slots = {}, pinned = {}, RETURN_ELEMENT = false) {

            const own_element = this.createElement(scope);
            

            appendChild(element, own_element);

            if (this.slots)
                slots = Object.assign({}, slots, this.slots);

            pinned[this.pinned] = own_element;

            if (!scope)
                scope = new Scope(null, presets || this.presets, own_element, this);

            if (!scope.ele) scope.ele = own_element;

            for (const attr of this.attribs.values())
                attr.bind(own_element, scope, pinned);

            for (let i = 0; i < this.children.length; i++) {
                const node = this.children[i];
                node.mount(own_element, scope, presets, slots, pinned);
            }

            /* 
                If there is an attribute that will cause the browser to fetch a resource that is 
                is subsequently loaded in to the element, then create a listener that will 
                update the scopes PENDING_LOADS property when the resource is requested and then 
                received.

                example elemnts = img, svg
            */
            if(this.pending_load_attrib && this.getAttrib(this.pending_load_attrib).value){
                debugger
                const fn = e=>{
                    scope.acknowledgePending();
                    own_element.removeEventListener("load", fn);
                };
                own_element.addEventListener("load", fn);
                scope.PENDING_LOADS++;
            } 


            return (RETURN_ELEMENT) ? own_element : scope;
        }
    }

    class ArgumentIO extends IO {
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

    class ScriptIO extends IOBase {

        constructor(scope, node, tap, script, lex, pinned) {
            
            const HAVE_CLOSURE = false;

            super(tap);

            this.scope = scope;
            this.TAP_BINDING_INDEX = script.args.reduce((r, a, i) => (a.name == tap.prop) ? i : r, -1);
            this.ACTIVE_IOS = 0;
            this.IO_ACTIVATIONS = 0;
            this._SCHD_ = 0;
            this.node = node;

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

            this.initProps(script.args, tap, node, pinned);

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

            for (const a in this.arg_ios)
                this.arg_ios[a].destroy();

            this.arg_ios = null;

            super.destroy();
        }

        initProps(arg_array, tap, errors, pinned) {
            for (let i = 0; i < arg_array.length; i++) {

                const a = arg_array[i];
                if (a.IS_ELEMENT) {
                    this.arg_props.push(pinned[a.name]);
                } else if (a.IS_TAPPED) {

                    let val = null;

                    const name = a.name;

                    if (name == tap.name) {
                        val = tap.prop;
                        this.TAP_BINDING_INDEX = i;
                    }

                    this.ACTIVE_IOS++;

                    this.arg_ios[name] = new ArgumentIO(this.scope, errors, this.scope.getTap(name), this, i);

                    this.arg_props.push(val);
                } else {
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

        setValue(value, meta) {
            if (typeof(value) == "object") {
                //Distribute iterable properties amongst the IO_Script's own props.
                for (const a in value) {
                    if (this.arg_ios[a])
                        this.arg_ios[a].down(value[a]);
                }
            } else {
                if (this.TAP_BINDING_INDEX !== -1){
                    this.arg_props[this.TAP_BINDING_INDEX] = value;
                }
            }
        }

        scheduledUpdate() {
            // Check to make sure the function reference is still. May not be if the IO was destroyed between
            // a down update and spark subsequently calling the io's scheduledUpdate method
            
            if (this.function) { 
                try {
                    if (this.HAVE_CLOSURE)
                        return this.function.apply(this, this.arg_props);
                    else
                        return this.function.apply(this, this.arg_props);
                } catch (e) {
                    error(error.IO_FUNCTION_FAIL, e, this.node);
                }
            }
        }

        down(value, meta) {
            if (value)
                this.setValue(value);

            if(meta){
                this.setValue(meta);
                if(meta.IMMEDIATE && this.ACTIVE_IOS >= this.IO_ACTIVATIONS){
                    return this.scheduledUpdate();
                }
            }

                    if (this.ACTIVE_IOS < this.IO_ACTIVATIONS)
                return;

            if (!this._SCHD_)
                spark.queueUpdate(this);
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

    const env = {};
    var JS = {

        processType(type, ast, fn) {
            for (const a of ast.traverseDepthFirst()) {
                if (a.type == type)
                    fn(a);
            }
        },

        getFirst(ast, type) {
            const tvrs = ast.traverseDepthFirst();
            let node = null;

            while ((node = tvrs.next().value)) {
                if (node.type == type) {
                    return node;
                }
            }

            return null;
        },

        getClosureVariableNames(ast, ...global_objects) {
            if (!ast)
                return;
            const
                tvrs = ast.traverseDepthFirst(),
                non_global = new Set(global_objects),
                globals = new Set();
            let
                node = tvrs.next().value;

            //Retrieve undeclared variables to inject as function arguments.
            while (node) {
                if (
                    node.type == types$1.identifier ||
                    node.type == types$1.member_expression
                ) {
                    if (node.type == types$1.member_expression && !(
                            node.id.type == types$1.identifier ||
                            node.id.type == types$1.member_expression
                        )) ; else
                    if (node.root && !non_global.has(node.name)) {
                        globals.add(node);
                    }
                }

                if (ast !== node && node.type == types$1.arrow_function_declaration) {

                    const glbl = new Set;
                    const closure = new Set;

                    node.getRootIds(glbl, closure);

                    const g = this.getClosureVariableNames(node, ...[...closure.values(), ...non_global.values()]);

                    g.forEach(v => {
                        if (Array.isArray(v)) debugger;
                        globals.add(v);
                    });

                    node.skip();
                }

                if (
                    node.type == types$1.lexical_declaration ||
                    node.type == types$1.variable_declaration
                ) {
                    node.bindings.forEach(b => (non_global.add(b.id.name), globals.forEach(g => { if (g.name == b.id.name) globals.delete(b.id.name); })));
                }

                node = tvrs.next().value;
            }

            return [...globals.values()].reduce((red, out) => {
                const name = out.name;

                const root = window || global;
                if ((root[name] && !(root[name] instanceof HTMLElement)) || name == "this")
                    //Skip anything already defined on the global object. 
                    return red;

                red.push(out);

                return red;
            }, []);
        },

        getRootVariables(ast) {
            const tvrs = ast.traverseDepthFirst();
            let node = null;
            var vars = [];
            while ((node = tvrs.next().value)) {
                if (node.type == types$1.function_declaration || node.type == types$1.arrow_function_declaration) {
                    return node.args.map(e => e.name);
                }
            }
            return vars;
        },

        //Returns the argument names of the first function declaration defined in the ast
        getFunctionDeclarationArgumentNames(ast) {

            const tvrs = ast.traverseDepthFirst();
            let node = null;

            while ((node = tvrs.next().value)) {
                if (node.type == types$1.function_declaration || node.type == types$1.arrow_function_declaration) {
                    return node.args.map(e => e.name);
                }
            }
            return [];
        },

        getRootVariables(lex) {
            let l = lex.copy();

            let ids = new Set();
            let closure = new Set();

            try {
                let result = JSParser(lex, env);

                if (result instanceof identifier$1) {
                    ids.add(result.val);
                } else
                    result.getRootIds(ids, closure);

                return { ids, ast: result, SUCCESS: true };
            } catch (e) {
                return { ids, ast: null, SUCCESS: false };
            }
        },

        types: types$1
    };

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
            if(this.a !== 1)
                return this.toRGBString();
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
                    let num,type ="deg";
                    if(l.tx == "to");else if(l.ty == l.types.num){
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
                    transform.px = getValue(lex.a("("));
                    lex.a(",");
                    transform.py = getValue(lex);
                    lex.a(")");
                    continue;
                case "translateX":
                    transform.px = getValue(lex.a("("));
                    lex.a(")");
                    continue;
                case "translateY":
                    transform.py = getValue(lex.a("("));
                    lex.a(")");
                    continue;
                case "scale":
                    transform.sx = getValue(lex.a("("));
                    if(lex.ch ==","){
                        lex.a(",");
                        transform.sy = getValue(lex);
                    }
                    else transform.sy = transform.sx;
                    lex.a(")");
                    continue;
                case "scaleX":
                    transform.sx = getValue(lex.a("("));
                    lex.a(")");
                    continue;
                case "scaleY":
                    transform.sy = getValue(lex.a("("));
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
    const types$2 = {
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
        }    return 2; // Default value not present. Ignore
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

        sp(value, out_val) { /* Set Property */
            if (this.HAS_PROP) {
                if (value)
                    if (Array.isArray(value) && value.length === 1 && Array.isArray(value[0]))
                        out_val[0] = value[0];
                    else
                        out_val[0] = value;
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
                        this.sp(lx.tx, out_val);
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
                        const temp = [];
                        if (!term.parseLVL1(copy, temp, false)) {
                            if (!term.OPTIONAL) {
                                break repeat;
                            }
                        }else
                            out_val.push(...temp);
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



                            for (let i = 0; i < l; i++) {

                                if (HIT[i] === 2) continue;

                                let term = this.terms[i];

                                const temp = [];

                                if (!term.parseLVL1(copy, temp, false)) {
                                    if (term.OPTIONAL)
                                        HIT[i] = 1;
                                } else {
                                    out_val.push(...temp);
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

                    or:
                        while (true) {
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
                    copy = lx.copy();
                
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
            //if(this.DEMOTED) debugger
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

            if (!(this.value = types$2[u_value]))
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
                    let element = this.value.valueHandler(this.value, slot);
                    element.addEventListener("change", e => {

                        let value = element.value;
                        slot.css_val = value;
                        slot.update();
                    });
                    slot.setValueHandler(element);
                } else {
                    let sub = new Segment();
                    sub.setValueHandler(this.value, sub);
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

            let bool = false;

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

    function getExtendedIdentifier(l) {
        let pk = l.pk;

        let id = "";

        while (!pk.END && (pk.ty & (whind$1.types.id | whind$1.types.num)) || pk.tx == "-" || pk.tx == "_") { pk.next(); }

        id = pk.slice(l);

        l.sync();

        l.tl = 0;

        return id;
    }

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
        l.useExtendedId();
        
        const important = { is: false };

        let n = d(l, definitions, productions);

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

    function d(l, definitions, productions, super_term = false, oneof_group = false, or_group = false, and_group = false, important = null) {
        let term, nt, v;
        const { JUX, AND, OR, ONE_OF, LiteralTerm, ValueTerm, SymbolTerm } = productions;

        while (!l.END) {

            switch (l.ch) {
                case "]":
                    return term;
                    break;
                case "[":

                    v = d(l.next(), definitions, productions, true);
                    l.assert("]");
                    v = checkExtensions(l, v, productions);

                    if (term) {
                        if (term instanceof JUX && term.isRepeating()) term = foldIntoProduction(productions, new JUX, term);
                        term = foldIntoProduction(productions, term, v);
                    } else
                        term = v;
                    break;

                case "<":
                    let id = getExtendedIdentifier(l.next());

                    v = new ValueTerm(id, getPropertyParser, definitions, productions);

                    l.next().assert(">");

                    v = checkExtensions(l, v, productions);

                    if (term) {
                        if (term instanceof JUX /*&& term.isRepeating()*/ ) term = foldIntoProduction(productions, new JUX, term);
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
                            nt.terms.push(d(l, definitions, productions, super_term, oneof_group, or_group, true, important));
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
                                nt.terms.push(d(l, definitions, productions, super_term, oneof_group, true, and_group, important));
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
                                nt.terms.push(d(l, definitions, productions, super_term, true, or_group, and_group, important));
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
                        if (term instanceof JUX /*&& (term.isRepeating() || term instanceof ONE_OF)*/ ) term = foldIntoProduction(productions, new JUX, term);
                        term = foldIntoProduction(productions, term, v);
                    } else {
                        term = v;
                    }
            }
        }

        return term;
    }

    function checkExtensions(l, term, productions) {
        outer: while (true) {

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
    }

    const props = Object.assign({}, property_definitions);

    function dragstart(e){
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

            if(this._value){
                this._value.parent = this;
                this._value.mount(this.element);
            }
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
            this.element.addEventListener("dragstart", dragstart.bind(this));
            this.label = document.createElement("span");
            this.label.classList.add("prop_label");
            this.label.innerHTML = `${type.replace(/[\-\_]/g, " ")}`;
        }

        get value(){
            return this._value.toString();
        }
    }

    UIProp = createCache(UIProp);

    const props$1 = Object.assign({}, property_definitions);

    class styleprop {
    	constructor(name, original_value, val){
    		this.val = val;
            this.name = name.replace(/\-/g, "_");
            this.original_value = original_value;
    	}

        get value(){
            return this.val.length > 1 ? this.val : this.val[0];
        }

        get value_string(){
            return this.val.join(" ");        
        }

        toString(offset = 0){
            const  
                off = ("    ").repeat(offset);

            return `${off+this.name.replace(/\_/g, "-")}:${this.value_string}`;
        }
    }

    function parseDeclaration(sym) {
        if(sym.length == 0)
            return null;

        let rule_name = sym[0];
        let body_data = sym[2];
        let important = sym[3] ? true : false;
        let prop = null;

        const IS_VIRTUAL = { is: false };

        const parser = getPropertyParser(rule_name.replace(/\-/g, "_"), IS_VIRTUAL, property_definitions);

        if (parser && !IS_VIRTUAL.is) {

            prop = parser.parse(whind$1(body_data).useExtendedId());

        } else
            //Need to know what properties have not been defined
            console.warn(`Unable to get parser for CSS property ${rule_name}`);

        return new styleprop(rule_name, body_data, prop);
    }

    function setParent(array, parent) {
        for (const prop of array)
            prop.parent = parent;
    }
    /*
     * Holds a set of css style properties.
     */

    class stylerule {

        constructor(selectors = [], props = []) {
            this.selectors = selectors;
            this.properties = new Map;

            this.addProp(props);
            //Reference Counting
            this.refs = 0;

            //Versioning
            this.ver = 0;

            this.parent = null;

            setParent(this.selectors, this);
            setParent(this.properties.values(), this);

            this.props = new Proxy(this, this);
            this.addProperty = this.addProp;
            this.addProps = this.addProp;
        }

        get type(){
            return "stylerule"
        }

        get(obj, name) {
            let prop = obj.properties.get(name);
            if (prop)
                prop.parent = this;
            return prop;
        }

        addProp(props) {
            if (typeof props == "string") {
                return this.addProps(
                    props.split(";")
                    .filter(e=> e !== "")
                    .map((e, a) => (a = e.split(":"), a.splice(1, 0, null), a))
                    .map(parseDeclaration)
                )
            }

            if (props.type == "stylerule")
                props = props.properties.values();
            else
            if (!Array.isArray(props))
                props = [props];

            for (const prop of props)
                if (prop)
                    this.properties.set(prop.name, prop);

            this.ver++;
        }

        match(element, window) {
            for (const selector of this.selectors)
                if (selector.match(element, window))
                    return true;
            return false;
        }

        * getApplicableSelectors(element, window) {
            for (const selector of this.selectors)
                if (selector.match(element, window))
                    yield selector;
        }

        * getApplicableRules(element, window) {
            if (this.match(element, window))
                yield this;
        }

        * iterateProps() {
            for (const prop of this.properties.values())
                yield prop;
        }

        incrementRef() {
            this.refs++;
        }

        decrementRef() {
            this.refs--;
            if (this.refs <= 0) {
                //TODO: remove from rules entries.
                debugger
            }
        }

        toString(off = 0, rule = "") {

            let str = [];

            for (const prop of this.properties.values())
                str.push(prop.toString(off));

            return `${this.selectors.join("")}{${str.join(";")}}`;
        }

        merge(rule) {
            if (rule.type ==  "stylerule")
                this.addProp(rule);
        }

        get _wick_type_() { return 0; }

        set _wick_type_(v) {}
    }

    class stylesheet {
        constructor(sym) {
            this.ruleset = null;

            if (sym) {
                this.ruleset = sym[0];
                this.ruleset.parent = this;
            }

            this.parent = null;

            this.READY = true;

            this.observers = [];
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

        merge(in_stylesheet) {
            if (in_stylesheet instanceof stylesheet) {

                let ruleset = in_stylesheet.ruleset;
                outer:
                    for (let i = 0; i < children.length; i++) {
                        //determine if this child matches any existing selectors
                        let child = children[i];

                        for (let i = 0; i < this.children.length; i++) {
                            let own_child = this.children[i];

                            if (own_child.isSame(child)) {
                                own_child.merge(child);
                                continue outer;
                            }
                        }

                        this.children.push(child);
                    }
            }
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

        updated() {
            if (this.observers.length > 0)
                for (let i = 0; i < this.observers.length; i++) this.observers[i].updatedCSS(this);
        }

        addObserver(observer) {
            this.observers.push(observer);
        }

        removeObserver(observer) {
            for (let i = 0; i < this.observers.length; i++)
                if (this.observers[i] == observer) return this.observers.splice(i, 1);
        }

        * getApplicableSelectors(element, win = window) {
            yield * this.ruleset.getApplicableSelectors(element, window);
        }

        getApplicableRules(element, win = window, RETURN_ITERATOR = false, new_rule = new stylerule) {
            if(!(element instanceof HTMLElement))
                return new_rule;

            const iter = this.ruleset.getApplicableRules(element, win);
            if (RETURN_ITERATOR) {
                return iter
            } else
                for (const rule of iter) {
                    new_rule.addProperty(rule);
                }
            return new_rule;
        }

        * getApplicableProperties(element, win = window){
            for(const rule of this.getApplicableRules(element, win))
                yield * rule.iterateProps();
        }

        getRule(string) {
            let r = null;
            for (let node = this.fch; node; node = this.getNextChild(node))
                r = node.getRule(string, r);
            return r;
        }

        toString() {
            return this.ruleset + "";
        }
    }

    class ruleset {
    	constructor(ats, rules){
    		this.rules = rules;

            rules.forEach(r=>r.parent = this);

            this.parent = null;
    	}

        * getApplicableSelectors(element, win = window) {
            for(const rule of this.rules)
                yield * rule.getApplicableSelectors(element, win);
        }

    	* getApplicableRules(element, win = window){
            for(const rule of this.rules)
                yield * rule.getApplicableRules(element, window);
        }
        /*
    	getApplicableRules(element, new_rule = new stylerule, win = window, us) {

            for(const rule of this.rules){
                if(rule.match(element, win))
                    new_rule.addProperty(rule);
            }
            
            return new_rule;
        }*/

        getRule(string) {
            let r = null;
            for (let node = this.fch; node; node = this.getNextChild(node))
                r = node.getRule(string, r);
            return r;
        }

        toString(){
            return this.rules.join("\n");
        }
    }

    class compoundSelector {
        constructor(sym, env) {

            if(sym.length = 1)
                if(Array.isArray(sym[0]) && sym[0].length == 1)
                    return sym[0][0]
                else
                    return sym[0]

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
            return "compound"
        }

        matchReturnElement(element, win) {
            if (this.tag) {
                if (!this.tag.matchReturnElement(element, win))
                    return null;
            }

            if (this.subclass) {
                for (const sel of this.subclass) {
                    if (!sel.matchReturnElement(element, win))
                        return null;
                }
            }

            if (this.pseudo) {
                if (!this.subclass.matchReturnElement(element, win))
                    return null;
            }

            return element;
        }

        toString() {
            const
                tag = this.tag ? this.tag + "" : "",
                subclass = this.subclass ? this.subclass.join("") + "" : "",
                pseudo = this.pseudo ? this.pseudo + "" : "";

            return `${tag + subclass + pseudo}`;
        }
    }

    class combination_selector_part {
        constructor(sym, env) {
            if (sym.length > 1) {
                this.op = sym[0];
                this.selector = sym[1];
            } else 
                return sym[0]
        }

        get type() {
            return "complex"
        }

        matchReturnElement(element, selector_array, selector = null, index = 0) {
            let ele;

            if ((ele = this.selector.matchReturnElement(element, selector_array))) {
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

            return null;
        }

        toString() {
            return this.op + this.selector + "";
        }
    }

    class selector {
        constructor(sym, env) {
            if (sym.length > 1)
                this.vals = [sym, ...sym[1]];
            else
                this.vals = sym;

            this.parent = null;
        }

        match(element, win = window) {

            for (const selector of this.vals.reverse()) {
                if (!(element = selector.matchReturnElement(element, win)))
                    return false;
            }
            return true;
        }

        toString() {
            return this.vals.join(" ");
        }
    }

    class type_selector_part{
    	constructor(sym){
    		const val = sym[0];
    		this.namespace = "";

    		if(val.length > 1)
    			this.namespace = val[0];
    		this.val = ((val.length > 1) ? val[1] : val[0]).toLowerCase();
    	}

    	get type(){
    		return "type"
    	}

    	matchReturnElement(element, win){
    		return element.tagName.toLowerCase() == this.val ? element : null;
    	}

    	toString(){
    		return  this.namespace + " " + this.val;
    	}
    }

    class idSelector{
    	constructor(sym,env){
    		this.val = sym[1];
    	}

    	get type(){
    		return "id"
    	}

    	matchReturnElement(element){
    		return element.id == this.val ? element : null;
    	}

    	toString(){
    		return "#"+ this.val;
    	}
    }

    class classSelector{
    	constructor(sym,env){
    		this.val = sym[1];
    	}

    	get type(){
    		return "class"
    	}

    	matchReturnElement(element, window){
    		return element.classList.contains(this.val) ? element : null;
    	}

    	toString(){
    		return "."+this.val;
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

    	matchReturnElement(element, result){
    		
    		let attr = element.getAttribute(this.key);

    		if(!attr)
    			return null
    		if(this.val && attr !== this.val)
    			return null;
    		
    		return element;
    	}

    	toString(){
    		return `[${this.key+this.op+this.val+this.mod}]`;
    	}
    }

    class pseudoClassSelector{
    	constructor(sym,env){
    		this.val = sym[1];
    	}

    	get type(){
    		return "pseudoClass"
    	}

    	matchReturnElement(element){
    		return element;
    	}

    	toString(){

    	}
    }

    class pseudoElementSelector{
    	constructor(sym,env){
    		this.val = sym[1].val;
    	}

    	get type(){
    		return "pseudo-element"
    	}

    	matchReturnElement(element){
    		return element;
    	}

    	toString(){

    	}
    }

    const 
        CSS_Length$1 = types$2.length,
        CSS_Percentage$1 = types$2.percentage,
        CSS_Color$1 = types$2.color,
        CSS_Transform2D$1 = types$2.transform2D,
        CSS_Bezier$1 = types$2.cubic_bezier,

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

                        if (!value)
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
                    if (this.run(this.time)) {
                        spark.queueUpdate(this);
                    } else if (this.REPEAT) {
                        let scale = this.SCALE;

                        this.REPEAT--;

                        if (this.SHUTTLE)
                            scale = -scale;

                        let from = (scale > 0) ? 0 : this.duration;

                        this.play(scale, from);
                    } else
                        this.issueEvent("stopped");

                }

                //TODO: use repeat to continually play back numation 
                repeat(count = 1) {
                    this.REPEAT = Math.max(0, parseFloat(count));
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

                set(i = 0) {
                    if (i >= 0)
                        this.run(i * this.duration);
                    else
                        this.run(this.duration - i * this.duration);
                }


                shuttle(SHUTTLE = true) {
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
                    this.ANIM_COMPLETE_FUNCTION = null;
                }

                observeStop(fun) {
                    if (typeof fun == "function")
                        return (new Promise((res=>this.ANIM_COMPLETE_FUNCTION = res))).then(fun);
                    return this;
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
                    else if (repeat) {
                        let scale = this.scale;

                        repeat--;

                        if (this.SHUTTLE)
                            scale = -scale;

                        let from = (scale > 0) ? 0 : this.duration;

                        this.play(scale, from);
                    }
                }

                shuttle(SHUTTLE = true) {
                    this.SHUTTLE = !!SHUTTLE;
                    return this;
                }

                stop() {
                    return this;
                }

                set(i = 0) {
                    if (i >= 0)
                        this.run(i * this.duration);
                    else
                        this.run(this.duration - i * this.duration);
                }

                //TODO: allow scale to control playback speed and direction
                play(scale = 1, from = 0) {
                    this.SCALE = scale;
                    this.time = from;
                    spark.queueUpdate(this);
                    return this;
                }
                //TODO: use repeat to continually play back numation 
                repeat(count = 0) {
                    this.REPEAT = Math.max(0, parseInt(count));
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

                        Object.keys(data).forEach(k => { if (!(({ obj: true, match: true, delay: true })[k])) props[k] = data[k]; });

                        group.add(new AnimSequence(obj, props));
                    }

                    return group;

                } else {
                    let data = args[0];

                    let obj = data.obj;
                    let props = {};

                    Object.keys(data).forEach(k => { if (!(({ obj: true, match: true, delay: true })[k])) props[k] = data[k]; });

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

        {
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


            async start(time = 0, speed = 1, reverse = false) {

                for (let i = 0; i < this.in_seq.length; i++) {
                    // let seq = this.in_seq[i];
                    // seq.beginCSSAnimation()
                }

                this.time = time;
                this.speed = Math.abs(speed);
                this.reverse = reverse;

                if (this.reverse)
                    this.speed = -this.speed;

                const t = Math.random();

                return new Promise((res, rej) => {
                    if (this.duration > 0){
                        console.log(t);
                        this.scheduledUpdate(0, 0);
                    }
                    if (this.duration < 1){
                        console.log(t);
                        return res();
                    }
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


                if (this.res && this.time >= this.in_delay + this.out_duration) {
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

                if (this.res){
                    debugger
                    this.res();
                }

                this.destroy();
            }
        }

        return { createTransition: (OVERRIDE) => new Transition(OVERRIDE) };
    })();

    Object.assign(Animation, {
    	createTransition:(...args) => Transitioneer.createTransition(...args),
    	transformTo:(...args) => TransformTo(...args)
    });

    const defaults$1 = {
        glow: Animation,
        wickNodeExpression: function(scope, id) {
            const out = scope.ast.presets.components[id].mount(null, scope, scope.ast.presets, undefined, undefined, true);
            return out;
        }
    };

    const root = typeof(global) == "object" ? global : window;

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
                else if (defaults$1[name]){
                    out_object.val = defaults$1[name];
                }else if (root[name]){
                    out_object.val = root[name];
                }           else if (name[name.length - 1] == "$") {
                    out_object.IS_ELEMENT = true;
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

        ast.forEach(node => {

            if (node.parent && node.parent.type == types$1.assignment_expression && node.type == types$1.identifier) {
                if (node == node.parent.left) {

                    const assign = node.parent;

                    const k = node.name;


                    if ((root[k] && !(root[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults$1[k] || ignore.includes(k))
                        return;

                    node.replace(new member_expression(new identifier$1(["emit"]), node));
                }
            }
        });
    }

    class ScriptNode extends ElementNode {

        constructor(env, tag, ast, attribs, presets) {
            super(env, "script", null, attribs, presets);
            this.function = null;
            this.args = null;
            this.ast = ast[0];
            this.READY = false;
            this.val = "";
            this.on = this.getAttrib("on").value;

            if (this.ast)
                this.processJSAST(presets);
        }

        loadAST(ast){
            if(ast && !this.ast){
                this.ast = ast;
                this.processJSAST(this.presets);
            }
        }

        processJSAST(presets = { custom: {} }) {
            const { args, ids } = GetOutGlobals(this.ast, presets);
            this.args = args;
            AddEmit(ids, presets, this.args.reduce((r, a) => ((a.IS_TAPPED) ? null : r.push(a.name), r), []));
            this.val = this.ast + "";
        }

        finalize() {
            if (!this.ast) return this;

            {

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
                    error(error.SCRIPT_FUNCTION_CREATE_FAILURE, e, this);
                }

            }

            return this;
        }

        mount(element, scope, presets, slots, pinned) {
            if (this.READY) {
                const tap = this.on.bind(scope, null, null, this);
                new ScriptIO(scope, this, tap, this, {}, pinned);
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

            if (this.schema_name)
                this.getAttrib("scheme").RENDER = false;

            if (this.model_name)
                this.getAttrib("model").RENDER = false;

            if (this.getAttrib("put"))
                this.getAttrib("put").RENDER = false;

            if (this.getAttrib("import"))
                this.getAttrib("import").RENDER = false;

            if (this.getAttrib("export"))
                this.getAttrib("export").RENDER = false;

            this.tag = this.getAttrib("element").value || "div";
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

            if (!name) return;

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

        createElement(scope) {
            if (!scope.ele || this.getAttribute("element")) {
                const ele = createElement(this.element || "div");

                if (scope.ele) {
                    appendChild(scope.ele, ele);
                    scope.ele = ele;
                }

                return ele;
            }

            return scope.ele;
        }

        mount(own_element, outer_scope, presets = this.presets, slots = {}, pinned = {}) {

            const scope = new Scope(outer_scope, presets, own_element, this);

            if (this.HAS_TAPS) {
                const tap_list = this.tap_list;

                for (let i = 0, l = tap_list.length; i < l; i++) {
                    const tap = tap_list[i],
                        name = tap.name,
                        bool = name == "update";

                    if (scope.taps.has(name)) continue;

                    scope.taps.set(name,
                        bool 
                        ? (scope.update_tap = scope.taps[name],
                            new UpdateTap(scope, name, tap.modes)) 
                        : new Tap(scope, name, tap.modes)
                    );
                }
            }

            scope._model_name_ = this.model_name;
            scope._schema_name_ = this.schema_name;

            //Reset pinned
            pinned = {};

            return super.mount(null, scope, presets, slots, pinned);
        }
    }

    class a extends ElementNode{
    	constructor(env, tag, children, attribs, presets){
    		super(env, "a", children, attribs, presets);
    	}

    	createElement(){
            const element = document.createElement("a");
            this.presets.processLink(element);
            return element;
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

            this.LOADED = false;

            parent.addTemplate(this);
        }

        get data() {}

        set data(container) {

            if (container instanceof ModelContainerBase) {
                container.pin();
                container.addObserver(this);
                return;
            } else {
                this.unsetModel();
            }

            if (!container) return;
            if (Array.isArray(container)) this.cull(container);
            else this.cull(container.data);

            this.loadAcknowledged();
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

        loadAcknowledged(){
            if(!this.LOADED){
                this.LOADED = true;
                this.parent.loadAcknowledged();
            }
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
                            default:
                                {
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

                if (filter.ARRAY_ACTION)
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

        limitExpressionUpdate(transition = Animation.createTransition()) {

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

                const sl = this.scopes.length;

                for (let i = 0; i < sl; i++) this.scopes[i].transitionOut(transition, "", true);

                this.scopes.length = 0;
                this.activeScopes.length = 0;
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

                exists.forEach((v, k) => { if (v) out.push(k); });

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
            const out_terms = [];

            for (let i = 0, l = this.terms.length; i < l; i++) {

                const term = this.terms[i].term;

                if (term) out_terms.push(term);
            }
            if (out_terms.length == 0) return null;
            return out_terms;
        }

        get() {
            if (this.model instanceof MultiIndexedContainer) {
                if (this.data.index) {
                    const index = this.data.index,
                        query = {};
                    query[index] = this.getTerms();
                    return this.model.get(query)[index];
                } else console.warn("No index value provided for MultiIndexedContainer!");
            } else {

                const  scope = this.model.scope,
                    terms = this.getTerms();
                if (scope) {
                    this.model.destroy();
                    const model = scope.get(terms, null);
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

    class d$1 {
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
                d$1.web_component_constructor(this, bound_data_object), {}
            );
        }

        //Mounts component data to new HTMLElement object.
        async mount(HTMLElement_, bound_data_object, USE_SHADOW) {

            if (this.READY !== true) {
                if (!this.__pending)
                    this.__pending = [];

                return new Promise(res =>this.__pending.push([HTMLElement_, bound_data_object, USE_SHADOW, res]));
            }

            return this.nonAsyncMount(HTMLElement_, bound_data_object, USE_SHADOW);
        }

        nonAsyncMount(HTMLElement_, bound_data_object = null, USE_SHADOW = true){
            let element = HTMLElement_;

            if ((HTMLElement_ instanceof HTMLElement) && USE_SHADOW) {
                //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

                element = HTMLElement_.attachShadow({ mode: 'open' });
            }

            const scope = this.ast.mount(element);

            scope.load(bound_data_object);

            return scope;
        }

        connect(h, b) { return this.mount(h, b) }
    }

    d$1.web_component_constructor = function(wick_component, bound_data) {
        return class extends HTMLElement {
            constructor() {
                super();
                wick_component.mount(this, bound_data);
            }
        };
    };

    class fltr extends ElementNode {
        constructor(env, tag, children, attribs, presets) {
            super(env, "f", null, attribs, presets);

            this.type = 0;

            for (const attr of this.attribs.values()) 
                if (attr.value.setForContainer)
                    attr.value.setForContainer(presets);
        }

        mount(scope, container) {
            for (const attr of this.attribs.values()) 
                 attr.value.bind(scope, null, null, this).bindToContainer(attr.name, container);
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
        }

        updateProp(io, val) {
            super.updateProp(io, val);
            this.down();
        }

        scheduledUpdate() {

            this.val = super.scheduledUpdate();

            if(this.old_val === null || this.val !== this.old_val){
                this.old_val = this.val;
                this.ele.data = this.val;
            }
        }
    }

    /******************** Expressions **********************/

    class ContainerIO extends ScriptIO {
        constructor(container, scope, node, tap, binding, lex, pinned) {
            super(scope, node, tap, binding, lex, pinned);

            this.container = container;

            //Reference to function that is called to modify the host container. 
            this.action = null;

            this.ARRAY_ACTION = false;
        }

        bindToContainer(type, container) {
            this.container = container;

            const STATIC = this.IO_ACTIVATIONS == 0;

            switch (type) {
                case "sort":
                    this.ARRAY_ACTION = true;
                    container.filters.push(this);
                    this.action = this.sort;
                    return;
                case "filter":
                    this.ARRAY_ACTION = true;
                    container.filters.push(this);
                    this.action = this.filter;
                    return;
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
            
            if (STATIC)
                this.down();
        }

        destroy() {
            this.container = null;
            super.destroy();
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

        scheduledUpdate() {
            const old = this.val;

            this.val = super.scheduledUpdate();

            if (this.ARRAY_ACTION) {
                this.container.filterExpressionUpdate();
            } else if (this.val !== undefined && this.val !== old) {
                this.action();
                this.container.limitExpressionUpdate();
            }
        }

        filter(array) {
            return array.filter((a) => (this.setValue([a]), super.scheduledUpdate()));
        }

        sort(array) {
            return array.sort((a, b) => (this.setValue([a, b]), super.scheduledUpdate()));
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

    class Binding {

        constructor(exprA, exprB, env, lex) {

            this.lex = lex.copy();
            this.lex.sl = lex.off - 3;
            this.lex.off = env.start;

            console.log(exprA, exprB);

            this.METHOD = IDENTIFIER;

            this.ast = exprA;
            this.prop = exprB;

            this.function = null;
            this.args = null;
            this.READY = false;

            this.origin_url = env.url;

            this.val = this.ast + "";

            if (this.ast && !(this.ast instanceof identifier$1))
                this.processJSAST(env.presets);

        }

        toString() {
            
            if (this.prop)
                return `((${this.ast + ""})(${this.prop + ""}))`;
            else
                return `((${this.ast + ""}))`;
        }

        processJSAST(presets = { custom: {} }) {
            const { args, ids } = GetOutGlobals(this.ast, presets);

            this.args = args;

            AddEmit(ids, presets);

            const r = new return_statement([]);
            r.vals[0] = this.ast;
            this.ast = r;
            this.val = r + "";
            this.METHOD = EXPRESSION;

            ScriptNode.prototype.finalize.call(this);
        }

        setForContainer(presets) {

            if (this.METHOD == IDENTIFIER)
                this.processJSAST(presets);

            this.METHOD = CONTAINER;
        }

        bind(scope, element, pinned, node = this) {
            if (this.METHOD == EXPRESSION) {
                return new ExpressionIO(element, scope, node, scope, this, this.lex, pinned);
            } else if (this.METHOD == CONTAINER)
                return new ContainerIO(element, scope, node, scope, this, this.lex, pinned);
            else
                return scope.getTap(this.val);
        }
    }

    Binding.type = {
        Attribute: 0,
        TextNode: 1,
        Style: 2
    };

    const offset$1 = "";

    class TextNode {

        constructor(sym, env) {
            
            this.data = sym[0] || "";
            this.IS_BINDING = (this.data instanceof Binding);
            this.tag = "text";
        }

        toString(off = 0) {
            return `${offset$1.repeat(off)} ${this.data.toString()}\n`;
        }

        finalize(){
            return this;
        }

        get IS_WHITESPACE(){
            return !this.IS_BINDING && (!this.data.toString().trim());
        }

        mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {
            const IS_TEXT_NODE = ele instanceof Text;
            if (IS_TEXT_NODE)
                element.appendChild(ele);

            if (this.IS_BINDING)
                return new (IS_TEXT_NODE ? TextNodeIO : DataNodeIO)(scope, this.data.bind(scope, null, pinned), ele, this.data.exprb);
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

    Object.assign(BaseComponent.prototype,d$1.prototype);
    BaseComponent.prototype.mount = d$1.prototype.nonAsyncMount;

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

    		super(env, "style", children, attribs, presets);	
    	}

    	get data(){return this.children[0]}

    	finalize(){return this}
    	render(){}
    	mount(element, scope, presets, slots, pinned){
    		scope.css.push(this.data);
    	}
    }

    class v extends ElementNode{
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
    	}
    	
    	loadAST(){/*intentional*/return;}
    		
    	loadURL(){/*intentional*/return;}
    }

    //import Plugin from "./../plugin.js";

    function processWickupChildren(children, env, lex) {

        let PREVIOUS_NODE = null;

        if (children.length > 1) {
            for (let i = 0; i < children.length; i++) {
                let node = children[i];
                //If meta is true, then a wickup node was created. Use the tag name to determine the next course of action. 
                const tag = node.tag;
                const meta = node.wickup;

                if (meta) {
                    switch (tag) {
                        case "blockquote":
                            node.wickup = false;
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
                                if (node2.tag === "text" && node2.IS_WHITESPACE) {
                                    continue;
                                }
                            }
                        }
                    }
                }

                PREVIOUS_NODE = node;
            }
            PREVIOUS_NODE = null;
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
                        if ((node.tag !== "text") || (!node.IS_WHITESPACE)) {
          
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
                                            if (node2.tag == "text" && node2.IS_WHITESPACE) {
                                                children.splice(i + 1, 1);
                                                //i--;
                                            }

                                        }

                                        children.splice(i, 1);
                                        i--;

                                        node = PREVIOUS_NODE;
                                        break;
                                }
                        } else {
                            const node2 = children[i + 1];
                            if (node2) {
                                if (node2.tag !== "text" || !node2.IS_WHITESPACE) {
                                    continue;
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
        env.off = lex.off;

        const
            FULL = !!children;

        attribs = attribs || [];
        children = (Array.isArray(children)) ? children : children ? [children] : [];

        if (children) processWickupChildren(children, env, lex);

        const presets = env.presets;

        let node = null,
            Constructor = null,
            USE_PENDING_LOAD = "";

        switch (tag) {
            case "text":
                break;
            case "filter":
            case "f":
                Constructor = fltr;
                break;
            case "a":
                Constructor = a;
                break;
                /** void elements **/
            case "template":
                Constructor = v;
                break;
            case "css":
            case "style":
                Constructor = sty;
                break;
            case "script":
            case "js":
                Constructor = ScriptNode;
                break;
            case "svg":
            case "path":
                Constructor = svg;
                break;
            case "container":
                Constructor = ctr;
                break;
            case "scope":
                Constructor = scp;
                break;
            case "slot":
                Constructor = slt;
                break;
            case "link":
            case "import":
                Constructor = Import;
                break;
                //Elements that should not be parsed for binding points.
            case "pre":
                Constructor = pre;
                break;
            case "img":
                USE_PENDING_LOAD = "src";
                /* intentional */
            case "code":
            default:
                Constructor = ElementNode;
                break;
        }

        node = new Constructor(env, tag, children, attribs, presets, USE_PENDING_LOAD);

        node.wickup = meta || false;

        node.SINGLE = !FULL;


        return node;
    }

    //import EventIO from "../component/io/event_io.js"

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

                if (this.name.slice(0, 2) == "on"){
                    this.io_constr = EventIO;
                }

                else

                if (this.name == "value" && (tag == "input" || tag == "textarea"))
                    this.io_constr = InputIO;
            }

        }

        bind(element, scope, pinned) {
            if (this.RENDER)
                if (!this.isBINDING)

                {   
                    if(this.name == "class")
                       this.value.split(" ").map(c => c ? element.classList.add(c) : {});
                    else    
                        element.setAttribute(this.name, this.value);
                }

                else 

                {
                    const bind = this.value.bind(scope, pinned);
                    new this.io_constr(scope, this, bind, this.name, element);
                }
        }
    }

    class js_wick_node{

    	constructor(element){

    		this.node = element;

    		this.root = true;
    		
    		this._id = "comp"+((Math.random()*1236584)|0);

    		var presets = this.node.presets;
    		
    		this.node.presets.components[this._id] = this.node;
    	}

    	* traverseDepthFirst(){
    		yield this;
    	}


    	getRootIds(ids, closure) {
    		ids.add("wickNodeExpression");	
    	}

    	get name(){
    		return "wickNodeExpression";
    	}

    	get type(){
    		return types$1.identifier;
    	}

    	get val() { return "wickNodeExpression" }

    	render(){
    		return `wickNodeExpression(this,"${this._id}")`;
    	}
    }

    //*


    function create_ordered_list(sym, offset = 0, level = -1, env, lex) {

        for (let i = offset; i < sym.length; i++) {
            const s = sym[i],
                lvl = (s.lvl) ? s.lvl.length : 0,
                li = s.li;

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

    const env$1 = {
        table: {},
        ASI: true,
        functions: {
            //HTML
            element_selector: es,
            attribute: Attribute,
            wick_binding: Binding,
            text: TextNode,
            js_wick_node:js_wick_node,

            //CSS
            compoundSelector,
            comboSelector: combination_selector_part,
            selector,
            idSelector,
            classSelector,
            typeselector: type_selector_part,
            attribSelector,
            pseudoClassSelector,
            pseudoElementSelector,
            parseDeclaration,
            stylesheet,
            stylerule,
            ruleset,

    //*        //JS
            switch_statement,
            script,
            module: return_statement$1,
            empty_statement,
            break_statement,
            case_statement,
            default_case_statement,
            continue_statement,
            import_declaration,
            import_clause,
            variable_statement: variable_declaration,
            throw_statement,
            default_import,
            name_space_import,
            named_imports,
            import_specifier,
            export_declaration,
            export_clause,
            export_specifier,
            parenthasized: argument_list,
            add_expression,
            and_expression,
            array_literal,
            arrow_function_declaration,
            assignment_expression,
            await_expression,
            bit_and_expression: bitwise_and_espression,
            bit_or_expression: bitwise_or_espression,
            bit_xor_expression: bitwise_xor_espression,
            label_statement,
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
            argument_list: argument_list$1,
            arrow: arrow_function_declaration,
    //*/
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
                if (lex.tx == "//" || lex.tx == "/*") {
                    if (lex.tx == "//")
                        while (!lex.END && lex.ty !== lex.types.nl)
                            lex.next();

                    if (lex.tx == "/*")
                        while (!lex.END && lex.tx !== "*/")
                            lex.next();

                    lex.next();

                    return lu(lex);
                }

                /*USED for ASI*/
                if (env.ASI && lex.tx !== ")" && !lex.END) {

                    if (lex.tx == "</") // As in "<script> script body => (</)script>"
                        return lu({ tx: ";" });

                    let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

                    while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                        prv_lex.next();
                        if (prv_lex.ty == prv_lex.types.nl)
                            ENCOUNTERED_END_CHAR = true;
                    }

                    if (ENCOUNTERED_END_CHAR) {
                        lex.tl = 0;
                        return lu({ tx: ";" });
                    }
                }

                if (lex.END) {
                    lex.tl = 0;
                    return lu({ tx: ";" });
                }
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

                        var url, IS_URL = (
                            component_data[0] !== "<" &&
                            component_data[0] !== " "
                        );

                        if (IS_URL && (url = URL.resolveRelative(component_data, ""))) {
                            try {
                                string_data = await url.fetchText();
                            } catch (e) {
                                console.log(e);
                            }
                        }

                        break;

                    case "object":
                        if (component_data instanceof URL) {
                            string_data = await url.fetchText();
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

                const compiler_env = new CompilerEnvironment(presets, env$1);

                try {

                    return await (new Promise(res => {
                        compiler_env.pending++;


                        compiler_env.pendingResolvedFunction = () => { res(ast); };

                        ast = parser(whind$1(string_data), compiler_env);

                        compiler_env.resolve();
                    }));

                } catch (e) {
                    throw error(error.COMPONENT_PARSE_FAILURE, e, compiler_env);
                }
            },


            // This is a variadic function that accepts objects, string, and urls, 
            //  and compiles data from the argument sources into a wick component. 
            Component = function(...data) {
                // The presets object provides global values to this component
                // and all its derivatives and descendents. 
                let presets = default_presets;

                if (data.length > 1) {
                    presets = (data[1] instanceof Presets) ? data[1] : new Presets(data[1]);
                }


                if (data.length === 0)
                    throw new Error("This function requires arguments. Please Refere to wick docs on what arguments may be passed to this function.");

                const component_data = data[0];


                // If this function is an operand of the new operator, run an alternative 
                // compiler on the calgling object.
                if (new.target) {

                    this.ast = null;

                    this.READY = false;

                    this.presets = data[1] || default_presets;

                    //Reference to the component name. Used with the Web Component API
                    this.name = "";

                    const extrascripts = [];

                    this.pending = ((async () => {

                        const ast = await compileAST(component_data, presets);

                        ast.children.push(...extrascripts);

                        this.READY = true;
                        this.ast = ast;
                        this.ast.finalize();

                        if (!this.name)
                            this.name = this.ast.getAttrib("component").value || "undefined-component";

                        if (this.__pending) {
                            this.__pending.forEach(e => e[3](this.mount(...e.slice(0, 3))));
                            this.__pending = null;
                        }

                        return this;
                    })());

                    if (this.constructor.prototype !== Component.prototype) {

                        //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                        for (const a of Object.getOwnPropertyNames(this.constructor.prototype)) {
                            if (a == "constructor") continue;

                            const r = this.constructor.prototype[a];

                            if (typeof r == "function") {

                                //extract and process function information. 
                                const c_env = new CompilerEnvironment(presets, env$1),
                                    js_ast = parser(whind$1("function " + r.toString().trim() + ";"), c_env),
                                    func_ast = JS.getFirst(js_ast, types$1.function_declaration);
                                    
                                //const HAS_CLOSURE = (ids.filter(a => !args.includes(a))).length > 0;

                                const binding = new Binding([null, func_ast.id], { presets, start: 0 }, whind$1("ddddd"));
                                const attrib = new Attribute(["on", null, binding], presets);
                                const stmt = func_ast.body;

                                let script = new ScriptNode({}, null, stmt, [attrib], presets);

                                script.finalize();

                                extrascripts.push(script);
                            }
                        }
                    }
                } else {
                    const comp = new Component(...data);

                    return comp;
                }
            };

    Component.prototype = d$1.prototype;

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
    wick.presets = d=>new Presets(d);
    wick.astCompiler = function(string){
    	return parser(whind$1(string), CompilerEnvironment);
    };

    return wick;

}());
