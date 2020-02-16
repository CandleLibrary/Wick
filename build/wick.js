var wick = (function () {
	'use strict';

	const uni_id_start=[170,181,186,748,750,895,902,908,1369,1749,1791,1808,1969,2042,2074,2084,2088,2365,2384,2482,2493,2510,2556,2654,2749,2768,2809,2877,2929,2947,2972,3024,3133,3200,3261,3294,3389,3406,3517,3716,3749,3773,3782,3840,4159,4193,4238,4295,4301,4696,4800,6103,6108,6314,6823,7418,8025,8027,8029,8126,8305,8319,8450,8455,8469,8484,8486,8488,8526,11559,11565,11631,11823,13312,19893,19968,40943,43259,43471,43642,43697,43712,43714,44032,55203,64285,64318,67592,67644,68096,69415,69956,70006,70106,70108,70280,70461,70480,70751,70855,71236,71352,71935,72161,72163,72192,72250,72272,72349,72768,73030,73112,94032,94179,94208,100343,119970,119995,120134,123214,125259,126500,126503,126521,126523,126530,126535,126537,126539,126548,126551,126553,126555,126557,126559,126564,126590,131072,173782,173824,177972,177984,178205,178208,183969,183984,191456];
	const uni_id_start_r=[65,90,97,122,192,214,216,246,248,705,710,721,736,740,880,884,886,887,890,893,904,906,910,929,931,1013,1015,1153,1162,1327,1329,1366,1376,1416,1488,1514,1519,1522,1568,1610,1646,1647,1649,1747,1765,1766,1774,1775,1786,1788,1810,1839,1869,1957,1994,2026,2036,2037,2048,2069,2112,2136,2144,2154,2208,2228,2230,2237,2308,2361,2392,2401,2417,2432,2437,2444,2447,2448,2451,2472,2474,2480,2486,2489,2524,2525,2527,2529,2544,2545,2565,2570,2575,2576,2579,2600,2602,2608,2610,2611,2613,2614,2616,2617,2649,2652,2674,2676,2693,2701,2703,2705,2707,2728,2730,2736,2738,2739,2741,2745,2784,2785,2821,2828,2831,2832,2835,2856,2858,2864,2866,2867,2869,2873,2908,2909,2911,2913,2949,2954,2958,2960,2962,2965,2969,2970,2974,2975,2979,2980,2984,2986,2990,3001,3077,3084,3086,3088,3090,3112,3114,3129,3160,3162,3168,3169,3205,3212,3214,3216,3218,3240,3242,3251,3253,3257,3296,3297,3313,3314,3333,3340,3342,3344,3346,3386,3412,3414,3423,3425,3450,3455,3461,3478,3482,3505,3507,3515,3520,3526,3585,3632,3634,3635,3648,3654,3713,3714,3718,3722,3724,3747,3751,3760,3762,3763,3776,3780,3804,3807,3904,3911,3913,3948,3976,3980,4096,4138,4176,4181,4186,4189,4197,4198,4206,4208,4213,4225,4256,4293,4304,4346,4348,4680,4682,4685,4688,4694,4698,4701,4704,4744,4746,4749,4752,4784,4786,4789,4792,4798,4802,4805,4808,4822,4824,4880,4882,4885,4888,4954,4992,5007,5024,5109,5112,5117,5121,5740,5743,5759,5761,5786,5792,5866,5870,5880,5888,5900,5902,5905,5920,5937,5952,5969,5984,5996,5998,6000,6016,6067,6176,6264,6272,6276,6279,6312,6320,6389,6400,6430,6480,6509,6512,6516,6528,6571,6576,6601,6656,6678,6688,6740,6917,6963,6981,6987,7043,7072,7086,7087,7098,7141,7168,7203,7245,7247,7258,7293,7296,7304,7312,7354,7357,7359,7401,7404,7406,7411,7413,7414,7424,7615,7680,7957,7960,7965,7968,8005,8008,8013,8016,8023,8031,8061,8064,8116,8118,8124,8130,8132,8134,8140,8144,8147,8150,8155,8160,8172,8178,8180,8182,8188,8336,8348,8458,8467,8473,8477,8490,8493,8495,8505,8508,8511,8517,8521,8544,8584,11264,11310,11312,11358,11360,11492,11499,11502,11506,11507,11520,11557,11568,11623,11648,11670,11680,11686,11688,11694,11696,11702,11704,11710,11712,11718,11720,11726,11728,11734,11736,11742,12293,12295,12321,12329,12337,12341,12344,12348,12353,12438,12445,12447,12449,12538,12540,12543,12549,12591,12593,12686,12704,12730,12784,12799,40960,42124,42192,42237,42240,42508,42512,42527,42538,42539,42560,42606,42623,42653,42656,42735,42775,42783,42786,42888,42891,42943,42946,42950,42999,43009,43011,43013,43015,43018,43020,43042,43072,43123,43138,43187,43250,43255,43261,43262,43274,43301,43312,43334,43360,43388,43396,43442,43488,43492,43494,43503,43514,43518,43520,43560,43584,43586,43588,43595,43616,43638,43646,43695,43701,43702,43705,43709,43739,43741,43744,43754,43762,43764,43777,43782,43785,43790,43793,43798,43808,43814,43816,43822,43824,43866,43868,43879,43888,44002,55216,55238,55243,55291,63744,64109,64112,64217,64256,64262,64275,64279,64287,64296,64298,64310,64312,64316,64320,64321,64323,64324,64326,64433,64467,64829,64848,64911,64914,64967,65008,65019,65136,65140,65142,65276,65313,65338,65345,65370,65382,65470,65474,65479,65482,65487,65490,65495,65498,65500,65536,65547,65549,65574,65576,65594,65596,65597,65599,65613,65616,65629,65664,65786,65856,65908,66176,66204,66208,66256,66304,66335,66349,66378,66384,66421,66432,66461,66464,66499,66504,66511,66513,66517,66560,66717,66736,66771,66776,66811,66816,66855,66864,66915,67072,67382,67392,67413,67424,67431,67584,67589,67594,67637,67639,67640,67647,67669,67680,67702,67712,67742,67808,67826,67828,67829,67840,67861,67872,67897,67968,68023,68030,68031,68112,68115,68117,68119,68121,68149,68192,68220,68224,68252,68288,68295,68297,68324,68352,68405,68416,68437,68448,68466,68480,68497,68608,68680,68736,68786,68800,68850,68864,68899,69376,69404,69424,69445,69600,69622,69635,69687,69763,69807,69840,69864,69891,69926,69968,70002,70019,70066,70081,70084,70144,70161,70163,70187,70272,70278,70282,70285,70287,70301,70303,70312,70320,70366,70405,70412,70415,70416,70419,70440,70442,70448,70450,70451,70453,70457,70493,70497,70656,70708,70727,70730,70784,70831,70852,70853,71040,71086,71128,71131,71168,71215,71296,71338,71424,71450,71680,71723,71840,71903,72096,72103,72106,72144,72203,72242,72284,72329,72384,72440,72704,72712,72714,72750,72818,72847,72960,72966,72968,72969,72971,73008,73056,73061,73063,73064,73066,73097,73440,73458,73728,74649,74752,74862,74880,75075,77824,78894,82944,83526,92160,92728,92736,92766,92880,92909,92928,92975,92992,92995,93027,93047,93053,93071,93760,93823,93952,94026,94099,94111,94176,94177,100352,101106,110592,110878,110928,110930,110948,110951,110960,111355,113664,113770,113776,113788,113792,113800,113808,113817,119808,119892,119894,119964,119966,119967,119973,119974,119977,119980,119982,119993,119997,120003,120005,120069,120071,120074,120077,120084,120086,120092,120094,120121,120123,120126,120128,120132,120138,120144,120146,120485,120488,120512,120514,120538,120540,120570,120572,120596,120598,120628,120630,120654,120656,120686,120688,120712,120714,120744,120746,120770,120772,120779,123136,123180,123191,123197,123584,123627,124928,125124,125184,125251,126464,126467,126469,126495,126497,126498,126505,126514,126516,126519,126541,126543,126545,126546,126561,126562,126567,126570,126572,126578,126580,126583,126585,126588,126592,126601,126603,126619,126625,126627,126629,126633,126635,126651];
	const uni_id_cont=[95,1471,1479,1648,1809,2045,2492,2519,2558,2620,2641,2677,2748,2876,2946,3031,3260,3415,3530,3542,3633,3761,3893,3895,3897,4038,6109,6313,7405,7412,8276,8417,11647,42607,43010,43014,43019,43493,43587,43696,43713,64286,65343,66045,66272,68159,70003,70206,70487,70750,72164,72263,73018,73031,94031,121461,121476];
	const uni_id_cont_r=[48,57,768,879,1155,1159,1425,1469,1473,1474,1476,1477,1552,1562,1611,1641,1750,1756,1759,1764,1767,1768,1770,1773,1776,1785,1840,1866,1958,1968,1984,1993,2027,2035,2070,2073,2075,2083,2085,2087,2089,2093,2137,2139,2259,2273,2275,2307,2362,2364,2366,2383,2385,2391,2402,2403,2406,2415,2433,2435,2494,2500,2503,2504,2507,2509,2530,2531,2534,2543,2561,2563,2622,2626,2631,2632,2635,2637,2662,2673,2689,2691,2750,2757,2759,2761,2763,2765,2786,2787,2790,2799,2810,2815,2817,2819,2878,2884,2887,2888,2891,2893,2902,2903,2914,2915,2918,2927,3006,3010,3014,3016,3018,3021,3046,3055,3072,3076,3134,3140,3142,3144,3146,3149,3157,3158,3170,3171,3174,3183,3201,3203,3262,3268,3270,3272,3274,3277,3285,3286,3298,3299,3302,3311,3328,3331,3387,3388,3390,3396,3398,3400,3402,3405,3426,3427,3430,3439,3458,3459,3535,3540,3544,3551,3558,3567,3570,3571,3636,3642,3655,3662,3664,3673,3764,3772,3784,3789,3792,3801,3864,3865,3872,3881,3902,3903,3953,3972,3974,3975,3981,3991,3993,4028,4139,4158,4160,4169,4182,4185,4190,4192,4194,4196,4199,4205,4209,4212,4226,4237,4239,4253,4957,4959,5906,5908,5938,5940,5970,5971,6002,6003,6068,6099,6112,6121,6155,6157,6160,6169,6277,6278,6432,6443,6448,6459,6470,6479,6608,6617,6679,6683,6741,6750,6752,6780,6783,6793,6800,6809,6832,6845,6912,6916,6964,6980,6992,7001,7019,7027,7040,7042,7073,7085,7088,7097,7142,7155,7204,7223,7232,7241,7248,7257,7376,7378,7380,7400,7415,7417,7616,7673,7675,7679,8255,8256,8400,8412,8421,8432,11503,11505,11744,11775,12330,12335,12441,12442,42528,42537,42612,42621,42654,42655,42736,42737,43043,43047,43136,43137,43188,43205,43216,43225,43232,43249,43263,43273,43302,43309,43335,43347,43392,43395,43443,43456,43472,43481,43504,43513,43561,43574,43596,43597,43600,43609,43643,43645,43698,43700,43703,43704,43710,43711,43755,43759,43765,43766,44003,44010,44012,44013,44016,44025,65024,65039,65056,65071,65075,65076,65101,65103,65296,65305,66422,66426,66720,66729,68097,68099,68101,68102,68108,68111,68152,68154,68325,68326,68900,68903,68912,68921,69446,69456,69632,69634,69688,69702,69734,69743,69759,69762,69808,69818,69872,69881,69888,69890,69927,69940,69942,69951,69957,69958,70016,70018,70067,70080,70089,70092,70096,70105,70188,70199,70367,70378,70384,70393,70400,70403,70459,70460,70462,70468,70471,70472,70475,70477,70498,70499,70502,70508,70512,70516,70709,70726,70736,70745,70832,70851,70864,70873,71087,71093,71096,71104,71132,71133,71216,71232,71248,71257,71339,71351,71360,71369,71453,71467,71472,71481,71724,71738,71904,71913,72145,72151,72154,72160,72193,72202,72243,72249,72251,72254,72273,72283,72330,72345,72751,72758,72760,72767,72784,72793,72850,72871,72873,72886,73009,73014,73020,73021,73023,73029,73040,73049,73098,73102,73104,73105,73107,73111,73120,73129,73459,73462,92768,92777,92912,92916,92976,92982,93008,93017,94033,94087,94095,94098,113821,113822,119141,119145,119149,119154,119163,119170,119173,119179,119210,119213,119362,119364,120782,120831,121344,121398,121403,121452,121499,121503,121505,121519,122880,122886,122888,122904,122907,122913,122915,122916,122918,122922,123184,123190,123200,123209,123628,123641,125136,125142,125252,125258,125264,125273];

	///*
	const j = new Uint16Array(100000);

	j.fill(0);

	//Add value to individual indexes
	function aii(table, value, ...indices) {
		for (const i of indices)
			table[i] |= value;
	}

	//Add value to index ranges
	function air(t, v, ...i_r) {
		for (const r of i_r.reduce((r, v, i) => (((i % 2) ? (r[r.length - 1].push(v)) : r.push([v])), r), [])) {
			const size = r[1] + 1 - r[0],
				a = [];
			for (let i = 0; i < size; i++)
				a[i] = r[0] + i;
			aii(t, v, ...a);
		}
	}


	//7. Symbol
	// Default Value

	//1. Identifier
	air(j, 1, ...uni_id_start_r);
	aii(j, 1, ...uni_id_start);

	//2. QUOTE STRING
	aii(j, 2, 34, 39, 96);

	//3. SPACE SET
	aii(j, 3, 32, 0xA0, 0x2002, 0x2003, 0x2004, 0x3000);

	//4. TAB SET
	aii(j, 4, 9);

	//5. CARIAGE RETURN 
	aii(j, 5, 13);

	//6. CARIAGE RETURN 
	aii(j, 6, 10);

	//7. Number
	air(j, 7, 48, 57);

	//8. Operator
	aii(j, 8, 33, 37, 38, 42, 43, 58, 60, 61, 62);

	//9. Open Bracket
	aii(j, 9, 40, 91, 123);

	//10. Close Bracket
	aii(j, 10, 41, 93, 125);

	//10. Close Bracket
	aii(j, 11, 16);


	/**
	 * Lexer Number and Identifier jump table reference
	 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
	 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
	 * entries marked as `2` are in the identifier set but not the number set
	 * entries marked as `4` are in the number set but not the identifier set
	 * entries marked as `8` are in both number and identifier sets
	 */

	/**
	 * LExer Number and Identifier jump table reference
	 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
	 */

	// entries marked as `2` are in the identifier set but not the number set
	air(j, 2 << 8, 65, 90, 97, 122);
	air(j, 2 << 8, ...uni_id_start_r);
	aii(j, 2 << 8, ...uni_id_start);
	air(j, 2 << 8, ...uni_id_cont_r);
	aii(j, 2 << 8, ...uni_id_cont);

	// entries marked as `8` are in both number and identifier sets
	air(j, 8 << 8, 48, 57);

	const HORIZONTAL_TAB = 9;
	const SPACE = 32;


	const extended_jump_table = j.slice();
	extended_jump_table[45] |= 2 << 8;
	extended_jump_table[95] |= 2 << 8;

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

	const arrow = String.fromCharCode(0x2b89);
	const line = String.fromCharCode(0x2500);
	const thick_line = String.fromCharCode(0x2501);

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

	        this.id_lu = j;

	        if (!PEEKING) this.next();
	    }

	    useExtendedId() {
	        this.id_lu = extended_jump_table;
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
	        destination.id_lu = this.id_lu;
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
	        Looks for the string within the text and returns a new lexer at the location of the first occurance of the token or 
	    */
	    find(string) {
	        const cp = this.pk,
	            match = this.copy();

	        match.resetHead();
	        match.str = string;
	        match.sl = string.length;
	        cp.tl = 0;
	        const char_cache = cp.CHARACTERS_ONLY;
	        match.CHARACTERS_ONLY = true;
	        cp.CHARACTERS_ONLY = true;

	        while (!cp.END) {

	            const
	                mpk = match.pk,
	                cpk = cp.pk;

	            while (!mpk.END && !cpk.END && cpk.tx == mpk.tx) {
	                cpk.next();
	                mpk.next();
	            }

	            if (mpk.END) {
	                cp.CHARACTERS_ONLY = char_cache;
	                return cp.next();
	            }

	            cp.next();
	        }

	        return cp;
	    }

	    /**
	    Creates an error message with a diagram illustrating the location of the error. 
	    */
	    errorMessage(message = "", window_size = 40, tab_size = 4) {

	        //Get the text from the proceeding and the following lines; 
	        //If current line is at index 0 then there will be no proceeeding line;
	        //Likewise for the following line if current line is the last one in the string.

	        const line_start = this.off - this.char,
	            char = this.char,
	            l = this.line,
	            str = this.str,
	            len = str.length,
	            sp = " ";

	        let prev_start = 0,
	            next_start = 0,
	            next_end = 0,
	            i = 0;


	        //get the start of the proceeding line
	        for (i = char; --i > 0 && j[str.codePointAt(i)] !== 6;);
	        prev_start = i;

	        //get the end of the current line...
	        for (i = this.off + this.tl; i++ < len && j[str.codePointAt(i)] !== 6;);
	        next_start = i;

	        //and the next line
	        for (; i++ < len && j[str.codePointAt(i)] !== 6;);
	        next_end = i;

	        let pointer_pos = char - (line_start > 0 ? 1 : 0);

	        for (i = line_start; ++i < this.off;)
	            if (str.codePointAt(i) == HORIZONTAL_TAB)
	                pointer_pos += tab_size - 1;

	        //find the location of the offending symbol
	        const
	            prev_line = str.slice(prev_start + (prev_start > 0 ? 1 : 0), line_start).replace(/\t/g, sp.repeat(tab_size)),
	            curr_line = str.slice(line_start + (line_start > 0 ? 1 : 0), next_start).replace(/\t/g, sp.repeat(tab_size)),
	            next_line = str.slice(next_start + 1, next_end).replace(/\t/g, " "),

	            //get the max line length;
	        
	            max_length = Math.max(prev_line.length, curr_line.length, next_line.length),
	            min_length = Math.min(prev_line.length, curr_line.length, next_line.length),
	            length_diff = max_length - min_length,

	            //Get the window size;
	            w_size = window_size,
	            w_start = Math.max(0, Math.min(pointer_pos - w_size / 2, max_length)),
	            w_end = Math.max(0, Math.min(pointer_pos + w_size / 2, max_length)),
	            w_pointer_pos = Math.max(0, Math.min(pointer_pos, max_length)) - w_start,


	            //append the difference of line lengths to the end of the lines as space characers;

	            prev_line_o = (prev_line + sp.repeat(length_diff)).slice(w_start, w_end),
	            curr_line_o = (curr_line + sp.repeat(length_diff)).slice(w_start, w_end),
	            next_line_o = (next_line + sp.repeat(length_diff)).slice(w_start, w_end),

	            trunc = w_start !== 0 ? "... " : "",

	            line_number = n => ` ${(sp.repeat(3)+n).slice(-(l+1+"").length)}: `,

	            error_border = thick_line.repeat(curr_line_o.length + line_number.length + 8 + trunc.length);

	        return [
	                `${message} at ${l}:${char - ((l > 0) ? 1 : 0)}`,
	                `${error_border}`,
	                `${prev_line ?  line_number(l-1)+trunc+prev_line_o+(prev_line_o.length < prev_line.length ?  " ..." : "") : ""}`,
	                `${curr_line ?  line_number(l)+trunc+curr_line_o+(curr_line_o.length < curr_line.length ?  " ..." : "") : ""}`,
	                `${line.repeat(w_pointer_pos +trunc.length+ line_number(l+1).length)+arrow}`,
	                `${next_line ? line_number(l+1)+trunc+next_line_o+(next_line_o.length < next_line.length ?  " ..." : "") : ""}`,
	                `${error_border}`
	            ]
	            .filter(e => !!e)
	            .join("\n");
	    }

	    errorMessageWithIWS(...v) {
	        return this.errorMessage(...v) + "\n" + (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
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
	            jump_table = this.id_lu,
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

	        while (NORMAL_PARSE) {

	            base = off;

	            length = 1;

	            const code = str.codePointAt(off);

	            switch (jump_table[code] & 255) {
	                case 0: //SYMBOL
	                    type = symbol;
	                    break;
	                case 1: //IDENTIFIER
	                    while (++off < l && ((10 & (jump_table[str.codePointAt(off)] >> 8))));
	                    type = identifier;
	                    length = off - base;
	                    break;
	                case 2: //QUOTED STRING
	                    if (this.PARSE_STRING) {
	                        type = symbol;
	                    } else {
	                        while (++off < l && str.codePointAt(off) !== code);
	                        type = string;
	                        length = off - base + 1;
	                    }
	                    break;
	                case 3: //SPACE SET
	                    while (++off < l && str.codePointAt(off) === SPACE);
	                    type = white_space;
	                    length = off - base;
	                    break;
	                case 4: //TAB SET
	                    while (++off < l && str[off] === "\t");
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
	                case 7: //NUMBER
	                    while (++off < l && (12 & (jump_table[str.codePointAt(off)] >> 8)));

	                    if ((str[off] == "e" || str[off] == "E") && (12 & (jump_table[str.codePointAt(off + 1)] >> 8))) {
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

	            if (IWS && (type & white_space_new_line)) {
	                if (off < l) {
	                    type = symbol;
	                    //off += length;
	                    continue;
	                } else {
	                    //Trim white space from end of string
	                    base = l - off;
	                    marker.sl -= off;
	                    length = 0;
	                }
	            }
	            break;
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
	            const c = j[lex.string.charCodeAt(lex.off)];

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
	            const c = j[lex.string.charCodeAt(lex.sl - 1)];

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

	function whind(string, INCLUDE_WHITE_SPACE_TOKENS = false) { return new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS) }

	whind.constructor = Lexer;

	Lexer.types = Types;
	whind.types = Types;

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

	function getCORSModes(url) {
	    const IS_CORS = (URL$1.G.host !== url.host && !!url.host);
	    return {
	        IS_CORS,
	        mode: IS_CORS ? "cors" : "same-origin", // CORs not allowed
	        credentials: IS_CORS ? "omit" : "include",
	    }
	}

	function fetchLocalText(url, m = "cors") {

	    return new Promise((res, rej) => {
	        fetch(url + "", Object.assign({
	            method: "GET"
	        }, getCORSModes(url))).then(r => {

	            if (r.status < 200 || r.status > 299)
	                r.text().then(rej);
	            else
	                r.text().then(res);
	        }).catch(e => rej(e));
	    });
	}

	function fetchLocalJSON(url, m = "cors") {
	    return new Promise((res, rej) => {
	        fetch(url + "", Object.assign({
	            method: "GET"
	        }, getCORSModes(url))).then(r => {
	            if (r.status < 200 || r.status > 299)
	                r.json().then(rej);
	            else
	                r.json().then(res).catch(rej);
	        }).catch(e => rej(e));
	    });
	}

	function submitForm(url, form_data, m = "same-origin") {
	    return new Promise((res, rej) => {
	        var form;

	        if (form_data instanceof FormData)
	            form = form_data;
	        else {
	            form = new FormData();
	            for (let name in form_data)
	                form.append(name, form_data[name] + "");
	        }

	        fetch(url + "", Object.assign({
	            method: "POST",
	            body: form
	        }, getCORSModes(url))).then(r => {
	            if (r.status < 200 || r.status > 299)
	                r.text().then(rej);
	            else
	                r.json().then(res);
	        }).catch(e => e.text().then(rej));
	    });
	}

	function submitJSON(url, json_data, m = "same-origin") {
	    return new Promise((res, rej) => {
	        fetch(url + "", Object.assign({
	            method: "POST",
	            body: JSON.stringify(json_data),
	            headers: {
	                'Content-Type': 'application/json',
	                'Accept': 'application/json',
	            }
	        }, getCORSModes(url))).then(r => {
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

	    static resolveRelative(URL_or_url_new, URL_or_url_original = (URL$1.G) ? URL$1.G : (typeof document != "undefined" && typeof document.location != "undefined") ? document.location.toString() : null) {

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


	        let location = (typeof(document) !== "undefined") ? document.location : STOCK_LOCATION;

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
	        } else if (IS_LOCATION && location) {
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

	        let lex = whind(this.query);


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
	            str.push(`${this.path[0] == "/" || this.path[0] == "." ? "" : "/"}${this.path}`);

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

	        return fetchLocalText(this).then(res => (URL$1.RC.set(this.path, res), res));
	    }

	    /**
	     * Fetch a JSON value of the remote resource. 
	     * Just uses path component of URL. Must be from the same origin.
	     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
	     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
	     */
	    fetchJSON(ALLOW_CACHE = true) {

	        if (ALLOW_CACHE) {

	            let resource = URL$1.RC.get(this.path);

	            if (resource)
	                return new Promise((res) => {
	                    res(resource);
	                });
	        }

	        return fetchLocalJSON(this).then(res => (URL$1.RC.set(this.path, res), res));
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
	        return submitForm(this, form_data);
	    }

	    submitJSON(json_data, mode) {
	        return submitJSON(this, json_data, mode);
	    }
	    /**
	     * Goes to the current URL.
	     */
	    goto() {
	        return;
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
	URL$1.RC = new Map();

	/**
	 * The Default Global URL object. 
	 */
	URL$1.G = (typeof location != "undefined") ? new URL$1(location) : null;

	/**
	 * The Global object Proxy.
	 */
	URL$1.R = {
	    get protocol() {
	        return URL$1.G.protocol;
	    },
	    set protocol(v) {
	        return;
	    },
	    get user() {
	        return URL$1.G.user;
	    },
	    set user(v) {
	        return;
	    },
	    get pwd() {
	        return URL$1.G.pwd;
	    },
	    set pwd(v) {
	        return;
	    },
	    get host() {
	        return URL$1.G.host;
	    },
	    set host(v) {
	        return;
	    },
	    get port() {
	        return URL$1.G.port;
	    },
	    set port(v) {
	        return;
	    },
	    get path() {
	        return URL$1.G.path;
	    },
	    set path(v) {
	        return;
	    },
	    get query() {
	        return URL$1.G.query;
	    },
	    set query(v) {
	        return;
	    },
	    get hash() {
	        return URL$1.G.hash;
	    },
	    set hash(v) {
	        return;
	    },
	    get map() {
	        return URL$1.G.map;
	    },
	    set map(v) {
	        return;
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



	let SIMDATA = null;

	/* Replaces the fetch actions with functions that simulate network fetches. Resources are added by the user to a Map object. */
	URL$1.simulate = function() {
	    SIMDATA = new Map;
	    URL$1.prototype.fetchText = async d => ((d = this.toString()), SIMDATA.get(d)) ? SIMDATA.get(d) : "";
	    URL$1.prototype.fetchJSON = async d => ((d = this.toString()), SIMDATA.get(d)) ? JSON.parse(SIMDATA.get(d).toString()) : {};
	};

	//Allows simulated resources to be added as a key value pair, were the key is a URI string and the value is string data.
	URL$1.addResource = (n, v) => (n && v && (SIMDATA || (SIMDATA = new Map())) && SIMDATA.set(n.toString(), v.toString));

	URL$1.polyfill = async function() {

	    if (typeof(global) !== "undefined") {
	        const
	            fs = (await import('fs')).promises,
	            path = (await import('path')),
	            http = (await import('http'));


	        global.document = global.document || {};
	        global.document.location = URL$1.G;
	        global.location = (class extends URL$1 {});
	        URL$1.G = new URL$1(process.cwd() + "/");

	        const cached = URL$1.resolveRelative;

	        URL$1.resolveRelative = function(new_url, old_url){
	            
	            let URL_old = (old_url instanceof URL$1) ? old_url : new URL$1(old_url);
	            let URL_new = (new_url instanceof URL$1) ? new_url : new URL$1(new_url);

	            if(URL_new.path[0] == "/"){
	                URL_new.path = path.join(process.cwd() , URL_new.path);
	                return URL_new;
	            }else return cached(URL_new, URL_old);
	        };

	        /**
	         * Global `fetch` polyfill - basic support
	         */
	        global.fetch = async (url, data) => {

	            if (data.IS_CORS) { // HTTP Fetch
	                return new Promise(res => {
	                    http.get(url, data, (req, error) => {

	                        let body = "";

	                        req.setEncoding('utf8');

	                        req.on("data", d => {
	                            body += d;
	                        });

	                        req.on("end", () => {
	                            res({
	                                status: 200,
	                                text: () => {
	                                    return {
	                                        then: (f) => f(body)
	                                    }
	                                }
	                            });
	                        });
	                    });
	                })


	            } else { //FileSystem Fetch
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
	            }
	        };
	    }
	};

	Object.freeze(URL$1.R);
	Object.freeze(URL$1.RC);
	Object.seal(URL$1);

	var types = {
		identifier: 1,
		string: 2,
		add_expression: 3,
		and_expression: 4,
		array_literal: 5,
		arrow_function_declaration: 6,
		assignment_expression: 7,
		await_expression: 8,
		binding: 9,
		block_statement: 10,
		bool_literal: 11,
		call_expression: 12,
		catch_statement: 13,
		condition_expression: 14,
		debugger_statement: 15,
		delete_expression: 16,
		divide_expression: 17,
		equality_expression: 18,
		exponent_expression: 19,
		expression_list: 20,
		expression_statement: 21,
		for_statement: 22,
		function_declaration: 23,
		if_statement: 25,
		in_expression: 26,
		instanceof_expression: 27,
		left_shift_expression: 28,
		lexical_declaration: 29,
		member_expression: 30,
		modulo_expression: 31,
		multiply_expression: 32,
		negate_expression: 33,
		new_expression: 34,
		null_literal: 35,
		numeric_literal: 36,
		object_literal: 37,
		or_expression: 38,
		plus_expression: 39,
		post_decrement_expression: 40,
		post_increment_expression: 41,
		pre_decrement_expression: 42,
		pre_increment_expression: 43,
		property_binding: 44,
		right_shift_expression: 45,
		right_shift_fill_expression: 46,
		return_statement: 47,
		spread_element: 48,
		statements: 49,
		subtract_expression: 51,
		this_literal: 52,
		try_statement: 53,
		typeof_expression: 54,
		unary_not_expression: 55,
		unary_or_expression: 56,
		unary_xor_expression: 57,
		void_expression: 58,
		argument_list: 59,
		variable_declaration: 61,
		class_method: 62,
		class_declaration: 63,
		template: 64,
		template_head: 65,
		template_middle: 66,
		template_tail: 67,
		export_declaration: 68,
		empty: 69,
		module: 71,
		import_declaration: 70,
		super_literal: 72,
		cover_parenthesized_expression_and_arrow_parameter_list: 60,
		for_of_statement: 73,
		for_in_statement: 74,
		script: 75,
		switch_statement: 76,
		case_statement:77
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
	                    return -(i+1);
	                } else
	                    return vals[i] = _new, i;
	        }
	    }

	    clearRoots(){
	        this.vals.forEach(a=>a.clearRoots());
	    }

	    addToClosure(c){
	        this.vals.forEach(a=>a.addToClosure(c));
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
	            if(this.SKIP == true){
	                break;
	            }

	            const node = vals[i];

	            if (!node) continue;

	            if(Array.isArray(node)){
	                yield* this.traverseDepthFirst(p, node);
	            }else if(typeof(node) == "object"){
	                yield* node.traverseDepthFirst(this);
	            }

	            if (vals[i] !== node) // Check to see if node has been replaced. 
	                i--; //Reparse the node
	        }
	    }

	    * traverseChildren(vals = this.vals) {
	        for (let i = 0; i < vals.length; i++) {
	            const node = vals[i];

	            if (!node) continue;

	            if(Array.isArray(node)){
	                yield* this.traverseChildren(node);
	            }else if(typeof(node) == "object"){
	                node.parent = this;
	                yield node;
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

	    clone(){
	        const clone = Object.assign(new this.constructor(), this);

	        clone.vals = clone.vals.map(e=>(e && e.clone) ? e.clone() : e);

	        return clone.connect;
	    }

	    copy(){
	        return this.clone();
	    }

	    get connect(){
	        this.vals.forEach(v=>{
	            if(v instanceof base){
	                v.parent = this;
	                v.connect;
	            }
	        });
	        return this;
	    }
	}

	class statement extends base {get IS_STATEMENT(){return true}}

	/** OPERATOR **/
	class operator$1 extends base {

	    constructor(sym = []) {
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

	        if ((index = super.replaceNode(original, _new)) < 0){
	            this.replace(this.vals[(-(index))%2]);
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

	/** ARGUMENT_LIST **/

	class argument_list extends base {
	    constructor(sym) {

	        super(...sym);
	    }

	    get args() { return this.vals }

	    getRootIds(ids, closure) {
	        this.args.forEach(s => s.getRootIds(ids, closure));
	    }

	    replaceNode(original, _new = null) {
	        let index = 0;
	        if ((index = super.replaceNode(original, _new, this.vals)) < 0) {
	            this.vals.splice(-(index+1), 1);
	        }
	    }

	    * traverseDepthFirst(p) {
	        yield * super.traverseDepthFirst(p, this.vals);
	    }

	    get length (){
	        return this.args.length;
	    }

	    get type() { return types.argument_list }

	    render(USE_PARENTHASIZ) { 
	        return this.args.map(s=>(s.render())).join(",") ;
	    }
	}

	class array_literal extends base {
	    constructor(list) {
	        super(...(list || []));
	    }

	    get exprs() { return this.vals }

	    getRootIds(ids, closure) {
	        this.exprs.forEach(e => e.getRootIds(ids, closure));
	    }

	    replaceNode(original, _new = null) {
	        let index = 0;
	        if ((index = super.replaceNode(original, _new, this.vals)) < 0) {
	            this.vals.splice((-(index+1)), 1);
	        }
	    }

	    get type() { return types.array_literal }

	    render() { return `[${this.exprs.map(a=>a.render()).join(",")}]` }
	}

	class function_declaration extends statement {
	    constructor(id, args, body, _async = false) {

	        super(id, args || null, body || null);

	        //This is a declaration and id cannot be a closure variable. 
	        if (this.id)
	            this.id.root = false;

	        this.async = _async;
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

	    get type() { return types.function_declaration }

	    render() {
	        const
	            body_str = (this.body) ? this.body.render() : "",
	            args_str = (this.args) ? this.args.render() : "()",
	            id = this.id ? this.id.render() : "";

	        return `${this.async ? "async ": ""}function ${id}${args_str}{${body_str}}`;
	    }
	}

	/** cover_parenthesized_expression_and_arrow_parameter_list **/

	class argument_list$1 extends base {
	    constructor(...sym) {
	        super(...sym);
	    }

	    get args() { return this.vals }

	    get length() {
	        return this.vals.length;
	    }

	    replaceNode(original, _new = null) {
	        let index = 0;
	        if ((index = super.replaceNode(original, _new)) < 0) {
	            this.vals.splice(-(index + 1), 1);
	        }
	    }

	    get type() { return types.argument_list }

	    render(USE_PARENTHASIS = true) {
	        const str = this.vals.map(s => (s.render())).join(",");
	        return USE_PARENTHASIS ? `(${str})` : str;
	    }
	}

	class arrow_function_declaration extends function_declaration {
	    constructor(...sym) {

	        super(...sym);

	        if (!this.args)
	            this.vals[1] = new argument_list$1();

	        this.args.clearRoots();
	    }

	    getRootIds(ids, closure) {
	        if (this.args){
	            this.args.getRootIds(ids, closure);
	            this.args.addToClosure(closure);
	        }
	        if (this.body)
	            this.body.getRootIds(ids, closure);
	    }

	    get IS_STATEMENT() { return false }

	    get name() { return null }

	    get type() { return types.arrow_function_declaration }

	    render() {
	        
	        const
	            body_str = ((this.body) ?
	                ((this.body.IS_STATEMENT || (this.body.type == types.statements && this.body.stmts.length > 1)) ?
	                    `{${this.body.render()}}` :
	                    (this.body.type == types.object_literal) ?
	                        `(${this.body.render()})`
	                        :
	                    this.body.render()) :
	                "{}"),
	            args_str = this.args.render(this.args.length !== 1);

	        return `${args_str}=>${body_str}`;
	    }
	}

	/** ASSIGNEMENT EXPRESSION **/

	class assignment_expression extends operator$1 {
	    constructor(sym =[]) {
	        super(sym);
	        this.op = sym[1];
	        //this.id.root = false;
	    }
	    
	    getRootIds(ids, closure) { 
	        if(this.left.type !== types.identifier)
	            this.left.getRootIds(ids, closure);
	        this.right.getRootIds(ids, closure);
	    }

	    get id() { return this.vals[0] }
	    get expr() { return this.vals[2] }
	    get type() { return types.assignment_expression }
	}

	/** OPERATOR **/

	class unary_pre extends base {

	    constructor(sym = []) {
	        super(sym[1]);
	        this.op = "";
	    }

	    get expr() { return this.vals[0] }

	    replaceNode(original, _new = null) {
	        if(_new === null || _new.type == types.null_literal){
	            this.replace(_new);
	        }
	        else
	            this.vals[0] = _new;
	    }

	    render() { return `${this.op} ${this.expr.render()}` }
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
	    constructor(sym = []) {
	        super(sym[0], sym[1] || null);
	        if(this.id) this.id.root = false;
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

	/** BITWISE AND EXPRESSION **/
	class bitwise_and_espression extends operator$1 {

	    constructor(sym) {
	        super(sym);
	        this.op = "&";
	    }

	    get type () { return types.bitwise_and_espression }
	}

	/** BITWISE OR EXPRESSION **/
	class bitwise_or_espression extends operator$1 {

	    constructor(sym) {
	        super(sym);
	        this.op = "|";
	    }

	    get type () { return types.bitwise_or_espression }
	}

	/** BITWISE XOR EXPRESSION **/
	class bitwise_xor_espression extends operator$1 {

	    constructor(sym) {
	        super(sym);
	        this.op = "^";
	    }

	    get type () { return types.bitwise_xor_espression }
	}

	/** STATEMENTS **/
	class statements extends statement {
	    constructor(sym = [[]]) {

	        if (sym[0].length == 1)
	            return sym[0][0];
	        
	        super(...sym[0]);
	    }

	    get stmts() { return this.vals }

	    getRootIds(ids, closure) {
	        this.stmts.forEach(s => s.getRootIds(ids, closure));
	    }

	    replaceNode(original, _new = null) {
	        let index = -1;
	        if ((index = super.replaceNode(original, _new, this.vals)) < 0) {
	            this.vals.splice(-(index+1), 1);
	        }
	    }

	    * traverseDepthFirst(p) {
	        yield * super.traverseDepthFirst(p, this.vals);
	    }

	    get type() { return types.statements }

	    render() { 
	        return this.stmts.map(s=>(s.render())).join("") ;
	    }
	}

	/** BLOCK **/
	class block_statement extends statements {

	    constructor(sym) {
	        if (sym) {
	            if (!(sym[1] instanceof statements))
	                return sym[1];
	            super([sym[1].vals]);
	        } else
	            super();
	    }

	    getRootIds(ids, closure) {
	        super.getRootIds(ids, new Set([...closure.values()]));
	    }

	    get type() { return types.block_statement }

	    render() { return `{${super.render()}}` }
	}

	/** BOOLEAN **/

	class bool_literal extends base {
	    constructor(sym = []) { super(sym[0]); }

	    get type() { return types.bool_literal }

	    * traverseDepthFirst(p) {
	        this.parent = p;
	        yield this;
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

	class call_expression extends base {
	    constructor(sym = []) {
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
	        if ((index = super.replaceNode(original, _new, this.vals)) < 0) {
	            if(index == 0)
	                this.replace(_new);
	            else
	                this.replace(null);
	        }
	    }

	    get name() { return this.id.name }
	    get type() { return types.call_expression }

	    render() { 
	        return `${this.id.render()}${this.args.render()}` 
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

	/** CATCH **/
	class catch_statement extends statement {
	    constructor(sym = []) {
	        super(sym[2], sym[4]);
	    }

	    get variable() { return this.vals[0] }
	    get body() { return this.vals[1] }

	    getRootIds(ids, closure) {
	        closure.add(this.variable.val);
	        this.body.getRootIds(ids, closure);
	    }

	    get type() { return types.catch_statement }

	    render(){
	        return `catch (${this.variable})${this.body.type == types.block_statement ? this.body : `{${this.body}}`}`
	    }
	}

	class class_declaration extends base {
	    constructor(id, heritage, body) {

	        super(id, heritage, body);

	        //This is a declaration and id cannot be a closure variable. 
	        if (this.id)
	            this.id.root = false;

	        this.IS_STATEMENT = true;
	    }

	    get id() { return this.vals[0] }
	    get heritage() { return this.vals[1] }
	    get body() { return this.vals[2] }


	    getRootIds(ids, closure) {
	        if (this.id)
	            this.id.getRootIds(ids, closure);
	        if (this.heritage)
	            this.heritage.getRootIds(ids, closure);
	        if (this.body)
	            for(const item of this.body)
	                item.getRootIds(ids, closure);
	    }

	    get name() { return this.id.name }

	    get type() { return types.class_declaration }

	    render() {
	        const
	            body_str = this.body.map(b=>b.render()).join(""),
	            heritage = (this.heritage) ? " extends "+this.heritage.render() : "",
	            id = this.id ? " " + this.id.render() : "";

	        return `class${id}${heritage}{${body_str}}`;
	    }
	}

	class class_method extends function_declaration {
	    constructor(id, args, body, method_type = "", _async = false) {

	        super(id, args, body, _async);

	        this.method_type = "";
	        this.static = false;
	    }

	    get type() { return types.class_method }

	    render() {
	        const
	            body_str = (this.body) ? this.body.render() : "",
	            args_str = (this.args) ? this.args.render(true) : "()",
	            id = this.id ? this.id.render() : "";

	        return `${this.async ? "async " : ""}${this.method_type ? this.method_type + " ": ""}${id}${args_str}{${body_str}}`;
	    }
	}

	/** CONDITION EXPRESSIONS **/
	class condition_expression extends base {
	    constructor(sym = []) {
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

	/** CONTINUE STATMENT  **/

	class continue_statement extends base {
	    get label() { return this.vals[0] }

	    get type() { return types.continue_statement }

	    render() {
	        let label_str = this.label ? " " + this.label.render(): "";        
	        return `continue${label_str};`;
	    }
	}

	/** DEBUGGER STATEMENT  **/

	class debugger_statement extends statement {
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

	class default_import extends base {
	    constructor(sym = []) {
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

	/** empty **/
	class empty_statement extends base {
	    constructor() {
	        super();
	    }
	    get type() { return types.empty }
	    render() { return "" }
	}

	/** EQ **/
	class equality_expression extends operator$1 {
	    constructor(sym = []) {super(sym); this.op = sym[1];  }
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

	/** EXPRESSION_LIST **/

	class expression_list extends base {
	    constructor(sym = []) {

	        if (sym[0] && sym[0].length === 1)
	            return sym[0][0];

	        super(...(sym[0] || []));
	    }

	    get expressions() { return this.vals }

	    getRootIds(ids, closure) {
	        this.expressions.forEach(s => s.getRootIds(ids, closure));
	    }

	    replaceNode(original, _new = null) {
	        let index = -1;
	        if ((index = super.replaceNode(original, _new, this.vals[0])) < 0) {
	            this.vals[0].splice(-(index+1), 1);
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

	    constructor(sym = []) {
	        super(sym[0]);
	    }

	    get expression() { return this.vals[0] }

	    getRootIds(ids, closure) {
	        this.expression.getRootIds(ids, closure);
	    }

	    replaceNode(original, _new = null) {
	        if(super.replaceNode(original, _new, this.vals) < 0)
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
	class identifier$1 extends base {
	    constructor(sym = []) {
	        super(sym[0]);
	        this.root = true;
	    }

	    clearRoots(){
	        this.root = false;
	    }

	    get val() { return this.vals[0] }

	    getRootIds(ids, closure) {
	        if (this.root && !closure.has(this.val)) 
	            ids.add(this.val);
	    }

	    addToClosure(closure) {
	        closure.add(this.val);
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
	    constructor(sym = []) {
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
	            stmt = this.stmt.type == types.statements ? `{${this.stmt.render()}}` : `{${this.stmt.render()}}`,
	            _else = (this.else_stmt) ? " else " + (
	                this.else_stmt.type == types.statements || this.else_stmt.type == types.if_statement ? `{${this.else_stmt.render()}}` : `{${this.else_stmt.render()}}`
	            ) : "";
	        return `if(${expr})${stmt}${_else}`;
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

	/** IMPORT STATEMENT  **/



	class import_declaration extends base {

	    constructor(specifier, import_clause = null) {
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

	/** RETURN STATMENT  **/



	class label_statement extends base {
	    constructor(sym = []) {
	        super(sym[0], sym[1]);
	    }

	    get id(){return this.vals[0]}
	    get stmt(){return this.vals[1]}

	    get type() { return types.label_statement }

	    render() {
	        return `${this.id.render()}: ${this.stmt.render()}`;
	    }
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
	    constructor(sym = []) {
	        super(sym[1]);
	        this.mode = sym[0];
	        this.IS_STATEMENT = true;
	    }

	    get bindings() { return this.vals[0] }

	    getRootIds(ids, closure) {
	        this.bindings.forEach(b => b.getRootIds(ids, closure, true));
	    }

	    get type() { return types.lexical_declaration }

	    render() { return `${this.mode} ${this.bindings.map(b=>b.render()).join(",")};` }
	}

	/** MEMBER **/

	class member_expression extends base {
	    constructor(id, mem = null, evaluated = false) { 
	        super(id, mem);
	        this.evaluated = evaluated;
	        this.root = true;
	        if(this.mem)
	            this.mem.root = false;
	    }

	    get id() { return this.vals[0] }
	    get mem() { return this.vals[1] }

	    getRootIds(ids, closure) {
	        this.id.getRootIds(ids, closure);
	    }

	    replaceNode(original, _new = null) {
	        let index = 0;
	        if ((index = super.replaceNode(original, _new, this.vals)) < 0) {
	            if(-(index+1) == 0)
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

	/** MODULE TL  **/

	class module extends base {
	    constructor(sym) {
	        super(sym);
	    }

	    get statements() { return this.vals[0] }

	    getRootIds(ids, closure) {
	        if (this.statements) this.statements.getRootIds(ids, closure);
	    }

	    get type() { return types.module }

	    render() {
	        return this.statements.render();
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
	    }

	    get type(){return types.new_expression}

	    render() { 
	        const
	            args_str = (this.args) ? this.args.render() : "";

	        return `new ${this.id.render()}${args_str}`;
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

	/** OBJECT LITERAL **/

	class object_literal extends base {
	    constructor(props = []) {
	        super(...props);
	    }

	    get props() { return this.vals }

	    getRootIds(ids, closure) {
	        if(this.props)
	            for(const id of this.props)
	                if(id && id.getRootIds)
	                    id.getRootIds(ids, closure);
	    }

	    get type() { return types.object_literal }

	    render() { return `{${this.props ? this.props.map(p=>p.render()).join(","): ""}}` }
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

	    constructor(sym = []) {
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
	    constructor(sym = []) {
	        super([sym[0], sym[2]]);
	    }
	    get type( ){return types.property_binding}
	    render() { return `${this.id.type > 2 ? `[${this.id.render()}]` : this.id.render()} : ${this.init.render()}` }
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

	/** SPREAD **/

	class spread_element extends unary_pre {

	    constructor(sym) {
	        super(sym);
	        this.op = "...";
	    }

	    get type() { return types.spread_element }

	}

	/** STRING **/

	class string$1 extends base {
	    constructor(sym = []) { super(sym.length === 3 ? sym[1]: ""); }

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

	/** TEMPLATE **/


	class nosubstitute_string extends base{
	    render(){
	        return this.vals[0];
	    }
	}

	class template extends base {
	    constructor(sym = []) {

	    	const NO_SUBSTITUTE = typeof sym == "string";

	        if (NO_SUBSTITUTE){
	            super(new nosubstitute_string(sym));
	        }
	        else
	            super(...sym);
	        
	        this.NO_SUBSTITUTE = NO_SUBSTITUTE;
	    }

	    get str() { return this.vals[0] }

	    get type() { return types.template }

	    render() {
	        let str = [this.str.render()];

	        if (!this.NO_SUBSTITUTE)
	            str = this.vals.map(v => v.render());

	        return "`" + str.join("") + "`";
	    }
	}

	/** TEMPLATE HEAD **/

	class template_head extends base {
		
	    constructor(sym) { super(sym|| ""); }

	    get string() { return this.vals[0] }

	    get expression() { return this.vals[1] }

	    get type() { return types.template_head }

	    render() { 
	    	return `${this.string}\${${this.expression.render()}`;
	    }
	}

	/** TEMPLATE MIDDLE **/

	class template_middle extends base {

	    constructor(sym) { super(sym || ""); }

	    get string() { return this.vals[0] }

	    get expression() { return this.vals[1] }

	    get type() { return types.template_middle }

	    render() { 
	    	return `}${this.string}\${${this.expression.render()}`;
	    }
	}

	/** TEMPLATE MIDDLE **/

	class template_tail extends base {

		constructor(sym) { super(sym|| ""); }

	    get string() { return this.vals[0] }

	    get type() { return types.template_tail }

	    render() { 
	    	return `}${this.string}`;
	    }
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

	/** THROW STATEMENT  **/

	class throw_statement extends statement {
	    constructor(sym = []) {
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
	        return `try ${this.body.type == types.block_statement ? this.body : `{${this.body}}`} ${this.catch ? " "+ this.catch : ""}${this.finally ? " "+this.finally : ""}`
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

	/** VARIABLE STATEMENT **/
	class variable_declaration extends statement {
	    constructor(sym) {
	        super(...sym[1]);
	    }

	    get bindings() { return this.vals }

	    getRootIds(ids, closure) {
	        this.bindings.forEach(b => b.getRootIds(ids, closure, true));
	    }

	    get type() { return types.variable_declaration }

	    render() { return `var ${this.bindings.map(b=>b.render()).join(",")};` }
	}

	/** VOID **/

	class void_expression extends unary_pre {

	    constructor(sym) {
	        super(sym);
	        this.op = "void";
	    }

	    get type() { return types.void_expression }
	}

	/** SUPER LITERAL  **/

	class super_literal extends base {
	    constructor(sym) {
	        super(sym);
	    }

	    getRootIds(ids, closure) {}

	    get type() { return types.super_literal }

	    render() { return `super`; }
	}

	/** FOR OF **/
	class for_of_statement extends statement {

	    get await() { return this.vals[0] }
	    get binding() { return this.vals[1] }
	    get expression() { return this.vals[2] }
	    get body() { return this.vals[3] }

	    get type() { return types.for_of_statement }

	    getRootIds(ids, closure) {  
	        if (this.binding) this.binding.getRootIds(ids, closure);
	        if (this.expression) this.expression.getRootIds(ids, closure);
	        if (this.body) this.body.getRootIds(ids, new Set);
	    }

	    render() {
	        let binding, expression, body;

	        if (this.binding) binding = this.binding.render();
	        if (this.expression) expression = this.expression.render();
	        if (this.body) body = this.body.render();

	        return `for(${binding} of ${expression})${body}`;
	    }
	}

	/** FOR IN **/
	class for_in_statement extends statement {

	    get binding() { return this.vals[0] }
	    get expression() { return this.vals[1] }
	    get body() { return this.vals[2] }

	    get type() { return types.for_in_statement }

	    getRootIds(ids, closure) {  
	        if (this.binding) this.binding.getRootIds(ids, closure);
	        if (this.expression) this.expression.getRootIds(ids, closure);
	        if (this.body) this.body.getRootIds(ids, new Set);
	    }


	    render() {
	        let binding, expression, body;

	        if (this.binding) binding = this.binding.render();
	        if (this.expression) expression = this.expression.render();
	        if (this.body) body = this.body.render();

	        return `for(${binding} in ${expression} ) ${body}`;
	    }
	}

	/** LEXICAL EXPRESSION **/
	//Like lexical declaration except omiting the semi-colon within the render() output.
	class lexical_expression extends lexical_declaration {
		constructor(sym) {
	        super(sym);
	        this.vals[0] = [new binding([this.vals[0]])];
	        this.IS_STATEMENT = false;
	    }
	    render() { 
	    	return super.render().slice(0, -1);
	   	}
	    get type(){return types.lexical_expression}
	}

	/**
	 * Global Document instance short name
	 * @property DOC
	 * @package
	 * @memberof module:wick~internals
	 * @type 	{Document}
	 */
	const DOC = (typeof(document) !== "undefined") ? document : ()=>{};

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
	class P {
	    constructor(preset_options) {
	        if (!preset_options)
	            preset_options = {};

	        /**
	         * {Object} Store for optional parameters used in the app
	         */
	        this.options = {
	            THROW_ON_ERRORS: false
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
	        this.schemes = {};

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
	         * { Object } Contains all user defined HTMLElement templates 
	         */
	        this.templates = {};

	        /**
	         * Custom objects that can be used throughout component scripts. User defined. 
	         */
	        this.custom = Object.assign({}, preset_options.custom, P.default_custom);

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
	                this.models[cn] = c[cn];

	        c = preset_options.schemas;

	        if (c)
	            for (let cn in c)
	                this.schemas[cn] = c[cn];
	        /**
	         * Configured by `preset_options.USE_SHADOW`. If set to true, and if the browser supports it, compiled and rendered template elements will be bound to a `<component>` shadow DOM, instead being appended as a child node.
	         * @instance
	         * @readonly
	         */
	        this.options.USE_SHADOW = (preset_options.USE_SHADOW) ? (DOC.head.createShadowRoot || DOC.head.attachShadow) : false;
	        this.options.USE_SHADOWED_STYLE = ((preset_options.USE_SHADOWED_STYLE) && (this.options.USE_SHADOW));
	        this.url = URL$1;

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

	        const presets = new P(obj);

	        presets.processLink = this.processLink.bind(this);

	        return presets;
	    }
	}

	P.global = {get v(){return CachedPresets}, set v(e){}};

	var wick_parser_data = ((e,s,u,g)=>({
	         fn : {}, 
	/************** Maps **************/
	    st:s,
	    /* Types */ ty: {num:1,number:1,id:2,identifier:2,str:3,string:3,ws:4,white_space:4,ob:5,open_bracket:5,cb:6,close_bracket:6,op:7,operator:7,sym:8,symbol:8,nl:9,new_line:9,dl:10,data_link:10,alpha_numeric:11,white_space_new_line:12,any:13,keyword:14},
	    /* Symbols To Inject into the Lexer */ sym : ["</","||","^=","$=","*=","<=",">=","...","<",">","==","!=","===","!==","**","++","--","<<",">>",">>>","&&","+=","-=","%=","/=","**=","<<=",">>=",">>>=","&=","|=","=>","//","/*","${","0x","0X","0b","0B","0o","0O","<!"],
	    /* Symbol Lookup map */ lu : new Map([[1,1],[2,2],[4,3],[8,4],[16,5],[32,6],[64,7],[128,8],[256,9],[512,10],[3,11],[264,12],[200,13],[201,14],["</",15],["import",16],[">",17],["<",18],["/",155],["!",151],["(",21],[")",22],[null,6],[",",24],["{",178],[";",69],["}",118],["supports",28],["@",29],["keyframes",30],["id",31],["from",32],["to",33],["and",34],["or",35],["not",36],["media",38],["only",39],[":",71],["<=",42],[">=",43],["=",44],["%",46],["px",47],["in",48],["rad",49],["url",50],["\"",157],["'",156],["+",202],["~",54],["||",55],["*",57],["|",58],["#",59],[".",201],["[",62],["]",63],["^=",64],["$=",65],["*=",66],["i",67],["s",68],["important",70],["-",146],["_",74],["as",76],["export",77],["default",78],["if",80],["else",81],["var",82],["do",83],["while",84],["for",85],["await",86],["of",87],["continue",88],["break",89],["return",90],["throw",91],["with",92],["switch",93],["case",94],["try",95],["catch",96],["finally",97],["debugger",98],["let",99],["const",100],["function",101],["=>",102],["async",103],["class",104],["extends",105],["static",106],["get",107],["set",108],["new",109],["super",110],["target",111],["...",112],["this",113],["/*",114],["yield",115],["`",116],["${",117],["/=",124],["%=",125],["+=",126],["-=",127],["<<=",128],[">>=",129],[">>>=",130],["&=",131],["|=",132],["**=",133],["?",134],["&&",135],["^",136],["&",137],["==",138],["!=",139],["===",140],["!==",141],["instanceof",142],["<<",143],[">>",144],[">>>",145],["**",147],["delete",148],["void",149],["typeof",150],["++",152],["--",153],["\\",154],["b",184],["f",188],["n",160],["r",161],["y",162],["v",163],["x",176],["u",177],["0",166],["1",167],["2",168],["3",169],["4",170],["5",171],["6",172],["7",173],["8",174],["9",175],["null",179],["true",180],["false",181],["$",182],["a",183],["c",185],["d",186],["e",187],["A",189],["B",190],["C",191],["D",192],["E",193],["F",194],["0x",195],["0X",196],["0b",197],["0B",198],["0o",199],["0O",200],["<!",203],["input",204],["area",205],["base",206],["br",207],["col",208],["command",209],["embed",210],["hr",211],["img",212],["keygen",213],["link",214],["meta",215],["param",216],["source",217],["track",218],["wbr",219],["style",220],["script",221],["js",222]]),
	    /* Reverse Symbol Lookup map */ rlu : new Map([[1,1],[2,2],[3,4],[4,8],[5,16],[6,32],[7,64],[8,128],[9,256],[10,512],[11,3],[12,264],[13,200],[14,201],[15,"</"],[16,"import"],[17,">"],[18,"<"],[155,"/"],[151,"!"],[21,"("],[22,")"],[6,null],[24,","],[178,"{"],[69,";"],[118,"}"],[28,"supports"],[29,"@"],[30,"keyframes"],[31,"id"],[32,"from"],[33,"to"],[34,"and"],[35,"or"],[36,"not"],[38,"media"],[39,"only"],[71,":"],[42,"<="],[43,">="],[44,"="],[46,"%"],[47,"px"],[48,"in"],[49,"rad"],[50,"url"],[157,"\""],[156,"'"],[202,"+"],[54,"~"],[55,"||"],[57,"*"],[58,"|"],[59,"#"],[201,"."],[62,"["],[63,"]"],[64,"^="],[65,"$="],[66,"*="],[67,"i"],[68,"s"],[70,"important"],[146,"-"],[74,"_"],[76,"as"],[77,"export"],[78,"default"],[80,"if"],[81,"else"],[82,"var"],[83,"do"],[84,"while"],[85,"for"],[86,"await"],[87,"of"],[88,"continue"],[89,"break"],[90,"return"],[91,"throw"],[92,"with"],[93,"switch"],[94,"case"],[95,"try"],[96,"catch"],[97,"finally"],[98,"debugger"],[99,"let"],[100,"const"],[101,"function"],[102,"=>"],[103,"async"],[104,"class"],[105,"extends"],[106,"static"],[107,"get"],[108,"set"],[109,"new"],[110,"super"],[111,"target"],[112,"..."],[113,"this"],[114,"/*"],[115,"yield"],[116,"`"],[117,"${"],[124,"/="],[125,"%="],[126,"+="],[127,"-="],[128,"<<="],[129,">>="],[130,">>>="],[131,"&="],[132,"|="],[133,"**="],[134,"?"],[135,"&&"],[136,"^"],[137,"&"],[138,"=="],[139,"!="],[140,"==="],[141,"!=="],[142,"instanceof"],[143,"<<"],[144,">>"],[145,">>>"],[147,"**"],[148,"delete"],[149,"void"],[150,"typeof"],[152,"++"],[153,"--"],[154,"\\"],[184,"b"],[188,"f"],[160,"n"],[161,"r"],[162,"y"],[163,"v"],[176,"x"],[177,"u"],[166,"0"],[167,"1"],[168,"2"],[169,"3"],[170,"4"],[171,"5"],[172,"6"],[173,"7"],[174,"8"],[175,"9"],[179,"null"],[180,"true"],[181,"false"],[182,"$"],[183,"a"],[185,"c"],[186,"d"],[187,"e"],[189,"A"],[190,"B"],[191,"C"],[192,"D"],[193,"E"],[194,"F"],[195,"0x"],[196,"0X"],[197,"0b"],[198,"0B"],[199,"0o"],[200,"0O"],[203,"<!"],[204,"input"],[205,"area"],[206,"base"],[207,"br"],[208,"col"],[209,"command"],[210,"embed"],[211,"hr"],[212,"img"],[213,"keygen"],[214,"link"],[215,"meta"],[216,"param"],[217,"source"],[218,"track"],[219,"wbr"],[220,"style"],[221,"script"],[222,"js"]]),
	    /* States */ sts : [0,1,2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,18,18,19,20,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,24,25,26,27,28,29,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,44,44,44,44,44,44,45,44,44,46,47,48,49,50,50,50,51,52,52,52,52,52,52,53,54,55,56,57,58,58,59,59,60,60,60,60,61,62,62,63,64,65,66,67,68,68,68,68,69,70,71,72,73,73,74,75,75,76,77,77,78,79,80,81,81,82,44,83,84,85,86,86,44,87,88,89,90,91,92,93,93,94,95,96,97,98,99,100,101,44,102,103,104,104,104,105,106,106,107,90,108,109,110,111,112,113,114,115,116,117,118,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,119,120,121,122,123,124,125,126,127,127,128,129,130,131,132,124,133,134,134,135,136,79,137,138,139,140,141,44,44,44,142,143,144,144,144,144,144,144,144,144,144,144,144,144,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,145,45,146,52,52,52,52,52,147,148,149,105,150,151,152,153,154,155,156,157,158,159,160,161,44,162,163,44,160,164,165,166,48,167,168,169,170,171,172,173,173,174,174,174,174,175,175,176,177,178,179,179,179,179,179,179,179,179,179,180,181,177,182,183,183,183,183,183,183,183,183,183,184,185,186,187,188,189,189,190,191,192,193,193,193,193,193,193,193,193,194,195,196,196,197,198,199,199,199,199,199,199,199,199,199,199,199,199,199,200,201,202,203,203,204,44,205,206,207,208,209,210,211,212,213,214,215,216,217,217,217,217,217,217,217,217,217,217,217,217,217,218,219,220,90,160,44,221,222,223,224,225,226,227,228,229,230,231,231,232,233,44,234,44,235,236,44,237,238,239,240,241,242,243,44,244,245,246,247,248,249,250,251,252,253,254,255,229,229,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,273,273,273,274,274,275,276,277,278,278,278,278,278,278,278,278,279,280,281,282,160,283,284,285,286,287,288,289,290,291,292,293,293,293,294,295,296,297,298,299,300,301,302,303,303,304,305,306,307,308,309,310,310,310,310,311,311,311,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,327,44,329,330,331,331,332,332,333,333,334,334,44,335,336,337,338,339,247,340,341,342,343,344,345,346,347,348,349,350,44,351,352,353,354,155,355,356,357,358,359,360,360,360,360,360,360,360,360,361,362,360,360,360,360,360,360,360,360,360,360,360,360,357,363,364,365,365,366,168,367,368,368,369,370,371,372,373,374,375,376,377,378,379,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,218,394,44,395,396,397,398,399,400,401,402,24,403,404,404,405,90,406,44,406,407,408,409,160,410,411,412,413,414,415,416,417,90,418,419,420,421,422,423,424,425,426,427,428,429,90,430,90,431,432,433,434,435,436,437,438,439,440,441,102,442,443,444,445,446,447,448,449,448,450,451,452,453,454,455,456,457,458,459,460,461,90,462,462,463,464,465,466,467,468,469,470,471,472,471,473,474,475,476,477,478,479,480,480,481,482,483,483,484,485,486,487,488,489,490,487,491,492,493,494,495,496,497,497,498,499,500,501,160,502,503,504,505,506,160,44,507,508,509,510,511,44,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,342,76,76,531,532,533,534,535,535,536,537,538,539,540,541,44,542,543,544,545,546,90,547,547,548,549,550,551,552,553,553,554,555,90,556,557,558,559,558,558,560,561,561,562,94,44,94,563,564,565,44,44,566,567,568,569,570,571,572,571,571,573,574,90,90,575,94,576,90,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,594,594,594,596,597,597,598,476,599,476,600,601,602,603,604,605,606,607,490,599,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,90,624,625,626,627,628,629,630,631,632,633,634,76,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,651,652,653,654,655,656,657,658,659,660,661,94,662,663,664,665,94,44,666,666,667,668,669,670,671,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,688,688,688,688,688,688,689,476,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,76,718,719,720,721,722,723,724,725,725,726,727,728,727,94,729,730,731,94,732,94,94,733,94,94,734,94,94,735,736,737,738,739,740,44,741,102,742,743,744,745,746,747,748,749,750,749,751,752,753,754,755,756,757,758,759,760,761,762,763,764,764,765,766,767,768,769,769,770,771,772,773,774,775,776,777,778,779,780,780,780,780,781,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,94,94,830,94,831,832,833,834,94,835,836,94,837,838,839,840,838,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,766,862,863,864,865,866,867,868,869,870,862,871,872,872,872,872,873,874,874,875,876,877,878,879,880,881,882,883,884,884,884,885,885,886,887,888,781,889,890,891,781,892,893,857,857,857,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,94,929,930,931,932,933,934,935,935,936,937,938,939,940,941,942,943,944,945,946,946,947,947,948,949,950,951,781,952,953,953,954,954,955,956,957,958,958,959,960,961,962,962,963,964,965,861,966,966,967,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,986,986,986,987,862,988,989,990,991,942,992,993,994,942,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,859,1028,1029,1030,1031,1032,1033,1034,956,1035,956,1036,1037,1038,1039,956,1040,1040,1040,1041,1042,1043,1044,1044,1045,1046,1027,1047,1048,1049,964,1050,1050,1051,1052,1053,862,1054,1055,1056,1057,1058,1059,1060,977,1061,1062,1062,1062,1063,1064,1064,1065,1066,1067,1017,1018,1068,1017,1018,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1080,861,1081,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1099,1100,1100,1101,1101,1101,1102,1102,1103,1103,781,781,781,1104,1105,1106,1106,1106,1107,1097,1108,1109,1110,1111,1112,1112,1112,1113,1114,1115,1116,1117,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,1128,1128,1129,1078,1078,1130,1131,1132,1133,1134,1135,1136,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1146,1146,1147,1148,1149,1141,1150,1151,766,1046,1152,1153,1154,1155,1156,1157,1158,1159,1100,1100,1160,1161,1162,1162,1163,1164,1165].map(i=>s[i]),
	    /* Fork Map */fm: [109,683],
	    /*Goto Lookup Functions*/ gt:g[0].map(i=>i>=0?u[i]:[]),
	/************ Functions *************/
	    /* Error Functions */ eh : [e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],
	    /* Environment Functions*/ fns: [sym=>sym[0],sym=>(((sym[1] !== null) ? sym[0].push(sym[1]) : null,sym[0])),sym=>(sym[0] !== null) ? [sym[0]] : [],(sym,env,lex)=>env.fn.element_selector(sym[1],sym[2],null,env,lex),(sym,env,lex)=>env.fn.element_selector(sym[1],null,null,env,lex),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(sym[3],null,env,lex,sym[0])))),function (sym,env,lex){env.start = lex.off + 2;},(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(sym[2],null,env,lex,null)))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(null,null,env,lex,sym[0])))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(null,null,env,lex,null)))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(sym[3],sym[6],env,lex,sym[0])))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(sym[2],sym[5],env,lex,null)))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(null,sym[5],env,lex,sym[0])))),(sym,env,lex)=>(((env.off = lex.off,new env.fn.wick_binding(null,sym[4],env,lex,null)))),sym=>new fn.ruleset(sym[0],sym[1]),sym=>new fn.ruleset(null,sym[0]),sym=>new fn.ruleset(sym[0],null),()=>new fn.ruleset(null,null),sym=>(((sym[1] !== null) ? sym[0].push(sym[2]) : null,sym[0])),sym=>new fn.stylerule(sym[0],sym[2]),sym=>new fn.stylerule(null,sym[1]),function (sym){this.keyframes = sym[4];},function (sym){this.selectors = sym[0];this.props = sym[2].props;},sym=>sym[0] + sym[1],sym=>sym[0] + "",sym=>new fn.type_selector([sym[0],sym[1]]),sym=>new fn.type_selector([sym[0]]),sym=>[sym[0],sym[1]],sym=>[sym[0]],sym=>((sym[0].push(sym[1]),sym[0])),sym=>((sym[0].push(... sym[1]),sym[0])),sym=>sym.join(""),function (sym,env){env.IS_MODULE = false;},(sym,env)=>(env.IS_MODULE) ? new env.fn.module(sym[0]) : new env.fn.script(sym[0]),function (sym,env){env.IS_MODULE = true;},(sym,env)=>new env.fn.import_declaration(sym[2],sym[1]),(sym,env)=>new env.fn.import_declaration(sym[1]),sym=>[sym[0],sym[2]],(sym,env)=>new env.fn.named_imports(sym[1]),(sym,env)=>new env.fn.named_imports(null),sym=>sym[1],(sym,env)=>new env.fn.import_specifier(sym[0]),(sym,env)=>new env.fn.import_specifier(sym[0],sym[2]),(sym,env)=>new env.fn.export_declaration(null,sym[2],false),(sym,env)=>new env.fn.export_declaration(sym[1],sym[2],false),(sym,env)=>new env.fn.export_declaration(sym[1],null,false),(sym,env)=>new env.fn.export_declaration(sym[2],null,true),(sym,env)=>new env.fn.export_clause(sym[1]),(sym,env)=>new env.fn.export_clause(null),(sym,env)=>new env.fn.export_specifier(sym[0]),(sym,env)=>new env.fn.export_specifier(sym[0],sym[2]),(sym,env)=>(new env.fn.for_statement(sym[2],sym[4],sym[6],sym[8])),function (sym,env){env.ASI = false;},function (sym,env){env.ASI = true;},(sym,env)=>(new env.fn.for_statement(sym[2],sym[3],sym[5],sym[7])),(sym,env)=>(new env.fn.for_in_statement(sym[2],sym[4],sym[6])),(sym,env)=>(new env.fn.for_of_statement(sym[1],sym[3],sym[5],sym[7])),(sym,env)=>(new env.fn.for_statement(null,sym[3],sym[5],sym[7])),(sym,env)=>(new env.fn.for_statement(sym[2],null,sym[5],sym[7])),(sym,env)=>(new env.fn.for_statement(sym[2],sym[4],null,sym[7])),(sym,env)=>(new env.fn.for_statement(sym[2],null,sym[4],sym[6])),(sym,env)=>(new env.fn.for_statement(sym[2],sym[3],null,sym[6])),(sym,env)=>(new env.fn.for_of_statement(null,sym[2],sym[4],sym[6])),(sym,env)=>(new env.fn.for_statement(null,null,sym[4],sym[6])),(sym,env)=>(new env.fn.for_statement(null,sym[3],null,sym[6])),(sym,env)=>(new env.fn.for_statement(sym[2],null,null,sym[6])),(sym,env)=>(new env.fn.for_statement(sym[2],null,null,sym[5])),(sym,env)=>(new env.fn.for_statement(null,null,null,sym[5])),(sym,env)=>(new env.fn.continue_statement(sym[1])),(sym,env)=>(new env.fn.continue_statement(null)),(sym,env)=>(new env.fn.break_statement(sym[1])),(sym,env)=>(new env.fn.break_statement(null)),(sym,env)=>new env.fn.return_statement(sym[1]),(sym,env)=>new env.fn.return_statement(null),(sym,env)=>new env.fn.throw_statement(sym[1]),(sym,env)=>new env.fn.with_statement(sym[2],sym[4]),(sym,env)=>new env.fn.switch_statement(sym[2],sym[4]),()=>[],sym=>sym[1].concat(sym[2].concat(sym[3])),sym=>sym[1].concat(sym[2]),sym=>sym[0].concat(sym[1]),(sym,env)=>(new env.fn.case_statement(sym[1],sym[3])),(sym,env)=>(new env.fn.case_statement(sym[1],null)),(sym,env)=>(new env.fn.default_case_statement(sym[2])),(sym,env)=>(new env.fn.default_case_statement(null)),(sym,env)=>(new env.fn.try_statement(sym[1],sym[2])),(sym,env)=>(new env.fn.try_statement(sym[1],null,sym[2])),(sym,env)=>(new env.fn.try_statement(sym[1],sym[2],sym[3])),sym=>((sym[0].push(sym[2]),sym[0])),()=>"let",()=>"const",(sym,env)=>new env.fn.function_declaration(sym[1],sym[3],sym[6]),(sym,env)=>new env.fn.function_declaration(null,sym[2],sym[5]),(sym,env)=>new env.fn.function_declaration(sym[1],null,sym[5]),(sym,env)=>new env.fn.function_declaration(sym[1],sym[3],null),(sym,env)=>new env.fn.function_declaration(null,null,sym[4]),(sym,env)=>new env.fn.function_declaration(null,sym[2],null),(sym,env)=>new env.fn.function_declaration(sym[1],null,null),(sym,env)=>new env.fn.function_declaration(null,null,null),(sym,env)=>new env.fn.parenthasized(sym[0]),(sym,env)=>new env.fn.parenthasized(... sym[0]),(sym,env)=>new env.fn.parenthasized(... sym[0],sym[2]),(sym,env)=>new env.fn.arrow_function_declaration(null,sym[0],sym[2]),(sym,env)=>new env.fn.class_declaration(sym[1],sym[2].h,sym[2].t),(sym,env)=>new env.fn.class_declaration(null,sym[1].h,sym[1].t),sym=>({h : sym[0],t : sym[2]}),sym=>({h : null,t : sym[1]}),sym=>({h : sym[0],t : null}),()=>({h : null,t : null}),sym=>(((sym[0].push(sym[1]),sym[0]))),sym=>(((sym[1].static = true,sym[1]))),(sym,env)=>new env.fn.class_method(sym[0],sym[2],sym[5]),(sym,env)=>new env.fn.class_method(sym[1],null,sym[5],"get"),(sym,env)=>new env.fn.class_method(sym[1],sym[3],sym[6],"set"),(sym,env)=>new env.fn.class_method(sym[0],null,sym[4]),(sym,env)=>new env.fn.class_method(sym[0],sym[2],null),(sym,env)=>new env.fn.class_method(sym[1],null,null,"get"),(sym,env)=>new env.fn.class_method(sym[1],sym[3],null,"set"),(sym,env)=>new env.fn.class_method(sym[0],null,null),(sym,env)=>new env.fn.class_method(sym[1],sym[3],sym[6],"",true),(sym,env)=>new env.fn.class_method(sym[1],null,sym[5],"",true),(sym,env)=>new env.fn.class_method(sym[1],sym[3],null,"",true),(sym,env)=>new env.fn.class_method(sym[1],null,null,"",true),(sym,env)=>new env.fn.new_expression(sym[1],null),(sym,env)=>new env.fn.member_expression(sym[0],sym[2],true),(sym,env)=>new env.fn.member_expression(sym[0],sym[2],false),(sym,env)=>new env.fn.member_expression(sym[0],sym[1],false),(sym,env)=>new env.fn.new_expression(sym[1],sym[2]),(sym,env)=>new env.fn.member_expression(new env.fn.super_literal(),sym[2],false),(sym,env)=>new env.fn.member_expression(new env.fn.super_literal(),sym[2],true),(sym,env)=>new env.fn.member_expression(sym[0],sym[1],true),(sym,env)=>new env.fn.call_expression([new env.fn.super_literal(),sym[1]]),(sym,env)=>new env.fn.parenthasized(... sym[1]),(sym,env)=>new env.fn.parenthasized(),(sym,env)=>new env.fn.js_wick_node(sym[0]),(sym,env)=>new env.fn.function_declaration(sym[2],sym[4],sym[7],true),(sym,env)=>new env.fn.function_declaration(null,sym[3],sym[6],true),(sym,env)=>new env.fn.function_declaration(sym[2],null,sym[6],true),(sym,env)=>new env.fn.function_declaration(sym[2],sym[4],null,true),(sym,env)=>new env.fn.function_declaration(null,null,sym[5],true),(sym,env)=>new env.fn.function_declaration(null,sym[3],null,true),(sym,env)=>new env.fn.function_declaration(sym[2],null,null,true),(sym,env)=>new env.fn.function_declaration(null,null,null,true),(sym,env)=>new env.fn.function_declaration(sym[2],sym[3],sym[6],true),(sym,env)=>new env.fn.function_declaration(sym[2],sym[4],sym[6],true),(sym,env)=>new env.fn.function_declaration(sym[2],sym[3],sym[5],true),(sym,env)=>new env.fn.template(sym[1]),(sym,env)=>new env.fn.template(null),(sym,env)=>((sym[0].vals[1] = sym[1],sym[2].unshift(sym[0]),new env.fn.template(sym[2]))),sym=>((sym[0].vals[1] = sym[1],[sym[0]])),sym=>((sym[1].vals[1] = sym[2],sym[0].push(sym[1]),sym[0])),(sym,env)=>new env.fn.template_head(sym[1]),(sym,env)=>new env.fn.template_head(null),(sym,env)=>new env.fn.template_middle(sym[1]),(sym,env)=>new env.fn.template_middle(null),(sym,env)=>new env.fn.template_tail(sym[1]),(sym,env)=>new env.fn.template_tail(null),(sym,env)=>new env.fn.object_literal(sym[1]),(sym,env)=>new env.fn.object_literal(null),(sym,env)=>new env.fn.array_literal(sym[1]),(sym,env)=>new env.fn.array_literal(null),sym=>[sym[1]],sym=>(((sym[0].push(sym[2]),sym[0]))),()=>null,(sym,env)=>new env.fn.parenthasized(sym[1]),(sym,env)=>new env.fn.parenthasized(new env.fn.spread_element(sym.slice(1,3))),(sym,env)=>new env.fn.parenthasized(sym$2,new env.fn.spread_element(sym.slice(3,5))),sym=>sym[0] + sym[1] + sym[2],sym=>sym[0] + sym[1] + sym[2] + sym[3] + sym[4],sym=>sym[0] + sym[1] + sym[2] + sym[3],sym=>"e" + sym[1] + sym[2],sym=>"e" + sym[1],sym=>parseFloat(sym[0] + sym[1] + sym[2]),sym=>parseFloat(sym[0] + sym[1]),sym=>parseFloat(sym[0]),sym=>parseInt(sym[0] + sym[1]),sym=>parseInt(sym[0]),sym=>((sym[1].import_list = sym[0],sym[1])),(sym,env,lex)=>env.fn.element_selector(sym[1],sym[2],sym[4],env,lex),(sym,env,lex)=>env.fn.element_selector(sym[1],sym[2],sym[3],env,lex),(sym,env,lex)=>env.fn.element_selector(sym[1],null,sym[3],env,lex),(sym,env,lex)=>env.fn.element_selector(sym[1],null,sym[2],env,lex)],
	    /* State Action Functions */ sa : [e=>906,e=>754,e=>178,e=>74,e=>1042,e=>538,e=>986,e=>1122,e=>746,e=>186,e=>1130,e=>1114,e=>1154,e=>1162,e=>1170,e=>1082,e=>1186,e=>1194,e=>1202,e=>1218,e=>1210,e=>1178,e=>1226,e=>1234,e=>1306,e=>1314,e=>1290,e=>994,e=>1266,e=>602,e=>1050,e=>634,e=>1026,e=>530,e=>498,e=>506,e=>514,e=>546,e=>562,e=>570,e=>1002,e=>834,e=>826,e=>330,e=>818,e=>802,e=>810,e=>738,e=>970,e=>978,e=>946,e=>954,e=>922,e=>930,e=>522,e=>98,(a,b,c,e,f,g,p)=>p.rv(1,g[0],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(2059,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(714763,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(716811,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(6155,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(4107,1,a,b,c,e,f),e=>1386,e=>1346,e=>1394,e=>1402,e=>1410,e=>1418,e=>1426,e=>1434,e=>1442,e=>1450,e=>1458,e=>1466,e=>1474,e=>1482,e=>1490,e=>1498,e=>1506,e=>1514,e=>1522,(a,b,c,e,f,g,p)=>p.rn(718859,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(460811,g[134],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720907,g[163],1,0,a,b,c,e,f),e=>1530,(a,b,c,e,f,g,p)=>p.rv(237579,g[0],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(239627,g[33],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(241675,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(247819,b.fn.statements,1,0,a,b,c,e,f),e=>1554,(a,b,c,e,f,g,p)=>p.rv(245771,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(243723,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(249867,1,a,b,c,e,f),e=>1618,e=>1626,e=>1642,e=>1674,e=>1690,e=>1682,(a,b,c,e,f,g,p)=>p.rn(294923,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(296971,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(305163,1,a,b,c,e,f),e=>1730,(a,b,c,e,f,g,p)=>p.rnv(434187,b.fn.expression_list,1,0,a,b,c,e,f),e=>1738,(a,b,c,e,f,g,p)=>p.rv(432139,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(430091,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(544779,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(575499,1,a,b,c,e,f),e=>1746,e=>1850,e=>1778,e=>1786,e=>1794,e=>1802,e=>1810,e=>1818,e=>1826,e=>1834,e=>1842,e=>1858,e=>1866,e=>1762,e=>1770,(a,b,c,e,f,g,p)=>p.rn(548875,1,a,b,c,e,f),e=>1882,e=>1874,(a,b,c,e,f,g,p)=>p.rn(550923,1,a,b,c,e,f),e=>1890,(a,b,c,e,f,g,p)=>p.rn(552971,1,a,b,c,e,f),e=>1898,(a,b,c,e,f,g,p)=>p.rn(555019,1,a,b,c,e,f),e=>1906,(a,b,c,e,f,g,p)=>p.rn(557067,1,a,b,c,e,f),e=>1914,(a,b,c,e,f,g,p)=>p.rn(559115,1,a,b,c,e,f),e=>1922,e=>1930,e=>1938,e=>1946,(a,b,c,e,f,g,p)=>p.rn(561163,1,a,b,c,e,f),e=>1962,e=>1954,e=>1970,e=>1978,e=>1994,e=>1986,(a,b,c,e,f,g,p)=>p.rn(563211,1,a,b,c,e,f),e=>2002,e=>2010,e=>2018,(a,b,c,e,f,g,p)=>p.rn(565259,1,a,b,c,e,f),e=>2034,e=>2026,(a,b,c,e,f,g,p)=>p.rn(567307,1,a,b,c,e,f),e=>2058,e=>2042,e=>2050,(a,b,c,e,f,g,p)=>p.rn(569355,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(571403,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(573451,1,a,b,c,e,f),e=>2066,e=>2154,e=>2170,e=>2162,e=>2146,(a,b,c,e,f,g,p)=>p.rn(436235,1,a,b,c,e,f),e=>2282,e=>2266,e=>2250,(a,b,c,e,f,g,p)=>p.rn(438283,1,a,b,c,e,f),e=>2290,e=>2298,e=>2354,e=>2346,e=>2338,(a,b,c,e,f,g,p)=>p.rn(440331,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(460811,b.fn.this_literal,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(460811,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(397323,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(645131,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(643083,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(647179,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(649227,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(651275,b.fn.identifier,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(661515,g[0],1,0,a,b,c,e,f),e=>2418,e=>2410,e=>2434,e=>2442,e=>2426,e=>2402,e=>2394,(a,b,c,e,f,g,p)=>p.rn(653323,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(710667,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(610315,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(641035,b.fn.bool_literal,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(638987,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(636939,b.fn.null_literal,1,0,a,b,c,e,f),e=>2498,e=>2482,e=>2474,e=>2514,e=>2522,e=>2506,e=>2490,e=>2546,e=>2530,e=>2458,e=>2602,e=>2586,e=>2578,e=>2618,e=>2626,e=>2610,e=>2594,e=>2562,e=>2634,(a,b,c,e,f,g,p)=>p.rnv(630795,b.fn.numeric_literal,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(634891,g[0],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(632843,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700427,g[174],1,0,a,b,c,e,f),e=>2690,e=>2698,e=>2682,e=>2674,(a,b,c,e,f,g,p)=>p.rv(702475,g[176],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(704523,1,a,b,c,e,f),e=>2730,e=>2738,e=>2746,e=>2754,e=>2762,e=>2770,e=>2778,e=>2786,(a,b,c,e,f,g,p)=>p.rn(692235,1,a,b,c,e,f),e=>2810,e=>2818,(a,b,c,e,f,g,p)=>p.rn(684043,1,a,b,c,e,f),e=>2850,e=>2858,e=>2866,e=>2874,e=>2882,e=>2890,e=>2898,e=>2906,e=>2914,e=>2922,e=>2930,e=>2938,(a,b,c,e,f,g,p)=>p.rn(675851,1,a,b,c,e,f),e=>3002,e=>2962,e=>2994,e=>3010,e=>3042,e=>3050,e=>3026,(a,b,c,e,f,g,p)=>p.rn(497675,1,a,b,c,e,f),e=>3162,e=>3170,e=>3178,e=>3106,e=>3146,e=>3154,e=>3130,e=>3138,e=>3114,e=>3098,e=>3122,e=>3066,e=>3074,e=>3194,e=>3186,e=>3210,e=>3226,e=>3242,e=>3234,(a,b,c,e,f,g,p)=>p.rn(444427,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(448523,1,a,b,c,e,f),e=>3266,(a,b,c,e,f,g,p)=>p.rv(397323,g[99],1,0,a,b,c,e,f),e=>3282,e=>3354,e=>3346,(a,b,c,e,f,g,p)=>p.rnv(309259,b.fn.empty_statement,1,0,a,b,c,e,f),e=>3362,(a,b,c,e,f,g,p)=>p.rn(303115,1,a,b,c,e,f),e=>3378,(a,b,c,e,f,g,p)=>p.s(3386,g[52],a,b,c,e,f),e=>3394,e=>3402,e=>3418,e=>3442,e=>3458,e=>3466,e=>3490,(a,b,c,e,f,g,p)=>p.rn(299019,1,a,b,c,e,f),e=>3530,e=>3522,(a,b,c,e,f,g,p)=>p.rn(301067,1,a,b,c,e,f),e=>3546,(a,b,c,e,f,g,p)=>p.rv(370699,g[89],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(370699,g[90],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(716819,g[177],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(6163,g[1],2,0,a,b,c,e,f),e=>3602,e=>3594,e=>3626,e=>3634,e=>3658,e=>3666,e=>3682,e=>3690,(a,b,c,e,f,g,p)=>p.rn(745483,1,a,b,c,e,f),e=>3722,e=>3754,e=>3762,(a,b,c,e,f,g,p)=>p.rv(755723,g[0],1,0,a,b,c,e,f),e=>3746,e=>3738,e=>3730,(a,b,c,e,f,g,p)=>p.rn(747531,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(729099,1,a,b,c,e,f),e=>3842,e=>3794,e=>3802,e=>3826,e=>3834,e=>3818,e=>3810,e=>3850,(a,b,c,e,f,g,p)=>p.rv(245779,g[1],2,0,a,b,c,e,f),e=>3866,e=>3874,e=>3882,(a,b,c,e,f,g,p)=>p.rn(253963,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(256011,b.fn.default_import,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(272395,1,a,b,c,e,f),e=>3890,e=>3906,e=>3914,(a,b,c,e,f,g,p)=>p.rn(270347,1,a,b,c,e,f),e=>3970,(a,b,c,e,f,g,p)=>p.rv(274451,g[45],2,0,a,b,c,e,f),e=>4010,e=>4018,e=>4050,(a,b,c,e,f,g,p)=>p.rnv(292875,b.fn.statements,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(290827,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(288779,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(311315,b.fn.expression_statement,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(575507,b.fn.post_increment_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(575507,b.fn.post_decrement_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(546827,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.delete_expression,2,0,a,b,c,e,f),e=>4298,e=>4434,e=>4442,e=>4386,e=>4394,e=>4346,e=>4306,e=>4458,e=>4474,e=>4498,(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.void_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.typeof_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.plus_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.negate_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(702483,g[175],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.unary_or_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(573459,b.fn.unary_not_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(575507,b.fn.pre_increment_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(575507,b.fn.pre_decrement_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(448531,b.fn.call_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(448531,g[130],2,0,a,b,c,e,f),e=>4546,e=>4538,e=>4578,(a,b,c,e,f,g,p)=>p.rv(440339,g[126],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(407571,b.fn.call_expression,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(438291,g[123],2,0,a,b,c,e,f),e=>4610,(a,b,c,e,f,g,p)=>p.rv(661523,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(661523,g[0],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(657419,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(655371,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(712715,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(659467,1,a,b,c,e,f),e=>4642,(a,b,c,e,f,g,p)=>p.rnv(620563,b.fn.string_literal,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(614411,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(612363,1,a,b,c,e,f),e=>4666,e=>4674,e=>4698,e=>4706,e=>4714,e=>4722,e=>4746,e=>4754,e=>4762,e=>4770,e=>4778,e=>4786,e=>4794,e=>4802,e=>4810,e=>4818,e=>4730,e=>4738,e=>4682,e=>4690,e=>4842,(a,b,c,e,f,g,p)=>p.rv(618507,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(616459,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700435,g[173],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700435,g[174],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(694283,g[0],1,0,a,b,c,e,f),e=>4914,e=>4906,(a,b,c,e,f,g,p)=>p.rn(669707,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(702483,g[176],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(690195,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(688139,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(686091,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(682003,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(679947,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(677899,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(671763,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(667659,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(673803,1,a,b,c,e,f),e=>4986,e=>4978,e=>5018,e=>4994,(a,b,c,e,f,g,p)=>p.rv(536595,g[160],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(538635,g[28],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(540683,1,a,b,c,e,f),e=>5042,e=>5050,(a,b,c,e,f,g,p)=>p.rnv(606227,b.fn.reg_ex_literal,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(604171,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(602123,1,a,b,c,e,f),e=>5082,e=>5090,e=>5098,(a,b,c,e,f,g,p)=>p.rv(499731,g[147],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(507923,g[152],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(518155,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(516107,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(514059,1,a,b,c,e,f),e=>5138,(a,b,c,e,f,g,p)=>p.rv(577555,g[163],2,0,a,b,c,e,f),e=>5154,e=>5162,(a,b,c,e,f,g,p)=>p.rv(450579,g[131],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(471059,b.fn.await_expression,2,0,a,b,c,e,f),e=>5218,(a,b,c,e,f,g,p)=>p.rnv(346131,b.fn.label_statement,2,0,a,b,c,e,f),e=>5258,e=>5250,(a,b,c,e,f,g,p)=>p.rv(364555,g[28],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(366603,b.fn.binding,1,0,a,b,c,e,f),e=>5274,(a,b,c,e,f,g,p)=>p.rn(579595,1,a,b,c,e,f),e=>5314,e=>5290,e=>5354,e=>5386,e=>5434,e=>5474,e=>5490,e=>5522,e=>5538,(a,b,c,e,f,g,p)=>p.rv(325651,g[69],2,0,a,b,c,e,f),e=>5546,(a,b,c,e,f,g,p)=>p.rv(327699,g[71],2,0,a,b,c,e,f),e=>5554,(a,b,c,e,f,g,p)=>p.rv(329747,g[73],2,0,a,b,c,e,f),e=>5570,e=>5594,e=>5602,(a,b,c,e,f,g,p)=>p.rnv(360467,b.fn.debugger_statement,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(409619,g[104],2,0,a,b,c,e,f),e=>5618,e=>5674,e=>5666,e=>5634,e=>5706,e=>5722,e=>5778,e=>5770,(a,b,c,e,f,g,p)=>p.rv(372747,g[28],1,0,a,b,c,e,f),e=>5810,e=>5802,e=>5826,e=>5842,(a,b,c,e,f,g,p)=>p.rv(10267,g[4],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(737291,g[28],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(739339,b.fn.attribute,1,0,a,b,c,e,f),e=>5850,e=>5866,e=>5882,(a,b,c,e,f,g,p)=>p.rn(741387,1,a,b,c,e,f),e=>5890,e=>5898,e=>5914,e=>5938,e=>6002,e=>5994,e=>6018,e=>6026,e=>6034,(a,b,c,e,f,g,p)=>p.rv(720923,g[4],3,0,a,b,c,e,f),e=>6042,e=>6050,(a,b,c,e,f,g,p)=>p.rv(755731,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(755731,g[0],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(751627,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(749579,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(753675,1,a,b,c,e,f),e=>6074,(a,b,c,e,f,g,p)=>p.rv(725003,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(722955,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(761867,1,a,b,c,e,f),e=>6090,(a,b,c,e,f,g,p)=>p.rv(251931,g[36],3,0,a,b,c,e,f),e=>6130,e=>6138,e=>6146,(a,b,c,e,f,g,p)=>p.rv(264211,g[39],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(262155,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(260107,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(268299,g[41],1,0,a,b,c,e,f),e=>6154,e=>6162,e=>6170,(a,b,c,e,f,g,p)=>p.rv(274459,g[45],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(274459,g[46],3,0,a,b,c,e,f),e=>6178,e=>6186,e=>6194,(a,b,c,e,f,g,p)=>p.rv(280595,g[48],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(278539,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(276491,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(282635,g[49],1,0,a,b,c,e,f),e=>6202,(a,b,c,e,f,g,p)=>p.rnv(307227,b.fn.block_statement,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(290835,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(432155,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(544795,b.fn.assignment_expression,3,0,a,b,c,e,f),e=>6210,(a,b,c,e,f,g,p)=>p.rnv(550939,b.fn.or_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(552987,b.fn.and_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(555035,b.fn.bit_or_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(557083,b.fn.bit_xor_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(559131,b.fn.bit_and_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(561179,b.fn.equality_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(563227,b.fn.equality_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(563227,b.fn.instanceof_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(563227,b.fn.in_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(565275,b.fn.left_shift_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(565275,b.fn.right_shift_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(565275,b.fn.right_shift_fill_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(567323,b.fn.add_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(567323,b.fn.subtract_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(569371,b.fn.multiply_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(569371,b.fn.divide_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(569371,b.fn.modulo_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(571419,b.fn.exponent_expression,3,0,a,b,c,e,f),e=>6218,e=>6226,e=>6234,(a,b,c,e,f,g,p)=>p.rv(522259,g[158],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(520203,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(524299,1,a,b,c,e,f),e=>6266,e=>6258,(a,b,c,e,f,g,p)=>p.rn(528395,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(423947,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(526347,1,a,b,c,e,f),e=>6314,e=>6322,e=>6338,(a,b,c,e,f,g,p)=>p.rn(495635,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(411667,g[104],2,0,a,b,c,e,f),e=>6354,(a,b,c,e,f,g,p)=>p.rv(702491,g[175],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(448539,g[125],3,0,a,b,c,e,f),e=>6362,e=>6378,e=>6370,e=>6386,(a,b,c,e,f,g,p)=>p.rv(452627,g[133],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(458763,1,a,b,c,e,f),e=>6394,(a,b,c,e,f,g,p)=>p.rv(456715,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(454667,1,a,b,c,e,f),e=>6410,(a,b,c,e,f,g,p)=>p.rv(440347,g[125],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(440347,g[127],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(446491,b.fn.new_target_expression,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(661531,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(657427,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(620571,b.fn.string_literal,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(614419,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(624659,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(622603,1,a,b,c,e,f),e=>6442,(a,b,c,e,f,g,p)=>p.rv(618515,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700443,g[172],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700443,g[173],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(694291,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(698387,g[171],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(696331,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(690203,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(688147,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(682011,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(679955,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(671771,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(667667,g[23],2,0,a,b,c,e,f),e=>6466,(a,b,c,e,f,g,p)=>p.rv(536603,g[159],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(536603,g[160],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(538643,g[161],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(540691,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(542739,b.fn.spread_element,2,0,a,b,c,e,f),e=>6498,e=>6514,(a,b,c,e,f,g,p)=>p.rnv(606235,b.fn.reg_ex_literal,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(604179,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(608267,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(602131,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(499739,g[146],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(507931,g[151],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(516115,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(501787,g[148],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(503819,g[28],1,0,a,b,c,e,f),e=>6554,e=>6562,(a,b,c,e,f,g,p)=>p.rv(577563,g[164],3,0,a,b,c,e,f),e=>6578,e=>6586,e=>6594,e=>6602,(a,b,c,e,f,g,p)=>p.rv(442395,g[128],3,0,a,b,c,e,f),e=>6610,(a,b,c,e,f,g,p)=>p.rv(395291,g[102],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(399371,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(348179,g[40],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(350219,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(362523,b.fn.variable_statement,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(366611,b.fn.binding,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(581651,2,a,b,c,e,f),e=>6650,e=>6666,e=>6658,(a,b,c,e,f,g,p)=>p.rn(587787,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(593931,1,a,b,c,e,f),e=>6682,(a,b,c,e,f,g,p)=>p.rn(598027,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(583699,2,a,b,c,e,f),e=>6706,e=>6722,e=>6738,e=>6730,(a,b,c,e,f,g,p)=>p.rn(589835,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(591883,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(595979,1,a,b,c,e,f),e=>6770,e=>6778,e=>6786,e=>6794,e=>6810,e=>6818,e=>6826,e=>6842,(a,b,c,e,f,g,p)=>p.rn(315403,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(317451,1,a,b,c,e,f),e=>20,e=>6922,e=>6938,(a,b,c,e,f,g,p)=>p.rv(325659,g[68],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(327707,g[70],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(329755,g[72],3,0,a,b,c,e,f),e=>6946,(a,b,c,e,f,g,p)=>p.rv(331803,g[74],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(352283,g[85],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(352283,g[86],3,0,a,b,c,e,f),e=>6962,(a,b,c,e,f,g,p)=>p.rv(409627,g[103],3,0,a,b,c,e,f),e=>6986,e=>6994,(a,b,c,e,f,g,p)=>p.rv(413715,g[108],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(417803,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(419851,g[28],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(421899,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(415763,g[40],2,0,a,b,c,e,f),e=>7026,e=>7034,e=>7042,(a,b,c,e,f,g,p)=>p.rv(382987,g[99],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(382987,g[100],1,0,a,b,c,e,f),e=>7050,(a,b,c,e,f,g,p)=>p.rn(387083,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(385035,g[28],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(389131,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(368667,b.fn.lexical,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(374803,b.fn.binding,2,0,a,b,c,e,f),e=>7066,(a,b,c,e,f,g,p)=>p.rv(10275,g[3],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(737299,g[29],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(10275,g[4],4,0,a,b,c,e,f),e=>7090,e=>7138,e=>7146,e=>7114,e=>7154,(a,b,c,e,f,g,p)=>p.rv(741395,g[163],2,0,a,b,c,e,f),e=>7162,e=>7178,e=>7186,e=>7194,(a,b,c,e,f,g,p)=>p.rn(733195,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(731147,g[2],1,0,a,b,c,e,f),e=>7218,e=>7226,e=>7234,(a,b,c,e,f,g,p)=>p.rn(735243,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(759819,b.fn.text,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(12299,1,a,b,c,e,f),e=>7250,(a,b,c,e,f,g,p)=>p.s(7258,g[6],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(757771,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720931,g[4],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720931,g[3],4,0,a,b,c,e,f),e=>7266,e=>7274,(a,b,c,e,f,g,p)=>p.rv(755739,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(751635,g[23],2,0,a,b,c,e,f),e=>7290,(a,b,c,e,f,g,p)=>p.rv(725011,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(251939,g[35],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(266259,g[40],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(253979,g[37],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(258075,b.fn.name_space_import,3,0,a,b,c,e,f),e=>7298,(a,b,c,e,f,g,p)=>p.rv(264219,g[38],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(264219,g[39],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(274467,g[43],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(274467,g[44],4,0,a,b,c,e,f),e=>7322,(a,b,c,e,f,g,p)=>p.rv(280603,g[47],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(280603,g[48],3,0,a,b,c,e,f),e=>7354,(a,b,c,e,f,g,p)=>p.rv(522267,g[157],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(522267,g[158],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(532499,b.fn.binding,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(524307,b.fn.spread_element,2,0,a,b,c,e,f),e=>7386,e=>7402,e=>7410,e=>7418,(a,b,c,e,f,g,p)=>p.rn(491539,2,a,b,c,e,f),e=>7426,e=>7442,e=>7450,e=>7458,(a,b,c,e,f,g,p)=>p.rv(411675,g[103],3,0,a,b,c,e,f),e=>7474,(a,b,c,e,f,g,p)=>p.rv(448547,g[124],4,0,a,b,c,e,f),e=>7482,(a,b,c,e,f,g,p)=>p.rv(452635,g[132],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(452635,g[133],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(454675,b.fn.spread_element,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(440355,g[124],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(700451,g[172],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(698395,g[170],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(536611,g[159],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(538651,g[162],3,0,a,b,c,e,f),e=>7538,e=>7546,e=>7554,(a,b,c,e,f,g,p)=>p.rnv(606243,b.fn.reg_ex_literal,4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(503827,g[29],2,0,a,b,c,e,f),e=>7570,e=>7578,(a,b,c,e,f,g,p)=>p.rv(512019,g[156],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(509971,g[154],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(505875,g[149],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(577571,g[164],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(577571,g[165],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(442403,g[129],4,0,a,b,c,e,f),e=>7602,(a,b,c,e,f,g,p)=>p.rn(393227,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(364571,g[88],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(534547,g[40],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(581659,3,a,b,c,e,f),e=>7618,(a,b,c,e,f,g,p)=>p.rn(585747,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(598035,2,a,b,c,e,f),e=>7642,(a,b,c,e,f,g,p)=>p.rn(583707,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(591891,2,a,b,c,e,f),e=>7650,(a,b,c,e,f,g,p)=>p.rn(600083,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(595987,2,a,b,c,e,f),e=>7714,e=>7722,(a,b,c,e,f,g,p)=>p.s(7738,g[53],a,b,c,e,f),e=>7762,(a,b,c,e,f,g,p)=>p.s(7778,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(315411,b.fn.variable_statement,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(317459,g[40],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(323595,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(321555,b.fn.lexical_expression,2,0,a,b,c,e,f),e=>7786,e=>7818,(a,b,c,e,f,g,p)=>p.rv(352291,g[87],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(356371,b.fn.finally_statement,2,0,a,b,c,e,f),e=>7858,(a,b,c,e,f,g,p)=>p.rv(413723,g[107],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(413723,g[106],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(419859,g[109],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(421907,g[110],2,0,a,b,c,e,f),e=>7866,e=>7874,e=>7882,e=>7898,(a,b,c,e,f,g,p)=>p.rv(382995,g[100],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(372763,g[88],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(10283,g[3],5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(10283,g[4],5,0,a,b,c,e,f),e=>7938,(a,b,c,e,f,g,p)=>p.rnv(739355,b.fn.attribute,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(743435,1,a,b,c,e,f),e=>7986,e=>7994,e=>8034,e=>8026,e=>8018,e=>8010,e=>8002,(a,b,c,e,f,g,p)=>p.rv(741403,g[40],3,0,a,b,c,e,f),e=>8050,(a,b,c,e,f,g,p)=>p.rv(720939,g[3],5,0,a,b,c,e,f),e=>8074,(a,b,c,e,f,g,p)=>p.rv(731155,g[1],2,0,a,b,c,e,f),e=>8090,e=>8106,e=>8122,(a,b,c,e,f,g,p)=>p.rv(757779,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8130,g[6],a,b,c,e,f),e=>8146,e=>8162,(a,b,c,e,f,g,p)=>p.rv(727083,g[163],5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(264227,g[38],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(262171,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(268315,g[42],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(280611,g[47],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(278555,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(282651,g[50],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(548907,b.fn.condition_expression,5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(522275,g[157],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(520219,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(524315,b.fn.property_binding,3,0,a,b,c,e,f),e=>8170,e=>8178,(a,b,c,e,f,g,p)=>p.rn(380939,1,a,b,c,e,f),e=>8186,(a,b,c,e,f,g,p)=>p.rv(530459,g[40],3,0,a,b,c,e,f),e=>8218,e=>8226,e=>8234,e=>8242,e=>8258,e=>8266,e=>8274,(a,b,c,e,f,g,p)=>p.rv(452643,g[132],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(456731,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(626715,g[167],3,0,a,b,c,e,f),e=>8290,(a,b,c,e,f,g,p)=>p.rv(538659,g[162],4,0,a,b,c,e,f),e=>8298,e=>8306,e=>8314,e=>8330,(a,b,c,e,f,g,p)=>p.rv(505883,g[150],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(512027,g[155],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(509979,g[153],3,0,a,b,c,e,f),e=>8346,e=>8354,(a,b,c,e,f,g,p)=>p.rv(399387,g[40],3,0,a,b,c,e,f),e=>8362,(a,b,c,e,f,g,p)=>p.rn(581667,4,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(587803,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(593947,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(583715,4,a,b,c,e,f),e=>8370,e=>8386,(a,b,c,e,f,g,p)=>p.rn(589851,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(313387,b.fn.if_statement,5,0,a,b,c,e,f),e=>8394,e=>8402,(a,b,c,e,f,g,p)=>p.rnv(319531,b.fn.while_statement,5,0,a,b,c,e,f),e=>8410,(a,b,c,e,f,g,p)=>p.s(8426,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8442,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8450,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8466,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8474,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8490,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(8498,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(335915,g[76],5,0,a,b,c,e,f),e=>8562,e=>8554,e=>8522,(a,b,c,e,f,g,p)=>p.rv(333867,g[75],5,0,a,b,c,e,f),e=>8570,(a,b,c,e,f,g,p)=>p.rn(358411,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(413731,g[105],4,0,a,b,c,e,f),e=>8578,e=>8594,e=>8610,e=>8618,(a,b,c,e,f,g,p)=>p.rv(378923,g[98],5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(391179,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(383003,g[101],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(385051,g[88],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(10291,g[3],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(8219,3,a,b,c,e,f),e=>8626,e=>8634,(a,b,c,e,f,g,p)=>p.rn(770059,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(768011,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(765963,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(772107,1,a,b,c,e,f),e=>8650,e=>8666,e=>8674,(a,b,c,e,f,g,p)=>p.rv(720947,g[4],6,0,a,b,c,e,f),e=>8682,e=>8890,e=>8698,e=>8746,e=>8850,e=>8874,e=>8938,e=>8954,e=>8962,e=>8786,e=>8946,e=>9010,e=>9026,e=>9050,e=>9066,e=>9082,e=>9090,e=>9098,e=>9106,e=>9114,(a,b,c,e,f,g,p)=>p.rv(720947,g[181],6,0,a,b,c,e,f),e=>9122,e=>9138,e=>9146,e=>9154,(a,b,c,e,f,g,p)=>p.rn(428043,1,a,b,c,e,f),e=>9162,e=>9170,e=>9178,e=>9194,e=>9210,e=>9218,(a,b,c,e,f,g,p)=>p.rv(376875,g[98],5,0,a,b,c,e,f),e=>9226,e=>9242,(a,b,c,e,f,g,p)=>p.rv(628771,g[169],4,0,a,b,c,e,f),e=>9258,e=>9274,e=>9290,e=>9298,(a,b,c,e,f,g,p)=>p.rv(462899,g[142],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(469003,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(577587,g[166],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(581675,5,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(583723,5,a,b,c,e,f),e=>9306,e=>9322,(a,b,c,e,f,g,p)=>p.s(9338,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(9346,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(9362,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319539,g[66],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(9402,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319539,g[67],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(9426,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(337939,g[77],2,0,a,b,c,e,f),e=>9442,e=>9466,(a,b,c,e,f,g,p)=>p.rv(339979,g[28],1,0,a,b,c,e,f),e=>9482,e=>9506,e=>9514,(a,b,c,e,f,g,p)=>p.rv(378931,g[97],6,0,a,b,c,e,f),e=>9522,(a,b,c,e,f,g,p)=>p.rv(378931,g[96],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(378931,g[95],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(743451,g[40],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(763931,g[40],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(768019,g[23],2,0,a,b,c,e,f),e=>9530,(a,b,c,e,f,g,p)=>p.rv(720955,g[3],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720955,g[180],7,0,a,b,c,e,f),e=>9546,e=>9554,e=>9562,(a,b,c,e,f,g,p)=>p.rnv(18443,b.fn.stylesheet,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(28683,g[16],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(28683,g[15],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(22539,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(20491,1,a,b,c,e,f),e=>9602,e=>9610,e=>9634,e=>9626,e=>9618,(a,b,c,e,f,g,p)=>p.rv(26635,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(24587,1,a,b,c,e,f),e=>9650,e=>9642,(a,b,c,e,f,g,p)=>p.rv(30731,g[2],1,0,a,b,c,e,f),e=>9738,(a,b,c,e,f,g,p)=>p.rnv(165899,b.fn.selector,1,0,a,b,c,e,f),e=>9754,e=>9762,e=>9746,(a,b,c,e,f,g,p)=>p.rnv(176139,b.fn.compoundSelector,1,0,a,b,c,e,f),e=>9810,(a,b,c,e,f,g,p)=>p.rnv(180235,b.fn.typeselector,1,0,a,b,c,e,f),e=>9818,(a,b,c,e,f,g,p)=>p.rv(180235,g[26],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(182283,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(186379,g[28],1,0,a,b,c,e,f),e=>9834,(a,b,c,e,f,g,p)=>p.rn(184331,1,a,b,c,e,f),e=>9866,e=>9890,e=>9898,(a,b,c,e,f,g,p)=>p.rv(235531,g[0],1,0,a,b,c,e,f),e=>9882,e=>9874,(a,b,c,e,f,g,p)=>p.rn(227339,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(167947,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(188427,1,a,b,c,e,f),e=>9938,e=>9962,(a,b,c,e,f,g,p)=>p.rv(174091,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(172043,1,a,b,c,e,f),e=>9986,e=>9994,e=>10002,e=>10018,e=>10026,e=>10034,(a,b,c,e,f,g,p)=>p.rnv(284683,b.fn.script,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(286731,1,a,b,c,e,f),e=>10050,e=>10058,e=>10066,e=>10074,e=>10082,e=>10090,e=>10098,e=>10106,e=>10122,(a,b,c,e,f,g,p)=>p.rv(14371,g[9],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720955,g[179],7,0,a,b,c,e,f),e=>10138,e=>10146,(a,b,c,e,f,g,p)=>p.rv(423979,g[118],5,0,a,b,c,e,f),e=>10162,e=>10170,e=>10178,e=>10194,e=>10210,e=>10218,(a,b,c,e,f,g,p)=>p.rv(376883,g[97],6,0,a,b,c,e,f),e=>10226,(a,b,c,e,f,g,p)=>p.rv(376883,g[96],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(376883,g[95],6,0,a,b,c,e,f),e=>10242,e=>10250,(a,b,c,e,f,g,p)=>p.rv(464947,g[145],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(628779,g[168],5,0,a,b,c,e,f),e=>10266,e=>10274,(a,b,c,e,f,g,p)=>p.rv(462907,g[141],7,0,a,b,c,e,f),e=>10282,(a,b,c,e,f,g,p)=>p.rv(462907,g[140],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(462907,g[139],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(583731,6,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(313403,b.fn.if_statement,7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(319547,b.fn.do_while_statement,7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.s(10290,g[53],a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[65],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[61],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[60],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[55],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[62],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[64],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319547,g[63],7,0,a,b,c,e,f),e=>10346,(a,b,c,e,f,g,p)=>p.rv(337947,g[40],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(339987,g[80],2,0,a,b,c,e,f),e=>10354,e=>10362,(a,b,c,e,f,g,p)=>p.rv(344083,g[84],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(354347,b.fn.catch_statement,5,0,a,b,c,e,f),e=>10378,(a,b,c,e,f,g,p)=>p.rv(378939,g[94],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(378939,g[93],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(378939,g[92],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(720963,g[178],8,0,a,b,c,e,f),e=>10386,e=>10394,e=>10402,e=>10410,(a,b,c,e,f,g,p)=>p.rv(28691,g[14],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(22547,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(26643,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(38931,2,a,b,c,e,f),e=>10434,e=>10474,e=>10466,e=>10458,e=>10570,e=>10562,e=>10602,e=>10618,e=>10698,e=>10658,e=>10642,e=>10730,e=>10738,(a,b,c,e,f,g,p)=>p.rv(215051,g[0],1,0,a,b,c,e,f),e=>10762,(a,b,c,e,f,g,p)=>p.rv(213003,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(208907,1,a,b,c,e,f),e=>10770,(a,b,c,e,f,g,p)=>p.rnv(165907,b.fn.selector,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(163851,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(161803,b.fn.comboSelector,1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(178187,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(176147,b.fn.compoundSelector,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(167955,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(174099,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(180243,g[25],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(186387,g[27],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(184339,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(235539,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(235539,g[0],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(231435,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(229387,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(233483,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(190483,b.fn.idSelector,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(192531,b.fn.classSelector,2,0,a,b,c,e,f),e=>10866,e=>10834,e=>10818,e=>10842,e=>10850,e=>10858,(a,b,c,e,f,g,p)=>p.rnv(204819,b.fn.pseudoClassSelector,2,0,a,b,c,e,f),e=>10882,(a,b,c,e,f,g,p)=>p.rnv(206867,b.fn.pseudoElementSelector,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(172051,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(169995,g[2],1,0,a,b,c,e,f),e=>10898,e=>10906,e=>10914,e=>10922,e=>10930,e=>10938,e=>10946,e=>10954,e=>10962,e=>10970,e=>10986,(a,b,c,e,f,g,p)=>p.rv(14379,g[8],5,0,a,b,c,e,f),e=>11002,(a,b,c,e,f,g,p)=>p.rv(14379,g[7],5,0,a,b,c,e,f),e=>11010,e=>11018,e=>11026,(a,b,c,e,f,g,p)=>p.rv(423987,g[115],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(423987,g[114],6,0,a,b,c,e,f),e=>11034,(a,b,c,e,f,g,p)=>p.rv(423987,g[116],6,0,a,b,c,e,f),e=>11050,e=>11066,e=>11074,(a,b,c,e,f,g,p)=>p.rv(426035,g[122],6,0,a,b,c,e,f),e=>11082,(a,b,c,e,f,g,p)=>p.rv(376891,g[94],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(376891,g[93],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(376891,g[92],7,0,a,b,c,e,f),e=>11090,(a,b,c,e,f,g,p)=>p.rv(464955,g[144],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(464955,g[143],7,0,a,b,c,e,f),e=>11098,(a,b,c,e,f,g,p)=>p.rv(462915,g[138],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(462915,g[137],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(462915,g[136],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319555,g[59],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319555,g[58],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319555,g[54],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319555,g[57],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319555,g[56],8,0,a,b,c,e,f),e=>11114,(a,b,c,e,f,g,p)=>p.rv(337955,g[79],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(342043,g[82],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(344091,g[83],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(378947,g[91],8,0,a,b,c,e,f),e=>11130,e=>11138,e=>11146,(a,b,c,e,f,g,p)=>p.rv(735283,g[4],6,0,a,b,c,e,f),e=>11162,(a,b,c,e,f,g,p)=>p.rn(51227,3,a,b,c,e,f),e=>11186,(a,b,c,e,f,g,p)=>p.rv(157707,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(43019,1,a,b,c,e,f),e=>11210,e=>11226,e=>11218,(a,b,c,e,f,g,p)=>p.rv(83979,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(92171,1,a,b,c,e,f),e=>11258,(a,b,c,e,f,g,p)=>p.rn(96267,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(94219,1,a,b,c,e,f),e=>11290,e=>11306,e=>11394,e=>11346,(a,b,c,e,f,g,p)=>p.rn(112651,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(143371,1,a,b,c,e,f),e=>11418,(a,b,c,e,f,g,p)=>p.rn(88075,1,a,b,c,e,f),e=>11426,(a,b,c,e,f,g,p)=>p.rn(57355,1,a,b,c,e,f),e=>11434,(a,b,c,e,f,g,p)=>p.rn(73739,1,a,b,c,e,f),e=>11474,e=>11482,(a,b,c,e,f,g,p)=>p.rn(75787,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(77835,1,a,b,c,e,f),e=>11514,e=>11522,e=>11530,(a,b,c,e,f,g,p)=>p.rv(30747,g[18],3,0,a,b,c,e,f),e=>11538,(a,b,c,e,f,g,p)=>p.rv(32795,g[20],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(215059,g[29],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(215059,g[30],2,0,a,b,c,e,f),e=>11546,(a,b,c,e,f,g,p)=>p.rv(215059,g[0],2,0,a,b,c,e,f),e=>11610,e=>11594,e=>11602,e=>11578,(a,b,c,e,f,g,p)=>p.rv(163859,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(161811,b.fn.comboSelector,2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(176155,b.fn.compoundSelector,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(235547,g[23],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(231443,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(196635,b.fn.attribSelector,3,0,a,b,c,e,f),e=>11634,e=>11642,(a,b,c,e,f,g,p)=>p.rn(198667,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(204827,b.fn.pseudoClassSelector,3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(170003,g[1],2,0,a,b,c,e,f),e=>11658,e=>11666,e=>11674,e=>11682,e=>11690,e=>11698,e=>11714,(a,b,c,e,f,g,p)=>p.rv(14387,g[5],6,0,a,b,c,e,f),e=>11722,e=>11730,e=>11738,e=>11746,e=>11754,(a,b,c,e,f,g,p)=>p.rv(16435,g[9],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(423995,g[111],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(423995,g[112],7,0,a,b,c,e,f),e=>11762,(a,b,c,e,f,g,p)=>p.rv(423995,g[117],7,0,a,b,c,e,f),e=>11770,(a,b,c,e,f,g,p)=>p.rv(426043,g[121],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(426043,g[120],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(376899,g[91],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(464963,g[135],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(462923,g[135],9,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(319563,g[51],9,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(337963,g[78],5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(342051,g[81],4,0,a,b,c,e,f),e=>11778,(a,b,c,e,f,g,p)=>p.rv(735291,g[3],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(735291,g[180],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(51235,4,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(157715,g[23],2,0,a,b,c,e,f),e=>11810,e=>11818,e=>11826,(a,b,c,e,f,g,p)=>(p.rn(36867,0,a,b,c,e,f)),(a,b,c,e,f,g,p)=>p.rn(92179,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(104467,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(110611,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(102411,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(108555,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(98323,2,a,b,c,e,f),e=>11930,e=>11938,e=>11978,e=>11970,(a,b,c,e,f,g,p)=>p.rn(141323,1,a,b,c,e,f),e=>11954,(a,b,c,e,f,g,p)=>p.rn(114699,1,a,b,c,e,f),e=>12042,e=>12026,e=>12034,e=>12050,e=>12018,e=>11986,(a,b,c,e,f,g,p)=>p.rn(137227,1,a,b,c,e,f),e=>12098,e=>12106,e=>12114,e=>12090,e=>12130,e=>12194,e=>12170,e=>12178,(a,b,c,e,f,g,p)=>p.rn(73747,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(71691,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(67595,1,a,b,c,e,f),e=>12226,e=>12234,e=>12250,(a,b,c,e,f,g,p)=>p.rv(32803,g[19],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(32803,g[20],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(215067,g[30],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(213019,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(219163,b.fn.parseDeclaration,3,0,a,b,c,e,f),e=>12274,(a,b,c,e,f,g,p)=>p.rn(225291,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(223243,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(221195,1,a,b,c,e,f),e=>12306,e=>12314,e=>12322,(a,b,c,e,f,g,p)=>p.rn(194571,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(198675,2,a,b,c,e,f),e=>12330,e=>12338,e=>12346,e=>12354,e=>12362,e=>12370,(a,b,c,e,f,g,p)=>p.rv(16443,g[8],7,0,a,b,c,e,f),e=>12378,(a,b,c,e,f,g,p)=>p.rv(16443,g[7],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(16443,g[13],7,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(424003,g[113],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(426051,g[119],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(735299,g[178],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(51243,5,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(159771,3,a,b,c,e,f),e=>12426,e=>12434,(a,b,c,e,f,g,p)=>p.rn(36875,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(34827,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(83995,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(92187,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(90131,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(102419,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(108563,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(100371,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(106515,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(112667,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(116763,3,a,b,c,e,f),e=>12450,(a,b,c,e,f,g,p)=>p.rn(124955,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(122891,g[24],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(118795,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(133131,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(129035,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(131083,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(151571,2,a,b,c,e,f),e=>12522,(a,b,c,e,f,g,p)=>p.rn(149515,1,a,b,c,e,f),e=>12530,e=>12538,(a,b,c,e,f,g,p)=>p.rv(53259,g[2],1,0,a,b,c,e,f),e=>12562,e=>12554,(a,b,c,e,f,g,p)=>p.rv(59403,g[2],1,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(63499,1,a,b,c,e,f),e=>12570,e=>12578,(a,b,c,e,f,g,p)=>p.rv(71699,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(69651,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(75803,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(79899,3,a,b,c,e,f),e=>12586,(a,b,c,e,f,g,p)=>p.rv(32811,g[19],5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(219171,b.fn.parseDeclaration,4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(225299,g[31],2,0,a,b,c,e,f),e=>12594,(a,b,c,e,f,g,p)=>p.rv(223251,g[23],2,0,a,b,c,e,f),e=>12602,e=>12610,(a,b,c,e,f,g,p)=>p.rnv(196651,b.fn.attribSelector,5,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(200715,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(202779,3,a,b,c,e,f),e=>12618,(a,b,c,e,f,g,p)=>p.rv(16451,g[5],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(16451,g[12],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(16451,g[11],8,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(51251,6,a,b,c,e,f),e=>12626,(a,b,c,e,f,g,p)=>p.rn(45067,1,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(153635,4,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(86067,6,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(34835,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(124963,4,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(122899,g[23],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(127003,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(135195,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(145435,3,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(55347,g[21],6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(53267,g[1],2,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(147475,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(65587,6,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(81955,4,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(217107,2,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(225307,g[31],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(196659,b.fn.attribSelector,6,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rv(16459,g[10],9,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(47139,4,a,b,c,e,f),e=>12682,e=>12690,(a,b,c,e,f,g,p)=>p.rv(59419,g[18],3,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rn(135211,5,a,b,c,e,f),e=>12698,(a,b,c,e,f,g,p)=>p.rnv(61475,g[22],4,0,a,b,c,e,f),(a,b,c,e,f,g,p)=>p.rnv(61483,g[22],5,0,a,b,c,e,f)],
	    /* Get Token Function  */ gtk:function getToken(l, SYM_LU, IGNORE_KEYWORDS = false) {    if (l.END) return 0; /*$eof*/ switch (l.ty) {        case 2:            if (!IGNORE_KEYWORDS && SYM_LU.has(l.tx)) return 14;            return 2;        case 1:            if (!IGNORE_KEYWORDS && SYM_LU.has(l.tx)) return 14;            return 1;        case 4:            return 3;        case 256:            return 9;        case 8:            return 4;        case 512:            return 10;        default:            return SYM_LU.get(l.tx) || SYM_LU.get(l.ty);    }},
	}))((...d)=>fn.defaultError(...d),...([
	    [[-1,1,2,-1,0,-4,0,-6,3,-1,4,-2,5,-32,6,-7,7,-6,8,-4,9,-2,10,-2,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[57,-3,0,-4,0],[58,-3,0,-4,0],[59,-3,0,-4,0],[-4,0,-4,0,-8,4,-184,56],[60,-3,0,-4,0],[-4,0,-4,0,-8,61,-184,61],[-4,0,-4,0,-8,62,-184,62],[-2,63,-1,0,-4,0,-6,64,-171,65,-15,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81],[82,-3,0,-4,0,-7,83,83,-2,83,-2,83,-17,83,83,83,-1,83,-1,83,-6,83,-1,83,83,-3,83,-1,83,-1,83,-2,83,-46,83,-7,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,-4,83,83,-1,83,-45,83,83],[84,84,84,-1,84,84,84,84,84,0,-4,84,84,84,84,84,-2,84,84,-1,84,-17,84,84,84,-1,84,-1,84,-5,84,84,-1,84,84,-3,84,84,84,-1,84,-2,84,-1,84,-2,84,-2,84,-2,84,-1,84,84,84,84,84,84,84,84,84,84,84,84,-1,84,-2,84,84,84,84,-1,84,84,-4,84,84,-2,84,-2,84,-1,84,-5,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,-1,84,84,84,-20,84,84,84,84,84,-12,84,84,84,84,84,84,84,84,84],[-4,0,-4,0,-143,85],[86,-3,0,-4,0],[87,-3,0,-4,0],[88,-3,0,-4,0],[89,1,2,-1,0,-4,0,-6,3,-1,90,-2,5,-32,6,-7,7,-6,8,-4,9,-2,10,-2,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[91,91,91,-1,0,-4,0,-6,91,-1,91,-2,91,-32,91,-7,91,-6,91,-4,91,-2,91,-2,91,-1,91,91,91,91,91,-1,91,91,91,91,91,91,-1,91,-2,91,91,91,91,-1,91,91,-4,91,91,-2,91,-2,91,-29,91,-1,91,91,91,91,91,91,-1,91,91,91,-20,91,91,91,91,91,-12,91,91,91,91,91,91,-1,91,91],[92,92,92,-1,0,-4,0,-6,92,-1,92,-2,92,-32,92,-7,92,-6,92,-4,92,-2,92,-2,92,-1,92,92,92,92,92,-1,92,92,92,92,92,92,-1,92,-2,92,92,92,92,-1,92,92,-4,92,92,-2,92,-2,92,-29,92,-1,92,92,92,92,92,92,-1,92,92,92,-20,92,92,92,92,92,-12,92,92,92,92,92,92,-1,92,92],[93,93,93,-1,0,-4,0,-6,93,-1,93,-2,93,-32,93,-7,93,-6,93,-4,93,-2,93,-2,93,-1,93,93,93,93,93,-1,93,93,93,93,93,93,-1,93,-2,93,93,93,93,-1,93,93,-4,93,93,-2,93,-2,93,-29,93,-1,93,93,93,93,93,93,-1,93,93,93,-20,93,93,93,93,93,-12,93,93,93,93,93,93,-1,93,93],[-2,2,-1,0,-4,0,-47,94,-16,9,-81,42,43,-20,95,-3,48],[-4,0,-4,0,-47,96,-20,97,-3,12,-16,25,26,27,-1,98,29,-73,99],[100,100,100,-1,0,-4,0,-5,100,100,-1,100,-2,100,-32,100,-7,100,-6,100,-4,100,-2,100,100,-1,100,-1,100,100,100,100,100,-1,100,100,100,100,100,100,100,100,-2,100,100,100,100,-1,100,100,-4,100,100,-2,100,-2,100,-1,100,-27,100,-1,100,100,100,100,100,100,-1,100,100,100,-20,100,100,100,100,100,-12,100,100,100,100,100,100,-1,100,100],[101,101,101,-1,0,-4,0,-5,101,101,-1,101,-2,101,-32,101,-7,101,-6,101,-4,101,-2,101,101,-1,101,101,101,101,101,101,101,-1,101,101,101,101,101,101,101,101,-2,101,101,101,101,-1,101,101,-4,101,101,-2,101,-2,101,-1,101,-27,101,-1,101,101,101,101,101,101,-1,101,101,101,-20,101,101,101,101,101,-12,101,101,101,101,101,101,-1,101,101],[102,102,102,-1,0,-4,0,-5,102,102,-1,102,-2,102,-32,102,-7,102,-6,102,-4,102,-2,102,102,-1,102,102,102,102,102,102,102,-1,102,102,102,102,102,102,102,102,-2,102,102,102,102,-1,102,102,-4,102,102,-2,102,-2,102,-1,102,-27,102,-1,102,102,102,102,102,102,-1,102,102,102,-20,102,102,102,102,102,-12,102,102,102,102,102,102,-1,102,102],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-59,103],[-4,0,-4,0,-12,104,-1,105,-38,104,-5,104,-1,104,-46,104],[-4,0,-4,0,-12,106,-1,106,-38,106,-5,106,-1,106,-46,106],[-4,0,-4,0,-12,107,-1,107,-38,107,-5,107,-1,107,-46,107],[108,108,108,-1,0,-4,0,-6,108,-1,108,-2,108,108,-1,108,-29,108,-7,108,108,-5,108,-1,108,-2,108,-2,108,-2,108,-1,108,108,108,108,108,-1,108,108,108,108,108,108,-1,108,-2,108,108,108,108,-1,108,108,-4,108,108,-2,108,-2,108,-1,108,-27,108,-1,108,108,108,108,108,108,-1,108,108,108,-20,108,108,108,108,108,-12,108,108,108,108,108,108,-1,108,108],[109,109,109,-1,0,-4,0,-6,109,109,109,-2,109,109,-1,109,-17,109,109,110,-1,109,-1,109,-5,109,109,-1,109,109,-3,109,109,111,-1,112,-2,109,-1,109,-2,109,-2,109,-2,109,-1,109,109,109,109,109,-1,109,109,109,109,109,109,-1,109,-2,109,109,109,109,-1,109,109,-4,109,109,-2,109,-2,109,-1,109,-5,113,114,115,116,117,118,119,120,121,122,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,123,124,-1,109,109,109,-20,109,109,109,109,109,-12,109,109,109,109,109,109,-1,109,109],[125,125,125,-1,0,-4,0,-6,125,-1,125,-2,125,125,-1,125,-29,125,126,-6,125,125,-5,125,-1,125,-2,125,-2,125,-2,125,-1,125,125,125,125,125,-1,125,125,125,125,125,125,-1,125,-2,125,125,125,125,-1,125,125,-4,125,125,-2,125,-2,125,-1,125,-15,127,-11,125,-1,125,125,125,125,125,125,-1,125,125,125,-20,125,125,125,125,125,-12,125,125,125,125,125,125,-1,125,125],[128,128,128,-1,0,-4,0,-6,128,-1,128,-2,128,128,-1,128,-29,128,128,-6,128,128,-5,128,-1,128,-2,128,-2,128,-2,128,-1,128,128,128,128,128,-1,128,128,128,128,128,128,-1,128,-2,128,128,128,128,-1,128,128,-4,128,128,-2,128,-2,128,-1,128,-15,128,129,-10,128,-1,128,128,128,128,128,128,-1,128,128,128,-20,128,128,128,128,128,-12,128,128,128,128,128,128,-1,128,128],[130,130,130,-1,0,-4,0,-6,130,-1,130,-2,130,130,-1,130,-29,130,130,-2,131,-3,130,130,-5,130,-1,130,-2,130,-2,130,-2,130,-1,130,130,130,130,130,-1,130,130,130,130,130,130,-1,130,-2,130,130,130,130,-1,130,130,-4,130,130,-2,130,-2,130,-1,130,-15,130,130,-10,130,-1,130,130,130,130,130,130,-1,130,130,130,-20,130,130,130,130,130,-12,130,130,130,130,130,130,-1,130,130],[132,132,132,-1,0,-4,0,-6,132,-1,132,-2,132,132,-1,132,-29,132,132,-2,132,-3,132,132,-5,132,-1,132,-2,132,-2,132,-2,132,-1,132,132,132,132,132,-1,132,132,132,132,132,132,-1,132,-2,132,132,132,132,-1,132,132,-4,132,132,-2,132,-2,132,-1,132,-15,132,132,133,-9,132,-1,132,132,132,132,132,132,-1,132,132,132,-20,132,132,132,132,132,-12,132,132,132,132,132,132,-1,132,132],[134,134,134,-1,0,-4,0,-6,134,-1,134,-2,134,134,-1,134,-29,134,134,-2,134,-3,134,134,-5,134,-1,134,-2,134,-2,134,-2,134,-1,134,134,134,134,134,-1,134,134,134,134,134,134,-1,134,-2,134,134,134,134,-1,134,134,-4,134,134,-2,134,-2,134,-1,134,-15,134,134,134,135,-8,134,-1,134,134,134,134,134,134,-1,134,134,134,-20,134,134,134,134,134,-12,134,134,134,134,134,134,-1,134,134],[136,136,136,-1,0,-4,0,-6,136,-1,136,-2,136,136,-1,136,-29,136,136,-2,136,-3,136,136,-5,136,-1,136,-2,136,-2,136,-2,136,-1,136,136,136,136,136,-1,136,136,136,136,136,136,-1,136,-2,136,136,136,136,-1,136,136,-4,136,136,-2,136,-2,136,-1,136,-15,136,136,136,136,137,138,139,140,-4,136,-1,136,136,136,136,136,136,-1,136,136,136,-20,136,136,136,136,136,-12,136,136,136,136,136,136,-1,136,136],[141,141,141,-1,0,-4,0,-6,141,142,143,-2,141,141,-1,141,-17,144,145,-4,146,-5,141,141,-2,141,-3,141,141,-5,141,-1,141,-2,141,-2,141,-2,141,-1,141,141,141,141,141,-1,141,141,141,141,141,141,-1,141,-2,141,141,141,141,-1,141,141,-4,141,141,-2,141,-2,141,-1,141,-15,141,141,141,141,141,141,141,141,147,-3,141,-1,141,141,141,141,141,141,-1,141,141,141,-20,141,141,141,141,141,-12,141,141,141,141,141,141,-1,141,141],[148,148,148,-1,0,-4,0,-6,148,148,148,-2,148,148,-1,148,-17,148,148,-4,148,-5,148,148,-2,148,-3,148,148,-5,148,-1,148,-2,148,-2,148,-2,148,-1,148,148,148,148,148,-1,148,148,148,148,148,148,-1,148,-2,148,148,148,148,-1,148,148,-4,148,148,-2,148,-2,148,-1,148,-15,148,148,148,148,148,148,148,148,148,149,150,151,148,-1,148,148,148,148,148,148,-1,148,148,148,-20,148,148,148,148,148,-12,148,148,148,148,148,148,-1,148,148],[152,152,152,-1,0,-4,0,-6,152,152,152,-2,152,152,-1,152,-17,152,152,-4,152,-5,152,152,-2,152,-3,152,152,-5,152,-1,152,-2,152,-2,152,-2,152,-1,152,152,152,152,152,-1,152,152,152,152,152,152,-1,152,-2,152,152,152,152,-1,152,152,-4,152,152,-2,152,-2,152,-1,152,-15,152,152,152,152,152,152,152,152,152,152,152,152,153,-1,152,152,152,152,152,152,-1,152,152,152,-20,152,152,152,152,152,-12,152,152,152,152,152,152,-1,154,152],[155,155,155,-1,0,-4,0,-6,155,155,155,-2,155,155,-1,155,-17,155,155,-2,156,-1,155,-5,155,155,-1,157,155,-3,155,155,-5,155,-1,155,-2,155,-2,155,-2,155,-1,155,155,155,155,155,-1,155,155,155,155,155,155,-1,155,-2,155,155,155,155,-1,155,155,-4,155,155,-2,155,-2,155,-1,155,-15,155,155,155,155,155,155,155,155,155,155,155,155,155,-1,155,155,155,155,155,155,-1,158,155,155,-20,155,155,155,155,155,-12,155,155,155,155,155,155,-1,155,155],[159,159,159,-1,0,-4,0,-6,159,159,159,-2,159,159,-1,159,-17,159,159,-2,159,-1,159,-5,159,159,-1,159,159,-3,159,159,-5,159,-1,159,-2,159,-2,159,-2,159,-1,159,159,159,159,159,-1,159,159,159,159,159,159,-1,159,-2,159,159,159,159,-1,159,159,-4,159,159,-2,159,-2,159,-1,159,-15,159,159,159,159,159,159,159,159,159,159,159,159,159,-1,159,159,159,159,159,159,-1,159,159,159,-20,159,159,159,159,159,-12,159,159,159,159,159,159,-1,159,159],[160,160,160,-1,0,-4,0,-6,160,160,160,-2,160,160,-1,160,-17,160,160,-2,160,-1,160,-5,160,160,-1,160,160,-3,160,160,-5,160,-1,160,-2,160,-2,160,-2,160,-1,160,160,160,160,160,-1,160,160,160,160,160,160,-1,160,-2,160,160,160,160,-1,160,160,-4,160,160,-2,160,-2,160,-1,160,-15,160,160,160,160,160,160,160,160,160,160,160,160,160,-1,160,160,160,160,160,160,-1,160,160,160,-20,160,160,160,160,160,-12,160,160,160,160,160,160,-1,160,160],[161,161,161,-1,0,-4,0,-6,161,161,161,-2,161,161,-1,161,-17,161,161,-2,161,-1,161,-5,161,161,-1,161,161,-3,161,161,-5,161,-1,161,-2,161,-2,161,-2,161,-1,161,161,161,161,161,-1,161,161,161,161,161,161,-1,161,-2,161,161,161,161,-1,161,161,-4,161,161,-2,161,-2,161,-1,161,-15,161,161,161,161,161,161,161,161,161,161,161,161,161,162,161,161,161,161,161,161,-1,161,161,161,-20,161,161,161,161,161,-12,161,161,161,161,161,161,-1,161,161],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[161,161,161,-1,0,-4,0,-6,161,161,161,-2,161,161,-1,161,-17,161,161,-2,161,-1,161,-5,161,161,-1,161,161,-3,161,161,-5,161,-1,161,-2,161,-2,161,-2,161,-1,161,161,161,161,161,-1,161,161,161,161,161,161,-1,161,-2,161,161,161,161,-1,161,161,-4,161,161,-2,161,-2,161,-1,161,-15,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,-1,161,161,161,-20,161,161,161,161,161,-12,161,161,161,161,161,161,-1,161,161],[167,167,167,-1,0,-4,0,-6,167,167,167,-2,167,167,-1,167,-17,167,167,167,-1,167,-1,167,-5,167,167,-1,167,167,-3,167,167,167,-1,167,-2,167,-1,167,-2,167,-2,167,-2,167,-1,167,167,167,167,167,167,167,167,167,167,167,167,-1,167,-2,167,167,167,167,-1,167,167,-4,167,167,-2,167,-2,167,-1,167,-5,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,-1,167,167,167,-20,167,167,167,167,167,-12,167,167,167,167,167,167,-1,167,167],[167,167,167,-1,0,-4,0,-6,167,167,167,-2,168,167,-1,167,-17,167,167,167,-1,167,-1,167,-5,167,167,-1,167,167,-3,169,167,167,-1,167,-2,167,-1,167,-2,167,-2,167,-2,167,-1,167,167,167,167,167,167,167,167,167,167,167,167,-1,167,-2,167,167,167,167,-1,167,167,-4,167,167,-2,167,-2,33,-1,167,-5,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,167,-1,167,167,167,-20,167,167,167,167,167,-12,167,167,167,167,167,167,170,167,167],[171,171,171,-1,0,-4,0,-6,171,171,171,-2,168,171,-1,171,-17,171,171,171,-1,171,-1,171,-5,171,171,-1,171,171,-3,172,171,171,-1,171,-2,171,-1,171,-2,171,-2,171,-2,171,-1,171,171,171,171,171,171,171,171,171,171,171,171,-1,171,-2,171,171,171,171,-1,171,171,-4,171,171,-2,171,-2,33,-1,171,-5,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,-1,171,171,171,-20,171,171,171,171,171,-12,171,171,171,171,171,171,173,171,171],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-40,7,-11,9,-26,163,-1,164,165,-4,30,174,-2,32,-2,33,-29,175,-8,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,176,-1,56],[177,177,177,-1,0,-4,0,-6,177,177,177,-2,177,177,-1,177,-17,177,177,177,-1,177,-1,177,-5,177,177,-1,177,177,-3,177,177,177,-1,177,-2,177,-1,177,-2,177,-2,177,-2,177,-1,177,177,177,177,177,177,177,177,177,177,177,177,-1,177,-2,177,177,177,177,-1,177,177,-4,177,177,-2,177,-2,177,-1,177,-5,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,177,-1,177,177,177,-20,177,177,177,177,177,-12,177,177,177,177,177,177,177,177,177],[178,178,178,-1,0,-4,0,-6,178,178,178,-2,178,178,-1,178,-17,178,178,178,-1,178,-1,178,-5,178,178,-1,178,178,-3,178,178,178,-1,178,-2,178,-1,178,-2,178,-2,178,-2,178,-1,178,178,178,178,178,178,178,178,178,178,178,178,-1,178,-2,178,178,178,178,-1,178,178,-4,178,178,-2,178,-2,178,-1,178,-5,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,178,-1,178,178,178,-20,178,178,178,178,178,-12,178,178,178,178,178,178,178,178,178],[179,179,179,-1,0,-4,0,-6,179,179,179,-2,179,179,-1,179,-17,179,179,179,-1,179,-1,179,-5,179,179,-1,179,179,-3,179,179,179,-1,179,-2,179,-1,179,-2,179,-2,179,-2,179,-1,179,179,179,179,179,179,179,179,179,179,179,179,-1,179,-2,179,179,179,179,-1,179,179,-4,179,179,-2,179,-2,179,-1,179,-5,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,-1,179,179,179,-20,179,179,179,179,179,-12,179,179,179,179,179,179,179,179,179],[179,179,179,-1,0,-4,0,-6,179,179,179,-2,179,179,-1,179,-17,179,179,179,-1,179,-1,179,-5,179,179,-1,179,179,-3,179,179,179,-1,179,-2,179,-1,179,-2,179,-2,179,-2,179,-1,179,179,179,179,179,179,179,179,179,179,179,179,-1,179,-2,179,179,179,179,180,179,179,-4,179,179,-2,179,-2,179,-1,179,-5,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,179,-1,179,179,179,-20,179,179,179,179,179,-12,179,179,179,179,179,179,179,179,179],[-4,0,-4,0,-7,181,181,-2,181,-2,181,-17,181,181,181,-1,181,-1,181,-6,181,-1,181,181,-3,181,-1,181,-1,181,-2,181,-1,182,-30,183,-13,181,-7,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,-4,181,181,-1,181,-45,181,181],[184,184,184,-1,0,-4,0,-6,184,184,184,-2,184,184,-1,184,-7,184,-9,184,184,184,-1,184,-1,184,-5,184,184,-1,184,184,-3,184,184,184,-1,184,-2,184,-1,184,-2,184,-1,184,184,-2,184,-1,184,184,184,184,184,184,184,184,184,184,184,184,-1,184,-2,184,184,184,184,184,184,184,184,-3,184,184,-2,184,-2,184,-1,184,-5,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,-1,184,184,184,-20,184,184,184,184,184,-12,184,184,184,184,184,184,184,184,184],[185,185,185,-1,0,-4,0,-6,185,185,185,-2,185,185,-1,185,-7,185,-9,185,185,185,-1,185,-1,185,-5,185,185,-1,185,185,-3,185,185,185,-1,185,-2,185,-1,185,-2,185,-1,185,185,-2,185,-1,185,185,185,185,185,185,185,185,185,185,185,185,-1,185,-2,185,185,185,185,185,185,185,185,-3,185,185,-2,185,-2,185,-1,185,-5,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,185,-1,185,185,185,-20,185,185,185,185,185,-12,185,185,185,185,185,185,185,185,185],[186,187,188,-1,189,-4,190,-4,191,-1,186,186,186,-2,186,186,-1,186,-7,186,-9,186,186,186,-1,186,-1,186,-5,186,186,-1,186,186,-3,186,186,186,-1,186,-2,186,-1,186,-2,192,-1,186,186,-2,186,-1,186,186,186,186,186,186,186,186,186,186,186,186,-1,186,-2,186,186,186,186,186,186,186,186,-3,186,186,-2,186,-2,186,-1,186,-5,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,-1,186,186,186,-20,186,186,186,186,193,-12,186,186,186,186,186,186,186,186,186],[194,194,194,-1,194,-4,194,-4,194,-1,194,194,194,-2,194,194,-1,194,-7,194,-9,194,194,194,-1,194,-1,194,-5,194,194,-1,194,194,-3,194,194,194,-1,194,-2,194,-1,194,-2,194,-1,194,194,-2,194,-1,194,194,194,194,194,194,194,194,194,194,194,194,-1,194,-2,194,194,194,194,194,194,194,194,-3,194,194,-2,194,-2,194,-1,194,-5,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,194,-1,194,194,194,-20,194,194,194,194,194,-12,194,194,194,194,194,194,194,194,194],[195,195,195,-1,195,-4,195,-4,195,-1,195,195,195,-2,195,195,-1,195,-7,195,-9,195,195,195,-1,195,-1,195,-5,195,195,-1,195,195,-3,195,195,195,-1,195,-2,195,-1,195,-2,195,-1,195,195,-2,195,-1,195,195,195,195,195,195,195,195,195,195,195,195,-1,195,-2,195,195,195,195,195,195,195,195,-3,195,195,-2,195,-2,195,-1,195,-5,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,-1,195,195,195,-20,195,195,195,195,195,-12,195,195,195,195,195,195,195,195,195],[196,196,196,-1,0,-4,0,-6,196,196,196,-2,196,196,-1,196,-17,196,196,196,-1,196,-1,196,-5,196,196,-1,196,196,-3,196,196,196,-1,196,-2,196,-1,196,-2,196,-2,196,-2,196,-1,196,196,196,196,196,196,196,196,196,196,196,196,-1,196,-2,196,196,196,196,-1,196,196,-4,196,196,-2,196,-2,196,-1,196,-5,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,196,-1,196,196,196,-20,196,196,196,196,196,-12,196,196,196,196,196,196,196,196,196],[197,197,197,-1,0,-4,0,-6,197,197,197,-2,197,197,-1,197,-17,197,197,197,-1,197,-1,197,-5,197,197,-1,197,197,-3,197,197,197,-1,197,-2,197,-1,197,-2,197,-2,197,-2,197,-1,197,197,197,197,197,197,197,197,197,197,197,197,-1,197,-2,197,197,197,197,-1,197,197,-4,197,197,-2,197,-2,197,-1,197,-5,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,197,-1,197,197,197,-20,197,197,197,197,197,-12,197,197,197,197,197,197,197,197,197],[198,198,198,-1,0,-4,0,-6,198,198,198,-2,198,198,-1,198,-17,198,198,198,-1,198,-1,198,-5,198,198,-1,198,198,-3,198,198,198,-1,198,-2,198,-1,198,-2,198,-2,198,-2,198,-1,198,198,198,198,198,198,198,198,198,198,198,198,-1,198,-2,198,198,198,198,-1,198,198,-4,198,198,-2,198,-2,198,-1,198,-5,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,198,-1,198,198,198,-20,198,198,198,198,198,-12,198,198,198,198,198,198,198,198,198],[199,199,199,-1,0,-4,0,-6,199,199,199,-2,199,199,-1,199,-17,199,199,199,-1,199,-1,199,-5,199,199,-1,199,199,-3,199,199,199,-1,199,-2,199,-1,199,-2,199,-2,199,-2,199,-1,199,199,199,199,199,199,199,199,199,199,199,199,-1,199,-2,199,199,199,199,-1,199,199,-4,199,199,-2,199,-2,199,-1,199,-5,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,199,-1,199,199,199,-20,199,199,199,199,199,-12,199,199,199,199,199,199,199,199,199],[-1,200,201,-1,202,203,204,205,206,-145,207,-1,208,209],[-1,210,211,-1,212,213,214,215,216,-145,207,-1,217,218],[219,219,219,-1,0,-4,0,-6,219,219,219,-2,219,219,-1,219,-17,219,219,219,-1,219,-1,219,-5,219,219,-1,219,219,-3,219,219,219,-1,219,-2,219,-1,219,-2,219,-2,219,-2,219,-1,219,219,219,219,219,219,219,219,219,219,219,219,-1,219,-2,219,219,219,219,-1,219,219,-4,219,219,-2,219,-2,219,-1,219,-5,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,219,-1,219,219,219,-20,219,219,219,219,219,-12,219,219,219,219,219,219,219,219,219],[220,220,220,-1,0,-4,0,-6,220,220,220,-2,220,220,-1,220,-17,220,220,220,-1,220,-1,220,-5,220,220,-1,220,220,-3,220,220,220,-1,220,-2,220,-1,220,-2,220,-2,220,-2,220,-1,220,220,220,220,220,220,220,220,220,220,220,220,-1,220,-2,220,220,220,220,-1,220,220,-4,220,220,-2,220,-2,220,-1,220,-5,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,220,-1,220,220,220,-20,220,220,220,220,220,-12,220,220,220,220,220,220,220,220,220],[221,221,221,-1,0,-4,0,-6,221,221,221,-2,221,221,-1,221,-17,221,221,221,-1,221,-1,221,-5,221,221,-1,221,221,-3,221,221,221,-1,221,-2,221,-1,221,-2,221,-2,221,-2,221,-1,221,221,221,221,221,221,221,221,221,221,221,221,-1,221,-2,221,221,221,221,-1,221,221,-4,221,221,-2,221,-2,221,-1,221,-5,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,221,-1,221,221,221,-20,221,221,221,221,221,-12,221,221,221,221,221,221,221,221,221],[222,222,222,-1,223,-4,224,-6,222,222,222,-2,222,222,-1,222,-17,222,222,222,-1,222,-1,222,-5,222,222,-1,222,222,-3,222,222,222,-1,222,-2,222,-1,222,-2,222,-2,222,-2,222,-1,222,222,222,222,222,222,222,222,222,222,222,222,-1,222,-2,222,222,222,222,-1,222,222,-4,222,222,-2,222,-2,222,-1,222,-5,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,-1,222,222,222,-20,222,222,222,222,222,-4,225,-7,222,222,222,222,222,222,226,222,222],[227,227,227,-1,223,-4,224,-6,227,227,227,-2,227,227,-1,227,-17,227,227,227,-1,227,-1,227,-5,227,227,-1,227,227,-3,227,227,227,-1,227,-2,227,-1,227,-2,227,-2,227,-2,227,-1,227,227,227,227,227,227,227,227,227,227,227,227,-1,227,-2,227,227,227,227,-1,227,227,-4,227,227,-2,227,-2,227,-1,227,-5,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,227,-1,227,227,227,-20,227,227,227,227,227,-4,227,-7,227,227,227,227,227,227,227,227,227],[228,228,228,-1,228,228,228,228,228,228,-6,228,228,228,-2,228,228,-1,228,-17,228,228,228,-1,228,-1,228,-5,228,228,-1,228,228,-3,228,228,228,-1,228,-2,228,-1,228,-2,228,-2,228,-2,228,-1,228,228,228,228,228,228,228,228,228,228,228,228,-1,228,-2,228,228,228,228,-1,228,228,-4,228,228,-2,228,-2,228,-1,228,-5,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,-20,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228,228],[-4,0,-4,0,-156,229,230,231,232,233,234,235,236],[-9,0,-156,237,237,237,237,237,237,237,237],[-4,0,-4,0,-156,238,239],[-9,0,-156,240,240],[-1,1,-2,0,-4,0,-173,241,242,243,244,245,246,247,248,249,250,251,252],[-1,253,-7,0,-173,253,253,253,253,253,253,253,253,253,253,253,253],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-2,254,-29,6,-7,7,255,-10,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,256,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-91,257],[-4,0,-4,0,-3,258,-140,259,260],[261,261,261,-1,0,-4,0,-6,261,261,261,-2,261,261,-1,261,-17,261,261,261,-1,261,-1,261,-5,261,261,-1,261,261,-3,261,261,261,-1,261,-2,261,-1,261,-2,261,-2,261,-2,261,-1,261,261,261,261,261,261,261,261,261,261,261,261,-1,261,-2,261,261,261,261,-1,261,261,-4,261,261,-2,261,-2,261,-1,261,-5,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,261,-1,261,261,261,-20,261,261,261,261,261,-12,261,261,261,261,261,261,261,261,261],[-1,262,263,264,265,266,267,268,269,270,-3,271,272,-101,273,274,-38,275,276],[-1,1,2,-1,0,-4,0,-8,90,-2,5,277,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,278,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-11,168,-40,279,-138,280],[281,281,281,-1,0,-4,0,-6,281,281,281,-2,281,281,-1,281,-17,281,281,281,-1,281,-1,281,-5,281,281,-1,281,281,-3,281,281,281,-1,281,-2,281,-1,281,-2,281,-2,281,-2,281,-1,281,281,281,281,281,281,281,281,281,281,281,281,-1,281,-2,281,281,281,281,-1,281,281,-4,281,281,-2,281,-2,281,-1,281,-5,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,281,-1,281,281,281,-20,281,281,281,281,281,-12,281,281,281,281,281,281,281,281,281],[282,282,282,-1,0,-4,0,-6,282,282,282,-2,282,282,-1,282,-17,282,282,282,-1,282,-1,282,-5,282,282,-1,282,282,-3,282,282,282,-1,282,-2,282,-1,282,-2,282,-2,282,-2,282,-1,282,282,282,282,282,282,282,282,282,282,282,282,-1,282,-2,282,282,282,282,-1,282,282,-4,282,282,-2,282,-2,282,-1,282,-5,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,282,-1,282,282,282,-20,282,282,282,282,282,-12,282,282,282,282,282,282,282,282,282],[-4,0,-4,0,-92,283],[-4,0,-4,0,-92,284],[-4,0,-4,0,-61,285],[-2,2,-1,0,-4,0,-52,286,-11,9,-103,287,-3,48],[288,288,288,-1,0,-4,0,-5,288,288,-1,288,-2,288,-32,288,-7,288,-6,288,-4,288,-2,288,288,-1,288,288,288,288,288,288,288,-1,288,288,288,288,288,288,288,288,-2,288,288,288,288,-1,288,288,-4,288,288,-2,288,-2,288,-1,288,-27,288,-1,288,288,288,288,288,288,-1,288,288,288,-20,288,288,288,288,288,-12,288,288,288,288,288,288,-1,288,288],[-4,0,-4,0,-11,289],[290,290,290,-1,0,-4,0,-5,290,290,-1,290,-2,290,-32,290,-7,290,-6,290,-4,290,-2,290,290,-1,290,290,290,290,290,290,290,-1,290,290,290,290,290,290,290,290,-2,290,290,290,290,-1,290,290,-4,290,290,-2,290,-2,290,-1,290,-27,290,-1,290,290,290,290,290,290,-1,290,290,290,-20,290,290,290,290,290,-12,290,290,290,290,290,290,-1,290,290],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,-4,164,-5,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-11,291],[-4,0,-4,0,-11,292,-64,293],[-4,0,-4,0,-11,294],[-2,2,-1,0,-4,0,-59,295,-4,9,-107,48],[-2,2,-1,0,-4,0,-59,296,-4,9,-107,48],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,297,-4,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-11,298],[-4,0,-4,0,-168,44],[-4,0,-4,0,-59,299],[300,300,300,-1,0,-4,0,-5,300,300,-1,300,-2,300,-32,300,-7,300,-6,300,-4,300,-2,300,300,-1,300,-1,300,300,300,300,300,-1,300,300,300,300,300,300,300,300,-2,300,300,300,300,-1,300,300,-4,300,300,-2,300,-2,300,-1,300,-27,300,-1,300,300,300,300,300,300,-1,300,300,300,-20,300,300,300,300,300,-12,300,300,300,300,300,300,-1,300,300],[-2,2,-1,0,-4,0,-64,9,-30,301,-72,302,-3,48],[303,303,303,-1,0,-4,0,-5,303,303,-1,303,-2,303,-32,303,-7,303,-6,303,-4,303,-2,303,303,-1,303,-1,303,303,303,303,303,-1,303,303,303,303,303,303,303,303,-2,303,303,303,303,-1,303,303,-4,303,303,-2,303,-2,303,-1,303,-27,303,-1,303,303,303,303,303,303,-1,303,303,303,-20,303,303,303,303,303,-12,303,303,303,303,303,303,-1,303,303],[-2,2,-1,0,-4,0,-11,304,-52,9,-107,48],[-2,305,-1,0,-4,0,-52,305,-11,305,-103,305,-3,305],[-2,306,-1,0,-4,0,-52,306,-11,306,-103,306,-3,306],[307,-3,0,-4,0],[-4,0,-4,0,-8,308,-184,308],[82,-3,0,-4,0],[-2,63,-1,0,-4,0,-7,309,-137,310,311,312],[-2,63,-1,0,-4,0,-7,313,-137,314,311,312],[-2,63,-1,0,-4,0,-7,315,-137,316,311,312],[-2,317,-1,0,-4,0,-7,317,-137,317,317,317],[-2,318,-1,319,-4,320,-7,321,-26,321,-26,322,-2,323,-71,324,-8,321,321,321],[-2,325,-1,325,-4,325,-7,325,-26,325,-26,325,-2,325,-71,325,-8,325,325,325],[-2,326,-1,0,-4,0,-7,326,-137,326,326,326],[-1,327,328,-1,329,330,331,332,333,0,-4,334],[335,335,335,-1,0,-4,0,-6,335,-1,335,-2,335,-32,335,-7,335,-6,335,-4,335,-2,335,-2,335,-1,335,335,335,335,335,-1,335,335,335,335,335,335,-1,335,-2,335,335,335,335,-1,335,335,-4,335,335,-2,335,-2,335,-29,335,-1,335,335,335,335,335,335,-1,335,335,335,-20,335,335,335,335,335,-12,335,335,335,335,335,335,-1,335,335],[83,83,83,-1,0,-4,0,-6,83,83,83,-2,83,83,-1,83,-17,83,83,83,-1,83,-1,83,-5,83,83,-1,83,83,-3,83,83,83,-1,83,-2,83,-1,83,-2,83,-2,83,-2,83,-1,83,83,83,83,83,83,83,83,83,83,83,83,-1,83,-2,83,83,83,83,-1,83,83,-4,83,83,-2,83,-2,83,-1,83,-5,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,-1,83,83,83,-20,83,83,83,83,83,-12,83,83,83,83,83,83,83,83,83],[-2,63,-1,0,-4,0,-178,65,-15,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81],[-4,0,-4,0,-22,336],[-4,0,-4,0,-59,337],[-4,0,-4,0,-14,338,-7,339],[-4,0,-4,0,-22,339],[-4,0,-4,0,-14,340,-7,340],[-4,0,-4,0,-14,341,-7,341,-85,341],[-4,0,-4,0,-66,342],[-2,2,-1,0,-4,0,-14,343,-49,9,-43,344,-63,48],[-4,0,-4,0,-59,345],[-4,0,-4,0,-22,336,-36,346],[347,347,347,-1,0,-4,0,-6,347,-1,347,-2,347,-32,347,-7,347,-6,347,-4,347,-2,347,-2,347,-1,347,347,347,347,347,-1,347,347,347,347,347,347,-1,347,-2,347,347,347,347,-1,347,347,-4,347,347,-2,347,-2,347,-29,347,-1,347,347,347,347,347,347,-1,347,347,347,-20,347,347,347,347,347,-12,347,347,347,347,347,347,-1,347,347],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-11,9,-11,16,-14,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-2,2,-1,0,-4,0,-14,348,-49,9,-43,349,-63,48],[-4,0,-4,0,-108,350],[-1,1,2,-1,0,-4,0,-5,351,-2,90,-2,5,-32,6,-7,7,-6,8,-4,9,-3,351,-1,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,351,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,351,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,352,352,-1,0,-4,0,-5,352,-2,352,-2,352,-32,352,-7,352,-6,352,-4,352,-3,352,-1,352,-1,352,352,352,352,352,-1,352,352,352,352,352,352,352,352,-2,352,352,352,352,-1,352,352,-4,352,352,-2,352,-2,352,-1,352,-27,352,-1,352,352,352,352,352,352,-1,352,352,352,-20,352,352,352,352,352,-12,352,352,352,352,352,352,-1,352,352],[-1,353,353,-1,0,-4,0,-5,353,-2,353,-2,353,-32,353,-7,353,-6,353,-4,353,-3,353,-1,353,-1,353,353,353,353,353,-1,353,353,353,353,353,353,353,353,-2,353,353,353,353,-1,353,353,-4,353,353,-2,353,-2,353,-1,353,-27,353,-1,353,353,353,353,353,353,-1,353,353,353,-20,353,353,353,353,353,-12,353,353,353,353,353,353,-1,353,353],[354,354,354,-1,0,-4,0,-5,354,354,-1,354,-2,354,-32,354,-7,354,-6,354,-4,354,-2,354,354,-1,354,354,354,354,354,354,354,-1,354,354,354,354,354,354,354,354,-2,354,354,354,354,-1,354,354,-4,354,354,-2,354,-2,354,-1,354,-27,354,-1,354,354,354,354,354,354,-1,354,354,354,-20,354,354,354,354,354,-12,354,354,354,354,354,354,-1,354,354],[355,355,355,-1,0,-4,0,-6,355,355,355,-2,355,355,-1,355,-17,355,355,-2,355,-1,355,-5,355,355,-1,355,355,-3,355,355,-5,355,-1,355,-2,355,-2,355,-2,355,-1,355,355,355,355,355,-1,355,355,355,355,355,355,-1,355,-2,355,355,355,355,-1,355,355,-4,355,355,-2,355,-2,355,-1,355,-15,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,355,-1,355,355,355,-20,355,355,355,355,355,-12,355,355,355,355,355,355,-1,355,355],[356,356,356,-1,0,-4,0,-6,356,356,356,-2,356,356,-1,356,-17,356,356,-2,356,-1,356,-5,356,356,-1,356,356,-3,356,356,-5,356,-1,356,-2,356,-2,356,-2,356,-1,356,356,356,356,356,-1,356,356,356,356,356,356,-1,356,-2,356,356,356,356,-1,356,356,-4,356,356,-2,356,-2,356,-1,356,-15,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,356,-1,356,356,356,-20,356,356,356,356,356,-12,356,356,356,356,356,356,-1,356,356],[-1,357,357,-1,0,-4,0,-8,357,-2,357,-32,357,-7,357,-11,357,-11,357,-14,357,-1,357,357,-4,357,357,-2,357,-2,357,-29,357,-1,357,357,357,357,357,357,-1,357,357,357,-20,357,357,357,357,357,-12,357,357,357,357,357,357,-1,357,357],[358,358,358,-1,0,-4,0,-6,358,358,358,-2,358,358,-1,358,-17,358,358,-2,358,-1,358,-5,358,358,-1,358,358,-3,358,358,-5,358,-1,358,-2,358,-2,358,-2,358,-1,358,358,358,358,358,-1,358,358,358,358,358,358,-1,358,-2,358,358,358,358,-1,358,358,-4,358,358,-2,358,-2,358,-1,358,-15,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,-1,358,358,358,-20,358,358,358,358,358,-12,358,358,358,358,358,358,-1,358,358],[109,109,109,-1,0,-4,0,-6,109,109,109,-2,109,109,-1,109,-17,109,109,-2,109,-1,109,-5,109,109,-1,109,109,-3,109,109,-5,109,-1,109,-2,109,-2,109,-2,109,-1,109,109,109,109,109,-1,109,109,109,109,109,109,-1,109,-2,109,109,109,109,-1,109,109,-4,109,109,-2,109,-2,109,-1,109,-15,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,109,123,124,-1,109,109,109,-20,109,109,109,109,109,-12,109,109,109,109,109,109,-1,109,109],[181,181,181,-1,0,-4,0,-6,181,181,181,-2,181,181,-1,181,-17,181,181,181,-1,181,-1,181,-5,181,181,-1,181,181,-3,181,181,181,-1,181,-2,181,-1,181,-2,181,-2,181,-2,181,-1,181,181,181,181,181,181,181,181,181,181,181,181,-1,181,-2,181,181,181,181,-1,181,181,-4,181,181,-2,181,-2,181,-1,181,-5,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,-1,181,181,181,-20,181,181,181,181,181,-12,181,181,181,181,181,181,181,181,181],[-1,1,2,-1,0,-4,0,-14,359,-37,360,-11,9,-28,361,-3,362,363,-3,364,-5,365,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-2,2,-1,0,-4,0,-11,366,-52,9,-26,367,-80,48],[-4,0,-4,0,-91,368],[369,369,369,-1,0,-4,0,-6,369,369,369,-2,369,369,-1,369,-17,369,369,-2,369,-1,369,-5,369,369,-1,369,369,-3,369,369,-5,369,-1,369,-2,369,-2,369,-2,369,-1,369,369,369,369,369,-1,369,369,369,369,369,369,-1,369,-2,369,369,369,369,-1,369,369,-4,369,369,-2,369,-2,369,-1,369,-15,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,369,-1,369,369,369,-20,369,369,369,369,369,-12,369,369,369,369,369,369,-1,369,369],[370,370,370,-1,0,-4,0,-6,370,370,370,-2,370,370,-1,370,-17,370,370,-2,370,-1,370,-5,370,370,-1,370,370,-3,370,370,-5,370,-1,370,-2,370,-2,370,-2,370,-1,370,370,370,370,370,-1,370,370,370,370,370,370,-1,370,-2,370,370,370,370,-1,370,370,-4,370,370,-2,370,-2,370,-1,370,-15,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,-1,370,370,370,-20,370,370,370,370,370,-12,370,370,370,370,370,370,-1,370,370],[371,371,371,-1,0,-4,0,-6,371,371,371,-2,371,371,-1,371,-17,371,371,-2,371,-1,371,-5,371,371,-1,371,371,-3,371,371,-5,371,-1,371,-2,371,-2,371,-2,371,-1,371,371,371,371,371,-1,371,371,371,371,371,371,-1,371,-2,371,371,371,371,-1,371,371,-4,371,371,-2,371,-2,371,-1,371,-15,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,371,-1,371,371,371,-20,371,371,371,371,371,-12,371,371,371,371,371,371,-1,371,371],[372,372,372,-1,0,-4,0,-6,372,372,372,-2,372,372,-1,372,-17,372,372,-2,372,-1,372,-5,372,372,-1,372,372,-3,372,372,-5,372,-1,372,-2,372,-2,372,-2,372,-1,372,372,372,372,372,-1,372,372,372,372,372,372,-1,372,-2,372,372,372,372,-1,372,372,-4,372,372,-2,372,-2,372,-1,372,-15,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,372,-1,372,372,372,-20,372,372,372,372,372,-12,372,372,372,372,372,372,-1,372,372],[373,373,373,-1,223,-4,224,-6,373,373,373,-2,373,373,-1,373,-17,373,373,373,-1,373,-1,373,-5,373,373,-1,373,373,-3,373,373,373,-1,373,-2,373,-1,373,-2,373,-2,373,-2,373,-1,373,373,373,373,373,373,373,373,373,373,373,373,-1,373,-2,373,373,373,373,-1,373,373,-4,373,373,-2,373,-2,373,-1,373,-5,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,373,-1,373,373,373,-20,373,373,373,373,373,-4,373,-7,373,373,373,373,373,373,373,373,373],[374,374,374,-1,0,-4,0,-6,374,374,374,-2,374,374,-1,374,-17,374,374,-2,374,-1,374,-5,374,374,-1,374,374,-3,374,374,-5,374,-1,374,-2,374,-2,374,-2,374,-1,374,374,374,374,374,-1,374,374,374,374,374,374,-1,374,-2,374,374,374,374,-1,374,374,-4,374,374,-2,374,-2,374,-1,374,-15,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,374,-1,374,374,374,-20,374,374,374,374,374,-12,374,374,374,374,374,374,-1,374,374],[375,375,375,-1,0,-4,0,-6,375,375,375,-2,375,375,-1,375,-17,375,375,-2,375,-1,375,-5,375,375,-1,375,375,-3,375,375,-5,375,-1,375,-2,375,-2,375,-2,375,-1,375,375,375,375,375,-1,375,375,375,375,375,375,-1,375,-2,375,375,375,375,-1,375,375,-4,375,375,-2,375,-2,375,-1,375,-15,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,-1,375,375,375,-20,375,375,375,375,375,-12,375,375,375,375,375,375,-1,375,375],[376,376,376,-1,0,-4,0,-6,376,376,376,-2,376,376,-1,376,-17,376,376,-2,376,-1,376,-5,376,376,-1,376,376,-3,376,376,-5,376,-1,376,-2,376,-2,376,-2,376,-1,376,376,376,376,376,-1,376,376,376,376,376,376,-1,376,-2,376,376,376,376,-1,376,376,-4,376,376,-2,376,-2,376,-1,376,-15,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,376,-1,376,376,376,-20,376,376,376,376,376,-12,376,376,376,376,376,376,-1,376,376],[377,377,377,-1,0,-4,0,-6,377,377,377,-2,377,377,-1,377,-17,377,377,-2,377,-1,377,-5,377,377,-1,377,377,-3,377,377,-5,377,-1,377,-2,377,-2,377,-2,377,-1,377,377,377,377,377,-1,377,377,377,377,377,377,-1,377,-2,377,377,377,377,-1,377,377,-4,377,377,-2,377,-2,377,-1,377,-15,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,377,-1,377,377,377,-20,377,377,377,377,377,-12,377,377,377,377,377,377,-1,377,377],[-2,2,-1,0,-4,0,-64,9,-107,48],[378,378,378,-1,0,-4,0,-6,378,378,378,-2,378,378,-1,378,-17,378,378,378,-1,378,-1,378,-5,378,378,-1,378,378,-3,378,378,378,-1,378,-2,378,-1,378,-2,378,-2,378,-2,378,-1,378,378,378,378,378,378,378,378,378,378,378,378,-1,378,-2,378,378,378,378,-1,378,378,-4,378,378,-2,378,-2,378,-1,378,-5,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,378,-1,378,378,378,-20,378,378,378,378,378,-12,378,378,378,378,378,378,378,378,378],[379,379,379,-1,0,-4,0,-6,379,379,379,-2,379,379,-1,379,-17,379,379,379,-1,379,-1,379,-5,379,379,-1,379,379,-3,379,379,379,-1,379,-2,379,-1,379,-2,379,-2,379,-2,379,-1,379,379,379,379,379,379,379,379,379,379,379,379,-1,379,-2,379,379,379,379,-1,379,379,-4,379,379,-2,379,-2,379,-1,379,-5,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,379,-1,379,379,379,-20,379,379,379,379,379,-12,379,379,379,379,379,379,379,379,379],[-1,1,2,-1,0,-4,0,-8,90,-2,5,380,-1,381,-29,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,382,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[383,383,383,-1,0,-4,0,-6,383,383,383,-2,383,383,-1,383,-17,383,383,383,-1,383,-1,383,-5,383,383,-1,383,383,-3,383,383,383,-1,383,-2,383,-1,383,-2,383,-2,383,-2,383,-1,383,383,383,383,383,383,383,383,383,383,383,383,-1,383,-2,383,383,383,383,-1,383,383,-4,383,383,-2,383,-2,383,-1,383,-5,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,383,-1,383,383,383,-20,383,383,383,383,383,-12,383,383,383,383,383,383,383,383,383],[384,384,384,-1,0,-4,0,-6,384,384,384,-2,384,384,-1,384,-17,384,384,384,-1,384,-1,384,-5,384,384,-1,384,384,-3,384,384,384,-1,384,-2,384,-1,384,-2,384,-2,384,-2,384,-1,384,384,384,384,384,384,384,384,384,384,384,384,-1,384,-2,384,384,384,384,-1,384,384,-4,384,384,-2,384,-2,384,-1,384,-5,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,384,-1,384,384,384,-20,384,384,384,384,384,-12,384,384,384,384,384,384,384,384,384],[385,385,385,-1,0,-4,0,-6,385,385,385,-2,385,385,-1,385,-17,385,385,385,-1,385,-1,385,-5,385,385,-1,385,385,-3,385,385,385,-1,385,-2,385,-1,385,-2,385,-2,385,-2,385,-1,385,385,385,385,385,385,385,385,385,385,385,385,-1,385,-2,385,385,385,385,-1,385,385,-4,385,385,-2,385,-2,385,-1,385,-5,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,385,-1,385,385,385,-20,385,385,385,385,385,-12,385,385,385,385,385,385,-1,385,385],[-4,0,-4,0,-101,386],[-1,1,-2,0,-4,0],[-4,0,-4,0,-52,279,-138,280],[387,187,188,-1,189,-4,190,-4,191,-1,387,387,387,-2,387,387,-1,387,-7,387,-9,387,387,387,-1,387,-1,387,-5,387,387,-1,387,387,-3,387,387,387,-1,387,-2,387,-1,387,-2,192,-1,387,387,-2,387,-1,387,387,387,387,387,387,387,387,387,387,387,387,-1,387,-2,387,387,387,387,387,387,387,387,-3,387,387,-2,387,-2,387,-1,387,-5,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,387,-1,387,387,387,-20,387,387,387,387,193,-12,387,387,387,387,387,387,387,387,387],[388,388,388,-1,0,-4,0,-6,388,388,388,-2,388,388,-1,388,-7,388,-9,388,388,388,-1,388,-1,388,-5,388,388,-1,388,388,-3,388,388,388,-1,388,-2,388,-1,388,-2,388,-1,388,388,-2,388,-1,388,388,388,388,388,388,388,388,388,388,388,388,-1,388,-2,388,388,388,388,388,388,388,388,-3,388,388,-2,388,-2,388,-1,388,-5,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,388,-1,388,388,388,-20,388,388,388,388,388,-12,388,388,388,388,388,388,388,388,388],[389,389,389,-1,389,-4,389,-4,389,-1,389,389,389,-2,389,389,-1,389,-7,389,-9,389,389,389,-1,389,-1,389,-5,389,389,-1,389,389,-3,389,389,389,-1,389,-2,389,-1,389,-2,389,-1,389,389,-2,389,-1,389,389,389,389,389,389,389,389,389,389,389,389,-1,389,-2,389,389,389,389,389,389,389,389,-3,389,389,-2,389,-2,389,-1,389,-5,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,389,-1,389,389,389,-20,389,389,389,389,389,-12,389,389,389,389,389,389,389,389,389],[390,390,390,-1,390,-4,390,-4,390,-1,390,390,390,-2,390,390,-1,390,-7,390,-9,390,390,390,-1,390,-1,390,-5,390,390,-1,390,390,-3,390,390,390,-1,390,-2,390,-1,390,-2,390,-1,390,390,-2,390,-1,390,390,390,390,390,390,390,390,390,390,390,390,-1,390,-2,390,390,390,390,390,390,390,390,-3,390,390,-2,390,-2,390,-1,390,-5,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,-1,390,390,390,-20,390,390,390,390,390,-12,390,390,390,390,390,390,390,390,390],[391,391,391,-1,391,-4,391,-4,391,-1,391,391,391,-2,391,391,-1,391,-7,391,-9,391,391,391,-1,391,-1,391,-5,391,391,-1,391,391,-3,391,391,391,-1,391,-2,391,-1,391,-2,391,-1,391,391,-2,391,-1,391,391,391,391,391,391,391,391,391,391,391,391,-1,391,-2,391,391,391,391,391,391,391,391,-3,391,391,-2,391,-2,391,-1,391,-5,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,391,-1,391,391,391,-20,391,391,391,391,391,-12,391,391,391,391,391,391,391,391,391],[392,392,392,-1,0,-4,0,-6,392,392,392,-2,392,392,-1,392,-7,392,-9,392,392,392,-1,392,-1,392,-5,392,392,-1,392,392,-3,392,392,392,-1,392,-2,392,-1,392,-2,392,-1,392,392,-2,392,-1,392,392,392,392,392,392,392,392,392,392,392,392,-1,392,-2,392,392,392,392,392,392,392,392,-3,392,392,-2,392,-2,392,-1,392,-5,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,392,-1,392,392,392,-20,392,392,392,392,392,-12,392,392,392,392,392,392,392,392,392],[-1,200,201,-1,202,203,204,205,206,-145,207,-1,208,393],[394,394,394,-1,0,-4,0,-6,394,394,394,-2,394,394,-1,394,-17,394,394,394,-1,394,-1,394,-5,394,394,-1,394,394,-3,394,394,394,-1,394,-2,394,-1,394,-2,394,-2,394,-2,394,-1,394,394,394,394,394,394,394,394,394,394,394,394,-1,394,-2,394,394,394,394,-1,394,394,-4,394,394,-2,394,-2,394,-1,394,-5,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,394,-1,394,394,394,-20,394,394,394,394,394,-12,394,394,394,394,394,394,394,394,394],[-1,395,395,-1,395,395,395,395,395,0,-144,395,-1,395,395],[-1,396,396,-1,396,396,396,396,396,0,-144,396,-1,396,396],[-4,0,-4,0,-146,397,398,-2,399,400,401,402,-2,403,404,405,406,407,408,409,410,411,412,413,414,-6,415,-3,416],[-1,210,211,-1,212,213,214,215,216,-145,207,-1,417,218],[-1,418,418,-1,418,418,418,418,418,0,-144,418,-1,418,418],[-1,419,419,-1,419,419,419,419,419,0,-144,419,-1,419,419],[420,420,420,-1,223,-4,224,-6,420,420,420,-2,420,420,-1,420,-17,420,420,420,-1,420,-1,420,-5,420,420,-1,420,420,-3,420,420,420,-1,420,-2,420,-1,420,-2,420,-2,420,-2,420,-1,420,420,420,420,420,420,420,420,420,420,420,420,-1,420,-2,420,420,420,420,-1,420,420,-4,420,420,-2,420,-2,420,-1,420,-5,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,-1,420,420,420,-20,420,420,420,420,420,-4,225,-7,420,420,420,420,420,420,420,420,420],[420,420,420,-1,223,-4,224,-6,420,420,420,-2,420,420,-1,420,-17,420,420,420,-1,420,-1,420,-5,420,420,-1,420,420,-3,420,420,420,-1,420,-2,420,-1,420,-2,420,-2,420,-2,420,-1,420,420,420,420,420,420,420,420,420,420,420,420,-1,420,-2,420,420,420,420,-1,420,420,-4,420,420,-2,420,-2,420,-1,420,-5,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,-1,420,420,420,-20,420,420,420,420,420,-12,420,420,420,420,420,420,420,420,420],[421,421,421,-1,0,-4,0,-6,421,421,421,-2,421,421,-1,421,-17,421,421,421,-1,421,-1,421,-5,421,421,-1,421,421,-3,421,421,421,-1,421,-2,421,-1,421,-2,421,-2,421,-2,421,-1,421,421,421,421,421,421,421,421,421,421,421,421,-1,421,-2,421,421,421,421,-1,421,421,-4,421,421,-2,421,-2,421,-1,421,-5,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,421,-1,421,421,421,-20,421,421,421,421,421,-12,421,421,421,421,421,421,421,421,421],[422,1,422,-1,422,-4,422,-6,422,422,422,-2,422,422,-1,422,-17,422,422,422,-1,422,-1,422,-5,422,422,-1,422,422,-3,422,422,422,-1,422,-2,422,-1,422,-2,422,-2,422,-2,422,-1,422,422,422,422,422,422,422,422,422,422,422,422,-1,422,-2,422,422,422,422,-1,422,422,-4,422,422,-2,422,-2,422,-1,422,-5,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,422,-1,422,422,422,-20,422,422,422,422,422,-4,422,-7,422,422,422,422,422,422,422,422,422],[-1,1,-2,0,-4,0,-136,423,-55,424],[425,425,425,-1,425,-4,425,-6,425,425,425,-2,425,425,-1,425,-17,425,425,425,-1,425,-1,425,-5,425,425,-1,425,425,-3,425,425,425,-1,425,-2,425,-1,425,-2,425,-2,425,-2,425,-1,425,425,425,425,425,425,425,425,425,425,425,425,-1,425,-2,425,425,425,425,-1,425,425,-4,425,425,-2,425,-2,425,-1,425,-5,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,-1,425,425,425,-20,425,425,425,425,425,-4,425,-7,425,425,425,425,425,425,425,425,425],[426,426,426,-1,426,-4,426,-6,426,426,426,-2,426,426,-1,426,-17,426,426,426,-1,426,-1,426,-5,426,426,-1,426,426,-3,426,426,426,-1,426,-2,426,-1,426,-2,426,-2,426,-2,426,-1,426,426,426,426,426,426,426,426,426,426,426,426,-1,426,-2,426,426,426,426,-1,426,426,-4,426,426,-2,426,-2,426,-1,426,-5,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,-1,426,426,426,-20,426,426,426,426,426,-4,426,-7,426,426,426,426,426,426,426,426,426],[427,427,427,-1,223,-4,224,-6,427,427,427,-2,427,427,-1,427,-17,427,427,427,-1,427,-1,427,-5,427,427,-1,427,427,-3,427,427,427,-1,427,-2,427,-1,427,-2,427,-2,427,-2,427,-1,427,427,427,427,427,427,427,427,427,427,427,427,-1,427,-2,427,427,427,427,-1,427,427,-4,427,427,-2,427,-2,427,-1,427,-5,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,427,-1,427,427,427,-8,229,230,231,232,233,234,235,236,-4,427,427,427,427,427,-12,427,427,427,427,427,427,427,427,427],[428,428,428,-1,428,-4,428,-6,428,428,428,-2,428,428,-1,428,-17,428,428,428,-1,428,-1,428,-5,428,428,-1,428,428,-3,428,428,428,-1,428,-2,428,-1,428,-2,428,-2,428,-2,428,-1,428,428,428,428,428,428,428,428,428,428,428,428,-1,428,-2,428,428,428,428,-1,428,428,-4,428,428,-2,428,-2,428,-1,428,-5,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,-1,428,428,428,-8,428,428,428,428,428,428,428,428,-4,428,428,428,428,428,-12,428,428,428,428,428,428,428,428,428],[429,429,429,-1,429,-4,429,-6,429,429,429,-2,429,429,-1,429,-17,429,429,429,-1,429,-1,429,-5,429,429,-1,429,429,-3,429,429,429,-1,429,-2,429,-1,429,-2,429,-2,429,-2,429,-1,429,429,429,429,429,429,429,429,429,429,429,429,-1,429,-2,429,429,429,429,-1,429,429,-4,429,429,-2,429,-2,429,-1,429,-5,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,429,-1,429,429,429,-8,429,429,429,429,429,429,429,429,-4,429,429,429,429,429,-12,429,429,429,429,429,429,429,429,429],[430,430,430,-1,223,-4,224,-6,430,430,430,-2,430,430,-1,430,-17,430,430,430,-1,430,-1,430,-5,430,430,-1,430,430,-3,430,430,430,-1,430,-2,430,-1,430,-2,430,-2,430,-2,430,-1,430,430,430,430,430,430,430,430,430,430,430,430,-1,430,-2,430,430,430,430,-1,430,430,-4,430,430,-2,430,-2,430,-1,430,-5,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,430,-1,430,430,430,-8,238,239,-10,430,430,430,430,430,-12,430,430,430,430,430,430,430,430,430],[431,431,431,-1,431,-4,431,-6,431,431,431,-2,431,431,-1,431,-17,431,431,431,-1,431,-1,431,-5,431,431,-1,431,431,-3,431,431,431,-1,431,-2,431,-1,431,-2,431,-2,431,-2,431,-1,431,431,431,431,431,431,431,431,431,431,431,431,-1,431,-2,431,431,431,431,-1,431,431,-4,431,431,-2,431,-2,431,-1,431,-5,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,431,-1,431,431,431,-8,431,431,-10,431,431,431,431,431,-12,431,431,431,431,431,431,431,431,431],[432,432,432,-1,432,-4,432,-6,432,432,432,-2,432,432,-1,432,-17,432,432,432,-1,432,-1,432,-5,432,432,-1,432,432,-3,432,432,432,-1,432,-2,432,-1,432,-2,432,-2,432,-2,432,-1,432,432,432,432,432,432,432,432,432,432,432,432,-1,432,-2,432,432,432,432,-1,432,432,-4,432,432,-2,432,-2,432,-1,432,-5,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,432,-1,432,432,432,-8,432,432,-10,432,432,432,432,432,-12,432,432,432,432,432,432,432,432,432],[433,1,433,-1,223,-4,224,-6,433,433,433,-2,433,433,-1,433,-17,433,433,433,-1,433,-1,433,-5,433,433,-1,433,433,-3,433,433,433,-1,433,-2,433,-1,433,-2,433,-2,433,-2,433,-1,433,433,433,433,433,433,433,433,433,433,433,433,-1,433,-2,433,433,433,433,-1,433,433,-4,433,433,-2,433,-2,433,-1,433,-5,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,433,-1,433,433,433,-20,433,433,433,433,433,241,242,243,244,245,246,247,248,249,250,251,252,433,433,433,433,433,433,433,433,433],[434,434,434,-1,434,-4,434,-6,434,434,434,-2,434,434,-1,434,-17,434,434,434,-1,434,-1,434,-5,434,434,-1,434,434,-3,434,434,434,-1,434,-2,434,-1,434,-2,434,-2,434,-2,434,-1,434,434,434,434,434,434,434,434,434,434,434,434,-1,434,-2,434,434,434,434,-1,434,434,-4,434,434,-2,434,-2,434,-1,434,-5,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,-1,434,434,434,-20,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434,434],[435,435,435,-1,435,435,435,435,435,435,-6,435,435,435,-2,435,435,-1,435,-17,435,435,435,-1,435,-1,435,-5,435,435,-1,435,435,-3,435,435,435,-1,435,-2,435,-1,435,-2,435,-2,435,-2,435,-1,435,435,435,435,435,435,435,435,435,435,435,435,-1,435,-2,435,435,435,435,-1,435,435,-4,435,435,-2,435,-2,435,-1,435,-5,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,-20,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435,435],[-4,0,-4,0,-14,436,-38,437],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-2,438,-29,6,-7,7,439,-10,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,256,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[440,440,440,-1,0,-4,0,-6,440,440,440,-2,440,440,-1,440,-17,440,440,440,-1,440,-1,440,-5,440,440,-1,440,440,-3,440,440,440,-1,440,-2,440,-1,440,-2,440,-2,440,-2,440,-1,440,440,440,440,440,440,440,440,440,440,440,440,-1,440,-2,440,440,440,440,-1,440,440,-4,440,440,-2,440,-2,440,-1,440,-5,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,-1,440,440,440,-20,440,440,440,440,440,-12,440,440,440,440,440,440,440,440,440],[-4,0,-4,0,-14,441,-38,441],[181,181,181,-1,0,-4,0,-6,181,181,181,-2,181,181,-1,181,-17,181,181,181,-1,181,-1,181,-5,181,181,-1,181,181,-3,181,181,181,-1,181,-2,181,-1,181,-2,181,-2,181,-2,181,-1,181,181,181,181,181,181,181,181,181,181,181,181,-1,181,-2,181,181,181,181,183,181,181,-4,181,181,-2,181,-2,181,-1,181,-5,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,181,-1,181,181,181,-20,181,181,181,181,181,-12,181,181,181,181,181,181,181,181,181],[-1,442,442,-1,0,-4,0,-8,442,-2,442,-2,442,-29,442,-7,442,442,-10,442,-11,442,-14,442,-1,442,442,-4,442,442,-1,442,442,-2,442,-29,442,-1,442,442,442,442,442,442,-1,442,442,442,-20,442,442,442,442,442,-12,442,442,442,442,442,442,-1,442,442],[-2,2,-1,0,-4,0,-11,443,-52,9,-107,48],[-4,0,-4,0,-3,258,-140,259,444],[445,445,2,-1,0,-4,0,-6,445,445,445,-2,445,445,-1,445,-17,445,445,445,-1,445,-1,445,-5,445,445,-1,445,445,-3,445,445,445,-1,445,-2,445,-1,445,-2,9,-2,445,-2,445,-1,445,445,445,445,445,445,445,445,445,445,445,445,-1,445,-2,445,445,445,445,-1,445,445,-4,445,445,-2,445,-2,445,-1,445,-5,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,445,-1,445,445,445,-20,445,445,445,445,48,-12,445,445,445,445,445,445,445,445,445],[-4,0,-4,0,-3,446,-140,446,446],[-4,0,-4,0,-3,447,-140,447,447],[-4,0,-4,0,-3,448],[-4,0,-4,0,-106,449,450],[451,451,451,-1,0,-4,0,-6,451,451,451,-2,451,451,-1,451,-17,451,451,451,-1,451,-1,451,-5,451,451,-1,451,451,-3,451,451,451,-1,451,-2,451,-1,451,-2,451,-2,451,-2,451,-1,451,451,451,451,451,451,451,451,451,451,451,451,-1,451,-2,451,451,451,451,-1,451,451,-4,451,451,-2,451,-2,451,-1,451,-5,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,451,-1,451,451,451,-20,451,451,451,451,451,-12,451,451,451,451,451,451,451,451,451],[-1,452,452,-1,0,-4,0,-8,452,-2,452,-32,452,-7,452,-11,452,-11,452,-14,452,-1,452,452,-4,452,452,-2,452,-2,452,-29,452,-1,452,452,452,452,452,452,-1,452,452,452,-20,452,452,452,452,452,-12,452,452,452,452,452,452,-1,452,452],[-1,262,263,264,265,266,267,268,269,270,-3,271,272,-101,453,453,-38,275,276],[-1,454,454,454,454,454,454,454,454,454,-3,454,454,-101,454,454,-38,454,454],[-1,455,455,455,455,455,455,455,455,455,-3,455,455,-101,455,455,-38,455,455],[-4,0,-4,0,-108,456],[457,457,457,-1,0,-4,0,-6,457,457,457,-2,457,457,-1,457,-17,457,457,457,-1,457,-1,457,-5,457,457,-1,457,457,-3,457,457,457,-1,457,-2,457,-1,457,-2,457,-2,457,-2,457,-1,457,457,457,457,457,457,457,457,457,457,457,457,-1,457,-2,457,457,457,457,457,457,457,-4,457,457,-2,457,-2,457,-1,457,-5,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,457,-1,457,457,457,-20,457,457,457,457,457,-12,457,457,457,457,457,457,457,457,457],[-4,0,-4,0,-12,458,-1,459],[460,460,460,-1,0,-4,0,-6,460,460,460,-2,460,460,-1,460,-17,460,460,460,-1,460,-1,460,-5,460,460,-1,460,460,-3,460,460,460,-1,460,-2,460,-1,460,-2,460,-2,460,-2,460,-1,460,460,460,460,460,460,460,460,460,460,460,460,-1,460,-2,460,460,460,460,-1,460,460,-4,460,460,-2,460,-2,460,-1,460,-5,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,-1,460,460,460,-20,460,460,460,460,460,-12,460,460,460,460,460,460,460,460,460],[461,461,461,-1,0,-4,0,-6,461,461,461,-2,461,461,-1,461,-17,461,461,-2,461,-1,461,-5,461,461,-1,461,461,-3,461,461,-5,461,-1,461,-2,461,-2,461,-2,461,-1,461,461,461,461,461,-1,461,461,461,461,461,461,-1,461,-2,461,461,461,461,-1,461,461,-4,461,461,-2,461,-2,461,-1,461,-15,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,-1,461,461,461,-20,461,461,461,461,461,-12,461,461,461,461,461,461,-1,461,461],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,462,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[463,463,463,-1,0,-4,0,-5,463,463,-1,463,-2,463,-32,463,-7,463,-6,463,-4,463,-2,463,463,-1,463,463,463,463,463,463,463,-1,463,463,463,463,463,463,463,463,-2,463,463,463,463,-1,463,463,-4,463,463,-2,463,-2,463,-1,463,-27,463,-1,463,463,463,463,463,463,-1,463,463,463,-20,463,463,463,463,463,-12,463,463,463,463,463,463,-1,463,463],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,-2,27,-1,164,-5,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-14,464,-44,465],[-4,0,-4,0,-14,466,-44,466],[-4,0,-4,0,-14,467,-19,468,-24,467],[-4,0,-4,0,-34,468],[-4,0,-4,0,-11,183,183,-1,183,-19,183,-3,183,-14,183,-5,183,-17,183,-17,183,-12,183,-59,183],[-4,0,-4,0,-12,469,-1,469,-19,469,-3,469,-14,469,-23,469,-30,469],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-37,470,-5,471,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-2,2,-1,0,-4,0,-14,254,-37,286,472,-10,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-74,474],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,475,-4,9,-7,476,-3,16,-12,25,26,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-11,477],[-4,0,-4,0,-59,478],[479,479,479,-1,0,-4,0,-5,479,479,-1,479,-2,479,-32,479,-7,479,-6,479,-4,479,-2,479,479,-1,479,479,479,479,479,479,479,-1,479,479,479,479,479,479,479,479,-2,479,479,479,479,-1,479,479,-4,479,479,-2,479,-2,479,-1,479,-27,479,-1,479,479,479,479,479,479,-1,479,479,479,-20,479,479,479,479,479,-12,479,479,479,479,479,479,-1,479,479],[-4,0,-4,0,-59,182],[-4,0,-4,0,-59,480],[481,481,481,-1,0,-4,0,-5,481,481,-1,481,-2,481,-32,481,-7,481,-6,481,-4,481,-2,481,481,-1,481,481,481,481,481,481,481,-1,481,481,481,481,481,481,481,481,-2,481,481,481,481,-1,481,481,-4,481,481,-2,481,-2,481,-1,481,-27,481,-1,481,481,481,481,481,481,-1,481,481,481,-20,481,481,481,481,481,-12,481,481,481,481,481,481,-1,481,481],[-4,0,-4,0,-59,482],[483,483,483,-1,0,-4,0,-5,483,483,-1,483,-2,483,-32,483,-7,483,-6,483,-4,483,-2,483,483,-1,483,483,483,483,483,483,483,-1,483,483,483,483,483,483,483,483,-2,483,483,483,483,-1,483,483,-4,483,483,-2,483,-2,483,-1,483,-27,483,-1,483,483,483,483,483,483,-1,483,483,483,-20,483,483,483,483,483,-12,483,483,483,483,483,483,-1,483,483],[-4,0,-4,0,-59,484],[-4,0,-4,0,-86,485,486],[487,487,487,-1,0,-4,0,-5,487,487,-1,487,-2,487,-32,487,-7,487,-6,487,-4,487,-2,487,487,-1,487,487,487,487,487,487,487,-1,487,487,487,487,487,487,487,487,-2,487,487,487,487,-1,487,487,-4,487,487,-2,487,-2,487,-1,487,-27,487,-1,487,487,487,487,487,487,-1,487,487,487,-20,487,487,487,487,487,-12,487,487,487,487,487,487,-1,487,487],[-4,0,-4,0,-95,301,-72,302],[488,488,488,-1,0,-4,0,-5,488,488,-1,488,-2,488,-32,488,-7,488,-6,488,-4,488,-2,488,488,-1,488,-1,488,488,488,488,488,-1,488,488,488,488,488,488,488,488,-2,488,488,488,488,-1,488,488,-4,488,488,-2,488,-2,488,-1,488,-27,488,-1,488,488,488,488,488,488,-1,488,488,488,-20,488,488,488,488,488,-12,488,488,488,488,488,488,-1,488,488],[-4,0,-4,0,-168,489],[-1,1,2,-1,0,-4,0,-52,360,-6,490,-4,9,-28,361,-2,491,362,363,-9,492,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-40,7,-11,9,-26,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,175,-8,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-2,56],[-4,0,-4,0,-11,493],[-2,2,-1,0,-4,0,-12,494,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-14,495,-44,496],[-4,0,-4,0,-14,497,-44,497],[-2,63,-1,0,-4,0,-7,498,-137,499,311,312],[-4,0,-4,0,-7,500],[-4,0,-4,0,-5,501,-2,502,-184,502],[-2,503,-1,0,-4,0,-7,503,-137,503,503,503],[-2,504,-1,0,-4,0,-7,504,-26,505,-110,504,504,504],[-2,63,-1,0,-4,0,-146,506],[-2,63,-1,0,-4,0,-147,507],[-2,508,-1,0,-4,0,-7,508,-26,508,-110,508,508,508],[-2,63,-1,0,-4,0,-7,509,-137,510,311,312],[-1,327,328,-1,329,330,331,332,333,0,-4,334,511,-2,512,-2,513,-129,514,-51,56],[-4,0,-4,0,-7,515],[-2,63,-1,0,-4,0,-7,516,-137,517,311,312],[518,518,518,-1,518,518,518,518,518,0,-4,518,519,518,518,518,-2,518,518,-1,518,-17,518,518,518,-1,518,-1,518,-5,518,518,-1,518,518,-3,518,518,518,-1,518,-2,518,-1,518,-2,518,-2,518,-2,518,-1,518,518,518,518,518,518,518,518,518,518,518,518,-1,518,-2,518,518,518,518,-1,518,518,-4,518,518,-2,518,-2,518,-1,518,-5,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,518,-1,518,518,518,-20,518,518,518,518,518,-12,518,518,518,518,518,518,518,518,518],[-4,0,-4,0,-7,520],[-2,318,-1,319,-4,320,-7,521,-26,521,-26,322,-2,323,-71,324,-8,521,521,521],[-2,522,-1,0,-4,0,-7,522,-26,522,-110,522,522,522],[-2,523,-1,523,-4,523,-7,523,-26,523,-26,523,-2,523,-71,523,-8,523,523,523],[-2,524,-1,524,-4,524,-7,524,-26,524,-26,524,-2,524,-71,524,-8,524,524,524],[-2,525,-1,0,-4,0,-7,525,-26,525,-110,525,525,525],[-1,327,328,-1,329,330,331,332,333,0,-4,334,-138,526],[-1,527,527,-1,527,527,527,527,527,0,-4,527,-138,527],[-1,528,528,-1,528,528,528,528,528,0,-4,528,-138,528],[-1,529,529,-1,529,529,529,529,529,0,-4,529,529,-2,529,-2,529,-129,529,-1,529,-49,529],[-4,0,-4,0,-59,530],[-4,0,-4,0,-146,42,43],[531,531,531,-1,0,-4,0,-6,531,-1,531,-2,531,-32,531,-7,531,-6,531,-4,531,-2,531,-2,531,-1,531,531,531,531,531,-1,531,531,531,531,531,531,-1,531,-2,531,531,531,531,-1,531,531,-4,531,531,-2,531,-2,531,-29,531,-1,531,531,531,531,531,531,-1,531,531,531,-20,531,531,531,531,531,-12,531,531,531,531,531,531,-1,531,531],[-4,0,-4,0,-47,94,-120,95],[-4,0,-4,0,-14,532,-93,533],[-4,0,-4,0,-108,534],[-4,0,-4,0,-22,535],[-4,0,-4,0,-14,536,-93,536],[-4,0,-4,0,-14,537,-93,537],[-4,0,-4,0,-14,538,-93,538],[-4,0,-4,0,-14,341,-51,539,-41,341],[-4,0,-4,0,-59,540],[-4,0,-4,0,-59,541],[542,542,542,-1,0,-4,0,-6,542,-1,542,-2,542,-32,542,-7,542,-6,542,-4,542,-2,542,-2,542,-1,542,542,542,542,542,-1,542,542,542,542,542,542,-1,542,-2,542,542,542,542,-1,542,542,-4,542,542,-2,542,-2,542,-29,542,-1,542,542,542,542,542,542,-1,542,542,542,-20,542,542,542,542,542,-12,542,542,542,542,542,542,-1,542,542],[543,543,543,-1,0,-4,0,-6,543,-1,543,-2,543,-32,543,-7,543,-6,543,-4,543,-2,543,-2,543,-1,543,543,543,543,543,-1,543,543,543,543,543,543,-1,543,-2,543,543,543,543,-1,543,543,-4,543,543,-2,543,-2,543,-29,543,-1,543,543,543,543,543,543,-1,543,543,543,-20,543,543,543,543,543,-12,543,543,543,543,543,543,-1,543,543],[-4,0,-4,0,-14,544,-93,545],[-4,0,-4,0,-108,546],[-4,0,-4,0,-22,547,-36,547],[-4,0,-4,0,-14,548,-93,548],[-4,0,-4,0,-14,549,-93,549],[-4,0,-4,0,-14,550,-51,551,-41,550],[552,552,552,-1,0,-4,0,-5,552,552,-1,552,-2,552,-32,552,-7,552,-6,552,-4,552,-2,552,552,-1,552,552,552,552,552,552,552,-1,552,552,552,552,552,552,552,552,552,552,552,552,552,552,-1,552,552,-4,552,552,-2,552,-2,552,-1,552,-27,552,-1,552,552,552,552,552,552,-1,552,552,552,-20,552,552,552,552,552,-12,552,552,552,552,552,552,-1,552,552],[-1,553,553,-1,0,-4,0,-5,553,-2,553,-2,553,-32,553,-7,553,-6,553,-4,553,-3,553,-1,553,-1,553,553,553,553,553,-1,553,553,553,553,553,553,553,553,-2,553,553,553,553,-1,553,553,-4,553,553,-2,553,-2,553,-1,553,-27,553,-1,553,553,553,553,553,553,-1,553,553,553,-20,553,553,553,553,553,-12,553,553,553,553,553,553,-1,553,553],[-4,0,-4,0,-12,554,-1,554,-38,554,-5,554,-1,554,-46,554],[555,555,555,-1,0,-4,0,-6,555,-1,555,-2,555,555,-1,555,-29,555,-7,555,555,-5,555,-1,555,-2,555,-2,555,-2,555,-1,555,555,555,555,555,-1,555,555,555,555,555,555,-1,555,-2,555,555,555,555,-1,555,555,-4,555,555,-2,555,-2,555,-1,555,-27,555,-1,555,555,555,555,555,555,-1,555,555,555,-20,555,555,555,555,555,-12,555,555,555,555,555,555,-1,555,555],[-4,0,-4,0,-61,556],[557,557,557,-1,0,-4,0,-6,557,-1,557,-2,557,557,-1,557,-29,557,557,-6,557,557,-5,557,-1,557,-2,557,-2,557,-2,557,-1,557,557,557,557,557,-1,557,557,557,557,557,557,-1,557,-2,557,557,557,557,-1,557,557,-4,557,557,-2,557,-2,557,-1,557,-15,557,129,-10,557,-1,557,557,557,557,557,557,-1,557,557,557,-20,557,557,557,557,557,-12,557,557,557,557,557,557,-1,557,557],[558,558,558,-1,0,-4,0,-6,558,-1,558,-2,558,558,-1,558,-29,558,558,-2,131,-3,558,558,-5,558,-1,558,-2,558,-2,558,-2,558,-1,558,558,558,558,558,-1,558,558,558,558,558,558,-1,558,-2,558,558,558,558,-1,558,558,-4,558,558,-2,558,-2,558,-1,558,-15,558,558,-10,558,-1,558,558,558,558,558,558,-1,558,558,558,-20,558,558,558,558,558,-12,558,558,558,558,558,558,-1,558,558],[559,559,559,-1,0,-4,0,-6,559,-1,559,-2,559,559,-1,559,-29,559,559,-2,559,-3,559,559,-5,559,-1,559,-2,559,-2,559,-2,559,-1,559,559,559,559,559,-1,559,559,559,559,559,559,-1,559,-2,559,559,559,559,-1,559,559,-4,559,559,-2,559,-2,559,-1,559,-15,559,559,133,-9,559,-1,559,559,559,559,559,559,-1,559,559,559,-20,559,559,559,559,559,-12,559,559,559,559,559,559,-1,559,559],[560,560,560,-1,0,-4,0,-6,560,-1,560,-2,560,560,-1,560,-29,560,560,-2,560,-3,560,560,-5,560,-1,560,-2,560,-2,560,-2,560,-1,560,560,560,560,560,-1,560,560,560,560,560,560,-1,560,-2,560,560,560,560,-1,560,560,-4,560,560,-2,560,-2,560,-1,560,-15,560,560,560,135,-8,560,-1,560,560,560,560,560,560,-1,560,560,560,-20,560,560,560,560,560,-12,560,560,560,560,560,560,-1,560,560],[561,561,561,-1,0,-4,0,-6,561,-1,561,-2,561,561,-1,561,-29,561,561,-2,561,-3,561,561,-5,561,-1,561,-2,561,-2,561,-2,561,-1,561,561,561,561,561,-1,561,561,561,561,561,561,-1,561,-2,561,561,561,561,-1,561,561,-4,561,561,-2,561,-2,561,-1,561,-15,561,561,561,561,137,138,139,140,-4,561,-1,561,561,561,561,561,561,-1,561,561,561,-20,561,561,561,561,561,-12,561,561,561,561,561,561,-1,561,561],[562,562,562,-1,0,-4,0,-6,562,142,143,-2,562,562,-1,562,-17,144,145,-4,146,-5,562,562,-2,562,-3,562,562,-5,562,-1,562,-2,562,-2,562,-2,562,-1,562,562,562,562,562,-1,562,562,562,562,562,562,-1,562,-2,562,562,562,562,-1,562,562,-4,562,562,-2,562,-2,562,-1,562,-15,562,562,562,562,562,562,562,562,147,-3,562,-1,562,562,562,562,562,562,-1,562,562,562,-20,562,562,562,562,562,-12,562,562,562,562,562,562,-1,562,562],[563,563,563,-1,0,-4,0,-6,563,563,563,-2,563,563,-1,563,-17,563,563,-4,563,-5,563,563,-2,563,-3,563,563,-5,563,-1,563,-2,563,-2,563,-2,563,-1,563,563,563,563,563,-1,563,563,563,563,563,563,-1,563,-2,563,563,563,563,-1,563,563,-4,563,563,-2,563,-2,563,-1,563,-15,563,563,563,563,563,563,563,563,563,149,150,151,563,-1,563,563,563,563,563,563,-1,563,563,563,-20,563,563,563,563,563,-12,563,563,563,563,563,563,-1,563,563],[564,564,564,-1,0,-4,0,-6,564,564,564,-2,564,564,-1,564,-17,564,564,-4,564,-5,564,564,-2,564,-3,564,564,-5,564,-1,564,-2,564,-2,564,-2,564,-1,564,564,564,564,564,-1,564,564,564,564,564,564,-1,564,-2,564,564,564,564,-1,564,564,-4,564,564,-2,564,-2,564,-1,564,-15,564,564,564,564,564,564,564,564,564,149,150,151,564,-1,564,564,564,564,564,564,-1,564,564,564,-20,564,564,564,564,564,-12,564,564,564,564,564,564,-1,564,564],[565,565,565,-1,0,-4,0,-6,565,565,565,-2,565,565,-1,565,-17,565,565,-4,565,-5,565,565,-2,565,-3,565,565,-5,565,-1,565,-2,565,-2,565,-2,565,-1,565,565,565,565,565,-1,565,565,565,565,565,565,-1,565,-2,565,565,565,565,-1,565,565,-4,565,565,-2,565,-2,565,-1,565,-15,565,565,565,565,565,565,565,565,565,149,150,151,565,-1,565,565,565,565,565,565,-1,565,565,565,-20,565,565,565,565,565,-12,565,565,565,565,565,565,-1,565,565],[566,566,566,-1,0,-4,0,-6,566,566,566,-2,566,566,-1,566,-17,566,566,-4,566,-5,566,566,-2,566,-3,566,566,-5,566,-1,566,-2,566,-2,566,-2,566,-1,566,566,566,566,566,-1,566,566,566,566,566,566,-1,566,-2,566,566,566,566,-1,566,566,-4,566,566,-2,566,-2,566,-1,566,-15,566,566,566,566,566,566,566,566,566,566,566,566,153,-1,566,566,566,566,566,566,-1,566,566,566,-20,566,566,566,566,566,-12,566,566,566,566,566,566,-1,154,566],[567,567,567,-1,0,-4,0,-6,567,567,567,-2,567,567,-1,567,-17,567,567,-4,567,-5,567,567,-2,567,-3,567,567,-5,567,-1,567,-2,567,-2,567,-2,567,-1,567,567,567,567,567,-1,567,567,567,567,567,567,-1,567,-2,567,567,567,567,-1,567,567,-4,567,567,-2,567,-2,567,-1,567,-15,567,567,567,567,567,567,567,567,567,567,567,567,153,-1,567,567,567,567,567,567,-1,567,567,567,-20,567,567,567,567,567,-12,567,567,567,567,567,567,-1,154,567],[568,568,568,-1,0,-4,0,-6,568,568,568,-2,568,568,-1,568,-17,568,568,-4,568,-5,568,568,-2,568,-3,568,568,-5,568,-1,568,-2,568,-2,568,-2,568,-1,568,568,568,568,568,-1,568,568,568,568,568,568,-1,568,-2,568,568,568,568,-1,568,568,-4,568,568,-2,568,-2,568,-1,568,-15,568,568,568,568,568,568,568,568,568,568,568,568,153,-1,568,568,568,568,568,568,-1,568,568,568,-20,568,568,568,568,568,-12,568,568,568,568,568,568,-1,154,568],[569,569,569,-1,0,-4,0,-6,569,569,569,-2,569,569,-1,569,-17,569,569,-2,156,-1,569,-5,569,569,-1,157,569,-3,569,569,-5,569,-1,569,-2,569,-2,569,-2,569,-1,569,569,569,569,569,-1,569,569,569,569,569,569,-1,569,-2,569,569,569,569,-1,569,569,-4,569,569,-2,569,-2,569,-1,569,-15,569,569,569,569,569,569,569,569,569,569,569,569,569,-1,569,569,569,569,569,569,-1,158,569,569,-20,569,569,569,569,569,-12,569,569,569,569,569,569,-1,569,569],[570,570,570,-1,0,-4,0,-6,570,570,570,-2,570,570,-1,570,-17,570,570,-2,156,-1,570,-5,570,570,-1,157,570,-3,570,570,-5,570,-1,570,-2,570,-2,570,-2,570,-1,570,570,570,570,570,-1,570,570,570,570,570,570,-1,570,-2,570,570,570,570,-1,570,570,-4,570,570,-2,570,-2,570,-1,570,-15,570,570,570,570,570,570,570,570,570,570,570,570,570,-1,570,570,570,570,570,570,-1,158,570,570,-20,570,570,570,570,570,-12,570,570,570,570,570,570,-1,570,570],[571,571,571,-1,0,-4,0,-6,571,571,571,-2,571,571,-1,571,-17,571,571,-2,571,-1,571,-5,571,571,-1,571,571,-3,571,571,-5,571,-1,571,-2,571,-2,571,-2,571,-1,571,571,571,571,571,-1,571,571,571,571,571,571,-1,571,-2,571,571,571,571,-1,571,571,-4,571,571,-2,571,-2,571,-1,571,-15,571,571,571,571,571,571,571,571,571,571,571,571,571,-1,571,571,571,571,571,571,-1,571,571,571,-20,571,571,571,571,571,-12,571,571,571,571,571,571,-1,571,571],[572,572,572,-1,0,-4,0,-6,572,572,572,-2,572,572,-1,572,-17,572,572,-2,572,-1,572,-5,572,572,-1,572,572,-3,572,572,-5,572,-1,572,-2,572,-2,572,-2,572,-1,572,572,572,572,572,-1,572,572,572,572,572,572,-1,572,-2,572,572,572,572,-1,572,572,-4,572,572,-2,572,-2,572,-1,572,-15,572,572,572,572,572,572,572,572,572,572,572,572,572,-1,572,572,572,572,572,572,-1,572,572,572,-20,572,572,572,572,572,-12,572,572,572,572,572,572,-1,572,572],[573,573,573,-1,0,-4,0,-6,573,573,573,-2,573,573,-1,573,-17,573,573,-2,573,-1,573,-5,573,573,-1,573,573,-3,573,573,-5,573,-1,573,-2,573,-2,573,-2,573,-1,573,573,573,573,573,-1,573,573,573,573,573,573,-1,573,-2,573,573,573,573,-1,573,573,-4,573,573,-2,573,-2,573,-1,573,-15,573,573,573,573,573,573,573,573,573,573,573,573,573,-1,573,573,573,573,573,573,-1,573,573,573,-20,573,573,573,573,573,-12,573,573,573,573,573,573,-1,573,573],[574,574,574,-1,0,-4,0,-6,574,574,574,-2,574,574,-1,574,-17,574,574,-2,574,-1,574,-5,574,574,-1,574,574,-3,574,574,-5,574,-1,574,-2,574,-2,574,-2,574,-1,574,574,574,574,574,-1,574,574,574,574,574,574,-1,574,-2,574,574,574,574,-1,574,574,-4,574,574,-2,574,-2,574,-1,574,-15,574,574,574,574,574,574,574,574,574,574,574,574,574,-1,574,574,574,574,574,574,-1,574,574,574,-20,574,574,574,574,574,-12,574,574,574,574,574,574,-1,574,574],[-4,0,-4,0,-14,575,-93,576],[-4,0,-4,0,-108,577],[578,578,578,-1,0,-4,0,-6,578,578,578,-2,578,578,-1,578,-17,578,578,578,-1,578,-1,578,-5,578,578,-1,578,578,-3,578,578,578,-1,578,-2,578,-1,578,-2,578,-2,578,-2,578,-1,578,578,578,578,578,578,578,578,578,578,578,578,-1,578,-2,578,578,578,578,-1,578,578,-4,578,578,-2,578,-2,578,-1,578,-5,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,578,-1,578,578,578,-20,578,578,578,578,578,-12,578,578,578,578,578,578,578,578,578],[-4,0,-4,0,-14,579,-93,579],[-4,0,-4,0,-14,580,-93,580],[-4,0,-4,0,-14,580,-19,468,-73,580],[-4,0,-4,0,-11,581,-49,582],[-4,0,-4,0,-11,583,-2,184,-19,184,-26,583,-46,184],[-1,584,584,-1,0,-4,0,-14,584,-37,584,-6,584,-4,584,-28,584,-2,584,584,584,-9,584,-27,584,-9,584,584,-24,584,-12,584,584,584,584,584,584],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-71,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-4,0,-4,0,-11,585,-49,585],[-4,0,-4,0,-11,583,-49,583],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-28,586,-42,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-4,0,-4,0,-11,587],[-2,2,-1,0,-4,0,-12,588,-39,286,-11,9,-37,473,-65,287,-3,48],[589,589,589,-1,0,-4,0,-6,589,589,589,-2,589,589,-1,589,-17,589,589,589,-1,589,-1,589,-5,589,589,-1,589,589,-3,589,589,589,-1,589,-2,589,-1,589,-2,589,-2,589,-2,589,-1,589,589,589,589,589,589,589,589,589,589,589,589,-1,589,-2,589,589,589,589,-1,589,589,-4,589,589,-2,589,-2,589,-1,589,-5,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,589,-1,589,589,589,-20,589,589,589,589,589,-12,589,589,589,589,589,589,589,589,589],[-4,0,-4,0,-91,367],[590,590,590,-1,0,-4,0,-6,590,590,590,-2,590,590,-1,590,-17,590,590,590,-1,590,-1,590,-5,590,590,-1,590,590,-3,590,590,590,-1,590,-2,590,-1,590,-2,590,-2,590,-2,590,-1,590,590,590,590,590,590,590,590,590,590,590,590,-1,590,-2,590,590,590,590,-1,590,590,-4,590,590,-2,590,-2,590,-1,590,-5,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,590,-1,590,590,590,-20,590,590,590,590,590,-12,590,590,590,590,590,590,590,590,590],[-4,0,-4,0,-11,591],[592,592,592,-1,592,-4,592,-6,592,592,592,-2,592,592,-1,592,-17,592,592,592,-1,592,-1,592,-5,592,592,-1,592,592,-3,592,592,592,-1,592,-2,592,-1,592,-2,592,-2,592,-2,592,-1,592,592,592,592,592,592,592,592,592,592,592,592,-1,592,-2,592,592,592,592,-1,592,592,-4,592,592,-2,592,-2,592,-1,592,-5,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,592,-1,592,592,592,-20,592,592,592,592,592,-4,592,-7,592,592,592,592,592,592,592,592,592],[593,593,593,-1,0,-4,0,-6,593,593,593,-2,593,593,-1,593,-17,593,593,593,-1,593,-1,593,-5,593,593,-1,593,593,-3,593,593,593,-1,593,-2,593,-1,593,-2,593,-2,593,-2,593,-1,593,593,593,593,593,593,593,593,593,593,593,593,-1,593,-2,593,593,593,593,-1,593,593,-4,593,593,-2,593,-2,593,-1,593,-5,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,593,-1,593,593,593,-20,593,593,593,593,593,-12,593,593,593,593,593,593,593,593,593],[-4,0,-4,0,-53,594],[-4,0,-4,0,-12,595,-1,596],[-4,0,-4,0,-12,597],[598,598,598,-1,0,-4,0,-6,598,598,598,-2,598,598,-1,598,-17,598,598,598,-1,598,-1,598,-5,598,598,-1,598,598,-3,598,598,598,-1,598,-2,598,-1,598,-2,598,-2,598,-2,598,-1,598,598,598,598,598,598,598,598,598,598,598,598,-1,598,-2,598,598,598,598,-1,598,598,-4,598,598,-2,598,-2,598,-1,598,-5,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,598,-1,598,598,598,-20,598,598,598,598,598,-12,598,598,598,598,598,598,598,598,598],[-4,0,-4,0,-12,599,-1,600],[-4,0,-4,0,-12,601,-1,601],[-4,0,-4,0,-12,602,-1,602],[-4,0,-4,0,-53,603],[604,604,604,-1,0,-4,0,-6,604,604,604,-2,604,604,-1,604,-17,604,604,604,-1,604,-1,604,-5,604,604,-1,604,604,-3,604,604,604,-1,604,-2,604,-1,604,-2,604,-2,604,-2,604,-1,604,604,604,604,604,604,604,604,604,604,604,604,-1,604,-2,604,604,604,604,-1,604,604,-4,604,604,-2,604,-2,604,-1,604,-5,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,604,-1,604,604,604,-20,604,604,604,604,604,-12,604,604,604,604,604,604,604,604,604],[605,605,605,-1,0,-4,0,-6,605,605,605,-2,605,605,-1,605,-17,605,605,605,-1,605,-1,605,-5,605,605,-1,605,605,-3,605,605,605,-1,605,-2,605,-1,605,-2,605,-2,605,-2,605,-1,605,605,605,605,605,605,605,605,605,605,605,605,-1,605,-2,605,605,605,605,-1,605,605,-4,605,605,-2,605,-2,605,-1,605,-5,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,605,-1,605,605,605,-20,605,605,605,605,605,-12,605,605,605,605,605,605,605,605,605],[606,606,606,-1,0,-4,0,-6,606,606,606,-2,606,606,-1,606,-17,606,606,606,-1,606,-1,606,-5,606,606,-1,606,606,-3,606,606,606,-1,606,-2,606,-1,606,-2,606,-2,606,-2,606,-1,606,606,606,606,606,606,606,606,606,606,606,606,-1,606,-2,606,606,606,606,-1,606,606,-4,606,606,-2,606,-2,606,-1,606,-5,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,606,-1,606,606,606,-20,606,606,606,606,606,-12,606,606,606,606,606,606,606,606,606],[607,607,607,-1,0,-4,0,-6,607,607,607,-2,607,607,-1,607,-7,607,-9,607,607,607,-1,607,-1,607,-5,607,607,-1,607,607,-3,607,607,607,-1,607,-2,607,-1,607,-2,607,-1,607,607,-2,607,-1,607,607,607,607,607,607,607,607,607,607,607,607,-1,607,-2,607,607,607,607,607,607,607,607,-3,607,607,-2,607,-2,607,-1,607,-5,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,607,-1,607,607,607,-20,607,607,607,607,607,-12,607,607,607,607,607,607,607,607,607],[608,608,608,-1,608,-4,608,-4,608,-1,608,608,608,-2,608,608,-1,608,-7,608,-9,608,608,608,-1,608,-1,608,-5,608,608,-1,608,608,-3,608,608,608,-1,608,-2,608,-1,608,-2,608,-1,608,608,-2,608,-1,608,608,608,608,608,608,608,608,608,608,608,608,-1,608,-2,608,608,608,608,608,608,608,608,-3,608,608,-2,608,-2,608,-1,608,-5,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,-1,608,608,608,-20,608,608,608,608,608,-12,608,608,608,608,608,608,608,608,608],[609,609,609,-1,0,-4,0,-6,609,609,609,-2,609,609,-1,609,-17,609,609,609,-1,609,-1,609,-5,609,609,-1,609,609,-3,609,609,609,-1,609,-2,609,-1,609,-2,609,-2,609,-2,609,-1,609,609,609,609,609,609,609,609,609,609,609,609,-1,609,-2,609,609,609,609,-1,609,609,-4,609,609,-2,609,-2,609,-1,609,-5,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,609,-1,609,609,609,-20,609,609,609,609,609,-12,609,609,609,609,609,609,609,609,609],[-1,610,610,-1,610,610,610,610,610,0,-144,610,-1,610,610],[-1,611,611,-1,611,611,611,611,611,0,-144,611,-1,611,611],[-1,612,612,-1,612,612,612,612,612,0,-144,612,-1,612,612],[-1,1,612,-1,612,612,612,612,612,0,-144,612,-1,612,612,-25,241,242,243,244,245,246,247,248,249,250,251,252],[-1,1,612,-1,612,612,612,612,612,0,-144,612,-1,612,612,-20,613,-4,241,242,243,244,245,246,247,248,249,250,251,252],[-1,614,614,-1,614,614,614,614,614,0,-144,614,-1,614,614],[615,615,615,-1,223,-4,224,-6,615,615,615,-2,615,615,-1,615,-17,615,615,615,-1,615,-1,615,-5,615,615,-1,615,615,-3,615,615,615,-1,615,-2,615,-1,615,-2,615,-2,615,-2,615,-1,615,615,615,615,615,615,615,615,615,615,615,615,-1,615,-2,615,615,615,615,-1,615,615,-4,615,615,-2,615,-2,615,-1,615,-5,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,615,-1,615,615,615,-20,615,615,615,615,615,-12,615,615,615,615,615,615,615,615,615],[616,616,616,-1,0,-4,0,-6,616,616,616,-2,616,616,-1,616,-17,616,616,616,-1,616,-1,616,-5,616,616,-1,616,616,-3,616,616,616,-1,616,-2,616,-1,616,-2,616,-2,616,-2,616,-1,616,616,616,616,616,616,616,616,616,616,616,616,-1,616,-2,616,616,616,616,-1,616,616,-4,616,616,-2,616,-2,616,-1,616,-5,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,616,-1,616,616,616,-20,616,616,616,616,616,-12,616,616,616,616,616,616,616,616,616],[617,617,617,-1,617,-4,617,-6,617,617,617,-2,617,617,-1,617,-17,617,617,617,-1,617,-1,617,-5,617,617,-1,617,617,-3,617,617,617,-1,617,-2,617,-1,617,-2,617,-2,617,-2,617,-1,617,617,617,617,617,617,617,617,617,617,617,617,-1,617,-2,617,617,617,617,-1,617,617,-4,617,617,-2,617,-2,617,-1,617,-5,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,617,-1,617,617,617,-20,617,617,617,617,617,-4,617,-7,617,617,617,617,617,617,617,617,617],[618,618,618,-1,618,-4,618,-6,618,618,618,-2,618,618,-1,618,-17,618,618,618,-1,618,-1,618,-5,618,618,-1,618,618,-3,618,618,618,-1,618,-2,618,-1,618,-2,618,-2,618,-2,618,-1,618,618,618,618,618,618,618,618,618,618,618,618,-1,618,-2,618,618,618,618,-1,618,618,-4,618,618,-2,618,-2,618,-1,618,-5,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,618,-1,618,618,618,-20,618,618,618,618,618,-12,618,618,618,618,618,618,618,618,618],[-1,619,-2,0,-4,0],[620,620,620,-1,0,-4,0,-6,620,620,620,-2,620,620,-1,620,-17,620,620,620,-1,620,-1,620,-5,620,620,-1,620,620,-3,620,620,620,-1,620,-2,620,-1,620,-2,620,-2,620,-2,620,-1,620,620,620,620,620,620,620,620,620,620,620,620,-1,620,-2,620,620,620,620,-1,620,620,-4,620,620,-2,620,-2,620,-1,620,-5,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,620,-1,620,620,620,-20,620,620,620,620,620,-12,620,620,620,620,620,620,620,620,620],[621,621,621,-1,621,-4,621,-6,621,621,621,-2,621,621,-1,621,-17,621,621,621,-1,621,-1,621,-5,621,621,-1,621,621,-3,621,621,621,-1,621,-2,621,-1,621,-2,621,-2,621,-2,621,-1,621,621,621,621,621,621,621,621,621,621,621,621,-1,621,-2,621,621,621,621,-1,621,621,-4,621,621,-2,621,-2,621,-1,621,-5,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,621,-1,621,621,621,-8,621,621,621,621,621,621,621,621,-4,621,621,621,621,621,-12,621,621,621,621,621,621,621,621,621],[622,622,622,-1,0,-4,0,-6,622,622,622,-2,622,622,-1,622,-17,622,622,622,-1,622,-1,622,-5,622,622,-1,622,622,-3,622,622,622,-1,622,-2,622,-1,622,-2,622,-2,622,-2,622,-1,622,622,622,622,622,622,622,622,622,622,622,622,-1,622,-2,622,622,622,622,-1,622,622,-4,622,622,-2,622,-2,622,-1,622,-5,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,622,-1,622,622,622,-20,622,622,622,622,622,-12,622,622,622,622,622,622,622,622,622],[623,623,623,-1,623,-4,623,-6,623,623,623,-2,623,623,-1,623,-17,623,623,623,-1,623,-1,623,-5,623,623,-1,623,623,-3,623,623,623,-1,623,-2,623,-1,623,-2,623,-2,623,-2,623,-1,623,623,623,623,623,623,623,623,623,623,623,623,-1,623,-2,623,623,623,623,-1,623,623,-4,623,623,-2,623,-2,623,-1,623,-5,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,623,-1,623,623,623,-8,623,623,-10,623,623,623,623,623,-12,623,623,623,623,623,623,623,623,623],[624,624,624,-1,0,-4,0,-6,624,624,624,-2,624,624,-1,624,-17,624,624,624,-1,624,-1,624,-5,624,624,-1,624,624,-3,624,624,624,-1,624,-2,624,-1,624,-2,624,-2,624,-2,624,-1,624,624,624,624,624,624,624,624,624,624,624,624,-1,624,-2,624,624,624,624,-1,624,624,-4,624,624,-2,624,-2,624,-1,624,-5,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,624,-1,624,624,624,-20,624,624,624,624,624,-12,624,624,624,624,624,624,624,624,624],[625,625,625,-1,625,-4,625,-6,625,625,625,-2,625,625,-1,625,-17,625,625,625,-1,625,-1,625,-5,625,625,-1,625,625,-3,625,625,625,-1,625,-2,625,-1,625,-2,625,-2,625,-2,625,-1,625,625,625,625,625,625,625,625,625,625,625,625,-1,625,-2,625,625,625,625,-1,625,625,-4,625,625,-2,625,-2,625,-1,625,-5,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,-1,625,625,625,-20,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625,625],[-4,0,-4,0,-14,438,-38,626],[627,627,627,-1,0,-4,0,-6,627,627,627,-2,627,627,-1,627,-17,627,627,627,-1,627,-1,627,-5,627,627,-1,627,627,-3,627,627,627,-1,627,-2,627,-1,627,-2,627,-2,627,-2,627,-1,627,627,627,627,627,627,627,627,627,627,627,627,-1,627,-2,627,627,627,627,-1,627,627,-4,627,627,-2,627,-2,627,-1,627,-5,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,627,-1,627,627,627,-20,627,627,627,627,627,-12,627,627,627,627,627,627,627,627,627],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-2,254,-29,6,-7,7,442,-10,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,256,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[628,628,628,-1,0,-4,0,-6,628,628,628,-2,628,628,-1,628,-17,628,628,628,-1,628,-1,628,-5,628,628,-1,628,628,-3,628,628,628,-1,628,-2,628,-1,628,-2,628,-2,628,-2,628,-1,628,628,628,628,628,628,628,628,628,628,628,628,-1,628,-2,628,628,628,628,-1,628,628,-4,628,628,-2,628,-2,628,-1,628,-5,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,628,-1,628,628,628,-20,628,628,628,628,628,-12,628,628,628,628,628,628,628,628,628],[-4,0,-4,0,-14,629,-38,629],[-1,630,630,-1,0,-4,0,-8,630,-2,630,-2,630,-29,630,-7,630,630,-10,630,-11,630,-14,630,-1,630,630,-4,630,630,-1,630,630,-2,630,-29,630,-1,630,630,630,630,630,630,-1,630,630,630,-20,630,630,630,630,630,-12,630,630,630,630,630,630,-1,630,630],[-4,0,-4,0,-14,631,-38,631],[-4,0,-4,0,-11,632],[-2,2,-1,0,-4,0,-12,633,-39,286,-11,9,-37,473,-65,287,-3,48],[634,634,2,-1,0,-4,0,-6,634,634,634,-2,634,634,-1,634,-17,634,634,634,-1,634,-1,634,-5,634,634,-1,634,634,-3,634,634,634,-1,634,-2,634,-1,634,-2,9,-2,634,-2,634,-1,634,634,634,634,634,634,634,634,634,634,634,634,-1,634,-2,634,634,634,634,-1,634,634,-4,634,634,-2,634,-2,634,-1,634,-5,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,-1,634,634,634,-20,634,634,634,634,48,-12,634,634,634,634,634,634,634,634,634],[-4,0,-4,0,-3,635,-140,635,635],[634,634,634,-1,0,-4,0,-6,634,634,634,-2,634,634,-1,634,-17,634,634,634,-1,634,-1,634,-5,634,634,-1,634,634,-3,634,634,634,-1,634,-2,634,-1,634,-2,634,-2,634,-2,634,-1,634,634,634,634,634,634,634,634,634,634,634,634,-1,634,-2,634,634,634,634,-1,634,634,-4,634,634,-2,634,-2,634,-1,634,-5,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,634,-1,634,634,634,-20,634,634,634,634,634,-12,634,634,634,634,634,634,634,634,634],[636,636,636,-1,0,-4,0,-6,636,636,636,-2,636,636,-1,636,-17,636,636,636,-1,636,-1,636,-5,636,636,-1,636,636,-3,636,636,636,-1,636,-2,636,-1,636,-2,636,-2,636,-2,636,-1,636,636,636,636,636,636,636,636,636,636,636,636,-1,636,-2,636,636,636,636,-1,636,636,-4,636,636,-2,636,-2,636,-1,636,-5,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,636,-1,636,636,636,-20,636,636,636,636,636,-12,636,636,636,636,636,636,636,636,636],[-4,0,-4,0,-3,637,-140,637,637],[638,638,638,-1,0,-4,0,-6,638,638,638,-2,638,638,-1,638,-17,638,638,638,-1,638,-1,638,-5,638,638,-1,638,638,-3,638,638,638,-1,638,-2,638,-1,638,-2,638,-2,638,-2,638,-1,638,638,638,638,638,638,638,638,638,638,638,638,-1,638,-2,638,638,638,638,-1,638,638,-4,638,638,-2,638,-2,638,-1,638,-5,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,638,-1,638,638,638,-20,638,638,638,638,638,-12,638,638,638,638,638,638,638,638,638],[-1,639,639,-1,0,-4,0,-8,639,-2,639,-32,639,-7,639,-11,639,-11,639,-14,639,-1,639,639,-4,639,639,-2,639,-2,639,-29,639,-1,639,639,639,639,639,639,-1,639,639,639,-20,639,639,639,639,639,-12,639,639,639,639,639,639,-1,639,639],[-1,640,640,640,640,640,640,640,640,640,-3,640,640,-101,640,640,-38,640,640],[641,641,641,-1,0,-4,0,-6,641,641,641,-2,641,641,-1,641,-17,641,641,641,-1,641,-1,641,-5,641,641,-1,641,641,-3,641,641,641,-1,641,-2,641,-1,641,-2,641,-2,641,-2,641,-1,641,641,641,641,641,641,641,641,641,641,641,641,-1,641,-2,641,641,641,641,-1,641,641,-4,641,641,-2,641,-2,641,-1,641,-5,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,641,-1,641,641,641,-20,641,641,641,641,641,-12,641,641,641,641,641,641,641,641,641],[642,642,642,-1,0,-4,0,-6,642,642,642,-2,642,642,-1,642,-17,642,642,642,-1,642,-1,642,-5,642,642,-1,642,642,-3,642,642,642,-1,642,-2,642,-1,642,-2,642,-2,642,-2,642,-1,642,642,642,642,642,642,642,642,642,642,642,642,-1,642,-2,642,642,642,642,-1,642,642,-4,642,642,-2,642,-2,642,-1,642,-5,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,642,-1,642,642,642,-20,642,642,642,642,642,-12,642,642,642,642,642,642,642,642,642],[-1,262,263,264,265,266,267,268,269,270,-3,271,272,-101,643,644,-38,275,276],[645,645,645,-1,0,-4,0,-6,645,645,645,-2,645,645,-1,645,-17,645,645,645,-1,645,-1,645,-5,645,645,-1,645,645,-3,645,645,645,-1,645,-2,645,-1,645,-2,645,-2,645,-2,645,-1,645,645,645,645,645,645,645,645,645,645,645,645,-1,645,-2,645,645,645,645,645,645,645,-4,645,645,-2,645,-2,645,-1,645,-5,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,645,-1,645,645,645,-20,645,645,645,645,645,-12,645,645,645,645,645,645,645,645,645],[-4,0,-4,0,-12,646,-89,647],[-4,0,-4,0,-12,648],[-4,0,-4,0,-12,649],[650,650,650,-1,0,-4,0,-6,650,650,650,-2,650,650,-1,650,-17,650,650,650,-1,650,-1,650,-5,650,650,-1,650,650,-3,650,650,650,-1,650,-2,650,-1,650,-2,650,-2,650,-2,650,-1,650,650,650,650,650,650,650,650,650,650,650,650,-1,650,-2,650,650,650,650,-1,650,650,-4,650,650,-2,650,-2,650,-1,650,-5,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,650,-1,650,650,650,-20,650,650,650,650,650,-12,650,650,650,650,650,650,650,650,650],[-4,0,-4,0,-53,651],[652,652,652,-1,0,-4,0,-6,652,-1,652,-2,652,652,-1,652,-29,652,-7,652,652,-5,652,-1,652,-2,652,-2,652,-2,652,-1,652,652,652,652,652,-1,652,652,652,652,652,652,-1,652,-2,652,652,652,652,-1,652,652,-4,652,652,-2,652,-2,652,-1,652,-27,652,-1,652,652,652,652,652,652,-1,652,652,652,-20,652,652,652,652,652,-12,652,652,652,652,652,652,-1,652,652],[653,653,653,-1,0,-4,0,-6,653,-1,653,-2,653,653,-1,653,-29,653,-7,653,653,-5,653,-1,653,-2,653,-2,653,-2,653,-1,653,653,653,653,653,-1,653,653,653,653,653,653,-1,653,-2,653,653,653,653,-1,653,653,-4,653,653,-2,653,-2,653,-1,653,-27,653,-1,653,653,653,653,653,653,-1,653,653,653,-20,653,653,653,653,653,-12,653,653,653,653,653,653,-1,653,653],[654,654,654,-1,0,-4,0,-5,654,654,-1,654,-2,654,-32,654,-7,654,-6,654,-4,654,-2,654,654,-1,654,654,654,654,654,654,654,-1,654,654,654,654,654,654,654,654,-2,654,654,654,654,-1,654,654,-4,654,654,-2,654,-2,654,-1,654,-27,654,-1,654,654,654,654,654,654,-1,654,654,654,-20,654,654,654,654,654,-12,654,654,654,654,654,654,-1,654,654],[655,655,655,-1,0,-4,0,-5,655,655,-1,655,-2,655,-32,655,-7,655,-6,655,-4,655,-2,655,655,-1,655,655,655,655,655,655,655,-1,655,655,655,655,655,655,655,655,-2,655,655,655,655,-1,655,655,-4,655,655,-2,655,-2,655,-1,655,-27,655,-1,655,655,655,655,655,655,-1,655,655,655,-20,655,655,655,655,655,-12,655,655,655,655,655,655,-1,655,655],[656,656,656,-1,0,-4,0,-5,656,656,-1,656,-2,656,-32,656,-7,656,-6,656,-4,656,-2,656,656,-1,656,656,656,656,656,656,656,-1,656,656,656,656,656,656,656,656,-2,656,656,656,656,-1,656,656,-4,656,656,-2,656,-2,656,-1,656,-27,656,-1,656,656,656,656,656,656,-1,656,656,656,-20,656,656,656,656,656,-12,656,656,656,656,656,656,-1,656,656],[-4,0,-4,0,-14,657,-44,657],[-4,0,-4,0,-12,658,-1,658,-19,658,-3,658,-14,658,-23,658,-30,658],[-4,0,-4,0,-108,659],[-4,0,-4,0,-14,660,-93,661],[-4,0,-4,0,-14,662,-93,662],[-4,0,-4,0,-14,663,-93,663],[-4,0,-4,0,-61,664],[-4,0,-4,0,-12,665,-1,665,-19,468,-18,665,-54,665],[-4,0,-4,0,-12,666,-1,666,-19,666,-3,666,-14,666,-23,666,-30,666],[-2,2,-1,0,-4,0,-14,438,-37,286,667,-10,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-53,668],[-4,0,-4,0,-14,669,-38,670],[-4,0,-4,0,-14,671,-38,671],[-4,0,-4,0,-14,672,-38,672],[-4,0,-4,0,-12,673,-1,673,-38,673,-54,673],[-4,0,-4,0,-12,673,-1,673,-19,468,-18,673,-54,673],[-4,0,-4,0,-12,674],[-4,0,-4,0,-11,675],[-4,0,-4,0,-12,676],[-4,0,-4,0,-59,677],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,678,-4,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-38,679,-38,680],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,681,-4,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-59,682],[-4,0,-4,0,-7,109,109,-5,109,-17,109,109,110,-1,109,-1,684,-6,109,-1,109,109,-5,111,-1,112,-2,109,-17,683,-36,113,114,115,116,117,118,119,120,121,122,109,109,109,109,109,109,109,109,109,109,109,109,109,109,-4,123,124,-1,109,-46,109],[-4,0,-4,0,-38,683,-38,683],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-40,7,-11,9,-7,685,-16,25,26,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,175,-8,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-2,56],[-4,0,-4,0,-12,686],[687,687,687,-1,0,-4,0,-5,687,687,-1,687,-2,687,-32,687,-7,687,-6,687,-4,687,-2,687,687,-1,687,687,687,687,687,687,687,-1,687,687,687,687,687,687,687,687,-2,687,687,687,687,-1,687,687,-4,687,687,-2,687,-2,687,-1,687,-27,687,-1,687,687,687,687,687,687,-1,687,687,687,-20,687,687,687,687,687,-12,687,687,687,687,687,687,-1,687,687],[688,688,688,-1,0,-4,0,-5,688,688,-1,688,-2,688,-32,688,-7,688,-6,688,-4,688,-2,688,688,-1,688,688,688,688,688,688,688,-1,688,688,688,688,688,688,688,688,-2,688,688,688,688,-1,688,688,-4,688,688,-2,688,-2,688,-1,688,-27,688,-1,688,688,688,688,688,688,-1,688,688,688,-20,688,688,688,688,688,-12,688,688,688,688,688,688,-1,688,688],[689,689,689,-1,0,-4,0,-5,689,689,-1,689,-2,689,-32,689,-7,689,-6,689,-4,689,-2,689,689,-1,689,689,689,689,689,689,689,-1,689,689,689,689,689,689,689,689,-2,689,689,689,689,-1,689,689,-4,689,689,-2,689,-2,689,-1,689,-27,689,-1,689,689,689,689,689,689,-1,689,689,689,-20,689,689,689,689,689,-12,689,689,689,689,689,689,-1,689,689],[-4,0,-4,0,-12,690],[691,691,691,-1,0,-4,0,-5,691,691,-1,691,-2,691,-32,691,-7,691,-6,691,-4,691,-2,691,691,-1,691,691,691,691,691,691,691,-1,691,691,691,691,691,691,691,691,-2,691,691,691,691,-1,691,691,-4,691,691,-2,691,-2,691,-1,691,-27,691,-1,691,691,691,691,691,691,-1,691,691,691,-20,691,691,691,691,691,-12,691,691,691,691,691,691,-1,691,691],[692,692,692,-1,0,-4,0,-5,692,692,-1,692,-2,692,-32,692,-7,692,-6,692,-4,692,-2,692,692,-1,692,692,692,692,692,692,692,-1,692,692,692,692,692,692,692,692,-1,486,692,692,692,692,-1,692,692,-4,692,692,-2,692,-2,692,-1,692,-27,692,-1,692,692,692,692,692,692,-1,692,692,692,-20,692,692,692,692,692,-12,692,692,692,692,692,692,-1,692,692],[693,693,693,-1,0,-4,0,-5,693,693,-1,693,-2,693,-32,693,-7,693,-6,693,-4,693,-2,693,693,-1,693,693,693,693,693,693,693,-1,693,693,693,693,693,693,693,693,-2,693,693,693,693,-1,693,693,-4,693,693,-2,693,-2,693,-1,693,-27,693,-1,693,693,693,693,693,693,-1,693,693,693,-20,693,693,693,693,693,-12,693,693,693,693,693,693,-1,693,693],[-4,0,-4,0,-11,694],[695,695,695,-1,0,-4,0,-5,695,695,-1,695,-2,695,-32,695,-7,695,-6,695,-4,695,-2,695,695,-1,695,-1,695,695,695,695,695,-1,695,695,695,695,695,695,695,695,-2,695,695,695,695,-1,695,695,-4,695,695,-2,695,-2,695,-1,695,-27,695,-1,695,695,695,695,695,695,-1,695,695,695,-20,695,695,695,695,695,-12,695,695,695,695,695,695,-1,695,695],[-1,1,2,-1,0,-4,0,-52,360,-6,490,-4,9,-28,361,-2,491,362,363,-9,696,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-4,0,-4,0,-108,697],[698,698,698,-1,0,-4,0,-5,698,698,698,698,-2,698,698,-1,698,-17,698,698,698,-1,698,-1,698,-5,698,698,-1,698,698,-3,698,698,698,-1,698,-2,698,-1,698,-2,698,-2,698,698,-1,698,-1,698,698,698,698,698,698,698,698,698,698,698,698,698,698,-2,698,698,698,698,-1,698,698,-4,698,698,-2,698,-2,698,-1,698,-5,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,698,-1,698,698,698,-20,698,698,698,698,698,-12,698,698,698,698,698,698,698,698,698],[-1,1,2,-1,0,-4,0,-52,360,-6,490,-4,9,-28,361,-2,491,362,363,-9,699,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-1,700,700,-1,0,-4,0,-52,700,-6,700,-4,700,-28,700,-2,700,700,700,-9,700,-27,700,-9,700,700,-24,700,-12,700,700,700,700,700,700],[-1,701,701,-1,0,-4,0,-52,701,-6,701,-4,701,-28,701,-2,701,701,701,-9,701,-27,701,-9,701,701,-24,701,-12,701,701,701,701,701,701],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-28,361,-3,362,363,-37,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-4,0,-4,0,-11,581],[-4,0,-4,0,-11,583],[-4,0,-4,0,-168,702],[-2,2,-1,0,-4,0,-12,703,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-12,704],[-4,0,-4,0,-168,705],[-4,0,-4,0,-12,706],[-4,0,-4,0,-12,707,-1,708],[-4,0,-4,0,-12,709],[-4,0,-4,0,-12,710,-1,710],[-4,0,-4,0,-12,711,-1,711],[712,712,712,-1,0,-4,0,-5,712,712,-1,712,-2,712,-32,712,-7,712,-6,712,-4,712,-2,712,712,-1,712,-1,712,712,712,712,712,-1,712,712,712,712,712,712,712,712,-2,712,712,712,712,-1,712,712,-4,712,712,-2,712,-2,712,-1,712,-27,712,-1,712,712,712,712,712,712,-1,712,712,712,-20,712,712,712,712,712,-12,712,712,712,712,712,712,-1,712,712],[-4,0,-4,0,-14,713,-44,713],[-4,0,-4,0,-7,714],[-4,0,-4,0,-5,501,-2,715,-184,715],[-2,716,-1,0,-4,0,-7,716,-137,716,716,716],[-4,0,-4,0,-5,501,-2,717,-184,717],[-4,0,-4,0,-8,717,-184,717],[-4,0,-4,0,-6,718],[-1,719,63,-1,0,-4,0,-11,513,-129,514,-4,720,721],[-4,0,-4,0,-146,722],[-2,723,-1,0,-4,0,-7,723,-26,723,-110,723,723,723],[-4,0,-4,0,-147,724],[-1,327,328,-1,329,330,331,332,333,0,-4,334,725,-2,512,-2,513,-129,514,-51,56],[-4,0,-4,0,-7,726],[-4,0,-4,0,-5,727],[-2,63,-1,0,-4,0],[-1,327,328,-1,329,330,331,332,333,0,-4,334,728,-2,512,-2,513,-129,514,-51,56],[-1,729,729,-1,729,729,729,729,729,0,-4,729,729,-2,729,-2,729,-129,729,-51,729],[-2,63,-1,0,-4,0,-178,65,-15,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,730,731,732],[-1,733,733,-1,733,733,733,733,733,0,-4,733,733,-2,733,-2,733,-129,733,-51,733],[-1,734,734,-1,734,734,734,734,734,0,-4,734,734,-2,734,-2,734,-129,734,-51,734],[-1,327,328,-1,329,330,331,332,333,0,-4,334,734,-2,734,-2,734,-129,734,-51,734],[-1,735,735,-1,735,735,735,735,735,0,-4,735,735,-1,735,735,-2,735,-129,735,-3,735,735,735,-45,735],[-4,0,-4,0,-11,736],[-4,0,-4,0,-11,737],[-1,738,738,-1,738,738,738,738,738,0,-4,738,738,-2,738,-2,738,-129,738,-51,738],[739,739,739,-1,739,739,739,739,739,0,-4,739,739,739,739,739,-2,739,739,-1,739,-17,739,739,739,-1,739,-1,739,-5,739,739,-1,739,739,-3,739,739,739,-1,739,-2,739,-1,739,-2,739,-2,739,-2,739,-1,739,739,739,739,739,739,739,739,739,739,739,739,-1,739,-2,739,739,739,739,-1,739,739,-4,739,739,-2,739,-2,739,-1,739,-5,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,739,-1,739,739,739,-20,739,739,739,739,739,-12,739,739,739,739,739,739,739,739,739],[740,740,740,-1,740,740,740,740,740,0,-4,740,741,740,740,740,-2,740,740,-1,740,-17,740,740,740,-1,740,-1,740,-5,740,740,-1,740,740,-3,740,740,740,-1,740,-2,740,-1,740,-2,740,-2,740,-2,740,-1,740,740,740,740,740,740,740,740,740,740,740,740,-1,740,-2,740,740,740,740,-1,740,740,-4,740,740,-2,740,-2,740,-1,740,-5,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,740,-1,740,740,740,-20,740,740,740,740,740,-12,740,740,740,740,740,740,740,740,740],[-4,0,-4,0,-7,742],[-4,0,-4,0,-178,65,-15,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81],[-2,743,-1,0,-4,0,-7,743,-26,743,-110,743,743,743],[-2,744,-1,744,-4,744,-7,744,-26,744,-26,744,-2,744,-71,744,-8,744,744,744],[-4,0,-4,0,-7,745],[-1,746,746,-1,746,746,746,746,746,0,-4,746,-138,746],[747,747,747,-1,0,-4,0,-6,747,-1,747,-2,747,-32,747,-7,747,-6,747,-4,747,-2,747,-2,747,-1,747,747,747,747,747,-1,747,747,747,747,747,747,-1,747,-2,747,747,747,747,-1,747,747,-4,747,747,-2,747,-2,747,-29,747,-1,747,747,747,747,747,747,-1,747,747,747,-20,747,747,747,747,747,-12,747,747,747,747,747,747,-1,747,747],[-4,0,-4,0,-59,748],[-4,0,-4,0,-22,749],[-4,0,-4,0,-22,750],[-2,2,-1,0,-4,0,-64,9,-43,751,-63,48],[-4,0,-4,0,-22,752],[-4,0,-4,0,-22,753],[754,754,754,-1,0,-4,0,-6,754,-1,754,-2,754,-32,754,-7,754,-6,754,-4,754,-2,754,-2,754,-1,754,754,754,754,754,-1,754,754,754,754,754,754,-1,754,-2,754,754,754,754,-1,754,754,-4,754,754,-2,754,-2,754,-29,754,-1,754,754,754,754,754,754,-1,754,754,754,-20,754,754,754,754,754,-12,754,754,754,754,754,754,-1,754,754],[755,755,755,-1,0,-4,0,-6,755,-1,755,-2,755,-32,755,-7,755,-6,755,-4,755,-2,755,-2,755,-1,755,755,755,755,755,-1,755,755,755,755,755,755,-1,755,-2,755,755,755,755,-1,755,755,-4,755,755,-2,755,-2,755,-29,755,-1,755,755,755,755,755,755,-1,755,755,755,-20,755,755,755,755,755,-12,755,755,755,755,755,755,-1,755,755],[-2,2,-1,0,-4,0,-64,9,-43,756,-63,48],[-4,0,-4,0,-22,757,-36,757],[-4,0,-4,0,-22,758,-36,758],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-28,361,-3,362,363,-3,364,-5,759,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[760,760,760,-1,0,-4,0,-6,760,760,760,-2,760,760,-1,760,-17,760,760,760,-1,760,-1,760,-5,760,760,-1,760,760,-3,760,760,760,-1,760,-2,760,-1,760,-2,760,-2,760,-2,760,-1,760,760,760,760,760,760,760,760,760,760,760,760,-1,760,-2,760,760,760,760,-1,760,760,-4,760,760,-2,760,-2,760,-1,760,-5,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,760,-1,760,760,760,-20,760,760,760,760,760,-12,760,760,760,760,760,760,760,760,760],[761,761,761,-1,0,-4,0,-6,761,761,761,-2,761,761,-1,761,-17,761,761,761,-1,761,-1,761,-5,761,761,-1,761,761,-3,761,761,761,-1,761,-2,761,-1,761,-2,761,-2,761,-2,761,-1,761,761,761,761,761,761,761,761,761,761,761,761,-1,761,-2,761,761,761,761,-1,761,761,-4,761,761,-2,761,-2,761,-1,761,-5,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,761,-1,761,761,761,-20,761,761,761,761,761,-12,761,761,761,761,761,761,761,761,761],[-4,0,-4,0,-14,762,-93,762],[-4,0,-4,0,-14,763,-93,763],[-2,2,-1,0,-4,0,-12,764,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-11,765],[-4,0,-4,0,-11,766],[-4,0,-4,0,-53,767],[-1,768,768,-1,0,-4,0,-14,768,-37,768,-6,768,-4,768,-28,768,-2,768,768,768,-9,768,-27,768,-9,768,768,-24,768,-12,768,768,768,768,768,768],[-4,0,-4,0,-11,769],[-4,0,-4,0,-93,586],[-2,2,-1,0,-4,0,-12,770,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-12,771],[-4,0,-4,0,-168,772],[773,773,773,-1,0,-4,0,-6,773,773,773,-2,773,773,-1,773,-17,773,773,773,-1,773,-1,773,-5,773,773,-1,773,773,-3,773,773,773,-1,773,-2,773,-1,773,-2,773,-2,773,-2,773,-1,773,773,773,773,773,773,773,773,773,773,773,773,-1,773,-2,773,773,773,773,-1,773,773,-4,773,773,-2,773,-2,773,-1,773,-5,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,773,-1,773,773,773,-20,773,773,773,773,773,-12,773,773,773,773,773,773,773,773,773],[-2,2,-1,0,-4,0,-12,774,-39,286,-11,9,-37,473,-65,287,-3,48],[775,775,775,-1,0,-4,0,-6,775,775,775,-2,775,775,-1,775,-17,775,775,775,-1,775,-1,775,-5,775,775,-1,775,775,-3,775,775,775,-1,775,-2,775,-1,775,-2,775,-2,775,-2,775,-1,775,775,775,775,775,775,775,775,775,775,775,775,-1,775,-2,775,775,775,775,-1,775,775,-4,775,775,-2,775,-2,775,-1,775,-5,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,775,-1,775,775,775,-20,775,775,775,775,775,-12,775,775,775,775,775,775,775,775,775],[-4,0,-4,0,-12,776],[777,777,777,-1,0,-4,0,-6,777,777,777,-2,777,777,-1,777,-17,777,777,777,-1,777,-1,777,-5,777,777,-1,777,777,-3,777,777,777,-1,777,-2,777,-1,777,-2,777,-2,777,-2,777,-1,777,777,777,777,777,777,777,777,777,777,777,777,-1,777,-2,777,777,777,777,-1,777,777,-4,777,777,-2,777,-2,777,-1,777,-5,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,777,-1,777,777,777,-20,777,777,777,777,777,-12,777,777,777,777,777,777,777,777,777],[778,778,778,-1,0,-4,0,-6,778,778,778,-2,778,778,-1,778,-17,778,778,778,-1,778,-1,778,-5,778,778,-1,778,778,-3,778,778,778,-1,778,-2,778,-1,778,-2,778,-2,778,-2,778,-1,778,778,778,778,778,778,778,778,778,778,778,778,-1,778,-2,778,778,778,778,-1,778,778,-4,778,778,-2,778,-2,778,-1,778,-5,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,778,-1,778,778,778,-20,778,778,778,778,778,-12,778,778,778,778,778,778,778,778,778],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-1,382,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,779,-1,779],[780,780,780,-1,0,-4,0,-6,780,780,780,-2,780,780,-1,780,-17,780,780,780,-1,780,-1,780,-5,780,780,-1,780,780,-3,780,780,780,-1,780,-2,780,-1,780,-2,780,-2,780,-2,780,-1,780,780,780,780,780,780,780,780,780,780,780,780,-1,780,-2,780,780,780,780,-1,780,780,-4,780,780,-2,780,-2,780,-1,780,-5,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,780,-1,780,780,780,-20,780,780,780,780,780,-12,780,780,780,780,780,780,780,780,780],[-4,0,-4,0,-185,49,50],[781,781,781,-1,0,-4,0,-6,781,781,781,-2,781,781,-1,781,-17,781,781,781,-1,781,-1,781,-5,781,781,-1,781,781,-3,781,781,781,-1,781,-2,781,-1,781,-2,781,-2,781,-2,781,-1,781,781,781,781,781,781,781,781,781,781,781,781,-1,781,-2,781,781,781,781,-1,781,781,-4,781,781,-2,781,-2,781,-1,781,-5,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,781,-1,781,781,781,-20,781,781,781,781,781,-12,781,781,781,781,781,781,781,781,781],[782,782,782,-1,782,-4,782,-6,782,782,782,-2,782,782,-1,782,-17,782,782,782,-1,782,-1,782,-5,782,782,-1,782,782,-3,782,782,782,-1,782,-2,782,-1,782,-2,782,-2,782,-2,782,-1,782,782,782,782,782,782,782,782,782,782,782,782,-1,782,-2,782,782,782,782,-1,782,782,-4,782,782,-2,782,-2,782,-1,782,-5,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,782,-1,782,782,782,-20,782,782,782,782,782,-12,782,782,782,782,782,782,782,782,782],[783,783,783,-1,0,-4,0,-6,783,783,783,-2,783,783,-1,783,-17,783,783,783,-1,783,-1,783,-5,783,783,-1,783,783,-3,783,783,783,-1,783,-2,783,-1,783,-2,783,-2,783,-2,783,-1,783,783,783,783,783,783,783,783,783,783,783,783,-1,783,-2,783,783,783,783,-1,783,783,-4,783,783,-2,783,-2,783,-1,783,-5,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,783,-1,783,783,783,-20,783,783,783,783,783,-12,783,783,783,783,783,783,783,783,783],[-4,0,-4,0,-14,784,-38,784],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-2,438,-29,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-2,2,-1,0,-4,0,-12,785,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-12,786],[-4,0,-4,0,-168,787],[788,788,788,-1,0,-4,0,-6,788,788,788,-2,788,788,-1,788,-17,788,788,788,-1,788,-1,788,-5,788,788,-1,788,788,-3,788,788,788,-1,788,-2,788,-1,788,-2,788,-2,788,-2,788,-1,788,788,788,788,788,788,788,788,788,788,788,788,-1,788,-2,788,788,788,788,-1,788,788,-4,788,788,-2,788,-2,788,-1,788,-5,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,-1,788,788,788,-20,788,788,788,788,788,-12,788,788,788,788,788,788,788,788,788],[789,789,789,-1,0,-4,0,-6,789,789,789,-2,789,789,-1,789,-17,789,789,789,-1,789,-1,789,-5,789,789,-1,789,789,-3,789,789,789,-1,789,-2,789,-1,789,-2,789,-2,789,-2,789,-1,789,789,789,789,789,789,789,789,789,789,789,789,-1,789,-2,789,789,789,789,-1,789,789,-4,789,789,-2,789,-2,789,-1,789,-5,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,789,-1,789,789,789,-20,789,789,789,789,789,-12,789,789,789,789,789,789,789,789,789],[-4,0,-4,0,-106,790,791],[792,792,792,-1,0,-4,0,-6,792,792,792,-2,792,792,-1,792,-17,792,792,792,-1,792,-1,792,-5,792,792,-1,792,792,-3,792,792,792,-1,792,-2,792,-1,792,-2,792,-2,792,-2,792,-1,792,792,792,792,792,792,792,792,792,792,792,792,-1,792,-2,792,792,792,792,-1,792,792,-4,792,792,-2,792,-2,792,-1,792,-5,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,792,-1,792,792,792,-20,792,792,792,792,792,-12,792,792,792,792,792,792,792,792,792],[-1,793,793,-1,0,-4,0,-8,793,-2,793,-32,793,-7,793,-11,793,-11,793,-14,793,-1,793,793,-4,793,793,-2,793,-2,793,-29,793,-1,793,793,793,793,793,793,-1,793,793,793,-20,793,793,793,793,793,-12,793,793,793,793,793,793,-1,793,793],[-4,0,-4,0,-108,794],[795,795,795,-1,0,-4,0,-6,795,795,795,-2,795,795,-1,795,-17,795,795,795,-1,795,-1,795,-5,795,795,-1,795,795,-3,795,795,795,-1,795,-2,795,-1,795,-2,795,-2,795,-2,795,-1,795,795,795,795,795,795,795,795,795,795,795,795,-1,795,-2,795,795,795,795,795,795,795,-4,795,795,-2,795,-2,795,-1,795,-5,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,795,-1,795,795,795,-20,795,795,795,795,795,-12,795,795,795,795,795,795,795,795,795],[796,796,796,-1,0,-4,0,-6,796,796,796,-2,796,796,-1,796,-17,796,796,796,-1,796,-1,796,-5,796,796,-1,796,796,-3,796,796,796,-1,796,-2,796,-1,796,-2,796,-2,796,-2,796,-1,796,796,796,796,796,796,796,796,796,796,796,796,-1,796,-2,796,796,796,796,796,796,796,-4,796,796,-2,796,-2,796,-1,796,-5,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,796,-1,796,796,796,-20,796,796,796,796,796,-12,796,796,796,796,796,796,796,796,796],[797,797,797,-1,0,-4,0,-6,797,797,797,-2,797,797,-1,797,-17,797,797,797,-1,797,-1,797,-5,797,797,-1,797,797,-3,797,797,797,-1,797,-2,797,-1,797,-2,797,-2,797,-2,797,-1,797,797,797,797,797,797,797,797,797,797,797,797,-1,797,-2,797,797,797,797,-1,797,797,-4,797,797,-2,797,-2,797,-1,797,-5,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,797,-1,797,797,797,-20,797,797,797,797,797,-12,797,797,797,797,797,797,797,797,797],[-4,0,-4,0,-108,798],[-4,0,-4,0,-108,799],[-4,0,-4,0,-14,800,-44,800],[-4,0,-4,0,-12,801,-1,801,-38,801,-5,801,-48,801],[-4,0,-4,0,-12,802,-1,802,-19,802,-3,802,-14,802,-23,802,-30,802],[-1,1,2,-1,0,-4,0,-52,360,-11,9,-37,470,-5,803,-27,175,-9,42,43,-24,48,-12,49,50,51,52,53,54],[-4,0,-4,0,-108,804],[-4,0,-4,0,-12,805,-1,805,-38,805,-54,805],[-4,0,-4,0,-53,806],[-4,0,-4,0,-12,807,-1,807,-19,807,-3,807,-14,807,-23,807,-30,807],[-4,0,-4,0,-14,808,-38,808],[-2,2,-1,0,-4,0,-14,254,-37,286,809,-10,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-12,810,-40,810],[-4,0,-4,0,-12,811,-1,811,-38,811,-54,811],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,812,-4,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-59,813],[-1,1,2,-1,0,-4,0,-8,90,-2,5,814,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-59,815],[-1,1,2,-1,0,-4,0,-8,90,-2,5,816,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-14,464,-44,817],[-4,0,-4,0,-38,818,-38,818],[-4,0,-4,0,-14,467,-19,468,-3,819,-20,467,-17,819],[-4,0,-4,0,-34,468,-3,819,-38,819],[-4,0,-4,0,-38,820,-38,820],[-4,0,-4,0,-77,821],[-4,0,-4,0,-77,683],[-4,0,-4,0,-168,822],[823,823,823,-1,0,-4,0,-5,823,823,-1,823,-2,823,-32,823,-7,823,-6,823,-4,823,-2,823,823,-1,823,823,823,823,823,823,823,-1,823,823,823,823,823,823,823,823,-2,823,823,823,823,-1,823,823,-4,823,823,-2,823,-2,823,-1,823,-27,823,-1,823,823,823,823,823,823,-1,823,823,823,-20,823,823,823,823,823,-12,823,823,823,823,823,823,-1,823,823],[824,824,824,-1,0,-4,0,-5,824,824,-1,824,-2,824,-32,824,-7,824,-6,824,-4,824,-2,824,824,-1,824,824,824,824,824,824,824,-1,824,824,824,824,824,824,824,824,-2,824,824,824,824,-1,824,824,-4,824,824,-2,824,-2,824,-1,824,-27,824,-1,824,824,824,824,824,824,-1,824,824,824,-20,824,824,824,824,824,-12,824,824,824,824,824,824,-1,824,824],[-4,0,-4,0,-108,825],[826,826,826,-1,0,-4,0,-5,826,826,826,826,-2,826,826,-1,826,-17,826,826,826,-1,826,-1,826,-5,826,826,-1,826,826,-3,826,826,826,-1,826,-2,826,-1,826,-2,826,-2,826,826,-1,826,-1,826,826,826,826,826,826,826,826,826,826,826,826,826,826,-2,826,826,826,826,-1,826,826,-4,826,826,-2,826,-2,826,-1,826,-5,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,826,-1,826,826,826,-20,826,826,826,826,826,-12,826,826,826,826,826,826,826,826,826],[827,827,827,-1,0,-4,0,-5,827,827,827,827,-2,827,827,-1,827,-17,827,827,827,-1,827,-1,827,-5,827,827,-1,827,827,-3,827,827,827,-1,827,-2,827,-1,827,-2,827,-2,827,827,-1,827,-1,827,827,827,827,827,827,827,827,827,827,827,827,827,827,-2,827,827,827,827,-1,827,827,-4,827,827,-2,827,-2,827,-1,827,-5,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,827,-1,827,827,827,-20,827,827,827,827,827,-12,827,827,827,827,827,827,827,827,827],[-1,828,828,-1,0,-4,0,-52,828,-6,828,-4,828,-28,828,-2,828,828,828,-9,828,-27,828,-9,828,828,-24,828,-12,828,828,828,828,828,828],[-1,829,829,-1,0,-4,0,-52,829,-6,829,-4,829,-28,829,-2,829,829,829,-9,829,-27,829,-9,829,829,-24,829,-12,829,829,829,829,829,829],[-4,0,-4,0,-12,830],[-4,0,-4,0,-168,831],[-4,0,-4,0,-168,832],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,833,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-2,2,-1,0,-4,0,-12,834,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-14,835,-44,835],[-4,0,-4,0,-5,501,-2,836,-184,836],[-4,0,-4,0,-8,836,-184,836],[-4,0,-4,0,-8,837,-184,837],[-4,0,-4,0,-7,838],[-2,839,-1,0,-4,0,-7,839,-137,839,839,839],[-2,840,-1,0,-4,0,-7,840,-137,840,840,840],[-2,841,-1,842,843,844,845,846,0,-3,847,-7,513,-129,514],[-2,841,-1,842,843,844,845,846,0,-3,847],[-2,848,-1,0,-4,0,-7,848,-26,848,-110,848,848,848],[-4,0,-4,0,-5,849],[850,850,850,-1,850,850,850,850,850,0,-4,850,850,850,850,850,-2,850,850,-1,850,-17,850,850,850,-1,850,-1,850,-5,850,850,-1,850,850,-3,850,850,850,-1,850,-2,850,-1,850,-2,850,-2,850,-2,850,-1,850,850,850,850,850,850,850,850,850,850,850,850,-1,850,-2,850,850,850,850,-1,850,850,-4,850,850,-2,850,-2,850,-1,850,-5,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,850,-1,850,850,850,-20,850,850,850,850,850,-12,850,850,850,850,850,850,850,850,850],[-4,0,-4,0,-7,851],[-1,852,852,-1,852,852,852,852,852,0,-4,852,852,-2,852,-2,852,-129,852,-51,852],[-2,63,-1,0,-4,0,-7,853,-138,311,312],[-2,63,-1,0,-4,0,-7,854,-138,311,312],[-2,63,-1,0,-4,0,-7,855,-138,311,312],[-1,856,856,-1,856,856,856,856,856,0,-4,856,856,-2,856,-2,856,-129,856,-51,856],[-4,0,-4,0,-11,857],[-1,1,2,-1,0,-4,0,-8,90,-2,5,858,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-7,859],[860,860,860,-1,860,860,860,860,860,0,-4,860,860,860,860,860,-2,860,860,-1,860,-17,860,860,860,-1,860,-1,860,-5,860,860,-1,860,860,-3,860,860,860,-1,860,-2,860,-1,860,-2,860,-2,860,-2,860,-1,860,860,860,860,860,860,860,860,860,860,860,860,-1,860,-2,860,860,860,860,-1,860,860,-4,860,860,-2,860,-2,860,-1,860,-5,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,-1,860,860,860,-20,860,860,860,860,860,-12,860,860,860,860,860,860,860,860,860],[-4,0,-4,0,-22,861],[-4,0,-4,0,-14,862,-93,862],[-4,0,-4,0,-14,863,-93,863],[-4,0,-4,0,-22,864,-36,864],[-4,0,-4,0,-14,865,-93,865],[-4,0,-4,0,-14,866,-93,866],[867,867,867,-1,0,-4,0,-6,867,-1,867,-2,867,867,-1,867,-29,867,-7,867,867,-5,867,-1,867,-2,867,-2,867,-2,867,-1,867,867,867,867,867,-1,867,867,867,867,867,867,-1,867,-2,867,867,867,867,-1,867,867,-4,867,867,-2,867,-2,867,-1,867,-27,867,-1,867,867,867,867,867,867,-1,867,867,867,-20,867,867,867,867,867,-12,867,867,867,867,867,867,-1,867,867],[868,868,868,-1,0,-4,0,-6,868,868,868,-2,868,868,-1,868,-17,868,868,868,-1,868,-1,868,-5,868,868,-1,868,868,-3,868,868,868,-1,868,-2,868,-1,868,-2,868,-2,868,-2,868,-1,868,868,868,868,868,868,868,868,868,868,868,868,-1,868,-2,868,868,868,868,-1,868,868,-4,868,868,-2,868,-2,868,-1,868,-5,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,868,-1,868,868,868,-20,868,868,868,868,868,-12,868,868,868,868,868,868,868,868,868],[-4,0,-4,0,-14,869,-93,869],[-4,0,-4,0,-14,870,-93,870],[-4,0,-4,0,-12,871],[-4,0,-4,0,-168,872],[-4,0,-4,0,-12,873],[-4,0,-4,0,-12,874],[-4,0,-4,0,-11,875,-49,875],[-2,2,-1,0,-4,0,-12,876,-39,286,-11,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-12,877],[-4,0,-4,0,-168,878],[-4,0,-4,0,-168,879],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,880,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,881],[-4,0,-4,0,-168,882],[883,883,883,-1,0,-4,0,-6,883,883,883,-2,883,883,-1,883,-17,883,883,883,-1,883,-1,883,-5,883,883,-1,883,883,-3,883,883,883,-1,883,-2,883,-1,883,-2,883,-2,883,-2,883,-1,883,883,883,883,883,883,883,883,883,883,883,883,-1,883,-2,883,883,883,883,-1,883,883,-4,883,883,-2,883,-2,883,-1,883,-5,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,883,-1,883,883,883,-20,883,883,883,883,883,-12,883,883,883,883,883,883,883,883,883],[-4,0,-4,0,-12,884,-1,884],[-1,885,885,-1,885,885,885,885,885,0,-144,885,-1,885,885],[-4,0,-4,0,-108,886],[-4,0,-4,0,-14,887,-38,887],[-4,0,-4,0,-12,888],[-4,0,-4,0,-168,889],[-4,0,-4,0,-168,890],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,891,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,892],[893,893,893,-1,0,-4,0,-6,893,893,893,-2,893,893,-1,893,-17,893,893,893,-1,893,-1,893,-5,893,893,-1,893,893,-3,893,893,893,-1,893,-2,893,-1,893,-2,893,-2,893,-2,893,-1,893,893,893,893,893,893,893,893,893,893,893,893,-1,893,-2,893,893,893,893,-1,893,893,-4,893,893,-2,893,-2,893,-1,893,-5,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,893,-1,893,893,893,-20,893,893,893,893,893,-12,893,893,893,893,893,893,893,893,893],[-1,894,894,-1,0,-4,0,-8,894,-2,894,-32,894,-7,894,-11,894,-11,894,-14,894,-1,894,894,-4,894,894,-2,894,-2,894,-29,894,-1,894,894,894,894,894,894,-1,894,894,894,-20,894,894,894,894,894,-12,894,894,894,894,894,894,-1,894,894],[-4,0,-4,0,-12,895],[-4,0,-4,0,-12,896],[897,897,897,-1,0,-4,0,-6,897,-1,897,-2,897,897,-1,897,-29,897,-7,897,897,-5,897,-1,897,-2,897,-2,897,-2,897,-1,897,897,897,897,897,-1,897,897,897,897,897,897,-1,897,-2,897,897,897,897,-1,897,897,-4,897,897,-2,897,-2,897,-1,897,-27,897,-1,897,897,897,897,897,897,-1,897,897,897,-20,897,897,897,897,897,-12,897,897,897,897,897,897,-1,897,897],[-4,0,-4,0,-108,898],[-4,0,-4,0,-12,899,-1,899,-19,899,-3,899,-14,899,-23,899,-30,899],[-4,0,-4,0,-14,900,-93,900],[-4,0,-4,0,-14,901,-93,901],[-4,0,-4,0,-12,902,-1,902,-19,902,-3,902,-14,902,-23,902,-30,902],[-2,2,-1,0,-4,0,-14,438,-37,286,903,-10,9,-37,473,-65,287,-3,48],[-4,0,-4,0,-53,904],[-4,0,-4,0,-14,905,-38,905],[906,906,906,-1,0,-4,0,-5,906,906,-1,906,-2,906,-32,906,-7,906,-6,906,-4,906,-2,906,906,-1,906,907,906,906,906,906,906,-1,906,906,906,906,906,906,906,906,-2,906,906,906,906,-1,906,906,-4,906,906,-2,906,-2,906,-1,906,-27,906,-1,906,906,906,906,906,906,-1,906,906,906,-20,906,906,906,906,906,-12,906,906,906,906,906,906,-1,906,906],[-4,0,-4,0,-12,908],[909,909,909,-1,0,-4,0,-5,909,909,-1,909,-2,909,-32,909,-7,909,-6,909,-4,909,-2,909,909,-1,909,909,909,909,909,909,909,-1,909,909,909,909,909,909,909,909,-2,909,909,909,909,-1,909,909,-4,909,909,-2,909,-2,909,-1,909,-27,909,-1,909,909,909,909,909,909,-1,909,909,909,-20,909,909,909,909,909,-12,909,909,909,909,909,909,-1,909,909],[-4,0,-4,0,-59,910],[-1,1,2,-1,0,-4,0,-8,90,-2,5,911,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,912,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,913],[-4,0,-4,0,-12,914],[-4,0,-4,0,-12,915],[-1,1,2,-1,0,-4,0,-8,90,-2,5,916,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,917],[-4,0,-4,0,-77,819],[918,918,918,-1,0,-4,0,-5,918,918,-1,918,-2,918,-32,918,-7,918,-6,918,-4,918,-2,918,918,-1,918,918,918,918,918,918,918,-1,918,918,918,918,918,918,918,918,-2,918,918,918,918,-1,918,918,-4,918,918,-2,918,-2,918,-1,918,-27,918,-1,918,918,918,918,918,918,-1,918,918,918,-20,918,918,918,918,918,-12,918,918,918,918,918,918,-1,918,918],[-4,0,-4,0,-68,919,-15,920,-23,921],[922,922,922,-1,0,-4,0,-5,922,922,-1,922,-2,922,-32,922,-7,922,-6,922,-4,922,-2,922,922,-1,922,922,922,922,922,922,922,-1,922,922,922,922,922,922,922,922,-2,922,922,922,922,-1,922,922,-4,922,922,-2,922,-2,922,-1,922,-27,922,-1,922,922,922,922,922,922,-1,922,922,922,-20,922,922,922,922,922,-12,922,922,922,922,922,922,-1,922,922],[-4,0,-4,0,-12,923],[-4,0,-4,0,-12,924],[925,925,925,-1,0,-4,0,-5,925,925,925,925,-2,925,925,-1,925,-17,925,925,925,-1,925,-1,925,-5,925,925,-1,925,925,-3,925,925,925,-1,925,-2,925,-1,925,-2,925,-2,925,925,-1,925,-1,925,925,925,925,925,925,925,925,925,925,925,925,925,925,-2,925,925,925,925,-1,925,925,-4,925,925,-2,925,-2,925,-1,925,-5,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,925,-1,925,925,925,-20,925,925,925,925,925,-12,925,925,925,925,925,925,925,925,925],[-4,0,-4,0,-168,926],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,927,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,928,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,929],[930,930,930,-1,0,-4,0,-5,930,930,-1,930,-2,930,-32,930,-7,930,-6,930,-4,930,-2,930,930,-1,930,930,930,930,930,930,930,-1,930,930,930,930,930,930,930,930,-2,930,930,930,930,-1,930,930,-4,930,930,-2,930,-2,930,-1,930,-27,930,-1,930,930,930,930,930,930,-1,930,930,930,-20,930,930,930,930,930,-12,930,930,930,930,930,930,-1,930,930],[-4,0,-4,0,-108,931],[-4,0,-4,0,-12,932],[-4,0,-4,0,-12,933,-1,933],[-4,0,-4,0,-8,934,-184,934],[-4,0,-4,0,-8,935,-184,935],[-4,0,-4,0,-147,936],[-4,0,-4,0,-147,937],[-2,841,-1,842,843,844,845,846,0,-3,847,-142,938,938],[-2,939,-1,939,939,939,939,939,0,-3,939,-142,939,939],[-2,940,-1,940,940,940,940,940,0,-3,940,-142,940,940],[-2,941,-1,941,941,941,941,941,0,-3,941,-142,941,941],[-4,0,-4,0,-146,942],[-4,0,-4,0,-7,943],[-4,0,-4,0,-7,944],[945,945,945,-1,945,945,945,945,945,0,-4,945,945,945,945,945,-2,945,945,-1,945,-17,945,945,945,-1,945,-1,945,-5,945,945,-1,945,945,-3,945,945,945,-1,945,-2,945,-1,945,-2,945,-2,945,-2,945,-1,945,945,945,945,945,945,945,945,945,945,945,945,-1,945,-2,945,945,945,945,-1,945,945,-4,945,945,-2,945,-2,945,-1,945,-5,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,945,-1,945,945,945,-20,945,945,945,945,945,-12,945,945,945,945,945,945,945,945,945],[-2,63,-1,0,-4,0,-7,946,-138,311,312],[-2,947,-1,0,-4,0,-5,948,-13,949,-27,950,951,952,-2,953,-8,954,-106,955,-22,956],[-2,63,-1,0,-4,0,-7,957,-138,311,312],[-1,1,2,-1,0,-4,0,-5,958,-2,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-2,63,-1,0,-4,0,-7,959,-138,311,312],[-1,1,2,-1,0,-4,0,-5,960,-2,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,961,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,962],[-9,0,-11,963,964],[-4,0,-4,0,-7,965],[966,966,966,-1,966,966,966,966,966,0,-4,966,966,966,966,966,-2,966,966,-1,966,-17,966,966,966,-1,966,-1,966,-5,966,966,-1,966,966,-3,966,966,966,-1,966,-2,966,-1,966,-2,966,-2,966,-2,966,-1,966,966,966,966,966,966,966,966,966,966,966,966,-1,966,-2,966,966,966,966,-1,966,966,-4,966,966,-2,966,-2,966,-1,966,-5,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,966,-1,966,966,966,-20,966,966,966,966,966,-12,966,966,966,966,966,966,966,966,966],[-4,0,-4,0,-168,967],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,968,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-168,969],[-4,0,-4,0,-12,970],[-4,0,-4,0,-12,971],[-4,0,-4,0,-12,972],[-4,0,-4,0,-168,973],[-4,0,-4,0,-168,974],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,975,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,976,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,977],[978,978,978,-1,0,-4,0,-6,978,978,978,-2,978,978,-1,978,-17,978,978,978,-1,978,-1,978,-5,978,978,-1,978,978,-3,978,978,978,-1,978,-2,978,-1,978,-2,978,-2,978,-2,978,-1,978,978,978,978,978,978,978,978,978,978,978,978,-1,978,-2,978,978,978,978,-1,978,978,-4,978,978,-2,978,-2,978,-1,978,-5,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,978,-1,978,978,978,-20,978,978,978,978,978,-12,978,978,978,978,978,978,978,978,978],[-4,0,-4,0,-168,979],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,980,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,981,981,-1,981,981,981,981,981,0,-144,981,-1,981,981],[-4,0,-4,0,-168,982],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,983,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,984,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,985],[986,986,986,-1,0,-4,0,-5,986,986,-1,986,-2,986,-32,986,-7,986,-6,986,-4,986,-2,986,986,-1,986,-1,986,986,986,986,986,-1,986,986,986,986,986,986,986,986,-2,986,986,986,986,-1,986,986,-4,986,986,-2,986,-2,986,-1,986,-27,986,-1,986,986,986,986,986,986,-1,986,986,986,-20,986,986,986,986,986,-12,986,986,986,986,986,986,-1,986,986],[-4,0,-4,0,-108,987],[988,988,988,-1,0,-4,0,-6,988,988,988,-2,988,988,-1,988,-17,988,988,988,-1,988,-1,988,-5,988,988,-1,988,988,-3,988,988,988,-1,988,-2,988,-1,988,-2,988,-2,988,-2,988,-1,988,988,988,988,988,988,988,988,988,988,988,988,-1,988,-2,988,988,988,988,988,988,988,-4,988,988,-2,988,-2,988,-1,988,-5,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,988,-1,988,988,988,-20,988,988,988,988,988,-12,988,988,988,988,988,988,988,988,988],[-4,0,-4,0,-12,989,-1,989,-19,989,-3,989,-14,989,-23,989,-30,989],[-4,0,-4,0,-12,990,-1,990,-19,990,-3,990,-14,990,-23,990,-30,990],[-4,0,-4,0,-53,991],[-4,0,-4,0,-59,992],[-1,1,2,-1,0,-4,0,-8,90,-2,5,993,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-12,994],[-4,0,-4,0,-12,995],[996,996,996,-1,0,-4,0,-5,996,996,-1,996,-2,996,-32,996,-7,996,-6,996,-4,996,-2,996,996,-1,996,996,996,996,996,996,996,-1,996,996,996,996,996,996,996,996,-2,996,996,996,996,-1,996,996,-4,996,996,-2,996,-2,996,-1,996,-27,996,-1,996,996,996,996,996,996,-1,996,996,996,-20,996,996,996,996,996,-12,996,996,996,996,996,996,-1,996,996],[-4,0,-4,0,-12,997],[998,998,998,-1,0,-4,0,-5,998,998,-1,998,-2,998,-32,998,-7,998,-6,998,-4,998,-2,998,998,-1,998,998,998,998,998,998,998,-1,998,998,998,998,998,998,998,998,-2,998,998,998,998,-1,998,998,-4,998,998,-2,998,-2,998,-1,998,-27,998,-1,998,998,998,998,998,998,-1,998,998,998,-20,998,998,998,998,998,-12,998,998,998,998,998,998,-1,998,998],[-4,0,-4,0,-12,999],[1000,1000,1000,-1,0,-4,0,-5,1000,1000,-1,1000,-2,1000,-32,1000,-7,1000,-6,1000,-4,1000,-2,1000,1000,-1,1000,1000,1000,1000,1000,1000,1000,-1,1000,1000,1000,1000,1000,1000,1000,1000,-2,1000,1000,1000,1000,-1,1000,1000,-4,1000,1000,-2,1000,-2,1000,-1,1000,-27,1000,-1,1000,1000,1000,1000,1000,1000,-1,1000,1000,1000,-20,1000,1000,1000,1000,1000,-12,1000,1000,1000,1000,1000,1000,-1,1000,1000],[-4,0,-4,0,-68,919,-15,920,-23,1001],[-4,0,-4,0,-84,920,-23,1002],[-4,0,-4,0,-68,1003,-15,1003,-23,1003],[-4,0,-4,0,-61,1004],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1005,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1006],[1007,1007,1007,-1,0,-4,0,-5,1007,1007,-1,1007,-2,1007,-32,1007,-7,1007,-6,1007,-4,1007,-2,1007,1007,-1,1007,1007,1007,1007,1007,1007,1007,-1,1007,1007,1007,1007,1007,1007,1007,1007,-2,1007,1007,1007,1007,-1,1007,1007,-4,1007,1007,-2,1007,-2,1007,-1,1007,-27,1007,-1,1007,1007,1007,1007,1007,1007,-1,1007,1007,1007,-20,1007,1007,1007,1007,1007,-12,1007,1007,1007,1007,1007,1007,-1,1007,1007],[-4,0,-4,0,-108,1008],[1009,1009,1009,-1,0,-4,0,-5,1009,1009,-1,1009,-2,1009,-32,1009,-7,1009,-6,1009,-4,1009,-2,1009,1009,-1,1009,1009,1009,1009,1009,1009,1009,-1,1009,1009,1009,1009,1009,1009,1009,1009,-2,1009,1009,1009,1009,-1,1009,1009,-4,1009,1009,-2,1009,-2,1009,-1,1009,-27,1009,-1,1009,1009,1009,1009,1009,1009,-1,1009,1009,1009,-20,1009,1009,1009,1009,1009,-12,1009,1009,1009,1009,1009,1009,-1,1009,1009],[1010,1010,1010,-1,0,-4,0,-5,1010,1010,-1,1010,-2,1010,-32,1010,-7,1010,-6,1010,-4,1010,-2,1010,1010,-1,1010,1010,1010,1010,1010,1010,1010,-1,1010,1010,1010,1010,1010,1010,1010,1010,-2,1010,1010,1010,1010,-1,1010,1010,-4,1010,1010,-2,1010,-2,1010,-1,1010,-27,1010,-1,1010,1010,1010,1010,1010,1010,-1,1010,1010,1010,-20,1010,1010,1010,1010,1010,-12,1010,1010,1010,1010,1010,1010,-1,1010,1010],[-2,1011,-1,0,-4,0,-7,1011,-137,1011,1011,1011],[-2,1012,-1,0,-4,0,-7,1012,-137,1012,1012,1012],[-2,1013,-1,1013,1013,1013,1013,1013,0,-3,1013,-142,1013,1013],[-4,0,-4,0,-7,1014],[1015,1015,1015,-1,1015,1015,1015,1015,1015,0,-4,1015,1015,1015,1015,1015,-2,1015,1015,-1,1015,-17,1015,1015,1015,-1,1015,-1,1015,-5,1015,1015,-1,1015,1015,-3,1015,1015,1015,-1,1015,-2,1015,-1,1015,-2,1015,-2,1015,-2,1015,-1,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,-1,1015,-2,1015,1015,1015,1015,-1,1015,1015,-4,1015,1015,-2,1015,-2,1015,-1,1015,-5,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,1015,-1,1015,1015,1015,-20,1015,1015,1015,1015,1015,-12,1015,1015,1015,1015,1015,1015,1015,1015,1015],[1016,1016,1016,-1,1016,1016,1016,1016,1016,0,-4,1016,1016,1016,1016,1016,-2,1016,1016,-1,1016,-17,1016,1016,1016,-1,1016,-1,1016,-5,1016,1016,-1,1016,1016,-3,1016,1016,1016,-1,1016,-2,1016,-1,1016,-2,1016,-2,1016,-2,1016,-1,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,-1,1016,-2,1016,1016,1016,1016,-1,1016,1016,-4,1016,1016,-2,1016,-2,1016,-1,1016,-5,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,1016,-1,1016,1016,1016,-20,1016,1016,1016,1016,1016,-12,1016,1016,1016,1016,1016,1016,1016,1016,1016],[-2,947,-1,0,-4,0,-5,1017,-13,949,-27,950,951,952,-2,953,-8,954,-106,955,-22,956],[-4,0,-4,0,-5,1018],[-4,0,-4,0,-210,1019],[-4,0,-4,0,-5,1020],[-2,947,-1,0,-4,0,-5,1021,-13,949,-27,950,951,952,-2,953,-8,954,-106,955,-22,956],[-2,947,-1,0,-4,0,-5,1022,-13,949,-27,950,951,952,-2,953,-8,954,-106,955,-22,956],[-2,1023,-1,0,-4,0,-5,1023,-13,1023,-27,1023,1023,1023,-2,1023,-8,1023,-106,1023,-22,1023],[-2,1024,-1,0,-4,0,-5,1024,-13,1024,-27,1024,1024,1024,-2,1024,-6,1025,-1,1024,-106,1024,-22,1024],[-4,0,-4,0,-6,1026,-11,1027,-1,1028,-7,1029],[-2,1030,-1,0,-4,0,-5,1030,-13,1030,-27,1030,1030,1030,-2,1030,-8,1030,-106,1030,-22,1030],[-2,1031,-1,0,-4,0,-5,1031,-13,1031,-27,1031,1031,1031,-2,1031,-8,1031,-106,1031,-22,1031],[-4,0,-4,0,-14,1032,-153,1033],[-2,947,-1,0,-4,0,-19,949],[-4,0,-4,0,-14,1034,-153,1034],[-2,947,-1,0,-4,0,-7,1035,-4,1036,-1,1036,-29,1037,1038,-1,950,951,952,-2,953,-8,954,-106,1036,-22,956,1039],[-2,1040,-1,0,-4,0,-7,1040,-4,1040,-1,1040,-29,1040,1040,-1,1040,1040,952,-2,953,-8,954,-106,1040,-22,956,1040],[-2,1040,-1,0,-4,0,-7,1040,-4,1040,-1,1040,-29,1040,1040,-1,1040,1040,1040,-2,1040,-8,1041,-106,1040,-22,1040,1040],[-2,1042,-1,0,-4,0,-7,1042,-4,1042,-1,1042,-29,1042,1042,-1,1042,1042,1042,-2,1042,-8,1042,-106,1042,-22,1042,1042],[-2,947,-1,0,-4,0,-47,1043],[-2,1044,-1,0,-4,0,-7,1044,-4,1044,-1,1044,-29,1044,1044,-1,1044,1045,1044,-2,1044,-8,1044,-106,1044,-22,1044,1044],[-2,1046,-1,0,-4,0,-7,1046,-4,1046,-1,1046,-19,1046,-9,1046,1046,-1,1046,1045,1046,-2,1046,1046,1046,1046,1046,-4,1046,-106,1046,-22,1046,1046],[-4,0,-4,0,-48,1047],[-2,1048,-1,0,-4,0,-47,1048],[-2,1049,-1,1050,-4,1051,-3,1052,-1,1052,-1,1052,1052,-2,1052,1052,-1,1052,-4,1052,-4,1052,-7,1052,1052,1052,-9,1052,1052,-1,1052,1052,1052,-2,1052,1052,1052,1052,1052,1052,1052,1052,-1,1052,-2,1053,-71,1054,-31,1052,-22,1052,1052],[-2,1055,-1,1055,-4,1055,-3,1055,-1,1055,-1,1055,1055,-2,1055,1055,-1,1055,-4,1055,-4,1055,-7,1055,1055,1055,-9,1055,1055,-1,1055,1055,1055,-2,1055,1055,1055,1055,1055,1055,1055,1055,-1,1055,-2,1055,-71,1055,-31,1055,-22,1055,1055],[-2,1056,-1,0,-4,0,-7,1056,-4,1056,-1,1056,-29,1056,1056,-1,1056,1056,1056,-2,1056,-8,1056,-106,1056,-22,1056,1056],[-2,1057,-1,0,-4,0,-7,1057,-4,1057,-1,1057,-29,1057,1057,-1,1057,1057,1057,-2,1057,-8,1057,-106,1057,-22,1057,1057],[-2,947,-1,0,-4,0],[-2,947,-1,0,-4,0,-47,1058,951],[-2,947,-1,0,-4,0,-61,1059],[-2,1060,-1,0,-4,0,-7,1060,-4,1060,-1,1060,-29,1060,1060,-1,1060,1060,1060,-2,1060,-8,1060,-106,1060,-22,1060,1060],[-2,1061,-1,0,-4,0,-7,1061,-4,1061,-1,1061,-29,1061,1061,-1,1061,1061,1061,-2,1061,-8,1059,-106,1061,-22,1061,1061],[-4,0,-4,0,-59,1062],[-4,0,-4,0,-59,1063],[-4,0,-4,0,-59,1064],[-1,1,2,-1,0,-4,0,-5,1065,-2,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-5,1066],[-4,0,-4,0,-211,1067],[-4,0,-4,0,-5,1068],[-4,0,-4,0,-5,1069],[-1,1,2,-1,0,-4,0,-5,1070,-2,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-5,1071],[-4,0,-4,0,-212,1072],[-4,0,-4,0,-12,1073],[-9,0,-11,1074,1075],[-9,0,-11,1076,1077],[-1,1,2,-1,0,-4,0,-8,90,-2,5,1078,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1079,1079,-1,1079,1079,1079,1079,1079,0,-4,1079,1079,-1,1079,1079,-2,1079,-129,1079,-3,1079,1079,1079,-45,1079],[1080,1080,1080,-1,1080,1080,1080,1080,1080,0,-4,1080,1080,1080,1080,1080,-2,1080,1080,-1,1080,-17,1080,1080,1080,-1,1080,-1,1080,-5,1080,1080,-1,1080,1080,-3,1080,1080,1080,-1,1080,-2,1080,-1,1080,-2,1080,-2,1080,-2,1080,-1,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,-1,1080,-2,1080,1080,1080,1080,-1,1080,1080,-4,1080,1080,-2,1080,-2,1080,-1,1080,-5,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,-1,1080,1080,1080,-20,1080,1080,1080,1080,1080,-12,1080,1080,1080,1080,1080,1080,1080,1080,1080],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1081,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1082],[-1,1083,1083,-1,0,-4,0,-14,1083,-37,1083,-6,1083,-4,1083,-28,1083,-2,1083,1083,1083,-9,1083,-27,1083,-9,1083,1083,-24,1083,-12,1083,1083,1083,1083,1083,1083],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1084,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-168,1085],[-4,0,-4,0,-168,1086],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1087,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1088,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1089],[1090,1090,1090,-1,0,-4,0,-6,1090,1090,1090,-2,1090,1090,-1,1090,-17,1090,1090,1090,-1,1090,-1,1090,-5,1090,1090,-1,1090,1090,-3,1090,1090,1090,-1,1090,-2,1090,-1,1090,-2,1090,-2,1090,-2,1090,-1,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,-1,1090,-2,1090,1090,1090,1090,-1,1090,1090,-4,1090,1090,-2,1090,-2,1090,-1,1090,-5,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,1090,-1,1090,1090,1090,-20,1090,1090,1090,1090,1090,-12,1090,1090,1090,1090,1090,1090,1090,1090,1090],[-4,0,-4,0,-108,1091],[1092,1092,1092,-1,0,-4,0,-6,1092,1092,1092,-2,1092,1092,-1,1092,-17,1092,1092,1092,-1,1092,-1,1092,-5,1092,1092,-1,1092,1092,-3,1092,1092,1092,-1,1092,-2,1092,-1,1092,-2,1092,-2,1092,-2,1092,-1,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,-1,1092,-2,1092,1092,1092,1092,-1,1092,1092,-4,1092,1092,-2,1092,-2,1092,-1,1092,-5,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,1092,-1,1092,1092,1092,-20,1092,1092,1092,1092,1092,-12,1092,1092,1092,1092,1092,1092,1092,1092,1092],[1093,1093,1093,-1,0,-4,0,-6,1093,1093,1093,-2,1093,1093,-1,1093,-17,1093,1093,1093,-1,1093,-1,1093,-5,1093,1093,-1,1093,1093,-3,1093,1093,1093,-1,1093,-2,1093,-1,1093,-2,1093,-2,1093,-2,1093,-1,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,-1,1093,-2,1093,1093,1093,1093,-1,1093,1093,-4,1093,1093,-2,1093,-2,1093,-1,1093,-5,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,1093,-1,1093,1093,1093,-20,1093,1093,1093,1093,1093,-12,1093,1093,1093,1093,1093,1093,1093,1093,1093],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1094,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1095],[1096,1096,1096,-1,0,-4,0,-6,1096,1096,1096,-2,1096,1096,-1,1096,-17,1096,1096,1096,-1,1096,-1,1096,-5,1096,1096,-1,1096,1096,-3,1096,1096,1096,-1,1096,-2,1096,-1,1096,-2,1096,-2,1096,-2,1096,-1,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,-1,1096,-2,1096,1096,1096,1096,-1,1096,1096,-4,1096,1096,-2,1096,-2,1096,-1,1096,-5,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,1096,-1,1096,1096,1096,-20,1096,1096,1096,1096,1096,-12,1096,1096,1096,1096,1096,1096,1096,1096,1096],[-1,1097,1097,-1,1097,1097,1097,1097,1097,0,-144,1097,-1,1097,1097],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1098,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1099],[1100,1100,1100,-1,0,-4,0,-5,1100,1100,-1,1100,-2,1100,-32,1100,-7,1100,-6,1100,-4,1100,-2,1100,1100,-1,1100,-1,1100,1100,1100,1100,1100,-1,1100,1100,1100,1100,1100,1100,1100,1100,-2,1100,1100,1100,1100,-1,1100,1100,-4,1100,1100,-2,1100,-2,1100,-1,1100,-27,1100,-1,1100,1100,1100,1100,1100,1100,-1,1100,1100,1100,-20,1100,1100,1100,1100,1100,-12,1100,1100,1100,1100,1100,1100,-1,1100,1100],[-4,0,-4,0,-108,1101],[1102,1102,1102,-1,0,-4,0,-5,1102,1102,-1,1102,-2,1102,-32,1102,-7,1102,-6,1102,-4,1102,-2,1102,1102,-1,1102,-1,1102,1102,1102,1102,1102,-1,1102,1102,1102,1102,1102,1102,1102,1102,-2,1102,1102,1102,1102,-1,1102,1102,-4,1102,1102,-2,1102,-2,1102,-1,1102,-27,1102,-1,1102,1102,1102,1102,1102,1102,-1,1102,1102,1102,-20,1102,1102,1102,1102,1102,-12,1102,1102,1102,1102,1102,1102,-1,1102,1102],[1103,1103,1103,-1,0,-4,0,-5,1103,1103,-1,1103,-2,1103,-32,1103,-7,1103,-6,1103,-4,1103,-2,1103,1103,-1,1103,-1,1103,1103,1103,1103,1103,-1,1103,1103,1103,1103,1103,1103,1103,1103,-2,1103,1103,1103,1103,-1,1103,1103,-4,1103,1103,-2,1103,-2,1103,-1,1103,-27,1103,-1,1103,1103,1103,1103,1103,1103,-1,1103,1103,1103,-20,1103,1103,1103,1103,1103,-12,1103,1103,1103,1103,1103,1103,-1,1103,1103],[-4,0,-4,0,-12,1104,-1,1104,-19,1104,-3,1104,-14,1104,-23,1104,-30,1104],[1105,1105,1105,-1,0,-4,0,-5,1105,1105,-1,1105,-2,1105,-32,1105,-7,1105,-6,1105,-4,1105,-2,1105,1105,-1,1105,1105,1105,1105,1105,1105,1105,-1,1105,1105,1105,1105,1105,1105,1105,1105,-2,1105,1105,1105,1105,-1,1105,1105,-4,1105,1105,-2,1105,-2,1105,-1,1105,-27,1105,-1,1105,1105,1105,1105,1105,1105,-1,1105,1105,1105,-20,1105,1105,1105,1105,1105,-12,1105,1105,1105,1105,1105,1105,-1,1105,1105],[1106,1106,1106,-1,0,-4,0,-5,1106,1106,-1,1106,-2,1106,-32,1106,-7,1106,-6,1106,-4,1106,-2,1106,1106,-1,1106,1106,1106,1106,1106,1106,1106,-1,1106,1106,1106,1106,1106,1106,1106,1106,-2,1106,1106,1106,1106,-1,1106,1106,-4,1106,1106,-2,1106,-2,1106,-1,1106,-27,1106,-1,1106,1106,1106,1106,1106,1106,-1,1106,1106,1106,-20,1106,1106,1106,1106,1106,-12,1106,1106,1106,1106,1106,1106,-1,1106,1106],[-4,0,-4,0,-12,1107],[1108,1108,1108,-1,0,-4,0,-5,1108,1108,-1,1108,-2,1108,-32,1108,-7,1108,-6,1108,-4,1108,-2,1108,1108,-1,1108,1108,1108,1108,1108,1108,1108,-1,1108,1108,1108,1108,1108,1108,1108,1108,-2,1108,1108,1108,1108,-1,1108,1108,-4,1108,1108,-2,1108,-2,1108,-1,1108,-27,1108,-1,1108,1108,1108,1108,1108,1108,-1,1108,1108,1108,-20,1108,1108,1108,1108,1108,-12,1108,1108,1108,1108,1108,1108,-1,1108,1108],[1109,1109,1109,-1,0,-4,0,-5,1109,1109,-1,1109,-2,1109,-32,1109,-7,1109,-6,1109,-4,1109,-2,1109,1109,-1,1109,1109,1109,1109,1109,1109,1109,-1,1109,1109,1109,1109,1109,1109,1109,1109,-2,1109,1109,1109,1109,-1,1109,1109,-4,1109,1109,-2,1109,-2,1109,-1,1109,-27,1109,-1,1109,1109,1109,1109,1109,1109,-1,1109,1109,1109,-20,1109,1109,1109,1109,1109,-12,1109,1109,1109,1109,1109,1109,-1,1109,1109],[1110,1110,1110,-1,0,-4,0,-5,1110,1110,-1,1110,-2,1110,-32,1110,-7,1110,-6,1110,-4,1110,-2,1110,1110,-1,1110,1110,1110,1110,1110,1110,1110,-1,1110,1110,1110,1110,1110,1110,1110,1110,-2,1110,1110,1110,1110,-1,1110,1110,-4,1110,1110,-2,1110,-2,1110,-1,1110,-27,1110,-1,1110,1110,1110,1110,1110,1110,-1,1110,1110,1110,-20,1110,1110,1110,1110,1110,-12,1110,1110,1110,1110,1110,1110,-1,1110,1110],[1111,1111,1111,-1,0,-4,0,-5,1111,1111,-1,1111,-2,1111,-32,1111,-7,1111,-6,1111,-4,1111,-2,1111,1111,-1,1111,1111,1111,1111,1111,1111,1111,-1,1111,1111,1111,1111,1111,1111,1111,1111,-2,1111,1111,1111,1111,-1,1111,1111,-4,1111,1111,-2,1111,-2,1111,-1,1111,-27,1111,-1,1111,1111,1111,1111,1111,1111,-1,1111,1111,1111,-20,1111,1111,1111,1111,1111,-12,1111,1111,1111,1111,1111,1111,-1,1111,1111],[1112,1112,1112,-1,0,-4,0,-5,1112,1112,-1,1112,-2,1112,-32,1112,-7,1112,-6,1112,-4,1112,-2,1112,1112,-1,1112,1112,1112,1112,1112,1112,1112,-1,1112,1112,1112,1112,1112,1112,1112,1112,-2,1112,1112,1112,1112,-1,1112,1112,-4,1112,1112,-2,1112,-2,1112,-1,1112,-27,1112,-1,1112,1112,1112,1112,1112,1112,-1,1112,1112,1112,-20,1112,1112,1112,1112,1112,-12,1112,1112,1112,1112,1112,1112,-1,1112,1112],[1113,1113,1113,-1,0,-4,0,-5,1113,1113,-1,1113,-2,1113,-32,1113,-7,1113,-6,1113,-4,1113,-2,1113,1113,-1,1113,1113,1113,1113,1113,1113,1113,-1,1113,1113,1113,1113,1113,1113,1113,1113,-2,1113,1113,1113,1113,-1,1113,1113,-4,1113,1113,-2,1113,-2,1113,-1,1113,-27,1113,-1,1113,1113,1113,1113,1113,1113,-1,1113,1113,1113,-20,1113,1113,1113,1113,1113,-12,1113,1113,1113,1113,1113,1113,-1,1113,1113],[1114,1114,1114,-1,0,-4,0,-5,1114,1114,-1,1114,-2,1114,-32,1114,-7,1114,-6,1114,-4,1114,-2,1114,1114,-1,1114,1114,1114,1114,1114,1114,1114,-1,1114,1114,1114,1114,1114,1114,1114,1114,-2,1114,1114,1114,1114,-1,1114,1114,-4,1114,1114,-2,1114,-2,1114,-1,1114,-27,1114,-1,1114,1114,1114,1114,1114,1114,-1,1114,1114,1114,-20,1114,1114,1114,1114,1114,-12,1114,1114,1114,1114,1114,1114,-1,1114,1114],[-4,0,-4,0,-84,920,-23,1115],[1116,1116,1116,-1,0,-4,0,-5,1116,1116,-1,1116,-2,1116,-32,1116,-7,1116,-6,1116,-4,1116,-2,1116,1116,-1,1116,1116,1116,1116,1116,1116,1116,-1,1116,1116,1116,1116,1116,1116,1116,1116,-2,1116,1116,1116,1116,-1,1116,1116,-4,1116,1116,-2,1116,-2,1116,-1,1116,-27,1116,-1,1116,1116,1116,1116,1116,1116,-1,1116,1116,1116,-20,1116,1116,1116,1116,1116,-12,1116,1116,1116,1116,1116,1116,-1,1116,1116],[-4,0,-4,0,-68,1117,-15,1117,-23,1117],[-4,0,-4,0,-84,920,-23,1118],[-4,0,-4,0,-61,1119],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,1120,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1120,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[1121,1121,1121,-1,0,-4,0,-5,1121,1121,-1,1121,-2,1121,-32,1121,-7,1121,-6,1121,-4,1121,-2,1121,1121,-1,1121,1121,1121,1121,1121,1121,1121,-1,1121,1121,1121,1121,1121,1121,1121,1121,-1,1121,1121,1121,1121,1121,-1,1121,1121,-4,1121,1121,-2,1121,-2,1121,-1,1121,-27,1121,-1,1121,1121,1121,1121,1121,1121,-1,1121,1121,1121,-20,1121,1121,1121,1121,1121,-12,1121,1121,1121,1121,1121,1121,-1,1121,1121],[-4,0,-4,0,-108,1122],[1123,1123,1123,-1,0,-4,0,-5,1123,1123,-1,1123,-2,1123,-32,1123,-7,1123,-6,1123,-4,1123,-2,1123,1123,-1,1123,1123,1123,1123,1123,1123,1123,-1,1123,1123,1123,1123,1123,1123,1123,1123,-2,1123,1123,1123,1123,-1,1123,1123,-4,1123,1123,-2,1123,-2,1123,-1,1123,-27,1123,-1,1123,1123,1123,1123,1123,1123,-1,1123,1123,1123,-20,1123,1123,1123,1123,1123,-12,1123,1123,1123,1123,1123,1123,-1,1123,1123],[1124,1124,1124,-1,0,-4,0,-5,1124,1124,-1,1124,-2,1124,-32,1124,-7,1124,-6,1124,-4,1124,-2,1124,1124,-1,1124,1124,1124,1124,1124,1124,1124,-1,1124,1124,1124,1124,1124,1124,1124,1124,-2,1124,1124,1124,1124,-1,1124,1124,-4,1124,1124,-2,1124,-2,1124,-1,1124,-27,1124,-1,1124,1124,1124,1124,1124,1124,-1,1124,1124,1124,-20,1124,1124,1124,1124,1124,-12,1124,1124,1124,1124,1124,1124,-1,1124,1124],[1125,1125,1125,-1,0,-4,0,-5,1125,1125,-1,1125,-2,1125,-32,1125,-7,1125,-6,1125,-4,1125,-2,1125,1125,-1,1125,1125,1125,1125,1125,1125,1125,-1,1125,1125,1125,1125,1125,1125,1125,1125,-2,1125,1125,1125,1125,-1,1125,1125,-4,1125,1125,-2,1125,-2,1125,-1,1125,-27,1125,-1,1125,1125,1125,1125,1125,1125,-1,1125,1125,1125,-20,1125,1125,1125,1125,1125,-12,1125,1125,1125,1125,1125,1125,-1,1125,1125],[1126,1126,1126,-1,1126,1126,1126,1126,1126,0,-4,1126,1126,1126,1126,1126,-2,1126,1126,-1,1126,-17,1126,1126,1126,-1,1126,-1,1126,-5,1126,1126,-1,1126,1126,-3,1126,1126,1126,-1,1126,-2,1126,-1,1126,-2,1126,-2,1126,-2,1126,-1,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,-1,1126,-2,1126,1126,1126,1126,-1,1126,1126,-4,1126,1126,-2,1126,-2,1126,-1,1126,-5,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,1126,-1,1126,1126,1126,-20,1126,1126,1126,1126,1126,-12,1126,1126,1126,1126,1126,1126,1126,1126,1126],[-4,0,-4,0,-5,1127],[-4,0,-4,0,-210,1128],[-4,0,-4,0,-210,1129],[-4,0,-4,0,-7,1130],[-2,947,-1,0,-4,0,-5,1131,-13,949,-27,950,951,952,-2,953,-8,954,-106,955,-22,956],[-2,1132,-1,0,-4,0,-5,1132,-13,1132,-27,1132,1132,1132,-2,1132,-8,1132,-106,1132,-22,1132],[-2,1133,-1,0,-4,0,-5,1133,-13,1133,-27,1133,1133,1133,-2,1133,-8,1133,-106,1133,-22,1133],[-4,0,-4,0,-59,1025],[-2,1134,-1,0,-4,0,-5,1134,-13,1134,-27,1134,1134,1134,-2,1134,-6,1134,-1,1134,-46,1134,-59,1134,-22,1134],[-4,0,-4,0,-3,1135,-36,1136,-105,1137,1138],[-2,947,-1,0,-4,0,-11,1139,-14,1140,-2,1141],[-4,0,-4,0,-21,1142,-124,1137,1138],[-2,947,-1,0,-1,1143,-2,0,-11,1144,-14,1145],[-2,947,-1,0,-4,0,-47,950,951,952,-2,953,-8,954,-129,956],[-2,947,-1,0,-4,0,-19,949,-39,1146,-48,1147],[-2,1148,-1,0,-4,0,-19,1148,-39,1149,-48,1148],[-2,1148,-1,0,-4,0,-19,1148,-39,1148,-48,1148],[-2,1150,-1,0,-4,0,-19,1150,-39,1150,-48,1150],[-2,1151,-1,0,-4,0,-19,1151,-39,1151,-48,1151],[-4,0,-4,0,-61,1152],[-2,947,-1,0,-4,0,-7,1035,-4,1153,-1,1153,-29,1037,1038,-1,950,951,952,-2,953,-8,954,-106,1153,-22,956,1039],[-2,1154,-1,0,-4,0,-7,1154,-4,1154,-1,1154,-29,1154,1154,-1,1154,1154,1154,-2,1154,-8,1154,-106,1154,-22,1154,1154],[-2,1155,-1,0,-4,0,-7,1155,-4,1155,-1,1155,-29,1155,1155,-1,1155,1155,1155,-2,1155,-8,1155,-106,1155,-22,1155,1155],[-2,1156,-1,0,-4,0,-47,1156,1156,1156,-2,1156,-8,1156,-129,1156],[-2,1157,-1,0,-4,0,-7,1157,-4,1157,-1,1157,-29,1157,1157,-1,1157,1157,952,-2,953,-8,954,-106,1157,-22,956,1157],[-2,1157,-1,0,-4,0,-7,1157,-4,1157,-1,1157,-29,1157,1157,-1,1157,1157,1157,-2,1157,-8,1041,-106,1157,-22,1157,1157],[-2,1158,-1,0,-4,0,-7,1158,-4,1158,-1,1158,-29,1158,1158,-1,1158,1158,1158,-2,1158,-8,1158,-106,1158,-22,1158,1158],[-2,1159,-1,0,-4,0,-7,1159,-4,1159,-1,1159,-29,1159,1159,-1,1159,1159,1159,-2,1159,-8,1159,-106,1159,-22,1159,1159],[-4,0,-4,0,-61,1059],[-2,1160,-1,0,-4,0,-7,1160,-4,1160,-1,1160,-29,1160,1160,-1,1160,1160,1160,-2,1160,-8,1160,-106,1160,-22,1160,1160],[-2,1161,-1,0,-4,0,-7,1161,-4,1161,-1,1161,-19,1161,-9,1161,1161,-1,1161,1161,1161,-2,1161,1161,1161,1161,1161,-4,1161,-106,1161,-22,1161,1161],[-2,1162,-1,0,-4,0,-47,1162],[-2,1049,-1,1050,-4,1051,-3,1163,-1,1163,-1,1163,1163,-2,1163,1163,-1,1163,-4,1163,-4,1163,-7,1163,1163,1163,-9,1163,1163,-1,1163,1163,1163,-2,1163,1163,1163,1163,1163,1163,1163,1163,-1,1163,-2,1053,-71,1054,-31,1163,-22,1163,1163],[-2,1164,-1,1164,-4,0,-3,1164,-1,1164,-1,1164,1164,-2,1164,1164,-1,1164,-4,1164,-4,1164,-7,1164,1164,1164,-9,1164,1164,-1,1164,1164,1164,-2,1164,1164,1164,1164,1164,1164,1164,1164,-1,1164,-106,1164,-22,1164,1164],[-2,1165,-1,1165,-4,1165,-3,1165,-1,1165,-1,1165,1165,-2,1165,1165,-1,1165,-4,1165,-4,1165,-7,1165,1165,1165,-9,1165,1165,-1,1165,1165,1165,-2,1165,1165,1165,1165,1165,1165,1165,1165,-1,1165,-2,1165,-71,1165,-31,1165,-22,1165,1165],[-2,1166,-1,1166,-4,1166,-3,1166,-1,1166,-1,1166,1166,-2,1166,1166,-1,1166,-4,1166,-4,1166,-7,1166,1166,1166,-9,1166,1166,-1,1166,1166,1166,-2,1166,1166,1166,1166,1166,1166,1166,1166,-1,1166,-2,1166,-71,1166,-31,1166,-22,1166,1166],[-2,1167,-1,1167,-4,0,-3,1167,-1,1167,-1,1167,1167,-2,1167,1167,-1,1167,-4,1167,-4,1167,-7,1167,1167,1167,-9,1167,1167,-1,1167,1167,1167,-2,1167,1167,1167,1167,1167,1167,1167,1167,-1,1167,-106,1167,-22,1167,1167],[-2,1168,-1,0,-4,0,-7,1168,-4,1168,-1,1168,-29,1168,1168,-1,1168,1168,1168,-2,1168,-8,1168,-106,1168,-22,1168,1168],[-2,1169,-1,0,-4,0,-7,1169,-4,1169,-1,1169,-29,1169,1169,-1,1169,1169,1169,-2,1169,-8,1169,-106,1169,-22,1169,1169],[-4,0,-4,0,-34,1170,-9,1171,-8,1172,1173,1174,1175],[-4,0,-4,0,-48,1045],[-2,1176,-1,0,-4,0,-7,1176,-3,1177,1176,-1,1176,-29,1176,1176,-1,1176,1176,1176,-2,1176,-8,1176,-106,1176,-22,1176,1176],[-2,1178,-1,0,-4,0,-7,1178,-4,1178,-1,1178,-29,1178,1178,-1,1178,1178,1178,-2,1178,-8,1178,-106,1178,-22,1178,1178],[-2,1179,-1,0,-4,0,-7,1179,-4,1179,-1,1179,-29,1179,1179,-1,1179,1179,1179,-2,1179,-8,1059,-106,1179,-22,1179,1179],[-2,1180,-1,0,-4,0,-7,1180,-4,1180,-1,1180,-29,1180,1180,-1,1180,1180,1180,-2,1180,-8,1180,-106,1180,-22,1180,1180],[-4,0,-4,0,-5,1181],[-4,0,-4,0,-211,1182],[-4,0,-4,0,-211,1183],[-4,0,-4,0,-7,1184],[-4,0,-4,0,-5,1185],[-4,0,-4,0,-212,1186],[-4,0,-4,0,-212,1187],[-4,0,-4,0,-7,1188],[-9,0,-11,1189,1190],[-1,1,2,-1,0,-4,0,-8,90,-2,5,1191,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1192,1192,-1,1192,1192,1192,1192,1192,0,-4,1192,1192,-1,1192,1192,-2,1192,-129,1192,-3,1192,1192,1192,-45,1192],[-1,1,2,-1,0,-4,0,-8,90,-2,5,1193,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1194,1194,-1,1194,1194,1194,1194,1194,0,-4,1194,1194,-1,1194,1194,-2,1194,-129,1194,-3,1194,1194,1194,-45,1194],[-4,0,-4,0,-12,1195],[-9,0,-12,1196],[-4,0,-4,0,-108,1197],[-1,1198,1198,-1,0,-4,0,-14,1198,-37,1198,-6,1198,-4,1198,-28,1198,-2,1198,1198,1198,-9,1198,-27,1198,-9,1198,1198,-24,1198,-12,1198,1198,1198,1198,1198,1198],[-1,1199,1199,-1,0,-4,0,-14,1199,-37,1199,-6,1199,-4,1199,-28,1199,-2,1199,1199,1199,-9,1199,-27,1199,-9,1199,1199,-24,1199,-12,1199,1199,1199,1199,1199,1199],[-4,0,-4,0,-108,1200],[-1,1201,1201,-1,0,-4,0,-14,1201,-37,1201,-6,1201,-4,1201,-28,1201,-2,1201,1201,1201,-9,1201,-27,1201,-9,1201,1201,-24,1201,-12,1201,1201,1201,1201,1201,1201],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1202,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-5,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,-1,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1203,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-108,1204],[-1,1205,1205,-1,0,-4,0,-14,1205,-37,1205,-6,1205,-4,1205,-28,1205,-2,1205,1205,1205,-9,1205,-27,1205,-9,1205,1205,-24,1205,-12,1205,1205,1205,1205,1205,1205],[-4,0,-4,0,-108,1206],[1207,1207,1207,-1,0,-4,0,-6,1207,1207,1207,-2,1207,1207,-1,1207,-17,1207,1207,1207,-1,1207,-1,1207,-5,1207,1207,-1,1207,1207,-3,1207,1207,1207,-1,1207,-2,1207,-1,1207,-2,1207,-2,1207,-2,1207,-1,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,-1,1207,-2,1207,1207,1207,1207,-1,1207,1207,-4,1207,1207,-2,1207,-2,1207,-1,1207,-5,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,1207,-1,1207,1207,1207,-20,1207,1207,1207,1207,1207,-12,1207,1207,1207,1207,1207,1207,1207,1207,1207],[1208,1208,1208,-1,0,-4,0,-6,1208,1208,1208,-2,1208,1208,-1,1208,-17,1208,1208,1208,-1,1208,-1,1208,-5,1208,1208,-1,1208,1208,-3,1208,1208,1208,-1,1208,-2,1208,-1,1208,-2,1208,-2,1208,-2,1208,-1,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,-1,1208,-2,1208,1208,1208,1208,-1,1208,1208,-4,1208,1208,-2,1208,-2,1208,-1,1208,-5,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,1208,-1,1208,1208,1208,-20,1208,1208,1208,1208,1208,-12,1208,1208,1208,1208,1208,1208,1208,1208,1208],[1209,1209,1209,-1,0,-4,0,-6,1209,1209,1209,-2,1209,1209,-1,1209,-17,1209,1209,1209,-1,1209,-1,1209,-5,1209,1209,-1,1209,1209,-3,1209,1209,1209,-1,1209,-2,1209,-1,1209,-2,1209,-2,1209,-2,1209,-1,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,-1,1209,-2,1209,1209,1209,1209,-1,1209,1209,-4,1209,1209,-2,1209,-2,1209,-1,1209,-5,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,1209,-1,1209,1209,1209,-20,1209,1209,1209,1209,1209,-12,1209,1209,1209,1209,1209,1209,1209,1209,1209],[-4,0,-4,0,-108,1210],[1211,1211,1211,-1,0,-4,0,-6,1211,1211,1211,-2,1211,1211,-1,1211,-17,1211,1211,1211,-1,1211,-1,1211,-5,1211,1211,-1,1211,1211,-3,1211,1211,1211,-1,1211,-2,1211,-1,1211,-2,1211,-2,1211,-2,1211,-1,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-1,1211,-2,1211,1211,1211,1211,-1,1211,1211,-4,1211,1211,-2,1211,-2,1211,-1,1211,-5,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,1211,-1,1211,1211,1211,-20,1211,1211,1211,1211,1211,-12,1211,1211,1211,1211,1211,1211,1211,1211,1211],[1212,1212,1212,-1,0,-4,0,-6,1212,1212,1212,-2,1212,1212,-1,1212,-17,1212,1212,1212,-1,1212,-1,1212,-5,1212,1212,-1,1212,1212,-3,1212,1212,1212,-1,1212,-2,1212,-1,1212,-2,1212,-2,1212,-2,1212,-1,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,-1,1212,-2,1212,1212,1212,1212,-1,1212,1212,-4,1212,1212,-2,1212,-2,1212,-1,1212,-5,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,1212,-1,1212,1212,1212,-20,1212,1212,1212,1212,1212,-12,1212,1212,1212,1212,1212,1212,1212,1212,1212],[-4,0,-4,0,-108,1213],[1214,1214,1214,-1,0,-4,0,-5,1214,1214,-1,1214,-2,1214,-32,1214,-7,1214,-6,1214,-4,1214,-2,1214,1214,-1,1214,-1,1214,1214,1214,1214,1214,-1,1214,1214,1214,1214,1214,1214,1214,1214,-2,1214,1214,1214,1214,-1,1214,1214,-4,1214,1214,-2,1214,-2,1214,-1,1214,-27,1214,-1,1214,1214,1214,1214,1214,1214,-1,1214,1214,1214,-20,1214,1214,1214,1214,1214,-12,1214,1214,1214,1214,1214,1214,-1,1214,1214],[1215,1215,1215,-1,0,-4,0,-5,1215,1215,-1,1215,-2,1215,-32,1215,-7,1215,-6,1215,-4,1215,-2,1215,1215,-1,1215,-1,1215,1215,1215,1215,1215,-1,1215,1215,1215,1215,1215,1215,1215,1215,-2,1215,1215,1215,1215,-1,1215,1215,-4,1215,1215,-2,1215,-2,1215,-1,1215,-27,1215,-1,1215,1215,1215,1215,1215,1215,-1,1215,1215,1215,-20,1215,1215,1215,1215,1215,-12,1215,1215,1215,1215,1215,1215,-1,1215,1215],[1216,1216,1216,-1,0,-4,0,-5,1216,1216,-1,1216,-2,1216,-32,1216,-7,1216,-6,1216,-4,1216,-2,1216,1216,-1,1216,-1,1216,1216,1216,1216,1216,-1,1216,1216,1216,1216,1216,1216,1216,1216,-2,1216,1216,1216,1216,-1,1216,1216,-4,1216,1216,-2,1216,-2,1216,-1,1216,-27,1216,-1,1216,1216,1216,1216,1216,1216,-1,1216,1216,1216,-20,1216,1216,1216,1216,1216,-12,1216,1216,1216,1216,1216,1216,-1,1216,1216],[1217,1217,1217,-1,0,-4,0,-5,1217,1217,-1,1217,-2,1217,-32,1217,-7,1217,-6,1217,-4,1217,-2,1217,1217,-1,1217,1217,1217,1217,1217,1217,1217,-1,1217,1217,1217,1217,1217,1217,1217,1217,-2,1217,1217,1217,1217,-1,1217,1217,-4,1217,1217,-2,1217,-2,1217,-1,1217,-27,1217,-1,1217,1217,1217,1217,1217,1217,-1,1217,1217,1217,-20,1217,1217,1217,1217,1217,-12,1217,1217,1217,1217,1217,1217,-1,1217,1217],[1218,1218,1218,-1,0,-4,0,-5,1218,1218,-1,1218,-2,1218,-32,1218,-7,1218,-6,1218,-4,1218,-2,1218,1218,-1,1218,1218,1218,1218,1218,1218,1218,-1,1218,1218,1218,1218,1218,1218,1218,1218,-2,1218,1218,1218,1218,-1,1218,1218,-4,1218,1218,-2,1218,-2,1218,-1,1218,-27,1218,-1,1218,1218,1218,1218,1218,1218,-1,1218,1218,1218,-20,1218,1218,1218,1218,1218,-12,1218,1218,1218,1218,1218,1218,-1,1218,1218],[1219,1219,1219,-1,0,-4,0,-5,1219,1219,-1,1219,-2,1219,-32,1219,-7,1219,-6,1219,-4,1219,-2,1219,1219,-1,1219,1219,1219,1219,1219,1219,1219,-1,1219,1219,1219,1219,1219,1219,1219,1219,-2,1219,1219,1219,1219,-1,1219,1219,-4,1219,1219,-2,1219,-2,1219,-1,1219,-27,1219,-1,1219,1219,1219,1219,1219,1219,-1,1219,1219,1219,-20,1219,1219,1219,1219,1219,-12,1219,1219,1219,1219,1219,1219,-1,1219,1219],[1220,1220,1220,-1,0,-4,0,-5,1220,1220,-1,1220,-2,1220,-32,1220,-7,1220,-6,1220,-4,1220,-2,1220,1220,-1,1220,1220,1220,1220,1220,1220,1220,-1,1220,1220,1220,1220,1220,1220,1220,1220,-2,1220,1220,1220,1220,-1,1220,1220,-4,1220,1220,-2,1220,-2,1220,-1,1220,-27,1220,-1,1220,1220,1220,1220,1220,1220,-1,1220,1220,1220,-20,1220,1220,1220,1220,1220,-12,1220,1220,1220,1220,1220,1220,-1,1220,1220],[1221,1221,1221,-1,0,-4,0,-5,1221,1221,-1,1221,-2,1221,-32,1221,-7,1221,-6,1221,-4,1221,-2,1221,1221,-1,1221,1221,1221,1221,1221,1221,1221,-1,1221,1221,1221,1221,1221,1221,1221,1221,-2,1221,1221,1221,1221,-1,1221,1221,-4,1221,1221,-2,1221,-2,1221,-1,1221,-27,1221,-1,1221,1221,1221,1221,1221,1221,-1,1221,1221,1221,-20,1221,1221,1221,1221,1221,-12,1221,1221,1221,1221,1221,1221,-1,1221,1221],[-4,0,-4,0,-108,1222],[1223,1223,1223,-1,0,-4,0,-5,1223,1223,-1,1223,-2,1223,-32,1223,-7,1223,-6,1223,-4,1223,-2,1223,1223,-1,1223,1223,1223,1223,1223,1223,1223,-1,1223,1223,1223,1223,1223,1223,1223,1223,-2,1223,1223,1223,1223,-1,1223,1223,-4,1223,1223,-2,1223,-2,1223,-1,1223,-27,1223,-1,1223,1223,1223,1223,1223,1223,-1,1223,1223,1223,-20,1223,1223,1223,1223,1223,-12,1223,1223,1223,1223,1223,1223,-1,1223,1223],[-1,1,2,-1,0,-4,0,-8,90,-2,5,-32,6,-7,7,-6,8,-4,9,-3,1224,-1,11,-1,12,13,14,15,16,-1,17,18,19,20,21,22,1224,23,-2,24,25,26,27,-1,28,29,-4,30,31,-2,32,-2,33,-1,1224,-27,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,44,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-4,0,-4,0,-84,1225,-23,1225],[1226,1226,1226,-1,0,-4,0,-5,1226,1226,-1,1226,-2,1226,-32,1226,-7,1226,-6,1226,-4,1226,-2,1226,1226,-1,1226,1226,1226,1226,1226,1226,1226,-1,1226,1226,1226,1226,1226,1226,1226,1226,-2,1226,1226,1226,1226,-1,1226,1226,-4,1226,1226,-2,1226,-2,1226,-1,1226,-27,1226,-1,1226,1226,1226,1226,1226,1226,-1,1226,1226,1226,-20,1226,1226,1226,1226,1226,-12,1226,1226,1226,1226,1226,1226,-1,1226,1226],[-4,0,-4,0,-210,1227],[-4,0,-4,0,-7,1228],[-4,0,-4,0,-7,1229],[-1,1230,1230,-1,1230,1230,1230,1230,1230,0,-4,1230,1230,-2,1230,-2,1230,-129,1230,-51,1230],[-4,0,-4,0,-3,1231,-36,1136,-105,1137,1138],[-2,947,-1,0,-4,0,-5,1232,-5,1139,-6,1233,1232,-6,1140,-2,1141,-17,1232,1232,1232,-2,1232,-6,1232,-1,1232,-106,1232,-22,1232],[-4,0,-4,0,-3,1234,-36,1234,-105,1234,1234],[-2,1235,-1,0,-4,0,-5,1235,-5,1235,-6,1235,1235,-6,1235,-2,1235,-17,1235,1235,1235,-2,1235,-6,1235,-1,1235,-106,1235,-22,1235],[-4,0,-4,0,-3,1135],[-4,0,-4,0,-11,1236],[-4,0,-4,0,-14,1237,-153,1238],[-2,1239,-1,0,-4,0,-5,1239,-8,1239,-4,1239,-27,1239,1239,1239,-2,1239,-6,1239,-1,1239,-106,1239,-22,1239],[-2,1240,-1,0,-4,0,-5,1240,-8,1240,-4,1240,-27,1240,1240,1240,-2,1240,-6,1240,-1,1240,-106,1240,-22,1240],[-2,1240,-1,0,-4,0,-5,1240,-8,1240,-4,1240,-4,1241,-22,1240,1240,1240,-2,1240,-6,1240,-1,1240,-106,1240,-22,1240],[-2,1242,-1,0,-4,0,-5,1242,-6,1242,-1,1242,-4,1242,-27,1242,1242,1242,-2,1242,-6,1242,-1,1242,-106,1242,-22,1242],[-2,1243,-1,0,-4,0,-5,1243,-6,1243,-1,1243,-4,1243,-27,1243,1243,1243,-2,1243,-6,1243,-1,1243,-106,1243,-22,1243],[-2,1243,-1,0,-4,0,-5,1243,-6,1243,-1,1243,-4,1243,-4,1244,1245,-21,1243,1243,1243,-2,1243,-6,1243,-1,1243,-106,1243,-22,1243],[-2,947,-1,0,-4,0,-11,1139],[-1,1246,947,-1,0,-4,0,-11,1139,-14,1247],[-2,1248,-1,0,-4,0,-5,1248,-6,1248,-1,1248,-4,1248,-4,1248,1248,-21,1248,1248,1248,-2,1248,-6,1248,-1,1248,-106,1248,-22,1248],[-2,1249,-1,0,-4,0,-5,1249,-5,1250,-2,1249,-4,1249,-4,1249,-22,1249,1249,1249,-2,1249,-6,1249,-1,1249,-106,1249,-22,1249],[-2,1251,-1,0,-4,0],[-4,0,-4,0,-168,1252],[-4,0,-4,0,-168,1253],[-4,0,-4,0,-168,1254],[-2,947,-1,0,-1,1143,-2,0,-11,1144],[-4,0,-4,0,-12,1255,-11,1256,1257,-142,1255],[-4,0,-4,0,-12,1258,-11,1258,1258,-142,1258],[-4,0,-4,0,-12,1259,-11,1259,1259,-142,1259],[-4,0,-4,0,-11,1260],[-4,0,-4,0,-11,1250],[-2,947,-1,0,-4,0,-19,949,-39,1261,-48,1262],[-4,0,-4,0,-14,1263,-153,1263],[-4,0,-4,0,-108,1264],[-2,1265,-1,0,-4,0,-5,1265,-13,1265,-27,1265,1265,1265,-2,1265,-8,1265,-46,1265,-59,1265,-22,1265],[-2,1266,-1,0,-4,0,-19,1266,-39,1266,-48,1266],[-2,1267,-1,0,-4,0,-19,1267,-39,1268,-48,1267],[-2,947,-1,0,-4,0,-19,1269,-39,1269,-48,1269],[-2,1270,-1,1271,-4,0,-3,1272,-7,1273],[-2,1274,-1,0,-4,0,-7,1274,-4,1274,-1,1274,-29,1274,1274,-1,1274,1274,1274,-2,1274,-8,1274,-106,1274,-22,1274,1274],[-2,1275,-1,0,-4,0,-7,1275,-4,1275,-1,1275,-29,1275,1275,-1,1275,1275,1275,-2,1275,-8,1275,-106,1275,-22,1275,1275],[-2,1276,-1,0,-4,0,-7,1276,-4,1276,-1,1276,-29,1276,1276,-1,1276,1276,1276,-2,1276,-8,1041,-106,1276,-22,1276,1276],[-2,1277,-1,1277,-4,0,-3,1277,-1,1277,-1,1277,1277,-2,1277,1277,-1,1277,-4,1277,-4,1277,-7,1277,1277,1277,-9,1277,1277,-1,1277,1277,1277,-2,1277,1277,1277,1277,1277,1277,1277,1277,-1,1277,-106,1277,-22,1277,1277],[-2,1278,-1,1278,-4,1278,-3,1278,-1,1278,-1,1278,1278,-2,1278,1278,-1,1278,-4,1278,-4,1278,-7,1278,1278,1278,-9,1278,1278,-1,1278,1278,1278,-2,1278,1278,1278,1278,1278,1278,1278,1278,-1,1278,-2,1278,-71,1278,-31,1278,-22,1278,1278],[-2,1279,-1,0,-4,0,-7,1279,-4,1279,-1,1279,-29,1279,1279,-1,1279,1279,1279,-2,1279,-8,1279,-106,1279,-22,1279,1279],[-2,947,1280,0,-4,0],[-4,0,-4,0,-34,1281],[-2,1282,1282,0,-4,0],[-2,1283,-1,0,-4,0,-7,1283,-4,1283,-1,1283,-29,1283,1283,-1,1283,1283,1283,-2,1283,-8,1283,-106,1283,-22,1283,1283],[-2,1284,-1,0,-4,0,-7,1284,-4,1284,-1,1284,-29,1284,1284,-1,1284,1284,1284,-2,1284,-8,1284,-106,1284,-22,1284,1284],[-4,0,-4,0,-211,1285],[-4,0,-4,0,-7,1286],[-4,0,-4,0,-7,1287],[-4,0,-4,0,-212,1288],[-4,0,-4,0,-7,1289],[-4,0,-4,0,-7,1290],[-1,1,2,-1,0,-4,0,-8,90,-2,5,1291,-31,6,-7,7,-11,9,-11,16,-14,163,-1,164,165,-4,30,31,-2,32,-2,33,-29,34,-1,35,36,37,38,39,40,-1,41,42,43,-20,166,45,46,47,48,-12,49,50,51,52,53,54,-1,55,56],[-1,1292,1292,-1,1292,1292,1292,1292,1292,0,-4,1292,1292,-1,1292,1292,-2,1292,-129,1292,-3,1292,1292,1292,-45,1292],[-4,0,-4,0,-12,1293],[-9,0,-12,1294],[-4,0,-4,0,-12,1295],[-9,0,-12,1296],[-9,0,-12,1297],[-1,1298,1298,-1,1298,1298,1298,1298,1298,0,-4,1298,1298,-1,1298,1298,-2,1298,-129,1298,-3,1298,1298,1298,-45,1298],[-1,1299,1299,-1,0,-4,0,-14,1299,-37,1299,-6,1299,-4,1299,-28,1299,-2,1299,1299,1299,-9,1299,-27,1299,-9,1299,1299,-24,1299,-12,1299,1299,1299,1299,1299,1299],[-1,1300,1300,-1,0,-4,0,-14,1300,-37,1300,-6,1300,-4,1300,-28,1300,-2,1300,1300,1300,-9,1300,-27,1300,-9,1300,1300,-24,1300,-12,1300,1300,1300,1300,1300,1300],[-4,0,-4,0,-108,1301],[-1,1302,1302,-1,0,-4,0,-14,1302,-37,1302,-6,1302,-4,1302,-28,1302,-2,1302,1302,1302,-9,1302,-27,1302,-9,1302,1302,-24,1302,-12,1302,1302,1302,1302,1302,1302],[-4,0,-4,0,-108,1303],[-1,1304,1304,-1,0,-4,0,-14,1304,-37,1304,-6,1304,-4,1304,-28,1304,-2,1304,1304,1304,-9,1304,-27,1304,-9,1304,1304,-24,1304,-12,1304,1304,1304,1304,1304,1304],[-1,1305,1305,-1,0,-4,0,-14,1305,-37,1305,-6,1305,-4,1305,-28,1305,-2,1305,1305,1305,-9,1305,-27,1305,-9,1305,1305,-24,1305,-12,1305,1305,1305,1305,1305,1305],[1306,1306,1306,-1,0,-4,0,-6,1306,1306,1306,-2,1306,1306,-1,1306,-17,1306,1306,1306,-1,1306,-1,1306,-5,1306,1306,-1,1306,1306,-3,1306,1306,1306,-1,1306,-2,1306,-1,1306,-2,1306,-2,1306,-2,1306,-1,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,-1,1306,-2,1306,1306,1306,1306,-1,1306,1306,-4,1306,1306,-2,1306,-2,1306,-1,1306,-5,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,1306,-1,1306,1306,1306,-20,1306,1306,1306,1306,1306,-12,1306,1306,1306,1306,1306,1306,1306,1306,1306],[1307,1307,1307,-1,0,-4,0,-6,1307,1307,1307,-2,1307,1307,-1,1307,-17,1307,1307,1307,-1,1307,-1,1307,-5,1307,1307,-1,1307,1307,-3,1307,1307,1307,-1,1307,-2,1307,-1,1307,-2,1307,-2,1307,-2,1307,-1,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,-1,1307,-2,1307,1307,1307,1307,-1,1307,1307,-4,1307,1307,-2,1307,-2,1307,-1,1307,-5,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,1307,-1,1307,1307,1307,-20,1307,1307,1307,1307,1307,-12,1307,1307,1307,1307,1307,1307,1307,1307,1307],[1308,1308,1308,-1,0,-4,0,-5,1308,1308,-1,1308,-2,1308,-32,1308,-7,1308,-6,1308,-4,1308,-2,1308,1308,-1,1308,-1,1308,1308,1308,1308,1308,-1,1308,1308,1308,1308,1308,1308,1308,1308,-2,1308,1308,1308,1308,-1,1308,1308,-4,1308,1308,-2,1308,-2,1308,-1,1308,-27,1308,-1,1308,1308,1308,1308,1308,1308,-1,1308,1308,1308,-20,1308,1308,1308,1308,1308,-12,1308,1308,1308,1308,1308,1308,-1,1308,1308],[1309,1309,1309,-1,0,-4,0,-5,1309,1309,-1,1309,-2,1309,-32,1309,-7,1309,-6,1309,-4,1309,-2,1309,1309,-1,1309,1309,1309,1309,1309,1309,1309,-1,1309,1309,1309,1309,1309,1309,1309,1309,-2,1309,1309,1309,1309,-1,1309,1309,-4,1309,1309,-2,1309,-2,1309,-1,1309,-27,1309,-1,1309,1309,1309,1309,1309,1309,-1,1309,1309,1309,-20,1309,1309,1309,1309,1309,-12,1309,1309,1309,1309,1309,1309,-1,1309,1309],[1310,1310,1310,-1,0,-4,0,-5,1310,1310,-1,1310,-2,1310,-32,1310,-7,1310,-6,1310,-4,1310,-2,1310,1310,-1,1310,1310,1310,1310,1310,1310,1310,-1,1310,1310,1310,1310,1310,1310,1310,1310,-2,1310,1310,1310,1310,-1,1310,1310,-4,1310,1310,-2,1310,-2,1310,-1,1310,-27,1310,-1,1310,1310,1310,1310,1310,1310,-1,1310,1310,1310,-20,1310,1310,1310,1310,1310,-12,1310,1310,1310,1310,1310,1310,-1,1310,1310],[-4,0,-4,0,-68,1311,-15,1311,-23,1311],[-4,0,-4,0,-7,1312],[-1,1313,1313,-1,1313,1313,1313,1313,1313,0,-4,1313,1313,-2,1313,-2,1313,-129,1313,-51,1313],[-1,1314,1314,-1,1314,1314,1314,1314,1314,0,-4,1314,1314,-2,1314,-2,1314,-129,1314,-51,1314],[-2,947,-1,0,-4,0,-5,1315,-5,1139,-6,1233,1315,-6,1140,-2,1141,-17,1315,1315,1315,-2,1315,-6,1315,-1,1315,-106,1315,-22,1315],[-4,0,-4,0,-3,1316,-36,1316,-105,1316,1316],[-2,947,-1,0,-4,0,-5,1315,-5,1139,-7,1315,-6,1140,-2,1141,-17,1315,1315,1315,-2,1315,-6,1315,-1,1315,-106,1315,-22,1315],[-2,1315,-1,0,-4,0,-5,1315,-8,1237,-4,1315,-27,1315,1315,1315,-2,1315,-6,1315,-1,1315,-106,1315,-22,1315],[-4,0,-4,0,-11,1317],[-4,0,-4,0,-3,1231,-143,1318],[-4,0,-4,0,-3,1231,-142,1319],[-4,0,-4,0,-146,1137,1138],[-2,947,-1,0,-4,0,-47,950,951,952,-2,953,-8,954,-46,1320,-59,955,-22,956],[-2,1321,-1,0,-4,0,-5,1321,-8,1321,-4,1321,-4,1241,-22,1321,1321,1321,-2,1321,-6,1321,-1,1321,-106,1321,-22,1321],[-2,1249,-1,0,-4,0,-5,1249,-8,1249,-4,1249,-4,1249,-22,1249,1249,1249,-2,1249,-6,1249,-1,1249,-106,1249,-22,1249],[-2,1321,-1,0,-4,0,-5,1321,-8,1321,-4,1321,-27,1321,1321,1321,-2,1321,-6,1321,-1,1321,-106,1321,-22,1321],[-2,947,-1,0,-4,0,-11,1139,-14,1247],[-2,1322,-1,0,-4,0,-5,1322,-6,1322,-1,1322,-4,1322,-4,1244,-22,1322,1322,1322,-2,1322,-6,1322,-1,1322,-106,1322,-22,1322],[-2,1323,-1,0,-4,0,-5,1323,-6,1323,-1,1323,-4,1323,-5,1245,-21,1323,1323,1323,-2,1323,-6,1323,-1,1323,-106,1323,-22,1323],[-2,1324,-1,0,-4,0,-5,1324,-6,1324,-1,1324,-4,1324,-4,1324,-22,1324,1324,1324,-2,1324,-6,1324,-1,1324,-106,1324,-22,1324],[-2,1325,-1,0,-4,0,-5,1325,-6,1325,-1,1325,-4,1325,-5,1325,-21,1325,1325,1325,-2,1325,-6,1325,-1,1325,-106,1325,-22,1325],[-2,1326,-1,0,-4,0,-5,1326,-6,1326,-1,1326,-4,1326,-27,1326,1326,1326,-2,1326,-6,1326,-1,1326,-106,1326,-22,1326],[-4,0,-4,0,-12,1327],[-4,0,-4,0,-12,1328],[-4,1329,-4,0,-3,1330,-3,1331,1331,-2,1250,1332,-19,1331,1331,1331,-26,1331],[-4,0,-4,0,-12,1333],[-4,0,-4,0,-7,1334,1335,-23,1336,1337,1338,-26,1339],[-4,0,-4,0,-7,1334,1335,-23,1336,1337,1338],[-4,0,-4,0,-7,1340,1340,-3,1340,-19,1340,1340,1340,-2,1341,1342,1343,-105,1344],[-4,0,-4,0,-7,1340,1340,-3,1340,-19,1340,1340,1340],[-4,1329,-4,0,-3,1330,-8,1345],[-1,1346,-2,0,-4,0,-22,1347,1348],[-4,0,-4,0,-12,1349,-155,1349],[-4,0,-4,0,-12,1349,-11,1256,1257,-142,1349],[-4,0,-4,0,-12,1350,-11,1350,1350,-142,1350],[-2,1351,-1,0,-1,1351,-2,0,-11,1351],[-4,0,-4,0,-12,1352],[-4,0,-4,0,-12,1353],[-4,1329,-4,0,-3,1330,-7,1250,1332,-48,1152],[-4,0,-4,0,-108,1354],[-2,1355,-1,0,-4,0,-5,1355,-13,1355,-27,1355,1355,1355,-2,1355,-8,1355,-46,1355,-59,1355,-22,1355],[-2,1356,-1,0,-4,0,-5,1356,-13,1356,-27,1356,1356,1356,-2,1356,-8,1356,-46,1356,-59,1356,-22,1356],[-2,947,-1,0,-4,0,-19,1357,-39,1357,-48,1357],[-2,1358,-1,0,-4,0,-19,1358,-39,1358,-48,1358],[-2,1270,-1,1271,-4,0,-3,1272,-7,1273,1359,-6,1359,-39,1359,-48,1359,-32,1360],[-2,1270,-1,1271,-4,0,-3,1272,-7,1361,1361,-6,1361,-39,1361,-48,1361,-32,1361],[-2,1362,-1,1362,-4,0,-3,1362,-7,1362,1362,-6,1362,-39,1362,-48,1362,-32,1362],[-2,1363,-1,1363,-4,0,-3,1363,-7,1363,1363,-6,1363,-39,1363,-48,1363,-32,1363],[-4,0,-4,0,-53,1364,-3,1365,1366],[-4,0,-4,0,-53,1367,-3,1367,1367],[-2,1368,1368,0,-4,0],[-4,0,-4,0,-12,1369],[-4,0,-4,0,-7,1370],[-4,0,-4,0,-7,1371],[-4,0,-4,0,-12,1372],[-9,0,-12,1373],[-9,0,-12,1374],[-1,1375,1375,-1,1375,1375,1375,1375,1375,0,-4,1375,1375,-1,1375,1375,-2,1375,-129,1375,-3,1375,1375,1375,-45,1375],[-9,0,-12,1376],[-1,1377,1377,-1,1377,1377,1377,1377,1377,0,-4,1377,1377,-1,1377,1377,-2,1377,-129,1377,-3,1377,1377,1377,-45,1377],[-1,1378,1378,-1,1378,1378,1378,1378,1378,0,-4,1378,1378,-1,1378,1378,-2,1378,-129,1378,-3,1378,1378,1378,-45,1378],[-1,1379,1379,-1,0,-4,0,-14,1379,-37,1379,-6,1379,-4,1379,-28,1379,-2,1379,1379,1379,-9,1379,-27,1379,-9,1379,1379,-24,1379,-12,1379,1379,1379,1379,1379,1379],[-1,1380,1380,-1,0,-4,0,-14,1380,-37,1380,-6,1380,-4,1380,-28,1380,-2,1380,1380,1380,-9,1380,-27,1380,-9,1380,1380,-24,1380,-12,1380,1380,1380,1380,1380,1380],[-1,1381,1381,-1,1381,1381,1381,1381,1381,0,-4,1381,1381,-2,1381,-2,1381,-129,1381,-51,1381],[-2,947,-1,0,-4,0,-5,1382,-5,1139,-7,1382,-6,1140,-2,1141,-17,1382,1382,1382,-2,1382,-6,1382,-1,1382,-106,1382,-22,1382],[-2,1382,-1,0,-4,0,-5,1382,-8,1237,-4,1382,-27,1382,1382,1382,-2,1382,-6,1382,-1,1382,-106,1382,-22,1382],[-2,1383,-1,0,-4,0,-5,1383,-5,1383,1383,-5,1383,1383,-6,1383,-2,1383,-17,1383,1383,1383,-2,1383,-6,1383,-1,1383,-106,1383,-22,1383],[-4,0,-4,0,-12,1384],[-4,0,-4,0,-108,1385],[-2,947,-1,0,-4,0,-47,950,951,952,-2,953,-8,954,-46,1386,-59,955,-22,956],[-2,1387,-1,0,-4,0,-47,1387,1387,1387,-2,1387,-8,1387,-46,1387,-59,1387,-22,1387],[-2,1388,-1,0,-4,0,-5,1388,-8,1388,-4,1388,-27,1388,1388,1388,-2,1388,-6,1388,-1,1388,-106,1388,-22,1388],[-2,1389,-1,0,-4,0,-5,1389,-8,1389,-4,1389,-27,1389,1389,1389,-2,1389,-6,1389,-1,1389,-106,1389,-22,1389],[-2,1390,-1,0,-4,0,-5,1390,-8,1390,-4,1390,-27,1390,1390,1390,-2,1390,-6,1390,-1,1390,-106,1390,-22,1390],[-2,1243,-1,0,-4,0,-5,1243,-8,1243,-4,1243,-4,1244,-22,1243,1243,1243,-2,1243,-6,1243,-1,1243,-106,1243,-22,1243],[-2,1391,-1,0,-4,0,-5,1391,-6,1391,-1,1391,-4,1391,-4,1391,-22,1391,1391,1391,-2,1391,-6,1391,-1,1391,-106,1391,-22,1391],[-2,1392,-1,0,-4,0,-5,1392,-6,1392,-1,1392,-4,1392,-5,1392,-21,1392,1392,1392,-2,1392,-6,1392,-1,1392,-106,1392,-22,1392],[-2,1393,-1,0,-4,0,-5,1393,-6,1393,-1,1393,-4,1393,-4,1393,-22,1393,1393,1393,-2,1393,-6,1393,-1,1393,-106,1393,-22,1393],[-2,1394,-1,0,-4,0,-5,1394,-6,1394,-1,1394,-4,1394,-5,1394,-21,1394,1394,1394,-2,1394,-6,1394,-1,1394,-106,1394,-22,1394],[-2,1395,-1,0,-4,0,-5,1395,-6,1395,-1,1395,-4,1395,-4,1395,1395,-21,1395,1395,1395,-2,1395,-6,1395,-1,1395,-106,1395,-22,1395],[-2,1396,-1,0,-4,0,-5,1396,-6,1396,-1,1396,-4,1396,-4,1396,1396,-21,1396,1396,1396,-2,1396,-6,1396,-1,1396,-106,1396,-22,1396],[-4,1329,-4,0,-3,1330,-8,1397],[-2,1398,-1,0,-4,0,-5,1398,-6,1398,-1,1398,-4,1398,-4,1398,1398,-21,1398,1398,1398,-2,1398,-6,1398,-1,1398,-106,1398,-22,1398],[-4,1399,-4,0,-3,1399,-8,1399],[-4,1400,-4,0,-3,1400,-8,1400],[-1,1246,947,-1,0,-4,0],[-1,1401,1401,-1,0,-4,0],[-1,1402,1402,-1,0,-4,0],[-1,1403,1403,-1,0,-4,0],[-4,0,-4,0,-7,1404,1404,-3,1404,-19,1404,1404,1404],[-1,1405,-2,0,-4,0],[-4,0,-4,0,-7,1406,1406,-3,1406,-19,1406,1406,1406],[-4,1329,-4,0,-3,1330,-8,1407],[-1,1346,-2,0,-4,0,-22,1347,1348,-84,1408],[-1,1409,-2,0,-4,0,-22,1409,1409,-84,1409],[-4,0,-4,0,-14,1410,-153,1411],[-4,0,-4,0,-14,1412,-153,1412],[-4,0,-4,0,-14,1413,-153,1413],[-4,0,-4,0,-36,1414],[-4,0,-4,0,-108,1415],[-4,0,-4,0,-12,1416,-11,1416,1416,-142,1416],[-4,0,-4,0,-12,1417,-11,1417,1417,-142,1417],[-4,0,-4,0,-12,1418,-11,1418,1418,-142,1418],[-4,0,-4,0,-12,1419,-11,1419,1419,-142,1419],[-4,0,-4,0,-12,1420],[-2,1421,-1,0,-4,0,-5,1421,-13,1421,-27,1421,1421,1421,-2,1421,-8,1421,-46,1421,-59,1421,-22,1421],[-2,1422,-1,0,-4,0,-12,1422,-6,1422,-39,1422,-48,1422],[-2,1270,-1,1271,-4,0,-3,1272,-7,1273,1423,-6,1423,-39,1423,-48,1423,-32,1423],[-4,0,-4,0,-60,1424],[-2,1425,-1,1425,-4,0,-3,1425,-7,1425,1425,-6,1425,-39,1425,-48,1425,-32,1425],[-2,1270,-1,1271,-4,0,-3,1272,-7,1273,1426],[-4,0,-4,0,-53,1427],[-2,1428,-1,0,-4,0,-7,1428,-4,1428,-1,1428,-29,1428,1428,-1,1428,1428,1428,-2,1428,-8,1428,-106,1428,-22,1428,1428],[-4,0,-4,0,-53,1429],[-2,1430,-1,0,-4,0,-7,1430,-4,1430,-1,1430,-29,1430,1430,-1,1430,1430,1430,-2,1430,-8,1430,-106,1430,-22,1430,1430],[-9,0,-12,1431],[-1,1432,1432,-1,1432,1432,1432,1432,1432,0,-4,1432,1432,-1,1432,1432,-2,1432,-129,1432,-3,1432,1432,1432,-45,1432],[-1,1433,1433,-1,1433,1433,1433,1433,1433,0,-4,1433,1433,-1,1433,1433,-2,1433,-129,1433,-3,1433,1433,1433,-45,1433],[-1,1434,1434,-1,1434,1434,1434,1434,1434,0,-4,1434,1434,-1,1434,1434,-2,1434,-129,1434,-3,1434,1434,1434,-45,1434],[-2,1435,-1,0,-4,0,-5,1435,-8,1237,-4,1435,-27,1435,1435,1435,-2,1435,-6,1435,-1,1435,-106,1435,-22,1435],[-4,0,-4,0,-12,1436],[-4,0,-4,0,-12,1437],[-4,0,-4,0,-11,1250,-49,1152],[-2,1438,-1,0,-4,0,-5,1438,-5,1438,-6,1438,1438,-6,1438,-2,1438,-17,1438,1438,1438,-2,1438,-6,1438,-1,1438,-106,1438,-22,1438],[-4,0,-4,0,-59,1439],[-2,1440,-1,0,-4,0,-47,1440,1440,1440,-2,1440,-8,1440,-46,1440,-59,1440,-22,1440],[-2,1441,-1,0,-4,0,-5,1441,-6,1441,-1,1441,-4,1441,-4,1441,1441,-21,1441,1441,1441,-2,1441,-6,1441,-1,1441,-106,1441,-22,1441],[-4,1442,-4,0,-3,1442,-8,1442],[-4,0,-4,0,-12,1443],[-4,0,-4,0,-12,1340],[-4,0,-4,0,-12,1331],[-4,0,-4,0,-12,1444],[-4,0,-4,0,-7,1334,-25,1337],[-4,0,-4,0,-8,1335,-23,1336],[-4,0,-4,0,-7,1445,1445,-3,1445,-19,1445,1445,1445],[-4,0,-4,0,-59,1446],[-1,1447,-2,0,-4,0,-22,1447,1447,-84,1447],[-4,0,-4,0,-14,1448,-153,1448],[-4,0,-4,0,-59,1449],[-4,0,-4,0,-12,1450,-11,1450,1450,-142,1450],[-2,1451,-1,0,-4,0,-12,1451,-6,1451,-39,1451,-48,1451],[-2,1452,-1,1452,-4,0,-3,1452,-7,1452,1452,-6,1452,-39,1452,-48,1452,-32,1452],[-2,1453,-1,0,-4,0,-7,1453,-4,1453,-1,1453,-29,1453,1453,-1,1453,1453,1453,-2,1453,-8,1453,-106,1453,-22,1453,1453],[-1,1454,1454,-1,1454,1454,1454,1454,1454,0,-4,1454,1454,-1,1454,1454,-2,1454,-129,1454,-3,1454,1454,1454,-45,1454],[-2,1455,-1,0,-4,0,-5,1455,-5,1455,-7,1455,-6,1455,-2,1455,-17,1455,1455,1455,-2,1455,-6,1455,-1,1455,-106,1455,-22,1455],[-2,947,-1,0,-4,0,-19,949,-39,1456,-48,1457],[-4,0,-4,0,-14,1458,-153,1458],[-4,0,-4,0,-12,1459],[-4,0,-4,0,-108,1460],[-1,1461,-2,0,-4,0,-22,1461,1461,-84,1461],[-1,1462,-2,0,-4,0,-22,1462,1462,-84,1462]],
	    [[-1,1,7,5,-1,8,-110,3,13,14,17,16,15,18,19,-10,20,-9,21,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-1,2,4,6,10,-2,11],[-2,166,-2,8,-345,165,167,-2,11],[-356,170,-7,169,172,-3,171],[-119,192,-2,18,19,-10,20,-9,21,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-124,195,197,198,-2,199,-2,196,200,-169,204,-13,201,88,90,-3,89,-23,91],[-137,206,-8,208,156,-29,207,-2,157,162,-3,159,-14,155,-25,160],[-141,214,213,212,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-267,219],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,259,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,272,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,273,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,274,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,275,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,276,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,277,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,278,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,279,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,280,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-221,282,-21,284,126,127,-2,129],[-221,289,-21,288,126,127,-2,129],[-184,263,-16,264,-12,290,291,77,78,132,-6,76,-1,83,-14,265,85,126,127,-2,129,-6,262,-6,82,-19,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-320,297,295,296,-25,298],[-299,308,306,-4,317],[-301,321,319,-2,330],[-327,333,-11,331,-1,332],[-327,338],[-335,340,339],[-331,350,349],[-326,353,-2,354,-14,355],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,368,369,372,371,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-294,379,377],[-251,386,385,382],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,400,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,402,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-221,406],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-17,407,260,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-170,409],[-178,411,412,-103,414,416,417,-30,413,415,88,90,-3,89,-23,91],[-145,421,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-314,426,-2,428,88,90,-3,89,-23,91],[-314,429,-2,428,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,431,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,434,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-150,435],[-202,438,439,-112,437,415,88,90,-3,89,-23,91],[-316,442,415,88,90,-3,89,-23,91],[-182,444,445,-99,447,416,417,-30,446,415,88,90,-3,89,-23,91],[-360,448,451,452,-2,172,-3,455],[-360,456,451,452,-2,172,-3,455],[-360,459,451,452,-2,172,-3,455],[-366,464,462,463],[-353,472,471,-17,473],[-130,482],[-127,490,487,-2,491,-1,492,-183,493,88,90,-3,89,-23,91],[-130,494],[-130,495],[-147,497,-37,159,-7,47,136,-4,134,498,-12,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-6,262,-6,82,-3,499,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-135,503,500,-1,504,-178,505,88,90,-3,89,-23,91],[-141,507,-2,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,508,-2,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,509,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,510,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,511,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-7,512,51,52,53,54,55,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-8,513,52,53,54,55,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-9,514,53,54,55,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-10,515,54,55,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-11,516,55,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-12,517,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-12,518,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-12,519,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-12,520,56,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,521,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,522,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,523,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,524,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,525,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-13,526,57,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-14,527,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-14,528,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-14,529,58,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-15,530,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-15,531,59,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-16,532,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-16,533,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-16,534,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-14,134,-1,264,-11,261,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-16,535,60,61,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-207,542,547,-31,546,-13,536,-1,539,544,550,551,540,-42,552,-4,553,106,105,-4,541,-1,267,545,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-242,558,-73,556,415,88,90,-3,89,-23,91],[-202,561,439,-112,560,415,88,90,-3,89,-23,91],[-327,563],[-318,564,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,565,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-1,570,569,566,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,571,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,573,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-318,574,90,-3,89,-23,91],[-221,575,-21,288,126,127,-2,129],[-344,577],[-320,579,-1,578,-25,298],[-299,581,-5,317],[-304,582,-1,603,604],[-301,606,-3,330],[-327,608,-13,607],[-327,609],[-344,610],[-340,611,-3,612],[-327,615,-7,616],[-327,617,-3,618],[-327,619,-1,620,-14,355],[-264,621],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-2,626,625,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,628,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-316,629,415,88,90,-3,89,-23,91],[-294,632],[-297,633,-19,634,88,90,-3,89,-23,91],[-251,638],[-246,639,641,-1,643,640],[-283,647,416,417,-30,646,415,88,90,-3,89,-23,91],[-318,648,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,649,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,650,-3,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-13,82,-3,651,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,654,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-1,653,38,-3,39,29,-7,655,-7,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-261,658],[-261,660],[-257,667,550,551,-26,662,663,-2,665,-1,666,-10,552,-4,553,106,105,-5,668,415,545,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-264,670,-18,677,416,417,-2,672,674,-1,675,676,671,-22,668,415,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,678,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,680,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-154,681,683,-1,689,-22,682,688,-2,263,-8,47,136,-4,134,-1,264,-8,44,43,685,687,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,691,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,695,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-173,697,698],[-202,701,439],[-204,703,705,706,707,547,-31,546,-16,710,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-184,263,-14,134,-1,264,-11,712,72,74,77,78,132,73,133,-4,76,-1,83,-14,265,85,126,127,-2,129,-6,262,-6,82,-19,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-187,714,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-261,723],[-261,724],[-361,727,452,-2,172,-3,455],[-4,729],[-365,172,-3,732],[-365,172,-3,734],[-6,745,748,747,-343,744,-2,11,-1,740,738,741,-10,746,743,751],[-366,758,-1,757],[-353,760,-18,473],[-132,762,-170,204],[-126,763,-2,764],[-133,765,-183,201,88,90,-3,89,-23,91],[-261,780],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,781,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-257,784,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-257,785,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,786,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-240,787,-16,788,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-187,791,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-242,558],[-202,793,439],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,800,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-327,802],[-329,803,-14,355],[-329,804,-14,355],[-327,806],[-344,807],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-1,811,810,809,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-187,813,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-297,815,-19,634,88,90,-3,89,-23,91],[-249,817,816],[-251,386,385,818],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,821,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-6,827,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-179,829,-103,414,416,417,-30,413,415,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,830,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-316,834,415,88,90,-3,89,-23,91],[-261,836],[-283,677,416,417,-5,839,676,837,-22,668,415,88,90,-3,89,-23,91],[-283,844,416,417,-30,843,415,88,90,-3,89,-23,91],[-261,845],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,850,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,854,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-158,857,-19,856,412,-103,859,416,417,-30,858,415,88,90,-3,89,-23,91],[-158,860,-23,444,445,-99,862,416,417,-30,861,415,88,90,-3,89,-23,91],[-155,863,-1,689,-23,866,-2,263,-14,134,-1,264,-11,864,72,74,77,78,132,73,133,-4,76,-1,83,-14,265,85,126,127,-2,129,-6,262,-6,82,-19,266,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,-1,267,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-174,869],[-150,871],[-204,872,705,706,707,547,-31,546,-16,710,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-206,875,707,547,-31,546,-16,710,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-207,876,547,-31,546,-16,710,550,551,-43,552,-4,553,106,105,-7,711,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-187,877,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-183,882,-99,447,416,417,-30,446,415,88,90,-3,89,-23,91],[-4,884],[-4,885],[-6,888,748,747,-354,887,-1,172,-3,891,-3,890],[-6,745,748,747,-343,744,-2,11,-1,740,896,741,-10,746,743,751],[-364,900,172,-3,171],[-6,745,748,747,-343,744,-2,11,-3,901,-10,746,743,751],[-372,905],[-356,910],[-127,913,-3,491,-1,492,-183,493,88,90,-3,89,-23,91],[-133,914,-183,201,88,90,-3,89,-23,91],[-135,916,-2,504,-178,505,88,90,-3,89,-23,91],[-317,917,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,918,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-207,542,547,-31,546,-15,920,544,550,551,540,-42,552,-4,553,106,105,-4,541,-1,267,545,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,921,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-186,922,924,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-240,787],[-187,929,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-187,933,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-1,936,-2,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,571,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-329,937,-14,355],[-329,938,-14,355],[-328,939,-1,120],[-184,263,-8,47,136,-4,134,-1,264,-11,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,940,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-187,941,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,945,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-283,949,416,417,-30,948,415,88,90,-3,89,-23,91],[-257,667,550,551,-26,951,-3,953,-1,666,-10,552,-4,553,106,105,-5,668,415,545,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91],[-283,677,416,417,-5,954,676,-23,668,415,88,90,-3,89,-23,91],[-264,957,-18,677,416,417,-3,959,-1,675,676,958,-22,668,415,88,90,-3,89,-23,91],[-145,960,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,961,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,962,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,963,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,966,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,968,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,969,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,971,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-158,857,-124,975,416,417,-30,974,415,88,90,-3,89,-23,91],[-158,860,-124,975,416,417,-30,974,415,88,90,-3,89,-23,91],[-165,976],[-145,978,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-175,979,-107,981,416,417,-30,980,415,88,90,-3,89,-23,91],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,986,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-189,989,990,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-4,991],[-6,993,748,747,-365,996,995,994,997],[-374,996,995,1005,997],[-364,1007,172,-3,171],[-364,1008,172,-3,171],[-360,1010,451,452,-2,172,-3,455],[-360,1012,451,452,-2,172,-3,455],[-360,1014,451,452,-2,172,-3,455],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1017,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-356,1019],[-190,1025,-18,1024,-73,677,416,417,-5,720,676,-23,668,415,88,90,-3,89,-23,91],[-186,1026,924,717,716,719,-92,677,416,417,-5,720,676,718,-22,668,415,88,90,-3,89,-23,91],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1031,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-329,1035,-14,355],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1040,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-283,677,416,417,-5,839,676,1047,-22,668,415,88,90,-3,89,-23,91],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1052,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1054,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1057,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1060,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1063,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1064,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-166,1066,1068,1067],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1073,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1075,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-374,1080,-2,997],[-364,1082,172,-3,171],[-9,1086,1091,1089,1094,1090,1088,1097,1095,-2,1096,-5,1092,-1,1124,-4,1125,-9,1123,-38,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-139,1127,1129,214,213,1130,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-139,1132,1129,214,213,1130,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1134,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1141,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1148,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1150,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1154,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-329,1156,-14,355],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1158,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1160,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1164,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1166,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1169,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1171,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1172,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1173,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1174,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1176,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1177,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-167,1181,1179],[-166,1182,1068],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1184,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-150,1186],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1187,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-9,1192,1091,1089,1094,1090,1088,1097,1095,-2,1096,-5,1092,-1,1124,-4,1125,-9,1123,-38,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-10,1197,-1,1094,1196,-1,1097,1095,-2,1096,-5,1092,-1,1124,-4,1125,-9,1123,-38,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-12,1198,-2,1097,1095,-2,1096,-5,1199,-1,1124,-4,1125,-9,1123,-38,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-19,1209,-5,1199,-1,1124,-4,1125,-9,1123,-59,1210,-1,1208,1207,-1,1211,-3,1110,-3,1212],[-79,1214,1213,-1,1102,-1,1121,1103,1216,1215,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-82,1221,-1,1121,1222,-6,1112,1113,1114,-1,1115,-3,1116,1122],[-84,1121,1223,-6,1224,1113,1114,-1,1115,-3,1116,1122],[-84,1225,-16,1122],[-111,1110,-3,1228],[-112,1232,1230,1231],[-111,1110,-3,1238],[-111,1110,-3,1239],[-89,1108,1241,1240,-19,1110,-3,1107],[-100,1244,-10,1110,-3,1243],[-83,1246,-16,1247],[-139,1251,1129,214,213,1130,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-139,1255,1129,214,213,1130,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1264,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1266,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1269,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1273,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1275,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1279,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1042,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-1,1282,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1287,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1288,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1289,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1290,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1291,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-167,1292],[-167,1181],[-141,214,213,1296,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-21,1303,-53,1306,-1,1302,1305],[-41,1310,-1,1313,-1,1311,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-28,1326,-49,1328],[-36,1329,1331,1333,1336,1335,-20,1334,-49,1110,-3,1338],[-19,1209,-5,1199,-1,1124,-4,1125,-9,1123,-59,1210,-1,1208,1339,-1,1211,-3,1110,-3,1212],[-81,1340,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-19,1343,-5,1199,-1,1124,-4,1125,-9,1123,-59,1210,-1,1344,-2,1211,-3,1110,-3,1212],[-79,1347,-2,1102,-1,1121,1103,1216,1215,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-82,1102,-1,1121,1103,1348,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-84,1121,1349,-6,1224,1113,1114,-1,1115,-3,1116,1122],[-100,1244],[-112,1351,-1,1350],[-97,1353],[-99,1359],[-111,1110,-3,1243],[-100,1361],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1372,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1374,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1380,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,828,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-5,1382,988,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-145,1388,-2,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-15,47,136,-4,134,-10,44,43,42,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-141,214,213,1390,215,24,25,156,32,26,40,30,27,31,-2,142,-2,33,34,35,37,36,143,-4,28,-2,38,-3,39,29,-2,157,162,-3,159,-7,47,136,-4,134,155,-9,44,43,42,48,72,74,77,78,132,73,133,-4,76,160,83,-2,69,-12,85,126,127,-2,129,-13,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,138,80,137,87,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-21,1394,-53,1306,-2,1305],[-23,1396,-17,1397,-1,1313,-1,1311,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-77,1399],[-77,1400],[-70,1404,-40,1110,-3,1405],[-44,1406],[-49,1410,1408,-1,1412,1409],[-55,1414,-1,1322,-3,1323,-49,1110,-3,1338],[-46,1315,1415,1317,-2,1318,-2,1316,1319,1416,1322,-3,1323,1419,-3,1421,1423,1420,1422,-1,1426,-2,1425,-36,1110,-3,1417],[-37,1430,1333,1336,1335,-20,1334,-49,1110,-3,1338],[-33,1433,1432,1431],[-36,1436,1331,1333,1336,1335,-20,1334,-45,1437,-3,1110,-3,1438],[-102,1444,-4,1211,-3,1110,-3,1212],[-108,1448,1446,1445],[-95,1452,-15,1110,-3,1453],[-81,1456,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-184,263,-8,47,136,-4,134,-1,264,-8,44,43,1463,48,72,74,77,78,132,73,133,-4,76,-1,83,-2,69,-11,265,85,126,127,-2,129,-6,262,-6,82,-3,45,-1,46,49,50,51,52,53,54,55,56,57,58,59,60,61,86,-13,84,-1,81,-4,97,-4,98,106,105,96,99,95,-1,80,137,373,88,90,-3,89,-4,110,-1,120,-2,109,117,-2,108,114,-3,107,111,112,-2,91,-4,193,-2,11],[-23,1473,-17,1474,-1,1313,-1,1311,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-41,1475,-1,1313,-1,1311,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-78,1479],[-15,1097,1482,1481,1480,-62,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-43,1313,-1,1483,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-44,1484],[-46,1485,-1,1317,-2,1318,-3,1486,-1,1322,-3,1323,-49,1110,-3,1338],[-49,1487],[-52,1488],[-55,1489,-1,1322,-3,1323,-49,1110,-3,1338],[-55,1490,-1,1322,-3,1323,-49,1110,-3,1338],[-58,1495,-1,1493],[-63,1500,1501,1499],[-63,1509,1508,1507],[-73,1510],[-58,1495,-1,1515],[-26,1517,-2,1519,1518,1520,-40,1523],[-15,1097,1482,1481,1525,-62,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-33,1433,1526],[-37,1527,1333,1336,1335,-20,1334,-49,1110,-3,1338],[-81,1530,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-106,1532,-1,1448,1446,1533],[-108,1535],[-108,1448,1446,1536],[-98,1537],[-41,1548,-1,1313,-1,1311,1315,1312,1317,-2,1318,-2,1316,1319,-1,1322,-3,1323,-8,1314,-40,1110,-3,1324],[-22,1549,-13,1550,1331,1333,1336,1335,-20,1334,-45,1551,-3,1110,-3,1552],[-15,1097,1555,-64,1099,1102,-1,1121,1103,1100,-1,1101,1108,1105,1104,1112,1113,1114,-1,1115,-3,1116,1122,-9,1110,-3,1107],[-49,1410,1408],[-58,1557],[-67,1558,-1,1559,-1,1426,-2,1425,-36,1110,-3,1560],[-67,1561,-1,1559,-1,1426,-2,1425,-36,1110,-3,1560],[-69,1562,-41,1110,-3,1560],[-111,1110,-3,1563],[-111,1110,-3,1564],[-29,1519,1568,1520,-40,1523],[-108,1448,1446,1533],[-64,1579],[-63,1580],[-19,1209,-5,1199,-1,1124,-4,1125,-9,1123,-59,1210,-1,1208,1581,-1,1211,-3,1110,-3,1212],[-31,1582,-40,1523],[-67,1583,-1,1559,-1,1426,-2,1425,-36,1110,-3,1560],[-67,1584,-1,1559,-1,1426,-2,1425,-36,1110,-3,1560]],
	    [[0,-4,1,-3,2,-6,3,-5,4,5,-17,6,-6,7,-13,8,9,10,11,12,13,14,-1,15,16,-1,17,18,19,-14,20,-12,21,22,-6,23,24,-1,25,-2,26,-2,27,-2,28,-1,29,-2,30,31,32,33,-3,34,-2,35,36,-4,37,-3,38,39,40,-1,41,42,-4,43,-2,44,45,-5,46,47,48,-1,49,-18,50,-2,2,51,-7,52,-1,53,54,-2,55,56,-2,57,-3,58,59,60,-14,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,-9,86,87,88,-5,89,-4,90,-1,91,-1,92,93,94,-3,95,-1,96,-1,97,-10,98,-11,99,100,-11,101,102,-1,103,104,-3,105,-9,106,-3,107,-14,108,109,-4,110,-1,111,112,113,-6,114,-14,115,-2,116,117,118,-2,119,-1,120,-2,121,122,-3,123,124,125,-1,126,127,-1,128,-7,129,-1,130,-1,131,-2,132,133,-1,134,-2,135,136,137,-1,138,-2,139,140,-1,137,141,-1,137,-2,142,-8,143,-11,144,-1,145,146,-54,147,-1,148,-4,149,150,-4,151,152,-1,153,-1,154,155,-11,156,-4,157,-13,158,159,-14,160,-3,161,-11,162,-6,163,164,-9,165,166,167,-8,168,-4,169,-1,170,-4,171,-3,172,-1,173,-2,174,-3,175,-4,176,-1,177,-1,178,7,179,-1,180,-6,181,-2,182,-1,183,-2,184,-2,185,-4,186,-8,187,-3,188,-1,189,-2,190,-4,191,-2,192,193,-1,2,-3,194,-8,195,-10,196,-2,197,-2,198,-2,199,200,201,-4,202,203,-5,204,205,-3,206,-4,207,-3,208,209,210,-5,211,212,-4,213,-5,214,-9,215,-1,216,-6,217,-3,218,219,220,221,-1,222,223,224,-1,225,-2,121,122,-1,135,136,-2,226,227,228,229,-1,230,-9,231,232,-1,233,-5,234,-3,235,-3,236,-1,237,-2,238,239,240,-2,241,242,-17,243,-1,244,-3,245,-5,246,-5,247,-12,248,-6,249,250,-1,251,-2,252,-1,253,254,-3,255,-6,256,257,-9,258,-10,259,-3,137,260,137,261,137,262,263,-5,264,-6,265,266,-3,267,268,-2,269,270,-9,271,-1,272,-1,273,-1,274,275,-1,276,277,-1,278,279,-3,280,281,-1,282,-1,283,284,-12,285,-3,286,287,-7,288,-1,289,290,291,292,-1,293,-4,294,-6,295,296,297,298,-1,299,-3,300,-4,301,-5,302,-2,303,-2,304,-2,305,306,-5,307,-3,308,-9,309,310,-1,311,-4,312,-2,313,314,-2,315,-2,316,-10,287,-4,317,318,319,320,321,322,323,-5,324,-1,325,-5,326,292,292,-2,327,-3,328,-9,329,293,-1,330,-1,331,332,-13,333,-1,334,-8,335,336,-13,337,-8,338,-6,339,340,-3,341,342,-4,343,344,-4,345,346,347,-8,348,349,350,-6,323,-5,351,352,-2,292,-3,353,-6,354,-9,355,-23,356,-1,357,-4,358,359,360,361,-2,362,363,364,-1,365,-1,366,-3,367,346,-3,368,369,370,-2,371,372,373,-1,374,-1,375,-4,367,376,-3,351,-1,377,378,379,-4,380,-20,381,-2,382,-4,383,-4,384,-6,385,-4,386,387,-7,388,389,390,-5,385,-1,391,-15,392,-2,392,-26,393,394,-4,395,396,-8,397,398,323,-6]]
	    ]).map(e=>e.map(s=>s.flatMap(d=> d < 0 ? (new Array(-d)).fill(-1) : d)))
	);

	const 
	    ERROR = 0,
	    ACCEPT = 1,
	    SHIFT = 2,
	    REDUCE = 3,
	    FORK_REDUCE = 4;

	function deepClone(obj, visited = new Map()) {

	    let out = Object.create(Object.getPrototypeOf(obj));

	    if (Array.isArray(obj))
	        out = obj.slice();

	    for (const key of Object.getOwnPropertyNames(obj)) {
	        const description = Object.getOwnPropertyDescriptor(obj, key);
	        Object.defineProperty(out, key, description);
	    }

	    for (const a in obj) {

	        const val = obj[a];

	        if(typeof val == "object"){
	            
	            if(!visited.has(val)){
	                visited.set(val, null);
	                visited.set(val, visited.set(val, null));
	            }

	            out[a] = visited.get(val);
	        }
	    }

	    return out;
	}

	/*
	    Parses an input. Returns an object with parse results and an error flag if parse could not complete.
	    l: Lexer - lexer object with an interface defined in candlefw/whind.
	    e: Environment object containing user defined parse action functions.
	    entry: the starting state in the parse table. 
	    data: parser data including look up tables and default parse action functions.
	*/
	function parser(l, data = null, e = {}, entry = 0, sp = 1, len = 0, off = 0, o = [], state_stack = [0, entry], SKIP_LEXER_SETUP = false) {

	    if (!data)
	        return { result: [], error: "Data object is empty" };

	    //Unwrap parser objects
	    const {
	        gt: goto,
	        sym: symbols,
	        lu: token_lu,
	        sts: states,
	        sa: state_actions,
	        fns: state_action_functions,
	        eh: error_handlers,
	        gtk: getToken,
	        ty: types,
	    } = data;

	    const  { sym, keyword, any, num } = types;

	    if (!SKIP_LEXER_SETUP) {
	        l.IWS = false;
	        l.PARSE_STRING = true;
	        if (symbols.length > 0) {
	            symbols.forEach(s => { l.addSymbol(s); });
	            l.tl = 0;
	            l.next();
	        }
	    }
	    
	    if(!e.fn)
	        e.fn = e.functions;

	    let time = 1000000, // Prevent infinite loop
	        RECOVERING = 100,
	        tk = getToken(l, token_lu),
	        p = l.copy();

	    outer:

	        while (time-- > 0) {
	            
	            const 
	                map = states[state_stack[sp]],
	                fn = (tk < map.length) ? map[tk]  : -1;
	            
	            let r,
	                gt = -1;

	            if (fn == 0) {
	                /*Ignore the token*/
	                tk = getToken(l.next(), token_lu);
	                continue;
	            }

	            if (fn > 0) {
	                r = state_actions[fn - 1](tk, e, o, l, state_stack[sp - 1], state_action_functions, parser);
	            } else {

	                if (tk == keyword) {
	                    //If the keyword is a number, convert to the number type.
	                  //  if(l.ty == num)
	                  //      tk = getToken(l, token_lu, true);
	                  //  else
	                        tk = token_lu.get(l.tx);
	                    continue;
	                }
	                //*//
	                if (l.ty == sym && l.tl > 1) {
	                    // Make sure that special tokens are not getting in the way
	                    l.tl = 0;
	                    // This will skip the generation of a custom symbol
	                    l.next(l, false);

	                    if (l.tl == 1)
	                        continue;
	                }

	                if (RECOVERING > 1 && !l.END) {

	                    if (tk !== token_lu.get(l.ty)) {
	                        tk = token_lu.get(l.ty);
	                        continue;
	                    }

	                    if (!(l.ty & (l.types.ws | l.types.nl | l.types.sym))) {
	                        l.tl = 1;
	                        l.type = l.types.sym;
	                        tk = token_lu.get(l.tx);
	                        continue;
	                    }

	                    if (tk !== any) {
	                        tk = any;
	                        RECOVERING = 1;
	                        continue;
	                    }
	                }

	                //Reset the token to the original failing value;
	                l.tl = 0;
	                l.next();

	                tk = getToken(l, token_lu);

	                const recovery_token = error_handlers[state_stack[sp]](tk, e, o, l, p, state_stack[sp], (lex) => getToken(lex, token_lu));

	                if (recovery_token >= 0) {
	                    RECOVERING = 100;
	                    tk = recovery_token;
	                    continue;
	                }
	            }

	            switch (r & 7) {
	                case ERROR: // 0
	                    //IF START IS NOT AT THE HEAD TRY REDUCING INSTEAD;
	                    /* ERROR */

	                    if (tk == "$eof") {
	                        if (e.err_eof && (tk = e.err_eof(tk, o, l, p)))
	                            continue;
	                        else
	                            l.throw("Unexpected end of input");
	                    } else {
	                        if (e.err_general && (tk = e.err_general(tk, o, l, p)))
	                            continue;
	                        else
	                            l.throw(`Unexpected token [${RECOVERING ? l.next().tx : l.tx}]`);
	                    }

	                    return { result: o[0], error: true };

	                case ACCEPT: //1
	                    /* ACCEPT */
	                    break outer;

	                case SHIFT: //2

	                    /*SHIFT */
	                    o.push(l.tx);
	                    state_stack.push(off, r >> 3);
	                    sp += 2;
	                    l.next();
	                    off = l.off;
	                    tk = getToken(l, token_lu);
	                    RECOVERING++;
	                    break;

	                case REDUCE: //3
	                    /* REDUCE */
	                    len = (r & 0x7F8) >> 2;

	                    state_stack.length -= len;
	                    sp -= len;

	                    gt = goto[state_stack[sp]][r >> 11];

	                    if (gt < 0)
	                        l.throw("Invalid state reached!");

	                    state_stack.push(off, gt);

	                    sp += 2;
	                    break;

	                case FORK_REDUCE: //4
	                    /* GLALR(1) BRANCH */

	                    //Look Up Fork productions. 
	                    var
	                        fork_states_start = r >> 16,
	                        fork_states_length = (r >> 3) & 0x1FFF;

	                    for (const state of data.fm.slice(fork_states_start, fork_states_start + fork_states_length)) {

	                        let
	                            csp = sp,
	                            clen = len;

	                        const
	                            copied_lex = l.copy(),
	                            copied_output = deepClone(o),
	                            copied_state_stack = state_stack.slice(),
	                            r = state_actions[state - 1](tk, e, copied_output, copied_lex, copied_state_stack[csp - 1], state_action_functions, parser);

	                        clen = (r & 0x7F8) >> 2;

	                        copied_state_stack.length -= clen;
	                        csp -= clen;

	                        const gt = goto[copied_state_stack[csp]][r >> 11];

	                        if (gt < 0)
	                            l.throw("Invalid state reached!");

	                        copied_state_stack.push(off, gt);

	                        csp += 2;
	                        try {
	                            const result = parser(copied_lex, data, e, 0, csp, clen, off, copied_output, copied_state_stack, true);
	                            if (!result.error) {
	                                console.log("forked parse succeeded");
	                                return result;
	                            }
	                        } catch (e) {
	                            //console.log(e);
	                        }
	                        console.log("tyrying next", r);
	                    }

	                    return { result: o[0], error: false, msg: "parse failed during fork" };
	            }
	        }

	    return { result: o[0], error: false };
	}

	var lrParse = (lex, data, environment, entry_point) => parser(lex, data, environment, entry_point);

	const max = Math.max;

	parser.reduce_with_value = parser.rv = (ret, fn, plen, ln, t, e, o, l, s) => {
	    ln = max(o.length - plen, 0);
	    o[ln] = fn(o.slice(-plen), e, l, s, o, plen);
	    o.length = ln + 1;
	    return ret;
	};

	parser.reduce_with_new_value = parser.rnv = (ret, Fn, plen, ln, t, e, o, l, s) => {
	    ln = max(o.length - plen, 0);
	    o[ln] = new Fn(o.slice(-plen), e, l, s, o, plen);
	    o.length = ln + 1;
	    return ret;
	};

	parser.reduce_with_null = parser.rn = (ret, plen, t, e, o) => {
	    if (plen > 0) {
	        const ln = max(o.length - plen, 0);
	        o[ln] = o[o.length - 1];
	        o.length = ln + 1;
	    }
	    return ret;
	};

	parser.shift_with_function = parser.s = (ret, fn, t, e, o, l, s) => (fn(o, e, l, s), ret);

	function wick_compile(lex, env) {
		if (typeof lex == "string")
			lex = new whind(lex);
		return lrParse(lex, wick_parser_data, env);
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

	    setRedirect(name){
	        this.redirect = name;
	    }

	    destroy() {
	        this.ios && this.ios.forEach(io => io.destroy());
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

	    updateCached() {
	        if(this.value !== undefined)
	            this.down(this.value);
	    }

	    down(value, meta) {
	        for (let i = 0, l = this.ios.length; i < l; i++) 
	            this.ios[i].down(value, meta);
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
	        if (removeFromArray(this.ios || [], io)[0])
	            io.parent = null;
	    }

	    discardElement(ele){
	        this.scope.discardElement(ele);
	    }
	}

	class RedirectTap extends Tap{
	     constructor(scope, prop, redirect_name){
	        super(scope, prop);
	        this.redirect_name = redirect_name;
	        this.redirect = scope.getTap(redirect_name);
	     }

	     downS(model, i, m) {
	        if(model[this.prop])
	            this.redirect.downS({[this.redirect_name] : model[this.prop]}, i, m);
	    }

	    down(v, m) {
	        this.redirect.down(v, m);
	    }

	    up(value, meta) {
	        this.redirect.up(value, meta);
	    }
	}

	class UpdateTap extends Tap {
	    downS(model) {
	        for (let i = 0, l = this.ios.length; i < l; i++)
	            this.ios[i].down(model);
	    }
	    up() {}
	}

	class Scope {

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

	        this.ast = ast;
	        this.ele = element;

	        if (element)
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
	        this.temp_data_cache = null;

	        this.addToParent(parent);
	    }

	    discardElement(ele, ios = this.ios) {

	        for (let i = 0; i < ios.length; i++) {
	            const io = ios[i];
	            if (io.ele == ele) {
	                io.destroy();
	                ios.splice(i--, 1);
	            }
	        }

	        for (let i = 0; i < this.containers.length; i++) {
	            const ctr = this.containers.length;

	            if (ctr.ele == ele) {
	                this.containers.splice(i--, 1);
	                ctr.destroy();
	            }
	        }

	        const children = ele.childNodes;

	        if (children)
	            for (let i = 0; i < children.length; i++)
	                this.discardElement(children[i], ios);

	        if (ele.wick_scope)
	            ele.wick_scope.destroy();
	    }

	    purge() {
	        if (this.parent && this.parent.removeScope)
	            this.parent.removeScope(this);

	        if (this.ele && this.ele.parentNode) {
	            this.ele.parentNode.removeChild(this.ele);
	        }

	        for (const tap of this.taps.values())
	            tap.destroy();

	        while (this.scopes[0])
	            this.scopes[0].destroy();

	        //while (this.containers[0])
	        //    this.containers[0].destroy();

	        this.taps = new Map;
	        this.scopes.length = 0;
	        this.containers.length = 0;
	        this.temp_data_cache = null;
	        this.css.length = 0;
	    }

	    updateCachedData() {
	        for (const tap of this.taps.values())
	            tap.updateCached();
	    }

	    destroy() {
	        if (this.DESTROYED)
	            return;

	        try {
	            this.update({ destroying: true }, null, false, { IMMEDIATE: true }); //Lifecycle Events: Destroying <======================================================================
	        } catch (e) {
	            console.throw(e);
	        }

	        if (this.model && this.model.removeObserver)
	            this.model.removeObserver(this);

	        this.DESTROYED = true;
	        this.LOADED = false;

	        this.purge();

	        this.data = null;
	        this.taps = null;
	        this.ios = null;
	        this.ele = null;
	    }

	    addToParent(parent) {
	        if (parent)
	            parent.addScope(this);
	    }

	    addContainer(container) {
	        container.parent = this;
	        this.PENDING_LOADS++;
	        this.containers.push(container);
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

	    linkImportTaps(parent_scope = this.parent) {
	        for (const tap of this.taps.values()) {

	            tap.linkImport(parent_scope);
	        }
	    }

	    getTap(name, REDIRECT = "") {

	        if (!name) return null;

	        let tap = this.taps.get(name);

	        if (!tap) {
	            if (name == "update")
	                tap = this.update_tap = new UpdateTap(this, name);
	            else {
	                tap = (REDIRECT) ? new RedirectTap(this, name, REDIRECT) : new Tap(this, name);
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
	        //Called before model is loaded
	        this.update({ loading: true }); //Lifecycle Events: Loading <====================================================================== 

	        if (this.parent)
	            this.linkImportTaps();

	        let
	            m = null,
	            SchemedConstructor = null;

	        const
	            presets = this.ast.presets,
	            model_name = this.ast.model_name,
	            scheme_name = this.ast.scheme_name;

	        if (model_name && presets.models)
	            m = presets.models[model_name];
	        if (scheme_name && presets.schemas) {
	            SchemedConstructor = presets.schemas[scheme_name];
	        }

	        if (m)
	            model = m;
	        else if (SchemedConstructor)
	            model = new SchemedConstructor();


	        if (this.css.length > 0)
	            this.loadCSS();

	        for (const scope of this.scopes)
	            scope.load(model);

	        if (model) {

	            if (model.addObserver)
	                model.addObserver(this);

	            this.model = model;

	            //Called before model properties are disseminated
	            this.update({ model_loaded: true }); //Lifecycle Events: Model Loaded <====================================================================== 

	            for (const tap of this.taps.values())
	                tap.load(this.model, false);

	        }

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


	        if (this.taps.has(prop_name)) {
	            this.taps.get(prop_name).up(data, meta);
	        }

	        for (const scope of this.scopes) {
	            scope.update({
	                [prop_name]: data
	            }, null, true);
	            // /scope.getBadges(this);
	        }
	    }

	    update(data, changed_values, IMPORTED = false, meta = null) {

	        if (this.DESTROYED) return;

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

	        for (const scope of this.scopes)
	            scope.update(data, null, true, meta);
	    }

	    bubbleLink() {
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
	        this.update({ disconnected: true });
	    }

	    transitionIn(transition, transition_name = "trs_in") {
	        if (transition)
	            this.update({
	                [transition_name]: transition
	            }, null, false, { IMMEDIATE: true });

	        this.TRANSITIONED_IN = true;
	    }

	    transitionOut(transition, DESTROY_AFTER_TRANSITION = false, transition_name = "trs_out") {

	        this.CONNECTED = false;

	        this.DESTROY_ON_TRANSITION = DESTROY_AFTER_TRANSITION;

	        this.TRANSITIONED_IN = false;

	        let transition_time = 0;

	        if(this.out_trs)
	            this.out_trs.trs.removeEventListener("stopped", this.out_trs.fn);

	        if (transition) {
	            this.update({
	                [transition_name]: transition
	            }, null, false, { IMMEDIATE: true });

	            const trs = transition.trs || transition;

	            this.out_trs = {trs, fn:this.outTransitionStop.bind(this)};
	            
	            transition_time = trs.out_duration;

	            trs.addEventListener("stopped", this.out_trs.fn);

	        } else {
	            if(!this.out_trs)
	                this.outTransitionStop();
	        }

	        transition_time = Math.max(transition_time, 0);

	        return transition_time;
	    }

	    outTransitionStop() {

	        if (!this.TRANSITIONED_IN) {
	            this.removeFromDOM();
	            if (this.DESTROY_ON_TRANSITION) this.destroy();
	            this.DESTROY_ON_TRANSITION = false;
	        }

	        this.out_trs = null;

	        return false;
	    }
	}

	Scope.prototype.removeIO = Tap.prototype.removeIO;
	Scope.prototype.addIO = Tap.prototype.addIO;

	const err = function(...vals) {
	    return vals.join("\n");
	};

	var defaults = {
	    IO_FUNCTION_FAIL: (e, o) => {
	        return err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`, e);
	    },

	    /*
	      The Error Object should container the following. 
	      [url] a url of the file that generated the parse errors.
	      [lex] a lexer object that has the location of the parse failure.
	      [msg] a message that contains the description of the parse error. 
	    */
	    ELEMENT_PARSE_FAILURE: (e) => {
	        return err(`Problem found while parsing resource ${e.url + ""}`, e.lex.errorMessage(e.msg));
	    },
	    COMPONENT_PARSE_FAILURE: (e, o) => {
	        return err(`Problem found while parsing component defined in ${o.url + ""}`, e.trace);
	    },
	    RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
	        return err(`Error while trying to fetch ${o.url + ""}`, e);
	    },
	    SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
	        return err(`Error while trying to create function from script

${o.val + ""} 

in file ${o.url || o.origin_url}`, e);

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

	/*
	    Stores information about a components environemnt,
	    including URL location, errors generated, and loading state of dependency components
	*/

	class ComponentEnvironment {
	    constructor(presets, env, url) {
	        
	        this.functions = env.functions;

	        this.errors = [];
	        this.prst = [presets];
	        this.url = url || new URL$1;
	        this.parent = null;
	        this.res = null;
	        this.pending_load_count = 0;
	        
	        this.pending = new Promise(res => this.res = res);

	        this.ASI = true; // Automatic Semi-Colon Insertion
	        
	        if(env.resolve)
	            this.setParent(env);
	    }

	    throw(){
	        throw this.errors.map(e=>e.err + "").join("\n");
	    }
	    
	    /** 
	        Adds error statement to error stack 
	        error_message 
	    **/
	    addParseError(msg, lex, url){
	        const data = {msg, lex, url};
	        this.errors.push({msg:error(error.ELEMENT_PARSE_FAILURE, data), data});
	    }

	    get presets() {
	        return this.prst[this.prst.length - 1] || null;
	    }

	    incrementPendingLoads(){
	        this.pending_load_count++;
	    }

	    pushPresets(prst) {
	        this.prst.push(prst);
	    }

	    popPresets() {
	        return this.prst.pop();
	    }

	    setParent(parent){
	        this.parent = parent;
	        parent.incrementPendingLoads();
	    }

	    resolve() {
	        this.pending_load_count--;
	        if (this.pending_load_count < 1) {
	            if (this.parent)
	                this.parent.resolve();
	            else{
	               this.res();
	            }
	        }
	    }
	}

	const offset = "    ";

	class ElementNode {

	    constructor(env,  presets, tag = "", children = [], attribs = [],  USE_PENDING_LOAD_ATTRIB = true) {

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
	        this.env = env;
	        this.attribs = new Map((attribs || []).map(a => (a.link(this), [a.name, a])));

	        if (this.attribs.has(""))
	            this.attribs.delete("");

	        this.pending_load_attrib = USE_PENDING_LOAD_ATTRIB;

	        this.component = this.getAttribObject("component").value;

	        if (this.component)
	            presets.components[this.component] = this;

	        this.url = this.getAttribute("url") ? URL$1.resolveRelative(this.getAttribute("url"), env.url) : null;

	        this.id     = this.getAttribute("id");
	        this.class  = this.getAttribute("id");
	        this.name   = this.getAttribute("name");
	        this.slot   = this.getAttribute("slot");
	        this.pinned = "";

	        const pin = this.getAttribObject("pin");

	        if (pin.value) {
	            pin.RENDER = false;
	            this.pinned = pin.value + "$";
	        }

	        if (this.url)
	            this.loadAndParseUrl(env);

	        return this;
	    }

	    // Applies any necessary transformations to the node in preparaton of rendering the final AST. 
	    // Transforms include mappings slots, linking imported components and sorting child nodes. 
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


	        if (this.presets.components[this.tag]) {
	            return this.presets.components[this.tag].merge(this).finalize(slots_out);
	        }

	        if (this.proxied) {
	            //*
	            const e =  this.proxied.merge(this).finalize(slots_out);
	            return e;
	            /*
	            ele.slots = slots_out;
	            this.mount = ele.mount.bind(ele);
	            //*/
	            //return ele//this.proxied.merge(this);
	        }

	        this.children.sort(function(a, b) {
	            if ((a.tag == "script" && b.tag !== "script") || (a.tag == "style" && b.tag !== "style"))
	                return 1;
	            return 0;
	        });

	        return this;
	    }

	    getAttribute(name) {
	        return this.getAttribObject(name).value;
	    }

	    getAttribObject(name) {
	        return this.attribs.get(name) || { name: "", value: "" };
	    }

	    createElement() {
	        return createElement(this.tag);
	    }

	    toString(off = 0) {

	        var o = offset.repeat(off),
	            str = `\n${o}<${this.tag}`;

	        for (const attr of this.attribs.values()) {
	            if (attr.name)
	                str += ` ${attr.name}=${typeof attr.value == "object" ? attr.value + "" : `"${attr.value}"`}`;
	        }

	        if (this.SINGLE)
	            return str + "/>";


	        str += ">\n";

	        str += this.innerToString(off + 1);

	        return str + `\n${o}</${this.tag}>`;
	    }

	    innerToString(off) {
	        return this.children.map(e => e.toString()).join("");
	    }

	    /****************************************** COMPONENTIZATION *****************************************/

	    loadAST(ast) {
	        if (ast instanceof ElementNode)
	            this.proxied = ast; //.merge();
	    }

	    async loadAndParseUrl(env) {

	        var ast = null,
	            text_data = "",
	            own_env = new ComponentEnvironment(env.presets, env, this.url);

	        try {
	            own_env.incrementPendingLoads();
	            text_data = await this.url.fetchText();
	        } catch (e) {
	            error(error.RESOURCE_FETCHED_FROM_NODE_FAILURE, e, this);
	        }

	        if (text_data) {
	            const lex = whind(text_data);

	            try {
	                ast = wick_compile(lex, own_env);
	            } catch (e) {
	                error(error.ELEMENT_PARSE_FAILURE, e, this);
	            }
	        }

	        this.loadAST(ast);

	        own_env.resolve();

	        return;
	    }

	    merge(node, merged_node = new this.constructor({}, this.presets, this.tag, null, null)) {

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

	        if (this.pinned)
	            pinned[this.pinned] = own_element;

	        if (!scope)
	            scope = new Scope(null, presets || this.presets, own_element, this);

	        if (!scope.ele) scope.ele = own_element;

	        for (const attr of this.attribs.values())
	            attr.bind(own_element, scope, pinned);

	        for (const child of this.children)
	            child.mount(own_element, scope, presets, slots, pinned);

	        /* 
	            If there is an attribute that will cause the browser to fetch a resource that is 
	            is subsequently loaded in to the element, then create a listener that will 
	            update the scopes PENDING_LOADS property when the resource is requested and then 
	            received.

	            example elemnts = img, svg
	        */
	        if (this.pending_load_attrib && this.getAttribObject(this.pending_load_attrib).value) {
	            const fn = e => {
	                scope.loadAcknowledged();
	                own_element.removeEventListener("load", fn);
	            };
	            own_element.addEventListener("load", fn);
	            scope.PENDING_LOADS++;
	        }


	        return (RETURN_ELEMENT) ? own_element : scope;
	    }
	}

	class IOBase {

	    get type () { return "IOBase"}

	    constructor(parent, element = null) {

	        this.parent = null;
	        this.ele = element;

	        if(parent instanceof Tap || parent instanceof IOBase)
	            parent.addIO(this);
	    }

	    discardElement(ele){
	        if(this.parent)
	            this.parent.discardElement(ele);
	    }

	    destroy() {
	        if(this.parent)
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

	    toString(eles){
	        return "";
	    }

	    getTapDependencies(dependencies = []){
	        if(this.parent instanceof Tap)
	            dependencies.push(this.parent.prop);
	        if(this.ele instanceof IOBase)
	            this.ele.getTapDependencies(dependencies);
	        return dependencies;
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

	    get type () { return "IO"}

	    static stamp(scope, binding, default_val){
	        
	    }

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

	    toString(eles){
	        return `${eles.getElement(this.ele)}.data = ${this.parent.prop}`;
	    }
	}

	/**
	    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
	*/
	class AttribIO extends IOBase {

	    get type () { return "AttribIO"}
	    
	    constructor(scope, binding, tap, attr, element, default_val) {
	        /*
	        if (element.io) {
	            let down_tap = element.io.parent;
	            let root = scope.parent;
	            tap.modes |= EXPORT;
	            return new RedirectAttribIO(scope, element.io.parent, tap);
	        }
	        */

	        super(tap, element);


	        this.binding = binding;
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

	    toString(eles){
	        return `${eles.getElement(this.ele)}.setAttribute(${this.attrib}, ${this.parent.prop})`;
	    }

	    set data(v) {
	        this.down(v);
	    }

	    get data() {

	    }
	}

	class DataNodeIO extends IOBase {

	    get type () { return "DataNodeIO"}

	    constructor(scope, tap, element, default_val) {
	        if(!tap)  return {};

	        super(tap, element);
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

	class ContainerLinkIO extends DataNodeIO {
	    get type () { return "ContainerLinkIO"}
	}

	/**
	    This io updates the value of a TextNode or it replaces the TextNode with another element if it is passed an HTMLElement
	*/
	class TextNodeIO extends DataNodeIO {

	    get type () { return "TextNodeIO"}

	    constructor(scope, tap, element, default_val) {
	        if(!tap) return {};

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

	    toString(eles) {
	        return `${eles.getElement(this.ele)}.setAttribute(${this.attrib}, ${this.parent.prop})`;
	    }
	}

	class EventIO extends IOBase {

	    get type() { return "EventIO" }

	    constructor(scope, binding, tap, attrib_name, element, default_val) {

	        let down_tap = tap;

	        /*  
	            If there is a default, where ((up)(down = default_value)), then change the tap binding
	            to either null if the default value is a literal of some type, or to a known
	            tap if the default value is an identifier. If the element is an <input>,
	            and the default value is an identifier with the value of "value", 
	            then leave down tap blank, and let the Browser automatically assign 
	            value to the element. 
	        */
	        if (default_val) {
	            if (typeof default_val == "string")
	                if (default_val == "value" && (element.tagName == "TEXTAREA" || element.tagName == "INPUT")) {
	                    down_tap = null;
	                } else {
	                    down_tap = scope.getTap(default_val.name);
	                }
	            else down_tap = default_val;
	        }


	        super(down_tap);

	        this.binding = binding;

	        this.ele = element;

	        this.up_tap = tap;

	        this.val = null;

	        const up_tap = this.up_tap;

	        const PreventPropagation = (attrib_name.slice(-1) == "_");

	        if (PreventPropagation)
	            attrib_name = attrib_name.slice(0, -1);

	        this.event = (e) => {

	            if(down_tap && down_tap.down) //Prime the val property if possible
	                down_tap.down(null, {IMMEDIATE:true});


	            up_tap.up(this.val || e.target.value, { event: e });

	            if (PreventPropagation) {
	                e.preventDefault();
	                e.stopPropagation();
	                e.stopImmediatePropagation();
	                return false;
	            }
	        };

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
	        this.val = value;
	    }

	    getTapDependencies(dependencies = []) {
	        if (this.parent instanceof Tap)
	            dependencies.push(this.parent.prop);
	        else {
	            dependencies.push(this.up_tap.prop);
	            return this.parent.getTapDependencies(dependencies);
	        }
	        return dependencies;
	    }
	}

	class InputIO extends IOBase {

	    get type () { return "InputIO"}

	    constructor(scope, errors, tap, attrib_name, element, default_val) {

	        if(tap)
	            super(tap);
	        else if(default_val)
	            super(scope);
	        else
	            return null;

	        this.ele = element;
	        this.event = null;

	        this.up_tap = tap;

	        let up_tap = tap;

	        if(default_val){
	            switch(default_val.type){
	                case types.identifier:
	                    up_tap = scope.getTap(default_val.name);
	                break;
	                case types.null_literal:
	                    up_tap = null;
	                break;
	            }
	        }

	        if(up_tap){
	            if (element.type == "checkbox")
	                this.event = (e) => { up_tap.up(e.target.checked, { event: e }); };
	            else
	                this.event = (e) => { up_tap.up(e.target.value, { event: e }); };
	            
	            this.ele.addEventListener("input", this.event);
	        }
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

	class ArgumentIO extends IO {

	    get type() { return "ArgumentIO" }

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

	    getTapDependencies(dependencies = []) {
	        if (this.parent instanceof Tap)
	            dependencies.push(this.parent.prop);
	        return dependencies;
	    }
	}

	class ScriptIO extends IOBase {

	    get type() { return "ScriptIO" }

	    static stamp(id, scope, binding) {
	        scope.addActivation(binding.args.map(e => e.name), binding.origin_val);
	        return `registerExpression(${id},${false}, ()=>output({${this.val}:${true})})`;
	    }

	    constructor(scope, node, tap, script, lex, pinned) {

	        super(tap);

	        this.scope = scope;
	        this.TAP_BINDING_INDEX = script.args.reduce((r, a, i) => (a.name == tap.prop) ? i : r, -1);
	        this.node = node;
	        this.function = script.function.bind(scope);
	        this.script = script;

	        this.ACTIVE_IOS = 0;
	        this.IO_ACTIVATIONS = 0;
	        this._SCHD_ = 0;

	        this.AWAITING_DEPENDENCIES = false;
	        this.IMMEDIATE_NEEDED = false;

	        //Embedded emit functions


	        //TODO: only needed if emit is called in function. Though highly probable. 
	        this.arg_props = [];
	        this.arg_ios = {};

	        this.initProps(script.args, tap, node, pinned);

	        const func_bound = this.emit.bind(this);
	        func_bound.onTick = this.onTick.bind(this);
	        this.arg_props.push(func_bound);
	    }

	    toString() {
	        return this.script.ast.render();
	    }

	    getTapDependencies(dependencies = []) {
	        if (this.parent instanceof Tap)
	            dependencies.push(this.parent.prop);

	        for (const arg_name in this.arg_ios)
	            this.arg_ios[arg_name].getTapDependencies(dependencies);
	        return dependencies;
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

	        for (const a in this.arg_ios) {
	            this.arg_ios[a].destroy();
	        }

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

	                this.IO_ACTIVATIONS++;

	                this.arg_ios[name] = new ArgumentIO(this.scope, errors, this.scope.getTap(name), this, i);

	                this.arg_props.push(val);
	            } else {
	                this.arg_props.push(a.val);
	            }
	        }
	    }

	    updateProp(io, val) {

	        if (typeof(val) !== undefined)
	            this.arg_props[io.id] = val;

	        if (!io.ACTIVE) {
	            io.ACTIVE = true;
	            this.ACTIVE_IOS++;
	        }

	        if (this.AWAITING_DEPENDENCIES) {
	            if (this.ACTIVE_IOS < this.IO_ACTIVATIONS)
	                return;

	            this.AWAITING_DEPENDENCIES = false;

	            if (this.IMMEDIATE_NEEDED) {
	                this.IMMEDIATE_NEEDED = false;
	                this.scheduledUpdate();
	            } else if (!this._SCHD_)
	                spark.queueUpdate(this);
	        }
	    }

	    setValue(value, meta) {
	        if (typeof(value) == "object") {
	            //Distribute iterable properties amongst the IO_Script's own props.
	            for (const a in value) {
	                if (this.arg_ios[a])
	                    this.arg_ios[a].down(value[a]);
	            }
	        } else if (this.TAP_BINDING_INDEX !== -1) {
	            this.arg_props[this.TAP_BINDING_INDEX] = value;
	        }
	    }

	    scheduledUpdate() {
	        // Check to make sure the function reference is still. May not be if the IO was destroyed between
	        // a down update and spark subsequently calling the io's scheduledUpdate method

	        if (this.function) {
	            try {
	                return this.function.apply(this, this.arg_props);
	            } catch (e) {
	                throw error(error.IO_FUNCTION_FAIL, e, this.node);
	            }
	        }
	    }

	    down(value, meta) {

	        if (value)
	            this.setValue(value);

	        if (meta) {
	            this.setValue(meta);
	            this.IMMEDIATE_NEEDED = !!meta.IMMEDIATE;
	        }

	        if (this.ACTIVE_IOS >= this.IO_ACTIVATIONS) {
	            if (this.IMMEDIATE_NEEDED) {
	                this.IMMEDIATE_NEEDED = false;
	                return this.scheduledUpdate();
	            } else if (!this._SCHD_)
	                spark.queueUpdate(this);
	        } else
	            this.AWAITING_DEPENDENCIES = true;
	    }

	    emit(name, value) {
	        if (
	            typeof(name) !== "undefined"
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

	    removeIO(io) {
	        this.destroy();
	    }
	}

	/******************** Expressions **********************/

	class ExpressionIO extends ScriptIO {

	    get type () { return "ExpressionIO"}

	    static stamp(id, scope, binding){
	        (binding.args.map(e=>scope.addActivation(e.name)));
	        return scope.addExpressionConst(binding.origin_val);
	    }

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

	        if(this.val !== this.old_val){
	            this.old_val = this.val;
	            this.ele.data = this.val;
	        }
	    }
	}

	/******************** Expressions **********************/

	class ContainerIO extends ScriptIO {

	    get type () { return "ContainerIO"}

	    constructor(container, scope, node, tap, binding, lex, pinned) {
	        super(scope, node, tap, binding, lex, pinned);

	        this.container = container;

	        //Reference to function that is called to modify the host container. 
	        this.action = null;

	        this.ARRAY_ACTION = false;
	    }

	    bindToContainer(type, container) {
	        this.container = container;
	        this.filter_type = type;

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
	            this.ACTIVE_IOS = this.IO_ACTIVATIONS;
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

	        if(this.action == this.scrub){
	            this.container.scrub(this.val);
	        }else if (this.ARRAY_ACTION) {
	            this.container.filterExpressionUpdate();
	        } else if (this.val !== undefined) {
	            this.action();
	            this.container.limitExpressionUpdate();
	        }
	    }

	    filter(array) {
	        return array.filter((a) => (this.setValue([a.model]), super.scheduledUpdate()));
	    }

	    sort(array) {
	        return array.sort((a, b) => (this.setValue([a.model, b.model]), super.scheduledUpdate()));
	    }

	    scrub() {
	        //this.container.scrub = this.val;
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

	//Cache for scripts that have already been built. Keys are the final strings of processed ASTs
	var FUNCTION_CACHE = new Map();

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
	            l = whind(l);

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
	            let lex = whind(v);
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

	class CSS_URL extends URL$1 {
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

	    static parse(l) {
	        if (l.ty == l.types.str) {
	            let tx = l.tx;
	            l.next();
	            return new CSS_String(tx);
	        }
	        return null;
	    }

	    constructor(string) {
	        //if(string[0] == "\"" || string[0] == "\'" || string[0] == "\'")
	        //    string = string.slice(1,-1);
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

	    if (lex.pk.tx == ".")
	        lex.next(), (v += lex.tx);

	    if(lex.pk.ty == lex.types.number)
	        lex.next(), (v += lex.tx);

	    if(lex.pk.tx == "e")
	        lex.next(), (v += lex.tx);

	    if(lex.pk.tx == "-")
	        lex.next(), (v += lex.tx);

	    if(lex.pk.ty == lex.types.number)
	        lex.next(), (v += lex.tx);

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
	        }
	        lex.next();
	    }
	    return n;
	}

	function ParseString(string, transform) {
	    let lex = null;
	    lex = string;

	    if(typeof(string) == "string")
	        lex = whind(string);
	    
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
			top: `<length>|<number>|<percentage>|auto`,
			left: `<length>|<number>|<percentage>|auto`,
			bottom: `<length>|<number>|<percentage>|auto`,
			right: `<length>|<number>|<percentage>|auto`,
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
			background_color: `<color>|red`,
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
			font_family: `[<generic_family>|<family_name>]#`,
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

		/* https://drafts.csswg.org/css-conte-3/ */
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

		/*https://www.w3.org/TR/css-backgrounds-3/#property-index*/

		bg_layer: `<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
		final_bg_layer: `<background_color>||<bg_image>||<bg_position>[/<bg_size>]?||<repeat_style>||<attachment>||<box>||<box>`,
		bg_image: `<url>|<gradient>|none`,
		repeat_style: `repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}`,
		background_attachment: `<attachment>#`,
		bg_size: `[<length_percentage>|auto]{1,2}|cover|contain`,
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

	    get type(){
	        return "jux";
	    }

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

	    parse(data) {
	        const prop_data = [];

	        this.parseLVL1(data instanceof whind.constructor ? data : whind(data + ""), prop_data);

	        return prop_data;
	    }



	    parseLVL1(lx, out_val = [], ROOT = true) {

	        if (typeof(lx) == "string")
	            lx = whind(lx);

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
	        } else
	            bool = this.parseLVL2(lx, out_val, this.start, this.end);

	        return bool;
	    }

	    checkForComma(lx, out_val, temp_val = [], j = 0) {
	        if (this.REQUIRE_COMMA) {
	            if (out_val) {
	                if (j > 0)
	                    out_val.push(",", ...temp_val);
	                else
	                    out_val.push(...temp_val);
	            }

	            if (lx.ch !== ",")
	                return false;

	            lx.next();
	        } else if(out_val)
	            out_val.push(...temp_val);

	        return true;
	    }

	    parseLVL2(lx, out_val, start, end) {

	        let bool = false,
	            copy = lx.copy(),
	            temp_val = [];

	        repeat:
	            for (let j = 0; j < end && !lx.END; j++) {

	                //const copy = lx.copy();

	                const temp = [];

	                for (let i = 0, l = this.terms.length; i < l; i++) {

	                    const term = this.terms[i];

	                    if (!term.parseLVL1(copy, temp, false)) {
	                        if (!term.OPTIONAL) {
	                            break repeat;
	                        }
	                    }
	                }

	                temp_val.push(...temp);

	                lx.sync(copy);

	                bool = true;

	                if (!this.checkForComma(copy, out_val, temp_val, j))
	                    break;
	            }

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

	    get type(){
	        return "and";
	    }
	    parseLVL2(lx, out_val, start, end) {

	        const
	            PROTO = new Array(this.terms.length),
	            l = this.terms.length;

	        let bool = false,
	            temp_val = [],
	            copy = lx.copy();

	        repeat:
	            for (let j = 0; j < end && !lx.END; j++) {

	                const
	                    HIT = PROTO.fill(0);
	                //temp_r = [];

	                and:
	                    while (!copy.END) {



	                        for (let i = 0; i < l; i++) {

	                            if (HIT[i] === 2) continue;

	                            let term = this.terms[i];

	                            const temp = [];

	                            if (!term.parseLVL1(copy, temp, false)) {
	                                if (term.OPTIONAL)
	                                    HIT[i] = 1;
	                            } else {
	                                temp_val.push(...temp);
	                                HIT[i] = 2;
	                                continue and;
	                            }
	                        }

	                        if (HIT.reduce((a, v) => a * v, 1) === 0)
	                            break repeat;

	                        break
	                    }

	                lx.sync(copy);

	                bool = true;

	                if (!this.checkForComma(copy, out_val, temp_val, j))
	                    break;
	            }

	        return bool;
	    }
	}

	class OR extends JUX {
	    get type(){
	        return "or";
	    }
	    parseLVL2(lx, out_val, start, end) {

	        const
	            PROTO = new Array(this.terms.length),
	            l = this.terms.length;

	        let
	            bool = false,
	            NO_HIT = true,
	            copy = lx.copy(),
	            temp_val = [];

	        repeat:
	            for (let j = 0; j < end && !lx.END; j++) {

	                const HIT = PROTO.fill(0);

	                or:
	                    while (!copy.END) {
	                        for (let i = 0; i < l; i++) {

	                            if (HIT[i] === 2) continue;

	                            let term = this.terms[i];

	                            if (term.parseLVL1(copy, temp_val, false)) {
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

	                if (!this.checkForComma(copy, out_val, temp_val, j))
	                    break;
	            }

	        return bool;
	    }
	}

	OR.step = 0;

	class ONE_OF extends JUX {
	    get type(){
	        return "one_of";
	    }
	    parseLVL2(lx, out_val, start, end) {

	        let BOOL = false;
	        const
	            copy = lx.copy(), 
	            temp_val = [];

	        for (let j = 0; j < end && !lx.END; j++) {

	            let bool = false;

	            for (let i = 0, l = this.terms.length; i < l; i++) {
	                if (this.terms[i].parseLVL1(copy, temp_val, false)) {
	                    bool = true;
	                    break;
	                }
	            }

	            if (!bool)
	                break;

	            lx.sync(copy);

	            BOOL = true;

	            if (!this.checkForComma(copy, out_val, temp_val, j))
	                break;
	        }

	        return BOOL;
	    }
	}

	ONE_OF.step = 0;

	class LiteralTerm{

	    get type (){
	        return "term";
	    }

	    constructor(value, type) {
	        
	        if(type == whind.types.string)
	            value = value.slice(1,-1);

	        this.value = value;
	        this.HAS_PROP = false;
	    }

	    seal(){}

	    parse(data){
	        const prop_data = [];

	        this.parseLVL1(data instanceof whind.constructor ? data : whind(data + ""), prop_data);

	        return prop_data;
	    }

	    parseLVL1(l, r, root = true) {

	        if (typeof(l) == "string")
	            l = whind(l);

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
	            l = whind(l);

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
	            l = whind(l);

	        if (l.tx == this.value) {
	            l.next();
	            rule.push(this.value);
	            return true;
	        }

	        return false;
	    }
	}

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

	    while (!pk.END && (pk.ty & (whind.types.id | whind.types.num)) || pk.tx == "-" || pk.tx == "_") { pk.next(); }

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

	    const l = whind(notation);
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

	                let nr = new productions.JUX();
	                //nr.terms.push(new SymbolTerm(","));
	                nr.terms.push(term);
	                term = nr;
	                //term = foldIntoProduction(productions, term);
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

	const observer_mixin_symbol = Symbol("observer_mixin_symbol");

	const observer_mixin = function(calling_name, prototype) {

	    const observer_identifier = Symbol("observer_array_reference");

	    prototype[observer_mixin_symbol] = observer_identifier;

	    //Adds an observer to the object instance. Applies a property to the observer that references the object instance.
	    //Creates new observers array if one does not already exist.
	    prototype.addObserver = function(...observer_list) {
	        let observers = this[observer_identifier];

	        if (!observers)
	            observers = this[observer_identifier] = [];

	        for (const observer of observer_list) {

	            if (observer[observer_identifier] == this)
	                return

	            if (observer[observer_identifier])
	                observer[observer_identifier].removeObserver(observer);

	            observers.push(observer);

	            observer[observer_identifier] = this;
	        }
	    };

	    //Removes an observer from the object instance. 
	    prototype.removeObserver = function(...observer_list) {

	        const observers = this[observer_identifier];

	        for (const observer of observer_list)
	            for (let i = 0, l = observers.length; i < l; i++)
	                if (observers[i] == observer) return (observer[observer_identifier] = null, observers.splice(i, 1));

	    };


	    prototype.updateObservers = function() {
	        const observers = this[observer_identifier];

	        if (observers)
	            observers.forEach(obj => obj[calling_name](this));
	    };
	};

	//Properly destructs this observers object on the object instance.
	observer_mixin.destroy = function(observer_mixin_instance) {

	    const symbol = observer_mixin_instance.constructor.prototype[observer_mixin_symbol];

	    if (symbol) {
	        if (observer_mixin_instance[symbol])
	            observer_mixin_instance[symbol].forEach(observer=>observer[symbol] = null);

	        observer_mixin_instance[symbol].length = 0;
	        
	        observer_mixin_instance[symbol] = null;
	    }
	};

	observer_mixin.mixin_symbol = observer_mixin_symbol;

	Object.freeze(observer_mixin);

	/* 
	    Parses a string value of a css property. Returns result of parse or null.

	    Arg - Array - An array with values:
	        0 :  string name of css rule that should be used to parse the value string.
	        1 :  string value of the css rule.
	        2 :  BOOL value for the presence of the "important" value in the original string. 

	    Returns object containing:
	        rule_name : the string name of the rule used to parse the value.
	        body_string : the original string value
	        prop : An array of CSS type instances that are the parsed values.
	        important : boolean value indicating the presence of "important" value.
	*/




	function parseDeclaration(sym) {
	    if(sym.length == 0)
	        return null;
	    
	    let prop = null;

	    const
	        rule_name = sym[0],
	        body_string = sym[2],
	        important = sym[3] ? true : false,
	        IS_VIRTUAL = { is: false },
	        parser = getPropertyParser(rule_name.replace(/\-/g, "_"), IS_VIRTUAL, property_definitions);

	    if (parser && !IS_VIRTUAL.is) 

	        prop = parser.parse(whind(body_string).useExtendedId());

	    else
	        //Need to know what properties have not been defined
	        console.warn(`Unable to get parser for CSS property ${rule_name}`);

	    return {name:rule_name, body_string, prop, important};
	}

	class styleprop {

	    constructor(name, original_value, val) {
	        this.val = val;
	        this.name = name.replace(/\-/g, "_");
	        this.original_value = original_value;
	        this.rule = null;
	        this.ver = 0;
	    }
	    destroy() {
	        this.val = null;
	        this.name = "";
	        this.original_value = "";
	        this.rule = null;
	        observer_mixin.destroy(this);
	    }

	    get css_type() {
	        return "styleprop"
	    }

	    updated() {
	        this.updateObservers();

	        if (this.parent)
	            this.parent.update();
	    }

	    get value() {
	        return this.val.length > 1 ? this.val : this.val[0];
	    }

	    get value_string() {
	        return this.val.join(" ");
	    }

	    toString(offset = 0) {
	        const 
	            off = ("    ").repeat(offset);

	        return `${off+this.name.replace(/\_/g, "-")}:${this.value_string}`;
	    }

	    setValueFromString(value) {
	        const result = parseDeclaration([this.name, null, value]);

	        if (result) 
	            this.setValue(...result.prop);
	    }

	    setValue(...values) {

	        let i = 0;

	        for (const value of values) {
	            const own_val = this.val[i];


	            if (own_val && value instanceof own_val.constructor)
	                this.val[i] = value;
	            else
	                this.val[i] = value;
	            i++;
	        }

	        this.val.length = values.length;

	        this.ver++;

	        this.updated();
	    }
	}

	observer_mixin("updatedCSSStyleProperty", styleprop.prototype);

	/* 	Wraps parseDeclaration with a function that returns a styleprop object or null. 
		Uses same args as parseDeclaration */

	function parseDeclaration$1 (...v){

		const result = parseDeclaration(...v);

		if(result)
			return new styleprop(
				result.name,
				result.body_string,
				result.prop
			)

		return null;
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

	        //Versioning
	        this.ver = 0;

	        this.parent = null;

	        setParent(this.selectors, this);
	        setParent(this.properties.values(), this);

	        this.props = new Proxy(this, this);
	        this.addProperty = this.addProp;
	        this.addProps = this.addProp;
	        this.UPDATE_LOOP_GAURD = false;
	    }
	    
	    get css_type(){
	        return "stylerule"
	    }

	    destroy(){
	        
	        for(const prop of this.properties.values())
	            prop.destroy();

	        for(const selector of this.selectors)
	            selector.destroy();

	        this.parent = null;
	        this.selectors = null;
	        this.properties = null;

	        observer_mixin.destroy(this);
	    }

	    /* sends an update signal up the hiearchy to allow style sheets to alert observers of new changes. */
	    update() {
	        this.ver++;

	        //if(this.UPDATE_LOOP_GAURD) return;

	        if (this.parent)
	            this.parent.update();

	        this.updateObservers();
	    }

	    get type() {
	        return "stylerule"
	    }

	    get(obj, name) {
	        let prop = obj.properties.get(name);
	        //if (prop)
	        //    prop.parent = this;
	        return prop;
	    }
	    /*  
	        Adds properties to the stylerule
	        arg1 string - accepts a string of semicolon seperated css style rules.   
	    */
	    addProp(props) {
	        if (typeof props == "string") {
	            return this.addProps(
	                props.split(";")
	                .filter(e => e !== "")
	                .map((e, a) => (a = e.split(":"), a.splice(1, 0, null), a))
	                .map(parseDeclaration$1)
	            )
	        }

	        if (props.type == "stylerule")
	            props = props.properties.values();
	        else
	        if (!Array.isArray(props))
	            props = [props];

	       // this.UPDATE_LOOP_GAURD = true;
	        for (const prop of props)
	            if (prop) {
	                if(this.properties.has(prop.name))
	                    this.properties.get(prop.name).setValue(...prop.val);
	                else
	                    this.properties.set(prop.name, prop);
	                
	                prop.parent = this;
	            }
	        //this.UPDATE_LOOP_GAURD = false;

	        this.ver++;

	        this.update();

	        return props;
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

	    toString(off = 0, rule = "") {

	        let str = [];

	        for (const prop of this.properties.values())
	            str.push(prop.toString(off));

	        return `${this.selectors.join("")}{${str.join(";")}}`;
	    }

	    merge(rule) {
	        if(!rule) return;
	        if (rule.type == "stylerule"){
	            for (const prop of rule.properties.values()){
	                if (prop) {
	                    this.properties.set(prop.name, prop);
	                }
	            }
	        }
	                
	    }

	    get _wick_type_() { return 0; }

	    set _wick_type_(v) {}
	}

	observer_mixin("updatedCSSStyleRule", stylerule.prototype);

	class ruleset {
		constructor(asts, rules = []){
			this.rules = rules;

	        rules.forEach(r=>r.parent = this);

	        this.parent = null;
		}

	    destroy(){
	        for(const rule of this.rules)
	            rule.destroy();
	        this.rules = null;
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

	    /* sends an update signal up the hiearchy to allow style sheets to alert observers of new changes. */
	    update(){
	        if(this.parent)
	            this.parent.updated();
	    }

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

	class stylesheet {

	    constructor(sym) {
	        this.ruleset = null;

	        if (sym) {
	            this.ruleset = sym[0];
	        }else {
	            this.ruleset = new ruleset();
	        }
	        this.ruleset.parent = this;

	        this.parent = null;

	        this.READY = true;
	    }

	    destroy(){
	        
	        this.ruleset.destroy();
	        this.parent = null;
	        this.READY = false;

	        observer_mixin.destroy(this);
	    }

	    get css_type(){
	        return "stylesheet"
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
	        this.updateObservers();
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
	                new_rule.merge(rule);
	            }
	        return new_rule;
	    }

	    * getApplicableProperties(element, win = window){
	        for(const rule of this.getApplicableRules(element, win, true))
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

	observer_mixin("updatedCSS", stylesheet.prototype);

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

	const types$2 = {color: CSS_Color,
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
	    fontname: CSS_FontName};

	/** SHARED METHODS **/

	var common_methods = {

	    constructCommon() {
	        this.time = 0;
	        this.duration = 0;
	        this.REPEAT = 0;
	        this.PLAY = true;
	        this.DESTROYED = false;
	        this.FINISHED = false;
	        this.SHUTTLE = false;
	        this.SCALE = 1;
	        this.events = {};
	    },

	    destroyCommon() {
	        this.DESTROYED = true;
	        this.events = null;
	    },

	    scheduledUpdate(a, t) {

	        if (!this.PLAY) return;

	        this.time += t * this.SCALE;

	        if (this.run(this.time)) {
	            spark$1.queueUpdate(this);
	        } else if (this.REPEAT) {
	            let scale = this.SCALE;

	            this.REPEAT--;

	            if (this.SHUTTLE)
	                scale = -scale;

	            let from = (scale > 0) ? 0 : this.duration;

	            this.play(scale, from);
	        } else
	            this.issueEvent("stopped");
	    },

	    await: async function() {
	        return this.observeStop()
	    },

	    async observeStop() {
	        return (new Promise(res => {

	            if (this.duration > 0)
	                this.scheduledUpdate(0, 0);

	            if (this.duration < 1)
	                return res();

	            this.addEventListener("stopped", () => (res(), false));
	        }));
	    },

	    shuttle(SHUTTLE = true) {
	        this.SHUTTLE = !!SHUTTLE;
	        return this;
	    },

	    set(i) {
	        if (i >= 0)
	            this.run(i * this.duration);
	        else
	            this.run(this.duration - i * this.duration);
	        return this;
	    },

	    step(i) { return this.set(i) },

	    play(scale = 1, from = 0) {
	        this.PLAY = true;
	        this.SCALE = scale;
	        this.time = from;
	        spark$1.queueUpdate(this);
	        this.issueEvent("started");
	        return this;
	    },

	    async asyncPlay(scale, from, fn) {

	        this.play(scale, from);

	        return this.observeStop(fn);
	    },

	    stop() {
	        //There may be a need to kill any existing CSS based animations
	        this.PLAY = false;
	        return this;
	    },

	    repeat(count = 1) {
	        this.REPEAT = Math.max(0, parseFloat(count));
	        return this;
	    },

	    issueEvent(event) {
	        if (this.events[event])
	            this.events[event] = this.events[event].filter(e => e(this) !== false);
	    },

	    addEventListener(event, listener) {
	        if (typeof(listener) === "function") {
	            if (!this.events[event])
	                this.events[event] = [];
	            this.events[event].push(listener);
	        }
	    },

	    removeEventListener(event, listener) {
	        if (typeof(listener) === "function") {
	            const events = this.events[event];
	            if (events)
	                for (let i = 0; i < events.length; i++)
	                    if (events[i] === listener)
	                        return (events.splice(i, 1), true);
	        }
	        return false;
	    }
	};

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

	        class lerpNonNumeric {
	            constructor(v) { this.v = v; } lerp(to, t, from) {
	                return from.v
	            }
	            copy(val) { return new lerpNonNumeric(val) }
	        }


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
	                else
	                    this.type = this.getType(k0_val);

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
	                this.constructCommon();
	                this.obj = null;
	                this.type = setType(obj);
	                this.CSS_ANIMATING = false;
	                
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
	                this.obj = null;
	                this.props = null;
	                this.destroyCommon();
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

	                return (i <= this.duration && i >= 0);
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

	            constructor(sequences) {

	                this.constructCommon();
	                this.seq = [];
	                for (const seq of sequences)
	                    this.add(seq);
	            }

	            destroy() {
	                this.seq.forEach(seq => seq.destroy());
	                this.seq = null;
	                this.destroyCommon();
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


	                return (t < this.duration);
	            }
	        }

	        Object.assign(AnimGroup.prototype, common_methods);
	        Object.assign(AnimSequence.prototype, common_methods);

	        /** END SHARED METHODS **/

	        const GlowFunction = function(...args) {

	            const output = [];

	            for (let i = 0; i < args.length; i++) {
	                let data = args[i];

	                let obj = data.obj;
	                let props = {};

	                Object.keys(data).forEach(k => { if (!(({ obj: true, match: true, delay: true })[k])) props[k] = data[k]; });

	                output.push(new AnimSequence(obj, props));
	            }

	            if (args.length > 1)
	                return (new AnimGroup(output));

	            return output.pop();
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
	            anticipate: new CSS_Bezier$1(0.5, -0.5, 0.5, 0.8),
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
	            this.constructCommon();
	            this.in_duration = 0;
	            this.out_duration = 0;
	            // If set to zero transitions for out and in will happen simultaneously.
	            this.in_delay = 0;

	            this.in_seq = [];
	            this.out_seq = [];

	            this.TT = {};

	            this.out = $out.bind(this);
	            this.out.addEventListener = this.addEventListener.bind(this);
	            this.out.removeEventListener = this.removeEventListener.bind(this);
	            
	            this.in = $in.bind(this);
	            this.in.addEventListener = this.addEventListener.bind(this);
	            this.in.removeEventListener = this.removeEventListener.bind(this);

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
	            this.out = null;
	            this.in = null;
	            this.destroyCommon();
	        }

	        get duration() {
	            return Math.max(this.in_duration + this.in_delay, this.out_duration);
	        }

	        set duration(e){};

	        run(t) {

	            for (let i = 0; i < this.out_seq.length; i++) {
	                let seq = this.out_seq[i];
	                if (!seq.run(t) && !seq.FINISHED) {
	                    seq.issueEvent("stopped");
	                    seq.FINISHED = true;
	                }
	            }

	            const in_t = Math.max(t - this.in_delay, 0);

	            for (let i = 0; i < this.in_seq.length; i++) {
	                let seq = this.in_seq[i];
	                if (!seq.run(t) && !seq.FINISHED) {
	                    seq.issueEvent("stopped");
	                    seq.FINISHED = true;
	                }
	            }

	            return (t <= this.duration && t >= 0);
	        }
	    }

	    Object.assign(Transition.prototype, common_methods);


	    return { createTransition: (OVERRIDE) => new Transition(OVERRIDE) };
	})();

	Object.assign(Animation, {
		createTransition:(...args) => Transitioneer.createTransition(...args),
		transformTo:(...args) => TransformTo(...args)
	});

	var JS = {

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

	            if (ast !== node 
	                    &&(
	                    (node.type == types.arrow_function_declaration) 
	                    || (node.type == types.for_of_statement) 
	                    || (node.type == types.catch_statement) 
	                    )
	                    ) {


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

	            const root = window || global;
	            if ((root[name] && !(root[name] instanceof HTMLElement)) || name == "this")
	                //Skip anything already defined on the global object. 
	                return red;

	            red.push(out);

	            return red;
	        }, []);
	    },

	    types: types
	};

	const defaults$1 = {
	    glow: Animation,
	    wickNodeExpression: function(scope, id) {
	        const out = scope.ast.presets.components[id].mount(null, scope, scope.ast.presets, undefined, undefined, true);
	        return out;
	    }
	};

	const root = typeof(global) == "object" ? global : window;

	/* Returns true if await is found within the givin ast's closure. Will not enter closures of function, class, or object definitions */
	function AsyncInClosure(ast){
	    for(const node of ast.traverseDepthFirst()){
	        if(
	            node.type == types.function_declaration ||
	            node.type == types.class_declaration ||
	            node.type == types.object_literal
	        ) {
	            node.skip();
	        }

	        if(node.type == types.await_expression){
	            return true;
	        }
	    }
	}

	function GetOutGlobals(ast, presets) {
	    const args = [];
	    const ids = [];
	    const arg_lu = new Set();

	    JS.getClosureVariableNames(ast).forEach(out => {

	        const name = out.name;
	        if (out.parent &&
	            out.type == types.identifier &&
	            out.parent.type == types.assignment_expression &&
	            out == out.parent.left
	        ) ; else if (!arg_lu.has(name)) {
	            arg_lu.add(name);

	            const out_object = { name, val: null, IS_TAPPED: false, IS_ELEMENT: false };

	            if (presets.custom[name])
	                out_object.val = presets.custom[name];
	            else if (presets[name])
	                out_object.val = presets[name];
	            else if (defaults$1[name]) {
	                out_object.val = defaults$1[name];
	            } else if (root[name]) {
	                out_object.val = root[name];
	            } else if (name[name.length - 1] == "$") {
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


	        if (
	            node.parent &&
	            node.parent.type == types.assignment_expression &&
	            node.type == types.identifier
	        ) {
	            if (node == node.parent.left) {

	                const k = node.name;

	                if ((root[k] && !(root[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults$1[k] || ignore.includes(k))
	                    return;
	                
	                node.parent.replace(new call_expression(
	                    [
	                        new identifier$1(["emit"]),
	                        new argument_list$1(new string$1([null, node.name, null]), node.parent.right),
	                    ]
	                ));
	            }
	            return;
	        }
	        if (
	            node.type == types.member_expression &&
	            node.mem.name == "emit" &&
	            node.parent.type == types.call_expression
	        ) {
	//*
	            const k = node.parent.name;

	            if ((root[k] && !(root[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults$1[k] || ignore.includes(k))
	                return;
	            //*
	            const args = [new string$1([null, node.name, null])];

	            if(node.parent.args)
	                args.push(...node.parent.args.vals);

	            node.parent.replace(
	                new call_expression(
	                    [
	                        new identifier$1(["emit"]),
	                        new argument_list$1(...args)
	                    ]
	                )
	            );

	            return;
	            //*/
	        }
	    });
	}

	const offset$1 = "    ";
	const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

	function processJSAST(obj, env, ENCLOSE_IN_RETURN_STATEMENT = false) {

	    obj.ast = obj.original.copy();

	    const { args, ids } = GetOutGlobals(obj.ast, env.presets);

	    obj.IS_ASYNC = AsyncInClosure(obj.ast);

	    obj.args = args;

	    obj.ids = ids;

	    AddEmit(ids, env.presets, obj.args.reduce((r, a) => ((a.IS_TAPPED) ? null : r.push(a.name), r), []));

	    if (ENCLOSE_IN_RETURN_STATEMENT) {
	        const r = new return_statement([]);
	        r.vals[0] = obj.ast;
	        obj.ast = r;
	    }
	    
	    obj.val = obj.ast + "";
	}

	function processScriptObject(obj, component_env) {
	    {

	        const
	            args = obj.args,
	            names = args.map(a => a.name);

	        // For the injected emit function
	        names.push("emit");

	        try {

	            if (obj.IS_ASYNC)
	                obj.function = AsyncFunction.apply(AsyncFunction, names.concat([obj.val]));
	            else
	                obj.function = Function.apply(Function, names.concat([obj.val]));

	            FUNCTION_CACHE.set(obj.val, obj.function);
	        } catch (e) {
	            component_env.error(error.SCRIPT_FUNCTION_CREATE_FAILURE, e, obj);
	            return false;
	        }

	    }

	    return true;
	}

	class ScriptNode extends ElementNode {

	    constructor(env, presets, tag, ast, attribs) {
	        super(env, presets, "script", null, attribs);
	        this.function = null;
	        this.args = null;
	        this.original = null;
	        this.ast = null;
	        this.IS_ASYNC = false;
	        this.READY = false;
	        this.val = "";

	        const on = this.getAttribObject("on").value;

	        if (typeof on == "string")
	            console.warn("No binding set for this script's [on] attribute. This script will have no effect.");
	        else {
	            this.on = on;
	            this.loadAST(ast[0]);
	        }
	    }

	    loadAST(ast) {
	        if (ast && !this.ast) {
	            this.original = ast;
	            processJSAST(this, this.env);
	        }
	    }

	    finalize() {

	        if (!this.ast || !this.on) return this;

	        this.READY = processScriptObject(this, this.component_env);

	        return this;
	    }

	    mount(element, scope, presets, slots, pinned) {

	        if (this.READY) {
	            const tap = this.on.bind(scope, null, null, this);
	            scope.ios.push(new ScriptIO(scope, this, tap.main, this, {}, pinned));
	        }
	    }

	    toString(off = 0) {

	        var o = offset$1.repeat(off),
	            str = `${o}<${this.tag}`;

	        for (const attr of this.attribs.values()) {
	            if (attr.name)
	                str += ` ${attr.name}="${attr.value}"`;
	        }

	        str += ">\n";

	        str += this.original.render();

	        return str + `${o}</${this.tag}>\n`;
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

	        this.METHOD = IDENTIFIER;

	        this.astA = {
	            original: exprA,
	            ast: null,
	            IS_ASYNC: false,
	            ids: null,
	            args: null,
	            function: null,
	            val: exprA ? exprA.render() : ""

	        };

	        this.astB = {
	            original: exprB,
	            ast: null,
	            IS_ASYNC: false,
	            ids: null,
	            args: null,
	            function: null,
	            val: exprB ? exprB.render() : ""
	        };

	        this.READY = false;
	        this.origin_url = env.url;
	        this.on = true;

	        if (this.astA.original && !(this.astA.original instanceof identifier$1)) {
	            processJSAST(this.astA, env, 1);
	            this.READY = processScriptObject(this.astA, env);
	            this.METHOD = EXPRESSION;
	        }

	        if (this.astB.original && !(this.astB.original instanceof identifier$1)) {
	            processJSAST(this.astB, env, 1);
	            processScriptObject(this.astB, env);
	        }
	    }

	    toString() {
	        return (this.astB.val)
	            ? `((${this.astA.original + ""})(${this.astB.original + ""}))`
	            : `((${this.astA.original + ""}))`;
	    }

	    setForContainer(presets) {

	        if (this.METHOD == IDENTIFIER)
	            this.processJSAST(presets);

	        this.METHOD = CONTAINER;
	    }

	    bind(scope, element, pinned, node = this) {
	        const out = { main: null, alt: null };

	        if (this.astB.ast)
	            out.alt = new ExpressionIO(element, scope, node, scope, this.astB, this.lex, pinned);
	        else
	            out.alt = this.astB.val;

	        if (this.astA.ast) {
	            if (this.METHOD == EXPRESSION)
	                out.main = new ExpressionIO(element, scope, node, scope, this.astA, this.lex, pinned);
	            else if (this.METHOD == CONTAINER)
	                out.main = new ContainerIO(element, scope, node, scope, this.astA, this.lex, pinned);
	        } else
	            out.main = scope.getTap(this.astA.val);

	        return out;
	    }
	}

	Binding.type = {
	    Attribute: 0,
	    TextNode: 1,
	    Style: 2
	};

	const offset$2 = "    ",
	    html_entities = [
	    [/&lt;/g, "<"],
	    [/&gt;/g, ">"],
	    [/&lpar;/g, "("],
	    [/&rpar;/g, ")"],
	    [/&quot;/g, '"'],
	    [/&nbsp;/g, "\u00a0"],
	    [/&amp;/g, '&']
	];

	function replaceEntities(text){
	    return html_entities.reduce(((r,e)=>r.replace(e[0],e[1])),text);
	}

	class TextNode {

	    constructor(sym) {
	        this.IS_BINDING = (sym[0] instanceof Binding);
	        this.data = sym[0] || "";
	        this.unescaped_data = "";
	        this.tag = "text";

	        if(!this.IS_BINDING)
	            this.unescaped_data = replaceEntities(this.data);
	    }

	    toString(off = 0) {
	        return `${offset$2.repeat(off)} ${this.data.toString()}`;
	    }

	    finalize() {
	        return this;
	    }

	    get IS_WHITESPACE() {
	        return !this.IS_BINDING && (!this.data.toString().trim());
	    }

	    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {
	        const IS_TEXT_NODE = ele instanceof Text;

	        if (IS_TEXT_NODE)
	            element.appendChild(ele);

	        if (this.IS_BINDING) {
	            const bind = this.data.bind(scope, null, pinned),
	                io = new(IS_TEXT_NODE ? TextNodeIO : ContainerLinkIO)(scope, bind.main, ele, bind.alt);
	            scope.ios.push(io);
	            return io;
	        } else
	            ele.data = this.unescaped_data;
	    }
	}

	class scp extends ElementNode {

	    constructor(env, presets, tag, children, attribs) {

	        super(env, presets, "scope", children, attribs);

	        this.HAS_TAPS = false;
	        this.tap_list = [];

	        this.loadAttribs(this);
	    }

	    loadAttribs(n) {
	        (n.getAttribObject("put").value || "").split(" ").forEach(e => this.checkTapMethod("put", e));
	        (n.getAttribObject("export").value || "").split(" ").forEach(e => this.checkTapMethod("export", e));
	        (n.getAttribObject("import").value || "").split(" ").forEach(e => this.checkTapMethod("import", e));

	        this.model_name = this.model_name || n.getAttribObject("model").value;
	        this.schema_name = this.schema_name || n.getAttribObject("scheme").value;

	        if (this.schema_name)
	            this.getAttribObject("scheme").RENDER = false;

	        if (this.model_name)
	            this.getAttribObject("model").RENDER = false;

	        if (this.getAttribObject("put"))
	            this.getAttribObject("put").RENDER = false;

	        if (this.getAttribObject("import"))
	            this.getAttribObject("import").RENDER = false;

	        if (this.getAttribObject("export"))
	            this.getAttribObject("export").RENDER = false;

	        if (this.getAttribObject("component"))
	            this.getAttribObject("component").RENDER = false;

	        if (this.getAttribObject("element"))
	            this.getAttribObject("element").RENDER = false;
	        
	        this.tag = n.getAttribObject("element").value || "div";
	    }

	    merge(node, merged_node) {
	        const merged = super.merge(node, merged_node);

	        if (!(node instanceof scp))
	            merged.loadAttribs(node);

	        return merged;
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

	        const extern = name.split(":")[0],
	            intern = name.split(":")[1] || extern;

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
	            
	            if (extern !== intern)
	                this.checkTapMethod("", intern);

	            const tap = this.getTap(extern);

	            tap.modes |= tap_mode;

	            tap.redirect = (extern !== intern) ? intern : "";

	            return true;
	        }
	    }

	    createRuntimeTaplist(scope) {

	        const tap_list = this.tap_list;

	        for (const tap of tap_list) 
	            scope.getTap(tap.name, tap.redirect).modes = tap.modes;
	    }

	    createElement(scope) {
	        if (!scope.ele || this.getAttribute("element")) {
	            const ele = createElement(this.tag || "div");

	            if (scope.ele) {
	                appendChild(scope.ele, ele);
	                scope.ele = ele;
	            }

	            return ele;
	        }

	        return scope.ele;
	    }

	    mount(par_element, outer_scope, presets = this.presets, slots = {}, pinned = {}) {

	        const HAVE_OUTER_SCOPE = !!outer_scope,
	            scope = new Scope(
	                outer_scope,
	                presets,

	                // If there is no higher level scope, 
	                // then bind to the element that the component is attaching to. 
	                !HAVE_OUTER_SCOPE ? par_element : null,
	                this
	            );

	        if (this.HAS_TAPS)
	            this.createRuntimeTaplist(scope);

	        //Reset pinned
	        const s = super.mount(HAVE_OUTER_SCOPE ? par_element : null, scope, presets, slots, {});

	        if (this.pinned)
	            pinned[this.pinned] = s.ele;

	        return s;
	    }

	    toString() {
	        const tag = this.tag;
	        this.tag = "scope";
	        const val = super.toString();
	        this.tag = tag;
	        return val;
	    }
	}

	class a extends ElementNode{
		constructor(env,presets, tag, children, attribs ){
			super(env,presets, "a", children, attribs );
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
	class ScopeContainer {

	    constructor(parent, presets, element) {

	        this.ele = element;

	        this.taps = {};

	        this.activeScopes = [];
	        this.dom_scopes = [];
	        this.filters = [];
	        this.ios = [];
	        this.terms = [];
	        this.scopes = [];
	        this.dom_dn = [];
	        this.dom_up = [];

	        this.transition_in = 0;
	        this._SCHD_ = 0;
	        this.root = 0;
	        this.shift_amount = 1;
	        this.limit = 0;
	        this.offset = 0;
	        this.offset_diff = 0;
	        this.offset_fractional = 0;
	        this.scrub_velocity = 0;

	        this.observering = null;
	        this.parent = null;
	        this.range = null;
	        this.prop = null;
	        this.component = null;
	        this.trs_ascending = null;
	        this.trs_descending = null;

	        this.UPDATE_FILTER = false;
	        this.DOM_UP_APPENDED = false;
	        this.DOM_DN_APPENDED = false;
	        this.AUTO_SCRUB = false;
	        this.LOADED = false;

	        parent.addContainer(this);
	    }

	    destroy() {
	        this.destroyed();

	        if(this.observering){
	            this.observering.removeObserver(this);
	            this.observering = null;
	        }
	    }

	    destroyed() {
	        
	        this.cull();

	        for (const fltr of this.filters)
	            fltr.destroy();
	    }

	    get data() {return null}

	    set data(container) {

	        if(this.observering){
	            this.observering.removeObserver(this);
	            this.observering = null;
	        }

	        if (container.addObserver){
	            this.observering = container;
	            return container.addObserver(this);
	        }

	        if (!container) return;

	        if (Array.isArray(container))
	            this.cull(container);
	        else
	            this.cull(container.data);

	        this.loadAcknowledged();
	    }

	    update(container) {
	        if (container.CFW_DATA_STRUCTURE) container = container.get(undefined, []);

	        if (!container) return;

	        if (Array.isArray(container))
	            this.cull(container);
	        else
	            this.cull(container.data);
	    }

	    loadAcknowledged() {
	        if (!this.LOADED) {
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

	                if (!this.DOM_UP_APPENDED) {

	                    for (let i = 0; i < this.dom_up.length; i++) {
	                        this.dom_up[i].appendToDOM(this.ele);
	                        this.dom_up[i].index = -1;
	                        this.dom_scopes.push(this.dom_up[i]);
	                    }

	                    this.DOM_UP_APPENDED = true;
	                }

	                this.trs_ascending.play(delta_offset);
	            } else {

	                if (this.offset < 1) delta_offset = 0;

	                if (!this.DOM_DN_APPENDED) {

	                    for (let i = 0; i < this.dom_dn.length; i++) {
	                        this.dom_dn[i].appendToDOM(this.ele, this.dom_scopes[0].ele);
	                        this.dom_dn[i].index = -1;
	                    }

	                    this.dom_scopes = this.dom_dn.concat(this.dom_scopes);

	                    this.DOM_DN_APPENDED = true;
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
	            output[i].update({ trs_asc_out: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }, null, false, { IMMEDIATE: true }), i++;

	        //Scopes in the transition window
	        while (i < active_window_start + limit && i < output_length)
	            output[i].update({ arrange: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }, null, false, { IMMEDIATE: true }), i++;

	        //Scopes on the descending edge of the transition window
	        while (i < output_length){
	            output[i].update({ trs_dec_out: { trs: transition.in, pos: getColumnRow(i, offset, this.shift_amount) } }, null, false, { IMMEDIATE: true }), i++;
	        }

	        transition.play(1);

	    }

	    render(transition, output = this.activeScopes, NO_TRANSITION = false) {


	        const
	            active_window_size = this.limit,
	            active_length = this.dom_scopes.length;

	        let
	            j = 0,
	            direction = 1,
	            offset = this.offset,
	            output_length = output.length,
	            OWN_TRANSITION = false;

	        if (!transition) transition = Animation.createTransition(), OWN_TRANSITION = true;

	        offset = Math.max(0, offset);

	        const active_window_start = offset * this.shift_amount;

	        direction = Math.sign(this.offset_diff);

	        if (active_window_size > 0) {

	            this.shift_amount = Math.max(1, Math.min(active_window_size, this.shift_amount));

	            let
	                i = 0,
	                oa = 0;

	            const
	                ein = [],
	                shift_points = Math.ceil(output_length / this.shift_amount);

	            this.max = shift_points - 1;
	            this.offset = Math.max(0, Math.min(shift_points - 1, offset));

	            //Two transitions to support scrubbing from an offset in either direction
	            this.trs_ascending = Animation.createTransition(false);
	            this.trs_descending = Animation.createTransition(false);

	            this.dom_dn.length = 0;
	            this.dom_up.length = 0;
	            this.DOM_UP_APPENDED = false;
	            this.DOM_DN_APPENDED = false;

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

	        const
	            trs_in = { trs: transition.in, index: 0 },
	            trs_out = { trs: transition.out, index: 0 };

	        for (let i = 0; i < output_length; i++) output[i].index = i;

	        for (let i = 0; i < active_length; i++) {

	            const as = this.dom_scopes[i];

	            if (as.index > j) {
	                while (j < as.index && j < output_length) {
	                    const os = output[j];
	                    os.index = -1;
	                    trs_in.pos = getColumnRow(j, this.offset, this.shift_amount);

	                
	                    os.appendToDOM(this.ele, as.ele);
	                    os.transitionIn(Object.assign({},trs_in), (direction) ? "trs_asc_in" : "trs_dec_in");
	                    j++;
	                }
	            } else if (as.index < 0) {

	                trs_out.pos = getColumnRow(i, 0, this.shift_amount);
	                if (!NO_TRANSITION) {
	                    switch (as.index) {
	                        case -2:
	                        case -3:
	                            as.transitionOut(Object.assign({},trs_out), false, (direction > 0) ? "trs_asc_out" : "trs_dec_out");
	                            break;
	                        default:
	                            as.transitionOut(Object.assign({},trs_out));
	                    }
	                } else {
	                    as.transitionOut();
	                }

	                continue;
	            }
	            trs_in.pos = getColumnRow(j++, 0, this.shift_amount);

	            as.update({ arrange: Object.assign({},trs_out) }, null, false, { IMMEDIATE: true });

	            as._TRANSITION_STATE_ = true;
	            as.index = -1;
	        }

	        while (j < output.length) {
	            output[j].appendToDOM(this.ele);
	            output[j].index = -1;
	            trs_in.pos = getColumnRow(j, this.offset, this.shift_amount);
	            output[j].transitionIn(Object.assign({},trs_in), (direction) ? "arrange" : "arrange");

	            j++;
	        }

	        this.ele.style.position = this.ele.style.position;

	        this.dom_scopes = output.slice();

	        this.parent.update({
	            "template_count_changed": {

	                displayed: output_length,
	                offset: offset,
	                count: this.activeScopes.length,
	                pages: this.max,
	                ele: this.ele,
	                template: this,
	                trs: transition.in
	            }
	        });

	        if (OWN_TRANSITION) {
	            if (NO_TRANSITION)
	                return transition;
	            transition.play();
	        }

	        return transition;
	    }

	    /**
	     * Filters stored Scopes with search terms and outputs an array of passing Scops.
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
	            transition.play();
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

	            const sl = this.activeScopes.length;
	            
	            let trs = {trs:transition.out, pos:null};

	            for (let i = 0; i < sl; i++) {
	                trs.pos = getColumnRow(i, this.offset, this.shift_amount);
	                this.activeScopes[i].transitionOut(trs, true);
	            }

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
	                transition.play();

	        } else {

	            const
	                exists = new Map(new_items.map(e => [e, true])),
	                out = [];

	            for (let i = 0, l = this.activeScopes.length; i < l; i++)
	                if (exists.has(this.activeScopes[i].model))
	                    exists.set(this.activeScopes[i].model, false);


	            for (let i = 0, l = this.scopes.length; i < l; i++)
	                if (!exists.has(this.scopes[i].model)) {
	                    this.scopes[i].transitionOut(transition, true, "dismounting");
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
	                    Scope.transitionOut(transition, true);
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
	            const scope = this.component.mount(null, items[i], undefined, this.parent);

	            //TODO: Make sure both of there references are removed when the scope is destroyed.
	            this.scopes.push(scope);
	            //this.parent.addScope(scope);

	            scope.update({ loaded: true });
	        }



	        if (OWN_TRANSITION)
	            this.filterExpressionUpdate(transition);
	    }

	    revise() {
	        if (this.cache) this.update(this.cache);
	    }

	    down(data, changed_values) {
	        for (let i = 0, l = this.activeScopes.length; i < l; i++) this.activeScopes[i].down(data, changed_values);
	    }
	}

	ScopeContainer.prototype.removeIO = Tap.prototype.removeIO;
	ScopeContainer.prototype.addIO = Tap.prototype.addIO;

	class d$1 {

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
	    async mount(HTMLElement_, data_object, USE_SHADOW, parent_scope) {

	        if (this.READY !== true) {
	            if (!this.__pending)
	                this.__pending = [];

	            return new Promise(res => this.__pending.push([false, HTMLElement_, data_object, USE_SHADOW, parent_scope,  res]));
	        }

	        return this.nonAsyncMount(HTMLElement_, data_object, USE_SHADOW, parent_scope);
	    }

	    nonAsyncMount(HTMLElement_, data_object = null, USE_SHADOW, parent_scope = null) {
	        let element = HTMLElement_;

	        if (USE_SHADOW == undefined)
	            USE_SHADOW = this.ast.presets.options.USE_SHADOW;

	        if ((HTMLElement_ instanceof HTMLElement) && USE_SHADOW) {
	            //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

	            element = HTMLElement_.attachShadow({ mode: 'open' });
	        }
	        
	        const scope = this.ast.mount(element, parent_scope);

	        scope.load(data_object);

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
	    constructor(env,presets, tag, children, attribs) {

	        super(env,presets, "f", null, attribs);

	        this.type = 0;

	        for (const attr of this.attribs.values()) 
	            if (attr.value.setForContainer)
	                attr.value.setForContainer(presets);
	    }

	    mount(scope, container) {
	        for (const attr of this.attribs.values()){

	            if(attr.value instanceof Binding){
	                const io = attr.value.bind(scope, null, null, this);
	                io.bindToContainer(attr.name, container);
	                scope.ios.push(io);
	            }else{
	                const val  = parseFloat(attr.value) || 0;
	                switch(attr.name){
	                    case "limit":
	                        container.limit = val;
	                    break;
	                    case "scrub":
	                        container.scrub = val;
	                    break;
	                    case "shift":
	                        container.shift_amount = val;
	                    break;
	                }
	            }
	        }
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
	BaseComponent.prototype.stamp = d$1.prototype.nonAsyncStamp;

	class ctr extends ElementNode {
	    
	    constructor(env, presets, tag, children, attribs) {

	        super(env, presets, tag, children, attribs);
	        //Warn about any children that are css / script
	        if(children)
	        for(const child of children)
	            if(child.tag && (child.tag == "script" || child.tag == "style"))
	                console.warn(`Element of type <${child.tag}> will have no effect inside a <container> element`);

	        this.filters = null;
	        this.property_bind = null;
	        this.scope_children = null;

	        //Tag name of HTMLElement the container will create;
	        this.element = this.getAttribute("element") || "ul";
	        
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

	    merge(...d) {
	        const merged_node = super.merge(...d);
	        merged_node.filters = this.filters;
	        merged_node.nodes = this.filters;
	        merged_node.binds = this.binds;
	        merged_node.MERGED = true;
	        return merged_node;
	    }

	    mount(element, scope, presets, slots, pinned) {
	        
	        scope = scope || new Scope(null, presets, element, this);

	        //Only create a container if it is able to generate components. 
	        if(!this.component_constructor)
	            return scope;

	        const
	            ele = createElement(this.element),
	            container = new ScopeContainer(scope, presets, ele);

	        appendChild(element, ele);

	        this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

	        if(this.component_constructor)
	            container.component = this.component_constructor;

	        for (const fltr of this.filters)
	            fltr.mount(scope, container);
	        
	        for (const attr of this.attribs.values())
	            attr.bind(ele, scope, pinned);

	        if (this.binds.length > 0) {
	            for (const bind of this.binds)
	                bind.mount(null, scope, presets, slots, pinned, container);
	        }else{ 
	            //If there is no binding, then there is no potential to have a data array host generate components.
	            //Instead, load any existing children as component entries for the container element. 
	            for (const node of this.nodes)
	                container.scopes.push(node.mount(null, null, presets, slots));
	            container.filterUpdate();
	            container.render();
	        }

	        return scope;
	    }
	}

	class sty extends ElementNode{
		constructor(env, presets, tag, children, attribs){
			super(env, presets,  "style", children, attribs);	
		}

		get data(){return this.children[0]}

		finalize(){return this}

		render(){}

		mount(element, scope, presets){

			if(presets.options.USE_SHADOWED_STYLE){

				const own_element = this.createElement(scope);

				own_element.innerHTML = this.data.toString();

				appendChild(element, own_element);
			}

			else
				scope.css.push(this.data);
		}
	}

	class v extends ElementNode{
		constructor(env, tag, children, attribs, presets){
			super(env, tag, children, attribs, presets);
		}
	}

	/* Converts all child nodes createElement function to the svg version to make sure Elements are created within the svg namespace*/
	function convertNameSpace(nodes = []){
		for(const node of nodes){
			node.createElement = svg.prototype.createElement;
			convertNameSpace(node.children);
		}
	}

	class svg extends ElementNode{

		constructor(env, tag, children, attribs, presets){
			super(env, tag, children, attribs, presets);
			if(children)
			convertNameSpace(children);
		}


		createElement(){
			return document.createElementNS("http://www.w3.org/2000/svg", this.tag);
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

	class NonBinding extends ElementNode{
		mount(element, scope, presets, slots, pinned, RETURN_ELEMENT = false) {

			let ele = null;
			if (!scope){
	            scope = new Scope(null, presets || this.presets, null, this);
	            ele = super.mount(element, scope, presets, slots, pinned, true);
	            scope.ele = ele;
			}else
				ele = super.mount(element, scope, presets, slots, pinned, true);

	        ele.innerHTML = this.innerToString();

	        return (RETURN_ELEMENT) ? ele : scope;
	    }
	}

	class Import extends ElementNode{

		constructor(env,presets, tag, children, attribs){
			super(env,presets, "import", null, attribs);
		}
		
		loadAST(){/*intentional*/return}
			
		loadURL(){/*intentional*/return}
	}

	// Houses handlers for all plugins 
	// Makes the `plugin` funciton of the handler available, which can be accessed by calling Plugin.*plugin.name* 
	// e.g Plugin({name:"newPlugin"}) ...> Plugin.newPlugin(...)
	const p = new Map();

	class PluginRunner {
		constructor() {
			this.plugins = new Map();
			this.boundRun = this.run.bind(this);
			this.boundSet = this.set.bind(this);
		}

		run(...data) {
			if (id == null)
				for (const plugin of this.plugins.values())
					plugin.run(...data);
			else
			if (this.plugins.has(id))
				return this.plugins.get(id).run(...data);
		}

		set(id, fn) {
			this.plugins.set(id, { run: (...d) => fn(...d) });
		}
	}

	function register(name) {
		const r = new PluginRunner(name);

		p.set(name, new Proxy(r, {
			get(target, prop) {

				if (prop == "set")
					return target.boundSet;

				if (prop == "run")
					return target.boundRun;

				if (prop == "plugins")
					return target.plugins;

				if (target.plugins.has(prop))
					return target.plugins.get(prop);
			}
		}));

		return p.get(name);
	}

	const plugins = function(plugin, plugin_id, fn) {
		if (p.has(plugin))
			p.get(plugin).set(plugin_id, fn);
	};

	register("kludge_plugin");

	var plugin = new Proxy(plugins, {
		get(target, prop) {
			if (prop == "register")
				return register;
			else if (p.has(prop))
				return prop;
			else return "kludge_plugin";
		}
	});

	const node_constructors = {
	    element: ElementNode,
	    script: ScriptNode,
	    scope: scp,
	    link: a,
	    container: ctr,
	    style: sty,
	    void: v,
	    svg: svg,
	    slot: slt,
	    nonbinding: NonBinding,
	    filter: fltr,
	    import: Import,
	    text: TextNode,
	    whind,
	    compile: wick_compile
	};

	const plugin_element = plugin.register("element");

	function es(tag, attribs, children, env, lex, meta = 0) {

	    const
	        FULL = !!children;

	    attribs = attribs || [];
	    children = (Array.isArray(children)) ? children : children ? [children] : [];

	    const presets = env.presets;

	    let node = null,
	        Constructor = null,
	        USE_PENDING_LOAD = "";

	    switch (tag) {
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
	        case "wc":
	        case "container":
	            Constructor = ctr;
	            break;
	        case "ws":
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
	        case "textarea":
	            Constructor = NonBinding;
	            break;
	        case "img":
	            USE_PENDING_LOAD = "src";
	            /* intentional */
	        case "code":
	        default:
	            Constructor = ElementNode;
	            break;
	    }

	    node = new Constructor(env, presets, tag, children, attribs, USE_PENDING_LOAD);

	    if (plugin_element[tag])
	        node = plugin_element[tag].run(node, lex, env, node_constructors) || node;

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

	            if (this.name == "value" && (tag == "select" || tag == "input" || tag == "textarea"))
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
	                //Binding sends value over. 
	                const bind = this.value.bind(scope, element, pinned);
	                const io = new this.io_constr(scope, this, bind.main, this.name, element, bind.alt);
	                scope.ios.push(io);
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
			return types.identifier;
		}

		get val() { return "wickNodeExpression" }

		render(){
			return `wickNodeExpression(this,"${this._id}")`;
		}
	}

	//*

	const env = {
	    table: {},
	    ASI: true,
	    functions: {
	        //HTML
	        element_selector: es,
	        attribute: Attribute,
	        wick_binding: Binding,
	        text: TextNode,
	        js_wick_node: js_wick_node,

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
	        parseDeclaration: parseDeclaration$1,
	        stylesheet,
	        stylerule,
	        ruleset,

	        //*        //JS
	        super_literal,
	        lexical_expression,
	        add_expression,
	        and_expression,
	        argument_list,
	        array_literal,
	        for_of_statement,
	        arrow: arrow_function_declaration,
	        arrow_function_declaration,
	        assignment_expression,
	        await_expression,
	        binding,
	        bit_and_expression: bitwise_and_espression,
	        bit_or_expression: bitwise_or_espression,
	        bit_xor_expression: bitwise_xor_espression,
	        block_statement,
	        bool_literal,
	        break_statement,
	        call_expression,
	        case_statement,
	        catch_statement,
	        class_declaration,
	        class_method,
	        condition_expression,
	        continue_statement,
	        debugger_statement,
	        default_case_statement,
	        default_import,
	        delete_expression,
	        divide_expression,
	        empty_statement,
	        equality_expression,
	        exponent_expression: equality_expression$1,
	        export_clause,
	        export_declaration,
	        export_specifier,
	        expression_list,
	        expression_statement,
	        for_statement,
	        function_declaration,
	        identifier: identifier$1,
	        if_statement,
	        import_clause,
	        import_declaration,
	        import_specifier,
	        in_expression,
	        instanceof_expression,
	        label_statement,
	        left_shift_expression,
	        lexical: lexical_declaration,
	        member_expression,
	        module,
	        modulo_expression,
	        multiply_expression,
	        name_space_import,
	        named_imports,
	        negate_expression,
	        new_expression,
	        null_literal,
	        numeric_literal,
	        object_literal,
	        for_in_statement,
	        or_expression,
	        parenthasized: argument_list$1,
	        plus_expression,
	        post_decrement_expression,
	        post_increment_expression,
	        pre_decrement_expression,
	        pre_increment_expression,
	        property_binding,
	        return_statement,
	        right_shift_expression,
	        right_shift_fill_expression,
	        script,
	        spread_element,
	        statements,
	        string: string$1,
	        string_literal: string$1,
	        subtract_expression,
	        switch_statement,
	        template,
	        template_head,
	        template_middle,
	        template_tail,
	        this_literal,
	        throw_statement,
	        try_statement,
	        typeof_expression,
	        unary_not_expression,
	        unary_or_expression,
	        unary_xor_expression,
	        variable_statement: variable_declaration,
	        void_expression,
	        //*/
	        
	        while_stmt: function(sym) {
	            this.bool = sym[1];
	            this.body = sym[3];
	        },

	        var_stmt: function(sym) { this.declarations = sym[1]; },

	        label_stmt: function(sym) {
	            this.label = sym[0];
	            this.stmt = sym[1];
	        },

	        eofError(tk, env, output, lex, prv_lex, ss, lu){
	            //Unexpected End of Input
	            env.addParseError("Unexpected end of input", lex, env.url);
	        },

	        generalError(tk, env, output, lex, prv_lex, ss, lu){
	            //Unexpected value
	            env.addParseError(`Unexpected token [${tk}]`, lex, env.url);
	        },

	        defaultError: (tk, env, output, lex, prv_lex, ss, lu) => {

	            

	            if (lex.tx == "//" || lex.tx == "/*") {
	                if (lex.tx == "//") {
	                    while (!lex.END && lex.ty !== lex.types.nl)
	                        lex.next();
	                } else
	                if (lex.tx == "/*") {
	                    while (!lex.END && (lex.tx !== "*" || lex.pk.tx !== "/"))
	                        lex.next();
	                    lex.next(); //"*"
	                }

	                return lu(lex.next());
	            }

	            /*USED for ASI*/
	            if (env.ASI && lex.tx !== ")" && !lex.END) {

	                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

	                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
	                    prv_lex.next();
	                    if (prv_lex.ty == prv_lex.types.nl)
	                        ENCOUNTERED_END_CHAR = true;
	                }

	                if (lex.tx == "</") // As in "<script> script body => (</)script>"
	                {
	                    lex.tl = 0;
	                    return lu({ tx: ";" });
	                }

	                if (ENCOUNTERED_END_CHAR) {
	                    lex.tl = 0;
	                    return lu({ tx: ";" });
	                }
	            }

	            if(lex.ty == lex.types.sym && lex.tx.length > 1){
	                //Try splitting up the symbol
	                lex.tl = 0;
	                lex.next(lex, false);
	                return lu(lex);
	            }

	            if (lex.END) {
	                lex.tl = 0;
	                return lu({ tx: ";" });
	            }
	        }
	    },

	    prst: [],
	    pushPresets(prst) {
	        env.prst.push(prst);
	    },
	    popPresets() {
	        return env.prst.pop();
	    },
	    get presets() {
	        return env.prst[env.prst.length - 1] || null;
	    },

	    options: {
	        integrate: false,
	        onstart: () => {
	            env.table = {};
	            env.ASI = true;
	        }
	    }
	};

	function processJSComponent(url){
	    const stmts = ast.statements;

	    //Find import and export statements and remove from them AST. Replace with there children
	    let REPLACE = null;

	    for(const node of ast.traverseDepthFirst()){
	        
	        if(REPLACE) 
	        	REPLACE(node);

	        if(node.type == types.export_declaration)
	        	REPLACE = (n)=>(node.replace(n), REPLACE = null);
	    }

	    //Extract the template string from the classes. Use the wick compiler to turn this into a component ast. 

	    //The Classes 

	}

	class ErrorNode extends ElementNode {

		constructor(env) {
			super(env, env.presets, "error");
			this.env = env;
		}

		finalize() {
			return this;
		}

		createElement(){
			const div = document.createElement("div");

			div.innerHTML = this.env.errors.map(e=>e.msg.replace(/\ /g, "&nbsp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>") + "").join("<br/>");

			div.classList.add("wick-error");

			return div;
		}
	}

	const

	    default_presets = new P,

	    compile = async function(component_data, presets, component_env) {

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
	                    const first_char = component_data[0];
	                    var url, IS_POTENTIAL_URL = (
	                        (first_char !== "<" &&
	                            first_char !== " ") || (
	                            first_char == "/" ||
	                            first_char == "."
	                        )
	                    );
	                    //Not sure if the string is a URL, but we can try fetching as a resource, and suppress erros if it comes up short.
	                    if (IS_POTENTIAL_URL && (url = URL$1.resolveRelative(component_data))) {

	                        try {
	                            if (url.ext == "mjs" || url.ext == "js") {

	                                const module = await import(url + "");

	                                let comp = null;

	                                if (module.default)
	                                    comp = await (new module.default(presets).pending);

	                                return comp;
	                            }

	                            string_data = await url.fetchText();

	                            component_env.url = url;

	                        } catch (e) {
	                            console.log(e);
	                        }
	                    }
	                    break;

	                case "object":
	                    if (component_data instanceof URL$1) {
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


	            try {

	                component_env.incrementPendingLoads();

	                const output = wick_compile(whind(string_data), component_env);

	                if (output.error){
	                    if(presets.options.THROW_ON_ERRORS)
	                        component_env.throw();

	                    ast = new ErrorNode(component_env);
	                }
	                else
	                    ast = output.result;


	                if (ast instanceof module)
	                    ast = processJSComponent(ast);

	                component_env.resolve();

	                await component_env.pending;


	                return ast;

	            } catch (e) {
	                throw error(error.COMPONENT_PARSE_FAILURE, e, component_env);
	            }
	        },


	        // This is a variadic function that accepts objects, string, and urls, 
	        //  and compiles data from the argument sources into a wick component. 

	        Component = function(...data) {

	            // The presets object provides global values to this component
	            // and all its derivatives and descendents. 
	            let presets = default_presets;

	            if (data.length > 1)
	                presets = (data[1] instanceof P) ? data[1] : new P(data[1]);

	            if (data.length === 0)
	                throw new Error("This function requires arguments. Please refer to wick docs on what arguments may be passed to this function.");

	            const component_data = data[0];

	            // If this function is an operand of the new operator, run an alternative 
	            // compiler on the calling object.
	            if (new.target) {

	                this.ast = null;

	                this.READY = false;

	                this.presets = data[1] || default_presets;

	                //Reference to the component name. Used with the Web Component API
	                this.name = "";

	                this.pending = ((async () => {
	                    var obj;

	                    const
	                        component_env = new ComponentEnvironment(presets, env),
	                        return_obj = this;

	                    try {
	                        obj = await compile(component_data, presets, component_env);
	                    } catch (e) {
	                        throw (e)
	                    }

	                    if (obj instanceof d$1) {

	                        this.ast = obj.ast;

	                        if (!this.name)
	                            this.name = obj.name;

	                        integrate(this, this, presets, component_env);

	                    } else {

	                        const ast = obj;

	                        if (!ast.finalize)
	                            throw error(error.COMPONENT_PARSE_FAILURE, new Error("Component blueprint is not html"), component_env);

	                        const constructor_name = this.constructor.name;

	                        if (constructor_name !== "default" || constructor_name !== "Anonymous")
	                            presets.components[constructor_name] = ast;

	                        this.ast = ast;
	                        this.ast.finalize();

	                        if (!this.name)
	                            this.name = this.ast.getAttribObject("component").value || "undefined-component";

	                        integrate(this, this, presets, component_env);
	                    }

	                    this.READY = true;

	                    if (this.__pending) {
	                        this.__pending.forEach(e => e[0] ? e[4](this.stamp(...e.slice(1, 4))) : e[5](this.mount(...e.slice(1, 5))));
	                        this.__pending = null;
	                    }

	                    return (return_obj);
	                })());



	            } else
	                return new Component(...data);
	        },

	        // If compilation fails, failure component is generated that provides 
	        // error information. Should be fancy though.
	        integrate = function(this_obj, from_obj = this_obj, presets, component_env) {

	            if (this_obj.ast && from_obj.constructor.prototype !== Component.prototype) {

	                //Go through prototype chain and extract functions that have names starting with $. Add them to the ast.

	                for (const a of Object.getOwnPropertyNames(from_obj.constructor.prototype)) {
	                    if (a == "constructor") continue;

	                    const r = from_obj.constructor.prototype[a];

	                    if (typeof r == "function") {

	                        //extract and process function information. 

	                        const
	                            js_ast = wick_compile(whind("function " + r.toString().trim() + ";"), env),
	                            func_ast = JS.getFirst(js_ast, types.function_declaration),
	                            binding = new Binding(func_ast.id, undefined, component_env, whind("whin")),
	                            attrib = new Attribute(["on", null, binding], presets),
	                            stmt = func_ast.body;

	                        const script = new ScriptNode({}, "script", [stmt], [attrib], presets);

	                        script.finalize();

	                        this_obj.ast.children.push(script);
	                    }
	                }
	            }
	        };

	Component.prototype = d$1.prototype;


	Component.toString = function() {
	    return `
 
      / _|        | |  | |_   _/  __ \\| | / /
  ___| |___      _| |  | | | | | /  \\/| |/ / 
 / __|  _\\ \\ /\\ / / |/\\| | | | | |    |    \\ 
| (__| |  \\ V  V /\\  /\\  /_| |_| \\__/\\| |\\  \\
 \\___|_|   \\_/\\_(_)\\/  \\/ \\___/ \\____/\\_| \\_/


2020 v0.8.11

Copyright (c) MMXX Anthony C Weathersby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

logo courtesy of http://patorjk.com/software/taag

Font:
DOOM by Frans P. de Vries <fpv@xymph.iaf.nl>  18 Jun 1996
based on Big by Glenn Chappell 4/93 -- based on Standard
figlet release 2.1 -- 12 Aug 1994
Permission is hereby given to modify this font, as long as the
modifier's name is placed on a comment line.`;
	};

	const wick = Component;

	wick.presets = d=>new P(d);

	wick.astCompiler = (string) => wick_compile(whind(string), env);

	wick.compiler_environment = env;

	wick.plugin = plugin;

	P.default_custom = {
		wick, glow: Animation, URL: URL$1
	};

	return wick;

}());
