var wick = (function (js) {
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
        symbols = ["</","```","``","{{","{{{","}}}","}}","===","---","||","^=","$=","*=","<=","...","<",">",">=","==","!=","!==","**","++","--","<<",">>",">>>","&&","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>","//","/*"],

        /* Goto lookup maps */
        gt0 = [0,-1,1,5,-3,7,-166,3,12,13,16,15,14,17,18,-10,19,-9,20,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,2,4,-1,6,-1,10,9],
    gt1 = [0,-6,135,-339,134,-1,10,9],
    gt2 = [0,-3,137,-346,142,-8,141,147,-3,146],
    gt3 = [0,-349,166],
    gt4 = [0,-198,179,178,169,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,176,-7,45,106,-4,104,81,177,-7,42,41,168,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,170,-1,10,9],
    gt5 = [0,-176,181,-2,17,18,-10,19,-9,20,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt6 = [0,-181,183,185,186,-2,187,-2,184,188,-138,192,-6,189,84,86,-3,85],
    gt7 = [0,-194,194,-8,196,126,-30,195,-2,127,131,-3,129,-15,125],
    gt8 = [0,-296,202],
    gt9 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,242,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt10 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,250,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt11 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,251,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt12 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,252,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt13 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,253,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt14 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,254,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt15 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,255,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt16 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,256,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt17 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,257,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt18 = [0,-278,259],
    gt19 = [0,-278,264],
    gt20 = [0,-242,80,248,-14,81,249,-11,265,266,75,76,102,-6,74,-1,172,-6,171,-20,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt21 = [0,-339,271,269,270],
    gt22 = [0,-325,282,280],
    gt23 = [0,-327,292,290],
    gt24 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,301,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt25 = [0,-278,306],
    gt26 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,307,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt27 = [0,-228,309],
    gt28 = [0,-236,311,312,-75,314,316,317,-19,313,315,84,86,-3,85],
    gt29 = [0,-202,321,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt30 = [0,-333,326,-2,328,84,86,-3,85],
    gt31 = [0,-333,329,-2,328,84,86,-3,85],
    gt32 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,331,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt33 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,334,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt34 = [0,-207,335],
    gt35 = [0,-260,338,339,-73,337,315,84,86,-3,85],
    gt36 = [0,-335,342,315,84,86,-3,85],
    gt37 = [0,-240,344,345,-71,347,316,317,-19,346,315,84,86,-3,85],
    gt38 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,348,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt39 = [0,-355,349,350,351,-2,147,-3,354],
    gt40 = [0,-355,355,350,351,-2,147,-3,354],
    gt41 = [0,-355,357,350,351,-2,147,-3,354],
    gt42 = [0,-355,359,350,351,-2,147,-3,354],
    gt43 = [0,-355,361,350,351,-2,147,-3,354],
    gt44 = [0,-355,364,350,351,-2,147,-3,354],
    gt45 = [0,-365,367,-1,368],
    gt46 = [0,-361,379,377,378],
    gt47 = [0,-350,142,-8,141,147,-3,146],
    gt48 = [0,-198,179,178,169,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,176,-7,45,106,-4,104,81,177,-5,400,-1,42,41,168,46,70,72,75,76,102,71,103,-4,74,390,172,398,402,405,406,399,-1,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,395,396,91,90,108,393,107,83,394,86,-3,85,-3,170,-1,10,9],
    gt49 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,407,408,411,410,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt50 = [0,-198,414,-2,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt51 = [0,-198,179,178,169,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt52 = [0,-187,415],
    gt53 = [0,-184,423,420,-2,424,-1,425,-145,426,84,86,-3,85],
    gt54 = [0,-187,427],
    gt55 = [0,-187,428],
    gt56 = [0,-204,430,-37,80,176,-7,45,106,-4,104,81,431,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,432,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt57 = [0,-192,436,433,-1,437,-140,438,84,86,-3,85],
    gt58 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,439,-2,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt59 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,440,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt60 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,441,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt61 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,442,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt62 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-7,443,49,50,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt63 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-8,444,50,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt64 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-9,445,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt65 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-10,446,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt66 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-11,447,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt67 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,448,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt68 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,449,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt69 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,450,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt70 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,451,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt71 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,452,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt72 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,453,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt73 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,454,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt74 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,455,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt75 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,456,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt76 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,457,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt77 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,458,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt78 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,459,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt79 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,460,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt80 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-15,461,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt81 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-15,462,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt82 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,463,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt83 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,464,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt84 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,465,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt85 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,466,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt86 = [0,-242,80,248,-7,45,106,-4,104,81,249,-5,400,-1,42,41,348,46,70,72,75,76,102,71,103,-4,74,390,172,398,402,405,406,399,-1,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,395,396,91,90,-1,393,107,303,394,86,-3,85,-3,170,-1,10,9],
    gt87 = [0,-337,467,86,-3,85],
    gt88 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,468,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt89 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-1,473,472,469,74,-1,172,-6,171,-3,474,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt90 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,476,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt91 = [0,-337,477,86,-3,85],
    gt92 = [0,-278,478],
    gt93 = [0,-339,481,-1,480],
    gt94 = [0,-325,483],
    gt95 = [0,-327,485],
    gt96 = [0,-313,489,316,317,-19,488,315,84,86,-3,85],
    gt97 = [0,-337,490,86,-3,85],
    gt98 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,491,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt99 = [0,-242,80,248,-7,45,106,492,-3,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-8,171,-3,493,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-5,10,9],
    gt100 = [0,-202,496,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-1,495,37,-3,38,28,-6,80,497,-7,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt101 = [0,-290,500],
    gt102 = [0,-290,502],
    gt103 = [0,-286,509,405,406,-27,504,505,-2,507,-1,508,-6,511,512,-4,510,315,394,86,-3,85],
    gt104 = [0,-293,515,-19,522,316,317,-2,517,519,-1,520,521,516,-11,510,315,84,86,-3,85],
    gt105 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,523,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt106 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,525,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt107 = [0,-211,526,528,530,-1,535,-22,527,534,-2,80,248,-7,45,106,-4,104,81,249,-7,42,41,531,533,70,72,75,76,102,71,103,-4,74,-1,172,-10,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt108 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,537,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt109 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,541,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt110 = [0,-231,543,544],
    gt111 = [0,-260,547,339],
    gt112 = [0,-262,549,551,552,553,-20,556,405,406,-40,511,512,-6,557,86,-3,85],
    gt113 = [0,-242,80,248,-13,104,81,249,-10,558,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-20,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt114 = [0,-245,560,563,562,565,-64,522,316,317,-5,566,521,564,-11,510,315,84,86,-3,85],
    gt115 = [0,-290,569],
    gt116 = [0,-290,570],
    gt117 = [0,-356,573,351,-2,147,-3,354],
    gt118 = [0,-360,147,-3,575],
    gt119 = [0,-360,147,-3,577],
    gt120 = [0,-58,580,585,583,588,584,582,591,589,-2,590,-5,586,-1,618,-4,619,-10,617,-44,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt121 = [0,-196,621,623,179,178,624,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt122 = [0,-196,626,623,179,178,624,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt123 = [0,-7,642,655,654,635,-1,639,-25,641,-6,644,-1,645,-1,649,-1,651,646,-295,638,637,-1,633,632,630,634,-10,643,636,368],
    gt124 = [0,-367,663],
    gt125 = [0,-361,666,-1,665],
    gt126 = [0,-196,667,623,179,178,624,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt127 = [0,-290,672],
    gt128 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,407,408,411,673,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt129 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,674,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt130 = [0,-286,677,405,406,-40,511,512,-6,557,86,-3,85],
    gt131 = [0,-286,678,405,406,-40,511,512,-6,557,86,-3,85],
    gt132 = [0,-293,679],
    gt133 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-2,684,683,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt134 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,686,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt135 = [0,-189,688,-139,192],
    gt136 = [0,-183,689,-2,690],
    gt137 = [0,-190,691,-145,189,84,86,-3,85],
    gt138 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,708,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt139 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-6,715,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt140 = [0,-237,717,-75,314,316,317,-19,313,315,84,86,-3,85],
    gt141 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,718,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt142 = [0,-335,722,315,84,86,-3,85],
    gt143 = [0,-290,724],
    gt144 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,725,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt145 = [0,-313,522,316,317,-5,728,521,726,-11,510,315,84,86,-3,85],
    gt146 = [0,-313,733,316,317,-19,732,315,84,86,-3,85],
    gt147 = [0,-290,734],
    gt148 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,739,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt149 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,742,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt150 = [0,-216,746,-19,745,312,-75,748,316,317,-19,747,315,84,86,-3,85],
    gt151 = [0,-216,749,-23,344,345,-71,751,316,317,-19,750,315,84,86,-3,85],
    gt152 = [0,-213,752,-1,755,-23,756,-2,80,248,-13,104,81,249,-10,753,70,72,75,76,102,71,103,-4,74,-1,172,-27,245,-11,79,-4,92,93,91,90,-1,78,-1,247,84,86,-3,85,-3,170,-1,10,9],
    gt153 = [0,-232,759],
    gt154 = [0,-207,761],
    gt155 = [0,-262,762,551,552,553,-20,556,405,406,-40,511,512,-6,557,86,-3,85],
    gt156 = [0,-264,765,553,-20,556,405,406,-40,511,512,-6,557,86,-3,85],
    gt157 = [0,-265,766,-20,556,405,406,-40,511,512,-6,557,86,-3,85],
    gt158 = [0,-245,767,563,562,565,-64,522,316,317,-5,566,521,564,-11,510,315,84,86,-3,85],
    gt159 = [0,-241,772,-71,347,316,317,-19,346,315,84,86,-3,85],
    gt160 = [0,-5,774],
    gt161 = [0,-7,777,655,654,-348,776,-1,147,-3,780,-3,779],
    gt162 = [0,-58,784,585,583,588,584,582,591,589,-2,590,-5,586,-1,618,-4,619,-10,617,-44,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt163 = [0,-59,789,-1,588,788,-1,591,589,-2,590,-5,586,-1,618,-4,619,-10,617,-44,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt164 = [0,-61,790,-2,591,589,-2,590,-5,791,-1,618,-4,619,-10,617,-44,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt165 = [0,-68,801,-5,791,-1,618,-4,619,-10,617,-65,802,800,-2,799,-1,803,-3,604,-3,804],
    gt166 = [0,-135,806,805,-1,596,-1,615,597,808,807,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt167 = [0,-138,813,-1,615,814,-6,606,607,608,-1,609,-3,610,616],
    gt168 = [0,-140,615,815,-6,816,607,608,-1,609,-3,610,616],
    gt169 = [0,-140,817,-16,616],
    gt170 = [0,-168,604,-3,820],
    gt171 = [0,-169,824,822,823],
    gt172 = [0,-168,604,-3,830],
    gt173 = [0,-168,604,-3,831],
    gt174 = [0,-145,602,833,832,-20,604,-3,601],
    gt175 = [0,-156,836,-11,604,-3,835],
    gt176 = [0,-139,838,-16,839],
    gt177 = [0,-196,843,623,179,178,624,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt178 = [0,-196,847,623,179,178,624,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt179 = [0,-7,642,655,654,635,-1,639,-25,641,-6,644,-1,645,-1,649,-1,651,646,-295,638,637,-1,633,632,851,634,-10,643,636,368],
    gt180 = [0,-359,855,147,-3,146],
    gt181 = [0,-7,642,655,654,635,-1,639,-25,641,-6,644,-1,645,-1,649,-1,651,646,-295,638,637,-1,856,-2,634,-10,643,636,368],
    gt182 = [0,-7,642,655,654,-3,857,-1,860,-4,877,865,-2,861,868,867,-3,862,873,872,871,-3,864,641,-4,863,-1,644,-1,645,-1,649,-1,651,646,-296,859,-15,643,858,368],
    gt183 = [0,-11,880],
    gt184 = [0,-7,777,655,654,-348,882,-1,147,-3,780,-3,779],
    gt185 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,883,651,646,-312,643,884,368],
    gt186 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,886,651,646,-312,643,884,368],
    gt187 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,887,651,646,-189,80,248,-7,45,106,-4,104,81,249,-7,42,41,348,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9,-15,643,884,368],
    gt188 = [0,-55,894,893,895],
    gt189 = [0,-350,908],
    gt190 = [0,-265,400,-19,912,402,405,406,399,-39,511,512,-3,913,-1,247,394,86,-3,85],
    gt191 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,915,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt192 = [0,-244,916,917,563,562,565,-64,522,316,317,-5,566,521,564,-11,510,315,84,86,-3,85],
    gt193 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-1,923,922,921,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt194 = [0,-184,925,-3,424,-1,425,-145,426,84,86,-3,85],
    gt195 = [0,-190,926,-145,189,84,86,-3,85],
    gt196 = [0,-192,928,-2,437,-140,438,84,86,-3,85],
    gt197 = [0,-336,929,84,86,-3,85],
    gt198 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,930,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt199 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-1,932,-2,74,-1,172,-6,171,-3,474,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt200 = [0,-313,934,316,317,-19,933,315,84,86,-3,85],
    gt201 = [0,-286,509,405,406,-27,936,-3,938,-1,508,-6,511,512,-4,510,315,394,86,-3,85],
    gt202 = [0,-313,522,316,317,-5,939,521,-12,510,315,84,86,-3,85],
    gt203 = [0,-293,942,-19,522,316,317,-3,944,-1,520,521,943,-11,510,315,84,86,-3,85],
    gt204 = [0,-202,945,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt205 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,946,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt206 = [0,-202,947,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt207 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,948,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt208 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,951,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt209 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,953,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt210 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,955,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt211 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,957,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt212 = [0,-216,959,-96,961,316,317,-19,960,315,84,86,-3,85],
    gt213 = [0,-216,749,-96,961,316,317,-19,960,315,84,86,-3,85],
    gt214 = [0,-223,962],
    gt215 = [0,-202,964,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt216 = [0,-233,965,-79,967,316,317,-19,966,315,84,86,-3,85],
    gt217 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,972,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt218 = [0,-247,975,976,-64,522,316,317,-5,566,521,564,-11,510,315,84,86,-3,85],
    gt219 = [0,-5,977],
    gt220 = [0,-4,978],
    gt221 = [0,-7,981,655,654,-359,984,983,982,985],
    gt222 = [0,-369,984,983,993,985],
    gt223 = [0,-69,998,999,-58,1002,-4,1001],
    gt224 = [0,-91,1006,-1,1009,-1,1007,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt225 = [0,-77,1022,-56,1024],
    gt226 = [0,-86,1025,1027,1029,1032,1031,-21,1030,-55,604,-3,1034],
    gt227 = [0,-68,801,-5,791,-1,618,-4,619,-10,617,-65,802,800,-2,1035,-1,803,-3,604,-3,804],
    gt228 = [0,-137,1036,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt229 = [0,-68,1039,-5,791,-1,618,-4,619,-10,617,-67,1041,1040,-2,1042,-3,604,-3,804],
    gt230 = [0,-135,1045,-2,596,-1,615,597,808,807,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt231 = [0,-138,596,-1,615,597,1046,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt232 = [0,-140,615,1047,-6,816,607,608,-1,609,-3,610,616],
    gt233 = [0,-156,836],
    gt234 = [0,-169,1049,-1,1048],
    gt235 = [0,-153,1051],
    gt236 = [0,-155,1057],
    gt237 = [0,-168,604,-3,835],
    gt238 = [0,-156,1059],
    gt239 = [0,-359,1069,147,-3,146],
    gt240 = [0,-359,1070,147,-3,146],
    gt241 = [0,-7,642,655,654,-12,1074,1072,-14,641,-6,644,-1,645,-1,649,-1,651,646,-296,1076,-15,643,1075,368],
    gt242 = [0,-7,642,655,654,-11,865,-2,1084,1079,-1,1077,1081,1078,-8,641,-6,644,-1,645,-1,649,-1,651,646,-296,1083,-15,643,1082,368],
    gt243 = [0,-7,642,655,654,-11,865,-2,1095,-6,873,1090,-1,1088,1092,1089,-1,641,-6,644,-1,645,-1,649,-1,651,646,-296,1094,-15,643,1093,368],
    gt244 = [0,-7,642,655,654,-4,1097,-23,641,-6,644,-1,645,-1,649,-1,651,646,-296,1099,-15,643,1098,368],
    gt245 = [0,-16,1101,1100],
    gt246 = [0,-18,1105,1104],
    gt247 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,-1,651,646,-312,643,1111,368],
    gt248 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,887,651,646,-312,643,884,368],
    gt249 = [0,-7,777,655,654,-232,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,407,408,411,410,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9,-8,882,-1,147,-3,780,-3,779],
    gt250 = [0,-7,642,655,654,-28,641,-6,644,-1,645,-1,649,887,651,646,-189,80,248,-7,45,106,-4,104,81,249,-5,400,-1,42,41,348,46,70,72,75,76,102,71,103,-4,74,390,172,398,402,405,406,399,-1,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,395,396,91,90,-1,393,107,303,394,86,-3,85,-3,170,-1,10,9,-15,643,884,368],
    gt251 = [0,-57,1120],
    gt252 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1121,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt253 = [0,-350,1122],
    gt254 = [0,-248,1128,-17,1127,-46,522,316,317,-5,566,521,-12,510,315,84,86,-3,85],
    gt255 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,1129,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt256 = [0,-313,522,316,317,-5,728,521,1134,-11,510,315,84,86,-3,85],
    gt257 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1139,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt258 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1141,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt259 = [0,-202,1144,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt260 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1146,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt261 = [0,-202,1149,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt262 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1151,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt263 = [0,-224,1153,1155,1154],
    gt264 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1160,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt265 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1162,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt266 = [0,-369,1168,-2,985],
    gt267 = [0,-70,1173,-58,1002,-4,1001],
    gt268 = [0,-72,1175,-18,1176,-1,1009,-1,1007,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt269 = [0,-130,1179,1178],
    gt270 = [0,-132,1182,1181],
    gt271 = [0,-124,1187,-43,604,-3,1188],
    gt272 = [0,-94,1189],
    gt273 = [0,-99,1193,1191,-1,1195,1192],
    gt274 = [0,-105,1197,-1,1018,-4,1019,-55,604,-3,1034],
    gt275 = [0,-96,1011,1198,1013,-2,1014,-2,1012,1015,1199,1018,-4,1019,1202,-6,1204,1206,1203,1205,-1,1209,-2,1208,-39,604,-3,1200],
    gt276 = [0,-87,1213,1029,1032,1031,-21,1030,-55,604,-3,1034],
    gt277 = [0,-82,1216,1214,1218,1215],
    gt278 = [0,-86,1220,1027,1029,1032,1031,-21,1030,-51,1221,-3,604,-3,1222],
    gt279 = [0,-158,1228,-5,803,-3,604,-3,804],
    gt280 = [0,-165,1232,1230,1229],
    gt281 = [0,-151,1236,-16,604,-3,1237],
    gt282 = [0,-137,1240,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt283 = [0,-359,1247,147,-3,146],
    gt284 = [0,-7,642,655,654,-12,1250,-15,641,-6,644,-1,645,-1,649,-1,651,646,-296,1076,-15,643,1075,368],
    gt285 = [0,-7,642,655,654,-11,865,-2,1084,-3,1081,1251,-8,641,-6,644,-1,645,-1,649,-1,651,646,-296,1083,-15,643,1082,368],
    gt286 = [0,-7,642,655,654,-11,865,-2,1084,-3,1253,-9,641,-6,644,-1,645,-1,649,-1,651,646,-296,1083,-15,643,1082,368],
    gt287 = [0,-39,1259,1258,1256,1255,-324,1260],
    gt288 = [0,-7,642,655,654,-11,865,-2,1095,-10,1092,1261,-1,641,-6,644,-1,645,-1,649,-1,651,646,-296,1094,-15,643,1093,368],
    gt289 = [0,-7,642,655,654,-11,865,-2,1095,-10,1263,-2,641,-6,644,-1,645,-1,649,-1,651,646,-296,1094,-15,643,1093,368],
    gt290 = [0,-16,1264],
    gt291 = [0,-18,1265],
    gt292 = [0,-7,981,655,654,-315,282,280,-42,984,983,982,985],
    gt293 = [0,-327,292,290,-40,984,983,993,985],
    gt294 = [0,-7,777,655,654,-232,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,407,408,411,673,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9,-8,882,-1,147,-3,780,-3,779],
    gt295 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1279,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt296 = [0,-202,1286,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt297 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1288,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt298 = [0,-202,1291,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt299 = [0,-202,1293,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt300 = [0,-202,1294,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt301 = [0,-202,1295,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt302 = [0,-202,1297,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt303 = [0,-202,1298,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt304 = [0,-202,1299,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt305 = [0,-225,1303,1301],
    gt306 = [0,-224,1304,1155],
    gt307 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1306,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt308 = [0,-207,1308],
    gt309 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1309,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt310 = [0,-72,1314,-18,1315,-1,1009,-1,1007,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt311 = [0,-91,1316,-1,1009,-1,1007,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt312 = [0,-130,1319],
    gt313 = [0,-132,1321],
    gt314 = [0,-134,1322],
    gt315 = [0,-64,591,1325,1324,1323,-69,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt316 = [0,-93,1009,-1,1326,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt317 = [0,-94,1327],
    gt318 = [0,-96,1328,-1,1013,-2,1014,-3,1329,-1,1018,-4,1019,-55,604,-3,1034],
    gt319 = [0,-99,1330],
    gt320 = [0,-102,1331],
    gt321 = [0,-105,1332,-1,1018,-4,1019,-55,604,-3,1034],
    gt322 = [0,-105,1333,-1,1018,-4,1019,-55,604,-3,1034],
    gt323 = [0,-110,1338,1336],
    gt324 = [0,-114,1342],
    gt325 = [0,-115,1347,1348,-1,1349],
    gt326 = [0,-127,1354],
    gt327 = [0,-108,1361,1359],
    gt328 = [0,-75,1364,-2,1366,1365,1367,-45,1370],
    gt329 = [0,-64,591,1325,1324,1372,-69,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt330 = [0,-82,1373],
    gt331 = [0,-84,1374],
    gt332 = [0,-87,1375,1029,1032,1031,-21,1030,-55,604,-3,1034],
    gt333 = [0,-87,1376,1029,1032,1031,-21,1030,-55,604,-3,1034],
    gt334 = [0,-137,1379,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt335 = [0,-160,1381,-3,1042,-3,604,-3,804],
    gt336 = [0,-163,1382,-1,1232,1230,1383],
    gt337 = [0,-165,1385],
    gt338 = [0,-165,1232,1230,1386],
    gt339 = [0,-154,1387],
    gt340 = [0,-39,1259,1258,1256,1395,-324,1260],
    gt341 = [0,-39,1259,1258,1397,-325,1260],
    gt342 = [0,-39,1259,1398,-326,1260],
    gt343 = [0,-39,1399,-327,1260],
    gt344 = [0,-7,642,655,654,-28,641,-5,1400,644,-1,645,-1,649,-1,651,646,-296,1402,-15,643,1401,368],
    gt345 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1406,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt346 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1407,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt347 = [0,-202,1410,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt348 = [0,-202,1411,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt349 = [0,-202,1412,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt350 = [0,-202,1413,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt351 = [0,-202,1414,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt352 = [0,-225,1415],
    gt353 = [0,-225,1303],
    gt354 = [0,-198,179,178,1419,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt355 = [0,-91,1421,-1,1009,-1,1007,1011,1008,1013,-2,1014,-2,1012,1015,-1,1018,-4,1019,-11,1010,-43,604,-3,1020],
    gt356 = [0,-71,1422,-14,1423,1027,1029,1032,1031,-21,1030,-51,1424,-3,604,-3,1425],
    gt357 = [0,-64,591,1428,-71,593,596,-1,615,597,594,-1,595,602,599,598,606,607,608,-1,609,-3,610,616,-10,604,-3,601],
    gt358 = [0,-99,1193,1191],
    gt359 = [0,-110,1430],
    gt360 = [0,-121,1431,-1,1432,-1,1209,-2,1208,-39,604,-3,1433],
    gt361 = [0,-121,1434,-1,1432,-1,1209,-2,1208,-39,604,-3,1433],
    gt362 = [0,-123,1436,-44,604,-3,1433],
    gt363 = [0,-168,604,-3,1437],
    gt364 = [0,-168,604,-3,1438],
    gt365 = [0,-108,1442],
    gt366 = [0,-78,1366,1444,1367,-45,1370],
    gt367 = [0,-165,1232,1230,1383],
    gt368 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1455,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-3,170,-1,10,9],
    gt369 = [0,-198,179,178,716,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1459,974,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt370 = [0,-202,1460,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt371 = [0,-198,179,178,1462,180,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-5,10,9],
    gt372 = [0,-117,1464],
    gt373 = [0,-119,1466],
    gt374 = [0,-68,801,-5,791,-1,618,-4,619,-10,617,-65,802,800,-2,1469,-1,803,-3,604,-3,804],
    gt375 = [0,-80,1470,-45,1370],
    gt376 = [0,-121,1474,-1,1432,-1,1209,-2,1208,-39,604,-3,1433],
    gt377 = [0,-121,1476,-1,1432,-1,1209,-2,1208,-39,604,-3,1433],

        // State action lookup maps
        sm0=[0,-1,1,2,-1,0,-4,0,-5,3,-3,4,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-1,12,-1,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm1=[0,46,-3,0,-4,0],
    sm2=[0,47,-3,0,-4,0],
    sm3=[0,48,-3,0,-4,0,-4,-1],
    sm4=[0,-4,0,-4,0,-9,4,-31,49],
    sm5=[0,50,-3,0,-4,0,-4,-1],
    sm6=[0,-4,0,-4,0,-9,51,-31,51],
    sm7=[0,-2,52,-1,0,-4,0,-5,53,54,-139,55,-9,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75],
    sm8=[0,76,76,76,-1,0,-4,0,-4,-1,76,-3,76,76,76,76,-2,76,76,-3,76,-5,76,76,-12,76,76,-1,76,-14,76,76,-1,76,-4,76,76,76,76,76,76,76,-1,76,-2,76,-2,76,76,76,-1,76,-1,76,76,-1,76,76,-1,76,76,76,76,76,76,76,76,76,76,76,76,-1,76,-2,76,76,-5,76,76,-2,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76],
    sm9=[0,-4,0,-4,0,-4,-1,-4,77,-31,49],
    sm10=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,-14,79,-14,80,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm11=[0,81,-3,0,-4,0,-4,-1],
    sm12=[0,82,-3,0,-4,0,-4,-1],
    sm13=[0,83,-3,0,-4,0,-4,-1],
    sm14=[0,84,1,2,-1,0,-4,0,-4,-1,3,-3,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-1,12,-1,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm15=[0,86,86,86,-1,0,-4,0,-4,-1,86,-3,86,-1,86,-14,86,-14,86,-24,86,86,-9,86,-3,86,86,-1,86,-1,86,86,-1,86,86,-1,86,86,86,86,86,-1,86,86,86,86,86,86,-1,86,-2,86,86,-5,86,86,-2,86,-23,86,86,86,86,86,86,86,86,86,86,86,86],
    sm16=[0,87,87,87,-1,0,-4,0,-4,-1,87,-3,87,-1,87,-14,87,-14,87,-24,87,87,-9,87,-3,87,87,-1,87,-1,87,87,-1,87,87,-1,87,87,87,87,87,-1,87,87,87,87,87,87,-1,87,-2,87,87,-5,87,87,-2,87,-23,87,87,87,87,87,87,87,87,87,87,87,87],
    sm17=[0,88,88,88,-1,0,-4,0,-4,-1,88,-3,88,-1,88,-14,88,-14,88,-24,88,88,-9,88,-3,88,88,-1,88,-1,88,88,-1,88,88,-1,88,88,88,88,88,-1,88,88,88,88,88,88,-1,88,-2,88,88,-5,88,88,-2,88,-23,88,88,88,88,88,88,88,88,88,88,88,88],
    sm18=[0,89,89,89,-1,0,-4,0,-4,-1,89,-3,89,-1,89,-14,89,-14,89,-24,89,89,-9,89,-3,89,89,-1,89,-1,89,89,-1,89,89,-1,89,89,89,89,89,-1,89,89,89,89,89,89,-1,89,-2,89,89,-5,89,89,-2,89,-23,89,89,89,89,89,89,89,89,89,89,89,89],
    sm19=[0,-2,2,-1,0,-4,0,-4,-1,-36,90,-27,91,-12,11,-66,40,41,-3,45],
    sm20=[0,-4,0,-4,0,-4,-1,-36,92,-27,93,-15,94,13,14,-1,15,-2,17,-16,30],
    sm21=[0,95,95,95,-1,0,-4,0,-4,-1,95,-1,95,-1,95,-1,95,-14,95,-14,95,-1,95,-22,95,95,-9,95,-3,95,95,-1,95,95,95,95,-1,95,95,-1,95,95,95,95,95,-1,95,95,95,95,95,95,95,95,-2,95,95,-5,95,95,-2,95,-23,95,95,95,95,95,95,95,95,95,95,95,95],
    sm22=[0,96,96,96,-1,0,-4,0,-4,-1,96,-1,96,-1,96,-1,96,-14,96,-14,96,-1,96,-22,96,96,-9,96,-3,96,96,-1,96,96,96,96,-1,96,96,96,96,96,96,96,96,-1,96,96,96,96,96,96,96,96,-2,96,96,-5,96,96,-2,96,-23,96,96,96,96,96,96,96,96,96,96,96,96],
    sm23=[0,97,97,97,-1,0,-4,0,-4,-1,97,-1,97,-1,97,-1,97,-14,97,-14,97,-1,97,-22,97,97,-9,97,-3,97,97,-1,97,97,97,97,-1,97,97,97,97,97,97,97,97,-1,97,97,97,97,97,97,97,97,-2,97,97,-5,97,97,-2,97,-23,97,97,97,97,97,97,97,97,97,97,97,97],
    sm24=[0,-4,0,-4,0,-4,-1,-72,98],
    sm25=[0,-4,0,-4,0,-4,-1,-7,99,-14,99,-12,100,99,-35,99,-2,99],
    sm26=[0,-4,0,-4,0,-4,-1,-7,101,-14,101,-12,101,101,-35,101,-2,101],
    sm27=[0,-4,0,-4,0,-4,-1,-7,102,-14,102,-12,102,102,-35,102,-2,102],
    sm28=[0,103,103,103,-1,0,-4,0,-4,-1,103,-3,103,-1,103,103,-13,103,103,-12,103,103,-1,103,-22,103,103,-9,103,-2,103,103,103,-1,103,-1,103,103,-1,103,103,-1,103,103,103,103,103,-1,103,103,103,103,103,103,-1,103,-2,103,103,-5,103,103,-2,103,-23,103,103,103,103,103,103,103,103,103,103,103,103],
    sm29=[0,104,104,104,-1,0,-4,0,-4,-1,104,-3,104,104,104,104,-2,105,104,-3,104,-5,104,104,-12,104,104,-1,104,-14,104,104,-1,104,-4,104,104,104,104,104,-1,106,-1,107,-2,104,-2,104,104,104,-1,104,-1,104,104,-1,104,104,-1,104,104,104,104,104,-1,104,104,104,104,104,104,-1,104,-2,104,104,-5,104,104,-2,104,108,109,110,111,112,113,114,115,116,117,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,118,119,104,104,104,104,104,104],
    sm30=[0,120,120,120,-1,0,-4,0,-4,-1,120,-3,120,-1,120,120,-13,120,120,-12,120,120,-1,120,-22,120,120,121,-8,120,-2,120,120,120,-1,120,-1,120,120,-1,120,120,-1,120,120,120,120,120,-1,120,120,120,120,120,120,-1,120,-2,120,120,-5,120,120,-2,120,-10,122,-12,120,120,120,120,120,120,120,120,120,120,120,120],
    sm31=[0,123,123,123,-1,0,-4,0,-4,-1,123,-3,123,-1,123,123,-13,123,123,-12,123,123,-1,123,-22,123,123,123,-8,123,-2,123,123,123,-1,123,-1,123,123,-1,123,123,-1,123,123,123,123,123,-1,123,123,123,123,123,123,-1,123,-2,123,123,-5,123,123,-2,123,-10,123,124,-11,123,123,123,123,123,123,123,123,123,123,123,123],
    sm32=[0,125,125,125,-1,0,-4,0,-4,-1,125,-3,125,-1,125,125,-13,125,125,-12,125,125,-1,125,-22,125,125,125,-1,126,-6,125,-2,125,125,125,-1,125,-1,125,125,-1,125,125,-1,125,125,125,125,125,-1,125,125,125,125,125,125,-1,125,-2,125,125,-5,125,125,-2,125,-10,125,125,-11,125,125,125,125,125,125,125,125,125,125,125,125],
    sm33=[0,127,127,127,-1,0,-4,0,-4,-1,127,-3,127,-1,127,127,-13,127,127,-12,127,127,-1,127,-22,127,127,127,-1,127,-6,127,-2,127,127,127,-1,127,-1,127,127,-1,127,127,-1,127,127,127,127,127,-1,127,127,127,127,127,127,-1,127,-2,127,127,-5,127,127,-2,127,-10,127,127,128,-10,127,127,127,127,127,127,127,127,127,127,127,127],
    sm34=[0,129,129,129,-1,0,-4,0,-4,-1,129,-3,129,-1,129,129,-13,129,129,-12,129,129,-1,129,-22,129,129,129,-1,129,-6,129,-2,129,129,129,-1,129,-1,129,129,-1,129,129,-1,129,129,129,129,129,-1,129,129,129,129,129,129,-1,129,-2,129,129,-5,129,129,-2,129,-10,129,129,129,130,-9,129,129,129,129,129,129,129,129,129,129,129,129],
    sm35=[0,131,131,131,-1,0,-4,0,-4,-1,131,-3,131,-1,131,131,-3,132,-9,131,131,-12,131,131,-1,131,-22,131,131,131,-1,131,-6,131,-2,131,131,131,-1,131,-1,131,131,-1,131,131,-1,131,131,131,131,131,-1,131,131,131,131,131,131,-1,131,-2,131,131,-5,131,131,-2,131,-10,131,131,131,131,133,134,135,-6,131,131,131,131,131,131,131,131,131,131,131,131],
    sm36=[0,136,136,136,-1,0,-4,0,-4,-1,136,-3,137,-1,136,136,-3,136,-3,138,-5,136,136,-12,136,136,-1,136,-14,139,-2,140,-4,136,136,136,-1,136,-6,136,-2,136,136,136,-1,136,-1,136,136,-1,136,136,-1,136,136,136,136,136,-1,136,136,136,136,136,136,-1,136,-2,136,136,-5,136,136,-2,136,-10,136,136,136,136,136,136,136,141,142,-4,136,136,136,136,136,136,136,136,136,136,136,136],
    sm37=[0,143,143,143,-1,0,-4,0,-4,-1,143,-3,143,-1,143,143,-3,143,-3,143,-5,143,143,-12,143,143,-1,143,-14,143,-2,143,-4,143,143,143,-1,143,-6,143,-2,143,143,143,-1,143,-1,143,143,-1,143,143,-1,143,143,143,143,143,-1,143,143,143,143,143,143,-1,143,-2,143,143,-5,143,143,-2,143,-10,143,143,143,143,143,143,143,143,143,144,145,146,-1,143,143,143,143,143,143,143,143,143,143,143,143],
    sm38=[0,147,147,147,-1,0,-4,0,-4,-1,147,-3,147,-1,147,147,-3,147,-3,147,-5,147,147,-12,147,147,-1,147,-14,147,-2,147,-4,148,147,147,-1,147,-6,147,-2,147,149,147,-1,147,-1,147,147,-1,147,147,-1,147,147,147,147,147,-1,147,147,147,147,147,147,-1,147,-2,147,147,-5,147,147,-2,147,-10,147,147,147,147,147,147,147,147,147,147,147,147,-1,147,147,147,147,147,147,147,147,147,147,147,147],
    sm39=[0,150,150,150,-1,0,-4,0,-4,-1,150,-3,150,151,150,150,-3,150,-3,150,-5,150,150,-12,150,150,-1,150,-14,150,152,-1,150,-4,150,150,150,153,150,-6,150,-2,150,150,150,-1,150,-1,150,150,-1,150,150,-1,150,150,150,150,150,-1,150,150,150,150,150,150,-1,150,-2,150,150,-5,150,150,-2,150,-10,150,150,150,150,150,150,150,150,150,150,150,150,-1,150,150,150,150,150,150,150,150,150,150,150,150],
    sm40=[0,154,154,154,-1,0,-4,0,-4,-1,154,-3,154,154,154,154,-3,154,-3,154,-5,154,154,-12,154,154,-1,154,-14,154,154,-1,154,-4,154,154,154,154,154,-6,154,-2,154,154,154,-1,154,-1,154,154,-1,154,154,-1,154,154,154,154,154,-1,154,154,154,154,154,154,-1,154,-2,154,154,-5,154,154,-2,154,-10,154,154,154,154,154,154,154,154,154,154,154,154,-1,154,154,154,154,154,154,154,154,154,154,154,154],
    sm41=[0,155,155,155,-1,0,-4,0,-4,-1,155,-3,155,155,155,155,-3,155,-3,155,-5,155,155,-12,155,155,-1,155,-14,155,155,-1,155,-4,155,155,155,155,155,-6,155,-2,155,155,155,-1,155,-1,155,155,-1,155,155,-1,155,155,155,155,155,-1,155,155,155,155,155,155,-1,155,-2,155,155,-5,155,155,-2,155,-10,155,155,155,155,155,155,155,155,155,155,155,155,-1,155,155,155,155,155,155,155,155,155,155,155,155],
    sm42=[0,156,156,156,-1,0,-4,0,-4,-1,156,-3,156,156,156,156,-3,156,-3,156,-5,156,156,-12,156,156,-1,156,-14,156,156,-1,156,-4,156,156,156,156,156,-6,156,-2,156,156,156,-1,156,-1,156,156,-1,156,156,-1,156,156,156,156,156,-1,156,156,156,156,156,156,-1,156,-2,156,156,-5,156,156,-2,156,-10,156,156,156,156,156,156,156,156,156,156,156,156,157,156,156,156,156,156,156,156,156,156,156,156,156],
    sm43=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm44=[0,156,156,156,-1,0,-4,0,-4,-1,156,-3,156,156,156,156,-3,156,-3,156,-5,156,156,-12,156,156,-1,156,-14,156,156,-1,156,-4,156,156,156,156,156,-6,156,-2,156,156,156,-1,156,-1,156,156,-1,156,156,-1,156,156,156,156,156,-1,156,156,156,156,156,156,-1,156,-2,156,156,-5,156,156,-2,156,-10,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156],
    sm45=[0,159,159,159,-1,0,-4,0,-4,-1,159,-3,159,159,159,159,-2,159,159,-3,159,-5,159,159,-12,159,159,-1,159,-14,159,159,-1,159,-4,159,159,159,159,159,-1,159,-1,159,-2,159,-2,159,159,159,-1,159,-1,159,159,-1,159,159,-1,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,-2,159,159,-5,159,159,-2,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159],
    sm46=[0,159,159,159,-1,0,-4,0,-4,-1,159,-3,159,159,160,159,-2,159,159,-3,159,-5,161,159,-12,159,159,-1,159,-14,159,159,-1,159,-4,159,159,159,159,159,162,159,-1,159,-2,159,-2,159,159,159,-1,159,-1,159,159,-1,159,159,-1,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,-2,159,159,-5,159,159,-2,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159],
    sm47=[0,163,163,163,-1,0,-4,0,-4,-1,163,-3,163,163,160,163,-2,163,163,-3,163,-5,164,163,-12,163,163,-1,163,-14,163,163,-1,163,-4,163,163,163,163,163,165,163,-1,163,-2,163,-2,163,163,163,-1,163,-1,163,163,-1,163,163,-1,163,163,163,163,163,163,163,163,163,163,163,163,-1,163,-2,163,163,-5,163,163,-2,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163],
    sm48=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-29,166,-10,11,-3,13,14,-27,31,167,-2,33,-29,40,41,42,43,44,45],
    sm49=[0,168,168,168,-1,0,-4,0,-4,-1,168,-3,168,168,168,168,-2,168,168,-3,168,-5,168,168,-12,168,168,-1,168,-14,168,168,-1,168,-4,168,168,168,168,168,168,168,-1,168,-2,168,-2,168,168,168,-1,168,-1,168,168,-1,168,168,-1,168,168,168,168,168,168,168,168,168,168,168,168,-1,168,-2,168,168,-5,168,168,-2,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168],
    sm50=[0,169,169,169,-1,0,-4,0,-4,-1,169,-3,169,169,169,169,-2,169,169,-3,169,-5,169,169,-12,169,169,-1,169,-14,169,169,-1,169,-4,169,169,169,169,169,169,169,-1,169,-2,169,-2,169,169,169,-1,169,-1,169,169,-1,169,169,-1,169,169,169,169,169,169,169,169,169,169,169,169,-1,169,-2,169,169,-5,169,169,-2,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169,169],
    sm51=[0,170,170,170,-1,0,-4,0,-4,-1,170,-3,170,170,170,170,-2,170,170,-3,170,-5,170,170,-12,170,170,-1,170,-14,170,170,-1,170,-4,170,170,170,170,170,170,170,-1,170,-2,170,-2,170,170,170,-1,170,-1,170,170,-1,170,170,-1,170,170,170,170,170,170,170,170,170,170,170,170,-1,170,-2,170,170,-5,170,170,-2,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170],
    sm52=[0,170,170,170,-1,0,-4,0,-4,-1,170,-3,170,170,170,170,-2,170,170,-3,170,-5,170,170,-12,170,170,-1,170,-14,170,170,-1,170,-4,170,170,170,170,170,170,170,-1,170,-2,170,-2,170,170,170,-1,170,-1,170,170,-1,170,170,-1,170,170,170,170,170,170,170,170,170,170,170,170,-1,170,-2,170,170,171,-4,170,170,-2,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170],
    sm53=[0,-4,0,-4,0,-4,-1,-4,172,172,172,-3,172,172,-3,172,-5,172,-13,172,172,-1,172,-14,172,172,-1,172,-4,172,-1,172,172,172,172,172,-1,172,-2,172,-2,173,172,-28,174,-9,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,-4,172,172],
    sm54=[0,175,175,175,-1,0,-4,0,-4,-1,175,-3,175,175,175,175,-2,175,175,-3,175,-5,175,175,-12,175,175,-1,175,-4,175,-9,175,175,-1,175,-4,175,175,175,175,175,175,175,-1,175,-2,175,-2,175,175,175,175,175,-1,175,175,-1,175,175,-1,175,175,175,175,175,175,175,175,175,175,175,175,-1,175,-2,175,175,175,175,-3,175,175,-2,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175],
    sm55=[0,176,176,176,-1,0,-4,0,-4,-1,176,-3,176,176,176,176,-2,176,176,-3,176,-5,176,176,-12,176,176,-1,176,-4,176,-9,176,176,-1,176,-4,176,176,176,176,176,176,176,-1,176,-2,176,-2,176,176,176,176,176,-1,176,176,-1,176,176,-1,176,176,176,176,176,176,176,176,176,176,176,176,-1,176,-2,176,176,176,176,-3,176,176,-2,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176,176],
    sm56=[0,177,178,179,-1,180,-4,181,-4,182,177,-3,177,177,177,177,-2,177,177,-2,183,177,-5,177,177,-12,177,177,-1,177,-4,177,-9,177,177,-1,177,-4,177,177,177,177,177,177,177,-1,177,-2,177,-2,177,177,184,177,177,-1,177,177,-1,177,177,-1,177,177,177,177,177,177,177,177,177,177,177,177,-1,177,-2,177,177,177,177,-3,177,177,-2,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,185],
    sm57=[0,186,186,186,-1,186,-4,186,-4,186,186,-3,186,186,186,186,-2,186,186,-2,186,186,-5,186,186,-12,186,186,-1,186,-4,186,-9,186,186,-1,186,-4,186,186,186,186,186,186,186,-1,186,-2,186,-2,186,186,186,186,186,-1,186,186,-1,186,186,-1,186,186,186,186,186,186,186,186,186,186,186,186,-1,186,-2,186,186,186,186,-3,186,186,-2,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186],
    sm58=[0,187,187,187,-1,0,-4,0,-4,-1,187,-3,187,187,187,187,-2,187,187,-3,187,-5,187,187,-12,187,187,-1,187,-14,187,187,-1,187,-4,187,187,187,187,187,187,187,-1,187,-2,187,-2,187,187,187,-1,187,-1,187,187,-1,187,187,-1,187,187,187,187,187,187,187,187,187,187,187,187,-1,187,-2,187,187,-5,187,187,-2,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187],
    sm59=[0,188,188,188,-1,0,-4,0,-4,-1,188,-3,188,188,188,188,-2,188,188,-3,188,-5,188,188,-12,188,188,-1,188,-14,188,188,-1,188,-4,188,188,188,188,188,188,188,-1,188,-2,188,-2,188,188,188,-1,188,-1,188,188,-1,188,188,-1,188,188,188,188,188,188,188,188,188,188,188,188,-1,188,-2,188,188,-5,188,188,-2,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188,188],
    sm60=[0,189,189,189,-1,0,-4,0,-4,-1,189,-3,189,189,189,189,-2,189,189,-3,189,-5,189,189,-12,189,189,-1,189,-14,189,189,-1,189,-4,189,189,189,189,189,189,189,-1,189,-2,189,-2,189,189,189,-1,189,-1,189,189,-1,189,189,-1,189,189,189,189,189,189,189,189,189,189,189,189,-1,189,-2,189,189,-5,189,189,-2,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189,189],
    sm61=[0,-1,190,191,-1,192,193,194,195,196,0,-4,-1,-144,197],
    sm62=[0,-1,198,199,-1,200,201,202,203,204,0,-4,-1,-145,205],
    sm63=[0,206,206,206,-1,0,-4,0,-4,-1,206,-3,206,206,206,206,-2,206,206,-3,206,-5,206,206,-12,206,206,-1,206,-14,206,206,-1,206,-4,206,206,206,206,206,206,206,-1,206,-2,206,-2,206,206,206,-1,206,-1,206,206,-1,206,206,-1,206,206,206,206,206,206,206,206,206,206,206,206,-1,206,-2,206,206,-5,206,206,-2,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],
    sm64=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,207,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm65=[0,-4,0,-4,0,-4,-1,-6,160,-14,209,-44,210],
    sm66=[0,211,211,211,-1,0,-4,0,-4,-1,211,-3,211,211,211,211,-2,211,211,-3,211,-5,211,211,-12,211,211,-1,211,-14,211,211,-1,211,-4,211,211,211,211,211,211,211,-1,211,-2,211,-2,211,211,211,-1,211,-1,211,211,-1,211,211,-1,211,211,211,211,211,211,211,211,211,211,211,211,-1,211,-2,211,211,-5,211,211,-2,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211,211],
    sm67=[0,212,212,212,-1,0,-4,0,-4,-1,212,-3,212,212,212,212,-2,212,212,-3,212,-5,212,212,-12,212,212,-1,212,-14,212,212,-1,212,-4,212,212,212,212,212,212,212,-1,212,-2,212,-2,212,212,212,-1,212,-1,212,212,-1,212,212,-1,212,212,212,212,212,212,212,212,212,212,212,212,-1,212,-2,212,212,-5,212,212,-2,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212],
    sm68=[0,-4,0,-4,0,-4,-1,-105,213],
    sm69=[0,-4,0,-4,0,-4,-1,-105,171],
    sm70=[0,-4,0,-4,0,-4,-1,-75,214],
    sm71=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,-14,216,-40,11,-71,45],
    sm72=[0,217,217,217,-1,0,-4,0,-4,-1,217,-1,217,-1,217,-1,217,-14,217,-14,217,-1,217,-22,217,217,-9,217,-3,217,217,-1,217,217,217,217,-1,217,217,217,217,217,217,217,217,-1,217,217,217,217,217,217,217,217,-2,217,217,-5,217,217,-2,217,-23,217,217,217,217,217,217,217,217,217,217,217,217],
    sm73=[0,-4,0,-4,0,-4,-1,-6,218],
    sm74=[0,219,219,219,-1,0,-4,0,-4,-1,219,-1,219,-1,219,-1,219,-14,219,-14,219,-1,219,-22,219,219,-9,219,-3,219,219,-1,219,219,219,219,-1,219,219,219,219,219,219,219,219,-1,219,219,219,219,219,219,219,219,-2,219,219,-5,219,219,-2,219,-23,219,219,219,219,219,219,219,219,219,219,219,219],
    sm75=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-7,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,-6,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm76=[0,-4,0,-4,0,-4,-1,-6,220],
    sm77=[0,-4,0,-4,0,-4,-1,-6,221,-84,222],
    sm78=[0,-4,0,-4,0,-4,-1,-6,223],
    sm79=[0,-2,2,-1,0,-4,0,-4,-1,-72,224,-4,11,-71,45],
    sm80=[0,-2,2,-1,0,-4,0,-4,-1,-72,225,-4,11,-71,45],
    sm81=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-9,226,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm82=[0,-4,0,-4,0,-4,-1,-6,227],
    sm83=[0,-4,0,-4,0,-4,-1,-36,85],
    sm84=[0,-4,0,-4,0,-4,-1,-72,228],
    sm85=[0,229,229,229,-1,0,-4,0,-4,-1,229,-1,229,-1,229,-1,229,-14,229,-14,229,-1,229,-22,229,229,-9,229,-3,229,229,-1,229,229,229,229,-1,229,229,-1,229,229,229,229,229,-1,229,229,229,229,229,229,229,229,-2,229,229,-5,229,229,-2,229,-23,229,229,229,229,229,229,229,229,229,229,229,229],
    sm86=[0,-2,2,-1,0,-4,0,-4,-1,-36,230,-40,11,-28,231,-42,45],
    sm87=[0,232,232,232,-1,0,-4,0,-4,-1,232,-1,232,-1,232,-1,232,-14,232,-14,232,-1,232,-22,232,232,-9,232,-3,232,232,-1,232,232,232,232,-1,232,232,-1,232,232,232,232,232,-1,232,232,232,232,232,232,232,232,-2,232,232,-5,232,232,-2,232,-23,232,232,232,232,232,232,232,232,232,232,232,232],
    sm88=[0,-2,2,-1,0,-4,0,-4,-1,-6,233,-70,11,-71,45],
    sm89=[0,-2,234,-1,0,-4,0,-4,-1,-21,234,-14,234,-40,234,-71,234],
    sm90=[0,-2,235,-1,0,-4,0,-4,-1,-21,235,-14,235,-40,235,-71,235],
    sm91=[0,236,-3,0,-4,0],
    sm92=[0,-4,0,-4,0,-9,237,-31,237],
    sm93=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,-14,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm94=[0,-2,52,-1,0,-4,0,-149,238,239],
    sm95=[0,-2,52,-1,0,-4,0,-20,240,-128,238,239],
    sm96=[0,-2,52,-1,0,-4,0,-20,241,-128,238,239],
    sm97=[0,-2,52,-1,0,-4,0,-20,242,-128,238,239],
    sm98=[0,-2,52,-1,0,-4,0,-4,-1,-5,243,-9,244,-128,238,239],
    sm99=[0,-2,52,-1,0,-4,0,-4,-1,-5,245,-9,246,-128,238,239],
    sm100=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-171,254],
    sm101=[0,-2,255,-1,0,-4,0,-10,256,-9,256,-128,255,255],
    sm102=[0,-2,257,-1,0,-4,0,-4,-1,-5,257,-9,257,-128,257,257],
    sm103=[0,-2,258,-1,259,-4,260,-4,-1,-5,261,-4,261,-4,261,-6,261,-52,262,263,264,-66,261,261],
    sm104=[0,-2,265,-1,265,-4,265,-4,-1,-5,265,-4,265,-4,265,-6,265,-52,265,265,265,-66,265,265],
    sm105=[0,-2,256,-1,0,-4,0,-10,256,-9,256,-128,256,256],
    sm106=[0,-2,256,-1,0,-4,0,-4,-1,-5,256,-9,256,-128,256,256],
    sm107=[0,266,266,266,-1,0,-4,0,-4,-1,266,-3,266,266,266,266,-2,266,266,-3,266,-5,266,266,-12,266,266,-1,266,-14,266,266,-1,266,-4,266,266,266,266,266,266,266,-1,266,-2,266,-2,266,266,266,-1,266,-1,266,266,-1,266,266,-1,266,266,266,266,266,266,266,266,266,266,266,266,-1,266,-2,266,266,-5,266,266,-2,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266],
    sm108=[0,-2,52,-1,0,-4,0,-5,267,268,-149,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75],
    sm109=[0,-4,0,-4,0,-41,269,-35,98],
    sm110=[0,-4,0,-4,0,-4,-1,-38,270],
    sm111=[0,271,271,271,-1,0,-4,0,-5,271,-3,271,271,271,271,-2,271,271,-3,271,-5,271,271,-12,271,271,-1,271,-14,271,271,-1,271,-4,271,271,271,271,271,271,271,-1,271,-2,271,-2,271,271,271,-1,271,-1,271,271,-1,271,271,-1,271,271,271,271,271,271,271,271,271,271,271,271,-1,271,-2,271,271,-5,271,271,-2,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271,271],
    sm112=[0,272,272,272,-1,0,-4,0,-4,-1,272,-3,272,272,272,272,-2,272,272,-3,272,-5,272,272,-12,272,272,-1,272,-14,272,272,-1,272,-4,272,272,272,272,272,272,272,-1,272,-2,272,-2,272,272,272,-1,272,-1,272,272,-1,272,272,-1,272,272,272,272,272,272,272,272,272,272,272,272,-1,272,-2,272,272,-5,272,272,-2,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272,272],
    sm113=[0,273,273,273,-1,0,-4,0,-4,-1,273,-3,273,273,273,273,-2,273,273,-3,273,-5,273,273,-12,273,273,-1,273,-14,273,273,-1,273,-4,273,273,273,273,273,273,273,-1,273,-2,273,-2,273,273,273,-1,273,-1,273,273,-1,273,273,-1,273,273,273,273,273,273,273,273,273,273,273,273,-1,273,-2,273,273,-5,273,273,-2,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273],
    sm114=[0,-2,52,-1,0,-4,0,-5,267,268,-139,55,-9,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75],
    sm115=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,-14,274,-13,275,80,-1,276,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-3,277,278,31,32,-1,279,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm116=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,280,-12,281,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,282,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm117=[0,232,232,232,-1,0,-4,0,-4,-1,232,-3,283,283,283,-3,283,283,-3,283,-5,283,-13,283,283,-1,232,-14,283,283,-1,283,-4,283,232,283,283,283,283,283,-1,283,-2,232,-3,283,232,-1,232,-1,232,232,-1,232,232,-1,232,232,232,232,232,-1,232,232,232,232,232,232,-1,232,-2,232,232,-5,232,232,-2,232,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,232,232,232,232,283,283,232,232,232,232,232,232],
    sm118=[0,-1,229,229,-1,0,-4,0,-4,-1,-4,284,284,284,-3,284,284,-3,284,-5,284,-13,284,284,-1,229,-14,284,284,-1,284,-4,284,229,284,284,284,284,284,-1,284,-2,229,-3,284,229,-3,229,229,-1,229,229,-1,229,229,229,229,229,-1,229,229,229,229,229,229,-1,229,-2,229,229,-5,229,229,-2,229,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,229,229,229,229,284,284,229,229,229,229,229,229],
    sm119=[0,-1,1,2,-1,0,-4,0,-4,-1,-2,285,-1,78,-1,5,-29,85,-1,285,-22,7,8,-9,9,-3,10,11,-2,285,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,285,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm120=[0,-1,286,286,-1,0,-4,0,-4,-1,-2,286,-1,286,-1,286,-14,286,-14,286,-1,286,-22,286,286,-9,286,-3,286,286,-2,286,286,286,-1,286,286,-1,286,286,286,286,286,-1,286,286,286,286,286,286,286,286,-2,286,286,-5,286,286,-2,286,-23,286,286,286,286,286,286,286,286,286,286,286,286],
    sm121=[0,-1,287,287,-1,0,-4,0,-4,-1,-2,287,-1,287,-1,287,-14,287,-14,287,-1,287,-22,287,287,-9,287,-3,287,287,-2,287,287,287,-1,287,287,-1,287,287,287,287,287,-1,287,287,287,287,287,287,287,287,-2,287,287,-5,287,287,-2,287,-23,287,287,287,287,287,287,287,287,287,287,287,287],
    sm122=[0,288,288,288,-1,0,-4,0,-4,-1,288,-3,288,-1,288,-14,288,-14,288,-24,288,288,-9,288,-3,288,288,-1,288,-1,288,288,-1,288,288,-1,288,288,288,288,288,-1,288,288,288,288,288,288,-1,288,-2,288,288,-5,288,288,-2,288,-23,288,288,288,288,288,288,288,288,288,288,288,288],
    sm123=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm124=[0,-4,0,-4,0,-4,-1,-43,289],
    sm125=[0,-4,0,-4,0,-4,-1,-72,290],
    sm126=[0,-4,0,-4,0,-4,-1,-35,291,-7,292],
    sm127=[0,-4,0,-4,0,-4,-1,-43,292],
    sm128=[0,-4,0,-4,0,-4,-1,-35,293,-7,293],
    sm129=[0,-4,0,-4,0,-4,-1,-35,294,-2,294,-4,294],
    sm130=[0,-4,0,-4,0,-4,-1,-78,295],
    sm131=[0,-2,2,-1,0,-4,0,-4,-1,-35,296,-2,297,-38,11,-71,45],
    sm132=[0,-4,0,-4,0,-4,-1,-72,298],
    sm133=[0,-4,0,-4,0,-4,-1,-43,289,-28,299],
    sm134=[0,300,300,300,-1,0,-4,0,-4,-1,300,-3,300,-1,300,-14,300,-14,300,-24,300,300,-9,300,-3,300,300,-1,300,-1,300,300,-1,300,300,-1,300,300,300,300,300,-1,300,300,300,300,300,300,-1,300,-2,300,300,-5,300,300,-2,300,-23,300,300,300,300,300,300,300,300,300,300,300,300],
    sm135=[0,-2,2,-1,0,-4,0,-4,-1,-35,301,-2,302,-38,11,-71,45],
    sm136=[0,303,303,303,-1,0,-4,0,-4,-1,303,-1,303,-1,303,-1,303,-14,303,-14,303,-1,303,-22,303,303,-9,303,-3,303,303,-1,303,303,303,303,-1,303,303,303,303,303,303,303,303,-1,303,303,303,303,303,303,303,303,-2,303,303,-5,303,303,-2,303,-23,303,303,303,303,303,303,303,303,303,303,303,303],
    sm137=[0,304,304,304,-1,0,-4,0,-4,-1,304,-3,304,304,304,304,-3,304,-3,304,-5,304,304,-12,304,304,-1,304,-14,304,304,-1,304,-4,304,304,304,304,304,-6,304,-2,304,304,304,-1,304,-1,304,304,-1,304,304,-1,304,304,304,304,304,-1,304,304,304,304,304,304,-1,304,-2,304,304,-5,304,304,-2,304,-10,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304,304],
    sm138=[0,305,305,305,-1,0,-4,0,-4,-1,305,-3,305,305,305,305,-3,305,-3,305,-5,305,305,-12,305,305,-1,305,-14,305,305,-1,305,-4,305,305,305,305,305,-6,305,-2,305,305,305,-1,305,-1,305,305,-1,305,305,-1,305,305,305,305,305,-1,305,305,305,305,305,305,-1,305,-2,305,305,-5,305,305,-2,305,-10,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305],
    sm139=[0,-1,306,306,-1,0,-4,0,-4,-1,-4,306,-1,306,-14,306,-14,306,-24,306,306,-13,306,306,-3,306,306,-8,306,-18,306,306,-2,306,-23,306,306,306,306,306,306,306,306,306,306,306,306],
    sm140=[0,307,307,307,-1,0,-4,0,-4,-1,307,-3,307,307,307,307,-3,307,-3,307,-5,307,307,-12,307,307,-1,307,-14,307,307,-1,307,-4,307,307,307,307,307,-6,307,-2,307,307,307,-1,307,-1,307,307,-1,307,307,-1,307,307,307,307,307,-1,307,307,307,307,307,307,-1,307,-2,307,307,-5,307,307,-2,307,-10,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307,307],
    sm141=[0,104,104,104,-1,0,-4,0,-4,-1,104,-3,104,104,104,104,-3,104,-3,104,-5,104,104,-12,104,104,-1,104,-14,104,104,-1,104,-4,104,104,104,104,104,-6,104,-2,104,104,104,-1,104,-1,104,104,-1,104,104,-1,104,104,104,104,104,-1,104,104,104,104,104,104,-1,104,-2,104,104,-5,104,104,-2,104,-10,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,118,119,104,104,104,104,104,104],
    sm142=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,-14,274,-13,275,158,-1,276,-22,7,8,-13,10,11,-3,13,14,-8,21,-16,277,278,31,32,-1,279,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm143=[0,172,172,172,-1,0,-4,0,-4,-1,172,-3,172,172,172,172,-2,172,172,-3,172,-5,172,172,-12,172,172,-1,172,-14,172,172,-1,172,-4,172,172,172,172,172,172,172,-1,172,-2,172,-2,172,172,172,-1,172,-1,172,172,-1,172,172,-1,172,172,172,172,172,172,172,172,172,172,172,172,-1,172,-2,172,172,-5,172,172,-2,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172],
    sm144=[0,283,283,283,-1,0,-4,0,-4,-1,283,-3,283,283,283,283,-2,283,283,-3,283,-5,283,283,-12,283,283,-1,283,-14,283,283,-1,283,-4,283,283,283,283,283,283,283,-1,283,-2,283,-2,283,283,283,-1,283,-1,283,283,-1,283,283,-1,283,283,283,283,283,283,283,283,283,283,283,283,-1,283,-2,283,283,-5,283,283,-2,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283,283],
    sm145=[0,284,284,284,-1,0,-4,0,-4,-1,284,-3,284,284,284,284,-2,284,284,-3,284,-5,284,284,-12,284,284,-1,284,-14,284,284,-1,284,-4,284,284,284,284,284,284,284,-1,284,-2,284,-2,284,284,284,-1,284,-1,284,284,-1,284,284,-1,284,284,284,284,284,284,284,284,284,284,284,284,-1,284,-2,284,284,-5,284,284,-2,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284],
    sm146=[0,308,308,308,-1,0,-4,0,-4,-1,308,-3,308,308,308,308,-3,308,-3,308,-5,308,308,-12,308,308,-1,308,-14,308,308,-1,308,-4,308,308,308,308,308,-6,308,-2,308,308,308,-1,308,-1,308,308,-1,308,308,-1,308,308,308,308,308,-1,308,308,308,308,308,308,-1,308,-2,308,308,-5,308,308,-2,308,-10,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308],
    sm147=[0,309,309,309,-1,0,-4,0,-4,-1,309,-3,309,309,309,309,-3,309,-3,309,-5,309,309,-12,309,309,-1,309,-14,309,309,-1,309,-4,309,309,309,309,309,-6,309,-2,309,309,309,-1,309,-1,309,309,-1,309,309,-1,309,309,309,309,309,-1,309,309,309,309,309,309,-1,309,-2,309,309,-5,309,309,-2,309,-10,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309,309],
    sm148=[0,310,310,310,-1,0,-4,0,-4,-1,310,-3,310,310,310,310,-3,310,-3,310,-5,310,310,-12,310,310,-1,310,-14,310,310,-1,310,-4,310,310,310,310,310,-6,310,-2,310,310,310,-1,310,-1,310,310,-1,310,310,-1,310,310,310,310,310,-1,310,310,310,310,310,310,-1,310,-2,310,310,-5,310,310,-2,310,-10,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310],
    sm149=[0,311,311,311,-1,0,-4,0,-4,-1,311,-3,311,311,311,311,-3,311,-3,311,-5,311,311,-12,311,311,-1,311,-14,311,311,-1,311,-4,311,311,311,311,311,-6,311,-2,311,311,311,-1,311,-1,311,311,-1,311,311,-1,311,311,311,311,311,-1,311,311,311,311,311,311,-1,311,-2,311,311,-5,311,311,-2,311,-10,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311],
    sm150=[0,312,312,312,-1,0,-4,0,-4,-1,312,-3,312,312,312,312,-3,312,-3,312,-5,312,312,-12,312,312,-1,312,-14,312,312,-1,312,-4,312,312,312,312,312,-6,312,-2,312,312,312,-1,312,-1,312,312,-1,312,312,-1,312,312,312,312,312,-1,312,312,312,312,312,312,-1,312,-2,312,312,-5,312,312,-2,312,-10,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312],
    sm151=[0,313,313,313,-1,0,-4,0,-4,-1,313,-3,313,313,313,313,-3,313,-3,313,-5,313,313,-12,313,313,-1,313,-14,313,313,-1,313,-4,313,313,313,313,313,-6,313,-2,313,313,313,-1,313,-1,313,313,-1,313,313,-1,313,313,313,313,313,-1,313,313,313,313,313,313,-1,313,-2,313,313,-5,313,313,-2,313,-10,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313],
    sm152=[0,314,314,314,-1,0,-4,0,-4,-1,314,-3,314,314,314,314,-3,314,-3,314,-5,314,314,-12,314,314,-1,314,-14,314,314,-1,314,-4,314,314,314,314,314,-6,314,-2,314,314,314,-1,314,-1,314,314,-1,314,314,-1,314,314,314,314,314,-1,314,314,314,314,314,314,-1,314,-2,314,314,-5,314,314,-2,314,-10,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314],
    sm153=[0,315,315,315,-1,0,-4,0,-4,-1,315,-3,315,315,315,315,-3,315,-3,315,-5,315,315,-12,315,315,-1,315,-14,315,315,-1,315,-4,315,315,315,315,315,-6,315,-2,315,315,315,-1,315,-1,315,315,-1,315,315,-1,315,315,315,315,315,-1,315,315,315,315,315,315,-1,315,-2,315,315,-5,315,315,-2,315,-10,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315],
    sm154=[0,-2,2,-1,0,-4,0,-4,-1,-77,11,-71,45],
    sm155=[0,316,316,316,-1,0,-4,0,-4,-1,316,-3,316,316,316,316,-2,316,316,-3,316,-5,316,316,-12,316,316,-1,316,-14,316,316,-1,316,-4,316,316,316,316,316,316,316,-1,316,-2,316,-2,316,316,316,-1,316,-1,316,316,-1,316,316,-1,316,316,316,316,316,316,316,316,316,316,316,316,-1,316,-2,316,316,-5,316,316,-2,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316],
    sm156=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,317,-13,79,-13,318,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,319,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm157=[0,320,320,320,-1,0,-4,0,-4,-1,320,-3,320,320,320,320,-2,320,320,-3,320,-5,320,320,-12,320,320,-1,320,-14,320,320,-1,320,-4,320,320,320,320,320,320,320,-1,320,-2,320,-2,320,320,320,-1,320,-1,320,320,-1,320,320,-1,320,320,320,320,320,320,320,320,320,320,320,320,-1,320,-2,320,320,-5,320,320,-2,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320,320],
    sm158=[0,321,321,321,-1,0,-4,0,-4,-1,321,-3,321,321,321,321,-2,321,321,-3,321,-5,321,321,-12,321,321,-1,321,-14,321,321,-1,321,-4,321,321,321,321,321,-1,321,-1,321,-2,321,-2,321,321,321,-1,321,-1,321,321,-1,321,321,-1,321,321,321,321,321,321,321,321,321,321,321,321,-1,321,-2,321,321,-5,321,321,-2,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321,321],
    sm159=[0,-4,0,-4,0,-4,-1,-112,322],
    sm160=[0,-4,0,-4,0,-4,-1,-21,209,-44,210],
    sm161=[0,323,178,179,-1,180,-4,181,-4,182,323,-3,323,323,323,323,-2,323,323,-2,183,323,-5,323,323,-12,323,323,-1,323,-4,323,-9,323,323,-1,323,-4,323,323,323,323,323,323,323,-1,323,-2,323,-2,323,323,184,323,323,-1,323,323,-1,323,323,-1,323,323,323,323,323,323,323,323,323,323,323,323,-1,323,-2,323,323,323,323,-3,323,323,-2,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,185],
    sm162=[0,324,324,324,-1,0,-4,0,-4,-1,324,-3,324,324,324,324,-2,324,324,-3,324,-5,324,324,-12,324,324,-1,324,-4,324,-9,324,324,-1,324,-4,324,324,324,324,324,324,324,-1,324,-2,324,-2,324,324,324,324,324,-1,324,324,-1,324,324,-1,324,324,324,324,324,324,324,324,324,324,324,324,-1,324,-2,324,324,324,324,-3,324,324,-2,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324,324],
    sm163=[0,325,325,325,-1,325,-4,325,-4,325,325,-3,325,325,325,325,-2,325,325,-2,325,325,-5,325,325,-12,325,325,-1,325,-4,325,-9,325,325,-1,325,-4,325,325,325,325,325,325,325,-1,325,-2,325,-2,325,325,325,325,325,-1,325,325,-1,325,325,-1,325,325,325,325,325,325,325,325,325,325,325,325,-1,325,-2,325,325,325,325,-3,325,325,-2,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325],
    sm164=[0,326,326,326,-1,326,-4,326,-4,326,326,-3,326,326,326,326,-2,326,326,-2,326,326,-5,326,326,-12,326,326,-1,326,-4,326,-9,326,326,-1,326,-4,326,326,326,326,326,326,326,-1,326,-2,326,-2,326,326,326,326,326,-1,326,326,-1,326,326,-1,326,326,326,326,326,326,326,326,326,326,326,326,-1,326,-2,326,326,326,326,-3,326,326,-2,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326],
    sm165=[0,327,327,327,-1,0,-4,0,-4,-1,327,-3,327,327,327,327,-2,327,327,-3,327,-5,327,327,-12,327,327,-1,327,-4,327,-9,327,327,-1,327,-4,327,327,327,327,327,327,327,-1,327,-2,327,-2,327,327,327,327,327,-1,327,327,-1,327,327,-1,327,327,327,327,327,327,327,327,327,327,327,327,-1,327,-2,327,327,327,327,-3,327,327,-2,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327],
    sm166=[0,-1,190,191,-1,192,193,194,195,196,0,-4,-1,-144,328],
    sm167=[0,329,329,329,-1,0,-4,0,-4,-1,329,-3,329,329,329,329,-2,329,329,-3,329,-5,329,329,-12,329,329,-1,329,-14,329,329,-1,329,-4,329,329,329,329,329,329,329,-1,329,-2,329,-2,329,329,329,-1,329,-1,329,329,-1,329,329,-1,329,329,329,329,329,329,329,329,329,329,329,329,-1,329,-2,329,329,-5,329,329,-2,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329],
    sm168=[0,-1,330,330,-1,330,330,330,330,330,0,-4,-1,-144,330],
    sm169=[0,-1,331,331,-1,331,331,331,331,331,0,-4,-1,-144,331],
    sm170=[0,-1,198,199,-1,200,201,202,203,204,0,-4,-1,-145,332],
    sm171=[0,-1,333,333,-1,333,333,333,333,333,0,-4,-1,-145,333],
    sm172=[0,-1,334,334,-1,334,334,334,334,334,0,-4,-1,-145,334],
    sm173=[0,335,335,335,-1,0,-4,0,-4,-1,335,-3,335,335,335,335,-2,335,335,-3,335,-5,335,335,-12,335,335,-1,335,-14,335,335,-1,335,-4,335,335,335,335,335,335,335,-1,335,-2,335,-2,335,335,335,-1,335,-1,335,335,-1,335,335,-1,335,335,335,335,335,335,335,335,335,335,335,335,-1,335,-2,335,335,335,-4,335,335,-2,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335,335],
    sm174=[0,-4,0,-4,0,-4,-1,-7,336,-27,337],
    sm175=[0,172,172,172,-1,0,-4,0,-4,-1,172,-3,172,172,172,172,-2,172,172,-3,172,-5,172,172,-12,172,172,-1,172,-14,172,172,-1,172,-4,172,172,172,172,172,172,172,-1,172,-2,172,-2,172,172,172,-1,172,-1,172,172,-1,172,172,-1,172,172,172,172,172,172,172,172,172,172,172,172,-1,172,-2,172,172,174,-4,172,172,-2,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172],
    sm176=[0,338,338,338,-1,0,-4,0,-4,-1,338,-3,338,338,338,338,-2,338,338,-3,338,-5,338,338,-12,338,338,-1,338,-14,338,338,-1,338,-4,338,338,338,338,338,338,338,-1,338,-2,338,-2,338,338,338,-1,338,-1,338,338,-1,338,338,-1,338,338,338,338,338,338,338,338,338,338,338,338,-1,338,-2,338,338,-5,338,338,-2,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338,338],
    sm177=[0,339,339,339,-1,0,-4,0,-4,-1,339,-3,339,339,339,339,-3,339,-3,339,-5,339,339,-12,339,339,-1,339,-14,339,339,-1,339,-4,339,339,339,339,339,-6,339,-2,339,339,339,-1,339,-1,339,339,-1,339,339,-1,339,339,339,339,339,-1,339,339,339,339,339,339,-1,339,-2,339,339,-5,339,339,-2,339,-10,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339,339],
    sm178=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,340,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm179=[0,341,341,341,-1,0,-4,0,-4,-1,341,-1,341,-1,341,-1,341,-14,341,-14,341,-1,341,-22,341,341,-9,341,-3,341,341,-1,341,341,341,341,-1,341,341,341,341,341,341,341,341,-1,341,341,341,341,341,341,341,341,-2,341,341,-5,341,341,-2,341,-23,341,341,341,341,341,341,341,341,341,341,341,341],
    sm180=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,-3,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,-6,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm181=[0,-4,0,-4,0,-4,-1,-35,342,-36,343],
    sm182=[0,-4,0,-4,0,-4,-1,-35,344,-36,344],
    sm183=[0,-4,0,-4,0,-4,-1,-10,345,-24,346,-36,346],
    sm184=[0,-4,0,-4,0,-4,-1,-10,345],
    sm185=[0,-4,0,-4,0,-4,-1,-6,174,174,-2,174,-11,174,-12,174,174,-1,174,-17,174,-15,174,-19,174,-13,174],
    sm186=[0,-4,0,-4,0,-4,-1,-7,347,-2,347,-11,347,-12,347,-2,347,-17,347,-35,347],
    sm187=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,349,-38,11,-35,350,-30,40,41,-3,45],
    sm188=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,351,-12,281,216,-40,11,-35,352,-35,45],
    sm189=[0,-4,0,-4,0,-4,-1,-89,353],
    sm190=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,158,-24,7,8,-9,354,-3,10,11,-3,13,14,-1,15,-2,355,-3,21,-12,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm191=[0,-4,0,-4,0,-4,-1,-6,356],
    sm192=[0,-4,0,-4,0,-4,-1,-72,357],
    sm193=[0,358,358,358,-1,0,-4,0,-4,-1,358,-1,358,-1,358,-1,358,-14,358,-14,358,-1,358,-22,358,358,-9,358,-3,358,358,-1,358,358,358,358,-1,358,358,358,358,358,358,358,358,-1,358,358,358,358,358,358,358,358,-2,358,358,-5,358,358,-2,358,-23,358,358,358,358,358,358,358,358,358,358,358,358],
    sm194=[0,-4,0,-4,0,-4,-1,-72,173],
    sm195=[0,-4,0,-4,0,-4,-1,-72,359],
    sm196=[0,360,360,360,-1,0,-4,0,-4,-1,360,-1,360,-1,360,-1,360,-14,360,-14,360,-1,360,-22,360,360,-9,360,-3,360,360,-1,360,360,360,360,-1,360,360,360,360,360,360,360,360,-1,360,360,360,360,360,360,360,360,-2,360,360,-5,360,360,-2,360,-23,360,360,360,360,360,360,360,360,360,360,360,360],
    sm197=[0,-4,0,-4,0,-4,-1,-72,361],
    sm198=[0,362,362,362,-1,0,-4,0,-4,-1,362,-1,362,-1,362,-1,362,-14,362,-14,362,-1,362,-22,362,362,-9,362,-3,362,362,-1,362,362,362,362,-1,362,362,362,362,362,362,362,362,-1,362,362,362,362,362,362,362,362,-2,362,362,-5,362,362,-2,362,-23,362,362,362,362,362,362,362,362,362,362,362,362],
    sm199=[0,-4,0,-4,0,-4,-1,-72,363],
    sm200=[0,-4,0,-4,0,-4,-1,-101,364,365],
    sm201=[0,366,366,366,-1,0,-4,0,-4,-1,366,-1,366,-1,366,-1,366,-14,366,-14,366,-1,366,-22,366,366,-9,366,-3,366,366,-1,366,366,366,366,-1,366,366,366,366,366,366,366,366,-1,366,366,366,366,366,366,366,366,-2,366,366,-5,366,366,-2,366,-23,366,366,366,366,366,366,366,366,366,366,366,366],
    sm202=[0,-4,0,-4,0,-4,-1,-36,230,-69,231],
    sm203=[0,367,367,367,-1,0,-4,0,-4,-1,367,-1,367,-1,367,367,367,367,-2,367,367,-3,367,-5,367,367,-12,367,367,-1,367,-14,367,367,-1,367,-4,367,367,367,367,367,367,367,-1,367,-2,367,-2,367,367,367,-1,367,367,367,367,-1,367,367,-1,367,367,367,367,367,367,367,367,367,367,367,367,367,367,-2,367,367,-5,367,367,-2,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367,367],
    sm204=[0,-4,0,-4,0,-4,-1,-36,368],
    sm205=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,369,-33,370,-4,11,-29,371,277,278,-34,40,41,-3,45],
    sm206=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-40,11,-3,13,14,-27,31,32,-2,33,-29,40,41,42,43,44,45],
    sm207=[0,-4,0,-4,0,-4,-1,-6,372],
    sm208=[0,-2,2,-1,0,-4,0,-4,-1,-7,373,-13,215,-14,216,-40,11,-35,352,-35,45],
    sm209=[0,-4,0,-4,0,-4,-1,-35,374,-36,375],
    sm210=[0,-4,0,-4,0,-4,-1,-35,376,-36,376],
    sm211=[0,-4,0,-4,0,-41,269],
    sm212=[0,-2,52,-1,0,-4,0,-10,377,-9,378,-128,238,239],
    sm213=[0,-2,379,-1,0,-4,0,-4,-1,-5,379,-9,379,-128,379,379],
    sm214=[0,-2,380,-1,0,-4,0,-4,-1,-5,380,-4,381,-4,380,-128,380,380],
    sm215=[0,-2,52,-1,0,-4,0,-4,-1,-145,382],
    sm216=[0,-2,52,-1,0,-4,0,-4,-1,-144,383],
    sm217=[0,-2,384,-1,0,-4,0,-4,-1,-5,384,-4,384,-4,384,-128,384,384],
    sm218=[0,-2,52,-1,0,-4,0,-20,385,-128,238,239],
    sm219=[0,-2,386,-1,0,-4,0,-7,387,-11,388,-6,389,-14,390,-3,391,-23,392,393,394,-8,395],
    sm220=[0,-2,52,-1,0,-4,0,-20,396,-128,238,239],
    sm221=[0,-1,1,2,-1,0,-4,0,-7,397,-1,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm222=[0,-2,52,-1,0,-4,0,-20,398,-128,238,239],
    sm223=[0,-1,1,2,-1,0,-4,0,-7,399,-1,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm224=[0,-2,52,-1,0,-4,0,-4,-1,-5,400,-9,401,-128,238,239],
    sm225=[0,-1,247,248,-1,249,250,251,252,253,402,-4,-1,-2,403,-1,78,-1,404,-14,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm226=[0,-4,0,-4,0,-4,-1,-15,410],
    sm227=[0,-2,52,-1,0,-4,0,-4,-1,-5,411,-9,412,-128,238,239],
    sm228=[0,413,413,413,-1,413,413,413,413,413,413,-4,-1,413,-1,414,-1,413,413,413,413,-2,413,413,-2,413,413,-5,413,413,413,-1,413,-3,413,-5,413,413,-1,413,-14,413,413,-1,413,-4,413,413,413,413,413,413,413,-1,413,-2,413,-2,413,413,413,-1,413,-1,413,413,-1,413,413,-1,413,413,413,413,413,413,413,413,413,413,413,413,-1,413,-2,413,413,-5,413,413,-2,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,-21,413],
    sm229=[0,-4,0,-4,0,-4,-1,-15,415],
    sm230=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-15,416,-155,254],
    sm231=[0,-1,417,417,-1,417,417,417,417,417,417,-4,-1,-2,417,-1,417,-1,417,417,-6,417,417,-5,417,-1,417,417,417,417,-2,417,-6,417,-1,417,-132,417],
    sm232=[0,-4,0,-4,0,-3,418,-1],
    sm233=[0,-1,419,419,-1,419,419,419,419,419,419,-4,-1,-2,419,-1,419,-1,419,419,-6,419,419,-3,419,-1,419,-1,419,419,419,419,-2,419,-6,419,-1,419,-132,419],
    sm234=[0,-2,258,-1,259,-4,260,-4,-1,-5,420,-4,420,-4,420,-6,420,-52,262,263,264,-66,420,420],
    sm235=[0,-2,421,-1,0,-4,0,-4,-1,-5,421,-4,421,-4,421,-6,421,-121,421,421],
    sm236=[0,-2,422,-1,422,-4,422,-4,-1,-5,422,-4,422,-4,422,-6,422,-52,422,422,422,-66,422,422],
    sm237=[0,-2,423,-1,423,-4,423,-4,-1,-5,423,-4,423,-4,423,-6,423,-52,423,423,423,-66,423,423],
    sm238=[0,-2,424,-1,0,-4,0,-4,-1,-5,424,-4,424,-4,424,-6,424,-121,424,424],
    sm239=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,-29,85,-1,425,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm240=[0,426,426,426,-1,0,-4,0,-4,-1,426,-1,426,-1,426,-1,426,-14,426,-14,426,-1,426,-22,426,426,-9,426,-3,426,426,-1,426,426,426,426,-1,426,426,426,426,426,426,426,426,-1,426,426,426,426,426,426,426,426,426,426,426,426,-5,426,426,-2,426,-23,426,426,426,426,426,426,426,426,426,426,426,426],
    sm241=[0,-4,0,-4,0,-4,-1,-35,427,-2,428],
    sm242=[0,-4,0,-4,0,-4,-1,-38,429],
    sm243=[0,430,430,430,-1,0,-4,0,-4,-1,430,-3,430,430,430,430,-2,430,430,-3,430,-5,430,430,-12,430,430,-1,430,-14,430,430,-1,430,-4,430,430,430,430,430,430,430,-1,430,-2,430,-2,430,430,430,-1,430,-1,430,430,-1,430,430,-1,430,430,430,430,430,430,430,430,430,430,430,430,-1,430,-2,430,430,-5,430,430,-2,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430],
    sm244=[0,-4,0,-4,0,-4,-1,-4,170,170,170,-3,345,170,-3,170,-5,170,-13,170,170,-1,431,-14,170,170,-1,170,-4,170,-1,170,170,170,170,170,-1,170,-2,170,-3,170,-38,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,-4,170,170],
    sm245=[0,-4,0,-4,0,-4,-1,-4,175,175,175,-3,175,175,-3,175,-5,175,-13,175,175,-1,175,-14,175,175,-1,175,-4,175,-1,175,175,175,175,175,-1,175,-2,175,-2,432,175,-28,175,-9,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,-4,175,175],
    sm246=[0,-4,0,-4,0,-4,-1,-4,187,187,187,-3,187,187,-3,187,-5,187,-13,187,187,-16,187,187,-1,187,-4,187,-1,187,187,187,187,187,-1,187,-2,187,-2,432,187,-38,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,-4,187,187],
    sm247=[0,-4,0,-4,0,-4,-1,-35,433,-2,433],
    sm248=[0,-4,0,-4,0,-4,-1,-35,431,-2,431],
    sm249=[0,-4,0,-4,0,-4,-1,-6,434,-68,435],
    sm250=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-55,11,-66,40,41,-3,45],
    sm251=[0,-4,0,-4,0,-4,-1,-6,436,-68,436],
    sm252=[0,-4,0,-4,0,-4,-1,-22,437,-12,438],
    sm253=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,439,-12,440,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,282,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm254=[0,441,441,441,-1,0,-4,0,-4,-1,441,-3,441,441,441,441,-2,441,441,-3,441,-5,441,441,-12,441,441,-1,441,-14,441,441,-1,441,-4,441,441,441,441,441,441,441,-1,441,-2,441,-2,441,441,441,-1,441,-1,441,441,-1,441,441,-1,441,441,441,441,441,441,441,441,441,441,441,441,-1,441,-2,441,441,-5,441,441,-2,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441,441],
    sm255=[0,-4,0,-4,0,-4,-1,-22,442,-12,442],
    sm256=[0,-1,443,443,-1,0,-4,0,-4,-1,-4,443,-1,443,-14,443,443,-12,443,443,-24,443,443,-13,443,443,-3,443,443,-8,443,-18,443,443,-1,443,443,-23,443,443,443,443,443,443,443,443,443,443,443,443],
    sm257=[0,-1,444,444,-1,0,-4,0,-4,-1,-2,444,-1,444,-1,444,-14,444,-14,444,-1,444,-22,444,444,-9,444,-3,444,444,-2,444,444,444,-1,444,444,-1,444,444,444,444,444,-1,444,444,444,444,444,444,444,444,-2,444,444,-5,444,444,-2,444,-23,444,444,444,444,444,444,444,444,444,444,444,444],
    sm258=[0,-4,0,-4,0,-4,-1,-72,445],
    sm259=[0,-4,0,-4,0,-4,-1,-144,40,41],
    sm260=[0,446,446,446,-1,0,-4,0,-4,-1,446,-3,446,-1,446,-14,446,-14,446,-24,446,446,-9,446,-3,446,446,-1,446,-1,446,446,-1,446,446,-1,446,446,446,446,446,-1,446,446,446,446,446,446,-1,446,-2,446,446,-5,446,446,-2,446,-23,446,446,446,446,446,446,446,446,446,446,446,446],
    sm261=[0,-4,0,-4,0,-4,-1,-36,90,-27,91],
    sm262=[0,-4,0,-4,0,-4,-1,-35,447,-2,448],
    sm263=[0,-4,0,-4,0,-4,-1,-38,449],
    sm264=[0,-4,0,-4,0,-4,-1,-43,450],
    sm265=[0,-4,0,-4,0,-4,-1,-35,451,-2,451],
    sm266=[0,-4,0,-4,0,-4,-1,-35,452,-2,452],
    sm267=[0,-4,0,-4,0,-4,-1,-35,453,-2,453],
    sm268=[0,-4,0,-4,0,-4,-1,-35,294,-2,294,-39,454],
    sm269=[0,-4,0,-4,0,-4,-1,-72,455],
    sm270=[0,-4,0,-4,0,-4,-1,-72,456],
    sm271=[0,457,457,457,-1,0,-4,0,-4,-1,457,-3,457,-1,457,-14,457,-14,457,-24,457,457,-9,457,-3,457,457,-1,457,-1,457,457,-1,457,457,-1,457,457,457,457,457,-1,457,457,457,457,457,457,-1,457,-2,457,457,-5,457,457,-2,457,-23,457,457,457,457,457,457,457,457,457,457,457,457],
    sm272=[0,458,458,458,-1,0,-4,0,-4,-1,458,-3,458,-1,458,-14,458,-14,458,-24,458,458,-9,458,-3,458,458,-1,458,-1,458,458,-1,458,458,-1,458,458,458,458,458,-1,458,458,458,458,458,458,-1,458,-2,458,458,-5,458,458,-2,458,-23,458,458,458,458,458,458,458,458,458,458,458,458],
    sm273=[0,-4,0,-4,0,-4,-1,-35,459,-2,460],
    sm274=[0,-4,0,-4,0,-4,-1,-38,461],
    sm275=[0,-4,0,-4,0,-4,-1,-43,462,-28,462],
    sm276=[0,-4,0,-4,0,-4,-1,-35,463,-2,463],
    sm277=[0,-4,0,-4,0,-4,-1,-35,464,-2,464],
    sm278=[0,-4,0,-4,0,-4,-1,-35,465,-2,465,-39,466],
    sm279=[0,-4,0,-4,0,-4,-1,-7,467,-14,467,-12,467,467,-35,467,-2,467],
    sm280=[0,468,468,468,-1,0,-4,0,-4,-1,468,-3,468,-1,468,468,-13,468,468,-12,468,468,-1,468,-22,468,468,-9,468,-2,468,468,468,-1,468,-1,468,468,-1,468,468,-1,468,468,468,468,468,-1,468,468,468,468,468,468,-1,468,-2,468,468,-5,468,468,-2,468,-23,468,468,468,468,468,468,468,468,468,468,468,468],
    sm281=[0,-4,0,-4,0,-4,-1,-75,469],
    sm282=[0,470,470,470,-1,0,-4,0,-4,-1,470,-3,470,-1,470,470,-13,470,470,-12,470,470,-1,470,-22,470,470,470,-8,470,-2,470,470,470,-1,470,-1,470,470,-1,470,470,-1,470,470,470,470,470,-1,470,470,470,470,470,470,-1,470,-2,470,470,-5,470,470,-2,470,-10,470,124,-11,470,470,470,470,470,470,470,470,470,470,470,470],
    sm283=[0,471,471,471,-1,0,-4,0,-4,-1,471,-3,471,-1,471,471,-13,471,471,-12,471,471,-1,471,-22,471,471,471,-1,126,-6,471,-2,471,471,471,-1,471,-1,471,471,-1,471,471,-1,471,471,471,471,471,-1,471,471,471,471,471,471,-1,471,-2,471,471,-5,471,471,-2,471,-10,471,471,-11,471,471,471,471,471,471,471,471,471,471,471,471],
    sm284=[0,472,472,472,-1,0,-4,0,-4,-1,472,-3,472,-1,472,472,-13,472,472,-12,472,472,-1,472,-22,472,472,472,-1,472,-6,472,-2,472,472,472,-1,472,-1,472,472,-1,472,472,-1,472,472,472,472,472,-1,472,472,472,472,472,472,-1,472,-2,472,472,-5,472,472,-2,472,-10,472,472,128,-10,472,472,472,472,472,472,472,472,472,472,472,472],
    sm285=[0,473,473,473,-1,0,-4,0,-4,-1,473,-3,473,-1,473,473,-13,473,473,-12,473,473,-1,473,-22,473,473,473,-1,473,-6,473,-2,473,473,473,-1,473,-1,473,473,-1,473,473,-1,473,473,473,473,473,-1,473,473,473,473,473,473,-1,473,-2,473,473,-5,473,473,-2,473,-10,473,473,473,130,-9,473,473,473,473,473,473,473,473,473,473,473,473],
    sm286=[0,474,474,474,-1,0,-4,0,-4,-1,474,-3,474,-1,474,474,-3,132,-9,474,474,-12,474,474,-1,474,-22,474,474,474,-1,474,-6,474,-2,474,474,474,-1,474,-1,474,474,-1,474,474,-1,474,474,474,474,474,-1,474,474,474,474,474,474,-1,474,-2,474,474,-5,474,474,-2,474,-10,474,474,474,474,133,134,135,-6,474,474,474,474,474,474,474,474,474,474,474,474],
    sm287=[0,475,475,475,-1,0,-4,0,-4,-1,475,-3,137,-1,475,475,-3,475,-3,138,-5,475,475,-12,475,475,-1,475,-14,139,-2,140,-4,475,475,475,-1,475,-6,475,-2,475,475,475,-1,475,-1,475,475,-1,475,475,-1,475,475,475,475,475,-1,475,475,475,475,475,475,-1,475,-2,475,475,-5,475,475,-2,475,-10,475,475,475,475,475,475,475,141,142,-4,475,475,475,475,475,475,475,475,475,475,475,475],
    sm288=[0,476,476,476,-1,0,-4,0,-4,-1,476,-3,476,-1,476,476,-3,476,-3,476,-5,476,476,-12,476,476,-1,476,-14,476,-2,476,-4,476,476,476,-1,476,-6,476,-2,476,476,476,-1,476,-1,476,476,-1,476,476,-1,476,476,476,476,476,-1,476,476,476,476,476,476,-1,476,-2,476,476,-5,476,476,-2,476,-10,476,476,476,476,476,476,476,476,476,144,145,146,-1,476,476,476,476,476,476,476,476,476,476,476,476],
    sm289=[0,477,477,477,-1,0,-4,0,-4,-1,477,-3,477,-1,477,477,-3,477,-3,477,-5,477,477,-12,477,477,-1,477,-14,477,-2,477,-4,477,477,477,-1,477,-6,477,-2,477,477,477,-1,477,-1,477,477,-1,477,477,-1,477,477,477,477,477,-1,477,477,477,477,477,477,-1,477,-2,477,477,-5,477,477,-2,477,-10,477,477,477,477,477,477,477,477,477,144,145,146,-1,477,477,477,477,477,477,477,477,477,477,477,477],
    sm290=[0,478,478,478,-1,0,-4,0,-4,-1,478,-3,478,-1,478,478,-3,478,-3,478,-5,478,478,-12,478,478,-1,478,-14,478,-2,478,-4,478,478,478,-1,478,-6,478,-2,478,478,478,-1,478,-1,478,478,-1,478,478,-1,478,478,478,478,478,-1,478,478,478,478,478,478,-1,478,-2,478,478,-5,478,478,-2,478,-10,478,478,478,478,478,478,478,478,478,144,145,146,-1,478,478,478,478,478,478,478,478,478,478,478,478],
    sm291=[0,479,479,479,-1,0,-4,0,-4,-1,479,-3,479,-1,479,479,-3,479,-3,479,-5,479,479,-12,479,479,-1,479,-14,479,-2,479,-4,148,479,479,-1,479,-6,479,-2,479,149,479,-1,479,-1,479,479,-1,479,479,-1,479,479,479,479,479,-1,479,479,479,479,479,479,-1,479,-2,479,479,-5,479,479,-2,479,-10,479,479,479,479,479,479,479,479,479,479,479,479,-1,479,479,479,479,479,479,479,479,479,479,479,479],
    sm292=[0,480,480,480,-1,0,-4,0,-4,-1,480,-3,480,-1,480,480,-3,480,-3,480,-5,480,480,-12,480,480,-1,480,-14,480,-2,480,-4,148,480,480,-1,480,-6,480,-2,480,149,480,-1,480,-1,480,480,-1,480,480,-1,480,480,480,480,480,-1,480,480,480,480,480,480,-1,480,-2,480,480,-5,480,480,-2,480,-10,480,480,480,480,480,480,480,480,480,480,480,480,-1,480,480,480,480,480,480,480,480,480,480,480,480],
    sm293=[0,481,481,481,-1,0,-4,0,-4,-1,481,-3,481,-1,481,481,-3,481,-3,481,-5,481,481,-12,481,481,-1,481,-14,481,-2,481,-4,148,481,481,-1,481,-6,481,-2,481,149,481,-1,481,-1,481,481,-1,481,481,-1,481,481,481,481,481,-1,481,481,481,481,481,481,-1,481,-2,481,481,-5,481,481,-2,481,-10,481,481,481,481,481,481,481,481,481,481,481,481,-1,481,481,481,481,481,481,481,481,481,481,481,481],
    sm294=[0,482,482,482,-1,0,-4,0,-4,-1,482,-3,482,151,482,482,-3,482,-3,482,-5,482,482,-12,482,482,-1,482,-14,482,152,-1,482,-4,482,482,482,153,482,-6,482,-2,482,482,482,-1,482,-1,482,482,-1,482,482,-1,482,482,482,482,482,-1,482,482,482,482,482,482,-1,482,-2,482,482,-5,482,482,-2,482,-10,482,482,482,482,482,482,482,482,482,482,482,482,-1,482,482,482,482,482,482,482,482,482,482,482,482],
    sm295=[0,483,483,483,-1,0,-4,0,-4,-1,483,-3,483,151,483,483,-3,483,-3,483,-5,483,483,-12,483,483,-1,483,-14,483,152,-1,483,-4,483,483,483,153,483,-6,483,-2,483,483,483,-1,483,-1,483,483,-1,483,483,-1,483,483,483,483,483,-1,483,483,483,483,483,483,-1,483,-2,483,483,-5,483,483,-2,483,-10,483,483,483,483,483,483,483,483,483,483,483,483,-1,483,483,483,483,483,483,483,483,483,483,483,483],
    sm296=[0,484,484,484,-1,0,-4,0,-4,-1,484,-3,484,484,484,484,-3,484,-3,484,-5,484,484,-12,484,484,-1,484,-14,484,484,-1,484,-4,484,484,484,484,484,-6,484,-2,484,484,484,-1,484,-1,484,484,-1,484,484,-1,484,484,484,484,484,-1,484,484,484,484,484,484,-1,484,-2,484,484,-5,484,484,-2,484,-10,484,484,484,484,484,484,484,484,484,484,484,484,-1,484,484,484,484,484,484,484,484,484,484,484,484],
    sm297=[0,485,485,485,-1,0,-4,0,-4,-1,485,-3,485,485,485,485,-3,485,-3,485,-5,485,485,-12,485,485,-1,485,-14,485,485,-1,485,-4,485,485,485,485,485,-6,485,-2,485,485,485,-1,485,-1,485,485,-1,485,485,-1,485,485,485,485,485,-1,485,485,485,485,485,485,-1,485,-2,485,485,-5,485,485,-2,485,-10,485,485,485,485,485,485,485,485,485,485,485,485,-1,485,485,485,485,485,485,485,485,485,485,485,485],
    sm298=[0,486,486,486,-1,0,-4,0,-4,-1,486,-3,486,486,486,486,-3,486,-3,486,-5,486,486,-12,486,486,-1,486,-14,486,486,-1,486,-4,486,486,486,486,486,-6,486,-2,486,486,486,-1,486,-1,486,486,-1,486,486,-1,486,486,486,486,486,-1,486,486,486,486,486,486,-1,486,-2,486,486,-5,486,486,-2,486,-10,486,486,486,486,486,486,486,486,486,486,486,486,-1,486,486,486,486,486,486,486,486,486,486,486,486],
    sm299=[0,487,487,487,-1,0,-4,0,-4,-1,487,-3,487,487,487,487,-3,487,-3,487,-5,487,487,-12,487,487,-1,487,-14,487,487,-1,487,-4,487,487,487,487,487,-6,487,-2,487,487,487,-1,487,-1,487,487,-1,487,487,-1,487,487,487,487,487,-1,487,487,487,487,487,487,-1,487,-2,487,487,-5,487,487,-2,487,-10,487,487,487,487,487,487,487,487,487,487,487,487,-1,487,487,487,487,487,487,487,487,487,487,487,487],
    sm300=[0,488,488,488,-1,0,-4,0,-4,-1,488,-3,488,488,488,488,-2,488,488,-3,488,-5,488,488,-12,488,488,-1,488,-14,488,488,-1,488,-4,488,488,488,488,488,488,488,-1,488,-2,488,-2,488,488,488,-1,488,-1,488,488,-1,488,488,-1,488,488,488,488,488,488,488,488,488,488,488,488,-1,488,-2,488,488,-5,488,488,-2,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488,488],
    sm301=[0,-4,0,-4,0,-4,-1,-22,489],
    sm302=[0,-4,0,-4,0,-4,-1,-7,490,-27,491],
    sm303=[0,-4,0,-4,0,-4,-1,-7,492],
    sm304=[0,493,493,493,-1,0,-4,0,-4,-1,493,-3,493,493,493,493,-2,493,493,-3,493,-5,493,493,-12,493,493,-1,493,-14,493,493,-1,493,-4,493,493,493,493,493,493,493,-1,493,-2,493,-2,493,493,493,-1,493,-1,493,493,-1,493,493,-1,493,493,493,493,493,493,493,493,493,493,493,493,-1,493,-2,493,493,-5,493,493,-2,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493,493],
    sm305=[0,-4,0,-4,0,-4,-1,-7,494,-27,495],
    sm306=[0,-4,0,-4,0,-4,-1,-7,496,-27,496],
    sm307=[0,-4,0,-4,0,-4,-1,-7,497,-27,497],
    sm308=[0,-4,0,-4,0,-4,-1,-22,498],
    sm309=[0,499,499,499,-1,0,-4,0,-4,-1,499,-3,499,499,499,499,-2,499,499,-3,499,-5,499,499,-12,499,499,-1,499,-14,499,499,-1,499,-4,499,499,499,499,499,499,499,-1,499,-2,499,-2,499,499,499,-1,499,-1,499,499,-1,499,499,-1,499,499,499,499,499,499,499,499,499,499,499,499,-1,499,-2,499,499,-5,499,499,-2,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499,499],
    sm310=[0,500,500,500,-1,0,-4,0,-4,-1,500,-3,500,500,500,500,-2,500,500,-3,500,-5,500,500,-12,500,500,-1,500,-14,500,500,-1,500,-4,500,500,500,500,500,500,500,-1,500,-2,500,-2,500,500,500,-1,500,-1,500,500,-1,500,500,-1,500,500,500,500,500,500,500,500,500,500,500,500,-1,500,-2,500,500,-5,500,500,-2,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500],
    sm311=[0,501,501,501,-1,0,-4,0,-4,-1,501,-3,501,501,501,501,-2,501,501,-3,501,-5,501,501,-12,501,501,-1,501,-14,501,501,-1,501,-4,501,501,501,501,501,501,501,-1,501,-2,501,-2,501,501,501,-1,501,-1,501,501,-1,501,501,-1,501,501,501,501,501,501,501,501,501,501,501,501,-1,501,-2,501,501,-5,501,501,-2,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501],
    sm312=[0,502,502,502,-1,0,-4,0,-4,-1,502,-3,502,502,502,502,-2,502,502,-3,502,-5,502,502,-12,502,502,-1,502,-4,502,-9,502,502,-1,502,-4,502,502,502,502,502,502,502,-1,502,-2,502,-2,502,502,502,502,502,-1,502,502,-1,502,502,-1,502,502,502,502,502,502,502,502,502,502,502,502,-1,502,-2,502,502,502,502,-3,502,502,-2,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502],
    sm313=[0,503,503,503,-1,503,-4,503,-4,503,503,-3,503,503,503,503,-2,503,503,-2,503,503,-5,503,503,-12,503,503,-1,503,-4,503,-9,503,503,-1,503,-4,503,503,503,503,503,503,503,-1,503,-2,503,-2,503,503,503,503,503,-1,503,503,-1,503,503,-1,503,503,503,503,503,503,503,503,503,503,503,503,-1,503,-2,503,503,503,503,-3,503,503,-2,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503],
    sm314=[0,504,504,504,-1,0,-4,0,-4,-1,504,-3,504,504,504,504,-2,504,504,-3,504,-5,504,504,-12,504,504,-1,504,-14,504,504,-1,504,-4,504,504,504,504,504,504,504,-1,504,-2,504,-2,504,504,504,-1,504,-1,504,504,-1,504,504,-1,504,504,504,504,504,504,504,504,504,504,504,504,-1,504,-2,504,504,-5,504,504,-2,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504],
    sm315=[0,-1,505,505,-1,505,505,505,505,505,0,-4,-1,-144,505],
    sm316=[0,-1,506,506,-1,506,506,506,506,506,0,-4,-1,-145,506],
    sm317=[0,507,507,507,-1,0,-4,0,-4,-1,507,-3,507,507,507,507,-2,507,507,-3,507,-5,507,507,-12,507,507,-1,507,-14,507,507,-1,507,-4,507,507,507,507,507,507,507,-1,507,-2,507,-2,507,507,507,-1,507,-1,507,507,-1,507,507,-1,507,507,507,507,507,507,507,507,507,507,507,507,-1,507,-2,507,507,507,-4,507,507,-2,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507],
    sm318=[0,-4,0,-4,0,-4,-1,-7,508,-105,509],
    sm319=[0,-4,0,-4,0,-4,-1,-7,510],
    sm320=[0,-4,0,-4,0,-4,-1,-7,511],
    sm321=[0,512,512,512,-1,0,-4,0,-4,-1,512,-3,512,512,512,512,-2,512,512,-3,512,-5,512,512,-12,512,512,-1,512,-14,512,512,-1,512,-4,512,512,512,512,512,512,512,-1,512,-2,512,-2,512,512,512,-1,512,-1,512,512,-1,512,512,-1,512,512,512,512,512,512,512,512,512,512,512,512,-1,512,-2,512,512,-5,512,512,-2,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512,512],
    sm322=[0,-4,0,-4,0,-4,-1,-22,513],
    sm323=[0,514,514,514,-1,0,-4,0,-4,-1,514,-3,514,-1,514,514,-13,514,514,-12,514,514,-1,514,-22,514,514,-9,514,-2,514,514,514,-1,514,-1,514,514,-1,514,514,-1,514,514,514,514,514,-1,514,514,514,514,514,514,-1,514,-2,514,514,-5,514,514,-2,514,-23,514,514,514,514,514,514,514,514,514,514,514,514],
    sm324=[0,515,515,515,-1,0,-4,0,-4,-1,515,-3,515,-1,515,515,-13,515,515,-12,515,515,-1,515,-22,515,515,-9,515,-2,515,515,515,-1,515,-1,515,515,-1,515,515,-1,515,515,515,515,515,-1,515,515,515,515,515,515,-1,515,-2,515,515,-5,515,515,-2,515,-23,515,515,515,515,515,515,515,515,515,515,515,515],
    sm325=[0,516,516,516,-1,0,-4,0,-4,-1,516,-1,516,-1,516,-1,516,-14,516,-14,516,-1,516,-22,516,516,-9,516,-3,516,516,-1,516,516,516,516,-1,516,516,516,516,516,516,516,516,-1,516,516,516,516,516,516,516,516,-2,516,516,-5,516,516,-2,516,-23,516,516,516,516,516,516,516,516,516,516,516,516],
    sm326=[0,517,517,517,-1,0,-4,0,-4,-1,517,-1,517,-1,517,-1,517,-14,517,-14,517,-1,517,-22,517,517,-9,517,-3,517,517,-1,517,517,517,517,-1,517,517,517,517,517,517,517,517,-1,517,517,517,517,517,517,517,517,-2,517,517,-5,517,517,-2,517,-23,517,517,517,517,517,517,517,517,517,517,517,517],
    sm327=[0,518,518,518,-1,0,-4,0,-4,-1,518,-1,518,-1,518,-1,518,-14,518,-14,518,-1,518,-22,518,518,-9,518,-3,518,518,-1,518,518,518,518,-1,518,518,518,518,518,518,518,518,-1,518,518,518,518,518,518,518,518,-2,518,518,-5,518,518,-2,518,-23,518,518,518,518,518,518,518,518,518,518,518,518],
    sm328=[0,-4,0,-4,0,-4,-1,-35,519,-36,519],
    sm329=[0,-4,0,-4,0,-4,-1,-7,520,-2,520,-11,520,-12,520,-2,520,-17,520,-35,520],
    sm330=[0,-4,0,-4,0,-4,-1,-38,521],
    sm331=[0,-4,0,-4,0,-4,-1,-35,522,-2,523],
    sm332=[0,-4,0,-4,0,-4,-1,-35,524,-2,524],
    sm333=[0,-4,0,-4,0,-4,-1,-35,525,-2,525],
    sm334=[0,-4,0,-4,0,-4,-1,-75,526],
    sm335=[0,-4,0,-4,0,-4,-1,-7,527,-2,345,-11,527,-12,527,-2,527],
    sm336=[0,-4,0,-4,0,-4,-1,-6,432,-68,432],
    sm337=[0,-4,0,-4,0,-4,-1,-7,528,-2,528,-11,528,-12,528,-2,528,-17,528,-35,528],
    sm338=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,529,-12,440,216,-40,11,-35,352,-35,45],
    sm339=[0,-4,0,-4,0,-4,-1,-22,530],
    sm340=[0,-4,0,-4,0,-4,-1,-22,531,-12,532],
    sm341=[0,-4,0,-4,0,-4,-1,-22,533,-12,533],
    sm342=[0,-4,0,-4,0,-4,-1,-22,534,-12,534],
    sm343=[0,-4,0,-4,0,-4,-1,-7,535,-14,535,-12,535,-2,535],
    sm344=[0,-4,0,-4,0,-4,-1,-7,535,-2,345,-11,535,-12,535,-2,535],
    sm345=[0,-4,0,-4,0,-4,-1,-7,536],
    sm346=[0,-4,0,-4,0,-4,-1,-6,537],
    sm347=[0,-4,0,-4,0,-4,-1,-7,538],
    sm348=[0,-4,0,-4,0,-4,-1,-72,539],
    sm349=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-9,540,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm350=[0,-4,0,-4,0,-4,-1,-56,541],
    sm351=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-9,542,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm352=[0,-4,0,-4,0,-4,-1,-92,543],
    sm353=[0,-4,0,-4,0,-4,-1,-72,544],
    sm354=[0,-4,0,-4,0,-4,-1,-4,104,104,-4,105,104,-3,104,-19,104,-17,104,104,-1,104,-4,104,-1,104,104,104,-1,106,-1,107,-2,104,-3,104,-15,545,-22,108,109,110,111,112,113,114,115,116,117,104,104,104,104,104,104,104,104,104,104,104,104,104,-4,118,119],
    sm355=[0,-4,0,-4,0,-4,-1,-56,546,-35,545],
    sm356=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,158,-40,11,-3,13,14,-1,15,-2,547,-16,30,-5,31,32,-2,33,-29,40,41,42,43,44,45],
    sm357=[0,-4,0,-4,0,-4,-1,-7,548],
    sm358=[0,549,549,549,-1,0,-4,0,-4,-1,549,-1,549,-1,549,-1,549,-14,549,-14,549,-1,549,-22,549,549,-9,549,-3,549,549,-1,549,549,549,549,-1,549,549,549,549,549,549,549,549,-1,549,549,549,549,549,549,549,549,-2,549,549,-5,549,549,-2,549,-23,549,549,549,549,549,549,549,549,549,549,549,549],
    sm359=[0,550,550,550,-1,0,-4,0,-4,-1,550,-1,550,-1,550,-1,550,-14,550,-14,550,-1,550,-22,550,550,-9,550,-3,550,550,-1,550,550,550,550,-1,550,550,550,550,550,550,550,550,-1,550,550,550,550,550,550,550,550,-2,550,550,-5,550,550,-2,550,-23,550,550,550,550,550,550,550,550,550,550,550,550],
    sm360=[0,551,551,551,-1,0,-4,0,-4,-1,551,-1,551,-1,551,-1,551,-14,551,-14,551,-1,551,-22,551,551,-9,551,-3,551,551,-1,551,551,551,551,-1,551,551,551,551,551,551,551,551,-1,551,551,551,551,551,551,551,551,-2,551,551,-5,551,551,-2,551,-23,551,551,551,551,551,551,551,551,551,551,551,551],
    sm361=[0,-4,0,-4,0,-4,-1,-7,552],
    sm362=[0,553,553,553,-1,0,-4,0,-4,-1,553,-1,553,-1,553,-1,553,-14,553,-14,553,-1,553,-22,553,553,-9,553,-3,553,553,-1,553,553,553,553,-1,553,553,553,553,553,553,553,553,-1,553,553,553,553,553,553,553,553,-2,553,553,-5,553,553,-2,553,-23,553,553,553,553,553,553,553,553,553,553,553,553],
    sm363=[0,554,554,554,-1,0,-4,0,-4,-1,554,-1,554,-1,554,-1,554,-14,554,-14,554,-1,554,-22,554,554,-9,554,-3,554,554,-1,554,554,554,554,-1,554,554,554,554,554,554,554,554,-1,554,554,554,554,554,554,554,554,-1,365,554,554,-5,554,554,-2,554,-23,554,554,554,554,554,554,554,554,554,554,554,554],
    sm364=[0,555,555,555,-1,0,-4,0,-4,-1,555,-1,555,-1,555,-1,555,-14,555,-14,555,-1,555,-22,555,555,-9,555,-3,555,555,-1,555,555,555,555,-1,555,555,555,555,555,555,555,555,-1,555,555,555,555,555,555,555,555,-2,555,555,-5,555,555,-2,555,-23,555,555,555,555,555,555,555,555,555,555,555,555],
    sm365=[0,-4,0,-4,0,-4,-1,-6,556],
    sm366=[0,557,557,557,-1,0,-4,0,-4,-1,557,-1,557,-1,557,557,557,557,-2,557,557,-3,557,-5,557,557,-12,557,557,-1,557,-14,557,557,-1,557,-4,557,557,557,557,557,557,557,-1,557,-2,557,-2,557,557,557,-1,557,557,557,557,-1,557,557,-1,557,557,557,557,557,557,557,557,557,557,557,557,557,557,-2,557,557,-5,557,557,-2,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557],
    sm367=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,558,-33,370,-4,11,-29,371,277,278,-34,40,41,-3,45],
    sm368=[0,-4,0,-4,0,-4,-1,-38,559],
    sm369=[0,560,560,560,-1,0,-4,0,-4,-1,560,-1,560,-1,560,560,560,560,-2,560,560,-3,560,-5,560,560,-12,560,560,-1,560,-14,560,560,-1,560,-4,560,560,560,560,560,560,560,-1,560,-2,560,-2,560,560,560,-1,560,560,560,560,-1,560,560,-1,560,560,560,560,560,560,560,560,560,560,560,560,560,560,-2,560,560,-5,560,560,-2,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560,560],
    sm370=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,561,-33,370,-4,11,-29,371,277,278,-34,40,41,-3,45],
    sm371=[0,-1,562,562,-1,0,-4,0,-4,-1,-21,562,-16,562,-33,562,-4,562,-29,562,562,562,-34,562,562,-3,562],
    sm372=[0,-1,563,563,-1,0,-4,0,-4,-1,-21,563,-16,563,-33,563,-4,563,-29,563,563,563,-34,563,563,-3,563],
    sm373=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-55,11,-30,277,278,-34,40,41,-3,45],
    sm374=[0,-4,0,-4,0,-4,-1,-6,434],
    sm375=[0,-4,0,-4,0,-4,-1,-6,432],
    sm376=[0,-4,0,-4,0,-4,-1,-36,564],
    sm377=[0,-2,2,-1,0,-4,0,-4,-1,-7,565,-13,215,-14,216,-40,11,-35,352,-35,45],
    sm378=[0,-4,0,-4,0,-4,-1,-7,566],
    sm379=[0,-4,0,-4,0,-4,-1,-36,567],
    sm380=[0,-4,0,-4,0,-4,-1,-7,568],
    sm381=[0,-4,0,-4,0,-4,-1,-7,568,-27,569],
    sm382=[0,-4,0,-4,0,-4,-1,-7,570],
    sm383=[0,-4,0,-4,0,-4,-1,-7,571,-27,571],
    sm384=[0,-4,0,-4,0,-4,-1,-7,572,-27,572],
    sm385=[0,573,573,573,-1,0,-4,0,-4,-1,573,-1,573,-1,573,-1,573,-14,573,-14,573,-1,573,-22,573,573,-9,573,-3,573,573,-1,573,573,573,573,-1,573,573,-1,573,573,573,573,573,-1,573,573,573,573,573,573,573,573,-2,573,573,-5,573,573,-2,573,-23,573,573,573,573,573,573,573,573,573,573,573,573],
    sm386=[0,-4,0,-4,0,-4,-1,-35,574,-36,574],
    sm387=[0,-4,0,-4,0,-20,575],
    sm388=[0,-4,0,-4,0,-7,576,-1,577,-31,577],
    sm389=[0,-2,578,-1,0,-4,0,-4,-1,-5,578,-9,578,-128,578,578],
    sm390=[0,-2,52,-1,0,-4,0,-4,-1,-6,404,-137,579,580],
    sm391=[0,-4,0,-4,0,-4,-1,-145,581],
    sm392=[0,-2,582,-1,0,-4,0,-4,-1,-5,582,-4,582,-4,582,-128,582,582],
    sm393=[0,-4,0,-4,0,-4,-1,-144,583],
    sm394=[0,-2,386,-1,0,-4,0,-7,584,-11,388,-6,389,-14,390,-3,391,-23,392,393,394,-8,395],
    sm395=[0,-4,0,-4,0,-7,585],
    sm396=[0,-4,0,-4,0,-156,586],
    sm397=[0,-4,0,-4,0,-4,-1,-2,587],
    sm398=[0,-2,386,-1,0,-4,0,-4,-1,-2,588,-11,388,-6,389,-14,390,-3,391,-23,392,393,394,-8,395],
    sm399=[0,-2,386,-1,0,-4,0,-4,-1,-2,589,-11,388,-6,389,-14,390,-3,391,-23,392,393,394,-8,395],
    sm400=[0,-2,590,-1,0,-4,0,-4,-1,-2,590,-11,590,-6,590,-14,590,-3,590,-23,590,590,590,-8,590],
    sm401=[0,-2,591,-1,0,-4,0,-4,-1,-2,591,-11,591,-6,591,-14,591,-3,591,-23,591,591,591,-5,592,-2,591],
    sm402=[0,-4,0,-4,0,-4,-1,593,-38,594,-1,595,-7,596],
    sm403=[0,-2,597,-1,0,-4,0,-4,-1,-2,597,-11,597,-6,597,-14,597,-3,597,-23,597,597,597,-8,597],
    sm404=[0,-2,598,-1,0,-4,0,-4,-1,-2,598,-11,598,-6,598,-14,598,-3,598,-23,598,598,598,-8,598],
    sm405=[0,-4,0,-4,0,-4,-1,-35,599,600],
    sm406=[0,-2,386,-1,0,-4,0,-4,-1,-40,391],
    sm407=[0,-4,0,-4,0,-4,-1,-35,601,601],
    sm408=[0,-2,386,-1,0,-4,0,-4,-1,-7,602,-6,388,603,-5,389,-13,602,602,-24,604,605,606,392,393,394,-8,395],
    sm409=[0,-2,607,-1,0,-4,0,-4,-1,-7,607,-6,388,607,-5,389,-13,607,607,-24,607,607,607,607,607,394,-8,395],
    sm410=[0,-2,607,-1,0,-4,0,-4,-1,-7,607,-6,607,607,-5,607,-13,607,607,-24,607,607,607,607,607,607,-8,608],
    sm411=[0,-2,609,-1,0,-4,0,-4,-1,-7,609,-6,609,609,-5,609,-13,609,609,-24,609,609,609,609,609,609,-8,609],
    sm412=[0,-2,386,-1,0,-4,0,-4,-1,-64,610],
    sm413=[0,-2,611,-1,0,-4,0,-4,-1,-7,611,-6,611,611,-5,611,-13,611,611,-24,611,611,611,611,612,611,-8,611],
    sm414=[0,-2,613,-1,0,-4,0,-4,-1,-7,613,-2,613,-3,613,613,-5,613,613,-12,613,613,-24,613,613,613,613,612,613,613,613,613,-5,613],
    sm415=[0,-4,0,-4,0,-4,-1,-65,614],
    sm416=[0,-2,615,-1,0,-4,0,-4,-1,-64,615],
    sm417=[0,-2,616,-1,617,-4,618,-3,619,-1,-2,619,-1,619,-1,619,619,-2,619,-3,619,619,-5,619,619,-12,619,619,-3,619,-4,619,-7,619,-7,619,619,619,619,619,619,619,619,619,619,619,619,-2,619,620,621],
    sm418=[0,-2,622,-1,622,-4,622,-3,622,-1,-2,622,-1,622,-1,622,622,-2,622,-3,622,622,-5,622,622,-12,622,622,-3,622,-4,622,-7,622,-7,622,622,622,622,622,622,622,622,622,622,622,622,-2,622,622,622],
    sm419=[0,-2,623,-1,0,-4,0,-4,-1,-7,623,-6,623,623,-5,623,-13,623,623,-24,623,623,623,623,623,623,-8,623],
    sm420=[0,-2,624,-1,0,-4,0,-4,-1,-7,624,-6,624,624,-5,624,-13,624,624,-24,624,624,624,624,624,624,-8,624],
    sm421=[0,-2,386,-1,0,-4,0,-4,-1],
    sm422=[0,-2,386,-1,0,-4,0,-4,-1,-64,625,393],
    sm423=[0,-2,386,-1,0,-4,0,-4,-1,-75,626],
    sm424=[0,-2,627,-1,0,-4,0,-4,-1,-7,627,-6,627,627,-5,627,-13,627,627,-24,627,627,627,627,627,627,-8,627],
    sm425=[0,-2,628,-1,0,-4,0,-4,-1,-7,628,-6,628,628,-5,628,-13,628,628,-24,628,628,628,628,628,628,-8,626],
    sm426=[0,-4,0,-4,0,-4,-1,-72,629],
    sm427=[0,-4,0,-4,0,-4,-1,-72,630],
    sm428=[0,-4,0,-4,0,-4,-1,-72,631],
    sm429=[0,-1,1,2,-1,0,-4,0,-7,632,-1,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm430=[0,-4,0,-4,0,-7,633],
    sm431=[0,-4,0,-4,0,-157,634],
    sm432=[0,-4,0,-4,0,-4,-1,-2,635,-35,635],
    sm433=[0,-4,0,-4,0,-4,-1,-2,636,-35,636],
    sm434=[0,-1,1,2,-1,0,-4,0,-7,637,-1,78,-1,5,-29,85,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm435=[0,-4,0,-4,0,-7,638],
    sm436=[0,-4,0,-4,0,-158,639],
    sm437=[0,-1,247,248,-1,249,250,251,252,253,402,-4,-1,-2,640,-1,78,-1,404,-14,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm438=[0,-4,0,-4,0,-4,-1,-15,641],
    sm439=[0,-4,0,-4,0,-4,-1,-2,642],
    sm440=[0,-2,52,-1,0,-4,0,-4,-1],
    sm441=[0,-1,247,248,-1,249,250,251,252,253,402,-4,-1,-2,643,-1,78,-1,404,-14,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm442=[0,-1,644,644,-1,644,644,644,644,644,644,-4,-1,-2,644,-1,644,-1,644,-14,644,-1,644,-1,644,-3,644,-6,644,-134,644],
    sm443=[0,-1,645,645,-1,645,645,645,645,645,645,-4,-1,-2,645,-1,645,-1,645,-14,645,-1,645,-1,645,-3,645,-6,645,-134,645],
    sm444=[0,-1,646,646,-1,646,646,646,646,646,646,-4,-1,-2,646,-1,646,-1,646,-14,646,-1,646,-1,646,-3,646,-6,646,-134,646],
    sm445=[0,-1,647,248,-1,249,250,251,252,253,648,-4,-1,-2,648,-1,77,-1,404,-4,649,-1,650,651,652,-3,653,-1,405,-1,406,-1,407,-3,408,-6,409,-24,654,-2,655,-106,254],
    sm446=[0,-1,656,656,-1,657,656,656,656,656,656,-4,-1,-2,656,-1,656,-1,656,-4,656,-1,656,656,656,-3,656,-1,656,-1,656,-1,656,-3,656,-6,656,-24,656,-2,656,-106,656],
    sm447=[0,-1,658,658,-1,658,658,658,658,658,658,-4,-1,-2,658,-1,658,-1,658,658,-6,658,-6,658,-1,658,658,658,658,-2,658,-6,658,-1,658,-132,658],
    sm448=[0,-1,659,659,-1,659,659,659,659,659,659,-7,659,-1,659,-1,659,659,-6,659,-6,659,-1,659,659,659,659,-2,659,-6,659,-1,659,-132,659],
    sm449=[0,-1,247,248,-1,249,250,251,252,253,659,-4,-1,-2,659,-1,659,-1,659,659,-6,659,-6,659,-1,659,659,659,659,-2,659,-6,659,-1,659,-132,254],
    sm450=[0,-1,660,660,-1,660,660,660,660,660,660,-4,-1,-2,660,-1,660,-1,660,660,-6,660,-6,660,-1,660,660,660,660,-2,660,-6,660,-1,660,-132,660],
    sm451=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-6,404,-14,405,-1,406,-1,407,-3,408,-6,661,-134,254],
    sm452=[0,-1,662,662,-1,662,662,662,662,662,662,-4,-1,-2,662,-1,662,-1,662,662,-6,662,-6,662,-1,662,662,662,662,-2,662,-6,662,-1,662,-132,662],
    sm453=[0,-1,663,663,-1,663,663,663,663,663,663,-4,-1,-2,663,-1,663,-1,663,663,-6,663,-6,663,-1,663,663,663,663,-2,663,-6,663,-1,663,-132,663],
    sm454=[0,-1,664,665,-1,249,250,251,252,253,0,-4,-1,-4,78,-1,666,-14,667,-1,406,-1,407,-3,408,-6,668,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45,-21,254],
    sm455=[0,-1,669,670,671,672,673,674,675,676,0,-4,-1,-14,677],
    sm456=[0,-1,678,678,-1,678,678,678,678,678,678,-7,678,-1,678,678,678,678,-6,678,678,-5,678,678,678,678,678,678,-2,678,-6,678,-1,678,-105,678,678,-25,678],
    sm457=[0,-4,-1,-4,0,-11,679],
    sm458=[0,680,680,680,-1,680,680,680,680,680,680,-4,-1,680,-1,680,-1,680,680,680,680,-2,680,680,-2,680,680,-5,680,680,680,-1,680,-3,680,-5,680,680,-1,680,-14,680,680,-1,680,-4,680,680,680,680,680,680,680,-1,680,-2,680,-2,680,680,680,-1,680,-1,680,680,-1,680,680,-1,680,680,680,680,680,680,680,680,680,680,680,680,-1,680,-2,680,680,-5,680,680,-2,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,680,-21,680],
    sm459=[0,681,681,681,-1,681,681,681,681,681,681,-4,-1,681,-1,682,-1,681,681,681,681,-2,681,681,-2,681,681,-5,681,681,681,-1,681,-3,681,-5,681,681,-1,681,-14,681,681,-1,681,-4,681,681,681,681,681,681,681,-1,681,-2,681,-2,681,681,681,-1,681,-1,681,681,-1,681,681,-1,681,681,681,681,681,681,681,681,681,681,681,681,-1,681,-2,681,681,-5,681,681,-2,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,681,-21,681],
    sm460=[0,-4,0,-4,0,-4,-1,-15,683],
    sm461=[0,-4,0,-4,0,-4,-1,267,268,-152,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75],
    sm462=[0,-1,684,684,-1,684,684,684,684,684,684,-4,-1,-2,684,-1,684,-1,684,-14,684,-1,684,-1,684,-3,684,-6,684,-134,684],
    sm463=[0,-1,685,685,-1,685,685,685,685,685,685,-4,-1,-2,685,-1,685,-1,685,685,-6,685,685,-5,685,-1,685,685,685,685,-2,685,-6,685,-1,685,-132,685],
    sm464=[0,-1,686,686,-1,686,686,686,686,686,686,-4,-1,-2,686,-1,686,-1,686,686,-6,686,686,-3,686,-1,686,-1,686,686,686,686,-2,686,-6,686,-1,686,-132,686],
    sm465=[0,-2,687,-1,0,-4,0,-4,-1,-5,687,-4,687,-4,687,-6,687,-121,687,687],
    sm466=[0,-2,688,-1,688,-4,688,-4,-1,-5,688,-4,688,-4,688,-6,688,-52,688,688,688,-66,688,688],
    sm467=[0,-4,0,-4,0,-43,689],
    sm468=[0,-4,0,-4,0,-43,690],
    sm469=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,691,-38,11,-30,277,278,-3,279,-30,40,41,-3,45],
    sm470=[0,692,692,692,-1,0,-4,0,-4,-1,692,-3,692,692,692,692,-2,692,692,-3,692,-5,692,692,-12,692,692,-1,692,-14,692,692,-1,692,-4,692,692,692,692,692,692,692,-1,692,-2,692,-2,692,692,692,-1,692,-1,692,692,-1,692,692,-1,692,692,692,692,692,692,692,692,692,692,692,692,-1,692,-2,692,692,-5,692,692,-2,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692,692],
    sm471=[0,693,693,693,-1,0,-4,0,-4,-1,693,-3,693,693,693,693,-2,693,693,-3,693,-5,693,693,-12,693,693,-1,693,-14,693,693,-1,693,-4,693,693,693,693,693,693,693,-1,693,-2,693,-2,693,693,693,-1,693,-1,693,693,-1,693,693,-1,693,693,693,693,693,693,693,693,693,693,693,693,-1,693,-2,693,693,-5,693,693,-2,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693],
    sm472=[0,-4,0,-4,0,-4,-1,-35,694,-2,694],
    sm473=[0,-4,0,-4,0,-4,-1,-22,695,-12,442],
    sm474=[0,-4,0,-4,0,-4,-1,-35,696,-2,696],
    sm475=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,-14,216,-40,11,-35,352,-35,45],
    sm476=[0,-4,0,-4,0,-4,-1,-6,697],
    sm477=[0,-4,0,-4,0,-4,-1,-6,698],
    sm478=[0,-4,0,-4,0,-4,-1,-22,699,-12,440],
    sm479=[0,700,700,700,-1,0,-4,0,-4,-1,700,-3,700,700,700,700,-2,700,700,-3,700,-5,700,700,-12,700,700,-1,700,-14,700,700,-1,700,-4,700,700,700,700,700,700,700,-1,700,-2,700,-2,700,700,700,-1,700,-1,700,700,-1,700,700,-1,700,700,700,700,700,700,700,700,700,700,700,700,-1,700,-2,700,700,-5,700,700,-2,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700],
    sm480=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,443,-12,281,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,282,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm481=[0,701,701,701,-1,0,-4,0,-4,-1,701,-3,701,701,701,701,-2,701,701,-3,701,-5,701,701,-12,701,701,-1,701,-14,701,701,-1,701,-4,701,701,701,701,701,701,701,-1,701,-2,701,-2,701,701,701,-1,701,-1,701,701,-1,701,701,-1,701,701,701,701,701,701,701,701,701,701,701,701,-1,701,-2,701,701,-5,701,701,-2,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701,701],
    sm482=[0,-4,0,-4,0,-4,-1,-22,702,-12,702],
    sm483=[0,-1,703,703,-1,0,-4,0,-4,-1,-4,703,-1,703,-14,703,703,-12,703,703,-24,703,703,-13,703,703,-3,703,703,-8,703,-18,703,703,-1,703,703,-23,703,703,703,703,703,703,703,703,703,703,703,703],
    sm484=[0,-4,0,-4,0,-4,-1,-22,704,-12,704],
    sm485=[0,705,705,705,-1,0,-4,0,-4,-1,705,-3,705,-1,705,-14,705,-14,705,-24,705,705,-9,705,-3,705,705,-1,705,-1,705,705,-1,705,705,-1,705,705,705,705,705,-1,705,705,705,705,705,705,-1,705,-2,705,705,-5,705,705,-2,705,-23,705,705,705,705,705,705,705,705,705,705,705,705],
    sm486=[0,-4,0,-4,0,-4,-1,-72,706],
    sm487=[0,-4,0,-4,0,-4,-1,-43,707],
    sm488=[0,-4,0,-4,0,-4,-1,-43,708],
    sm489=[0,-2,2,-1,0,-4,0,-4,-1,-38,709,-38,11,-71,45],
    sm490=[0,-4,0,-4,0,-4,-1,-43,710],
    sm491=[0,-4,0,-4,0,-4,-1,-43,711],
    sm492=[0,712,712,712,-1,0,-4,0,-4,-1,712,-3,712,-1,712,-14,712,-14,712,-24,712,712,-9,712,-3,712,712,-1,712,-1,712,712,-1,712,712,-1,712,712,712,712,712,-1,712,712,712,712,712,712,-1,712,-2,712,712,-5,712,712,-2,712,-23,712,712,712,712,712,712,712,712,712,712,712,712],
    sm493=[0,713,713,713,-1,0,-4,0,-4,-1,713,-3,713,-1,713,-14,713,-14,713,-24,713,713,-9,713,-3,713,713,-1,713,-1,713,713,-1,713,713,-1,713,713,713,713,713,-1,713,713,713,713,713,713,-1,713,-2,713,713,-5,713,713,-2,713,-23,713,713,713,713,713,713,713,713,713,713,713,713],
    sm494=[0,-2,2,-1,0,-4,0,-4,-1,-38,714,-38,11,-71,45],
    sm495=[0,-4,0,-4,0,-4,-1,-43,715,-28,715],
    sm496=[0,-4,0,-4,0,-4,-1,-43,716,-28,716],
    sm497=[0,717,717,717,-1,0,-4,0,-4,-1,717,-3,717,717,717,717,-2,717,717,-3,717,-5,717,717,-12,717,717,-1,717,-14,717,717,-1,717,-4,717,717,717,717,717,717,717,-1,717,-2,717,-2,717,717,717,-1,717,-1,717,717,-1,717,717,-1,717,717,717,717,717,717,717,717,717,717,717,717,-1,717,-2,717,717,-5,717,717,-2,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717,717],
    sm498=[0,-4,0,-4,0,-4,-1,-7,718],
    sm499=[0,719,719,719,-1,0,-4,0,-4,-1,719,-3,719,719,719,719,-2,719,719,-3,719,-5,719,719,-12,719,719,-1,719,-14,719,719,-1,719,-4,719,719,719,719,719,719,719,-1,719,-2,719,-2,719,719,719,-1,719,-1,719,719,-1,719,719,-1,719,719,719,719,719,719,719,719,719,719,719,719,-1,719,-2,719,719,-5,719,719,-2,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719,719],
    sm500=[0,720,720,720,-1,0,-4,0,-4,-1,720,-3,720,720,720,720,-2,720,720,-3,720,-5,720,720,-12,720,720,-1,720,-14,720,720,-1,720,-4,720,720,720,720,720,720,720,-1,720,-2,720,-2,720,720,720,-1,720,-1,720,720,-1,720,720,-1,720,720,720,720,720,720,720,720,720,720,720,720,-1,720,-2,720,720,-5,720,720,-2,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720],
    sm501=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,319,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm502=[0,-4,0,-4,0,-4,-1,-7,721,-27,721],
    sm503=[0,722,722,722,-1,0,-4,0,-4,-1,722,-3,722,722,722,722,-2,722,722,-3,722,-5,722,722,-12,722,722,-1,722,-14,722,722,-1,722,-4,722,722,722,722,722,722,722,-1,722,-2,722,-2,722,722,722,-1,722,-1,722,722,-1,722,722,-1,722,722,722,722,722,722,722,722,722,722,722,722,-1,722,-2,722,722,-5,722,722,-2,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722,722],
    sm504=[0,723,723,723,-1,0,-4,0,-4,-1,723,-3,723,723,723,723,-2,723,723,-3,723,-5,723,723,-12,723,723,-1,723,-14,723,723,-1,723,-4,723,723,723,723,723,723,723,-1,723,-2,723,-2,723,723,723,-1,723,-1,723,723,-1,723,723,-1,723,723,723,723,723,723,723,723,723,723,723,723,-1,723,-2,723,723,723,-4,723,723,-2,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723],
    sm505=[0,724,724,724,-1,0,-4,0,-4,-1,724,-3,724,724,724,724,-2,724,724,-3,724,-5,724,724,-12,724,724,-1,724,-14,724,724,-1,724,-4,724,724,724,724,724,724,724,-1,724,-2,724,-2,724,724,724,-1,724,-1,724,724,-1,724,724,-1,724,724,724,724,724,724,724,724,724,724,724,724,-1,724,-2,724,724,724,-4,724,724,-2,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724],
    sm506=[0,725,725,725,-1,0,-4,0,-4,-1,725,-3,725,725,725,725,-2,725,725,-3,725,-5,725,725,-12,725,725,-1,725,-14,725,725,-1,725,-4,725,725,725,725,725,725,725,-1,725,-2,725,-2,725,725,725,-1,725,-1,725,725,-1,725,725,-1,725,725,725,725,725,725,725,725,725,725,725,725,-1,725,-2,725,725,-5,725,725,-2,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725],
    sm507=[0,-4,0,-4,0,-4,-1,-38,726],
    sm508=[0,-4,0,-4,0,-4,-1,-38,727],
    sm509=[0,-4,0,-4,0,-4,-1,-35,728,-36,728],
    sm510=[0,-4,0,-4,0,-4,-1,-7,729,-14,729,-12,729,-2,729,-33,729],
    sm511=[0,-4,0,-4,0,-4,-1,-7,730,-2,730,-11,730,-12,730,-2,730,-17,730,-35,730],
    sm512=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,348,-16,731,-38,11,-35,350,-30,40,41,-3,45],
    sm513=[0,-4,0,-4,0,-4,-1,-38,732],
    sm514=[0,-4,0,-4,0,-4,-1,-7,733,-14,733,-12,733,-2,733],
    sm515=[0,-4,0,-4,0,-4,-1,-22,695],
    sm516=[0,-4,0,-4,0,-4,-1,-22,734],
    sm517=[0,-4,0,-4,0,-4,-1,-7,735,-2,735,-11,735,-12,735,-2,735,-17,735,-35,735],
    sm518=[0,-4,0,-4,0,-4,-1,-22,736,-12,736],
    sm519=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,737,-12,281,216,-40,11,-35,352,-35,45],
    sm520=[0,-4,0,-4,0,-4,-1,-7,738,-14,738],
    sm521=[0,-4,0,-4,0,-4,-1,-7,739,-14,739,-12,739,-2,739],
    sm522=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-14,158,-24,7,8,-9,740,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm523=[0,-4,0,-4,0,-4,-1,-72,741],
    sm524=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,742,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm525=[0,-4,0,-4,0,-4,-1,-72,743],
    sm526=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,744,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm527=[0,-4,0,-4,0,-4,-1,-35,342,-36,745],
    sm528=[0,-4,0,-4,0,-4,-1,-56,746,-35,747],
    sm529=[0,-4,0,-4,0,-4,-1,-10,345,-24,346,-20,748,-15,346,-19,748],
    sm530=[0,-4,0,-4,0,-4,-1,-10,345,-45,748,-35,748],
    sm531=[0,-4,0,-4,0,-4,-1,-56,749,-35,749],
    sm532=[0,-4,0,-4,0,-4,-1,-92,750],
    sm533=[0,-4,0,-4,0,-4,-1,-92,545],
    sm534=[0,-4,0,-4,0,-4,-1,-36,751],
    sm535=[0,752,752,752,-1,0,-4,0,-4,-1,752,-1,752,-1,752,-1,752,-14,752,-14,752,-1,752,-22,752,752,-9,752,-3,752,752,-1,752,752,752,752,-1,752,752,752,752,752,752,752,752,-1,752,752,752,752,752,752,752,752,-2,752,752,-5,752,752,-2,752,-23,752,752,752,752,752,752,752,752,752,752,752,752],
    sm536=[0,753,753,753,-1,0,-4,0,-4,-1,753,-1,753,-1,753,-1,753,-14,753,-14,753,-1,753,-22,753,753,-9,753,-3,753,753,-1,753,753,753,753,-1,753,753,753,753,753,753,753,753,-1,753,753,753,753,753,753,753,753,-2,753,753,-5,753,753,-2,753,-23,753,753,753,753,753,753,753,753,753,753,753,753],
    sm537=[0,-4,0,-4,0,-4,-1,-38,754],
    sm538=[0,755,755,755,-1,0,-4,0,-4,-1,755,-1,755,-1,755,755,755,755,-2,755,755,-3,755,-5,755,755,-12,755,755,-1,755,-14,755,755,-1,755,-4,755,755,755,755,755,755,755,-1,755,-2,755,-2,755,755,755,-1,755,755,755,755,-1,755,755,-1,755,755,755,755,755,755,755,755,755,755,755,755,755,755,-2,755,755,-5,755,755,-2,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755,755],
    sm539=[0,756,756,756,-1,0,-4,0,-4,-1,756,-1,756,-1,756,756,756,756,-2,756,756,-3,756,-5,756,756,-12,756,756,-1,756,-14,756,756,-1,756,-4,756,756,756,756,756,756,756,-1,756,-2,756,-2,756,756,756,-1,756,756,756,756,-1,756,756,-1,756,756,756,756,756,756,756,756,756,756,756,756,756,756,-2,756,756,-5,756,756,-2,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756],
    sm540=[0,-1,757,757,-1,0,-4,0,-4,-1,-21,757,-16,757,-33,757,-4,757,-29,757,757,757,-34,757,757,-3,757],
    sm541=[0,-1,758,758,-1,0,-4,0,-4,-1,-21,758,-16,758,-33,758,-4,758,-29,758,758,758,-34,758,758,-3,758],
    sm542=[0,-4,0,-4,0,-4,-1,-7,759],
    sm543=[0,-4,0,-4,0,-4,-1,-36,760],
    sm544=[0,-4,0,-4,0,-4,-1,-36,761],
    sm545=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,762,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm546=[0,-2,2,-1,0,-4,0,-4,-1,-7,763,-13,215,-14,216,-40,11,-35,352,-35,45],
    sm547=[0,-4,0,-4,0,-4,-1,-35,764,-36,764],
    sm548=[0,-4,0,-4,0,-7,576,-1,765,-31,765],
    sm549=[0,-4,0,-4,0,-9,765,-31,765],
    sm550=[0,-4,0,-4,0,-5,766,767],
    sm551=[0,-2,768,-1,0,-4,0,-4,-1,-5,768,-9,768,-128,768,768],
    sm552=[0,-2,769,-1,0,-4,0,-10,769,-9,769,-6,769,-121,769,769],
    sm553=[0,-2,770,-1,771,772,773,774,775,0,-3,776,-7,404],
    sm554=[0,-2,769,-1,0,-4,0,-4,-1,-5,769,-9,769,-6,769,-121,769,769],
    sm555=[0,-2,770,-1,771,772,773,774,775,0,-3,776,-1],
    sm556=[0,-2,777,-1,0,-4,0,-4,-1,-5,777,-4,777,-4,777,-128,777,777],
    sm557=[0,-4,0,-4,0,-7,778],
    sm558=[0,-4,0,-4,0,-156,779],
    sm559=[0,-4,0,-4,0,-156,780],
    sm560=[0,-4,0,-4,0,-20,781],
    sm561=[0,-2,386,-1,0,-4,0,-4,-1,-2,782,-11,388,-6,389,-14,390,-3,391,-23,392,393,394,-8,395],
    sm562=[0,-2,783,-1,0,-4,0,-4,-1,-2,783,-11,783,-6,783,-14,783,-3,783,-23,783,783,783,-8,783],
    sm563=[0,-2,784,-1,0,-4,0,-4,-1,-2,784,-11,784,-6,784,-14,784,-3,784,-23,784,784,784,-8,784],
    sm564=[0,-4,0,-4,0,-4,-1,-72,592],
    sm565=[0,-2,785,-1,0,-4,0,-4,-1,-2,785,-11,785,-6,785,-14,785,-1,785,-1,785,-23,785,785,785,-5,785,-2,785],
    sm566=[0,-4,786,-4,0,-4,-1,-58,787,-85,788,789],
    sm567=[0,-2,386,-1,0,-4,0,-4,-1,-6,790,-40,791,-2,792],
    sm568=[0,-4,0,-4,0,-4,-1,-42,793,-101,788,789],
    sm569=[0,-2,386,-1,0,-4,0,-4,794,-6,795,-40,796],
    sm570=[0,-2,386,-1,0,-4,0,-4,-1,-14,388,-6,389,-42,392,393,394,-8,395],
    sm571=[0,-2,386,-1,0,-4,0,-4,-1,-38,797,-1,391,-31,798],
    sm572=[0,-2,799,-1,0,-4,0,-4,-1,-38,799,-1,799,-31,800],
    sm573=[0,-2,799,-1,0,-4,0,-4,-1,-38,799,-1,799,-31,799],
    sm574=[0,-2,801,-1,0,-4,0,-4,-1,-38,801,-1,801,-31,801],
    sm575=[0,-2,802,-1,0,-4,0,-4,-1,-38,802,-1,802,-31,802],
    sm576=[0,-4,0,-4,0,-4,-1,-75,803],
    sm577=[0,-2,386,-1,0,-4,0,-4,-1,-7,804,-6,388,603,-5,389,-13,804,804,-24,604,605,606,392,393,394,-8,395],
    sm578=[0,-2,805,-1,0,-4,0,-4,-1,-7,805,-6,805,805,-5,805,-13,805,805,-24,805,805,805,805,805,805,-8,805],
    sm579=[0,-2,806,-1,0,-4,0,-4,-1,-7,806,-6,806,806,-5,806,-13,806,806,-24,806,806,806,806,806,806,-8,806],
    sm580=[0,-2,807,-1,0,-4,0,-4,-1,-14,807,-6,807,-42,807,807,807,-8,807],
    sm581=[0,-2,808,-1,0,-4,0,-4,-1,-7,808,-6,388,808,-5,389,-13,808,808,-24,808,808,808,808,808,394,-8,395],
    sm582=[0,-2,808,-1,0,-4,0,-4,-1,-7,808,-6,808,808,-5,808,-13,808,808,-24,808,808,808,808,808,808,-8,608],
    sm583=[0,-2,809,-1,0,-4,0,-4,-1,-7,809,-6,809,809,-5,809,-13,809,809,-24,809,809,809,809,809,809,-8,809],
    sm584=[0,-2,810,-1,0,-4,0,-4,-1,-7,810,-6,810,810,-5,810,-13,810,810,-24,810,810,810,810,810,810,-8,810],
    sm585=[0,-4,0,-4,0,-4,-1,-75,626],
    sm586=[0,-2,811,-1,0,-4,0,-4,-1,-7,811,-6,811,811,-5,811,-13,811,811,-24,811,811,811,811,811,811,-8,811],
    sm587=[0,-2,812,-1,0,-4,0,-4,-1,-7,812,-2,812,-3,812,812,-5,812,812,-12,812,812,-24,812,812,812,812,812,812,812,812,812,-5,812],
    sm588=[0,-2,813,-1,0,-4,0,-4,-1,-64,813],
    sm589=[0,-2,616,-1,617,-4,618,-3,814,-1,-2,814,-1,814,-1,814,814,-2,814,-3,814,814,-5,814,814,-12,814,814,-3,814,-4,814,-7,814,-7,814,814,814,814,814,814,814,814,814,814,814,814,-2,814,620,621],
    sm590=[0,-2,815,-1,815,-4,0,-3,815,-1,-2,815,-1,815,-1,815,815,-2,815,-3,815,815,-5,815,815,-12,815,815,-3,815,-4,815,-7,815,-7,815,815,815,815,815,815,815,815,815,815,815,815,-2,815],
    sm591=[0,-2,816,-1,816,-4,816,-3,816,-1,-2,816,-1,816,-1,816,816,-2,816,-3,816,816,-5,816,816,-12,816,816,-3,816,-4,816,-7,816,-7,816,816,816,816,816,816,816,816,816,816,816,816,-2,816,816,816],
    sm592=[0,-2,817,-1,817,-4,817,-3,817,-1,-2,817,-1,817,-1,817,817,-2,817,-3,817,817,-5,817,817,-12,817,817,-3,817,-4,817,-7,817,-7,817,817,817,817,817,817,817,817,817,817,817,817,-2,817,817,817],
    sm593=[0,-2,818,-1,818,-4,0,-3,818,-1,-2,818,-1,818,-1,818,818,-2,818,-3,818,818,-5,818,818,-12,818,818,-3,818,-4,818,-7,818,-7,818,818,818,818,818,818,818,818,818,818,818,818,-2,818],
    sm594=[0,-2,819,-1,0,-4,0,-4,-1,-7,819,-6,819,819,-5,819,-13,819,819,-24,819,819,819,819,819,819,-8,819],
    sm595=[0,-2,820,-1,0,-4,0,-4,-1,-7,820,-6,820,820,-5,820,-13,820,820,-24,820,820,820,820,820,820,-8,820],
    sm596=[0,-4,0,-4,0,-4,-1,-10,821,-11,822,-39,823,-4,824,825,826],
    sm597=[0,-4,0,-4,0,-4,-1,-65,612],
    sm598=[0,-2,827,-1,0,-4,0,-4,-1,-6,828,827,-6,827,827,-5,827,-13,827,827,-24,827,827,827,827,827,827,-8,827],
    sm599=[0,-2,829,-1,0,-4,0,-4,-1,-7,829,-6,829,829,-5,829,-13,829,829,-24,829,829,829,829,829,829,-8,829],
    sm600=[0,-2,830,-1,0,-4,0,-4,-1,-7,830,-6,830,830,-5,830,-13,830,830,-24,830,830,830,830,830,830,-8,626],
    sm601=[0,-2,831,-1,0,-4,0,-4,-1,-7,831,-6,831,831,-5,831,-13,831,831,-24,831,831,831,831,831,831,-8,831],
    sm602=[0,-4,0,-4,0,-7,832],
    sm603=[0,-4,0,-4,0,-157,833],
    sm604=[0,-4,0,-4,0,-157,834],
    sm605=[0,-4,0,-4,0,-20,835],
    sm606=[0,-4,0,-4,0,-7,836],
    sm607=[0,-4,0,-4,0,-158,837],
    sm608=[0,-4,0,-4,0,-158,838],
    sm609=[0,-4,0,-4,0,-20,839],
    sm610=[0,-4,0,-4,0,-4,-1,-2,840],
    sm611=[0,841,841,841,-1,841,841,841,841,841,841,-4,-1,841,-1,841,-1,841,841,841,841,-2,841,841,-2,841,841,-5,841,841,841,-1,841,-3,841,-5,841,841,-1,841,-14,841,841,-1,841,-4,841,841,841,841,841,841,841,-1,841,-2,841,-2,841,841,841,-1,841,-1,841,841,-1,841,841,-1,841,841,841,841,841,841,841,841,841,841,841,841,-1,841,-2,841,841,-5,841,841,-2,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,841,-21,841],
    sm612=[0,-4,0,-4,0,-4,-1,-15,842],
    sm613=[0,-1,843,843,-1,843,843,843,843,843,843,-4,-1,-2,843,-1,843,-1,843,-14,843,-1,843,-1,843,-3,843,-6,843,-134,843],
    sm614=[0,-1,844,844,-1,844,844,844,844,844,844,-4,-1,-2,844,-1,844,-1,844,-14,844,-1,844,-1,844,-3,844,-6,844,-134,844],
    sm615=[0,-1,845,845,-1,845,845,845,845,845,845,-4,-1,-2,845,-1,845,-1,845,-14,845,-1,845,-1,845,-3,845,-6,845,-134,845],
    sm616=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-4,77,-1,404,-7,846,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm617=[0,-1,847,847,-1,847,847,847,847,847,0,-4,-1,-4,847,-1,847,-7,847,-6,847,-1,847,-1,847,-3,847,-6,847,-134,847],
    sm618=[0,-1,247,248,-1,848,250,251,252,253,0,-4,-1,-4,77,-1,404,-7,651,652,-5,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm619=[0,-1,849,849,-1,849,849,849,849,849,0,-4,-1,-4,849,-1,849,-7,849,849,-5,849,-1,849,-1,849,-3,849,-6,849,-134,849],
    sm620=[0,-4,850,-4,0,-4,-1],
    sm621=[0,-2,851,-1,0,-4,852,-4,-1],
    sm622=[0,-1,647,248,-1,853,250,251,252,253,0,-4,-1,-4,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-24,654,-2,655,-106,254],
    sm623=[0,-1,854,854,-1,854,854,854,854,854,0,-4,-1,-4,854,-1,854,-7,854,-6,854,-1,854,-1,854,-3,854,-6,854,-24,854,-2,854,-106,854],
    sm624=[0,-4,855,-4,0,-4,-1],
    sm625=[0,-4,856,-4,0,-4,-1],
    sm626=[0,-1,419,419,-1,419,419,419,419,419,419,-4,-1,-2,419,-1,419,-1,419,-7,419,-6,419,-1,419,-1,419,-3,419,-6,419,-134,419],
    sm627=[0,-1,247,248,-1,249,250,251,252,253,857,-4,-1,-2,857,-1,77,-1,404,-14,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm628=[0,-1,858,858,-1,858,858,858,858,858,858,-4,-1,-2,858,-1,858,-1,858,-3,859,860,-9,858,-1,858,-1,858,-3,858,-6,858,-134,858],
    sm629=[0,-1,858,858,-1,858,858,858,858,858,858,-4,-1,-2,858,-1,858,-1,858,-6,861,-7,858,-1,858,-1,858,-3,858,-6,858,-39,862,-94,858],
    sm630=[0,-1,863,863,-1,864,863,863,863,863,863,-4,-1,-2,863,-1,863,-1,863,-4,863,-1,863,863,863,-3,863,-1,863,-1,863,-1,863,-3,863,-6,863,-24,863,-2,863,-106,863],
    sm631=[0,-1,865,865,-1,865,865,865,865,865,865,-4,-1,-2,865,-1,865,-1,865,-4,865,-1,865,865,865,-3,865,-1,865,-1,865,-1,865,-3,865,-6,865,-24,865,-2,865,-106,865],
    sm632=[0,-4,0,-4,0,-4,-1,-22,866],
    sm633=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-6,404,-14,405,-1,406,867,407,-3,408,-6,661,-134,254],
    sm634=[0,-1,868,868,-1,868,868,868,868,868,0,-4,-1,-6,868,-14,868,-1,868,868,868,868,-2,868,-6,868,-1,868,-132,868],
    sm635=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-6,404,-14,405,-1,406,-1,407,869,-2,408,-6,661,-134,254],
    sm636=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-6,404,-14,405,-1,406,-1,407,-3,408,-6,661,-1,870,-132,254],
    sm637=[0,-1,1,871,-1,0,-4,0,-4,-1,-4,78,-1,666,-14,79,280,-12,281,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,282,33,-23,34,35,36,37,38,39,872,873,42,43,44,45],
    sm638=[0,-1,664,665,-1,249,250,251,252,253,0,-4,-1,-4,78,-1,666,-14,874,-1,406,-1,407,-3,408,-5,275,668,-1,276,-22,7,8,-13,10,11,-3,13,14,-8,21,-16,277,278,31,32,-1,279,33,-23,34,35,36,37,38,39,40,41,42,43,44,45,-21,254],
    sm639=[0,-1,1,2,-1,-1,-4,0,-9,78,-1,875,207,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm640=[0,-1,186,186,-1,186,419,419,419,419,186,-4,186,-4,186,186,186,-3,186,186,-2,186,186,-5,186,-1,419,-1,419,-3,419,-5,186,186,-1,186,-14,186,186,-1,186,-4,186,-1,186,186,186,186,186,-1,186,-5,186,186,186,-27,186,-9,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,-4,186,186,-5,186,-21,419],
    sm641=[0,-1,419,419,-1,419,419,419,419,419,0,-4,-1,-4,206,206,206,-3,206,206,-3,206,-5,206,-1,419,-1,419,-3,419,-5,206,206,-1,419,-14,206,206,-1,206,-4,206,-1,206,206,206,206,206,-1,206,-5,206,206,-38,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,-4,206,206,-27,419],
    sm642=[0,-4,0,-4,0,-4,-1,-29,876],
    sm643=[0,-1,669,670,671,672,673,674,675,676,0,-4,-1,-14,677,-14,877],
    sm644=[0,-1,878,878,878,878,878,878,878,878,0,-4,-1,-14,878,-14,878],
    sm645=[0,-1,879,879,879,879,879,879,879,879,0,-4,-1,-14,879,-14,879],
    sm646=[0,-4,0,-4,0,-4,-1,-15,880],
    sm647=[0,-4,0,-4,0,-43,881],
    sm648=[0,882,882,882,-1,882,882,882,882,882,882,-5,882,-1,882,-1,882,882,882,882,-2,882,882,-2,882,882,-5,882,882,882,-1,882,-3,882,-5,882,882,-1,882,-14,882,882,-1,882,-4,882,882,882,882,882,882,882,-1,882,-2,882,-2,882,882,882,-1,882,-1,882,882,-1,882,882,-1,882,882,882,882,882,882,882,882,882,882,882,882,-1,882,-2,882,882,-5,882,882,-2,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,882,-21,882],
    sm649=[0,883,883,883,-1,0,-4,0,-4,-1,883,-3,883,883,883,883,-2,883,883,-3,883,-5,883,883,-12,883,883,-1,883,-14,883,883,-1,883,-4,883,883,883,883,883,883,883,-1,883,-2,883,-2,883,883,883,-1,883,-1,883,883,-1,883,883,-1,883,883,883,883,883,883,883,883,883,883,883,883,-1,883,-2,883,883,-5,883,883,-2,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883],
    sm650=[0,-4,0,-4,0,-4,-1,-35,884,-2,884],
    sm651=[0,-4,0,-4,0,-4,-1,-10,345,-24,431,-2,431],
    sm652=[0,-4,0,-4,0,-4,-1,-6,885,-68,885],
    sm653=[0,-4,0,-4,0,-4,-1,-35,886,-2,886],
    sm654=[0,-4,0,-4,0,-4,-1,-7,887],
    sm655=[0,-4,0,-4,0,-4,-1,-7,888],
    sm656=[0,-4,0,-4,0,-4,-1,-7,889],
    sm657=[0,890,890,890,-1,0,-4,0,-4,-1,890,-3,890,890,890,890,-2,890,890,-3,890,-5,890,890,-12,890,890,-1,890,-14,890,890,-1,890,-4,890,890,890,890,890,890,890,-1,890,-2,890,-2,890,890,890,-1,890,-1,890,890,-1,890,890,-1,890,890,890,890,890,890,890,890,890,890,890,890,-1,890,-2,890,890,-5,890,890,-2,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890,890],
    sm658=[0,-4,0,-4,0,-4,-1,-22,891,-12,891],
    sm659=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-14,79,-13,440,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm660=[0,-4,0,-4,0,-4,-1,-43,892],
    sm661=[0,-4,0,-4,0,-4,-1,-35,893,-2,893],
    sm662=[0,-4,0,-4,0,-4,-1,-35,894,-2,894],
    sm663=[0,-4,0,-4,0,-4,-1,-43,895,-28,895],
    sm664=[0,-4,0,-4,0,-4,-1,-35,896,-2,896],
    sm665=[0,-4,0,-4,0,-4,-1,-35,897,-2,897],
    sm666=[0,898,898,898,-1,0,-4,0,-4,-1,898,-3,898,-1,898,898,-13,898,898,-12,898,898,-1,898,-22,898,898,-9,898,-2,898,898,898,-1,898,-1,898,898,-1,898,898,-1,898,898,898,898,898,-1,898,898,898,898,898,898,-1,898,-2,898,898,-5,898,898,-2,898,-23,898,898,898,898,898,898,898,898,898,898,898,898],
    sm667=[0,899,899,899,-1,0,-4,0,-4,-1,899,-3,899,899,899,899,-2,899,899,-3,899,-5,899,899,-12,899,899,-1,899,-14,899,899,-1,899,-4,899,899,899,899,899,899,899,-1,899,-2,899,-2,899,899,899,-1,899,-1,899,899,-1,899,899,-1,899,899,899,899,899,899,899,899,899,899,899,899,-1,899,-2,899,899,-5,899,899,-2,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899,899],
    sm668=[0,-4,0,-4,0,-4,-1,-7,900,-27,900],
    sm669=[0,-4,0,-4,0,-4,-1,-7,901],
    sm670=[0,-4,0,-4,0,-4,-1,-7,902],
    sm671=[0,903,903,903,-1,0,-4,0,-4,-1,903,-3,903,-1,903,903,-13,903,903,-12,903,903,-1,903,-22,903,903,-9,903,-2,903,903,903,-1,903,-1,903,903,-1,903,903,-1,903,903,903,903,903,-1,903,903,903,903,903,903,-1,903,-2,903,903,-5,903,903,-2,903,-23,903,903,903,903,903,903,903,903,903,903,903,903],
    sm672=[0,-4,0,-4,0,-4,-1,-38,904],
    sm673=[0,-4,0,-4,0,-4,-1,-7,905,-2,905,-11,905,-12,905,-2,905,-17,905,-35,905],
    sm674=[0,-4,0,-4,0,-4,-1,-35,906,-2,906],
    sm675=[0,-4,0,-4,0,-4,-1,-35,907,-2,907],
    sm676=[0,-4,0,-4,0,-4,-1,-7,908,-2,908,-11,908,-12,908,-2,908,-17,908,-35,908],
    sm677=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,909,-12,440,216,-40,11,-35,352,-35,45],
    sm678=[0,-4,0,-4,0,-4,-1,-22,910],
    sm679=[0,-4,0,-4,0,-4,-1,-22,911,-12,911],
    sm680=[0,912,912,912,-1,0,-4,0,-4,-1,912,-1,912,-1,912,-1,912,-14,912,-14,912,-1,912,-22,912,912,-9,912,-3,912,912,-1,912,912,912,912,-1,912,912,913,912,912,912,912,912,-1,912,912,912,912,912,912,912,912,-2,912,912,-5,912,912,-2,912,-23,912,912,912,912,912,912,912,912,912,912,912,912],
    sm681=[0,-4,0,-4,0,-4,-1,-7,914],
    sm682=[0,915,915,915,-1,0,-4,0,-4,-1,915,-1,915,-1,915,-1,915,-14,915,-14,915,-1,915,-22,915,915,-9,915,-3,915,915,-1,915,915,915,915,-1,915,915,915,915,915,915,915,915,-1,915,915,915,915,915,915,915,915,-2,915,915,-5,915,915,-2,915,-23,915,915,915,915,915,915,915,915,915,915,915,915],
    sm683=[0,-4,0,-4,0,-4,-1,-72,916],
    sm684=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,917,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm685=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,918,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm686=[0,-4,0,-4,0,-4,-1,-7,919],
    sm687=[0,-4,0,-4,0,-4,-1,-7,920],
    sm688=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,921,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm689=[0,-4,0,-4,0,-4,-1,-7,922],
    sm690=[0,-4,0,-4,0,-4,-1,-7,923],
    sm691=[0,-4,0,-4,0,-4,-1,-92,747],
    sm692=[0,-4,0,-4,0,-4,-1,-92,748],
    sm693=[0,924,924,924,-1,0,-4,0,-4,-1,924,-1,924,-1,924,-1,924,-14,924,-14,924,-1,924,-22,924,924,-9,924,-3,924,924,-1,924,924,924,924,-1,924,924,924,924,924,924,924,924,-1,924,924,924,924,924,924,924,924,-2,924,924,-5,924,924,-2,924,-23,924,924,924,924,924,924,924,924,924,924,924,924],
    sm694=[0,-4,0,-4,0,-4,-1,-38,925,-41,926,-18,927],
    sm695=[0,928,928,928,-1,0,-4,0,-4,-1,928,-1,928,-1,928,-1,928,-14,928,-14,928,-1,928,-22,928,928,-9,928,-3,928,928,-1,928,928,928,928,-1,928,928,928,928,928,928,928,928,-1,928,928,928,928,928,928,928,928,-2,928,928,-5,928,928,-2,928,-23,928,928,928,928,928,928,928,928,928,928,928,928],
    sm696=[0,-4,0,-4,0,-4,-1,-7,929],
    sm697=[0,-4,0,-4,0,-4,-1,-7,930],
    sm698=[0,931,931,931,-1,0,-4,0,-4,-1,931,-1,931,-1,931,931,931,931,-2,931,931,-3,931,-5,931,931,-12,931,931,-1,931,-14,931,931,-1,931,-4,931,931,931,931,931,931,931,-1,931,-2,931,-2,931,931,931,-1,931,931,931,931,-1,931,931,-1,931,931,931,931,931,931,931,931,931,931,931,931,931,931,-2,931,931,-5,931,931,-2,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931,931],
    sm699=[0,-4,0,-4,0,-4,-1,-36,932],
    sm700=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,933,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm701=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,934,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm702=[0,-4,0,-4,0,-4,-1,-38,935],
    sm703=[0,936,936,936,-1,0,-4,0,-4,-1,936,-1,936,-1,936,936,936,936,-2,936,936,-3,936,-5,936,936,-12,936,936,-1,936,-14,936,936,-1,936,-4,936,936,936,936,936,936,936,-1,936,-2,936,-2,936,936,936,-1,936,936,936,936,-1,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,-2,936,936,-5,936,936,-2,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936,936],
    sm704=[0,-4,0,-4,0,-4,-1,-38,937],
    sm705=[0,-4,0,-4,0,-4,-1,-7,938],
    sm706=[0,-4,0,-4,0,-4,-1,-7,939,-27,939],
    sm707=[0,-4,0,-4,0,-9,940,-31,940],
    sm708=[0,-4,0,-4,0,-20,941],
    sm709=[0,-4,0,-4,0,-20,942],
    sm710=[0,-4,0,-4,0,-149,943],
    sm711=[0,-4,0,-4,0,-4,-1,-144,944],
    sm712=[0,-2,770,-1,771,772,773,774,775,0,-3,776,-1,-144,945,945],
    sm713=[0,-2,946,-1,946,946,946,946,946,0,-3,946,-1,-144,946,946],
    sm714=[0,-2,947,-1,947,947,947,947,947,0,-3,947,-1,-144,947,947],
    sm715=[0,-2,948,-1,948,948,948,948,948,0,-3,948,-1,-144,948,948],
    sm716=[0,-4,0,-4,0,-4,-1,-145,949],
    sm717=[0,-4,0,-4,0,-156,950],
    sm718=[0,-4,0,-4,0,-20,951],
    sm719=[0,-4,0,-4,0,-20,952],
    sm720=[0,953,953,953,-1,953,953,953,953,953,953,-5,953,-1,953,-1,953,953,953,953,-2,953,953,-2,953,953,-5,953,953,953,-1,953,-3,953,-5,953,953,-1,953,-14,953,953,-1,953,-4,953,953,953,953,953,953,953,-1,953,-2,953,-2,953,953,953,-1,953,-1,953,953,-1,953,953,-1,953,953,953,953,953,953,953,953,953,953,953,953,-1,953,-2,953,953,-5,953,953,-2,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,-21,953],
    sm721=[0,-4,954,-4,0,-4,-1,-58,787,-85,788,789],
    sm722=[0,-2,386,-1,0,-4,0,-4,-1,-2,955,-3,790,-7,955,-6,955,-14,955,-2,956,955,-6,791,-2,792,-13,955,955,955,-5,955,-2,955],
    sm723=[0,-4,957,-4,0,-4,-1,-58,957,-85,957,957],
    sm724=[0,-2,958,-1,0,-4,0,-4,-1,-2,958,-3,958,-7,958,-6,958,-14,958,-2,958,958,-6,958,-2,958,-13,958,958,958,-5,958,-2,958],
    sm725=[0,-4,0,-4,0,-3,959,-1],
    sm726=[0,-4,0,-4,0,-3,960,-1],
    sm727=[0,-4,0,-4,0,-4,-1,-6,961],
    sm728=[0,-4,0,-4,0,-4,-1,-35,962,963],
    sm729=[0,-2,964,-1,0,-4,0,-4,-1,-2,964,-11,964,-6,964,-13,964,964,-3,964,-23,964,964,964,-5,964,-2,964],
    sm730=[0,-2,965,-1,0,-4,0,-4,-1,-2,965,-11,965,-6,965,-13,965,965,-3,965,-23,965,965,965,-5,965,-2,965],
    sm731=[0,-2,965,-1,0,-4,0,-4,-1,-2,965,-11,965,-6,965,-13,965,965,-3,965,-4,966,-18,965,965,965,-5,965,-2,965],
    sm732=[0,-2,967,-1,0,-4,0,-4,-1,-2,967,-4,967,-6,967,-6,967,-13,967,967,-3,967,-23,967,967,967,-5,967,-2,967],
    sm733=[0,-2,968,-1,0,-4,0,-4,-1,-2,968,-4,968,-6,968,-6,968,-13,968,968,-3,968,-23,968,968,968,-5,968,-2,968],
    sm734=[0,-2,968,-1,0,-4,0,-4,-1,-2,968,-4,968,-6,968,-6,968,-13,968,968,-3,968,-4,969,970,-17,968,968,968,-5,968,-2,968],
    sm735=[0,-2,386,-1,0,-4,0,-4,-1,-6,790],
    sm736=[0,-1,971,386,-1,0,-4,0,-4,-1,-6,790,-40,972],
    sm737=[0,-2,973,-1,0,-4,0,-4,-1,-2,973,-4,973,-6,973,-6,973,-13,973,973,-3,973,-4,973,973,-17,973,973,973,-5,973,-2,973],
    sm738=[0,-2,974,-1,0,-4,0,-4,-1,-2,974,-3,975,-7,974,-6,974,-13,974,974,-3,974,-4,974,-18,974,974,974,-5,974,-2,974],
    sm739=[0,-2,976,-1,0,-4,0,-4,-1],
    sm740=[0,-4,0,-4,0,-4,-1,-36,977],
    sm741=[0,-4,0,-4,0,-4,-1,-36,978],
    sm742=[0,-4,0,-4,0,-4,-1,-36,979],
    sm743=[0,-2,386,-1,0,-4,0,-4,794,-6,795],
    sm744=[0,-4,0,-4,0,-4,-1,-7,980,-28,980,-8,981,982],
    sm745=[0,-4,0,-4,0,-4,-1,-7,983,-28,983,-8,983,983],
    sm746=[0,-4,0,-4,0,-4,-1,-7,984,-28,984,-8,984,984],
    sm747=[0,-4,0,-4,0,-4,-1,-6,985],
    sm748=[0,-4,0,-4,0,-4,-1,-6,975],
    sm749=[0,-2,386,-1,0,-4,0,-4,-1,-38,986,-1,391,-31,987],
    sm750=[0,-4,0,-4,0,-4,-1,-35,988,988],
    sm751=[0,-4,0,-4,0,-4,-1,-38,989],
    sm752=[0,-2,990,-1,0,-4,0,-4,-1,-2,990,-11,990,-6,990,-14,990,-1,990,-1,990,-23,990,990,990,-8,990],
    sm753=[0,-2,991,-1,0,-4,0,-4,-1,-38,991,-1,991,-31,991],
    sm754=[0,-2,992,-1,0,-4,0,-4,-1,-38,992,-1,992,-31,993],
    sm755=[0,-2,994,-1,0,-4,0,-4,-1,-38,994,-1,994,-31,994],
    sm756=[0,-2,995,-1,0,-4,0,-4,-1,-38,995,-1,995,-31,995],
    sm757=[0,-2,386,-1,0,-4,0,-4,-1,-38,996,-1,996,-31,996],
    sm758=[0,-2,997,-1,998,-4,0,-3,999,-1,-6,1000],
    sm759=[0,-2,1001,-1,0,-4,0,-4,-1,-7,1001,-6,1001,1001,-5,1001,-13,1001,1001,-24,1001,1001,1001,1001,1001,1001,-8,1001],
    sm760=[0,-2,1002,-1,0,-4,0,-4,-1,-7,1002,-6,1002,1002,-5,1002,-13,1002,1002,-24,1002,1002,1002,1002,1002,1002,-8,1002],
    sm761=[0,-2,1003,-1,0,-4,0,-4,-1,-7,1003,-6,1003,1003,-5,1003,-13,1003,1003,-24,1003,1003,1003,1003,1003,1003,-8,608],
    sm762=[0,-2,1004,-1,1004,-4,0,-3,1004,-1,-2,1004,-1,1004,-1,1004,1004,-2,1004,-3,1004,1004,-5,1004,1004,-12,1004,1004,-3,1004,-4,1004,-7,1004,-7,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,1004,-2,1004],
    sm763=[0,-2,1005,-1,1005,-4,1005,-3,1005,-1,-2,1005,-1,1005,-1,1005,1005,-2,1005,-3,1005,1005,-5,1005,1005,-12,1005,1005,-3,1005,-4,1005,-7,1005,-7,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,-2,1005,1005,1005],
    sm764=[0,-2,1006,-1,0,-4,0,-4,-1,-7,1006,-6,1006,1006,-5,1006,-13,1006,1006,-24,1006,1006,1006,1006,1006,1006,-8,1006],
    sm765=[0,-2,386,1007,0,-4,0,-4,-1],
    sm766=[0,-4,0,-4,0,-4,-1,-10,1008],
    sm767=[0,-2,1009,1009,0,-4,0,-4,-1],
    sm768=[0,-2,1010,-1,0,-4,0,-4,-1,-7,1010,-6,1010,1010,-5,1010,-13,1010,1010,-24,1010,1010,1010,1010,1010,1010,-8,1010],
    sm769=[0,-2,1011,-1,0,-4,0,-4,-1,-7,1011,-6,1011,1011,-5,1011,-13,1011,1011,-24,1011,1011,1011,1011,1011,1011,-8,1011],
    sm770=[0,-4,0,-4,0,-157,1012],
    sm771=[0,-4,0,-4,0,-20,1013],
    sm772=[0,-4,0,-4,0,-20,1014],
    sm773=[0,-4,0,-4,0,-158,1015],
    sm774=[0,-4,0,-4,0,-20,1016],
    sm775=[0,-4,0,-4,0,-20,1017],
    sm776=[0,-4,0,-4,0,-4,-1,-15,1018],
    sm777=[0,-4,0,-4,0,-4,-1,-15,1019],
    sm778=[0,953,953,953,-1,953,953,953,953,953,953,-4,-1,953,-1,953,-1,953,953,953,953,-2,953,953,-2,953,953,-5,953,953,953,-1,953,-3,953,-5,953,953,-1,953,-14,953,953,-1,953,-4,953,953,953,953,953,953,953,-1,953,-2,953,-2,953,953,953,-1,953,-1,953,953,-1,953,953,-1,953,953,953,953,953,953,953,953,953,953,953,953,-1,953,-2,953,953,-5,953,953,-2,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,953,-21,953],
    sm779=[0,-1,247,248,-1,249,250,251,252,253,1020,-4,-1,-2,1020,-1,77,-1,404,-7,1020,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm780=[0,-1,1021,1021,-1,1021,1021,1021,1021,1021,0,-4,-1,-4,1021,-1,1021,-7,1021,-6,1021,-1,1021,-1,1021,-3,1021,-6,1021,-134,1021],
    sm781=[0,-1,1022,1022,-1,1022,1022,1022,1022,1022,1022,-4,-1,-2,1022,-1,1022,-1,1022,-7,1022,-6,1022,-1,1022,-1,1022,-3,1022,-6,1022,-134,1022],
    sm782=[0,-1,1023,1023,-1,1023,1023,1023,1023,1023,1023,-4,-1,-2,1023,-1,1023,-1,1023,-7,1023,-6,1023,-1,1023,-1,1023,-3,1023,-6,1023,-134,1023],
    sm783=[0,-1,247,248,-1,1024,250,251,252,253,0,-4,-1,-4,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm784=[0,-1,247,248,-1,249,250,251,252,253,1025,-4,-1,-2,1025,-1,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm785=[0,-1,1026,1026,-1,1026,1026,1026,1026,1026,0,-4,-1,-4,1026,-1,1026,-7,1026,1026,-5,1026,-1,1026,-1,1026,-3,1026,-6,1026,-134,1026],
    sm786=[0,-1,1027,1027,-1,1027,1027,1027,1027,1027,1027,-4,-1,-2,1027,-1,1027,-1,1027,-7,1027,-6,1027,-1,1027,-1,1027,-3,1027,-6,1027,-134,1027],
    sm787=[0,-1,1028,1028,-1,1028,1028,1028,1028,1028,1028,-4,-1,-2,1028,-1,1028,-1,1028,-7,1028,-6,1028,-1,1028,-1,1028,-3,1028,-6,1028,-134,1028],
    sm788=[0,-1,1029,1029,-1,1029,1029,1029,1029,1029,0,-4,-1,-4,1029,-1,1029,-7,1029,1029,-5,1029,-1,1029,-1,1029,-3,1029,-6,1029,-134,1029],
    sm789=[0,-4,0,-4,1030,-4,-1],
    sm790=[0,-1,247,248,-1,249,250,251,252,253,1031,-4,-1,-19,1032,-151,254],
    sm791=[0,-1,247,248,-1,1033,250,251,252,253,0,-4,-1,-4,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm792=[0,-1,247,248,-1,249,250,251,252,253,1034,-4,-1,-2,1034,-1,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm793=[0,-1,1035,1035,-1,1035,1035,1035,1035,1035,0,-4,-1,-4,1035,-1,1035,-7,1035,-6,1035,-1,1035,-1,1035,-3,1035,-6,1035,-24,1035,-2,1035,-106,1035],
    sm794=[0,-1,1036,1036,-1,1036,1036,1036,1036,1036,1036,-4,-1,-2,1036,-1,1036,-1,1036,-7,1036,-6,1036,-1,1036,-1,1036,-3,1036,-6,1036,-134,1036],
    sm795=[0,-1,1037,1037,-1,1037,1037,1037,1037,1037,1037,-4,-1,-2,1037,-1,1037,-1,1037,-7,1037,-6,1037,-1,1037,-1,1037,-3,1037,-6,1037,-134,1037],
    sm796=[0,-1,1038,1038,-1,1038,1038,1038,1038,1038,0,-4,-1,-4,1038,-1,1038,-7,1038,-6,1038,-1,1038,-1,1038,-3,1038,-6,1038,-24,1038,-2,1038,-106,1038],
    sm797=[0,-1,1039,1039,-1,1039,1039,1039,1039,1039,1039,-4,-1,-2,1039,-1,1039,-1,1039,-14,1039,-1,1039,-1,1039,-3,1039,-6,1039,-134,1039],
    sm798=[0,-1,1040,1040,-1,1040,1040,1040,1040,1040,1040,-4,-1,-2,1040,-1,1040,-1,1040,-14,1040,-1,1040,-1,1040,-3,1040,-6,1040,-134,1040],
    sm799=[0,-1,1041,1041,-1,1041,1041,1041,1041,1041,1041,-4,-1,-2,1041,-1,1041,-1,1041,-3,859,860,-9,1041,-1,1041,-1,1041,-3,1041,-6,1041,-134,1041],
    sm800=[0,-1,1042,1042,-1,1042,1042,1042,1042,1042,1042,-4,-1,-2,1042,-1,1042,-1,1042,-3,1042,1042,-9,1042,-1,1042,-1,1042,-3,1042,-6,1042,-134,1042],
    sm801=[0,-1,1043,1043,-1,1043,1043,1043,1043,1043,1043,-4,-1,-2,1043,-1,1043,-1,1043,-3,1043,1043,-9,1043,-1,1043,-1,1043,-3,1043,-6,1043,-134,1043],
    sm802=[0,-1,1041,1041,-1,1041,1041,1041,1041,1041,1041,-4,-1,-2,1041,-1,1041,-1,1041,-6,861,-7,1041,-1,1041,-1,1041,-3,1041,-6,1041,-39,862,-94,1041],
    sm803=[0,-1,1044,1044,-1,1044,1044,1044,1044,1044,1044,-4,-1,-2,1044,-1,1044,-1,1044,-6,1044,-7,1044,-1,1044,-1,1044,-3,1044,-6,1044,-39,1044,-94,1044],
    sm804=[0,-1,1045,1045,-1,1045,1045,1045,1045,1045,1045,-4,-1,-2,1045,-1,1045,-1,1045,-6,1045,-7,1045,-1,1045,-1,1045,-3,1045,-6,1045,-39,1045,-94,1045],
    sm805=[0,-1,1046,1046,-1,1046,1046,1046,1046,1046,1046,-4,-1,-2,1046,-1,1046,-1,1046,-4,1046,-1,1046,1046,1046,-3,1046,-1,1046,-1,1046,-1,1046,-3,1046,-6,1046,-24,1046,-2,1046,-106,1046],
    sm806=[0,-4,0,-4,0,-4,-1,-6,1047],
    sm807=[0,-1,1048,1048,-1,1048,1048,1048,1048,1048,1048,-4,-1,-2,1048,-1,1048,-1,1048,1048,-6,1048,-6,1048,-1,1048,1048,1048,1048,-2,1048,-6,1048,-1,1048,-132,1048],
    sm808=[0,-1,1049,1049,-1,1049,1049,1049,1049,1049,0,-4,-1,-6,1049,-14,1049,-1,1049,1049,1049,1049,-2,1049,-6,1049,-1,1049,-132,1049],
    sm809=[0,-1,1050,1050,-1,1050,1050,1050,1050,1050,1050,-4,-1,-2,1050,-1,1050,-1,1050,1050,-6,1050,-6,1050,-1,1050,1050,1050,1050,-2,1050,-6,1050,-1,1050,-132,1050],
    sm810=[0,-1,1051,1051,-1,1051,1051,1051,1051,1051,1051,-4,-1,-2,1051,-1,1051,-1,1051,1051,-6,1051,-6,1051,-1,1051,1051,1051,1051,-2,1051,-6,1051,-1,1051,-132,1051],
    sm811=[0,-1,190,1052,-1,1053,1054,1055,1056,1057,0,-3,776,-7,404,-137,197],
    sm812=[0,-1,198,1058,-1,1059,1060,1061,1062,1063,0,-3,776,-1,-145,205],
    sm813=[0,-1,186,186,-1,186,-4,186,-4,186,-4,186,186,186,-3,186,186,-2,186,186,-5,186,186,-12,186,-17,186,186,-1,186,-4,186,-1,186,186,186,186,186,-1,186,-5,265,186,186,-27,186,-9,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,-4,186,186,-5,186],
    sm814=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,207,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm815=[0,-1,1064,1064,-1,1064,1064,1064,1064,1064,1064,-4,-1,-2,1064,-1,1064,-1,1064,1064,-6,1064,-6,1064,-1,1064,1064,1064,1064,-2,1064,-6,1064,-1,1064,-132,1064],
    sm816=[0,-1,1065,1065,1065,1065,1065,1065,1065,1065,0,-4,-1,-14,1065,-14,1065],
    sm817=[0,-4,0,-4,0,-12,1066],
    sm818=[0,-4,0,-4,0,-4,-1,-15,1067],
    sm819=[0,1068,1068,1068,-1,1068,1068,1068,1068,1068,1068,-4,-1,1068,-1,1068,-1,1068,1068,1068,1068,-2,1068,1068,-2,1068,1068,-5,1068,1068,1068,-1,1068,-3,1068,-5,1068,1068,-1,1068,-14,1068,1068,-1,1068,-4,1068,1068,1068,1068,1068,1068,1068,-1,1068,-2,1068,-2,1068,1068,1068,-1,1068,-1,1068,1068,-1,1068,1068,-1,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,-1,1068,-2,1068,1068,-5,1068,1068,-2,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,1068,-21,1068],
    sm820=[0,1069,1069,1069,-1,1069,1069,1069,1069,1069,1069,-5,1069,-1,1069,-1,1069,1069,1069,1069,-2,1069,1069,-2,1069,1069,-5,1069,1069,1069,-1,1069,-3,1069,-5,1069,1069,-1,1069,-14,1069,1069,-1,1069,-4,1069,1069,1069,1069,1069,1069,1069,-1,1069,-2,1069,-2,1069,1069,1069,-1,1069,-1,1069,1069,-1,1069,1069,-1,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,-1,1069,-2,1069,1069,-5,1069,1069,-2,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,1069,-21,1069],
    sm821=[0,-4,0,-4,0,-4,-1,-36,1070],
    sm822=[0,-4,0,-4,0,-4,-1,-36,1071],
    sm823=[0,-4,0,-4,0,-4,-1,-7,1072],
    sm824=[0,-4,0,-4,0,-4,-1,-7,1073],
    sm825=[0,-4,0,-4,0,-4,-1,-22,1074,-12,1074],
    sm826=[0,1075,1075,1075,-1,0,-4,0,-4,-1,1075,-3,1075,1075,1075,1075,-2,1075,1075,-3,1075,-5,1075,1075,-12,1075,1075,-1,1075,-14,1075,1075,-1,1075,-4,1075,1075,1075,1075,1075,1075,1075,-1,1075,-2,1075,-2,1075,1075,1075,-1,1075,-1,1075,1075,-1,1075,1075,-1,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,-1,1075,-2,1075,1075,1075,-4,1075,1075,-2,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075,1075],
    sm827=[0,-4,0,-4,0,-4,-1,-7,1076,-2,1076,-11,1076,-12,1076,-2,1076,-17,1076,-35,1076],
    sm828=[0,-4,0,-4,0,-4,-1,-7,1077,-2,1077,-11,1077,-12,1077,-2,1077,-17,1077,-35,1077],
    sm829=[0,-4,0,-4,0,-4,-1,-22,1078],
    sm830=[0,-4,0,-4,0,-4,-1,-72,1079],
    sm831=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,1080,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm832=[0,-4,0,-4,0,-4,-1,-7,1081],
    sm833=[0,-4,0,-4,0,-4,-1,-7,1082],
    sm834=[0,1083,1083,1083,-1,0,-4,0,-4,-1,1083,-1,1083,-1,1083,-1,1083,-14,1083,-14,1083,-1,1083,-22,1083,1083,-9,1083,-3,1083,1083,-1,1083,1083,1083,1083,-1,1083,1083,1083,1083,1083,1083,1083,1083,-1,1083,1083,1083,1083,1083,1083,1083,1083,-2,1083,1083,-5,1083,1083,-2,1083,-23,1083,1083,1083,1083,1083,1083,1083,1083,1083,1083,1083,1083],
    sm835=[0,-4,0,-4,0,-4,-1,-7,1084],
    sm836=[0,1085,1085,1085,-1,0,-4,0,-4,-1,1085,-1,1085,-1,1085,-1,1085,-14,1085,-14,1085,-1,1085,-22,1085,1085,-9,1085,-3,1085,1085,-1,1085,1085,1085,1085,-1,1085,1085,1085,1085,1085,1085,1085,1085,-1,1085,1085,1085,1085,1085,1085,1085,1085,-2,1085,1085,-5,1085,1085,-2,1085,-23,1085,1085,1085,1085,1085,1085,1085,1085,1085,1085,1085,1085],
    sm837=[0,-4,0,-4,0,-4,-1,-7,1086],
    sm838=[0,1087,1087,1087,-1,0,-4,0,-4,-1,1087,-1,1087,-1,1087,-1,1087,-14,1087,-14,1087,-1,1087,-22,1087,1087,-9,1087,-3,1087,1087,-1,1087,1087,1087,1087,-1,1087,1087,1087,1087,1087,1087,1087,1087,-1,1087,1087,1087,1087,1087,1087,1087,1087,-2,1087,1087,-5,1087,1087,-2,1087,-23,1087,1087,1087,1087,1087,1087,1087,1087,1087,1087,1087,1087],
    sm839=[0,-4,0,-4,0,-4,-1,-38,1088,-41,926,-18,927],
    sm840=[0,-4,0,-4,0,-4,-1,-38,1089,-60,927],
    sm841=[0,-4,0,-4,0,-4,-1,-38,1090,-41,1090,-18,1090],
    sm842=[0,-4,0,-4,0,-4,-1,-75,1091],
    sm843=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,1092,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm844=[0,-4,0,-4,0,-4,-1,-38,1093],
    sm845=[0,1094,1094,1094,-1,0,-4,0,-4,-1,1094,-1,1094,-1,1094,1094,1094,1094,-2,1094,1094,-3,1094,-5,1094,1094,-12,1094,1094,-1,1094,-14,1094,1094,-1,1094,-4,1094,1094,1094,1094,1094,1094,1094,-1,1094,-2,1094,-2,1094,1094,1094,-1,1094,1094,1094,1094,-1,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,-2,1094,1094,-5,1094,1094,-2,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094,1094],
    sm846=[0,-4,0,-4,0,-4,-1,-38,1095],
    sm847=[0,1096,1096,1096,-1,0,-4,0,-4,-1,1096,-1,1096,-1,1096,1096,1096,1096,-2,1096,1096,-3,1096,-5,1096,1096,-12,1096,1096,-1,1096,-14,1096,1096,-1,1096,-4,1096,1096,1096,1096,1096,1096,1096,-1,1096,-2,1096,-2,1096,1096,1096,-1,1096,1096,1096,1096,-1,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,-2,1096,1096,-5,1096,1096,-2,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096],
    sm848=[0,1097,1097,1097,-1,0,-4,0,-4,-1,1097,-1,1097,-1,1097,1097,1097,1097,-2,1097,1097,-3,1097,-5,1097,1097,-12,1097,1097,-1,1097,-14,1097,1097,-1,1097,-4,1097,1097,1097,1097,1097,1097,1097,-1,1097,-2,1097,-2,1097,1097,1097,-1,1097,1097,1097,1097,-1,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,-2,1097,1097,-5,1097,1097,-2,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097],
    sm849=[0,-4,0,-4,0,-9,1098,-31,1098],
    sm850=[0,-2,1099,-1,0,-4,0,-10,1099,-9,1099,-6,1099,-121,1099,1099],
    sm851=[0,-2,1100,-1,0,-4,0,-4,-1,-5,1100,-9,1100,-6,1100,-121,1100,1100],
    sm852=[0,-2,1101,-1,1101,1101,1101,1101,1101,0,-3,1101,-1,-144,1101,1101],
    sm853=[0,-4,0,-4,0,-20,1102],
    sm854=[0,1103,1103,1103,-1,1103,1103,1103,1103,1103,1103,-5,1103,-1,1103,-1,1103,1103,1103,1103,-2,1103,1103,-2,1103,1103,-5,1103,1103,1103,-1,1103,-3,1103,-5,1103,1103,-1,1103,-14,1103,1103,-1,1103,-4,1103,1103,1103,1103,1103,1103,1103,-1,1103,-2,1103,-2,1103,1103,1103,-1,1103,-1,1103,1103,-1,1103,1103,-1,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,-1,1103,-2,1103,1103,-5,1103,1103,-2,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,-21,1103],
    sm855=[0,1104,1104,1104,-1,1104,1104,1104,1104,1104,1104,-5,1104,-1,1104,-1,1104,1104,1104,1104,-2,1104,1104,-2,1104,1104,-5,1104,1104,1104,-1,1104,-3,1104,-5,1104,1104,-1,1104,-14,1104,1104,-1,1104,-4,1104,1104,1104,1104,1104,1104,1104,-1,1104,-2,1104,-2,1104,1104,1104,-1,1104,-1,1104,1104,-1,1104,1104,-1,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,-1,1104,-2,1104,1104,-5,1104,1104,-2,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,-21,1104],
    sm856=[0,-2,386,-1,0,-4,0,-4,-1,-2,1105,-3,790,-7,1105,-6,1105,-14,1105,-2,956,1105,-6,791,-2,792,-13,1105,1105,1105,-5,1105,-2,1105],
    sm857=[0,-4,1106,-4,0,-4,-1,-58,1106,-85,1106,1106],
    sm858=[0,-2,386,-1,0,-4,0,-4,-1,-2,1105,-3,790,-7,1105,-6,1105,-14,1105,-3,1105,-6,791,-2,792,-13,1105,1105,1105,-5,1105,-2,1105],
    sm859=[0,-2,1105,-1,0,-4,0,-4,-1,-2,1105,-11,1105,-6,1105,-13,962,1105,-3,1105,-23,1105,1105,1105,-5,1105,-2,1105],
    sm860=[0,-4,0,-4,0,-4,-1,-6,1107],
    sm861=[0,-4,0,-4,0,-3,959,-1,-144,1108],
    sm862=[0,-4,0,-4,0,-3,1109,-1,-144,1109],
    sm863=[0,-4,0,-4,0,-3,1110,-1,-144,1110],
    sm864=[0,-4,0,-4,0,-3,960,-1,-145,1111],
    sm865=[0,-4,0,-4,0,-3,1112,-1,-145,1112],
    sm866=[0,-4,0,-4,0,-3,1113,-1,-145,1113],
    sm867=[0,-4,0,-4,0,-4,-1,-144,788,789],
    sm868=[0,-2,386,-1,0,-4,0,-4,-1,-14,388,-6,389,-14,390,-1,1114,-25,392,393,394,-8,395],
    sm869=[0,-2,1115,-1,0,-4,0,-4,-1,-2,1115,-11,1115,-6,1115,-13,1115,1115,-3,1115,-4,966,-18,1115,1115,1115,-5,1115,-2,1115],
    sm870=[0,-2,974,-1,0,-4,0,-4,-1,-2,974,-11,974,-6,974,-13,974,974,-3,974,-4,974,-18,974,974,974,-5,974,-2,974],
    sm871=[0,-2,1115,-1,0,-4,0,-4,-1,-2,1115,-11,1115,-6,1115,-13,1115,1115,-3,1115,-23,1115,1115,1115,-5,1115,-2,1115],
    sm872=[0,-2,386,-1,0,-4,0,-4,-1,-6,790,-40,972],
    sm873=[0,-2,1116,-1,0,-4,0,-4,-1,-2,1116,-4,1116,-6,1116,-6,1116,-13,1116,1116,-3,1116,-4,969,-18,1116,1116,1116,-5,1116,-2,1116],
    sm874=[0,-2,1117,-1,0,-4,0,-4,-1,-2,1117,-4,1117,-6,1117,-6,1117,-13,1117,1117,-3,1117,-5,970,-17,1117,1117,1117,-5,1117,-2,1117],
    sm875=[0,-2,1118,-1,0,-4,0,-4,-1,-2,1118,-4,1118,-6,1118,-6,1118,-13,1118,1118,-3,1118,-4,1118,-18,1118,1118,1118,-5,1118,-2,1118],
    sm876=[0,-2,1119,-1,0,-4,0,-4,-1,-2,1119,-4,1119,-6,1119,-6,1119,-13,1119,1119,-3,1119,-5,1119,-17,1119,1119,1119,-5,1119,-2,1119],
    sm877=[0,-2,1120,-1,0,-4,0,-4,-1,-2,1120,-4,1120,-6,1120,-6,1120,-13,1120,1120,-3,1120,-23,1120,1120,1120,-5,1120,-2,1120],
    sm878=[0,-4,0,-4,0,-4,-1,-7,1121],
    sm879=[0,-4,0,-4,0,-4,-1,-7,1122],
    sm880=[0,-4,1123,-4,0,-3,1124,-1,-4,1125,-1,975,1126,-2,1125,-4,1125,-37,1125,-21,1125],
    sm881=[0,-4,0,-4,0,-4,-1,-7,1127],
    sm882=[0,-4,0,-4,0,-4,-1,-4,1128,-5,1129,-4,1130,-37,1131,-21,1132],
    sm883=[0,-4,0,-4,0,-4,-1,-4,1133,-5,1134,-4,1135,-37,1136],
    sm884=[0,-4,0,-4,0,-4,-1,-4,1137,1138,-1,1137,-2,1137,-4,1137,-37,1137,-1,1139,1140,1141],
    sm885=[0,-4,0,-4,0,-4,-1,-4,1137,-2,1137,-2,1137,-4,1137,-37,1137],
    sm886=[0,-4,1142,-4,0,-3,1143,-1,-7,1144],
    sm887=[0,-1,1145,-2,0,-4,0,-4,-1,-43,1146,1147],
    sm888=[0,-4,0,-4,0,-4,-1,-7,1148,-28,1148],
    sm889=[0,-4,0,-4,0,-4,-1,-7,1148,-28,1148,-8,981],
    sm890=[0,-4,0,-4,0,-4,-1,-7,1148,-28,1148,-9,982],
    sm891=[0,-4,0,-4,0,-4,-1,-7,1149,-28,1149,-8,1149],
    sm892=[0,-4,0,-4,0,-4,-1,-7,1150,-28,1150,-9,1150],
    sm893=[0,-4,0,-4,0,-4,-1,-7,1151],
    sm894=[0,-4,0,-4,0,-4,-1,-7,1152],
    sm895=[0,-4,1123,-4,0,-3,1124,-1,-6,975,1126,-67,803],
    sm896=[0,-4,0,-4,0,-4,-1,-38,1153],
    sm897=[0,-2,1154,-1,0,-4,0,-4,-1,-2,1154,-11,1154,-6,1154,-14,1154,-1,1154,-1,1154,-23,1154,1154,1154,-8,1154],
    sm898=[0,-2,1155,-1,0,-4,0,-4,-1,-2,1155,-11,1155,-6,1155,-14,1155,-1,1155,-1,1155,-23,1155,1155,1155,-8,1155],
    sm899=[0,-2,386,-1,0,-4,0,-4,-1,-38,1156,-1,1156,-31,1156],
    sm900=[0,-2,1157,-1,0,-4,0,-4,-1,-38,1157,-1,1157,-31,1157],
    sm901=[0,-2,997,-1,998,-4,0,-3,999,-1,-6,1000,1158,-30,1158,-1,1158,-31,1158,-68,1159],
    sm902=[0,-2,997,-1,998,-4,0,-3,999,-1,-6,1160,1160,-30,1160,-1,1160,-31,1160,-68,1160],
    sm903=[0,-2,1161,-1,1161,-4,0,-3,1161,-1,-6,1161,1161,-30,1161,-1,1161,-31,1161,-68,1161],
    sm904=[0,-2,1162,-1,1162,-4,0,-3,1162,-1,-6,1162,1162,-30,1162,-1,1162,-31,1162,-68,1162],
    sm905=[0,-4,0,-4,0,-4,-1,-22,1163,-47,1164,1165],
    sm906=[0,-4,0,-4,0,-4,-1,-22,1166,-47,1166,1166],
    sm907=[0,-2,1167,1167,0,-4,0,-4,-1],
    sm908=[0,-4,0,-4,0,-4,-1,-7,1168],
    sm909=[0,-4,0,-4,0,-20,1169],
    sm910=[0,-4,0,-4,0,-20,1170],
    sm911=[0,-4,0,-4,0,-4,-1,-15,1171],
    sm912=[0,1103,1103,1103,-1,1103,1103,1103,1103,1103,1103,-4,-1,1103,-1,1103,-1,1103,1103,1103,1103,-2,1103,1103,-2,1103,1103,-5,1103,1103,1103,-1,1103,-3,1103,-5,1103,1103,-1,1103,-14,1103,1103,-1,1103,-4,1103,1103,1103,1103,1103,1103,1103,-1,1103,-2,1103,-2,1103,1103,1103,-1,1103,-1,1103,1103,-1,1103,1103,-1,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,-1,1103,-2,1103,1103,-5,1103,1103,-2,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,1103,-21,1103],
    sm913=[0,1104,1104,1104,-1,1104,1104,1104,1104,1104,1104,-4,-1,1104,-1,1104,-1,1104,1104,1104,1104,-2,1104,1104,-2,1104,1104,-5,1104,1104,1104,-1,1104,-3,1104,-5,1104,1104,-1,1104,-14,1104,1104,-1,1104,-4,1104,1104,1104,1104,1104,1104,1104,-1,1104,-2,1104,-2,1104,1104,1104,-1,1104,-1,1104,1104,-1,1104,1104,-1,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,-1,1104,-2,1104,1104,-5,1104,1104,-2,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,1104,-21,1104],
    sm914=[0,-1,1172,1172,-1,1172,1172,1172,1172,1172,1172,-4,-1,-2,1172,-1,1172,-1,1172,-7,1172,-6,1172,-1,1172,-1,1172,-3,1172,-6,1172,-134,1172],
    sm915=[0,-1,247,248,-1,249,250,251,252,253,1173,-4,-1,-2,1173,-1,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm916=[0,-1,1174,1174,-1,1174,1174,1174,1174,1174,1174,-4,-1,-2,1174,-1,1174,-1,1174,-7,1174,-6,1174,-1,1174,-1,1174,-3,1174,-6,1174,-134,1174],
    sm917=[0,-1,247,248,-1,249,250,251,252,253,1031,-4,-1,-19,1175,-151,254],
    sm918=[0,-1,1176,1176,-1,1176,1176,1176,1176,1176,1176,-4,-1,-19,1176,-151,1176],
    sm919=[0,-1,247,248,-1,249,250,251,252,253,1177,-4,-1,-19,1177,-151,254],
    sm920=[0,-1,1178,1178,-1,1178,1178,1178,1178,1178,1178,-4,-1,-19,1178,-151,1178],
    sm921=[0,-1,1179,1179,-1,1179,1179,1179,1179,1179,1179,-4,-1,-19,1179,-151,1179],
    sm922=[0,-1,247,248,-1,249,250,251,252,253,1180,-4,-1,-2,1180,-1,77,-1,404,-7,651,-6,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm923=[0,-1,1181,1181,-1,1181,1181,1181,1181,1181,1181,-4,-1,-2,1181,-1,1181,-1,1181,-7,1181,-6,1181,-1,1181,-1,1181,-3,1181,-6,1181,-134,1181],
    sm924=[0,-1,1182,1182,-1,1182,1182,1182,1182,1182,1182,-4,-1,-2,1182,-1,1182,-1,1182,-3,1182,1182,-9,1182,-1,1182,-1,1182,-3,1182,-6,1182,-134,1182],
    sm925=[0,-1,1183,1183,-1,1183,1183,1183,1183,1183,1183,-4,-1,-2,1183,-1,1183,-1,1183,-6,1183,-7,1183,-1,1183,-1,1183,-3,1183,-6,1183,-39,1183,-94,1183],
    sm926=[0,-1,247,248,-1,249,250,251,252,253,0,-4,-1,-4,77,-1,404,-14,405,-1,406,-1,407,-3,408,-6,409,-134,254],
    sm927=[0,-1,331,331,-1,331,331,331,331,331,0,-3,948,-1,-144,331],
    sm928=[0,-1,334,334,-1,334,334,334,334,334,0,-3,948,-1,-145,334],
    sm929=[0,-4,0,-4,0,-12,1184,-27,337],
    sm930=[0,-4,-1,-4,0,-11,1185,1186],
    sm931=[0,1187,1187,1187,-1,1187,1187,1187,1187,1187,1187,-4,-1,1187,-1,1187,-1,1187,1187,1187,1187,-2,1187,1187,-2,1187,1187,-5,1187,1187,1187,-1,1187,-3,1187,-5,1187,1187,-1,1187,-14,1187,1187,-1,1187,-4,1187,1187,1187,1187,1187,1187,1187,-1,1187,-2,1187,-2,1187,1187,1187,-1,1187,-1,1187,1187,-1,1187,1187,-1,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,-1,1187,-2,1187,1187,-5,1187,1187,-2,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,1187,-21,1187],
    sm932=[0,-4,0,-4,0,-4,-1,-36,1188],
    sm933=[0,-4,0,-4,0,-4,-1,-7,1189,-2,1189,-11,1189,-12,1189,-2,1189,-17,1189,-35,1189],
    sm934=[0,1190,1190,1190,-1,0,-4,0,-4,-1,1190,-1,1190,-1,1190,-1,1190,-14,1190,-14,1190,-1,1190,-22,1190,1190,-9,1190,-3,1190,1190,-1,1190,1190,1190,1190,-1,1190,1190,1190,1190,1190,1190,1190,1190,-1,1190,1190,1190,1190,1190,1190,1190,1190,-2,1190,1190,-5,1190,1190,-2,1190,-23,1190,1190,1190,1190,1190,1190,1190,1190,1190,1190,1190,1190],
    sm935=[0,1191,1191,1191,-1,0,-4,0,-4,-1,1191,-1,1191,-1,1191,-1,1191,-14,1191,-14,1191,-1,1191,-22,1191,1191,-9,1191,-3,1191,1191,-1,1191,1191,1191,1191,-1,1191,1191,1191,1191,1191,1191,1191,1191,-1,1191,1191,1191,1191,1191,1191,1191,1191,-2,1191,1191,-5,1191,1191,-2,1191,-23,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191],
    sm936=[0,-4,0,-4,0,-4,-1,-7,1192],
    sm937=[0,1193,1193,1193,-1,0,-4,0,-4,-1,1193,-1,1193,-1,1193,-1,1193,-14,1193,-14,1193,-1,1193,-22,1193,1193,-9,1193,-3,1193,1193,-1,1193,1193,1193,1193,-1,1193,1193,1193,1193,1193,1193,1193,1193,-1,1193,1193,1193,1193,1193,1193,1193,1193,-2,1193,1193,-5,1193,1193,-2,1193,-23,1193,1193,1193,1193,1193,1193,1193,1193,1193,1193,1193,1193],
    sm938=[0,1194,1194,1194,-1,0,-4,0,-4,-1,1194,-1,1194,-1,1194,-1,1194,-14,1194,-14,1194,-1,1194,-22,1194,1194,-9,1194,-3,1194,1194,-1,1194,1194,1194,1194,-1,1194,1194,1194,1194,1194,1194,1194,1194,-1,1194,1194,1194,1194,1194,1194,1194,1194,-2,1194,1194,-5,1194,1194,-2,1194,-23,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194],
    sm939=[0,1195,1195,1195,-1,0,-4,0,-4,-1,1195,-1,1195,-1,1195,-1,1195,-14,1195,-14,1195,-1,1195,-22,1195,1195,-9,1195,-3,1195,1195,-1,1195,1195,1195,1195,-1,1195,1195,1195,1195,1195,1195,1195,1195,-1,1195,1195,1195,1195,1195,1195,1195,1195,-2,1195,1195,-5,1195,1195,-2,1195,-23,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195],
    sm940=[0,1196,1196,1196,-1,0,-4,0,-4,-1,1196,-1,1196,-1,1196,-1,1196,-14,1196,-14,1196,-1,1196,-22,1196,1196,-9,1196,-3,1196,1196,-1,1196,1196,1196,1196,-1,1196,1196,1196,1196,1196,1196,1196,1196,-1,1196,1196,1196,1196,1196,1196,1196,1196,-2,1196,1196,-5,1196,1196,-2,1196,-23,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196],
    sm941=[0,1197,1197,1197,-1,0,-4,0,-4,-1,1197,-1,1197,-1,1197,-1,1197,-14,1197,-14,1197,-1,1197,-22,1197,1197,-9,1197,-3,1197,1197,-1,1197,1197,1197,1197,-1,1197,1197,1197,1197,1197,1197,1197,1197,-1,1197,1197,1197,1197,1197,1197,1197,1197,-2,1197,1197,-5,1197,1197,-2,1197,-23,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197],
    sm942=[0,1198,1198,1198,-1,0,-4,0,-4,-1,1198,-1,1198,-1,1198,-1,1198,-14,1198,-14,1198,-1,1198,-22,1198,1198,-9,1198,-3,1198,1198,-1,1198,1198,1198,1198,-1,1198,1198,1198,1198,1198,1198,1198,1198,-1,1198,1198,1198,1198,1198,1198,1198,1198,-2,1198,1198,-5,1198,1198,-2,1198,-23,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198],
    sm943=[0,1199,1199,1199,-1,0,-4,0,-4,-1,1199,-1,1199,-1,1199,-1,1199,-14,1199,-14,1199,-1,1199,-22,1199,1199,-9,1199,-3,1199,1199,-1,1199,1199,1199,1199,-1,1199,1199,1199,1199,1199,1199,1199,1199,-1,1199,1199,1199,1199,1199,1199,1199,1199,-2,1199,1199,-5,1199,1199,-2,1199,-23,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199],
    sm944=[0,-4,0,-4,0,-4,-1,-38,1200,-60,927],
    sm945=[0,1201,1201,1201,-1,0,-4,0,-4,-1,1201,-1,1201,-1,1201,-1,1201,-14,1201,-14,1201,-1,1201,-22,1201,1201,-9,1201,-3,1201,1201,-1,1201,1201,1201,1201,-1,1201,1201,1201,1201,1201,1201,1201,1201,-1,1201,1201,1201,1201,1201,1201,1201,1201,-2,1201,1201,-5,1201,1201,-2,1201,-23,1201,1201,1201,1201,1201,1201,1201,1201,1201,1201,1201,1201],
    sm946=[0,-4,0,-4,0,-4,-1,-38,1202,-41,1202,-18,1202],
    sm947=[0,-4,0,-4,0,-4,-1,-38,1203,-60,927],
    sm948=[0,-4,0,-4,0,-4,-1,-75,1204],
    sm949=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,1205,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,1205,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm950=[0,1206,1206,1206,-1,0,-4,0,-4,-1,1206,-1,1206,-1,1206,-1,1206,-14,1206,-14,1206,-1,1206,-22,1206,1206,-9,1206,-3,1206,1206,-1,1206,1206,1206,1206,-1,1206,1206,1206,1206,1206,1206,1206,1206,-1,1206,1206,1206,1206,1206,1206,1206,1206,-1,1206,1206,1206,-5,1206,1206,-2,1206,-23,1206,1206,1206,1206,1206,1206,1206,1206,1206,1206,1206,1206],
    sm951=[0,-4,0,-4,0,-4,-1,-38,1207],
    sm952=[0,1208,1208,1208,-1,0,-4,0,-4,-1,1208,-1,1208,-1,1208,1208,1208,1208,-2,1208,1208,-3,1208,-5,1208,1208,-12,1208,1208,-1,1208,-14,1208,1208,-1,1208,-4,1208,1208,1208,1208,1208,1208,1208,-1,1208,-2,1208,-2,1208,1208,1208,-1,1208,1208,1208,1208,-1,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,-2,1208,1208,-5,1208,1208,-2,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208],
    sm953=[0,1209,1209,1209,-1,0,-4,0,-4,-1,1209,-1,1209,-1,1209,1209,1209,1209,-2,1209,1209,-3,1209,-5,1209,1209,-12,1209,1209,-1,1209,-14,1209,1209,-1,1209,-4,1209,1209,1209,1209,1209,1209,1209,-1,1209,-2,1209,-2,1209,1209,1209,-1,1209,1209,1209,1209,-1,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,-2,1209,1209,-5,1209,1209,-2,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209],
    sm954=[0,1210,1210,1210,-1,0,-4,0,-4,-1,1210,-1,1210,-1,1210,1210,1210,1210,-2,1210,1210,-3,1210,-5,1210,1210,-12,1210,1210,-1,1210,-14,1210,1210,-1,1210,-4,1210,1210,1210,1210,1210,1210,1210,-1,1210,-2,1210,-2,1210,1210,1210,-1,1210,1210,1210,1210,-1,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,-2,1210,1210,-5,1210,1210,-2,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210],
    sm955=[0,1211,1211,1211,-1,1211,1211,1211,1211,1211,1211,-5,1211,-1,1211,-1,1211,1211,1211,1211,-2,1211,1211,-2,1211,1211,-5,1211,1211,1211,-1,1211,-3,1211,-5,1211,1211,-1,1211,-14,1211,1211,-1,1211,-4,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,-2,1211,1211,1211,-1,1211,-1,1211,1211,-1,1211,1211,-1,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,1211,-5,1211,1211,-2,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-21,1211],
    sm956=[0,-2,386,-1,0,-4,0,-4,-1,-2,1212,-3,790,-7,1212,-6,1212,-14,1212,-3,1212,-6,791,-2,792,-13,1212,1212,1212,-5,1212,-2,1212],
    sm957=[0,-2,1212,-1,0,-4,0,-4,-1,-2,1212,-11,1212,-6,1212,-13,962,1212,-3,1212,-23,1212,1212,1212,-5,1212,-2,1212],
    sm958=[0,-2,1213,-1,0,-4,0,-4,-1,-2,1213,-3,1213,1213,-6,1213,-6,1213,-14,1213,-2,1213,1213,-6,1213,-2,1213,-13,1213,1213,1213,-5,1213,-2,1213],
    sm959=[0,-4,0,-4,0,-3,1214,-1,-144,1214],
    sm960=[0,-4,0,-4,0,-3,1215,-1,-145,1215],
    sm961=[0,-4,0,-4,0,-4,-1,-7,1216],
    sm962=[0,-4,0,-4,0,-4,-1,-38,1217],
    sm963=[0,-2,386,-1,0,-4,0,-4,-1,-14,388,-6,389,-14,390,-1,1218,-25,392,393,394,-8,395],
    sm964=[0,-2,1219,-1,0,-4,0,-4,-1,-14,1219,-6,1219,-14,1219,-1,1219,-25,1219,1219,1219,-8,1219],
    sm965=[0,-2,1220,-1,0,-4,0,-4,-1,-2,1220,-11,1220,-6,1220,-13,1220,1220,-3,1220,-23,1220,1220,1220,-5,1220,-2,1220],
    sm966=[0,-2,1221,-1,0,-4,0,-4,-1,-2,1221,-11,1221,-6,1221,-13,1221,1221,-3,1221,-23,1221,1221,1221,-5,1221,-2,1221],
    sm967=[0,-2,1222,-1,0,-4,0,-4,-1,-2,1222,-11,1222,-6,1222,-13,1222,1222,-3,1222,-23,1222,1222,1222,-5,1222,-2,1222],
    sm968=[0,-2,968,-1,0,-4,0,-4,-1,-2,968,-11,968,-6,968,-13,968,968,-3,968,-4,969,-18,968,968,968,-5,968,-2,968],
    sm969=[0,-2,1223,-1,0,-4,0,-4,-1,-2,1223,-4,1223,-6,1223,-6,1223,-13,1223,1223,-3,1223,-4,1223,-18,1223,1223,1223,-5,1223,-2,1223],
    sm970=[0,-2,1224,-1,0,-4,0,-4,-1,-2,1224,-4,1224,-6,1224,-6,1224,-13,1224,1224,-3,1224,-5,1224,-17,1224,1224,1224,-5,1224,-2,1224],
    sm971=[0,-2,1225,-1,0,-4,0,-4,-1,-2,1225,-4,1225,-6,1225,-6,1225,-13,1225,1225,-3,1225,-4,1225,-18,1225,1225,1225,-5,1225,-2,1225],
    sm972=[0,-2,1226,-1,0,-4,0,-4,-1,-2,1226,-4,1226,-6,1226,-6,1226,-13,1226,1226,-3,1226,-5,1226,-17,1226,1226,1226,-5,1226,-2,1226],
    sm973=[0,-2,1227,-1,0,-4,0,-4,-1,-2,1227,-4,1227,-6,1227,-6,1227,-13,1227,1227,-3,1227,-4,1227,1227,-17,1227,1227,1227,-5,1227,-2,1227],
    sm974=[0,-2,1228,-1,0,-4,0,-4,-1,-2,1228,-4,1228,-6,1228,-6,1228,-13,1228,1228,-3,1228,-4,1228,1228,-17,1228,1228,1228,-5,1228,-2,1228],
    sm975=[0,-4,1123,-4,0,-3,1124,-1,-7,1229],
    sm976=[0,-2,1230,-1,0,-4,0,-4,-1,-2,1230,-4,1230,-6,1230,-6,1230,-13,1230,1230,-3,1230,-4,1230,1230,-17,1230,1230,1230,-5,1230,-2,1230],
    sm977=[0,-4,1231,-4,0,-3,1231,-1,-7,1231],
    sm978=[0,-4,1232,-4,0,-3,1232,-1,-7,1232],
    sm979=[0,-1,971,386,-1,0,-4,0,-4,-1],
    sm980=[0,-1,1233,1233,-1,0,-4,0,-4,-1],
    sm981=[0,-1,1233,1233,-1,0,-4,0,-4,-1,-10,1234],
    sm982=[0,-2,1235,-1,0,-4,0,-4,-1],
    sm983=[0,-2,1235,-1,0,-4,0,-4,-1,-10,1236],
    sm984=[0,-4,0,-4,0,-4,-1,-4,1237,-2,1237,-2,1237,-4,1237,-37,1237],
    sm985=[0,-1,1238,-2,0,-4,0,-4,-1],
    sm986=[0,-4,0,-4,0,-4,-1,-4,1239,-2,1239,-2,1239,-4,1239,-37,1239],
    sm987=[0,-4,1142,-4,0,-3,1143,-1,-7,1240],
    sm988=[0,-4,1241,-4,0,-3,1241,-1,-7,1241],
    sm989=[0,-4,1242,-4,0,-3,1242,-1,-7,1242],
    sm990=[0,-1,1145,-2,0,-4,0,-4,-1,-38,1243,-4,1146,1147],
    sm991=[0,-1,1244,-2,0,-4,0,-4,-1,-38,1244,-4,1244,1244],
    sm992=[0,-4,0,-4,0,-4,-1,-35,1245,1246],
    sm993=[0,-4,0,-4,0,-4,-1,-35,1247,1247],
    sm994=[0,-4,0,-4,0,-4,-1,-35,1248,1248],
    sm995=[0,-4,0,-4,0,-4,-1,-54,1249],
    sm996=[0,-4,0,-4,0,-4,-1,-38,1250],
    sm997=[0,-4,0,-4,0,-4,-1,-7,1251,-28,1251,-8,1251],
    sm998=[0,-4,0,-4,0,-4,-1,-7,1252,-28,1252,-9,1252],
    sm999=[0,-4,0,-4,0,-4,-1,-7,1253,-28,1253,-8,1253],
    sm1000=[0,-4,0,-4,0,-4,-1,-7,1254,-28,1254,-9,1254],
    sm1001=[0,-4,0,-4,0,-4,-1,-7,1255,-28,1255,-8,1255,1255],
    sm1002=[0,-4,0,-4,0,-4,-1,-7,1256,-28,1256,-8,1256,1256],
    sm1003=[0,-4,0,-4,0,-4,-1,-7,1257],
    sm1004=[0,-2,1258,-1,0,-4,0,-4,-1,-2,1258,-11,1258,-6,1258,-14,1258,-1,1258,-1,1258,-23,1258,1258,1258,-8,1258],
    sm1005=[0,-2,1259,-1,0,-4,0,-4,-1,-38,1259,-1,1259,-31,1259],
    sm1006=[0,-2,1260,-1,0,-4,0,-4,-1,-7,1260,-30,1260,-1,1260,-31,1260],
    sm1007=[0,-2,997,-1,998,-4,0,-3,999,-1,-6,1000,1261,-30,1261,-1,1261,-31,1261,-68,1261],
    sm1008=[0,-4,0,-4,0,-4,-1,-74,1262],
    sm1009=[0,-2,1263,-1,1263,-4,0,-3,1263,-1,-6,1263,1263,-30,1263,-1,1263,-31,1263,-68,1263],
    sm1010=[0,-2,997,-1,998,-4,0,-3,999,-1,-6,1000,1264],
    sm1011=[0,-4,0,-4,0,-4,-1,-22,1265],
    sm1012=[0,-2,1266,-1,0,-4,0,-4,-1,-7,1266,-6,1266,1266,-5,1266,-13,1266,1266,-24,1266,1266,1266,1266,1266,1266,-8,1266],
    sm1013=[0,-4,0,-4,0,-4,-1,-22,1267],
    sm1014=[0,-2,1268,-1,0,-4,0,-4,-1,-7,1268,-6,1268,1268,-5,1268,-13,1268,1268,-24,1268,1268,1268,1268,1268,1268,-8,1268],
    sm1015=[0,1211,1211,1211,-1,1211,1211,1211,1211,1211,1211,-4,-1,1211,-1,1211,-1,1211,1211,1211,1211,-2,1211,1211,-2,1211,1211,-5,1211,1211,1211,-1,1211,-3,1211,-5,1211,1211,-1,1211,-14,1211,1211,-1,1211,-4,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,-2,1211,1211,1211,-1,1211,-1,1211,1211,-1,1211,1211,-1,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,1211,-5,1211,1211,-2,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-21,1211],
    sm1016=[0,-1,247,248,-1,249,250,251,252,253,1031,-4,-1,-19,1269,-151,254],
    sm1017=[0,-1,1270,1270,-1,1270,1270,1270,1270,1270,1270,-4,-1,-2,1270,-1,1270,-1,1270,-14,1270,-1,1270,-1,1270,-3,1270,-6,1270,-134,1270],
    sm1018=[0,-1,1271,1271,-1,1271,1271,1271,1271,1271,1271,-4,-1,-19,1271,-151,1271],
    sm1019=[0,-1,247,248,-1,249,250,251,252,253,1272,-4,-1,-19,1272,-151,254],
    sm1020=[0,-1,1273,1273,-1,1273,1273,1273,1273,1273,1273,-4,-1,-19,1273,-151,1273],
    sm1021=[0,-4,0,-4,0,-4,-1,-7,1274],
    sm1022=[0,-4,0,-4,0,-4,-1,-7,1275],
    sm1023=[0,-4,-1,-4,0,-9,507,507,1185,1186,-2,507,507,-3,507,-5,507,-13,507,-17,507,507,-1,507,-4,507,-1,507,507,507,507,507,-1,507,-6,507,-28,507,-9,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,507,-4,507,507],
    sm1024=[0,-1,1,2,-1,0,-4,0,-9,78,-1,5,1276,-13,79,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm1025=[0,-1,1277,1277,-1,1277,1277,1277,1277,1277,1277,-7,1277,-1,1277,1277,1277,1277,-6,1277,1277,-5,1277,1277,1277,1277,1277,1277,-2,1277,-6,1277,-1,1277,-105,1277,1277,-25,1277],
    sm1026=[0,-4,0,-4,0,-4,-1,-38,1278],
    sm1027=[0,-4,0,-4,0,-4,-1,-38,1279],
    sm1028=[0,1280,1280,1280,-1,0,-4,0,-4,-1,1280,-1,1280,-1,1280,-1,1280,-14,1280,-14,1280,-1,1280,-22,1280,1280,-9,1280,-3,1280,1280,-1,1280,1280,1280,1280,-1,1280,1280,1280,1280,1280,1280,1280,1280,-1,1280,1280,1280,1280,1280,1280,1280,1280,-2,1280,1280,-5,1280,1280,-2,1280,-23,1280,1280,1280,1280,1280,1280,1280,1280,1280,1280,1280,1280],
    sm1029=[0,1281,1281,1281,-1,0,-4,0,-4,-1,1281,-1,1281,-1,1281,-1,1281,-14,1281,-14,1281,-1,1281,-22,1281,1281,-9,1281,-3,1281,1281,-1,1281,1281,1281,1281,-1,1281,1281,1281,1281,1281,1281,1281,1281,-1,1281,1281,1281,1281,1281,1281,1281,1281,-2,1281,1281,-5,1281,1281,-2,1281,-23,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281],
    sm1030=[0,1282,1282,1282,-1,0,-4,0,-4,-1,1282,-1,1282,-1,1282,-1,1282,-14,1282,-14,1282,-1,1282,-22,1282,1282,-9,1282,-3,1282,1282,-1,1282,1282,1282,1282,-1,1282,1282,1282,1282,1282,1282,1282,1282,-1,1282,1282,1282,1282,1282,1282,1282,1282,-2,1282,1282,-5,1282,1282,-2,1282,-23,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282],
    sm1031=[0,1283,1283,1283,-1,0,-4,0,-4,-1,1283,-1,1283,-1,1283,-1,1283,-14,1283,-14,1283,-1,1283,-22,1283,1283,-9,1283,-3,1283,1283,-1,1283,1283,1283,1283,-1,1283,1283,1283,1283,1283,1283,1283,1283,-1,1283,1283,1283,1283,1283,1283,1283,1283,-2,1283,1283,-5,1283,1283,-2,1283,-23,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283],
    sm1032=[0,-4,0,-4,0,-4,-1,-38,1284],
    sm1033=[0,1285,1285,1285,-1,0,-4,0,-4,-1,1285,-1,1285,-1,1285,-1,1285,-14,1285,-14,1285,-1,1285,-22,1285,1285,-9,1285,-3,1285,1285,-1,1285,1285,1285,1285,-1,1285,1285,1285,1285,1285,1285,1285,1285,-1,1285,1285,1285,1285,1285,1285,1285,1285,-2,1285,1285,-5,1285,1285,-2,1285,-23,1285,1285,1285,1285,1285,1285,1285,1285,1285,1285,1285,1285],
    sm1034=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,78,-1,5,-29,85,-1,1286,-22,7,8,-9,9,-3,10,11,-2,1286,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,1286,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
    sm1035=[0,-4,0,-4,0,-4,-1,-38,1287,-60,1287],
    sm1036=[0,1288,1288,1288,-1,0,-4,0,-4,-1,1288,-1,1288,-1,1288,1288,1288,1288,-2,1288,1288,-3,1288,-5,1288,1288,-12,1288,1288,-1,1288,-14,1288,1288,-1,1288,-4,1288,1288,1288,1288,1288,1288,1288,-1,1288,-2,1288,-2,1288,1288,1288,-1,1288,1288,1288,1288,-1,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,-2,1288,1288,-5,1288,1288,-2,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288,1288],
    sm1037=[0,-2,1289,-1,0,-4,0,-4,-1,-2,1289,-11,1289,-6,1289,-13,962,1289,-3,1289,-23,1289,1289,1289,-5,1289,-2,1289],
    sm1038=[0,-4,0,-4,0,-4,-1,-7,1290],
    sm1039=[0,-4,0,-4,0,-4,-1,-7,1291],
    sm1040=[0,-4,0,-4,0,-4,-1,-6,975,-68,803],
    sm1041=[0,-2,1292,-1,0,-4,0,-4,-1,-2,1292,-3,1292,-7,1292,-6,1292,-14,1292,-2,1292,1292,-6,1292,-2,1292,-13,1292,1292,1292,-5,1292,-2,1292],
    sm1042=[0,-4,0,-4,0,-4,-1,-72,1293],
    sm1043=[0,-2,1294,-1,0,-4,0,-4,-1,-14,1294,-6,1294,-14,1294,-1,1294,-25,1294,1294,1294,-8,1294],
    sm1044=[0,-2,1295,-1,0,-4,0,-4,-1,-2,1295,-4,1295,-6,1295,-6,1295,-13,1295,1295,-3,1295,-4,1295,1295,-17,1295,1295,1295,-5,1295,-2,1295],
    sm1045=[0,-4,1296,-4,0,-3,1296,-1,-7,1296],
    sm1046=[0,-4,0,-4,0,-4,-1,-7,1297],
    sm1047=[0,-4,0,-4,0,-4,-1,-7,1137],
    sm1048=[0,-4,0,-4,0,-4,-1,-7,1125],
    sm1049=[0,-4,0,-4,0,-4,-1,-7,1298],
    sm1050=[0,-1,1299,1299,-1,0,-4,0,-4,-1],
    sm1051=[0,-4,0,-4,0,-4,-1,-15,1300],
    sm1052=[0,-4,0,-4,0,-4,-1,-4,1301,-48,1302],
    sm1053=[0,-2,1303,-1,0,-4,0,-4,-1],
    sm1054=[0,-4,0,-4,0,-4,-1,-4,1304,-2,1304,-2,1304,-4,1304,-37,1304],
    sm1055=[0,-4,1305,-4,0,-3,1305,-1,-7,1305],
    sm1056=[0,-4,0,-4,0,-4,-1,-72,1306],
    sm1057=[0,-1,1307,-2,0,-4,0,-4,-1,-38,1307,-4,1307,1307],
    sm1058=[0,-4,0,-4,0,-4,-1,-35,1308,1308],
    sm1059=[0,-4,0,-4,0,-4,-1,-72,1309],
    sm1060=[0,-4,0,-4,0,-4,-1,-7,1310,-28,1310,-8,1310,1310],
    sm1061=[0,-2,1311,-1,0,-4,0,-4,-1,-7,1311,-30,1311,-1,1311,-31,1311],
    sm1062=[0,-2,1312,-1,1312,-4,0,-3,1312,-1,-6,1312,1312,-30,1312,-1,1312,-31,1312,-68,1312],
    sm1063=[0,-2,1313,-1,0,-4,0,-4,-1,-7,1313,-6,1313,1313,-5,1313,-13,1313,1313,-24,1313,1313,1313,1313,1313,1313,-8,1313],
    sm1064=[0,-1,1314,1314,-1,1314,1314,1314,1314,1314,1314,-4,-1,-2,1314,-1,1314,-1,1314,-14,1314,-1,1314,-1,1314,-3,1314,-6,1314,-134,1314],
    sm1065=[0,-1,1315,1315,-1,1315,1315,1315,1315,1315,1315,-4,-1,-2,1315,-1,1315,-1,1315,1315,-6,1315,-6,1315,-1,1315,1315,1315,1315,-2,1315,-6,1315,-1,1315,-132,1315],
    sm1066=[0,-4,0,-4,0,-12,1316],
    sm1067=[0,-4,-1,-4,0,-12,1317],
    sm1068=[0,-1,1318,1318,-1,0,-4,0,-4,-1,-21,1318,-13,1318,-2,1318,-33,1318,-4,1318,-29,1318,1318,1318,-34,1318,1318,-3,1318],
    sm1069=[0,-1,1319,1319,-1,0,-4,0,-4,-1,-21,1319,-13,1319,-2,1319,-33,1319,-4,1319,-29,1319,1319,1319,-34,1319,1319,-3,1319],
    sm1070=[0,-4,0,-4,0,-4,-1,-38,1320],
    sm1071=[0,1321,1321,1321,-1,0,-4,0,-4,-1,1321,-1,1321,-1,1321,-1,1321,-14,1321,-14,1321,-1,1321,-22,1321,1321,-9,1321,-3,1321,1321,-1,1321,1321,1321,1321,-1,1321,1321,1321,1321,1321,1321,1321,1321,-1,1321,1321,1321,1321,1321,1321,1321,1321,-2,1321,1321,-5,1321,1321,-2,1321,-23,1321,1321,1321,1321,1321,1321,1321,1321,1321,1321,1321,1321],
    sm1072=[0,1322,1322,1322,-1,0,-4,0,-4,-1,1322,-1,1322,-1,1322,-1,1322,-14,1322,-14,1322,-1,1322,-22,1322,1322,-9,1322,-3,1322,1322,-1,1322,1322,1322,1322,-1,1322,1322,1322,1322,1322,1322,1322,1322,-1,1322,1322,1322,1322,1322,1322,1322,1322,-2,1322,1322,-5,1322,1322,-2,1322,-23,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322],
    sm1073=[0,-4,0,-4,0,-4,-1,-38,1323,-41,1323,-18,1323],
    sm1074=[0,-2,1324,-1,0,-4,0,-4,-1,-2,1324,-3,1324,-7,1324,-6,1324,-14,1324,-3,1324,-6,1324,-2,1324,-13,1324,1324,1324,-5,1324,-2,1324],
    sm1075=[0,-1,1325,1325,-1,0,-4,0,-4,-1,-10,1326],
    sm1076=[0,-1,1327,1327,-1,0,-4,0,-4,-1],
    sm1077=[0,-2,386,-1,0,-4,0,-4,-1,-38,1328,-1,391,-31,1329],
    sm1078=[0,-4,0,-4,0,-4,-1,-35,1330,1330],
    sm1079=[0,-4,-1,-4,0,-12,1331],
    sm1080=[0,-1,1332,1332,-1,1332,1332,1332,1332,1332,1332,-7,1332,-1,1332,1332,1332,1332,-6,1332,1332,-5,1332,1332,1332,1332,1332,1332,-2,1332,-6,1332,-1,1332,-105,1332,1332,-25,1332],
    sm1081=[0,-1,1333,1333,-1,0,-4,0,-4,-1,-21,1333,-13,1333,-2,1333,-33,1333,-4,1333,-29,1333,1333,1333,-34,1333,1333,-3,1333],
    sm1082=[0,-4,0,-4,0,-4,-1,-7,1334],
    sm1083=[0,-1,1335,1335,-1,0,-4,0,-4,-1],
    sm1084=[0,-4,0,-4,0,-4,-1,-38,1336],
    sm1085=[0,-1,1337,-2,0,-4,0,-4,-1,-38,1337,-4,1337,1337],
    sm1086=[0,-1,1338,1338,-1,1338,1338,1338,1338,1338,1338,-7,1338,-1,1338,1338,1338,1338,-6,1338,1338,-5,1338,1338,1338,1338,1338,1338,-2,1338,-6,1338,-1,1338,-105,1338,1338,-25,1338],
    sm1087=[0,-1,1339,-2,0,-4,0,-4,-1,-38,1339,-4,1339,1339],

        // Symbol Lookup map
        lu = new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,11],[200,13],[201,14],["import",15],["link",16],["</",17],[">",30],["<",19],["/",20],["(",21],[")",22],[null,14],["=",25],["===",26],["-",91],["---",28],["#",29],["+",76],["*",79],["```",34],["[",36],["]",37],["{{{",38],["}}}",39],["{{",40],["}}",41],["{",51],["}",53],["``",44],[",",50],[";",87],["supports",54],["@",55],["keyframes",56],["id",57],["from",58],["to",59],["and",60],["or",61],["not",62],["media",64],["only",65],[":",90],["<=",68],["%",69],["px",70],["in",71],["rad",72],["url",73],["\"",159],["'",160],["~",77],["||",78],["|",80],[".",81],["^=",82],["$=",83],["*=",84],["i",85],["s",86],["!",156],["important",89],["_",92],["as",93],["export",94],["default",95],["function",96],["class",97],["async",98],["let",99],["if",100],["else",101],["var",102],["do",103],["while",104],["for",105],["await",106],["of",107],["continue",108],["break",109],["return",110],["throw",111],["with",112],["switch",113],["case",114],["try",115],["catch",116],["finally",117],["debugger",118],["const",119],["=>",120],["extends",121],["static",122],["get",123],["set",124],["new",125],["super",126],["target",127],["...",128],["this",129],["/=",130],["%=",131],["+=",132],["-=",133],["<<=",134],[">>=",135],[">>>=",136],["&=",137],["|=",138],["**=",139],["?",140],["&&",141],["^",142],["&",143],["==",144],["!=",145],["!==",146],[">=",147],["instanceof",148],["<<",149],[">>",150],[">>>",151],["**",152],["delete",153],["void",154],["typeof",155],["++",157],["--",158],["null",161],["true",162],["false",163],["$",164],["style",166],["script",167],["js",168],["f",169],["filter",170],["input",171],["area",172],["base",173],["br",174],["col",175],["command",176],["embed",177],["hr",178],["img",179],["keygen",180],["meta",181],["param",182],["source",183],["track",184],["wbr",185],["\\",186]]),

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
    sm19,
    sm20,
    sm21,
    sm21,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
    sm22,
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
    sm67,
    sm43,
    sm68,
    sm69,
    sm70,
    sm71,
    sm72,
    sm73,
    sm74,
    sm74,
    sm75,
    sm76,
    sm77,
    sm78,
    sm79,
    sm80,
    sm81,
    sm82,
    sm43,
    sm83,
    sm84,
    sm85,
    sm85,
    sm85,
    sm86,
    sm87,
    sm88,
    sm71,
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
    sm101,
    sm101,
    sm102,
    sm103,
    sm104,
    sm105,
    sm105,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
    sm106,
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
    sm124,
    sm125,
    sm126,
    sm127,
    sm127,
    sm128,
    sm129,
    sm130,
    sm131,
    sm132,
    sm124,
    sm133,
    sm134,
    sm134,
    sm43,
    sm135,
    sm136,
    sm43,
    sm43,
    sm43,
    sm137,
    sm138,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
    sm139,
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
    sm140,
    sm44,
    sm141,
    sm51,
    sm142,
    sm143,
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
    sm155,
    sm43,
    sm156,
    sm43,
    sm154,
    sm157,
    sm158,
    sm47,
    sm159,
    sm160,
    sm161,
    sm162,
    sm163,
    sm164,
    sm164,
    sm164,
    sm164,
    sm164,
    sm164,
    sm165,
    sm165,
    sm166,
    sm167,
    sm168,
    sm169,
    sm169,
    sm169,
    sm169,
    sm169,
    sm169,
    sm169,
    sm170,
    sm167,
    sm171,
    sm172,
    sm172,
    sm172,
    sm172,
    sm172,
    sm172,
    sm172,
    sm173,
    sm174,
    sm71,
    sm175,
    sm154,
    sm43,
    sm176,
    sm177,
    sm178,
    sm179,
    sm180,
    sm181,
    sm182,
    sm183,
    sm184,
    sm185,
    sm186,
    sm186,
    sm187,
    sm188,
    sm43,
    sm189,
    sm43,
    sm190,
    sm191,
    sm43,
    sm192,
    sm193,
    sm194,
    sm195,
    sm196,
    sm197,
    sm198,
    sm43,
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
    sm184,
    sm184,
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
    sm233,
    sm233,
    sm233,
    sm233,
    sm234,
    sm235,
    sm236,
    sm237,
    sm237,
    sm237,
    sm237,
    sm238,
    sm238,
    sm105,
    sm105,
    sm239,
    sm240,
    sm241,
    sm242,
    sm243,
    sm244,
    sm245,
    sm246,
    sm246,
    sm116,
    sm247,
    sm248,
    sm248,
    sm43,
    sm249,
    sm250,
    sm250,
    sm251,
    sm251,
    sm252,
    sm253,
    sm254,
    sm255,
    sm255,
    sm43,
    sm256,
    sm257,
    sm258,
    sm259,
    sm260,
    sm261,
    sm154,
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
    sm272,
    sm272,
    sm273,
    sm274,
    sm275,
    sm276,
    sm277,
    sm278,
    sm279,
    sm280,
    sm280,
    sm281,
    sm282,
    sm283,
    sm284,
    sm285,
    sm286,
    sm287,
    sm287,
    sm287,
    sm287,
    sm288,
    sm288,
    sm288,
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
    sm43,
    sm308,
    sm309,
    sm310,
    sm311,
    sm312,
    sm313,
    sm314,
    sm315,
    sm314,
    sm316,
    sm317,
    sm318,
    sm319,
    sm320,
    sm321,
    sm322,
    sm323,
    sm324,
    sm123,
    sm325,
    sm326,
    sm326,
    sm327,
    sm71,
    sm328,
    sm43,
    sm328,
    sm329,
    sm330,
    sm331,
    sm154,
    sm332,
    sm333,
    sm334,
    sm335,
    sm336,
    sm336,
    sm43,
    sm337,
    sm338,
    sm339,
    sm340,
    sm71,
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
    sm71,
    sm354,
    sm71,
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
    sm83,
    sm366,
    sm367,
    sm368,
    sm369,
    sm370,
    sm371,
    sm372,
    sm373,
    sm372,
    sm374,
    sm375,
    sm376,
    sm377,
    sm378,
    sm379,
    sm380,
    sm381,
    sm382,
    sm383,
    sm384,
    sm385,
    sm71,
    sm386,
    sm386,
    sm387,
    sm388,
    sm389,
    sm390,
    sm391,
    sm392,
    sm393,
    sm392,
    sm394,
    sm395,
    sm396,
    sm397,
    sm398,
    sm399,
    sm400,
    sm401,
    sm402,
    sm403,
    sm404,
    sm404,
    sm405,
    sm406,
    sm407,
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
    sm443,
    sm444,
    sm444,
    sm444,
    sm444,
    sm445,
    sm446,
    sm447,
    sm448,
    sm449,
    sm450,
    sm450,
    sm450,
    sm390,
    sm451,
    sm452,
    sm451,
    sm453,
    sm454,
    sm455,
    sm456,
    sm456,
    sm457,
    sm458,
    sm459,
    sm460,
    sm461,
    sm458,
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
    sm472,
    sm473,
    sm474,
    sm43,
    sm475,
    sm476,
    sm477,
    sm478,
    sm479,
    sm480,
    sm481,
    sm482,
    sm482,
    sm483,
    sm484,
    sm485,
    sm486,
    sm487,
    sm487,
    sm488,
    sm489,
    sm490,
    sm491,
    sm154,
    sm492,
    sm493,
    sm494,
    sm495,
    sm496,
    sm154,
    sm43,
    sm497,
    sm498,
    sm499,
    sm500,
    sm501,
    sm502,
    sm503,
    sm504,
    sm71,
    sm505,
    sm505,
    sm506,
    sm507,
    sm508,
    sm509,
    sm510,
    sm511,
    sm511,
    sm512,
    sm513,
    sm71,
    sm514,
    sm515,
    sm516,
    sm517,
    sm518,
    sm517,
    sm517,
    sm519,
    sm520,
    sm520,
    sm521,
    sm75,
    sm43,
    sm75,
    sm522,
    sm523,
    sm524,
    sm43,
    sm525,
    sm526,
    sm43,
    sm527,
    sm528,
    sm529,
    sm530,
    sm531,
    sm530,
    sm530,
    sm532,
    sm533,
    sm71,
    sm533,
    sm71,
    sm534,
    sm75,
    sm535,
    sm71,
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
    sm547,
    sm548,
    sm549,
    sm550,
    sm551,
    sm552,
    sm553,
    sm554,
    sm554,
    sm555,
    sm556,
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
    sm566,
    sm567,
    sm568,
    sm569,
    sm406,
    sm570,
    sm571,
    sm572,
    sm573,
    sm574,
    sm575,
    sm576,
    sm577,
    sm578,
    sm570,
    sm579,
    sm580,
    sm580,
    sm580,
    sm580,
    sm581,
    sm582,
    sm582,
    sm583,
    sm584,
    sm585,
    sm586,
    sm587,
    sm588,
    sm589,
    sm590,
    sm591,
    sm592,
    sm592,
    sm592,
    sm593,
    sm593,
    sm594,
    sm595,
    sm596,
    sm421,
    sm597,
    sm598,
    sm599,
    sm421,
    sm600,
    sm601,
    sm565,
    sm565,
    sm565,
    sm602,
    sm603,
    sm604,
    sm605,
    sm606,
    sm607,
    sm608,
    sm609,
    sm610,
    sm440,
    sm611,
    sm440,
    sm612,
    sm613,
    sm614,
    sm614,
    sm614,
    sm614,
    sm615,
    sm615,
    sm615,
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
    sm451,
    sm635,
    sm636,
    sm637,
    sm638,
    sm639,
    sm640,
    sm641,
    sm642,
    sm643,
    sm644,
    sm645,
    sm645,
    sm645,
    sm645,
    sm645,
    sm645,
    sm645,
    sm645,
    sm645,
    sm93,
    sm461,
    sm611,
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
    sm71,
    sm657,
    sm658,
    sm658,
    sm659,
    sm660,
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
    sm675,
    sm676,
    sm676,
    sm677,
    sm678,
    sm679,
    sm680,
    sm681,
    sm682,
    sm683,
    sm684,
    sm685,
    sm686,
    sm75,
    sm687,
    sm688,
    sm689,
    sm75,
    sm690,
    sm43,
    sm691,
    sm692,
    sm692,
    sm693,
    sm694,
    sm695,
    sm696,
    sm697,
    sm697,
    sm698,
    sm699,
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
    sm709,
    sm710,
    sm711,
    sm712,
    sm713,
    sm714,
    sm715,
    sm715,
    sm715,
    sm715,
    sm715,
    sm715,
    sm715,
    sm716,
    sm717,
    sm718,
    sm719,
    sm720,
    sm721,
    sm722,
    sm723,
    sm724,
    sm724,
    sm725,
    sm726,
    sm727,
    sm728,
    sm729,
    sm730,
    sm421,
    sm731,
    sm732,
    sm732,
    sm733,
    sm733,
    sm734,
    sm735,
    sm736,
    sm737,
    sm737,
    sm738,
    sm739,
    sm740,
    sm741,
    sm741,
    sm742,
    sm743,
    sm744,
    sm569,
    sm745,
    sm745,
    sm746,
    sm746,
    sm747,
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
    sm759,
    sm760,
    sm761,
    sm762,
    sm763,
    sm764,
    sm765,
    sm766,
    sm767,
    sm767,
    sm767,
    sm767,
    sm768,
    sm570,
    sm769,
    sm770,
    sm771,
    sm772,
    sm720,
    sm773,
    sm774,
    sm775,
    sm720,
    sm440,
    sm776,
    sm777,
    sm778,
    sm779,
    sm780,
    sm781,
    sm782,
    sm782,
    sm783,
    sm784,
    sm785,
    sm626,
    sm786,
    sm787,
    sm787,
    sm787,
    sm788,
    sm789,
    sm790,
    sm791,
    sm792,
    sm793,
    sm626,
    sm794,
    sm795,
    sm795,
    sm795,
    sm796,
    sm797,
    sm798,
    sm798,
    sm799,
    sm800,
    sm801,
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
    sm637,
    sm814,
    sm815,
    sm816,
    sm817,
    sm818,
    sm819,
    sm820,
    sm821,
    sm822,
    sm823,
    sm824,
    sm825,
    sm826,
    sm826,
    sm827,
    sm828,
    sm829,
    sm828,
    sm75,
    sm830,
    sm831,
    sm832,
    sm75,
    sm833,
    sm75,
    sm75,
    sm834,
    sm75,
    sm835,
    sm75,
    sm75,
    sm836,
    sm75,
    sm837,
    sm838,
    sm839,
    sm840,
    sm841,
    sm43,
    sm842,
    sm83,
    sm843,
    sm844,
    sm845,
    sm846,
    sm847,
    sm848,
    sm849,
    sm850,
    sm851,
    sm852,
    sm851,
    sm853,
    sm854,
    sm855,
    sm856,
    sm857,
    sm858,
    sm859,
    sm860,
    sm861,
    sm862,
    sm863,
    sm864,
    sm865,
    sm866,
    sm867,
    sm868,
    sm567,
    sm869,
    sm870,
    sm871,
    sm872,
    sm873,
    sm874,
    sm875,
    sm735,
    sm876,
    sm735,
    sm877,
    sm878,
    sm879,
    sm880,
    sm735,
    sm881,
    sm881,
    sm881,
    sm882,
    sm883,
    sm884,
    sm885,
    sm885,
    sm886,
    sm887,
    sm868,
    sm888,
    sm889,
    sm890,
    sm891,
    sm743,
    sm892,
    sm743,
    sm893,
    sm894,
    sm895,
    sm570,
    sm896,
    sm897,
    sm898,
    sm899,
    sm900,
    sm901,
    sm902,
    sm758,
    sm903,
    sm904,
    sm904,
    sm904,
    sm905,
    sm906,
    sm906,
    sm907,
    sm908,
    sm909,
    sm854,
    sm855,
    sm910,
    sm854,
    sm855,
    sm911,
    sm912,
    sm913,
    sm914,
    sm915,
    sm626,
    sm916,
    sm790,
    sm917,
    sm918,
    sm919,
    sm919,
    sm920,
    sm921,
    sm922,
    sm626,
    sm923,
    sm924,
    sm925,
    sm926,
    sm927,
    sm927,
    sm927,
    sm927,
    sm927,
    sm927,
    sm928,
    sm928,
    sm928,
    sm928,
    sm928,
    sm928,
    sm929,
    sm930,
    sm931,
    sm123,
    sm123,
    sm932,
    sm933,
    sm934,
    sm935,
    sm936,
    sm75,
    sm75,
    sm937,
    sm75,
    sm938,
    sm939,
    sm940,
    sm75,
    sm941,
    sm942,
    sm943,
    sm75,
    sm944,
    sm945,
    sm946,
    sm947,
    sm945,
    sm948,
    sm949,
    sm950,
    sm951,
    sm952,
    sm953,
    sm954,
    sm955,
    sm956,
    sm957,
    sm957,
    sm569,
    sm958,
    sm959,
    sm958,
    sm960,
    sm961,
    sm962,
    sm963,
    sm964,
    sm965,
    sm966,
    sm967,
    sm968,
    sm969,
    sm970,
    sm971,
    sm972,
    sm973,
    sm974,
    sm975,
    sm976,
    sm977,
    sm978,
    sm978,
    sm979,
    sm979,
    sm980,
    sm981,
    sm980,
    sm980,
    sm421,
    sm421,
    sm421,
    sm982,
    sm983,
    sm982,
    sm982,
    sm984,
    sm985,
    sm986,
    sm986,
    sm986,
    sm987,
    sm976,
    sm988,
    sm989,
    sm989,
    sm990,
    sm991,
    sm992,
    sm993,
    sm994,
    sm994,
    sm994,
    sm995,
    sm996,
    sm997,
    sm998,
    sm999,
    sm1000,
    sm1001,
    sm1002,
    sm1003,
    sm1004,
    sm1005,
    sm1006,
    sm1007,
    sm1008,
    sm1009,
    sm1010,
    sm1011,
    sm1012,
    sm1013,
    sm1013,
    sm1014,
    sm955,
    sm955,
    sm1015,
    sm1016,
    sm1017,
    sm1018,
    sm1019,
    sm1020,
    sm1021,
    sm1022,
    sm1022,
    sm1023,
    sm1024,
    sm1025,
    sm1026,
    sm1027,
    sm123,
    sm75,
    sm1028,
    sm1029,
    sm1030,
    sm1030,
    sm1031,
    sm1032,
    sm1033,
    sm1033,
    sm1034,
    sm1035,
    sm1036,
    sm1037,
    sm1038,
    sm1039,
    sm1039,
    sm1040,
    sm1041,
    sm1042,
    sm1043,
    sm1044,
    sm1045,
    sm1046,
    sm1047,
    sm1048,
    sm1049,
    sm1050,
    sm1049,
    sm1051,
    sm1052,
    sm1053,
    sm1054,
    sm1044,
    sm1055,
    sm1056,
    sm1057,
    sm406,
    sm887,
    sm1058,
    sm1059,
    sm1060,
    sm1061,
    sm1062,
    sm1063,
    sm1064,
    sm1065,
    sm1066,
    sm1067,
    sm1068,
    sm1069,
    sm1070,
    sm1071,
    sm1072,
    sm1073,
    sm1074,
    sm979,
    sm1075,
    sm979,
    sm1076,
    sm1076,
    sm1077,
    sm1078,
    sm1079,
    sm1080,
    sm1081,
    sm1082,
    sm1083,
    sm1082,
    sm1084,
    sm1085,
    sm1086,
    sm1087],

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
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
    e$1,
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
    R00_S=function (sym,env,lex,state,output,len) {return sym[0]},
    R20_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return ((sym[1] !== null) ? sym[0].push(sym[1]) : null,sym[0])},
    R21_IMPORT_TAG_list=function (sym,env,lex,state,output,len) {return (sym[0] !== null) ? [sym[0]] : []},
    R60_IMPORT_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],null,env,lex)},
    I80_BASIC_BINDING=function (sym,env,lex,state,output,len) {env.start = lex.off+2;},
    R100_wickup_WICKUP_PLUGIN=function (sym,env,lex,state,output,len) {return sym[1]},
    R120_wickup_PRE_MD_BLK=function (sym,env,lex,state,output,len) {return sym[0] + sym[1].join("")},
    R150_wickup_HORIZONTAL_RULE=function (sym,env,lex,state,output,len) {return fn.element_selector("hr",null,null,env,lex)},
    R240_wickup_HEADER=function (sym,env,lex,state,output,len) {return fn.element_selector("h" + Math.min(sym[0].length,6),null,sym[1],env,lex)},
    R300_wickup_BLOCK_QUOTES=function (sym,env,lex,state,output,len) {return fn.element_selector("blockquote",null,sym[2],env,lex,sym[0].length)},
    R301_wickup_BLOCK_QUOTES=function (sym,env,lex,state,output,len) {return fn.element_selector("blockquote",null,sym[1],env,lex,sym[0].length)},
    R370_wickup_UNORDERED_LIST_ITEM=function (sym,env,lex,state,output,len) {return fn.element_selector("li",null,sym[2],env,lex,sym[0].length)},
    R371_wickup_UNORDERED_LIST_ITEM=function (sym,env,lex,state,output,len) {return fn.element_selector("li",null,sym[1],env,lex,sym[0].length)},
    R400_wickup_CODE_BLOCK4301_group_list=function (sym,env,lex,state,output,len) {return sym[0] + sym[1]},
    R401_wickup_CODE_BLOCK4301_group_list=function (sym,env,lex,state,output,len) {return sym[0] + ""},
    R410_wickup_CODE_BLOCK4411_group=function (sym,env,lex,state,output,len) {return fn.element_selector("code",null,[new fn.text([sym[0] + sym[1]],env)],env,lex)},
    R411_wickup_CODE_BLOCK4411_group=function (sym,env,lex,state,output,len) {return fn.element_selector("code",null,[new fn.text([sym[0]],env)],env,lex)},
    R430_wickup_CODE_BLOCK=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,sym[3],env,lex)},
    R431_wickup_CODE_BLOCK=function (sym,env,lex,state,output,len) {return fn.element_selector("pre",null,sym[2],env,lex)},
    R450_wickup_LINK=function (sym,env,lex,state,output,len) {return fn.element_selector("a",[new fn.attribute(["href","",sym[1]])],[sym[4]],env,lex)},
    R470_wickup_ITALIC_BOLD_EMPHASIS=function (sym,env,lex,state,output,len) {return fn.element_selector("i",null,[fn.element_selector("b",null,sym[1],env,lex)],env,lex)},
    R490_wickup_BOLD_EMPHASIS=function (sym,env,lex,state,output,len) {return fn.element_selector("b",null,sym[1],env,lex)},
    R510_wickup_EMPHASIS=function (sym,env,lex,state,output,len) {return fn.element_selector("i",null,sym[1],env,lex)},
    R520_wickup_CODE_QUOTE=function (sym,env,lex,state,output,len) {return fn.element_selector("code",null,[new fn.text([sym[1]],env)],env,lex)},
    R630_css_STYLE_SHEET=function (sym,env,lex,state,output,len) {return new fn.ruleset(sym[0],sym[1])},
    R631_css_STYLE_SHEET=function (sym,env,lex,state,output,len) {return new fn.ruleset(null,sym[0])},
    R632_css_STYLE_SHEET=function (sym,env,lex,state,output,len) {return new fn.ruleset(sym[0],null)},
    R640_css_COMPLEX_SELECTOR_list=function (sym,env,lex,state,output,len) {return ((sym[1] !== null) ? sym[0].push(sym[2]) : null,sym[0])},
    R650_css_STYLE_RULE=function (sym,env,lex,state,output,len) {return new fn.stylerule(sym[0],sym[2])},
    R651_css_STYLE_RULE=function (sym,env,lex,state,output,len) {return new fn.stylerule(null,sym[1])},
    C760_css_keyframes=function (sym,env,lex,state,output,len) {this.keyframes = sym[4];},
    C790_css_keyframes_blocks=function (sym,env,lex,state,output,len) {this.selectors = sym[0];this.props = sym[2].props;},
    R1440_css_TYPE_SELECTOR=function (sym,env,lex,state,output,len) {return new fn.type_selector([sym[0],sym[1]])},
    R1441_css_TYPE_SELECTOR=function (sym,env,lex,state,output,len) {return new fn.type_selector([sym[0]])},
    R1470_css_WQ_NAME=function (sym,env,lex,state,output,len) {return [sym[0],sym[1]]},
    R1471_css_WQ_NAME=function (sym,env,lex,state,output,len) {return [sym[0]]},
    R1620_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]),sym[0])},
    R1621_css_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].push(...sym[1]),sym[0])},
    R1670_css_declaration_values=function (sym,env,lex,state,output,len) {return sym.join("")},
    I1730_js_javascript=function (sym,env,lex,state,output,len) {env.IS_MODULE = false;},
    R1740_js_start=function (sym,env,lex,state,output,len) {return (env.IS_MODULE) ? new fn.module(sym[0]) : new fn.script(sym[0])},
    I1790_js_module_item=function (sym,env,lex,state,output,len) {env.IS_MODULE = true;},
    R1800_js_import_declaration=function (sym,env,lex,state,output,len) {return new fn.import_declaration(sym[2],sym[1])},
    R1801_js_import_declaration=function (sym,env,lex,state,output,len) {return new fn.import_declaration(sym[1])},
    R1810_js_import_clause=function (sym,env,lex,state,output,len) {return [sym[0],sym[2]]},
    R1860_js_named_imports=function (sym,env,lex,state,output,len) {return new fn.named_imports(sym[1])},
    R1861_js_named_imports=function (sym,env,lex,state,output,len) {return new fn.named_imports(null)},
    R1880_js_import_specifier=function (sym,env,lex,state,output,len) {return new fn.import_specifier(sym[0])},
    R1881_js_import_specifier=function (sym,env,lex,state,output,len) {return new fn.import_specifier(sym[0],sym[1])},
    R1910_js_export_declaration=function (sym,env,lex,state,output,len) {return new fn.export_declaration(null,sym[2],false)},
    R1911_js_export_declaration=function (sym,env,lex,state,output,len) {return new fn.export_declaration(sym[1],sym[2],false)},
    R1912_js_export_declaration=function (sym,env,lex,state,output,len) {return new fn.export_declaration(sym[1],null,false)},
    R1913_js_export_declaration=function (sym,env,lex,state,output,len) {return new fn.export_declaration(sym[1],null,true)},
    R1940_js_export_clause=function (sym,env,lex,state,output,len) {return new fn.export_clause(sym[1])},
    R1941_js_export_clause=function (sym,env,lex,state,output,len) {return new fn.export_clause(null)},
    R1950_js_export_specifier=function (sym,env,lex,state,output,len) {return new fn.export_specifier(sym[0])},
    R1951_js_export_specifier=function (sym,env,lex,state,output,len) {return new fn.export_specifier(sym[0],sym[1])},
    R2140_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[4],sym[6],sym[8]))},
    I2141_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = false;},
    I2142_js_iteration_statement=function (sym,env,lex,state,output,len) {env.ASI = true;},
    R2143_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[3],sym[5],sym[7]))},
    R2144_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_in_statement(sym[2],sym[4],sym[6]))},
    R2145_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_of_statement(sym[1],sym[3],sym[5],sym[7]))},
    R2146_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[4],sym[5],sym[7]))},
    R2147_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[4],sym[6],sym[7]))},
    R2148_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],null,sym[4],sym[6]))},
    R2149_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[3],null,sym[6]))},
    R21410_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_of_statement(null,sym[2],sym[4],sym[6]))},
    R21411_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[3],sym[4],sym[6]))},
    R21412_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[3],sym[5],sym[6]))},
    R21413_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[4],sym[5],sym[6]))},
    R21414_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],null,null,sym[5]))},
    R21415_js_iteration_statement=function (sym,env,lex,state,output,len) {return (new fn.for_statement(sym[2],sym[3],sym[4],sym[5]))},
    R2170_js_continue_statement=function (sym,env,lex,state,output,len) {return (new fn.continue_statement(sym[1]))},
    R2171_js_continue_statement=function (sym,env,lex,state,output,len) {return (new fn.continue_statement(null))},
    R2180_js_break_statement=function (sym,env,lex,state,output,len) {return (new fn.break_statement(sym[1]))},
    R2181_js_break_statement=function (sym,env,lex,state,output,len) {return (new fn.break_statement(null))},
    R2190_js_return_statement=function (sym,env,lex,state,output,len) {return new fn.return_statement(sym[1])},
    R2191_js_return_statement=function (sym,env,lex,state,output,len) {return new fn.return_statement(null)},
    R2200_js_throw_statement=function (sym,env,lex,state,output,len) {return new fn.throw_statement(sym[1])},
    R2210_js_with_statement=function (sym,env,lex,state,output,len) {return new fn.with_statement(sym[2],sym[4])},
    R2220_js_switch_statement=function (sym,env,lex,state,output,len) {return new fn.switch_statement(sym[2],sym[4])},
    R2230_js_case_block=function (sym,env,lex,state,output,len) {return []},
    R2231_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2].concat(sym[3]))},
    R2232_js_case_block=function (sym,env,lex,state,output,len) {return sym[1].concat(sym[2])},
    R2240_js_case_clauses=function (sym,env,lex,state,output,len) {return sym[0].concat(sym[1])},
    R2250_js_case_clause=function (sym,env,lex,state,output,len) {return (new fn.case_statement(sym[1],sym[3]))},
    R2251_js_case_clause=function (sym,env,lex,state,output,len) {return (new fn.case_statement(sym[1],null))},
    R2260_js_default_clause=function (sym,env,lex,state,output,len) {return (new fn.default_case_statement(sym[2]))},
    R2261_js_default_clause=function (sym,env,lex,state,output,len) {return (new fn.default_case_statement(null))},
    R2300_js_try_statement=function (sym,env,lex,state,output,len) {return (new fn.try_statement(sym[1],sym[2]))},
    R2301_js_try_statement=function (sym,env,lex,state,output,len) {return (new fn.try_statement(sym[1],null,sym[2]))},
    R2302_js_try_statement=function (sym,env,lex,state,output,len) {return (new fn.try_statement(sym[1],sym[2],sym[3]))},
    R2360_js_variable_declaration_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[2]),sym[0])},
    R2390_js_let_or_const=function (sym,env,lex,state,output,len) {return "let"},
    R2391_js_let_or_const=function (sym,env,lex,state,output,len) {return "const"},
    R2430_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],sym[6])},
    R2431_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],sym[5])},
    R2432_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,sym[5])},
    R2433_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],sym[3],null)},
    R2434_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,sym[4])},
    R2435_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,sym[2],null)},
    R2436_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(sym[1],null,null)},
    R2437_js_function_declaration=function (sym,env,lex,state,output,len) {return new fn.function_declaration(null,null,null)},
    R2510_js_arrow_function=function (sym,env,lex,state,output,len) {return new fn.arrow_function_declaration(null,sym[0],sym[2])},
    R2600_js_class_tail=function (sym,env,lex,state,output,len) {return new fn.class_tail(sym)},
    R2601_js_class_tail=function (sym,env,lex,state,output,len) {return new fn.class_tail([null,...sym[0]])},
    R2602_js_class_tail=function (sym,env,lex,state,output,len) {return new fn.class_tail([sym[0],null,null])},
    R2603_js_class_tail=function (sym,env,lex,state,output,len) {return null},
    R2630_js_class_element_list=function (sym,env,lex,state,output,len) {return (sym[0].push(sym[1]))},
    R2640_js_class_element=function (sym,env,lex,state,output,len) {return ((sym[1].static = true,sym[1]))},
    R2710_js_new_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],null)},
    R2720_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.member_expression(sym[0],sym[2],true)},
    R2721_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.member_expression(sym[0],sym[2],false)},
    R2722_js_member_expression=function (sym,env,lex,state,output,len) {return new fn.new_expression(sym[1],sym[2])},
    R2780_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(sym[1])},
    R2781_js_arguments=function (sym,env,lex,state,output,len) {return new fn.argument_list(null)},
    R2820_js_primary_expression=function (sym,env,lex,state,output,len) {return new fn.js_wick_node(sym[0])},
    R2920_js_element_list=function (sym,env,lex,state,output,len) {return [sym[1]]},
    R2921_js_element_list=function (sym,env,lex,state,output,len) {return ((sym[0].push(sym[2]),sym[0]))},
    R3120_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new fn.parenthasized(sym[1])},
    R3121_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new fn.parenthasized(new fn.spread_element(sym.slice(1,3)))},
    R3122_js_cover_parenthesized_expression_and_arrow_parameter_list=function (sym,env,lex,state,output,len) {return new fn.parenthasized(Array.isArray(sym[0]) ? ((sym[1].push(new fn.spread_element(sym.slice(3,5))),sym[1])) : [sym[0],new fn.spread_element(sym.slice(3,5))])},
    R3440_html_BODY=function (sym,env,lex,state,output,len) {return (sym[1].import_list = sym[0],sym[1])},
    R3490_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[4],env,lex)},
    R3491_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector("script",["on",null,new env.wick_binding(["on",null,sym[1]])],sym[3],env,lex)},
    R3492_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],sym[2],sym[3],env,lex)},
    R3493_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[3],env,lex)},
    R3494_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,null,env,lex)},
    R3495_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector(sym[1],null,sym[2],env,lex)},
    R3496_html_TAG=function (sym,env,lex,state,output,len) {return fn.element_selector("script",["on",null,new env.wick_binding(["on",null,sym[1]])],env,lex)},

        //Sparse Map Lookup
        lsm = (index, map) => {    if (map[0] == 0xFFFFFFFF) return map[index + 1];    for (let i = 1, ind = 0, l = map.length, n = 0; i < l && ind <= index; i++) {        if (ind !== index) {            if ((n = map[i]) > -1) ind++;            else ind += -n;        } else return map[i];    }    return -1;},

        //State Action Functions
        state_funct = [()=>(398),
    ()=>(354),
    ()=>(86),
    ()=>(34),
    ()=>(402),
    ()=>(46),
    ()=>(254),
    ()=>(262),
    ()=>(442),
    ()=>(258),
    ()=>(358),
    ()=>(90),
    ()=>(522),
    ()=>(514),
    ()=>(530),
    ()=>(446),
    ()=>(438),
    ()=>(458),
    ()=>(462),
    ()=>(466),
    ()=>(422),
    ()=>(474),
    ()=>(478),
    ()=>(482),
    ()=>(490),
    ()=>(486),
    ()=>(470),
    ()=>(494),
    ()=>(498),
    ()=>(534),
    ()=>(294),
    ()=>(406),
    ()=>(310),
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
    ()=>(350),
    (...v)=>(redv(5,R00_S,1,0)),
    (...v)=>(redn(1031,1)),
    (...v)=>(redn(351239,1)),
    ()=>(546),
    (...v)=>(redn(352263,1)),
    (...v)=>(redv(2055,R21_IMPORT_TAG_list,1,0)),
    ()=>(594),
    ()=>(578),
    ()=>(582),
    ()=>(574),
    ()=>(554),
    ()=>(558),
    ()=>(562),
    ()=>(598),
    ()=>(602),
    ()=>(606),
    ()=>(610),
    ()=>(614),
    ()=>(618),
    ()=>(622),
    ()=>(626),
    ()=>(630),
    ()=>(634),
    ()=>(638),
    ()=>(642),
    ()=>(646),
    ()=>(650),
    ()=>(654),
    ()=>(658),
    ()=>(662),
    (...v)=>(redn(354311,1)),
    ()=>(670),
    ()=>(694),
    ()=>(702),
    ()=>(698),
    (...v)=>(redv(177159,R00_S,1,0),shftf(177159,I1730_js_javascript)),
    (...v)=>(redv(178183,R1740_js_start,1,0)),
    (...v)=>(redn(179207,1)),
    (...v)=>(rednv(182279,fn.statements,1,0)),
    ()=>(730),
    (...v)=>(redv(181255,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(180231,1)),
    (...v)=>(redn(183303,1),shftf(183303,I1790_js_module_item)),
    (...v)=>(redn(183303,1)),
    ()=>(766),
    ()=>(762),
    ()=>(794),
    ()=>(774),
    ()=>(790),
    (...v)=>(redn(205831,1)),
    (...v)=>(redn(206855,1)),
    (...v)=>(redn(210951,1)),
    ()=>(798),
    (...v)=>(rednv(275463,fn.expression_list,1,0)),
    ()=>(802),
    (...v)=>(redv(274439,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(273415,1)),
    (...v)=>(redn(302087,1)),
    (...v)=>(redn(317447,1)),
    ()=>(806),
    ()=>(858),
    ()=>(822),
    ()=>(826),
    ()=>(830),
    ()=>(834),
    ()=>(838),
    ()=>(842),
    ()=>(846),
    ()=>(850),
    ()=>(854),
    ()=>(862),
    ()=>(866),
    ()=>(814),
    ()=>(818),
    (...v)=>(redn(304135,1)),
    ()=>(874),
    ()=>(870),
    (...v)=>(redn(305159,1)),
    ()=>(878),
    (...v)=>(redn(306183,1)),
    ()=>(882),
    (...v)=>(redn(307207,1)),
    ()=>(886),
    (...v)=>(redn(308231,1)),
    ()=>(890),
    (...v)=>(redn(309255,1)),
    ()=>(902),
    ()=>(894),
    ()=>(898),
    ()=>(906),
    (...v)=>(redn(310279,1)),
    ()=>(910),
    ()=>(914),
    ()=>(918),
    ()=>(930),
    ()=>(922),
    ()=>(926),
    (...v)=>(redn(311303,1)),
    ()=>(934),
    ()=>(938),
    ()=>(942),
    (...v)=>(redn(312327,1)),
    ()=>(946),
    ()=>(950),
    (...v)=>(redn(313351,1)),
    ()=>(958),
    ()=>(962),
    ()=>(954),
    (...v)=>(redn(314375,1)),
    (...v)=>(redn(315399,1)),
    (...v)=>(redn(316423,1)),
    ()=>(966),
    ()=>(986),
    (...v)=>(redn(276487,1)),
    ()=>(1046),
    ()=>(1042),
    ()=>(1034),
    (...v)=>(redn(277511,1)),
    ()=>(1050),
    ()=>(1054),
    ()=>(1070),
    ()=>(1074),
    (...v)=>(redn(278535,1)),
    (...v)=>(rednv(288775,fn.this_literal,1,0)),
    (...v)=>(redn(288775,1)),
    (...v)=>(redn(258055,1)),
    (...v)=>(redn(342023,1)),
    (...v)=>(redn(340999,1)),
    (...v)=>(redn(343047,1)),
    (...v)=>(redn(344071,1)),
    (...v)=>(rednv(345095,fn.identifier,1,0)),
    (...v)=>(redv(350215,R00_S,1,0)),
    ()=>(1106),
    ()=>(1102),
    ()=>(1114),
    ()=>(1118),
    ()=>(1098),
    ()=>(1090),
    ()=>(1110),
    ()=>(1094),
    (...v)=>(redn(346119,1)),
    (...v)=>(redn(331783,1)),
    (...v)=>(rednv(339975,fn.bool_literal,1,0)),
    (...v)=>(rednv(338951,fn.null_literal,1,0)),
    ()=>(1146),
    ()=>(1138),
    ()=>(1134),
    ()=>(1154),
    ()=>(1158),
    ()=>(1150),
    ()=>(1142),
    ()=>(1126),
    ()=>(1186),
    ()=>(1178),
    ()=>(1174),
    ()=>(1194),
    ()=>(1198),
    ()=>(1190),
    ()=>(1182),
    ()=>(1166),
    (...v)=>(rednv(337927,fn.numeric_literal,1,0)),
    ()=>(1202),
    ()=>(1210),
    ()=>(1222),
    ()=>(1218),
    (...v)=>(redn(280583,1)),
    (...v)=>(redn(282631,1)),
    ()=>(1234),
    ()=>(1242),
    ()=>(1278),
    ()=>(1274),
    (...v)=>(rednv(212999,fn.empty_statement,1,0)),
    ()=>(1282),
    (...v)=>(redn(209927,1)),
    ()=>(1290),
    (...v)=>(shftf(1294,I2141_js_iteration_statement)),
    ()=>(1298),
    ()=>(1302),
    ()=>(1310),
    ()=>(1322),
    ()=>(1330),
    ()=>(1334),
    ()=>(1346),
    (...v)=>(redn(207879,1)),
    ()=>(1362),
    ()=>(1366),
    (...v)=>(redn(208903,1)),
    ()=>(1374),
    (...v)=>(redv(244743,R2390_js_let_or_const,1,0)),
    (...v)=>(redv(244743,R2391_js_let_or_const,1,0)),
    (...v)=>(redv(352267,R3440_html_BODY,2,0)),
    (...v)=>(redv(2059,R20_IMPORT_TAG_list,2,0)),
    ()=>(1414),
    ()=>(1410),
    ()=>(1426),
    ()=>(1434),
    ()=>(1442),
    ()=>(1454),
    ()=>(1450),
    ()=>(1466),
    ()=>(1462),
    ()=>(1506),
    ()=>(1482),
    ()=>(1486),
    ()=>(1498),
    ()=>(1502),
    ()=>(1494),
    ()=>(1490),
    ()=>(1478),
    (...v)=>(redn(3079,1)),
    (...v)=>(redn(358407,1)),
    (...v)=>(redn(367623,1)),
    ()=>(1522),
    ()=>(1538),
    ()=>(1542),
    (...v)=>(redv(372743,R00_S,1,0)),
    ()=>(1534),
    ()=>(1526),
    ()=>(1530),
    (...v)=>(redn(368647,1)),
    (...v)=>(redv(354315,R100_wickup_WICKUP_PLUGIN,2,0)),
    ()=>(1546),
    ()=>(1550),
    ()=>(1554),
    ()=>(1558),
    (...v)=>(redv(288775,R2820_js_primary_expression,1,0)),
    (...v)=>(rednv(288775,fn.array_literal,1,0)),
    (...v)=>(rednv(288775,fn.object_literal,1,0)),
    ()=>(1590),
    ()=>(1566),
    ()=>(1570),
    ()=>(1614),
    ()=>(1618),
    ()=>(1606),
    ()=>(1638),
    ()=>(1654),
    ()=>(1650),
    (...v)=>(redn(247815,1)),
    (...v)=>(redn(264199,1)),
    (...v)=>(rednv(204807,fn.statements,1,0)),
    (...v)=>(redv(203783,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(202759,1)),
    (...v)=>(redv(181259,R20_IMPORT_TAG_list,2,0)),
    ()=>(1666),
    ()=>(1670),
    ()=>(1674),
    (...v)=>(redn(185351,1)),
    (...v)=>(rednv(186375,fn.default_import,1,0)),
    (...v)=>(redn(194567,1)),
    ()=>(1678),
    ()=>(1686),
    ()=>(1690),
    (...v)=>(redn(193543,1)),
    ()=>(1718),
    (...v)=>(redv(195595,R1912_js_export_declaration,2,0)),
    ()=>(1738),
    ()=>(1742),
    (...v)=>(rednv(214027,fn.expression_statement,2,0)),
    (...v)=>(rednv(317451,fn.post_increment_expression,2,0)),
    (...v)=>(rednv(317451,fn.post_decrement_expression,2,0)),
    (...v)=>(redn(303111,1)),
    (...v)=>(rednv(316427,fn.delete_expression,2,0)),
    (...v)=>(rednv(316427,fn.void_expression,2,0)),
    (...v)=>(rednv(316427,fn.typeof_expression,2,0)),
    (...v)=>(rednv(316427,fn.plus_expression,2,0)),
    (...v)=>(rednv(316427,fn.negate_expression,2,0)),
    (...v)=>(rednv(316427,fn.unary_or_expression,2,0)),
    (...v)=>(rednv(316427,fn.unary_not_expression,2,0)),
    (...v)=>(rednv(317451,fn.pre_increment_expression,2,0)),
    (...v)=>(rednv(317451,fn.pre_decrement_expression,2,0)),
    (...v)=>(rednv(282635,fn.call_expression,2,0)),
    ()=>(1886),
    ()=>(1882),
    ()=>(1902),
    (...v)=>(rednv(263179,fn.call_expression,2,0)),
    (...v)=>(redv(277515,R2710_js_new_expression,2,0)),
    ()=>(1918),
    (...v)=>(redv(350219,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(350219,R00_S,2,0)),
    (...v)=>(redv(348167,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(347143,1)),
    (...v)=>(redn(349191,1)),
    ()=>(1930),
    (...v)=>(rednv(336907,fn.string_literal,2,0)),
    (...v)=>(redv(333831,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(332807,1)),
    ()=>(1938),
    (...v)=>(redv(335879,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(334855,1)),
    (...v)=>(redv(319499,R2603_js_class_tail,2,0)),
    ()=>(1946),
    ()=>(1950),
    (...v)=>(redn(283659,2)),
    (...v)=>(rednv(318475,fn.await_expression,2,0)),
    ()=>(1978),
    (...v)=>(rednv(232459,fn.label_statement,2,0)),
    ()=>(1998),
    ()=>(1994),
    (...v)=>(redv(241671,R1471_css_WQ_NAME,1,0)),
    ()=>(2006),
    (...v)=>(rednv(242695,fn.binding,1,0)),
    (...v)=>(redn(320519,1)),
    ()=>(2054),
    ()=>(2014),
    ()=>(2026),
    ()=>(2058),
    ()=>(2074),
    ()=>(2098),
    ()=>(2118),
    ()=>(2130),
    ()=>(2146),
    ()=>(2154),
    (...v)=>(redv(222219,R2171_js_continue_statement,2,0)),
    ()=>(2158),
    (...v)=>(redv(223243,R2181_js_break_statement,2,0)),
    ()=>(2162),
    (...v)=>(redv(224267,R2191_js_return_statement,2,0)),
    ()=>(2170),
    ()=>(2182),
    ()=>(2186),
    (...v)=>(rednv(239627,fn.debugger_statement,2,0)),
    (...v)=>(rednv(265227,fn.class_statement,2,0)),
    ()=>(2194),
    ()=>(2202),
    ()=>(2222),
    ()=>(2218),
    ()=>(2238),
    ()=>(2246),
    ()=>(2274),
    ()=>(2270),
    (...v)=>(redv(245767,R1471_css_WQ_NAME,1,0)),
    ()=>(2286),
    ()=>(2290),
    (...v)=>(redv(363527,R1471_css_WQ_NAME,1,0)),
    (...v)=>(rednv(364551,fn.attribute,1,0)),
    ()=>(2298),
    ()=>(2306),
    ()=>(2314),
    (...v)=>(redn(365575,1)),
    ()=>(2318),
    ()=>(2422),
    ()=>(2326),
    ()=>(2446),
    ()=>(2454),
    ()=>(2370),
    ()=>(2350),
    ()=>(2402),
    ()=>(2414),
    ()=>(2450),
    ()=>(2458),
    ()=>(2482),
    ()=>(2490),
    ()=>(2502),
    ()=>(2510),
    ()=>(2518),
    ()=>(2514),
    ()=>(2562),
    ()=>(2526),
    ()=>(2626),
    ()=>(2590),
    ()=>(2594),
    ()=>(2602),
    ()=>(2614),
    ()=>(2610),
    ()=>(2630),
    ()=>(2638),
    ()=>(2634),
    (...v)=>(redv(357391,R3494_html_TAG,3,0)),
    ()=>(2642),
    ()=>(2646),
    ()=>(2650),
    (...v)=>(redv(373767,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    ()=>(2658),
    (...v)=>(redn(375815,1)),
    (...v)=>(redv(372747,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(372747,R00_S,2,0)),
    (...v)=>(redv(370695,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(369671,1)),
    (...v)=>(redn(371719,1)),
    ()=>(2674),
    (...v)=>(rednv(211983,fn.block_statement,3,0)),
    ()=>(2678),
    ()=>(2682),
    ()=>(2686),
    (...v)=>(redv(290827,R2603_js_class_tail,2,0)),
    (...v)=>(redn(291847,1)),
    (...v)=>(redn(293895,1)),
    (...v)=>(redv(289799,R21_IMPORT_TAG_list,1,0)),
    ()=>(2706),
    ()=>(2702),
    (...v)=>(redn(292871,1)),
    ()=>(2722),
    ()=>(2726),
    ()=>(2730),
    ()=>(2742),
    (...v)=>(redv(297995,R2603_js_class_tail,2,0)),
    (...v)=>(redv(299015,R1471_css_WQ_NAME,1,0)),
    (...v)=>(redn(300039,1)),
    (...v)=>(redv(203787,R20_IMPORT_TAG_list,2,0)),
    ()=>(2750),
    (...v)=>(redv(184335,R1801_js_import_declaration,3,0)),
    ()=>(2770),
    ()=>(2774),
    ()=>(2778),
    (...v)=>(redv(190475,R1861_js_named_imports,2,0)),
    (...v)=>(redv(189447,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(188423,1)),
    (...v)=>(redv(192519,R1880_js_import_specifier,1,0)),
    ()=>(2782),
    ()=>(2786),
    ()=>(2790),
    (...v)=>(redv(195599,R1912_js_export_declaration,3,0)),
    (...v)=>(redv(195599,R1913_js_export_declaration,3,0)),
    ()=>(2794),
    ()=>(2798),
    ()=>(2802),
    (...v)=>(redv(198667,R1941_js_export_clause,2,0)),
    (...v)=>(redv(197639,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(196615,1)),
    (...v)=>(redv(199687,R1950_js_export_specifier,1,0)),
    ()=>(2806),
    (...v)=>(redv(274447,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(rednv(302095,fn.assignment_expression,3,0)),
    ()=>(2810),
    (...v)=>(rednv(305167,fn.or_expression,3,0)),
    (...v)=>(rednv(306191,fn.and_expression,3,0)),
    (...v)=>(rednv(307215,fn.bit_or_expression,3,0)),
    (...v)=>(rednv(308239,fn.bit_xor_expression,3,0)),
    (...v)=>(rednv(309263,fn.bit_and_expression,3,0)),
    (...v)=>(rednv(310287,fn.equality_expression,3,0)),
    (...v)=>(rednv(311311,fn.equality_expression,3,0)),
    (...v)=>(rednv(311311,fn.instanceof_expression,3,0)),
    (...v)=>(rednv(311311,fn.in_expression,3,0)),
    (...v)=>(rednv(312335,fn.left_shift_expression,3,0)),
    (...v)=>(rednv(312335,fn.right_shift_expression,3,0)),
    (...v)=>(rednv(312335,fn.right_shift_fill_expression,3,0)),
    (...v)=>(rednv(313359,fn.add_expression,3,0)),
    (...v)=>(rednv(313359,fn.subtract_expression,3,0)),
    (...v)=>(rednv(314383,fn.multiply_expression,3,0)),
    (...v)=>(rednv(314383,fn.divide_expression,3,0)),
    (...v)=>(rednv(314383,fn.modulo_expression,3,0)),
    (...v)=>(rednv(315407,fn.exponent_expression,3,0)),
    (...v)=>(redv(282639,R2721_js_member_expression,3,0)),
    ()=>(2814),
    ()=>(2822),
    ()=>(2818),
    ()=>(2826),
    (...v)=>(redv(284683,R2781_js_arguments,2,0)),
    (...v)=>(redn(287751,1)),
    ()=>(2830),
    (...v)=>(redv(286727,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(285703,1)),
    ()=>(2838),
    (...v)=>(redv(278543,R2721_js_member_expression,3,0)),
    (...v)=>(redv(278543,R2722_js_member_expression,3,0)),
    (...v)=>(rednv(281615,fn.new_target_expression,3,0)),
    (...v)=>(redv(350223,R400_wickup_CODE_BLOCK4301_group_list,3,0)),
    (...v)=>(redv(348171,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(rednv(336911,fn.string_literal,3,0)),
    (...v)=>(redv(333835,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(335883,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(319503,R3120_js_cover_parenthesized_expression_and_arrow_parameter_list,3,0)),
    ()=>(2842),
    ()=>(2846),
    ()=>(2850),
    ()=>(2854),
    (...v)=>(rednv(279567,fn.supper_expression,3,0)),
    ()=>(2858),
    (...v)=>(redv(257039,R2510_js_arrow_function,3,0)),
    (...v)=>(redn(259079,1)),
    (...v)=>(redv(233483,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redn(234503,1)),
    (...v)=>(rednv(240655,fn.variable_statement,3,0)),
    (...v)=>(rednv(242699,fn.binding,2,0)),
    (...v)=>(redn(321547,2)),
    ()=>(2878),
    ()=>(2886),
    ()=>(2882),
    (...v)=>(redn(324615,1)),
    (...v)=>(redn(327687,1)),
    ()=>(2894),
    (...v)=>(redn(329735,1)),
    (...v)=>(redn(322571,2)),
    ()=>(2910),
    ()=>(2918),
    ()=>(2922),
    ()=>(2926),
    (...v)=>(redn(325639,1)),
    (...v)=>(redn(326663,1)),
    (...v)=>(redn(328711,1)),
    ()=>(2942),
    ()=>(2946),
    ()=>(2950),
    ()=>(2954),
    ()=>(2962),
    ()=>(2966),
    ()=>(2974),
    ()=>(2978),
    (...v)=>(redn(216071,1)),
    (...v)=>(redn(218119,1)),
    (...v)=>(redn(217095,1)),
    ()=>(3018),
    ()=>(3030),
    (...v)=>(redv(222223,R2170_js_continue_statement,3,0)),
    (...v)=>(redv(223247,R2180_js_break_statement,3,0)),
    (...v)=>(redv(224271,R2190_js_return_statement,3,0)),
    ()=>(3034),
    (...v)=>(redv(225295,R2200_js_throw_statement,3,0)),
    (...v)=>(redv(235535,R2300_js_try_statement,3,0)),
    (...v)=>(redv(235535,R2301_js_try_statement,3,0)),
    ()=>(3042),
    (...v)=>(rednv(265231,fn.class_statement,3,0)),
    ()=>(3054),
    ()=>(3058),
    (...v)=>(redv(266251,R2603_js_class_tail,2,0)),
    (...v)=>(redn(268295,1)),
    (...v)=>(redv(269319,R1471_css_WQ_NAME,1,0)),
    (...v)=>(redn(270343,1)),
    (...v)=>(redv(267275,R100_wickup_WICKUP_PLUGIN,2,0)),
    ()=>(3074),
    ()=>(3078),
    ()=>(3082),
    (...v)=>(redn(250887,1)),
    ()=>(3086),
    (...v)=>(redn(252935,1)),
    (...v)=>(redv(251911,R1471_css_WQ_NAME,1,0)),
    (...v)=>(redn(253959,1)),
    (...v)=>(rednv(243727,fn.lexical,3,0)),
    (...v)=>(rednv(246795,fn.binding,2,0)),
    ()=>(3094),
    ()=>(3102),
    (...v)=>(redv(6163,R60_IMPORT_TAG,4,0)),
    (...v)=>(redv(363531,R1620_css_declaration_list,2,0)),
    ()=>(3114),
    ()=>(3126),
    ()=>(3130),
    (...v)=>(redv(365579,R100_wickup_WICKUP_PLUGIN,2,0)),
    ()=>(3134),
    ()=>(3142),
    ()=>(3146),
    ()=>(3150),
    (...v)=>(rednv(59399,fn.stylesheet,1,0)),
    (...v)=>(redv(64519,R632_css_STYLE_SHEET,1,0)),
    (...v)=>(redv(64519,R631_css_STYLE_SHEET,1,0)),
    (...v)=>(redv(61447,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(60423,1)),
    ()=>(3170),
    ()=>(3174),
    ()=>(3186),
    ()=>(3182),
    ()=>(3178),
    (...v)=>(redv(63495,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(62471,1)),
    ()=>(3194),
    ()=>(3190),
    (...v)=>(redv(65543,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(rednv(140295,fn.selector,1,0)),
    ()=>(3238),
    ()=>(3242),
    ()=>(3246),
    ()=>(3250),
    (...v)=>(rednv(145415,fn.compoundSelector,1,0)),
    ()=>(3274),
    (...v)=>(rednv(147463,fn.typeselector,1,0)),
    ()=>(3278),
    (...v)=>(redv(147463,R1441_css_TYPE_SELECTOR,1,0)),
    (...v)=>(redn(148487,1)),
    (...v)=>(redv(150535,R1471_css_WQ_NAME,1,0)),
    ()=>(3286),
    (...v)=>(redn(149511,1)),
    ()=>(3302),
    ()=>(3314),
    ()=>(3318),
    (...v)=>(redv(176135,R00_S,1,0)),
    ()=>(3306),
    ()=>(3310),
    (...v)=>(redn(172039,1)),
    (...v)=>(redv(141319,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(151559,1)),
    ()=>(3338),
    ()=>(3350),
    (...v)=>(redv(144391,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(143367,1)),
    ()=>(3362),
    ()=>(3366),
    ()=>(3370),
    ()=>(3378),
    ()=>(3382),
    ()=>(3386),
    (...v)=>(rednv(200711,fn.script,1,0)),
    (...v)=>(redn(201735,1)),
    ()=>(3394),
    ()=>(3398),
    ()=>(3402),
    ()=>(3410),
    ()=>(3414),
    ()=>(3418),
    (...v)=>(redn(361479,1)),
    (...v)=>(redv(360455,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(359431,1)),
    (...v)=>(redn(362503,1)),
    ()=>(3506),
    (...v)=>(rednv(10247,fn.text,1,0)),
    ()=>(3514),
    ()=>(3518),
    ()=>(3466),
    ()=>(3478),
    ()=>(3482),
    ()=>(3498),
    ()=>(3502),
    (...v)=>(redv(12295,R00_S,1,0)),
    ()=>(3526),
    (...v)=>(redn(374791,1)),
    (...v)=>(rednv(374791,fn.text,1,0)),
    (...v)=>(redn(38919,1)),
    ()=>(3542),
    (...v)=>(redn(48135,1)),
    (...v)=>(redn(50183,1)),
    ()=>(3570),
    ()=>(3566),
    ()=>(3562),
    ()=>(3554),
    ()=>(3558),
    ()=>(3610),
    ()=>(3586),
    ()=>(3614),
    ()=>(3594),
    ()=>(3598),
    ()=>(3602),
    ()=>(3606),
    ()=>(3590),
    ()=>(3618),
    (...v)=>(redn(7175,1)),
    (...v)=>(shftf(3622,I80_BASIC_BINDING)),
    (...v)=>(redv(357395,R3494_html_TAG,4,0)),
    (...v)=>(redv(357395,R60_IMPORT_TAG,4,0)),
    ()=>(3626),
    ()=>(3630),
    (...v)=>(redv(356371,R2603_js_class_tail,4,0)),
    (...v)=>(redv(373771,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(375819,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redv(372751,R400_wickup_CODE_BLOCK4301_group_list,3,0)),
    (...v)=>(redv(370699,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(3638),
    ()=>(3642),
    ()=>(3646),
    (...v)=>(redv(290831,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(redv(290831,R2603_js_class_tail,3,0)),
    (...v)=>(rednv(295947,fn.binding,2,0)),
    ()=>(3658),
    (...v)=>(rednv(291851,fn.spread_element,2,0)),
    ()=>(3674),
    ()=>(3678),
    ()=>(3682),
    (...v)=>(redv(297999,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(redv(297999,R2603_js_class_tail,3,0)),
    (...v)=>(redv(299019,R2920_js_element_list,2,0)),
    (...v)=>(redn(300043,2)),
    (...v)=>(rednv(301067,fn.spread_element,2,0)),
    (...v)=>(redv(184339,R1800_js_import_declaration,4,0)),
    (...v)=>(redv(191499,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redv(185359,R1810_js_import_clause,3,0)),
    (...v)=>(rednv(187407,fn.name_space_import,3,0)),
    ()=>(3698),
    (...v)=>(redv(190479,R1860_js_named_imports,3,0)),
    (...v)=>(redv(190479,R1861_js_named_imports,3,0)),
    (...v)=>(redv(195603,R1910_js_export_declaration,4,0)),
    (...v)=>(redv(195603,R1911_js_export_declaration,4,0)),
    ()=>(3710),
    (...v)=>(redv(198671,R1940_js_export_clause,3,0)),
    (...v)=>(redv(198671,R1941_js_export_clause,3,0)),
    (...v)=>(rednv(282643,fn.call_expression,4,0)),
    ()=>(3726),
    (...v)=>(redv(284687,R2780_js_arguments,3,0)),
    (...v)=>(redv(284687,R2781_js_arguments,3,0)),
    (...v)=>(rednv(285707,fn.spread_element,2,0)),
    (...v)=>(redv(278547,R2720_js_member_expression,4,0)),
    (...v)=>(redv(319507,R3120_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0)),
    (...v)=>(redv(319507,R3121_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0)),
    (...v)=>(rednv(279571,fn.supper_expression,4,0)),
    ()=>(3742),
    (...v)=>(redn(256007,1)),
    (...v)=>(redv(241679,R2360_js_variable_declaration_list,3,0)),
    (...v)=>(redv(296971,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redn(321551,3)),
    ()=>(3750),
    (...v)=>(redn(323595,2)),
    (...v)=>(redn(329739,2)),
    ()=>(3762),
    (...v)=>(redn(322575,3)),
    (...v)=>(redn(326667,2)),
    ()=>(3766),
    (...v)=>(redn(330763,2)),
    (...v)=>(redn(328715,2)),
    ()=>(3798),
    ()=>(3802),
    ()=>(3810),
    ()=>(3818),
    (...v)=>(shftf(3826,I2142_js_iteration_statement)),
    (...v)=>(rednv(216075,fn.variable_statement,2,0)),
    (...v)=>(redv(217099,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redv(218123,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redn(221191,1)),
    (...v)=>(redn(220171,2)),
    ()=>(3834),
    ()=>(3854),
    (...v)=>(redv(235539,R2302_js_try_statement,4,0)),
    (...v)=>(rednv(237579,fn.finally_statement,2,0)),
    ()=>(3874),
    (...v)=>(redv(266255,R2602_js_class_tail,3,0)),
    (...v)=>(redv(266255,R2601_js_class_tail,3,0)),
    (...v)=>(redv(269323,R2630_js_class_element_list,2,0)),
    (...v)=>(redv(270347,R2640_js_class_element,2,0)),
    ()=>(3878),
    ()=>(3882),
    ()=>(3886),
    ()=>(3894),
    (...v)=>(redv(250891,R1471_css_WQ_NAME,2,0)),
    (...v)=>(redv(245775,R2360_js_variable_declaration_list,3,0)),
    (...v)=>(redv(6167,R60_IMPORT_TAG,5,0)),
    ()=>(3918),
    ()=>(3922),
    (...v)=>(rednv(364559,fn.attribute,3,0)),
    (...v)=>(redn(366599,1)),
    ()=>(3946),
    ()=>(3950),
    ()=>(3970),
    ()=>(3966),
    ()=>(3962),
    ()=>(3958),
    ()=>(3954),
    (...v)=>(redv(365583,R100_wickup_WICKUP_PLUGIN,3,0)),
    ()=>(3978),
    ()=>(3982),
    ()=>(3986),
    ()=>(3990),
    (...v)=>(redv(64523,R630_css_STYLE_SHEET,2,0)),
    (...v)=>(redv(61451,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(63499,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redn(69643,2)),
    ()=>(4002),
    ()=>(4022),
    ()=>(4014),
    ()=>(4018),
    ()=>(4070),
    ()=>(4066),
    ()=>(4086),
    ()=>(4094),
    ()=>(4134),
    ()=>(4114),
    ()=>(4106),
    ()=>(4154),
    ()=>(4150),
    (...v)=>(redv(165895,R00_S,1,0)),
    ()=>(4174),
    (...v)=>(redv(162823,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(161799,1)),
    ()=>(4178),
    (...v)=>(rednv(140299,fn.selector,2,0)),
    (...v)=>(redv(139271,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(rednv(138247,fn.comboSelector,1,0)),
    (...v)=>(redn(146439,1)),
    (...v)=>(rednv(145419,fn.compoundSelector,2,0)),
    (...v)=>(redv(141323,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(144395,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(147467,R1440_css_TYPE_SELECTOR,2,0)),
    (...v)=>(redv(150539,R1470_css_WQ_NAME,2,0)),
    (...v)=>(redn(149515,2)),
    (...v)=>(redv(176139,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(176139,R00_S,2,0)),
    (...v)=>(redv(174087,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(173063,1)),
    (...v)=>(redn(175111,1)),
    (...v)=>(rednv(152587,fn.idSelector,2,0)),
    (...v)=>(rednv(153611,fn.classSelector,2,0)),
    ()=>(4226),
    ()=>(4202),
    ()=>(4210),
    ()=>(4214),
    ()=>(4218),
    ()=>(4222),
    (...v)=>(rednv(159755,fn.pseudoClassSelector,2,0)),
    ()=>(4234),
    (...v)=>(rednv(160779,fn.pseudoElementSelector,2,0)),
    (...v)=>(redn(143371,2)),
    (...v)=>(redv(142343,R21_IMPORT_TAG_list,1,0)),
    ()=>(4242),
    ()=>(4246),
    ()=>(4250),
    ()=>(4254),
    ()=>(4258),
    ()=>(4262),
    ()=>(4266),
    ()=>(4270),
    ()=>(4274),
    (...v)=>(redv(357399,R60_IMPORT_TAG,5,0)),
    ()=>(4286),
    (...v)=>(redv(360459,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(10251,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redn(13319,1)),
    ()=>(4294),
    (...v)=>(redv(21511,R21_IMPORT_TAG_list,1,0)),
    ()=>(4322),
    (...v)=>(redv(26631,R21_IMPORT_TAG_list,1,0)),
    ()=>(4342),
    ()=>(4346),
    ()=>(4350),
    ()=>(4366),
    (...v)=>(redv(33799,R21_IMPORT_TAG_list,1,0)),
    ()=>(4386),
    (...v)=>(redn(31751,1)),
    (...v)=>(redv(15367,R150_wickup_HORIZONTAL_RULE,1,0)),
    (...v)=>(redv(20487,R00_S,1,0)),
    ()=>(4410),
    ()=>(4414),
    ()=>(4430),
    ()=>(4426),
    (...v)=>(redv(12299,R120_wickup_PRE_MD_BLK,2,0)),
    ()=>(4434),
    (...v)=>(redv(11271,R21_IMPORT_TAG_list,1,0)),
    ()=>(4438),
    ()=>(4442),
    (...v)=>(redv(51207,R21_IMPORT_TAG_list,1,0)),
    ()=>(4450),
    ()=>(4454),
    ()=>(4466),
    ()=>(4458),
    ()=>(4462),
    ()=>(4470),
    (...v)=>(shftf(4474,I80_BASIC_BINDING)),
    ()=>(4478),
    (...v)=>(redn(57351,1)),
    (...v)=>(redv(56327,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(58375,1)),
    ()=>(4494),
    ()=>(4498),
    (...v)=>(redv(357399,R3496_html_TAG,5,0)),
    (...v)=>(redv(290835,R100_wickup_WICKUP_PLUGIN,4,0)),
    (...v)=>(redv(289807,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redv(294927,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(rednv(291855,fn.property_binding,3,0)),
    ()=>(4502),
    (...v)=>(redn(249863,1)),
    ()=>(4506),
    (...v)=>(redv(298003,R100_wickup_WICKUP_PLUGIN,4,0)),
    (...v)=>(redv(299023,R2921_js_element_list,3,0)),
    (...v)=>(redv(190483,R1860_js_named_imports,4,0)),
    (...v)=>(redv(189455,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redv(192527,R1881_js_import_specifier,3,0)),
    (...v)=>(redv(198675,R1940_js_export_clause,4,0)),
    (...v)=>(redv(197647,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redv(199695,R1951_js_export_specifier,3,0)),
    (...v)=>(rednv(304151,fn.condition_expression,5,0)),
    (...v)=>(redv(284691,R2780_js_arguments,4,0)),
    (...v)=>(redv(286735,R640_css_COMPLEX_SELECTOR_list,3,0)),
    ()=>(4522),
    ()=>(4526),
    (...v)=>(redv(259087,R100_wickup_WICKUP_PLUGIN,3,0)),
    ()=>(4530),
    (...v)=>(redn(321555,4)),
    (...v)=>(redn(324623,3)),
    (...v)=>(redn(327695,3)),
    (...v)=>(redn(322579,4)),
    ()=>(4534),
    ()=>(4542),
    (...v)=>(redn(325647,3)),
    (...v)=>(rednv(215063,fn.if_statement,5,0)),
    ()=>(4546),
    ()=>(4550),
    (...v)=>(rednv(219159,fn.while_statement,5,0)),
    ()=>(4554),
    (...v)=>(shftf(4562,I2142_js_iteration_statement)),
    ()=>(4570),
    ()=>(4574),
    ()=>(4582),
    (...v)=>(shftf(4590,I2142_js_iteration_statement)),
    (...v)=>(shftf(4594,I2142_js_iteration_statement)),
    ()=>(4602),
    (...v)=>(redv(227351,R2220_js_switch_statement,5,0)),
    ()=>(4610),
    ()=>(4630),
    ()=>(4626),
    (...v)=>(redv(226327,R2210_js_with_statement,5,0)),
    ()=>(4634),
    (...v)=>(redn(238599,1)),
    (...v)=>(redv(266259,R2600_js_class_tail,4,0)),
    ()=>(4638),
    ()=>(4646),
    ()=>(4654),
    ()=>(4658),
    (...v)=>(redv(248855,R2437_js_function_declaration,5,0)),
    (...v)=>(redn(254983,1)),
    (...v)=>(redv(250895,R2360_js_variable_declaration_list,3,0)),
    (...v)=>(redv(251919,R2360_js_variable_declaration_list,3,0)),
    (...v)=>(redv(6171,R60_IMPORT_TAG,6,0)),
    ()=>(4662),
    (...v)=>(redn(4103,1)),
    ()=>(4666),
    ()=>(4670),
    (...v)=>(redn(379911,1)),
    (...v)=>(redv(378887,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(377863,1)),
    (...v)=>(redn(380935,1)),
    ()=>(4678),
    ()=>(4682),
    ()=>(4686),
    ()=>(4690),
    (...v)=>(redv(357403,R3494_html_TAG,6,0)),
    ()=>(4698),
    (...v)=>(redn(75791,3)),
    ()=>(4710),
    (...v)=>(redv(70663,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(71687,1)),
    ()=>(4722),
    ()=>(4734),
    ()=>(4738),
    ()=>(4746),
    ()=>(4742),
    (...v)=>(redv(93191,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(97287,1)),
    ()=>(4762),
    (...v)=>(redn(99335,1)),
    (...v)=>(redn(98311,1)),
    ()=>(4778),
    ()=>(4786),
    ()=>(4830),
    ()=>(4806),
    (...v)=>(redn(107527,1)),
    (...v)=>(redn(126983,1)),
    ()=>(4842),
    (...v)=>(redn(95239,1)),
    ()=>(4846),
    (...v)=>(redn(78855,1)),
    ()=>(4850),
    (...v)=>(redn(88071,1)),
    ()=>(4870),
    ()=>(4878),
    (...v)=>(redn(89095,1)),
    (...v)=>(redn(90119,1)),
    ()=>(4894),
    ()=>(4902),
    ()=>(4898),
    (...v)=>(redv(65551,R640_css_COMPLEX_SELECTOR_list,3,0)),
    ()=>(4906),
    (...v)=>(redv(66575,R651_css_STYLE_RULE,3,0)),
    (...v)=>(redv(165899,R1620_css_declaration_list,2,0)),
    (...v)=>(redv(165899,R1621_css_declaration_list,2,0)),
    ()=>(4910),
    (...v)=>(redv(164871,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(163847,1)),
    (...v)=>(redv(165899,R00_S,2,0)),
    ()=>(4942),
    ()=>(4934),
    ()=>(4938),
    ()=>(4926),
    (...v)=>(redv(139275,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(rednv(138251,fn.comboSelector,2,0)),
    (...v)=>(rednv(145423,fn.compoundSelector,3,0)),
    (...v)=>(redv(176143,R400_wickup_CODE_BLOCK4301_group_list,3,0)),
    (...v)=>(redv(174091,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(rednv(155663,fn.attribSelector,3,0)),
    ()=>(4954),
    ()=>(4958),
    (...v)=>(redn(156679,1)),
    (...v)=>(rednv(159759,fn.pseudoClassSelector,3,0)),
    (...v)=>(redv(142347,R20_IMPORT_TAG_list,2,0)),
    ()=>(4966),
    ()=>(4970),
    ()=>(4974),
    ()=>(4978),
    ()=>(4982),
    ()=>(4986),
    ()=>(4994),
    ()=>(4998),
    (...v)=>(redv(24587,R240_wickup_HEADER,2,0)),
    (...v)=>(redv(21515,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(23559,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(22535,1)),
    ()=>(5010),
    (...v)=>(redv(30731,R301_wickup_BLOCK_QUOTES,2,0)),
    (...v)=>(redv(26635,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(29703,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(28679,1)),
    (...v)=>(redn(25611,2)),
    ()=>(5018),
    ()=>(5030),
    (...v)=>((redn(41987,0))),
    ()=>(5050),
    (...v)=>(redv(37899,R371_wickup_UNORDERED_LIST_ITEM,2,0)),
    (...v)=>(redv(33803,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(36871,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(35847,1)),
    (...v)=>(redn(32779,2)),
    (...v)=>(redv(15371,R100_wickup_WICKUP_PLUGIN,2,0)),
    (...v)=>(redn(14343,1)),
    (...v)=>(redv(20491,R00_S,2,0)),
    (...v)=>(redv(17415,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(16391,1)),
    (...v)=>(redv(19463,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(18439,1)),
    (...v)=>(redv(11275,R20_IMPORT_TAG_list,2,0)),
    ()=>(5066),
    (...v)=>(redv(48143,R470_wickup_ITALIC_BOLD_EMPHASIS,3,0)),
    (...v)=>(redv(51211,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(50191,R490_wickup_BOLD_EMPHASIS,3,0)),
    (...v)=>(redv(52239,R510_wickup_EMPHASIS,3,0)),
    ()=>(5070),
    ()=>(5074),
    ()=>(5090),
    ()=>(5086),
    ()=>(5082),
    ()=>(5078),
    ()=>(5094),
    ()=>(5098),
    ()=>(5114),
    ()=>(5110),
    ()=>(5106),
    ()=>(5102),
    (...v)=>(redv(53263,R520_wickup_CODE_QUOTE,3,0)),
    (...v)=>(redv(56331,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(5122),
    ()=>(5126),
    (...v)=>(redv(357403,R3495_html_TAG,6,0)),
    (...v)=>(redv(357403,R3491_html_TAG,6,0)),
    ()=>(5130),
    ()=>(5134),
    ()=>(5138),
    (...v)=>(redn(272391,1)),
    (...v)=>(redv(299027,R2921_js_element_list,4,0)),
    (...v)=>(redv(319515,R3122_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0)),
    (...v)=>(redn(321559,5)),
    (...v)=>(redn(322583,5)),
    ()=>(5142),
    ()=>(5150),
    (...v)=>(shftf(5158,I2142_js_iteration_statement)),
    (...v)=>(shftf(5162,I2142_js_iteration_statement)),
    ()=>(5170),
    (...v)=>(redv(219163,R21414_js_iteration_statement,6,0)),
    (...v)=>(shftf(5186,I2142_js_iteration_statement)),
    (...v)=>(redv(219163,R21415_js_iteration_statement,6,0)),
    ()=>(5202),
    (...v)=>(redv(228363,R2230_js_case_block,2,0)),
    ()=>(5210),
    ()=>(5222),
    (...v)=>(redv(229383,R1471_css_WQ_NAME,1,0)),
    ()=>(5230),
    ()=>(5242),
    ()=>(5246),
    (...v)=>(redv(248859,R2436_js_function_declaration,6,0)),
    ()=>(5250),
    (...v)=>(redv(248859,R2435_js_function_declaration,6,0)),
    (...v)=>(redv(248859,R2434_js_function_declaration,6,0)),
    (...v)=>(redn(5135,3)),
    (...v)=>(redv(366607,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(redv(376847,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(redv(378891,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(5254),
    (...v)=>(redv(357407,R60_IMPORT_TAG,7,0)),
    (...v)=>(redv(357407,R3493_html_TAG,7,0)),
    (...v)=>(redn(75795,4)),
    (...v)=>(redv(70667,R20_IMPORT_TAG_list,2,0)),
    ()=>(5270),
    ()=>(5274),
    (...v)=>(redv(134151,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(133127,1)),
    ()=>(5282),
    (...v)=>(redv(136199,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(135175,1)),
    (...v)=>((redn(68611,0))),
    (...v)=>(redn(97291,2)),
    (...v)=>(redn(103435,2)),
    (...v)=>(redn(106507,2)),
    (...v)=>(redv(102407,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redv(105479,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(100363,2)),
    ()=>(5338),
    ()=>(5342),
    ()=>(5362),
    ()=>(5358),
    (...v)=>(redn(125959,1)),
    ()=>(5350),
    (...v)=>(redn(108551,1)),
    ()=>(5374),
    ()=>(5386),
    ()=>(5378),
    ()=>(5382),
    ()=>(5366),
    ()=>(5402),
    ()=>(5414),
    ()=>(5406),
    ()=>(5410),
    (...v)=>(redn(123911,1)),
    ()=>(5422),
    ()=>(5426),
    ()=>(5430),
    ()=>(5434),
    ()=>(5454),
    ()=>(5450),
    ()=>(5442),
    ()=>(5486),
    ()=>(5474),
    ()=>(5478),
    (...v)=>(redn(88075,2)),
    (...v)=>(redv(84999,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redv(87047,R21_IMPORT_TAG_list,1,0)),
    ()=>(5510),
    ()=>(5514),
    ()=>(5522),
    (...v)=>(redv(66579,R650_css_STYLE_RULE,4,0)),
    (...v)=>(redv(66579,R651_css_STYLE_RULE,4,0)),
    (...v)=>(redv(165903,R1621_css_declaration_list,3,0)),
    (...v)=>(redv(162831,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redv(167951,fn.parseDeclaration,3,0)),
    ()=>(5538),
    (...v)=>(redn(171015,1)),
    (...v)=>(redv(169991,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(168967,1)),
    ()=>(5554),
    ()=>(5558),
    ()=>(5562),
    (...v)=>(redn(154631,1)),
    (...v)=>(redn(156683,2)),
    ()=>(5566),
    ()=>(5570),
    ()=>(5574),
    ()=>(5578),
    (...v)=>(redv(23563,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(30735,R300_wickup_BLOCK_QUOTES,3,0)),
    (...v)=>(redv(29707,R20_IMPORT_TAG_list,2,0)),
    ()=>(5586),
    (...v)=>(redv(43015,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redv(41991,R411_wickup_CODE_BLOCK4411_group,1,0)),
    (...v)=>(redv(40967,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(39943,1)),
    (...v)=>(redv(37903,R370_wickup_UNORDERED_LIST_ITEM,3,0)),
    (...v)=>(redv(36875,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(17419,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(19467,R20_IMPORT_TAG_list,2,0)),
    ()=>(5614),
    ()=>(5618),
    ()=>(5622),
    (...v)=>(redv(357407,R3492_html_TAG,7,0)),
    ()=>(5634),
    (...v)=>(redn(322587,6)),
    (...v)=>(rednv(215071,fn.if_statement,7,0)),
    (...v)=>(rednv(219167,fn.do_while_statement,7,0)),
    (...v)=>(shftf(5638,I2142_js_iteration_statement)),
    (...v)=>(redv(219167,R21413_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R2149_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R2148_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R2144_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R21412_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R21411_js_iteration_statement,7,0)),
    (...v)=>(redv(219167,R21410_js_iteration_statement,7,0)),
    ()=>(5666),
    (...v)=>(redv(228367,R100_wickup_WICKUP_PLUGIN,3,0)),
    (...v)=>(redv(229387,R2240_js_case_clauses,2,0)),
    ()=>(5670),
    ()=>(5674),
    (...v)=>(redv(231435,R2261_js_default_clause,2,0)),
    (...v)=>(rednv(236567,fn.catch_statement,5,0)),
    ()=>(5682),
    (...v)=>(redv(248863,R2433_js_function_declaration,7,0)),
    (...v)=>(redv(248863,R2432_js_function_declaration,7,0)),
    (...v)=>(redv(248863,R2431_js_function_declaration,7,0)),
    (...v)=>(redv(357411,R3490_html_TAG,8,0)),
    (...v)=>(redn(75799,5)),
    (...v)=>(redn(137231,3)),
    (...v)=>(redv(134155,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redv(136203,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(5706),
    ()=>(5710),
    (...v)=>(redn(68615,1)),
    (...v)=>(redv(67591,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redv(93199,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redn(97295,3)),
    (...v)=>(redn(96267,2)),
    (...v)=>(redv(102411,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(105483,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redn(101387,2)),
    (...v)=>(redn(104459,2)),
    (...v)=>(redn(107535,3)),
    (...v)=>(redn(109583,3)),
    ()=>(5718),
    (...v)=>(redn(114703,3)),
    (...v)=>(redv(113671,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(112647,1)),
    (...v)=>(redn(116743,1)),
    ()=>(5742),
    (...v)=>(redn(117767,1)),
    ()=>(5758),
    (...v)=>(redn(131083,2)),
    ()=>(5762),
    (...v)=>(redn(130055,1)),
    ()=>(5766),
    (...v)=>(redv(111623,R401_wickup_CODE_BLOCK4301_group_list,1,0)),
    (...v)=>(redn(110599,1)),
    ()=>(5774),
    (...v)=>(redv(76807,R21_IMPORT_TAG_list,1,0)),
    ()=>(5786),
    ()=>(5782),
    (...v)=>(redv(79879,R21_IMPORT_TAG_list,1,0)),
    (...v)=>(redn(81927,1)),
    ()=>(5790),
    ()=>(5794),
    (...v)=>(redv(85003,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(87051,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redn(83979,2)),
    (...v)=>(redn(86027,2)),
    (...v)=>(redn(89103,3)),
    (...v)=>(redn(91151,3)),
    ()=>(5798),
    (...v)=>(redv(66583,R650_css_STYLE_RULE,5,0)),
    (...v)=>(redv(164879,R640_css_COMPLEX_SELECTOR_list,3,0)),
    (...v)=>(redv(167955,fn.parseDeclaration,4,0)),
    (...v)=>(redv(171019,R1670_css_declaration_values,2,0)),
    ()=>(5802),
    (...v)=>(redv(169995,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(5806),
    ()=>(5810),
    (...v)=>(rednv(155671,fn.attribSelector,5,0)),
    (...v)=>(redn(157703,1)),
    (...v)=>(redn(158735,3)),
    ()=>(5814),
    (...v)=>(redv(44051,R431_wickup_CODE_BLOCK,4,0)),
    (...v)=>(redv(43019,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redv(41995,R410_wickup_CODE_BLOCK4411_group,2,0)),
    (...v)=>(redv(40971,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    ()=>(5818),
    (...v)=>(redn(45063,1)),
    ()=>(5826),
    (...v)=>(rednv(8215,fn.wick_binding,5,0)),
    ()=>(5830),
    ()=>(5834),
    (...v)=>(redv(219171,R2147_js_iteration_statement,8,0)),
    (...v)=>(redv(219171,R2146_js_iteration_statement,8,0)),
    (...v)=>(redv(219171,R2143_js_iteration_statement,8,0)),
    (...v)=>(redv(219171,R2145_js_iteration_statement,8,0)),
    ()=>(5846),
    (...v)=>(redv(228371,R2232_js_case_block,4,0)),
    (...v)=>(redv(230415,R2251_js_case_clause,3,0)),
    (...v)=>(redv(231439,R2260_js_default_clause,3,0)),
    (...v)=>(redv(248867,R2430_js_function_declaration,8,0)),
    (...v)=>(redn(75803,6)),
    ()=>(5854),
    (...v)=>(redn(72711,1)),
    (...v)=>(redn(132115,4)),
    (...v)=>(redn(94235,6)),
    (...v)=>(redv(67595,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redn(114707,4)),
    (...v)=>(redv(113675,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(redn(115727,3)),
    (...v)=>(redn(122895,3)),
    (...v)=>(redn(116747,2)),
    ()=>(5862),
    ()=>(5870),
    ()=>(5874),
    (...v)=>(redn(117771,2)),
    (...v)=>(redn(128015,3)),
    (...v)=>(redv(111627,R400_wickup_CODE_BLOCK4301_group_list,2,0)),
    (...v)=>(rednv(77851,C760_css_keyframes,6,0)),
    (...v)=>(redv(76811,R20_IMPORT_TAG_list,2,0)),
    (...v)=>(redn(129035,2)),
    (...v)=>(redn(82971,6)),
    (...v)=>(redn(92179,4)),
    (...v)=>(redn(166923,2)),
    (...v)=>(redv(171023,R1670_css_declaration_values,3,0)),
    (...v)=>(rednv(155675,fn.attribSelector,6,0)),
    (...v)=>(redv(44055,R430_wickup_CODE_BLOCK,5,0)),
    (...v)=>(redv(46107,R450_wickup_LINK,6,0)),
    ()=>(5886),
    ()=>(5890),
    (...v)=>(rednv(271391,fn.class_method,7,0)),
    (...v)=>(rednv(271391,fn.class_get_method,7,0)),
    ()=>(5894),
    (...v)=>(redv(219175,R2140_js_iteration_statement,9,0)),
    (...v)=>(redv(228375,R2231_js_case_block,5,0)),
    (...v)=>(redv(230419,R2250_js_case_clause,4,0)),
    (...v)=>(redn(73747,4)),
    (...v)=>(redn(119815,1)),
    ()=>(5902),
    (...v)=>(redn(121863,1)),
    ()=>(5914),
    ()=>(5910),
    (...v)=>(redv(79887,R640_css_COMPLEX_SELECTOR_list,3,0)),
    ()=>(5918),
    (...v)=>(rednv(9247,fn.wick_binding,7,0)),
    (...v)=>(rednv(271395,fn.class_set_method,8,0)),
    (...v)=>(redn(122903,5)),
    (...v)=>(redn(119819,2)),
    ()=>(5922),
    (...v)=>(rednv(80915,C790_css_keyframes_blocks,4,0)),
    (...v)=>(rednv(9251,fn.wick_binding,8,0)),
    (...v)=>(rednv(80919,C790_css_keyframes_blocks,5,0))],

        //Goto Lookup Functions
        goto = [v=>lsm(v,gt0),
    nf,
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
    nf,
    v=>lsm(v,gt5),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt6),
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
    nf,
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt9),
    v=>lsm(v,gt10),
    v=>lsm(v,gt11),
    v=>lsm(v,gt12),
    v=>lsm(v,gt13),
    v=>lsm(v,gt14),
    v=>lsm(v,gt15),
    nf,
    v=>lsm(v,gt16),
    v=>lsm(v,gt17),
    nf,
    v=>lsm(v,gt18),
    v=>lsm(v,gt19),
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
    nf,
    nf,
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
    v=>lsm(v,gt22),
    v=>lsm(v,gt23),
    nf,
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
    v=>lsm(v,gt38),
    v=>lsm(v,gt39),
    v=>lsm(v,gt40),
    v=>lsm(v,gt41),
    v=>lsm(v,gt42),
    v=>lsm(v,gt43),
    v=>lsm(v,gt44),
    v=>lsm(v,gt45),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt47),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt47),
    v=>lsm(v,gt48),
    v=>lsm(v,gt49),
    nf,
    nf,
    v=>lsm(v,gt50),
    nf,
    nf,
    nf,
    v=>lsm(v,gt51),
    v=>lsm(v,gt52),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt53),
    nf,
    v=>lsm(v,gt54),
    v=>lsm(v,gt55),
    nf,
    nf,
    v=>lsm(v,gt56),
    v=>lsm(v,gt57),
    nf,
    v=>lsm(v,gt58),
    v=>lsm(v,gt59),
    v=>lsm(v,gt60),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt77),
    v=>lsm(v,gt78),
    v=>lsm(v,gt79),
    v=>lsm(v,gt80),
    v=>lsm(v,gt81),
    v=>lsm(v,gt82),
    v=>lsm(v,gt83),
    v=>lsm(v,gt84),
    v=>lsm(v,gt85),
    nf,
    nf,
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
    nf,
    v=>lsm(v,gt87),
    nf,
    v=>lsm(v,gt88),
    v=>lsm(v,gt89),
    v=>lsm(v,gt90),
    v=>lsm(v,gt91),
    nf,
    nf,
    v=>lsm(v,gt92),
    nf,
    nf,
    v=>lsm(v,gt93),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt94),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt96),
    nf,
    v=>lsm(v,gt97),
    v=>lsm(v,gt98),
    nf,
    nf,
    v=>lsm(v,gt99),
    nf,
    v=>lsm(v,gt100),
    nf,
    nf,
    v=>lsm(v,gt101),
    v=>lsm(v,gt102),
    nf,
    nf,
    nf,
    v=>lsm(v,gt103),
    v=>lsm(v,gt104),
    v=>lsm(v,gt105),
    nf,
    v=>lsm(v,gt106),
    v=>lsm(v,gt107),
    nf,
    v=>lsm(v,gt108),
    nf,
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
    v=>lsm(v,gt111),
    nf,
    nf,
    v=>lsm(v,gt112),
    v=>lsm(v,gt113),
    nf,
    v=>lsm(v,gt114),
    nf,
    nf,
    v=>lsm(v,gt115),
    v=>lsm(v,gt116),
    nf,
    v=>lsm(v,gt117),
    nf,
    nf,
    v=>lsm(v,gt118),
    v=>lsm(v,gt119),
    nf,
    v=>lsm(v,gt117),
    v=>lsm(v,gt120),
    v=>lsm(v,gt117),
    v=>lsm(v,gt121),
    v=>lsm(v,gt117),
    v=>lsm(v,gt122),
    v=>lsm(v,gt117),
    v=>lsm(v,gt123),
    nf,
    v=>lsm(v,gt117),
    nf,
    nf,
    v=>lsm(v,gt124),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    v=>lsm(v,gt126),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt127),
    nf,
    nf,
    nf,
    v=>lsm(v,gt128),
    nf,
    nf,
    nf,
    v=>lsm(v,gt129),
    nf,
    v=>lsm(v,gt130),
    v=>lsm(v,gt131),
    nf,
    nf,
    v=>lsm(v,gt132),
    v=>lsm(v,gt133),
    nf,
    nf,
    nf,
    v=>lsm(v,gt134),
    nf,
    nf,
    nf,
    v=>lsm(v,gt135),
    nf,
    v=>lsm(v,gt136),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    v=>lsm(v,gt142),
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
    nf,
    v=>lsm(v,gt147),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt148),
    nf,
    v=>lsm(v,gt149),
    nf,
    nf,
    v=>lsm(v,gt150),
    v=>lsm(v,gt8),
    v=>lsm(v,gt151),
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
    v=>lsm(v,gt155),
    nf,
    nf,
    v=>lsm(v,gt156),
    nf,
    nf,
    v=>lsm(v,gt157),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt158),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt159),
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
    nf,
    nf,
    v=>lsm(v,gt163),
    v=>lsm(v,gt164),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt165),
    nf,
    v=>lsm(v,gt166),
    v=>lsm(v,gt167),
    v=>lsm(v,gt168),
    v=>lsm(v,gt169),
    nf,
    v=>lsm(v,gt170),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt171),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt172),
    v=>lsm(v,gt173),
    v=>lsm(v,gt174),
    v=>lsm(v,gt175),
    nf,
    v=>lsm(v,gt176),
    nf,
    nf,
    nf,
    v=>lsm(v,gt177),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt178),
    nf,
    nf,
    v=>lsm(v,gt179),
    nf,
    nf,
    v=>lsm(v,gt180),
    v=>lsm(v,gt181),
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
    v=>lsm(v,gt124),
    nf,
    nf,
    nf,
    v=>lsm(v,gt184),
    v=>lsm(v,gt185),
    nf,
    v=>lsm(v,gt186),
    nf,
    v=>lsm(v,gt187),
    v=>lsm(v,gt188),
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
    nf,
    v=>lsm(v,gt190),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt191),
    v=>lsm(v,gt192),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt193),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt194),
    nf,
    nf,
    v=>lsm(v,gt195),
    nf,
    nf,
    v=>lsm(v,gt196),
    nf,
    nf,
    v=>lsm(v,gt197),
    v=>lsm(v,gt198),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt199),
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
    nf,
    nf,
    nf,
    v=>lsm(v,gt201),
    nf,
    v=>lsm(v,gt202),
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
    nf,
    v=>lsm(v,gt204),
    v=>lsm(v,gt205),
    v=>lsm(v,gt206),
    v=>lsm(v,gt207),
    nf,
    v=>lsm(v,gt208),
    v=>lsm(v,gt209),
    nf,
    v=>lsm(v,gt210),
    v=>lsm(v,gt211),
    nf,
    nf,
    v=>lsm(v,gt101),
    v=>lsm(v,gt102),
    nf,
    v=>lsm(v,gt115),
    v=>lsm(v,gt116),
    nf,
    nf,
    v=>lsm(v,gt212),
    nf,
    v=>lsm(v,gt213),
    v=>lsm(v,gt214),
    v=>lsm(v,gt215),
    nf,
    v=>lsm(v,gt216),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt217),
    v=>lsm(v,gt218),
    nf,
    v=>lsm(v,gt219),
    nf,
    v=>lsm(v,gt220),
    nf,
    nf,
    v=>lsm(v,gt221),
    nf,
    nf,
    v=>lsm(v,gt222),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt164),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt223),
    v=>lsm(v,gt224),
    v=>lsm(v,gt225),
    v=>lsm(v,gt226),
    v=>lsm(v,gt227),
    v=>lsm(v,gt228),
    v=>lsm(v,gt229),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt230),
    nf,
    v=>lsm(v,gt231),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt232),
    v=>lsm(v,gt169),
    v=>lsm(v,gt169),
    nf,
    nf,
    v=>lsm(v,gt233),
    nf,
    nf,
    nf,
    v=>lsm(v,gt234),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt235),
    v=>lsm(v,gt170),
    nf,
    v=>lsm(v,gt236),
    nf,
    v=>lsm(v,gt237),
    v=>lsm(v,gt238),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt239),
    nf,
    v=>lsm(v,gt240),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt241),
    nf,
    v=>lsm(v,gt242),
    nf,
    nf,
    nf,
    v=>lsm(v,gt243),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt244),
    v=>lsm(v,gt245),
    v=>lsm(v,gt246),
    nf,
    nf,
    nf,
    v=>lsm(v,gt247),
    nf,
    v=>lsm(v,gt248),
    v=>lsm(v,gt247),
    v=>lsm(v,gt247),
    v=>lsm(v,gt249),
    v=>lsm(v,gt250),
    v=>lsm(v,gt24),
    nf,
    nf,
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
    nf,
    v=>lsm(v,gt252),
    v=>lsm(v,gt253),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt127),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt254),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    v=>lsm(v,gt257),
    v=>lsm(v,gt258),
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
    nf,
    nf,
    v=>lsm(v,gt263),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt264),
    v=>lsm(v,gt265),
    nf,
    nf,
    nf,
    nf,
    nf,
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
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt267),
    v=>lsm(v,gt268),
    nf,
    nf,
    nf,
    v=>lsm(v,gt269),
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
    v=>lsm(v,gt276),
    v=>lsm(v,gt277),
    v=>lsm(v,gt278),
    nf,
    nf,
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
    nf,
    v=>lsm(v,gt279),
    v=>lsm(v,gt280),
    nf,
    nf,
    v=>lsm(v,gt169),
    nf,
    nf,
    nf,
    v=>lsm(v,gt281),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt282),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt283),
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
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt287),
    v=>lsm(v,gt288),
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
    v=>lsm(v,gt290),
    nf,
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
    nf,
    v=>lsm(v,gt292),
    v=>lsm(v,gt293),
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
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt296),
    nf,
    v=>lsm(v,gt297),
    nf,
    v=>lsm(v,gt298),
    nf,
    v=>lsm(v,gt299),
    v=>lsm(v,gt300),
    nf,
    v=>lsm(v,gt301),
    nf,
    v=>lsm(v,gt302),
    v=>lsm(v,gt303),
    nf,
    v=>lsm(v,gt304),
    nf,
    nf,
    v=>lsm(v,gt305),
    v=>lsm(v,gt306),
    nf,
    v=>lsm(v,gt307),
    nf,
    v=>lsm(v,gt308),
    v=>lsm(v,gt309),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt310),
    nf,
    v=>lsm(v,gt311),
    nf,
    nf,
    v=>lsm(v,gt312),
    nf,
    nf,
    v=>lsm(v,gt313),
    nf,
    nf,
    v=>lsm(v,gt314),
    v=>lsm(v,gt315),
    v=>lsm(v,gt316),
    v=>lsm(v,gt317),
    nf,
    nf,
    v=>lsm(v,gt318),
    v=>lsm(v,gt319),
    v=>lsm(v,gt320),
    nf,
    v=>lsm(v,gt321),
    nf,
    v=>lsm(v,gt322),
    nf,
    nf,
    nf,
    v=>lsm(v,gt323),
    v=>lsm(v,gt274),
    nf,
    nf,
    nf,
    v=>lsm(v,gt324),
    v=>lsm(v,gt325),
    v=>lsm(v,gt326),
    nf,
    nf,
    v=>lsm(v,gt327),
    v=>lsm(v,gt328),
    v=>lsm(v,gt329),
    nf,
    v=>lsm(v,gt330),
    v=>lsm(v,gt331),
    nf,
    v=>lsm(v,gt332),
    nf,
    v=>lsm(v,gt333),
    nf,
    nf,
    v=>lsm(v,gt323),
    v=>lsm(v,gt334),
    nf,
    nf,
    nf,
    v=>lsm(v,gt335),
    nf,
    v=>lsm(v,gt336),
    v=>lsm(v,gt337),
    v=>lsm(v,gt338),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt339),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt286),
    nf,
    nf,
    v=>lsm(v,gt340),
    v=>lsm(v,gt341),
    nf,
    v=>lsm(v,gt342),
    v=>lsm(v,gt343),
    nf,
    nf,
    v=>lsm(v,gt289),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt344),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt345),
    v=>lsm(v,gt346),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt347),
    v=>lsm(v,gt348),
    nf,
    v=>lsm(v,gt349),
    nf,
    nf,
    nf,
    v=>lsm(v,gt350),
    nf,
    nf,
    nf,
    v=>lsm(v,gt351),
    v=>lsm(v,gt352),
    nf,
    nf,
    v=>lsm(v,gt353),
    nf,
    nf,
    v=>lsm(v,gt354),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt355),
    nf,
    nf,
    v=>lsm(v,gt356),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt357),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt358),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt359),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt360),
    v=>lsm(v,gt361),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt362),
    v=>lsm(v,gt363),
    v=>lsm(v,gt364),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt365),
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt366),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt367),
    nf,
    nf,
    v=>lsm(v,gt367),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt341),
    nf,
    nf,
    v=>lsm(v,gt343),
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt368),
    nf,
    nf,
    nf,
    v=>lsm(v,gt369),
    v=>lsm(v,gt370),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt371),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt372),
    v=>lsm(v,gt373),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt374),
    v=>lsm(v,gt375),
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    nf,
    v=>lsm(v,gt376),
    nf,
    v=>lsm(v,gt377),
    nf,
    nf,
    v=>lsm(v,gt229),
    nf,
    nf,
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
        if (l.END) return 0; /*$eof*/

        switch (l.ty) {
            case 2:
                //*
                if (SYM_LU.has(l.tx)) return  14;
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

            if(this.value !== undefined)
                io.down(this.value);
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
            
            //this.presets = presets;
            //this.statics = null;
            this.parent = null;
            this.model = null;
            this.update_tap = null;

            //this.children = [];
            //this.badges = {};
            //this.hooks = [];

            this.ios = [];
            this.taps = {};
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

        destroy() {

            this.update({destroying:true}); //Lifecycle Events: Destroying <======================================================================

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

            for(const tap in this.taps)
                this.taps[tap].destroy();

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

        linkImportTaps(parent_scope){
            for(const tap in this.taps){
                this.taps[tap].linkImport(parent_scope);
            }
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
                SchemedConstructor = null,
                presets = this.ast.presets,
                model_name = this.ast.model_name,
                scheme_name = this.ast.scheme_name;
                
            if (model_name && this.presets.models)
                m = presets.models[model_name];
            if (scheme_name && presets.schemas){
                SchemedConstructor = presets.schemas[scheme_name];
            }

            if (m)
                model = m;
            else if (SchemedConstructor) {
                model = new SchemedConstructor();
            } else if (!model)
                model = new Model(model);

            if(this.css.length>0)
                this.loadCSS();

            for (let i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].load(model);
                this.scopes[i].getBadges(this);
            }

            if (model.addObserver)
                model.addObserver(this);

            this.model = model;

            for (const tap in this.taps)
                this.taps[tap].load(this.model, false);
            
            this.update({loading:true});  //Lifecycle Events: Loading <======================================================================
            //this.update({loaded:true});  //Lifecycle Events: Loaded <======================================================================
            //this.LOADED = true

            //Allow one tick to happen before acknowledging load
            setTimeout(this.loadAcknowledged.bind(this),1);
        }

        loadCSS(element = this.ele){
            
            for(let i = 0; i < this.css.length; i++){
                const css = this.css[i];

                const rules = css.getApplicableRules(element);

                element.style = (""+rules).slice(1,-1) + "";
            }

            for(let i = 0; i < element.children.length; i++)
                this.loadCSS(element.children[i]);
        }

        loadAcknowledged(){
            //This is called when all elements of responded with a loaded signal.

            if(!this.LOADED && --this.PENDING_LOADS <= 0){
                this.LOADED = true;
                this.update({loaded:true});  //Lifecycle Events: Loaded <======================================================================
                if(this.parent)
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
            if (this.taps[prop_name])
                this.taps[prop_name].up(data, meta);
        }

        update(data, changed_values, IMPORTED = false, meta = null) {

            if (this.update_tap)
                this.update_tap.downS(data, IMPORTED);

            if (changed_values) {
                for (let name in changed_values)
                    if (this.taps[name])
                        this.taps[name].downS(data, IMPORTED, meta);
            } else{
                let map = new Map;

                for (let name in this.taps){
                    map.set(name, this.taps[name]);
                }

                for(let name in data){
                    if(map.has(name))
                        map.get(name).downS(data, IMPORTED, meta);
                    //this.taps[name]
                }
            }

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
            //Prevent erroneous removal of scope.
            if (this.CONNECTED == true) return;
            
            //Lifecycle Events: Disconnecting <======================================================================
            this.update({disconnecting:true});
            
            if (this.ele && this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);

            //Lifecycle Events: Disconnected <======================================================================
            this.update({disconnectied:true});
        }

        transitionIn(transition, transition_name = "trs_in") {
            
            if (transition) 
                this.update({trs:transition, [transition_name]:transition}, null, false, {IMMEDIATE:true});

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

                this.update({trs:transition, [transition_name]:transition}, null, false, {IMMEDIATE:true});

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

    const err = console.error.bind(console);

    var defaults = {
        IO_FUNCTION_FAIL : (e, o) => {
            err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`);
            err(e);
        },
        ELEMENT_PARSE_FAILURE : (e, o) => {
            err(`Problem found while parsing resource ${o.url + ""}`);
            err(e);
        },
        COMPONENT_PARSE_FAILURE : (e, o) => {
            err(`Problem found while parsing component defined in ${o.url + ""}`);
            err(e);
        },
        RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
            err(`Error while trying to fetch ${o.url + ""}`);
            err(e);
        },
        SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
            err(`Error while trying to create function from script 

${o.val + ""} 

in file ${o.url || o.origin_url}`);
            err(e);
        },
        default: e => {
            err(`Unable to retrieve error handler`);
            throw e;
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
    	console.error(`Encountered error ${error_function.error_name}`);
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
            this.down(v);
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

        down(value) {
            if(value instanceof HTMLElement){
                if(value !== this.ele){
                    this.ele.parentElement.replaceNode(value, this.ele);
                    console.log(this.ele+"", value+"");
                    this.ele = value;
                }
            }else
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
            super.destroy();
        }

        down(value) {
            this.ele.value = value;
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
                    node.type == js.types.identifier ||
                    node.type == js.types.member_expression
                ) {
                    if (node.type == js.types.member_expression && !(
                            node.id.type == js.types.identifier ||
                            node.id.type == js.types.member_expression
                        )) ; else
                    if (node.root && !non_global.has(node.name)) {
                        globals.add(node);
                    }
                }

                if (ast !== node && node.type == js.types.arrow_function_declaration) {

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
                    node.type == js.types.lexical_declaration ||
                    node.type == js.types.variable_declaration
                ) {
                    node.bindings.forEach(b => (non_global.add(b.id.name), globals.forEach(g => { if (g.name == b.id.name) globals.delete(b.id.name); })));
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
            }, []);
        },

        getRootVariables(ast) {
            const tvrs = ast.traverseDepthFirst();
            let node = null;
            var vars = [];
            while ((node = tvrs.next().value)) {
                if (node.type == js.types.function_declaration || node.type == js.types.arrow_function_declaration) {
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
                if (node.type == js.types.function_declaration || node.type == js.types.arrow_function_declaration) {
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

                if (result instanceof js.identifier) {
                    ids.add(result.val);
                } else
                    result.getRootIds(ids, closure);

                return { ids, ast: result, SUCCESS: true };
            } catch (e) {
                return { ids, ast: null, SUCCESS: false };
            }
        },

        types: js.types
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
    const types = {
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

            if (!(this.value = types[u_value]))
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
        CSS_Length$1 = types.length,
        CSS_Percentage$1 = types.percentage,
        CSS_Color$1 = types.color,
        CSS_Transform2D$1 = types.transform2D,
        CSS_Bezier$1 = types.cubic_bezier,

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
                }
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

        ast.forEach(node => {

            if (node.parent && node.parent.type == js.types.assignment_expression && node.type == js.types.identifier) {
                if (node == node.parent.left) {

                    const assign = node.parent;

                    const k = node.name;

                    if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults$1[k] || ignore.includes(k))
                        return;

                    node.replace(new js.member_expression(new js.identifier(["emit"]), node));
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
            if (!scope.ele || this.getAttribute("element")){
                const ele =  createElement(this.element || "div");

                if(scope.ele){
                    appendChild(scope.ele, ele);
                    scope.ele = ele;
                }

                return ele;
            } 

            return  scope.ele;
        }

        mount(own_element, outer_scope, presets = this.presets, slots = {}, pinned = {}) {

            const scope = new Scope(outer_scope, presets, own_element, this);

            if (this.HAS_TAPS) {
                const tap_list = this.tap_list;

                for (let i = 0, l = tap_list.length; i < l; i++) {
                    const tap = tap_list[i],
                        name = tap.name,
                        bool = name == "update";

                    scope.taps[name] = bool ? new UpdateTap(scope, name, tap.modes) : new Tap(scope, name, tap.modes);

                    if (bool)
                        scope.update_tap = scope.taps[name];
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
            //this.containerFunction = this.containerFunction.bind(this);
        }

        updateProp(io, val) {
            super.updateProp(io, val);
            this.down();
        }

        scheduledUpdate() {
            
            this.val = super.scheduledUpdate();
            this.ele.data = this.val;

            if(this.val !== this.old_val){
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

        constructor(sym, env, lex) {
            this.lex = lex.copy();
            this.lex.sl = lex.off - 3;
            this.lex.off = env.start;

            this.METHOD = IDENTIFIER;

            this.ast = sym[2];
            this.prop = (sym.length > 3) ? sym[5] : null;

            this.function = null;
            this.args = null;
            this.READY = false;

            this.origin_url = env.url;

            this.val = this.ast + "";

            if (!(this.ast instanceof js.identifier))
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

            const r = new js.return_statement([]);
            r.vals[0] = this.ast;
            this.ast = r;
            this.val = r + "";
            this.METHOD = EXPRESSION;

            console.log(this.ast.render());

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
            this.data = sym[0];
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
            return !this.IS_BINDING && (!this.data.trim());
        }

        mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {

            if (ele instanceof Text)
                element.appendChild(ele);

            if (this.IS_BINDING)
                return new DataNodeIO(scope, this.data.bind(scope, null, pinned), ele, this.data.exprb);
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

    //import Plugin from "./../plugin.mjs";

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
                    new this.io_constr(scope, this, bind, this.name, element, this.value.default);
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
    		return js.types.identifier;
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
            switch_statement: js.switch_statement,
            script: js.script,
            module: js.module,
            empty_statement: js.empty_statement,
            break_statement: js.break_statement,
            case_statement: js.case_statement,
            default_case_statement: js.default_case_statement,
            continue_statement: js.continue_statement,
            import_declaration: js.import_declaration,
            import_clause: js.import_clause,
            variable_statement: js.variable_statement,
            throw_statement: js.throw_statement,
            default_import: js.default_import,
            name_space_import: js.name_space_import,
            named_imports: js.named_imports,
            import_specifier: js.import_specifier,
            export_declaration: js.export_declaration,
            export_clause: js.export_clause,
            export_specifier: js.export_specifier,
            parenthasized: js.parenthasized,
            add_expression: js.add_expression,
            and_expression: js.and_expression,
            array_literal: js.array_literal,
            arrow_function_declaration: js.arrow_function_declaration,
            assignment_expression: js.assignment_expression,
            await_expression: js.await_expression,
            bit_and_expression: js.bit_and_expression,
            bit_or_expression: js.bit_or_expression,
            bit_xor_expression: js.bit_xor_expression,
            label_statement: js.label_statement,
            binding: js.binding,
            block_statement: js.block_statement,
            bool_literal: js.bool_literal,
            call_expression: js.call_expression,
            catch_statement: js.catch_statement,
            condition_expression: js.condition_expression,
            debugger_statement: js.debugger_statement,
            delete_expression: js.delete_expression,
            divide_expression: js.divide_expression,
            equality_expression: js.equality_expression,
            exponent_expression: js.exponent_expression,
            expression_list: js.expression_list,
            expression_statement: js.expression_statement,
            for_statement: js.for_statement,
            function_declaration: js.function_declaration,
            identifier: js.identifier,
            if_statement: js.if_statement,
            in_expression: js.in_expression,
            instanceof_expression: js.instanceof_expression,
            left_shift_expression: js.left_shift_expression,
            lexical: js.lexical_declaration,
            member_expression: js.member_expression,
            modulo_expression: js.modulo_expression,
            multiply_expression: js.multiply_expression,
            negate_expression: js.negate_expression,
            new_expression: js.new_expression,
            null_literal: js.null_literal,
            numeric_literal: js.numeric_literal,
            object_literal: js.object_literal,
            or_expression: js.or_expression,
            plus_expression: js.plus_expression,
            post_decrement_expression: js.post_decrement_expression,
            post_increment_expression: js.post_increment_expression,
            pre_decrement_expression: js.pre_decrement_expression,
            pre_increment_expression: js.pre_increment_expression,
            property_binding: js.property_binding,
            right_shift_expression: js.right_shift_expression,
            right_shift_fill_expression: js.right_shift_fill_expression,
            return_statement: js.return_statement,
            spread_element: js.spread_element,
            statements: js.statements,
            string_literal: js.string,
            string: js.string,
            subtract_expression: js.subtract_expression,
            this_literal: js.this_literal,
            try_statement: js.try_statement,
            typeof_expression: js.typeof_expression,
            unary_not_expression: js.unary_not_expression,
            unary_or_expression: js.unary_or_expression,
            unary_xor_expression: js.unary_xor_expression,
            void_expression: js.void_expression,
            argument_list: js.argument_list,
            arrow: js.arrow_function_declaration,
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
                    error(error.COMPONENT_PARSE_FAILURE, e, compiler_env);
                }

                return ast;
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

                    this.pending = new Promise(res => {
                        compileAST(component_data, presets).then(ast => {

                            if (this.constructor.prototype !== Component.prototype) {

                                //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

                                for (const a of Object.getOwnPropertyNames(this.constructor.prototype)) {
                                    if (a == "constructor") continue;

                                    const r = this.constructor.prototype[a];

                                    if (typeof r == "function") {

                                        //extract and process function information. 
                                        let c_env = new CompilerEnvironment(presets, env$1);

                                        let js_ast = parser(whind$1("function " + r.toString().trim() + ";"), c_env);

                                        let func_ast = JS.getFirst(js_ast, js.types.function_declaration);
                                        let ids = JS.getClosureVariableNames(func_ast);
                                        let args = JS.getFunctionDeclarationArgumentNames(js_ast); // Function arguments in wick class component definitions are treated as TAP variables. 
                                        const HAS_CLOSURE = (ids.filter(a => !args.includes(a))).length > 0;

                                        const binding = new Binding([null, func_ast.id], { presets, start: 0 }, whind$1("ddddd"));
                                        const attrib = new Attribute(["on", null, binding], presets);
                                        const stmt = func_ast.body;

                                        let script = new ScriptNode({}, null, stmt, [attrib], presets);

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

                            if (this.__pending) {
                                this.__pending.forEach(e => e[3](this.mount(...e.slice(0, 3))));
                                this.__pending = null;
                            }

                            return res(this);
                        });
                    });
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

}(js));
