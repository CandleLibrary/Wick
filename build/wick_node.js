'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
                .reduce((r, v$$1) => (r + ((v$$1.charCodeAt(0) == HORIZONTAL_TAB) | 0)), 0),

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
        const l$$1 = marker.sl,
            str = marker.str,
            number_and_identifier_table$$1 = this.id_lu,
            IWS = marker.IWS;

        let length = marker.tl,
            off = marker.off + length,
            type = symbol,
            line = marker.line,
            base = off,
            char = marker.char,
            root = marker.off;

        if (off >= l$$1) {
            length = 0;
            base = l$$1;
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
                m$$1;

            while (code == 32 && IWS)
                (code = str.charCodeAt(++off2), off++);

            while ((m$$1 = map.get(code))) {
                map = m$$1;
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
                            while (++off < l$$1 && (12 & number_and_identifier_table$$1[str.charCodeAt(off)]));

                            if ((str[off] == "e" || str[off] == "E") && (12 & number_and_identifier_table$$1[str.charCodeAt(off + 1)])) {
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
                            while (++off < l$$1 && ((10 & number_and_identifier_table$$1[str.charCodeAt(off)])));
                            type = identifier;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol;
                            } else {
                                while (++off < l$$1 && str.charCodeAt(off) !== code);
                                type = string;
                                length = off - base + 1;
                            }
                            break;
                        case 3: //SPACE SET
                            while (++off < l$$1 && str.charCodeAt(off) === SPACE);
                            type = white_space;
                            length = off - base;
                            break;
                        case 4: //TAB SET
                            while (++off < l$$1 && str[off] === HORIZONTAL_TAB);
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
                    if (off < l$$1) {
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
            const c$$1 = jump_table[lex.string.charCodeAt(lex.off)];

            if (c$$1 > 2 && c$$1 < 7) {

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
            const c$$1 = jump_table[lex.string.charCodeAt(lex.sl - 1)];

            if (c$$1 > 2 && c$$1 < 7) {
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

        for (let i$$1 = 0; i$$1 < sym.length; i$$1++) {
            let code = sym.charCodeAt(i$$1);
            let m$$1 = map.get(code);
            if (!m$$1) {
                m$$1 = map.set(code, new Map).get(code);
            }
            map = m$$1;
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

    set string_length(s$$1) {}

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
    set END(v$$1) {}

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

const HORIZONTAL_TAB$1 = 9;
const SPACE$1 = 32;

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

const
    number$1 = 1,
    identifier$1 = 2,
    string$1 = 4,
    white_space$1 = 8,
    open_bracket$1 = 16,
    close_bracket$1 = 32,
    operator$1 = 64,
    symbol$1 = 128,
    new_line$1 = 256,
    data_link$1 = 512,
    alpha_numeric$1 = (identifier$1 | number$1),
    white_space_new_line$1 = (white_space$1 | new_line$1),
    Types$1 = {
        num: number$1,
        number: number$1,
        id: identifier$1,
        identifier: identifier$1,
        str: string$1,
        string: string$1,
        ws: white_space$1,
        white_space: white_space$1,
        ob: open_bracket$1,
        open_bracket: open_bracket$1,
        cb: close_bracket$1,
        close_bracket: close_bracket$1,
        op: operator$1,
        operator: operator$1,
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

const getNumbrOfTrailingZeroBitsFromPowerOf2$1 = (value) => debruijnLUT$1[(value * 0x077CB531) >>> 27];

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
    Creates an error message with a diagram illustrating the location of the error. 
    */
    errorMessage(message = "") {
        const pk = this.copy();

        pk.IWS = false;

        while (!pk.END && pk.ty !== Types$1.nl) { pk.next(); }

        const end = (pk.END) ? this.str.length : pk.off,

            nls = (this.line > 0) ? 1 : 0,
            number_of_tabs = this.str
                .slice(this.off - this.char + nls + nls, this.off + nls)
                .split("")
                .reduce((r, v) => (r + ((v.charCodeAt(0) == HORIZONTAL_TAB$1) | 0)), 0),

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

                            type = number$1;
                            length = off - base;

                            break;
                        case 1: //IDENTIFIER
                            while (++off < l && ((10 & number_and_identifier_table$1[str.charCodeAt(off)])));
                            type = identifier$1;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol$1;
                            } else {
                                while (++off < l && str.charCodeAt(off) !== code);
                                type = string$1;
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
                            //intentional
                        case 6: //LINEFEED
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
                            type = operator$1;
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
                } else {
                    break;
                }

                if (IWS && (type & white_space_new_line$1)) {
                    if (off < l) {
                        type = symbol$1;
                        //off += length;
                        continue;
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
            fs = (await Promise.resolve(require("fs"))).promises,
            path = (await Promise.resolve(require("path")));


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

let number$2 = new NumberSchemeConstructor();

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

let string$2 = new StringSchemeConstructor();

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

let schemes = { date, string: string$2, number: number$2, bool, time };

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
gt2 = [0,-3,138,-346,143,-8,142,148,-3,147],
gt3 = [0,-349,167],
gt4 = [0,-198,178,177,170,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,175,-7,45,106,-4,104,81,176,-7,42,41,169,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt5 = [0,-176,182,-2,17,18,-10,19,-9,20,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt6 = [0,-181,183,185,186,-2,187,-2,184,188,-138,192,-6,189,84,86,-3,85],
gt7 = [0,-194,194,-8,196,126,-30,195,-2,127,131,-3,129,-15,125],
gt8 = [0,-296,202],
gt9 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,242,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt10 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,250,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt11 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,251,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt12 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,252,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt13 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,253,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt14 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,254,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt15 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,255,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt16 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,256,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt17 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,257,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt18 = [0,-278,259],
gt19 = [0,-278,264],
gt20 = [0,-242,80,248,-14,81,249,-11,265,266,75,76,102,-6,74,-1,172,-6,171,-20,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt21 = [0,-339,271,269,270],
gt22 = [0,-325,282,280],
gt23 = [0,-327,292,290],
gt24 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,301,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt25 = [0,-278,306],
gt26 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-17,307,243,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt27 = [0,-228,309],
gt28 = [0,-236,311,312,-75,314,316,317,-19,313,315,84,86,-3,85],
gt29 = [0,-202,321,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt30 = [0,-333,326,-2,328,84,86,-3,85],
gt31 = [0,-333,329,-2,328,84,86,-3,85],
gt32 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,331,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt33 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,334,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt34 = [0,-207,335],
gt35 = [0,-260,339,340,-73,338,315,84,86,-3,85],
gt36 = [0,-335,343,315,84,86,-3,85],
gt37 = [0,-240,345,346,-71,348,316,317,-19,347,315,84,86,-3,85],
gt38 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,349,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt39 = [0,-355,350,351,352,-2,148,-3,355],
gt40 = [0,-355,356,351,352,-2,148,-3,355],
gt41 = [0,-355,358,351,352,-2,148,-3,355],
gt42 = [0,-355,360,351,352,-2,148,-3,355],
gt43 = [0,-355,362,351,352,-2,148,-3,355],
gt44 = [0,-355,365,351,352,-2,148,-3,355],
gt45 = [0,-365,368,-1,369],
gt46 = [0,-361,380,378,379],
gt47 = [0,-350,143,-8,142,148,-3,147],
gt48 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,391,392,395,394,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt49 = [0,-198,178,177,170,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,175,-7,45,106,-4,104,81,176,-5,404,-1,42,41,169,46,70,72,75,76,102,71,103,-4,74,398,172,401,406,410,411,402,-1,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,412,413,91,90,108,403,107,83,407,86,-3,85,-3,180,-1,10,9],
gt50 = [0,-198,415,-2,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt51 = [0,-187,416],
gt52 = [0,-184,424,421,-2,425,-1,426,-145,427,84,86,-3,85],
gt53 = [0,-187,428],
gt54 = [0,-187,429],
gt55 = [0,-204,431,-37,80,175,-7,45,106,-4,104,81,432,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,433,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt56 = [0,-192,437,434,-1,438,-140,439,84,86,-3,85],
gt57 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,440,-2,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt58 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,441,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt59 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,442,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt60 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,443,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt61 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-7,444,49,50,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt62 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-8,445,50,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt63 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-9,446,51,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt64 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-10,447,52,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt65 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-11,448,53,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt66 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,449,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt67 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,450,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt68 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,451,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt69 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-12,452,54,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt70 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,453,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt71 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,454,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt72 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,455,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt73 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,456,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt74 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,457,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt75 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-13,458,55,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt76 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,459,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt77 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,460,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt78 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-14,461,56,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt79 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-15,462,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt80 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-15,463,57,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt81 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,464,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt82 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,465,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt83 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,466,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt84 = [0,-242,80,248,-13,104,81,249,-10,244,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-16,467,58,59,67,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt85 = [0,-265,404,-17,398,-1,401,406,410,411,402,-39,469,470,-3,468,-1,246,407,86,-3,85],
gt86 = [0,-337,472,86,-3,85],
gt87 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,473,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt88 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-1,478,477,474,74,-1,172,-6,171,-3,479,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt89 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,481,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt90 = [0,-337,482,86,-3,85],
gt91 = [0,-278,483],
gt92 = [0,-339,486,-1,485],
gt93 = [0,-325,488],
gt94 = [0,-327,490],
gt95 = [0,-313,494,316,317,-19,493,315,84,86,-3,85],
gt96 = [0,-337,495,86,-3,85],
gt97 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,496,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt98 = [0,-242,80,248,-7,45,106,497,-3,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-8,171,-3,498,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt99 = [0,-202,501,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-1,500,37,-3,38,28,-6,80,502,-7,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt100 = [0,-290,505],
gt101 = [0,-290,507],
gt102 = [0,-286,514,410,411,-27,509,510,-2,512,-1,513,-6,469,470,-4,515,315,407,86,-3,85],
gt103 = [0,-293,517,-19,524,316,317,-2,519,521,-1,522,523,518,-11,515,315,84,86,-3,85],
gt104 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,525,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt105 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,527,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt106 = [0,-211,528,530,532,-1,537,-22,529,536,-2,80,248,-7,45,106,-4,104,81,249,-7,42,41,533,535,70,72,75,76,102,71,103,-4,74,-1,172,-10,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt107 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,539,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt108 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,543,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt109 = [0,-231,545,546],
gt110 = [0,-198,178,177,170,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt111 = [0,-260,549,340],
gt112 = [0,-262,551,553,554,555,-20,558,410,411,-40,469,470,-6,559,86,-3,85],
gt113 = [0,-242,80,248,-13,104,81,249,-10,560,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-20,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt114 = [0,-245,562,565,564,567,-64,524,316,317,-5,568,523,566,-11,515,315,84,86,-3,85],
gt115 = [0,-290,571],
gt116 = [0,-290,572],
gt117 = [0,-356,575,352,-2,148,-3,355],
gt118 = [0,-360,148,-3,577],
gt119 = [0,-360,148,-3,579],
gt120 = [0,-58,582,587,585,590,586,584,593,591,-2,592,-5,588,-1,620,-4,621,-10,619,-44,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt121 = [0,-196,623,625,178,177,626,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt122 = [0,-196,628,625,178,177,626,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt123 = [0,-7,644,657,656,637,-1,641,-25,643,-6,646,-1,647,-1,651,-1,653,648,-295,640,639,-1,635,634,632,636,-10,645,638,369],
gt124 = [0,-367,665],
gt125 = [0,-361,668,-1,667],
gt126 = [0,-196,669,625,178,177,626,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt127 = [0,-293,671],
gt128 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-2,676,675,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt129 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,678,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt130 = [0,-290,682],
gt131 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,683,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt132 = [0,-286,686,410,411,-40,469,470,-6,559,86,-3,85],
gt133 = [0,-286,687,410,411,-40,469,470,-6,559,86,-3,85],
gt134 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,391,392,395,688,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt135 = [0,-189,690,-139,192],
gt136 = [0,-183,691,-2,692],
gt137 = [0,-190,693,-145,189,84,86,-3,85],
gt138 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,705,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt139 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,711,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt140 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-6,718,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt141 = [0,-237,720,-75,314,316,317,-19,313,315,84,86,-3,85],
gt142 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,721,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt143 = [0,-335,725,315,84,86,-3,85],
gt144 = [0,-290,727],
gt145 = [0,-313,524,316,317,-5,730,523,728,-11,515,315,84,86,-3,85],
gt146 = [0,-313,735,316,317,-19,734,315,84,86,-3,85],
gt147 = [0,-290,736],
gt148 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,741,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt149 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,744,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt150 = [0,-216,748,-19,747,312,-75,750,316,317,-19,749,315,84,86,-3,85],
gt151 = [0,-216,751,-23,345,346,-71,753,316,317,-19,752,315,84,86,-3,85],
gt152 = [0,-213,754,-1,757,-23,758,-2,80,248,-13,104,81,249,-10,755,70,72,75,76,102,71,103,-4,74,-1,172,-27,245,-11,79,-4,92,93,91,90,-1,78,-1,246,84,86,-3,85],
gt153 = [0,-232,761],
gt154 = [0,-207,763],
gt155 = [0,-262,764,553,554,555,-20,558,410,411,-40,469,470,-6,559,86,-3,85],
gt156 = [0,-264,767,555,-20,558,410,411,-40,469,470,-6,559,86,-3,85],
gt157 = [0,-265,768,-20,558,410,411,-40,469,470,-6,559,86,-3,85],
gt158 = [0,-245,769,565,564,567,-64,524,316,317,-5,568,523,566,-11,515,315,84,86,-3,85],
gt159 = [0,-241,774,-71,348,316,317,-19,347,315,84,86,-3,85],
gt160 = [0,-5,776],
gt161 = [0,-7,779,657,656,-348,778,-1,148,-3,782,-3,781],
gt162 = [0,-58,786,587,585,590,586,584,593,591,-2,592,-5,588,-1,620,-4,621,-10,619,-44,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt163 = [0,-59,791,-1,590,790,-1,593,591,-2,592,-5,588,-1,620,-4,621,-10,619,-44,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt164 = [0,-61,792,-2,593,591,-2,592,-5,793,-1,620,-4,621,-10,619,-44,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt165 = [0,-68,803,-5,793,-1,620,-4,621,-10,619,-65,804,802,-2,801,-1,805,-3,606,-3,806],
gt166 = [0,-135,808,807,-1,598,-1,617,599,810,809,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt167 = [0,-138,815,-1,617,816,-6,608,609,610,-1,611,-3,612,618],
gt168 = [0,-140,617,817,-6,818,609,610,-1,611,-3,612,618],
gt169 = [0,-140,819,-16,618],
gt170 = [0,-168,606,-3,822],
gt171 = [0,-169,826,824,825],
gt172 = [0,-168,606,-3,832],
gt173 = [0,-168,606,-3,833],
gt174 = [0,-145,604,835,834,-20,606,-3,603],
gt175 = [0,-156,838,-11,606,-3,837],
gt176 = [0,-139,840,-16,841],
gt177 = [0,-196,845,625,178,177,626,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt178 = [0,-196,849,625,178,177,626,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt179 = [0,-7,644,657,656,637,-1,641,-25,643,-6,646,-1,647,-1,651,-1,653,648,-295,640,639,-1,635,634,853,636,-10,645,638,369],
gt180 = [0,-359,857,148,-3,147],
gt181 = [0,-7,644,657,656,637,-1,641,-25,643,-6,646,-1,647,-1,651,-1,653,648,-295,640,639,-1,858,-2,636,-10,645,638,369],
gt182 = [0,-7,644,657,656,-3,859,-1,862,-4,879,867,-2,863,870,869,-3,864,875,874,873,-3,866,643,-4,865,-1,646,-1,647,-1,651,-1,653,648,-296,861,-15,645,860,369],
gt183 = [0,-11,882],
gt184 = [0,-7,779,657,656,-348,884,-1,148,-3,782,-3,781],
gt185 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,885,653,648,-312,645,886,369],
gt186 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,888,653,648,-312,645,886,369],
gt187 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,889,653,648,-189,80,248,-7,45,106,-4,104,81,249,-7,42,41,349,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-22,645,886,369],
gt188 = [0,-55,896,895,897],
gt189 = [0,-350,910],
gt190 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-1,916,915,914,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt191 = [0,-265,404,-19,918,406,410,411,402,-39,469,470,-3,468,-1,246,407,86,-3,85],
gt192 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,919,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt193 = [0,-244,920,921,565,564,567,-64,524,316,317,-5,568,523,566,-11,515,315,84,86,-3,85],
gt194 = [0,-184,926,-3,425,-1,426,-145,427,84,86,-3,85],
gt195 = [0,-190,927,-145,189,84,86,-3,85],
gt196 = [0,-192,929,-2,438,-140,439,84,86,-3,85],
gt197 = [0,-336,930,84,86,-3,85],
gt198 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,931,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt199 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-1,933,-2,74,-1,172,-6,171,-3,479,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt200 = [0,-313,935,316,317,-19,934,315,84,86,-3,85],
gt201 = [0,-286,514,410,411,-27,937,-3,939,-1,513,-6,469,470,-4,515,315,407,86,-3,85],
gt202 = [0,-313,524,316,317,-5,940,523,-12,515,315,84,86,-3,85],
gt203 = [0,-293,943,-19,524,316,317,-3,945,-1,522,523,944,-11,515,315,84,86,-3,85],
gt204 = [0,-202,946,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt205 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,947,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt206 = [0,-202,948,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt207 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,949,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt208 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,952,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt209 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,954,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt210 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,956,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt211 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,958,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt212 = [0,-216,960,-96,962,316,317,-19,961,315,84,86,-3,85],
gt213 = [0,-216,751,-96,962,316,317,-19,961,315,84,86,-3,85],
gt214 = [0,-223,963],
gt215 = [0,-202,965,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt216 = [0,-233,966,-79,968,316,317,-19,967,315,84,86,-3,85],
gt217 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,973,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt218 = [0,-247,976,977,-64,524,316,317,-5,568,523,566,-11,515,315,84,86,-3,85],
gt219 = [0,-5,978],
gt220 = [0,-4,979],
gt221 = [0,-7,982,657,656,-359,985,984,983,986],
gt222 = [0,-369,985,984,994,986],
gt223 = [0,-69,999,1000,-58,1003,-4,1002],
gt224 = [0,-91,1007,-1,1010,-1,1008,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt225 = [0,-77,1023,-56,1025],
gt226 = [0,-86,1026,1028,1030,1033,1032,-21,1031,-55,606,-3,1035],
gt227 = [0,-68,803,-5,793,-1,620,-4,621,-10,619,-65,804,802,-2,1036,-1,805,-3,606,-3,806],
gt228 = [0,-137,1037,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt229 = [0,-68,1040,-5,793,-1,620,-4,621,-10,619,-67,1042,1041,-2,1043,-3,606,-3,806],
gt230 = [0,-135,1046,-2,598,-1,617,599,810,809,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt231 = [0,-138,598,-1,617,599,1047,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt232 = [0,-140,617,1048,-6,818,609,610,-1,611,-3,612,618],
gt233 = [0,-156,838],
gt234 = [0,-169,1050,-1,1049],
gt235 = [0,-153,1052],
gt236 = [0,-155,1058],
gt237 = [0,-168,606,-3,837],
gt238 = [0,-156,1060],
gt239 = [0,-359,1070,148,-3,147],
gt240 = [0,-359,1071,148,-3,147],
gt241 = [0,-7,644,657,656,-12,1075,1073,-14,643,-6,646,-1,647,-1,651,-1,653,648,-296,1077,-15,645,1076,369],
gt242 = [0,-7,644,657,656,-11,867,-2,1085,1080,-1,1078,1082,1079,-8,643,-6,646,-1,647,-1,651,-1,653,648,-296,1084,-15,645,1083,369],
gt243 = [0,-7,644,657,656,-11,867,-2,1096,-6,875,1091,-1,1089,1093,1090,-1,643,-6,646,-1,647,-1,651,-1,653,648,-296,1095,-15,645,1094,369],
gt244 = [0,-7,644,657,656,-4,1098,-23,643,-6,646,-1,647,-1,651,-1,653,648,-296,1100,-15,645,1099,369],
gt245 = [0,-16,1102,1101],
gt246 = [0,-18,1106,1105],
gt247 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,-1,653,648,-312,645,1112,369],
gt248 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,889,653,648,-312,645,886,369],
gt249 = [0,-7,779,657,656,-232,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,391,392,395,394,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-15,884,-1,148,-3,782,-3,781],
gt250 = [0,-7,644,657,656,-28,643,-6,646,-1,647,-1,651,889,653,648,-212,404,-17,398,-1,401,406,410,411,402,-39,469,470,-3,468,-1,246,407,86,-3,85,-22,645,886,369],
gt251 = [0,-57,1121],
gt252 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1122,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt253 = [0,-350,1123],
gt254 = [0,-242,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,1126,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt255 = [0,-248,1130,-17,1129,-46,524,316,317,-5,568,523,-12,515,315,84,86,-3,85],
gt256 = [0,-313,524,316,317,-5,730,523,1135,-11,515,315,84,86,-3,85],
gt257 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1140,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt258 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1142,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt259 = [0,-202,1145,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt260 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1147,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt261 = [0,-202,1150,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt262 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1152,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt263 = [0,-224,1154,1156,1155],
gt264 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1161,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt265 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1163,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt266 = [0,-369,1169,-2,986],
gt267 = [0,-70,1174,-58,1003,-4,1002],
gt268 = [0,-72,1176,-18,1177,-1,1010,-1,1008,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt269 = [0,-130,1180,1179],
gt270 = [0,-132,1183,1182],
gt271 = [0,-124,1188,-43,606,-3,1189],
gt272 = [0,-94,1190],
gt273 = [0,-99,1194,1192,-1,1196,1193],
gt274 = [0,-105,1198,-1,1019,-4,1020,-55,606,-3,1035],
gt275 = [0,-96,1012,1199,1014,-2,1015,-2,1013,1016,1200,1019,-4,1020,1203,-6,1205,1207,1204,1206,-1,1210,-2,1209,-39,606,-3,1201],
gt276 = [0,-87,1214,1030,1033,1032,-21,1031,-55,606,-3,1035],
gt277 = [0,-82,1217,1215,1219,1216],
gt278 = [0,-86,1221,1028,1030,1033,1032,-21,1031,-51,1222,-3,606,-3,1223],
gt279 = [0,-158,1229,-5,805,-3,606,-3,806],
gt280 = [0,-165,1233,1231,1230],
gt281 = [0,-151,1237,-16,606,-3,1238],
gt282 = [0,-137,1241,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt283 = [0,-359,1248,148,-3,147],
gt284 = [0,-7,644,657,656,-12,1251,-15,643,-6,646,-1,647,-1,651,-1,653,648,-296,1077,-15,645,1076,369],
gt285 = [0,-7,644,657,656,-11,867,-2,1085,-3,1082,1252,-8,643,-6,646,-1,647,-1,651,-1,653,648,-296,1084,-15,645,1083,369],
gt286 = [0,-7,644,657,656,-11,867,-2,1085,-3,1254,-9,643,-6,646,-1,647,-1,651,-1,653,648,-296,1084,-15,645,1083,369],
gt287 = [0,-39,1260,1259,1257,1256,-324,1261],
gt288 = [0,-7,644,657,656,-11,867,-2,1096,-10,1093,1262,-1,643,-6,646,-1,647,-1,651,-1,653,648,-296,1095,-15,645,1094,369],
gt289 = [0,-7,644,657,656,-11,867,-2,1096,-10,1264,-2,643,-6,646,-1,647,-1,651,-1,653,648,-296,1095,-15,645,1094,369],
gt290 = [0,-16,1265],
gt291 = [0,-18,1266],
gt292 = [0,-7,982,657,656,-315,282,280,-42,985,984,983,986],
gt293 = [0,-327,292,290,-40,985,984,994,986],
gt294 = [0,-7,779,657,656,-232,80,248,-7,45,106,-4,104,81,249,-10,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,705,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85,-15,884,-1,148,-3,782,-3,781],
gt295 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1280,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt296 = [0,-202,1287,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt297 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1289,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt298 = [0,-202,1292,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt299 = [0,-202,1294,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt300 = [0,-202,1295,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt301 = [0,-202,1296,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt302 = [0,-202,1298,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt303 = [0,-202,1299,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt304 = [0,-202,1300,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt305 = [0,-225,1304,1302],
gt306 = [0,-224,1305,1156],
gt307 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1307,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt308 = [0,-207,1309],
gt309 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1310,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt310 = [0,-72,1315,-18,1316,-1,1010,-1,1008,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt311 = [0,-91,1317,-1,1010,-1,1008,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt312 = [0,-130,1320],
gt313 = [0,-132,1322],
gt314 = [0,-134,1323],
gt315 = [0,-64,593,1326,1325,1324,-69,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt316 = [0,-93,1010,-1,1327,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt317 = [0,-94,1328],
gt318 = [0,-96,1329,-1,1014,-2,1015,-3,1330,-1,1019,-4,1020,-55,606,-3,1035],
gt319 = [0,-99,1331],
gt320 = [0,-102,1332],
gt321 = [0,-105,1333,-1,1019,-4,1020,-55,606,-3,1035],
gt322 = [0,-105,1334,-1,1019,-4,1020,-55,606,-3,1035],
gt323 = [0,-110,1339,1337],
gt324 = [0,-114,1343],
gt325 = [0,-115,1348,1349,-1,1350],
gt326 = [0,-127,1355],
gt327 = [0,-108,1362,1360],
gt328 = [0,-75,1365,-2,1367,1366,1368,-45,1371],
gt329 = [0,-64,593,1326,1325,1373,-69,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt330 = [0,-82,1374],
gt331 = [0,-84,1375],
gt332 = [0,-87,1376,1030,1033,1032,-21,1031,-55,606,-3,1035],
gt333 = [0,-87,1377,1030,1033,1032,-21,1031,-55,606,-3,1035],
gt334 = [0,-137,1380,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt335 = [0,-160,1382,-3,1043,-3,606,-3,806],
gt336 = [0,-163,1383,-1,1233,1231,1384],
gt337 = [0,-165,1386],
gt338 = [0,-165,1233,1231,1387],
gt339 = [0,-154,1388],
gt340 = [0,-39,1260,1259,1257,1396,-324,1261],
gt341 = [0,-39,1260,1259,1398,-325,1261],
gt342 = [0,-39,1260,1399,-326,1261],
gt343 = [0,-39,1400,-327,1261],
gt344 = [0,-7,644,657,656,-28,643,-5,1401,646,-1,647,-1,651,-1,653,648,-296,1403,-15,645,1402,369],
gt345 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1407,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt346 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1408,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt347 = [0,-202,1411,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt348 = [0,-202,1412,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt349 = [0,-202,1413,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt350 = [0,-202,1414,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt351 = [0,-202,1415,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt352 = [0,-225,1416],
gt353 = [0,-225,1304],
gt354 = [0,-198,178,177,1420,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt355 = [0,-91,1422,-1,1010,-1,1008,1012,1009,1014,-2,1015,-2,1013,1016,-1,1019,-4,1020,-11,1011,-43,606,-3,1021],
gt356 = [0,-71,1423,-14,1424,1028,1030,1033,1032,-21,1031,-51,1425,-3,606,-3,1426],
gt357 = [0,-64,593,1429,-71,595,598,-1,617,599,596,-1,597,604,601,600,608,609,610,-1,611,-3,612,618,-10,606,-3,603],
gt358 = [0,-99,1194,1192],
gt359 = [0,-110,1431],
gt360 = [0,-121,1432,-1,1433,-1,1210,-2,1209,-39,606,-3,1434],
gt361 = [0,-121,1435,-1,1433,-1,1210,-2,1209,-39,606,-3,1434],
gt362 = [0,-123,1437,-44,606,-3,1434],
gt363 = [0,-168,606,-3,1438],
gt364 = [0,-168,606,-3,1439],
gt365 = [0,-108,1443],
gt366 = [0,-78,1367,1445,1368,-45,1371],
gt367 = [0,-165,1233,1231,1384],
gt368 = [0,-242,80,248,-7,45,106,-4,104,81,249,-7,42,41,1456,46,70,72,75,76,102,71,103,-4,74,-1,172,-6,171,-3,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,-1,78,107,303,84,86,-3,85],
gt369 = [0,-198,178,177,719,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-5,1460,975,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt370 = [0,-202,1461,-2,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-6,80,-8,45,106,-4,104,81,-8,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt371 = [0,-198,178,177,1463,179,23,24,126,31,25,39,29,26,30,-3,112,-2,32,33,34,36,35,113,-4,27,-2,37,-3,38,28,-2,127,131,-2,80,129,-7,45,106,-4,104,81,125,-7,42,41,40,46,70,72,75,76,102,71,103,-4,74,-12,43,-1,44,47,48,49,50,51,52,53,54,55,56,57,58,59,67,82,-11,79,-4,92,93,91,90,108,78,107,83,84,86,-3,85,-3,180,-1,10,9],
gt372 = [0,-117,1465],
gt373 = [0,-119,1467],
gt374 = [0,-68,803,-5,793,-1,620,-4,621,-10,619,-65,804,802,-2,1470,-1,805,-3,606,-3,806],
gt375 = [0,-80,1471,-45,1371],
gt376 = [0,-121,1475,-1,1433,-1,1210,-2,1209,-39,606,-3,1434],
gt377 = [0,-121,1477,-1,1433,-1,1210,-2,1209,-39,606,-3,1434],

    // State action lookup maps
    sm0=[0,-1,1,2,-1,0,-4,0,-5,3,-3,4,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-1,12,-1,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm1=[0,46,-3,0,-4,0],
sm2=[0,47,-3,0,-4,0],
sm3=[0,48,-3,0,-4,0,-4,-1],
sm4=[0,-4,0,-4,0,-9,4,-31,49],
sm5=[0,50,-3,0,-4,0,-4,-1,-72,51],
sm6=[0,-4,0,-4,0,-9,52,-31,52],
sm7=[0,-2,53,-1,0,-4,0,-5,54,55,-139,56,-9,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76],
sm8=[0,77,-3,0,-4,0,-4,-1,-72,77],
sm9=[0,-4,0,-4,0,-4,-1,-4,78,-31,49],
sm10=[0,-1,1,2,-1,0,-4,0,-9,79,-1,5,-14,80,-14,81,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm11=[0,82,-3,0,-4,0,-4,-1],
sm12=[0,83,-3,0,-4,0,-4,-1],
sm13=[0,84,-3,0,-4,0,-4,-1],
sm14=[0,85,1,2,-1,0,-4,0,-4,-1,3,-3,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-1,12,-1,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
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
sm43=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm44=[0,156,156,156,-1,0,-4,0,-4,-1,156,-3,156,156,156,156,-3,156,-3,156,-5,156,156,-12,156,156,-1,156,-14,156,156,-1,156,-4,156,156,156,156,156,-6,156,-2,156,156,156,-1,156,-1,156,156,-1,156,156,-1,156,156,156,156,156,-1,156,156,156,156,156,156,-1,156,-2,156,156,-5,156,156,-2,156,-10,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156,156],
sm45=[0,159,159,159,-1,0,-4,0,-4,-1,159,-3,159,159,159,159,-2,159,159,-3,159,-5,159,159,-12,159,159,-1,159,-14,159,159,-1,159,-4,159,159,159,159,159,-1,159,-1,159,-2,159,-2,159,159,159,-1,159,-1,159,159,-1,159,159,-1,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,-2,159,159,-5,159,159,-2,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159],
sm46=[0,159,159,159,-1,0,-4,0,-4,-1,159,-3,159,159,160,159,-2,159,159,-3,159,-5,161,159,-12,159,159,-1,159,-14,159,159,-1,159,-4,159,159,159,159,159,162,159,-1,159,-2,159,-2,159,159,159,-1,159,-1,159,159,-1,159,159,-1,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,-2,159,159,-5,159,159,-2,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159],
sm47=[0,163,163,163,-1,0,-4,0,-4,-1,163,-3,163,163,160,163,-2,163,163,-3,163,-5,164,163,-12,163,163,-1,163,-14,163,163,-1,163,-4,163,163,163,163,163,165,163,-1,163,-2,163,-2,163,163,163,-1,163,-1,163,163,-1,163,163,-1,163,163,163,163,163,163,163,163,163,163,163,163,-1,163,-2,163,163,-5,163,163,-2,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163],
sm48=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-29,166,-10,11,-3,13,14,-27,31,167,-2,33,-29,40,41,42,43,44,45],
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
sm64=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,207,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
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
sm75=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-7,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,-6,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm76=[0,-4,0,-4,0,-4,-1,-6,220],
sm77=[0,-4,0,-4,0,-4,-1,-6,221,-84,222],
sm78=[0,-4,0,-4,0,-4,-1,-6,223],
sm79=[0,-2,2,-1,0,-4,0,-4,-1,-72,224,-4,11,-71,45],
sm80=[0,-2,2,-1,0,-4,0,-4,-1,-72,225,-4,11,-71,45],
sm81=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-9,226,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm82=[0,-4,0,-4,0,-4,-1,-6,227],
sm83=[0,-4,0,-4,0,-4,-1,-36,228],
sm84=[0,-4,0,-4,0,-4,-1,-72,229],
sm85=[0,230,230,230,-1,0,-4,0,-4,-1,230,-1,230,-1,230,-1,230,-14,230,-14,230,-1,230,-22,230,230,-9,230,-3,230,230,-1,230,230,230,230,-1,230,230,-1,230,230,230,230,230,-1,230,230,230,230,230,230,230,230,-2,230,230,-5,230,230,-2,230,-23,230,230,230,230,230,230,230,230,230,230,230,230],
sm86=[0,-2,2,-1,0,-4,0,-4,-1,-36,231,-40,11,-28,232,-42,45],
sm87=[0,233,233,233,-1,0,-4,0,-4,-1,233,-1,233,-1,233,-1,233,-14,233,-14,233,-1,233,-22,233,233,-9,233,-3,233,233,-1,233,233,233,233,-1,233,233,-1,233,233,233,233,233,-1,233,233,233,233,233,233,233,233,-2,233,233,-5,233,233,-2,233,-23,233,233,233,233,233,233,233,233,233,233,233,233],
sm88=[0,-2,2,-1,0,-4,0,-4,-1,-6,234,-70,11,-71,45],
sm89=[0,-2,235,-1,0,-4,0,-4,-1,-21,235,-14,235,-40,235,-71,235],
sm90=[0,-2,236,-1,0,-4,0,-4,-1,-21,236,-14,236,-40,236,-71,236],
sm91=[0,237,-3,0,-4,0],
sm92=[0,-4,0,-4,0,-9,238,-31,238],
sm93=[0,-1,1,2,-1,0,-4,0,-11,5,-14,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm94=[0,239,239,239,-1,0,-4,0,-5,239,-1,239,-1,239,-1,239,-14,239,-14,239,-1,239,-22,239,239,-9,239,-3,239,239,-1,239,239,239,239,-1,239,239,239,239,239,239,239,239,-1,239,239,239,239,239,239,239,239,-2,239,239,-5,239,239,-2,239,-23,239,239,239,239,239,239,239,239,239,239,239,239],
sm95=[0,-2,53,-1,0,-4,0,-149,240,241],
sm96=[0,-2,53,-1,0,-4,0,-20,242,-128,240,241],
sm97=[0,-2,53,-1,0,-4,0,-20,243,-128,240,241],
sm98=[0,-2,53,-1,0,-4,0,-20,244,-128,240,241],
sm99=[0,-2,53,-1,0,-4,0,-4,-1,-5,245,-9,246,-128,240,241],
sm100=[0,-2,53,-1,0,-4,0,-4,-1,-5,247,-9,248,-128,240,241],
sm101=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-171,256],
sm102=[0,-2,257,-1,0,-4,0,-10,258,-9,258,-128,257,257],
sm103=[0,-2,259,-1,0,-4,0,-4,-1,-5,259,-9,259,-128,259,259],
sm104=[0,-2,260,-1,261,-4,262,-4,-1,-5,263,-4,263,-4,263,-6,263,-52,264,265,266,-66,263,263],
sm105=[0,-2,267,-1,267,-4,267,-4,-1,-5,267,-4,267,-4,267,-6,267,-52,267,267,267,-66,267,267],
sm106=[0,-2,258,-1,0,-4,0,-10,258,-9,258,-128,258,258],
sm107=[0,-2,258,-1,0,-4,0,-4,-1,-5,258,-9,258,-128,258,258],
sm108=[0,268,-3,0,-4,0,-4,-1,-72,268],
sm109=[0,-2,53,-1,0,-4,0,-5,269,270,-149,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76],
sm110=[0,-4,0,-4,0,-41,271,-35,98],
sm111=[0,-4,0,-4,0,-4,-1,-38,272],
sm112=[0,273,273,273,-1,0,-4,0,-4,-1,273,-3,273,273,273,273,-2,273,273,-3,273,-5,273,273,-12,273,273,-1,273,-14,273,273,-1,273,-4,273,273,273,273,273,273,273,-1,273,-2,273,-2,273,273,273,-1,273,-1,273,273,-1,273,273,-1,273,273,273,273,273,273,273,273,273,273,273,273,-1,273,-2,273,273,-5,273,273,-2,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273,273],
sm113=[0,274,274,274,-1,0,-4,0,-4,-1,274,-3,274,274,274,274,-2,274,274,-3,274,-5,274,274,-12,274,274,-1,274,-14,274,274,-1,274,-4,274,274,274,274,274,274,274,-1,274,-2,274,-2,274,274,274,-1,274,-1,274,274,-1,274,274,-1,274,274,274,274,274,274,274,274,274,274,274,274,-1,274,-2,274,274,-5,274,274,-2,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274,274],
sm114=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,275,-12,276,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,277,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm115=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-14,278,-13,279,81,-1,280,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-3,281,282,31,32,-1,283,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm116=[0,233,233,233,-1,0,-4,0,-4,-1,233,-3,284,284,284,-3,284,284,-3,284,-5,284,-13,284,284,-1,233,-14,284,284,-1,284,-4,284,233,284,284,284,284,284,-1,284,-2,233,-3,284,233,-1,233,-1,233,233,-1,233,233,-1,233,233,233,233,233,-1,233,233,233,233,233,233,-1,233,-2,233,233,-5,233,233,-2,233,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,233,233,233,233,284,284,233,233,233,233,233,233],
sm117=[0,-1,230,230,-1,0,-4,0,-4,-1,-4,285,285,285,-3,285,285,-3,285,-5,285,-13,285,285,-1,230,-14,285,285,-1,285,-4,285,230,285,285,285,285,285,-1,285,-2,230,-3,285,230,-3,230,230,-1,230,230,-1,230,230,230,230,230,-1,230,230,230,230,230,230,-1,230,-2,230,230,-5,230,230,-2,230,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,230,230,230,230,285,285,230,230,230,230,230,230],
sm118=[0,-1,1,2,-1,0,-4,0,-4,-1,-2,286,-1,79,-1,5,-29,6,-1,286,-22,7,8,-9,9,-3,10,11,-2,286,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,286,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm119=[0,-1,287,287,-1,0,-4,0,-4,-1,-2,287,-1,287,-1,287,-14,287,-14,287,-1,287,-22,287,287,-9,287,-3,287,287,-2,287,287,287,-1,287,287,-1,287,287,287,287,287,-1,287,287,287,287,287,287,287,287,-2,287,287,-5,287,287,-2,287,-23,287,287,287,287,287,287,287,287,287,287,287,287],
sm120=[0,-1,288,288,-1,0,-4,0,-4,-1,-2,288,-1,288,-1,288,-14,288,-14,288,-1,288,-22,288,288,-9,288,-3,288,288,-2,288,288,288,-1,288,288,-1,288,288,288,288,288,-1,288,288,288,288,288,288,288,288,-2,288,288,-5,288,288,-2,288,-23,288,288,288,288,288,288,288,288,288,288,288,288],
sm121=[0,-4,0,-4,0,-77,51],
sm122=[0,-2,53,-1,0,-4,0,-5,269,270,-139,56,-9,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76],
sm123=[0,289,289,289,-1,0,-4,0,-4,-1,289,-3,289,-1,289,-14,289,-14,289,-24,289,289,-9,289,-3,289,289,-1,289,-1,289,289,-1,289,289,-1,289,289,289,289,289,-1,289,289,289,289,289,289,-1,289,-2,289,289,-5,289,289,-2,289,-23,289,289,289,289,289,289,289,289,289,289,289,289],
sm124=[0,-4,0,-4,0,-4,-1,-43,290],
sm125=[0,-4,0,-4,0,-4,-1,-72,291],
sm126=[0,-4,0,-4,0,-4,-1,-35,292,-7,293],
sm127=[0,-4,0,-4,0,-4,-1,-43,293],
sm128=[0,-4,0,-4,0,-4,-1,-35,294,-7,294],
sm129=[0,-4,0,-4,0,-4,-1,-35,295,-2,295,-4,295],
sm130=[0,-4,0,-4,0,-4,-1,-78,296],
sm131=[0,-2,2,-1,0,-4,0,-4,-1,-35,297,-2,298,-38,11,-71,45],
sm132=[0,-4,0,-4,0,-4,-1,-72,299],
sm133=[0,-4,0,-4,0,-4,-1,-43,290,-28,300],
sm134=[0,301,301,301,-1,0,-4,0,-4,-1,301,-3,301,-1,301,-14,301,-14,301,-24,301,301,-9,301,-3,301,301,-1,301,-1,301,301,-1,301,301,-1,301,301,301,301,301,-1,301,301,301,301,301,301,-1,301,-2,301,301,-5,301,301,-2,301,-23,301,301,301,301,301,301,301,301,301,301,301,301],
sm135=[0,-2,2,-1,0,-4,0,-4,-1,-35,302,-2,303,-38,11,-71,45],
sm136=[0,304,304,304,-1,0,-4,0,-4,-1,304,-1,304,-1,304,-1,304,-14,304,-14,304,-1,304,-22,304,304,-9,304,-3,304,304,-1,304,304,304,304,-1,304,304,304,304,304,304,304,304,-1,304,304,304,304,304,304,304,304,-2,304,304,-5,304,304,-2,304,-23,304,304,304,304,304,304,304,304,304,304,304,304],
sm137=[0,305,305,305,-1,0,-4,0,-4,-1,305,-3,305,305,305,305,-3,305,-3,305,-5,305,305,-12,305,305,-1,305,-14,305,305,-1,305,-4,305,305,305,305,305,-6,305,-2,305,305,305,-1,305,-1,305,305,-1,305,305,-1,305,305,305,305,305,-1,305,305,305,305,305,305,-1,305,-2,305,305,-5,305,305,-2,305,-10,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305,305],
sm138=[0,306,306,306,-1,0,-4,0,-4,-1,306,-3,306,306,306,306,-3,306,-3,306,-5,306,306,-12,306,306,-1,306,-14,306,306,-1,306,-4,306,306,306,306,306,-6,306,-2,306,306,306,-1,306,-1,306,306,-1,306,306,-1,306,306,306,306,306,-1,306,306,306,306,306,306,-1,306,-2,306,306,-5,306,306,-2,306,-10,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306,306],
sm139=[0,-1,307,307,-1,0,-4,0,-4,-1,-6,307,-14,307,-14,307,-24,307,307,-13,307,307,-3,307,307,-8,307,-18,307,307,-2,307,-23,307,307,307,307,307,307,307,307,307,307,307,307],
sm140=[0,308,308,308,-1,0,-4,0,-4,-1,308,-3,308,308,308,308,-3,308,-3,308,-5,308,308,-12,308,308,-1,308,-14,308,308,-1,308,-4,308,308,308,308,308,-6,308,-2,308,308,308,-1,308,-1,308,308,-1,308,308,-1,308,308,308,308,308,-1,308,308,308,308,308,308,-1,308,-2,308,308,-5,308,308,-2,308,-10,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308,308],
sm141=[0,104,104,104,-1,0,-4,0,-4,-1,104,-3,104,104,104,104,-3,104,-3,104,-5,104,104,-12,104,104,-1,104,-14,104,104,-1,104,-4,104,104,104,104,104,-6,104,-2,104,104,104,-1,104,-1,104,104,-1,104,104,-1,104,104,104,104,104,-1,104,104,104,104,104,104,-1,104,-2,104,104,-5,104,104,-2,104,-10,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,118,119,104,104,104,104,104,104],
sm142=[0,172,172,172,-1,0,-4,0,-4,-1,172,-3,172,172,172,172,-2,172,172,-3,172,-5,172,172,-12,172,172,-1,172,-14,172,172,-1,172,-4,172,172,172,172,172,172,172,-1,172,-2,172,-2,172,172,172,-1,172,-1,172,172,-1,172,172,-1,172,172,172,172,172,172,172,172,172,172,172,172,-1,172,-2,172,172,-5,172,172,-2,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172],
sm143=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-13,279,-2,280,-38,11,-30,281,282,-3,283,-30,40,41,-3,45],
sm144=[0,284,284,284,-1,0,-4,0,-4,-1,284,-3,284,284,284,284,-2,284,284,-3,284,-5,284,284,-12,284,284,-1,284,-14,284,284,-1,284,-4,284,284,284,284,284,284,284,-1,284,-2,284,-2,284,284,284,-1,284,-1,284,284,-1,284,284,-1,284,284,284,284,284,284,284,284,284,284,284,284,-1,284,-2,284,284,-5,284,284,-2,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284,284],
sm145=[0,285,285,285,-1,0,-4,0,-4,-1,285,-3,285,285,285,285,-2,285,285,-3,285,-5,285,285,-12,285,285,-1,285,-14,285,285,-1,285,-4,285,285,285,285,285,285,285,-1,285,-2,285,-2,285,285,285,-1,285,-1,285,285,-1,285,285,-1,285,285,285,285,285,285,285,285,285,285,285,285,-1,285,-2,285,285,-5,285,285,-2,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285,285],
sm146=[0,310,310,310,-1,0,-4,0,-4,-1,310,-3,310,310,310,310,-3,310,-3,310,-5,310,310,-12,310,310,-1,310,-14,310,310,-1,310,-4,310,310,310,310,310,-6,310,-2,310,310,310,-1,310,-1,310,310,-1,310,310,-1,310,310,310,310,310,-1,310,310,310,310,310,310,-1,310,-2,310,310,-5,310,310,-2,310,-10,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310,310],
sm147=[0,311,311,311,-1,0,-4,0,-4,-1,311,-3,311,311,311,311,-3,311,-3,311,-5,311,311,-12,311,311,-1,311,-14,311,311,-1,311,-4,311,311,311,311,311,-6,311,-2,311,311,311,-1,311,-1,311,311,-1,311,311,-1,311,311,311,311,311,-1,311,311,311,311,311,311,-1,311,-2,311,311,-5,311,311,-2,311,-10,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311,311],
sm148=[0,312,312,312,-1,0,-4,0,-4,-1,312,-3,312,312,312,312,-3,312,-3,312,-5,312,312,-12,312,312,-1,312,-14,312,312,-1,312,-4,312,312,312,312,312,-6,312,-2,312,312,312,-1,312,-1,312,312,-1,312,312,-1,312,312,312,312,312,-1,312,312,312,312,312,312,-1,312,-2,312,312,-5,312,312,-2,312,-10,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312,312],
sm149=[0,313,313,313,-1,0,-4,0,-4,-1,313,-3,313,313,313,313,-3,313,-3,313,-5,313,313,-12,313,313,-1,313,-14,313,313,-1,313,-4,313,313,313,313,313,-6,313,-2,313,313,313,-1,313,-1,313,313,-1,313,313,-1,313,313,313,313,313,-1,313,313,313,313,313,313,-1,313,-2,313,313,-5,313,313,-2,313,-10,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313,313],
sm150=[0,314,314,314,-1,0,-4,0,-4,-1,314,-3,314,314,314,314,-3,314,-3,314,-5,314,314,-12,314,314,-1,314,-14,314,314,-1,314,-4,314,314,314,314,314,-6,314,-2,314,314,314,-1,314,-1,314,314,-1,314,314,-1,314,314,314,314,314,-1,314,314,314,314,314,314,-1,314,-2,314,314,-5,314,314,-2,314,-10,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314,314],
sm151=[0,315,315,315,-1,0,-4,0,-4,-1,315,-3,315,315,315,315,-3,315,-3,315,-5,315,315,-12,315,315,-1,315,-14,315,315,-1,315,-4,315,315,315,315,315,-6,315,-2,315,315,315,-1,315,-1,315,315,-1,315,315,-1,315,315,315,315,315,-1,315,315,315,315,315,315,-1,315,-2,315,315,-5,315,315,-2,315,-10,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315,315],
sm152=[0,316,316,316,-1,0,-4,0,-4,-1,316,-3,316,316,316,316,-3,316,-3,316,-5,316,316,-12,316,316,-1,316,-14,316,316,-1,316,-4,316,316,316,316,316,-6,316,-2,316,316,316,-1,316,-1,316,316,-1,316,316,-1,316,316,316,316,316,-1,316,316,316,316,316,316,-1,316,-2,316,316,-5,316,316,-2,316,-10,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316,316],
sm153=[0,317,317,317,-1,0,-4,0,-4,-1,317,-3,317,317,317,317,-3,317,-3,317,-5,317,317,-12,317,317,-1,317,-14,317,317,-1,317,-4,317,317,317,317,317,-6,317,-2,317,317,317,-1,317,-1,317,317,-1,317,317,-1,317,317,317,317,317,-1,317,317,317,317,317,317,-1,317,-2,317,317,-5,317,317,-2,317,-10,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317,317],
sm154=[0,-2,2,-1,0,-4,0,-4,-1,-77,11,-71,45],
sm155=[0,318,318,318,-1,0,-4,0,-4,-1,318,-3,318,318,318,318,-2,318,318,-3,318,-5,318,318,-12,318,318,-1,318,-14,318,318,-1,318,-4,318,318,318,318,318,318,318,-1,318,-2,318,-2,318,318,318,-1,318,-1,318,318,-1,318,318,-1,318,318,318,318,318,318,318,318,318,318,318,318,-1,318,-2,318,318,-5,318,318,-2,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318,318],
sm156=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,319,-13,80,-13,320,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,321,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm157=[0,322,322,322,-1,0,-4,0,-4,-1,322,-3,322,322,322,322,-2,322,322,-3,322,-5,322,322,-12,322,322,-1,322,-14,322,322,-1,322,-4,322,322,322,322,322,322,322,-1,322,-2,322,-2,322,322,322,-1,322,-1,322,322,-1,322,322,-1,322,322,322,322,322,322,322,322,322,322,322,322,-1,322,-2,322,322,-5,322,322,-2,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
sm158=[0,323,323,323,-1,0,-4,0,-4,-1,323,-3,323,323,323,323,-2,323,323,-3,323,-5,323,323,-12,323,323,-1,323,-14,323,323,-1,323,-4,323,323,323,323,323,-1,323,-1,323,-2,323,-2,323,323,323,-1,323,-1,323,323,-1,323,323,-1,323,323,323,323,323,323,323,323,323,323,323,323,-1,323,-2,323,323,-5,323,323,-2,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323,323],
sm159=[0,-4,0,-4,0,-4,-1,-112,324],
sm160=[0,-4,0,-4,0,-4,-1,-21,209,-44,210],
sm161=[0,325,178,179,-1,180,-4,181,-4,182,325,-3,325,325,325,325,-2,325,325,-2,183,325,-5,325,325,-12,325,325,-1,325,-4,325,-9,325,325,-1,325,-4,325,325,325,325,325,325,325,-1,325,-2,325,-2,325,325,184,325,325,-1,325,325,-1,325,325,-1,325,325,325,325,325,325,325,325,325,325,325,325,-1,325,-2,325,325,325,325,-3,325,325,-2,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,185],
sm162=[0,326,326,326,-1,0,-4,0,-4,-1,326,-3,326,326,326,326,-2,326,326,-3,326,-5,326,326,-12,326,326,-1,326,-4,326,-9,326,326,-1,326,-4,326,326,326,326,326,326,326,-1,326,-2,326,-2,326,326,326,326,326,-1,326,326,-1,326,326,-1,326,326,326,326,326,326,326,326,326,326,326,326,-1,326,-2,326,326,326,326,-3,326,326,-2,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326],
sm163=[0,327,327,327,-1,327,-4,327,-4,327,327,-3,327,327,327,327,-2,327,327,-2,327,327,-5,327,327,-12,327,327,-1,327,-4,327,-9,327,327,-1,327,-4,327,327,327,327,327,327,327,-1,327,-2,327,-2,327,327,327,327,327,-1,327,327,-1,327,327,-1,327,327,327,327,327,327,327,327,327,327,327,327,-1,327,-2,327,327,327,327,-3,327,327,-2,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327,327],
sm164=[0,328,328,328,-1,328,-4,328,-4,328,328,-3,328,328,328,328,-2,328,328,-2,328,328,-5,328,328,-12,328,328,-1,328,-4,328,-9,328,328,-1,328,-4,328,328,328,328,328,328,328,-1,328,-2,328,-2,328,328,328,328,328,-1,328,328,-1,328,328,-1,328,328,328,328,328,328,328,328,328,328,328,328,-1,328,-2,328,328,328,328,-3,328,328,-2,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328,328],
sm165=[0,329,329,329,-1,0,-4,0,-4,-1,329,-3,329,329,329,329,-2,329,329,-3,329,-5,329,329,-12,329,329,-1,329,-4,329,-9,329,329,-1,329,-4,329,329,329,329,329,329,329,-1,329,-2,329,-2,329,329,329,329,329,-1,329,329,-1,329,329,-1,329,329,329,329,329,329,329,329,329,329,329,329,-1,329,-2,329,329,329,329,-3,329,329,-2,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329,329],
sm166=[0,-1,190,191,-1,192,193,194,195,196,0,-4,-1,-144,330],
sm167=[0,331,331,331,-1,0,-4,0,-4,-1,331,-3,331,331,331,331,-2,331,331,-3,331,-5,331,331,-12,331,331,-1,331,-14,331,331,-1,331,-4,331,331,331,331,331,331,331,-1,331,-2,331,-2,331,331,331,-1,331,-1,331,331,-1,331,331,-1,331,331,331,331,331,331,331,331,331,331,331,331,-1,331,-2,331,331,-5,331,331,-2,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331,331],
sm168=[0,-1,332,332,-1,332,332,332,332,332,0,-4,-1,-144,332],
sm169=[0,-1,333,333,-1,333,333,333,333,333,0,-4,-1,-144,333],
sm170=[0,-1,198,199,-1,200,201,202,203,204,0,-4,-1,-145,334],
sm171=[0,-1,335,335,-1,335,335,335,335,335,0,-4,-1,-145,335],
sm172=[0,-1,336,336,-1,336,336,336,336,336,0,-4,-1,-145,336],
sm173=[0,337,337,337,-1,0,-4,0,-4,-1,337,-3,337,337,337,337,-2,337,337,-3,337,-5,337,337,-12,337,337,-1,337,-14,337,337,-1,337,-4,337,337,337,337,337,337,337,-1,337,-2,337,-2,337,337,337,-1,337,-1,337,337,-1,337,337,-1,337,337,337,337,337,337,337,337,337,337,337,337,-1,337,-2,337,337,337,-4,337,337,-2,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337,337],
sm174=[0,-4,0,-4,0,-4,-1,-7,338,-27,339],
sm175=[0,172,172,172,-1,0,-4,0,-4,-1,172,-3,172,172,172,172,-2,172,172,-3,172,-5,172,172,-12,172,172,-1,172,-14,172,172,-1,172,-4,172,172,172,172,172,172,172,-1,172,-2,172,-2,172,172,172,-1,172,-1,172,172,-1,172,172,-1,172,172,172,172,172,172,172,172,172,172,172,172,-1,172,-2,172,172,174,-4,172,172,-2,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172,172],
sm176=[0,340,340,340,-1,0,-4,0,-4,-1,340,-3,340,340,340,340,-2,340,340,-3,340,-5,340,340,-12,340,340,-1,340,-14,340,340,-1,340,-4,340,340,340,340,340,340,340,-1,340,-2,340,-2,340,340,340,-1,340,-1,340,340,-1,340,340,-1,340,340,340,340,340,340,340,340,340,340,340,340,-1,340,-2,340,340,-5,340,340,-2,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340],
sm177=[0,341,341,341,-1,0,-4,0,-4,-1,341,-3,341,341,341,341,-3,341,-3,341,-5,341,341,-12,341,341,-1,341,-14,341,341,-1,341,-4,341,341,341,341,341,-6,341,-2,341,341,341,-1,341,-1,341,341,-1,341,341,-1,341,341,341,341,341,-1,341,341,341,341,341,341,-1,341,-2,341,341,-5,341,341,-2,341,-10,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341,341],
sm178=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,342,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm179=[0,343,343,343,-1,0,-4,0,-4,-1,343,-1,343,-1,343,-1,343,-14,343,-14,343,-1,343,-22,343,343,-9,343,-3,343,343,-1,343,343,343,343,-1,343,343,343,343,343,343,343,343,-1,343,343,343,343,343,343,343,343,-2,343,343,-5,343,343,-2,343,-23,343,343,343,343,343,343,343,343,343,343,343,343],
sm180=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,-3,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,-6,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm181=[0,-4,0,-4,0,-4,-1,-35,344,-36,345],
sm182=[0,-4,0,-4,0,-4,-1,-35,346,-36,346],
sm183=[0,-4,0,-4,0,-4,-1,-10,347,-24,348,-36,348],
sm184=[0,-4,0,-4,0,-4,-1,-10,347],
sm185=[0,-4,0,-4,0,-4,-1,-6,174,174,-2,174,-11,174,-12,174,174,-1,174,-17,174,-15,174,-19,174,-13,174],
sm186=[0,-4,0,-4,0,-4,-1,-7,349,-2,349,-11,349,-12,349,-2,349,-17,349,-35,349],
sm187=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,350,-38,11,-35,351,-30,40,41,-3,45],
sm188=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,352,-12,276,216,-40,11,-35,353,-35,45],
sm189=[0,-4,0,-4,0,-4,-1,-89,354],
sm190=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-29,158,-24,7,8,-9,355,-3,10,11,-3,13,14,-1,15,-2,356,-3,21,-12,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm191=[0,-4,0,-4,0,-4,-1,-6,357],
sm192=[0,-4,0,-4,0,-4,-1,-72,358],
sm193=[0,359,359,359,-1,0,-4,0,-4,-1,359,-1,359,-1,359,-1,359,-14,359,-14,359,-1,359,-22,359,359,-9,359,-3,359,359,-1,359,359,359,359,-1,359,359,359,359,359,359,359,359,-1,359,359,359,359,359,359,359,359,-2,359,359,-5,359,359,-2,359,-23,359,359,359,359,359,359,359,359,359,359,359,359],
sm194=[0,-4,0,-4,0,-4,-1,-72,173],
sm195=[0,-4,0,-4,0,-4,-1,-72,360],
sm196=[0,361,361,361,-1,0,-4,0,-4,-1,361,-1,361,-1,361,-1,361,-14,361,-14,361,-1,361,-22,361,361,-9,361,-3,361,361,-1,361,361,361,361,-1,361,361,361,361,361,361,361,361,-1,361,361,361,361,361,361,361,361,-2,361,361,-5,361,361,-2,361,-23,361,361,361,361,361,361,361,361,361,361,361,361],
sm197=[0,-4,0,-4,0,-4,-1,-72,362],
sm198=[0,363,363,363,-1,0,-4,0,-4,-1,363,-1,363,-1,363,-1,363,-14,363,-14,363,-1,363,-22,363,363,-9,363,-3,363,363,-1,363,363,363,363,-1,363,363,363,363,363,363,363,363,-1,363,363,363,363,363,363,363,363,-2,363,363,-5,363,363,-2,363,-23,363,363,363,363,363,363,363,363,363,363,363,363],
sm199=[0,-4,0,-4,0,-4,-1,-72,364],
sm200=[0,-4,0,-4,0,-4,-1,-101,365,366],
sm201=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm202=[0,367,367,367,-1,0,-4,0,-4,-1,367,-1,367,-1,367,-1,367,-14,367,-14,367,-1,367,-22,367,367,-9,367,-3,367,367,-1,367,367,367,367,-1,367,367,367,367,367,367,367,367,-1,367,367,367,367,367,367,367,367,-2,367,367,-5,367,367,-2,367,-23,367,367,367,367,367,367,367,367,367,367,367,367],
sm203=[0,-4,0,-4,0,-4,-1,-36,231,-69,232],
sm204=[0,368,368,368,-1,0,-4,0,-4,-1,368,-1,368,-1,368,368,368,368,-2,368,368,-3,368,-5,368,368,-12,368,368,-1,368,-14,368,368,-1,368,-4,368,368,368,368,368,368,368,-1,368,-2,368,-2,368,368,368,-1,368,368,368,368,-1,368,368,-1,368,368,368,368,368,368,368,368,368,368,368,368,368,368,-2,368,368,-5,368,368,-2,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368,368],
sm205=[0,-4,0,-4,0,-4,-1,-36,369],
sm206=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,370,-33,371,-4,11,-29,372,281,282,-34,40,41,-3,45],
sm207=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-40,11,-3,13,14,-27,31,32,-2,33,-29,40,41,42,43,44,45],
sm208=[0,-4,0,-4,0,-4,-1,-6,373],
sm209=[0,-2,2,-1,0,-4,0,-4,-1,-7,374,-13,215,-14,216,-40,11,-35,353,-35,45],
sm210=[0,-4,0,-4,0,-4,-1,-35,375,-36,376],
sm211=[0,-4,0,-4,0,-4,-1,-35,377,-36,377],
sm212=[0,-4,0,-4,0,-41,271],
sm213=[0,-2,53,-1,0,-4,0,-10,378,-9,379,-128,240,241],
sm214=[0,-2,380,-1,0,-4,0,-4,-1,-5,380,-9,380,-128,380,380],
sm215=[0,-2,381,-1,0,-4,0,-4,-1,-5,381,-4,382,-4,381,-128,381,381],
sm216=[0,-2,53,-1,0,-4,0,-4,-1,-145,383],
sm217=[0,-2,53,-1,0,-4,0,-4,-1,-144,384],
sm218=[0,-2,385,-1,0,-4,0,-4,-1,-5,385,-4,385,-4,385,-128,385,385],
sm219=[0,-2,53,-1,0,-4,0,-20,386,-128,240,241],
sm220=[0,-2,387,-1,0,-4,0,-7,388,-11,389,-6,390,-14,391,-3,392,-23,393,394,395,-8,396],
sm221=[0,-2,53,-1,0,-4,0,-20,397,-128,240,241],
sm222=[0,-1,1,2,-1,0,-4,0,-7,398,-1,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm223=[0,-2,53,-1,0,-4,0,-20,399,-128,240,241],
sm224=[0,-1,1,2,-1,0,-4,0,-7,400,-1,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm225=[0,-2,53,-1,0,-4,0,-4,-1,-5,401,-9,402,-128,240,241],
sm226=[0,-1,249,250,-1,251,252,253,254,255,403,-4,-1,-2,404,-1,79,-1,405,-14,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm227=[0,-4,0,-4,0,-4,-1,-15,411],
sm228=[0,-2,53,-1,0,-4,0,-4,-1,-5,412,-9,413,-128,240,241],
sm229=[0,414,414,414,-1,414,414,414,414,414,414,-4,-1,-2,415,-1,414,-1,414,414,-6,414,-6,414,-1,414,-1,414,-3,414,-6,414,-35,414,-98,414],
sm230=[0,-4,0,-4,0,-4,-1,-15,416],
sm231=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-15,417,-155,256],
sm232=[0,-1,418,418,-1,418,418,418,418,418,418,-4,-1,-2,418,-1,418,-1,418,418,-6,418,418,-5,418,-1,418,418,418,418,-2,418,-6,418,-1,418,-132,418],
sm233=[0,-4,0,-4,0,-3,419,-1],
sm234=[0,-1,420,420,-1,420,420,420,420,420,420,-4,-1,-2,420,-1,420,-1,420,420,-6,420,420,-3,420,-1,420,-1,420,420,420,420,-2,420,-6,420,-1,420,-132,420],
sm235=[0,-2,260,-1,261,-4,262,-4,-1,-5,421,-4,421,-4,421,-6,421,-52,264,265,266,-66,421,421],
sm236=[0,-2,422,-1,0,-4,0,-4,-1,-5,422,-4,422,-4,422,-6,422,-121,422,422],
sm237=[0,-2,423,-1,423,-4,423,-4,-1,-5,423,-4,423,-4,423,-6,423,-52,423,423,423,-66,423,423],
sm238=[0,-2,424,-1,424,-4,424,-4,-1,-5,424,-4,424,-4,424,-6,424,-52,424,424,424,-66,424,424],
sm239=[0,-2,425,-1,0,-4,0,-4,-1,-5,425,-4,425,-4,425,-6,425,-121,425,425],
sm240=[0,-1,1,2,-1,0,-4,0,-9,79,-1,5,-29,6,-1,426,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm241=[0,427,427,427,-1,0,-4,0,-4,-1,427,-1,427,-1,427,-1,427,-14,427,-14,427,-1,427,-22,427,427,-9,427,-3,427,427,-1,427,427,427,427,-1,427,427,427,427,427,427,427,427,-1,427,427,427,427,427,427,427,427,427,427,427,427,-5,427,427,-2,427,-23,427,427,427,427,427,427,427,427,427,427,427,427],
sm242=[0,-4,0,-4,0,-4,-1,-22,428,-12,429],
sm243=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,430,-12,431,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,277,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm244=[0,432,432,432,-1,0,-4,0,-4,-1,432,-3,432,432,432,432,-2,432,432,-3,432,-5,432,432,-12,432,432,-1,432,-14,432,432,-1,432,-4,432,432,432,432,432,432,432,-1,432,-2,432,-2,432,432,432,-1,432,-1,432,432,-1,432,432,-1,432,432,432,432,432,432,432,432,432,432,432,432,-1,432,-2,432,432,-5,432,432,-2,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432],
sm245=[0,-4,0,-4,0,-4,-1,-22,433,-12,433],
sm246=[0,-1,434,434,-1,0,-4,0,-4,-1,-6,434,-14,434,434,-12,434,434,-24,434,434,-13,434,434,-3,434,434,-8,434,-18,434,434,-1,434,434,-23,434,434,434,434,434,434,434,434,434,434,434,434],
sm247=[0,-4,0,-4,0,-4,-1,-35,435,-2,436],
sm248=[0,-4,0,-4,0,-4,-1,-38,437],
sm249=[0,438,438,438,-1,0,-4,0,-4,-1,438,-3,438,438,438,438,-2,438,438,-3,438,-5,438,438,-12,438,438,-1,438,-14,438,438,-1,438,-4,438,438,438,438,438,438,438,-1,438,-2,438,-2,438,438,438,-1,438,-1,438,438,-1,438,438,-1,438,438,438,438,438,438,438,438,438,438,438,438,-1,438,-2,438,438,-5,438,438,-2,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438,438],
sm250=[0,-4,0,-4,0,-4,-1,-35,439,-2,439],
sm251=[0,-4,0,-4,0,-4,-1,-35,440,-2,440],
sm252=[0,-4,0,-4,0,-4,-1,-4,170,170,170,-3,347,170,-3,170,-5,170,-13,170,170,-1,440,-14,170,170,-1,170,-4,170,-1,170,170,170,170,170,-1,170,-2,170,-3,170,-38,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,-4,170,170],
sm253=[0,-4,0,-4,0,-4,-1,-6,441,-68,442],
sm254=[0,-4,0,-4,0,-4,-1,-4,175,175,443,-3,175,175,-3,175,-5,175,-13,175,175,-1,175,-14,175,175,-1,175,-4,175,-1,175,175,175,175,175,-1,175,-2,175,-2,443,175,-28,175,-9,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,-4,175,175],
sm255=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-55,11,-66,40,41,-3,45],
sm256=[0,-4,0,-4,0,-4,-1,-6,444,-68,444],
sm257=[0,-4,0,-4,0,-4,-1,-4,187,187,187,-3,187,187,-3,187,-5,187,-13,187,187,-16,187,187,-1,187,-4,187,-1,187,187,187,187,187,-1,187,-2,187,-2,443,187,-38,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,-4,187,187],
sm258=[0,-1,445,445,-1,0,-4,0,-4,-1,-2,445,-1,445,-1,445,-14,445,-14,445,-1,445,-22,445,445,-9,445,-3,445,445,-2,445,445,445,-1,445,445,-1,445,445,445,445,445,-1,445,445,445,445,445,445,445,445,-2,445,445,-5,445,445,-2,445,-23,445,445,445,445,445,445,445,445,445,445,445,445],
sm259=[0,-4,0,-4,0,-4,-1,-72,446],
sm260=[0,-4,0,-4,0,-4,-1,-144,40,41],
sm261=[0,447,447,447,-1,0,-4,0,-4,-1,447,-3,447,-1,447,-14,447,-14,447,-24,447,447,-9,447,-3,447,447,-1,447,-1,447,447,-1,447,447,-1,447,447,447,447,447,-1,447,447,447,447,447,447,-1,447,-2,447,447,-5,447,447,-2,447,-23,447,447,447,447,447,447,447,447,447,447,447,447],
sm262=[0,-4,0,-4,0,-4,-1,-36,90,-27,91],
sm263=[0,-4,0,-4,0,-4,-1,-35,448,-2,449],
sm264=[0,-4,0,-4,0,-4,-1,-38,450],
sm265=[0,-4,0,-4,0,-4,-1,-43,451],
sm266=[0,-4,0,-4,0,-4,-1,-35,452,-2,452],
sm267=[0,-4,0,-4,0,-4,-1,-35,453,-2,453],
sm268=[0,-4,0,-4,0,-4,-1,-35,454,-2,454],
sm269=[0,-4,0,-4,0,-4,-1,-35,295,-2,295,-39,455],
sm270=[0,-4,0,-4,0,-4,-1,-72,456],
sm271=[0,-4,0,-4,0,-4,-1,-72,457],
sm272=[0,458,458,458,-1,0,-4,0,-4,-1,458,-3,458,-1,458,-14,458,-14,458,-24,458,458,-9,458,-3,458,458,-1,458,-1,458,458,-1,458,458,-1,458,458,458,458,458,-1,458,458,458,458,458,458,-1,458,-2,458,458,-5,458,458,-2,458,-23,458,458,458,458,458,458,458,458,458,458,458,458],
sm273=[0,459,459,459,-1,0,-4,0,-4,-1,459,-3,459,-1,459,-14,459,-14,459,-24,459,459,-9,459,-3,459,459,-1,459,-1,459,459,-1,459,459,-1,459,459,459,459,459,-1,459,459,459,459,459,459,-1,459,-2,459,459,-5,459,459,-2,459,-23,459,459,459,459,459,459,459,459,459,459,459,459],
sm274=[0,-4,0,-4,0,-4,-1,-35,460,-2,461],
sm275=[0,-4,0,-4,0,-4,-1,-38,462],
sm276=[0,-4,0,-4,0,-4,-1,-43,463,-28,463],
sm277=[0,-4,0,-4,0,-4,-1,-35,464,-2,464],
sm278=[0,-4,0,-4,0,-4,-1,-35,465,-2,465],
sm279=[0,-4,0,-4,0,-4,-1,-35,466,-2,466,-39,467],
sm280=[0,-4,0,-4,0,-4,-1,-7,468,-14,468,-12,468,468,-35,468,-2,468],
sm281=[0,469,469,469,-1,0,-4,0,-4,-1,469,-3,469,-1,469,469,-13,469,469,-12,469,469,-1,469,-22,469,469,-9,469,-2,469,469,469,-1,469,-1,469,469,-1,469,469,-1,469,469,469,469,469,-1,469,469,469,469,469,469,-1,469,-2,469,469,-5,469,469,-2,469,-23,469,469,469,469,469,469,469,469,469,469,469,469],
sm282=[0,-4,0,-4,0,-4,-1,-75,470],
sm283=[0,471,471,471,-1,0,-4,0,-4,-1,471,-3,471,-1,471,471,-13,471,471,-12,471,471,-1,471,-22,471,471,471,-8,471,-2,471,471,471,-1,471,-1,471,471,-1,471,471,-1,471,471,471,471,471,-1,471,471,471,471,471,471,-1,471,-2,471,471,-5,471,471,-2,471,-10,471,124,-11,471,471,471,471,471,471,471,471,471,471,471,471],
sm284=[0,472,472,472,-1,0,-4,0,-4,-1,472,-3,472,-1,472,472,-13,472,472,-12,472,472,-1,472,-22,472,472,472,-1,126,-6,472,-2,472,472,472,-1,472,-1,472,472,-1,472,472,-1,472,472,472,472,472,-1,472,472,472,472,472,472,-1,472,-2,472,472,-5,472,472,-2,472,-10,472,472,-11,472,472,472,472,472,472,472,472,472,472,472,472],
sm285=[0,473,473,473,-1,0,-4,0,-4,-1,473,-3,473,-1,473,473,-13,473,473,-12,473,473,-1,473,-22,473,473,473,-1,473,-6,473,-2,473,473,473,-1,473,-1,473,473,-1,473,473,-1,473,473,473,473,473,-1,473,473,473,473,473,473,-1,473,-2,473,473,-5,473,473,-2,473,-10,473,473,128,-10,473,473,473,473,473,473,473,473,473,473,473,473],
sm286=[0,474,474,474,-1,0,-4,0,-4,-1,474,-3,474,-1,474,474,-13,474,474,-12,474,474,-1,474,-22,474,474,474,-1,474,-6,474,-2,474,474,474,-1,474,-1,474,474,-1,474,474,-1,474,474,474,474,474,-1,474,474,474,474,474,474,-1,474,-2,474,474,-5,474,474,-2,474,-10,474,474,474,130,-9,474,474,474,474,474,474,474,474,474,474,474,474],
sm287=[0,475,475,475,-1,0,-4,0,-4,-1,475,-3,475,-1,475,475,-3,132,-9,475,475,-12,475,475,-1,475,-22,475,475,475,-1,475,-6,475,-2,475,475,475,-1,475,-1,475,475,-1,475,475,-1,475,475,475,475,475,-1,475,475,475,475,475,475,-1,475,-2,475,475,-5,475,475,-2,475,-10,475,475,475,475,133,134,135,-6,475,475,475,475,475,475,475,475,475,475,475,475],
sm288=[0,476,476,476,-1,0,-4,0,-4,-1,476,-3,137,-1,476,476,-3,476,-3,138,-5,476,476,-12,476,476,-1,476,-14,139,-2,140,-4,476,476,476,-1,476,-6,476,-2,476,476,476,-1,476,-1,476,476,-1,476,476,-1,476,476,476,476,476,-1,476,476,476,476,476,476,-1,476,-2,476,476,-5,476,476,-2,476,-10,476,476,476,476,476,476,476,141,142,-4,476,476,476,476,476,476,476,476,476,476,476,476],
sm289=[0,477,477,477,-1,0,-4,0,-4,-1,477,-3,477,-1,477,477,-3,477,-3,477,-5,477,477,-12,477,477,-1,477,-14,477,-2,477,-4,477,477,477,-1,477,-6,477,-2,477,477,477,-1,477,-1,477,477,-1,477,477,-1,477,477,477,477,477,-1,477,477,477,477,477,477,-1,477,-2,477,477,-5,477,477,-2,477,-10,477,477,477,477,477,477,477,477,477,144,145,146,-1,477,477,477,477,477,477,477,477,477,477,477,477],
sm290=[0,478,478,478,-1,0,-4,0,-4,-1,478,-3,478,-1,478,478,-3,478,-3,478,-5,478,478,-12,478,478,-1,478,-14,478,-2,478,-4,478,478,478,-1,478,-6,478,-2,478,478,478,-1,478,-1,478,478,-1,478,478,-1,478,478,478,478,478,-1,478,478,478,478,478,478,-1,478,-2,478,478,-5,478,478,-2,478,-10,478,478,478,478,478,478,478,478,478,144,145,146,-1,478,478,478,478,478,478,478,478,478,478,478,478],
sm291=[0,479,479,479,-1,0,-4,0,-4,-1,479,-3,479,-1,479,479,-3,479,-3,479,-5,479,479,-12,479,479,-1,479,-14,479,-2,479,-4,479,479,479,-1,479,-6,479,-2,479,479,479,-1,479,-1,479,479,-1,479,479,-1,479,479,479,479,479,-1,479,479,479,479,479,479,-1,479,-2,479,479,-5,479,479,-2,479,-10,479,479,479,479,479,479,479,479,479,144,145,146,-1,479,479,479,479,479,479,479,479,479,479,479,479],
sm292=[0,480,480,480,-1,0,-4,0,-4,-1,480,-3,480,-1,480,480,-3,480,-3,480,-5,480,480,-12,480,480,-1,480,-14,480,-2,480,-4,148,480,480,-1,480,-6,480,-2,480,149,480,-1,480,-1,480,480,-1,480,480,-1,480,480,480,480,480,-1,480,480,480,480,480,480,-1,480,-2,480,480,-5,480,480,-2,480,-10,480,480,480,480,480,480,480,480,480,480,480,480,-1,480,480,480,480,480,480,480,480,480,480,480,480],
sm293=[0,481,481,481,-1,0,-4,0,-4,-1,481,-3,481,-1,481,481,-3,481,-3,481,-5,481,481,-12,481,481,-1,481,-14,481,-2,481,-4,148,481,481,-1,481,-6,481,-2,481,149,481,-1,481,-1,481,481,-1,481,481,-1,481,481,481,481,481,-1,481,481,481,481,481,481,-1,481,-2,481,481,-5,481,481,-2,481,-10,481,481,481,481,481,481,481,481,481,481,481,481,-1,481,481,481,481,481,481,481,481,481,481,481,481],
sm294=[0,482,482,482,-1,0,-4,0,-4,-1,482,-3,482,-1,482,482,-3,482,-3,482,-5,482,482,-12,482,482,-1,482,-14,482,-2,482,-4,148,482,482,-1,482,-6,482,-2,482,149,482,-1,482,-1,482,482,-1,482,482,-1,482,482,482,482,482,-1,482,482,482,482,482,482,-1,482,-2,482,482,-5,482,482,-2,482,-10,482,482,482,482,482,482,482,482,482,482,482,482,-1,482,482,482,482,482,482,482,482,482,482,482,482],
sm295=[0,483,483,483,-1,0,-4,0,-4,-1,483,-3,483,151,483,483,-3,483,-3,483,-5,483,483,-12,483,483,-1,483,-14,483,152,-1,483,-4,483,483,483,153,483,-6,483,-2,483,483,483,-1,483,-1,483,483,-1,483,483,-1,483,483,483,483,483,-1,483,483,483,483,483,483,-1,483,-2,483,483,-5,483,483,-2,483,-10,483,483,483,483,483,483,483,483,483,483,483,483,-1,483,483,483,483,483,483,483,483,483,483,483,483],
sm296=[0,484,484,484,-1,0,-4,0,-4,-1,484,-3,484,151,484,484,-3,484,-3,484,-5,484,484,-12,484,484,-1,484,-14,484,152,-1,484,-4,484,484,484,153,484,-6,484,-2,484,484,484,-1,484,-1,484,484,-1,484,484,-1,484,484,484,484,484,-1,484,484,484,484,484,484,-1,484,-2,484,484,-5,484,484,-2,484,-10,484,484,484,484,484,484,484,484,484,484,484,484,-1,484,484,484,484,484,484,484,484,484,484,484,484],
sm297=[0,485,485,485,-1,0,-4,0,-4,-1,485,-3,485,485,485,485,-3,485,-3,485,-5,485,485,-12,485,485,-1,485,-14,485,485,-1,485,-4,485,485,485,485,485,-6,485,-2,485,485,485,-1,485,-1,485,485,-1,485,485,-1,485,485,485,485,485,-1,485,485,485,485,485,485,-1,485,-2,485,485,-5,485,485,-2,485,-10,485,485,485,485,485,485,485,485,485,485,485,485,-1,485,485,485,485,485,485,485,485,485,485,485,485],
sm298=[0,486,486,486,-1,0,-4,0,-4,-1,486,-3,486,486,486,486,-3,486,-3,486,-5,486,486,-12,486,486,-1,486,-14,486,486,-1,486,-4,486,486,486,486,486,-6,486,-2,486,486,486,-1,486,-1,486,486,-1,486,486,-1,486,486,486,486,486,-1,486,486,486,486,486,486,-1,486,-2,486,486,-5,486,486,-2,486,-10,486,486,486,486,486,486,486,486,486,486,486,486,-1,486,486,486,486,486,486,486,486,486,486,486,486],
sm299=[0,487,487,487,-1,0,-4,0,-4,-1,487,-3,487,487,487,487,-3,487,-3,487,-5,487,487,-12,487,487,-1,487,-14,487,487,-1,487,-4,487,487,487,487,487,-6,487,-2,487,487,487,-1,487,-1,487,487,-1,487,487,-1,487,487,487,487,487,-1,487,487,487,487,487,487,-1,487,-2,487,487,-5,487,487,-2,487,-10,487,487,487,487,487,487,487,487,487,487,487,487,-1,487,487,487,487,487,487,487,487,487,487,487,487],
sm300=[0,488,488,488,-1,0,-4,0,-4,-1,488,-3,488,488,488,488,-3,488,-3,488,-5,488,488,-12,488,488,-1,488,-14,488,488,-1,488,-4,488,488,488,488,488,-6,488,-2,488,488,488,-1,488,-1,488,488,-1,488,488,-1,488,488,488,488,488,-1,488,488,488,488,488,488,-1,488,-2,488,488,-5,488,488,-2,488,-10,488,488,488,488,488,488,488,488,488,488,488,488,-1,488,488,488,488,488,488,488,488,488,488,488,488],
sm301=[0,-4,0,-4,0,-4,-1,-10,347,-24,440,-2,440],
sm302=[0,-4,0,-4,0,-4,-1,-6,443,-68,443],
sm303=[0,489,489,489,-1,0,-4,0,-4,-1,489,-3,489,489,489,489,-2,489,489,-3,489,-5,489,489,-12,489,489,-1,489,-14,489,489,-1,489,-4,489,489,489,489,489,489,489,-1,489,-2,489,-2,489,489,489,-1,489,-1,489,489,-1,489,489,-1,489,489,489,489,489,489,489,489,489,489,489,489,-1,489,-2,489,489,-5,489,489,-2,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489,489],
sm304=[0,-4,0,-4,0,-4,-1,-22,490],
sm305=[0,-4,0,-4,0,-4,-1,-7,491,-27,492],
sm306=[0,-4,0,-4,0,-4,-1,-7,493],
sm307=[0,494,494,494,-1,0,-4,0,-4,-1,494,-3,494,494,494,494,-2,494,494,-3,494,-5,494,494,-12,494,494,-1,494,-14,494,494,-1,494,-4,494,494,494,494,494,494,494,-1,494,-2,494,-2,494,494,494,-1,494,-1,494,494,-1,494,494,-1,494,494,494,494,494,494,494,494,494,494,494,494,-1,494,-2,494,494,-5,494,494,-2,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494,494],
sm308=[0,-4,0,-4,0,-4,-1,-7,495,-27,496],
sm309=[0,-4,0,-4,0,-4,-1,-7,497,-27,497],
sm310=[0,-4,0,-4,0,-4,-1,-7,498,-27,498],
sm311=[0,-4,0,-4,0,-4,-1,-22,499],
sm312=[0,500,500,500,-1,0,-4,0,-4,-1,500,-3,500,500,500,500,-2,500,500,-3,500,-5,500,500,-12,500,500,-1,500,-14,500,500,-1,500,-4,500,500,500,500,500,500,500,-1,500,-2,500,-2,500,500,500,-1,500,-1,500,500,-1,500,500,-1,500,500,500,500,500,500,500,500,500,500,500,500,-1,500,-2,500,500,-5,500,500,-2,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500],
sm313=[0,501,501,501,-1,0,-4,0,-4,-1,501,-3,501,501,501,501,-2,501,501,-3,501,-5,501,501,-12,501,501,-1,501,-14,501,501,-1,501,-4,501,501,501,501,501,501,501,-1,501,-2,501,-2,501,501,501,-1,501,-1,501,501,-1,501,501,-1,501,501,501,501,501,501,501,501,501,501,501,501,-1,501,-2,501,501,-5,501,501,-2,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501,501],
sm314=[0,502,502,502,-1,0,-4,0,-4,-1,502,-3,502,502,502,502,-2,502,502,-3,502,-5,502,502,-12,502,502,-1,502,-14,502,502,-1,502,-4,502,502,502,502,502,502,502,-1,502,-2,502,-2,502,502,502,-1,502,-1,502,502,-1,502,502,-1,502,502,502,502,502,502,502,502,502,502,502,502,-1,502,-2,502,502,-5,502,502,-2,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502,502],
sm315=[0,503,503,503,-1,0,-4,0,-4,-1,503,-3,503,503,503,503,-2,503,503,-3,503,-5,503,503,-12,503,503,-1,503,-4,503,-9,503,503,-1,503,-4,503,503,503,503,503,503,503,-1,503,-2,503,-2,503,503,503,503,503,-1,503,503,-1,503,503,-1,503,503,503,503,503,503,503,503,503,503,503,503,-1,503,-2,503,503,503,503,-3,503,503,-2,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503,503],
sm316=[0,504,504,504,-1,504,-4,504,-4,504,504,-3,504,504,504,504,-2,504,504,-2,504,504,-5,504,504,-12,504,504,-1,504,-4,504,-9,504,504,-1,504,-4,504,504,504,504,504,504,504,-1,504,-2,504,-2,504,504,504,504,504,-1,504,504,-1,504,504,-1,504,504,504,504,504,504,504,504,504,504,504,504,-1,504,-2,504,504,504,504,-3,504,504,-2,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504,504],
sm317=[0,505,505,505,-1,0,-4,0,-4,-1,505,-3,505,505,505,505,-2,505,505,-3,505,-5,505,505,-12,505,505,-1,505,-14,505,505,-1,505,-4,505,505,505,505,505,505,505,-1,505,-2,505,-2,505,505,505,-1,505,-1,505,505,-1,505,505,-1,505,505,505,505,505,505,505,505,505,505,505,505,-1,505,-2,505,505,-5,505,505,-2,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505,505],
sm318=[0,-1,506,506,-1,506,506,506,506,506,0,-4,-1,-144,506],
sm319=[0,-1,507,507,-1,507,507,507,507,507,0,-4,-1,-145,507],
sm320=[0,508,508,508,-1,0,-4,0,-4,-1,508,-3,508,508,508,508,-2,508,508,-3,508,-5,508,508,-12,508,508,-1,508,-14,508,508,-1,508,-4,508,508,508,508,508,508,508,-1,508,-2,508,-2,508,508,508,-1,508,-1,508,508,-1,508,508,-1,508,508,508,508,508,508,508,508,508,508,508,508,-1,508,-2,508,508,508,-4,508,508,-2,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508],
sm321=[0,-4,0,-4,0,-4,-1,-7,509,-105,510],
sm322=[0,-4,0,-4,0,-4,-1,-7,511],
sm323=[0,-4,0,-4,0,-4,-1,-7,512],
sm324=[0,513,513,513,-1,0,-4,0,-4,-1,513,-3,513,513,513,513,-2,513,513,-3,513,-5,513,513,-12,513,513,-1,513,-14,513,513,-1,513,-4,513,513,513,513,513,513,513,-1,513,-2,513,-2,513,513,513,-1,513,-1,513,513,-1,513,513,-1,513,513,513,513,513,513,513,513,513,513,513,513,-1,513,-2,513,513,-5,513,513,-2,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513,513],
sm325=[0,-4,0,-4,0,-4,-1,-22,514],
sm326=[0,515,515,515,-1,0,-4,0,-4,-1,515,-3,515,-1,515,515,-13,515,515,-12,515,515,-1,515,-22,515,515,-9,515,-2,515,515,515,-1,515,-1,515,515,-1,515,515,-1,515,515,515,515,515,-1,515,515,515,515,515,515,-1,515,-2,515,515,-5,515,515,-2,515,-23,515,515,515,515,515,515,515,515,515,515,515,515],
sm327=[0,516,516,516,-1,0,-4,0,-4,-1,516,-3,516,-1,516,516,-13,516,516,-12,516,516,-1,516,-22,516,516,-9,516,-2,516,516,516,-1,516,-1,516,516,-1,516,516,-1,516,516,516,516,516,-1,516,516,516,516,516,516,-1,516,-2,516,516,-5,516,516,-2,516,-23,516,516,516,516,516,516,516,516,516,516,516,516],
sm328=[0,517,517,517,-1,0,-4,0,-4,-1,517,-1,517,-1,517,-1,517,-14,517,-14,517,-1,517,-22,517,517,-9,517,-3,517,517,-1,517,517,517,517,-1,517,517,517,517,517,517,517,517,-1,517,517,517,517,517,517,517,517,-2,517,517,-5,517,517,-2,517,-23,517,517,517,517,517,517,517,517,517,517,517,517],
sm329=[0,518,518,518,-1,0,-4,0,-4,-1,518,-1,518,-1,518,-1,518,-14,518,-14,518,-1,518,-22,518,518,-9,518,-3,518,518,-1,518,518,518,518,-1,518,518,518,518,518,518,518,518,-1,518,518,518,518,518,518,518,518,-2,518,518,-5,518,518,-2,518,-23,518,518,518,518,518,518,518,518,518,518,518,518],
sm330=[0,519,519,519,-1,0,-4,0,-4,-1,519,-1,519,-1,519,-1,519,-14,519,-14,519,-1,519,-22,519,519,-9,519,-3,519,519,-1,519,519,519,519,-1,519,519,519,519,519,519,519,519,-1,519,519,519,519,519,519,519,519,-2,519,519,-5,519,519,-2,519,-23,519,519,519,519,519,519,519,519,519,519,519,519],
sm331=[0,-4,0,-4,0,-4,-1,-35,520,-36,520],
sm332=[0,-4,0,-4,0,-4,-1,-7,521,-2,521,-11,521,-12,521,-2,521,-17,521,-35,521],
sm333=[0,-4,0,-4,0,-4,-1,-38,522],
sm334=[0,-4,0,-4,0,-4,-1,-35,523,-2,524],
sm335=[0,-4,0,-4,0,-4,-1,-35,525,-2,525],
sm336=[0,-4,0,-4,0,-4,-1,-35,526,-2,526],
sm337=[0,-4,0,-4,0,-4,-1,-75,527],
sm338=[0,-4,0,-4,0,-4,-1,-7,528,-2,347,-11,528,-12,528,-2,528],
sm339=[0,-4,0,-4,0,-4,-1,-7,529,-2,529,-11,529,-12,529,-2,529,-17,529,-35,529],
sm340=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,530,-12,431,216,-40,11,-35,353,-35,45],
sm341=[0,-4,0,-4,0,-4,-1,-22,531],
sm342=[0,-4,0,-4,0,-4,-1,-22,532,-12,533],
sm343=[0,-4,0,-4,0,-4,-1,-22,534,-12,534],
sm344=[0,-4,0,-4,0,-4,-1,-22,535,-12,535],
sm345=[0,-4,0,-4,0,-4,-1,-7,536,-14,536,-12,536,-2,536],
sm346=[0,-4,0,-4,0,-4,-1,-7,536,-2,347,-11,536,-12,536,-2,536],
sm347=[0,-4,0,-4,0,-4,-1,-7,537],
sm348=[0,-4,0,-4,0,-4,-1,-6,538],
sm349=[0,-4,0,-4,0,-4,-1,-7,539],
sm350=[0,-4,0,-4,0,-4,-1,-72,540],
sm351=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-9,541,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm352=[0,-4,0,-4,0,-4,-1,-56,542],
sm353=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-9,543,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm354=[0,-4,0,-4,0,-4,-1,-92,544],
sm355=[0,-4,0,-4,0,-4,-1,-72,545],
sm356=[0,-4,0,-4,0,-4,-1,-4,104,104,-4,105,104,-3,104,-19,104,-17,104,104,-1,104,-4,104,-1,104,104,104,-1,106,-1,107,-2,104,-3,104,-15,546,-22,108,109,110,111,112,113,114,115,116,117,104,104,104,104,104,104,104,104,104,104,104,104,104,-4,118,119],
sm357=[0,-4,0,-4,0,-4,-1,-56,547,-35,546],
sm358=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-29,158,-40,11,-3,13,14,-1,15,-2,548,-16,30,-5,31,32,-2,33,-29,40,41,42,43,44,45],
sm359=[0,-4,0,-4,0,-4,-1,-7,549],
sm360=[0,550,550,550,-1,0,-4,0,-4,-1,550,-1,550,-1,550,-1,550,-14,550,-14,550,-1,550,-22,550,550,-9,550,-3,550,550,-1,550,550,550,550,-1,550,550,550,550,550,550,550,550,-1,550,550,550,550,550,550,550,550,-2,550,550,-5,550,550,-2,550,-23,550,550,550,550,550,550,550,550,550,550,550,550],
sm361=[0,551,551,551,-1,0,-4,0,-4,-1,551,-1,551,-1,551,-1,551,-14,551,-14,551,-1,551,-22,551,551,-9,551,-3,551,551,-1,551,551,551,551,-1,551,551,551,551,551,551,551,551,-1,551,551,551,551,551,551,551,551,-2,551,551,-5,551,551,-2,551,-23,551,551,551,551,551,551,551,551,551,551,551,551],
sm362=[0,552,552,552,-1,0,-4,0,-4,-1,552,-1,552,-1,552,-1,552,-14,552,-14,552,-1,552,-22,552,552,-9,552,-3,552,552,-1,552,552,552,552,-1,552,552,552,552,552,552,552,552,-1,552,552,552,552,552,552,552,552,-2,552,552,-5,552,552,-2,552,-23,552,552,552,552,552,552,552,552,552,552,552,552],
sm363=[0,-4,0,-4,0,-4,-1,-7,553],
sm364=[0,554,554,554,-1,0,-4,0,-4,-1,554,-1,554,-1,554,-1,554,-14,554,-14,554,-1,554,-22,554,554,-9,554,-3,554,554,-1,554,554,554,554,-1,554,554,554,554,554,554,554,554,-1,554,554,554,554,554,554,554,554,-2,554,554,-5,554,554,-2,554,-23,554,554,554,554,554,554,554,554,554,554,554,554],
sm365=[0,555,555,555,-1,0,-4,0,-4,-1,555,-1,555,-1,555,-1,555,-14,555,-14,555,-1,555,-22,555,555,-9,555,-3,555,555,-1,555,555,555,555,-1,555,555,555,555,555,555,555,555,-1,555,555,555,555,555,555,555,555,-1,366,555,555,-5,555,555,-2,555,-23,555,555,555,555,555,555,555,555,555,555,555,555],
sm366=[0,556,556,556,-1,0,-4,0,-4,-1,556,-1,556,-1,556,-1,556,-14,556,-14,556,-1,556,-22,556,556,-9,556,-3,556,556,-1,556,556,556,556,-1,556,556,556,556,556,556,556,556,-1,556,556,556,556,556,556,556,556,-2,556,556,-5,556,556,-2,556,-23,556,556,556,556,556,556,556,556,556,556,556,556],
sm367=[0,-4,0,-4,0,-4,-1,-6,557],
sm368=[0,558,558,558,-1,0,-4,0,-4,-1,558,-1,558,-1,558,558,558,558,-2,558,558,-3,558,-5,558,558,-12,558,558,-1,558,-14,558,558,-1,558,-4,558,558,558,558,558,558,558,-1,558,-2,558,-2,558,558,558,-1,558,558,558,558,-1,558,558,-1,558,558,558,558,558,558,558,558,558,558,558,558,558,558,-2,558,558,-5,558,558,-2,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558,558],
sm369=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,559,-33,371,-4,11,-29,372,281,282,-34,40,41,-3,45],
sm370=[0,-4,0,-4,0,-4,-1,-38,560],
sm371=[0,561,561,561,-1,0,-4,0,-4,-1,561,-1,561,-1,561,561,561,561,-2,561,561,-3,561,-5,561,561,-12,561,561,-1,561,-14,561,561,-1,561,-4,561,561,561,561,561,561,561,-1,561,-2,561,-2,561,561,561,-1,561,561,561,561,-1,561,561,-1,561,561,561,561,561,561,561,561,561,561,561,561,561,561,-2,561,561,-5,561,561,-2,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561,561],
sm372=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,562,-33,371,-4,11,-29,372,281,282,-34,40,41,-3,45],
sm373=[0,-1,563,563,-1,0,-4,0,-4,-1,-21,563,-16,563,-33,563,-4,563,-29,563,563,563,-34,563,563,-3,563],
sm374=[0,-1,564,564,-1,0,-4,0,-4,-1,-21,564,-16,564,-33,564,-4,564,-29,564,564,564,-34,564,564,-3,564],
sm375=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-55,11,-30,281,282,-34,40,41,-3,45],
sm376=[0,-4,0,-4,0,-4,-1,-6,441],
sm377=[0,-4,0,-4,0,-4,-1,-6,443],
sm378=[0,-4,0,-4,0,-4,-1,-36,565],
sm379=[0,-2,2,-1,0,-4,0,-4,-1,-7,566,-13,215,-14,216,-40,11,-35,353,-35,45],
sm380=[0,-4,0,-4,0,-4,-1,-7,567],
sm381=[0,-4,0,-4,0,-4,-1,-36,568],
sm382=[0,-4,0,-4,0,-4,-1,-7,569],
sm383=[0,-4,0,-4,0,-4,-1,-7,569,-27,570],
sm384=[0,-4,0,-4,0,-4,-1,-7,571],
sm385=[0,-4,0,-4,0,-4,-1,-7,572,-27,572],
sm386=[0,-4,0,-4,0,-4,-1,-7,573,-27,573],
sm387=[0,574,574,574,-1,0,-4,0,-4,-1,574,-1,574,-1,574,-1,574,-14,574,-14,574,-1,574,-22,574,574,-9,574,-3,574,574,-1,574,574,574,574,-1,574,574,-1,574,574,574,574,574,-1,574,574,574,574,574,574,574,574,-2,574,574,-5,574,574,-2,574,-23,574,574,574,574,574,574,574,574,574,574,574,574],
sm388=[0,-4,0,-4,0,-4,-1,-35,575,-36,575],
sm389=[0,-4,0,-4,0,-20,576],
sm390=[0,-4,0,-4,0,-7,577,-1,578,-31,578],
sm391=[0,-2,579,-1,0,-4,0,-4,-1,-5,579,-9,579,-128,579,579],
sm392=[0,-2,53,-1,0,-4,0,-4,-1,-6,405,-137,580,581],
sm393=[0,-4,0,-4,0,-4,-1,-145,582],
sm394=[0,-2,583,-1,0,-4,0,-4,-1,-5,583,-4,583,-4,583,-128,583,583],
sm395=[0,-4,0,-4,0,-4,-1,-144,584],
sm396=[0,-2,387,-1,0,-4,0,-7,585,-11,389,-6,390,-14,391,-3,392,-23,393,394,395,-8,396],
sm397=[0,-4,0,-4,0,-7,586],
sm398=[0,-4,0,-4,0,-156,587],
sm399=[0,-4,0,-4,0,-4,-1,-2,588],
sm400=[0,-2,387,-1,0,-4,0,-4,-1,-2,589,-11,389,-6,390,-14,391,-3,392,-23,393,394,395,-8,396],
sm401=[0,-2,387,-1,0,-4,0,-4,-1,-2,590,-11,389,-6,390,-14,391,-3,392,-23,393,394,395,-8,396],
sm402=[0,-2,591,-1,0,-4,0,-4,-1,-2,591,-11,591,-6,591,-14,591,-3,591,-23,591,591,591,-8,591],
sm403=[0,-2,592,-1,0,-4,0,-4,-1,-2,592,-11,592,-6,592,-14,592,-3,592,-23,592,592,592,-5,593,-2,592],
sm404=[0,-4,0,-4,0,-4,-1,594,-38,595,-1,596,-7,597],
sm405=[0,-2,598,-1,0,-4,0,-4,-1,-2,598,-11,598,-6,598,-14,598,-3,598,-23,598,598,598,-8,598],
sm406=[0,-2,599,-1,0,-4,0,-4,-1,-2,599,-11,599,-6,599,-14,599,-3,599,-23,599,599,599,-8,599],
sm407=[0,-4,0,-4,0,-4,-1,-35,600,601],
sm408=[0,-2,387,-1,0,-4,0,-4,-1,-40,392],
sm409=[0,-4,0,-4,0,-4,-1,-35,602,602],
sm410=[0,-2,387,-1,0,-4,0,-4,-1,-7,603,-6,389,604,-5,390,-13,603,603,-24,605,606,607,393,394,395,-8,396],
sm411=[0,-2,608,-1,0,-4,0,-4,-1,-7,608,-6,389,608,-5,390,-13,608,608,-24,608,608,608,608,608,395,-8,396],
sm412=[0,-2,608,-1,0,-4,0,-4,-1,-7,608,-6,608,608,-5,608,-13,608,608,-24,608,608,608,608,608,608,-8,609],
sm413=[0,-2,610,-1,0,-4,0,-4,-1,-7,610,-6,610,610,-5,610,-13,610,610,-24,610,610,610,610,610,610,-8,610],
sm414=[0,-2,387,-1,0,-4,0,-4,-1,-64,611],
sm415=[0,-2,612,-1,0,-4,0,-4,-1,-7,612,-6,612,612,-5,612,-13,612,612,-24,612,612,612,612,613,612,-8,612],
sm416=[0,-2,614,-1,0,-4,0,-4,-1,-7,614,-2,614,-3,614,614,-5,614,614,-12,614,614,-24,614,614,614,614,613,614,614,614,614,-5,614],
sm417=[0,-4,0,-4,0,-4,-1,-65,615],
sm418=[0,-2,616,-1,0,-4,0,-4,-1,-64,616],
sm419=[0,-2,617,-1,618,-4,619,-3,620,-1,-2,620,-1,620,-1,620,620,-2,620,-3,620,620,-5,620,620,-12,620,620,-3,620,-4,620,-7,620,-7,620,620,620,620,620,620,620,620,620,620,620,620,-2,620,621,622],
sm420=[0,-2,623,-1,623,-4,623,-3,623,-1,-2,623,-1,623,-1,623,623,-2,623,-3,623,623,-5,623,623,-12,623,623,-3,623,-4,623,-7,623,-7,623,623,623,623,623,623,623,623,623,623,623,623,-2,623,623,623],
sm421=[0,-2,624,-1,0,-4,0,-4,-1,-7,624,-6,624,624,-5,624,-13,624,624,-24,624,624,624,624,624,624,-8,624],
sm422=[0,-2,625,-1,0,-4,0,-4,-1,-7,625,-6,625,625,-5,625,-13,625,625,-24,625,625,625,625,625,625,-8,625],
sm423=[0,-2,387,-1,0,-4,0,-4,-1],
sm424=[0,-2,387,-1,0,-4,0,-4,-1,-64,626,394],
sm425=[0,-2,387,-1,0,-4,0,-4,-1,-75,627],
sm426=[0,-2,628,-1,0,-4,0,-4,-1,-7,628,-6,628,628,-5,628,-13,628,628,-24,628,628,628,628,628,628,-8,628],
sm427=[0,-2,629,-1,0,-4,0,-4,-1,-7,629,-6,629,629,-5,629,-13,629,629,-24,629,629,629,629,629,629,-8,627],
sm428=[0,-4,0,-4,0,-4,-1,-72,630],
sm429=[0,-4,0,-4,0,-4,-1,-72,631],
sm430=[0,-4,0,-4,0,-4,-1,-72,632],
sm431=[0,-1,1,2,-1,0,-4,0,-7,633,-1,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm432=[0,-4,0,-4,0,-7,634],
sm433=[0,-4,0,-4,0,-157,635],
sm434=[0,-4,0,-4,0,-4,-1,-2,636,-35,636],
sm435=[0,-4,0,-4,0,-4,-1,-2,637,-35,637],
sm436=[0,-1,1,2,-1,0,-4,0,-7,638,-1,79,-1,5,-29,6,-24,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm437=[0,-4,0,-4,0,-7,639],
sm438=[0,-4,0,-4,0,-158,640],
sm439=[0,-1,249,250,-1,251,252,253,254,255,403,-4,-1,-2,641,-1,79,-1,405,-14,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm440=[0,-4,0,-4,0,-4,-1,-15,642],
sm441=[0,-4,0,-4,0,-4,-1,-2,643],
sm442=[0,-2,53,-1,0,-4,0,-4,-1],
sm443=[0,-1,249,250,-1,251,252,253,254,255,403,-4,-1,-2,644,-1,79,-1,405,-14,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm444=[0,-1,645,645,-1,645,645,645,645,645,645,-4,-1,-2,645,-1,645,-1,645,-14,645,-1,645,-1,645,-3,645,-6,645,-134,645],
sm445=[0,-1,646,646,-1,646,646,646,646,646,646,-4,-1,-2,646,-1,646,-1,646,-14,646,-1,646,-1,646,-3,646,-6,646,-134,646],
sm446=[0,-1,647,647,-1,647,647,647,647,647,647,-4,-1,-2,647,-1,647,-1,647,-14,647,-1,647,-1,647,-3,647,-6,647,-134,647],
sm447=[0,-1,648,250,-1,251,252,253,254,255,649,-4,-1,-2,649,-1,78,-1,405,-4,650,-1,651,652,653,-3,654,-1,406,-1,407,-1,408,-3,409,-6,410,-24,655,-2,656,-106,256],
sm448=[0,-1,657,657,-1,658,657,657,657,657,657,-4,-1,-2,657,-1,657,-1,657,-4,657,-1,657,657,657,-3,657,-1,657,-1,657,-1,657,-3,657,-6,657,-24,657,-2,657,-106,657],
sm449=[0,-1,659,659,-1,659,659,659,659,659,659,-4,-1,-2,659,-1,659,-1,659,659,-6,659,-6,659,-1,659,659,659,659,-2,659,-6,659,-1,659,-132,659],
sm450=[0,-1,660,660,-1,660,660,660,660,660,660,-7,660,-1,660,-1,660,660,-6,660,-6,660,-1,660,660,660,660,-2,660,-6,660,-1,660,-132,660],
sm451=[0,-1,249,250,-1,251,252,253,254,255,660,-4,-1,-2,660,-1,660,-1,660,660,-6,660,-6,660,-1,660,660,660,660,-2,660,-6,660,-1,660,-132,256],
sm452=[0,-1,661,661,-1,661,661,661,661,661,661,-4,-1,-2,661,-1,661,-1,661,661,-6,661,-6,661,-1,661,661,661,661,-2,661,-6,661,-1,661,-132,661],
sm453=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-6,405,-14,406,-1,407,-1,408,-3,409,-6,662,-134,256],
sm454=[0,-1,663,663,-1,663,663,663,663,663,663,-4,-1,-2,663,-1,663,-1,663,663,-6,663,-6,663,-1,663,663,663,663,-2,663,-6,663,-1,663,-132,663],
sm455=[0,-1,664,664,-1,664,664,664,664,664,664,-4,-1,-2,664,-1,664,-1,664,664,-6,664,-6,664,-1,664,664,664,664,-2,664,-6,664,-1,664,-132,664],
sm456=[0,-1,665,666,-1,251,252,253,254,255,0,-4,-1,-6,667,-14,668,-1,407,-1,408,-3,409,-6,669,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45,-21,256],
sm457=[0,-1,670,671,672,673,674,675,676,677,0,-4,-1,-14,678],
sm458=[0,-1,679,679,-1,679,679,679,679,679,679,-7,679,-1,679,679,679,679,-6,679,679,-5,679,679,679,679,679,679,-2,679,-6,679,-1,679,-105,679,679,-25,679],
sm459=[0,-4,-1,-4,0,-11,680],
sm460=[0,681,681,681,-1,681,681,681,681,681,681,-4,-1,-2,681,-1,681,-1,681,681,-6,681,-6,681,-1,681,-1,681,-3,681,-6,681,-35,681,-98,681],
sm461=[0,682,682,682,-1,682,682,682,682,682,682,-4,-1,-2,683,-1,682,-1,682,682,-6,682,-6,682,-1,682,-1,682,-3,682,-6,682,-35,682,-98,682],
sm462=[0,-4,0,-4,0,-4,-1,-15,684],
sm463=[0,-4,0,-4,0,-4,-1,269,270,-152,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76],
sm464=[0,-1,685,685,-1,685,685,685,685,685,685,-4,-1,-2,685,-1,685,-1,685,-14,685,-1,685,-1,685,-3,685,-6,685,-134,685],
sm465=[0,-1,686,686,-1,686,686,686,686,686,686,-4,-1,-2,686,-1,686,-1,686,686,-6,686,686,-5,686,-1,686,686,686,686,-2,686,-6,686,-1,686,-132,686],
sm466=[0,-1,687,687,-1,687,687,687,687,687,687,-4,-1,-2,687,-1,687,-1,687,687,-6,687,687,-3,687,-1,687,-1,687,687,687,687,-2,687,-6,687,-1,687,-132,687],
sm467=[0,-2,688,-1,0,-4,0,-4,-1,-5,688,-4,688,-4,688,-6,688,-121,688,688],
sm468=[0,-2,689,-1,689,-4,689,-4,-1,-5,689,-4,689,-4,689,-6,689,-52,689,689,689,-66,689,689],
sm469=[0,-4,0,-4,0,-43,690],
sm470=[0,-4,0,-4,0,-43,691],
sm471=[0,-4,0,-4,0,-4,-1,-22,692,-12,431],
sm472=[0,693,693,693,-1,0,-4,0,-4,-1,693,-3,693,693,693,693,-2,693,693,-3,693,-5,693,693,-12,693,693,-1,693,-14,693,693,-1,693,-4,693,693,693,693,693,693,693,-1,693,-2,693,-2,693,693,693,-1,693,-1,693,693,-1,693,693,-1,693,693,693,693,693,693,693,693,693,693,693,693,-1,693,-2,693,693,-5,693,693,-2,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693,693],
sm473=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,434,-12,276,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,277,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm474=[0,694,694,694,-1,0,-4,0,-4,-1,694,-3,694,694,694,694,-2,694,694,-3,694,-5,694,694,-12,694,694,-1,694,-14,694,694,-1,694,-4,694,694,694,694,694,694,694,-1,694,-2,694,-2,694,694,694,-1,694,-1,694,694,-1,694,694,-1,694,694,694,694,694,694,694,694,694,694,694,694,-1,694,-2,694,694,-5,694,694,-2,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694,694],
sm475=[0,-4,0,-4,0,-4,-1,-22,695,-12,695],
sm476=[0,-1,696,696,-1,0,-4,0,-4,-1,-6,696,-14,696,696,-12,696,696,-24,696,696,-13,696,696,-3,696,696,-8,696,-18,696,696,-1,696,696,-23,696,696,696,696,696,696,696,696,696,696,696,696],
sm477=[0,-4,0,-4,0,-4,-1,-22,697,-12,697],
sm478=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,698,-38,11,-30,281,282,-3,283,-30,40,41,-3,45],
sm479=[0,699,699,699,-1,0,-4,0,-4,-1,699,-3,699,699,699,699,-2,699,699,-3,699,-5,699,699,-12,699,699,-1,699,-14,699,699,-1,699,-4,699,699,699,699,699,699,699,-1,699,-2,699,-2,699,699,699,-1,699,-1,699,699,-1,699,699,-1,699,699,699,699,699,699,699,699,699,699,699,699,-1,699,-2,699,699,-5,699,699,-2,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699,699],
sm480=[0,700,700,700,-1,0,-4,0,-4,-1,700,-3,700,700,700,700,-2,700,700,-3,700,-5,700,700,-12,700,700,-1,700,-14,700,700,-1,700,-4,700,700,700,700,700,700,700,-1,700,-2,700,-2,700,700,700,-1,700,-1,700,700,-1,700,700,-1,700,700,700,700,700,700,700,700,700,700,700,700,-1,700,-2,700,700,-5,700,700,-2,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700,700],
sm481=[0,-4,0,-4,0,-4,-1,-35,701,-2,701],
sm482=[0,-4,0,-4,0,-4,-1,-35,702,-2,702],
sm483=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,-14,216,-40,11,-35,353,-35,45],
sm484=[0,-4,0,-4,0,-4,-1,-6,703],
sm485=[0,-4,0,-4,0,-4,-1,-6,704],
sm486=[0,-4,0,-4,0,-4,-1,-22,705,-12,433],
sm487=[0,706,706,706,-1,0,-4,0,-4,-1,706,-3,706,-1,706,-14,706,-14,706,-24,706,706,-9,706,-3,706,706,-1,706,-1,706,706,-1,706,706,-1,706,706,706,706,706,-1,706,706,706,706,706,706,-1,706,-2,706,706,-5,706,706,-2,706,-23,706,706,706,706,706,706,706,706,706,706,706,706],
sm488=[0,-4,0,-4,0,-4,-1,-72,707],
sm489=[0,-4,0,-4,0,-4,-1,-43,708],
sm490=[0,-4,0,-4,0,-4,-1,-43,709],
sm491=[0,-2,2,-1,0,-4,0,-4,-1,-38,710,-38,11,-71,45],
sm492=[0,-4,0,-4,0,-4,-1,-43,711],
sm493=[0,-4,0,-4,0,-4,-1,-43,712],
sm494=[0,713,713,713,-1,0,-4,0,-4,-1,713,-3,713,-1,713,-14,713,-14,713,-24,713,713,-9,713,-3,713,713,-1,713,-1,713,713,-1,713,713,-1,713,713,713,713,713,-1,713,713,713,713,713,713,-1,713,-2,713,713,-5,713,713,-2,713,-23,713,713,713,713,713,713,713,713,713,713,713,713],
sm495=[0,714,714,714,-1,0,-4,0,-4,-1,714,-3,714,-1,714,-14,714,-14,714,-24,714,714,-9,714,-3,714,714,-1,714,-1,714,714,-1,714,714,-1,714,714,714,714,714,-1,714,714,714,714,714,714,-1,714,-2,714,714,-5,714,714,-2,714,-23,714,714,714,714,714,714,714,714,714,714,714,714],
sm496=[0,-2,2,-1,0,-4,0,-4,-1,-38,715,-38,11,-71,45],
sm497=[0,-4,0,-4,0,-4,-1,-43,716,-28,716],
sm498=[0,-4,0,-4,0,-4,-1,-43,717,-28,717],
sm499=[0,-4,0,-4,0,-4,-1,-22,705],
sm500=[0,718,718,718,-1,0,-4,0,-4,-1,718,-3,718,718,718,718,-2,718,718,-3,718,-5,718,718,-12,718,718,-1,718,-14,718,718,-1,718,-4,718,718,718,718,718,718,718,-1,718,-2,718,-2,718,718,718,-1,718,-1,718,718,-1,718,718,-1,718,718,718,718,718,718,718,718,718,718,718,718,-1,718,-2,718,718,-5,718,718,-2,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718,718],
sm501=[0,-4,0,-4,0,-4,-1,-7,719],
sm502=[0,720,720,720,-1,0,-4,0,-4,-1,720,-3,720,720,720,720,-2,720,720,-3,720,-5,720,720,-12,720,720,-1,720,-14,720,720,-1,720,-4,720,720,720,720,720,720,720,-1,720,-2,720,-2,720,720,720,-1,720,-1,720,720,-1,720,720,-1,720,720,720,720,720,720,720,720,720,720,720,720,-1,720,-2,720,720,-5,720,720,-2,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720,720],
sm503=[0,721,721,721,-1,0,-4,0,-4,-1,721,-3,721,721,721,721,-2,721,721,-3,721,-5,721,721,-12,721,721,-1,721,-14,721,721,-1,721,-4,721,721,721,721,721,721,721,-1,721,-2,721,-2,721,721,721,-1,721,-1,721,721,-1,721,721,-1,721,721,721,721,721,721,721,721,721,721,721,721,-1,721,-2,721,721,-5,721,721,-2,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721,721],
sm504=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,321,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm505=[0,-4,0,-4,0,-4,-1,-7,722,-27,722],
sm506=[0,723,723,723,-1,0,-4,0,-4,-1,723,-3,723,723,723,723,-2,723,723,-3,723,-5,723,723,-12,723,723,-1,723,-14,723,723,-1,723,-4,723,723,723,723,723,723,723,-1,723,-2,723,-2,723,723,723,-1,723,-1,723,723,-1,723,723,-1,723,723,723,723,723,723,723,723,723,723,723,723,-1,723,-2,723,723,-5,723,723,-2,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723,723],
sm507=[0,724,724,724,-1,0,-4,0,-4,-1,724,-3,724,724,724,724,-2,724,724,-3,724,-5,724,724,-12,724,724,-1,724,-14,724,724,-1,724,-4,724,724,724,724,724,724,724,-1,724,-2,724,-2,724,724,724,-1,724,-1,724,724,-1,724,724,-1,724,724,724,724,724,724,724,724,724,724,724,724,-1,724,-2,724,724,724,-4,724,724,-2,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724,724],
sm508=[0,725,725,725,-1,0,-4,0,-4,-1,725,-3,725,725,725,725,-2,725,725,-3,725,-5,725,725,-12,725,725,-1,725,-14,725,725,-1,725,-4,725,725,725,725,725,725,725,-1,725,-2,725,-2,725,725,725,-1,725,-1,725,725,-1,725,725,-1,725,725,725,725,725,725,725,725,725,725,725,725,-1,725,-2,725,725,725,-4,725,725,-2,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725,725],
sm509=[0,726,726,726,-1,0,-4,0,-4,-1,726,-3,726,726,726,726,-2,726,726,-3,726,-5,726,726,-12,726,726,-1,726,-14,726,726,-1,726,-4,726,726,726,726,726,726,726,-1,726,-2,726,-2,726,726,726,-1,726,-1,726,726,-1,726,726,-1,726,726,726,726,726,726,726,726,726,726,726,726,-1,726,-2,726,726,-5,726,726,-2,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726,726],
sm510=[0,-4,0,-4,0,-4,-1,-38,727],
sm511=[0,-4,0,-4,0,-4,-1,-38,728],
sm512=[0,-4,0,-4,0,-4,-1,-35,729,-36,729],
sm513=[0,-4,0,-4,0,-4,-1,-7,730,-14,730,-12,730,-2,730,-33,730],
sm514=[0,-4,0,-4,0,-4,-1,-7,731,-2,731,-11,731,-12,731,-2,731,-17,731,-35,731],
sm515=[0,-1,1,2,-1,0,-4,0,-4,-1,-21,309,-16,732,-38,11,-35,351,-30,40,41,-3,45],
sm516=[0,-4,0,-4,0,-4,-1,-38,733],
sm517=[0,-4,0,-4,0,-4,-1,-7,734,-14,734,-12,734,-2,734],
sm518=[0,-4,0,-4,0,-4,-1,-22,735],
sm519=[0,-4,0,-4,0,-4,-1,-7,736,-2,736,-11,736,-12,736,-2,736,-17,736,-35,736],
sm520=[0,-4,0,-4,0,-4,-1,-22,737,-12,737],
sm521=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,738,-12,276,216,-40,11,-35,353,-35,45],
sm522=[0,-4,0,-4,0,-4,-1,-7,739,-14,739],
sm523=[0,-4,0,-4,0,-4,-1,-7,740,-14,740,-12,740,-2,740],
sm524=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-14,158,-24,7,8,-9,741,-3,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm525=[0,-4,0,-4,0,-4,-1,-72,742],
sm526=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,743,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm527=[0,-4,0,-4,0,-4,-1,-72,744],
sm528=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,745,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm529=[0,-4,0,-4,0,-4,-1,-35,344,-36,746],
sm530=[0,-4,0,-4,0,-4,-1,-56,747,-35,748],
sm531=[0,-4,0,-4,0,-4,-1,-10,347,-24,348,-20,749,-15,348,-19,749],
sm532=[0,-4,0,-4,0,-4,-1,-10,347,-45,749,-35,749],
sm533=[0,-4,0,-4,0,-4,-1,-56,750,-35,750],
sm534=[0,-4,0,-4,0,-4,-1,-92,751],
sm535=[0,-4,0,-4,0,-4,-1,-92,546],
sm536=[0,-4,0,-4,0,-4,-1,-36,752],
sm537=[0,753,753,753,-1,0,-4,0,-4,-1,753,-1,753,-1,753,-1,753,-14,753,-14,753,-1,753,-22,753,753,-9,753,-3,753,753,-1,753,753,753,753,-1,753,753,753,753,753,753,753,753,-1,753,753,753,753,753,753,753,753,-2,753,753,-5,753,753,-2,753,-23,753,753,753,753,753,753,753,753,753,753,753,753],
sm538=[0,754,754,754,-1,0,-4,0,-4,-1,754,-1,754,-1,754,-1,754,-14,754,-14,754,-1,754,-22,754,754,-9,754,-3,754,754,-1,754,754,754,754,-1,754,754,754,754,754,754,754,754,-1,754,754,754,754,754,754,754,754,-2,754,754,-5,754,754,-2,754,-23,754,754,754,754,754,754,754,754,754,754,754,754],
sm539=[0,-4,0,-4,0,-4,-1,-38,755],
sm540=[0,756,756,756,-1,0,-4,0,-4,-1,756,-1,756,-1,756,756,756,756,-2,756,756,-3,756,-5,756,756,-12,756,756,-1,756,-14,756,756,-1,756,-4,756,756,756,756,756,756,756,-1,756,-2,756,-2,756,756,756,-1,756,756,756,756,-1,756,756,-1,756,756,756,756,756,756,756,756,756,756,756,756,756,756,-2,756,756,-5,756,756,-2,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756,756],
sm541=[0,757,757,757,-1,0,-4,0,-4,-1,757,-1,757,-1,757,757,757,757,-2,757,757,-3,757,-5,757,757,-12,757,757,-1,757,-14,757,757,-1,757,-4,757,757,757,757,757,757,757,-1,757,-2,757,-2,757,757,757,-1,757,757,757,757,-1,757,757,-1,757,757,757,757,757,757,757,757,757,757,757,757,757,757,-2,757,757,-5,757,757,-2,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757,757],
sm542=[0,-1,758,758,-1,0,-4,0,-4,-1,-21,758,-16,758,-33,758,-4,758,-29,758,758,758,-34,758,758,-3,758],
sm543=[0,-1,759,759,-1,0,-4,0,-4,-1,-21,759,-16,759,-33,759,-4,759,-29,759,759,759,-34,759,759,-3,759],
sm544=[0,-4,0,-4,0,-4,-1,-7,760],
sm545=[0,-4,0,-4,0,-4,-1,-36,761],
sm546=[0,-4,0,-4,0,-4,-1,-36,762],
sm547=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,763,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm548=[0,-2,2,-1,0,-4,0,-4,-1,-7,764,-13,215,-14,216,-40,11,-35,353,-35,45],
sm549=[0,-4,0,-4,0,-4,-1,-35,765,-36,765],
sm550=[0,-4,0,-4,0,-7,577,-1,766,-31,766],
sm551=[0,-4,0,-4,0,-9,766,-31,766],
sm552=[0,-4,0,-4,0,-5,767,768],
sm553=[0,-2,769,-1,0,-4,0,-4,-1,-5,769,-9,769,-128,769,769],
sm554=[0,-2,770,-1,0,-4,0,-10,770,-9,770,-6,770,-121,770,770],
sm555=[0,-2,771,-1,772,773,774,775,776,0,-3,777,-7,405],
sm556=[0,-2,770,-1,0,-4,0,-4,-1,-5,770,-9,770,-6,770,-121,770,770],
sm557=[0,-2,771,-1,772,773,774,775,776,0,-3,777,-1],
sm558=[0,-2,778,-1,0,-4,0,-4,-1,-5,778,-4,778,-4,778,-128,778,778],
sm559=[0,-4,0,-4,0,-7,779],
sm560=[0,-4,0,-4,0,-156,780],
sm561=[0,-4,0,-4,0,-156,781],
sm562=[0,-4,0,-4,0,-20,782],
sm563=[0,-2,387,-1,0,-4,0,-4,-1,-2,783,-11,389,-6,390,-14,391,-3,392,-23,393,394,395,-8,396],
sm564=[0,-2,784,-1,0,-4,0,-4,-1,-2,784,-11,784,-6,784,-14,784,-3,784,-23,784,784,784,-8,784],
sm565=[0,-2,785,-1,0,-4,0,-4,-1,-2,785,-11,785,-6,785,-14,785,-3,785,-23,785,785,785,-8,785],
sm566=[0,-4,0,-4,0,-4,-1,-72,593],
sm567=[0,-2,786,-1,0,-4,0,-4,-1,-2,786,-11,786,-6,786,-14,786,-1,786,-1,786,-23,786,786,786,-5,786,-2,786],
sm568=[0,-4,787,-4,0,-4,-1,-58,788,-85,789,790],
sm569=[0,-2,387,-1,0,-4,0,-4,-1,-6,791,-40,792,-2,793],
sm570=[0,-4,0,-4,0,-4,-1,-42,794,-101,789,790],
sm571=[0,-2,387,-1,0,-4,0,-4,795,-6,796,-40,797],
sm572=[0,-2,387,-1,0,-4,0,-4,-1,-14,389,-6,390,-42,393,394,395,-8,396],
sm573=[0,-2,387,-1,0,-4,0,-4,-1,-38,798,-1,392,-31,799],
sm574=[0,-2,800,-1,0,-4,0,-4,-1,-38,800,-1,800,-31,801],
sm575=[0,-2,800,-1,0,-4,0,-4,-1,-38,800,-1,800,-31,800],
sm576=[0,-2,802,-1,0,-4,0,-4,-1,-38,802,-1,802,-31,802],
sm577=[0,-2,803,-1,0,-4,0,-4,-1,-38,803,-1,803,-31,803],
sm578=[0,-4,0,-4,0,-4,-1,-75,804],
sm579=[0,-2,387,-1,0,-4,0,-4,-1,-7,805,-6,389,604,-5,390,-13,805,805,-24,605,606,607,393,394,395,-8,396],
sm580=[0,-2,806,-1,0,-4,0,-4,-1,-7,806,-6,806,806,-5,806,-13,806,806,-24,806,806,806,806,806,806,-8,806],
sm581=[0,-2,807,-1,0,-4,0,-4,-1,-7,807,-6,807,807,-5,807,-13,807,807,-24,807,807,807,807,807,807,-8,807],
sm582=[0,-2,808,-1,0,-4,0,-4,-1,-14,808,-6,808,-42,808,808,808,-8,808],
sm583=[0,-2,809,-1,0,-4,0,-4,-1,-7,809,-6,389,809,-5,390,-13,809,809,-24,809,809,809,809,809,395,-8,396],
sm584=[0,-2,809,-1,0,-4,0,-4,-1,-7,809,-6,809,809,-5,809,-13,809,809,-24,809,809,809,809,809,809,-8,609],
sm585=[0,-2,810,-1,0,-4,0,-4,-1,-7,810,-6,810,810,-5,810,-13,810,810,-24,810,810,810,810,810,810,-8,810],
sm586=[0,-2,811,-1,0,-4,0,-4,-1,-7,811,-6,811,811,-5,811,-13,811,811,-24,811,811,811,811,811,811,-8,811],
sm587=[0,-4,0,-4,0,-4,-1,-75,627],
sm588=[0,-2,812,-1,0,-4,0,-4,-1,-7,812,-6,812,812,-5,812,-13,812,812,-24,812,812,812,812,812,812,-8,812],
sm589=[0,-2,813,-1,0,-4,0,-4,-1,-7,813,-2,813,-3,813,813,-5,813,813,-12,813,813,-24,813,813,813,813,813,813,813,813,813,-5,813],
sm590=[0,-2,814,-1,0,-4,0,-4,-1,-64,814],
sm591=[0,-2,617,-1,618,-4,619,-3,815,-1,-2,815,-1,815,-1,815,815,-2,815,-3,815,815,-5,815,815,-12,815,815,-3,815,-4,815,-7,815,-7,815,815,815,815,815,815,815,815,815,815,815,815,-2,815,621,622],
sm592=[0,-2,816,-1,816,-4,0,-3,816,-1,-2,816,-1,816,-1,816,816,-2,816,-3,816,816,-5,816,816,-12,816,816,-3,816,-4,816,-7,816,-7,816,816,816,816,816,816,816,816,816,816,816,816,-2,816],
sm593=[0,-2,817,-1,817,-4,817,-3,817,-1,-2,817,-1,817,-1,817,817,-2,817,-3,817,817,-5,817,817,-12,817,817,-3,817,-4,817,-7,817,-7,817,817,817,817,817,817,817,817,817,817,817,817,-2,817,817,817],
sm594=[0,-2,818,-1,818,-4,818,-3,818,-1,-2,818,-1,818,-1,818,818,-2,818,-3,818,818,-5,818,818,-12,818,818,-3,818,-4,818,-7,818,-7,818,818,818,818,818,818,818,818,818,818,818,818,-2,818,818,818],
sm595=[0,-2,819,-1,819,-4,0,-3,819,-1,-2,819,-1,819,-1,819,819,-2,819,-3,819,819,-5,819,819,-12,819,819,-3,819,-4,819,-7,819,-7,819,819,819,819,819,819,819,819,819,819,819,819,-2,819],
sm596=[0,-2,820,-1,0,-4,0,-4,-1,-7,820,-6,820,820,-5,820,-13,820,820,-24,820,820,820,820,820,820,-8,820],
sm597=[0,-2,821,-1,0,-4,0,-4,-1,-7,821,-6,821,821,-5,821,-13,821,821,-24,821,821,821,821,821,821,-8,821],
sm598=[0,-4,0,-4,0,-4,-1,-10,822,-11,823,-39,824,-4,825,826,827],
sm599=[0,-4,0,-4,0,-4,-1,-65,613],
sm600=[0,-2,828,-1,0,-4,0,-4,-1,-6,829,828,-6,828,828,-5,828,-13,828,828,-24,828,828,828,828,828,828,-8,828],
sm601=[0,-2,830,-1,0,-4,0,-4,-1,-7,830,-6,830,830,-5,830,-13,830,830,-24,830,830,830,830,830,830,-8,830],
sm602=[0,-2,831,-1,0,-4,0,-4,-1,-7,831,-6,831,831,-5,831,-13,831,831,-24,831,831,831,831,831,831,-8,627],
sm603=[0,-2,832,-1,0,-4,0,-4,-1,-7,832,-6,832,832,-5,832,-13,832,832,-24,832,832,832,832,832,832,-8,832],
sm604=[0,-4,0,-4,0,-7,833],
sm605=[0,-4,0,-4,0,-157,834],
sm606=[0,-4,0,-4,0,-157,835],
sm607=[0,-4,0,-4,0,-20,836],
sm608=[0,-4,0,-4,0,-7,837],
sm609=[0,-4,0,-4,0,-158,838],
sm610=[0,-4,0,-4,0,-158,839],
sm611=[0,-4,0,-4,0,-20,840],
sm612=[0,-4,0,-4,0,-4,-1,-2,841],
sm613=[0,842,842,842,-1,842,842,842,842,842,842,-4,-1,-2,842,-1,842,-1,842,842,-6,842,-6,842,-1,842,-1,842,-3,842,-6,842,-35,842,-98,842],
sm614=[0,-4,0,-4,0,-4,-1,-15,843],
sm615=[0,-1,844,844,-1,844,844,844,844,844,844,-4,-1,-2,844,-1,844,-1,844,-14,844,-1,844,-1,844,-3,844,-6,844,-134,844],
sm616=[0,-1,845,845,-1,845,845,845,845,845,845,-4,-1,-2,845,-1,845,-1,845,-14,845,-1,845,-1,845,-3,845,-6,845,-134,845],
sm617=[0,-1,846,846,-1,846,846,846,846,846,846,-4,-1,-2,846,-1,846,-1,846,-14,846,-1,846,-1,846,-3,846,-6,846,-134,846],
sm618=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-4,78,-1,405,-7,847,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm619=[0,-1,848,848,-1,848,848,848,848,848,0,-4,-1,-4,848,-1,848,-7,848,-6,848,-1,848,-1,848,-3,848,-6,848,-134,848],
sm620=[0,-1,249,250,-1,849,252,253,254,255,0,-4,-1,-4,78,-1,405,-7,652,653,-5,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm621=[0,-1,850,850,-1,850,850,850,850,850,0,-4,-1,-4,850,-1,850,-7,850,850,-5,850,-1,850,-1,850,-3,850,-6,850,-134,850],
sm622=[0,-4,851,-4,0,-4,-1],
sm623=[0,-2,852,-1,0,-4,853,-4,-1],
sm624=[0,-1,648,250,-1,854,252,253,254,255,0,-4,-1,-4,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-24,655,-2,656,-106,256],
sm625=[0,-1,855,855,-1,855,855,855,855,855,0,-4,-1,-4,855,-1,855,-7,855,-6,855,-1,855,-1,855,-3,855,-6,855,-24,855,-2,855,-106,855],
sm626=[0,-4,856,-4,0,-4,-1],
sm627=[0,-4,857,-4,0,-4,-1],
sm628=[0,-1,420,420,-1,420,420,420,420,420,420,-4,-1,-2,420,-1,420,-1,420,-7,420,-6,420,-1,420,-1,420,-3,420,-6,420,-134,420],
sm629=[0,-1,249,250,-1,251,252,253,254,255,858,-4,-1,-2,858,-1,78,-1,405,-14,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm630=[0,-1,859,859,-1,859,859,859,859,859,859,-4,-1,-2,859,-1,859,-1,859,-3,860,861,-9,859,-1,859,-1,859,-3,859,-6,859,-134,859],
sm631=[0,-1,859,859,-1,859,859,859,859,859,859,-4,-1,-2,859,-1,859,-1,859,-6,862,-7,859,-1,859,-1,859,-3,859,-6,859,-39,863,-94,859],
sm632=[0,-1,864,864,-1,865,864,864,864,864,864,-4,-1,-2,864,-1,864,-1,864,-4,864,-1,864,864,864,-3,864,-1,864,-1,864,-1,864,-3,864,-6,864,-24,864,-2,864,-106,864],
sm633=[0,-1,866,866,-1,866,866,866,866,866,866,-4,-1,-2,866,-1,866,-1,866,-4,866,-1,866,866,866,-3,866,-1,866,-1,866,-1,866,-3,866,-6,866,-24,866,-2,866,-106,866],
sm634=[0,-4,0,-4,0,-4,-1,-22,867],
sm635=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-6,405,-14,406,-1,407,868,408,-3,409,-6,662,-134,256],
sm636=[0,-1,869,869,-1,869,869,869,869,869,0,-4,-1,-6,869,-14,869,-1,869,869,869,869,-2,869,-6,869,-1,869,-132,869],
sm637=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-6,405,-14,406,-1,407,-1,408,870,-2,409,-6,662,-134,256],
sm638=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-6,405,-14,406,-1,407,-1,408,-3,409,-6,662,-1,871,-132,256],
sm639=[0,-1,1,872,-1,0,-4,0,-4,-1,-6,667,-14,80,275,-12,276,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,277,33,-23,34,35,36,37,38,39,873,874,42,43,44,45],
sm640=[0,-1,665,666,-1,251,252,253,254,255,0,-4,-1,-6,405,-14,875,-1,407,-1,408,-3,409,-5,279,662,-1,280,-38,11,-30,281,282,-3,283,-30,40,41,-3,45,-21,256],
sm641=[0,-1,1,2,-1,-1,-4,0,-11,876,207,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm642=[0,-1,186,186,-1,186,420,420,420,420,186,-4,186,-4,186,186,186,-3,186,186,-2,186,186,-5,186,-1,420,-1,420,-3,420,-5,186,186,-1,186,-14,186,186,-1,186,-4,186,-1,186,186,186,186,186,-1,186,-5,186,186,186,-27,186,-9,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,-4,186,186,-5,186,-21,420],
sm643=[0,-1,420,420,-1,420,420,420,420,420,0,-4,-1,-4,206,206,206,-3,206,206,-3,206,-5,206,-1,420,-1,420,-3,420,-5,206,206,-1,420,-14,206,206,-1,206,-4,206,-1,206,206,206,206,206,-1,206,-5,206,206,-38,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,-4,206,206,-27,420],
sm644=[0,-4,0,-4,0,-4,-1,-29,877],
sm645=[0,-1,670,671,672,673,674,675,676,677,0,-4,-1,-14,678,-14,878],
sm646=[0,-1,879,879,879,879,879,879,879,879,0,-4,-1,-14,879,-14,879],
sm647=[0,-1,880,880,880,880,880,880,880,880,0,-4,-1,-14,880,-14,880],
sm648=[0,-4,0,-4,0,-4,-1,-15,881],
sm649=[0,-4,0,-4,0,-43,882],
sm650=[0,883,883,883,-1,883,883,883,883,883,883,-7,883,-1,883,-1,883,883,-6,883,-6,883,-1,883,-1,883,-3,883,-6,883,-35,883,-98,883],
sm651=[0,884,884,884,-1,0,-4,0,-4,-1,884,-3,884,884,884,884,-2,884,884,-3,884,-5,884,884,-12,884,884,-1,884,-14,884,884,-1,884,-4,884,884,884,884,884,884,884,-1,884,-2,884,-2,884,884,884,-1,884,-1,884,884,-1,884,884,-1,884,884,884,884,884,884,884,884,884,884,884,884,-1,884,-2,884,884,-5,884,884,-2,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884,884],
sm652=[0,-4,0,-4,0,-4,-1,-22,885,-12,885],
sm653=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,-14,80,-13,431,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm654=[0,886,886,886,-1,0,-4,0,-4,-1,886,-3,886,886,886,886,-2,886,886,-3,886,-5,886,886,-12,886,886,-1,886,-14,886,886,-1,886,-4,886,886,886,886,886,886,886,-1,886,-2,886,-2,886,886,886,-1,886,-1,886,886,-1,886,886,-1,886,886,886,886,886,886,886,886,886,886,886,886,-1,886,-2,886,886,-5,886,886,-2,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886,886],
sm655=[0,-4,0,-4,0,-4,-1,-35,887,-2,887],
sm656=[0,-4,0,-4,0,-4,-1,-35,888,-2,888],
sm657=[0,-4,0,-4,0,-4,-1,-7,889],
sm658=[0,-4,0,-4,0,-4,-1,-7,890],
sm659=[0,-4,0,-4,0,-4,-1,-7,891],
sm660=[0,-4,0,-4,0,-4,-1,-6,892,-68,892],
sm661=[0,-4,0,-4,0,-4,-1,-43,893],
sm662=[0,-4,0,-4,0,-4,-1,-35,894,-2,894],
sm663=[0,-4,0,-4,0,-4,-1,-35,895,-2,895],
sm664=[0,-4,0,-4,0,-4,-1,-43,896,-28,896],
sm665=[0,-4,0,-4,0,-4,-1,-35,897,-2,897],
sm666=[0,-4,0,-4,0,-4,-1,-35,898,-2,898],
sm667=[0,899,899,899,-1,0,-4,0,-4,-1,899,-3,899,-1,899,899,-13,899,899,-12,899,899,-1,899,-22,899,899,-9,899,-2,899,899,899,-1,899,-1,899,899,-1,899,899,-1,899,899,899,899,899,-1,899,899,899,899,899,899,-1,899,-2,899,899,-5,899,899,-2,899,-23,899,899,899,899,899,899,899,899,899,899,899,899],
sm668=[0,900,900,900,-1,0,-4,0,-4,-1,900,-3,900,900,900,900,-2,900,900,-3,900,-5,900,900,-12,900,900,-1,900,-14,900,900,-1,900,-4,900,900,900,900,900,900,900,-1,900,-2,900,-2,900,900,900,-1,900,-1,900,900,-1,900,900,-1,900,900,900,900,900,900,900,900,900,900,900,900,-1,900,-2,900,900,-5,900,900,-2,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
sm669=[0,-4,0,-4,0,-4,-1,-7,901,-27,901],
sm670=[0,-4,0,-4,0,-4,-1,-7,902],
sm671=[0,-4,0,-4,0,-4,-1,-7,903],
sm672=[0,904,904,904,-1,0,-4,0,-4,-1,904,-3,904,-1,904,904,-13,904,904,-12,904,904,-1,904,-22,904,904,-9,904,-2,904,904,904,-1,904,-1,904,904,-1,904,904,-1,904,904,904,904,904,-1,904,904,904,904,904,904,-1,904,-2,904,904,-5,904,904,-2,904,-23,904,904,904,904,904,904,904,904,904,904,904,904],
sm673=[0,-4,0,-4,0,-4,-1,-38,905],
sm674=[0,-4,0,-4,0,-4,-1,-7,906,-2,906,-11,906,-12,906,-2,906,-17,906,-35,906],
sm675=[0,-4,0,-4,0,-4,-1,-35,907,-2,907],
sm676=[0,-4,0,-4,0,-4,-1,-35,908,-2,908],
sm677=[0,-4,0,-4,0,-4,-1,-7,909,-2,909,-11,909,-12,909,-2,909,-17,909,-35,909],
sm678=[0,-2,2,-1,0,-4,0,-4,-1,-21,215,910,-12,431,216,-40,11,-35,353,-35,45],
sm679=[0,-4,0,-4,0,-4,-1,-22,911],
sm680=[0,-4,0,-4,0,-4,-1,-22,912,-12,912],
sm681=[0,913,913,913,-1,0,-4,0,-4,-1,913,-1,913,-1,913,-1,913,-14,913,-14,913,-1,913,-22,913,913,-9,913,-3,913,913,-1,913,913,913,913,-1,913,913,914,913,913,913,913,913,-1,913,913,913,913,913,913,913,913,-2,913,913,-5,913,913,-2,913,-23,913,913,913,913,913,913,913,913,913,913,913,913],
sm682=[0,-4,0,-4,0,-4,-1,-7,915],
sm683=[0,916,916,916,-1,0,-4,0,-4,-1,916,-1,916,-1,916,-1,916,-14,916,-14,916,-1,916,-22,916,916,-9,916,-3,916,916,-1,916,916,916,916,-1,916,916,916,916,916,916,916,916,-1,916,916,916,916,916,916,916,916,-2,916,916,-5,916,916,-2,916,-23,916,916,916,916,916,916,916,916,916,916,916,916],
sm684=[0,-4,0,-4,0,-4,-1,-72,917],
sm685=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,918,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm686=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,919,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm687=[0,-4,0,-4,0,-4,-1,-7,920],
sm688=[0,-4,0,-4,0,-4,-1,-7,921],
sm689=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,922,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm690=[0,-4,0,-4,0,-4,-1,-7,923],
sm691=[0,-4,0,-4,0,-4,-1,-7,924],
sm692=[0,-4,0,-4,0,-4,-1,-92,748],
sm693=[0,-4,0,-4,0,-4,-1,-92,749],
sm694=[0,925,925,925,-1,0,-4,0,-4,-1,925,-1,925,-1,925,-1,925,-14,925,-14,925,-1,925,-22,925,925,-9,925,-3,925,925,-1,925,925,925,925,-1,925,925,925,925,925,925,925,925,-1,925,925,925,925,925,925,925,925,-2,925,925,-5,925,925,-2,925,-23,925,925,925,925,925,925,925,925,925,925,925,925],
sm695=[0,-4,0,-4,0,-4,-1,-38,926,-41,927,-18,928],
sm696=[0,929,929,929,-1,0,-4,0,-4,-1,929,-1,929,-1,929,-1,929,-14,929,-14,929,-1,929,-22,929,929,-9,929,-3,929,929,-1,929,929,929,929,-1,929,929,929,929,929,929,929,929,-1,929,929,929,929,929,929,929,929,-2,929,929,-5,929,929,-2,929,-23,929,929,929,929,929,929,929,929,929,929,929,929],
sm697=[0,-4,0,-4,0,-4,-1,-7,930],
sm698=[0,-4,0,-4,0,-4,-1,-7,931],
sm699=[0,932,932,932,-1,0,-4,0,-4,-1,932,-1,932,-1,932,932,932,932,-2,932,932,-3,932,-5,932,932,-12,932,932,-1,932,-14,932,932,-1,932,-4,932,932,932,932,932,932,932,-1,932,-2,932,-2,932,932,932,-1,932,932,932,932,-1,932,932,-1,932,932,932,932,932,932,932,932,932,932,932,932,932,932,-2,932,932,-5,932,932,-2,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932,932],
sm700=[0,-4,0,-4,0,-4,-1,-36,933],
sm701=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,934,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm702=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,935,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm703=[0,-4,0,-4,0,-4,-1,-38,936],
sm704=[0,937,937,937,-1,0,-4,0,-4,-1,937,-1,937,-1,937,937,937,937,-2,937,937,-3,937,-5,937,937,-12,937,937,-1,937,-14,937,937,-1,937,-4,937,937,937,937,937,937,937,-1,937,-2,937,-2,937,937,937,-1,937,937,937,937,-1,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,-2,937,937,-5,937,937,-2,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937,937],
sm705=[0,-4,0,-4,0,-4,-1,-38,938],
sm706=[0,-4,0,-4,0,-4,-1,-7,939],
sm707=[0,-4,0,-4,0,-4,-1,-7,940,-27,940],
sm708=[0,-4,0,-4,0,-9,941,-31,941],
sm709=[0,-4,0,-4,0,-20,942],
sm710=[0,-4,0,-4,0,-20,943],
sm711=[0,-4,0,-4,0,-149,944],
sm712=[0,-4,0,-4,0,-4,-1,-144,945],
sm713=[0,-2,771,-1,772,773,774,775,776,0,-3,777,-1,-144,946,946],
sm714=[0,-2,947,-1,947,947,947,947,947,0,-3,947,-1,-144,947,947],
sm715=[0,-2,948,-1,948,948,948,948,948,0,-3,948,-1,-144,948,948],
sm716=[0,-2,949,-1,949,949,949,949,949,0,-3,949,-1,-144,949,949],
sm717=[0,-4,0,-4,0,-4,-1,-145,950],
sm718=[0,-4,0,-4,0,-156,951],
sm719=[0,-4,0,-4,0,-20,952],
sm720=[0,-4,0,-4,0,-20,953],
sm721=[0,954,954,954,-1,954,954,954,954,954,954,-7,954,-1,954,-1,954,954,-6,954,-6,954,-1,954,-1,954,-3,954,-6,954,-35,954,-98,954],
sm722=[0,-4,955,-4,0,-4,-1,-58,788,-85,789,790],
sm723=[0,-2,387,-1,0,-4,0,-4,-1,-2,956,-3,791,-7,956,-6,956,-14,956,-2,957,956,-6,792,-2,793,-13,956,956,956,-5,956,-2,956],
sm724=[0,-4,958,-4,0,-4,-1,-58,958,-85,958,958],
sm725=[0,-2,959,-1,0,-4,0,-4,-1,-2,959,-3,959,-7,959,-6,959,-14,959,-2,959,959,-6,959,-2,959,-13,959,959,959,-5,959,-2,959],
sm726=[0,-4,0,-4,0,-3,960,-1],
sm727=[0,-4,0,-4,0,-3,961,-1],
sm728=[0,-4,0,-4,0,-4,-1,-6,962],
sm729=[0,-4,0,-4,0,-4,-1,-35,963,964],
sm730=[0,-2,965,-1,0,-4,0,-4,-1,-2,965,-11,965,-6,965,-13,965,965,-3,965,-23,965,965,965,-5,965,-2,965],
sm731=[0,-2,966,-1,0,-4,0,-4,-1,-2,966,-11,966,-6,966,-13,966,966,-3,966,-23,966,966,966,-5,966,-2,966],
sm732=[0,-2,966,-1,0,-4,0,-4,-1,-2,966,-11,966,-6,966,-13,966,966,-3,966,-4,967,-18,966,966,966,-5,966,-2,966],
sm733=[0,-2,968,-1,0,-4,0,-4,-1,-2,968,-4,968,-6,968,-6,968,-13,968,968,-3,968,-23,968,968,968,-5,968,-2,968],
sm734=[0,-2,969,-1,0,-4,0,-4,-1,-2,969,-4,969,-6,969,-6,969,-13,969,969,-3,969,-23,969,969,969,-5,969,-2,969],
sm735=[0,-2,969,-1,0,-4,0,-4,-1,-2,969,-4,969,-6,969,-6,969,-13,969,969,-3,969,-4,970,971,-17,969,969,969,-5,969,-2,969],
sm736=[0,-2,387,-1,0,-4,0,-4,-1,-6,791],
sm737=[0,-1,972,387,-1,0,-4,0,-4,-1,-6,791,-40,973],
sm738=[0,-2,974,-1,0,-4,0,-4,-1,-2,974,-4,974,-6,974,-6,974,-13,974,974,-3,974,-4,974,974,-17,974,974,974,-5,974,-2,974],
sm739=[0,-2,975,-1,0,-4,0,-4,-1,-2,975,-3,976,-7,975,-6,975,-13,975,975,-3,975,-4,975,-18,975,975,975,-5,975,-2,975],
sm740=[0,-2,977,-1,0,-4,0,-4,-1],
sm741=[0,-4,0,-4,0,-4,-1,-36,978],
sm742=[0,-4,0,-4,0,-4,-1,-36,979],
sm743=[0,-4,0,-4,0,-4,-1,-36,980],
sm744=[0,-2,387,-1,0,-4,0,-4,795,-6,796],
sm745=[0,-4,0,-4,0,-4,-1,-7,981,-28,981,-8,982,983],
sm746=[0,-4,0,-4,0,-4,-1,-7,984,-28,984,-8,984,984],
sm747=[0,-4,0,-4,0,-4,-1,-7,985,-28,985,-8,985,985],
sm748=[0,-4,0,-4,0,-4,-1,-6,986],
sm749=[0,-4,0,-4,0,-4,-1,-6,976],
sm750=[0,-2,387,-1,0,-4,0,-4,-1,-38,987,-1,392,-31,988],
sm751=[0,-4,0,-4,0,-4,-1,-35,989,989],
sm752=[0,-4,0,-4,0,-4,-1,-38,990],
sm753=[0,-2,991,-1,0,-4,0,-4,-1,-2,991,-11,991,-6,991,-14,991,-1,991,-1,991,-23,991,991,991,-8,991],
sm754=[0,-2,992,-1,0,-4,0,-4,-1,-38,992,-1,992,-31,992],
sm755=[0,-2,993,-1,0,-4,0,-4,-1,-38,993,-1,993,-31,994],
sm756=[0,-2,995,-1,0,-4,0,-4,-1,-38,995,-1,995,-31,995],
sm757=[0,-2,996,-1,0,-4,0,-4,-1,-38,996,-1,996,-31,996],
sm758=[0,-2,387,-1,0,-4,0,-4,-1,-38,997,-1,997,-31,997],
sm759=[0,-2,998,-1,999,-4,0,-3,1000,-1,-6,1001],
sm760=[0,-2,1002,-1,0,-4,0,-4,-1,-7,1002,-6,1002,1002,-5,1002,-13,1002,1002,-24,1002,1002,1002,1002,1002,1002,-8,1002],
sm761=[0,-2,1003,-1,0,-4,0,-4,-1,-7,1003,-6,1003,1003,-5,1003,-13,1003,1003,-24,1003,1003,1003,1003,1003,1003,-8,1003],
sm762=[0,-2,1004,-1,0,-4,0,-4,-1,-7,1004,-6,1004,1004,-5,1004,-13,1004,1004,-24,1004,1004,1004,1004,1004,1004,-8,609],
sm763=[0,-2,1005,-1,1005,-4,0,-3,1005,-1,-2,1005,-1,1005,-1,1005,1005,-2,1005,-3,1005,1005,-5,1005,1005,-12,1005,1005,-3,1005,-4,1005,-7,1005,-7,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,1005,-2,1005],
sm764=[0,-2,1006,-1,1006,-4,1006,-3,1006,-1,-2,1006,-1,1006,-1,1006,1006,-2,1006,-3,1006,1006,-5,1006,1006,-12,1006,1006,-3,1006,-4,1006,-7,1006,-7,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,1006,-2,1006,1006,1006],
sm765=[0,-2,1007,-1,0,-4,0,-4,-1,-7,1007,-6,1007,1007,-5,1007,-13,1007,1007,-24,1007,1007,1007,1007,1007,1007,-8,1007],
sm766=[0,-2,387,1008,0,-4,0,-4,-1],
sm767=[0,-4,0,-4,0,-4,-1,-10,1009],
sm768=[0,-2,1010,1010,0,-4,0,-4,-1],
sm769=[0,-2,1011,-1,0,-4,0,-4,-1,-7,1011,-6,1011,1011,-5,1011,-13,1011,1011,-24,1011,1011,1011,1011,1011,1011,-8,1011],
sm770=[0,-2,1012,-1,0,-4,0,-4,-1,-7,1012,-6,1012,1012,-5,1012,-13,1012,1012,-24,1012,1012,1012,1012,1012,1012,-8,1012],
sm771=[0,-4,0,-4,0,-157,1013],
sm772=[0,-4,0,-4,0,-20,1014],
sm773=[0,-4,0,-4,0,-20,1015],
sm774=[0,-4,0,-4,0,-158,1016],
sm775=[0,-4,0,-4,0,-20,1017],
sm776=[0,-4,0,-4,0,-20,1018],
sm777=[0,-4,0,-4,0,-4,-1,-15,1019],
sm778=[0,-4,0,-4,0,-4,-1,-15,1020],
sm779=[0,954,954,954,-1,954,954,954,954,954,954,-4,-1,-2,954,-1,954,-1,954,954,-6,954,-6,954,-1,954,-1,954,-3,954,-6,954,-35,954,-98,954],
sm780=[0,-1,249,250,-1,251,252,253,254,255,1021,-4,-1,-2,1021,-1,78,-1,405,-7,1021,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm781=[0,-1,1022,1022,-1,1022,1022,1022,1022,1022,0,-4,-1,-4,1022,-1,1022,-7,1022,-6,1022,-1,1022,-1,1022,-3,1022,-6,1022,-134,1022],
sm782=[0,-1,1023,1023,-1,1023,1023,1023,1023,1023,1023,-4,-1,-2,1023,-1,1023,-1,1023,-7,1023,-6,1023,-1,1023,-1,1023,-3,1023,-6,1023,-134,1023],
sm783=[0,-1,1024,1024,-1,1024,1024,1024,1024,1024,1024,-4,-1,-2,1024,-1,1024,-1,1024,-7,1024,-6,1024,-1,1024,-1,1024,-3,1024,-6,1024,-134,1024],
sm784=[0,-1,249,250,-1,1025,252,253,254,255,0,-4,-1,-4,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm785=[0,-1,249,250,-1,251,252,253,254,255,1026,-4,-1,-2,1026,-1,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm786=[0,-1,1027,1027,-1,1027,1027,1027,1027,1027,0,-4,-1,-4,1027,-1,1027,-7,1027,1027,-5,1027,-1,1027,-1,1027,-3,1027,-6,1027,-134,1027],
sm787=[0,-1,1028,1028,-1,1028,1028,1028,1028,1028,1028,-4,-1,-2,1028,-1,1028,-1,1028,-7,1028,-6,1028,-1,1028,-1,1028,-3,1028,-6,1028,-134,1028],
sm788=[0,-1,1029,1029,-1,1029,1029,1029,1029,1029,1029,-4,-1,-2,1029,-1,1029,-1,1029,-7,1029,-6,1029,-1,1029,-1,1029,-3,1029,-6,1029,-134,1029],
sm789=[0,-1,1030,1030,-1,1030,1030,1030,1030,1030,0,-4,-1,-4,1030,-1,1030,-7,1030,1030,-5,1030,-1,1030,-1,1030,-3,1030,-6,1030,-134,1030],
sm790=[0,-4,0,-4,1031,-4,-1],
sm791=[0,-1,249,250,-1,251,252,253,254,255,1032,-4,-1,-19,1033,-151,256],
sm792=[0,-1,249,250,-1,1034,252,253,254,255,0,-4,-1,-4,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm793=[0,-1,249,250,-1,251,252,253,254,255,1035,-4,-1,-2,1035,-1,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm794=[0,-1,1036,1036,-1,1036,1036,1036,1036,1036,0,-4,-1,-4,1036,-1,1036,-7,1036,-6,1036,-1,1036,-1,1036,-3,1036,-6,1036,-24,1036,-2,1036,-106,1036],
sm795=[0,-1,1037,1037,-1,1037,1037,1037,1037,1037,1037,-4,-1,-2,1037,-1,1037,-1,1037,-7,1037,-6,1037,-1,1037,-1,1037,-3,1037,-6,1037,-134,1037],
sm796=[0,-1,1038,1038,-1,1038,1038,1038,1038,1038,1038,-4,-1,-2,1038,-1,1038,-1,1038,-7,1038,-6,1038,-1,1038,-1,1038,-3,1038,-6,1038,-134,1038],
sm797=[0,-1,1039,1039,-1,1039,1039,1039,1039,1039,0,-4,-1,-4,1039,-1,1039,-7,1039,-6,1039,-1,1039,-1,1039,-3,1039,-6,1039,-24,1039,-2,1039,-106,1039],
sm798=[0,-1,1040,1040,-1,1040,1040,1040,1040,1040,1040,-4,-1,-2,1040,-1,1040,-1,1040,-14,1040,-1,1040,-1,1040,-3,1040,-6,1040,-134,1040],
sm799=[0,-1,1041,1041,-1,1041,1041,1041,1041,1041,1041,-4,-1,-2,1041,-1,1041,-1,1041,-14,1041,-1,1041,-1,1041,-3,1041,-6,1041,-134,1041],
sm800=[0,-1,1042,1042,-1,1042,1042,1042,1042,1042,1042,-4,-1,-2,1042,-1,1042,-1,1042,-3,860,861,-9,1042,-1,1042,-1,1042,-3,1042,-6,1042,-134,1042],
sm801=[0,-1,1043,1043,-1,1043,1043,1043,1043,1043,1043,-4,-1,-2,1043,-1,1043,-1,1043,-3,1043,1043,-9,1043,-1,1043,-1,1043,-3,1043,-6,1043,-134,1043],
sm802=[0,-1,1044,1044,-1,1044,1044,1044,1044,1044,1044,-4,-1,-2,1044,-1,1044,-1,1044,-3,1044,1044,-9,1044,-1,1044,-1,1044,-3,1044,-6,1044,-134,1044],
sm803=[0,-1,1042,1042,-1,1042,1042,1042,1042,1042,1042,-4,-1,-2,1042,-1,1042,-1,1042,-6,862,-7,1042,-1,1042,-1,1042,-3,1042,-6,1042,-39,863,-94,1042],
sm804=[0,-1,1045,1045,-1,1045,1045,1045,1045,1045,1045,-4,-1,-2,1045,-1,1045,-1,1045,-6,1045,-7,1045,-1,1045,-1,1045,-3,1045,-6,1045,-39,1045,-94,1045],
sm805=[0,-1,1046,1046,-1,1046,1046,1046,1046,1046,1046,-4,-1,-2,1046,-1,1046,-1,1046,-6,1046,-7,1046,-1,1046,-1,1046,-3,1046,-6,1046,-39,1046,-94,1046],
sm806=[0,-1,1047,1047,-1,1047,1047,1047,1047,1047,1047,-4,-1,-2,1047,-1,1047,-1,1047,-4,1047,-1,1047,1047,1047,-3,1047,-1,1047,-1,1047,-1,1047,-3,1047,-6,1047,-24,1047,-2,1047,-106,1047],
sm807=[0,-4,0,-4,0,-4,-1,-6,1048],
sm808=[0,-1,1049,1049,-1,1049,1049,1049,1049,1049,1049,-4,-1,-2,1049,-1,1049,-1,1049,1049,-6,1049,-6,1049,-1,1049,1049,1049,1049,-2,1049,-6,1049,-1,1049,-132,1049],
sm809=[0,-1,1050,1050,-1,1050,1050,1050,1050,1050,0,-4,-1,-6,1050,-14,1050,-1,1050,1050,1050,1050,-2,1050,-6,1050,-1,1050,-132,1050],
sm810=[0,-1,1051,1051,-1,1051,1051,1051,1051,1051,1051,-4,-1,-2,1051,-1,1051,-1,1051,1051,-6,1051,-6,1051,-1,1051,1051,1051,1051,-2,1051,-6,1051,-1,1051,-132,1051],
sm811=[0,-1,1052,1052,-1,1052,1052,1052,1052,1052,1052,-4,-1,-2,1052,-1,1052,-1,1052,1052,-6,1052,-6,1052,-1,1052,1052,1052,1052,-2,1052,-6,1052,-1,1052,-132,1052],
sm812=[0,-1,190,1053,-1,1054,1055,1056,1057,1058,0,-3,777,-7,405,-137,197],
sm813=[0,-1,198,1059,-1,1060,1061,1062,1063,1064,0,-3,777,-1,-145,205],
sm814=[0,-1,186,186,-1,186,-4,186,-4,186,-4,186,186,186,-3,186,186,-2,186,186,-5,186,186,-12,186,-17,186,186,-1,186,-4,186,-1,186,186,186,186,186,-1,186,-5,267,186,186,-27,186,-9,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,-4,186,186,-5,186],
sm815=[0,-1,1,872,-1,0,-4,0,-4,-1,-6,667,-14,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,873,874,42,43,44,45],
sm816=[0,-1,1,2,-1,0,-4,0,-11,5,207,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-1,208,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm817=[0,-1,1065,1065,-1,1065,1065,1065,1065,1065,1065,-4,-1,-2,1065,-1,1065,-1,1065,1065,-6,1065,-6,1065,-1,1065,1065,1065,1065,-2,1065,-6,1065,-1,1065,-132,1065],
sm818=[0,-1,1066,1066,1066,1066,1066,1066,1066,1066,0,-4,-1,-14,1066,-14,1066],
sm819=[0,-4,0,-4,0,-12,1067],
sm820=[0,-4,0,-4,0,-4,-1,-15,1068],
sm821=[0,1069,1069,1069,-1,1069,1069,1069,1069,1069,1069,-4,-1,-2,1069,-1,1069,-1,1069,1069,-6,1069,-6,1069,-1,1069,-1,1069,-3,1069,-6,1069,-35,1069,-98,1069],
sm822=[0,1070,1070,1070,-1,1070,1070,1070,1070,1070,1070,-7,1070,-1,1070,-1,1070,1070,-6,1070,-6,1070,-1,1070,-1,1070,-3,1070,-6,1070,-35,1070,-98,1070],
sm823=[0,-4,0,-4,0,-4,-1,-22,1071,-12,1071],
sm824=[0,-4,0,-4,0,-4,-1,-36,1072],
sm825=[0,-4,0,-4,0,-4,-1,-36,1073],
sm826=[0,-4,0,-4,0,-4,-1,-7,1074],
sm827=[0,-4,0,-4,0,-4,-1,-7,1075],
sm828=[0,1076,1076,1076,-1,0,-4,0,-4,-1,1076,-3,1076,1076,1076,1076,-2,1076,1076,-3,1076,-5,1076,1076,-12,1076,1076,-1,1076,-14,1076,1076,-1,1076,-4,1076,1076,1076,1076,1076,1076,1076,-1,1076,-2,1076,-2,1076,1076,1076,-1,1076,-1,1076,1076,-1,1076,1076,-1,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,-1,1076,-2,1076,1076,1076,-4,1076,1076,-2,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076,1076],
sm829=[0,-4,0,-4,0,-4,-1,-7,1077,-2,1077,-11,1077,-12,1077,-2,1077,-17,1077,-35,1077],
sm830=[0,-4,0,-4,0,-4,-1,-7,1078,-2,1078,-11,1078,-12,1078,-2,1078,-17,1078,-35,1078],
sm831=[0,-4,0,-4,0,-4,-1,-22,1079],
sm832=[0,-4,0,-4,0,-4,-1,-72,1080],
sm833=[0,-1,1,2,-1,0,-4,0,-4,-1,-6,5,1081,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm834=[0,-4,0,-4,0,-4,-1,-7,1082],
sm835=[0,-4,0,-4,0,-4,-1,-7,1083],
sm836=[0,1084,1084,1084,-1,0,-4,0,-4,-1,1084,-1,1084,-1,1084,-1,1084,-14,1084,-14,1084,-1,1084,-22,1084,1084,-9,1084,-3,1084,1084,-1,1084,1084,1084,1084,-1,1084,1084,1084,1084,1084,1084,1084,1084,-1,1084,1084,1084,1084,1084,1084,1084,1084,-2,1084,1084,-5,1084,1084,-2,1084,-23,1084,1084,1084,1084,1084,1084,1084,1084,1084,1084,1084,1084],
sm837=[0,-4,0,-4,0,-4,-1,-7,1085],
sm838=[0,1086,1086,1086,-1,0,-4,0,-4,-1,1086,-1,1086,-1,1086,-1,1086,-14,1086,-14,1086,-1,1086,-22,1086,1086,-9,1086,-3,1086,1086,-1,1086,1086,1086,1086,-1,1086,1086,1086,1086,1086,1086,1086,1086,-1,1086,1086,1086,1086,1086,1086,1086,1086,-2,1086,1086,-5,1086,1086,-2,1086,-23,1086,1086,1086,1086,1086,1086,1086,1086,1086,1086,1086,1086],
sm839=[0,-4,0,-4,0,-4,-1,-7,1087],
sm840=[0,1088,1088,1088,-1,0,-4,0,-4,-1,1088,-1,1088,-1,1088,-1,1088,-14,1088,-14,1088,-1,1088,-22,1088,1088,-9,1088,-3,1088,1088,-1,1088,1088,1088,1088,-1,1088,1088,1088,1088,1088,1088,1088,1088,-1,1088,1088,1088,1088,1088,1088,1088,1088,-2,1088,1088,-5,1088,1088,-2,1088,-23,1088,1088,1088,1088,1088,1088,1088,1088,1088,1088,1088,1088],
sm841=[0,-4,0,-4,0,-4,-1,-38,1089,-41,927,-18,928],
sm842=[0,-4,0,-4,0,-4,-1,-38,1090,-60,928],
sm843=[0,-4,0,-4,0,-4,-1,-38,1091,-41,1091,-18,1091],
sm844=[0,-4,0,-4,0,-4,-1,-75,1092],
sm845=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,1093,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,-1,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm846=[0,-4,0,-4,0,-4,-1,-38,1094],
sm847=[0,1095,1095,1095,-1,0,-4,0,-4,-1,1095,-1,1095,-1,1095,1095,1095,1095,-2,1095,1095,-3,1095,-5,1095,1095,-12,1095,1095,-1,1095,-14,1095,1095,-1,1095,-4,1095,1095,1095,1095,1095,1095,1095,-1,1095,-2,1095,-2,1095,1095,1095,-1,1095,1095,1095,1095,-1,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,-2,1095,1095,-5,1095,1095,-2,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095,1095],
sm848=[0,-4,0,-4,0,-4,-1,-38,1096],
sm849=[0,1097,1097,1097,-1,0,-4,0,-4,-1,1097,-1,1097,-1,1097,1097,1097,1097,-2,1097,1097,-3,1097,-5,1097,1097,-12,1097,1097,-1,1097,-14,1097,1097,-1,1097,-4,1097,1097,1097,1097,1097,1097,1097,-1,1097,-2,1097,-2,1097,1097,1097,-1,1097,1097,1097,1097,-1,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,-2,1097,1097,-5,1097,1097,-2,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097,1097],
sm850=[0,1098,1098,1098,-1,0,-4,0,-4,-1,1098,-1,1098,-1,1098,1098,1098,1098,-2,1098,1098,-3,1098,-5,1098,1098,-12,1098,1098,-1,1098,-14,1098,1098,-1,1098,-4,1098,1098,1098,1098,1098,1098,1098,-1,1098,-2,1098,-2,1098,1098,1098,-1,1098,1098,1098,1098,-1,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,-2,1098,1098,-5,1098,1098,-2,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098,1098],
sm851=[0,-4,0,-4,0,-9,1099,-31,1099],
sm852=[0,-2,1100,-1,0,-4,0,-10,1100,-9,1100,-6,1100,-121,1100,1100],
sm853=[0,-2,1101,-1,0,-4,0,-4,-1,-5,1101,-9,1101,-6,1101,-121,1101,1101],
sm854=[0,-2,1102,-1,1102,1102,1102,1102,1102,0,-3,1102,-1,-144,1102,1102],
sm855=[0,-4,0,-4,0,-20,1103],
sm856=[0,1104,1104,1104,-1,1104,1104,1104,1104,1104,1104,-7,1104,-1,1104,-1,1104,1104,-6,1104,-6,1104,-1,1104,-1,1104,-3,1104,-6,1104,-35,1104,-98,1104],
sm857=[0,1105,1105,1105,-1,1105,1105,1105,1105,1105,1105,-7,1105,-1,1105,-1,1105,1105,-6,1105,-6,1105,-1,1105,-1,1105,-3,1105,-6,1105,-35,1105,-98,1105],
sm858=[0,-2,387,-1,0,-4,0,-4,-1,-2,1106,-3,791,-7,1106,-6,1106,-14,1106,-2,957,1106,-6,792,-2,793,-13,1106,1106,1106,-5,1106,-2,1106],
sm859=[0,-4,1107,-4,0,-4,-1,-58,1107,-85,1107,1107],
sm860=[0,-2,387,-1,0,-4,0,-4,-1,-2,1106,-3,791,-7,1106,-6,1106,-14,1106,-3,1106,-6,792,-2,793,-13,1106,1106,1106,-5,1106,-2,1106],
sm861=[0,-2,1106,-1,0,-4,0,-4,-1,-2,1106,-11,1106,-6,1106,-13,963,1106,-3,1106,-23,1106,1106,1106,-5,1106,-2,1106],
sm862=[0,-4,0,-4,0,-4,-1,-6,1108],
sm863=[0,-4,0,-4,0,-3,960,-1,-144,1109],
sm864=[0,-4,0,-4,0,-3,1110,-1,-144,1110],
sm865=[0,-4,0,-4,0,-3,1111,-1,-144,1111],
sm866=[0,-4,0,-4,0,-3,961,-1,-145,1112],
sm867=[0,-4,0,-4,0,-3,1113,-1,-145,1113],
sm868=[0,-4,0,-4,0,-3,1114,-1,-145,1114],
sm869=[0,-4,0,-4,0,-4,-1,-144,789,790],
sm870=[0,-2,387,-1,0,-4,0,-4,-1,-14,389,-6,390,-14,391,-1,1115,-25,393,394,395,-8,396],
sm871=[0,-2,1116,-1,0,-4,0,-4,-1,-2,1116,-11,1116,-6,1116,-13,1116,1116,-3,1116,-4,967,-18,1116,1116,1116,-5,1116,-2,1116],
sm872=[0,-2,975,-1,0,-4,0,-4,-1,-2,975,-11,975,-6,975,-13,975,975,-3,975,-4,975,-18,975,975,975,-5,975,-2,975],
sm873=[0,-2,1116,-1,0,-4,0,-4,-1,-2,1116,-11,1116,-6,1116,-13,1116,1116,-3,1116,-23,1116,1116,1116,-5,1116,-2,1116],
sm874=[0,-2,387,-1,0,-4,0,-4,-1,-6,791,-40,973],
sm875=[0,-2,1117,-1,0,-4,0,-4,-1,-2,1117,-4,1117,-6,1117,-6,1117,-13,1117,1117,-3,1117,-4,970,-18,1117,1117,1117,-5,1117,-2,1117],
sm876=[0,-2,1118,-1,0,-4,0,-4,-1,-2,1118,-4,1118,-6,1118,-6,1118,-13,1118,1118,-3,1118,-5,971,-17,1118,1118,1118,-5,1118,-2,1118],
sm877=[0,-2,1119,-1,0,-4,0,-4,-1,-2,1119,-4,1119,-6,1119,-6,1119,-13,1119,1119,-3,1119,-4,1119,-18,1119,1119,1119,-5,1119,-2,1119],
sm878=[0,-2,1120,-1,0,-4,0,-4,-1,-2,1120,-4,1120,-6,1120,-6,1120,-13,1120,1120,-3,1120,-5,1120,-17,1120,1120,1120,-5,1120,-2,1120],
sm879=[0,-2,1121,-1,0,-4,0,-4,-1,-2,1121,-4,1121,-6,1121,-6,1121,-13,1121,1121,-3,1121,-23,1121,1121,1121,-5,1121,-2,1121],
sm880=[0,-4,0,-4,0,-4,-1,-7,1122],
sm881=[0,-4,0,-4,0,-4,-1,-7,1123],
sm882=[0,-4,1124,-4,0,-3,1125,-1,-4,1126,-1,976,1127,-2,1126,-4,1126,-37,1126,-21,1126],
sm883=[0,-4,0,-4,0,-4,-1,-7,1128],
sm884=[0,-4,0,-4,0,-4,-1,-4,1129,-5,1130,-4,1131,-37,1132,-21,1133],
sm885=[0,-4,0,-4,0,-4,-1,-4,1134,-5,1135,-4,1136,-37,1137],
sm886=[0,-4,0,-4,0,-4,-1,-4,1138,1139,-1,1138,-2,1138,-4,1138,-37,1138,-1,1140,1141,1142],
sm887=[0,-4,0,-4,0,-4,-1,-4,1138,-2,1138,-2,1138,-4,1138,-37,1138],
sm888=[0,-4,1143,-4,0,-3,1144,-1,-7,1145],
sm889=[0,-1,1146,-2,0,-4,0,-4,-1,-43,1147,1148],
sm890=[0,-4,0,-4,0,-4,-1,-7,1149,-28,1149],
sm891=[0,-4,0,-4,0,-4,-1,-7,1149,-28,1149,-8,982],
sm892=[0,-4,0,-4,0,-4,-1,-7,1149,-28,1149,-9,983],
sm893=[0,-4,0,-4,0,-4,-1,-7,1150,-28,1150,-8,1150],
sm894=[0,-4,0,-4,0,-4,-1,-7,1151,-28,1151,-9,1151],
sm895=[0,-4,0,-4,0,-4,-1,-7,1152],
sm896=[0,-4,0,-4,0,-4,-1,-7,1153],
sm897=[0,-4,1124,-4,0,-3,1125,-1,-6,976,1127,-67,804],
sm898=[0,-4,0,-4,0,-4,-1,-38,1154],
sm899=[0,-2,1155,-1,0,-4,0,-4,-1,-2,1155,-11,1155,-6,1155,-14,1155,-1,1155,-1,1155,-23,1155,1155,1155,-8,1155],
sm900=[0,-2,1156,-1,0,-4,0,-4,-1,-2,1156,-11,1156,-6,1156,-14,1156,-1,1156,-1,1156,-23,1156,1156,1156,-8,1156],
sm901=[0,-2,387,-1,0,-4,0,-4,-1,-38,1157,-1,1157,-31,1157],
sm902=[0,-2,1158,-1,0,-4,0,-4,-1,-38,1158,-1,1158,-31,1158],
sm903=[0,-2,998,-1,999,-4,0,-3,1000,-1,-6,1001,1159,-30,1159,-1,1159,-31,1159,-68,1160],
sm904=[0,-2,998,-1,999,-4,0,-3,1000,-1,-6,1161,1161,-30,1161,-1,1161,-31,1161,-68,1161],
sm905=[0,-2,1162,-1,1162,-4,0,-3,1162,-1,-6,1162,1162,-30,1162,-1,1162,-31,1162,-68,1162],
sm906=[0,-2,1163,-1,1163,-4,0,-3,1163,-1,-6,1163,1163,-30,1163,-1,1163,-31,1163,-68,1163],
sm907=[0,-4,0,-4,0,-4,-1,-22,1164,-47,1165,1166],
sm908=[0,-4,0,-4,0,-4,-1,-22,1167,-47,1167,1167],
sm909=[0,-2,1168,1168,0,-4,0,-4,-1],
sm910=[0,-4,0,-4,0,-4,-1,-7,1169],
sm911=[0,-4,0,-4,0,-20,1170],
sm912=[0,-4,0,-4,0,-20,1171],
sm913=[0,-4,0,-4,0,-4,-1,-15,1172],
sm914=[0,1104,1104,1104,-1,1104,1104,1104,1104,1104,1104,-4,-1,-2,1104,-1,1104,-1,1104,1104,-6,1104,-6,1104,-1,1104,-1,1104,-3,1104,-6,1104,-35,1104,-98,1104],
sm915=[0,1105,1105,1105,-1,1105,1105,1105,1105,1105,1105,-4,-1,-2,1105,-1,1105,-1,1105,1105,-6,1105,-6,1105,-1,1105,-1,1105,-3,1105,-6,1105,-35,1105,-98,1105],
sm916=[0,-1,1173,1173,-1,1173,1173,1173,1173,1173,1173,-4,-1,-2,1173,-1,1173,-1,1173,-7,1173,-6,1173,-1,1173,-1,1173,-3,1173,-6,1173,-134,1173],
sm917=[0,-1,249,250,-1,251,252,253,254,255,1174,-4,-1,-2,1174,-1,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm918=[0,-1,1175,1175,-1,1175,1175,1175,1175,1175,1175,-4,-1,-2,1175,-1,1175,-1,1175,-7,1175,-6,1175,-1,1175,-1,1175,-3,1175,-6,1175,-134,1175],
sm919=[0,-1,249,250,-1,251,252,253,254,255,1032,-4,-1,-19,1176,-151,256],
sm920=[0,-1,1177,1177,-1,1177,1177,1177,1177,1177,1177,-4,-1,-19,1177,-151,1177],
sm921=[0,-1,249,250,-1,251,252,253,254,255,1178,-4,-1,-19,1178,-151,256],
sm922=[0,-1,1179,1179,-1,1179,1179,1179,1179,1179,1179,-4,-1,-19,1179,-151,1179],
sm923=[0,-1,1180,1180,-1,1180,1180,1180,1180,1180,1180,-4,-1,-19,1180,-151,1180],
sm924=[0,-1,249,250,-1,251,252,253,254,255,1181,-4,-1,-2,1181,-1,78,-1,405,-7,652,-6,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm925=[0,-1,1182,1182,-1,1182,1182,1182,1182,1182,1182,-4,-1,-2,1182,-1,1182,-1,1182,-7,1182,-6,1182,-1,1182,-1,1182,-3,1182,-6,1182,-134,1182],
sm926=[0,-1,1183,1183,-1,1183,1183,1183,1183,1183,1183,-4,-1,-2,1183,-1,1183,-1,1183,-3,1183,1183,-9,1183,-1,1183,-1,1183,-3,1183,-6,1183,-134,1183],
sm927=[0,-1,1184,1184,-1,1184,1184,1184,1184,1184,1184,-4,-1,-2,1184,-1,1184,-1,1184,-6,1184,-7,1184,-1,1184,-1,1184,-3,1184,-6,1184,-39,1184,-94,1184],
sm928=[0,-1,249,250,-1,251,252,253,254,255,0,-4,-1,-4,78,-1,405,-14,406,-1,407,-1,408,-3,409,-6,410,-134,256],
sm929=[0,-1,333,333,-1,333,333,333,333,333,0,-3,949,-1,-144,333],
sm930=[0,-1,336,336,-1,336,336,336,336,336,0,-3,949,-1,-145,336],
sm931=[0,-4,0,-4,0,-12,1185,-27,339],
sm932=[0,-4,-1,-4,0,-11,1186,1187],
sm933=[0,1188,1188,1188,-1,1188,1188,1188,1188,1188,1188,-4,-1,-2,1188,-1,1188,-1,1188,1188,-6,1188,-6,1188,-1,1188,-1,1188,-3,1188,-6,1188,-35,1188,-98,1188],
sm934=[0,-4,0,-4,0,-4,-1,-36,1189],
sm935=[0,-4,0,-4,0,-4,-1,-7,1190,-2,1190,-11,1190,-12,1190,-2,1190,-17,1190,-35,1190],
sm936=[0,1191,1191,1191,-1,0,-4,0,-4,-1,1191,-1,1191,-1,1191,-1,1191,-14,1191,-14,1191,-1,1191,-22,1191,1191,-9,1191,-3,1191,1191,-1,1191,1191,1191,1191,-1,1191,1191,1191,1191,1191,1191,1191,1191,-1,1191,1191,1191,1191,1191,1191,1191,1191,-2,1191,1191,-5,1191,1191,-2,1191,-23,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191,1191],
sm937=[0,1192,1192,1192,-1,0,-4,0,-4,-1,1192,-1,1192,-1,1192,-1,1192,-14,1192,-14,1192,-1,1192,-22,1192,1192,-9,1192,-3,1192,1192,-1,1192,1192,1192,1192,-1,1192,1192,1192,1192,1192,1192,1192,1192,-1,1192,1192,1192,1192,1192,1192,1192,1192,-2,1192,1192,-5,1192,1192,-2,1192,-23,1192,1192,1192,1192,1192,1192,1192,1192,1192,1192,1192,1192],
sm938=[0,-4,0,-4,0,-4,-1,-7,1193],
sm939=[0,1194,1194,1194,-1,0,-4,0,-4,-1,1194,-1,1194,-1,1194,-1,1194,-14,1194,-14,1194,-1,1194,-22,1194,1194,-9,1194,-3,1194,1194,-1,1194,1194,1194,1194,-1,1194,1194,1194,1194,1194,1194,1194,1194,-1,1194,1194,1194,1194,1194,1194,1194,1194,-2,1194,1194,-5,1194,1194,-2,1194,-23,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194,1194],
sm940=[0,1195,1195,1195,-1,0,-4,0,-4,-1,1195,-1,1195,-1,1195,-1,1195,-14,1195,-14,1195,-1,1195,-22,1195,1195,-9,1195,-3,1195,1195,-1,1195,1195,1195,1195,-1,1195,1195,1195,1195,1195,1195,1195,1195,-1,1195,1195,1195,1195,1195,1195,1195,1195,-2,1195,1195,-5,1195,1195,-2,1195,-23,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195,1195],
sm941=[0,1196,1196,1196,-1,0,-4,0,-4,-1,1196,-1,1196,-1,1196,-1,1196,-14,1196,-14,1196,-1,1196,-22,1196,1196,-9,1196,-3,1196,1196,-1,1196,1196,1196,1196,-1,1196,1196,1196,1196,1196,1196,1196,1196,-1,1196,1196,1196,1196,1196,1196,1196,1196,-2,1196,1196,-5,1196,1196,-2,1196,-23,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196,1196],
sm942=[0,1197,1197,1197,-1,0,-4,0,-4,-1,1197,-1,1197,-1,1197,-1,1197,-14,1197,-14,1197,-1,1197,-22,1197,1197,-9,1197,-3,1197,1197,-1,1197,1197,1197,1197,-1,1197,1197,1197,1197,1197,1197,1197,1197,-1,1197,1197,1197,1197,1197,1197,1197,1197,-2,1197,1197,-5,1197,1197,-2,1197,-23,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197,1197],
sm943=[0,1198,1198,1198,-1,0,-4,0,-4,-1,1198,-1,1198,-1,1198,-1,1198,-14,1198,-14,1198,-1,1198,-22,1198,1198,-9,1198,-3,1198,1198,-1,1198,1198,1198,1198,-1,1198,1198,1198,1198,1198,1198,1198,1198,-1,1198,1198,1198,1198,1198,1198,1198,1198,-2,1198,1198,-5,1198,1198,-2,1198,-23,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198,1198],
sm944=[0,1199,1199,1199,-1,0,-4,0,-4,-1,1199,-1,1199,-1,1199,-1,1199,-14,1199,-14,1199,-1,1199,-22,1199,1199,-9,1199,-3,1199,1199,-1,1199,1199,1199,1199,-1,1199,1199,1199,1199,1199,1199,1199,1199,-1,1199,1199,1199,1199,1199,1199,1199,1199,-2,1199,1199,-5,1199,1199,-2,1199,-23,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199,1199],
sm945=[0,1200,1200,1200,-1,0,-4,0,-4,-1,1200,-1,1200,-1,1200,-1,1200,-14,1200,-14,1200,-1,1200,-22,1200,1200,-9,1200,-3,1200,1200,-1,1200,1200,1200,1200,-1,1200,1200,1200,1200,1200,1200,1200,1200,-1,1200,1200,1200,1200,1200,1200,1200,1200,-2,1200,1200,-5,1200,1200,-2,1200,-23,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200],
sm946=[0,-4,0,-4,0,-4,-1,-38,1201,-60,928],
sm947=[0,1202,1202,1202,-1,0,-4,0,-4,-1,1202,-1,1202,-1,1202,-1,1202,-14,1202,-14,1202,-1,1202,-22,1202,1202,-9,1202,-3,1202,1202,-1,1202,1202,1202,1202,-1,1202,1202,1202,1202,1202,1202,1202,1202,-1,1202,1202,1202,1202,1202,1202,1202,1202,-2,1202,1202,-5,1202,1202,-2,1202,-23,1202,1202,1202,1202,1202,1202,1202,1202,1202,1202,1202,1202],
sm948=[0,-4,0,-4,0,-4,-1,-38,1203,-41,1203,-18,1203],
sm949=[0,-4,0,-4,0,-4,-1,-38,1204,-60,928],
sm950=[0,-4,0,-4,0,-4,-1,-75,1205],
sm951=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,1206,-22,7,8,-9,9,-3,10,11,-3,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,1206,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm952=[0,1207,1207,1207,-1,0,-4,0,-4,-1,1207,-1,1207,-1,1207,-1,1207,-14,1207,-14,1207,-1,1207,-22,1207,1207,-9,1207,-3,1207,1207,-1,1207,1207,1207,1207,-1,1207,1207,1207,1207,1207,1207,1207,1207,-1,1207,1207,1207,1207,1207,1207,1207,1207,-1,1207,1207,1207,-5,1207,1207,-2,1207,-23,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207],
sm953=[0,-4,0,-4,0,-4,-1,-38,1208],
sm954=[0,1209,1209,1209,-1,0,-4,0,-4,-1,1209,-1,1209,-1,1209,1209,1209,1209,-2,1209,1209,-3,1209,-5,1209,1209,-12,1209,1209,-1,1209,-14,1209,1209,-1,1209,-4,1209,1209,1209,1209,1209,1209,1209,-1,1209,-2,1209,-2,1209,1209,1209,-1,1209,1209,1209,1209,-1,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,-2,1209,1209,-5,1209,1209,-2,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209],
sm955=[0,1210,1210,1210,-1,0,-4,0,-4,-1,1210,-1,1210,-1,1210,1210,1210,1210,-2,1210,1210,-3,1210,-5,1210,1210,-12,1210,1210,-1,1210,-14,1210,1210,-1,1210,-4,1210,1210,1210,1210,1210,1210,1210,-1,1210,-2,1210,-2,1210,1210,1210,-1,1210,1210,1210,1210,-1,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,-2,1210,1210,-5,1210,1210,-2,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210,1210],
sm956=[0,1211,1211,1211,-1,0,-4,0,-4,-1,1211,-1,1211,-1,1211,1211,1211,1211,-2,1211,1211,-3,1211,-5,1211,1211,-12,1211,1211,-1,1211,-14,1211,1211,-1,1211,-4,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,-2,1211,1211,1211,-1,1211,1211,1211,1211,-1,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-2,1211,1211,-5,1211,1211,-2,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211],
sm957=[0,1212,1212,1212,-1,1212,1212,1212,1212,1212,1212,-7,1212,-1,1212,-1,1212,1212,-6,1212,-6,1212,-1,1212,-1,1212,-3,1212,-6,1212,-35,1212,-98,1212],
sm958=[0,-2,387,-1,0,-4,0,-4,-1,-2,1213,-3,791,-7,1213,-6,1213,-14,1213,-3,1213,-6,792,-2,793,-13,1213,1213,1213,-5,1213,-2,1213],
sm959=[0,-2,1213,-1,0,-4,0,-4,-1,-2,1213,-11,1213,-6,1213,-13,963,1213,-3,1213,-23,1213,1213,1213,-5,1213,-2,1213],
sm960=[0,-2,1214,-1,0,-4,0,-4,-1,-2,1214,-3,1214,1214,-6,1214,-6,1214,-14,1214,-2,1214,1214,-6,1214,-2,1214,-13,1214,1214,1214,-5,1214,-2,1214],
sm961=[0,-4,0,-4,0,-3,1215,-1,-144,1215],
sm962=[0,-4,0,-4,0,-3,1216,-1,-145,1216],
sm963=[0,-4,0,-4,0,-4,-1,-7,1217],
sm964=[0,-4,0,-4,0,-4,-1,-38,1218],
sm965=[0,-2,387,-1,0,-4,0,-4,-1,-14,389,-6,390,-14,391,-1,1219,-25,393,394,395,-8,396],
sm966=[0,-2,1220,-1,0,-4,0,-4,-1,-14,1220,-6,1220,-14,1220,-1,1220,-25,1220,1220,1220,-8,1220],
sm967=[0,-2,1221,-1,0,-4,0,-4,-1,-2,1221,-11,1221,-6,1221,-13,1221,1221,-3,1221,-23,1221,1221,1221,-5,1221,-2,1221],
sm968=[0,-2,1222,-1,0,-4,0,-4,-1,-2,1222,-11,1222,-6,1222,-13,1222,1222,-3,1222,-23,1222,1222,1222,-5,1222,-2,1222],
sm969=[0,-2,1223,-1,0,-4,0,-4,-1,-2,1223,-11,1223,-6,1223,-13,1223,1223,-3,1223,-23,1223,1223,1223,-5,1223,-2,1223],
sm970=[0,-2,969,-1,0,-4,0,-4,-1,-2,969,-11,969,-6,969,-13,969,969,-3,969,-4,970,-18,969,969,969,-5,969,-2,969],
sm971=[0,-2,1224,-1,0,-4,0,-4,-1,-2,1224,-4,1224,-6,1224,-6,1224,-13,1224,1224,-3,1224,-4,1224,-18,1224,1224,1224,-5,1224,-2,1224],
sm972=[0,-2,1225,-1,0,-4,0,-4,-1,-2,1225,-4,1225,-6,1225,-6,1225,-13,1225,1225,-3,1225,-5,1225,-17,1225,1225,1225,-5,1225,-2,1225],
sm973=[0,-2,1226,-1,0,-4,0,-4,-1,-2,1226,-4,1226,-6,1226,-6,1226,-13,1226,1226,-3,1226,-4,1226,-18,1226,1226,1226,-5,1226,-2,1226],
sm974=[0,-2,1227,-1,0,-4,0,-4,-1,-2,1227,-4,1227,-6,1227,-6,1227,-13,1227,1227,-3,1227,-5,1227,-17,1227,1227,1227,-5,1227,-2,1227],
sm975=[0,-2,1228,-1,0,-4,0,-4,-1,-2,1228,-4,1228,-6,1228,-6,1228,-13,1228,1228,-3,1228,-4,1228,1228,-17,1228,1228,1228,-5,1228,-2,1228],
sm976=[0,-2,1229,-1,0,-4,0,-4,-1,-2,1229,-4,1229,-6,1229,-6,1229,-13,1229,1229,-3,1229,-4,1229,1229,-17,1229,1229,1229,-5,1229,-2,1229],
sm977=[0,-4,1124,-4,0,-3,1125,-1,-7,1230],
sm978=[0,-2,1231,-1,0,-4,0,-4,-1,-2,1231,-4,1231,-6,1231,-6,1231,-13,1231,1231,-3,1231,-4,1231,1231,-17,1231,1231,1231,-5,1231,-2,1231],
sm979=[0,-4,1232,-4,0,-3,1232,-1,-7,1232],
sm980=[0,-4,1233,-4,0,-3,1233,-1,-7,1233],
sm981=[0,-1,972,387,-1,0,-4,0,-4,-1],
sm982=[0,-1,1234,1234,-1,0,-4,0,-4,-1],
sm983=[0,-1,1234,1234,-1,0,-4,0,-4,-1,-10,1235],
sm984=[0,-2,1236,-1,0,-4,0,-4,-1],
sm985=[0,-2,1236,-1,0,-4,0,-4,-1,-10,1237],
sm986=[0,-4,0,-4,0,-4,-1,-4,1238,-2,1238,-2,1238,-4,1238,-37,1238],
sm987=[0,-1,1239,-2,0,-4,0,-4,-1],
sm988=[0,-4,0,-4,0,-4,-1,-4,1240,-2,1240,-2,1240,-4,1240,-37,1240],
sm989=[0,-4,1143,-4,0,-3,1144,-1,-7,1241],
sm990=[0,-4,1242,-4,0,-3,1242,-1,-7,1242],
sm991=[0,-4,1243,-4,0,-3,1243,-1,-7,1243],
sm992=[0,-1,1146,-2,0,-4,0,-4,-1,-38,1244,-4,1147,1148],
sm993=[0,-1,1245,-2,0,-4,0,-4,-1,-38,1245,-4,1245,1245],
sm994=[0,-4,0,-4,0,-4,-1,-35,1246,1247],
sm995=[0,-4,0,-4,0,-4,-1,-35,1248,1248],
sm996=[0,-4,0,-4,0,-4,-1,-35,1249,1249],
sm997=[0,-4,0,-4,0,-4,-1,-54,1250],
sm998=[0,-4,0,-4,0,-4,-1,-38,1251],
sm999=[0,-4,0,-4,0,-4,-1,-7,1252,-28,1252,-8,1252],
sm1000=[0,-4,0,-4,0,-4,-1,-7,1253,-28,1253,-9,1253],
sm1001=[0,-4,0,-4,0,-4,-1,-7,1254,-28,1254,-8,1254],
sm1002=[0,-4,0,-4,0,-4,-1,-7,1255,-28,1255,-9,1255],
sm1003=[0,-4,0,-4,0,-4,-1,-7,1256,-28,1256,-8,1256,1256],
sm1004=[0,-4,0,-4,0,-4,-1,-7,1257,-28,1257,-8,1257,1257],
sm1005=[0,-4,0,-4,0,-4,-1,-7,1258],
sm1006=[0,-2,1259,-1,0,-4,0,-4,-1,-2,1259,-11,1259,-6,1259,-14,1259,-1,1259,-1,1259,-23,1259,1259,1259,-8,1259],
sm1007=[0,-2,1260,-1,0,-4,0,-4,-1,-38,1260,-1,1260,-31,1260],
sm1008=[0,-2,1261,-1,0,-4,0,-4,-1,-7,1261,-30,1261,-1,1261,-31,1261],
sm1009=[0,-2,998,-1,999,-4,0,-3,1000,-1,-6,1001,1262,-30,1262,-1,1262,-31,1262,-68,1262],
sm1010=[0,-4,0,-4,0,-4,-1,-74,1263],
sm1011=[0,-2,1264,-1,1264,-4,0,-3,1264,-1,-6,1264,1264,-30,1264,-1,1264,-31,1264,-68,1264],
sm1012=[0,-2,998,-1,999,-4,0,-3,1000,-1,-6,1001,1265],
sm1013=[0,-4,0,-4,0,-4,-1,-22,1266],
sm1014=[0,-2,1267,-1,0,-4,0,-4,-1,-7,1267,-6,1267,1267,-5,1267,-13,1267,1267,-24,1267,1267,1267,1267,1267,1267,-8,1267],
sm1015=[0,-4,0,-4,0,-4,-1,-22,1268],
sm1016=[0,-2,1269,-1,0,-4,0,-4,-1,-7,1269,-6,1269,1269,-5,1269,-13,1269,1269,-24,1269,1269,1269,1269,1269,1269,-8,1269],
sm1017=[0,1212,1212,1212,-1,1212,1212,1212,1212,1212,1212,-4,-1,-2,1212,-1,1212,-1,1212,1212,-6,1212,-6,1212,-1,1212,-1,1212,-3,1212,-6,1212,-35,1212,-98,1212],
sm1018=[0,-1,249,250,-1,251,252,253,254,255,1032,-4,-1,-19,1270,-151,256],
sm1019=[0,-1,1271,1271,-1,1271,1271,1271,1271,1271,1271,-4,-1,-2,1271,-1,1271,-1,1271,-14,1271,-1,1271,-1,1271,-3,1271,-6,1271,-134,1271],
sm1020=[0,-1,1272,1272,-1,1272,1272,1272,1272,1272,1272,-4,-1,-19,1272,-151,1272],
sm1021=[0,-1,249,250,-1,251,252,253,254,255,1273,-4,-1,-19,1273,-151,256],
sm1022=[0,-1,1274,1274,-1,1274,1274,1274,1274,1274,1274,-4,-1,-19,1274,-151,1274],
sm1023=[0,-4,0,-4,0,-4,-1,-7,1275],
sm1024=[0,-4,0,-4,0,-4,-1,-7,1276],
sm1025=[0,-4,-1,-4,0,-9,508,508,1186,1187,-2,508,508,-3,508,-5,508,-13,508,-17,508,508,-1,508,-4,508,-1,508,508,508,508,508,-1,508,-6,508,-28,508,-9,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,508,-4,508,508],
sm1026=[0,-1,1,2,-1,0,-4,0,-11,5,1277,-13,80,-14,158,-24,7,8,-13,10,11,-3,13,14,-8,21,-18,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm1027=[0,-1,1278,1278,-1,1278,1278,1278,1278,1278,1278,-7,1278,-1,1278,1278,1278,1278,-6,1278,1278,-5,1278,1278,1278,1278,1278,1278,-2,1278,-6,1278,-1,1278,-105,1278,1278,-25,1278],
sm1028=[0,-4,0,-4,0,-4,-1,-38,1279],
sm1029=[0,-4,0,-4,0,-4,-1,-38,1280],
sm1030=[0,1281,1281,1281,-1,0,-4,0,-4,-1,1281,-1,1281,-1,1281,-1,1281,-14,1281,-14,1281,-1,1281,-22,1281,1281,-9,1281,-3,1281,1281,-1,1281,1281,1281,1281,-1,1281,1281,1281,1281,1281,1281,1281,1281,-1,1281,1281,1281,1281,1281,1281,1281,1281,-2,1281,1281,-5,1281,1281,-2,1281,-23,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281,1281],
sm1031=[0,1282,1282,1282,-1,0,-4,0,-4,-1,1282,-1,1282,-1,1282,-1,1282,-14,1282,-14,1282,-1,1282,-22,1282,1282,-9,1282,-3,1282,1282,-1,1282,1282,1282,1282,-1,1282,1282,1282,1282,1282,1282,1282,1282,-1,1282,1282,1282,1282,1282,1282,1282,1282,-2,1282,1282,-5,1282,1282,-2,1282,-23,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282,1282],
sm1032=[0,1283,1283,1283,-1,0,-4,0,-4,-1,1283,-1,1283,-1,1283,-1,1283,-14,1283,-14,1283,-1,1283,-22,1283,1283,-9,1283,-3,1283,1283,-1,1283,1283,1283,1283,-1,1283,1283,1283,1283,1283,1283,1283,1283,-1,1283,1283,1283,1283,1283,1283,1283,1283,-2,1283,1283,-5,1283,1283,-2,1283,-23,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283,1283],
sm1033=[0,1284,1284,1284,-1,0,-4,0,-4,-1,1284,-1,1284,-1,1284,-1,1284,-14,1284,-14,1284,-1,1284,-22,1284,1284,-9,1284,-3,1284,1284,-1,1284,1284,1284,1284,-1,1284,1284,1284,1284,1284,1284,1284,1284,-1,1284,1284,1284,1284,1284,1284,1284,1284,-2,1284,1284,-5,1284,1284,-2,1284,-23,1284,1284,1284,1284,1284,1284,1284,1284,1284,1284,1284,1284],
sm1034=[0,-4,0,-4,0,-4,-1,-38,1285],
sm1035=[0,1286,1286,1286,-1,0,-4,0,-4,-1,1286,-1,1286,-1,1286,-1,1286,-14,1286,-14,1286,-1,1286,-22,1286,1286,-9,1286,-3,1286,1286,-1,1286,1286,1286,1286,-1,1286,1286,1286,1286,1286,1286,1286,1286,-1,1286,1286,1286,1286,1286,1286,1286,1286,-2,1286,1286,-5,1286,1286,-2,1286,-23,1286,1286,1286,1286,1286,1286,1286,1286,1286,1286,1286,1286],
sm1036=[0,-1,1,2,-1,0,-4,0,-4,-1,-4,79,-1,5,-29,6,-1,1287,-22,7,8,-9,9,-3,10,11,-2,1287,13,14,-1,15,16,-1,17,18,19,20,21,-1,22,23,24,25,26,27,1287,28,-2,29,30,-5,31,32,-2,33,-23,34,35,36,37,38,39,40,41,42,43,44,45],
sm1037=[0,-4,0,-4,0,-4,-1,-38,1288,-60,1288],
sm1038=[0,1289,1289,1289,-1,0,-4,0,-4,-1,1289,-1,1289,-1,1289,1289,1289,1289,-2,1289,1289,-3,1289,-5,1289,1289,-12,1289,1289,-1,1289,-14,1289,1289,-1,1289,-4,1289,1289,1289,1289,1289,1289,1289,-1,1289,-2,1289,-2,1289,1289,1289,-1,1289,1289,1289,1289,-1,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,-2,1289,1289,-5,1289,1289,-2,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289,1289],
sm1039=[0,-2,1290,-1,0,-4,0,-4,-1,-2,1290,-11,1290,-6,1290,-13,963,1290,-3,1290,-23,1290,1290,1290,-5,1290,-2,1290],
sm1040=[0,-4,0,-4,0,-4,-1,-7,1291],
sm1041=[0,-4,0,-4,0,-4,-1,-7,1292],
sm1042=[0,-4,0,-4,0,-4,-1,-6,976,-68,804],
sm1043=[0,-2,1293,-1,0,-4,0,-4,-1,-2,1293,-3,1293,-7,1293,-6,1293,-14,1293,-2,1293,1293,-6,1293,-2,1293,-13,1293,1293,1293,-5,1293,-2,1293],
sm1044=[0,-4,0,-4,0,-4,-1,-72,1294],
sm1045=[0,-2,1295,-1,0,-4,0,-4,-1,-14,1295,-6,1295,-14,1295,-1,1295,-25,1295,1295,1295,-8,1295],
sm1046=[0,-2,1296,-1,0,-4,0,-4,-1,-2,1296,-4,1296,-6,1296,-6,1296,-13,1296,1296,-3,1296,-4,1296,1296,-17,1296,1296,1296,-5,1296,-2,1296],
sm1047=[0,-4,1297,-4,0,-3,1297,-1,-7,1297],
sm1048=[0,-4,0,-4,0,-4,-1,-7,1298],
sm1049=[0,-4,0,-4,0,-4,-1,-7,1138],
sm1050=[0,-4,0,-4,0,-4,-1,-7,1126],
sm1051=[0,-4,0,-4,0,-4,-1,-7,1299],
sm1052=[0,-1,1300,1300,-1,0,-4,0,-4,-1],
sm1053=[0,-4,0,-4,0,-4,-1,-15,1301],
sm1054=[0,-4,0,-4,0,-4,-1,-4,1302,-48,1303],
sm1055=[0,-2,1304,-1,0,-4,0,-4,-1],
sm1056=[0,-4,0,-4,0,-4,-1,-4,1305,-2,1305,-2,1305,-4,1305,-37,1305],
sm1057=[0,-4,1306,-4,0,-3,1306,-1,-7,1306],
sm1058=[0,-4,0,-4,0,-4,-1,-72,1307],
sm1059=[0,-1,1308,-2,0,-4,0,-4,-1,-38,1308,-4,1308,1308],
sm1060=[0,-4,0,-4,0,-4,-1,-35,1309,1309],
sm1061=[0,-4,0,-4,0,-4,-1,-72,1310],
sm1062=[0,-4,0,-4,0,-4,-1,-7,1311,-28,1311,-8,1311,1311],
sm1063=[0,-2,1312,-1,0,-4,0,-4,-1,-7,1312,-30,1312,-1,1312,-31,1312],
sm1064=[0,-2,1313,-1,1313,-4,0,-3,1313,-1,-6,1313,1313,-30,1313,-1,1313,-31,1313,-68,1313],
sm1065=[0,-2,1314,-1,0,-4,0,-4,-1,-7,1314,-6,1314,1314,-5,1314,-13,1314,1314,-24,1314,1314,1314,1314,1314,1314,-8,1314],
sm1066=[0,-1,1315,1315,-1,1315,1315,1315,1315,1315,1315,-4,-1,-2,1315,-1,1315,-1,1315,-14,1315,-1,1315,-1,1315,-3,1315,-6,1315,-134,1315],
sm1067=[0,-1,1316,1316,-1,1316,1316,1316,1316,1316,1316,-4,-1,-2,1316,-1,1316,-1,1316,1316,-6,1316,-6,1316,-1,1316,1316,1316,1316,-2,1316,-6,1316,-1,1316,-132,1316],
sm1068=[0,-4,0,-4,0,-12,1317],
sm1069=[0,-4,-1,-4,0,-12,1318],
sm1070=[0,-1,1319,1319,-1,0,-4,0,-4,-1,-21,1319,-13,1319,-2,1319,-33,1319,-4,1319,-29,1319,1319,1319,-34,1319,1319,-3,1319],
sm1071=[0,-1,1320,1320,-1,0,-4,0,-4,-1,-21,1320,-13,1320,-2,1320,-33,1320,-4,1320,-29,1320,1320,1320,-34,1320,1320,-3,1320],
sm1072=[0,-4,0,-4,0,-4,-1,-38,1321],
sm1073=[0,1322,1322,1322,-1,0,-4,0,-4,-1,1322,-1,1322,-1,1322,-1,1322,-14,1322,-14,1322,-1,1322,-22,1322,1322,-9,1322,-3,1322,1322,-1,1322,1322,1322,1322,-1,1322,1322,1322,1322,1322,1322,1322,1322,-1,1322,1322,1322,1322,1322,1322,1322,1322,-2,1322,1322,-5,1322,1322,-2,1322,-23,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322,1322],
sm1074=[0,1323,1323,1323,-1,0,-4,0,-4,-1,1323,-1,1323,-1,1323,-1,1323,-14,1323,-14,1323,-1,1323,-22,1323,1323,-9,1323,-3,1323,1323,-1,1323,1323,1323,1323,-1,1323,1323,1323,1323,1323,1323,1323,1323,-1,1323,1323,1323,1323,1323,1323,1323,1323,-2,1323,1323,-5,1323,1323,-2,1323,-23,1323,1323,1323,1323,1323,1323,1323,1323,1323,1323,1323,1323],
sm1075=[0,-4,0,-4,0,-4,-1,-38,1324,-41,1324,-18,1324],
sm1076=[0,-2,1325,-1,0,-4,0,-4,-1,-2,1325,-3,1325,-7,1325,-6,1325,-14,1325,-3,1325,-6,1325,-2,1325,-13,1325,1325,1325,-5,1325,-2,1325],
sm1077=[0,-1,1326,1326,-1,0,-4,0,-4,-1,-10,1327],
sm1078=[0,-1,1328,1328,-1,0,-4,0,-4,-1],
sm1079=[0,-2,387,-1,0,-4,0,-4,-1,-38,1329,-1,392,-31,1330],
sm1080=[0,-4,0,-4,0,-4,-1,-35,1331,1331],
sm1081=[0,-4,-1,-4,0,-12,1332],
sm1082=[0,-1,1333,1333,-1,1333,1333,1333,1333,1333,1333,-7,1333,-1,1333,1333,1333,1333,-6,1333,1333,-5,1333,1333,1333,1333,1333,1333,-2,1333,-6,1333,-1,1333,-105,1333,1333,-25,1333],
sm1083=[0,-1,1334,1334,-1,0,-4,0,-4,-1,-21,1334,-13,1334,-2,1334,-33,1334,-4,1334,-29,1334,1334,1334,-34,1334,1334,-3,1334],
sm1084=[0,-4,0,-4,0,-4,-1,-7,1335],
sm1085=[0,-1,1336,1336,-1,0,-4,0,-4,-1],
sm1086=[0,-4,0,-4,0,-4,-1,-38,1337],
sm1087=[0,-1,1338,-2,0,-4,0,-4,-1,-38,1338,-4,1338,1338],
sm1088=[0,-1,1339,1339,-1,1339,1339,1339,1339,1339,1339,-7,1339,-1,1339,1339,1339,1339,-6,1339,1339,-5,1339,1339,1339,1339,1339,1339,-2,1339,-6,1339,-1,1339,-105,1339,1339,-25,1339],
sm1089=[0,-1,1340,-2,0,-4,0,-4,-1,-38,1340,-4,1340,1340],

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
sm102,
sm102,
sm103,
sm104,
sm105,
sm106,
sm106,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
sm107,
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
sm211,
sm184,
sm184,
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
sm234,
sm234,
sm234,
sm234,
sm234,
sm234,
sm234,
sm235,
sm236,
sm237,
sm238,
sm238,
sm238,
sm238,
sm239,
sm239,
sm106,
sm106,
sm240,
sm241,
sm242,
sm243,
sm244,
sm245,
sm245,
sm43,
sm246,
sm247,
sm248,
sm249,
sm250,
sm251,
sm252,
sm251,
sm43,
sm253,
sm254,
sm255,
sm255,
sm256,
sm256,
sm257,
sm257,
sm114,
sm258,
sm259,
sm260,
sm261,
sm262,
sm154,
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
sm273,
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
sm282,
sm283,
sm284,
sm285,
sm286,
sm287,
sm288,
sm288,
sm288,
sm288,
sm289,
sm289,
sm289,
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
sm302,
sm43,
sm303,
sm304,
sm305,
sm306,
sm307,
sm308,
sm309,
sm310,
sm43,
sm311,
sm312,
sm313,
sm314,
sm315,
sm316,
sm317,
sm318,
sm317,
sm319,
sm320,
sm321,
sm322,
sm323,
sm324,
sm325,
sm326,
sm327,
sm201,
sm328,
sm329,
sm329,
sm330,
sm71,
sm331,
sm43,
sm331,
sm332,
sm333,
sm334,
sm154,
sm335,
sm336,
sm337,
sm338,
sm339,
sm340,
sm341,
sm342,
sm71,
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
sm71,
sm356,
sm71,
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
sm83,
sm368,
sm369,
sm370,
sm371,
sm372,
sm373,
sm374,
sm375,
sm374,
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
sm386,
sm387,
sm71,
sm388,
sm388,
sm389,
sm390,
sm391,
sm392,
sm393,
sm394,
sm395,
sm394,
sm396,
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
sm406,
sm407,
sm408,
sm409,
sm410,
sm411,
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
sm422,
sm422,
sm422,
sm423,
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
sm445,
sm446,
sm446,
sm446,
sm446,
sm447,
sm448,
sm449,
sm450,
sm451,
sm452,
sm452,
sm452,
sm392,
sm453,
sm454,
sm453,
sm455,
sm456,
sm457,
sm458,
sm458,
sm459,
sm460,
sm461,
sm462,
sm463,
sm460,
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
sm475,
sm476,
sm477,
sm478,
sm479,
sm480,
sm481,
sm482,
sm43,
sm483,
sm484,
sm485,
sm486,
sm487,
sm488,
sm489,
sm489,
sm490,
sm491,
sm492,
sm493,
sm154,
sm494,
sm495,
sm496,
sm497,
sm498,
sm154,
sm43,
sm499,
sm500,
sm501,
sm502,
sm503,
sm504,
sm505,
sm506,
sm507,
sm71,
sm508,
sm508,
sm509,
sm510,
sm511,
sm512,
sm513,
sm514,
sm514,
sm515,
sm516,
sm71,
sm517,
sm518,
sm519,
sm520,
sm519,
sm519,
sm521,
sm522,
sm522,
sm523,
sm75,
sm43,
sm75,
sm524,
sm525,
sm526,
sm43,
sm527,
sm528,
sm43,
sm529,
sm530,
sm531,
sm532,
sm533,
sm532,
sm532,
sm534,
sm535,
sm71,
sm535,
sm71,
sm536,
sm75,
sm537,
sm71,
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
sm555,
sm556,
sm556,
sm557,
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
sm568,
sm569,
sm570,
sm571,
sm408,
sm572,
sm573,
sm574,
sm575,
sm576,
sm577,
sm578,
sm579,
sm580,
sm572,
sm581,
sm582,
sm582,
sm582,
sm582,
sm583,
sm584,
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
sm594,
sm594,
sm595,
sm595,
sm596,
sm597,
sm598,
sm423,
sm599,
sm600,
sm601,
sm423,
sm602,
sm603,
sm567,
sm567,
sm567,
sm604,
sm605,
sm606,
sm607,
sm608,
sm609,
sm610,
sm611,
sm612,
sm442,
sm613,
sm442,
sm614,
sm615,
sm616,
sm616,
sm616,
sm616,
sm617,
sm617,
sm617,
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
sm453,
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
sm647,
sm647,
sm647,
sm647,
sm647,
sm647,
sm647,
sm647,
sm93,
sm463,
sm613,
sm648,
sm649,
sm650,
sm651,
sm652,
sm652,
sm653,
sm654,
sm655,
sm656,
sm657,
sm658,
sm659,
sm71,
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
sm677,
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
sm687,
sm75,
sm688,
sm689,
sm690,
sm75,
sm691,
sm43,
sm692,
sm693,
sm693,
sm694,
sm695,
sm696,
sm697,
sm698,
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
sm710,
sm710,
sm711,
sm712,
sm713,
sm714,
sm715,
sm716,
sm716,
sm716,
sm716,
sm716,
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
sm725,
sm726,
sm727,
sm728,
sm729,
sm730,
sm731,
sm423,
sm732,
sm733,
sm733,
sm734,
sm734,
sm735,
sm736,
sm737,
sm738,
sm738,
sm739,
sm740,
sm741,
sm742,
sm742,
sm743,
sm744,
sm745,
sm571,
sm746,
sm746,
sm747,
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
sm768,
sm768,
sm768,
sm768,
sm769,
sm572,
sm770,
sm771,
sm772,
sm773,
sm721,
sm774,
sm775,
sm776,
sm721,
sm442,
sm777,
sm778,
sm779,
sm780,
sm781,
sm782,
sm783,
sm783,
sm784,
sm785,
sm786,
sm628,
sm787,
sm788,
sm788,
sm788,
sm789,
sm790,
sm791,
sm792,
sm793,
sm794,
sm628,
sm795,
sm796,
sm796,
sm796,
sm797,
sm798,
sm799,
sm799,
sm800,
sm801,
sm802,
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
sm827,
sm828,
sm828,
sm829,
sm830,
sm831,
sm830,
sm75,
sm832,
sm833,
sm834,
sm75,
sm835,
sm75,
sm75,
sm836,
sm75,
sm837,
sm75,
sm75,
sm838,
sm75,
sm839,
sm840,
sm841,
sm842,
sm843,
sm43,
sm844,
sm83,
sm845,
sm846,
sm847,
sm848,
sm849,
sm850,
sm851,
sm852,
sm853,
sm854,
sm853,
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
sm869,
sm870,
sm569,
sm871,
sm872,
sm873,
sm874,
sm875,
sm876,
sm877,
sm736,
sm878,
sm736,
sm879,
sm880,
sm881,
sm882,
sm736,
sm883,
sm883,
sm883,
sm884,
sm885,
sm886,
sm887,
sm887,
sm888,
sm889,
sm870,
sm890,
sm891,
sm892,
sm893,
sm744,
sm894,
sm744,
sm895,
sm896,
sm897,
sm572,
sm898,
sm899,
sm900,
sm901,
sm902,
sm903,
sm904,
sm759,
sm905,
sm906,
sm906,
sm906,
sm907,
sm908,
sm908,
sm909,
sm910,
sm911,
sm856,
sm857,
sm912,
sm856,
sm857,
sm913,
sm914,
sm915,
sm916,
sm917,
sm628,
sm918,
sm791,
sm919,
sm920,
sm921,
sm921,
sm922,
sm923,
sm924,
sm628,
sm925,
sm926,
sm927,
sm928,
sm929,
sm929,
sm929,
sm929,
sm929,
sm929,
sm930,
sm930,
sm930,
sm930,
sm930,
sm930,
sm931,
sm932,
sm933,
sm201,
sm201,
sm934,
sm935,
sm936,
sm937,
sm938,
sm75,
sm75,
sm939,
sm75,
sm940,
sm941,
sm942,
sm75,
sm943,
sm944,
sm945,
sm75,
sm946,
sm947,
sm948,
sm949,
sm947,
sm950,
sm951,
sm952,
sm953,
sm954,
sm955,
sm956,
sm957,
sm958,
sm959,
sm959,
sm571,
sm960,
sm961,
sm960,
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
sm979,
sm980,
sm980,
sm981,
sm981,
sm982,
sm983,
sm982,
sm982,
sm423,
sm423,
sm423,
sm984,
sm985,
sm984,
sm984,
sm986,
sm987,
sm988,
sm988,
sm988,
sm989,
sm978,
sm990,
sm991,
sm991,
sm992,
sm993,
sm994,
sm995,
sm996,
sm996,
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
sm1014,
sm1015,
sm1015,
sm1016,
sm957,
sm957,
sm1017,
sm1018,
sm1019,
sm1020,
sm1021,
sm1022,
sm1023,
sm1024,
sm1024,
sm1025,
sm1026,
sm1027,
sm1028,
sm1029,
sm201,
sm75,
sm1030,
sm1031,
sm1032,
sm1032,
sm1033,
sm1034,
sm1035,
sm1035,
sm1036,
sm1037,
sm1038,
sm1039,
sm1040,
sm1041,
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
sm1051,
sm1052,
sm1051,
sm1053,
sm1054,
sm1055,
sm1056,
sm1046,
sm1057,
sm1058,
sm1059,
sm408,
sm889,
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
sm1075,
sm1076,
sm981,
sm1077,
sm981,
sm1078,
sm1078,
sm1079,
sm1080,
sm1081,
sm1082,
sm1083,
sm1084,
sm1085,
sm1084,
sm1086,
sm1087,
sm1088,
sm1089],

/************ Functions *************/

    max = Math.max, //Error Functions
    e$3 = (...d)=>fn.defaultError(...d), 
    eh = [e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
e$3,
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
R1440_css_TYPE_SELECTOR=function (sym,env,lex,state,output,len) {return new fn.typeselector([sym[0],sym[1]])},
R1441_css_TYPE_SELECTOR=function (sym,env,lex,state,output,len) {return new fn.typeselector([sym[0]])},
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
(...v)=>(redv(5,R00_S,1,0,...v)),
(...v)=>(redn(1031,1,...v)),
(...v)=>(redn(351239,1,...v)),
()=>(546),
(...v)=>(redn(352263,1,...v)),
()=>(550),
(...v)=>(redv(2055,R21_IMPORT_TAG_list,1,0,...v)),
()=>(598),
()=>(582),
()=>(586),
()=>(578),
()=>(558),
()=>(562),
()=>(566),
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
()=>(666),
(...v)=>(redn(354311,1,...v)),
()=>(674),
()=>(726),
()=>(694),
()=>(698),
(...v)=>(redv(177159,R00_S,1,0,...v),shftf(177159,I1730_js_javascript,...v)),
(...v)=>(redv(178183,R1740_js_start,1,0,...v)),
(...v)=>(redn(179207,1,...v)),
(...v)=>(rednv(182279,fn.statements,1,0,...v)),
(...v)=>(redv(181255,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(180231,1,...v)),
(...v)=>(redn(183303,1,...v),shftf(183303,I1790_js_module_item,...v)),
(...v)=>(redn(183303,1,...v)),
()=>(766),
()=>(762),
()=>(794),
()=>(774),
()=>(790),
(...v)=>(redn(205831,1,...v)),
(...v)=>(redn(206855,1,...v)),
(...v)=>(redn(210951,1,...v)),
()=>(798),
(...v)=>(rednv(275463,fn.expression_list,1,0,...v)),
()=>(802),
(...v)=>(redv(274439,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(273415,1,...v)),
(...v)=>(redn(302087,1,...v)),
(...v)=>(redn(317447,1,...v)),
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
(...v)=>(redn(304135,1,...v)),
()=>(874),
()=>(870),
(...v)=>(redn(305159,1,...v)),
()=>(878),
(...v)=>(redn(306183,1,...v)),
()=>(882),
(...v)=>(redn(307207,1,...v)),
()=>(886),
(...v)=>(redn(308231,1,...v)),
()=>(890),
(...v)=>(redn(309255,1,...v)),
()=>(902),
()=>(894),
()=>(898),
()=>(906),
(...v)=>(redn(310279,1,...v)),
()=>(910),
()=>(914),
()=>(918),
()=>(930),
()=>(922),
()=>(926),
(...v)=>(redn(311303,1,...v)),
()=>(934),
()=>(938),
()=>(942),
(...v)=>(redn(312327,1,...v)),
()=>(946),
()=>(950),
(...v)=>(redn(313351,1,...v)),
()=>(958),
()=>(962),
()=>(954),
(...v)=>(redn(314375,1,...v)),
(...v)=>(redn(315399,1,...v)),
(...v)=>(redn(316423,1,...v)),
()=>(966),
()=>(990),
(...v)=>(redn(276487,1,...v)),
()=>(1046),
()=>(1042),
()=>(1034),
(...v)=>(redn(277511,1,...v)),
()=>(1050),
()=>(1054),
()=>(1070),
()=>(1074),
(...v)=>(redn(278535,1,...v)),
(...v)=>(rednv(288775,fn.this_literal,1,0,...v)),
(...v)=>(redn(288775,1,...v)),
(...v)=>(redn(258055,1,...v)),
(...v)=>(redn(342023,1,...v)),
(...v)=>(redn(340999,1,...v)),
(...v)=>(redn(343047,1,...v)),
(...v)=>(redn(344071,1,...v)),
(...v)=>(rednv(345095,fn.identifier,1,0,...v)),
(...v)=>(redv(350215,R00_S,1,0,...v)),
()=>(1106),
()=>(1102),
()=>(1114),
()=>(1118),
()=>(1098),
()=>(1090),
()=>(1110),
()=>(1094),
(...v)=>(redn(346119,1,...v)),
(...v)=>(redn(331783,1,...v)),
(...v)=>(rednv(339975,fn.bool_literal,1,0,...v)),
(...v)=>(rednv(338951,fn.null_literal,1,0,...v)),
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
(...v)=>(rednv(337927,fn.numeric_literal,1,0,...v)),
()=>(1202),
()=>(1210),
()=>(1222),
()=>(1218),
(...v)=>(redn(280583,1,...v)),
(...v)=>(redn(282631,1,...v)),
()=>(1234),
()=>(1242),
()=>(1278),
()=>(1274),
(...v)=>(rednv(212999,fn.empty_statement,1,0,...v)),
()=>(1282),
(...v)=>(redn(209927,1,...v)),
()=>(1290),
(...v)=>(shftf(1294,I2141_js_iteration_statement,...v)),
()=>(1298),
()=>(1302),
()=>(1310),
()=>(1322),
()=>(1330),
()=>(1334),
()=>(1346),
()=>(1350),
(...v)=>(redn(207879,1,...v)),
()=>(1366),
()=>(1370),
(...v)=>(redn(208903,1,...v)),
()=>(1378),
(...v)=>(redv(244743,R2390_js_let_or_const,1,0,...v)),
(...v)=>(redv(244743,R2391_js_let_or_const,1,0,...v)),
(...v)=>(redv(352267,R3440_html_BODY,2,0,...v)),
(...v)=>(redv(2059,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(206859,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
()=>(1418),
()=>(1414),
()=>(1430),
()=>(1438),
()=>(1446),
()=>(1458),
()=>(1454),
()=>(1470),
()=>(1466),
()=>(1510),
()=>(1486),
()=>(1490),
()=>(1502),
()=>(1506),
()=>(1498),
()=>(1494),
()=>(1482),
(...v)=>(redn(3079,1,...v)),
(...v)=>(redn(358407,1,...v)),
(...v)=>(redn(367623,1,...v)),
()=>(1526),
()=>(1542),
()=>(1546),
(...v)=>(redv(372743,R00_S,1,0,...v)),
()=>(1538),
()=>(1530),
()=>(1534),
(...v)=>(redn(368647,1,...v)),
(...v)=>(redv(354315,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
()=>(1550),
()=>(1554),
()=>(1558),
()=>(1562),
(...v)=>(rednv(288775,fn.array_literal,1,0,...v)),
(...v)=>(rednv(288775,fn.object_literal,1,0,...v)),
()=>(1574),
()=>(1590),
()=>(1586),
()=>(1658),
()=>(1598),
()=>(1602),
()=>(1634),
()=>(1638),
()=>(1622),
(...v)=>(redn(247815,1,...v)),
(...v)=>(redn(264199,1,...v)),
(...v)=>(rednv(204807,fn.statements,1,0,...v)),
(...v)=>(redv(203783,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(202759,1,...v)),
(...v)=>(redv(181259,R20_IMPORT_TAG_list,2,0,...v)),
()=>(1670),
()=>(1674),
()=>(1678),
(...v)=>(redn(185351,1,...v)),
(...v)=>(rednv(186375,fn.default_import,1,0,...v)),
(...v)=>(redn(194567,1,...v)),
()=>(1682),
()=>(1690),
()=>(1694),
(...v)=>(redn(193543,1,...v)),
()=>(1722),
(...v)=>(redv(195595,R1912_js_export_declaration,2,0,...v)),
()=>(1742),
()=>(1746),
(...v)=>(rednv(214027,fn.expression_statement,2,0,...v)),
(...v)=>(rednv(317451,fn.post_increment_expression,2,0,...v)),
(...v)=>(rednv(317451,fn.post_decrement_expression,2,0,...v)),
(...v)=>(redn(303111,1,...v)),
(...v)=>(rednv(316427,fn.delete_expression,2,0,...v)),
()=>(1886),
(...v)=>(rednv(316427,fn.void_expression,2,0,...v)),
(...v)=>(rednv(316427,fn.typeof_expression,2,0,...v)),
(...v)=>(rednv(316427,fn.plus_expression,2,0,...v)),
(...v)=>(rednv(316427,fn.negate_expression,2,0,...v)),
(...v)=>(rednv(316427,fn.unary_or_expression,2,0,...v)),
(...v)=>(rednv(316427,fn.unary_not_expression,2,0,...v)),
(...v)=>(rednv(317451,fn.pre_increment_expression,2,0,...v)),
(...v)=>(rednv(317451,fn.pre_decrement_expression,2,0,...v)),
(...v)=>(rednv(282635,fn.call_expression,2,0,...v)),
()=>(1906),
()=>(1902),
()=>(1922),
(...v)=>(rednv(263179,fn.call_expression,2,0,...v)),
(...v)=>(redv(277515,R2710_js_new_expression,2,0,...v)),
()=>(1938),
(...v)=>(redv(350219,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(350219,R00_S,2,0,...v)),
(...v)=>(redv(348167,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(347143,1,...v)),
(...v)=>(redn(349191,1,...v)),
()=>(1950),
(...v)=>(rednv(336907,fn.string_literal,2,0,...v)),
(...v)=>(redv(333831,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(332807,1,...v)),
()=>(1958),
(...v)=>(redv(335879,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(334855,1,...v)),
(...v)=>(redv(319499,R2603_js_class_tail,2,0,...v)),
()=>(1966),
()=>(1970),
(...v)=>(redn(283659,2,...v)),
(...v)=>(rednv(318475,fn.await_expression,2,0,...v)),
()=>(1998),
(...v)=>(rednv(232459,fn.label_statement,2,0,...v)),
()=>(2018),
()=>(2014),
(...v)=>(redv(241671,R1471_css_WQ_NAME,1,0,...v)),
()=>(2026),
(...v)=>(rednv(242695,fn.binding,1,0,...v)),
(...v)=>(redn(320519,1,...v)),
()=>(2034),
()=>(2046),
()=>(2066),
()=>(2082),
()=>(2106),
()=>(2126),
()=>(2138),
()=>(2154),
()=>(2162),
(...v)=>(redv(222219,R2171_js_continue_statement,2,0,...v)),
()=>(2166),
(...v)=>(redv(223243,R2181_js_break_statement,2,0,...v)),
()=>(2170),
(...v)=>(redv(224267,R2191_js_return_statement,2,0,...v)),
()=>(2178),
()=>(2190),
()=>(2194),
(...v)=>(rednv(239627,fn.debugger_statement,2,0,...v)),
(...v)=>(rednv(265227,fn.class_statement,2,0,...v)),
()=>(2202),
()=>(2210),
()=>(2230),
()=>(2226),
()=>(2246),
()=>(2254),
()=>(2282),
()=>(2278),
(...v)=>(redv(245767,R1471_css_WQ_NAME,1,0,...v)),
()=>(2294),
()=>(2298),
(...v)=>(redv(363527,R1471_css_WQ_NAME,1,0,...v)),
(...v)=>(rednv(364551,fn.attribute,1,0,...v)),
()=>(2306),
()=>(2314),
()=>(2322),
(...v)=>(redn(365575,1,...v)),
()=>(2326),
()=>(2430),
()=>(2334),
()=>(2454),
()=>(2462),
()=>(2378),
()=>(2358),
()=>(2410),
()=>(2422),
()=>(2458),
()=>(2466),
()=>(2490),
()=>(2498),
()=>(2510),
()=>(2518),
()=>(2526),
()=>(2522),
()=>(2570),
()=>(2534),
()=>(2634),
()=>(2598),
()=>(2602),
()=>(2610),
()=>(2622),
()=>(2618),
()=>(2638),
()=>(2646),
()=>(2642),
(...v)=>(redv(357391,R3494_html_TAG,3,0,...v)),
()=>(2650),
()=>(2654),
()=>(2658),
(...v)=>(redv(373767,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
()=>(2666),
(...v)=>(redn(375815,1,...v)),
(...v)=>(redv(372747,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(372747,R00_S,2,0,...v)),
(...v)=>(redv(370695,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(369671,1,...v)),
(...v)=>(redn(371719,1,...v)),
()=>(2682),
(...v)=>(rednv(211983,fn.block_statement,3,0,...v)),
()=>(2690),
()=>(2694),
()=>(2698),
()=>(2710),
(...v)=>(redv(297995,R2603_js_class_tail,2,0,...v)),
(...v)=>(redv(299015,R1471_css_WQ_NAME,1,0,...v)),
(...v)=>(redn(300039,1,...v)),
()=>(2718),
()=>(2722),
()=>(2726),
(...v)=>(redv(290827,R2603_js_class_tail,2,0,...v)),
(...v)=>(redv(289799,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(291847,1,...v)),
()=>(2742),
()=>(2738),
(...v)=>(redn(293895,1,...v)),
(...v)=>(redn(292871,1,...v)),
(...v)=>(redv(203787,R20_IMPORT_TAG_list,2,0,...v)),
()=>(2758),
(...v)=>(redv(184335,R1801_js_import_declaration,3,0,...v)),
()=>(2778),
()=>(2782),
()=>(2786),
(...v)=>(redv(190475,R1861_js_named_imports,2,0,...v)),
(...v)=>(redv(189447,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(188423,1,...v)),
(...v)=>(redv(192519,R1880_js_import_specifier,1,0,...v)),
()=>(2790),
()=>(2794),
()=>(2798),
(...v)=>(redv(195599,R1912_js_export_declaration,3,0,...v)),
(...v)=>(redv(195599,R1913_js_export_declaration,3,0,...v)),
()=>(2802),
()=>(2806),
()=>(2810),
(...v)=>(redv(198667,R1941_js_export_clause,2,0,...v)),
(...v)=>(redv(197639,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(196615,1,...v)),
(...v)=>(redv(199687,R1950_js_export_specifier,1,0,...v)),
()=>(2814),
(...v)=>(redv(274447,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(302095,fn.assignment_expression,3,0,...v)),
()=>(2818),
(...v)=>(rednv(305167,fn.or_expression,3,0,...v)),
(...v)=>(rednv(306191,fn.and_expression,3,0,...v)),
(...v)=>(rednv(307215,fn.bit_or_expression,3,0,...v)),
(...v)=>(rednv(308239,fn.bit_xor_expression,3,0,...v)),
(...v)=>(rednv(309263,fn.bit_and_expression,3,0,...v)),
(...v)=>(rednv(310287,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(311311,fn.equality_expression,3,0,...v)),
(...v)=>(rednv(311311,fn.instanceof_expression,3,0,...v)),
(...v)=>(rednv(311311,fn.in_expression,3,0,...v)),
(...v)=>(rednv(312335,fn.left_shift_expression,3,0,...v)),
(...v)=>(rednv(312335,fn.right_shift_expression,3,0,...v)),
(...v)=>(rednv(312335,fn.right_shift_fill_expression,3,0,...v)),
(...v)=>(rednv(313359,fn.add_expression,3,0,...v)),
(...v)=>(rednv(313359,fn.subtract_expression,3,0,...v)),
(...v)=>(rednv(314383,fn.multiply_expression,3,0,...v)),
(...v)=>(rednv(314383,fn.divide_expression,3,0,...v)),
(...v)=>(rednv(314383,fn.modulo_expression,3,0,...v)),
(...v)=>(rednv(315407,fn.exponent_expression,3,0,...v)),
(...v)=>(redv(282639,R2721_js_member_expression,3,0,...v)),
()=>(2826),
()=>(2834),
()=>(2830),
()=>(2838),
(...v)=>(redv(284683,R2781_js_arguments,2,0,...v)),
(...v)=>(redn(287751,1,...v)),
()=>(2842),
(...v)=>(redv(286727,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(285703,1,...v)),
()=>(2850),
(...v)=>(redv(278543,R2721_js_member_expression,3,0,...v)),
(...v)=>(redv(278543,R2722_js_member_expression,3,0,...v)),
(...v)=>(rednv(281615,fn.new_target_expression,3,0,...v)),
(...v)=>(redv(350223,R400_wickup_CODE_BLOCK4301_group_list,3,0,...v)),
(...v)=>(redv(348171,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(rednv(336911,fn.string_literal,3,0,...v)),
(...v)=>(redv(333835,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(335883,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(319503,R3120_js_cover_parenthesized_expression_and_arrow_parameter_list,3,0,...v)),
()=>(2854),
()=>(2858),
()=>(2862),
()=>(2866),
(...v)=>(rednv(279567,fn.supper_expression,3,0,...v)),
()=>(2870),
(...v)=>(redv(257039,R2510_js_arrow_function,3,0,...v)),
(...v)=>(redn(259079,1,...v)),
(...v)=>(redv(233483,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redn(234503,1,...v)),
(...v)=>(rednv(240655,fn.variable_statement,3,0,...v)),
(...v)=>(rednv(242699,fn.binding,2,0,...v)),
(...v)=>(redn(321547,2,...v)),
()=>(2890),
()=>(2898),
()=>(2894),
(...v)=>(redn(324615,1,...v)),
(...v)=>(redn(327687,1,...v)),
()=>(2906),
(...v)=>(redn(329735,1,...v)),
(...v)=>(redn(322571,2,...v)),
()=>(2918),
()=>(2926),
()=>(2930),
()=>(2934),
(...v)=>(redn(325639,1,...v)),
(...v)=>(redn(326663,1,...v)),
(...v)=>(redn(328711,1,...v)),
()=>(2950),
()=>(2954),
()=>(2958),
()=>(2962),
()=>(2970),
()=>(2974),
()=>(2982),
()=>(2986),
(...v)=>(redn(216071,1,...v)),
(...v)=>(redn(218119,1,...v)),
(...v)=>(redn(217095,1,...v)),
()=>(3026),
()=>(3038),
(...v)=>(redv(222223,R2170_js_continue_statement,3,0,...v)),
(...v)=>(redv(223247,R2180_js_break_statement,3,0,...v)),
(...v)=>(redv(224271,R2190_js_return_statement,3,0,...v)),
()=>(3042),
(...v)=>(redv(225295,R2200_js_throw_statement,3,0,...v)),
(...v)=>(redv(235535,R2300_js_try_statement,3,0,...v)),
(...v)=>(redv(235535,R2301_js_try_statement,3,0,...v)),
()=>(3050),
(...v)=>(rednv(265231,fn.class_statement,3,0,...v)),
()=>(3062),
()=>(3066),
(...v)=>(redv(266251,R2603_js_class_tail,2,0,...v)),
(...v)=>(redn(268295,1,...v)),
(...v)=>(redv(269319,R1471_css_WQ_NAME,1,0,...v)),
(...v)=>(redn(270343,1,...v)),
(...v)=>(redv(267275,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
()=>(3082),
()=>(3086),
()=>(3090),
(...v)=>(redn(250887,1,...v)),
()=>(3094),
(...v)=>(redn(252935,1,...v)),
(...v)=>(redv(251911,R1471_css_WQ_NAME,1,0,...v)),
(...v)=>(redn(253959,1,...v)),
(...v)=>(rednv(243727,fn.lexical,3,0,...v)),
(...v)=>(rednv(246795,fn.binding,2,0,...v)),
()=>(3102),
()=>(3110),
(...v)=>(redv(6163,R60_IMPORT_TAG,4,0,...v)),
(...v)=>(redv(363531,R1620_css_declaration_list,2,0,...v)),
()=>(3122),
()=>(3134),
()=>(3138),
(...v)=>(redv(365579,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
()=>(3142),
()=>(3150),
()=>(3154),
()=>(3158),
(...v)=>(rednv(59399,fn.stylesheet,1,0,...v)),
(...v)=>(redv(64519,R632_css_STYLE_SHEET,1,0,...v)),
(...v)=>(redv(64519,R631_css_STYLE_SHEET,1,0,...v)),
(...v)=>(redv(61447,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(60423,1,...v)),
()=>(3178),
()=>(3182),
()=>(3194),
()=>(3190),
()=>(3186),
(...v)=>(redv(63495,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(62471,1,...v)),
()=>(3202),
()=>(3198),
(...v)=>(redv(65543,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(140295,fn.selector,1,0,...v)),
()=>(3246),
()=>(3250),
()=>(3254),
()=>(3258),
(...v)=>(rednv(145415,fn.compoundSelector,1,0,...v)),
()=>(3282),
(...v)=>(rednv(147463,fn.typeselector,1,0,...v)),
()=>(3286),
(...v)=>(redv(147463,R1441_css_TYPE_SELECTOR,1,0,...v)),
(...v)=>(redn(148487,1,...v)),
(...v)=>(redv(150535,R1471_css_WQ_NAME,1,0,...v)),
()=>(3294),
(...v)=>(redn(149511,1,...v)),
()=>(3310),
()=>(3322),
()=>(3326),
(...v)=>(redv(176135,R00_S,1,0,...v)),
()=>(3314),
()=>(3318),
(...v)=>(redn(172039,1,...v)),
(...v)=>(redv(141319,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(151559,1,...v)),
()=>(3346),
()=>(3358),
(...v)=>(redv(144391,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(143367,1,...v)),
()=>(3370),
()=>(3374),
()=>(3378),
()=>(3386),
()=>(3390),
()=>(3394),
(...v)=>(rednv(200711,fn.script,1,0,...v)),
(...v)=>(redn(201735,1,...v)),
()=>(3402),
()=>(3406),
()=>(3410),
()=>(3418),
()=>(3422),
()=>(3426),
(...v)=>(redn(361479,1,...v)),
(...v)=>(redv(360455,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(359431,1,...v)),
(...v)=>(redn(362503,1,...v)),
()=>(3514),
(...v)=>(rednv(10247,fn.text,1,0,...v)),
()=>(3522),
()=>(3526),
()=>(3474),
()=>(3486),
()=>(3490),
()=>(3506),
()=>(3510),
(...v)=>(redv(12295,R00_S,1,0,...v)),
()=>(3534),
(...v)=>(redn(374791,1,...v)),
(...v)=>(rednv(374791,fn.text,1,0,...v)),
(...v)=>(redn(38919,1,...v)),
()=>(3550),
(...v)=>(redn(48135,1,...v)),
(...v)=>(redn(50183,1,...v)),
()=>(3578),
()=>(3574),
()=>(3570),
()=>(3562),
()=>(3566),
()=>(3618),
()=>(3594),
()=>(3622),
()=>(3602),
()=>(3606),
()=>(3610),
()=>(3614),
()=>(3598),
()=>(3626),
(...v)=>(redn(7175,1,...v)),
(...v)=>(shftf(3630,I80_BASIC_BINDING,...v)),
(...v)=>(redv(357395,R3494_html_TAG,4,0,...v)),
(...v)=>(redv(357395,R60_IMPORT_TAG,4,0,...v)),
()=>(3634),
()=>(3638),
(...v)=>(redv(356371,R2603_js_class_tail,4,0,...v)),
(...v)=>(redv(373771,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(375819,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redv(372751,R400_wickup_CODE_BLOCK4301_group_list,3,0,...v)),
(...v)=>(redv(370699,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(3646),
()=>(3650),
()=>(3654),
(...v)=>(redv(297999,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(297999,R2603_js_class_tail,3,0,...v)),
(...v)=>(redv(299019,R2920_js_element_list,2,0,...v)),
(...v)=>(redn(300043,2,...v)),
(...v)=>(rednv(301067,fn.spread_element,2,0,...v)),
()=>(3670),
(...v)=>(redv(290831,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(290831,R2603_js_class_tail,3,0,...v)),
(...v)=>(rednv(295947,fn.binding,2,0,...v)),
(...v)=>(rednv(291851,fn.spread_element,2,0,...v)),
()=>(3690),
()=>(3694),
()=>(3698),
(...v)=>(redv(184339,R1800_js_import_declaration,4,0,...v)),
(...v)=>(redv(191499,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redv(185359,R1810_js_import_clause,3,0,...v)),
(...v)=>(rednv(187407,fn.name_space_import,3,0,...v)),
()=>(3702),
(...v)=>(redv(190479,R1860_js_named_imports,3,0,...v)),
(...v)=>(redv(190479,R1861_js_named_imports,3,0,...v)),
(...v)=>(redv(195603,R1910_js_export_declaration,4,0,...v)),
(...v)=>(redv(195603,R1911_js_export_declaration,4,0,...v)),
()=>(3714),
(...v)=>(redv(198671,R1940_js_export_clause,3,0,...v)),
(...v)=>(redv(198671,R1941_js_export_clause,3,0,...v)),
(...v)=>(rednv(282643,fn.call_expression,4,0,...v)),
()=>(3730),
(...v)=>(redv(284687,R2780_js_arguments,3,0,...v)),
(...v)=>(redv(284687,R2781_js_arguments,3,0,...v)),
(...v)=>(rednv(285707,fn.spread_element,2,0,...v)),
(...v)=>(redv(278547,R2720_js_member_expression,4,0,...v)),
(...v)=>(redv(319507,R3120_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(redv(319507,R3121_js_cover_parenthesized_expression_and_arrow_parameter_list,4,0,...v)),
(...v)=>(rednv(279571,fn.supper_expression,4,0,...v)),
()=>(3746),
(...v)=>(redn(256007,1,...v)),
(...v)=>(redv(241679,R2360_js_variable_declaration_list,3,0,...v)),
(...v)=>(redv(296971,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redn(321551,3,...v)),
()=>(3754),
(...v)=>(redn(323595,2,...v)),
(...v)=>(redn(329739,2,...v)),
()=>(3766),
(...v)=>(redn(322575,3,...v)),
(...v)=>(redn(326667,2,...v)),
()=>(3770),
(...v)=>(redn(330763,2,...v)),
(...v)=>(redn(328715,2,...v)),
()=>(3802),
()=>(3806),
()=>(3814),
()=>(3822),
(...v)=>(shftf(3830,I2142_js_iteration_statement,...v)),
(...v)=>(rednv(216075,fn.variable_statement,2,0,...v)),
(...v)=>(redv(217099,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redv(218123,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redn(221191,1,...v)),
(...v)=>(redn(220171,2,...v)),
()=>(3838),
()=>(3858),
(...v)=>(redv(235539,R2302_js_try_statement,4,0,...v)),
(...v)=>(rednv(237579,fn.finally_statement,2,0,...v)),
()=>(3878),
(...v)=>(redv(266255,R2602_js_class_tail,3,0,...v)),
(...v)=>(redv(266255,R2601_js_class_tail,3,0,...v)),
(...v)=>(redv(269323,R2630_js_class_element_list,2,0,...v)),
(...v)=>(redv(270347,R2640_js_class_element,2,0,...v)),
()=>(3882),
()=>(3886),
()=>(3890),
()=>(3898),
(...v)=>(redv(250891,R1471_css_WQ_NAME,2,0,...v)),
(...v)=>(redv(245775,R2360_js_variable_declaration_list,3,0,...v)),
(...v)=>(redv(6167,R60_IMPORT_TAG,5,0,...v)),
()=>(3922),
()=>(3926),
(...v)=>(rednv(364559,fn.attribute,3,0,...v)),
(...v)=>(redn(366599,1,...v)),
()=>(3950),
()=>(3954),
()=>(3974),
()=>(3970),
()=>(3966),
()=>(3962),
()=>(3958),
(...v)=>(redv(365583,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
()=>(3982),
()=>(3986),
()=>(3990),
()=>(3994),
(...v)=>(redv(64523,R630_css_STYLE_SHEET,2,0,...v)),
(...v)=>(redv(61451,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(63499,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(69643,2,...v)),
()=>(4006),
()=>(4026),
()=>(4018),
()=>(4022),
()=>(4074),
()=>(4070),
()=>(4090),
()=>(4098),
()=>(4138),
()=>(4118),
()=>(4110),
()=>(4158),
()=>(4154),
(...v)=>(redv(165895,R00_S,1,0,...v)),
()=>(4178),
(...v)=>(redv(162823,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(161799,1,...v)),
()=>(4182),
(...v)=>(rednv(140299,fn.selector,2,0,...v)),
(...v)=>(redv(139271,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(rednv(138247,fn.comboSelector,1,0,...v)),
(...v)=>(redn(146439,1,...v)),
(...v)=>(rednv(145419,fn.compoundSelector,2,0,...v)),
(...v)=>(redv(141323,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(144395,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(147467,R1440_css_TYPE_SELECTOR,2,0,...v)),
(...v)=>(redv(150539,R1470_css_WQ_NAME,2,0,...v)),
(...v)=>(redn(149515,2,...v)),
(...v)=>(redv(176139,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(176139,R00_S,2,0,...v)),
(...v)=>(redv(174087,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(173063,1,...v)),
(...v)=>(redn(175111,1,...v)),
(...v)=>(rednv(152587,fn.idSelector,2,0,...v)),
(...v)=>(rednv(153611,fn.classSelector,2,0,...v)),
()=>(4230),
()=>(4206),
()=>(4214),
()=>(4218),
()=>(4222),
()=>(4226),
(...v)=>(rednv(159755,fn.pseudoClassSelector,2,0,...v)),
()=>(4238),
(...v)=>(rednv(160779,fn.pseudoElementSelector,2,0,...v)),
(...v)=>(redn(143371,2,...v)),
(...v)=>(redv(142343,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4246),
()=>(4250),
()=>(4254),
()=>(4258),
()=>(4262),
()=>(4266),
()=>(4270),
()=>(4274),
()=>(4278),
(...v)=>(redv(357399,R60_IMPORT_TAG,5,0,...v)),
()=>(4290),
(...v)=>(redv(360459,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(10251,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redn(13319,1,...v)),
()=>(4298),
(...v)=>(redv(21511,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4326),
(...v)=>(redv(26631,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4346),
()=>(4350),
()=>(4354),
()=>(4370),
(...v)=>(redv(33799,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4390),
(...v)=>(redn(31751,1,...v)),
(...v)=>(redv(15367,R150_wickup_HORIZONTAL_RULE,1,0,...v)),
(...v)=>(redv(20487,R00_S,1,0,...v)),
()=>(4414),
()=>(4418),
()=>(4434),
()=>(4430),
(...v)=>(redv(12299,R120_wickup_PRE_MD_BLK,2,0,...v)),
()=>(4438),
(...v)=>(redv(11271,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4442),
()=>(4446),
(...v)=>(redv(51207,R21_IMPORT_TAG_list,1,0,...v)),
()=>(4454),
()=>(4458),
()=>(4470),
()=>(4462),
()=>(4466),
()=>(4474),
(...v)=>(shftf(4478,I80_BASIC_BINDING,...v)),
()=>(4482),
(...v)=>(redn(57351,1,...v)),
(...v)=>(redv(56327,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(58375,1,...v)),
()=>(4498),
()=>(4502),
(...v)=>(redv(357399,R3496_html_TAG,5,0,...v)),
(...v)=>(redv(298003,R100_wickup_WICKUP_PLUGIN,4,0,...v)),
(...v)=>(redv(299023,R2921_js_element_list,3,0,...v)),
(...v)=>(redv(290835,R100_wickup_WICKUP_PLUGIN,4,0,...v)),
(...v)=>(redv(289807,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(rednv(291855,fn.property_binding,3,0,...v)),
()=>(4510),
(...v)=>(redn(249863,1,...v)),
()=>(4514),
(...v)=>(redv(294927,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(190483,R1860_js_named_imports,4,0,...v)),
(...v)=>(redv(189455,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(192527,R1881_js_import_specifier,3,0,...v)),
(...v)=>(redv(198675,R1940_js_export_clause,4,0,...v)),
(...v)=>(redv(197647,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(199695,R1951_js_export_specifier,3,0,...v)),
(...v)=>(rednv(304151,fn.condition_expression,5,0,...v)),
(...v)=>(redv(284691,R2780_js_arguments,4,0,...v)),
(...v)=>(redv(286735,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(4526),
()=>(4530),
(...v)=>(redv(259087,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
()=>(4534),
(...v)=>(redn(321555,4,...v)),
(...v)=>(redn(324623,3,...v)),
(...v)=>(redn(327695,3,...v)),
(...v)=>(redn(322579,4,...v)),
()=>(4538),
()=>(4546),
(...v)=>(redn(325647,3,...v)),
(...v)=>(rednv(215063,fn.if_statement,5,0,...v)),
()=>(4550),
()=>(4554),
(...v)=>(rednv(219159,fn.while_statement,5,0,...v)),
()=>(4558),
(...v)=>(shftf(4566,I2142_js_iteration_statement,...v)),
()=>(4574),
()=>(4578),
()=>(4586),
(...v)=>(shftf(4594,I2142_js_iteration_statement,...v)),
(...v)=>(shftf(4598,I2142_js_iteration_statement,...v)),
()=>(4606),
(...v)=>(redv(227351,R2220_js_switch_statement,5,0,...v)),
()=>(4614),
()=>(4634),
()=>(4630),
(...v)=>(redv(226327,R2210_js_with_statement,5,0,...v)),
()=>(4638),
(...v)=>(redn(238599,1,...v)),
(...v)=>(redv(266259,R2600_js_class_tail,4,0,...v)),
()=>(4642),
()=>(4650),
()=>(4658),
()=>(4662),
(...v)=>(redv(248855,R2437_js_function_declaration,5,0,...v)),
(...v)=>(redn(254983,1,...v)),
(...v)=>(redv(250895,R2360_js_variable_declaration_list,3,0,...v)),
(...v)=>(redv(251919,R2360_js_variable_declaration_list,3,0,...v)),
(...v)=>(redv(6171,R60_IMPORT_TAG,6,0,...v)),
()=>(4666),
(...v)=>(redn(4103,1,...v)),
()=>(4670),
()=>(4674),
(...v)=>(redn(379911,1,...v)),
(...v)=>(redv(378887,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(377863,1,...v)),
(...v)=>(redn(380935,1,...v)),
()=>(4682),
()=>(4686),
()=>(4690),
()=>(4694),
(...v)=>(redv(357403,R3494_html_TAG,6,0,...v)),
()=>(4702),
(...v)=>(redn(75791,3,...v)),
()=>(4714),
(...v)=>(redv(70663,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(71687,1,...v)),
()=>(4726),
()=>(4738),
()=>(4742),
()=>(4750),
()=>(4746),
(...v)=>(redv(93191,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(97287,1,...v)),
()=>(4766),
(...v)=>(redn(99335,1,...v)),
(...v)=>(redn(98311,1,...v)),
()=>(4782),
()=>(4790),
()=>(4834),
()=>(4810),
(...v)=>(redn(107527,1,...v)),
(...v)=>(redn(126983,1,...v)),
()=>(4846),
(...v)=>(redn(95239,1,...v)),
()=>(4850),
(...v)=>(redn(78855,1,...v)),
()=>(4854),
(...v)=>(redn(88071,1,...v)),
()=>(4874),
()=>(4882),
(...v)=>(redn(89095,1,...v)),
(...v)=>(redn(90119,1,...v)),
()=>(4898),
()=>(4906),
()=>(4902),
(...v)=>(redv(65551,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(4910),
(...v)=>(redv(66575,R651_css_STYLE_RULE,3,0,...v)),
(...v)=>(redv(165899,R1620_css_declaration_list,2,0,...v)),
(...v)=>(redv(165899,R1621_css_declaration_list,2,0,...v)),
()=>(4914),
(...v)=>(redv(164871,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(163847,1,...v)),
(...v)=>(redv(165899,R00_S,2,0,...v)),
()=>(4946),
()=>(4938),
()=>(4942),
()=>(4930),
(...v)=>(redv(139275,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(rednv(138251,fn.comboSelector,2,0,...v)),
(...v)=>(rednv(145423,fn.compoundSelector,3,0,...v)),
(...v)=>(redv(176143,R400_wickup_CODE_BLOCK4301_group_list,3,0,...v)),
(...v)=>(redv(174091,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(rednv(155663,fn.attribSelector,3,0,...v)),
()=>(4958),
()=>(4962),
(...v)=>(redn(156679,1,...v)),
(...v)=>(rednv(159759,fn.pseudoClassSelector,3,0,...v)),
(...v)=>(redv(142347,R20_IMPORT_TAG_list,2,0,...v)),
()=>(4970),
()=>(4974),
()=>(4978),
()=>(4982),
()=>(4986),
()=>(4990),
()=>(4998),
()=>(5002),
(...v)=>(redv(24587,R240_wickup_HEADER,2,0,...v)),
(...v)=>(redv(21515,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(23559,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(22535,1,...v)),
()=>(5014),
(...v)=>(redv(30731,R301_wickup_BLOCK_QUOTES,2,0,...v)),
(...v)=>(redv(26635,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(29703,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(28679,1,...v)),
(...v)=>(redn(25611,2,...v)),
()=>(5022),
()=>(5034),
(...v)=>((redn(41987,0,...v))),
()=>(5054),
(...v)=>(redv(37899,R371_wickup_UNORDERED_LIST_ITEM,2,0,...v)),
(...v)=>(redv(33803,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(36871,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(35847,1,...v)),
(...v)=>(redn(32779,2,...v)),
(...v)=>(redv(15371,R100_wickup_WICKUP_PLUGIN,2,0,...v)),
(...v)=>(redn(14343,1,...v)),
(...v)=>(redv(20491,R00_S,2,0,...v)),
(...v)=>(redv(17415,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(16391,1,...v)),
(...v)=>(redv(19463,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(18439,1,...v)),
(...v)=>(redv(11275,R20_IMPORT_TAG_list,2,0,...v)),
()=>(5070),
(...v)=>(redv(48143,R470_wickup_ITALIC_BOLD_EMPHASIS,3,0,...v)),
(...v)=>(redv(51211,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(50191,R490_wickup_BOLD_EMPHASIS,3,0,...v)),
(...v)=>(redv(52239,R510_wickup_EMPHASIS,3,0,...v)),
()=>(5074),
()=>(5078),
()=>(5094),
()=>(5090),
()=>(5086),
()=>(5082),
()=>(5098),
()=>(5102),
()=>(5118),
()=>(5114),
()=>(5110),
()=>(5106),
(...v)=>(redv(53263,R520_wickup_CODE_QUOTE,3,0,...v)),
(...v)=>(redv(56331,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(5126),
()=>(5130),
(...v)=>(redv(357403,R3495_html_TAG,6,0,...v)),
(...v)=>(redv(357403,R3491_html_TAG,6,0,...v)),
(...v)=>(redv(299027,R2921_js_element_list,4,0,...v)),
()=>(5134),
()=>(5138),
()=>(5142),
(...v)=>(redn(272391,1,...v)),
(...v)=>(redv(319515,R3122_js_cover_parenthesized_expression_and_arrow_parameter_list,6,0,...v)),
(...v)=>(redn(321559,5,...v)),
(...v)=>(redn(322583,5,...v)),
()=>(5146),
()=>(5154),
(...v)=>(shftf(5162,I2142_js_iteration_statement,...v)),
(...v)=>(shftf(5166,I2142_js_iteration_statement,...v)),
()=>(5174),
(...v)=>(redv(219163,R21414_js_iteration_statement,6,0,...v)),
(...v)=>(shftf(5190,I2142_js_iteration_statement,...v)),
(...v)=>(redv(219163,R21415_js_iteration_statement,6,0,...v)),
()=>(5206),
(...v)=>(redv(228363,R2230_js_case_block,2,0,...v)),
()=>(5214),
()=>(5226),
(...v)=>(redv(229383,R1471_css_WQ_NAME,1,0,...v)),
()=>(5234),
()=>(5246),
()=>(5250),
(...v)=>(redv(248859,R2436_js_function_declaration,6,0,...v)),
()=>(5254),
(...v)=>(redv(248859,R2435_js_function_declaration,6,0,...v)),
(...v)=>(redv(248859,R2434_js_function_declaration,6,0,...v)),
(...v)=>(redn(5135,3,...v)),
(...v)=>(redv(366607,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(376847,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(378891,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(5258),
(...v)=>(redv(357407,R60_IMPORT_TAG,7,0,...v)),
(...v)=>(redv(357407,R3493_html_TAG,7,0,...v)),
(...v)=>(redn(75795,4,...v)),
(...v)=>(redv(70667,R20_IMPORT_TAG_list,2,0,...v)),
()=>(5274),
()=>(5278),
(...v)=>(redv(134151,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(133127,1,...v)),
()=>(5286),
(...v)=>(redv(136199,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(135175,1,...v)),
(...v)=>((redn(68611,0,...v))),
(...v)=>(redn(97291,2,...v)),
(...v)=>(redn(103435,2,...v)),
(...v)=>(redn(106507,2,...v)),
(...v)=>(redv(102407,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(105479,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(100363,2,...v)),
()=>(5342),
()=>(5346),
()=>(5366),
()=>(5362),
(...v)=>(redn(125959,1,...v)),
()=>(5354),
(...v)=>(redn(108551,1,...v)),
()=>(5378),
()=>(5390),
()=>(5382),
()=>(5386),
()=>(5370),
()=>(5406),
()=>(5418),
()=>(5410),
()=>(5414),
(...v)=>(redn(123911,1,...v)),
()=>(5426),
()=>(5430),
()=>(5434),
()=>(5438),
()=>(5458),
()=>(5454),
()=>(5446),
()=>(5490),
()=>(5478),
()=>(5482),
(...v)=>(redn(88075,2,...v)),
(...v)=>(redv(84999,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(87047,R21_IMPORT_TAG_list,1,0,...v)),
()=>(5514),
()=>(5518),
()=>(5526),
(...v)=>(redv(66579,R650_css_STYLE_RULE,4,0,...v)),
(...v)=>(redv(66579,R651_css_STYLE_RULE,4,0,...v)),
(...v)=>(redv(165903,R1621_css_declaration_list,3,0,...v)),
(...v)=>(redv(162831,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(167951,fn.parseDeclaration,3,0,...v)),
()=>(5542),
(...v)=>(redn(171015,1,...v)),
(...v)=>(redv(169991,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(168967,1,...v)),
()=>(5558),
()=>(5562),
()=>(5566),
(...v)=>(redn(154631,1,...v)),
(...v)=>(redn(156683,2,...v)),
()=>(5570),
()=>(5574),
()=>(5578),
()=>(5582),
(...v)=>(redv(23563,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(30735,R300_wickup_BLOCK_QUOTES,3,0,...v)),
(...v)=>(redv(29707,R20_IMPORT_TAG_list,2,0,...v)),
()=>(5590),
(...v)=>(redv(43015,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(41991,R411_wickup_CODE_BLOCK4411_group,1,0,...v)),
(...v)=>(redv(40967,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(39943,1,...v)),
(...v)=>(redv(37903,R370_wickup_UNORDERED_LIST_ITEM,3,0,...v)),
(...v)=>(redv(36875,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(17419,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(19467,R20_IMPORT_TAG_list,2,0,...v)),
()=>(5618),
()=>(5622),
()=>(5626),
(...v)=>(redv(357407,R3492_html_TAG,7,0,...v)),
()=>(5638),
(...v)=>(redn(322587,6,...v)),
(...v)=>(rednv(215071,fn.if_statement,7,0,...v)),
(...v)=>(rednv(219167,fn.do_while_statement,7,0,...v)),
(...v)=>(shftf(5642,I2142_js_iteration_statement,...v)),
(...v)=>(redv(219167,R21413_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R2149_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R2148_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R2144_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R21412_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R21411_js_iteration_statement,7,0,...v)),
(...v)=>(redv(219167,R21410_js_iteration_statement,7,0,...v)),
()=>(5670),
(...v)=>(redv(228367,R100_wickup_WICKUP_PLUGIN,3,0,...v)),
(...v)=>(redv(229387,R2240_js_case_clauses,2,0,...v)),
()=>(5674),
()=>(5678),
(...v)=>(redv(231435,R2261_js_default_clause,2,0,...v)),
(...v)=>(rednv(236567,fn.catch_statement,5,0,...v)),
()=>(5686),
(...v)=>(redv(248863,R2433_js_function_declaration,7,0,...v)),
(...v)=>(redv(248863,R2432_js_function_declaration,7,0,...v)),
(...v)=>(redv(248863,R2431_js_function_declaration,7,0,...v)),
(...v)=>(redv(357411,R3490_html_TAG,8,0,...v)),
(...v)=>(redn(75799,5,...v)),
(...v)=>(redn(137231,3,...v)),
(...v)=>(redv(134155,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redv(136203,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(5710),
()=>(5714),
(...v)=>(redn(68615,1,...v)),
(...v)=>(redv(67591,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redv(93199,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redn(97295,3,...v)),
(...v)=>(redn(96267,2,...v)),
(...v)=>(redv(102411,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(105483,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(101387,2,...v)),
(...v)=>(redn(104459,2,...v)),
(...v)=>(redn(107535,3,...v)),
(...v)=>(redn(109583,3,...v)),
()=>(5722),
(...v)=>(redn(114703,3,...v)),
(...v)=>(redv(113671,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(112647,1,...v)),
(...v)=>(redn(116743,1,...v)),
()=>(5746),
(...v)=>(redn(117767,1,...v)),
()=>(5762),
(...v)=>(redn(131083,2,...v)),
()=>(5766),
(...v)=>(redn(130055,1,...v)),
()=>(5770),
(...v)=>(redv(111623,R401_wickup_CODE_BLOCK4301_group_list,1,0,...v)),
(...v)=>(redn(110599,1,...v)),
()=>(5778),
(...v)=>(redv(76807,R21_IMPORT_TAG_list,1,0,...v)),
()=>(5790),
()=>(5786),
(...v)=>(redv(79879,R21_IMPORT_TAG_list,1,0,...v)),
(...v)=>(redn(81927,1,...v)),
()=>(5794),
()=>(5798),
(...v)=>(redv(85003,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(87051,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(83979,2,...v)),
(...v)=>(redn(86027,2,...v)),
(...v)=>(redn(89103,3,...v)),
(...v)=>(redn(91151,3,...v)),
()=>(5802),
(...v)=>(redv(66583,R650_css_STYLE_RULE,5,0,...v)),
(...v)=>(redv(164879,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
(...v)=>(redv(167955,fn.parseDeclaration,4,0,...v)),
(...v)=>(redv(171019,R1670_css_declaration_values,2,0,...v)),
()=>(5806),
(...v)=>(redv(169995,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(5810),
()=>(5814),
(...v)=>(rednv(155671,fn.attribSelector,5,0,...v)),
(...v)=>(redn(157703,1,...v)),
(...v)=>(redn(158735,3,...v)),
()=>(5818),
(...v)=>(redv(44051,R431_wickup_CODE_BLOCK,4,0,...v)),
(...v)=>(redv(43019,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redv(41995,R410_wickup_CODE_BLOCK4411_group,2,0,...v)),
(...v)=>(redv(40971,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
()=>(5822),
(...v)=>(redn(45063,1,...v)),
()=>(5830),
(...v)=>(rednv(8215,fn.wick_binding,5,0,...v)),
()=>(5834),
()=>(5838),
(...v)=>(redv(219171,R2147_js_iteration_statement,8,0,...v)),
(...v)=>(redv(219171,R2146_js_iteration_statement,8,0,...v)),
(...v)=>(redv(219171,R2143_js_iteration_statement,8,0,...v)),
(...v)=>(redv(219171,R2145_js_iteration_statement,8,0,...v)),
()=>(5850),
(...v)=>(redv(228371,R2232_js_case_block,4,0,...v)),
(...v)=>(redv(230415,R2251_js_case_clause,3,0,...v)),
(...v)=>(redv(231439,R2260_js_default_clause,3,0,...v)),
(...v)=>(redv(248867,R2430_js_function_declaration,8,0,...v)),
(...v)=>(redn(75803,6,...v)),
()=>(5858),
(...v)=>(redn(72711,1,...v)),
(...v)=>(redn(132115,4,...v)),
(...v)=>(redn(94235,6,...v)),
(...v)=>(redv(67595,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(114707,4,...v)),
(...v)=>(redv(113675,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(redn(115727,3,...v)),
(...v)=>(redn(122895,3,...v)),
(...v)=>(redn(116747,2,...v)),
()=>(5866),
()=>(5874),
()=>(5878),
(...v)=>(redn(117771,2,...v)),
(...v)=>(redn(128015,3,...v)),
(...v)=>(redv(111627,R400_wickup_CODE_BLOCK4301_group_list,2,0,...v)),
(...v)=>(rednv(77851,C760_css_keyframes,6,0,...v)),
(...v)=>(redv(76811,R20_IMPORT_TAG_list,2,0,...v)),
(...v)=>(redn(129035,2,...v)),
(...v)=>(redn(82971,6,...v)),
(...v)=>(redn(92179,4,...v)),
(...v)=>(redn(166923,2,...v)),
(...v)=>(redv(171023,R1670_css_declaration_values,3,0,...v)),
(...v)=>(rednv(155675,fn.attribSelector,6,0,...v)),
(...v)=>(redv(44055,R430_wickup_CODE_BLOCK,5,0,...v)),
(...v)=>(redv(46107,R450_wickup_LINK,6,0,...v)),
()=>(5890),
()=>(5894),
(...v)=>(rednv(271391,fn.class_method,7,0,...v)),
(...v)=>(rednv(271391,fn.class_get_method,7,0,...v)),
()=>(5898),
(...v)=>(redv(219175,R2140_js_iteration_statement,9,0,...v)),
(...v)=>(redv(228375,R2231_js_case_block,5,0,...v)),
(...v)=>(redv(230419,R2250_js_case_clause,4,0,...v)),
(...v)=>(redn(73747,4,...v)),
(...v)=>(redn(119815,1,...v)),
()=>(5906),
(...v)=>(redn(121863,1,...v)),
()=>(5918),
()=>(5914),
(...v)=>(redv(79887,R640_css_COMPLEX_SELECTOR_list,3,0,...v)),
()=>(5922),
(...v)=>(rednv(9247,fn.wick_binding,7,0,...v)),
(...v)=>(rednv(271395,fn.class_set_method,8,0,...v)),
(...v)=>(redn(122903,5,...v)),
(...v)=>(redn(119819,2,...v)),
()=>(5926),
(...v)=>(rednv(80915,C790_css_keyframes_blocks,4,0,...v)),
(...v)=>(rednv(9251,fn.wick_binding,8,0,...v)),
(...v)=>(rednv(80919,C790_css_keyframes_blocks,5,0,...v))],

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
nf,
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
v=>lsm(v,gt48),
v=>lsm(v,gt49),
nf,
nf,
v=>lsm(v,gt50),
nf,
nf,
nf,
v=>lsm(v,gt47),
nf,
v=>lsm(v,gt51),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt52),
nf,
v=>lsm(v,gt53),
v=>lsm(v,gt54),
nf,
nf,
v=>lsm(v,gt55),
v=>lsm(v,gt56),
nf,
v=>lsm(v,gt57),
v=>lsm(v,gt58),
v=>lsm(v,gt59),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
v=>lsm(v,gt77),
v=>lsm(v,gt78),
v=>lsm(v,gt79),
v=>lsm(v,gt80),
v=>lsm(v,gt81),
v=>lsm(v,gt82),
v=>lsm(v,gt83),
v=>lsm(v,gt84),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt85),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt86),
nf,
v=>lsm(v,gt87),
v=>lsm(v,gt88),
v=>lsm(v,gt89),
v=>lsm(v,gt90),
nf,
nf,
v=>lsm(v,gt91),
nf,
nf,
v=>lsm(v,gt92),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
nf,
nf,
v=>lsm(v,gt95),
nf,
v=>lsm(v,gt96),
v=>lsm(v,gt97),
nf,
nf,
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
v=>lsm(v,gt102),
v=>lsm(v,gt103),
v=>lsm(v,gt104),
nf,
v=>lsm(v,gt105),
v=>lsm(v,gt106),
nf,
v=>lsm(v,gt107),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt108),
nf,
v=>lsm(v,gt109),
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
v=>lsm(v,gt127),
v=>lsm(v,gt128),
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
v=>lsm(v,gt130),
nf,
v=>lsm(v,gt131),
nf,
nf,
v=>lsm(v,gt132),
v=>lsm(v,gt133),
nf,
nf,
nf,
nf,
v=>lsm(v,gt134),
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
v=>lsm(v,gt130),
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
v=>lsm(v,gt139),
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
nf,
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
nf,
v=>lsm(v,gt141),
nf,
v=>lsm(v,gt142),
nf,
nf,
nf,
nf,
v=>lsm(v,gt143),
nf,
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
nf,
nf,
v=>lsm(v,gt190),
nf,
nf,
nf,
nf,
nf,
v=>lsm(v,gt191),
nf,
nf,
nf,
nf,
v=>lsm(v,gt192),
v=>lsm(v,gt193),
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
v=>lsm(v,gt100),
v=>lsm(v,gt101),
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
nf,
v=>lsm(v,gt254),
nf,
nf,
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
nf,
nf,
nf,
nf,
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
class operator$2 extends base {

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
class add_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "+";
    }

    get type() { return types.add_expression }
}

/** AND **/
class and_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "&&";
    }

    get type() { return types.and_expression }
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

    get type() { return types.throw_statement }

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
            body_str = (this.body) ? this.body.render() : "",
            args_str = this.args.map(e => e.render()).join(","),
            id = this.id ? this.id.render() : "";

        return `function ${id}(${args_str}){${body_str}}`;
    }
}

class arrow_function_declaration extends function_declaration {
    constructor(...sym) {
        
        super(...sym);

        //Since _function boxes args into an array, pull out the argument node
        this.vals[1] = this.vals[1][0];
    }

    getRootIds(ids, closure) {
        if(this.args)
            this.args.getRootIds(ids, closure);
        this.body.getRootIds(ids,closure);
    }

    get IS_STATEMENT(){return false}

    get name() { return null }

    get type() { return types.arrow_function_declaration }

    render() {
        const
            body_str = (this.body.IS_STATEMENT || (this.body.type == types.statements && this.body.stmts.length > 1)) ? `{${this.body.render()}}` : this.body.render(),
            args_str = (this.args) ? this.args.render() : "()";
        return `${args_str} => ${body_str}`;
    }
}

/** BITWISE AND EXPRESSION **/
class bitwise_and_espression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "&";
    }

    get type () { return types.bitwise_and_espression }
}

/** BITWISE OR EXPRESSION **/
class bitwise_or_espression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "|";
    }

    get type () { return types.bitwise_or_espression }
}

/** BITWISE XOR EXPRESSION **/
class bitwise_xor_espression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "^";
    }

    get type () { return types.bitwise_xor_espression }
}

/** ASSIGNEMENT EXPRESSION **/

class assignment_expression extends operator$2 {
    constructor(sym) {
        super(sym);
        this.op = sym[1];
        //this.id.root = false;
    }
    
    getRootIds(ids, closure) { 
        this.right.getRootIds(ids, closure);
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
        
        // /if(this.args)
        // /    this.args.clearRoots();
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
    get type() { return types.call_expression }

    render() { 
        return `${this.id.render()}(${this.args.render()})` 
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

    get type() { return types.catch_statement }

    render(){
        return `catch (${this.expression})${this.body.type == types.block_statement ? this.body : `{${this.body}}`}`
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
class divide_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "/";
    }

    get type () { return types.divide_expression }
}

/** EQ **/
class equality_expression extends operator$2 {
    constructor(sym) {super(sym); this.op = sym[1];  }
    get type() { return types.equality_expression }
}

/** EXPONENT **/
class equality_expression$1 extends operator$2 {

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

    get type() { return types.for_statement }

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
class identifier$2 extends base {
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
            stmt = this.stmt.type == types.statements ? `{${this.stmt.render()}}` : this.stmt.render(),
            _else = (this.else_stmt) ? " else " + (
                this.else_stmt.type == types.statements || this.else_stmt.type == types.if_statement ? `{${this.else_stmt.render()}}` : this.else_stmt.render()
            ) : "";
        return `if(${expr})${stmt}${_else}`;
    }
}

/** IN **/
class in_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "in";
    }

    get type() { return types.in_expression }
}

/** INSTANCEOF **/
class instanceof_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "instanceof";
    }

    get type() { return types.instanceof_expression }
}

/** LEFT_SHIFT **/
class left_shift_expression extends operator$2 {

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
        this.bindings.forEach(b => b.getRootIds(ids, closure, true));
    }

    get type() { return types.lexical_declaration }

    render() { return `${this.mode} ${this.bindings.map(b=>b.render()).join(",")};` }
}

/** RETURN STATMENT  **/



class label_statement extends base {
    constructor(sym) {
        super(sym[0], sym[1]);
    }

    get id(){return this.vals[0]}
    get stmt(){return this.vals[1]}

    get type() { return types.label_statement }

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
    get type() { return types.member_expression }

    render() { 
        if(this.evaluated){
            return `${this.id.render()}[${this.mem.render()}]`;
        }else{
            return `${this.id.render()}.${this.mem.render()}`;
        }
    }
}

/** MODULO **/
class modulo_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = "%";
    }

    get type() { return types.modulo_expression }
}

/** MULTIPLY **/
class multiply_expression extends operator$2 {

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
class or_expression extends operator$2 {

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
class right_shift_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = ">>";
    }

    get type() { return types.right_shift_expression }
}

/** RIGHT SHIFT **/
class right_shift_fill_expression extends operator$2 {

    constructor(sym) {
        super(sym);
        this.op = ">>>";
    }

    get type() { return types.right_shift_fill_expression }
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

class string$3 extends base {
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
class subtract_expression extends operator$2 {

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

    get type() { return types.try_statement }

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

/** cover_parenthesized_expression_and_arrow_parameter_list **/
class argument_list$1 extends base {
    constructor(sym) {
        super((sym) ? (Array.isArray(sym) )? sym : [sym]  : []);
    }

    clearRoots(){
        this.expressions.forEach(a=>a.root = false);
    }

    get expressions() { return this.vals[0] }

    getRootIds(ids, closure) {
        this.expressions.forEach(s => s.getRootIds(ids, closure));
    }

    replaceNode(original, _new = null) {
        let index = -1;
        if ((index = super.replaceNode(original, _new, this.vals[0])) > -1) 
            this.vals[0].splice(index, 1);
    }

    * traverseDepthFirst(p) {
        yield * super.traverseDepthFirst(p, this.vals[0]);
    }

    get type() { return types.cover_parenthesized_expression_and_arrow_parameter_list }

    render() { 
        return `(${this.expressions.map(s=>(s.render())).join(",")})` ;
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

    get type() { return types.script }

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

    get type() { return types.module }

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

    get type() { return types.import_declaration }

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

    get type() { return types.import_clause }

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

    get type() { return types.default_import }

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

    get type() { return types.name_space_import }

    render() {
        return `* as ${this.id.render()}`;
    }
}

class named_imports extends base {
    constructor(imports) {
        super(imports);
    }

    get imports() { return this.vals[0] }

    get type() { return types.named_imports }

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

     get type() { return types.import_specifier }

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

    get type() { return types.export_declaration }

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

    get type() { return types.named_exports }

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

    get type() { return types.export_specifier }

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

    get type() { return types.break_statement }

    render() {
        let label_str = this.label ? " " + this.label.render(): "";        
        return `break${label_str};`;
    }
}

/** CONTINUE STATMENT  **/

class continue_statement extends base {
    get label() { return this.vals[0] }

    get type() { return types.continue_statement }

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

    get type() { return types.case_statement }

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

    get type() { return types.default_case_statement }

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

    get type() { return types.switch_statement }

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
    get type() { return types.empty }
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

    get type() { return types.variable_declaration }

    render() { return `var ${this.bindings.map(b=>b.render()).join(",")};` }
}

const HORIZONTAL_TAB$2 = 9;
const SPACE$2 = 32;

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
const jump_table$2 = [
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
const number_and_identifier_table$2 = [
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

const
    number$3 = 1,
    identifier$3 = 2,
    string$4 = 4,
    white_space$2 = 8,
    open_bracket$2 = 16,
    close_bracket$2 = 32,
    operator$3 = 64,
    symbol$2 = 128,
    new_line$2 = 256,
    data_link$2 = 512,
    alpha_numeric$2 = (identifier$3 | number$3),
    white_space_new_line$2 = (white_space$2 | new_line$2),
    Types$2 = {
        num: number$3,
        number: number$3,
        id: identifier$3,
        identifier: identifier$3,
        str: string$4,
        string: string$4,
        ws: white_space$2,
        white_space: white_space$2,
        ob: open_bracket$2,
        open_bracket: open_bracket$2,
        cb: close_bracket$2,
        close_bracket: close_bracket$2,
        op: operator$3,
        operator: operator$3,
        sym: symbol$2,
        symbol: symbol$2,
        nl: new_line$2,
        new_line: new_line$2,
        dl: data_link$2,
        data_link: data_link$2,
        alpha_numeric: alpha_numeric$2,
        white_space_new_line: white_space_new_line$2,
    },

    /*** MASKS ***/

    TYPE_MASK$2 = 0xF,
    PARSE_STRING_MASK$2 = 0x10,
    IGNORE_WHITESPACE_MASK$2 = 0x20,
    CHARACTERS_ONLY_MASK$2 = 0x40,
    TOKEN_LENGTH_MASK$2 = 0xFFFFFF80,

    //De Bruijn Sequence for finding index of right most bit set.
    //http://supertech.csail.mit.edu/papers/debruijn.pdf
    debruijnLUT$2 = [
        0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
        31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
    ];

const getNumbrOfTrailingZeroBitsFromPowerOf2$2 = (value) => debruijnLUT$2[(value * 0x077CB531) >>> 27];

class Lexer$2 {

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
    copy(destination = new Lexer$2(this.str, false, true)) {
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

        if (marker instanceof Lexer$2) {
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

        while (!pk.END && pk.ty !== Types$2.nl) { pk.next(); }

        const end = (pk.END) ? this.str.length : pk.off,

            nls = (this.line > 0) ? 1 : 0,
            number_of_tabs = this.str
                .slice(this.off - this.char + nls + nls, this.off + nls)
                .split("")
                .reduce((r, v) => (r + ((v.charCodeAt(0) == HORIZONTAL_TAB$2) | 0)), 0),

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
            IWS = marker.IWS;

        let length = marker.tl,
            off = marker.off + length,
            type = symbol$2,
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

                    switch (jump_table$2[code]) {
                        case 0: //NUMBER
                            while (++off < l && (12 & number_and_identifier_table$2[str.charCodeAt(off)]));

                            if ((str[off] == "e" || str[off] == "E") && (12 & number_and_identifier_table$2[str.charCodeAt(off + 1)])) {
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
                            while (++off < l && ((10 & number_and_identifier_table$2[str.charCodeAt(off)])));
                            type = identifier$3;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol$2;
                            } else {
                                while (++off < l && str.charCodeAt(off) !== code);
                                type = string$4;
                                length = off - base + 1;
                            }
                            break;
                        case 3: //SPACE SET
                            while (++off < l && str.charCodeAt(off) === SPACE$2);
                            type = white_space$2;
                            length = off - base;
                            break;
                        case 4: //TAB SET
                            while (++off < l && str[off] === HORIZONTAL_TAB$2);
                            type = white_space$2;
                            length = off - base;
                            break;
                        case 5: //CARIAGE RETURN
                            length = 2;
                            //intentional
                        case 6: //LINEFEED
                            type = new_line$2;
                            line++;
                            base = off;
                            root = off;
                            off += length;
                            char = 0;
                            break;
                        case 7: //SYMBOL
                            type = symbol$2;
                            break;
                        case 8: //OPERATOR
                            type = operator$3;
                            break;
                        case 9: //OPEN BRACKET
                            type = open_bracket$2;
                            break;
                        case 10: //CLOSE BRACKET
                            type = close_bracket$2;
                            break;
                        case 11: //Data Link Escape
                            type = data_link$2;
                            length = 4; //Stores two UTF16 values and a data link sentinel
                            break;
                    }
                } else {
                    break;
                }

                if (IWS && (type & white_space_new_line$2)) {
                    if (off < l) {
                        type = symbol$2;
                        //off += length;
                        continue;
                    }
                }
                break;
            }
        }

        marker.type = type;
        marker.off = base;
        marker.tl = (this.masked_values & CHARACTERS_ONLY_MASK$2) ? Math.min(1, length) : length;
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
                this.p = new Lexer$2(this.str, false, true);
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

        if (start instanceof Lexer$2) start = start.off;

        return this.str.slice(start, (this.off <= start) ? this.sl : this.off);
    }

    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof Lexer$2)) return marker;

        if (marker.ch == "/") {
            if (marker.pk.ch == "*") {
                marker.sync();
                while (!marker.END && (marker.next().ch != "*" || marker.pk.ch != "/")) { /* NO OP */ }
                marker.sync().assert("/");
            } else if (marker.pk.ch == "/") {
                const IWS = marker.IWS;
                while (marker.next().ty != Types$2.new_line && !marker.END) { /* NO OP */ }
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
            const c = jump_table$2[lex.string.charCodeAt(lex.off)];

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
            const c = jump_table$2[lex.string.charCodeAt(lex.sl - 1)];

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
        return 1 << (this.masked_values & TYPE_MASK$2);
    }

    set type(value) {
        //assuming power of 2 value.
        this.masked_values = (this.masked_values & ~TYPE_MASK$2) | ((getNumbrOfTrailingZeroBitsFromPowerOf2$2(value)) & TYPE_MASK$2);
    }

    get tl() {
        return this.token_length;
    }

    set tl(value) {
        this.token_length = value;
    }

    get token_length() {
        return ((this.masked_values & TOKEN_LENGTH_MASK$2) >> 7);
    }

    set token_length(value) {
        this.masked_values = (this.masked_values & ~TOKEN_LENGTH_MASK$2) | (((value << 7) | 0) & TOKEN_LENGTH_MASK$2);
    }

    get IGNORE_WHITE_SPACE() {
        return this.IWS;
    }

    set IGNORE_WHITE_SPACE(bool) {
        this.iws = !!bool;
    }

    get CHARACTERS_ONLY() {
        return !!(this.masked_values & CHARACTERS_ONLY_MASK$2);
    }

    set CHARACTERS_ONLY(boolean) {
        this.masked_values = (this.masked_values & ~CHARACTERS_ONLY_MASK$2) | ((boolean | 0) << 6);
    }

    get IWS() {
        return !!(this.masked_values & IGNORE_WHITESPACE_MASK$2);
    }

    set IWS(boolean) {
        this.masked_values = (this.masked_values & ~IGNORE_WHITESPACE_MASK$2) | ((boolean | 0) << 5);
    }

    get PARSE_STRING() {
        return !!(this.masked_values & PARSE_STRING_MASK$2);
    }

    set PARSE_STRING(boolean) {
        this.masked_values = (this.masked_values & ~PARSE_STRING_MASK$2) | ((boolean | 0) << 4);
    }

    /**
     * Reference to token id types.
     */
    get types() {
        return Types$2;
    }
}

Lexer$2.prototype.addCharacter = Lexer$2.prototype.addSymbol;

Lexer$2.types = Types$2;

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

        {
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

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}) {

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


        return scope;
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

const env$1 = {};
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
                node.type == types.identifier ||
                node.type == types.member_expression
            ) {
                if (node.type == types.member_expression && !(
                        node.id.type == types.identifier ||
                        node.id.type == types.member_expression
                    )) ; else
                if (node.root && !non_global.has(node.name)) {
                    globals.add(node);
                }
            }

            if (ast !== node && node.type == types.arrow_function_declaration) {

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
                node.type == types.lexical_declaration ||
                node.type == types.variable_declaration
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
            if (node.type == types.function_declaration || node.type == types.arrow_function_declaration) {
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
            if (node.type == types.function_declaration || node.type == types.arrow_function_declaration) {
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
            let result = JSParser(lex, env$1);

            if (result instanceof identifier$2) {
                ids.add(result.val);
            } else
                result.getRootIds(ids, closure);

            return { ids, ast: result, SUCCESS: true };
        } catch (e) {
            return { ids, ast: null, SUCCESS: false };
        }
    },

    types: types
};

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

const HORIZONTAL_TAB$3 = 9;
const SPACE$3 = 32;

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
const jump_table$3 = [
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
const number_and_identifier_table$3 = [
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

const number$4 = 1,
    identifier$4 = 2,
    string$5 = 4,
    white_space$3 = 8,
    open_bracket$3 = 16,
    close_bracket$3 = 32,
    operator$4 = 64,
    symbol$3 = 128,
    new_line$3 = 256,
    data_link$3 = 512,
    alpha_numeric$3 = (identifier$4 | number$4),
    white_space_new_line$3 = (white_space$3 | new_line$3),
    Types$3 = {
        num: number$4,
        number: number$4,
        id: identifier$4,
        identifier: identifier$4,
        str: string$5,
        string: string$5,
        ws: white_space$3,
        white_space: white_space$3,
        ob: open_bracket$3,
        open_bracket: open_bracket$3,
        cb: close_bracket$3,
        close_bracket: close_bracket$3,
        op: operator$4,
        operator: operator$4,
        sym: symbol$3,
        symbol: symbol$3,
        nl: new_line$3,
        new_line: new_line$3,
        dl: data_link$3,
        data_link: data_link$3,
        alpha_numeric: alpha_numeric$3,
        white_space_new_line: white_space_new_line$3,
    },

    /*** MASKS ***/

    TYPE_MASK$3 = 0xF,
    PARSE_STRING_MASK$3 = 0x10,
    IGNORE_WHITESPACE_MASK$3 = 0x20,
    CHARACTERS_ONLY_MASK$3 = 0x40,
    TOKEN_LENGTH_MASK$3 = 0xFFFFFF80,

    //De Bruijn Sequence for finding index of right most bit set.
    //http://supertech.csail.mit.edu/papers/debruijn.pdf
    debruijnLUT$3 = [
        0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
        31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
    ];

const  getNumbrOfTrailingZeroBitsFromPowerOf2$3 = (value) => debruijnLUT$3[(value * 0x077CB531) >>> 27];

class Lexer$3 {

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
    copy(destination = new Lexer$3(this.str, false, true)) {
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

        if (marker instanceof Lexer$3) {
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
            line = String.fromCharCode(0x2500),
            thick_line = String.fromCharCode(0x2501),
            line_number = "    " + this.line + ": ",
            line_fill = line_number.length,
            t = thick_line.repeat(line_fill + 48),
            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
        const pk = this.copy();
        pk.IWS = false;
        while (!pk.END && pk.ty !== Types$3.nl) { pk.next(); }
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
            type = symbol$3,
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

                    switch (jump_table$3[code]) {
                        case 0: //NUMBER
                            while (++off < l && (12 & number_and_identifier_table$3[str.charCodeAt(off)]));

                            if ((str[off] == "e" || str[off] == "E") && (12 & number_and_identifier_table$3[str.charCodeAt(off + 1)])) {
                                off++;
                                if (str[off] == "-") off++;
                                marker.off = off;
                                marker.tl = 0;
                                marker.next();
                                off = marker.off + marker.tl;
                                //Add e to the number string
                            }

                            type = number$4;
                            length = off - base;

                            break;
                        case 1: //IDENTIFIER
                            while (++off < l && ((10 & number_and_identifier_table$3[str.charCodeAt(off)])));
                            type = identifier$4;
                            length = off - base;
                            break;
                        case 2: //QUOTED STRING
                            if (this.PARSE_STRING) {
                                type = symbol$3;
                            } else {
                                while (++off < l && str.charCodeAt(off) !== code);
                                type = string$5;
                                length = off - base + 1;
                            }
                            break;
                        case 3: //SPACE SET
                            while (++off < l && str.charCodeAt(off) === SPACE$3);
                            type = white_space$3;
                            length = off - base;
                            break;
                        case 4: //TAB SET
                            while (++off < l && str[off] === HORIZONTAL_TAB$3);
                            type = white_space$3;
                            length = off - base;
                            break;
                        case 5: //CARIAGE RETURN
                            length = 2;
                        case 6: //LINEFEED
                            //Intentional
                            type = new_line$3;
                            line++;
                            base = off;
                            root = off;
                            off += length;
                            char = 0;
                            break;
                        case 7: //SYMBOL
                            type = symbol$3;
                            break;
                        case 8: //OPERATOR
                            type = operator$4;
                            break;
                        case 9: //OPEN BRACKET
                            type = open_bracket$3;
                            break;
                        case 10: //CLOSE BRACKET
                            type = close_bracket$3;
                            break;
                        case 11: //Data Link Escape
                            type = data_link$3;
                            length = 4; //Stores two UTF16 values and a data link sentinel
                            break;
                    }
                }else{
                    break;
                }

                if (IWS && (type & white_space_new_line$3)) {
                    if (off < l) {
                        type = symbol$3;
                        //off += length;
                        continue;
                    }
                }
                break;
            }
        }

        marker.type = type;
        marker.off = base;
        marker.tl = (this.masked_values & CHARACTERS_ONLY_MASK$3) ? Math.min(1, length) : length;
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
                this.p = new Lexer$3(this.str, false, true);
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

        if (start instanceof Lexer$3) start = start.off;

        return this.str.slice(start, (this.off <= start) ? this.sl : this.off);
    }

    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof Lexer$3)) return marker;

        if (marker.ch == "/") {
            if (marker.pk.ch == "*") {
                marker.sync();
                while (!marker.END && (marker.next().ch != "*" || marker.pk.ch != "/")) { /* NO OP */ }
                marker.sync().assert("/");
            } else if (marker.pk.ch == "/") {
                const IWS = marker.IWS;
                while (marker.next().ty != Types$3.new_line && !marker.END) { /* NO OP */ }
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
            const c = jump_table$3[lex.string.charCodeAt(lex.off)];

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
            const c = jump_table$3[lex.string.charCodeAt(lex.sl - 1)];

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
        return 1 << (this.masked_values & TYPE_MASK$3);
    }

    set type(value) {
        //assuming power of 2 value.
        this.masked_values = (this.masked_values & ~TYPE_MASK$3) | ((getNumbrOfTrailingZeroBitsFromPowerOf2$3(value)) & TYPE_MASK$3);
    }

    get tl() {
        return this.token_length;
    }

    set tl(value) {
        this.token_length = value;
    }

    get token_length() {
        return ((this.masked_values & TOKEN_LENGTH_MASK$3) >> 7);
    }

    set token_length(value) {
        this.masked_values = (this.masked_values & ~TOKEN_LENGTH_MASK$3) | (((value << 7) | 0) & TOKEN_LENGTH_MASK$3);
    }

    get IGNORE_WHITE_SPACE() {
        return this.IWS;
    }

    set IGNORE_WHITE_SPACE(bool) {
        this.iws = !!bool;
    }

    get CHARACTERS_ONLY() {
        return !!(this.masked_values & CHARACTERS_ONLY_MASK$3);
    }

    set CHARACTERS_ONLY(boolean) {
        this.masked_values = (this.masked_values & ~CHARACTERS_ONLY_MASK$3) | ((boolean | 0) << 6);
    }

    get IWS() {
        return !!(this.masked_values & IGNORE_WHITESPACE_MASK$3);
    }

    set IWS(boolean) {
        this.masked_values = (this.masked_values & ~IGNORE_WHITESPACE_MASK$3) | ((boolean | 0) << 5);
    }

    get PARSE_STRING() {
        return !!(this.masked_values & PARSE_STRING_MASK$3);
    }

    set PARSE_STRING(boolean) {
        this.masked_values = (this.masked_values & ~PARSE_STRING_MASK$3) | ((boolean | 0) << 4);
    }

    /**
     * Reference to token id types.
     */
    get types() {
        return Types$3;
    }
}

Lexer$3.prototype.addCharacter = Lexer$3.prototype.addSymbol;

function whind$4(string, INCLUDE_WHITE_SPACE_TOKENS = false) { return new Lexer$3(string, INCLUDE_WHITE_SPACE_TOKENS) }

whind$4.constructor = Lexer$3;

Lexer$3.types = Types$3;
whind$4.types = Types$3;

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
            l = whind$4(l);

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
            let lex = whind$4(v);
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

        let lex = whind$4(this.query);


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
        const fs = (Promise.resolve(require("fs"))).promises;
        const path = (Promise.resolve(require("path")));


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
    var lex = whind$4(string);
    
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
            let lex = whind$4(string);
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
            lx = whind$4(lx);

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
            l = whind$4(l);

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
            l = whind$4(l);

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
            l = whind$4(l);

        if (l.tx == this._value_) {
            l.next();
            return true;
        }

        return false;
    }
}

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

    const l = whind$4(notation);

    const important = { is: false };

    let n = d$4(l, definitions);

    if (n instanceof NR && n._terms_.length == 1)
        n = n._terms_[0];

    n._prop_ = name;
    n.IMP = important.is;

    return n;
}

function d$4(l, definitions, super_term = false, group = false, need_group = false, and_group = false, important = null) {
    let term, nt;

    while (!l.END) {
        switch (l.ch) {
            case "]":
                if (term) return term;
                else 
                    throw new Error("Expected to have term before \"]\"");
            case "[":
                if (term) return term;
                term = d$4(l.next(), definitions);
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
                        nt._terms_.push(d$4(l, definitions, super_term, group, need_group, true, important));
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
                            nt._terms_.push(d$4(l, definitions, super_term, group, true, and_group, important));
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
                            nt._terms_.push(d$4(l, definitions, super_term, true, need_group, and_group, important));
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

                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = _Jux_(new NR, term);
                    let v = d$4(l, definitions, true);
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
                    let v = d$4(l, definitions, true);
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
                    let lex = whind$4(ss.v);
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
            }        }

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
        let selector_array = [],
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
                    while (!p.END && p.next().tx !== "]") {}                    p.a("]");
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
                                        res(this.parse(whind$4(str), this).then((r) => this.parse(lexer, r)))
                                        //parse returns Promise. 
                                        // return;
                                    ).catch((e) => res(this.parse(lexer)));
                                } else {
                                    //Failed to fetch resource, attempt to find the end to of the import clause.
                                    while (!lexer.END && lexer.next().tx !== ";") {}                                    lexer.next();
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
                if (inCSSRuleBody.media_selector) ;
            } else if (!inCSSRuleBody.media_selector)
                return true;
        }
        return false;
    }

    merge(inCSSRuleBody) {
        this.parse(whind$4(inCSSRuleBody + ""));
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
        let selector = this.parseSelector(whind$4(selector_value));

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

/**
 * Builds a CSS object graph that stores `selectors` and `rules` pulled from a CSS string. 
 * @function
 * @param {string} css_string - A string containing CSS data.
 * @param {string} css_string - An existing CSSRootNode to merge with new `selectors` and `rules`.
 * @return {Promise} A `Promise` that will return a new or existing CSSRootNode.
 * @memberof module:wick.core
 * @alias css
 */
const CSSParser = (css_string, root = null) => (root = (!root || !(root instanceof CSSRootNode)) ? new CSSRootNode() : root, root.parse(whind$4(css_string)));

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

const defaults$1 = { glow: Animation };

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
            else if (defaults$1[name])
                out_object.val = defaults$1[name];
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

        if (node.parent && node.parent.type == types.assignment_expression && node.type == types.identifier) {
            if (node == node.parent.left) {

                const assign = node.parent;

                const k = node.name;

                if ((window[k] && !(window[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults$1[k] || ignore.includes(k))
                    return;

                node.replace(new member_expression(new identifier$2(["emit"]), node));
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

class a$4 extends ElementNode{
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

class d$5 {
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
            d$5.web_component_constructor(this, bound_data_object), {}
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

d$5.web_component_constructor = function(wick_component, bound_data) {
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

    constructor(sym, env$$1, lex) {
        this.lex = lex.copy();
        this.lex.sl = lex.off - 3;
        this.lex.off = env$$1.start;

        this.METHOD = IDENTIFIER;

        this.ast = sym[2];
        this.prop = (sym.length > 3) ? sym[5] : null;

        this.function = null;
        this.args = null;
        this.READY = false;

        this.origin_url = env$$1.url;

        this.val = this.ast + "";

        if (!(this.ast instanceof identifier$2))
            this.processJSAST(env$$1.presets);

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

Object.assign(BaseComponent.prototype,d$5.prototype);
BaseComponent.prototype.mount = d$5.prototype.nonAsyncMount;

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

class v$4 extends ElementNode{
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
            Constructor = a$4;
            break;
            /** void elements **/
        case "template":
            Constructor = v$4;
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
                let num,type ="deg";
                if(l.tx == "to");else if(l.ty == l.types.num){
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

OR$1.step = 0;

class ONE_OF$1 extends JUX {
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

ONE_OF$1.step = 0;

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
}

class ValueTerm$2 extends ValueTerm$1 {

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

class BlankTerm extends LiteralTerm$1 {

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

class LiteralTerm$2 extends LiteralTerm$1 {

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

class SymbolTerm$2 extends LiteralTerm$2 {
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

class AND$2 extends JUX$1 {

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
Object.assign(AND$2.prototype, AND$1.prototype);

class OR$2 extends JUX$1 {

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

Object.assign(OR$2.prototype, OR$1.prototype);

class ONE_OF$2 extends JUX$1 {

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

Object.assign(ONE_OF$2.prototype, ONE_OF$1.prototype);

var ui_productions = /*#__PURE__*/Object.freeze({
    JUX: JUX$1,
    AND: AND$2,
    OR: OR$2,
    ONE_OF: ONE_OF$2,
    LiteralTerm: LiteralTerm$2,
    ValueTerm: ValueTerm$2,
    SymbolTerm: SymbolTerm$2
});

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

function getExtendedIdentifier(l) {
    let pk = l.pk;

    let id = "";

    while (!pk.END && (pk.ty & (whind$1.types.id | whind$1.types.num)) || pk.tx == "-" || pk.tx == "_") { pk.next(); }

    id = pk.slice(l);

    l.sync();

    l.tl = 0;

    return id;
}

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
    l.useExtendedId();
    
    const important = { is: false };

    let n = d$6(l, definitions, productions);

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

function d$6(l, definitions, productions, super_term = false, oneof_group = false, or_group = false, and_group = false, important = null) {
    let term, nt, v;
    const { JUX: JUX$$1, AND, OR, ONE_OF, LiteralTerm, ValueTerm, SymbolTerm } = productions;

    while (!l.END) {

        switch (l.ch) {
            case "]":
                return term;
                break;
            case "[":

                v = d$6(l.next(), definitions, productions, true);
                l.assert("]");
                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX$$1 && term.isRepeating()) term = foldIntoProduction(productions, new JUX$$1, term);
                    term = foldIntoProduction(productions, term, v);
                } else
                    term = v;
                break;

            case "<":
                let id = getExtendedIdentifier(l.next());

                v = new ValueTerm(id, getPropertyParser$1, definitions, productions);

                l.next().assert(">");

                v = checkExtensions(l, v, productions);

                if (term) {
                    if (term instanceof JUX$$1 /*&& term.isRepeating()*/ ) term = foldIntoProduction(productions, new JUX$$1, term);
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
                        nt.terms.push(d$6(l, definitions, productions, super_term, oneof_group, or_group, true, important));
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
                            nt.terms.push(d$6(l, definitions, productions, super_term, oneof_group, true, and_group, important));
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
                            nt.terms.push(d$6(l, definitions, productions, super_term, true, or_group, and_group, important));
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
                    if (term instanceof JUX$$1 /*&& (term.isRepeating() || term instanceof ONE_OF)*/ ) term = foldIntoProduction(productions, new JUX$$1, term);
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

const props = Object.assign({}, property_definitions$1);

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
        let pp = getPropertyParser$1(type, undefined, props, ui_productions);
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

const props$1 = Object.assign({}, property_definitions$1);

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

    const parser = getPropertyParser$1(rule_name.replace(/\-/g, "_"), IS_VIRTUAL, property_definitions$1);

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

//*


function create_ordered_list(sym, offset = 0, level = -1, env$$1, lex) {

    for (let i = offset; i < sym.length; i++) {
        const s = sym[i],
            lvl = (s.lvl) ? s.lvl.length : 0,
            li = s.li;

        if (lvl > level) {
            create_ordered_list(sym, i, lvl, env$$1, lex);
        } else if (lvl < level) {
            sym[offset] = es("ul", null, sym.splice(offset, i - offset), env$$1, lex);
            return;
        } else
            sym[i] = li;
    }

    return sym[offset] = es("span", null, sym.splice(offset, sym.length - offset), env$$1, lex);
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
        parenthasized: argument_list$1,
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
        identifier: identifier$2,
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
        string_literal: string$3,
        string: string$3,
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

        defaultError: (tk, env$$1, output, lex, prv_lex, ss, lu) => {
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
            if (env$$1.ASI && lex.tx !== ")" && !lex.END) {

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

            const compiler_env = new CompilerEnvironment(presets, env$3);

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
                                    let c_env = new CompilerEnvironment(presets, env$3);

                                    let js_ast = parser(whind$1("function " + r.toString().trim() + ";"), c_env);

                                    let func_ast = JS.getFirst(js_ast, types.function_declaration);
                                    let ids = JS.getClosureVariableNames(func_ast);
                                    let args = JS.getFunctionDeclarationArgumentNames(js_ast); // Function arguments in wick class component definitions are treated as TAP variables. 
                                    const HAS_CLOSURE = (ids.filter(a => !args.includes(a))).length > 0;

                                    const binding$$1 = new Binding([null, func_ast.id], { presets, start: 0 }, whind$1("ddddd"));
                                    const attrib = new Attribute(["on", null, binding$$1], presets);
                                    const stmt = func_ast.body;

                                    let script$$1 = new ScriptNode({}, null, stmt, [attrib], presets);

                                    script$$1.finalize();

                                    ast.children.push(script$$1);

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

Component.prototype = d$5.prototype;

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

exports.default = wick;
